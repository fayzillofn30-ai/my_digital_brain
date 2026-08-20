# Universal file server guide

### 👤 Foydalanuvchi:

Salom'

### 🤖 ChatGPT:

Salom! 😊 Qalaysiz?

---

### 👤 Foydalanuvchi:

fayzillo@Jarvis:~/Desktop/telegram_app$ nest new file_server
✨  We will scaffold your app in a few seconds..


men universal file server yozmoqchiman va uni loyiham uchun cloude qilib ishlatmoqxhiman

### 🤖 ChatGPT:

Zo‘r — ajoyib reja! 👏 Quyida universal (har turdagi faylni qabul qiluvchi) file-serverni NestJS bilan qanday loyihalash va uni “cloud” sifatida loyihangizga qanday joylashtirish bo‘yicha to‘liq, amaliy yo‘riqnoma beraman: arxitektura, texnologiyalar, kod namunasi, Docker/kompoz va Kubernetes deploy misollari, xavfsizlik va opsiyalar (S3/MinIO, presigned URL, resumable uploads, metadata DB). Kod va konfiguratsiyalarni o‘zingiz moslab ishlatishingiz uchun yetarlicha konkret qilib yozdim.

Quyidagilarni qamrab olaman:
1. Arxitektura va qarorlar (qaysi komponentlar kerakligi)
2. Tanlangan texnologiyalar / tavsiyalar
3. Minimal NestJS file-server: upload / download / presigned URL + Prisma file-model
4. Resumable upload variantlari (chunking yoki tus)
5. Deployment: docker-compose (MinIO + Postgres + app) va Dockerfile
6. Kubernetes (oddiy Deployment/Service + PVC) uchun namunalar
7. Qo‘shimcha xavfsizlik, monitoring, limitlar va backup maslahatlari

---

# 1) Arxitektura — nimani qilasiz?
Oddiy universal file-server komponentlari:
- HTTP API (upload, download, metadata, list, delete)
- Object storage (S3-compatible: AWS S3, MinIO, DigitalOcean Spaces va h.k.)
- Metadata DB (Prisma + Postgres / MySQL) — fayl nomi, original nom, owner, content-type, size, hash, storage key, acl, upload status
- Auth (JWT/Session) — faqat egalariga yo‘l qo‘yish uchun
- Optional: presigned URLs (upload/download) — clientlarga bevosita storage-ga yozishni beradi
- Optional: resumable upload (chunking / tus) — katta fayllar uchun
- Optional: virus scanning (ClamAV), image processing (thumbs), background workers
- CDN oldida qo‘yish (CloudFront/Cloudflare) — katta trafik uchun

---

# 2) Texnologiyalar / tavsiyalar
- NestJS (REST API)
- Prisma + Postgres (metadata)
- S3-compatible storage: MinIO (dev / self-host) yoki AWS S3 / DO Spaces (prod). MinIO juda oson lokal/cloud uchun.
- Upload library: `multer` yoki presigned URLs (server yengil bo‘ladi). Resumable: `tus` protokoli yoki chunking.
- Docker + docker-compose (dev) va Kubernetes (prod).
- CI/CD: GitHub Actions yoki GitLab CI
- Monitoring: Prometheus + Grafana, logging: ELK yoki Loki/Promtail

---

# 3) Minimal NestJS implementation (kod namunasi)

## Prisma model (schema.prisma)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model File {
  id           String   @id @default(uuid())
  originalName String
  mimeType     String
  size         Int
  storageKey   String   @unique
  ownerId      String?  
  uploadedAt   DateTime @default(now())
  checksum     String?
  public       Boolean  @default(false)
  meta         Json?
}
```

## .env (muhim)
```
DATABASE_URL=postgresql://user:pass@db:5432/files
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=files
AWS_S3_REGION=us-east-1   # agar S3 ishlatsa
JWT_SECRET=supersecret
```

## NestJS service — S3 (aws-sdk v3) bilan presigned upload/download (misol)
> Bu misolda AWS SDK v3 ishlataman (S3-kompatible MinIO bilan ham ishlaydi agar endpoint sozlangan bo‘lsa).

```ts
// s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.MINIO_BUCKET || process.env.AWS_S3_BUCKET || 'files';
    const endpoint = process.env.MINIO_ENDPOINT; // agar MinIO bo'lsa
    this.client = new S3Client({
      region: process.env.AWS_S3_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.MINIO_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY!,
      },
      endpoint: endpoint ? `http://${endpoint}` : undefined,
      forcePathStyle: !!endpoint, // MinIO uchun true
    });
  }

  async createPresignedUpload(originalName: string, mimeType: string, expiresSec = 60) {
    const key = `${Date.now()}-${randomUUID()}-${originalName}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: expiresSec });
    return { url, key };
  }

  async createPresignedDownload(key: string, expiresSec = 60) {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const url = await getSignedUrl(this.client, command, { expiresIn: expiresSec });
    return url;
  }
}
```

## File controller — presigned endpoints va metadata saqlash
```ts
// file.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { S3Service } from './s3.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('files')
export class FileController {
  constructor(private readonly s3: S3Service) {}

  // 1) Presigned upload: client URL oladi, so'ng to'g'ridan-to'g'ri S3 ga PUT qiladi
  @Post('presigned-upload')
  async presignedUpload(@Body() body: { originalName: string; mimeType: string }, @Req() req) {
    // authdan foydalanuvchi id oling, lekin bu misolda oddiy
    const { url, key } = await this.s3.createPresignedUpload(body.originalName, body.mimeType, 300);
    // metadata DB-ga draft yozish (optional)
    const row = await prisma.file.create({
      data: {
        originalName: body.originalName,
        mimeType: body.mimeType,
        size: 0,
        storageKey: key,
        ownerId: req.user?.id ?? null,
      },
    });
    return { url, key, id: row.id };
  }

  // 2) Presigned download
  @Get('download/:key')
  async download(@Param('key') key: string) {
    const url = await this.s3.createPresignedDownload(key, 300);
    return { url };
  }

  // 3) (Optional) callback / finalize: client notifies server after successful upload to update size/checksum
  @Post('finalize')
  async finalize(@Body() body: { key: string; size: number; checksum?: string }) {
    await prisma.file.updateMany({
      where: { storageKey: body.key },
      data: { size: body.size, checksum: body.checksum },
    });
    return { ok: true };
  }
}
```

> Izoh: presigned upload bilan server fayl oqimi bilan shug‘ullanmaydi —load kamayadi. Client PUT yoki multipart/form-data bilan to‘g‘ridan-to‘g‘ri S3 ga yozadi. Agar siz server orqali o'tib saqlamoqchi bo‘lsangiz, `multer` yoki streaming bilan yuborilgan faylni S3 ga uzatishingiz mumkin.

---

## Direct upload (server orqali) — Multer + streaming
Agar server faylni qabul qilib darhol S3 ga uzatishi kerak bo‘lsa:

```ts
// file-upload.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';

@Controller('upload')
export class UploadController {
  // configure multer to store file in memory or temp disk
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    // file.buffer yoki file.path dan foydalanib S3 ga yozing
    // bu misolda memory storage bilan buffer ishlatiladi
    const s3 = new S3Client({ /* ... */ });
    const key = `${Date.now()}-${file.originalname}`;
    await s3.send(new PutObjectCommand({
      Bucket: process.env.MINIO_BUCKET,
      Key: key,
      Body: file.buffer, // katta fayllarda disk streaming yaxshiroq
      ContentType: file.mimetype
    }));
    // metadata DB saqlash...
    return { key };
  }
}
```

---

# 4) Resumable upload (katta fayllar)
Ikki yondashuv:
- `tus` protokoli (server: `tus-node-server`) — oddiy va standart. Client tarafda `tus-js-client`.
- Chunking + server-side merge: client faylni kichik chunklarga bo‘lib yuboradi (`uploadId`, `index`), server chunklarni storage-ga yoki tempga saqlaydi, so‘ng merge qiladi.

Tavsiya: agar katta fayllar (100MB+) bo‘lsa — `tus` yaxshi tanlov.

---

# 5) docker-compose (dev) — MinIO + Postgres + app
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: files
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - db_data:/var/lib/postgresql/data
  minio:
    image: minio/minio
    command: server /data
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
    volumes:
      - minio_data:/data
  app:
    build: .
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/files
      MINIO_ENDPOINT: minio:9000
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
      MINIO_BUCKET: files
    ports:
      - "3000:3000"
    depends_on:
      - db
      - minio

volumes:
  db_data:
  minio_data:
```

## Dockerfile (NestJS)
```dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

---

# 6) Kubernetes — minimal manifest (Deployment + Service + PVC)
Bu oddiy misol; productionda Ingress, cert-manager, HPA va Secrets qo‘shing.

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: file-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: file-server
  template:
    metadata:
      labels:
        app: file-server
    spec:
      containers:
      - name: app
        image: yourrepo/file-server:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: files-secrets
              key: DATABASE_URL
        - name: MINIO_ENDPOINT
          value: "minio:9000"
---
apiVersion: v1
kind: Service
metadata:
  name: file-server
spec:
  selector:
    app: file-server
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```

---

# 7) Qo‘shimcha xavfsizlik va best-practices
- Auth: JWT bilan barcha upload/download so‘rovlarini tekshiring.
- ACL: public/private fayllar, signed URLs bilan vaqtinchalik ochish.
- Rate limiting va quota: per-user storage quota, per-user request throttling (Nest RateLimiter).
- Virus scanning: yuklangan fayllarni ClamAV bilan skan qiling (background worker).
- Checksums: faylni MD5/SHA256 bilan tekshirish.
- Backups: object storage snapshot yoki S3 lifecycle + versioning.
- HTTPS: presigned va public endpointlar uchun.
- Logging: request/response logging, access logs.
- CORS: agar browser client bo‘lsa, S3 presigned bilan CORS konfiguratsiyasini storage-da qo‘ying.

---

# 8) CI / Deploy misol (GitHub Actions — build & push to Docker registry)
```yaml
name: CI
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: |
          docker build -t ghcr.io/youruser/file-server:${{ github.sha }} .
      - name: Login to GHCR
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GHCR_TOKEN }}
      - name: Push
        run: docker push ghcr.io/youruser/file-server:${{ github.sha }}
```

---

# 9) Qo‘llanma — qachon nima tanlash
- Lokal dev / arzon self-host: MinIO + Postgres + docker-compose.
- Production, ishonchlilik va global CDN: AWS S3 + CloudFront (yordamchi).
- Agar siz own-cloud (o‘z serveringiz) istasangiz: MinIO кластерini k8s da ishlatish va object store sifatida foydalanish.
- Agar siz mobil/web clientlarga tez, to‘g‘ridan-to‘g‘ri yuklash bermoqchi bo‘lsangiz: presigned URLlar eng yengil yechim.

---

Agar xohlasangiz, keyingi qadamlarim quyidagilar bo‘lishi mumkin (eng mosini tanlang — men shundan boshlab konkert kod yozaman):
1. Sizga to‘liq starter repo — NestJS + Prisma + S3Service + endpoints + docker-compose (tayyor fayllar bilan).
2. Resumable upload (tus) misolini integratsiya qilish.
3. MinIO bilan to‘liq ishlovchi demo (docker-compose bilan) — men docker-compose faylini to‘liq yaratib beraman.
4. Kubernetes uchun production-ready manifest + Ingress + cert-manager misoli.

Qaysi variantni xohlaysiz? (1–4 tanlang) yoki to‘g‘ridan-to‘g‘ri `presigned upload + finalize` yoki `server-streaming upload` kodini batafsil yozib beray?

---

### 👤 Foydalanuvchi:

Qanaqa docker oddiy renderga vaqtinchalikga Najot ta'limodagi imtihon loyihasi uchun tlelegram app qilayabman shunga post va get bo'ladi holos

### 🤖 ChatGPT:

Tushunarli 👍 Sizga hozircha **oddiy NestJS + Dockerfile** kerak — faqat `POST` va `GET` API ishlasa bo‘ldi. Render yoki boshqa hostingga qo‘yish uchun yetarli bo‘ladi.  

---

## Minimal NestJS File Server (faqat POST va GET)

### 1. Controller (misol)

```ts
// src/app.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('files')
export class AppController {
  private storage: { id: number; name: string; content: string }[] = [];
  private counter = 1;

  @Post()
  upload(@Body() body: { name: string; content: string }) {
    const file = { id: this.counter++, ...body };
    this.storage.push(file);
    return file;
  }

  @Get()
  list() {
    return this.storage;
  }
}
```

👉 Bu juda sodda variant: fayllar xotirada (`storage` arrayda) saqlanadi.  
Haqiqiy faylni saqlash kerak bo‘lsa — keyinchalik `multer` yoki `S3` qo‘shib olasiz.  

---

### 2. App module

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule {}
```

---

### 3. Dockerfile

Render uchun oddiy Dockerfile:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]

EXPOSE 3000
```

---

### 4. Render sozlash

- Render’da yangi **Web Service** ochasiz.
- GitHub reposini ulaysiz.
- Build command:  
  ```
  npm install && npm run build
  ```
- Start command:  
  ```
  node dist/main.js
  ```
- Port: **3000** (Render avtomatik aniqlaydi).

---

Shu bilan sizda **/files POST** va **/files GET** ishlaydi 🚀  

---

Savolim: Sizga haqiqiy **fayl (rasm, doc, pdf)** yuklash kerakmi yoki shunchaki **JSON (nom, matn)** saqlash/test qilish kifoyami?

---

### 👤 Foydalanuvchi:

oldin file yzishdan boshlaylik




### 🤖 ChatGPT:

Zo‘r ✅ demak, oldin **oddiy fayl yuklash (upload) va olish (download)** qismi qilamiz. Hozircha DB yoki S3 shart emas, fayllarni server papkasida saqlab qo‘yadigan qilib yozamiz. Bu sizning **imtihon loyihangiz uchun eng tez va oddiy variant** bo‘ladi.  

---

## 1. Multer bilan fayl upload qilish
NestJS fayl upload uchun `@nestjs/platform-express` va `multer` ishlatadi.

```bash
npm install @nestjs/platform-express multer
```

---

## 2. Controller (upload va download)

```ts
// src/file.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('files')
export class FileController {
  // Upload qilish
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // fayllar shu papkaga tushadi
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      path: `/files/${file.filename}`,
    };
  }

  // Faylni olish
  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const path = join(process.cwd(), 'uploads', filename);
    if (!existsSync(path)) {
      return res.status(404).send('File not found');
    }
    return res.sendFile(path);
  }
}
```

---

## 3. Module

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
})
export class AppModule {}
```

---

## 4. Dockerfile (Render uchun)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]

EXPOSE 3000
```

---

## 5. Ishlash usuli
- Fayl yuklash:  
  ```
  POST /files/upload
  Form-data: key = "file", value = <your file>
  ```
  ✅ Javobda sizga `filename` va `path` qaytadi.

- Faylni olish:  
  ```
  GET /files/:filename
  ```

Masalan:  
`GET http://localhost:3000/files/1695901234567-photo.png`

---

Shu holatda siz oddiy **upload** va **download** serverga ega bo‘lasiz 🚀  
Keyinchalik uni **DB**, **S3**, yoki **cloud** bilan kengaytirish oson bo‘ladi.  

---

❓ Siz fayllarni hozircha faqat **lokal papkaga** saqlashni xohlaysizmi, yoki darrov **cloudga (masalan Render Storage yoki S3/MinIO)** chiqarmoqchimisiz?

---

### 👤 Foydalanuvchi:


generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model File{
  id BigInt @id @default(autoincrement())
  fileName String
  mimetype String // kb
  fileSize Decimal
  contetType String
  format String
  fileUrl String
  createdAt DateTime @default(now())
  @@map("files")
}


### 🤖 ChatGPT:

Zo‘r boshlabsiz 👌 siz endi fayl ma’lumotlarini (metadata) **Postgres** ichida saqlamoqchisiz. Men tushuntirib beraman: 

---

## 1. Siz yozgan modeldagi xatoliklar
- `mimetype` bilan `contetType` — bir xil narsaga o‘xshaydi. Faqat bittasini qoldirish kifoya.  
- `fileSize Decimal` — bu yerda `Int` ishlatsa ham bo‘ladi, chunki fayl o‘lchami baytda (whole number). `Decimal` odatda pul qiymati uchun.  
- `format` — agar `jpg`, `png`, `pdf` kabilarni nazarda tutsangiz, qolishi mumkin.  
- `fileUrl` — serveringizdagi yo‘l yoki cloud URL.  
- `BigInt` ID yaxshi, chunki fayl ko‘p bo‘lishi mumkin.  

---

## 2. Tozalangan model

```prisma
model File {
  id         BigInt   @id @default(autoincrement())
  fileName   String
  mimeType   String
  fileSize   Int
  format     String
  fileUrl    String
  createdAt  DateTime @default(now())

  @@map("files")
}
```

---

## 3. Upload qilganda saqlash jarayoni
1. Faylni `multer` bilan yuklab olasiz (oldingi kodimdagi kabi).  
2. Yuklab bo‘lgandan keyin Prisma orqali DB ga yozasiz.  

Masalan:

```ts
// file.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PrismaClient } from '@prisma/client';
import { extname } from 'path';

const prisma = new PrismaClient();

@Controller('files')
export class FileController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    const format = extname(file.originalname).replace('.', '');
    const saved = await prisma.file.create({
      data: {
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        format: format,
        fileUrl: `/files/${file.filename}`,
      },
    });
    return saved;
  }
}
```

---

## 4. Foydalanish
- Fayl yuklansa → `uploads/` papkaga tushadi.  
- Shu bilan birga, **DB ga yoziladi** (`files` jadvali).  
- Keyin siz `GET /files/:id` qilib DB dan topib, faylni chiqarishingiz mumkin bo‘ladi.  

---

Sizni qiziqtiradigani — DB da **metadata** saqlashmi yoki faylni **blob sifatida Postgres ichida saqlash**ni ham xohlaysizmi? (Masalan, `Bytea` ustun orqali)

---

### 👤 Foydalanuvchi:

import { ConfigService } from "@nestjs/config";
import { EmailCodeEnum } from "./enum.types";
import { extname, join } from "path";
import { archiveExtensions, documentExtensions, getMymtype, imageExtensions, videoExtensions } from "./filter.file.types";
import { createReadStream, existsSync, mkdirSync } from "fs";
import { Response } from "express";
import { stat } from "fs/promises";
import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas';
import { writeFileSync } from 'fs';

export function urlGenerator(config: ConfigService, param: string): string {
  const extract = extname(param).toLowerCase();

  let serverPath: string;
  if (imageExtensions.includes(extract)) {
    serverPath = "image";
  } else if (videoExtensions.includes(extract)) {
    serverPath = "video";
  } else if (archiveExtensions.includes(extract)) {
    serverPath = "archive";
  } else {
    serverPath = "docs";
  }
  console.log(config)
  const host = config.get<string>("HOST");
  const port = config.get<string>("PORT");
  const baseUrl = config.get<string>("APP_BASE_URL") || `http://${host}:${port}`;

  return `${baseUrl}/api/${serverPath}/${param}`;
}

export function messageGenerator(
  typeMessage: EmailCodeEnum = EmailCodeEnum.REGISTER,
  code: number
): string {
  return `<h1>Your ${typeMessage} verify code 🧐🧐🧐</h1>
            <p>Code: ${code}</p>`;
}


export function getPathInFileType(fileName: string): string {
  const extract = extname(fileName).toLowerCase();
  let filePath: string;

  if (imageExtensions.includes(extract)) {
    filePath = join(process.cwd(), "..", "core", "uploads", "images");
  } else if (videoExtensions.includes(extract)) {
    filePath = join(process.cwd(), "..", "core", "uploads", "videos");
  } else if (documentExtensions.includes(extract)) {
    filePath = join(process.cwd(), "..", "core", "uploads", "docs");
  } else if (archiveExtensions.includes(extract)) {
    filePath = join(process.cwd(), "..", "core", "uploads", "archive");
  } else {
    filePath = join(process.cwd(), "..", "core", "uploads", "unknown");
  }

  if (!existsSync(filePath)) {
    mkdirSync(filePath, { recursive: true });
  }

  return filePath;
}

export async function headerDataStream(
  res: Response,
  filePath: string,
  fileName: string
): Promise<void> {
  try {
    // Fayl mavjudligini tekshirish
    if (!existsSync(filePath)) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const fileSize = (await stat(filePath)).size;
    const range = res.req.headers.range;
    const mimeType = getMymtype(fileName);

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // Range validation
      if (start >= fileSize || end >= fileSize || start > end) {
        res.status(416).json({ error: 'Range not satisfiable' });
        return;
      }

      const chunkSize = end - start + 1;
      const file = createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
      });

      file.pipe(res);

      // Error handling for stream
      file.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error' });
        }
      });

    } else {
      const file = createReadStream(filePath);

      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
      });

      file.pipe(res);

      // Error handling for stream
      file.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error' });
        }
      });
    }

  } catch (error) {
    console.error('File streaming error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}






import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { UnsupportedMediaTypeException } from '@nestjs/common';
import { getPathInFileType } from './generator.types';
import { Request } from 'express';

export const courseFileFields = [
  { name: 'banner', maxCount: 1 },
  { name: 'introVideo', maxCount: 1 },
]

export const fileStorages = (allowedMimes: string[]) => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      console.log("File Storage file ", file)
      const filePath = getPathInFileType(file.originalname);
      cb(null, filePath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: fileFilters(allowedMimes),
});

function fileFilters(allowedMimes: string[]) {
  return (req : Request, file : Express.Multer.File, cb) => {
    const mime = file.mimetype.split('/')[0];
    if(file.fieldname && file.fieldname === 'banner'){
      if(mime !== "image"){
        cb(
          new UnsupportedMediaTypeException("banner type image bo'lishi kerak"),
          false
        )
      }
    }
    if(file.fieldname && file.fieldname === 'introVideo'){
      if(mime !== "video"){
        cb(
          new UnsupportedMediaTypeException("introVideo type video bo'lishi kerak"),
          false
        )
      }
    }
    if (!allowedMimes.includes(mime)) {
      cb(
        new UnsupportedMediaTypeException(
          `Fayl turi [${allowedMimes.join(', ')}] bo'lishi kerak`
        ),
        false,
      );
    } else {
      cb(null, true);
    }
  };
}


import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileStreamService } from './file.stream.service';
import { Public } from 'src/global/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/types/upload_types';


@Public()
@Controller()
export class FileStreamerController {

  constructor(
    private readonly fileService: FileStreamService
  ) { }

  @Get('video/:file')
  async streamVideo(
    @Param('file') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }

  @UseInterceptors(FileInterceptor("avatar",fileStorages(["image"])))
  @Post("avatar")
  writeAvatar(
    @UploadedFile() file : Express.Multer.File
  ){
    return this.fileService.writeFileSerrvice(file.filename)
  }

  @Get('archive/:file')
  async streamArchie(
    @Param('fileName') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }
  
  @Get('image/:file')
  async streamImage(
    @Param('file') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }
  
  @Get('docs/:file')
  async streamDocs(
    @Param('file') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }
}


import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { existsSync } from 'fs';
import { getPathInFileType, headerDataStream, urlGenerator } from "../../common/types/generator.types";
import { join } from "path";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileStreamService {

    constructor(
        private readonly config : ConfigService
    ){}

    async fileStream(
        res: Response,
        fileName: string,
    ) {
        const filePath = join(getPathInFileType(fileName), fileName)
        if (!existsSync(filePath)) {
            return res.status(404).json({ message: 'Video not found' });
        }
        headerDataStream(res, filePath, fileName)
    }

    async writeFileSerrvice(filename : string){
        return urlGenerator(this.config,filename)
    }
}

### 🤖 ChatGPT:

Men tushundim ✅ — siz allaqachon fayl serveringizni **professional tarzda modular** qilib yozib qo‘yibsiz:  

- **`urlGenerator`** → fayl URL yaratadi (image, video, docs, archive ga qarab).  
- **`getPathInFileType`** → fayl extension ga qarab qayerga yozishni aniqlaydi.  
- **`headerDataStream`** → stream qilib qaytaradi (video uchun `range` bilan).  
- **`fileStorages`** → multer uchun storage + filter (image/video ni ajratib turibdi).  
- **`FileStreamerController`** → REST endpointlar (`/video/:file`, `/image/:file`, `/avatar` upload va h.k.).  
- **`FileStreamService`** → fayl oqimini boshqaradi, URL qaytaradi.  

Bu struktura yaxshi ✅. Lekin kod ichida **bir nechta xato va takomillashtirish joylari** bor:  

---

### 1. Parametr nomlari
```ts
@Get('archive/:file')
async streamArchie(
  @Param('fileName') fileName: string,
  @Res() res: Response
)
```
❌ Bu joyda route param `:file` lekin `@Param('fileName')` qilyapsiz. To‘g‘rilash kerak:  
```ts
@Get('archive/:file')
async streamArchie(
  @Param('file') fileName: string,
  @Res() res: Response
)
```

---

### 2. `fileStorages` ichida MIME check
Siz `allowedMimes` ni `image` yoki `video` deb yuboryapsiz. Lekin `file.mimetype` to‘liq bo‘ladi:  
- `image/png`  
- `video/mp4`  

Siz uni `file.mimetype.split('/')[0]` qilib faqat `image` yoki `video` qilyapsiz. Bu yaxshi. Lekin `allowedMimes.includes(mime)` bo‘lsa → faqat `["image"]` yoki `["video"]` berilishi kerak.  
👉 Bu joyda chalkashlik bo‘lmasligi uchun `allowedMimes: ('image' | 'video' | 'application' | 'text')[]` qilib aniq type bersa bo‘ladi.  

---

### 3. Fayl saqlash joyi
Siz faylni quyidagi yo‘lda saqlayapsiz:
```ts
join(process.cwd(), "..", "core", "uploads", "images");
```
Bu joy **dockerda yoki renderda** muammo berishi mumkin. Chunki `..` bilan chiqib ketayapsiz.  
Yaxshisi shunday qiling:  
```ts
join(process.cwd(), "uploads", "images");
```
Shunda har doim `dist/uploads/...` ichida bo‘ladi.  

---

### 4. `FileStreamService.writeFileSerrvice`  
```ts
async writeFileSerrvice(filename : string){
    return urlGenerator(this.config,filename)
}
```
Hozircha faqat URL qaytaradi. Yaxshi, lekin keyinchalik **DB ga yozish (Prisma bilan)** shu yerda qilinsa ham bo‘ladi. Masalan:  

```ts
async writeFileSerrvice(file: Express.Multer.File) {
  const url = urlGenerator(this.config, file.filename);
  await this.prisma.file.create({
    data: {
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      format: extname(file.originalname).replace('.', ''),
      fileUrl: url,
    },
  });
  return url;
}
```

---

### 5. `headerDataStream` da error handling
Siz `file.on('error')` qo‘shibsiz — yaxshi 👌. Lekin `res.writeHead` chaqirilgandan keyin xato bo‘lsa → client tarafda **yarim yuklangan fayl** qolib ketishi mumkin. Shuning uchun `res.destroy(error)` qo‘shib qo‘ysangiz tozaroq bo‘ladi:  

```ts
file.on('error', (error) => {
  console.error('Stream error:', error);
  res.destroy(error);
});
```

---

✅ Umuman olganda sizning file serveringiz **Render’ga chiqarish uchun tayyor**.  
Faqat:
1. Parametr nomlarini tekislash.  
2. Fayl saqlash yo‘lini `..` dan chiqarib tashlash.  
3. `writeFileSerrvice` da DB yozishni qo‘shish.  

---

Savol: Siz **faylni DB ga yozishni** (metadata) shu joyda qo‘shmoqchimisiz, yoki hozircha faqat **serverda saqlab, URL qaytarish** yetarlimi?

---

### 👤 Foydalanuvchi:

allowedMimes: ('image' | 'video' | 'application' | 'text')[]

bu uchun barcha mimie typelarni ber

### 🤖 ChatGPT:

Zo‘r savol berdingiz 👍 Siz aytgan `allowedMimes: ('image' | 'video' | 'application' | 'text')[]` uchun asosiy **mimetype** kategoriyalarni quyidagicha yozish mumkin:  

### To‘liq `mime` kategoriyalari:
```ts
const allowedMimes: ('image' | 'video' | 'audio' | 'text' | 'application' | 'font' | 'model' | 'multipart' | 'message')[] = [
  "image",        // jpg, png, gif, svg, webp, heic va h.k.
  "video",        // mp4, webm, avi, mov, mkv va h.k.
  "audio",        // mp3, wav, ogg, flac, aac va h.k.
  "text",         // plain, css, csv, html, markdown, xml, javascript va h.k.
  "application",  // json, pdf, zip, gzip, msword, vnd.ms-excel, x-www-form-urlencoded va h.k.
  "font",         // woff, woff2, ttf, otf
  "model",        // 3D fayllar (3mf, obj, stl va h.k.)
  "multipart",    // form-data
  "message"       // email (rfc822) va boshqalar
];
```

👉 Eng ko‘p ishlatiladiganlari:  
- **`image`** → avatarlar, rasmlar.  
- **`video`** → intro, video materiallar.  
- **`audio`** → agar ovozli xabar kerak bo‘lsa.  
- **`text`** → `.txt`, `.csv`, `.html`, `.css`, `.js`.  
- **`application`** → `.pdf`, `.zip`, `.json`, `.docx`, `.xlsx`.  

---

❓ Sizning **telegram app** loyihangizda faqat `image`, `video`, `application`, `text` kifoyami yoki `audio` ni ham qo‘shib qo‘yaymi (ovozli habarlar uchun)?

---

### 👤 Foydalanuvchi:


export const imageExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg',
    '.tiff', '.ico', '.jfif', '.pjpeg', '.pjp', '.avif'
];

export const videoExtensions = [
    '.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.webm',
    '.mpeg', '.mpg', '.3gp', '.3g2', '.mts', '.m2ts', '.vob',
    '.ogv', '.ts', '.m4v'
];

export const documentExtensions = ['.pdf','.doc','.docx','.xls','.xlsx','.ppt','.pptx','.txt','.rtf','.odt','.ods','.odp','.md','.csv','.json','.xml','.yml','.yaml','.epub','.js','.ts','.html','.css','.c','.cpp','.h','.hpp','.py','.java','.cs','.go','.rb','.php','.swift','.rs']

export const archiveExtensions = [
    '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz',
    '.iso', '.cab', '.lz', '.lzma', '.z', '.tgz', '.txz'
];


export const mimeTypes: [string, string][] = [
  ['.avi', 'video/x-msvideo'],
  ['.mp4', 'video/mp4'],
  ['.mpeg', 'video/mpeg'],
  ['.webm', 'video/webm'],

  ['.zip', 'application/zip'],
  ['.rar', 'application/vnd.rar'],
  ['.7z', 'application/x-7z-compressed'],
  ['.tar', 'application/x-tar'],
  ['.gz', 'application/gzip'],

  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],

  ['.pdf', 'application/pdf'],
  ['.doc', 'application/msword'],
  ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['.xls', 'application/vnd.ms-excel'],
  ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ['.ppt', 'application/vnd.ms-powerpoint'],
  ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  ['.txt', 'text/plain'],
  ['.md', 'text/markdown'],
  ['.csv', 'text/csv'],
  ['.json', 'application/json'],
  ['.xml', 'application/xml'],
  ['.yaml', 'application/yaml'],

  // Dasturlash tillari
  ['.js', 'application/javascript'],
  ['.ts', 'application/typescript'],
  ['.html', 'text/html'],
  ['.css', 'text/css'],
  ['.c', 'text/x-c'],
  ['.cpp', 'text/x-c'],
  ['.h', 'text/x-c'],
  ['.py', 'text/x-python'],
  ['.java', 'text/x-java-source'],
  ['.cs', 'text/x-csharp'],
  ['.go', 'text/x-go-source'],
  ['.rb', 'text/x-ruby'],
  ['.php', 'application/x-httpd-php'],
  ['.rs', 'text/x-rust']
];


export function getMymtype(fileName: string) {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  const found = mimeTypes.find(([key]) => key === ext);
  return found?.[1] || 'application/octet-stream';
}




buni kengaytirish kerak

### 🤖 ChatGPT:

Ha to‘g‘ri ✅, siz hozir faqat asosiy **image**, **video**, **document**, **archive** va ba’zi **programming file** typelarni qo‘shib qo‘ygansiz. Universal file-server qilish uchun **audio**, **font**, va keng tarqalgan boshqa formatlarni ham qo‘shib qo‘yish kerak.  

Men sizga kengaytirilgan **extensions** va **mimeTypes** massivini tayyorlab beraman 👇  

---

### 🎵 Audio formatlari
```ts
export const audioExtensions = [
  '.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma',
  '.aiff', '.alac', '.amr', '.opus'
];
```

### 🔤 Font formatlari
```ts
export const fontExtensions = [
  '.ttf', '.otf', '.woff', '.woff2', '.eot'
];
```

### 🌍 Extended `mimeTypes`
```ts
export const mimeTypes: [string, string][] = [
  // === Video ===
  ['.avi', 'video/x-msvideo'],
  ['.mp4', 'video/mp4'],
  ['.mpeg', 'video/mpeg'],
  ['.webm', 'video/webm'],
  ['.mkv', 'video/x-matroska'],
  ['.mov', 'video/quicktime'],
  ['.flv', 'video/x-flv'],
  ['.wmv', 'video/x-ms-wmv'],
  ['.3gp', 'video/3gpp'],
  ['.3g2', 'video/3gpp2'],

  // === Audio ===
  ['.mp3', 'audio/mpeg'],
  ['.wav', 'audio/wav'],
  ['.ogg', 'audio/ogg'],
  ['.flac', 'audio/flac'],
  ['.aac', 'audio/aac'],
  ['.m4a', 'audio/mp4'],
  ['.wma', 'audio/x-ms-wma'],
  ['.opus', 'audio/opus'],
  ['.amr', 'audio/amr'],

  // === Image ===
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.bmp', 'image/bmp'],
  ['.ico', 'image/x-icon'],
  ['.tiff', 'image/tiff'],
  ['.avif', 'image/avif'],

  // === Documents ===
  ['.pdf', 'application/pdf'],
  ['.doc', 'application/msword'],
  ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['.xls', 'application/vnd.ms-excel'],
  ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ['.ppt', 'application/vnd.ms-powerpoint'],
  ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  ['.txt', 'text/plain'],
  ['.md', 'text/markdown'],
  ['.csv', 'text/csv'],
  ['.json', 'application/json'],
  ['.xml', 'application/xml'],
  ['.yaml', 'application/x-yaml'],
  ['.yml', 'application/x-yaml'],
  ['.epub', 'application/epub+zip'],

  // === Archives ===
  ['.zip', 'application/zip'],
  ['.rar', 'application/vnd.rar'],
  ['.7z', 'application/x-7z-compressed'],
  ['.tar', 'application/x-tar'],
  ['.gz', 'application/gzip'],
  ['.bz2', 'application/x-bzip2'],
  ['.xz', 'application/x-xz'],
  ['.iso', 'application/x-iso9660-image'],

  // === Fonts ===
  ['.ttf', 'font/ttf'],
  ['.otf', 'font/otf'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.eot', 'application/vnd.ms-fontobject'],

  // === Programming / Code ===
  ['.js', 'application/javascript'],
  ['.ts', 'application/typescript'],
  ['.html', 'text/html'],
  ['.css', 'text/css'],
  ['.c', 'text/x-c'],
  ['.cpp', 'text/x-c++'],
  ['.h', 'text/x-c'],
  ['.hpp', 'text/x-c++'],
  ['.py', 'text/x-python'],
  ['.java', 'text/x-java-source'],
  ['.cs', 'text/x-csharp'],
  ['.go', 'text/x-go'],
  ['.rb', 'text/x-ruby'],
  ['.php', 'application/x-httpd-php'],
  ['.rs', 'text/x-rust'],
  ['.swift', 'text/x-swift'],
  ['.sh', 'application/x-sh']
];
```

---

### 🔧 `getMymtype` funksiyasi avvalgidek qoladi:
```ts
export function getMymtype(fileName: string) {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  const found = mimeTypes.find(([key]) => key === ext);
  return found?.[1] || 'application/octet-stream';
}
```

---

Shunda sizning file-serveringiz:  
- **Rasm** (image/*)  
- **Video** (video/*)  
- **Audio** (audio/*)  
- **Hujjat** (application/*, text/*)  
- **Arxiv** (application/zip va boshqalar)  
- **Font** (font/*)  
- **Dastur kodlari** (.js, .py, .java va h.k.)  

hammasini to‘g‘ri `mimetype` bilan qaytaradi ✅

---

❓ Sizga buni **kategoriya bo‘yicha guruhlab** (imageExtensions, videoExtensions, audioExtensions, documentExtensions, archiveExtensions, fontExtensions) qilib chiqaymi yoki faqat **bitta umumiy mimeTypes** ro‘yxati yetarlimi?

---

### 👤 Foydalanuvchi:

  // === Programming / Code ===
  ['.js', 'application/javascript'],
  ['.ts', 'application/typescript'],
  ['.html', 'text/html'],
  ['.css', 'text/css'],
  ['.c', 'text/x-c'],
  ['.cpp', 'text/x-c++'],
  ['.h', 'text/x-c'],
  ['.hpp', 'text/x-c++'],
  ['.py', 'text/x-python'],
  ['.java', 'text/x-java-source'],
  ['.cs', 'text/x-csharp'],
  ['.go', 'text/x-go'],
  ['.rb', 'text/x-ruby'],
  ['.php', 'application/x-httpd-php'],
  ['.rs', 'text/x-rust'],
  ['.swift', 'text/x-swift'],
  ['.sh', 'application/x-sh']

buni kengaytirib ber

### 🤖 ChatGPT:

Zo‘r joyini ushlabsiz 👌 “Programming / Code” bo‘limini kengaytirib bersam, sizning file-serveringiz deyarli barcha asosiy tillar va skript formatlarini to‘g‘ri `mimetype` bilan ishlay oladi.  

Mana kengaytirilgan ro‘yxat:  

```ts
// === Programming / Code ===
export const codeMimeTypes: [string, string][] = [
  // Web
  ['.js', 'application/javascript'],
  ['.mjs', 'application/javascript'],
  ['.cjs', 'application/javascript'],
  ['.ts', 'application/typescript'],
  ['.tsx', 'text/tsx'],
  ['.jsx', 'text/jsx'],
  ['.html', 'text/html'],
  ['.css', 'text/css'],
  ['.scss', 'text/x-scss'],
  ['.sass', 'text/x-sass'],
  ['.less', 'text/x-less'],

  // C family
  ['.c', 'text/x-c'],
  ['.cpp', 'text/x-c++'],
  ['.cc', 'text/x-c++'],
  ['.cxx', 'text/x-c++'],
  ['.h', 'text/x-c'],
  ['.hpp', 'text/x-c++'],
  ['.hh', 'text/x-c++'],

  // Java / Kotlin
  ['.java', 'text/x-java-source'],
  ['.kt', 'text/x-kotlin'],
  ['.kts', 'text/x-kotlin-script'],

  // C#
  ['.cs', 'text/x-csharp'],

  // Python
  ['.py', 'text/x-python'],
  ['.pyw', 'text/x-python'],
  ['.pyi', 'text/x-python'],

  // Go
  ['.go', 'text/x-go'],

  // Ruby
  ['.rb', 'text/x-ruby'],
  ['.erb', 'text/x-ruby'],

  // PHP
  ['.php', 'application/x-httpd-php'],
  ['.phtml', 'application/x-httpd-php'],

  // Rust
  ['.rs', 'text/x-rust'],

  // Swift
  ['.swift', 'text/x-swift'],

  // Shell / Bash
  ['.sh', 'application/x-sh'],
  ['.bash', 'application/x-sh'],
  ['.zsh', 'application/x-sh'],

  // Perl
  ['.pl', 'text/x-perl'],
  ['.pm', 'text/x-perl'],

  // R
  ['.r', 'text/x-r-source'],
  ['.rmd', 'text/x-r-markdown'],

  // Lua
  ['.lua', 'text/x-lua'],

  // Haskell
  ['.hs', 'text/x-haskell'],
  ['.lhs', 'text/x-haskell'],

  // Scala
  ['.scala', 'text/x-scala'],
  ['.sc', 'text/x-scala'],

  // Elixir
  ['.ex', 'text/x-elixir'],
  ['.exs', 'text/x-elixir'],

  // Erlang
  ['.erl', 'text/x-erlang'],
  ['.hrl', 'text/x-erlang'],

  // Dart
  ['.dart', 'text/x-dart'],

  // SQL
  ['.sql', 'application/sql'],

  // YAML / TOML / INI
  ['.yaml', 'application/x-yaml'],
  ['.yml', 'application/x-yaml'],
  ['.toml', 'application/toml'],
  ['.ini', 'text/plain'],

  // JSON
  ['.json', 'application/json'],
  ['.json5', 'application/json'],

  // Markdown
  ['.md', 'text/markdown'],
  ['.markdown', 'text/markdown'],

  // Configs / Misc
  ['.env', 'text/plain'],
  ['.lock', 'text/plain'],
  ['.gitignore', 'text/plain'],
];
```

---

⚡ Endi sizning file-serveringiz quyidagilarni qamrab oladi:  
- **Frontend tillari** (js, ts, jsx, tsx, css, scss, html)  
- **Backend tillari** (java, kotlin, c#, python, go, ruby, php, rust, swift, dart)  
- **Scriptlar** (bash, shell, zsh, perl, lua)  
- **Functional** (haskell, scala, elixir, erlang)  
- **Configlar** (yaml, toml, ini, env, json, md)  

---

❓ Siz xohlaysizmi men buni **mimeTypes** ichiga qo‘shib yuborib bitta to‘liq `mimeTypes` array qilib beray yoki alohida `codeMimeTypes` qilib saqlagan yaxshi bo‘ladimi?

---

