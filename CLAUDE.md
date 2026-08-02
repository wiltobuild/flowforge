# CLAUDE.md

The build contract for this repository lives in [`AGENTS.md`](AGENTS.md). Read it first —
it is tool-agnostic and applies equally to Claude Code, Codex, and human contributors.

This file holds only the Claude-specific additions.

## Agent profiles

Reusable subagents are defined in [`.claude/agents/`](.claude/agents/). Use them rather
than re-deriving the same instructions:

| Agent | Use it when |
|---|---|
| `page-drafter` | Drafting a new content page from its type template |
| `content-auditor` | Checking frontmatter, tag validity, and template conformance |
| `data-verifier` | Re-verifying plan/model facts against provider sources |
| `field-report-triager` | Turning submitted usage reports into calibration data |

These files are dual-purpose: they are working build tooling **and** published site
content under `/agents/profiles/`. Keep them well-written and well-commented — people will
read them as examples of how to write an agent profile.

## Notes for Claude specifically

- Prefer editing existing content files over creating new ones. The content set is
  deliberately bounded by the collection schemas.
- When adding a fact about Claude plans, models, or Claude Code, apply the same neutrality
  standard used for every other vendor. This site is tool-agnostic in `/concepts` and
  honest in `/plans`. Do not soften the tradeoffs.
- Do not fetch live pricing during a build. Pricing is human-verified — see
  `AGENTS.md` → "Explicitly out of scope."
