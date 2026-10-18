/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuizQuestion } from '../../types/ortho';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, BookOpen } from 'lucide-react';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    lecture: 'Lecture 1 & 2',
    question: 'What are the three essential elements comprising the orthodontic assessment database?',
    options: [
      'Taking a full history, undertaking a clinical examination, and collecting appropriate diagnostic records',
      'Cephalometric analysis, dental model scanning, and tooth extraction planning',
      'Questionnaire completion, archwire bending, and bracket bonding',
      'Facial photography, alginate impressions, and soft tissue palpation only',
    ],
    correctAnswerIndex: 0,
    explanation: 'As stated on Page 1 of Lecture 1 & 2, the three elements of the database are: 1) Taking a full history, 2) Undertaking a clinical examination, and 3) Collecting appropriate records.',
    referencePage: 'Lecture 1 & 2, Page 1',
  },
  {
    id: 2,
    lecture: 'Lecture 1 & 2',
    question: 'In assessing facial convexity between upper face (glabella to subnasale) and lower face (subnasale to pogonion), what is the normal mean angle?',
    options: [
      '12° ± 4°',
      '2° ± 1°',
      '25° ± 5°',
      '0° (flat plane)',
    ],
    correctAnswerIndex: 0,
    explanation: 'The mean value for the angle of facial convexity is 12° ± 4°. An increased angle indicates a convex profile (Skeletal Class II), while a decreased or negative angle indicates a concave profile (Skeletal Class III).',
    referencePage: 'Lecture 1 & 2, Page 7',
  },
  {
    id: 3,
    lecture: 'Lecture 1 & 2',
    question: 'What is the definition of the "Zero Meridian" in orthodontic anteroposterior assessment?',
    options: [
      'The true vertical line dropped from the soft tissue nasion',
      'The horizontal line connecting porion to orbitale',
      'The line passing through the anterior and posterior nasal spines',
      'The vertical line dropped from the tip of the nose to the chin',
    ],
    correctAnswerIndex: 0,
    explanation: 'Zero meridian is the true vertical line dropped from the soft tissue nasion. In a Class I relationship, the upper lip lies on or slightly anterior to this line and the chin point lies slightly behind it.',
    referencePage: 'Lecture 1 & 2, Page 6',
  },
  {
    id: 4,
    lecture: 'Lecture 1 & 2',
    question: 'Where do the mandibular plane and Frankfort horizontal plane intersect in a patient with normal vertical facial proportions?',
    options: [
      'At the occiput',
      'Anterior to the occiput',
      'Posterior to the occiput',
      'At the temporomandibular joint condyle',
    ],
    correctAnswerIndex: 0,
    explanation: 'The angle is considered normal if the lines intersect at the occiput. If they intersect anterior to the occiput, the angle is increased (high angle/long face). If posterior, the angle is decreased (low angle/short face).',
    referencePage: 'Lecture 1 & 2, Page 9',
  },
  {
    id: 5,
    lecture: 'Lecture 1 & 2',
    question: 'Which abnormal oral habit is specifically noted to predispose to an increased risk of orthodontic root resorption?',
    options: [
      'Nail biting',
      'Tongue resting against palate',
      'Mouth breathing during sleep',
      'Chewing sugar-free gum',
    ],
    correctAnswerIndex: 0,
    explanation: 'Page 4 notes that habits like nail biting generate heavy intermittent axial forces that may predispose teeth to an increased risk of apical root resorption during active orthodontic movement.',
    referencePage: 'Lecture 1 & 2, Page 4',
  },
  {
    id: 6,
    lecture: 'Lecture 3',
    question: 'How is Centric Relation (CR) clinically defined compared to Centric Occlusion (CO)?',
    options: [
      'CR is a joint-determined position where mandibular condyles are in their most superior position, independent of tooth contact',
      'CR is determined strictly by maximum intercuspation of teeth',
      'CR and CO are completely identical anatomical positions in all patients',
      'CR occurs only during maximum wide opening of the mouth',
    ],
    correctAnswerIndex: 0,
    explanation: 'Centric Relation (CR) is a joint-determined relationship where condyles are in their most superior position against the articular eminence, independent of tooth contact. Centric Occlusion (CO) is tooth-determined maximum intercuspation.',
    referencePage: 'Lecture 3, Page 1',
  },
  {
    id: 7,
    lecture: 'Lecture 3',
    question: 'What is the molar relationship in Angle’s "Normal Occlusion"?',
    options: [
      'Mesiobuccal cusp of maxillary 1st molar occludes in the buccal groove of mandibular 1st molar',
      'Distobuccal cusp of maxillary 1st molar occludes in the buccal groove of mandibular 1st molar',
      'Mesiobuccal cusp of maxillary 1st molar occludes in the embrasure of premolars',
      'Maxillary and mandibular molars occlude in a cusp-to-cusp relationship',
    ],
    correctAnswerIndex: 0,
    explanation: 'Angle defined normal occlusion as: the mesiobuccal cusp of the maxillary molar occludes in the buccal groove of the mandibular molar, and teeth are arranged along a smoothly curving line of occlusion.',
    referencePage: 'Lecture 3, Page 3',
  },
  {
    id: 8,
    lecture: 'Lecture 3',
    question: 'In Andrews’ Key 1 of occlusion, what critical relationship occurs between the first and second molars beyond Angle’s definition?',
    options: [
      'Distal marginal ridge of upper 1st molar occludes with mesial marginal ridge of lower 2nd molar',
      'Mesial marginal ridge of upper 1st molar occludes with distal marginal ridge of lower 1st molar',
      'Palatal cusp of upper 1st molar completely discludes from lower molars',
      'Crown of lower 2nd molar is tipped lingually by 45 degrees',
    ],
    correctAnswerIndex: 0,
    explanation: 'Andrews Key 1 specifies that the distal marginal ridge of the upper first permanent molar must occlude with the mesial marginal ridge of the lower second permanent molar, ensuring proper crown angulation and preventing Class II tendency.',
    referencePage: 'Lecture 3, Page 4',
  },
  {
    id: 9,
    lecture: 'Lecture 3',
    question: 'What constitutes "Mutually Protected Occlusion" during mandibular excursion movements?',
    options: [
      'Anterior teeth guide and disclude posterior teeth in protrusion and lateral excursion; posterior teeth protect anteriors in centric occlusion',
      'Posterior teeth absorb all lateral forces while anterior teeth remain open',
      'All teeth maintain continuous simultaneous contact throughout all functional movements',
      'Canine teeth never contact during masticatory cycles',
    ],
    correctAnswerIndex: 0,
    explanation: 'Mutually protected occlusion achieves anterior guidance (incisal and canine guidance) causing posterior disclusion in excursions, while simultaneous bilateral contacts of posterior teeth protect anterior teeth in centric occlusion.',
    referencePage: 'Lecture 3, Page 5',
  },
  {
    id: 10,
    lecture: 'Lecture 1 & 2',
    question: 'Under the legal principle of "Gillick Competence", what applies to orthodontic patients under 16 years of age?',
    options: [
      'A child under 16 can give valid consent if they fully comprehend the treatment, and a parent cannot override this decision',
      'No patient under 18 years of age is ever permitted to sign any consent form',
      'Parents can force a child into treatment even if the child refuses and resists',
      'Consent is only required for surgical orthognathic procedures, not braces',
    ],
    correctAnswerIndex: 0,
    explanation: 'Gillick competence establishes that patients under 16 who have sufficient maturity and intelligence to understand the proposed orthodontic treatment and its implications can provide legal consent, which cannot be overridden by parents.',
    referencePage: 'Lecture 1 & 2, Page 15',
  },
];

export const ExamQuizModule: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const question = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [question.id]: idx });
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    setIsSubmitted(true);
    const correctCount = QUIZ_QUESTIONS.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswerIndex
    ).length;
    if (correctCount >= 8) {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#0B1F4D', '#1B3A8C', '#C9A24B', '#DFC17B'],
      });
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
  };

  const score = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctAnswerIndex
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#C9A24B]/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#DFC17B] uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#C9A24B]" />
            <span>5th Year Orthodontics Board Examination Review</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1">
            Orthodontics Board Mastery Examination
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Test your knowledge across Lectures 1, 2, and 3: clinical history, 3D examination planes, occlusion gold standards, Andrews' keys, and legal consent.
          </p>
        </div>

        {isSubmitted && (
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#DFC17B]" />
            <span>Restart Quiz</span>
          </button>
        )}
      </div>

      {/* Score Summary Box */}
      {isSubmitted && (
        <div className="glass-panel text-white p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-[#C9A24B] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider">Examination Outcome</span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Score: {score} / {QUIZ_QUESTIONS.length} ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
            </h2>
            <p className="text-xs text-slate-300">
              {score >= 8
                ? 'Outstanding performance! You have mastered the core concepts of orthodontic history, clinical examination, and occlusion.'
                : 'Good effort! Review the detailed answer explanations and reference citations below to solidify your understanding.'}
            </p>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-[#C9A24B] text-[#071330] flex items-center justify-center text-3xl font-black shrink-0 shadow-lg">
            {Math.round((score / QUIZ_QUESTIONS.length) * 100)}%
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="glass-panel rounded-3xl border border-[#C9A24B]/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider">
            Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <span className="text-xs font-bold text-slate-300 bg-[#071330]/80 px-3 py-1 rounded-md border border-white/10">
            {question.lecture}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswers[question.id] === idx;
            const isCorrect = idx === question.correctAnswerIndex;
            let optionStyle = 'border-white/10 bg-[#071330]/70 text-slate-300 hover:border-white/30';

            if (isSubmitted) {
              if (isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-200 font-bold';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'border-rose-500 bg-rose-950/60 text-rose-200';
              }
            } else if (isSelected) {
              optionStyle = 'border-[#C9A24B] bg-[#C9A24B]/20 text-white font-bold shadow-lg';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl border-2 text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${optionStyle}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  isSelected && !isSubmitted ? 'bg-[#C9A24B] text-[#071330]' : 'bg-white/10 text-slate-300'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed">{option}</span>
                {isSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation */}
        {isSubmitted && (
          <div className="p-4 bg-[#071330]/80 rounded-xl border border-white/10 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#DFC17B]">
              <BookOpen className="w-4 h-4 text-[#C9A24B]" />
              <span>Explanation & Reference:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
            <span className="inline-block text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded border border-white/10">
              Source: {question.referencePage}
            </span>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Next
              </button>
            ) : (
              !isSubmitted && (
                <button
                  onClick={handleFinish}
                  disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] shadow-lg hover:shadow-xl disabled:opacity-40 transition-all"
                >
                  Submit & View Results
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
