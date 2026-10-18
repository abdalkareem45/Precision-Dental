import React, { useState } from 'react';
import {
  User,
  Activity,
  FileText,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Scissors,
  Sparkles,
  Calendar,
  Layers,
  Heart,
  Pill,
  ChevronRight,
  TrendingUp,
  Shield,
  HelpCircle
} from 'lucide-react';

export const CpgCaseWalkthrough: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<'case1' | 'case2'>('case1');
  const [activeTreatmentStep, setActiveTreatmentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});

  const toggleStepCompleted = (key: string) => {
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#0b1736] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      {/* Header and Case Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/30 uppercase tracking-wider">
              Clinical Board Vignettes
            </span>
            <span className="text-xs text-slate-400">Dr. Alaa Omran 5th Class Lecture Cases</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <User className="w-6 h-6 text-cyan-400" />
            Interactive Patient Clinical Scenarios
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Analyze clinical findings, radiographic calculations (% bone loss / age), staging &amp; grading, and complete stepwise treatment execution.
          </p>
        </div>

        {/* Case Toggle Pills */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700/80">
          <button
            onClick={() => {
              setSelectedCase('case1');
              setActiveTreatmentStep(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedCase === 'case1'
                ? 'bg-[#C9A24B] text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Case 1: 67y ♀ (Stage II Grade B)</span>
          </button>
          <button
            onClick={() => {
              setSelectedCase('case2');
              setActiveTreatmentStep(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedCase === 'case2'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Case 2: 41y ♂ (Stage III Grade C)</span>
          </button>
        </div>
      </div>

      {selectedCase === 'case1' ? (
        /* CASE 1: 67-year-old Caucasian Female */
        <div className="space-y-6">
          {/* Patient Overview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Case Scenario 1 Profile
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    67-Year-Old Caucasian Female
                  </h3>
                  <div className="italic text-cyan-300 text-xs mt-1 bg-cyan-950/30 border border-cyan-800/40 p-2 rounded-lg">
                    Chief Complaint: &quot;I would like to have dental implant in my upper left side.&quot;
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  Localized Stage II, Grade B
                </span>
              </div>

              {/* History & Risk Factors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    Medical History &amp; Vitals
                  </div>
                  <div>• Depression on <strong>Citalopram</strong> (SSRI)</div>
                  <div>• Allergy: <strong>Nickel allergy</strong></div>
                  <div>• BP: 125/75 mmHg • HR: 75 bpm</div>
                  <div>• No other significant medical problems</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    Periodontal Risk &amp; Habits
                  </div>
                  <div>• <strong>Former smoker</strong> (quit several years ago)</div>
                  <div>• Oral hygiene: Brushes 2x/day, flosses 1x/day</div>
                  <div>• Last dental cleaning: 1 year ago</div>
                  <div>• Referred by dentist for perio &amp; implant therapy</div>
                </div>
              </div>

              {/* Clinical & Radiographic Findings Summary */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white text-xs uppercase tracking-wider text-cyan-400">
                  Key Diagnostic Findings
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">BOP %</div>
                    <div className="text-base font-bold text-amber-400 font-mono">30%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">PPD Range</div>
                    <div className="text-base font-bold text-cyan-400 font-mono">1–5 mm</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Interdental CAL</div>
                    <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">3–4 mm (8.3%)</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Keratinized Tissue</div>
                    <div className="text-xs font-bold text-rose-400 mt-0.5">Deficient at #20</div>
                  </div>
                </div>

                <div className="text-slate-300 space-y-1 pt-1 border-t border-slate-800 text-[11px]">
                  <div>• <strong>Horizontal bone loss</strong>: 15%–33% around teeth #4, #20, #30, #31.</div>
                  <div>• <strong>Recurrent caries</strong>: #5, #6, #11 • <strong>Periapical radiolucency</strong>: tooth #13.</div>
                  <div>• <strong>Gingival recession</strong>: range 1–2 mm on teeth #11, #20, #28.</div>
                  <div>• <strong>Missing teeth due to periodontitis</strong>: None • <strong>Need for complex rehabilitation</strong>: No.</div>
                </div>
              </div>
            </div>

            {/* Diagnostic Calculation & Staging Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Diagnostic Derivation
                </span>
                <h4 className="font-bold text-white text-sm mt-1">
                  Staging &amp; Grading Justification
                </h4>

                <div className="mt-3 space-y-3 text-xs">
                  {/* Bone Loss / Age Formula */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30">
                    <div className="text-[10px] font-bold text-amber-400 uppercase">
                      Grade Calculation Formula
                    </div>
                    <div className="text-sm font-mono font-bold text-white mt-1">
                      % Bone Loss / Age = 30 / 67 = 0.45
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      0.45 falls between 0.25 and 1.0 → Confirms <strong>Grade B</strong> (Moderate progression).
                    </div>
                  </div>

                  {/* Staging Logic */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-blue-500/30 space-y-1 text-[11px] text-slate-300">
                    <div className="font-bold text-blue-400 uppercase text-[10px]">Stage Determination</div>
                    <div>• Max CAL is 3–4 mm (8.3%)</div>
                    <div>• Horizontal bone loss is 15%–33% (coronal third)</div>
                    <div>• No tooth loss from periodontitis</div>
                    <div className="text-emerald-400 font-bold mt-1">→ Confirms Stage II</div>
                  </div>

                  {/* Extent Logic */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-purple-500/30 text-[11px] text-slate-300">
                    <div className="font-bold text-purple-400 uppercase text-[10px]">Extent &amp; Distribution</div>
                    <div>• Sites with attachment loss represent &lt; 30% of teeth</div>
                    <div className="text-purple-300 font-bold mt-1">→ Localized Stage II, Grade B</div>
                  </div>
                </div>
              </div>

              {/* Mucogingival note */}
              <div className="p-2.5 rounded-lg bg-pink-950/20 border border-pink-500/30 text-[11px] text-pink-200">
                <strong>Mucogingival Note:</strong> Inadequate attached keratinized gingiva at tooth #20 requires soft tissue augmentation (Connective Tissue Graft) prior to or during implant therapy.
              </div>
            </div>
          </div>

          {/* Stepwise Treatment Plan Interactive Execution */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-[#C9A24B]" />
                  Stepwise Treatment Execution (Dr. Alaa Omran Plan)
                </h4>
                <p className="text-xs text-slate-400">
                  Click through each step to view the sequential management for Case 1.
                </p>
              </div>

              {/* Step Navigation Pills */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((stepNum) => (
                  <button
                    key={stepNum}
                    onClick={() => setActiveTreatmentStep(stepNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                      activeTreatmentStep === stepNum
                        ? 'bg-[#C9A24B] text-slate-950 font-black ring-2 ring-[#C9A24B]/50'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {stepNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Step Content */}
            {activeTreatmentStep === 1 && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-300 uppercase">
                    First Step of Therapy
                  </span>
                  <span className="text-xs text-amber-300 font-semibold">Pre-surgical / Cause-Related Foundation</span>
                </div>
                <h5 className="font-bold text-white text-sm">Oral Hygiene, Biofilm Control &amp; Restorative Interventions</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-200">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="font-semibold text-amber-300">• Oral hygiene instructions (OHI)</div>
                    <div className="text-slate-300 text-[11px]">Motivation, tailored brushing technique, interdental flossing reinforcement.</div>
                    <div className="font-semibold text-amber-300">• Supragingival biofilm &amp; PMPR</div>
                    <div className="text-slate-300 text-[11px]">Professional mechanical plaque removal and supragingival instrumentation.</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="font-semibold text-amber-300">• Restorative consultation &amp; Caries control</div>
                    <div className="text-slate-300 text-[11px]">Treatment for recurrent caries on #5, 6, 11 and replacement of defective restorations. Fluoride toothpaste prescription &amp; diet control.</div>
                    <div className="font-semibold text-amber-300">• Endodontic consultation (#13) &amp; Reevaluation</div>
                    <div className="text-slate-300 text-[11px]">Evaluate periapical radiolucency for tooth #13. Reevaluate oral hygiene compliance.</div>
                  </div>
                </div>
              </div>
            )}

            {activeTreatmentStep === 2 && (
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/30 text-blue-300 uppercase">
                    Second Step of Therapy (Cause-Related Therapy)
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold">4–8 Weeks Re-evaluation Milestone</span>
                </div>
                <h5 className="font-bold text-white text-sm">Subgingival Instrumentation &amp; Re-Evaluation</h5>
                <div className="space-y-3 text-xs text-slate-200">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-semibold text-blue-300">• Subgingival instrumentation</div>
                    <p className="text-slate-300 text-[11px]">
                      Conducted at sites with periodontal pockets greater than 3 mm (#4, #20, #30, #31).
                    </p>
                  </div>

                  {/* Clinical Outcome Highlight */}
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Re-Evaluation Outcome at 4–8 Weeks:</span>
                      &quot;In this case, <strong>no sites with probing depths of greater than 4 mm</strong> were present at reevaluation visit!&quot;
                      <div className="text-[11px] text-emerald-300/90 mt-1">
                        Endpoint achieved! Periodontal inflammation successfully controlled. The patient can proceed directly to implant rehabilitation and soft tissue grafting.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTreatmentStep === 3 && (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/30 text-purple-300 uppercase">
                    Third Step of Therapy
                  </span>
                  <span className="text-xs text-purple-300 font-semibold">Implant &amp; Mucogingival Surgery</span>
                </div>
                <h5 className="font-bold text-white text-sm">Surgical Rehabilitation &amp; Connective Tissue Grafting</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-purple-300">• Implant placement for sites #14 and #15</div>
                    <p className="text-slate-300 text-[11px]">
                      Fulfills patient&apos;s chief complaint (&quot;dental implant in my upper left side&quot;) now that active periodontitis is resolved.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-pink-300">• Connective tissue graft (CTG) for tooth #20</div>
                    <p className="text-slate-300 text-[11px]">
                      Augment attached keratinized tissue to correct mucogingival defect and cover 1–2 mm recession.
                    </p>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  • <strong>Postsurgical reevaluation</strong>: Assessment of healing, graft integration, and implant osseointegration prior to prosthetic loading.
                </div>
              </div>
            )}

            {activeTreatmentStep === 4 && (
              <div className="p-4 rounded-xl bg-[#C9A24B]/15 border border-[#C9A24B]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A24B]/20 text-[#C9A24B] uppercase">
                    Fourth Step of Therapy
                  </span>
                  <span className="text-xs font-bold text-[#C9A24B]">Supportive Periodontal Care (SPC)</span>
                </div>
                <h5 className="font-bold text-white text-sm">Long-Term Maintenance &amp; Peri-Implant Surveillance</h5>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-[#C9A24B]">
                    ★ Periodic periodontal examination every three months:
                  </div>
                  <div>• Updating radiographs as needed to monitor bone levels around teeth &amp; implants #14, #15.</div>
                  <div>• Oral hygiene instructions reinforcement &amp; supragingival dental biofilm control.</div>
                  <div>• Subgingival instrumentation as needed at repocketing sites.</div>
                  <div>• Evaluation of occlusion, tooth mobility, and soft tissue integration at #20 CTG site.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* CASE 2: 41-year-old African Male */
        <div className="space-y-6">
          {/* Patient Overview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                    Case Scenario 2 Profile
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    41-Year-Old African Male
                  </h3>
                  <div className="italic text-cyan-300 text-xs mt-1 bg-cyan-950/30 border border-cyan-800/40 p-2 rounded-lg">
                    Chief Complaint: &quot;I was told that I have gum disease.&quot;
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                  Generalized Stage III, Grade C
                </span>
              </div>

              {/* History & Smoking Habit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    Medical History &amp; Vitals
                  </div>
                  <div>• No significant medical problems, no medications</div>
                  <div>• BP: 130/80 mm Hg • Heart rate: 75 bpm</div>
                  <div>• Referred by general dentist to periodontist</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-rose-500/30 space-y-1 bg-rose-950/15">
                  <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    Critical Risk Modifier
                  </div>
                  <div className="text-rose-200 font-bold">• Smokes 5 cigarettes a day (Active Smoker!)</div>
                  <div>• Brushes and flosses twice a day</div>
                  <div>• Last professional dental cleaning: 18 months ago</div>
                </div>
              </div>

              {/* Clinical & Radiographic Findings Summary */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white text-xs uppercase tracking-wider text-rose-400">
                  Key Diagnostic Findings
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">BOP %</div>
                    <div className="text-base font-bold text-rose-400 font-mono">41%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">PPD Range</div>
                    <div className="text-base font-bold text-rose-300 font-mono">1–11 mm</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">CAL ≥ 5mm</div>
                    <div className="text-xs font-bold text-rose-400 font-mono mt-0.5">34.4% of sites</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Hopeless Teeth</div>
                    <div className="text-xs font-bold text-rose-400 mt-0.5">#16 &amp; #17 (Mobility II)</div>
                  </div>
                </div>

                <div className="text-slate-300 space-y-1 pt-1 border-t border-slate-800 text-[11px]">
                  <div>• <strong>Bone Loss Patterns</strong>: Generalized moderate horizontal bone loss. Severe horizontal loss of 50% around #9 and #10.</div>
                  <div>• <strong>Angular / Vertical Defects</strong>: Vertical bone loss around <strong>90% on mesial of #17</strong>. Vertical intrabony defect of <strong>4 mm on mesial of #18</strong>.</div>
                  <div>• <strong>Recession</strong>: 1–5 mm on #2, 3, 4, 5, 8, 11–16, 18–31 • <strong>Prosthetic / Tooth factor</strong>: Malpositioned teeth.</div>
                </div>
              </div>
            </div>

            {/* Diagnostic Calculation & Staging Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Diagnostic Derivation
                </span>
                <h4 className="font-bold text-white text-sm mt-1">
                  Staging &amp; Grading Justification
                </h4>

                <div className="mt-3 space-y-3 text-xs">
                  {/* Bone Loss / Age Formula */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-rose-500/40">
                    <div className="text-[10px] font-bold text-rose-400 uppercase">
                      Grade Calculation Formula
                    </div>
                    <div className="text-sm font-mono font-bold text-white mt-1">
                      % Bone Loss / Age = 50 / 41 = 1.22
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      1.22 is &gt; 1.0 + active smoking habit (5 cigs/day) → Confirms <strong>Grade C</strong> (Rapid rate of progression).
                    </div>
                  </div>

                  {/* Staging Logic */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-blue-500/30 space-y-1 text-[11px] text-slate-300">
                    <div className="font-bold text-blue-400 uppercase text-[10px]">Stage Determination</div>
                    <div>• Interdental CAL ≥ 5 mm (34.4% of dentition)</div>
                    <div>• Bone loss extending to middle or apical third (50%–90%)</div>
                    <div>• Probing depths up to 11 mm with 4mm vertical intrabony defect</div>
                    <div>• Teeth missing/hopeless from perio: ≤ 4 (#16, #17)</div>
                    <div className="text-rose-400 font-bold mt-1">→ Confirms Stage III</div>
                  </div>

                  {/* Extent Logic */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-purple-500/30 text-[11px] text-slate-300">
                    <div className="font-bold text-purple-400 uppercase text-[10px]">Extent &amp; Distribution</div>
                    <div>• &gt; 30% of teeth affected with severe attachment loss</div>
                    <div className="text-purple-300 font-bold mt-1">→ Generalized Stage III, Grade C</div>
                  </div>
                </div>
              </div>

              {/* Hopeless teeth warning */}
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-[11px] text-rose-200">
                <strong>Critical Clinical Finding:</strong> Teeth #16 and #17 have Grade II mobility with severe 90% vertical bone loss, giving them a hopeless prognosis; planned for extraction.
              </div>
            </div>
          </div>

          {/* Stepwise Treatment Plan Interactive Execution */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-rose-400" />
                  Stepwise Treatment Execution (Dr. Alaa Omran Plan)
                </h4>
                <p className="text-xs text-slate-400">
                  Click through each step to view the sequential management for Case 2.
                </p>
              </div>

              {/* Step Navigation Pills */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((stepNum) => (
                  <button
                    key={stepNum}
                    onClick={() => setActiveTreatmentStep(stepNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                      activeTreatmentStep === stepNum
                        ? 'bg-rose-500 text-white font-black ring-2 ring-rose-500/50'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {stepNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Step Content */}
            {activeTreatmentStep === 1 && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-300 uppercase">
                    First Step of Therapy
                  </span>
                  <span className="text-xs text-amber-300 font-semibold">Risk Factor &amp; Malposition Focus</span>
                </div>
                <h5 className="font-bold text-white text-sm">Biofilm Control, Smoking Cessation &amp; Orthodontic Consultation</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-200">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="font-semibold text-rose-300">• Risk factor control: Smoking Cessation!</div>
                    <div className="text-slate-300 text-[11px]">Cessation counseling is mandatory; smoking drastically hinders wound healing and increases surgical failure risk.</div>
                    <div className="font-semibold text-amber-300">• Oral hygiene instructions (OHI)</div>
                    <div className="text-slate-300 text-[11px]">Interdental brush sizing, power toothbrushing technique.</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="font-semibold text-amber-300">• Supragingival biofilm control &amp; PMPR</div>
                    <div className="text-slate-300 text-[11px]">Supragingival mechanical instrumentation to decontaminate crown surfaces.</div>
                    <div className="font-semibold text-blue-300">• Orthodontic consultation &amp; Reevaluation</div>
                    <div className="text-slate-300 text-[11px]">Address malpositioned teeth once periodontal stability is established.</div>
                  </div>
                </div>
              </div>
            )}

            {activeTreatmentStep === 2 && (
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/30 text-blue-300 uppercase">
                    Second Step of Therapy (Cause-Related Therapy)
                  </span>
                  <span className="text-xs text-rose-300 font-semibold">End Points NOT Met</span>
                </div>
                <h5 className="font-bold text-white text-sm">Deep Subgingival Instrumentation &amp; Antiseptic Adjuncts</h5>
                <div className="space-y-3 text-xs text-slate-200">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-semibold text-blue-300">• Subgingival instrumentation (&gt; 3 mm sites)</div>
                    <p className="text-slate-300 text-[11px]">
                      Ultrasonic cavitation and Gracey curettes across all deep pockets.
                    </p>
                    <div className="font-semibold text-cyan-300 mt-1">• Adjunctive chemotherapeutics (antiseptics)</div>
                    <p className="text-slate-300 text-[11px]">
                      Subgingival irrigation and chlorhexidine mouthrinse to assist bacterial suppression.
                    </p>
                  </div>

                  {/* Clinical Outcome Highlight */}
                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Re-Evaluation Outcome at 4–8 Weeks:</span>
                      &quot;Periodontal pockets of <strong>greater than 5 mm were present around several teeth</strong> in the maxillary right, maxillary left, and mandibular left quadrants.&quot;
                      <div className="text-[11px] text-rose-300/90 mt-1">
                        Endpoints NOT achieved (PD &gt; 4mm with BOP, deep pockets &gt; 6mm). Patient requires Step 3: Surgical Therapy!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTreatmentStep === 3 && (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/30 text-rose-300 uppercase">
                    Third Step of Therapy (Surgical Therapy)
                  </span>
                  <span className="text-xs text-rose-300 font-semibold">Quadrant-Specific Surgical Plan</span>
                </div>
                <h5 className="font-bold text-white text-sm">Resective &amp; Regenerative Quadrant Surgery</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-200">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-orange-400">1. Maxillary Right Quadrant</div>
                    <p className="text-slate-300 text-[11px]">
                      <strong>Resective periodontal surgery</strong> to eliminate pocket depths and reshape osseous architecture.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-orange-400">2. Maxillary Left Quadrant</div>
                    <p className="text-slate-300 text-[11px]">
                      <strong>Resective periodontal surgery</strong> with <strong>extraction of hopeless tooth #16</strong> (Grade II mobility).
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-emerald-500/30 space-y-1 bg-emerald-950/15">
                    <div className="font-bold text-emerald-400">3. Mandibular Left Quadrant</div>
                    <p className="text-slate-300 text-[11px]">
                      <strong>Regenerative periodontal surgery</strong> for 4 mm vertical intrabony defect on mesial of #18, in conjunction with <strong>extraction of hopeless tooth #17</strong>.
                    </p>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  • <strong>Postsurgical reevaluation</strong>: Confirm pocket reduction, bone graft consolidation at #18, and gingival healing before stepping down to SPC.
                </div>
              </div>
            )}

            {activeTreatmentStep === 4 && (
              <div className="p-4 rounded-xl bg-[#C9A24B]/15 border border-[#C9A24B]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A24B]/20 text-[#C9A24B] uppercase">
                    Fourth Step of Therapy
                  </span>
                  <span className="text-xs font-bold text-[#C9A24B]">Supportive Periodontal Care (SPC)</span>
                </div>
                <h5 className="font-bold text-white text-sm">Long-Term Maintenance (Every 3 Months)</h5>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-[#C9A24B]">
                    ★ Strict 3-month periodontal recall:
                  </div>
                  <div>• Periodic periodontal examination, probing depths &amp; BOP checks.</div>
                  <div>• Updating radiographs to monitor the regenerative graft on tooth #18.</div>
                  <div>• Ongoing smoking cessation reinforcement and counseling.</div>
                  <div>• Professional supragingival and subgingival biofilm and calculus debridement.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
