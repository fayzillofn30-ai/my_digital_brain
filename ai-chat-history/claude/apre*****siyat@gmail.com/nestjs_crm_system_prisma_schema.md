# NestJs CRM system prisma schema

### 👤 Foydalanuvchi:

Salom menga NestJs uchun prisma schema kerak CRM tizimi uchun Yoʻnalish -> Kurs -> Guruh -> Lesson -> lesson_detailes -> RomsGuruh -> Student Additional_detailes -> Additional -> Lesson

### 🤖 Claude:

Salom! Sizga CRM tizimi uchun Prisma schema tayyorlayman. Bu schema o'quv markazlari uchun to'liq funksional bo'ladi.



prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Yo'nalishlar (Dasturlash, Dizayn, Marketing va h.k.)
model Direction {
  id        String   @id @default(uuid())
  name      String   @unique
  description String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  courses   Course[]

  @@map("directions")
}

// Kurslar (Frontend, Backend, Grafik Dizayn va h.k.)
model Course {
  id          String   @id @default(uuid())
  name        String
  description String?
  duration    Int?     // davomiyligi (oylar yoki soatlar)
  price       Decimal? @db.Decimal(10, 2)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  directionId String
  direction   Direction @relation(fields: [directionId], references: [id], onDelete: Cascade)

  groups      Group[]

  @@map("courses")
}

// Guruhlar
model Group {
  id          String   @id @default(uuid())
  name        String
  startDate   DateTime
  endDate     DateTime?
  status      GroupStatus @default(ACTIVE)
  maxStudents Int      @default(15)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  teacherId   String?
  teacher     Teacher? @relation(fields: [teacherId], references: [id], onDelete: SetNull)

  roomId      String?
  room        Room?    @relation(fields: [roomId], references: [id], onDelete: SetNull)

  students    Student[]
  lessons     Lesson[]

  @@map("groups")
}

enum GroupStatus {
  ACTIVE
  COMPLETED
  SUSPENDED
  PLANNED
}

// Xonalar (Dars xonalari)
model Room {
  id        String   @id @default(uuid())
  name      String   @unique
  capacity  Int
  floor     Int?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  groups    Group[]
  lessons   Lesson[]

  @@map("rooms")
}

// O'qituvchilar
model Teacher {
  id          String   @id @default(uuid())
  firstName   String
  lastName    String
  phone       String   @unique
  email       String?  @unique
  specialty   String?
  salary      Decimal? @db.Decimal(10, 2)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  groups      Group[]
  lessons     Lesson[]

  @@map("teachers")
}

// Talabalar
model Student {
  id          String   @id @default(uuid())
  firstName   String
  lastName    String
  phone       String   @unique
  email       String?
  parentPhone String?
  address     String?
  birthDate   DateTime?
  status      StudentStatus @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  groupId     String
  group       Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)

  payments    Payment[]
  attendances Attendance[]

  @@map("students")
}

enum StudentStatus {
  ACTIVE
  INACTIVE
  GRADUATED
  EXPELLED
}

// Darslar
model Lesson {
  id          String   @id @default(uuid())
  title       String
  description String?
  lessonDate  DateTime
  startTime   String   // "09:00"
  endTime     String   // "11:00"
  status      LessonStatus @default(SCHEDULED)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  groupId     String
  group       Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)

  teacherId   String?
  teacher     Teacher? @relation(fields: [teacherId], references: [id], onDelete: SetNull)

  roomId      String?
  room        Room?    @relation(fields: [roomId], references: [id], onDelete: SetNull)

  lessonDetails    LessonDetail[]
  attendances      Attendance[]
  additionalDetails AdditionalDetail[]

  @@map("lessons")
}

enum LessonStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  POSTPONED
}

// Dars detallari (Dars mazmuni, mavzular)
model LessonDetail {
  id          String   @id @default(uuid())
  topic       String
  content     String?  @db.Text
  homework    String?  @db.Text
  materials   String?  @db.Text // Files URLs or JSON
  orderNumber Int      // Darsning tartibi
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@map("lesson_details")
}

// Qo'shimcha to'lovlar (Kitob, sertifikat, modul va h.k.)
model Additional {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  type        AdditionalType
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  additionalDetails AdditionalDetail[]

  @@map("additionals")
}

enum AdditionalType {
  BOOK
  CERTIFICATE
  MODULE
  EXAM
  OTHER
}

// Darsga qo'shimcha xizmatlar bog'lash
model AdditionalDetail {
  id        String   @id @default(uuid())
  quantity  Int      @default(1)
  totalPrice Decimal @db.Decimal(10, 2)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  lessonId  String
  lesson    Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  additionalId String
  additional   Additional @relation(fields: [additionalId], references: [id], onDelete: Cascade)

  @@map("additional_details")
}

// Davomat
model Attendance {
  id        String   @id @default(uuid())
  status    AttendanceStatus @default(PRESENT)
  note      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  studentId String
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)

  lessonId  String
  lesson    Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([studentId, lessonId])
  @@map("attendances")
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}

// To'lovlar
model Payment {
  id          String   @id @default(uuid())
  amount      Decimal  @db.Decimal(10, 2)
  paymentDate DateTime @default(now())
  paymentType PaymentType
  status      PaymentStatus @default(COMPLETED)
  note        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  studentId   String
  student     Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@map("payments")
}

enum PaymentType {
  MONTHLY
  FULL
  PARTIAL
  ADDITIONAL
}

enum PaymentStatus {
  PENDING
  COMPLETED
  CANCELLED
  REFUNDED
}

Schema haqida qisqacha:

Direction → Course → Group → Lesson → LessonDetail - O'quv jarayoni strukturasi
Room - Dars xonalari
Teacher - O'qituvchilar
Student - Talabalar (guruhga bog'langan)
Attendance - Davomat tizimi
Additional → AdditionalDetail → Lesson - Qo'shimcha xizmatlar
Payment - To'lovlar tizimi

Ishlatish:



bash
npx prisma generate
npx prisma db push

Agar qo'shimcha o'zgartirishlar kerak bo'lsa, ayting!

---

### 👤 Foydalanuvchi:

Payment Guruga va studentga bogʻlansin faqat

### 🤖 Claude:

Albatta! Payment modelini ham Group, ham Student ga bog'layman:

Untitled
Text 

// To'lovlar
model Payment {
  id          String   @id @default(uuid())
  amount      Decimal  @db.Decimal(10, 2)
  paymentDate DateTime @default(now())
  paymentType PaymentType
  status      PaymentStatus @default(COMPLETED)
  note        String?

Untitled
Text ∙ Version 2 

// Guruhlar
model Group {
  id          String   @id @default(uuid())
  name        String
  startDate   DateTime
  endDate     DateTime?
  status      GroupStatus @default(ACTIVE)
  maxStudents Int      @default(15)
  createdAt   DateTime @default(n

Tayyor! Endi Payment modeli ham Student ga, ham Group ga bog'langan.

Bu orqali siz quyidagilarni amalga oshirishingiz mumkin:

Qaysi talaba qaysi guruh uchun to'lov qilganini kuzatish
Guruh bo'yicha barcha to'lovlarni ko'rish
Talaba bo'yicha barcha to'lovlarni ko'rish

Misol:



typescript
// Guruh uchun to'lovlar
const groupPayments = await prisma.payment.findMany({
  where: { groupId: 'group-id' },
  include: { student: true }
});

// Talaba uchun to'lovlar
const studentPayments = await prisma.payment.findMany({
  where: { studentId: 'student-id' },
  include: { group: true }
});

---

