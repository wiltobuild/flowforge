# Plan: m1-t3-t4-plan-model-pages

_Athena pass, 2026-08-23, built from `investigation.md`._

## Decision: page count — one page per `plan_id`, not the old 3-page sketch

### Evidence
`docs/01-information-architecture.md`'s original sitemap lists 3 `what-you-get/` pages
(`claude-pro`, `chatgpt-plus`, `free-tiers`). `content.ts`'s `plan_id` is a singular
`reference('plans')`, confirmed by Argus with no array variant anywhere in the schema.
M1-T1/T2 populated 6 real `plan_id`s.

### Options
1. One page per `plan_id` — 6 pages (`claude-free`, `claude-pro`, `claude-max`,
   `chatgpt-free`, `chatgpt-plus`, `chatgpt-pro`)
2. Keep 3 pages, make `plan_id` an array to let one page cover two plans (e.g. a combined
   free-tiers page referencing both `claude-free` and `chatgpt-free`) — a real schema
   change
3. Keep 3 pages, arbitrarily pick one `plan_id` per page and leave the other plan
   undocumented as a content page (data still exists, just no rendering page)

### Recommendation
Option 1.

### Why
Option 2 is a schema change to fix a stale sitemap sketch that was written before any
real data existed — the sketch should update to match the schema's actual constraint, not
the other way around. Option 3 leaves real, verified data (an entire plan) without a
reader-facing page, which contradicts the whole point of M1-T1/T2. Option 1 costs 3 extra
pages, all mechanical once the manifest below is fixed, and every plan gets equal
treatment — no plan looks like an afterthought.

### Approval requested
Approve option 1 (6 plan pages), and the accompanying update to `docs/01`'s sitemap sketch
in the same change, per `AGENTS.md`'s "spec and reality move together" rule.

---

## Decision: build two small rendering components, not just prose pages

### Evidence
`docs/examples/plan.mdx`'s "What you get" section instructs: *"Render the plan's included
products, published limits, billing notes, and source link from `plans.yaml`. ... not to
copy volatile price or capacity details into prose."* This is stronger than a stylistic
suggestion — golden rule 1 (`AGENTS.md`) makes retyping a data-file fact into Markdown a
defect, not just discouraged. Static prose describing "$20/month" would itself violate the
rule this site is built to enforce. No `PlanFacts`/`ModelFacts`-equivalent component exists
yet in `src/components/` (only generic `Card`, badges, `LevelSection`, `NextLinks`,
`CopyBlock` do).

### Options
1. Build two small Astro components — `PlanFacts.astro` (props: `planId`) and
   `ModelFacts.astro` (props: `modelId`) — that fetch their entry via `getEntry()` and
   render the structured facts (included products, limit windows, pricing, capabilities,
   source/verification date via the existing `StalenessBadge`). Model API pricing renders
   inside the existing `LevelSection minLevel="advanced"` component. Prose sections
   (Who this is for, What it's good at, etc.) stay hand-written — those are judgment, not
   data.
2. Skip components; hand-write every fact into prose per page, accepting the golden-rule
   violation as a known tradeoff for this task
3. Defer M1-T3/T4 entirely until the interactive comparison matrix (M1-T7) is built, and
   reuse pieces of that instead of building narrower components now

### Recommendation
Option 1.

### Why
Option 2 directly contradicts a golden rule and the example templates' own explicit
instruction — not a reasonable tradeoff, an actual defect on 13 pages simultaneously.
Option 3 blocks two build-plan rows on a larger, differently-scoped future task for no
real benefit — the matrix (M1-T7) is a comparison view across all plans/models, a
different UI need from a single page rendering one entry's facts; reusing its internals
here would likely mean building it early instead, not saving work. Option 1 is small
(two focused components, each with one job), and it's the only option that actually
satisfies M1-T3/T4's stated requirement rather than working around it.

### Approval requested
This touches `src/components/` — new code, not just content — so flagging it explicitly
per the global approval gates even though it's a narrow, low-risk addition (two read-only
data-rendering components, no new dependency, no schema change). Approve option 1, or
redirect.

---

## Resolved without needing separate approval (documented conventions)

**`plan` tag mapping** (`taxonomy.ts`'s 5-bucket `PLANS` enum vs. 6 real `plan_id`s — the
second gap Argus found). The `plan` tag is a coarse "which subscription tier is needed"
filter, not a mirror of `plan_id`; two buckets legitimately cover two plans each:

| plan_id | plan tag |
|---|---|
| claude-free | `free` |
| claude-pro | `claude-pro` |
| claude-max | `higher-tier` |
| chatgpt-free | `free` |
| chatgpt-plus | `chatgpt-plus` |
| chatgpt-pro | `higher-tier` |

Model pages' `plan` tag is the dedup'd union of this mapping applied to their
`available_on` list (e.g. `gpt-5.6-luna` → `available_on: [chatgpt-free, chatgpt-plus,
chatgpt-pro]` → tags `[free, chatgpt-plus, higher-tier]`).

**`quota` tag** (required on every page, even `n-a`, per `docs/03`). Reference pages about
a plan or model aren't tasks that consume a window themselves:
- Plan pages: `n-a` — describing a plan isn't a task with a quota cost.
- Model pages: mirror the model's own `quota_weight` from `models.yaml` — a reference page
  about a heavy model is usefully filterable by that weight, matching the convention
  already used in `docs/examples/model.mdx`.

**`status`**: all 13 pages ship `draft`, not `verified` — every fact is freshly sourced
(2026-08-23) but hasn't had a second reviewer pass beyond this task's own Themis step, and
`docs/03` reserves judgment-based `quota` assignments for `draft` until field-report data
backs them, which applies here (no field reports exist yet).

**`level`**: `beginner` floor for both types. The qualitative sections (What it's good
at, Best at, etc.) must be readable by a beginner; only the API-pricing sub-section of
model pages is advanced-gated *within* the page via `LevelSection`, per `AGENTS.md`
golden rule 5 — the page itself isn't advanced-only.

**`tool`**: per plan, based on `included_products`:
- `claude-free` → `[chat-ui]`; `claude-pro`/`claude-max` → `[chat-ui, claude-code]`
- `chatgpt-free` → `[chat-ui]`; `chatgpt-plus`/`chatgpt-pro` → `[chat-ui, codex]`
- All 7 model pages → `[api]`, matching `docs/examples/model.mdx`'s convention (models are
  accessed across surfaces; API is the common denominator)

**`role`**: plan pages → `[builder, operator, strategist]` (everyone picking a
subscription cares); model pages → `[builder, strategist]` (choosing a model is a build or
evaluation decision, less an "operator" concern).

**`task`**: plan pages → `[plan]`; model pages → `[plan, analyze]`.

## Full page manifest

**Plan pages** — `src/content/docs/plans/what-you-get/{slug}.mdx`, `type: plan`

| Slug | plan_id | title |
|---|---|---|
| claude-free | claude-free | Claude Free |
| claude-pro | claude-pro | Claude Pro |
| claude-max | claude-max | Claude Max |
| chatgpt-free | chatgpt-free | ChatGPT Free |
| chatgpt-plus | chatgpt-plus | ChatGPT Plus |
| chatgpt-pro | chatgpt-pro | ChatGPT Pro |

**Model pages** — `src/content/docs/plans/models/{provider}/{slug}.mdx`, `type: model`

| Provider dir | Slug | model_id | title |
|---|---|---|---|
| anthropic | fable-5 | claude-fable-5 | Claude Fable 5 |
| anthropic | opus-5 | claude-opus-5 | Claude Opus 5 |
| anthropic | sonnet-5 | claude-sonnet-5 | Claude Sonnet 5 |
| anthropic | haiku-4-5 | claude-haiku-4-5 | Claude Haiku 4.5 |
| openai | gpt-5.6-sol | gpt-5.6-sol | GPT-5.6 Sol |
| openai | gpt-5.6-terra | gpt-5.6-terra | GPT-5.6 Terra |
| openai | gpt-5.6-luna | gpt-5.6-luna | GPT-5.6 Luna |

## Execution plan

No Codex handoff (content + two narrow, well-specified components; matches the project's
role-ownership override for schema-bound content work). Given the volume and how fully
specified the manifest above is, drafting all 13 pages plus the two components will be
done directly in this session rather than fanning out 13 separate `page-drafter` calls —
mechanical execution against a fixed table, not open-ended judgment per page. Themis still
reviews the full batch before merge, same as always.

## Acceptance criteria (unchanged from brief.md, plus)

8. `PlanFacts.astro`/`ModelFacts.astro` exist, are used by all 13 pages, and no volatile
   fact (price, limit capacity, context window, API pricing) is duplicated in prose
   anywhere in the 13 pages' bodies
9. Model pages' API pricing renders only inside `LevelSection minLevel="advanced"`

## Next step

Stop here for approval on both Decisions above. Once approved: build the two components,
draft 13 pages, update `docs/01`'s sitemap sketch, run full CI, Themis review, Apollo
verification.
