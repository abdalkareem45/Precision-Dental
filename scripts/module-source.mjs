import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function resolveModuleSource(root, module) {
  if (typeof module.source !== 'string' || !module.source) {
    throw new Error(`Missing source mapping for ${module.name} in scripts/modules.json`);
  }
  const source = path.resolve(root, module.source);
  const relative = path.relative(root, source);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Invalid source mapping for ${module.name}: ${module.source}`);
  }
  let pkg;
  try {
    pkg = JSON.parse(await readFile(path.join(source, 'package.json'), 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read ${module.name} source at ${module.source}/package.json. Restore the source or update scripts/modules.json; temporary builds are not used as a fallback. ${error.message}`);
  }
  if (!pkg.scripts?.build || !(pkg.devDependencies?.vite || pkg.dependencies?.vite)) {
    throw new Error(`${module.name}: ${module.source} must contain a Vite app with a build script`);
  }
  return source;
}
