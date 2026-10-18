import React, { useState, useEffect } from 'react';
import {
  Snowflake,
  Flame,
  Wind,
  Droplet,
  ShieldCheck,
  Zap,
  Activity,
  Box,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import { ClinicalTestType } from '../types/endodontics';

interface HydrodynamicTubuleLabProps {
  onSimulateIn3D?: (testType: ClinicalTestType) => void;
}

type StimulusType = 'rest' | 'cold' | 'heat' | 'osmotic' | 'air_blast' | 'desensitizer';

export const HydrodynamicTubuleLab: React.FC<HydrodynamicTubuleLabProps> = ({
  onSimulateIn3D,
}) => {
  const [activeStimulus, setActiveStimulus] = useState<StimulusType>('cold');
  const [tubuleDiameter, setTubuleDiameter] = useState<number>(2.0); // 0.8 to 2.8 microns
  const [remainingDentinThickness, setRemainingDentinThickness] = useState<number>(1.5); // 0.5 to 3.0 mm
  const [isStimulusApplied, setIsStimulusApplied] = useState<boolean>(true);

  // Computed biophysical values based on Poiseuille's law and Brännström hydrodynamic model
  // Flow is proportional to radius^4 and inversely proportional to length (thickness)
  const getBiophysicalTelemetry = () => {
    if (!isStimulusApplied || activeStimulus === 'rest') {
      return {
        velocity: 0,
        direction: 'Static Equilibrium',
        flowRate: 0,
        shearingForce: 0,
        spikeFreq: 0,
        nerveStatus: 'Resting Membrane Potential (-70 mV)',
        provisionalDiagnosis: 'Healthy Pulp / Vitality Intact',
      };
    }

    if (activeStimulus === 'desensitizer') {
      return {
        velocity: 0,
        direction: 'Tubules Occluded by Oxalate Plugs',
        flowRate: 0,
        shearingForce: 0,
        spikeFreq: 0,
        nerveStatus: 'Hyperpolarized (K+ ions stabilize axon membrane)',
        provisionalDiagnosis: 'Desensitized Dentin / Intact Pulp',
      };
    }

    const diameterFactor = Math.pow(tubuleDiameter / 1.5, 3.2);
    const thicknessFactor = 2.0 / remainingDentinThickness;

    let baseVelocity = 0;
    let direction = 'Outward (Toward Cavity)';
    let diagnosis = 'Reversible pulpitis';

    if (activeStimulus === 'cold') {
      // Rapid thermal contraction of dentinal fluid (most potent hydrodynamic trigger)
      baseVelocity = 2.6;
      direction = 'Outward Rapid Stream (Thermal Contraction)';
      diagnosis = 'Dentin Hypersensitivity / Reversible Pulpitis';
    } else if (activeStimulus === 'air_blast') {
      // Evaporative capillary draw
      baseVelocity = 3.2;
      direction = 'Outward Rapid Capillary Evaporation';
      diagnosis = 'Exposed Dentinal Tubules / Reversible Pulpitis';
    } else if (activeStimulus === 'osmotic') {
      // Chemical osmotic gradient pulling water outward
      baseVelocity = 1.9;
      direction = 'Outward Osmotic Gradient (Hypertonic Draw)';
      diagnosis = 'Reversible Pulpitis (Sweet/Sour Sensitivity)';
    } else if (activeStimulus === 'heat') {
      // Thermal expansion into the pulp
      baseVelocity = 1.1;
      direction = 'Inward Displacement (Thermal Expansion)';
      diagnosis = 'Reversible Pulpitis / Early Irreversible (if prolonged)';
    }

    const calculatedVelocity = Number((baseVelocity * diameterFactor * (thicknessFactor * 0.75)).toFixed(2));
    const calculatedFlowRate = Number((calculatedVelocity * Math.PI * Math.pow(tubuleDiameter / 2, 2) * 1.8).toFixed(2));
    const calculatedForce = Number((calculatedVelocity * 14.5 * (tubuleDiameter / 1.5)).toFixed(1));
    const calculatedSpikes = Math.min(180, Math.round(calculatedVelocity * 38 + (3 - remainingDentinThickness) * 15));

    return {
      velocity: calculatedVelocity,
      direction,
      flowRate: calculatedFlowRate,
      shearingForce: calculatedForce,
      spikeFreq: calculatedSpikes,
      nerveStatus: calculatedSpikes > 0 ? `Active Firing (${calculatedSpikes} AP/s)` : 'Resting (-70 mV)',
      provisionalDiagnosis: diagnosis,
    };
  };

  const telemetry = getBiophysicalTelemetry();

  // Pulse animation frame timer
  const [animTime, setAnimTime] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimTime((t) => (t + 1) % 100);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800 shadow-md">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-100 font-mono text-base tracking-wide">
                Brännström Hydrodynamic Tubule Laboratory
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                Lecture 1 • Page 2 Biophysics
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualizing how thermal contraction, osmotic pressure, and air blasts displace tubular fluid to mechanically deform odontoblast processes and fire Aδ fibers.
            </p>
          </div>
        </div>

        {onSimulateIn3D && (
          <button
            onClick={() => onSimulateIn3D(activeStimulus === 'heat' ? 'heat' : 'cold')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Box className="w-4 h-4" />
            <span>Simulate in 3D Blueprint</span>
          </button>
        )}
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Microscopic Tubule Cross-Section (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/95 border border-slate-800 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
                Microscopic Cross-Section: Single Dentinal Tubule (10,000x Magnification)
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">
              {activeStimulus === 'desensitizer' ? 'Occluded Tubule' : isStimulusApplied ? `${telemetry.direction.split(' ')[0]} Fluid Flow` : 'Static Rest'}
            </span>
          </div>

          {/* SVG Animated Microscopic Diagram */}
          <div className="relative w-full h-72 rounded-2xl bg-slate-950 border border-cyan-500/20 p-3 overflow-hidden flex flex-col justify-center select-none shadow-inner">
            {/* Top / Left Indicator: Enamel Surface vs Pulp Chamber */}
            <div className="absolute top-2 left-4 text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1 z-10">
              <span>Cavity Surface / Dentin Surface</span>
              <span className="text-cyan-400">➔</span>
            </div>
            <div className="absolute top-2 right-4 text-[10px] font-mono uppercase font-bold text-rose-400 flex items-center gap-1 z-10">
              <span className="text-rose-400">➔</span>
              <span>Pulp Chamber &amp; Predentin</span>
            </div>

            <svg viewBox="0 0 600 220" className="w-full h-full">
              <defs>
                {/* Linear gradient for dentin tubule wall */}
                <linearGradient id="dentinWallGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.2" />
                </linearGradient>

                {/* Linear gradient for tubular fluid */}
                <linearGradient id="fluidGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
                </linearGradient>

                {/* Arrow Marker for fluid velocity vectors */}
                <marker
                  id="flowArrowLeft"
                  markerWidth="8"
                  markerHeight="8"
                  refX="4"
                  refY="4"
                  orient="auto"
                >
                  <polygon points="8 0, 0 4, 8 8" fill="#38bdf8" />
                </marker>
                <marker
                  id="flowArrowRight"
                  markerWidth="8"
                  markerHeight="8"
                  refX="4"
                  refY="4"
                  orient="auto"
                >
                  <polygon points="0 0, 8 4, 0 8" fill="#fb923c" />
                </marker>
              </defs>

              {/* Upper Dentin Wall */}
              <rect x="20" y="25" width="560" height="40" fill="url(#dentinWallGrad)" rx="6" />
              <text x="35" y="48" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Intertubular Dentin Matrix (Type I Collagen + Hydroxyapatite)
              </text>

              {/* Lower Dentin Wall */}
              <rect x="20" y="155" width="560" height="40" fill="url(#dentinWallGrad)" rx="6" />
              <text x="35" y="178" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Peritubular Dentin (Highly Mineralized Cylindrical Collar)
              </text>

              {/* Inner Tubule Channel (Fluid Space) */}
              <rect
                x="20"
                y="65"
                width="560"
                height="90"
                fill="url(#fluidGrad)"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Odontoblast Process (Cytoplasmic Extension) */}
              {/* Projects from right (pulp) to about midpoint of tubule */}
              <path
                d="M 580 110 Q 420 108 300 110 T 180 110"
                stroke="#f43f5e"
                strokeWidth={Math.max(14, tubuleDiameter * 8)}
                strokeLinecap="round"
                fill="none"
                opacity="0.85"
              />

              {/* Odontoblast Cell Body at the Pulp Margin (Right) */}
              <ellipse cx="560" cy="110" rx="35" ry="42" fill="#be123c" opacity="0.95" />
              <circle cx="565" cy="110" r="14" fill="#881337" />
              <text x="548" y="114" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">
                Cell
              </text>

              {/* A-Delta Intradentinal Nerve Terminal (Wrapping Around Process) */}
              <path
                d="M 570 125 Q 480 140 380 120 T 260 115"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeDasharray={telemetry.spikeFreq > 0 ? '6 4' : 'none'}
                fill="none"
              />
              <circle cx="260" cy="115" r="5" fill="#38bdf8" />
              <text x="245" y="100" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Aδ Axon Terminal
              </text>

              {/* Dynamic Fluid Particles Stream */}
              {isStimulusApplied && activeStimulus !== 'desensitizer' && activeStimulus !== 'rest' && (
                <>
                  {[...Array(9)].map((_, i) => {
                    const isOutward = activeStimulus !== 'heat';
                    const speedMultiplier = telemetry.velocity > 0 ? telemetry.velocity : 1;
                    const offset = isOutward
                      ? (500 - (animTime * speedMultiplier * 3.5 + i * 55)) % 480 + 30
                      : ((animTime * speedMultiplier * 3.5 + i * 55) % 480) + 30;

                    return (
                      <g key={i}>
                        <circle
                          cx={offset}
                          cy={78 + (i % 3) * 28}
                          r={3.5}
                          fill={isOutward ? '#38bdf8' : '#fb923c'}
                          opacity={0.8}
                        />
                        <line
                          x1={offset}
                          y1={78 + (i % 3) * 28}
                          x2={isOutward ? offset - 18 : offset + 18}
                          y2={78 + (i % 3) * 28}
                          stroke={isOutward ? '#38bdf8' : '#fb923c'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          opacity={0.6}
                        />
                      </g>
                    );
                  })}
                </>
              )}

              {/* Crystalline Plugs when Desensitizer applied */}
              {activeStimulus === 'desensitizer' && (
                <g>
                  <rect x="20" y="65" width="28" height="90" fill="#a855f7" opacity="0.8" />
                  <text x="25" y="114" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold" transform="rotate(-90 25,114)">
                    PLUGGED
                  </text>
                  <circle cx="34" cy="85" r="6" fill="#e9d5ff" />
                  <circle cx="34" cy="110" r="7" fill="#e9d5ff" />
                  <circle cx="34" cy="135" r="6" fill="#e9d5ff" />
                </g>
              )}

              {/* Stimulus Tool Graphic at Outer Aperture (Left) */}
              {activeStimulus === 'cold' && isStimulusApplied && (
                <g transform="translate(15, 80)">
                  <rect x="-15" y="-12" width="24" height="60" fill="#0284c7" rx="4" />
                  <text x="-13" y="15" fill="#e0f2fe" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    ICE
                  </text>
                </g>
              )}

              {activeStimulus === 'heat' && isStimulusApplied && (
                <g transform="translate(15, 80)">
                  <rect x="-15" y="-12" width="24" height="60" fill="#ea580c" rx="4" />
                  <text x="-13" y="15" fill="#ffedd5" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    HOT
                  </text>
                </g>
              )}

              {activeStimulus === 'air_blast' && isStimulusApplied && (
                <g transform="translate(5, 85)">
                  <path d="M -15 0 L 10 15 L -15 30 Z" fill="#38bdf8" opacity="0.9" />
                  <text x="-25" y="18" fill="#bae6fd" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    AIR
                  </text>
                </g>
              )}

              {activeStimulus === 'osmotic' && isStimulusApplied && (
                <g transform="translate(10, 85)">
                  <circle cx="-5" cy="15" r="14" fill="#f59e0b" opacity="0.9" />
                  <text x="-14" y="18" fill="#fef3c7" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    SUGAR
                  </text>
                </g>
              )}
            </svg>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[10px] font-mono bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-lg">
              <span className="text-slate-400">
                Fluid Stream: <strong className={telemetry.velocity > 0 ? 'text-cyan-300' : 'text-slate-300'}>{telemetry.velocity} mm/s</strong>
              </span>
              <span className="text-slate-400">
                Aδ Action Potentials: <strong className={telemetry.spikeFreq > 0 ? 'text-cyan-300' : 'text-slate-500'}>{telemetry.spikeFreq} Hz</strong>
              </span>
              <span className="text-slate-400">
                Shearing Stress: <strong className="text-amber-300">{telemetry.shearingForce} pN</strong>
              </span>
            </div>
          </div>

          {/* Biological Mechanism Explanatory Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-mono text-xs font-bold text-cyan-300 uppercase">
                Brännström Biophysical Explanation (Lecture 1 Core):
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeStimulus === 'cold' && (
                <>
                  <strong>Why Cold produces the sharpest pain:</strong> Rapid cooling causes instantaneous volumetric contraction of dentinal fluid (3.0 &times; 10&minus;4 / &deg;C). This pulls fluid outward toward the cavity floor at velocities exceeding 2&ndash;3 mm/s. The outward suction causes violent mechanical shearing of the odontoblast cell membrane, triggering stretch-sensitive ion channels on myelinated A-delta nerve endings.
                </>
              )}
              {activeStimulus === 'heat' && (
                <>
                  <strong>Why Heat causes inward displacement:</strong> Heat expands tubular fluid (+0.8 mm/s inward toward pulp). The inward velocity is slower than cold contraction, causing mild momentary twinges initially. However, prolonged heat builds intrapulpal pressure in the low-compliance chamber, leading to microvascular collapse and deep throbbing C-fiber pain!
                </>
              )}
              {activeStimulus === 'osmotic' && (
                <>
                  <strong>Why Sweets &amp; Sours cause instant twinges:</strong> Concentrated sugars or acids create an extreme hypertonic osmotic gradient (&gt;2,000 mOsm/L) across the dentinal tubule orifice. Water is drawn rapidly outward from the pulp by osmosis, displacing the fluid column and firing peripheral A&delta; fibers without any temperature change.
                </>
              )}
              {activeStimulus === 'air_blast' && (
                <>
                  <strong>Why Air blasts feel like an electric shock:</strong> Direct airflow over exposed tubules causes rapid evaporation of the fluid meniscus at the surface. Intense capillary draw pulls tubular fluid outward at over 3.0 mm/s, stimulating high-frequency A&delta; spike trains.
                </>
              )}
              {activeStimulus === 'desensitizer' && (
                <>
                  <strong>How Desensitizing Agents resolve the pain:</strong> Oxalate salts and potassium nitrate precipitate crystalline plugs that occlude the outer tubule aperture. By sealing the tubule lumen, fluid movement drops to zero (0.0 mm/s), preventing mechanical deformation. Simultaneously, high potassium concentrations depolarize A&delta; axons, blocking transmission.
                </>
              )}
              {activeStimulus === 'rest' && (
                <>
                  <strong>Resting State:</strong> Tubular fluid is in hydrostatic balance with pulpal interstitial fluid pressure (~10 mmHg). Odontoblast processes remain undeformed and A-delta fibers stay at their resting membrane potential (-70 mV).
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Column: Stimulus Controls & Clinical Parameters (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Stimulus Selector */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Choose Clinical Stimulus / Test:
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setActiveStimulus('cold');
                  setIsStimulusApplied(true);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 text-xs font-mono font-bold ${
                  activeStimulus === 'cold'
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Snowflake className="w-4 h-4 text-cyan-400" />
                <span>Cold Test (-50°C)</span>
              </button>

              <button
                onClick={() => {
                  setActiveStimulus('heat');
                  setIsStimulusApplied(true);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 text-xs font-mono font-bold ${
                  activeStimulus === 'heat'
                    ? 'bg-orange-950 border-orange-400 text-orange-200 shadow-lg shadow-orange-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Heat Test (65°C)</span>
              </button>

              <button
                onClick={() => {
                  setActiveStimulus('osmotic');
                  setIsStimulusApplied(true);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 text-xs font-mono font-bold ${
                  activeStimulus === 'osmotic'
                    ? 'bg-amber-950 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Droplet className="w-4 h-4 text-amber-400" />
                <span>Sweet / Osmotic</span>
              </button>

              <button
                onClick={() => {
                  setActiveStimulus('air_blast');
                  setIsStimulusApplied(true);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 text-xs font-mono font-bold ${
                  activeStimulus === 'air_blast'
                    ? 'bg-blue-950 border-blue-400 text-blue-200 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wind className="w-4 h-4 text-blue-400" />
                <span>Air Blast Syringe</span>
              </button>

              <button
                onClick={() => {
                  setActiveStimulus('desensitizer');
                  setIsStimulusApplied(true);
                }}
                className={`col-span-2 p-3 rounded-2xl border text-left transition-all flex items-center justify-between text-xs font-mono font-bold ${
                  activeStimulus === 'desensitizer'
                    ? 'bg-purple-950 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Apply Desensitizing Paste (Oxalate Plugs + K+)</span>
                </div>
                <span className="text-[10px] text-purple-300">Occludes Lumen</span>
              </button>
            </div>

            <button
              onClick={() => setIsStimulusApplied(!isStimulusApplied)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-colors"
            >
              {isStimulusApplied ? 'Pause / Remove Stimulus' : 'Apply Active Stimulus'}
            </button>
          </div>

          {/* Anatomical Sliders: Tubule Diameter & Dentin Thickness */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Anatomical Variables:
            </span>

            {/* Tubule Diameter Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Tubule Lumen Diameter:</span>
                <span className="text-cyan-400 font-bold">{tubuleDiameter.toFixed(1)} μm</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.8"
                step="0.1"
                value={tubuleDiameter}
                onChange={(e) => setTubuleDiameter(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.8 μm (Sclerotic/Old)</span>
                <span>2.8 μm (Demineralized/Young)</span>
              </div>
            </div>

            {/* Remaining Dentin Thickness Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Remaining Dentin Thickness (RDT):</span>
                <span className="text-rose-400 font-bold">{remainingDentinThickness.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={remainingDentinThickness}
                onChange={(e) => setRemainingDentinThickness(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.5 mm (Deep Cavity)</span>
                <span>3.0 mm (Intact Crown)</span>
              </div>
            </div>
          </div>

          {/* Provisional Diagnosis Card */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/40 space-y-2 shadow-xl">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
              Provisional Clinical Diagnosis:
            </span>
            <h4 className="text-sm font-extrabold text-slate-100 font-mono">
              {telemetry.provisionalDiagnosis}
            </h4>
            <div className="text-xs text-slate-300 pt-1">
              Nerve Recruitment: <strong className="text-cyan-300 font-mono">A-delta (Aδ) Peripheral Plexus</strong>
            </div>
            <div className="text-[11px] text-slate-400 italic">
              Lecture Rule: Pain vanishes instantly upon removing stimulus = Reversible. Pain lingering &gt;15s = Irreversible pulpitis.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
