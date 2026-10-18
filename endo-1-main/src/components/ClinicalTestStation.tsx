import React, { useState, useEffect } from 'react';
import { ClinicalTestType } from '../types/endodontics';
import { CLINICAL_TESTS_CATALOG } from '../data/lectureData';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Zap,
  Snowflake,
  Flame,
  Hammer,
  MoveHorizontal,
  Maximize2,
  Sun,
  Navigation,
  Disc,
  Crosshair,
  Syringe,
  ToggleLeft,
  ToggleRight,
  Eye,
} from 'lucide-react';

export type TestCategoryTab = 'thermal' | 'mechanical' | 'visual_other';

interface ClinicalTestStationProps {
  activeTest: ClinicalTestType;
  onSelectTest: (test: ClinicalTestType) => void;
  isExecuting: boolean;
  onToggleExecution: () => void;
  activeCaseResult?: {
    result: string;
    patientFeedback: string;
    clinicalNote: string;
    isPositive: boolean;
  } | null;
}

export const ClinicalTestStation: React.FC<ClinicalTestStationProps> = ({
  activeTest,
  onSelectTest,
  isExecuting,
  onToggleExecution,
  activeCaseResult,
}) => {
  // Test categorization into 'Thermal', 'Mechanical', and 'Visual/Other'
  const CATEGORY_MAP: Record<
    TestCategoryTab,
    { title: string; subtitle: string; icon: any; testIds: ClinicalTestType[] }
  > = {
    thermal: {
      title: 'Thermal',
      subtitle: 'Cold, heat & neuro-vitality tests',
      icon: Snowflake,
      testIds: ['cold', 'heat', 'ept', 'cavity'],
    },
    mechanical: {
      title: 'Mechanical',
      subtitle: 'Percussion, palpation, mobility & bite force',
      icon: Hammer,
      testIds: ['percussion_vertical', 'percussion_horizontal', 'palpation', 'mobility', 'bite_test'],
    },
    visual_other: {
      title: 'Visual/Other',
      subtitle: 'Transillumination, dye, sinus tracing & nerve blocks',
      icon: Eye,
      testIds: ['transillumination', 'sinus_tracing', 'selective_anesthesia'],
    },
  };

  // Determine current active tab based on activeTest
  const getInitialTab = (): TestCategoryTab => {
    if (CATEGORY_MAP.thermal.testIds.includes(activeTest)) return 'thermal';
    if (CATEGORY_MAP.mechanical.testIds.includes(activeTest)) return 'mechanical';
    return 'visual_other';
  };

  const [activeCategory, setActiveCategory] = useState<TestCategoryTab>(getInitialTab);

  // Sync category if activeTest changes externally (e.g., from case simulator)
  useEffect(() => {
    if (CATEGORY_MAP.thermal.testIds.includes(activeTest)) {
      setActiveCategory('thermal');
    } else if (CATEGORY_MAP.mechanical.testIds.includes(activeTest)) {
      setActiveCategory('mechanical');
    } else if (CATEGORY_MAP.visual_other.testIds.includes(activeTest)) {
      setActiveCategory('visual_other');
    }
  }, [activeTest]);

  const currentTestInfo =
    CLINICAL_TESTS_CATALOG.find((t) => t.id === activeTest) || CLINICAL_TESTS_CATALOG[0];

  // Interactive EPT current dial simulation
  const [eptCurrent, setEptCurrent] = useState<number>(0);
  const [isLipClipConnected, setIsLipClipConnected] = useState<boolean>(true);

  // Bite test phase: idle -> biting -> released
  const [bitePhase, setBitePhase] = useState<'idle' | 'biting' | 'released'>('idle');

  // Heat test safety timer (seconds)
  const [heatTimer, setHeatTimer] = useState<number>(0);

  // Timer for heat test when executing
  useEffect(() => {
    let interval: any;
    if (isExecuting && activeTest === 'heat') {
      interval = setInterval(() => {
        setHeatTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setHeatTimer(0);
    }
    return () => clearInterval(interval);
  }, [isExecuting, activeTest]);

  // EPT current advance during execution
  useEffect(() => {
    let interval: any;
    if (isExecuting && activeTest === 'ept') {
      setEptCurrent(0);
      interval = setInterval(() => {
        setEptCurrent((prev) => {
          if (prev >= 80) return 80;
          return prev + 2;
        });
      }, 70);
    } else if (!isExecuting) {
      setEptCurrent(0);
    }
    return () => clearInterval(interval);
  }, [isExecuting, activeTest]);

  const getTestIcon = (id: ClinicalTestType) => {
    switch (id) {
      case 'cold':
        return <Snowflake className="w-4 h-4 text-cyan-400" />;
      case 'heat':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'ept':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'percussion_vertical':
        return <Hammer className="w-4 h-4 text-emerald-400" />;
      case 'percussion_horizontal':
        return <MoveHorizontal className="w-4 h-4 text-teal-400" />;
      case 'mobility':
        return <Maximize2 className="w-4 h-4 text-purple-400" />;
      case 'palpation':
        return <Activity className="w-4 h-4 text-rose-400" />;
      case 'bite_test':
        return <Disc className="w-4 h-4 text-blue-400" />;
      case 'transillumination':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'sinus_tracing':
        return <Navigation className="w-4 h-4 text-pink-400" />;
      case 'selective_anesthesia':
        return <Syringe className="w-4 h-4 text-indigo-400" />;
      case 'cavity':
        return <Crosshair className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-cyan-400" />;
    }
  };

  const handleTabChange = (tab: TestCategoryTab) => {
    setActiveCategory(tab);
    if (!CATEGORY_MAP[tab].testIds.includes(activeTest)) {
      onSelectTest(CATEGORY_MAP[tab].testIds[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1F4D] border-l border-[#E6E8EC]/20 text-[#FAF8F3] overflow-y-auto w-full select-none shadow-2xl">
      {/* Top Header */}
      <div className="p-4 border-b border-[#E6E8EC]/15 sticky top-0 bg-[#0B1F4D]/95 backdrop-blur-md z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#1B3A8C] border border-[#C9A24B]/40 text-[#C9A24B]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-headings">
                Diagnostic Testing Lab
              </h2>
              <p className="text-[10px] text-[#E6E8EC]/75 font-medium">Lecture 1 Clinical Simulations</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/30 font-bold">
            Page {currentTestInfo.lecturePage}
          </span>
        </div>

        {/* Tabbed Interface: 'Thermal', 'Mechanical', and 'Visual/Other' */}
        <div className="grid grid-cols-3 gap-1 bg-[#06112C] p-1 rounded-2xl border border-[#E6E8EC]/15 text-xs">
          {(['thermal', 'mechanical', 'visual_other'] as TestCategoryTab[]).map((tabKey) => {
            const tab = CATEGORY_MAP[tabKey];
            const Icon = tab.icon;
            const isTabActive = activeCategory === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => handleTabChange(tabKey)}
                className={`py-2 px-1 rounded-xl font-headings transition-all flex flex-col items-center gap-0.5 text-center ${
                  isTabActive
                    ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md scale-[1.02]'
                    : 'text-[#E6E8EC]/70 hover:text-white hover:bg-[#0B1F4D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-headings leading-tight font-semibold">
                  {tab.title}
                </span>
                <span className={`text-[9px] font-mono ${isTabActive ? 'text-[#0B1F4D] font-bold' : 'text-[#E6E8EC]/50'}`}>
                  ({tab.testIds.length})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Test Selector in Active Category */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400 font-semibold px-0.5">
            <span>{CATEGORY_MAP[activeCategory].title} Tests</span>
            <span className="text-[10px] text-slate-500">{CATEGORY_MAP[activeCategory].subtitle}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CATEGORY_MAP[activeCategory].testIds.map((testId) => {
              const test = CLINICAL_TESTS_CATALOG.find((t) => t.id === testId)!;
              const isSelected = test.id === activeTest;

              return (
                <button
                  key={test.id}
                  onClick={() => onSelectTest(test.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-md ring-1 ring-cyan-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
                      {getTestIcon(test.id)}
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <div
                      className={`text-xs font-bold leading-tight ${
                        isSelected ? 'text-cyan-200' : 'text-slate-200'
                      }`}
                    >
                      {test.name.replace(' Testing', '').replace(' Evaluation', '')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      {test.toolUsed.split(' ')[0]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* TACTILE TOGGLE BAR / SWITCH: Replaces the execution button */}
        <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-cyan-500/40 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              3D Test Toggle Switch
            </span>
            <span
              className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                isExecuting
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isExecuting ? '● ACTIVE IN 3D' : '○ STANDBY'}
            </span>
          </div>

          {/* Interactive Sliding Toggle Bar / Switch */}
          <div
            onClick={onToggleExecution}
            className="relative w-full h-12 bg-slate-900 border border-slate-700/80 rounded-2xl p-1 cursor-pointer select-none transition-all hover:border-cyan-500/60 flex items-center shadow-inner"
          >
            {/* Sliding Pill Indicator */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-all duration-300 ease-out flex items-center justify-center font-mono text-xs font-bold shadow-lg ${
                isExecuting
                  ? 'left-[calc(50%+2px)] bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-emerald-500/30'
                  : 'left-1 bg-slate-800 text-slate-300 border border-slate-700 shadow-slate-950/50'
              }`}
            >
              {isExecuting ? '⚡ ACTIVE IN 3D' : 'STANDBY (OFF)'}
            </div>

            {/* Left Label */}
            <div
              className={`w-1/2 text-center text-xs font-mono font-semibold transition-colors z-0 ${
                !isExecuting ? 'text-transparent' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Standby
            </div>
            {/* Right Label */}
            <div
              className={`w-1/2 text-center text-xs font-mono font-semibold transition-colors z-0 ${
                isExecuting ? 'text-transparent' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              Apply In 3D
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center leading-tight">
            {isExecuting
              ? 'Tool positioned on tooth in 3D. Orbit around to inspect contact point & responses.'
              : 'Toggle switch to the right to place instrument on tooth and activate live telemetry.'}
          </p>
        </div>

        {/* Selected Test Information Card */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-slate-100 flex items-center gap-2">
                {getTestIcon(currentTestInfo.id)}
                <span>{currentTestInfo.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Target Area: <span className="text-cyan-300 font-mono">{currentTestInfo.targetArea}</span>
              </p>
            </div>
            {currentTestInfo.figureRef && (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                {currentTestInfo.figureRef.split(':')[0]}
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-300 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
            <strong className="text-slate-400 font-mono text-[10px] block uppercase font-semibold">
              Objective:
            </strong>
            {currentTestInfo.objective}
          </div>
        </div>

        {/* Interactive Controls Specific to Test Type */}
        {activeTest === 'heat' && (
          <div className="bg-orange-950/30 p-3 rounded-2xl border border-orange-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between text-orange-300 font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Thermal Contact Timer
              </span>
              <span className={heatTimer >= 5 ? 'text-red-400 font-extrabold text-sm' : 'text-sm'}>
                {heatTimer}s / 5s Max
              </span>
            </div>
            {heatTimer >= 5 ? (
              <div className="text-[11px] text-red-300 font-semibold flex items-center gap-1.5 bg-red-950/60 p-2 rounded-xl border border-red-500/50">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                CRITICAL LECTURE RULE: Prolonged heat (&gt;5s) causes biphasic stimulation (Aδ then C) and pulpal damage!
              </div>
            ) : (
              <div className="text-[10px] text-slate-400">
                Gutta-percha stick heated and applied with petroleum lubricant. Keep &lt;5 seconds.
              </div>
            )}
          </div>
        )}

        {activeTest === 'ept' && (
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-yellow-500/30 text-xs space-y-2.5">
            <div className="flex items-center justify-between font-mono">
              <span className="text-yellow-400 font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Digital Current Readout:
              </span>
              <span className="text-xl font-bold text-yellow-300 px-2.5 py-0.5 rounded-xl bg-black/70 border border-yellow-500/40">
                {eptCurrent < 10 ? `0${eptCurrent}` : eptCurrent} / 80
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Patient Lip Ground:</span>
              <button
                onClick={() => setIsLipClipConnected(!isLipClipConnected)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-colors ${
                  isLipClipConnected
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-red-950 text-red-300 border border-red-700'
                }`}
              >
                {isLipClipConnected ? '✓ Circuit Closed' : '✕ Circuit Broken (False Neg)'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Electrode placed on middle third of labial surface with toothpaste electrolyte.
            </p>
          </div>
        )}

        {activeTest === 'bite_test' && (
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-blue-500/30 text-xs space-y-2.5">
            <div className="text-[11px] font-mono text-blue-300 font-bold flex items-center justify-between">
              <span>Tooth Slooth Bite Phase:</span>
              <span className="uppercase px-2 py-0.5 rounded-lg bg-blue-950 border border-blue-800 text-[10px]">
                {bitePhase}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBitePhase('biting')}
                className={`py-2 rounded-xl font-semibold text-xs transition-colors ${
                  bitePhase === 'biting'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                1. Bite Down Firmly
              </button>
              <button
                onClick={() => setBitePhase('released')}
                className={`py-2 rounded-xl font-semibold text-xs transition-colors ${
                  bitePhase === 'released'
                    ? 'bg-rose-500 text-white font-bold shadow-md animate-pulse'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                2. Release Suddenly
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              <strong>Lecture Page 9:</strong> Pain on biting = Apical periodontitis. Pain ON RELEASE = Cracked tooth!
            </p>
          </div>
        )}

        {/* Live Clinical Feedback Result Card */}
        {activeCaseResult && isExecuting && (
          <div
            className={`p-3.5 rounded-2xl border text-xs space-y-2 animate-fadeIn ${
              activeCaseResult.isPositive
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between font-mono font-bold text-xs">
              <span className="flex items-center gap-1.5">
                {activeCaseResult.isPositive ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {activeCaseResult.isPositive ? 'POSITIVE RESPONSE' : 'NORMAL / NEGATIVE'}
              </span>
            </div>

            <div className="italic text-slate-200 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
              {activeCaseResult.patientFeedback}
            </div>

            <div className="text-[11px] text-slate-300 leading-snug">
              <strong className="text-white font-mono block">Clinical Finding:</strong>
              {activeCaseResult.result}
            </div>

            <div className="text-[10px] text-cyan-300 font-mono pt-1.5 border-t border-slate-800/80">
              <strong>Diagnostic Note:</strong> {activeCaseResult.clinicalNote}
            </div>
          </div>
        )}

        {/* Neurological & Physiological Mechanism */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Neuro-Biological Mechanism
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {currentTestInfo.physiologicalMechanism}
          </p>
        </div>

        {/* Step-by-Step Clinical Technique */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Clinical Technique Protocol
          </span>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            {currentTestInfo.technique.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 font-mono text-[9px] flex items-center justify-center shrink-0 border border-cyan-800/50">
                  {idx + 1}
                </span>
                <span className="leading-snug">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
