# 03 — Taxonomy

Tags are the connective tissue. They let one page appear in the browse tree, a playbook,
the task door, and filtered search **without being written more than once**. Get this
wrong and you end up duplicating content.

Seven axes. All values are controlled vocabularies — inventing a value requires editing
this file first, and schema validation enforces it.

---

## 1. `level` — required, single value

| Value | Meaning |
|---|---|
| `beginner` | No prior context assumed. No jargon without a tooltip. |
| `intermediate` | Comfortable with the basics, configuring and building. |
| `advanced` | Optimizing, orchestrating, working at the edges. |

Sets the **minimum** level at which the page surfaces in navigation. Within a page,
sections carry their own level and collapse above it. See `docs/01` → level toggle.

---

## 2. `role` — required, multi-value

| Value | Who |
|---|---|
| `builder` | Writing code / shipping software with AI |
| `operator` | Automating their own work, not primarily a coder |
| `strategist` | Deciding what to build, evaluating, planning |

Drives the three learning paths under `/start/paths/`.

---

## 3. `task` — multi-value

Powers the **task door**. This is the highest-leverage axis on the site; tag it carefully.

`plan` · `research` · `write` · `code` · `review` · `debug` · `automate` · `analyze` ·
`ship` · `collaborate` · `learn`

---

## 4. `tool` — required, multi-value

| Value | Notes |
|---|---|
| `agnostic` | **Required on all `/concepts` pages.** Mutually exclusive with all others. |
| `claude-code` | |
| `codex` | |
| `cursor` | |
| `copilot` | |
| `chat-ui` | Browser chat apps generally |
| `api` | Direct API use |
| `mcp` | |
| `other` | Requires a note in the body naming the tool |

**Validation rule:** any page under `/concepts` must be tagged `agnostic` and must not
carry any other `tool` value. This is the mechanism that enforces the vendor-neutrality
rule from `AGENTS.md`.

---

## 5. `plan` — required, multi-value

Which subscriptions this content is achievable on. Lets a reader filter the entire site to
what they can actually do today.

| Value | Meaning |
|---|---|
| `free` | Works on free tiers |
| `claude-pro` | Entry paid Claude tier |
| `chatgpt-plus` | Entry paid OpenAI tier |
| `higher-tier` | Needs a plan above the entry tier |
| `api` | Needs API access / billing |

---

## 6. `quota` — required, single value

How heavily this consumes a subscription window. **The axis this site exists for.**

| Value | Meaning |
|---|---|
| `light` | Negligible. Run it freely. |
| `moderate` | Noticeable. Fine a few times a session. |
| `heavy` | Can consume a large share of a window. Plan around it. |
| `n-a` | Doesn't consume quota (reference, conceptual) |

Renders as a badge everywhere: model pages, playbook steps, agent profiles, prompts.
Assign it from field-report data where available; from judgment otherwise, and mark
`status: draft` until a report backs it.

---

## 7. `effort` — required, single value

Reader time, not compute.

`5min` · `30min` · `deep-dive`

---

## Maintenance metadata

Not tags, but required frontmatter on everything:

| Field | Purpose |
|---|---|
| `status` | `draft` \| `review` \| `verified` — rendered as a badge; `draft` is de-ranked in search |
| `owner` | GitHub handle. **No page ships without one.** |
| `last_verified` | ISO date, human-set, never auto-bumped by a commit |
| `volatility` | `stable` \| `volatile` |

### Staleness thresholds

| `volatility` | Warn after | Behavior |
|---|---|---|
| `volatile` | 45 days | Banner: "may be out of date", link to provider source, owner notified |
| `stable` | 365 days | Quiet flag in the maintenance report only |

Anything joined to `plans.yaml` or `models.yaml` is `volatile` by definition. Concept pages
are `stable`. A build-time report lists everything past threshold; it does not fail the
build (a stale page still beats a broken site).

---

## Tagging rules

1. **Tag generously on `task`, sparingly on everything else.** Over-tagging `level` or
   `role` makes filters useless.
2. **Never invent a value inline.** Edit this file, update the schema, then use it.
3. **`agnostic` is exclusive.** If a page needs another `tool` value, it does not belong in
   `/concepts`.
4. **`quota` is required even when `n-a`.** Forcing the author to consider it is the point.
5. Related-content blocks are seeded from shared tags, then hand-curated. Never ship a
   purely automatic related list.

## Search facets

Expose as filters in search, in this order: `level`, `task`, `plan`, `tool`, `quota`,
`effort`. `role` is a path selector, not a search facet — it's too coarse to filter on.
