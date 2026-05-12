# Tasks — V1 Vertical Slice

Path to a working **Landing → Confidence Pre → Knowledge Pre → Module 1 → Knowledge Post → Confidence Post → Thank You** flow with Apps Script logging, deployed via Google Sites iframe.

See [SPEC.md](SPEC.md) for what each piece does. See [CLAUDE.md](CLAUDE.md) for conventions.

---

## Phase 0 — Foundation

- [x] **0.1** Replace [DESIGN.md](DESIGN.md) with FluidAssess design specs
  - Document navy/teal/amber palette, DM Serif Display + DM Sans typography, spacing scale, and every component used in [reference/Module1_VolumeAssessment.html](reference/Module1_VolumeAssessment.html) (top bar, slide tag pills, definition cards, note boxes, compare cards, quiz cards, summary cards, nav bar, complete screen)
  - **Verify:** open the file, confirm no "Genesis" / "indigo" / "General Sans" references remain; colors match `--navy / --teal / --amber` from PROJECT.md
- [x] **0.2** Create the directory structure
  - `mkdir -p assets/css assets/js assets/img apps-script`
  - **Verify:** `ls -la` shows the tree

---

## Phase 1 — Tracking pipeline (BEFORE any content)

- [x] **1.1** Write `apps-script/log-event.gs`
  - `doPost(e)` parses JSON body, appends a row to a Google Sheet with all 10 event fields from SPEC §8
  - Handle CORS / preflight if needed
  - **Verify:** paste into a standalone Apps Script project, run with a sample event from the script editor, confirm a row appears in the Sheet
- [x] **1.2** Deploy Apps Script as a Web App (walk through together)
  - New project → paste code → Deploy → Web app → "Execute as: me" + "Anyone has access" → grab URL
  - **Verify:** `curl -X POST <URL> -H 'Content-Type: application/json' -d '{...}'` produces a row in the Sheet
- [x] **1.3** Write `assets/js/tracker.js`
  - `tracker.getLearnerId()` — read or generate `LRN-XXXXXX` from `localStorage.fluidassess_learner_id`
  - `tracker.logEvent(eventObj)` — POST with `mode: 'no-cors'`; on failure, push the event to `localStorage.fluidassess_event_queue`
  - `tracker.flushQueue()` — called on page load and at the start of `logEvent`; replays queued events
  - **Verify:** open a temporary `dummy.html` that calls `tracker.logEvent` on a button click; confirm a row appears in the Sheet
- [x] **1.4** Test queue + retry path
  - DevTools → Network → offline → click button → re-enable network → click again
  - **Verify:** both events arrive in the Sheet (two rows), despite the first POST happening offline

---

## Phase 2 — Shared layout assets

- [x] **2.1** Extract CSS into `assets/css/styles.css`
  - Pull all rules from `reference/Module1_VolumeAssessment.html`. Keep CSS variables intact. Normalize selector names where helpful. Add responsive breakpoints if any are missing.
  - **Verify:** load `styles.css` on a blank HTML page with sample components (def-card, quiz-card, nav-bar); render identically to reference at 320px, 768px, and 1280px
- [x] **2.2** Write `assets/js/nav.js`
  - Next/Back handlers, quiz-lock state, page-dot rendering, learner_id init on first page load
  - **Verify:** `dummy.html` with two content slides + one quiz slide demonstrates back-lock during quiz and Next-disabled until answered
- [x] **2.3** Write `assets/js/quiz.js`
  - Added `quiz.isAnswered(qIdx)` to public API; redo panel hidden on `resetQuiz()`
  - Quiz answering (correct/incorrect styling), feedback display, score computation, retake mode (hide feedback) vs review mode (show feedback from start)
  - **Verify:** 2-question test page where 1 wrong answer triggers the ≤50% choice screen (Review / Retake)

---

## Phase 3 — Pages

- [x] **3.1** Build `index.html` — landing + brief consent + Begin button
  - **Verify:** clicking Begin generates `learner_id`, logs a `consent` event, navigates to `confidence-pre.html`
- [x] **3.2** Build `confidence-pre.html` — 7-item Likert (or trimmed subset if decided)
  - **Verify:** each Likert response logs a `survey_response`; Next disabled until all questions answered
- [x] **3.3** Build `pre-test.html` — 6 IVC/VExUS knowledge questions, randomized order, **no feedback shown**
  - **Verify:** each answer logs a `quiz_answer`; final score logs a `test_complete`; question order changes across reloads
- [x] **3.4** Refactor `reference/Module1_VolumeAssessment.html` → `module-1.html` using shared CSS/JS
  - **Verify:** visually identical to reference at 320 / 768 / 1280 px; uses `tracker.logEvent` for every action; back-lock during quiz; ≤50% triggers Review/Retake choice
- [x] **3.5** Build `post-test.html` — same 6 questions, **different** randomization seed than pre
  - **Verify:** same questions appear pre vs post but in different order; events tagged `module_id: test_post`
- [x] **3.6** Build `confidence-post.html` — mirror of pre
  - **Verify:** Likert responses log with `module_id: confidence_post`
- [x] **3.7** Build `thank-you.html` — completion screen, logs `session_end`
  - **Verify:** page renders summary message; final event in Sheet

---

## Phase 4 — Integration & deploy

- [x] **4.1** End-to-end click-through on desktop Chrome
  - **Verify:** complete one full pass; Sheet contains every expected event in order with a single consistent `learner_id`
- [x] **4.2** End-to-end click-through on mobile (Safari iOS + Android Chrome, or DevTools mobile emulator at minimum)
  - **Verify:** all pages readable; no layout breaks at 375px width; all events log
- [x] **4.3** Deploy to a test Google Sites page via iframe embed
  - **Verify:** complete one full pass while embedded; events log; localStorage persists across page nav within the iframe
- [x] **4.4** Test refresh-mid-quiz
  - **Verify:** partial quiz progress survives a hard refresh; `learner_id` unchanged
- [x] **4.5** Test ≤50% redo path end-to-end
  - **Verify:** deliberately fail Module 1 quiz → choice screen appears → both Review and Retake branches work → `attempt_number` increments in the Sheet

---

## Phase 5 — Content & polish (after pipeline is proven)

- [x] **5.1** Section-by-section content review of Module 1 (chat-driven, per the user's section-by-section process)
- [ ] **5.2** Finalize consent paragraph wording (SPEC §12 open question) — *deferred to V2 content review*
- [ ] **5.3** Decide whether to keep the 7-item confidence survey or trim (SPEC §12 open question) — *deferred; 7 items accepted for now*

---

## Phase 6 — Module 2: IVC Evaluation

- [x] **6.1** Build `module-2.html` scaffold (clone M1 structure, storage key `fa_m2_progress`, 5 content slides + 4 quiz + summary)
- [x] **6.2** Slide 1 — Why IVC? (recap M1; IVC → fluid responsiveness)
- [x] **6.3** Slide 2 — How to measure IVC (cardiac probe, subxiphoid, M-mode, example gifs/M-mode images)
- [x] **6.4** Slide 3 — Brief history (4 study cards in timeline; clickable "Skip to conclusion →" button)
- [x] **6.5** Slide 4 — Interpretation conclusion (fill <1cm; don't fill >2.5cm; 1–2.5cm collapsibility cutoffs)
- [x] **6.6** Slide 5 — ASE 2025 update on RA pressure estimation (reference image)
- [x] **6.7** Knowledge check — 4 MCQs (Q1-Q3 cutoff recall, Q4 vented application); ≤50% Review/Retake
- [x] **6.8** Summary slide — IVC for responsiveness; cutoffs recap; Pressure ≠ Volume pearl
- [x] **6.9** Wire `module-1.html` `completeModule()` → navigate to `module-2.html`
- [ ] **6.10** E2E test on desktop + mobile; verify events log with `module_id: 'module_2'`, `question_id: 'm2_q1'`–`'m2_q4'`

---

## Phase 7 — Module 3: VExUS Protocol

- [x] **7.1** Build `module-3.html` scaffold (storage key `fa_m3_progress`)
- [x] **7.2** Slide 1 — Why VExUS? (recap from M2; VExUS → fluid tolerance)
- [x] **7.3** Slide 2 — Three vessels overview (hepatic, portal, renal interlobar)
- [x] **7.4** Slide 3 — S wave / D wave refresher (foundational Doppler concept)
- [x] **7.5** Slide 4 — Hepatic vein Doppler (normal triphasic · S<D mild · S reversal severe)
- [x] **7.6** Slide 5 — Portal vein Doppler (normal · mild 30–50% PI · severe ≥50% PI)
- [x] **7.7** Slide 6 — Renal interlobar vein Doppler (continuous · biphasic · monophasic)
- [x] **7.8** Slide 7 — VExUS Grading 0–3 with AKI HR data (Beaubien-Souligny 2020)
- [x] **7.9** Slide 8 — Evidence base: original 2020 study vs. 2025 sepsis follow-up (population effects)
- [x] **7.10** Slide 9 — mVExUS (modified VExUS without renal; Ultrasound J 2025;17:7)
- [x] **7.11** Slide 10 — Clinical application (Grade ≥2 changes management; consider mVExUS)
- [x] **7.12** Knowledge check — 4 MCQs (pattern recognition: hepatic mild/severe, portal severe, grading app)
- [x] **7.13** Summary slide — tolerance · nuance vs CVP · portal+hepatic easier · renal optional
- [x] **7.14** Build `review.html` — 3-module synthesis page (M1/M2/M3 recap + IVC×VExUS 2×2 matrix); M3 `completeModule()` → `review.html` → `cases.html`
- [x] **7.15** Wire `module-2.html` `completeModule()` → `module-3.html` (done in scaffold)
- [ ] **7.16** E2E test on desktop + mobile

---

## Phase 8 — Case Studies

- [ ] **8.1** Build `cases.html` scaffold (storage key `fa_cases_progress`)
- [ ] **8.2** Case 1 content — Urosepsis with hypotension → give fluid
- [ ] **8.3** Case 2 content — HFpEF with oliguria (intubated) → diurese
- [ ] **8.4** Case 3 content — ARDS on high PEEP, rising creatinine → trust VExUS over IVC
- [ ] **8.5** Wire `module-3.html` → `cases.html` → `post-test.html`
- [ ] **8.6** E2E test on desktop + mobile

---

## Phase 9 — V2 Integration & Polish

- [ ] **9.1** Update `SPEC.md` §5 (Deferred): remove M2/M3/Cases; note Summary Test as *dropped*
- [ ] **9.2** Update `SPEC.md` §6 user flow diagram for V2
- [ ] **9.3** Update `SPEC.md` §8 event schema (new `module_id` and `question_id` values)
- [ ] **9.4** Update `PROJECT.md` "Current State"
- [ ] **9.5** Final E2E pass through full V2 flow — verify single `learner_id` across all events
