# 00 — Product brief

## The problem

People learning to build with AI agents are drowning in two ways at once. Beginners can't
tell which of forty tools matters or what anything costs them. Intermediates can't find
concrete patterns without wading through marketing. And everyone on a $20 subscription
shares one unanswered question: **how much of my plan will this task eat, and will I get
cut off halfway through?**

Nobody publishes reliable answers to that last question. Providers won't commit to numbers.
Bloggers guess. The real answer depends on context size, tooling, and model — which means
it can only come from people actually running the work.

## Audience

| Segment | Size | State | Primary need |
|---|---|---|---|
| L1 cohort | ~70 | Halfway through L1 | Orientation, "what do I even buy", first playbooks |
| L3 cohort | ~60 | Advanced, building | Patterns, agent orchestration, quota efficiency |
| Public | unbounded | Unknown | Whatever they landed on from search |

L3 is both an audience **and** the primary content source. They have already solved what
L1 is about to hit. Design every contribution path with L3 in mind.

## Goals

1. A beginner can decide what to buy and start building in one session, without reading
   about tokens.
2. An advanced user finds a specific pattern or agent profile in under 30 seconds.
3. Anyone can estimate whether a task fits inside their subscription before starting it.
4. The site keeps improving without the original author, via contributions and named
   ownership.
5. The site itself is a credible demonstration of the practices it teaches.

## Non-goals

- **Not a tutorial series.** It is a reference. Playbooks are recipes, not courses.
- **Not a news site.** The changelog records material changes, not every release.
- **Not a benchmark aggregator.** See below.
- **Not a walled garden.** No login, no gating, no members-only content.
- **Not a replacement for provider documentation.** It links out and stays honest about that.

## Deliberate decision: no benchmark score tables

Numeric benchmark tables are excluded on purpose. They go stale within weeks, they are
gameable, maintaining them is a permanent tax, and — most importantly — they do not answer
the question this audience has. Single-turn preference scores in particular correlate
poorly with agentic reliability, which is the only mode most of this audience works in.

Instead, model pages carry **qualitative "best at / weak at" profiles** plus a small number
of clearly-attributed external signals with links out. Qualitative profiles age far better
and are more decision-useful.

## Positioning: subscriptions, not API tokens

This is the central design commitment and it shapes the whole site.

The audience overwhelmingly works on consumer subscriptions, not API keys. For them cost is
not measured in dollars per million tokens — it is measured in **quota**, and the failure
mode is being cut off mid-task. Therefore:

- `/plans` is the primary money-and-capability section, not `/models`.
- The flagship interactive tool is a **quota estimator**, not a dollar calculator.
- Every playbook step and every model page carries a **quota weight** badge.
- API token pricing exists but is gated behind the advanced level toggle.

## Positioning: tool-agnostic core, tool-specific leaves

Cohort members use whatever they want. The site must not read as an advertisement for one
vendor while still giving beginners a real recommendation.

- `/concepts` is vendor-neutral. No product names. Enforced by review.
- `/tools` and `/plans` name products freely and compare them honestly, two-sidedly.
- The beginner recommendation toward a paid plan is framed as an **opinionated
  recommendation with visible reasoning**, alongside what free tiers can genuinely do.
  This is both more persuasive and what keeps the site credible to outside readers.

## Success criteria

Measure these at 60 days post-launch:

| Criterion | Target |
|---|---|
| Beginner can pick a plan unaided | Verified by 5 unmoderated L1 walkthroughs |
| Estimator used | Most-visited interactive page |
| Field reports submitted | 40+ from across both cohorts |
| Contributors other than the founder | 10+ merged |
| Pages with a named owner | 100% |
| Volatile pages past their verify window | 0 |

The last two are the survival metrics. A site with unowned, stale pages is already dead;
it just hasn't been noticed yet.

## Primary risks

| Risk | Mitigation |
|---|---|
| Model/plan data goes stale, credibility collapses | Single data source, visible verify dates, automatic staleness banners, links to provider pages |
| Site dies at graduation | Co-maintainers from day one, `MAINTAINERS.md`, per-page ownership, zero-config fork-and-deploy |
| Thin coverage everywhere | v0 ships three sections deeply rather than ten thinly |
| Reads as a vendor ad | Neutrality rule in `/concepts`, two-sided plan comparison, honest free-tier coverage |
| Estimator implies false precision | Ranges not point estimates, visible sample sizes, low-confidence states |
| Nobody contributes | Adopt-a-page with named owners, content sprints, non-dev contribution path via GitHub issue forms |
