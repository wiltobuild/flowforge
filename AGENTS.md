# AGENTS.md — build contract

Conventions for any coding agent or human working in this repo. Read this before
touching anything. Tool-agnostic by design; Claude Code reads it via `CLAUDE.md`,
Codex reads it directly.

## What this project is

A static, public, open-source reference site for people building with AI agents on
consumer subscriptions. Audience is ~130 cohort members spanning complete beginner to
advanced builder. See `docs/00-product-brief.md`.

## Golden rules

These are non-negotiable. A change that breaks one of these is wrong even if it works.

1. **Content is data, not markup.** Every page is Markdown/MDX with typed frontmatter.
   Facts that appear in more than one place (pricing, limits, model capabilities) live in
   a single data file and are rendered, never retyped. If you find yourself copying a
   number between two files, stop and move it into `src/data/`.

2. **`/concepts` never names a product.** Vendor-neutral explanation only. Product names
   live under `/tools` and `/plans`. Concept pages link *down* to tool-specific pages.
   This is what keeps the site useful when a given tool falls out of favor.

3. **No backend, no database, no auth, no secrets.** The site must build to static files
   and deploy from a fork with zero configuration. Any feature that requires a server is
   out of scope — find a static-compatible design or drop the feature.

4. **Level is a filter, not a section.** Never create parallel beginner/advanced pages.
   One page, progressive disclosure via the level toggle.

5. **Never show a beginner per-million-token pricing.** API economics live under `/plans/api/`
   and are gated behind the advanced level. Beginners see plans and quota, nothing else.

6. **Every volatile fact carries a `last_verified` date** and renders a staleness badge.
   No exceptions for "it was right when I wrote it."

7. **Accessibility is a build requirement, not a polish task.** Keyboard-navigable,
   WCAG AA contrast in both themes, no information conveyed by color alone.

8. **No individual-level analytics, no tracking cookies, no consent banner.** If you need
   usage data, use aggregate privacy-preserving hosting analytics or nothing.

## Explicitly out of scope

Do not add these, even if they seem helpful:

- A CMS, admin panel, or login
- Benchmark score tables (see `docs/00-product-brief.md` for why)
- Scraped or auto-synced pricing (fetching provider pricing at build time is brittle and
  will silently publish wrong numbers — pricing is human-verified, always)
- A chatbot on the site
- Newsletter signup, popups, or interstitials
- Any dependency that requires an API key to build

## Repository layout

```
docs/                 specification (this planning set)
src/
  content/            one directory per content collection (see 02-content-types)
  data/               plans, models, glossary, field-reports, changelog (see 04)
  components/         UI, including interactive islands (see 05, 06)
  pages/              routes not driven by a collection
.claude/agents/       agent profiles — also published as site content
.github/
  ISSUE_TEMPLATE/     including the field-report submission form
public/
```

## Content authoring rules

- Every content file must validate against its collection schema. A missing required
  frontmatter field is a build failure, not a warning.
- Required on every content file: `title`, `description`, `level`, `status`, `owner`,
  `last_verified`, `volatility`. Plus the tag axes that apply (`docs/03-taxonomy.md`).
- Tag values come from the controlled vocabularies in `docs/03-taxonomy.md`. Inventing a
  new tag value requires updating the vocabulary first.
- Body sections must follow the order given by the content type in `docs/02-content-types.md`.
  Consistent structure is what makes a large site skimmable — do not improvise headings.
- Every page ends with 2–3 "next" links. No dead ends.
- Copy blocks use `{{double_brace}}` for user-substituted variables.

## Code conventions

- TypeScript, strict mode. No `any` without a comment explaining why.
- Ship zero client-side JavaScript by default. Interactivity is opt-in per component
  (islands), and each island must justify its weight in the PR description.
- Every interactive component needs a defined empty state, loading state, and error state.
  See `docs/05-interactive-specs.md`.
- Style with the design tokens in `docs/06-design-system.md`. No hard-coded hex values in
  components.
- Prefer boring, well-documented dependencies. Every new dependency is a maintenance
  burden for someone who has not been onboarded.

## Gotchas discovered during the build

Recorded so nobody rediscovers them the hard way.

- **Files and directories prefixed with `_` are silently ignored** by Astro's content
  loader. They do not build, do not validate, and produce no warning. If a page seems to
  not exist, check the filename first.
- **Astro 7 ships Zod 4.** The `z` re-export from `astro:content` is deprecated — import
  `z` from `zod` directly. `reference()` still comes from `astro:content`. `z.string().url()`
  is deprecated in favour of `z.url()`, and `z.ZodIssueCode.custom` in favour of the string
  literal `'custom'`.
- **`astro check` needs `@astrojs/check` and `typescript`** as dev dependencies. Without
  them it prompts interactively, which hangs CI.
- **The sitemap integration warns unless `site` is set** in `astro.config.mjs`. Since
  zero-warning builds are required, a placeholder is set there pending the domain decision.

## Definition of done

A task is not complete until all of these pass:

- [ ] Production build succeeds with zero warnings
- [ ] Content schema validation passes
- [ ] Internal link check passes (no broken links)
- [ ] Keyboard navigation works for anything interactive
- [ ] Renders correctly at 375px, 768px, and 1280px
- [ ] Correct in both light and dark themes
- [ ] Any new fact has a source link and `last_verified` date
- [ ] Any new content type or tag value is reflected in `docs/`

## When the spec is wrong

The spec is a starting point written before implementation. If you hit a case where
following it produces a worse result, **update the doc in the same change** and say so in
the PR description. Do not silently diverge — a spec nobody trusts is worse than no spec.

## Working style

- Spec first, then implement. For anything non-trivial, write the plan, get it reviewed,
  then build. This is the practice the site teaches; follow it here.
- Small, reviewable changes. One milestone task per PR.
- Do not batch unrelated changes together.
