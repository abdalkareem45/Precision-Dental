import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Stethoscope,
  Activity,
  Sparkles,
  Info,
  Sliders,
  ChevronRight,
  TrendingDown,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const FurcationAnatomy2D: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'palatal_approach' | 'hamp_matrix' | 'cep_grading' | 'root_trunk_calc' | 'differential_diag' | 'prognosis'
  >('palatal_approach');

  // Palatal approach interactive simulator state
  const [probeApproach, setProbeApproach] = useState<'buccal' | 'palatal'>('palatal');

  // Hamp slider state (horizontal penetration in mm)
  const [probePenetrationMm, setProbePenetrationMm] = useState<number>(4.5);
  const [molarWidthMm] = useState<number>(10.0);
  const [isThroughAndThrough, setIsThroughAndThrough] = useState<boolean>(false);
  const [isGingivaReceded, setIsGingivaReceded] = useState<boolean>(false);

  // Root trunk calculator state
  const [rootTrunkHeightMm, setRootTrunkHeightMm] = useState<number>(3.0); // mm from CEJ to furca
  const [clinicalAttachmentLossMm, setClinicalAttachmentLossMm] = useState<number>(4.5); // mm CAL

  // Differential diagnosis wizard state
  const [pulpVitality, setPulpVitality] = useState<'vital' | 'non_vital'>('vital');
  const [probeEngagesFurca, setProbeEngagesFurca] = useState<boolean>(true);
  const [occlusalWearMobility, setOcclusalWearMobility] = useState<boolean>(false);

  // Computed Hamp class
  const oneThirdWidth = molarWidthMm / 3;
  let derivedHampClass = 'Class I (Initial)';
  let derivedHampColor = 'text-amber-400';
  let derivedHampBg = 'bg-amber-950/80 border-amber-500/50';

  if (isThroughAndThrough) {
    if (isGingivaReceded) {
      derivedHampClass = 'Class IV (Recession Exposed)';
      derivedHampColor = 'text-purple-400';
      derivedHampBg = 'bg-purple-950/80 border-purple-500/50';
    } else {
      derivedHampClass = 'Class III (Through-and-Through)';
      derivedHampColor = 'text-rose-400';
      derivedHampBg = 'bg-rose-950/80 border-rose-500/50';
    }
  } else if (probePenetrationMm > oneThirdWidth) {
    derivedHampClass = 'Class II (Partial / Cul-de-Sac)';
    derivedHampColor = 'text-orange-400';
    derivedHampBg = 'bg-orange-950/80 border-orange-500/50';
  } else {
    derivedHampClass = 'Class I (Initial)';
    derivedHampColor = 'text-amber-400';
    derivedHampBg = 'bg-amber-950/80 border-amber-500/50';
  }

  // Computed Root Trunk Involvement
  const isFurcationExposed = clinicalAttachmentLossMm > rootTrunkHeightMm;
  const furcationLossDepth = Math.max(0, clinicalAttachmentLossMm - rootTrunkHeightMm);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-[#07132e] p-2 rounded-2xl border border-slate-800 shadow-xl scrollbar-none">
        {[
          { id: 'palatal_approach', label: '1. Palatal Probing Angle', icon: <Compass className="w-4 h-4 text-[#C9A24B]" /> },
          { id: 'hamp_matrix', label: '2. Hamp 1975 Caliper', icon: <Ruler className="w-4 h-4 text-cyan-400" /> },
          { id: 'cep_grading', label: '3. CEP & Enamel Pearls', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
          { id: 'root_trunk_calc', label: '4. Root Trunk vs CAL', icon: <Layers className="w-4 h-4 text-emerald-400" /> },
          { id: 'differential_diag', label: '5. Differential Diagnosis', icon: <Stethoscope className="w-4 h-4 text-rose-400" /> },
          { id: 'prognosis', label: '6. Tooth Prognosis', icon: <TrendingDown className="w-4 h-4 text-blue-400" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#18357a] text-white border border-[#C9A24B] shadow-md shadow-[#0B1F4D]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. PALATAL PROBING ANGLE SIMULATOR (Maxillary Molar Mesial Furca) */}
      {/* ========================================================================= */}
      {activeTab === 'palatal_approach' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#C9A24B] text-slate-950 font-black text-xs flex items-center justify-center font-mono">
                  Fig. 9
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  The Palatal Approach Rule for Maxillary Molars
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                Dr. Maha Shukri's Golden Clinical Rule: <em>"In maxillary molars, the mesial furcation entrance is located much closer to the palatal than to the buccal surface. Thus, the mesial furcation <strong>must be probed from the palatal aspect</strong>."</em>
              </p>
            </div>

            {/* Approach Toggle Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
              <button
                onClick={() => setProbeApproach('palatal')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  probeApproach === 'palatal'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Palatal Aspect (Correct)</span>
              </button>
              <button
                onClick={() => setProbeApproach('buccal')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  probeApproach === 'buccal'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-300" />
                <span>Buccal Aspect (Incorrect)</span>
              </button>
            </div>
          </div>

          {/* Interactive SVG Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-[#060f24] border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
              <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-400 uppercase font-bold">
                Transverse Occlusal View • Maxillary Right 1st Molar (#16)
              </div>

              <svg viewBox="0 0 500 420" className="w-full max-w-[460px] h-auto">
                <defs>
                  {/* Gradients */}
                  <radialGradient id="palatalRootGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f3eedc" />
                    <stop offset="70%" stopColor="#dfcb9a" />
                    <stop offset="100%" stopColor="#c2ab72" />
                  </radialGradient>
                  <radialGradient id="mbRootGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f3eedc" />
                    <stop offset="70%" stopColor="#dfcb9a" />
                    <stop offset="100%" stopColor="#bfa76c" />
                  </radialGradient>
                </defs>

                {/* Background Orientation Guides */}
                <text x="250" y="30" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">
                  BUCCAL ASPECT (Facial)
                </text>
                <text x="250" y="405" fill="#C9A24B" fontSize="12" fontWeight="black" textAnchor="middle">
                  PALATAL ASPECT (Lingual) — PROBE INSERTION ZONE
                </text>
                <text x="30" y="215" fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">
                  MESIAL
                </text>
                <text x="470" y="215" fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">
                  DISTAL
                </text>

                {/* Tooth Crown Outline (Dotted Translucent) */}
                <path
                  d="M 120,80 Q 250,55 380,80 Q 420,200 390,320 Q 250,355 110,320 Q 80,200 120,80 Z"
                  fill="#1e293b"
                  fillOpacity="0.4"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* 1. Mesiobuccal Root (MB) */}
                <ellipse cx="160" cy="115" rx="48" ry="38" fill="url(#mbRootGrad)" stroke="#94a3b8" strokeWidth="2" />
                <text x="160" y="120" fill="#0f172a" fontSize="11" fontWeight="black" textAnchor="middle">
                  MB Root
                </text>

                {/* 2. Distobuccal Root (DB) */}
                <ellipse cx="340" cy="115" rx="42" ry="36" fill="url(#mbRootGrad)" stroke="#94a3b8" strokeWidth="2" />
                <text x="340" y="120" fill="#0f172a" fontSize="11" fontWeight="black" textAnchor="middle">
                  DB Root
                </text>

                {/* 3. Palatal Root (Large, round, located lingually) */}
                <ellipse cx="250" cy="275" rx="65" ry="52" fill="url(#palatalRootGrad)" stroke="#94a3b8" strokeWidth="2" />
                <text x="250" y="280" fill="#0f172a" fontSize="13" fontWeight="black" textAnchor="middle">
                  Palatal Root
                </text>

                {/* 3 Furcation Entrances: */}
                {/* A. Buccal Furcation (Centered buccally) */}
                <circle cx="250" cy="95" r="7" fill="#38bdf8" />
                <text x="250" y="80" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Buccal Furca
                </text>

                {/* B. Distal Furcation (Centered distally) */}
                <circle cx="370" cy="205" r="7" fill="#38bdf8" />
                <text x="415" y="210" fill="#38bdf8" fontSize="9" fontWeight="bold">
                  Distal Furca
                </text>

                {/* C. Mesial Furcation (Offset 2/3 toward Palate!) */}
                <circle cx="165" cy="235" r="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                <text x="95" y="240" fill="#f59e0b" fontSize="10" fontWeight="black">
                  Mesial Furca 📍
                </text>
                <text x="95" y="254" fill="#dfbe6e" fontSize="8" fontWeight="bold">
                  (2/3 toward palate)
                </text>

                {/* Interactive Nabers Probe Animation / Vector */}
                {probeApproach === 'palatal' ? (
                  <g>
                    {/* Curved Nabers Probe from Palatal: Perfect Access */}
                    <path
                      d="M 210,385 Q 185,320 168,245"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    {/* Measurement bands */}
                    <circle cx="185" cy="305" r="4" fill="#065f46" />
                    <circle cx="174" cy="270" r="4" fill="#065f46" />
                    {/* Target Entry Sparkle */}
                    <circle cx="165" cy="235" r="14" fill="#10b981" fillOpacity="0.25" className="animate-ping" />
                    <text x="230" y="360" fill="#10b981" fontSize="11" fontWeight="black">
                      ✓ Direct Palatal Path (No Obstruction)
                    </text>
                  </g>
                ) : (
                  <g>
                    {/* Blocked Probe from Buccal */}
                    <path
                      d="M 90,65 Q 120,130 145,175"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="6 3"
                    />
                    <line x1="145" y1="175" x2="165" y2="235" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2 2" />
                    <circle cx="155" cy="180" r="12" fill="#f43f5e" fillOpacity="0.3" />
                    <text x="75" y="195" fill="#f43f5e" fontSize="11" fontWeight="black">
                      ✕ BLOCKED by Mesiobuccal Root
                    </text>
                    <text x="75" y="210" fill="#fda4af" fontSize="9">
                      False negative: Cannot reach mesial furca!
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Explanation & Clinical Pearls Card */}
            <div className="lg:col-span-5 space-y-4 text-xs">
              <div className={`p-4 rounded-2xl border transition-all ${
                probeApproach === 'palatal'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-black text-sm text-white mb-1.5">
                  {probeApproach === 'palatal' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Correct: Palatal Insertion Achieves Diagnosis</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      <span>Clinical Error: Buccal Probing Misses Mesial Defect</span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed">
                  {probeApproach === 'palatal'
                    ? 'Because the broad Mesiobuccal root occupies the anterior-buccal quadrant of the tooth, the mesial furcation entrance sits approximately two-thirds of the way toward the palatal surface. Inserting the curved Nabers probe from the palatal embrasure provides an unobstructed straight line directly into the furcation fornix.'
                    : 'Attempting to probe the mesial furcation from the buccal aspect will strike the massive convex distal contour of the mesiobuccal root. The clinician erroneously concludes there is no furcation involvement, leading to missed diagnosis and progressive bone loss.'}
                </p>
              </div>

              {/* Anatomy Summary Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-[#C9A24B] tracking-wider block">
                  Maxillary Molar Probing Summary:
                </span>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Buccal Furcation:</strong> Probed directly from buccal aspect between MB and DB roots.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] mt-1.5 shrink-0" />
                    <span><strong>Mesial Furcation:</strong> MUST be probed from <strong>PALATAL</strong> aspect (located 2/3 toward palatal).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <span><strong>Distal Furcation:</strong> Located near the center of the tooth; probed from <strong>either buccal or palatal</strong>.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HAMP ET AL. (1975) INTERACTIVE CALIPER */}
      {/* ========================================================================= */}
      {activeTab === 'hamp_matrix' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <Ruler className="w-5 h-5 text-cyan-400" />
                <span>Hamp et al. (1975) Furcation Classification Caliper</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Horizontal bone destruction criteria measured with a curved Nabers probe.
              </p>
            </div>

            {/* Dynamic Computed Badge */}
            <div className={`px-4 py-2 rounded-2xl border shadow-lg font-black text-xs ${derivedHampBg}`}>
              <span className="text-[10px] text-slate-300 uppercase block font-mono">Calculated Degree:</span>
              <span className={`text-base ${derivedHampColor}`}>{derivedHampClass}</span>
            </div>
          </div>

          {/* Interactive Sliders & Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            {/* Slider: Horizontal penetration depth */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Horizontal Nabers Probe Penetration:
                </label>
                <span className="font-mono text-cyan-400 font-bold text-sm bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                  {probePenetrationMm.toFixed(1)} mm
                </span>
              </div>

              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.5"
                disabled={isThroughAndThrough}
                value={probePenetrationMm}
                onChange={(e) => setProbePenetrationMm(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer disabled:opacity-30"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0 mm (Normal)</span>
                <span className="text-amber-400">&lt; 3.3 mm (Class I: &lt;1/3 width)</span>
                <span className="text-orange-400">&gt; 3.3 mm (Class II: &gt;1/3 width)</span>
              </div>
            </div>

            {/* Toggles for Through-and-Through & Recession */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-200 block">
                Total Destruction &amp; Clinical Exposure:
              </label>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2.5 bg-slate-900 p-2.5 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={isThroughAndThrough}
                    onChange={(e) => setIsThroughAndThrough(e.target.checked)}
                    className="w-4 h-4 rounded accent-rose-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-white block">Through-and-Through Destruction</span>
                    <span className="text-[10px] text-slate-400">Probe completely traverses opposite furca entrance</span>
                  </div>
                </label>

                <label className={`flex items-center gap-2.5 bg-slate-900 p-2.5 rounded-xl border border-slate-800 cursor-pointer ${
                  !isThroughAndThrough ? 'opacity-40 pointer-events-none' : 'hover:border-slate-700'
                }`}>
                  <input
                    type="checkbox"
                    checked={isGingivaReceded}
                    disabled={!isThroughAndThrough}
                    onChange={(e) => setIsGingivaReceded(e.target.checked)}
                    className="w-4 h-4 rounded accent-purple-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-white block">Gingival Recession Exposing Furca Opening</span>
                    <span className="text-[10px] text-slate-400">Furcation tunnel clinically visible upon direct inspection = Class IV</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Reference Definition Table from Lecture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className={`p-4 rounded-2xl border transition-all ${
              derivedHampClass.includes('Class I') ? 'bg-amber-950/50 border-amber-500 ring-2 ring-amber-400' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="font-bold text-amber-400 text-sm mb-1">Class I (Initial)</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Horizontal loss of periodontal support not exceeding <strong>1/3 of the width of the tooth</strong> (&lt;3 mm). Fluting felt on root surface.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${
              derivedHampClass.includes('Class II') ? 'bg-orange-950/50 border-orange-500 ring-2 ring-orange-400' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="font-bold text-orange-400 text-sm mb-1">Class II (Partial)</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Horizontal loss exceeding <strong>1/3 of tooth width</strong>, but not encompassing the total width. Represents a horizontal "cul-de-sac".
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${
              derivedHampClass.includes('Class III') ? 'bg-rose-950/50 border-rose-500 ring-2 ring-rose-400' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="font-bold text-rose-400 text-sm mb-1">Class III (Total)</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Horizontal <strong>"through-and-through"</strong> destruction of periodontal tissues in the furcation area. Probe passes cleanly through.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${
              derivedHampClass.includes('Class IV') ? 'bg-purple-950/50 border-purple-500 ring-2 ring-purple-400' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="font-bold text-purple-400 text-sm mb-1">Class IV (Recession)</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Through-and-through furcation defect where <strong>the gingiva has receded apically</strong> so the opening is clinically visible to the naked eye.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CERVICAL ENAMEL PROJECTIONS (Masters & Hoskins 1964) */}
      {/* ========================================================================= */}
      {activeTab === 'cep_grading' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 bg-purple-950 px-2.5 py-1 rounded-full border border-purple-800 font-bold">
              Masters &amp; Hoskins (1964) Classification
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-white mt-1.5">
              Cervical Enamel Projections (CEP) &amp; Enamel Pearls
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Found in approximately <strong>15% of molars</strong>. Because connective tissue attachment cannot anchor onto enamel (only weak hemidesmosomes), CEPs favor plaque biofilm stagnation and accelerate furcation involvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Grade I */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 relative hover:border-purple-500/50 transition">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500 text-purple-300 font-black text-sm flex items-center justify-center font-mono">
                  I
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  Least Severe
                </span>
              </div>
              <h4 className="text-sm font-black text-white">Grade I CEP</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The enamel projection extends from the cementoenamel junction (CEJ) <strong>towards the furcation entrance</strong>, but remains short of it.
              </p>
              <div className="bg-slate-900 p-2.5 rounded-xl text-[11px] text-slate-400">
                <strong>Clinical Implication:</strong> Minimal impediment to scaling; minor plaque predilection.
              </div>
            </div>

            {/* Grade II */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 relative hover:border-purple-500/50 transition">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500 text-purple-300 font-black text-sm flex items-center justify-center font-mono">
                  II
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  High Risk
                </span>
              </div>
              <h4 className="text-sm font-black text-white">Grade II CEP</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The enamel projection <strong>approaches the entrance</strong> to the furcation, but does not enter the furcation and has <strong>no horizontal component</strong>.
              </p>
              <div className="bg-slate-900 p-2.5 rounded-xl text-[11px] text-slate-400">
                <strong>Clinical Implication:</strong> High plaque accumulation risk; acts as an anatomical pathway leading directly into the furca.
              </div>
            </div>

            {/* Grade III */}
            <div className="bg-slate-950 border border-purple-500/60 rounded-2xl p-5 space-y-3 relative shadow-lg shadow-purple-950/30">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center font-mono shadow">
                  III
                </span>
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  Most Severe
                </span>
              </div>
              <h4 className="text-sm font-black text-white">Grade III CEP</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The enamel projection <strong>extends horizontally directly into the furcation</strong> fornix. Often associated with spherical enamel pearls.
              </p>
              <div className="bg-slate-900 p-2.5 rounded-xl text-[11px] text-purple-200">
                <strong>Management:</strong> Must be eliminated by <strong>odontoplasty</strong> (diamond bur recontouring) during periodontal surgery to permit new attachment.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ROOT TRUNK VS ATTACHMENT LOSS CALCULATOR (Fig. 5) */}
      {/* ========================================================================= */}
      {activeTab === 'root_trunk_calc' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Root Trunk Height vs. Disease Progression Dynamics (Fig. 5)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              <em>"The shorter the root trunk, the less attachment needs to be lost before the furcation is involved."</em>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Sliders */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                  <span className="text-slate-200">Root Trunk Height (CEJ to Furca Entrance):</span>
                  <span className="font-mono text-emerald-400 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
                    {rootTrunkHeightMm.toFixed(1)} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="6.0"
                  step="0.5"
                  value={rootTrunkHeightMm}
                  onChange={(e) => setRootTrunkHeightMm(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>1.5 mm (Very Short)</span>
                  <span>3.5 mm (Moderate)</span>
                  <span>6.0 mm (Long Trunk)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                  <span className="text-slate-200">Patient Clinical Attachment Loss (CAL):</span>
                  <span className="font-mono text-rose-400 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
                    {clinicalAttachmentLossMm.toFixed(1)} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="9.0"
                  step="0.5"
                  value={clinicalAttachmentLossMm}
                  onChange={(e) => setClinicalAttachmentLossMm(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>1.0 mm (Mild)</span>
                  <span>5.0 mm (Severe)</span>
                  <span>9.0 mm (Hopeless)</span>
                </div>
              </div>
            </div>

            {/* Dynamic Result Card */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isFurcationExposed
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
            }`}>
              <div className="flex items-center gap-2 font-black text-base text-white">
                {isFurcationExposed ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span>FURCATION INVASION ACTIVE!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Furcation Intact (Sub-Crestal)</span>
                  </>
                )}
              </div>

              <div className="text-xs space-y-2">
                <p>
                  Root trunk height is <strong>{rootTrunkHeightMm} mm</strong>. With <strong>{clinicalAttachmentLossMm} mm</strong> of CAL, the attachment level is {isFurcationExposed ? <strong>{furcationLossDepth.toFixed(1)} mm APICAL to the furcation entrance</strong> : <strong>coronal to the furcation entrance</strong>}.
                </p>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-bold text-[#C9A24B] block mb-1">Dr. Maha Shukri Trade-off Analysis:</span>
                  {rootTrunkHeightMm <= 2.5 ? (
                    <span><strong>Short Root Trunk:</strong> Very early furcation invasion with minimal bone loss. However, once exposed, it is <em>more accessible</em> for maintenance, curettes, and regenerative or resective surgery!</span>
                  ) : (
                    <span><strong>Long Root Trunk:</strong> Protected from early disease (requires massive bone loss before furca is reached). However, once infected, it is <em>extremely difficult to reach or instrument</em>, with worse overall surgical prognosis!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DIFFERENTIAL DIAGNOSIS DECISION WIZARD */}
      {/* ========================================================================= */}
      {activeTab === 'differential_diag' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-rose-400" />
              <span>Differential Diagnosis of Interradicular Radiolucencies</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              <em>"A lesion in the inter-radicular space of a multi-rooted tooth may be associated with problems originating from the root canal or be the result of occlusal overload."</em>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Input 1: Vitality */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">1. Tooth Pulp Vitality Test:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPulpVitality('vital')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    pulpVitality === 'vital' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Vital (+)
                </button>
                <button
                  onClick={() => setPulpVitality('non_vital')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    pulpVitality === 'non_vital' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Non-Vital (-)
                </button>
              </div>
            </div>

            {/* Input 2: Probing */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">2. Nabers Probing Result:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setProbeEngagesFurca(true)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    probeEngagesFurca ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Enters Furca Pocket
                </button>
                <button
                  onClick={() => setProbeEngagesFurca(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    !probeEngagesFurca ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Sulcus Intact (&lt;3mm)
                </button>
              </div>
            </div>

            {/* Input 3: Occlusal Trauma */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">3. Occlusal Interference:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setOcclusalWearMobility(true)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    occlusalWearMobility ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Bruxism / Mobility
                </button>
                <button
                  onClick={() => setOcclusalWearMobility(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    !occlusalWearMobility ? 'bg-slate-800 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  No Trauma
                </button>
              </div>
            </div>
          </div>

          {/* Differential Diagnosis Outcome */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a1636] to-slate-950 border border-blue-500/40 shadow-xl space-y-3">
            <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider block">
              Differential Diagnosis &amp; Mandated Sequence of Care:
            </span>

            {pulpVitality === 'non_vital' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-black text-base">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Primary Endodontic Lesion (Accessory Furcation Canal Drainage)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The tooth is non-vital. Necrotic pulp toxins drain through accessory pulp canals in the furcation fornix into the interradicular space (Fig. 12).
                </p>
                <div className="bg-blue-950/60 border border-blue-500/40 p-3 rounded-xl text-xs text-blue-200">
                  <strong>Mandated Treatment Protocol:</strong> Proper endodontic therapy (RCT) must <strong>ALWAYS precede periodontal therapy</strong>. In fact, endodontic therapy alone may resolve the inflammatory lesion and the furcation defect can completely disappear!
                </div>
              </div>
            ) : !probeEngagesFurca && occlusalWearMobility ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-black text-base">
                  <Activity className="w-5 h-5" />
                  <span>Trauma from Occlusion (TFO) Adaptation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Forces from bruxism or premature contacts cause widened PDL and interradicular bone radiolucency with tooth mobility. However, <strong>probing fails to detect any pocket into the furcation!</strong>
                </p>
                <div className="bg-purple-950/60 border border-purple-500/40 p-3 rounded-xl text-xs text-purple-200">
                  <strong>Mandated Treatment Protocol:</strong> Occlusal adjustment must always precede periodontal therapy.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-black text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Plaque-Associated Periodontal Furcation Defect</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The tooth is vital, and the Nabers probe enters the furcation with attachment loss. Primary cause is subgingival bacterial biofilm.
                </p>
                <div className="bg-amber-950/60 border border-amber-500/40 p-3 rounded-xl text-xs text-amber-200">
                  <strong>Mandated Treatment Protocol:</strong> Stepwise periodontal therapy (biofilm control + meticulous scaling and root planing, followed by access surgery or regeneration if indicated).
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TOOTH PROGNOSIS MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'prognosis' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-blue-400" />
              <span>Prognosis of Furcation-Involved Teeth by Tooth Type</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tooth anatomy and degree of furcation involvement are the primary determinants of clinical success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mandibular Molars: Good */}
            <div className="bg-slate-950 border border-emerald-500/50 rounded-2xl p-5 space-y-3 shadow-lg shadow-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  Mandibular Molars
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  GOOD PROGNOSIS
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Have only <strong>two roots (Mesial &amp; Distal)</strong> that are widely divergent (especially 1st molar). Furcations open directly buccally and lingually.
              </p>
              <div className="bg-slate-900 p-3 rounded-xl text-[11px] text-slate-300 space-y-1">
                <div className="text-emerald-400 font-bold">Why Good?</div>
                <div>• Direct access for patient oral hygiene.</div>
                <div>• Excellent access for curettes &amp; ultrasonic tips.</div>
                <div>• Prime candidate for hemisection or tunnel preparation.</div>
              </div>
            </div>

            {/* Maxillary Molars: Not Good / Guarded */}
            <div className="bg-slate-950 border border-amber-500/50 rounded-2xl p-5 space-y-3 shadow-lg shadow-amber-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Maxillary Molars
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  GUARDED / NOT GOOD
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trifurcated with <strong>three roots (MB, DB, Palatal)</strong> and three furcation entrances (buccal, mesial, distal).
              </p>
              <div className="bg-slate-900 p-3 rounded-xl text-[11px] text-slate-300 space-y-1">
                <div className="text-amber-400 font-bold">Why Guarded?</div>
                <div>• Proximal furcation entrances extremely hard to clean.</div>
                <div>• Superimposition on radiographs conceals bone loss.</div>
                <div>• Root amputation or trisection technically challenging.</div>
              </div>
            </div>

            {/* Maxillary 1st Premolars: Poor */}
            <div className="bg-slate-950 border border-rose-500/50 rounded-2xl p-5 space-y-3 shadow-lg shadow-rose-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-400 uppercase tracking-wider">
                  Maxillary 1st Premolars
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  POOR PROGNOSIS
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Roots are placed buccally and palatally with furcations opening in a <strong>mesiodistal direction</strong> deep near the apex.
              </p>
              <div className="bg-slate-900 p-3 rounded-xl text-[11px] text-slate-300 space-y-1">
                <div className="text-rose-400 font-bold">Why Poor?</div>
                <div>• Frequent root fusion with narrow interradicular space.</div>
                <div>• Pronounced longitudinal furrows and invaginations.</div>
                <div>• Routine instrumentation virtually impossible.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
