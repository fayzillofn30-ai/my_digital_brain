agy --conversation=81ae6a32-5d9c-40cb-b35b-20ff99f5772a

# 🧠 Digital Brain — Multi-AI Pipeline

> G'oya: Bitta AI'ga hamma ishni yuklamasdan, har bosqich uchun eng mos vositani ishlatib, katta hajmdagi kod tahlilini avtonom ravishda Obsidian bilim bazasiga aylantirish.

---

## Umumiy oqim

```
[1] PLANNER  →  [2] PROJECTOR  →  [3] ORCHESTRATOR  →  [4] EXECUTER  →  [5] ANALYZER
 (Claude,        (Grok,            (Claude CLI)         (Gemini          (ChatGPT)
  mobile)         free)                                  Antigravity
                                                           CLI)
```

Har bosqich oldingisining natijasini kiruvchi ma'lumot sifatida oladi. Hech bir bosqich boshqasining ishini takrorlamaydi.

---

## Rollar

### 1. Planner — Claude (mobile, free plan)
**Kirish:** Foydalanuvchi bilan erkin muhokama (g'oya, cheklovlar, maqsad).
**Chiqish:** Yakuniy, muhokama qilingan reja — bitta `.md` fayl (fazalar, bosqichlar, deliverable nomlari).
**Vazifa emas:** Kod yozish, repo tahlili, avtomatlashtirish.

### 2. Projector — Grok (free plan, GitHub ulangan)
**Kirish:** Planner'dan kelgan `.md` reja.
**Chiqish:** Rejani `orcestor-skill` tushunadigan strukturaga o'tkazish — fazalarni aniq tasklarga bo'lish, repo ro'yxati bilan bog'lash.
**Vazifa emas:** Real kod tahlili qilish.

### 3. Orchestrator — Claude CLI
**Kirish:** Projector'dan kelgan task struktura.
**Chiqish:** Task queue — qaysi Executer, qaysi repo, qaysi bosqichni, qanday tartibda bajarishi.
**Vazifa:** Task'larni navbatlash, holatni kuzatish, Executer'ga topshiriq berish, natijani qabul qilish.

### 4. Executer — Gemini Antigravity CLI (worker agent)
**Kirish:** Orchestrator'dan bitta aniq task (masalan: "repo X uchun Fase 2.1 — folder structure tahlili").
**Chiqish:** Belgilangan formatdagi `.md` hujjat (masalan `ARCH-STRUCTURE-{repo}.md`).
**Vazifa:** Real repo'ni klonlash/o'qish, kodni tahlil qilish, natijani yozish.

### 5. Analyzer — ChatGPT
**Kirish:** Executer'lar tomonidan yaratilgan barcha `.md` hujjatlar.
**Chiqish:** Sintez, mosliklarni tekshirish, takrorlanishlarni topish, Vault uchun yakuniy tozalash/bog'lash tavsiyalari.
**Vazifa:** Sifat nazorati — reja bilan natija mosligini tekshirish.

---

## Nega bunday bo'lingan

- **Bitta AI context'i** katta loyihani (56+ repo, 6 faza) boshidan oxirigacha ushlab turolmaydi.
- Har vosita **o'z kuchli tomonida** ishlaydi: Claude — muhokama va struktura, Grok — tez task-splitting, Gemini CLI — avtonom bajarish, ChatGPT — tashqi nazorat/sintez.
- Xatolik bir joyda qolib ketmaydi — Analyzer bosqichi oxirida tekshiradi.

---

## Cheklovlar (barcha bosqichlar uchun umumiy)

- Fazalar **ketma-ket** boradi (1→2→3→4→5→6), parallel emas.
- Faqat foydalanuvchi **o'zi yozgan kod** tahlil qilinadi.
- Senior-darajadagi mavzular (performance, scalability, testing, kutubxona ichki qurilishi) qamrab olinmaydi.
- Har bosqich natijasi keyingi bosqich uchun **yagona haqiqat manbai** (single source of truth).

---

## Holat

- [x] G'oya va rollar aniqlangan
- [x] Har bosqich uchun aniq input/output formatlari (JSON/YAML schema)
- [x] Orchestrator ↔ Executer handoff protokoli
- [ ] Birinchi sinov repo bilan end-to-end test

---

## Loyiha fayllari

| Fayl | Mazmun |
|------|--------|
| `00-Meta/LOYIHA_REJASI.md` | Projector reja (fazalar, tasklar, prioritet) |
| `00-Meta/github-accounts-inventory.md` | Account + repo inventari |
| `00-Meta/timeline-master.md` | Bootcamp 30-kunlik timeline |
| `ai-chat-history/` | AI suhbatlari xulosalari (claude / grok / chatgpt / gemini) |
| `README.md` | Shu hujjat — Multi-AI Pipeline |
