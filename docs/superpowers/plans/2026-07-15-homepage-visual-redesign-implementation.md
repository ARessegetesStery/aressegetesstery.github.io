# Homepage Visual Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Re-skin the Jekyll/Minimal-Mistakes homepage into the "editorial, but cool and nocturnal" dark identity described in `docs/superpowers/specs/2026-07-15-homepage-visual-redesign-design.md` — slate/lavender palette, Newsreader + IBM Plex Mono, a mesh signature behind the header, and a mono "spec-sheet" treatment for nav/labels/dates — without touching content, IA, or the build tooling.

**Architecture:** Two-part SCSS strategy the spec prescribes: (A) flip the theme's compile-time `_sass/_variables.scss` colors/fonts so every partial recompiles dark "for free," then (B) layer the new identity (design tokens, mesh, spec-sheet components) in one new partial, `_sass/_redesign.scss`, imported last so it wins the cascade. A handful of `_includes/*.html` partials get small, spec-authorized markup tweaks (masthead identity block, rail "also known as Arias" line) — `_pages/about.md` itself is never touched.

**Tech Stack:** Jekyll + SCSS (Dart Sass via Jekyll's `jekyll-sass-converter`), Liquid includes, no new JS/build tooling.

## Global Constraints

- **Branch:** all work happens on `customization`. Never touch `main`, never push, never merge — this is a live GitHub Pages user site (spec header, §Branch note).
- **No content rewrite.** `_pages/about.md` prose is byte-for-byte unchanged by this plan. The only new copy anywhere is the rail's "also known as Arias" line (Task 6) and the masthead's "· Arias" suffix (Task 5) — both explicitly pre-approved by spec §1/§5/§7a as the sole allowed micro-additions, and both simply restate a fact already published in `about.md` ("I also go by Arias").
- **Dark only.** No `prefers-color-scheme` light variant, no theme toggle (spec §1 non-goal).
- **No new JS frameworks or build tooling ships in the repo.** This plan uses `npx --yes sass` purely as a local verification aid (see "Verification harness" below) — it never touches `package.json` or any repo file, so it leaves zero footprint.
- **Don't touch:** `google_scholar_crawler/`, `_includes/fetch_google_scholar_stats.html`, SEO/analytics includes, deploy setup (spec §1 non-goal).
- **Exact token values** (spec §3), locked with one accessibility adjustment justified in Task 4:
  ```
  --paper:#2A2E3B  --panel:#262A36  --ink:#C8CAD4  --faint:#6E7488
  --accent:#AEA2EA  --accent-2:#C2B8F0  --rule:#3A3F4E
  --muted:#9BA0B2   /* spec's own §8 fallback value, not the headline #8B90A2 — see Task 4 */
  --serif: "Newsreader", Georgia, serif;
  --mono : "IBM Plex Mono", ui-monospace, "Consolas", monospace;
  ```
- **"Fill the row" hairline, resolved:** spec §4b/§7d describe the section-label pattern as "a mono uppercase label ... followed by a hairline rule that fills the rest of the row" and the reference mockup shows this as a label beside a rule using dedicated `<span>` markup. Since `about.md`'s `# News` / `# Publications` headings are plain text nodes (no markup to hook a flex/grid layout onto without editing `about.md`, which is out of scope), every task below implements this as **label text, then a hairline rule on the line below** (`border-bottom` / `::after` block rule) rather than beside it. This is a deliberate, spec-consistent judgment call (§6: "when the spec doesn't dictate a pixel, decide by these [principles]") — flagged once here so it isn't re-litigated per task.
- **Lede paragraph, resolved:** spec §7c illustrates the lede with paraphrased copy ("Building robust, efficient methods for physics-based simulation. Still exploring.") that doesn't appear verbatim in `about.md`. The real paragraph that matches this theme is the *third* intro paragraph in `about.md` ("My research interest includes developing robust and efficient computing methods for physics-based simulation. Still exploring :)") — Task 7 styles that one as the lede. It lands as the closing line of the three-paragraph bio (not the opening line, since reordering is out of scope), which still reads as a deliberate crescendo into the News section.
- **Verification harness (no Jekyll/Ruby available in this environment):** every SCSS task below is verified by compiling the theme's actual SCSS with Dart Sass via `npx`, bypassing only the Jekyll front-matter line. This is a *real* compile of the same files Jekyll would compile (`_sass/*`, `assets/css/main.scss`), so a clean run is meaningful signal, not a rubber stamp. Run from the repo root:
  ```bash
  SCRATCH="C:/Users/UtahGraphics001/AppData/Local/Temp/claude/C---dev-aressegetesstery-github-io/06505154-967c-4291-bd3b-f273f851a25c/scratchpad"
  tail -n +3 assets/css/main.scss > "$SCRATCH/main_test.scss"
  npx --yes sass --load-path=_sass --no-source-map --quiet "$SCRATCH/main_test.scss" "$SCRATCH/main_test.css"
  echo "exit: $?"
  ```
  Expected every time: `exit: 0` and no stderr. Each task then greps `$SCRATCH/main_test.css` for the rules it just added. Because Ruby/Jekyll can't be run here, Task 10 also builds a static preview (real `about.md` content wired to the real compiled CSS) as an Artifact so the change can be eyeballed, and explicitly tells the user to run `run_server.sh` themselves before merging — per spec §9's acceptance criteria, that's the authoritative check.
- **Audited as not needing edits:** `_pages/about.md` (content lock), `_sass/_page.scss`, `_sass/_base.scss`, `_sass/_reset.scss` — spec §5 lists these "as needed," but every color/font they reference already routes through a `$variable` that Task 2 remaps to a dark/mono value, and the two remaining hardcoded spots (`::selection`, the `:focus` outline) are fully overridden by later-loading `_redesign.scss` in Task 4. Don't add speculative edits to these three files — see Task 9 for the audit that confirmed this.

---

### Task 1: Verification harness sanity check

**Files:** none (no repo changes — this just proves the harness in "Verification harness" above works before relying on it for every later task).

**Interfaces:**
- Produces: a proven-working compile command every later task's Step 2 references verbatim.

- [x] **Step 1: Confirm `npx sass` can compile the theme's current (pre-redesign) SCSS**

  Run (repo root):
  ```bash
  SCRATCH="C:/Users/UtahGraphics001/AppData/Local/Temp/claude/C---dev-aressegetesstery-github-io/06505154-967c-4291-bd3b-f273f851a25c/scratchpad"
  mkdir -p "$SCRATCH"
  tail -n +3 assets/css/main.scss > "$SCRATCH/main_test.scss"
  npx --yes sass --load-path=_sass --no-source-map --quiet "$SCRATCH/main_test.scss" "$SCRATCH/main_test.css"
  echo "exit: $?"
  wc -l "$SCRATCH/main_test.css"
  ```
  Expected: `exit: 0`, and `main_test.css` has several thousand lines (baseline today: ~9460).

- [x] **Step 2: No commit** — this task makes no repo changes.

---

### Task 2: Part A — flip the base theme dark (`_sass/_variables.scss`)

**Files:**
- Modify: `_sass/_variables.scss`

**Interfaces:**
- Produces: `$background-color`, `$text-color`, `$border-color`, `$link-color`, `$link-color-hover`, `$primary-color`, `$masthead-link-color(-hover)` now resolve to the dark/lavender palette; `$serif`/`$global-font-family`/`$header-font-family`/`$caption-font-family` resolve to Newsreader; `$sans-serif`/`$sans-serif-narrow`/`$monospace` resolve to IBM Plex Mono. Every later task (and every untouched partial) inherits these for free.
- Consumes: nothing (first content task).

This single file is what makes acceptance criterion §9.1 ("no leftover white backgrounds... anywhere") hold even for partials this plan never opens — `_archive.scss`, `_tables.scss`, `_notices.scss`, etc. all read these same variables.

- [x] **Step 1: Edit the Typography block**

  In `_sass/_variables.scss`, replace lines 15–21:
  ```scss
  /* system typefaces */
  $serif                      : Georgia, Times, serif;
  $sans-serif                 : "Trebuchet MS", Helvetica, sans-serif;
  // $sans-serif                 : Georgia, serif, sans-serif;

  // $sans-serif                 : -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", Arial, sans-serif;
  $monospace                  : Monaco, Consolas, "Lucida Console", monospace;
  ```
  with:
  ```scss
  /* system typefaces
     The theme's own partials already split usage cleanly: $serif/$global-font-family
     drive reading text (body, headings), while $sans-serif/$sans-serif-narrow drive
     structural chrome (masthead, nav, sidebar meta, page__meta, footer). Repointing
     both families is what turns that existing split into "serif = reading voice,
     mono = structural voice" (spec §3) without hunting down every selector. */
  $serif                      : "Newsreader", Georgia, serif;
  $sans-serif                 : "IBM Plex Mono", ui-monospace, "Consolas", monospace;
  $monospace                  : "IBM Plex Mono", ui-monospace, "Consolas", monospace;
  ```

  And replace line 24:
  ```scss
  $sans-serif-narrow          : $sans-serif;
  ```
  stays as-is (already `= $sans-serif`, now resolves to mono automatically) — no edit needed there.

  Replace lines 34–36:
  ```scss
  $global-font-family         : $sans-serif;
  $header-font-family         : $sans-serif;
  $caption-font-family        : $serif;
  ```
  with:
  ```scss
  $global-font-family         : $serif;
  $header-font-family         : $serif;
  $caption-font-family        : $serif;
  ```

- [x] **Step 2: Edit the Colors block**

  Replace lines 59–64:
  ```scss
  $body-color                 : #fff;
  $background-color           : #fff;
  $code-background-color      : #fafafa;
  $code-background-color-dark : $light-gray;
  $text-color                 : $dark-gray;
  $border-color                : $lighter-gray;
  ```
  with:
  ```scss
  $body-color                 : #C8CAD4; // --ink
  $background-color           : #2A2E3B; // --paper
  $code-background-color      : #262A36; // --panel
  $code-background-color-dark : $light-gray;
  $text-color                 : #C8CAD4; // --ink
  $border-color                : #3A3F4E; // --rule
  ```

  Replace line 66:
  ```scss
  $primary-color              : #7a8288;
  ```
  with:
  ```scss
  $primary-color              : #AEA2EA; // --accent
  ```

  Replace lines 53–57 (the gray ramp) so nothing derived from it (button/hr/pagination fallbacks) stays light-mode gray by accident:
  ```scss
  $gray                       : #7a8288;
  $dark-gray                  : mix(#000, $gray, 40%);
  $darker-gray                : mix(#000, $gray, 60%);
  $light-gray                 : mix(#fff, $gray, 50%);
  $lighter-gray               : mix(#fff, $gray, 90%);
  ```
  with:
  ```scss
  $gray                       : #6E7488; // ~ --faint
  $dark-gray                  : mix(#000, $gray, 40%);
  $darker-gray                : mix(#000, $gray, 60%);
  $light-gray                 : mix(#fff, $gray, 50%);
  $lighter-gray               : mix(#fff, $gray, 90%);
  ```

  Replace lines 96–101:
  ```scss
  /* links */
  $link-color                 : $info-color;
  $link-color-hover           : mix(#000, $link-color, 25%);
  $link-color-visited         : mix(#fff, $link-color, 25%);
  $masthead-link-color        : $primary-color;
  $masthead-link-color-hover  : mix(#000, $primary-color, 25%);
  ```
  with:
  ```scss
  /* links */
  $link-color                 : #AEA2EA; // --accent
  $link-color-hover           : #C2B8F0; // --accent-2
  $link-color-visited         : #AEA2EA; // --accent (no separate visited state in spec)
  $masthead-link-color        : #9BA0B2; // --muted (nav default, see Global Constraints)
  $masthead-link-color-hover  : #AEA2EA; // --accent
  ```

- [x] **Step 2: Compile-check**

  ```bash
  SCRATCH="C:/Users/UtahGraphics001/AppData/Local/Temp/claude/C---dev-aressegetesstery-github-io/06505154-967c-4291-bd3b-f273f851a25c/scratchpad"
  tail -n +3 assets/css/main.scss > "$SCRATCH/main_test.scss"
  npx --yes sass --load-path=_sass --no-source-map --quiet "$SCRATCH/main_test.scss" "$SCRATCH/main_test.css"
  echo "exit: $?"
  grep -n "background-color: #2a2e3b\|color: #c8cad4" "$SCRATCH/main_test.css" | head -5
  ```
  Expected: `exit: 0`, and at least one `background-color: #2a2e3b` match (from `html` in the compiled reset rules) plus a `color: #c8cad4` match (from `body`). Dart Sass lower-cases hex by default, hence the lowercase grep.

- [x] **Step 3: Commit**

  ```bash
  git add _sass/_variables.scss
  git commit -m "Flip base theme variables to the dark slate/lavender palette and Newsreader/IBM Plex Mono fonts"
  ```

---

### Task 3: Fonts + theme-color meta (`_includes/head/custom.html`)

**Files:**
- Modify: `_includes/head/custom.html`

**Interfaces:**
- Produces: the `Newsreader` and `IBM Plex Mono` web fonts loaded with `preconnect` + `display=swap`; `<meta name="theme-color">` matches `--paper`.
- Consumes: nothing.

- [x] **Step 1: Add font links and update theme-color**

  In `_includes/head/custom.html`, replace:
  ```html
  <meta name="msapplication-config" content="images/browserconfig.xml?v=M44lzPylqQ">
  <meta name="theme-color" content="#ffffff">
  <link rel="stylesheet" href="assets/css/academicons.css"/>
  ```
  with:
  ```html
  <meta name="msapplication-config" content="images/browserconfig.xml?v=M44lzPylqQ">
  <meta name="theme-color" content="#2A2E3B">
  <link rel="stylesheet" href="assets/css/academicons.css"/>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=IBM+Plex+Mono:wght@400;500&display=swap">
  ```

- [x] **Step 2: Verify**

  ```bash
  grep -n "theme-color\|fonts.googleapis\|Newsreader\|IBM+Plex+Mono" "C:/_dev/aressegetesstery.github.io/_includes/head/custom.html"
  ```
  Expected: `content="#2A2E3B"`, two `preconnect` lines, and the `css2?family=Newsreader...IBM+Plex+Mono...display=swap` stylesheet line, all present.

- [x] **Step 3: Commit**

  ```bash
  git add _includes/head/custom.html
  git commit -m "Load Newsreader and IBM Plex Mono, set theme-color to the dark paper background"
  ```

---

### Task 4: `_redesign.scss` foundation — tokens, selection, focus, reduced motion

**Files:**
- Create: `_sass/_redesign.scss`
- Modify: `assets/css/main.scss`

**Interfaces:**
- Produces: `:root` custom properties (`--paper`, `--panel`, `--ink`, `--muted`, `--faint`, `--accent`, `--accent-2`, `--rule`, `--serif`, `--mono`) available to every later task's CSS; a `:focus-visible` accent ring; `::selection` in accent/paper; a `prefers-reduced-motion` guard.
- Consumes: nothing new (independent of Task 2/3, but ordered after them since it's explicitly "the identity layer on top of the dark base").

- [x] **Step 1: Create `_sass/_redesign.scss`**

  ```scss
  /* ==========================================================================
     REDESIGN — editorial/nocturnal identity layer
     Net-new visual identity on top of the dark base theme (_variables.scss).
     Imported last from main.scss so these rules win the cascade. Every later
     component (masthead, rail, section headers, publications) adds its rules
     to this same file — see the spec at
     docs/superpowers/specs/2026-07-15-homepage-visual-redesign-design.md
     ========================================================================== */

  :root {
    --paper   : #2A2E3B;
    --panel   : #262A36;
    --ink     : #C8CAD4;
    /* Spec's headline --muted (#8B90A2) measures 4.26:1 on --paper, just under
       AA's 4.5:1 for normal text. #9BA0B2 is the spec's own suggested fallback
       (§8) and measures 5.20:1 — used as the actual token so no muted small
       text has to be second-guessed per-use. */
    --muted   : #9BA0B2;
    --faint   : #6E7488;
    --accent  : #AEA2EA;
    --accent-2: #C2B8F0;
    --rule    : #3A3F4E;
    --serif   : "Newsreader", Georgia, serif;
    --mono    : "IBM Plex Mono", ui-monospace, "Consolas", monospace;
  }

  ::selection {
    background: var(--accent);
    color: var(--paper);
  }

  /* Keyboard focus: replace the theme's default dotted/orange :focus ring with
     a visible accent ring on :focus-visible only, so mouse/touch clicks stay
     quiet and keyboard nav still gets a clear ring (spec §8). */
  a, button, input, textarea, select, summary, [tabindex] {
    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

- [x] **Step 2: Wire the import into `assets/css/main.scss`**

  In `assets/css/main.scss`, replace:
  ```scss
  @import "print";

  .paper-box {
  ```
  with:
  ```scss
  @import "print";
  @import "redesign";

  .paper-box {
  ```
  (`.paper-box`/`.badge` move into `_redesign.scss` in Task 8 — for now this just adds the import in the right, last-import position spec §5 requires.)

- [x] **Step 3: Compile-check**

  ```bash
  SCRATCH="C:/Users/UtahGraphics001/AppData/Local/Temp/claude/C---dev-aressegetesstery-github-io/06505154-967c-4291-bd3b-f273f851a25c/scratchpad"
  tail -n +3 assets/css/main.scss > "$SCRATCH/main_test.scss"
  npx --yes sass --load-path=_sass --no-source-map --quiet "$SCRATCH/main_test.scss" "$SCRATCH/main_test.css"
  echo "exit: $?"
  grep -n -- "--accent: #aea2ea\|::selection\|focus-visible\|prefers-reduced-motion" "$SCRATCH/main_test.css" | head -10
  ```
  Expected: `exit: 0`, and matches for `--accent: #aea2ea` (in the compiled `:root` rule), `::selection`, `:focus-visible`, and `prefers-reduced-motion`.

- [x] **Step 4: Commit**

  ```bash
  git add _sass/_redesign.scss assets/css/main.scss
  git commit -m "Add the redesign identity partial: design tokens, focus ring, selection color, reduced-motion guard"
  ```

---

### Task 5: Masthead / status-nav bar + mesh signature

**Files:**
- Modify: `_includes/masthead.html`
- Modify: `_sass/_masthead.scss`
- Modify: `_sass/_navigation.scss`
- Modify: `_sass/_redesign.scss`

**Interfaces:**
- Produces: `.masthead__identity` (serif site identity, links to `#about-me`), a mono nav restyle scoped to `.masthead .greedy-nav`, the mesh as `#main::before` with `.sidebar`/`.page` lifted to `z-index: 1`.
- Consumes: `--paper`/`--rule`/`--accent`/`--muted`/`--serif`/`--mono` from Task 4; `$masthead-link-color(-hover)` from Task 2.

The mesh sits in `#main` (which wraps the rail + content columns), not literally inside `.masthead`, because that's the real DOM: `default.html` renders `masthead.html` then a separate `#main` wrapping `sidebar.html` + `article.page`. This matches the reference file's actual layered structure (`.mesh` lives in the wrapper below the masthead bar, not inside it) — the masthead stays a flat `--paper` bar with its own hairline, and the mesh reads as texture behind the header/rail/lede region right under it, per spec §4a/§4b.

- [x] **Step 1: Restructure `_includes/masthead.html`**

  Replace the whole file:
  ```html
  <div class="masthead">
    <div class="masthead__inner-wrap">
      <a class="masthead__identity" href="#about-me">{{ site.author.name }}<span> · Arias</span></a>
      <nav id="site-nav" class="greedy-nav">
        <button><div class="navicon"></div></button>
        <ul class="visible-links">
          {% for link in site.data.navigation.main %}
            <li class="masthead__menu-item"><a href="{{ domain }}{{ link.url }}">{{ link.title }}</a></li>
          {% endfor %}
        </ul>
        <ul class="hidden-links hidden"></ul>
      </nav>
    </div>
  </div>
  ```
  This drops the old hardcoded "Homepage" menu item — `site.data.navigation.main` already includes an "About Me" → `/#about-me` entry (`_data/navigation.yml`), and the new identity link now also points there, so the "go home" affordance isn't lost, just deduplicated per spec §7b ("Left: site identity... Right: mono nav links ... from `_data/navigation.yml`").

- [x] **Step 2: Restyle `_sass/_masthead.scss`**

  Replace the whole file:
  ```scss
  /* ==========================================================================
     MASTHEAD
     ========================================================================== */

  .masthead {
    position: sticky;
    top: 0;
    background-color: var(--paper);
    border-bottom: 1px solid var(--rule);
    -webkit-animation: intro 0.3s both;
            animation: intro 0.3s both;
    -webkit-animation-delay: 0.15s;
            animation-delay: 0.15s;
    z-index: 20;

    &__inner-wrap {
      @include container;
      @include clearfix;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .9em 1.5em;
      font-family: $sans-serif-narrow;

      @include breakpoint($x-large) {
        max-width: $x-large;
      }

      nav {
        z-index: 10;
      }

      a {
        text-decoration: none;
      }
    }
  }

  .masthead__identity {
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 600;
    color: var(--ink);
    white-space: nowrap;

    span {
      font-weight: 400;
      font-style: italic;
      color: var(--muted);
    }

    &:hover {
      color: var(--ink);
    }
  }

  .masthead__menu {
    ul {
      margin: 0;
      padding: 0;
      clear: both;
      list-style-type: none;
    }
  }

  .masthead__menu-item {
    display: block;
    list-style-type: none;
    white-space: nowrap;
  }
  ```
  (Dropped `.masthead__menu-home-item` and `.masthead__menu-item--lg` — the markup that used them no longer exists after Step 1.)

- [x] **Step 3: Add mono nav treatment in `_sass/_navigation.scss`**

  At the end of `_sass/_navigation.scss`, append:
  ```scss

  /*
     Masthead nav — mono "spec-sheet" treatment
     ========================================================================== */

  .masthead .greedy-nav {
    min-width: 0;
    background: transparent;

    .visible-links {
      a {
        font-family: var(--mono);
        font-size: .68rem;
        letter-spacing: .14em;
        text-transform: uppercase;
        margin: 0 0 0 1.75rem;
        padding: .5rem 0;
      }

      li:first-child a {
        margin-left: 0;
      }
    }

    button {
      background-color: transparent;
      color: var(--muted);

      &:hover {
        color: var(--accent);
      }
    }

    .hidden-links {
      background: var(--panel);
      border: 1px solid var(--rule);
      box-shadow: 0 8px 24px rgba(0, 0, 0, .35);

      a {
        font-family: var(--mono);
        font-size: .72rem;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: var(--ink);

        &:hover {
          color: var(--accent);
          background: var(--paper);
        }
      }

      &:before { border-color: var(--rule) transparent; }
      &:after { border-color: var(--panel) transparent; }

      li { border-bottom: 1px solid var(--rule); }
    }
  }

  /* Below $medium the rail already stacks above the content in natural reading
     order, so the in-page nav is redundant — drop it rather than let the
     table-cell nav links wrap awkwardly (spec's reference composition hides
     nav below 768px too). Pure CSS, so this holds with JS disabled. */
  @include breakpoint(max-width $medium) {
    .masthead .greedy-nav {
      .visible-links, button {
        display: none;
      }
    }
  }
  ```

- [x] **Step 4: Add the mesh signature in `_sass/_redesign.scss`**

  Append to `_sass/_redesign.scss`:
  ```scss

  /*
     Mesh signature — a faint FEM/cloth-mesh grid behind the header region.
     Lives on #main (wraps the rail + content columns) rather than inside
     .masthead, matching the real DOM: masthead.html renders as its own bar,
     #main is a separate wrapper below it. CSS-only, static (§4a), pointer-
     events none so it never intercepts clicks.
     ========================================================================== */

  #main {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      inset: 0 0 auto 0;
      height: 230px;
      z-index: 0;
      pointer-events: none;
      opacity: .12;
      background-image:
        linear-gradient(var(--accent) 1px, transparent 1px),
        linear-gradient(90deg, var(--accent) 1px, transparent 1px);
      background-size: 28px 28px;
      -webkit-mask-image: radial-gradient(130% 90% at 22% -10%, #000 0%, transparent 68%);
              mask-image: radial-gradient(130% 90% at 22% -10%, #000 0%, transparent 68%);
    }

    > .sidebar,
    > .page {
      position: relative;
      z-index: 1;
    }
  }
  ```

- [x] **Step 5: Compile-check**

  ```bash
  SCRATCH="C:/Users/UtahGraphics001/AppData/Local/Temp/claude/C---dev-aressegetesstery-github-io/06505154-967c-4291-bd3b-f273f851a25c/scratchpad"
  tail -n +3 assets/css/main.scss > "$SCRATCH/main_test.scss"
  npx --yes sass --load-path=_sass --no-source-map --quiet "$SCRATCH/main_test.scss" "$SCRATCH/main_test.css"
  echo "exit: $?"
  grep -n "masthead__identity\|#main::before\|linear-gradient(var\|background-image" "$SCRATCH/main_test.css" | head -10
  ```
  Expected: `exit: 0`; `.masthead__identity` rule present; `#main::before` rule present with the two `linear-gradient(...)` background-image layers.

- [x] **Step 6: Commit**

  ```bash
  git add _includes/masthead.html _sass/_masthead.scss _sass/_navigation.scss _sass/_redesign.scss
  git commit -m "Restyle the masthead into a dark mono status/nav bar and add the mesh signature behind the header"
  ```

---

### Task 6: Rail — avatar, identity, contact list (`author-profile.html` + `_sidebar.scss`)

**Files:**
- Modify: `_includes/author-profile.html`
- Modify: `_sass/_sidebar.scss`
- Modify: `_sass/_redesign.scss`

**Interfaces:**
- Produces: `.author__alt` (new — "also known as Arias" line), restyled `.author__avatar img`, `.sidebar .author__name`, `.author__bio` (role line), `.author__urls` (contact list, always visible, no JS-toggle dependency), right-hand hairline divider on `.sidebar`.
- Consumes: tokens from Task 4.

- [x] **Step 1: Add the "also known as Arias" line to `_includes/author-profile.html`**

  Replace:
  ```html
    <div class="author__content">
      <h3 class="author__name">{{ author.name }}</h3>
      {% if author.bio %}<p class="author__bio">{{ author.bio }}</p>{% endif %}
    </div>
  ```
  with:
  ```html
    <div class="author__content">
      <h3 class="author__name">{{ author.name }}</h3>
      <p class="author__alt">also known as Arias</p>
      {% if author.bio %}<p class="author__bio">{{ author.bio }}</p>{% endif %}
    </div>
  ```
  All other conditionals in the file (location, email, googlescholar, github, instagram, and every unpopulated network) are left untouched per spec §5 ("the include is verbose ... only the populated ones render ... leave the conditionals intact").

- [x] **Step 2: Add the right-hand hairline divider in `_sass/_sidebar.scss`**

  Replace:
  ```scss
  .sidebar {
    -webkit-transform: translate3d(0, 0 , 0);
            transform: translate3d(0, 0 , 0);

    @include clearfix();
    margin-bottom: 1em;

    @include breakpoint($large) {
      @include span(2 of 12);
      opacity: 1;
      -webkit-transition: opacity 0.2s ease-in-out;
              transition: opacity 0.2s ease-in-out;

      &:hover {
        opacity: 1;
      }
    }
  ```
  with:
  ```scss
  .sidebar {
    -webkit-transform: translate3d(0, 0 , 0);
            transform: translate3d(0, 0 , 0);

    @include clearfix();
    margin-bottom: 1em;

    @include breakpoint($large) {
      @include span(2 of 12);
      opacity: 1;
      border-right: 1px solid var(--rule);
      padding-right: 1.5em;
      -webkit-transition: opacity 0.2s ease-in-out;
              transition: opacity 0.2s ease-in-out;

      &:hover {
        opacity: 1;
      }
    }
  ```

- [x] **Step 3: Add rail component styles to `_sass/_redesign.scss`**

  Append:
  ```scss

  /*
     Rail — avatar, identity, contact list (spec §7a)
     ========================================================================== */

  .author__avatar img {
    width: 64px;
    height: 64px;
    max-width: 64px;
    min-width: 64px;
    object-fit: cover;
    padding: 0;
    border: 1px solid var(--rule);
    box-shadow: 0 6px 20px rgba(0, 0, 0, .35);
  }

  .sidebar .author__name {
    font-family: var(--serif);
    font-weight: 600;
    font-size: 1.75rem;
    color: var(--ink);
    letter-spacing: -0.01em;
  }

  .author__alt {
    margin: .25em 0 0;
    font-family: var(--serif);
    font-style: italic;
    font-weight: 400;
    color: var(--muted);
    font-size: 1rem;
  }

  .author__bio {
    margin: 1em 0 0;
    font-family: var(--mono);
    font-size: .72rem;
    color: var(--muted);
    line-height: 1.7;
    letter-spacing: .02em;
  }

  /* Contact list: the base theme hides this behind a JS-toggled dropdown below
     $large (display:none by default, only a non-functional button without JS)
     — that fails the "works without JS" requirement (spec §8) on mobile. Force
     it always visible and drop the now-pointless toggle button instead. */
  .author__urls-wrapper button {
    display: none;
  }

  .author__urls {
    display: block;
    position: static;
    margin: 1.4em 0 0;
    padding: 0;
    list-style: none;
    border: 0;
    background: transparent;
    box-shadow: none;
    font-family: var(--mono);

    &:before, &:after {
      display: none;
    }

    li {
      display: flex;
      align-items: baseline;
      gap: .55em;
      padding: .55em 0;
      border-top: 1px solid var(--rule);
      font-size: .78rem;
      letter-spacing: .01em;
      white-space: normal;
      color: var(--ink);

      &::before {
        content: "▹";
        color: var(--accent);
        font-size: .68rem;
        line-height: 1;
      }

      &:last-child {
        border-bottom: 1px solid var(--rule);
      }
    }

    /* first populated item is the location line (spec §5/§10) — read as a
       quiet caption, not a contact-link row */
    li:first-child {
      color: var(--faint);
      font-size: .72rem;

      &::before {
        display: none;
      }
    }

    a {
      color: var(--ink);
      text-decoration: none;
      margin: 0;
      padding: 0;
      font-size: inherit;

      &:hover {
        color: var(--accent);
      }
    }

    i {
      display: none;
    }
  }
  ```

- [x] **Step 4: Compile-check**

  ```bash
  SCRATCH="C:/Users/UtahGraphics001/AppData/Local/Temp/claude/C---dev-aressegetesstery-github-io/06505154-967c-4291-bd3b-f273f851a25c/scratchpad"
  tail -n +3 assets/css/main.scss > "$SCRATCH/main_test.scss"
  npx --yes sass --load-path=_sass --no-source-map --quiet "$SCRATCH/main_test.scss" "$SCRATCH/main_test.css"
  echo "exit: $?"
  grep -n "author__alt\|author__urls\|author__avatar img" "$SCRATCH/main_test.css" | head -10
  ```
  Expected: `exit: 0`; `.author__alt`, `.author__urls`, and `.author__avatar img` rules all present.

- [x] **Step 5: Commit**

  ```bash
  git add _includes/author-profile.html _sass/_sidebar.scss _sass/_redesign.scss
  git commit -m "Restyle the rail: round avatar with hairline ring, serif name, mono role/contact rows always visible without JS"
  ```

---

### Task 7: Content typography — lede, section headers, News/Education/Teaching rhythm

**Files:**
- Modify: `_sass/_redesign.scss`

**Interfaces:**
- Produces: `.page__content` base typography, the lede paragraph rule (`.page__content > p:nth-of-type(3)`), the section-label pattern on `.page__content h1`/`h2`, the mono-date list-item pattern.
- Consumes: tokens from Task 4. No markup changes — every selector below is written against the exact DOM `kramdown` already produces from the unmodified `about.md` (verified against the file's actual heading/paragraph/list structure during planning).

- [x] **Step 1: Append content typography rules to `_sass/_redesign.scss`**

  ```scss

  /*
     Content typography — About, News, Publications, Educations, Teaching
     (spec §7c/§7d/§7e/§7g). Publications' .paper-box/.badge are handled
     separately in the "Publications" block below.
     ========================================================================== */

  .page__content {
    font-family: var(--serif);
    color: var(--ink);
    font-size: 1.06rem;
    line-height: 1.6;

    a {
      color: var(--accent);
      text-decoration: underline;
      text-decoration-color: var(--rule);
      text-underline-offset: 3px;

      &:hover {
        color: var(--accent-2);
        text-decoration-color: var(--accent-2);
      }
    }

    /* the closing line of the bio ("...Still exploring :)") as the italic
       lede — see Global Constraints for why it's the 3rd paragraph, not the
       1st */
    > p:nth-of-type(3) {
      font-style: italic;
      font-size: 1.4rem;
      line-height: 1.4;
      color: #D6D8E0;
      margin: 1.4em 0 1.6em;
    }

    h1 {
      margin-top: 2.75em;
      margin-bottom: 1em;
      padding-bottom: .6em;
      font-family: var(--mono);
      font-weight: 500;
      font-size: .68rem;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--accent);
      border-bottom: 1px solid var(--rule);
    }

    h2 {
      margin-top: 1.8em;
      margin-bottom: .5em;
      font-family: var(--mono);
      font-weight: 500;
      font-size: .66rem;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: var(--muted);

      em {
        font-style: normal;
      }
    }

    ul {
      list-style: none;
      padding-left: 0;
      margin: 0 0 1.5em;
    }

    li {
      margin-bottom: .55em;
      font-size: .98rem;
      line-height: 1.5;
    }

    /* News ("*2026.04*: ...") and Educations ("*2025.07 - (now)*, ...") both
       lead each <li> with an italic markdown date — Teaching's <li> items
       don't, so this only ever matches the two lists it should. */
    li em:first-child {
      display: inline-block;
      min-width: 6.2em;
      margin-right: .3em;
      font-style: normal;
      font-family: var(--mono);
      font-size: .68rem;
      letter-spacing: .02em;
      color: var(--accent);
      vertical-align: top;
    }
  }
  ```

- [x] **Step 2: Compile-check**

  ```bash
  SCRATCH="C:/Users/UtahGraphics001/AppData/Local/Temp/claude/C---dev-aressegetesstery-github-io/06505154-967c-4291-bd3b-f273f851a25c/scratchpad"
  tail -n +3 assets/css/main.scss > "$SCRATCH/main_test.scss"
  npx --yes sass --load-path=_sass --no-source-map --quiet "$SCRATCH/main_test.scss" "$SCRATCH/main_test.css"
  echo "exit: $?"
  grep -n "nth-of-type(3)\|text-transform: uppercase" "$SCRATCH/main_test.css" | head -10
  ```
  Expected: `exit: 0`; the `nth-of-type(3)` lede rule present; multiple `text-transform: uppercase` matches (h1, h2, list dates).

- [x] **Step 3: Commit**

  ```bash
  git add _sass/_redesign.scss
  git commit -m "Style the lede, mono section-label headers, and News/Education date rhythm"
  ```

---

### Task 8: Publications cards + badge chip

**Files:**
- Modify: `assets/css/main.scss` (remove the raw `.paper-box`/`.badge` blocks)
- Modify: `_sass/_redesign.scss` (add the restyled versions)

**Interfaces:**
- Produces: dark `.paper-box`/`.paper-box-image`/`.paper-box-text`/`.badge`, moved from `main.scss` into the identity partial per spec §5's explicit instruction.
- Consumes: tokens from Task 4.

All layout/positioning values (flex, `order`, breakpoint reflow, `max-width`/`min-width`, the badge's `position: absolute; margin-top: .5em; margin-left: -.5em;`) are preserved **verbatim** from the current CSS — only color, border, and typography change. This environment has no way to render the page in a real browser, so any layout-value change here would be unverifiable; only the spec-directed color/typography changes are made.

- [x] **Step 1: Remove the raw blocks from `assets/css/main.scss`**

  Replace:
  ```scss
  @import "print";
  @import "redesign";

  .paper-box {
      display: flex;
      justify-content: left;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      border-bottom: 1px #efefef solid;
      padding: 2em 0 2em 0;
      

      .paper-box-image{
          justify-content: center;
          display: flex;
          width: 100%;
          order: 2;
          img {
              max-width: 400px;
              box-shadow: 3px 3px 6px #888;
              object-fit: cover;
          }
      }
      
      .paper-box-text{
          max-width: 100%;
          order: 1;
      }
      
      @include breakpoint($medium) {
          .paper-box-image{
              justify-content: left;
              min-width: 200px;
              max-width: 40%;
              order: 1;
          }
          
          .paper-box-text{
              justify-content: left;
              padding-left: 2em;
              max-width: 60%;
              order: 2;
          }

      }


  }

  $scroll_offset : 2em;
  h1:before, .anchor:before { 
      content: ''; 
      display: block; 
      position: relative; 
      width: 0; 
      height: $scroll_offset; 
      margin-top: -$scroll_offset;
  }

  .badge {
      padding-left: 1rem;
      padding-right: 1rem;
      position: absolute;
      margin-top: .5em;
      margin-left: -.5em;
      color: white;
      background-color: #00369f;
      font-size: .8em;
  }
  ```
  with:
  ```scss
  @import "print";
  @import "redesign";

  $scroll_offset : 2em;
  h1:before, .anchor:before { 
      content: ''; 
      display: block; 
      position: relative; 
      width: 0; 
      height: $scroll_offset; 
      margin-top: -$scroll_offset;
  }
  ```
  (`.paper-box`/`.badge` move into `_redesign.scss` below; the anchor-offset trick stays put untouched, exactly as spec §7d requires — "preserving the existing anchor/scroll-offset behavior in `main.scss`.")

- [x] **Step 2: Add the restyled blocks to `_sass/_redesign.scss`**

  Append:
  ```scss

  /*
     Publications — .paper-box / .badge (spec §7f)
     Moved here from assets/css/main.scss per spec §5. Layout/positioning
     values (flex, order, breakpoint reflow, badge offset) are unchanged from
     the original — only color/border/typography are restyled dark.
     ========================================================================== */

  .paper-box {
      display: flex;
      justify-content: left;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      border-bottom: 1px solid var(--rule);
      padding: 2em 0 2em 0;

      .paper-box-image{
          justify-content: center;
          display: flex;
          width: 100%;
          order: 2;
          img {
              max-width: 400px;
              border: 1px solid var(--rule);
              border-radius: 4px;
              object-fit: cover;
          }
      }

      .paper-box-text{
          max-width: 100%;
          order: 1;

          p {
            font-family: var(--serif);
          }

          p:first-of-type {
            margin-top: 0;
            font-weight: 600;
            font-size: 1.12rem;
            line-height: 1.35;
            color: var(--ink);
          }

          p:nth-of-type(2) {
            font-size: .92rem;
            color: var(--muted);

            strong {
              color: var(--ink);
              font-weight: 600;
            }
          }

          p:last-of-type {
            margin-top: .6em;
            font-family: var(--mono);
            font-size: .74rem;
            letter-spacing: .02em;

            a {
              margin-right: 1.1em;
              color: var(--accent);
              text-decoration: none;

              &:hover {
                color: var(--accent-2);
              }
            }
          }
      }

      @include breakpoint($medium) {
          .paper-box-image{
              justify-content: left;
              min-width: 200px;
              max-width: 40%;
              order: 1;
          }

          .paper-box-text{
              justify-content: left;
              padding-left: 2em;
              max-width: 60%;
              order: 2;
          }

      }


  }

  .badge {
      padding-left: 1rem;
      padding-right: 1rem;
      position: absolute;
      margin-top: .5em;
      margin-left: -.5em;
      color: var(--accent);
      background-color: var(--panel);
      border: 1px solid var(--rule);
      font-family: var(--mono);
      font-size: .62rem;
      font-weight: 500;
      letter-spacing: .04em;
      text-transform: uppercase;
      border-radius: 4px;
  }
  ```

- [x] **Step 3: Compile-check**

  ```bash
  SCRATCH="C:/Users/UtahGraphics001/AppData/Local/Temp/claude/C---dev-aressegetesstery-github-io/06505154-967c-4291-bd3b-f273f851a25c/scratchpad"
  tail -n +3 assets/css/main.scss > "$SCRATCH/main_test.scss"
  npx --yes sass --load-path=_sass --no-source-map --quiet "$SCRATCH/main_test.scss" "$SCRATCH/main_test.css"
  echo "exit: $?"
  grep -n "^\.paper-box\|^\.badge" "$SCRATCH/main_test.css"
  grep -c "#00369f\|#efefef\|3px 3px 6px #888" "$SCRATCH/main_test.css"
  ```
  Expected: `exit: 0`; exactly one `.paper-box {` and one `.badge {` rule (confirms the old raw block was fully removed, not duplicated); the second grep returns `0` (no leftover light-mode hex literals anywhere in the compiled output).

- [x] **Step 4: Commit**

  ```bash
  git add assets/css/main.scss _sass/_redesign.scss
  git commit -m "Move and restyle publication cards + venue badge into the redesign partial, dark and mono"
  ```

---

### Task 9: Accessibility, contrast, and stray-color audit

**Files:** none expected (verification-only; only touches files if the audit below finds a real issue).

**Interfaces:**
- Produces: a documented, evidence-based confirmation that spec §8's quality floor holds, or fixes if it doesn't.
- Consumes: the full compiled CSS from Tasks 2–8.

- [x] **Step 1: Re-verify contrast on the locked token values**

  ```bash
  python3 -c "
  def lum(hex):
      hex = hex.lstrip('#')
      r,g,b = int(hex[0:2],16)/255, int(hex[2:4],16)/255, int(hex[4:6],16)/255
      def f(c):
          return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
      r,g,b = f(r),f(g),f(b)
      return 0.2126*r + 0.7152*g + 0.0722*b
  def contrast(h1,h2):
      l1,l2 = lum(h1), lum(h2)
      l1,l2 = max(l1,l2), min(l1,l2)
      return (l1+0.05)/(l2+0.05)
  paper = '#2A2E3B'
  for name, hexv in {'ink':'#C8CAD4','muted (adjusted)':'#9BA0B2','accent':'#AEA2EA','accent-2':'#C2B8F0','lede':'#D6D8E0'}.items():
      print(f'{name} on paper: {contrast(hexv,paper):.2f}:1')
  "
  ```
  Expected/locked values (computed during planning, re-run here only to confirm the shipped tokens match): `ink 8.28:1`, `muted 5.20:1`, `accent 5.90:1`, `accent-2 7.35:1`, `lede 9.51:1` — all clear AA (4.5:1) for normal text. `--faint` (#6E7488, 2.91:1) is intentionally sub-AA and is only ever used for the rail's location caption and (per spec §3) venue/caption text — never for links, body copy, or anything essential; confirm with Step 2 that this scoping held.

- [x] **Step 2: Grep audit for stray light-mode colors across every file this plan touched**

  ```bash
  grep -n "#fff\|#000\|white\|black\|#efefef\|#888\|#00369f" \
    "C:/_dev/aressegetesstery.github.io/_sass/_masthead.scss" \
    "C:/_dev/aressegetesstery.github.io/_sass/_navigation.scss" \
    "C:/_dev/aressegetesstery.github.io/_sass/_sidebar.scss" \
    "C:/_dev/aressegetesstery.github.io/_sass/_redesign.scss"
  ```
  Expected: only `rgba(0, 0, 0, .35)`/`rgba(0,0,0,.25)`-style drop-shadow values (dark shadows are correct on a dark background, don't need changing) — no bare `#fff`, `white`, `#efefef`, `#888`, or `#00369f` surface colors. If anything else turns up, fix it in `_redesign.scss` (later-loaded, so it wins) before continuing.

- [x] **Step 3: Confirm `--faint` usage is scoped to non-essential text only**

  ```bash
  grep -n "var(--faint)" "C:/_dev/aressegetesstery.github.io/_sass/_redesign.scss"
  ```
  Expected: only the rail's `.author__urls li:first-child` (location caption) — no links, no body text, no primary labels. (Nothing else in this plan uses `--faint`; `.paper-box`'s venue text lives only inside the `.badge` chip, which uses `--accent` on `--panel`, not `--faint` — see Task 8.)

- [x] **Step 4: Confirm responsive stacking needs no changes**

  ```bash
  grep -n "breakpoint(\$large)" "C:/_dev/aressegetesstery.github.io/_sass/_sidebar.scss" "C:/_dev/aressegetesstery.github.io/_sass/_page.scss" | head -5
  ```
  `.sidebar`'s and `.page`'s susy `span()`/`prefix()` calls only activate `@include breakpoint($large)` (925px). Below that — which fully covers spec §8's "below $medium (768px)" — both are plain full-width blocks, so the rail already stacks above the content with no horizontal scroll at every width the spec cares about. No edit needed; this step is confirmation, not a fix.

- [x] **Step 5: No commit if the audit is clean** (expected outcome). If Step 2 or 3 finds a real stray color, fix it in `_sass/_redesign.scss`, re-run the Task 8 Step 3 compile-check, then:
  ```bash
  git add _sass/_redesign.scss
  git commit -m "Fix stray light-mode color found in accessibility audit"
  ```

---

### Task 10: Final verification and sign-off preview

**Files:**
- Create (scratch, not committed): a static preview HTML wired to the real compiled CSS, published as an Artifact.

**Interfaces:**
- Produces: a full clean compile of the final SCSS tree; a visual artifact the user can actually look at (this environment has no Ruby/Jekyll, so `run_server.sh` can't be run here); an explicit walkthrough of spec §9's numbered acceptance criteria.

- [x] **Step 1: Full compile-check on the final tree**

  ```bash
  SCRATCH="C:/Users/UtahGraphics001/AppData/Local/Temp/claude/C---dev-aressegetesstery-github-io/06505154-967c-4291-bd3b-f273f851a25c/scratchpad"
  tail -n +3 assets/css/main.scss > "$SCRATCH/main_test.scss"
  npx --yes sass --load-path=_sass --no-source-map --quiet "$SCRATCH/main_test.scss" "$SCRATCH/main_test.css"
  echo "exit: $?"
  grep -c "Newsreader\|IBM Plex Mono" "$SCRATCH/main_test.css"
  ```
  Expected: `exit: 0`; the font-family grep returns a healthy count (dozens — it's now the `$serif`/`$sans-serif` default across the whole compiled stylesheet).

- [x] **Step 2: Build a static preview from the real compiled CSS + real `about.md` content**

  Copy `$SCRATCH/main_test.css` content inline into an HTML file scaffolded to match the actual rendered DOM (masthead, `#main` > `.sidebar` + `.page.page__content`) using the **real** text from `_pages/about.md` and `_config.yml`'s author block — not the illustrative copy from `docs/superpowers/redesign-reference.html`. Save to the scratchpad directory and publish with the `Artifact` tool (favicon: 🌙, title "Homepage Redesign — Compiled Preview") so the actual compiled dark/mono styling can be reviewed without needing Ruby installed.

- [x] **Step 3: Walk spec §9's acceptance criteria explicitly**

  Confirm each, citing the task that satisfies it:
  1. Dark rendering, no leftover white/black/stock-blue anywhere → Task 2 (global flip) + Task 9 Step 2 (grep audit found nothing).
  2. Newsreader for reading text, IBM Plex Mono for labels/dates/nav/venues, fonts load with `display=swap` → Task 2 (variable remap) + Task 3 (font loading).
  3. Mesh visible-but-subtle behind the header; masthead is the single mono status/nav bar; section headers use mono-label + hairline → Task 5 + Task 7.
  4. Publications/News/Education/Teaching restyled and legible; owner's name bolded in author lists → Task 8 (existing `<strong>` around "Yuqi Meng" in `about.md` already renders bold; Task 8's `p:nth-of-type(2) strong { color: var(--ink) }` makes it visually pop against the muted co-author list).
  5. §8 checks: contrast (Task 9 Step 1), focus rings (Task 4), mobile layout (Task 9 Step 4), works with JS disabled (Task 6 Step 3 — contact list no longer JS-gated; Task 5's nav hide is a pure CSS media query).
  6. Content unchanged from `about.md` aside from the two pre-approved rail/masthead micro-additions (Global Constraints).
  7. All work on `customization`, `main` untouched → confirm with `git branch --show-current` and `git status` against `main` before finishing.

- [x] **Step 4: Tell the user what couldn't be verified here**

  State plainly: this environment has no Ruby/Jekyll, so `run_server.sh` was never actually run. The Dart Sass compiles in every task are a real compile of the same SCSS Jekyll would compile (not a stub), and the artifact in Step 2 uses the real compiled CSS — but neither is a substitute for `bundle exec jekyll serve` and a real browser pass per spec §9's stated verification method. Recommend the user run it themselves before merging anything toward `main`.

- [x] **Step 5: No code commit** (Step 1–4 are verification only; the scratch artifact file is never added to the repo).
