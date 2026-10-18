import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { resolveModuleSource } from './module-source.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

test('all nine public routes map to existing extracted Vite apps', async () => {
  const modules = JSON.parse(await readFile(path.join(root, 'scripts/modules.json'), 'utf8'));
  assert.equal(modules.length, 9);
  assert.equal(new Set(modules.map(module => module.directory)).size, 9);
  assert.equal(new Set(modules.map(module => module.source)).size, 9);
  for (const module of modules) {
    assert.equal(await resolveModuleSource(root, module), path.resolve(root, module.source));
  }
});

test('missing source never falls back to a stale temporary build', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'precision-sources-'));
  try {
    const stale = path.join(temporary, '.build-sources', 'public-route');
    await mkdir(stale, { recursive: true });
    await writeFile(path.join(stale, 'package.json'), JSON.stringify({ scripts: { build: 'vite build' }, devDependencies: { vite: '^8.3.0' } }));
    await assert.rejects(resolveModuleSource(temporary, { name: 'Test', source: 'missing', directory: 'public-route' }), /Restore the source/);
    await assert.rejects(resolveModuleSource(temporary, { name: 'Test', source: '../outside' }), /Invalid source mapping/);
    await assert.rejects(resolveModuleSource(temporary, { name: 'Test' }), /Missing source mapping/);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
