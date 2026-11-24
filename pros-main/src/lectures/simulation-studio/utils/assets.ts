import type { LectureId } from '../types/prosthodontics';

/** Filenames are the original source uploads, not duplicated AI Studio logs. */
export const SOURCE_PDFS: Record<LectureId, string> = {
  'lecture-4': 'pros_4_website_2fa347ec.pdf',
  'lecture-5': 'pros_5_website_7589ac99.pdf',
  'lecture-6': 'pros_6_website_5f6a27ef.pdf',
  'lecture-7': 'pros_7_and_8_website_43ed1976.pdf',
  'lecture-8': 'pros_7_and_8_website_43ed1976.pdf',
  'lecture-9': 'pros_9_and_10_website_a6e40e0e.pdf',
  'lecture-10': 'pros_9_and_10_website_a6e40e0e.pdf',
};

export function studioAssetUrl(filename: string, base = import.meta.env?.BASE_URL ?? '/'): string {
  return `${base.endsWith('/') ? base : base + '/'}assets/prostho-studio/${encodeURIComponent(filename)}`;
}
export function sourcePdfUrl(lectureId: LectureId, base?: string): string {
  return studioAssetUrl(SOURCE_PDFS[lectureId], base);
}
