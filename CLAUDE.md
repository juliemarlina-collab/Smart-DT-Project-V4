# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart DT Project is a mobile-first, static-HTML web app that guides Malaysian polytechnic (POLIPD) Final Year Project (FYP) students through the five Design Thinking phases: Empathy → Define → Ideation → Prototype → Test. There is no build system, no package manager, and no server-side code. The entire application runs in the browser with all state stored in `localStorage`.

## Deployment

The app is hosted as a static site (GitHub Pages or equivalent). Always test from a real hosted URL — **not** `file://` URLs — because the Google Apps Script sync and certain browser behaviours differ locally. The entry point is `index.html`, which immediately redirects to `welcome.html` or `dashboard.html` based on the `df_registered` key in `localStorage`.

## Script Loading Order (Critical)

Every HTML page must load scripts in this exact order, before `</body>`:

```html
<script src="js/smartdt-assets.js"></script>
<script src="js/smartdt.js"></script>
```

`smartdt-assets.js` must come first because it injects layout CSS and replaces legacy `iili.io` image URLs before the DOM is read. Loading them out of order breaks image resolution and responsive layout.

## Architecture

### JavaScript

**`js/smartdt-assets.js`** — Runs immediately on load (not DOMContentLoaded). Does three things:
1. Exposes `window.SMART_DT_ASSETS` with canonical local paths for all hero/nav/brand images.
2. Builds a `legacyMap` that replaces old `iili.io` hosted URLs with local `assets/` equivalents on every `<img>`.
3. Injects a `<style>` block (`#smartdt-universal-layout-fix`) with responsive layout overrides for `.app`, `.hero-card`, `.bottom-nav`, and badge grids, and hides all supervisor gate UI with `display:none!important`.

**`js/smartdt.js`** — Wrapped in an IIFE. All app logic lives here:
- `store` — thin wrapper around `localStorage` with typed helpers (`get`, `set`, `del`, `json`, `setJson`).
- `phase()` — determines the current phase number (01–05) from `document.body.dataset.phase` or the page `<title>`.
- `setupAuth()` — handles registration and login form submissions; sets `df_registered = 'true'` and redirects.
- `setupDashboard()`, `renderProgress()`, `renderProfile()`, `renderPortfolio()` — page-specific renderers gated on `document.body.dataset.page`.
- `setupTabs()` — wires the three-tab bar (Quick Info / Templates / Quiz) and sub-tab panels on phase pages.
- `setupQuiz()` — renders the five-question quiz from `quizSets[phase]`, scores it, and saves `df_quiz_phaseXX`.
- `setupForms()` / `saveTemplateFrom()` / `restoreTemplates()` — save and restore template form data into `df_phaseXX_templates` JSON and mark individual template completion with `df_template_phaseXX_tXX`.
- `bridgePhase01()` — backward-compatibility shim that promotes old `p01_*` keys to the canonical `df_*` schema.

### HTML Pages

| File | `data-page` | Purpose |
|------|-------------|---------|
| `index.html` | — | Auth redirect only |
| `welcome.html` | `welcome` | Landing page |
| `registration.html` | `registration` | Student profile creation |
| `login.html` | — | Login form |
| `dashboard.html` | `dashboard` | Project overview, phase stepper |
| `phase01-empathy.html` | `learn` (`data-phase="01"`) | Phase 01 with inline quiz + template logic |
| `phase02-define.html` | `learn` (`data-phase="02"`) | Phase 02 |
| `phase03-ideation.html` | `learn` (`data-phase="03"`) | Phase 03 |
| `phase04-prototype.html` | `learn` (`data-phase="04"`) | Phase 04 |
| `phase05-test.html` | `learn` (`data-phase="05"`) | Phase 05 |
| `phaseXX-templates.html` | — | Standalone template-only views (backup/print) |
| `progress.html` | `progress` | Phase tracker and badge grid |
| `profile.html` | `profile` | Student info and stats |
| `projects.html` | `projects` | Projects list |
| `portfolio-completion.html` | `portfolio` | Final checklist after all phases |

Phase pages (`phase01` through `phase05`) contain a significant amount of inline JavaScript for their self-contained quiz and save logic. `smartdt.js` initialises tabs and restores form data on these pages; the phase-specific submit/complete logic is inline in each HTML file.

### CSS

**`css/smartdt.css`** — Single stylesheet. Design tokens are defined in `:root`:

| Token | Value | Use |
|-------|-------|-----|
| `--navy` | `#081B44` | Primary text, buttons |
| `--teal` | `#14B8A6` | Active states, success, nav active |
| `--orange` | `#FF6A3D` | Accent, FAB, warnings |
| `--yellow` | `#F6C542` | Badges, warnings |
| `--bg` | `#F2F7FB` | Page background |

The `.app` wrapper is the mobile container (max-width `430px` / `900px` / `1200px` at the three breakpoints). All fixed bottom nav and sticky header measurements are set via `--header-h` and `--nav-h` (both `72px`).

### Assets

```
assets/
  brand/       smartdt-logo.svg (main logo)
  heroes/      SVG/PNG hero images per phase and page
  icons/       Bottom nav SVG icons (nav-dashboard.svg etc.)
  badges/      PNG achievement badge images
  actions/     SVG action icons (record, save, print, etc.)
  illustrations/ Phase infographic PNGs
```

`smartdt-assets.js` auto-replaces any lingering `iili.io` URLs at runtime, so new pages should always reference local `assets/` paths directly. A few older pages (`welcome.html`, `registration.html`) still carry `iili.io` src attributes; these are silently replaced by `smartdt-assets.js` on load.

## localStorage Schema

All keys use the `df_` prefix (except some legacy `p01_*` keys bridged by `bridgePhase01()`):

**Student profile** (set at registration/login):
`df_student_name`, `df_email`, `df_reg_no`, `df_class`, `df_team`, `df_supervisor`, `df_project_name`, `df_registered`

**Phase state** (for phase N = 01–05):
- `df_submitted_phaseNN` — `'true'` when submitted
- `df_unlocked_phaseNN` — `'true'` when quiz passed or phase submitted
- `df_quiz_phaseNN` — numeric string score (e.g. `'4'`)
- `df_phaseNN_templates` — JSON object keyed by template ID, each with `savedAt` and `values`
- `df_template_phaseNN_tXX` — `'true'` when a template panel was saved

**Badges**: `df_badge_empathy_explorer`, `df_badge_problem_framer`, `df_badge_idea_generator`, `df_badge_prototype_builder`, `df_badge_user_tester`

## Phase Completion Flow

1. Student opens a phase page.
2. Takes the Quiz tab — must score ≥ 3/5 to unlock Templates.
3. Fills and saves each template panel (Save button sets `df_template_phaseNN_tXX = 'true'`).
4. Clicks Submit Phase — stores `df_phaseNN_submission` JSON and sets `df_submitted_phaseNN = 'true'`.
5. Next phase is unlocked; a badge is awarded.

Template IDs per phase:
- Phase 01: `t01`, `t02`, `t03`, `t04`
- Phase 02: `t05`, `t06`
- Phase 03: `t07`, `t08`, `t09`, `t10`
- Phase 04: `t11`, `t12`, `t13`
- Phase 05: `t14`, `t15`, `t16`

## Adding a New Page

1. Copy an existing phase page as a template.
2. Set `data-page` on `<body>` to a unique value and `data-phase` if it's a phase page.
3. Load scripts in the correct order (`smartdt-assets.js` then `smartdt.js`).
4. Add the bottom nav with the correct `data-nav` attribute on the active link.
5. If the page needs a phase-specific renderer, add a guard at the top of a new function in `smartdt.js` that checks `document.body.dataset.page`.

## Google Apps Script Sync

`syncToGoogleSheets()` in `smartdt.js` is currently a no-op stub (`return Promise.resolve(false)`). The Apps Script Web App URL from V11 (`https://script.google.com/.../exec`) is documented in `README_V11_M15_GOOGLE_SHEETS_URL.txt`. If re-enabling the sync, payloads are sent with `no-cors` / Beacon for mobile compatibility, so responses cannot be read in the browser — the Google Sheet is the source of truth.

## Key Conventions

- **No build step.** Edit HTML, CSS, and JS files directly and push. Refresh the hosted URL to test.
- **localStorage is the database.** Never assume server persistence. All reads/writes go through the `store` helpers in `smartdt.js` or direct `localStorage` calls in inline scripts.
- **`data-page` drives rendering.** Page-specific functions in `smartdt.js` check `document.body.dataset.page` before doing anything.
- **`data-phase` drives quiz/template logic.** The `phase()` function reads this attribute first, then falls back to the page title.
- **Inline script in phase pages is intentional.** Phase pages (`phase01-empathy.html`, etc.) contain self-contained save and submit logic as inline `<script>` blocks so they work independently of any module system.
- **Hero images must use local paths.** Use `assets/heroes/phase-0N-*.svg` not external URLs. Legacy `iili.io` URLs are remapped by `smartdt-assets.js` but new code should not introduce them.
- **Supervisor gate UI is always hidden.** `smartdt-assets.js` injects `[data-gate], .gate-lock-screen { display:none!important }`. Do not build flows that depend on gate visibility.
