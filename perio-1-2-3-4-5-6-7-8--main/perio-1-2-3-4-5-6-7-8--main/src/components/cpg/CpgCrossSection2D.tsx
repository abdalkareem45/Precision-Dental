import React, { useState } from 'react';
import {
  Ruler,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Droplet
} from 'lucide-react';

export const CpgCrossSection2D: React.FC = () => {
  const [probingDepth, setProbingDepth] = useState<number>(6); // mm
  const [recession, setRecession] = useState<number>(1); // mm
  const [hasBop, setHasBop] = useState<boolean>(true);
  const [viewPreset, setViewPreset] = useState<'healthy' | 'step1_active' | 'step2_failed' | 'step3_regenerative' | 'step4_spc'>('step2_failed');
  const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null);

  // Clinical Attachment Loss (CAL) formula:
  // CAL = Probing Depth + Recession
  const cal = probingDepth + recession;

  const handleApplyPreset = (preset: 'healthy' | 'step1_active' | 'step2_failed' | 'step3_regenerative' | 'step4_spc') => {
    setViewPreset(preset);
    if (preset === 'healthy') {
      setProbingDepth(2);
      setRecession(0);
      setHasBop(false);
    } else if (preset === 'step1_active') {
      setProbingDepth(5);
      setRecession(1);
      setHasBop(true);
    } else if (preset === 'step2_failed') {
      setProbingDepth(7);
      setRecession(2);
      setHasBop(true);
    } else if (preset === 'step3_regenerative') {
      setProbingDepth(4);
      setRecession(1);
      setHasBop(false);
    } else if (preset === 'step4_spc') {
      setProbingDepth(3);
      setRecession(1);
      setHasBop(false);
    }
  };

  // SVG coordinate calculations
  // Fixed Reference: CEJ at Y = 160
  // 1 mm = 14 px
  const SCALE = 14;
  const CEJ_Y = 160;
  const TOOTH_X = 220;

  // Free Gingival Margin (FGM) Y
  // If recession = 0, FGM is about 1mm coronal to CEJ (-14px)
  // If recession > 0, FGM moves apically below CEJ
  const fgmY = CEJ_Y + (recession - 1) * SCALE;

  // Pocket base / Junctional Epithelium Y
  // Pocket Base = FGM + Probing Depth
  const pocketBaseY = fgmY + (probingDepth * SCALE);

  // Alveolar Bone Crest Y
  // Usually 1.5 to 2 mm apical to pocket base
  const boneCrestY = Math.min(380, pocketBaseY + 2 * SCALE);

  return (
    <div className="bg-[#0b1736] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              2D Histological Simulator
            </span>
            <span className="text-xs text-slate-400">Microscopic Cross-Sectional Geometry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Ruler className="w-6 h-6 text-cyan-400" />
            Periodontal Pocket &amp; Probing Depth (PD vs CAL)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Visualizing CEJ, Free Gingival Margin (FGM), Base of Pocket, and Alveolar Bone Crest across CPG healing phases.
          </p>
        </div>

        {/* Healing Presets */}
        <div className="flex items-center gap-1.5 flex-wrap bg-slate-900 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => handleApplyPreset('healthy')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              viewPreset === 'healthy' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Healthy Sulcus
          </button>
          <button
            onClick={() => handleApplyPreset('step1_active')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              viewPreset === 'step1_active' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Step 1 Biofilm
          </button>
          <button
            onClick={() => handleApplyPreset('step2_failed')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              viewPreset === 'step2_failed' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Step 2 Residual
          </button>
          <button
            onClick={() => handleApplyPreset('step3_regenerative')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              viewPreset === 'step3_regenerative' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Step 3 Graft
          </button>
          <button
            onClick={() => handleApplyPreset('step4_spc')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              viewPreset === 'step4_spc' ? 'bg-[#C9A24B] text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Step 4 SPC
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Anatomical Diagram */}
        <div className="lg:col-span-8 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 relative flex flex-col items-center justify-center overflow-hidden min-h-[460px]">
          <svg
            viewBox="0 0 540 430"
            className="w-full max-w-[500px] h-auto select-none"
          >
            <defs>
              {/* Enamel Gradient */}
              <linearGradient id="enamelGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="60%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>

              {/* Dentin Gradient */}
              <linearGradient id="dentinGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="80%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>

              {/* Bone Gradient */}
              <linearGradient id="boneGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e2d9c8" />
                <stop offset="100%" stopColor="#b8aa93" />
              </linearGradient>

              {/* Gingiva Gradient */}
              <linearGradient id="gingivaGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={hasBop ? '#f43f5e' : '#fb7185'} />
                <stop offset="100%" stopColor={hasBop ? '#be123c' : '#e11d48'} />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            <g opacity="0.12" stroke="#64748b" strokeWidth="0.5">
              {[50, 100, 150, 200, 250, 300, 350, 400].map(y => (
                <line key={y} x1="20" y1={y} x2="520" y2={y} />
              ))}
            </g>

            {/* Tooth Anatomy Profile (Dentin core) */}
            <path
              d="M 120,30 L 220,30 C 228,80 230,120 220,160 C 215,220 205,320 180,410 L 120,410 Z"
              fill="url(#dentinGrad)"
              stroke="#ca8a04"
              strokeWidth="1.5"
            />

            {/* Pulp Chamber */}
            <path
              d="M 120,70 C 150,70 160,110 155,160 C 150,220 145,340 135,410 L 120,410 Z"
              fill="#ef4444"
              opacity="0.8"
            />

            {/* Enamel Cap (Coronal to CEJ at Y=160) */}
            <path
              d="M 120,30 L 220,30 C 235,70 240,110 220,160 L 205,160 C 220,120 215,80 120,50 Z"
              fill="url(#enamelGrad)"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            {/* Cementoenamel Junction (CEJ) Landmark Line */}
            <line
              x1="180"
              y1={CEJ_Y}
              x2="330"
              y2={CEJ_Y}
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <text x="335" y={CEJ_Y + 4} fill="#38bdf8" fontSize="11" fontWeight="bold">
              CEJ Reference
            </text>

            {/* Alveolar Bone Architecture */}
            <path
              d={`M 245,${boneCrestY} C 280,${boneCrestY + 5} 320,${boneCrestY + 15} 420,${boneCrestY + 20} L 420,410 L 220,410 C 225,360 235,${boneCrestY + 25} 245,${boneCrestY} Z`}
              fill="url(#boneGrad)"
              stroke="#a89a82"
              strokeWidth="1.5"
            />
            {/* Bone Trabeculae Dots */}
            {[1, 2, 3, 4, 5, 6].map(i => (
              <circle
                key={i}
                cx={280 + (i % 3) * 35}
                cy={boneCrestY + 30 + Math.floor(i / 3) * 30}
                r="3"
                fill="#8c7e68"
                opacity="0.4"
              />
            ))}

            {/* Alveolar Bone Crest Landmark */}
            <line
              x1="245"
              y1={boneCrestY}
              x2="420"
              y2={boneCrestY}
              stroke="#dfbe6e"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text x="360" y={boneCrestY - 5} fill="#dfbe6e" fontSize="10" fontWeight="bold">
              Alveolar Crest
            </text>

            {/* Periodontal Ligament (PDL) space */}
            <path
              d={`M 205,${pocketBaseY + 15} C 215,${pocketBaseY + 40} 220,330 195,410 L 190,410 C 210,330 205,${pocketBaseY + 40} 198,${pocketBaseY + 15} Z`}
              fill="#fb923c"
              opacity="0.75"
            />

            {/* Junctional Epithelium (JE) Attachment Band */}
            <path
              d={`M 218,${pocketBaseY} L 215,${pocketBaseY + 15} L 225,${pocketBaseY + 15} L 227,${pocketBaseY} Z`}
              fill="#a855f7"
              opacity="0.9"
            />
            <text x="232" y={pocketBaseY + 12} fill="#c084fc" fontSize="9" fontWeight="bold">
              JE Base
            </text>

            {/* Regenerative Bone Graft Particles & Membrane (if Step 3) */}
            {viewPreset === 'step3_regenerative' && (
              <g>
                {/* Collagen Membrane */}
                <path
                  d={`M 225,${pocketBaseY + 2} Q 260,${pocketBaseY + 8} 310,${boneCrestY + 5}`}
                  stroke="#ffffff"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5 2"
                />
                <text x="315" y={boneCrestY} fill="#ffffff" fontSize="9" fontWeight="bold">
                  GTR Membrane
                </text>
                {/* Particulate Graft */}
                {[0, 1, 2, 3, 4, 5, 6].map(g => (
                  <circle
                    key={g}
                    cx={230 + (g % 3) * 12}
                    cy={pocketBaseY + 10 + Math.floor(g / 3) * 14}
                    r="3.5"
                    fill="#fef08a"
                    stroke="#ca8a04"
                    strokeWidth="1"
                  />
                ))}
              </g>
            )}

            {/* Gingival Soft Tissue Complex */}
            {/* Free gingival margin (fgmY) to attached gingiva */}
            <path
              d={`M 228,${pocketBaseY} C 235,${fgmY + (pocketBaseY - fgmY) * 0.4} 245,${fgmY} 250,${fgmY} C 265,${fgmY} 310,${fgmY + 25} 350,${fgmY + 60} L 420,${fgmY + 120} L 420,410 L 255,410 C 260,360 260,${boneCrestY + 10} 245,${boneCrestY} C 235,${boneCrestY - 10} 230,${pocketBaseY + 20} 228,${pocketBaseY} Z`}
              fill="url(#gingivaGrad)"
              stroke="#9f1239"
              strokeWidth="1"
            />

            {/* Gingival Margin (FGM) Reference */}
            <line
              x1="240"
              y1={fgmY}
              x2="380"
              y2={fgmY}
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text x="385" y={fgmY + 4} fill="#f43f5e" fontSize="10" fontWeight="bold">
              FGM ({recession > 0 ? `${recession}mm recession` : 'Coronal'})
            </text>

            {/* Supragingival Biofilm Plaque & Calculus */}
            {(viewPreset === 'step1_active' || viewPreset === 'step2_failed') && (
              <g>
                {/* Yellow supragingival biofilm */}
                <ellipse cx="224" cy={fgmY - 3} rx="6" ry="8" fill="#eab308" opacity="0.9" />
                {/* Dark subgingival calculus on root */}
                <polygon
                  points={`221,${fgmY + 12} 227,${fgmY + 16} 222,${fgmY + 28} 219,${fgmY + 22}`}
                  fill="#451a03"
                  stroke="#78350f"
                />
                <text x="232" y={fgmY + 24} fill="#fbbf24" fontSize="9" fontWeight="bold">
                  Sub-calculus
                </text>
              </g>
            )}

            {/* Bleeding on Probing (BOP) Blood Droplets Animation */}
            {hasBop && (
              <g>
                <circle cx="232" cy={fgmY + 4} r="4.5" fill="#e11d48" />
                <circle cx="236" cy={fgmY - 6} r="3" fill="#ef4444" />
                <path
                  d={`M 230,${fgmY + 8} Q 233,${fgmY + 16} 235,${fgmY + 22}`}
                  stroke="#be123c"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Calibrated Periodontal Probe (UNC-15 with mm markings) */}
            <g transform={`translate(225, ${pocketBaseY - 140})`}>
              {/* Probe Shank */}
              <rect x="-3" y="0" width="6" height="140" fill="#94a3b8" rx="2" stroke="#475569" strokeWidth="1" />
              {/* Millimeter Markings (Every 14px = 1mm) */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(m => {
                const markY = 140 - (m * SCALE);
                if (markY < 0) return null;
                const isBand = (m >= 4 && m <= 5) || (m >= 9 && m <= 10);
                return (
                  <rect
                    key={m}
                    x="-3.5"
                    y={markY}
                    width="7"
                    height={isBand ? SCALE : 1.5}
                    fill={isBand ? '#090d16' : '#334155'}
                  />
                );
              })}
              {/* Probe Tip at Pocket Base */}
              <circle cx="0" cy="140" r="3" fill="#cbd5e1" />
            </g>

            {/* Measurement Callouts on Left */}
            {/* Probing Depth (PD) bracket: between FGM and Base of Pocket */}
            <g transform="translate(10, 0)">
              <line x1="35" y1={fgmY} x2="35" y2={pocketBaseY} stroke="#38bdf8" strokeWidth="2" />
              <line x1="28" y1={fgmY} x2="42" y2={fgmY} stroke="#38bdf8" strokeWidth="2" />
              <line x1="28" y1={pocketBaseY} x2="42" y2={pocketBaseY} stroke="#38bdf8" strokeWidth="2" />
              <text
                x="48"
                y={fgmY + (pocketBaseY - fgmY) / 2 + 4}
                fill="#38bdf8"
                fontSize="12"
                fontWeight="bold"
              >
                PPD = {probingDepth} mm
              </text>
            </g>

            {/* Clinical Attachment Loss (CAL) bracket: between CEJ and Base of Pocket */}
            <g transform="translate(10, 0)">
              <line x1="10" y1={CEJ_Y} x2="10" y2={pocketBaseY} stroke="#C9A24B" strokeWidth="2" />
              <line x1="3" y1={CEJ_Y} x2="17" y2={CEJ_Y} stroke="#C9A24B" strokeWidth="2" />
              <line x1="3" y1={pocketBaseY} x2="17" y2={pocketBaseY} stroke="#C9A24B" strokeWidth="2" />
              <text
                x="15"
                y={CEJ_Y + (pocketBaseY - CEJ_Y) / 2 + 4}
                fill="#C9A24B"
                fontSize="11"
                fontWeight="bold"
                transform={`rotate(-90 15 ${CEJ_Y + (pocketBaseY - CEJ_Y) / 2})`}
                textAnchor="middle"
              >
                CAL = {cal} mm
              </text>
            </g>
          </svg>
        </div>

        {/* Controls & Clinical Mathematical Matrix */}
        <div className="lg:col-span-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Interactive Probing Parameters
            </span>
            <h3 className="font-bold text-white text-base mt-1">
              Dynamic Probing Depth (PPD) &amp; CAL
            </h3>

            {/* Slider 1: Probing Depth */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold">Probing Pocket Depth (PPD):</span>
                <span className={`font-mono font-bold ${
                  probingDepth > 6 ? 'text-rose-400' : probingDepth > 4 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {probingDepth} mm
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={probingDepth}
                onChange={(e) => setProbingDepth(parseInt(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1mm (Sulcus)</span>
                <span>4mm (Threshold)</span>
                <span>12mm (Severe)</span>
              </div>
            </div>

            {/* Slider 2: Gingival Recession */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold">Gingival Recession:</span>
                <span className="font-mono font-bold text-pink-400">{recession} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={recession}
                onChange={(e) => setRecession(parseInt(e.target.value))}
                className="w-full accent-pink-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0mm (At CEJ)</span>
                <span>6mm (Severe)</span>
              </div>
            </div>

            {/* BOP Toggle Checkbox */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasBop}
                  onChange={(e) => setHasBop(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 bg-slate-800 border-slate-600 focus:ring-rose-500 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Droplet className={`w-3.5 h-3.5 ${hasBop ? 'text-rose-400 fill-rose-400' : 'text-slate-500'}`} />
                  Bleeding on Probing (BOP) Positive
                </span>
              </label>
            </div>

            {/* Clinical Attachment Loss (CAL) Box */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-[#C9A24B]/40 space-y-1">
              <div className="text-[10px] font-bold text-[#C9A24B] uppercase">
                CAL Calculation (Gingival Margin Apical to CEJ)
              </div>
              <div className="text-sm font-mono font-bold text-white">
                CAL = PPD ({probingDepth}mm) + Recession ({recession}mm) = {cal} mm
              </div>
              <p className="text-[11px] text-slate-300">
                Clinical attachment loss measures the true distance from the Cementoenamel Junction (CEJ) to the base of the pocket.
              </p>
            </div>
          </div>

          {/* Dr. Alaa Omran Endpoints Rule Callout */}
          <div className={`p-3 rounded-xl border text-xs ${
            probingDepth <= 4 && !hasBop
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}>
            <div className="font-bold flex items-center gap-1.5 text-white">
              {probingDepth <= 4 && !hasBop ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Step 2 Endpoints Met!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Endpoints NOT Met (Requires Step 3 Surgery)</span>
                </>
              )}
            </div>
            <div className="text-[11px] mt-1 leading-relaxed">
              Dr. Alaa Omran Rule: End point is achieved when there is{' '}
              <strong>no pocket &gt; 4mm with BOP</strong> and{' '}
              <strong>no deep pocket &gt; 6mm</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
