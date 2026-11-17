import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

type CareyInclination = 'normal' | 'proclined' | 'retroclined';

export function Models2DCareyHoweSandbox() {
  const [subMode, setSubMode] = useState<'carey' | 'ashley-howe'>('carey');

  // Carey's state
  const [inclination, setInclination] = useState<CareyInclination>('normal');
  const [archLengthMm, setArchLengthMm] = useState(64.0);
  const [toothMaterialMm, setToothMaterialMm] = useState(67.5);

  // Ashley Howe's state
  const [ttmMm, setTtmMm] = useState(92.0);
  const [pmdMm, setPmdMm] = useState(37.0);
  const [pmbawMm, setPmbawMm] = useState(40.5);
  const [balMm, setBalMm] = useState(31.0);

  const discrepancy = Math.max(0, toothMaterialMm - archLengthMm);
  const careyPlan =
    toothMaterialMm <= archLengthMm
      ? 'No excess (Sufficient arch length)'
      : discrepancy <= 2.5
        ? '0–2.5 mm: Proximal stripping to reduce minimal excess'
        : discrepancy <= 5.0
          ? '2.5–5 mm: Extraction of 2nd premolars indicated'
          : '> 5 mm: Extraction of 1st premolars usually required';

  const pmdPct = (pmdMm * 100) / ttmMm;
  const pmbawPct = (pmbawMm * 100) / ttmMm;
  const balPct = (balMm * 100) / ttmMm;

  const handleReset = () => {
    setInclination('normal');
    setArchLengthMm(64.0);
    setToothMaterialMm(67.5);
    setTtmMm(92.0);
    setPmdMm(37.0);
    setPmbawMm(40.5);
    setBalMm(31.0);
  };

  // Brass wire anterior Y shift based on inclination
  const wireAnteriorY = inclination === 'normal' ? 66 : inclination === 'proclined' ? 84 : 50;

  return (
    <SandboxShell
      id="lec7-2d-carey"
      kind="2D Sandbox"
      title="Carey’s Brass-Wire Analysis & Ashley Howe’s Basal Arch Lab"
      instruction="Switch between Carey’s arch-length discrepancy & Ashley Howe’s apical base percentages"
      onReset={handleReset}
      headerRight={
        <div className="flex bg-[#FAF8F3] border border-[#E6E8EC] p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setSubMode('carey')}
            className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
              subMode === 'carey' ? 'bg-[#1B3A8C] text-white' : 'text-[#0B1F4D]'
            }`}
          >
            Carey’s Wire
          </button>
          <button
            type="button"
            onClick={() => setSubMode('ashley-howe')}
            className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
              subMode === 'ashley-howe' ? 'bg-[#1B3A8C] text-white' : 'text-[#0B1F4D]'
            }`}
          >
            Ashley Howe’s
          </button>
        </div>
      }
    >
      {subMode === 'carey' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4">
            <svg
              viewBox="0 0 320 250"
              className="w-full h-auto max-h-[290px]"
              role="img"
              aria-label="Mandibular cast showing Carey soft brass wire placement according to incisor inclination"
            >
              {/* Mandibular horseshoe cast outline */}
              <path
                d="M65,210 C58,125 84,56 160,56 C236,56 262,125 255,210 L226,210 C226,138 205,94 160,94 C115,94 94,138 94,210 Z"
                fill="#FFFFFF"
                stroke="#0B1F4D"
                strokeWidth="1.8"
              />
              {/* First molars at posterior ends */}
              <rect x="64" y="182" width="28" height="24" rx="5" fill="#E6E8EC" stroke="#0B1F4D" strokeWidth="1.5" />
              <rect x="228" y="182" width="28" height="24" rx="5" fill="#E6E8EC" stroke="#0B1F4D" strokeWidth="1.5" />
              {/* Anterior incisor crowns */}
              {[124, 142, 160, 178].map((cx) => (
                <ellipse key={cx} cx={cx + 9} cy="66" rx="8" ry="12" fill="#FAF8F3" stroke="#0B1F4D" strokeWidth="1.4" />
              ))}

              {/* Soft Brass Wire Path (mesial of 1st molar -> buccal cusps -> anterior zone -> contralateral 1st molar mesial) */}
              <path
                d={`M78,180 Q76,105 120,${wireAnteriorY + 12} Q160,${wireAnteriorY} 200,${wireAnteriorY + 12} Q244,105 242,180`}
                fill="none"
                stroke="#C9A24B"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <text x="16" y="24" fontSize="10.5" fontWeight="700" fill="#0B1F4D">
                Soft Brass Wire Path ({inclination === 'normal' ? 'Incisal Edges' : inclination === 'proclined' ? 'Along Cingulum' : 'Along Labial Surface'})
              </text>
              <text x="160" y="238" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">
                Lower Arch = Carey’s · Upper Arch = Arch Perimeter Analysis
              </text>
            </svg>
          </div>

          <div className="lg:col-span-6 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-4">
            <div>
              <p className="text-xs font-bold text-[#0B1F4D] mb-2">Anterior Brass Wire Landmark Rule</p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'normal', label: 'Normal (Incisal)' },
                  { id: 'proclined', label: 'Proclined (Cingulum)' },
                  { id: 'retroclined', label: 'Retroclined (Labial)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setInclination(opt.id as CareyInclination)}
                    className={`px-2 py-2 text-[11px] font-semibold rounded-lg border cursor-pointer ${
                      inclination === opt.id
                        ? 'bg-[#1B3A8C] text-white border-[#1B3A8C]'
                        : 'bg-white text-[#0B1F4D] border-[#E6E8EC]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="carey-arch" className="font-semibold text-[#0B1F4D]">Available Arch Length (Brass Wire)</label>
                  <span className="font-mono text-[#1B3A8C] tabular-nums">{archLengthMm.toFixed(1)} mm</span>
                </div>
                <input id="carey-arch" type="range" min={56} max={76} step={0.5} value={archLengthMm} onChange={(e) => setArchLengthMm(Number(e.target.value))} className="w-full accent-[#1B3A8C] cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="carey-ttm" className="font-semibold text-[#0B1F4D]">Tooth Material (Anterior to 1st Molars)</label>
                  <span className="font-mono text-[#8A691B] tabular-nums">{toothMaterialMm.toFixed(1)} mm</span>
                </div>
                <input id="carey-ttm" type="range" min={58} max={78} step={0.5} value={toothMaterialMm} onChange={(e) => setToothMaterialMm(Number(e.target.value))} className="w-full accent-[#C9A24B] cursor-pointer" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E6E8EC] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B]">Arch Length Discrepancy</span>
                <span className="font-mono text-base font-bold text-[#DC2626] tabular-nums">
                  {discrepancy.toFixed(1)} mm
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#0B1F4D]">{careyPlan}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4 space-y-3">
            <svg viewBox="0 0 320 220" className="w-full h-auto max-h-[250px]" role="img" aria-label="Ashley Howe PMD, PMBAW, and BAL measurements diagram">
              <path
                d="M72,188 C66,112 96,46 160,46 C224,46 254,112 248,188"
                fill="none"
                stroke="#0B1F4D"
                strokeWidth="3"
              />
              {/* PMD: Premolar buccal cusp diameter */}
              <line x1="92" y1="112" x2="228" y2="112" stroke="#1B3A8C" strokeWidth="2.5" />
              <text x="160" y="106" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1B3A8C">
                PMD ({pmdMm.toFixed(1)} mm)
              </text>

              {/* PMBAW: Canine fossa apical base (8mm below papilla) */}
              <line x1="78" y1="128" x2="242" y2="128" stroke="#C9A24B" strokeWidth="2.5" strokeDasharray="5 3" />
              <text x="160" y="142" textAnchor="middle" fontSize="10" fontWeight="700" fill="#8A691B">
                PMBAW ({pmbawMm.toFixed(1)} mm · Apical Base)
              </text>

              {/* BAL: Downs A/B point to distal of 1st molars */}
              <line x1="160" y1="48" x2="160" y2="188" stroke="#DC2626" strokeWidth="2.2" />
              <line x1="72" y1="188" x2="248" y2="188" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="166" y="172" fontSize="10" fontWeight="700" fill="#DC2626">
                BAL ({balMm.toFixed(1)} mm)
              </text>
            </svg>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white border border-[#E6E8EC] rounded-lg p-2">
                <div className="text-[10px] text-[#64748B] font-semibold">PMD %</div>
                <div className="font-mono text-sm font-bold text-[#1B3A8C] tabular-nums">{pmdPct.toFixed(1)}%</div>
              </div>
              <div className="bg-white border border-[#E6E8EC] rounded-lg p-2">
                <div className="text-[10px] text-[#64748B] font-semibold">PMBAW %</div>
                <div className="font-mono text-sm font-bold text-[#8A691B] tabular-nums">{pmbawPct.toFixed(1)}%</div>
              </div>
              <div className="bg-white border border-[#E6E8EC] rounded-lg p-2">
                <div className="text-[10px] text-[#64748B] font-semibold">BAL %</div>
                <div className="font-mono text-sm font-bold text-[#DC2626] tabular-nums">{balPct.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-3">
            {[
              { id: 'ah-ttm', label: 'Total Tooth Material (TTM: M1 to M1)', val: ttmMm, set: setTtmMm, min: 76, max: 108 },
              { id: 'ah-pmd', label: 'Premolar Diameter (PMD: Buccal Cusps)', val: pmdMm, set: setPmdMm, min: 28, max: 48 },
              { id: 'ah-pmbaw', label: 'Premolar Basal Arch Width (PMBAW)', val: pmbawMm, set: setPmbawMm, min: 30, max: 52 },
              { id: 'ah-bal', label: 'Basal Arch Length (BAL)', val: balMm, set: setBalMm, min: 24, max: 42 },
            ].map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor={s.id} className="font-semibold text-[#0B1F4D]">{s.label}</label>
                  <span className="font-mono font-bold text-[#1B3A8C] tabular-nums">{s.val.toFixed(1)} mm</span>
                </div>
                <input id={s.id} type="range" min={s.min} max={s.max} step={0.5} value={s.val} onChange={(e) => s.set(Number(e.target.value))} className="w-full accent-[#1B3A8C] cursor-pointer" />
              </div>
            ))}

            <div className="p-3 rounded-lg bg-white border border-[#E6E8EC] text-xs text-[#334155] leading-relaxed">
              <strong className="text-[#0B1F4D]">PMBAW vs. PMD Interpretation:</strong>{' '}
              {pmbawMm > pmdMm
                ? `Apical base (${pmbawMm.toFixed(1)} mm) exceeds coronal premolar width (${pmdMm.toFixed(1)} mm) — arch expansion is feasible without over-expanding roots out of bone.`
                : `Coronal width (${pmdMm.toFixed(1)} mm) exceeds or equals basal bone (${pmbawMm.toFixed(1)} mm) — PMBAW% (${pmbawPct.toFixed(1)}%) favors considering extraction over unstable expansion.`}
            </div>
          </div>
        </div>
      )}
    </SandboxShell>
  );
}
