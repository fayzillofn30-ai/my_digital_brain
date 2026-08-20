const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Foydalanish: node parse-gpt-chats.js <tempDir> <outputDir>");
    process.exit(1);
}

const tempDir = args[0];
const outputDir = args[1];

let filesToProcess = [];

// Barcha HTML fayllarni yig'ish (root dagi index.html va pages/ ichidagi barchasi)
const rootFiles = fs.readdirSync(tempDir).filter(f => f.endsWith('.html')).map(f => path.join(tempDir, f));
filesToProcess = filesToProcess.concat(rootFiles);

const pagesDir = path.join(tempDir, 'pages');
if (fs.existsSync(pagesDir)) {
    const pagesFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html')).map(f => path.join(pagesDir, f));
    filesToProcess = filesToProcess.concat(pagesFiles);
}

if (filesToProcess.length === 0) {
    console.error("Hech qanday HTML fayl topilmadi.");
    process.exit(1);
}

let parsedCount = 0;

filesToProcess.forEach((filePath, index) => {
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);
    
    // GPT chatligini tekshirish filtri
    const isChat = $('h4.sr-only:contains("said:")').length > 0 || $('h4.sr-only:contains("You said")').length > 0;
    if (!isChat) {
        // Bu fayl chat emas (sozlamalar, explore page yoki shell)
        return;
    }
    
    let title = $('title').text().replace(' - ChatGPT', '').trim();
    if (!title || title === 'ChatGPT') title = `ChatGPT-Chat-${parsedCount + 1}`;
    
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
    let fileName = `${safeTitle}.md`;
    let outPath = path.join(outputDir, fileName);
    
    // Agar fayl nomi takrorlansa (masalan bir nechta 'ChatGPT.md' bo'lsa)
    let counter = 1;
    while(fs.existsSync(outPath)) {
        fileName = `${safeTitle}_${counter}.md`;
        outPath = path.join(outputDir, fileName);
        counter++;
    }
    
    let mdContent = `# ${title}\n\n`;
    
    $('h4.sr-only').each((i, el) => {
        const h4Text = $(el).text().trim();
        
        if (h4Text.startsWith('You said:')) {
            mdContent += `### 👤 Foydalanuvchi:\n\n`;
            let content = $(el).next('div').text().trim();
            if (!content) content = h4Text.replace('You said:', '').trim();
            content = content.replace(/\s+/g, ' ');
            if (content) mdContent += `${content}\n\n`;
        } else if (h4Text.startsWith('ChatGPT said:')) {
            mdContent += `### 🤖 ChatGPT:\n\n`;
            const nextDiv = $(el).next('div');
            nextDiv.find('p, div, br').append('\n');
            let content = nextDiv.text().trim();
            content = content.replace(/\n{3,}/g, '\n\n');
            mdContent += `${content}\n\n`;
            mdContent += `---\n\n`;
        }
    });
    
    fs.writeFileSync(outPath, mdContent, 'utf8');
    parsedCount++;
});

if (parsedCount === 0) {
    console.error("Fayllar topildi, lekin ularning ichida yaroqli ChatGPT xabarlari (chatlar) yo'q!");
} else {
    console.log(`${parsedCount} ta chat mavaffaqiyatli .md ga o'tkazildi va ${outputDir} ga saqlandi.`);
}
