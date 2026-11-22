import type { LectureId, WorkspaceSection } from '../types/lecture';
import { VIRTUAL_LAB_LECTURES } from '../registry';
import { LECTURES } from '../data/lectures';

export const SANDBOX_KINDS = ['flow', 'case', 'compare', 'planner'] as const;
const lectureIds = new Set<string>(VIRTUAL_LAB_LECTURES.map((lecture) => lecture.id));
const sandboxKeys = new Set(VIRTUAL_LAB_LECTURES.flatMap((lecture) =>
  SANDBOX_KINDS.map((kind) => `${lecture.id}-${kind}`)));
const sections = new Set<string>(['lab3d', 'sandboxes', 'visuals', 'assessment']);
const quizTotals = new Map(LECTURES.map((lecture) => [lecture.id, lecture.quiz.length]));

export interface PersistedState {
  activeSection: WorkspaceSection;
  completed3D: Record<string, boolean>;
  completedSandboxes: Record<string, boolean>;
  quizScores: Record<string, { score: number; total: number }>;
  visitedVisuals: Record<string, boolean>;
}

export function defaultProgress(): PersistedState {
  return { activeSection: 'lab3d', completed3D: {}, completedSandboxes: {}, quizScores: {}, visitedVisuals: {} };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isLectureId(value: unknown): value is LectureId {
  return typeof value === 'string' && lectureIds.has(value);
}

export function isSandboxKey(value: string): boolean {
  return sandboxKeys.has(value);
}

export function isWorkspaceSection(value: unknown): value is WorkspaceSection {
  return typeof value === 'string' && sections.has(value);
}

export function validQuizScore(id: LectureId, score: unknown, total: unknown): boolean {
  return typeof score === 'number' && typeof total === 'number' &&
    Number.isInteger(score) && Number.isInteger(total) && total === quizTotals.get(id) &&
    total > 0 && score >= 0 && score <= total;
}

function validatedFlags(value: unknown, allowed: ReadonlySet<string>): Record<string, boolean> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value)
    .filter(([key, flag]) => allowed.has(key) && flag === true)
    .map(([key]) => [key, true]));
}

export function validateProgress(value: unknown): PersistedState {
  const next = defaultProgress();
  if (!isRecord(value)) return next;
  if (isWorkspaceSection(value.activeSection)) next.activeSection = value.activeSection;
  next.completed3D = validatedFlags(value.completed3D, lectureIds);
  next.visitedVisuals = validatedFlags(value.visitedVisuals, lectureIds);
  next.completedSandboxes = validatedFlags(value.completedSandboxes, sandboxKeys);
  if (isRecord(value.quizScores)) {
    for (const [id, result] of Object.entries(value.quizScores)) {
      if (isLectureId(id) && isRecord(result) && validQuizScore(id, result.score, result.total)) {
        next.quizScores[id] = { score: result.score as number, total: result.total as number };
      }
    }
  }
  return next;
}

export function getLectureProgress(state: Pick<PersistedState, 'completed3D' | 'completedSandboxes' | 'quizScores' | 'visitedVisuals'>, id: LectureId) {
  const sandboxCount = SANDBOX_KINDS.filter((kind) => state.completedSandboxes[`${id}-${kind}`] === true).length;
  const explored3D = state.completed3D[id] === true;
  const visualsVisited = state.visitedVisuals[id] === true;
  const result = state.quizScores[id];
  const quizRecorded = Boolean(result && validQuizScore(id, result.score, result.total));
  return { sandboxCount, explored3D, visualsVisited, quizRecorded,
    complete: explored3D && sandboxCount === SANDBOX_KINDS.length && visualsVisited && quizRecorded };
}
