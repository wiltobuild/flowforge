# 09 — Content operations

The site will be judged on content, not code. The code is a few weeks of work; the content
is ongoing forever. This document is the part most likely to be skipped and most likely to
determine whether the project survives.

---

## Do not write this alone

There are ~130 people in the cohort. A solo-authored reference site is a burnout machine
and dies at graduation. Every mechanism below exists to move authorship outward.

### 1. Harvest L3 first

L3 has already solved what L1 is about to hit. Run a structured collection — a form or a
session — asking:

- What's the one thing you wish you'd known at L1?
- What burned the most quota before you figured out a better way?
- What agent or prompt do you reuse constantly?
- What broke in a way that took you a day to understand?

This seeds the FAQ, the anti-patterns collection, `field-reports.yaml`, and the prompt
library simultaneously — with content that **exists nowhere else on the internet**. Do this
before writing prose by hand.

### 2. Adopt-a-page

Publish the stub list. People claim one. The claimed page gets their handle in `owner`.

Ownership is the single highest-leverage mechanism here. An unowned page is a page nobody
notices going stale. This is why `owner` is a required field that fails the build.

### 3. Content sprints

90 minutes, 20 people, one prompt-library entry each → 20 pages. The type templates make
them come out consistent without editorial overhead. Run one per section.

### 4. Mine the class Q&A

Every question asked in a session is a page somebody else needed. This is continuous,
zero-effort content generation. Assign someone to convert questions into FAQ entries
weekly.

### 5. Field reports as passive generation

Once the loop is live, `field-reports.yaml` grows without anyone writing prose. Protect
this — it's the site's most defensible content.

---

## Contribution paths

Three, in increasing technical difficulty. Document all three prominently.

| Path | For | Mechanism |
|---|---|---|
| Field report | Anyone with a GitHub account | Issue form, ~2 minutes |
| Suggest / correct | Non-developers | Issue templates: "suggest a prompt", "this is wrong", "data is stale" |
| Direct PR | Comfortable with git | Fork, add content file, PR |

`CONTRIBUTING.md` must include a **complete valid example for each content type** that can
be copy-pasted and edited. Most contributors will not read the schema; they will copy the
example. Make the example correct.

---

## Review workflow

```
draft  →  review  →  verified
```

- `draft` — merged and visible, de-ranked in search, badged. **Merge drafts.** An imperfect
  page beats an empty route, and a visible draft attracts correction.
- `review` — a second person has read it for accuracy and template conformance
- `verified` — facts checked against sources; every volatile claim has `source_url` and
  `last_verified`

Review criteria, in priority order:

1. Is it factually correct, and is volatile data sourced?
2. Does it follow the type's body order?
3. Are tags valid and is `quota` set thoughtfully?
4. **Does a `/concepts` page name a product?** (auto-caught by the `agnostic` tag rule)
5. Are there 2–3 `next` links?
6. Is it written at the level it claims?

---

## Keeping data honest

The failure mode that kills reference sites is stale facts stated confidently.

- **Single source per fact.** Anything appearing twice moves into `src/data/`.
- **Visible dates.** Every volatile fact renders `last_verified`.
- **Automatic staleness.** Past threshold → banner (`docs/03`). Never silently hide it.
- **Confidence markers.** `documented` / `community-reported` / `estimated`. Say which.
- **Link out.** Provider pages are the source of truth for pricing; the site is a guide,
  not an authority, and should say so.
- **Never fabricate to fill a field.** `null` and "not published" are correct answers.

### Verification cadence

| Data | Cadence | Owner |
|---|---|---|
| `plans.yaml` | Monthly | Data steward |
| `models.yaml` | Monthly + on release | Data steward |
| Field reports | Rolling triage | Report triager |
| Concepts | Annually | Page owner |

The `data-verifier` agent (`.claude/agents/`) exists to make the monthly pass cheap. It
proposes updates; **a human verifies and merges.** Never auto-merge data changes.

---

## Succession

The founder graduates. Design for it from month one, not month eleven.

- **Two to three co-maintainers from the start**, ideally at least one from L1 and one from
  L3, so the roster doesn't graduate all at once
- `MAINTAINERS.md` names current maintainers, the data steward, the triager, and the
  handoff process
- Per-page `owner` means responsibility is already distributed
- Zero-config fork-and-deploy (ADR-005) means anyone can continue it unilaterally
- Quarterly: review orphaned pages, reassign owners who've gone inactive

A single-maintainer open-source project is a project with an expiry date. The point of
every mechanism in this document is that no one person's departure ends it.

---

## Anti-patterns for this site's own operations

- Writing ten sections thinly instead of four well
- Letting `draft` pages accumulate without owners
- Copying a number from a data file into prose "just this once"
- Auto-merging data updates from an agent
- Adding content types instead of using tags
- Treating the spec as immutable — update it when it's wrong, in the same PR
