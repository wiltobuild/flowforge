# Review: m1-t5-plans-start-here

_Themis pass, 2026-08-23._

## Must-fix (addressed post-review)

1. **Hardcoded volatile prices** — "$20 a month," "$20," "$40/month" in prose, with no
   `PlanFacts` component nearby to anchor a "see the price above" fix (unlike the prior
   task's violations, which were on pages that already rendered the figure elsewhere).
   Same golden-rule-1 pattern as `chatgpt-plus.mdx`/`haiku-4-5.mdx` in M1-T3/T4.

   **Resolution**: reworded to "one entry-tier plan" / "roughly double that," with an
   explicit note that exact prices live on each plan's own page "because they change more
   often than this recommendation does."

## Scope drift (addressed)

2. **Acceptance-criteria mismatch** — the build-plan row's "three paragraphs" target
   conflicts with the mandatory playbook body order once `type: playbook` was chosen.
   **Resolution**: recorded as a decision in `docs/agent/decisions.md` (body order wins,
   as a harder structural rule) rather than silently picking a side.
3. **Missing `docs/tasks/` trail** — this task ran compressed (single page, "full auto"
   scope) without the brief/plan/investigation files the two prior M1 tasks have.
   **Resolution**: `brief.md` written retroactively (this file and `verification.md`
   alongside it), and both real judgment calls from drafting (content-type choice,
   acceptance-criteria tension) recorded in `decisions.md`.

## Optional (not addressed, noted)

4. Playbook `Steps` are reflective questions, not sequential prompt actions with quota
   badges — a real but minor shape mismatch given `type: playbook` is still the best
   available fit. Not fixed; noted for whoever eventually revisits the content-type
   taxonomy.

## Confirmed clean

- `npm run build`/`npm run ci`: 0 errors, 0 warnings, all checks pass
- No per-token/API pricing anywhere (golden rule 5)
- Two-sidedness: both plans get symmetric "pick X if" treatment with visible reasoning,
  ChatGPT's degrade-vs-block claim carries the same community-reported caveat used
  elsewhere on the site
- Internal links: verified against the built HTML and via `check-internal-links.mjs` —
  the relative-path convention (adopted proactively after two prior rounds of the same
  bug) held up under independent check
- Frontmatter matches the established tag conventions from `m1-t3-t4-plan-model-pages/plan.md`

## Verdict

**Needs another pass** at review time → **all findings addressed post-review**
(pricing fix, decisions recorded, task trail backfilled). Re-verified clean.
