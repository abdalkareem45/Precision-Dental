import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, RotateCcw, Award, AlertCircle } from 'lucide-react';
import { LectureId, QuizQuestion } from '../../types/lecture';
import { useLabStore } from '../../store/useLabStore';
import { LectureQuizSkeleton } from './LectureQuizSkeleton';

interface LectureQuizModuleProps {
  lectureId: LectureId;
  questions: QuizQuestion[];
  isLoading?: boolean;
}

export const LectureQuizModule: React.FC<LectureQuizModuleProps> = ({
  lectureId,
  questions,
  isLoading = false,
}) => {
  const saved = useLabStore((s) => s.quizScores[lectureId]);
  const recordQuizScore = useLabStore((s) => s.recordQuizScore);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [unansweredWarning, setUnansweredWarning] = useState(false);
  const [isHydrating, setIsHydrating] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    setSelected({});
    setSubmitted(false);
    setUnansweredWarning(false);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setIsHydrating(false);
      return;
    }

    setIsHydrating(true);
    const timer = window.setTimeout(() => {
      setIsHydrating(false);
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [lectureId]);

  const answeredCount = questions.filter((q) => Boolean(selected[q.id])).length;
  const allAnswered = answeredCount === questions.length;

  const computedScore = questions.reduce(
    (acc, q) => acc + (selected[q.id] === q.correctOptionId ? 1 : 0),
    0
  );

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) return; // Prevent unintended repeated scoring after submit until reset
    setSelected((prev) => ({ ...prev, [questionId]: optionId }));
    setUnansweredWarning(false);
  };

  const handleSubmit = () => {
    if (!allAnswered) {
      setUnansweredWarning(true);
      return;
    }
    setSubmitted(true);
    setUnansweredWarning(false);
    recordQuizScore(lectureId, computedScore, questions.length);
  };

  const handleReset = () => {
    setSelected({});
    setSubmitted(false);
    setUnansweredWarning(false);
  };

  const typeLabel: Record<QuizQuestion['type'], string> = {
    'clinical-mcq': 'Clinical Reasoning',
    'visual-id': 'Visual Identification',
    'model-3d': '3D Model Question',
    'sequence-check': 'Sequence Verification',
  };

  if (isLoading || isHydrating) {
    return <LectureQuizSkeleton questionCount={questions.length || 4} />;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      aria-labelledby="quiz-heading"
      className="rounded-2xl border border-marble bg-white p-5 sm:p-6 shadow-sm space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-marble pb-4">
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-royal">
            Interactive Lecture Assessment
          </span>
          <h2 id="quiz-heading" className="text-xl font-bold text-navy mt-0.5">
            Knowledge &amp; 3D Application Check
          </h2>
          <p className="text-xs text-navy/70 mt-0.5">
            {questions.length} questions · Answer all items for immediate rationale and score recording
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {saved && (
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-royal tabular-nums">
              <Award className="w-4 h-4 text-gold" aria-hidden="true" />
              <span>
                Last Recorded: {saved.score}/{saved.total} (
                {Math.round((saved.score / Math.max(1, saved.total)) * 100)}%)
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-marble text-xs font-semibold text-navy hover:border-royal cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Quiz</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const pickedId = selected[q.id];
          const isUnansweredError = unansweredWarning && !pickedId;
          return (
            <fieldset
              key={q.id}
              className={`rounded-xl border p-4 space-y-3 ${
                isUnansweredError
                  ? 'border-amber-400 bg-amber-50/40'
                  : 'border-marble bg-ivory/40'
              }`}
            >
              <legend className="text-xs font-mono font-semibold text-royal px-1">
                Q{qIdx + 1} · {typeLabel[q.type]}
              </legend>
              <p className="text-sm font-bold text-navy">{q.prompt}</p>
              {q.visualHint && (
                <p className="text-xs text-royal/85 font-medium">{q.visualHint}</p>
              )}

              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isPicked = pickedId === opt.id;
                  const isCorrectOpt = opt.id === q.correctOptionId;

                  let style =
                    'border-marble bg-white text-navy hover:border-royal/50';
                  if (!submitted && isPicked) {
                    style = 'border-royal bg-royal text-ivory';
                  } else if (submitted && isCorrectOpt) {
                    style = 'border-emerald-400 bg-emerald-50 text-emerald-950';
                  } else if (submitted && isPicked && !isCorrectOpt) {
                    style = 'border-red-400 bg-red-50 text-red-950';
                  }

                  return (
                    <div key={opt.id} className="space-y-1">
                      <button
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, opt.id)}
                        aria-pressed={isPicked}
                        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left text-xs font-semibold transition-colors ${
                          submitted ? 'cursor-default' : 'cursor-pointer'
                        } ${style}`}
                      >
                        <span>{opt.text}</span>
                        {submitted && isCorrectOpt && (
                          <CheckCircle2
                            className="w-4 h-4 text-emerald-700 shrink-0"
                            aria-label="Correct answer"
                          />
                        )}
                        {submitted && isPicked && !isCorrectOpt && (
                          <XCircle
                            className="w-4 h-4 text-red-700 shrink-0"
                            aria-label="Incorrect answer"
                          />
                        )}
                      </button>

                      {submitted && (isPicked || isCorrectOpt) && (
                        <p className="text-[11px] px-2 text-navy/85 leading-relaxed">
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      {/* Submission Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-marble">
        <div aria-live="polite" className="text-xs font-semibold">
          {unansweredWarning ? (
            <span className="inline-flex items-center gap-1.5 text-amber-800">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              Please select an answer for all {questions.length} questions ({answeredCount}/{questions.length} answered).
            </span>
          ) : submitted ? (
            <span className="text-navy">
              Score: <span className="font-mono tabular-nums text-royal">{computedScore}/{questions.length}</span> (
              <span className="font-mono tabular-nums">
                {Math.round((computedScore / Math.max(1, questions.length)) * 100)}%
              </span>
              ) — Educational self-assessment only; does not establish clinical competence.
            </span>
          ) : (
            <span className="text-navy/70 font-mono tabular-nums">
              Answered: {answeredCount}/{questions.length}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={submitted ? handleReset : handleSubmit}
          className="px-5 py-2.5 rounded-lg bg-royal hover:bg-navy text-ivory text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          {submitted ? 'Retake Quiz' : 'Submit Answers'}
        </button>
      </div>
    </motion.section>
  );
};
