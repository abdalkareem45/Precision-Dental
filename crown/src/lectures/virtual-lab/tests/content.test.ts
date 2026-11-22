/// <reference types="node" />
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { LECTURES } from '../data/lectures';
import { VIRTUAL_LAB_LECTURES } from '../registry';
import { SOURCE_PDF_FILES, sourcePdfUrl } from '../sourcePdfs';
import { defaultProgress, getLectureProgress, validateProgress } from '../store/progress';

const ids = ['lec-04', 'lec-05', 'lec-06', 'lec-07a', 'lec-07b', 'lec-10a', 'lec-10b', 'lec-11', 'lec-12'];
const labRoot = new URL('../', import.meta.url);
const assetsRoot = new URL('../../../public/assets/crown-virtual-lab/', labRoot);

function uniqueIds(items: { id: string }[]) {
  assert.equal(new Set(items.map((item) => item.id)).size, items.length);
}

test('registry preserves all nine exact IDs, labels, titles and summaries', () => {
  assert.deepEqual(LECTURES.map((lecture) => lecture.id), ids);
  assert.deepEqual(VIRTUAL_LAB_LECTURES.map((lecture) => lecture.id), ids);
  assert.deepEqual(LECTURES.map((lecture) => lecture.numberLabel),
    ['Lecture 04', 'Lecture 05', 'Lecture 06', 'Lecture 07A', 'Lecture 07B', 'Lecture 10A', 'Lecture 10B', 'Lecture 11', 'Lecture 12']);
  assert.deepEqual(VIRTUAL_LAB_LECTURES, LECTURES.map(({ id, title, numberLabel, summary }) => ({ id, title, numberLabel, summary })));
});

test('every PDF maps to an existing PDF and honors root, nested, and absolute bases', () => {
  assert.deepEqual(Object.keys(SOURCE_PDF_FILES), ids);
  for (const lecture of LECTURES) {
    const pdf = new URL(SOURCE_PDF_FILES[lecture.id], assetsRoot);
    assert.ok(existsSync(pdf), pdf.href);
    assert.equal(readFileSync(pdf).subarray(0, 5).toString(), '%PDF-');
    for (const base of ['/', '/study/crown/', '/study/crown', 'https://example.test/study/crown/']) {
      const expected = base.replace(/\/?$/, '/') + 'assets/crown-virtual-lab/' + SOURCE_PDF_FILES[lecture.id];
      assert.equal(sourcePdfUrl(lecture.id, base), expected);
    }
    assert.equal(lecture.sourcePdf, sourcePdfUrl(lecture.id));
  }
});

test('all lectures have functional content IDs, valid quiz answers and scene configurations', () => {
  for (const lecture of LECTURES) {
    assert.ok(lecture.title && lecture.summary && lecture.objectives.length);
    assert.equal(lecture.visualComponents.length, 10);
    assert.equal(lecture.quiz.length, 4);
    uniqueIds(lecture.quiz);
    uniqueIds(lecture.visualComponents);
    uniqueIds(lecture.procedureFlow.steps);
    uniqueIds(lecture.clinicalCase.stages);
    uniqueIds(lecture.materialComparison.items);
    uniqueIds(lecture.diagnosticPlanner.variables);
    for (const question of lecture.quiz) {
      uniqueIds(question.options);
      assert.ok(question.options.some((option) => option.id === question.correctOptionId), question.id);
    }
    for (const stage of lecture.clinicalCase.stages) {
      uniqueIds(stage.options);
      assert.ok(stage.options.some((option) => option.isRecommended));
    }
    for (const variable of lecture.diagnosticPlanner.variables) {
      uniqueIds(variable.options);
      assert.ok(variable.options.length);
      assert.ok(variable.options.every((option) => Number.isFinite(option.scoreDelta)));
    }
    assert.ok(lecture.threeD.primaryModes.length && lecture.threeD.guidedTour.length);
    assert.ok(lecture.threeD.sliderDefault >= lecture.threeD.sliderMin);
    assert.ok(lecture.threeD.sliderDefault <= lecture.threeD.sliderMax);
  }
});

test('malformed and unknown saved progress is rejected, valid entries survive', () => {
  for (const value of [null, [], true, 1, 'text', { completed3D: [], quizScores: null }, { activeSection: 'not-a-tab' }]) {
    assert.deepEqual(validateProgress(value), defaultProgress());
  }
  const state = validateProgress({
    activeLectureId: 'lec-99', activeSection: 'visuals',
    completed3D: { 'lec-04': true, 'lec-05': 'true', 'lec-99': true },
    completedSandboxes: { 'lec-04-flow': true, 'lec-04-case': 1, 'lec-04-fake': true },
    visitedVisuals: { 'lec-04': true, 'lec-06': false },
    quizScores: { 'lec-04': { score: 0, total: 4 }, 'lec-05': { score: 5, total: 4 },
      'lec-06': { score: -1, total: 4 }, 'lec-07a': { score: 1.5, total: 4 },
      'lec-07b': { score: 2, total: 100 }, 'lec-10a': null, 'lec-99': { score: 4, total: 4 } },
  });
  assert.equal(state.activeSection, 'visuals');
  assert.deepEqual(state.completed3D, { 'lec-04': true });
  assert.deepEqual(state.completedSandboxes, { 'lec-04-flow': true });
  assert.deepEqual(state.quizScores, { 'lec-04': { score: 0, total: 4 } });
  assert.deepEqual(state.visitedVisuals, { 'lec-04': true });
  assert.equal('activeLectureId' in state, false);
  const polluted = validateProgress(JSON.parse('{"completed3D":{"__proto__":true,"lec-04":true}}'));
  assert.deepEqual(Object.keys(polluted.completed3D), ['lec-04']);
});

test('lecture completion requires every module; zero-score attempts count as recorded', () => {
  const state = defaultProgress();
  state.completed3D['lec-04'] = true;
  state.completedSandboxes['lec-04-flow'] = true;
  state.quizScores['lec-04'] = { score: 0, total: 4 };
  assert.equal(getLectureProgress(state, 'lec-04').complete, false);
  for (const kind of ['case', 'compare', 'planner']) state.completedSandboxes[`lec-04-${kind}`] = true;
  assert.equal(getLectureProgress(state, 'lec-04').sandboxCount, 4);
  assert.equal(getLectureProgress(state, 'lec-04').complete, false);
  state.visitedVisuals['lec-04'] = true;
  assert.equal(getLectureProgress(state, 'lec-04').complete, true);
  assert.equal(getLectureProgress(state, 'lec-05').complete, false);
  state.quizScores['lec-04'] = { score: 100, total: 4 };
  assert.equal(getLectureProgress(state, 'lec-04').complete, false);
});

test('content shell has scoped CSS and delegates lecture navigation without a second main', () => {
  const css = readFileSync(new URL('index.css', labRoot), 'utf8');
  const app = readFileSync(new URL('App.tsx', labRoot), 'utf8');
  assert.doesNotMatch(css, /\b(?:html|body)\s*\{|@import|@theme/);
  assert.match(css, /\.crown-virtual-lab/);
  assert.doesNotMatch(app, /<main\b|<Header\b|<LectureSelectorBar\b|window\.location|document\.title/);
  assert.match(app, /onSelectLecture\(id\)/);
  assert.match(app, /Open progress dashboard/);
  assert.match(app, /href=\{lecture.sourcePdf\}/);
});
