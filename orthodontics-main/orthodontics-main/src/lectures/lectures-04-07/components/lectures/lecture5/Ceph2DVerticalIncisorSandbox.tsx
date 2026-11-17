import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

export function Ceph2DVerticalIncisorSandbox() {
  const [mmpa, setMmpa] = useState(27);
  const [u1Angle, setU1Angle] = useState(109);
  const [l1ManualOffset, setL1ManualOffset] = useState(0);
  const [pfhMm, setPfhMm] = useState(76);
  const [lafhMm, setLafhMm] = useState(66);

  const uafhMm = 54;
  const tafhMm = uafhMm + lafhMm;
  const afpPct = (lafhMm / tafhMm) * 100;
  const jarabakPct = (pfhMm / tafhMm) * 100;

  // Derived vertical & incisor norms from Lecture 5
  const fma = mmpa + 1;
  const snMp = mmpa + 5;
  const expectedL1 = 120 - mmpa;
  const actualL1 = expectedL1 + l1ManualOffset;
  const interIncisal = 360 - mmpa - u1Angle - actualL1;

  const jarabakLabel =
    jarabakPct < 62
      ? 'Vertical Growth (< 62%)'
      : jarabakPct <= 65
        ? 'Normal Balanced (62–65%)'
        : 'Horizontal Growth (> 65%)';

  const handleReset = () => {
    setMmpa(27);
    setU1Angle(109);
    setL1ManualOffset(0);
    setPfhMm(76);
    setLafhMm(66);
  };

  // Visual coordinates for Maxillary plane & Mandibular plane rotation
  const maxY = 135;
  const gonionY = 175 + (mmpa - 27) * 1.4;
  const mentonY = 235 + (mmpa - 27) * 3.1;

  return (
    <SandboxShell
      id="lec5-2d-vertical"
      kind="2D Sandbox"
      title="Vertical Proportions (MMPA, AFP, Jarabak) & Incisor Compensation (120° − MMPA)"
      instruction="Vary MMPA, facial heights, and incisor inclinations to observe skeletal & dental compensation"
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Vertical & Incisor Schematic */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4">
          <svg
            viewBox="0 0 340 295"
            className="w-full h-auto max-h-[340px]"
            role="img"
            aria-label="Vertical skeletal planes, Jarabak facial heights, and incisor angulation diagram"
          >
            {/* SN Line */}
            <line x1="75" y1="68" x2="238" y2="54" stroke="#0B1F4D" strokeWidth="2" />
            <text x="72" y="58" fontSize="10" fontWeight="700" fill="#0B1F4D">S</text>
            <text x="242" y="54" fontSize="10" fontWeight="700" fill="#0B1F4D">N</text>

            {/* Maxillary Plane (ANS-PNS) */}
            <line x1="125" y1={maxY} x2="255" y2={maxY} stroke="#C9A24B" strokeWidth="2.4" />
            <text x="125" y={maxY - 6} fontSize="10" fontWeight="700" fill="#8A691B">Maxillary Plane</text>

            {/* Mandibular Plane (Go-Me) */}
            <line x1="78" y1={gonionY} x2="232" y2={mentonY} stroke="#DC2626" strokeWidth="2.4" />
            <text x="72" y={gonionY + 14} fontSize="10" fontWeight="700" fill="#DC2626">Go</text>
            <text x="236" y={mentonY + 12} fontSize="10" fontWeight="700" fill="#DC2626">Me</text>

            {/* Posterior Facial Height S-Go */}
            <line x1="78" y1="68" x2="78" y2={gonionY} stroke="#059669" strokeWidth="2" strokeDasharray="4 3" />
            <text x="20" y={(68 + gonionY) / 2} fontSize="10" fontWeight="700" fill="#059669">PFH {pfhMm}mm</text>

            {/* Total Anterior Facial Height N-Me & LAFH */}
            <line x1="276" y1="54" x2="276" y2={mentonY} stroke="#1B3A8C" strokeWidth="2" />
            <line x1="296" y1={maxY} x2="296" y2={mentonY} stroke="#0B1F4D" strokeWidth="2" />
            <text x="280" y="96" fontSize="9.5" fontWeight="700" fill="#1B3A8C">TAFH {tafhMm}mm</text>
            <text x="300" y={(maxY + mentonY) / 2} fontSize="9.5" fontWeight="700" fill="#0B1F4D">LAFH</text>

            {/* Upper Incisor Axis (relative to Maxillary Plane at 228, maxY) */}
            <g transform={`translate(228, ${maxY}) rotate(${180 - u1Angle - 90})`}>
              <line x1="0" y1="-22" x2="0" y2="48" stroke="#1B3A8C" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="0" cy="34" rx="5" ry="13" fill="#FFFFFF" stroke="#1B3A8C" strokeWidth="2" />
            </g>

            {/* Lower Incisor Axis (relative to Mandibular Plane near symphysis) */}
            <g transform={`translate(220, ${mentonY - 12}) rotate(${-(90 - actualL1) + (mmpa - 27)})`}>
              <line x1="0" y1="12" x2="0" y2="-54" stroke="#C9A24B" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="0" cy="-38" rx="4.5" ry="12" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2" />
            </g>

            <text x="16" y="280" fontSize="10.5" fontWeight="700" fill="#0B1F4D">
              MMPA {mmpa}° · Inter-incisal {interIncisal.toFixed(0)}° (Norm 135°±10°)
            </text>
          </svg>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-2">
              <div className="text-[10px] text-[#64748B] font-semibold">AFP (Norm 55%)</div>
              <div className="font-mono text-sm font-bold text-[#1B3A8C] tabular-nums">{afpPct.toFixed(1)}%</div>
            </div>
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-2">
              <div className="text-[10px] text-[#64748B] font-semibold">Jarabak (62–65%)</div>
              <div className="font-mono text-sm font-bold text-[#059669] tabular-nums">{jarabakPct.toFixed(1)}%</div>
            </div>
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-2">
              <div className="text-[10px] text-[#64748B] font-semibold">Ideal L1 (120−MMPA)</div>
              <div className="font-mono text-sm font-bold text-[#8A691B] tabular-nums">{expectedL1}°</div>
            </div>
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-2">
              <div className="text-[10px] text-[#64748B] font-semibold">FMA / SN-MP</div>
              <div className="font-mono text-sm font-bold text-[#0B1F4D] tabular-nums">{fma}° / {snMp}°</div>
            </div>
          </div>
        </div>

        {/* Sliders & Live Clinical Interpretation */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-4">
          <div className="p-3 rounded-lg bg-white border border-[#E6E8EC] flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold text-[#64748B]">Jarabak Growth Pattern</p>
              <p className="text-sm font-bold text-[#0B1F4D]">{jarabakLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-[#64748B]">L1/Mand Plane</p>
              <p className="font-mono text-sm font-bold text-[#1B3A8C] tabular-nums">
                {actualL1}° (Norm 93°±6°)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="vert-mmpa" className="font-semibold text-[#0B1F4D]">MMPA (Norm 27°±4°)</label>
                <span className="font-mono font-bold text-[#DC2626] tabular-nums">{mmpa}°</span>
              </div>
              <input id="vert-mmpa" type="range" min={17} max={39} value={mmpa} onChange={(e) => setMmpa(Number(e.target.value))} className="w-full accent-[#DC2626] cursor-pointer" />
              <p className="text-[11px] text-[#64748B]">
                As MMPA increases, lower incisors naturally retrocline: 120° − {mmpa}° = {expectedL1}°.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="vert-u1" className="font-semibold text-[#0B1F4D]">Upper Incisor / Maxillary Plane (Norm 109°±6°)</label>
                <span className="font-mono font-bold text-[#1B3A8C] tabular-nums">{u1Angle}°</span>
              </div>
              <input id="vert-u1" type="range" min={94} max={126} value={u1Angle} onChange={(e) => setU1Angle(Number(e.target.value))} className="w-full accent-[#1B3A8C] cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="vert-l1" className="font-semibold text-[#0B1F4D]">Lower Incisor Deviation from Compensation</label>
                <span className="font-mono font-bold text-[#8A691B] tabular-nums">
                  {l1ManualOffset >= 0 ? `+${l1ManualOffset}` : l1ManualOffset}°
                </span>
              </div>
              <input id="vert-l1" type="range" min={-12} max={12} value={l1ManualOffset} onChange={(e) => setL1ManualOffset(Number(e.target.value))} className="w-full accent-[#C9A24B] cursor-pointer" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="vert-pfh" className="font-semibold text-[#0B1F4D]">Posterior Height (S–Go)</label>
                  <span className="font-mono text-[#059669] tabular-nums">{pfhMm} mm</span>
                </div>
                <input id="vert-pfh" type="range" min={60} max={92} value={pfhMm} onChange={(e) => setPfhMm(Number(e.target.value))} className="w-full accent-[#059669] cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="vert-lafh" className="font-semibold text-[#0B1F4D]">Lower Anterior Height</label>
                  <span className="font-mono text-[#1B3A8C] tabular-nums">{lafhMm} mm</span>
                </div>
                <input id="vert-lafh" type="range" min={52} max={84} value={lafhMm} onChange={(e) => setLafhMm(Number(e.target.value))} className="w-full accent-[#1B3A8C] cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
