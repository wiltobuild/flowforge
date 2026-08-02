# FlowForge

A public, open-source reference site for people learning to build with AI agents.
Built by and for the Pursuit Native AI Building cohort (~70 in L1, ~60 in L3), designed
to outlive any single maintainer.

> **Housekeeping:** the working directory is still named `cohort-compass`. Everything
> *inside* the repo has been renamed; the folder and any git remote have not. Rename them
> before the first commit.

## Status

**Specification complete. M0 in progress — 7 of 12 tasks done.**

The build runs clean (`npm run build` → `astro check` 0 errors/0 warnings, 12 pages).
Scaffold, design tokens, content and data schemas, the level toggle, and the site shell
are in place. All five data files in `src/data/` are deliberately empty — seeding them
before human verification would put unverified pricing on a site whose premise is being
trustworthy about pricing.

Still open in M0: core components (M0-T8), CI (M0-T9), deploy (M0-T10), the ten
copy-paste examples in `docs/examples/` (M0-T11), and the GitHub issue templates
(M0-T12). There is no `.github/` directory yet, which is what blocks T9 and T12 — and
the field-report form that M1-T8 depends on.

**Starting the build?** Read [`docs/CODEX-KICKOFF.md`](docs/CODEX-KICKOFF.md) — it has the
first prompt, which spec docs to give each task, and the questions that need answering
before M0 can finish. Q1 (name) is settled; Q2 (affiliation) and Q3 (co-maintainers) are
not.

## What this site is

Two front doors onto the same body of content:

1. **Browse** — "I want to understand agents" → topic hierarchy
2. **Task** — "I need to plan a project with AI" → playbook that assembles across topics

Depth is a **filter**, not a section. One page serves beginner through advanced via a
global level toggle, rather than maintaining parallel beginner/advanced trees.

## What makes it different

Most AI reference sites are organized around API tokens and benchmark scores. This one is
organized around **subscriptions and quota**, because that is what the audience actually
uses and actually worries about. The flagship feature is a quota estimator calibrated from
real usage reports submitted by the cohort — data that does not exist anywhere else.

## Reading order for whoever picks this up

| Doc | What it settles |
|---|---|
| [00-product-brief](docs/00-product-brief.md) | Audience, goals, non-goals, success criteria |
| [01-information-architecture](docs/01-information-architecture.md) | Sitemap, URLs, navigation, the level toggle |
| [02-content-types](docs/02-content-types.md) | The 10 page templates |
| [03-taxonomy](docs/03-taxonomy.md) | Tag axes and controlled vocabularies |
| [04-data-schemas](docs/04-data-schemas.md) | plans, models, glossary, field reports, changelog |
| [05-interactive-specs](docs/05-interactive-specs.md) | Estimator, decision trees, matrix, search, tooltips |
| [06-design-system](docs/06-design-system.md) | Components, badges, a11y, responsive rules |
| [07-stack-decisions](docs/07-stack-decisions.md) | Stack choices and the reasoning behind each |
| [08-build-plan](docs/08-build-plan.md) | Milestones and discrete tasks |
| [09-content-ops](docs/09-content-ops.md) | Seeding, ownership, staleness, contribution |
| [10-open-questions](docs/10-open-questions.md) | Decisions still needed from the owner |
| [CODEX-KICKOFF](docs/CODEX-KICKOFF.md) | How to hand tasks to a coding agent |

Agent and contribution conventions live in [`AGENTS.md`](AGENTS.md),
[`CONTRIBUTING.md`](CONTRIBUTING.md), and [`.claude/agents/`](.claude/agents/).

## Dogfooding

The repo is built using the practices the site teaches, and ships them as artifacts:
spec-first development, an `AGENTS.md` contract, and reusable agent profiles in
`.claude/agents/`. Those agent files are simultaneously build tooling and published
content — they appear on the site under `/agents/profiles/`. If a practice is good enough
to teach, it should be visible in this repository.

## License

Code MIT. Content CC BY 4.0. See `LICENSE` and `LICENSE-CONTENT` (to be added at M0).
