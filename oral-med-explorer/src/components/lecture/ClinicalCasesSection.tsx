import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  Sparkles,
  Stethoscope,
  UserRound,
  XCircle,
} from 'lucide-react';
import type { ClinicalCase } from '@/src/types/lecture';

interface ClinicalCasesSectionProps {
  lectureId: string;
  cases: ClinicalCase[];
  completedCaseIds: string[];
  onMarkCaseCompleted: (lectureId: string, caseId: string) => void;
}

type CasePhase = 'presentation' | 'examination' | 'diagnosis' | 'treatment';

export const ClinicalCasesSection: React.FC<ClinicalCasesSectionProps> = ({
  lectureId,
  cases,
  completedCaseIds,
  onMarkCaseCompleted,
}) => {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [phase, setPhase] = useState<CasePhase>('presentation');
  const [diagChoice, setDiagChoice] = useState<Record<string, string>>({});
  const [treatChoice, setTreatChoice] = useState<Record<string, string>>({});

  useEffect(() => {
    setActiveCaseIdx(0);
    setPhase('presentation');
    setDiagChoice({});
    setTreatChoice({});
  }, [lectureId]);

  const currentCase = cases[activeCaseIdx] || cases[0];
  if (!currentCase) return null;

  const pickedDiag = diagChoice[currentCase.id];
  const pickedTreat = treatChoice[currentCase.id];

  const handlePickDiag = (optionId: string) => {
    setDiagChoice((prev) => ({ ...prev, [currentCase.id]: optionId }));
    if (treatChoice[currentCase.id]) {
      onMarkCaseCompleted(lectureId, currentCase.id);
    }
  };

  const handlePickTreat = (optionId: string) => {
    setTreatChoice((prev) => ({ ...prev, [currentCase.id]: optionId }));
    if (diagChoice[currentCase.id]) {
      onMarkCaseCompleted(lectureId, currentCase.id);
    }
  };

  const resetCurrentCase = () => {
    setDiagChoice((prev) => {
      const next = { ...prev };
      delete next[currentCase.id];
      return next;
    });
    setTreatChoice((prev) => {
      const next = { ...prev };
      delete next[currentCase.id];
      return next;
    });
    setPhase('presentation');
  };

  const phases: Array<{ key: CasePhase; label: string }> = [
    { key: 'presentation', label: '1. Presentation' },
    { key: 'examination', label: '2. Examination' },
    { key: 'diagnosis', label: '3. Diagnosis' },
    { key: 'treatment', label: '4. Management & Pearl' },
  ];

  return (
    <section
      id="section-clinical-cases"
      aria-labelledby="clinical-cases-heading"
      className="rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 sm:p-6 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#1B3A8C] dark:text-[#3B82F6]">
            Section 06 • Clinical Case Center
          </div>
          <h2 id="clinical-cases-heading" className="font-display text-xl sm:text-2xl font-bold text-[#0B1F4D] dark:text-white">
            Virtual Patient Reasoning Cases
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Work through patient presentation, examination findings, differential diagnosis, and clinical management. Educational scenarios do not replace supervised clinical care.
          </p>
        </div>
        <span className="font-mono text-xs px-3 py-1 rounded-lg bg-[#FAF8F3] dark:bg-[#0B1220] border border-[#E6E8EC] dark:border-[#1F2937] text-[#0B1F4D] dark:text-slate-200 tabular-nums shrink-0">
          Solved {completedCaseIds.length} / {cases.length}
        </span>
      </div>

      {/* Case Switcher */}
      <div className="grid sm:grid-cols-3 gap-2.5">
        {cases.map((cs, idx) => {
          const active = idx === activeCaseIdx;
          const solved = completedCaseIds.includes(cs.id);
          return (
            <button
              key={cs.id}
              type="button"
              onClick={() => {
                setActiveCaseIdx(idx);
                setPhase('presentation');
              }}
              className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                active
                  ? 'border-[#1B3A8C] bg-[#1B3A8C] text-white dark:border-[#3B82F6] dark:bg-[#1E3A8A]'
                  : 'border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] text-[#0B1F4D] dark:text-slate-200 hover:border-[#C9A24B]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono mb-1">
                <span className={active ? 'text-[#E4C16E]' : 'text-[#1B3A8C] dark:text-[#38BDF8]'}>
                  CASE 0{idx + 1} • {cs.difficulty}
                </span>
                {solved && <CheckCircle2 className={`w-3.5 h-3.5 ${active ? 'text-[#5EEAD4]' : 'text-emerald-600 dark:text-emerald-400'}`} />}
              </div>
              <div className="text-sm font-bold leading-snug line-clamp-1">{cs.title}</div>
              <div className={`text-xs mt-0.5 line-clamp-1 ${active ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                {cs.patientTag}
              </div>
            </button>
          );
        })}
      </div>

      {/* Case Workbench */}
      <div className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E8EC] dark:border-[#1F2937] pb-3">
          <div>
            <div className="text-xs font-mono text-[#C9A24B] font-semibold">
              {currentCase.patientTag} • Focus: {currentCase.learningFocus}
            </div>
            <h3 className="font-display text-lg font-bold text-[#0B1F4D] dark:text-white">
              {currentCase.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={resetCurrentCase}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-xs font-medium text-[#0B1F4D] dark:text-slate-200 self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Case
          </button>
        </div>

        {/* Phase Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="tablist" aria-label="Clinical case phases">
          {phases.map((p) => (
            <button
              key={p.key}
              type="button"
              role="tab"
              aria-selected={phase === p.key}
              onClick={() => setPhase(p.key)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                phase === p.key
                  ? 'bg-[#C9A24B] text-[#0B1F4D]'
                  : 'bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] text-slate-700 dark:text-slate-300 hover:border-[#1B3A8C]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Phase 1: Presentation */}
        {phase === 'presentation' && (
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-7 rounded-xl bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] p-4 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#1B3A8C] dark:text-[#38BDF8]">
                <UserRound className="w-4 h-4" />
                Chief Complaint & History
              </div>
              <p className="text-sm font-semibold text-[#0B1F4D] dark:text-white leading-relaxed">
                “{currentCase.presentation.chiefComplaint}”
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {currentCase.presentation.history.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A8C] dark:bg-[#3B82F6] mt-2 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-5 rounded-xl bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] p-4 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-amber-700 dark:text-amber-300">
                <AlertCircle className="w-4 h-4" />
                Vitals & Clinical Flags
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {currentCase.presentation.vitalsAndFlags.map((flag, i) => (
                  <li key={i} className="p-2 rounded-lg bg-[#FAF8F3] dark:bg-[#0B1220] border border-[#E6E8EC] dark:border-[#1F2937]">
                    {flag}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setPhase('examination')}
                className="w-full py-2 rounded-lg bg-[#1B3A8C] hover:bg-[#0B1F4D] dark:bg-[#3B82F6] text-white text-xs font-semibold cursor-pointer"
              >
                Proceed to Examination →
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Examination */}
        {phase === 'examination' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] p-4 space-y-2.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#1B3A8C] dark:text-[#38BDF8]">
                <Stethoscope className="w-4 h-4" />
                Extraoral & Intraoral Findings
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {currentCase.examination.extraoralAndIntraoral.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#C9A24B]">
                  <ClipboardCheck className="w-4 h-4" />
                  Investigations & Chairside Tests
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {currentCase.examination.investigations.map((inv, i) => (
                    <li key={i} className="p-2.5 rounded-lg bg-[#FAF8F3] dark:bg-[#0B1220] border border-[#E6E8EC] dark:border-[#1F2937]">
                      {inv}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setPhase('diagnosis')}
                className="w-full py-2 rounded-lg bg-[#1B3A8C] hover:bg-[#0B1F4D] dark:bg-[#3B82F6] text-white text-xs font-semibold cursor-pointer"
              >
                Formulate Diagnosis →
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: Diagnosis */}
        {phase === 'diagnosis' && (
          <div className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] p-4 sm:p-5 space-y-4">
            <h4 className="font-display text-base font-bold text-[#0B1F4D] dark:text-white">
              {currentCase.diagnosisQuestion.prompt}
            </h4>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {currentCase.diagnosisQuestion.options.map((opt) => {
                const isPicked = pickedDiag === opt.id;
                const answered = Boolean(pickedDiag);
                let cls = 'border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] hover:border-[#1B3A8C]';
                if (answered) {
                  if (opt.isCorrect) cls = 'border-emerald-500 bg-emerald-500/10';
                  else if (isPicked) cls = 'border-red-500 bg-red-500/10';
                }
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={answered}
                    onClick={() => handlePickDiag(opt.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer disabled:cursor-default ${cls}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-[#0B1F4D] dark:text-white">
                        {opt.label}
                      </span>
                      {answered && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {answered && isPicked && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                    {answered && (isPicked || opt.isCorrect) && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-snug">
                        {opt.rationale}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
            {pickedDiag && (
              <button
                type="button"
                onClick={() => setPhase('treatment')}
                className="px-4 py-2 rounded-lg bg-[#1B3A8C] text-white text-xs font-semibold cursor-pointer"
              >
                Continue to Management & Pearl →
              </button>
            )}
          </div>
        )}

        {/* Phase 4: Management & Pearl */}
        {phase === 'treatment' && (
          <div className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] p-4 sm:p-5 space-y-4">
            <h4 className="font-display text-base font-bold text-[#0B1F4D] dark:text-white">
              {currentCase.treatmentQuestion.prompt}
            </h4>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {currentCase.treatmentQuestion.options.map((opt) => {
                const isPicked = pickedTreat === opt.id;
                const answered = Boolean(pickedTreat);
                let cls = 'border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] hover:border-[#1B3A8C]';
                if (answered) {
                  if (opt.isCorrect) cls = 'border-emerald-500 bg-emerald-500/10';
                  else if (isPicked) cls = 'border-red-500 bg-red-500/10';
                }
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={answered}
                    onClick={() => handlePickTreat(opt.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer disabled:cursor-default ${cls}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-[#0B1F4D] dark:text-white">
                        {opt.label}
                      </span>
                      {answered && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {answered && isPicked && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                    {answered && (isPicked || opt.isCorrect) && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-snug">
                        {opt.rationale}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {pickedTreat && (
              <div className="rounded-xl border border-[#C9A24B]/50 bg-[#C9A24B]/12 p-4 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-[#0B1F4D] dark:text-slate-100">
                  <strong>Clinical Pearl:</strong> {currentCase.treatmentQuestion.clinicalPearl}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
