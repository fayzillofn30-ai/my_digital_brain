const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { execSync } = require('child_process');

// Argumentlar: node parse-chats.js <zip_file> <email>
const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Foydalanish: node parse-chats.js <zip_fayl_y'oli> <email>");
    process.exit(1);
}

const zipFile = args[0];
const email = args[1];

// Smart masking: email uzunligiga qarab foiz tanlanadi
const [name, domain] = email.split('@');
let maskLen;
if (name.length <= 4) {
    maskLen = 1; // kalta nomlar uchun 1 ta belgi
} else if (name.length <= 8) {
    maskLen = name.length - 4; // masalan aliuser (7) -> boshi 2, oxiri 2 = 3 ta maska
} else {
    maskLen = Math.floor(name.length * 0.4); // uzunlari uchun 40%
}
const startLen = Math.floor((name.length - maskLen) / 2);
const endLen = name.length - startLen - maskLen;
const maskedName = name.substring(0, startLen) + '*'.repeat(maskLen) + name.substring(name.length - endLen);
const maskedEmail = `${maskedName}@${domain}`;

console.log(`Masklangan email: ${maskedEmail}`);

const outputDir = path.join('ai-chat-history', 'claude', maskedEmail);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Unzip
const tempDir = path.join(__dirname, 'temp_unzip_' + Date.now());
fs.mkdirSync(tempDir, { recursive: true });
console.log(`Ziplangan fayl ochilmoqda: ${zipFile}`);
try {
    execSync(`unzip -q "${zipFile}" -d "${tempDir}"`);
} catch (e) {
    console.error("Zipni ochishda xatolik yuz berdi!", e.message);
    process.exit(1);
}

const htmlDir = path.join(tempDir, 'pages');
if (!fs.existsSync(htmlDir)) {
    console.error("Zip ichida 'pages' papkasi topilmadi. Ehtimol tuzilishi boshqacha.");
    // try current dir
}

let files = [];
if (fs.existsSync(htmlDir)) {
    files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
} else {
    // Agar pages papkasi bo'lmasa, demak faqat bitta chat (index.html) yuklangan
    files = fs.readdirSync(tempDir).filter(f => f.endsWith('.html'));
    if (files.length === 0) {
        console.error("Hech qanday HTML fayl topilmadi.");
        process.exit(1);
    }
}

let parsedCount = 0;
files.forEach((file, index) => {
    const html = fs.readFileSync(path.join(fs.existsSync(htmlDir)? htmlDir : tempDir, file), 'utf8');
    const $ = cheerio.load(html);
    
    let title = $('title').text().replace(' - Claude', '').trim();
    if (!title) title = `Chat-${index+1}`;
    
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
    const fileName = `${safeTitle}.md`;
    const filePath = path.join(outputDir, fileName);
    
    let mdContent = `# ${title}\n\n`;
    
    $('h2.sr-only').each((i, el) => {
        const h2Text = $(el).text();
        
        if (h2Text.startsWith('You said:')) {
            mdContent += `### 👤 Foydalanuvchi:\n\n`;
            let content = $(el).next('div').text().trim();
            if (!content) {
                content = h2Text.replace('You said:', '').trim();
            }
            content = content.replace(/\s+/g, ' ');
            mdContent += `${content}\n\n`;
        } else if (h2Text.startsWith('Claude responded:') || h2Text.startsWith('Claude (model) responded:')) {
            mdContent += `### 🤖 Claude:\n\n`;
            const nextDiv = $(el).next('div');
            nextDiv.find('p, div, br').append('\n');
            let content = nextDiv.text().trim();
            content = content.replace(/\n{3,}/g, '\n\n');
            mdContent += `${content}\n\n`;
            mdContent += `---\n\n`;
        }
    });
    
    fs.writeFileSync(filePath, mdContent, 'utf8');
    parsedCount++;
});

console.log(`${parsedCount} ta chat mavaffaqiyatli .md ga o'tkazildi va ${outputDir} ga saqlandi.`);

// Cleanup
fs.rmSync(tempDir, { recursive: true, force: true });
console.log("Vaqtinchalik papkalar tozalandi.");
