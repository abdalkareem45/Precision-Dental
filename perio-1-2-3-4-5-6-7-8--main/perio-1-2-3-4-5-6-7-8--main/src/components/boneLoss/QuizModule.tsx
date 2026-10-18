import React, { useState } from 'react';
import { QuizQuestion } from './types';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight,
  TrendingDown,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: 'clinical',
    question: 'According to the lecture, what does the existing bone level in a periodontitis patient fundamentally represent?',
    options: [
      'The current severity of active tissue ulceration and pocket suppuration',
      'The consequence of past pathologic episodes',
      'The patient’s immediate genetic predisposition to anaerobic biofilm',
      'The precise millimeter depth of the soft tissue periodontal pocket'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 1 states: "Therefore the existing bone level is the consequence of past pathologic episodes, whereas changes present in the soft tissue of the pocket wall reflect the presence of the inflammatory condition."',
    pdfPage: 1,
    category: 'Fundamentals'
  },
  {
    id: 2,
    type: 'numerical',
    question: 'In the 2017 study by Rana, Yauney et al., what wavelength of light irradiation was used to distinguish inflamed from healthy gums via porphyrin fluorescence?',
    options: ['300–350 nm', '405–450 nm', '520–580 nm', '650–700 nm'],
    correctIndex: 1,
    explanation:
      'PDF Pages 2 & 17 state: "After irradiation with light of 405-450 nm wavelength, the corresponding fluorescence from biomarker porphyrin was recorded using an oral imaging device."',
    pdfPage: 2,
    category: 'AI in Perio'
  },
  {
    id: 3,
    type: 'classification',
    question: 'According to Seymour and colleagues, how do T and B lymphocytes characterize the progression from contained gingivitis to destructive periodontitis?',
    options: [
      'Contained gingivitis is dominated by B lymphocytes; destructive periodontitis is dominated by T lymphocytes',
      'Contained gingivitis has T lymphocytes preponderant; conversion to a B-lymphocyte lesion becomes progressively destructive',
      'Both lesions have identical lymphocyte ratios but differing mast cells',
      'T lymphocytes disappear entirely in all stages of periodontal inflammation'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 3 states: "Seymour and colleagues have postulated a stage of “contained” gingivitis, in which T lymphocytes are preponderant; they suggest that, as the lesion becomes a B-lymphocyte lesion, it becomes progressively destructive."',
    pdfPage: 3,
    category: 'Histology'
  },
  {
    id: 4,
    type: 'true-false',
    question: 'True or False: Bone destruction in periodontal disease is primarily a process of bone necrosis involving non-viable dead bone.',
    options: [
      'True (Bone tissue undergoes liquefactive and ischemic necrosis)',
      'False (It involves the activity of living cells along viable bone)'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 5 explicitly states: "Bone destruction in periodontal disease is not a process of bone necrosis. It involves the activity of living cells along viable bone. With the exception of necrotic bone in NUP and BRONJ, all bone present in periodontitis is viable, live bone."',
    pdfPage: 5,
    category: 'Fundamentals'
  },
  {
    id: 5,
    type: 'numerical',
    question: 'According to Page and Schroeder’s "Radius of Action", interproximal angular (vertical) defects can appear ONLY in spaces that are:',
    options: [
      'Narrower than 1.0 mm',
      'Exactly 1.5 mm',
      'Wider than 2.5 mm',
      'Any space regardless of interdental width'
    ],
    correctIndex: 2,
    explanation:
      'PDF Page 5 states: "Page and Schroeder postulated a range of effectiveness of about 1.5 mm to 2.5 mm... Interproximal angular defects can appear only in spaces that are wider than 2.5 mm. Narrower spaces would end up with horizontal bone loss."',
    pdfPage: 5,
    category: 'Rate & Distance'
  },
  {
    id: 6,
    type: 'numerical',
    question: 'In Miller et al. [2023], AI algorithms for detecting radiographic bone loss (RBL) showed what precision for mild disease vs. accuracy for staging on periapical radiographs?',
    options: [
      '95% precision for mild disease, 60% accuracy for staging',
      '25% precision for detecting mild disease, and 99% accuracy for staging of RBL',
      '50% precision for mild disease, 50% accuracy for staging',
      '75% precision for mild disease, 85% accuracy for staging'
    ],
    correctIndex: 1,
    explanation:
      'PDF Pages 6 & 17 state: "...while periapical radiographs showed a precision of 25% for detecting mild disease and a high accuracy of 99% for staging of RBL."',
    pdfPage: 6,
    category: 'AI in Perio'
  },
  {
    id: 7,
    type: 'numerical',
    question: 'In Löe and colleagues’ study on the rate of bone loss, what percentage of individuals demonstrated moderately progressive periodontal disease (0.05–0.5 mm/year)?',
    options: ['8%', '11%', '50%', '81%'],
    correctIndex: 3,
    explanation:
      'PDF Page 6 table states: "81% of individuals had moderately progressive periodontal disease with a yearly loss of attachment of 0.05 mm to 0.5 mm."',
    pdfPage: 6,
    category: 'Rate & Distance'
  },
  {
    id: 8,
    type: 'clinical',
    question: 'In the ABSENCE of inflammation (plaque), what does trauma from occlusion produce in the periodontium?',
    options: [
      'Deep infected suprabony periodontal pockets with suppuration',
      'Angular bone defects WITHOUT pocket formation (reversible if forces are removed)',
      'Immediate necrosis of the entire attached gingiva',
      'Rapid horizontal bone loss across the entire quadrant'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 7 states: "In the absence of inflammation (plaque), trauma from occlusion leads to angular defects without pocket formation... These changes are reversible in that they can be repaired if the offending forces are removed."',
    pdfPage: 7,
    category: 'Fundamentals'
  },
  {
    id: 9,
    type: 'clinical',
    question: 'Why can angular (vertical) defects NOT form in thin facial or lingual alveolar plates?',
    options: [
      'Because osteoclasts are absent in thin plates',
      'Because the entire crest of the thin plate is destroyed, reducing height in a horizontal fashion',
      'Because transseptal fibers protect facial cortical bone',
      'Because blood vessels do not penetrate cortical bone'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 8 states: "For example, angular defects cannot form in thin facial or lingual alveolar plates. In such cases, the entire crest of the plate is destroyed, and the height of the bone is reduced in a horizontal fashion."',
    pdfPage: 8,
    category: 'Morphology & Craters'
  },
  {
    id: 10,
    type: 'numerical',
    question: 'Palatal exostoses (bony outgrowths) have been reported in what percentage of human skulls?',
    options: ['10%', '25%', '40%', '75%'],
    correctIndex: 2,
    explanation:
      'PDF Page 9 states: "Palatal exostoses have been found in 40% of human skulls."',
    pdfPage: 9,
    category: 'Morphology & Craters'
  },
  {
    id: 11,
    type: 'classification',
    question: 'Buttressing bone formation that occurs on the external surface and causes bulging of the bone contour is termed:',
    options: ['Central buttressing', 'Peripheral buttressing (Lipping)', 'Internal osteosclerosis', 'Exostosis nodule'],
    correctIndex: 1,
    explanation:
      'PDF Page 9 states: "Peripheral buttressing bone formation (Lipping): It occurs on the external surface. This may cause bulging of the bone contour."',
    pdfPage: 9,
    category: 'Morphology & Craters'
  },
  {
    id: 12,
    type: 'multiple-choice',
    question: 'Which type of periodontal pocket accompanies horizontal bone loss?',
    options: [
      'Infra-bony pocket',
      'Supra-bony pocket',
      'Intrabony pocket',
      'Compound angular pocket'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 10 states: "Supra-bony pockets accompany the horizontal bone loss. Regenerative procedures with periodontal horizontal bone loss are not undertaken."',
    pdfPage: 10,
    category: 'Fundamentals'
  },
  {
    id: 13,
    type: 'classification',
    question: 'Which vertical defect classification yields the BEST results with periodontal regeneration and is frequently observed on the mesial surfaces of molars?',
    options: [
      'One-wall defect (Hemiseptum)',
      'Two-wall defect',
      'Three-wall bony defect (originally called intrabony defect)',
      'Circumferential defect'
    ],
    correctIndex: 2,
    explanation:
      'PDF Page 11 states: "Three-wall bony defect... was originally called intra bony defect. It yields the best results with periodontal regeneration. They are frequently observed on the mesial surfaces of the molars."',
    pdfPage: 11,
    category: 'Morphology & Craters'
  },
  {
    id: 14,
    type: 'classification',
    question: 'A vertical defect with only ONE bony wall remaining facing the involved tooth surface is known as:',
    options: ['Intrabony defect', 'Hemiseptum (One-wall defect)', 'Osseous crater', 'Circumferential moat'],
    correctIndex: 1,
    explanation:
      'PDF Page 11 states: "One-wall bony defect / Hemiseptum: Only one bony wall remains facing the involved tooth surface. It occurs generally when considerable amount of interdental septum is lost."',
    pdfPage: 11,
    category: 'Morphology & Craters'
  },
  {
    id: 15,
    type: 'numerical',
    question: 'Osseous craters account for what percentage of all periodontal bone defects, and what percentage of all mandibular defects?',
    options: [
      '10% of all defects, 20% of mandibular',
      '35.2% of all defects, and 62% of all mandibular defects',
      '50% of all defects, and 50% of mandibular defects',
      '85% of all defects, and 95% of mandibular defects'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 13 states: "Craters have been found to make up about one-third (35.2%) of all defects and about two-thirds (62%) of all mandibular defects."',
    pdfPage: 13,
    category: 'Morphology & Craters'
  },
  {
    id: 16,
    type: 'numerical',
    question: 'In what percentage of osseous crater cases are the heights of the facial and lingual crests identical?',
    options: ['15%', '50%', '62%', '85%'],
    correctIndex: 3,
    explanation:
      'PDF Page 13 states: "The heights of the facial and lingual crests of a crater have been found to be identical in 85% of cases, with the remaining 15% being almost equally divided between higher facial crests and higher lingual crests."',
    pdfPage: 13,
    category: 'Morphology & Craters'
  },
  {
    id: 17,
    type: 'classification',
    question: 'According to Ochsenbein’s classification, a deep osseous crater has a depth of:',
    options: ['1–2 mm', '3–4 mm', '5 mm or more', '10 mm or more'],
    correctIndex: 2,
    explanation:
      'PDF Page 13 states: "Shallow crater: 1-2mm. Medium crater: 3-4mm. Deep crater: 5mm or more."',
    pdfPage: 13,
    category: 'Morphology & Craters'
  },
  {
    id: 18,
    type: 'clinical',
    question: 'Reversed architecture (inconsistent bony margin) is produced when:',
    options: [
      'The radicular bone is lost while interdental bone is completely intact',
      'The crest of interdental bone is located apical to its midfacial and mid-lingual margins',
      'Exostoses fuse between adjoining teeth',
      'Plateau-like bone margins form on thick cortical bone'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 14 states: "Reversed architecture: When the crest of the interdental gingiva or bone is located apical to its midfacial and mid-lingual margins... thereby reversing the normal scalloped architecture."',
    pdfPage: 14,
    category: 'Morphology & Craters'
  },
  {
    id: 19,
    type: 'clinical',
    question: 'Which tooth is the MOST common site for furcation involvement, and which is the LEAST common site?',
    options: [
      'Most common: Maxillary 1st molar; Least common: Mandibular central incisor',
      'Most common: Mandibular 1st molar; Least common: Maxillary premolars',
      'Most common: Mandibular 2nd premolar; Least common: Mandibular 1st molar',
      'Most common: Maxillary premolars; Least common: Mandibular 1st molar'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 14 states: "Mandibular 1st molar are the most common site. Maxillary premolars are the least common site."',
    pdfPage: 14,
    category: 'Furcation'
  },
  {
    id: 20,
    type: 'classification',
    question: 'How is Glickman Grade III furcation involvement differentiated from Grade IV?',
    options: [
      'Grade III is cul-de-sac; Grade IV is through-and-through',
      'Grade III has total bone loss with through-and-through opening covered by gingiva; Grade IV is exposed clinically to view by gingival recession',
      'Grade III involves 3 roots; Grade IV involves 4 roots',
      'Grade III is asymptomatic; Grade IV requires immediate hemisection'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 15 states: "Grade III: total bone loss with through-and-through opening of furcation. Grade IV: Grade III with gingival recession exposing the furcation clinically to view."',
    pdfPage: 15,
    category: 'Furcation'
  },
  {
    id: 21,
    type: 'clinical',
    question: 'What special probe is specifically mandated in the lecture for the clinical diagnosis of furcation involvement?',
    options: ['Williams probe', 'UNC-15 probe', 'Nabers probe', 'WHO CPI probe'],
    correctIndex: 2,
    explanation:
      'PDF Page 15 states: "Diagnosis of Furcation involvement is made by clinical examination and careful probing with Nabers probe."',
    pdfPage: 15,
    category: 'Furcation'
  },
  {
    id: 22,
    type: 'classification',
    question: 'Allahverdi and Akcan (2019) proposed a decision support system for periodontal treatment planning based on which artificial intelligence technologies?',
    options: [
      'Random forests and k-nearest neighbors',
      'Fuzzy logic and genetic algorithms',
      'Simple linear regression',
      'Generative adversarial networks (GANs)'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 19 states: "Allahverdi and Akcan (2019) proposed a decision support system based on fuzzy logic and genetic algorithms to optimize treatment planning in periodontal therapy."',
    pdfPage: 19,
    category: 'AI in Perio'
  },
  {
    id: 23,
    type: 'multiple-choice',
    question: 'Why was the AI model for dental implant placement in the featured study trained using CBCT images rather than 2D periapical or panoramic radiographs?',
    options: [
      'CBCT scans are cheaper and produce no radiation',
      'Periapical and panoramic radiographs show higher distortion in 2D pictures than in 3D scans',
      '2D radiographs cannot show metallic implants',
      'CBCT scans cannot be analyzed by human clinicians'
    ],
    correctIndex: 1,
    explanation:
      'PDF Page 17 states: "Periapical and panoramic radiographs, for example, show higher distortion in 2D pictures than in 3D scans. Incorporating cone beam computed tomography (CBCT) images could potentially enhance the refinement of AI models... Hence, the AI model in the featured study was trained using CBCT images."',
    pdfPage: 17,
    category: 'AI in Perio'
  },
  {
    id: 24,
    type: 'clinical',
    question: 'Which systemic condition of postmenopausal women results in the loss of bone mineral content and correlates with crestal height reduction and tooth mobility?',
    options: ['Hypothyroidism', 'Osteoporosis', 'Cushing disease', 'Addison disease'],
    correctIndex: 1,
    explanation:
      'PDF Page 8 states: "Osteoporosis is a physiologic condition of postmenopausal women that results in the loss of bone mineral content as well as structural bone changes... between crestal height and residual ridge resorption; and among osteopenia and periodontitis, tooth mobility, and tooth loss."',
    pdfPage: 8,
    category: 'Fundamentals'
  }
];

export const QuizModule: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (index: number) => {
    if (userAnswers[currentQ.id] !== undefined) return; // already answered
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: index }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  // Compute final score and weak topics
  const correctCount = Object.entries(userAnswers).filter(
    ([qId, ansIdx]) => {
      const q = QUIZ_QUESTIONS.find((item) => item.id === parseInt(qId, 10));
      return q && q.correctIndex === ansIdx;
    }
  ).length;

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Category breakdown
  const categoryStats: Record<string, { total: number; correct: number }> = {};
  QUIZ_QUESTIONS.forEach((q) => {
    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { total: 0, correct: 0 };
    }
    categoryStats[q.category].total += 1;
    if (userAnswers[q.id] === q.correctIndex) {
      categoryStats[q.category].correct += 1;
    }
  });

  return (
    <div className="space-y-6 text-slate-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Senior Board Exam Quiz • 24 Verified PDF Questions
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Progress: {Object.keys(userAnswers).length} / {totalQuestions}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          Periodontology Board Knowledge Check
        </h2>
      </div>

      {!quizFinished ? (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl">
          {/* Question Metadata & Category */}
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
            <span className="font-mono text-cyan-400 font-bold bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-800">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="font-mono text-slate-400">
              Category: <strong className="text-slate-200">{currentQ.category}</strong> • PDF Page {currentQ.pdfPage}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = userAnswers[currentQ.id] === oIdx;
              const hasAnswered = userAnswers[currentQ.id] !== undefined;
              const isCorrect = currentQ.correctIndex === oIdx;

              let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
                }
              }

              return (
                <button
                  key={oIdx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs text-slate-400 shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-fadeIn text-xs">
              <div className="flex items-center gap-2 font-bold">
                {userAnswers[currentQ.id] === currentQ.correctIndex ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Incorrect
                  </span>
                )}
                <span className="text-slate-500 font-mono">• Source: PDF Page {currentQ.pdfPage}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Quiz
            </button>

            {userAnswers[currentQ.id] !== undefined && (
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                <span>{currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'View Final Score'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Results Screen */
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/20 border border-cyan-400 flex items-center justify-center text-cyan-300 mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">Quiz Evaluation Completed</h3>
            <p className="text-xs text-slate-400 font-mono">
              Score: {correctCount} / {totalQuestions} Correct ({percentage}%)
            </p>
          </div>

          {/* Performance Bar */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-1000 ${
                percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Category Breakdown */}
          <div className="text-left space-y-3 pt-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Category Mastery Breakdown:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {Object.entries(categoryStats).map(([cat, stat]) => {
                const catPct = Math.round((stat.correct / stat.total) * 100);
                return (
                  <div key={cat} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">{cat}</span>
                    <span
                      className={`font-bold ${
                        catPct >= 75 ? 'text-emerald-400' : catPct >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}
                    >
                      {stat.correct} / {stat.total} ({catPct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" /> Retake Board Exam Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
