import React, { useState } from 'react';
import { LECTURE_1_QUIZ_QUESTIONS } from '../../data/lecture1Data';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const Lecture1QuizView: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const question = LECTURE_1_QUIZ_QUESTIONS[currentIdx];
  const userSelected = selectedAnswers[currentIdx];
  const hasAnswered = userSelected !== undefined;

  const handleSelectOption = (optIdx: number) => {
    if (hasAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIdx < LECTURE_1_QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setShowExplanation(selectedAnswers[currentIdx + 1] !== undefined);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setShowExplanation(selectedAnswers[currentIdx - 1] !== undefined);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowExplanation(false);
    setIsFinished(false);
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([idx, ans]) => LECTURE_1_QUIZ_QUESTIONS[parseInt(idx)].correctAnswer === ans
  ).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              Lecture 1 Assessment Suite
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mt-1">
            Clinical Morphology, HSV & VZV Board Challenge
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">Progress</span>
            <span className="text-xs font-bold text-teal-300 font-mono">
              {currentIdx + 1} / {LECTURE_1_QUIZ_QUESTIONS.length}
            </span>
          </div>
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            title="Restart Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Finished Summary State */}
      {isFinished ? (
        <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-400">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-white">Lecture 1 Assessment Complete!</h4>
          <p className="text-sm text-slate-300 font-mono">
            You scored <strong className="text-teal-400 text-base">{correctCount}</strong> out of{' '}
            <strong>{LECTURE_1_QUIZ_QUESTIONS.length}</strong> (
            {Math.round((correctCount / LECTURE_1_QUIZ_QUESTIONS.length) * 100)}%)
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg"
            >
              Retake Challenge
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Question Text */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                Question {currentIdx + 1} of {LECTURE_1_QUIZ_QUESTIONS.length}
              </span>
              {question.slideRef && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  Slide {question.slideRef}
                </span>
              )}
            </div>
            <h4 className="text-sm font-semibold text-slate-100 leading-relaxed">
              {question.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((opt, optIdx) => {
              const isSelected = userSelected === optIdx;
              const isCorrect = question.correctAnswer === optIdx;

              let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white';
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold ring-1 ring-emerald-500';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-semibold ring-1 ring-rose-500';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnswered}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-750 flex items-center justify-center font-mono font-bold text-[10px] text-slate-400 shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Rationale & Slide Reference */}
          {showExplanation && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs animate-fade-in">
              <div className="flex items-center gap-2 text-teal-400 font-bold">
                <BookOpen className="w-4 h-4" />
                <span>Lecture Slide Rationale</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={handlePrevious}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 disabled:opacity-40 transition-colors shadow-md flex items-center gap-1.5"
            >
              <span>{currentIdx === LECTURE_1_QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
