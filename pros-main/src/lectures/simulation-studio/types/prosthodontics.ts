export type LectureId =
  | 'lecture-4'
  | 'lecture-5'
  | 'lecture-6'
  | 'lecture-7'
  | 'lecture-8'
  | 'lecture-9'
  | 'lecture-10';

export type SceneId =
  | 'scene-1'
  | 'scene-2'
  | 'scene-3'
  | 'scene-4'
  | 'scene-5'
  | 'scene-6';

export type SourceStatus = 'pdf-verified';

export interface LearningJourneyMap {
  objectives: string[];
  competencies: string[];
  keyConcepts: string[];
  expectedOutcomes: string[];
  prerequisites: string[];
}

export interface StoryboardSectionItem {
  id: string;
  topicName: string;
  learningGoal: string;
  visualRepresentation: string;
  interactionType: string;
  assessmentMethod: string;
}

export interface StoryboardDeliverables {
  learningFlowSteps: { step: string; detail: string }[];
  interactiveContentMap: { topic: string; module: string; targetScene: string }[];
  visualAssetPlan: {
    models3D: string[];
    anatomicalIllustrations: string[];
    clinicalDiagrams: string[];
    animations: string[];
  };
  sandbox3DSpec: {
    title: string;
    primaryObjective: string;
    manipulableLayers: string[];
    simulationVariable: string;
  };
  sandboxes2DSpec: {
    id: string;
    title: string;
    linkedObjective: string;
    mechanism: string;
  }[];
  clinicalSimulationPlan: string;
  assessmentStrategy: string;
  uiScreenMap: string[];
  technicalSpec: string;
}

export interface HeroVisualData {
  eyebrow: string;
  headline: string;
  subheadline: string;
  keyMetrics: { label: string; value: string; unit?: string }[];
  animatedLayers: { id: string; label: string; detail: string }[];
}

export interface ConceptNode {
  id: string;
  title: string;
  visualTag: string;
  summary: string;
  clinicalTakeaway: string;
  parameters: { label: string; value: string }[];
}

export interface Hotspot3D {
  id: string;
  label: string;
  role: string;
  position: [number, number, number];
  detail: string;
}

export interface Sandbox3DConfig {
  title: string;
  subtitle: string;
  modelType: LectureId;
  parameterLabel: string;
  parameterUnit: string;
  parameterMin: number;
  parameterMax: number;
  parameterStep: number;
  parameterDefault: number;
  variantOptions: { id: string; label: string; description: string }[];
  layers: { id: string; label: string }[];
  hotspots: Hotspot3D[];
}

export interface AnatomyHotspot2D {
  id: string;
  label: string;
  category: 'primary' | 'secondary' | 'relief' | 'defect';
  x: number;
  y: number;
  clinicalNote: string;
  metric?: string;
}

export interface AnatomyExplorerConfig {
  title: string;
  instruction: string;
  diagramType:
    | 'palatal-seal'
    | 'resorption-ridge'
    | 'denture-fracture'
    | 'flange-cross-section'
    | 'cast-trimming'
    | 'aramany-arch'
    | 'obturator-zones';
  hotspots: AnatomyHotspot2D[];
}

export interface DesignOption {
  id: string;
  label: string;
  spec: string;
  indication: string;
  tradeoff: string;
  ratingLabel: string;
  isRecommendedForPrompt?: boolean;
}

export interface DesignBuilderConfig {
  title: string;
  scenarioPrompt: string;
  options: DesignOption[];
  feedbackPass: string;
  feedbackRetry: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  detail: string;
  criticalRule: string;
}

export interface WorkflowSequencerConfig {
  title: string;
  instruction: string;
  correctOrder: WorkflowStep[];
}

export interface DiagnosticCaseItem {
  id: string;
  finding: string;
  clue: string;
  etiologies: string[];
  correctDiagnosis: string;
  management: string;
  distractorDiagnoses: string[];
}

export interface DiagnosticMatrixConfig {
  title: string;
  instruction: string;
  items: DiagnosticCaseItem[];
}

export interface ClinicalCaseOption {
  id: string;
  text: string;
  isOptimal: boolean;
  rationale: string;
}

export interface ClinicalCase {
  id: string;
  tier: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  patientProfile: string;
  clinicalFindings: string[];
  question: string;
  options: ClinicalCaseOption[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface LectureModule {
  id: LectureId;
  number: number;
  shortTitle: string;
  title: string;
  lecturer: string;
  sourceLabel: string;
  sourceStatus: SourceStatus;
  estimatedMinutes: number;
  hero: HeroVisualData;
  journeyMap: LearningJourneyMap;
  storyboardSections: StoryboardSectionItem[];
  deliverables: StoryboardDeliverables;
  concepts: ConceptNode[];
  sandbox3D: Sandbox3DConfig;
  sandbox2DAnatomy: AnatomyExplorerConfig;
  sandbox2DBuilder: DesignBuilderConfig;
  sandbox2DWorkflow: WorkflowSequencerConfig;
  sandbox2DDiagnostic: DiagnosticMatrixConfig;
  clinicalCases: ClinicalCase[];
  quiz: QuizQuestion[];
  referencesAndLimitations: string[];
}

export interface LectureProgress {
  visitedScenes: SceneId[];
  completedSandboxes: string[];
  solvedCases: string[];
  quizBestScore: number | null;
  quizAttempts: number;
}

export type ProgressMap = Record<LectureId, LectureProgress>;

export interface AchievementBadge {
  id: string;
  title: string;
  criteria: string;
  isUnlocked: (progress: ProgressMap) => boolean;
}
