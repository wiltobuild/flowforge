# 02 — Content types

Ten content collections. Every page of a given type has **identical structure**. That
predictability is what makes a large site skimmable and what lets 130 people contribute
without the site fragmenting.

Body section order is mandatory. Do not improvise headings.

## Universal frontmatter

Required on every content file in every collection:

| Field | Type | Notes |
|---|---|---|
| `title` | string | Sentence case, no site name |
| `description` | string | One sentence, ≤160 chars, used for search + cards |
| `level` | enum | Minimum level at which the page appears in nav |
| `status` | enum | `draft` \| `review` \| `verified` |
| `owner` | string | GitHub handle. Required. No orphan pages. |
| `last_verified` | date | ISO 8601 |
| `volatility` | enum | `stable` \| `volatile` — drives staleness banners |
| `next` | array | 2–3 links. Enforced minimum of 2. |

Plus the tag axes that apply to the type (see `docs/03-taxonomy.md`).

---

## 1. `concept`

Vendor-neutral explanation. **No product names.**

Extra frontmatter: `glossary_terms` (terms this page is the canonical definition for).

**Body order:**
1. One-line definition
2. Why it matters
3. Mental model — the analogy. Beginner-visible.
4. How it actually works — intermediate.
5. Common misunderstandings
6. In practice — links down to `/tools` pages. Never explains a product inline.
7. Go deeper — advanced-gated

---

## 2. `plan`

A subscription tier. Renders largely from `plans.yaml`; prose supplements the data.

Extra frontmatter: `plan_id` (joins to `plans.yaml`).

**Body order:**
1. Who this is for — two sentences
2. What you get
3. What it's good at
4. What it can't do
5. How the limits feel — *the differentiating section.* Describe the failure mode
   concretely: what happens when you hit the ceiling, and how it interrupts your work.
6. Who should pick something else
7. Verify — link to the provider's own pricing page, with `last_verified`

---

## 3. `model`

Extra frontmatter: `model_id` (joins to `models.yaml`).

**Body order:**
1. At a glance — rendered from `models.yaml`, not retyped
2. Best at
3. Weak at
4. Quota weight — how heavily it consumes a subscription window relative to siblings
5. When to pick it
6. When not to
7. Notes and gotchas
8. External signals — clearly attributed, linked out, never a numeric table

---

## 4. `prompt`

The volume collection. Optimized for contribution.

Extra frontmatter: `situation` (short phrase, used by the task door).

**Body order:**
1. Situation — when you'd reach for this
2. The prompt — copy block, `{{variables}}` marked
3. Why it works
4. Variations
5. When it fails
6. Related

---

## 5. `pattern`

Covers both patterns and anti-patterns.

Extra frontmatter: `kind` — `pattern` \| `anti-pattern`.

**Body order (pattern):**
1. Problem it solves
2. Structure — diagram
3. Example
4. Tradeoffs
5. Related patterns

**Body order (anti-pattern):**
1. Symptom — how you notice you're in it
2. Why it happens
3. What to do instead
4. Related

---

## 6. `agent-profile`

Sourced from `.claude/agents/` where possible so build tooling and published content stay
identical. Profiles for other tools are authored directly.

Extra frontmatter: `agent_tool` (which harness), `source_file` (optional path).

**Body order:**
1. Purpose
2. The profile — full copy block, downloadable
3. Tools it needs
4. Model recommendation — with quota weight
5. When to use
6. When not to use
7. Example invocation
8. Known failure modes

---

## 7. `skill`

**Body order:**
1. What it does
2. Trigger description — when the harness should invoke it
3. File structure
4. Full source — copy + download
5. Customizing it
6. Testing notes

---

## 8. `playbook`

The task door's destination. The most valuable type on the site.

Extra frontmatter: `situation`, `time_estimate`, `quota` (aggregate weight for the whole run).

**Body order:**
1. The situation
2. Prerequisites — including which plan this realistically needs
3. Steps — numbered. Each step carries an inline prompt block where relevant and its own
   quota weight badge.
4. Decision points — where you branch, and how to choose
5. What good looks like
6. What goes wrong
7. Variations by tool — short, links out to `/tools`

---

## 9. `template`

A downloadable starter file.

Extra frontmatter: `file_name`, `file_type`.

**Body order:**
1. What it's for
2. The file — copy + download
3. How to customize
4. Filled-in example

---

## 10. `showcase`

Cohort projects. The social proof layer.

Extra frontmatter: `author`, `cohort_level`, `stack` (array of tool tags).

**Body order:**
1. What they built
2. Stack used
3. The prompts and agents behind it — links into the libraries
4. What was harder than expected
5. Lessons learned

---

## Not collections

These are **data files**, not content collections. They render into pages but are authored
as structured data. See `docs/04-data-schemas.md`.

- `plans.yaml`
- `models.yaml`
- `glossary.yaml`
- `field-reports.yaml`
- `changelog.yaml`

## Adding a new content type

Requires: a stated reason the existing ten don't fit, a defined body order, schema
validation, and an update to this document — in the same change. Type proliferation is how
reference sites become unnavigable. The bar is deliberately high.
