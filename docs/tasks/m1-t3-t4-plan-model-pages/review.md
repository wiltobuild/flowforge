# Review: m1-t3-t4-plan-model-pages

_Themis pass, 2026-08-23, run against `brief.md` and `plan.md`._

## Must-fix (both addressed post-review)

1. **`chatgpt-plus.mdx`** — "Who this is for" claimed *"the same $20 price point as Claude
   Pro,"* hardcoding both plans' prices in one derived comparison. Neither `PlanFacts`
   instance on either page would catch this drifting, since it's a cross-page claim not
   rendered by either component.

   **Resolution**: Reworded to "the same entry price point as Claude Pro (see the price
   above)" — no number retyped.

2. **`haiku-4-5.mdx`** — "Weak at" stated *"200k-token context window is a fifth the size
   of the 1M window on Fable 5, Opus 5, and Sonnet 5,"* hardcoding five numbers (four
   models' context windows plus a derived ratio) on a page where `ModelFacts` already
   renders Haiku's own context window from the same field.

   **Resolution**: Reworded to "meaningfully smaller than the other current Claude
   models' (see the figures above)" — no number retyped.

## Optional (left as-is, with reasoning)

- `claude-pro.mdx`/`claude-max.mdx` restate "5-hour," "5x or 20x" in their "How the limits
  feel" narrative. Themis flagged this as lower-confidence: these numbers already exist as
  prose inside `plans.yaml`'s own `limit_style_note`/window `note` fields (which
  `PlanFacts` renders verbatim), and `docs/02-content-types.md` explicitly asks "How the
  limits feel" to be concrete, hand-written narrative, not a vague restatement. Softening
  every mention would make the section unable to do its job. Left unchanged.
- `claude-free.mdx`'s "deliberate trade for $0" — trivial restatement of `price: 0`,
  already shown as "Free" by `PlanFacts`. Zero doesn't drift; not worth changing.

## Process finding (fixed)

- Themis found that a prior `Edit` call (appending two new decisions in the previous
  M1-T1/T2 task's `decisions.md`) had matched a shorter substring than the actual line
  content, splicing new text mid-line and relocating an orphaned fragment
  ("via approval of the step-5 recommendation") onto the wrong decision entry. Root cause:
  `Edit`'s `old_string` didn't need to match a full line, just a substring, and the actual
  file had trailing text beyond what I'd anchored on. **Resolution**: removed the
  misplaced fragment from the M1-T3/T4 decision entry it had landed on; the earlier
  M1-T1/T2 entry it originally (incorrectly) belonged to now reads correctly with no
  fragment at all, since that fragment was itself a leftover error from even earlier.

## New finding, tracked as a follow-up (not fixed this task)

`PlanFacts`/`ModelFacts` take a plain string prop (`planId`/`modelId`) with no build-time
validation. Themis tested this live: setting a prop to a nonexistent id still produces a
clean `npm run build`/`npm run ci` (`getEntry()` returns `undefined`, the component renders
its own "data unavailable" error state, but nothing fails CI). This is a **different** gap
from the already-tracked `check-references.mjs` follow-up (task #9), which only covers
schema-level `reference()` fields in frontmatter — the component prop is a separate,
independently-typed string inside the MDX body with zero connection to the schema.
Recorded as a new follow-up task; not fixed here, since building that validation is its
own scoped piece of work, not a data-authoring fix.

## Confirmed clean (Themis found no issues)

- Full `npm run build`/`npm run ci`: 0 errors, 0 warnings, all five checks green
- Frontmatter conformance: all 13 pages checked (not just a sample) against `plan.md`'s
  tag tables — no drift
- Body order: all 6 plan pages and 7 model pages follow their exact template order
- API pricing gating: `ModelFacts`'s pricing block is uniformly wrapped in
  `LevelSection minLevel="advanced"`; no page bypasses it with hand-written prose
- Internal links: all `next` links and in-body prose links resolve (relative paths used
  correctly in prose, absolute paths correctly base-prefixed in `next` frontmatter)
- URL slugs: all three OpenAI model files consistently use the hyphenated
  `gpt-5-6-{sol,terra,luna}` form everywhere — no period-stripping slug bug
- ChatGPT/OpenAI honesty: all 6 affected pages carry consistent, prominent
  "not independently confirmed" framing, not contradicted anywhere else on the page
- Scope: `plans.yaml`/`models.yaml` untouched; nothing modified beyond what `plan.md`
  approved except the `decisions.md` line, now fixed

## Verdict

**Needs another implementation pass** at review time → **all findings addressed
post-review** (two golden-rule fixes, one decisions.md correction, one new follow-up
recorded rather than scope-crept into this task). Re-verified clean via full `npm run ci`.
Ready for final sign-off.
