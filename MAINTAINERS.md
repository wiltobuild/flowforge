# Maintainers

This project is designed to outlive its founder. A single-maintainer open-source project
is a project with an expiry date; every role below exists so that no one person's departure
ends it.

**Status: roles unfilled. This is blocking — see [`docs/10-open-questions.md`](docs/10-open-questions.md) Q3.**

---

## Roles

| Role | Responsibility | Current |
|---|---|---|
| **Lead maintainer** | Direction, final call on scope, merges | _unfilled_ |
| **Co-maintainer** | Reviews, merges, covers the lead | _unfilled_ |
| **Co-maintainer** | Reviews, merges, covers the lead | _unfilled_ |
| **Data steward** | Monthly verification of `plans.yaml` / `models.yaml` | _unfilled_ |
| **Report triager** | Rolling triage of the field report queue | _unfilled_ |

### Staffing rule

Maintainers should span cohort levels — **at least one from L1 and one from L3** — so the
roster does not graduate all at once. This is the single most important thing on this page.

---

## Role detail

### Data steward

The highest-trust role. Owns the site's most volatile and most credibility-critical data.

- Monthly pass over `plans.yaml` and `models.yaml` against **provider sources only**
- Ad-hoc verification when a provider ships a change
- Files `changelog.yaml` entries for anything that changes a recommendation on the site
- Uses `.claude/agents/data-verifier.md` to make the pass cheap — **but verifies and merges
  personally.** Data changes are never auto-merged.

### Report triager

- Rolling triage of the field report issue queue
- Uses `.claude/agents/field-report-triager.md`
- Flags outliers for human review rather than discarding them
- Escalates when a batch shifts estimator calibration or when the archetype vocabulary
  needs extending

### Reviewers generally

Review criteria and priority order are in [`CONTRIBUTING.md`](CONTRIBUTING.md). Bias toward
merging drafts and improving in place.

---

## Page ownership

Every content page carries an `owner` in its frontmatter. This is not decoration — it fails
the build if empty. Owners are responsible for keeping their page accurate and for
responding when the staleness system flags it.

Owning a page is a smaller commitment than being a maintainer and is the normal entry
point. Claim one from the adopt-a-page list.

---

## Quarterly review

Once a quarter, maintainers:

1. Reassign pages whose owners have gone inactive
2. Review the staleness report and clear anything past its verify window
3. Confirm the maintainer roster still spans active cohort members
4. Check that at least two people have merge rights and have used them recently

Item 4 is the survival check. If only one person has merged anything in three months, the
project is single-maintainer again regardless of what this file says.

---

## Handoff process

When a maintainer steps down:

1. Announce it in an issue, with a target date
2. Reassign their owned pages, from the adopt-a-page list
3. Transfer any specialist role explicitly — data steward and triager must never be vacant
4. Update this file
5. Confirm the remaining roster still spans cohort levels; recruit if not

If the whole roster is graduating at once, say so publicly and recruit before, not after.
The project is MIT/CC BY licensed and deploys from a fork with zero configuration
([ADR-005](docs/07-stack-decisions.md)) — anyone can continue it unilaterally, and that is
deliberate.

---

## Contact

Open an issue. Do not route project decisions through private channels — a project whose
decisions aren't visible can't be inherited.
