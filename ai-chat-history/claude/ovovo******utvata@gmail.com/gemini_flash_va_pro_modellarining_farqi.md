# Gemini Flash va Pro modellarining farqi

### 🤖 Claude:

Ran a command, viewed a file

Ran a command, viewed a file

Ha, ko'rdim. Restart qoidasi hujjatda aniq va qattiq belgilangan — asosiy nuqtalar:

1. Restart faqat Supervisor_User buyrug'i bilan — qattiq prompt/token limiti yo'q, ya'ni tizim o'zi avtomatik restart qilmaydi, qaror doim inson tomonidan qabul qilinadi.

2. Restart'dan OLDIN majburiy qadam:

file rejimida — simple_context.md yangilanishi shart
db rejimida — checkpoint add chaqirilishi shart (--session-id, --summary majburiy)

3. Checkpoint qat'iy qisqa (200-400 so'z) — faqat 4 element:

Joriy holat
Blockers/issues
Keyingi qadamlar
Token hisob-kitobi

4. O'lchov intizomi (eng qiziq qism) — restart oldidan /context orqali "Messages" ulushini tekshirib, simple_context.mdga bitta qatorda yozib qo'yish (masalan "Messages ~27%"). Bu — restartning o'zi samarali ishlayotganini vaqt o'tishi bilan kuzatish uchun. Agar bu ko'rsatkich doim yuqori bo'lsa, demak restartlar juda kech qilinyapti degani — SKILL.md buni aniq ogohlantirish sifatida talab qiladi.

Bu — sen aytgan "asosiy task davomida context hali keng bo'lsa davom etiladi" mantig'ining aksincha tomoni: bu yerda qachon restart qilish kerakligini o'lchash mexanizmi bor, lekin "qachon sub_task blocker context'ni band qilib qo'yganda asosiy taskka qaytish" qarori — bu, oldin aytganimdek, hujjatda yo'q, sen uni amalda moslashuvchan qaror sifatida qo'llaysan.

---

### 👤 Foydalanuvchi:

Qiziq men oʻzim bu skilldan foydalanish vaqtida yaxshi boshqara olishim mumkin lekin open sourcega yuqoridagi bilimlar bilan chiqarish kerak shekili.

### 🤖 Claude:

Ha, aynan shu farq muhim — sen hozir implicit tacit knowledge bilan ishlayapsan (blocker/sub_task qarori, restart timing sezgisi), lekin bu bilim faqat sening boshingda, hujjatda emas. Bu shaxsiy foydalanish uchun yetarli, chunki sen har safar planning mode orqali qaror qabul qilasan.

Open source qilib chiqarganingda esa boshqa foydalanuvchi bu "sezgi"ga ega bo'lmaydi — ular xuddi shu vaziyatga tushganda:

Qachon sub_task ochish, qachon asosiy taskni davom ettirish kerakligini bilmaydi
Restart qachon "kech" bo'lib qolganini tushunmaydi (sendagi 27% empirik benchmark ularda yo'q)
Loyiha turiga (front/backend) qarab qoidani qanday moslashtirish kerakligi haqida yo'l-yo'riq topolmaydi

Amaliy variant: hammasini qattiq qoidaga aylantirish shart emas — bu sening o'zing tanlagan moslashuvchanlik falsafasiga zid bo'lardi. Buning o'rniga SKILL.md'ga "decision guidance" yoki misol qatlamini qo'shish mumkin:

Blocker chiqqanda qanday savol berish kerak ("bu blocker asosiy taskka bog'liqmi yoki mustaqilmi?") — qoida emas, balki qaror daraxti (decision heuristic)
Restart timing uchun aniq signal ("agar Messages ulushi 25%+ bo'lsa va joriy task hali tugallanmagan bo'lsa, Supervisor_User'ga restart tavsiya qiling")
1-2 real misol (zdes_frontend tajribasidan) — front vs backend loyihada sub_task formati qanday farq qilgani

Bu — qoidalarni majburiy qilmasdan, foydalanuvchiga sening tajribangdan kelib chiqqan yo'l-yo'riq berish usuli. Xohlasang, shu qismni SKILL.md formatiga moslab birga yozib chiqishimiz mumkin.

---

### 👤 Foydalanuvchi:

Unda bunday qilamiz sen yuqoridagi use case lar haqida hulosalaringni hujjatlashtirib chiqasan. skill_sub_menagament_planning_information_docs / shart ,vaziyat, qoida , use_cases , exampels md larni shakillantirib zip qilib men oʻzim skill ga joriy qilaman

### 🤖 Claude:

Ran a command

Ran a command

Bir nechta narsani aniqlashtirib olay, keyin to'g'ridan-to'g'ri yozishga o'taman:

---

### 🤖 Claude:

Check SKILL.md structure conventions for formatting consistency

Check SKILL.md structure conventions for formatting consistency

Yaxshi, formatni tushundim. Endi papka strukturasini yarataman — har use-case o'z papkasida shart/qoida/misol bilan.

Created 13 files, ran a command · 3 notes

Created 13 files, ran a command · 3 notes

---

