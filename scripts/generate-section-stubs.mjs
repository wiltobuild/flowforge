/**
 * One-off scaffold for M0-T7: creates a stub index page for each of the ten
 * top-level sections so the sidebar order specified in
 * docs/01-information-architecture.md is real and navigable from M0 onward.
 *
 * These stubs are REPLACED by their sections, not extended. Each carries
 * status: draft and names the milestone that fills it in, so an unfinished
 * section is visibly unfinished rather than quietly empty.
 *
 * Safe to re-run: it never overwrites an existing file.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src', 'content', 'docs');

// Order matches the sidebar priority in docs/01 — what people need, most first.
const SECTIONS = [
  {
    dir: 'start',
    title: 'Start here',
    description: 'Orientation, learning paths, and what to do in your first week.',
    milestone: 'M3-T6',
    level: 'beginner',
    role: ['builder', 'operator', 'strategist'],
  },
  {
    dir: 'plans',
    title: 'Plans and usage',
    description:
      'Which subscription to buy, what burns your quota, and whether a task will fit.',
    milestone: 'M1',
    level: 'beginner',
    role: ['builder', 'operator', 'strategist'],
  },
  {
    dir: 'playbooks',
    title: 'Playbooks',
    description: 'Step-by-step recipes for the things people actually need to do.',
    milestone: 'M2-T2',
    level: 'beginner',
    role: ['builder', 'operator'],
  },
  {
    dir: 'prompting',
    title: 'Prompting',
    description: 'Patterns by technique and a prompt library organized by situation.',
    milestone: 'M3-T1',
    level: 'beginner',
    role: ['builder', 'operator', 'strategist'],
  },
  {
    dir: 'agents',
    title: 'Agents',
    description: 'Agent profiles, subagents, orchestration patterns, and failure modes.',
    milestone: 'M4-T1',
    level: 'intermediate',
    role: ['builder'],
  },
  {
    dir: 'skills',
    title: 'Skills',
    description: 'What skills are, how to author one, and a gallery of working examples.',
    milestone: 'M4-T3',
    level: 'intermediate',
    role: ['builder'],
  },
  {
    dir: 'tools',
    title: 'Tools',
    description: 'An honest comparison of the IDEs, CLIs, and chat apps people build with.',
    milestone: 'M4-T4',
    level: 'beginner',
    role: ['builder', 'operator'],
  },
  {
    dir: 'concepts',
    title: 'Concepts',
    description: 'Vendor-neutral explanations of how any of this actually works.',
    milestone: 'M4-T5',
    level: 'beginner',
    role: ['builder', 'operator', 'strategist'],
  },
  {
    dir: 'reference',
    title: 'Reference',
    description: 'Glossary, cheatsheets, downloadable templates, and security basics.',
    milestone: 'M4-T6',
    level: 'beginner',
    role: ['builder', 'operator', 'strategist'],
  },
  {
    dir: 'cohort',
    title: 'Cohort',
    description: 'Showcase, FAQ from real sessions, and how to contribute.',
    milestone: 'M4-T7',
    level: 'beginner',
    role: ['builder', 'operator', 'strategist'],
  },
];

const exists = async (p) => access(p).then(() => true).catch(() => false);

let created = 0;
let skipped = 0;

for (const section of SECTIONS) {
  const dir = path.join(DOCS, section.dir);
  const file = path.join(dir, 'index.mdx');

  if (await exists(file)) {
    skipped += 1;
    continue;
  }

  await mkdir(dir, { recursive: true });

  // `concepts` must be tagged agnostic and nothing else — the schema enforces
  // it, and this stub has to satisfy the same rule everything else does.
  const tools = section.dir === 'concepts' ? ['agnostic'] : ['agnostic'];

  const frontmatter = [
    '---',
    `title: ${section.title}`,
    `description: ${section.description}`,
    'type: concept',
    `level: ${section.level}`,
    'status: draft',
    'owner: wiltobuild',
    'last_verified: 2026-08-02',
    'volatility: stable',
    `role: [${section.role.join(', ')}]`,
    `tool: [${tools.join(', ')}]`,
    'plan: [free]',
    'quota: n-a',
    'effort: 5min',
    'next:',
    '  - label: Start here',
    '    link: /start/',
    '  - label: Plans and usage',
    '    link: /plans/',
    '---',
    '',
    `This section is built in ${section.milestone}. See \`docs/08-build-plan.md\`.`,
    '',
    'The stub exists so the sidebar order specified in',
    '`docs/01-information-architecture.md` is real from M0 onward, and so an unfinished',
    'section is visibly unfinished rather than quietly missing.',
    '',
  ].join('\n');

  await writeFile(file, frontmatter, 'utf-8');
  created += 1;
}

console.log(`Section stubs: ${created} created, ${skipped} already present.`);
