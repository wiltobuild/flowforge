# Contributing

Three ways to contribute, in increasing technical difficulty. Pick whichever fits — all
three are genuinely useful, and the first one is the most valuable thing you can do.

---

## 1. Submit a field report (~2 minutes, most valuable)

Tell us how much of your subscription a real task actually consumed.

**Open an issue** using the "Field report" template. You'll be asked: your plan, the tool
and model, roughly what you did, how big it was, and roughly what share of your limit it
ate.

Why this matters: nobody publishes this data. Providers won't commit to numbers, and it
genuinely depends on context size and tooling. **The only way it exists is if people who
run the work report it.** Your report directly changes what the quota estimator tells the
next person.

Estimates are fine. "About a third of my 5-hour window" is a useful data point. We use
medians and ranges, so imprecision averages out — but silence doesn't.

## 2. Suggest or correct something (no git required)

Open an issue using one of:

- **Suggest a prompt** — a prompt you reuse constantly
- **This page is wrong** — a factual error
- **Data is stale** — pricing or limits have changed

You do not need to know how to fix it. Reporting it is the contribution.

## 3. Add or edit content (requires git)

Fork, add a file to the right collection, open a PR.

---

## Adding a content page

### Step 1 — pick the type

Ten types, each with a fixed structure. See [`docs/02-content-types.md`](docs/02-content-types.md).

`concept` · `plan` · `model` · `prompt` · `pattern` · `agent-profile` · `skill` ·
`playbook` · `template` · `showcase`

If none fits, open an issue before inventing a new one. Type proliferation is how reference
sites become unnavigable, so the bar is high.

### Step 2 — copy the example for your type

**Copy the complete example for your type**, paste it into that collection's directory,
then edit it. Do not write frontmatter from scratch — you will miss a required field and
the build will reject it.

| Type | Example | Use it for |
|---|---|---|
| `concept` | [concept.mdx](docs/examples/concept.mdx) | Vendor-neutral explanation of how something works |
| `plan` | [plan.mdx](docs/examples/plan.mdx) | A subscription tier |
| `model` | [model.mdx](docs/examples/model.mdx) | A single model's qualitative profile |
| `prompt` | [prompt.mdx](docs/examples/prompt.mdx) | A reusable prompt |
| `pattern` | [pattern.mdx](docs/examples/pattern.mdx) | A technique — or an anti-pattern |
| `agent-profile` | [agent-profile.mdx](docs/examples/agent-profile.mdx) | A reusable subagent definition |
| `skill` | [skill.mdx](docs/examples/skill.mdx) | A packaged capability |
| `playbook` | [playbook.mdx](docs/examples/playbook.mdx) | Step-by-step recipe for a real task |
| `template` | [template.mdx](docs/examples/template.mdx) | A downloadable artifact |
| `showcase` | [showcase.mdx](docs/examples/showcase.mdx) | A cohort project |

Every example is schema-valid and validated in CI, so an unedited copy always builds.
Two things to change before you commit: `owner` (currently `your-github-handle`) and
`last_verified`.

Note the `plan` and `model` examples carry placeholder `plan_id` / `model_id` values.
Those must point at a record that already exists in `src/data/`, which stays empty until
plan data is verified in M1 — replace them, never invent a record to match.

### Step 3 — follow the rules that trip people up

These four cause most rejected PRs:

1. **Body headings are fixed.** Do not add, remove, reorder, or rename the sections listed
   for your type. Consistent structure is what makes a large site skimmable.
2. **Tag values are a controlled vocabulary.** Only values from
   [`docs/03-taxonomy.md`](docs/03-taxonomy.md). If you need a value that doesn't exist,
   propose it in an issue first.
3. **Never type a number that lives in a data file.** Pricing, limits, and context windows
   live in `src/data/`. Reference them; don't restate them. A number copied into prose will
   go stale silently — that's the exact failure this site exists to avoid.
4. **`/concepts` pages name no products.** They're vendor-neutral by rule and tagged
   `agnostic`. Product-specific detail goes in the "In practice" section as a link to
   `/tools`.

### Step 4 — required fields

Every page needs `title`, `description`, `level`, `status`, `owner`, `last_verified`,
`volatility`, and 2–3 `next` links. Plus the tag axes for your type — including `quota`,
which is required even when the answer is `n-a`.

Set `status: draft` and put **your own handle** in `owner`. Drafts get merged — an
imperfect page beats an empty route, and a visible draft attracts correction.

### Step 5 — check it builds

The build validates your frontmatter. If it fails, the error names the field. Fix and push.

---

## Review

Reviewers check, in this order:

1. Factually correct, with sources for anything volatile
2. Follows the type's body order
3. Valid tags, thoughtful `quota`
4. No product names in `/concepts`
5. 2–3 working `next` links
6. Written at the level it claims

We aim to merge drafts quickly and improve them in place, rather than holding PRs for
polish.

---

## Using AI to contribute

Encouraged — it's the point of the site. Two conditions:

- **Verify facts yourself.** Do not submit AI-generated pricing, limits, or capability
  claims without checking the provider's own page. This is the one thing that would damage
  the site's credibility irrecoverably.
- **Say so in the PR** if a page was substantially AI-drafted, so reviewers know to check
  facts harder.

`.claude/agents/page-drafter.md` is a working agent profile for exactly this, and it
already knows the templates and rules.

---

## Licensing

Contributions are accepted under the project's licenses: MIT for code, CC BY 4.0 for
content. By opening a PR you agree to that.

Don't paste provider documentation wholesale. Link to it, summarize in your own words, and
attribute anything you quote.
