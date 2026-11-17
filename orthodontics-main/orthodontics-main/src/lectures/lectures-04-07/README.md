# Orthodontics lectures 04–07 — content import

Imported from `precision-dental-—-interactive-orthodontics.zip` using Python's native `zipfile`. Only lecture source (`App.tsx`, `data/`, `types/`, `components/`) and the five supplied public assets were imported. No package manifest, environment files, source entry point, original global CSS, or configuration was imported.

## Parent integration

From the subject's `src/` directory:

```tsx
import OrthodonticsLectureContent from './lectures/lectures-04-07/App';

<OrthodonticsLectureContent lectureId="lecture-4" />
```

`OrthodonticsLectureContentProps` is exported from `App.tsx`. Its only prop is:

```ts
{ lectureId: 'lecture-4' | 'lecture-5' | 'lecture-6' | 'lecture-7' }
```

The component owns no top-level navigation, header, footer, brand dialog, document title, hash, or history. The parent remains responsible for those. It renders an `article` with an identifiable `h2` (`lec4-title` through `lec7-title`), a hero/objectives, internal sandbox jump buttons, one selected lazy lecture view, a source PDF link, and the summary/disclaimer. Switching `lectureId` remounts the lecture-local state and disposes the outgoing lecture's effects and WebGL scene. Mount one instance per lecture at a time: the preserved sandbox/input IDs are lecture-specific but not instance-specific.

| ID | Exact imported title |
| --- | --- |
| `lecture-4` | Temporomandibular Disorders (TMDs) |
| `lecture-5` | Lateral Cephalometrics |
| `lecture-6` | Orthopantomogram (OPG) |
| `lecture-7` | Orthodontic Study Models & Analyses |

Each lecture includes one 3D sandbox, four 2D sandboxes and its four-question `KnowledgeCheck`, with explanations, summary points and educational limitations. Lecture 6 metadata and UI dose wording have been qualified for publication: exposure varies by equipment/protocol, and the supplied numeric figure is explicitly unverified. The five binary assets are unchanged from the ZIP.

## Files and styling

- `App.tsx`: content-only default export and four lazy imports.
- `data/lecturesMeta.ts`, `types/lecture.ts`: imported educational metadata/types, with qualified Lecture 6 dose wording.
- `components/common/`: shared shell, quiz, viewport and original SVG logo (logo is not displayed by the content root).
- `components/lectures/lecture4/` through `lecture7/`: all original lecture views and sandboxes.
- `data/assets.ts`: four PDF URLs and `LECTURE_ASSETS.brandImage`, all based on `import.meta.env.BASE_URL + 'assets/orthodontics-04-07/'`.
- `public/assets/orthodontics-04-07/` at the subject root: four source PDFs and the supplied PNG. The brand PNG is retained but no branding modal is rendered.
- `content.css`: automatically imported by `App.tsx`; all selectors are scoped beneath `.ortho-04-07`. Adds light control rendering, local font fallback, focus visibility and reduced-motion rules. **No extra parent CSS import or global rules are needed.** The parent's existing Tailwind v4/global CSS import must remain enabled and scan this subtree. The ZIP's `src/index.css` was not imported.

No packages were added. Validated against installed Three.js `0.186.1`, `@types/three` `0.186.0`, and React `19.3.1`.

## Compatibility and interaction fixes

- Replaced deprecated `THREE.Clock` with visibility-aware `THREE.Timer`; replaced removed `PCFSoftShadowMap` with `PCFShadowMap` (the old constant still type-checks but Three's renderer warns and substitutes it at runtime).
- Split RAF and timeout handles; delete pending GPU fences and dispose the timer/listeners, instanced meshes, shadow targets, textures, geometries, materials, environment and renderer on teardown. Dispose the inactive study-model material even when detached from the scene.
- Pause viewport work during context loss and resume on restoration. Honor reduced-motion settings in scene interpolation and muscle pulsing; avoid continuous pulsing work when muscles are hidden.
- Keep sandbox jumps scoped to the article, focus the destination without changing the hash, respect reduced motion, and defer early jumps until the lazy content commits.
- Make OPG hotspots keyboard-operable with selection semantics. Interactive SVGs use group semantics rather than hiding their buttons inside `role="img"`. OPG filtering selects a visible landmark.
- Disconnect completed audio nodes, handle rejected audio resume promises, and make the normal/silent-joint preview actually silent. Existing animation intervals and audio-context unmount cleanup are retained.
- Avoid a divide-by-zero quiz score for an empty question list.

## Validation

Run from `orthodontics-main/orthodontics-main`:

```sh
node --test src/lectures/lectures-04-07/content.test.mjs
node node_modules/typescript/bin/tsc --noEmit --ignoreConfig --strict --target ES2022 --module ESNext --moduleResolution bundler --jsx react-jsx --lib ES2022,DOM,DOM.Iterable --types vite/client --skipLibCheck src/lectures/lectures-04-07/App.tsx src/lectures/lectures-04-07/components/common/BrandLogo.tsx
```

The tests use existing esbuild/React dependencies. They server-render all four heroes and lecture views, check objectives/summaries/quizzes, all 24 jump targets, unique IDs, slider labels, interactive SVG semantics, nested-base PDF links and asset signatures. Regression checks ensure Lecture 6 does not present its unverified source dose figure or fixed dose reductions as validated facts. An in-memory browser bundle verifies all four lazy chunks and the scoped stylesheet without writing build artifacts. They do **not** exercise actual browser interaction, audio playback, GPU rendering or WebGL context restoration.

## Integration and editorial notes

- Parent integration and application-level checks (including browser/WebGL, mobile layout and accessibility checks) are handled by the parent integration owner. This document describes the imported subtree and its local checks, not parent integration status.
- Lecture 6 no longer labels the supplied **5.06 rad** as a low dose or equates it to a number of IOPAs. It is retained only as an **unverified source figure whose value and units require faculty verification**, not a validated dose estimate. Exposure varies by equipment and protocol; no replacement dose or fixed reduction percentage is asserted.
- Educational content has not been medically revalidated. The simulations and treatment thresholds retain their educational disclaimers and are not patient-specific clinical guidance. Source PDFs remain supplied reference documents, not validated dose guidance.
