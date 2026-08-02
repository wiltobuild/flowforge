import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const distDir = path.resolve('dist');
const port = 4174;

const server = createServer(async (request, response) => {
  const requestPath = new URL(request.url ?? '/', 'http://localhost').pathname;
  const candidate = path.resolve(distDir, `.${requestPath}`);
  if (!candidate.startsWith(`${distDir}${path.sep}`) && candidate !== distDir) {
    response.writeHead(403).end();
    return;
  }
  const file = requestPath.endsWith('/') ? path.join(candidate, 'index.html') : candidate;
  try {
    if (!(await stat(file)).isFile()) throw new Error('not a file');
    response.writeHead(200).end(await readFile(file));
  } catch {
    response.writeHead(404).end('Not found');
  }
});

await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
const browser = await chromium.launch();
const failures = [];

try {
  const pages = (await (await import('node:fs/promises')).readdir(distDir, { recursive: true }))
    .filter((file) => file.endsWith('.html'))
    .map((file) => file.replace(/\\/g, '/'));

  for (const file of pages) {
    const route = file === 'index.html' ? '/' : `/${file.replace(/index\.html$/, '')}`;
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
      .analyze();
    for (const violation of results.violations) {
      failures.push(`${route}: ${violation.id} — ${violation.help}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
}

if (failures.length > 0) {
  console.error('axe accessibility violations found:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('axe passed WCAG 2.0, 2.1, and 2.2 A/AA rules on every rendered page.');
}
