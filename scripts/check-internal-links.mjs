import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');

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

function hrefsIn(html) {
  const hrefs = [];
  const anchors = html.matchAll(/<a\b[^>]*>/gi);
  for (const anchor of anchors) {
    const href = /\bhref\s*=\s*(["'])(.*?)\1/i.exec(anchor[0]);
    if (href) hrefs.push(href[2]);
  }
  return hrefs;
}

function routeFor(file) {
  const relative = path.relative(distDir, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -10)}`;
  return `/${relative}`;
}

function isExternal(href) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href);
}

async function existingPage(url) {
  const pathname = decodeURIComponent(url.pathname);
  const candidates = pathname.endsWith('/')
    ? [path.join(distDir, pathname, 'index.html')]
    : [
        path.join(distDir, pathname),
        path.join(distDir, pathname, 'index.html'),
        path.join(distDir, `${pathname}.html`),
      ];

  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // Try the next output convention.
    }
  }
  return undefined;
}

function hasFragment(html, fragment) {
  const id = decodeURIComponent(fragment);
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b(?:id|name)\\s*=\\s*(["'])${escaped}\\1`, 'i').test(html);
}

const htmlFiles = (await filesIn(distDir)).filter((file) => file.endsWith('.html'));
const failures = [];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const route = routeFor(file);

  for (const href of hrefsIn(html)) {
    if (!href || isExternal(href)) continue;

    // Dummy origin: only the path matters, and `.invalid` is reserved so this
    // can never accidentally resolve to a real host.
    const url = new URL(href, `https://flowforge.invalid${route}`);
    const target = await existingPage(url);
    if (!target) {
      failures.push(`${route}: ${href} does not resolve in dist/`);
      continue;
    }
    if (url.hash) {
      const targetHtml = await readFile(target, 'utf8');
      if (!hasFragment(targetHtml, url.hash.slice(1))) {
        failures.push(`${route}: ${href} has no matching fragment in ${routeFor(target)}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Broken internal links found:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Checked internal links in ${htmlFiles.length} rendered HTML files.`);
}
