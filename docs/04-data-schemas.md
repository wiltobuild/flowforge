# 04 — Data schemas

Five structured data files. Facts that appear in more than one place live here exactly
once and are rendered everywhere. **If a number is typed into a Markdown body, it is a bug.**

All files are YAML in `src/data/`, validated at build time. A schema violation fails the
build.

---

## `plans.yaml` — subscription tiers

The most important and most volatile file on the site. Drives `/plans/*`, the estimator,
the `plan` tag filter, and the comparison matrix.

| Field | Type | Req | Notes |
|---|---|---|---|
| `plan_id` | slug | ✔ | Stable. Joins to `plan` content pages. |
| `provider` | string | ✔ | |
| `display_name` | string | ✔ | |
| `tier` | enum | ✔ | `free` \| `entry` \| `mid` \| `high` \| `team` |
| `price_usd_month` | number \| null | ✔ | `null` for free |
| `billing_notes` | string | | Annual discount, seat minimums |
| `included_products` | array | ✔ | Which apps/agents the plan covers |
| `limit_windows` | array | ✔ | See below — the core of the estimator |
| `limit_style` | enum | ✔ | `hard-stop` \| `demote` \| `mixed` |
| `limit_style_note` | string | ✔ | **Plain-language description of what hitting the limit feels like.** This is the single most useful field for beginners. |
| `good_for` | array | ✔ | Short phrases |
| `not_for` | array | ✔ | Short phrases |
| `source_url` | url | ✔ | Provider's own pricing page |
| `last_verified` | date | ✔ | Human-set |
| `confidence` | enum | ✔ | `documented` \| `community-reported` \| `estimated` |

### `limit_windows` entries

| Field | Type | Notes |
|---|---|---|
| `window_id` | slug | e.g. `session`, `weekly` |
| `duration_hours` | number | Rolling window length |
| `unit` | enum | `messages` \| `sessions` \| `opaque` |
| `stated_capacity` | number \| null | `null` when the provider doesn't publish one |
| `applies_to` | array | Which models/products this window governs |
| `note` | string | Caveats |

`unit: opaque` and `stated_capacity: null` are expected and normal — several providers do
not publish hard numbers. **The UI must handle unknown capacity gracefully**, falling back
to community-reported values with a visible confidence marker. Never fabricate a number to
fill the field.

### Shape

```yaml
- plan_id: example-entry
  provider: Example
  tier: entry
  price_usd_month: 20
  limit_style: hard-stop
  limit_style_note: >
    You get cut off mid-task and wait for the window to reset.
  limit_windows:
    - window_id: session
      duration_hours: 5
      unit: opaque
      stated_capacity: null
  source_url: https://example.com/pricing
  last_verified: 2026-08-02
  confidence: documented
```

---

## `models.yaml`

| Field | Type | Req | Notes |
|---|---|---|---|
| `model_id` | slug | ✔ | Stable, provider-prefixed |
| `provider` | string | ✔ | |
| `display_name` | string | ✔ | |
| `family` | string | | Groups siblings |
| `release_date` | date | | |
| `status` | enum | ✔ | `current` \| `legacy` \| `deprecated` |
| `context_window` | number | | Tokens |
| `max_output` | number | | Tokens |
| `modalities` | array | ✔ | `text` \| `image` \| `audio` \| `video` |
| `capabilities` | array | ✔ | `tool_use` \| `vision` \| `extended_thinking` \| `adaptive_thinking` \| `caching` \| `batch` \| `structured_output` — `extended_thinking` is an explicit opt-in toggle; `adaptive_thinking` is always-on/automatic reasoning with no toggle. Vendors that document both treat them as distinct, independently-present capabilities, not synonyms (added 2026-08-23, `docs/agent/decisions.md`) |
| `available_on` | array | ✔ | `plan_id` references — **drives the "can I use this?" filter**. This is the *only* place the plan↔model relationship is stored; plan pages derive their model list from it. |
| `quota_weight` | enum | ✔ | `light` \| `moderate` \| `heavy` — relative consumption within its plan |
| `speed_tier` | enum | | `fast` \| `balanced` \| `slow` |
| `reasoning_tier` | enum | | `basic` \| `strong` \| `frontier` |
| `best_at` | array | ✔ | Qualitative phrases |
| `weak_at` | array | ✔ | Qualitative phrases |
| `api_pricing` | object | | `input`, `output`, `cached_input`, `cache_write`, `batch_input`, `batch_output` — per 1M tokens. **Advanced-gated in the UI.** |
| `external_signals` | array | | `{ source, url, note }` — attributed, linked, never a score table |
| `source_url` | url | ✔ | |
| `last_verified` | date | ✔ | |

**No benchmark score fields.** See `docs/00-product-brief.md` for the reasoning. If someone
adds one, remove it.

---

## `field-reports.yaml` — the crowdsourced layer

Real usage observations from cohort members. Calibrates the estimator and stands alone as
content at `/plans/usage/field-reports`.

| Field | Type | Req | Notes |
|---|---|---|---|
| `report_id` | slug | ✔ | Assigned at triage |
| `submitted` | date | ✔ | |
| `plan_id` | slug | ✔ | |
| `tool` | tag | ✔ | From the `tool` vocabulary |
| `model_id` | slug | | If known |
| `task_archetype` | slug | ✔ | From the archetype list below |
| `task_description` | string | ✔ | Free text, ≤200 chars |
| `scale` | enum | ✔ | `small` \| `medium` \| `large` — anchors below |
| `window_share_pct` | number | ✔ | Reporter's estimate, 0–150. Above 100 = ran out. |
| `hit_limit` | boolean | ✔ | |
| `session_minutes` | number | | |
| `used_subagents` | boolean | | |
| `what_helped` | string | | Mitigation that worked |
| `reporter` | string | | GitHub handle or `anonymous` |
| `cohort_level` | enum | | `l1` \| `l3` \| `other` |

**These are timestamped observations, not claims.** That is why they age gracefully where
hard limit numbers do not — a report from March is still a true report from March. Always
render the date.

### Task archetypes (controlled vocabulary)

`greenfield-feature` · `refactor-module` · `debug-single-issue` · `codebase-exploration` ·
`write-tests` · `code-review` · `research-synthesis` · `document-writing` ·
`data-analysis` · `agent-orchestration` · `long-conversation`

Adding an archetype requires updating this file and re-checking estimator calibration.

### Scale anchors (controlled vocabulary)

| Value | Anchor |
|---|---|
| `small` | One focused file, question, or output |
| `medium` | One module, or several connected files/outputs |
| `large` | Multiple modules, a cross-cutting change, or many deliverables |

These are deliberately **generic across archetypes** rather than defined per archetype.
Eleven archetypes times three sizes is thirty-three definitions nobody reads; per-archetype
nuance belongs in the submission form's help text, where the submitter actually sees it.

The anchors are shared by `.github/ISSUE_TEMPLATE/field-report.yml` and the
`field-report-triager` agent, and the two must agree. **Changing an anchor invalidates the
comparability of every report already submitted under the old wording** — reports are
timestamped observations, so an entry's `scale` means whatever the anchor meant on the day
it was filed. Re-check estimator calibration if you change one, exactly as with archetypes.

### Ingestion

Submitted via a GitHub **Issue Form** (`.github/ISSUE_TEMPLATE/field-report.yml`), triaged
by a maintainer or the `field-report-triager` agent, then merged into this file by PR.
No backend, no third-party form service, contributors keep attribution, and every entry
gets a human sanity check before it can move the estimator.

---

## `glossary.yaml`

Powers site-wide hover tooltips.

| Field | Type | Req | Notes |
|---|---|---|---|
| `term` | string | ✔ | Canonical form |
| `aliases` | array | | Plurals, abbreviations, alternate spellings |
| `short` | string | ✔ | ≤140 chars. **This is the tooltip.** Must stand alone. |
| `long` | string | | Renders on the glossary page |
| `canonical_page` | path | | The concept page that owns this term |
| `level` | enum | ✔ | Beginner terms get more aggressive auto-linking |

---

## `changelog.yaml`

Material changes to the landscape. **Not a release feed** — only entries that change a
recommendation on this site.

| Field | Type | Req |
|---|---|---|
| `date` | date | ✔ |
| `kind` | enum — `model` \| `pricing` \| `limits` \| `tool` \| `site` | ✔ |
| `summary` | string, ≤200 chars | ✔ |
| `affects` | array of plan/model ids | |
| `pages_updated` | array of paths | |
| `source_url` | url | ✔ |

`pages_updated` is the accountability mechanism: a landscape change with no updated pages
is a visible to-do.

---

## Cross-file integrity

> **Changed during M0-T5.** `plans.yaml` originally carried a `models_available` array
> mirroring `models.available_on`. Storing the relationship in both directions guarantees
> the two drift apart, and there is no mechanism that would catch it. The relationship is
> now stored once, on the model, and plan pages derive their model list from it.

Intended to be validated at build, failing the build on violation:

- Every `available_on` value resolves to a real `plan_id`
- Every content page with `plan_id`/`model_id` frontmatter resolves
- Every `field-reports` entry references a valid `plan_id` and `task_archetype`

> **Known gap, found in Themis review during M1-T1/T2 (2026-08-23).** Astro's
> `reference()` only validates at query time (`getEntry`/`getCollection`) — it does not
> automatically walk every entry in a loaded collection. Confirmed by deliberately
> breaking a `models.yaml` → `plans.yaml` reference and observing a clean build with zero
> errors, because no page yet queries the `plans`/`models` collections. **The bullets
> above are the intended contract, not yet an enforced one.** Tracked as a follow-up:
> add an explicit validation script (alongside `check-concepts-neutrality.mjs` /
> `check-examples.mjs` in `scripts/`) that walks every reference and confirms it
> resolves, wired into `npm run ci`. Until that lands, references are only as reliable
> as manual review.
- Every `canonical_page` resolves to a real route
- No orphan data rows — every `plan_id` and `model_id` has a page rendering it
