import React, { useState } from 'react';
import { Box, CheckCircle2, Microscope, Stethoscope } from 'lucide-react';
import type { Sandbox3DConfig } from '@/src/types/lecture';
import { ThreeSandboxViewport } from '@/src/components/three/ThreeSandboxViewport';
import { ThreeAssetBoundary } from '@/src/components/ErrorBoundary';

interface Lab3DSectionProps {
  lectureId: string;
  sandboxes: Sandbox3DConfig[];
  completedIds: string[];
  onMarkInteracted: (lectureId: string, sandboxId: string) => void;
}

const SLOT_META: Record<Sandbox3DConfig['slot'], { label: string; icon: React.ReactNode }> = {
  anatomy: { label: '3D Sandbox 1 • Anatomy Explorer', icon: <Box className="w-4 h-4" /> },
  disease: { label: '3D Sandbox 2 • Disease Simulator', icon: <Microscope className="w-4 h-4" /> },
  exam: { label: '3D Sandbox 3 • Clinical Exam Simulator', icon: <Stethoscope className="w-4 h-4" /> },
};

export const Lab3DSection: React.FC<Lab3DSectionProps> = ({
  lectureId,
  sandboxes,
  completedIds,
  onMarkInteracted,
}) => {
  const [activeSlotIdx, setActiveSlotIdx] = useState(0);

  React.useEffect(() => {
    setActiveSlotIdx(0);
  }, [lectureId]);

  const current = sandboxes[activeSlotIdx] || sandboxes[0];

  if (!current) return null;

  return (
    <section
      id="section-lab-3d"
      aria-labelledby="lab-3d-heading"
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#1B3A8C] dark:text-[#3B82F6]">
            Section 04 • 3D Exploration Lab ({sandboxes.length} Topic-Specific Sandboxes)
          </div>
          <h2 id="lab-3d-heading" className="font-display text-xl sm:text-2xl font-bold text-[#0B1F4D] dark:text-white">
            Interactive 3D Spatial & Clinical Simulation Lab
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Rotate, zoom, isolate layers, adjust surface transparency, step through disease stages, and apply examination tools.
          </p>
        </div>
        <span className="font-mono text-xs px-3 py-1 rounded-lg bg-[#FAF8F3] dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] text-[#0B1F4D] dark:text-slate-200 tabular-nums shrink-0">
          Explored {completedIds.length} / {sandboxes.length}
        </span>
      </div>

      {/* Sandbox Switcher Tabs */}
      <div className="grid sm:grid-cols-3 gap-2.5" role="tablist" aria-label="3D exploration sandboxes">
        {sandboxes.map((sb, idx) => {
          const isActive = idx === activeSlotIdx;
          const done = completedIds.includes(sb.id);
          const meta = SLOT_META[sb.slot];
          return (
            <button
              key={sb.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveSlotIdx(idx);
                onMarkInteracted(lectureId, sb.id);
              }}
              className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'border-[#1B3A8C] dark:border-[#3B82F6] bg-[#1B3A8C] text-white dark:bg-[#1E3A8A] shadow-sm'
                  : 'border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-[#0B1F4D] dark:text-slate-200 hover:border-[#C9A24B]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono mb-1">
                <span className={`inline-flex items-center gap-1.5 ${isActive ? 'text-[#E4C16E]' : 'text-[#1B3A8C] dark:text-[#38BDF8]'}`}>
                  {meta.icon}
                  {sb.slot.toUpperCase()}
                </span>
                {done && <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-[#5EEAD4]' : 'text-emerald-600 dark:text-emerald-400'}`} />}
              </div>
              <div className="text-sm font-bold leading-snug line-clamp-1">{sb.title}</div>
              <div className={`text-xs mt-0.5 line-clamp-1 ${isActive ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                {sb.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Three.js Sandbox protected by ThreeAssetBoundary (outer) + ThreeCanvasBoundary (canvas) */}
      <ThreeAssetBoundary
        key={`ab-${current.id}`}
        sandbox={current}
        onResetScene={() => onMarkInteracted(lectureId, current.id)}
      >
        <ThreeSandboxViewport
          key={current.id}
          config={current}
          onInteract={() => onMarkInteracted(lectureId, current.id)}
        />
      </ThreeAssetBoundary>
    </section>
  );
};
