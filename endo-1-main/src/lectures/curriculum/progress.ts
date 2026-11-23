import { LECTURES } from './data/lectures';
import { LECTURE_CASES, LECTURE_QUIZZES } from './data/quizzesAndCases';
import type { CourseProgressMap, LectureId } from './types/lecture';

export const PROGRESS_STORAGE_KEY = 'endo-curriculum:progress:v1';
export const THEME_STORAGE_KEY = 'endo-curriculum:theme:v1';
export type ThemeMode = 'light' | 'dark';
type StorageReader = Pick<Storage, 'getItem'>;
type StorageWriter = Pick<Storage, 'setItem'>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function validIds(value: unknown, allowed: string[]): string[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((id): id is string => typeof id === 'string' && allowed.includes(id)))]
    : [];
}

export function normalizeProgress(value: unknown): CourseProgressMap {
  const source = isRecord(value) ? value : {};
  return Object.fromEntries(LECTURES.map((lecture) => {
    const candidate = Object.hasOwn(source, lecture.id) ? source[lecture.id] : undefined;
    const saved: Record<string, unknown> = isRecord(candidate) ? candidate : {};
    const total = LECTURE_QUIZZES[lecture.id].length;
    const score = saved.quizBestScore;
    return [lecture.id, {
      explored3dIds: validIds(saved.explored3dIds, lecture.sandboxes3d.map((s) => s.id)),
      completed2dIds: validIds(saved.completed2dIds, lecture.sandboxes2d.map((s) => s.id)),
      completedCaseIds: validIds(saved.completedCaseIds, LECTURE_CASES[lecture.id].map((c) => c.id)),
      quizBestScore: typeof score === 'number' && Number.isInteger(score) && score >= 0 && score <= total ? score : null,
      quizTotalQuestions: total,
    }];
  })) as CourseProgressMap;
}

export function createInitialProgress(): CourseProgressMap {
  return normalizeProgress(null);
}

export function loadProgress(storage?: StorageReader): CourseProgressMap {
  try {
    return normalizeProgress(JSON.parse((storage ?? window.localStorage).getItem(PROGRESS_STORAGE_KEY) ?? 'null'));
  } catch {
    return createInitialProgress();
  }
}

export function saveProgress(progress: CourseProgressMap, storage?: StorageWriter): void {
  try {
    (storage ?? window.localStorage).setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Private browsing or a full quota must not interrupt the lesson.
  }
}

export type ProgressAction =
  | { type: 'explore3d' | 'complete2d' | 'completeCase'; lectureId: LectureId; id: string }
  | { type: 'quiz'; lectureId: LectureId; score: number }
  | { type: 'reset' };

export function updateProgress(progress: CourseProgressMap, action: ProgressAction): CourseProgressMap {
  if (action.type === 'reset') return createInitialProgress();
  const lecture = LECTURES.find((l) => l.id === action.lectureId);
  if (!lecture) return progress;
  const current = progress[lecture.id];
  if (action.type === 'quiz') {
    const total = LECTURE_QUIZZES[lecture.id].length;
    if (!Number.isInteger(action.score) || action.score < 0 || action.score > total) return progress;
    const best = Math.max(current.quizBestScore ?? 0, action.score);
    if (best === current.quizBestScore) return progress;
    return { ...progress, [lecture.id]: { ...current, quizBestScore: best, quizTotalQuestions: total } };
  }
  const field = action.type === 'explore3d' ? 'explored3dIds' : action.type === 'complete2d' ? 'completed2dIds' : 'completedCaseIds';
  const allowed = action.type === 'explore3d' ? lecture.sandboxes3d : action.type === 'complete2d' ? lecture.sandboxes2d : LECTURE_CASES[lecture.id];
  if (!allowed.some((s) => s.id === action.id) || current[field].includes(action.id)) return progress;
  return { ...progress, [lecture.id]: { ...current, [field]: [...current[field], action.id] } };
}

export function isLectureComplete(lectureId: LectureId, progress: CourseProgressMap): boolean {
  const lecture = LECTURES.find((l) => l.id === lectureId)!;
  const p = progress[lectureId];
  return lecture.sandboxes3d.every((s) => p.explored3dIds.includes(s.id)) &&
    lecture.sandboxes2d.every((s) => p.completed2dIds.includes(s.id)) &&
    LECTURE_CASES[lectureId].every((c) => p.completedCaseIds.includes(c.id)) &&
    p.quizBestScore === LECTURE_QUIZZES[lectureId].length;
}

export function loadTheme(storage?: StorageReader): ThemeMode {
  try {
    const saved = (storage ?? window.localStorage).getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: ThemeMode, storage?: StorageWriter): void {
  try { (storage ?? window.localStorage).setItem(THEME_STORAGE_KEY, theme); } catch { /* Optional persistence. */ }
}
