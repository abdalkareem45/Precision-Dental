# Precision Dental — GitHub Pages deployment

See [README.md](README.md) for what to keep and commit, and
[REPOSITORY_CONTENTS.md](REPOSITORY_CONTENTS.md) for the generated intended-source
inventory. Run commands below from the `website/` repository root.

## Source layout and public URLs

All nine apps are maintained as extracted source trees, with their
`package.json` and `package-lock.json` files committed. No ZIP extraction is
required for setup or CI. `scripts/modules.json` explicitly maps each `source`
path to its existing public `directory`; these values serve different purposes.
Do not rename public directories to match source folders: existing subject links
must keep working.

| Subject | Maintained source path | Public directory under `_site/` |
| --- | --- | --- |
| Crown & Bridge | `crown/` | `f367df11cf62a3147e0a171e3f35c4a0333a68f9/` |
| Endodontics | `endo-1-main/` | `endo-1-main/` |
| Oral Surgery | `oral surgery/` | `fe3afe4e5c5b6834c6eebbbcda33fefa5ca06160/` |
| Oral Medicine | `oral-med-12-main/oral-med-12-main/` | `oral-med-12-main/` |
| Orthodontics | `orthodontics-main/orthodontics-main/` | `8666a648e8a3f5a983a00b19e5cc39db2ef0d29c/` |
| Pediatric Dentistry | `peidatiric-10-main/peidatiric-10-main/` | `40b5e7081aa8886e9b639e3dff92927c51b00497/` |
| Periodontics | `perio-1-2-3-4-5-6-7-8--main/perio-1-2-3-4-5-6-7-8--main/` | `perio-1-2-3-4-5-6-7-8--main/` |
| Preventive Dentistry | `prevention-1-9--main/prevention-1-9--main/` | `prevention-main/` |
| Prosthodontics | `pros-main/` | `pros-main/` |

The nested paths and spelling above reflect the actual extracted layout; keep
those wrappers unless deliberately updating the source mapping. The build
requires each explicit source and must fail if it is missing or invalid. It must
never fall back to old `.build-sources/` contents or local ZIPs.

Endodontics contains both integrated lectures in `endo-1-main/`. Preserve that
app rather than replacing it with the old nested copy or raw Lecture 2 export.
Preserve the fixed Vite app in `pros-main/`, not the raw `pros/` export.

The landing page is `index.html`, loading `./lunch.js` before `</body>`. Its
keyboard-accessible subject links open `subject.html?id=LAUNCH_CODE`, which
validates the ID and redirects to `./LAUNCH_CODE/index.html`. Links retain the
repository prefix on project Pages. Landing-page Tailwind styles are compiled
locally into `_site/landing.css`, not loaded from the development CDN.

## Prerequisites

- Node.js 22.12+ with npm on PATH. GitHub Actions uses npm 11.19.1, matching
  the explicit dependency install-script policies. For equivalent enforcement,
  use `npm install --global npm@11.19.1` locally.
- Python 3 on PATH (`python` below; use `python3` where appropriate).
- Git for source control and, optionally, the GitHub CLI (`gh`).
- Internet access for npm packages, browser installation, and GitHub deployment.

Only install and build trusted source: dependency lifecycle scripts and project
build scripts can execute code. The narrow compatibility fix handles manifests
that declare Vite `^8.3.0` with incompatible direct esbuild `^0.25.0`, replacing
the latter with `^0.28.0`. It does not use `--force` or `--legacy-peer-deps`.

## Build locally

```sh
node --version
npm --version
python --version
python scripts/prepare-modules.py
node scripts/build-pages.mjs
node --test scripts/module-source.test.mjs scripts/dependency-fixes.test.mjs scripts/vite-pages-options.test.mjs scripts/pages.test.mjs
```

`prepare-modules.py` validates the explicit source paths in
`scripts/modules.json`; it does not extract archives or refresh temporary copies.
If validation fails, restore the tracked source at the mapped path or correct the
mapping after reviewing the intended app. Do not use `.build-sources/` as a fix.

`build-pages.mjs` validates sources before replacing the previous generated site.
It installs the locked build tools if the Tailwind CLI is missing and compiles
`scripts/landing.css` into `_site/landing.css`. For each of the nine mapped apps,
it then:

1. Uses the explicit `source` path, not the public `directory` as a source lookup.
2. Applies the narrow compatibility fix and install-script policy from
   `scripts/dependency-fixes.mjs`, then runs
   `npm install --no-audit --no-fund`. npm updates lockfiles normally. Review and
   commit relevant manifest/lockfile changes for **all nine** maintained apps.
3. Applies the known Three.js shadow-map/Clock migrations, including Timer
   updates and disposal, and compiles local styles for the standalone
   Periodontics mechanics page. These targeted migrations operate on maintained
   source, so review resulting source changes as well.
4. Generates `.vite.pages.config.mts` beside the app's original Vite config.
   This wrapper imports the original object/async config function, preserves
   plugins and aliases, and overrides:

   ```ts
   base: './',
   build: { outDir: 'dist', emptyOutDir: true, sourcemap: false }
   ```

   Shared options in `scripts/vite-pages-options.mjs` split application/vendor
   modules while preserving lazy lecture boundaries. The normal Vite 500 kB
   warning limit remains unchanged. The known legacy Vite template is migrated
   from `__dirname` to ESM-safe paths; custom configs with other path API usages
   are left unchanged. The generated wrapper is removed after the build attempt.
5. Runs `npm run build -- --config .vite.pages.config.mts`.
6. Copies the app's `dist/` contents into `_site/<directory>/` using its unchanged
   public directory value, never over the source entry HTML.

The app build scripts must forward Vite flags normally, e.g. `"build": "vite build"`
or `"build": "tsc -b && vite build"`. Update a custom build wrapper to forward
those flags if necessary. A nonstandard Vite `root` must still produce
`<source-path>/dist/index.html`; otherwise adjust its config/build script first.
The build stops if any app fails.

The result is:

```text
_site/
  .nojekyll
  index.html
  lunch.js
  landing.css
  subject.html
  f367df11cf62a3147e0a171e3f35c4a0333a68f9/index.html
  endo-1-main/index.html
  fe3afe4e5c5b6834c6eebbbcda33fefa5ca06160/index.html
  oral-med-12-main/index.html
  8666a648e8a3f5a983a00b19e5cc39db2ef0d29c/index.html
  40b5e7081aa8886e9b639e3dff92927c51b00497/index.html
  perio-1-2-3-4-5-6-7-8--main/index.html
  prevention-main/index.html
  pros-main/index.html
  ...each app's assets and public files...
```

`_site/` is regenerated from scratch. Source entry HTML remains source, not
compiled deployment HTML. Do not commit `_site/`, app `dist/`, or dependencies.

## Production checks and local preview

The Node tests above cover subject links, repository-prefixed redirects, invalid
IDs, module entry points, generated HTML asset references, and accidental
source/dependency files in the deployment artifact. They do not scan every asset
URL constructed dynamically in JavaScript or replace testing every tool.

Optional local preview (a long-running server; stop with Ctrl+C):

```sh
python -m http.server 8080 --directory _site
```

Open `http://localhost:8080/` and test all nine cards. Also test the actual
repository-prefixed deployed URL; a domain-root preview alone cannot prove that
runtime paths work under a Pages project prefix.

Endodontics opens a two-lecture selector at `endo-1-main/index.html`. Direct
links use `#lecture-1` and `#lecture-2`, surviving refresh without server routing.
Both lectures are lazy-loaded. See `endo-1-main/README.md` for source locations
and development commands.

For automated desktop/mobile browser checks after a complete build:

```sh
npm ci --prefix scripts --no-audit --no-fund
node scripts/node_modules/playwright/cli.js install chromium
node --test scripts/endodontics.browser.test.mjs scripts/subjects.browser.test.mjs
npm --prefix endo-1-main run lint
npm --prefix pros-main run lint
```

On Windows, browser tests use installed Google Chrome; on Linux they use
Playwright's Chromium. Linux hosts may need browser system dependencies:

```sh
node scripts/node_modules/playwright/cli.js install --with-deps chromium
```

Browser tests start and stop their own repository-prefixed preview server.
GitHub Actions runs all nine subject startup checks, mobile landing checks,
detailed Endodontics interactions, standalone Periodontics checks, and the
Endodontics/Prosthodontics TypeScript checks before deployment. It also audits
those two apps and the build tools:

```sh
npm audit --prefix endo-1-main --audit-level=high
npm audit --prefix pros-main --audit-level=high
npm audit --prefix scripts --audit-level=high
```

These audits are not a claim that every module or external service has been
security-reviewed. Browser/build tooling is development-only and not published.
The commands here describe validation to run; they do not assert a new successful
build or test run.

## Zed editor support

`.zed/settings.json` uses the Endodontics TypeScript 5.9 SDK and Zed's
Tailwind-aware CSS language server. This preserves CSS validation while
recognizing Tailwind 4 directives rather than globally suppressing unknown
at-rule warnings. Install the relevant app's dependencies before opening source;
after the initial install, restart the language server if resolution is stale.

## Review and commit the source inventory

This extracted workspace currently has no `.git` directory. Do not run staging,
commit, or push commands here until it is associated with the intended Git
repository. No repository initialization, remote creation, or push is performed
by the preparation/build/inventory workflow. Decide the intended repository and
visibility separately; public repositories expose committed source and history.

Generate the intended-source inventory after source/documentation changes:

```sh
node scripts/list-repository.mjs
```

Review the resulting [REPOSITORY_CONTENTS.md](REPOSITORY_CONTENTS.md). It lists
intended repository contents, not ZIP backups, ignored dependencies, or production
output. Regenerate it when adding, removing, or moving intended source files.
Review it alongside the staged diff; it is not a substitute for a secrets review.

Once working in the intended existing Git repository, inspect the branch and
remote, then stage these explicit paths (the space in `oral surgery` is quoted):

```sh
git --no-optional-locks status
git --no-pager branch --show-current
git --no-pager remote -v
git add -- index.html lunch.js subject.html .gitignore README.md DEPLOYMENT.md REPOSITORY_CONTENTS.md scripts .github .zed crown endo-1-main "oral surgery" oral-med-12-main orthodontics-main peidatiric-10-main perio-1-2-3-4-5-6-7-8--main prevention-1-9--main pros-main
git --no-pager diff --cached --stat
git --no-pager diff --cached --name-status
git --no-pager diff --cached
```

Commit the nine complete maintained source trees, including source assets,
configuration, package manifests and every app's `package-lock.json`, plus the
`scripts/` manifest/lockfile and tooling. Do not stage private `.env` files;
review `.env.example` and any public assets for secrets too.

Keep these local files out of the commit; **do not delete them** as part of setup:

- Root ZIP backups (`/*.zip`). They are no longer build inputs.
- Raw duplicate `/endo-2-/`, `/pros/`, and `/endo-1-main/endo-1-main/`.
- `bun.lock` and `.aistudio` metadata; npm lockfiles are the maintained locks.
- `.build-sources/`, `_site/`, `node_modules/`, `dist/`, Vite caches/generated
  deployment wrappers, and other generated output covered by `.gitignore`.
- Local secrets and OS metadata.

Ignoring a path does not untrack it if it was committed previously. In an existing
repository, inspect any such tracked paths individually and, only if appropriate,
remove them from Git's index with `git rm -r --cached -- <reviewed-path>`.
`--cached` retains the local files; do not use a broad deletion command.

After reviewing staged contents, an intentional commit can be made with:

```sh
GIT_EDITOR=true git commit -m "Track extracted dental module sources"
```

The `GIT_EDITOR=true` prefix is POSIX/Git Bash syntax. In PowerShell, set
`$env:GIT_EDITOR = 'true'` before invoking the same `git commit` command without
the prefix. No push is required for the local inventory/documentation task.
For a later authorized deployment, confirm the destination remote and branch
before pushing. The workflow listens to `main`; if your deployment branch differs,
update `on.push.branches` in `.github/workflows/deploy.yml` deliberately.

### First-time Git setup (optional)

If this folder is not already a Git repository, initialize it only when ready to
publish. These commands create a **public** GitHub repository; review secrets,
content ownership and the staging list above first. GitHub CLI login is interactive.

```sh
git init -b main
gh auth login
```

Then run the explicit `git add` and staged-diff review commands above. In
PowerShell, commit and publish with:

```powershell
$env:GIT_EDITOR = 'true'
git commit -m "Track extracted dental module sources"
gh repo create precision-dental --public --source=. --remote=origin --push
```

For an existing linked repository, after reviewing the branch and remote:

```sh
git push -u origin HEAD
```

No Git initialization, commit, push, or remote deployment has been performed by
this workspace update.

## Enable Pages and deploy

After source has intentionally been published to the intended GitHub repository:

1. Open the repository → **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Open **Actions → Deploy Precision Dental to GitHub Pages → Run workflow**.
   A manual run is useful if the source push preceded enabling Pages.
4. Check that both `build` and `deploy` complete. The deployment job outputs the
   live URL. Later pushes to the configured branch deploy automatically.

Optional GitHub CLI commands, from the linked repository:

```sh
gh workflow run deploy.yml
gh run list --workflow deploy.yml --limit 5
```

For a repository named `precision-dental`, a typical project URL is
`https://YOUR_GITHUB_USERNAME.github.io/precision-dental/`. Use the actual URL
shown by the deployment job; user/organization Pages repositories have a different
base path. No username/repository value needs hardcoding in the scripts.

This uses official **GitHub Actions artifact deployment**, not a `gh-pages`
source branch. Only `_site/` is uploaded. Source trees, ZIPs, build scripts,
dependencies, and `.github/` are not uploaded as source directories. Assets in an
app's `public/` directory can still be copied into the build, so inspect those
contents. There is no deploy branch to clean or force-push. Keep all nine source
trees and npm lockfiles on the source branch so a clean checkout can rebuild.
The module build uses `npm install`; committing lockfiles does not make it a
strict `npm ci` install. Review updates rather than assuming locks never change.

## Recovering from a failed or interrupted build

- Missing source: restore the mapped tracked source and its package files, then
  rerun validation. Old ZIPs or `.build-sources/` copies are not fallback inputs.
- Known Vite/esbuild `ERESOLVE`: rerun with the current compatibility scripts;
  do not bypass dependency validation with force flags.
- Interrupted installation/build: rerun the build. It may take several minutes
  across all nine apps; review resulting maintained-source/lockfile changes.

```sh
python scripts/prepare-modules.py
node scripts/build-pages.mjs
node --test scripts/dependency-fixes.test.mjs scripts/vite-pages-options.test.mjs scripts/pages.test.mjs
```

Wait for `Production site ready in _site/` before production tests. A missing
`.nojekyll` / `Run the complete build first` error means the build is incomplete,
not a separate navigation failure. No archive re-extraction is necessary.

## Module-specific deployment and security checks

- `base: './'` fixes Vite-generated asset paths. Hardcoded runtime fetch/image
  paths such as `/assets/photo.png` still need source changes. Prefer imports for
  bundled assets and `import.meta.env.BASE_URL` for public assets. Test under
  the actual repository prefix.
- Pages cannot resolve `BrowserRouter` deep URLs on refresh. Use `HashRouter`
  where appropriate after inspecting the app; no global 404 redirect is added.
- Pages cannot run backends. Host APIs elsewhere with HTTPS and suitable CORS.
  Never embed private keys in `VITE_*` variables: compiled browser JavaScript is
  public. Do not commit local `.env` files or place secrets in public assets.
- Landing styles are compiled locally. Google Fonts and Font Awesome still use
  external services, requiring network access and sending requests to those
  providers; system fonts remain a fallback.
- Install-script policies allow the reviewed esbuild `0.28.2` installer and deny
  unnecessary Google AI/protobuf lifecycle scripts. The build-tool watcher
  fallback build script is denied in favor of prebuilt binaries. Existing owner
  decisions are preserved. Review future unapproved versions individually;
  never blanket-approve dependency scripts.
- The tooling lockfile overrides `@parcel/watcher` to a compatible fixed 2.6.x
  release to avoid the vulnerable braces/micromatch dependency chain.
- Fresh installs may print an upstream `node-domexception` deprecation from AI
  SDK dependencies. Do not add a shim or force incompatible upgrades just to
  hide an upstream notice.
- Dependency, TypeScript, or application errors must be fixed in the maintained
  source path and retested. Deployment deliberately fails if any app fails.
