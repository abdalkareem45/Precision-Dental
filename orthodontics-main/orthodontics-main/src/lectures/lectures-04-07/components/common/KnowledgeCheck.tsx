import { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import type { QuizQuestion } from '../../types/lecture';

interface KnowledgeCheckProps {
  id: string;
  lectureNumber: number;
  questions: QuizQuestion[];
}

export function KnowledgeCheck({ id, lectureNumber, questions }: KnowledgeCheckProps) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(selected).length;
  const correctCount = questions.reduce(
    (sum, q) => (selected[q.id] === q.correctOptionId ? sum + 1 : sum),
    0
  );
  const percentage = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleReset = () => {
    setSelected({});
    setSubmitted(false);
  };

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="bg-white border border-[#E6E8EC] rounded-xl overflow-hidden scroll-mt-24"
    >
      <div className="px-5 py-4 sm:px-6 border-b border-[#E6E8EC] flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#8A691B] mb-1">
            Self-Assessment · Lecture {lectureNumber}
          </p>
          <h3 id={`${id}-title`} className="text-lg sm:text-xl font-bold text-[#0B1F4D]">
            Clinical Knowledge Check
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#475569] tabular-nums">
            {answeredCount} of {questions.length} answered
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0B1F4D] bg-[#FAF8F3] border border-[#E6E8EC] rounded-lg hover:border-[#1B3A8C] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Quiz</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {questions.map((q, idx) => {
          const chosenId = selected[q.id];
          const isAnswered = chosenId !== undefined;
          const isCorrect = chosenId === q.correctOptionId;

          return (
            <fieldset key={q.id} className="pb-6 border-b border-[#E6E8EC] last:border-b-0 last:pb-0">
              <legend className="text-sm sm:text-base font-semibold text-[#0B1F4D] mb-3">
                <span className="font-mono text-[#1B3A8C] mr-2">0{idx + 1}.</span>
                {q.prompt}
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt) => {
                  const isThisSelected = chosenId === opt.id;
                  const isThisCorrect = opt.id === q.correctOptionId;

                  let styleClass =
                    'bg-[#FAF8F3] border-[#E6E8EC] text-[#0B1F4D] hover:border-[#1B3A8C]';
                  if (!submitted && isThisSelected) {
                    styleClass = 'bg-[#1B3A8C] border-[#1B3A8C] text-white';
                  } else if (submitted && isThisCorrect) {
                    styleClass = 'bg-emerald-50 border-emerald-600 text-emerald-950';
                  } else if (submitted && isThisSelected && !isThisCorrect) {
                    styleClass = 'bg-rose-50 border-rose-600 text-rose-950';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={submitted}
                      aria-pressed={isThisSelected}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${styleClass}`}
                    >
                      <span className="font-mono text-xs uppercase mt-0.5 shrink-0 opacity-80">
                        {opt.id}.
                      </span>
                      <span className="flex-1 leading-snug">{opt.text}</span>
                      {submitted && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                      {submitted && isThisSelected && !isThisCorrect && (
                        <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`mt-3 rounded-lg p-3 text-xs sm:text-sm leading-relaxed border ${
                    !isAnswered
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : isCorrect
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/70 border-rose-200 text-rose-950'
                  }`}
                >
                  <span className="font-bold mr-1.5">
                    {!isAnswered ? 'Unanswered:' : isCorrect ? 'Correct:' : 'Review:'}
                  </span>
                  {q.explanation}
                </div>
              )}
            </fieldset>
          );
        })}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          {!submitted ? (
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1B3A8C] hover:bg-[#0B1F4D] rounded-lg transition-colors cursor-pointer"
            >
              Check Answers
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-4" role="status" aria-live="polite">
              <p className="text-sm font-bold text-[#0B1F4D] tabular-nums">
                Score: {correctCount} / {questions.length} ({percentage}%)
              </p>
              <span className="text-xs text-[#475569]">
                Practice self-check only — does not establish clinical competence.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
