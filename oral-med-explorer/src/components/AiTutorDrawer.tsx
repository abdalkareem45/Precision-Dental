import { Sparkles, X } from 'lucide-react';
import { useLearningStore } from '@/src/store/useLearningStore';

export const AiTutorDrawer = () => {
  const { tutorOpen, setTutorOpen } = useLearningStore();

  if (!tutorOpen) {
    return (
      <button
        type="button"
        onClick={() => setTutorOpen(true, 'Oral Medicine Overview')}
        aria-label="Open AI Clinical Tutor availability"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-2xl border border-[#C9A24B]/60 bg-[#1B3A8C] px-4 py-3 font-display text-xs font-bold text-white shadow-xl hover:bg-[#0B1F4D] dark:bg-[#14B8A6] dark:text-[#0B1220] dark:hover:bg-[#0D9488] sm:text-sm"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        <span>AI Clinical Tutor</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0B1F4D]/55 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-tutor-unavailable-title"
        aria-describedby="ai-tutor-unavailable-description"
        className="w-full max-w-md rounded-2xl border border-[#E6E8EC] bg-white p-6 text-[#0B1F4D] shadow-2xl dark:border-[#1F2937] dark:bg-[#111827] dark:text-slate-100"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-[#1B3A8C] dark:text-[#14B8A6]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              AI Clinical Tutor
            </div>
            <h2 id="ai-tutor-unavailable-title" className="text-lg font-bold">
              Not available on this static site
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setTutorOpen(false)}
            aria-label="Close AI tutor notice"
            className="rounded-lg p-2 hover:bg-[#E6E8EC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B3A8C] dark:hover:bg-[#1F2937]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p id="ai-tutor-unavailable-description" className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          The AI tutor requires a securely configured server, which is not part of this GitHub Pages deployment. The lectures, interactive labs, clinical cases, and assessments remain available.
        </p>
        <button
          type="button"
          onClick={() => setTutorOpen(false)}
          className="mt-6 rounded-lg bg-[#1B3A8C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0B1F4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A24B] dark:bg-[#14B8A6] dark:text-[#0B1220]"
        >
          Continue studying
        </button>
      </section>
    </div>
  );
};
