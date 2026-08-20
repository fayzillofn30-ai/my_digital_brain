# Table attendance management

### 👤 Foydalanuvchi:

Salom

### 🤖 ChatGPT:

Salom, Fayzillo! 👋  
Qandaysiz, ishlar yaxshimi?

---

### 👤 Foydalanuvchi:

"use client"

import React, { useState } from 'react'
import { Staff, } from '@/types'
import { Button, Checkbox, FormControlLabel } from '@mui/material'
import { Attendentionals } from '@/features'

interface CreateAttendenceProps {
    lessonId: string
    students: Staff[]
}
const target = [
    {
        "id": "12a320e6-bcb4-4e95-be39-9b6c092375bd",
        "lessonId": "0f734490-4adc-4d74-8534-ac53e5ecdebd",
        "lessonName": null,
        "studentId": "3c0f817b-de41-4087-8c9c-c66bea445f69",
        "studentName": null,
        "kelganVaqti": "2025-10-21T20:08:34.806Z",
        "kelgan": true,
        "isDeleted": false
    }
]

function CreateAttendence({ lessonId, students }: CreateAttendenceProps) {
    const [attendances, setAttendances] = useState<typeof target>([])


    const fetchAttendences = async () => {
        const attendances = await Attendentionals.getAttendentionalsByLessonId(lessonId)
        console.log(attendances)
    }
    // Submit attendance data to API
    const handleSubmit = async () => {
        const presentStudents = attendances.map(a => a.studentId)

        if (presentStudents.length === 0) {
            alert("Hech kim belgilanmagan")
            return
        }



        try {

            attendances.map(async (p) => {
                const payload = {
                    lessonId,
                    studentId: p.studentId,
                    kelganVaqti: new Date().toISOString(),
                    kelgan: p.kelgan,
                }
                const res = await Attendentionals.updateAttendentional(p.id, payload)
                return res
            })

            alert('Davomat muvaffaqiyatli saqlandi')
        } catch (error) {
            console.error(error)
            alert('Davomatni saqlashda xatolik yuz berdi')
        }
    }

    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold">Davomatni belgilang</h2>

        </div>
    )
}

export default CreateAttendence

bu table ko'rinishida qilib attendaces  malumotlarini table orqali boshqairlsin

### 🤖 ChatGPT:

Zo‘r — sizning `CreateAttendence` komponentingiz hozircha `attendances` massivini log qilib, uni `state`da saqlashga tayyor. Keling, endi bu ma’lumotlarni **MUI Table** orqali chiroyli tarzda ko‘rsatamiz va u yerda checkbox orqali “kelgan” yoki “kelmagan” holatini boshqaramiz.  
Quyida to‘liq ishlaydigan, `table` bilan to‘ldirilgan versiyasini keltiraman 👇

---

### ✅ To‘liq kod:

```tsx
"use client"

import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material"
import { Staff } from "@/types"
import { Attendentionals } from "@/features"

interface CreateAttendenceProps {
  lessonId: string
  students: Staff[]
}

const CreateAttendence: React.FC<CreateAttendenceProps> = ({
  lessonId,
  students,
}) => {
  const [attendances, setAttendances] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 📥 Davomat ma'lumotlarini olish
  const fetchAttendences = async () => {
    try {
      setLoading(true)
      const data = await Attendentionals.getAttendentionalsByLessonId(lessonId)
      setAttendances(data || [])
    } catch (err) {
      console.error("Davomatni olishda xatolik:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendences()
  }, [lessonId])

  // 🔄 Checkboxni o‘zgartirish
  const handleToggle = (studentId: string) => {
    setAttendances((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? { ...item, kelgan: !item.kelgan }
          : item
      )
    )
  }

  // 💾 Saqlash
  const handleSubmit = async () => {
    const presentStudents = attendances.filter((a) => a.kelgan)

    if (presentStudents.length === 0) {
      alert("Hech kim belgilanmagan")
      return
    }

    try {
      setLoading(true)
      await Promise.all(
        attendances.map(async (p) => {
          const payload = {
            lessonId,
            studentId: p.studentId,
            kelganVaqti: new Date().toISOString(),
            kelgan: p.kelgan,
          }
          return Attendentionals.updateAttendentional(p.id, payload)
        })
      )

      alert("Davomat muvaffaqiyatli saqlandi ✅")
    } catch (error) {
      console.error(error)
      alert("Davomatni saqlashda xatolik yuz berdi ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Davomatni belgilang</h2>

      {loading ? (
        <div className="flex justify-center p-4">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Talaba ismi</TableCell>
                <TableCell>Kelgan</TableCell>
                <TableCell>Kelgan vaqti</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendances.length > 0 ? (
                attendances.map((a, index) => (
                  <TableRow key={a.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{a.studentName || "Noma’lum"}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={a.kelgan || false}
                        onChange={() => handleToggle(a.studentId)}
                      />
                    </TableCell>
                    <TableCell>
                      {a.kelganVaqti
                        ? new Date(a.kelganVaqti).toLocaleTimeString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Davomat ma’lumotlari yo‘q
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <div className="flex justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          Saqlash
        </Button>
      </div>
    </div>
  )
}

export default CreateAttendence
```

---

### ⚙️ Izoh:
- `fetchAttendences()` – dars uchun davomatni API orqali olib keladi.
- `handleToggle()` – checkbox bosilganda `kelgan` qiymatini `true/false` o‘zgartiradi.
- `handleSubmit()` – o‘zgartirilgan barcha davomatlarni `updateAttendentional` orqali APIga yuboradi.
- MUI `Table` yordamida ma’lumotlar tartibli ko‘rinishda chiqadi.
- `CircularProgress` — yuklanish vaqtida loader ko‘rsatadi.

---

Xohlaysizmi, endi shu table’ga **“Barchasini kelgan”** yoki **“Barchasini bekor qilish”** tugmasini ham qo‘shib beray?

---

### 👤 Foydalanuvchi:

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendentionalDto } from './dto/create-attendentional.dto';
import { UpdateAttendentionalDto } from './dto/update-attendentional.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AttendentionalsService {
  constructor(private readonly prisma: PrismaService) { }

  // 🔹 Helper — flatten function
  private flattenRecord(record: any) {
    return {
      id: record.id,
      lessonId: record.lessonId,
      lessonName: record.lesson?.name || null,
      studentId: record.studentId,
      studentName:
        record.student?.firstName && record.student?.lastName
          ? `${record.student.firstName} ${record.student.lastName}`
          : record.student?.firstName || null,
      kelganVaqti: record.kelganVaqti,
      kelgan: record.kelgan,
      isDeleted: record.isDeleted,
      createdAt: record.createdAt,
    };
  }

  // 🟢 CREATE
  async create(data: CreateAttendentionalDto) {
    const { lessonId, studentId, kelgan, kelganVaqti } = data;

    // 1. Avval mavjud attendancelarni tekshir
    const existingRecords = await this.prisma.attendentional.findMany({
      where: {
        lessonId,
        studentId: { in: studentId },
        isDeleted: false,
      },
      select: { studentId: true },
    });

    const existingStudentIds = new Set(existingRecords.map(record => record.studentId));

    // 2. Yangi kiradigan studentId larni filtrla
    const newStudentIds = studentId.filter(id => !existingStudentIds.has(id));

    if (newStudentIds.length === 0) {
      throw new ConflictException(`All selected students already have attendance records.`);
    }

    // 3. Yangi yozuvlar tayyorlash
    const attendanceData = newStudentIds.map(id => ({
      lessonId,
      studentId: id,
      kelgan: kelgan ?? false,
      kelganVaqti: kelganVaqti ? new Date(kelganVaqti) : null,
    }));


    // 4. Ko‘p yozuvni yaratish (createMany)
    await this.prisma.attendentional.createMany({
      data: attendanceData,
      skipDuplicates: true,
    });

    return {
      message: `${attendanceData.length} attendance record(s) successfully created.`,
      createdCount: attendanceData.length,
    };
  }

  // 🟡 FIND ALL
  async findAll() {
    const records = await this.prisma.attendentional.findMany({
      where: { isDeleted: false },
      include: {
        lesson: true,
        student: true,
      },
      orderBy: { kelganVaqti: 'desc' },
    });

    return {
      message: 'All attendance records retrieved',
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  // 🔵 FIND ONE
  async findOne(id: string) {
    const record = await this.prisma.attendentional.findUnique({
      where: { id },
      include: {
        lesson: true,
        student: true,
      },
    });

    if (!record || record.isDeleted)
      throw new NotFoundException(`Attendance not found by id [#${id}]`);

    return {
      message: `Attendance record #${id} retrieved successfully`,
      attendentional: this.flattenRecord(record),
    };
  }

  // 🟠 UPDATE
  async update(id: string, data: UpdateAttendentionalDto) {
    const exist = await this.prisma.attendentional.findUnique({
      where: { id },
      include: { lesson: true, student: true },
    });

    if (!exist || exist.isDeleted)
      throw new NotFoundException(`Attendance record not found by id [#${id}]`);

    if (
      (data.lessonId && data.lessonId !== exist.lessonId) ||
      (data.studentId && data.studentId !== exist.studentId)
    ) {
      const conflict = await this.prisma.attendentional.findFirst({
        where: {
          lessonId: data.lessonId ?? exist.lessonId,
          studentId: data.studentId ?? exist.studentId,
          isDeleted: false,
        },
      });
      if (conflict && conflict.id !== id)
        throw new ConflictException(
          `This student already has attendance for this lesson.`,
        );
    }

    const updated = await this.prisma.attendentional.update({
      where: { id },
      data: {
        lessonId: data.lessonId ?? exist.lessonId,
        studentId: data.studentId ?? exist.studentId,
        kelgan: data.kelgan ?? exist.kelgan,
        kelganVaqti: data.kelganVaqti
          ? new Date(data.kelganVaqti)
          : exist.kelganVaqti,
      },
      include: { lesson: true, student: true },
    });

    return {
      message: `Attendance record #${id} updated successfully`,
      attendentional: this.flattenRecord(updated),
    };
  }
  /** 🔸 Get all attendance records by LESSON ID */
  async getAll_ByLessonId(lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, isDeleted: false },
    });

    if (!lesson) throw new NotFoundException(`Lesson not found by id [#${lessonId}]`);

    const records = await this.prisma.attendentional.findMany({
      where: { lessonId, isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'asc' },
    });

    return {
      message: `All attendance records for lesson [#${lessonId}]`,
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  /** 🔸 Get all attendance records by GROUP ID */
  async getAll_ByGroupId(groupId: string) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId, isDeleted: false },
      include: { Lesson: true },
    });

    if (!group) throw new NotFoundException(`Group not found by id [#${groupId}]`);

    // barcha lesson ID larni olish
    const lessonIds = group.Lesson.map((l) => l.id);

    if (lessonIds.length === 0)
      return { message: 'No lessons found for this group', count: 0, attendentionals: [] };

    const records = await this.prisma.attendentional.findMany({
      where: { lessonId: { in: lessonIds }, isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'asc' },
    });

    return {
      message: `All attendance records for group [#${groupId}]`,
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  // 🔴 REMOVE (soft delete)
  async remove(id: string) {
    const exist = await this.prisma.attendentional.findUnique({
      where: { id },
      include: { lesson: true, student: true },
    });

    if (!exist || exist.isDeleted)
      throw new NotFoundException(`Attendance record not found by id [#${id}]`);

    const deleted = await this.prisma.attendentional.update({
      where: { id },
      data: { isDeleted: true },
      include: { lesson: true, student: true },
    });

    return {
      message: `Attendance record #${id} soft-deleted successfully`,
      attendentional: this.flattenRecord(deleted),
    };
  }
}


bunda agar kelgan studentid lar bo'lsa update qilinsin yo

### 🤖 ChatGPT:

Ajoyib savol, Fayzillo 👏  

Siz hohlayapsizki:  
👉 `create()` metodida agar **studentId** allaqachon shu **lessonId** uchun mavjud bo‘lsa — yangi yozuv yaratilmasin, balki **update** qilinsin (`kelgan`, `kelganVaqti` va hokazo).

Bu holatni **smart create-or-update** shaklida ishlovchi metod bilan hal qilamiz.  
Quyida sizning `create()` metodingizning takomillashtirilgan versiyasini yozdim 👇

---

### ✅ Yangilangan `create()` metodi
```ts
// 🟢 CREATE yoki UPDATE mavjud bo'lsa
async create(data: CreateAttendentionalDto) {
  const { lessonId, studentId, kelgan, kelganVaqti } = data;

  // 🧠 1. Barcha mavjud yozuvlarni tekshiramiz
  const existingRecords = await this.prisma.attendentional.findMany({
    where: {
      lessonId,
      studentId: { in: studentId },
      isDeleted: false,
    },
  });

  const existingStudentIds = new Set(existingRecords.map((r) => r.studentId));

  // 🧩 2. Yangi qo‘shiladigan studentId lar
  const newStudentIds = studentId.filter((id) => !existingStudentIds.has(id));

  // 🟩 3. Yangi yozuvlar (createMany)
  if (newStudentIds.length > 0) {
    const newAttendances = newStudentIds.map((id) => ({
      lessonId,
      studentId: id,
      kelgan: kelgan ?? false,
      kelganVaqti: kelganVaqti ? new Date(kelganVaqti) : null,
    }));

    await this.prisma.attendentional.createMany({
      data: newAttendances,
      skipDuplicates: true,
    });
  }

  // 🟦 4. Mavjud studentId lar uchun update
  if (existingRecords.length > 0) {
    await Promise.all(
      existingRecords.map((record) =>
        this.prisma.attendentional.update({
          where: { id: record.id },
          data: {
            kelgan: kelgan ?? record.kelgan,
            kelganVaqti: kelganVaqti ? new Date(kelganVaqti) : new Date(),
          },
        }),
      ),
    );
  }

  // 🔁 5. Javob
  return {
    message: `${newStudentIds.length} new record(s) created, ${existingRecords.length} updated.`,
    createdCount: newStudentIds.length,
    updatedCount: existingRecords.length,
  };
}
```

---

### 🔍 Izoh:
- Avval `findMany` bilan shu `lessonId` uchun barcha mavjud `studentId`larni topadi.  
- So‘ng:
  - Yangi (`newStudentIds`) larni `createMany` bilan yaratadi.
  - Mavjudlarini (`existingRecords`) esa `update` qiladi.
- Agar `kelganVaqti` berilmasa, `new Date()` bilan hozirgi vaqt o‘rnatiladi.

---

### 🧠 Natijasi:
- Shu API bir marta yuborilganda:
  - Yangi talabalar uchun yangi yozuv yaratiladi.
  - Oldindan borlar esa yangilanadi (masalan, `kelgan` qiymati `true` bo‘ladi).
- Shunday qilib, frontend tomonda faqat bitta `create()` chaqiruv yetarli.

---

Xohlaysizmi, men sizga `frontend`dagi `handleSubmit()` funksiyasini ham shu yangi `create-or-update` logikaga moslab yozib beray?

---

### 👤 Foydalanuvchi:

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAttendentionalDto {
  @ApiProperty({
    example: '6d8ffbd5-5a81-4627-824a-a11ada76de0c',
    description: 'Lesson ID to which this attendance belongs',
  })
  @IsString()
  lessonId: string;

  @ApiProperty({
    example: '9a4b2c37-23fa-44f2-9f2b-2b9d6fa8c12d',
    description: 'Student (staff) ID who is attending the lesson',
  })
  @IsArray()
  studentId: string[];

  @ApiProperty({
    example: '2025-10-20T09:45:00.000Z',
    description: 'The exact time when the student attended the lesson (optional)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  kelganVaqti?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the student has attended the lesson',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  kelgan?: boolean;

  @ApiProperty({
    example: false,
    description: 'Soft delete flag — whether this attendance record is marked as deleted',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}


Aslida dto bunday edi

### 🤖 ChatGPT:

Ajoyib — demak sizning `CreateAttendentionalDto`ingiz quyidagi ko‘rinishda:  

- `lessonId`: bitta dars ID  
- `studentId`: **array** (`string[]`) — ya’ni bir nechta talaba uchun davomat yuboriladi  
- `kelgan`, `kelganVaqti`: optional  

Bu tuzilma **bir nechta talaba uchun bir vaqtning o‘zida create/update** qilishga juda mos, shuning uchun avval aytganimdagi “smart create-or-update” logika **to‘liq shu DTO uchun ishlaydi** ✅  

Keling, sizning mavjud `dto`ga **to‘liq mos** qilib `create()` metodini tozalangan, ishlab turgan holatda yozib chiqay 👇  

---

### ✅ Yakuniy `create()` metodi (`createOrUpdate` logikasi bilan)

```ts
async create(data: CreateAttendentionalDto) {
  const { lessonId, studentId, kelgan, kelganVaqti } = data;

  if (!studentId || studentId.length === 0) {
    throw new Error('At least one studentId must be provided');
  }

  // 🟩 1. Shu darsdagi mavjud yozuvlarni topamiz
  const existingRecords = await this.prisma.attendentional.findMany({
    where: {
      lessonId,
      studentId: { in: studentId },
      isDeleted: false,
    },
  });

  // 🟦 2. Mavjud studentId larni ajratib olamiz
  const existingStudentIds = new Set(existingRecords.map((r) => r.studentId));

  // 🟧 3. Yangi studentId larni topamiz
  const newStudentIds = studentId.filter((id) => !existingStudentIds.has(id));

  // 🟩 4. Yangi yozuvlarni yaratamiz
  if (newStudentIds.length > 0) {
    const newAttendances = newStudentIds.map((id) => ({
      lessonId,
      studentId: id,
      kelgan: kelgan ?? false,
      kelganVaqti: kelganVaqti ? new Date(kelganVaqti) : null,
    }));

    await this.prisma.attendentional.createMany({
      data: newAttendances,
      skipDuplicates: true,
    });
  }

  // 🟦 5. Mavjudlarini yangilaymiz
  if (existingRecords.length > 0) {
    await Promise.all(
      existingRecords.map((record) =>
        this.prisma.attendentional.update({
          where: { id: record.id },
          data: {
            kelgan: kelgan ?? record.kelgan,
            kelganVaqti: kelganVaqti
              ? new Date(kelganVaqti)
              : new Date(),
          },
        }),
      ),
    );
  }

  // 🟨 6. Yakuniy javob
  return {
    message: `${newStudentIds.length} new attendance(s) created, ${existingRecords.length} updated.`,
    createdCount: newStudentIds.length,
    updatedCount: existingRecords.length,
  };
}
```

---

### 🧩 Qanday ishlaydi:

| Holat | Amal |
|-------|------|
| StudentId shu lesson uchun **yangi** | `createMany()` bilan yangi yozuv yaratiladi |
| StudentId shu lesson uchun **mavjud** | `update()` bilan `kelgan` va `kelganVaqti` yangilanadi |
| Bir nechta studentId yuborilsa | Hammasi parallel tarzda create/update qilinadi |
| `kelganVaqti` bo‘lmasa | `new Date()` (hozirgi vaqt) bilan to‘ldiriladi |

---

### 💡 Qo‘shimcha tavsiya:
Agar siz keyinchalik shunday qilmoqchi bo‘lsangiz:
- frontendda har bir talaba uchun `kelgan` qiymatini boshqacha yuborish (ya’ni `[{studentId, kelgan, kelganVaqti}]` ko‘rinishda)
- unda DTO ni `studentId: string[]` o‘rniga `students: { studentId: string; kelgan: boolean; kelganVaqti?: string }[]` ko‘rinishga o‘tkazish kerak bo‘ladi.

Xohlaysizmi, men shu kengaytirilgan variantni ham yozib beray — ya’ni har bir student uchun alohida status yuboriladigan DTO va service logikasi?

---

### 👤 Foydalanuvchi:

Unda  Dtoni shunga moslab ber yani dtoda student davomat malumotlari  attendence uchun  dto[]  bo'lsin  

### 🤖 ChatGPT:

Zo‘r ✅ — endi siz `CreateAttendentionalDto`ni **bir nechta talaba uchun individual holatlarni** (`kelgan`, `kelganVaqti`) yuboradigan qilib tuzmoqchisiz.  

Demak endi DTO’ni quyidagi tarzda yozamiz 👇  
- Har bir element — bitta talabaga tegishli davomat yozuvi (`studentId`, `kelgan`, `kelganVaqti`)  
- Asosiy DTO esa — `lessonId` va `attendances` (array) dan iborat bo‘ladi  

---

## ✅ Yakuniy to‘liq DTO strukturasi

```ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SingleAttendanceDto {
  @ApiProperty({
    example: '9a4b2c37-23fa-44f2-9f2b-2b9d6fa8c12d',
    description: 'Student (staff) ID who is attending the lesson',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    example: true,
    description: 'Whether the student has attended the lesson',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  kelgan?: boolean;

  @ApiProperty({
    example: '2025-10-20T09:45:00.000Z',
    description: 'The exact time when the student attended the lesson (optional)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  kelganVaqti?: string;
}

export class CreateAttendentionalDto {
  @ApiProperty({
    example: '6d8ffbd5-5a81-4627-824a-a11ada76de0c',
    description: 'Lesson ID to which all attendance records belong',
  })
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({
    type: [SingleAttendanceDto],
    description: 'Array of attendance records for multiple students',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleAttendanceDto)
  attendances: SingleAttendanceDto[];
}
```

---

### 🧠 Endi frontenddan yuboriladigan JSON namunasi:

```json
{
  "lessonId": "6d8ffbd5-5a81-4627-824a-a11ada76de0c",
  "attendances": [
    {
      "studentId": "9a4b2c37-23fa-44f2-9f2b-2b9d6fa8c12d",
      "kelgan": true,
      "kelganVaqti": "2025-10-23T08:45:00.000Z"
    },
    {
      "studentId": "4d1b5a3e-9927-4f2c-a6b8-91a6a67bde01",
      "kelgan": false
    }
  ]
}
```

---

### 🧩 Shunga mos `create()` metodi

Endi service’dagi `create()` quyidagicha bo‘ladi:

```ts
async create(data: CreateAttendentionalDto) {
  const { lessonId, attendances } = data;

  if (!attendances || attendances.length === 0) {
    throw new Error('At least one attendance record must be provided');
  }

  const studentIds = attendances.map(a => a.studentId);

  // 🔹 1. Shu darsdagi mavjud yozuvlarni topamiz
  const existingRecords = await this.prisma.attendentional.findMany({
    where: {
      lessonId,
      studentId: { in: studentIds },
      isDeleted: false,
    },
  });

  const existingMap = new Map(existingRecords.map(r => [r.studentId, r]));

  // 🔹 2. Create va Update larni ajratamiz
  const toCreate = attendances.filter(a => !existingMap.has(a.studentId));
  const toUpdate = attendances.filter(a => existingMap.has(a.studentId));

  // 🔹 3. Yangi yozuvlarni yaratish
  if (toCreate.length > 0) {
    await this.prisma.attendentional.createMany({
      data: toCreate.map(a => ({
        lessonId,
        studentId: a.studentId,
        kelgan: a.kelgan ?? false,
        kelganVaqti: a.kelganVaqti ? new Date(a.kelganVaqti) : null,
      })),
      skipDuplicates: true,
    });
  }

  // 🔹 4. Mavjudlarini yangilash
  if (toUpdate.length > 0) {
    await Promise.all(
      toUpdate.map(a => {
        const exist = existingMap.get(a.studentId);
        return this.prisma.attendentional.update({
          where: { id: exist.id },
          data: {
            kelgan: a.kelgan ?? exist.kelgan,
            kelganVaqti: a.kelganVaqti
              ? new Date(a.kelganVaqti)
              : new Date(),
          },
        });
      }),
    );
  }

  return {
    message: `${toCreate.length} new attendance(s) created, ${toUpdate.length} updated.`,
    createdCount: toCreate.length,
    updatedCount: toUpdate.length,
  };
}
```

---

### 🔍 Afzalliklari:
- Har bir talaba uchun alohida `kelgan` va `kelganVaqti` yuborish mumkin.
- Bir dars uchun barcha talabalarning davomatini **bitta API chaqiruvi** bilan create/update qilish mumkin.
- Kiritilmaganlar saqlanmaydi, faqat mavjud yoki berilganlar bilan ishlaydi.

---

Xohlaysizmi, endi shu DTO’ga mos qilib frontenddagi `handleSubmit()`ni ham yozib beray (ya’ni `attendances: [...]` ko‘rinishda jo‘natiladigan qilib)?

---

### 👤 Foydalanuvchi:

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendentionalDto } from './dto/create-attendentional.dto';
import { UpdateAttendentionalDto } from './dto/update-attendentional.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AttendentionalsService {
  constructor(private readonly prisma: PrismaService) { }

  // 🔹 Helper — flatten function
  private flattenRecord(record: any) {
    return {
      id: record.id,
      lessonId: record.lessonId,
      lessonName: record.lesson?.name || null,
      studentId: record.studentId,
      studentName:
        record.student?.firstName && record.student?.lastName
          ? `${record.student.firstName} ${record.student.lastName}`
          : record.student?.firstName || null,
      kelganVaqti: record.kelganVaqti,
      kelgan: record.kelgan,
      isDeleted: record.isDeleted,
      createdAt: record.createdAt,
    };
  }

  // 🟢 CREATE
  async create(data: CreateAttendentionalDto) {
    const { lessonId, studentId, kelgan, kelganVaqti } = data;

    // 1. Avval mavjud attendancelarni tekshir
    const existingRecords = await this.prisma.attendentional.findMany({
      where: {
        lessonId,
        studentId: { in: studentId },
        isDeleted: false,
      },
      select: { studentId: true },
    });

    const existingStudentIds = new Set(existingRecords.map(record => record.studentId));

    // 2. Yangi kiradigan studentId larni filtrla
    const newStudentIds = studentId.filter(id => !existingStudentIds.has(id));

    if (newStudentIds.length === 0) {
      throw new ConflictException(`All selected students already have attendance records.`);
    }

    // 3. Yangi yozuvlar tayyorlash
    const attendanceData = newStudentIds.map(id => ({
      lessonId,
      studentId: id,
      kelgan: kelgan ?? false,
      kelganVaqti: kelganVaqti ? new Date(kelganVaqti) : null,
    }));


    // 4. Ko‘p yozuvni yaratish (createMany)
    await this.prisma.attendentional.createMany({
      data: attendanceData,
      skipDuplicates: true,
    });

    return {
      message: `${attendanceData.length} attendance record(s) successfully created.`,
      createdCount: attendanceData.length,
    };
  }

  // 🟡 FIND ALL
  async findAll() {
    const records = await this.prisma.attendentional.findMany({
      where: { isDeleted: false },
      include: {
        lesson: true,
        student: true,
      },
      orderBy: { kelganVaqti: 'desc' },
    });

    return {
      message: 'All attendance records retrieved',
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  // 🔵 FIND ONE
  async findOne(id: string) {
    const record = await this.prisma.attendentional.findUnique({
      where: { id },
      include: {
        lesson: true,
        student: true,
      },
    });

    if (!record || record.isDeleted)
      throw new NotFoundException(`Attendance not found by id [#${id}]`);

    return {
      message: `Attendance record #${id} retrieved successfully`,
      attendentional: this.flattenRecord(record),
    };
  }

  // 🟠 UPDATE
  async update(id: string, data: UpdateAttendentionalDto) {
    const exist = await this.prisma.attendentional.findUnique({
      where: { id },
      include: { lesson: true, student: true },
    });

    if (!exist || exist.isDeleted)
      throw new NotFoundException(`Attendance record not found by id [#${id}]`);

    if (
      (data.lessonId && data.lessonId !== exist.lessonId) ||
      (data.studentId && data.studentId !== exist.studentId)
    ) {
      const conflict = await this.prisma.attendentional.findFirst({
        where: {
          lessonId: data.lessonId ?? exist.lessonId,
          studentId: data.studentId ?? exist.studentId,
          isDeleted: false,
        },
      });
      if (conflict && conflict.id !== id)
        throw new ConflictException(
          `This student already has attendance for this lesson.`,
        );
    }

    const updated = await this.prisma.attendentional.update({
      where: { id },
      data: {
        lessonId: data.lessonId ?? exist.lessonId,
        studentId: data.studentId ?? exist.studentId,
        kelgan: data.kelgan ?? exist.kelgan,
        kelganVaqti: data.kelganVaqti
          ? new Date(data.kelganVaqti)
          : exist.kelganVaqti,
      },
      include: { lesson: true, student: true },
    });

    return {
      message: `Attendance record #${id} updated successfully`,
      attendentional: this.flattenRecord(updated),
    };
  }
  /** 🔸 Get all attendance records by LESSON ID */
  async getAll_ByLessonId(lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, isDeleted: false },
    });

    if (!lesson) throw new NotFoundException(`Lesson not found by id [#${lessonId}]`);

    const records = await this.prisma.attendentional.findMany({
      where: { lessonId, isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'asc' },
    });

    return {
      message: `All attendance records for lesson [#${lessonId}]`,
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  /** 🔸 Get all attendance records by GROUP ID */
  async getAll_ByGroupId(groupId: string) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId, isDeleted: false },
      include: { Lesson: true },
    });

    if (!group) throw new NotFoundException(`Group not found by id [#${groupId}]`);

    // barcha lesson ID larni olish
    const lessonIds = group.Lesson.map((l) => l.id);

    if (lessonIds.length === 0)
      return { message: 'No lessons found for this group', count: 0, attendentionals: [] };

    const records = await this.prisma.attendentional.findMany({
      where: { lessonId: { in: lessonIds }, isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'asc' },
    });

    return {
      message: `All attendance records for group [#${groupId}]`,
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  // 🔴 REMOVE (soft delete)
  async remove(id: string) {
    const exist = await this.prisma.attendentional.findUnique({
      where: { id },
      include: { lesson: true, student: true },
    });

    if (!exist || exist.isDeleted)
      throw new NotFoundException(`Attendance record not found by id [#${id}]`);

    const deleted = await this.prisma.attendentional.update({
      where: { id },
      data: { isDeleted: true },
      include: { lesson: true, student: true },
    });

    return {
      message: `Attendance record #${id} soft-deleted successfully`,
      attendentional: this.flattenRecord(deleted),
    };
  }
}

endi buni mosla

### 🤖 ChatGPT:

Zo‘r — demak siz endi `CreateAttendentionalDto` ni **bir nechta davomat yozuvlarini (attendance records)** birdaniga yuborish uchun array shaklida qabul qiladigan qilib o‘zgartirmoqchisiz.  
Ya’ni frontenddan shunday JSON keladi:  

```json
{
  "lessonId": "6d8ffbd5-5a81-4627-824a-a11ada76de0c",
  "attendances": [
    {
      "studentId": "3c0f817b-de41-4087-8c9c-c66bea445f69",
      "kelgan": true,
      "kelganVaqti": "2025-10-21T20:08:34.806Z"
    },
    {
      "studentId": "4d55a02a-924a-41d1-9cb8-bcf0b3e7892d",
      "kelgan": false
    }
  ]
}
```

---

### 🧱 Yangi `CreateAttendentionalDto` (moslashtirilgan)
```ts
import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

class AttendanceItemDto {
  @ApiProperty({
    example: '3c0f817b-de41-4087-8c9c-c66bea445f69',
    description: 'Student (staff) ID who attended the lesson',
  })
  @IsString()
  studentId: string

  @ApiProperty({
    example: '2025-10-21T20:08:34.806Z',
    description: 'The exact time when the student attended the lesson',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  kelganVaqti?: string

  @ApiProperty({
    example: true,
    description: 'Whether the student has attended the lesson',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  kelgan?: boolean

  @ApiProperty({
    example: false,
    description: 'Soft delete flag (optional)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean
}

export class CreateAttendentionalDto {
  @ApiProperty({
    example: '6d8ffbd5-5a81-4627-824a-a11ada76de0c',
    description: 'Lesson ID to which this attendance belongs',
  })
  @IsString()
  lessonId: string

  @ApiProperty({
    type: [AttendanceItemDto],
    description: 'List of attendance records for students',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceItemDto)
  attendances: AttendanceItemDto[]
}
```

---

### 🔧 `AttendentionalsService.create()` metodini moslashtirilgan versiya

```ts
async create(data: CreateAttendentionalDto) {
  const { lessonId, attendances } = data;

  // 1. Dars borligini tekshir
  const lesson = await this.prisma.lesson.findUnique({
    where: { id: lessonId, isDeleted: false },
  });
  if (!lesson) throw new NotFoundException(`Lesson not found by id [#${lessonId}]`);

  // 2. Student ID larni ajratib olamiz
  const studentIds = attendances.map(a => a.studentId);

  // 3. Mavjud yozuvlarni tekshir
  const existingRecords = await this.prisma.attendentional.findMany({
    where: {
      lessonId,
      studentId: { in: studentIds },
      isDeleted: false,
    },
    select: { studentId: true },
  });

  const existingIds = new Set(existingRecords.map(r => r.studentId));
  const newAttendances = attendances.filter(a => !existingIds.has(a.studentId));

  if (newAttendances.length === 0) {
    throw new ConflictException('All selected students already have attendance records.');
  }

  // 4. createMany uchun tayyorlash
  const dataToInsert = newAttendances.map(a => ({
    lessonId,
    studentId: a.studentId,
    kelgan: a.kelgan ?? false,
    kelganVaqti: a.kelganVaqti ? new Date(a.kelganVaqti) : null,
    isDeleted: a.isDeleted ?? false,
  }));

  // 5. Bazaga yozish
  await this.prisma.attendentional.createMany({
    data: dataToInsert,
    skipDuplicates: true,
  });

  return {
    message: `${dataToInsert.length} attendance record(s) successfully created.`,
    createdCount: dataToInsert.length,
  };
}
```

---

### ✅ Natija

Endi siz frontenddan **ko‘p student** uchun davomatni bitta requestda yuborishingiz mumkin, masalan:

```json
POST /attendentionals
{
  "lessonId": "6d8ffbd5-5a81-4627-824a-a11ada76de0c",
  "attendances": [
    { "studentId": "3c0f817b-de41-4087-8c9c-c66bea445f69", "kelgan": true },
    { "studentId": "4d55a02a-924a-41d1-9cb8-bcf0b3e7892d", "kelgan": false }
  ]
}
```

---

Xohlaysizmi, shu o‘zgarishlarga mos **Swagger namunasini (response schema + example)** ham yozib beray?

---

### 👤 Foydalanuvchi:

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendentionalsService } from './attendentionals.service';
import { CreateAttendentionalDto } from './dto/create-attendentional.dto';
import { UpdateAttendentionalDto } from './dto/update-attendentional.dto';

@Controller('attendentionals')
export class AttendentionalsController {
  constructor(private readonly attendentionalsService: AttendentionalsService) {}

  @Post("create")
  create(@Body() data: CreateAttendentionalDto) {
    return this.attendentionalsService.create(data);
  }

  @Get("get-all")
  findAll() {
    return this.attendentionalsService.findAll();
  }

  @Get("get-all/by-lessonid/:id")
  getAll_By_LessonId(@Param("id") id : string){
    return this.attendentionalsService.getAll_ByLessonId(id)
  }

  @Get("get-all/by-groupid/:id")
  getAll_by_GroupId(@Param("id") id : string){
    return this.attendentionalsService.getAll_ByGroupId(id)
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.attendentionalsService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() data: UpdateAttendentionalDto) {
    return this.attendentionalsService.update(id, data);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.attendentionalsService.remove(id);
  }
}


bu controller


// src/features/attendentionals/api.ts
import api from '@/lib/axios';
import { Attendentional, AttendentionalFlat } from './types';

type CreateDto = {
  lessonId: string;
  studentId: string;
  kelgan?: boolean;
  kelganVaqti?: string;
};

/**
 * 🔹 Yangi attendance yozuvi yaratish
 */
export const createAttendentional = async (data: {
  lessonId: string
  studentId: string[]
  kelganVaqti?: string
  kelgan?: boolean
}): Promise<Attendentional> => {
  const res = await api.post("/attendentionals/create", data)
  return res.data
}

/**
 * 🔹 Barcha attendentionlarni olish
 */
export const getAllAttendentionals = async (): Promise<Attendentional[]> => {

  const res = await api.get("/attendentionals/get-all")
  return res.data.attendentionals
}

/**
 * 🔹 Lesson bo‘yicha attendentionlarni olish
 */
export const getAttendentionalsByLessonId = async (lessonId: string): Promise<Attendentional[]> => {
  const res = await api.get(`/attendentionals/get-all/by-lessonid/${lessonId}`)
  return res.data.attendentionals
}

/**
 * 🔹 Group bo‘yicha attendentionlarni olish
 */
export const getAttendentionalsByGroupId = async (groupId: string): Promise<Attendentional[]> => {
  const res = await api.get(`/attendentionals/get-all/by-groupid/${groupId}`)
  return res.data.attendentionals
}

/**
 * 🔹 Bitta attendentionalni olish
 */
export const getAttendentionalById = async (id: string): Promise<Attendentional> => {
  const res = await api.get(`/attendentionals/get-one/${id}`)
  return res.data.attendentional
}

/**
 * 🔹 Attendentionni yangilash
 */
export const updateAttendentional = async (id: string, data: Partial<Attendentional>): Promise<Attendentional> => {
  const res = await api.patch(`/attendentionals/update-one/${id}`, data)
  return res.data.attendentional
}

/**
 * 🔹 Attendentionni o‘chirish (soft delete)
 */
export const deleteAttendentional = async (id: string): Promise<Attendentional> => {
  const res = await api.delete(`/attendentionals/delete-one/${id}`)
  return res.data.attendentional
}

buni moslab ber

### 🤖 ChatGPT:

Zo‘r — siz backenddagi DTO va service’ni to‘g‘rilab, endi frontenddagi `api.ts` faylini ham **yangi DTO strukturasi** (ya’ni `attendances[]`) ga moslashtirmoqchisiz.  

Keling, quyidagi narsalarni moslashtiramiz 👇  
- `createAttendentional` endi `studentId[]` emas, `attendances[]` yuboradi.  
- Type’lar (`CreateDto`, `Attendentional`) moslashtiriladi.  
- Barcha boshqa endpointlar o‘zgarmaydi.

---

## ✅ Yangi to‘liq versiya: `src/features/attendentionals/api.ts`

```ts
import api from "@/lib/axios";
import { Attendentional } from "./types";

/** 🔹 Attendance Item (har bir student uchun) */
export interface AttendanceItemDto {
  studentId: string;
  kelgan?: boolean;
  kelganVaqti?: string;
  isDeleted?: boolean;
}

/** 🔹 Create Attendentionals DTO */
export interface CreateAttendentionalsDto {
  lessonId: string;
  attendances: AttendanceItemDto[];
}

/**
 * 🔹 Yangi attendance yozuvlarini yaratish (bir nechta student uchun)
 */
export const createAttendentional = async (
  data: CreateAttendentionalsDto
): Promise<{ message: string; createdCount: number }> => {
  const res = await api.post("/attendentionals/create", data);
  return res.data;
};

/**
 * 🔹 Barcha attendentionlarni olish
 */
export const getAllAttendentionals = async (): Promise<Attendentional[]> => {
  const res = await api.get("/attendentionals/get-all");
  return res.data.attendentionals;
};

/**
 * 🔹 Lesson bo‘yicha attendentionlarni olish
 */
export const getAttendentionalsByLessonId = async (
  lessonId: string
): Promise<Attendentional[]> => {
  const res = await api.get(`/attendentionals/get-all/by-lessonid/${lessonId}`);
  return res.data.attendentionals;
};

/**
 * 🔹 Group bo‘yicha attendentionlarni olish
 */
export const getAttendentionalsByGroupId = async (
  groupId: string
): Promise<Attendentional[]> => {
  const res = await api.get(`/attendentionals/get-all/by-groupid/${groupId}`);
  return res.data.attendentionals;
};

/**
 * 🔹 Bitta attendentionalni olish
 */
export const getAttendentionalById = async (
  id: string
): Promise<Attendentional> => {
  const res = await api.get(`/attendentionals/get-one/${id}`);
  return res.data.attendentional;
};

/**
 * 🔹 Attendentionni yangilash
 */
export const updateAttendentional = async (
  id: string,
  data: Partial<Attendentional>
): Promise<Attendentional> => {
  const res = await api.patch(`/attendentionals/update-one/${id}`, data);
  return res.data.attendentional;
};

/**
 * 🔹 Attendentionni o‘chirish (soft delete)
 */
export const deleteAttendentional = async (
  id: string
): Promise<Attendentional> => {
  const res = await api.delete(`/attendentionals/delete-one/${id}`);
  return res.data.attendentional;
};
```

---

## 🧠 Endi frontendda foydalanish misoli:

```ts
import { createAttendentional } from "@/features/attendentionals/api";

await createAttendentional({
  lessonId: "6d8ffbd5-5a81-4627-824a-a11ada76de0c",
  attendances: [
    {
      studentId: "3c0f817b-de41-4087-8c9c-c66bea445f69",
      kelgan: true,
      kelganVaqti: new Date().toISOString(),
    },
    {
      studentId: "4d55a02a-924a-41d1-9cb8-bcf0b3e7892d",
      kelgan: false,
    },
  ],
});
```

---

Xohlaysizmi, endi shu yangi `createAttendentional()` funksiyasini ishlatadigan React komponent (`CreateAttendence`) ni ham yangi formatda to‘liq qayta yozib beray — table va checkbox bilan ishlaydigan qilib?

---

### 👤 Foydalanuvchi:

"use client"

import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Lesson, Staff } from "@/types"
import React, { useEffect, useMemo, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Attendentionals, Staffs } from "@/features"
import CreateAttendence from "@/dashboard/area/modal/CreateAttendence"

interface LessonPageParamsType {
    params: Promise<{ lessonid: string }>
}

function LessonPage({ params }: LessonPageParamsType) {
    const { lessonid } = React.use(params)
    const router = useRouter()
    const { lessons, error: LessonsError, loading: LessonsLoading } = useAllFetchedData()
    const [students, setStudents] = useState<Staff[]>([])
    const [loadingStudents, setLoadingStudents] = useState<boolean>(true)
    const { selectedGroupId } = useSelectedStore()

    // === Lessonni topish ===
    const lesson: Lesson | undefined = useMemo(() => {
        return lessons.find((l) => l.id === lessonid)
    }, [lessons, lessonid])

    const handleDefaultCreateAttendence = async () => {
        if(!lesson) return
        if (lesson?.attendCount == 0 || students.length > lesson?.attendCount || 0) {
            const res = await Attendentionals.createAttendentional({
                lessonId: "",
                studentId: students.map(s => s.id),
                kelgan: false,
                kelganVaqti: new Date().toISOString()
            })
        }
    }


    // === Talabalarni olish ===
    const fetchStudents = async () => {
        if (!selectedGroupId) return
        try {
            setLoadingStudents(true)
            const res = await Staffs.getStudentsByGroupId(selectedGroupId)
            handleDefaultCreateAttendence()
            setStudents(res)
        } catch (error) {
            console.error("Talabalarni olishda xatolik:", error)
        } finally {
            setLoadingStudents(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [lessonid, selectedGroupId])

    // === Error holatlari ===
    if (LessonsError) {
        return <h1 className="text-center text-red-500 mt-10">❌ Lesson yuklashda xatolik!</h1>
    }

    if (LessonsLoading || !lesson) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                <CircularProgress size={80} />
                <p className="ml-3 text-lg">Dars yuklanmoqda...</p>
            </div>
        )
    }

    // === Sahifa render ===
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 space-y-6">
            {/* Dars tafsilotlari */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative">
                {/* Ortga qaytish */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                >
                    <ArrowLeft className="w-5 h-5" /> Ortga
                </button>

                {/* Header */}
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    🧾 Dars tafsilotlari
                </h1>

                {/* Lesson ma’lumotlari */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700 w-full">
                    <div>
                        <p className="font-medium">📚 Dars raqami:</p>
                        <p>{lesson.lessonNumber}</p>
                    </div>

                    <div>
                        <p className="font-medium">👨‍🏫 O‘qituvchi:</p>
                        <p>{lesson.teacherName}</p>
                    </div>

                    <div>
                        <p className="font-medium">🏫 Guruh:</p>
                        <p>{lesson.groupName}</p>
                    </div>

                    <div>
                        <p className="font-medium">🏠 Xona:</p>
                        <p>
                            {lesson.roomName} #{lesson.roomNumber}
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">🕓 Boshlanish:</p>
                        <p>{new Date(lesson.startDate).toLocaleString("uz-UZ")}</p>
                    </div>

                    <div>
                        <p className="font-medium">🕒 Tugash:</p>
                        <p>
                            {lesson.endDate
                                ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                                : "–"}
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">👥 O‘quvchilar soni:</p>
                        <p>{lesson.studentsCount}</p>
                    </div>

                    <div>
                        <p className="font-medium">✅ Davomat qilganlar:</p>
                        <p>{lesson.attendCount}</p>
                    </div>

                    <div>
                        <p className="font-medium">📅 Status:</p>
                        <p
                            className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${lesson.isDeleted
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                                }`}
                        >
                            {lesson.isDeleted ? "❌ O‘chirilgan" : "✅ Faol"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Talabalar ro‘yxati */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">🎓 Talabalar ro‘yxati</h2>

                {loadingStudents ? (
                    <div className="flex justify-center py-6 text-gray-500">
                        <CircularProgress size={50} />
                    </div>
                ) : students.length === 0 ? (
                    <p className="text-gray-500 text-center">Talabalar topilmadi.</p>
                ) : (
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-2 text-left">#</th>
                                <th className="px-4 py-2 text-left">Ism familiya</th>
                                <th className="px-4 py-2 text-left">Telefon</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Tug‘ilgan sana</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, i) => (
                                <tr
                                    key={student.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-2">{i + 1}</td>
                                    <td className="px-4 py-2 flex items-center gap-3">
                                        <img
                                            src={
                                                student.user.image
                                                    ? `http://localhost:15976/${student.user.image}`
                                                    : "https://via.placeholder.com/40"
                                            }
                                            alt={student.user.fullName}
                                            className="w-10 h-10 rounded-full object-cover border"
                                        />
                                        <span>{student.user.fullName}</span>
                                    </td>
                                    <td className="px-4 py-2">{student.user.phone}</td>
                                    <td className="px-4 py-2">{student.user.email}</td>
                                    <td className="px-4 py-2">
                                        {new Date(student.user.birthDay).toLocaleDateString("uz-UZ")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div>
                <CreateAttendence lessonId={lessonid} students={students}/>
            </div>
        </div>
    )
}

export default LessonPage


endi buni moslab berr

### 🤖 ChatGPT:

Zo‘r — siz endi `LessonPage` komponentini **yangi attendance DTO strukturasiga** moslamoqchisiz (ya’ni endi `studentId[]` emas, `attendances[]` yuboramiz).  
Shuningdek, default attendance yaratish logikasini ham to‘g‘rilaymiz.

Quyida sizning kodingizni optimallashtirilgan va yangi DTO’ga **to‘liq mos** shaklda yozdim 👇  

---

## ✅ To‘liq moslashtirilgan `LessonPage.tsx`

```tsx
"use client"

import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Lesson, Staff } from "@/types"
import React, { useEffect, useMemo, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Attendentionals, Staffs } from "@/features"
import CreateAttendence from "@/dashboard/area/modal/CreateAttendence"

interface LessonPageParamsType {
  params: Promise<{ lessonid: string }>
}

function LessonPage({ params }: LessonPageParamsType) {
  const { lessonid } = React.use(params)
  const router = useRouter()
  const { lessons, error: LessonsError, loading: LessonsLoading } = useAllFetchedData()
  const [students, setStudents] = useState<Staff[]>([])
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true)
  const { selectedGroupId } = useSelectedStore()

  // === Lessonni topish ===
  const lesson: Lesson | undefined = useMemo(() => {
    return lessons.find((l) => l.id === lessonid)
  }, [lessons, lessonid])

  // 🟢 Default attendance yozuvlarini yaratish
  const handleDefaultCreateAttendence = async (studentsList: Staff[]) => {
    if (!lesson || studentsList.length === 0) return

    try {
      // Agar lessonda hali davomat mavjud bo‘lmasa — yangi yozuvlar yaratamiz
      if (!lesson.attendCount || lesson.attendCount < studentsList.length) {
        const payload = {
          lessonId: lesson.id,
          attendances: studentsList.map((s) => ({
            studentId: s.id,
            kelgan: false,
            kelganVaqti: new Date().toISOString(),
          })),
        }

        await Attendentionals.createAttendentional(payload)
        console.log("✅ Default attendance yozuvlari yaratildi")
      }
    } catch (error) {
      console.error("Davomatni yaratishda xatolik:", error)
    }
  }

  // === Talabalarni olish ===
  const fetchStudents = async () => {
    if (!selectedGroupId) return
    try {
      setLoadingStudents(true)
      const res = await Staffs.getStudentsByGroupId(selectedGroupId)
      setStudents(res)
      await handleDefaultCreateAttendence(res)
    } catch (error) {
      console.error("Talabalarni olishda xatolik:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [lessonid, selectedGroupId])

  // === Error holatlari ===
  if (LessonsError) {
    return (
      <h1 className="text-center text-red-500 mt-10">
        ❌ Lesson yuklashda xatolik!
      </h1>
    )
  }

  if (LessonsLoading || !lesson) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <CircularProgress size={80} />
        <p className="ml-3 text-lg">Dars yuklanmoqda...</p>
      </div>
    )
  }

  // === Sahifa render ===
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 space-y-6">
      {/* Dars tafsilotlari */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative">
        {/* Ortga qaytish */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Ortga
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🧾 Dars tafsilotlari
        </h1>

        {/* Lesson ma’lumotlari */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700 w-full">
          <div>
            <p className="font-medium">📚 Dars raqami:</p>
            <p>{lesson.lessonNumber}</p>
          </div>
          <div>
            <p className="font-medium">👨‍🏫 O‘qituvchi:</p>
            <p>{lesson.teacherName}</p>
          </div>
          <div>
            <p className="font-medium">🏫 Guruh:</p>
            <p>{lesson.groupName}</p>
          </div>
          <div>
            <p className="font-medium">🏠 Xona:</p>
            <p>
              {lesson.roomName} #{lesson.roomNumber}
            </p>
          </div>
          <div>
            <p className="font-medium">🕓 Boshlanish:</p>
            <p>{new Date(lesson.startDate).toLocaleString("uz-UZ")}</p>
          </div>
          <div>
            <p className="font-medium">🕒 Tugash:</p>
            <p>
              {lesson.endDate
                ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                : "–"}
            </p>
          </div>
          <div>
            <p className="font-medium">👥 O‘quvchilar soni:</p>
            <p>{lesson.studentsCount}</p>
          </div>
          <div>
            <p className="font-medium">✅ Davomat qilganlar:</p>
            <p>{lesson.attendCount}</p>
          </div>
          <div>
            <p className="font-medium">📅 Status:</p>
            <p
              className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                lesson.isDeleted
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {lesson.isDeleted ? "❌ O‘chirilgan" : "✅ Faol"}
            </p>
          </div>
        </div>
      </div>

      {/* Talabalar ro‘yxati */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🎓 Talabalar ro‘yxati
        </h2>

        {loadingStudents ? (
          <div className="flex justify-center py-6 text-gray-500">
            <CircularProgress size={50} />
          </div>
        ) : students.length === 0 ? (
          <p className="text-gray-500 text-center">Talabalar topilmadi.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Ism familiya</th>
                <th className="px-4 py-2 text-left">Telefon</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Tug‘ilgan sana</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={student.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 flex items-center gap-3">
                    <img
                      src={
                        student.user.image
                          ? `http://localhost:15976/${student.user.image}`
                          : "https://via.placeholder.com/40"
                      }
                      alt={student.user.fullName}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span>{student.user.fullName}</span>
                  </td>
                  <td className="px-4 py-2">{student.user.phone}</td>
                  <td className="px-4 py-2">{student.user.email}</td>
                  <td className="px-4 py-2">
                    {new Date(student.user.birthDay).toLocaleDateString("uz-UZ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Davomatni boshqarish */}
      <div>
        <CreateAttendence lessonId={lessonid} students={students} />
      </div>
    </div>
  )
}

export default LessonPage
```

---

### 🔍 Asosiy o‘zgarishlar:
- `handleDefaultCreateAttendence()` endi `attendances: { studentId, kelgan, kelganVaqti }[]` formatida yuboradi.
- Endi `Attendentionals.createAttendentional()` API yangi DTO (`attendances[]`) bilan ishlaydi.
- `lessonId` to‘g‘ridan-to‘g‘ri `lesson.id` orqali uzatiladi.
- `lesson.attendCount` tekshiruv sharti to‘g‘rilandi.

---

Xohlaysizmi, endi `CreateAttendence` komponentini ham shu yangi `attendances[]` formatda, **table orqali belgilanadigan (checkbox bilan)** qilib yozib beray?

---

### 👤 Foydalanuvchi:

"use client"

import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material"
import { Staff } from "@/types"
import { Attendentionals } from "@/features"

interface CreateAttendenceProps {
  lessonId: string
  students: Staff[]
}

const CreateAttendence: React.FC<CreateAttendenceProps> = ({
  lessonId,
  students,
}) => {
  const [attendances, setAttendances] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 📥 Davomat ma'lumotlarini olish
  const fetchAttendences = async () => {
    try {
      setLoading(true)
      const data = await Attendentionals.getAttendentionalsByLessonId(lessonId)
      setAttendances(data || [])
    } catch (err) {
      console.error("Davomatni olishda xatolik:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendences()
  }, [lessonId])

  // 🔄 Checkboxni o‘zgartirish
  const handleToggle = (studentId: string) => {
    setAttendances((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? { ...item, kelgan: !item.kelgan }
          : item
      )
    )
  }

  // 💾 Saqlash
  const handleSubmit = async () => {
    const presentStudents = attendances.filter((a) => a.kelgan)

    if (presentStudents.length === 0) {
      alert("Hech kim belgilanmagan")
      return
    }

    try {
      setLoading(true)
      await Promise.all(
        attendances.map(async (p) => {
          const payload = {
            lessonId,
            studentId: p.studentId,
            kelganVaqti: new Date().toISOString(),
            kelgan: p.kelgan,
          }
          return Attendentionals.updateAttendentional(p.id, payload)
        })
      )

      alert("Davomat muvaffaqiyatli saqlandi ✅")
    } catch (error) {
      console.error(error)
      alert("Davomatni saqlashda xatolik yuz berdi ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Davomatni belgilang</h2>

      {loading ? (
        <div className="flex justify-center p-4">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Talaba ismi</TableCell>
                <TableCell>Kelgan</TableCell>
                <TableCell>Kelgan vaqti</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendances.length > 0 ? (
                attendances.map((a, index) => (
                  <TableRow key={a.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{a.studentName || "Noma’lum"}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={a.kelgan || false}
                        onChange={() => handleToggle(a.studentId)}
                      />
                    </TableCell>
                    <TableCell>
                      {a.kelganVaqti
                        ? new Date(a.kelganVaqti).toLocaleTimeString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Davomat ma’lumotlari yo‘q
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <div className="flex justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          Saqlash
        </Button>
      </div>
    </div>
  )
}

export default CreateAttendence

endi buni moslab ber  attendence uchun barcha kerak columnlarni qo'sh

### 🤖 ChatGPT:

Zo‘r — sening `CreateAttendence` komponenting funksional ishlayapti 👌  
Endi uni **to‘liq, real davomat boshqaruvi jadvali** holatiga keltiramiz:  
✅ har bir student haqida to‘liq ma’lumot bo‘ladi:  
- tartib raqami  
- ism familiya  
- telefon raqami  
- email  
- kelgan/kelmagan (checkbox)  
- kelgan vaqti  
- holati (faol / o‘chirilgan)  

Bundan tashqari, agar `attendances` bo‘sh bo‘lsa, `students` ro‘yxatidan avtomatik boshlang‘ich ma’lumotlar yaratib ko‘rsatamiz (shunda ustoz darsni boshlaganda jadval bo‘sh chiqmaydi).  

Mana moslashtirilgan, to‘liq ishlaydigan variant 👇  

---

```tsx
"use client"

import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material"
import { Staff } from "@/types"
import { Attendentionals } from "@/features"

interface CreateAttendenceProps {
  lessonId: string
  students: Staff[]
}

const CreateAttendence: React.FC<CreateAttendenceProps> = ({
  lessonId,
  students,
}) => {
  const [attendances, setAttendances] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 📥 Davomat ma'lumotlarini olish
  const fetchAttendences = async () => {
    try {
      setLoading(true)
      const data = await Attendentionals.getAttendentionalsByLessonId(lessonId)

      if (data && data.length > 0) {
        setAttendances(data)
      } else {
        // Agar mavjud bo'lmasa — default jadvalni yaratamiz
        const initialData = students.map((s) => ({
          id: crypto.randomUUID(),
          lessonId,
          studentId: s.id,
          studentName: s.user.fullName,
          studentPhone: s.user.phone,
          studentEmail: s.user.email,
          kelgan: false,
          kelganVaqti: null,
          isDeleted: false,
        }))
        setAttendances(initialData)
      }
    } catch (err) {
      console.error("Davomatni olishda xatolik:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendences()
  }, [lessonId, students])

  // 🔄 Checkboxni o‘zgartirish
  const handleToggle = (studentId: string) => {
    setAttendances((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? {
              ...item,
              kelgan: !item.kelgan,
              kelganVaqti: !item.kelgan
                ? new Date().toISOString()
                : null,
            }
          : item
      )
    )
  }

  // 💾 Saqlash
  const handleSubmit = async () => {
    const presentStudents = attendances.filter((a) => a.kelgan)

    if (presentStudents.length === 0) {
      alert("Hech kim belgilanmagan")
      return
    }

    try {
      setLoading(true)
      await Promise.all(
        attendances.map(async (p) => {
          const payload = {
            lessonId,
            studentId: [p.studentId], // Dto endi massiv qabul qiladi
            kelganVaqti: p.kelgan ? p.kelganVaqti : undefined,
            kelgan: p.kelgan,
            isDeleted: p.isDeleted,
          }
          return Attendentionals.updateAttendentional(p.id, payload)
        })
      )

      alert("Davomat muvaffaqiyatli saqlandi ✅")
    } catch (error) {
      console.error(error)
      alert("Davomatni saqlashda xatolik yuz berdi ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        🧾 Dars davomat jadvali
      </h2>

      {loading ? (
        <div className="flex justify-center p-4">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} className="shadow-md">
          <Table>
            <TableHead>
              <TableRow className="bg-blue-600">
                <TableCell className="text-white font-semibold">#</TableCell>
                <TableCell className="text-white font-semibold">Ism familiya</TableCell>
                <TableCell className="text-white font-semibold">Telefon</TableCell>
                <TableCell className="text-white font-semibold">Email</TableCell>
                <TableCell className="text-white font-semibold">Kelgan</TableCell>
                <TableCell className="text-white font-semibold">Kelgan vaqti</TableCell>
                <TableCell className="text-white font-semibold">Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {attendances.length > 0 ? (
                attendances.map((a, index) => (
                  <TableRow key={a.studentId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{a.studentName}</TableCell>
                    <TableCell>{a.studentPhone}</TableCell>
                    <TableCell>{a.studentEmail}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={a.kelgan || false}
                        onChange={() => handleToggle(a.studentId)}
                      />
                    </TableCell>
                    <TableCell>
                      {a.kelganVaqti
                        ? new Date(a.kelganVaqti).toLocaleTimeString("uz-UZ")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {a.isDeleted ? (
                        <span className="px-3 py-1 rounded bg-red-100 text-red-600 text-sm">
                          O‘chirilgan
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded bg-green-100 text-green-600 text-sm">
                          Faol
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Davomat ma’lumotlari yo‘q
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <div className="flex justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          Saqlash
        </Button>
      </div>
    </div>
  )
}

export default CreateAttendence
```

---

### 🔧 Izohlar:
- `studentId` endi **array** sifatida yuboriladi (`dto`ga mos).
- `kelganVaqti` faqat `kelgan` bo‘lsa yoziladi.
- Jadvalda `phone`, `email`, `status` ustunlari qo‘shildi.
- `kelgan` bo‘lmaganlarda vaqt `"–"` ko‘rinadi.
- Bo‘sh `attendances` bo‘lsa, `students` dan avtomatik ro‘yxat tuziladi.

---

Xohlaysanmi, endi shu komponentni **davomat qo‘shilmagan bo‘lsa avtomatik create qilish** (backend API orqali `POST`) imkoniyatini ham qo‘shay?

---

### 👤 Foydalanuvchi:

[{
	"resource": "/home/fayzillo/Desktop/crm/front/src/dashboard/area/modal/CreateAttendence.tsx",
	"owner": "typescript",
	"code": "2345",
	"severity": 8,
	"message": "Argument of type '{ lessonId: string; studentId: any[]; kelganVaqti: any; kelgan: any; isDeleted: any; }' is not assignable to parameter of type 'Partial<Attendentional>'.\n  Types of property 'studentId' are incompatible.\n    Type 'any[]' is not assignable to type 'string'.",
	"source": "ts",
	"startLineNumber": 102,
	"startColumn": 61,
	"endLineNumber": 102,
	"endColumn": 68,
	"origin": "extHost1"
}]

### 🤖 ChatGPT:

Zo‘r — bu TypeScript xatosi aniq va uni tuzatish oson ✅  

### 🧠 Sabab:
`updateAttendentional()` funksiyasida **`Partial<Attendentional>`** kutilmoqda,  
ya’ni undagi `studentId` — **`string`** tipida.  
Lekin biz `payload`da uni `string[]` (massiv) sifatida yuboryapmiz — shuning uchun TypeScript norozilik bildiryapti.

---

### 🩹 2 xil yechim bor:

#### 🧩 **Variant 1 — `updateAttendentional` faqat bitta student uchun ishlaydi (tavsiya qilinadi)**
Demak, `studentId` ni oddiy `string` qilib yuboramiz, massiv emas.

```tsx
const payload = {
  lessonId,
  studentId: p.studentId, // ✅ massiv emas, string
  kelganVaqti: p.kelgan ? p.kelganVaqti : undefined,
  kelgan: p.kelgan,
  isDeleted: p.isDeleted,
}
return Attendentionals.updateAttendentional(p.id, payload)
```

Bu eng to‘g‘ri yo‘l, chunki `update-one/:id` endpoint **bitta yozuv**ni yangilaydi,  
shuning uchun `studentId` ham bitta bo‘lishi kerak.

---

#### 🧩 **Variant 2 — `CreateAttendentionalDto` tipiga mos `create` qilish (yangi yozuvlar uchun)**
Agar sen `createAttendentional` funksiyasini ishlatayotgan bo‘lsang, unda `studentId` massiv bo‘lishi to‘g‘ri.

Lekin `updateAttendentional` bu joyda yangilash uchun ishlatilayotgan,  
demak — **Variant 1**ni tanlaymiz.

---

### ✅ Yakuniy to‘g‘rilangan joy:
```tsx
await Promise.all(
  attendances.map(async (p) => {
    const payload = {
      lessonId,
      studentId: p.studentId, // ✅ tuzatildi
      kelganVaqti: p.kelgan ? p.kelganVaqti : undefined,
      kelgan: p.kelgan,
      isDeleted: p.isDeleted,
    }
    return Attendentionals.updateAttendentional(p.id, payload)
  })
)
```

---

Agar sen keyin **ko‘p studentni bir martada create qilish**ni istasang —  
`Attendentionals.createAttendentional()`ni ishlatamiz va u yerda `studentId: string[]` to‘g‘ri ishlaydi.  

Xohlaysanmi, men senga shunday `bulk create` logikasi bilan kodni to‘liq qilib beray?

---

### 👤 Foydalanuvchi:

  const fetchAttendences = async () => {
    try {
      setLoading(true)
      const data = await Attendentionals.getAttendentionalsByLessonId(lessonId)

      if (data && data.length > 0) {
        setAttendances(data)
      } else {
        // Agar mavjud bo'lmasa — default jadvalni yaratamiz
        const initialData = students.map((s) => ({
          id: crypto.randomUUID(),
          lessonId,
          studentId: s.id,
          studentName: s.user.fullName,
          studentPhone: s.user.phone,
          studentEmail: s.user.email,
          kelgan: false,
          kelganVaqti: null,
          isDeleted: false,
        }))
        setAttendances(initialData)
      }
    } catch (err) {
      console.error("Davomatni olishda xatolik:", err)
    } finally {
      setLoading(false)
    }
  }



bunda dublicate bo'lib qolayabdi

### 🤖 ChatGPT:

Zo‘r, bu muammo **`dublicate` (takrorlanish)** — ya’ni bir xil student uchun `attendence` ikki marta yozilib qolayapti.  

Keling, sababni tahlil qilamiz 👇

---

## 🧩 Sabab

`fetchAttendences()` funksiyasi **har safar chaqirilganda**, quyidagilarni qiladi:

1. `Attendentionals.getAttendentionalsByLessonId(lessonId)` orqali ma’lumot oladi.  
2. Agar natija **bo‘sh bo‘lsa**, `students.map()` orqali `initialData` yaratadi.  
3. Lekin — `data.length > 0` bo‘lsa ham, ba’zida serverdan eski yoki aralash ma’lumot kelib, **yangi studentlar qo‘shilganda** eski `attendances` bilan qo‘shilib ketadi.  
4. Yoki `initialData` bilan `data` bir-birini to‘ldiradi, natijada **takror yozuvlar** hosil bo‘ladi.

---

## ✅ To‘g‘ri yechim — mavjud studentlarni tekshirib, faqat yo‘q bo‘lganlarni qo‘shish

Quyidagi kod `data`ni saqlaydi va faqat **yangi** studentlarni (attendence yo‘q bo‘lganlarni) qo‘shadi:

```tsx
const fetchAttendences = async () => {
  try {
    setLoading(true)
    const data = await Attendentionals.getAttendentionalsByLessonId(lessonId)

    // Eski davomatlar mavjud bo'lsa
    if (data && data.length > 0) {
      // Bazadagi studentId larni olish
      const existingIds = data.map((d) => d.studentId)

      // Yangi qo‘shilmagan studentlarni topish
      const newStudents = students.filter((s) => !existingIds.includes(s.id))

      // Agar yangi studentlar bo‘lsa, ular uchun default davomatlar yaratamiz
      const newData = newStudents.map((s) => ({
        id: crypto.randomUUID(),
        lessonId,
        studentId: s.id,
        studentName: s.user.fullName,
        studentPhone: s.user.phone,
        studentEmail: s.user.email,
        kelgan: false,
        kelganVaqti: null,
        isDeleted: false,
      }))

      // Barcha ma’lumotlarni birlashtirib set qilamiz
      setAttendances([...data, ...newData])
    } else {
      // Hali umuman davomat bo'lmasa, to'liq initialData yaratamiz
      const initialData = students.map((s) => ({
        id: crypto.randomUUID(),
        lessonId,
        studentId: s.id,
        studentName: s.user.fullName,
        studentPhone: s.user.phone,
        studentEmail: s.user.email,
        kelgan: false,
        kelganVaqti: null,
        isDeleted: false,
      }))
      setAttendances(initialData)
    }
  } catch (err) {
    console.error("Davomatni olishda xatolik:", err)
  } finally {
    setLoading(false)
  }
}
```

---

### 💡 Izoh
- Endi **har bir student** uchun `lessonId` asosida **bitta** `attendence` bo‘ladi.  
- Agar yangi student qo‘shilsa, u avtomatik qo‘shiladi,  
  lekin mavjud studentlar qayta kiritilmaydi.

---

Xohlaysizmi, men sizga shunga moslab `saveAttendences()` (create/update) qismini ham dublikatga qarshi qilib beray?

---

### 👤 Foydalanuvchi:

[
    {
        "id": "4ae384dd-3dac-4f7f-9705-df95ef41eb6a",
        "lessonId": "be07bc87-5840-4a6e-aea7-92b007bd4ba7",
        "lessonName": null,
        "studentId": "78519ebe-5a96-4bbf-b11d-50207e46e630",
        "studentName": null,
        "kelganVaqti": "2025-10-23T19:33:53.564Z",
        "kelgan": true,
        "isDeleted": false
    },
    {
        "id": "cde9f433-ce12-42f2-a829-998b6054a8b1",
        "lessonId": "be07bc87-5840-4a6e-aea7-92b007bd4ba7",
        "lessonName": null,
        "studentId": "3c0f817b-de41-4087-8c9c-c66bea445f69",
        "studentName": null,
        "kelganVaqti": "2025-10-23T19:33:21.875Z",
        "kelgan": true,
        "isDeleted": false
    }
]




"use client"

import React, { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    CircularProgress,
} from "@mui/material"
import { Staff } from "@/types"
import { Attendentionals } from "@/features"

interface CreateAttendenceProps {
    lessonId: string
    students: Staff[]
}

const CreateAttendence: React.FC<CreateAttendenceProps> = ({
    lessonId,
    students,
}) => {
    const [attendances, setAttendances] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    // 📥 Davomat ma'lumotlarini olish
    const fetchAttendences = async () => {
        try {
            setLoading(true)
            const data = await Attendentionals.getAttendentionalsByLessonId(lessonId)

            // Eski davomatlar mavjud bo'lsa
            if (data && data.length > 0) {
                // Bazadagi studentId larni olish
                const existingIds = data.map((d) => d.studentId)

                // Yangi qo‘shilmagan studentlarni topish
                const newStudents = students.filter((s) => !existingIds.includes(s.id))

                // Agar yangi studentlar bo‘lsa, ular uchun default davomatlar yaratamiz
                const newData = newStudents.map((s) => ({
                    id: crypto.randomUUID(),
                    lessonId,
                    studentId: s.id,
                    studentName: s.user.fullName,
                    studentPhone: s.user.phone,
                    studentEmail: s.user.email,
                    kelgan: false,
                    kelganVaqti: null,
                    isDeleted: false,
                }))

                // Barcha ma’lumotlarni birlashtirib set qilamiz
                setAttendances([...data, ...newData])
            } else {
                // Hali umuman davomat bo'lmasa, to'liq initialData yaratamiz
                const initialData = students.map((s) => ({
                    id: crypto.randomUUID(),
                    lessonId,
                    studentId: s.id,
                    studentName: s.user.fullName,
                    studentPhone: s.user.phone,
                    studentEmail: s.user.email,
                    kelgan: false,
                    kelganVaqti: null,
                    isDeleted: false,
                }))
                setAttendances(initialData)
            }
        } catch (err) {
            console.error("Davomatni olishda xatolik:", err)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchAttendences()
    }, [lessonId, students])

    useEffect(() => {
        console.log(attendances)
    }, [attendances])

    // 🔄 Checkboxni o‘zgartirish
    const handleToggle = (studentId: string) => {
        setAttendances((prev) =>
            prev.map((item) =>
                item.studentId === studentId
                    ? {
                        ...item,
                        kelgan: !item.kelgan,
                        kelganVaqti: !item.kelgan
                            ? new Date().toISOString()
                            : null,
                    }
                    : item
            )
        )
    }

    // 💾 Saqlash
    const handleSubmit = async () => {
        const presentStudents = attendances.filter((a) => a.kelgan)

        if (presentStudents.length === 0) {
            alert("Hech kim belgilanmagan")
            return
        }

        try {
            setLoading(true)
            await Promise.all(
                attendances.map(async (p) => {
                    const payload = {
                        lessonId,
                        studentId: p.studentId, // Dto endi massiv qabul qiladi
                        kelganVaqti: p.kelgan ? p.kelganVaqti : undefined,
                        kelgan: p.kelgan,
                        isDeleted: p.isDeleted,
                    }
                    return Attendentionals.updateAttendentional(p.id, payload)
                })
            )

            alert("Davomat muvaffaqiyatli saqlandi ✅")
        } catch (error) {
            console.error(error)
            alert("Davomatni saqlashda xatolik yuz berdi ❌")
        } finally {
            setLoading(false)
        }
    }

    if (attendances.length == 0) {
        return <h1>Yuklanmoqda .</h1>
    }
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
                🧾 Dars davomat jadvali
            </h2>

            {loading ? (
                <div className="flex justify-center p-4">
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper} className="shadow-md">
                    <Table>
                        <TableHead>
                            <TableRow className="bg-blue-600">
                                <TableCell className="text-white font-semibold">#</TableCell>
                                <TableCell className="text-white font-semibold">Ism familiya</TableCell>
                                <TableCell className="text-white font-semibold">Telefon</TableCell>
                                <TableCell className="text-white font-semibold">Email</TableCell>
                                <TableCell className="text-white font-semibold">Kelgan</TableCell>
                                <TableCell className="text-white font-semibold">Kelgan vaqti</TableCell>
                                <TableCell className="text-white font-semibold">Status</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {attendances.length > 0 ? (
                                attendances.map((a, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{a.studentName}</TableCell>
                                        <TableCell>{a.studentPhone}</TableCell>
                                        <TableCell>{a.studentEmail}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={a.kelgan || false}
                                                onChange={() => handleToggle(a.studentId)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {a.kelganVaqti
                                                ? new Date(a.kelganVaqti).toLocaleTimeString("uz-UZ")
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {a.isDeleted ? (
                                                <span className="px-3 py-1 rounded bg-red-100 text-red-600 text-sm">
                                                    O‘chirilgan
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded bg-green-100 text-green-600 text-sm">
                                                    Faol
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        Davomat ma’lumotlari yo‘q
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <div className="flex justify-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    Saqlash
                </Button>
            </div>
        </div>
    )
}

export default CreateAttendence

nega fulllName email phone chiqmayabdi

### 🤖 ChatGPT:

Ajoyib savol — bu joydagi muammo **backenddan kelayotgan `attendentionals` ma’lumotida `student` bilan bog‘liq `user` join` qilinmagani** sababli, `studentName`, `studentEmail`, `studentPhone` qiymatlari `null` bo‘lib kelayapti.  

Quyidagicha aniqlik kiritamiz 👇  

---

## 🧩 Nima bo‘layapti:

Backenddan kelyotgan ma’lumot shunday:
```json
{
  "studentId": "78519ebe-5a96-4bbf-b11d-50207e46e630",
  "studentName": null,
  "kelgan": true
}
```

Demak, `studentName`, `studentPhone`, `studentEmail` backenddan `null` qaytayapti.  
Frontend esa shu qiymatlarni `a.studentName`, `a.studentPhone`, `a.studentEmail` orqali olishga urinayapti — shuning uchun bo‘sh chiqadi.

---

## ✅ Yechim 1: Backendda `student -> user` ni join qilish

**`AttendentionalsService`** ichida `findAll()`, `getAll_ByLessonId()`, `getAll_ByGroupId()` metodlarida `Prisma` query`ni shunday yozish kerak:

```ts
return this.prisma.attendentionals.findMany({
  where: { lessonId },
  include: {
    student: {
      include: {
        user: true, // <— shu qo‘shiladi
      },
    },
    lesson: true,
  },
});
```

🔹 Shunda `response` quyidagicha bo‘ladi:
```json
{
  "id": "123",
  "lessonId": "abc",
  "student": {
    "id": "78519ebe-5a96-4bbf-b11d-50207e46e630",
    "user": {
      "fullName": "Ali Karimov",
      "email": "ali@mail.com",
      "phone": "+99890...",
    }
  },
  "kelgan": true
}
```

---

## ✅ Yechim 2: Frontendda `map` qilib `student` ichidan ma’lumotni ajratib olish

Agar backendni hozircha o‘zgartirmoqchi bo‘lmasangiz, quyidagi **frontend fix** ham ishlaydi:

```tsx
const data = await Attendentionals.getAttendentionalsByLessonId(lessonId)

const normalizedData = data.map((a) => ({
  ...a,
  studentName: a.student?.user?.fullName ?? a.studentName ?? "Noma’lum",
  studentPhone: a.student?.user?.phone ?? a.studentPhone ?? "-",
  studentEmail: a.student?.user?.email ?? a.studentEmail ?? "-",
}))

setAttendances(normalizedData)
```

> 🟢 Bu variant backendni hozircha o‘zgartirmasdan ham ishlaydi,  
> lekin to‘liq, toza yechim uchun backendga `include` qo‘shish yaxshiroq.

---

## 🔧 Yakuniy tavsiya

Eng yaxshi variant — **backendda to‘liq join qilish**, chunki:
- Har safar frontendda `student`ni qo‘lda "extract" qilish shart bo‘lmaydi.  
- `studentName`, `phone`, `email` kabi maydonlar har doim to‘liq to‘ladi.

---

Xohlaysizmi, men sizga `AttendentionalsService` uchun `getAll_ByLessonId()` va `getAll_ByGroupId()` metodlarini to‘liq `include` bilan yozib beray?

---

### 👤 Foydalanuvchi:

"use client"

import React, { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    CircularProgress,
} from "@mui/material"
import { Staff } from "@/types"
import { Attendentionals } from "@/features"

interface CreateAttendenceProps {
    lessonId: string
    students: Staff[]
}

const CreateAttendence: React.FC<CreateAttendenceProps> = ({
    lessonId,
    students,
}) => {
    const [attendances, setAttendances] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    // 📥 Davomat ma'lumotlarini olish
    const fetchAttendences = async () => {
        try {
            setLoading(true)
            const data = await Attendentionals.getAttendentionalsByLessonId(lessonId)

            // Eski davomatlar mavjud bo'lsa
            if (data && data.length > 0) {
                // Bazadagi studentId larni olish
                const existingIds = data.map((d) => d.studentId)

                // Yangi qo‘shilmagan studentlarni topish
                const newStudents = students.filter((s) => !existingIds.includes(s.id))

                // Agar yangi studentlar bo‘lsa, ular uchun default davomatlar yaratamiz
                const newData = newStudents.map((s) => ({
                    id: crypto.randomUUID(),
                    lessonId,
                    studentId: s.id,
                    studentName: s.user.fullName,
                    studentPhone: s.user.phone,
                    studentEmail: s.user.email,
                    kelgan: false,
                    kelganVaqti: null,
                    isDeleted: false,
                }))

                // Barcha ma’lumotlarni birlashtirib set qilamiz
                setAttendances([...data, ...newData])
            } else {
                // Hali umuman davomat bo'lmasa, to'liq initialData yaratamiz
                const initialData = students.map((s) => ({
                    id: crypto.randomUUID(),
                    lessonId,
                    studentId: s.id,
                    studentName: s.user.fullName,
                    studentPhone: s.user.phone,
                    studentEmail: s.user.email,
                    kelgan: false,
                    kelganVaqti: null,
                    isDeleted: false,
                }))
                setAttendances(initialData)
            }
        } catch (err) {
            console.error("Davomatni olishda xatolik:", err)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchAttendences()
    }, [lessonId, students])

    useEffect(() => {
        console.log(attendances)
    }, [attendances])

    // 🔄 Checkboxni o‘zgartirish
    const handleToggle = (studentId: string) => {
        setAttendances((prev) =>
            prev.map((item) =>
                item.studentId === studentId
                    ? {
                        ...item,
                        kelgan: !item.kelgan,
                        kelganVaqti: !item.kelgan
                            ? new Date().toISOString()
                            : null,
                    }
                    : item
            )
        )
    }

    // 💾 Saqlash
    const handleSubmit = async () => {
        const presentStudents = attendances.filter((a) => a.kelgan)

        if (presentStudents.length === 0) {
            alert("Hech kim belgilanmagan")
            return
        }

        try {
            setLoading(true)
            await Promise.all(
                attendances.map(async (p) => {
                    const payload = {
                        lessonId,
                        studentId: p.studentId, // Dto endi massiv qabul qiladi
                        kelganVaqti: p.kelgan ? p.kelganVaqti : undefined,
                        kelgan: p.kelgan,
                        isDeleted: p.isDeleted,
                    }
                    return Attendentionals.updateAttendentional(p.id, payload)
                })
            )

            alert("Davomat muvaffaqiyatli saqlandi ✅")
        } catch (error) {
            console.error(error)
            alert("Davomatni saqlashda xatolik yuz berdi ❌")
        } finally {
            setLoading(false)
        }
    }

    if (attendances.length == 0) {
        return <h1>Yuklanmoqda .</h1>
    }
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
                🧾 Dars davomat jadvali
            </h2>

            {loading ? (
                <div className="flex justify-center p-4">
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper} className="shadow-md">
                    <Table>
                        <TableHead>
                            <TableRow className="bg-blue-600">
                                <TableCell className="text-white font-semibold">#</TableCell>
                                <TableCell className="text-white font-semibold">Ism familiya</TableCell>
                                <TableCell className="text-white font-semibold">Telefon</TableCell>
                                <TableCell className="text-white font-semibold">Email</TableCell>
                                <TableCell className="text-white font-semibold">Kelgan</TableCell>
                                <TableCell className="text-white font-semibold">Kelgan vaqti</TableCell>
                                <TableCell className="text-white font-semibold">Status</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {attendances.length > 0 ? (
                                attendances.map((a, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{a.studentName}</TableCell>
                                        <TableCell>{a.studentPhone}</TableCell>
                                        <TableCell>{a.studentEmail}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={a.kelgan || false}
                                                onChange={() => handleToggle(a.studentId)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {a.kelganVaqti
                                                ? new Date(a.kelganVaqti).toLocaleTimeString("uz-UZ")
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {a.isDeleted ? (
                                                <span className="px-3 py-1 rounded bg-red-100 text-red-600 text-sm">
                                                    O‘chirilgan
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded bg-green-100 text-green-600 text-sm">
                                                    Faol
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        Davomat ma’lumotlari yo‘q
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <div className="flex justify-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    Saqlash
                </Button>
            </div>
        </div>
    )
}

export default CreateAttendence


buni takomillashtir yani default yaratish logikasini

### 🤖 ChatGPT:

Zo‘r, Fayzillo — sening kod bazang ancha toza yozilgan 👏  
Ammo ha, hozirgi `default yaratish` logikasi biroz murakkab va **dublikatlarga** sabab bo‘lishi mumkin, chunki `data` va `students`ni alohida solishtirishda qayta-qayta `set` qilinadi.

Keling, **aniq, soddalashgan va xavfsiz** yechim yozamiz:  
birinchi backenddan kelgan `attendances`ni olamiz,  
keyin `students` ro‘yxatiga qarab **har bir talaba uchun bitta qatordan ortiq bo‘lmasligi**ni ta’minlaymiz.  

---

## ✅ Takomillashtirilgan versiya

```tsx
"use client"

import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material"
import { Staff } from "@/types"
import { Attendentionals } from "@/features"

interface CreateAttendenceProps {
  lessonId: string
  students: Staff[]
}

const CreateAttendence: React.FC<CreateAttendenceProps> = ({ lessonId, students }) => {
  const [attendances, setAttendances] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 📥 Davomatni olish yoki yaratish
  const fetchAttendences = async () => {
    try {
      setLoading(true)
      const data = await Attendentionals.getAttendentionalsByLessonId(lessonId)

      // Agar bazada mavjud bo‘lsa — normalize qilib olamiz
      const existing = (data || []).map((a: any) => ({
        id: a.id,
        lessonId: a.lessonId,
        studentId: a.studentId,
        studentName: a.student?.user?.fullName ?? a.studentName ?? "Noma’lum",
        studentPhone: a.student?.user?.phone ?? a.studentPhone ?? "-",
        studentEmail: a.student?.user?.email ?? a.studentEmail ?? "-",
        kelgan: a.kelgan ?? false,
        kelganVaqti: a.kelganVaqti ?? null,
        isDeleted: a.isDeleted ?? false,
      }))

      // Har bir student uchun — agar davomat bo‘lmasa, default yaratamiz
      const merged = students.map((s) => {
        const found = existing.find((a) => a.studentId === s.id)
        if (found) return found // mavjud bo‘lsa, bazadagini olamiz

        // bo‘lmasa yangi default yaratamiz
        return {
          id: crypto.randomUUID(),
          lessonId,
          studentId: s.id,
          studentName: s.user.fullName,
          studentPhone: s.user.phone,
          studentEmail: s.user.email,
          kelgan: false,
          kelganVaqti: null,
          isDeleted: false,
        }
      })

      setAttendances(merged)
    } catch (err) {
      console.error("Davomatni olishda xatolik:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendences()
  }, [lessonId, students])

  // 🔄 Checkboxni o‘zgartirish
  const handleToggle = (studentId: string) => {
    setAttendances((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? {
              ...item,
              kelgan: !item.kelgan,
              kelganVaqti: !item.kelgan ? new Date().toISOString() : null,
            }
          : item
      )
    )
  }

  // 💾 Saqlash
  const handleSubmit = async () => {
    try {
      setLoading(true)
      await Promise.all(
        attendances.map(async (p) => {
          const payload = {
            lessonId,
            studentId: p.studentId,
            kelganVaqti: p.kelgan ? p.kelganVaqti : undefined,
            kelgan: p.kelgan,
            isDeleted: p.isDeleted,
          }
          return Attendentionals.updateAttendentional(p.id, payload)
        })
      )

      alert("Davomat muvaffaqiyatli saqlandi ✅")
    } catch (error) {
      console.error(error)
      alert("Davomatni saqlashda xatolik yuz berdi ❌")
    } finally {
      setLoading(false)
    }
  }

  // 🌀 Yuklanish holati
  if (loading && attendances.length === 0) {
    return (
      <div className="flex justify-center p-6">
        <CircularProgress />
      </div>
    )
  }

  // 📋 Jadval
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        🧾 Dars davomat jadvali
      </h2>

      <TableContainer component={Paper} className="shadow-md">
        <Table>
          <TableHead>
            <TableRow className="bg-blue-600">
              <TableCell className="text-white font-semibold">#</TableCell>
              <TableCell className="text-white font-semibold">Ism familiya</TableCell>
              <TableCell className="text-white font-semibold">Telefon</TableCell>
              <TableCell className="text-white font-semibold">Email</TableCell>
              <TableCell className="text-white font-semibold">Kelgan</TableCell>
              <TableCell className="text-white font-semibold">Kelgan vaqti</TableCell>
              <TableCell className="text-white font-semibold">Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {attendances.length > 0 ? (
              attendances.map((a, index) => (
                <TableRow key={a.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{a.studentName}</TableCell>
                  <TableCell>{a.studentPhone}</TableCell>
                  <TableCell>{a.studentEmail}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={a.kelgan || false}
                      onChange={() => handleToggle(a.studentId)}
                    />
                  </TableCell>
                  <TableCell>
                    {a.kelganVaqti
                      ? new Date(a.kelganVaqti).toLocaleTimeString("uz-UZ")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {a.isDeleted ? (
                      <span className="px-3 py-1 rounded bg-red-100 text-red-600 text-sm">
                        O‘chirilgan
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded bg-green-100 text-green-600 text-sm">
                        Faol
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Davomat ma’lumotlari yo‘q
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          Saqlash
        </Button>
      </div>
    </div>
  )
}

export default CreateAttendence
```

---

### 🧠 Nimalar o‘zgardi:
1. **Dublikatlar butunlay yo‘q qilindi**  
   Har bir `studentId` uchun yagona qatordan ortiq bo‘lmaydi.

2. **Normalize qilingan data**  
   `a.student?.user?.fullName` bo‘lmasa ham `studentName` sifatida chiqariladi.

3. **Yangi qo‘shilgan studentlar uchun avtomatik `default` yozuvlar**  
   Bunda `existing`ni `students.map()` ichida tekshirish orqali `merged` ro‘yxat tozalanadi.

4. **Kod ancha ixcham va xavfsiz bo‘ldi**  
   `if/else` larni keskin kamaytirdik, mapping bilan to‘liq nazoratda.

---

Xohlaysanmi, men shu komponentni `CreateAttendence` uchun TypeScript type bilan to‘liq tiplab (DTOga mos) qilib beray?  
Shunda `any[]`lardan ham qutulasan.

---

### 👤 Foydalanuvchi:

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendentionalDto } from './dto/create-attendentional.dto';
import { UpdateAttendentionalDto } from './dto/update-attendentional.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AttendentionalsService {
  constructor(private readonly prisma: PrismaService) { }

  // 🔹 Helper — flatten function
  private flattenRecord(record: any) {
    return {
      id: record.id,
      lessonId: record.lessonId,
      lessonName: record.lesson?.name || null,
      studentId: record.studentId,
      studentName:
        record.student?.firstName && record.student?.lastName
          ? `${record.student.firstName} ${record.student.lastName}`
          : record.student?.firstName || null,
      kelganVaqti: record.kelganVaqti,
      kelgan: record.kelgan,
      isDeleted: record.isDeleted,
      createdAt: record.createdAt,
    };
  }
  // 🟢 CREATE
  async create(data: CreateAttendentionalDto) {
    const { lessonId, attendances } = data;

    // 1. Dars borligini tekshir
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId, isDeleted: false },
    });
    if (!lesson) throw new NotFoundException(`Lesson not found by id [#${lessonId}]`);

    // 2. Student ID larni ajratib olamiz
    const studentIds = attendances.map(a => a.studentId);

    // 3. Mavjud yozuvlarni tekshir
    const existingRecords = await this.prisma.attendentional.findMany({
      where: {
        lessonId,
        studentId: { in: studentIds },
        isDeleted: false,
      },
      select: { studentId: true },
    });

    const existingIds = new Set(existingRecords.map(r => r.studentId));
    const newAttendances = attendances.filter(a => !existingIds.has(a.studentId));

    if (newAttendances.length === 0) {
      throw new ConflictException('All selected students already have attendance records.');
    }

    // 4. createMany uchun tayyorlash
    const dataToInsert = newAttendances.map(a => ({
      lessonId,
      studentId: a.studentId,
      kelgan: a.kelgan ?? false,
      kelganVaqti: a.kelganVaqti ? new Date(a.kelganVaqti) : null,
      isDeleted: a.isDeleted ?? false,
    }));

    // 5. Bazaga yozish
    await this.prisma.attendentional.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });

    return {
      message: `${dataToInsert.length} attendance record(s) successfully created.`,
      createdCount: dataToInsert.length,
    };
  }


  // 🟡 FIND ALL
  async findAll() {
    const records = await this.prisma.attendentional.findMany({
      where: { isDeleted: false },
      include: {
        lesson: true,
        student: true,
      },
      orderBy: { kelganVaqti: 'desc' },
    });

    return {
      message: 'All attendance records retrieved',
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  // 🔵 FIND ONE
  async findOne(id: string) {
    const record = await this.prisma.attendentional.findUnique({
      where: { id },
      include: {
        lesson: true,
        student: {
          include : {
            user : true
          }
        },
      },
    });

    if (!record || record.isDeleted)
      throw new NotFoundException(`Attendance not found by id [#${id}]`);

    return {
      message: `Attendance record #${id} retrieved successfully`,
      attendentional: this.flattenRecord(record),
    };
  }

  // 🟠 UPDATE
  async update(id: string, data: UpdateAttendentionalDto) {
    const exist = await this.prisma.attendentional.findUnique({
      where: { id },
      include: { lesson: true, student: true },
    });

    if (!exist || exist.isDeleted)
      throw new NotFoundException(`Attendance record not found by id [#${id}]`);

    if (
      (data.lessonId && data.lessonId !== exist.lessonId) ||
      (data.studentId && data.studentId !== exist.studentId)
    ) {
      const conflict = await this.prisma.attendentional.findFirst({
        where: {
          lessonId: data.lessonId ?? exist.lessonId,
          studentId: data.studentId ?? exist.studentId,
          isDeleted: false,
        },
      });
      if (conflict && conflict.id !== id)
        throw new ConflictException(
          `This student already has attendance for this lesson.`,
        );
    }

    const updated = await this.prisma.attendentional.update({
      where: { id },
      data: {
        lessonId: data.lessonId ?? exist.lessonId,
        studentId: data.studentId ?? exist.studentId,
        kelgan: data.kelgan ?? exist.kelgan,
        kelganVaqti: data.kelganVaqti
          ? new Date(data.kelganVaqti)
          : exist.kelganVaqti,
      },
      include: { lesson: true, student: true },
    });

    return {
      message: `Attendance record #${id} updated successfully`,
      attendentional: this.flattenRecord(updated),
    };
  }
  /** 🔸 Get all attendance records by LESSON ID */
  async getAll_ByLessonId(lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, isDeleted: false },
    });

    if (!lesson) throw new NotFoundException(`Lesson not found by id [#${lessonId}]`);

    const records = await this.prisma.attendentional.findMany({
      where: { lessonId, isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'asc' },
    });

    return {
      message: `All attendance records for lesson [#${lessonId}]`,
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  /** 🔸 Get all attendance records by GROUP ID */
  async getAll_ByGroupId(groupId: string) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId, isDeleted: false },
      include: { Lesson: true },
    });

    if (!group) throw new NotFoundException(`Group not found by id [#${groupId}]`);

    // barcha lesson ID larni olish
    const lessonIds = group.Lesson.map((l) => l.id);

    if (lessonIds.length === 0)
      return { message: 'No lessons found for this group', count: 0, attendentionals: [] };

    const records = await this.prisma.attendentional.findMany({
      where: { lessonId: { in: lessonIds }, isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'asc' },
    });

    return {
      message: `All attendance records for group [#${groupId}]`,
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  // 🔴 REMOVE (soft delete)
  async remove(id: string) {
    const exist = await this.prisma.attendentional.findUnique({
      where: { id },
      include: { lesson: true, student: true },
    });

    if (!exist || exist.isDeleted)
      throw new NotFoundException(`Attendance record not found by id [#${id}]`);

    const deleted = await this.prisma.attendentional.update({
      where: { id },
      data: { isDeleted: true },
      include: { lesson: true, student: true },
    });

    return {
      message: `Attendance record #${id} soft-deleted successfully`,
      attendentional: this.flattenRecord(deleted),
    };
  }
}



bunda  studentni flatteda xato destuctsiya qilingan barcha metodlarni to'g'rilla 

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
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
  isDeleted Boolean @default(false)

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
  image         String?
  isDeleted     Boolean @default(false)

  groupes Group[]

  @@map("courses")
}

model Group {
  id        String  @id @default(uuid())
  name      String

  teacherId String
  courseId  String
  romId     String

  inActive  Boolean
  isEnd     Boolean @default(false)
  isStart   Boolean @default(false)
  startDate DateTime
  isDeleted Boolean @default(false)

  teacher      Staff          @relation(fields: [teacherId], references: [id])
  course       Course         @relation(fields: [courseId], references: [id])
  students     StudentGroup[]
  Lesson       Lesson[]
  GroupPayment GroupPayment[]
  rom          Rom            @relation(fields: [romId], references: [id])

  @@map("groupes")
}

model Staff {
  id        String  @id @default(uuid())
  userId    String
  role      RoleStafs @default(STUDENT)
  isDeleted Boolean   @default(false)

  groupes         Group[]
  studentGroup    StudentGroup[]
  Lesson          Lesson[]
  Attendentionals Attendentional[]
  GroupPayment    GroupPayment[]
  user            User             @relation(fields: [userId], references: [id])

  @@map("staffs")
}

model User {
  id        String  @id @default(uuid())
  email     String
  phone     String?
  password  String
  firstName String
  lastName  String
  isDeleted Boolean @default(false)
  createdAt DateTime @default(now())
  birthDay  DateTime
  father    String?
  image     String?

  Staff Staff[]
}

model StudentGroup {
  id        String @id @default(uuid())
  studentId String
  groupId   String
  isDeleted Boolean @default(false)

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
  isDeleted Boolean @default(false)

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
  isDeleted   Boolean   @default(false)

  lesson  Lesson @relation(fields: [lessonId], references: [id])
  student Staff  @relation(fields: [studentId], references: [id])

  @@map("attendentionals")
}

model GroupPayment {
  id           String        @id @default(uuid())
  amount       Int
  status       PaymentStatus @default(PENDING)
  paymentMonth Int
  paymentDate  DateTime
  studentId    String
  groupId      String
  isDeleted    Boolean @default(false)

  student Staff @relation(fields: [studentId], references: [id])
  group   Group @relation(fields: [groupId], references: [id])

  @@map("group_payments")
}

aslida prisma bunday edi

### 🤖 ChatGPT:

Ajoyib — men `AttendentionalsService`dagi **student destructuring / include** muammolarini toʻliq tuzatib, `flattenRecord` va hamma CRUD / query metodlarini `student.user` maydonlarini toʻgʻri oladigan qilib yangiladi. Quyida toʻliq, moslashtirilgan va xavfsiz versiyasini beraman.

Asosiy oʻzgarishlar:
- `findMany` / `findUnique` soʻrovlarida `student: { include: { user: true } }` qoʻshildi, shunda `student.user` mavjud bo‘ladi.
- `flattenRecord` endi `record.student` va `record.student.user` mavjudligini tekshiradi va `studentName`, `studentPhone`, `studentEmail` kabi maydonlarni chiqaradi.
- `create()` da lesson tekshiruvini qoldirdim va `createMany` oldidan `attendances`ni validatsiya qilaman.
- `update()`, `findOne()`, `remove()`, `getAll_ByLessonId()` va `getAll_ByGroupId()` metodlari `include` konfiguratsiyasida `student: { include: { user: true } }` ishlatadi.
- Har bir metod javobida `flattenRecord` orqali bir xil format qaytariladi.

Quyida toʻliq kod — `.service.ts` faylingizni shu bilan almashtiring:

```ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAttendentionalDto } from './dto/create-attendentional.dto';
import { UpdateAttendentionalDto } from './dto/update-attendentional.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AttendentionalsService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔹 Helper — normalize / flatten function
  private flattenRecord(record: any) {
    // safety checks for nested relations
    const student = record?.student ?? null;
    const user = student?.user ?? null;

    const studentFirstName = user?.firstName ?? student?.firstName ?? null;
    const studentLastName = user?.lastName ?? student?.lastName ?? null;
    const studentFullName =
      studentFirstName && studentLastName
        ? `${studentFirstName} ${studentLastName}`
        : studentFirstName ?? studentLastName ?? record.studentName ?? null;

    return {
      id: record.id,
      lessonId: record.lessonId,
      lessonName: record.lesson?.name ?? null,
      studentId: record.studentId,
      studentName: studentFullName,
      studentEmail: user?.email ?? record.studentEmail ?? null,
      studentPhone: user?.phone ?? record.studentPhone ?? null,
      kelganVaqti: record.kelganVaqti ?? null,
      kelgan: record.kelgan ?? false,
      isDeleted: record.isDeleted ?? false,
      createdAt: record.createdAt ?? null,
    };
  }

  // 🟢 CREATE (bulk create with attendances[])
  async create(data: CreateAttendentionalDto) {
    const { lessonId, attendances } = data;

    if (!attendances || !Array.isArray(attendances) || attendances.length === 0) {
      throw new BadRequestException('attendances array must be provided and non-empty.');
    }

    // 1. Dars borligini tekshir
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundException(`Lesson not found by id [#${lessonId}]`);

    // 2. Student ID larni ajratib olamiz
    const studentIds = attendances.map((a) => a.studentId);

    // 3. Mavjud yozuvlarni tekshir
    const existingRecords = await this.prisma.attendentional.findMany({
      where: {
        lessonId,
        studentId: { in: studentIds },
        isDeleted: false,
      },
      select: { studentId: true },
    });

    const existingIds = new Set(existingRecords.map((r) => r.studentId));
    const newAttendances = attendances.filter((a) => !existingIds.has(a.studentId));

    if (newAttendances.length > 0) {
      // 4. createMany uchun tayyorlash
      const dataToInsert = newAttendances.map((a) => ({
        lessonId,
        studentId: a.studentId,
        kelgan: a.kelgan ?? false,
        kelganVaqti: a.kelganVaqti ? new Date(a.kelganVaqti) : null,
        isDeleted: a.isDeleted ?? false,
      }));

      // 5. Bazaga yozish
      await this.prisma.attendentional.createMany({
        data: dataToInsert,
        skipDuplicates: true,
      });
    }

    // 6. Shu bilan birga — agar serverga update qilish kerak bo'lsa, mavjudlarini yangilashni ham qo'shsa bo'ladi.
    // (Agar siz create endpoint orqali update ham kutmoqchi bo'lsangiz, shu yerda existinglarni update qiling.)

    return {
      message: `${newAttendances.length} attendance record(s) successfully created.`,
      createdCount: newAttendances.length,
      skippedCount: existingRecords.length,
    };
  }

  // 🟡 FIND ALL
  async findAll() {
    const records = await this.prisma.attendentional.findMany({
      where: { isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'desc' },
    });

    return {
      message: 'All attendance records retrieved',
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  // 🔵 FIND ONE
  async findOne(id: string) {
    const record = await this.prisma.attendentional.findUnique({
      where: { id },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
    });

    if (!record || record.isDeleted)
      throw new NotFoundException(`Attendance not found by id [#${id}]`);

    return {
      message: `Attendance record #${id} retrieved successfully`,
      attendentional: this.flattenRecord(record),
    };
  }

  // 🟠 UPDATE
  async update(id: string, data: UpdateAttendentionalDto) {
    const exist = await this.prisma.attendentional.findUnique({
      where: { id },
      include: { lesson: true, student: { include: { user: true } } },
    });

    if (!exist || exist.isDeleted)
      throw new NotFoundException(`Attendance record not found by id [#${id}]`);

    if (
      (data.lessonId && data.lessonId !== exist.lessonId) ||
      (data.studentId && data.studentId !== exist.studentId)
    ) {
      const conflict = await this.prisma.attendentional.findFirst({
        where: {
          lessonId: data.lessonId ?? exist.lessonId,
          studentId: data.studentId ?? exist.studentId,
          isDeleted: false,
        },
      });
      if (conflict && conflict.id !== id)
        throw new ConflictException(`This student already has attendance for this lesson.`);
    }

    const updated = await this.prisma.attendentional.update({
      where: { id },
      data: {
        lessonId: data.lessonId ?? exist.lessonId,
        studentId: data.studentId ?? exist.studentId,
        kelgan: data.kelgan ?? exist.kelgan,
        kelganVaqti: data.kelganVaqti ? new Date(data.kelganVaqti) : exist.kelganVaqti,
        isDeleted: data.isDeleted ?? exist.isDeleted,
      },
      include: { lesson: true, student: { include: { user: true } } },
    });

    return {
      message: `Attendance record #${id} updated successfully`,
      attendentional: this.flattenRecord(updated),
    };
  }

  /** 🔸 Get all attendance records by LESSON ID */
  async getAll_ByLessonId(lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, isDeleted: false },
    });

    if (!lesson) throw new NotFoundException(`Lesson not found by id [#${lessonId}]`);

    const records = await this.prisma.attendentional.findMany({
      where: { lessonId, isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'asc' },
    });

    return {
      message: `All attendance records for lesson [#${lessonId}]`,
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  /** 🔸 Get all attendance records by GROUP ID */
  async getAll_ByGroupId(groupId: string) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId, isDeleted: false },
      include: { Lesson: true },
    });

    if (!group) throw new NotFoundException(`Group not found by id [#${groupId}]`);

    // barcha lesson ID larni olish
    const lessonIds = group.Lesson.map((l) => l.id);

    if (lessonIds.length === 0)
      return { message: 'No lessons found for this group', count: 0, attendentionals: [] };

    const records = await this.prisma.attendentional.findMany({
      where: { lessonId: { in: lessonIds }, isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'asc' },
    });

    return {
      message: `All attendance records for group [#${groupId}]`,
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  // 🔴 REMOVE (soft delete)
  async remove(id: string) {
    const exist = await this.prisma.attendentional.findUnique({
      where: { id },
      include: { lesson: true, student: { include: { user: true } } },
    });

    if (!exist || exist.isDeleted)
      throw new NotFoundException(`Attendance record not found by id [#${id}]`);

    const deleted = await this.prisma.attendentional.update({
      where: { id },
      data: { isDeleted: true },
      include: { lesson: true, student: { include: { user: true } } },
    });

    return {
      message: `Attendance record #${id} soft-deleted successfully`,
      attendentional: this.flattenRecord(deleted),
    };
  }
}
```

---

Agar hohlasangiz, men:
- `flattenRecord` uchun TypeScript interfeyslarini (`AttendentionalWithRelations`) ham qoʻshib yozib beraman (toʻliq tiplangan variant), yoki
- `create()` ga `existing` yozuvlar uchun **update** logikasini ham qoʻshib, endpointni toʻliq `create-or-update` qilishni amalga oshiraman.

Qaysi birini xohlaysiz?

---

### 👤 Foydalanuvchi:

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * FLATTEN LESSON STRUCTURE
   */
  private flattenLesson(lesson: any) {
    if (!lesson) return null;
    return {
      id: lesson.id,
      lessonNumber: lesson.lessonNumber,
      startDate: lesson.startDate,
      endDate: lesson.endDate,
      isDeleted: lesson.isDeleted,

      groupId: lesson.groupId,
      groupName: lesson.group?.name,
      roomName: lesson.group?.rom?.name,
      roomNumber: lesson.group?.rom?.romNumber,

      teacherId: lesson.teacherId,
      teacherName:
        `${lesson.teacher?.user?.firstName || ''} ${lesson.teacher?.user?.lastName || ''}`.trim(),

      studentsCount: lesson.group?.students?.length || 0,
      attendCount: lesson.Attendentionals?.length || 0,
    };
  }

  /**
   * CREATE LESSON
   */
  async create(data: CreateLessonDto) {
    const { groupId, startDate, teacherId } = data;

    // === CHECK TEACHER ===
    const existsTeacher = await this.prisma.staff.findFirst({
      where: { id: teacherId, role: 'TEACHER', isDeleted: false },
      include: { user: true },
    });
    if (!existsTeacher || existsTeacher.user.isDeleted)
      throw new BadRequestException('Teacher not found or deleted!');

    // === CHECK GROUP ===
    const oldGroup = await this.prisma.group.findFirst({
      where: { id: groupId, isDeleted: false },
      include: { course: true },
    });
    if (!oldGroup) throw new BadRequestException(`Group not found by id [${groupId}]`);
    if (oldGroup.isEnd) throw new BadRequestException(`Group [${oldGroup.name}] is ended!`);
    if (!oldGroup.isStart) throw new BadRequestException(`Group not started!`);

    // === CALCULATE END DATE ===
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + oldGroup.course.durationMinut);

    // === FIND LAST LESSON NUMBER ===
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { groupId },
      orderBy: { lessonNumber: 'desc' },
    });
    const lessonNumber = lastLesson ? lastLesson.lessonNumber + 1 : 1;

    // === CREATE NEW LESSON ===
    const newLesson = await this.prisma.lesson.create({
      data: {
        groupId,
        teacherId,
        startDate,
        endDate,
        lessonNumber,
      },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    return {
      message: 'Lesson created successfully',
      lesson: this.flattenLesson(newLesson),
    };
  }

  /**
   * FIND ALL LESSONS
   */
  async findAll() {
    const lessons = await this.prisma.lesson.findMany({
      where: { isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return {
      message: 'All active lessons',
      count: lessons.length,
      lessons: lessons.map((l) => this.flattenLesson(l)),
    };
  }

  /**
   * FIND ONE BY LESSON ID
   */
  async findOneByLessonId(id: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found or deleted!');

    return {
      message: `Lesson [${id}] details`,
      lesson: this.flattenLesson(lesson),
    };
  }

  /**
   * GET ALL LESSONS BY GROUP ID
   */
  async getAll_Lesson_byGroupId(groupId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { groupId, isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
      orderBy: { startDate: 'asc' },
    });

    return {
      message: `Lessons by group [${groupId}]`,
      count: lessons.length,
      lessons: lessons.map((l) => this.flattenLesson(l)),
    };
  }

  /**
   * GET LESSON BY START DATE
   */
  async getLesson_ByStartDate(startDate: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { startDate, isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found for given startDate');

    return {
      message: `Lesson found by startDate [${startDate}]`,
      lesson: this.flattenLesson(lesson),
    };
  }

  /**
   * UPDATE LESSON
   */
  async update(id: string, data: UpdateLessonDto) {
    if (data.groupId) {
      throw new BadRequestException('Lesson group update not allowed');
    }

    const oldLesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
    });
    if (!oldLesson) throw new NotFoundException('Lesson not found or deleted!');

    const updatedLesson = await this.prisma.lesson.update({
      where: { id },
      data,
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    return {
      message: `Lesson [${id}] updated successfully`,
      lesson: this.flattenLesson(updatedLesson),
    };
  }

  /**
   * SOFT DELETE LESSON
   */
  async remove(id: string) {
    const oldLesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
    });
    if (!oldLesson) throw new NotFoundException('Lesson not found or already deleted!');

    await this.prisma.lesson.update({
      where: { id },
      data: { isDeleted: true },
    });

    return {
      message: `Lesson [${id}] soft deleted successfully`,
    };
  }
}



generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
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

model Rom {
  id        String  @id @default(uuid())
  name      String
  romNumber Int
  pleaces   Int
  isOpen    Boolean @default(true)
  isDeleted Boolean @default(false)

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
  image         String?
  isDeleted     Boolean @default(false)

  groupes Group[]

  @@map("courses")
}

model Group {
  id        String  @id @default(uuid())
  name      String

  teacherId String
  courseId  String
  romId     String

  inActive  Boolean
  isEnd     Boolean @default(false)
  isStart   Boolean @default(false)
  startDate DateTime
  isDeleted Boolean @default(false)

  teacher      Staff          @relation(fields: [teacherId], references: [id])
  course       Course         @relation(fields: [courseId], references: [id])
  students     StudentGroup[]
  Lesson       Lesson[]
  GroupPayment GroupPayment[]
  rom          Rom            @relation(fields: [romId], references: [id])

  @@map("groupes")
}

model Staff {
  id        String  @id @default(uuid())
  userId    String
  role      RoleStafs @default(STUDENT)
  isDeleted Boolean   @default(false)

  groupes         Group[]
  studentGroup    StudentGroup[]
  Lesson          Lesson[]
  Attendentionals Attendentional[]
  GroupPayment    GroupPayment[]
  user            User             @relation(fields: [userId], references: [id])

  @@map("staffs")
}

model User {
  id        String  @id @default(uuid())
  email     String
  phone     String?
  password  String
  firstName String
  lastName  String
  isDeleted Boolean @default(false)
  createdAt DateTime @default(now())
  birthDay  DateTime
  father    String?
  image     String?

  Staff Staff[]
}

model StudentGroup {
  id        String @id @default(uuid())
  studentId String
  groupId   String
  isDeleted Boolean @default(false)

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
  isDeleted Boolean @default(false)

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
  isDeleted   Boolean   @default(false)

  lesson  Lesson @relation(fields: [lessonId], references: [id])
  student Staff  @relation(fields: [studentId], references: [id])

  @@map("attendentionals")
}

model GroupPayment {
  id           String        @id @default(uuid())
  amount       Int
  status       PaymentStatus @default(PENDING)
  paymentMonth Int
  paymentDate  DateTime
  studentId    String
  groupId      String
  isDeleted    Boolean @default(false)

  student Staff @relation(fields: [studentId], references: [id])
  group   Group @relation(fields: [groupId], references: [id])

  @@map("group_payments")
}




### 🤖 ChatGPT:

Zo‘r — sizda `Lesson` va `Attendentional` (davomat) logikasi mukammal tarzda ajratilgan 👏  

Ammo yuqorida aytganingiz **“dublicate bo‘lib qolayabdi”** muammosi `attendentionals` bilan bevosita bog‘liq — va bu muammo `fetchAttendences` funksiyasining ishlash mantiqidan kelib chiqadi.  

Keling, buni qisqa qilib to‘g‘rilaymiz 👇  

---

### 🎯 Muammo:
Siz `fetchAttendences()` funksiyasida `getAttendentionalsByLessonId()` orqali **bazadagi attendentionlarni** olasiz.  
Ammo bu dars uchun `Attendentionals` hali yaratilmagan bo‘lsa — siz **har bir student uchun yangi vaqtinchalik obyektlar** (`initialData`) yasaysiz.  

Keyin bu darsga keyinroq “create” qilganda — bazaga **yana shunday yozuvlar** kiradi.  
Agar sahifa qayta ochilsa, endi `getAttendentionalsByLessonId()` shularni qaytaradi va `setAttendances()` ularni yana qo‘shadi → `dublicate`.

---

### ✅ To‘g‘ri yechim:
Frontdan “agar mavjud bo‘lmasa — yarat” emas,  
balki **backendda avtomatik yaratish** kerak.

Ya’ni, backendga `getAll_ByLessonId()` ichida:
- darsga tegishli `Attendentionals` bo‘lmasa,  
- o‘sha darsdagi `group.students` dan foydalanib,
- avtomatik `Attendentionals.createMany()` qilib yaratamiz.

---

### 🛠 To‘g‘rilangan backend (`attendentionals.service.ts` ichida):

```ts
async getAll_ByLessonId(lessonId: string) {
  // 1. Lesson topamiz
  const lesson = await this.prisma.lesson.findFirst({
    where: { id: lessonId, isDeleted: false },
    include: {
      group: { include: { students: { include: { student: { include: { user: true } } } } } },
      Attendentionals: { include: { student: { include: { user: true } } } },
    },
  });
  if (!lesson) throw new NotFoundException('Lesson not found');

  // 2. Agar Attendentionals bo‘lmasa — avtomatik yaratamiz
  if (lesson.Attendentionals.length === 0) {
    const newAttendances = lesson.group.students.map((s) => ({
      lessonId,
      studentId: s.studentId,
      kelgan: false,
    }));

    await this.prisma.attendentional.createMany({ data: newAttendances });

    // qaytadan o‘qib olamiz
    const refreshed = await this.prisma.attendentional.findMany({
      where: { lessonId, isDeleted: false },
      include: { student: { include: { user: true } } },
    });

    return {
      message: 'Attendance auto-created for all group students',
      attendentionals: refreshed,
    };
  }

  // 3. Agar mavjud bo‘lsa — shunchaki qaytaramiz
  return {
    message: `Attendance found for lesson ${lessonId}`,
    attendentionals: lesson.Attendentionals,
  };
}
```

---

### 🧩 Natija:
Endi frontendda sizga kerak bo‘lgan `fetchAttendences` faqat:

```ts
const data =

---

### 👤 Foydalanuvchi:

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
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

model Rom {
  id        String  @id @default(uuid())
  name      String
  romNumber Int
  pleaces   Int
  isOpen    Boolean @default(true)
  isDeleted Boolean @default(false)

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
  image         String?
  isDeleted     Boolean @default(false)

  groupes Group[]

  @@map("courses")
}

model Group {
  id        String  @id @default(uuid())
  name      String

  teacherId String
  courseId  String
  romId     String

  inActive  Boolean
  isEnd     Boolean @default(false)
  isStart   Boolean @default(false)
  startDate DateTime
  isDeleted Boolean @default(false)

  teacher      Staff          @relation(fields: [teacherId], references: [id])
  course       Course         @relation(fields: [courseId], references: [id])
  students     StudentGroup[]
  Lesson       Lesson[]
  GroupPayment GroupPayment[]
  rom          Rom            @relation(fields: [romId], references: [id])

  @@map("groupes")
}

model Staff {
  id        String  @id @default(uuid())
  userId    String
  role      RoleStafs @default(STUDENT)
  isDeleted Boolean   @default(false)

  groupes         Group[]
  studentGroup    StudentGroup[]
  Lesson          Lesson[]
  Attendentionals Attendentional[]
  GroupPayment    GroupPayment[]
  user            User             @relation(fields: [userId], references: [id])

  @@map("staffs")
}

model User {
  id        String  @id @default(uuid())
  email     String
  phone     String?
  password  String
  firstName String
  lastName  String
  isDeleted Boolean @default(false)
  createdAt DateTime @default(now())
  birthDay  DateTime
  father    String?
  image     String?

  Staff Staff[]
}

model StudentGroup {
  id        String @id @default(uuid())
  studentId String
  groupId   String
  isDeleted Boolean @default(false)

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
  isDeleted Boolean @default(false)

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
  isDeleted   Boolean   @default(false)

  lesson  Lesson @relation(fields: [lessonId], references: [id])
  student Staff  @relation(fields: [studentId], references: [id])

  @@map("attendentionals")
}

model GroupPayment {
  id           String        @id @default(uuid())
  amount       Int
  status       PaymentStatus @default(PENDING)
  paymentMonth Int
  paymentDate  DateTime
  studentId    String
  groupId      String
  isDeleted    Boolean @default(false)

  student Staff @relation(fields: [studentId], references: [id])
  group   Group @relation(fields: [groupId], references: [id])

  @@map("group_payments")
}



import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * FLATTEN LESSON STRUCTURE
   */
  private flattenLesson(lesson: any) {
    if (!lesson) return null;
    return {
      id: lesson.id,
      lessonNumber: lesson.lessonNumber,
      startDate: lesson.startDate,
      endDate: lesson.endDate,
      isDeleted: lesson.isDeleted,

      groupId: lesson.groupId,
      groupName: lesson.group?.name,
      roomName: lesson.group?.rom?.name,
      roomNumber: lesson.group?.rom?.romNumber,

      teacherId: lesson.teacherId,
      teacherName:
        `${lesson.teacher?.user?.firstName || ''} ${lesson.teacher?.user?.lastName || ''}`.trim(),

      studentsCount: lesson.group?.students?.length || 0,
      attendCount: lesson.Attendentionals?.length || 0,
    };
  }

  /**
   * CREATE LESSON
   */
  async create(data: CreateLessonDto) {
    const { groupId, startDate, teacherId } = data;

    // === CHECK TEACHER ===
    const existsTeacher = await this.prisma.staff.findFirst({
      where: { id: teacherId, role: 'TEACHER', isDeleted: false },
      include: { user: true },
    });
    if (!existsTeacher || existsTeacher.user.isDeleted)
      throw new BadRequestException('Teacher not found or deleted!');

    // === CHECK GROUP ===
    const oldGroup = await this.prisma.group.findFirst({
      where: { id: groupId, isDeleted: false },
      include: { course: true },
    });
    if (!oldGroup) throw new BadRequestException(`Group not found by id [${groupId}]`);
    if (oldGroup.isEnd) throw new BadRequestException(`Group [${oldGroup.name}] is ended!`);
    if (!oldGroup.isStart) throw new BadRequestException(`Group not started!`);

    // === CALCULATE END DATE ===
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + oldGroup.course.durationMinut);

    // === FIND LAST LESSON NUMBER ===
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { groupId },
      orderBy: { lessonNumber: 'desc' },
    });
    const lessonNumber = lastLesson ? lastLesson.lessonNumber + 1 : 1;

    // === CREATE NEW LESSON ===
    const newLesson = await this.prisma.lesson.create({
      data: {
        groupId,
        teacherId,
        startDate,
        endDate,
        lessonNumber,
      },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    return {
      message: 'Lesson created successfully',
      lesson: this.flattenLesson(newLesson),
    };
  }

  /**
   * FIND ALL LESSONS
   */
  async findAll() {
    const lessons = await this.prisma.lesson.findMany({
      where: { isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return {
      message: 'All active lessons',
      count: lessons.length,
      lessons: lessons.map((l) => this.flattenLesson(l)),
    };
  }

  /**
   * FIND ONE BY LESSON ID
   */
  async findOneByLessonId(id: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found or deleted!');

    return {
      message: `Lesson [${id}] details`,
      lesson: this.flattenLesson(lesson),
    };
  }

  /**
   * GET ALL LESSONS BY GROUP ID
   */
  async getAll_Lesson_byGroupId(groupId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { groupId, isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
      orderBy: { startDate: 'asc' },
    });

    return {
      message: `Lessons by group [${groupId}]`,
      count: lessons.length,
      lessons: lessons.map((l) => this.flattenLesson(l)),
    };
  }

  /**
   * GET LESSON BY START DATE
   */
  async getLesson_ByStartDate(startDate: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { startDate, isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found for given startDate');

    return {
      message: `Lesson found by startDate [${startDate}]`,
      lesson: this.flattenLesson(lesson),
    };
  }

  /**
   * UPDATE LESSON
   */
  async update(id: string, data: UpdateLessonDto) {
    if (data.groupId) {
      throw new BadRequestException('Lesson group update not allowed');
    }

    const oldLesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
    });
    if (!oldLesson) throw new NotFoundException('Lesson not found or deleted!');

    const updatedLesson = await this.prisma.lesson.update({
      where: { id },
      data,
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    return {
      message: `Lesson [${id}] updated successfully`,
      lesson: this.flattenLesson(updatedLesson),
    };
  }

  /**
   * SOFT DELETE LESSON
   */
  async remove(id: string) {
    const oldLesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
    });
    if (!oldLesson) throw new NotFoundException('Lesson not found or already deleted!');

    await this.prisma.lesson.update({
      where: { id },
      data: { isDeleted: true },
    });

    return {
      message: `Lesson [${id}] soft deleted successfully`,
    };
  }
}

buni  create va update da  xona band emasligini tekshirish kerak.

room lessonsda barcha lessonlarni o'qib  starDate va endDate orqali shu vaqtda xona band emasligini tekshiruvchi funksiya qo'sh agar band bo'lsa BadRequest

### 🤖 ChatGPT:

Zo‘r taklif — bu haqiqiy tizimda **xona (room)** bandligini tekshirish shart ✅  
Shunda bir vaqtning o‘zida **bir nechta dars bir xonada boshlanib ketmaydi**.

Keling, sizning `LessonsService` kodingizga to‘liq mos holatda shunday tekshiruvni kiritamiz 👇

---

## 🧩 Yangilangan `LessonsService` (faqat kerakli o‘zgartirishlar bilan)

```ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  private flattenLesson(lesson: any) {
    if (!lesson) return null;
    return {
      id: lesson.id,
      lessonNumber: lesson.lessonNumber,
      startDate: lesson.startDate,
      endDate: lesson.endDate,
      isDeleted: lesson.isDeleted,

      groupId: lesson.groupId,
      groupName: lesson.group?.name,
      roomName: lesson.group?.rom?.name,
      roomNumber: lesson.group?.rom?.romNumber,

      teacherId: lesson.teacherId,
      teacherName:
        `${lesson.teacher?.user?.firstName || ''} ${lesson.teacher?.user?.lastName || ''}`.trim(),

      studentsCount: lesson.group?.students?.length || 0,
      attendCount: lesson.Attendentionals?.length || 0,
    };
  }

  /**
   * ✅ ROOM BANDLIGINI TEKSHIRISH
   */
  private async checkRoomAvailability(roomId: string, startDate: Date, endDate: Date, excludeLessonId?: string) {
    const overlappingLesson = await this.prisma.lesson.findFirst({
      where: {
        isDeleted: false,
        id: excludeLessonId ? { not: excludeLessonId } : undefined,
        group: {
          romId: roomId,
          isDeleted: false,
        },
        // vaqt oraliqlarini to‘qnashishini tekshirish
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
      include: { group: true },
    });

    if (overlappingLesson) {
      throw new BadRequestException(
        `Xona [${overlappingLesson.group.romId}] bu vaqtda band! (${overlappingLesson.startDate.toISOString()} - ${overlappingLesson.endDate.toISOString()})`,
      );
    }
  }

  /**
   * CREATE LESSON
   */
  async create(data: CreateLessonDto) {
    const { groupId, startDate, teacherId } = data;

    const existsTeacher = await this.prisma.staff.findFirst({
      where: { id: teacherId, role: 'TEACHER', isDeleted: false },
      include: { user: true },
    });
    if (!existsTeacher || existsTeacher.user.isDeleted)
      throw new BadRequestException('Teacher not found or deleted!');

    const oldGroup = await this.prisma.group.findFirst({
      where: { id: groupId, isDeleted: false },
      include: { course: true, rom: true },
    });
    if (!oldGroup) throw new BadRequestException(`Group not found by id [${groupId}]`);
    if (oldGroup.isEnd) throw new BadRequestException(`Group [${oldGroup.name}] is ended!`);
    if (!oldGroup.isStart) throw new BadRequestException(`Group not started!`);

    // === END DATE ===
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + oldGroup.course.durationMinut);

    // ✅ XONA BANDLIGINI TEKSHIRISH
    await this.checkRoomAvailability(oldGroup.romId, startDate, endDate);

    // === LAST LESSON ===
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { groupId },
      orderBy: { lessonNumber: 'desc' },
    });
    const lessonNumber = lastLesson ? lastLesson.lessonNumber + 1 : 1;

    const newLesson = await this.prisma.lesson.create({
      data: {
        groupId,
        teacherId,
        startDate,
        endDate,
        lessonNumber,
      },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    return {
      message: 'Lesson created successfully',
      lesson: this.flattenLesson(newLesson),
    };
  }

  /**
   * UPDATE LESSON
   */
  async update(id: string, data: UpdateLessonDto) {
    const oldLesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
      include: { group: { include: { rom: true, course: true } } },
    });
    if (!oldLesson) throw new NotFoundException('Lesson not found or deleted!');

    // vaqt o‘zgartirilgan bo‘lsa, bandlikni tekshiramiz
    const startDate = data.startDate ? new Date(data.startDate) : oldLesson.startDate;
    const endDate = data.endDate
      ? new Date(data.endDate)
      : new Date(new Date(startDate).getTime() + oldLesson.group.course.durationMinut * 60000);

    await this.checkRoomAvailability(oldLesson.group.romId, startDate, endDate, id);

    const updatedLesson = await this.prisma.lesson.update({
      where: { id },
      data: { ...data, startDate, endDate },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    return {
      message: `Lesson [${id}] updated successfully`,
      lesson: this.flattenLesson(updatedLesson),
    };
  }
}
```

---

### ⚙️ Qanday ishlaydi:

1. `checkRoomAvailability()` funksiyasi berilgan **roomId, startDate, endDate** oralig‘ida boshqa dars borligini `lesson` jadvalidan qidiradi.
2. Agar topilsa, `BadRequestException` chiqaradi:
   ```
   Xona [roomId] bu vaqtda band! (2025-10-24T08:00Z - 2025-10-24T09:30Z)
   ```
3. `create()` va `update()` metodlarida bu funksiya avtomatik chaqiriladi.

---

### ✅ Natija:
- Endi **bir vaqtning o‘zida bir xonada 2 ta dars bo‘lishi mumkin emas.**
- `update()` da ham vaqt o‘zgarsa, bandlik tekshiriladi.
- `BadRequestException` orqali foydalanuvchiga aniq sabab ko‘rsatiladi.

---

Xohlaysizmi — shu logikani yana **teacher** bo‘yicha ham (ya’ni o‘sha vaqtda bitta teacher 2 darsda bo‘lmasin) qilib qo‘shay?

---

### 👤 Foydalanuvchi:

"use client"

import React, { useEffect, useState } from 'react'
import { Group, Lesson } from '@/types'
import { Lessons, Staffs } from '@/features'
import { useAllFetchedData } from '@/lib/ui.state'
import { Button } from '@mui/material'

interface CreateLessonProps {
  group: Group
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>
}

function CreateLesson({ props }: { props: CreateLessonProps }) {
  const { group, setModal, setLessons } = props

  const [teachers, setTeachers] = useState<any[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const [date, setDate] = useState("") // YYYY-MM-DD
  const [hour, setHour] = useState<string>("08")
  const [minute, setMinute] = useState<string>("00")
  const [showTimeSelect, setShowTimeSelect] = useState(false)
  const [startDate, setStartDate] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const { teachers: AllTeachers } = useAllFetchedData()

  // === FETCH ALL TEACHERS ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (AllTeachers && AllTeachers.length > 0) {
          setTeachers(AllTeachers)
          return
        }
        setLoading(true)
        const teachersData = await Staffs.getAllTeachers()
        setTeachers(teachersData)
      } catch (err) {
        console.error("Error fetching teachers:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // === TIME CONFIRM ===
  const handleTimeConfirm = () => {
    if (!date || !hour || !minute) {
      alert("Iltimos, sana va vaqtni to‘liq tanlang!")
      return
    }
    const combined = new Date(`${date}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`)
    setStartDate(combined.toISOString())
    setShowTimeSelect(false)
  }

  // === SUBMIT ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!selectedTeacher || !startDate) {
        alert("Iltimos, o‘qituvchi va vaqtni tanlang!")
        return
      }

      setLoading(true)
      const payload = {
        groupId: group.id,
        startDate,
        teacherId: selectedTeacher,
      }

      const res = await Lessons.createLesson(payload)
      alert("✅ Dars muvaffaqiyatli yaratildi!")
      setLessons(prev => [...prev, res as Lesson])
      setSelectedTeacher("")
      setStartDate("")
      setModal(false)
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data?.message || "Xatolik yuz berdi!")
    } finally {
      setLoading(false)
    }
  }

  // === Soatlar va minutlar massivlari ===
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = [0, 15, 30, 45]

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 mt-10"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">🧑‍🏫 Yangi Dars Yaratish</h2>
        <Button onClick={() => setModal(false)} color="error">x</Button>
      </div>

      {/* Teacher select */}
      <div>
        <label className="block text-sm font-medium mb-1">O‘qituvchi</label>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="border rounded-lg w-full p-2"
        >
          <option value="">Tanlang</option>
          {teachers.map((teacher: any) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.user.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Date input */}
      <div>
        <label className="block text-sm font-medium mb-1">Sana</label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            setShowTimeSelect(true)
          }}
          className="border rounded-lg w-full p-2"
        />
      </div>

      {/* Time select (faqat sana tanlangandan keyin chiqadi) */}
      {showTimeSelect && (
        <div className="bg-gray-50 border p-3 rounded-lg">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Soat</label>
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="border rounded-lg w-full p-2"
              >
                <option value="">Soat</option>
                {hours.map(h => (
                  <option key={h} value={h}>{h.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Minut</label>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="border rounded-lg w-full p-2"
              >
                <option value="">Minut</option>
                {minutes.map(m => (
                  <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleTimeConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-lg transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {startDate && (
        <div className="text-sm text-gray-600">
          <p>🕒 Tanlangan vaqt: <span className="font-semibold">{new Date(startDate).toLocaleString()}</span></p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition ${loading ? "opacity-60" : ""}`}
      >
        {loading ? "Yaratilmoqda..." : "Darsni yaratish"}
      </button>
    </form>
  )
}

export default CreateLesson



endi bunda backenddan Qaytgan errorga qarab ogohlantirish  chiqar spanda form ichida bo'lsin

### 🤖 ChatGPT:

Zo‘r 👍  
Frontendni formga ogohlantirish (`error message`) bilan yaxshilaymiz — alert o‘rniga `<span>` ichida, formning o‘zida chiroyli ko‘rinishda chiqadi. Quyida yangilangan **CreateLesson** komponent — backenddan qaytgan `error` ni ushlab, form pastida ko‘rsatadi:

---

```tsx
"use client"

import React, { useEffect, useState } from 'react'
import { Group, Lesson } from '@/types'
import { Lessons, Staffs } from '@/features'
import { useAllFetchedData } from '@/lib/ui.state'
import { Button } from '@mui/material'

interface CreateLessonProps {
  group: Group
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>
}

function CreateLesson({ props }: { props: CreateLessonProps }) {
  const { group, setModal, setLessons } = props

  const [teachers, setTeachers] = useState<any[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const [date, setDate] = useState("") // YYYY-MM-DD
  const [hour, setHour] = useState<string>("08")
  const [minute, setMinute] = useState<string>("00")
  const [showTimeSelect, setShowTimeSelect] = useState(false)
  const [startDate, setStartDate] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("") // 🔴 yangi holat

  const { teachers: AllTeachers } = useAllFetchedData()

  // === FETCH ALL TEACHERS ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (AllTeachers && AllTeachers.length > 0) {
          setTeachers(AllTeachers)
          return
        }
        setLoading(true)
        const teachersData = await Staffs.getAllTeachers()
        setTeachers(teachersData)
      } catch (err) {
        console.error("Error fetching teachers:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // === TIME CONFIRM ===
  const handleTimeConfirm = () => {
    if (!date || !hour || !minute) {
      setError("Iltimos, sana va vaqtni to‘liq tanlang!")
      return
    }
    const combined = new Date(`${date}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`)
    setStartDate(combined.toISOString())
    setShowTimeSelect(false)
    setError("") // vaqt tanlansa, errorni tozalaymiz
  }

  // === SUBMIT ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") // har safar form yuborilishidan oldin tozalaymiz

    try {
      if (!selectedTeacher || !startDate) {
        setError("Iltimos, o‘qituvchi va vaqtni tanlang!")
        return
      }

      setLoading(true)
      const payload = {
        groupId: group.id,
        startDate,
        teacherId: selectedTeacher,
      }

      const res = await Lessons.createLesson(payload)
      setLessons(prev => [...prev, res as Lesson])
      setSelectedTeacher("")
      setStartDate("")
      setModal(false)
    } catch (err: any) {
      console.error(err)
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Xatolik yuz berdi! Iltimos, qayta urinib ko‘ring."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // === Soatlar va minutlar massivlari ===
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = [0, 15, 30, 45]

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 mt-10"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">🧑‍🏫 Yangi Dars Yaratish</h2>
        <Button onClick={() => setModal(false)} color="error">x</Button>
      </div>

      {/* Teacher select */}
      <div>
        <label className="block text-sm font-medium mb-1">O‘qituvchi</label>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="border rounded-lg w-full p-2"
        >
          <option value="">Tanlang</option>
          {teachers.map((teacher: any) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.user.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Date input */}
      <div>
        <label className="block text-sm font-medium mb-1">Sana</label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            setShowTimeSelect(true)
          }}
          className="border rounded-lg w-full p-2"
        />
      </div>

      {/* Time select */}
      {showTimeSelect && (
        <div className="bg-gray-50 border p-3 rounded-lg">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Soat</label>
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="border rounded-lg w-full p-2"
              >
                <option value="">Soat</option>
                {hours.map(h => (
                  <option key={h} value={h}>{h.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Minut</label>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="border rounded-lg w-full p-2"
              >
                <option value="">Minut</option>
                {minutes.map(m => (
                  <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleTimeConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-lg transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {startDate && (
        <div className="text-sm text-gray-600">
          <p>🕒 Tanlangan vaqt: <span className="font-semibold">{new Date(startDate).toLocaleString()}</span></p>
        </div>
      )}

      {/* 🔴 Error message chiqish joyi */}
      {error && (
        <span className="text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded-lg">
          ⚠️ {error}
        </span>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition ${loading ? "opacity-60" : ""}`}
      >
        {loading ? "Yaratilmoqda..." : "Darsni yaratish"}
      </button>
    </form>
  )
}

export default CreateLesson
```

---

### 🔍 Nima o‘zgardi:
- `const [error, setError] = useState("")` qo‘shildi.  
- Backenddan kelgan `message` endi `<span>` orqali form ichida chiqadi.  
- Alertlar olib tashlandi.  
- Error stili: qizil fonli, radiusli, responsiv (`text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg`).  
- Har bir muvaffaqiyatli amalda `setError("")` bilan tozalanadi.

---

Xohlasangiz, error joyini **form tepasida yoki pastida** joylashtirishni tanlab beraman (masalan: submit tugmasi ostida yoki ustida).  
Qayerda bo‘lishini xohlaysiz — yuqoridami yoki pastdami?

---

### 👤 Foydalanuvchi:

{
    "rooms": [
        {
            "id": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
            "name": "Salo",
            "romNumber": 1,
            "pleaces": 18,
            "isOpen": true,
            "isDeleted": false
        }
    ],
    "courses": [
        {
            "id": "5a39512b-46cf-45fb-a9b8-1d46c22db4d9",
            "name": "CRM",
            "price": 150000,
            "published": true,
            "durationMont": 4,
            "weekDays": [
                1,
                3,
                5,
                2,
                4
            ],
            "durationMinut": 90,
            "image": "api/image/1761071317662-677890054.png",
            "isDeleted": false
        },
        {
            "id": "a82c8f32-a360-43ef-907d-818304618cd9",
            "name": "Jobhj",
            "price": 152213551,
            "published": false,
            "durationMont": 2,
            "weekDays": [
                1,
                3,
                5
            ],
            "durationMinut": 120,
            "image": "api/image/1761161790039-371652662.jpg",
            "isDeleted": false
        },
        {
            "id": "d4ced44b-d2b8-4380-a9e4-35e5ca8024f3",
            "name": "Salo",
            "price": 2516315,
            "published": true,
            "durationMont": 3,
            "weekDays": [
                1,
                3,
                5
            ],
            "durationMinut": 120,
            "image": "api/image/1761215159979-958091122.jpg",
            "isDeleted": false
        }
    ],
    "groupes": [
        {
            "id": "d8d9c908-d4f5-4131-8348-84b28de821a9",
            "name": "Fayzillo Ummatov",
            "startDate": "2025-10-24T18:51:00.000Z",
            "isStart": true,
            "isEnd": false,
            "inActive": true,
            "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
            "teacherFirstName": "Fayzillo",
            "teacherLastName": "Ummatov",
            "teacherPhone": "916102141",
            "courseId": "5a39512b-46cf-45fb-a9b8-1d46c22db4d9",
            "courseName": "CRM",
            "coursePrice": 150000,
            "romId": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
            "romName": "Salo",
            "romNumber": 1,
            "studentCount": 2,
            "lessonCount": 3,
            "paymentCount": 0
        },
        {
            "id": "9e4d6714-5f48-481b-aff4-2cb4f38a5a9b",
            "name": "e-comerse",
            "startDate": "2025-10-23T18:54:00.000Z",
            "isStart": true,
            "isEnd": false,
            "inActive": true,
            "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
            "teacherFirstName": "Fayzillo",
            "teacherLastName": "Ummatov",
            "teacherPhone": "916102141",
            "courseId": "5a39512b-46cf-45fb-a9b8-1d46c22db4d9",
            "courseName": "CRM",
            "coursePrice": 150000,
            "romId": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
            "romName": "Salo",
            "romNumber": 1,
            "studentCount": 2,
            "lessonCount": 2,
            "paymentCount": 0
        },
        {
            "id": "dccf53de-fc1b-40bd-8b4b-50ba61aefe5a",
            "name": "FN3",
            "startDate": "2025-10-22T05:30:00.000Z",
            "isStart": true,
            "isEnd": false,
            "inActive": true,
            "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
            "teacherFirstName": "Fayzillo",
            "teacherLastName": "Ummatov",
            "teacherPhone": "916102141",
            "courseId": "5a39512b-46cf-45fb-a9b8-1d46c22db4d9",
            "courseName": "CRM",
            "coursePrice": 150000,
            "romId": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
            "romName": "Salo",
            "romNumber": 1,
            "studentCount": 2,
            "lessonCount": 1,
            "paymentCount": 0
        }
    ],
    "users": [
        {
            "id": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
            "fullName": "Fayzillo Ummatov",
            "father": "XsaSxXcdsc dscdscda",
            "email": "ummatovfayzilllo@gmail.com",
            "phone": "916102141",
            "image": null,
            "birthDay": "1995-12-29T00:00:00.000Z",
            "isDeleted": false,
            "createdAt": "2025-10-21T18:27:23.827Z",
            "roles": [
                {
                    "id": "86a20fcf-9d66-416b-936a-f9722c411930",
                    "role": "TEACHER",
                    "isDeleted": false
                },
                {
                    "id": "fac3011a-d080-4218-a937-7315f40f1001",
                    "role": "TEACHER",
                    "isDeleted": false
                },
                {
                    "id": "78519ebe-5a96-4bbf-b11d-50207e46e630",
                    "role": "STUDENT",
                    "isDeleted": false
                }
            ]
        },
        {
            "id": "d930d04f-5ebc-4fa3-b9d8-fde94b298a70",
            "fullName": "Abdulloh Ummatov",
            "father": "",
            "email": "cdscdswcdscsdc@gmail.com",
            "phone": "916102142",
            "image": null,
            "birthDay": "2025-10-06T00:00:00.000Z",
            "isDeleted": false,
            "createdAt": "2025-10-21T18:33:23.514Z",
            "roles": [
                {
                    "id": "3c0f817b-de41-4087-8c9c-c66bea445f69",
                    "role": "STUDENT",
                    "isDeleted": false
                }
            ]
        },
        {
            "id": "ec70ed36-f31c-44e7-811f-0016c8132c2c",
            "fullName": "Alisa Nataliy",
            "father": "",
            "email": "ummatovfayzilllo2@gmail.com",
            "phone": "916102143",
            "image": null,
            "birthDay": "2025-10-24T00:00:00.000Z",
            "isDeleted": false,
            "createdAt": "2025-10-23T10:44:53.333Z",
            "roles": [
                {
                    "id": "7c3aee01-e4c3-4421-9a63-9b395009dabe",
                    "role": "TEACHER",
                    "isDeleted": false
                }
            ]
        }
    ],
    "students": [
        {
            "id": "3c0f817b-de41-4087-8c9c-c66bea445f69",
            "role": "STUDENT",
            "user": {
                "id": "d930d04f-5ebc-4fa3-b9d8-fde94b298a70",
                "fullName": "Abdulloh Ummatov",
                "email": "cdscdswcdscsdc@gmail.com",
                "phone": "916102142",
                "image": null,
                "birthDay": "2025-10-06T00:00:00.000Z",
                "isDeleted": false
            },
            "isDeleted": false
        },
        {
            "id": "78519ebe-5a96-4bbf-b11d-50207e46e630",
            "role": "STUDENT",
            "user": {
                "id": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                "fullName": "Fayzillo Ummatov",
                "email": "ummatovfayzilllo@gmail.com",
                "phone": "916102141",
                "image": null,
                "birthDay": "1995-12-29T00:00:00.000Z",
                "isDeleted": false
            },
            "isDeleted": false
        }
    ],
    "teachers": [
        {
            "id": "86a20fcf-9d66-416b-936a-f9722c411930",
            "role": "TEACHER",
            "user": {
                "id": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                "fullName": "Fayzillo Ummatov",
                "email": "ummatovfayzilllo@gmail.com",
                "phone": "916102141",
                "image": null,
                "birthDay": "1995-12-29T00:00:00.000Z",
                "isDeleted": false
            },
            "isDeleted": false
        },
        {
            "id": "7c3aee01-e4c3-4421-9a63-9b395009dabe",
            "role": "TEACHER",
            "user": {
                "id": "ec70ed36-f31c-44e7-811f-0016c8132c2c",
                "fullName": "Alisa Nataliy",
                "email": "ummatovfayzilllo2@gmail.com",
                "phone": "916102143",
                "image": null,
                "birthDay": "2025-10-24T00:00:00.000Z",
                "isDeleted": false
            },
            "isDeleted": false
        },
        {
            "id": "fac3011a-d080-4218-a937-7315f40f1001",
            "role": "TEACHER",
            "user": {
                "id": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                "fullName": "Fayzillo Ummatov",
                "email": "ummatovfayzilllo@gmail.com",
                "phone": "916102141",
                "image": null,
                "birthDay": "1995-12-29T00:00:00.000Z",
                "isDeleted": false
            },
            "isDeleted": false
        }
    ],
    "lessons": [
        {
            "id": "ab315d3b-8f7c-48ba-b2c9-2b9f9a9295ee",
            "lessonNumber": 2,
            "startDate": "2025-10-24T03:00:00.000Z",
            "endDate": "2025-10-24T04:30:00.000Z",
            "isDeleted": false,
            "groupId": "d8d9c908-d4f5-4131-8348-84b28de821a9",
            "groupName": "Fayzillo Ummatov",
            "roomName": "Salo",
            "roomNumber": 1,
            "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
            "teacherName": "Fayzillo Ummatov",
            "studentsCount": 2,
            "attendCount": 0
        },
        {
            "id": "42cd5782-fc5a-40e4-9e89-39b512daea83",
            "lessonNumber": 1,
            "startDate": "2025-10-23T09:00:00.000Z",
            "endDate": "2025-10-23T10:30:00.000Z",
            "isDeleted": false,
            "groupId": "9e4d6714-5f48-481b-aff4-2cb4f38a5a9b",
            "groupName": "e-comerse",
            "roomName": "Salo",
            "roomNumber": 1,
            "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
            "teacherName": "Fayzillo Ummatov",
            "studentsCount": 2,
            "attendCount": 4
        },
        {
            "id": "be07bc87-5840-4a6e-aea7-92b007bd4ba7",
            "lessonNumber": 2,
            "startDate": "2025-10-23T09:00:00.000Z",
            "endDate": "2025-10-23T10:30:00.000Z",
            "isDeleted": false,
            "groupId": "9e4d6714-5f48-481b-aff4-2cb4f38a5a9b",
            "groupName": "e-comerse",
            "roomName": "Salo",
            "roomNumber": 1,
            "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
            "teacherName": "Fayzillo Ummatov",
            "studentsCount": 2,
            "attendCount": 2
        },
        {
            "id": "c9ba50c0-85fb-443e-85f8-47d2473e59e0",
            "lessonNumber": 1,
            "startDate": "2025-10-23T03:00:00.000Z",
            "endDate": "2025-10-23T04:30:00.000Z",
            "isDeleted": false,
            "groupId": "d8d9c908-d4f5-4131-8348-84b28de821a9",
            "groupName": "Fayzillo Ummatov",
            "roomName": "Salo",
            "roomNumber": 1,
            "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
            "teacherName": "Fayzillo Ummatov",
            "studentsCount": 2,
            "attendCount": 0
        },
        {
            "id": "bbee5c39-7709-4d7a-9b07-11b826feb89f",
            "lessonNumber": 3,
            "startDate": "2025-10-23T03:00:00.000Z",
            "endDate": "2025-10-23T04:30:00.000Z",
            "isDeleted": false,
            "groupId": "d8d9c908-d4f5-4131-8348-84b28de821a9",
            "groupName": "Fayzillo Ummatov",
            "roomName": "Salo",
            "roomNumber": 1,
            "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
            "teacherName": "Fayzillo Ummatov",
            "studentsCount": 2,
            "attendCount": 0
        },
        {
            "id": "0f734490-4adc-4d74-8534-ac53e5ecdebd",
            "lessonNumber": 1,
            "startDate": "2025-10-21T19:35:00.000Z",
            "endDate": "2025-10-21T21:05:00.000Z",
            "isDeleted": false,
            "groupId": "dccf53de-fc1b-40bd-8b4b-50ba61aefe5a",
            "groupName": "FN3",
            "roomName": "Salo",
            "roomNumber": 1,
            "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
            "teacherName": "Fayzillo Ummatov",
            "studentsCount": 2,
            "attendCount": 1
        }
    ]
}


bu allData



Menga diagramma qilib ber




"use client"
import Area from "@/dashboard/area/Area";
import Header from "@/dashboard/headerPanel/Header";
import Left from "@/dashboard/leftPanel/Left";
import { Attendentionals, Courses, Groupes, Lessons, Rooms, Staffs, Users } from "@/features";
import { useAllFetchedData } from "@/lib/ui.state";
import { useEffect } from "react";

export default function Home() {

  const { fetchAll, error, loading, ...allData } = useAllFetchedData()

  const getTests = async () => {
    try {
      await fetchAll()

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (error || loading) {
      console.log(error)
    } else {
      console.log(allData)
    }
  }, [allData])

  useEffect(() => {
    getTests();
  }, []); 

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      
    </div>
  );
}

### 🤖 ChatGPT:

Zo‘r — demak, sendagi `allData` bu **barcha asosiy obyektlar to‘plami (rooms, courses, groupes, lessons, teachers, students)**.  
Shundan foydalangan holda biz `dashboard` uchun **vizual statistik diagrammalar** (chartlar) chizishimiz mumkin.  

Quyida men **`Recharts`** kutubxonasidan foydalanib, `Lessons`, `Groups`, `Courses` va `Students` sonlarini diagramma qilib chiqaradigan to‘liq misolni beraman 👇

---

### 🧠 Maqsad:
- Har bir kursda nechta **gruppa** borligini `BarChart`da ko‘rsatish  
- Har bir gruppada nechta **dars (lesson)** borligini `AreaChart`da ko‘rsatish  
- Har bir o‘qituvchining nechta **gruppasi** borligini `PieChart`da ko‘rsatish  

---

### 🧩 Kod:
```tsx
"use client"
import { useEffect } from "react"
import { useAllFetchedData } from "@/lib/ui.state"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts"
import Header from "@/dashboard/headerPanel/Header"
import Left from "@/dashboard/leftPanel/Left"

export default function Home() {
  const { fetchAll, error, loading, ...allData } = useAllFetchedData()

  useEffect(() => {
    fetchAll()
  }, [])

  if (loading) return <p className="p-10">⏳ Ma’lumotlar yuklanmoqda...</p>
  if (error) return <p className="p-10 text-red-500">Xatolik: {String(error)}</p>
  if (!allData.groupes || !allData.courses || !allData.lessons) return <p className="p-10">Ma’lumotlar topilmadi.</p>

  const { groupes, courses, lessons, teachers, students } = allData

  // === 1️⃣ Kurs bo‘yicha gruppalar soni ===
  const courseGroupData = courses.map(c => ({
    name: c.name,
    groups: groupes.filter(g => g.courseId === c.id).length,
  }))

  // === 2️⃣ Gruppalar bo‘yicha darslar soni ===
  const groupLessonData = groupes.map(g => ({
    name: g.name,
    lessons: lessons.filter(l => l.groupId === g.id).length,
  }))

  // === 3️⃣ O‘qituvchilar bo‘yicha gruppalar soni ===
  const teacherGroupData = teachers.map(t => ({
    name: t.user.fullName,
    groups: groupes.filter(g => g.teacherId === t.id).length,
  }))

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"]

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-auto">
      <Header />
      <div className="flex flex-1">
        <Left />
        <div className="flex-1 p-6 space-y-10">
          <h1 className="text-2xl font-bold mb-4">📊 Dashboard Diagrammalar</h1>

          {/* 1️⃣ Kurs bo‘yicha gruppalar soni */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-lg font-semibold mb-3">Kurslar bo‘yicha gruppalar soni</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="groups" fill="#8884d8" name="Gruppalar soni" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 2️⃣ Gruppalar bo‘yicha darslar soni */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-lg font-semibold mb-3">Gruppalar bo‘yicha darslar soni</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={groupLessonData}>
                <defs>
                  <linearGradient id="colorLesson" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="lessons" stroke="#82ca9d" fillOpacity={1} fill="url(#colorLesson)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 3️⃣ O‘qituvchilar bo‘yicha gruppalar soni */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-lg font-semibold mb-3">O‘qituvchilar bo‘yicha gruppalar soni</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={teacherGroupData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="groups"
                  nameKey="name"
                  label
                >
                  {teacherGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 🔍 Natijada:
- Har bir **kurs** uchun nechta **gruppa** borligi `BarChart`da ko‘rinadi.  
- Har bir **gruppa**da nechta **dars** o‘tilgani `AreaChart` orqali chiqadi.  
- Har bir **o‘qituvchi**da nechta **gruppa** borligi `PieChart`da aks etadi.  

---

Agar xohlasang, men bunga **studentlar ishtiroki bo‘yicha (attendance count)** yoki **haftalik darslar soni**ni ham qo‘shib chiqaman.  
Qo‘shaymi?

---

### 👤 Foydalanuvchi:

bundan navigationni olib tashlashing mumkin yana diagrammalarning uzunligini  w-fullda qoldir

Chunki menda layout bunday

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Header from "@/dashboard/headerPanel/Header";
import Left from "@/dashboard/leftPanel/Left";
import Area from "@/dashboard/area/Area";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="h-screen w-screen flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex-none">
              <Header />
            </div>

            {/* Asosiy qism */}
            <div className="flex flex-1 overflow-hidden">
              {/* Chap panel */}
              <div className="!w-[17%] border-r overflow-y-auto px-2 bg-violet-400 pt-4">
                <Left />
              </div>

              {/* O'ng qism */}
              <div className="flex-1 overflow-y-auto !w-[73%] px-4">
                  {children}
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}


Leftda navigation bor

### 🤖 ChatGPT:

Ajoyib ✅ — demak sening layoutingda **navigatsiya (Left panel)** allaqachon mavjud, shuning uchun `Home` sahifangdagi diagrammalar **to‘liq kenglikda (`w-full`)** joylashishi kerak, va `Header` yoki `Left`ni bu sahifaga qayta chaqirishga hojat yo‘q.  

Quyida senga **to‘liq yangilangan `Home` component** kodini berdim — bunda:

- `navigation` (Left yoki Header) **yo‘q**, chunki ular layoutda bor.  
- Diagrammalar **`w-full` va `h-[300px]`** qilib berilgan.  
- Har biri `Card` ichida, chiroyli joylashgan.  
- 3 ta diagramma mavjud:
  1. **Har bir kursdagi guruhlar soni**
  2. **Har bir guruhdagi darslar soni**
  3. **Har bir darsdagi davomat soni**

---

### ✅ `src/app/page.tsx` (yoki `Home.tsx`) uchun to‘liq kod:

```tsx
"use client"

import React, { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAllFetchedData } from "@/lib/ui.state"
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function Home() {
  const { fetchAll, loading, error, ...allData } = useAllFetchedData()

  useEffect(() => {
    fetchAll()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg font-medium">Yuklanmoqda...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500 font-medium">
          Ma'lumotlarni yuklashda xatolik yuz berdi!
        </p>
      </div>
    )
  }

  const { courses = [], groupes = [], lessons = [] } = allData

  // 1️⃣ Har bir kursdagi guruhlar soni
  const courseStats = courses.map((course: any) => ({
    name: course.name,
    value: groupes.filter((g: any) => g.courseId === course.id).length,
  }))

  // 2️⃣ Har bir guruhdagi darslar soni
  const groupStats = groupes.map((g: any) => ({
    name: g.name,
    value: lessons.filter((l: any) => l.groupId === g.id).length,
  }))

  // 3️⃣ Har bir darsdagi davomat soni
  const lessonStats = lessons.map((l: any) => ({
    name: `${l.groupName} #${l.lessonNumber}`,
    value: l.attendCount || 0,
  }))

  return (
    <div className="flex flex-col gap-8 py-6 w-full">
      {/* 1️⃣ Kurslar bo‘yicha guruhlar soni */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">📚 Kurslar bo‘yicha guruhlar soni</CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2️⃣ Guruhlar bo‘yicha darslar soni */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">🏫 Guruhlar bo‘yicha darslar soni</CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={groupStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3️⃣ Darslar bo‘yicha davomat statistikasi */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">🧾 Darslar bo‘yicha davomat statistikasi</CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lessonStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### ✨ Natija:
Bu kod bilan:
- Har bir diagramma to‘liq kenglikda (`w-full`)
- Navigatsiya va header layout orqali boshqariladi (shu sababli bu sahifada yo‘q)
- `useAllFetchedData()` orqali kelgan `allData` bilan real statistikani ko‘rsatadi  
- Minimal, ammo chiroyli MUI-style kartalar (shadcn `Card`) ishlatilgan  

---

Agar xohlasang, shu grafiklarni **`Grid layout`** qilib 2x2 joylashtirish variantini ham beraman — biroz ixchamroq dashboard bo‘ladi.  
Shuni xohlaysanmi?

---

### 👤 Foydalanuvchi:

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"




bu componentalarni yozib ber

### 🤖 ChatGPT:

Albatta ✅  
quyida `Card`, `CardHeader`, `CardTitle`, `CardContent` componentlarini **shadcn/ui** uslubida soddalashtirilgan, lekin professional tarzda yozilgan variantini keltiraman.  
Bu komponentlar `@/components/ui/card.tsx` faylida bo‘ladi 👇  

---

### 📁 **`@/components/ui/card.tsx`**
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border bg-white shadow-md transition hover:shadow-lg",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b px-4 py-3 flex items-center justify-between", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold text-gray-800", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
```

---

### 📘 **Qo‘shimcha (utils.ts)**
Agar `cn` funksiyasi hali mavjud bo‘lmasa, uni quyidagicha yaratasiz:

📁 `@/lib/utils.ts`
```ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
```

---

### 💡 Foydalanish:
```tsx
<Card className="w-full">
  <CardHeader>
    <CardTitle>O‘quvchilar Davomati</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Bu yerda jadval yoki diagrammalar joylashadi.</p>
  </CardContent>
</Card>
```

---

Xohlaysizmi bu `Card` komponentlarga `motion` (Framer Motion) orqali yumshoq chiqish animatsiyasi qo‘shib beray?

---

### 👤 Foydalanuvchi:

import { cn } from "@/lib/utils"


buni ham yozib ber

### 🤖 ChatGPT:

Albatta ✅  
`cn` (class name) funksiyasi — **Tailwind CSS** bilan ishlaganda classlarni toza, dinamik va boshqariladigan holatda birlashtirish uchun ishlatiladi.  
Quyida to‘liq, professional `utils.ts` faylini keltiraman 👇

---

### 📁 **`@/lib/utils.ts`**
```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS classlarini xavfsiz birlashtirish uchun yordamchi funksiya.
 * 
 * @example
 * cn("p-4", isActive && "bg-blue-500", "text-white")
 * // => "p-4 bg-blue-500 text-white"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

### 📦 Izoh:
- **`clsx`** — shartli classlarni (`isActive && "bg-blue-500"`) birlashtiradi.  
- **`tailwind-merge`** — `p-2` va `p-4` kabi ziddiyatli classlarni `p-4` bilan almashtirib, yakuniy natijani beradi.  
- Shu kombinatsiya shadcn/ui va Next.js loyihalarida **standart best-practice** hisoblanadi.

---

Agar xohlasangiz, men sizga shu `utils.ts` ichiga yana `formatDate`, `truncateText` yoki `capitalize` kabi foydali yordamchi funksiyalarni ham qo‘shib beraman — kerakmi?

---

### 👤 Foydalanuvchi:

import { twMerge } from "tailwind-merge"

bu ham yo'q ekan

### 🤖 ChatGPT:

Ha, to‘g‘ri ✅  
`tailwind-merge` bu tashqi kutubxona — u **Tailwind classlarni to‘g‘ri birlashtirish** uchun kerak (masalan, `"p-2 p-4"` → `"p-4"`).

---

### 🧩 1. O‘rnatish
Terminalda quyidagini yozing:
```bash
npm install tailwind-merge clsx
```
yoki agar `yarn` ishlatsangiz:
```bash
yarn add tailwind-merge clsx
```

---

### 📁 2. To‘liq `utils.ts` fayl
`@/lib/utils.ts` faylingiz quyidagicha bo‘lsin:

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS classlarini xavfsiz birlashtirish uchun yordamchi funksiya.
 * 
 * @example
 * cn("p-4", isActive && "bg-blue-500", "text-white")
 * // => "p-4 bg-blue-500 text-white"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

Shundan keyin siz bemalol ishlata olasiz:
```tsx
<div className={cn("p-4", isActive && "bg-green-500", "text-white")} />
```

Bu sizga **toza, konfliktlarsiz classlarni** beradi 🧠

Xohlaysizmi, shu `utils.ts` fayliga yana boshqa foydali helper funksiyalar (masalan `formatDate`, `truncateText`, `capitalize`) ham qo‘shib beray?

---

### 👤 Foydalanuvchi:

import React from 'react'

function Header() {
    return (
        <div className='w-screen h-25'>
            Header
        </div>
    )
}

export default Header




### 🤖 ChatGPT:

Yaxshi — lekin `Header` komponentingizni biroz yaxshilab, **responsive**, **layoutga mos** va **visual jihatdan aniq** qilaylik.  
Sizning layoutingizda `Header` yuqori panel sifatida ishlaydi, shuning uchun bu versiya mos bo‘ladi 👇

---

### ✅ Yaxshilangan `Header.tsx`
```tsx
"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { UserCircle2 } from "lucide-react"

function Header() {
  return (
    <header
      className={cn(
        "w-full h-16 px-6 flex items-center justify-between",
        "bg-white shadow-md border-b"
      )}
    >
      {/* Chap tomonda — logo yoki sarlavha */}
      <h1 className="text-xl font-semibold text-gray-800">
        🎓 EduCenter Panel
      </h1>

      {/* O‘ng tomonda — foydalanuvchi profili */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Fayzillo Ummatov</span>
        <UserCircle2 className="w-8 h-8 text-gray-700" />
      </div>
    </header>
  )
}

export default Header
```

---

### 💡 Izohlar:
- `h-16` → 64px balandlik (`h-25` Tailwind’da yo‘q).
- `shadow-md` va `border-b` → chiroyli ajratish uchun.
- `cn` yordamida kerak bo‘lsa sinflarni dinamik ulash mumkin.
- `lucide-react` dan `UserCircle2` ikonasi ishlatilgan (sizda allaqachon mavjud).

---

Xohlaysizmi, shu `Header`ga **search bar** yoki **notifications bell** ham qo‘shay?  
Ko‘p hollarda admin panel uchun juda foydali bo‘ladi.

---

### 👤 Foydalanuvchi:

export type LeftTargetType = "teachers" | "groupes" | "courses" | "statistika" | "students";

// TargetFolderStore uchun tip va implementatsiya
interface TargetFolderState {
    currentFolder: LeftTargetType | null;
    setFolder: (folder: LeftTargetType) => void;
    clearFolder: () => void;
}

export const TargetFolderStore = create<TargetFolderState>((set) => ({
    currentFolder: null,
    setFolder: (folder) => set({ currentFolder: folder }),
    clearFolder: () => set({ currentFolder: null }),
}));



import React from 'react'

import { LeftTargetType } from '@/lib/ui.state'
import { TargetFolderStore } from '@/lib/ui.state'
// "teachers" | "groupes" | "courses" | "statistika"


function Left() {

  return (
    <div className='h-full'>

    </div>
  )
}

export default Left


router.push(id)  usuli bilan

### 🤖 ChatGPT:

Zo‘r 👌 — siz `Left` panelda (ya’ni navigatsiya menyusida) bo‘limlarni (`teachers`, `groupes`, `courses`, `statistika`, `students`) tanlash va `router.push()` yordamida sahifalarga o‘tishni xohlaysiz.  

Quyida **to‘liq ishlaydigan variant** — Zustand store (`TargetFolderStore`) bilan bog‘langan `Left.tsx` versiyasi:

---

### ✅ `Left.tsx`
```tsx
"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"
import { TargetFolderStore } from "@/lib/ui.state"
import { LeftTargetType } from "@/lib/ui.state"
import { cn } from "@/lib/utils"
import {
  Users,
  BookOpen,
  Layers,
  BarChart2,
  GraduationCap,
} from "lucide-react"

const menuItems: { id: LeftTargetType; label: string; icon: React.ReactNode; path: string }[] = [
  { id: "teachers", label: "O‘qituvchilar", icon: <Users size={18} />, path: "/teachers" },
  { id: "students", label: "Talabalar", icon: <GraduationCap size={18} />, path: "/students" },
  { id: "groupes", label: "Guruhlar", icon: <Layers size={18} />, path: "/groupes" },
  { id: "courses", label: "Kurslar", icon: <BookOpen size={18} />, path: "/courses" },
  { id: "statistika", label: "Statistika", icon: <BarChart2 size={18} />, path: "/statistika" },
]

function Left() {
  const router = useRouter()
  const pathname = usePathname()
  const { currentFolder, setFolder } = TargetFolderStore()

  const handleClick = (target: LeftTargetType, path: string) => {
    setFolder(target)
    router.push(path)
  }

  return (
    <div className="h-full flex flex-col gap-2 py-3">
      {menuItems.map((item) => {
        const active =
          currentFolder === item.id || pathname.startsWith(item.path)
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id, item.path)}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              active
                ? "bg-violet-600 text-white"
                : "text-gray-800 hover:bg-violet-200"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default Left
```

---

### 🔍 Nimalar qilingan:
- `menuItems` — barcha menyu bo‘limlari massivda to‘plangan.
- `router.push(path)` — sahifani o‘zgartiradi.
- `TargetFolderStore` orqali tanlangan bo‘lim `currentFolder`da saqlanadi.
- `usePathname()` — aktiv sahifani avtomatik aniqlash uchun.
- `lucide-react` ikonalar yordamida chiroyli dizayn.
- Tailwind bilan hover, active va transition holatlar qo‘shilgan.

---

Xohlaysizmi, men shu `Left` uchun **responsive (mobilda yopilib ochiladigan)** versiyasini ham tayyorlab beray?  
Bu admin panel uchun juda qulay bo‘ladi.

---

### 👤 Foydalanuvchi:

"use client"

import { useAllFetchedData } from '@/lib/ui.state'
import React, { useActionState } from 'react'


// Rooms statistika
function LidsPage() {

    const {error,loading,lessons,courses,fetchAll,groupes,rooms,students,users,teachers} = useAllFetchedData()

    return (
        <div>LidsPage</div>
    )
}

export default LidsPage

### 🤖 ChatGPT:

Ajoyib, Fayzillo 👌  
Bu `LidsPage` komponenti hozircha faqat `useAllFetchedData` dan ma’lumot olib, `div` ichida `"LidsPage"` ni chiqarayapti.

Agar siz bu sahifada **statistika (diagrammalar, umumiy raqamlar, o‘qituvchi/gruppe/talaba soni)** ko‘rsatmoqchi bo‘lsangiz, quyidagi versiya tayyor variant bo‘ladi 👇

---

### ✅ To‘liq ishlaydigan `LidsPage.tsx`

```tsx
"use client"

import React, { useEffect } from "react"
import { useAllFetchedData } from "@/lib/ui.state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Users,
  Layers,
  GraduationCap,
  BookOpen,
  Activity,
} from "lucide-react"

function LidsPage() {
  const {
    error,
    loading,
    lessons,
    courses,
    fetchAll,
    groupes,
    rooms,
    students,
    users,
    teachers,
  } = useAllFetchedData()

  useEffect(() => {
    if (!lessons || !courses || !teachers) {
      fetchAll()
    }
  }, [])

  if (loading) {
    return <div className="flex justify-center py-10">⏳ Yuklanmoqda...</div>
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-medium py-10">
        Xatolik yuz berdi: {error}
      </div>
    )
  }

  return (
    <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* === 1. O‘qituvchilar soni === */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>O‘qituvchilar</CardTitle>
          <Users className="text-blue-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{teachers?.length || 0}</p>
          <p className="text-gray-500 text-sm">ta faol o‘qituvchi</p>
        </CardContent>
      </Card>

      {/* === 2. Talabalar soni === */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Talabalar</CardTitle>
          <GraduationCap className="text-green-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{students?.length || 0}</p>
          <p className="text-gray-500 text-sm">ta ro‘yxatdan o‘tgan</p>
        </CardContent>
      </Card>

      {/* === 3. Guruhlar soni === */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Guruhlar</CardTitle>
          <Layers className="text-purple-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{groupes?.length || 0}</p>
          <p className="text-gray-500 text-sm">ta faol guruh</p>
        </CardContent>
      </Card>

      {/* === 4. Kurslar soni === */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Kurslar</CardTitle>
          <BookOpen className="text-orange-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{courses?.length || 0}</p>
          <p className="text-gray-500 text-sm">ta kurs</p>
        </CardContent>
      </Card>

      {/* === 5. Darslar soni === */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Darslar</CardTitle>
          <Activity className="text-rose-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{lessons?.length || 0}</p>
          <p className="text-gray-500 text-sm">ta dars yozilgan</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default LidsPage
```

---

### 🎨 Natija:
Bu kod sizga quyidagi narsalarni beradi:
- 5 ta **statistik karta** (o‘qituvchi, talaba, guruh, kurs, dars).
- Avtomatik `fetchAll()` chaqiriladi agar ma’lumotlar bo‘lmasa.
- `loading` va `error` holatlari chiroyli ko‘rsatiladi.
- `w-full` kenglikda diagrammalar joylashadi (sizning layout dizayningizga mos).

---

Xohlaysizmi, shu statistik kartalarga **bar chart yoki line chart** (`recharts` bilan) ham qo‘shib beray?  
Masalan: “haftalik yangi talabalar”, “darslar soni bo‘yicha o‘sish” grafigi.

---

### 👤 Foydalanuvchi:

"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"
import { TargetFolderStore } from "@/lib/ui.state"
import { LeftTargetType } from "@/lib/ui.state"
import { cn } from "@/lib/utils"
import {
  Users,
  BookOpen,
  Layers,
  BarChart2,
  GraduationCap,
} from "lucide-react"

const menuItems: { id: LeftTargetType; label: string; icon: React.ReactNode; path: string }[] = [
  { id: "teachers", label: "O‘qituvchilar", icon: <Users size={18} />, path: "/teachers" },
  { id: "students", label: "Talabalar", icon: <GraduationCap size={18} />, path: "/students" },
  { id: "groupes", label: "Guruhlar", icon: <Layers size={18} />, path: "/groupes" },
  { id: "courses", label: "Kurslar", icon: <BookOpen size={18} />, path: "/courses" },
  { id: "statistika", label: "Statistika", icon: <BarChart2 size={18} />, path: "/statistika" },
]

function Left() {
  const router = useRouter()
  const pathname = usePathname()
  const { currentFolder, setFolder } = TargetFolderStore()

  const handleClick = (target: LeftTargetType, path: string) => {
    setFolder(target)
    router.push(path)
  }

  return (
    <div className="h-full flex flex-col gap-2 py-3">
      {menuItems.map((item) => {
        const active =
          currentFolder === item.id || pathname.startsWith(item.path)
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id, item.path)}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              active
                ? "bg-violet-600 text-white"
                : "text-gray-800 hover:bg-violet-200"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default Left

bunga lids ni qo'sh

### 🤖 ChatGPT:

Zo‘r 👍  
Demak sizning `Left` menyu komponentingizga yana **“Lids”** bo‘limini qo‘shmoqchisiz (ya’ni “Rooms statistika” yoki “LidsPage” sahifasi uchun).  
Quyida yangilangan, to‘liq tayyor variant 👇

---

### ✅ **Yangilangan `Left.tsx` (Lids qo‘shilgan)**

```tsx
"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"
import { TargetFolderStore } from "@/lib/ui.state"
import { LeftTargetType } from "@/lib/ui.state"
import { cn } from "@/lib/utils"
import {
  Users,
  BookOpen,
  Layers,
  BarChart2,
  GraduationCap,
  ActivitySquare,
} from "lucide-react"

// 🔹 Lids uchun yangi tip qo‘shamiz
type ExtendedLeftTargetType = LeftTargetType | "lids"

const menuItems: {
  id: ExtendedLeftTargetType
  label: string
  icon: React.ReactNode
  path: string
}[] = [
  { id: "teachers", label: "O‘qituvchilar", icon: <Users size={18} />, path: "/teachers" },
  { id: "students", label: "Talabalar", icon: <GraduationCap size={18} />, path: "/students" },
  { id: "groupes", label: "Guruhlar", icon: <Layers size={18} />, path: "/groupes" },
  { id: "courses", label: "Kurslar", icon: <BookOpen size={18} />, path: "/courses" },
  { id: "lids", label: "Lids", icon: <ActivitySquare size={18} />, path: "/lids" },
  { id: "statistika", label: "Statistika", icon: <BarChart2 size={18} />, path: "/statistika" },
]

function Left() {
  const router = useRouter()
  const pathname = usePathname()
  const { currentFolder, setFolder } = TargetFolderStore()

  const handleClick = (target: ExtendedLeftTargetType, path: string) => {
    setFolder(target as LeftTargetType)
    router.push(path)
  }

  return (
    <div className="h-full flex flex-col gap-2 py-3">
      {menuItems.map((item) => {
        const active =
          currentFolder === item.id || pathname.startsWith(item.path)
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id, item.path)}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              active
                ? "bg-violet-600 text-white"
                : "text-gray-800 hover:bg-violet-200"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default Left
```

---

### 🔧 Qo‘shimcha tavsiyalar:
- `lids` uchun sizda allaqachon `app/lids/page.tsx` fayl bo‘lsa — u avtomatik ishlaydi.
- `ActivitySquare` ikonkasi bilan “Lids” bo‘limi boshqalarga uyg‘un chiqadi.
- `TargetFolderStore` tipini o‘zgartirishga hojat yo‘q — faqat `as LeftTargetType` qilib cast qildik.

---

Xohlaysizmi, men sizga shu `lids` uchun to‘liq **dashboard-style sahifa (diagrammalar bilan)** tayyorlab beray?  
Masalan: o‘tgan haftadagi yangi guruhlar, o‘qituvchilar, talabalar statistikasi.

---

### 👤 Foydalanuvchi:

"use client"

import React, { useEffect } from "react"
import { useAllFetchedData } from "@/lib/ui.state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Users,
  Layers,
  GraduationCap,
  BookOpen,
  Activity,
} from "lucide-react"

function LidsPage() {
  const {
    error,
    loading,
    lessons,
    courses,
    fetchAll,
    groupes,
    rooms,
    students,
    users,
    teachers,
  } = useAllFetchedData()

  useEffect(() => {
    if (!lessons || !courses || !teachers) {
      fetchAll()
    }
  }, [])

  if (loading) {
    return <div className="flex justify-center py-10">⏳ Yuklanmoqda...</div>
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-medium py-10">
        Xatolik yuz berdi: {error}
      </div>
    )
  }

  return (
    <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* === 1. O‘qituvchilar soni === */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>O‘qituvchilar</CardTitle>
          <Users className="text-blue-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{teachers?.length || 0}</p>
          <p className="text-gray-500 text-sm">ta faol o‘qituvchi</p>
        </CardContent>
      </Card>

      {/* === 2. Talabalar soni === */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Talabalar</CardTitle>
          <GraduationCap className="text-green-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{students?.length || 0}</p>
          <p className="text-gray-500 text-sm">ta ro‘yxatdan o‘tgan</p>
        </CardContent>
      </Card>

      {/* === 3. Guruhlar soni === */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Guruhlar</CardTitle>
          <Layers className="text-purple-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{groupes?.length || 0}</p>
          <p className="text-gray-500 text-sm">ta faol guruh</p>
        </CardContent>
      </Card>

      {/* === 4. Kurslar soni === */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Kurslar</CardTitle>
          <BookOpen className="text-orange-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{courses?.length || 0}</p>
          <p className="text-gray-500 text-sm">ta kurs</p>
        </CardContent>
      </Card>

      {/* === 5. Darslar soni === */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Darslar</CardTitle>
          <Activity className="text-rose-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{lessons?.length || 0}</p>
          <p className="text-gray-500 text-sm">ta dars yozilgan</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default LidsPage

Bunda  Card asosi room bo'lishi kerak

### 🤖 ChatGPT:

Zo‘r — demak sen `LidsPage`da **room (xonalar)** asosida statistikani ko‘rsatmoqchisan, ya’ni har bir xona (`room`) uchun alohida `Card` chiqishi kerak.  
Masalan, har bir room ichida nechta guruh bor, nechta talaba qatnashadi, nechta dars bo‘lgan — shularni ko‘rsatish mumkin.

Quyida **to‘liq moslashtirilgan versiya** — `room`lar asosida:

---

```tsx
"use client"

import React, { useEffect } from "react"
import { useAllFetchedData } from "@/lib/ui.state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, GraduationCap, Activity } from "lucide-react"

function LidsPage() {
  const {
    error,
    loading,
    lessons,
    courses,
    fetchAll,
    groupes,
    rooms,
    students,
    users,
    teachers,
  } = useAllFetchedData()

  useEffect(() => {
    if (!rooms || !groupes || !students || !lessons) {
      fetchAll()
    }
  }, [])

  if (loading) {
    return <div className="flex justify-center py-10">⏳ Yuklanmoqda...</div>
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-medium py-10">
        Xatolik yuz berdi: {error}
      </div>
    )
  }

  return (
    <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {rooms?.map((room) => {
        const roomGroups = groupes?.filter((g) => g.roomId === room.id) || []
        const roomStudents = students?.filter((s) =>
          roomGroups.some((g) => g.id === s.groupId)
        ) || []
        const roomLessons = lessons?.filter((l) =>
          roomGroups.some((g) => g.id === l.groupId)
        ) || []

        return (
          <Card
            key={room.id}
            className="shadow-lg hover:shadow-xl transition border border-gray-200"
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {room.name || "Nomsiz xona"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Layers className="text-purple-600" size={18} />
                  <span>Guruhlar</span>
                </div>
                <span className="font-bold">{roomGroups.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <GraduationCap className="text-green-600" size={18} />
                  <span>Talabalar</span>
                </div>
                <span className="font-bold">{roomStudents.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Activity className="text-rose-600" size={18} />
                  <span>Darslar</span>
                </div>
                <span className="font-bold">{roomLessons.length}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default LidsPage
```

---

### 🧩 Qisqacha izoh:
- `rooms` asosiy manba sifatida olinadi.
- Har bir `room` uchun:
  - `groupes` → `roomId` orqali filtrlab olingan.
  - `students` → `groupId` bo‘yicha bog‘lanadi.
  - `lessons` → `groupId` orqali bog‘lanadi.
- Natijada har bir xona uchun 3 ta raqamli statistika chiqadi:
  - Guruhlar soni
  - Talabalar soni
  - Darslar soni  

---

Xohlaysanmi men bunga **diagramma (masalan bar chart)** ham qo‘shib beray, har bir xonadagi dars sonini ko‘rsatadigan tarzda?

---

### 👤 Foydalanuvchi:

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
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

model Rom {
  id        String  @id @default(uuid())
  name      String
  romNumber Int
  pleaces   Int
  isOpen    Boolean @default(true)
  isDeleted Boolean @default(false)

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
  image         String?
  isDeleted     Boolean @default(false)

  groupes Group[]

  @@map("courses")
}

model Group {
  id        String  @id @default(uuid())
  name      String

  teacherId String
  courseId  String
  romId     String

  inActive  Boolean
  isEnd     Boolean @default(false)
  isStart   Boolean @default(false)
  startDate DateTime
  isDeleted Boolean @default(false)

  teacher      Staff          @relation(fields: [teacherId], references: [id])
  course       Course         @relation(fields: [courseId], references: [id])
  students     StudentGroup[]
  Lesson       Lesson[]
  GroupPayment GroupPayment[]
  rom          Rom            @relation(fields: [romId], references: [id])

  @@map("groupes")
}

model Staff {
  id        String  @id @default(uuid())
  userId    String
  role      RoleStafs @default(STUDENT)
  isDeleted Boolean   @default(false)

  groupes         Group[]
  studentGroup    StudentGroup[]
  Lesson          Lesson[]
  Attendentionals Attendentional[]
  GroupPayment    GroupPayment[]
  user            User             @relation(fields: [userId], references: [id])

  @@map("staffs")
}

model User {
  id        String  @id @default(uuid())
  email     String
  phone     String?
  password  String
  firstName String
  lastName  String
  isDeleted Boolean @default(false)
  createdAt DateTime @default(now())
  birthDay  DateTime
  father    String?
  image     String?

  Staff Staff[]
}

model StudentGroup {
  id        String @id @default(uuid())
  studentId String
  groupId   String
  isDeleted Boolean @default(false)

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
  isDeleted Boolean @default(false)

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
  isDeleted   Boolean   @default(false)

  lesson  Lesson @relation(fields: [lessonId], references: [id])
  student Staff  @relation(fields: [studentId], references: [id])

  @@map("attendentionals")
}

model GroupPayment {
  id           String        @id @default(uuid())
  amount       Int
  status       PaymentStatus @default(PENDING)
  paymentMonth Int
  paymentDate  DateTime
  studentId    String
  groupId      String
  isDeleted    Boolean @default(false)

  student Staff @relation(fields: [studentId], references: [id])
  group   Group @relation(fields: [groupId], references: [id])

  @@map("group_payments")
}

bu prisma 

endi  rooms serviseda Lids  statistikasi uchun  ma'lumot qaytaruvchi get yozishimiz kerak

import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateRomDto } from './dto/create-rom.dto';
import { UpdateRomDto } from './dto/update-rom.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Rom } from '@prisma/client';

@Injectable()
export class RomService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  async create(data: CreateRomDto) {
    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.ROM, "romNumber", data.romNumber)
    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.ROM, "name", data.name)
    const newRom = await this.prisma.rom.create({
      data: data
    })
    return {
      message: 'This action adds a new rom',
      rom: newRom
    };
  }

  async findAll() {
    return {
      message : `This action returns all rom`,
      roms : await this.prisma.rom.findMany()
    };
  }

  async findOne(id: string) {
    let rom = await this.prisma.rom.findFirst({where : { id : id}})
    if(!rom) {
      throw new BadRequestException(`Rom not found by id [${id}] `)
    }
    return {
      message : `This action returns a #${id} rom`,
      rom : rom
    };
  }

  async update(id: string, data: UpdateRomDto) {
    await checkExistsResurs(this.prisma,ModelsEnumInPrisma.ROM,"id",id)
    if(data.romNumber) {
      const OLdROm = await this.prisma.rom.findFirst({where : {romNumber : data.romNumber}})
      if(OLdROm && OLdROm.id !== id) throw new BadGatewayException(`Already exists rom by romNumber [${data.romNumber}]`)
    }
    if(data.name) {
      const OLdROm = await this.prisma.rom.findFirst({where : {name : data.name}})
      if(OLdROm && OLdROm.id !== id)  throw new BadGatewayException(`Already exists rom by name [${data.name}]`)
    }
    const updatedRom = await this.prisma.rom.update({
      where : {id : id},
      data : {...data}
    })
    return {
      message : `This action updates a #${id} rom`,
      rom : updatedRom
    };
  }

  async remove(id: string) {
    await checkExistsResurs(this.prisma,ModelsEnumInPrisma.ROM,"id",id)
    
    if((await this.prisma.group.findFirst({where : {romId : id}}))){
      throw new BadRequestException(`Reference exists by romId [${id}] in group `)
    }

    const deletedRom = await this.prisma.rom.delete({
      where : {id : id}
    })

    return {
      message : `This action removes a #${id} rom`,
      rom : deletedRom
    };
  }
}


bu rooms servicega

### 🤖 ChatGPT:

Zo‘r — endi sening maqsading **har bir xona (`Rom`) uchun statistik ma’lumotlarni** (`Lids` sahifasidagi kabi) backend tarafda **`getLidsStats()`** endpoint orqali qaytarish.

Bu funksiya quyidagi ma’lumotlarni qaytaradi:
- har bir xona nomi (`name`)
- guruhlar soni (`groupCount`)
- talabalar soni (`studentCount`)
- darslar soni (`lessonCount`)

Bular `group`, `studentGroup`, va `lesson` jadvalidan hisoblanadi.

---

### 🔧 Quyidagi kodni `RomService` ichiga qo‘sh:
```ts
async getLidsStats() {
  try {
    const rooms = await this.prisma.rom.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        romNumber: true,
        Group: {
          where: { isDeleted: false },
          select: {
            id: true,
            students: {
              where: { isDeleted: false },
              select: { id: true }
            },
            Lesson: {
              where: { isDeleted: false },
              select: { id: true }
            }
          }
        }
      }
    })

    // 📊 Statistikani formatlash
    const stats = rooms.map((room) => {
      const groupCount = room.Group.length
      const studentCount = room.Group.reduce((acc, g) => acc + g.students.length, 0)
      const lessonCount = room.Group.reduce((acc, g) => acc + g.Lesson.length, 0)

      return {
        id: room.id,
        name: room.name,
        romNumber: room.romNumber,
        groupCount,
        studentCount,
        lessonCount,
      }
    })

    return {
      message: "Rooms statistics successfully fetched",
      count: stats.length,
      stats
    }

  } catch (error) {
    console.error(error)
    throw new BadGatewayException("Failed to load room statistics")
  }
}
```

---

### 🔹 Natija misoli:
Bu funksiya quyidagi JSON shaklida natija qaytaradi:

```json
{
  "message": "Rooms statistics successfully fetched",
  "count": 3,
  "stats": [
    {
      "id": "1e2f4c...",
      "name": "101-xona",
      "romNumber": 101,
      "groupCount": 3,
      "studentCount": 45,
      "lessonCount": 12
    },
    {
      "id": "8d9b6a...",
      "name": "202-xona",
      "romNumber": 202,
      "groupCount": 2,
      "studentCount": 30,
      "lessonCount": 8
    }
  ]
}
```

---

### 🔹 Controller ichida foydalanish (misol uchun):

```ts
@Get('lids')
async getLidsStats() {
  return this.romService.getLidsStats()
}
```

---

### 🧠 Qisqacha izoh:
- `prisma.rom.findMany` orqali barcha xonalar olinadi.
- Har bir `Rom` ichida `Group[]` bor.
- `Group` ichida `students` va `Lesson`lar mavjud.
- `reduce` yordamida umumiy sonlar hisoblanadi.
- Foydalanuvchiga toza statistik obyektlar qaytariladi.

---

Xohlaysanmi, men bunga **davomat (Attendentionals)** statistikasini ham qo‘shib beray — masalan, har bir xonada nechta “kelgan” va “kelmagan” o‘quvchi darslarda qatnashganligini?

---

### 👤 Foydalanuvchi:

"use client"

import React, { useEffect } from "react"
import { useAllFetchedData } from "@/lib/ui.state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, GraduationCap, Activity } from "lucide-react"
import { Rooms } from "@/features"

function LidsPage() {
    const {
        error,
        loading,
        lessons,
        courses,
        fetchAll,
        groupes,
        rooms,
        students,
        users,
        teachers,
    } = useAllFetchedData()
    useEffect(() => {
        const fetchStatisTika = async () => {
            const res = await Rooms.getAllStatistika()
            const target = {
                "message": "Rooms statistics successfully fetched",
                "count": 1,
                "stats": [
                    {
                        "id": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
                        "name": "Salo",
                        "romNumber": 1,
                        "groupCount": 3,
                        "studentCount": 6,
                        "lessonCount": 6
                    }
                ]
            }
            console.log(res)
        }
        fetchStatisTika()
    }, [])
    useEffect(() => {
        if (!rooms || !groupes || !students || !lessons) {
            fetchAll()
        }
    }, [])

    if (loading) {
        return <div className="flex justify-center py-10">⏳ Yuklanmoqda...</div>
    }

    if (error) {
        return (
            <div className="text-center text-red-500 font-medium py-10">
                Xatolik yuz berdi: {error}
            </div>
        )
    }

    return (
        <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rooms?.map((room) => {
                const roomGroups = groupes?.filter((g) => g.romId === room.id) || []
                const roomStudents = students?.filter((s) =>
                    roomGroups.some((g) => g.isStart)
                ) || []
                const roomLessons = lessons?.filter((l) =>
                    roomGroups.some((g) => g.id === l.groupId)
                ) || []

                return (
                    <Card
                        key={room.id}
                        className="shadow-lg hover:shadow-xl transition border border-gray-200"
                    >
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">
                                {room.name || "Nomsiz xona"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Layers className="text-purple-600" size={18} />
                                    <span>Guruhlar</span>
                                </div>
                                <span className="font-bold">{roomGroups.length}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <GraduationCap className="text-green-600" size={18} />
                                    <span>Talabalar</span>
                                </div>
                                <span className="font-bold">{roomStudents.length}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Activity className="text-rose-600" size={18} />
                                    <span>Darslar</span>
                                </div>
                                <span className="font-bold">{roomLessons.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default LidsPage

### 🤖 ChatGPT:

Zo‘r 👌 — bu `LidsPage` allaqachon backenddagi `Rooms.getAllStatistika()` endpoint bilan ishlashga tayyor holatda.  
Ammo hozir unda statistikani frontendda `rooms`, `groupes`, `students`, `lessons` orqali **hisoblayapti**, bu esa:
- serverda allaqachon hisoblangan ma’lumotni **yana qayta hisoblashga** olib keladi;
- `useAllFetchedData()` bo‘sh bo‘lsa — natija noto‘g‘ri chiqadi.

Shuning uchun — bu komponentni **to‘liq backenddan qaytgan `res.stats` ma’lumotlari bilan ishlaydigan** qilib optimallashtiraylik 👇

---

### ✅ To‘g‘rilangan va toza variant:

```tsx
"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, GraduationCap, Activity } from "lucide-react"
import { Rooms } from "@/features"

function LidsPage() {
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatistika = async () => {
      try {
        const res = await Rooms.getAllStatistika()
        if (res?.stats) setStats(res.stats)
      } catch (err: any) {
        setError(err.message || "Xatolik yuz berdi")
      } finally {
        setLoading(false)
      }
    }

    fetchStatistika()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-10">⏳ Yuklanmoqda...</div>
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-medium py-10">
        Xatolik yuz berdi: {error}
      </div>
    )
  }

  if (!stats.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        Hozircha xonalar statistikasi topilmadi.
      </div>
    )
  }

  return (
    <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {stats.map((room) => (
        <Card
          key={room.id}
          className="shadow-lg hover:shadow-xl transition border border-gray-200"
        >
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {room.name || "Nomsiz xona"}{" "}
              <span className="text-sm text-gray-500">
                ({room.romNumber}-xona)
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Layers className="text-purple-600" size={18} />
                <span>Guruhlar</span>
              </div>
              <span className="font-bold">{room.groupCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <GraduationCap className="text-green-600" size={18} />
                <span>Talabalar</span>
              </div>
              <span className="font-bold">{room.studentCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Activity className="text-rose-600" size={18} />
                <span>Darslar</span>
              </div>
              <span className="font-bold">{room.lessonCount}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default LidsPage
```

---

### 🧠 Nimalar o‘zgardi:
- Endi `rooms`, `groupes`, `students`, `lessons` frontendda qayta hisoblanmaydi.  
- `useAllFetchedData` olib tashlandi — kerak emas.
- `Rooms.getAllStatistika()` natijasidagi `stats` to‘g‘ridan-to‘g‘ri kartalarda aks etadi.
- Kutilmagan xatolar (`catch`) uchun `setError` qo‘shildi.
- UX yaxshilandi (`Yuklanmoqda...`, `Xatolik`, `Bo‘sh` holatlar).

---

Agar xohlasang, bu kartalarga yana qo‘shimcha `kelgan/kelmagan` statistikasi (`Attendentionals`dan) ham kiritib beraman — har bir xona bo‘yicha darslarda nechta talaba qatnashganini ko‘rsatadi (masalan: `20 / 25` qatnashgan).  
Qo‘shaymi?

---

### 👤 Foydalanuvchi:

endi lids/lidId   yani app/lids/[lidId]/page.tsx kerak

  async getAllStatistika() {
    const res = await this.prisma.studentGroup.findMany({
      include: {
        student: {
          include: {
            user: true
          }
        },
        group: {
          include: {
            course: true,
            rom: true,
            Lesson: true,
            teacher : {
              include : {
                user : true
              }
            }
          }
        }
      }
    })
    return res.map(s => {
      const { group, groupId, id, isDeleted, student, studentId } = s
      const { Lesson, course, courseId, inActive, isEnd, isStart,teacher, name, rom, romId, startDate, teacherId, } = group
      const lessons = Lesson.map(l => {
        const { endDate, groupId, id, isDeleted, lessonNumber, startDate, teacherId } = l
        return { endDate, groupId, id, isDeleted, lessonNumber, startDate, teacherId }
      })
      const {isDeleted : teacherIsDeleted,role,user,userId} = teacher
      const {birthDay,createdAt,email,father,firstName,image,lastName,phone} = user
    })
  }



### 🤖 ChatGPT:

Zo‘r, endi bizga `app/lids/[lidId]/page.tsx` kerak — ya’ni **har bir xona (lid/room)** bo‘yicha **batafsil statistika sahifasi**.  

Sen yuborgan backend funksiyang (`getAllStatistika`) `studentGroup` orqali **xona → guruh → darslar → o‘qituvchi → talabalar** iyerarxiyasini beradi.  
Frontendda bu ma’lumotni olish uchun `Rooms.getByIdStatistika(lidId)` yoki `Rooms.getAllStatistika()` dan filtrlab ishlatish mumkin.

Quyidagi misol **dynamic route page** (`app/lids/[lidId]/page.tsx`) uchun tayyor:  

---

```tsx
"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, GraduationCap, Layers, User } from "lucide-react"
import { Rooms } from "@/features"
import { CircularProgress } from "@mui/material"

interface Lesson {
  id: string
  lessonNumber: number
  startDate: string
  endDate: string | null
}

interface Teacher {
  user: {
    firstName: string
    lastName: string
    email: string
  }
}

interface Group {
  id: string
  name: string
  course: { name: string }
  Lesson: Lesson[]
  teacher: Teacher
  rom: { name: string }
}

interface Student {
  id: string
  user: {
    firstName: string
    lastName: string
    phone: string
  }
}

export default function LidDetailsPage() {
  const { lidId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Group[]>([])

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const res = await Rooms.getAllStatistika()
        // Faqat tanlangan xona bo‘yicha filtrlaymiz
        const filtered = res.filter(
          (item: any) => item.group.rom.id === lidId
        )
        setData(filtered.map((item: any) => item.group))
      } catch (err) {
        setError("Xona statistikasi yuklanmadi")
      } finally {
        setLoading(false)
      }
    }
    fetchRoomDetails()
  }, [lidId])

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    )

  if (error)
    return (
      <div className="text-center text-red-500 font-semibold py-10">
        {error}
      </div>
    )

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6">
        Xona bo‘yicha batafsil ma’lumot
      </h1>

      {data.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Ushbu xonada hali hech qanday guruh mavjud emas.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map((group) => (
            <Card
              key={group.id}
              className="shadow-lg hover:shadow-xl transition border border-gray-200"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {group.name}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Kurs: {group.course?.name || "Noma’lum"}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="text-blue-600" size={18} />
                    <span>O‘qituvchi</span>
                  </div>
                  <span className="font-semibold">
                    {group.teacher?.user
                      ? `${group.teacher.user.firstName} ${group.teacher.user.lastName}`
                      : "Noma’lum"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Activity className="text-rose-600" size={18} />
                    <span>Darslar soni</span>
                  </div>
                  <span className="font-bold">{group.Lesson.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <GraduationCap className="text-green-600" size={18} />
                    <span>Talabalar soni</span>
                  </div>
                  <span className="font-bold">
                    {
                      new Set(
                        data
                          .filter((g) => g.id === group.id)
                          .flatMap((g: any) =>
                            g.students?.map((s: any) => s.id)
                          )
                      ).size
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Layers className="text-purple-600" size={18} />
                    <span>Xona</span>
                  </div>
                  <span className="font-bold">
                    {group.rom?.name || "Noma’lum"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

### 🔍 Izoh:
- `useParams()` bilan `lidId` ni URL dan olamiz.  
- `Rooms.getAllStatistika()` barcha ma’lumotlarni olib keladi, keyin `filter()` orqali `rom.id === lidId` bo‘yicha ajratiladi.  
- `Card` har bir guruhni ko‘rsatadi:  
  - Guruh nomi  
  - Kurs nomi  
  - O‘qituvchi  
  - Darslar soni  
  - Talabalar soni  
  - Xona nomi  

---

Agar orqada `Rooms.getByIdStatistika(lidId)` degan endpoint bo‘lsa, filtrlash o‘rniga bevosita shuni ishlatish mumkin.  
Xohlaysanmi, backendda shu `getByIdStatistika(lidId)` endpointni ham yozib beray?

---

### 👤 Foydalanuvchi:

  async getAllStatistika() {
    const res = await this.prisma.studentGroup.findMany({
      include: {
        student: {
          include: {
            user: true
          }
        },
        group: {
          include: {
            course: true,
            rom: true,
            Lesson: true,
            teacher : {
              include : {
                user : true
              }
            }
          }
        }
      }
    })
    return res.map(s => {
      const { group, groupId, id, isDeleted, student, studentId } = s
      const { Lesson, course, courseId, inActive, isEnd, isStart,teacher, name, rom, romId, startDate, teacherId, } = group
      const lessons = Lesson.map(l => {
        const { endDate, groupId, id, isDeleted, lessonNumber, startDate, teacherId } = l
        return { endDate, groupId, id, isDeleted, lessonNumber, startDate, teacherId }
      })
      const {isDeleted : teacherIsDeleted,role,user,userId} = teacher
      const {birthDay,createdAt,email,father,firstName,image,lastName,phone} = user
    })
  }


menga bu functsiyani formatini yozib ber va front uchun type ham

### 🤖 ChatGPT:

Zo‘r savol 👌  
Senga hozir ikkita narsa kerak:  

1. 🧠 **Backenddagi `getAllStatistika()` funksiyasining to‘liq, formatlangan (ishlaydigan) versiyasi**  
2. 🧩 **Frontend uchun to‘liq `TypeScript` tiplari (`RoomStats`, `GroupStats`, `LessonStats`, `TeacherStats`, `StudentStats`)**  

Kettik bosqichma-bosqich.

---

## 🛠 1. To‘liq backend funksiya (formatlangan versiya)

```ts
async getAllStatistika() {
  const res = await this.prisma.studentGroup.findMany({
    include: {
      student: {
        include: {
          user: true,
        },
      },
      group: {
        include: {
          course: true,
          rom: true,
          Lesson: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  return res.map((s) => {
    const {
      id,
      student,
      group,
    } = s;

    const { user: studentUser } = student;
    const {
      id: groupId,
      name,
      startDate,
      isStart,
      isEnd,
      inActive,
      course,
      rom,
      Lesson,
      teacher,
    } = group;

    const lessons = Lesson.map((l) => ({
      id: l.id,
      groupId: l.groupId,
      lessonNumber: l.lessonNumber,
      startDate: l.startDate,
      endDate: l.endDate,
      teacherId: l.teacherId,
      isDeleted: l.isDeleted,
    }));

    return {
      id, // studentGroup id
      student: {
        id: student.id,
        userId: student.userId,
        firstName: studentUser.firstName,
        lastName: studentUser.lastName,
        phone: studentUser.phone,
        email: studentUser.email,
        birthDay: studentUser.birthDay,
        father: studentUser.father,
        image: studentUser.image,
        createdAt: studentUser.createdAt,
      },
      group: {
        id: groupId,
        name,
        startDate,
        isStart,
        isEnd,
        inActive,
        course: {
          id: course.id,
          name: course.name,
          price: course.price,
        },
        rom: {
          id: rom.id,
          name: rom.name,
          romNumber: rom.romNumber,
        },
        teacher: {
          id: teacher.id,
          userId: teacher.userId,
          isDeleted: teacher.isDeleted,
          role: teacher.role,
          user: {
            firstName: teacher.user.firstName,
            lastName: teacher.user.lastName,
            email: teacher.user.email,
            phone: teacher.user.phone,
          },
        },
        lessons,
      },
    };
  });
}
```

---

## 🧩 2. Frontend uchun `TypeScript` tiplari

```ts
export interface LessonStats {
  id: string
  groupId: string
  lessonNumber: number
  startDate: string
  endDate: string | null
  teacherId: string
  isDeleted: boolean
}

export interface TeacherUser {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface TeacherStats {
  id: string
  userId: string
  isDeleted: boolean
  role: string
  user: TeacherUser
}

export interface CourseStats {
  id: string
  name: string
  price: number
}

export interface RoomStats {
  id: string
  name: string
  romNumber: number
}

export interface GroupStats {
  id: string
  name: string
  startDate: string
  isStart: boolean
  isEnd: boolean
  inActive: boolean
  course: CourseStats
  rom: RoomStats
  teacher: TeacherStats
  lessons: LessonStats[]
}

export interface StudentUser {
  firstName: string
  lastName: string
  phone: string
  email: string
  birthDay: string | null
  father: string | null
  image: string | null
  createdAt: string
}

export interface StudentStats {
  id: string
  userId: string
  user: StudentUser
}

export interface StudentGroupStats {
  id: string
  student: StudentStats
  group: GroupStats
}
```

---

## 🔗 Frontend misol:
```ts
import { StudentGroupStats } from "@/types"

const res: StudentGroupStats[] = await Rooms.getAllStatistika()
console.log(res[0].group.teacher.user.firstName)
```

---

Xohlaysanmi, endi shu `getAllStatistika()` funksiyani asosida `getByRoomIdStatistika(lidId)` versiyasini ham yozib beray — ya’ni faqat bitta xonaga tegishli statistikani qaytaradigan variantni?

---

### 👤 Foydalanuvchi:

"use client"

import { StudentGroupes } from '@/features'
import React, { useEffect } from 'react'

interface RoomPagePropsType {
    params: Promise<{ lidId: string }>
}

function RoomPage({ params }: RoomPagePropsType) {

    const { lidId } = React.use(params)

    const fetchData = async () => {
        try {
            const res = await StudentGroupes.getFullStatistika(lidId)
            const target = [
                {
                    "id": "ea669709-73f0-4aba-b0bb-6a8429a7c1ee",
                    "student": {
                        "id": "3c0f817b-de41-4087-8c9c-c66bea445f69",
                        "userId": "d930d04f-5ebc-4fa3-b9d8-fde94b298a70",
                        "firstName": "Abdulloh",
                        "lastName": "Ummatov",
                        "phone": "916102142",
                        "email": "cdscdswcdscsdc@gmail.com",
                        "birthDay": "2025-10-06T00:00:00.000Z",
                        "father": "",
                        "image": null,
                        "createdAt": "2025-10-21T18:33:23.514Z"
                    },
                    "group": {
                        "id": "dccf53de-fc1b-40bd-8b4b-50ba61aefe5a",
                        "name": "FN3",
                        "startDate": "2025-10-22T05:30:00.000Z",
                        "isStart": true,
                        "isEnd": false,
                        "inActive": true,
                        "course": {
                            "id": "5a39512b-46cf-45fb-a9b8-1d46c22db4d9",
                            "name": "CRM",
                            "price": 150000
                        },
                        "rom": {
                            "id": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
                            "name": "Salo",
                            "romNumber": 1
                        },
                        "teacher": {
                            "id": "86a20fcf-9d66-416b-936a-f9722c411930",
                            "userId": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                            "isDeleted": false,
                            "role": "TEACHER",
                            "user": {
                                "firstName": "Fayzillo",
                                "lastName": "Ummatov",
                                "email": "ummatovfayzilllo@gmail.com",
                                "phone": "916102141"
                            }
                        },
                        "lessons": [
                            {
                                "id": "0f734490-4adc-4d74-8534-ac53e5ecdebd",
                                "groupId": "dccf53de-fc1b-40bd-8b4b-50ba61aefe5a",
                                "lessonNumber": 1,
                                "startDate": "2025-10-21T19:35:00.000Z",
                                "endDate": "2025-10-21T21:05:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            }
                        ]
                    }
                },
                {
                    "id": "03eadfc1-0a65-4255-ace4-6835f32a5e6a",
                    "student": {
                        "id": "78519ebe-5a96-4bbf-b11d-50207e46e630",
                        "userId": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                        "firstName": "Fayzillo",
                        "lastName": "Ummatov",
                        "phone": "916102141",
                        "email": "ummatovfayzilllo@gmail.com",
                        "birthDay": "1995-12-29T00:00:00.000Z",
                        "father": "XsaSxXcdsc dscdscda",
                        "image": null,
                        "createdAt": "2025-10-21T18:27:23.827Z"
                    },
                    "group": {
                        "id": "9e4d6714-5f48-481b-aff4-2cb4f38a5a9b",
                        "name": "e-comerse",
                        "startDate": "2025-10-23T18:54:00.000Z",
                        "isStart": true,
                        "isEnd": false,
                        "inActive": true,
                        "course": {
                            "id": "5a39512b-46cf-45fb-a9b8-1d46c22db4d9",
                            "name": "CRM",
                            "price": 150000
                        },
                        "rom": {
                            "id": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
                            "name": "Salo",
                            "romNumber": 1
                        },
                        "teacher": {
                            "id": "86a20fcf-9d66-416b-936a-f9722c411930",
                            "userId": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                            "isDeleted": false,
                            "role": "TEACHER",
                            "user": {
                                "firstName": "Fayzillo",
                                "lastName": "Ummatov",
                                "email": "ummatovfayzilllo@gmail.com",
                                "phone": "916102141"
                            }
                        },
                        "lessons": [
                            {
                                "id": "42cd5782-fc5a-40e4-9e89-39b512daea83",
                                "groupId": "9e4d6714-5f48-481b-aff4-2cb4f38a5a9b",
                                "lessonNumber": 1,
                                "startDate": "2025-10-23T09:00:00.000Z",
                                "endDate": "2025-10-23T10:30:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            },
                            {
                                "id": "be07bc87-5840-4a6e-aea7-92b007bd4ba7",
                                "groupId": "9e4d6714-5f48-481b-aff4-2cb4f38a5a9b",
                                "lessonNumber": 2,
                                "startDate": "2025-10-23T09:00:00.000Z",
                                "endDate": "2025-10-23T10:30:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            }
                        ]
                    }
                },
                {
                    "id": "4001200e-d9f0-4416-b4e5-11ad0bbbf0eb",
                    "student": {
                        "id": "3c0f817b-de41-4087-8c9c-c66bea445f69",
                        "userId": "d930d04f-5ebc-4fa3-b9d8-fde94b298a70",
                        "firstName": "Abdulloh",
                        "lastName": "Ummatov",
                        "phone": "916102142",
                        "email": "cdscdswcdscsdc@gmail.com",
                        "birthDay": "2025-10-06T00:00:00.000Z",
                        "father": "",
                        "image": null,
                        "createdAt": "2025-10-21T18:33:23.514Z"
                    },
                    "group": {
                        "id": "9e4d6714-5f48-481b-aff4-2cb4f38a5a9b",
                        "name": "e-comerse",
                        "startDate": "2025-10-23T18:54:00.000Z",
                        "isStart": true,
                        "isEnd": false,
                        "inActive": true,
                        "course": {
                            "id": "5a39512b-46cf-45fb-a9b8-1d46c22db4d9",
                            "name": "CRM",
                            "price": 150000
                        },
                        "rom": {
                            "id": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
                            "name": "Salo",
                            "romNumber": 1
                        },
                        "teacher": {
                            "id": "86a20fcf-9d66-416b-936a-f9722c411930",
                            "userId": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                            "isDeleted": false,
                            "role": "TEACHER",
                            "user": {
                                "firstName": "Fayzillo",
                                "lastName": "Ummatov",
                                "email": "ummatovfayzilllo@gmail.com",
                                "phone": "916102141"
                            }
                        },
                        "lessons": [
                            {
                                "id": "42cd5782-fc5a-40e4-9e89-39b512daea83",
                                "groupId": "9e4d6714-5f48-481b-aff4-2cb4f38a5a9b",
                                "lessonNumber": 1,
                                "startDate": "2025-10-23T09:00:00.000Z",
                                "endDate": "2025-10-23T10:30:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            },
                            {
                                "id": "be07bc87-5840-4a6e-aea7-92b007bd4ba7",
                                "groupId": "9e4d6714-5f48-481b-aff4-2cb4f38a5a9b",
                                "lessonNumber": 2,
                                "startDate": "2025-10-23T09:00:00.000Z",
                                "endDate": "2025-10-23T10:30:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            }
                        ]
                    }
                },
                {
                    "id": "37f16909-92d5-4c1a-a802-169c35e3da6b",
                    "student": {
                        "id": "3c0f817b-de41-4087-8c9c-c66bea445f69",
                        "userId": "d930d04f-5ebc-4fa3-b9d8-fde94b298a70",
                        "firstName": "Abdulloh",
                        "lastName": "Ummatov",
                        "phone": "916102142",
                        "email": "cdscdswcdscsdc@gmail.com",
                        "birthDay": "2025-10-06T00:00:00.000Z",
                        "father": "",
                        "image": null,
                        "createdAt": "2025-10-21T18:33:23.514Z"
                    },
                    "group": {
                        "id": "d8d9c908-d4f5-4131-8348-84b28de821a9",
                        "name": "Fayzillo Ummatov",
                        "startDate": "2025-10-24T18:51:00.000Z",
                        "isStart": true,
                        "isEnd": false,
                        "inActive": true,
                        "course": {
                            "id": "5a39512b-46cf-45fb-a9b8-1d46c22db4d9",
                            "name": "CRM",
                            "price": 150000
                        },
                        "rom": {
                            "id": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
                            "name": "Salo",
                            "romNumber": 1
                        },
                        "teacher": {
                            "id": "86a20fcf-9d66-416b-936a-f9722c411930",
                            "userId": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                            "isDeleted": false,
                            "role": "TEACHER",
                            "user": {
                                "firstName": "Fayzillo",
                                "lastName": "Ummatov",
                                "email": "ummatovfayzilllo@gmail.com",
                                "phone": "916102141"
                            }
                        },
                        "lessons": [
                            {
                                "id": "c9ba50c0-85fb-443e-85f8-47d2473e59e0",
                                "groupId": "d8d9c908-d4f5-4131-8348-84b28de821a9",
                                "lessonNumber": 1,
                                "startDate": "2025-10-23T03:00:00.000Z",
                                "endDate": "2025-10-23T04:30:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            },
                            {
                                "id": "ab315d3b-8f7c-48ba-b2c9-2b9f9a9295ee",
                                "groupId": "d8d9c908-d4f5-4131-8348-84b28de821a9",
                                "lessonNumber": 2,
                                "startDate": "2025-10-24T03:00:00.000Z",
                                "endDate": "2025-10-24T04:30:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            },
                            {
                                "id": "bbee5c39-7709-4d7a-9b07-11b826feb89f",
                                "groupId": "d8d9c908-d4f5-4131-8348-84b28de821a9",
                                "lessonNumber": 3,
                                "startDate": "2025-10-23T03:00:00.000Z",
                                "endDate": "2025-10-23T04:30:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            }
                        ]
                    }
                },
                {
                    "id": "813dd5fe-a4d2-4ffe-b344-3fd4160cf42b",
                    "student": {
                        "id": "78519ebe-5a96-4bbf-b11d-50207e46e630",
                        "userId": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                        "firstName": "Fayzillo",
                        "lastName": "Ummatov",
                        "phone": "916102141",
                        "email": "ummatovfayzilllo@gmail.com",
                        "birthDay": "1995-12-29T00:00:00.000Z",
                        "father": "XsaSxXcdsc dscdscda",
                        "image": null,
                        "createdAt": "2025-10-21T18:27:23.827Z"
                    },
                    "group": {
                        "id": "dccf53de-fc1b-40bd-8b4b-50ba61aefe5a",
                        "name": "FN3",
                        "startDate": "2025-10-22T05:30:00.000Z",
                        "isStart": true,
                        "isEnd": false,
                        "inActive": true,
                        "course": {
                            "id": "5a39512b-46cf-45fb-a9b8-1d46c22db4d9",
                            "name": "CRM",
                            "price": 150000
                        },
                        "rom": {
                            "id": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
                            "name": "Salo",
                            "romNumber": 1
                        },
                        "teacher": {
                            "id": "86a20fcf-9d66-416b-936a-f9722c411930",
                            "userId": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                            "isDeleted": false,
                            "role": "TEACHER",
                            "user": {
                                "firstName": "Fayzillo",
                                "lastName": "Ummatov",
                                "email": "ummatovfayzilllo@gmail.com",
                                "phone": "916102141"
                            }
                        },
                        "lessons": [
                            {
                                "id": "0f734490-4adc-4d74-8534-ac53e5ecdebd",
                                "groupId": "dccf53de-fc1b-40bd-8b4b-50ba61aefe5a",
                                "lessonNumber": 1,
                                "startDate": "2025-10-21T19:35:00.000Z",
                                "endDate": "2025-10-21T21:05:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            }
                        ]
                    }
                },
                {
                    "id": "9515f995-1142-49ea-ac8d-23a0aee7a311",
                    "student": {
                        "id": "78519ebe-5a96-4bbf-b11d-50207e46e630",
                        "userId": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                        "firstName": "Fayzillo",
                        "lastName": "Ummatov",
                        "phone": "916102141",
                        "email": "ummatovfayzilllo@gmail.com",
                        "birthDay": "1995-12-29T00:00:00.000Z",
                        "father": "XsaSxXcdsc dscdscda",
                        "image": null,
                        "createdAt": "2025-10-21T18:27:23.827Z"
                    },
                    "group": {
                        "id": "d8d9c908-d4f5-4131-8348-84b28de821a9",
                        "name": "Fayzillo Ummatov",
                        "startDate": "2025-10-24T18:51:00.000Z",
                        "isStart": true,
                        "isEnd": false,
                        "inActive": true,
                        "course": {
                            "id": "5a39512b-46cf-45fb-a9b8-1d46c22db4d9",
                            "name": "CRM",
                            "price": 150000
                        },
                        "rom": {
                            "id": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
                            "name": "Salo",
                            "romNumber": 1
                        },
                        "teacher": {
                            "id": "86a20fcf-9d66-416b-936a-f9722c411930",
                            "userId": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
                            "isDeleted": false,
                            "role": "TEACHER",
                            "user": {
                                "firstName": "Fayzillo",
                                "lastName": "Ummatov",
                                "email": "ummatovfayzilllo@gmail.com",
                                "phone": "916102141"
                            }
                        },
                        "lessons": [
                            {
                                "id": "c9ba50c0-85fb-443e-85f8-47d2473e59e0",
                                "groupId": "d8d9c908-d4f5-4131-8348-84b28de821a9",
                                "lessonNumber": 1,
                                "startDate": "2025-10-23T03:00:00.000Z",
                                "endDate": "2025-10-23T04:30:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            },
                            {
                                "id": "ab315d3b-8f7c-48ba-b2c9-2b9f9a9295ee",
                                "groupId": "d8d9c908-d4f5-4131-8348-84b28de821a9",
                                "lessonNumber": 2,
                                "startDate": "2025-10-24T03:00:00.000Z",
                                "endDate": "2025-10-24T04:30:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            },
                            {
                                "id": "bbee5c39-7709-4d7a-9b07-11b826feb89f",
                                "groupId": "d8d9c908-d4f5-4131-8348-84b28de821a9",
                                "lessonNumber": 3,
                                "startDate": "2025-10-23T03:00:00.000Z",
                                "endDate": "2025-10-23T04:30:00.000Z",
                                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                                "isDeleted": false
                            }
                        ]
                    }
                }
            ]
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div>Room page</div>
    )
}

export default RoomPage

### 🤖 ChatGPT:

Zo‘r, bu komponentni to‘g‘rilab, to‘liq ishlaydigan holatga keltiramiz ⚙️  

Hozir kodda bir nechta muammo bor:  
- `params` bu **Promise emas**, balki `Next.js` serverdan **synchronous obyekt** sifatida keladi.  
- `React.use(params)` degan narsa mavjud emas.  
- `fetchData` ichida `res` o‘rniga soxta `target` obyekt turibdi (test maqsadida ishlatilgan).  
- `useEffect` ichida `lidId` dependency qo‘shilmagan.  

Shuning uchun to‘g‘ri versiyasi quyidagicha bo‘ladi 👇

---

## ✅ To‘g‘rilangan `app/lids/[lidId]/page.tsx`

```tsx
"use client"

import React, { useEffect, useState } from "react"
import { StudentGroupes } from "@/features"
import { StudentGroupStats } from "@/types" // biz ilgari yozgan type
import { useParams } from "next/navigation"

function RoomPage() {
  const params = useParams()
  const lidId = params?.lidId as string

  const [data, setData] = useState<StudentGroupStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await StudentGroupes.getFullStatistika(lidId)
      setData(res)
    } catch (err: any) {
      console.error(err)
      setError("Ma’lumotlarni olishda xatolik yuz berdi.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (lidId) fetchData()
  }, [lidId])

  if (loading) return <div className="p-4 text-gray-500">Yuklanmoqda...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Xona statistikasi</h1>

      {data.map((item) => (
        <div
          key={item.id}
          className="border rounded-xl p-4 shadow-sm bg-white"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">
              {item.student.firstName} {item.student.lastName}
            </p>
            <p className="text-sm text-gray-500">{item.student.phone}</p>
          </div>

          <div className="text-sm text-gray-600">
            <p>📘 Guruh: {item.group.name}</p>
            <p>📗 Kurs: {item.group.course.name}</p>
            <p>👨‍🏫 O‘qituvchi: {item.group.teacher.user.firstName} {item.group.teacher.user.lastName}</p>
            <p>📅 Boshlangan sana: {new Date(item.group.startDate).toLocaleDateString()}</p>
            <p>📊 Darslar soni: {item.group.lessons.length}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RoomPage
```

---

### 🧠 Asosiy izohlar:
- `useParams()` — Next.js 13+ `app` routing uchun `lidId` ni olish usuli.  
- `StudentGroupes.getFullStatistika(lidId)` — backend endpointni chaqiradi.  
- Har bir `studentGroup` uchun karta (`div`) ko‘rinishida render qilinadi.  
- UI soddaligi uchun Tailwind klasslar ishlatilgan.

---

Xohlaysanmi, endi shu ma’lumotni (`data`) **guruhlar bo‘yicha yoki o‘qituvchi bo‘yicha guruhlab chiqaradigan** (masalan: har bir teacher uchun alohida blok) versiyasini ham yozay?

---

### 👤 Foydalanuvchi:

import { StudentGroupStats } from "@/types" // biz ilgari yozgan type

buni yozib ber

### 🤖 ChatGPT:

Albatta ✅  
Quyida `StudentGroupStats` uchun **to‘liq type definitsiya**ni beraman — bu `getAllStatistika()` funksiyangdan keladigan ma’lumotlar strukturasi bilan to‘liq mos.

---

## 📁 `@/types/index.ts` (yoki `studentGroup.ts` ichiga yozish mumkin)

```ts
export interface StudentGroupStats {
  id: string
  isDeleted: boolean
  studentId: string
  groupId: string

  student: {
    id: string
    userId: string
    role: "ADMIN" | "TEACHER" | "ASISTANT" | "STUDENT"
    isDeleted: boolean
    user: {
      id: string
      email: string
      phone?: string | null
      password?: string
      firstName: string
      lastName: string
      image?: string | null
      birthDay: string
      createdAt: string
      father?: string | null
    }
  }

  group: {
    id: string
    name: string
    teacherId: string
    courseId: string
    romId: string
    inActive: boolean
    isEnd: boolean
    isStart: boolean
    startDate: string
    isDeleted: boolean

    teacher: {
      id: string
      userId: string
      role: "ADMIN" | "TEACHER" | "ASISTANT" | "STUDENT"
      isDeleted: boolean
      user: {
        id: string
        email: string
        phone?: string | null
        firstName: string
        lastName: string
        image?: string | null
        birthDay: string
        createdAt: string
        father?: string | null
      }
    }

    course: {
      id: string
      name: string
      price: number
      published: boolean
      durationMont: number
      weekDays: number[]
      durationMinut: number
      image?: string | null
      isDeleted: boolean
    }

    rom: {
      id: string
      name: string
      romNumber: number
      pleaces: number
      isOpen: boolean
      isDeleted: boolean
    }

    lessons: {
      id: string
      groupId: string
      teacherId: string
      lessonNumber: number
      startDate: string
      endDate: string
      isDeleted: boolean
    }[]
  }
}
```

---

### 🧠 Izoh:
Bu type:
- `studentGroup.findMany()` natijasini to‘liq ifodalaydi;  
- ichida `student`, `group`, `teacher`, `course`, `rom`, va `lessons` aloqalari mavjud;  
- barcha `DateTime` tipidagi qiymatlar **string** ko‘rinishida qaytadi (API orqali kelgani uchun).

---

Agar xohlasang, men shu `type`dan `RoomStats` yoki `TeacherStats` kabi soddalashtirilgan variantlar (frontend uchun tayyorlangan, minimal maydonli) ni ham chiqarib bera olaman — shunda komponentlar faqat kerakli maydonlarni ishlatadi. Shu kerakmi?

---

### 👤 Foydalanuvchi:

export type StudentGroupStats = {
    "id": "ea669709-73f0-4aba-b0bb-6a8429a7c1ee",
    "student": {
        "id": "3c0f817b-de41-4087-8c9c-c66bea445f69",
        "userId": "d930d04f-5ebc-4fa3-b9d8-fde94b298a70",
        "firstName": "Abdulloh",
        "lastName": "Ummatov",
        "phone": "916102142",
        "email": "cdscdswcdscsdc@gmail.com",
        "birthDay": "2025-10-06T00:00:00.000Z",
        "father": "",
        "image": null,
        "createdAt": "2025-10-21T18:33:23.514Z"
    },
    "group": {
        "id": "dccf53de-fc1b-40bd-8b4b-50ba61aefe5a",
        "name": "FN3",
        "startDate": "2025-10-22T05:30:00.000Z",
        "isStart": true,
        "isEnd": false,
        "inActive": true,
        "course": {
            "id": "5a39512b-46cf-45fb-a9b8-1d46c22db4d9",
            "name": "CRM",
            "price": 150000
        },
        "rom": {
            "id": "f50ef263-e4fd-4c61-88b4-391bc1d11755",
            "name": "Salo",
            "romNumber": 1
        },
        "teacher": {
            "id": "86a20fcf-9d66-416b-936a-f9722c411930",
            "userId": "2af93ed8-2130-454d-adc9-34fb7bbe4cc4",
            "isDeleted": false,
            "role": "TEACHER",
            "user": {
                "firstName": "Fayzillo",
                "lastName": "Ummatov",
                "email": "ummatovfayzilllo@gmail.com",
                "phone": "916102141"
            }
        },
        "lessons": [
            {
                "id": "0f734490-4adc-4d74-8534-ac53e5ecdebd",
                "groupId": "dccf53de-fc1b-40bd-8b4b-50ba61aefe5a",
                "lessonNumber": 1,
                "startDate": "2025-10-21T19:35:00.000Z",
                "endDate": "2025-10-21T21:05:00.000Z",
                "teacherId": "86a20fcf-9d66-416b-936a-f9722c411930",
                "isDeleted": false
            }
        ]
    }
}

### 🤖 ChatGPT:

Ajoyib 👌  
Endi senga kerak bo‘lgan `type` — bu **shu JSON formatiga to‘liq mos TypeScript tipi**. Quyidagini to‘g‘ridan-to‘g‘ri `@/types/index.ts` fayliga qo‘shishing mumkin 👇  

---

### 📄 `@/types/index.ts`
```ts
export type StudentGroupStats = {
  id: string

  student: {
    id: string
    userId: string
    firstName: string
    lastName: string
    phone: string
    email: string
    birthDay: string
    father: string | null
    image: string | null
    createdAt: string
  }

  group: {
    id: string
    name: string
    startDate: string
    isStart: boolean
    isEnd: boolean
    inActive: boolean

    course: {
      id: string
      name: string
      price: number
    }

    rom: {
      id: string
      name: string
      romNumber: number
    }

    teacher: {
      id: string
      userId: string
      isDeleted: boolean
      role: "ADMIN" | "TEACHER" | "ASISTANT" | "STUDENT"
      user: {
        firstName: string
        lastName: string
        email: string
        phone: string
      }
    }

    lessons: {
      id: string
      groupId: string
      lessonNumber: number
      startDate: string
      endDate: string
      teacherId: string
      isDeleted: boolean
    }[]
  }
}
```

---

### 🧩 Qisqacha izoh:
- Har bir `StudentGroupStats` — bitta **talaba-guruh bog‘lanmasi**ni bildiradi.  
- Ichida `student`, `group`, `teacher`, `course`, `rom`, `lessons` mavjud.  
- Barcha `DateTime` qiymatlar **string** ko‘rinishida qaytadi (JSON API uchun).  
- `role` Prisma `enum RoleStafs` bilan to‘g‘ri mos.

---

Xohlaysanmi, men senga shu `getAllStatistika()` funksiyani ham shu strukturaga mos qilib tozalab, `return` bilan yakunlangan holatda yozib beray? (ya’ni backend uchun to‘liq ishlaydigan shaklda).

---

### 👤 Foydalanuvchi:

"use client"

import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Lesson, Staff } from "@/types"
import React, { useEffect, useMemo, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Attendentionals, Staffs } from "@/features"
import CreateAttendence from "@/components/modal/CreateAttendence"

interface LessonPageParamsType {
  params: Promise<{ lessonid: string }>
}

function LessonPage({ params }: LessonPageParamsType) {
  const { lessonid } = React.use(params)
  const router = useRouter()
  const { lessons, error: LessonsError, loading: LessonsLoading } = useAllFetchedData()
  const [students, setStudents] = useState<Staff[]>([])
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true)
  const { selectedGroupId } = useSelectedStore()

  // === Lessonni topish ===
  const lesson: Lesson | undefined = useMemo(() => {
    return lessons.find((l) => l.id === lessonid)
  }, [lessons, lessonid])

  // 🟢 Default attendance yozuvlarini yaratish
  const handleDefaultCreateAttendence = async (studentsList: Staff[]) => {
    if (!lesson || studentsList.length === 0) return

    try {
      // Agar lessonda hali davomat mavjud bo‘lmasa — yangi yozuvlar yaratamiz
      if (!lesson.attendCount || lesson.attendCount < studentsList.length) {
        const payload = {
          lessonId: lesson.id,
          attendances: studentsList.map((s) => ({
            studentId: s.id,
            kelgan: false,
          })),
        }

        await Attendentionals.createAttendentional(payload)
        console.log("✅ Default attendance yozuvlari yaratildi")
      }
    } catch (error) {
      console.error("Davomatni yaratishda xatolik:", error)
    }
  }

  // === Talabalarni olish ===
  const fetchStudents = async () => {
      console.log("Fetch studets",selectedGroupId)
    if (!selectedGroupId) return
    try {
      setLoadingStudents(true)
      const res = await Staffs.getStudentsByGroupId(selectedGroupId)
      console.log(res)
      setStudents(res)
      await handleDefaultCreateAttendence(res)
      setLoadingStudents(false)
    } catch (error) {
      console.error("Talabalarni olishda xatolik:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [lessonid, selectedGroupId])

  // === Error holatlari ===
  if (LessonsError) {
    return (
      <h1 className="text-center text-red-500 mt-10">
        ❌ Lesson yuklashda xatolik!
      </h1>
    )
  }

  if (LessonsLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <CircularProgress size={80} />
        <p className="ml-3 text-lg">Dars yuklanmoqda...</p>
      </div>
    )
  }
  if(!lesson){
    return <p>Lesson topilmadi</p>
  }

  // === Sahifa render ===
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 space-y-6">
      {/* Dars tafsilotlari */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative">
        {/* Ortga qaytish */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Ortga
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🧾 Dars tafsilotlari
        </h1>

        {/* Lesson ma’lumotlari */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700 w-full">
          <div>
            <p className="font-medium">📚 Dars raqami:</p>
            <p>{lesson.lessonNumber}</p>
          </div>
          <div>
            <p className="font-medium">👨‍🏫 O‘qituvchi:</p>
            <p>{lesson.teacherName}</p>
          </div>
          <div>
            <p className="font-medium">🏫 Guruh:</p>
            <p>{lesson.groupName}</p>
          </div>
          <div>
            <p className="font-medium">🏠 Xona:</p>
            <p>
              {lesson.roomName} #{lesson.roomNumber}
            </p>
          </div>
          <div>
            <p className="font-medium">🕓 Boshlanish:</p>
            <p>{new Date(lesson.startDate).toLocaleString("uz-UZ")}</p>
          </div>
          <div>
            <p className="font-medium">🕒 Tugash:</p>
            <p>
              {lesson.endDate
                ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                : "–"}
            </p>
          </div>
          <div>
            <p className="font-medium">👥 O‘quvchilar soni:</p>
            <p>{lesson.studentsCount}</p>
          </div>
          <div>
            <p className="font-medium">✅ Davomat qilganlar:</p>
            <p>{lesson.attendCount}</p>
          </div>
          <div>
            <p className="font-medium">📅 Status:</p>
            <p
              className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                lesson.isDeleted
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {lesson.isDeleted ? "❌ O‘chirilgan" : "✅ Faol"}
            </p>
          </div>
        </div>
      </div>

      {/* Talabalar ro‘yxati */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🎓 Talabalar ro‘yxati
        </h2>

        {loadingStudents ? (
          <div className="flex justify-center py-6 text-gray-500">
            <CircularProgress size={50} />
          </div>
        ) : students.length === 0 ? (
          <p className="text-gray-500 text-center">Talabalar topilmadi.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Ism familiya</th>
                <th className="px-4 py-2 text-left">Telefon</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Tug‘ilgan sana</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={student.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 flex items-center gap-3">
                    <img
                      src={
                        student.user.image
                          ? `http://localhost:15976/${student.user.image}`
                          : "https://via.placeholder.com/40"
                      }
                      alt={student.user.firstName}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span>{student.user.fullName}</span>
                  </td>
                  <td className="px-4 py-2">{student.user.phone}</td>
                  <td className="px-4 py-2">{student.user.email}</td>
                  <td className="px-4 py-2">
                    {new Date(student.user.birthDay).toLocaleDateString("uz-UZ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Davomatni boshqarish */}
      <div>
        <CreateAttendence lessonId={lessonid} students={students} />
      </div>
    </div>
  )
}

export default LessonPage

### 🤖 ChatGPT:

Bu komponenting juda yaxshi tuzilgan — ammo bir nechta **xatoliklar va optimizatsiya nuqtalari** bor. Quyida to‘liq tahlil + to‘g‘rilangan kodni keltiraman 👇  

---

## 🧩 Asosiy xatoliklar
### 1. `React.use(params)` — ❌ noto‘g‘ri
Bu joyda `params` dan destructure qilish kerak, `React.use` funksiyasi yo‘q.  
✅ To‘g‘risi:
```ts
const { lessonid } = await params
```
Yoki agar `params` Promise bo‘lsa, uni `useEffect` ichida resolve qilish kerak.

### 2. `params` tipida `Promise` bo‘lishi shart emas
Next.js `app` routerda `params` hech qachon Promise bo‘lmaydi, balki to‘g‘ridan-to‘g‘ri obyekt bo‘ladi:
```ts
interface LessonPageParamsType {
  params: { lessonid: string }
}
```

### 3. `fetchStudents()` chaqirilganda `lessonid` yoki `selectedGroupId` bo‘lmasa `setLoadingStudents(false)` bajarilmaydi  
Shuning uchun `try...finally` ishlatish — yaxshi, lekin `if (!selectedGroupId)` shartida ham `setLoadingStudents(false)` kerak.

---

## ✨ To‘g‘rilangan versiya (ishlaydigan)
```tsx
"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Lesson, Staff } from "@/types"
import { CircularProgress } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Attendentionals, Staffs } from "@/features"
import CreateAttendence from "@/components/modal/CreateAttendence"

interface LessonPageParamsType {
  params: { lessonid: string }
}

function LessonPage({ params }: LessonPageParamsType) {
  const { lessonid } = params
  const router = useRouter()
  const { lessons, error: LessonsError, loading: LessonsLoading } = useAllFetchedData()
  const { selectedGroupId } = useSelectedStore()

  const [students, setStudents] = useState<Staff[]>([])
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true)

  // === Lessonni topish ===
  const lesson: Lesson | undefined = useMemo(() => {
    return lessons.find((l) => l.id === lessonid)
  }, [lessons, lessonid])

  // 🟢 Default attendance yozuvlarini yaratish
  const handleDefaultCreateAttendence = async (studentsList: Staff[]) => {
    if (!lesson || studentsList.length === 0) return

    try {
      if (!lesson.attendCount || lesson.attendCount < studentsList.length) {
        const payload = {
          lessonId: lesson.id,
          attendances: studentsList.map((s) => ({
            studentId: s.id,
            kelgan: false,
          })),
        }

        await Attendentionals.createAttendentional(payload)
        console.log("✅ Default attendance yozuvlari yaratildi")
      }
    } catch (error) {
      console.error("Davomatni yaratishda xatolik:", error)
    }
  }

  // === Talabalarni olish ===
  const fetchStudents = async () => {
    if (!selectedGroupId) {
      setLoadingStudents(false)
      return
    }

    try {
      setLoadingStudents(true)
      const res = await Staffs.getStudentsByGroupId(selectedGroupId)
      console.log("Fetched students:", res)
      setStudents(res)
      await handleDefaultCreateAttendence(res)
    } catch (error) {
      console.error("Talabalarni olishda xatolik:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [lessonid, selectedGroupId])

  // === Error holatlari ===
  if (LessonsError) {
    return (
      <h1 className="text-center text-red-500 mt-10">
        ❌ Lesson yuklashda xatolik!
      </h1>
    )
  }

  if (LessonsLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <CircularProgress size={80} />
        <p className="ml-3 text-lg">Dars yuklanmoqda...</p>
      </div>
    )
  }

  if (!lesson) {
    return <p className="text-center mt-10 text-gray-600">Lesson topilmadi.</p>
  }

  // === Sahifa render ===
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 space-y-6">
      {/* Dars tafsilotlari */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Ortga
        </button>

        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🧾 Dars tafsilotlari
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700 w-full">
          <div>
            <p className="font-medium">📚 Dars raqami:</p>
            <p>{lesson.lessonNumber}</p>
          </div>
          <div>
            <p className="font-medium">👨‍🏫 O‘qituvchi:</p>
            <p>{lesson.teacherName}</p>
          </div>
          <div>
            <p className="font-medium">🏫 Guruh:</p>
            <p>{lesson.groupName}</p>
          </div>
          <div>
            <p className="font-medium">🏠 Xona:</p>
            <p>
              {lesson.roomName} #{lesson.roomNumber}
            </p>
          </div>
          <div>
            <p className="font-medium">🕓 Boshlanish:</p>
            <p>{new Date(lesson.startDate).toLocaleString("uz-UZ")}</p>
          </div>
          <div>
            <p className="font-medium">🕒 Tugash:</p>
            <p>
              {lesson.endDate
                ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                : "–"}
            </p>
          </div>


---

### 👤 Foydalanuvchi:




Nega Talabalar ro'yhatini yuklash to'xtamaybdi

### 🤖 ChatGPT:

Zo‘r savol — bu simptom **`CircularProgress` doimo aylanib turadi** degani, ya’ni:  

👉 `loadingStudents` **`true`** holatda qolib ketmoqda.  

Keling, buni bosqichma-bosqich tahlil qilamiz 👇  

---

## 🧩 1. Muammo manbasi
Sening kodda shu joyda:
```ts
useEffect(() => {
  fetchStudents()
}, [lessonid, selectedGroupId])
```

va `fetchStudents` quyidagicha:
```ts
const fetchStudents = async () => {
  console.log("Fetch studets", selectedGroupId)
  if (!selectedGroupId) return
  try {
    setLoadingStudents(true)
    const res = await Staffs.getStudentsByGroupId(selectedGroupId)
    console.log(res)
    setStudents(res)
    await handleDefaultCreateAttendence(res)
    setLoadingStudents(false)
  } catch (error) {
    console.error("Talabalarni olishda xatolik:", error)
  } finally {
    setLoadingStudents(false)
  }
}
```

Ko‘ryapsanmi?  
Agar `selectedGroupId` **`undefined` yoki null** bo‘lsa —  
`return` qilinadi, **lekin `setLoadingStudents(false)`** ishlamaydi ❌  

Natijada `loadingStudents` doimo `true` bo‘lib qoladi,  
va progress spinner hech qachon to‘xtamaydi.

---

## ✅ To‘g‘rilash

```ts
const fetchStudents = async () => {
  console.log("Fetch students:", selectedGroupId)
  if (!selectedGroupId) {
    setLoadingStudents(false) // 🧩 shu kerak
    return
  }

  try {
    setLoadingStudents(true)
    const res = await Staffs.getStudentsByGroupId(selectedGroupId)
    console.log("Fetched students:", res)
    setStudents(res)
    await handleDefaultCreateAttendence(res)
  } catch (error) {
    console.error("Talabalarni olishda xatolik:", error)
  } finally {
    setLoadingStudents(false)
  }
}
```

---

## 🧠 2. Qo‘shimcha tekshirishlar

Agar shunga qaramay spinner aylanayotgan bo‘lsa:
1. `selectedGroupId` qiymatini `console.log` bilan tekshir:
   ```ts
   console.log("selectedGroupId:", selectedGroupId)
   ```
   Agar `undefined` bo‘lsa — `useSelectedStore` hali ma’lumot yuklamagan.
   > Masalan, `selectedGroupId` hali tanlanmagan yoki store hali init bo‘lmagan.

2. `Staffs.getStudentsByGroupId` promise hech qachon **resolve** yoki **reject** qilmasligi ham mumkin.  
   Shunda `finally` ishlamaydi.  
   → Buni ham log bilan tekshir:
   ```ts
   console.log("Before fetch");
   const res = await Staffs.getStudentsByGroupId(selectedGroupId);
   console.log("After fetch");
   ```

Agar `After fetch` hech chiqmasa — `Staffs.getStudentsByGroupId` ichida `await fetch(...)` yoki `axios.get(...)` osilib qolgan.

---

Agar xohlaysan, men senga `Staffs.getStudentsByGroupId` funksiyani ko‘rsatganingdan so‘ng — aynan **qayerda promise to‘xtab qolayotganini** topib beraman.  
Shuni yubor:  
```ts
Staffs.getStudentsByGroupId
```
funksiya kodi.

---

### 👤 Foydalanuvchi:

"use client"

import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Lesson, Staff } from "@/types"
import React, { useEffect, useMemo, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Attendentionals, Staffs } from "@/features"
import CreateAttendence from "@/components/modal/CreateAttendence"

interface LessonPageParamsType {
  params: Promise<{ lessonid: string }>
}

function LessonPage({ params }: LessonPageParamsType) {
  const { lessonid } = React.use(params)
  const router = useRouter()
  const { lessons, error: LessonsError, loading: LessonsLoading } = useAllFetchedData()
  const [students, setStudents] = useState<Staff[]>([])
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true)
  const { selectedGroupId } = useSelectedStore()

  // === Lessonni topish ===
  const lesson: Lesson | undefined = useMemo(() => {
    return lessons.find((l) => l.id === lessonid)
  }, [lessons, lessonid])

  // 🟢 Default attendance yozuvlarini yaratish
  const handleDefaultCreateAttendence = async (studentsList: Staff[]) => {
    if (!lesson || studentsList.length === 0) return

    try {
      // Agar lessonda hali davomat mavjud bo‘lmasa — yangi yozuvlar yaratamiz
      if (!lesson.attendCount || lesson.attendCount < studentsList.length) {
        const payload = {
          lessonId: lesson.id,
          attendances: studentsList.map((s) => ({
            studentId: s.id,
            kelgan: false,
          })),
        }

        await Attendentionals.createAttendentional(payload)
        console.log("✅ Default attendance yozuvlari yaratildi")
      }
    } catch (error) {
      console.error("Davomatni yaratishda xatolik:", error)
    }
  }

  // === Talabalarni olish ===
  const fetchStudents = async () => {
    console.log("Fetch studets", selectedGroupId)
    if (!selectedGroupId) {
      setLoadingStudents(false)
      return
    }
    try {
      setLoadingStudents(true)
      const res = await Staffs.getStudentsByGroupId(selectedGroupId)
      console.log(res)
      setStudents(res)
      await handleDefaultCreateAttendence(res)
      setLoadingStudents(false)
    } catch (error) {
      console.error("Talabalarni olishda xatolik:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [lessonid, selectedGroupId])

  // === Error holatlari ===
  if (LessonsError) {
    return (
      <h1 className="text-center text-red-500 mt-10">
        ❌ Lesson yuklashda xatolik!
      </h1>
    )
  }

  if (LessonsLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <CircularProgress size={80} />
        <p className="ml-3 text-lg">Dars yuklanmoqda...</p>
      </div>
    )
  }
  if (!lesson) {
    return <p>Lesson topilmadi</p>
  }

  // === Sahifa render ===
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 space-y-6">
      {/* Dars tafsilotlari */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative">
        {/* Ortga qaytish */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Ortga
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🧾 Dars tafsilotlari
        </h1>

        {/* Lesson ma’lumotlari */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700 w-full">
          <div>
            <p className="font-medium">📚 Dars raqami:</p>
            <p>{lesson.lessonNumber}</p>
          </div>
          <div>
            <p className="font-medium">👨‍🏫 O‘qituvchi:</p>
            <p>{lesson.teacherName}</p>
          </div>
          <div>
            <p className="font-medium">🏫 Guruh:</p>
            <p>{lesson.groupName}</p>
          </div>
          <div>
            <p className="font-medium">🏠 Xona:</p>
            <p>
              {lesson.roomName} #{lesson.roomNumber}
            </p>
          </div>
          <div>
            <p className="font-medium">🕓 Boshlanish:</p>
            <p>{new Date(lesson.startDate).toLocaleString("uz-UZ")}</p>
          </div>
          <div>
            <p className="font-medium">🕒 Tugash:</p>
            <p>
              {lesson.endDate
                ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                : "–"}
            </p>
          </div>
          <div>
            <p className="font-medium">👥 O‘quvchilar soni:</p>
            <p>{lesson.studentsCount}</p>
          </div>
          <div>
            <p className="font-medium">✅ Davomat qilganlar:</p>
            <p>{lesson.attendCount}</p>
          </div>
          <div>
            <p className="font-medium">📅 Status:</p>
            <p
              className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${lesson.isDeleted
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
                }`}
            >
              {lesson.isDeleted ? "❌ O‘chirilgan" : "✅ Faol"}
            </p>
          </div>
        </div>
      </div>

      {/* Talabalar ro‘yxati */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🎓 Talabalar ro‘yxati
        </h2>

        {loadingStudents ? (
          <div className="flex justify-center py-6 text-gray-500">
            <CircularProgress size={50} />
          </div>
        ) : students.length === 0 ? (
          <p className="text-gray-500 text-center">Talabalar topilmadi.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Ism familiya</th>
                <th className="px-4 py-2 text-left">Telefon</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Tug‘ilgan sana</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={student.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 flex items-center gap-3">
                    <img
                      src={
                        student.user.image
                          ? `http://localhost:15976/${student.user.image}`
                          : "https://via.placeholder.com/40"
                      }
                      alt={student.user.firstName}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span>{student.user.fullName}</span>
                  </td>
                  <td className="px-4 py-2">{student.user.phone}</td>
                  <td className="px-4 py-2">{student.user.email}</td>
                  <td className="px-4 py-2">
                    {new Date(student.user.birthDay).toLocaleDateString("uz-UZ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Davomatni boshqarish */}
      <div>
        <CreateAttendence lessonId={lessonid} students={students} />
      </div>
    </div>
  )
}

export default LessonPage


Talabalar ro'yhatini olib tashla davomat jadvali yetarli

### 🤖 ChatGPT:

Ajoyib ✅ — demak, endi senga **faqat davomat (attendance)** jadvali kerak,  
talabalar ro‘yxatini alohida ko‘rsatish shart emas.  

Shunda kodni **soddalashtirib**, studentlar jadval qismini olib tashlaymiz va `CreateAttendence` komponentini markazda qoldiramiz 👇  

---

### ✳️ To‘g‘rilangan `LessonPage` (talabalar jadvalisiz)

```tsx
"use client"

import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Lesson, Staff } from "@/types"
import React, { useEffect, useMemo, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Attendentionals, Staffs } from "@/features"
import CreateAttendence from "@/components/modal/CreateAttendence"

interface LessonPageParamsType {
  params: Promise<{ lessonid: string }>
}

function LessonPage({ params }: LessonPageParamsType) {
  const { lessonid } = React.use(params)
  const router = useRouter()
  const { lessons, error: LessonsError, loading: LessonsLoading } = useAllFetchedData()
  const [students, setStudents] = useState<Staff[]>([])
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true)
  const { selectedGroupId } = useSelectedStore()

  // === Lessonni topish ===
  const lesson: Lesson | undefined = useMemo(() => {
    return lessons.find((l) => l.id === lessonid)
  }, [lessons, lessonid])

  // === Talabalarni olish ===
  const fetchStudents = async () => {
    console.log("Fetch students", selectedGroupId)
    if (!selectedGroupId) {
      setLoadingStudents(false)
      return
    }
    try {
      setLoadingStudents(true)
      const res = await Staffs.getStudentsByGroupId(selectedGroupId)
      console.log(res)
      setStudents(res)
    } catch (error) {
      console.error("Talabalarni olishda xatolik:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [lessonid, selectedGroupId])

  // === Error holatlari ===
  if (LessonsError) {
    return (
      <h1 className="text-center text-red-500 mt-10">
        ❌ Lesson yuklashda xatolik!
      </h1>
    )
  }

  if (LessonsLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <CircularProgress size={80} />
        <p className="ml-3 text-lg">Dars yuklanmoqda...</p>
      </div>
    )
  }

  if (!lesson) {
    return <p>Lesson topilmadi</p>
  }

  // === Sahifa render ===
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 space-y-6">
      {/* Dars tafsilotlari */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative">
        {/* Ortga qaytish */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Ortga
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🧾 Dars tafsilotlari
        </h1>

        {/* Lesson ma’lumotlari */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700 w-full">
          <div>
            <p className="font-medium">📚 Dars raqami:</p>
            <p>{lesson.lessonNumber}</p>
          </div>
          <div>
            <p className="font-medium">👨‍🏫 O‘qituvchi:</p>
            <p>{lesson.teacherName}</p>
          </div>
          <div>
            <p className="font-medium">🏫 Guruh:</p>
            <p>{lesson.groupName}</p>
          </div>
          <div>
            <p className="font-medium">🏠 Xona:</p>
            <p>
              {lesson.roomName} #{lesson.roomNumber}
            </p>
          </div>
          <div>
            <p className="font-medium">🕓 Boshlanish:</p>
            <p>{new Date(lesson.startDate).toLocaleString("uz-UZ")}</p>
          </div>
          <div>
            <p className="font-medium">🕒 Tugash:</p>
            <p>
              {lesson.endDate
                ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                : "–"}
            </p>
          </div>
          <div>
            <p className="font-medium">👥 O‘quvchilar soni:</p>
            <p>{lesson.studentsCount}</p>
          </div>
          <div>
            <p className="font-medium">✅ Davomat qilganlar:</p>
            <p>{lesson.attendCount}</p>
          </div>
          <div>
            <p className="font-medium">📅 Status:</p>
            <p
              className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                lesson.isDeleted
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {lesson.isDeleted ? "❌ O‘chirilgan" : "✅ Faol"}
            </p>
          </div>
        </div>
      </div>

      {/* 🎯 Davomat jadvali */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          ✅ Davomat
        </h2>

        {loadingStudents ? (
          <div className="flex justify-center py-6 text-gray-500">
            <CircularProgress size={50} />
          </div>
        ) : (
          <CreateAttendence lessonId={lessonid} students={students} />
        )}
      </div>
    </div>
  )
}

export default LessonPage
```

---

### 🔍 O‘zgarishlar:
- `Talabalar ro‘yxati` jadvali butunlay olib tashlandi.
- Endi faqat:
  - Dars tafsilotlari
  - Davomatni boshqarish (`CreateAttendence`)
  - Spinner (talabalar yuklanayotganida)

---

Xohlaysanmi, men `CreateAttendence` komponentni ham senga biroz **yanada interaktiv** (masalan, `switch` yoki `checkbox` orqali belgilanadigan) qilib soddalashtirib beray?

---

### 👤 Foydalanuvchi:

"use client"

import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Lesson, Staff } from "@/types"
import React, { useEffect, useMemo, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Attendentionals, Staffs } from "@/features"
import CreateAttendence from "@/components/modal/CreateAttendence"

interface LessonPageParamsType {
  params: Promise<{ lessonid: string }>
}

function LessonPage({ params }: LessonPageParamsType) {
  const { lessonid } = React.use(params)
  const router = useRouter()
  const { lessons, error: LessonsError, loading: LessonsLoading } = useAllFetchedData()
  const [students, setStudents] = useState<Staff[]>([])
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true)
  const { selectedGroupId } = useSelectedStore()

  // === Lessonni topish ===
  const lesson: Lesson | undefined = useMemo(() => {
    return lessons.find((l) => l.id === lessonid)
  }, [lessons, lessonid])

  // === Talabalarni olish ===
  const fetchStudents = async () => {
    console.log("Fetch students", selectedGroupId)
    if (!selectedGroupId) {
      setLoadingStudents(false)
      return
    }
    try {
      setLoadingStudents(true)
      const res = await Staffs.getStudentsByGroupId(selectedGroupId)
    
      setStudents(res)
    } catch (error) {
      console.error("Talabalarni olishda xatolik:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [lessonid, selectedGroupId])

  // === Error holatlari ===
  if (LessonsError) {
    return (
      <h1 className="text-center text-red-500 mt-10">
        ❌ Lesson yuklashda xatolik!
      </h1>
    )
  }

  if (LessonsLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <CircularProgress size={80} />
        <p className="ml-3 text-lg">Dars yuklanmoqda...</p>
      </div>
    )
  }

  if (!lesson) {
    return <p>Lesson topilmadi</p>
  }

  // === Sahifa render ===
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 space-y-6">
      {/* Dars tafsilotlari */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative">
        {/* Ortga qaytish */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Ortga
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🧾 Dars tafsilotlari
        </h1>

        {/* Lesson ma’lumotlari */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700 w-full">
          <div>
            <p className="font-medium">📚 Dars raqami:</p>
            <p>{lesson.lessonNumber}</p>
          </div>
          <div>
            <p className="font-medium">👨‍🏫 O‘qituvchi:</p>
            <p>{lesson.teacherName}</p>
          </div>
          <div>
            <p className="font-medium">🏫 Guruh:</p>
            <p>{lesson.groupName}</p>
          </div>
          <div>
            <p className="font-medium">🏠 Xona:</p>
            <p>
              {lesson.roomName} #{lesson.roomNumber}
            </p>
          </div>
          <div>
            <p className="font-medium">🕓 Boshlanish:</p>
            <p>{new Date(lesson.startDate).toLocaleString("uz-UZ")}</p>
          </div>
          <div>
            <p className="font-medium">🕒 Tugash:</p>
            <p>
              {lesson.endDate
                ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                : "–"}
            </p>
          </div>
          <div>
            <p className="font-medium">👥 O‘quvchilar soni:</p>
            <p>{lesson.studentsCount}</p>
          </div>
          <div>
            <p className="font-medium">✅ Davomat qilganlar:</p>
            <p>{lesson.attendCount}</p>
          </div>
          <div>
            <p className="font-medium">📅 Status:</p>
            <p
              className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                lesson.isDeleted
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {lesson.isDeleted ? "❌ O‘chirilgan" : "✅ Faol"}
            </p>
          </div>
        </div>
      </div>

      {/* 🎯 Davomat jadvali */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          ✅ Davomat
        </h2>

        {loadingStudents ? (
          <div className="flex justify-center py-6 text-gray-500">
            <CircularProgress size={50} />
          </div>
        ) : (
          <CreateAttendence lessonId={lessonid} students={students} />
        )}
      </div>
    </div>
  )
}

export default LessonPage



bunda lesson topilmadi bo'lib qolayabdi

### 🤖 ChatGPT:

Zo‘r — endi aniqlik kiritamiz 🔍  

Senga `lesson topilmadi` chiqayotganining sababi 99% hollarda quyidagi **4ta sababdan biri** bo‘ladi 👇  

---

### ⚠️ 1. `params` noto‘g‘ri yechilyapti (`Promise` emas)
`Next.js` da `params` bu oddiy obyekt, **Promise emas**.  
Shuning uchun quyidagi qatordagi xato sabab bo‘lmoqda 👇  
```tsx
const { lessonid } = React.use(params)
```

Bu yerda `React.use` degan funksiya umuman mavjud emas — `params` ni **to‘g‘ridan-to‘g‘ri** ochish kerak.  

✅ **To‘g‘ri shakl:**
```tsx
function LessonPage({ params }: { params: { lessonid: string } }) {
  const { lessonid } = params
```

---

### ⚠️ 2. `lessonid` qiymati `undefined`
Agar `lessonid` URL dan kelmayotgan bo‘lsa (masalan `/dashboard/lesson/`),
unda `lessons.find(l => l.id === lessonid)` hech qachon topmaydi.

✅ Tekshirish uchun quyidagini qo‘sh:
```tsx
console.log("Lesson ID:", lessonid)
console.log("Lessons:", lessons)
```

Agar `lessonid` bo‘sh (`undefined`) chiqsa, demak routingda muammo bor.  
Masalan, `app/dashboard/lesson/[lessonid]/page.tsx` fayl tuzilmasi noto‘g‘ri bo‘lishi mumkin.

---

### ⚠️ 3. `useAllFetchedData` hali `lessons`ni yuklamagan
`useAllFetchedData()` global store bo‘lgani uchun, `lessons` hali yuklanmay qolgan bo‘lishi mumkin.  
Buning natijasida `lessons.find()` bo‘sh massivda qidiradi va `undefined` qaytaradi.

✅ Yechim:
```tsx
const lesson: Lesson | undefined = useMemo(() => {
  if (!lessons?.length) return undefined
  return lessons.find((l) => l.id === lessonid)
}, [lessons, lessonid])
```

Va yuklanish paytida:
```tsx
if (LessonsLoading || !lessons.length) {
  return (
    <div className="flex justify-center items-center h-screen text-gray-600">
      <CircularProgress size={80} />
      <p className="ml-3 text-lg">Darslar yuklanmoqda...</p>
    </div>
  )
}
```

---

### ⚠️ 4. `lesson.id` tipi bilan `lessonid` tipi mos emas
Masalan:  
- `lesson.id` → UUID (`"f2c8d0b0-..."`)
- `lessonid` → son yoki string ichida qo‘shimcha belgilar

✅ Tekshir:
```tsx
console.log("lesson.id", lessons.map(l => l.id))
console.log("lessonid", lessonid)
```

Agar farq bo‘lsa (`"id"` oldida yoki keyin bo‘sh joylar, `%22`, yoki `/` belgilar bo‘lsa), uni tozalash kerak:
```tsx
const cleanLessonId = decodeURIComponent(lessonid.trim())
```

---

### ✅ Yakuniy to‘g‘rilangan variant
```tsx
"use client"

import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Lesson, Staff } from "@/types"
import React, { useEffect, useMemo, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Staffs } from "@/features"
import CreateAttendence from "@/components/modal/CreateAttendence"

function LessonPage({ params }: { params: { lessonid: string } }) {
  const { lessonid } = params
  const router = useRouter()
  const { lessons, error: LessonsError, loading: LessonsLoading } = useAllFetchedData()
  const [students, setStudents] = useState<Staff[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const { selectedGroupId } = useSelectedStore()

  console.log("Lesson ID:", lessonid)
  console.log("Lessons:", lessons)

  const lesson = useMemo(() => {
    if (!lessons?.length) return undefined
    return lessons.find((l) => l.id === lessonid)
  }, [lessons, lessonid])

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedGroupId) {
        setLoadingStudents(false)
        return
      }
      try {
        setLoadingStudents(true)
        const res = await Staffs.getStudentsByGroupId(selectedGroupId)
        setStudents(res)
      } catch (error) {
        console.error("Talabalarni olishda xatolik:", error)
      } finally {
        setLoadingStudents(false)
      }
    }
    fetchStudents()
  }, [lessonid, selectedGroupId])

  if (LessonsError) return <h1 className="text-center text-red-500 mt-10">❌ Lesson yuklashda xatolik!</h1>
  if (LessonsLoading || !lessons.length) return (
    <div className="flex justify-center items-center h-screen text-gray-600">
      <CircularProgress size={80} />
      <p className="ml-3 text-lg">Darslar yuklanmoqda...</p>
    </div>
  )

  if (!lesson) return <p className="text-center text-gray-600 mt-10">Lesson topilmadi</p>

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative">
        <button onClick={() => router.back()} className="absolute top-4 left-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition">
          <ArrowLeft className="w-5 h-5" /> Ortga
        </button>
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">🧾 Dars tafsilotlari</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700 w-full">
          <div><p className="font-medium">📚 Dars raqami:</p><p>{lesson.lessonNumber}</p></div>
          <div><p className="font-medium">👨‍🏫 O‘qituvchi:</p><p>{lesson.teacherName}</p></div>
          <div><p className="font-medium">🏫 Guruh:</p><p>{lesson.groupName}</p></div>
          <div><p className="font-medium">🏠 Xona:</p><p>{lesson.roomName} #{lesson.roomNumber}</p></div>
          <div><p className="font-medium">🕓 Boshlanish:</p><p>{new Date(lesson.startDate).toLocaleString("uz-UZ")}</p></div>
          <div><p className="font-medium">🕒 Tugash:</p><p>{lesson.endDate ? new Date(lesson.endDate).toLocaleString("uz-UZ") : "–"}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">✅ Davomat</h2>
        {loadingStudents ? (
          <div className="flex justify-center py-6 text-gray-500">
            <CircularProgress size={50} />
          </div>
        ) : (
          <CreateAttendence lessonId={lessonid} students={students} />
        )}
      </div>
    </div>
  )
}

export default LessonPage
```

---

Agar xohlasang, men senga `console.log` lar orqali **aniq qaysi nuqtada lesson topilmayotgani**ni aniqlaydigan mini debug variantini ham yozib beraman — shunda muammo joyini 10 soniyada topamiz. Shuni yozaymi?

---

### 👤 Foydalanuvchi:

"use client"

import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Lesson, Staff } from "@/types"
import React, { useEffect, useMemo, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Attendentionals, Lessons, Staffs } from "@/features"
import CreateAttendence from "@/components/modal/CreateAttendence"

interface LessonPageParamsType {
  params: Promise<{ lessonid: string }>
}

function LessonPage({ params }: LessonPageParamsType) {
  const { lessonid } = React.use(params)
  const router = useRouter()
  const { lessons, error: LessonsError, loading: LessonsLoading } = useAllFetchedData()
  const [students, setStudents] = useState<Staff[]>([])
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true)
  const { selectedGroupId } = useSelectedStore()
  
  // === Lessonni topish ===
  const lesson: Lesson | undefined = useMemo(() => {
    return lessons.find((l) => l.id == lessonid)
  }, [lessons, lessonid])

  const fetchLesson = async () => {
    const lesson = Lessons.getLessonById(lessonid)
    setLe
  }

  // === Talabalarni olish ===
  const fetchStudents = async () => {
    console.log("Fetch students", selectedGroupId)
    if (!selectedGroupId) {
      setLoadingStudents(false)
      return
    }
    try {
      setLoadingStudents(true)
      const res = await Staffs.getStudentsByGroupId(selectedGroupId)
    
      setStudents(res)
    } catch (error) {
      console.error("Talabalarni olishda xatolik:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [lessonid, selectedGroupId])

  // === Error holatlari ===
  if (LessonsError) {
    return (
      <h1 className="text-center text-red-500 mt-10">
        ❌ Lesson yuklashda xatolik!
      </h1>
    )
  }

  if (LessonsLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <CircularProgress size={80} />
        <p className="ml-3 text-lg">Dars yuklanmoqda...</p>
      </div>
    )
  }

  if (!lesson) {
    return <p>Lesson topilmadi</p>
  }

  // === Sahifa render ===
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 space-y-6">
      {/* Dars tafsilotlari */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative">
        {/* Ortga qaytish */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Ortga
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🧾 Dars tafsilotlari
        </h1>

        {/* Lesson ma’lumotlari */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700 w-full">
          <div>
            <p className="font-medium">📚 Dars raqami:</p>
            <p>{lesson.lessonNumber}</p>
          </div>
          <div>
            <p className="font-medium">👨‍🏫 O‘qituvchi:</p>
            <p>{lesson.teacherName}</p>
          </div>
          <div>
            <p className="font-medium">🏫 Guruh:</p>
            <p>{lesson.groupName}</p>
          </div>
          <div>
            <p className="font-medium">🏠 Xona:</p>
            <p>
              {lesson.roomName} #{lesson.roomNumber}
            </p>
          </div>
          <div>
            <p className="font-medium">🕓 Boshlanish:</p>
            <p>{new Date(lesson.startDate).toLocaleString("uz-UZ")}</p>
          </div>
          <div>
            <p className="font-medium">🕒 Tugash:</p>
            <p>
              {lesson.endDate
                ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                : "–"}
            </p>
          </div>
          <div>
            <p className="font-medium">👥 O‘quvchilar soni:</p>
            <p>{lesson.studentsCount}</p>
          </div>
          <div>
            <p className="font-medium">✅ Davomat qilganlar:</p>
            <p>{lesson.attendCount}</p>
          </div>
          <div>
            <p className="font-medium">📅 Status:</p>
            <p
              className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                lesson.isDeleted
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {lesson.isDeleted ? "❌ O‘chirilgan" : "✅ Faol"}
            </p>
          </div>
        </div>
      </div>

      {/* 🎯 Davomat jadvali */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          ✅ Davomat
        </h2>

        {loadingStudents ? (
          <div className="flex justify-center py-6 text-gray-500">
            <CircularProgress size={50} />
          </div>
        ) : (
          <CreateAttendence lessonId={lessonid} students={students} />
        )}
      </div>
    </div>
  )
}

export default LessonPage



lessonni Lessons.getLessonByLessonId apisi orqali olib ko'rish kerak agar useMemoda undefined kelsa

### 🤖 ChatGPT:

Zo‘r ✅ — sen to‘g‘ri yo‘ldasan.  
Endi bu sahifani to‘liq **ishlaydigan**, `lesson`ni agar `useAllFetchedData()` orqali topilmasa — `Lessons.getLessonById()` dan olishga tayyor qilib yozib chiqaylik.  

---

### 🧩 Maqsad
Agar `lessons.find(...)` natijasi `undefined` bo‘lsa, `lesson`ni API orqali olish (`Lessons.getLessonById(lessonid)`).

---

### ✅ To‘liq, to‘g‘rilangan kod:
```tsx
"use client"

import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { Lesson, Staff } from "@/types"
import React, { useEffect, useMemo, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Lessons, Staffs } from "@/features"
import CreateAttendence from "@/components/modal/CreateAttendence"

interface LessonPageParamsType {
  params: { lessonid: string }
}

function LessonPage({ params }: LessonPageParamsType) {
  const { lessonid } = params
  const router = useRouter()

  const { lessons, error: LessonsError, loading: LessonsLoading } = useAllFetchedData()
  const { selectedGroupId } = useSelectedStore()

  const [students, setStudents] = useState<Staff[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loadingLesson, setLoadingLesson] = useState(true)

  // === 1️⃣ Dastlab store'dan darsni topish ===
  const cachedLesson = useMemo(() => {
    return lessons.find((l) => l.id === lessonid)
  }, [lessons, lessonid])

  // === 2️⃣ Darsni olish (agar localda bo‘lmasa API orqali) ===
  const fetchLesson = async () => {
    try {
      setLoadingLesson(true)
      if (cachedLesson) {
        setLesson(cachedLesson)
      } else {
        console.log("API orqali lesson olish:", lessonid)
        const data = await Lessons.getLessonById(lessonid)
        setLesson(data)
      }
    } catch (error) {
      console.error("❌ Lesson olishda xatolik:", error)
    } finally {
      setLoadingLesson(false)
    }
  }

  // === 3️⃣ Talabalarni olish ===
  const fetchStudents = async () => {
    if (!selectedGroupId) {
      setLoadingStudents(false)
      return
    }
    try {
      setLoadingStudents(true)
      const res = await Staffs.getStudentsByGroupId(selectedGroupId)
      setStudents(res)
    } catch (error) {
      console.error("Talabalarni olishda xatolik:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  // === 4️⃣ Yuklash effekti ===
  useEffect(() => {
    fetchLesson()
  }, [lessonid, lessons])

  useEffect(() => {
    fetchStudents()
  }, [lessonid, selectedGroupId])

  // === 5️⃣ Error yoki yuklanish holatlari ===
  if (LessonsError)
    return <h1 className="text-center text-red-500 mt-10">❌ Lesson yuklashda xatolik!</h1>

  if (loadingLesson)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <CircularProgress size={80} />
        <p className="ml-3 text-lg">Dars ma’lumotlari yuklanmoqda...</p>
      </div>
    )

  if (!lesson)
    return (
      <div className="flex flex-col items-center mt-10 text-gray-700">
        <p className="text-lg font-medium">❌ Dars topilmadi</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Ortga qaytish
        </button>
      </div>
    )

  // === 6️⃣ Render qismi ===
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 space-y-6">
      {/* Dars tafsilotlari */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative">
        {/* Ortga qaytish */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Ortga
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🧾 Dars tafsilotlari
        </h1>

        {/* Lesson ma’lumotlari */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700 w-full">
          <div>
            <p className="font-medium">📚 Dars raqami:</p>
            <p>{lesson.lessonNumber}</p>
          </div>
          <div>
            <p className="font-medium">👨‍🏫 O‘qituvchi:</p>
            <p>{lesson.teacherName}</p>
          </div>
          <div>
            <p className="font-medium">🏫 Guruh:</p>
            <p>{lesson.groupName}</p>
          </div>
          <div>
            <p className="font-medium">🏠 Xona:</p>
            <p>
              {lesson.roomName} #{lesson.roomNumber}
            </p>
          </div>
          <div>
            <p className="font-medium">🕓 Boshlanish:</p>
            <p>{new Date(lesson.startDate).toLocaleString("uz-UZ")}</p>
          </div>
          <div>
            <p className="font-medium">🕒 Tugash:</p>
            <p>
              {lesson.endDate
                ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                : "–"}
            </p>
          </div>
          <div>
            <p className="font-medium">👥 O‘quvchilar soni:</p>
            <p>{lesson.studentsCount}</p>
          </div>
          <div>
            <p className="font-medium">✅ Davomat qilganlar:</p>
            <p>{lesson.attendCount}</p>
          </div>
          <div>
            <p className="font-medium">📅 Status:</p>
            <p
              className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                lesson.isDeleted
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {lesson.isDeleted ? "❌ O‘chirilgan" : "✅ Faol"}
            </p>
          </div>
        </div>
      </div>

      {/* 🎯 Davomat jadvali */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">✅ Davomat</h2>

        {loadingStudents ? (
          <div className="flex justify-center py-6 text-gray-500">
            <CircularProgress size={50} />
          </div>
        ) : (
          <CreateAttendence lessonId={lessonid} students={students} />
        )}
      </div>
    </div>
  )
}

export default LessonPage
```

---

### 🔍 Nimalar qo‘shildi:
| Qism | Maqsad |
|------|---------|
| `const [lesson, setLesson]` | Lesson’ni alohida state’da saqlaymiz |
| `fetchLesson()` | Avval `useAllFetchedData()` dan qidiradi, topilmasa API orqali oladi |
| `loadingLesson` | Darsni yuklash jarayonini ko‘rsatadi |
| `useEffect(fetchLesson, [lessonid, lessons])` | Lesson o‘zgarganda qayta yuklaydi |

---

Agar xohlasang men senga `Lessons.getLessonById()` uchun **backend controller/service method** (NestJS) ham yozib beraman — shunda u `getOneLesson()` API orqali to‘liq ishlaydi.  
Shuni yozaymi?

---

### 👤 Foydalanuvchi:

"use client"

import React, { useEffect, useState } from "react"
import { Courses } from "@/features"
import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import { useRouter } from "next/navigation"
import { Button } from "@mui/material"
import CreateCourse from "@/components/modal/CreateCourse"
import { Course } from "@/types"

function CoursesRender() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { setCourseId } = useSelectedStore()
    const { courses: GlobalCourses } = useAllFetchedData()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

    const router = useRouter()
    const fetchData = async () => {
        if (GlobalCourses && GlobalCourses[0]) {
            setCourses(GlobalCourses)
            return
        }
        setLoading(true)
        setError(null)
        try {
            const allCoursesRender = await Courses.coursesApi.getAll()
            setCourses(allCoursesRender)
        } catch (err) {
            console.error(err)
            setError("Kurslarni yuklashda xatolik yuz berdi!")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCourse = async (courseId: string) => {
        try {
            await Courses.coursesApi.remove(courseId)
            setCourses((prev) => prev.filter((course) => course.id !== courseId))
        } catch (error) {
            console.log(error)
        }
    }

    const updateCoursePublished = async (courseId : string) => {
        const res = await Courses.coursesApi.update(courseId,{
            published : true
        })
    }


    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <p>Yuklanmoqda...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>
    if (!courses.length) return <p>Hozircha hech qanday kurs mavjud emas.</p>

    return (
        <div>
            <div className="w-full flex justify-between items-center my-4">
                <h1>Kurslar </h1>
                <Button variant="contained" onClick={() => setIsOpenModal(true)}>Yangi kurs qo'shish</Button>

            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {courses.map((course) => (
                    <div
                        key={course.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            width: "250px",
                            padding: "12px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                    >
                        {course.image ? (
                            <img
                                src={course.image.startsWith("http") ? course.image : `http://localhost:15976/${course.image}`}
                                alt={course.name}
                                style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "6px" }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "140px",
                                    backgroundColor: "#eee",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "48px",
                                    fontWeight: "bold",
                                    borderRadius: "6px",
                                }}
                            >
                                {course.name.charAt(0)}
                            </div>
                        )}
                        <h3 style={{ margin: "10px 0 5px" }}>{course.name}</h3>
                        <p><strong>Narxi:</strong> {course.price.toLocaleString("uz-UZ")} so'm</p>
                        <p><strong>Davomiyligi:</strong> {course.durationMont} oy</p>
                        <p>
                            <strong>Hafta kunlari:</strong>{" "}
                            {course.weekDays.length ? course.weekDays.join(", ") : "Belgilanmagan"}
                        </p>
                        <p><strong>Dars davomiyligi:</strong> {course.durationMinut} daqiqa</p>
                        <p style={{ color: course.published ? "green" : "orange" }}>
                            {course.published ? "✅ Faol" : "🕓 Nofaol"}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                            <button
                                style={{
                                    backgroundColor: "#d32f2f",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={() => updateCoursePublished(course.id)}
                            >
                                Elon Qilish
                            </button>
                            <button
                                style={{
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    setCourseId(course.id)
                                    router.push(`/courses/${course.id}`)
                                }}
                            >
                                Ko'rish
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className={isOpenModal ? "flex" : "hidden"}>
                <CreateCourse setModal={setIsOpenModal} setCourses={setCourses}/>
            </div>
        </div>
    )
}

export default CoursesRender


elon qilish logikasini yozib ber men courseId beribman courseni olsin va  published : !course.published

### 🤖 ChatGPT:

Zo‘r 👌 Demak, sen `updateCoursePublished(courseId)` funksiyasida shunchaki `published` ni **teskarisiga** o‘zgartirmoqchisan — agar `true` bo‘lsa `false` qilinsin, agar `false` bo‘lsa `true`.  

Mana to‘liq, to‘g‘ri ishlaydigan `updateCoursePublished` funksiyasi 👇  

```ts
const updateCoursePublished = async (courseId: string) => {
  try {
    // 1️⃣ Kursni holatini topamiz
    const course = courses.find((c) => c.id === courseId)
    if (!course) return alert("Kurs topilmadi")

    // 2️⃣ Yangi qiymatni tayyorlaymiz
    const newStatus = !course.published

    // 3️⃣ Backendga so‘rov yuboramiz
    const updated = await Courses.coursesApi.update(courseId, {
      published: newStatus,
    })

    // 4️⃣ Frontda local state-ni yangilaymiz
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, published: updated.published } : c
      )
    )

    // 5️⃣ Ixtiyoriy: foydalanuvchiga xabar
    console.log(
      `Kurs "${course.name}" ${newStatus ? "faollashtirildi ✅" : "nofaol qilindi 🕓"}`
    )
  } catch (error) {
    console.error("Kursni yangilashda xatolik:", error)
  }
}
```

---

🔍 **Qisqacha tushuntirish:**
- `courses.find()` orqali `courseId` bo‘yicha kursni topadi.  
- `newStatus` bilan `published` qiymatini teskari holatga o‘giradi.  
- `Courses.coursesApi.update()` orqali serverda saqlaydi.  
- So‘ngra `setCourses` bilan frontdagi ro‘yxatni ham yangilaydi.  

---

Agar xohlasang, `Elon qilish` tugmasi nomini ham avtomatik o‘zgartirib qo‘yish mumkin:  

```tsx
<button
  style={{
    backgroundColor: course.published ? "#f57c00" : "#2e7d32",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  }}
  onClick={() => updateCoursePublished(course.id)}
>
  {course.published ? "Bekor qilish" : "Elon qilish"}
</button>
```

Shunda:
- Agar kurs `published = false` bo‘lsa → “Elon qilish”  
- Agar `true` bo‘lsa → “Bekor qilish” chiqadi.  

Xohlaysanmi shunaqa tugma matni bilan dinamik qilay?

---

### 👤 Foydalanuvchi:

CourseUpdateModal kerak

### 🤖 ChatGPT:

Zo‘r ✅ — demak sen `CourseUpdateModal` komponenti orqali mavjud kursni **tahrirlash (update)** qilishni xohlaysan.  
Quyida to‘liq, ishlaydigan `CourseUpdateModal` misolini keltiraman (Tailwind + MUI bilan mos ishlaydi).  

---

### 📁 `components/modal/CourseUpdateModal.tsx`
```tsx
"use client"

import React, { useState } from "react"
import { Modal, Box, TextField, Button, CircularProgress } from "@mui/material"
import { Courses } from "@/features"
import { Course } from "@/types"

interface CourseUpdateModalProps {
  open: boolean
  onClose: () => void
  course: Course
  onUpdated: (updatedCourse: Course) => void
}

export default function CourseUpdateModal({
  open,
  onClose,
  course,
  onUpdated,
}: CourseUpdateModalProps) {
  const [form, setForm] = useState({
    name: course.name,
    price: course.price,
    durationMont: course.durationMont,
    durationMinut: course.durationMinut,
    weekDays: course.weekDays.join(", "),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      const updatedData = {
        ...form,
        weekDays: form.weekDays
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        price: Number(form.price),
        durationMont: Number(form.durationMont),
        durationMinut: Number(form.durationMinut),
      }

      const updatedCourse = await Courses.coursesApi.update(course.id, updatedData)
      onUpdated(updatedCourse)
      onClose()
    } catch (err) {
      console.error(err)
      setError("Kursni yangilashda xatolik yuz berdi!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          margin: "10% auto",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <h2 className="text-lg font-semibold text-center mb-2">
          ✏️ Kursni tahrirlash
        </h2>

        <TextField
          label="Kurs nomi"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Narxi (so'm)"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Davomiyligi (oy)"
          name="durationMont"
          type="number"
          value={form.durationMont}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Dars davomiyligi (daqiqa)"
          name="durationMinut"
          type="number"
          value={form.durationMinut}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Hafta kunlari (vergul bilan)"
          name="weekDays"
          value={form.weekDays}
          onChange={handleChange}
          fullWidth
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-3 mt-2">
          <Button onClick={onClose} variant="outlined" color="inherit">
            Bekor qilish
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} /> : "Saqlash"}
          </Button>
        </div>
      </Box>
    </Modal>
  )
}
```

---

### 🔗 Ishlatilishi (`CoursesRender` ichida)
```tsx
import CourseUpdateModal from "@/components/modal/CourseUpdateModal"

// ...
const [updateModalOpen, setUpdateModalOpen] = useState(false)
const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

return (
  <div>
    {/* ... */}
    {courses.map((course) => (
      <div key={course.id}>
        {/* Kurs kartasi */}
        <h3>{course.name}</h3>
        <button
          onClick={() => {
            setSelectedCourse(course)
            setUpdateModalOpen(true)
          }}
        >
          ✏️ Tahrirlash
        </button>
      </div>
    ))}

    {selectedCourse && (
      <CourseUpdateModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        course={selectedCourse}
        onUpdated={(updated) =>
          setCourses((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          )
        }
      />
    )}
  </div>
)
```

---

Shunda `Tahrirlash` tugmasini bosganingda modal ochiladi, forma orqali kursni yangilaysan, `Saqlash` bosilganda esa:
- API orqali `Courses.coursesApi.update()` chaqiriladi,  
- Frontdagi `courses` ro‘yxati avtomatik yangilanadi,  
- Modal yopiladi ✅  

Xohlaysanmi bu modalga kurs rasmini (upload qilish) funksiyasini ham qo‘shay?

---

### 👤 Foydalanuvchi:

weekdaysni  kunlarni belgilasin


"use client"

import React, { useEffect, useState } from "react"
import { Courses, Rooms } from "@/features"
import { Room } from "@/features/roms"
import { X } from "lucide-react"
import { Course } from "@/types"

const weekDays = [
  { id: 1, name: "Dushanba" },
  { id: 2, name: "Seshanba" },
  { id: 3, name: "Chorshanba" },
  { id: 4, name: "Payshanba" },
  { id: 5, name: "Juma" },
  { id: 6, name: "Shanba" },
  { id: 0, name: "Yakshanba" },
]

type CreateCourseProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCourses : React.Dispatch<React.SetStateAction<Course[]>>
};

function CreateCourse({ setModal ,setCourses}: CreateCourseProps) {

  const [rooms, setRooms] = useState<Room[]>([])
  const [form, setForm] = useState({
    name: "",
    price: "",
    durationMont: "",
    weekDays: [] as number[],
    durationMinut: "",
    published: false,
  })
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Rooms.getAllRooms().then(setRooms).catch(console.error)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const toggleDay = (id: number) => {
    setForm((prev) => ({
      ...prev,
      weekDays: prev.weekDays.includes(id)
        ? prev.weekDays.filter((d) => d !== id)
        : [...prev.weekDays, id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const dto = {
        ...form,
        price: +form.price,
        durationMont: +form.durationMont,
        durationMinut: +form.durationMinut,
      }
      const res = await Courses.coursesApi.create(dto, image || undefined)
      alert("✅ Kurs yaratildi!")
      setCourses(prev => {
        let old = [...prev]
        old.push(res.course)
        return old
      })
      setModal(false)
    } catch (err) {
      alert("❌ Xatolik: qayta urinib ko‘ring")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed top-0 right-0 h-screen w-[35%] bg-white shadow-2xl border-l border-gray-200 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">📘 Yangi kurs</h2>
        <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-200 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 text-sm text-gray-700">
        <Input name="name" label="Kurs nomi" placeholder="Masalan: Frontend" value={form.name} onChange={handleChange} />
        <Input name="price" label="Narxi (so‘m)" type="number" placeholder="150000" value={form.price} onChange={handleChange} />
        <Input name="durationMont" label="Davomiyligi (oy)" type="number" placeholder="4" value={form.durationMont} onChange={handleChange} />

        {/* Haftalik kunlar */}
        <div>
          <label className="block font-medium mb-1">Hafta kunlari</label>
          <div className="grid grid-cols-2 gap-2">
            {weekDays.map((d) => (
              <label
                key={d.id}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer ${
                  form.weekDays.includes(d.id)
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.weekDays.includes(d.id)}
                  onChange={() => toggleDay(d.id)}
                />
                {d.name}
              </label>
            ))}
          </div>
        </div>

        <Input
          name="durationMinut"
          label="Dars davomiyligi (minut)"
          type="number"
          placeholder="90"
          value={form.durationMinut}
          onChange={handleChange}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
          />
          <span>Kursni e’lon qilish</span>
        </div>

        <div>
          <label className="block font-medium mb-1">Kurs rasmi</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`py-3 mt-3 rounded-lg text-white font-semibold transition ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700 shadow"
          }`}
        >
          {loading ? "⏳ Yaratilmoqda..." : "Yaratish"}
        </button>
      </form>
    </div>
  )
}

export default CreateCourse

// Reusable Input
function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full py-2.5 px-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
      />
    </div>
  )
}







bu example

### 🤖 ChatGPT:

Zo‘r — bu `CreateCourse` modaling uchun **perfect base**! 👏  
Endi sen xuddi shu logikani `CourseUpdateModal` uchun ham xohlaysan — lekin bunda:  
✅ kurs ma’lumotlari formga avtomatik to‘lib tursin,  
✅ haftalik kunlar (`weekDays`) checkbox orqali belgilanadigan bo‘lsin,  
✅ o‘zgartirilgan qiymatlar `Courses.coursesApi.update()` orqali saqlansin.

Quyida **to‘liq tayyor `CourseUpdateModal`** keltiraman 👇

---

### 📄 `components/modal/CourseUpdateModal.tsx`
```tsx
"use client"

import React, { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Courses } from "@/features"
import { Course } from "@/types"

const weekDays = [
  { id: 1, name: "Dushanba" },
  { id: 2, name: "Seshanba" },
  { id: 3, name: "Chorshanba" },
  { id: 4, name: "Payshanba" },
  { id: 5, name: "Juma" },
  { id: 6, name: "Shanba" },
  { id: 0, name: "Yakshanba" },
]

type CourseUpdateModalProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  course: Course
  onUpdated: (updatedCourse: Course) => void
}

export default function CourseUpdateModal({
  open,
  setOpen,
  course,
  onUpdated,
}: CourseUpdateModalProps) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    durationMont: "",
    durationMinut: "",
    weekDays: [] as number[],
    published: false,
  })
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // === Dastlabki ma'lumotlarni yuklash ===
  useEffect(() => {
    if (course) {
      setForm({
        name: course.name || "",
        price: course.price?.toString() || "",
        durationMont: course.durationMont?.toString() || "",
        durationMinut: course.durationMinut?.toString() || "",
        weekDays:
          Array.isArray(course.weekDays) && typeof course.weekDays[0] === "number"
            ? (course.weekDays as number[])
            : [],
        published: course.published || false,
      })
    }
  }, [course])

  // === Input o‘zgarishini kuzatish ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // === Haftalik kunlarni tanlash ===
  const toggleDay = (id: number) => {
    setForm((prev) => ({
      ...prev,
      weekDays: prev.weekDays.includes(id)
        ? prev.weekDays.filter((d) => d !== id)
        : [...prev.weekDays, id],
    }))
  }

  // === Formani yuborish ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const dto = {
        ...form,
        price: +form.price,
        durationMont: +form.durationMont,
        durationMinut: +form.durationMinut,
      }

      const updated = await Courses.coursesApi.update(course.id, dto, image || undefined)
      alert("✅ Kurs yangilandi!")
      onUpdated(updated)
      setOpen(false)
    } catch (err) {
      console.error(err)
      alert("❌ Kursni yangilashda xatolik!")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed top-0 right-0 h-screen w-[35%] bg-white shadow-2xl border-l border-gray-200 flex flex-col overflow-y-auto z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">✏️ Kursni tahrirlash</h2>
        <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 text-sm text-gray-700">
        <Input label="Kurs nomi" name="name" value={form.name} onChange={handleChange} />
        <Input label="Narxi (so‘m)" name="price" type="number" value={form.price} onChange={handleChange} />
        <Input
          label="Davomiyligi (oy)"
          name="durationMont"
          type="number"
          value={form.durationMont}
          onChange={handleChange}
        />

        {/* Haftalik kunlar */}
        <div>
          <label className="block font-medium mb-1">Hafta kunlari</label>
          <div className="grid grid-cols-2 gap-2">
            {weekDays.map((d) => (
              <label
                key={d.id}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer ${
                  form.weekDays.includes(d.id)
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.weekDays.includes(d.id)}
                  onChange={() => toggleDay(d.id)}
                />
                {d.name}
              </label>
            ))}
          </div>
        </div>

        <Input
          label="Dars davomiyligi (minut)"
          name="durationMinut"
          type="number"
          value={form.durationMinut}
          onChange={handleChange}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
          />
          <span>Kursni e’lon qilish</span>
        </div>

        <div>
          <label className="block font-medium mb-1">Kurs rasmi</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`py-3 mt-3 rounded-lg text-white font-semibold transition ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700 shadow"
          }`}
        >
          {loading ? "⏳ Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  )
}

// Reusable Input
function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full py-2.5 px-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
      />
    </div>
  )
}
```

---

### 🔗 `CoursesRender` ichida ishlatish:

```tsx
import CourseUpdateModal from "@/components/modal/CourseUpdateModal"

// ...
const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
const [openUpdate, setOpenUpdate] = useState(false)

return (
  <>
    {courses.map((course) => (
      <div key={course.id}>
        <h3>{course.name}</h3>
        <button
          onClick={() => {
            setSelectedCourse(course)
            setOpenUpdate(true)
          }}
          className="text-blue-600"
        >
          ✏️ Tahrirlash
        </button>
      </div>
    ))}

    {selectedCourse && (
      <CourseUpdateModal
        open={openUpdate}
        setOpen={setOpenUpdate}
        course={selectedCourse}
        onUpdated={(updated) =>
          setCourses((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          )
        }
      />
    )}
  </>
)
```

---

Shunda:
- `weekDays` checkbox orqali belgilanadi ✅  
- barcha qiymatlar avtomatik formga to‘ladi ✅  
- saqlash tugmasi API’ga `update` yuboradi ✅  
- yangilangan kurs frontda darhol ko‘rinadi ✅  

Xohlaysanmi men `CourseUpdateModal`ga `room` tanlash (`select`) qismini ham qo‘shib beray?

---

### 👤 Foydalanuvchi:

// src/features/courses/api.ts
import api from "@/lib/axios";
import { CourseFlat } from "./types";
import { Course } from "@/types";

type CreateDto = Partial<CourseFlat>;
type UpdateDto = Partial<CourseFlat>;

export const coursesApi = {
  /** Create course — if image provided → multipart, else → json */
  create: async (dto: object, image?: File) => {
    let data;

    if (image) {
      const form = new FormData();

      // DTO qiymatlarini stringga aylantirib formga qo‘shamiz
      Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        }
      });

      // Backend FileInterceptor("image") kutgani uchun nomi "image" bo‘lishi kerak
      form.append("image", image);

      const res = await api.post("/courses/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      data = res.data;
    } else {
      const res = await api.post("/courses/create", dto);
      data = res.data;
    }

    return data as { message: string; course: CourseFlat };
  },

  /** Get all courses */
  getAll: async () => {
    const { data } = await api.get("/courses/get-all");
    return (data as { message: string; count: number; courses: CourseFlat[] }).courses;
  },

  /** Get one course */
  getOne: async (id: string) : Promise<Course>=> {
    const { data } = await api.get<{message : string,course : Course}>(`/courses/get-one/${id}`);
    return data.course;
  },

  /** Update course — image bo‘lsa multipart, bo‘lmasa JSON */
  update: async (id: string, dto: UpdateDto, image?: File) => {
    let data;

    if (image) {
      const form = new FormData();
      Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        }
      });
      form.append("image", image);

      const res = await api.patch(`/courses/update-one/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      data = res.data;
    } else {
      const res = await api.patch(`/courses/update-one/${id}`, dto);
      data = res.data;
    }

    return data as { message: string; course: CourseFlat };
  },

  /** Delete one course */
  remove: async (id: string) => {
    const { data } = await api.delete(`/courses/delete-one/${id}`);
    return data as { message: string; courseId?: string };
  },
};


updateni bundagi updateCoursega mosla

### 🤖 ChatGPT:

Ajoyib — sening `coursesApi.update` metoding yaxshi yozilgan, faqat uni **`updateCoursePublished`** yoki **CourseUpdateModal** dan chaqirganda moslashuvchanroq ishlashi uchun biroz optimallashtirish mumkin. Quyidagi versiya **`published` ni toggle qilish**, **kurs ma’lumotlarini o‘zgartirish**, yoki **rasm bilan yangilash** holatlariga moslab yozilgan.  

Mana to‘liq **`updateCourse`** funksiyasining to‘g‘ri, ishlab turuvchi versiyasi 👇  

---

### ✅ Yangi `updateCourse` (toggle, modal, image — barchasiga mos)

```ts
// src/features/courses/api.ts
import api from "@/lib/axios"
import { CourseFlat } from "./types"
import { Course } from "@/types"

type CreateDto = Partial<CourseFlat>
type UpdateDto = Partial<CourseFlat>

export const coursesApi = {
  /** Create course — if image provided → multipart, else → json */
  create: async (dto: object, image?: File) => {
    let data

    if (image) {
      const form = new FormData()
      Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, typeof value === "object" ? JSON.stringify(value) : String(value))
        }
      })
      form.append("image", image)

      const res = await api.post("/courses/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      data = res.data
    } else {
      const res = await api.post("/courses/create", dto)
      data = res.data
    }

    return data as { message: string; course: CourseFlat }
  },

  /** Get all courses */
  getAll: async () => {
    const { data } = await api.get("/courses/get-all")
    return (data as { message: string; count: number; courses: CourseFlat[] }).courses
  },

  /** Get one course */
  getOne: async (id: string): Promise<Course> => {
    const { data } = await api.get<{ message: string; course: Course }>(`/courses/get-one/${id}`)
    return data.course
  },

  /** Update course — works for any type of update */
  update: async (id: string, dto: UpdateDto, image?: File) => {
    let data

    // Agar rasm bo‘lsa — multipart
    if (image) {
      const form = new FormData()
      Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, typeof value === "object" ? JSON.stringify(value) : String(value))
        }
      })
      form.append("image", image)

      const res = await api.patch(`/courses/update-one/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      data = res.data
    } else {
      // Aks holda JSON bilan
      const res = await api.patch(`/courses/update-one/${id}`, dto)
      data = res.data
    }

    return data as { message: string; course: CourseFlat }
  },

  /** Toggle course published */
  togglePublished: async (id: string) => {
    const course = await api.get<{ message: string; course: Course }>(`/courses/get-one/${id}`)
    const current = course.data.course

    const res = await api.patch(`/courses/update-one/${id}`, {
      published: !current.published,
    })

    return res.data as { message: string; course: CourseFlat }
  },

  /** Delete one course */
  remove: async (id: string) => {
    const { data } = await api.delete(`/courses/delete-one/${id}`)
    return data as { message: string; courseId?: string }
  },
}
```

---

### 🔧 Endi `CoursesRender` ichida `updateCoursePublished` ni soddalashtirasan:

```ts
const updateCoursePublished = async (courseId: string) => {
  try {
    const updated = await Courses.coursesApi.togglePublished(courseId)
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, published: updated.course.published } : c))
    )
  } catch (err) {
    console.error(err)
    alert("❌ Kursni e’lon qilishda xatolik!")
  }
}
```

---

### 🔹 Afzalliklari:
- `update()` hozir universal: image bilan yoki imagesiz ishlaydi.
- `togglePublished()` — qisqa yo‘l orqali faqat “elon qilish” uchun.
- Kod aniq va qayta foydalanish uchun tayyor.

Xohlaysanmi endi shu API asosida `CourseUpdateModal`ni (kursni tahrirlash uchun modal) ham yozib beray?

---

