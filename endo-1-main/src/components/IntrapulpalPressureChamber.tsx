import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Flame,
  Snowflake,
  Activity,
  AlertTriangle,
  Moon,
  Sun,
  ShieldAlert,
  Box,
  Sparkles,
  Info,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { ClinicalTestType } from '../types/endodontics';

interface IntrapulpalPressureChamberProps {
  onSimulateIn3D?: (testType: ClinicalTestType) => void;
}

type PostureType = 'upright' | 'supine';
type ThermalCondition = 'ambient' | 'heat' | 'cold';
type PulpStage = 'healthy' | 'reversible' | 'irreversible' | 'partial_necrosis';

export const IntrapulpalPressureChamber: React.FC<IntrapulpalPressureChamberProps> = ({
  onSimulateIn3D,
}) => {
  const [posture, setPosture] = useState<PostureType>('upright');
  const [thermal, setThermal] = useState<ThermalCondition>('ambient');
  const [stage, setStage] = useState<PulpStage>('irreversible');

  // Animation pulse timer
  const [heartbeatPhase, setHeartbeatPhase] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartbeatPhase((p) => (p + 1) % 100);
    }, 35);
    return () => clearInterval(timer);
  }, []);

  // Compute intrapulpal pressure and hemodynamics based on Van Hassel & Kim low-compliance pulp model
  const calculateHemodynamics = () => {
    // Baseline pressure for each stage
    let basePressure = 10; // normal
    let capillaryFlow = 45; // ml/min/100g
    let cFiberFiring = 0; // Hz
    let diagnosis = 'Healthy Normal Pulp';
    let nerveInvolved = 'Quiescent';

    if (stage === 'healthy') {
      basePressure = 10;
      capillaryFlow = 45;
      cFiberFiring = 0;
      diagnosis = 'Normal Vital Pulp';
      nerveInvolved = 'Normal resting Aδ / C-fibers';
    } else if (stage === 'reversible') {
      basePressure = 16;
      capillaryFlow = 62; // Hyperemia
      cFiberFiring = 4;
      diagnosis = 'Reversible Pulpitis';
      nerveInvolved = 'A-delta (Aδ) hypersensitive';
    } else if (stage === 'irreversible') {
      basePressure = 28;
      capillaryFlow = 18; // Microvascular strangulation
      cFiberFiring = 55;
      diagnosis = 'Symptomatic Irreversible Pulpitis';
      nerveInvolved = 'Unmyelinated C-fibers (Hypoxic core)';
    } else if (stage === 'partial_necrosis') {
      basePressure = 35;
      capillaryFlow = 5; // Near-complete ischemia
      cFiberFiring = 78;
      diagnosis = 'Partial Necrosis / Liquefactive Pulpitis';
      nerveInvolved = 'C-fibers (Anaerobic gas pressure)';
    }

    // Posture adjustment: Supine lying down raises cephalic venous pressure (+10 to +14 mmHg)
    let postureAdd = posture === 'supine' ? 12 : 0;

    // Thermal adjustment: Heat expands fluids/gases (+8 to +15 mmHg), Cold contracts (-8 to -14 mmHg)
    let thermalAdd = 0;
    if (thermal === 'heat') {
      thermalAdd = stage === 'partial_necrosis' ? 16 : 9;
    } else if (thermal === 'cold') {
      thermalAdd = stage === 'partial_necrosis' ? -18 : -7;
    }

    const totalPressure = Math.max(4, basePressure + postureAdd + thermalAdd);

    // If pressure exceeds critical threshold (~32 mmHg), venules collapse, halting venous drainage
    const isVenuleCollapsed = totalPressure >= 33;
    const effectiveCapillaryFlow = isVenuleCollapsed ? Math.max(2, capillaryFlow - 30) : capillaryFlow;
    const effectiveCFibers = Math.min(100, Math.max(0, Math.round(cFiberFiring + (totalPressure - 20) * 2.8)));

    return {
      pressure: totalPressure,
      isVenuleCollapsed,
      capillaryFlow: effectiveCapillaryFlow,
      cFiberFiring: effectiveCFibers,
      diagnosis,
      nerveInvolved,
    };
  };

  const data = calculateHemodynamics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-rose-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 shadow-md">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-100 font-mono text-base tracking-wide">
                Low-Compliance Intrapulpal Pressure &amp; Ischemia Chamber
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase">
                Lecture 1 • Page 2 Core
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulating the rigid dentin box: why unmyelinated C-fibers throb to the heartbeat, why lying down spikes agony, and why heat expands trapped gases.
            </p>
          </div>
        </div>

        {onSimulateIn3D && (
          <button
            onClick={() => onSimulateIn3D(thermal === 'cold' ? 'cold' : 'heat')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-colors shadow-lg shadow-rose-500/20"
          >
            <Box className="w-4 h-4" />
            <span>Simulate in 3D Blueprint</span>
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Cross-Section & Pressure Gauge (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/95 border border-slate-800 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${data.pressure > 32 ? 'bg-rose-500 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
              Rigid Dentin Chamber Cross-Section (Low-Compliance System)
            </span>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${
              data.pressure > 32
                ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                : data.pressure > 20
                  ? 'bg-amber-950 text-amber-300 border-amber-700'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-700'
            }`}>
              {data.pressure > 32 ? 'VASCULAR STRANGULATION' : data.pressure > 20 ? 'ELEVATED TISSUE PRESSURE' : 'NORMAL COMPLIANCE'}
            </span>
          </div>

          {/* Graphical Pulp Chamber Visualization */}
          <div className="relative w-full h-72 rounded-2xl bg-slate-950 border border-rose-500/20 p-4 overflow-hidden flex items-center justify-around select-none shadow-inner">
            {/* Rigid Outer Dentin Walls */}
            <div className="absolute inset-2 border-4 border-amber-200/30 rounded-2xl pointer-events-none">
              <div className="absolute top-1 left-3 text-[9px] font-mono font-bold text-amber-200/50 uppercase">
                Rigid Dentin Walls (Zero Volumetric Expansion Possible)
              </div>
            </div>

            {/* Central Pulp Vascular Loop Animation */}
            <div className="relative w-72 h-56 flex flex-col items-center justify-center">
              {/* Arteriole Inflow (Pulsating) */}
              <div
                className="w-16 h-16 rounded-full border-4 border-rose-500 flex items-center justify-center transition-all duration-300 shadow-xl"
                style={{
                  transform: `scale(${1 + Math.sin(heartbeatPhase * 0.25) * (data.pressure > 25 ? 0.22 : 0.08)})`,
                  backgroundColor: data.pressure > 32 ? '#881337' : '#e11d48',
                  boxShadow: `0 0 ${data.pressure}px rgba(244, 63, 94, 0.7)`,
                }}
              >
                <div className="text-center">
                  <div className="text-[10px] font-mono font-bold text-white leading-tight">
                    {data.pressure > 32 ? 'THROB' : 'PULSE'}
                  </div>
                  <div className="text-[8px] font-mono text-rose-200">
                    {data.pressure} mmHg
                  </div>
                </div>
              </div>

              {/* Venule Outflow (Compressed when pressure spikes) */}
              <div className="w-full flex items-center justify-between text-xs font-mono mt-4 px-2">
                <div className="text-center">
                  <span className="text-[10px] text-rose-400 block font-bold">Arteriole Inflow</span>
                  <span className="text-[9px] text-slate-400">High Pressure</span>
                </div>

                <div className="flex-1 mx-3 h-2 bg-slate-900 rounded-full border border-slate-700 relative overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{
                      width: data.isVenuleCollapsed ? '15%' : '85%',
                      backgroundColor: data.isVenuleCollapsed ? '#f43f5e' : '#38bdf8',
                    }}
                  />
                </div>

                <div className="text-center">
                  <span className={`text-[10px] block font-bold ${data.isVenuleCollapsed ? 'text-rose-400' : 'text-blue-400'}`}>
                    {data.isVenuleCollapsed ? 'Venule COLLAPSED!' : 'Venous Outflow'}
                  </span>
                  <span className="text-[9px] text-slate-400">Low Pressure</span>
                </div>
              </div>

              {/* Trapped Gases / C-Fiber Nerve Firing Graphic */}
              <div className="mt-3 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-300">
                  C-Fiber Activity: <strong className="text-rose-400">{data.cFiberFiring} Hz</strong> • Capillary Perfusion: <strong className="text-cyan-300">{data.capillaryFlow} ml/min</strong>
                </span>
              </div>
            </div>

            {/* Pressure Dial Gauge (Right side) */}
            <div className="w-36 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                Tissue Pressure
              </span>
              <div className={`text-2xl font-mono font-extrabold ${
                data.pressure > 32 ? 'text-rose-400' : data.pressure > 20 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {data.pressure}
                <span className="text-xs font-normal text-slate-400 ml-1">mmHg</span>
              </div>

              {/* Mini Level Bar */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-300 ${
                    data.pressure > 32 ? 'bg-rose-500' : data.pressure > 20 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (data.pressure / 45) * 100)}%` }}
                />
              </div>

              <div className="text-[9px] font-mono text-slate-500">
                Normal: 10 mmHg<br />
                Critical: &gt;32 mmHg
              </div>
            </div>
          </div>

          {/* Biological Mechanism Explanatory Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="font-mono text-xs font-bold text-rose-300 uppercase">
                Van Hassel / Kim Low-Compliance Pulp Principle (Lecture 1 Core):
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {posture === 'supine' && (
                <>
                  <strong>Why pain throbs on lying down (Lecture 1 Page 2):</strong> When a patient lies flat to sleep, the hydrostatic column of blood to the heart is eliminated. Cephalic venous pressure rises by +12 mmHg. In loose skin, tissue expands; but in dental pulp, the rigid non-yielding dentin box prevents expansion. The +12 mmHg transfers directly to intrapulpal pressure, raising it past the venule collapse pressure (32 mmHg). Venous drainage halts, arterial systole pulses violently against trapped nerves, and unmyelinated C-fibers fire agonizing spontaneous throbs that wake the patient from sleep.
                </>
              )}
              {posture === 'upright' && thermal === 'heat' && (
                <>
                  <strong>Why Heat causes prolonged throbbing pain:</strong> Heat expands pulpal fluids and gaseous breakdown products (PV = nRT). Because the dentin chamber cannot expand, intrapulpal pressure surges. Arteriolar vasodilatation increases blood volume inside a closed box, compressing capillaries and causing acute ischemia that stimulates deep C-fibers.
                </>
              )}
              {posture === 'upright' && thermal === 'cold' && (
                <>
                  <strong>Why Cold relieves pain in late irreversible pulpitis / partial necrosis:</strong> In late-stage pulpitis, necrotic gases expand and press on surviving apical C-fibers. When the patient sips ice water, the thermal contraction contracts the trapped fluids and gases, lowering intrapulpal pressure below the pain threshold. The relief lasts only until the tooth warms back up to 37&deg;C.
                </>
              )}
              {posture === 'upright' && thermal === 'ambient' && (
                <>
                  <strong>The Low-Compliance Paradox:</strong> Because the pulp has no collateral circulation and is enclosed in unyielding mineralized dentin, inflammation creates a vicious cycle: vasodilation &rarr; increased pressure &rarr; venular collapse &rarr; microvascular ischemia &rarr; tissue necrosis.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right: Interactive Scenario Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Posture Toggle */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Patient Posture (Gravity vs Cephalic Pressure):
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPosture('upright')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 text-xs font-mono font-bold ${
                  posture === 'upright'
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-4 h-4 text-cyan-400" />
                <div>
                  <div>Upright / Daytime</div>
                  <div className="text-[10px] font-normal text-slate-400">Normal venous drainage</div>
                </div>
              </button>

              <button
                onClick={() => setPosture('supine')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 text-xs font-mono font-bold ${
                  posture === 'supine'
                    ? 'bg-rose-950 border-rose-400 text-rose-200 shadow-lg shadow-rose-500/25 ring-1 ring-rose-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-4 h-4 text-rose-400" />
                <div>
                  <div>Lying Down / Sleep</div>
                  <div className="text-[10px] font-normal text-rose-300">+12 mmHg Cephalic spike</div>
                </div>
              </button>
            </div>
          </div>

          {/* Thermal Stimulus Challenge */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Thermal Challenge (Thermal Fluid &amp; Gas Expansion):
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setThermal('ambient')}
                className={`p-2.5 rounded-2xl border text-center transition-all text-xs font-mono font-bold ${
                  thermal === 'ambient'
                    ? 'bg-slate-800 border-slate-500 text-slate-100'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Ambient 37°C
              </button>

              <button
                onClick={() => setThermal('heat')}
                className={`p-2.5 rounded-2xl border text-center transition-all text-xs font-mono font-bold flex flex-col items-center gap-1 ${
                  thermal === 'heat'
                    ? 'bg-orange-950 border-orange-400 text-orange-200 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Heat Expands</span>
              </button>

              <button
                onClick={() => setThermal('cold')}
                className={`p-2.5 rounded-2xl border text-center transition-all text-xs font-mono font-bold flex flex-col items-center gap-1 ${
                  thermal === 'cold'
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cold Relieves</span>
              </button>
            </div>
          </div>

          {/* Inflammatory Pathological Stage */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Pulpal Pathological Stage:
            </span>

            <div className="space-y-2">
              {[
                { id: 'healthy', name: 'Normal Vital Pulp', detail: 'Pressure 10 mmHg • Zero C-fiber pain' },
                { id: 'reversible', name: 'Reversible Pulpitis', detail: 'Pressure 16 mmHg • Hyperemia • Aδ momentary' },
                { id: 'irreversible', name: 'Symptomatic Irreversible Pulpitis', detail: 'Pressure 28 mmHg • Venule compression • C-fiber throbbing' },
                { id: 'partial_necrosis', name: 'Partial Necrosis / Trapped Gas', detail: 'Pressure 35+ mmHg • Heat expands gas • Cold relieves' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStage(s.id as PulpStage)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all ${
                    stage === s.id
                      ? 'bg-rose-950/80 border-rose-400 text-rose-200 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-mono">{s.name}</div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">{s.detail}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Diagnosis & Clinical Pathway Card */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-rose-500/40 space-y-2 shadow-xl">
            <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block">
              Provisional Clinical Diagnosis:
            </span>
            <h4 className="text-sm font-extrabold text-slate-100 font-mono">
              {data.diagnosis}
            </h4>
            <div className="text-xs text-slate-300 pt-1">
              Active Nerve Recruitment: <strong className="text-rose-400 font-mono">{data.nerveInvolved}</strong>
            </div>
            <div className="text-[11px] text-slate-400 italic">
              {data.pressure > 32
                ? 'RCT or pulpotomy mandatory: Irreversible damage with microvascular strangulation.'
                : 'Pulp remains vital and potentially conservable with indirect pulp therapy.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
