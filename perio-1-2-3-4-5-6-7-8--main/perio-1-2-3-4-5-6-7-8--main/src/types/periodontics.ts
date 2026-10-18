export type PeriodontalStage = 'I' | 'II' | 'III' | 'IV';
export type PeriodontalGrade = 'A' | 'B' | 'C';
export type DiseaseExtent = 'localized' | 'generalized' | 'molar-incisor';

export interface ProbingSite {
  id: string;
  name: 'Distobuccal' | 'Mid-buccal' | 'Mesiobuccal' | 'Distolingual' | 'Mid-lingual' | 'Mesiolingual';
  pocketDepth: number; // in mm
  attachmentLoss: number; // in mm
  bleeding: boolean;
  suppuration: boolean;
  plaque: boolean;
}

export interface ToothData {
  toothNumber: number; // Universal 1-32 or FDI 11-48
  fdiNumber: number;
  name: string;
  mobility: 0 | 1 | 2 | 3; // Miller index
  furcation?: 'None' | 'Grade I' | 'Grade II' | 'Grade III' | 'Grade IV'; // Glickman
  sites: ProbingSite[];
  isMissing?: boolean;
}

export interface StagingCriteria {
  interdentalCalMax: number; // in mm (1-2, 3-4, >=5)
  radiographicBoneLossPercent: number; // 0-100%
  rblLocation: 'coronal_third_less_15' | 'coronal_third_15_33' | 'middle_third' | 'apical_third';
  teethLostDueToPeriodontitis: number; // 0, 1-4, >=5
  probingDepthMax: number; // in mm
  boneLossPattern: 'mostly_horizontal' | 'vertical_loss_ge_3mm';
  furcationInvolvement: 'none' | 'grade_1' | 'grade_2_3';
  ridgeDefect: 'none' | 'moderate' | 'severe';
  biteCollapseDriftingFlaring: boolean;
  secondaryOcclusalTrauma: boolean;
  masticatoryDysfunction: boolean;
  remainingTeethCount: number;
  extentType: DiseaseExtent;
  affectedSitesPercent: number; // e.g. 25% or 45%
}

export interface GradingCriteria {
  patientAge: number;
  radiographicBoneLossPercent: number; // for RBL / age calculation
  longitudinalLossPast5Years?: '<2mm' | '>=2mm' | 'none';
  casePhenotype: 'heavy_biofilm_low_destruction' | 'destruction_commensurate' | 'destruction_exceeds_biofilm';
  smokingStatus: 'non_smoker' | 'under_10_cigs' | 'ge_10_cigs';
  diabetesStatus: 'non_diabetic' | 'hba1c_under_7' | 'hba1c_ge_7';
  hsCrpLevel?: '<1mgL' | '1_3mgL' | '>3mgL';
}

export interface StageIVPhenotype {
  caseType: 1 | 2 | 3 | 4;
  title: string;
  shortDescription: string;
  primaryFeatures: string[];
  periodontalTherapySequence: string[];
  rehabilitationSequence: string[];
  criticalRules: string[];
  carranzaReference: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  citation: string;
  topic: 'Anatomy & Probing' | 'Diagnosis & Classification' | 'Staging & Grading' | 'Treatment Steps' | 'Stage IV Phenotypes' | 'Prognosis';
  difficulty: 'Board Essential' | 'Advanced Clinical' | 'Viva Voce';
}

export interface ClinicalCase {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  medicalHistory: string;
  smoking: string;
  dentalHistory: string;
  clinicalFindings: {
    bopScore: number;
    plaqueIndex: number;
    maxCAL: number;
    maxPD: number;
    furcation: string;
    mobility: string;
    missingTeethDueToPerio: number;
    remainingTeeth: number;
    occlusalFeatures: string;
    radiographicFindings: string;
  };
  correctDiagnosis: {
    disease: string;
    stage: PeriodontalStage;
    grade: PeriodontalGrade;
    extent: DiseaseExtent;
    stageIVType?: number;
    prognosis: string;
  };
  treatmentPlanSummary: string[];
  learningTakeaways: string[];
}

export interface StudyReminder {
  id: string;
  title: string;
  topic: string;
  scheduledDate: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface IraqiCompetency {
  id: string;
  title: string;
  category: string;
  requiredCount: number;
  completedCount: number;
  description: string;
  verified: boolean;
}
