import assert from 'node:assert/strict';
import test from 'node:test';
import { migrateLegacyMechanicsHtml, migrateLegacyViteConfig, migrateThreeSource, pagesBuildOptions } from './vite-pages-options.mjs';

test('migrates removed Three.js APIs with timer cleanup, idempotently', () => {
  const source = 'renderer.shadowMap.type = THREE.PCFSoftShadowMap;\nlet clock = new THREE.Clock();\nconst delta = clock.getDelta();\nconst elapsed = clock.getElapsedTime();\ncancelAnimationFrame(animId);';
  const migrated = migrateThreeSource(source);
  assert.ok(migrated.includes('THREE.PCFShadowMap'));
  assert.ok(migrated.includes('new THREE.Timer()'));
  assert.ok(migrated.includes('clock.update();'));
  assert.ok(migrated.includes('clock.dispose();'));
  assert.ok(migrated.includes('clock.getElapsed()'));
  assert.ok(!migrated.includes('clock.getElapsedTime()'));
  assert.equal(migrateThreeSource(migrated), migrated);
  assert.equal(migrateThreeSource("import { Clock } from 'lucide-react';"), "import { Clock } from 'lucide-react';");
});

test('standalone mechanics page keeps its content but uses production CSS', () => {
  const html = '<script src="https://cdn.tailwindcss.com"></script><script>tailwind.config = { theme: {} };</script><main>Clinical content</main><script>runSimulator();</script>';
  const migrated = migrateLegacyMechanicsHtml(html);
  assert.ok(migrated.includes('href="./periodontics-mechanics.css"'));
  assert.ok(!migrated.includes('tailwind.config'));
  assert.ok(migrated.includes('<main>Clinical content</main><script>runSimulator();</script>'));
  assert.equal(migrateLegacyMechanicsHtml(migrated), migrated);
});

test('migrates only the known archive config to ESM-safe paths', () => {
  const legacy = "import path from 'path';\nexport default { resolve: { alias: { '@': path.resolve(__dirname, '.') } } };";
  const migrated = migrateLegacyViteConfig(legacy);
  assert.match(migrated, /import \{fileURLToPath\} from 'node:url'/);
  assert.ok(migrated.includes("fileURLToPath(new URL('.', import.meta.url))"));
  assert.ok(!migrated.includes('__dirname'));
  assert.equal(migrateLegacyViteConfig(migrated), migrated);
});

test('does not remove a path import still used elsewhere', () => {
  const custom = "import path from 'path';\nconst alias = path.resolve(__dirname, '.');\nconst other = path.join('a', 'b');";
  assert.equal(migrateLegacyViteConfig(custom), custom);
});

test('splits real modules while preserving lazy entry boundaries and warning defaults', () => {
  assert.equal(pagesBuildOptions.chunkSizeWarningLimit, undefined);
  for (const group of pagesBuildOptions.rolldownOptions.output.codeSplitting.groups) {
    assert.ok(group.maxSize < 500_000);
    assert.equal(group.entriesAware, true);
  }
});
