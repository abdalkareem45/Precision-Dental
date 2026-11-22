import React, { useEffect, useState } from 'react';
import { DiagnosticPlannerConfig, LectureId } from '../../types/lecture';
import { useLabStore } from '../../store/useLabStore';

interface DiagnosticPlannerSandboxProps {
  lectureId: LectureId;
  config: DiagnosticPlannerConfig;
}

export const DiagnosticPlannerSandbox: React.FC<DiagnosticPlannerSandboxProps> = ({
  lectureId,
  config,
}) => {
  const markSandboxCompleted = useLabStore((s) => s.markSandboxCompleted);

  const [choices, setChoices] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    config.variables.forEach((v) => {
      init[v.id] = v.options[0]?.id ?? '';
    });
    return init;
  });

  useEffect(() => {
    const init: Record<string, string> = {};
    config.variables.forEach((v) => {
      init[v.id] = v.options[0]?.id ?? '';
    });
    setChoices(init);
  }, [config]);

  const handlePick = (varId: string, optId: string) => {
    setChoices((prev) => ({ ...prev, [varId]: optId }));
    markSandboxCompleted(`${lectureId}-planner`);
  };

  // Compute aggregate readout cleanly
  const selectedOptions = config.variables.map((v) => {
    const picked = v.options.find((o) => o.id === choices[v.id]) ?? v.options[0];
    return { variable: v.label, option: picked };
  });

  const isBeam = config.diagramType === 'beam-deflection';
  const beamFlexure = isBeam
    ? selectedOptions.reduce((acc, s) => acc * (s.option?.scoreDelta ?? 1), 1)
    : 0;

  const averageScore = !isBeam
    ? Math.round(
        selectedOptions.reduce((acc, s) => acc + (s.option?.scoreDelta ?? 0), 0) /
          Math.max(1, selectedOptions.length)
      )
    : Math.max(10, Math.round(100 - Math.min(90, beamFlexure * 1.5)));

  const statusLabel = isBeam
    ? beamFlexure <= 2
      ? 'Favorable Rigid Prognosis'
      : beamFlexure <= 8
      ? 'Guarded Prognosis (High Rigidity Needed)'
      : 'Unfavorable / Excessive Flexure'
    : averageScore >= 85
    ? 'Optimal Clinical Protocol'
    : averageScore >= 60
    ? 'Guarded / Modified Protocol'
    : 'High Failure / Safety Risk';

  return (
    <section
      aria-labelledby="diag-planner-heading"
      className="rounded-2xl border border-marble bg-white p-5 sm:p-6 shadow-sm space-y-5"
    >
      <div>
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-royal">
          2D Sandbox 04 · Treatment &amp; Quantitative Diagnostic Planner
        </span>
        <h3 id="diag-planner-heading" className="text-lg font-bold text-navy mt-0.5">
          {config.title}
        </h3>
        <p className="text-sm text-navy/75 mt-1">{config.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-4">
          {config.variables.map((v) => (
            <div key={v.id} className="rounded-xl border border-marble bg-ivory/60 p-3.5 space-y-2">
              <div className="text-xs font-bold text-navy">{v.label}</div>
              <div className="flex flex-wrap gap-2">
                {v.options.map((opt) => {
                  const active = choices[v.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handlePick(v.id, opt.id)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'border-royal bg-royal text-ivory'
                          : 'border-marble bg-white text-navy hover:border-royal/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {(() => {
                const activeOpt = v.options.find((o) => o.id === choices[v.id]);
                return activeOpt ? (
                  <p className="text-[11px] text-navy/75">{activeOpt.note}</p>
                ) : null;
              })()}
            </div>
          ))}
        </div>

        {/* Dynamic SVG Visual Readout Column */}
        <div className="lg:col-span-5 rounded-xl border border-marble bg-navy text-ivory p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-ivory/15 pb-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-gold">
              Live Simulation Output
            </span>
            <span className="font-mono tabular-nums text-lg font-bold text-gold">
              {isBeam ? `${beamFlexure}x Flex` : `${averageScore}%`}
            </span>
          </div>

          <PlannerSvgPreview
            diagramType={config.diagramType}
            score={averageScore}
            beamFlexure={beamFlexure}
          />

          <div className="space-y-1">
            <div className="text-sm font-bold">{statusLabel}</div>
            <p className="text-xs text-ivory/75 leading-relaxed">{config.scenario}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const PlannerSvgPreview: React.FC<{
  diagramType: DiagnosticPlannerConfig['diagramType'];
  score: number;
  beamFlexure: number;
}> = ({ diagramType, score, beamFlexure }) => {
  const strokeColor = score >= 85 ? '#34d399' : score >= 60 ? '#C9A24B' : '#f87171';

  if (diagramType === 'beam-deflection') {
    const sag = Math.min(44, Math.max(4, beamFlexure * 1.4));
    return (
      <svg viewBox="0 0 280 120" className="w-full h-28 bg-ivory/5 rounded-lg" aria-hidden="true">
        <rect x="20" y="65" width="32" height="42" rx="4" fill="#E6E8EC" />
        <rect x="228" y="65" width="32" height="42" rx="4" fill="#E6E8EC" />
        <path
          d={`M 36 65 Q 140 ${65 + sag} 244 65`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <line x1="140" y1="18" x2="140" y2={56 + sag * 0.4} stroke="#C9A24B" strokeWidth="2.5" />
        <polygon
          points={`134,${50 + sag * 0.4} 146,${50 + sag * 0.4} 140,${60 + sag * 0.4}`}
          fill="#C9A24B"
        />
        <text x="140" y="16" textAnchor="middle" fill="#FAF8F3" fontSize="10" fontFamily="monospace">
          Deflection = {beamFlexure}x
        </text>
      </svg>
    );
  }

  // Quantitative gauge arc + protocol indicator for remaining 8 clinical planners
  const radius = 42;
  const circ = Math.PI * radius;
  const dash = (score / 100) * circ;

  return (
    <svg viewBox="0 0 280 120" className="w-full h-28 bg-ivory/5 rounded-lg" aria-hidden="true">
      <path
        d="M 88 92 A 52 52 0 0 1 192 92"
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M 88 92 A 52 52 0 0 1 192 92"
        fill="none"
        stroke={strokeColor}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${(dash / circ) * 163} 163`}
      />
      <text x="140" y="80" textAnchor="middle" fill="#FAF8F3" fontSize="18" fontWeight="700" fontFamily="monospace">
        {score}%
      </text>
      <text x="140" y="106" textAnchor="middle" fill="#C9A24B" fontSize="9" fontFamily="monospace">
        {diagramType.toUpperCase()}
      </text>
    </svg>
  );
};
