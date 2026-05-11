# FluidAssess — Design System

## Overview

Dark clinical aesthetic built for focus and readability. Navy backgrounds convey seriousness; teal signals IVC / responsiveness; amber signals VExUS / warnings and quiz state. Components are deliberately minimal — no decoration, no gradients except one summary highlight.

---

## Colors

All values are defined as CSS custom properties in `assets/css/styles.css`.

| Token | Hex | Usage |
|---|---|---|
| `--navy` | `#0b1929` | Page background |
| `--surface` | `#112240` | Top bar, nav bar, raised surfaces |
| `--card` | `#16305a` | Cards, question blocks, callouts |
| `--teal` | `#0d9488` | IVC / fluid responsiveness theme; nav buttons, active dots, card accents |
| `--teal-light` | `#2dd4bf` | Teal labels, slide tag text, hover text, summary strong |
| `--amber` | `#f59e0b` | VExUS / warnings / quiz state; note-box borders, quiz dots |
| `--amber-light` | `#fcd34d` | Amber labels, quiz slide tag text |
| `--blue-accent` | `#60a5fa` | Summary tag color |
| `--red-accent` | `#f87171` | Reserved (currently unused in components) |
| `--border` | `rgba(148,163,184,0.13)` | All card borders, dividers, inactive dots |
| `--text` | `#e2e8f0` | Primary body text |
| `--muted` | `#8ba3c0` | Secondary text, subtitles, counters, nav hints |

**State colors (not in custom properties):**

| State | Hex | Usage |
|---|---|---|
| Correct answer | `#10b981` border / `#6ee7b7` text | `.opt-btn.correct` |
| Incorrect answer | `#ef4444` border / `#fca5a5` text | `.opt-btn.incorrect` |

---

## Typography

Loaded from Google Fonts — include both faces on every page:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">
```

| Role | Font | Properties |
|---|---|---|
| Page / section title | DM Serif Display | `font-size: 36px` (h1) or `28px` (h2); `line-height: 1.2–1.3`; `color: white` |
| Subtitle | DM Sans | `font-size: 16px`; `color: var(--muted)`; `line-height: 1.6` |
| Body | DM Sans | `font-size: 14–15px`; `color: var(--text)`; `line-height: 1.6` |
| Labels / overlines | DM Sans | `font-size: 11px`; `font-weight: 700`; `letter-spacing: 1.2–1.5px`; `text-transform: uppercase` |
| Question text | DM Sans | `font-size: 17px`; `font-weight: 500`; `color: white`; `line-height: 1.5` |
| Option text | DM Sans | `font-size: 14px`; `color: var(--text)` |

**Responsive overrides at ≤600px:**
- `h1.slide-title`: `font-size: 26px`
- `h2.slide-title`: `font-size: 22px`

---

## Spacing

Base: 4px grid.

| Context | Value |
|---|---|
| Slide wrapper max width | 820px |
| Slide wrapper padding | `48px 24px 80px` (top / sides / bottom — bottom reserves space for fixed nav bar) |
| Card padding | `24px 28px` |
| Note box padding | `16px 20px` |
| Option button padding | `13px 18px` |
| Card gap (grids) | `16px` |
| Section divider margin | `28px 0` |

---

## Border radius

| Element | Radius |
|---|---|
| Cards, question blocks, summary cols | `12px` |
| Option buttons, feedback boxes, note boxes, inline callouts | `8px` |
| Nav buttons | `8px` |
| Slide tag pills | `20px` (pill) |
| Option letter pips | `50%` (circle) |
| Score badge | `12px` |

---

## Components

### Top bar

```
[Module label]          [● ● ● ● ●]          [Page X of Y]
```

- Height: `56px`; background: `--surface`; `border-bottom: 1px solid --border`; `position: sticky; top: 0; z-index: 100`
- Module label: `11px / 700 / 1.5px / uppercase / --teal-light`
- Page dots: `8px` circles; active dot scales to `1.3×`; done dots at 60% opacity
- Page counter: `12px / --muted`

**Dot states:**
| Dot state | Color |
|---|---|
| Inactive (content) | `--border` |
| Active (content) | `--teal` |
| Done (content) | `--teal-light` at 60% |
| Inactive (quiz) | `--border` (has class `quiz-dot`) |
| Active (quiz) | `--amber` |
| Done (quiz) | `--amber` at 60% |
| Active (summary) | `--blue-accent` |

---

### Slide tag pill

A small labeled chip that sits above the slide title to identify content type.

```css
.slide-tag       /* standard — teal */
.slide-tag.quiz-tag    /* quiz — amber */
.slide-tag.summary-tag /* summary — blue */
```

- Standard: `background: rgba(13,148,136,0.15)` / `border: rgba(45,212,191,0.25)` / `color: --teal-light`
- Quiz: `background: rgba(245,158,11,0.12)` / `border: rgba(252,211,77,0.3)` / `color: --amber-light`
- Summary: `background: rgba(96,165,250,0.12)` / `border: rgba(96,165,250,0.3)` / `color: --blue-accent`
- Base: `font-size: 11px / 700 / 1.2px / uppercase`; `padding: 4px 12px`; `border-radius: 20px`; `margin-bottom: 20px`

---

### Definition card

Used to define a key concept. Always has a colored overline label.

```html
<div class="def-card">
  <div class="def-card-label teal">Question 1</div>   <!-- or class="amber" -->
  <div class="def-card-question">The question or term</div>
  <div class="def-card-note">Supporting text or detail</div>
</div>
```

- Background: `--card`; border: `1px solid --border`; border-radius: `12px`; padding: `24px 28px`
- Label: `11px / 700 / 1.2px / uppercase`; `.teal → --teal-light`; `.amber → --amber-light`
- Question: `20px / 600 / white / line-height 1.4`
- Note: `13px / --muted / line-height 1.6`; can be overridden to `--text` for emphasis

---

### Note box

Amber-bordered callout for insights, caveats, and clinical pearls.

```html
<div class="note-box">
  <div class="note-box-label">💡 Key Insight</div>
  <p>Content here</p>
</div>
```

- Background: `rgba(245,158,11,0.08)`; `border: 1px solid rgba(245,158,11,0.25)`; `border-left: 3px solid --amber`
- Label: `11px / 700 / 1px / uppercase / --amber-light`
- Body: `14px / --text / line-height 1.6`

---

### Compare card

Two-column side-by-side comparison of IVC vs VExUS (or any binary contrast).

```html
<div class="compare-grid">
  <div class="compare-card ivc">   <!-- or class="vexus" -->
    <div class="compare-icon">💧</div>
    <div class="compare-tool">IVC</div>
    <div class="compare-arrow">→ answers</div>
    <div class="compare-concept">Fluid Responsiveness</div>
    <div class="compare-question">Will CO increase?</div>
  </div>
  <div class="compare-card vexus"> ... </div>
</div>
```

- Grid: `1fr 1fr`; gap `16px`; collapses to `1fr` at ≤600px
- Card: `--card` bg; `12px` radius; `28px 24px` padding; top `3px` accent bar
- `.ivc::before` bar: `--teal`; `.vexus::before` bar: `--amber`
- `.ivc .compare-tool`: `--teal-light`; `.vexus .compare-tool`: `--amber-light`
- Concept: `22px / 700 / white`; Question: `13px / --muted`

Connect strip (optional between cards):

```html
<div class="compare-connect">…</div>
```

---

### Quiz card

One question per slide. Always preceded by the quiz progress bar.

**Progress bar:**
```html
<div class="quiz-progress">
  <div class="qpip done"></div>
  <div class="qpip active"></div>
  <div class="qpip"></div>
  <div class="qpip"></div>
</div>
```
- Each `qpip`: `height 3px / flex 1 / border-radius 2px / --border`
- `.done → --amber`; `.active → --amber-light`

**Question block:**
```html
<div class="question-card">
  <div class="q-number">Question 1 of 4</div>
  <div class="q-text">Question text here</div>
  <div class="options">
    <button class="opt-btn" onclick="answerQ(0, this, true)">
      <span class="opt-letter">A</span> Option text
    </button>
    ...
  </div>
  <div class="feedback-box" id="fb-0">Feedback text</div>
</div>
```

- Card: `--card` bg; `1px solid --border`; `12px` radius; `28px` padding
- `q-number`: `11px / 700 / 1px / uppercase / --amber-light`
- `q-text`: `17px / 500 / white / line-height 1.5`
- Option button: `rgba(255,255,255,0.04)` bg; `1px solid --border`; `8px` radius; `13px 18px` padding; flex row with gap 10px
- Option hover (before answer): `rgba(13,148,136,0.1)` bg / `rgba(45,212,191,0.3)` border
- Option letter pip: `22px × 22px`; `50%` radius; `--border` bg; `11px / 700`
- `.opt-btn.correct`: green bg/border (`#10b981`) / green text (`#6ee7b7`) / pip bg `#10b981`
- `.opt-btn.incorrect`: red bg/border (`#ef4444`) / red text (`#fca5a5`) / pip bg `#ef4444`; other options `opacity: 0.4` until incorrect is selected
- Feedback box: `rgba(13,148,136,0.08)` bg; `rgba(13,148,136,0.2)` border; `8px` radius; hidden by default → `.show` to display

---

### Summary card

Two-column recap at the end of a module.

```html
<div class="summary-grid">
  <div class="summary-col">
    <div class="summary-col-header">
      <span class="summary-col-icon">💧</span>
      <span class="summary-col-title">Fluid Responsiveness</span>
    </div>
    <ul class="summary-list">
      <li>Point one</li>
      <li>Point two</li>
    </ul>
  </div>
  <div class="summary-col"> ... </div>
</div>
```

- Grid: `1fr 1fr`; gap `16px`; collapses to `1fr` at ≤600px
- Col: `--card` bg; `1px solid --border`; `12px` radius; `22px` padding
- Header: flex row; icon `20px`; title `14px / 700 / white`
- List items: `13.5px / --muted / line-height 1.6`; `border-bottom: 1px solid --border`; `::before` arrow `→ / --teal / 700`

**Summary highlight strip** (below the grid):
```html
<div class="summary-highlight">
  Use <strong>IVC</strong> + <strong>VExUS</strong> together…
</div>
```
- Background: `linear-gradient(135deg, rgba(13,148,136,0.12), rgba(96,165,250,0.08))`
- Border: `1px solid rgba(45,212,191,0.2)`; `10px` radius; `18px 22px` padding
- Font: `15px / --text / line-height 1.6`; `strong → --teal-light`

---

### Fixed nav bar

Anchored to the viewport bottom on every page.

```html
<div class="nav-bar">
  <button class="nav-btn ghost" id="btn-prev" onclick="navigate(-1)">← Back</button>
  <div class="nav-hint" id="nav-hint"></div>
  <button class="nav-btn" id="btn-next" onclick="navigate(1)">Next →</button>
</div>
```

- Bar: `position: fixed; bottom: 0; left: 0; right: 0`; `--surface` bg; `border-top: 1px solid --border`; `14px 32px` padding; space-between flex
- Primary button (`.nav-btn`): `--teal` bg / white text / `8px` radius / `10px 24px` padding / `14px / 600`; hover → `--teal-light` bg / `--navy` text
- Ghost button (`.nav-btn.ghost`): transparent bg / `1px solid --border` / `--muted` text; hover → `--teal` border / `--teal-light` text
- Disabled: `opacity: 0.25; cursor: default`
- Nav hint: `12px / --muted / text-align: center`; shows "Quiz in progress — navigation locked" when back is locked

---

### Complete / score screen

Shown after the final slide of a module.

```html
<div class="complete-screen">
  <div class="complete-icon">✅</div>
  <h2>Module Complete</h2>
  <p>Subtitle line</p>
  <div class="score-badge">3 / 4</div>
  <button class="nav-btn">Continue →</button>
</div>
```

- `.complete-screen`: `text-align: center; padding: 60px 24px`
- Icon: `56px`
- `h2`: DM Serif Display / `30px / white`
- Score badge: `--teal` at 15% opacity bg / `rgba(45,212,191,0.3)` border / `--teal-light` text / `32px / 700`; `16px 40px` padding; `12px` radius

---

## Animation

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Applied to `.slide.active` — `animation: fadeIn 0.35s ease`. All other transitions: `0.18–0.3s` ease or linear.

---

## Responsive breakpoints

| Breakpoint | Changes |
|---|---|
| ≤600px | `.compare-grid`, `.summary-grid`, `.framework-labels` → `grid-template-columns: 1fr` |
| ≤600px | `h1.slide-title` → `26px`; `h2.slide-title` → `22px` |

---

## Do's and don'ts

- Do use `var(--teal)` for IVC-related elements; `var(--amber)` for VExUS and quiz state. Never swap.
- Do keep all values in `assets/css/styles.css` custom properties. Never hardcode hex in HTML.
- Do one concept per slide. Never put two definition cards from different topics on the same slide.
- Don't add gradients or decorations outside the one `summary-highlight` linear-gradient.
- Don't add more than one active (teal-filled) nav button per view.
- Don't bypass the back-navigation lock during quizzes/tests/surveys.
