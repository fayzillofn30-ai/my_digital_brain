# Service function optimizatsiyasi

### 👤 Foydalanuvchi:

Salom

### 🤖 ChatGPT:

Salom, Fayzillo! 😊 Qandaysiz, ishlar yaxshimi?

---

### 👤 Foydalanuvchi:

import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { UpdateGroupeDto } from './dto/update-groupe.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Course, Staff } from '@prisma/client';

export function checkStartDate(date: string) {

  const today = new Date()
  const startDate = new Date(date)
  if(today > startDate) {
    throw new BadRequestException("Startdate is missing  grethen today ")
  }
}

@Injectable()
export class GroupesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  async create(data: CreateGroupeDto) {
    const { courseId, romId, teacherId } = data

    const teacher = await checkExistsResurs<Staff>(this.prisma, ModelsEnumInPrisma.STAFF, "id", teacherId)
    if (teacher.isDeleted) throw new BadRequestException(`Staff is Deleted by id [${teacherId}]`)
    if (teacher.role !== "TEACHER") throw new BadGatewayException("Exist staff role not TEACHER ")

    const course = await checkExistsResurs<Course>(this.prisma, ModelsEnumInPrisma.COURSES, "id", courseId)
    if (!course.published) throw new BadGatewayException(`Course [${course.name}] not published !`)

    checkStartDate(data.startDate)

    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.GROUP, "name", data.name)
    const newGroup = await this.prisma.group.create({
      data: data
    })
    return {
      message: 'This action adds a new groupe',
      group: newGroup
    };
  }

  async findAll() {
    return `This action returns all groupes`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} groupe`;
  }

  async update(id: number, updateGroupeDto: UpdateGroupeDto) {
    return `This action updates a #${id} groupe`;
  }

  async remove(id: number) {
    return `This action removes a #${id} groupe`;
  }
}


bu serviceni yakunlash kerak


// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // yoki mysql, sqlite — sizga mosini qo‘ying
  url      = env("DATABASE_URL")
}

enum RoleStafs {
  ADMIN
  TEACHER
  ASISTANT
  STUDENT
}

enum PaymentStatus {
  PENDING
  SUCCESS
  CANCEL
}

enum Days {
  Monday
  Sunday
  Wensday
  Thusday
}

model Rom {
  id        String  @id @default(uuid())
  name      String
  romNumber Int
  pleaces   Int
  isOpen    Boolean @default(true)
  Group     Group[]
}

model Course {
  id            String  @id @default(uuid())
  name          String
  price         Int
  published     Boolean @default(false)
  durationMont  Int     @default(3)
  weekDays      Int[]   @default([1, 3, 5])
  durationMinut Int
  groupes       Group[] // 1-to-many relationship

  image String?

  @@map("courses")
}

model Group {
  id   String @id @default(uuid())
  name String

  teacherId String
  courseId  String
  romId     String

  isEnd   Boolean @default(false)
  isStart Boolean @default(false)

  startDate DateTime

  teacher      Staff          @relation(fields: [teacherId], references: [id])
  course       Course         @relation(fields: [courseId], references: [id])
  students     StudentGroup[]
  Lesson       Lesson[]
  GroupPayment GroupPayment[]
  rom          Rom            @relation(fields: [romId], references: [id])

  @@map("groupes")
}

model Staff {
  id              String           @id @default(uuid())
  email           String
  phone           String?
  password        String  

  firstName       String
  lastName        String
  
  father          String?
  image           String?

  birthDay        DateTime
  role            RoleStafs        @default(STUDENT)
  isDeleted       Boolean          @default(false)
  
  createdAt       DateTime         @default(now())
  
  groupes         Group[]
  studentGroup    StudentGroup[]
  Lesson          Lesson[]
  Attendentionals Attendentional[]
  GroupPayment    GroupPayment[]

  @@map("staffs")
}

model StudentGroup {
  id        String @id @default(uuid())
  studentId String
  groupId   String

  student Staff @relation(fields: [studentId], references: [id])
  group   Group @relation(fields: [groupId], references: [id])

  @@map("student_group")
}

model Lesson {
  id        String @id @default(uuid())
  groupId   String
  teacherId String

  lessonNumber Int

  startDate DateTime
  endDate   DateTime

  teacher         Staff            @relation(fields: [teacherId], references: [id])
  group           Group            @relation(fields: [groupId], references: [id])
  Attendentionals Attendentional[]

  @@map("lessons")
}

model Attendentional {
  id          String    @id @default(uuid())
  lessonId    String
  studentId   String
  kelganVaqti DateTime?
  kelgan      Boolean   @default(false)

  lesson  Lesson @relation(fields: [lessonId], references: [id])
  student Staff  @relation(fields: [studentId], references: [id])

  @@map("attendentionals")
}

model GroupPayment {
  id           String        @id @default(uuid())
  amount       Int
  status       PaymentStatus @default(PENDING)
  paymentMonth Int

  studentId String
  groupId   String

  paymentDate DateTime

  student Staff @relation(fields: [studentId], references: [id])
  group   Group @relation(fields: [groupId], references: [id])

  @@map("group_payments")
}



tekshiruvlarni kuchaytirish kerak 

deleteda  agar boshqa bog'langan releationlar bo'lsa error

### 🤖 ChatGPT:

Zo‘r, Fayzillo 👌 — sening **`GroupesService`** koding juda yaxshi boshlangan. Quyida men uni **to‘liq yakunlab**, barcha kerakli **tekshiruvlar, xatoliklar, va `delete` uchun relation-check** bilan to‘liq ishlaydigan professional shaklga keltirdim.  

---

## ✅ To‘liq `groupes.service.ts` versiyasi

```ts
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { UpdateGroupeDto } from './dto/update-groupe.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {
  checAlreadykExistsResurs,
  checkExistsResurs,
} from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Course, Staff, Group } from '@prisma/client';

export function checkStartDate(date: string) {
  const today = new Date();
  const startDate = new Date(date);
  if (today > startDate) {
    throw new BadRequestException('StartDate must be greater than today');
  }
}

@Injectable()
export class GroupesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * CREATE GROUP
   */
  async create(data: CreateGroupeDto) {
    const { courseId, romId, teacherId } = data;

    // === CHECK TEACHER ===
    const teacher = await checkExistsResurs<Staff>(
      this.prisma,
      ModelsEnumInPrisma.STAFF,
      'id',
      teacherId,
    );
    if (teacher.isDeleted)
      throw new BadRequestException(`Staff [${teacherId}] is deleted`);
    if (teacher.role !== 'TEACHER')
      throw new BadGatewayException(
        `Staff role must be TEACHER, got ${teacher.role}`,
      );

    // === CHECK COURSE ===
    const course = await checkExistsResurs<Course>(
      this.prisma,
      ModelsEnumInPrisma.COURSES,
      'id',
      courseId,
    );
    if (!course.published)
      throw new BadGatewayException(`Course [${course.name}] not published`);

    // === CHECK ROOM ===
    const rom = await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.ROM,
      'id',
      romId,
    );
    if (!rom.isOpen)
      throw new BadRequestException(`Room [${rom.name}] is closed`);

    // === DATE VALIDATION ===
    checkStartDate(data.startDate);

    // === CHECK DUPLICATE GROUP NAME ===
    await checAlreadykExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.GROUP,
      'name',
      data.name,
    );

    // === CREATE NEW GROUP ===
    const newGroup = await this.prisma.group.create({
      data,
      include: {
        course: true,
        teacher: true,
        rom: true,
      },
    });

    return {
      message: 'New group created successfully',
      group: newGroup,
    };
  }

  /**
   * FIND ALL GROUPS
   */
  async findAll() {
    const groupes = await this.prisma.group.findMany({
      include: {
        teacher: {
          select: { id: true, firstName: true, lastName: true },
        },
        course: {
          select: { id: true, name: true, price: true },
        },
        rom: {
          select: { id: true, name: true, pleaces: true },
        },
        students: {
          select: { studentId: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return {
      count: groupes.length,
      groupes,
    };
  }

  /**
   * FIND ONE GROUP
   */
  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        course: true,
        teacher: true,
        rom: true,
        students: {
          include: { student: true },
        },
      },
    });

    if (!group) throw new NotFoundException(`Group [${id}] not found`);

    return group;
  }

  /**
   * UPDATE GROUP
   */
  async update(id: string, dto: UpdateGroupeDto) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group) throw new NotFoundException(`Group [${id}] not found`);

    // StartDate validation (optional update)
    if (dto.startDate) checkStartDate(dto.startDate);

    const updated = await this.prisma.group.update({
      where: { id },
      data: dto,
    });

    return {
      message: 'Group updated successfully',
      group: updated,
    };
  }

  /**
   * DELETE GROUP
   * Prevent deletion if relations exist (students, lessons, payments)
   */
  async remove(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        students: true,
        Lesson: true,
        GroupPayment: true,
      },
    });

    if (!group) throw new NotFoundException(`Group [${id}] not found`);

    const hasRelations =
      group.students.length > 0 ||
      group.Lesson.length > 0 ||
      group.GroupPayment.length > 0;

    if (hasRelations) {
      throw new ConflictException(
        `Cannot delete group [${group.name}] because it has related students, lessons, or payments.`,
      );
    }

    await this.prisma.group.delete({ where: { id } });

    return {
      message: `Group [${group.name}] deleted successfully`,
    };
  }
}
```

---

## 🔍 Qo‘shimcha tushuntirishlar:

| Qism | Tavsif |
|------|---------|
| `checkStartDate()` | Guruh boshlanish sanasini tekshiradi (kech bo‘lmasligi kerak). |
| `create()` |  `teacher`, `course`, `rom` va `name` uchun tekshiruvlar bilan yangi guruh yaratadi. |
| `findAll()` | Barcha guruhlarni kurs, o‘qituvchi, xona, talabalar bilan birga qaytaradi. |
| `findOne()` | ID orqali to‘liq guruh ma’lumotini qaytaradi. |
| `update()` | Guruhni yangilaydi, sanani ham tekshiradi. |
| `remove()` | Guruhni faqat **bog‘liq `students`, `lessons`, yoki `payments` bo‘lmasa** o‘chiradi. Aks holda `ConflictException`. |

---

Agar xohlasang, men senga shu servisega mos **Controller** va **DTO (`CreateGroupeDto` / `UpdateGroupeDto`)** fayllarini ham yozib beraman — REST API sifatida to‘liq ishlaydigan qilib.  

👉 Davom etaymi shu yo‘nalishda?

---

### 👤 Foydalanuvchi:

responseni bitta formatda qaytarish uchun  returGroupdata  function va  include uchun maxsus entity yozib ber functionlar ichida faqat chaqirib ishlatishim kerak  service functionlarni qatorini kamaytirish kerak

### 🤖 ChatGPT:

Zo‘r, Fayzillo 🔥 — bu juda professional yondashuv:  
**1️⃣ — har bir joyda response formatni bir xil qilish**  
**2️⃣ — service ichidagi kodni tozalash (reusable functionlar bilan)**  

Shuning uchun quyida senga **optimal, modulli, va chiroyli** shakldagi yakuniy tuzilmani ko‘rsataman 👇

---

## 📁 Strukturani tavsiya

```
src/
 ├─ modules/groupes/
 │   ├─ dto/
 │   │   ├─ create-groupe.dto.ts
 │   │   ├─ update-groupe.dto.ts
 │   ├─ entities/
 │   │   └─ groupe.entity.ts     👈 include lar shu yerda
 │   ├─ utils/
 │   │   ├─ return-group-data.ts 👈 response format function
 │   ├─ groupes.service.ts       👈 faqat chaqiradi
 │   └─ groupes.controller.ts
```

---

## ✅ `entities/groupe.entity.ts`

Bu faylda `include` uchun yagona obyekt bo‘ladi:

```ts
// src/modules/groupes/entities/groupe.entity.ts
export const groupInclude = {
  course: {
    select: { id: true, name: true, price: true },
  },
  teacher: {
    select: { id: true, firstName: true, lastName: true, phone: true },
  },
  rom: {
    select: { id: true, name: true, pleaces: true, isOpen: true },
  },
  students: {
    include: {
      student: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  },
  Lesson: {
    select: { id: true, lessonNumber: true, startDate: true },
  },
  GroupPayment: {
    select: { id: true, amount: true, status: true, paymentMonth: true },
  },
};
```

---

## ✅ `utils/return-group-data.ts`

Bu helper — har doim response bir xil formatda bo‘ladi.

```ts
// src/modules/groupes/utils/return-group-data.ts

export function returnGroupData(
  data: any,
  message = 'Success',
  meta: Record<string, any> = {},
) {
  return {
    success: true,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
    data,
  };
}
```

---

## ✅ `groupes.service.ts`

Endi service **minimal va toza** bo‘ladi — har joyda  
`groupInclude` va `returnGroupData()` dan foydalanamiz 👇

```ts
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { UpdateGroupeDto } from './dto/update-groupe.dto';
import {
  checAlreadykExistsResurs,
  checkExistsResurs,
} from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Course, Staff } from '@prisma/client';
import { groupInclude } from './entities/groupe.entity';
import { returnGroupData } from './utils/return-group-data';

function checkStartDate(date: string) {
  const today = new Date();
  const start = new Date(date);
  if (today > start)
    throw new BadRequestException('StartDate must be greater than today');
}

@Injectable()
export class GroupesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** CREATE */
  async create(data: CreateGroupeDto) {
    const { teacherId, courseId, romId } = data;

    const teacher = await checkExistsResurs<Staff>(
      this.prisma,
      ModelsEnumInPrisma.STAFF,
      'id',
      teacherId,
    );
    if (teacher.isDeleted)
      throw new BadRequestException(`Staff [${teacherId}] is deleted`);
    if (teacher.role !== 'TEACHER')
      throw new BadGatewayException('Staff must be TEACHER');

    const course = await checkExistsResurs<Course>(
      this.prisma,
      ModelsEnumInPrisma.COURSES,
      'id',
      courseId,
    );
    if (!course.published)
      throw new BadGatewayException(`Course [${course.name}] not published`);

    const rom = await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.ROM,
      'id',
      romId,
    );
    if (!rom.isOpen)
      throw new BadRequestException(`Room [${rom.name}] is closed`);

    checkStartDate(data.startDate);

    await checAlreadykExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.GROUP,
      'name',
      data.name,
    );

    const group = await this.prisma.group.create({
      data,
      include: groupInclude,
    });

    return returnGroupData(group, 'Group created successfully');
  }

  /** FIND ALL */
  async findAll() {
    const groupes = await this.prisma.group.findMany({
      include: groupInclude,
      orderBy: { startDate: 'desc' },
    });
    return returnGroupData(groupes, 'All groupes fetched', {
      count: groupes.length,
    });
  }

  /** FIND ONE */
  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: groupInclude,
    });
    if (!group) throw new NotFoundException(`Group [${id}] not found`);
    return returnGroupData(group, 'Single group fetched');
  }

  /** UPDATE */
  async update(id: string, dto: UpdateGroupeDto) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group) throw new NotFoundException(`Group [${id}] not found`);
    if (dto.startDate) checkStartDate(dto.startDate);

    const updated = await this.prisma.group.update({
      where: { id },
      data: dto,
      include: groupInclude,
    });

    return returnGroupData(updated, 'Group updated successfully');
  }

  /** REMOVE */
  async remove(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { students: true, Lesson: true, GroupPayment: true },
    });
    if (!group) throw new NotFoundException(`Group [${id}] not found`);

    const hasRelations =
      group.students.length || group.Lesson.length || group.GroupPayment.length;

    if (hasRelations)
      throw new ConflictException(
        `Cannot delete group [${group.name}] — has related records`,
      );

    await this.prisma.group.delete({ where: { id } });

    return returnGroupData(
      null,
      `Group [${group.name}] deleted successfully`,
    );
  }
}
```

---

## 📦 Endi natija (har bir methodda):

```json
{
  "success": true,
  "message": "Group created successfully",
  "timestamp": "2025-10-19T09:11:00.412Z",
  "data": {
    "id": "uuid",
    "name": "Frontend 2025",
    "course": { "id": "...", "name": "React", "price": 250 },
    "teacher": { "id": "...", "firstName": "Ali" },
    "rom": { "id": "...", "name": "Room 1" },
    "students": [],
    "Lesson": [],
    "GroupPayment": []
  }
}
```

---

Agar xohlasang, keyingi qadam sifatida:
- `groupInclude` ni **dinamik qilish** (masalan, `?includeStudents=false` query bilan),
- yoki `returnGroupData()` ni **interceptor** (NestJS ResponseInterceptor) sifatida ko‘chirib chiqish mumkin.

Shularni qilaymi?

---

### 👤 Foydalanuvchi:

{
  "count": 1,
  "groupes": [
    {
      "id": "6d8ffbd5-5a81-4627-824a-a11ada76de0c",
      "name": "Group name",
      "courseId": "4f3a3bf8-bfe1-4bbe-b575-95a8f72c1741",
      "isEnd": false,
      "isStart": false,
      "romId": "786e766a-3469-4604-b659-fbe5ce927157",
      "startDate": "2025-10-20T08:00:00.000Z",
      "teacherId": "0e1d34a7-d601-49c0-8be3-830f996047db",
      "_count": {
        "students": 0,
        "Lesson": 0,
        "GroupPayment": 0
      },
      "teacher": {
        "id": "0e1d34a7-d601-49c0-8be3-830f996047db",
        "firstName": "Fayzillo",
        "lastName": "Ummatov",
        "image": "api/image/1760822522065-874764246.png",
        "isDeleted": false
      },
      "course": {
        "id": "4f3a3bf8-bfe1-4bbe-b575-95a8f72c1741",
        "name": "Backend",
        "price": 150000,
        "durationMinut": 90,
        "durationMont": 4,
        "image": "api/image/1760864734184-748535357.png",
        "published": true,
        "weekDays": [
          1,
          3,
          5
        ]
      },
      "rom": {
        "id": "786e766a-3469-4604-b659-fbe5ce927157",
        "name": "Room A-101",
        "pleaces": 30,
        "isOpen": true,
        "romNumber": 101
      },
      "students": [],
      "GroupPayment": []
    }
  ]
}



### 🤖 ChatGPT:

Zo‘r 🔥 — bu JSON natija juda yaxshi formatlangan!  
Ko‘rinishidan sen `findAll()` endpoint natijasini ko‘rsatyapsan, to‘liq `include` ishlayapti ✅  

Endi agar maqsading:  
👉 **har bir endpoint (create, findAll, findOne, update, remove)** shu **bir xil formatda (count, groupes[], success, message)** qaytarsin,  
👉 va **service** ichida kod **qisqa** bo‘lsin —  
undak bo‘lsa, quyidagi yakuniy professional yechim aynan senga mos bo‘ladi 👇

---

## ✅ `utils/return-group-data.ts`
Bu versiya **bitta universal response formatter**.  
U avtomatik ravishda `array` yoki `object` turini ajratadi.

```ts
// src/modules/groupes/utils/return-group-data.ts
export function returnGroupData(
  data: any,
  message = 'Success',
  meta: Record<string, any> = {},
) {
  const isArray = Array.isArray(data);
  const timestamp = new Date().toISOString();

  if (isArray) {
    return {
      success: true,
      message,
      count: data.length,
      timestamp,
      groupes: data,
      ...meta,
    };
  }

  return {
    success: true,
    message,
    timestamp,
    group: data,
    ...meta,
  };
}
```

---

## ✅ `entities/groupe.entity.ts`
Bu yerda `include` ni senga ko‘rsatayapman — `_count` bilan birga:
```ts
// src/modules/groupes/entities/groupe.entity.ts
export const groupInclude = {
  teacher: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      image: true,
      isDeleted: true,
    },
  },
  course: {
    select: {
      id: true,
      name: true,
      price: true,
      durationMinut: true,
      durationMont: true,
      image: true,
      published: true,
      weekDays: true,
    },
  },
  rom: {
    select: {
      id: true,
      name: true,
      pleaces: true,
      isOpen: true,
      romNumber: true,
    },
  },
  students: true,
  GroupPayment: true,
  _count: {
    select: {
      students: true,
      Lesson: true,
      GroupPayment: true,
    },
  },
};
```

---

## ✅ `groupes.service.ts` — qisqartirilgan, toza versiya

```ts
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { UpdateGroupeDto } from './dto/update-groupe.dto';
import {
  checkExistsResurs,
  checAlreadykExistsResurs,
} from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Course, Staff } from '@prisma/client';
import { groupInclude } from './entities/groupe.entity';
import { returnGroupData } from './utils/return-group-data';

function checkStartDate(date: string) {
  const today = new Date();
  const start = new Date(date);
  if (today > start)
    throw new BadRequestException('StartDate must be greater than today');
}

@Injectable()
export class GroupesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateGroupeDto) {
    const { teacherId, courseId, romId } = dto;

    const teacher = await checkExistsResurs<Staff>(
      this.prisma,
      ModelsEnumInPrisma.STAFF,
      'id',
      teacherId,
    );
    if (teacher.isDeleted)
      throw new BadRequestException(`Staff [${teacherId}] is deleted`);
    if (teacher.role !== 'TEACHER')
      throw new BadGatewayException('Staff must be TEACHER');

    const course = await checkExistsResurs<Course>(
      this.prisma,
      ModelsEnumInPrisma.COURSES,
      'id',
      courseId,
    );
    if (!course.published)
      throw new BadGatewayException(`Course [${course.name}] not published`);

    const rom = await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.ROM,
      'id',
      romId,
    );
    if (!rom.isOpen)
      throw new BadRequestException(`Room [${rom.name}] is closed`);

    checkStartDate(dto.startDate);

    await checAlreadykExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.GROUP,
      'name',
      dto.name,
    );

    const group = await this.prisma.group.create({
      data: dto,
      include: groupInclude,
    });

    return returnGroupData(group, 'Group created successfully');
  }

  async findAll() {
    const groupes = await this.prisma.group.findMany({
      include: groupInclude,
      orderBy: { startDate: 'desc' },
    });
    return returnGroupData(groupes, 'All groupes fetched');
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: groupInclude,
    });
    if (!group) throw new NotFoundException(`Group [${id}] not found`);
    return returnGroupData(group, 'Single group fetched');
  }

  async update(id: string, dto: UpdateGroupeDto) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group) throw new NotFoundException(`Group [${id}] not found`);
    if (dto.startDate) checkStartDate(dto.startDate);

    const updated = await this.prisma.group.update({
      where: { id },
      data: dto,
      include: groupInclude,
    });

    return returnGroupData(updated, 'Group updated successfully');
  }

  async remove(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { students: true, Lesson: true, GroupPayment: true },
    });
    if (!group) throw new NotFoundException(`Group [${id}] not found`);

    const hasRelations =
      group.students.length || group.Lesson.length || group.GroupPayment.length;
    if (hasRelations)
      throw new ConflictException(
        `Cannot delete group [${group.name}] — has related records`,
      );

    await this.prisma.group.delete({ where: { id } });
    return returnGroupData(null, `Group [${group.name}] deleted successfully`);
  }
}
```

---

## ✅ Endi `findAll()` natijasi doim shu formatda:

```json
{
  "success": true,
  "message": "All groupes fetched",
  "count": 1,
  "timestamp": "2025-10-19T09:33:02.901Z",
  "groupes": [
    {
      "id": "6d8ffbd5-5a81-4627-824a-a11ada76de0c",
      "name": "Group name",
      "courseId": "4f3a3bf8-bfe1-4bbe-b575-95a8f72c1741",
      "teacher": { "firstName": "Fayzillo", "lastName": "Ummatov" },
      "_count": {
        "students": 0,
        "Lesson": 0,
        "GroupPayment": 0
      }
    }
  ]
}
```

---

Agar xohlasang, men endi shu `returnGroupData()` funksiyani **NestJS Interceptor** qilib yozib beraman —  
unda endi `service` ichida umuman `returnGroupData()` chaqirish **shart bo‘lmaydi**,  
u avtomatik tarzda `response`ni shu formatda o‘rab beradi.  

⚙️ Shu variantni qilaymi (interceptor orqali)?

---

