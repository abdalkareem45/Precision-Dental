export { default, default as SimulationStudio } from './App';
export type { SimulationStudioProps } from './App';
export type { LectureId, LectureModule, SceneId, ProgressMap } from './types/prosthodontics';
export { LECTURES, LECTURE_IDS, getLectureById, createInitialProgress, ACHIEVEMENT_BADGES } from './data/lectures';
export { SOURCE_PDFS, sourcePdfUrl, studioAssetUrl } from './utils/assets';

import { LECTURES } from './data/lectures';
import { sourcePdfUrl } from './utils/assets';

/** Lightweight host navigation metadata; retain the host's existing lectures 1–3. */
export const LECTURE_METADATA = LECTURES.map((lecture) => ({
  id: lecture.id,
  number: lecture.number,
  title: lecture.title,
  shortTitle: lecture.shortTitle,
  summary: lecture.hero.subheadline,
  sourcePdf: sourcePdfUrl(lecture.id),
}));
