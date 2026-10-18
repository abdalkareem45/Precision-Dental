import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyInstallScriptPolicy, fixKnownDependencyConflicts } from './dependency-fixes.mjs';
import { resolveModuleSource } from './module-source.mjs';
import { migrateLegacyMechanicsHtml, migrateLegacyViteConfig, migrateThreeSource } from './vite-pages-options.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '_site');
const modules = JSON.parse(await readFile(path.join(root, 'scripts/modules.json'), 'utf8'));
const ignored = new Set(['node_modules', '.git', 'dist', '__MACOSX', '.vite']);


function npm(args, cwd) {
  // Use cmd explicitly on Windows because npm is normally a .cmd shim.
  const command = process.platform === 'win32' ? 'cmd.exe' : 'npm';
  const commandArgs = process.platform === 'win32'
    ? ['/d', '/s', '/c', `npm ${args.join(' ')}`]
    : args;
  const result = spawnSync(command, commandArgs, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`npm ${args.join(' ')} failed in ${cwd} (exit ${result.status})`);
  }
}

async function migrateArchivedSource(directory) {
  if (!existsSync(directory)) return;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!ignored.has(entry.name)) await migrateArchivedSource(filename);
    } else if (/\.[cm]?[jt]sx?$/.test(entry.name)) {
      const original = await readFile(filename, 'utf8');
      const migrated = migrateThreeSource(original);
      if (migrated !== original) await writeFile(filename, migrated);
    }
  }
}

async function buildLegacyMechanicsPage(source) {
  const htmlPath = path.join(source, 'public/periodontics-mechanics.html');
  if (!existsSync(htmlPath)) return;
  const original = await readFile(htmlPath, 'utf8');
  if (!original.includes('cdn.tailwindcss.com') && !original.includes('./periodontics-mechanics.css')) return;
  await writeFile(htmlPath, migrateLegacyMechanicsHtml(original));
  const input = path.join(source, 'public/.periodontics-mechanics.input.css');
  await writeFile(input, `@import "tailwindcss" source(none);\n@source "./periodontics-mechanics.html";\n@custom-variant dark (&:where(.dark, .dark *));\n@theme { --color-slate-850: #151f32; --color-slate-950: #060a12; }\n`);
  try {
    // The source lives under OneDrive paths containing spaces: pass paths to Node
    // directly instead of interpolating them into the Windows npm shell command.
    const cli = path.join(root, 'scripts/node_modules/@tailwindcss/cli/dist/index.mjs');
    const result = spawnSync(process.execPath, [cli, '-i', input, '-o', path.join(source, 'public/periodontics-mechanics.css'), '--minify'], { cwd: root, stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error('Failed to compile the standalone Periodontics page styles');
  } finally {
    await rm(input, { force: true });
  }
}

async function buildModule(module) {
  const source = await resolveModuleSource(root, module);
  console.log(`\n=== ${module.name}: ${path.relative(root, source)} ===`);
  const manifest = path.join(source, 'package.json');
  const pkg = JSON.parse(await readFile(manifest, 'utf8'));
  const fixes = [...fixKnownDependencyConflicts(pkg), ...applyInstallScriptPolicy(pkg)];
  if (fixes.length) {
    await writeFile(manifest, `${JSON.stringify(pkg, null, 2)}\n`);
    for (const fix of fixes) console.log(`Dependency fix: ${fix}`);
  }
  npm(['install', '--no-audit', '--no-fund'], source);
  await migrateArchivedSource(path.join(source, 'src'));
  await buildLegacyMechanicsPage(source);

  const configNames = ['vite.config.ts', 'vite.config.js', 'vite.config.mts', 'vite.config.mjs', 'vite.config.cts', 'vite.config.cjs'];
  const configName = configNames.find(name => existsSync(path.join(source, name)));
  if (configName) {
    const configPath = path.join(source, configName);
    const original = await readFile(configPath, 'utf8');
    const migrated = migrateLegacyViteConfig(original);
    if (migrated !== original) await writeFile(configPath, migrated);
  }
  const optionsImport = path.relative(source, path.join(root, 'scripts/vite-pages-options.mjs')).split(path.sep).join('/');
  const wrapper = path.join(source, '.vite.pages.config.mts');
  const originalImport = configName
    ? `import original from ${JSON.stringify(`./${configName}`)};`
    : 'const original = {};';
  const config = `import { defineConfig, mergeConfig } from 'vite';
import { pagesBuildOptions } from ${JSON.stringify(optionsImport.startsWith('.') ? optionsImport : `./${optionsImport}`)};
${originalImport}

// Keep the original plugins, aliases, and environment handling intact.
export default defineConfig(async (env) => {
  const existing = await (typeof original === 'function' ? original(env) : original);
  return mergeConfig(existing, {
    base: './',
    build: {
      ...pagesBuildOptions,
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false
    }
  });
});
`;
  await writeFile(wrapper, config);
  try {
    // Standard scripts such as "tsc -b && vite build" forward these flags to Vite.
    npm(['run', 'build', '--', '--config', '.vite.pages.config.mts'], source);
    const dist = path.join(source, 'dist');
    if (!existsSync(path.join(dist, 'index.html'))) {
      throw new Error(`${module.name} did not produce dist/index.html. Check its build script and Vite root setting.`);
    }
    await cp(dist, path.join(output, module.directory), { recursive: true });
  } finally {
    await rm(wrapper, { force: true });
  }
}

try {
  // Resolve sources before deleting the previous site's generated output.
  for (const module of modules) {
    await resolveModuleSource(root, module);
  }
  if (!existsSync(path.join(root, 'scripts/node_modules/@tailwindcss/cli/package.json'))) {
    npm(['ci', '--prefix', 'scripts', '--no-audit', '--no-fund'], root);
  }
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  for (const file of ['index.html', 'lunch.js', 'subject.html']) {
    await cp(path.join(root, file), path.join(output, file));
  }
  npm(['exec', '--prefix', 'scripts', '--', 'tailwindcss', '-i', 'scripts/landing.css', '-o', '_site/landing.css', '--minify'], root);
  for (const module of modules) await buildModule(module);
  await writeFile(path.join(output, '.nojekyll'), '');
  console.log('\nProduction site ready in _site/. Run: node --test scripts/pages.test.mjs');
} catch (error) {
  console.error(`\nPages build failed: ${error.message}`);
  process.exitCode = 1;
}
