import React, { useEffect, useState } from 'react';
import { Check, Ban } from 'lucide-react';
import { LectureId, MaterialComparisonConfig } from '../../types/lecture';
import { useLabStore } from '../../store/useLabStore';

interface MaterialComparisonSandboxProps {
  lectureId: LectureId;
  config: MaterialComparisonConfig;
}

export const MaterialComparisonSandbox: React.FC<MaterialComparisonSandboxProps> = ({
  lectureId,
  config,
}) => {
  const markSandboxCompleted = useLabStore((s) => s.markSandboxCompleted);
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    config.items.slice(0, 2).map((i) => i.id)
  );

  useEffect(() => {
    setSelectedIds(config.items.slice(0, 2).map((i) => i.id));
  }, [config]);

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
    markSandboxCompleted(`${lectureId}-compare`);
  };

  const activeItems = config.items.filter((i) => selectedIds.includes(i.id));

  return (
    <section
      aria-labelledby="mat-compare-heading"
      className="rounded-2xl border border-marble bg-white p-5 sm:p-6 shadow-sm space-y-4"
    >
      <div>
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-royal">
          2D Sandbox 03 · Comparative Material &amp; Design Matrix
        </span>
        <h3 id="mat-compare-heading" className="text-lg font-bold text-navy mt-0.5">
          {config.title}
        </h3>
        <p className="text-sm text-navy/75 mt-1">{config.subtitle}</p>
      </div>

      {/* Interactive Toggle Buttons */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Select items to compare">
        {config.items.map((item) => {
          const active = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-pressed={active}
              className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                active
                  ? 'border-royal bg-royal text-ivory'
                  : 'border-marble bg-ivory/70 text-navy hover:border-royal/50'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeItems.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-marble bg-ivory/50 p-4 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div>
                <div className="text-[11px] font-mono font-semibold uppercase text-gold">
                  {item.category}
                </div>
                <h4 className="text-base font-bold text-navy">{item.name}</h4>
              </div>

              {/* Quantitative Bar Chart Metrics */}
              <div className="space-y-2">
                {item.metrics.map((m) => {
                  const pct = Math.min(100, Math.max(4, Math.round((m.value / m.max) * 100)));
                  return (
                    <div key={m.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-navy">
                        <span>{m.label}</span>
                        <span className="font-mono tabular-nums font-bold text-royal">
                          {m.value} {m.unit}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-marble overflow-hidden">
                        <div
                          className="h-full rounded-full bg-royal transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Indications & Contraindications */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-marble/70 text-xs">
                <div>
                  <span className="font-bold text-emerald-800 block mb-1">Indications</span>
                  <ul className="space-y-1">
                    {item.indications.map((ind, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-navy/85">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-red-800 block mb-1">Contraindications / Limits</span>
                  <ul className="space-y-1">
                    {item.contraindications.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-navy/85">
                        <Ban className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-medium text-navy/75 bg-white rounded-lg p-2.5 border border-marble">
              {item.clinicalNote}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
