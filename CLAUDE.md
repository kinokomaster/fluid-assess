# CLAUDE.md

## What this is
Web-based IVC/VExUS volume-assessment learning module for internal medicine learners. Embedded as an iframe in a Google Site; anonymous learning events logged to a Google Sheet via Apps Script.

Source-of-truth files: [SPEC.md](docs/SPEC.md) (what we're building) · [TASKS.md](docs/TASKS.md) (work list) · [PROJECT.md](docs/PROJECT.md) (original vision) · [DESIGN.md](docs/DESIGN.md) (design system) · [reference/](reference/) (source content, read-only)

## Local development
- Vanilla HTML/CSS/JS — no build step
- Serve: `python3 -m http.server 8000` → open http://localhost:8000
- Module 1 proof-of-concept lives at [reference/Module1_VolumeAssessment.html](reference/Module1_VolumeAssessment.html) — read-only, do not edit

## Conventions
- All learning events go through `tracker.logEvent(...)` in [assets/js/tracker.js](assets/js/tracker.js). Never call `fetch()` to Apps Script directly from page code.
- Learner ID format: `LRN-XXXXXX` (6 uppercase alphanumeric). Generated once, stored in `localStorage.fluidassess_learner_id`.
- CSS variables live in [assets/css/styles.css](assets/css/styles.css). Never hardcode hex values.
- Images go in [assets/img/](assets/img/). Base64 inline embeds are deprecated (only the read-only reference file keeps them).
- One concept per page — cognitive-load rule from docs/PROJECT.md.

## Gotchas
- **iframe storage partitioning:** Safari/iOS may give a different `learner_id` per browser/device. Accepted limitation — do not engineer around it.
- **Apps Script redeploys:** new Web App URL needed every time the script changes; old URLs keep serving the previous version.
- **Back navigation is locked during quizzes/tests/surveys** — `nav.js` enforces this. Do not bypass.
- **Cross-origin in iframe:** `fetch()` to Apps Script uses `mode: 'no-cors'`. We never read the response — `tracker.logEvent` is fire-and-forget with localStorage retry.

## Process
- Content discussion happens section-by-section in chat. Commit per section after user approval.
- Do not write new modules or pages without an entry in [TASKS.md](docs/TASKS.md).
