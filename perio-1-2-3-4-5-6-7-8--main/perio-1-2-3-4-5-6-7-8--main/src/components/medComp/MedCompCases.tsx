import React, { useState } from 'react';
import {
  User,
  Heart,
  ShieldAlert,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Scissors,
  Pill,
  Sparkles,
  Baby,
  Brain,
  Droplet,
  Info,
  Clock
} from 'lucide-react';

interface CaseScenario {
  id: string;
  title: string;
  patient: string;
  condition: string;
  part: 'Part I' | 'Part II';
  badgeColor: string;
  history: string;
  findings: string;
  questions: {
    prompt: string;
    options: string[];
    correctIndex: number;
    rationale: string;
  }[];
}

const CASES_DATA: CaseScenario[] = [
  // --- PART II CASES ---
  {
    id: 'case_diabetes',
    title: 'Case 1: Uncontrolled Type 2 Diabetes & Acute Periodontal Abscess',
    patient: '54-Year-Old Male',
    condition: 'Uncontrolled Diabetes (HbA1c 9.2%)',
    part: 'Part II',
    badgeColor: 'border-blue-500/30 bg-blue-500/20 text-blue-300',
    history: 'History of type 2 diabetes managed with metformin and glipizide. Reports polydipsia, polyuria, and fatigue. HbA1c drawn yesterday is 9.2%. Presents with severe throbbing pain in the lower right quadrant.',
    findings: 'Fluctuant, erythematous, painful swelling on the buccal gingiva of tooth #30 (PPD 9 mm). Purulent exudate draining from sulcus. Diagnosed with acute periodontal abscess.',
    questions: [
      {
        prompt: 'According to Dr. Maha Shukri\'s guidelines, what is the appropriate management for this poorly controlled patient?',
        options: [
          'Perform full-mouth osseous resective surgery immediately today',
          'Provide emergency treatment only (drain the acute periodontal abscess and local debridement), consult physician for glycemic control, and postpone elective surgery until HbA1c improves',
          'Dismiss patient without any emergency treatment until HbA1c reaches 5.5%',
          'Administer systemic steroids'
        ],
        correctIndex: 1,
        rationale: "Lecture rule: Provide emergency periodontal treatment only for such patients like acute periodontal abscess until diagnosis is established and good glycemic control obtained. Poorly controlled patients (>8%) have impaired wound healing and high post-op complications."
      },
      {
        prompt: 'During root debridement, the patient becomes pale, sweaty (diaphoretic), and confused with trembling hands. What is the diagnosis and immediate action?',
        options: [
          'Thyrotoxic crisis; give epinephrine',
          'Hypoglycemia (insulin shock); immediately terminate treatment and administer oral glucose/fruit juice or water with sugar',
          'Hyperglycemic ketoacidosis; inject 50 units of IV insulin in the dental chair',
          'Continue procedure with deeper local anesthesia'
        ],
        correctIndex: 1,
        rationale: "Hypoglycemia is the most common dental complication in diabetic patients taking insulin/secretagogues. Symptoms: tremors, confusion, anxiety, sweating, tachycardia. Action: Terminate therapy immediately, give fruit juice or sugar water."
      }
    ]
  },
  {
    id: 'case_pregnancy',
    title: 'Case 2: 3rd-Trimester Pregnancy & Sudden Chair Dizziness',
    patient: '28-Year-Old Female (28 Weeks Gravida)',
    condition: 'Pregnancy Gingivitis & Supine Hypotension Risk',
    part: 'Part II',
    badgeColor: 'border-pink-500/30 bg-pink-500/20 text-pink-300',
    history: '28 weeks pregnant (3rd trimester). Presents with localized bulbous, fiery-red gingival enlargement on the labial of upper anterior teeth that bleeds easily while eating (pregnancy gingivitis / epulis).',
    findings: 'Ten minutes after being laid back in a flat supine position for calculus removal, the patient complains of feeling dizzy, lightheaded, nauseous, and turns pale with a drop in BP to 80/50 mmHg.',
    questions: [
      {
        prompt: 'What condition is occurring, and how must the dental chair and patient position be modified immediately?',
        options: [
          'Epileptic seizure; move patient to the floor',
          'Supine Hypotension Syndrome due to vena cava compression; position patient on her LEFT SIDE or elevate right hip 5–6 inches with a pillow/blanket roll underneath',
          'Anaphylactic shock; inject intramuscular epinephrine',
          'Place patient in extreme Trendelenburg position with feet elevated higher than head'
        ],
        correctIndex: 1,
        rationale: "Lecture rule: Supine position allows the weight of developing fetus to bear down directly on vena cava, aorta and major vessels, causing supine hypotension syndrome. Correct position: Place patient on left side or elevate right hip 5–6 inches with pillow/blanket roll underneath."
      },
      {
        prompt: 'When is the safest time to perform routine periodontal treatment during pregnancy, and what is the rule regarding surgery?',
        options: [
          'First trimester for all surgeries',
          'The second trimester is the safest time for treatment (scaling, polishing, root planing), while surgical procedures should be postponed after delivery',
          'Immediately during labor',
          'Dental care is strictly forbidden throughout the entire pregnancy'
        ],
        correctIndex: 1,
        rationale: "Lecture rule: 'The second trimester is the safest time for treatment (scaling, polishing, root planing) while surgical procedures should be postponed after delivery.'"
      }
    ]
  },
  {
    id: 'case_steroid',
    title: 'Case 3: Chronic Prednisone Therapy & Periodontal Surgery',
    patient: '49-Year-Old Female',
    condition: 'Systemic Corticosteroid Therapy (Adrenal Insufficiency)',
    part: 'Part II',
    badgeColor: 'border-amber-500/30 bg-amber-500/20 text-amber-300',
    history: 'Has severe rheumatoid arthritis treated with Prednisolone 10 mg daily (equivalent to 40 mg cortisol daily) for the past 2 years. Scheduled for an extensive full-thickness flap surgery with osseous recontouring.',
    findings: 'Generalized Stage III Grade B periodontitis with residual 6–7 mm pockets.',
    questions: [
      {
        prompt: 'What is the required steroid supplementation protocol for this extensive surgical procedure?',
        options: [
          'Completely stop Prednisolone 1 week before surgery without telling physician',
          'Patients taking large doses (> 20 mg cortisol daily) for extensive dental procedures: double the normal daily dose one hour before the procedure',
          'No supplementation is ever needed regardless of dose or duration',
          'Switch to aspirin 1000 mg'
        ],
        correctIndex: 1,
        rationale: "Lecture rule: Prednisolone 10 mg = 40 mg cortisol (more than 20 mg cortisol daily). 'Patients taking large dose (more than 20 mg cortisol daily) for extensive dental procedure: double the normal daily dose one hour before the procedure' to prevent adrenal crisis (severe hypotension)."
      },
      {
        prompt: 'What equivalent doses of cortisone and hydrocortisone correspond to 5 mg Prednisolone?',
        options: [
          '5 mg cortisone = 5 mg hydrocortisone',
          '25 mg cortisone is equivalent to 20 mg hydrocortisone and 5 mg prednisolone',
          '100 mg cortisone = 50 mg hydrocortisone',
          'Corticosteroids cannot be converted to equivalents'
        ],
        correctIndex: 1,
        rationale: "Lecture page 3 & 4: 'Doses of different corticosteroids include 25 mg cortisone equivalent to → 20 mg hydrocortisone equivalent to → 5 mg prednisolone.'"
      }
    ]
  },
  {
    id: 'case_epilepsy',
    title: 'Case 4: Epilepsy, Phenytoin Overgrowth & In-Chair Seizure',
    patient: '31-Year-Old Male',
    condition: 'Epilepsy on Phenytoin (Dilantin) & Valproic Acid',
    part: 'Part II',
    badgeColor: 'border-purple-500/30 bg-purple-500/20 text-purple-300',
    history: 'Diagnosed with generalized tonic-clonic epilepsy on Phenytoin and Valproic acid (Depakene). Presents with massive fibrotic gingival hyperplasia covering anterior teeth. During the appointment, patient suddenly loses consciousness and begins generalized convulsive jerking.',
    findings: 'Active seizure in the dental chair.',
    questions: [
      {
        prompt: 'What are the essential management steps while the patient is actively convulsing in the dental chair?',
        options: [
          'Try to pin down patient\'s limbs and force a metal mouth prop between clenched teeth',
          'Protect the patient from injury, do NOT move to floor, clear instrument trays, place chair in supported supine position, and turn patient to the side to maintain patent airway',
          'Immediately attempt mouth-to-mouth resuscitation during convulsions',
          'Administer intramuscular epinephrine'
        ],
        correctIndex: 1,
        rationale: "Lecture page 9: In-chair seizure management: a) Protect patient and prevent injury; b) No attempt should be made to move patient to floor; c) Instruments/tray cleared from area; d) Chair in supported supine position; e) Airway maintained patent by turning patient to the side to avoid aspiration; f) Never insert mouth prop during seizure!"
      },
      {
        prompt: 'What additional medical precaution must be considered regarding Valproic acid (Depakene)?',
        options: [
          'Causes severe hypercalcemia',
          'Causes platelet interference (decreased platelet aggregation) leading to an increased bleeding tendency',
          'Strictly prohibits the use of any local anesthetic',
          'Causes rapid enamel decalcification'
        ],
        correctIndex: 1,
        rationale: "Lecture page 9: 'Possibility of bleeding tendency in patients taking valproic acid (Depakene) or Carbamazepine (Tegretol) as the result of platelet interference (decrease platelet aggregation) so consult with the physician.'"
      }
    ]
  },

  // --- PART I CASES ---
  {
    id: 'case_cardio',
    title: 'Case 5: Angina & Controlled Hypertension (Part I)',
    patient: '62-Year-Old Male',
    condition: 'Hypertension & Chronic Stable Angina',
    part: 'Part I',
    badgeColor: 'border-rose-500/30 bg-rose-500/20 text-rose-300',
    history: 'History of myocardial ischemia controlled on nitroglycerin. BP 138/86 mmHg. Experienced chest pain 15 minutes into scaling.',
    findings: 'Substernal crushing chest pain.',
    questions: [
      {
        prompt: 'What is the immediate first-line action for acute chest pain?',
        options: [
          'Continue scaling quickly',
          'Stop treatment immediately, sit upright, give sublingual glyceryl trinitrate 0.3–0.6 mg and oxygen',
          'Inject epinephrine',
          'Perform Trendelenburg position'
        ],
        correctIndex: 1,
        rationale: 'Treatment must be stopped immediately; the patient should be given glyceryl trinitrate 0.3–0.6 mg sublingually and oxygen and be kept sitting upright.'
      }
    ]
  },
  {
    id: 'case_ie',
    title: 'Case 6: Mechanical Heart Valve & IE Prophylaxis (Part I)',
    patient: '56-Year-Old Female',
    condition: 'Prosthetic Aortic Valve & Penicillin Allergy',
    part: 'Part I',
    badgeColor: 'border-amber-500/30 bg-amber-500/20 text-amber-300',
    history: 'Mechanical aortic valve replacement with severe penicillin allergy.',
    findings: 'Hopeless tooth #15 with 80% bone loss.',
    questions: [
      {
        prompt: 'Which oral prophylactic antibiotic is indicated for this penicillin-allergic patient?',
        options: [
          'Amoxicillin 2.0 g',
          'Clindamycin 600 mg OR Azithromycin 500 mg 1 hour before procedure',
          'Erythromycin 250 mg',
          'No antibiotic needed'
        ],
        correctIndex: 1,
        rationale: 'For penicillin-allergic patients: Clindamycin 600 mg or Azithromycin 500 mg orally 1 hour before procedure.'
      }
    ]
  }
];

export const MedCompCases: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case_diabetes');
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});

  const currentCase = CASES_DATA.find(c => c.id === selectedCaseId) || CASES_DATA[0];

  const handleSelectOption = (qKey: string, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qKey]: optIdx }));
  };

  return (
    <div className="bg-[#0b1736] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
              Clinical Vignettes (Parts I &amp; II)
            </span>
            <span className="text-xs text-slate-400">Dr. Maha Shukri (Baghdad Curriculum)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <User className="w-6 h-6 text-cyan-400" />
            Medically Compromised Virtual Patients
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Evaluate and manage clinical scenarios across diabetes, pregnancy, steroid therapy, epilepsy, and cardiovascular conditions.
          </p>
        </div>

        {/* Case Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900 p-1.5 rounded-xl border border-slate-700/80 scrollbar-thin">
          {CASES_DATA.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                selectedCaseId === c.id
                  ? 'bg-[#C9A24B] text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>{c.title.split(':')[0]}</span>
              <span className="text-[10px] opacity-75">({c.part})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Case Card */}
      <div className="space-y-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {currentCase.part} Vignette
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {currentCase.title}
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">
                {currentCase.patient} • <span className="text-white font-semibold">{currentCase.condition}</span>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${currentCase.badgeColor}`}>
              Active Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-semibold text-slate-200 mb-1">Medical Background:</div>
              <p className="leading-relaxed">{currentCase.history}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-semibold text-slate-200 mb-1">Clinical Presentation:</div>
              <p className="leading-relaxed">{currentCase.findings}</p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider text-[#C9A24B] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Clinical Decision Checkpoints
          </h4>

          {currentCase.questions.map((q, qIdx) => {
            const qKey = `${currentCase.id}_q${qIdx}`;
            const selectedOpt = userAnswers[qKey];
            const hasAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={qIdx}
                className="p-4 sm:p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                    Q{qIdx + 1}
                  </span>
                  <div className="text-sm font-bold text-white leading-relaxed">
                    {q.prompt}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isCorrectOpt = optIdx === q.correctIndex;

                    let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800';

                    if (hasAnswered) {
                      if (isCorrectOpt) {
                        btnStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-200 font-bold ring-1 ring-emerald-500';
                      } else if (isSelected && !isCorrectOpt) {
                        btnStyle = 'border-rose-500 bg-rose-950/30 text-rose-300 line-through';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qKey, optIdx)}
                        className={`p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2 ${btnStyle}`}
                      >
                        <span className="w-4 h-4 rounded-full border border-current text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div className={`mt-3 p-3 rounded-lg border text-xs space-y-1 ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Correct Decision!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>Incorrect Action</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                      {q.rationale}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
