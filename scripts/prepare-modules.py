"""Validate extracted module sources without changing or overwriting any files."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODULES = json.loads((ROOT / "scripts/modules.json").read_text(encoding="utf-8"))


def prepare():
    for module in MODULES:
        configured = module.get("source")
        if not isinstance(configured, str) or not configured:
            raise ValueError(f'Missing source mapping for {module["name"]}')
        source = (ROOT / configured).resolve()
        if source == ROOT or not source.is_relative_to(ROOT):
            raise ValueError(f'Invalid source mapping: {configured}')
        manifest = source / "package.json"
        if not manifest.is_file():
            raise FileNotFoundError(
                f'Missing {module["name"]} source: {manifest}. '
                'Restore the extracted source or update scripts/modules.json. '
                'ZIPs and temporary builds are no longer required or used.'
            )
        package = json.loads(manifest.read_text(encoding="utf-8"))
        if not package.get("scripts", {}).get("build") or not (
            package.get("devDependencies", {}).get("vite")
            or package.get("dependencies", {}).get("vite")
        ):
            raise ValueError(f'Expected a Vite app with a build script: {manifest}')
        print(f'Using {module["name"]}: {configured}', flush=True)


if __name__ == "__main__":
    prepare()
