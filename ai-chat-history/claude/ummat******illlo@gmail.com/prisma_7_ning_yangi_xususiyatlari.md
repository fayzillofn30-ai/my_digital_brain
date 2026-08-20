# Prisma 7 ning yangi xususiyatlari

### 👤 Foydalanuvchi:

fayzillo@Jarvis:~/Desktop/real_time_chat$ npx prisma generate Error: Could not find Prisma Schema that is required for this command. You can either provide it with --schema argument, set it in your Prisma Config file (e.g., prisma.config.ts), set it as prisma.schema in your package.json, or put it into the default location (./prisma/schema.prisma, or ./schema.prisma. Checked following paths: schema.prisma: file not found prisma/schema.prisma: file not found See also https://pris.ly/d/prisma-schema-location fayzillo@Jarvis:~/Desktop/real_time_chat$ cd backend/ fayzillo@Jarvis:~/Desktop/real_time_chat/backend$ npx prisma generate Loaded Prisma config from prisma.config.ts. Prisma schema loaded from prisma/schema.prisma. ✔ Generated Prisma Client (7.8.0) to ./prisma/generated/prisma in 68ms fayzillo@Jarvis:~/Desktop/real_time_chat/backend$ yana bitta hato backend ga ham kirishim kerak edi :XdMessage collapsedShow more

### 🤖 Claude:

😄 Endi migrate qilish qoldi:



bash
npx prisma migrate dev --name init

---

### 👤 Foydalanuvchi:

migrate qilingan :xd lekin negadir this.prisma.message chiqmayabdi

### 🤖 Claude:

Message modeli bor, lekin Prisma Client qayta generate qilinmagan bo'lishi mumkin. Tekshiring:



bash
npx prisma generate

Keyin PrismaService da tekshiring — import to'g'ri joydan kelayaptimi:



ts
import { PrismaClient } from '../../prisma/generated/prisma';

Agar shu ham ishlamasa, prisma/generated/prisma papkasida nima borligini ko'ring:



bash
ls prisma/generated/prisma

---

### 👤 Foydalanuvchi:

fayzillo@Jarvis:~/Desktop/real_time_chat/backend$ ls prisma/generated/prisma/ browser.ts client.ts commonInputTypes.ts enums.ts internal models models.ts fayzillo@Jarvis:~/Desktop/real_time_chat/backend$ ls prisma/generated/prisma/models Message.ts User.ts fayzillo@Jarvis:~/Desktop/real_time_chat/backend$

### 🤖 Claude:

Generate to'g'ri bo'lgan. Muammo import yoki PrismaService da.

PrismaService ni ko'rsating — qanday yozgansiz?

---

### 🤖 Claude:

Import noto'g'ri! Prisma 7 da @prisma/client emas, generated papkadan import qilinadi:



ts
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../../prisma/generated/prisma";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
    
    async onModuleInit() {
        try {
            await this.$connect();
            console.log("Database ulandi");
        } catch (error) {
            console.log("Ulanishda xatolik!", error);
        }
    }
    
    async onModuleDestroy() {
        try {
            await this.$disconnect();
            console.log("Database uzildi");
        } catch (error) {
            console.log("Database uzishda xatolik!", error);
        }
    }
}

2 ta o'zgarish:

@prisma/client/extension → ../../prisma/generated/prisma
@Injectable() dekorator qo'shildi — NestJS uchun majburiy

---

