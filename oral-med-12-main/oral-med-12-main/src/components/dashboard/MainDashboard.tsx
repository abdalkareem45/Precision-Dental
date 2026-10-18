import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { OralCavity2D } from '../2d/OralCavity2D';
import { DISEASES_DATA } from '../../data/lectureData';
import { DiseaseId, MainNavTab } from '../../types';
import {
  Activity,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Microscope,
  Pill,
  CheckCircle2,
  BrainCircuit,
  Sparkles
} from 'lucide-react';

export const MainDashboard: React.FC = () => {
  const { setActiveTab, setActiveDisease, progress, setIsAiModalOpen } = useLearning();

  const handleLaunchDisease = (dId: DiseaseId) => {
    setActiveDisease(dId);
    setActiveTab('disease-module');
  };

  const completedCount = Object.values(progress.completedModules).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 6) * 100);

  const badges = [
    { id: 'badge_cmv_master', title: 'CMV Endothelial Master', desc: 'Completed Cytomegalovirus module' },
    { id: 'badge_coxsackie_expert', title: 'Enterovirus Analyst', desc: 'Completed Coxsackievirus module' },
    { id: 'badge_perio_guardian', title: 'Periodontal Strategist', desc: 'Mastered NUG / NUP & Noma' },
    { id: 'badge_target_master', title: 'Target Lesion Virtuoso', desc: 'Mastered Erythema Multiforme' },
    { id: 'badge_pharmacogenomics_pro', title: 'Pharmacogenomics Pro', desc: 'Mastered SJS / TEN management' },
    { id: 'badge_allergy_detective', title: 'Oral Allergy Detective', desc: 'Mastered Plasma Cell Stomatitis' },
    { id: 'badge_diagnostician', title: 'Clinical Diagnostician', desc: 'Solved 3 clinical cases in sandbox' },
    { id: 'badge_quiz_master', title: 'Board Exam Ace', desc: 'Scored 80%+ on Comprehensive Quiz' },
  ];

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* Hero Banner with 2D Oral Cavity Anchor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Mission Brief & Curriculum (5 cols) */}
        <div className="brand-card lg:col-span-5 rounded-2xl p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span>Precision Dental Courseware · Lecture 2</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold font-display text-brand-navy tracking-tight leading-tight">
              Ulcerative, Vesicular, and Bullous Lesions
            </h1>

            <p className="text-xs lg:text-sm text-brand-navy/75 leading-relaxed">
              Explore dynamic multi-sensory simulations of viral pathogenesis, necrotizing fuso-spirochetal tissue invasion, immune-mediated mucocutaneous target lesions, and drug-induced necrolysis.
            </p>
            <p className="font-display text-sm font-semibold text-brand-blue">Precision in Every Smile</p>
            <p lang="ar" dir="rtl" className="font-arabic text-xs font-bold text-brand-navy/60">دقّة الأسنان</p>

            {/* Core Learning Objectives Card */}
            <div className="bg-white/70 p-4 rounded-xl border border-brand-marble space-y-2 text-xs">
              <span className="font-semibold text-brand-navy block">Core Learning Objectives:</span>
              <ul className="space-y-1.5 text-brand-navy/65">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                  <span>Differentiate CMV, Coxsackie, NUG/NUP, EM, SJS/TEN, and PCS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                  <span>Map oral anatomical structures and viral latency mechanisms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                  <span>Master weight-based dosing (Valganciclovir, Acyclovir, Metronidazole)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Overall Course Progress Bar */}
          <div className="pt-6 border-t border-brand-marble mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-brand-navy/60 font-medium">Curriculum Mastery:</span>
              <span className="font-mono text-brand-blue font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-brand-marble rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-brand-gold transition-all duration-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Right Column: 2D Oral Cavity Central Navigation Hub (7 cols) */}
        <div className="lg:col-span-7 h-auto min-h-[640px] relative sm:h-[460px] sm:min-h-0">
          <OralCavity2D
            onSelectDisease={(dId) => handleLaunchDisease(dId)}
            isInteractive={true}
          />
        </div>
      </div>

      {/* Lecture 1 Premier Courseware Banner */}
      <div className="bg-brand-navy border border-brand-gold/60 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 text-brand-gold flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
            <BookOpen className="w-6 h-6 text-brand-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold border border-brand-gold/40 font-bold uppercase">
                New Syllabus Addition · Lecture 1
              </span>
              <span className="text-[11px] text-white/60 font-mono">32 Official Slides</span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
              Lecture 1: Clinical Lesion Morphology, Diascopy Lab, HSV & VZV Suite
            </h3>
            <p className="text-xs text-white/70 mt-0.5">
              Advanced Dentistry for a Brighter Tomorrow. Explore the 10 mucosal lesion classifications, glass slide blanching mechanics, trigeminal dermatomal mapping, and stepped neuropathic protocols.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('lecture-1')}
          className="brand-primary-button brand-focus px-5 py-2.5 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shrink-0 active:scale-95"
        >
          <span>Open Lecture 1 Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Disease Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-400" />
              <span>Disease Study Modules (6 Clinical Entities)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive disease chapters with 3D virions, pathogenesis sandboxes, and clinical galleries.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            {completedCount} of 6 Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(DISEASES_DATA) as DiseaseId[]).map((dId) => {
            const disease = DISEASES_DATA[dId];
            const isCompleted = progress.completedModules[dId];

            return (
              <div
                key={dId}
                onClick={() => handleLaunchDisease(dId)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-750 rounded-xl p-5 shadow-lg flex flex-col justify-between cursor-pointer group transition-all hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{ color: disease.color }}
                      className="text-[11px] font-mono font-semibold uppercase tracking-wider"
                    >
                      {disease.category}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Mastered
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">
                        Slides {disease.slidesReferenced.join(', ')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors mb-2">
                    {disease.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {disease.clinicalPearl}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 group-hover:text-slate-200">
                  <span>Enter Module</span>
                  <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Universal Sandboxes & Labs Launch Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <span>Interactive Laboratory Sandboxes</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hands-on experimentation environments for clinical reasoning, virtual microscopy, and pharmacology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              tab: 'sandbox-oral-3d' as MainNavTab,
              title: '3D Cavity Simulator',
              desc: 'Dual disease comparison, lesion progression timeline & healing outcomes.',
              icon: Stethoscope,
              tag: 'Sandbox 1',
            },
            {
              tab: 'sandbox-diagnostic' as MainNavTab,
              title: 'Diagnostic Reasoning',
              desc: '6 realistic patient cases: examine, order lab tests, and formulate diagnoses.',
              icon: BrainCircuit,
              tag: 'Sandbox 2',
            },
            {
              tab: 'sandbox-treatment' as MainNavTab,
              title: 'Rx & Pharmacology',
              desc: 'Weight-based dosage calculators, bioavailability curves, and drug interactions.',
              icon: Pill,
              tag: 'Sandbox 3',
            },
            {
              tab: 'sandbox-histo' as MainNavTab,
              title: 'Virtual Microscope',
              desc: '4x to 100x magnification: inspect CMV owl\'s eyes, NUG spirochetes & PCS plasma cells.',
              icon: Microscope,
              tag: 'Sandbox 4',
            },
          ].map((sb, idx) => {
            const Icon = sb.icon;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(sb.tab)}
                className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-xl p-5 text-left shadow-lg flex flex-col justify-between group transition-all hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{sb.tag}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors mb-1">
                    {sb.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{sb.desc}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-800 text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                  <span>Launch Lab</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements Shelf */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Board Mastery Badges</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {progress.unlockedBadges.length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b) => {
            const isUnlocked = progress.unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/50 text-amber-200'
                    : 'bg-slate-950/60 border-slate-850 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">{b.title}</span>
                  {isUnlocked && <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-400">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
