// Keep the normal 500 kB Vite warning budget. Split real modules rather than
// increasing that limit, and retain the boundaries between lazy-loaded lectures.
export const pagesBuildOptions = {
  rolldownOptions: {
    output: {
      codeSplitting: {
        groups: [
          { name: 'vendor', test: /node_modules/, maxSize: 350_000, entriesAware: true },
          { name: 'app', test: /[\\/]src[\\/]/, maxSize: 350_000, entriesAware: true },
        ],
      },
    },
  },
};

export function migrateThreeSource(source) {
  let migrated = source.replaceAll('THREE.PCFSoftShadowMap', 'THREE.PCFShadowMap');
  if (migrated.includes('let clock = new THREE.Clock();') && migrated.includes('const delta = clock.getDelta();')) {
    migrated = migrated
      .replace('let clock = new THREE.Clock();', 'const clock = new THREE.Timer();')
      .replace('const delta = clock.getDelta();', 'clock.update();\n      const delta = clock.getDelta();')
      .replace('cancelAnimationFrame(animId);', 'cancelAnimationFrame(animId);\n      clock.dispose();');
  }
  if (migrated.includes('const clock = new THREE.Timer();')) {
    migrated = migrated.replaceAll('clock.getElapsedTime()', 'clock.getElapsed()');
  }
  return migrated;
}

export function migrateLegacyMechanicsHtml(html) {
  return html
    .replace('<script src="https://cdn.tailwindcss.com"></script>', '<link rel="stylesheet" href="./periodontics-mechanics.css" />')
    .replace(/<script>\s*tailwind\.config\s*=[\s\S]*?<\/script>\s*/, '');
}

export function migrateLegacyViteConfig(config) {
  const legacyAlias = "path.resolve(__dirname, '.')";
  if (!config.includes(legacyAlias) || !config.includes("import path from 'path';")) return config;
  // Only migrate the known archive template, not arbitrary uses of Node's path API.
  const withoutAlias = config.replaceAll(legacyAlias, '');
  if (/\bpath\./.test(withoutAlias)) return config;
  return config
    .replace("import path from 'path';", "import {fileURLToPath} from 'node:url';")
    .replaceAll(legacyAlias, "fileURLToPath(new URL('.', import.meta.url))");
}
