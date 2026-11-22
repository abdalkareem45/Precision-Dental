import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const suites = process.argv.slice(2);
const selected = suites.length ? suites : ['content', 'store', 'three'];
const outputs = [];
try {
  for (const suite of selected) {
    if (!['content', 'store', 'three'].includes(suite)) throw new Error(`Unknown suite: ${suite}`);
    const entry = fileURLToPath(new URL(`./${suite}.test.ts`, import.meta.url));
    const outfile = fileURLToPath(new URL(`./.regression-${process.pid}-${suite}.mjs`, import.meta.url));
    outputs.push(outfile);
    await build({
      entryPoints: [entry], outfile, bundle: true, platform: 'node', format: 'esm',
      define: { 'import.meta.env.BASE_URL': JSON.stringify('/study/crown/') },
      logLevel: 'warning',
    });
  }
  const result = spawnSync(process.execPath, ['--test', ...outputs], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  for (const output of outputs) rmSync(output, { force: true });
}
