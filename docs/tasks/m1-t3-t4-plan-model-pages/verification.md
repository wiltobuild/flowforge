## Verification Report

### Acceptance criteria (from `brief.md`, plus `plan.md`'s additions)

1. `npm run ci` passes clean — **VERIFIED**. Final run: build+typecheck 0 errors/0
   warnings, concepts-neutrality clean, all 10 examples still valid, all internal links
   in 26 rendered HTML files resolve, axe passes WCAG 2.0/2.1/2.2 A/AA on every page.
2. Every page follows its type's exact body order — **VERIFIED** by Themis, independently
   confirmed by direct read of all 13 files against `docs/02-content-types.md`.
3. Valid frontmatter on all 13 pages (`owner`, `last_verified: 2026-08-23`,
   `volatility: volatile`, correct tags, 2–3 `next` links) — **VERIFIED** by direct read
   and by the schema's own `superRefine` (would fail the build otherwise, per the
   `volatility` check added in M1-T1/T2's schema work).
4. No volatile fact retyped in prose where it should render from data — **VERIFIED after
   fixing 2 violations Themis found** (`chatgpt-plus.mdx`'s cross-plan price comparison,
   `haiku-4-5.mdx`'s cross-model context-window comparison). Re-checked by direct read
   post-fix; no further hardcoded numeric facts found.
5. Model pages: API pricing advanced-gated, beginner content qualitative only —
   **VERIFIED** two ways: (a) structurally, `ModelFacts.astro` wraps `api_pricing` in
   `LevelSection minLevel="advanced"` unconditionally; (b) empirically, browser-rendered
   `claude-sonnet-5`'s page text at default (beginner) level shows no pricing figures, and
   the built HTML's collapsed `<details data-min-level="advanced">` block contains the
   correct values ($2/$10/$0.2/$1/$5 per MTok) matching `models.yaml` exactly.
6. Plan pages: "How the limits feel" is plain, concrete language — **VERIFIED** by direct
   read of all 6 pages.
7. `docs/01-information-architecture.md` sitemap updated to the real 6-page set —
   **VERIFIED** by direct read.

### Additional checks run during this pass

- **Live browser render, `claude-pro.mdx`**: navigated the running dev server, confirmed
  `PlanFacts` renders price, included products, limit windows, limit-style note,
  confidence label, and staleness badge correctly; confirmed `next` links point at real
  pages.
- **Live browser render + built-HTML inspection, `claude-sonnet-5.mdx`**: confirmed the
  API-pricing `LevelSection` exists in the DOM, is collapsed by default, and contains
  correct values.
- **Deliberate reference-break test (Themis)**: confirmed independently that a nonexistent
  `planId`/`modelId` passed to the components does NOT fail `npm run build` or `npm run
  ci` — `getEntry()` returns `undefined` silently, the component renders its own
  "data unavailable" state, but CI stays green. This is a real, newly-surfaced gap
  (component props aren't covered by the existing `reference()` schema validation, and are
  a different gap from the already-tracked `check-references.mjs` follow-up). Recorded as
  a new follow-up task (#10), not fixed this task.
- **URL slug check**: confirmed all three OpenAI model files render at hyphenated URLs
  (`/plans/models/openai/gpt-5-6-sol/` etc.), not the period-stripped `gpt-56-sol` that
  the first build produced before the rename.

### Commands run

```
npm run build            (multiple times through the fix cycle)
npm run ci                (multiple times; final run clean)
node scripts/check-internal-links.mjs   (run directly once to see full broken-link detail)
grep / git mv / sed        (slug rename and cross-link fixes)
Browser: navigate + get_page_text on claude-pro and claude-sonnet-5 pages
grep against dist/ HTML to confirm LevelSection gating and correct pricing values
```

### Not verified

- **The actual current truth of any figure** beyond what M1-T1/T2 already verified live on
  2026-08-23 — this task only renders that data, it doesn't re-verify it.
- **Visual/CSS correctness** (spacing, responsive breakpoints, dark theme) of the two new
  components beyond what axe's automated a11y scan covers. No manual visual review at
  375/768/1280 or in dark theme was performed — recommend a manual pass before treating
  the components as fully polished, though nothing in axe or the build flagged a problem.
- **The level toggle's actual click-to-reveal behavior** for the advanced `LevelSection`
  on model pages — confirmed the collapsed state and its content via static HTML
  inspection, but did not click the toggle in the browser to watch it expand live. The
  toggle mechanism itself was already verified in M0-T6/T7; this task only needed to
  confirm its new content is wired in correctly, which is confirmed.
