export type DiseaseId = 'cmv' | 'coxsackie' | 'nug' | 'em' | 'sjs-ten' | 'pcs' | 'hsv' | 'vzv';

export type MainNavTab = 
  | 'overview' 
  | 'lecture-1'
  | 'disease-module' 
  | 'sandbox-oral-3d' 
  | 'sandbox-diagnostic' 
  | 'sandbox-treatment' 
  | 'sandbox-histo' 
  | 'sandbox-microbio' 
  | 'study-cards' 
  | 'study-quiz' 
  | 'study-feynman'
  | 'study-matrix';

export interface HotspotLocation {
  id: string;
  name: string;
  position: [number, number, number];
  diseaseId: DiseaseId;
  description: string;
}

export interface DiseaseInfo {
  id: DiseaseId;
  title: string;
  shortTitle: string;
  category: 'Viral Infections' | 'Periodontal Ulcerations' | 'Hypersensitivity Reactions';
  etiology: string;
  pathogenesis: string;
  oralManifestations: string[];
  systemicFindings: string[];
  keyDiagnostics: string[];
  management: string[];
  clinicalPearl: string;
  slidesReferenced: number[];
  color: string;
  badgeId: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  patientProfile: {
    age: number;
    gender: 'Male' | 'Female';
    immuneStatus: 'Immunocompetent' | 'AIDS (CD4 <200)' | 'Renal Transplant Recipient' | 'Child' | 'Healthy Adult';
    chiefComplaint: string;
    medicalHistory: string;
    vitalSigns: string;
  };
  oralExam: string;
  cutaneousExam?: string;
  testOptions: {
    id: string;
    name: string;
    category: 'Microbiology' | 'Pathology' | 'Serology' | 'PCR';
    costTime: string;
    result: string;
  }[];
  differentialOptions: DiseaseId[];
  correctDiagnosis: DiseaseId;
  explanation: string;
  treatmentChallenge: {
    question: string;
    options: {
      text: string;
      isCorrect: boolean;
      rationale: string;
    }[];
  };
}

export interface Flashcard {
  id: string;
  diseaseId: DiseaseId;
  front: string;
  back: string;
  category: 'Etiology' | 'Pathogenesis' | 'Oral Findings' | 'Diagnostics' | 'Pharmacology';
  pearl: string;
}

export interface QuizQuestion {
  id: string;
  diseaseId: DiseaseId | 'comprehensive';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  slideRef?: number;
}

export interface UserProgress {
  completedModules: Record<DiseaseId, boolean>;
  quizScores: Record<string, number>;
  unlockedBadges: string[];
  flashcardMastery: Record<string, 'new' | 'learning' | 'mastered'>;
  casesCompleted: string[];
  studyTimeSeconds: number;
}
