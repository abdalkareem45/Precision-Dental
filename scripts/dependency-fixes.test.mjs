import assert from 'node:assert/strict';
import test from 'node:test';
import { applyInstallScriptPolicy, fixKnownDependencyConflicts } from './dependency-fixes.mjs';

test('install-script policy is explicit, version-pinned, and idempotent', () => {
  const pkg = {};
  assert.equal(applyInstallScriptPolicy(pkg).length, 3);
  assert.deepEqual(pkg.allowScripts, {
    'esbuild@0.28.2': true,
    '@google/genai': false,
    protobufjs: false,
  });
  assert.deepEqual(applyInstallScriptPolicy(pkg), []);
});

test('install-script policy respects existing owner decisions', () => {
  const pkg = { allowScripts: { esbuild: false, '@google/genai': true, protobufjs: false } };
  const before = structuredClone(pkg);
  assert.deepEqual(applyInstallScriptPolicy(pkg), []);
  assert.deepEqual(pkg, before);
});

test('repairs the archived Vite 8.3/esbuild 0.25 conflict', () => {
  const pkg = { dependencies: { vite: '^8.3.0' }, devDependencies: { esbuild: '^0.25.0' } };
  assert.equal(fixKnownDependencyConflicts(pkg).length, 1);
  assert.equal(pkg.devDependencies.esbuild, '^0.28.0');
  assert.equal(pkg.dependencies.vite, '^8.3.0');
  assert.deepEqual(fixKnownDependencyConflicts(pkg), []);
});

test('supports either dependency section', () => {
  const pkg = { devDependencies: { vite: '^8.3.0' }, dependencies: { esbuild: '^0.25.0' } };
  assert.equal(fixKnownDependencyConflicts(pkg).length, 1);
  assert.equal(pkg.dependencies.esbuild, '^0.28.0');
});

test('does not change other Vite versions or compatible esbuild declarations', () => {
  for (const pkg of [
    {},
    { dependencies: { vite: '^6.0.0' }, devDependencies: { esbuild: '^0.25.0' } },
    { dependencies: { vite: '^8.3.0' }, devDependencies: { esbuild: '^0.28.0' } },
    { dependencies: { vite: '^8.3.0' }, devDependencies: { esbuild: '^0.27.0' } },
    { dependencies: { vite: '^8.3.0' } }
  ]) {
    const before = structuredClone(pkg);
    assert.deepEqual(fixKnownDependencyConflicts(pkg), []);
    assert.deepEqual(pkg, before);
  }
});
