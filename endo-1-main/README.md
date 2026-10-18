# Precision Dental — Endodontics

This is the maintained React/TypeScript source for the Endodontics subject.
It contains **two lectures**, not two separate subjects:

- Lecture 1 — Endodontic Diagnosis: `src/Lecture01.tsx`, `src/components/`,
  `src/data/`, and `src/types/` (preserved from `endo-1-main.zip`).
- Lecture 2 — Pain Control in Endodontics: `src/lectures/lecture-02/App.tsx`
  and its `components/` (imported from `endo-2-.zip`).

`src/App.tsx` provides the lecture selector and persistent subject navigation.
Lecture components are lazy-loaded. Refresh-safe links use `#lecture-1` and
`#lecture-2`; unknown or empty hashes show the lecture selector.
The root landing page's Endodontics card still links to this subject and shows
2 lectures.

## Edit and preview

From the repository root, after dependencies have been installed by the build:

```sh
npm --prefix endo-1-main run dev
```

Stop the development server with Ctrl+C. The app's "All subjects" link is intended
for the combined production site, not the isolated Vite development server.
Do not put secret API keys in this app. The lecture tools run in the browser and
do not need a Gemini API key.

## Validate

From the repository root:

```sh
npm --prefix endo-1-main run lint
node scripts/build-pages.mjs
node --test scripts/dependency-fixes.test.mjs scripts/vite-pages-options.test.mjs scripts/pages.test.mjs
npm ci --prefix scripts --no-audit --no-fund
node scripts/node_modules/playwright/cli.js install chromium
node --test scripts/endodontics.browser.test.mjs scripts/subjects.browser.test.mjs
```

Browser checks cover lecture selection, Lecture 1 notes, all Lecture 2 topics,
quiz scoring/reset, clinical decisions/reset, mobile topic navigation and layout,
hash-link refresh, onset/expiry timeline boundaries, pressure feedback, paused
oscilloscope markers, and local assets under a repository-prefixed URL.
The subject startup checks cover all nine subjects.
They check software behavior, not clinical accuracy or validation of medical
simulator models. Clinical content and dosing claims require qualified review.

## Source control and deployment

Commit this directory's source files and `package-lock.json`. Dependencies and
`dist/` are ignored. The build/preparation scripts automatically prefer this
folder over `endo-1-main.zip` and will not re-extract over it. The original ZIPs
remain unchanged as references; replacing them alone will not update this app.

To add another lecture, add its component under `src/lectures/`, register a lazy
import and metadata entry in `src/App.tsx`, update the selector's count and the
Endodontics count/overview in root `lunch.js`, then extend browser tests.
Use hash links, imported assets, and the shared Tailwind stylesheet. Do not
create another subject entry in `scripts/modules.json` for a lecture.
