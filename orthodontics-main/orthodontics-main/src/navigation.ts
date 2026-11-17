import type { LectureTab } from './types/ortho';

export const additionalLectures = [
  { id: 'lecture-4', number: 4, title: 'Temporomandibular Disorders (TMDs)' },
  { id: 'lecture-5', number: 5, title: 'Lateral Cephalometrics' },
  { id: 'lecture-6', number: 6, title: 'Orthopantomogram (OPG)' },
  { id: 'lecture-7', number: 7, title: 'Orthodontic Study Models & Analyses' },
] as const;

export const tabHashes: Record<LectureTab, string> = {
  overview: '#',
  lecture1_2: '#lecture-1',
  lecture3: '#lecture-3',
  'lecture-4': '#lecture-4',
  'lecture-5': '#lecture-5',
  'lecture-6': '#lecture-6',
  'lecture-7': '#lecture-7',
  '3d_lab': '#3d-lab',
  cases: '#cases',
  quiz: '#quiz',
};

export function tabFromHash(hash: string): LectureTab {
  if (hash === '#lecture-2' || hash === '#lecture1_2') return 'lecture1_2';
  if (hash === '#lecture3') return 'lecture3';
  return (Object.keys(tabHashes) as LectureTab[]).find(tab => tabHashes[tab] === hash) ?? 'overview';
}

export function isAdditionalLecture(tab: LectureTab): tab is typeof additionalLectures[number]['id'] {
  return additionalLectures.some(lecture => lecture.id === tab);
}
