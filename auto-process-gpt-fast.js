const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error("Xatolik: Email manzil kiritilmadi.");
    console.error("Foydalanish: node auto-process-gpt-fast.js <email>");
    process.exit(1);
}

const email = args[0];
const downloadsDir = path.join(require('os').homedir(), 'Downloads');

// Eng yangi json faylni topish
let jsonFiles;
try {
    jsonFiles = fs.readdirSync(downloadsDir)
        .filter(f => f.startsWith('chatgpt-fast-export-') && f.endsWith('.json'))
        .map(f => ({
            name: f,
            path: path.join(downloadsDir, f),
            time: fs.statSync(path.join(downloadsDir, f)).mtime.getTime()
        }));
} catch (e) {
    console.error("Downloads papkasini o'qishda xatolik:", e.message);
    process.exit(1);
}

if (jsonFiles.length === 0) {
    console.error(`Downloads papkasida "chatgpt-fast-export-..." JSON fayli topilmadi!`);
    process.exit(1);
}

jsonFiles.sort((a, b) => b.time - a.time);
const latestJson = jsonFiles[0];

console.log(`Eng yangi yuklangan fayl topildi: ${latestJson.name}`);

// Mask email
const [name, domain] = email.split('@');
let maskLen;
if (name.length <= 4) maskLen = 1;
else if (name.length <= 8) maskLen = name.length - 4;
else maskLen = Math.floor(name.length * 0.4);

const startLen = Math.floor((name.length - maskLen) / 2);
const endLen = name.length - startLen - maskLen;
const maskedName = name.substring(0, startLen) + '*'.repeat(maskLen) + name.substring(name.length - endLen);
const maskedEmail = `${maskedName}@${domain}`;

const outputDir = path.join(__dirname, 'ai-chat-history', 'chatgpt', maskedEmail);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const archiveDir = path.join(__dirname, 'ai-chat-history', 'archive_zips_gpt');
if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });

// Parse JSON
const rawData = fs.readFileSync(latestJson.path, 'utf8');
const conversations = JSON.parse(rawData);
let parsedCount = 0;

conversations.forEach((conv, index) => {
    let title = conv.title || `Chat-${index + 1}`;
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
    const filePath = path.join(outputDir, `${safeTitle}.md`);
    
    let mdContent = `# ${title}\n\n`;
    let currentNodeId = conv.current_node;
    const messages = [];
    
    while (currentNodeId && conv.mapping[currentNodeId]) {
        const node = conv.mapping[currentNodeId];
        if (node.message && node.message.author && node.message.content) {
            messages.push(node.message);
        }
        currentNodeId = node.parent;
    }
    
    messages.reverse();
    
    messages.forEach(msg => {
        const role = msg.author.role;
        if (role === 'user' || role === 'assistant') {
            const displayName = role === 'user' ? '👤 Foydalanuvchi' : '🤖 ChatGPT';
            let text = '';
            if (msg.content.parts) {
                text = msg.content.parts.join('\n');
            } else if (msg.content.text) {
                text = msg.content.text;
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

console.log(`\n✅ ${parsedCount} ta chat mavaffaqiyatli .md ga o'tkazildi va ${outputDir} ga saqlandi.`);

// Move json to archive
const destPath = path.join(archiveDir, latestJson.name);
try {
    fs.renameSync(latestJson.path, destPath);
    console.log(`Fayl arxivlandi: ${destPath}`);
} catch (e) {
    console.error(`Faylni arxivga o'tkazishda xatolik: ${e.message}`);
}
