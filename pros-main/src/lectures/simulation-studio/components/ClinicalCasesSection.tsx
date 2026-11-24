import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ClinicalCase, LectureModule } from '../types/prosthodontics';

interface ClinicalCasesSectionProps {
  lecture: LectureModule;
  solvedCases: string[];
  onSolveCase: (caseId: string) => void;
}

export function ClinicalCasesSection({
  lecture,
  solvedCases,
  onSolveCase,
}: ClinicalCasesSectionProps) {
  const [activeTier, setActiveTier] = useState<ClinicalCase['tier']>('Beginner');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    setActiveTier('Beginner');
    setSelectedOptions({});
  }, [lecture.id]);

  const activeCase =
    lecture.clinicalCases.find((c) => c.tier === activeTier) ?? lecture.clinicalCases[0];

  const pickedOptionId = activeCase ? selectedOptions[activeCase.id] : undefined;
  const pickedOption = activeCase?.options.find((o) => o.id === pickedOptionId);

  const handleChoose = (caseItem: ClinicalCase, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [caseItem.id]: optionId }));
    const chosen = caseItem.options.find((o) => o.id === optionId);
    if (chosen?.isOptimal) {
      onSolveCase(caseItem.id);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
            Scene 04 · Applied Clinical Decision Making
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] mt-1">
            Tiered Clinical Cases — Lecture {lecture.number}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-lg">
          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((tier) => {
            const c = lecture.clinicalCases.find((item) => item.tier === tier);
            const isSolved = c ? solvedCases.includes(c.id) : false;
            const isCurrent = activeTier === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setActiveTier(tier)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D]'
                    : 'text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80 hover:bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:hover:bg-[#1B3A8C]/35'
                }`}
              >
                <span>{tier}</span>
                {isSolved && (
                  <span
                    className={`ml-1.5 text-[10px] ${
                      isCurrent
                        ? 'text-[#C9A24B] in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D]'
                        : 'text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]'
                    }`}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeCase && (
        <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                {activeCase.tier} Case · Educational Decision Simulation
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
                {activeCase.title}
              </h3>
              <p className="text-sm text-[#0B1F4D]/85 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85">
                {activeCase.patientProfile}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSelectedOptions((prev) => {
                  const copy = { ...prev };
                  delete copy[activeCase.id];
                  return copy;
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B] shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Case</span>
            </button>
          </div>

          <div className="bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 rounded-lg p-4 space-y-2">
            <div className="text-xs font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
              Clinical Findings
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#0B1F4D]/85 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85">
              {activeCase.clinicalFindings.map((finding) => (
                <li key={finding} className="flex items-start gap-2">
                  <span className="text-[#C9A24B] font-bold" aria-hidden="true">
                    •
                  </span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
              {activeCase.question}
            </div>
            <div className="space-y-2.5">
              {activeCase.options.map((opt) => {
                const isSelected = pickedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleChoose(activeCase, opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A24B] ${
                      isSelected
                        ? opt.isOptimal
                          ? 'bg-[#1B3A8C]/10 in-[.prostho-studio[data-theme=dark]]:bg-[#1B3A8C]/50 border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]'
                          : 'bg-[#9B2C3B]/10 in-[.prostho-studio[data-theme=dark]]:bg-[#9B2C3B]/30 border-[#9B2C3B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]'
                        : 'bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B]'
                    }`}
                  >
                    <div className="text-sm font-semibold">{opt.text}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {pickedOption && (
            <div
              role="status"
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                pickedOption.isOptimal
                  ? 'bg-[#1B3A8C]/8 in-[.prostho-studio[data-theme=dark]]:bg-[#1B3A8C]/40 border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B]'
                  : 'bg-[#9B2C3B]/8 in-[.prostho-studio[data-theme=dark]]:bg-[#9B2C3B]/30 border-[#9B2C3B]'
              }`}
            >
              {pickedOption.isOptimal ? (
                <CheckCircle2
                  className="w-5 h-5 text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              ) : (
                <XCircle
                  className="w-5 h-5 text-[#9B2C3B] in-[.prostho-studio[data-theme=dark]]:text-[#F48B96] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              )}
              <div className="text-xs sm:text-sm text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] space-y-1">
                <div className="font-bold">
                  {pickedOption.isOptimal ? 'Optimal Clinical Reasoning' : 'Suboptimal Decision'}
                </div>
                <p>{pickedOption.rationale}</p>
              </div>
            </div>
          )}

          <p className="text-[11px] text-[#0B1F4D]/60 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/65">
            Educational case simulation only; real-world patient care requires comprehensive clinical examination and faculty/clinician oversight.
          </p>
        </div>
      )}
    </section>
  );
}
