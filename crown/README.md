# Precision Dental — Crown & Bridge

This maintained subject combines the three original lectures with nine imported
virtual simulation modules. No backend or API key is required. Source is built
with React, TypeScript, Tailwind, Three.js and Zustand; only static output is
published by the shared GitHub Pages workflow.

## Modules and direct links

All links use the unchanged public subject directory
`f367df11cf62a3147e0a171e3f35c4a0333a68f9/index.html` followed by a hash:

| Hash | Topic |
| --- | --- |
| `#lecture-1` | Crown & Bridge fundamentals |
| `#lecture-2` | Evaluation of abutment teeth |
| `#lecture-3` | Periodontal support & Ante's Law |
| `#lecture-4` | FPD biomechanics |
| `#lecture-5` | Bridge retainers and tooth preparation |
| `#lecture-6` | Pontics, ridge assessment and connectors |
| `#lecture-7a` | Fluid control and soft-tissue management |
| `#lecture-7b` | Final impressions and disinfection |
| `#lecture-10a` | Provisional restorations |
| `#lecture-10b` | Bite registration, occlusion and articulators |
| `#lecture-11` | Shade selection and color science |
| `#lecture-12` | Try-in, marginal evaluation and cementation |

There are **12 selectable learning modules**, not a newly invented consecutive
set of lectures. The supplied numbering includes split 7A/7B and 10A/10B; no
Lectures 8 or 9 were supplied. Empty or unknown hashes open the overview.

`src/App.tsx` owns navigation and titles; `src/navigation.ts` is the combined
registry. Original lecture content is preserved in `src/Foundations.tsx` with
parent-controlled lecture selection. New code lives under
`src/lectures/virtual-lab/`; PDF links use `import.meta.env.BASE_URL` and assets in
`public/assets/crown-virtual-lab/`. Source PDFs retain their original wording.

Each imported module has a 3D model, four 2D sandboxes, ten visual modules,
a four-question quiz, and a source PDF. Progress is saved locally when browser
storage is available. The progress dashboard covers only the nine virtual-lab
modules, not the three original lectures. Clear it with **Reset All Progress**.

## Development

From the repository root:

```sh
npm --prefix crown install
npm --prefix crown run dev
```

The development server runs until stopped with Ctrl+C. The All subjects link is
intended for the combined site, not the isolated Vite server.

## Validation

From the repository root:

```sh
npm --prefix crown run lint
node crown/src/lectures/virtual-lab/tests/run.mjs
node scripts/build-pages.mjs
node --test scripts/module-source.test.mjs scripts/dependency-fixes.test.mjs scripts/vite-pages-options.test.mjs scripts/pages.test.mjs
node --test --test-concurrency=1 scripts/crown.browser.test.mjs scripts/endodontics.browser.test.mjs scripts/orthodontics.browser.test.mjs scripts/subjects.browser.test.mjs
npm audit --prefix crown --audit-level=high
```

Browser checks require the built `_site/` plus the existing Playwright setup;
see root `DEPLOYMENT.md`. Software-rendered WebGL suites run sequentially to avoid
CPU contention on CI. Checks cover desktop/mobile content, scene rendering,
controls, quizzes, progress, PDFs and repository-prefixed navigation, not medical
validity or every possible graphics-driver configuration.

All simulations and simplified metrics are educational, not patient-specific
clinical recommendations. Source-derived thresholds, techniques and materials
require qualified clinical review before clinical use. Preserve source and npm
lockfiles in Git; do not commit ZIP backups, dependencies, or generated builds.
