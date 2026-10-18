import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { useLearning } from '../../context/LearningContext';
import { CheckCircle2, AlertCircle, Award, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ActiveRecallQuiz: React.FC = () => {
  const { recordQuizScore, unlockBadge } = useLearning();
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      setUserScore((prev) => prev + 1);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      const finalScorePercent = Math.round(((userScore + (selectedOption === currentQ.correctAnswer ? 0 : 0)) / QUIZ_QUESTIONS.length) * 100);
      recordQuizScore('lecture2_full_quiz', finalScorePercent);
      if (finalScorePercent >= 80) {
        unlockBadge('badge_quiz_master');
        confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserScore(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <span>Assessment & Verification</span>
            <span>·</span>
            <span>Lecture 2 Comprehensive</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Recall Clinical Examination</h1>
          <p className="text-xs text-slate-400 mt-1">
            15 board-caliber questions testing diagnostic differentiation, pharmacokinetics, and clinical pathology.
          </p>
        </div>

        {!isQuizCompleted && (
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            <span>Score: </span>
            <span className="font-bold text-teal-400">{userScore}</span>
            <span className="text-slate-500"> / {currentQIndex + (isAnswerSubmitted ? 1 : 0)}</span>
          </div>
        )}
      </div>

      {!isQuizCompleted ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Question Meta Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
            <span className="font-mono text-teal-400 font-semibold uppercase">
              Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            {currentQ.slideRef && (
              <span className="text-slate-400 font-mono">Reference: Slide {currentQ.slideRef}</span>
            )}
          </div>

          {/* Question Text */}
          <h2 className="text-base lg:text-lg font-medium text-slate-100 leading-relaxed">
            {currentQ.question}
          </h2>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswer;

              let buttonStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white';
              if (isAnswerSubmitted) {
                if (isCorrect) {
                  buttonStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected) {
                  buttonStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
                } else {
                  buttonStyle = 'bg-slate-950 border-slate-850 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                buttonStyle = 'bg-teal-950/80 border-teal-500 text-teal-200 ring-1 ring-teal-500';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl text-left text-xs lg:text-sm transition-all border flex items-center justify-between ${buttonStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center font-mono text-xs font-semibold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Submit */}
          {isAnswerSubmitted && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs leading-relaxed space-y-2 animate-fade-in">
              <div className="font-bold text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Clinical & Pathologic Rationale:</span>
              </div>
              <p className="text-slate-300">{currentQ.explanation}</p>
            </div>
          )}

          {/* Bottom Action */}
          <div className="pt-2 flex justify-end">
            {!isAnswerSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-md"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-colors shadow-md"
              >
                <span>{currentQIndex === QUIZ_QUESTIONS.length - 1 ? 'View Final Results' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completed Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-white">Examination Completed</h2>
          <p className="text-xs text-slate-400 max-w-md">
            You achieved a score of {userScore} out of {QUIZ_QUESTIONS.length} (
            {Math.round((userScore / QUIZ_QUESTIONS.length) * 100)}%).
          </p>

          <div className="py-2">
            <div className="text-3xl font-mono font-bold text-teal-400">
              {Math.round((userScore / QUIZ_QUESTIONS.length) * 100)}%
            </div>
          </div>

          <button
            onClick={handleRestartQuiz}
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-colors shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Examination</span>
          </button>
        </div>
      )}
    </div>
  );
};
