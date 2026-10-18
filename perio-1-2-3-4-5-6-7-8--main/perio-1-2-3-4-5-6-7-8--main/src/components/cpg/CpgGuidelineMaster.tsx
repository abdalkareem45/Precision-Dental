import React, { useState } from 'react';
import {
  BookOpen,
  Boxes,
  GitBranch,
  Ruler,
  UserCheck,
  HelpCircle,
  GraduationCap,
  Sparkles,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { CpgStepViewer3D, CpgStep3D } from './CpgStepViewer3D';
import { CpgDecisionTree2D } from './CpgDecisionTree2D';
import { CpgCaseWalkthrough } from './CpgCaseWalkthrough';
import { CpgCrossSection2D } from './CpgCrossSection2D';
import { CpgQuizModule } from './CpgQuizModule';

type SubView =
  | '3d_viewer'
  | 'decision_tree'
  | 'cross_section'
  | 'case_scenarios'
  | 'quiz';

export const CpgGuidelineMaster: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<SubView>('3d_viewer');
  const [viewer3DStep, setViewer3DStep] = useState<CpgStep3D>('step2_subgingival');

  const handleSelect3DStepFromTree = (stepKey: string) => {
    setViewer3DStep(stepKey as CpgStep3D);
    setActiveSubView('3d_viewer');
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1e4a] via-[#091536] to-[#060c1d] border border-[#C9A24B]/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C9A24B] text-slate-950 uppercase tracking-wider shadow-md">
                Lecture 3 of 8
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Done By Dr. Alaa Omran (5th Class)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                EFP / AAP S3 Level Guideline
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Lecture 3: Clinical Practice Guideline (CPG) for Treatment of Periodontitis
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              A comprehensive framework based on the highest level of available evidence, assisting clinicians in decision-making to support best practices.
              Explore the 4 steps of therapy, re-evaluation endpoints, and interactive case simulations with 2D &amp; 3D visuals.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shrink-0 flex flex-col gap-2 min-w-[260px] shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
              <span className="font-semibold text-white">CPG Framework</span>
              <span className="text-[#C9A24B] font-bold">2020 S3 Level</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Steps of Therapy:</span>
              <span className="font-mono font-bold text-cyan-400">4 Sequential Steps</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>SPC Recall:</span>
              <span className="font-mono font-bold text-amber-400">Every 3 Months</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Re-eval Milestone:</span>
              <span className="font-mono font-bold text-emerald-400">4–8 Weeks Post-SRP</span>
            </div>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto pt-6 mt-6 border-t border-slate-800/80 scrollbar-thin">
          <button
            onClick={() => setActiveSubView('3d_viewer')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubView === '3d_viewer'
                ? 'bg-[#C9A24B] text-slate-950 shadow-lg shadow-[#C9A24B]/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>3D Stepwise Visualizer</span>
          </button>

          <button
            onClick={() => setActiveSubView('decision_tree')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubView === 'decision_tree'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>2D Decision Tree &amp; Endpoints</span>
          </button>

          <button
            onClick={() => setActiveSubView('cross_section')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubView === 'cross_section'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>2D Cross-Section &amp; Probing</span>
          </button>

          <button
            onClick={() => setActiveSubView('case_scenarios')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubView === 'case_scenarios'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Case Scenarios 1 &amp; 2</span>
          </button>

          <button
            onClick={() => setActiveSubView('quiz')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubView === 'quiz'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>CPG Board Quiz</span>
          </button>
        </div>
      </div>

      {/* Sub-view 1: 3D Stepwise Visualizer & Core Theory */}
      {activeSubView === '3d_viewer' && (
        <div className="space-y-6">
          <CpgStepViewer3D
            currentStep={viewer3DStep}
            onStepChange={setViewer3DStep}
            height="560px"
          />

          {/* High-Yield Dr. Alaa Omran Lecture Core Notes Card */}
          <div className="bg-[#0b1736] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-[#C9A24B]" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Dr. Alaa Omran Lecture Synopsis: CPG Development &amp; The 4 Steps
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-400 text-sm block">1. CPG Development Process</span>
                <p className="leading-relaxed">
                  CPG development begins with:
                </p>
                <ul className="space-y-1 text-slate-300 pl-2">
                  <li>• Defining the clinical problem</li>
                  <li>• Assembling a team of expert periodontists &amp; methodologists</li>
                  <li>• Conducting systematic review(s) on the given topic</li>
                  <li>• Translating findings into evidence-based clinical recommendations</li>
                </ul>
                <p className="leading-relaxed pt-1 text-slate-400">
                  In 2020, the CPG for stage I to III periodontitis was established as the first comprehensive guideline providing recommendations from behavioral modifications to complex surgeries.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-bold text-[#C9A24B] text-sm block">2. Re-evaluation Milestone &amp; Endpoints</span>
                <p className="leading-relaxed">
                  Conducted at <strong>4–8 weeks</strong> post-subgingival instrumentation:
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 space-y-1">
                  <div className="font-bold text-white">Endpoints of Therapy:</div>
                  <div>✓ No periodontal pocket &gt; 4 mm with BOP</div>
                  <div>✓ No deep periodontal pocket &gt; 6 mm</div>
                </div>
                <p className="leading-relaxed pt-1 text-slate-300">
                  If endpoint achieved → <strong>Step 4: Supportive Periodontal Care (SPC)</strong>.<br />
                  If endpoint NOT achieved → <strong>Step 3: Surgical Therapy</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 2: 2D Decision Tree */}
      {activeSubView === 'decision_tree' && (
        <CpgDecisionTree2D onSelectStepToView={handleSelect3DStepFromTree} />
      )}

      {/* Sub-view 3: 2D Cross-Section & Probing */}
      {activeSubView === 'cross_section' && (
        <CpgCrossSection2D />
      )}

      {/* Sub-view 4: Case Scenarios 1 & 2 */}
      {activeSubView === 'case_scenarios' && (
        <CpgCaseWalkthrough />
      )}

      {/* Sub-view 5: Board Quiz */}
      {activeSubView === 'quiz' && (
        <CpgQuizModule />
      )}
    </div>
  );
};
