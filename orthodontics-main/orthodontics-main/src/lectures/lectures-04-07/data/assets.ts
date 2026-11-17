import type { LectureId } from '../types/lecture';

const assetBase = import.meta.env.BASE_URL + 'assets/orthodontics-04-07/';

export const LECTURE_ASSETS = {
  pdfs: {
    'lecture-4': assetBase + 'Ortho.4._new_b8f99839.pdf',
    'lecture-5': assetBase + 'Ortho.5._neew_d0193574.pdf',
    'lecture-6': assetBase + 'Ortho.6._new_c554aea8.pdf',
    'lecture-7': assetBase + 'Ortho.7._new_c29a5c2c.pdf',
  } satisfies Record<LectureId, string>,
  brandImage: assetBase + 'ElevenLabs_image_gpt-image-2-5-sunburst_A_brand_guideli_2026-10-13T17_08_46_a60636c3.png',
};
