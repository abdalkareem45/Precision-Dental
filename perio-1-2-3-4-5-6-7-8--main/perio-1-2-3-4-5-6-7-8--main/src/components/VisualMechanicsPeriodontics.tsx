import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Droplets,
  HelpCircle,
  Info,
  Maximize2,
  RefreshCw,
  Ruler,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  TrendingDown,
  XCircle,
  Zap,
  Layers,
  Sliders,
  Split,
  Workflow
} from 'lucide-react';

/* =========================================================================
   COMPONENT 1: THE CAL vs. PD "ANATOMY SIMULATOR"
   ========================================================================= */

interface ScenarioPreset {
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  gingivalMargin: number; // mm relative to CEJ (-ve = coronal, +ve = apical/recession)
  attachmentLoss: number; // mm from CEJ to pocket base (CAL >= 0)
}

const CLINICAL_PRESETS: ScenarioPreset[] = [
  {
    name: 'Healthy Periodontium',
    badge: 'Physiological',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    description: 'Normal gingival sulcus. Gingival margin is 1.5 mm coronal to the CEJ. Junctional epithelium attached at CEJ.',
    gingivalMargin: -1.5,
    attachmentLoss: 0
  },
  {
    name: 'Gingival Hyperplasia (Pseudo-Pocket)',
    badge: 'Deceptive PD',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    description: 'Drug-induced (Amlodipine, Phenytoin, Cyclosporine). Margin is 4.5 mm coronal. False 5 mm pocket with ZERO bone loss!',
    gingivalMargin: -4.5,
    attachmentLoss: 0
  },
  {
    name: 'Isolated Gingival Recession',
    badge: 'Hidden Loss',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    description: 'Mechanical toothbrush abrasion. Margin has receded 3.5 mm apical to CEJ. Shallow 1.5 mm sulcus masks 5 mm true loss!',
    gingivalMargin: 3.5,
    attachmentLoss: 5.0
  },
  {
    name: 'True Periodontitis Pocket',
    badge: 'Active Breakdown',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    description: 'Classic periodontitis. Margin is at CEJ level. Deep 6.0 mm pocket with matching 6.0 mm attachment loss.',
    gingivalMargin: 0,
    attachmentLoss: 6.0
  },
  {
    name: 'Severe Periodontitis + Recession',
    badge: 'Combined Destruction',
    badgeColor: 'bg-red-950 text-red-300 border-red-800',
    description: 'Advanced stage. 3.0 mm recession PLUS a 5.0 mm deep pocket = 8.0 mm catastrophic total attachment loss.',
    gingivalMargin: 3.0,
    attachmentLoss: 8.0
  }
];

export const CalPdAnatomySimulator: React.FC = () => {
  // Gingival Margin: mm relative to CEJ (-5 to +6)
  // Negative = Coronal to CEJ (pseudo-pocket / normal)
  // 0 = Exactly at CEJ
  // Positive = Apical to CEJ (Recession)
  const [gingivalMargin, setGingivalMargin] = useState<number>(-1.5);

  // Clinical Attachment Loss: mm from CEJ to pocket base (0 to 10)
  const [attachmentLoss, setAttachmentLoss] = useState<number>(0);

  // Tooltip / Modal state
  const [showExplanationModal, setShowExplanationModal] = useState<boolean>(false);

  // Derived Probing Depth:
  // Distance from Free Gingival Margin to Pocket Base:
  // If GM is coronal (-ve): PD = CAL - GM = attachmentLoss + abs(gingivalMargin)
  // If GM is apical (+ve): PD = CAL - GM
  // Physical constraint: Pocket base cannot be coronal to the gingival margin!
  const computedPD = Math.max(0.5, Number((attachmentLoss - gingivalMargin).toFixed(1)));
  const computedCAL = Number(attachmentLoss.toFixed(1));
  const isRecession = gingivalMargin > 0;
  const isHyperplasia = gingivalMargin < -2.0;

  // SVG coordinate scaling (Y axis: 0 to 400)
  // CEJ is the absolute fixed reference point at Y = 160
  const cejY = 160;
  const pixelsPerMm = 14;

  // Pocket base Y coordinate (CEJ + CAL)
  const pocketBaseY = cejY + computedCAL * pixelsPerMm;

  // Gingival margin Y coordinate (CEJ + GM, where negative moves upwards/coronal)
  const gingivalMarginY = cejY + gingivalMargin * pixelsPerMm;

  // Bone crest Y coordinate (typically 1.5 - 2mm apical to pocket base)
  const boneCrestY = pocketBaseY + 2 * pixelsPerMm;

  // Probe insertion depth (tip rests at pocket base)
  const probeTipY = pocketBaseY;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Component Title & Diagnostic Core Premise */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-950 text-cyan-300 border border-cyan-800">
              Visual Mechanics Simulator
            </span>
            <span className="text-xs text-slate-400">• Mechanism 1</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Ruler className="w-6 h-6 text-cyan-400" />
            CAL vs. PD Anatomy &amp; Probing Mechanics
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
            Probe Depth (PD) is an unreliable moving target because it measures from the unstable soft tissue margin.
            Clinical Attachment Loss (CAL) is the true gold standard because it measures from the fixed Cementoenamel Junction (CEJ).
          </p>
        </div>

        <button
          onClick={() => setShowExplanationModal(true)}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-2 transition shadow-md shadow-cyan-900/20"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Why is CAL Superior?</span>
        </button>
      </div>

      {/* Quick Clinical Scenario Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Load High-Yield Clinical Scenarios:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {CLINICAL_PRESETS.map((preset) => {
            const isActive =
              Math.abs(gingivalMargin - preset.gingivalMargin) < 0.1 &&
              Math.abs(attachmentLoss - preset.attachmentLoss) < 0.1;
            return (
              <button
                key={preset.name}
                onClick={() => {
                  setGingivalMargin(preset.gingivalMargin);
                  setAttachmentLoss(preset.attachmentLoss);
                }}
                className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-600/20 border-cyan-400 ring-1 ring-cyan-400 shadow-md'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <span
                    className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border inline-block mb-1 ${preset.badgeColor}`}
                  >
                    {preset.badge}
                  </span>
                  <div className="font-bold text-xs text-white leading-tight">{preset.name}</div>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-snug">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Workstation: SVG Anatomy Canvas + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Anatomical SVG (7 of 12 cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-3 sm:p-4 flex flex-col items-center relative overflow-hidden shadow-inner">
          {/* Header Indicator Tags */}
          <div className="w-full flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-900 mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
              Interactive Cross-Section
            </span>
            <span className="text-slate-400">UNC-15 Probe Calibrated</span>
          </div>

          {/* SVG Canvas */}
          <div className="w-full max-w-[500px] h-[390px] relative select-none">
            <svg
              viewBox="0 0 460 380"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Enamel Gradient */}
                <linearGradient id="enamelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f1f5f9" />
                  <stop offset="35%" stopColor="#e2e8f0" />
                  <stop offset="65%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#f8fafc" />
                </linearGradient>

                {/* Dentin Gradient */}
                <linearGradient id="dentinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#fef08a" />
                </linearGradient>

                {/* Cementum Root Gradient */}
                <linearGradient id="rootGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fed7aa" />
                  <stop offset="50%" stopColor="#fcd34d" />
                  <stop offset="100%" stopColor="#fed7aa" />
                </linearGradient>

                {/* Gingiva Tissue Gradient */}
                <linearGradient id="gingivaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="30%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>

                {/* Alveolar Bone Trabecular Pattern */}
                <pattern id="bonePattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#334155" />
                  <circle cx="2" cy="2" r="1.5" fill="#475569" />
                  <circle cx="7" cy="7" r="1.5" fill="#1e293b" />
                  <circle cx="8" cy="2" r="1" fill="#475569" />
                </pattern>
              </defs>

              {/* Background Reference Grid */}
              <line x1="20" y1={cejY} x2="440" y2={cejY} stroke="#eab308" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.8" />
              <text x="30" y={cejY - 6} fill="#facc15" fontSize="11" fontWeight="bold" fontFamily="monospace">
                FIXED CEJ REFERENCE (0 mm)
              </text>

              {/* Alveolar Bone (Dynamic height based on boneCrestY) */}
              <path
                d={`M 60,370 L 60,${boneCrestY + 6} Q 95,${boneCrestY + 3} 130,${boneCrestY} L 175,${boneCrestY} L 175,370 Z`}
                fill="url(#bonePattern)"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <path
                d={`M 285,${boneCrestY} L 330,${boneCrestY} Q 365,${boneCrestY + 3} 400,${boneCrestY + 6} L 400,370 L 285,370 Z`}
                fill="url(#bonePattern)"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <text x="70" y="360" fill="#94a3b8" fontSize="10" fontWeight="bold">
                ALVEOLAR BONE CREST
              </text>

              {/* Tooth Crown (Enamel) above CEJ */}
              <path
                d={`M 175,${cejY} C 160,110 170,40 230,30 C 290,40 300,110 285,${cejY} Z`}
                fill="url(#enamelGrad)"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              {/* Tooth Root (Cementum) below CEJ */}
              <path
                d={`M 175,${cejY} C 178,220 200,320 225,350 C 230,355 235,350 240,340 C 265,310 282,220 285,${cejY} Z`}
                fill="url(#rootGrad)"
                stroke="#d97706"
                strokeWidth="2"
              />

              {/* Pulp Chamber & Canal */}
              <path
                d="M 220,${cejY - 30} C 215,${cejY + 40} 225,280 230,330 C 235,280 245,${cejY + 40} 240,${cejY - 30} C 235,${cejY - 50} 225,${cejY - 50} 220,${cejY - 30} Z"
                fill="#f43f5e"
                opacity="0.75"
              />

              {/* Dynamic Gingival Soft Tissue (Pink Margin) - LEFT SIDE */}
              <path
                d={`M 60,370 L 60,${gingivalMarginY + 12} Q 110,${gingivalMarginY + 8} 150,${gingivalMarginY} C 165,${gingivalMarginY - 3} 175,${gingivalMarginY} 175,${pocketBaseY} L 175,370 Z`}
                fill="url(#gingivaGrad)"
                opacity="0.88"
                stroke="#e11d48"
                strokeWidth="1.5"
              />

              {/* Dynamic Gingival Soft Tissue (Pink Margin) - RIGHT SIDE */}
              <path
                d={`M 400,370 L 400,${gingivalMarginY + 12} Q 350,${gingivalMarginY + 8} 310,${gingivalMarginY} C 295,${gingivalMarginY - 3} 285,${gingivalMarginY} 285,${pocketBaseY} L 285,370 Z`}
                fill="url(#gingivaGrad)"
                opacity="0.88"
                stroke="#e11d48"
                strokeWidth="1.5"
              />

              {/* Free Gingival Margin Level Line */}
              <line
                x1="40"
                y1={gingivalMarginY}
                x2="175"
                y2={gingivalMarginY}
                stroke="#fb7185"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
              <circle cx="175" cy={gingivalMarginY} r="3.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
              <text
                x="45"
                y={gingivalMarginY - 5}
                fill="#fda4af"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                FREE GINGIVAL MARGIN ({gingivalMargin > 0 ? `+${gingivalMargin}mm Rec` : `${gingivalMargin}mm`})
              </text>

              {/* Pocket Base (Junctional Epithelium attachment) Level Line */}
              <line
                x1="40"
                y1={pocketBaseY}
                x2="175"
                y2={pocketBaseY}
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <circle cx="175" cy={pocketBaseY} r="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <text
                x="45"
                y={pocketBaseY + 14}
                fill="#38bdf8"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                POCKET BASE / JE (CAL: {computedCAL}mm)
              </text>

              {/* Periodontal Probe (UNC-15 Calibrated Graphic inserted along tooth right side) */}
              <g transform="translate(287, 0)">
                {/* Probe Shaft */}
                <rect x="0" y={probeTipY - 260} width="6" height="260" fill="#94a3b8" rx="2" />

                {/* Millimeter bands on probe (each mm = 14px) */}
                {/* 1, 2, 3 mm: Silver */}
                {/* 4-5 mm: Black Band */}
                <rect x="0" y={probeTipY - 5 * pixelsPerMm} width="6" height={2 * pixelsPerMm} fill="#0f172a" />
                {/* 6, 7, 8 mm: Silver */}
                {/* 9-10 mm: Black Band */}
                <rect x="0" y={probeTipY - 10 * pixelsPerMm} width="6" height={2 * pixelsPerMm} fill="#0f172a" />
                {/* 14-15 mm: Black Band */}
                <rect x="0" y={probeTipY - 15 * pixelsPerMm} width="6" height={2 * pixelsPerMm} fill="#0f172a" />

                {/* Probe Tip rounded */}
                <path d={`M 0,${probeTipY} C 0,${probeTipY + 4} 6,${probeTipY + 4} 6,${probeTipY} Z`} fill="#cbd5e1" />
              </g>

              {/* Dimension Caliper 1: PROBING DEPTH (PD) */}
              <g transform="translate(340, 0)">
                <line x1="0" y1={gingivalMarginY} x2="0" y2={pocketBaseY} stroke="#f43f5e" strokeWidth="2.5" />
                <line x1="-5" y1={gingivalMarginY} x2="5" y2={gingivalMarginY} stroke="#f43f5e" strokeWidth="2" />
                <line x1="-5" y1={pocketBaseY} x2="5" y2={pocketBaseY} stroke="#f43f5e" strokeWidth="2" />
                <rect x="8" y={(gingivalMarginY + pocketBaseY) / 2 - 12} width="85" height="24" rx="4" fill="#881337" stroke="#e11d48" />
                <text x="14" y={(gingivalMarginY + pocketBaseY) / 2 + 4} fill="#ffe4e6" fontSize="11" fontWeight="bold">
                  PD: {computedPD} mm
                </text>
              </g>

              {/* Dimension Caliper 2: CLINICAL ATTACHMENT LOSS (CAL) */}
              <g transform="translate(15, 0)">
                <line x1="0" y1={cejY} x2="0" y2={pocketBaseY} stroke="#0ea5e9" strokeWidth="3" />
                <line x1="-5" y1={cejY} x2="5" y2={cejY} stroke="#0ea5e9" strokeWidth="2" />
                <line x1="-5" y1={pocketBaseY} x2="5" y2={pocketBaseY} stroke="#0ea5e9" strokeWidth="2" />
                {computedCAL > 0 ? (
                  <g>
                    <rect x="5" y={(cejY + pocketBaseY) / 2 - 12} width="85" height="24" rx="4" fill="#0c4a6e" stroke="#0284c7" />
                    <text x="10" y={(cejY + pocketBaseY) / 2 + 4} fill="#e0f2fe" fontSize="11" fontWeight="bold">
                      CAL: {computedCAL} mm
                    </text>
                  </g>
                ) : (
                  <g>
                    <rect x="5" y={cejY - 12} width="85" height="24" rx="4" fill="#064e3b" stroke="#059669" />
                    <text x="10" y={cejY + 4} fill="#d1fae5" fontSize="10" fontWeight="bold">
                      CAL: 0 mm (Intact)
                    </text>
                  </g>
                )}
              </g>
            </svg>
          </div>

          {/* Quick Real-Time Legend */}
          <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-900 text-center text-[11px] font-mono">
            <div className="p-1 rounded bg-slate-900 border border-slate-800">
              <span className="text-yellow-400 block text-[10px]">FIXED CEJ</span>
              <span className="font-bold text-white">Reference 0 mm</span>
            </div>
            <div className="p-1 rounded bg-rose-950/60 border border-rose-900/60">
              <span className="text-rose-400 block text-[10px]">PROBE DEPTH (PD)</span>
              <span className="font-bold text-rose-200 text-xs">{computedPD} mm</span>
            </div>
            <div className="p-1 rounded bg-cyan-950/60 border border-cyan-900/60">
              <span className="text-cyan-400 block text-[10px]">ATTACHMENT LOSS (CAL)</span>
              <span className="font-bold text-cyan-200 text-xs">{computedCAL} mm</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Sliders & Mathematical Breakdown (5 of 12 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Slider 1: Free Gingival Margin Position */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                Gingival Margin Position (GM)
              </label>
              <span className="font-mono text-xs font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                {gingivalMargin > 0
                  ? `+${gingivalMargin.toFixed(1)} mm (Recession)`
                  : gingivalMargin === 0
                  ? '0.0 mm (At CEJ)'
                  : `${Math.abs(gingivalMargin).toFixed(1)} mm (Coronal)`}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Shift soft tissue margin upward (coronal swelling/hyperplasia) or downward (apical recession).
            </p>

            <input
              type="range"
              min="-5.0"
              max="6.0"
              step="0.5"
              value={gingivalMargin}
              onChange={(e) => setGingivalMargin(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-5 mm (Hyperplasia)</span>
              <span>0 (CEJ)</span>
              <span>+6 mm (Severe Recession)</span>
            </div>
          </div>

          {/* Slider 2: True Biological Destruction (CAL / Attachment Loss) */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                True Attachment Loss (CAL)
              </label>
              <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                {attachmentLoss.toFixed(1)} mm
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Irreversible loss of Sharpey's connective tissue fibers from the anatomical CEJ to the pocket base.
            </p>

            <input
              type="range"
              min="0"
              max="10.0"
              step="0.5"
              value={attachmentLoss}
              onChange={(e) => setAttachmentLoss(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 mm (Intact Bone)</span>
              <span>3 mm (Mild)</span>
              <span>5 mm (Moderate)</span>
              <span>10 mm (Severe)</span>
            </div>
          </div>

          {/* Real-Time Formula & Biomechanical Explanation Card */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 rounded-2xl border border-blue-900/40 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" /> Mathematical Diagnostic Proof
              </span>
              <span className="text-[10px] font-mono text-slate-400">Tonetti &amp; Greenwell 2018</span>
            </div>

            {/* Formula Box */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-1.5">
              {isRecession ? (
                <div>
                  <div className="text-slate-400 text-[10px]">When Gingival Margin is APICAL to CEJ (Recession):</div>
                  <div className="text-emerald-400 font-bold text-sm">
                    CAL = Probing Depth ({computedPD}mm) + Recession ({gingivalMargin.toFixed(1)}mm)
                  </div>
                  <div className="text-cyan-300 font-bold text-base">
                    CAL = {computedCAL} mm Total Attachment Loss
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-slate-400 text-[10px]">When Gingival Margin is CORONAL to CEJ (Normal or Hyperplasia):</div>
                  <div className="text-emerald-400 font-bold text-sm">
                    CAL = Probing Depth ({computedPD}mm) - Coronal Tissue ({Math.abs(gingivalMargin).toFixed(1)}mm)
                  </div>
                  <div className="text-cyan-300 font-bold text-base">
                    CAL = {computedCAL} mm Total Attachment Loss
                  </div>
                </div>
              )}
            </div>

            {/* Clinical Takeaway Alert */}
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
                isHyperplasia
                  ? 'bg-purple-950/40 border-purple-800/80 text-purple-200'
                  : isRecession && computedPD <= 3
                  ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                  : 'bg-blue-950/40 border-blue-800/80 text-blue-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {isHyperplasia
                  ? 'Pseudo-Pocket Warning (False Alarm):'
                  : isRecession && computedPD <= 3
                  ? 'Deceptive Shallow Pocket Warning:'
                  : 'Diagnostic Reality:'}
              </div>
              <p className="text-[11px]">
                {isHyperplasia
                  ? `Despite a deep ${computedPD} mm probing depth that looks alarming on your periodontal chart, the CAL is 0 mm! The bone and periodontal ligament are completely intact. Do NOT perform osseous surgery!`
                  : isRecession && computedPD <= 3
                  ? `The probing depth is only ${computedPD} mm (which many students mistakenly dismiss as healthy!), yet the patient has suffered a severe ${computedCAL} mm irreversible loss of supporting bone and PDL fibers due to recession!`
                  : `Probing depth measures the distance between a movable, swollen tissue edge and the pocket bottom. Only CAL reflects the genuine anatomical loss from the patient's fixed CEJ.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Explanation Modal: Why CAL is the Superior Parameter */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Why CAL is the Gold Diagnostic Standard Over Probing Depth (PD)
                  </h3>
                  <p className="text-xs text-slate-400">Wheeler's Dental Anatomy &amp; Carranza 13th Ed.</p>
                </div>
              </div>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed max-h-[65vh] overflow-y-auto pr-1 custom-scrollbar">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-cyan-300 block text-sm">1. The Problem with Probing Depth (PD):</strong>
                <p className="text-slate-300">
                  Probing depth measures exclusively from the <em>Free Gingival Margin (FGM)</em> to the pocket base.
                  However, the gingival margin is notoriously unstable—it shifts coronally during inflammation or drug-induced hyperplasia (creating false pockets), and shifts apically following scaling or surgery (tissue shrinkage), or due to brushing trauma (recession).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-yellow-300 block text-sm">2. The Permanence of the Cementoenamel Junction (CEJ):</strong>
                <p className="text-slate-300">
                  The CEJ is a fixed anatomical landmark established during odontogenesis. It does not change with inflammation, edema, healing, or surgical procedures. Measuring attachment loss from the CEJ gives an unyielding, permanent historical record of true periodontal destruction.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/50 space-y-1">
                  <strong className="text-purple-300 block">Scenario A: Pseudo-Pocket</strong>
                  <p className="text-slate-400 text-[11px]">
                    Swollen tissue gives a 6 mm PD, but attachment remains at the CEJ. CAL = 0 mm. True disease severity: Gingivitis only.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 space-y-1">
                  <strong className="text-amber-300 block">Scenario B: Masked Recession</strong>
                  <p className="text-slate-400 text-[11px]">
                    Recession of 4 mm with a 2 mm PD yields a "normal" depth on paper, yet CAL = 6 mm! Without recording CAL, massive destruction goes unnoticed.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-200">
                <strong className="block text-xs font-bold mb-1">EFP 2018 Consensus Rule:</strong>
                A periodontitis case is confirmed ONLY when there is interdental clinical attachment loss (CAL) detectable at &ge;2 non-adjacent teeth, or buccal/oral CAL &ge;3 mm with pockets &gt;3 mm at &ge;2 teeth!
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowExplanationModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition"
              >
                Understood, Return to Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   COMPONENT 2: THE CLINICAL SIGN MECHANISM FLOWCHART
   ========================================================================= */

interface ClinicalSign {
  id: 'bop' | 'mobility' | 'furcation';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  standardNorm: string;
  coreMechanism: string;
  steps: {
    number: number;
    title: string;
    biochemistry: string;
    mechanicalEvent: string;
  }[];
  clinicalRule: string;
}

const CLINICAL_SIGNS: ClinicalSign[] = [
  {
    id: 'bop',
    title: 'Bleeding on Probing (BOP)',
    subtitle: 'Vascular Engorgement & Epithelial Ulceration',
    badge: 'Inflammatory Biomarker',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    standardNorm: 'Standardized force: 0.20 – 0.25 N (blanched fingernail pressure)',
    coreMechanism:
      'BOP occurs because subgingival bacterial biofilm dysbiosis induces micro-ulcerations in the pocket epithelium, exposing engorged, paper-thin capillary loops that rupture under minimal physical probing force.',
    steps: [
      {
        number: 1,
        title: 'Biofilm Dysbiosis & Neutrophil Infiltration',
        biochemistry: 'P. gingivalis, T. forsythia, and T. denticola secrete lipopolysaccharides (LPS) and gingipains into the sulcus.',
        mechanicalEvent: 'Chemotactic gradient triggers dense migration of PMNs (neutrophils) across the junctional epithelium.'
      },
      {
        number: 2,
        title: 'Pocket Wall Micro-Ulceration',
        biochemistry: 'Host release of MMP-8, MMP-9, IL-1β, and TNF-α digests epithelial basement membrane collagen.',
        mechanicalEvent: 'The protective keratinized/parakeratinized barrier disintegrates into microscopic ulcerations.'
      },
      {
        number: 3,
        title: 'Capillary Neo-Angiogenesis & Dilation',
        biochemistry: 'VEGF triggers sprouting of fragile, hyper-permeable capillary loops in the inflamed connective tissue directly below the ulcer.',
        mechanicalEvent: 'Vascular engorgement and pooling of blood directly beneath the naked, open connective tissue.'
      },
      {
        number: 4,
        title: 'Mechanical Shear Stress from Periodontal Probe',
        biochemistry: 'Standard 0.20–0.25 N probe force translates to hydraulic shear pressure across the pocket base.',
        mechanicalEvent: 'The blunt 0.5 mm probe tip exerts focal pressure against the unsupported micro-vessel walls.'
      },
      {
        number: 5,
        title: 'Capillary Wall Rupture & Sulcular Hemorrhage',
        biochemistry: 'Erythrocytes and inflammatory exudate escape into the sulcular lumen.',
        mechanicalEvent: 'Immediate blood flow appears at the gingival margin within 10–15 seconds.'
      }
    ],
    clinicalRule:
      'Negative Predictive Value: The ABSENCE of BOP indicates a 98–100% probability of periodontal stability. Presence of BOP alone does not prove active destruction, but repeated BOP at successive visits indicates a 30% risk of progressive attachment loss.'
  },
  {
    id: 'mobility',
    title: 'Tooth Mobility (Miller Index)',
    subtitle: 'Alveolar Bone Loss & PDL Width Resorption',
    badge: 'Biomechanical Failure',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    standardNorm: 'Assessed using two rigid instrument handles (never fingers!)',
    coreMechanism:
      'Tooth mobility results from loss of alveolar bone anchorage which apically shifts the center of rotation, combined with PDL space widening caused by inflammatory edema and occlusal trauma.',
    steps: [
      {
        number: 1,
        title: 'Resorption of Alveolar Bundle Bone',
        biochemistry: 'RANKL/OPG imbalance drives osteoclastic resorption of the cribriform plate lining the socket.',
        mechanicalEvent: 'The root surface loses rigid osseous engagement; the alveolar socket expands in diameter.'
      },
      {
        number: 2,
        title: 'Destruction of Sharpey’s Principal Fibers',
        biochemistry: 'MMP collagenases cleave type I collagen bundles of the horizontal, alveolar crest, and oblique fibers.',
        mechanicalEvent: 'The suspension hammock supporting the tooth is degraded; viscoelastic resistance is lost.'
      },
      {
        number: 3,
        title: 'Apical Migration of Center of Resistance',
        biochemistry: 'Loss of coronal bone height shifts the biological fulcrum apically along the root axis.',
        mechanicalEvent: 'Increases the extra-alveolar lever arm: same masticatory force generates significantly higher tipping torque!'
      },
      {
        number: 4,
        title: 'Inflammatory PDL Space Widening & Edema',
        biochemistry: 'Vascular transudate and chronic granulation tissue fill the periodontal ligament space.',
        mechanicalEvent: 'Fluid displacement allows increased lateral travel before collagen tension is reached.'
      },
      {
        number: 5,
        title: 'Miller Classification Phenotypes',
        biochemistry: 'Evaluates whether mobility is reversible (inflammatory/primary trauma) or irreversible (severe bone loss).',
        mechanicalEvent:
          'Class I: Horizontal &le; 1 mm • Class II: Horizontal &gt; 1 mm • Class III: Horizontal &gt; 2 mm AND/OR vertical intrusion.'
      }
    ],
    clinicalRule:
      'Primary vs. Secondary Occlusal Trauma: Primary trauma occurs when excessive force is applied to normal bone height (reversible by occlusal adjustment). Secondary trauma occurs when normal forces act on reduced bone height (requires splinting or reduction of force vectors).'
  },
  {
    id: 'furcation',
    title: 'Furcation Involvement (Glickman)',
    subtitle: 'Multi-Rooted Anatomical Bottlenecks',
    badge: 'Anatomical Trap',
    badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    standardNorm: 'Measured exclusively using the curved, blunt Nabers probe',
    coreMechanism:
      'Bone loss progresses down the root trunk into the interradicular septum. The furcation entrance (0.5–0.75 mm) is narrower than standard curette blades (0.75–1.0 mm), creating an inaccessible anaerobic sanctuary.',
    steps: [
      {
        number: 1,
        title: 'Plaque Descent Along Short Root Trunks',
        biochemistry: 'Biofilm extends beyond the root trunk (average 3 mm on lower molars, 3–5 mm on upper molars).',
        mechanicalEvent: 'Connective tissue attachment detaches from the bifurcation fornix.'
      },
      {
        number: 2,
        title: 'Interradicular Osseous Septum Resorption',
        biochemistry: 'Inflammatory cytokines permeate the marrow spaces of the interradicular bone crest.',
        mechanicalEvent: 'Progressive horizontal and vertical cratering between divergent roots.'
      },
      {
        number: 3,
        title: 'The Instrument Access Paradox',
        biochemistry: 'Anaerobic spirochetes and bacteroides thrive in the oxygen-deprived furcation ceiling.',
        mechanicalEvent: '58% of furcation entrances are smaller than 0.75 mm—standard Gracey curettes cannot enter!'
      },
      {
        number: 4,
        title: 'Glickman Staging Progression',
        biochemistry: 'Tracks the extent of horizontal penetration across the furcation dome.',
        mechanicalEvent:
          'Grade I: Incipient (catches groove) • Grade II: Cul-de-sac (enters dome but cannot pass through) • Grade III: Through-and-through tunnel (covered by gingiva) • Grade IV: Clinically open tunnel (visible recession).'
      },
      {
        number: 5,
        title: 'Prognostic Impact on Tooth Retention',
        biochemistry: 'Microbial recolonization is 10x faster due to inaccessible root flutings and intermediate bifurcational ridges.',
        mechanicalEvent: 'Grade II & III furcations have the highest long-term tooth loss rate in periodontal practice.'
      }
    ],
    clinicalRule:
      'Nabers Probe vs. Perio Probe: Straight periodontal probes will underestimate or miss furcation lesions due to crown overhanging contours. Always confirm furcation invasions using the curved Nabers #2 probe paired with periapical radiographs!'
  }
];

export const ClinicalSignMechanismFlowchart: React.FC = () => {
  const [selectedSignId, setSelectedSignId] = useState<'bop' | 'mobility' | 'furcation'>('bop');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeSign = CLINICAL_SIGNS.find((s) => s.id === selectedSignId) || CLINICAL_SIGNS[0];

  const handleSelectSign = (id: 'bop' | 'mobility' | 'furcation') => {
    setSelectedSignId(id);
    setActiveStepIndex(0);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Title & Scope */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-950 text-rose-300 border border-rose-800">
              Visual Mechanics Flowchart
            </span>
            <span className="text-xs text-slate-400">• Mechanism 2</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-rose-400" />
            Clinical Sign Biological Cascades
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
            Understand the exact cellular, biochemical, and biomechanical events that produce bleeding on probing, mobility, and furcation lesions.
          </p>
        </div>
      </div>

      {/* 3 Clickable Sign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CLINICAL_SIGNS.map((sign) => {
          const isSelected = selectedSignId === sign.id;
          return (
            <button
              key={sign.id}
              onClick={() => handleSelectSign(sign.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/20 border-cyan-400 ring-2 ring-cyan-400/50 shadow-xl'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${sign.badgeColor}`}
                  >
                    {sign.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-400">
                      Active Cascade <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">{sign.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{sign.subtitle}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                {sign.standardNorm}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Sign Mechanism Breakdown: Stepper & Graphic Representation */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-6 shadow-inner">
        {/* Sign Header & Core Summary */}
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              {activeSign.title}: Step-by-Step Biological Mechanism
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
              Step {activeStepIndex + 1} of {activeSign.steps.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            {activeSign.coreMechanism}
          </p>
        </div>

        {/* Step-by-Step Horizontal Navigation Stepper */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {activeSign.steps.map((step, idx) => {
            const isCurrent = activeStepIndex === idx;
            const isPast = activeStepIndex > idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`flex-1 min-w-[130px] p-2.5 rounded-xl border text-left transition flex items-center gap-2 shrink-0 ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-1 ring-blue-300'
                    : isPast
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                    : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-white text-blue-900'
                      : isPast
                      ? 'bg-blue-950 text-cyan-300 border border-blue-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.number}
                </div>
                <div className="truncate">
                  <div className="text-[11px] font-bold truncate">{step.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Visual & Biochemical Breakdown */}
        {(() => {
          const currentStep = activeSign.steps[activeStepIndex];
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {/* Biochemistry Box */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" /> Biochemical &amp; Cellular Event
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{currentStep.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {currentStep.biochemistry}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                  Micro-environment: Host enzyme cascades vs. pathogenic dysbiosis
                </div>
              </div>

              {/* Mechanical / Physical Event Box */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Biomechanical Outcome
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">Physical Manifestation</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {currentStep.mechanicalEvent}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    disabled={activeStepIndex === 0}
                    onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-300"
                  >
                    Previous
                  </button>
                  <button
                    disabled={activeStepIndex === activeSign.steps.length - 1}
                    onClick={() => setActiveStepIndex((prev) => Math.min(activeSign.steps.length - 1, prev + 1))}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center gap-1"
                  >
                    <span>Next Event</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* High-Yield Clinical Rule Footer */}
        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-3">
          <Stethoscope className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block font-bold text-amber-300 text-xs">Senior Board Clinical Pearl:</strong>
            <p className="text-[11px] leading-relaxed text-amber-200/90">{activeSign.clinicalRule}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   COMPONENT 3: THE STEPWISE THERAPY "CAUSE-AND-EFFECT" TIMELINE
   ========================================================================= */

interface TreatmentStep {
  step: number;
  title: string;
  shortTitle: string;
  badge: string;
  badgeColor: string;
  timeline: string;
  procedures: string[];
  whyItMustBeHere: string;
  clinicalReadinessGate: string[];
  whatHappensIfSkipped: string;
  clinicalDisasterConsequence: string;
}

const EFP_TREATMENT_STEPS: TreatmentStep[] = [
  {
    step: 1,
    title: 'Step 1: Patient Behavior Change, OHI, PMPR & Risk Control',
    shortTitle: 'Behavior & Risk Factor Control',
    badge: 'Biological Foundation',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    timeline: 'Weeks 1 – 4',
    procedures: [
      'Personalized Oral Hygiene Instruction (OHI) and calibrated interdental brush sizing',
      'Professional Mechanical Plaque Removal (PMPR) of supragingival deposits',
      'Smoking cessation counseling and carbon monoxide validation',
      'Diabetes glycemic control optimization (HbA1c target < 7%)',
      'Correction of iatrogenic plaque traps (overhanging restoration margins)'
    ],
    whyItMustBeHere:
      'Subgingival biofilm cannot be sustainably controlled if the supragingival environment is constantly raining down millions of bacteria into the pocket. Patient plaque control (aiming for >80% plaque-free score) is the absolute prerequisite for any biological healing.',
    clinicalReadinessGate: [
      'Plaque Score (O’Leary) reduced to < 20% (or > 80% plaque-free)',
      'Marginal Bleeding Index reduced to < 20%',
      'Patient demonstrates correct interdental brush diameter insertion without trauma'
    ],
    whatHappensIfSkipped:
      'Subgingival bacteria reconstitute within 48–72 hours after instrumentation! Any deep scaling or surgery performed without patient hygiene compliance fails immediately, wasting clinical time and generating severe antibiotic resistance if antimicrobial adjunctive drugs are improperly used.',
    clinicalDisasterConsequence:
      'Catastrophic recurrent infection, patient frustration, and rapid relapse into active tissue destruction within 1–2 months.'
  },
  {
    step: 2,
    title: 'Step 2: Cause-Related Subgingival Instrumentation (NSPT)',
    shortTitle: 'Subgingival Instrumentation (NSPT)',
    badge: 'Etiological Root Therapy',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    timeline: 'Weeks 4 – 12',
    procedures: [
      'Subgingival scaling and root planing (SRP) under local anesthesia',
      'Sonic / Ultrasonic instrumentation with micro-slender tips',
      'Site-specific Gracey curettes (1/2, 7/8, 11/12, 13/14)',
      'Subgingival irrigation; judicious adjunctive antiseptics (Chlorhexidine)',
      'Mandatory 6–12 week healing re-evaluation period!'
    ],
    whyItMustBeHere:
      'Disrupts the established subgingival pathogenic biofilm and removes endotoxin-laden calculus from the root surfaces. This allows junctional epithelium to reattach as a long junctional epithelium (LJE) and resolves gingival edema, resulting in 1–3 mm of pocket shrinkage without surgery.',
    clinicalReadinessGate: [
      'Minimum 6–8 weeks elapsed post-instrumentation before probing to allow connective tissue maturation',
      'Re-charting of full 6-site probing depth, BOP, and recession',
      'Identification of true non-responding residual pockets (PD >= 6mm with BOP)'
    ],
    whatHappensIfSkipped:
      'Performing periodontal surgery directly on acutely inflamed, hyperemic, bleeding tissues makes surgical flap handling impossible! Sutures tear through fragile swollen tissues, bleeding obscures the field, and extensive unneeded tissue necrosis and recession occur.',
    clinicalDisasterConsequence:
      'Massive unnecessary gingival recession, exposure of sensitive root dentin, and complete surgical flap failure.'
  },
  {
    step: 3,
    title: 'Step 3: Surgical Interventions for Non-Responding Residual Pockets',
    shortTitle: 'Surgical & Regenerative Therapy',
    badge: 'Advanced Correction',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    timeline: 'Months 3 – 6',
    procedures: [
      'Access flap surgery (Open Flap Debridement / Modified Widman) for direct root visibility',
      'Resective osseous surgery to eliminate irregular bone craters',
      'Regenerative periodontal surgery (Enamel Matrix Derivative - EMD, GTR membranes, bone grafts) for deep 2- or 3-wall intrabony defects',
      'Root amputation, hemisection, or tunnel preparation for Grade II/III furcation defects'
    ],
    whyItMustBeHere:
      'Indicated ONLY for residual deep pockets (PD >= 6mm with BOP) that failed to resolve after Step 2. Instrumentation of root surfaces deeper than 5 mm is statistically blind (<40% complete calculus removal). Surgery is only safe when performed on tissues previously decontaminated in Step 2.',
    clinicalReadinessGate: [
      'Patient maintained excellent plaque control (< 20% plaque score)',
      'Residual pockets >= 6mm verified with bleeding on probing',
      'Radiographic verification of favorable 2- or 3-wall osseous defect morphology for regeneration'
    ],
    whatHappensIfSkipped:
      'Leaving residual pockets >= 6mm with BOP in a patient untreated results in progressive silent alveolar bone destruction, recurrent acute periodontal abscesses, and ultimate tooth loss.',
    clinicalDisasterConsequence:
      'Terminal periodontal breakdown, drifting, tooth mobility, and unplanned emergency tooth extractions.'
  },
  {
    step: 4,
    title: 'Step 4: Supportive Periodontal Care (SPC) / Maintenance Recall',
    shortTitle: 'Supportive Periodontal Care (SPC)',
    badge: 'Lifelong Preservation',
    badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    timeline: 'Every 3 – 4 Months Lifelong',
    procedures: [
      'Full-mouth reassessment of probing depths, BOP, mobility, and tooth wear',
      'Personalized risk profile assessment (Lang & Tonetti periodontal risk spider web)',
      'Localized reinstrumentation of residual shallow pockets showing BOP',
      'Continuous reinforcement of oral hygiene and motivation',
      'Application of fluoride varnish to exposed root surfaces to prevent root caries'
    ],
    whyItMustBeHere:
      'Periodontitis is a chronic, non-curable, lifestyle-linked inflammatory disease. Patients retain lifelong genetic and immunologic susceptibility. Without routine professional recalls, pathogenic anaerobic flora inevitably repopulate the sulcus.',
    clinicalReadinessGate: [
      'Patient successfully completed Step 2 (and Step 3 if indicated)',
      'Periodontal stability achieved: full-mouth BOP < 10% and no pockets >= 5mm with BOP'
    ],
    whatHappensIfSkipped:
      'Studies by Axelsson & Lindhe show that over 50–70% of successfully treated periodontitis patients experience disease recurrence and continuous attachment loss within 12–24 months if supportive care is skipped.',
    clinicalDisasterConsequence:
      'Complete relapse to baseline disease severity; all clinical and financial gains of previous therapy are wiped out.'
  }
];

export const StepwiseTherapyTimeline: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [showSkippedConsequenceDrawer, setShowSkippedConsequenceDrawer] = useState<boolean>(false);

  const activeStep = EFP_TREATMENT_STEPS[activeStepIndex];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Title & EFP Guidelines Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-950 text-blue-300 border border-blue-800">
              Visual Mechanics Timeline
            </span>
            <span className="text-xs text-slate-400">• Mechanism 3</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Workflow className="w-6 h-6 text-blue-400" />
            EFP S3 Stepwise Therapy: Cause-and-Effect Sequence
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
            European Federation of Periodontology (EFP) S3 Clinical Practice Guidelines. Every step has an unyielding biological prerequisite.
          </p>
        </div>
      </div>

      {/* 4-Step Interactive Horizontal Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {EFP_TREATMENT_STEPS.map((stepItem, idx) => {
          const isSelected = activeStepIndex === idx;
          const isPassed = activeStepIndex > idx;
          return (
            <button
              key={stepItem.step}
              onClick={() => {
                setActiveStepIndex(idx);
                setShowSkippedConsequenceDrawer(false);
              }}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/20 border-cyan-400 ring-2 ring-cyan-400/50 shadow-xl'
                  : isPassed
                  ? 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-900 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${stepItem.badgeColor}`}
                  >
                    Step {stepItem.step}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{stepItem.timeline}</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-tight">{stepItem.shortTitle}</h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">
                  {stepItem.procedures.length} protocols
                </span>
                <span className={`font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {isSelected ? 'Inspecting' : 'View Cause & Effect'} &rarr;
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Step Biological Drawer: Cause, Requirements & What Happens If Skipped */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-6 shadow-inner">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800">
                Step {activeStep.step} of 4
              </span>
              <span className="text-xs text-slate-400">Timeline: {activeStep.timeline}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">{activeStep.title}</h3>
          </div>

          <button
            onClick={() => setShowSkippedConsequenceDrawer((prev) => !prev)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition border ${
              showSkippedConsequenceDrawer
                ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                : 'bg-rose-950/40 text-rose-300 border-rose-800/80 hover:bg-rose-900/50'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{showSkippedConsequenceDrawer ? 'Hide Danger Analysis' : 'What Happens If Skipped?'}</span>
          </button>
        </div>

        {/* Clinical Breakdown Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Procedures & Biological Rationale (7 of 12) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Why It Must Be in This Exact Clinical Order */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Biological Rationale ("Why It Must Happen First")
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeStep.whyItMustBeHere}
              </p>
            </div>

            {/* Protocols & Procedures Included */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Standard Clinical Protocols (EFP S3 Level):
              </span>
              <ul className="space-y-2">
                {activeStep.procedures.map((proc, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>{proc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Gate Criteria & Danger Consequence (5 of 12) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Progression Gate Criteria */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Mandatory Gate Criteria to Advance
              </span>
              <ul className="space-y-2">
                {activeStep.clinicalReadinessGate.map((gate, gIdx) => (
                  <li key={gIdx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{gate}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skipped Consequence Card */}
            <div className="bg-gradient-to-br from-rose-950/40 via-slate-950 to-slate-950 p-4 rounded-2xl border border-rose-900/50 space-y-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                The Cost of Skipping This Step:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeStep.whatHappensIfSkipped}
              </p>
              <div className="pt-2 text-[11px] font-bold text-rose-400 border-t border-rose-900/40 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Clinical Consequence: {activeStep.clinicalDisasterConsequence}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   FLAGSHIP COMPONENT COMBINING ALL 3 VISUAL MECHANICS MODULES
   ========================================================================= */

export const VisualMechanicsPeriodontics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'cal_pd' | 'signs' | 'timeline'>('all');

  return (
    <div className="w-full space-y-6">
      {/* Banner / Navigation Segment */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-950 text-cyan-300 border border-cyan-800">
              High-Yield Periodontics
            </span>
            <span className="text-xs text-slate-400">Lecture Notes • Visual Mechanics Workstation</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Periodontal Mechanics: "How Things Work &amp; Why"
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Interactive anatomical simulations, cellular mechanism cascades, and cause-and-effect therapy sequencing.
          </p>
        </div>

        {/* View Filter Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All 3 Mechanisms
          </button>
          <button
            onClick={() => setActiveTab('cal_pd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'cal_pd'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. CAL vs. PD
          </button>
          <button
            onClick={() => setActiveTab('signs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'signs'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Signs Mechanism
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. EFP Stepwise Timeline
          </button>
        </div>
      </div>

      {/* Render Selected or All Modules */}
      {(activeTab === 'all' || activeTab === 'cal_pd') && (
        <section id="cal-pd-simulator">
          <CalPdAnatomySimulator />
        </section>
      )}

      {(activeTab === 'all' || activeTab === 'signs') && (
        <section id="signs-flowchart">
          <ClinicalSignMechanismFlowchart />
        </section>
      )}

      {(activeTab === 'all' || activeTab === 'timeline') && (
        <section id="stepwise-timeline">
          <StepwiseTherapyTimeline />
        </section>
      )}
    </div>
  );
};
