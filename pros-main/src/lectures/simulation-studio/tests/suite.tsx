import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import * as THREE from 'three';
import Studio, { LECTURES, LECTURE_IDS, LECTURE_METADATA, ACHIEVEMENT_BADGES, createInitialProgress, SOURCE_PDFS, sourcePdfUrl, studioAssetUrl } from '../index';
import { loadStoredProgress, loadStoredTheme, parseProgress, progressReducer, SANDBOX_IDS } from '../utils/progress';
import { buildLecture3DModel } from '../utils/webglModels';
import { createResourceDisposer } from '../utils/resources';
import type { LectureId } from '../types/prosthodontics';

const root = process.env.PROSTHO_STUDIO_ROOT!;
const assets = resolve(root, '../../../public/assets/prostho-studio');
const expectedIds = Array.from({ length: 7 }, (_, i) => 'lecture-' + (i + 4));

test('all seven original lectures retain their complete teaching data', () => {
  assert.deepEqual(LECTURE_IDS, expectedIds);
  assert.equal(LECTURE_METADATA.length, 7);
  for (const lecture of LECTURES) {
    const metadata = LECTURE_METADATA.find((item) => item.id === lecture.id)!;
    assert.equal(metadata.title, lecture.title);
    assert.equal(metadata.summary, lecture.hero.subheadline);
    assert.ok(metadata.summary.length > 40);
    assert.equal(lecture.sandbox3D.modelType, lecture.id);
    assert.ok(lecture.sandbox3D.hotspots.length > 0);
    assert.ok(lecture.sandbox3D.layers.length > 0);
    assert.ok(lecture.sandbox3D.variantOptions.length > 1);
    assert.ok(lecture.sandbox2DAnatomy.hotspots.length >= 2);
    assert.ok(lecture.sandbox2DBuilder.options.some((item) => item.isRecommendedForPrompt));
    assert.ok(lecture.sandbox2DWorkflow.correctOrder.length > 1);
    assert.ok(lecture.sandbox2DDiagnostic.items.length > 0);
    assert.deepEqual(lecture.clinicalCases.map((item) => item.tier), ['Beginner', 'Intermediate', 'Advanced']);
    assert.ok(lecture.clinicalCases.every((item) => item.options.some((option) => option.isOptimal)));
    assert.equal(lecture.quiz.length, [4, 4, 4, 3, 4, 3, 3][lecture.number - 4]);
    assert.ok(lecture.quiz.every((item) => item.options.some((option) => option.id === item.correctOptionId)));
    assert.ok(lecture.concepts.length > 0);
    assert.ok(lecture.storyboardSections.length > 0);
    assert.ok(lecture.deliverables.learningFlowSteps.length > 0);
  }
});

test('every lecture renders six scenes without host-owned headings, routing or completion', () => {
  for (const lecture of LECTURES) {
    const html = renderToStaticMarkup(<Studio lectureId={lecture.id} />);
    for (let scene = 1; scene <= 6; scene++) assert.ok(html.includes('id="prostho-studio-scene-' + scene + '"'));
    assert.ok(html.includes('prostho-studio'));
    assert.ok(html.includes('data-theme="dark"'));
    assert.ok(html.includes('Within this lecture'));
    assert.ok(html.includes(sourcePdfUrl(lecture.id)));
    assert.ok(html.includes('Source PDF'));
    assert.ok(html.includes('4 Hands-On Modules'));
    assert.ok(html.includes('0%') || html.includes('Not attempted'));
    assert.doesNotMatch(html, /<h1\b|<main\b|href="#lecture-|href="#scene-/);
  }
});

test('five real PDFs map correctly with paired lectures and BASE_URL-safe paths', () => {
  const files = readdirSync(assets);
  assert.equal(files.filter((name) => name.endsWith('.pdf')).length, 5);
  assert.equal(new Set(Object.values(SOURCE_PDFS)).size, 5);
  assert.equal(SOURCE_PDFS['lecture-7'], SOURCE_PDFS['lecture-8']);
  assert.equal(SOURCE_PDFS['lecture-9'], SOURCE_PDFS['lecture-10']);
  for (const id of LECTURE_IDS) {
    const pdf = readFileSync(join(assets, SOURCE_PDFS[id]));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
    assert.match(sourcePdfUrl(id), /^\/nested\/pros-main\/assets\/prostho-studio\//);
    assert.equal(sourcePdfUrl(id, '/course'), '/course/assets/prostho-studio/' + SOURCE_PDFS[id]);
    assert.equal(sourcePdfUrl(id, './'), './assets/prostho-studio/' + SOURCE_PDFS[id]);
  }
  assert.equal(studioAssetUrl('file name.pdf', '/'), '/assets/prostho-studio/file%20name.pdf');
  assert.ok(files.every((name) => !/env|step_\d|logs/i.test(name)));
});

test('invalid storage cannot create phantom visits, completion or achievements', () => {
  const clean = createInitialProgress();
  for (const raw of [null, '', '{', 'null', '42', '[]', 'true', '"text"']) assert.deepEqual(parseProgress(raw), clean);
  const hostile = parseProgress(JSON.stringify({
    'lecture-4': { visitedScenes: ['scene-3', 'scene-3', 'scene-99', {}],
      completedSandboxes: ['2d-anatomy', '2d-anatomy', 'invented', null],
      solvedCases: ['invented'], quizBestScore: 100, quizAttempts: -1 },
    'lecture-5': [], 'lecture-6': { quizBestScore: 101, quizAttempts: 1.5 },
    'lecture-999': { completedSandboxes: SANDBOX_IDS },
  }));
  assert.deepEqual(hostile['lecture-4'].visitedScenes, ['scene-3']);
  assert.deepEqual(hostile['lecture-4'].completedSandboxes, ['2d-anatomy']);
  assert.deepEqual(hostile['lecture-4'].solvedCases, []);
  assert.equal(hostile['lecture-4'].quizBestScore, null);
  assert.equal(hostile['lecture-4'].quizAttempts, 0);
  assert.deepEqual(hostile['lecture-5'], clean['lecture-5']);
  assert.equal(hostile['lecture-6'].quizBestScore, null);
  for (const score of [-1, 101, '100', null]) {
    assert.equal(parseProgress(JSON.stringify({ 'lecture-4': { quizBestScore: score, quizAttempts: 1 } }))['lecture-4'].quizBestScore, null);
  }
  for (const lecture of Object.values(clean)) {
    assert.deepEqual(lecture.visitedScenes, []);
    assert.deepEqual(lecture.completedSandboxes, []);
    assert.deepEqual(lecture.solvedCases, []);
    assert.equal(lecture.quizAttempts, 0);
  }
  assert.ok(ACHIEVEMENT_BADGES.every((badge) => !badge.isUnlocked(clean)));
});

test('progress actions validate, deduplicate, persist accurately and reset all lectures', () => {
  let state = createInitialProgress();
  const lectureId: LectureId = 'lecture-4';
  state = progressReducer(state, { type: 'visit', lectureId, scene: 'scene-3' });
  const visited = state;
  state = progressReducer(state, { type: 'visit', lectureId, scene: 'scene-3' });
  assert.equal(state, visited);
  for (const sandboxId of SANDBOX_IDS) state = progressReducer(state, { type: 'sandbox', lectureId, sandboxId });
  assert.equal(progressReducer(state, { type: 'sandbox', lectureId, sandboxId: 'bogus' }), state);
  const caseId = LECTURES[0].clinicalCases[0].id;
  state = progressReducer(state, { type: 'case', lectureId, caseId });
  assert.equal(progressReducer(state, { type: 'case', lectureId, caseId: 'bogus' }), state);
  for (const score of [NaN, Infinity, -1, 101]) assert.equal(progressReducer(state, { type: 'quiz', lectureId, score }), state);
  state = progressReducer(state, { type: 'quiz', lectureId, score: 80 });
  state = progressReducer(state, { type: 'quiz', lectureId, score: 40 });
  assert.equal(state[lectureId].quizBestScore, 80);
  assert.equal(state[lectureId].quizAttempts, 2);
  assert.deepEqual(state['lecture-5'], createInitialProgress()['lecture-5']);
  assert.deepEqual(parseProgress(JSON.stringify(state)), state);
  assert.deepEqual(progressReducer(state, { type: 'reset' }), createInitialProgress());
});

test('PPS badge requires the four 2D sandboxes, not three plus 3D', () => {
  const state = createInitialProgress();
  const badge = ACHIEVEMENT_BADGES.find((item) => item.id === 'badge-pps-architect')!;
  state['lecture-4'].completedSandboxes = ['sandbox-3d', '2d-anatomy', '2d-builder', '2d-workflow'];
  assert.equal(badge.isUnlocked(state), false);
  state['lecture-4'].completedSandboxes.push('2d-diagnostic');
  assert.equal(badge.isUnlocked(state), true);
});

test('unavailable browser storage is optional', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { get localStorage() { throw new Error('blocked'); } } });
  try {
    assert.deepEqual(loadStoredProgress(), createInitialProgress());
    assert.equal(loadStoredTheme(), true);
  } finally {
    if (previous) Object.defineProperty(globalThis, 'window', previous);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});

test('resource disposal handles shared geometry, cloned materials, textures and orphan allocations exactly once', () => {
  const root = new THREE.Group();
  const geometry = new THREE.BoxGeometry();
  const texture = new THREE.Texture();
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const cloned = material.clone();
  const unused = new THREE.SphereGeometry();
  root.add(new THREE.Mesh(geometry, material), new THREE.Mesh(geometry, [material, cloned]));
  const counts = [geometry, texture, material, cloned, unused].map((item) => {
    const counter = { count: 0 };
    item.addEventListener('dispose', () => counter.count++);
    return counter;
  });
  const dispose = createResourceDisposer(root, [geometry, unused, material]);
  dispose(); dispose();
  assert.deepEqual(counts.map((item) => item.count), [1, 1, 1, 1, 1]);
  assert.equal(root.children.length, 0);
});

test('all seven Three.js models simulate and dispose nested tooth resources once', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { createElement: () => ({ getContext: () => null }) } });
  try {
    for (const lecture of LECTURES) {
      const built = buildLecture3DModel(lecture.id, lecture.sandbox3D.hotspots);
      assert.equal(built.hotspotMeshes.length, lecture.sandbox3D.hotspots.length);
      const resources = new Set<THREE.BufferGeometry | THREE.Material | THREE.Texture>();
      built.root.traverse((item) => {
        if (!(item instanceof THREE.Mesh)) return;
        resources.add(item.geometry);
        for (const material of Array.isArray(item.material) ? item.material : [item.material]) {
          resources.add(material);
          for (const value of Object.values(material)) if (value instanceof THREE.Texture) resources.add(value);
        }
      });
      const counts = [...resources].map((item) => {
        const counter = { count: 0 };
        item.addEventListener('dispose', () => counter.count++);
        return counter;
      });
      for (const variant of lecture.sandbox3D.variantOptions) {
        built.updateSimulation(lecture.sandbox3D.parameterMin, variant.id, 0, 0.016);
        built.updateSimulation(lecture.sandbox3D.parameterMax, variant.id, 1, 0.016);
      }
      built.setLayerVisibility({ bone: false, mucosa: false, prosthesis: false, teeth: false });
      assert.ok(built.root.children.filter((item) => item.userData.layerId).every((item) => !item.visible));
      built.dispose(); built.dispose();
      assert.ok(counts.every((item) => item.count === 1), lecture.id);
    }
  } finally {
    if (previous) Object.defineProperty(globalThis, 'document', previous);
    else Reflect.deleteProperty(globalThis, 'document');
  }
});

test('host Tailwind compiles local dark utilities in a nested-base production build', async () => {
  const { build } = await import('vite');
  const { default: tailwind } = await import('@tailwindcss/vite');
  const { default: react } = await import('@vitejs/plugin-react');
  const entry = '\0virtual:prostho-studio-test';
  const path = (file: string) => JSON.stringify(resolve(root, file).replaceAll('\\', '/'));
  const result = await build({
    configFile: false, root: resolve(root, '../../..'), base: '/nested/pros-main/', logLevel: 'error',
    plugins: [react(), tailwind(), {
      name: 'studio-test-entry',
      resolveId(id) { if (id === 'virtual:prostho-studio-test') return entry; },
      load(id) {
        if (id === entry) return 'import ' + path('../../index.css') + '; export { default } from ' + path('index.ts') + ';';
      },
    }],
    build: { write: false, minify: false, cssMinify: false, rollupOptions: { input: 'virtual:prostho-studio-test', preserveEntrySignatures: 'strict' } },
  });
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((item) => 'output' in item ? item.output : []);
  const css = outputs.flatMap((item) => item.type === 'asset' && item.fileName.endsWith('.css') ? [String(item.source)] : []).join('\n');
  assert.ok(/:where\(\.prostho-studio\[data-theme="?dark"?\]\)/.test(css), css.split('\n').filter((line) => line.includes('prostho-studio')).slice(0, 8).join('\n'));
  assert.match(css, /--tw-bg-opacity|background-color:/);
  assert.match(css, /\[data-theme="?dark"?\]/);
  assert.doesNotMatch(css, /@custom-variant/);
});

test('local theme styles and lifecycle do not mutate host state', () => {
  const css = readFileSync(join(root, 'index.css'), 'utf8');
  assert.doesNotMatch(css, /@import|@theme|@custom-variant dark\b|\bhtml\b|\bbody\b/);
  assert.doesNotMatch(css, /@custom-variant/);
  const app = readFileSync(join(root, 'App.tsx'), 'utf8');
  assert.doesNotMatch(app, /document\.title|document\.documentElement|location\.hash|hashchange/);
  const scene = readFileSync(join(root, 'components/ThreeDProsthoSandbox.tsx'), 'utf8');
  for (const cleanup of ['cancelAnimationFrame(animationFrameId)', 'clearTimeout(timeoutId)', 'deleteSync(pendingSync)', 'resizeObserver.disconnect()', 'controls.dispose()', 'built.dispose()', 'environmentTarget.dispose()', 'roomEnvironment.dispose()', 'keyLight.shadow.dispose()', 'renderer.dispose()', 'renderer.forceContextLoss()', 'renderer.domElement.remove()']) {
    assert.ok(scene.includes(cleanup), cleanup);
  }
  assert.doesNotMatch(scene, /THREE\.Clock/);
});
