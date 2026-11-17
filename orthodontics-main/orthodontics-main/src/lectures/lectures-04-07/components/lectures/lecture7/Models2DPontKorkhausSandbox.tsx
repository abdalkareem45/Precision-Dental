import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

export function Models2DPontKorkhausSandbox() {
  const [siMm, setSiMm] = useState(32);
  const [mpvMm, setMpvMm] = useState(36);
  const [mmvMm, setMmvMm] = useState(46);
  const [luMm, setLuMm] = useState(19);
  const [indexMode, setIndexMode] = useState<'pont' | 'linder-harth'>('pont');

  const cpv = indexMode === 'pont' ? (siMm * 100) / 80 : (siMm * 100) / 85;
  const cmv = (siMm * 100) / 64;
  const premolarDiff = cpv - mpvMm;
  const molarDiff = cmv - mmvMm;

  // Korkhaus mandibular value LL = Lu - 2 mm
  const expectedLl = luMm - 2;

  const handleReset = () => {
    setSiMm(32);
    setMpvMm(36);
    setMmvMm(46);
    setLuMm(19);
    setIndexMode('pont');
  };

  // Visual scaling for arch SVG
  const measuredPreHalf = (mpvMm / 56) * 82;
  const calcPreHalf = (cpv / 56) * 82;
  const measuredMolHalf = (mmvMm / 64) * 104;
  const calcMolHalf = (cmv / 64) * 104;
  const luPx = 112 - (luMm - 18) * 3.5;

  return (
    <SandboxShell
      id="lec7-2d-pont"
      kind="2D Sandbox"
      title="Pont’s, Linder-Harth & Korkhaus Arch Width & Proclination Lab"
      instruction="Compare Pont’s vs. Linder-Harth width predictions and inspect Korkhaus anterior length (Lu / LL)"
      onReset={handleReset}
      headerRight={
        <div className="flex bg-[#FAF8F3] border border-[#E6E8EC] p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setIndexMode('pont')}
            className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
              indexMode === 'pont' ? 'bg-[#1B3A8C] text-white' : 'text-[#0B1F4D]'
            }`}
          >
            Pont’s (80 / 64)
          </button>
          <button
            type="button"
            onClick={() => setIndexMode('linder-harth')}
            className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
              indexMode === 'linder-harth' ? 'bg-[#1B3A8C] text-white' : 'text-[#0B1F4D]'
            }`}
          >
            Linder-Harth (85 / 64)
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Occlusal Arch Measurement Diagram */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4">
          <svg
            viewBox="0 0 320 270"
            className="w-full h-auto max-h-[320px]"
            role="img"
            aria-label="Maxillary occlusal arch comparing measured premolar and molar widths against Pont or Linder-Harth ideal arch"
          >
            {/* Ideal Calculated Arch Outline (Gold Dashed) */}
            <path
              d={`M${160 - calcMolHalf},215 Q${160 - calcPreHalf},115 160,${luPx} Q${160 + calcPreHalf},115 ${160 + calcMolHalf},215`}
              fill="none"
              stroke="#C9A24B"
              strokeWidth="2.8"
              strokeDasharray="6 4"
            />
            {/* Measured Actual Arch Outline (Royal Blue) */}
            <path
              d={`M${160 - measuredMolHalf},215 Q${160 - measuredPreHalf},115 160,${luPx} Q${160 + measuredPreHalf},115 ${160 + measuredMolHalf},215`}
              fill="#1B3A8C"
              fillOpacity="0.08"
              stroke="#1B3A8C"
              strokeWidth="2.8"
            />

            {/* Measured Premolar Width (MPV) Line */}
            <line
              x1={160 - measuredPreHalf}
              y1="145"
              x2={160 + measuredPreHalf}
              y2="145"
              stroke="#0B1F4D"
              strokeWidth="2"
            />
            <circle cx={160 - measuredPreHalf} cy="145" r="4.5" fill="#1B3A8C" />
            <circle cx={160 + measuredPreHalf} cy="145" r="4.5" fill="#1B3A8C" />
            <text x="160" y="138" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0B1F4D">
              MPV {mpvMm.toFixed(1)} vs CPV {cpv.toFixed(1)} mm
            </text>

            {/* Measured Molar Width (MMV) Line */}
            <line
              x1={160 - measuredMolHalf}
              y1="206"
              x2={160 + measuredMolHalf}
              y2="206"
              stroke="#0B1F4D"
              strokeWidth="2"
            />
            <circle cx={160 - measuredMolHalf} cy="206" r="4.5" fill="#1B3A8C" />
            <circle cx={160 + measuredMolHalf} cy="206" r="4.5" fill="#1B3A8C" />
            <text x="160" y="199" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0B1F4D">
              MMV {mmvMm.toFixed(1)} vs CMV {cmv.toFixed(1)} mm
            </text>

            {/* Korkhaus Lu Line (midpoint of inter-premolar line to central incisors) */}
            <line x1="160" y1="145" x2="160" y2={luPx} stroke="#DC2626" strokeWidth="2.2" />
            <circle cx="160" cy={luPx} r="4.5" fill="#DC2626" />
            <text x="168" y={(145 + luPx) / 2} fontSize="10" fontWeight="700" fill="#DC2626">
              Lu = {luMm} mm
            </text>

            <text x="14" y="22" fontSize="10" fontWeight="700" fill="#1B3A8C">
              Solid Blue: Measured Arch · Dashed Gold: Calculated Ideal
            </text>
          </svg>
        </div>

        {/* Sliders & Formulas */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-2.5">
              <div className="text-[10px] text-[#64748B] font-semibold">Premolar Expansion</div>
              <div className="font-mono text-sm font-bold text-[#1B3A8C] tabular-nums">
                {premolarDiff > 0 ? `+${premolarDiff.toFixed(1)} mm` : `${premolarDiff.toFixed(1)} mm`}
              </div>
            </div>
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-2.5">
              <div className="text-[10px] text-[#64748B] font-semibold">Molar Expansion</div>
              <div className="font-mono text-sm font-bold text-[#1B3A8C] tabular-nums">
                {molarDiff > 0 ? `+${molarDiff.toFixed(1)} mm` : `${molarDiff.toFixed(1)} mm`}
              </div>
            </div>
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-2.5">
              <div className="text-[10px] text-[#64748B] font-semibold">Korkhaus LL (Lu−2)</div>
              <div className="font-mono text-sm font-bold text-[#DC2626] tabular-nums">
                {expectedLl.toFixed(1)} mm
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="pont-si" className="font-semibold text-[#0B1F4D]">Sum of 4 Maxillary Incisors (SI)</label>
                <span className="font-mono text-[#1B3A8C] tabular-nums">{siMm.toFixed(1)} mm</span>
              </div>
              <input id="pont-si" type="range" min={26} max={38} step={0.5} value={siMm} onChange={(e) => setSiMm(Number(e.target.value))} className="w-full accent-[#1B3A8C] cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="pont-mpv" className="font-semibold text-[#0B1F4D]">Measured Premolar Value (MPV)</label>
                <span className="font-mono text-[#0B1F4D] tabular-nums">{mpvMm.toFixed(1)} mm</span>
              </div>
              <input id="pont-mpv" type="range" min={28} max={48} step={0.5} value={mpvMm} onChange={(e) => setMpvMm(Number(e.target.value))} className="w-full accent-[#0B1F4D] cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="pont-mmv" className="font-semibold text-[#0B1F4D]">Measured Molar Value (MMV)</label>
                <span className="font-mono text-[#0B1F4D] tabular-nums">{mmvMm.toFixed(1)} mm</span>
              </div>
              <input id="pont-mmv" type="range" min={38} max={58} step={0.5} value={mmvMm} onChange={(e) => setMmvMm(Number(e.target.value))} className="w-full accent-[#0B1F4D] cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="kork-lu" className="font-semibold text-[#0B1F4D]">Korkhaus Maxillary Length (Lu)</label>
                <span className="font-mono text-[#DC2626] tabular-nums">{luMm} mm</span>
              </div>
              <input id="kork-lu" type="range" min={13} max={26} step={0.5} value={luMm} onChange={(e) => setLuMm(Number(e.target.value))} className="w-full accent-[#DC2626] cursor-pointer" />
            </div>
          </div>

          <p className="text-xs text-[#475569] leading-relaxed bg-white border border-[#E6E8EC] rounded-lg p-3">
            <strong className="text-[#0B1F4D]">Formula &amp; Drawback Note:</strong>{' '}
            {indexMode === 'pont' ? 'CPV = (SI × 100) / 80' : 'CPV = (SI × 100) / 85'}, CMV = (SI × 100) / 64.
            {luMm > 21
              ? ' Increased Lu indicates proclined upper anteriors.'
              : luMm < 17
                ? ' Decreased Lu denotes retroclined upper anteriors.'
                : ' Remember: Pont’s index ignores peg/missing laterals and skeletal relationships; preserve original arch form.'}
          </p>
        </div>
      </div>
    </SandboxShell>
  );
}
