import React, { useState, useEffect } from 'react';
import { PermanentToothData, getAllPermanentTeeth } from '../data/permanentTeethData';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  AlertTriangle,
  Award,
  Sparkles,
  MousePointer,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'landmark_id' | 'click_on_model';
  prompt: string;
  options?: string[];
  correctOptionIndex?: number;
  correctAnswer: string;
  explanation: string;
  distractorExplanations?: string[];
  weakTopicCategory: string;
  targetLandmarkName?: string;
}

interface AnatomyQuizModalProps {
  currentTooth: PermanentToothData;
  isOpen: boolean;
  onClose: () => void;
  onRecordScore: (fdi: number, score: number, weakTopics: string[]) => void;
  onSwitchToothForQuiz: (tooth: PermanentToothData) => void;
}

export const AnatomyQuizModal: React.FC<AnatomyQuizModalProps> = ({
  currentTooth,
  isOpen,
  onClose,
  onRecordScore,
  onSwitchToothForQuiz
}) => {
  if (!isOpen) return null;

  const allTeeth = getAllPermanentTeeth();
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('intermediate');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [weakTopicsList, setWeakTopicsList] = useState<string[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Generate 5 questions tailored to current tooth and difficulty
  const generateQuestions = (tooth: PermanentToothData, diff: QuizDifficulty): QuizQuestion[] => {
    const qList: QuizQuestion[] = [];

    // Q1: Identification using FDI / Universal
    qList.push({
      id: 'q1-fdi',
      type: 'multiple_choice',
      prompt: `Identify the 3D tooth currently under examination using FDI Two-Digit Notation:`,
      options: [
        `Tooth #${tooth.fdi} (${tooth.name})`,
        `Tooth #${tooth.fdi > 40 ? tooth.fdi - 10 : tooth.fdi + 10} (${tooth.arch === 'Maxillary' ? 'Mandibular' : 'Maxillary'} counterpart)`,
        `Tooth #${tooth.fdi % 10 === 8 ? tooth.fdi - 1 : tooth.fdi + 1} (Adjacent Tooth)`,
        `Tooth #${tooth.fdi > 20 && tooth.fdi < 30 ? tooth.fdi - 10 : tooth.fdi + 10} (Opposing Quadrant)`
      ],
      correctOptionIndex: 0,
      correctAnswer: `Tooth #${tooth.fdi} (${tooth.name})`,
      explanation: `Correct! Tooth #${tooth.fdi} is the ${tooth.name} (${tooth.quadrantName}, Universal #${tooth.universal}).`,
      distractorExplanations: [
        `Correct answer.`,
        `Incorrect arch/quadrant. Observe the crown dimensions and cusp arrangement.`,
        `Adjacent teeth exhibit different occlusal/incisal line angles.`,
        `Contralateral or opposing quadrant has inverted cusp heights.`
      ],
      weakTopicCategory: 'Tooth Numbering & FDI Identification'
    });

    // Q2: Arch & Side Determination
    const sideQuestionOptions = [
      `${tooth.arch} Arch, ${tooth.side} Side`,
      `${tooth.arch === 'Maxillary' ? 'Mandibular' : 'Maxillary'} Arch, ${tooth.side} Side`,
      `${tooth.arch} Arch, ${tooth.side === 'Right' ? 'Left' : 'Right'} Side`,
      `${tooth.arch === 'Maxillary' ? 'Mandibular' : 'Maxillary'} Arch, ${tooth.side === 'Right' ? 'Left' : 'Right'} Side`
    ];

    qList.push({
      id: 'q2-arch-side',
      type: 'multiple_choice',
      prompt: `Based on crown morphology, cusp slope asymmetry, and CEJ curvature, which arch and side does this tooth belong to?`,
      options: sideQuestionOptions,
      correctOptionIndex: 0,
      correctAnswer: sideQuestionOptions[0],
      explanation: `Correct! The ${tooth.arch} arch is confirmed by the ${tooth.crownDimensions.buccolingualMm > tooth.crownDimensions.mesiodistalMm ? 'greater buccolingual thickness' : 'mesiodistal incisal width'}, and the ${tooth.side} side is determined by proximal contact heights and line angle rounding.`,
      weakTopicCategory: 'Arch & Side Differentiation'
    });

    // Q3: Root & Canal Configuration (Endodontics)
    qList.push({
      id: 'q3-canals',
      type: 'multiple_choice',
      prompt: `How many roots and root canals are typically expected for this tooth according to clinical endodontic anatomy?`,
      options: [
        `${tooth.expectedRoots} Root(s) and ${tooth.expectedCanals}`,
        `1 Root with 1 single canal (Type I only in 100%)`,
        `3 Roots with 4 canals (MB1, MB2, DB, Palatal)`,
        `2 Divergent Roots with 5 canals`
      ],
      correctOptionIndex: 0,
      correctAnswer: `${tooth.expectedRoots} Root(s) and ${tooth.expectedCanals}`,
      explanation: `Correct! In ${tooth.name}, clinical anatomy typically reveals ${tooth.expectedRoots} root(s) with ${tooth.expectedCanals} (Vertucci: ${tooth.vertucciClass}).`,
      weakTopicCategory: 'Endodontic Canal Anatomy'
    });

    // Q4: Distinguishing Feature vs Neighbor
    const comp = tooth.comparisons && tooth.comparisons[0] ? tooth.comparisons[0] : null;
    const diffText = comp ? comp.differences[0] : tooth.identifyingFeatures[0];

    qList.push({
      id: 'q4-distinguishing',
      type: 'multiple_choice',
      prompt: `Which clinical anatomical feature reliably distinguishes this tooth from its neighboring counterpart on board examinations?`,
      options: [
        diffText,
        `Complete absence of developmental grooves or marginal ridges`,
        `Identical symmetrical 90-degree line angles on both mesial and distal sides`,
        `Presence of 4 equal roots with no apical curvature`
      ],
      correctOptionIndex: 0,
      correctAnswer: diffText,
      explanation: `Correct! ${diffText} is a textbook criteria cited in Wheeler's Dental Anatomy and clinical board examinations.`,
      weakTopicCategory: 'Comparative Anatomical Diagnosis'
    });

    // Q5: Landmark Identification
    const primaryLandmark = tooth.landmarks[0] || { name: 'Cervical Line (CEJ)', clinicalSignificance: 'Biological width reference' };
    qList.push({
      id: 'q5-landmark',
      type: 'multiple_choice',
      prompt: `Identify the critical anatomical landmark highlighted on this specimen: "${primaryLandmark.name}". What is its primary clinical significance?`,
      options: [
        primaryLandmark.clinicalSignificance,
        `Provides attachment for the mylohyoid muscle`,
        `Forms the floor of the maxillary sinus in 100% of cases`,
        `Acts as a non-keratinized mucous membrane boundary`
      ],
      correctOptionIndex: 0,
      correctAnswer: primaryLandmark.clinicalSignificance,
      explanation: `Correct! ${primaryLandmark.name}: ${primaryLandmark.clinicalSignificance}.`,
      weakTopicCategory: 'Landmarks & Clinical Significance'
    });

    return qList;
  };

  useEffect(() => {
    const q = generateQuestions(currentTooth, difficulty);
    setQuestions(q);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setWeakTopicsList([]);
    setIsQuizComplete(false);
  }, [currentTooth, difficulty]);

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted || !currentQ) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctOptionIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      if (!weakTopicsList.includes(currentQ.weakTopicCategory)) {
        setWeakTopicsList((prev) => [...prev, currentQ.weakTopicCategory]);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished
      setIsQuizComplete(true);
      const finalScore = score + (selectedOption === currentQ.correctOptionIndex ? 1 : 0);
      onRecordScore(currentTooth.fdi, finalScore, weakTopicsList);

      if (finalScore >= 4) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    const q = generateQuestions(currentTooth, difficulty);
    setQuestions(q);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setWeakTopicsList([]);
    setIsQuizComplete(false);
  };

  const handleRandomToothQuiz = () => {
    const randomIdx = Math.floor(Math.random() * allTeeth.length);
    onSwitchToothForQuiz(allTeeth[randomIdx]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>Anatomy Mastery Quiz Simulator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Board Mode
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Testing {currentTooth.name} (FDI #{currentTooth.fdi})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Difficulty Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              {(['beginner', 'intermediate', 'advanced'] as QuizDifficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition ${
                    difficulty === d
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quiz Body */}
        {!isQuizComplete ? (
          <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-4">
            {/* Question Progress Bar */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">
                Question {currentQIndex + 1} of {questions.length}
              </span>
              <span className="font-mono text-purple-400 font-bold">
                Score: {score} / {questions.length}
              </span>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Prompt */}
            {currentQ && (
              <div className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm font-semibold text-white leading-relaxed">
                  {currentQ.prompt}
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2">
                  {currentQ.options?.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctOptionIndex;

                    let btnClass = 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300';
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-purple-600/30 border-purple-400 text-white ring-1 ring-purple-400';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all duration-150 ${btnClass}`}
                      >
                        <span className="pr-3 leading-relaxed">{opt}</span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card after Submission */}
                {isAnswerSubmitted && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-200 ${
                      selectedOption === currentQ.correctOptionIndex
                        ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {selectedOption === currentQ.correctOptionIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Correct Rationale:</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <span>Incorrect. Clinical Explanation:</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-200">{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results Summary Screen */
          <div className="p-6 text-center space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mx-auto">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Quiz Completed!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Evaluation for {currentTooth.name} ({difficulty} level)
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-sm mx-auto space-y-2">
              <div className="text-3xl font-black text-white font-mono">
                {score} <span className="text-sm font-normal text-slate-400">/ {questions.length}</span>
              </div>
              <div className="text-xs font-semibold text-purple-300">
                Score: {Math.round((score / questions.length) * 100)}% Mastery
              </div>
            </div>

            {/* Weak Areas Detected */}
            {weakTopicsList.length > 0 ? (
              <div className="bg-slate-950/60 p-4 rounded-xl border border-amber-800/40 text-left max-w-md mx-auto space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Identified Weak Topics for Review:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {weakTopicsList.map((topic, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl max-w-md mx-auto text-xs text-emerald-300">
                Outstanding! No weak areas detected on this tooth examination.
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={handleRestartQuiz}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Retake Quiz
              </button>

              <button
                onClick={handleRandomToothQuiz}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5 transition shadow-lg shadow-purple-600/20"
              >
                <Sparkles className="w-3.5 h-3.5" /> Quiz Another Tooth
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        {!isQuizComplete && (
          <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
            <span className="text-xs text-slate-500">
              {isAnswerSubmitted ? 'Click Next to continue' : 'Select an answer to submit'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs transition shadow-md"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md"
              >
                <span>{currentQIndex === questions.length - 1 ? 'View Results' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
