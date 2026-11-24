import { build } from 'esbuild';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Bundle TypeScript with the host's existing esbuild; generated files stay in this subtree.
const testsDir = fileURLToPath(new URL('./', import.meta.url));
const tempDir = await mkdtemp(join(testsDir, '.run-'));
try {
  const output = join(tempDir, 'suite.mjs');
  const result = await build({
    entryPoints: [join(testsDir, 'suite.tsx')],
    bundle: true, platform: 'node', format: 'esm', packages: 'external',
    jsx: 'automatic', loader: { '.css': 'empty' },
    define: { 'import.meta.env': JSON.stringify({ BASE_URL: '/nested/pros-main/' }) },
    write: false, outfile: output,
  });
  await writeFile(output, result.outputFiles[0].contents);
  const child = spawnSync(process.execPath, ['--test', output], {
    stdio: 'inherit', env: { ...process.env, PROSTHO_STUDIO_ROOT: fileURLToPath(new URL('../', import.meta.url)) },
  });
  if (child.error) throw child.error;
  process.exitCode = child.status ?? 1;
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
