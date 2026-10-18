import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Shield,
  Scissors,
  Sparkles,
  Info,
  Clock,
  Activity,
  Layers,
  Sliders
} from 'lucide-react';

interface CpgDecisionTree2DProps {
  onSelectStepToView?: (stepKey: string) => void;
}

export const CpgDecisionTree2D: React.FC<CpgDecisionTree2DProps> = ({ onSelectStepToView }) => {
  // Interactive Simulator inputs
  const [testPD, setTestPD] = useState<number>(5);
  const [testBOP, setTestBOP] = useState<boolean>(true);
  const [activeStepTab, setActiveStepTab] = useState<'step1' | 'step2' | 'step3' | 'step4'>('step2');

  // Decision logic from Dr. Alaa Omran's lecture:
  // "End points of therapy:
  //  - no periodontal pocket > 4mm with BOP
  //  - No deep periodontal pocket > 6mm
  //  if end point of therapy achieved -> SPC"
  // If PD <= 4mm with no BOP -> Pass to SPC
  // If PD >= 6mm OR (PD >= 4mm with BOP) -> Proceed to Step 3 Surgical Therapy
  const isDeepPocket = testPD >= 6;
  const isPocketWithBOP = testPD >= 4 && testBOP;
  const isEndPointAchieved = testPD <= 4 && !testBOP;
  const goesToSurgery = !isEndPointAchieved;

  return (
    <div className="bg-[#0b1736] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      {/* Title & Clinical Practice Guidelines Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/30 uppercase tracking-wider">
              2D Clinical Decision Tree
            </span>
            <span className="text-xs text-slate-400">EFP S3 Level CPG Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-[#C9A24B]" />
            Stepwise Treatment Pathway &amp; Endpoints of Therapy
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Based on the clinical practice guideline (CPG) by <strong className="text-white">Dr. Alaa Omran (5th class, 2024-2025)</strong>.
            Interactive gating determines whether patients advance to Step 4 (SPC) or require Step 3 (Surgical therapy).
          </p>
        </div>

        {/* Live Re-Evaluation Simulator Widget */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 sm:p-4 shrink-0 shadow-lg min-w-[280px]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-2">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sliders className="w-4 h-4" />
              Re-eval Simulator
            </span>
            <span className="text-[10px] text-slate-400">Week 4–8 Post-Step 2</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Residual Pocket Depth (PD):</span>
                <span className="font-mono font-bold text-white">{testPD} mm</span>
              </div>
              <input
                type="range"
                min="2"
                max="9"
                value={testPD}
                onChange={(e) => setTestPD(parseInt(e.target.value))}
                className="w-full accent-[#C9A24B] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={testBOP}
                onChange={(e) => setTestBOP(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 bg-slate-800 border-slate-600 focus:ring-rose-500 cursor-pointer"
              />
              <span>Bleeding on Probing (BOP) Present</span>
            </label>

            {/* Simulated Outcome Badge */}
            <div className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
              isEndPointAchieved
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}>
              {isEndPointAchieved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <div>
                    <div className="font-bold">Endpoints Achieved!</div>
                    <div className="text-[10px] text-emerald-200/80">Route to Step 4: SPC (every 3 months)</div>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <div>
                    <div className="font-bold">Endpoints Not Achieved!</div>
                    <div className="text-[10px] text-rose-200/80">
                      {isDeepPocket ? 'Deep pocket > 6mm' : 'Pocket > 4mm with BOP'} → Route to Step 3 Surgery
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 2D Flowchart Graphic */}
      <div className="relative p-6 rounded-2xl bg-slate-950/70 border border-slate-800 overflow-x-auto">
        <div className="min-w-[760px] flex flex-col gap-6 items-center">
          {/* Top: Step 1 and Step 2 in Sequence */}
          <div className="w-full grid grid-cols-2 gap-6">
            {/* Step 1 Card */}
            <div
              onClick={() => {
                setActiveStepTab('step1');
                if (onSelectStepToView) onSelectStepToView('step1_biofilm');
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                activeStepTab === 'step1'
                  ? 'border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400'
                  : 'border-slate-700 bg-slate-900/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Step 1
                </span>
                <span className="text-[10px] text-amber-300/80 font-medium">All Periodontitis Patients</span>
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base">Behavior &amp; Risk Factor Modification</h3>
              <ul className="mt-2 text-xs text-slate-300 space-y-1">
                <li className="flex items-center gap-1.5">• Guiding behavior change &amp; motivation</li>
                <li className="flex items-center gap-1.5">• Supragingival biofilm control (OHI, PMPR)</li>
                <li className="flex items-center gap-1.5">• Risk factor control (smoking cessation, glycemic control)</li>
                <li className="flex items-center gap-1.5">• Removal of plaque-retentive factors &amp; restorations</li>
              </ul>
            </div>

            {/* Step 2 Card */}
            <div
              onClick={() => {
                setActiveStepTab('step2');
                if (onSelectStepToView) onSelectStepToView('step2_subgingival');
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                activeStepTab === 'step2'
                  ? 'border-blue-400 bg-blue-950/20 shadow-lg shadow-blue-950/40 ring-1 ring-blue-400'
                  : 'border-slate-700 bg-slate-900/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                  Step 2
                </span>
                <span className="text-[10px] text-blue-300/80 font-medium">Sites with PD &gt; 3mm</span>
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base">Cause-Related Therapy</h3>
              <ul className="mt-2 text-xs text-slate-300 space-y-1">
                <li className="flex items-center gap-1.5">• Subgingival instrumentation (scaling &amp; root planing)</li>
                <li className="flex items-center gap-1.5">• Controlling subgingival biofilm &amp; calculus</li>
                <li className="flex items-center gap-1.5">• Adjunctive chemical/physical agents &amp; antiseptics</li>
                <li className="flex items-center gap-1.5">• Adjunctive host-modulating &amp; antimicrobials (local/systemic)</li>
              </ul>
            </div>
          </div>

          {/* Arrow down to Re-evaluation checkpoint */}
          <div className="flex flex-col items-center text-slate-500">
            <span className="text-[11px] font-mono text-cyan-400 font-semibold mb-1">
              Periodontal Re-evaluation (4–8 Weeks Post-SRP)
            </span>
            <div className="w-0.5 h-6 bg-cyan-500/50" />
            <ArrowDown className="w-4 h-4 text-cyan-400 -mt-1" />
          </div>

          {/* Central Decision Diamond */}
          <div className={`p-4 rounded-2xl border text-center transition-all max-w-md ${
            isEndPointAchieved
              ? 'border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-900/30'
              : 'border-rose-500 bg-rose-950/30 shadow-lg shadow-rose-900/30'
          }`}>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-1">
              Re-evaluation Endpoints Decision
            </span>
            <div className="text-sm font-bold text-white mb-2">
              Endpoints of Periodontal Therapy:
            </div>
            <div className="text-xs text-slate-300 space-y-1 text-left bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span><strong>No periodontal pocket &gt; 4mm with BOP</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span><strong>No deep periodontal pocket &gt; 6mm</strong></span>
              </div>
            </div>
          </div>

          {/* Fork in Road: Step 3 (Surgical) OR Step 4 (SPC) */}
          <div className="w-full grid grid-cols-2 gap-8 items-start relative">
            {/* Left Branch: If NOT Achieved -> Step 3 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-400 mb-2 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Endpoint NOT Achieved (PD ≥ 6mm or PD ≥ 4mm + BOP)</span>
              </div>
              <div className="w-0.5 h-5 bg-rose-500/50" />
              <ArrowDown className="w-4 h-4 text-rose-400 -mt-1" />

              <div
                onClick={() => {
                  setActiveStepTab('step3');
                  if (onSelectStepToView) onSelectStepToView('step3_access_flap');
                }}
                className={`w-full mt-2 p-4 rounded-xl border transition-all cursor-pointer ${
                  activeStepTab === 'step3' || goesToSurgery
                    ? 'border-rose-400 bg-rose-950/20 shadow-lg shadow-rose-950/30 ring-1 ring-rose-400'
                    : 'border-slate-700 bg-slate-900/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                    Third Step
                  </span>
                  <span className="text-[10px] text-rose-300 font-semibold">Surgical Therapy</span>
                </div>
                <h3 className="font-bold text-white text-sm">Treat Non-Responding Sites</h3>
                <p className="text-xs text-slate-300 mt-1 mb-2">
                  Further access to subgingival instrumentation OR regenerating or resecting lesions adding complexity.
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="p-1.5 rounded bg-slate-800/80 text-slate-200 border border-slate-700/50">
                    • Repeated subgingival instrumentation
                  </div>
                  <div className="p-1.5 rounded bg-slate-800/80 text-slate-200 border border-slate-700/50">
                    • Access flap periodontal surgery
                  </div>
                  <div className="p-1.5 rounded bg-slate-800/80 text-slate-200 border border-slate-700/50">
                    • Resective periodontal surgery
                  </div>
                  <div className="p-1.5 rounded bg-slate-800/80 text-slate-200 border border-slate-700/50">
                    • Regenerative periodontal surgery
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="text-slate-400">Postoperative evaluation:</span>
                  <span className="font-semibold text-emerald-400">When PD ≤ 4mm &amp; no BOP →</span>
                </div>
              </div>
            </div>

            {/* Right Branch: If Achieved -> Step 4 SPC */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 mb-2 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Endpoint Achieved (PD ≤ 4mm without BOP)</span>
              </div>
              <div className="w-0.5 h-5 bg-emerald-500/50" />
              <ArrowDown className="w-4 h-4 text-emerald-400 -mt-1" />

              <div
                onClick={() => {
                  setActiveStepTab('step4');
                  if (onSelectStepToView) onSelectStepToView('step4_spc');
                }}
                className={`w-full mt-2 p-4 rounded-xl border transition-all cursor-pointer ${
                  activeStepTab === 'step4' || isEndPointAchieved
                    ? 'border-[#C9A24B] bg-[#C9A24B]/10 shadow-lg shadow-[#C9A24B]/20 ring-1 ring-[#C9A24B]'
                    : 'border-slate-700 bg-slate-900/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/30 uppercase">
                    Fourth Step
                  </span>
                  <span className="text-[10px] font-bold text-[#C9A24B]">Supportive Periodontal Care (SPC)</span>
                </div>
                <h3 className="font-bold text-white text-sm">Long-Term Periodontal Stability</h3>
                <p className="text-xs text-slate-300 mt-1 mb-2">
                  Combines preventive and therapeutic interventions from Steps 1 and 2 to prevent disease progression.
                </p>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li className="flex items-center gap-1.5 font-semibold text-amber-300">
                    ★ Performed every 3 months interval!
                  </li>
                  <li className="flex items-center gap-1.5">
                    • Reinforcement of proper biofilm control &amp; OHI modification
                  </li>
                  <li className="flex items-center gap-1.5">
                    • Assessment &amp; modification of risk factors (smoking/glycemic control)
                  </li>
                  <li className="flex items-center gap-1.5">
                    • Professional supra &amp; subgingival biofilm and calculus removal
                  </li>
                  <li className="flex items-center gap-1.5">
                    • Re-evaluation to detect and treat repocketing early
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Detail Tabs / Clinical Pearl Matrix */}
      <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
          <Info className="w-4 h-4 text-[#C9A24B]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Detailed Step Protocols &amp; Clinical Rules (Dr. Alaa Omran)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-amber-500/20">
            <span className="font-bold text-amber-400 block mb-1">Step 1: Biofilm &amp; Risk</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Every single periodontitis patient must receive Step 1. Includes PMPR, oral hygiene instruction, motivation, and controlling systemic risk factors like smoking and diabetes.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-blue-500/20">
            <span className="font-bold text-blue-400 block mb-1">Step 2: Cause-Related</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Subgingival instrumentation at sites with pockets &gt; 3mm. Adjunctive antimicrobials or host-modulating agents applied when indicated. Mandatory re-evaluation in 4–8 weeks.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-rose-500/20">
            <span className="font-bold text-rose-400 block mb-1">Step 3: Surgical Therapy</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Indicated when pockets remain &gt; 4mm with BOP or deep pockets &gt; 6mm. Modalities include open access flap, resective surgery, or regenerative therapy (grafts/membranes) for intrabony defects.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-[#C9A24B]/20">
            <span className="font-bold text-[#C9A24B] block mb-1">Step 4: SPC (Maintenance)</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Recall interval is strictly every 3 months. Maintains periodontal stability, reassesses risk habits, removes residual subgingival deposits, and monitors for repocketing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
