# Task Brief: m1-t3-t4-plan-model-pages — Plan and model content pages

**Date**: 2026-08-23
**Status**: brief

## Request

Run M1-T3 and M1-T4 from `docs/08-build-plan.md`: create the `plan` and `model` content
pages that render the data populated in M1-T1/T2 (`src/data/plans.yaml`,
`src/data/models.yaml`), following the type templates in `docs/02-content-types.md` and
the copy-paste examples in `docs/examples/plan.mdx` / `docs/examples/model.mdx`.

## Ground-truth preflight

- Branch: `main`
- Commit: `548a7f1` (in sync with `origin/main`)
- Working tree: clean
- Repo state matches `docs/agent/project-profile.md`? **Yes**, no drift since the last
  task.

## Ground-truth conflict found — needs a decision before drafting

`docs/01-information-architecture.md`'s original sitemap (written before any real data
existed) lists exactly three `what-you-get/` pages: `claude-pro`, `chatgpt-plus`,
`free-tiers` — the last one apparently meant to cover both providers' free tiers in a
single page.

That doesn't fit what M0 actually built: `contentSchema`'s `plan_id` is a **single**
`reference('plans')`, not an array (`src/schemas/content.ts`) — one content page binds to
exactly one `plan_id`. A combined `free-tiers` page can't reference both `claude-free` and
`chatgpt-free` at once under the current schema. Since M1-T1/T2 populated 6 concrete plans
(not the 3 the old sitemap sketch assumed), this is a real conflict, not just an
oversight — flagged as a decision for Athena/approval rather than silently picking one
side.

## Scope

**In scope**:
- One `plan` page per entry in `plans.yaml` (pending the decision above — see plan.md)
- One `model` page per entry in `models.yaml`: 7 pages, no conflict here since
  `/plans/models/[provider]/[model-slug]` already implies one page per model
- Following the exact body order from `docs/02-content-types.md` for each type
- Frontmatter fully populated per `docs/03-taxonomy.md` vocabularies, referencing the real
  `plan_id`/`model_id` values from M1-T1/T2
- API pricing appearing only in advanced-gated sections of model pages, never in the
  beginner-visible body (per `AGENTS.md` golden rule 5)
- Updating `docs/01-information-architecture.md`'s sitemap sketch to match reality, in the
  same change, per `AGENTS.md`'s "spec and reality move together" rule

**Out of scope**:
- `/plans/start-here` (M1-T5, depends on this task but is separate)
- The comparison matrix, decision trees, or estimator (M1-T6/T7/T9 — separate interactive
  components, not content pages)
- Any change to `plans.yaml`/`models.yaml` data itself — this task only renders what M1-T1/T2
  already verified
- `check-references.mjs` (tracked separately as task #9, not part of this task)

## Acceptance criteria

1. `npm run ci` passes clean (build+typecheck, concepts-neutrality, examples, links, a11y)
2. Every plan/model page follows its type's exact body order from `docs/02` — no
   improvised headings
3. Every page has valid frontmatter: `owner`, `last_verified` matching the data's own
   `last_verified` (2026-08-23), `volatility: volatile` (required for anything joined to
   `plan_id`/`model_id` per the schema's own `superRefine`), correct tag values, 2–3
   `next` links
4. No volatile fact (price, limit, pricing-per-token) is retyped in prose where the page
   should instead reference/render from the data file — golden rule 1
5. Model pages: API pricing is advanced-gated; beginner-visible content is qualitative
   only (`best_at`/`weak_at`/`quota_weight` framing), per M1-T4's stated requirement
6. Plan pages: "How the limits feel" is written in plain, concrete language — not a
   restatement of the schema's `limit_style` enum value
7. `docs/01-information-architecture.md` sitemap updated to list the actual page set
   shipped, replacing the stale 3-page sketch

## Recommended workflow

Per `docs/agent/workflow.md`'s "Content-only page" row:

> Argus → `page-drafter` (writer) → Themis (schema/taxonomy/neutrality conformance, via
> `content-auditor.md`)

No Codex handoff — per `docs/agent/project-profile.md`'s role-ownership override,
schema-bound content pages go through the Claude-side `page-drafter` agent, not Codex.

## Risk level

**Low-medium.** No schema or architecture changes anticipated (pending the sitemap
decision, which is a doc correction, not a schema change). Volume is the main risk: 13
pages is a lot of surface for something to drift from the template on, which is exactly
what `content-auditor`/Themis exists to catch before merge.

## Approval gates for this task

- The sitemap conflict above (3-page sketch vs. 6 real plans) needs your sign-off before
  drafting starts.
- Otherwise, standard: you review the drafted pages before merge, same as every prior task.
