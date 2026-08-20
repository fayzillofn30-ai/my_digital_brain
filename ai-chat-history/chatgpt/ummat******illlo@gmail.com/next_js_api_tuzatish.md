# Next.js API tuzatish

### 👤 Foydalanuvchi:

Salom

### 🤖 ChatGPT:

Salom! 😊 Qalaysiz?

---

### 👤 Foydalanuvchi:

import { NextResponse } from "next/server"
import { User } from "../../../../generated/prisma"
import { PrismaClient } from "@prisma/client"


export async function POST(req: Request) {
    const data = req
    // const prisma = new PrismaClient()

    console.log( "user/post -> ",data)
    NextResponse.json(data)
}

export async function GET(req: Request) {
    const prisma = new PrismaClient()

    const users = await prisma.user.findMany()
    NextResponse.json(users)
}

### 🤖 ChatGPT:

Siz yozgan Next.js API route kodi biroz to‘liq ishlamaydi, chunki bir nechta muhim nuqtalar bor:  

1. **`POST` request-da `req.body` o‘qilishi kerak** – `req` obyekti to‘g‘ridan-to‘g‘ri ma’lumot bermaydi. Siz `await req.json()` bilan ma’lumotni olishingiz kerak.  
2. **`NextResponse.json` ni return qilish kerak** – hozir siz chaqiryapsiz, lekin return qilmayapsiz, shuning uchun javob yuborilmaydi.  
3. **`PrismaClient`ni har doim funksiyada yaratish tavsiya etilmaydi** – bu har request-da yangi client yaratadi. Better: globals da saqlash.  

Shu kodni shunday to‘g‘rilash mumkin:

```ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // global yoki fayl darajasida

export async function POST(req: Request) {
  try {
    const data = await req.json(); // POST body ni olish
    const user = await prisma.user.create({
      data: data, // User modeliga mos data
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Agar xohlasang, men **PrismaClient-ni “global” qilib yozib, har doim yangi yaratmaslik** bilan optimallashtirilgan versionini ham ko‘rsatib bera olaman.  

Shuni qilaylikmi?

---

