# NestJS OAuth integratsiyasi

### 👤 Foydalanuvchi:

Salom Nestjsda oauth

### 🤖 ChatGPT:

Salom 🙂  
NestJS’da **OAuth** ishlatish uchun asosan **Passport** moduli bilan ishlanadi. NestJS `@nestjs/passport` va `passport` kutubxonalarini qo‘llab-quvvatlaydi, shu orqali **Google, GitHub, Facebook** va boshqa OAuth provayderlari bilan integratsiya qilish mumkin.  

### Asosiy qadamlar:  

1. **Kutubxonalarni o‘rnatish**
```bash
npm install @nestjs/passport passport passport-google-oauth20
npm install --save-dev @types/passport-google-oauth20
```

2. **Auth modulini yaratish**
```bash
nest g module auth
nest g service auth
nest g controller auth
```

3. **Google Strategy yozish**  
`google.strategy.ts`
```ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
```

4. **Auth moduliga qo‘shish**
```ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' })],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
```

5. **Controller yozish**
```ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Google login page’ga redirect qiladi
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return {
      message: 'Google login success',
      user: req.user,
    };
  }
}
```

6. **.env fayl**
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

---

🔑 Shunday qilib, foydalanuvchi `/auth/google` ga kirsa Google login sahifasiga yo‘naltiriladi va qaytgandan so‘ng `callback` endpoint orqali `req.user` obyektida Google’dagi ma’lumotlarini olasiz.  

---

Agar xohlasangiz, men sizga **GitHub OAuth** yoki **JWT bilan birlashtirish** variantini ham ko‘rsatib berishim mumkin. Qaysi biri kerakroq?

---

### 👤 Foydalanuvchi:

{
    "web": {
        "client_id": "[REDACTED_GOOGLE_CLIENT_ID]",
        "project_id": "nimadir",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "my-secret"
    }
}

### 🤖 ChatGPT:

Zo‘r 👌 Siz Google Console’dan **OAuth client credentials (client_id, client_secret)** ni olib qo‘yibsiz. Endi NestJS’dagi konfiguratsiyani shu JSON bo‘yicha sozlashingiz kerak.  

Google’dan kelgan JSON’dagi eng muhim qismlar:  

```json
{
  "web": {
    "client_id": "[REDACTED_GOOGLE_CLIENT_ID]",
    "client_secret": "my-secret",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
```

### 1. `.env` faylga qo‘shish
```env
GOOGLE_CLIENT_ID=[REDACTED_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=my-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### 2. Strategy’da foydalanish
```ts
super({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['email', 'profile'],
});
```

### 3. AuthController ishlashi
- `/auth/google` → foydalanuvchini `accounts.google.com` ga yuboradi
- Google login tugagach, `http://localhost:3000/auth/google/callback` ga qaytaradi
- `req.user` ichida foydalanuvchi haqida ma’lumot bo‘ladi (email, ism, rasm va hokazo).

---

❓ Sizga shu **Google OAuth**’ni faqat login uchun kerakmi, yoki uni **JWT token** bilan birlashtirib backend API’ga ham kirish huquqi (authorization) qilishni xohlaysizmi?

---

### 👤 Foydalanuvchi:

Salom 

### 🤖 ChatGPT:

Salom! 👋 Qalaysiz? 🙂 NestJS’dagi **OAuth** bo‘yicha ishlashni davom ettiraylikmi yoki boshqa mavzu qiziqyaptimi?

---

### 👤 Foydalanuvchi:

Hullas menda oauth tayyor 

"use client"

import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import axios from "axios";
import { useEffect, useState } from "react";
import Additionals from "../components/additionals";
import GoogleIcon from '@mui/icons-material/Google';

type registerDataType = {
  id: number,
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function Home() {
  const [groupes, setGroupes] = useState<{
    id: number,
    name: string,
    startDate: string,
    daysOfWeek: string,
    monthDuration: string
  }[]>([])
  const [targetPage, setTargetPage] = useState([])
  const [selectTedId, setSelectedId] = useState<number | null>(null)
  useEffect(() => {
    axios.get("/api/group")
      .then(resolve => setGroupes(resolve.data))
      .catch(reject => console.error(reject))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">📚 Guruhlar</h1>
        <Button>
          <Link href="http://localhost:15975/oauth/hohlaganim/calback" target="_blank">
            Sign in <GoogleIcon sx={{fontSize : "12px"}}/>
          </Link>
        </Button>
        <Link href="add">
          <Button variant="contained" color="primary">➕ Yangi qo‘shish</Button>
        </Link>
      </div>

      <main>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {
            !selectTedId ? groupes.map(group => (
              <div
                key={group.id}
                className="flex flex-col border rounded-2xl shadow-lg bg-white p-6 hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >
                <h2 className="text-xl font-semibold text-blue-600 mb-2">{group.name}</h2>
                <p className="text-gray-700">📅 Boshlanish sanasi:</p>
                <p className="text-gray-900 font-medium mb-3">
                  {new Date(group.startDate).toLocaleString("uz-UZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
                <p className="text-gray-700">⏳ Davomiyligi:
                  <span className="font-semibold text-gray-900"> {group.monthDuration} oy</span>
                </p>
                <p className="text-gray-700">🗓 Haftada:
                  <span className="font-semibold text-gray-900"> {group.daysOfWeek} kun</span>
                </p>
                <Button variant="contained"
                  onClick={() => setSelectedId(group.id)}
                >Ko'rish</Button>
              </div>
            )) : (
              <>
                <Additionals id={selectTedId} />
              </>
            )
          }
        </div>
        <div className="flex">

        </div>
      </main>
    </div>
  )
}



edi  user ro'yhatdan o

### 🤖 ChatGPT:

Zo‘r 👌 siz frontend qismida Google OAuth tugmasini ulab qo‘yibsiz. Endi siz aytmoqchisiz:  
➡️ **user ro‘yxatdan o‘tishi** va OAuth orqali kelgan ma’lumotlar (ism, email, rasm va hokazo) bazaga yozilishi kerak.  

Bu odatda quyidagicha qilinadi:  

---

## 🔹 Backend (NestJS) qismi
Sizda OAuth tayyor ekan, `AuthController` da `callback` yozilgan joyda `req.user` ni olib **database** ga saqlash kerak. Masalan, Prisma ishlatayotgan bo‘lsangiz:

```ts
// auth.controller.ts
@Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleAuthRedirect(@Req() req) {
  const userData = req.user;

  // Foydalanuvchini bazaga yozish yoki mavjud bo‘lsa olish
  let user = await this.prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (!user) {
    user = await this.prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        picture: userData.picture,
      },
    });
  }

  // Keyin token qaytarish (masalan JWT)
  const token = this.jwtService.sign({ sub: user.id, email: user.email });

  return { user, token };
}
```

---

## 🔹 Frontend (Next.js/React) qismi
Sizning tugma hozircha faqat `href` bilan backend callback’iga olib boradi. Aslida bu to‘g‘ri — foydalanuvchi Google sahifasiga kiradi → backend qayta ishlaydi → keyin sizni qaytarishi kerak **frontend route** ga, masalan:  

👉 `http://localhost:3000/auth/success?token=JWT_TOKEN`

Shunda siz `success` sahifasida query’dan tokenni olib, `localStorage` yoki `cookies` ga saqlaysiz.  

```ts
// pages/auth/success.tsx
"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Success() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      // Home page yoki dashboardga yuborish
      window.location.href = "/";
    }
  }, [token]);

  return <p>Kuting, login amalga oshirilmoqda...</p>;
}
```

---

## 🔑 Oqim qanday ishlaydi
1. Frontend: foydalanuvchi `Sign in with Google` tugmasini bosadi → `/auth/google` ga ketadi.  
2. Backend: Google sahifasiga redirect qiladi.  
3. Foydalanuvchi Google’da login qiladi → backend `callback` ga qaytaradi.  
4. Backend foydalanuvchini DB’da saqlaydi → JWT token yaratadi → frontendga qaytaradi (`/auth/success?token=...`).  
5. Frontend tokenni olib, saqlab qo‘yadi → keyinchalik API chaqiruvlarda header’da yuboradi.  

---

❓ Siz foydalanuvchini oddiy login/signup (parol bilan) ham qilmoqchimisiz, yoki faqat **Google OAuth** orqali ro‘yxatdan o‘tishini xohlaysiz?

---

### 👤 Foydalanuvchi:

import {Injectable} from "@nestjs/common"
import {PassportStrategy} from "@nestjs/passport"
import { Strategy, VerifyCallback } from "passport-google-oauth20"

@Injectable()

export class GoogleStrategiy extends PassportStrategy(Strategy,"google") {
    constructor() {
        super({
            clientID : "[REDACTED_GOOGLE_CLIENT_ID]",
            clientSecret : "[REDACTED_GOOGLE_CLIENT_SECRET]",
            callbackURL : "http://localhost:15975/oauth/hohlaganim/calback",
            scope : ["email","profile"]
        })
    }
    async validate(accessToken : string , refreshToken : string,profile : any, done : VerifyCallback ) {
        const {name,emails,photos} = profile
        const user = {
            email : emails[0],
            firstName : name.givenName,
            lastName : name.familyName,
            picture: photos[0].value,
            accessToken
        }
        done(null,user)
    }
}


bu yerda done bilan userni front sahidfag redirect qilsa bo'ladimi yoki biron usul bilan userni

### 🤖 ChatGPT:

Ha, to‘g‘ri savol! 🙂  

NestJS’dagi **Passport strategy**’ning `validate` metodi ichida `done` faqat `req.user`’ga qiymat qo‘yish uchun ishlatiladi, **redirect qilish uchun emas**.  

👉 Demak siz `validate` ichida `done(null, user)` qilib yuborasiz, va bu `req.user`’ga yoziladi.  
Keyin esa **controllerdagi callback** (`/auth/google/callback`) da `req.user` ni olib, shu yerdan redirect qilishingiz kerak.  

---

### To‘g‘ri yo‘l
```ts
// google.strategy.ts
async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
  const { name, emails, photos } = profile
  const user = {
    email: emails[0].value,
    firstName: name.givenName,
    lastName: name.familyName,
    picture: photos[0].value,
    accessToken,
  }
  done(null, user)  // faqat userni req.user ga qo‘yadi
}
```

---

### Controller’da redirect qilish
```ts
import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

@Controller("oauth")
export class AuthController {
  @Get("hohlaganim")
  @UseGuards(AuthGuard("google"))
  async googleLogin() {
    // Bu Google sahifasiga yuboradi
  }

  @Get("hohlaganim/calback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req, @Res() res: Response) {
    const user = req.user;

    // Masalan JWT yaratib olish
    // const token = this.jwtService.sign({ sub: user.email });

    // Frontendga redirect qilish
    res.redirect(`http://localhost:3000/auth/success?email=${user.email}`);
  }
}
```

---

### Nima bo‘lyapti?
- `validate` → faqat `req.user` ni to‘ldiradi.  
- `callback` → foydalanuvchi ma’lumotlarini olib, **frontend sahifaga redirect** qiladi (query param, JWT, yoki cookie orqali yuborish mumkin).  

---

❓ Siz user ma’lumotini **redirect query param** orqali yuborishni xohlaysizmi (masalan `?token=...`), yoki uni backend cookie’siga qo‘yib yuborishni (shunda frontend faqat cookie orqali foydalanuvchini taniydi)?

---

### 👤 Foydalanuvchi:

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {PrismaClient} from "@prisma/client"
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {
    async onModuleInit() {
        
    }
    async onModuleDestroy() {
        
    }
}

### 🤖 ChatGPT:

Ha, bu klass — NestJS bilan **PrismaClient**’ni integratsiya qilish uchun to‘g‘ri tuzilgan 👌.  
Ammo siz `onModuleInit` va `onModuleDestroy`’ni bo‘sh qoldirgansiz. Ularni odatda quyidagicha yozishadi:  

```ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Modul ishga tushganda Prisma bilan bog‘lanish
    await this.$connect();
    console.log("✅ Prisma connected");
  }

  async onModuleDestroy() {
    // App yopilganda connectionni uzish
    await this.$disconnect();
    console.log("❌ Prisma disconnected");
  }
}
```

---

### Qayerda ishlatiladi?
`AppModule`’ga provider sifatida ulaysiz:

```ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // boshqa modullar ham foydalana olishi uchun
})
export class PrismaModule {}
```

Keyin xohlagan servisingizda foydalanishingiz mumkin:

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }
}
```

---

⚡ Shu tariqa Prisma connection lifecycle NestJS modulining hayoti bilan bog‘langan bo‘ladi.  

❓ Siz `PrismaService`’ni faqat bitta modul uchun ishlatmoqchisizmi yoki **umumiy qilib** barcha servislarga ulab ishlatmoqchisiz?

---

### 👤 Foydalanuvchi:

import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "./core/prisma/prisma/prisma.service";

@Injectable()
export class AppService {

    constructor(
        private readonly prisma : PrismaService
    ){

    }

    async goo(req: Request) {
        if (!req['user']) {
            return "No user from google"
        }
        // @ts-ignore
        const { email : {value,verified},firstName,lastName,picture,accessToken } = req['user']
            
    }
}

### 🤖 ChatGPT:

Ajoyib, siz `req['user']` orqali **Google OAuth** dan kelgan ma’lumotni olayapsiz 👍.  
Lekin destructuring joyida kichik xato bor.  

`passport-google-oauth20` da `emails` massivi keladi, `email` obyekti emas. Siz strategy’da `done(null, user)` qilganingizda shunday obyekt yuborasiz:  

```ts
const user = {
  email: emails[0].value,
  firstName: name.givenName,
  lastName: name.familyName,
  picture: photos[0].value,
  accessToken,
}
```

Demak `req.user` dagi `email` oddiy `string`, emas `object`.  

---

### To‘g‘ri ishlash varianti
```ts
async goo(req: Request) {
  if (!req['user']) {
    return "No user from google";
  }

  // @ts-ignore
  const { email, firstName, lastName, picture, accessToken } = req['user'];

  // Agar DB da user bo‘lmasa, create qilamiz
  let user = await this.prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        picture,
        googleAccessToken: accessToken, // agar column qo‘shgan bo‘lsangiz
      },
    });
  }

  return user;
}
```

---

🔑 Endi oqim shunday bo‘ladi:
1. Foydalanuvchi Google bilan login qiladi → `req.user` obyekt hosil bo‘ladi.  
2. `AppService.goo()` chaqirilganda user DB’da tekshiriladi.  
3. Agar yangi bo‘lsa → create qilinadi, agar bor bo‘lsa → o‘sha qaytariladi.  

---

❓ Siz OAuth orqali kirgan user’ga **JWT token** ham qaytarishni xohlaysizmi (keyingi API chaqiruvlar uchun)?

---

### 👤 Foydalanuvchi:

redirect  3000/auth/google/[token]

### 🤖 ChatGPT:

Tushunarli 🚀 Siz shunday qilmoqchisiz:  
NestJS backend foydalanuvchini autentifikatsiya qilib olgach → frontend (Next.js) sahifasiga redirect qilsin, masalan:  

```
http://localhost:3000/auth/google/[token]
```

Bu yerda `[token]` JWT yoki session token bo‘ladi.  

---

### 🔹 Backend (NestJS)

`google callback` da userni DB’da saqlab, JWT token yaratasiz va shu token bilan redirect qilasiz:

```ts
import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";

@Controller("oauth")
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleLogin() {
    // Google login boshlaydi
  }

  @Get("hohlaganim/calback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req, @Res() res: Response) {
    const user = req.user;

    // JWT yaratish
    const token = this.jwtService.sign({
      sub: user.email,
      firstName: user.firstName,
    });

    // Frontendga redirect qilish
    res.redirect(`http://localhost:3000/auth/google/${token}`);
  }
}
```

---

### 🔹 Frontend (Next.js)

`pages/auth/google/[token].tsx` yoki `app/auth/google/[token]/page.tsx` (app router) da tokenni ushlab olasiz:  

```tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleAuthPage() {
  const { token } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token as string);
      router.push("/"); // Home yoki Dashboardga yuborish
    }
  }, [token, router]);

  return <p>Kirish amalga oshirilmoqda...</p>;
}
```

---

### 🔑 Natija
1. Foydalanuvchi Google login qiladi → NestJS `callback` ishlaydi.  
2. Backend JWT token yaratadi.  
3. Backend frontendga redirect qiladi: `http://localhost:3000/auth/google/<token>`.  
4. Next.js `[token]` sahifasi tokenni localStorage yoki cookie’da saqlab qo‘yadi.  
5. Endi frontend API chaqiruvlarda `Authorization: Bearer <token>` yuborishi mumkin.  

---

❓ Siz tokenni **URL param** orqali yubormoqchimisiz yoki xavfsizroq variant — **HTTP-only cookie** qilib yuborishni xohlaysiz?

---

### 👤 Foydalanuvchi:

req['user']  da accessToken bor shuni ishlatsakchi

### 🤖 ChatGPT:

To‘g‘ri 👍 `req['user']` ichida `accessToken` bo‘ladi, chunki siz uni `validate` ichida qo‘yib bergansiz.  

⚡ Lekin:  
- Bu **Google access token** bo‘lib, u faqat Google API’lariga kirish uchun ishlatiladi (masalan, Gmail, Calendar, Drive).  
- Uni **sizning API’ngiz uchun JWT sifatida ishlatish tavsiya etilmaydi**, chunki u boshqa maqsadga xizmat qiladi va bir muddatdan keyin eskiradi (expiry bor).  

---

### Variant 1 — Faqat Google API uchun ishlatish
Agar siz foydalanuvchi nomidan Google API’lariga (masalan Google Drive’dan fayl olish) kirishni xohlasangiz, unda `req['user'].accessToken` ni DB’ga saqlab qo‘yib, kerakli paytda ishlatishingiz mumkin.

```ts
async googleCallback(@Req() req, @Res() res: Response) {
  const { accessToken, email, firstName, lastName } = req.user;

  // DB ga saqlash
  let user = await this.prisma.user.upsert({
    where: { email },
    update: { accessToken, firstName, lastName },
    create: { email, accessToken, firstName, lastName },
  });

  // Tokenni URL orqali qaytarish (faqat Google uchun)
  res.redirect(`http://localhost:3000/auth/google?googleAccessToken=${accessToken}`);
}
```

Frontendda uni query param orqali olib ishlatishingiz mumkin:  

```tsx
const search = useSearchParams();
const googleAccessToken = search.get("googleAccessToken");
```

---

### Variant 2 — O‘z JWT bilan birlashtirish (tavsiya qilinadi)
Ko‘pincha backend `accessToken`ni olib, o‘zining JWT’ini chiqaradi. Chunki sizning API’lar JWT orqali ishlaydi, Google token esa tashqi API uchun.  

```ts
const { accessToken, email } = req.user;

// O‘z JWT yaratamiz
const myToken = this.jwtService.sign({ sub: email });

// Frontendga JWT bilan redirect
res.redirect(`http://localhost:3000/auth/google/${myToken}`);
```

👉 Shu bilan siz Google access tokenni ichkarida (DB’da) saqlab qo‘yasiz, lekin frontendga faqat o‘z JWT’ingizni yuborasiz.

---

✅ Xulosa:  
- Agar siz faqat foydalanuvchini aniqlash uchun ishlatmoqchi bo‘lsangiz → **o‘z JWT’ingizni yarating**.  
- Agar siz Google API’lariga foydalanuvchi nomidan kira olishingiz kerak bo‘lsa → `req['user'].accessToken` ni ham saqlang.  

---

Sizga qaysi variant kerak: **faqat login uchun JWT**mi yoki **Google API’lariga ham kirish** kerak bo‘ladimi?

---

