import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

export function Models2DMixedDentitionSandbox() {
  const [lowerIncisorsSum, setLowerIncisorsSum] = useState(23.0);
  const [availableMaxQuad, setAvailableMaxQuad] = useState(21.5);
  const [availableMandQuad, setAvailableMandQuad] = useState(21.0);
  const [overjetAllowanceMm, setOverjetAllowanceMm] = useState(1.5);

  // Tanaka & Johnson 75% prediction formulas (Lecture 7)
  const predictedMaxQuad = lowerIncisorsSum / 2 + 11.0;
  const predictedMandQuad = lowerIncisorsSum / 2 + 10.5;

  const maxSpaceBalance = availableMaxQuad - overjetAllowanceMm - predictedMaxQuad;
  const mandSpaceBalance = availableMandQuad - predictedMandQuad;

  const handleReset = () => {
    setLowerIncisorsSum(23.0);
    setAvailableMaxQuad(21.5);
    setAvailableMandQuad(21.0);
    setOverjetAllowanceMm(1.5);
  };

  return (
    <SandboxShell
      id="lec7-2d-mixed"
      kind="2D Sandbox"
      title="Mixed Dentition Space Predictor (Moyer’s & Tanaka-Johnson)"
      instruction="Measure the 4 erupted lower incisors to predict unerupted C + P1 + P2 quadrant widths"
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mixed Dentition Visual Quadrant Diagram */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4 space-y-3">
          <svg
            viewBox="0 0 340 240"
            className="w-full h-auto max-h-[270px]"
            role="img"
            aria-label="Mixed dentition mandibular and maxillary quadrant space prediction diagram"
          >
            {/* Mandibular Arch Base */}
            <path
              d="M65,205 C60,115 92,48 170,48 C248,48 280,115 275,205"
              fill="none"
              stroke="#0B1F4D"
              strokeWidth="2.5"
            />
            {/* 4 Erupted Mandibular Incisors (Measured) */}
            {[136, 155, 174, 193].map((x) => (
              <rect
                key={x}
                x={x - 7}
                y="42"
                width="14"
                height="20"
                rx="3"
                fill="#1B3A8C"
                stroke="#FAF8F3"
                strokeWidth="1.2"
              />
            ))}
            <text x="170" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1B3A8C">
              4 Erupted Lower Incisors = {lowerIncisorsSum.toFixed(1)} mm
            </text>

            {/* Unerupted C + P1 + P2 Zones (Left & Right Quadrants) */}
            <rect
              x="76"
              y="92"
              width="34"
              height="68"
              rx="6"
              fill="#C9A24B"
              fillOpacity="0.28"
              stroke="#C9A24B"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <rect
              x="230"
              y="92"
              width="34"
              height="68"
              rx="6"
              fill="#C9A24B"
              fillOpacity="0.28"
              stroke="#C9A24B"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <text x="93" y="130" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#8A691B">
              C+P1+P2
            </text>
            <text x="247" y="130" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#8A691B">
              C+P1+P2
            </text>

            {/* First Permanent Molars */}
            <rect x="64" y="172" width="26" height="24" rx="5" fill="#E6E8EC" stroke="#0B1F4D" strokeWidth="1.5" />
            <rect x="250" y="172" width="26" height="24" rx="5" fill="#E6E8EC" stroke="#0B1F4D" strokeWidth="1.5" />
            <text x="170" y="224" textAnchor="middle" fontSize="9.5" fill="#475569">
              Maxillary incisors are NOT used due to high size variability.
            </text>
          </svg>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-3">
              <div className="text-[11px] font-semibold text-[#64748B]">Maxillary C+P1+P2 (Quad)</div>
              <div className="font-mono text-base font-bold text-[#1B3A8C] tabular-nums">
                {predictedMaxQuad.toFixed(2)} mm
              </div>
              <div
                className={`text-xs font-bold mt-1 ${
                  maxSpaceBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {maxSpaceBalance >= 0
                  ? `● Surplus: +${maxSpaceBalance.toFixed(1)} mm`
                  : `▲ Deficit: ${maxSpaceBalance.toFixed(1)} mm`}
              </div>
            </div>

            <div className="bg-white border border-[#E6E8EC] rounded-lg p-3">
              <div className="text-[11px] font-semibold text-[#64748B]">Mandibular C+P1+P2 (Quad)</div>
              <div className="font-mono text-base font-bold text-[#0B1F4D] tabular-nums">
                {predictedMandQuad.toFixed(2)} mm
              </div>
              <div
                className={`text-xs font-bold mt-1 ${
                  mandSpaceBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {mandSpaceBalance >= 0
                  ? `● Surplus: +${mandSpaceBalance.toFixed(1)} mm`
                  : `▲ Deficit: ${mandSpaceBalance.toFixed(1)} mm`}
              </div>
            </div>
          </div>
        </div>

        {/* Inputs & Formulas */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="md-l4" className="font-semibold text-[#0B1F4D]">Sum of 4 Mandibular Incisors</label>
                <span className="font-mono font-bold text-[#1B3A8C] tabular-nums">{lowerIncisorsSum.toFixed(1)} mm</span>
              </div>
              <input id="md-l4" type="range" min={19} max={28} step={0.5} value={lowerIncisorsSum} onChange={(e) => setLowerIncisorsSum(Number(e.target.value))} className="w-full accent-[#1B3A8C] cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="md-avail-max" className="font-semibold text-[#0B1F4D]">Available Maxillary Quadrant Space</label>
                <span className="font-mono text-[#0B1F4D] tabular-nums">{availableMaxQuad.toFixed(1)} mm</span>
              </div>
              <input id="md-avail-max" type="range" min={16} max={27} step={0.5} value={availableMaxQuad} onChange={(e) => setAvailableMaxQuad(Number(e.target.value))} className="w-full accent-[#0B1F4D] cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="md-oj" className="font-semibold text-[#0B1F4D]">Maxillary Overjet Correction Allowance</label>
                <span className="font-mono text-[#8A691B] tabular-nums">−{overjetAllowanceMm.toFixed(1)} mm</span>
              </div>
              <input id="md-oj" type="range" min={0} max={4} step={0.5} value={overjetAllowanceMm} onChange={(e) => setOverjetAllowanceMm(Number(e.target.value))} className="w-full accent-[#C9A24B] cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="md-avail-mand" className="font-semibold text-[#0B1F4D]">Available Mandibular Quadrant Space</label>
                <span className="font-mono text-[#0B1F4D] tabular-nums">{availableMandQuad.toFixed(1)} mm</span>
              </div>
              <input id="md-avail-mand" type="range" min={16} max={27} step={0.5} value={availableMandQuad} onChange={(e) => setAvailableMandQuad(Number(e.target.value))} className="w-full accent-[#0B1F4D] cursor-pointer" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-[#E6E8EC] text-xs text-[#334155] space-y-1.5 leading-relaxed">
            <p><strong className="text-[#0B1F4D]">Tanaka &amp; Johnson (75% Moyer’s Equivalent):</strong></p>
            <p className="font-mono text-[11px] text-[#1B3A8C]">
              Maxillary = (Sum / 2) + 11 = {(lowerIncisorsSum / 2).toFixed(2)} + 11 = {predictedMaxQuad.toFixed(2)} mm
            </p>
            <p className="font-mono text-[11px] text-[#0B1F4D]">
              Mandibular = (Sum / 2) + 10.5 = {(lowerIncisorsSum / 2).toFixed(2)} + 10.5 = {predictedMandQuad.toFixed(2)} mm
            </p>
            <p className="text-[#64748B]">
              In the maxillary arch, use separate Moyer’s probability tables and always account for overjet correction when computing space after incisor alignment.
            </p>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
