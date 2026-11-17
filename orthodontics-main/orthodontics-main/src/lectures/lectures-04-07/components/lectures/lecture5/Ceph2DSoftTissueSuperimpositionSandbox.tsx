import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

type LabMode = 'soft-tissue' | 'superimposition';
type SuperStructure = 'cranial-base' | 'maxilla' | 'mandible';

export function Ceph2DSoftTissueSuperimpositionSandbox() {
  const [labMode, setLabMode] = useState<LabMode>('soft-tissue');
  const [lipProminenceMm, setLipProminenceMm] = useState(0);
  const [nasolabialDeg, setNasolabialDeg] = useState(102);

  const [superStructure, setSuperStructure] = useState<SuperStructure>('cranial-base');
  const [useBestReference, setUseBestReference] = useState(true);

  const eUpperMm = -4 + lipProminenceMm;
  const eLowerMm = -2 + lipProminenceMm * 0.85;
  const nasolabialNormal = nasolabialDeg >= 94 && nasolabialDeg <= 110;

  const handleReset = () => {
    setLabMode('soft-tissue');
    setLipProminenceMm(0);
    setNasolabialDeg(102);
    setSuperStructure('cranial-base');
    setUseBestReference(true);
  };

  return (
    <SandboxShell
      id="lec5-2d-soft"
      kind="2D Sandbox"
      title="Soft Tissue Profile (Nasolabial, E-Line, S-Line) & Growth Superimposition"
      instruction="Switch between Soft-Tissue Retraction Planning and T1/T2 Growth Superimposition"
      onReset={handleReset}
      headerRight={
        <div className="flex max-w-full flex-wrap bg-[#FAF8F3] border border-[#E6E8EC] p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setLabMode('soft-tissue')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              labMode === 'soft-tissue' ? 'bg-[#1B3A8C] text-white' : 'text-[#0B1F4D]'
            }`}
          >
            Soft Tissue Profile
          </button>
          <button
            type="button"
            onClick={() => setLabMode('superimposition')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              labMode === 'superimposition' ? 'bg-[#1B3A8C] text-white' : 'text-[#0B1F4D]'
            }`}
          >
            Superimposition
          </button>
        </div>
      }
    >
      {labMode === 'soft-tissue' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4">
            <svg
              viewBox="0 0 320 290"
              className="w-full h-auto max-h-82.5"
              role="img"
              aria-label="Soft tissue profile showing Nasolabial angle, Rickett's E-line, and Steiner's S-line"
            >
              {/* Facial profile curve */}
              <path
                d={`M155,28 Q160,65 152,85 L224,132 Q232,140 212,148 L194,154 Q${198 + lipProminenceMm * 3},170 ${192 + lipProminenceMm * 3},182 L182,190 Q${192 + lipProminenceMm * 2.5},202 ${186 + lipProminenceMm * 2.5},216 L176,228 Q194,252 182,272 L130,282`}
                fill="#FFFFFF"
                stroke="#0B1F4D"
                strokeWidth="2.2"
              />

              {/* Rickett's E-line: Soft tissue Pogonion (188, 256) to Nose Tip (226, 136) */}
              <line x1="234" y1="112" x2="182" y2="274" stroke="#DC2626" strokeWidth="2" />
              <text x="236" y="120" fontSize="10" fontWeight="700" fill="#DC2626">Rickett’s E-line</text>

              {/* Steiner's S-line: Soft tissue Pogonion (188, 256) to midpoint of S-curve (208, 144) */}
              <line x1="214" y1="116" x2="180" y2="274" stroke="#1B3A8C" strokeWidth="2" strokeDasharray="5 3" />
              <text x="122" y="120" fontSize="10" fontWeight="700" fill="#1B3A8C">Steiner’s S-line</text>

              {/* Nasolabial Angle lines at Subnasale (194, 154) */}
              <line x1="194" y1="154" x2="228" y2="142" stroke="#C9A24B" strokeWidth="2.4" />
              <line
                x1="194"
                y1="154"
                x2={194 + Math.cos(((nasolabialDeg - 18) * Math.PI) / 180) * 34}
                y2={154 + Math.sin(((nasolabialDeg - 18) * Math.PI) / 180) * 34}
                stroke="#C9A24B"
                strokeWidth="2.4"
              />
              <text x="208" y="168" fontSize="10.5" fontWeight="700" fill="#8A691B">
                NLA {nasolabialDeg}°
              </text>
            </svg>
          </div>

          <div className="lg:col-span-6 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-white border border-[#E6E8EC] rounded-lg p-2.5">
                <div className="text-[10px] font-semibold text-[#64748B]">Nasolabial (102°±8°)</div>
                <div className="font-mono text-sm font-bold text-[#0B1F4D] tabular-nums">{nasolabialDeg}°</div>
              </div>
              <div className="bg-white border border-[#E6E8EC] rounded-lg p-2.5">
                <div className="text-[10px] font-semibold text-[#64748B]">Upper Lip to E-Line</div>
                <div className="font-mono text-sm font-bold text-[#DC2626] tabular-nums">
                  {eUpperMm.toFixed(1)} mm (Norm −4)
                </div>
              </div>
              <div className="bg-white border border-[#E6E8EC] rounded-lg p-2.5">
                <div className="text-[10px] font-semibold text-[#64748B]">Lower Lip to E-Line</div>
                <div className="font-mono text-sm font-bold text-[#DC2626] tabular-nums">
                  {eLowerMm.toFixed(1)} mm (Norm −2)
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="st-lip" className="font-semibold text-[#0B1F4D]">Lip Retraction / Protrusion Shift</label>
                  <span className="font-mono text-[#1B3A8C] tabular-nums">
                    {lipProminenceMm >= 0 ? `+${lipProminenceMm}` : lipProminenceMm} mm
                  </span>
                </div>
                <input id="st-lip" type="range" min={-5} max={6} step={0.5} value={lipProminenceMm} onChange={(e) => setLipProminenceMm(Number(e.target.value))} className="w-full accent-[#1B3A8C] cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="st-nla" className="font-semibold text-[#0B1F4D]">Nasolabial Angle</label>
                  <span className="font-mono text-[#8A691B] tabular-nums">{nasolabialDeg}°</span>
                </div>
                <input id="st-nla" type="range" min={82} max={125} step={1} value={nasolabialDeg} onChange={(e) => setNasolabialDeg(Number(e.target.value))} className="w-full accent-[#C9A24B] cursor-pointer" />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-[#E6E8EC] text-xs text-[#334155] leading-relaxed">
              <strong className="text-[#0B1F4D]">Clinical Extraction Decision:</strong>{' '}
              {!nasolabialNormal && nasolabialDeg > 110
                ? 'Nasolabial angle is already obtuse (>110°) and lips sit behind S-line (too flat). Avoid orthodontic extraction & incisor retraction to prevent an unesthetic profile.'
                : lipProminenceMm > 2.5
                  ? 'Lips lie anterior to Steiner’s S-line (prominent). Controlled incisor retraction may improve soft-tissue balance if nasolabial angle remains within 102°±8°.'
                  : 'Profile lies near Caucasian soft-tissue reference balance (note: lip position norms vary with age, sex, and ethnic group).'}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4">
            <svg
              viewBox="0 0 340 280"
              className="w-full h-auto max-h-80"
              role="img"
              aria-label="Cephalometric superimposition T1 vs T2 comparison"
            >
              {/* T1 Tracing (Baseline - Navy) */}
              <g stroke="#0B1F4D" strokeWidth="2" fill="none">
                <path d="M72,72 Q95,70 112,72 L245,64" />
                <path d="M150,145 L252,148 L242,175" />
                <path d="M88,215 L228,255 Q244,248 238,225 L222,220" />
              </g>

              {/* T2 Tracing (Growth/Treatment - Royal Blue or shifted with rotational error) */}
              <g
                stroke={useBestReference ? '#1B3A8C' : '#DC2626'}
                strokeWidth="2"
                strokeDasharray="5 3"
                fill="none"
                transform={
                  useBestReference
                    ? 'translate(6, 12)'
                    : superStructure === 'cranial-base'
                      ? 'rotate(-4.5 112 72) translate(4, 14)'
                      : 'rotate(5 150 145) translate(8, 10)'
                }
              >
                <path d="M72,72 Q95,70 112,72 L254,64" />
                <path d="M150,145 L258,148 L248,175" />
                <path d="M88,215 L234,262 Q250,254 244,230 L228,225" />
              </g>

              {/* Highlight stable registration structure */}
              {superStructure === 'cranial-base' && (
                <circle cx="112" cy="72" r="8" fill="#C9A24B" fillOpacity="0.35" stroke="#C9A24B" strokeWidth="2" />
              )}
              {superStructure === 'maxilla' && (
                <path d="M195,118 Q204,132 198,146" stroke="#C9A24B" strokeWidth="4" fill="none" />
              )}
              {superStructure === 'mandible' && (
                <path d="M226,225 Q232,252 222,256" stroke="#C9A24B" strokeWidth="4" fill="none" />
              )}

              <text x="16" y="24" fontSize="10.5" fontWeight="700" fill="#0B1F4D">
                Solid Navy: T1 Baseline · Dashed: T2 Follow-up
              </text>
              <text x="16" y="268" fontSize="10" fontWeight="600" fill={useBestReference ? '#059669' : '#DC2626'}>
                {useBestReference
                  ? '● Stable Reference Structure Selected'
                  : '▲ Rotational / Remodeling Error Introduced'}
              </text>
            </svg>
          </div>

          <div className="lg:col-span-6 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'cranial-base', label: 'Cranial Base' },
                { id: 'maxilla', label: 'The Maxilla' },
                { id: 'mandible', label: 'The Mandible' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSuperStructure(s.id as SuperStructure)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                    superStructure === s.id
                      ? 'bg-[#1B3A8C] text-white border-[#1B3A8C]'
                      : 'bg-white text-[#0B1F4D] border-[#E6E8EC]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUseBestReference(true)}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                  useBestReference
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-[#0B1F4D] border-[#E6E8EC]'
                }`}
              >
                Preferred Stable Method
              </button>
              <button
                type="button"
                onClick={() => setUseBestReference(false)}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                  !useBestReference
                    ? 'bg-rose-700 text-white border-rose-700'
                    : 'bg-white text-[#0B1F4D] border-[#E6E8EC]'
                }`}
              >
                Error-Prone Alternative
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E6E8EC] text-xs sm:text-sm text-[#334155] leading-relaxed space-y-2">
              {superStructure === 'cranial-base' && (
                <>
                  <p><strong className="text-[#0B1F4D]">Preferred:</strong> Anterior cranial base outline (stable after age 7) or SN registered at Sella.</p>
                  <p><strong className="text-[#0B1F4D]">Pitfall:</strong> Upward or downward growth at Nasion rotates the SN line, introducing a rotational error across the entire facial tracing.</p>
                </>
              )}
              {superStructure === 'maxilla' && (
                <>
                  <p><strong className="text-[#0B1F4D]">Preferred:</strong> Anterior contour of the zygomatic process (least affected by periosteal remodeling).</p>
                  <p><strong className="text-[#0B1F4D]">Alternative:</strong> Maxillary plane registered at PNS is easier to identify but undergoes surface remodeling.</p>
                </>
              )}
              {superStructure === 'mandible' && (
                <>
                  <p><strong className="text-[#0B1F4D]">Preferred (order of usefulness):</strong> Innermost cortical bone of inferior symphysis border, anterior chin contour, inferior dental canal, 3rd molar crypt before root formation, tip of chin.</p>
                  <p><strong className="text-[#0B1F4D]">Pitfall:</strong> Mandibular plane is highly erroneous due to extensive lower border and gonial angle remodeling.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </SandboxShell>
  );
}
