import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('.', import.meta.url));
const output = new URL(`.curriculum-tests-${process.pid}.mjs`, import.meta.url);
try {
  // Also resolve/bundle the real installed Three.js entrypoints, without writing build artifacts.
  await build({
    absWorkingDir: directory,
    entryPoints: ['../App.tsx'],
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'esm',
    jsx: 'automatic',
    loader: { '.css': 'empty' },
    define: { 'import.meta.env.BASE_URL': JSON.stringify('/nested/endo/') },
  });
  console.log('Browser bundle check passed with installed dependencies (in memory).');
  const result = await build({
    absWorkingDir: directory,
    entryPoints: ['curriculum.test.tsx'],
    outfile: fileURLToPath(output),
    bundle: true,
    write: false,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    jsx: 'automatic',
    loader: { '.css': 'empty' },
    define: { 'import.meta.env.BASE_URL': JSON.stringify('/nested/endo/') },
    plugins: [{
      name: 'mock-gpu-only',
      setup(build) {
        build.onResolve({ filter: /^three$/ }, (args) => args.importer.replaceAll('\\', '/').endsWith('/three/studioEngine.ts')
          ? { path: fileURLToPath(new URL('three-mock.ts', import.meta.url)) } : undefined);
        build.onResolve({ filter: /^three\/addons\// }, () => ({ path: fileURLToPath(new URL('three-mock.ts', import.meta.url)) }));
      },
    }],
  });
  await writeFile(output, result.outputFiles[0].contents);
  const test = spawnSync(process.execPath, ['--test', fileURLToPath(output)], { stdio: 'inherit' });
  process.exitCode = test.status ?? 1;
} finally {
  await rm(output, { force: true });
}
