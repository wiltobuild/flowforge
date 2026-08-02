# 06 — Design system

Boring, legible, fast. This is a reference manual people consult under time pressure, not
a portfolio piece. Every design decision should serve scanning.

---

## Principles

1. **Optimize for scanning, not reading.** Consistent structure, generous headings,
   scannable badges.
2. **Density is a feature.** The audience is looking something up. Do not pad with
   whitespace-heavy marketing layout.
3. **Never hide information behind color alone.** Every badge pairs color with a label or
   icon.
4. **No layout shift.** The level toggle, theme, and plan filter all resolve before first
   paint.
5. **Mobile is a real use case.** People check quota weight on their phone mid-session.

---

## Core components

### Level toggle

Persistent header control, three states, keyboard operable, `localStorage`-backed,
defaults to beginner. Above-level content collapses to a labelled disclosure
("Show advanced detail") — never removed from the DOM, so in-page search and deep links
keep working.

### Quota weight badge

The site's signature element. Appears on models, playbook steps, agent profiles, prompts,
and search results.

| Value | Treatment |
|---|---|
| `light` | Low-emphasis, label "Light" |
| `moderate` | Mid-emphasis, label "Moderate" |
| `heavy` | High-emphasis, label "Heavy" |
| `n-a` | Omitted entirely — do not render an empty badge |

Always includes the word, never color-only. Tooltip explains what it's relative to.

### Staleness badge

Driven by `volatility` + `last_verified` (thresholds in `docs/03`). Renders as an inline
date chip normally; escalates to a full-width banner when past threshold, with a link to
the provider source and to the page's issue tracker.

Wording is honest and non-alarming: "Last verified 12 Mar 2026 — may be out of date. Check
the provider's page."

### Status badge

`draft` and `review` render visibly. `verified` renders quietly or not at all — the
absence of a warning is the signal.

### Copy block

Every prompt, agent profile, skill, and template body. Requirements:

- Copy button with confirmed feedback state
- `{{variables}}` visually distinguished and explained beneath
- Download option for file-shaped content (skills, templates, agent profiles)
- Horizontally scrollable within its own container
- Never inside a glossary auto-link

### Card

The universal content preview: title, description, level badge, quota badge, time
estimate, tag chips. Used in search, related blocks, task-door results, and section
indexes. One card component, one shape, everywhere.

### Next links

Mandatory footer block, 2–3 links. Rendered from the `next` frontmatter field. A page
without it fails validation.

---

## Tokens

Define as CSS custom properties. **No hard-coded values in components.**

- **Color:** semantic names only (`--surface`, `--text`, `--accent`, `--warn`,
  `--quota-light/moderate/heavy`). Never `--blue-500` in a component.
- **Type scale:** modest, 5 steps. Body text no smaller than 16px.
- **Spacing:** 4px base, 6 steps.
- **Radius / shadow:** 2 steps each. Resist more.

### Theming

Light and dark are both first-class. Follow `prefers-color-scheme` by default, with an
explicit user override that wins in both directions. Every token has both values. **WCAG
AA contrast in both themes is a build requirement**, verified in the a11y check.

---

## Layout

- Docs shell: sidebar nav, content column, on-page table of contents
- Content column max ~72ch for prose; full width for tables and matrices
- Wide content (tables, diagrams, code) scrolls **inside its own container**. The page body
  never scrolls horizontally. This is a hard rule.
- Breakpoints: 375 / 768 / 1280 — all three verified before any task is done

### Mobile specifics

- Sidebar becomes a drawer
- Comparison matrices become stacked cards, not squeezed tables
- Level toggle stays reachable in the header, not buried in the drawer
- Estimator inputs stack; results stay above the fold after submit

---

## Accessibility requirements

Non-negotiable, checked per task:

- All interactive elements keyboard reachable in logical order
- Visible focus indicators, never `outline: none` without a replacement
- WCAG AA contrast, both themes
- Semantic headings, correctly nested, no level skips
- Alt text on every meaningful image; diagrams get a text description
- Estimator results announced via a live region
- Tooltips reachable by focus and dismissible with Escape
- Respect `prefers-reduced-motion`

---

## Diagrams

Prefer Mermaid in Markdown so diagrams are diffable, contributable by non-designers, and
themeable. Reserve hand-authored SVG for the few cases Mermaid can't express — and check
in a text description alongside it.

Any diagram carrying information must also exist as text (a list, a table) for
accessibility and for readers who won't zoom in on a phone.

---

## Charts

If a chart is ever needed (field-report distributions are the likely case), load the
`dataviz` guidance before writing any chart code. Do not invent a chart palette ad hoc.
Charts must read correctly in both themes and must not encode meaning in color alone.

---

## Performance budget

- No client JS on a page that isn't interactive
- Interactive islands are opt-in and justified in the PR description
- Self-host fonts or use system stack; no third-party font CDN
- No external analytics scripts; no consent banner (see `AGENTS.md`)
- Target: content pages interactive in under one second on mid-range mobile
