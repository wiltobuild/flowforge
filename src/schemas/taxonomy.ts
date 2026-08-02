// Astro 7 ships Zod 4 and deprecates the `z` re-export from astro:content.
// Import zod directly; `reference()` still comes from astro:content.
import { z } from 'zod';

/**
 * Controlled vocabularies. Source of truth: docs/03-taxonomy.md.
 *
 * Adding a value here without updating that document is a spec divergence.
 * Both change together, in the same commit (AGENTS.md).
 */

// ---------------------------------------------------------------------------
// The seven tag axes
// ---------------------------------------------------------------------------

/** Axis 1 — minimum level at which a page surfaces in navigation. */
export const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export const level = z.enum(LEVELS);

/** Axis 2 — drives the three learning paths under /start/paths/. */
export const ROLES = ['builder', 'operator', 'strategist'] as const;
export const role = z.enum(ROLES);

/** Axis 3 — powers the task door. The highest-leverage axis on the site. */
export const TASKS = [
  'plan',
  'research',
  'write',
  'code',
  'review',
  'debug',
  'automate',
  'analyze',
  'ship',
  'collaborate',
  'learn',
] as const;
export const task = z.enum(TASKS);

/**
 * Axis 4 — which product a page is about.
 *
 * `agnostic` is EXCLUSIVE: a page carrying it may carry no other value. This is
 * the mechanism enforcing the vendor-neutrality rule for /concepts (AGENTS.md
 * golden rule 2). Enforced in `assertToolTags` below.
 */
export const TOOLS = [
  'agnostic',
  'claude-code',
  'codex',
  'cursor',
  'copilot',
  'chat-ui',
  'api',
  'mcp',
  'other',
] as const;
export const tool = z.enum(TOOLS);

/** Axis 5 — which subscriptions this content is achievable on. */
export const PLANS = [
  'free',
  'claude-pro',
  'chatgpt-plus',
  'higher-tier',
  'api',
] as const;
export const planTag = z.enum(PLANS);

/**
 * Axis 6 — how heavily this consumes a subscription window.
 * The axis this site exists for. Required even when `n-a`, because forcing the
 * author to consider quota cost is the point (docs/03).
 */
export const QUOTAS = ['light', 'moderate', 'heavy', 'n-a'] as const;
export const quota = z.enum(QUOTAS);

/** Axis 7 — reader time, not compute. */
export const EFFORTS = ['5min', '30min', 'deep-dive'] as const;
export const effort = z.enum(EFFORTS);

// ---------------------------------------------------------------------------
// Maintenance metadata
// ---------------------------------------------------------------------------

export const STATUSES = ['draft', 'review', 'verified'] as const;
export const status = z.enum(STATUSES);

export const VOLATILITIES = ['stable', 'volatile'] as const;
export const volatility = z.enum(VOLATILITIES);

/** Staleness thresholds in days, per docs/03. */
export const STALENESS_DAYS: Record<(typeof VOLATILITIES)[number], number> = {
  volatile: 45,
  stable: 365,
};

/** How confident we are in a data value's provenance (docs/04). */
export const CONFIDENCES = [
  'documented',
  'community-reported',
  'estimated',
] as const;
export const confidence = z.enum(CONFIDENCES);

// ---------------------------------------------------------------------------
// Content types
// ---------------------------------------------------------------------------

/** The ten content types, per docs/02. Adding one has a deliberately high bar. */
export const CONTENT_TYPES = [
  'concept',
  'plan',
  'model',
  'prompt',
  'pattern',
  'agent-profile',
  'skill',
  'playbook',
  'template',
  'showcase',
] as const;
export const contentType = z.enum(CONTENT_TYPES);

/** Task archetypes for field reports, per docs/04. */
export const TASK_ARCHETYPES = [
  'greenfield-feature',
  'refactor-module',
  'debug-single-issue',
  'codebase-exploration',
  'write-tests',
  'code-review',
  'research-synthesis',
  'document-writing',
  'data-analysis',
  'agent-orchestration',
  'long-conversation',
] as const;
export const taskArchetype = z.enum(TASK_ARCHETYPES);

// ---------------------------------------------------------------------------
// Cross-field rules
// ---------------------------------------------------------------------------

/**
 * `agnostic` is mutually exclusive with every other tool value.
 *
 * A /concepts page must be tagged `agnostic` and nothing else, which is what
 * makes "no product names in /concepts" a build failure rather than a review
 * convention. Reviewers forget; the build does not.
 */
export function assertToolTags(
  tools: readonly string[],
  ctx: z.RefinementCtx,
): void {
  if (tools.includes('agnostic') && tools.length > 1) {
    ctx.addIssue({
      code: 'custom',
      path: ['tool'],
      message:
        "`agnostic` is exclusive and cannot be combined with other tool values. " +
        'If this page needs a product-specific tag it does not belong in /concepts — ' +
        'move the product detail to /tools and link to it. See docs/03-taxonomy.md.',
    });
  }
}
