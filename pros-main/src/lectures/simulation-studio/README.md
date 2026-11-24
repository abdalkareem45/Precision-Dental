# Prosthodontics Simulation Studio: parent integration

Imported from `precision-dental-—-prosthodontics-simulation-studio-(lectures-4–10).zip`.
Only this subtree and `public/assets/prostho-studio/` are part of the import.
The original app and lectures 1–3 are untouched. No dependencies, configuration,
bootstrap, environment files, AI Studio logs or duplicated PDFs were imported.
The unused brand-guideline PNG is excluded; the studio retains its original SVG logo.

## Component and metadata contract

The default export from `./lectures/simulation-studio` (or `App.tsx` directly) is:

```tsx
import SimulationStudio, {
  LECTURE_METADATA,
  type LectureId,
} from './lectures/simulation-studio';

// lectureId must be a LectureId selected by the parent.
<SimulationStudio lectureId={lectureId} />
```

`SimulationStudioProps` is `{ lectureId: LectureId }`, required, with no routing
callbacks. `LectureId` is declared in `types/prosthodontics.ts` and is the union
`'lecture-4' | 'lecture-5' | 'lecture-6' | 'lecture-7' | 'lecture-8' | 'lecture-9' | 'lecture-10'`.

The parent owns the URL/hash and browser history, lecture selection, document
title, common navigation, main landmark and main `h1`. Append the seven metadata
entries to the parent's existing lectures 1–3; do not replace that original list.
The internal toolbar navigates the six scenes of the current lecture only.
The seven-lecture progress dashboard is informational and does not navigate.
The hero is an `h2`, and the studio adds no nested `main` or global title/hash effects.

Exports from `index.ts`:

- Default component and named alias `SimulationStudio`; type `SimulationStudioProps`.
- `LECTURE_METADATA`: `{ id, number, title, shortTitle, summary, sourcePdf }[]`.
  `summary` preserves `hero.subheadline`; `sourcePdf` is a deployment-base-aware URL.
- `LECTURES`: complete `LectureModule[]`, all seven original lecture records.
- `LECTURE_IDS`, `getLectureById(id)`, `createInitialProgress()`, `ACHIEVEMENT_BADGES`.
  `getLectureById` retains the archive's first-lecture fallback for an unknown runtime ID;
  the component's compile-time prop accepts only the seven supported IDs.
- `SOURCE_PDFS`, `sourcePdfUrl(id, optionalBase)`, `studioAssetUrl(filename, optionalBase)`.
- Types `LectureId`, `LectureModule`, `SceneId`, `ProgressMap`.

## Lecture catalog

| ID | Title | Summary |
| --- | --- | --- |
| `lecture-4` | Posterior Palatal Seal (PPS): Anatomy, Designs & Recording | Vibrating lines, House classes, Winland & Young seal designs, physiological recording and Kingsley scraping. |
| `lecture-5` | Complete Denture Complications I: Recall, Pain, Xerostomia & Flabby Ridge | Residual ridge resorption, mucosal pain and instability, xerostomia and flabby-ridge impression techniques. |
| `lecture-6` | Denture Complications II: Breakages, Gagging, BMS, Speech & Relining | Acrylic fatigue and debonding, gagging, burning mouth syndrome, phonetics, and hard/soft relines. |
| `lecture-7` | Immediate Denture I: Indications, CID vs. IID & Flange Designs | Indications and contraindications, conventional versus interim dentures, flange designs and labial undercuts. |
| `lecture-8` | Immediate Denture II: Split-Tray Impressions, Cast Trimming & Follow-Up | Sectional impressions, Rule-of-Thirds cast trimming, surgical splints and postoperative recall. |
| `lecture-9` | Maxillofacial Prosthesis I: Defects, 11-Member Team & Aramany / Cantor-Curtis | Defect categories, multidisciplinary rehabilitation, Aramany and Cantor-Curtis classifications. |
| `lecture-10` | Maxillofacial Prosthesis II: Obturator Phases, Construction & Retention | Surgical, interim hollow-bulb and definitive obturators; anatomic, adhesive, mechanical and implant retention. |

Every lecture retains all six scenes: overview/journey map, concepts, interactive
3D and four 2D sandboxes, tiered clinical cases, quiz, and storyboard/mastery review.
The four 2D sandboxes are anatomy, design builder, workflow sequencer and diagnostic
matrix. Three.js retains camera presets/orbit/pan/zoom, layers, variants, parameter
and exploded-view controls, hotspots, reset and WebGL fallback. There are 21 clinical
cases and 25 quiz questions across the seven modules. Both original lecture-data
part files are unchanged byte-for-byte.

## PDFs and deployment

`sourcePdfUrl` uses `import.meta.env.BASE_URL` plus `assets/prostho-studio/`, never a
hard-coded site-root asset path. Each hero includes a **Source PDF** link.

| Lectures | Source filename |
| --- | --- |
| 4 | `pros_4_website_2fa347ec.pdf` |
| 5 | `pros_5_website_7589ac99.pdf` |
| 6 | `pros_6_website_5f6a27ef.pdf` |
| 7 and 8 | `pros_7_and_8_website_43ed1976.pdf` |
| 9 and 10 | `pros_9_and_10_website_a6e40e0e.pdf` |

## Isolation and lifecycle

- The component imports its own small stylesheet. The host's existing Tailwind
  import supplies utilities; no second Tailwind/preflight import is added.
- All custom selectors are scoped to `.prostho-studio`. The local wrapper uses
  `data-theme`, with Tailwind's built-in `in-[.prostho-studio[data-theme=dark]]:`
  descendant variants and `data-[theme=dark]:` root variants. No `dark` variant,
  global theme variables, body styles or document root classes are redefined.
- Progress/theme retain the archive's storage keys (`precision_dental_prostho_progress_v2`
  and `precision_dental_prostho_theme_v1`). Storage failures are optional. Malformed
  JSON, invalid entries, unknown IDs, duplicates, invalid score ranges, non-finite
  numbers and invalid attempt counts are rejected or sanitized. Valid progress
  survives lecture switches and reloads; reset affects studio lectures only.
- Fresh rendering selects overview but records no visits, sandbox completion,
  solved cases or quiz attempts. Completion is driven by user actions, not effects.
  Preselected anatomy hotspots are not counted as inspected. The PPS badge requires
  all four actual 2D sandboxes, not three 2D modules plus the 3D sandbox.
- Lecture changes remount transient scene controls, preserving course progress
  and theme. Three.js teardown cancels frame/timeouts and pending GPU fences,
  disconnects resize/event handlers and controls, disposes nested/shared/cloned
  model geometry/materials/textures exactly once, frees the room environment,
  PMREM target and shadows, releases the renderer/context and removes the canvas.
  Three.js `Timer` replaces deprecated `Clock`.

## Validation

From `pros-main`:

```sh
node src/lectures/simulation-studio/tests/run.mjs
npm run lint
```

Or from this directory: `node tests/run.mjs`.

The 11 focused tests cover seven-lecture content structure, server rendering of all
42 scenes without host-owned markup/routing, five real PDF files and shared source
mapping, nested/relative base URLs, malformed/blocked storage, validated progress
actions and round trips, badge semantics, shared and nested model-resource disposal,
and local style/lifecycle isolation. They also perform a write-free Vite production
build against the host's actual Tailwind stylesheet using `/nested/pros-main/`,
checking that local dark utilities compile. The runner uses existing esbuild,
creates temporary bundles only under `tests/`, and removes them after the run.

TypeScript validation uses the host's TS 5.9 and Three.js 0.186 dependencies, with no
package changes. These automated checks do not substitute for a browser/GPU smoke
test after parent integration.
