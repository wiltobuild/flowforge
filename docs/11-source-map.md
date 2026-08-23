# 11 — Source map

Where to get the facts for every section of the site, ranked by credibility. Compiled
2026-08-15; re-run the searches behind this doc roughly quarterly, since "current best
source" is itself a volatile fact.

**Rule inherited from `docs/07` ADR-003 and `.claude/agents/data-verifier.md`: pricing and
limits are never sourced from anything below Tier 1.** For conceptual/technique content
(agents, context engineering, evals), Tier 1 vendor engineering blogs are usable as citable
authorities even on `/concepts` pages — they describe general techniques, not products —
but keep the prose itself vendor-neutral per the `agnostic` tag rule; cite the source, don't
adopt the vendor's framing of "how Claude does X" as the neutral explanation.

## Credibility tiers, defined

| Tier | Definition | Use for |
|---|---|---|
| 1 | Official docs/engineering blogs from the vendor the fact is about; standards bodies (OWASP, MCP spec) | Facts, pricing, limits, protocol behavior, techniques |
| 2 | Independent, named, track-record authors; usage-data platforms (not benchmark self-reports) | Cross-checking, "in practice" color, landscape commentary |
| 3 | SEO aggregators, anonymous roundups, sites that reprint each other | Never cite. If it's the only source for a fact, the fact isn't verified yet. |

Tier 3 dominates search results for pricing and tool-comparison queries. Expect to wade
through 5–10 SEO sites per query to find the one or two Tier 1/2 sources underneath.

---

## `/plans` and `/models` — pricing, limits, model specs

Already sourced in the M1-T1/T2 research pass. Summary:

| Fact | Source | Tier | Notes |
|---|---|---|---|
| Claude API pricing, context windows, capabilities | `platform.claude.com/docs/en/about-claude/pricing`, `.../models/overview` | 1 | Fetches cleanly, structured tables, dated change notes |
| Claude consumer plans (Free/Pro/Max/Team) | `claude.com/pricing` | 1 | Does not publish exact quotas — only multipliers (Pro 1x, Max 5x/20x). This is a real fact, not a data gap. |
| OpenAI API pricing | `developers.openai.com/api/docs/pricing` | 1 | Fetches cleanly |
| ChatGPT consumer plans | `chatgpt.com/pricing`, `help.openai.com` | 1 | **Blocked by bot detection on direct fetch (403).** Needs a browser-based fetch or manual check; do not substitute a Tier 3 summary for this. |
| Codex usage bands on ChatGPT plans | `help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan` | 1 | Same 403 issue — retry with browser tooling |
| Cross-checking changes over time | explainx.ai "Claude Usage Limits 2026: every change, dated"; morphllm.com pricing breakdowns | 2 | Both cite official announcements with dates — good for reconstructing `changelog.yaml` entries, not for the numbers themselves |

**Known volatile items to track in `changelog.yaml`:**
- Anthropic's 50%-boosted weekly limit promo expires **2026-08-19** (confirm whether it lapsed or extended again)
- Sonnet 5's $2/$10 pricing was introductory through Aug 31, 2026 and has since been made permanent — the scheduled Sept 1 increase to $3/$15 was cancelled
- OpenAI removed Codex's 5-hour cap on 2026-07-12, described as "temporary" with no end date

---

## `/concepts` — vendor-neutral foundations

Cite these as authorities; keep the page's own prose product-agnostic per `AGENTS.md`.

| Concept | Source | Tier | What to extract |
|---|---|---|---|
| Agent vs. workflow | `anthropic.com/engineering/building-effective-agents` | 1 | The canonical definition: workflows = predefined code paths, agents = LLM dynamically directs its own process. This is *the* source for `/agents/agent-vs-workflow`. |
| Context engineering | `anthropic.com/engineering/effective-context-engineering-for-ai-agents` | 1 | Frames it as the successor to prompt engineering; "what configuration of context is most likely to produce desired behavior" |
| Retrieval / RAG vs. long context | `anthropic.com/engineering/contextual-retrieval` | 1 | Concrete numbers: contextual embeddings + BM25 cut failed retrievals 49%, 67% with reranking — technique is general, citable in a neutral concept page |
| Evals | `anthropic.com/engineering/demystifying-evals-for-ai-agents`; `developers.openai.com/api/docs/guides/evals` + `.../evaluation-best-practices` | 1 | Task selection, grading rubrics, trajectory vs. outcome metrics, LLM-judge calibration. **Volatile note:** OpenAI's own Evals platform goes read-only 2026-10-31, shuts down 2026-11-30 — don't recommend it as a tool without flagging that. |
| Multi-agent orchestration | `anthropic.com/engineering/...` (multi-agent research system post); `claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them` | 1 | Orchestrator-worker pattern; **multi-agent systems use ~15x the tokens of single-chat** — genuinely useful, citable stat for the site's own quota-focused framing, and a good anti-pattern warning for `/agents/failure-modes` |
| Prompt injection / agent security | OWASP GenAI Security Project, `genai.owasp.org` | 1 | Standards body — the correct top citation for `/reference/security`. Distinguishes direct (jailbreak) from indirect (injected via external content) attacks. |
| Cross-vendor commentary, terminology | Simon Willison, `simonwillison.net` | 2 | Explicitly vendor-neutral, named author with a long track record; coined "prompt injection" and "agentic engineering." Good for concept-page color and terminology grounding, not for hard facts. |

---

## `/agents` — profiles, subagents, failure modes

| Topic | Source | Tier | Notes |
|---|---|---|---|
| Agent vs. workflow (again — this is the section's spine page) | `anthropic.com/engineering/building-effective-agents` | 1 | Same source as the concept page; the `/agents` version can go deeper into implementation patterns |
| Claude Code subagents | `code.claude.com/docs` (subagents, best practices) | 1 | Product-specific — cite in `/tools/claude-code` and the "in practice" section of `/agents/subagents`, not in the vendor-neutral parts |
| OpenAI Agents SDK | `developers.openai.com/learn/agents`; `openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents` | 1 | Product-specific — same treatment |
| Orchestration patterns (fan-out, pipeline, judge panel) | Anthropic multi-agent research post (above) | 1 | The ~15x token multiplier and "early iterations spawned excessive subagents for simple queries" observation are both directly usable in `/agents/failure-modes` |

---

## `/skills`

| Topic | Source | Tier | Notes |
|---|---|---|---|
| What a skill is, file structure | `anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills` | 1 | Official launch post — SKILL.md format, scripts/references/assets structure |
| Working examples | `github.com/anthropics/skills` | 1 | 17 open-sourced official skills — primary source for the `/skills/gallery` |

---

## `/tools` — MCP, Claude Code, Codex, and the landscape comparison

| Topic | Source | Tier | Notes |
|---|---|---|---|
| MCP protocol spec | `modelcontextprotocol.io/specification/2026-07-28`; `blog.modelcontextprotocol.io` | 1 | Genuinely multi-vendor governance at this point, not Anthropic-only — safe to treat as a neutral protocol source even on `/concepts`-adjacent pages |
| Claude Code | `code.claude.com/docs` | 1 | Official, product-specific |
| Codex / OpenAI agent tooling | `developers.openai.com` | 1 | Official, product-specific |
| Tool landscape comparison (Cursor/Copilot/Claude Code/Codex) | sitepoint.com, builtin.com, daily.dev, nxcode.io comparisons | 2–3 | **Handle with care.** These are full of specific-sounding numbers (SWE-bench %, adoption %) that are unverifiable, self-reported, or already stale by the time they're read — exactly the failure mode `docs/00` bans benchmark tables for. Use them only for qualitative texture ("people commonly run more than one tool and switch by task"), never for a number that would go in `models.yaml`. |

---

## `/prompting`

| Topic | Source | Tier | Notes |
|---|---|---|---|
| Prompt engineering fundamentals | `docs.claude.com` prompt engineering section; `claude.com/blog/best-practices-for-prompt-engineering` | 1 | Structured like a dev cycle: define good output → build tests → write/structure prompt → add context → iterate |
| Agentic coding workflow patterns | `code.claude.com/docs/en/best-practices` | 1 | Explore→Plan→Implement; context window as the scarce resource; Writer/Reviewer pattern with fresh context for review |
| OpenAI-side prompting guidance | Not yet located as a single canonical doc — **gap, needs a follow-up search** | — | Don't substitute a Tier 3 roundup; flag as open until found |

---

## `/reference/security`

| Topic | Source | Tier | Notes |
|---|---|---|---|
| Prompt injection, agent security | `genai.owasp.org` (OWASP GenAI Security Project) | 1 | The correct top-line citation. Recommends defense-in-depth: least-privilege tooling, input/output filtering, human approval on high-risk actions, adversarial testing — maps directly onto playbook "decision points" sections. |

---

## Known gaps (don't fill with Tier 3 — leave open until a real source is found)

- OpenAI's own canonical prompting-guide page (as distinct from blog posts about it)
- Official ChatGPT consumer-plan and Codex-limits pages are 403-blocking automated fetches — needs a browser-based check, not a workaround with weaker sources
- No Tier 1 source exists for "how much of my subscription window does X consume" for either provider — confirms the field-reports layer is genuinely irreplaceable, not just a nice-to-have (see `docs/09` §1, the L3 harvest)

## How this feeds the build

- `page-drafter` and `data-verifier` (`.claude/agents/`) should check this file before searching from scratch
- Re-verify this map roughly quarterly — "best current source" is itself the kind of fact that goes stale, same as pricing
- When a gap above gets filled, or a 403 gets resolved, update this file in the same change (per `AGENTS.md`: spec and reality move together)
