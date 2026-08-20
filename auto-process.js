const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error("Xatolik: Email manzil kiritilmadi.");
    console.error("Foydalanish: node auto-process.js <email>");
    process.exit(1);
}

const email = args[0];
const downloadsDir = path.join(require('os').homedir(), 'Downloads');
const archiveDir = path.join(__dirname, 'ai-chat-history', 'archive_zips');

if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
}

// Downloads papkasidagi faqat fayl bo'lgan (papka bo'lmagan) zip fayllarni o'qish
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
    console.error(`"${downloadsDir}" papkasida hech qanday .zip fayl topilmadi! Oldin Kengaytma orqali yuklab oling.`);
    process.exit(1);
}

// Eng yangi zip faylni topish
zipFiles.sort((a, b) => b.time - a.time);
const latestZip = zipFiles[0];

console.log(`Eng yangi yuklangan fayl topildi: ${latestZip.name}`);
console.log(`Tahlil qilinmoqda... Email: ${email}`);

// parse-chats.js ni ishga tushirish
try {
    const parseCmd = `node parse-chats.js "${latestZip.path}" "${email}"`;
    console.log(`Bajarilmoqda: ${parseCmd}`);
    execSync(parseCmd, { stdio: 'inherit' }); // natijalarni terminalda to'g'ridan to'g'ri ko'rsatish
} catch (e) {
    console.error("Tahlil qilishda (parse-chats.js) xatolik yuz berdi!");
    process.exit(1);
}

// Muvaffaqiyatli tahlildan so'ng zipni arxivga o'tkazish
const destPath = path.join(archiveDir, latestZip.name);
try {
    fs.renameSync(latestZip.path, destPath);
    console.log(`\n✅ Muvaffaqiyatli! Zip fayl arxivlandi: ${destPath}`);
} catch (e) {
    console.error(`Zip faylni arxivga o'tkazishda xatolik (lekin tahlil ishladi): ${e.message}`);
}
