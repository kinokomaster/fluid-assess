# IVC & VExUS Interactive Learning Module

## Project Overview

A web-based interactive learning module that teaches bedside ultrasound assessment of volume status using IVC (inferior vena cava) and VExUS (Venous Excess Ultrasound) techniques. Built as a medical education (MedEd) project for internal medicine learners (residents, fellows, attendings).

The module is designed to be **embedded in an existing Google Sites page** managed by the chief medical resident, with anonymous learner tracking via Google Forms + Sheets.

---

## Educational Goals

Learners completing this module should be able to:

1. Distinguish **fluid responsiveness** from **fluid tolerance**
2. Measure and interpret IVC size and collapsibility correctly
3. Understand the VExUS protocol (hepatic, portal, renal vein Doppler) and grading system
4. Apply IVC + VExUS findings to clinical decision-making (give fluid / hold / diurese / pressors)
5. Recognize when IVC or VExUS may be unreliable (high PEEP, RV failure, etc.)

---

## Module Structure

The complete learning experience consists of:

```
1. Pre-survey & Pre-test
   └── Anonymous ID assignment, baseline knowledge

2. Module 1 — Volume Assessment Concepts
   ├── 5 content pages
   ├── 4-question knowledge check (back-navigation locked)
   └── Summary page

3. Module 2 — IVC Evaluation (planned)
   ├── Content pages (TBD)
   ├── Knowledge check
   └── Summary

4. Module 3 — VExUS Protocol (planned)
   ├── Content pages (TBD)
   ├── Knowledge check
   └── Summary

5. Summary Test (all 3 modules combined)

6. Case-Based Practice (3 clinical cases)
   ├── Case 1: Urosepsis with hypotension
   ├── Case 2: HFpEF with oliguria (intubated)
   └── Case 3: ARDS on high PEEP with rising creatinine

7. Post-survey & Post-test
```

### Key UX Rules

- **One concept per page** — minimize cognitive load
- **Back/Next navigation** during content pages
- **Back-navigation locked** once a quiz/test is started (no peeking back at content mid-quiz)
- **Quiz Next button disabled** until learner answers current question
- **Feedback shown after each answer** with explanation

---

## Tech Stack

- **Frontend:** Static HTML / CSS / JavaScript (vanilla, no framework)
- **Hosting:** Google Sites (embed via `<iframe>`)
- **Backend (data capture):** Google Forms + Google Sheets via Apps Script Web App
- **Media:** Inline images, GIFs, embedded YouTube videos

### Why this stack?

- Google Sites is already used by the chief — no migration overhead
- Static HTML embeds cleanly via iframe with no auth issues
- Google Forms + Sheets is free, requires no server, IRB-friendly, and integrates with Google ecosystem
- Vanilla JS keeps it portable and easy for non-developers to maintain

---

## Data Capture — What We Track

**Learner identification:** Anonymous ID only (no name, email, institution — privacy-first)
- Generated client-side on first page load
- Stored in `localStorage` for session persistence
- Format: e.g., `LRN-A8K3F9` (random alphanumeric)

**Per-learner data captured:**

| Field | Description |
|-------|-------------|
| `learner_id` | Anonymous random ID |
| `event_type` | `pre_test`, `module_complete`, `quiz_answer`, `post_test` |
| `module_id` | Which module the event belongs to |
| `question_id` | Specific question identifier (for item-level analysis) |
| `answer` | Learner's selected option |
| `is_correct` | true / false |
| `score` | Pre/post test total score |
| `timestamp` | ISO 8601 datetime |

**Backend flow:**
1. Each event → `fetch()` POST to a Google Apps Script Web App URL
2. Apps Script appends a row to a Google Sheet
3. Sheet serves as the research database for later analysis

---

## File Structure

```
/
├── index.html                    # Landing / consent / pre-test entry
├── pre-test.html
├── module-1.html                 # Volume Assessment concepts  ← DONE
├── module-2.html                 # IVC evaluation
├── module-3.html                 # VExUS protocol
├── summary-test.html             # Combined post-module test
├── cases.html                    # Case-based practice (3 cases)
├── post-test.html
├── thank-you.html
│
├── assets/
│   ├── css/
│   │   └── styles.css            # Shared design system
│   ├── js/
│   │   ├── tracker.js            # Google Sheets logging
│   │   ├── quiz.js               # Shared quiz logic
│   │   └── nav.js                # Shared navigation
│   └── img/                      # Slide images, GIFs
│
├── apps-script/
│   └── log-event.gs              # Google Apps Script backend
│
├── PROJECT.md                    # This file
└── README.md                     # Setup / deployment instructions
```

---

## Design System

**Colors:**
- Background: `--navy: #0b1929`
- Surface: `--surface: #112240`
- Card: `--card: #16305a`
- Accent (IVC / primary): `--teal: #0d9488`, `--teal-light: #2dd4bf`
- Accent (VExUS / warnings): `--amber: #f59e0b`, `--amber-light: #fcd34d`
- Text: `--text: #e2e8f0`, `--muted: #8ba3c0`

**Typography:**
- Headings: `DM Serif Display`
- Body: `DM Sans`

**Components established:**
- Slide tag pill (top of each page)
- Definition card (teal or amber accent)
- Note box (amber-bordered insight callout)
- Compare card (two-column side-by-side)
- Quiz card (numbered, with letter pip options, color-coded feedback)
- Summary card (two-column with arrow bullets)

---

## Current State

✅ **Done:**
- Module 1 (Volume Assessment) — complete with content, quiz, summary
- Visual design system established
- Navigation pattern established (back-locked during quiz)
- Single-file HTML proof-of-concept

🚧 **Next up (in order):**
1. Refactor Module 1 into multi-file structure (shared CSS / JS)
2. Build Google Apps Script backend + integrate `tracker.js`
3. Build pre-test page
4. Build Module 2 (IVC)
5. Build Module 3 (VExUS)
6. Build summary test
7. Build 3 case-based practice scenarios
8. Build post-test + thank-you page
9. Deploy to Google Sites via iframe

---

## Content Sources

- Original lecture: "Volume Assessment Beyond IVC: VExUS" by Yoshihiro Sawaguchi, MD (PGY-2 Internal Medicine)
- Adapted slides courtesy of Dr. Taro Minami, CHEST 2025
- VExUS waveform references: nephropocus.com

Key references already curated (see lecture PDF):
- ASE 2025 Guidelines (J Am Soc Echocardiogr)
- VExUS original proposal (Ultrasound J 2020)
- mVExUS validation (Ultrasound J 2025)
- Meta-analysis on IVC + fluid responsiveness (PLoS One 2025)

---

## Working Notes / Conventions

- Keep one teaching concept per page
- Quiz questions: 1 application + recall mix, 3–4 options each, always include explanation
- Image embedding: base64-encode for now (single-file portability); migrate to `/assets/img/` once multi-file
- All quiz events should call `tracker.logEvent(...)` (defined in `tracker.js`)
- Anonymous learner ID must be generated once and reused across all pages (`localStorage`)

---

## Open Questions / Decisions Pending

- [ ] Final wording of consent / privacy notice on landing page
- [ ] Whether to allow learners to review their answers at the end
- [ ] Whether to send completion certificate (PDF generation client-side)
- [ ] Specific YouTube videos / GIFs to embed in Modules 2–3 and Cases
