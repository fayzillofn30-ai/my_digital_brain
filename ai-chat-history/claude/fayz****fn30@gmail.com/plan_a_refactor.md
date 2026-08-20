# Plan a refactor

### 👤 Foydalanuvchi:

Give me a step-by-step framework for planning a module refactor: how to sequence changes safely and what to test at each stage.Aug 8

### 🤖 Claude:

Framework for Planning a Module Refactor
1. Establish a safety net before touching anything

Characterize existing behavior first. If tests don't already cover the module, write characterization tests that lock in current behavior (inputs → outputs), even if that behavior is imperfect. You're not testing "correctness" yet, just "s

Claude’s response was interrupted.
Edit prompt
Try again

---

### 👤 Foydalanuvchi:

Oʻzbek tilida

### 🤖 Claude:

Modulni qayta ishlash (refactoring) uchun bosqichma-bosqich reja
1. Har qanday ishni boshlashdan oldin "xavfsizlik to'ri" tayyorlang

Avval mavjud xatti-harakatni tasvirlab oling (characterization tests). Agar modul allaqachon testlar bilan qoplanmagan bo'lsa, joriy xatti-harakatni (kirish → chiqish) mustahkamlaydigan testlar yozing — hatto u mukammal bo'lmasa ham. Bu bosqichda maqsad "to'g'rilik"ni emas, balki "hozirgi holat qanday ishlayotganini" saqlab qolish.
Mavjud testlarni ishga tushiring va yashil holatni qayd eting. Refaktoringdan oldingi barcha testlar o'tishi kerak — bu sizning boshlang'ich nuqtangiz (baseline).
Modulning barcha "kirish nuqtalari"ni aniqlang — uni kim chaqiradi, qanday API/interfeys orqali foydalaniladi. Bu keyingi bosqichda "nima

Claude’s response was interrupted.
Edit prompt
Try again

---

### 👤 Foydalanuvchi:

https://github.com/moxxy-ai/moxxy/tree/development/.aiBular haqida qisqa tushuncha ber

### 🤖 Claude:

Searched the web

Searched the web

GitHub sahifasining o'zi (robots qoidalariga ko'ra) to'g'ridan-to'g'ri ochilmadi, lekin qidiruv orqali loyihaning umumiy konteksti topildi:

Moxxy — TypeScript'da yozilgan, blok-asosidagi (block-based), modulli "agentic loop" freymvork. Asosiy g'oyasi: LLM provayderlari, tool'lar, xotira, xavfsizlik va interfeyslarni (terminal, Telegram, HTTP) plagin sifatida almashtirish mumkin — barchasi avtomatik aniqlanadigan (auto-discovered) va hot-reloadable qilib qurilgan.

.ai papkasi haqida esa aniq ma'lumot topa olmadim — GitHub bu turdagi sahifalarga avtomatik kirishni cheklaydi, shuning uchun uning ichidagi fayllarni to'g'ridan-to'g'ri ko'ra olmadim. Odatda bunday .ai/ katalogi loyihalarda AI-agentlar (masalan, Claude yoki boshqa kodlash yordamchilari) uchun qo'llanmalar, konfiguratsiya yoki "context" fayllarini saqlash uchun ishlatiladi — Moxxy o'zi ham "loyiha uni ishlatuvchi agent tomonidan rivojlantiriladi" deb ta'kidlaydi, shu sababli .ai/ papkasi ehtimol shu agentlar uchun ko'rsatmalar yoki jarayon fayllarini o'z ichiga oladi.

Agar xohlasangiz, papka ichidagi aniq fayllar ro'yxatini (masalan, raw.githubusercontent.com orqali) siz ulashsangiz, men ularning mazmunini tahlil qilib bera olaman.

---

### 👤 Foydalanuvchi:

Pull qilib koʻr

### 🤖 Claude:

Fetched: GitHub - moxxy-ai/moxxy: Block-based, modular agentic loop framework for TypeScript. Swap LLM providers, loop strategies, tools, and frontends as auto-discovered and hot-reloadable plugins. Drive one Session from your terminal, Telegram, or HTTP.

Fetched: GitHub - moxxy-ai/moxxy: Block-based, modular agentic loop framework for TypeScript. Swap LLM providers, loop strategies, tools, and frontends as auto-discovered and hot-reloadable plugins. Drive one Session from your terminal, Telegram, or HTTP.

Bosh sahifani ochishga muvaffaq bo'ldim, endi .ai papkasining o'ziga kirib ko'raman.

Searched the web

Searched the web

Ha, AGENTS.md faylini ochib ko'rdim — bu .ai/ papkasi haqida to'liq tushuncha beradi.

.ai/ papkasi nima uchun kerak
Bu Moxxy loyihasidagi markaziy AI-katalog — turli AI kodlash agentlari (Claude Code, Codex va boshqalar) uchun yagona qo'llanmalar va ko'nikmalar (skills) manbai.

Asosiy tuzilma:

.ai/skills/ — ~28 ta qisqa, vazifaga yo'naltirilgan SKILL.md cheklistlar (dev-loop, har bir "extension point", tekshirish/debug retseptlari)
.ai/agents/ — chuqurroq workflow qo'llanmalari, masalan:

skill-author.md — yangi Markdown skill yaratish
plugin-author.md — yangi @moxxy/plugin-* paket yaratish
provider-author.md — yangi LLM provider qo'shish
bug-hunter.md — xatoni topish va izolyatsiya qilish
va yana o'nlab shunga o'xshash "author" fayllari

Muhim texnik detal: .claude/skills, .claude/agents, .codex/skills, .codex/agents — bularning barchasi .ai/ ga qaragan symlinklar, ya'ni asl fayllar faqat .ai/ ichida yashaydi, boshqa joyларда nusxalanmaydi. Bu bir xil qo'llanmani Claude Code va Codex kabi turli agentlar bir xilda ishlatishi uchun qilingan.

Qisqasi — bu papka loyihaning "agent uchun operatsion qo'llanma"si: har bir turdagi ish (yangi plagin, yangi tool, yangi kanal va h.k.) uchun aniq bosqichma-bosqich ko'rsatma beradi, shunda har qanday AI-agent loyihaga izchil va standartlarga mos tarzda hissa qo'sha oladi.

---

