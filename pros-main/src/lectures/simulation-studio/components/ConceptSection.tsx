import { ArrowRight } from 'lucide-react';
import { LectureModule, SceneId } from '../types/prosthodontics';

interface ConceptSectionProps {
  lecture: LectureModule;
  onSelectScene: (scene: SceneId) => void;
}

export function ConceptSection({ lecture, onSelectScene }: ConceptSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
            Scene 02 · Visual Concept Exploration
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] mt-1">
            Core Clinical Principles — Lecture {lecture.number}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onSelectScene('scene-3')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D] hover:bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:hover:bg-[#E0BC64] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Open 3D & 2D Lab</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lecture.concepts.map((concept, idx) => (
          <article
            key={concept.id}
            className="min-w-0 bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-6 flex flex-col justify-between space-y-5 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#0B1F4D]/65 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/70">
                <span className="font-mono font-semibold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                  0{idx + 1}
                </span>
                <span>{concept.visualTag}</span>
              </div>
              <h3 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
                {concept.title}
              </h3>
              <p className="text-sm text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85 leading-relaxed">
                {concept.summary}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40">
              <div className="grid grid-cols-2 gap-3">
                {concept.parameters.map((param) => (
                  <div
                    key={param.label}
                    className="min-w-0 bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] rounded-lg p-2.5 border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40"
                  >
                    <div className="text-[11px] text-[#0B1F4D]/65 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/70">
                      {param.label}
                    </div>
                    <div className="break-words text-xs font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] font-mono tabular-nums mt-0.5">
                      {param.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-[#0B1F4D]/85 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85 leading-relaxed">
                <span className="font-semibold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                  Clinical Key:{' '}
                </span>
                {concept.clinicalTakeaway}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
