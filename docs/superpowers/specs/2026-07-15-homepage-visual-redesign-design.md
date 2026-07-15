# Personal Homepage — Visual Redesign Spec

**Date:** 2026-07-15
**Branch:** `customization` (do not commit to `main` until approved — this is a GitHub Pages *user* site; `main` publishes live)
**Status:** Design approved, ready for implementation
**Intended implementer:** a coding agent (e.g. Sonnet) working from this document alone

---

## 1. Overview

Redesign the academic homepage (a fork of [RayeRen/acad-homepage](https://github.com/RayeRen/acad-homepage.github.io), itself built on the Minimal Mistakes Jekyll theme) to give it a **distinctive personal visual identity** instead of the stock template look.

**Chosen direction:** *editorial, but cool and nocturnal* — a sober, low-contrast take on a cyberpunk/technical feel, in purples and blues. Think a quiet late-night reading room for a computer-graphics researcher, not a neon dashboard.

**This is a VISUAL redesign.** The site's *content and information architecture stay as they are.* Sections remain: About → News → Publications → Educations → Teaching, all authored in `_pages/about.md`. Do **not** rewrite the prose (a few optional micro-additions are called out explicitly below and nowhere else).

### Non-goals (scope guardrails)
- **No light mode.** Ship dark-only. Do not add a theme toggle or `prefers-color-scheme` light variant.
- **No content rewrite**, no new sections, no reordering.
- **Don't touch** the Google Scholar crawler (`google_scholar_crawler/`, `_includes/fetch_google_scholar_stats.html`), SEO/analytics includes, or the build/deploy setup.
- **No new JS frameworks / build tooling.** This is Jekyll + SCSS. Keep it that way. The redesign must work with JavaScript disabled.

---

## 2. Locked design decisions

| Axis | Decision |
|---|---|
| **Layout** | The existing **editorial rail**: left sidebar (avatar + identity + contact) beside a main content column. Keep the structure; restyle it. |
| **Theme** | **Dark only.** |
| **Palette** | Medium slate-indigo background with a soft, lifted lavender accent (exact tokens in §3). |
| **Typography** | **Newsreader** (serif) for all reading text; **IBM Plex Mono** for structural/utility text (labels, eyebrows, dates, nav, meta). |
| **Signature** | A faint **simulation-mesh field** behind the header (nods to the FEM/cloth-simulation research), plus a monospace **"spec-sheet"** treatment: mono status/nav bar and mono section labels with hairline rules. |

A pixel reference of the approved composition is included in the handoff package: **`docs/superpowers/redesign-reference.html`** (open it in a browser). It is the visual source of truth; this document is the authoritative written spec. Where they differ, ask.

---

## 3. Design tokens (exact values)

Define these once and derive everything from them. Recommended: CSS custom properties on `:root`, **and** mirror the base ones into the SCSS variables the theme consumes at compile time (see §5).

### Color
```
--paper   : #2A2E3B   /* page background (chosen: tuner bg-3) */
--panel   : #262A36   /* slightly recessed surface: rail, cards (optional) */
--ink     : #C8CAD4   /* primary reading text — soft, not white */
--muted   : #8B90A2   /* secondary text (see contrast note in §8) */
--faint   : #6E7488   /* tertiary: captions, venue lines */
--accent  : #AEA2EA   /* soft lavender (chosen: tuner accent-4) */
--accent-2: #C2B8F0   /* lighter lavender for link hover / focus */
--rule    : #3A3F4E   /* hairlines, borders, dividers */
```
- **Links:** `--accent`; hover → `--accent-2` (and/or a hairline underline in `--rule`).
- **Selection & keyboard focus ring:** `--accent`.
- Backgrounds are flat; contrast comes from type and hairlines, not heavy panels. Keep this restrained.

### Type
```
--serif : "Newsreader", Georgia, serif;
--mono  : "IBM Plex Mono", ui-monospace, "Consolas", monospace;
```
- **Serif (reading voice):** bio/about, the italic lede, publication titles, news item text, education/teaching text.
- **Mono (structural voice):** eyebrows, section labels, dates, nav links, publication venue + link-row (`Project / Paper / Code`), the top status bar. Mono labels are **UPPERCASE with wide letter-spacing (~0.16–0.18em)**.
- **Italic Newsreader** for the lede is a deliberate personality moment — keep it.

### Approximate type scale (tune to taste, keep the relationships)
| Role | Font | Size | Notes |
|---|---|---|---|
| Name (rail) | serif 600 | ~1.7–1.9rem | |
| Lede / thesis | serif italic 400 | ~1.35–1.45rem | slightly brighter than body (`#D6D8E0`) |
| Body | serif 400 | ~1.0–1.06rem | line-height 1.5–1.6 |
| Section label | mono 500 | ~0.66rem | uppercase, tracked |
| Eyebrow | mono | ~0.66rem | uppercase, `--accent` |
| Date | mono | ~0.66rem | `--accent` |
| Venue | mono | ~0.62rem | `--faint` |

### Other
- Border radius: keep small (`4px`) or `0` for a more precise, engineered feel. Default to `4px`.
- Dividers: `1px solid var(--rule)`. Prefer hairlines + whitespace over boxes.

---

## 4. The signature element

The one memorable flourish. Spend boldness *here* and keep everything else quiet.

**4a. Simulation-mesh field.** A faint grid behind the header region — a quiet nod to FEM / cloth meshes. CSS-only (no image), pointer-events none, low opacity, radial-masked so it fades out. Reference implementation:
```css
.mesh {
  position: absolute; inset: 0 0 auto 0; height: 230px; z-index: 0;
  pointer-events: none; opacity: .12;
  background-image:
    linear-gradient(var(--accent) 1px, transparent 1px),
    linear-gradient(90deg, var(--accent) 1px, transparent 1px);
  background-size: 28px 28px;
  -webkit-mask-image: radial-gradient(130% 90% at 22% -10%, #000 0%, transparent 68%);
          mask-image: radial-gradient(130% 90% at 22% -10%, #000 0%, transparent 68%);
}
```
Tunable: opacity (fainter/stronger) and grid size. It must read as *texture*, never as a picture. It is currently static; if it is ever animated, gate the motion behind `prefers-reduced-motion` (§8).

**4b. Monospace "spec-sheet" treatment.**
- **Top bar (masthead):** restyle the existing masthead into a mono status/nav bar — site identity on the left, mono nav links on the right, hairline bottom border. The mesh sits behind it and the header. (See §7b — do **not** create a second competing top bar.)
- **Section headers:** a mono uppercase label in `--accent` followed by a hairline rule that fills the rest of the row.
- Optional personal touch (low-cost, easy to remove): a subtle "Salt Lake City, UT" location line in the rail. Keep it understated.

---

## 5. Files to change (mapped to the real repo)

The theme resolves most colors/fonts through **compile-time SCSS variables**, so a pure CSS-custom-property overlay won't fully re-skin it. Use this two-part approach:

**Part A — flip the base theme to dark** by editing the SCSS variables the partials already consume:
- **`_sass/_variables.scss`**
  - Colors: set `$background-color`, `$body-color`, `$text-color`, `$border-color`, `$link-color` (+ hover/visited), `$masthead-link-color` (+ hover), `$primary-color`, and the gray ramp so the existing partials recompile dark. Map them to the §3 tokens (e.g. `$background-color: #2A2E3B; $text-color: #C8CAD4; $link-color: #AEA2EA; $border-color: #3A3F4E;`).
  - Fonts: repoint `$serif`, `$sans-serif`, `$global-font-family`, `$header-font-family` so body/reading text uses Newsreader and structural chrome uses IBM Plex Mono. (Add `$monospace`-based usage where labels live.)

**Part B — add the new identity in one reviewable partial:**
- **Create `_sass/_redesign.scss`** containing: `:root` custom properties (§3), the mesh (§4a), the status/nav bar, the section-label pattern, the restyled publication cards, rail specifics, link/focus states, and any dark-mode fixups the base partials miss.
- **`assets/css/main.scss`** — add `@import "redesign";` as the **last** import (after `print`, and move/rework the existing `.paper-box` + `.badge` blocks at the bottom into `_redesign.scss` or restyle them in place). Being last guarantees these rules win.

**Supporting files:**
- **`_includes/head/custom.html`** — add the web fonts and update the theme color:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=IBM+Plex+Mono:wght@400;500&display=swap">
  ```
  Change `<meta name="theme-color" content="#ffffff">` → `content="#2A2E3B"`. (Optional/nice: self-host the fonts in `assets/` later for privacy/perf; not required for v1.)
- **`_includes/author-profile.html`** — the rail. Restyle avatar (round, subtle ring/shadow), name (serif), the "also known as Arias" line (serif italic, muted), a mono role line, and the social list as mono rows with a small `--accent` tick. The include is verbose (many optional networks); only the populated ones render (email, googlescholar, github, instagram) — style those; leave the conditionals intact.
- **`_includes/masthead.html`** + **`_sass/_masthead.scss`** + **`_sass/_navigation.scss`** — restyle to the dark mono status/nav bar (§7b).
- **`_sass/_sidebar.scss`** — dark rail, keep it sticky; add the right-hand hairline divider.
- **`_sass/_page.scss`, `_base.scss`, `_reset.scss` (as needed)** — dark backgrounds, text, link, and border fixups the variable flip doesn't fully cover.
- **`_pages/about.md`** — **content unchanged.** Only *optional* structural touch: if the status bar's personal bits (Chinese name / location) are driven from here or `_config.yml`, wire them; otherwise leave it. Publication markup (`.paper-box` / `.paper-box-image` / `.badge` / `.paper-box-text`) stays; it gets restyled in CSS, not rewritten.

**Do not** create files outside this list without reason. Keeping the net-new identity in `_sass/_redesign.scss` makes the whole redesign easy to review and revert.

---

## 6. Design principles (the handoff — follow these when making judgment calls)

These are the taste rules for this site. When the spec doesn't dictate a pixel, decide by these.

1. **Spend boldness once.** The mesh is the single signature. Everything around it stays disciplined and quiet. Cut any decoration that doesn't earn its place. Before shipping a flourish, remove one thing.
2. **Two voices, cleanly separated.** *Serif = humanity* (all reading prose, titles, the italic lede). *Mono = the machine* (labels, dates, nav, venues, meta). Never set reading prose in mono; never set a structural label in serif. This split is what makes the page feel authored, not templated.
3. **Low contrast on purpose.** Soft text (`--ink`) on slate (`--paper`), never white on black. One soft lavender accent, used sparingly — links, ticks, labels, the mesh. Do **not** introduce a second accent or any high-contrast neon. If something needs emphasis, use weight or space before color.
4. **Hierarchy from type and space, not boxes.** Prefer hairline rules (`--rule`) and generous whitespace over filled panels, heavy borders, or big shadows. Small radii. Flat surfaces.
5. **Structure must mean something.** A section label labels; it doesn't decorate. Do **not** add sequential numbering (01/02/03) — the sections are not an ordered process, so numbering would lie. The mono treatment already signals "structure."
6. **Sober, dry, first-person voice** for any unavoidable microcopy (e.g. a status line). Plain words. A little dry humor is in-character (the existing copy says "Still exploring :)" and ":P") — match that register; don't oversell, don't add hype.
7. **Cohesion over cleverness.** One serif, one mono, one accent, one set of tokens. Reuse them everywhere. Every new color or size should trace back to §3.
8. **Quality floor is non-negotiable.** Accessible contrast, visible keyboard focus, reduced-motion respected, responsive to mobile, works without JS. See §8. A distinctive look that fails these is a regression, not a redesign.

---

## 7. Component notes

**7a. Rail (`author-profile.html` + `_sidebar.scss`).** Sticky on desktop; stacks *above* the content on mobile. Avatar `images/android-chrome-512x512.png`, round, ~64px, subtle 1px `--rule` ring. Name in serif; "also known as Arias" in serif italic `--muted`; role in mono `--muted` ("Computer Graphics / University of Utah"). Contact list: mono rows separated by top hairlines, each with a small `--accent` tick (`▹`); label in `--ink`, hover → `--accent`.

**7b. Masthead / status-nav bar (`masthead.html`, `_masthead.scss`, `_navigation.scss`).** One bar only, sticky top, `--paper` with a `--rule` bottom hairline and the mesh behind it. Left: site identity (`Yuqi Meng · Arias`). Right: mono nav links to the in-page sections (from `_data/navigation.yml`) — uppercase, tracked, `--muted`, hover `--accent`. This *replaces* the stock masthead styling; it is also the home for the "spec-sheet" status vibe. Do not add a separate second top bar.

**7c. Lede + about (`about.md` content, styled in `_redesign.scss`).** The opening line ("Building robust, efficient methods for physics-based simulation. Still exploring.") set as a serif **italic** lede, slightly brighter (`#D6D8E0`), larger than body. About paragraphs in serif body; inline links in `--accent` with a faint underline.

**7d. Section header pattern.** `mono uppercase label (--accent)` + `flex hairline rule (--rule)`. Reused for News, Publications, Educations, Teaching. (The template renders these from `#`/`##` headings in `about.md` — restyle the generated `h1/h2` in `.page__content`, preserving the existing anchor/scroll-offset behavior in `main.scss`.)

**7e. News.** Each item: mono date (`--accent`, fixed-width column) + serif text. Tight vertical rhythm.

**7f. Publications (`.paper-box` restyle).** Keep the two-column card (figure + text) and its responsive reflow already in `main.scss`. Restyle to dark: figure with a soft `--rule` frame (drop the light `#888` shadow / `#efefef` divider — use `--rule`); title in serif 600; author line in `--muted` with **the site owner's name bolded in `--ink`**; venue line in mono `--faint` uppercase; the `Project / Paper / Code` links as a mono row in `--accent` (optionally prefixed with `→`). Restyle `.badge` from the hard `#00369f` to a mono chip on `--panel`/`--accent`.

**7g. Education / Teaching.** Mono date/label + serif text, same rhythm as News.

---

## 8. Accessibility & performance (verify, don't assume)

- **Contrast — verify with a checker, adjust tokens if needed:**
  - Body `--ink #C8CAD4` on `--paper #2A2E3B`: comfortably passes AA — good.
  - Link/label `--accent #AEA2EA` on `--paper`: near the AA 4.5:1 line — **verify**; if any small-text usage falls short, use `--accent-2 #C2B8F0` for those or nudge `--accent` lighter.
  - `--muted #8B90A2` on `--paper` is ~AA-borderline for small text — fine for large/secondary text; for any *essential* small text prefer `--ink`, or lighten muted toward `#9BA0B2`.
- **Keyboard focus:** every link/control shows a visible focus ring in `--accent` (`:focus-visible`). Don't remove outlines without replacing them.
- **Reduced motion:** the mesh is static (fine). Any hover/scroll animation added later must be gated behind `@media (prefers-reduced-motion: reduce)`.
- **Responsive:** rail stacks above content below `$medium` (768px). The publication card reflow already exists in `main.scss` — preserve it. No horizontal scroll at mobile widths.
- **No-JS:** layout, nav anchors, and content must work with JS off (the Scholar-citation badge may stay dynamic).
- **Performance:** load only the two families and the weights listed in §5, with `preconnect` + `display=swap` to avoid blocking and layout shift. Keep the mesh as CSS (no image request).

---

## 9. How to run & verify

```bash
bash run_server.sh      # Jekyll livereload → http://127.0.0.1:4000
```
(Requires Ruby/Jekyll per README. `run_server.sh` wraps `jekyll serve`.)

**Acceptance criteria:**
1. Homepage renders dark: slate `#2A2E3B` background, soft `#C8CAD4` text, lavender `#AEA2EA` accents — no leftover white backgrounds, black-on-white text, or stock blue links anywhere (About, News, Publications, Education, Teaching, masthead, footer).
2. Newsreader is in use for reading text; IBM Plex Mono for labels/dates/nav/venues. Fonts load without a flash of invisible text.
3. The mesh signature is visible-but-subtle behind the header; the masthead is the single mono status/nav bar; section headers use the mono-label + hairline pattern.
4. Publications cards, news, education, teaching are all restyled and legible; the owner's name is emphasized in author lists.
5. Passes the §8 checks: contrast verified, focus rings visible, mobile layout clean, works with JS disabled.
6. Content is unchanged from `_pages/about.md` (aside from any explicitly-approved optional touches).
7. All changes are on `customization`; `main` is untouched until a separate merge step.

---

## 10. Open items / assets

- **Publication figures:** `images/bsfem.png` and `images/jgs2-gq.png` exist (large); `images/rt-octree.png` exists (small). All real figures are already referenced in `about.md`; the redesign only restyles their frames.
- **Optional personal touch** (owner to confirm): a "Salt Lake City, UT" location line in the rail. Easy to include or omit.
- **Font hosting:** v1 uses Google Fonts CDN. A later pass could self-host into `assets/` for privacy/performance.
