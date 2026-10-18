import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CPG_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "According to Dr. Alaa Omran's lecture, what is the primary definition of a Clinical Practice Guideline (CPG)?",
    options: [
      "A binding legal mandate enforced by hospital regulatory bodies",
      "A framework based on the highest level of available evidence, assisting the clinician in decision-making to support best practices",
      "A textbook summary of historic surgical flap procedures from the 1970s",
      "An automated software algorithm designed to replace clinical periodontal examination"
    ],
    correctIndex: 1,
    explanation: "As stated on page 1 of the lecture: 'A clinical practice guideline (CPG) is a framework based on the highest level of available evidence, assisting the clinician in the decision-making process to support best practices.'"
  },
  {
    id: 2,
    question: "In which group of periodontitis patients must the First Step of therapy (behavior and risk factor modification) be conducted?",
    options: [
      "Only in Stage I periodontitis patients",
      "Only in patients presenting with systemic risk factors like smoking or diabetes",
      "It is conducted in ALL periodontitis patients",
      "Only in surgical candidates prior to regenerative grafting"
    ],
    correctIndex: 2,
    explanation: "Page 1 explicitly highlights: 'First step of therapy... It conducted in all periodontitis patient.' It forms the mandatory foundation for everyone."
  },
  {
    id: 3,
    question: "What are the exact clinical 'End points of therapy' at the re-evaluation of the 2nd step to proceed directly to Supportive Periodontal Care (SPC)?",
    options: [
      "Complete 100% elimination of all probing depths to ≤ 1 mm",
      "No periodontal pocket > 4mm with BOP, and no deep periodontal pocket > 6mm",
      "BOP score below 50% regardless of pocket depths",
      "Regeneration of all horizontal bone defects on post-op bitewings"
    ],
    correctIndex: 1,
    explanation: "Page 1 & 2 confirm: End points of therapy: 'no periodontal pocket > 4mm with BOP' and 'No deep periodontal pocket > 6mm'. If achieved, the patient proceeds to SPC."
  },
  {
    id: 4,
    question: "When should periodontal re-evaluation after the second step of therapy (subgingival instrumentation) be performed?",
    options: [
      "Immediately at 1 week post-scaling",
      "At 4–8 weeks (or 4–6 weeks) post-subgingival instrumentation",
      "At 6 months to 1 year post-treatment",
      "Re-evaluation is only needed after surgical intervention"
    ],
    correctIndex: 1,
    explanation: "In both lecture text and case scenarios: 'Periodontal re-evaluation 4–8 weeks after subgingival instrumentation' allows sufficient soft tissue healing and re-establishment of junctional epithelium."
  },
  {
    id: 5,
    question: "According to the guideline, what is the mandatory recall interval for Supportive Periodontal Care (SPC)?",
    options: [
      "Once every 12 months",
      "Every 6 months only if calculus returns",
      "Every 3 months interval",
      "Only when the patient develops pain or bleeding"
    ],
    correctIndex: 2,
    explanation: "Page 2 explicitly states: 'SPC is performed every 3months interval'. This frequency is critical to prevent disease recurrence and detect repocketing early."
  },
  {
    id: 6,
    question: "In Case Scenario 1 (67-year-old female), what is the calculated % bone loss / age and corresponding grade?",
    options: [
      "30 / 67 = 0.45, confirming Grade B (Moderate rate)",
      "30 / 67 = 0.45, confirming Grade C (Rapid rate)",
      "15 / 67 = 0.22, confirming Grade A (Slow rate)",
      "50 / 67 = 0.74, confirming Grade A"
    ],
    correctIndex: 0,
    explanation: "Page 4 findings: '% bone loss / age = 30/67 = 0.45'. Values between 0.25 and 1.0 indicate Grade B (Moderate rate of progression)."
  },
  {
    id: 7,
    question: "In Case Scenario 1, what mucogingival surgical procedure was indicated in the Third Step of therapy for tooth #20?",
    options: [
      "Gingivectomy for pocket elimination",
      "Connective tissue graft (CTG) to increase attached keratinized tissue",
      "Extraction and immediate implant placement",
      "Crown lengthening surgery"
    ],
    correctIndex: 1,
    explanation: "Tooth #20 exhibited inadequate keratinized gingiva and recession. In Step 3, 'Connective tissue graft to increase attached keratinized tissue for tooth # 20' was performed alongside implant placement for #14 and #15."
  },
  {
    id: 8,
    question: "In Case Scenario 2 (41-year-old African male smoker), % bone loss / age was 50 / 41 = 1.22. What was the periodontal diagnosis?",
    options: [
      "Localized Stage II Grade B Periodontitis",
      "Generalized Stage III Grade C Periodontitis",
      "Stage I Grade A Gingivitis",
      "Stage IV Grade B Periodontitis"
    ],
    correctIndex: 1,
    explanation: "Because % bone loss / age = 1.22 (> 1.0) and he smokes 5 cigarettes/day, he is Grade C. Attachment loss ≥ 5mm (34.4% of dentition) makes it Generalized Stage III."
  },
  {
    id: 9,
    question: "In Case Scenario 2, why were teeth #16 and #17 planned for extraction during Step 3 surgical therapy?",
    options: [
      "Patient requested removal for aesthetic reasons",
      "Both teeth showed Grade II mobility and severe bone loss (90% vertical on #17), having a hopeless prognosis",
      "Recurrent caries into the pulp chamber",
      "Orthodontic space creation alone"
    ],
    correctIndex: 1,
    explanation: "Key findings: 'Teeth # 16 and 17 showed mobility grade II' and 'Teeth # 16 and 17 have a hopeless prognosis and are planned for extraction' in conjunction with quadrant surgery."
  },
  {
    id: 10,
    question: "What specific surgical approach was indicated for the mandibular left quadrant around tooth #18 in Case 2?",
    options: [
      "Apically positioned flap with osseous resective surgery",
      "Regenerative periodontal surgery for the 4 mm vertical intrabony defect on the mesial of #18",
      "Hemisection of tooth #18",
      "No surgery needed because pockets were < 3mm"
    ],
    correctIndex: 1,
    explanation: "Radiographic findings showed a vertical intrabony defect of 4 mm on the mesial of #18. Step 3 specified: 'Regenerative periodontal surgery for mandibular left quadrant (if the intrabony defect on the mesial of # 18 is favorable for regenerative therapy) in conjunction with extraction of tooth # 17'."
  }
];

export const CpgQuizModule: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleCalculateScore = () => {
    setShowResults(true);
    const score = CPG_QUESTIONS.reduce((acc, q) => {
      return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);

    if (score >= 8) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const score = CPG_QUESTIONS.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="bg-[#0b1736] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              Self-Assessment
            </span>
            <span className="text-xs text-slate-400">Dr. Alaa Omran CPG Examination</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-purple-400" />
            CPG Clinical Mastery Quiz
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Test your command of the 4 steps of periodontal therapy, re-evaluation thresholds, and clinical scenario management.
          </p>
        </div>

        {/* Progress & Submit Widget */}
        <div className="flex items-center gap-3">
          {!showResults ? (
            <button
              onClick={handleCalculateScore}
              disabled={answeredCount === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                answeredCount === CPG_QUESTIONS.length
                  ? 'bg-[#C9A24B] hover:bg-[#dfbe6e] text-slate-950 shadow-lg shadow-[#C9A24B]/20'
                  : answeredCount > 0
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Submit Answers ({answeredCount}/{CPG_QUESTIONS.length})</span>
            </button>
          ) : (
            <button
              onClick={handleResetQuiz}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-2 border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Score Banner when results shown */}
      {showResults && (
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          score >= 8
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            : score >= 5
            ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
            : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
        }`}>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              Clinical Assessment Result
            </div>
            <div className="text-xl font-black text-white mt-0.5">
              You scored {score} out of {CPG_QUESTIONS.length} ({Math.round((score / CPG_QUESTIONS.length) * 100)}%)
            </div>
            <p className="text-xs mt-1">
              {score >= 8
                ? 'Outstanding! You have mastered Dr. Alaa Omran’s Clinical Practice Guideline principles.'
                : 'Good effort! Review the detailed rationales below to reinforce the 4 steps and case calculations.'}
            </p>
          </div>

          <div className="text-3xl font-black font-mono shrink-0">
            {score}/{CPG_QUESTIONS.length}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {CPG_QUESTIONS.map((q, idx) => {
          const userAnswer = selectedAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                showResults
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/15'
                    : 'border-rose-500/40 bg-rose-950/15'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-relaxed">
                    {q.question}
                  </h4>
                </div>

                {showResults && (
                  <div>
                    {isCorrect ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {q.options.map((opt, oIdx) => {
                  const isSelected = userAnswer === oIdx;
                  const isCorrectOption = oIdx === q.correctIndex;

                  let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800';

                  if (showResults) {
                    if (isCorrectOption) {
                      btnStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-200 font-bold ring-1 ring-emerald-500';
                    } else if (isSelected && !isCorrectOption) {
                      btnStyle = 'border-rose-500 bg-rose-950/30 text-rose-300 line-through';
                    }
                  } else if (isSelected) {
                    btnStyle = 'border-[#C9A24B] bg-[#C9A24B]/15 text-[#C9A24B] font-bold ring-1 ring-[#C9A24B]';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      disabled={showResults}
                      className={`p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2 ${btnStyle}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-current text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Dropdown / Box when results revealed */}
              {showResults && (
                <div className="mt-3.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-[#C9A24B] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Clinical Lecture Rationale (Dr. Alaa Omran):
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
