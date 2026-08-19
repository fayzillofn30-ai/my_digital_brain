# Digital Brain — Pipeline Schemas & Handoff Protocol

**Rol:** Projector (Grok)  
**Sana:** 2026-08-11  
**Maqsad:** Orchestrator va Executer bir xil formatda gaplashishi uchun yagona kontrakt.

---

## 1. Umumiy qoidalar

- Barcha xabarlar **UTF-8**, asosan **YAML** yoki **Markdown + YAML frontmatter**.
- Til: **o‘zbek** (report matnlari), meta-maydonlar: inglizcha kalitlar.
- Har task **atomik**: bitta repo + bitta fase-bosqich (masalan F2.1).
- Fazalar ketma-ket: F1 tugamasdan F2 tasklar queue’ga qo‘yilmaydi.
- Single source of truth: har bosqichning chiqishi keyingisining yagona kirishi.

---

## 2. Bosqichlar bo‘yicha Input / Output

### 2.1 Planner → Projector

**Input (Planner chiqishi):**
```yaml
# plan.md (erkin markdown, lekin tavsiya etilgan struktura)
title: string
phases:
  - id: F1|F2|F3|F4|F5|F6
    name: string
    steps:
      - id: string          # masalan "2.1"
        deliverable: string # masalan "ARCH-STRUCTURE-{repo}.md"
        description: string
constraints:
  - "faqat dasturchi yozgan kod"
  - "senior mavzular yo'q"
  - "fazalar ketma-ket"
```

**Output (Projector chiqishi):** `task-catalog.yaml` + `repo-priority.yaml`  
(Quyida 3-bo‘lim.)

---

### 2.2 Projector → Orchestrator

**Input:** `task-catalog.yaml`, `repo-priority.yaml`, `github-accounts-inventory.md`, `timeline-master.md`

**Output:** task queue (Orchestrator shu katalogdan task tanlaydi)

---

### 2.3 Orchestrator → Executer (handoff)

**Format:** bitta fayl yoki stdin — `task-packet.yaml`

```yaml
task_id: "F2.1-4_oy_imtihon"          # unique
phase: "F2"
step: "2.1"
repo:
  owner: "fayzillo95"
  name: "4_oy_imtihon"
  clone_url: "https://github.com/fayzillo95/4_oy_imtihon.git"
  default_branch: "main"
deliverable:
  filename: "ARCH-STRUCTURE-4_oy_imtihon.md"
  path: "reports/F2/ARCH-STRUCTURE-4_oy_imtihon.md"   # workspace ichida
prompt_template: "architecture-structure"             # yoki fulldeep / request-lifecycle / ...
constraints:
  - "faqat dasturchi yozgan kod"
  - "node_modules, dist, build, .git o'tkazib yubor"
  - "senior mavzular (performance, testing, ...) yozilmasin"
  - "o'zbek tilida yoz"
  - "0-byte fayl tekshiruvi majburiy (klon buzilgan bo'lsa to'xta)"
acceptance_criteria:
  - "entry point aniq ko'rsatilgan"
  - "routes/controllers/models/services/middleware ajratilgan (agar bor)"
  - "papka daraxti qisqa keltirilgan"
  - "hech qanday uydirma yo'q — faqat o'qilgan kod"
timeout_minutes: 30
on_failure: "status=failed; qayta urinish Supervisorga"
```

**Executer qiladigan ish:**
1. Repo’ni klonlash / mavjud papkani tekshirish.
2. 0-byte / buzilgan klon tekshiruvi.
3. Kodni o‘qish (cheklovlar ichida).
4. `deliverable.path` ga `.md` yozish.
5. Natija paketini qaytarish (2.4).

---

### 2.4 Executer → Orchestrator (natija)

```yaml
task_id: "F2.1-4_oy_imtihon"
status: completed | failed | partial
deliverable_path: "reports/F2/ARCH-STRUCTURE-4_oy_imtihon.md"
summary: "Qisqa xulosa (2-4 jumla, o'zbekcha)"
metrics:
  files_read: 42
  lines_approx: 1800
  notes: "NestJS modules aniq ajratilgan"
errors: []          # failed bo'lsa sabab
duration_seconds: 180
```

Orchestrator:
- `status.md` / DB task holatini yangilaydi.
- `completed` bo‘lsa keyingi taskni beradi.
- `failed` bo‘lsa Supervisor’ga eslatma.

---

### 2.5 Orchestrator → Analyzer (to‘plam)

Faza yoki butun pipeline tugagach:

```yaml
batch_id: "F2-batch-2026-08-11"
phase: "F2"
reports:
  - path: "reports/F2/ARCH-STRUCTURE-4_oy_imtihon.md"
    task_id: "F2.1-4_oy_imtihon"
  - path: "reports/F2/ARCH-STRUCTURE-online-courses.md"
    task_id: "F2.1-online-courses"
plan_reference: "00-Meta/LOYIHA_REJASI.md"
```

**Analyzer chiqishi:**
```yaml
batch_id: "F2-batch-2026-08-11"
verdict: pass | needs_fix | fail
issues:
  - report: "..."
    problem: "takrorlanish / reja bilan nomuvofiqlik / bo'sh bo'lim"
    suggestion: "..."
synthesis_notes: "Umumiy xulosa"
vault_actions:
  - "backlink qo'sh: ..."
  - "tag: #nest #imtihon"
```

---

## 3. Projector chiqish fayllari (kataloglar)

### 3.1 `task-catalog.yaml` (fragment)

```yaml
version: 1
language: uz
phases:
  F1:
    name: Reconnaissance
    steps:
      - id: "1.1"
        deliverable_pattern: "github-accounts-inventory.md"
        prompt_template: "inventory"
      - id: "1.2"
        deliverable_pattern: "timeline-master.md"
        prompt_template: "timeline"
      - id: "1.3"
        deliverable_pattern: "repos-metadata.csv"
        prompt_template: "metadata-csv"
  F2:
    name: Code Architecture
    steps:
      - id: "2.1"
        deliverable_pattern: "ARCH-STRUCTURE-{repo}.md"
        prompt_template: "architecture-structure"
      - id: "2.2"
        deliverable_pattern: "DEPENDENCY-GRAPH-{repo}.md"
        prompt_template: "dependency-graph"
      - id: "2.3"
        deliverable_pattern: "CODE-METRICS-{repo}.md"
        prompt_template: "code-metrics"
      - id: "2.4"
        deliverable_pattern: "DESIGN-PATTERNS-{repo}.md"
        prompt_template: "design-patterns"
  F3:
    name: Request Lifecycle
    steps:
      - id: "3.1"
        deliverable_pattern: "REQUEST-ENTRY-{repo}.md"
        prompt_template: "request-entry"
      - id: "3.2"
        deliverable_pattern: "MIDDLEWARE-CHAIN-{repo}.md"
        prompt_template: "middleware-chain"
      - id: "3.3"
        deliverable_pattern: "ROUTER-CONTROLLER-{repo}.md"
        prompt_template: "router-controller"
      - id: "3.4"
        deliverable_pattern: "RESPONSE-ERROR-{repo}.md"
        prompt_template: "response-error"
      - id: "3.5"
        deliverable_pattern: "NESTJS-DECORATORS-GUARDS-{repo}.md"
        prompt_template: "nestjs-decorators"
        only_if: "stack contains nestjs"
  F4:
    name: Database & Query Patterns
    steps:
      - id: "4.1"
        deliverable_pattern: "DATABASE-SCHEMA-{repo}.md"
        prompt_template: "db-schema"
      - id: "4.2"
        deliverable_pattern: "QUERY-PATTERNS-{repo}.md"
        prompt_template: "query-patterns"
      - id: "4.3"
        deliverable_pattern: "TRANSACTIONS-{repo}.md"
        prompt_template: "transactions"
      - id: "4.4"
        deliverable_pattern: "ORM-PATTERNS-{repo}.md"
        prompt_template: "orm-patterns"
  F5:
    name: Business Logic & Algorithms
    steps:
      - id: "5.1"
        deliverable_pattern: "BUSINESS-LOGIC-{repo}.md"
        prompt_template: "business-logic"
      - id: "5.2"
        deliverable_pattern: "DESIGN-PATTERNS-F5-{repo}.md"
        prompt_template: "design-patterns-f5"
      - id: "5.3"
        deliverable_pattern: "VALIDATION-SECURITY-{repo}.md"
        prompt_template: "validation-security"
      - id: "5.4"
        deliverable_pattern: "ERROR-HANDLING-{repo}.md"
        prompt_template: "error-handling"
  F6:
    name: Obsidian Vault Construction
    steps:
      - id: "6.1"
        deliverable_pattern: "vault-folder-structure.md"
        prompt_template: "vault-structure"
      - id: "6.2"
        deliverable_pattern: "vault-linking-report.md"
        prompt_template: "vault-linking"
      - id: "6.3"
        deliverable_pattern: "INDEX.md"
        prompt_template: "vault-index"
      - id: "6.4"
        deliverable_pattern: "obsidian-config-notes.md"
        prompt_template: "obsidian-config"
```

### 3.2 `repo-priority.yaml` (sinov + asosiy navbat)

```yaml
version: 1
# Birinchi end-to-end sinov uchun bitta repo
pilot:
  - owner: fayzillo95
    name: 4_oy_imtihon
    reason: "NestJS imtihon — o'rtacha hajm, aniq stack"

priority_order:
  - 4_oy_imtihon
  - online-courses
  - e-commerce
  - e-commerce-backend
  - telegram_app_backend
  - telegram_app_front_end
  - mini-erp
  - StudentSYStemMenegment
  - youtubebackend
  - 6_oy_imtihon
  - edfix_clone
  # qolganlari selective / guruhlab
```

---

## 4. Orchestrator ↔ Executer handoff protokoli

### 4.1 Navbatlash

1. Orchestrator `task-catalog` + `repo-priority` dan keyingi taskni tanlaydi.
2. `task-packet.yaml` yozadi (`orcestor/tasks/` yoki DB `tasks` jadvali).
3. Executer (`agy`) taskni **atomik claim** qiladi (orcestor-skill dagi claim mexanizmi).
4. Bajaradi → natija paketi + deliverable fayl.
5. Orchestrator statusni yangilaydi; Analyzer’ga faqat faza/batch tugagach yuboradi.

### 4.2 Holat mashinasi

```
pending → claimed → running → completed
                         ↘ failed → (retry | escalate Supervisor)
```

### 4.3 Xatoliklar

| Holat | Harakat |
|-------|---------|
| Klon 0-byte / buzilgan | `failed`, sabab yoziladi, qayta klon Supervisorga |
| Timeout | `failed` |
| Deliverable yo‘q / bo‘sh | `partial` yoki `failed` |
| Cheklov buzilgan (senior mavzu yozilgan) | Analyzer `needs_fix` |

### 4.4 Orcestor-skill bilan bog‘lanish

- Bootstrap: `orcestor/` + `orcestor.config.env` (`LANGUAGE=uz`).
- `standing_rules`: cheklovlar ro‘yxati (faqat o‘zi yozgan kod, senior yo‘q, ketma-ket fazalar).
- Prompt shablonlari: `fulldeep_prompt_template.txt` asosida har `prompt_template` uchun alohida variant.
- Status: `orcestor/status.md` yoki DB.

---

## 5. Birinchi sinov (end-to-end) — reja

| Qadam | Kim | Nima |
|-------|-----|------|
| 1 | Projector | `task-catalog.yaml` + `repo-priority.yaml` (shu hujjat) |
| 2 | Orchestrator | Pilot task: `F2.1-4_oy_imtihon` packet yaratish |
| 3 | Executer | Repo tahlil → `ARCH-STRUCTURE-4_oy_imtihon.md` |
| 4 | Orchestrator | Status completed |
| 5 | Analyzer | Bitta report bo‘yicha sifat tekshiruvi |

Pilot: pilot o‘tadi → F1.3 metadata yoki F2 qolgan steplar.

---

## 6. Holat (README bilan sinxron)

- [x] G‘oya va rollar
- [x] Input/output formatlari (shu hujjat)
- [x] Orchestrator ↔ Executer handoff protokoli
- [ ] Birinchi sinov repo bilan real E2E (Orchestrator + Executer ishga tushishi kerak)

---

*Projector chiqishi. Keyingi bosqich — Orchestrator (Claude CLI) ushbu katalog asosida queue ochadi.*
