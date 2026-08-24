# Task Brief: m1-t5-plans-start-here — /plans/start-here

**Date**: 2026-08-23
**Status**: review

## Request

Run M1-T5 from `docs/08-build-plan.md`: build `/plans/start-here`, the beginner decision
page. Depends on M1-T3 (plan pages, merged).

## Ground-truth preflight

- Branch: `main` at merge time of M1-T3/T4 (`8fb17c9`)
- Working tree: clean before this task started
- Repo state matches `docs/agent/project-profile.md`? Yes

**Process note**: this task was executed directly (single page, "full auto" scope granted
by the user mid-session) without the full brief→investigation→plan sequence used for the
two prior M1 tasks. This file, `decisions.md`, `review.md`, and `verification.md` were
written retroactively after Themis's review flagged the missing paper trail — a legitimate
finding, addressed here rather than argued away.

## Content-type decision (found mid-task, resolved without a blocking stop)

No existing content type cleanly fits a page that names specific products (Claude Pro,
ChatGPT Plus) by name to make a recommendation:
- `type: concept` is disqualified — concept pages must stay vendor-neutral (`AGENTS.md`
  golden rule 2, enforced by the `agnostic` tag rule), and this page's entire point is
  naming and comparing two named products.
- `type: plan`/`type: model` require a singular `plan_id`/`model_id` reference — this page
  is about the *choice between* plans, not one plan.
- `type: playbook` was chosen as the best remaining fit: it has no vendor-neutrality
  requirement, and its body order (situation → prerequisites → steps → decision points →
  what good looks like → what goes wrong → variations) can hold a decision guide, even
  though playbook `Steps` are more naturally sequential actions than reflective questions.

This is recorded as a **decision**, not a silent judgment call — see `decisions.md`.

## Acceptance-criteria tension (found in review, not before)

`docs/08-build-plan.md`'s stated done-when for M1-T5 is *"Three paragraphs, one
recommendation, no token math, two-sided."* `docs/02-content-types.md`'s playbook body
order is fixed at 7 mandatory sections and `AGENTS.md` forbids improvising headings. These
two requirements are in tension: satisfying the mandatory playbook structure means the
page cannot literally be three paragraphs.

Themis caught that this tension existed and was never explicitly resolved or logged during
drafting. See `decisions.md` for the resolution: keep the mandatory playbook structure
(a harder, structural site-wide rule) over the build-plan row's literal length target (a
one-line, pre-structural-decision acceptance note), while tightening prose for scannability
where that doesn't require breaking the section order.

## Scope

**In scope**: the static prose page only. The interactive Plan Picker component described
in `docs/05-interactive-specs.md` §2 is a separate task (M1-T6) that will eventually embed
into this same route — this page is written to make sense standing alone today and to
still make sense once that component is added later.

**Out of scope**: the Plan Picker component itself; any change to `plans.yaml`.

## Acceptance criteria

1. `npm run ci` passes clean
2. No per-token/API pricing visible at beginner level (golden rule 5)
3. No hardcoded volatile facts (golden rule 1) — Themis found and this fixes a violation
   (hardcoded $20/$40 prose prices)
4. Genuinely two-sided: both plans get a fair, symmetric treatment with visible reasoning,
   not a bare verdict (`docs/10` Q7's default tone)
5. All internal links (both `next` frontmatter and in-body prose) resolve
6. Content-type choice and the acceptance-criteria tension are documented, not silently
   resolved

## Recommended workflow

Content-only page, single file — compressed workflow (direct authoring, Themis review,
Apollo verification), consistent with the "full auto" scope granted for this session's
remaining routine work. Themis review still run in full, given the prior two tasks each
found real defects this way.

## Risk level

**Low.** Single page, no schema/data changes. The main risk realized was documentation
process drift (skipping the paper trail), not a content or code defect beyond the
pricing fix.
