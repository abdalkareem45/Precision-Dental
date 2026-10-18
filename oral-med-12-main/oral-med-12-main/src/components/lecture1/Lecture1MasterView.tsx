import React, { useState } from 'react';
import { DiascopyMorphologyLab } from './DiascopyMorphologyLab';
import { HsvInteractiveSuite } from './HsvInteractiveSuite';
import { VzvInteractiveSuite } from './VzvInteractiveSuite';
import { Lecture1QuizView } from './Lecture1QuizView';
import {
  Layers,
  Sparkles,
  Activity,
  Award,
  BookOpen,
  Eye,
  Sliders,
  Shield,
  Dna,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const Lecture1MasterView: React.FC = () => {
  const [activeLectureTab, setActiveLectureTab] = useState<'morphology' | 'hsv' | 'vzv' | 'quiz'>('morphology');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: Lecture 1 Title & Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                ORAL MEDICINE LECTURE 1
              </span>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-slate-400 text-xs font-mono">32 Interactive Slides</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ulcerative, Vesicular, and Bullous Lesions
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Clinical Morphology Classifications, Diascopy Blanching Mechanics, Herpes Simplex Virus (HSV-1 & HSV-2), and Varicella-Zoster Virus (VZV / Shingles).
            </p>
          </div>

          {/* Quick Metrics Badge Deck */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-lg font-bold text-teal-400">10</div>
              <div className="text-[10px] text-slate-400 uppercase">Lesion Classes</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-lg font-bold text-rose-400">HSV & VZV</div>
              <div className="text-[10px] text-slate-400 uppercase">Alphaherpes</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-lg font-bold text-amber-400">10 Qs</div>
              <div className="text-[10px] text-slate-400 uppercase">Board Exam</div>
            </div>
          </div>
        </div>

        {/* Primary Lecture 1 Navigation Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          {[
            {
              id: 'morphology' as const,
              label: '1. Morphology & Diascopy Lab',
              sub: 'Slides 2–5',
              icon: Layers,
              color: 'text-teal-400',
            },
            {
              id: 'hsv' as const,
              label: '2. Herpes Simplex Virus (HSV)',
              sub: 'Slides 6–20',
              icon: Dna,
              color: 'text-rose-400',
            },
            {
              id: 'vzv' as const,
              label: '3. Varicella-Zoster Virus (VZV)',
              sub: 'Slides 21–32',
              icon: Shield,
              color: 'text-amber-400',
            },
            {
              id: 'quiz' as const,
              label: '4. Lecture 1 Board Challenge',
              sub: '10 Questions',
              icon: Award,
              color: 'text-emerald-400',
            },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeLectureTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveLectureTab(item.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 border shadow-sm ${
                  isCurrent
                    ? 'bg-slate-900 border-teal-500/80 text-white shadow-lg ring-1 ring-teal-500/40'
                    : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isCurrent ? item.color : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="leading-tight">{item.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Views */}
      {activeLectureTab === 'morphology' && <DiascopyMorphologyLab />}
      {activeLectureTab === 'hsv' && <HsvInteractiveSuite />}
      {activeLectureTab === 'vzv' && <VzvInteractiveSuite />}
      {activeLectureTab === 'quiz' && <Lecture1QuizView />}
    </div>
  );
};
