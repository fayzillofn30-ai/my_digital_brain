# TypeScript xatosi

### 👤 Foydalanuvchi:

[{
	"resource": "/home/fayzillo/Desktop/react_vazifa/src/components/headr-components/Settings.jsx",
	"owner": "typescript",
	"code": "8010",
	"severity": 8,
	"message": "Type annotations can only be used in TypeScript files.",
	"source": "ts",
	"startLineNumber": 17,
	"startColumn": 51,
	"endLineNumber": 17,
	"endColumn": 78,
	"origin": "extHost1"
}]

### 🤖 ChatGPT:

Bu xato shuni anglatyapti: **sen `.jsx` faylda TypeScript yozib qo‘ygan ekansan**.  
Xabar:  
```
Type annotations can only be used in TypeScript files.
```
ya’ni **tip yozish faqat `.ts` yoki `.tsx` fayllarda ishlaydi**, `.jsx` faylda emas.  

👉 Buni hal qilish uchun 2 yo‘l bor:  

### 1. Faylni `.tsx` qilib o‘zgartirish
Agar haqiqatan ham TypeScript ishlatmoqchi bo‘lsang:  
- Fayl nomini `Settings.jsx` → `Settings.tsx` ga o‘zgartir.  
- TypeScript konfiguratsiyang (`tsconfig.json`) borligiga ishonch hosil qil.  
- Kodni shu ko‘rinishda qoldirsang bo‘ladi:  
  ```tsx
  export default function Settings({ isOpen }: { isOpen: boolean }) {
      return <div>{isOpen ? "Open" : "Closed"}</div>;
  }
  ```

### 2. Tipni olib tashlash
Agar oddiy **JavaScript/JSX** ishlatayotgan bo‘lsang, tiplarni yozish mumkin emas. Uni olib tashlash kerak:  
```jsx
export default function Settings({ isOpen }) {
    return <div>{isOpen ? "Open" : "Closed"}</div>;
}
```

---

❓ Sen loyihangni TypeScript bilan qilyapsanmi yoki oddiy React (JavaScript) bilan? Shunga qarab men aniq yechim yozib beraman.

---

