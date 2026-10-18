/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LectureTab = 
  | 'overview' 
  | 'lecture1_2' 
  | 'lecture3' 
  | '3d_lab' 
  | 'cases' 
  | 'quiz';

export type BodyBuild = 'ectomorphic' | 'mesomorphic' | 'endomorphic';

export type SkeletalClass = 'class_i' | 'class_ii' | 'class_iii';

export type LipCompetence = 'competent' | 'potentially_competent' | 'incompetent';

export type TongueThrustType = 'none' | 'adaptive' | 'endogenous';

export type AngleClass = 'normal' | 'class_i' | 'class_ii' | 'class_iii';

export type BsiIncisorClass = 'class_i' | 'class_ii_div1' | 'class_ii_div2' | 'class_iii';

export type OcclusionExcursion = 'centric' | 'protrusive' | 'lateral_left' | 'lateral_right';

export interface PatientCase {
  id: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female';
  occupation: string;
  chiefComplaint: string;
  medicalHistory: string;
  dentalHistory: string;
  habits: string;
  growthStatus: string;
  extraoralFindings: {
    facialConvexity: string;
    ruleOfThirds: string;
    mandibularPlane: string;
    transverseSymmetry: string;
    smileArc: string;
    lipCompetence: LipCompetence;
    nasolabialAngle: number; // degrees
  };
  intraoralFindings: {
    molarClass: string;
    canineClass: string;
    overjet: number; // mm
    overbite: string;
    crowdingSpacing: string;
    curveOfSpee: string;
  };
  correctDiagnosis: {
    molarClass: AngleClass;
    incisorClass: BsiIncisorClass;
    skeletalClass: SkeletalClass;
    keyIssues: string[];
    consentConsiderations: string;
  };
}

export interface QuizQuestion {
  id: number;
  lecture: 'Lecture 1 & 2' | 'Lecture 3' | 'Clinical Application';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  referencePage: string;
}
