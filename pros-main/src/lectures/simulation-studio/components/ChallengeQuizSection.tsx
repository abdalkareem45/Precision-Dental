import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LectureModule } from '../types/prosthodontics';

interface ChallengeQuizSectionProps {
  lecture: LectureModule;
  bestScore: number | null;
  onSubmitQuiz: (scorePercent: number) => void;
}

export function ChallengeQuizSection({
  lecture,
  bestScore,
  onSubmitQuiz,
}: ChallengeQuizSectionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [lecture.id]);

  const total = lecture.quiz.length;
  const answeredCount = lecture.quiz.filter((q) => Boolean(answers[q.id])).length;
  const unansweredCount = total - answeredCount;
  const correctCount = lecture.quiz.filter((q) => answers[q.id] === q.correctOptionId).length;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    if (answeredCount === 0 || submitted) return;
    setSubmitted(true);
    onSubmitQuiz(percent);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
            Scene 05 · Challenge & Knowledge Check
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] mt-1">
            Clinical Reasoning Assessment — Lecture {lecture.number}
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80 tabular-nums">
          <span>
            Answered: <strong>{answeredCount}/{total}</strong>
          </span>
          {bestScore !== null && (
            <span>
              Best Score: <strong className="text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">{bestScore}%</strong>
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Quiz</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {lecture.quiz.map((q, idx) => {
          const picked = answers[q.id];
          const isCorrect = picked === q.correctOptionId;
          const isUnanswered = !picked;

          return (
            <div
              key={q.id}
              className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-5 sm:p-6 space-y-4 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm sm:text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
                  <span className="font-mono text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B] mr-2 tabular-nums">
                    Q{idx + 1}.
                  </span>
                  {q.question}
                </div>
                {submitted && (
                  <span className="text-xs font-semibold shrink-0 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                    {isUnanswered ? 'Unanswered' : isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isPicked = picked === opt.id;
                  const isKey = opt.id === q.correctOptionId;

                  let styleClass =
                    'bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B]';
                  if (submitted) {
                    if (isKey) {
                      styleClass =
                        'bg-[#1B3A8C]/10 in-[.prostho-studio[data-theme=dark]]:bg-[#1B3A8C]/50 border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] font-semibold';
                    } else if (isPicked && !isKey) {
                      styleClass =
                        'bg-[#9B2C3B]/10 in-[.prostho-studio[data-theme=dark]]:bg-[#9B2C3B]/30 border-[#9B2C3B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]';
                    }
                  } else if (isPicked) {
                    styleClass =
                      'bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] border-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D] font-semibold';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-colors cursor-pointer disabled:cursor-default ${styleClass}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`p-3.5 rounded-lg border flex items-start gap-2.5 text-xs sm:text-sm ${
                    isCorrect
                      ? 'bg-[#1B3A8C]/8 in-[.prostho-studio[data-theme=dark]]:bg-[#1B3A8C]/40 border-[#1B3A8C]/40 in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]'
                      : 'bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2
                      className="w-4 h-4 text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <XCircle
                      className="w-4 h-4 text-[#9B2C3B] in-[.prostho-studio[data-theme=dark]]:text-[#F48B96] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  )}
                  <div>
                    <span className="font-semibold">
                      {isUnanswered
                        ? 'Not answered — scored 0: '
                        : isCorrect
                          ? 'Verified: '
                          : 'Explanation: '}
                    </span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        {!submitted ? (
          <>
            <div className="text-xs sm:text-sm text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80">
              {unansweredCount > 0
                ? `${unansweredCount} question${unansweredCount > 1 ? 's' : ''} remaining (unanswered items score 0 upon submission).`
                : 'All questions answered. Submit to view rationales and record your score.'}
            </div>
            <button
              type="button"
              disabled={answeredCount === 0}
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D] hover:bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:hover:bg-[#E0BC64] disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
            >
              Submit Assessment
            </button>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <div className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] tabular-nums">
                Score: {correctCount}/{total} ({percent}%)
              </div>
              <p className="text-xs text-[#0B1F4D]/70 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/70">
                Educational self-check only; quiz performance reflects module comprehension and does not establish clinical competence.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D] hover:bg-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:bg-[#E0BC64] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Retry Quiz
            </button>
          </>
        )}
      </div>
    </section>
  );
}
