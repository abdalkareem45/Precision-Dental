import React, { useState } from 'react';
import {
  Heart,
  Boxes,
  Activity,
  UserCheck,
  HelpCircle,
  BookOpen,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Pill,
  Radio,
  Scissors,
  Baby,
  Brain,
  Droplet,
  Biohazard
} from 'lucide-react';
import { MedicallyCompromised3D, MedCompMode3D } from './MedicallyCompromised3D';
import { MedCompClinicalMatrix2D } from './MedCompClinicalMatrix2D';
import { MedCompCases } from './MedCompCases';
import { MedCompQuizModule } from './MedCompQuizModule';

type MedCompSubView =
  | '3d_simulator'
  | 'clinical_matrix'
  | 'virtual_cases'
  | 'board_quiz'
  | 'lecture_notes';

interface MedicallyCompromisedMasterProps {
  initialPart?: 'part1' | 'part2';
}

export const MedicallyCompromisedMaster: React.FC<MedicallyCompromisedMasterProps> = ({
  initialPart = 'part2'
}) => {
  const [currentPart, setCurrentPart] = useState<'part1' | 'part2'>(initialPart);
  const [activeSubView, setActiveSubView] = useState<MedCompSubView>('3d_simulator');
  const [selected3DMode, setSelected3DMode] = useState<MedCompMode3D>(
    initialPart === 'part1' ? 'cardio_la' : 'diabetes_hba1c'
  );

  React.useEffect(() => {
    setCurrentPart(initialPart);
    setSelected3DMode(initialPart === 'part1' ? 'cardio_la' : 'diabetes_hba1c');
  }, [initialPart]);

  const handleSwitchPart = (part: 'part1' | 'part2') => {
    setCurrentPart(part);
    setSelected3DMode(part === 'part1' ? 'cardio_la' : 'diabetes_hba1c');
  };

  return (
    <div className="space-y-6">
      {/* Top Segmented Lecture Number Switcher: Lecture 4 vs Lecture 5 */}
      <div className="bg-[#07132e] border border-blue-500/40 rounded-2xl p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#C9A24B] text-slate-950 font-black text-sm flex items-center justify-center shadow">
            {currentPart === 'part1' ? '4' : '5'}
          </span>
          <div>
            <span className="text-[11px] font-bold text-[#C9A24B] uppercase tracking-wider block">
              Sequential Curriculum Navigation
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Select Dr. Maha Shukri's Lecture Part:
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => handleSwitchPart('part1')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              currentPart === 'part1'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Lecture 4: Part I (Cardio, Renal, Chemo)</span>
          </button>

          <button
            onClick={() => handleSwitchPart('part2')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              currentPart === 'part2'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Lecture 5: Part II (Diabetes, Pregnancy, Bleeding)</span>
          </button>
        </div>
      </div>

      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b0d2a] via-[#0d1636] to-[#060b18] border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C9A24B] text-slate-950 uppercase tracking-wider shadow-md">
                {currentPart === 'part1' ? 'Lecture 4 of 8' : 'Lecture 5 of 8'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-500/30">
                د. مها شكري (Dr. Maha Shukri)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Newman &amp; Carranza 13th Ed.
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {currentPart === 'part1'
                ? 'Lecture 4: Medically Compromised (Part I — Cardiovascular, Renal & Oncology)'
                : 'Lecture 5: Medically Compromised (Part II — Endocrine, Hematology & Pregnancy)'}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {currentPart === 'part1'
                ? 'Detailed clinical management of Hypertension, Angina & MI, Infective Endocarditis antibiotic prophylaxis, Pacemakers, Chronic Renal Failure, Hemodialysis, and Chemotherapy/Leukemia.'
                : 'Detailed clinical management of Diabetes Mellitus & HbA1c thresholds, Adrenal Insufficiency & the 20-Rule, Pregnancy supine syndrome, Bleeding disorders & INR, Epilepsy/Phenytoin hyperplasia, and Aerosol/Hepatitis precautions.'}
            </p>
          </div>

          {/* Quick High-Yield Rules Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shrink-0 flex flex-col gap-2 min-w-[280px] shadow-xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300">
              <span className="font-semibold text-white">Diabetes Diagnostic:</span>
              <span className="font-mono font-bold text-blue-400">FBG &ge; 126 / HbA1c &ge; 6.5%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Steroid Rule:</span>
              <span className="font-mono font-bold text-amber-400">Double dose if &gt;20mg/day</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Pregnancy Safe Window:</span>
              <span className="font-mono font-bold text-pink-400">2nd Trimester (Left Tilt)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Aspirin Withdrawal:</span>
              <span className="font-mono font-bold text-rose-400">Stop 7–10 days (&gt;325mg)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>IE Amoxicillin Dose:</span>
              <span className="font-mono font-bold text-emerald-400">2.0 g 1 hr prior</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto pt-6 mt-6 border-t border-slate-800/80 scrollbar-thin">
          <button
            onClick={() => setActiveSubView('3d_simulator')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubView === '3d_simulator'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>3D Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveSubView('clinical_matrix')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubView === 'clinical_matrix'
                ? 'bg-[#C9A24B] text-slate-950 shadow-lg shadow-[#C9A24B]/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>2D Protocols &amp; Calculators</span>
          </button>

          <button
            onClick={() => setActiveSubView('virtual_cases')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubView === 'virtual_cases'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Virtual Patient Cases (6)</span>
          </button>

          <button
            onClick={() => setActiveSubView('board_quiz')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubView === 'board_quiz'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Board Mastery Quiz (14 MCQs)</span>
          </button>

          <button
            onClick={() => setActiveSubView('lecture_notes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubView === 'lecture_notes'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 font-black'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Full Curriculum Notes</span>
          </button>
        </div>
      </div>

      {/* Sub-View 1: 3D Simulator */}
      {activeSubView === '3d_simulator' && (
        <div className="space-y-6">
          <MedicallyCompromised3D
            currentMode={selected3DMode}
            onModeChange={setSelected3DMode}
            height="560px"
          />
        </div>
      )}

      {/* Sub-View 2: 2D Clinical Protocols */}
      {activeSubView === 'clinical_matrix' && (
        <MedCompClinicalMatrix2D />
      )}

      {/* Sub-View 3: Virtual Patient Cases */}
      {activeSubView === 'virtual_cases' && (
        <MedCompCases />
      )}

      {/* Sub-View 4: Board Quiz */}
      {activeSubView === 'board_quiz' && (
        <MedCompQuizModule />
      )}

      {/* Sub-View 5: Full Lecture Notes */}
      {activeSubView === 'lecture_notes' && (
        <div className="bg-[#0b1736] border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <BookOpen className="w-6 h-6 text-[#C9A24B]" />
            <div>
              <h3 className="text-lg font-bold text-white">
                Comprehensive Lecture Notes (Dr. Maha Shukri / Newman &amp; Carranza 13th Ed.)
              </h3>
              <p className="text-xs text-slate-400">
                Department of Periodontics, College of Dentistry, University of Baghdad
              </p>
            </div>
          </div>

          <div className="space-y-6 text-xs text-slate-300">
            {/* PART II SECTION */}
            <div>
              <div className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Part II: Endocrine, Pregnancy, Bleeding, Epilepsy &amp; Infectious Diseases
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Diabetes */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="font-bold text-blue-400 text-sm block">1. Diabetes Mellitus &amp; Glycemic Control</span>
                  <p className="leading-relaxed">
                    • <strong>Classic Triad:</strong> Polydipsia (excessive thirst), polyuria (excessive urination), polyphagia (excessive hunger with weight loss).<br />
                    • <strong>Diagnostic Criteria:</strong> Fasting blood glucose &ge; 126 mg/dL (normal 70–100 mg/dL); random glucose &ge; 200 mg/dL with symptoms; 2-hour postprandial glucose &ge; 200 mg/dL (normal &lt; 140 mg/dL).<br />
                    • <strong>HbA1c:</strong> Normal &lt; 5.7%; Prediabetes 5.7–6.4%; Diabetes &ge; 6.5%. Well-controlled diabetic &le; 6.5% responds similarly to healthy patients; poorly controlled (&gt; 8%) has impaired wound healing and high post-op complications.<br />
                    • <strong>Insulin Shock (Hypoglycemia):</strong> Most common dental emergency. Schedule in morning; confirm insulin &amp; breakfast. If tremors, confusion, or diaphoresis occur: stop immediately and give oral sugar/juice!
                  </p>
                </div>

                {/* 2. Thyroid & Adrenal */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 text-sm block">2. Thyroid &amp; Adrenal Insufficiency</span>
                  <p className="leading-relaxed">
                    • <strong>Thyroid:</strong> Thyrotoxicosis: avoid epinephrine &amp; pressor amines. Hypothyroidism: avoid narcotics &amp; tranquilizers (drug intolerance).<br />
                    • <strong>Steroid Equivalent Doses:</strong> 25 mg Cortisone = 20 mg Hydrocortisone = 5 mg Prednisolone.<br />
                    • <strong>Steroid Supplementation Rule:</strong> Large dose (&gt; 20 mg cortisol daily) for extensive surgery $\rightarrow$ <strong>double normal daily dose 1 hour before procedure</strong>.<br />
                    • <strong>Past Steroid History:</strong> Adrenal cortex recovery takes 12–24 months; minimum 12 months must pass before treating without supplementation.
                  </p>
                </div>

                {/* 3. Pregnancy */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="font-bold text-pink-400 text-sm block">3. Pregnancy &amp; Breastfeeding</span>
                  <p className="leading-relaxed">
                    • <strong>Timing:</strong> 2nd trimester is the SAFEST time for scaling, polishing, and root planing. Postpone periodontal surgery until after delivery.<br />
                    • <strong>Supine Hypotension Syndrome:</strong> Fetus compresses inferior vena cava &amp; aorta. Position patient on her <strong>LEFT SIDE</strong> or elevate right hip 5–6 inches with a pillow/blanket roll.<br />
                    • <strong>Morning Sickness:</strong> Do NOT brush right after vomiting (causes severe acid erosion). Use neutral sodium fluoride rinse.<br />
                    • <strong>Breastfeeding Avoided Drugs:</strong> Tetracycline, ciprofloxacin, metronidazole, aspirin, vancomycin, barbiturates, benzodiazepines. Delay feeding 4 hours after taking allowed medications.
                  </p>
                </div>

                {/* 4. Hemorrhagic */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="font-bold text-rose-400 text-sm block">4. Hemorrhagic Disorders &amp; Leukemia</span>
                  <p className="leading-relaxed">
                    • <strong>Aspirin Withdrawal:</strong> If taking &gt; 325 mg/day, discontinue 7–10 days before surgery in consultation with physician.<br />
                    • <strong>Thrombocytopenia:</strong> Platelets &lt; 100,000 /mm³ (petechiae and ecchymoses). Local hemostatics: oxidized cellulose, bovine collagen, pressure, sutures.<br />
                    • <strong>Leukemia:</strong> Bleeding tendency + infection susceptibility. Scaling &amp; root planing allowed in chronic leukemia. 0.2% Chlorhexidine rinse. Periodontal surgery is <strong>CONTRAINDICATED in dental office</strong> (hospital setting required).
                  </p>
                </div>

                {/* 5. Epilepsy */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="font-bold text-purple-400 text-sm block">5. Neurologic Disorders (Epilepsy)</span>
                  <p className="leading-relaxed">
                    • <strong>Seizure in Dental Chair Protocol:</strong> Protect patient, do NOT move to floor, clear instrument trays, place chair in supported supine position, turn patient to side to maintain patent airway and avoid aspiration. Never insert mouth prop during seizure.<br />
                    • <strong>Phenytoin (Dilantin):</strong> Severe fibrotic gingival hyperplasia; oral hygiene reduces severity. Surgical gingivectomy if needed.<br />
                    • <strong>Valproic Acid (Depakene) &amp; Carbamazepine:</strong> Platelet interference causes bleeding tendency.
                  </p>
                </div>

                {/* 6. Infectious Diseases */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-400 text-sm block">6. Infectious Diseases (Hepatitis, HIV, TB, COVID-19)</span>
                  <p className="leading-relaxed">
                    • <strong>Hepatitis A &amp; E:</strong> Fecal-oral, self-limiting. <strong>Hep B &amp; D:</strong> Bloodborne; screen recovered patients for HBsAg (positive = infective; anti-HBs positive = immune/routine care). <strong>Hep C:</strong> 85% chronic infection; no vaccine.<br />
                    • <strong>Active Hepatitis, HIV &amp; COVID-19:</strong> AVOID ultrasonic instruments and air syringe (aerosol hazard). Use manual scalers.<br />
                    • <strong>Tuberculosis:</strong> Emergency care only until sputum culture negative. Active TB requires minimum 18 months therapy.
                  </p>
                </div>
              </div>
            </div>

            {/* PART I SECTION SUMMARY */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Part I: Cardiovascular, Renal &amp; Chemotherapy Summary
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-rose-300">Cardiovascular:</strong> Hypertension (&ge;140/&ge;90); max 1–2 carpules 1:100k epi; 6-month delay for MI and Stroke; Angina emergency nitroglycerin 0.3–0.6 mg + O₂.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-amber-300">Infective Endocarditis:</strong> Amoxicillin 2.0 g (Clindamycin 600 mg if allergic); extract hopeless teeth with severe periodontitis; 30 cm pacemaker EMF zone.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-cyan-300">Renal &amp; Chemo:</strong> Treat day AFTER hemodialysis (heparin clears in 3–6 hrs); never take BP on fistula arm; treat day BEFORE chemo (WBC &gt; 2000, ANC 1000–1500).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
