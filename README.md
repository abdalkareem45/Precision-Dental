# Precision Dental

A static dental-learning website with a shared subject launcher and nine Vite
apps, deployed to GitHub Pages. All nine apps are maintained as extracted source;
ZIP files are local backups, not build inputs.

- [Deployment, testing, and security guide](DEPLOYMENT.md)
- [Full intended-source inventory](REPOSITORY_CONTENTS.md), generated with
  `node scripts/list-repository.mjs`

Run commands from this `website/` directory. The inventory describes what belongs
in source control, not everything on disk or the generated deployment artifact.
Regenerate it when intended source files change.

## Keep and commit

Keep the complete maintained source trees below, including application code,
assets, public files, configuration, `package.json`, and `package-lock.json` in
each mapped app. Nested wrappers are intentional; do not flatten or rename them
without updating the explicit source mapping.

| Subject | Maintained app path |
| --- | --- |
| Crown & Bridge | `crown/` |
| Endodontics | `endo-1-main/` |
| Oral Surgery | `oral surgery/` |
| Oral Medicine | `oral-med-12-main/oral-med-12-main/` |
| Orthodontics | `orthodontics-main/orthodontics-main/` |
| Pediatric Dentistry | `peidatiric-10-main/peidatiric-10-main/` |
| Periodontics | `perio-1-2-3-4-5-6-7-8--main/perio-1-2-3-4-5-6-7-8--main/` |
| Preventive Dentistry | `prevention-1-9--main/prevention-1-9--main/` |
| Prosthodontics | `pros-main/` |

Also commit:

- Root pages: `index.html`, `lunch.js`, and `subject.html`.
- Documentation: `README.md`, `DEPLOYMENT.md`, and `REPOSITORY_CONTENTS.md`.
- `scripts/`: explicit mapping in `modules.json`, source validator, build scripts,
  inventory generator, styles, preview/test helpers, tests, and npm manifest/lock.
- `.github/` workflows, `.zed/` editor settings, and `.gitignore`.

Preserve Endodontics' integrated Lecture 1/Lecture 2 app in `endo-1-main/` and the
fixed Prosthodontics Vite app in `pros-main/`. Do not replace either with a raw
export. Keep npm `package-lock.json` files for **all nine apps**, not just these
two, and for the build/test tools in `scripts/`.

## Exclude from commits — do not delete

The following stay local and are ignored; no cleanup deletion is required:

| Local content | Why excluded |
| --- | --- |
| Root `/*.zip` backups | Sources are already extracted and maintained |
| `/endo-2-/` | Raw Lecture 2 export; integrated into `endo-1-main/` |
| `/pros/` | Raw export; use the fixed `pros-main/` app |
| `/endo-1-main/endo-1-main/` | Duplicate nested Endodontics export |
| `bun.lock`, `.aistudio` | Unused lockfile/export metadata |
| `.build-sources/` | Obsolete temporary sources, never a build fallback |
| `_site/`, `dist/`, `node_modules/` | Generated site, app output, installed dependencies |
| Vite caches/wrappers, build metadata, OS files | Generated/local-only content |
| `.env`, `.env.*` other than reviewed `.env.example` | Local configuration and secrets |

Ignore rules do not untrack previously committed files. If working in an existing
repository, review tracked exclusions before changing the index; see
[DEPLOYMENT.md](DEPLOYMENT.md#review-and-commit-the-source-inventory). Never delete
source or backups just to prepare a commit, and never force-add ignored content.

## Build and check

Use Node.js 22.12+, npm 11.19.1, and Python 3. Full prerequisites, browser setup,
audits, preview instructions, and failure recovery are in [DEPLOYMENT.md](DEPLOYMENT.md).

```sh
python scripts/prepare-modules.py
node scripts/build-pages.mjs
node --test scripts/module-source.test.mjs scripts/dependency-fixes.test.mjs scripts/vite-pages-options.test.mjs scripts/pages.test.mjs
```

The preparation script validates explicit source paths; it does not extract ZIPs.
The build requires those paths and never uses stale `.build-sources/` contents.
`scripts/modules.json` keeps source paths separate from public `directory` values,
so the existing subject URLs stay unchanged. Only generated `_site/` is deployed.
Builds can update maintained source/configuration and npm lockfiles through narrow
compatibility migrations and installation; review these changes before committing.

These are commands to run, not a claim that a fresh build or tests have passed.
Only build trusted code. Browser bundles and `VITE_*` values are public; never
embed private API keys. Review public assets and staged source for secrets.

## Inventory and staging

This extracted workspace currently has no `.git` directory. For optional
first-time setup, see [DEPLOYMENT.md](DEPLOYMENT.md#first-time-git-setup-optional).
The staging commands below require an initialized Git repository. First generate
the inventory:

```sh
node scripts/list-repository.mjs
```

Review `REPOSITORY_CONTENTS.md`, then explicitly stage all nine root folders and
supporting files (including the quoted folder with a space):

```sh
git --no-optional-locks status
git --no-pager branch --show-current
git --no-pager remote -v
git add -- index.html lunch.js subject.html .gitignore README.md DEPLOYMENT.md REPOSITORY_CONTENTS.md scripts .github .zed crown endo-1-main "oral surgery" oral-med-12-main orthodontics-main peidatiric-10-main perio-1-2-3-4-5-6-7-8--main prevention-1-9--main pros-main
git --no-pager diff --cached --stat
git --no-pager diff --cached --name-status
git --no-pager diff --cached
```

Do not stage ZIPs, raw duplicates, generated output, dependencies, or secrets.
See [DEPLOYMENT.md](DEPLOYMENT.md) for intentional commit instructions and the
separate GitHub Pages publishing workflow; nothing here initializes or pushes Git.
