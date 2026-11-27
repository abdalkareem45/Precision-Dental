import React, { useState } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Layers,
  Workflow,
} from 'lucide-react';
import type { VisualModule, VisualModuleStep } from '@/src/types/lecture';

interface VisualModulesSectionProps {
  modules: VisualModule[];
}

const TONE_MAP: Record<
  VisualModuleStep['visualTone'],
  { bg: string; border: string; badge: string; dot: string }
> = {
  blue: {
    bg: 'bg-[#1B3A8C]/8 dark:bg-[#3B82F6]/12',
    border: 'border-[#1B3A8C]/35 dark:border-[#3B82F6]/40',
    badge: 'bg-[#1B3A8C] text-white dark:bg-[#3B82F6]',
    dot: 'bg-[#1B3A8C] dark:bg-[#3B82F6]',
  },
  teal: {
    bg: 'bg-teal-500/8 dark:bg-[#14B8A6]/12',
    border: 'border-teal-500/35 dark:border-[#14B8A6]/40',
    badge: 'bg-teal-700 text-white dark:bg-[#14B8A6] dark:text-[#0B1220]',
    dot: 'bg-teal-600 dark:bg-[#14B8A6]',
  },
  gold: {
    bg: 'bg-[#C9A24B]/12 dark:bg-[#C9A24B]/15',
    border: 'border-[#C9A24B]/45',
    badge: 'bg-[#C9A24B] text-[#0B1F4D]',
    dot: 'bg-[#C9A24B]',
  },
  crimson: {
    bg: 'bg-red-500/8 dark:bg-red-500/12',
    border: 'border-red-500/35',
    badge: 'bg-red-700 text-white dark:bg-red-500',
    dot: 'bg-red-600 dark:bg-red-400',
  },
  navy: {
    bg: 'bg-[#0B1F4D]/8 dark:bg-slate-800/70',
    border: 'border-[#0B1F4D]/35 dark:border-slate-600',
    badge: 'bg-[#0B1F4D] text-white dark:bg-slate-600',
    dot: 'bg-[#0B1F4D] dark:bg-slate-300',
  },
};

function kindIcon(kind: VisualModule['kind']) {
  switch (kind) {
    case 'flowchart':
      return <GitBranch className="w-4 h-4" />;
    case 'timeline':
    case 'progression':
      return <Activity className="w-4 h-4" />;
    case 'workflow':
      return <Workflow className="w-4 h-4" />;
    default:
      return <Layers className="w-4 h-4" />;
  }
}

export const VisualModulesSection: React.FC<VisualModulesSectionProps> = ({ modules }) => {
  const [selectedSteps, setSelectedSteps] = useState<Record<string, number>>({});

  const getStepIdx = (modId: string, max: number) => {
    const idx = selectedSteps[modId] ?? 0;
    return Math.max(0, Math.min(idx, max - 1));
  };

  const setStepIdx = (modId: string, idx: number) => {
    setSelectedSteps((prev) => ({ ...prev, [modId]: idx }));
  };

  return (
    <section
      id="section-visual-modules"
      aria-labelledby="visual-modules-heading"
      className="space-y-4"
    >
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-[#1B3A8C] dark:text-[#3B82F6]">
          Section 03 • Visual Learning Modules
        </div>
        <h2 id="visual-modules-heading" className="font-display text-xl sm:text-2xl font-bold text-[#0B1F4D] dark:text-white">
          Interactive Flowcharts, Timelines & Clinical Schematics
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Step through each visual mechanism rather than reading static paragraphs. Click any stage node to inspect clinical details.
        </p>
      </div>

      <div className="space-y-5">
        {modules.map((mod) => {
          const activeIdx = getStepIdx(mod.id, mod.steps.length);
          const activeStep = mod.steps[activeIdx];
          const tone = TONE_MAP[activeStep?.visualTone || 'blue'];
          const progressPct = mod.steps.length > 1 ? Math.round((activeIdx / (mod.steps.length - 1)) * 100) : 100;

          return (
            <article
              key={mod.id}
              className="rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 sm:p-6 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#1B3A8C]/10 text-[#1B3A8C] dark:bg-[#3B82F6]/15 dark:text-[#93C5FD] font-semibold uppercase">
                      {kindIcon(mod.kind)}
                      {mod.kind}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {mod.objectiveTag}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#0B1F4D] dark:text-white">
                    {mod.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {mod.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={activeIdx === 0}
                    onClick={() => setStepIdx(mod.id, activeIdx - 1)}
                    aria-label="Previous step"
                    className="p-2 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] disabled:opacity-40 hover:border-[#1B3A8C] text-[#0B1F4D] dark:text-slate-200 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs px-2 tabular-nums text-slate-600 dark:text-slate-300">
                    {activeIdx + 1} / {mod.steps.length}
                  </span>
                  <button
                    type="button"
                    disabled={activeIdx === mod.steps.length - 1}
                    onClick={() => setStepIdx(mod.id, activeIdx + 1)}
                    aria-label="Next step"
                    className="p-2 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] disabled:opacity-40 hover:border-[#1B3A8C] text-[#0B1F4D] dark:text-slate-200 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Interactive Step Pipeline Bar */}
              <div className="space-y-2">
                <div className="h-1.5 rounded-full bg-[#FAF8F3] dark:bg-[#0B1220] border border-[#E6E8EC] dark:border-[#1F2937] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1B3A8C] via-[#14B8A6] to-[#C9A24B] transition-all duration-300"
                    style={{ width: `${Math.max(12, progressPct)}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {mod.steps.map((step, idx) => {
                    const isActive = idx === activeIdx;
                    const stepTone = TONE_MAP[step.visualTone];
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setStepIdx(mod.id, idx)}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isActive
                            ? `${stepTone.bg} ${stepTone.border} ring-2 ring-[#1B3A8C]/35 dark:ring-[#3B82F6]/35`
                            : 'border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] hover:border-[#C9A24B]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            STEP {idx + 1}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${stepTone.dot}`} />
                        </div>
                        <div className="text-xs font-semibold text-[#0B1F4D] dark:text-white leading-snug line-clamp-2">
                          {step.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Step Visual Card */}
              {activeStep && (
                <div className={`rounded-xl border p-4 sm:p-5 grid md:grid-cols-12 gap-4 items-start ${tone.bg} ${tone.border}`}>
                  <div className="md:col-span-7 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${tone.badge}`}>
                        {activeStep.badge || `Stage ${activeIdx + 1}`}
                      </span>
                      {activeStep.metric && (
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-white/80 dark:bg-[#0B1220]/80 border border-[#E6E8EC] dark:border-[#1F2937] text-[#0B1F4D] dark:text-slate-200 tabular-nums">
                          {activeStep.metric}
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-base sm:text-lg font-bold text-[#0B1F4D] dark:text-white">
                      {activeStep.label}
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {activeStep.summary}
                    </p>
                  </div>

                  <div className="md:col-span-5 rounded-xl bg-white/85 dark:bg-[#0B1220]/85 border border-[#E6E8EC] dark:border-[#1F2937] p-3.5 space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Clinical Decision Points
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {activeStep.highlights.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${tone.dot}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
