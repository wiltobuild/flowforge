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
 * The five data files are separate collections loaded from YAML. Cross-file
 * integrity is enforced by reference(): a model pointing at a nonexistent plan
 * fails the build rather than rendering a broken page.
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
