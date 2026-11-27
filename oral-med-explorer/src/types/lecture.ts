export type ThemeMode = 'light' | 'dark';

export type LectureSectionKey =
  | 'hero'
  | 'knowledge-map'
  | 'visual-modules'
  | 'lab-3d'
  | 'lab-2d'
  | 'clinical-cases'
  | 'histopathology'
  | 'revision'
  | 'assessment';

export type HeroAnimationType =
  | 'interview'
  | 'lymphatic'
  | 'intraoral'
  | 'laboratory'
  | 'hematology'
  | 'tmj'
  | 'neuralgia'
  | 'salivary'
  | 'mucosa'
  | 'vesiculobullous';

export interface KnowledgeNode {
  id: string;
  label: string;
  category: 'Core' | 'Anatomy' | 'Pathology' | 'Diagnostic' | 'Treatment';
  x: number;
  y: number;
  summary: string;
  keyPoints: string[];
  targetSection: LectureSectionKey;
  connections: string[];
}

export interface VisualModuleStep {
  id: string;
  label: string;
  metric?: string;
  badge?: string;
  summary: string;
  highlights: string[];
  visualTone: 'blue' | 'teal' | 'gold' | 'crimson' | 'navy';
}

export interface VisualModule {
  id: string;
  kind: 'infographic' | 'timeline' | 'flowchart' | 'progression' | 'anatomy' | 'workflow';
  title: string;
  subtitle: string;
  objectiveTag: string;
  steps: VisualModuleStep[];
}

export interface Sandbox3DStructure {
  id: string;
  name: string;
  layer: 'Surface' | 'Vascular/Neural' | 'Deep/Skeletal' | 'Pathology';
  color: string;
  description: string;
  clinicalPearl: string;
}

export interface Sandbox3DExamTool {
  id: string;
  name: string;
  instruction: string;
  finding: string;
}

export interface Sandbox3DConfig {
  id: string;
  slot: 'anatomy' | 'disease' | 'exam';
  title: string;
  subtitle: string;
  sceneKey: string;
  stageLabel: string;
  stageNames: string[];
  cameraPosition: [number, number, number];
  structures: Sandbox3DStructure[];
  examTools?: Sandbox3DExamTool[];
  disclaimer: string;
}

export interface DecisionTreeOption {
  label: string;
  nextNodeId: string;
  clinicalNote?: string;
}

export interface DecisionTreeNode {
  id: string;
  prompt: string;
  detail: string;
  isTerminal?: boolean;
  outcomeBadge?: string;
  managementSummary?: string;
  options?: DecisionTreeOption[];
}

export interface ComparisonEntity {
  id: string;
  name: string;
  badge: string;
  attributes: Record<string, string>;
}

export interface SymptomMappingInput {
  id: string;
  label: string;
  category: string;
}

export interface SymptomMappingTarget {
  id: string;
  condition: string;
  summary: string;
  matchingInputIds: string[];
  discriminator: string;
}

export interface ChallengeRound {
  id: string;
  vignette: string;
  clues: string[];
  options: Array<{
    id: string;
    label: string;
    isCorrect: boolean;
    rationale: string;
  }>;
}

export interface Sandbox2DLab {
  decisionTree: {
    title: string;
    subtitle: string;
    startNodeId: string;
    nodes: Record<string, DecisionTreeNode>;
  };
  comparisonBoard: {
    title: string;
    subtitle: string;
    dimensions: string[];
    entities: ComparisonEntity[];
  };
  symptomMapper: {
    title: string;
    subtitle: string;
    inputs: SymptomMappingInput[];
    targets: SymptomMappingTarget[];
  };
  clinicalChallenge: {
    title: string;
    subtitle: string;
    rounds: ChallengeRound[];
  };
}

export interface CaseOption {
  id: string;
  label: string;
  isCorrect: boolean;
  rationale: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  patientTag: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  learningFocus: string;
  presentation: {
    chiefComplaint: string;
    history: string[];
    vitalsAndFlags: string[];
  };
  examination: {
    extraoralAndIntraoral: string[];
    investigations: string[];
  };
  diagnosisQuestion: {
    prompt: string;
    options: CaseOption[];
  };
  treatmentQuestion: {
    prompt: string;
    options: CaseOption[];
    clinicalPearl: string;
  };
}

export interface HistopathMarker {
  id: string;
  x: number;
  y: number;
  label: string;
  detail: string;
}

export type HistoVisualPattern =
  | 'history-schema'
  | 'lymph-node'
  | 'skin-lesions'
  | 'tongue-neuro'
  | 'lab-panels'
  | 'hepatitis-serology'
  | 'blood-smear'
  | 'coagulation-cascade'
  | 'tmj-sagittal'
  | 'tmj-mri'
  | 'trigeminal-ganglion'
  | 'arteritis-biopsy'
  | 'salivary-acinus'
  | 'sialolith-occlusal'
  | 'candida-pas'
  | 'dysplasia-cis'
  | 'olp-band'
  | 'melanoma-nest'
  | 'pv-suprabasilar'
  | 'mmp-bmz';

export interface HistopathSlide {
  id: string;
  title: string;
  modality: string;
  role: 'Pathology' | 'Normal / Baseline' | 'Diagnostic Imaging';
  summary: string;
  clinicalCorrelation: string;
  pattern: HistoVisualPattern;
  markers: HistopathMarker[];
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  tag: string;
}

export interface MnemonicItem {
  id: string;
  acronym: string;
  title: string;
  breakdown: Array<{ letter: string; meaning: string }>;
}

export type AssessmentType =
  | 'labeling'
  | 'identification'
  | 'matching'
  | 'ordering'
  | 'reasoning';

export interface AssessmentItem {
  id: string;
  type: AssessmentType;
  prompt: string;
  context?: string;
  // For labeling / identification / reasoning:
  options?: Array<{ id: string; label: string }>;
  correctOptionId?: string;
  // For matching:
  pairs?: Array<{ id: string; left: string; right: string }>;
  // For ordering:
  sequenceSteps?: Array<{ id: string; label: string }>;
  correctOrderIds?: string[];
  explanation: string;
  visualCue?: string;
}

export interface LectureData {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  specialty: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  heroImage: string;
  heroAnimation: HeroAnimationType;
  sourceAttribution: string;
  clinicalNotice: string;
  searchKeywords: string[];
  learningObjectives: string[];
  knowledgeMap: KnowledgeNode[];
  visualModules: VisualModule[];
  sandboxes3D: Sandbox3DConfig[];
  sandboxes2D: Sandbox2DLab;
  clinicalCases: ClinicalCase[];
  histopathSlides: HistopathSlide[];
  revision: {
    flashcards: FlashcardItem[];
    mnemonics: MnemonicItem[];
    highYieldPearls: string[];
    summaryChecklist: string[];
  };
  assessments: AssessmentItem[];
  tutorSeedContext: string;
}
