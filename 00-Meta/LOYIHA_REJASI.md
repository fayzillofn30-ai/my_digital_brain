# Obsidian Digital Brain — Ish Rejasi (faqat rejalashtirish)

**Sana:** 2026-08-11  
**Rol:** Orcestor_Agent (rejalashtiruvchi)  
**Ijro:** keyinroq `orcestor-skill` + Executer_Agent (`agy`) orqali  
**Qoida:** Bu hujjatda faqat reja bor. Hech qanday chuqur kod tahlili qilinmaydi.

---

## 1. Maqsad

`fayzillo95` + `fayzillofn30-ai` dagi barcha o‘quv/loyiha repolarini  
vaqt tartibida tahlil qilib, **Obsidian Vault** ko‘rinishidagi bilim bazasiga aylantirish.

**Cheklovlar (qat’iy):**
- Faqat dasturchi (Fayzillo) o‘zi yozgan kod tahlil qilinadi.
- Senior-level mavzular (performance tuning, scalability, testing, kutubxona ichki tuzilishi) **qamrab olinmaydi**.
- Fazalar **ketma-ket**: 1 → 2 → 3 → 4 → 5 → 6. Oldingisi tugamasdan keyingisi boshlanmaydi.
- Har repo alohida tahlil qilinadi, lekin barcha fazalar bir xil tartibda takrorlanadi.

---

## 2. Accountlar va repo manbalari

| Account | Rol | Repo soni | Izoh |
|---------|-----|-----------|------|
| `fayzillofn30-ai` | Ulangan (token) | 2 | `claude_tasks_ubuntu`, `zdes_full_backup` |
| `fayzillo95` | Asosiy o‘quv | 55 | Foundation + Bootcamp + keyingi loyihalar |

**Bootcamp boshlanishi:** 2025-03-09  
**O‘quv oyi:** har 30 kun (kalendar oy emas).

---

## 3. Orcestor orqali ishlatish modeli

Tahlil ishlari **orcestor-skill** orqali bajariladi:

| Rol | Kim | Vazifa |
|-----|-----|--------|
| Supervisor_User | Fayzillo | Qaror beradi, tasdiqlaydi |
| Orcestor_Agent | (shu sessiya / rejalashtiruvchi) | Tasklarni taqsimlaydi, tartibni nazorat qiladi |
| Executer_Agent | `agy` (Antigravity CLI) | Haqiqiy kod o‘qish, report yozish |

**Muhim:**
- Orcestor_Agent xom repolarni o‘zi to‘liq o‘qimaydi (token tejash).
- Executer_Agent (`agy -p "..."`) har bir repo/task uchun ishlaydi.
- Natijalar `reports/` yoki vault ichidagi belgilangan joyga yoziladi.
- Task holati `orcestor/status.md` orqali kuzatiladi.

**Mavjud andoza:**  
`claude_tasks_ubuntu/repo_analiz/orcestor/fulldeep_prompt_template.txt`  
— fulldeep tahlil uchun tayyor prompt shablon (noodatiy yechimlarni qidirish).

---

## 4. Fase bo‘yicha deliverable’lar va tasklar

### FASE 1 — RECONNAISSANCE (Tayyorgarlik)
**Holat:** qisman boshlangan (inventory + timeline tayyor, metadata hali yo‘q)

| Task ID | Nima qilinadi | Natija | Ijrochi |
|---------|---------------|--------|---------|
| F1.1 | Accountlar audit, repo ro‘yxati | `00-Meta/github-accounts-inventory.md` | ✅ Reja + qisman bajarilgan |
| F1.2 | Foundation + Bootcamp timeline | `00-Meta/timeline-master.md` | ✅ Reja + qisman bajarilgan |
| F1.3 | Har repo: LOC, folder, git tarix, README | `00-Meta/repos-metadata.csv` | ⏳ Executer_Agent |

**F1.3 task (orcestor uchun):**
- Barcha `fayzillo95` + `fayzillofn30-ai` repolarini klonlash yoki API orqali metadata yig‘ish.
- CSV ustunlari: `owner,repo,created,pushed,language,size_kb,has_readme,default_branch,approx_loc,top_folders,notes`
- Klon buzilganligini tekshirish (0-byte fayllar) — `fulldeep_prompt_template` dagi 0-qadam.

---

### FASE 2 — CODE ARCHITECTURE
Har bir tanlangan repo uchun (ketma-ket):

| Task | Natija |
|------|--------|
| F2.1 | `ARCH-STRUCTURE-{repo}.md` — entry point, routes/controllers/models/services/middleware |
| F2.2 | `DEPENDENCY-GRAPH-{repo}.md` — fayl bog‘liqliklari |
| F2.3 | `CODE-METRICS-{repo}.md` — LOC, murakkablik, takrorlanish, dokumentatsiya |
| F2.4 | `DESIGN-PATTERNS-{repo}.md` — patternlar, NestJS Modules/Controllers/Services |

**Orcestor task shabloni:**  
bitta repo = bitta (yoki 4 ta kichik) task. Promptda: “faqat dasturchi yozgan kod, node_modules/dist o‘tkazib yubor”.

---

### FASE 3 — REQUEST LIFECYCLE
| Task | Natija |
|------|--------|
| F3.1 | `REQUEST-ENTRY-{repo}.md` |
| F3.2 | `MIDDLEWARE-CHAIN-{repo}.md` |
| F3.3 | `ROUTER-CONTROLLER-{repo}.md` |
| F3.4 | `RESPONSE-ERROR-{repo}.md` |
| F3.5 | `NESTJS-DECORATORS-GUARDS-{repo}.md` (faqat NestJS repolar) |

---

### FASE 4 — DATABASE & QUERY PATTERNS
| Task | Natija |
|------|--------|
| F4.1 | `DATABASE-SCHEMA-{repo}.md` |
| F4.2 | `QUERY-PATTERNS-{repo}.md` |
| F4.3 | `TRANSACTIONS-{repo}.md` |
| F4.4 | `ORM-PATTERNS-{repo}.md` |

---

### FASE 5 — BUSINESS LOGIC & ALGORITHMS
| Task | Natija |
|------|--------|
| F5.1 | `BUSINESS-LOGIC-{repo}.md` |
| F5.2 | `DESIGN-PATTERNS-F5-{repo}.md` |
| F5.3 | `VALIDATION-SECURITY-{repo}.md` |
| F5.4 | `ERROR-HANDLING-{repo}.md` |

**Eslatma:** Fulldeep (noodatiy yechimlar) shu fazaga yaqin — mavjud `fulldeep_prompt_template.txt` ni moslashtirish mumkin.

---

### FASE 6 — OBSIDIAN VAULT CONSTRUCTION
| Task | Natija |
|------|--------|
| F6.1 | Vault papka tuzilmasi (`00-Meta` … `08-Learning`) |
| F6.2 | Barcha `.md` larni bog‘lash (backlink, tag, frontmatter) |
| F6.3 | Navigatsiya: INDEX, TIMELINE, GUIDE |
| F6.4 | `.obsidian/` sozlamalari (plugin, CSS, template) |

---

## 5. Tavsiya etilgan repo prioriteti (tahlil tartibi)

Imtihon va yirik loyihalardan boshlash (qiymat yuqori):

1. `4_oy_imtihon` (NestJS)
2. `online-courses`
3. `e-commerce` + `e-commerce-backend`
4. `telegram_app_backend` + `telegram_app_front_end`
5. `mini-erp`
6. `StudentSYStemMenegment`
7. `youtubebackend`
8. `6_oy_imtihon` (C — alohida e’tibor)
9. `edfix_clone`
10. Qolgan kichik dars/vazifa repolari (guruhlab yoki selective)

Foundation davri (agar alohida repo topilsa) — oxirida yoki parallel qisqa tahlil.

---

## 6. Vault papka tuzilmasi (Fase 6 uchun reja)

```
my_digital_brain/
├── 00-Meta/           # inventory, timeline, metadata, qoidalar
├── 01-Foundation/     # 2024 Foundation materiallari
├── 02-Bootcamp-Oy1/
├── 03-Bootcamp-Oy2/
├── ...
├── 09-Bootcamp-Oy8/
├── 10-Projects/       # e-commerce, telegram_app, zdes, ...
├── 11-Patterns/       # umumiy design pattern xulosalari
├── 12-Timeline/       # xronologik o‘sish
└── 08-Learning/       # o‘rganilgan saboqlar, checklist
```

(Aniq nomlar Fase 6 da yakunlanadi.)

---

## 7. Orcestor bootstrap rejalari

Tahlilni boshlashdan oldin:

1. `my_digital_brain/` (yoki alohida workspace) da `orcestor/` bootstrap qilish.
2. `LANGUAGE=uz` (yoki Supervisor tanlovi).
3. `standing_rules` ga quyidagilarni qo‘shish:
   - Faqat dasturchi yozgan kod.
   - Senior mavzular taqiqlangan.
   - Fazalar ketma-ket.
   - Reportlar o‘zbek tilida.
   - Klon 0-byte tekshiruvi majburiy.
4. Tasklar `task_template.md` asosida yaratiladi; holat `status.md` da kuzatiladi.
5. Executer_Agent promptlari `fulldeep_prompt_template.txt` dan adaptatsiya qilinadi (Fase 2–5 uchun alohida variantlar).

---

## 8. Hozirgi holat va keyingi qadam

| Band | Holat |
|------|-------|
| Reja hujjati (shu fayl) | ✅ |
| F1.1 inventory | ✅ (qoralama) |
| F1.2 timeline | ✅ (qoralama) |
| F1.3 metadata CSV | ⏳ |
| Orcestor bootstrap | ⏳ (Supervisor buyrug‘i bilan) |
| Haqiqiy kod tahlili (F2+) | ⏳ faqat orcestor + agy orqali |

**Keyingi amal (Supervisor qarori):**
- A) F1.3 ni orcestor task sifatida rasmiylashtirish (metadata yig‘ish)
- B) Avval prioritet repolardan birini tanlab, orcestor bootstrap + birinchi fulldeep/architecture task
- C) Rejani tahrirlash / prioritet o‘zgartirish

---

*Bu hujjat faqat rejalashtirish uchun. Tahlil ishlari `orcestor-skill` ishga tushirilgandan keyin boshlanadi.*
