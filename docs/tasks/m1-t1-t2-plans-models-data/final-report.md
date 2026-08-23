# Final Report: m1-t1-t2-plans-models-data

## What changed

- `src/data/plans.yaml`: 6 entries (Claude Free/Pro/Max, ChatGPT Free/Plus/Pro), live-
  verified 2026-08-23
- `src/data/models.yaml`: 7 entries (Claude Fable 5/Opus 5/Sonnet 5/Haiku 4.5, OpenAI
  GPT-5.6 Sol/Terra/Luna), same verification date
- `src/data/changelog.yaml`: 2 entries — the Anthropic weekly-limit promo's second
  extension (Aug 19 → Aug 31), and Sonnet 5's introductory pricing becoming permanent
- `src/schemas/data.ts`: added `adaptive_thinking` to the capabilities enum (approved
  schema change); added a strict `isoDate` validator, replacing an unsafe
  `z.coerce.date()` found and fixed during review
- `docs/04-data-schemas.md`: capabilities table updated to match; cross-file-integrity
  section corrected to state what's actually enforced today vs. intended
- `src/content.config.ts`: corrected a false comment claiming cross-reference validation
  works (it doesn't yet — found during review)
- `docs/examples/plan.mdx`, `docs/examples/model.mdx`: placeholder IDs swapped for real
  ones now that the referenced collections aren't empty
- `docs/agent/decisions.md`: two decisions recorded (ChatGPT scope, schema change)
- `docs/tasks/m1-t1-t2-plans-models-data/`: brief, investigation, plan, review,
  verification (this task's full paper trail)

## What was verified

- Full `npm run ci` (build+typecheck, concepts-neutrality, examples, links, a11y): clean,
  0 errors/warnings, run multiple times through the fix cycle
- Cross-references checked manually (script) and the missing-enforcement gap independently
  reproduced (deliberately broken, confirmed build didn't catch it, restored, re-verified
  intact)
- The new `isoDate` validator unit-tested against all four failure modes Themis found

Full detail in `verification.md`.

## What wasn't verified / remains open

1. **Cross-file reference integrity is not build-enforced** — a pre-existing M0 gap this
   task surfaced, not introduced. The data as shipped is correct (manually confirmed),
   but nothing will catch the next person's typo. **Recommend a follow-up task**: a
   `check-references.mjs` script alongside the existing `check-concepts-neutrality.mjs`
   and `check-examples.mjs`, wired into `npm run ci`.
2. **ChatGPT/Codex data has no Tier-1 source and may never get one via automated fetch**
   (403 confirmed twice, 8 days apart). Shipped as `confidence: community-reported` per
   your approval. Worth trying a browser-based fetch at some point, but not blocking.
3. **`modelSchema` has no `confidence` field** the way `planSchema` does — so a model's
   own pricing can be solidly Tier-1 while its plan-availability mapping is genuinely
   uncertain, with no way to flag that on the model record itself (only in the plan's
   `billing_notes`, which is one level removed). Flagged by Themis as optional/tracked,
   not fixed this task.
4. **The weekly-limit promo will very likely move again** before Aug 31 — it's been
   extended twice already. Whoever owns the monthly `data-verifier` pass should check
   this specifically, not just on the normal cadence.

## Process notes worth keeping

- Themis's live re-verification (rather than reusing 8-day-old research) caught a real,
  already-happened discrepancy (the promo date) before it shipped stale — validates why
  the plan insisted on re-verifying rather than reusing `docs/11-source-map.md` directly.
- Themis's review itself surfaced two genuine defects (unsafe date coercion, unapproved
  scope drift into `content.ts`) that weren't part of what it was explicitly asked to
  check for schema/data correctness — the adversarial framing did what it's supposed to.
- Themis's own test methodology briefly destroyed data (a `git checkout --` that reverted
  the whole file instead of one edit) and disclosed it immediately rather than silently
  fixing it. Independently re-verified rather than trusting the self-report, per Apollo
  discipline. Worth noting in `docs/agent/roles/themis.md` as a caution for future runs:
  prefer copying a file aside before deliberately breaking it, rather than relying on
  `git checkout` to undo a single in-place edit.

## Recommendation

Ready for your review and merge decision. Two items above (#1 and #3) are good
candidates for follow-up tasks rather than blockers — the data itself is correct and
honestly caveated where it can't be verified further.

Not committing or merging without your go-ahead.
