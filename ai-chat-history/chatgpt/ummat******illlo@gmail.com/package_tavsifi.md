# Package tavsifi

### 👤 Foydalanuvchi:

    npm i @amirrivand/nestjs-file-storage


Bu package nima qiladi

### 🤖 ChatGPT:

search("    npm i @amirrivand/nestjs-file-storage\n\n\nBu package nima qiladi")

---

### 🤖 ChatGPT:

`@amirrivand/nestjs-file-storage` — bu NestJS uchun kuchli va ko‘p drayverli fayl saqlash yechimi bo‘lib, Laravel Flysystem’dan ilhomlangan. U fayllarni turli saqlash tizimlariga (masalan, FTP, S3, Dropbox, Google Drive) uzatish va ulardan foydalanishni soddalashtiradi.

### 📦 Paketning asosiy xususiyatlari:

- **Ko‘p drayverli qo‘llab-quvvatlash**: FTP, S3, Dropbox, Google Drive kabi saqlash tizimlari bilan ishlash imkonini beradi.
- **Fayl uzatish va olish**: Fayllarni turli saqlash tizimlariga uzatish va ularni olishni osonlashtiradi.
- **Laravel Flysystem’dan ilhomlangan**: Flysystem kabi tizimlar yordamida fayl saqlashni soddalashtiradi.

### 🛠️ O‘rnatish:

```bash
npm install @amirrivand/nestjs-file-storage
```


### ⚙️ Foydalanish:

```typescript
import { Module } from '@nestjs/common';
import { FileStorageModule } from '@amirrivand/nestjs-file-storage';

@Module({
  imports: [
    FileStorageModule.register({
      default: 'local',
      disks: {
        local: {
          driver: 'local',
          root: './uploads',
        },
        s3: {
          driver: 's3',
          key: 'your-key',
          secret: 'your-secret',
          bucket: 'your-bucket',
          region: 'your-region',
        },
      },
    }),
  ],
})
export class AppModule {}
```


Ushbu modul fayl saqlashni turli tizimlarda bir xil API orqali amalga oshirish imkonini beradi.

### 🔗 Qo‘shimcha ma’lumot:

- Paketning rasmiy sahifasi: [npmjs.com/package/@amirrivand/nestjs-file-storage](https://www.npmjs.com/package/@amirrivand/nestjs-file-storage)
- Flysystem haqida qo‘shimcha ma’lumot: [Flysystem GitHub sahifasi](https://github.com/thephpleague/flysystem)

Agar sizga fayl saqlash tizimlarini NestJS bilan integratsiya qilishda yordam kerak bo‘lsa, bu paket juda foydali bo‘lishi mumkin. 

---

### 👤 Foydalanuvchi:

men  o'zim uploads service yozdim  yani  file-service/mimie type/write    file-service/mime-type/filename 



### 🤖 ChatGPT:

Ah, tushundim! Siz **o‘zingizning uploads service** yaratgansiz va fayllarni **`file-service/mime-type/filename`** ko‘rinishida saqlayapsiz. 📝  

Bu holatda siz allaqachon quyidagilarni qilgansiz:  

1. **MIME type bo‘yicha folderlash** – masalan:  
```
file-service/image/photo.jpg
file-service/video/video.mp4
```
2. **Fayl yozish (write) logikasi** – fayl qayerga va qanday nom bilan yozilishini hal qilganingiz.  
3. **Faylga kirish (read) yoki URL yaratish** – kerak bo‘lsa, faylni olish yoki public URL berish.  

💡 Shu narsani hisobga olsak, `@amirrivand/nestjs-file-storage` kabi paketni ishlatishingiz shart emas, chunki siz **all-in-one, custom fayl storage** yozgansiz.  

**Farqi shundaki:**  
- Sizning service’ngiz **faqat local storage** bilan ishlaydi va siz logikani qo‘lda yozibsiz.  
- `nestjs-file-storage` esa **ko‘p drayverli va konfiguratsiya orqali** ishlaydi, S3, FTP, Dropbox kabi turli saqlash tizimlarini bitta API orqali qo‘llaydi.  

Agar xohlaysiz, men sizning hozirgi uploads service’ni `nestjs-file-storage` ga o‘xshash **multi-driver yoki abstraction layer** bilan yangilab, S3 yoki Google Drive ham qo‘shishni ko‘rsatib bera olaman.  

Shuni qilaylikmi?

---

### 👤 Foydalanuvchi:

endi shuni  Backend loyihamda  qanday ishlatsam bo'ladi

### 🤖 ChatGPT:

Zo‘r! Siz allaqachon **local uploads service** yozgansiz, endi uni **NestJS backend loyihangizda** ishlatish uchun quyidagicha struktura va integratsiya qilishingiz mumkin. Men sizga to‘liq yo‘riqnoma beraman.  

---

## 1️⃣ Service tuzilishi

Sizning service fayllarni MIME type bo‘yicha saqlaydi, masalan:

```
file-service/
 ├─ file.service.ts
 ├─ file.controller.ts
 └─ file.module.ts
```

---

### `file.service.ts`
```ts
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  private basePath = './uploads'; // Asosiy uploads folder

  // Fayl saqlash
  async saveFile(file: Express.Multer.File, mimeType: string): Promise<string> {
    const folderPath = join(this.basePath, mimeType);
    await fs.mkdir(folderPath, { recursive: true }); // folderni yaratish
    const filePath = join(folderPath, file.originalname);
    await fs.writeFile(filePath, file.buffer);
    return filePath; // yoki public URL qaytarish
  }

  // Fayl olish
  async getFile(mimeType: string, filename: string): Promise<Buffer> {
    const filePath = join(this.basePath, mimeType, filename);
    return fs.readFile(filePath);
  }
}
```

---

### `file.controller.ts`
```ts
import { Controller, Post, UploadedFile, UseInterceptors, Param, Get, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Response } from 'express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // MIME type bo'yicha folder yaratish
    const mimeType = file.mimetype.split('/')[0]; // image, video, text...
    const savedPath = await this.fileService.saveFile(file, mimeType);
    return { path: savedPath };
  }

  @Get(':mimeType/:filename')
  async getFile(@Param('mimeType') mimeType: string, @Param('filename') filename: string, @Res() res: Response) {
    const fileBuffer = await this.fileService.getFile(mimeType, filename);
    res.send(fileBuffer);
  }
}
```

---

### `file.module.ts`
```ts
import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
```

---

## 2️⃣ AppModule’da import qilish
```ts
import { Module } from '@nestjs/common';
import { FileModule } from './file-service/file.module';

@Module({
  imports: [FileModule],
})
export class AppModule {}
```

---

## 3️⃣ Frontend orqali foydalanish

- Fayl yuklash:
```
POST /files/upload
FormData: file=<file>
```

- Faylni olish:
```
GET /files/image/photo.jpg
```

---

💡 **Qo‘shimcha maslahatlar:**
1. Agar loyihangizda S3 yoki boshqa remote storage ishlatmoqchi bo‘lsangiz, `FileService` ni abstraction qiling va `saveFile` metodini driver parametriga qarab sozlang.  
2. Fayllar uchun unique filename yaratish (`uuid`) tavsiya qilinadi, xatoliklarni va overwrite’ni oldini olish uchun.  

---

Agar xohlasang, men senga **hozirgi local storage service’ni S3 va Google Drive bilan ishlaydigan ko‘p-drayverli version** qilib tayyorlab beraman, shunda kelajakda storage o‘zgarsa code o‘zgarmaydi.  

Shuni qilaylikmi?

---

### 👤 Foydalanuvchi:

menda   file-service ushun url bor misol uchun   http://localhost:4545/point
edi  flistorageda qanday foydalanaman

### 🤖 ChatGPT:

Ah, endi tushundim! Sizda **local `file-service` uchun URL** bor:  

```
http://localhost:4545/point
```

Va siz xohlaysizki, shu URL orqali fayllarni **@amirrivand/nestjs-file-storage** (`flistorage`) bilan ishlatasiz. Keling, bosqichma-bosqich ko‘rib chiqamiz.  

---

## 1️⃣ NestJS FileStorage konfiguratsiyasi

`flistorage` **multi-driver** modul bo‘lib, siz uni **HTTP/REST endpoint** orqali ishlatishingiz mumkin. Lekin, package asosan **storage driver** bilan ishlaydi (local, S3, FTP va hokazo).  

Sizning holatda, siz **remote HTTP URL** bilan ishlashni xohlaysiz. Buning uchun quyidagilar qilinadi:

```ts
import { Module } from '@nestjs/common';
import { FileStorageModule } from '@amirrivand/nestjs-file-storage';

@Module({
  imports: [
    FileStorageModule.register({
      default: 'local',
      disks: {
        local: {
          driver: 'local',
          root: './uploads', // local storage path
        },
        pointService: {
          driver: 'http', // bu yerda custom HTTP driver kerak bo'ladi
          baseUrl: 'http://localhost:4545/point', // sizning service URL
        },
      },
    }),
  ],
})
export class AppModule {}
```

💡 Lekin `@amirrivand/nestjs-file-storage` rasmiy dokumentatsiyasida **HTTP/REST endpoint driver** yo‘qligi mumkin. U asosan `local`, `S3`, `FTP`, `Dropbox` kabi storage drayverlarini qo‘llaydi.  

---

## 2️⃣ Amal qiladigan yechim

Sizning holatda eng sodda yo‘l:

1. `file-service` HTTP URL orqali fayllarni oladi yoki yuklaydi.  
2. `flistorage` esa sizning **local storage** driver sifatida ishlaydi.  

Demak, siz shunchaki:

```ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PointStorageService {
  private baseUrl = 'http://localhost:4545/point';

  async uploadFile(file: Express.Multer.File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const res = await axios.post(this.baseUrl, formData, {
      headers: formData.getHeaders(),
    });

    return res.data; // http://localhost:4545/point/filename
  }

  async getFile(filename: string): Promise<Buffer> {
    const res = await axios.get(`${this.baseUrl}/${filename}`, {
      responseType: 'arraybuffer',
    });
    return res.data;
  }
}
```

- Shu usul bilan siz `@amirrivand/nestjs-file-storage` o‘rniga **HTTP client** orqali `file-service` bilan ishlaysiz.  
- Agar kelajakda sizga S3, FTP yoki boshqa drayver kerak bo‘lsa, `flistorage` modulini qo‘shib, abstraction yaratishingiz mumkin.  

---

Agar xohlasang, men sizga **local file-service URL va flistorage abstraction layer** bilan ishlaydigan kodni tayyorlab beraman, shunda siz bir xil API orqali **local + remote service** ishlatishingiz mumkin bo‘ladi.  

Shuni qilaylikmi?

---

