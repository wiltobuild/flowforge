## Verification Report

### Acceptance criteria (from `brief.md`, adjusted per `plan.md`)

1. `npm run build` passes with zero errors/warnings — **VERIFIED**. Final run: `Result
   (24 files): 0 errors, 0 warnings`.
2. Every entry has a Tier-1 `source_url`, or explicit `confidence: community-reported` /
   `estimated` with a stated reason — **VERIFIED** by direct read of `plans.yaml` /
   `models.yaml`; all 3 Claude plans + 4 Claude models are `confidence: documented`
   pointing at `claude.com/pricing` or `platform.claude.com/docs`; all 3 ChatGPT plans are
   `confidence: community-reported` with matching prose in every `billing_notes`.
3. No fabricated values; unpublished numbers are `null`/`opaque` or omitted —
   **VERIFIED** by direct read; every uncertain `limit_windows.stated_capacity` is `null`.
4. Cross-file integrity: every `available_on` resolves to a real `plan_id` —
   **VERIFIED, but manually, not by the build.** Ran a standalone Node script parsing both
   YAML files and checking every reference: "All available_on references resolve."
   Separately confirmed the build does NOT catch a broken reference by deliberately
   injecting one (`available_on: [claude-pro, claude-max, DOES-NOT-EXIST]`), running
   `npm run build` (succeeded, 0 errors), then restoring the original and re-confirming
   `git diff --stat main` matches pre-test (202 insertions / 12 deletions, 7 model
   entries via `grep -c "^- model_id:"`). This criterion is met for the data as shipped,
   but the automated safety net it implies does not yet exist — tracked as a follow-up,
   not silently claimed as done.
5. No benchmark score fields — **VERIFIED** by direct read of `models.yaml` and its
   schema; structurally impossible to add one without editing `src/schemas/data.ts`.
6. `changelog.yaml` has both required entries with `source_url` — **VERIFIED** by direct
   read; both entries present, both cite `support.claude.com` / `platform.claude.com`.
7. Human confirms data before merge — **PENDING**, this is the next step, not yet done.

### Additional checks run during this pass (beyond the original acceptance criteria)

- `isoDate` schema (added to fix a date-coercion bug found during Themis review) —
  **VERIFIED** via a standalone unit test against all four cases Themis identified:
  valid date accepted, `2026-02-30` rejected, `08/23/2026` rejected, bare `2026` rejected.
  All four behaved correctly.
- `src/schemas/content.ts` reverted to plain `z.date()` (unnecessary change identified in
  review) — **VERIFIED** via full `npm run ci` passing with real content pages that use
  `last_verified` in frontmatter.
- Full CI suite (`npm run ci`: build+check, concepts-neutrality, examples, links, a11y) —
  **VERIFIED**, all five checks pass clean on the final state.

### Commands run

```
npm run build
npm run ci
node -e "<standalone plan_id/model_id cross-reference check>"
node -e "<deliberate reference-break test, then restore>"
node --input-type=module -e "<isoDate unit test against 4 cases>"
git diff --stat main -- src/data/models.yaml   (before and after the break test)
grep -c "^- model_id:" src/data/models.yaml
```

### Not verified

- **The actual current truth of any figure beyond what was checked live on 2026-08-23.**
  This data will start drifting immediately, especially the weekly-limit promo end date
  (already moved once) and everything ChatGPT-related (never independently confirmed at
  all). Not a gap in this verification — it's the nature of the data.
- **Rendering.** No page yet queries `plans.yaml`/`models.yaml` (that's M1-T3/T4), so
  nothing was visually verified in a browser — there is nothing to render yet. Build
  succeeding is the correct and only applicable check at this stage.
- **Whether the cross-reference-enforcement gap affects any other existing collection**
  beyond `plans`/`models` (e.g. `field-reports` → `plans`/`models`, or content pages'
  `plan_id`/`model_id` frontmatter) — not tested, since `field-reports.yaml` is still
  empty and no content page yet sets those fields. Likely the same gap applies; flagged
  in `docs/04-data-schemas.md`'s updated note but not independently confirmed per
  collection.
