# Review: m1-t1-t2-plans-models-data

_Themis pass, 2026-08-23, run independently against `brief.md` and `plan.md`._

## Process note

Themis ran `git checkout -- src/data/models.yaml` while testing a deliberate broken
reference, which reverted the entire file to the pre-task `[]` instead of undoing just
the test edit. Themis restored it from content already read and reported this
transparently rather than silently. Independently re-verified after the review returned:
`grep -c "^- model_id:" src/data/models.yaml` → 7 (matches what was written), file line
count and `git diff --stat main` both consistent with the intended 214-line addition.
Confirmed intact.

## Must-fix (both addressed post-review)

1. **Cross-file reference integrity is not actually build-enforced.** Astro's
   `reference()` only validates at query time; no page yet queries the `plans`/`models`
   collections, so a deliberately broken `available_on` reference produced a clean build.
   This is a pre-existing M0 gap surfaced by this task, not introduced by it, but it made
   this task's own acceptance criterion 5 false as stated.

   **Resolution**: Not fixed with a new validation script — that would itself be scope
   creep. Instead: (a) corrected the false claim in `src/content.config.ts` and
   `docs/04-data-schemas.md` that this is enforced today, (b) manually verified every
   `available_on` in the actual shipped data resolves correctly (see `verification.md`),
   (c) recorded a follow-up task recommendation to build the real validation script.

2. **`z.coerce.date()` silently normalizes invalid dates** (`2026-02-30` → rolled forward
   to March 2; ambiguous/partial strings accepted) rather than rejecting them, on fields
   that are this site's mechanism for dated, falsifiable claims.

   **Resolution**: Replaced with a strict `isoDate` schema in `src/schemas/data.ts` —
   regex-anchored YYYY-MM-DD shape, round-tripped through `Date` to reject anything that
   isn't a real calendar date. Unit-tested against all four failure cases Themis
   identified; all four now correctly rejected (see `verification.md`).

## Optional (not addressed, tracked)

- OpenAI-model → ChatGPT-plan `available_on` mapping is caveated only in a YAML comment,
  invisible to any code consuming the data, because `modelSchema` has no `confidence`
  field the way `planSchema` does. Consciously deferred rather than silently ignored —
  the header comment in `models.yaml` states this explicitly. Worth a schema follow-up
  before any page renders this field as unqualified fact.

## Scope drift (addressed)

- `src/schemas/content.ts` was touched (`z.date()` → `z.coerce.date()`) but was never
  part of the approved plan, and turned out to be unnecessary — Starlight's `docsLoader`
  already hands that field a real `Date` object; only the custom `yamlFile` loader used
  for `src/data/*.yaml` returns date-like scalars as plain strings.

  **Resolution**: Reverted `content.ts` to plain `z.date()`. The `isoDate` fix stays
  scoped to `data.ts` only, where it's actually needed.

- Everything else in the diff matches the approved plan cleanly: the `adaptive_thinking`
  enum addition, the doc update, both `decisions.md` entries, the data files themselves,
  and the examples' placeholder-ID swap (a forced consequence of examples needing to
  resolve against real data, not scope creep).

## Confirmed clean (Themis found no issues)

- Full `npm run build` / `npm run ci`: 0 errors, 0 warnings
- No benchmark score fields anywhere, no workaround found
- ChatGPT data consistently marked `confidence: community-reported`, with matching
  "COMMUNITY-REPORTED, not independently Tier-1 confirmed" language everywhere relevant —
  no false-confidence prose
- No fabricated numbers: unconfirmed `limit_windows` entries use `stated_capacity: null`;
  Free-tier limit mechanism explicitly marked uncertain

## Verdict

**Needs another implementation pass** at review time → **both must-fix items resolved
post-review** (see Resolution notes above). Re-verified clean (`verification.md`). Ready
for final sign-off, with the cross-reference-enforcement gap explicitly flagged as a
known, tracked limitation rather than silently left implied-fixed.
