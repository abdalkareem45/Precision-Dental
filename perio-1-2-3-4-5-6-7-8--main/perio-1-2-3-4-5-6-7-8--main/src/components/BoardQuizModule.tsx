import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Award,
  Clock,
  BookOpen,
  Filter,
  Sparkles,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';
import { BOARD_QUIZ_QUESTIONS } from '../data/curriculumData';
import { QuizQuestion } from '../types/periodontics';

export const BoardQuizModule: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [timedMode, setTimedMode] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Filtered Questions
  const filteredQuestions = selectedTopic === 'All'
    ? BOARD_QUIZ_QUESTIONS
    : BOARD_QUIZ_QUESTIONS.filter((q) => q.topic === selectedTopic);

  const currentQ: QuizQuestion | undefined = filteredQuestions[currentIndex];

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (timedMode && isTimerRunning && timerSeconds > 0 && !quizSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timedMode && !quizSubmitted) {
      handleSubmitQuiz();
    }
    return () => clearInterval(interval);
  }, [timedMode, isTimerRunning, timerSeconds, quizSubmitted]);

  const handleSelectOption = (optIndex: number) => {
    if (quizSubmitted) return;
    if (!currentQ) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optIndex
    });
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(selectedAnswers[filteredQuestions[currentIndex + 1]?.id] !== undefined);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowExplanation(selectedAnswers[filteredQuestions[currentIndex - 1]?.id] !== undefined);
    }
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    setIsTimerRunning(false);
    const score = calculateScore();
    if (score.percentage >= 75) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback if confetti blocked
      }
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setQuizSubmitted(false);
    setTimerSeconds(60);
    setIsTimerRunning(timedMode);
  };

  const calculateScore = () => {
    let correct = 0;
    filteredQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const total = filteredQuestions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  };

  const scoreData = calculateScore();
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Quiz Top Navigation & Filters */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Topic Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" /> Topic:
          </span>
          {[
            'All',
            'Anatomy & Probing',
            'Diagnosis & Classification',
            'Staging & Grading',
            'Treatment Steps',
            'Stage IV Phenotypes',
            'Prognosis'
          ].map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setSelectedTopic(topic);
                setCurrentIndex(0);
                setShowExplanation(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                selectedTopic === topic
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Timed Mode Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setTimedMode(!timedMode);
              setIsTimerRunning(!timedMode);
              setTimerSeconds(60);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              timedMode
                ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {timedMode ? `Timed Mode: ${timerSeconds}s` : 'Enable Timed Mode'}
          </button>

          <button
            onClick={handleResetQuiz}
            className="p-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition"
            title="Reset Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Question Display */}
      {filteredQuestions.length > 0 && currentQ ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Card (2 Columns) */}
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Question Header & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-blue-950 text-blue-300 px-3 py-1 rounded-full border border-blue-800">
                    Question {currentIndex + 1} of {filteredQuestions.length}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentQ.topic}
                  </span>
                </div>

                <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                  currentQ.difficulty === 'Viva Voce'
                    ? 'bg-purple-950 text-purple-300 border-purple-700'
                    : currentQ.difficulty === 'Advanced Clinical'
                    ? 'bg-rose-950 text-rose-300 border-rose-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                }`}>
                  {currentQ.difficulty}
                </span>
              </div>

              {/* Clinical Scenario (if applicable) */}
              {currentQ.scenario && (
                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 italic leading-relaxed">
                  📋 <strong>Clinical Vignette:</strong> {currentQ.scenario}
                </div>
              )}

              {/* Question Stem */}
              <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                {currentQ.question}
              </h3>

              {/* MCQ Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;
                  const isWrong = isSelected && !isCorrect;

                  let buttonStyle = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

                  if (showExplanation) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500';
                    } else if (isWrong) {
                      buttonStyle = 'bg-rose-950/90 border-rose-500 text-rose-100 shadow-md shadow-rose-950/40';
                    }
                  } else if (isSelected) {
                    buttonStyle = 'bg-blue-950 border-blue-500 text-white';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={quizSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs md:text-sm transition flex items-start gap-3 cursor-pointer ${buttonStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5 border ${
                        showExplanation && isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : showExplanation && isWrong
                          ? 'bg-rose-500 text-white border-rose-400'
                          : isSelected
                          ? 'bg-blue-600 text-white border-blue-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{option}</span>
                      {showExplanation && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      )}
                      {showExplanation && isWrong && (
                        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation Drawer */}
            {showExplanation && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Clinical Rationale &amp; Evidence:
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Official Board Reference
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[12px]">
                  {currentQ.explanation}
                </p>
                <div className="text-[11px] text-blue-400 font-mono pt-1 border-t border-slate-900 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Source: {currentQ.citation}</span>
                </div>
              </div>
            )}

            {/* Bottom Stepper Buttons */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 transition"
              >
                Previous Question
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < filteredQuestions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-blue-600/30"
                  >
                    Next Question
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/30"
                  >
                    Complete &amp; Submit Exam
                    <Award className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Quiz Summary & Progress Tracker */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Board Exam Scorecard
                </h4>
                <p className="text-xs text-slate-400">
                  Real-time exam tracking for senior dental students.
                </p>
              </div>

              {/* Score Display Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                <div className="text-xs text-slate-400">Current Score</div>
                <div className="text-4xl font-extrabold text-blue-400 font-mono">
                  {scoreData.percentage}%
                </div>
                <div className="text-xs text-slate-500">
                  {scoreData.correct} correct out of {filteredQuestions.length} questions
                </div>
                <div className="text-[11px] text-cyan-400 font-medium">
                  {answeredCount} of {filteredQuestions.length} answered
                </div>
              </div>

              {/* Question Navigation Bubbles */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Question Grid:</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {filteredQuestions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isCorrect = selectedAnswers[q.id] === q.correctIndex;
                    const isCurrent = currentIndex === idx;

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setShowExplanation(isAnswered);
                        }}
                        className={`p-2 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center border ${
                          isCurrent
                            ? 'ring-2 ring-blue-400 bg-blue-900 text-white border-blue-400'
                            : isAnswered
                            ? isCorrect
                              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                              : 'bg-rose-950 border-rose-500 text-rose-300'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit / Reset Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
                >
                  Submit &amp; View Board Evaluation
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-center text-slate-400">
          No questions found for the selected topic.
        </div>
      )}
    </div>
  );
};
