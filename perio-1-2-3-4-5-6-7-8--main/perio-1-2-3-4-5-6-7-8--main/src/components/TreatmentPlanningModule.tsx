import React, { useState } from 'react';
import {
  GitCommit,
  CheckCircle2,
  Calendar,
  AlertOctagon,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Clock,
  ExternalLink,
  ChevronRight,
  Stethoscope,
  Scissors,
  Repeat,
  CheckSquare,
  Square
} from 'lucide-react';
import { STAGE_IV_PHENOTYPES } from '../data/curriculumData';
import { StageIVPhenotype } from '../types/periodontics';
import { StageIV3DViewer } from './StageIV3DViewer';
import { InteractiveTimelinePlanner } from './InteractiveTimelinePlanner';

export const TreatmentPlanningModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'steps' | 'stage4_types' | 'timeline'>('steps');
  const [selectedStep, setSelectedStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCaseType, setSelectedCaseType] = useState<number>(1);

  // Interactive Checklist State for Step 1, 2, 3
  const [completedInterventions, setCompletedInterventions] = useState<Record<string, boolean>>({
    step1_ohi: true,
    step1_pmpr: true,
    step1_smoking: false,
    step2_srp: true,
    step2_reeval: false,
    step3_flap: false
  });

  // Re-evaluation Endpoints Simulator State
  const [reevalMaxPd, setReevalMaxPd] = useState<number>(3.5); // mm
  const [reevalHasBleedingPockets, setReevalHasBleedingPockets] = useState<boolean>(false);

  const toggleIntervention = (key: string) => {
    setCompletedInterventions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activePhenotype: StageIVPhenotype = STAGE_IV_PHENOTYPES.find(
    (p) => p.caseType === selectedCaseType
  ) || STAGE_IV_PHENOTYPES[0];

  const endpointsAchieved = reevalMaxPd <= 4.0 && !reevalHasBleedingPockets;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Lecture 7 Banner */}
      <div className="bg-gradient-to-r from-[#071433] via-[#0B1F4D] to-[#12285e] border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C9A24B] text-slate-950 uppercase tracking-wider shadow-md">
            Lecture 7 of 8
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-500/30">
            EFP S3 Clinical Practice Guideline
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Tonetti, Sanz &amp; Herrera 2020
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Lecture 7: Stepwise Treatment Planning &amp; Stage IV Rehabilitation
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Deterministic 4-step therapy protocol, clinical re-evaluation thresholds (&le;4mm pockets with no BOP), and multidisciplinary management of Stage IV Phenotypes (Secondary Trauma, Pathological Migration, and Bite Collapse).
        </p>
      </div>

      {/* Top Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-2.5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'steps'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GitCommit className="w-4 h-4 text-blue-300" />
            Steps 1–4 Periodontal Therapy
          </button>

          <button
            onClick={() => setActiveTab('stage4_types')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'stage4_types'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-300" />
            Stage IV 3D Phenotype Cases (1–4)
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-300" />
            Interactive Visit Scheduler &amp; Auditor
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 pr-2 hidden sm:block">
          EFP S3 Level CPG (JCP 2020)
        </div>
      </div>

      {/* 1. STEPS 1 TO 4 PERIODONTAL THERAPY EXPLORER WITH INTERACTIVE DECISION TREE */}
      {activeTab === 'steps' && (
        <div className="space-y-6">
          {/* Step Selector Breadcrumb Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                step: 1,
                title: 'Step 1: Guiding Behavior Change',
                subtitle: 'Biofilm Control, OHI, PMPR & Risk Factors',
                color: 'border-blue-500 bg-blue-950/40 text-blue-400'
              },
              {
                step: 2,
                title: 'Step 2: Cause-Related Therapy',
                subtitle: 'Subgingival Instrumentation & Re-eval',
                color: 'border-cyan-500 bg-cyan-950/40 text-cyan-400'
              },
              {
                step: 3,
                title: 'Step 3: Surgical & Non-Responding',
                subtitle: 'Access Flap & Regeneration',
                color: 'border-purple-500 bg-purple-950/40 text-purple-400'
              },
              {
                step: 4,
                title: 'Step 4: Supportive Care (SPC)',
                subtitle: 'Interview, Assess, Intervene, 3-Mo Recall',
                color: 'border-emerald-500 bg-emerald-950/40 text-emerald-400'
              }
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setSelectedStep(s.step as any)}
                className={`p-4 rounded-2xl border text-left transition flex flex-col gap-1.5 cursor-pointer ${
                  selectedStep === s.step
                    ? `${s.color} ring-2 ring-blue-500/50 shadow-xl scale-[1.02]`
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">Step 0{s.step}</span>
                  {selectedStep === s.step && <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>}
                </div>
                <div className="text-sm font-bold text-white">{s.title}</div>
                <div className="text-[11px] text-slate-400">{s.subtitle}</div>
              </button>
            ))}
          </div>

          {/* Detailed Content & Interactive Decision Tree */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6">
            {selectedStep === 1 && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800 font-semibold">
                    Universal Prerequisite (Implemented in All Periodontitis Patients)
                  </span>
                  <h3 className="text-2xl font-black text-white mt-2">
                    Step 1: Guiding Behavior Change &amp; Risk Factor Control
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">
                    Aimed at motivating the patient to undertake successful supragingival dental biofilm control and eliminate modifiable risk factors.
                  </p>
                </div>

                {/* Interactive Checklist */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Interactive Clinical Checklist for Step 1:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'step1_ohi', title: 'Personalized Oral Hygiene Instructions (OHI)', desc: 'Interdental brush sizing + modified Bass brushing' },
                      { id: 'step1_pmpr', title: 'Professional Mechanical Plaque Removal (PMPR)', desc: 'Supragingival scaling & polishing of all retentive factors' },
                      { id: 'step1_smoking', title: 'Smoking Cessation Counseling', desc: '5-A protocol to eliminate Grade C progression trigger' },
                      { id: 'step1_diabetes', title: 'Diabetes Glycemic Referral (HbA1c Target <7.0%)', desc: 'Medical coordination for metabolic control' }
                    ].map((chk) => {
                      const done = completedInterventions[chk.id];
                      return (
                        <button
                          key={chk.id}
                          onClick={() => toggleIntervention(chk.id)}
                          className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                            done ? 'bg-blue-950/70 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {done ? <CheckSquare className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />}
                          <div>
                            <div className="font-semibold text-xs text-slate-200">{chk.title}</div>
                            <div className="text-[11px] text-slate-400">{chk.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {selectedStep === 2 && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800 font-semibold">
                    Cause-Related Active Debridement
                  </span>
                  <h3 className="text-2xl font-black text-white mt-2">
                    Step 2: Subgingival Instrumentation &amp; Re-Evaluation
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">
                    Aimed at controlling (reducing/eliminating) subgingival biofilm and calculus in all teeth with periodontal pocket formation.
                  </p>
                </div>

                {/* Re-evaluation Interactive Decision Tree Simulator */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-cyan-400" />
                      6–12 Week Periodontal Re-Evaluation Simulator:
                    </span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${endpointsAchieved ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'}`}>
                      {endpointsAchieved ? 'Endpoints Achieved' : 'Residual Pockets Present'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Max Residual Probing Depth:</span>
                        <span className="font-mono text-cyan-400 font-bold">{reevalMaxPd} mm</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="8"
                        step="0.5"
                        value={reevalMaxPd}
                        onChange={(e) => setReevalMaxPd(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>≤4 mm (Target Closed)</span>
                        <span>≥6 mm (Deep Residual)</span>
                      </div>
                    </div>

                    <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
                      <span className="text-slate-300 text-xs">Persistent 4mm sites bleeding on probing?</span>
                      <input
                        type="checkbox"
                        checked={reevalHasBleedingPockets}
                        onChange={(e) => setReevalHasBleedingPockets(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-500"
                      />
                    </label>
                  </div>

                  {/* Decision Tree Outcome Box */}
                  <div className={`p-4 rounded-xl border text-xs space-y-1 ${endpointsAchieved ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' : 'bg-amber-950/60 border-amber-500/50 text-amber-200'}`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {endpointsAchieved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertOctagon className="w-4 h-4 text-amber-400" />}
                      <span>{endpointsAchieved ? 'Clinical Endpoints Achieved → Proceed directly to Step 4 (Supportive Periodontal Care - SPC).' : 'Clinical Endpoints Not Met → Residual deep pockets mandate Step 3 therapy!'}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {endpointsAchieved
                        ? 'All pockets ≤4 mm with zero bleeding at 4 mm sites. Patient qualifies for supportive maintenance.'
                        : 'Pockets ≥4 mm with BOP or deep pockets ≥6 mm require repeated subgingival debridement or access flap/regenerative surgery (Step 3).'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedStep === 3 && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-400 bg-purple-950 px-3 py-1 rounded-full border border-purple-800 font-semibold">
                    Non-Responding Pockets &amp; Complex Defects
                  </span>
                  <h3 className="text-2xl font-black text-white mt-2">
                    Step 3: Surgical Interventions &amp; Periodontal Regeneration
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">
                    Aimed at treating non-responding areas (pockets ≥4 mm with BOP or deep pockets ≥6 mm) to gain direct visual access or regenerate lost attachment.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Scissors className="w-4 h-4 text-purple-400" />
                      Access Flap Surgery
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      Open flap debridement / Modified Widman Flap to visualize and instrument deep root surfaces.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Regenerative Surgery
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      Bone grafts, enamel matrix derivative (EMD), and membranes for 2-wall and 3-wall intrabony defects.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-blue-400" />
                      Resective Surgery
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      Apically positioned flap with osseous recontouring for persistent non-regenerable pockets.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedStep === 4 && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800 font-semibold">
                    Lifelong Disease Stability &amp; Maintenance
                  </span>
                  <h3 className="text-2xl font-black text-white mt-2">
                    Step 4: Supportive Periodontal Care (SPC)
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">
                    Crucial lifelong phase combining preventive and therapeutic interventions at 3-month intervals to maintain stability.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="font-bold text-emerald-400 font-mono">1. Interview</div>
                    <p className="text-[11px] text-slate-400 mt-1">Medical/social history, symptoms, smoking, diabetes.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="font-bold text-emerald-400 font-mono">2. Assessment</div>
                    <p className="text-[11px] text-slate-400 mt-1">Plaque &amp; calculus deposits, PPDs, BOP score, mobility.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="font-bold text-emerald-400 font-mono">3. Evaluation</div>
                    <p className="text-[11px] text-slate-400 mt-1">Intervention needs, oral hygiene efficacy, risk factor management.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="font-bold text-emerald-400 font-mono">4. Intervention</div>
                    <p className="text-[11px] text-slate-400 mt-1">OHI coaching, instrumentation, re-treating recurrent sites.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="font-bold text-emerald-400 font-mono">5. Planning</div>
                    <p className="text-[11px] text-slate-400 mt-1">Interval to next visit (typically 3-monthly).</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. STAGE IV INTERDISCIPLINARY PHENOTYPES WITH 3D CASE VIEWER */}
      {activeTab === 'stage4_types' && (
        <div className="space-y-6">
          {/* Warning Banner */}
          <div className="bg-rose-950/50 p-4 rounded-2xl border border-rose-500/50 text-xs text-rose-200 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Critical Clinical Directive (J. Clin. Periodontol. 2020):</strong> In Stage IV periodontitis, a <em>"no treatment"</em> option must be strongly discouraged due to the imminent risk of total loss of the dentition.
            </div>
          </div>

          {/* Phenotype Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STAGE_IV_PHENOTYPES.map((pt) => (
              <button
                key={pt.caseType}
                onClick={() => setSelectedCaseType(pt.caseType)}
                className={`p-4 rounded-2xl border text-left transition flex flex-col gap-1.5 cursor-pointer ${
                  selectedCaseType === pt.caseType
                    ? 'bg-purple-950/80 border-purple-500 ring-2 ring-purple-500/40 shadow-xl scale-[1.02]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <span className="font-mono text-xs font-bold text-purple-400">Case Type {pt.caseType}</span>
                <span className="text-xs font-bold text-white line-clamp-2">{pt.title.split(': ')[1]}</span>
              </button>
            ))}
          </div>

          {/* 3D Simulation for Selected Phenotype */}
          <StageIV3DViewer phenotype={activePhenotype} />

          {/* Detailed Selected Phenotype Clinical Protocol */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-white">{activePhenotype.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{activePhenotype.shortDescription}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Stepwise Sequencing Protocol:</span>
                <ol className="space-y-1.5 text-slate-300 text-[11px]">
                  {activePhenotype.periodontalTherapySequence.map((seq, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-blue-400 font-bold">{i + 1}.</span>
                      <span>{seq}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-500/40 space-y-2 text-rose-200">
                <span className="font-bold text-white block">Critical Clinical Rules:</span>
                <ul className="space-y-1.5 text-[11px]">
                  {activePhenotype.criticalRules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">⚠️</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CLINICAL VISIT SEQUENCING TIMELINE (DRAG & DROP SCHEDULER & AUDITOR) */}
      {activeTab === 'timeline' && <InteractiveTimelinePlanner />}
    </div>
  );
};
