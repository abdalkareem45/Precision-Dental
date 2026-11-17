# Precision Dental — Orthodontics

This maintained subject app contains Lectures 1–7. Lectures 1 and 2 share the
original history/examination view; Lecture 3 and the original virtual lab,
clinical cases, and board review remain available.

## Added lectures

| Hash | Lecture |
| --- | --- |
| `#lecture-4` | Temporomandibular Disorders (TMDs) |
| `#lecture-5` | Lateral Cephalometrics |
| `#lecture-6` | Orthopantomogram (OPG) |
| `#lecture-7` | Orthodontic Study Models & Analyses |

The public subject directory remains
`8666a648e8a3f5a983a00b19e5cc39db2ef0d29c/`, not the source folder name.
`#lecture-1` and `#lecture-2` open the combined original view; `#lecture-3` opens
occlusion. Empty or unknown hashes open the Academy Hub. Back, Forward and
refresh synchronize the selected view.

`src/navigation.ts` defines shared navigation metadata. `src/App.tsx` owns the
hash and lazy-loads the content package in `src/lectures/lectures-04-07/`.
Each added lecture contains one 3D sandbox, four 2D sandboxes, a four-question
knowledge check and its source PDF. Public assets are under
`public/assets/orthodontics-04-07/` with repository-prefix-safe URLs.

## Validate from the repository root

```sh
npm --prefix orthodontics-main/orthodontics-main run lint
node --test orthodontics-main/orthodontics-main/src/lectures/lectures-04-07/content.test.mjs
node scripts/build-pages.mjs
node --test scripts/module-source.test.mjs scripts/dependency-fixes.test.mjs scripts/vite-pages-options.test.mjs scripts/pages.test.mjs
node --test scripts/orthodontics.browser.test.mjs scripts/endodontics.browser.test.mjs scripts/subjects.browser.test.mjs
```

Build first: browser checks serve the combined `_site/` artifact beneath a
repository prefix. See root `DEPLOYMENT.md` for tooling/browser installation.
Tests cover software behavior, not medical validation or every possible 3D/audio
interaction. The supplied Lecture 6 radiation figure and units are explicitly
marked unverified in the UI and require faculty review. Source PDFs retain their
original wording. All models are educational, not patient-specific guidance.

Keep source and assets in Git, not ZIP exports, `node_modules`, or `dist`.
Deployment uses the shared GitHub Pages workflow and publishes only `_site/`.
