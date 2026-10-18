import React, { useState } from 'react';
import { QuizQuestion } from '../types/dental';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

interface LectureQuizProps {
  lectureId: number;
  lectureTitle: string;
  questions: QuizQuestion[];
}

export const LectureQuiz: React.FC<LectureQuizProps> = ({
  lectureId,
  lectureTitle,
  questions,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const allAnswered = questions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EC] gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#C9A24B]" />
            Lecture {lectureId} Clinical Knowledge Verification
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Test your clinical comprehension of key examination concepts
          </p>
        </div>

        {submitted && (
          <div className="flex items-center gap-2 bg-[#FAF8F3] px-3.5 py-1.5 rounded-xl border border-[#C9A24B]/40">
            <Award className="w-4 h-4 text-[#C9A24B]" />
            <span className="text-xs font-bold text-[#0B1F4D]">
              Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6 my-5">
        {questions.map((q, qIndex) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div key={q.id} className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#0B1F4D] text-[#C9A24B] text-xs font-bold shrink-0 mt-0.5">
                  {qIndex + 1}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-[#0B1F4D] leading-snug">
                  {q.question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, oIndex) => {
                  const isSelected = userChoice === oIndex;
                  const isAnswerCorrect = oIndex === q.correctIndex;

                  let btnStyle = 'bg-white text-slate-700 hover:bg-slate-100 border-[#E6E8EC]';

                  if (submitted) {
                    if (isAnswerCorrect) {
                      btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-red-600 text-white border-red-600';
                    } else {
                      btnStyle = 'bg-white text-slate-400 border-slate-200 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-[#0B1F4D] text-white border-[#0B1F4D] font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleSelectOption(q.id, oIndex)}
                      disabled={submitted}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${btnStyle}`}
                    >
                      <span className="font-bold opacity-75 shrink-0">
                        {String.fromCharCode(65 + oIndex)}.
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Submitted Feedback */}
              {submitted && (
                <div className={`p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                  isCorrect
                    ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                    : 'bg-amber-50 text-amber-950 border border-amber-200'
                }`}>
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="font-bold block mb-0.5">
                      {isCorrect ? 'Correct Answer' : `Correct Answer: Option ${String.fromCharCode(65 + q.correctIndex)}`}
                    </strong>
                    <span>{q.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E6E8EC]">
        <button
          onClick={handleResetQuiz}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-[#E6E8EC] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Quiz</span>
        </button>

        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              allAnswered
                ? 'bg-[#0B1F4D] text-[#FAF8F3] hover:bg-[#1B3A8C] cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit Answers ({Object.keys(selectedAnswers).length}/{questions.length})
          </button>
        ) : (
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Verification Complete
          </span>
        )}
      </div>
    </div>
  );
};
