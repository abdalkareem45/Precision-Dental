import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizItem {
  id: number;
  part: 'Part I' | 'Part II';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ALL_MED_COMP_QUESTIONS: QuizItem[] = [
  // --- PART II QUESTIONS ---
  {
    id: 1,
    part: 'Part II',
    question: "According to Dr. Maha Shukri's Part II lecture, what are the laboratory diagnostic thresholds for diabetes mellitus?",
    options: [
      "Fasting blood glucose ≥ 126 mg/dL (≥8 hrs fast) or HbA1c ≥ 6.5%",
      "Fasting glucose ≥ 80 mg/dL or HbA1c ≥ 5.0%",
      "Any non-fasting blood glucose reading above 110 mg/dL",
      "2-hour postprandial glucose under 100 mg/dL"
    ],
    correctIndex: 0,
    explanation: "Lecture Part II, pages 1 & 2: Fasting blood glucose ≥ 126 mg/dL, symptoms + non-fasting plasma glucose ≥ 200 mg/dL, or HbA1c ≥ 6.5% are diagnostic for diabetes. Normal fasting glucose is 70–100 mg/dL."
  },
  {
    id: 2,
    part: 'Part II',
    question: "What is the primary emergency management if a diabetic patient experiences hypoglycemia (insulin shock) in the dental chair?",
    options: [
      "Inject 20 units of intravenous insulin immediately",
      "Immediately terminate therapy and administer fruit juice or a glass of water and sugar / oral glucose",
      "Place patient in Trendelenburg position and perform scaling faster",
      "Give a subcutaneous injection of epinephrine"
    ],
    correctIndex: 1,
    explanation: "Lecture Part II, page 3: 'If hypoglycemia occur during periodontal treatment, therapy should be immediately terminated, and the patient should take juice or glass of water and sugar.' Common symptoms include tremors, confusion, anxiety, sweating, and tachycardia."
  },
  {
    id: 3,
    part: 'Part II',
    question: "For patients currently taking large doses of corticosteroids (> 20 mg cortisol daily) for more than one month, what is required for an extensive periodontal procedure?",
    options: [
      "Discontinue steroid therapy 2 weeks prior to appointment",
      "Double the normal daily dose one hour before the procedure",
      "Administer oral aspirin 1000 mg 1 hour before",
      "No supplementation is ever indicated"
    ],
    correctIndex: 1,
    explanation: "Lecture Part II, page 4: 'Patients taking large dose (more than 20 mg cortisol daily) for extensive dental procedure: double the normal daily dose one hour before the procedure' to prevent adrenal crisis (characterized by severe hypotension)."
  },
  {
    id: 4,
    part: 'Part II',
    question: "How should a pregnant patient be positioned in the dental chair, especially in the 3rd trimester, to prevent Supine Hypotension Syndrome?",
    options: [
      "Completely flat supine with head extended backwards",
      "Place patient on her LEFT SIDE or elevate the right hip 5–6 inches by placing a pillow or blanket roll underneath",
      "Prone face-down position",
      "Standing position throughout the appointment"
    ],
    correctIndex: 1,
    explanation: "Lecture Part II, pages 4 & 5: Supine position allows the fetus to compress the vena cava, aorta, and major vessels, causing supine hypotension syndrome. Rule: Place patient on left side or elevate right hip 5–6 inches by placing pillow or blanket roll underneath."
  },
  {
    id: 5,
    part: 'Part II',
    question: "When is the safest time to perform routine periodontal treatment (scaling, polishing, root planing) during pregnancy?",
    options: [
      "The first trimester",
      "The second trimester is the safest time for treatment, while surgical procedures should be postponed after delivery",
      "During active labor",
      "Third trimester is the only time allowed"
    ],
    correctIndex: 1,
    explanation: "Lecture Part II, page 5: 'The second trimester is the safest time for treatment (scaling, polishing, root planing) while surgical procedures should be postponed after delivery.'"
  },
  {
    id: 6,
    part: 'Part II',
    question: "If a patient has an active epileptic seizure while in the dental chair, what is the correct protocol?",
    options: [
      "Attempt to move patient to the floor immediately and force a mouth prop between their teeth",
      "Protect patient and prevent injury, do NOT move to floor, clear trays/instruments, place chair in supported supine, and turn patient to the side to maintain patent airway and prevent aspiration",
      "Perform vigorous chest compressions while patient is seizing",
      "Inject local anesthetic with epinephrine into the masseter muscle"
    ],
    correctIndex: 1,
    explanation: "Lecture Part II, page 9: In-chair seizure management: a) protect patient; b) do NOT move to floor; c) clear instruments/trays; d) chair in supported supine; e) airway maintained patent by turning patient to side to avoid aspiration; f) mouth props are never forced during a seizure!"
  },
  {
    id: 7,
    part: 'Part II',
    question: "For patients taking daily aspirin exceeding 325 mg/day, how long before periodontal surgery should it be discontinued in consultation with the physician?",
    options: [
      "2 hours before surgery",
      "At least 7 to 10 days before periodontal therapy",
      "1 month after surgery",
      "Aspirin should never be stopped under any circumstances"
    ],
    correctIndex: 1,
    explanation: "Lecture Part II, page 7: 'For patients taking more than 325 mg of aspirin per day, the drug should be discontinued at least 7 to 10 days before periodontal therapy in consultation with the physician' because aspirin irreversibly acetylates platelet COX-1 for the 7–10 day platelet lifespan."
  },
  {
    id: 8,
    part: 'Part II',
    question: "What is the threshold for defining Thrombocytopenia, and what mucosal manifestations may occur?",
    options: [
      "Platelet count < 100,000/mm³; characterized by spontaneous petechiae (small red patches) or ecchymosis (bruises)",
      "Platelet count < 500,000/mm³; characterized by enamel hypoplasia",
      "Platelet count > 1,000,000/mm³; causes hypercementosis",
      "Platelets have no relation to oral bleeding"
    ],
    correctIndex: 0,
    explanation: "Lecture Part II, page 7: 'Thrombocytopenia is defined as a platelet count < 100.000/mm³. The Purpuras could result from radiation, chemotherapy, leukemia or infections and it’s characterized by extravasations of blood... producing spontaneous petechiae or ecchymosis.'"
  },
  {
    id: 9,
    part: 'Part II',
    question: "Which medications should be strictly AVOIDED in a breastfeeding patient?",
    options: [
      "Acetaminophen and penicillins",
      "Tetracycline, ciprofloxacin, metronidazole, aspirin, vancomycin, barbiturates, and benzodiazepines",
      "Topical fluoride and chlorhexidine",
      "No medications cross into breast milk"
    ],
    correctIndex: 1,
    explanation: "Lecture Part II, page 6: 'Avoid giving tetracycline, ciprofloxacin, metronidazole, aspirin, vancomycin, barbiturates and benzodiazepines to the breast feeding patient.' The mother should take allowed medications just after feeding and avoid feeding for 4 hours."
  },
  {
    id: 10,
    part: 'Part II',
    question: "For a patient recovered from Hepatitis B or D, which laboratory test must be screened to confirm whether they are currently infective?",
    options: [
      "Screen for Hepatitis B surface antigen (HBsAg); if positive, the patient is infective",
      "Blood urea nitrogen (BUN)",
      "Serum amylase level",
      "C-reactive protein"
    ],
    correctIndex: 0,
    explanation: "Lecture Part II, page 11: 'For recovered type B and D hepatitis patients you must screen for HBsAg. if this test is positive, so the patient is infective. Patient with positive anti-HBs may be treated routinely.'"
  },

  // --- PART I QUESTIONS ---
  {
    id: 11,
    part: 'Part I',
    question: "How is hypertension diagnosed according to Dr. Maha Shukri's lecture and 2020 AHA guidelines?",
    options: [
      "A single elevated blood pressure recording",
      "Average systolic BP ≥140 mm Hg and/or diastolic ≥90 mm Hg following repeated exam on ≥3 readings taken at ≥3 appointments",
      "Any reading over 120/80 during acute toothache",
      "Only through 24-hour cardiac catheterization"
    ],
    correctIndex: 1,
    explanation: "Lecture Part I, page 2: Hypertension is diagnosed based on repeated examination with average SBP ≥ 140 mm Hg and/or DBP ≥ 90 mm Hg across 3 or more appointments."
  },
  {
    id: 12,
    part: 'Part I',
    question: "What is the safe limit of local anesthetic with epinephrine in patients with controlled hypertension or coronary disease?",
    options: [
      "Epinephrine is 100% contraindicated in all cardiac patients",
      "The use of 1 to 2 cartridges of LA with 1:80k, 1:100k, or 1:200k epinephrine is safe to control pain and minimize endogenous stress",
      "Unlimited 1:50,000 epinephrine may be given",
      "General anesthesia must always replace local anesthesia"
    ],
    correctIndex: 1,
    explanation: "Lecture Part I, page 3: 1 to 2 cartridges of LA with 1:80,000, 1:100,000 or 1:200,000 of epinephrine in patients with controlled hypertension/coronary disease is safe."
  },
  {
    id: 13,
    part: 'Part I',
    question: "What is the standard first-line oral antibiotic prophylaxis regimen for patients at high risk of Infective Endocarditis (IE)?",
    options: [
      "Amoxicillin 2.0 g orally, taken 1 hour before the procedure",
      "Clindamycin 150 mg at bedtime",
      "Amoxicillin 500 mg daily for 10 days post-procedure",
      "Erythromycin 250 mg 30 minutes before"
    ],
    correctIndex: 0,
    explanation: "Lecture Part I, page 8 table: 'Standard oral regimen: Amoxicillin 2 g one hour before procedure'. For penicillin-allergic patients: Clindamycin 600 mg, Azithromycin 500 mg, or Cephalexin 2.0 g."
  },
  {
    id: 14,
    part: 'Part I',
    question: "For a patient receiving hemodialysis 3 times a week, on which day should periodontal therapy be scheduled?",
    options: [
      "On the day of dialysis immediately before the session",
      "On the day AFTER dialysis, because heparin activity lasts 3 to 6 hours and patients are fatigued on dialysis days",
      "During the dialysis machine connection",
      "Only on weekends after 48 hours fasting"
    ],
    correctIndex: 1,
    explanation: "Lecture Part I, page 10: 'Periodontal treatment should be provided on the day after dialysis, because on the day of dialysis, patients typically are fatigued and may have a tendency to bleed. The activity of heparin lasts for 3 to 6 hours after infusion.'"
  }
];

export const MedCompQuizModule: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [filterPart, setFilterPart] = useState<'all' | 'part2' | 'part1'>('all');

  const filteredQuestions = ALL_MED_COMP_QUESTIONS.filter(q => {
    if (filterPart === 'part2') return q.part === 'Part II';
    if (filterPart === 'part1') return q.part === 'Part I';
    return true;
  });

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleCalculateScore = () => {
    setShowResults(true);
    const score = filteredQuestions.reduce((acc, q) => {
      return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);

    if (score >= Math.ceil(filteredQuestions.length * 0.75)) {
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

  const score = filteredQuestions.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const answeredCount = filteredQuestions.filter(q => selectedAnswers[q.id] !== undefined).length;

  return (
    <div className="bg-[#0b1736] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              Board Self-Assessment
            </span>
            <span className="text-xs text-slate-400">Dr. Maha Shukri (Parts I &amp; II)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-purple-400" />
            Medically Compromised Periodontal Mastery Quiz
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Comprehensive testing across diabetes, pregnancy, steroid doubling rule, in-chair seizures, bleeding disorders, and cardiovascular guidelines.
          </p>
        </div>

        {/* Filter Pills & Submit Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700/80 text-xs">
            <button
              onClick={() => { setFilterPart('all'); setShowResults(false); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${filterPart === 'all' ? 'bg-[#C9A24B] text-slate-950' : 'text-slate-300'}`}
            >
              All ({ALL_MED_COMP_QUESTIONS.length})
            </button>
            <button
              onClick={() => { setFilterPart('part2'); setShowResults(false); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${filterPart === 'part2' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
            >
              Part II Focus (10)
            </button>
            <button
              onClick={() => { setFilterPart('part1'); setShowResults(false); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${filterPart === 'part1' ? 'bg-rose-600 text-white' : 'text-slate-300'}`}
            >
              Part I (4)
            </button>
          </div>

          {!showResults ? (
            <button
              onClick={handleCalculateScore}
              disabled={answeredCount === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                answeredCount === filteredQuestions.length
                  ? 'bg-[#C9A24B] hover:bg-[#dfbe6e] text-slate-950 shadow-lg shadow-[#C9A24B]/20'
                  : answeredCount > 0
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Submit Answers ({answeredCount}/{filteredQuestions.length})</span>
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

      {/* Results Banner */}
      {showResults && (
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          score >= Math.ceil(filteredQuestions.length * 0.75)
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
        }`}>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              Examination Result
            </div>
            <div className="text-xl font-black text-white mt-0.5">
              Score: {score} / {filteredQuestions.length} ({Math.round((score / filteredQuestions.length) * 100)}%)
            </div>
            <p className="text-xs mt-1">
              {score >= Math.ceil(filteredQuestions.length * 0.75)
                ? 'Outstanding! You have mastered the entire curriculum from Newman and Carranza 13th Ed.'
                : 'Review the detailed clinical rationales below to reinforce high-yield points.'}
            </p>
          </div>

          <div className="text-3xl font-black font-mono shrink-0">
            {score}/{filteredQuestions.length}
          </div>
        </div>
      )}

      {/* Question Items */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
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
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase mr-2">
                      {q.part}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-relaxed inline">
                      {q.question}
                    </h4>
                  </div>
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

              {/* Explanation Box */}
              {showResults && (
                <div className="mt-3.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-[#C9A24B] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Clinical Lecture Rationale (Dr. Maha Shukri / Newman &amp; Carranza):
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
