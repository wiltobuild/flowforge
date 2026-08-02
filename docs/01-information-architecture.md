# 01 — Information architecture

## Two front doors

Every piece of content is reachable two ways. Build both; most sites only build the first.

- **Browse door** — topic hierarchy in the sidebar. For "I want to understand X."
- **Task door** — a picker on the homepage: *"I need to ___"* → playbook. For "I need to do X."

The task door is the differentiator. It is powered by the `task` tag axis, not by a
separate content set.

## Sitemap

```
/                          homepage: task door + level toggle + 3 entry cards

/start/
  what-this-is
  paths/                   builder · operator · strategist
  first-week
  how-to-use-this-site

/plans/                    ← money + capability. NOT "models".
  start-here               THE beginner page. one decision, three paragraphs.
  what-you-get/
    claude-pro
    chatgpt-plus
    free-tiers
  usage/
    how-limits-work        reset windows; hard stop vs quality demotion
    what-burns-quota       ranked list of expensive habits
    stretching-your-plan   tactics that cut consumption
    estimator              ← flagship interactive
    field-reports          ← crowdsourced, the unfair advantage
  models/
    picking-a-model        decision tree, quota-weighted
    [provider]/[model]     one page per model
  upgrading                when higher tiers actually pay off
  api/                     ADVANCED-GATED. token pricing, dollar calculator.
  changelog

/concepts/                 ← VENDOR-NEUTRAL. no product names. enforced.
  foundations/             tokens · context windows · sampling · why it hallucinates
  context-engineering/
  tool-use/
  agentic-loops/
  memory-and-state/
  retrieval/               RAG vs long context · embeddings · chunking
  evals/
  economics/               how token cost becomes quota cost

/prompting/
  fundamentals
  patterns/                by technique
  library/                 by situation ← volume section
  anti-patterns/

/skills/
  concept                  what a "skill" is, generally
  authoring
  gallery/
  claude-skills            product-specific

/agents/
  agent-vs-workflow        the highest-value page in this section
  profiles/                the library — sourced from .claude/agents/
  subagents
  orchestration/           fan-out · pipeline · judge panel · adversarial verify
  failure-modes/

/tools/
  landscape                honest comparison of IDEs / CLIs / chat apps
  choosing-your-stack
  mcp/
  claude-code/
  codex/
  cursor/ · copilot/ · ...

/playbooks/                ← the task door's destination
  plan-a-project
  write-a-spec
  research-a-topic
  ship-a-feature
  debug-with-ai
  review-code
  build-an-agent
  automate-a-workflow
  collaborate-on-ideas

/reference/
  glossary
  cheatsheets/
  templates/               downloadable starter files
  troubleshooting
  security                 injection · secrets · what not to paste

/cohort/
  showcase/
  faq
  contribute
  maintainers
```

## Navigation priority

Sidebar order is deliberate and reflects what people actually need, most-first:

1. Start Here
2. **Plans** (elevated — it answers the loudest question)
3. Playbooks
4. Prompting
5. Agents
6. Skills
7. Tools
8. Concepts
9. Reference
10. Cohort

Note that Concepts sits low despite being foundational. People arrive with a task, not a
curiosity. Concept pages are reached via inline links and the glossary far more often than
via the sidebar.

## URL conventions

- Lowercase, hyphenated, no trailing slash inconsistency — pick one and enforce in config.
- Path mirrors the content collection: `/agents/profiles/code-reviewer`.
- Model pages: `/plans/models/{provider}/{model-slug}`.
- Never encode level in the URL. Level is a filter, not a location. `/concepts/tokens` is
  the same URL for a beginner and an expert.
- URLs are permanent. Add a redirect map from M1 onward; never break an inbound link.

## The level toggle

Global control, persisted in `localStorage`, defaults to **beginner**.

**Semantics:**

- `beginner` — analogies, warnings, the recommendation. No token math, no API pricing, no
  jargon without a tooltip.
- `intermediate` — mechanics, tradeoffs, configuration, quota tactics.
- `advanced` — edge cases, token economics, failure modes, orchestration internals, API.

**Rules:**

- One page serves all three. Never fork a page by level.
- Content above the current level is **collapsed, not deleted**, with a visible affordance
  ("Show advanced detail"). Hiding it entirely makes people feel gatekept and breaks
  in-page search and deep links.
- Whole pages may carry a minimum level (`/plans/api/*` is advanced-only). These appear
  greyed in the sidebar with a hint, not hidden — beginners should see that depth exists.
- Deep links to collapsed content auto-expand and temporarily raise the toggle.
- The toggle must not cause layout shift on load. Resolve before first paint.

## Cross-linking rules

- **Concept → Tool:** concept pages link down to product-specific implementations in an
  "In practice" section. Never the reverse direction as the primary explanation.
- **Playbook → everything:** playbooks are assemblies. Each step links to the concept,
  prompt, or agent profile it uses.
- **Every page ends with 2–3 "Next" links.** Zero dead ends. This is checked in review.
- **Glossary terms auto-link on first use per page** via the tooltip system (`docs/05`).
- Related-content blocks are generated from shared tags, then hand-curated where the
  automatic result is poor. Do not ship purely automatic "related" lists — they are noise.

## Homepage composition

Above the fold, in order:

1. One-sentence statement of what this is
2. **Task door** — a prominent "I need to ___" picker
3. Level toggle, visibly explained
4. Three entry cards: *New here* → `/start`, *What should I buy?* → `/plans/start-here`,
   *Estimate a task* → `/plans/usage/estimator`
5. Recent field reports and changelog entries — proof of life

No hero image, no marketing copy, no scroll-jacking.
