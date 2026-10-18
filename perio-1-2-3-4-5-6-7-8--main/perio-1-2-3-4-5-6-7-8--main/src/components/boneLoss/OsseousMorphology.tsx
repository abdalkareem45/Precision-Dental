import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Info,
  Percent,
  CheckCircle2,
  PieChart,
  ArrowRight,
  TrendingDown,
  Compass,
  Sliders,
  Play,
  RotateCcw,
  Scissors,
  Flame,
  AlertTriangle,
  Award,
  Eye,
  Activity
} from 'lucide-react';

export const OsseousMorphology: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crater' | 'other_morphologies'>('crater');
  const [morphologySubTab, setMorphologySubTab] = useState<'bulbous' | 'reversed' | 'ledges' | 'exostoses'>('bulbous');

  // Crater 2D Lab States
  const [craterDepthMode, setCraterDepthMode] = useState<'shallow' | 'medium' | 'deep'>('medium');
  const [crestSymmetryMode, setCrestSymmetryMode] = useState<'identical' | 'higher_facial' | 'higher_lingual'>('identical');

  // Bulbous 2D Lab States
  const [bulbousThickness, setBulbousThickness] = useState<number>(3.2); // 1.0 (normal) to 4.0 mm (thick shelf)
  const [simulatingChewing, setSimulatingChewing] = useState<boolean>(false);
  const [osteoplastyApplied, setOsteoplastyApplied] = useState<boolean>(false);

  // Reversed Architecture 2D Lab States
  const [architectureMode, setArchitectureMode] = useState<'positive' | 'flat' | 'reversed'>('reversed');
  const [activeProbeSite, setActiveProbeSite] = useState<number>(3); // 0 to 4 (site 3 is interdental col)
  const [surgicalCorrectionActive, setSurgicalCorrectionActive] = useState<boolean>(false);

  // Ledges 2D Lab States
  const [ledgePlateType, setLedgePlateType] = useState<'thick' | 'thin'>('thick');
  const [ledgeOsteoplastyDone, setLedgeOsteoplastyDone] = useState<boolean>(false);

  // Exostoses 2D Lab States
  const [exostosisType, setExostosisType] = useState<'nodule' | 'ridge' | 'spike' | 'buttressing'>('nodule');

  const handleSimulateChewing = () => {
    setSimulatingChewing(true);
    setTimeout(() => setSimulatingChewing(false), 2400);
  };

  const craterDepthMm = craterDepthMode === 'shallow' ? 1.5 : craterDepthMode === 'medium' ? 3.5 : 5.5;

  return (
    <div className="space-y-6 text-[#FAF8F3] font-sans">
      {/* Module Navigation with Brand Styling */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => setActiveTab('crater')}
          className={`flex-1 p-3.5 rounded-2xl border text-left transition ${
            activeTab === 'crater'
              ? 'bg-[#1B3A8C] border-[#C9A24B] text-white shadow-lg ring-1 ring-[#C9A24B]'
              : 'bg-[#071433] border-[#E6E8EC]/20 text-[#E6E8EC]/80 hover:text-white hover:border-[#C9A24B]/40'
          }`}
        >
          <div className="font-bold text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B]" />
              <span>1. Osseous Craters 2D Interactive Lab (35.2% of Defects)</span>
            </div>
            <span dir="rtl" className="text-[10px] font-arabic font-bold text-[#dfbe6e] px-1.5 py-0.2 rounded bg-[#0B1F4D]">
              دقّة الأسنان
            </span>
          </div>
          <div className="text-xs text-[#E6E8EC]/70 mt-0.5">Two-wall concavity · 62% Mandibular share · 85% Identical crests</div>
        </button>

        <button
          onClick={() => setActiveTab('other_morphologies')}
          className={`flex-1 p-3.5 rounded-2xl border text-left transition ${
            activeTab === 'other_morphologies'
              ? 'bg-[#1B3A8C] border-[#C9A24B] text-white shadow-lg ring-1 ring-[#C9A24B]'
              : 'bg-[#071433] border-[#E6E8EC]/20 text-[#E6E8EC]/80 hover:text-white hover:border-[#C9A24B]/40'
          }`}
        >
          <div className="font-bold text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#dfbe6e]" />
              <span>2. Bulbous, Reversed, Ledges &amp; Exostoses 2D Labs</span>
            </div>
            <span className="text-[10px] font-mono text-[#C9A24B]">Interactive 2D</span>
          </div>
          <div className="text-xs text-[#E6E8EC]/70 mt-0.5">Interactive 2D diagrams, probing walks, osteoplasty &amp; 40% skull mapping</div>
        </button>
      </div>

      {/* =========================================================================
          OSSEOUS CRATERS 2D INTERACTIVE LAB (REPLACED 3D DESIGN WITH 2D DESIGN)
          ========================================================================= */}
      {activeTab === 'crater' && (
        <div className="space-y-6">
          <div className="bg-[#071433] border border-[#E6E8EC]/20 rounded-3xl p-5 sm:p-7 space-y-2 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold">
                  Precision Dental • 2D Interactive Anatomical Cross-Section • PDF Pages 13 &amp; 14
                </span>
              </div>
              <span className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider hidden sm:inline">
                "Precision in Every Smile"
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#FAF8F3]">
              Osseous Crater (Two-Wall Interdental Concavity) 2D Lab
            </h3>
            <p className="text-xs sm:text-sm text-[#E6E8EC]/85 max-w-3xl">
              Concavity in the crest of the interdental bone that is confined within the <strong>facial and lingual walls</strong>.
              Most common bony defect in periodontology (<strong>35.2%</strong> of all defects, and <strong>62%</strong> of mandibular defects).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 2D Interactive SVG Visualizer (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">
                  Faciolingual Cross-Section: Concave Interdental Crater
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  Ochsenbein Depth: {craterDepthMm} mm ({craterDepthMode})
                </span>
              </div>

              {/* Dynamic 2D SVG Diagram: Osseous Crater */}
              <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex items-center justify-center min-h-[350px]">
                <svg viewBox="0 0 500 340" className="w-full h-auto max-h-[350px]">
                  <defs>
                    <linearGradient id="craterBoneGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e2d6b5" />
                      <stop offset="100%" stopColor="#9a8050" />
                    </linearGradient>
                  </defs>

                  {/* Healthy Crest Reference Line */}
                  <line x1="40" y1="90" x2="460" y2="90" stroke="#475569" strokeDasharray="4,4" strokeWidth="1.5" />
                  <text x="45" y="82" fill="#64748b" fontSize="10" fontFamily="monospace">Original Crest Level (1.5mm apical to CEJ)</text>

                  {/* Left Tooth Root Boundary (Mesial Root surface) */}
                  <path d="M 40 40 L 75 40 L 65 310 L 40 310 Z" fill="#fef08a" opacity="0.85" stroke="#ca8a04" strokeWidth="1.5" />
                  <text x="48" y="180" fill="#78350f" fontSize="10" fontWeight="bold" transform="rotate(-90 48,180)">
                    Adjoining Root Surface
                  </text>

                  {/* Right Tooth Root Boundary (Distal Root surface) */}
                  <path d="M 425 40 L 460 40 L 460 310 L 435 310 Z" fill="#fef08a" opacity="0.85" stroke="#ca8a04" strokeWidth="1.5" />
                  <text x="445" y="180" fill="#78350f" fontSize="10" fontWeight="bold" transform="rotate(90 445,180)">
                    Adjoining Root Surface
                  </text>

                  {/* Alveolar Bone with Two-Wall Concavity between Facial & Lingual Plates */}
                  {(() => {
                    const facialCrestY = crestSymmetryMode === 'higher_facial' ? 95 : crestSymmetryMode === 'higher_lingual' ? 120 : 105;
                    const lingualCrestY = crestSymmetryMode === 'higher_lingual' ? 95 : crestSymmetryMode === 'higher_facial' ? 120 : 105;
                    const craterBaseY = Math.max(facialCrestY, lingualCrestY) + (craterDepthMm / 5.5) * 85;

                    return (
                      <>
                        {/* Bone Shape with U-Shaped Interdental Crater Concavity */}
                        <path
                          d={`
                            M 75 310 
                            L 75 ${facialCrestY} 
                            L 145 ${facialCrestY} 
                            Q 250 ${craterBaseY} 355 ${lingualCrestY} 
                            L 425 ${lingualCrestY} 
                            L 425 310 
                            Z
                          `}
                          fill="url(#craterBoneGrad)"
                          stroke="#78350f"
                          strokeWidth="2.5"
                        />

                        {/* Crater Cavity Void Highlight Area */}
                        <path
                          d={`
                            M 145 ${facialCrestY} 
                            Q 250 ${craterBaseY} 355 ${lingualCrestY} 
                            L 355 90 
                            L 145 90 
                            Z
                          `}
                          fill="#f59e0b"
                          opacity="0.25"
                        />
                        <path
                          d={`M 145 ${facialCrestY} Q 250 ${craterBaseY} 355 ${lingualCrestY}`}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                        />

                        {/* Vascular Channels from gingiva entering center of crest */}
                        <line x1="250" y1="40" x2="250" y2={craterBaseY - 10} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3,3" />
                        <text x="255" y="60" fill="#ef4444" fontSize="9" fontFamily="monospace">
                          Vascular Infiltrate Channel
                        </text>

                        {/* Calibrated Probe Sounding the Center of Crater */}
                        <g transform={`translate(250, 20)`}>
                          <rect x="-3" y="10" width="6" height={craterBaseY - 30} fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
                          <rect x="-3" y={craterBaseY - 45} width="6" height="5" fill="#0f172a" />
                          <rect x="-3" y={craterBaseY - 65} width="6" height="5" fill="#0f172a" />
                          <circle cx="0" cy={craterBaseY - 20} r="3" fill="#ef4444" />
                          <rect x="-24" y="0" width="48" height="16" fill="#0f172a" rx="4" stroke="#f59e0b" strokeWidth="1" />
                          <text x="0" y="12" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            {craterDepthMm} mm
                          </text>
                        </g>

                        {/* Wall Height Callouts */}
                        <text x="110" y={facialCrestY - 10} fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                          Facial Wall Crest
                        </text>
                        <text x="310" y={lingualCrestY - 10} fill="#a855f7" fontSize="10" fontWeight="bold" fontFamily="monospace">
                          Lingual Wall Crest
                        </text>

                        <text x="250" y={craterBaseY + 22} fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          Crater Base (Confined within 2 Bony Walls)
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Interactive Ochsenbein Classification Depth Buttons */}
              <div className="space-y-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Select Ochsenbein Crater Depth Classification:
                </span>
                <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                  {[
                    { id: 'shallow', label: '1–2 mm', name: 'Shallow Crater', color: 'border-emerald-500 text-emerald-400' },
                    { id: 'medium', label: '3–4 mm', name: 'Medium Crater', color: 'border-amber-500 text-amber-400' },
                    { id: 'deep', label: '≥ 5 mm', name: 'Deep Crater', color: 'border-rose-500 text-rose-400' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setCraterDepthMode(btn.id as any)}
                      className={`p-2.5 rounded-xl border transition ${
                        craterDepthMode === btn.id
                          ? `bg-slate-800 ${btn.color} font-bold shadow-md ring-1 ring-amber-400/50`
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-sm font-bold">{btn.label}</div>
                      <span className="text-[10px] block mt-0.5">{btn.name}</span>
                    </button>
                  ))}
                </div>

                {/* 85% Rule Symmetry Selector */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold">Facial vs Lingual Crest Height (PDF Page 13):</span>
                  <div className="flex gap-1 font-mono text-[11px]">
                    <button
                      onClick={() => setCrestSymmetryMode('identical')}
                      className={`px-2.5 py-1 rounded-lg border transition ${
                        crestSymmetryMode === 'identical'
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Identical (85%)
                    </button>
                    <button
                      onClick={() => setCrestSymmetryMode('higher_facial')}
                      className={`px-2.5 py-1 rounded-lg border transition ${
                        crestSymmetryMode === 'higher_facial'
                          ? 'bg-cyan-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Higher Facial (7.5%)
                    </button>
                    <button
                      onClick={() => setCrestSymmetryMode('higher_lingual')}
                      className={`px-2.5 py-1 rounded-lg border transition ${
                        crestSymmetryMode === 'higher_lingual'
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Higher Lingual (7.5%)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Stats & Pathogenesis Dossier (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  Most Common Bony Lesion
                </span>
                <h4 className="text-lg font-bold text-white mt-1">Osseous Crater (Two-Wall Concavity)</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Concavity in the crest of the interdental bone that is confined within the <strong>facial and lingual walls</strong>.
                </p>
              </div>

              {/* Exact Numerical Facts from PDF Page 13 */}
              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Total Defect Prevalence:</span>
                  <span className="text-amber-300 font-bold text-sm">~1/3 (35.2%)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Mandibular Defect Share:</span>
                  <span className="text-cyan-300 font-bold text-sm">~2/3 (62.0%)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Posterior vs Anterior Ratio:</span>
                  <span className="text-emerald-300 font-bold text-sm">2x as often in posterior</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Facial/Lingual Crest Heights:</span>
                  <span className="text-purple-300 font-bold text-sm">Identical in 85%</span>
                </div>
              </div>

              {/* Why Are Interdental Craters So Common? */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-cyan-300 uppercase tracking-wider block">
                  Why Are Interdental Craters So Common? (PDF Page 13 &amp; 14)
                </span>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Plaque Biofilm:</strong> The difficulty in removal of plaque from the interdental space.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Septum Anatomy:</strong> The normal flat or concave faciolingual shape in lower molars favors crater formation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Vascular Pathway:</strong> Direct vascular channels run from the gingival papilla straight into the center of the crest.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          OTHER MORPHOLOGIES: BULBOUS, REVERSED, LEDGES, EXOSTOSES (ALL 2D LABS)
          ========================================================================= */}
      {activeTab === 'other_morphologies' && (
        <div className="space-y-6">
          {/* Sub-navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setMorphologySubTab('bulbous')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                morphologySubTab === 'bulbous'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>1. Bulbous Bone Contours 2D Lab</span>
            </button>
            <button
              onClick={() => setMorphologySubTab('reversed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                morphologySubTab === 'reversed'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>2. Reversed Architecture 2D Lab</span>
            </button>
            <button
              onClick={() => setMorphologySubTab('ledges')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                morphologySubTab === 'ledges'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3. Ledges (Plateau Margins) 2D Lab</span>
            </button>
            <button
              onClick={() => setMorphologySubTab('exostoses')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                morphologySubTab === 'exostoses'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>4. Exostoses &amp; Buttressing (40% Skulls) 2D Lab</span>
            </button>
          </div>

          {/* =====================================================================
              2D LAB 1: BULBOUS BONE CONTOURS
              ===================================================================== */}
          {morphologySubTab === 'bulbous' && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-2 shadow-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    2D Interactive Biomechanical Cross-Section • PDF Page 14
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Bulbous Bone Contours &amp; Food Impaction Mechanics
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                  Bony enlargements caused by <strong>exostoses</strong>, buttressing bone formation (peripheral lipping), or functional adaptation.
                  More common in the <strong>Maxilla</strong> than the Mandible. Inspect how a thickened shelf halts natural food deflection and traps plaque.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300">
                      Cross-Sectional Tooth &amp; Bone Contour Profile:
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {bulbousThickness <= 1.2
                        ? 'Physiological Knife-Edge (15°)'
                        : bulbousThickness <= 2.5
                        ? 'Mild Buttressing Bulge (45°)'
                        : 'Severe Bulbous Shelf (85°)'}
                    </span>
                  </div>

                  {/* Dynamic SVG Cross-Section */}
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex items-center justify-center min-h-[360px]">
                    <svg viewBox="0 0 500 380" className="w-full h-auto max-h-[380px]">
                      <defs>
                        <linearGradient id="enamelGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#f8fafc" />
                          <stop offset="100%" stopColor="#cbd5e1" />
                        </linearGradient>
                        <linearGradient id="dentinGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="100%" stopColor="#fde047" />
                        </linearGradient>
                        <linearGradient id="boneGradB" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#e2d6b5" />
                          <stop offset="100%" stopColor="#b49f6b" />
                        </linearGradient>
                        <linearGradient id="gingivaGradB" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#f472b6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>

                      <line x1="50" y1="120" x2="450" y2="120" stroke="#334155" strokeDasharray="4,4" strokeWidth="1" />
                      <text x="55" y="115" fill="#64748b" fontSize="10" fontFamily="monospace">CEJ (Cementoenamel Junction)</text>

                      {/* Tooth Crown & Root */}
                      <path d="M 180 30 Q 250 20 320 30 Q 345 80 330 120 L 170 120 Q 155 80 180 30 Z" fill="url(#enamelGrad)" stroke="#94a3b8" strokeWidth="2" />
                      <path d="M 170 120 L 330 120 Q 305 270 260 350 Q 250 365 240 350 Q 195 270 170 120 Z" fill="url(#dentinGrad)" stroke="#ca8a04" strokeWidth="2" />
                      <path d="M 245 60 L 255 60 L 254 340 L 246 340 Z" fill="#ef4444" opacity="0.85" />

                      {/* Dynamic Buccal Bone Bulge */}
                      {(() => {
                        const effectiveThickness = osteoplastyApplied ? 1.1 : bulbousThickness;
                        const bulgeX = 330 + (effectiveThickness - 1.0) * 36;
                        return (
                          <path
                            d={`M 330 170 L ${bulgeX} 175 Q ${bulgeX + 10} 240 380 350 L 280 350 L 310 240 Z`}
                            fill="url(#boneGradB)"
                            stroke="#78350f"
                            strokeWidth="2.5"
                          />
                        );
                      })()}

                      {/* Lingual Bone Plate */}
                      <path d="M 170 170 L 135 185 Q 120 250 140 350 L 220 350 L 190 240 Z" fill="url(#boneGradB)" stroke="#78350f" strokeWidth="2" />

                      {/* Dynamic Gingiva */}
                      {(() => {
                        const effectiveThickness = osteoplastyApplied ? 1.1 : bulbousThickness;
                        const gingivaBulgeX = 335 + (effectiveThickness - 1.0) * 38;
                        return (
                          <path
                            d={`M 330 130 Q ${gingivaBulgeX} 145 ${gingivaBulgeX + 8} 175 Q ${gingivaBulgeX + 12} 240 395 350 L 380 350 Q ${gingivaBulgeX + 2} 240 ${gingivaBulgeX} 175 L 330 170 Z`}
                            fill="url(#gingivaGradB)"
                            opacity="0.75"
                            stroke="#db2777"
                            strokeWidth="1.5"
                          />
                        );
                      })()}

                      {/* Osteoplasty Bur Graphic */}
                      {osteoplastyApplied && (
                        <g transform="translate(380, 155)">
                          <circle cx="0" cy="0" r="14" fill="#38bdf8" opacity="0.6" stroke="#0284c7" strokeWidth="2" />
                          <line x1="-12" y1="-12" x2="12" y2="12" stroke="#ffffff" strokeWidth="2" />
                          <line x1="12" y1="-12" x2="-12" y2="12" stroke="#ffffff" strokeWidth="2" />
                          <text x="18" y="5" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                            Rotary Osteoplasty Diamond Bur
                          </text>
                        </g>
                      )}

                      {/* Chewing simulation */}
                      {simulatingChewing && (
                        <g>
                          {bulbousThickness > 2.0 && !osteoplastyApplied ? (
                            <>
                              <path d="M 360 40 Q 355 110 370 160" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6,4" />
                              <circle cx="370" cy="160" r="11" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
                              <text x="320" y="205" fill="#f43f5e" fontSize="11" fontWeight="bold" fontFamily="monospace">
                                💥 Food Bolus Impacts Shelf!
                              </text>
                              <rect x="345" y="150" width="50" height="30" fill="#ef4444" opacity="0.3" rx="6" />
                            </>
                          ) : (
                            <>
                              <path d="M 360 40 Q 365 110 415 220" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="6,4" />
                              <circle cx="415" cy="220" r="9" fill="#10b981" stroke="#047857" strokeWidth="2" />
                              <text x="350" y="245" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">
                                ✓ Smooth Deflection into Vestibule
                              </text>
                            </>
                          )}
                        </g>
                      )}
                    </svg>
                  </div>

                  {/* Slider & Buttons */}
                  <div className="space-y-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                        Adjust Bone Margin Thickness:
                      </span>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {bulbousThickness.toFixed(1)} mm
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1.0"
                      max="4.0"
                      step="0.1"
                      value={bulbousThickness}
                      disabled={osteoplastyApplied}
                      onChange={(e) => setBulbousThickness(parseFloat(e.target.value))}
                      className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={handleSimulateChewing}
                        disabled={simulatingChewing}
                        className="flex-1 px-3 py-2 rounded-xl bg-amber-600/25 hover:bg-amber-600/40 border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Simulate Mastication / Food Bolus Vector</span>
                      </button>

                      <button
                        onClick={() => setOsteoplastyApplied(!osteoplastyApplied)}
                        className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition border ${
                          osteoplastyApplied
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      >
                        <Scissors className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{osteoplastyApplied ? 'Osteoplasty Done (Re-contoured)' : 'Apply Surgical Osteoplasty'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4 text-xs">
                  <div className="p-4 rounded-3xl bg-blue-950/30 border border-blue-900/60 space-y-2">
                    <span className="font-bold text-cyan-300 uppercase tracking-wider block">Anatomical Prevalence</span>
                    <p className="text-slate-300 leading-relaxed">
                      Bulbous contours occur more frequently in the <strong>maxilla</strong> than the mandible. Palatal exostoses occur in up to <strong>40% of human skulls</strong>!
                    </p>
                  </div>

                  <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <strong className="text-white block uppercase tracking-wider">Clinical Impact of Bulbous Shelf:</strong>
                    <p className="text-slate-300 leading-relaxed">
                      A flat horizontal shelf interrupts normal self-cleansing. During chewing, food impacts against the shelf, creating chronic McCall festoons, gingival rolls, and plaque traps that require osteoplasty to recreate physiological festooning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              2D LAB 2: REVERSED ARCHITECTURE
              ===================================================================== */}
          {morphologySubTab === 'reversed' && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-2 shadow-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                    2D Interactive Probing &amp; Contour Simulator • PDF Page 14
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Reversed Architecture (Inconsistent Bony Margin) 2D Lab
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                  Occurs when the crest of interdental bone is located <strong>apical</strong> to its midfacial and midlingual margins.
                  Produced by loss of interdental bone crest (crater formation) without concomitant loss of radicular cortical plate.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'positive', title: 'Positive Architecture', subtitle: 'Normal / Physiological', badge: 'Interdental Coronal' },
                  { id: 'flat', title: 'Flat Architecture', subtitle: 'Transitional Stage', badge: 'Level Crests' },
                  { id: 'reversed', title: 'Reversed Architecture', subtitle: 'Inconsistent Margin', badge: 'Interdental Apical' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setArchitectureMode(mode.id as any);
                      setSurgicalCorrectionActive(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      architectureMode === mode.id
                        ? 'bg-purple-600/20 border-purple-400 ring-2 ring-purple-400/50 shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-mono text-purple-300 uppercase font-bold block mb-0.5">
                        {mode.badge}
                      </span>
                      <strong className="text-xs text-white block">{mode.title}</strong>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">{mode.subtitle}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
                  {/* Dynamic SVG Arch */}
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex items-center justify-center min-h-[350px]">
                    <svg viewBox="0 0 540 350" className="w-full h-auto max-h-[350px]">
                      <line x1="30" y1="110" x2="510" y2="110" stroke="#334155" strokeDasharray="4,4" strokeWidth="1" />
                      <text x="35" y="105" fill="#64748b" fontSize="9" fontFamily="monospace">CEJ Line</text>

                      {/* Tooth 1 */}
                      <g transform="translate(60, 20)">
                        <path d="M 15 20 Q 80 10 145 20 L 140 90 L 20 90 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                        <path d="M 20 90 L 35 250 Q 55 260 70 250 L 75 140 L 95 140 L 105 250 Q 125 260 135 250 L 135 90 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                      </g>
                      {/* Tooth 2 */}
                      <g transform="translate(230, 20)">
                        <path d="M 15 20 Q 80 10 145 20 L 140 90 L 20 90 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                        <path d="M 20 90 L 35 250 Q 55 260 70 250 L 75 140 L 95 140 L 105 250 Q 125 260 135 250 L 135 90 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                      </g>
                      {/* Tooth 3 */}
                      <g transform="translate(400, 20)">
                        <path d="M 15 20 Q 55 10 95 20 L 90 90 L 20 90 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                        <path d="M 25 90 L 40 260 Q 55 270 70 260 L 85 90 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                      </g>

                      {/* Bone Curve */}
                      {(() => {
                        let interdentalY = 135;
                        let radicularY = 165;

                        if (architectureMode === 'positive') {
                          interdentalY = 135;
                          radicularY = 165;
                        } else if (architectureMode === 'flat') {
                          interdentalY = 160;
                          radicularY = 160;
                        } else if (architectureMode === 'reversed') {
                          if (surgicalCorrectionActive) {
                            interdentalY = 210;
                            radicularY = 225;
                          } else {
                            interdentalY = 215; // Apical dip
                            radicularY = 155; // Coronal high
                          }
                        }

                        const bonePath = `
                          M 40 ${interdentalY}
                          Q 140 ${radicularY} 215 ${interdentalY}
                          Q 310 ${radicularY} 385 ${interdentalY}
                          Q 455 ${radicularY} 505 ${interdentalY}
                          L 505 320 L 40 320 Z
                        `;

                        return (
                          <>
                            <path d={bonePath} fill="url(#craterBoneGrad)" stroke="#78350f" strokeWidth="2.5" />
                            <path
                              d={`
                                M 40 ${interdentalY}
                                Q 140 ${radicularY} 215 ${interdentalY}
                                Q 310 ${radicularY} 385 ${interdentalY}
                                Q 455 ${radicularY} 505 ${interdentalY}
                              `}
                              fill="none"
                              stroke={architectureMode === 'reversed' && !surgicalCorrectionActive ? '#f43f5e' : '#38bdf8'}
                              strokeWidth="3.5"
                            />
                          </>
                        );
                      })()}

                      {/* Calibrated Probe */}
                      {(() => {
                        const sitePositions = [
                          { x: 95, depth: 2 },
                          { x: 140, depth: architectureMode === 'reversed' ? 2 : 3 },
                          { x: 185, depth: 3 },
                          { x: 215, depth: architectureMode === 'reversed' ? 6 : 2 }, // Deep dip!
                          { x: 310, depth: 2 }
                        ];
                        const cur = sitePositions[activeProbeSite] || sitePositions[3];
                        const probeY = 110 + cur.depth * 17;

                        return (
                          <g transform={`translate(${cur.x}, 0)`}>
                            <rect x="-3" y="15" width="6" height={probeY - 15} fill="#94a3b8" stroke="#334155" strokeWidth="1" />
                            <rect x="-3" y={probeY - 17} width="6" height="5" fill="#0f172a" />
                            <rect x="-3" y={probeY - 34} width="6" height="5" fill="#0f172a" />
                            <circle cx="0" cy={probeY} r="3" fill="#ef4444" />
                            <rect x="-22" y="0" width="44" height="16" fill="#0f172a" rx="4" stroke="#a855f7" strokeWidth="1" />
                            <text x="0" y="12" fill="#a855f7" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                              {cur.depth} mm
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* 5-Site Probing Controller */}
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Click Site to Walk Periodontal Probe:
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 font-mono text-center text-xs">
                      {[
                        { idx: 0, label: 'MF #14', depth: '2 mm' },
                        { idx: 1, label: 'Mid-F #14', depth: architectureMode === 'reversed' ? '2 mm' : '3 mm' },
                        { idx: 2, label: 'DF #14', depth: '3 mm' },
                        { idx: 3, label: 'Interdental Col', depth: architectureMode === 'reversed' ? '6 mm ⚠️' : '2 mm' },
                        { idx: 4, label: 'Mid-F #15', depth: '2 mm' }
                      ].map((site) => (
                        <button
                          key={site.idx}
                          onClick={() => setActiveProbeSite(site.idx)}
                          className={`p-2 rounded-xl border transition ${
                            activeProbeSite === site.idx
                              ? 'bg-purple-950/70 border-purple-400 text-white font-bold shadow'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="block text-[10px]">{site.label}</span>
                          <span className={`block text-xs font-bold mt-0.5 ${site.idx === 3 && architectureMode === 'reversed' ? 'text-rose-400' : 'text-cyan-300'}`}>
                            {site.depth}
                          </span>
                        </button>
                      ))}
                    </div>

                    {architectureMode === 'reversed' && (
                      <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          Restore Positive Architecture via Ostectomy:
                        </span>
                        <button
                          onClick={() => setSurgicalCorrectionActive(!surgicalCorrectionActive)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition border ${
                            surgicalCorrectionActive
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                          }`}
                        >
                          {surgicalCorrectionActive ? '✓ Ostectomy Completed' : 'Simulate Ostectomy'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4 text-xs">
                  <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <span className="font-bold text-purple-300 uppercase tracking-wider block">
                      PDF Page 14 Strict Definition:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      "Reversed architecture (also called <strong>inconsistent bony margin</strong>) is produced by loss of interdental bone, including the facial or lingual plates or both, without concomitant loss of radicular bone, thereby reversing the normal scalloped contour."
                    </p>
                  </div>

                  <div className="p-4 rounded-3xl bg-rose-950/20 border border-rose-900/60 space-y-1.5">
                    <span className="font-bold text-rose-300 uppercase tracking-wider block">
                      Why Can't It Be Left Untreated?
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      Soft tissue gingiva will always attempt to recreate a positive scalloped architecture. If the underlying bone remains reversed, gingiva collapses into the interdental depression, creating a deep <strong>recurrent periodontal pocket</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              2D LAB 3: LEDGES (PLATEAU BONE MARGINS)
              ===================================================================== */}
          {morphologySubTab === 'ledges' && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-2 shadow-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    2D Interactive Plateau Margin Simulator • PDF Page 14
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Ledges: Plateau-Like Bone Margins
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                  Plateau-like bone margins caused by the <strong>resorption of thickened bony plates</strong>.
                  Thin plates resorb horizontally with knife-edge margins; thick plates resorb leaving an abrupt flat step (ledge).
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
                  {/* Interactive 2D SVG: Thick Plate vs Thin Plate Ledge */}
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex items-center justify-center min-h-[340px]">
                    <svg viewBox="0 0 480 320" className="w-full h-auto max-h-[320px]">
                      {/* Tooth Root */}
                      <path d="M 160 30 L 210 30 L 205 300 L 165 300 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                      <text x="185" y="160" fill="#78350f" fontSize="11" fontWeight="bold" transform="rotate(90 185,160)">
                        Tooth Root Face
                      </text>

                      {/* Bone Profile */}
                      {ledgePlateType === 'thick' ? (
                        <>
                          {/* Thick Plate with Flat Ledge Plateau */}
                          <path
                            d={
                              ledgeOsteoplastyDone
                                ? 'M 210 160 L 250 175 Q 310 240 330 300 L 205 300 Z'
                                : 'M 210 160 L 320 160 L 330 300 L 205 300 Z'
                            }
                            fill="url(#craterBoneGrad)"
                            stroke="#78350f"
                            strokeWidth="2.5"
                          />

                          {!ledgeOsteoplastyDone ? (
                            <>
                              {/* Horizontal Plateau Ledge Line */}
                              <line x1="210" y1="160" x2="320" y2="160" stroke="#f59e0b" strokeWidth="3.5" />
                              <text x="235" y="150" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">
                                Horizontal Ledge Plateau (Width: 3.5mm)
                              </text>
                              {/* Warning food trap zone */}
                              <rect x="230" y="135" width="80" height="22" fill="#ef4444" opacity="0.25" rx="4" />
                            </>
                          ) : (
                            <text x="260" y="165" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">
                              ✓ Beveled Festooned Margin
                            </text>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Thin Plate: Resorbs without ledge */}
                          <path
                            d="M 210 160 L 235 170 Q 255 240 260 300 L 205 300 Z"
                            fill="url(#craterBoneGrad)"
                            stroke="#78350f"
                            strokeWidth="2"
                          />
                          <text x="240" y="180" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                            Thin Plate: Melts Horizontally (No Ledge)
                          </text>
                        </>
                      )}
                    </svg>
                  </div>

                  {/* Ledge Interactive Controls */}
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setLedgePlateType('thick');
                          setLedgeOsteoplastyDone(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition border ${
                          ledgePlateType === 'thick'
                            ? 'bg-amber-600 text-white border-amber-500'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        Thick Cortical Plate (Forms Ledge)
                      </button>
                      <button
                        onClick={() => {
                          setLedgePlateType('thin');
                          setLedgeOsteoplastyDone(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition border ${
                          ledgePlateType === 'thin'
                            ? 'bg-cyan-600 text-white border-cyan-500'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        Thin Cortical Plate (No Ledge)
                      </button>
                    </div>

                    {ledgePlateType === 'thick' && (
                      <button
                        onClick={() => setLedgeOsteoplastyDone(!ledgeOsteoplastyDone)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition border ${
                          ledgeOsteoplastyDone
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      >
                        {ledgeOsteoplastyDone ? '✓ Osteoplasty Completed' : 'Apply Osteoplasty Bur'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4 text-xs">
                  <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <strong className="text-white block uppercase tracking-wider">PDF Page 14 Exact Definition:</strong>
                    <p className="text-slate-300 leading-relaxed">
                      "Ledges are plateau-like bone margins caused by the resorption of thickened bony plates."
                    </p>
                  </div>
                  <div className="p-4 rounded-3xl bg-amber-950/20 border border-amber-900/50 space-y-2">
                    <strong className="text-amber-300 block uppercase tracking-wider">Surgical Treatment:</strong>
                    <p className="text-amber-100/90 leading-relaxed">
                      Requires <strong>osteoplasty</strong> (resective re-contouring of non-supporting bone) using round diamond burs to bevel the plateau into a gradual 15° knife-edge margin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              2D LAB 4: EXOSTOSES & BUTTRESSING BONE (40% HUMAN SKULLS)
              ===================================================================== */}
          {morphologySubTab === 'exostoses' && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-2 shadow-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    2D Interactive Skull Morphology &amp; TFO Lab • PDF Page 14
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Exostoses (40% Human Skulls) &amp; Buttressing Bone Formation
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                  Palatal exostoses occur in <strong>40% of human skulls</strong>! Buttressing bone forms as an adaptation to occlusal forces attempting to reinforce trabeculae weakened by resorption.
                </p>
              </div>

              {/* Morphology Type Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'nodule', label: 'Small/Large Nodules', badge: '40% Palatal Skulls' },
                  { id: 'ridge', label: 'Sharp Ridges', badge: 'Palatal Shelves' },
                  { id: 'spike', label: 'Spike-Like Projections', badge: 'Osteophytes' },
                  { id: 'buttressing', label: 'Peripheral Lipping (TFO)', badge: 'Buttressing Bone' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setExostosisType(type.id as any)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      exostosisType === type.id
                        ? 'bg-emerald-600/20 border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[9px] font-mono text-emerald-300 uppercase font-bold block mb-0.5">
                      {type.badge}
                    </span>
                    <strong className="text-xs block">{type.label}</strong>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
                  {/* Dynamic SVG Visualizer for Exostoses */}
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex items-center justify-center min-h-[340px]">
                    <svg viewBox="0 0 500 320" className="w-full h-auto max-h-[320px]">
                      {/* Maxillary Dental Arch Vault Outline */}
                      <path d="M 50 260 Q 250 80 450 260 L 410 280 Q 250 120 90 280 Z" fill="#334155" opacity="0.6" stroke="#475569" strokeWidth="2" />
                      <text x="250" y="70" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        Maxillary Palatal Vault &amp; Alveolar Process
                      </text>

                      {/* Exostosis Outgrowths based on Selected Type */}
                      {exostosisType === 'nodule' && (
                        <g>
                          <circle cx="160" cy="180" r="22" fill="#e2d6b5" stroke="#78350f" strokeWidth="2.5" />
                          <circle cx="210" cy="165" r="32" fill="#e2d6b5" stroke="#78350f" strokeWidth="2.5" />
                          <circle cx="280" cy="170" r="26" fill="#e2d6b5" stroke="#78350f" strokeWidth="2.5" />
                          <circle cx="330" cy="190" r="18" fill="#e2d6b5" stroke="#78350f" strokeWidth="2.5" />
                          <text x="250" y="240" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            Palatal Nodular Exostoses (Found in 40% of Skulls)
                          </text>
                        </g>
                      )}

                      {exostosisType === 'ridge' && (
                        <g>
                          <path d="M 140 185 Q 250 145 360 185 L 350 205 Q 250 170 150 205 Z" fill="#e2d6b5" stroke="#78350f" strokeWidth="2.5" />
                          <text x="250" y="240" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            Continuous Sharp Palatal Ridge / Shelf
                          </text>
                        </g>
                      )}

                      {exostosisType === 'spike' && (
                        <g>
                          <polygon points="170,195 185,145 200,195" fill="#e2d6b5" stroke="#78350f" strokeWidth="2" />
                          <polygon points="240,185 255,130 270,185" fill="#e2d6b5" stroke="#78350f" strokeWidth="2" />
                          <polygon points="310,195 325,140 340,195" fill="#e2d6b5" stroke="#78350f" strokeWidth="2" />
                          <text x="250" y="240" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            Spike-Like Sharp Projections
                          </text>
                        </g>
                      )}

                      {exostosisType === 'buttressing' && (
                        <g>
                          {/* Peripheral Lipping on external plate */}
                          <path d="M 120 230 Q 80 180 110 140 Q 140 170 135 230 Z" fill="#e2d6b5" stroke="#78350f" strokeWidth="2.5" />
                          <text x="250" y="240" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            Peripheral Buttressing: External Lipping in Response to TFO
                          </text>
                          {/* Force Vector Arrow */}
                          <line x1="80" y1="100" x2="110" y2="150" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrow)" />
                          <text x="80" y="90" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace">
                            Trauma from Occlusion (TFO)
                          </text>
                        </g>
                      )}
                    </svg>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4 text-xs">
                  <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <strong className="text-emerald-300 block uppercase tracking-wider">
                      PDF Page 14 Exact Exostosis Fact:
                    </strong>
                    <p className="text-slate-300 leading-relaxed">
                      "Palatal exostoses have been found in <strong>40% of human skulls</strong>. Can occur as small nodules, large nodules, sharp ridges, spike-like projections, or combinations."
                    </p>
                  </div>

                  <div className="p-4 rounded-3xl bg-blue-950/30 border border-blue-900/60 space-y-2">
                    <strong className="text-blue-300 block uppercase tracking-wider">
                      Buttressing Bone Formation (PDF Page 14):
                    </strong>
                    <p className="text-slate-300 leading-relaxed">
                      Bone formation attempting to buttress trabeculae weakened by resorption.
                    </p>
                    <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                      <li>• <strong>Central:</strong> Occurs within the jaws.</li>
                      <li>• <strong>Peripheral (Lipping):</strong> Occurs on external surface, causing bulging of bone contour.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
