# Homepage Static Rebuild — Design Spec

**Date:** 2026-07-15
**Branch:** `customization` (do not commit to `main` until approved — GitHub Pages user site; `main` publishes live)
**Status:** Approved, ready for implementation
**Supersedes:** the *implementation approach* in `docs/superpowers/specs/2026-07-15-homepage-visual-redesign-design.md` — specifically its §5 "Files to change" (the Jekyll/SCSS two-part strategy) no longer applies. That spec's **visual design** — §2 (locked decisions), §3 (tokens), §4 (mesh signature), §6 (design principles), §8 (accessibility) — is unchanged and carried forward here. Where this doc doesn't repeat a detail, that spec is still the source of truth for it.

---

## 1. Why this exists

Implementing the approved redesign on top of the Jekyll/Minimal-Mistakes theme kept producing structural bugs rooted in the theme's legacy CSS architecture, not in the redesign itself:
- The rail collapsed into a squeezed horizontal row below 925px (the theme's `.profile_box`/`.author__*` only stack vertically at `$large`, everywhere else they're `display:flex`/`table-cell`).
- The content column had no width cap, so the theme's 10-of-12 `susy` span let body text run too wide and ballooned publication images.
- `jekyll-sass-converter 1.5.2` locks the old Ruby Sass gem, which caches compiled output per-file in `.sass-cache/` — producing a misleading preview where new files (`_redesign.scss`) compiled fresh but edits to a pre-existing file (`_variables.scss`) appeared stale.

Each of these is a symptom of fighting a decades-old theme's grid/caching model, not a flaw in the design. The user pointed to a concrete working pattern already in use for their own paper project pages — `../BS-Cloth/webpage` (sibling repo): a `.nojekyll` marker plus a hand-authored `index.html` / `stylesheet.css` / `static/` folder, no build step, served directly by GitHub Pages. This spec replaces the Jekyll implementation with that pattern.

**The visual design does not change.** Dark, editorial, nocturnal — same palette, same Newsreader + IBM Plex Mono pairing, same mesh signature, same rail + content layout concept. Only the implementation technology changes: hand-authored static HTML/CSS/JS instead of Jekyll templates compiling through a legacy theme.

### Non-goals (carried forward, one addition)
- No light mode, no theme toggle (unchanged).
- No content rewrite — all text ports verbatim from the current `_pages/about.md` / `_config.yml` author block. Two small, factual additions are explicitly approved (§7 below), same as before.
- Don't touch `google_scholar_crawler/` (unchanged — it's a standalone Python script, never was a Jekyll dependency).
- No new JS frameworks or build tooling — vanilla JS/CSS only, no bundler, no npm dependency ships in the site.
- **Changed:** the original spec's quality floor required the page to "work with JavaScript disabled" for *all* content. That's relaxed here — see §8.

---

## 2. Locked decisions (from brainstorming on 2026-07-15)

| Question | Decision |
|---|---|
| Static vs. Jekyll | Fully static — `.nojekyll` + hand-authored files, no Ruby, no build step, no Liquid. |
| Visual direction | Unchanged: dark/editorial/nocturnal, same tokens as the original spec. |
| Content maintenance | Small JS data arrays (`content.js`), rendered into the DOM by `render.js` — mirrors the pattern already used in `../BS-Cloth/webpage`'s `stressScenes`/`fbwTests`. |
| Jekyll scaffold | Removed once the static site is live (full list in §6) — nothing dead left lying around. |

---

## 3. Design tokens

Unchanged from `docs/superpowers/specs/2026-07-15-homepage-visual-redesign-design.md` §3, with the same one accessibility adjustment already locked during the Jekyll attempt (documented there, carried forward verbatim):

```css
--paper   : #2A2E3B;
--panel   : #262A36;
--ink     : #C8CAD4;
--muted   : #9BA0B2;  /* accessibility-adjusted from the spec's #8B90A2, see original spec §8 */
--faint   : #6E7488;
--accent  : #AEA2EA;
--accent-2: #C2B8F0;
--rule    : #3A3F4E;
--serif   : "Newsreader", Georgia, serif;
--mono    : "IBM Plex Mono", ui-monospace, "Consolas", monospace;
```

No SCSS compile step exists anymore, so these become literal `:root` custom properties in `stylesheet.css` directly — nothing else changes about them.

---

## 4. File structure

```
index.html              — single page: masthead, rail, About, News, Publications, Education, Teaching
stylesheet.css           — hand-authored CSS: tokens, layout, every component style
content.js                — plain JS data: news[], publications[], education[], teaching[]
render.js                — vanilla JS: renders content.js arrays into the DOM on load
.nojekyll                — empty marker file at repo root; tells GitHub Pages to skip Jekyll entirely
static/
  images/
    avatar.png             — copy of images/android-chrome-512x512.png
    bsfem.png
    jgs2-gq.png
    rt-octree.png
    favicon-16x16.png, favicon-32x32.png, favicon.ico, apple-touch-icon.png, android-chrome-*.png, site.webmanifest
      (copied from the current images/ — same filenames, same favicon <link> setup as today)
```

CSS uses native CSS nesting (`.foo { &:hover { ... } }`) — supported in all current evergreen browsers, needs zero compiler. This keeps `stylesheet.css` organized the same way `_redesign.scss` was without requiring any build step at all.

Local preview: `python -m http.server` from the repo root (matches `../BS-Cloth/webpage/serve.bat`'s pattern), or just open `index.html` directly — since content comes from an inline `<script src="content.js">`, not a `fetch()` call, it renders correctly even via `file://` with no server at all.

---

## 5. Content data model

`content.js` defines four arrays, assigned to `window`-scoped `const`s so `render.js` (loaded after it) can read them directly — no modules, no bundler:

```js
const newsItems = [
  { date: "2026.04", text: "Two papers have been accepted by SIGGRAPH 2026! See you in LA this summer! :P" },
  { date: "2026.03", text: "I am starting my PhD at University of Utah this fall. If you are in SLC and are interested in anything related to graphics, I'm happy to have a chat! :)" },
];

const publications = [
  {
    venue: "ACM Transactions on Graphics (SIGGRAPH 2026)",
    image: "static/images/bsfem.png",
    title: "Efficient B-Spline Finite Elements for Cloth Simulation",
    authorsHtml: '<strong>Yuqi Meng</strong>, Yihao Shi, Kemeng Huang, Zixuan Lu, Ning Guo, Taku Komura, Yin Yang, Minchen Li',
    links: [
      { label: "Project", href: "https://simulation-intelligence.github.io/BS-Cloth/" },
      { label: "Paper", href: "https://dl.acm.org/doi/10.1145/3811278" },
      { label: "Code", href: "https://github.com/Simulation-Intelligence/BS-Cloth" },
    ],
  },
  // ... JGS2-GQ, RT-Octree — same shape, verbatim from about.md
];

const education = [
  { date: "2025.07 – (now)", text: "Research Assistant, University of Utah" },
  { date: "2023.09 – 2025.05", text: "Undergraduate, University of Michigan." },
  { date: "2021.09 – 2025.08", text: "Undergraduate, Shanghai Jiao Tong University." },
];

const teaching = [
  {
    role: "Instructor Aide, University of Michigan",
    items: [
      'EECS 498-014: Graphics and Generative Models. (Course development, Winter 2025) [<a href="https://um-graphics.github.io/">course website</a>] Instructor: <a href="https://jjparkcv.github.io/">Jeong Joon Park</a>',
    ],
  },
  {
    role: "Teaching Assistant, Shanghai Jiao Tong University",
    items: [
      'ENGR1000J: Introduction to Engineering (Software Engineering). (Summer 2023) Instructor: <a href="...">Manuel Charlemagne</a>',
      'MATH2140J/MATH4170J: Linear Algebra. (Fall 2022, Spring 2023) Instructor: <a href="...">Manuel Charlemagne</a>',
    ],
  },
];
```

`authorsHtml`/`items`/`text` fields hold small inline HTML (bold, links, italics) rather than being escaped-then-re-parsed — matches how the content already exists (Markdown with inline formatting), avoids building a mini markdown parser for four short fields. Every string above is copied verbatim from the current `_pages/about.md` and `_config.yml`; nothing reworded.

Masthead identity, rail (avatar/name/alt/bio/location/contact links), and the About paragraphs + lede are **not** data-driven — they don't repeat, so they're plain HTML directly in `index.html`, matching how `../BS-Cloth/webpage` keeps its hero/abstract as static HTML and only data-drives the genuinely repeating sections (stress tests, comparison table).

---

## 6. Migration — removed vs. kept

**Removed** (dead once `.nojekyll` exists — Jekyll never runs, so Liquid/SCSS/layouts are inert):
`_layouts/`, `_includes/`, `_sass/`, `_pages/`, `_data/`, `_config.yml`, `Gemfile`, `Gemfile.lock`, `run_server.sh`, `assets/` (its Font Awesome/academicons icon fonts aren't needed either — icons were already replaced by the mono `▹` tick treatment in the rail).

**Kept, untouched:** `README.md`, `LICENSE`, `BingSiteAuth.xml`, `googledc266ad4045ad7f3.html`, `sitemap.xml`, `google_scholar_crawler/`, `.gitignore` (may need a small update once `_site/`/`.sass-cache/` references are no longer relevant), `docs/superpowers/` (design history).

**Kept, relocated:** the five images actually referenced (`images/android-chrome-512x512.png` → `static/images/avatar.png`, `bsfem.png`, `jgs2-gq.png`, `rt-octree.png`) plus the favicon set (`favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `site.webmanifest`) move to `static/images/`. `images/500x300.png` (unused placeholder) is dropped.

All 8 commits of the Jekyll-based implementation stay in `customization`'s git history — nothing is lost, just superseded by later commits on the same branch.

---

## 7. Component notes — carried forward, two now-possible upgrades

Everything in the original spec's §7 (rail, masthead, lede/about, section headers, news, publications, education/teaching) applies unchanged in substance. Two things couldn't be done against Jekyll-generated markup but can now, since `index.html` is hand-authored directly instead of restyling `kramdown`'s output:

- **Section headers** ("News", "Publications", "Educations", "Teaching"): the mono label sits *beside* a hairline that fills the rest of the row (`<div class="sec-h"><span class="sec-label">News</span><span class="sec-rule"></span></div>`), matching `docs/superpowers/redesign-reference.html` exactly, instead of the earlier hairline-below workaround forced by not being able to touch `about.md`'s plain-text headings.
- **Eyebrow line** above the lede: a small mono line restating the rail's role/location (e.g. "Research Assistant · University of Utah"), matching the reference. Restates facts already public in `_config.yml`'s `bio`/`employer` fields — not new content.

Everything else — avatar treatment, contact-list ticks, mesh signature, publication card layout, badge chip — carries forward as already built, just re-expressed in plain HTML/CSS instead of Liquid/SCSS. The rail and content column use CSS grid/flexbox directly (`display: grid; grid-template-columns: 300px 1fr;` on the two-column wrapper, matching the reference mockup's own approach) instead of the theme's float-based `susy` system — this is what actually fixes the rail-clamping bug at its root, not just at the symptom.

---

## 8. Accessibility & performance

Unchanged from the original spec §8 (contrast, focus rings, reduced motion, responsive, font loading) — **with one relaxation, flagged explicitly rather than silently dropped:**

> The original spec's quality floor said the page must "work with JavaScript disabled" for *all* content. Since News/Publications/Education/Teaching now render from `content.js` via `render.js`, those four sections require JS. This is a direct, accepted consequence of choosing the JS-data-array content model in brainstorming (traded for one-object-per-entry content editing instead of hand-written HTML per entry). The masthead, rail, and About/lede text remain plain HTML and stay visible with JS off — only the four data-driven sections don't render without it. `render.js` runs as a plain synchronous `<script>` at the end of `<body>` (not deferred/async), so JS-enabled visitors never see a flash of missing content.

Everything else holds: `--muted`/`--accent` contrast values already verified (§9 of the original spec — 5.20:1 and 5.90:1 on `--paper`), `:focus-visible` accent ring, `prefers-reduced-motion` guard, mesh stays CSS-only (no image request), fonts still load via Google Fonts CDN with `preconnect` + `display=swap` (self-hosting remains a future option, not required for v1).

---

## 9. Verification & acceptance criteria

1. `index.html` opens correctly via `file://` (no server) and via `python -m http.server` — both show identical rendering since content isn't fetched.
2. Dark rendering throughout: slate `#2A2E3B` background, soft `#C8CAD4` text, lavender `#AEA2EA` accents — no leftover light backgrounds anywhere (masthead, rail, About, News, Publications, Education, Teaching, footer).
3. Rail stacks vertically (avatar → name → alt → bio → location → contact links) at every viewport width, not just above 925px — this was the core bug being fixed.
4. Content column has a comfortable reading measure (doesn't run edge-to-edge on wide viewports); publication images render at a compact, thumbnail-like size, not the previous 400px-max blow-up.
5. Section headers show the mono label beside a hairline that fills the rest of the row.
6. All four data-driven sections (News, Publications, Education, Teaching) render correctly from `content.js` with JS enabled; masthead/rail/About text remain visible with JS disabled (§8's flagged exception covers the rest).
7. Contrast, focus rings, and reduced-motion behavior verified same as before.
8. Content text matches `about.md`/`_config.yml` verbatim — nothing reworded.
9. `google_scholar_crawler/` and the SEO/verification files at the repo root are untouched.
10. All work stays on `customization`; `main` untouched until a separate, explicitly-requested merge step.

---

## 10. Execution note

Per user direction, this spec is implemented directly — no separate implementation-plan document. The design here is concrete enough (exact file structure, exact data shapes, exact token values, exact removal list) to build from directly.
