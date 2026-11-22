# Crown virtual-lab integration handoff

This subtree is content only. It does not mount React, introduce another `main`, set the document title/hash, render the standalone ZIP header/lecture selector, or own deployment. All nine original lecture datasets, four 2D sandboxes per lecture, 3D models, visual libraries, quizzes, and progress dashboard are retained. Assets were extracted with Python into `crown/public/assets/crown-virtual-lab/`; ZIP configuration, package files, environment files, entrypoints, and global styles were not extracted.

## Parent imports and props

```tsx
import VirtualLab from './lectures/virtual-lab/App';
import { VIRTUAL_LAB_LECTURES, type LectureId } from './lectures/virtual-lab/registry';

// Parent supplies the selected virtual-lab ID and handles routing/navigation.
<VirtualLab lectureId={lectureId} onSelectLecture={onSelectLecture} />
```

Default export props: `{ lectureId: LectureId; onSelectLecture: (id: LectureId) => void }`.
`VirtualLabProps` is also exported from `App.tsx`. The lightweight `VIRTUAL_LAB_LECTURES` registry contains only `id`, `title`, `numberLabel`, and `summary`, and has no runtime imports. It can be eagerly imported while `App.tsx` is lazy-loaded. Parent owns navigation, title, hash, prior three lectures, and deployment. Hero Prev/Next wraps through these nine virtual-lab lectures and delegates via the callback; dashboard Open uses the same callback. Workspace tabs are local/persisted, with keyboard arrow/Home/End support. The component includes its own labeled progress-dashboard trigger.

## Dependencies to add in the parent

- `three@0.187.x` (validated with `0.187.0`)
- compatible `@types/three` (validated with `0.187.0`)
- `zustand@^5.1.0` (validated with `5.1.0`)

React 19, Motion, Lucide, Vite, and Tailwind 4 use existing parent dependencies. No backend, API keys, analytics, external service, or runtime network request beyond local static assets is added. Browser-local progress uses the original `precision_dental_cb_lab_v1` key, but only known module keys, exact booleans, valid sections, and bounded integer scores with the correct question total are accepted. Old persisted lecture selection is deliberately ignored in favor of parent props. Blocked storage is nonfatal.

## Required Tailwind theme declarations (parent global CSS)

`App.tsx` imports the local `index.css` automatically. **Do not import Tailwind again here.** Local rules, skeleton animation, focus styles, and reduced-motion overrides are scoped to `.crown-virtual-lab` (animation name is namespaced). Add the ZIP's following theme declarations alongside the parent's existing Tailwind import so Tailwind generates the semantic utilities:

```css
@theme {
  --font-sans: "Montserrat", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --color-royal: #1B3A8C;
  --color-navy: #0B1F4D;
  --color-gold: #C9A24B;
  --color-ivory: #FAF8F3;
  --color-marble: #E6E8EC;
}
```

The two font declarations are the ZIP values and affect global Tailwind font utilities; keep the parent's existing font tokens if that is preferable. The lab root has its own sans fallback. Font files are not supplied or fetched. The five color tokens are required. There are no global `html`/`body` CSS rules or global reduced-motion selectors. The modal temporarily locks body scroll while open and restores it on close/unmount, without defining global CSS.

## Exact lecture registry and source PDFs

| ID | Original label | Title | PDF filename |
| --- | --- | --- | --- |
| `lec-04` | Lecture 04 | Biomechanical Considerations of Fixed Partial Denture | `Lect_4_12e19f3e.pdf` |
| `lec-05` | Lecture 05 | Components of Bridge: Bridge Retainers & Tooth Preparation | `Lect_5_4a645c29.pdf` |
| `lec-06` | Lecture 06 | Components of Bridge: Pontic Design, Ridge Assessment & Connectors | `Lect_6_pontic_7e6e6710.pdf` |
| `lec-07a` | Lecture 07A | Fluid Control & Soft Tissue Management (Gingival Retraction) | `Lecture_7__Tissue_Management__-_manhal.abdulrahman_a3308e24.pdf` |
| `lec-07b` | Lecture 07B | Final Impression in Fixed Prosthodontics & Disinfection | `Lecture_7__Impression_2024__7eee9057.pdf` |
| `lec-10a` | Lecture 10A | Provisional (Temporary) Restorations & Fabrication Techniques | `Provisional__temporary__Restorations_46a0b2eb.pdf` |
| `lec-10b` | Lecture 10B | Interocclusal Record (Bite Registration), Occlusion & Articulators | `Bite_Registration_a32164be.pdf` |
| `lec-11` | Lecture 11 | Shade Selection in Fixed Prosthodontics & Color Science | `Shade_Selection_f0f9cf15.pdf` |
| `lec-12` | Lecture 12 | Clinical Try-in, Marginal Evaluation & Definitive Cementation | `Try-in___Cementation__09efe577.pdf` |

No lectures 08/09 or renumbered substitutes are invented. `sourcePdfs.ts` maps all nine exact IDs to copied PDFs and constructs URLs using `import.meta.env.BASE_URL`, working with root and nested deployment paths. Every lecture footer exposes the source PDF in a new tab. Clinical warnings and educational limitations are retained from the ZIP; clinical content has not been independently medically reviewed.

## Progress and Three.js fixes

- A completed lecture requires an explored 3D scene, **all four** sandbox kinds (`flow`, `case`, `compare`, `planner`), a visited visual library, and a recorded quiz. A score of zero is still a completed attempt, not a pass or clinical competence.
- Dashboard and trigger share the same progress calculation; visual/quiz counts derive from actual content.
- 3D exploration is recorded only after the first successful WebGL render, not when WebGL initialization fails.
- OrbitControls `start` cancels guided camera moves; `change` requests rendering without canceling programmatic camera motion.
- RAF scheduling is deduplicated; offscreen/hidden-tab rendering pauses; reduced-motion settings suppress automatic animation and camera/explode easing.
- Scene ownership includes detached/swapped materials and unused material-set textures; cleanup deduplicates shared resources and is idempotent.
- Renderer, controls, listeners, observers, environment target, timer, RAF, canvas, and WebGL context are released on unmount. The WebGL container remains mounted through context loss for recovery; the accessible summary remains available as a fallback.
- Target APIs use modern color spaces and do not introduce deprecated Three.js APIs. Full target type check and bundle validation were run with Three.js/types `0.187.0`.

## Regression tests

From `crown/`, after the parent installs dependencies:

```sh
node src/lectures/virtual-lab/tests/run.mjs
```

Uses the existing `esbuild` and Node's built-in test runner; no package scripts or workflows are changed. The runner writes temporary bundles **inside this tests directory** and removes them afterward. Run content/progress validation alone without Three.js/Zustand:

```sh
node src/lectures/virtual-lab/tests/run.mjs content
```

The suites cover all nine IDs and unchanged labels, lightweight registry consistency, source PDF existence/signature and nested/absolute base URLs, content/quiz option validity, malformed persisted data, accurate completion, actual Zustand hydration/actions/reset/blocked storage, all scene-control combinations and layer toggles, unchanged-parameter geometry stability, and deduplicated resource disposal.

Validation completed: 11 tests passed using an isolated temporary install of Three.js/types `0.187.0` and Zustand `5.1.0`; source compiled with esbuild against those dependencies. The isolated install and temporary config were removed afterward. Parent production build, Tailwind token integration, browser interaction/WebGL lifecycle checks, existing-lecture integration, and live deployment remain parent-owned. Node geometry tests do not prove browser GPU rendering, context-restoration behavior, visual appearance, or accessibility in an actual browser.
