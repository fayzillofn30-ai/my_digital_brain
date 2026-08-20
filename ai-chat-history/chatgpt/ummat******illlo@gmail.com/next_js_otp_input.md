# Next.js OTP input

### 👤 Foydalanuvchi:

"use client"

import {TextField} from "@mui/material"

import React, { useRef, useState } from 'react'

function page() {

    const [otp,setOtp] = useState()   /// length 6
    const inputRefs = useRef([])

    return (
        <div>

        </div>
    )
}

export default page


NextJs  typesxriptda

### 🤖 ChatGPT:

Tushunarli 👍  
Siz Next.js + TypeScript bilan 6 xonali OTP (One Time Password) input qilishni xohlaysiz. Har bir input bitta raqam qabul qiladi va avtomatik ravishda keyingi inputga fokus o‘tadi. `useRef` orqali inputlarni boshqarish mumkin. Quyidagi kod TypeScriptda to‘liq ishlaydigan variant:  

```tsx
"use client"

import { TextField } from "@mui/material"
import React, { useRef, useState } from "react"

function Page() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return // faqat raqam
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Agar qiymat yozilsa, keyingisiga fokus o‘tkazish
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center mt-10">
      {otp.map((digit, index) => (
        <TextField
          key={index}
          inputRef={(el) => (inputRefs.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          inputProps={{
            maxLength: 1,
            style: { textAlign: "center", fontSize: "1.5rem", width: "3rem" },
          }}
        />
      ))}
    </div>
  )
}

export default Page
```

🔑 Asosiy nuqtalar:  
- `otp` massiv (`string[]`) sifatida saqlanadi.  
- Har bir `TextField` faqat bitta raqam qabul qiladi (`maxLength: 1`).  
- `Backspace` bosilganda oldingi inputga fokus qaytadi.  
- `useRef` bilan inputlarni massiv ko‘rinishida boshqarilyapti.  

❓ Sizga OTP ni string (`"123456"`) holida ham olish kerakmi yoki massiv (`["1","2","3","4","5","6"]`) bo‘lsa ham maylimi?

---

### 👤 Foydalanuvchi:

[{
	"resource": "/home/fayzillo/Desktop/telegram_app/front_end/src/app/otp/page.tsx",
	"owner": "typescript",
	"code": "2345",
	"severity": 8,
	"message": "Argument of type 'KeyboardEvent<HTMLDivElement>' is not assignable to parameter of type 'KeyboardEvent<HTMLInputElement>'.\n  Type 'HTMLDivElement' is missing the following properties from type 'HTMLInputElement': accept, alt, autocomplete, capture, and 54 more.",
	"source": "ts",
	"startLineNumber": 36,
	"startColumn": 43,
	"endLineNumber": 36,
	"endColumn": 44,
	"origin": "extHost1"
}]

### 🤖 ChatGPT:

Ha, bu xato `onKeyDown` ning **tip muvofiqligi** sababli chiqyapti.  

`TextField` (`@mui/material`) ichida `onKeyDown` hodisasi `KeyboardEvent<HTMLDivElement>` deb tiplangan, lekin biz funksiyamizni `KeyboardEvent<HTMLInputElement>` deb yozib qo‘yganmiz.  

👉 Buni ikki xil usulda hal qilish mumkin:

---

### ✅ 1-variant: `React.KeyboardEvent<HTMLInputElement | HTMLDivElement>` ishlatish
```tsx
const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>,
  index: number
) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    inputRefs.current[index - 1]?.focus()
  }
}
```

---

### ✅ 2-variant: `onKeyDown` ni `TextField`ning `inputProps` ichiga berish
Shunda u to‘g‘ridan-to‘g‘ri `<input>` ga ulanadi va tip xatosi yo‘qoladi:

```tsx
<TextField
  key={index}
  inputRef={(el) => (inputRefs.current[index] = el)}
  value={digit}
  onChange={(e) => handleChange(e.target.value, index)}
  inputProps={{
    maxLength: 1,
    style: { textAlign: "center", fontSize: "1.5rem", width: "3rem" },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index),
  }}
/>
```

---

⚡ Men sizga **2-variantni** tavsiya qilaman, chunki `inputProps.onKeyDown` to‘g‘ridan-to‘g‘ri `HTMLInputElement` uchun ishlaydi va aniqroq.  

❓ Sizga butun OTP kodini yakunda `string` qilib (`"123456"`) olish kerakmi, yoki `["1","2","3","4","5","6"]` massiv ko‘rinishida yetarlimi?

---

