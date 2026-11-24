import { createInitialProgress, LECTURES } from '../data/lectures';
import type { LectureId, ProgressMap, SceneId } from '../types/prosthodontics';

export const STORAGE_KEY = 'precision_dental_prostho_progress_v2';
export const THEME_STORAGE_KEY = 'precision_dental_prostho_theme_v1';
export const SCENE_IDS: SceneId[] = ['scene-1', 'scene-2', 'scene-3', 'scene-4', 'scene-5', 'scene-6'];
export const SANDBOX_IDS = ['sandbox-3d', '2d-anatomy', '2d-builder', '2d-workflow', '2d-diagnostic'];

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function validIds<T extends string>(value: unknown, allowed: readonly T[]): T[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((id): id is T => typeof id === 'string' && allowed.includes(id as T)))]
    : [];
}

/** Storage is untrusted: rebuild every entry rather than spreading parsed objects. */
export function parseProgress(raw: string | null): ProgressMap {
  const initial = createInitialProgress();
  try {
    const parsed: unknown = raw === null ? null : JSON.parse(raw);
    if (!record(parsed)) return initial;
    for (const lecture of LECTURES) {
      const value = parsed[lecture.id];
      if (!record(value)) continue;
      const attempts = typeof value.quizAttempts === 'number' && Number.isSafeInteger(value.quizAttempts) && value.quizAttempts > 0
        ? value.quizAttempts : 0;
      const score = value.quizBestScore;
      initial[lecture.id] = {
        visitedScenes: validIds(value.visitedScenes, SCENE_IDS),
        completedSandboxes: validIds(value.completedSandboxes, SANDBOX_IDS),
        solvedCases: validIds(value.solvedCases, lecture.clinicalCases.map((item) => item.id)),
        quizAttempts: attempts,
        quizBestScore: attempts > 0 && typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 100 ? score : null,
      };
    }
  } catch {
    // Invalid JSON, blocked storage and obsolete formats all start clean.
  }
  return initial;
}

export function loadStoredProgress(): ProgressMap {
  try { return parseProgress(window.localStorage.getItem(STORAGE_KEY)); }
  catch { return createInitialProgress(); }
}
export function loadStoredTheme(): boolean {
  try { return window.localStorage.getItem(THEME_STORAGE_KEY) !== 'light'; }
  catch { return true; }
}

export type ProgressAction =
  | { type: 'visit'; lectureId: LectureId; scene: SceneId }
  | { type: 'sandbox'; lectureId: LectureId; sandboxId: string }
  | { type: 'case'; lectureId: LectureId; caseId: string }
  | { type: 'quiz'; lectureId: LectureId; score: number }
  | { type: 'reset' };

export function progressReducer(state: ProgressMap, action: ProgressAction): ProgressMap {
  if (action.type === 'reset') return createInitialProgress();
  const lecture = LECTURES.find((item) => item.id === action.lectureId);
  if (!lecture) return state;
  const current = state[lecture.id];
  const append = (key: 'visitedScenes' | 'completedSandboxes' | 'solvedCases', id: string, allowed: readonly string[]) => {
    if (!allowed.includes(id) || (current[key] as string[]).includes(id)) return state;
    return { ...state, [lecture.id]: { ...current, [key]: [...current[key], id] } };
  };
  switch (action.type) {
    case 'visit': return append('visitedScenes', action.scene, SCENE_IDS);
    case 'sandbox': return append('completedSandboxes', action.sandboxId, SANDBOX_IDS);
    case 'case': return append('solvedCases', action.caseId, lecture.clinicalCases.map((item) => item.id));
    case 'quiz':
      if (!Number.isFinite(action.score) || action.score < 0 || action.score > 100) return state;
      return { ...state, [lecture.id]: {
        ...current,
        quizBestScore: Math.max(current.quizBestScore ?? 0, action.score),
        quizAttempts: Math.min(Number.MAX_SAFE_INTEGER, current.quizAttempts + 1),
      } };
  }
}
