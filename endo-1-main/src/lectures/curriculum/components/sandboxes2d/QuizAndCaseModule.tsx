import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Stethoscope, ClipboardCheck } from 'lucide-react';
import type { LectureId } from '../../types/lecture';
import { LECTURE_CASES, LECTURE_QUIZZES } from '../../data/quizzesAndCases';

interface QuizAndCaseModuleProps {
  lectureId: LectureId;
  bestScore: number | null;
  completedCaseIds: string[];
  onQuizComplete: (score: number, total: number) => void;
  onCaseComplete: (caseId: string) => void;
}

export const QuizAndCaseModule: React.FC<QuizAndCaseModuleProps> = ({
  lectureId,
  bestScore,
  completedCaseIds,
  onQuizComplete,
  onCaseComplete,
}) => {
  const questions = LECTURE_QUIZZES[lectureId];
  const cases = LECTURE_CASES[lectureId];

  // Quiz state keyed per question
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Clinical case state
  const [caseSelections, setCaseSelections] = useState<Record<string, string>>({});

  const answeredCount = questions.filter((q) => Boolean(selectedAnswers[q.id])).length;
  const computedScore = questions.reduce(
    (acc, q) => acc + (selectedAnswers[q.id] === q.correctOptionId ? 1 : 0),
    0
  );

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    onQuizComplete(computedScore, questions.length);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Clinical Case Simulation */}
      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 sm:p-6 transition-colors duration-200">
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[var(--pd-border)]">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]" />
            <div>
              <h4 className="text-base font-bold text-[var(--pd-text)]">Clinical Case Simulation</h4>
              <p className="text-xs text-[var(--pd-text-muted)]">Deterministic scenario grounded in lecture rules</p>
            </div>
          </div>
          {cases.every((c) => completedCaseIds.includes(c.id)) && (
            <span className="text-xs font-semibold text-emerald-700 [.endo-curriculum[data-endo-theme=dark]_&]:text-emerald-400 inline-flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Completed
            </span>
          )}
        </div>

        {cases.map((cs) => {
          const pickedOptId = caseSelections[cs.id];
          const pickedOpt = cs.options.find((o) => o.id === pickedOptId);
          return (
            <div key={cs.id} className="space-y-3">
              <h5 className="text-sm font-bold text-[var(--pd-text)]">{cs.title}</h5>
              <p className="text-xs text-[var(--pd-text)]/90 leading-relaxed">{cs.patientPresentation}</p>

              <ul className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-3 text-xs text-[var(--pd-text)] space-y-1">
                {cs.clinicalFindings.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-[var(--pd-gold)] font-bold">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <p className="text-xs font-semibold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">{cs.question}</p>

              <div className="space-y-2">
                {cs.options.map((opt) => {
                  const isSelected = pickedOptId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setCaseSelections((prev) => ({ ...prev, [cs.id]: opt.id }));
                        if (opt.isOptimal) {
                          onCaseComplete(cs.id);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-colors ${
                        isSelected
                          ? opt.isOptimal
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold [.endo-curriculum[data-endo-theme=dark]_&]:bg-emerald-950/60 [.endo-curriculum[data-endo-theme=dark]_&]:border-emerald-400/70 [.endo-curriculum[data-endo-theme=dark]_&]:text-emerald-100'
                            : 'bg-rose-50 border-rose-300 text-rose-950 font-semibold [.endo-curriculum[data-endo-theme=dark]_&]:bg-rose-950/60 [.endo-curriculum[data-endo-theme=dark]_&]:border-rose-400/70 [.endo-curriculum[data-endo-theme=dark]_&]:text-rose-100'
                          : 'bg-[var(--pd-surface-inset)] border-[var(--pd-border)] text-[var(--pd-text)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {pickedOpt && (
                <div
                  role="status"
                  className={`rounded-xl p-3 text-xs border ${
                    pickedOpt.isOptimal
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950 [.endo-curriculum[data-endo-theme=dark]_&]:bg-emerald-950/55 [.endo-curriculum[data-endo-theme=dark]_&]:border-emerald-500/45 [.endo-curriculum[data-endo-theme=dark]_&]:text-emerald-100'
                      : 'bg-amber-50 border-amber-200 text-amber-950 [.endo-curriculum[data-endo-theme=dark]_&]:bg-[#162D66] [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]/55 [.endo-curriculum[data-endo-theme=dark]_&]:text-[#FAF8F3]'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {pickedOpt.isOptimal ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 [.endo-curriculum[data-endo-theme=dark]_&]:text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 [.endo-curriculum[data-endo-theme=dark]_&]:text-rose-400" />
                    )}
                    <span>{pickedOpt.clinicalOutcome}</span>
                  </div>
                  <p className="leading-relaxed">{pickedOpt.rationale}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 text-[11px] text-[var(--pd-text-muted)]">
                <span>{cs.educationalNote}</span>
                {pickedOpt && (
                  <button
                    type="button"
                    onClick={() =>
                      setCaseSelections((prev) => {
                        const copy = { ...prev };
                        delete copy[cs.id];
                        return copy;
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)] hover:underline shrink-0 ml-2"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Case
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Knowledge Quiz */}
      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 sm:p-6 transition-colors duration-200">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[var(--pd-border)]">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]" />
            <div>
              <h4 className="text-base font-bold text-[var(--pd-text)]">Visual Knowledge Check</h4>
              <p className="text-xs text-[var(--pd-text-muted)]">
                {questions.length} source-verified questions
                {bestScore !== null && ` · Best: ${bestScore}/${questions.length}`}
              </p>
            </div>
          </div>

          {submitted && (
            <div className="font-mono-tabular text-xs font-bold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">
              Score: {computedScore}/{questions.length} ({Math.round((computedScore / questions.length) * 100)}%)
            </div>
          )}
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const chosen = selectedAnswers[q.id];
            const isCorrect = chosen === q.correctOptionId;

            return (
              <div key={q.id} className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-3.5 space-y-2">
                <div className="text-xs font-bold text-[var(--pd-text)]">
                  {idx + 1}. {q.prompt}
                </div>
                <div className="space-y-1.5">
                  {q.options.map((opt) => {
                    const isPicked = chosen === opt.id;
                    const isKey = q.correctOptionId === opt.id;
                    let cls =
                      'bg-white border-[#E6E8EC] text-[#0B1F4D] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:bg-[var(--pd-navy)] [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]/25 [.endo-curriculum[data-endo-theme=dark]_&]:text-[#FAF8F3] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]';
                    if (submitted) {
                      if (isKey)
                        cls =
                          'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold [.endo-curriculum[data-endo-theme=dark]_&]:bg-emerald-950/60 [.endo-curriculum[data-endo-theme=dark]_&]:border-emerald-400/70 [.endo-curriculum[data-endo-theme=dark]_&]:text-emerald-100';
                      else if (isPicked && !isKey)
                        cls =
                          'bg-rose-50 border-rose-300 text-rose-950 [.endo-curriculum[data-endo-theme=dark]_&]:bg-rose-950/60 [.endo-curriculum[data-endo-theme=dark]_&]:border-rose-400/70 [.endo-curriculum[data-endo-theme=dark]_&]:text-rose-100';
                    } else if (isPicked) {
                      cls = 'bg-[#1B3A8C] border-[#1B3A8C] text-white font-semibold [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={submitted}
                        onClick={() =>
                          setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors flex items-center justify-between gap-2 ${cls}`}
                      >
                        <span>{opt.label}</span>
                        {submitted && isKey && <CheckCircle2 className="w-4 h-4 text-emerald-600 [.endo-curriculum[data-endo-theme=dark]_&]:text-emerald-400 shrink-0" />}
                        {submitted && isPicked && !isKey && <XCircle className="w-4 h-4 text-rose-600 [.endo-curriculum[data-endo-theme=dark]_&]:text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="text-[11px] pt-1 text-[var(--pd-text)]/90 leading-snug">
                    <strong className={isCorrect ? 'text-emerald-700 [.endo-curriculum[data-endo-theme=dark]_&]:text-emerald-400' : 'text-rose-700 [.endo-curriculum[data-endo-theme=dark]_&]:text-rose-400'}>
                      {isCorrect ? 'Correct' : 'Review'} ({q.sourceRef}):
                    </strong>{' '}
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[var(--pd-border)]">
          <span className="text-xs text-[var(--pd-text-muted)] font-mono-tabular">
            Answered: {answeredCount}/{questions.length}
          </span>
          <div className="flex items-center gap-2">
            {submitted ? (
              <button
                type="button"
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B3A8C] text-white text-xs font-semibold border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]/50 hover:bg-[#0B1F4D] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)] transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry Quiz
              </button>
            ) : (
              <button
                type="button"
                disabled={answeredCount < questions.length}
                onClick={handleSubmitQuiz}
                className="px-4 py-2 rounded-lg bg-[#1B3A8C] text-white text-xs font-semibold border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]/50 hover:bg-[#0B1F4D] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)] disabled:opacity-45 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
              >
                Check Answers ({answeredCount}/{questions.length})
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-[var(--pd-text-muted)] mt-2">
          Note: Quiz scores verify recall of uploaded lecture material and do not establish clinical competence.
        </p>
      </div>
    </div>
  );
};
