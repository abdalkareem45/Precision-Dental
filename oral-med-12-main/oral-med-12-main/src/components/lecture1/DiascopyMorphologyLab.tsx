import React, { useState, useRef, useEffect } from 'react';
import {
  LECTURE_1_MORPHOLOGY,
  LECTURE_1_ULCER_CLASSIFICATION,
  LesionMorphology
} from '../../data/lecture1Data';
import {
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  Sliders,
  SplitSquareVertical,
  Activity,
  ArrowRight,
  ShieldAlert,
  Clock,
  RotateCcw,
  Zap,
  Split,
  ChevronRight,
  Stethoscope,
  Info
} from 'lucide-react';

export const DiascopyMorphologyLab: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('macule');
  // Continuous pressure level from 0 to 100%
  const [pressurePercent, setPressurePercent] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [purpuraSizeCm, setPurpuraSizeCm] = useState<number>(0.2);
  const [splitViewMode, setSplitViewMode] = useState<boolean>(false);

  // Pressure press-and-hold interval ref
  const holdIntervalRef = useRef<number | null>(null);

  // Ulcer classification interactive view state
  const [selectedUlcerCategory, setSelectedUlcerCategory] = useState<'acute-multiple' | 'chronic-multiple' | 'recurring' | 'single'>('acute-multiple');
  const [interactiveTab, setInteractiveTab] = useState<'decision-tree' | 'oral-map' | 'comparison-matrix'>('oral-map');

  // Decision Tree interactive state
  const [treeDuration, setTreeDuration] = useState<'acute' | 'chronic' | 'recurrent' | 'single'>('acute');
  const [treeTissueType, setTreeTissueType] = useState<'both' | 'keratinized' | 'non-keratinized' | 'solitary'>('both');
  const [treeProdrome, setTreeProdrome] = useState<boolean>(true);

  // Selected anatomical oral map zone
  const [selectedOralZone, setSelectedOralZone] = useState<string>('all');

  const activeLesion = LECTURE_1_MORPHOLOGY.find((m) => m.id === selectedId) || LECTURE_1_MORPHOLOGY[0];

  // Purpura subclassification based on slide 3
  const getPurpuraSubclass = (size: number) => {
    if (size < 0.3) {
      return {
        label: 'Petechiae',
        criteria: '< 0.3 cm diameter (pinpoint extravasation)',
        color: 'text-rose-400 bg-rose-950/60 border-rose-800'
      };
    } else if (size <= 0.9) {
      return {
        label: 'Purpura',
        criteria: '0.4 – 0.9 cm diameter (intermediate extravasation)',
        color: 'text-purple-400 bg-purple-950/60 border-purple-800'
      };
    } else {
      return {
        label: 'Ecchymosis',
        criteria: '> 1.0 cm diameter (large extravasated pool)',
        color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800'
      };
    }
  };

  const purpuraSubclass = getPurpuraSubclass(purpuraSizeCm);

  // Computed compression dynamics
  const compressionRatio = pressurePercent / 100;
  const isVascularErythema = selectedId === 'macule';
  const isPurpuric = selectedId === 'purpura';

  // Toggle glass lock
  const handleToggleLock = () => {
    if (isLocked) {
      setIsLocked(false);
      setPressurePercent(0);
    } else {
      setIsLocked(true);
      setPressurePercent(100);
    }
  };

  // Press & Hold Handlers for smooth tactile glass compression without blocking view
  const handleStartHold = () => {
    if (isLocked) setIsLocked(false);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    holdIntervalRef.current = window.setInterval(() => {
      setPressurePercent((prev) => {
        if (prev >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          return 100;
        }
        return Math.min(100, prev + 12);
      });
    }, 40);
  };

  const handleEndHold = () => {
    if (isLocked) return;
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    holdIntervalRef.current = window.setInterval(() => {
      setPressurePercent((prev) => {
        if (prev <= 0) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          return 0;
        }
        return Math.max(0, prev - 15);
      });
    }, 30);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold">
              Lecture 1 · Slides 2–5
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Clinical Lesion Morphology & Diascopy Blanching Lab
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Interactive histological profiles, clear-glass slide pressure mechanics, and 4-part clinical ulcer classification simulator.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Board Rubric:</span>
          <span className="text-teal-400 font-bold">10 Classes + Diascopy Mechanics</span>
        </div>
      </div>

      {/* Grid: Morphology Selector & Interactive Specimen Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 10 Morphology Class Buttons (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Lesion Classification (10)
            </span>
            <span className="text-[10px] font-mono text-slate-400">Select to Test</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 max-h-[460px] overflow-y-auto pr-1">
            {LECTURE_1_MORPHOLOGY.map((lesion) => {
              const isSelected = selectedId === lesion.id;
              return (
                <button
                  key={lesion.id}
                  onClick={() => {
                    setSelectedId(lesion.id);
                    setPressurePercent(0);
                    setIsLocked(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-teal-950/90 border-teal-500 text-teal-200 shadow-md ring-1 ring-teal-500 font-bold'
                      : 'bg-slate-950/60 border-slate-850 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        lesion.category === 'vascular'
                          ? 'bg-rose-500'
                          : lesion.category === 'secondary'
                          ? 'bg-amber-400'
                          : 'bg-teal-400'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-xs">{lesion.name}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                        {lesion.clinicalExample}
                      </div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Educational Callout */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="text-teal-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diascopy Principle (Slide 3):</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Applying firm pressure with a clean glass slide compresses intravascular capillaries, forcing blood out and causing true erythema to blanch white. Extravasated blood (purpura) cannot be compressed away!
            </p>
          </div>
        </div>

        {/* Right Column: Crystal-Clear Transparent Glass Slide Simulation (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header with Diagnostic Readout Banner */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">{activeLesion.name} Cross-Section</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Slide {activeLesion.slidesRef.join(', ')}
                </span>
              </div>

              {/* Status Badge in Header - Never Blocks the Specimen! */}
              <div
                className={`text-xs font-mono px-3 py-1 rounded-lg border font-bold transition-colors ${
                  compressionRatio > 0.4
                    ? isPurpuric
                      ? 'bg-rose-950 text-rose-300 border-rose-600'
                      : isVascularErythema
                      ? 'bg-amber-950 text-amber-300 border-amber-600'
                      : 'bg-teal-950 text-teal-300 border-teal-600'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {compressionRatio > 0.4
                  ? isPurpuric
                    ? 'DIASCOPY NEGATIVE (DOES NOT BLANCH · EXTRAVASATED RBCs)'
                    : isVascularErythema
                    ? 'DIASCOPY POSITIVE (BLANCHES PALE WHITE · INTRAVASCULAR)'
                    : 'COMPRESSION IN PROGRESS'
                  : 'DIASCOPY: READY (0% PRESSURE)'}
              </div>
            </div>

            {/* Visual Canvas: Crystal-Clear Transparent Glass Slide & Reactive Mucosa */}
            <div className="relative p-6 bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center min-h-[300px] overflow-hidden select-none">
              
              {/* TOP PHYSICAL GLASS SLIDE APPARATUS - DESCENDS DOWN WITHOUT OBSCURING CENTER */}
              <div
                style={{
                  transform: `translateY(${Math.min(32, compressionRatio * 32)}px)`,
                  transition: 'transform 100ms ease-out',
                }}
                className="w-full max-w-lg mb-2 relative pointer-events-none"
              >
                {/* Physical Glass Slide Bevel Bar */}
                <div className="h-6 rounded-lg border-2 border-sky-300/80 bg-sky-200/10 backdrop-blur-[0px] shadow-[0_4px_25px_rgba(56,189,248,0.25)] flex items-center justify-between px-3">
                  <span className="text-[10px] font-mono font-bold text-sky-200 tracking-wider">
                    🔬 Crystal-Clear Glass Slide ({Math.round(compressionRatio * 100)}% Pressure Applied)
                  </span>
                  <span className="text-[9px] font-mono text-sky-300/80">
                    {compressionRatio > 0.8 ? '● FIRM CONTACT' : compressionRatio > 0.2 ? '◐ PARTIAL CONTACT' : '○ REST'}
                  </span>
                </div>
                {/* Visual downward force vectors */}
                {compressionRatio > 0.2 && (
                  <div className="flex justify-around text-sky-400/80 text-[10px] mt-0.5 animate-pulse font-mono">
                    <span>↓ Firm Glass Compression ↓</span>
                    <span>↓ Continuous Direct Pressure ↓</span>
                  </div>
                )}
              </div>

              {/* Dynamic SVG Histological Profile with 100% Unobscured Visuals */}
              <svg viewBox="0 0 500 200" className="w-full max-w-lg h-48 drop-shadow-2xl">
                <defs>
                  <linearGradient id="mucosaBaseLec1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#db2777" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#831843" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="fluidBlisterLec1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                {/* Connective Tissue Lamina Propria Base */}
                <rect x="20" y="125" width="460" height="65" rx="6" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
                <text x="30" y="175" fill="#818cf8" fontSize="10" fontFamily="monospace">
                  Lamina Propria Connective Tissue Stroma
                </text>

                {/* Submucosal Blood Vessels for Macule / Erythema */}
                {selectedId === 'macule' && (
                  <g>
                    {/* Capillary lumen shrinks as pressure rises! */}
                    {[190, 240, 290, 340].map((vx, idx) => {
                      const radius = Math.max(0.5, 7.5 * (1 - compressionRatio));
                      return (
                        <circle
                          key={idx}
                          cx={vx}
                          cy={145}
                          r={radius}
                          fill={compressionRatio > 0.6 ? '#64748b' : '#ef4444'}
                          opacity={Math.max(0.2, 1 - compressionRatio * 0.8)}
                          stroke={compressionRatio > 0.6 ? '#475569' : '#b91c1c'}
                          strokeWidth="1"
                        />
                      );
                    })}
                    <path
                      d="M 170 145 Q 260 155 360 145"
                      stroke={compressionRatio > 0.6 ? '#475569' : '#ef4444'}
                      strokeWidth={Math.max(1, 4 * (1 - compressionRatio))}
                      fill="none"
                      strokeDasharray={compressionRatio > 0.5 ? '4 4' : 'none'}
                    />
                    <text x="260" y="165" fill={compressionRatio > 0.6 ? '#94a3b8' : '#f87171'} fontSize="9" fontFamily="monospace" textAnchor="middle">
                      {compressionRatio > 0.6
                        ? 'Capillaries Compressed Empty (Intravascular Blood Expressed!)'
                        : 'Intact Capillaries Engorged with Red Blood Cells'}
                    </text>
                  </g>
                )}

                {/* Extravasated Blood Pools for Purpura / Petechiae / Ecchymosis */}
                {selectedId === 'purpura' && (
                  <g>
                    {/* Leaked red blood cells in stroma - CANNOT BE EXPRESSED BY GLASS! */}
                    {[170, 190, 210, 230, 250, 270, 290, 310, 330].map((x, idx) => (
                      <circle
                        key={idx}
                        cx={x + (idx % 2 === 0 ? 6 : -6)}
                        cy={138 + (idx % 3) * 7}
                        r={Math.min(6.5, 3 + purpuraSizeCm * 2)}
                        fill="#be123c"
                        stroke="#881337"
                        strokeWidth="1.2"
                        opacity="0.95"
                      />
                    ))}
                    <text x="250" y="165" textAnchor="middle" fill="#fda4af" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      Extravasated RBCs Trapped in Stroma (NEVER Blanches on Glass Slide!)
                    </text>
                  </g>
                )}

                {/* Normal Mucosa Baseline */}
                <path d="M 20 120 L 150 120" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" />
                <path d="M 350 120 L 480 120" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" />

                {/* Dynamic Lesion Surface Profile */}
                {selectedId === 'macule' && (
                  <g>
                    {/* Mucosal surface transitions from bright red to pale white/ivory as pressure increases! */}
                    <path
                      d="M 150 120 L 350 120"
                      stroke={
                        compressionRatio > 0.7
                          ? '#f8fafc' // Pale blanched white!
                          : compressionRatio > 0.3
                          ? '#fbcfe8'
                          : '#ef4444' // Vascular red
                      }
                      strokeWidth={6}
                      strokeLinecap="round"
                      className="transition-colors duration-200"
                    />
                    <text
                      x="250"
                      y="105"
                      textAnchor="middle"
                      fill={compressionRatio > 0.6 ? '#f8fafc' : '#f87171'}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {compressionRatio > 0.6
                        ? '✨ BLANCHED PALE WHITE (Diascopy Positive: Intravascular Capillaries Emptied)'
                        : 'Vascular Macular Erythema (Active Capillary Hyperemia)'}
                    </text>
                  </g>
                )}

                {selectedId === 'papule' && (
                  <g>
                    <path
                      d={`M 150 120 Q 250 ${50 + compressionRatio * 30} 350 120`}
                      fill="url(#mucosaBaseLec1)"
                      stroke="#f43f5e"
                      strokeWidth="4"
                    />
                    <text x="250" y="75" textAnchor="middle" fill="#fbcfe8" fontSize="11" fontWeight="bold">
                      Solid Raised Papule (&lt; 1.0 cm diameter)
                    </text>
                  </g>
                )}

                {selectedId === 'plaque' && (
                  <g>
                    <path
                      d={`M 140 120 L 160 ${70 + compressionRatio * 20} L 340 ${70 + compressionRatio * 20} L 360 120 Z`}
                      fill="url(#mucosaBaseLec1)"
                      stroke="#f43f5e"
                      strokeWidth="4"
                    />
                    <text x="250" y="60" textAnchor="middle" fill="#fbcfe8" fontSize="11" fontWeight="bold">
                      Elevated Plateau Plaque (&gt; 1.0 cm diameter)
                    </text>
                  </g>
                )}

                {selectedId === 'nodule' && (
                  <g>
                    <path
                      d={`M 130 120 Q 250 ${30 + compressionRatio * 25} 370 120`}
                      fill="url(#mucosaBaseLec1)"
                      stroke="#f43f5e"
                      strokeWidth="5"
                    />
                    <text x="250" y="45" textAnchor="middle" fill="#fbcfe8" fontSize="11" fontWeight="bold">
                      Deep Submucosal Nodule (Firm Palpable Mass)
                    </text>
                  </g>
                )}

                {selectedId === 'vesicle' && (
                  <g>
                    <path
                      d={`M 170 120 Q 250 ${35 + compressionRatio * 30} 330 120 Z`}
                      fill="url(#fluidBlisterLec1)"
                      stroke="#38bdf8"
                      strokeWidth="3"
                    />
                    <text x="250" y="65" textAnchor="middle" fill="#bae6fd" fontSize="11" fontWeight="bold">
                      Vesicle: Clear Fluid Blister (&lt; 1.0 cm)
                    </text>
                  </g>
                )}

                {selectedId === 'bulla' && (
                  <g>
                    <path
                      d={`M 140 120 Q 250 ${15 + compressionRatio * 35} 360 120 Z`}
                      fill="url(#fluidBlisterLec1)"
                      stroke="#38bdf8"
                      strokeWidth="3"
                    />
                    <text x="250" y="55" textAnchor="middle" fill="#bae6fd" fontSize="11" fontWeight="bold">
                      Bulla: Large Clear Fluid Blister (&gt; 1.0 cm)
                    </text>
                  </g>
                )}

                {selectedId === 'erosion' && (
                  <g>
                    <path
                      d="M 160 120 Q 250 135 340 120"
                      stroke="#dc2626"
                      strokeWidth="4"
                      fill="#7f1d1d"
                      fillOpacity="0.5"
                    />
                    <text x="250" y="105" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">
                      Shallow Red Erosion (Partial Epithelial Loss; No Thick Fibrin)
                    </text>
                  </g>
                )}

                {selectedId === 'pustule' && (
                  <g>
                    <path
                      d={`M 180 120 Q 250 ${45 + compressionRatio * 20} 320 120 Z`}
                      fill="#fef08a"
                      stroke="#ca8a04"
                      strokeWidth="3"
                    />
                    <text x="250" y="75" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold">
                      Pustule: Purulent Exudate Blister (Appears Yellow)
                    </text>
                  </g>
                )}

                {selectedId === 'ulcer' && (
                  <g>
                    <path
                      d="M 150 120 Q 180 160 250 160 Q 320 160 350 120"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      fill="#78350f"
                    />
                    <path
                      d="M 175 135 Q 250 165 325 135 Z"
                      fill="#fef3c7"
                      stroke="#d97706"
                      strokeWidth="2"
                    />
                    <text x="250" y="110" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold">
                      Depressed Ulcer Covered by Yellow-White Fibrin Clot
                    </text>
                  </g>
                )}

                {selectedId === 'purpura' && (
                  <g>
                    {/* The purpura color DOES NOT CHANGE under pressure! */}
                    <path
                      d="M 150 120 L 350 120"
                      stroke="#be123c"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <text x="250" y="100" textAnchor="middle" fill="#fda4af" fontSize="11" fontWeight="bold">
                      {purpuraSubclass.label} (Dark Purple Extravasated RBCs · IMMUTABLE)
                    </text>
                  </g>
                )}
              </svg>

              {/* TACTILE PRESS & HOLD GLASS SLIDE BUTTON + SLIDER CONTROLS */}
              <div className="w-full max-w-md mt-4 p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <Sliders className="w-4 h-4 text-sky-400" />
                    <span>Glass Slide Compression: {pressurePercent}%</span>
                  </div>
                  <button
                    onClick={handleToggleLock}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                      isLocked
                        ? 'bg-sky-500 text-slate-950 border-sky-400 shadow'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {isLocked ? '🔒 Lock Firm: ON' : '🔓 Lock Firm: OFF'}
                  </button>
                </div>

                {/* Tactile Press & Hold Button (Direct Touch / Click with zero obstruction) */}
                <button
                  onMouseDown={handleStartHold}
                  onMouseUp={handleEndHold}
                  onMouseLeave={handleEndHold}
                  onTouchStart={handleStartHold}
                  onTouchEnd={handleEndHold}
                  className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs transition-all border flex items-center justify-center gap-2 select-none active:scale-[0.98] ${
                    pressurePercent > 50
                      ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                      : 'bg-sky-950/80 hover:bg-sky-900 text-sky-200 border-sky-700/80'
                  }`}
                >
                  <span className="text-base">🖐️</span>
                  <span>PRESS & HOLD GLASS SLIDE (Hold to Compress · Release to Recoil)</span>
                </button>

                {/* Continuous Pressure Slider */}
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[10px] font-mono text-slate-500">0% (Rest)</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={pressurePercent}
                    onChange={(e) => {
                      setPressurePercent(parseInt(e.target.value));
                      setIsLocked(parseInt(e.target.value) === 100);
                    }}
                    className="flex-1 accent-sky-400 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-sky-400 font-bold">100% (Firm)</span>
                </div>
              </div>
            </div>

            {/* If Purpura is Selected, provide size slider */}
            {selectedId === 'purpura' && (
              <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-rose-400" />
                    <span>Slide 3: Purpura Classification by Size</span>
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${purpuraSubclass.color}`}>
                    {purpuraSubclass.label}: {purpuraSubclass.criteria}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0.1"
                    max="2.5"
                    step="0.1"
                    value={purpuraSizeCm}
                    onChange={(e) => setPurpuraSizeCm(parseFloat(e.target.value))}
                    className="flex-1 accent-rose-500 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-rose-300 font-bold w-16 text-right">
                    {purpuraSizeCm.toFixed(1)} cm
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className={`p-2 rounded-lg border text-center ${purpuraSizeCm < 0.3 ? 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                    Petechiae (&lt; 0.3 cm)
                  </div>
                  <div className={`p-2 rounded-lg border text-center ${purpuraSizeCm >= 0.4 && purpuraSizeCm <= 0.9 ? 'bg-purple-950/80 border-purple-500 text-purple-200 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                    Purpura (0.4 – 0.9 cm)
                  </div>
                  <div className={`p-2 rounded-lg border text-center ${purpuraSizeCm > 1.0 ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                    Ecchymosis (&gt; 1.0 cm)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ENHANCED INTERACTIVE CLINICAL CLASSIFICATION OF ULCERATIVE LESIONS (SLIDES 4–5) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span className="text-[11px] font-mono text-teal-400 font-bold uppercase">
                Slides 4–5 · Interactive Clinical Algorithm & Oral Mapping Lab
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Clinical Classification of Oral Ulcerative Lesions
            </h3>
            <p className="text-xs text-slate-400">
              Interactive 4-category diagnostic decision tree, comprehensive anatomical oral mapping, and disease comparator.
            </p>
          </div>

          {/* Sub-view switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setInteractiveTab('oral-map')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                interactiveTab === 'oral-map' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ Anatomical Oral Map
            </button>
            <button
              onClick={() => setInteractiveTab('decision-tree')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                interactiveTab === 'decision-tree' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌲 Decision Tree Router
            </button>
            <button
              onClick={() => setInteractiveTab('comparison-matrix')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                interactiveTab === 'comparison-matrix' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 4-Category Matrix
            </button>
          </div>
        </div>

        {/* 4 Category Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            {
              id: 'acute-multiple' as const,
              title: '1. Acute Multiple Ulcers',
              duration: '< 14 days duration',
              hallmark: 'Sudden onset, viral prodrome, fever, multiple coalescing blisters & ulcers',
              badge: 'Focus of Lec 1 & 2',
              color: 'text-rose-400 border-rose-500/80 bg-rose-950/40',
            },
            {
              id: 'chronic-multiple' as const,
              title: '2. Chronic Multiple Ulcers',
              duration: '> 30 days duration',
              hallmark: 'Desquamative gingivitis, autoimmune vesiculobullous detachment lasting months',
              badge: 'Pemphigus/Pemphigoid',
              color: 'text-amber-400 border-amber-500/80 bg-amber-950/40',
            },
            {
              id: 'recurring' as const,
              title: '3. Recurring Oral Ulcers',
              duration: 'Periodic Cycles',
              hallmark: 'Episodic ulcers with healing intervals; strict anatomical tissue predilection',
              badge: 'Aphthae vs RIH',
              color: 'text-teal-400 border-teal-500/80 bg-teal-950/40',
            },
            {
              id: 'single' as const,
              title: '4. Single Ulcers',
              duration: 'Weeks to Months',
              hallmark: 'Solitary indurated ulcer, trauma vs carcinoma vs deep fungal vs CMV in AIDS',
              badge: 'SCC Rule-Out',
              color: 'text-indigo-400 border-indigo-500/80 bg-indigo-950/40',
            },
          ].map((cat) => {
            const isSelected = selectedUlcerCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedUlcerCategory(cat.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? `${cat.color} shadow-lg ring-2 ring-teal-500/30 font-bold`
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {cat.duration}
                    </span>
                    <span className="text-[10px] font-mono text-teal-400">{cat.badge}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{cat.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.hallmark}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* VIEW A: ANATOMICAL ORAL MAP EXPLORER */}
        {interactiveTab === 'oral-map' && (
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* SVG Oral Cavity Map demonstrating the pattern (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <svg viewBox="0 0 320 260" className="w-full max-w-[280px] h-56 drop-shadow-xl">
                {/* Lip Contour */}
                <path d="M 50 130 Q 160 70 270 130 Q 160 190 50 130 Z" fill="#4c0519" stroke="#9f1239" strokeWidth="2.5" />
                
                {/* Maxillary Dentition */}
                <path d="M 80 115 Q 160 95 240 115" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" fill="none" />
                {/* Mandibular Dentition */}
                <path d="M 80 145 Q 160 165 240 145" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" fill="none" />

                {/* Hard Palate (Keratinized) */}
                <ellipse cx="160" cy="80" rx="50" ry="25" fill="#1e1b4b" stroke="#4338ca" strokeWidth="1.5" />
                <text x="160" y="65" fill="#a5b4fc" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  Hard Palate (Keratinized)
                </text>

                {/* Attached Gingiva Bands */}
                <path d="M 80 108 Q 160 88 240 108" stroke="#be123c" strokeWidth="3" fill="none" opacity="0.6" />
                <path d="M 80 152 Q 160 172 240 152" stroke="#be123c" strokeWidth="3" fill="none" opacity="0.6" />

                {/* Buccal/Labial Mucosa (Non-Keratinized) */}
                <text x="45" y="155" fill="#64748b" fontSize="8" fontFamily="monospace">
                  Buccal/Labial
                </text>

                {/* Category 1: Acute Multiple Dots */}
                {selectedUlcerCategory === 'acute-multiple' && (
                  <g>
                    {[
                      [135, 75], [160, 80], [185, 75], [145, 95], [175, 95],
                      [90, 115], [230, 115], [120, 130], [200, 130], [160, 150],
                      [70, 130], [250, 130]
                    ].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="4" fill="#f43f5e" stroke="#ffe4e6" strokeWidth="1" className="animate-pulse" />
                    ))}
                    <text x="160" y="215" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Acute Multiple: Widespread on BOTH Keratinized & Non-Keratinized
                    </text>
                  </g>
                )}

                {/* Category 2: Chronic Multiple Dots */}
                {selectedUlcerCategory === 'chronic-multiple' && (
                  <g>
                    <path d="M 80 106 Q 160 86 240 106" stroke="#f59e0b" strokeWidth="6" fill="none" opacity="0.9" />
                    <path d="M 80 154 Q 160 174 240 154" stroke="#f59e0b" strokeWidth="6" fill="none" opacity="0.9" />
                    <text x="160" y="215" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Chronic: Desquamative Gingivitis Along Gingival Margins
                    </text>
                  </g>
                )}

                {/* Category 3: Recurring Ulcers */}
                {selectedUlcerCategory === 'recurring' && (
                  <g>
                    <circle cx="160" cy="80" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="1.5" />
                    <text x="160" y="95" fill="#6ee7b7" fontSize="7" textAnchor="middle" fontWeight="bold">
                      RIH (Keratinized Palate)
                    </text>
                    <circle cx="160" cy="155" r="5" fill="#06b6d4" stroke="#a5f3fc" strokeWidth="1.5" />
                    <text x="160" y="170" fill="#67e8f9" fontSize="7" textAnchor="middle" fontWeight="bold">
                      Aphthae (Non-Keratinized Labial)
                    </text>
                    <text x="160" y="215" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Recurring: Strict Tissue Predilections
                    </text>
                  </g>
                )}

                {/* Category 4: Single Ulcer */}
                {selectedUlcerCategory === 'single' && (
                  <g>
                    <circle cx="205" cy="125" r="9" fill="#dc2626" stroke="#fef08a" strokeWidth="2.5" />
                    <text x="160" y="215" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Single Ulcer: Solitary Indurated Crater (Mandates Biopsy!)
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Deep-Dive Clinical Differential & Management (7 cols) */}
            <div className="lg:col-span-7 space-y-3 text-xs">
              {selectedUlcerCategory === 'acute-multiple' && (
                <div className="space-y-2">
                  <span className="font-bold text-rose-300 text-xs uppercase block">
                    Category 1: The Patient with Acute Multiple Ulcers (Slide 5)
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    Sudden onset lasting &lt; 14 days, accompanied by viral prodrome, fever, and acute pain. Widespread presentation across both keratinized and non-keratinized mucosal surfaces.
                  </p>
                  <div className="p-3 bg-slate-900 rounded-xl border border-rose-900/40 text-slate-200 space-y-1">
                    <span className="font-bold text-rose-300">The 8 Official Diseases of Acute Multiple Ulcers:</span>
                    <p className="text-[11px] text-slate-300 font-mono">
                      1. HSV · 2. VZV · 3. CMV · 4. Coxsackie · 5. NUG/NUP · 6. Erythema Multiforme · 7. Stevens-Johnson / TEN · 8. Plasma Cell Stomatitis.
                    </p>
                  </div>
                </div>
              )}

              {selectedUlcerCategory === 'chronic-multiple' && (
                <div className="space-y-2">
                  <span className="font-bold text-amber-300 text-xs uppercase block">
                    Category 2: The Patient with Chronic Multiple Ulcers
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    Characterized by persistent desquamative gingivitis and vesiculobullous autoimmune detachment lasting beyond 30 days without spontaneous healing.
                  </p>
                  <div className="p-3 bg-slate-900 rounded-xl border border-amber-900/40 text-slate-200 space-y-1">
                    <span className="font-bold text-amber-300">Mandatory Autoimmune Biopsies:</span>
                    <p className="text-[11px] text-slate-300">
                      Pemphigus Vulgaris (suprabasilar acantholysis), Mucous Membrane Pemphigoid (subepithelial bullae with cicatricial scarring), and Erosive Lichen Planus (dense T-cell band).
                    </p>
                  </div>
                </div>
              )}

              {selectedUlcerCategory === 'recurring' && (
                <div className="space-y-2">
                  <span className="font-bold text-teal-300 text-xs uppercase block">
                    Category 3: The Patient with Recurring Oral Ulcers (Board Hallmark)
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    Episodes of ulceration alternating with symptom-free periods of healing. The anatomical tissue type is the definitive board exam differentiator:
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-teal-500/30">
                      <strong className="text-teal-300 block mb-0.5">Recurrent Aphthous:</strong>
                      <span className="text-[11px] text-slate-300">Strictly on <strong>NON-KERATINIZED</strong> mucosa (buccal, labial, floor, ventral tongue).</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-teal-500/30">
                      <strong className="text-teal-300 block mb-0.5">Recrudescent HSV (RIH):</strong>
                      <span className="text-[11px] text-slate-300">Chiefly on <strong>KERATINIZED</strong> mucosa (hard palate, attached gingiva).</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedUlcerCategory === 'single' && (
                <div className="space-y-2">
                  <span className="font-bold text-indigo-300 text-xs uppercase block">
                    Category 4: The Patient with Single Ulcers
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    Solitary ulcers persisting beyond 14 days mandate immediate biopsy to rule out squamous cell carcinoma.
                  </p>
                  <div className="p-3 bg-slate-900 rounded-xl border border-indigo-900/40 text-slate-200 space-y-1">
                    <span className="font-bold text-indigo-300">Mandatory Rule-Outs:</span>
                    <p className="text-[11px] text-slate-300">
                      Squamous Cell Carcinoma (indurated rolled border), Traumatic Ulcerative Granuloma (TUGSE), Deep Fungal (Histoplasmosis), Tuberculosis, and Single persistent CMV ulcer in AIDS!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW B: INTERACTIVE DECISION TREE ROUTER */}
        {interactiveTab === 'decision-tree' && (
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wide block">
              Step-by-Step Clinical Decision Router (Slides 4–5 Algorithm):
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Question 1: Duration */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-300 font-bold block">1. Duration & Temporal Course:</span>
                <div className="space-y-1">
                  {[
                    { id: 'acute' as const, label: 'Acute (< 14 days)' },
                    { id: 'chronic' as const, label: 'Chronic (> 30 days)' },
                    { id: 'recurrent' as const, label: 'Episodic / Recurrent' },
                    { id: 'single' as const, label: 'Solitary Persistent' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setTreeDuration(opt.id)}
                      className={`w-full p-2 rounded-lg text-left text-xs font-semibold border transition-all ${
                        treeDuration === opt.id
                          ? 'bg-teal-950 border-teal-500 text-teal-200 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Mucosal Tissue Type */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-300 font-bold block">2. Tissue Site Predilection:</span>
                <div className="space-y-1">
                  {[
                    { id: 'both' as const, label: 'Both Keratinized & Non-Keratinized' },
                    { id: 'keratinized' as const, label: 'Strictly Keratinized (Palate/Gingiva)' },
                    { id: 'non-keratinized' as const, label: 'Strictly Non-Keratinized (Buccal/Labial)' },
                    { id: 'solitary' as const, label: 'Single Localized Lateral Tongue/Floor' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setTreeTissueType(opt.id)}
                      className={`w-full p-2 rounded-lg text-left text-xs font-semibold border transition-all ${
                        treeTissueType === opt.id
                          ? 'bg-teal-950 border-teal-500 text-teal-200 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Systemic Symptoms */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-300 font-bold block">3. Systemic Fever & Prodrome:</span>
                <div className="space-y-2">
                  <button
                    onClick={() => setTreeProdrome(true)}
                    className={`w-full p-2 rounded-lg text-left text-xs font-semibold border transition-all ${
                      treeProdrome ? 'bg-rose-950 border-rose-500 text-rose-200 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    ✓ High Fever, Malaise, Viral Prodrome
                  </button>
                  <button
                    onClick={() => setTreeProdrome(false)}
                    className={`w-full p-2 rounded-lg text-left text-xs font-semibold border transition-all ${
                      !treeProdrome ? 'bg-teal-950 border-teal-500 text-teal-200 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    ✕ Afebrile, Localized or Autoimmune
                  </button>
                </div>
              </div>
            </div>

            {/* Router Output Diagnostic Callout */}
            <div className="p-4 bg-slate-900 rounded-xl border border-teal-500/50 space-y-2 text-xs animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>ALGORITHM RESULT & DIAGNOSTIC ROUTE:</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700">
                  Slide 4-5 Match
                </span>
              </div>

              <div className="text-slate-200 leading-relaxed text-xs">
                {treeDuration === 'acute' && (
                  <p>
                    <strong>Category 1: Acute Multiple Ulcers.</strong> Primary Herpetic Gingivostomatitis (HSV), Varicella/Zoster (VZV), Coxsackievirus, or Erythema Multiforme. Immediate management includes viral hydration, analgesics (avoid aspirin in children!), and early antiviral therapy.
                  </p>
                )}
                {treeDuration === 'chronic' && (
                  <p>
                    <strong>Category 2: Chronic Multiple Ulcers.</strong> Mandates direct & indirect immunofluorescence biopsy to distinguish Pemphigus Vulgaris from Mucous Membrane Pemphigoid or Erosive Lichen Planus.
                  </p>
                )}
                {treeDuration === 'recurrent' && treeTissueType === 'keratinized' && (
                  <p>
                    <strong>Category 3: Recrudescent Intraoral Herpes (RIH).</strong> Strict predilection for keratinized tissue (hard palate, attached gingiva). Triggered by dental scaling or trauma.
                  </p>
                )}
                {treeDuration === 'recurrent' && treeTissueType !== 'keratinized' && (
                  <p>
                    <strong>Category 3: Recurrent Aphthous Stomatitis.</strong> Strict predilection for non-keratinized mucosa (buccal, labial mucosa). Never preceded by vesicles!
                  </p>
                )}
                {treeDuration === 'single' && (
                  <p>
                    <strong>Category 4: Solitary Ulcer.</strong> Must rule out Squamous Cell Carcinoma with scalpel biopsy if non-healing beyond 14 days. Other differentials: TUGSE, Deep fungal, or single CMV ulcer in AIDS host.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW C: 4-CATEGORY COMPARATIVE MATRIX */}
        {interactiveTab === 'comparison-matrix' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-950 text-slate-300 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3 border-b border-slate-800">Category</th>
                  <th className="p-3 border-b border-slate-800">Duration</th>
                  <th className="p-3 border-b border-slate-800">Tissue Predilection</th>
                  <th className="p-3 border-b border-slate-800">Key Differentials</th>
                  <th className="p-3 border-b border-slate-800">Diagnostic Hallmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-950/50">
                  <td className="p-3 font-bold text-rose-300">1. Acute Multiple</td>
                  <td className="p-3 font-mono">&lt; 14 days</td>
                  <td className="p-3">Both keratinized & non-keratinized</td>
                  <td className="p-3">HSV, VZV, Coxsackie, CMV, EM, NUG</td>
                  <td className="p-3 text-[11px]">Viral prodrome, multiple coalescing blisters</td>
                </tr>
                <tr className="hover:bg-slate-950/50">
                  <td className="p-3 font-bold text-amber-300">2. Chronic Multiple</td>
                  <td className="p-3 font-mono">&gt; 30 days</td>
                  <td className="p-3">Desquamative gingiva, widespread</td>
                  <td className="p-3">Pemphigus, Pemphigoid, Lichen Planus</td>
                  <td className="p-3 text-[11px]">Autoimmune bullae, Nikolsky sign</td>
                </tr>
                <tr className="hover:bg-slate-950/50">
                  <td className="p-3 font-bold text-teal-300">3. Recurring</td>
                  <td className="p-3 font-mono">Periodic episodes</td>
                  <td className="p-3">RIH (Keratinized) vs Aphthae (Non-Keratinized)</td>
                  <td className="p-3">Recurrent Aphthous, RIH, Behçet</td>
                  <td className="p-3 text-[11px]">Strict tissue boundary differentiates</td>
                </tr>
                <tr className="hover:bg-slate-950/50">
                  <td className="p-3 font-bold text-indigo-300">4. Single Ulcers</td>
                  <td className="p-3 font-mono">Weeks to months</td>
                  <td className="p-3">Lateral tongue, floor of mouth, lip</td>
                  <td className="p-3">SCC, TUGSE, Fungal, TB, CMV in AIDS</td>
                  <td className="p-3 text-[11px]">Indurated border, requires biopsy</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
