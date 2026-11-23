import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, RotateCcw, Box } from 'lucide-react';
import { isWebGLAvailable } from '../three/studioEngine';

interface ThreeSandboxShellProps {
  title: string;
  metricBadge: string;
  learningGoal: string;
  mountRef: React.RefObject<HTMLDivElement | null>;
  onResetView?: () => void;
  fallbackSummary: string;
  children: React.ReactNode;
  readout?: React.ReactNode;
}

export const ThreeSandboxShell: React.FC<ThreeSandboxShellProps> = ({
  title,
  metricBadge,
  learningGoal,
  mountRef,
  onResetView,
  fallbackSummary,
  children,
  readout,
}) => {
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [contextLost, setContextLost] = useState(() => !isWebGLAvailable());

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const onLost = () => setContextLost(true);
    el.addEventListener('studio-webgl-lost', onLost);
    return () => el.removeEventListener('studio-webgl-lost', onLost);
  }, [mountRef]);

  return (
    <section
      aria-label={title}
      className="relative w-full rounded-2xl overflow-hidden border border-[#0B1F4D]/20 [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]/35 bg-[var(--pd-navy)] shadow-sm"
    >
      {/* Dedicated unobstructed 3D WebGL stage */}
      <div className="endo-curriculum-lab-stage relative w-full h-[460px] sm:h-[520px] lg:h-[560px]">
        {!contextLost ? (
          <div
            ref={mountRef}
            className="endo-curriculum-viewport w-full h-full cursor-grab active:cursor-grabbing"
            aria-label={`Interactive 3D viewport for ${title}`}
          />
        ) : (
          <div className="endo-curriculum-viewport w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#0B1F4D] text-[#FAF8F3]">
            <Box className="w-10 h-10 text-[#C9A24B] mb-3" />
            <h4 className="text-base font-semibold mb-2">{title} (3D Fallback View)</h4>
            <p className="text-sm text-[#E6E8EC] max-w-xl leading-relaxed">
              {fallbackSummary}
            </p>
          </div>
        )}

        {/* Minimal Top-Left Title & Readout (Zero side-panel clutter) */}
        <div className="endo-curriculum-lab-overlay">
          <div className="pointer-events-auto min-w-0 max-w-md rounded-xl bg-[#0B1F4D]/92 border border-[#FAF8F3]/15 px-3 sm:px-3.5 py-2 sm:py-2.5 text-[#FAF8F3]">
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#C9A24B] tracking-wide">
              <span>3D Interactive Sandbox</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular truncate">{metricBadge}</span>
            </div>
            <h4 className="text-xs sm:text-base font-semibold leading-snug mt-0.5 text-[#FAF8F3] line-clamp-2 sm:line-clamp-none">
              {title}
            </h4>
            <p className="text-xs text-[#E6E8EC]/85 mt-0.5 leading-snug hidden sm:block">
              {learningGoal}
            </p>
          </div>

          <div className="pointer-events-auto flex items-center gap-2 shrink-0">
            {readout}
            {onResetView && (
              <button
                type="button"
                onClick={onResetView}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 text-xs font-medium text-[#FAF8F3] hover:bg-[#1B3A8C] transition-colors whitespace-nowrap shrink-0 min-h-[38px]"
                aria-label="Reset 3D camera view"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span className="hidden sm:inline">Reset View</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Bottom Control Dock */}
        <div className="endo-curriculum-dock pointer-events-none absolute inset-x-0 bottom-3 flex flex-col items-center px-3">
          <button
            type="button"
            onClick={() => setDockCollapsed((v) => !v)}
            className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1F4D]/95 border border-[#C9A24B]/45 text-[11px] font-semibold text-[#FAF8F3] hover:bg-[#1B3A8C] transition-colors whitespace-nowrap shrink-0"
            aria-expanded={!dockCollapsed}
          >
            {dockCollapsed ? (
              <>
                <Eye className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Show Controls</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Hide Controls</span>
              </>
            )}
          </button>

          {!dockCollapsed && (
            <div className="endo-curriculum-dock-content pointer-events-auto w-full max-w-[940px] max-h-full rounded-xl bg-[#0B1F4D]/94 border border-[#FAF8F3]/18 p-3 sm:px-4 sm:py-3 text-[#FAF8F3] shadow-lg">
              {children}
            </div>
          )}
        </div>
      </div>

      {contextLost && <span className="sr-only">WebGL unavailable</span>}
    </section>
  );
};
