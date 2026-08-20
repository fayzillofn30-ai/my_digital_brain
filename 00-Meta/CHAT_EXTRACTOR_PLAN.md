# AI Chat Extractor — Yangilangan Arxitektura va Reja

Ushbu reja Chrome profillari orqali AI chatlarini yig'ish va ularni tartibli markdown ko'rinishida saqlash jarayonini belgilaydi. Dastlabki Puppeteer orqali avtomatlashtirish rejasi Google Chrome xavfsizlik cheklovlari va Cloudflare anti-bot tizimlari tufayli bekor qilinib, ancha barqaror bo'lgan **"Kengaytma + Parser"** arxitekturasiga o'tildi.

## 1. Yangi Arxitektura (Extension + Parser)
Jarayon to'liq skript orqali emas, balki gibrid usulda (foydalanuvchi va AI hamkorligida) amalga oshiriladi:
1. **Yuklab olish (Web Page Downloader):** Foydalanuvchi tayyor Chrome kengaytmasidan foydalanib, to'g'ridan-to'g'ri o'z sessiyasi orqali barcha chatlarni to'liq HTML arxiv (ZIP) ko'rinishida yuklab oladi. Bu blokirovkalarni 100% chetlab o'tadi.
2. **Parsing (Node.js & Cheerio):** Maxsus yozilgan `parse-chats.js` skripti ZIP arxivni ochadi, barcha HTML fayllardan (`h2.sr-only` va boshqa teglar orqali) faqat foydalanuvchi va AI o'rtasidagi sof matnli dialoglarni ajratib oladi.
3. **Formatlash (Markdown):** Ajratib olingan matnlar xavfsizlik qoidalariga muvofiq, masked email (`al***er@gmail.com`) papkalari ichiga toza `.md` fayllar sifatida saqlanadi.

## 2. Orkestratsiya Bosqichlari (Fazalar)

### Faza 1: Muhit va Profillar auditi (YAKUNLANGAN)
- `package.json` yaratish va profillar ro'yxatini shakllantirish muvaffaqiyatli amalga oshirildi.

### Faza 2 & 3: Chatlarni yig'ish va ajratish (YAKUNLANGAN)
- **Status:** Puppeteer arxitekturasi bekor qilinib, yangi usul joriy etildi. 
- **Bajarildi:** Kengaytma orqali olingan ilk ZIP fayl asosida Node.js + Cheerio parseri (`parse-chats.js`) yozildi. U email manzillarni uzunligiga qarab avtomatik qisman yashiruvchi (smart masking) va `.md` fayllarga to'g'ri taqsimlovchi mantiqqa ega. Birinchi profilning 19 ta chati muvaffaqiyatli saqlab olindi.

### Faza 4: Multi-Profil jarayonini yakunlash (KUTILMOQDA)
- **Vazifa:** Foydalanuvchi qolgan barcha profillaridan xuddi shu tarzda ZIP fayllarni yuklab oladi va `parse-chats.js` orqali tizimdan o'tkazadi. Barcha chatlar tegishli maskalangan papkalarga joylashib, to'liq AI Chat bazasi shakllanishi kerak.

### Faza 5: Boshqa AI Servislariga moslash (KUTILMOQDA)
- **Vazifa:** Hozirgi parser asosan `claude.ai` DOM strukturasiga moslangan. Agar foydalanuvchi ChatGPT, Grok kabi boshqa servislardan arxiv yuklasa, parser skriptini o'sha saytlarning DOM tuzilishiga qarab kengaytirish kerak bo'ladi.
