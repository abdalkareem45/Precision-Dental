/// <reference types="node" />
import test from 'node:test';
import assert from 'node:assert/strict';

// Install storage before importing the store so hydration exercises the real path.
let saved: string | null = JSON.stringify({
  activeSection: 'assessment', completed3D: { 'lec-04': true, 'lec-99': true },
  completedSandboxes: null, quizScores: { 'lec-04': { score: 4, total: 0 } },
});
let blocked = false;
const browser = {
  localStorage: {
    getItem() { if (blocked) throw new Error('Storage blocked'); return saved; },
    setItem(_key: string, value: string) { if (blocked) throw new Error('Quota exceeded'); saved = value; },
  },
};
Object.defineProperty(globalThis, 'window', { value: browser, configurable: true });
const { useLabStore } = await import('../store/useLabStore');

test('store hydrates valid data while discarding malformed records', () => {
  const state = useLabStore.getState();
  assert.equal(state.activeSection, 'assessment');
  assert.deepEqual(state.completed3D, { 'lec-04': true });
  assert.deepEqual(state.completedSandboxes, {});
  assert.deepEqual(state.quizScores, {});
});

test('actions validate IDs and scores, persist progress, and do not persist modal state', () => {
  useLabStore.getState().resetAllProgress();
  const actions = useLabStore.getState();
  actions.mark3DExplored('lec-04');
  actions.markSandboxCompleted('lec-04-compare');
  actions.markSandboxCompleted('lec-04-unknown');
  actions.markVisualsVisited('lec-04');
  actions.recordQuizScore('lec-04', 0, 4);
  actions.recordQuizScore('lec-05', NaN, 4);
  actions.recordQuizScore('lec-05', 2, 0);
  actions.recordQuizScore('lec-05', 2.5, 4);
  actions.recordQuizScore('lec-05', 5, 4);
  actions.setShowDashboard(true);
  actions.setActiveSection('visuals');
  const state = useLabStore.getState();
  assert.deepEqual(state.quizScores, { 'lec-04': { score: 0, total: 4 } });
  assert.deepEqual(state.completedSandboxes, { 'lec-04-compare': true });
  assert.equal(state.showDashboard, true);
  const stored = JSON.parse(saved!);
  assert.equal(stored.activeSection, 'visuals');
  assert.equal('showDashboard' in stored, false);
  assert.equal('activeLectureId' in stored, false);
  assert.equal('setActiveSection' in stored, false);
});

test('blocked persistence never interrupts learning and reset uses fresh records', () => {
  const oldRecords = useLabStore.getState().completed3D;
  blocked = true;
  assert.doesNotThrow(() => {
    useLabStore.getState().mark3DExplored('lec-05');
    useLabStore.getState().recordQuizScore('lec-05', 4, 4);
    useLabStore.getState().resetAllProgress();
  });
  blocked = false;
  const state = useLabStore.getState();
  assert.deepEqual(state.completed3D, {});
  assert.deepEqual(state.quizScores, {});
  assert.equal(state.showDashboard, false);
  assert.equal(state.activeSection, 'lab3d');
  assert.notEqual(state.completed3D, oldRecords);
  state.mark3DExplored('lec-06');
  state.resetAllProgress();
  assert.deepEqual(useLabStore.getState().completed3D, {});
});
