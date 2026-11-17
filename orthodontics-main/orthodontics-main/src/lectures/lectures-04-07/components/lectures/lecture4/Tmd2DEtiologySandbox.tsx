import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

type ParafunctionTiming = 'sleep-bruxism' | 'daytime-clenching' | 'none';

export function Tmd2DEtiologySandbox() {
  const [occlusalLoad, setOcclusalLoad] = useState(25);
  const [traumaLoad, setTraumaLoad] = useState(15);
  const [stressLoad, setStressLoad] = useState(30);
  const [parafunctionLoad, setParafunctionLoad] = useState(35);
  const [adaptability, setAdaptability] = useState(130);
  const [timing, setTiming] = useState<ParafunctionTiming>('sleep-bruxism');

  const totalLoad = occlusalLoad + traumaLoad + stressLoad + parafunctionLoad;
  const exceedsThreshold = totalLoad > adaptability;
  const margin = adaptability - totalLoad;

  const handleReset = () => {
    setOcclusalLoad(25);
    setTraumaLoad(15);
    setStressLoad(30);
    setParafunctionLoad(35);
    setAdaptability(130);
    setTiming('sleep-bruxism');
  };

  const maxGauge = 240;
  const occPct = (occlusalLoad / maxGauge) * 100;
  const traPct = (traumaLoad / maxGauge) * 100;
  const strPct = (stressLoad / maxGauge) * 100;
  const parPct = (parafunctionLoad / maxGauge) * 100;
  const threshPct = Math.min((adaptability / maxGauge) * 100, 100);

  return (
    <SandboxShell
      id="lec4-2d-etiology"
      kind="2D Sandbox"
      title="Multifactorial Etiology, Patient Adaptability & Parafunction Timing"
      instruction="Adjust the 4 etiologic factors & patient adaptability threshold"
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Stage: Visual Force-vs-Adaptability Diagram & Circadian Chart */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-[#0B1F4D]">
                Cumulative Etiologic Load vs. Physiological Adaptability
              </span>
              <span
                className={`text-xs font-bold font-mono px-2.5 py-1 rounded ${
                  exceedsThreshold
                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}
              >
                {exceedsThreshold
                  ? `▲ SYMPTOMATIC (+${Math.abs(margin)} units above capacity)`
                  : `● COMPENSATED (${margin} units reserve)`}
              </span>
            </div>

            {/* Stacked Horizontal Load Bar with Adaptability Threshold Line */}
            <div className="relative h-14 bg-white border border-[#E6E8EC] rounded-lg overflow-hidden">
              <div className="h-full flex">
                <div
                  style={{ width: `${occPct}%` }}
                  className="bg-[#1B3A8C] transition-all duration-150 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
                  title={`Occlusal: ${occlusalLoad}`}
                >
                  {occlusalLoad >= 18 ? 'Occlusal' : ''}
                </div>
                <div
                  style={{ width: `${traPct}%` }}
                  className="bg-[#C9A24B] transition-all duration-150 flex items-center justify-center text-[10px] font-bold text-[#0B1F4D] overflow-hidden"
                  title={`Trauma: ${traumaLoad}`}
                >
                  {traumaLoad >= 18 ? 'Trauma' : ''}
                </div>
                <div
                  style={{ width: `${strPct}%` }}
                  className="bg-[#0B1F4D] transition-all duration-150 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
                  title={`Stress: ${stressLoad}`}
                >
                  {stressLoad >= 18 ? 'Stress' : ''}
                </div>
                <div
                  style={{ width: `${parPct}%` }}
                  className="bg-[#DC2626] transition-all duration-150 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
                  title={`Parafunction: ${parafunctionLoad}`}
                >
                  {parafunctionLoad >= 18 ? 'Parafunction' : ''}
                </div>
              </div>

              {/* Adaptability Threshold Vertical Marker */}
              <div
                style={{ left: `${threshPct}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-[#0B1F4D] z-10 transition-all duration-150"
              >
                <div className="absolute -top-0.5 -translate-x-1/2 bg-[#0B1F4D] text-[#C9A24B] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-b whitespace-nowrap">
                  Capacity: {adaptability}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[#475569]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#1B3A8C]" aria-hidden="true" />
                Occlusal Condition ({occlusalLoad})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#C9A24B]" aria-hidden="true" />
                Macro/Microtrauma ({traumaLoad})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#0B1F4D]" aria-hidden="true" />
                Emotional Stress / ANS ({stressLoad})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#DC2626]" aria-hidden="true" />
                Parafunction ({parafunctionLoad})
              </span>
            </div>

            <p className="mt-3 text-xs text-[#334155] leading-relaxed">
              {exceedsThreshold
                ? 'Combined factors exceed this patient’s adaptability threshold. Prolonged stress upregulates the autonomic nervous system, engaging central pain maintenance and masticatory muscle fatigue.'
                : 'Even with imperfect occlusion or minor stressors, this patient remains asymptomatic because cumulative load stays below their individual adaptive capacity.'}
            </p>
          </div>

          {/* Circadian Pain Profile Visualizer (Sleep Bruxism vs Daytime Clenching) */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-[#0B1F4D]">
                Circadian Muscle Pain Pattern (Parafunction Clue)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'sleep-bruxism', label: 'Morning Pain (Sleep Bruxism)' },
                  { id: 'daytime-clenching', label: 'Late-Day Pain (Daytime Clench)' },
                  { id: 'none', label: 'Baseline' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTiming(opt.id as ParafunctionTiming)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                      timing === opt.id
                        ? 'bg-[#1B3A8C] text-white'
                        : 'bg-white border border-[#E6E8EC] text-[#0B1F4D] hover:border-[#1B3A8C]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <svg viewBox="0 0 480 120" className="w-full h-28" role="img" aria-label="24-hour masticatory muscle pain intensity curve">
              <rect x="0" y="0" width="480" height="120" rx="8" fill="#FFFFFF" stroke="#E6E8EC" />
              {/* Night shading */}
              <rect x="10" y="10" width="120" height="82" fill="#0B1F4D" fillOpacity="0.06" rx="4" />
              <text x="20" y="25" fontSize="10" fill="#475569" fontWeight="600">Sleep (00:00–07:00)</text>
              <text x="155" y="25" fontSize="10" fill="#475569" fontWeight="600">Midday</text>
              <text x="320" y="25" fontSize="10" fill="#475569" fontWeight="600">Late Afternoon / Evening</text>

              {/* Axis */}
              <line x1="20" y1="90" x2="460" y2="90" stroke="#CBD5E1" strokeWidth="1" />
              <text x="25" y="108" fontSize="10" fill="#64748B">00:00</text>
              <text x="125" y="108" fontSize="10" fill="#64748B">07:00 Wake</text>
              <text x="245" y="108" fontSize="10" fill="#64748B">13:00</text>
              <text x="365" y="108" fontSize="10" fill="#64748B">18:00–21:00</text>

              {timing === 'sleep-bruxism' && (
                <>
                  <path
                    d="M25,84 Q80,55 135,34 Q195,46 270,74 T455,82"
                    fill="none"
                    stroke="#1B3A8C"
                    strokeWidth="3"
                  />
                  <circle cx="135" cy="34" r="5" fill="#C9A24B" stroke="#0B1F4D" strokeWidth="2" />
                  <text x="145" y="38" fontSize="10" fill="#0B1F4D" fontWeight="700">
                    Peak pain on awakening
                  </text>
                </>
              )}

              {timing === 'daytime-clenching' && (
                <>
                  <path
                    d="M25,84 Q120,84 185,78 Q290,52 385,32 Q425,38 455,48"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="3"
                  />
                  <circle cx="385" cy="32" r="5" fill="#C9A24B" stroke="#0B1F4D" strokeWidth="2" />
                  <text x="260" y="45" fontSize="10" fill="#991B1B" fontWeight="700">
                    Peak pain late afternoon/evening
                  </text>
                </>
              )}

              {timing === 'none' && (
                <path d="M25,84 L455,84" fill="none" stroke="#059669" strokeWidth="2.5" strokeDasharray="5 4" />
              )}
            </svg>
          </div>
        </div>

        {/* Right Control Deck */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-4">
          <h4 className="text-sm font-bold text-[#0B1F4D]">Factor Sliders</h4>

          {[
            {
              id: 'occ',
              label: 'Occlusal Instability / High Contact',
              val: occlusalLoad,
              set: setOcclusalLoad,
              note: 'Orthodontic therapy routinely modifies only this factor.',
            },
            {
              id: 'tra',
              label: 'Macrotrauma / Microtrauma',
              val: traumaLoad,
              set: setTraumaLoad,
              note: 'Sudden facial blow vs. repetitive orthopedic loading.',
            },
            {
              id: 'str',
              label: 'Emotional Stress (ANS Upregulation)',
              val: stressLoad,
              set: setStressLoad,
              note: 'Central nervous system maintains myogenous fatigue & pain.',
            },
            {
              id: 'par',
              label: 'Parafunction (Bruxism / Clenching)',
              val: parafunctionLoad,
              set: setParafunctionLoad,
              note: 'Heavy non-functional tooth-to-tooth loading.',
            },
          ].map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={`eti-${item.id}`} className="font-semibold text-[#0B1F4D]">
                  {item.label}
                </label>
                <span className="font-mono font-bold text-[#1B3A8C] tabular-nums">{item.val}</span>
              </div>
              <input
                id={`eti-${item.id}`}
                type="range"
                min={0}
                max={60}
                value={item.val}
                onChange={(e) => item.set(Number(e.target.value))}
                className="w-full accent-[#1B3A8C] cursor-pointer"
              />
              <p className="text-[11px] text-[#64748B]">{item.note}</p>
            </div>
          ))}

          <div className="pt-3 border-t border-[#E6E8EC] space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="eti-adapt" className="font-bold text-[#8A691B]">
                Patient Adaptability Capacity
              </label>
              <span className="font-mono font-bold text-[#0B1F4D] tabular-nums">{adaptability}</span>
            </div>
            <input
              id="eti-adapt"
              type="range"
              min={60}
              max={200}
              value={adaptability}
              onChange={(e) => setAdaptability(Number(e.target.value))}
              className="w-full accent-[#C9A24B] cursor-pointer"
            />
            <p className="text-[11px] text-[#475569]">
              Explains why individuals with similar malocclusions vary widely in TMD symptoms.
            </p>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
