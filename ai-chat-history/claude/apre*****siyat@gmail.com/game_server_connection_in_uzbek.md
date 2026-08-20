# Game server connection in Uzbek

### 👤 Foydalanuvchi:

Salom Oʻzbek tilida javob ber.

### 🤖 Claude:

Salom! Rasmda ko'rsatilgan o'yin serveriga ulanish uchun quyidagi qadamlarni bajaring:

Bevosita ulanish usuli:

O'yinda multiplayer/ko'p o'yinchilik rejimiga kiring
"Прямое соединение" (Bevosita ulanish) tugmasini bosing
"Удаленный IP" (Masofaviy IP) maydoniga server IP manzilini kiriting: 192.168.0.138
"Имя игрока" (O'yinchi nomi) maydonida o'z nomingizni kiriting (rasmda "Abdullah" ko'rsatilgan)
"Присоединиться" (Qo'shilish) tugmasini bosing

Muhim eslatmalar:

Bu mahalliy tarmoq (LAN) IP manzili (192.168.x.x), shuning uchun siz xuddi shu Wi-Fi/tarmoqqa ulangan bo'lishingiz kerak
Agar serverga internetdan ulanmoqchi bo'lsangiz, server egasi o'zining ommaviy IP manzilini va port forwarding sozlamalarini berishi kerak
Firewall yoki antivirus dasturi o'yinni bloklamayotganiga ishonch hosil qiling

Server yaratgan odam bilan bir xil tarmoqda bo'lsangiz, berilgan IP orqali ulanishingiz mumkin bo'ladi.

---

### 👤 Foydalanuvchi:

Bizda wifi router

### 🤖 Claude:

Yaxshi! WiFi router orqali ulanish uchun quyidagilarni qiling:

1. Server egasi qilishi kerak:

Routerda Port Forwarding (Port yo'naltirish) sozlash kerak
O'yin uchun kerakli portni ochish (odatda o'yin sozlamalarida ko'rsatilgan)
O'zining ommaviy IP manzilini bilishi kerak (Google'da "my ip" deb qidirsangiz chiqadi)

2. Siz qilishingiz kerak:

Server egasidan ommaviy IP manzilini so'rang
O'yinda "Прямое соединение" ga kiring
O'sha ommaviy IP ni kiriting
"Присоединиться" tugmasini bosing

Oddiyroq usul - bir xil WiFi'ga ulanish:

Agar ikkalangiz ham bir xil WiFi routerga ulangan bo'lsangiz:

Mahalliy IP (192.168.0.138) ishlashi kerak
Hech qanday qo'shimcha sozlash shart emas
Shunchaki rasmda ko'rsatilgandek IP ni kiriting va ulanasiz

Muammo bo'lsa tekshiring:

Ikkalangiz ham bir xil WiFi'ga ulanganmisiz?
O'yin firewall tomonidan bloklangan emasmikan?
Server ishga tushirilganmi?

Qaysi usulni sinab ko'rmoqchisiz?

---

### 🤖 Claude:

A'lo! Rasmdan ko'rinib turibdiki, siz IEASUN-A2D2 WiFi tarmog'iga ulangansiz.

Sizning kompyuteringizning IP manzili: 192.168.0.199

Endi qanday ulanish kerak:

Agar server egasi ham shu WiFi'ga ulangan bo'lsa:

Server egasidan uning kompyuterining IP manzilini so'rang
Yoki server yaratilgan kompyuterda Windows'da ipconfig (yoki cmd ni ochib ipconfig yozib) tekshirib IP ni bilib oling
O'yinda o'sha IP manzilini kiriting (masalan, agar server 192.168.0.138 da bo'lsa, o'shani kiriting)

Agar siz server yaratmoqchi bo'lsangiz:

O'yinda "Создать сервер" (Server yaratish) tugmasini bosing
Server sozlamalarini o'rnating
Do'stingizga o'z IP manzilingizni bering: 192.168.0.199
Do'stingiz o'yinda "Прямое соединение" ga kirib, sizning IP (192.168.0.199) ni kiritsin

Muhim:

Ikkalangiz ham IEASUN-A2D2 WiFi'ga ulangan bo'lishingiz shart
O'yin firewall tomonidan bloklanmasligi kerak

Qaysi holatdasiz - siz serverga ulanmoqchimisiz yoki server yaratmoqchimisiz?

---

### 👤 Foydalanuvchi:

Vremiya soideneniya vishla deyabdi

### 🤖 Claude:

"Время соединения вышло" xatosi chiqayotgan bo'lsa, quyidagi yechimlarni sinab ko'ring:

1. IP manzilni tekshiring:

Server egasining to'g'ri IP manzilini kiritganingizga ishonch hosil qiling
192.168.0.138 o'rniga boshqa IP bo'lishi mumkin

2. Server ishga tushirilganligini tekshiring:

Server egasi avval serverni yaratib, ishga tushirgan bo'lishi kerak
Server "ishlamoqda" holatida bo'lishi shart

3. Firewall/Antivirus tekshiring:

Ikkalangizda ham o'yin firewall yoki antivirusda bloklanmagan bo'lishi kerak
Windows Firewall'da o'yinni "Allow" (ruxsat berish) qiling

4. Bir xil WiFi'ga ulanganligingizni tasdiqlang:

Ikkalangiz ham IEASUN-A2D2 tarmog'ida bo'lishingiz kerak
Boshqa WiFi yoki mobil internetga ulanmagan bo'ling

5. O'yinni qayta ishga tushiring:

Ikkalangiz ham o'yinni yoping va qaytadan oching
Avval server yaratilsin, keyin ulanishga harakat qiling

6. Port raqamini tekshiring:

Ba'zi o'yinlarda port raqamini ham kiritish kerak bo'ladi
Server egasidan port raqamini so'rang (masalan: 192.168.0.138:27015)

Qaysi qadamni sinab ko'rganingizni ayting, yordam beraman!

---

### 👤 Foydalanuvchi:

Serverni qanday yaratadi

### 🤖 Claude:

Server yaratish uchun quyidagi qadamlarni bajaring:

O'yinda server yaratish:

Multiplayer/Ko'p o'yinchilik rejimiga kiring

Asosiy menyudan "Multiplayer" yoki o'xshash tugmani toping

"Создать сервер" (Server yaratish) tugmasini bosing

Bu odatda "Хостить игру" yoki "Host Game" deb ham nomlanishi mumkin

Server sozlamalarini o'rnating:

Xarita (Map) tanlang
O'yinchilar soni (maksimal nechta kishi kirishi mumkin)
Server nomi
Parol (agar xohlasangiz)
O'yin qoidalari

"Создать" yoki "Start Server" tugmasini bosing
Server ishga tushgandan keyin:

Sizning IP manzilingiz: 192.168.0.199
Bu IP ni do'stlaringizga bering
Ular "Прямое соединение" ga kirib, 192.168.0.199 ni kiritishlari kerak

Qo'shimcha maslahat:

Server yaratilgandan keyin kutib turing, boshqalar ulanguncha o'yin ichida bo'ling
Agar server yopilsa, hamma o'yindan chiqadi

Qaysi o'yin ekanini aytsangiz, aniqroq ko'rsatma bera olaman. Server yaratish tugmasini topa olmayapsizmi?

---

