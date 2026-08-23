# Investigation: m1-t1-t2-plans-models-data

_Argus pass, run 2026-08-23. Live re-verification — not a reuse of `docs/11-source-map.md`,
which was compiled 2026-08-15._

## Verified facts

**Claude consumer plans** — `https://claude.com/pricing`, fetched live today
- Free: $0/mo
- Pro: $17/mo billed annually, $20/mo billed monthly
- Max: two sub-tiers, both "from $100/mo" — Max 5x and Max 20x
- Page states only "usage limits apply," no exact quota — confirms Anthropic does not
  publish hard consumer quotas

**Limit-hit behavior** — `https://support.claude.com/en/articles/12429409-manage-extra-usage-for-paid-claude-plans`
- Quote: "If usage credits are enabled and you have funds available, you can choose to
  continue working." "Your session limits reset every five hours as usual."
- Pro/Max = **`mixed`** (hard block at 5-hour boundary by default, pay-as-you-go
  continuation if usage credits opted in) — not a plain hard-stop
- No Tier-1 source found for Free-tier limit behavior specifically (Unknown)

**Weekly-limit promo — CONFIRMED DISCREPANCY from docs/11** — `https://support.claude.com/en/articles/15910845-claude-code-may-july-2026-weekly-limits-promotion`
- Quote: "Increased weekly limits now run through **August 31, 2026**." "We've extended
  this promotion" (again).
- `docs/11-source-map.md` said "expires 2026-08-19" (compiled 2026-08-15). The promo was
  extended again since then. As of today (2026-08-23) it is **still active**, 8 days of
  runway left on the new date.
- Risk: this has already moved once in 8 days and the article's own history shows a
  pattern of repeated extension. A `changelog.yaml` entry citing Aug 31 should expect to
  need re-checking again before this task's PR actually merges, not just at Argus time.

**Claude API pricing/models** — `platform.claude.com/docs/en/about-claude/pricing` and
`.../models/overview`, fetched live

| Model | Input | Output | Context | Max output | Ext. thinking | Adaptive thinking | Reliable cutoff |
|---|---|---|---|---|---|---|---|
| Fable 5 | $10/MTok | $50/MTok | 1M | 128k | No | Yes (always on) | Jan 2026 |
| Opus 5 | $5/MTok | $25/MTok | 1M | 128k | No | Yes | May 2026 |
| Sonnet 5 | $2/MTok | $10/MTok | 1M | 128k | No | Yes | Jan 2026 |
| Haiku 4.5 | $1/MTok | $5/MTok | 200k | 64k | Yes | No | Feb 2025 |

- **Schema gap found**: `capabilities` enum in `src/schemas/data.ts` has no slot for
  "adaptive thinking" as distinct from `extended_thinking`. Anthropic treats these as two
  different, independently-toggled capabilities. Three of four models have adaptive-not-
  extended; Haiku has extended-not-adaptive. Needs an approval decision (below).
- Models-overview page recommends **Opus 5** for "complex agentic coding," but calls
  **Fable 5** (not Opus 5) "Anthropic's most capable widely released model." Different
  hierarchy than "Opus = flagship" — relevant to `best_at`/`weak_at` wording.

**Sonnet 5 pricing permanence** — re-confirmed live, matches docs/11 exactly: the Sept 1
increase to $3/$15 will not occur; $2/$10 is the standing price.

**ChatGPT consumer plans / Codex limits — STILL BLOCKED**
- `chatgpt.com/pricing` → 403, fetched live today
- `help.openai.com/.../11369540-using-codex-with-your-chatgpt-plan` → 403, fetched live today
- No Tier-1 source exists for this data, today or five days ago. Not a "went stale" gap —
  a persistent, unresolved gap. Per the task brief, not papered over with a weaker source.

**OpenAI API pricing (GPT-5.6 family)** — `developers.openai.com/api/docs/pricing` +
per-model docs, fetched live

| Model | Input/cached/output (short) | Input/cached/output (long) | Context | Max input | Max output | Cutoff |
|---|---|---|---|---|---|---|
| gpt-5.6-sol | $4.00/$0.40/$20.00 | $8.00/$0.80/$30.00 | 1,050,000 | 922,000 | 128,000 | Feb 16, 2026 |
| gpt-5.6-terra | $2.00/$0.20/$12.00 | $4.00/$0.40/$18.00 | 1,050,000 | 922,000 | 128,000 | Feb 16, 2026 |
| gpt-5.6-luna | $0.20/$0.02/$1.20 | $0.40/$0.04/$1.80 | 1,050,000 | 922,000 | 128,000 | Feb 16, 2026 |

Context/max-input/max-output/cutoff independently confirmed per-model (not inferred) via
direct fetches of each model's own doc page. Promo quote: "GPT-5.6 Sol's promotional
pricing is available at least through November 21, 2026."

## Unknowns

- Free-tier Claude limit reset window/enforcement — no Tier-1 statement found
- ChatGPT Free/Plus/Pro exact prices and features — sources 403 today, as before
- Whether OpenAI's July 12 "Codex 5-hour cap removed" change is still in effect — source
  needed to check is the same 403-blocked page
- Exact short/long-context token threshold for GPT-5.6 pricing (not stated on the page)

## Risks

1. Weekly-limit promo end date is a moving target with a track record of repeated
   extension — expect to re-verify again before merge, not just at investigation time.
2. ChatGPT/Codex data has no available Tier-1 source at all — this is a scope decision,
   not a sourcing task (see plan.md).
3. Schema has no field for "adaptive thinking" distinct from "extended_thinking" — a
   modeling decision is needed before writing `models.yaml` (see plan.md).
4. Pro/Max `limit_style` is `mixed`, not `hard-stop` — a plausible wrong default given
   the brief's own framing assumed hard-stop was the norm.
