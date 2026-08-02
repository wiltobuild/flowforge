# Codex kickoff

How to hand this spec to a coding agent without it averaging eleven documents into mush.

---

## The rule

**One task per session. Two or three spec docs, never all eleven.**

An agent given the whole `docs/` directory will produce something that gestures at every
document and satisfies none. Give it the task row, the two or three docs that task actually
depends on, and `AGENTS.md`.

---

## First session

Start with M0-T1. Paste this:

> Read `AGENTS.md` and `docs/07-stack-decisions.md`.
>
> Implement task **M0-T1** from `docs/08-build-plan.md`: initialize the repo with Astro +
> Starlight, TypeScript strict mode.
>
> Scope is only that task. Do not scaffold content collections, components, or pages — those
> are M0-T4 and M0-T8 and will be separate sessions.
>
> The definition of done is the M0-T1 row plus the universal checklist in `AGENTS.md`.
>
> If following the spec produces a worse result, update the spec doc in the same change and
> say what you changed and why.

---

## Doc routing per task

Give each task only what it needs:

| Task | Docs to provide (plus `AGENTS.md`) |
|---|---|
| M0-T1, T2, T10 | `07-stack-decisions` |
| M0-T3, T6, T7, T8 | `06-design-system`, `01-information-architecture` |
| M0-T4, T5, T11 | `02-content-types`, `03-taxonomy`, `04-data-schemas` |
| M0-T9, T12 | `03-taxonomy`, `09-content-ops` |
| M1-T1, T2 | `04-data-schemas`, `00-product-brief` |
| M1-T3, T4, T5, T10 | `02-content-types`, `04-data-schemas`, `00-product-brief` |
| M1-T6, T7, T9, T11 | `05-interactive-specs`, `06-design-system`, `04-data-schemas` |
| M1-T8 | `04-data-schemas`, `05-interactive-specs`, `09-content-ops` |
| M2-* | `01-information-architecture`, `02-content-types`, `05-interactive-specs` |
| M3-* | `03-taxonomy`, `05-interactive-specs`, `02-content-types` |

`00-product-brief` goes in whenever the task involves a judgment call about tone,
recommendation, or what to include — it carries the reasoning behind the constraints.

---

## Rules to restate in every session

Agents drift on these specifically. Repeat them:

1. Static only. No backend, no database, no auth, no secrets.
2. Content is data — never type a number that lives in `src/data/`.
3. `/concepts` names no products.
4. Level is a filter, not a section. Never fork a page by level.
5. Beginners never see per-token pricing.
6. The estimator never shows a point estimate.
7. Zero client JS on non-interactive pages.

---

## Order of operations

Do not reorder these. Each depends on the last:

```
M0 (foundation, enforces every rule)
   ↓
M1 (Plans & Usage — the full vertical slice, data → pages → estimator → contribution loop)
   ↓
M2 (Playbooks + task door)
   ↓
M3 (Prompting, search, glossary)  → v0 launch
   ↓
M4 (Agents, Skills, Tools, Concepts — the sections L3 should write)
```

M1 before any breadth is deliberate. It is the hardest and most differentiating part of the
site, and proving it end-to-end early is worth more than ten half-built sections.

---

## Before starting: unblock these

Three answers are needed and none of them are the agent's to make. See
`docs/10-open-questions.md`.

- **Q1** site name and domain — blocks M0-T10
- **Q3** co-maintainers — blocks `MAINTAINERS.md`
- **Q2** official affiliation — blocks M1-T5

Everything else has a stated default so the build never stalls.

---

## Content before code, for one thing

`docs/09-content-ops.md` §1 — the L3 harvest — should start **now**, in parallel with M0.
It has no code dependency, it seeds four sections at once, and it produces the initial
estimator calibration that M1-T9 needs. It is also the longest-lead item in the whole plan,
because it depends on other people's availability rather than on build progress.

Starting it late is the most likely way this project ships a beautiful, empty site.
