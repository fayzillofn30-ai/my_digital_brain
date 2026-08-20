# Quick dinner recipe

### 👤 Foydalanuvchi:

Salom! what's your go-to recipe for a quick and easy dinner?

### 🤖 ChatGPT:

Salom! 😄  

Here’s one of my **go-to quick and easy dinners** — super simple, fast, and satisfying:

---

### 🌮 **Garlic Butter Shrimp Pasta**
**Time:** 20–25 minutes  
**Serves:** 2–3 people

#### 📝 Ingredients:
- 200g spaghetti (or any pasta you like)  
- 250g shrimp (peeled & deveined — frozen is fine!)  
- 3 tbsp butter  
- 3 cloves garlic (minced)  
- 1 tbsp olive oil  
- ½ tsp chili flakes (optional)  
- Salt & pepper, to taste  
- Juice of ½ lemon  
- A handful of chopped parsley  
- Grated parmesan (optional but delicious)

#### 🍳 Instructions:
1. **Cook pasta** in salted boiling water according to package instructions. Reserve about ½ cup of pasta water before draining.
2. **Sauté shrimp:**  
   - Heat olive oil and 1 tbsp butter in a pan.  
   - Add shrimp, salt, pepper, and chili flakes.  
   - Cook 2–3 minutes per side until pink. Remove and set aside.
3. **Make garlic butter sauce:**  
   - In the same pan, add remaining butter and garlic.  
   - Cook gently for 30 seconds (don’t brown it!).
4. **Combine:**  
   - Add cooked pasta, a splash of pasta water, and lemon juice. Toss everything together.  
   - Add shrimp back in, mix, and sprinkle parsley and parmesan on top.
5. **Serve hot** with extra lemon wedges if you like.

---

Would you like me to give you a **vegetarian** or **one-pan** version next?

---

### 👤 Foydalanuvchi:

"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button, CircularProgress } from "@mui/material"
import { Group, Lesson } from "@/types"
import { Groupes, Lessons } from "@/features"
import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import CreateLesson from "@/dashboard/area/modal/CreateLesson"

export default function LessonsRender({ params }: { params: Promise<{ groupid: string }> }) {
  const router = useRouter()
  const { groupid } = React.use(params)

  // === States ===
  const [group, setGroup] = useState<Group | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const {setGroupId} = useSelectedStore()
  setGroupId(groupid)
  // === Global fetched data ===
  const { groupes } = useAllFetchedData()

  // === Fetch group and lessons ===
  useEffect(() => {
    if (!groupid) return

    const fetchData = async () => {
      try {
        setLoading(true)

        // Guruhni topish (globaldan yoki API’dan)
        let target = groupes.find((g) => g.id === groupid)
        if (!target) {
          target = await Groupes.getOneGroupe(groupid)
        }
        setGroup(target || null)

        // Darslarni olish
        const lessonsData = await Lessons.getLessonsByGroupId(groupid)
        setLessons(lessonsData || [])
      } catch (err) {
        console.error("❌ Darslarni olishda xatolik:", err)
        setError("Darslarni yuklashda xatolik yuz berdi.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [groupid, groupes])

  // === Loading holati ===
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <CircularProgress size={80} />
        <p className="ml-3 text-lg">Darslar yuklanmoqda...</p>
      </div>
    )
  }

  // === Error holati ===
  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>
  }

  // === Main render ===
  return (
    <div className="overflow-x-auto mt-6 p-4">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => router.push(`/groupes/${groupid}`)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition text-lg font-medium"
        >
          <ArrowLeft className="w-6 h-6" />
          Ortga
        </button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsOpenModal(true)}
        >
          Yangi dars qo‘shish
        </Button>
      </div>

      {/* Lessons table */}
      {lessons.length > 0 ? (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Boshlanish</th>
                <th className="px-4 py-2 text-left">Tugash</th>
                <th className="px-4 py-2 text-left">O‘qituvchi</th>
                <th className="px-4 py-2 text-left">Xona</th>
                <th className="px-4 py-2 text-left">O‘quvchilar</th>
                <th className="px-4 py-2 text-left">Davomat</th>
              </tr>
            </thead>

            <tbody>
              {lessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className={`border-t hover:bg-blue-50 transition cursor-pointer ${
                    lesson.isDeleted ? "opacity-60" : ""
                  }`}
                  onClick={() => router.push(`lessons/${lesson.id}`)}
                >
                  <td className="px-4 py-2">{lesson.lessonNumber}</td>
                  <td className="px-4 py-2">
                    {new Date(lesson.startDate).toLocaleString("uz-UZ")}
                  </td>
                  <td className="px-4 py-2">
                    {lesson.endDate
                      ? new Date(lesson.endDate).toLocaleString("uz-UZ")
                      : "-"}
                  </td>
                  <td className="px-4 py-2">{lesson.teacherName || "-"}</td>
                  <td className="px-4 py-2">
                    {lesson.roomName
                      ? `${lesson.roomName} #${lesson.roomNumber}`
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-center">{lesson.studentsCount}</td>
                  <td className="px-4 py-2 text-center">{lesson.attendCount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-sm text-gray-600 mt-2 text-right px-4 py-2">
            Jami darslar: {lessons.length}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">📘 Darslar topilmadi.</p>
      )}

      {/* Modal (Create Lesson) */}
      {isOpenModal && group && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setIsOpenModal(false)}
              className="absolute top-2 right-2"
            >
              Yopish
            </Button>
            <CreateLesson
              props={{ group, setLessons, setModal: setIsOpenModal }}
            />
          </div>
        </div>
      )}
    </div>
  )
}


bu page ga o'tganimda sayt javob berolmay qolayabdi

### 🤖 ChatGPT:

Zo‘r — koding yaxshi tuzilgan, lekin ha, bu sahifa **javob bermay qolishi (freeze yoki crash bo‘lishi)** ehtimoli katta.  
Keling, **asosiy sabab**larni bosqichma-bosqich tahlil qilaylik 👇  

---

### 🧨 1. Eng katta muammo — `const { groupid } = React.use(params)`  
Bu **xato sintaksis**.

`params` bu `Promise<{ groupid: string }>` deb e’lon qilingan.  
Lekin React komponent ichida `await` ishlatib bo‘lmaydi, shuning uchun bu qator:

```ts
const { groupid } = React.use(params)
```

haqiqatan ham **infinite render loop** yoki **JS xatoliklari** keltirib chiqaryapti — sahifa shunchaki “osilib qoladi”.

✅ To‘g‘ri variantlar:  
Agar `params` Next.js dan kelyotgan bo‘lsa (masalan `[groupid]/page.tsx` ichida):

```tsx
export default function LessonsRender({ params }: { params: { groupid: string } }) {
  const { groupid } = params
```

ya’ni **`Promise` emas, balki oddiy obyekt** bo‘lishi kerak.  
Agar sen uni `Promise` bilan uzatayotgan bo‘lsang — bu noto‘g‘ri.  
`page.tsx` ichida Next.js `params` har doim **oddiy object** bo‘ladi.

---

### ✅ To‘g‘rilangan bosh qismi:
```tsx
"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button, CircularProgress } from "@mui/material"
import { Group, Lesson } from "@/types"
import { Groupes, Lessons } from "@/features"
import { useAllFetchedData, useSelectedStore } from "@/lib/ui.state"
import CreateLesson from "@/dashboard/area/modal/CreateLesson"

export default function LessonsRender({ params }: { params: { groupid: string } }) {
  const router = useRouter()
  const { groupid } = params  // ✅ to‘g‘rilandi

  const [group, setGroup] = useState<Group | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpenModal, setIsOpenModal] = useState(false)
  
  const { setGroupId } = useSelectedStore()
  
  useEffect(() => {
    if (groupid) setGroupId(groupid)
  }, [groupid, setGroupId])
```

---

### 🧩 2. Yana bir ehtimol — `setGroupId(groupid)` ni to‘g‘ridan-to‘g‘ri renderda chaqirayotganing  
Bu ham **infinite re-render loop** chaqiradi.  

Sababi: har safar render bo‘lganda `setGroupId` state o‘zgaradi, komponent qayta render bo‘ladi, yana o‘zgaradi… va hokazo.

✅ To‘g‘ri variant:
```tsx
useEffect(() => {
  setGroupId(groupid)
}, [groupid])
```

---

### 🧠 3. Qo‘shimcha ehtimollar:
- Agar `Groupes.getOneGroupe` yoki `Lessons.getLessonsByGroupId` promise’lar ichida **await** noto‘g‘ri ishlasa (masalan, serverda ishlayaptimi?), u ham “freeze” keltiradi.  
  Lekin yuqoridagi ikkita tuzatishdan keyin bu holat kamdan-kam bo‘ladi.

---

### 🔧 Yakuniy xulosa:

Sahifa “osilib” qolishining sababi:
1. `React.use(params)` — bu xato.
2. `setGroupId(groupid)` render ichida — bu infinite loop.

---

Agar xohlasang, men senga **to‘liq tozalangan ishlaydigan versiyasini** (bug-fix bilan) yozib beraman. Shunday qilaymi?

---

