# Simple Context — joriy holat (har doim QISQA saqlanadi)

**Oxirgi yangilanish:** 2026-08-19

## Joriy holat
Loyiha yangi orkestratsiya rejimida muvaffaqiyatli ishlamoqda.
AI chat tarixini saqlash usuli o'zgartirildi: Puppeteer o'rniga foydalanuvchi orqali Chrome Kengaytmasi ("Web Page Downloader") yordamida yuklab olinadi va Node.js parser (`parse-chats.js`) orqali `ai-chat-history` ga tozalab saqlanadi. (Faza 2, 3 yakunlandi).

## Ko'rilgan muammolar
- Chrome uzoqdan boshqarish va cookie/login sessiyalarni saqlash masalasida xavfsizlik cheklovlariga ega bo'lgani uchun avtomatlashtirilgan browser arxitekturasi bekor qilindi.
- Yechim: tayyor kengaytmalar va mahalliy parser skriptidan iborat gibrid arxitekturaga o'tildi.

## Keyingi qadam
- Qolgan (keyingi) profillardan yuklangan arxiv (zip) fayllarni `parse-chats.js` orqali tizimga yig'ishda davom etish (Faza 4).
- ChatGPT va boshqa AI servislar uchun ham parsing mantiqlarini moslashtirish (Faza 5).

## Restart paytidagi token hisob-kitobi
(bo'sh — birinchi restartda to'ldiriladi)
