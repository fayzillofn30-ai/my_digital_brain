const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error("Xatolik: Email manzil kiritilmadi.");
    console.error("Foydalanish: node auto-process-gpt-ext.js <email>");
    process.exit(1);
}

const email = args[0];
const downloadsDir = path.join(require('os').homedir(), 'Downloads');
const archiveDir = path.join(__dirname, 'ai-chat-history', 'archive_zips_gpt');

if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
}

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
            return { name: file, path: fullPath, time: fs.statSync(fullPath).mtime.getTime() };
        });
} catch (e) {
    console.error("Downloads papkasini o'qishda xatolik:", e.message);
    process.exit(1);
}

if (zipFiles.length === 0) {
    console.error(`"${downloadsDir}" papkasida hech qanday .zip fayl topilmadi!`);
    process.exit(1);
}

zipFiles.sort((a, b) => b.time - a.time);
const latestZip = zipFiles[0];

console.log(`Eng yangi yuklangan fayl topildi: ${latestZip.name}`);
console.log(`Tahlil qilinmoqda (Extension usuli)... Email: ${email}`);

const [name, domain] = email.split('@');
let maskLen;
if (name.length <= 4) maskLen = 1;
else if (name.length <= 8) maskLen = name.length - 4;
else maskLen = Math.floor(name.length * 0.4);

const startLen = Math.floor((name.length - maskLen) / 2);
const endLen = name.length - startLen - maskLen;
const maskedName = name.substring(0, startLen) + '*'.repeat(maskLen) + name.substring(name.length - endLen);
const maskedEmail = `${maskedName}@${domain}`;

console.log(`Masklangan email: ${maskedEmail}`);

const outputDir = path.join(__dirname, 'ai-chat-history', 'chatgpt', maskedEmail);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const tempDir = path.join(__dirname, 'temp_gpt_ext_unzip_' + Date.now());
fs.mkdirSync(tempDir, { recursive: true });

try {
    execSync(`unzip -q "${latestZip.path}" -d "${tempDir}"`);
} catch (e) {
    console.error("Zipni ochishda xatolik yuz berdi!", e.message);
    process.exit(1);
}

try {
    const parseCmd = `node parse-gpt-chats.js "${tempDir}" "${outputDir}"`;
    console.log(`Bajarilmoqda: ${parseCmd}`);
    execSync(parseCmd, { stdio: 'inherit' });
} catch (e) {
    console.error("Tahlil qilishda (parse-gpt-chats.js) xatolik yuz berdi!");
}

fs.rmSync(tempDir, { recursive: true, force: true });

const destPath = path.join(archiveDir, latestZip.name);
try {
    fs.renameSync(latestZip.path, destPath);
    console.log(`\n✅ Muvaffaqiyatli! Zip fayl arxivlandi: ${destPath}`);
} catch (e) {
    console.error(`Zip faylni arxivga o'tkazishda xatolik: ${e.message}`);
}
