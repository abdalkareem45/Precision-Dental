# Endodontics curriculum import

Imported from `precision-dental-—-endodontics-3d-interactive-curriculum.zip`. The archive README is the standard AI Studio scaffold: Node.js, npm install, a Gemini key, and npm run dev. The imported curriculum itself does not call Gemini or another external service and does **not** require a key. Archive `main.tsx`, `App.tsx`, global `index.css`, package manifests, and configuration were not installed over the existing app.

## Parent integration contract

```tsx
import CurriculumApp from './lectures/curriculum/App';
import type { LectureId } from './lectures/curriculum/types/lecture';
import { LECTURES } from './lectures/curriculum/data/lectures';

// Render only for one of these seven curriculum IDs.
<CurriculumApp lectureId={selectedCurriculumId as LectureId} />
```

`App` is the default export; its only prop is `lectureId: LectureId`. Use the existing parent route-to-ID validation rather than casting an unchecked hash. Invalid runtime IDs display an unavailable message instead of a different lecture. `LECTURES` is ordered metadata; `subtitle` is the summary. The parent owns lecture selection, route/hash handling, the page heading/title, and common subject navigation. In particular, `lecture-4b` intentionally distinguishes the second source PDF labeled Lecture 4; do not replace the older app’s lectures or blindly reuse IDs in its routing namespace.

The module imports `curriculum.css` itself. Keep the parent’s existing Tailwind v4 stylesheet and ensure its normal source discovery includes this subtree. Custom styles, variables, focus/range styling, reduced-motion styles, and the local dark variants are scoped to `.endo-curriculum`. Theme is set only on this wrapper using `data-endo-theme`; neither the root element nor document title/hash is mutated. There is no lecture selector in the workspace or dashboard. Within-lecture navigation uses local element queries and scrolling, not hashes. Changing `lectureId` remounts workspace state and releases the previous 3D scene; progress remains in app state/storage.

All seven PDFs and the archive PNG are under `public/assets/endo-curriculum/aistudio/`. PDF URLs use `import.meta.env.BASE_URL + 'assets/endo-curriculum/aistudio/…'`; current filenames contain only URL-safe characters. Assets therefore work with a non-root Vite base. The unused brand-reference PNG is preserved without making it part of common navigation.

## Lecture metadata

Order is the array order, not the numeric suffix. Original number labels and titles are preserved.

| Order | ID | Number label | Title | Summary (`subtitle`) |
| --- | --- | --- | --- | --- |
| 1 | `lecture-3` | Lecture 3 | Determination of Working Length | Apical anatomy, radiographic measurement & electronic apex locators |
| 2 | `lecture-4` | Lecture 4 | Endodontic Radiography | Projection geometry, SLOB buccal object rule, digital sensors & CBCT |
| 3 | `lecture-4b` | Lecture 4B | Intracanal Instruments I: Manual & Low-Speed | Instrument classification, cross-sections, tip geometry, ISO taper & alloys |
| 4 | `lecture-5` | Lecture 5 | Intracanal Instruments II: NiTi Rotary & Ultrasonic | Rotary systems, SAF 3D lattice, reciprocating motion & ultrasonic physics |
| 5 | `lecture-7` | Lecture 7 | Root Canal Filling Materials | Sealer classes, placement techniques, gutta-percha phases, Resilon & solid cores |
| 6 | `lecture-8` | Lecture 8 | Obturation of the Root Canal System | 3D seal objectives, warm compaction, System B, Obtura III, carriers & apical barriers |
| 7 | `lecture-9` | Lecture 9 | Management of Endodontic Emergencies | Carrotte triage, pulpal/periapical emergencies, cracked teeth, NaOCl accidents & pain ladder |

## Progress and lifecycle behavior

- Storage keys: `endo-curriculum:progress:v1` and `endo-curriculum:theme:v1`. No old lecture or archive progress keys are read, removed, or overwritten.
- Fresh progress starts with **zero** activities and no quiz attempt. Opening a lecture, selecting a lab tab, initialization, theme changes, and automatic animation do not award progress.
- 3D lab controls record exploration. Most 2D studios record interaction; the working-length ordering challenge records completion only after the entire correct sequence. Cases require the optimal option; quizzes record the best submitted score, including a valid zero.
- Malformed JSON/shapes, unknown/cross-lecture IDs, duplicates, and out-of-range/fractional scores are discarded. Quiz totals are derived from content, never trusted from storage. Denied storage/quota failures do not interrupt study.
- Completion checks in the dashboard require every 3D lab, 2D studio, optimal case, and a full quiz score. Reset requires confirmation, clears only curriculum progress, and remounts exercise state to avoid stale submitted UI.
- Scene cleanup cancels separate RAF/timer handles, disconnects resize observers/listeners, disposes shared geometry/materials/textures once per tree plus instanced buffers/shadows/environment targets, disposes controls/renderer, loses its context, and removes the canvas. Scene disposal is idempotent. Context loss immediately releases the scene and displays a text fallback; renderer allocation failures also use the fallback. No-WebGL mode keeps the educational controls available.
- Reduced-motion mode freezes automatic animation but still redraws parameter changes and applies camera changes without flight animation. Small-screen readouts/controls are laid out outside the viewport rather than covering it.
- The progress dashboard uses a native modal dialog for focus containment/Escape and restores prior focus on close.

## Dependencies and content caveats

The archive requests `three` / `@types/three` 0.187 and TypeScript 7. This import uses the existing Three.js 0.186.x, matching installed types, React 19, motion, lucide, and TypeScript 5.9 toolchain without manifest changes. `esbuild`, `tsx`, and Tailwind already exist; tests use esbuild, TypeScript AST parsing, Node's built-in test runner, and Tailwind's compiler. There are no new dependencies. Modern browser support for WebGL2, ResizeObserver, and native dialog is expected; unavailable WebGL2 has a text fallback.

Lecture claims, quiz keys, drug references, and clinical scenarios are archive educational material, not a newly verified clinical guideline. The clinical disclaimers are retained. A qualified educator should review medical-device precautions, prescribing references, and treatment recommendations before clinical teaching/use. Automated tests validate content structure and wiring, not clinical accuracy against the source PDFs.

## Validation

From `website/endo-1-main`:

```sh
node src/lectures/curriculum/tests/run.mjs
node node_modules/typescript/bin/tsc --noEmit --incremental false
```

From repository root `website`, the exact test command is:

```sh
node endo-1-main/src/lectures/curriculum/tests/run.mjs
```

The runner first bundles the real browser entry with installed dependencies in memory, then runs content, progress, CSS isolation, nested-base PDF/PNG signature checks, real procedural geometry disposal tests, and scene lifecycle tests with mocked GPU/browser boundaries. Its temporary test bundle stays inside `tests/` and is removed in `finally`. No parent files or build output are written. Browser rendering/navigation tests are intentionally left to parent integration; mocked lifecycle tests are not a real GPU/browser test.
