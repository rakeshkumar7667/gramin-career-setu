# Gramin Career Setu — Project Reality Audit & Workflow Report

**Date:** 31 October 2026
**Scope:** Full codebase audit against the stated Problem Statement and Proposed Solution
**Nature of this document:** Analysis only. No code was changed.
**Project type:** B.Tech CSE — Community Service Project (CSP)

---

## 0. Executive verdict

**Is the solution worthy for the problem?** The *idea* is strongly worthy. The *current
implementation* is not yet solving the stated problem, because the product that got built
drifted away from the user it was written for.

Three sentences summarise the audit:

1. **The problem statement is real and well-chosen.** Rural AP students genuinely lack
   consolidated, Telugu-first, low-bandwidth career information. This is a legitimate,
   defensible CSP problem.
2. **The built product serves a different user than the one in the problem statement.**
   The flagship job portal lists six urban IT jobs (TCS / Infosys / Wipro / Accenture /
   Zoho) requiring B.Tech, at ₹4–10 LPA, in Hyderabad / Bengaluru / Chennai. The default
   career roadmap is `10th → Intermediate → B.Tech in CSE → Internship → Job Placement`.
   The resume builder's prefilled sample is a B.Tech CSE graduate with Java/React/SQL and
   an NPTEL certificate. A 10th-pass or ITI student from a village is nowhere in this
   product. Meanwhile `data/jobs.csv` — which contains exactly the right data (Grama
   Sachivalayam, Postal Assistant, Police Constable, Railway Group D, Bank Clerk, with
   Telugu titles, 10th/Inter qualification levels, official apply URLs, prep time and
   free study resources) — **is never loaded by any page.**
3. **There is fabricated data presented as real,** which is the single largest risk to the
   CSP evaluation (Section 4). Impact numbers, testimonials and "verified" job listings
   are invented. The project's own context document explicitly forbids this.

**Bottom line:** the architecture, the scaffolding and the design work are over-built;
the *content and the workflow for the actual target user* are under-built. The correct
move is a deliberate **scope reduction**, not more features.

---

## 1. What the project actually is (inventory vs. documentation)

Your context document describes a 5-page, no-backend, vanilla static PWA. That is not
what exists on disk.

| | Documented | Actual |
|---|---|---|
| HTML pages | 5 | **22** |
| Backend | "No backend, no auth, no DB" | **Spring Boot 3.3.5 monolith**, 11 domains, 38 REST endpoints, 6 Flyway migrations, JPA entities, audit log, rate limiter |
| Database | localStorage only | **PostgreSQL 16 / MySQL 8 / H2**, + Redis 7 |
| Auth | none | **Three parallel systems**: localStorage demo users, custom Spring JWT, Keycloak 24 OIDC |
| Hosting | GitHub Pages | **Docker Compose** (postgres + redis + keycloak + backend) + a Node reverse-proxy (`server.js`) |
| i18n store | `data/lang.json` | `assets/i18n-dict.js` (262 keys) — `lang.json` does not exist |
| Shared JS | `assets/script.js` | `app.js` (51 KB) + `auth.js` (38 KB) + `api.js` (23 KB) + `i18n-dict.js` (34 KB) + `actions.js` + `landing.js` |
| Charting | Chart.js 4.4.1 | **Chart.js is not present anywhere in the codebase** |
| CI | — | GitHub Actions (Maven + Node + Docker build) |

### Pages that exist
`index`, `jobs`, `job-detail`, `careers`, `career-detail`, `quiz`, `quiz-results`,
`resume`, `resume-preview`, `roadmap`, `workshops`, `scholarships`, `schemes`,
`resources`, `stories`, `results`, `dashboard`, `profile`, `login`, `about`, `404`,
`admin/index`.

**Implication for the report you will submit:** your project documentation and your
codebase currently describe two different projects. Whichever direction you choose, this
must be reconciled before submission, or the first question in the viva will be about it.

---

## 2. Target user — stated vs. served

### 2.1 Who the problem statement names

| Segment | Realistic education level | What they actually need |
|---|---|---|
| Rural school students (9th–10th) | 10th pass | "What are my options after 10th?" — Polytechnic, ITI, Intermediate streams |
| Intermediate students | 12th pass | Degree vs ITI vs direct govt exam (Railway Group D, SSC MTS, Police Constable) |
| ITI / vocational students | ITI certificate | Apprenticeships (NAPS), electrician/fitter/CNC openings, PSU trade posts |
| Degree students / recent graduates | Degree | APPSC/TSPSC, IBPS, SSC CGL, Grama Sachivalayam, BPO/voice process |
| Unemployed youth | Varies, often 10th/Inter | Any nearby, no-fee, achievable opening + how to apply |
| Entrepreneurship-interested youth | Varies | PMEGP, MUDRA, RSETI training, NABARD |

The common denominators: **low qualification floor, Telugu-first, within the district,
free to apply, and a concrete next step.**

### 2.2 Who the product currently serves

Evidence from the code:

| Finding | Location |
|---|---|
| 5 of 6 job listings are urban IT roles at TCS, Infosys, Wipro, Accenture, Zoho; all flagged `verified: true`; `education: 'B.Tech / BE in CS / IT / MCA'`; `salary: '₹ 6 – 10 LPA'` | [assets/app.js:21-230](../assets/app.js#L21) |
| The jobs page the student actually sees is 6 hardcoded cards: Software Developer, System Engineer, Associate Software Engineer, Software Engineering Analyst, Product Intern — locations Hyderabad / Bengaluru / Chennai / Remote | [jobs.html:234-440](../jobs.html#L234) |
| Default career roadmap stages: 10th → Intermediate → **B.Tech in CSE** → Internship → Job Placement; section titled "Top Career Options in Software / IT" | [roadmap.html](../roadmap.html) |
| Resume builder's prefilled profile: CSE graduate, Java/React/SQL, "1st Prize State-level Hackathon 2023", "NPTEL Elite Certificate" | [assets/resume-builder-engine.js:32-68](../assets/resume-builder-engine.js#L32) |
| `data/jobs.csv` — the correct, Telugu, 10th-pass-friendly government/ITI job data — is read by **no page and no script** | [data/jobs.csv](../data/jobs.csv) |

**Diagnosis:** the product was built against the developer's own persona (B.Tech CSE
student looking for IT placement), not the CSP's beneficiary. This is the root cause of
most other findings in this report. A rural ITI student opening this app finds nothing
they can apply for.

---

## 3. Does the solution actually solve each stated problem?

| # | Stated problem | Current status | Evidence |
|---|---|---|---|
| 1 | Lack of career awareness | **Partially.** `careers.html` has 8 career cards (Civil Engineer, Teacher, SI, Nurse, Software Dev, Bank Officer, Agri Officer, Entrepreneur) — genuinely useful and on-target. Best-aligned module in the project. | careers.html |
| 2 | Limited job information | **Not solved — actively counter-productive.** The listings shown are unreachable IT jobs. The relevant dataset is unused. No deadlines, no source attribution, no district filter. | §2.2 |
| 3 | Language barriers | **Partially.** 262 Telugu keys and a self-hosted Noto Sans Telugu font — good. But coverage is uneven: `login.html` has 5 translated keys in a 47 KB page, `dashboard.html` has 8. `results.html` headings ("Impact Overview", "Top Reached Villages") are hardcoded English. ~2,300 inline-styled English strings bypass i18n entirely. | i18n key counts per page |
| 4 | Poor connectivity | **Weakened by its own implementation.** A service worker exists and precaches — but it precaches **3.7 MB across 79 files**, including 2 MB of hero JPEGs (170–220 KB each). Every page also pulls **326 KB of shared CSS+JS** before first paint. On rural 2G/3G this is the opposite of low-bandwidth. | [assets/sw.js:6](../assets/sw.js#L6) |
| 5 | Lack of career guidance | **Partially.** The 5-question quiz with weighted scoring across government/ITI/BPO/business is sound, honest in its wording, and bilingual. Genuinely the second-best module. Thin (5 questions), but defensible. | assets/quiz.js |
| 6 | Difficulty creating resumes | **Broken for the target user.** 5 templates, 5 colour themes, ATS scoring — but `new jsPDF()` is used with default fonts and **no Telugu font is ever registered** (`addFont` appears nowhere). A Telugu-first app therefore cannot produce a Telugu PDF. The prefilled sample is a B.Tech resume. | [assets/resume-builder-engine.js:1245](../assets/resume-builder-engine.js#L1245) |
| 7 | Limited digital literacy | **Not addressed.** No "how to apply online" walkthrough, no explanation of what a registration number or OTP is, no guided first-application flow. This was an explicit objective. |  |
| 8 | Measuring awareness improvement | **Not solved, and fabricated.** See Section 4. There is **no before/after survey comparison anywhere** — the stated core CSP metric does not exist. | results.html |

**Score: 0 of 8 problems fully solved; 4 partially; 2 solved-in-appearance-only.**

---

## 4. CSP integrity risks — highest priority

Your own context document states: *"Never fabricate job listings, workshop statistics, or
project results"* and *"Never present sample or illustrative values as real survey
findings."* The code violates this in four places. For a Community Service Project, where
the deliverable is evidence of real community impact, this is the most serious category of
finding in this report — more serious than any bug.

### 4.1 Fabricated impact dashboard
`results.html` is the CSP evaluation centrepiece. It presents:

- **"5,758 Lives Impacted"**, **"1,102 Applications Sent"**, "+20% mo" growth badges — all hardcoded ([results.html:207-217](../results.html#L207))
- A "Top Reached Villages" table with Gudur / Penumaka / Tenali / Nuzvid and scores "20/20", "650 lives impacted" — invented
- A line chart whose source comment literally reads `<!-- SVG Line Chart Mockup -->` — hand-drawn `<polyline>` points, not data ([results.html:230](../results.html#L230))
- A donut chart with hardcoded `stroke-dasharray` percentages
- **No before/after survey comparison** — the one metric the CSP actually calls for

### 4.2 Fabricated testimonials presented as real
`stories.html` leads with *"Real stories from our villages. Real people. Real impact."*
and then presents named individuals — Sandeep Kumar, Lalitha Kumari, Ramesh Babu — with
portrait photographs (`profile-lalitha.jpg`, `profile-ramesh.jpg`, `profile-suresh.jpg`)
and success narratives. If these are not real consented participants, the page is
asserting something false about named people.

### 4.3 Fabricated job listings attributed to real companies
Six listings carry `verified: true`, real company names (Tata Consultancy Services,
Infosys Limited, Wipro Limited, Accenture Solutions, Zoho Corporation), invented salary
bands and invented requirement lists. Publishing fake vacancies under real employers'
names is a legal and ethical exposure independent of the CSP marking.

### 4.4 Fake backend operations
- `syncGoogleSheets()` is a 1.5-second `setTimeout` that then toasts *"✅ Google Sheets synced! 12 new jobs & 4 workshops fetched."* Nothing is fetched. ([assets/app.js:939](../assets/app.js#L939))
- Workshop registration posts a hardcoded fallback phone number `'9876543210'` to the backend when no user is logged in, writing junk rows into the real registrations table. ([assets/actions.js:71](../assets/actions.js#L71))
- `QA_FULL_REPORT.json` reports every category passing with zero failures; `README.md` claims a *"100% Automated Test Pass Rate"*. The actual frontend test suite is 8 tests, most of which are `assert.match()` string greps against HTML source — they verify that certain text exists in a file, not that any feature works. `npm audit` runs against a dependency tree of zero packages.

---

## 5. Actual workflow trace — what a real student experiences

This is the end-to-end reality, derived from the code rather than the documentation.

```
Student opens app (first visit, village 3G)
  ↓  downloads 326 KB CSS+JS + a 178 KB hero JPEG before first paint
  ↓  service worker then precaches 3.7 MB in the background
index.html  ── Telugu-first, well translated (112 keys) ──  OK
  ↓
┌─ Jobs ─────────────────────────────────────────────────────────┐
│ Sees 6 hardcoded urban IT jobs needing B.Tech, ₹4–10 LPA       │
│ Filter dropdown offers "Government PSUs" / "Banking" →         │
│   all 6 cards are data-category="Software"|"Internship", so    │
│   selecting Government ALWAYS returns zero results             │
│ Search/filter = client-side show/hide of static HTML           │
│ api.js is loaded on this page but never called                 │
│ Apply → modal collects name/phone/village → POSTs to           │
│   /api/v1/jobs/{id}/apply (permitAll, no auth)                 │
│ Outcome for target user: nothing applicable. Dead end.          │
└────────────────────────────────────────────────────────────────┘
┌─ Quiz ─────────────────────────────────────────────────────────┐
│ 5 bilingual questions, weighted scoring → 4 tracks             │
│ Result saved to localStorage, also POSTed to /quiz/submit      │
│ Scoring logic exists TWICE: assets/quiz.js and                 │
│   backend QuizService.java — two independent implementations    │
│   of the same weights that can silently disagree               │
│ Outcome: works, honest wording, genuinely useful. KEEP.         │
└────────────────────────────────────────────────────────────────┘
┌─ Resume ───────────────────────────────────────────────────────┐
│ Form prefilled with a fake B.Tech CSE resume                   │
│ 5 templates, 5 colour themes, ATS score meter                  │
│ Export → jsPDF default fonts → Telugu text CANNOT render       │
│ Outcome: an English-only PDF, in a Telugu-first app.            │
└────────────────────────────────────────────────────────────────┘
┌─ Login / Signup ───────────────────────────────────────────────┐
│ OTP is generated IN THE BROWSER and shown to the user:         │
│   "Demo code is: {pending.otpCode} or 123456"                  │
│ Master bypass code '123456' always works                        │
│ Password check: any account logs in with 'password123'          │
│   or 'demo123' regardless of stored hash                        │
│ Error message prints working demo credentials                   │
│ Accounts + PII stored in localStorage, device-local             │
│ Outcome: security theatre. Also: accounts were never in scope.  │
└────────────────────────────────────────────────────────────────┘
┌─ Dashboard ────────────────────────────────────────────────────┐
│ Counters read from localStorage (saved jobs, quiz, resume,     │
│   workshops) — these are REAL per-user values. Good.            │
│ But the backend has user accounts and the dashboard ignores     │
│   them, so "progress" dies on device change / cache clear       │
└────────────────────────────────────────────────────────────────┘
┌─ Impact dashboard (results.html) ──────────────────────────────┐
│ Hardcoded fabricated statistics. See Section 4.1.               │
└────────────────────────────────────────────────────────────────┘
```

**The workflow the project identity promises** — Assess → Explore → Prepare → Progress —
**is not wired.** Nothing carries forward:

- Quiz says "ITI / Technical" → Jobs page cannot filter to ITI jobs (none exist in it)
- Quiz result → Roadmap does not consume it; roadmap asks for inputs again
- Quiz result → Resume builder does not pre-shape the objective or skills
- Resume → Job application: the apply modal has a resume-file picker, but the resume the student just built is not attached
- Nothing uses district/village to narrow anything, despite village being collected

The four modules are four islands.

---

## 6. Waste, dead weight, and duplication — the removal list

### 6.1 Dead UI controls
**68 buttons across 17 pages** are wired to `GCS_ACTIONS.notAvailable(...)`, which shows a
"not available" toast.

| Count | What | Verdict |
|---|---|---|
| 45 | Facebook / Instagram / YouTube footer links on 15 pages | **Delete.** The project has no social presence; three dead icons per page, 15 times over. |
| 23 | Advertised features that do nothing: Workshop scheduling, Volunteer registration, Recording links (×4), Offline resource vault, Offline downloads vault, Mentor review, ATS deep check, Spell check, Notifications, Job publishing, Scheme editor, Scholarship editor, Resource upload, Resource requests, Analytics export, 3 × video story | **Delete or build.** Advertising a feature and then disclaiming it is worse than not showing it. In a CSP demo, every one of these is a question you cannot answer well. |

### 6.2 Pages to cut or merge
The project has 22 pages for what is a 5-module product. Candidates:

| Page | Issue | Recommendation |
|---|---|---|
| `results.html` | Fabricated impact data; no before/after survey | **Rebuild from real survey data** (it is the CSP deliverable) or remove |
| `stories.html` | Fabricated named testimonials | **Remove** until real consented stories exist |
| `jobs.html` + `job-detail.html` | Two job datasets, neither correct | **Rebuild from `data/jobs.csv`**; merge detail into an expandable card |
| `roadmap.html` | Duplicates quiz output with a B.Tech-CSE path | **Merge into quiz-results** as the "next steps" section, rewritten for rural paths |
| `resume-preview.html` | Separate page for what should be a preview panel | **Merge into `resume.html`** |
| `careers.html` + `career-detail.html` | On-target and good | **Keep**, and make the quiz link into it |
| `profile.html`, `dashboard.html`, `login.html`, `admin/index.html` | Exist only to support an account system that was never in scope and whose auth is non-functional | **Remove** (see 6.3) |
| `about.html`, `404.html` | Fine | Keep |

### 6.3 Architecture to retire
The Spring Boot + PostgreSQL + Redis + Keycloak + Docker + Node-proxy stack is
**impressive engineering that actively harms this project**:

- It cannot be hosted free. GitHub Pages cannot run it. A CSP has no hosting budget, so **the app as built cannot be deployed for the community it serves** — which defeats the entire purpose.
- It adds three auth systems, 38 endpoints and 6 migrations to support features (accounts, admin CRUD, audit logs, applications tracking) that the problem statement lists under **"Current Limitations"** and **"Future Scope"** — i.e. explicitly not-yet-scope.
- It duplicates the quiz scoring engine, creating a correctness hazard.
- It makes the offline story worse, not better: the frontend must now handle online/offline/queued/conflict states (`gcs_offline_queue`) for operations the student did not need.
- `keycloak/realm-export.json` + the OIDC path in `auth.js` are a fourth auth mechanism that is never used.

**Recommendation:** keep the backend in the repository as a documented, honestly-labelled
*"Future Scope — Phase 2 prototype"*, and make the **submitted, demonstrated, deployed
product the static PWA** that the problem statement actually calls for. This is not giving
up work; it is correctly classifying it. Your own context document says: *"Do not
unnecessarily introduce a backend or frontend framework… Preserve the lightweight
architecture."*

### 6.4 Data duplication — four job datasets
| Source | Content | Used by |
|---|---|---|
| `data/jobs.csv` | **Correct**: 20 AP govt/ITI jobs, Telugu titles, 10th/Inter qualifications, official URLs, prep time, free resources | **nothing** |
| `assets/app.js` `JOBS_DATABASE` | 6 jobs, 5 fabricated IT roles | `job-detail.html` only |
| `jobs.html` inline cards | 6 fabricated IT roles | what the student sees |
| `backend/.../V2__seed_jobs_from_csv.sql` | seeded jobs | the REST API |

**One dataset must become the single source of truth. It should be `data/jobs.csv`.**

### 6.5 CSS and styling waste
- **5 stylesheets on every page**: `fonts/text.css` + `tokens.css` + `style.css` + `saas.css` + `landing.css` = **145 KB**, of which `landing.css` alone is 70 KB.
- **~2,300 inline `style="…"` attributes** across the pages (`login.html` 192, `resume.html` 176, `jobs.html` 165, `resources.html` 156, `dashboard.html` 152). A design-token system exists in `tokens.css` and is largely bypassed.
- Consequence: a single colour or spacing change cannot be made in one place; the "consistent design system" requirement is not actually met in the markup.

### 6.6 Images
2.0 MB of hero JPEGs, 100–220 KB each, at least one per page, all precached by the service
worker. For a low-bandwidth rural audience these should be ~20–40 KB WebP, or replaced by
the SVGs already present (which are 2–5 KB and look fine).

### 6.7 Repository clutter
`generate_overview_pdf.py` (35 KB), `Gramin_Career_Setu_Project_Overview.pdf`,
`QA_FULL_REPORT.json`, `backend/target/` (committed build output), and the three PDFs/DOCX
in the parent directory. Also `README.md` contains a *"How Google Antigravity Was Used"*
section — hackathon framing in a CSP submission.

---

## 7. Security and privacy findings

Ranked by relevance to a CSP that will collect real students' data at workshops.

| Severity | Finding | Location |
|---|---|---|
| **High** | Client-side OTP: the code is generated in the browser, stored in `localStorage`, and **displayed to the user** in the error message (`"Demo code is: {otp} or 123456"`). Master bypass `'123456'` always validates. Zero security value. | [assets/auth.js:690-696](../assets/auth.js#L690) |
| **High** | Universal password bypass: `if (expectedHash && inputHash !== expectedHash && password !== 'password123' && password !== 'demo123')` — any account is accessible with either literal password. | [assets/auth.js:539](../assets/auth.js#L539) |
| **High** | `POST /api/v1/jobs/{id}/apply` is `permitAll` and accepts name + phone + village. Unauthenticated PII intake with no CAPTCHA and no consent text. | [SecurityConfig.java:87](../backend/src/main/java/com/gramincareersetu/auth/SecurityConfig.java#L87) |
| **High** | `POST /api/v1/workshops/{id}/cancel` is `permitAll` and identifies the registrant **by phone number alone** — anyone can cancel another student's workshop registration by guessing a phone number. | [SecurityConfig.java:90](../backend/src/main/java/com/gramincareersetu/auth/SecurityConfig.java#L90) |
| **Medium** | Demo credentials (`9876543210` / `9440123456` / `9848012345`, password `password123`) are printed in a user-facing error message. | [assets/auth.js:535](../assets/auth.js#L535) |
| **Medium** | Student PII (name, phone, village, full resume) is persisted in `localStorage` unencrypted on shared/family devices, with no clear-data control and no privacy notice. |  |
| **Medium** | `'unsafe-inline'` in the CSP `script-src`, which is unavoidable given ~2,300 inline styles and many `onclick=` handlers — but it removes most of the CSP's value. | [server.js:33](../server.js#L33) |
| Low | SHA-256 of a demo password shipped in client source. | [assets/auth.js:21](../assets/auth.js#L21) |

**Good practice already present** (credit where due): `.env` is correctly gitignored and
untracked; `escapeHtml()` is used for dynamic rendering; `server.js` blocks encoded path
traversal and backend/script/config paths, and this is actually covered by a real test;
the backend has a rate-limiting filter, an audit log, and a PII utility.

---

## 8. Is the solution worthy? — honest assessment

### Where it is genuinely worthy
- **The problem is real, local, and verifiable.** Rural AP students do lack a Telugu-first consolidated career resource. This is a strong CSP problem.
- **Telugu-first with a self-hosted Noto Sans Telugu font** is the right call and is correctly done for on-screen rendering.
- **Offline-first via PWA** is exactly the right architectural instinct for the constraint.
- **The quiz** is honest, bilingual, and the four tracks (government / ITI / BPO / business) are the right four for this audience.
- **`careers.html`** — Civil Engineer, Teacher, SI, Nurse, Bank Officer, Agricultural Officer, Entrepreneur — is well-targeted content.
- **`data/jobs.csv`** shows real research into what rural students can actually apply for. It is the best artefact in the repository, and it is the one thing nobody can see.
- **A free PDF resume builder** removes a genuine ₹100–300 shop cost.

### Where it is not yet worthy
- The job portal, the project's core promise, shows jobs the target user cannot get.
- The Telugu resume PDF — the headline differentiator — does not work.
- The impact measurement, the CSP's actual deliverable, is fabricated.
- The app cannot be deployed for free, so it cannot reach the community.
- The digital-literacy objective ("how to apply online") is entirely unimplemented.
- Four of the eight modules are competing with each other rather than connecting.

### The hard question a CSP evaluator will ask
> *"How many real rural students used this, and what changed for them?"*

The current answer would have to be: the impact numbers are illustrative, and the app in
its present form has no free deployment target. **Fixing that one question is worth more
marks than any feature.**

---

## 9. Proposed workflow — the connected product

The project identity is **Assess → Explore → Prepare → Progress**. Right now those are
four islands. This is what wiring them looks like, with no new infrastructure.

### 9.1 One spine, carried in localStorage

```
          ┌──────────────────────────────────────────────┐
          │  gcs_student  (one object, localStorage)     │
          │  { lang, education, district,                │
          │    quizTrack, quizScores, resume, saved[] }  │
          └──────────────────────────────────────────────┘
                   written by every step, read by every step
```

### 9.2 The flow

```
STEP 0  ENTRY (index.html)
        Two questions only, in Telugu:
          "మీ చదువు?"  10th / Inter / ITI / Degree / Other
          "మీ జిల్లా?"  district dropdown
        → writes education + district. Skippable, remembered.
        Why: every downstream screen can now filter to what this
        student can actually apply for. Nothing else in the app
        currently knows the student's qualification.

STEP 1  ASSESS (quiz.html → quiz-results.html)
        5 questions (keep as-is; honest wording is already right)
        → writes quizTrack + quizScores
        Results page ends with ONE primary action, not six:
          "ITI jobs you can apply for with 10th pass  →"

STEP 2  EXPLORE (jobs.html, rebuilt from data/jobs.csv)
        Default view = jobs.csv filtered by:
             qualification ≤ student.education
          AND category matches student.quizTrack
          AND district near student.district
        Each card shows, in Telugu:
          title · qualification needed · exam name · salary band
          preparation time · "Apply here" (official URL)
          "Free study material" (official URL)
          last verified date  ← honesty, and it is already in the CSV
        Filters that produce zero results are hidden, not offered.
        No fabricated listings. No "verified" badge we cannot back up.

STEP 3  PREPARE (resume.html)
        Objective + skills pre-seeded from quizTrack and education
          (so an ITI student gets an ITI-shaped resume, not a CSE one)
        ONE template. Telugu font registered with jsPDF via addFont.
        → writes resume
        Then: "How to apply online" — a 6-step Telugu walkthrough
          with screenshots of a real portal (this is objective #6,
          currently missing entirely, and it is cheap to build)

STEP 4  PROGRESS (dashboard.html, trimmed)
        Saved jobs · quiz track · resume ready? · applications tried
        All from localStorage. No account needed. No login wall.

STEP 5  MEASURE (results.html, rebuilt — the CSP deliverable)
        Real before/after workshop survey, 3 questions:
          Q1 Can you name 3 career paths after your qualification?
          Q2 Do you know how to apply for a job online?
          Q3 Can you produce a PDF resume?
        n = actual participants, stated on the page.
        Grouped bar chart, before vs after, percentage-point delta.
        Methodology note: dates, villages, sample size, consent.
        If no survey has been run yet, the page says so.
```

### 9.3 What this changes

| | Now | Proposed |
|---|---|---|
| Entry friction | Login page with 3 broken auth systems | Two Telugu dropdowns, skippable |
| Jobs shown | 6 fabricated urban IT roles | ~20 real, qualification-matched, district-aware, with official links |
| Modules | 4 islands | 1 spine, each step feeds the next |
| Pages | 22 | ~10 |
| Per-page payload | 326 KB CSS+JS + 178 KB image | target < 100 KB total |
| Precache | 3.7 MB | target < 600 KB |
| Deployability | Docker + Postgres + Redis + Keycloak (no free host) | GitHub Pages, free, forever |
| Impact evidence | fabricated | real survey, stated n, stated method |
| Accounts | 3 broken systems | none needed (listed under Future Scope, honestly) |

---

## 10. Better / alternative solutions for this problem

Ranked by impact-per-effort for a CSP, which is judged on community outcome rather than
engineering surface area.

### Tier 1 — highest return, lowest effort

**1. Make `data/jobs.csv` the product.**
The single highest-value change in the entire project. The data is already researched and
correct. Surfacing it with a qualification filter turns a dead end into the app's core
value. Effort: low. Impact: transforms the product.

**2. "What after 10th / Inter / ITI / Degree?" as the landing question.**
This is the actual question rural students ask. It is not currently asked anywhere. It
costs two dropdowns and it reframes the entire app around the user instead of around
job-board conventions.

**3. The "How to apply online" walkthrough.**
Stated objective #6, completely unbuilt. One Telugu page with annotated screenshots of a
real portal (registration → photo upload → fee → hall ticket → what a registration number
is) addresses the digital-literacy gap more directly than any other feature, and needs no
code at all.

**4. Fix the Telugu PDF.**
Embed Noto Sans Telugu as base64 TTF and register it with `addFont()`. It is the project's
headline differentiator and it currently does not function. Drop from 5 templates to 1
that actually renders Telugu.

**5. Run the real workshop survey and publish it honestly.**
This is the CSP deliverable. Three questions, before and after, one village, 30 students.
A real n=30 with a stated method beats a fabricated n=5,758 in every rubric, and it is the
only thing that answers the evaluator's main question.

### Tier 2 — high value, moderate effort

**6. Offline-first district job pack.**
Let a student download their district's jobs as a single small JSON once (on the village
library's or a volunteer's connection) and browse it offline for weeks. This serves the
connectivity constraint far better than precaching 2 MB of hero photography.

**7. Printable Telugu one-pagers.**
A4 PDFs per career track — "10th పాస్ తర్వాత 10 ఉద్యోగ మార్గాలు" — with QR codes to the
official portals. Volunteers can print and distribute these. They reach students who have
no smartphone at all, which the app by definition cannot.

**8. WhatsApp-first distribution.**
Rural information travels on WhatsApp, not on bookmarks. Give every job card a "share on
WhatsApp" link that composes a Telugu message with the title, qualification and official
URL. Near-zero code, large reach multiplier.

**9. Deadline and verification discipline.**
Add `last_verified` and `closes_on` to the CSV, show both on every card, and grey out
expired listings. This converts a "fake job board" liability into a trustworthiness
feature — and is explicitly called out in your own context document.

**10. Volunteer/coordinator mode with no backend.**
Instead of an admin panel with a database, give a coordinator a single page that reads a
locally-held CSV and prints workshop attendance sheets and survey forms. Serves the real
workflow (paper at a village workshop) at a fraction of the complexity.

### Tier 3 — honest Future Scope, do not build for this CSP
Accounts and saved profiles; application tracking; the Spring Boot/Postgres/Keycloak
stack; SMS OTP (needs a paid gateway and real consent handling); personalised
roadmaps; employer-side posting. Keep all of it in the Future Scope section — an honestly
scoped Future Scope earns marks; a half-working implementation loses them.

### Deliberate counter-proposal
Consider whether the project should be **a Telugu career-information PWA plus a printable
workshop kit**, rather than a job portal. Job portals must be continuously maintained to
stay honest — a stale job board is worse than none, and after your CSP ends nobody will
update the CSV. Career *information* (what qualifications lead where, which exams exist,
which official portals to watch, how to apply online) stays true for years, needs no
maintenance, and serves the stated problem — *lack of awareness* — more durably. This is
worth a deliberate decision rather than a default.

---

## 11. Recommended sequence (report only — nothing has been changed)

**Phase A — Integrity (do first, non-negotiable for a CSP)**
1. Remove or clearly re-label every fabricated figure in `results.html`
2. Remove `stories.html` until real consented stories exist
3. Remove the fake "verified" IT job listings
4. Delete `syncGoogleSheets()`'s fake toast; delete the `'9876543210'` fallback phone
5. Soften `README.md` / `QA_FULL_REPORT.json` claims to what the tests actually prove

**Phase B — Serve the right user**
6. Rebuild `jobs.html` from `data/jobs.csv` with a qualification filter
7. Add the education + district entry step and the `gcs_student` spine
8. Rewrite `roadmap.html` for 10th / Inter / ITI / Degree paths (drop the B.Tech CSE default)
9. Replace the resume builder's fake sample profile with an ITI/Inter-appropriate one

**Phase C — Make the differentiators work**
10. Register the Telugu font with jsPDF; reduce to one working template
11. Build the "How to apply online" Telugu walkthrough
12. Complete i18n on `login` / `dashboard` / `results`

**Phase D — Fit the constraint**
13. Remove the 45 dead social links and the 23 dead feature buttons
14. Compress images to WebP; trim the service-worker precache to essentials
15. Consolidate 5 stylesheets; move inline styles into `tokens.css` classes

**Phase E — Evidence**
16. Run the real before/after workshop survey
17. Rebuild `results.html` from that data with a stated methodology

**Phase F — Honest scoping**
18. Move the backend to a documented "Phase 2 prototype"; deploy the static PWA on GitHub Pages
19. Reconcile the project documentation with the shipped codebase

---

## 12. What to keep, unchanged

Credit where it is due — these are good and should not be touched:

- The **quiz** engine and its honest result wording
- `data/jobs.csv` — the best-researched artefact in the project
- `careers.html` career cards — correctly targeted content
- The **Telugu-first** decision and the self-hosted Noto Sans Telugu font
- The **PWA / offline-first** architectural instinct
- `assets/tokens.css` — a real design-token system (it just needs to be used)
- `server.js` path-traversal hardening, and the test that covers it
- `escapeHtml()` usage for dynamic rendering
- `.env` correctly gitignored and untracked
- `assets/pdf-loader.js` — lazy-loading jsPDF instead of shipping 364 KB everywhere is
  exactly the right instinct, and its code comment shows the reasoning clearly

---

*End of report. No files other than this document were created or modified.*
