import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

import { yamlFile } from './loaders/yaml-file';
import { contentSchema } from './schemas/content';
import {
  changelogSchema,
  fieldReportSchema,
  glossarySchema,
  modelSchema,
  planSchema,
} from './schemas/data';

/**
 * Collections.
 *
 * All ten content types live in the single `docs` collection so Starlight
 * renders them with its navigation, table of contents, and search. The `type`
 * frontmatter field discriminates them and drives per-type requirements — see
 * src/schemas/content.ts.
 *
 * The five data files are separate collections loaded from YAML, cross-referenced
 * via reference('plans') / reference('models') in src/schemas/data.ts.
 *
 * KNOWN GAP (found in Themis review, docs/tasks/m1-t1-t2-plans-models-data/review.md,
 * 2026-08-23): reference() only validates at query time (getEntry/getCollection),
 * not automatically for every entry in a loaded collection. Until a page or script
 * actually queries these collections, a model's `available_on` can point at a
 * nonexistent plan_id and the build will NOT catch it — confirmed by deliberately
 * breaking a reference and observing a clean build. This is a real, unresolved
 * gap in the site's stated cross-file integrity guarantee (docs/04-data-schemas.md),
 * not yet fixed. Do not trust this comment's previous claim that it "fails the
 * build" — it doesn't, today. Tracked as a follow-up: add an explicit validation
 * script (alongside check-concepts-neutrality.mjs / check-examples.mjs) that
 * walks every available_on and confirms it resolves, run in `npm run ci`.
 */
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: contentSchema }),
  }),

  plans: defineCollection({
    loader: yamlFile('src/data/plans.yaml', 'plan_id'),
    schema: planSchema,
  }),

  models: defineCollection({
    loader: yamlFile('src/data/models.yaml', 'model_id'),
    schema: modelSchema,
  }),

  fieldReports: defineCollection({
    loader: yamlFile('src/data/field-reports.yaml', 'report_id'),
    schema: fieldReportSchema,
  }),

  glossary: defineCollection({
    loader: yamlFile('src/data/glossary.yaml', 'term'),
    schema: glossarySchema,
  }),

  changelog: defineCollection({
    loader: yamlFile('src/data/changelog.yaml', 'entry_id'),
    schema: changelogSchema,
  }),
};
