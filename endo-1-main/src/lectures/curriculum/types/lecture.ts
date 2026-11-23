export type LectureId =
  | 'lecture-3'
  | 'lecture-4'
  | 'lecture-4b'
  | 'lecture-5'
  | 'lecture-7'
  | 'lecture-8'
  | 'lecture-9';

export interface Sandbox3DMeta {
  id: string;
  title: string;
  subtitle: string;
  focusMetric: string;
  learningGoal: string;
}

export interface Sandbox2DMeta {
  id: string;
  title: string;
  subtitle: string;
}

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  sourceRef: string;
}

export interface CaseDecisionOption {
  id: string;
  label: string;
  isOptimal: boolean;
  clinicalOutcome: string;
  rationale: string;
}

export interface ClinicalCaseScenario {
  id: string;
  title: string;
  patientPresentation: string;
  clinicalFindings: string[];
  question: string;
  options: CaseDecisionOption[];
  educationalNote: string;
}

export interface LectureDefinition {
  id: LectureId;
  shortCode: string;
  lectureNumberLabel: string;
  title: string;
  subtitle: string;
  lecturer?: string;
  sourcePdfPath: string;
  sourcePdfName: string;
  objectives: string[];
  keyTakeaways: string[];
  references: string[];
  sandboxes3d: [Sandbox3DMeta, Sandbox3DMeta, Sandbox3DMeta];
  sandboxes2d: Sandbox2DMeta[];
}

export interface LectureProgress {
  explored3dIds: string[];
  completed2dIds: string[];
  completedCaseIds: string[];
  quizBestScore: number | null;
  quizTotalQuestions: number;
}

export type CourseProgressMap = Record<LectureId, LectureProgress>;
