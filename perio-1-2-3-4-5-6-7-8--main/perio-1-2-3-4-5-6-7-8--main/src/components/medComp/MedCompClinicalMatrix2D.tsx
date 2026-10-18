import React, { useState } from 'react';
import {
  Heart,
  ShieldAlert,
  Activity,
  AlertTriangle,
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  Baby,
  Brain,
  Droplet,
  Biohazard,
  Scissors,
  Syringe,
  Info,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const MedCompClinicalMatrix2D: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<
    'diabetes' | 'steroids' | 'pregnancy' | 'bleeding' | 'epilepsy' | 'infectious' | 'cardio' | 'endocarditis'
  >('diabetes');

  // Part II: Diabetes Mellitus State
  const [fastingGlucose, setFastingGlucose] = useState<number>(115);
  const [hba1c, setHba1c] = useState<number>(7.2);
  const [hasClassicSymptoms, setHasClassicSymptoms] = useState<boolean>(false);

  // Part II: Steroid Supplementation State
  const [steroidDoseMg, setSteroidDoseMg] = useState<number>(15);
  const [steroidDurationMonths, setSteroidDurationMonths] = useState<number>(6);
  const [isExtensiveSurgery, setIsExtensiveSurgery] = useState<boolean>(true);

  // Part II: Pregnancy State
  const [pregnancyTrimester, setPregnancyTrimester] = useState<1 | 2 | 3>(2);

  // Part II: Bleeding Disorders State
  const [platelets, setPlatelets] = useState<number>(120000);
  const [aspirinDoseMg, setAspirinDoseMg] = useState<number>(100);

  // Part II: Epilepsy Seizure Step
  const [seizureStep, setSeizureStep] = useState<number>(1);

  // Part I: Cardio & BP
  const [systolicBP, setSystolicBP] = useState<number>(135);
  const [diastolicBP, setDiastolicBP] = useState<number>(85);

  // Calculations for Diabetes
  const isFastingDiabetic = fastingGlucose >= 126;
  const isHbA1cDiabetic = hba1c >= 6.5;
  const isPoorlyControlled = hba1c > 8.0;

  // Calculations for Steroids (Dr. Maha Shukri rules):
  // 1) Dose < 20mg or > 20mg cortisol daily for < 1 month -> No supplementation.
  // 2) Large dose (> 20mg daily) for extensive procedure -> Double normal daily dose 1 hr before!
  const isHighSteroidDose = steroidDoseMg > 20;
  const isChronicSteroids = steroidDurationMonths >= 1;
  const requiresSteroidDoubling = isHighSteroidDose && isChronicSteroids && isExtensiveSurgery;

  return (
    <div className="bg-[#0b1736] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      {/* Header and Category Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/30 uppercase tracking-wider">
              2D Clinical Decision Engines
            </span>
            <span className="text-xs text-slate-400">Dr. Maha Shukri (Parts I &amp; II)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#C9A24B]" />
            Medical Risk Evaluation &amp; Protocols Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Evidence-based decision engines spanning endocrine, pregnancy, hematology, neurologic, and infectious conditions.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900 p-1.5 rounded-xl border border-slate-700/80 scrollbar-thin">
          <button
            onClick={() => setActiveCategory('diabetes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'diabetes' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Diabetes &amp; HbA1c</span>
          </button>
          <button
            onClick={() => setActiveCategory('steroids')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'steroids' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Steroid Rule</span>
          </button>
          <button
            onClick={() => setActiveCategory('pregnancy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'pregnancy' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>Pregnancy</span>
          </button>
          <button
            onClick={() => setActiveCategory('bleeding')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'bleeding' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Bleeding &amp; Purpura</span>
          </button>
          <button
            onClick={() => setActiveCategory('epilepsy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'epilepsy' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Epilepsy &amp; Seizure</span>
          </button>
          <button
            onClick={() => setActiveCategory('infectious')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'infectious' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Biohazard className="w-3.5 h-3.5" />
            <span>Infectious Diseases</span>
          </button>
          <button
            onClick={() => setActiveCategory('cardio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'cardio' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Cardio (Part I)</span>
          </button>
          <button
            onClick={() => setActiveCategory('endocarditis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'endocarditis' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Endocarditis (Part I)</span>
          </button>
        </div>
      </div>

      {/* 1. DIABETES MELLITUS ENGINE */}
      {activeCategory === 'diabetes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Glycemic Evaluator */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Glycemic Control &amp; Diagnostic Thresholds
                </span>
                <span className="text-[11px] text-slate-400">Newman &amp; Carranza 13th Ed.</span>
              </div>

              {/* Fasting Glucose Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Fasting Blood Glucose (&ge; 8 hrs fast):</span>
                  <span className={`font-mono font-bold ${isFastingDiabetic ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {fastingGlucose} mg/dL
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="250"
                  value={fastingGlucose}
                  onChange={(e) => setFastingGlucose(parseInt(e.target.value))}
                  className="w-full accent-blue-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>70–100 (Normal)</span>
                  <span>126 (Diabetic Threshold)</span>
                  <span>250</span>
                </div>
              </div>

              {/* HbA1c Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Glycated Hemoglobin (HbA1c - 2–3 Months):</span>
                  <span className={`font-mono font-bold ${hba1c <= 6.5 ? 'text-emerald-400' : hba1c <= 7.0 ? 'text-blue-400' : 'text-rose-400'}`}>
                    {hba1c}%
                  </span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="14.0"
                  step="0.1"
                  value={hba1c}
                  onChange={(e) => setHba1c(parseFloat(e.target.value))}
                  className="w-full accent-blue-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>&lt;5.7% (Normal)</span>
                  <span>5.7–6.4% (Prediabetes)</span>
                  <span>&ge;6.5% (Diabetes)</span>
                  <span>&gt;8% (Poor)</span>
                </div>
              </div>

              {/* Classic Symptoms Checkbox */}
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none pt-2 border-t border-slate-800">
                <input
                  type="checkbox"
                  checked={hasClassicSymptoms}
                  onChange={(e) => setHasClassicSymptoms(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-500 bg-slate-800 border-slate-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Classic Triad Present: Polydipsia (Thirst), Polyuria (Urination), Polyphagia + Weight Loss</span>
              </label>

              {/* Diagnostic Outcome Box */}
              <div className={`p-3 rounded-lg border text-xs ${
                isPoorlyControlled
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  : isHbA1cDiabetic || isFastingDiabetic
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              }`}>
                <div className="font-bold text-sm">
                  {isPoorlyControlled
                    ? '🚨 Poorly Controlled Diabetes (HbA1c > 8%): Defer Advanced Care!'
                    : isHbA1cDiabetic
                    ? '⚠ Diabetes Mellitus Confirmed (HbA1c ≥ 6.5%)'
                    : '✓ Euglycemic / Normal Range'}
                </div>
                <div className="text-[11px] mt-1 leading-relaxed">
                  {isPoorlyControlled ? (
                    <span>
                      Dr. Maha Shukri Rule: <strong>Poorly controlled patients (&gt;8%) have a poor response to treatment with more postoperative complications.</strong> Provide emergency care only (e.g., acute periodontal abscess drainage) and non-surgical debridement until glycemic control is achieved.
                    </span>
                  ) : (
                    <span>
                      Well-controlled patients (&le; 6.5%) respond to periodontal therapy in a manner similar to non-diabetic individuals!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Insulin Shock & Hypoglycemia Prevention Guide */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Hypoglycemia (Insulin Shock) Protocol
                </span>
                <h3 className="font-bold text-white text-base mt-1">
                  Most Common Dental Emergency in Diabetic Patients
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Signs: Tremors, confusion, anxiety, diaphoresis (sweating), tachycardia, and loss of consciousness.
                </p>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-blue-300">• Appointment Scheduling:</div>
                    <div className="text-[11px] text-slate-300">
                      Best scheduled in the <strong>MORNING</strong>. Confirm upon arrival that patient has taken usual insulin dosage and eaten a normal breakfast.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-300">• Timing vs Peak Insulin Activity:</div>
                    <div className="text-[11px] text-slate-300">
                      Know the number of times per day insulin is taken and the time of the last dose to avoid scheduling during peak insulin action.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-200 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Emergency Action if Hypoglycemia Occurs:
                    </div>
                    <div className="text-[11px] leading-relaxed">
                      <strong>Immediately terminate periodontal therapy!</strong> Administer fruit juice, soda, or a glass of water with sugar/oral glucose. If unconscious, call EMS.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                Note: Thyroid disorders (Thyrotoxicosis: avoid epinephrine &amp; pressor amines; Hypothyroidism: avoid narcotics &amp; tranquilizers).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADRENAL INSUFFICIENCY & STEROID SUPPLEMENTATION */}
      {activeCategory === 'steroids' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Adrenal Crisis Prevention Engine
                </span>
                <span className="text-[10px] text-slate-400">Severe Hypotension Risk</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Patients who have received systemic steroid therapy cannot tolerate dental surgical stress and may develop life-threatening <strong>Adrenal Crisis</strong> (severe vascular collapse and hypotension).
              </p>

              {/* Dose Conversion Box */}
              <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30 text-xs">
                <div className="font-bold text-amber-400 uppercase text-[10px] mb-1">
                  Glucocorticoid Equivalent Doses
                </div>
                <div className="font-mono text-white text-xs font-bold">
                  25 mg Cortisone = 20 mg Hydrocortisone = 5 mg Prednisolone
                </div>
              </div>

              {/* Interactive Steroid Sliders */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Daily Cortisol Equivalent Dose:</span>
                    <span className="font-mono font-bold text-white">{steroidDoseMg} mg/day</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={steroidDoseMg}
                    onChange={(e) => setSteroidDoseMg(parseInt(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Low Dose (&lt;20mg)</span>
                    <span>20mg Threshold</span>
                    <span>High Dose (&gt;20mg)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Duration of Steroid Therapy:</span>
                    <span className="font-mono font-bold text-white">{steroidDurationMonths} months</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={steroidDurationMonths}
                    onChange={(e) => setSteroidDurationMonths(parseInt(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>&lt; 1 month</span>
                    <span>12 months (Recovery)</span>
                    <span>24 months</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={isExtensiveSurgery}
                    onChange={(e) => setIsExtensiveSurgery(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span>Extensive Periodontal Surgical Procedure Anticipated</span>
                </label>
              </div>

              {/* Recommendation Box */}
              <div className={`p-3.5 rounded-lg border text-xs ${
                requiresSteroidDoubling
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              }`}>
                <div className="font-bold text-sm">
                  {requiresSteroidDoubling
                    ? '★ Action Required: DOUBLE Normal Daily Dose 1 Hour Before Surgery!'
                    : '✓ No Steroid Supplementation Necessary'}
                </div>
                <div className="text-[11px] mt-1 leading-relaxed">
                  {requiresSteroidDoubling ? (
                    <span>
                      Dr. Maha Shukri Rule: Patients taking large dose (&gt;20 mg cortisol daily) for an extensive dental procedure: <strong>double the normal daily dose one hour before the procedure</strong>.
                    </span>
                  ) : (
                    <span>
                      Taking low dose (&lt;20mg) or high dose for &lt;1 month requires no supplementation.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Past History & Topical Steroids Rules */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Recovery Timeline &amp; Topical Steroid Rules
              </span>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white">• Past History of Steroid Therapy:</div>
                  <p className="text-[11px] leading-relaxed">
                    Full regeneration of adrenal cortical function may require <strong>12 to 24 months</strong>. A minimum of <strong>12 months must have passed</strong> since the last dose before routine periodontal surgery can be performed without steroid supplementation! Otherwise, consult physician for supplementation.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white">• Topical Corticosteroids (Eye Drops, Ointments):</div>
                  <p className="text-[11px] leading-relaxed">
                    Patients on topical steroids like eye drops used for a short time and small amounts: <strong>supplementation is NOT required</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PREGNANCY & BREASTFEEDING */}
      {activeCategory === 'pregnancy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Supine Hypotension Syndrome & Chair Position */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                  Supine Hypotension Syndrome Prevention
                </span>
                <span className="text-[10px] text-slate-400">Critical 3rd Trimester Rule</span>
              </div>

              <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Pathophysiology:
                </div>
                <p className="text-[11px] leading-relaxed">
                  Supine position allows the weight of the developing fetus to bear down directly on the <strong>inferior vena cava, aorta, and major vessels</strong>. The reduction in venous return causes sudden hypotension, syncope, and fetal distress.
                </p>
              </div>

              {/* Exact Chair Position Rule from Lecture */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-emerald-500/40 text-xs space-y-2">
                <div className="font-bold text-emerald-400 uppercase text-[10px]">
                  ★ Chair Position Protocol (Dr. Maha Shukri):
                </div>
                <div className="text-white text-xs font-semibold">
                  Place patient on her LEFT SIDE or elevate the right hip 5–6 inches by placing a pillow or blanket roll underneath.
                </div>
                <div className="text-[11px] text-slate-300">
                  Avoid supine position for long periods, especially in the 3rd trimester!
                </div>
              </div>

              {/* Trimester Selector */}
              <div>
                <span className="text-xs font-bold text-white block mb-2">Select Gestational Trimester:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map(t => (
                    <button
                      key={t}
                      onClick={() => setPregnancyTrimester(t as 1 | 2 | 3)}
                      className={`p-2.5 rounded-lg text-xs font-bold border transition ${
                        pregnancyTrimester === t
                          ? t === 2
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                            : 'bg-pink-600 border-pink-400 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {t === 1 ? '1st Trimester' : t === 2 ? '2nd Trimester ★' : '3rd Trimester'}
                    </button>
                  ))}
                </div>

                <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  {pregnancyTrimester === 1 && (
                    <span><strong>1st Trimester:</strong> Organogenesis. Nausea &amp; morning sickness common. <strong>Do NOT brush right after vomiting</strong> to prevent acid erosion! Use neutral sodium fluoride rinse.</span>
                  )}
                  {pregnancyTrimester === 2 && (
                    <span className="text-emerald-300 font-semibold">
                      ★ <strong>2nd Trimester is the SAFEST TIME for treatment</strong> (scaling, polishing, root planing). Postpone surgical procedures until after delivery.
                    </span>
                  )}
                  {pregnancyTrimester === 3 && (
                    <span className="text-pink-300"><strong>3rd Trimester:</strong> High risk of supine hypotension. Short appointments in series. Keep right hip elevated with blanket roll.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Breastfeeding & Drug Safety */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Clinical Management of Breastfeeding Patients
              </span>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-rose-500/30 text-xs space-y-2">
                <div className="font-bold text-rose-400 uppercase text-[10px]">
                  Drugs to Strictly AVOID During Breastfeeding:
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-200">
                  <div>❌ <strong>Tetracycline</strong></div>
                  <div>❌ <strong>Ciprofloxacin</strong></div>
                  <div>❌ <strong>Metronidazole</strong></div>
                  <div>❌ <strong>Aspirin</strong></div>
                  <div>❌ <strong>Vancomycin</strong></div>
                  <div>❌ <strong>Barbiturates</strong></div>
                  <div>❌ <strong>Benzodiazepines</strong></div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <div className="font-bold text-white text-xs">Timing of Medication Administration:</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The mother should take prescribed medication <strong>just after breastfeeding</strong> and then avoid feeding for <strong>4 hours or more</strong> to minimize drug concentration in breast milk.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-[#C9A24B]">Radiograph Protocol During Pregnancy:</div>
                <p className="text-[11px]">
                  Keep radiographs to a minimum. Use lead apron, thyroid collar, and a <strong>second apron for the back</strong> to prevent secondary scatter radiation from reaching the abdomen.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BLEEDING DISORDERS & HEMATOLOGY */}
      {activeCategory === 'bleeding' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Thrombocytopenia &amp; Aspirin Rules
                </span>
                <span className="text-[10px] text-slate-400">Newman &amp; Carranza 13th Ed.</span>
              </div>

              {/* Platelet Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Platelet Count:</span>
                  <span className={`font-mono font-bold ${platelets < 100000 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {platelets.toLocaleString()} /mm³
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="250000"
                  step="5000"
                  value={platelets}
                  onChange={(e) => setPlatelets(parseInt(e.target.value))}
                  className="w-full accent-rose-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>&lt;100k (Thrombocytopenia)</span>
                  <span>150k–400k (Normal)</span>
                </div>
              </div>

              {/* Aspirin Withdrawal Rule */}
              <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30 text-xs space-y-1.5">
                <div className="font-bold text-amber-400 uppercase text-[10px]">
                  Aspirin Withdrawal Rule (&gt; 325 mg/day):
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  For patients taking <strong>more than 325 mg of aspirin per day</strong>, the drug should be discontinued at least <strong>7 to 10 days before periodontal surgery</strong> in consultation with the physician (platelet lifespan is 7–10 days).
                </p>
              </div>

              {/* Local Hemostatic Agents */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-white uppercase text-[10px]">Local Hemostatic Measures:</div>
                <p className="text-[11px] text-slate-300">
                  Complete wound closure, pressure packs, <strong>oxidized cellulose (Surgicel)</strong> or <strong>purified bovine collagen</strong> over surgical sites or extraction sockets.
                </p>
              </div>
            </div>

            {/* Coagulation Disorders & Leukemia */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Hemophilia, Liver Disease &amp; Leukemia
              </span>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">• Hemophilia A, B &amp; von Willebrand:</div>
                  <div className="text-[11px]">Hemophilia A (Factor VIII def.), Hemophilia B (Factor IX def.), von Willebrand (vWF defect mediating platelet adhesion). Dictates prior physician consultation.</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">• Liver Disease (Cirrhosis / Hepatitis):</div>
                  <div className="text-[11px]">Liver is site of clotting factor synthesis. Check Prothrombin Time (PT) and Partial Thromboplastin Time (PTT). Screen for Hepatitis B &amp; C.</div>
                </div>

                <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/40 text-purple-200 space-y-1">
                  <div className="font-bold text-white">• Leukemia &amp; Blood Dyscrasias:</div>
                  <div className="text-[11px] leading-relaxed">
                    Scaling &amp; root planing allowed in chronic leukemia. 0.2% Chlorhexidine rinse twice daily. Antibiotic coverage mandatory. <strong>Periodontal surgery is CONTRAINDICATED in dental office</strong>; must be done in hospital!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. EPILEPSY & SEIZURE PROTOCOL */}
      {activeCategory === 'epilepsy' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Neurologic Emergency Protocol
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Management of Seizures in the Dental Chair (Dr. Maha Shukri)
                </h3>
              </div>
              <span className="text-xs text-[#C9A24B] font-semibold">Step-by-Step Flowchart</span>
            </div>

            {/* Step-by-Step Seizure Flowchart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className={`p-3.5 rounded-xl border transition ${
                seizureStep === 1 ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500' : 'border-slate-800 bg-slate-950'
              }`}>
                <div className="font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                  Protect &amp; Clear Area
                </div>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li>• Protect the patient and try to prevent injury.</li>
                  <li>• <strong>NO attempt should be made to move patient to floor!</strong></li>
                  <li>• Clear instruments and instrument tray from the area.</li>
                </ul>
              </div>

              <div className={`p-3.5 rounded-xl border transition ${
                seizureStep === 2 ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500' : 'border-slate-800 bg-slate-950'
              }`}>
                <div className="font-bold text-blue-300 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                  Chair Position &amp; Airway
                </div>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li>• Place dental chair in supported supine position.</li>
                  <li>• <strong>Turn patient to the side (lateral decubitus)</strong> to maintain patent airway and avoid aspiration!</li>
                  <li>• <strong>Never insert mouth prop during seizure!</strong> (only at beginning of procedure).</li>
                </ul>
              </div>

              <div className={`p-3.5 rounded-xl border transition ${
                seizureStep === 3 ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500' : 'border-slate-800 bg-slate-950'
              }`}>
                <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">3</span>
                  Post-Seizure Actions
                </div>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li>• Examine for traumatic injuries (fractured teeth, lip/tongue lacerations).</li>
                  <li>• Discontinue dental treatment.</li>
                  <li>• Arrange for patient transport home or to hospital.</li>
                </ul>
              </div>
            </div>

            {/* Phenytoin Overgrowth Note */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong>Phenytoin (Dilantin) Gingival Hyperplasia:</strong> Meticulous oral hygiene significantly decreases its severity. If overgrowth is significant, surgical gingivectomy will be necessary.
              </div>
              <div className="text-amber-400 font-semibold text-[11px] shrink-0">
                Valproic acid/Carbamazepine: platelet interference bleeding risk!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. INFECTIOUS DISEASES (HEPATITIS, HIV, TB, COVID-19) */}
      {activeCategory === 'infectious' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Universal Precautions &amp; Infection Control Protocols
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              {/* Hepatitis Matrix */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white text-sm block">Viral Hepatitis (A, B, C, D, E, G)</span>
                <ul className="space-y-1.5 text-[11px]">
                  <li>• <strong>Hep A &amp; E:</strong> Fecal-oral, self-limiting, no chronic disease. Routine care for recovered patients.</li>
                  <li>• <strong>Hep B &amp; D:</strong> Bloodborne. Hep D requires Hep B surface antigen. <strong>Screen recovered patients for HBsAg</strong>; if positive → infective. Positive anti-HBs → immune/routine care.</li>
                  <li>• <strong>Hep C:</strong> 85% develop chronic infection (cirrhosis, carcinoma). No vaccine available.</li>
                  <li>• <strong>Active Hepatitis:</strong> Defer elective care. In emergency: full barrier PPE, <strong>DO NOT use ultrasonic scalers or air syringe</strong>.</li>
                </ul>
              </div>

              {/* HIV, TB, COVID-19 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white text-sm block">HIV, Tuberculosis &amp; COVID-19</span>
                <ul className="space-y-1.5 text-[11px]">
                  <li>• <strong>HIV / AIDS:</strong> Oral hairy leukoplakia, candidiasis, NUG/NUP. Full PPE, avoid ultrasonic scalers, care with sharps.</li>
                  <li>• <strong>Tuberculosis:</strong> Emergency care only until sputum culture negative. Active TB requires minimum 18 months treatment. Autoclave 120–130°C for 1–2 hours.</li>
                  <li>• <strong>COVID-19:</strong> Schedule suspected/confirmed urgent care at end of shift with terminal disinfection. Preoperative chlorhexidine rinse. Avoid ultrasonic aerosols; use manual curettes.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. CARDIOVASCULAR (PART I REF) */}
      {activeCategory === 'cardio' && (
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs text-slate-300">
          <div className="font-bold text-rose-400 text-sm">Part I Summary: Cardiovascular Protocols</div>
          <div>• Hypertension: &ge;140/&ge;90 mmHg over &ge;3 visits. No care if uncontrolled.</div>
          <div>• Epinephrine: 1 to 2 carpules (1:100k) is safe in controlled hypertension; &gt; 1:100k contraindicated in stroke.</div>
          <div>• MI &amp; Stroke: Mandatory 6-month delay before any periodontal therapy.</div>
          <div>• Angina Attack: Stop, sit upright, sublingual nitroglycerin 0.3–0.6 mg + O₂. Repeat at 5 min if needed.</div>
        </div>
      )}

      {/* 8. ENDOCARDITIS (PART I REF) */}
      {activeCategory === 'endocarditis' && (
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs text-slate-300">
          <div className="font-bold text-amber-400 text-sm">Part I Summary: Infective Endocarditis (IE)</div>
          <div>• Prophylaxis: Amoxicillin 2.0 g (1 hr prior). Penicillin-allergic: Clindamycin 600 mg or Azithromycin 500 mg.</div>
          <div>• Teeth with severe periodontitis and poor prognosis must be EXTRACTED rather than retained.</div>
          <div>• Pretreatment chlorhexidine rinse; space visits 10–14 days.</div>
        </div>
      )}
    </div>
  );
};
