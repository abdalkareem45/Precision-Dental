// These archived apps declare Vite 8.3 alongside an incompatible direct esbuild.
// Match only the known conflicting ranges; do not bypass npm peer validation.
export function fixKnownDependencyConflicts(pkg) {
  const vite = pkg.dependencies?.vite ?? pkg.devDependencies?.vite;
  const changes = [];

  if (!/^[~^]?8\.3(?:\.|$)/.test(vite ?? '')) return changes;
  for (const section of ['dependencies', 'devDependencies']) {
    const previous = pkg[section]?.esbuild;
    if (!/^[~^]?0\.25(?:\.|$)/.test(previous ?? '')) continue;
    pkg[section].esbuild = '^0.28.0';
    changes.push(`${section}.esbuild: ${previous} -> ^0.28.0 (Vite 8.3 peer compatibility)`);
  }
  return changes;
}

export function applyInstallScriptPolicy(pkg) {
  const changes = [];
  const policy = { 'esbuild@0.28.2': true, '@google/genai': false, protobufjs: false };
  for (const [dependency, allowed] of Object.entries(policy)) {
    const name = dependency.startsWith('esbuild@') ? 'esbuild' : dependency;
    // Preserve existing package-owner decisions, including an unversioned deny.
    if (Object.hasOwn(pkg.allowScripts ?? {}, dependency) || Object.hasOwn(pkg.allowScripts ?? {}, name)) continue;
    pkg.allowScripts ??= {};
    pkg.allowScripts[dependency] = allowed;
    changes.push(`Install-script policy: ${dependency} -> ${allowed ? 'allow reviewed installer' : 'deny unnecessary script'}`);
  }
  return changes;
}
