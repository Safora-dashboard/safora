import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { previews } from '../dist/modules/preview-data.js';
import { ICON_NAMES } from '../dist/modules/icons.js';

const root = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const iconSprite = await readFile(new URL('assets/icons.svg', root), 'utf8');
const symbolIds = [...iconSprite.matchAll(/<symbol\s+id="([^"]+)"/g)].map((match) => match[1]);
assert.equal(symbolIds.length, new Set(symbolIds).size, 'Icon symbols must be unique.');
for (const name of ICON_NAMES) assert.ok(symbolIds.includes(name), `Missing icon symbol: ${name}`);
for (const match of html.matchAll(/href="(?:\.\/|\/)assets\/icons\.svg#([^"]+)"/g)) {
  assert.ok(symbolIds.includes(match[1]), `Unknown static icon: ${match[1]}`);
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML IDs must be unique.');
assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'There must be one main heading.');

for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const target = match[1];
  if (target === '#') continue;
  if (target.startsWith('#')) {
    assert.ok(ids.includes(target.slice(1)), `Broken anchor: ${target}`);
  } else if (target.startsWith('/') || target.startsWith('./')) {
    await access(new URL(target.startsWith('/') ? target.slice(1) : target, root));
  } else if (target.startsWith('mailto:')) {
    assert.ok(target.startsWith('mailto:support@safora.ai'), `Unexpected contact destination: ${target}`);
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
      assert.ok(!content.includes('\uFFFD'), `Invalid text encoding: ${fileURLToPath(url)}`);
    }
  }
}

await checkImports(root);
console.log('Site contracts passed: anchors, assets, module imports, demo data and contact targets.');
