# Plan: m1-t1-t2-plans-models-data

_Athena pass, 2026-08-23, built from `investigation.md`._

## Decision: ChatGPT/Codex data — no Tier-1 source exists

### Evidence
Argus confirmed, live, today: both `chatgpt.com/pricing` and the official Codex-limits
help article 403 automated fetches. This isn't staleness — no Tier-1 source has ever been
obtainable for this data in either research pass (2026-08-15 or 2026-08-23).

### Options
1. Ship `plans.yaml`/`models.yaml` with Claude only this task; add ChatGPT plans as a
   follow-up task once a fetch method works (browser-based check, or you fetch the pages
   yourself and hand me the content)
2. Ship ChatGPT Free/Plus/Pro now using the community-reported figures from the very first
   research pass (Plus $20/mo, Pro $100 and $200/mo tiers, Codex 15–80 messages per 5-hour
   window on Plus), explicitly marked `confidence: community-reported` throughout
3. Ship ChatGPT plan *shells* (id, provider, display_name, tier, price if confident) with
   `limit_windows: []`-adjacent minimal data and heavy `confidence: estimated` flags,
   deferring the parts that are genuinely unverified

### Recommendation
Option 1 — Claude only this task.

### Why
The task brief's own acceptance criterion #2 requires Tier-1 sourcing or an explicit,
honest confidence downgrade with a stated reason. Option 2 technically satisfies that
(the downgrade would be stated), but `plans.yaml` is the site's most trust-critical file
per ADR-003, and shipping a plan's core numbers as `community-reported` on day one — before
the site has any traffic to catch an error — trades a small schedule win for a real
credibility risk on exactly the file the whole project is built to get right. Splitting
Claude and ChatGPT into separate tasks also keeps this PR's review scope honest: a
reviewer approving "verified Claude data" shouldn't also be implicitly approving
"unverified ChatGPT data" bundled into the same file.

### Approval requested
Confirm option 1, or override to option 2/3 if you'd rather ship both providers now with
the confidence caveat visible.

---

## Decision: representing "adaptive thinking" vs "extended_thinking"

### Evidence
`src/schemas/data.ts` `capabilities` enum has: `tool_use, vision, extended_thinking,
caching, batch, structured_output`. Anthropic's own comparison table treats "extended
thinking" (`thinking.type: "enabled"`, explicit toggle) and "adaptive thinking" (always-on
or automatic) as two distinct capabilities. Fable 5, Opus 5, Sonnet 5 have adaptive-not-
extended; Haiku 4.5 has extended-not-adaptive.

### Options
1. Add `adaptive_thinking` to the schema's capability enum now — a small, additive schema
   change (new enum value, not a breaking change to existing data since no models.yaml
   rows exist yet)
2. Collapse both into the existing `extended_thinking` value for now, accepting loss of
   the adaptive-vs-explicit distinction, and note the simplification in a code comment
3. Leave the field off entirely for models where only "adaptive" applies, treating it as
   unrepresented rather than mis-tagged

### Recommendation
Option 1.

### Why
This is technically a schema change, which normally triggers a stop-and-ask per the
global approval gates — flagging it as exactly that rather than quietly picking option 2
and losing real information. The change is additive and low-risk (one new enum value,
zero existing data to migrate), and the distinction is genuinely load-bearing for the
site's own quota-cost framing: an always-on adaptive-thinking model has different, less
controllable quota behavior than one where thinking is an explicit opt-in.

### Approval requested
This is a schema change — needs your explicit sign-off before I touch `src/schemas/data.ts`,
per the global approval gates (architecture/schema changes require stopping). Approve
option 1, or pick 2/3 to avoid touching the schema in a data-only task.

---

## Decision: weekly-limit promo changelog entry

### Evidence
Live as of today: promo runs through Aug 31, 2026 (extended from an earlier Aug 19 date
docs/11 recorded). Support article's own language ("we've extended this promotion")
indicates a pattern of repeated extension.

### Options
1. Write the changelog entry with today's confirmed date (Aug 31) and a note that this
   promo has already been extended multiple times and should be re-checked near that date
2. Skip a changelog entry for this specific fact since it's likely to move again before
   anyone reads it

### Recommendation
Option 1.

### Why
`changelog.yaml`'s whole purpose (docs/04) is dated, falsifiable claims — "this was true
as of this date," not "this is permanently true." An entry that explicitly flags its own
volatility and history of extension is more honest and more useful than silence, and it
gives the `data-verifier` agent a concrete date to check against on its next pass.

### Approval requested
None needed — this follows already-established changelog conventions. Proceeding unless
you object.

---

## Decision: Pro/Max `limit_style` and Free-tier gap

### Evidence
Pro/Max: confirmed `mixed` (hard block + opt-in pay-as-you-go via usage credits), not the
brief's initial assumption of `hard-stop`. Free tier: no Tier-1 statement found for its
limit behavior specifically.

### Recommendation
- Pro/Max: `limit_style: mixed`, `limit_style_note` describing the usage-credits path in
  plain language, `confidence: documented` (directly sourced).
- Free: `limit_style: hard-stop` (Free plans never offer paid usage-credit overflow
  anywhere else on the page, so this is a reasonable default), but `confidence: estimated`
  and a note in `limit_style_note` saying the exact mechanism wasn't found in Anthropic's
  own docs. Flag for a future `data-verifier` pass rather than blocking this task on it.

### Approval requested
None needed — usual "mark what's uncertain honestly" practice, not a new policy.

---

## Acceptance criteria (updated from brief.md)

1. `npm run build` passes, zero errors/warnings
2. Every Claude plan/model entry sourced at Tier 1, `source_url` set, `last_verified:
   2026-08-23`
3. ChatGPT plans/models excluded this task pending the Decision above (or included per
   your override)
4. No fabricated values; Free-tier limit mechanism marked `estimated` per the Decision
   above rather than guessed silently
5. `available_on` cross-references resolve; `npm run build` rejects a deliberately broken
   reference (Apollo will test this)
6. No benchmark score fields
7. One `changelog.yaml` entry for the weekly-limit promo (Aug 31 date, extension history
   noted)
8. Schema change (if approved) is the only file touched outside `src/data/` and
   `docs/tasks/` — no unrelated changes
9. You review the actual proposed YAML values before merge, per the task's approval gate

## Next step

Stop here for your approval on the two Decisions above (ChatGPT scope, schema change).
Once approved, I write `plans.yaml`, `models.yaml`, and the changelog entry directly (no
Codex handoff — this is data authoring against a known schema), then Themis reviews, then
Apollo runs the real build and cross-reference tests.
