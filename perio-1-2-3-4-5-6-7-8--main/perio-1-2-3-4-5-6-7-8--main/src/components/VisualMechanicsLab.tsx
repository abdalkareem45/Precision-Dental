import React, { useState } from 'react';
import {
  Activity,
  Layers,
  ArrowRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  Scale,
  RefreshCw,
  GitCommit,
  Flame,
  ChevronDown
} from 'lucide-react';

export const VisualMechanicsLab: React.FC = () => {
  // ==========================================
  // COMPONENT 1: CAL VS PD SIMULATOR STATE
  // ==========================================
  // gingivalMarginOffset: mm relative to CEJ.
  // Positive = coronal to CEJ (enlargement / pseudopocket)
  // Zero = exactly at CEJ
  // Negative = apical to CEJ (recession)
  const [gingivalMarginOffset, setGingivalMarginOffset] = useState<number>(0);

  // pocketBaseDepth: mm from CEJ to the base of the pocket / junctional epithelium.
  // 0 = at CEJ (histological attachment intact)
  // 1 = normal biological sulcus depth (1mm)
  // >2 = true attachment loss (CAL = pocketBaseDepth)
  const [pocketBaseDepth, setPocketBaseDepth] = useState<number>(5);

  const [showCalExplanation, setShowCalExplanation] = useState<boolean>(false);
  const [selectedCasePreset, setSelectedCasePreset] = useState<string>('periodontitis');

  // Math derivations:
  // CAL = fixed distance from CEJ to pocket base
  const cal = Math.max(0, pocketBaseDepth);

  // PD = distance from Gingival Margin to Pocket Base
  // If GM is coronal (+offset): PD = cal + offset
  // If GM is apical (-offset, recession): PD = cal - |offset| = cal + offset
  const pd = Math.max(0, cal + gingivalMarginOffset);

  // Recession amount in clinical notation (positive number if apical to CEJ, negative if coronal)
  const clinicalRecession = -gingivalMarginOffset;

  // Preset handlers
  const handleApplyPreset = (preset: 'healthy' | 'enlargement' | 'recession' | 'periodontitis') => {
    setSelectedCasePreset(preset);
    if (preset === 'healthy') {
      setGingivalMarginOffset(1); // GM 1mm coronal to CEJ
      setPocketBaseDepth(1);      // Pocket base 1mm from CEJ (normal sulcus)
      // Result: PD = 2mm, CAL = 0mm (clinically rounded)
    } else if (preset === 'enlargement') {
      setGingivalMarginOffset(4); // 4mm coronal enlargement (pseudopocket)
      setPocketBaseDepth(1);      // 1mm from CEJ (no true attachment loss!)
      // Result: PD = 5mm, CAL = 0mm -> PSEUDOPOCKET
    } else if (preset === 'recession') {
      setGingivalMarginOffset(-4); // 4mm recession apical to CEJ
      setPocketBaseDepth(5);       // pocket base 5mm apical to CEJ
      // Result: PD = 1mm, CAL = 5mm (looks shallow, but massive destruction!)
    } else if (preset === 'periodontitis') {
      setGingivalMarginOffset(0); // at CEJ
      setPocketBaseDepth(6);      // 6mm bone/attachment loss
      // Result: PD = 6mm, CAL = 6mm
    }
  };

  // ==========================================
  // COMPONENT 2: CLINICAL SIGN MECHANISM STATE
  // ==========================================
  type SignId = 'bop' | 'mobility' | 'furcation';
  const [activeSign, setActiveSign] = useState<SignId>('bop');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // ==========================================
  // COMPONENT 3: STEPWISE TIMELINE STATE
  // ==========================================
  const [selectedTimelineStep, setSelectedTimelineStep] = useState<number>(1);
  const [isTimelineDrawerOpen, setIsTimelineDrawerOpen] = useState<boolean>(true);

  // ------------------------------------------
  // SVG Graphic Dimensions & Coordinate Math
  // ------------------------------------------
  // Canvas coordinate system:
  // Center X = 200
  // Incisal Edge Y = 50
  // CEJ Y = 170 (fixed gold landmark)
  // Apex Y = 360
  // 1 mm in dental space = 12 SVG pixels
  const MM_PX = 12;
  const CEJ_Y = 170;

  // Gingival Margin Y:
  // Coronal = higher up on screen = smaller Y
  // Apical = lower down on screen = larger Y
  const gmY = CEJ_Y - gingivalMarginOffset * MM_PX;

  // Pocket Base Y:
  // Always measured down from CEJ:
  const pbY = CEJ_Y + pocketBaseDepth * MM_PX;

  // Alveolar bone crest Y: typically 1.5-2mm apical to pocket base
  const boneY = Math.min(350, pbY + 1.5 * MM_PX);

  return (
    <div className="w-full flex flex-col gap-8 pb-16 text-slate-100 font-sans">
      {/* Top Banner / Academic Introduction */}
      <section className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C9A24B] text-slate-950 uppercase tracking-wider shadow-md">
              Lecture 8 of 8
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-blue-400/40 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Biophysics &amp; Mechanics
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              Interactive Micro-Simulators
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Lecture 8: Visual Mechanics <span className="text-cyan-400">&amp; Periodontics Biophysics</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            High-yield interactive study suite: The CAL vs. PD anatomy simulator, cellular mechanism cascades (BOP, Mobility, Furcation), 
            and the cause-and-effect 4-step EFP treatment sequence.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. THE CAL VS. PD ANATOMY SIMULATOR */}
      {/* ========================================================================= */}
      <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white">
                1. The CAL vs. PD "Anatomy Simulator"
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Move the soft tissue gingival margin and pocket base to watch why Probing Depth (PD) is an unreliable artifact, while Clinical Attachment Loss (CAL) is the immutable biological truth.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => handleApplyPreset('healthy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCasePreset === 'healthy'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Healthy Sulcus
            </button>
            <button
              onClick={() => handleApplyPreset('enlargement')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCasePreset === 'enlargement'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pseudopocket (Enlargement)
            </button>
            <button
              onClick={() => handleApplyPreset('recession')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCasePreset === 'recession'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gingival Recession
            </button>
            <button
              onClick={() => handleApplyPreset('periodontitis')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCasePreset === 'periodontitis'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              True Periodontitis
            </button>
          </div>
        </div>

        {/* Main Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center Visual SVG Canvas */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner min-h-[460px]">
            {/* Legend / Overlay Badge */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 rounded bg-amber-950/80 border border-amber-600/70 text-amber-300 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Fixed Datum: CEJ
              </span>
              <span className="px-2 py-1 rounded bg-pink-950/80 border border-pink-600/70 text-pink-300 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" /> Soft Tissue: Gingival Margin
              </span>
              <span className="px-2 py-1 rounded bg-red-950/80 border border-red-600/70 text-red-300 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Pocket Base / JE
              </span>
            </div>

            {/* Interactive SVG Diagram */}
            <svg
              viewBox="0 0 400 420"
              className="w-full max-w-[440px] h-auto select-none overflow-visible"
            >
              <defs>
                {/* Tooth Enamel Gradient */}
                <linearGradient id="enamelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d1e0e8" />
                  <stop offset="25%" stopColor="#f5fafc" />
                  <stop offset="70%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#cbd7de" />
                </linearGradient>

                {/* Tooth Cementum / Dentin Gradient */}
                <linearGradient id="rootGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d4af72" />
                  <stop offset="50%" stopColor="#ecd49d" />
                  <stop offset="100%" stopColor="#b89356" />
                </linearGradient>

                {/* Gingiva Soft Tissue Gradient */}
                <linearGradient id="gingivaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#be185d" />
                </linearGradient>

                {/* Alveolar Bone Trabecular Fill */}
                <pattern id="bonePattern" width="8" height="8" patternUnits="userSpaceOnUse">
                  <rect width="8" height="8" fill="#475569" />
                  <circle cx="2" cy="2" r="1.2" fill="#334155" />
                  <circle cx="6" cy="6" r="1.4" fill="#1e293b" />
                </pattern>

                {/* Arrow markers for caliper dimension lines */}
                <marker id="arrowUpCyan" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 10 L 5 0 L 10 10 z" fill="#38bdf8" />
                </marker>
                <marker id="arrowDownCyan" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                  <path d="M 0 0 L 10 0 L 5 10 z" fill="#38bdf8" />
                </marker>
                <marker id="arrowUpRose" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 10 L 5 0 L 10 10 z" fill="#f43f5e" />
                </marker>
                <marker id="arrowDownRose" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                  <path d="M 0 0 L 10 0 L 5 10 z" fill="#f43f5e" />
                </marker>
              </defs>

              {/* 1. Alveolar Bone (Dynamic height based on bone loss / pocket depth) */}
              <path
                d={`M 80,410 L 80,${boneY + 15} Q 130,${boneY} 155,${boneY + 4} L 155,410 Z`}
                fill="url(#bonePattern)"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <path
                d={`M 320,410 L 320,${boneY + 15} Q 270,${boneY} 245,${boneY + 4} L 245,410 Z`}
                fill="url(#bonePattern)"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              {/* Bone crest label */}
              <text x="75" y={boneY + 28} fill="#94a3b8" fontSize="10" fontWeight="bold">
                Alveolar Crest
              </text>

              {/* 2. Tooth Root (Tapers toward apex) */}
              <path
                d={`M 155,${CEJ_Y} Q 165,280 195,380 Q 200,385 205,380 Q 235,280 245,${CEJ_Y} Z`}
                fill="url(#rootGrad)"
                stroke="#92400e"
                strokeWidth="2"
              />

              {/* Root Apex Indicator */}
              <circle cx="200" cy="382" r="2.5" fill="#f59e0b" />

              {/* 3. Tooth Crown (Enamel) */}
              <path
                d={`M 155,${CEJ_Y} Q 140,110 150,55 Q 200,50 250,55 Q 260,110 245,${CEJ_Y} Z`}
                fill="url(#enamelGrad)"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              {/* Occlusal/Incisal Edge highlight */}
              <path d="M 152,55 Q 200,50 248,55" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.8" />

              {/* 4. Gingival Soft Tissue (Adjustable by gingivalMarginOffset) */}
              {/* Left gingival tissue flap */}
              <path
                d={`M 75,410 L 75,${gmY + 15} Q 120,${gmY + 4} 150,${gmY} Q 153,${(gmY + pbY) / 2} 155,${pbY} L 155,410 Z`}
                fill="url(#gingivaGrad)"
                opacity="0.88"
                stroke="#db2777"
                strokeWidth="1.5"
              />
              {/* Right gingival tissue flap */}
              <path
                d={`M 325,410 L 325,${gmY + 15} Q 280,${gmY + 4} 250,${gmY} Q 247,${(gmY + pbY) / 2} 245,${pbY} L 245,410 Z`}
                fill="url(#gingivaGrad)"
                opacity="0.88"
                stroke="#db2777"
                strokeWidth="1.5"
              />

              {/* Periodontal Pocket Void (Ulcerated sulcus space) */}
              <path
                d={`M 150,${gmY} Q 153,${(gmY + pbY) / 2} 155,${pbY} L 155,${gmY} Z`}
                fill="#fda4af"
                opacity="0.6"
              />

              {/* 5. FIXED LANDMARK: CEJ Line (Gold/Amber) */}
              <line
                x1="120"
                y1={CEJ_Y}
                x2="280"
                y2={CEJ_Y}
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <circle cx="155" cy={CEJ_Y} r="3.5" fill="#f59e0b" />
              <text x="285" y={CEJ_Y + 4} fill="#fbbf24" fontSize="11" fontWeight="bold">
                CEJ (Fixed Datum)
              </text>

              {/* 6. MOVABLE LANDMARK: Gingival Margin Line (Pink/Magenta) */}
              <line
                x1="110"
                y1={gmY}
                x2="290"
                y2={gmY}
                stroke="#f472b6"
                strokeWidth="2"
                strokeDasharray="3,3"
              />
              <circle cx="150" cy={gmY} r="3.5" fill="#ec4899" />
              <text x="295" y={gmY + 4} fill="#f472b6" fontSize="11" fontWeight="bold">
                Gingival Margin (GM)
              </text>

              {/* 7. POCKET BASE / HISTOLOGICAL ATTACHMENT LINE (Red) */}
              <line
                x1="125"
                y1={pbY}
                x2="275"
                y2={pbY}
                stroke="#ef4444"
                strokeWidth="2"
              />
              <circle cx="155" cy={pbY} r="4" fill="#dc2626" />
              <text x="285" y={pbY + 4} fill="#f87171" fontSize="11" fontWeight="bold">
                Pocket Base / JE
              </text>

              {/* 8. UNC-15 PERIODONTAL PROBE (Stylized insertion on left side) */}
              <g transform={`translate(146, ${pbY - 140})`}>
                {/* Probe metallic shaft */}
                <rect x="0" y="0" width="4" height="140" fill="#94a3b8" rx="1" />
                {/* Probe millimetric bands (UNC-15 standard: black bands at 4-5mm and 9-10mm, 14-15mm) */}
                <rect x="0" y="140 - 12" width="4" height="12" fill="#cbd5e1" />
                <rect x="0" y="140 - 24" width="4" height="12" fill="#cbd5e1" />
                <rect x="0" y="140 - 36" width="4" height="12" fill="#cbd5e1" />
                <rect x="0" y="140 - 48" width="4" height="12" fill="#0f172a" /> {/* 4-5mm band */}
                <rect x="0" y="140 - 60" width="4" height="12" fill="#0f172a" />
                <rect x="0" y="140 - 108" width="4" height="12" fill="#0f172a" /> {/* 9-10mm band */}
                <rect x="0" y="140 - 120" width="4" height="12" fill="#0f172a" />
                {/* Probe rounded tip */}
                <circle cx="2" cy="140" r="2" fill="#64748b" />
              </g>

              {/* 9. DYNAMIC CALIPER MEASUREMENT ARROWS ON THE LEFT */}
              {/* Probe Depth (PD): From GM to Pocket Base */}
              {Math.abs(pbY - gmY) > 5 && (
                <g>
                  <line
                    x1="45"
                    y1={gmY}
                    x2="45"
                    y2={pbY}
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    markerStart="url(#arrowUpCyan)"
                    markerEnd="url(#arrowDownCyan)"
                  />
                  {/* Caliper extension lines */}
                  <line x1="40" y1={gmY} x2="110" y2={gmY} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
                  <line x1="40" y1={pbY} x2="125" y2={pbY} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
                  {/* Caliper Label */}
                  <rect x="10" y={(gmY + pbY) / 2 - 12} width="70" height="24" rx="6" fill="#082f49" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="45" y={(gmY + pbY) / 2 + 4} fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    PD: {pd} mm
                  </text>
                </g>
              )}

              {/* Clinical Attachment Loss (CAL): From fixed CEJ to Pocket Base */}
              {Math.abs(pbY - CEJ_Y) > 5 && (
                <g>
                  <line
                    x1="110"
                    y1={CEJ_Y}
                    x2="110"
                    y2={pbY}
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    markerStart="url(#arrowUpRose)"
                    markerEnd="url(#arrowDownRose)"
                  />
                  {/* Caliper Label */}
                  <rect x="75" y={(CEJ_Y + pbY) / 2 - 12} width="70" height="24" rx="6" fill="#4c0519" stroke="#e11d48" strokeWidth="1.5" />
                  <text x="110" y={(CEJ_Y + pbY) / 2 + 4} fill="#fda4af" fontSize="11" fontWeight="bold" textAnchor="middle">
                    CAL: {cal} mm
                  </text>
                </g>
              )}
            </svg>

            {/* Bottom Status Ticker */}
            <div className="w-full mt-2 bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Current Diagnosis:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  cal <= 1 && pd <= 3
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : cal === 0 && pd > 3
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {cal <= 1 && pd <= 3
                    ? 'Clinical Gingival Health / Intact Periodontium'
                    : cal === 0 && pd > 3
                    ? 'Pseudopocket (Gingival Enlargement without Attachment Loss)'
                    : clinicalRecession > 0 && pd <= 3
                    ? `Gingival Recession with Healthy Reduced Periodontium (${cal}mm CAL)`
                    : `True Periodontitis Pocket (Stage ${cal >= 5 ? 'III/IV' : cal >= 3 ? 'II' : 'I'})`}
                </span>
              </div>

              <div className="font-mono text-cyan-400 font-bold">
                Formula: CAL ({cal} mm) = PD ({pd} mm) {gingivalMarginOffset >= 0 ? `- Overgrowth (${gingivalMarginOffset} mm)` : `+ Recession (${-gingivalMarginOffset} mm)`}
              </div>
            </div>
          </div>

          {/* Right Controls & Interactive Explanation */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Real-time Parameter Sliders */}
            <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" /> Anatomical Sliders
                </h3>
                <button
                  onClick={() => handleApplyPreset('periodontitis')}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Slider 1: Gingival Margin Position */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-pink-300">
                    Gingival Margin Position (GM relative to CEJ):
                  </span>
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-800">
                    {gingivalMarginOffset > 0
                      ? `+${gingivalMarginOffset} mm (Enlargement)`
                      : gingivalMarginOffset < 0
                      ? `${gingivalMarginOffset} mm (Recession)`
                      : '0 mm (At CEJ)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={gingivalMarginOffset}
                  onChange={(e) => {
                    setSelectedCasePreset('custom');
                    setGingivalMarginOffset(parseInt(e.target.value, 10));
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>-6 mm (Severe Recession)</span>
                  <span>0 (CEJ)</span>
                  <span>+6 mm (Hyperplasia)</span>
                </div>
              </div>

              {/* Slider 2: Histological Pocket Base / Alveolar Destruction */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-rose-300">
                    Pocket Base / True Attachment Loss (CAL):
                  </span>
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
                    {pocketBaseDepth} mm from CEJ
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={pocketBaseDepth}
                  onChange={(e) => {
                    setSelectedCasePreset('custom');
                    setPocketBaseDepth(parseInt(e.target.value, 10));
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 mm (Intact Junctional Epith.)</span>
                  <span>5 mm (Moderate)</span>
                  <span>10 mm (Advanced Bone Loss)</span>
                </div>
              </div>

              {/* Real-Time Mathematical Comparison Matrix */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-1">
                  <span className="text-[11px] font-bold text-cyan-400 block uppercase tracking-wider">
                    Probing Depth (PD)
                  </span>
                  <div className="text-2xl font-black text-white font-mono">{pd} mm</div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Measured from <strong className="text-pink-300">Gingival Margin</strong> to pocket base. Fluctuates with inflammation &amp; edema.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-1">
                  <span className="text-[11px] font-bold text-rose-400 block uppercase tracking-wider">
                    Attachment Loss (CAL)
                  </span>
                  <div className="text-2xl font-black text-rose-300 font-mono">{cal} mm</div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Measured from the <strong className="text-amber-300">Fixed CEJ</strong> to pocket base. True biological periodontal destruction!
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive "Why CAL is the Superior Diagnostic Parameter" Callout */}
            <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    Why CAL is the Superior Diagnostic Parameter
                  </h4>
                </div>
                <button
                  onClick={() => setShowCalExplanation((prev) => !prev)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <span>{showCalExplanation ? 'Collapse' : 'Explain Mechanism'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCalExplanation ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                The gingival margin is an unstable, dynamic soft-tissue reference that migrates coronally during inflammation (pseudopocketing) or apically following trauma/recession.
              </p>

              {showCalExplanation && (
                <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs animate-fadeIn">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <strong className="text-cyan-300 block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Pitfall 1: Gingival Hyperplasia Masks "Fake" Disease
                    </strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      In drug-induced gingival enlargement (e.g., Amlodipine, Phenytoin, Cyclosporine), swelling creates a <strong>6 mm PD</strong>. However, because the junctional epithelium remains at the CEJ, <strong>CAL is 0 mm</strong>. Treating this as periodontitis with bone resection would be clinical malpractice!
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <strong className="text-rose-300 block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      Pitfall 2: Severe Recession Masks Destruction
                    </strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      A patient with 5 mm of gingival recession may have a probing depth of only <strong>2 mm</strong>. An inexperienced clinician might record this as "healthy" (PD &le; 3mm), completely missing that the patient has lost <strong>7 mm of periodontal attachment (CAL)</strong> and is on the verge of tooth loss.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <strong className="text-emerald-300 block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      The Fixed Cementoenamel Junction (CEJ) Truth
                    </strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      The CEJ never moves during an adult's lifetime. Measuring from the CEJ directly to the base of the pocket provides the only reproducible, longitudinal metric of true bone and periodontal ligament destruction (World Workshop 2017 staging criterion).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE CLINICAL SIGN MECHANISM FLOWCHART */}
      {/* ========================================================================= */}
      <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-white">
                2. Clinical Sign Mechanism Flowchart
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Click any cardinal clinical sign below to uncover its cellular, histological, and mechanical chain reaction.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Clickable Sign Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Bleeding on Probing (BOP) */}
          <button
            onClick={() => {
              setActiveSign('bop');
              setActiveStepIndex(0);
            }}
            className={`text-left p-4 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
              activeSign === 'bop'
                ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/50 shadow-lg shadow-rose-950/50'
                : 'bg-slate-950 hover:bg-slate-900/80 border-slate-800 text-slate-400'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Flame className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono uppercase font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                  Microvascular
                </span>
              </div>
              <h3 className="font-bold text-base text-white">Bleeding on Probing (BOP)</h3>
              <p className="text-xs text-slate-300 leading-snug">
                Why does a standardized 0.25 N probing force provoke bleeding in disease but zero bleeding in health?
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-rose-400 font-semibold">
              <span>View 4-Step Mechanism</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 2: Tooth Mobility (Miller Index) */}
          <button
            onClick={() => {
              setActiveSign('mobility');
              setActiveStepIndex(0);
            }}
            className={`text-left p-4 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
              activeSign === 'mobility'
                ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-950/50'
                : 'bg-slate-950 hover:bg-slate-900/80 border-slate-800 text-slate-400'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Activity className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono uppercase font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  Biomechanics
                </span>
              </div>
              <h3 className="font-bold text-base text-white">Tooth Mobility (Miller Index)</h3>
              <p className="text-xs text-slate-300 leading-snug">
                How bone height loss shifts the tooth's center of rotation and magnifies occlusal lever-arm torque.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
              <span>View 4-Step Mechanism</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 3: Furcation Involvement (Glickman) */}
          <button
            onClick={() => {
              setActiveSign('furcation');
              setActiveStepIndex(0);
            }}
            className={`text-left p-4 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
              activeSign === 'furcation'
                ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/50 shadow-lg shadow-amber-950/50'
                : 'bg-slate-950 hover:bg-slate-900/80 border-slate-800 text-slate-400'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Layers className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  Anatomical Niche
                </span>
              </div>
              <h3 className="font-bold text-base text-white">Furcation Involvement (Glickman)</h3>
              <p className="text-xs text-slate-300 leading-snug">
                Why multi-rooted teeth with short root trunks accelerate bone destruction into inaccessible cul-de-sacs.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
              <span>View 4-Step Mechanism</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Dynamic Biological Breakdown Viewer */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
          {/* Header of Active Sign */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Histopathology &amp; Pathomechanics Chain
              </span>
              <h3 className="text-xl font-bold text-white">
                {activeSign === 'bop' && 'Pathophysiology of Bleeding on Probing (BOP)'}
                {activeSign === 'mobility' && 'Biomechanics of Pathologic Tooth Mobility'}
                {activeSign === 'furcation' && 'Pathogenesis of Interradicular Furcation Ingress'}
              </h3>
            </div>

            <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              Standardized Force: <strong className="text-white font-mono">0.20 – 0.25 N</strong> (blanching thumbnail)
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((stepIdx) => (
              <button
                key={stepIdx}
                onClick={() => setActiveStepIndex(stepIdx)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeStepIndex === stepIdx
                    ? 'bg-blue-600 text-white shadow-md'
                    : activeStepIndex > stepIdx
                    ? 'bg-slate-900 text-cyan-300 border border-cyan-800/60'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                <span>Step {stepIdx + 1}</span>
              </button>
            ))}
          </div>

          {/* Animated Step Breakdown Content */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            {/* BOP Sign Details */}
            {activeSign === 'bop' && (
              <>
                {activeStepIndex === 0 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                      Stage 1: Microbial Colonization &amp; Virulence Factor Influx
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Subgingival Biofilm Stagnation at the Sulcular Margin
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Periodontal pathogens (e.g., <em>Porphyromonas gingivalis, Treponema denticola, Tannerella forsythia</em>) form a mature subgingival dysbiotic biofilm. They secrete lipopolysaccharide (LPS), gingipains, and metabolic toxins into the gingival sulcus.
                    </p>
                  </div>
                )}
                {activeStepIndex === 1 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                      Stage 2: Polymorphonuclear Leukocyte (PMN) Transmigration
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Sulcular Epithelial Micro-Ulceration &amp; Rete Peg Disruption
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      In response to chemotactic IL-8 and C5a, massive waves of neutrophils (PMNs) migrate through the junctional and pocket epithelium. Their collagenases, matrix metalloproteinases (MMPs), and reactive oxygen species digest the desmosomal cell junctions, transforming the protective pocket epithelium into an <strong>ulcerated, non-keratinized sieve</strong>.
                    </p>
                  </div>
                )}
                {activeStepIndex === 2 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                      Stage 3: Subepithelial Vascular Proliferation &amp; Fragility
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Capillary Engorgement Directly Beneath the Ulcer Bed
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Histamine, prostaglandins (PGE2), and VEGF cause profound vasodilation. Blood vessels immediately beneath the basement membrane proliferate into fragile, paper-thin capillary loops lacking muscularis tunics, situated directly against the raw pocket ulceration.
                    </p>
                  </div>
                )}
                {activeStepIndex === 3 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                      Stage 4: Mechanical Rupture Under 0.25 N Probing Force
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Direct Extravasation of Blood into the Sulcus
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      When a calibrated periodontal probe (0.2–0.25 N) glides past the pocket entrance, the dull tip easily perforates the weakened, ulcerated basement membrane. The engorged capillaries rupture mechanically, pouring blood into the pocket.
                    </p>
                    <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-xs text-rose-200 mt-2">
                      <strong>High-Yield Board Concept:</strong> Absence of BOP has a <strong>98–100% Negative Predictive Value (NPV)</strong> for periodontal stability, whereas the presence of BOP has only a ~30% positive predictive value for future attachment loss!
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Mobility Sign Details */}
            {activeSign === 'mobility' && (
              <>
                {activeStepIndex === 0 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Stage 1: Sharpey's Fiber Lysis &amp; Alveolar Crest Resorption
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Reduction of Alveolar Bone Anchorage Surface Area
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      As bacterial osteoclastogenic cytokines (RANKL, TNF-alpha) induce horizontal or vertical bone resorption, the bundle bone (alveolar bone proper) is destroyed. The primary anchoring Sharpey's fibers inserted into root cementum are irreversibly cleaved.
                    </p>
                  </div>
                )}
                {activeStepIndex === 1 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Stage 2: Apical Migration of the Center of Rotation
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Physical Lever-Arm Magnification (Load-to-Support Mismatch)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      In a healthy tooth, the mechanical center of rotation sits at the coronal third of the root (~midway between alveolar crest and apex). With 50% bone loss, the center of rotation migrates apically. Normal lateral chewing forces now act on an elongated extra-alveolar clinical crown, exerting <strong>exponentially greater torque</strong> on remaining apical fibers.
                    </p>
                  </div>
                )}
                {activeStepIndex === 2 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Stage 3: PDL Space Funneling (Occlusal Trauma Interaction)
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Secondary Occlusal Trauma &amp; Radiographic Funneling
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      When normal physiological masticatory forces (100–300 N) impact this reduced periodontium, the remaining collagen fibers stretch beyond their elastic threshold. Vascular necrosis and hyalinization occur on the pressure side, followed by bone resorption that widens the PDL space into an hourglass or trumpet shape ("funneling").
                    </p>
                  </div>
                )}
                {activeStepIndex === 3 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Stage 4: Miller Classification Criteria
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Distinguishing Class I, II, and Terminal Class III
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <strong className="text-cyan-400 block">Class I:</strong>
                        <span>Horizontal movement between 0.2 mm and 1.0 mm.</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <strong className="text-amber-400 block">Class II:</strong>
                        <span>Horizontal movement exceeding 1.0 mm (crown moves &gt;1mm).</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-rose-800 bg-rose-950/20">
                        <strong className="text-rose-400 block">Class III:</strong>
                        <span>Severe horizontal movement + vertical depressibility into socket!</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Furcation Sign Details */}
            {activeSign === 'furcation' && (
              <>
                {activeStepIndex === 0 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Stage 1: Plaque Front Reaches Root Trunk Bifurcation
                    </span>
                    <h4 className="text-base font-bold text-white">
                      The Critical Root Trunk Distance (3–5 mm from CEJ)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      The root trunk is the undivided portion of a multi-rooted tooth from the CEJ to the furcation fornix. On mandibular 1st molars, the buccal root trunk averages 3 mm; lingual averages 4 mm. Once attachment loss exceeds 3 mm, the biofilm directly invades the interradicular space.
                    </p>
                  </div>
                )}
                {activeStepIndex === 1 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Stage 2: Interradicular Trabecular Bone Resorption
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Creation of an Inaccessible Anatomical Cul-de-Sac
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      The bone crest between diverging roots is thin and vascular. Inflammatory cytokines resorb the interradicular septum rapidly, producing horizontal bone defects and intermediate bifurcational ridges that cannot be reached by patient toothbrushes, floss, or standard 1.0 mm ultrasonic tips.
                    </p>
                  </div>
                )}
                {activeStepIndex === 2 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Stage 3: Nabers Curved Probe Engagement
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Mechanical Penetration of Curved Roots
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Straight probes (Williams, UNC-15) miss furcation entrances due to root convexity and overhangs. Only the curved, blunt-ended <strong>Nabers probe</strong> (marked at 3-6-9-12 mm) can hook horizontally under the roof of the furcation to measure horizontal depth of penetration.
                    </p>
                  </div>
                )}
                {activeStepIndex === 3 && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Stage 4: Glickman Furcation Staging (Grades I to IV)
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Diagnostic Stages and Treatment Implications
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <strong className="text-emerald-400 block">Grade I:</strong>
                        <span>Incipient, &lt;3mm horizontal catch in fluting.</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <strong className="text-amber-400 block">Grade II:</strong>
                        <span>Cul-de-sac &gt;3mm deep, but does NOT pass through.</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-rose-800 bg-rose-950/20">
                        <strong className="text-rose-400 block">Grade III:</strong>
                        <span>Through-and-through tunnel, covered by gingiva.</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-purple-800 bg-purple-950/20">
                        <strong className="text-purple-300 block">Grade IV:</strong>
                        <span>Through-and-through, clinically exposed by recession!</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-slate-200 transition"
              >
                Previous Stage
              </button>

              <span className="text-xs text-slate-400 font-mono">
                Stage {activeStepIndex + 1} of 4
              </span>

              <button
                disabled={activeStepIndex === 3}
                onClick={() => setActiveStepIndex((prev) => Math.min(3, prev + 1))}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-white transition flex items-center gap-1"
              >
                <span>Next Stage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE STEPWISE THERAPY "CAUSE-AND-EFFECT" TIMELINE */}
      {/* ========================================================================= */}
      <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-white">
                3. The Stepwise Therapy "Cause-and-Effect" Timeline
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                The official EFP S3 Treatment Sequence: Why steps must proceed in this strict chronological order and what clinical catastrophes happen if skipped.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTimelineDrawerOpen((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <span>{isTimelineDrawerOpen ? 'Hide Drawer' : 'Inspect Step Rationale'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTimelineDrawerOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 4-Step Horizontal Timeline Bar */}
        <div className="relative">
          {/* Connector Line behind steps */}
          <div className="hidden md:block absolute top-7 left-12 right-12 h-1 bg-slate-800 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
            {/* Step 1 */}
            <button
              onClick={() => {
                setSelectedTimelineStep(1);
                setIsTimelineDrawerOpen(true);
              }}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                selectedTimelineStep === 1
                  ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/50 shadow-lg'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                    1
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    Behavior &amp; PMPR
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">Step 1: Cause Control</h4>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  Behavior change, OHI, supragingival PMPR, and risk factor control (smoking &amp; diabetes).
                </p>
              </div>
              <div className="mt-3 text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                <span>View Rationale &amp; Hazards</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>

            {/* Step 2 */}
            <button
              onClick={() => {
                setSelectedTimelineStep(2);
                setIsTimelineDrawerOpen(true);
              }}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                selectedTimelineStep === 2
                  ? 'bg-cyan-950/60 border-cyan-500 ring-2 ring-cyan-500/50 shadow-lg'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-cyan-600 text-slate-950 font-bold text-xs flex items-center justify-center shadow-md">
                    2
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    Subgingival Debridement
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">Step 2: Subgingival SRP</h4>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  Root surface instrumentation, biofilm disruption &amp; re-evaluation at 6–12 weeks.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-cyan-300 font-semibold flex items-center gap-1">
                <span>View Rationale &amp; Hazards</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>

            {/* Step 3 */}
            <button
              onClick={() => {
                setSelectedTimelineStep(3);
                setIsTimelineDrawerOpen(true);
              }}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                selectedTimelineStep === 3
                  ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/50 shadow-lg'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                    3
                  </span>
                  <span className="text-[10px] font-mono text-purple-300 uppercase font-bold bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    Surgical Interventions
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">Step 3: Flaps &amp; Regeneration</h4>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  Access flaps, regenerative biologicals (EMD, Bio-Oss) or resective surgery for non-responders.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-purple-300 font-semibold flex items-center gap-1">
                <span>View Rationale &amp; Hazards</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>

            {/* Step 4 */}
            <button
              onClick={() => {
                setSelectedTimelineStep(4);
                setIsTimelineDrawerOpen(true);
              }}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                selectedTimelineStep === 4
                  ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                    4
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 uppercase font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Supportive Care (SPC)
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">Step 4: Lifelong Recall</h4>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  3-monthly continuous supportive recall, localized re-instrumentation, and compliance monitoring.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span>View Rationale &amp; Hazards</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>

        {/* Cause-and-Effect Deep Dive Drawer */}
        {isTimelineDrawerOpen && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 animate-fadeIn">
            {/* Step 1 Drawer Content */}
            {selectedTimelineStep === 1 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      EFP Step 1 Protocol (Duration: Weeks 1 to 4)
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Behavior Change, Oral Hygiene Coaching &amp; Supragingival Plaque Control
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    Target: Plaque Score &lt; 20%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Why this exact order */}
                  <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/60 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>Why It MUST Happen in This Exact Sequence:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Periodontitis is fundamentally a lifestyle-modified opportunistic infection. Subgingival instrumentation produces a sterile, debrided root surface. If the patient does not possess interdental brushes and toothbrushing skills to clear supragingival plaque daily, pathogens will recolonize the subgingival pocket within <strong>42 to 60 days</strong>, rendering all clinical treatment useless.
                    </p>
                  </div>

                  {/* What happens if skipped */}
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/60 space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Clinical Catastrophe If Skipped:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      If the clinician jumps directly into scaling or surgery on a patient with heavy plaque and uncontrolled smoking/diabetes (HbA1c &gt; 8%), the tissues remain chronically flooded with TNF-alpha and collagenases. Healing will fail, flap margins will undergo ischemic necrosis, and attachment loss will accelerate.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 Drawer Content */}
            {selectedTimelineStep === 2 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      EFP Step 2 Protocol (Duration: 6 to 12 Weeks Re-evaluation)
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Cause-Related Subgingival Instrumentation &amp; Healing Re-evaluation
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    Clinical Goal: Pockets &le; 4mm without BOP
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-900/60 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>Why It MUST Happen in This Exact Sequence:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Subgingival instrumentation removes toxic bacterial endotoxin-saturated cementum and subgingival calculus. 
                      Clinical studies prove that <strong>74% of moderate pockets (4–6 mm) resolve completely</strong> with Step 2 alone by forming a long junctional epithelium! The mandatory 6–12 week re-evaluation allows connective tissue collagen maturation before deciding if invasive surgery is even necessary.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/60 space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Clinical Catastrophe If Skipped:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Performing periodontal surgery without thorough Step 2 instrumentation means reflecting a flap over dirty, calculus-encrusted roots. Suturing flaps over contaminated root surfaces causes severe postoperative wound dehiscence, acute periodontal abscesses, and irreversible loss of pristine crestal bone.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Drawer Content */}
            {selectedTimelineStep === 3 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      EFP Step 3 Protocol (For Residual Sites Only)
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Surgical Interventions (Regenerative, Access, &amp; Resective)
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    Indication: Residual PD &ge; 6 mm with BOP
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/60 space-y-2">
                    <div className="flex items-center gap-2 text-purple-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Why It MUST Happen in This Exact Sequence:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Surgical therapy is restricted ONLY to pockets that failed to close in Step 2 (&ge;6mm PD with deep vertical infrabony defects or furcation involvement). Opening a flap provides direct direct line-of-sight visualization to debride deep root concavities and deliver biomaterials like Enamel Matrix Derivative (Emdogain) and bone grafts under sterile, tension-free closure.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/60 space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Clinical Catastrophe If Skipped:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      If residual 6+ mm pockets with vertical bone loss are left untreated (skipping Step 3), the anaerobic milieu fosters persistent colonies of <em>P. gingivalis</em>. Within 2 to 5 years, vertical defects will expand down the root surface, invading the apex and forcing complete tooth loss.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 Drawer Content */}
            {selectedTimelineStep === 4 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      EFP Step 4 Protocol (Lifelong Commitment)
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Supportive Periodontal Care (SPC) 3-Monthly Recalls
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    Frequency: Every 3 to 4 Months
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/60 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Why It MUST Happen in This Exact Sequence:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Periodontitis is a chronic, non-curable opportunistic disease that is held in remission, not eradicated. Axellson &amp; Lindhe demonstrated in famous 15-year longitudinal clinical trials that patients maintained on rigid 3-month SPC recall protocols preserved virtually 100% of their teeth and experienced near-zero attachment loss over decades.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/60 space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Clinical Catastrophe If Skipped:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      If Step 4 maintenance is abandoned, pathogenic subgingival microbiota return to pre-treatment levels within 6 months. In non-compliant patients, <strong>recurrent periodontitis occurs in &gt;90% of cases</strong>, causing rapid re-destruction of any surgically regenerated bone.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
