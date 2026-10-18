import React, { useState } from 'react';
import { BoneLoss3DCanvas } from './BoneLoss3DCanvas';
import {
  BookOpen,
  ArrowRight,
  Activity,
  Ruler,
  AlertTriangle,
  Layers,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Info,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  Scale,
  Search,
  Sliders,
  Play,
  RotateCcw,
  Clock,
  Compass
} from 'lucide-react';

export const InteractiveLecture: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('equilibrium');

  // Section 1: Equilibrium State
  const [formationResorptionBalance, setFormationResorptionBalance] = useState<number>(75); // 0-100, >50 = resorption
  const [selectedClinicalCase, setSelectedClinicalCase] = useState<'reduced_health' | 'gingivitis' | 'periodontitis'>('reduced_health');

  // Section 2: Pathways 3D State
  const [pathway3DMode, setPathway3DMode] = useState<'pathways_interproximal' | 'pathways_facial'>('pathways_interproximal');

  // Section 3: Microscopic Histopathology State
  const [virtualZoom, setVirtualZoom] = useState<'10x' | '40x' | '100x'>('40x');
  const [selectedHistologyHotspot, setSelectedHistologyHotspot] = useState<string>('osteoclast');
  const [marrowSplitSlider, setMarrowSplitSlider] = useState<number>(50); // 0 to 100

  // Section 4: Cellular Mechanism State
  const [selectedCytokine, setSelectedCytokine] = useState<'lps' | 'il1' | 'tnf' | 'pge2'>('lps');
  const [showOsteoblastInhibition, setShowOsteoblastInhibition] = useState<boolean>(true);

  // Section 5: Radius of Action State
  const [interdentalWidth, setInterdentalWidth] = useState<number>(2.2); // mm
  const [isAggressiveCase, setIsAggressiveCase] = useState<boolean>(false);

  // Section 6: Rate of Bone Loss Time-lapse State
  const [simulatedYears, setSimulatedYears] = useState<number>(10); // 1 to 25 years

  // Section 7: TFO 3D State
  const [tfoHasPlaque, setTfoHasPlaque] = useState<boolean>(false);
  const [tfoForceNewtons, setTfoForceNewtons] = useState<number>(180);

  // Section 8: Morphology 3D State
  const [morphology3DType, setMorphology3DType] = useState<'thin_plate' | 'exostoses' | 'buttressing_peripheral' | 'reversed_arch' | 'ledges'>('exostoses');

  return (
    <div className="space-y-8 text-slate-100">
      {/* Lecture Sub-navigation pill menu */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-md">
        {[
          { id: 'equilibrium', label: '1. Fundamentals & Equilibrium' },
          { id: 'pathways', label: '2. 3D Pathways of Inflammation' },
          { id: 'histopathology', label: '3. Microscopic Histopathology' },
          { id: 'mechanisms', label: '4. 3D Cellular Mechanisms' },
          { id: 'radius', label: '5. Radius of Action (1.5–2.5mm)' },
          { id: 'rates', label: '6. 20-Year Rates of Loss (Löe)' },
          { id: 'tfo_systemic', label: '7. 3D Occlusal Trauma & Systemic' },
          { id: 'morphology_factors', label: '8. 3D Morphology Determinants' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeSection === item.id
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          SECTION 1: BONE LOSS FUNDAMENTALS & EQUILIBRIUM (2D INTERACTIVE)
          ========================================================================= */}
      {activeSection === 'equilibrium' && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              PDF Page 1 • 5th Class Periodontology
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Bone Loss Fundamentals: The Equilibrium Seesaw &amp; Clinical Disconnect
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Alveolar bone height and density are governed by an ongoing equilibrium between bone formation and bone resorption.
              When resorption exceeds formation, bone height and density are progressively reduced.
            </p>
          </div>

          {/* Interactive Visual 1: Mechanical Seesaw & Cross-Section Simulator */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                Interactive Formation ↔ Resorption Seesaw Simulator
              </span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                  formationResorptionBalance > 55
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : formationResorptionBalance < 45
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}
              >
                {formationResorptionBalance > 55
                  ? 'RESORPTION > FORMATION (Active Bone Loss)'
                  : formationResorptionBalance < 45
                  ? 'FORMATION > RESORPTION (Bone Apposition)'
                  : 'PHYSIOLOGICAL EQUILIBRIUM (Stable Bone)'}
              </span>
            </div>

            {/* Interactive Control Slider */}
            <div className="space-y-2 max-w-2xl mx-auto">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span className="text-emerald-400 font-bold">Osteoblastic Formation Dominant</span>
                <span className="text-amber-400 font-bold">Balance Point (50%)</span>
                <span className="text-rose-400 font-bold">Osteoclastic Resorption Dominant</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={formationResorptionBalance}
                onChange={(e) => setFormationResorptionBalance(parseInt(e.target.value, 10))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* 2D SVG Seesaw Graphic with Real-Time Tilting */}
            <div className="w-full max-w-xl mx-auto py-2">
              <svg viewBox="0 0 500 160" className="w-full select-none overflow-visible">
                {/* Fulcrum base */}
                <polygon points="250,130 220,155 280,155" fill="#334155" stroke="#475569" strokeWidth="2" />
                <circle cx="250" cy="130" r="5" fill="#f59e0b" />

                {/* Rotating Beam */}
                <g
                  style={{
                    transformOrigin: '250px 130px',
                    transform: `rotate(${(formationResorptionBalance - 50) * 0.4}deg)`,
                    transition: 'transform 0.15s ease-out'
                  }}
                >
                  <line x1="70" y1="130" x2="430" y2="130" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

                  {/* Left Pan: Bone Formation */}
                  <g transform="translate(90, 130)">
                    <rect x="-45" y="-55" width="90" height="50" rx="8" fill="#064e3b" stroke="#059669" strokeWidth="1.5" />
                    <text x="0" y="-35" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="middle">
                      FORMATION
                    </text>
                    <text x="0" y="-15" fill="#a7f3d0" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      Osteoblasts: {100 - formationResorptionBalance}%
                    </text>
                  </g>

                  {/* Right Pan: Bone Resorption */}
                  <g transform="translate(410, 130)">
                    <rect x="-45" y="-55" width="90" height="50" rx="8" fill="#881337" stroke="#e11d48" strokeWidth="1.5" />
                    <text x="0" y="-35" fill="#fda4af" fontSize="11" fontWeight="bold" textAnchor="middle">
                      RESORPTION
                    </text>
                    <text x="0" y="-15" fill="#fecdd3" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      Osteoclasts: {formationResorptionBalance}%
                    </text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Dynamic Result Ticker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">Alveolar Bone Height Response:</span>
                <div
                  className={`text-sm font-bold ${
                    formationResorptionBalance > 50 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {formationResorptionBalance > 50
                    ? `Crestal Resorption (${((formationResorptionBalance - 50) * 0.12).toFixed(1)} mm lost)`
                    : 'Crest Height Intact (1.5mm apical to CEJ)'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">Trabecular Density Architecture:</span>
                <div
                  className={`text-sm font-bold ${
                    formationResorptionBalance > 50 ? 'text-amber-400' : 'text-cyan-400'
                  }`}
                >
                  {formationResorptionBalance > 50
                    ? `Internal marrow cavity enlargement & trabecular thinning`
                    : 'Dense physiological trabecular architecture'}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Visual 2: The "Past Pathology vs Present Soft Tissue" Clinical Disconnect */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-900 pb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Clinical Insight Simulator: Past Pathology vs. Present Inflammation (PDF Page 1)
              </span>
              <p className="text-xs text-slate-300 mt-1">
                Select a clinical scenario below to see why bone loss does not correlate directly with pocket depth, ulceration, or suppuration:
              </p>
            </div>

            {/* Case Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedClinicalCase('reduced_health')}
                className={`p-3 rounded-2xl border text-left transition ${
                  selectedClinicalCase === 'reduced_health'
                    ? 'bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-bold text-emerald-400 block uppercase font-mono">Case A</span>
                <div className="font-bold text-xs text-white mt-0.5">Reduced Periodontium in Health</div>
                <div className="text-[10px] text-slate-400 mt-1">Treated past bone loss + currently healthy</div>
              </button>

              <button
                onClick={() => setSelectedClinicalCase('gingivitis')}
                className={`p-3 rounded-2xl border text-left transition ${
                  selectedClinicalCase === 'gingivitis'
                    ? 'bg-purple-950/60 border-purple-500 ring-1 ring-purple-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-bold text-purple-400 block uppercase font-mono">Case B</span>
                <div className="font-bold text-xs text-white mt-0.5">Active Gingivitis (Pseudopocket)</div>
                <div className="text-[10px] text-slate-400 mt-1">Severe soft-tissue swelling + zero bone loss</div>
              </button>

              <button
                onClick={() => setSelectedClinicalCase('periodontitis')}
                className={`p-3 rounded-2xl border text-left transition ${
                  selectedClinicalCase === 'periodontitis'
                    ? 'bg-rose-950/60 border-rose-500 ring-1 ring-rose-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-bold text-rose-400 block uppercase font-mono">Case C</span>
                <div className="font-bold text-xs text-white mt-0.5">Active Untreated Periodontitis</div>
                <div className="text-[10px] text-slate-400 mt-1">Past bone loss + active deep suppuration</div>
              </button>
            </div>

            {/* Case Details Matrix */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-3">
              {selectedClinicalCase === 'reduced_health' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Case A: Reduced Periodontium Following Successful Periodontal Therapy</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Existing Bone Loss:</span>
                      <strong className="text-rose-400 text-xs">4.0 mm (Past episode)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Probing Depth:</span>
                      <strong className="text-emerald-400 text-xs">2.0 mm (Healthy sulcus)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Bleeding on Probing:</span>
                      <strong className="text-emerald-400 text-xs">0% (No inflammation)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Suppuration:</span>
                      <strong className="text-emerald-400 text-xs">ABSENT</strong>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    <strong>Textbook Proof:</strong> The radiographs reveal significant past bone loss, yet the periodontal pocket depth is only 2 mm and the tissue is completely healthy. Bone level reflects the <em>history of past episodes</em>, not the present soft-tissue inflammatory state!
                  </p>
                </div>
              )}

              {selectedClinicalCase === 'gingivitis' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-bold text-purple-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Case B: Active Gingivitis with Inflammatory Hyperplasia (Pseudopocket)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Existing Bone Loss:</span>
                      <strong className="text-emerald-400 text-xs">0.0 mm (100% Intact)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Probing Depth:</span>
                      <strong className="text-amber-400 text-xs">5.0 mm (Swollen margin)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Bleeding on Probing:</span>
                      <strong className="text-rose-400 text-xs">100% (Ulcerated)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Suppuration:</span>
                      <strong className="text-amber-400 text-xs">Occasional exudate</strong>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    <strong>Textbook Proof:</strong> The patient has deep 5 mm pockets and profusely bleeding ulcerated pocket walls, yet the bone height is completely normal. Soft-tissue changes reflect current inflammation, but do not dictate bone loss!
                  </p>
                </div>
              )}

              {selectedClinicalCase === 'periodontitis' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-400">
                    <Flame className="w-4 h-4" />
                    <span>Case C: Active Untreated Periodontitis with Suppuration</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Existing Bone Loss:</span>
                      <strong className="text-rose-400 text-xs">6.5 mm (Severe loss)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Probing Depth:</span>
                      <strong className="text-rose-400 text-xs">7.0 mm (True pocket)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Bleeding on Probing:</span>
                      <strong className="text-rose-400 text-xs">100%</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Suppuration:</span>
                      <strong className="text-rose-400 text-xs">ACTIVE PUS</strong>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    <strong>Textbook Proof:</strong> Here, both severe past destruction and active acute inflammation coincide.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2: 3D PATHWAYS OF INFLAMMATION SANDBOX
          ========================================================================= */}
      {activeSection === 'pathways' && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              PDF Pages 2, 3, 4 • 3D Anatomical Sandbox
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              3D Interactive Pathways of Gingival Inflammation Spread
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Gingival inflammation extends along collagen fiber bundles and follows the course of blood vessels through loosely arranged tissue into alveolar bone.
            </p>
          </div>

          {/* Pathway Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setPathway3DMode('pathways_interproximal')}
              className={`flex-1 p-3.5 rounded-2xl border text-left transition ${
                pathway3DMode === 'pathways_interproximal'
                  ? 'bg-blue-600/25 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm">Pathway A: Interproximal Route (Vessel Channels)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Through transseptal fibers $\to$ bone crest $\to$ marrow $\to$ PDL</div>
            </button>

            <button
              onClick={() => setPathway3DMode('pathways_facial')}
              className={`flex-1 p-3.5 rounded-2xl border text-left transition ${
                pathway3DMode === 'pathways_facial'
                  ? 'bg-rose-600/25 border-rose-400 text-white shadow-lg ring-1 ring-rose-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm">Pathway B: Facial &amp; Lingual Route (Outer Periosteum)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Along outer periosteal surface $\to$ cortical cortex $\to$ marrow $\to$ PDL</div>
            </button>
          </div>

          {/* Embedded 3D Canvas with Glowing Animated Trails */}
          <BoneLoss3DCanvas defectType={pathway3DMode} height="480px" />

          {/* Anatomical Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-cyan-400 block">Step 1: Soft Tissue Migration</strong>
              <p className="text-slate-300 text-[11px]">
                Extends along collagen fiber bundles following the loose perivascular connective tissue sheath.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-amber-400 block">Step 2: Osseous Perforation</strong>
              <p className="text-slate-300 text-[11px]">
                Penetrates the bone through vessel channels at the center, side, or angle of the interdental crest.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-rose-400 block">Step 3: Internal Marrow Resorption</strong>
              <p className="text-slate-300 text-[11px]">
                Spreads into marrow spaces and may loop back into the periodontal ligament from within bone.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3: MICROSCOPIC HISTOPATHOLOGY (2D INTERACTIVE MICROSCOPE)
          ========================================================================= */}
      {activeSection === 'histopathology' && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              PDF Pages 4 &amp; 5 • Virtual Microscopic Stage
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Virtual Microscopic Histopathology: How Living Bone Resorbs
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Inspect cellular events inside the marrow spaces. Click structures to analyze their histopathological role.
            </p>
          </div>

          {/* Virtual Microscope Controls & Viewport */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Microscope Objective Lens:
                </span>
                <div className="flex gap-1">
                  {(['10x', '40x', '100x'] as const).map((z) => (
                    <button
                      key={z}
                      onClick={() => setVirtualZoom(z)}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold transition ${
                        virtualZoom === z
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs font-mono text-slate-400">
                Staining: Hematoxylin &amp; Eosin (H&amp;E) Autopsy Human Section
              </span>
            </div>

            {/* 2D Interactive Microscopic Graphic Canvas */}
            <div className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center select-none shadow-inner">
              <svg viewBox="0 0 600 320" className="w-full h-full">
                {/* Bone Trabeculae Plates */}
                <path
                  d="M 20,40 Q 140,50 180,140 Q 220,260 340,280 L 360,320 L 0,320 L 0,0 Z"
                  fill="#78350f"
                  opacity="0.85"
                />
                <path
                  d="M 400,0 Q 450,110 520,130 Q 580,150 600,80 L 600,0 Z"
                  fill="#78350f"
                  opacity="0.85"
                />

                {/* Howship's Lacunae scalloped bays */}
                <path
                  d="M 180,140 Q 195,155 185,175 Q 200,190 190,210 Q 210,225 200,245"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="4,2"
                />

                {/* Hotspot 1: Multinucleated Osteoclast in Howship Lacuna */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedHistologyHotspot('osteoclast')}
                >
                  <circle cx="215" cy="180" r="28" fill="#e11d48" opacity="0.85" />
                  {/* Multiple nuclei */}
                  <circle cx="205" cy="175" r="4" fill="#881337" />
                  <circle cx="215" cy="170" r="4" fill="#881337" />
                  <circle cx="225" cy="178" r="4" fill="#881337" />
                  <circle cx="215" cy="190" r="4" fill="#881337" />
                  <circle cx="208" cy="188" r="3.5" fill="#881337" />
                  <text x="215" y="222" fill="#fda4af" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Osteoclast
                  </text>
                </g>

                {/* Hotspot 2: Marrow Spaces & Leukocytic Exudate */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedHistologyHotspot('marrow')}
                >
                  <rect x="260" y="50" width="120" height="90" rx="12" fill="#0f172a" opacity="0.7" stroke="#38bdf8" strokeDasharray="3,3" />
                  {/* Floating leukocytes / PMNs */}
                  <circle cx="280" cy="70" r="5" fill="#38bdf8" />
                  <circle cx="300" cy="85" r="4" fill="#818cf8" />
                  <circle cx="330" cy="75" r="5" fill="#38bdf8" />
                  <circle cx="310" cy="110" r="4.5" fill="#c084fc" />
                  <circle cx="345" cy="105" r="5" fill="#38bdf8" />
                  <text x="320" y="130" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Leukocytic Exudate
                  </text>
                </g>

                {/* Hotspot 3: Proliferating Fibroblasts & Capillaries */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedHistologyHotspot('fibroblasts')}
                >
                  {/* Capillary loop */}
                  <path d="M 420,180 Q 450,220 480,180" fill="none" stroke="#ef4444" strokeWidth="4" />
                  <circle cx="450" cy="200" r="3" fill="#fee2e2" />
                  <text x="450" y="240" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle">
                    New Capillaries &amp; Fibroblasts
                  </text>
                </g>
              </svg>
            </div>

            {/* Selected Hotspot Explanation Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              {selectedHistologyHotspot === 'osteoclast' && (
                <div>
                  <strong className="text-amber-300 block text-sm">
                    Multinucleated Osteoclasts in Howship Lacunae (PDF Page 4)
                  </strong>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    Multinuclear osteoclasts and mononuclear phagocytes increase substantially in number.
                    Bone surfaces appear directly lined with <strong>Howship lacunae</strong> (resorption pits).
                    Resorption proceeds from within the marrow spaces, causing progressive thinning of surrounding bony trabeculae.
                  </p>
                </div>
              )}
              {selectedHistologyHotspot === 'marrow' && (
                <div>
                  <strong className="text-cyan-300 block text-sm">
                    Marrow Space Replacement by Leukocytic Exudate (PDF Page 4 &amp; 5)
                  </strong>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    Extensive inflammatory infiltrate invades from both mesial and distal aspects.
                    Normal physiological fatty bone marrow is completely replaced by a leukocytic and fluid exudate, new blood vessels, and proliferating fibroblasts.
                  </p>
                </div>
              )}
              {selectedHistologyHotspot === 'fibroblasts' && (
                <div>
                  <strong className="text-rose-300 block text-sm">
                    Capillary Neo-Angiogenesis &amp; Proliferating Fibroblasts (PDF Page 4)
                  </strong>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    Vascular permeability increases with rapid sprouting of new blood vessel loops into the marrow spaces.
                    Enlargement of marrow spaces leads to destruction of bone and overall reduction in bone height.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: 3D CELLULAR MECHANISMS & MOLECULAR CASCADES
          ========================================================================= */}
      {activeSection === 'mechanisms' && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              PDF Page 7 • 3D Cellular Sandbox &amp; Cytokine Cascade
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Cellular Mechanisms: Dual Bacterial &amp; Host Pathways
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Bacterial biofilm products stimulate host cells to release inflammatory mediators that recruit osteoclasts while directly inhibiting osteoblasts!
            </p>
          </div>

          {/* Interactive Cytokine Trigger Panel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'lps', label: 'Bacterial Biofilm LPS', desc: 'Direct osteoclastogenesis & osteoblast inhibition' },
              { id: 'il1', label: 'Interleukin-1 (IL-1α / IL-1β)', desc: 'Potent bone resorption stimulant' },
              { id: 'tnf', label: 'Tumor Necrosis Factor (TNF-α)', desc: 'Synergistic osteoclast activator' },
              { id: 'pge2', label: 'Prostaglandins (PGE2)', desc: 'Vasodilation & osteoclastic differentiation' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCytokine(c.id as any)}
                className={`p-3 rounded-2xl border text-left transition ${
                  selectedCytokine === c.id
                    ? 'bg-amber-600/30 border-amber-400 text-white ring-1 ring-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">{c.label}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.desc}</div>
              </button>
            ))}
          </div>

          {/* 3D Model demonstrating bone resorption */}
          <BoneLoss3DCanvas defectType="vertical" height="420px" />

          {/* Seymour T vs B Lymphocyte Progression Graphic */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block font-mono">
              Seymour et al. Cellular Evolution: Contained vs. Progressive Lesion (PDF Page 3)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-900">
                <strong className="text-cyan-300 block mb-1">Stage 1: "Contained" Gingivitis</strong>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  <strong>T lymphocytes</strong> predominate. The inflammatory lesion is contained within the gingival connective tissue with minimal bone breakdown.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900">
                <strong className="text-rose-300 block mb-1">Stage 2: Destructive Periodontitis</strong>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Converts to a <strong>B-lymphocyte &amp; plasma cell lesion</strong>. Recurrent episodes of acute destruction trigger progressive irreversible bone loss!
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5: RADIUS OF ACTION (2D INTERACTIVE)
          ========================================================================= */}
      {activeSection === 'radius' && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              PDF Page 5 • The 1.5 mm to 2.5 mm Rule
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Radius of Action &amp; Interdental Space Geometry
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Page and Schroeder postulated a range of effectiveness of about 1.5 mm to 2.5 mm in which bacterial biofilm can induce bone loss.
            </p>
          </div>

          {/* Interactive Distance Caliper & Dynamic SVG Demonstration */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Ruler className="w-4 h-4 text-cyan-400" />
                Interdental Septum Width: {interdentalWidth.toFixed(1)} mm
              </span>
              <button
                onClick={() => setIsAggressiveCase(!isAggressiveCase)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition border ${
                  isAggressiveCase
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {isAggressiveCase ? 'Aggressive Periodontitis (Bacteria in Tissue >2.5mm)' : 'Chronic Radius (<2.5mm)'}
              </button>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="1.0"
                max="4.5"
                step="0.1"
                value={interdentalWidth}
                onChange={(e) => setInterdentalWidth(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1.0 mm (Narrow Septum)</span>
                <span className="text-amber-400 font-bold">2.5 mm (Critical Threshold)</span>
                <span>4.5 mm (Wide Molar Septum)</span>
              </div>
            </div>

            {/* 2D SVG Diagram showing overlapping vs non-overlapping radiation zones */}
            <div className="w-full h-[200px] bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden select-none">
              <svg viewBox="0 0 500 180" className="w-full h-full">
                {/* Tooth 1 Root */}
                <rect x="80" y="20" width="50" height="150" fill="#dec08f" stroke="#b45309" strokeWidth="2" rx="4" />
                <text x="105" y="100" fill="#78350f" fontSize="10" fontWeight="bold" textAnchor="middle">Tooth 1</text>

                {/* Tooth 2 Root (moves dynamically based on interdentalWidth) */}
                <g transform={`translate(${interdentalWidth * 55}, 0)`}>
                  <rect x="190" y="20" width="50" height="150" fill="#dec08f" stroke="#b45309" strokeWidth="2" rx="4" />
                  <text x="215" y="100" fill="#78350f" fontSize="10" fontWeight="bold" textAnchor="middle">Tooth 2</text>
                </g>

                {/* Biofilm radiation aura 1 */}
                <rect x="130" y="30" width="70" height="130" fill="#ef4444" opacity="0.35" rx="6" />

                {/* Biofilm radiation aura 2 */}
                <g transform={`translate(${interdentalWidth * 55}, 0)`}>
                  <rect x="120" y="30" width="70" height="130" fill="#ef4444" opacity="0.35" rx="6" />
                </g>

                {/* Central preserved bone island if width > 2.5 mm */}
                {interdentalWidth > 2.5 && (
                  <rect
                    x={200}
                    y={60}
                    width={Math.max(10, (interdentalWidth - 2.5) * 50)}
                    height={110}
                    fill="#e2d6b5"
                    stroke="#a16207"
                    strokeWidth="1.5"
                    rx="4"
                  />
                )}
              </svg>
            </div>

            {/* Dynamic Clinical Conclusion */}
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                interdentalWidth > 2.5
                  ? 'bg-purple-950/40 border-purple-800 text-purple-200'
                  : 'bg-blue-950/40 border-cyan-800 text-cyan-200'
              }`}
            >
              <strong className="block text-sm mb-1">
                {interdentalWidth > 2.5 ? 'Vertical (Angular) Defect Formed!' : 'Horizontal Bone Loss Formed!'}
              </strong>
              <p>
                {interdentalWidth > 2.5
                  ? `Because the interdental septum (${interdentalWidth.toFixed(1)} mm) exceeds the 2.5 mm threshold, the 1.5–2.5 mm biofilm action zones do not meet in the center. An unresorbed central bone core is preserved, resulting in an angular, trough-like infrabony defect!`
                  : `Because the interdental septum (${interdentalWidth.toFixed(1)} mm) is narrower than 2.5 mm, the bacterial biofilm radius of action from both tooth surfaces overlaps completely, destroying the entire bone crest in a flat horizontal fashion!`}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 6: RATES OF BONE LOSS TIME-LAPSE (2D INTERACTIVE)
          ========================================================================= */}
      {activeSection === 'rates' && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              PDF Page 6 • Löe and Colleagues 20-Year Natural History Study
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Time-Lapse Simulator: The Three Sri Lankan Bone Loss Subgroups
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Scrub the timeline from 1 to 25 years to watch the cumulative attachment loss and tooth mortality across the three natural history cohorts.
            </p>
          </div>

          {/* Time scrubber */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-white font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Simulated Follow-up Duration:
              </span>
              <span className="text-lg font-black text-amber-400">{simulatedYears} Years</span>
            </div>

            <input
              type="range"
              min="1"
              max="25"
              value={simulatedYears}
              onChange={(e) => setSimulatedYears(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Year 1</span>
              <span>Year 10</span>
              <span>Year 25</span>
            </div>

            {/* Three Cohorts Cumulative Loss Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {/* Group 1: Rapid */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-rose-300">Group 1: Rapid</span>
                  <span className="text-base font-black text-white">8%</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">0.1 mm to 1.0 mm / year</div>
                <div className="text-2xl font-black text-rose-400 font-mono">
                  {(simulatedYears * 0.75).toFixed(1)} mm lost
                </div>
                <p className="text-[11px] text-slate-300">
                  {simulatedYears >= 12
                    ? '⚠️ Severe tooth mortality! Most molars lost by this time.'
                    : 'Rapid continuous periodontal ligament destruction.'}
                </p>
              </div>

              {/* Group 2: Moderate */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-cyan-300">Group 2: Moderate</span>
                  <span className="text-base font-black text-white">81%</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">0.05 mm to 0.5 mm / year</div>
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {(simulatedYears * 0.25).toFixed(1)} mm lost
                </div>
                <p className="text-[11px] text-slate-300">
                  Represents the vast majority of regular clinical periodontitis cases.
                </p>
              </div>

              {/* Group 3: Minimal */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-emerald-300">Group 3: Minimal</span>
                  <span className="text-base font-black text-white">11%</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">0.05 mm to 0.09 mm / year</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {(simulatedYears * 0.07).toFixed(1)} mm lost
                </div>
                <p className="text-[11px] text-slate-300">
                  Minimal destructive progression despite persistent plaque presence.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 7: 3D OCCLUSAL TRAUMA & SYSTEMIC SANDBOX
          ========================================================================= */}
      {activeSection === 'tfo_systemic' && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              PDF Pages 7 &amp; 8 • 3D Biomechanical Occlusal Simulation
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Trauma From Occlusion: Primary vs. Secondary with Periodontitis
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Toggle plaque status to see why occlusal forces in health cause reversible bone changes without pockets, but in periodontitis cause bizarre destruction.
            </p>
          </div>

          {/* TFO Toggle Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setTfoHasPlaque(false)}
              className={`flex-1 p-3.5 rounded-2xl border text-left transition ${
                !tfoHasPlaque
                  ? 'bg-emerald-600/25 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm">In Absence of Inflammation (No Plaque)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Reversible angular defect WITHOUT pocket formation</div>
            </button>

            <button
              onClick={() => setTfoHasPlaque(true)}
              className={`flex-1 p-3.5 rounded-2xl border text-left transition ${
                tfoHasPlaque
                  ? 'bg-rose-600/25 border-rose-400 text-white shadow-lg ring-1 ring-rose-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm">In Presence of Periodontitis (With Plaque)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Aggravates bone destruction $\to$ Bizarre bone patterns</div>
            </button>
          </div>

          {/* 3D Canvas showing directional load vector */}
          <BoneLoss3DCanvas defectType={tfoHasPlaque ? 'occlusal_trauma_plaque' : 'occlusal_trauma'} height="460px" />

          {/* Systemic Conditions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-amber-300 block">Osteoporosis (Postmenopausal Women):</strong>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Loss of bone mineral content; relationship between skeletal density and oral bone density; residual ridge resorption and tooth mobility.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-cyan-300 block">Generalized Skeletal Disturbances:</strong>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Hyperthyroidism, Leukemia, and Langerhans cell histiocytosis.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 8: 3D BONE MORPHOLOGY DETERMINANTS SANDBOX
          ========================================================================= */}
      {activeSection === 'morphology_factors' && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              PDF Pages 8 &amp; 9 • 3D Anatomical Variants
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Factors Determining Bone Morphology: 3D Anatomical Showcase
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Inspect thin vs. thick plates, exostoses (40% skulls), buttressing bone formation (central vs. peripheral lipping), and reversed architecture.
            </p>
          </div>

          {/* Morphologic variant selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'thin_plate', label: 'Thin Plates', sub: 'Horizontal Loss' },
              { id: 'exostoses', label: 'Exostoses (40%)', sub: 'Palatal Outgrowths' },
              { id: 'buttressing_peripheral', label: 'Buttressing Bone', sub: 'Peripheral Lipping' },
              { id: 'reversed_arch', label: 'Reversed Arch.', sub: 'Inconsistent Margin' },
              { id: 'ledges', label: 'Ledges', sub: 'Plateau Margin' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMorphology3DType(m.id as any)}
                className={`p-3 rounded-2xl border text-left transition ${
                  morphology3DType === m.id
                    ? 'bg-amber-600/30 border-amber-400 text-white ring-1 ring-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">{m.label}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{m.sub}</div>
              </button>
            ))}
          </div>

          <BoneLoss3DCanvas defectType={morphology3DType as any} height="460px" />
        </section>
      )}
    </div>
  );
};
