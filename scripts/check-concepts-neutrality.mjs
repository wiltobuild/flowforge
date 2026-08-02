import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';

const contentDir = path.resolve('src/content');
const productNames = [
  'Anthropic',
  'ChatGPT',
  'Claude',
  'Codex',
  'Copilot',
  'Cursor',
  'Gemini',
  'GitHub Copilot',
  'Microsoft Copilot',
  'OpenAI',
  'Perplexity',
];

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const file = path.join(directory, entry.name);
      return entry.isDirectory() ? filesIn(file) : [file];
    }),
  );
  return files.flat();
}

function hasConceptsDirectory(file) {
  return path.relative(contentDir, file).split(path.sep).includes('concepts');
}

function frontmatterAndBody(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/u.exec(source);
  if (!match) throw new Error('missing YAML frontmatter');
  return { frontmatter: parse(match[1]), body: match[2] };
}

const contentFiles = (await filesIn(contentDir)).filter((file) => /\.mdx?$/i.test(file));
const failures = [];

for (const file of contentFiles.filter(hasConceptsDirectory)) {
  const relative = path.relative(process.cwd(), file);
  const { frontmatter, body } = frontmatterAndBody(await readFile(file, 'utf8'));
  const tools = frontmatter.tool;
  if (!Array.isArray(tools) || tools.length !== 1 || tools[0] !== 'agnostic') {
    failures.push(`${relative}: tool must be exactly [agnostic].`);
  }

  const visibleText = `${frontmatter.title ?? ''}\n${frontmatter.description ?? ''}\n${body}`;
  for (const productName of productNames) {
    const expression = new RegExp(`\\b${productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (expression.test(visibleText)) {
      failures.push(`${relative}: names product "${productName}".`);
    }
  }
}

if (failures.length > 0) {
  console.error('Concept pages must remain vendor-neutral:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Concept directory is tagged agnostic and contains no known product names.');
}
