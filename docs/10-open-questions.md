# 10 — Open questions

Decisions the spec deliberately leaves open. Each names who should decide and what is
blocked until they do. Anything not blocking has a stated default so the build never stalls
waiting on an answer.

---

## Blocking

### Q1 — Site name and domain

**Name: decided — FlowForge.** Replaces the `cohort-compass` working name throughout the
repo, including the `cc-` CSS/storage prefix, which is now `ff-`. The name deliberately
does not contain "Pursuit" or "cohort", so it carries no implication of official
affiliation (see Q2) and stays accurate if the audience outgrows the cohort.

**Domain: still open.** `astro.config.mjs` carries `https://flowforge.example` as a
placeholder because the sitemap integration warns without a `site` value and AGENTS.md
requires zero-warning builds. Replace it with the real domain before deploy.

Two follow-ups the domain decision needs to settle: whether the GitHub org/repo path
matches the domain, and whether the cohort or Pursuit wants branding input on it.

**Still blocks:** M0-T10 (deploy). **Decide by:** M0.

### Q2 — Official affiliation

Is this an independent project by cohort members, or does it carry any Pursuit
endorsement? This changes the footer, the README framing, and how careful the plan
recommendations need to be about appearing to speak for the program.

**Blocks:** M1-T5 (the beginner recommendation page). **Decide by:** M1.
**Default if unanswered:** independent, with an explicit "not affiliated" note.

### Q3 — Co-maintainers

`docs/09` requires two to three named co-maintainers from the start, ideally spanning L1
and L3. This is the succession plan; without it the project has an expiry date.

**Blocks:** `MAINTAINERS.md` completion. **Decide by:** M0.

---

## Non-blocking, with defaults

### Q4 — Which plans to cover at launch

Spec assumes the two $20 entry tiers plus free tiers. Adding more (Gemini, Copilot, Cursor
subscriptions) multiplies verification burden and thins field-report data per cell.

**Default:** launch with the two entry tiers + free. Add others only when someone
volunteers as that plan's data owner. **Revisit:** post-launch.

### Q5 — Third-party form for field reports

ADR-006 uses GitHub Issue Forms, which requires a GitHub account. If submission volume is
the bottleneck, that's the constraint to revisit first.

**Default:** GitHub Issue Forms. **Revisit:** if M1 exit yields fewer than 20 reports in
three weeks.

### Q6 — Showcase consent

Cohort projects appear at `/cohort/showcase/`. Public site, real names, real project links.

**Default:** opt-in only, explicit written consent per entry, contributor can request
removal at any time. Do not publish anyone's work without asking, and do not include
employer or client project details.

### Q7 — How opinionated should the plan recommendation be?

`docs/00` commits to an opinionated recommendation with visible reasoning. The open
question is tone — "most people should buy X" versus "here's how to choose."

**Default:** lead with a clear recommendation for the common case, immediately followed by
the honest runner-up and its tradeoff. Beginners need a decision; credibility needs the
reasoning. **Owner to confirm** at M1-T5.

### Q8 — Analytics

ADR-008 rules out individual tracking. Whether to run aggregate hosting analytics at all is
open.

**Default:** aggregate hosting analytics only, or nothing. Never a third-party script.

### Q9 — Should agent profiles cover non-Claude harnesses at launch?

`.claude/agents/` is the dogfooding source. Codex and other harnesses use different
formats.

**Default:** ship Claude-format profiles as the canonical source in M4, with an equivalent
Codex-format export where the mapping is clean. Do not hand-maintain two copies of the same
profile — generate or link.

### Q10 — Estimator multiplier derivation

`docs/05` specifies multipliers for sparse field-report cells, with derivations documented
in a constants file. The initial values must come from somewhere.

**Default:** seed from L3 harvest (`docs/09` §1) and mark the estimator low-confidence
across the board until real report volume arrives. Being visibly uncertain is correct here;
a confident wrong number is the worst outcome.

---

## Explicitly not open

Recorded so they don't get relitigated mid-build:

- No backend (ADR-005)
- No benchmark score tables (`docs/00`)
- No scraped pricing (ADR-003)
- Level is a filter, not a section (`docs/01`)
- `/concepts` names no products (`docs/03`)
- Estimator never shows a point estimate (`docs/05`)

If one of these needs to change, it needs a written argument and a spec update — not a
quiet exception in a PR.
