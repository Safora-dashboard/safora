import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createStaticServer } from '../scripts/static-server.mjs';

test('static server handles assets, HEAD, malformed requests and path escapes', async (context) => {
  const workspace = await mkdtemp(path.join(tmpdir(), 'safora-static-'));
  const root = path.join(workspace, 'public');
  await mkdir(root);
  await writeFile(path.join(root, 'index.html'), '<h1>SAFORA</h1>');
  await writeFile(path.join(root, 'logo.jpeg'), 'sample-image');
  await writeFile(path.join(workspace, 'outside.txt'), 'must-not-be-served');
  const server = createStaticServer(root);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const origin = `http://127.0.0.1:${address.port}`;
  context.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    await rm(workspace, { recursive: true, force: true });
  });

  const home = await fetch(origin);
  assert.equal(home.status, 200);
  assert.match(home.headers.get('content-type'), /text\/html/);
  assert.equal(home.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(await home.text(), '<h1>SAFORA</h1>');
  const image = await fetch(`${origin}/logo.jpeg`, { method: 'HEAD' });
  assert.equal(image.headers.get('content-type'), 'image/jpeg');
  assert.equal(await image.text(), '');
  assert.equal((await fetch(origin, { method: 'POST' })).status, 405);
  assert.equal((await fetch(`${origin}/missing`)).status, 404);
  assert.equal((await fetch(`${origin}/%2e%2e%2foutside.txt`)).status, 404);
  assert.equal((await fetch(`${origin}/%broken`)).status, 404);
});
