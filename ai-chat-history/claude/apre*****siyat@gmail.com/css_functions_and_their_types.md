# CSS functions and their types

### 🤖 Claude:

@property Kalit So'zi
@property - bu maxsus CSS o'zgaruvchilarini (custom properties) yaratish va ularning xususiyatlarini aniqlash uchun ishlatiladi.

Sintaksis:


css
@property --nom {
  syntax: '<type>';
  inherits: true/false;
  initial-value: qiymat;
}

Parametrlari:
1. syntax - qiymat turi (majburiy):

'<length>' - o'lcham (px, em, rem)
'<color>' - rang
'<number>' - son
'<percentage>' - foiz
'<integer>' - butun son
'<angle>' - burchak
'*' - istalgan qiymat

2. inherits - meros (majburiy):

true - bolalar elementga meros qoladi
false - meros qolmaydi

3. initial-value - boshlang'ich qiymat (ixtiyoriy)

Misol:


css
@property --myColor {
  syntax: '<color>';
  inherits: false;
  initial-value: blue;
}

@property --rotation {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.box {
  background: var(--myColor);
  transform: rotate(var(--rotation));
  transition: --rotation 1s; /* Animatsiya ishlaydi! */
}

.box:hover {
  --rotation: 360deg;
}

Afzalliklari:
✅ O'zgaruvchini animatsiya qilish mumkin

✅ Qiymat turini aniqlash

✅ Xatolarni oldini olish

✅ Boshlang'ich qiymat berish

Eslatma: Yangi xususiyat, barcha brauzerda ishlamasligi mumkin.

---

### 👤 Foydalanuvchi:

Nested ypzilishi mumkinmi

### 🤖 Claude:

@property Nested Yozilishi
YO'Q, @property nested (ichma-ich) yozilmaydi!

❌ Noto'g'ri:


css
/* Boshqa qoida ichida ishlamaydi */
.element {
  @property --color {
    syntax: '<color>';
    inherits: false;
  }
}

@media (max-width: 768px) {
  @property --size {  /* Ishlamaydi! */
    syntax: '<length>';
  }
}

✅ To'g'ri:


css
/* Faqat global darajada yoziladi */
@property --color {
  syntax: '<color>';
  inherits: false;
  initial-value: red;
}

@property --size {
  syntax: '<length>';
  inherits: true;
  initial-value: 20px;
}

/* So'ngra istalgan joyda ishlatiladi */
.element {
  color: var(--color);
  font-size: var(--size);
}

@media (max-width: 768px) {
  .element {
    --size: 16px; /* O'zgaruvchi qiymatini o'zgartirish mumkin */
  }
}

Xulosa:

@property faqat CSS faylning yuqori darajasida yoziladi
Selektor, media, yoki boshqa qoidalar ichida ishlamaydi
Lekin aniqlangandan keyin istalgan joyda ishlatiladi

---

