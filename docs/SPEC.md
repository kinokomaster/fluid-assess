# FluidAssess — Specification

## 1. Problem & motivation

Volume-status assessment via bedside ultrasound (IVC + VExUS) is hard to teach asynchronously. A traditional lecture exists, but it is passive and learners forget within weeks. Internal-medicine residents and fellows need an interactive, repeatable module that:

- Can be embedded in the chief medical resident's existing Google Site
- Captures anonymous learning data suitable for IRB-friendly outcome analysis
- Scales to repeat cohorts without ongoing maintenance from the instructor

## 2. Goals

A learner who completes the module can:

1. Distinguish **fluid responsiveness** from **fluid tolerance**
2. Measure and interpret IVC size + collapsibility correctly
3. Understand the VExUS protocol (hepatic, portal, renal vein Doppler) and grading
4. Apply IVC + VExUS findings to clinical decisions (give fluid / hold / diurese / pressors)
5. Recognize when IVC or VExUS may be unreliable (high PEEP, RV failure, etc.)

Every learning event is logged to a Google Sheet for outcome analysis.

## 3. Non-goals

- Not a clinical decision support tool — educational only
- Not a comprehensive ultrasound course — focused only on volume assessment
- No certification or CME credit issuance
- No cross-device / cross-browser identity (single-session by design)
- No proctoring or anti-cheat — open-book by nature

## 4. V1 scope (vertical slice)

The full pipeline, with **Module 1 as the only content module**:

1. **Landing page** with brief consent statement
2. **Confidence survey — pre** (7 Likert items; possibly trimmed — see open questions)
3. **Knowledge test — pre** (6 IVC/VExUS questions from `reference/KnowledgeCheckTest.txt`, randomized order)
4. **Module 1** — refactored from `reference/Module1_VolumeAssessment.html` using shared CSS/JS
5. **Knowledge test — post** (same 6 questions, different randomization)
6. **Confidence survey — post** (mirror of pre)
7. **Thank-you page**

Plus the full backend: Apps Script logging, tracker.js retry logic, deploy via Google Sites iframe.

## 5. Deferred (v2+)

- Module 2 (IVC), Module 3 (VExUS), Summary test
- 3 case-based scenarios (urosepsis, HFpEF on intubation, ARDS on high PEEP)
- Completion certificate (PDF generation client-side)
- Answer-review feature at end of post-test

## 6. User flow

```
Landing / Consent
      │
      ▼
Confidence Pre  ──▶  Knowledge Pre  ──▶  Module 1
                                              │
                                              ▼
                                   [Module 1 quiz score]
                                              │
                                    ≤50%? ───Y───▶ Review / Retake choice
                                              │              │
                                              N              │
                                              │       (back to quiz or content)
                                              ▼
                                   Knowledge Post  ──▶  Confidence Post  ──▶  Thank You
```

**Navigation rules:**
- Back enabled on content pages only
- Back locked during any quiz, test, or survey
- Refresh resumes at current page via localStorage

## 7. Quiz / test design

- Next button disabled until the current question is answered
- Feedback (correct/incorrect + explanation) shown immediately after each quiz answer
- Pre/post knowledge tests show **no feedback** until the test ends — they are graded measurements
- Pre/post knowledge tests use the same 6 items in a randomized order
- Back locked once a quiz/test starts
- Refresh mid-quiz → resume at current question
- **Module quiz retake trigger:** ≤50% → learner sees their score + missed items and chooses:
  - **Review** — re-walk content pages, all answers visible (study mode)
  - **Retake** — same questions with feedback hidden again (fresh attempt)
- All retakes logged with `attempt_number` incremented

## 8. Data model

Each event POSTs JSON to Apps Script with these fields:

| Field | Values |
|---|---|
| `learner_id` | `LRN-XXXXXX` |
| `event_type` | `consent` · `survey_response` · `quiz_answer` · `module_complete` · `test_complete` · `session_start` · `session_end` |
| `module_id` | `landing` · `confidence_pre` · `test_pre` · `module_1` · `test_post` · `confidence_post` · `thank_you` |
| `question_id` | Stable IDs: `kc_q1`–`kc_q6` (knowledge), `conf_q1`–`conf_q7` (confidence), `m1_q1`–`m1_q4` (Module 1 internal) |
| `answer` | Option text (quiz) or Likert 1–5 (survey) |
| `is_correct` | `true` / `false` / `null` (null for surveys) |
| `score` | 0–6 for tests, null otherwise |
| `attempt_number` | 1, 2, 3… |
| `timestamp` | ISO 8601 |
| `user_agent` | Truncated UA string (for browser analytics only) |

## 9. Storage strategy

- `localStorage.fluidassess_learner_id` — generated on first landing visit
- `localStorage.fluidassess_progress` — `{ current_page, quiz_states, attempts }`
- `localStorage.fluidassess_event_queue` — pending events that failed to POST; retried on next page nav

Iframe storage partitioning is acknowledged. Cross-browser and cross-device persistence are **not** promised.

## 10. Apps Script API contract

- Single POST endpoint (URL configured in [assets/js/tracker.js](assets/js/tracker.js))
- Request body: JSON matching the event schema above
- Mode: `fetch(url, { method: 'POST', mode: 'no-cors', body: JSON.stringify(event) })`
- Response: ignored
- Apps Script appends one row per event to a single Google Sheet
- **Failure handling:** tracker.js silently catches errors, re-queues the event in `localStorage.fluidassess_event_queue`, and flushes the queue on next page load + next event. No learner-facing error.

## 11. Design system

See [DESIGN.md](DESIGN.md). Quick reference:

- Background `--navy: #0b1929` · surface `--surface: #112240` · card `--card: #16305a`
- Primary accent (IVC) `--teal: #0d9488` · `--teal-light: #2dd4bf`
- Warning accent (VExUS) `--amber: #f59e0b` · `--amber-light: #fcd34d`
- Text `--text: #e2e8f0` · muted `--muted: #8ba3c0`
- Headings: DM Serif Display
- Body: DM Sans
- Components established in the Module 1 reference: top bar, slide tag pills, definition cards, note boxes, compare cards, quiz cards (with letter pips), summary cards, fixed nav bar, complete screen
- All design tokens live in [assets/css/styles.css](assets/css/styles.css)

> **Note:** DESIGN.md currently contains stale content for an unrelated project ("Genesis"). It will be replaced in Phase 0 of [TASKS.md](TASKS.md).

## 12. Open questions

- [ ] Exact wording of the consent paragraph on the landing page
- [ ] Whether to shorten the 7-item confidence survey (currently feels long)
- [ ] Specific YouTube clips to embed in Modules 2/3 (deferred — v2)
- [ ] Whether to allow answer review at the end of the post-test
- [ ] Completion certificate yes/no (v2+)
- [ ] Apps Script Web App URL — to be filled in after deployment
- [ ] Landing-page institution branding (logo, name) — if any

## 13. Risks & mitigations

| Risk | Mitigation |
|---|---|
| localStorage cleared mid-session → new ID, partial data | Module is short enough for one sitting. Document the constraint on landing page. |
| Apps Script redeploy changes URL → silent log loss | URL lives in one place (`tracker.js`). Re-test logging after every redeploy. |
| Same learner repeats from a new browser/device → counts as new learner | Acceptable for anonymous research. If dedup is needed, post-hoc analysis via timestamp + UA fingerprint. |
| Mobile layout breaks at small widths | Fully responsive design with explicit breakpoints. Test on real device + DevTools mobile emulator before declaring v1 done. |
| Refactor drifts from reference Module 1 visual fidelity | Reference file stays read-only in `reference/`. Side-by-side visual check at every viewport before merging Module 1 refactor. |
| Apps Script Web App access policy blocks anonymous POST | During deploy, set "Who has access" to "Anyone". Verified end-to-end before content build. |
