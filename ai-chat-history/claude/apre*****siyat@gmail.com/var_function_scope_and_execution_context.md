# Var function scope and execution context

### 🤖 Claude:

Stack - bu quti ustma-ust qo'yilgan holat 📚

Oddiy misol - kitoblar:



[Kitob 3] ← Eng yuqorida (oxirgi qo'shilgan)
[Kitob 2]
[Kitob 1] ← Eng pastda (birinchi qo'shilgan)

Qoida:

Yangi kitob tepaga qo'yiladi
Olib tashlash ham tepadan boshlanadi
LIFO = Last In, First Out (oxirgisi birinchi chiqadi)

JavaScript'da:



javascript
function birinchi() {
  console.log("1");
  ikkinchi();
  console.log("4");
}

function ikkinchi() {
  console.log("2");
  uchinchi();
  console.log("3");
}

function uchinchi() {
  console.log("Oxirgi");
}

birinchi();

Call Stack harakati:



1. [birinchi]           → "1" chiqadi
2. [birinchi, ikkinchi] → "2" chiqadi  
3. [birinchi, ikkinchi, uchinchi] → "Oxirgi"
4. [birinchi, ikkinchi] → "3" chiqadi
5. [birinchi]           → "4" chiqadi
6. []                   → Bo'sh

Xulosa:

Stack = yuqoridan qo'shish va yuqoridan olish prinsipi

---

### 👤 Foydalanuvchi:

Top down ga zid emasmi

### 🤖 Claude:

Ha, zid ko'rinadi! Lekin terminologiya boshqacha ishlaydi:

Vizual tushuntirish:



Stack o'sish yo'nalishi (yuqoriga):
    ↑
[uchinchi]  ← Eng yangi (TOP)
[ikkinchi]
[birinchi]  ← Eng eski (BOTTOM)
    ↓

"Top" deganda:

Top = eng yuqorisi = eng yangi element
Bottom = eng pasti = eng eski element

Top-down deganda:

Code yuqoridan pastga o'qiladi ✅
Lekin Stack pastdan yuqoriga o'sadi ✅

Ikkalasi ham to'g'ri:



javascript
function a() {  // 1-chi o'qiladi (yuqorida)
  b();          // 2-chi chaqiriladi
}
function b() {  // 2-chi o'qiladi (pastda)
}

// Stack:
[b]    ← TOP (yangi)
[a]    ← BOTTOM (eski)

Xulosa:

Kod: top-down o'qiladi (yuqoridan pastga)
Stack: bottom-up o'sadi (pastdan yuqoriga)
Zidlik yo'q, ikki xil jarayon! ✅

---

### 👤 Foydalanuvchi:

Demak kodlar stackga joylashda pastdan boshlanar ekanda

### 🤖 Claude:

Ha, to'g'ri! Kodlar Stack'ga pastdan boshlab joylashadi:

Misol:



javascript
function a() {
  b();
}
function b() {
  c();
}
function c() {
  console.log("Oxir");
}

a(); // Boshlanish

Stack o'sishi (pastdan yuqoriga):



Qadam 1:
[a] ← BOTTOM (birinchi)

Qadam 2:
[b] ← yangi
[a] ← eski

Qadam 3:
[c] ← TOP (eng yangi)
[b]
[a] ← BOTTOM

Qadam 4 (c tugadi):
[b]
[a]

Qadam 5 (b tugadi):
[a]

Qadam 6 (a tugadi):
[] ← Bo'sh

Xulosa:

✅ Birinchi chaqirilgan funksiya → pastda
✅ Oxirgi chaqirilgan funksiya → tepada (TOP)
✅ Tugash tepadan boshlanadi

Xuddi chinakam kitoblar uyumi kabi! 📚

---

