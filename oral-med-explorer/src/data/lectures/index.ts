import { lecture01 } from './lecture01';
import { lecture02 } from './lecture02';
import { lecture03 } from './lecture03';
import { lecture04 } from './lecture04';
import { lecture05 } from './lecture05';
import { lecture06 } from './lecture06';
import { lecture07 } from './lecture07';
import { lecture08 } from './lecture08';
import { lecture09 } from './lecture09';
import { lecture10 } from './lecture10';
import type { LectureData } from '@/src/types/lecture';

export const LECTURES: LectureData[] = [
  lecture01,
  lecture02,
  lecture03,
  lecture04,
  lecture05,
  lecture06,
  lecture07,
  lecture08,
  lecture09,
  lecture10,
];

export function getLectureById(id: string | null | undefined): LectureData | undefined {
  if (!id) return undefined;
  return LECTURES.find((l) => l.id === id);
}
