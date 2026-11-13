import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { previews } from '../dist/modules/preview-data.js';
import { ICON_NAMES } from '../dist/modules/icons.js';

const root = new URL('../dist/', import.meta.url);
const iconSprite = await readFile(new URL('assets/icons.svg', root), 'utf8');
const symbolIds = [...iconSprite.matchAll(/<symbol\s+id="([^"]+)"/g)].map((match) => match[1]);
assert.equal(symbolIds.length, new Set(symbolIds).size, 'Icon symbols must be unique.');
for (const name of ICON_NAMES) assert.ok(symbolIds.includes(name), `Missing icon symbol: ${name}`);

/** Every HTML page in the deployment, as URLs.
 * @param {URL} directory
 * @returns {Promise<URL[]>}
 */
async function findPages(directory) {
  const pages = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) pages.push(...(await findPages(new URL(`${entry.name}/`, directory))));
    else if (entry.name.endsWith('.html')) pages.push(new URL(entry.name, directory));
  }
  return pages;
}

/** @type {Map<string, string[]>} */
const idsByPage = new Map();

/** @param {URL} page */
async function pageIds(page) {
  const cached = idsByPage.get(page.href);
  if (cached) return cached;
  const html = await readFile(page, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  idsByPage.set(page.href, ids);
  return ids;
}

const pages = await findPages(root);
assert.ok(pages.length > 1, 'Expected the home page and its content pages.');

for (const page of pages) {
  const name = fileURLToPath(page);
  const html = await readFile(page, 'utf8');
  const ids = await pageIds(page);
  assert.equal(ids.length, new Set(ids).size, `HTML IDs must be unique: ${name}`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `There must be one main heading: ${name}`);

  for (const match of html.matchAll(/href="(?:\.\.?\/)+assets\/icons\.svg#([^"]+)"/g)) {
    assert.ok(symbolIds.includes(match[1]), `Unknown static icon: ${match[1]} in ${name}`);
  }

  for (const match of html.matchAll(/\b(?:href|src|action)="([^"]+)"/g)) {
    const target = match[1];
    if (target.startsWith('mailto:')) {
      assert.ok(target.startsWith('mailto:support@safora.ai'), `Unexpected contact destination: ${target}`);
      continue;
    }
    if (target === '#') continue;
    assert.ok(/^(?:#|\.\.?\/)/.test(target), `Links must stay relative: ${target} in ${name}`);

    const [path, fragment] = target.split('#');
    let destination = path ? new URL(path, page) : page;
    if (destination.pathname.endsWith('/')) destination = new URL('index.html', destination);
    assert.ok(destination.href.startsWith(root.href), `Link leaves the site: ${target} in ${name}`);
    await access(destination);
    if (fragment && destination.pathname.endsWith('.html')) {
      assert.ok((await pageIds(destination)).includes(fragment), `Broken anchor: ${target} in ${name}`);
    }
  }
}

for (const view of Object.values(previews)) {
  assert.ok(view.score >= 0 && view.score <= 100, 'A pass rate must be within 0–100.');
  for (const metric of view.metrics)
    assert.ok(symbolIds.includes(metric.icon), `Unknown metric icon: ${metric.icon}`);
}

/** @param {URL} directory */
async function checkImports(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const url = new URL(entry.name, directory);
    if (entry.isDirectory()) {
      await checkImports(new URL(`${entry.name}/`, directory));
    } else if (/\.(?:js|css)$/.test(entry.name)) {
      const content = await readFile(url, 'utf8');
      const references = content.matchAll(/(?:from\s+['"]|@import\s+url\(['"])(\.\.?\/[^'"]+)/g);
      for (const reference of references) await access(new URL(reference[1], url));
      assert.ok(!content.includes('�'), `Invalid text encoding: ${fileURLToPath(url)}`);
    }
  }
}

await checkImports(root);
console.log(
  `Site contracts passed for ${pages.length} pages: anchors, assets, module imports, demo data and contact targets.`,
);
