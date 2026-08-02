import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'yaml';

const projectRoot = process.cwd();
const examplesDir = path.resolve('docs/examples');
const expectedFiles = ['concept.mdx', 'plan.mdx', 'model.mdx', 'prompt.mdx', 'pattern.mdx', 'agent-profile.mdx', 'skill.mdx', 'playbook.mdx', 'template.mdx', 'showcase.mdx'];
const headings = {
  concept: ['One-line definition', 'Why it matters', 'Mental model', 'How it actually works', 'Common misunderstandings', 'In practice', 'Go deeper'],
  plan: ['Who this is for', 'What you get', "What it's good at", "What it can't do", 'How the limits feel', 'Who should pick something else', 'Verify'],
  model: ['At a glance', 'Best at', 'Weak at', 'Quota weight', 'When to pick it', 'When not to', 'Notes and gotchas', 'External signals'],
  prompt: ['Situation', 'The prompt', 'Why it works', 'Variations', 'When it fails', 'Related'],
  pattern: ['Problem it solves', 'Structure', 'Example', 'Tradeoffs', 'Related patterns'],
  'anti-pattern': ['Symptom', 'Why it happens', 'What to do instead', 'Related'],
  'agent-profile': ['Purpose', 'The profile', 'Tools it needs', 'Model recommendation', 'When to use', 'When not to use', 'Example invocation', 'Known failure modes'],
  skill: ['What it does', 'Trigger description', 'File structure', 'Full source', 'Customizing it', 'Testing notes'],
  playbook: ['The situation', 'Prerequisites', 'Steps', 'Decision points', 'What good looks like', 'What goes wrong', 'Variations by tool'],
  template: ["What it's for", 'The file', 'How to customize', 'Filled-in example'],
  showcase: ['What they built', 'Stack used', 'The prompts and agents behind it', 'What was harder than expected', 'Lessons learned'],
};

function frontmatterAndBody(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/u.exec(source);
  if (!match) throw new Error('missing YAML frontmatter');
  return { frontmatter: parse(match[1]), body: match[2] };
}
function bodyHeadings(body) {
  let inFence = false;
  const result = [];
  for (const line of body.split(/\r?\n/u)) {
    if (/^```/.test(line)) { inFence = !inFence; continue; }
    if (!inFence && line.startsWith('## ')) result.push(line.slice(3).trim());
  }
  return result;
}
function runAstroCheck() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(projectRoot, 'node_modules/astro/bin/astro.mjs'), 'check'], { stdio: 'inherit' });
    child.once('error', reject);
    child.once('close', (code) => resolve(code ?? 1));
  });
}

const failures = [];
const actualFiles = (await readdir(examplesDir)).filter((file) => file.endsWith('.mdx')).sort();
if (JSON.stringify(actualFiles) !== JSON.stringify([...expectedFiles].sort())) failures.push(`docs/examples must contain exactly these ten files: ${expectedFiles.join(', ')}`);
const examples = [];
for (const file of expectedFiles) {
  const source = await readFile(path.join(examplesDir, file), 'utf8');
  const { frontmatter, body } = frontmatterAndBody(source);
  examples.push({ file, source, frontmatter });
  if (typeof frontmatter.title !== 'string' || frontmatter.title.trim() === '') failures.push(`docs/examples/${file}: title is required.`);
  const expectedHeadings = headings[frontmatter.kind === 'anti-pattern' ? 'anti-pattern' : frontmatter.type];
  if (JSON.stringify(bodyHeadings(body)) !== JSON.stringify(expectedHeadings)) failures.push(`docs/examples/${file}: body headings must be exactly ${expectedHeadings?.join(' → ') ?? 'a known content type'} in that order.`);
}

const plans = parse(await readFile('src/data/plans.yaml', 'utf8'));
const models = parse(await readFile('src/data/models.yaml', 'utf8'));
const deferredReferences = [];
for (const [type, records, field, placeholder] of [
  ['plan', plans, 'plan_id', 'example-plan-id-awaiting-verification'],
  ['model', models, 'model_id', 'example-model-id-awaiting-verification'],
]) {
  const example = examples.find((candidate) => candidate.frontmatter.type === type);
  const ids = new Set(Array.isArray(records) ? records.map((record) => record[field]) : []);
  if (ids.size === 0) {
    if (example.frontmatter[field] !== placeholder) failures.push(`docs/examples/${example.file}: ${field} must use ${placeholder} while its data collection is empty.`);
    deferredReferences.push(`${field} (${placeholder})`);
  } else if (!ids.has(example.frontmatter[field])) failures.push(`docs/examples/${example.file}: ${field} must reference an existing entry in src/data.`);
}
if (failures.length > 0) {
  console.error('Example validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const stagingRoot = await mkdtemp(path.join(tmpdir(), 'flowforge-examples-'));
const stagingDir = path.join(stagingRoot, 'src/content/docs');
try {
  await mkdir(stagingDir, { recursive: true });
  await mkdir(path.join(stagingRoot, 'src/pages'), { recursive: true });
  const stagingModules = path.join(stagingRoot, 'node_modules');
  await mkdir(stagingModules, { recursive: true });
  for (const entry of await readdir(path.join(projectRoot, 'node_modules'))) {
    if (entry !== '.astro') await symlink(path.join(projectRoot, 'node_modules', entry), path.join(stagingModules, entry), 'junction');
  }
  await Promise.all(examples.map(({ file, source }) => writeFile(path.join(stagingDir, file), source)));
  const contentSchemaUrl = pathToFileURL(path.resolve('src/schemas/content.ts')).href;
  await writeFile(
    path.join(stagingRoot, 'src/content.config.ts'),
    `import { defineCollection } from 'astro:content';\nimport { docsLoader } from '@astrojs/starlight/loaders';\nimport { contentSchema } from '${contentSchemaUrl}';\nexport const collections = { docs: defineCollection({ loader: docsLoader(), schema: contentSchema }) };\n`,
  );
  await writeFile(path.join(stagingRoot, 'astro.config.mjs'), "import { defineConfig } from 'astro/config';\nimport starlight from '@astrojs/starlight';\nexport default defineConfig({ vite: { cacheDir: './.vite' }, integrations: [starlight({ title: 'Example validation' })] });\n");
  const previousRoot = process.cwd();
  process.chdir(stagingRoot);
  const exitCode = await runAstroCheck();
  process.chdir(previousRoot);
  if (exitCode !== 0) process.exitCode = exitCode;
} finally { await rm(stagingRoot, { recursive: true, force: true }); }
if (process.exitCode) process.exit(process.exitCode);
console.log(`Validated all ${examples.length} copy-paste examples against the Astro content schema and body-order contract.`);
if (deferredReferences.length > 0) console.log(`Deferred reference integrity (not a successful resolution): ${deferredReferences.join(', ')}. plans.yaml and models.yaml are intentionally empty; this check will require real IDs as soon as either collection is populated.`);
