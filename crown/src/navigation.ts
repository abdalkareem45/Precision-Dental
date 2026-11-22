import { VIRTUAL_LAB_LECTURES, type LectureId } from './lectures/virtual-lab/registry';

export const FOUNDATION_LECTURES = [
  { id: 'lec1', title: 'Crown & Bridge Fundamentals', numberLabel: 'Lecture 1', summary: 'Crowns, bridges, terminology, and consequences of tooth loss.' },
  { id: 'lec2', title: 'Evaluation of Abutment Teeth', numberLabel: 'Lecture 2', summary: 'Crown form, root configuration, axial tilt, and root surface areas.' },
  { id: 'lec3', title: "Periodontal Support & Ante’s Law", numberLabel: 'Lecture 3', summary: 'Periodontal support, PDL stress, Ante’s Law, and clinical cases.' },
] as const;

export const CROWN_LECTURES = [...FOUNDATION_LECTURES, ...VIRTUAL_LAB_LECTURES];
export type FoundationId = typeof FOUNDATION_LECTURES[number]['id'];
export type CrownLectureId = FoundationId | LectureId;
export type CrownPage = CrownLectureId | 'overview';

export function lectureHash(id: CrownPage): string {
  return id === 'overview' ? '#' : `#lecture-${id.replace(/^lec-?0?/, '')}`;
}

export function pageFromHash(hash: string): CrownPage {
  const normalized = hash.toLowerCase();
  return CROWN_LECTURES.find(lecture =>
    lectureHash(lecture.id) === normalized
    || `#${lecture.id}` === normalized
    || `#lecture-${lecture.id.replace(/^lec-?/, '')}` === normalized
  )?.id ?? 'overview';
}

export function isFoundation(id: CrownPage): id is FoundationId {
  return FOUNDATION_LECTURES.some(lecture => lecture.id === id);
}

export function isVirtualLab(id: CrownPage): id is LectureId {
  return VIRTUAL_LAB_LECTURES.some(lecture => lecture.id === id);
}
