import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

export function Ceph2DAnteroposteriorSandbox() {
  const [pointAx, setPointAx] = useState(258);
  const [pointBx, setPointBx] = useState(246);
  const [nasionShiftX, setNasionShiftX] = useState(0);
  const [fopTiltDeg, setFopTiltDeg] = useState(0);
  const [sex, setSex] = useState<'male' | 'female'>('female');

  const sx = 100;
  const sy = 76;
  const nx = 262 + nasionShiftX;
  const ny = 68;
  const ay = 184;
  const by = 250;

  const angleDeg = (vx1: number, vy1: number, vx2: number, vy2: number) => {
    const dot = vx1 * vx2 + vy1 * vy2;
    const det = vx1 * vy2 - vy1 * vx2;
    return Math.abs((Math.atan2(det, dot) * 180) / Math.PI);
  };

  // SNA and SNB around vertex N
  const sna = angleDeg(sx - nx, sy - ny, pointAx - nx, ay - ny);
  const snb = angleDeg(sx - nx, sy - ny, pointBx - nx, by - ny);
  const anb = sna - snb;

  const anbClass =
    anb < 2 ? 'Class III (ANB < 2°)' : anb <= 4 ? 'Class I (2° ≤ ANB ≤ 4°)' : 'Class II (ANB > 4°)';

  // Wits projection onto FOP passing through (210, 214) with tilt fopTiltDeg
  const fopRad = (fopTiltDeg * Math.PI) / 180;
  const ux = Math.cos(fopRad);
  const uy = Math.sin(fopRad);
  const ox = 210;
  const oy = 214;

  const projA = (pointAx - ox) * ux + (ay - oy) * uy;
  const projB = (pointBx - ox) * ux + (by - oy) * uy;
  const aox = ox + projA * ux;
  const aoy = oy + projA * uy;
  const box = ox + projB * ux;
  const boy = oy + projB * uy;

  // Convert SVG px difference (BO ahead of AO -> negative in Wits convention)
  const witsMm = ((projA - projB) * 0.25);
  const witsNorm = sex === 'male' ? -1 : 0;

  const handleReset = () => {
    setPointAx(258);
    setPointBx(246);
    setNasionShiftX(0);
    setFopTiltDeg(0);
    setSex('female');
  };

  return (
    <SandboxShell
      id="lec5-2d-ap"
      kind="2D Sandbox"
      title="Antero-Posterior Pattern: Eastman ANB vs. Wits’ Analysis & Pitfalls"
      instruction="Move Point A, Point B, Nasion, or tilt the Functional Occlusal Plane (FOP)"
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4">
          <svg
            viewBox="0 0 340 300"
            className="w-full h-auto max-h-85"
            role="img"
            aria-label="Lateral cephalometric ANB angle and Wits perpendicular projection diagram"
          >
            {/* SN Line */}
            <line x1={sx} y1={sy} x2={nx} y2={ny} stroke="#0B1F4D" strokeWidth="2.5" />
            {/* N-A and N-B */}
            <line x1={nx} y1={ny} x2={pointAx} y2={ay} stroke="#1B3A8C" strokeWidth="2" />
            <line x1={nx} y1={ny} x2={pointBx} y2={by} stroke="#C9A24B" strokeWidth="2" />

            {/* Functional Occlusal Plane */}
            <line
              x1={ox - 110 * ux}
              y1={oy - 110 * uy}
              x2={ox + 95 * ux}
              y2={oy + 95 * uy}
              stroke="#059669"
              strokeWidth="2.2"
            />
            <text x={ox - 105} y={oy - 8} fontSize="10" fontWeight="700" fill="#059669">
              FOP ({fopTiltDeg >= 0 ? `+${fopTiltDeg}` : fopTiltDeg}°)
            </text>

            {/* Perpendiculars from A and B to FOP */}
            <line x1={pointAx} y1={ay} x2={aox} y2={aoy} stroke="#1B3A8C" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1={pointBx} y1={by} x2={box} y2={boy} stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* AO and BO points */}
            <circle cx={aox} cy={aoy} r="4" fill="#1B3A8C" />
            <text x={aox + 5} y={aoy - 6} fontSize="10" fontWeight="700" fill="#1B3A8C">AO</text>
            <circle cx={box} cy={boy} r="4" fill="#DC2626" />
            <text x={box + 5} y={boy + 12} fontSize="10" fontWeight="700" fill="#DC2626">BO</text>

            {/* Landmarks S, N, A, B */}
            <circle cx={sx} cy={sy} r="4.5" fill="#0B1F4D" />
            <text x={sx - 12} y={sy - 6} fontSize="11" fontWeight="700" fill="#0B1F4D">S</text>

            <circle cx={nx} cy={ny} r="5" fill="#0B1F4D" />
            <text x={nx + 7} y={ny - 5} fontSize="11" fontWeight="700" fill="#0B1F4D">N</text>

            <circle cx={pointAx} cy={ay} r="5.5" fill="#1B3A8C" />
            <text x={pointAx + 8} y={ay + 4} fontSize="11" fontWeight="700" fill="#1B3A8C">A</text>

            <circle cx={pointBx} cy={by} r="5.5" fill="#C9A24B" stroke="#0B1F4D" strokeWidth="1.2" />
            <text x={pointBx + 8} y={by + 4} fontSize="11" fontWeight="700" fill="#0B1F4D">B</text>
          </svg>

          {/* Live Telemetry Readout */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-2">
              <div className="text-[10px] text-[#64748B] font-semibold">SNA (81°±3°)</div>
              <div className="font-mono text-sm font-bold text-[#0B1F4D] tabular-nums">{sna.toFixed(1)}°</div>
            </div>
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-2">
              <div className="text-[10px] text-[#64748B] font-semibold">SNB (78°±3°)</div>
              <div className="font-mono text-sm font-bold text-[#0B1F4D] tabular-nums">{snb.toFixed(1)}°</div>
            </div>
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-2">
              <div className="text-[10px] text-[#64748B] font-semibold">ANB (3°±2°)</div>
              <div className="font-mono text-sm font-bold text-[#1B3A8C] tabular-nums">{anb.toFixed(1)}°</div>
            </div>
            <div className="bg-white border border-[#E6E8EC] rounded-lg p-2">
              <div className="text-[10px] text-[#64748B] font-semibold">Wits’ (AO–BO)</div>
              <div className="font-mono text-sm font-bold text-[#059669] tabular-nums">
                {witsMm > 0 ? `+${witsMm.toFixed(1)}` : witsMm.toFixed(1)} mm
              </div>
            </div>
          </div>
        </div>

        {/* Right Sliders */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E6E8EC]">
            <div>
              <span className="text-xs text-[#64748B]">Skeletal Classification:</span>
              <p className="text-sm font-bold text-[#1B3A8C]">{anbClass}</p>
            </div>
            <div className="flex gap-1.5">
              {(['female', 'male'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSex(s)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded border cursor-pointer capitalize ${
                    sex === s
                      ? 'bg-[#0B1F4D] text-white border-[#0B1F4D]'
                      : 'bg-white text-[#0B1F4D] border-[#E6E8EC]'
                  }`}
                >
                  {s} Norm ({s === 'male' ? '−1 mm' : '0 mm'})
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="ap-point-a" className="font-semibold text-[#0B1F4D]">Maxillary Point A (AP Position)</label>
                <span className="font-mono text-[#1B3A8C] tabular-nums">SNA {sna.toFixed(1)}°</span>
              </div>
              <input id="ap-point-a" type="range" min={230} max={282} value={pointAx} onChange={(e) => setPointAx(Number(e.target.value))} className="w-full accent-[#1B3A8C] cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="ap-point-b" className="font-semibold text-[#0B1F4D]">Mandibular Point B (AP Position)</label>
                <span className="font-mono text-[#8A691B] tabular-nums">SNB {snb.toFixed(1)}°</span>
              </div>
              <input id="ap-point-b" type="range" min={218} max={278} value={pointBx} onChange={(e) => setPointBx(Number(e.target.value))} className="w-full accent-[#C9A24B] cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="ap-nasion" className="font-semibold text-[#0B1F4D]">Nasion AP Shift (ANB Pitfall)</label>
                <span className="font-mono text-[#0B1F4D] tabular-nums">{nasionShiftX >= 0 ? `+${nasionShiftX}` : nasionShiftX} px</span>
              </div>
              <input id="ap-nasion" type="range" min={-18} max={18} value={nasionShiftX} onChange={(e) => setNasionShiftX(Number(e.target.value))} className="w-full accent-[#0B1F4D] cursor-pointer" />
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Notice how shifting Nasion changes SNA, SNB, and ANB even though jaws A &amp; B did not move!
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="ap-fop" className="font-semibold text-[#0B1F4D]">FOP Angulation Tilt (Wits’ Drawback)</label>
                <span className="font-mono text-[#059669] tabular-nums">{fopTiltDeg >= 0 ? `+${fopTiltDeg}` : fopTiltDeg}°</span>
              </div>
              <input id="ap-fop" type="range" min={-10} max={10} value={fopTiltDeg} onChange={(e) => setFopTiltDeg(Number(e.target.value))} className="w-full accent-[#059669] cursor-pointer" />
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Slight FOP tilt markedly shifts AO–BO (Norm for {sex}: {witsNorm} mm).
              </p>
            </div>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
