# Final Report: m1-t3-t4-plan-model-pages

## What changed

- `src/components/PlanFacts.astro`, `src/components/ModelFacts.astro` (new) — render
  structured facts from `plans.yaml`/`models.yaml` live, so pages never retype volatile
  numbers into prose. Model pricing is wrapped in the existing `LevelSection
  minLevel="advanced"`.
- 6 plan pages under `src/content/docs/plans/what-you-get/` — one per `plan_id`, replacing
  the stale 3-page sitemap sketch
- 7 model pages under `src/content/docs/plans/models/{anthropic,openai}/` — one per
  `model_id`; OpenAI files use hyphenated slugs (`gpt-5-6-sol.mdx`) to avoid a
  period-stripping URL bug caught during the first build
- `docs/01-information-architecture.md` — sitemap sketch corrected to the real 6-page set
- `docs/agent/decisions.md` — 2 decisions recorded, plus a fix to an editing artifact from
  the prior task that Themis caught

## What was verified

Full detail in `verification.md`. Summary: `npm run ci` clean across all five checks;
body order and frontmatter conformance confirmed on all 13 pages; API pricing gating
confirmed both structurally and by live browser render; all internal links resolve after
two rounds of fixes (missing base-prefix on prose links, `next` links pointing at
not-yet-built future pages).

## What Themis found and how it was resolved

1. **Two golden-rule-1 violations** — `chatgpt-plus.mdx` hardcoded a cross-plan price
   comparison; `haiku-4-5.mdx` hardcoded a cross-model context-window comparison. Both are
   exactly the failure mode the two new components exist to prevent, and both slipped
   through because they're *derived* claims spanning two data entries, not a single
   field either component renders. **Fixed**: reworded both to point at the rendered
   figures instead of restating them.
2. **An editing artifact** — an earlier `Edit` call (in the prior M1-T1/T2 task) matched a
   shorter substring than the actual line, splicing new content mid-line and misplacing a
   trailing fragment onto the wrong decision entry. **Fixed**: removed the misplaced text.
3. **A new, unfixed gap, tracked as follow-up task #10** — `PlanFacts`/`ModelFacts` take a
   plain string prop with no build-time validation; a typo'd `planId` renders a visible
   but CI-invisible error state. Different from the already-tracked `check-references.mjs`
   gap (task #9), which only covers frontmatter, not component props.

## What wasn't verified / remains open

1. Manual visual review (responsive breakpoints, dark theme) of the two new components —
   axe passed and nothing else flagged an issue, but no human has looked at them rendered.
2. Follow-up task #10 (component prop validation) — recorded, not built.
3. Follow-up task #9 (`check-references.mjs`, from the prior task) — still open,
   independently confirmed relevant again by this task's own reference-break test.
4. This task didn't re-verify any pricing/limit facts — it only renders what M1-T1/T2
   already verified on 2026-08-23. That data's own staleness clock is already ticking
   (see M1-T1/T2's final report on the weekly-limit promo).

## Recommendation

Ready for your review and merge decision. Both real defects were caught and fixed before
reaching you; the one open gap (#10) is a reasonable follow-up, not a blocker — the data
in this batch is correct, and the exposure is a future typo, not anything currently wrong.

Not committing or merging without your go-ahead, same as every prior task.
