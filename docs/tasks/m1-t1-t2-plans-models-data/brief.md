# Task Brief: m1-t1-t2-plans-models-data — Populate plans.yaml and models.yaml

**Date**: 2026-08-23
**Status**: brief

## Request

Run M1-T1 and M1-T2 from `docs/08-build-plan.md`: populate `src/data/plans.yaml` and
`src/data/models.yaml` with real, sourced, human-verified data for Claude and OpenAI's
entry-level consumer plans and their current models, per the schemas in
`docs/04-data-schemas.md` and the sources already researched and tiered in
`docs/11-source-map.md`.

## Ground-truth preflight

- Branch: `main`
- Commit: `640f181` (in sync with `origin/main`)
- Working tree: uncommitted bootstrap artifacts present (`docs/agent/`, `docs/tasks/`,
  `docs/11-source-map.md`, edit to `CLAUDE.md`) — all expected, produced by the immediately
  prior `/bootstrap-project` run, no unexplained drift
- Repo state matches `docs/agent/project-profile.md`? **Yes**, with one open item: the
  bootstrap scaffold itself isn't committed yet. Recommend committing it (docs-only, no
  code) via its own small PR before or alongside this task, rather than mixing "meta-
  workflow setup" with "M1 data" in one branch. Flagged for user decision, not acted on.

## Scope

**In scope**:
- `src/data/plans.yaml`: Claude Free, Claude Pro, Claude Max (from-tier), ChatGPT Free,
  ChatGPT Plus, ChatGPT Pro — the entry-level and adjacent consumer tiers per
  `docs/10-open-questions.md` Q4's default ("launch with the two entry tiers + free")
- `src/data/models.yaml`: current Claude models (Opus 5, Sonnet 5, Haiku 4.5, Fable 5) and
  current OpenAI models actually available on the covered ChatGPT plans (GPT-5.6 family)
- Populating every required field per `planSchema`/`modelSchema` in
  `src/schemas/data.ts`, with `source_url`, `last_verified`, and `confidence` set honestly
  per field — including `null`/`unit: opaque` where providers don't publish a number,
  per ADR-003 and `ban on fabricating values to fill a field`
- One `changelog.yaml` entry for each already-identified volatile fact: the Anthropic
  weekly-limit promo expiring 2026-08-19, and the Sonnet 5 introductory-pricing-made-
  permanent change

**Out of scope**:
- Any model/plan beyond Claude and OpenAI (Gemini, Cursor subscriptions, etc.) — deferred
  per Q4 until a volunteer data owner exists
- `field-reports.yaml`, `glossary.yaml` — separate build-plan rows (M1-T8, M3-T4)
- Any content page (`plan`/`model` type pages under `src/content/docs/`) — this task is
  data-file only; M1-T3/T4 (the pages that render this data) are a separate task
- Re-fetching ChatGPT consumer-plan and Codex-limit pages that 403'd during research
  (flagged as a known gap in `docs/11-source-map.md`) — this task uses what was already
  verified via Tier-1 sources, and marks the gap explicitly rather than papering over it
  with a weaker source

## Acceptance criteria

1. `npm run build` passes with zero errors and zero warnings after the new data is added
2. Every entry in both files has `source_url` pointing to a Tier-1 source from
   `docs/11-source-map.md` (or explicitly `confidence: community-reported` /
   `estimated` where Tier-1 wasn't obtainable, with a note why)
3. No fabricated values — any unpublished number is `null` with `unit: opaque` (plans) or
   simply omitted (optional model fields), never guessed
4. Cross-file integrity holds: every `available_on` in `models.yaml` resolves to a real
   `plan_id` in `plans.yaml`
5. No benchmark score fields anywhere in `models.yaml` (schema already forbids this, but
   Themis should confirm no one worked around it)
6. `changelog.yaml` has the two entries above, each with `source_url`
7. A human (the user) explicitly confirms the data before merge — per the approval gate in
   `docs/agent/project-profile.md`, this is never agent-auto-merged regardless of how the
   PR is generated

## Recommended workflow

Per `docs/agent/workflow.md`'s row for "`plans.yaml` / `models.yaml` data change":

> Argus (+ data-verifier pass) → **approval** → merge — no Codex needed, this is data not
> code, but the human-verification approval gate is non-negotiable

Concretely for this task:

1. **Argus** — a focused pass confirming the exact current field values against the
   Tier-1 sources already identified in `docs/11-source-map.md` (re-verify rather than
   reuse stale numbers from memory, since a few days have passed since that research)
2. **Your approval** of the resulting data (this is the hard stop — not a Codex diff
   review, a direct read of the proposed YAML)
3. **Write** the YAML files directly (no Codex handoff — this is authoring structured
   data against a known schema, not implementation; using `page-drafter`/`data-verifier`
   conventions but performed directly since the "implementation" here is filling in a
   template, not writing logic)
4. **Themis** — independent review: schema conformance, no fabricated values, no
   benchmark fields, cross-file integrity, no editorializing beyond what sources support
5. **Apollo** — run `npm run build` for real, confirm zero warnings, confirm the
   cross-reference validation actually catches a deliberately broken reference (execution
   test, not assumption)

## Risk level

**Medium.** No code/architecture risk (pure data, existing schema), but real credibility
risk if wrong — this is the most trust-critical data on the site per ADR-003. Risk is
managed by sourcing discipline and the mandatory human approval gate below, not by
technical safeguards alone.

## Approval gates for this task

- Beyond the project default (no auto-merge on `plans.yaml`/`models.yaml`): the user
  reviews the actual proposed values before they're written, not just after, given how
  fast-moving this data is and how recently it was researched (a few days' gap is enough
  for a promo to expire — the Anthropic weekly-limit promo in scope here literally expires
  2026-08-19, which may have already passed by the time this runs).
