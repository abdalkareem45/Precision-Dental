export type LectureId =
  | 'lec1' // Examination of the Mouth
  | 'lec2' // Intraoral Exam & Treatment Priorities
  | 'lec3' // Management of Children Behaviors
  | 'lec7' // Dental Trauma 2: Exam, Craze & Fragment Restoration
  | 'lec8' // Dental Trauma 3: Vital Pulp & Immature Teeth (REPs/Apexification)
  | 'lec9' // Dental Trauma 4: Reaction of Tooth to Trauma & Ellis Davey
  | 'lec10' // Dental Trauma 5: Luxation & Avulsion Management
  | 'lec11' // Dental Trauma 6: Root Fractures & Oral Burns
  | 'systemic' // Lec 3, 4, 5 (A.M.): Children with Systemic Diseases
  | 'quiz'; // Interactive Grand Rounds & Clinical Cases

export interface LectureTab {
  id: LectureId;
  title: string;
  arabicTitle: string;
  badge: string;
  iconName: string;
  summary: string;
}

export type ToothPathology =
  | 'normal'
  | 'craze'
  | 'fracture_enamel_dentin'
  | 'fracture_pulp_exposure'
  | 'hyperemia'
  | 'internal_hemorrhage'
  | 'calcific_metamorphosis'
  | 'internal_resorption'
  | 'external_resorption'
  | 'pulpal_necrosis'
  | 'dilaceration'
  | 'cervical_root_fracture'
  | 'middle_root_fracture'
  | 'apical_root_fracture'
  | 'intrusion'
  | 'extrusion'
  | 'lateral_luxation'
  | 'avulsion';

export type RepairStep =
  | 'inspect'
  | 'prep_base'
  | 'etch'
  | 'apply_composite'
  | 'seat_fragment'
  | 'light_cure'
  | 'finished';

export type RepStep =
  | 'initial'
  | 'disinfection'
  | 'bleeding_induction'
  | 'scaffold_formed'
  | 'mta_barrier'
  | 'root_thickening';

export interface QuizCase {
  id: string;
  title: string;
  patientAge: string;
  presentation: string;
  radiographNote?: string;
  medicalHistory?: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}
