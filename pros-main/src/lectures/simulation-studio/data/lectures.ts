import { AchievementBadge, LectureId, LectureModule, ProgressMap } from '../types/prosthodontics';
import { LECTURES_PART_1 } from './lecturesPart1';
import { LECTURES_PART_2 } from './lecturesPart2';

export const LECTURES: LectureModule[] = [...LECTURES_PART_1, ...LECTURES_PART_2];

export const LECTURE_IDS: LectureId[] = LECTURES.map((l) => l.id);

export function getLectureById(id: LectureId): LectureModule {
  return LECTURES.find((l) => l.id === id) ?? LECTURES[0];
}

export function createInitialProgress(): ProgressMap {
  const map = {} as ProgressMap;
  for (const lec of LECTURES) {
    map[lec.id] = {
      visitedScenes: [],
      completedSandboxes: [],
      solvedCases: [],
      quizBestScore: null,
      quizAttempts: 0,
    };
  }
  return map;
}

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-pps-architect',
    title: 'Palatal Seal Architect',
    criteria: 'Complete all 4 interactive 2D sandboxes in Lecture 4 (Posterior Palatal Seal).',
    isUnlocked: (p) => ['2d-anatomy', '2d-builder', '2d-workflow', '2d-diagnostic'].every((id) => p['lecture-4']?.completedSandboxes.includes(id)),
  },
  {
    id: 'badge-complication-diagnostician',
    title: 'Denture Complication Diagnostician',
    criteria: 'Score 75% or higher on both Lecture 5 and Lecture 6 assessments.',
    isUnlocked: (p) =>
      (p['lecture-5']?.quizBestScore ?? 0) >= 75 && (p['lecture-6']?.quizBestScore ?? 0) >= 75,
  },
  {
    id: 'badge-immediate-strategist',
    title: 'Immediate Denture Strategist',
    criteria: 'Solve all 3 tiered clinical cases in Lecture 7 and Lecture 8.',
    isUnlocked: (p) =>
      (p['lecture-7']?.solvedCases.length ?? 0) >= 3 && (p['lecture-8']?.solvedCases.length ?? 0) >= 3,
  },
  {
    id: 'badge-maxillofacial-fellow',
    title: 'Maxillofacial Team Fellow',
    criteria: 'Score 75% or higher on Lecture 9 and Lecture 10 assessments.',
    isUnlocked: (p) =>
      (p['lecture-9']?.quizBestScore ?? 0) >= 75 && (p['lecture-10']?.quizBestScore ?? 0) >= 75,
  },
  {
    id: 'badge-simulation-explorer',
    title: '3D Simulation Explorer',
    criteria: 'Explore the 3D Sandbox across at least 4 PDF lectures (Lectures 4–10).',
    isUnlocked: (p) =>
      LECTURE_IDS.filter((id) => p[id]?.completedSandboxes.includes('sandbox-3d')).length >= 4,
  },
];
