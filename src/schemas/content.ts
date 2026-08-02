import { reference } from 'astro:content';
import { z } from 'zod';
import {
  assertToolTags,
  contentType,
  effort,
  level,
  planTag,
  quota,
  role,
  status,
  task,
  tool,
  volatility,
} from './taxonomy';

/**
 * Frontmatter schema for all site content.
 *
 * Source of truth: docs/02-content-types.md (fields) and docs/03-taxonomy.md
 * (vocabularies). All ten content types share one collection so that Starlight
 * renders them with its navigation, TOC, and search; the `type` field
 * discriminates them and drives per-type requirements below.
 *
 * Body section ORDER is also mandatory per docs/02, but that is a property of
 * the Markdown body rather than the frontmatter, so it is enforced by the
 * content-auditor agent and the CI structure check (M0-T9), not here.
 */

/** A "next" link. Every page needs 2–3 — no dead ends (docs/01). */
const nextLink = z.object({
  label: z.string().min(1),
  link: z.string().min(1),
});

export const contentSchema = z
  .object({
    // -- What kind of page is this -------------------------------------------
    type: contentType,

    // -- Universal frontmatter (docs/02) -------------------------------------
    /** Starlight makes this optional; the site requires it for cards + search. */
    description: z
      .string()
      .min(1)
      .max(160, 'description must be ≤160 characters — it is used in cards and search'),
    level,
    status,
    /** GitHub handle. Required: no orphan pages (docs/09). */
    owner: z.string().min(1),
    last_verified: z.date(),
    volatility,
    next: z
      .array(nextLink)
      .min(2, 'every page needs 2–3 "next" links — no dead ends (docs/01)')
      .max(3),

    // -- Tag axes (docs/03) ---------------------------------------------------
    role: z.array(role).min(1),
    task: z.array(task).default([]),
    tool: z.array(tool).min(1),
    plan: z.array(planTag).min(1),
    /** Required even when `n-a` — being forced to consider it is the point. */
    quota,
    effort,

    // -- Per-type fields ------------------------------------------------------
    // Declared optional here; conditionally REQUIRED in superRefine below.

    /** concept: terms this page is the canonical definition for. */
    glossary_terms: z.array(z.string()).optional(),

    /** plan / model: join keys into src/data. Validated to exist by reference(). */
    plan_id: reference('plans').optional(),
    model_id: reference('models').optional(),

    /** prompt / playbook: short phrase powering the task door. */
    situation: z.string().optional(),

    /** pattern: patterns and anti-patterns share a type. */
    kind: z.enum(['pattern', 'anti-pattern']).optional(),

    /** agent-profile: which harness, and the file it is generated from. */
    agent_tool: tool.optional(),
    source_file: z.string().optional(),

    /** playbook: wall-clock estimate for the whole run. */
    time_estimate: z.string().optional(),

    /** template: the downloadable artifact. */
    file_name: z.string().optional(),
    file_type: z.string().optional(),

    /** showcase: attribution. Opt-in only, per docs/10 Q6. */
    author: z.string().optional(),
    cohort_level: z.enum(['l1', 'l3', 'other']).optional(),
    stack: z.array(tool).optional(),
  })
  .superRefine((data, ctx) => {
    assertToolTags(data.tool, ctx);

    /** Require a field for a given type, with a message that says what to do. */
    const requireFor = (
      forType: z.infer<typeof contentType>,
      field: keyof typeof data,
      why: string,
    ) => {
      if (data.type === forType && data[field] === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: `\`${field}\` is required for type "${forType}" — ${why}`,
        });
      }
    };

    // A concept page is vendor-neutral by definition. This is the schema half
    // of golden rule 2; the other half is the directory check in CI.
    if (data.type === 'concept' && !data.tool.includes('agnostic')) {
      ctx.addIssue({
        code: 'custom',
        path: ['tool'],
        message:
          'concept pages must be tagged `agnostic` and may not name a product. ' +
          'Put product-specific detail in the "In practice" section as a link to /tools.',
      });
    }

    requireFor('plan', 'plan_id', 'it joins the page to src/data/plans.yaml');
    requireFor('model', 'model_id', 'it joins the page to src/data/models.yaml');
    requireFor('prompt', 'situation', 'the task door indexes on it');
    requireFor('playbook', 'situation', 'the task door indexes on it');
    requireFor('playbook', 'time_estimate', 'readers need it before starting');
    requireFor('pattern', 'kind', 'patterns and anti-patterns render differently');
    requireFor('agent-profile', 'agent_tool', 'profiles are harness-specific');
    requireFor('template', 'file_name', 'it names the download');
    requireFor('template', 'file_type', 'it names the download');
    requireFor('showcase', 'author', 'showcase entries are attributed');

    // Anything joined to a data file is volatile by definition (docs/03).
    if (
      (data.plan_id !== undefined || data.model_id !== undefined) &&
      data.volatility !== 'volatile'
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['volatility'],
        message:
          'pages joined to plans.yaml or models.yaml are `volatile` by definition — ' +
          'they render facts that change without notice (docs/03).',
      });
    }
  });
