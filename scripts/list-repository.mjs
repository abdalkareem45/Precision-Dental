import { readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const excludedNames = new Set([
  '.git', 'node_modules', 'dist', 'build', '.build-sources', '_site', '.vite',
  '.aistudio', '__pycache__', '.DS_Store', 'Thumbs.db', 'bun.lock', 'bun.lockb',
  '.vite.pages.config.mts',
]);
const excludedPaths = new Set(['endo-2-', 'pros', 'endo-1-main/endo-1-main']);
const outputName = 'REPOSITORY_CONTENTS.md';
const lines = ['website/'];
let files = 0;

function excluded(name, relative) {
  return excludedNames.has(name) || excludedPaths.has(relative)
    || (/^\.env(?:\.|$)/.test(name) && name !== '.env.example')
    || /(?:\.zip|\.pyc|\.tsbuildinfo|\.log)$/.test(name)
    || name.startsWith('npm-debug.log');
}

async function walk(directory, prefix = '') {
  const entries = (await readdir(directory, { withFileTypes: true }))
    .filter(entry => !excluded(entry.name, path.relative(root, path.join(directory, entry.name)).split(path.sep).join('/')))
    .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name, 'en'));
  // Include the inventory itself on its first run, too.
  if (directory === root && !entries.some(entry => entry.name === outputName)) {
    entries.push({ name: outputName, isDirectory: () => false, isSymbolicLink: () => false });
    entries.sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name, 'en'));
  }
  for (const [index, entry] of entries.entries()) {
    const last = index === entries.length - 1;
    lines.push(`${prefix}${last ? '\\-- ' : '+-- '}${entry.name}${entry.isDirectory() ? '/' : ''}`);
    if (entry.isDirectory() && !entry.isSymbolicLink()) {
      await walk(path.join(directory, entry.name), `${prefix}${last ? '    ' : '|   '}`);
    } else {
      files++;
    }
  }
}

await walk(root);
await writeFile(path.join(root, outputName), `# Repository source inventory\n\nGenerated with \`node scripts/list-repository.mjs\`.\n\nThis lists the current intended source files, not Git's tracked status. It excludes\ndependencies, generated builds, ZIP backups, duplicate extractions, local secrets,\nand npm-unused Bun lockfiles. No files are deleted by this command.\n\n${files} files. Regenerate after adding lectures or other files.\n\n\`\`\`text\n${lines.join('\n')}\n\`\`\`\n`);
console.log(`Wrote ${outputName} (${files} files; dependencies, builds, backups and secrets excluded).`);
