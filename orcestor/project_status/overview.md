# Project Status — loyiha holati (doimiy yangilanib boradi)

Bu fayl `simple_context.md`dan FARQLI — sessiya restartida o'chmaydi/qisqarmaydi,
loyiha haqidagi bilim vaqt o'tishi bilan shu yerda TO'PLANIB boradi. Yangilash
qoidasi `orcestor.config.env`dagi `PROJECT_STATUS_UPDATE` bilan belgilanadi.

**Oxirgi yangilanish:** 2026-08-19

## 1. Struktura
- **Texnologiya steki:** Asosan Markdown hujjatlari (`.md`), Node.js va Puppeteer (crawling skriptlari uchun reja qilinmoqda).
- **Papka tuzilishi:** `00-Meta` (reja, metadata), `01-Repos`, `ai-chat-history` (AI chatlarini saqlash uchun).
- **Asosiy maqsad:** 56+ o'quv/loyiha repolarini (va AI chatlarini) turli AI'lar yordamida tahlil qilib, Obsidian bilim bazasi (Vault) ga aylantirish.

## 2. Qoidalar va konventsiyalar
- Tahlil ishlari 6 ta qat'iy fazadan (ketma-ket) iborat bo'ladi.
- AI (Agent)lar o'rtasida rollar aniq taqsimlangan (Orchestrator, Executer).
- Faqat foydalanuvchining shaxsiy kodi/chatlari tahlil qilinadi, senior-level qamrab olinmaydi.

## 3. Bajarilgan ishlar (qisqa tarix)
- **Faza 1** (Muhit va profillar auditi) to'liq yakunlandi va DB ga saqlandi.
- **Faza 2** (AI chatlarini ajratib olish) YAKUNLANDI. Chrome xavfsizlik cheklovlari (anti-bot) sababli Puppeteer rad etildi va uchinchi tomon kengaytmasi ("Web Page Downloader") orqali arxivlash joriy qilindi.
- **Faza 3** (Matnlarni o'qish va md yaratish) YAKUNLANDI. Yuklangan HTML fayllardan xabarlarni `.md` formatiga o'tkazuvchi tozalovchi (`parse-chats.js`) skript yozildi va muvaffaqiyatli sinovdan o'tkazildi. U email manzillarni avtomatik tarzda maskalaydi (`al***er@gmail.com` ko'rinishida uzunlikka qarab moslashuvchan foiz bilan). Hatto alohida bittalik chatlar arxivi uchun ham optimallashtirildi.
- **Faza 4** (Multi-profil sikli) JARAYONDA. Ishni osonlashtirish uchun foydalanuvchining Downloads papkasidagi oxirgi zipni topib avtomatik ishga tushiruvchi `auto-process.js` skripti yozildi.
  - **10 ta profildan holat:** 3 ta profil qat'iyan o'tkazib yuborildi (1 tasi begona, 2 tasi bo'sh). 3 ta profil muvaffaqiyatli arxivlandi va parsing qilindi. Qolgan 4 ta profil keyingi sessiyada kutilmoqda.

## 4. Ma'lum muammolar / ochiq savollar (Keyingi sessiya uchun)
- **Faza 4 Davomi**: Qolgan 4 ta profil (7, 8, 9, 10) kengaytma yordamida yuklanib, `node auto-process.js <email>` buyrug'i orqali tizimga kiritilishi davom ettiriladi.
- Qolgan AI servislar (masalan ChatGPT, Grok) uchun parserlar kengaytirilishi yoki moslashtirilishi ustida ishlash qolmoqda (Faza 5).
