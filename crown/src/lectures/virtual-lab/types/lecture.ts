export type LectureId =
  | 'lec-04'
  | 'lec-05'
  | 'lec-06'
  | 'lec-07a'
  | 'lec-07b'
  | 'lec-10a'
  | 'lec-10b'
  | 'lec-11'
  | 'lec-12';

export type WorkspaceSection =
  | 'lab3d'
  | 'sandboxes'
  | 'visuals'
  | 'assessment';

export interface LearningObjective {
  id: string;
  text: string;
  bloomLevel: 'Understand' | 'Analyze' | 'Apply' | 'Evaluate';
}

export interface GuidedTourStep {
  id: string;
  title: string;
  description: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  highlightPart?: string;
}

export interface ThreeDControlOption {
  id: string;
  label: string;
}

export interface ThreeDSandboxConfig {
  title: string;
  subtitle: string;
  educationalNote: string;
  defaultCamera: [number, number, number];
  defaultTarget: [number, number, number];
  primaryModes: ThreeDControlOption[];
  secondaryModes?: ThreeDControlOption[];
  sliderLabel: string;
  sliderUnit: string;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
  sliderDefault: number;
  toggleLabel: string;
  structureLayers: { id: string; label: string }[];
  guidedTour: GuidedTourStep[];
  accessibleSummary: string;
}

export interface ProcedureStep {
  id: string;
  title: string;
  detail: string;
  hint: string;
}

export interface ProcedureFlowConfig {
  id: string;
  title: string;
  clinicalContext: string;
  steps: ProcedureStep[];
}

export interface CaseOption {
  id: string;
  label: string;
  isRecommended: boolean;
  outcomeTitle: string;
  outcomeStatus: 'optimal' | 'caution' | 'contraindicated';
  rationale: string;
  biomechanicalEffect: string;
}

export interface CaseStage {
  id: string;
  prompt: string;
  options: CaseOption[];
}

export interface ClinicalCaseConfig {
  id: string;
  title: string;
  patientProfile: {
    ageSex: string;
    chiefComplaint: string;
    history: string;
    toothCondition: string;
    radiographicFinding: string;
    occlusalFactor: string;
  };
  stages: CaseStage[];
  educationalDisclaimer: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  category: string;
  metrics: {
    label: string;
    value: number;
    max: number;
    unit: string;
  }[];
  indications: string[];
  contraindications: string[];
  clinicalNote: string;
}

export interface MaterialComparisonConfig {
  id: string;
  title: string;
  subtitle: string;
  items: MaterialItem[];
}

export interface PlannerVariable {
  id: string;
  label: string;
  options: {
    id: string;
    label: string;
    scoreDelta: number;
    note: string;
  }[];
}

export interface DiagnosticPlannerConfig {
  id: string;
  title: string;
  subtitle: string;
  scenario: string;
  diagramType:
    | 'beam-deflection'
    | 'margin-taper'
    | 'pontic-ridge'
    | 'biologic-width'
    | 'impression-tray'
    | 'provisional-exotherm'
    | 'mandibular-envelope'
    | 'munsell-shade'
    | 'cementation-matrix';
  variables: PlannerVariable[];
}

export interface VisualHotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  detail: string;
}

export interface VisualCardItem {
  id: string;
  kind:
    | 'hotspot-diagram'
    | 'timeline'
    | 'comparison-table'
    | 'formula-card'
    | 'flowchart'
    | 'safety-alert'
    | 'metric-grid'
    | 'checklist';
  title: string;
  subtitle: string;
  diagramKey?: string;
  hotspots?: VisualHotspot[];
  steps?: { label: string; detail: string; metric?: string }[];
  headers?: string[];
  rows?: string[][];
  formula?: {
    expression: string;
    variables: { symbol: string; meaning: string }[];
    takeaway: string;
  };
  items?: { title: string; value: string; note?: string; status?: 'safe' | 'warn' | 'danger' }[];
}

export interface QuizOption {
  id: string;
  text: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  type: 'clinical-mcq' | 'visual-id' | 'model-3d' | 'sequence-check';
  prompt: string;
  visualHint?: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface LectureData {
  id: LectureId;
  numberLabel: string;
  shortTitle: string;
  title: string;
  lecturer: string;
  sourcePdf: string;
  summary: string;
  objectives: LearningObjective[];
  threeD: ThreeDSandboxConfig;
  procedureFlow: ProcedureFlowConfig;
  clinicalCase: ClinicalCaseConfig;
  materialComparison: MaterialComparisonConfig;
  diagnosticPlanner: DiagnosticPlannerConfig;
  visualComponents: VisualCardItem[];
  quiz: QuizQuestion[];
  referencesAndLimitations: {
    sources: string[];
    clinicalReviewFlags: string[];
  };
}
