# 05 — Interactive component specs

Seven interactive pieces. Everything else on the site is static.

Each one must ship with defined empty, loading, error, and low-confidence states. A
component without those states is not done.

---

## 1. Quota Estimator — flagship

**Route:** `/plans/usage/estimator`

**The question it answers:** *"I'm on this plan. I want to do this thing. Will I get cut
off?"*

Not "what will this cost in dollars." Nobody on a subscription cares about dollars.

### Inputs

| Input | Control | Source |
|---|---|---|
| Plan | select | `plans.yaml` |
| Tool | select | `tool` vocabulary, filtered by plan |
| Model | select | `models.yaml`, filtered by plan |
| Task archetype | select | archetype vocabulary |
| Scale | radio: small / medium / large | archetype-specific descriptions, shown inline |
| Session length | slider | minutes |
| Using subagents | toggle | |
| Extended reasoning | toggle | if model supports it |

Every input needs a plain-language helper. "Scale" especially — "large" must be defined
concretely per archetype ("large = 20+ files or a whole module"), or the numbers are noise.

### Computation model

Unit of account is **window share**: percentage of the plan's limiting window consumed.

1. Look up the plan's limiting window from `plans.yaml`.
2. Take the base window-share distribution for `(task_archetype, scale)` from
   `field-reports.yaml` — use the **median and interquartile range**, not the mean. Small
   samples with outliers make means useless.
3. Apply multipliers for model quota weight, subagent fan-out, extended reasoning, and
   session length.
4. Output a **range** (p25–p75), never a point estimate.

Multipliers live in a single documented constants file with a comment explaining each
one's derivation. When field-report volume for a given combination is sufficient, the
direct distribution replaces the multiplier chain — the multipliers exist to cover sparse
cells, not to be permanent.

### Output

- **Range** — "roughly 30–55% of your 5-hour window"
- **Verdict band:**

  | Range midpoint | Verdict |
  |---|---|
  | < 25% | Comfortable |
  | 25–60% | Noticeable — fine, but don't stack three of these |
  | 60–100% | Tight — plan for it |
  | > 100% | Won't fit — split the task |

- **Top 3 mitigations**, rule-selected by whichever multiplier dominated the estimate.
  Links into `/plans/usage/stretching-your-plan`.
- **Confidence**, always visible:

  | Reports in cell | Display |
  |---|---|
  | ≥ 12 | Normal, with sample size shown |
  | 4–11 | "Low confidence — based on N reports" |
  | < 4 | **"Not enough data yet."** Show a clearly-labelled judgment estimate and a prominent prompt to submit a report. |

### Non-negotiables

- **Never display a single number.** Ranges only. A point estimate implies precision that
  does not exist and will be quoted back as fact.
- Always show sample size and last calibration date.
- Always link to how the estimate was produced.
- Works with JavaScript disabled? No — but it must degrade to a readable static
  explanation plus a link to the field reports table.
- Fully keyboard operable. Results announced to screen readers on change.
- No submission, no network calls, no storage of user input. Pure client-side computation
  over build-time data.

---

## 2. Plan Picker

**Route:** `/plans/start-here`, embedded

Three to four questions, then a recommendation with **visible reasoning**. Never a bare
verdict — beginners need to see why, and outside readers need to see this isn't an ad.

Questions: What are you mostly doing? · How do you feel about being interrupted mid-task
vs. quietly getting a weaker model? · What's your monthly budget? · Are you writing code?

Output: primary recommendation, the honest runner-up with its tradeoff, what each free
tier can actually do, and an explicit "many people end up running both" note where the
answers support it.

Must show a permalink so people can share their result.

---

## 3. Decision trees

Reusable component, content-driven from YAML. Four instances at v1:

- Which plan should I buy? (`/plans/start-here`)
- Which model, within my plan? (`/plans/models/picking-a-model`)
- Agent or workflow? (`/agents/agent-vs-workflow`)
- Skill, subagent, or MCP server? (`/skills/concept`)

Requirements: every node is deep-linkable; the whole tree is visible as a static list
below the interactive version (accessibility + printability + SEO); back navigation works;
terminal nodes link to a page, never dead-end in a sentence.

---

## 4. Comparison matrix

**Route:** `/plans/compare` and `/plans/models/`

Rendered from `plans.yaml` / `models.yaml`. Sortable, filterable by the tag axes.

- Horizontal scroll container — **the page body must never scroll horizontally**
- On mobile, collapses to stacked cards, not a squeezed table
- Every cell that carries a volatile fact shows its `last_verified` on hover/focus
- A "only show what my plan includes" filter, persisted alongside the level toggle
- Empty state when filters exclude everything, with a one-click reset

---

## 5. Glossary tooltips

Auto-link the first occurrence of a glossary term per page. Hover **and** focus reveal.
Tap on touch devices.

- Tooltip shows `short` plus a link to the canonical page
- Never auto-link inside headings, code blocks, or copy blocks
- Beginner-level terms link aggressively; advanced terms only in beginner/intermediate
  contexts, to avoid peppering advanced pages with underlines
- Dismissible with Escape; never traps focus
- Degrades to a plain link without JavaScript

---

## 6. Task door

**Route:** homepage, plus `/playbooks/`

An "I need to ___" picker driven by the `task` tag axis and playbook `situation` fields.
Type-ahead over situations, with the full list browsable below.

Results show: playbook title, time estimate, quota weight badge, minimum plan. Sorted by
relevance, filtered by the active level toggle.

Empty state matters here — an unmatched query should offer the nearest playbooks and a
link to ask in `/cohort/faq`, never a bare "no results."

---

## 7. Search

Static index (see `docs/07-stack-decisions.md`), Cmd/Ctrl-K.

- Facets in order: `level`, `task`, `plan`, `tool`, `quota`, `effort`
- `status: draft` pages are de-ranked, not hidden
- Results show the quota and level badges inline
- Keyboard-first: open, type, arrow, enter. Escape closes and restores focus.
- Works without JavaScript? No — but a browsable `/sitemap` page must exist as the fallback

---

## 8. Field report submission

Not a component — a **GitHub Issue Form** (`.github/ISSUE_TEMPLATE/field-report.yml`)
linked prominently from the estimator and every field-reports view.

Fields mirror `field-reports.yaml` (see `docs/04`). Rationale for this over a hosted form:
no backend, no third-party dependency, no PII handling, contributors keep attribution, and
every entry passes human triage before it can move the estimator.

The link must appear at the point of frustration — specifically, in the estimator's
low-confidence state, where the reader has just discovered the data they wanted doesn't
exist yet. That is the moment someone is most willing to contribute it.
