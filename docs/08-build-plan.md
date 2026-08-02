# 08 — Build plan

Sized for handing one task at a time to a coding agent. Each task names its deliverable,
dependencies, and definition of done. The universal DoD in `AGENTS.md` applies to every
task on top of what's listed here.

**Sequencing principle:** M1 is a full vertical slice — data → pages → interactive →
contribution loop — before any breadth. Proving the hardest part end-to-end early is worth
more than having ten half-built sections.

---

## M0 — Foundation

*Goal: an empty site that already enforces every rule.*

| ID | Task | Depends | Done when |
|---|---|---|---|
| M0-T1 | Init repo, Astro + Starlight scaffold, TS strict | — | Dev server runs, production build clean |
| M0-T2 | Add `LICENSE` (MIT), `LICENSE-CONTENT` (CC BY 4.0), `CODE_OF_CONDUCT.md` | T1 | Present and linked from README |
| M0-T3 | Design tokens + light/dark theming per `docs/06` | T1 | AA contrast verified both themes; no hard-coded colors |
| M0-T4 | Content collection schemas for all 10 types per `docs/02`, `docs/03` | T1 | Invalid frontmatter fails the build with a useful message |
| M0-T5 | Data file schemas + cross-file integrity checks per `docs/04` | T4 | Broken `plan_id` reference fails the build |
| M0-T6 | Level toggle component | T3 | Persists, no layout shift, keyboard operable, collapses rather than removes |
| M0-T7 | Site shell: sidebar order per `docs/01`, TOC, mobile drawer | T3 | Verified at 375/768/1280 |
| M0-T8 | Core components: card, badges (quota, staleness, status), copy block, next-links | T3 | Each has empty/error states; `next` missing fails validation |
| M0-T9 | CI: build, schema validation, internal link check, a11y scan | T4 | Runs on PR, blocks merge on failure |
| M0-T10 | Deploy pipeline to static host, preview builds on PR | T1 | Live URL; PR previews working |
| M0-T11 | One complete, schema-valid copy-paste example per content type in `docs/examples/` | T4 | All 10 validate; `CONTRIBUTING.md` links to them |
| M0-T12 | Issue templates: field report, suggest a prompt, page is wrong, data is stale | T1 | All four render in the GitHub UI |

**M0 exit:** an empty site that cannot accept a badly-formed page.

> M0-T11 matters more than it looks. Most contributors will not read the schema — they will
> copy the example. If the example is wrong, every page derived from it is wrong.

---

## M1 — Plans & Usage (the vertical slice)

*Goal: the section that answers the audience's loudest question, complete with its
contribution loop.*

| ID | Task | Depends | Done when |
|---|---|---|---|
| M1-T1 | Author `plans.yaml` with entry tiers + free tiers, all fields verified against provider pages | M0-T5 | Every entry has `source_url`, `last_verified`, `confidence` |
| M1-T2 | Author `models.yaml` for models available on those plans | M1-T1 | Cross-file integrity passes; no benchmark fields |
| M1-T3 | `plan` content pages | M1-T1 | Follows type template; "How the limits feel" section written in plain language |
| M1-T4 | `model` content pages | M1-T2 | Qualitative profiles only; API pricing advanced-gated |
| M1-T5 | **`/plans/start-here`** — the beginner page | M1-T3 | Three paragraphs, one recommendation, no token math, two-sided |
| M1-T6 | Plan Picker component per `docs/05` §2 | M1-T5 | Shows reasoning, permalink-able, keyboard operable |
| M1-T7 | Comparison matrix per `docs/05` §4 | M1-T2 | No body horizontal scroll; stacks on mobile; empty state |
| M1-T8 | Field report issue form + `field-reports.yaml` + rendered view | M0-T5 | Submission → triage → merge → renders, end to end |
| M1-T9 | **Quota estimator** per `docs/05` §1 | M1-T8 | Ranges only; confidence states incl. "not enough data"; a11y live region |
| M1-T10 | `usage/` prose pages: how-limits-work, what-burns-quota, stretching-your-plan | M1-T3 | Each links into the estimator |
| M1-T11 | `/plans/api/` advanced-gated token pricing + dollar calculator | M1-T2 | Invisible at beginner level |
| M1-T12 | `changelog.yaml` + rendered feed | M0-T5 | Renders; `pages_updated` surfaced |

**M1 exit:** a beginner can pick a plan, estimate a task, and submit a report — and their
report changes the estimate.

---

## M2 — Playbooks + task door

| ID | Task | Depends | Done when |
|---|---|---|---|
| M2-T1 | Playbook collection + type template | M0-T4 | Validates |
| M2-T2 | Six playbooks: plan-a-project, write-a-spec, ship-a-feature, debug-with-ai, research-a-topic, build-an-agent | M2-T1 | Every step has a quota badge and min-plan; steps link out |
| M2-T3 | Task door component per `docs/05` §6 | M2-T2 | Type-ahead + browsable list + useful empty state |
| M2-T4 | Homepage composition per `docs/01` | M2-T3 | Task door above the fold; no marketing hero |
| M2-T5 | Decision tree component + first two trees | M0-T8 | Deep-linkable nodes; static fallback list rendered |

---

## M3 — Prompting library, search, glossary

| ID | Task | Depends | Done when |
|---|---|---|---|
| M3-T1 | Prompt collection + 25–30 entries | M0-T4 | Variables marked; every entry has "When it fails" |
| M3-T2 | Pattern collection + anti-patterns | M0-T4 | `kind` field respected in rendering |
| M3-T3 | Pagefind search + facets per `docs/05` §7 | M0-T4 | Cmd-K; facets in specified order; drafts de-ranked |
| M3-T4 | `glossary.yaml` + tooltip system per `docs/05` §5 | M0-T8 | Focus-reachable, Escape-dismissible, no linking in code blocks |
| M3-T5 | `/sitemap` browsable fallback page | M3-T3 | Complete without JS |
| M3-T6 | `/start/` orientation + three role paths | M2-T2 | Each path ends in a playbook |

**M3 exit — v0 launch.** Three sections deep, not ten thin.

---

## M4 — Breadth (post-launch)

Agents, Skills, Tools, Concepts, Reference, Showcase. Roughly in that order — it matches
what L3 will contribute most readily.

| ID | Task | Notes |
|---|---|---|
| M4-T1 | `agent-profile` collection sourced from `.claude/agents/` | Build tooling and published content stay identical — the dogfooding payoff |
| M4-T2 | `/agents/agent-vs-workflow` + orchestration patterns | Highest-value page in the section |
| M4-T3 | Skills section + gallery | |
| M4-T4 | `/tools/landscape` + per-tool pages | Two-sided; enforce neutrality review |
| M4-T5 | `/concepts/` core pages | **Neutrality rule enforced by the `agnostic` tag validation** |
| M4-T6 | `/reference/` glossary page, cheatsheets, templates, security | |
| M4-T7 | `/cohort/` showcase, FAQ, contribute, maintainers | |
| M4-T8 | Staleness report + maintenance dashboard | Lists everything past its verify window |

---

## Task handoff format

When handing a task to a coding agent, give it exactly this:

1. The task ID and row from this document
2. The relevant spec docs (usually two or three, not all eleven)
3. `AGENTS.md`
4. The instruction to update the spec doc in the same PR if the spec turns out to be wrong

Do not hand over the whole `docs/` directory for a single task. Precision beats context
volume, and an agent given eleven documents will average them instead of following them.

---

## What "v0 launch" means

M0 + M1 + M2 + M3. Explicitly **not** including Agents, Skills, Tools, or Concepts.

Launching with four excellent sections and visible "coming soon" markers beats launching
with ten thin ones. The sections held back are also the ones L3 is best positioned to
write — leaving them open is a recruitment mechanism, not a gap.
