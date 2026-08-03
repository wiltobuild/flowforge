# 07 — Stack decisions

Recorded as decisions with reasoning, so whoever inherits this knows what is load-bearing
and what is arbitrary. Reversing a decision is fine — reversing it without reading the
context is not.

Every decision here is filtered through one constraint: **a stranger must be able to fork
this and deploy it with zero configuration.** That is the succession plan.

---

## ADR-001 — Astro with Starlight

**Decision:** Build on Astro using the Starlight docs framework.

**Why:** Sidebar navigation, search integration, dark mode, mobile layout, and a11y
defaults ship out of the box, so effort goes into content and the interactive pieces
rather than chrome. Astro's islands model means content pages ship zero JavaScript while
the estimator and decision trees stay fully interactive. Content is plain Markdown/MDX, so
a non-developer classmate can contribute by editing a file in the GitHub web UI.

**Consequences:** Inherits Starlight's layout opinions; custom pages (estimator, matrix,
homepage) are built as standard Astro pages alongside the docs shell. Accept the framework
defaults unless there is a specific reason not to.

**Alternatives considered:** Docusaurus (heavier, React-only, more client JS); Next.js
(more power, far more maintenance burden for a handoff project); plain Astro without
Starlight (rebuilding nav/search/theming by hand for no gain).

---

## ADR-002 — Typed content collections, validation blocks the build

**Decision:** Every content collection has a schema derived from `docs/02` and `docs/03`.
Schema violations fail the build.

**Why:** With ~130 potential contributors, the schema is the only thing keeping the site
coherent. Warnings get ignored. A build failure is a teaching moment that costs the
maintainer nothing.

**Consequences:** Contributors will hit validation errors. Error messages must be
genuinely helpful and `CONTRIBUTING.md` must show a complete valid example per type.

---

## ADR-003 — Human-verified YAML data, never scraped

**Decision:** `plans.yaml`, `models.yaml`, etc. are hand-maintained. No build-time fetching
of provider pricing.

**Why:** Provider pricing pages have no stable machine format. Scraping them is brittle in
the specific way that matters most here — it fails silently and publishes wrong numbers
under the site's own authority. Wrong pricing on a site people trust for pricing is the
fastest possible credibility loss. Human verification with a visible date is slower and
far safer.

**Consequences:** Someone must periodically re-verify. Mitigated by the staleness system
(`docs/03`), the `data-verifier` agent, and per-field `confidence` markers.

---

## ADR-004 — Pagefind for search

**Decision:** Static, build-time search index with client-side querying.

**Why:** No server, no API key, no per-query cost, works on any host, scales fine to the
low thousands of pages this site will reach. Integrates with Starlight.

**Consequences:** Index ships to the client — keep an eye on its size as content grows.
Faceted filtering over the tag axes may need custom work on top; budget for it in M3.

---

## ADR-005 — Static hosting, no backend, ever

**Decision:** Deploy as static files. Cloudflare Pages, Netlify, or GitHub Pages — any of
them, chosen by whoever holds the account.

**Why:** Zero running cost, zero secrets, zero operational burden. Anyone can fork and
deploy in minutes, forever. This single constraint is what makes the handoff plan real
rather than aspirational.

**Consequences:** Rules out anything needing server state — user accounts, saved progress,
live form submission, server-side personalization. Design around it (see ADR-006). Do not
relitigate this to add one feature. Choosing GitHub Pages also trades away per-PR preview
deployments; Cloudflare Pages and Netlify provide them.

---

## ADR-006 — Field reports via GitHub Issue Forms

**Decision:** Usage reports are submitted as structured GitHub issues, triaged, then merged
into `field-reports.yaml` by PR.

**Why:** Satisfies ADR-005 with no third-party form service and no PII handling.
Contributors keep public attribution, which motivates submission. Human triage sits between
raw submissions and the estimator, so bad data can't silently skew results.

**Consequences:** Requires a GitHub account to submit, which excludes some people. Accepted
tradeoff for a technical cohort. If submission volume proves to be the bottleneck, revisit
with a form that files issues via a GitHub App — still no backend of our own.

---

## ADR-007 — Dual license: MIT code, CC BY 4.0 content

**Decision:** `LICENSE` (MIT) for code, `LICENSE-CONTENT` (CC BY 4.0) for prose and data.

**Why:** Unambiguous for a public open-source project, standard enough that contributors
don't have to think about it, and permissive enough that the site can genuinely outlive the
founder — anyone can fork and continue it.

**Consequences:** Contributions are accepted under these terms; state that in
`CONTRIBUTING.md`. Third-party content (quotes, screenshots) must be attributed and used
within fair use — do not paste provider documentation wholesale.

---

## ADR-008 — No individual-level analytics, no consent banner

**Decision:** No tracking scripts, no cookies requiring consent. Aggregate, privacy-
preserving hosting analytics only, or nothing.

**Why:** The audience includes people learning what not to paste into AI tools; modelling
good data hygiene is part of the site's credibility. It also removes an entire category of
compliance work and lets the site load without a consent interstitial.

**Consequences:** Less precise usage data. Success criteria in `docs/00` are chosen to be
measurable without it.

---

## ADR-009 — Mermaid for diagrams

**Decision:** Diagrams authored as Mermaid in Markdown. Hand-authored SVG only where
Mermaid genuinely can't express the idea.

**Why:** Diffable in review, contributable without design tools, themeable for dark mode.

**Consequences:** Some diagrams will be less pretty than bespoke SVG. Worth it. Every
diagram needs a text equivalent regardless (`docs/06`).

---

## ADR-010 — TypeScript strict

**Decision:** Strict mode on, `any` requires a justifying comment.

**Why:** The schema layer is the site's integrity guarantee; types are how it's enforced at
authoring time rather than at build time.

---

## Deliberately deferred

Not decided now, because deciding early would be guessing:

- i18n / translations
- Versioned docs
- A public API over the data files (plausible later — the data is genuinely useful; would
  mean publishing generated JSON, still static)
- RSS for the changelog (easy, add when the changelog has content worth subscribing to)
