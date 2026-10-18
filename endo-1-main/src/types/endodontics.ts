export type ViewMode = 'orbit' | 'walkthrough' | 'cross-section' | 'exploded';
export type VisualTheme = 'blueprint' | 'anatomical' | 'radiograph' | 'hologram';

export interface AnatomicalLayer {
  id: string;
  name: string;
  category: 'hard-tissue' | 'soft-tissue' | 'neural' | 'periodontium' | 'pathology' | 'treatment';
  visible: boolean;
  opacity: number;
  color: string;
  description: string;
  notes: string;
}

export type ClinicalTestType =
  | 'palpation'
  | 'percussion_vertical'
  | 'percussion_horizontal'
  | 'mobility'
  | 'cold'
  | 'heat'
  | 'ept'
  | 'cavity'
  | 'selective_anesthesia'
  | 'bite_test'
  | 'transillumination'
  | 'sinus_tracing';

export interface ClinicalTestInfo {
  id: ClinicalTestType;
  name: string;
  iconName: string;
  targetArea: string;
  toolUsed: string;
  objective: string;
  technique: string[];
  physiologicalMechanism: string;
  normalResponse: string;
  abnormalResponses: {
    condition: string;
    response: string;
    clinicalSignificance: string;
  }[];
  lecturePage: number;
  figureRef?: string;
  precautions?: string[];
}

export interface PainDiagnosisRow {
  parameter: 'Location' | 'Duration' | 'Nature' | 'Stimulus';
  typeOfPain: string;
  reasonForPain: string;
  provisionalDiagnosis: string;
  nerveInvolved: string;
}

export interface ExtendedPainDiagnosisRow extends PainDiagnosisRow {
  id: string;
  patientQuote: string;
  mechanismDetail: string;
  recommendedTests: string[];
  treatmentPathway: string;
  animationType:
    | 'cold_fluid'
    | 'heat_expansion'
    | 'pdl_pressure'
    | 'crack_flexion'
    | 'diffuse_pulp'
    | 'night_cephalic'
    | 'osmotic_sour';
  mnemonicTip?: string;
  clinicalTip?: string;
  keyRule?: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  patientProfile: {
    age: number;
    gender: string;
    chiefComplaint: string;
    historyOfPresentIllness: string;
    medicalHistory: string[];
  };
  toothTarget: string;
  actualDiagnosis: string;
  correctDifferential: string[];
  explanation: string;
  lectureReference: string;
  imageHint?: string;
  defaultLayersState?: Partial<Record<string, boolean>>;
  initialSymptomData: {
    painQuality: string;
    painLocation: string;
    painDuration: string;
    onset: string;
    initiatingFactors: string;
    relievingFactors: string;
  };
  testResponses: Record<
    ClinicalTestType,
    {
      result: string;
      patientFeedback: string;
      clinicalNote: string;
      isPositive: boolean;
    }
  >;
}
