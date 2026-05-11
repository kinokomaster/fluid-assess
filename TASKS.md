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

- [ ] **5.1** Section-by-section content review of Module 1 (chat-driven, per the user's section-by-section process)
- [ ] **5.2** Finalize consent paragraph wording (SPEC §12 open question)
- [ ] **5.3** Decide whether to keep the 7-item confidence survey or trim (SPEC §12 open question)
- [ ] *(V2+: Modules 2, 3, Summary test, 3 cases — separate planning round once v1 is shipped)*
