import { create } from 'zustand';
import type { LectureId, WorkspaceSection } from '../types/lecture';
import {
  defaultProgress, validateProgress, isLectureId, isSandboxKey,
  isWorkspaceSection, validQuizScore, type PersistedState,
} from './progress';

export const STORAGE_KEY = 'precision_dental_cb_lab_v1';

function loadPersistedState(): PersistedState {
  if (typeof window === 'undefined') return defaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? validateProgress(JSON.parse(raw)) : defaultProgress();
  } catch {
    return defaultProgress();
  }
}

function savePersistedState(state: PersistedState): void {
  if (typeof window === 'undefined') return;
  try {
    // Whitelist persisted fields rather than serializing transient UI or actions.
    const { activeSection, completed3D, completedSandboxes, quizScores, visitedVisuals } = state;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ activeSection, completed3D, completedSandboxes, quizScores, visitedVisuals }));
  } catch {
    // Private browsing, blocked storage, and quota failures must not block learning.
  }
}

interface LabStore extends PersistedState {
  showDashboard: boolean;
  setActiveSection: (section: WorkspaceSection) => void;
  mark3DExplored: (lectureId: LectureId) => void;
  markSandboxCompleted: (sandboxKey: string) => void;
  markVisualsVisited: (lectureId: LectureId) => void;
  recordQuizScore: (lectureId: LectureId, score: number, total: number) => void;
  setShowDashboard: (open: boolean) => void;
  resetAllProgress: () => void;
}

export const useLabStore = create<LabStore>((set, get) => ({
  ...loadPersistedState(),
  showDashboard: false,
  setActiveSection: (section) => {
    if (!isWorkspaceSection(section)) return;
    set({ activeSection: section });
    savePersistedState(get());
  },
  mark3DExplored: (lectureId) => {
    if (!isLectureId(lectureId) || get().completed3D[lectureId]) return;
    set((state) => ({ completed3D: { ...state.completed3D, [lectureId]: true } }));
    savePersistedState(get());
  },
  markSandboxCompleted: (sandboxKey) => {
    if (!isSandboxKey(sandboxKey) || get().completedSandboxes[sandboxKey]) return;
    set((state) => ({ completedSandboxes: { ...state.completedSandboxes, [sandboxKey]: true } }));
    savePersistedState(get());
  },
  markVisualsVisited: (lectureId) => {
    if (!isLectureId(lectureId) || get().visitedVisuals[lectureId]) return;
    set((state) => ({ visitedVisuals: { ...state.visitedVisuals, [lectureId]: true } }));
    savePersistedState(get());
  },
  recordQuizScore: (lectureId, score, total) => {
    if (!isLectureId(lectureId) || !validQuizScore(lectureId, score, total)) return;
    const previous = get().quizScores[lectureId];
    if (previous?.score === score && previous.total === total) return;
    set((state) => ({ quizScores: { ...state.quizScores, [lectureId]: { score, total } } }));
    savePersistedState(get());
  },
  setShowDashboard: (open) => set({ showDashboard: open }),
  resetAllProgress: () => {
    const defaults = defaultProgress();
    set({ ...defaults, showDashboard: false });
    savePersistedState(defaults);
  },
}));
