export type BoneLossTab =
  | 'lecture'
  | 'crossSection'
  | 'threeD'
  | 'defects'
  | 'comparisons'
  | 'morphology'
  | 'furcation'
  | 'ai'
  | 'quiz'
  | 'rapidReview';

export type BoneDefect3DType =
  | 'normal'
  | 'horizontal'
  | 'vertical'
  | 'three_wall'
  | 'two_wall'
  | 'one_wall'
  | 'combined'
  | 'circumferential'
  | 'crater'
  | 'crater_shallow'
  | 'crater_medium'
  | 'crater_deep'
  | 'furcation_grade1'
  | 'furcation_grade2'
  | 'furcation_grade3'
  | 'furcation_grade4'
  | 'pathways_interproximal'
  | 'pathways_facial'
  | 'cellular_mechanism'
  | 'occlusal_trauma'
  | 'occlusal_trauma_plaque'
  | 'thin_plate'
  | 'thick_plate'
  | 'exostoses'
  | 'buttressing_central'
  | 'buttressing_peripheral'
  | 'bulbous'
  | 'reversed_arch'
  | 'ledges'
  | 'cbct_implant';

export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'clinical' | 'numerical' | 'classification';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pdfPage: number;
  category: 'Fundamentals' | 'Histology' | 'Rate & Distance' | 'Morphology & Craters' | 'Furcation' | 'AI in Perio';
}

export interface StudentProgress {
  completedSections: Record<string, boolean>;
  quizScore: number | null;
  quizAnswers: Record<number, number>;
  totalQuestions: number;
}
