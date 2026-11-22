import { LECTURES_PART_1 } from './lecturesPart1';
import { LECTURES_PART_2 } from './lecturesPart2';
import { LectureData, LectureId } from '../types/lecture';

import { sourcePdfUrl } from '../sourcePdfs';

export const LECTURES: LectureData[] = [...LECTURES_PART_1, ...LECTURES_PART_2].map((lecture) => ({
  ...lecture,
  sourcePdf: sourcePdfUrl(lecture.id),
}));

export function getLectureById(id: LectureId): LectureData {
  return LECTURES.find((l) => l.id === id) ?? LECTURES[0];
}
