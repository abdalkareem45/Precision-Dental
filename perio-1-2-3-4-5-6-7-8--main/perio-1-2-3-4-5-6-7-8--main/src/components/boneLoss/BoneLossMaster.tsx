import React, { useState, useEffect } from 'react';
import { BoneLossTab, BoneDefect3DType } from './types';
import { InteractiveLecture } from './InteractiveLecture';
import { BoneLoss3DCanvas } from './BoneLoss3DCanvas';
import { Periodontal3DCrossSection } from './Periodontal3DCrossSection';
import { DefectSimulator } from './DefectSimulator';
import { ComparisonMode } from './ComparisonMode';
import { OsseousMorphology } from './OsseousMorphology';
import { FurcationModule } from './FurcationModule';
import { AIPeriodontology } from './AIPeriodontology';
import { QuizModule } from './QuizModule';
import { RapidReview } from './RapidReview';
import {
  BookOpen,
  Boxes,
  Layers,
  Split,
  Compass,
  Brain,
  HelpCircle,
  Zap,
  Activity,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

export const BoneLossMaster: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<BoneLossTab>('crossSection');
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('boneloss_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const markModuleCompleted = (tabKey: string) => {
    const updated = { ...completedModules, [tabKey]: true };
    setCompletedModules(updated);
    try {
      localStorage.setItem('boneloss_progress', JSON.stringify(updated));
    } catch {}
  };

  useEffect(() => {
    markModuleCompleted(activeSubTab);
  }, [activeSubTab]);

  const navItems: { id: BoneLossTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'lecture', label: '1. Interactive Lecture', icon: <BookOpen className="w-4 h-4 text-amber-400" />, badge: 'PDF Core' },
    { id: 'crossSection', label: '2. 3D Tissue Cross-Section', icon: <Activity className="w-4 h-4 text-rose-400" />, badge: 'Real-Time Three.js' },
    { id: 'threeD', label: '3. 3D Macro Anatomy Lab', icon: <Boxes className="w-4 h-4 text-cyan-400" />, badge: 'Three.js' },
    { id: 'defects', label: '4. 3D Defect Simulator', icon: <Layers className="w-4 h-4 text-purple-400" />, badge: '1-3 Walls' },
    { id: 'comparisons', label: '5. Split Comparison', icon: <Split className="w-4 h-4 text-blue-400" />, badge: 'Horiz vs Vert' },
    { id: 'morphology', label: '6. Craters & Morphologies', icon: <Sparkles className="w-4 h-4 text-amber-400" />, badge: '35.2% / 62%' },
    { id: 'furcation', label: '7. Furcation (Glickman)', icon: <Compass className="w-4 h-4 text-emerald-400" />, badge: 'Grades I–IV' },
    { id: 'ai', label: '8. AI in Periodontology', icon: <Brain className="w-4 h-4 text-indigo-400" />, badge: 'Studies & ML' },
    { id: 'quiz', label: '9. Board Exam Quiz', icon: <HelpCircle className="w-4 h-4 text-yellow-400" />, badge: '24 Questions' },
    { id: 'rapidReview', label: '10. Rapid Review', icon: <Zap className="w-4 h-4 text-orange-400" />, badge: 'High-Yield' }
  ];

  const totalModules = navItems.length;
  const completedCount = Object.keys(completedModules).length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalModules) * 100));

  return (
    <div className="w-full flex flex-col gap-6 pb-16 font-sans">
      {/* Flagship Academic Banner with Precision Dental Brand Identity */}
      <section className="bg-gradient-to-r from-[#071433] via-[#0B1F4D] to-[#1B3A8C] border border-[#E6E8EC]/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-[#C9A24B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1B3A8C] text-[#FAF8F3] border border-[#C9A24B]/40 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" /> Precision Dental
            </span>
            <span dir="rtl" className="px-3 py-1 rounded-full text-xs font-bold font-arabic bg-[#0B1F4D] text-[#dfbe6e] border border-[#C9A24B]/40">
              دقّة الأسنان
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#C9A24B] text-slate-950 flex items-center gap-1.5 shadow-md">
              <BookOpen className="w-3.5 h-3.5" /> Lecture 1 of 8
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#071433] text-[#C9A24B] border border-[#C9A24B]/30 flex items-center gap-1.5">
              5th-Year Periodontology PDF
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-xs font-bold text-[#C9A24B] tracking-wider uppercase">
              "Precision in Every Smile" • Advanced Dentistry for a Brighter Tomorrow
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#FAF8F3] tracking-tight">
              Lecture 1: Bone Loss and Patterns of <span className="text-[#C9A24B]">Bone Destruction</span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-[#FAF8F3]/85 leading-relaxed max-w-3xl">
            Interactive medical education platform covering equilibrium dynamics, pathways of inflammation,
            radius of action (1.5 to 2.5 mm), 3D vertical defect wall counts, osseous craters,
            Glickman furcation grading, and artificial intelligence in periodontology.
          </p>

          {/* Student Progress Bar */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 bg-[#071433] h-2.5 rounded-full overflow-hidden border border-[#E6E8EC]/20">
              <div
                className="h-full bg-gradient-to-r from-[#1B3A8C] via-[#C9A24B] to-[#dfbe6e] transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-[#FAF8F3]/80 shrink-0">
              Progress: <strong className="text-[#C9A24B]">{completedCount}</strong> / {totalModules} Modules Studied ({progressPercent}%)
            </span>
          </div>
        </div>
      </section>

      {/* Persistent Navigation Toolbar */}
      <nav className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg backdrop-blur-xl sticky top-16 z-30">
        {navItems.map((item) => {
          const isActive = activeSubTab === item.id;
          const isDone = !!completedModules[item.id];
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 relative ${
                isActive
                  ? 'bg-amber-600/25 text-white border border-amber-500/60 shadow-md ring-1 ring-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-mono bg-slate-800 text-cyan-300 px-1.5 py-0.2 rounded">
                  {item.badge}
                </span>
              )}
              {isDone && !isActive && (
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* =========================================================================
          ACTIVE MODULE VIEWPORT
          ========================================================================= */}
      <main className="w-full">
        {/* Module 1: Interactive Lecture */}
        {activeSubTab === 'lecture' && <InteractiveLecture />}

        {/* Module 2: Interactive 3D Periodontal Tissue Cross-Section (Inflammation & Destruction Dynamics) */}
        {activeSubTab === 'crossSection' && (
          <div className="space-y-4">
            <Periodontal3DCrossSection height="560px" />
          </div>
        )}

        {/* Module 3: Dedicated 3D Macro Anatomy Lab */}
        {activeSubTab === 'threeD' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Interactive 3D Visualizer
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  3D Alveolar Bone &amp; Tooth Structure Anatomy
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                  Inspect 3D procedural geometries for healthy bone, horizontal flat loss, and vertical cuneiform angular defects.
                  Drag to rotate, pinch/scroll to zoom, and toggle anatomical tissue layers.
                </p>
              </div>

              <button
                onClick={() => setActiveSubTab('crossSection')}
                className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-xs font-bold text-rose-300 flex items-center gap-2 shrink-0 transition"
              >
                <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>Switch to 3D Tissue Cross-Section</span>
              </button>
            </div>
            <BoneLoss3DCanvas defectType="horizontal" height="540px" />
          </div>
        )}

        {/* Module 3: 3D Defect Simulator */}
        {activeSubTab === 'defects' && <DefectSimulator />}

        {/* Module 4: Split Comparison Mode */}
        {activeSubTab === 'comparisons' && <ComparisonMode />}

        {/* Module 5: Craters & Specific Morphologies */}
        {activeSubTab === 'morphology' && <OsseousMorphology />}

        {/* Module 6: Furcation Involvement */}
        {activeSubTab === 'furcation' && <FurcationModule />}

        {/* Module 7: AI in Periodontology */}
        {activeSubTab === 'ai' && <AIPeriodontology />}

        {/* Module 8: Board Exam Quiz */}
        {activeSubTab === 'quiz' && <QuizModule />}

        {/* Module 9: Rapid Review */}
        {activeSubTab === 'rapidReview' && <RapidReview />}
      </main>
    </div>
  );
};
