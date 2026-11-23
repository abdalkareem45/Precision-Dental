import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';
import { compile } from 'tailwindcss';
import * as THREE from 'three';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../App';
import { LECTURES } from '../data/lectures';
import { LECTURE_CASES, LECTURE_QUIZZES, APEX_LOCATOR_GENERATIONS, NITI_GENERATIONS, SEALER_FAMILIES, PAIN_LADDER_STEPS } from '../data/quizzesAndCases';
import { createInitialProgress, normalizeProgress, loadProgress, saveProgress, loadTheme, saveTheme, updateProgress, isLectureComplete, PROGRESS_STORAGE_KEY, THEME_STORAGE_KEY } from '../progress';
import { createStudioScene, disposeObject3D } from '../three/studioEngine';
import { buildCutawayToothGroup, buildEndodonticFileGroup, buildCrossSectionDisc } from '../three/dentalGeometry';
import { gpu } from './three-mock';

const root = fileURLToPath(new URL('..', import.meta.url));
const assets = path.resolve(root, '../../../public/assets/endo-curriculum');
const read = (name: string) => readFileSync(path.join(root, name), 'utf8');
function sourceFiles(directory = root): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.name === 'tests' ? [] : entry.isDirectory() ? sourceFiles(path.join(directory, entry.name)) : /\.tsx?$/.test(entry.name) ? [path.join(directory, entry.name)] : []);
}
const ids = ['lecture-3', 'lecture-4', 'lecture-4b', 'lecture-5', 'lecture-7', 'lecture-8', 'lecture-9'];

test('content: stable lecture order, labels and complete activity metadata', () => {
  assert.deepEqual(LECTURES.map((l) => l.id), ids);
  assert.deepEqual(LECTURES.map((l) => l.lectureNumberLabel), ['Lecture 3', 'Lecture 4', 'Lecture 4B', 'Lecture 5', 'Lecture 7', 'Lecture 8', 'Lecture 9']);
  const allIds: string[] = [];
  for (const lecture of LECTURES) {
    assert.ok(lecture.title && lecture.subtitle && lecture.objectives.length && lecture.keyTakeaways.length && lecture.references.length);
    assert.equal(lecture.sandboxes3d.length, 3);
    assert.equal(lecture.sandboxes2d.length, 2);
    for (const activity of [...lecture.sandboxes3d, ...lecture.sandboxes2d]) {
      assert.ok(activity.id && activity.title && activity.subtitle);
      allIds.push(activity.id);
    }
    const quizzes = LECTURE_QUIZZES[lecture.id];
    const cases = LECTURE_CASES[lecture.id];
    assert.equal(quizzes.length, 4);
    assert.equal(cases.length, 1);
    for (const question of quizzes) {
      allIds.push(question.id);
      assert.equal(new Set(question.options.map((o) => o.id)).size, question.options.length);
      assert.equal(question.options.filter((o) => o.id === question.correctOptionId).length, 1);
      assert.ok(question.prompt && question.explanation && question.sourceRef);
    }
    for (const scenario of cases) {
      allIds.push(scenario.id);
      assert.equal(scenario.options.filter((o) => o.isOptimal).length, 1);
      assert.equal(new Set(scenario.options.map((o) => o.id)).size, scenario.options.length);
      assert.ok(scenario.clinicalFindings.length && scenario.educationalNote);
      scenario.options.forEach((o) => assert.ok(o.rationale && o.clinicalOutcome));
    }
  }
  assert.equal(new Set(allIds).size, allIds.length);
  assert.deepEqual([APEX_LOCATOR_GENERATIONS.length, NITI_GENERATIONS.length, SEALER_FAMILIES.length, PAIN_LADDER_STEPS.length], [6, 6, 8, 3]);
});

test('resources: all seven PDF URLs honor a nested BASE_URL and resolve to PDF files', () => {
  for (const lecture of LECTURES) {
    assert.equal(lecture.sourcePdfPath, `/nested/endo/assets/endo-curriculum/aistudio/${lecture.sourcePdfName}`);
    const file = path.join(assets, 'aistudio', decodeURIComponent(lecture.sourcePdfName));
    assert.ok(existsSync(file), file);
    assert.equal(readFileSync(file).subarray(0, 5).toString(), '%PDF-');
  }
  const pngs = readdirSync(path.join(assets, 'aistudio')).filter((f) => f.endsWith('.png'));
  assert.equal(pngs.length, 1);
  assert.equal(readFileSync(path.join(assets, 'aistudio', pngs[0])).subarray(1, 4).toString(), 'PNG');
});

test('progress: a fresh curriculum and every server-rendered lecture start at zero', () => {
  const fresh = createInitialProgress();
  for (const lecture of LECTURES) {
    assert.deepEqual(fresh[lecture.id], { explored3dIds: [], completed2dIds: [], completedCaseIds: [], quizBestScore: null, quizTotalQuestions: 4 });
    const html = renderToStaticMarkup(<App lectureId={lecture.id} />);
    assert.match(html, /endo-curriculum/);
    assert.match(html, /3D: 0\/3/);
    assert.match(html, /2D: 0\/2/);
    assert.doesNotMatch(html, /<h1|href="#|role="tablist"/);
  }
  fresh['lecture-3'].explored3dIds.push('x');
  assert.deepEqual(createInitialProgress()['lecture-3'].explored3dIds, []);
});

test('progress: malformed storage shapes, invalid IDs and invalid scores are discarded', () => {
  const fresh = createInitialProgress();
  for (const value of [null, [], 'text', 12, false, { 'lecture-3': null }, { 'lecture-3': [] }]) assert.deepEqual(normalizeProgress(value), fresh);
  for (const raw of ['{', 'null', '[]', 'false', '123', '"text"']) assert.deepEqual(loadProgress({ getItem: () => raw }), fresh);
  const valid = LECTURES[0].sandboxes3d[0].id;
  const normalized = normalizeProgress({ 'lecture-3': {
    explored3dIds: [valid, valid, 'foreign', 2, null, {}], completed2dIds: 'bad', completedCaseIds: [false, 'foreign'], quizBestScore: 4, quizTotalQuestions: 999,
  }});
  assert.deepEqual(normalized['lecture-3'], { ...fresh['lecture-3'], explored3dIds: [valid], quizBestScore: 4 });
  for (const score of [-1, 5, 0.5, NaN, Infinity, '4']) assert.equal(normalizeProgress({ 'lecture-3': { quizBestScore: score } })['lecture-3'].quizBestScore, null);
  assert.equal(normalizeProgress({ 'lecture-3': { quizBestScore: 0 } })['lecture-3'].quizBestScore, 0);
  assert.deepEqual(loadProgress({ getItem() { throw new Error('denied'); } }), fresh);
  assert.doesNotThrow(() => saveProgress(fresh, { setItem() { throw new Error('quota'); } }));
});

test('progress: storage keys are isolated, themes tolerate denied storage, and data round-trips', () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  saveProgress(createInitialProgress(), storage);
  assert.ok(values.has(PROGRESS_STORAGE_KEY));
  assert.deepEqual(loadProgress(storage), createInitialProgress());
  saveTheme('dark', storage);
  assert.equal(values.get(THEME_STORAGE_KEY), 'dark');
  assert.equal(loadTheme(storage), 'dark');
  assert.equal(loadTheme({ getItem() { throw new Error('denied'); } }), 'light');
  assert.doesNotThrow(() => saveTheme('light', { setItem() { throw new Error('denied'); } }));
  assert.ok([...values.keys()].every((key) => key.startsWith('endo-curriculum:')));
});

test('progress: interactions are validated, immutable, idempotent and scoped by lecture', () => {
  const fresh = createInitialProgress();
  const id = LECTURES[0].sandboxes3d[0].id;
  const action = { type: 'explore3d' as const, lectureId: 'lecture-3' as const, id };
  const next = updateProgress(fresh, action);
  assert.deepEqual(fresh['lecture-3'].explored3dIds, []);
  assert.deepEqual(next['lecture-3'].explored3dIds, [id]);
  assert.equal(next['lecture-4'], fresh['lecture-4']);
  assert.equal(updateProgress(next, action), next);
  assert.equal(updateProgress(next, { ...action, id: 'unknown' }), next);
  assert.equal(updateProgress(next, { ...action, lectureId: 'lecture-4' }), next);
  assert.equal(updateProgress(next, { ...action, type: 'complete2d' }), next);
  let scored = updateProgress(next, { type: 'quiz', lectureId: 'lecture-3', score: 0 });
  assert.equal(scored['lecture-3'].quizBestScore, 0);
  scored = updateProgress(scored, { type: 'quiz', lectureId: 'lecture-3', score: 3 });
  assert.equal(updateProgress(scored, { type: 'quiz', lectureId: 'lecture-3', score: 2 }), scored);
  for (const score of [-1, 5, NaN, Infinity, 1.5]) assert.equal(updateProgress(scored, { type: 'quiz', lectureId: 'lecture-3', score }), scored);
  assert.deepEqual(updateProgress(scored, { type: 'reset' }), fresh);
});

test('progress: completion requires every lab, studio, optimal case and full quiz score', () => {
  let progress = createInitialProgress();
  for (const lecture of LECTURES) {
    for (const lab of lecture.sandboxes3d) progress = updateProgress(progress, { type: 'explore3d', lectureId: lecture.id, id: lab.id });
    progress = updateProgress(progress, { type: 'quiz', lectureId: lecture.id, score: 4 });
    assert.equal(isLectureComplete(lecture.id, progress), false);
    for (const studio of lecture.sandboxes2d) progress = updateProgress(progress, { type: 'complete2d', lectureId: lecture.id, id: studio.id });
    assert.equal(isLectureComplete(lecture.id, progress), false);
    for (const scenario of LECTURE_CASES[lecture.id]) progress = updateProgress(progress, { type: 'completeCase', lectureId: lecture.id, id: scenario.id });
    assert.equal(isLectureComplete(lecture.id, progress), true);
  }
});

test('integration: no global routing/title/theme writes or automatic completion in effects', () => {
  for (const file of sourceFiles()) {
    const text = readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /hashchange|location\.hash|document\.title|document\.documentElement|assets\/aistudio\//, file);
    assert.doesNotMatch(text, /\bdark:/, file);
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && node.expression.getText(ast) === 'useEffect' && node.arguments[0]) {
        assert.doesNotMatch(node.arguments[0].getText(ast), /onInteract\?\.|onExplore3D\(|onComplete\(|onCaseComplete\(|onQuizComplete\(/, file);
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
  assert.doesNotMatch(read('components/LectureWorkspace.tsx'), /onExplore3D\(lecture\.id, sb\.id\)/);
  assert.match(read('components/sandboxes2d/Lecture2DSandboxes.tsx'), /wlStepsPicked\.length \+ 1 === orderedSteps\.length/);
  const css = read('curriculum.css');
  assert.doesNotMatch(css, /@import|@tailwind|:root|\bhtml\s*\{|\bbody\s*\{/);
  for (const line of css.split('\n').filter((line) => line.includes('{') && !line.trim().startsWith('@'))) assert.ok(line.includes('.endo-curriculum'), line);
});

test('styles: Tailwind compiles curriculum-only dark variants independently of the parent theme', async () => {
  const { build } = await compile('@tailwind utilities;');
  const css = build([
    '[.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]',
    '[.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]',
  ]);
  assert.ok(css.includes('.endo-curriculum[data-endo-theme=dark] .'));
  assert.ok(css.includes('color: var(--pd-gold)'));
  assert.ok(css.includes('border-color: var(--pd-gold)'));
  assert.doesNotMatch(css, /prefers-color-scheme/);
});

test('resources: procedural geometry is finite and shared GPU resources dispose once per tree', () => {
  const shapes = ['square', 'triangle', 'rhomboid', 'hfile', 'sfile', 'broach', 'ushape', 'convexTriangle', 'offsetRect'] as const;
  const root = new THREE.Group();
  for (const crossSection of shapes) {
    root.add(buildEndodonticFileGroup({ crossSection }), buildCrossSectionDisc(crossSection));
  }
  for (const options of [{}, { curved: true }, { openApex: true }, { resorption: true }]) root.add(buildCutawayToothGroup(options).group);
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) assert.ok(Array.from(object.geometry.attributes.position.array).every(Number.isFinite));
  });
  const geometry = new THREE.BoxGeometry();
  const texture = new THREE.Texture();
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const instances = new THREE.InstancedMesh(geometry, material, 2);
  root.add(new THREE.Mesh(geometry, material), new THREE.Mesh(geometry, [material, material]), instances);
  const count = { geometry: 0, material: 0, texture: 0, instances: 0, shadow: 0 };
  geometry.addEventListener('dispose', () => count.geometry++);
  material.addEventListener('dispose', () => count.material++);
  texture.addEventListener('dispose', () => count.texture++);
  instances.addEventListener('dispose', () => count.instances++);
  const light = new THREE.DirectionalLight();
  light.shadow.dispose = () => { count.shadow++; };
  root.add(light);
  disposeObject3D(root);
  assert.deepEqual(count, { geometry: 1, material: 1, texture: 1, instances: 1, shadow: 1 });
});

function browserHarness({ software = false, reducedMotion = false } = {}) {
  let nextId = 0;
  const frames = new Map<number, FrameRequestCallback>();
  const timers = new Map<number, () => void>();
  const observers: any[] = [];
  const section = new EventTarget();
  const container = Object.assign(new EventTarget(), {
    clientWidth: 640, clientHeight: 480, innerHTML: '', children: [] as any[],
    closest: () => section,
    appendChild(canvas: any) { this.children.push(canvas); canvas.remove = () => { this.children = this.children.filter((c) => c !== canvas); }; },
  });
  const gl = { RENDERER: 1, getExtension: () => null, getParameter: () => software ? 'SwiftShader' : 'Hardware GPU' };
  const replacements = {
    document: { createElement: () => Object.assign(new EventTarget(), { style: {}, getContext: (name: string) => name === '2d' ? null : gl, remove() {} }) },
    window: { devicePixelRatio: 1, matchMedia: () => ({ matches: reducedMotion }), setTimeout: (cb: () => void) => { timers.set(++nextId, cb); return nextId; }, clearTimeout: (id: number) => timers.delete(id) },
    requestAnimationFrame: (cb: FrameRequestCallback) => { frames.set(++nextId, cb); return nextId; },
    cancelAnimationFrame: (id: number) => frames.delete(id),
    ResizeObserver: class {
      callback: any; disconnected = false;
      constructor(callback: any) { this.callback = callback; observers.push(this); }
      observe() {}
      disconnect() { this.disconnected = true; }
    },
  };
  const previous = Object.fromEntries(Object.keys(replacements).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  Object.entries(replacements).forEach(([key, value]) => Object.defineProperty(globalThis, key, { value, configurable: true, writable: true }));
  return {
    container, frames, timers, observers, section,
    flush() {
      const frame = frames.entries().next().value;
      if (frame) { frames.delete(frame[0]); frame[1](performance.now()); return; }
      const timer = timers.entries().next().value;
      if (timer) { timers.delete(timer[0]); timer[1](); }
    },
    restore() {
      Object.entries(previous).forEach(([key, descriptor]) => descriptor ? Object.defineProperty(globalThis, key, descriptor) : Reflect.deleteProperty(globalThis, key));
    },
  };
}

for (const software of [false, true]) test(`resources: ${software ? 'software timers' : 'hardware RAF'} stop on dispose, with full scene cleanup`, () => {
  const browser = browserHarness({ software });
  try {
    const before = { room: gpu.roomsDisposed, target: gpu.targetsDisposed, generator: gpu.generatorsDisposed };
    const studio = createStudioScene(browser.container as unknown as HTMLElement)!;
    assert.ok(studio);
    const renderer = gpu.renderers.at(-1)!;
    let ticks = 0;
    studio.startLoop(() => ticks++);
    studio.startLoop(() => ticks++);
    assert.equal(browser.frames.size + browser.timers.size, 1);
    browser.flush();
    assert.equal(ticks, 1);
    assert.equal(browser.frames.size + browser.timers.size, 1);
    browser.observers[0].callback([{ contentRect: { width: 180, height: 240 } }]);
    assert.deepEqual(renderer.sizes.at(-1), [180, 240]);
    studio.dispose();
    studio.dispose();
    assert.equal(browser.frames.size + browser.timers.size, 0);
    assert.equal(browser.observers[0].disconnected, true);
    assert.equal(browser.container.children.length, 0);
    assert.equal(renderer.disposed, 1);
    assert.equal(renderer.lost, 1);
    assert.equal(studio.scene.children.length, 0);
    assert.equal(studio.scene.environment, null);
    assert.deepEqual([gpu.roomsDisposed - before.room, gpu.targetsDisposed - before.target, gpu.generatorsDisposed - before.generator], [1, 1, 1]);
    studio.requestRender();
    studio.startLoop(() => ticks++);
    browser.section.dispatchEvent(new Event('input'));
    assert.equal(browser.frames.size + browser.timers.size, 0);
    browser.flush();
    assert.equal(ticks, 1);
  } finally { browser.restore(); }
});

test('resources: context loss cleans up, notifies the shell, and cannot restart rendering', () => {
  const browser = browserHarness();
  try {
    let notified = 0;
    browser.container.addEventListener('studio-webgl-lost', () => notified++);
    const studio = createStudioScene(browser.container as unknown as HTMLElement)!;
    studio.startLoop(() => {});
    const renderer = gpu.renderers.at(-1)!;
    renderer.domElement.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
    assert.equal(notified, 1);
    assert.equal(renderer.disposed, 1);
    assert.equal(browser.frames.size + browser.timers.size, 0);
    studio.dispose();
    assert.equal(renderer.disposed, 1);
  } finally { browser.restore(); }
});

test('resources: renderer allocation failure uses the fallback rather than throwing', async () => {
  const browser = browserHarness();
  try {
    gpu.failRenderer = true;
    let notified = 0;
    browser.container.addEventListener('studio-webgl-lost', () => notified++);
    assert.equal(createStudioScene(browser.container as unknown as HTMLElement), null);
    await Promise.resolve();
    assert.equal(notified, 1);
  } finally { gpu.failRenderer = false; browser.restore(); }
});

test('resources: reduced motion renders static frames but still responds to controls', () => {
  const browser = browserHarness({ reducedMotion: true });
  try {
    const studio = createStudioScene(browser.container as unknown as HTMLElement)!;
    let elapsed = -1;
    studio.startLoop((_dt, time) => { elapsed = time; });
    browser.flush();
    assert.equal(elapsed, 0);
    assert.equal(browser.frames.size + browser.timers.size, 0);
    browser.section.dispatchEvent(new Event('input'));
    assert.equal(browser.timers.size, 1);
    browser.flush();
    assert.equal(elapsed, 0);
    studio.dispose();
    assert.equal(browser.frames.size + browser.timers.size, 0);
  } finally { browser.restore(); }
});
