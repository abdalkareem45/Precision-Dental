export type LectureId = 'lecture-4' | 'lecture-5' | 'lecture-6' | 'lecture-7';

export interface SandboxNavItem {
  id: string;
  label: string;
  kind: '3D Sandbox' | '2D Sandbox' | 'Knowledge Check';
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface LectureMeta {
  id: LectureId;
  number: number;
  shortTitle: string;
  title: string;
  subtitle: string;
  sourceLabel: string;
  objectives: string[];
  sandboxes: SandboxNavItem[];
  summaryPoints: string[];
  limitationsNote: string;
  quiz: QuizQuestion[];
}
