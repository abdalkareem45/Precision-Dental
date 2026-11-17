import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

export function Models2DBoltonSandbox() {
  const [max6, setMax6] = useState(46.0);
  const [mand6, setMand6] = useState(35.5);
  const [maxPost6, setMaxPost6] = useState(48.0);
  const [mandPost6, setMandPost6] = useState(50.3);

  const sumMax12 = max6 + maxPost6;
  const sumMand12 = mand6 + mandPost6;

  const overallRatio = (sumMand12 * 100) / sumMax12;
  const anteriorRatio = (mand6 * 100) / max6;

  const overallExcess = overallRatio > 91.3 ? 'Mandibular Overall Excess' : overallRatio < 91.3 ? 'Maxillary Overall Excess' : 'Ideal Overall Ratio';
  const anteriorExcess =
    anteriorRatio > 77.2
      ? 'Mandibular Anterior Excess (Consider lower proximal stripping / incisor extraction if severe)'
      : anteriorRatio < 77.2
        ? 'Maxillary Anterior Excess (Bolton prefers proximal stripping on upper arch)'
        : 'Ideal Anterior Ratio';

  const applyPreset = (type: 'ideal' | 'mand-ant-excess' | 'max-ant-excess') => {
    if (type === 'ideal') {
      setMax6(46.0);
      setMand6(35.5);
      setMaxPost6(48.0);
      setMandPost6(50.3);
    } else if (type === 'mand-ant-excess') {
      setMax6(44.0);
      setMand6(37.5);
      setMaxPost6(48.0);
      setMandPost6(50.5);
    } else {
      setMax6(49.5);
      setMand6(34.5);
      setMaxPost6(48.5);
      setMandPost6(49.0);
    }
  };

  return (
    <SandboxShell
      id="lec7-2d-bolton"
      kind="2D Sandbox"
      title="Wayne A. Bolton Tooth-Size Discrepancy Lab (Overall 91.3% & Anterior 77.2%)"
      instruction="Adjust anterior (6-tooth) and posterior segments or load clinical presets"
      onReset={() => applyPreset('ideal')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Maxillary vs Mandibular Tooth Material Bars */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4 space-y-4">
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={() => applyPreset('ideal')} className="px-2.5 py-1 text-xs font-semibold rounded bg-white border border-[#E6E8EC] hover:border-[#1B3A8C] cursor-pointer">
                Preset: Ideal (91.3% / 77.2%)
              </button>
              <button type="button" onClick={() => applyPreset('mand-ant-excess')} className="px-2.5 py-1 text-xs font-semibold rounded bg-white border border-[#E6E8EC] hover:border-[#1B3A8C] cursor-pointer">
                Preset: Mandibular Anterior Excess
              </button>
              <button type="button" onClick={() => applyPreset('max-ant-excess')} className="px-2.5 py-1 text-xs font-semibold rounded bg-white border border-[#E6E8EC] hover:border-[#1B3A8C] cursor-pointer">
                Preset: Maxillary Anterior Excess
              </button>
            </div>

            {/* Dual-Arch Tooth Width Visualization */}
            <svg viewBox="0 0 360 155" className="w-full h-36" role="img" aria-label="Maxillary versus mandibular 12-tooth and 6-anterior width comparison">
              <text x="12" y="22" fontSize="10.5" fontWeight="700" fill="#0B1F4D">
                Maxillary 12 ({sumMax12.toFixed(1)} mm) · Ant 6 = {max6.toFixed(1)} mm
              </text>
              <rect x="12" y="30" width={max6 * 3.1} height="24" rx="4" fill="#1B3A8C" />
              <rect x={14 + max6 * 3.1} y="30" width={maxPost6 * 3.1} height="24" rx="4" fill="#C9A24B" />

              <text x="12" y="88" fontSize="10.5" fontWeight="700" fill="#0B1F4D">
                Mandibular 12 ({sumMand12.toFixed(1)} mm) · Ant 6 = {mand6.toFixed(1)} mm
              </text>
              <rect x="12" y="96" width={mand6 * 3.1} height="24" rx="4" fill="#0B1F4D" />
              <rect x={14 + mand6 * 3.1} y="96" width={mandPost6 * 3.1} height="24" rx="4" fill="#64748B" />

              {/* Ideal 77.2% target marker for Mand 6 */}
              <line
                x1={12 + max6 * 0.772 * 3.1}
                y1="90"
                x2={12 + max6 * 0.772 * 3.1}
                y2="128"
                stroke="#DC2626"
                strokeWidth="2.2"
              />
              <text x={12 + max6 * 0.772 * 3.1} y="144" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#DC2626">
                Ideal Mand 6 (77.2%)
              </text>
            </svg>
          </div>

          {/* Live Ratio Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-[#E6E8EC]">
              <p className="text-[11px] font-semibold text-[#64748B]">Overall Ratio (Norm 91.3%)</p>
              <p className="font-mono text-xl font-bold text-[#0B1F4D] tabular-nums mt-0.5">
                {overallRatio.toFixed(1)}%
              </p>
              <p className="text-xs font-medium text-[#1B3A8C] mt-1">{overallExcess}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#E6E8EC]">
              <p className="text-[11px] font-semibold text-[#64748B]">Anterior Ratio (Norm 77.2%)</p>
              <p className="font-mono text-xl font-bold text-[#0B1F4D] tabular-nums mt-0.5">
                {anteriorRatio.toFixed(1)}%
              </p>
              <p className="text-xs font-medium text-[#8A691B] mt-1">
                {anteriorRatio > 77.2 ? 'Mandibular Excess' : anteriorRatio < 77.2 ? 'Maxillary Excess' : 'Balanced'}
              </p>
            </div>
          </div>
        </div>

        {/* Sliders & Management */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-3.5">
          {[
            { id: 'b-max6', label: 'Sum of Maxillary Anterior 6 (Canine–Canine)', val: max6, set: setMax6, min: 38, max: 54 },
            { id: 'b-mand6', label: 'Sum of Mandibular Anterior 6 (Canine–Canine)', val: mand6, set: setMand6, min: 30, max: 44 },
            { id: 'b-maxp', label: 'Maxillary Posterior 6 (P1, P2, M1 × 2)', val: maxPost6, set: setMaxPost6, min: 40, max: 56 },
            { id: 'b-mandp', label: 'Mandibular Posterior 6 (P1, P2, M1 × 2)', val: mandPost6, set: setMandPost6, min: 40, max: 58 },
          ].map((s) => (
            <div key={s.id}>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor={s.id} className="font-semibold text-[#0B1F4D]">{s.label}</label>
                <span className="font-mono font-bold text-[#1B3A8C] tabular-nums">{s.val.toFixed(1)} mm</span>
              </div>
              <input
                id={s.id}
                type="range"
                min={s.min}
                max={s.max}
                step={0.5}
                value={s.val}
                onChange={(e) => s.set(Number(e.target.value))}
                className="w-full accent-[#1B3A8C] cursor-pointer"
              />
            </div>
          ))}

          <div className="p-3.5 rounded-lg bg-white border border-[#E6E8EC] text-xs text-[#334155] leading-relaxed space-y-1.5">
            <p><strong className="text-[#0B1F4D]">Clinical Plan:</strong> {anteriorExcess}</p>
            <p className="text-[#64748B]">
              Drawbacks: Derived from a specific population and ignores sexual dimorphism in maxillary canine widths.
            </p>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
