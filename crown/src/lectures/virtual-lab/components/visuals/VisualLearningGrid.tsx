import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Crosshair,
} from 'lucide-react';
import { LectureId, VisualCardItem } from '../../types/lecture';
import { useLabStore } from '../../store/useLabStore';
import { VisualLearningGridSkeleton } from './VisualLearningGridSkeleton';

interface VisualLearningGridProps {
  lectureId: LectureId;
  items: VisualCardItem[];
  isLoading?: boolean;
}

export const VisualLearningGrid: React.FC<VisualLearningGridProps> = ({
  lectureId,
  items,
  isLoading = false,
}) => {
  const markVisualsVisited = useLabStore((s) => s.markVisualsVisited);
  const [isHydrating, setIsHydrating] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setIsHydrating(false);
      return;
    }

    setIsHydrating(true);
    const timer = window.setTimeout(() => {
      setIsHydrating(false);
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [lectureId]);

  useEffect(() => {
    if (!isLoading && !isHydrating && items.length > 0) {
      markVisualsVisited(lectureId);
    }
  }, [lectureId, isLoading, isHydrating, items.length, markVisualsVisited]);

  if (isLoading || isHydrating) {
    return <VisualLearningGridSkeleton cardCount={items.length || 6} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-navy tracking-tight">
            Visual Learning System
          </h2>
          <p className="text-xs text-navy/70 mt-0.5">
            {items.length} structured infographics, interactive anatomical maps, clinical flowcharts &amp; reference tables
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((item) => (
          <VisualCard key={item.id} item={item} />
        ))}
      </div>
    </motion.div>
  );
};

const VisualCard: React.FC<{ item: VisualCardItem }> = ({ item }) => {
  const spanFull =
    item.kind === 'comparison-table' || item.kind === 'hotspot-diagram';

  return (
    <article
      className={`cv-auto rounded-2xl border border-marble bg-white p-5 shadow-sm flex flex-col justify-between gap-4 ${
        spanFull ? 'lg:col-span-2' : ''
      }`}
    >
      <div>
        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-royal">
          {item.kind.replace('-', ' ')}
        </div>
        <h3 className="text-base font-bold text-navy mt-0.5">{item.title}</h3>
        <p className="text-xs text-navy/70 mt-0.5">{item.subtitle}</p>
      </div>

      {item.kind === 'hotspot-diagram' && <HotspotDiagramBody item={item} />}
      {item.kind === 'formula-card' && item.formula && <FormulaBody item={item} />}
      {item.kind === 'metric-grid' && <MetricGridBody item={item} />}
      {item.kind === 'checklist' && <ChecklistBody item={item} />}
      {item.kind === 'timeline' && <TimelineBody item={item} />}
      {item.kind === 'flowchart' && <FlowchartBody item={item} />}
      {item.kind === 'comparison-table' && <TableBody item={item} />}
      {item.kind === 'safety-alert' && <SafetyAlertBody item={item} />}
    </article>
  );
};

const HotspotDiagramBody: React.FC<{ item: VisualCardItem }> = ({ item }) => {
  const hotspots = item.hotspots ?? [];
  const [activeId, setActiveId] = useState(hotspots[0]?.id ?? '');
  const activeSpot = hotspots.find((h) => h.id === activeId) ?? hotspots[0];

  useEffect(() => {
    setActiveId(hotspots[0]?.id ?? '');
  }, [item.id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
      <div className="md:col-span-7 relative rounded-xl border border-marble bg-ivory/80 overflow-hidden h-56">
        <SchematicDiagramSvg diagramKey={item.diagramKey ?? 'default'} />
        {hotspots.map((spot, idx) => {
          const isSelected = spot.id === activeSpot?.id;
          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => setActiveId(spot.id)}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={`Inspect ${spot.label}`}
              aria-pressed={isSelected}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center shadow-md transition-transform cursor-pointer ${
                isSelected
                  ? 'bg-gold text-navy scale-110 ring-4 ring-gold/30'
                  : 'bg-royal text-ivory hover:scale-105'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="md:col-span-5 space-y-2.5">
        <div className="flex flex-wrap gap-1.5">
          {hotspots.map((spot, idx) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => setActiveId(spot.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                spot.id === activeSpot?.id
                  ? 'bg-navy text-ivory'
                  : 'bg-ivory text-navy hover:bg-marble/70'
              }`}
            >
              #{idx + 1}
            </button>
          ))}
        </div>
        {activeSpot && (
          <div className="rounded-xl border border-marble bg-ivory/70 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-royal">
              <Crosshair className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{activeSpot.label}</span>
            </div>
            <p className="text-xs text-navy/85 leading-relaxed">{activeSpot.detail}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SchematicDiagramSvg: React.FC<{ diagramKey: string }> = ({ diagramKey }) => {
  const patternId = React.useId();

  return (
    <svg
      viewBox="0 0 400 200"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E6E8EC" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="200" fill={`url(#${patternId})`} />

      {diagramKey.includes('biologic') ? (
        <>
          <rect x="40" y="138" width="320" height="42" rx="4" fill="#e7dec7" />
          <rect x="40" y="106" width="320" height="32" fill="#f59e0b" opacity="0.35" />
          <rect x="40" y="74" width="320" height="32" fill="#de828e" opacity="0.55" />
          <rect x="145" y="28" width="110" height="145" rx="18" fill="#f7f3e8" stroke="#1B3A8C" strokeWidth="2.5" />
          <line x1="125" y1="74" x2="275" y2="74" stroke="#0B1F4D" strokeDasharray="4 3" strokeWidth="1.5" />
        </>
      ) : diagramKey.includes('ridge') ? (
        <>
          <path d="M 30 150 Q 200 120 370 150 L 370 190 L 30 190 Z" fill="#e7dec7" />
          <path d="M 30 130 Q 200 100 370 130 L 370 155 Q 200 125 30 155 Z" fill="#de828e" opacity="0.85" />
          <rect x="155" y="42" width="90" height="72" rx="18" fill="#f7f3e8" stroke="#1B3A8C" strokeWidth="2.5" />
        </>
      ) : diagramKey.includes('munsell') || diagramKey.includes('shade') ? (
        <>
          <circle cx="150" cy="100" r="65" fill="#1B3A8C" opacity="0.12" />
          <circle cx="250" cy="100" r="65" fill="#C9A24B" opacity="0.18" />
          <path d="M 140 35 L 260 35 L 245 155 L 155 155 Z" fill="#f7f3e8" stroke="#0B1F4D" strokeWidth="2.5" />
          <line x1="145" y1="75" x2="255" y2="75" stroke="#C9A24B" strokeDasharray="4 4" strokeWidth="1.5" />
          <line x1="150" y1="115" x2="250" y2="115" stroke="#C9A24B" strokeDasharray="4 4" strokeWidth="1.5" />
        </>
      ) : diagramKey.includes('mandibular') ? (
        <>
          <line x1="60" y1="100" x2="340" y2="100" stroke="#1B3A8C" strokeWidth="2" strokeDasharray="5 4" />
          <line x1="200" y1="30" x2="200" y2="175" stroke="#C9A24B" strokeWidth="2" strokeDasharray="5 4" />
          <circle cx="100" cy="100" r="14" fill="#C9A24B" opacity="0.8" />
          <circle cx="300" cy="100" r="14" fill="#C9A24B" opacity="0.8" />
          <path d="M 100 100 Q 200 170 300 100" fill="none" stroke="#0B1F4D" strokeWidth="3.5" />
        </>
      ) : diagramKey.includes('marginal') ? (
        <>
          <rect x="65" y="42" width="54" height="110" rx="8" fill="#f7f3e8" stroke="#1B3A8C" strokeWidth="2" />
          <rect x="140" y="42" width="54" height="110" rx="8" fill="#f7f3e8" stroke="#1B3A8C" strokeWidth="2" />
          <rect x="215" y="42" width="54" height="110" rx="8" fill="#f7f3e8" stroke="#1B3A8C" strokeWidth="2" />
          <rect x="290" y="42" width="54" height="110" rx="8" fill="#f7f3e8" stroke="#1B3A8C" strokeWidth="2" />
          <line x1="45" y1="128" x2="365" y2="128" stroke="#C9A24B" strokeWidth="3" />
        </>
      ) : (
        <>
          <rect x="52" y="88" width="56" height="72" rx="10" fill="#e3c284" stroke="#0B1F4D" strokeWidth="2" />
          <rect x="172" y="72" width="56" height="88" rx="10" fill="#f7f3e8" stroke="#1B3A8C" strokeWidth="2.5" />
          <rect x="292" y="88" width="56" height="72" rx="10" fill="#e3c284" stroke="#0B1F4D" strokeWidth="2" />
          <path d="M 80 78 L 320 78" stroke="#C9A24B" strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      <text x="16" y="24" fill="#0B1F4D" opacity="0.45" fontSize="10" fontFamily="monospace">
        {diagramKey.toUpperCase()}
      </text>
    </svg>
  );
};

const FormulaBody: React.FC<{ item: VisualCardItem }> = ({ item }) => {
  const f = item.formula!;
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-navy text-gold font-mono text-xl sm:text-2xl font-bold text-center py-4 px-3 tracking-tight">
        {f.expression}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {f.variables.map((v) => (
          <div key={v.symbol} className="rounded-lg border border-marble bg-ivory/60 p-2.5">
            <span className="font-mono font-bold text-royal mr-1.5">{v.symbol}:</span>
            <span className="text-navy/85">{v.meaning}</span>
          </div>
        ))}
      </div>
      <p className="text-xs font-medium text-navy/80 border-t border-marble pt-2.5">
        {f.takeaway}
      </p>
    </div>
  );
};

const MetricGridBody: React.FC<{ item: VisualCardItem }> = ({ item }) => {
  const items = item.items ?? [];
  const statusStyles = {
    safe: 'border-emerald-200 bg-emerald-50/60 text-emerald-900',
    warn: 'border-amber-200 bg-amber-50/60 text-amber-900',
    danger: 'border-red-200 bg-red-50/60 text-red-900',
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {items.map((it, idx) => (
        <div
          key={idx}
          className={`rounded-xl border p-3 ${
            it.status ? statusStyles[it.status] : 'border-marble bg-ivory/60 text-navy'
          }`}
        >
          <div className="text-[11px] font-semibold opacity-80">{it.title}</div>
          <div className="text-base font-bold font-mono tabular-nums mt-0.5">{it.value}</div>
          {it.note && <div className="text-[11px] opacity-85 mt-1 leading-snug">{it.note}</div>}
        </div>
      ))}
    </div>
  );
};

const ChecklistBody: React.FC<{ item: VisualCardItem }> = ({ item }) => {
  const items = item.items ?? [];
  return (
    <ul className="space-y-2">
      {items.map((it, idx) => (
        <li
          key={idx}
          className="flex flex-col sm:flex-row items-start justify-between gap-3 rounded-xl border border-marble bg-ivory/60 p-3 text-xs"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2
              className={`w-4 h-4 shrink-0 mt-0.5 ${
                it.status === 'danger'
                  ? 'text-red-700'
                  : it.status === 'warn'
                  ? 'text-amber-700'
                  : 'text-emerald-700'
              }`}
              aria-hidden="true"
            />
            <div>
              <div className="font-bold text-navy">{it.title}</div>
              {it.note && <div className="text-navy/75 mt-0.5">{it.note}</div>}
            </div>
          </div>
          <span className="max-w-full break-words font-mono font-semibold text-royal shrink-0 sm:text-right">
            {it.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

const TimelineBody: React.FC<{ item: VisualCardItem }> = ({ item }) => {
  const steps = item.steps ?? [];
  return (
    <ol className="space-y-2.5">
      {steps.map((st, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-royal text-ivory font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
            {idx + 1}
          </span>
          <div className="flex-1 rounded-xl border border-marble bg-ivory/60 p-3 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-navy">{st.label}</span>
              {st.metric && (
                <span className="font-mono font-bold text-royal tabular-nums">{st.metric}</span>
              )}
            </div>
            <p className="text-navy/75 mt-1 leading-relaxed">{st.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
};

const FlowchartBody: React.FC<{ item: VisualCardItem }> = ({ item }) => {
  const steps = item.steps ?? [];
  return (
    <div className="space-y-2">
      {steps.map((st, idx) => (
        <React.Fragment key={idx}>
          <div className="rounded-xl border border-marble bg-ivory/70 p-3 text-xs">
            <div className="font-bold text-royal">{st.label}</div>
            <div className="text-navy/85 mt-0.5 leading-relaxed">{st.detail}</div>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex justify-center text-gold" aria-hidden="true">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const TableBody: React.FC<{ item: VisualCardItem }> = ({ item }) => {
  const headers = item.headers ?? [];
  const rows = item.rows ?? [];
  return (
    <div className="overflow-x-auto rounded-xl border border-marble">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="bg-navy text-ivory">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3.5 py-2.5 font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-marble bg-white">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-ivory/60">
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className={`px-3.5 py-2.5 align-top ${
                    cIdx === 0 ? 'font-bold text-navy' : 'text-navy/85'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SafetyAlertBody: React.FC<{ item: VisualCardItem }> = ({ item }) => {
  const items = item.items ?? [];
  return (
    <div className="space-y-2.5">
      {items.map((it, idx) => {
        const isDanger = it.status === 'danger';
        return (
          <div
            key={idx}
            className={`rounded-xl border p-3.5 text-xs flex items-start gap-2.5 ${
              isDanger
                ? 'border-red-300 bg-red-50 text-red-950'
                : it.status === 'safe'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                : 'border-amber-300 bg-amber-50 text-amber-950'
            }`}
          >
            {isDanger ? (
              <ShieldAlert className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="space-y-0.5">
              <div className="font-bold">
                {it.title} · <span className="font-mono">{it.value}</span>
              </div>
              {it.note && <p className="leading-relaxed">{it.note}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
