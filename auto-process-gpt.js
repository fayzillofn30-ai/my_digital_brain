const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error("Xatolik: Email manzil kiritilmadi.");
    console.error("Foydalanish: node auto-process-gpt.js <email>");
    process.exit(1);
}

const email = args[0];
const downloadsDir = path.join(require('os').homedir(), 'Downloads');
const archiveDir = path.join(__dirname, 'ai-chat-history', 'archive_zips_gpt');

if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
}

// Downloads papkasidagi barcha zip fayllarni o'qish
let zipFiles;
try {
    zipFiles = fs.readdirSync(downloadsDir)
        .filter(file => file.toLowerCase().endsWith('.zip'))
        .filter(file => {
            const fullPath = path.join(downloadsDir, file);
            return fs.statSync(fullPath).isFile();
        })
        .map(file => {
            const fullPath = path.join(downloadsDir, file);
            return {
                name: file,
                path: fullPath,
                time: fs.statSync(fullPath).mtime.getTime()
            };
        });
} catch (e) {
    console.error("Downloads papkasini o'qishda xatolik:", e.message);
    process.exit(1);
}

if (zipFiles.length === 0) {
    console.error(`"${downloadsDir}" papkasida hech qanday .zip fayl topilmadi! Oldin Export faylni yuklab oling.`);
    process.exit(1);
}

zipFiles.sort((a, b) => b.time - a.time);
const latestZip = zipFiles[0];

console.log(`Eng yangi yuklangan fayl topildi: ${latestZip.name}`);
console.log(`ChatGPT tarixi tahlil qilinmoqda... Email: ${email}`);

// Smart masking
const [name, domain] = email.split('@');
let maskLen;
if (name.length <= 4) {
    maskLen = 1;
} else if (name.length <= 8) {
    maskLen = name.length - 4;
} else {
    maskLen = Math.floor(name.length * 0.4);
}
const startLen = Math.floor((name.length - maskLen) / 2);
const endLen = name.length - startLen - maskLen;
const maskedName = name.substring(0, startLen) + '*'.repeat(maskLen) + name.substring(name.length - endLen);
const maskedEmail = `${maskedName}@${domain}`;

console.log(`Masklangan email: ${maskedEmail}`);

const outputDir = path.join(__dirname, 'ai-chat-history', 'chatgpt', maskedEmail);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const tempDir = path.join(__dirname, 'temp_gpt_unzip_' + Date.now());
fs.mkdirSync(tempDir, { recursive: true });

try {
    execSync(`unzip -q "${latestZip.path}" -d "${tempDir}"`);
} catch (e) {
    console.error("Zipni ochishda xatolik yuz berdi!", e.message);
    process.exit(1);
}

const jsonPath = path.join(tempDir, 'conversations.json');
if (!fs.existsSync(jsonPath)) {
    console.error("Xatolik: Zip ichida 'conversations.json' topilmadi. Bu ChatGPT rasmiy export fayli bo'lmasligi mumkin.");
    fs.rmSync(tempDir, { recursive: true, force: true });
    process.exit(1);
}

const rawData = fs.readFileSync(jsonPath, 'utf8');
const conversations = JSON.parse(rawData);
let parsedCount = 0;

conversations.forEach((conv, index) => {
    let title = conv.title || `Chat-${index + 1}`;
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
    const filePath = path.join(outputDir, `${safeTitle}.md`);
    
    let mdContent = `# ${title}\n\n`;
    
    // Asosiy suhbat tarmog'ini topish (current_node dan orqaga)
    let currentNodeId = conv.current_node;
    const messages = [];
    
    while (currentNodeId && conv.mapping[currentNodeId]) {
        const node = conv.mapping[currentNodeId];
        if (node.message && node.message.author && node.message.content) {
            messages.push(node.message);
        }
        currentNodeId = node.parent;
    }
    
    // Teskari tartiblash (chunki orqaga qarab yig'dik)
    messages.reverse();
    
    messages.forEach(msg => {
        const role = msg.author.role;
        if (role === 'user' || role === 'assistant') {
            const displayName = role === 'user' ? '👤 Foydalanuvchi' : '🤖 ChatGPT';
            let text = '';
            if (msg.content.parts) {
                text = msg.content.parts.join('\n');
            } else if (msg.content.text) {
                text = msg.content.text; // ba'zi yangi formatlar uchun
            }
            
            if (text.trim().length > 0) {
                mdContent += `### ${displayName}:\n\n${text}\n\n`;
                if (role === 'assistant') mdContent += `---\n\n`;
            }
        }
    });
    
    if (messages.length > 0) {
        fs.writeFileSync(filePath, mdContent, 'utf8');
        parsedCount++;
    }
});

console.log(`\n${parsedCount} ta chat mavaffaqiyatli .md ga o'tkazildi va ${outputDir} ga saqlandi.`);

// Cleanup
fs.rmSync(tempDir, { recursive: true, force: true });

// Move to archive
const destPath = path.join(archiveDir, latestZip.name);
try {
    fs.renameSync(latestZip.path, destPath);
    console.log(`✅ Muvaffaqiyatli! Zip fayl arxivlandi: ${destPath}`);
} catch (e) {
    console.error(`Zip faylni arxivga o'tkazishda xatolik: ${e.message}`);
}
