import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LectureSectionKey, ThemeMode } from '@/src/types/lecture';

export interface LectureProgressRecord {
  visitedSections: LectureSectionKey[];
  completedCases: string[];
  completed3D: string[];
  completed2D: string[];
  assessmentScore: number | null;
  assessmentTotal: number | null;
  lastVisitedAt: number;
}

interface LearningState {
  theme: ThemeMode;
  activeLectureId: string | null;
  activeSection: LectureSectionKey;
  studySeconds: number;
  tutorOpen: boolean;
  tutorTopic: string | null;
  progressByLecture: Record<string, LectureProgressRecord>;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  openLecture: (lectureId: string, section?: LectureSectionKey) => void;
  goHome: () => void;
  setActiveSection: (section: LectureSectionKey) => void;
  markSectionVisited: (lectureId: string, section: LectureSectionKey) => void;
  mark3DInteracted: (lectureId: string, sandboxId: string) => void;
  mark2DInteracted: (lectureId: string, sandboxKey: string) => void;
  markCaseCompleted: (lectureId: string, caseId: string) => void;
  recordAssessmentScore: (lectureId: string, score: number, total: number) => void;
  incrementStudySeconds: (delta?: number) => void;
  setTutorOpen: (open: boolean, topic?: string | null) => void;
  resetAllProgress: () => void;
}

function defaultProgress(): LectureProgressRecord {
  return {
    visitedSections: [],
    completedCases: [],
    completed3D: [],
    completed2D: [],
    assessmentScore: null,
    assessmentTotal: null,
    lastVisitedAt: Date.now(),
  };
}

export function calculateLectureCompletion(record?: LectureProgressRecord): number {
  if (!record) return 0;
  const sectionPoints = Math.min(record.visitedSections.length, 8) * 6; // up to 48%
  const lab3DPoints = Math.min(record.completed3D.length, 3) * 6; // up to 18%
  const lab2DPoints = Math.min(record.completed2D.length, 4) * 4; // up to 16%
  const casePoints = Math.min(record.completedCases.length, 3) * 4; // up to 12%
  const quizPoints = record.assessmentScore !== null ? 6 : 0; // 6%
  return Math.min(100, sectionPoints + lab3DPoints + lab2DPoints + casePoints + quizPoints);
}

function syncDomTheme(theme: ThemeMode) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
  try {
    localStorage.setItem('precision_dental_theme', theme);
  } catch {
    // ignore storage errors
  }
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      activeLectureId: null,
      activeSection: 'hero',
      studySeconds: 0,
      tutorOpen: false,
      tutorTopic: null,
      progressByLecture: {},

      setTheme: (theme) => {
        syncDomTheme(theme);
        set({ theme });
      },

      toggleTheme: () => {
        const next: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
        syncDomTheme(next);
        set({ theme: next });
      },

      openLecture: (lectureId, section = 'hero') => {
        set((state) => {
          const prev = state.progressByLecture[lectureId] || defaultProgress();
          const visited = prev.visitedSections.includes(section)
            ? prev.visitedSections
            : [...prev.visitedSections, section];
          return {
            activeLectureId: lectureId,
            activeSection: section,
            progressByLecture: {
              ...state.progressByLecture,
              [lectureId]: {
                ...prev,
                visitedSections: visited,
                lastVisitedAt: Date.now(),
              },
            },
          };
        });
      },

      goHome: () => set({ activeLectureId: null, activeSection: 'hero' }),

      setActiveSection: (section) => {
        const lectureId = get().activeLectureId;
        set((state) => {
          if (!lectureId) return { activeSection: section };
          const prev = state.progressByLecture[lectureId] || defaultProgress();
          const visited = prev.visitedSections.includes(section)
            ? prev.visitedSections
            : [...prev.visitedSections, section];
          return {
            activeSection: section,
            progressByLecture: {
              ...state.progressByLecture,
              [lectureId]: {
                ...prev,
                visitedSections: visited,
                lastVisitedAt: Date.now(),
              },
            },
          };
        });
      },

      markSectionVisited: (lectureId, section) => {
        set((state) => {
          const prev = state.progressByLecture[lectureId] || defaultProgress();
          if (prev.visitedSections.includes(section)) return state;
          return {
            progressByLecture: {
              ...state.progressByLecture,
              [lectureId]: {
                ...prev,
                visitedSections: [...prev.visitedSections, section],
                lastVisitedAt: Date.now(),
              },
            },
          };
        });
      },

      mark3DInteracted: (lectureId, sandboxId) => {
        set((state) => {
          const prev = state.progressByLecture[lectureId] || defaultProgress();
          if (prev.completed3D.includes(sandboxId)) return state;
          return {
            progressByLecture: {
              ...state.progressByLecture,
              [lectureId]: {
                ...prev,
                completed3D: [...prev.completed3D, sandboxId],
                lastVisitedAt: Date.now(),
              },
            },
          };
        });
      },

      mark2DInteracted: (lectureId, sandboxKey) => {
        set((state) => {
          const prev = state.progressByLecture[lectureId] || defaultProgress();
          if (prev.completed2D.includes(sandboxKey)) return state;
          return {
            progressByLecture: {
              ...state.progressByLecture,
              [lectureId]: {
                ...prev,
                completed2D: [...prev.completed2D, sandboxKey],
                lastVisitedAt: Date.now(),
              },
            },
          };
        });
      },

      markCaseCompleted: (lectureId, caseId) => {
        set((state) => {
          const prev = state.progressByLecture[lectureId] || defaultProgress();
          if (prev.completedCases.includes(caseId)) return state;
          return {
            progressByLecture: {
              ...state.progressByLecture,
              [lectureId]: {
                ...prev,
                completedCases: [...prev.completedCases, caseId],
                lastVisitedAt: Date.now(),
              },
            },
          };
        });
      },

      recordAssessmentScore: (lectureId, score, total) => {
        set((state) => {
          const prev = state.progressByLecture[lectureId] || defaultProgress();
          return {
            progressByLecture: {
              ...state.progressByLecture,
              [lectureId]: {
                ...prev,
                assessmentScore: score,
                assessmentTotal: total,
                lastVisitedAt: Date.now(),
              },
            },
          };
        });
      },

      incrementStudySeconds: (delta = 1) =>
        set((state) => ({ studySeconds: state.studySeconds + delta })),

      setTutorOpen: (open, topic = null) =>
        set({ tutorOpen: open, tutorTopic: topic }),

      resetAllProgress: () =>
        set({
          progressByLecture: {},
          studySeconds: 0,
        }),
    }),
    {
      name: 'precision_dental_oral_med_v1',
      partialize: (state) => ({
        theme: state.theme,
        studySeconds: state.studySeconds,
        progressByLecture: state.progressByLecture,
      }),
    }
  )
);
