import type { LectureId } from './types/lecture';

export const SOURCE_PDF_FILES: Record<LectureId, string> = {
  "lec-04": "Lect_4_12e19f3e.pdf",
  "lec-05": "Lect_5_4a645c29.pdf",
  "lec-06": "Lect_6_pontic_7e6e6710.pdf",
  "lec-07a": "Lecture_7__Tissue_Management__-_manhal.abdulrahman_a3308e24.pdf",
  "lec-07b": "Lecture_7__Impression_2024__7eee9057.pdf",
  "lec-10a": "Provisional__temporary__Restorations_46a0b2eb.pdf",
  "lec-10b": "Bite_Registration_a32164be.pdf",
  "lec-11": "Shade_Selection_f0f9cf15.pdf",
  "lec-12": "Try-in___Cementation__09efe577.pdf"
};

export function sourcePdfUrl(id: LectureId, baseUrl = import.meta.env.BASE_URL): string {
  return baseUrl.replace(/\/?$/, '/') + 'assets/crown-virtual-lab/' + encodeURIComponent(SOURCE_PDF_FILES[id]);
}
