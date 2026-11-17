import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

type ArtifactSource = 'spine' | 'ramus' | 'earring';

export function Opg2DGhostArtifactSandbox() {
  const [source, setSource] = useState<ArtifactSource>('spine');
  const [beamAngleDeg, setBeamAngleDeg] = useState(28);
  const [archPositionMm, setArchPositionMm] = useState(0);

  const handleReset = () => {
    setSource('spine');
    setBeamAngleDeg(28);
    setArchPositionMm(0);
  };

  // Source geometry in top-down view
  const densePos =
    source === 'spine'
      ? { x: 160, y: 205, label: 'Cervical Spine' }
      : source === 'ramus'
        ? { x: 96, y: 170, label: 'Right Mandibular Ramus' }
        : { x: 76, y: 162, label: 'Dense Metal Earring (R)' };

  const rad = (beamAngleDeg * Math.PI) / 180;
  const xSourceX = densePos.x - Math.sin(rad) * 85;
  const xSourceY = densePos.y + Math.cos(rad) * 85;
  const receptorX = densePos.x + Math.sin(rad) * 105;
  const receptorY = densePos.y - Math.cos(rad) * 105;

  const incisorBlurPx = Math.abs(archPositionMm) * 0.8;

  return (
    <SandboxShell
      id="lec6-2d-ghost"
      kind="2D Sandbox"
      title="Ghost Image Artifact Projection & Focal Trough Sharpness Lab"
      instruction="Choose a dense anatomical/metallic structure, sweep beam angle, and test patient arch centering"
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Top-Down Projection Geometry + Simulated OPG Ghost Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4">
            <svg
              viewBox="0 0 320 260"
              className="w-full h-auto max-h-70"
              role="img"
              aria-label="Top-down panoramic beam trajectory projecting a ghost shadow onto the contralateral side"
            >
              {/* Horseshoe Focal Trough */}
              <path
                d="M92,188 C86,115 110,68 160,68 C210,68 234,115 228,188"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="22"
                strokeOpacity="0.24"
                strokeLinecap="round"
              />
              {/* Patient Dental Arch */}
              <path
                d={`M98,${184 + archPositionMm * 2.5} C92,${116 + archPositionMm * 2.5} 115,${72 + archPositionMm * 2.5} 160,${72 + archPositionMm * 2.5} C205,${72 + archPositionMm * 2.5} 228,${116 + archPositionMm * 2.5} 222,${184 + archPositionMm * 2.5}`}
                fill="none"
                stroke="#0B1F4D"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* X-ray beam trajectory passing through dense object onto opposite side */}
              <line
                x1={xSourceX}
                y1={xSourceY}
                x2={receptorX}
                y2={receptorY}
                stroke="#C9A24B"
                strokeWidth="2.4"
                strokeDasharray="5 3"
              />
              <circle cx={xSourceX} cy={xSourceY} r="7" fill="#1B3A8C" />
              <text x={xSourceX + 10} y={xSourceY + 4} fontSize="9.5" fontWeight="700" fill="#1B3A8C">
                X-Ray Tube
              </text>

              {/* Dense structure */}
              <circle cx={densePos.x} cy={densePos.y} r="9" fill="#C9A24B" stroke="#0B1F4D" strokeWidth="2" />
              <text x={densePos.x + 12} y={densePos.y + 4} fontSize="9.5" fontWeight="700" fill="#0B1F4D">
                {densePos.label}
              </text>

              {/* Projected Ghost Location */}
              <rect
                x={receptorX - 18}
                y={receptorY - 5}
                width="36"
                height="10"
                rx="3"
                fill="#0B1F4D"
                transform={`rotate(${beamAngleDeg} ${receptorX} ${receptorY})`}
              />
              <text x={receptorX - 24} y={receptorY - 12} fontSize="9.5" fontWeight="700" fill="#DC2626">
                Ghost on Opposite Side
              </text>

              <text x="14" y="22" fontSize="10" fontWeight="700" fill="#0B1F4D">
                Top-Down Axial Projection (Blue = Sharp Focal Trough)
              </text>
            </svg>
          </div>

          {/* Simulated Panoramic Strip Result */}
          <div className="bg-[#0B1F4D] rounded-xl p-4 text-white">
            <p className="text-[11px] font-bold text-[#C9A24B] mb-2">
              Resulting Panoramic Radiograph Characteristics
            </p>
            <svg viewBox="0 0 420 95" className="w-full h-24" role="img" aria-label="Simulated OPG film strip showing real image and contralateral magnified ghost shadow">
              <rect x="0" y="0" width="420" height="95" rx="6" fill="#0F172A" stroke="#334155" />
              {/* Lower incisors sharpness visualization */}
              {[0, 1, 2, 3].map((idx) => (
                <rect
                  key={idx}
                  x={192 + idx * 10}
                  y="32"
                  width={archPositionMm > 2 ? 4 : archPositionMm < -2 ? 9 : 6}
                  height="32"
                  rx="2"
                  fill="#E2E8F0"
                  opacity={Math.max(0.35, 0.9 - incisorBlurPx * 0.12)}
                />
              ))}
              {/* Real object on original side */}
              <ellipse
                cx={source === 'spine' ? 210 : 74}
                cy="52"
                rx="10"
                ry="16"
                fill="#E2E8F0"
                opacity="0.75"
              />
              <text x={source === 'spine' ? 188 : 54} y="84" fontSize="9" fill="#94A3B8">Real Shadow</text>

              {/* Contralateral Magnified, Higher, Blurred Ghost */}
              <ellipse
                cx={source === 'spine' ? 210 : 332}
                cy="32"
                rx="22"
                ry="26"
                fill="#C9A24B"
                fillOpacity="0.32"
                stroke="#C9A24B"
                strokeDasharray="3 2"
              />
              <text x={source === 'spine' ? 242 : 292} y="24" fontSize="9.5" fontWeight="700" fill="#C9A24B">
                Magnified Radiopaque Ghost
              </text>
            </svg>
          </div>
        </div>

        {/* Right Controls */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-4">
          <div>
            <p className="text-xs font-bold text-[#0B1F4D] mb-2">Select Dense Radiopaque Source</p>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'spine', label: 'Cervical Spine / Spinal Cord (Midline)' },
                { id: 'ramus', label: 'Opposite Mandibular Ramus' },
                { id: 'earring', label: 'Dense Unremoved Earring (Right Side)' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSource(s.id as ArtifactSource)}
                  className={`text-left px-3 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                    source === s.id
                      ? 'bg-[#1B3A8C] text-white border-[#1B3A8C]'
                      : 'bg-white text-[#0B1F4D] border-[#E6E8EC]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <label htmlFor="ghost-angle" className="font-semibold text-[#0B1F4D]">X-Ray Beam Sweep Angle</label>
              <span className="font-mono text-[#1B3A8C] tabular-nums">{beamAngleDeg}°</span>
            </div>
            <input id="ghost-angle" type="range" min={-45} max={45} value={beamAngleDeg} onChange={(e) => setBeamAngleDeg(Number(e.target.value))} className="w-full accent-[#1B3A8C] cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <label htmlFor="ghost-arch" className="font-semibold text-[#0B1F4D]">Arch Offset Outside Focal Trough</label>
              <span className="font-mono text-[#8A691B] tabular-nums">
                {archPositionMm === 0 ? 'Centered (0 mm)' : archPositionMm > 0 ? `+${archPositionMm} mm Anterior` : `${archPositionMm} mm Posterior`}
              </span>
            </div>
            <input id="ghost-arch" type="range" min={-6} max={6} step={1} value={archPositionMm} onChange={(e) => setArchPositionMm(Number(e.target.value))} className="w-full accent-[#C9A24B] cursor-pointer" />
            <p className="text-[11px] text-[#64748B] mt-1">
              {archPositionMm === 0
                ? 'Lower incisors sit inside the narrow focal trough.'
                : archPositionMm > 0
                  ? 'Too far forward: lower incisors appear artificially narrowed and blurred.'
                  : 'Too far backward: lower incisors appear magnified, widened, and overlapping.'}
            </p>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
