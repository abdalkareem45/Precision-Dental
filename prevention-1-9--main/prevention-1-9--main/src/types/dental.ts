export interface LectureMeta {
  id: number;
  title: string;
  arabicTitle: string;
  subtitle: string;
  professor: string;
  readTime: string;
  summary: string;
  keyTopics: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ClinicalPearl {
  title: string;
  description: string;
  significance: 'crucial' | 'warning' | 'tip';
}
