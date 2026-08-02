import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Loader } from 'astro/loaders';
import { parse as parseYaml } from 'yaml';

/**
 * Loads a YAML array into a content collection.
 *
 * Astro's built-in file() loader does the same job, but warns on an empty file.
 * Several data files are legitimately empty until their milestone populates
 * them — notably plans.yaml and models.yaml, which stay empty until M1 because
 * seeding them with plausible-but-unverified numbers would put wrong pricing on
 * a site whose whole premise is being trustworthy about pricing (ADR-003).
 *
 * AGENTS.md requires zero-warning builds, and an empty collection is an
 * expected state here rather than a problem, so this loader treats it as
 * normal. Everything else — schema validation, cross-file references, watch
 * mode — behaves exactly as file() does.
 *
 * @param filePath Path to the YAML file, relative to the project root.
 * @param idKey    Natural key on each entry, mapped onto the `id` Astro needs.
 *                 Data files use natural keys (plan_id, model_id, ...) so they
 *                 stay readable and hand-editable by non-developers.
 */
export function yamlFile(filePath: string, idKey: string): Loader {
  return {
    name: 'yaml-file-loader',
    load: async ({ store, parseData, config, logger, watcher, generateDigest }) => {
      const resolved = path.resolve(fileURLToPath(config.root), filePath);

      const sync = async (): Promise<void> => {
        let text: string;
        try {
          text = await readFile(resolved, 'utf-8');
        } catch {
          logger.error(
            `Could not read ${filePath}. The file must exist even when empty — ` +
              'collections referencing it will fail to resolve otherwise.',
          );
          return;
        }

        const parsed: unknown = parseYaml(text) ?? [];

        if (!Array.isArray(parsed)) {
          logger.error(
            `${filePath} must contain a YAML array (use [] when empty), not ` +
              `${typeof parsed}. See docs/04-data-schemas.md.`,
          );
          return;
        }

        store.clear();

        for (const [index, entry] of parsed.entries()) {
          if (entry === null || typeof entry !== 'object') {
            logger.error(`${filePath} entry ${index} is not an object. Skipping.`);
            continue;
          }

          const record = entry as Record<string, unknown>;
          const id = record[idKey];

          if (typeof id !== 'string' || id.length === 0) {
            logger.error(
              `${filePath} entry ${index} is missing its \`${idKey}\`, which is ` +
                'required as the entry identifier. See docs/04-data-schemas.md.',
            );
            continue;
          }

          // parseData applies the collection schema and throws on violation,
          // which is what makes bad data a build failure rather than a warning.
          const data = await parseData({ id, data: record, filePath: resolved });
          store.set({ id, data, digest: generateDigest(record) });
        }
      };

      await sync();

      // Watch mode: re-sync on edit so data changes show up without a restart.
      if (watcher) {
        watcher.add(resolved);
        watcher.on('change', (changed: string) => {
          if (path.resolve(changed) === resolved) void sync();
        });
      }
    },
  };
}
