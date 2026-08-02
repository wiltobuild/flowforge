import { reference } from 'astro:content';
import { z } from 'zod';
import { confidence, level, quota, taskArchetype, tool } from './taxonomy';

/**
 * Schemas for the five structured data files. Source of truth:
 * docs/04-data-schemas.md.
 *
 * These files hold every fact that appears in more than one place. A number
 * typed into a Markdown body that also lives here is a bug (AGENTS.md golden
 * rule 1) — it will go stale silently, which is the exact failure this site
 * exists to avoid.
 */

// ---------------------------------------------------------------------------
// plans.yaml — the most volatile and most trust-critical file on the site
// ---------------------------------------------------------------------------

/**
 * A window a plan's usage is measured against.
 *
 * `unit: 'opaque'` with `stated_capacity: null` is EXPECTED and normal —
 * several providers do not publish hard numbers. Never fabricate a value to
 * fill the field; the UI handles unknown capacity and falls back to
 * community-reported data with a visible confidence marker.
 */
const limitWindow = z.object({
  window_id: z.string().min(1),
  duration_hours: z.number().positive(),
  unit: z.enum(['messages', 'sessions', 'opaque']),
  stated_capacity: z.number().positive().nullable(),
  applies_to: z.array(z.string()).default([]),
  note: z.string().optional(),
});

export const planSchema = z.object({
  plan_id: z.string().min(1),
  provider: z.string().min(1),
  display_name: z.string().min(1),
  tier: z.enum(['free', 'entry', 'mid', 'high', 'team']),
  /** null for free tiers. */
  price_usd_month: z.number().nonnegative().nullable(),
  billing_notes: z.string().optional(),
  included_products: z.array(z.string()).min(1),
  limit_windows: z.array(limitWindow).min(1),
  limit_style: z.enum(['hard-stop', 'demote', 'mixed']),
  /**
   * Plain-language description of what hitting the limit FEELS like.
   * The single most useful field on the site for a beginner: it tells them what
   * failure looks like on this plan, which is what actually decides the choice.
   */
  limit_style_note: z.string().min(1),
  good_for: z.array(z.string()).min(1),
  not_for: z.array(z.string()).min(1),
  /** Must be the provider's own pricing page — never an aggregator or blog. */
  source_url: z.url(),
  last_verified: z.date(),
  confidence,
});

// ---------------------------------------------------------------------------
// models.yaml
// ---------------------------------------------------------------------------

/**
 * Attributed external signal. Deliberately NOT a score field.
 * No benchmark score tables anywhere on this site — see docs/00-product-brief.md
 * for the reasoning. If you are adding a number here, stop.
 */
const externalSignal = z.object({
  source: z.string().min(1),
  url: z.url(),
  note: z.string().min(1),
});

/** Per-1M-token pricing. Advanced-gated in the UI; beginners never see this. */
const apiPricing = z.object({
  input: z.number().nonnegative(),
  output: z.number().nonnegative(),
  cached_input: z.number().nonnegative().optional(),
  cache_write: z.number().nonnegative().optional(),
  batch_input: z.number().nonnegative().optional(),
  batch_output: z.number().nonnegative().optional(),
});

export const modelSchema = z.object({
  model_id: z.string().min(1),
  provider: z.string().min(1),
  display_name: z.string().min(1),
  family: z.string().optional(),
  release_date: z.date().optional(),
  status: z.enum(['current', 'legacy', 'deprecated']),
  context_window: z.number().positive().optional(),
  max_output: z.number().positive().optional(),
  modalities: z.array(z.enum(['text', 'image', 'audio', 'video'])).min(1),
  capabilities: z
    .array(
      z.enum([
        'tool_use',
        'vision',
        'extended_thinking',
        'caching',
        'batch',
        'structured_output',
      ]),
    )
    .default([]),
  /**
   * Which plans include this model. This is the ONLY direction the plan↔model
   * relationship is stored — plans do not carry a models list. Storing it both
   * ways guarantees the two drift apart; plan pages derive their model list
   * from this field.
   */
  available_on: z.array(reference('plans')).min(1),
  /** Relative consumption within its plan. The site's signature axis. */
  quota_weight: quota,
  speed_tier: z.enum(['fast', 'balanced', 'slow']).optional(),
  reasoning_tier: z.enum(['basic', 'strong', 'frontier']).optional(),
  best_at: z.array(z.string()).min(1),
  weak_at: z.array(z.string()).min(1),
  api_pricing: apiPricing.optional(),
  external_signals: z.array(externalSignal).default([]),
  source_url: z.url(),
  last_verified: z.date(),
});

// ---------------------------------------------------------------------------
// field-reports.yaml — the crowdsourced layer, the site's unfair advantage
// ---------------------------------------------------------------------------

/**
 * These are TIMESTAMPED OBSERVATIONS, not claims. That is why they age
 * gracefully where stated limits do not: a report from March remains a true
 * report from March. Never rewrite an old report to match current conditions.
 */
export const fieldReportSchema = z.object({
  report_id: z.string().min(1),
  submitted: z.date(),
  plan_id: reference('plans'),
  tool,
  model_id: reference('models').optional(),
  task_archetype: taskArchetype,
  task_description: z.string().min(1).max(200),
  scale: z.enum(['small', 'medium', 'large']),
  /** Above 100 is valid and meaningful — it means they ran out mid-task. */
  window_share_pct: z.number().min(0).max(150),
  hit_limit: z.boolean(),
  session_minutes: z.number().positive().optional(),
  used_subagents: z.boolean().optional(),
  what_helped: z.string().optional(),
  reporter: z.string().default('anonymous'),
  cohort_level: z.enum(['l1', 'l3', 'other']).optional(),
});

// ---------------------------------------------------------------------------
// glossary.yaml
// ---------------------------------------------------------------------------

export const glossarySchema = z.object({
  term: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  /** This IS the tooltip. Must stand alone without the surrounding page. */
  short: z
    .string()
    .min(1)
    .max(140, 'the tooltip must be ≤140 characters and stand alone'),
  long: z.string().optional(),
  canonical_page: z.string().optional(),
  level,
});

// ---------------------------------------------------------------------------
// changelog.yaml
// ---------------------------------------------------------------------------

/**
 * Material changes only — NOT a release feed. An entry belongs here when it
 * changes a recommendation on this site.
 */
export const changelogSchema = z.object({
  entry_id: z.string().min(1),
  date: z.date(),
  kind: z.enum(['model', 'pricing', 'limits', 'tool', 'site']),
  summary: z.string().min(1).max(200),
  affects: z.array(z.string()).default([]),
  /**
   * Accountability mechanism: a landscape change with no updated pages is a
   * visible to-do rather than a silent gap.
   */
  pages_updated: z.array(z.string()).default([]),
  source_url: z.url(),
});

// ---------------------------------------------------------------------------
// Loader helper
// ---------------------------------------------------------------------------

/**
 * Astro's file() loader needs an `id` on each entry. Our YAML uses natural keys
 * (plan_id, model_id, ...) so the files stay readable and hand-editable; this
 * maps the natural key onto `id` at load time.
 *
 * Tolerates an empty or comment-only file by returning [], so a collection can
 * exist before it has content.
 */
export function keyedBy(key: string) {
  return (text: unknown): Record<string, unknown>[] => {
    if (!Array.isArray(text)) return [];
    return text.map((entry: Record<string, unknown>) => ({
      ...entry,
      id: entry[key],
    }));
  };
}
