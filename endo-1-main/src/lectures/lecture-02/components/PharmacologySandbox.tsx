/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Info, 
  Layers, 
  RotateCcw,
  Sparkles,
  Heart,
  Pill
} from 'lucide-react';

export default function PharmacologySandbox() {
  // Sandbox 1: VGSC state
  const [laMolecule, setLaMolecule] = useState<'lidocaine' | 'articaine' | 'mepivacaine' | 'procaine'>('lidocaine');
  const [isLaBound, setIsLaBound] = useState<boolean>(true);
  const [membraneVoltage, setMembraneVoltage] = useState<number>(-70);
  const [actionPotentialSim, setActionPotentialSim] = useState<boolean>(false);

  // Sandbox 2: pH state
  const [tissuePh, setTissuePh] = useState<number>(7.4);
  const pKa = laMolecule === 'procaine' ? 9.1 : laMolecule === 'mepivacaine' ? 7.6 : 7.8;
  const stimulationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (stimulationTimeout.current !== null) clearTimeout(stimulationTimeout.current);
  }, []);

  // Henderson-Hasselbalch calculation
  // pH - pKa = log([RN]/[RNH+]) => ratio = 10^(pH - pKa)
  // % RN = ratio / (1 + ratio) * 100
  const ratio = Math.pow(10, tissuePh - pKa);
  const percentBase = (ratio / (1 + ratio)) * 100;
  const percentCation = 100 - percentBase;

  const triggerStimulation = () => {
    if (stimulationTimeout.current !== null) return;
    setActionPotentialSim(true);
    setMembraneVoltage(isLaBound ? -68 : 35);
    stimulationTimeout.current = setTimeout(() => {
      stimulationTimeout.current = null;
      setMembraneVoltage(-70);
      setActionPotentialSim(false);
    }, isLaBound ? 500 : 700);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-sky-100 rounded-xl text-[#0284C7]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Module 2</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">Local Anesthesia Mechanism & Pharmacology</h2>
          </div>
        </div>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Local anesthetics produce temporary, reversible loss of sensation without depressing consciousness by blocking <strong className="text-[#0284C7]">Voltage-Gated Sodium Channels (VGSCs)</strong> on axonal membranes. Formulations comprise Esters (procaine, benzocaine) and Amides (lidocaine, mepivacaine, prilocaine, articaine).
        </p>
      </div>

      {/* SANDBOX 1: VGSC SODIUM CHANNEL MOLECULAR BLOCKADE */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-[#1E293B]">VGSC Molecular Blockade Sandbox</h3>
            <p className="text-xs text-slate-500 mt-0.5">Simulate axonal membrane permeability, voltage gating, and local anesthetic binding</p>
          </div>
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
            <span className="shrink-0 text-xs font-semibold text-slate-600">Molecule:</span>
            <select
              aria-label="Local anesthetic molecule"
              value={laMolecule}
              disabled={actionPotentialSim}
              onChange={(e) => setLaMolecule(e.target.value as typeof laMolecule)}
              className="min-w-0 max-w-full flex-1 text-xs font-bold bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              <option value="lidocaine">Lidocaine 2% (Amide, pKa 7.8)</option>
              <option value="articaine">Articaine 4% (Amide w/ Thiophene, pKa 7.8)</option>
              <option value="mepivacaine">Mepivacaine 3% (Amide, pKa 7.6)</option>
              <option value="procaine">Procaine (Ester, pKa 9.1)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 2D Molecular Membrane Visualizer Canvas */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 text-white relative min-h-85 flex flex-col justify-between shadow-inner overflow-hidden">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Extracellular Fluid (High [Na+])</span>
              <span className={`px-2 py-0.5 rounded font-bold ${membraneVoltage > 0 ? 'bg-red-500 text-white' : 'bg-slate-800 text-sky-400'}`}>
                {membraneVoltage} mV
              </span>
            </div>

            {/* Phospholipid Bilayer & Ion Channel SVG */}
            <div className="relative my-4 flex justify-center">
              <svg className="w-full h-48" viewBox="0 0 360 160">
                {/* Extracellular Na+ ions */}
                <g fill="#38BDF8">
                  <circle cx="50" cy="20" r="4" className={actionPotentialSim ? "animate-ping" : ""} />
                  <circle cx="90" cy="30" r="4" />
                  <circle cx="140" cy="15" r="4" />
                  <circle cx="210" cy="25" r="4" />
                  <circle cx="270" cy="20" r="4" />
                  <circle cx="310" cy="35" r="4" />
                </g>

                {/* Outer Lipid Bilayer Heads */}
                <g fill="#64748B">
                  {[20, 50, 80, 110, 240, 270, 300, 330].map(x => (
                    <circle key={`top-${x}`} cx={x} cy="55" r="7" />
                  ))}
                  {[20, 50, 80, 110, 240, 270, 300, 330].map(x => (
                    <circle key={`bot-${x}`} cx={x} cy="105" r="7" />
                  ))}
                </g>

                {/* Lipid Tails */}
                <g stroke="#475569" strokeWidth="2">
                  {[20, 50, 80, 110, 240, 270, 300, 330].map(x => (
                    <line key={`tail-${x}`} x1={x} y1="62" x2={x} y2="98" />
                  ))}
                </g>

                {/* Voltage-Gated Sodium Channel (VGSC) Proteins */}
                <path d="M125,45 Q145,50 145,115 L125,115 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
                <path d="M225,45 Q205,50 205,115 L225,115 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />

                {/* Central Channel Pore */}
                <rect x="145" y="55" width="60" height="50" fill={isLaBound ? "#450a0a" : "#064e3b"} opacity="0.6" />

                {/* Anesthetic Molecule Plug inside pore */}
                {isLaBound ? (
                  <g>
                    <rect x="155" y="70" width="40" height="22" rx="6" fill="#DC2626" stroke="#EF4444" strokeWidth="2" />
                    <text x="175" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">LA (RNH+)</text>
                    {/* Blocked bouncing Na+ ion */}
                    <circle cx="175" cy="45" r="5" fill="#38BDF8" />
                    <line x1="175" y1="45" x2="175" y2="35" stroke="#F87171" strokeWidth="2" strokeDasharray="2,2" />
                  </g>
                ) : (
                  <g>
                    {/* Free Inflow of Na+ */}
                    <path d="M175,25 L175,135" stroke="#38BDF8" strokeWidth="3" strokeDasharray="4,4" className="animate-pulse" />
                    <polygon points="175,140 170,130 180,130" fill="#38BDF8" />
                  </g>
                )}

                {/* Axoplasm text */}
                <text x="180" y="148" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  Intracellular Axoplasm (Negative Resting Potential -70 mV)
                </text>
              </svg>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsLaBound(!isLaBound)}
                disabled={actionPotentialSim}
                aria-pressed={isLaBound}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow ${
                  isLaBound 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isLaBound ? 'Remove LA Molecule (Open VGSC)' : 'Deliver Anesthetic (Plug Channel)'}
              </button>

              <button
                onClick={triggerStimulation}
                disabled={actionPotentialSim}
                className="px-3.5 py-1.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-600 transition disabled:opacity-50 flex items-center space-x-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Stimulate Nerve Impulse</span>
              </button>
            </div>
          </div>

          {/* Pharmacodynamics & Channel Anatomy Insights */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7]">Mechanism of Action</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">VGSC Receptor Site Blockade</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The primary action of local anesthetic agents is to decrease nerve permeability to sodium (Na⁺) ions, preventing inflow through voltage-gated channels. This abolishes sodium conductance and halts action potential impulse propagation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-900 space-y-1.5">
              <span className="font-bold flex items-center space-x-1.5 text-[#0284C7]">
                <Sparkles className="w-4 h-4" />
                <span>Vasoconstrictor Synergism</span>
              </span>
              <p className="leading-relaxed">
                Local anesthetics are natural vasodilators. Adding <strong>epinephrine (1:100,000)</strong> constricts local arterioles, reducing blood stream absorption, prolonging local pulpal duration, decreasing toxicity risk, and providing localized hemostasis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SANDBOX 2: EXTRACELLULAR pH & INFECTION EQUILIBRIUM */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#1E293B]">Tissue pH & Henderson-Hasselbalch Ionization Sandbox</h3>
          <p className="text-xs text-slate-500 mt-0.5">Simulate how infection and acute inflammation (pH 5–6) trap anesthetic molecules and cause block failure. Educational simplification: ionization is calculated from pH and pKa; channel binding is controlled separately, and clinical success is not calculated.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Beaker & Membrane Equilibrium Canvas */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white space-y-6 shadow-inner">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="space-y-0.5">
                <span className="text-xs font-mono text-slate-400">Micro-environmental pH Slider</span>
                <div className="text-lg font-bold text-[#D97706]">pH {tissuePh.toFixed(1)} {tissuePh < 6.2 ? '(Acutely Infected / Inflamed)' : '(Normal Healthy Tissue)'}</div>
              </div>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                Drug pKa: {pKa.toFixed(1)}
              </span>
            </div>

            <input 
              type="range"
              aria-label="Tissue pH"
              min="5.0" 
              max="7.4" 
              step="0.1" 
              value={tissuePh} 
              onChange={(e) => setTissuePh(Number(e.target.value))}
              className="w-full accent-[#D97706]" 
            />

            {/* Dynamic Henderson-Hasselbalch Molecular Distribution */}
            <div className="space-y-3">
              <div className="flex justify-between gap-3 text-xs font-mono">
                <span className="text-emerald-400 font-bold">Free Base [RN] (Lipid-Soluble, Crosses Sheath)</span>
                <span className="text-emerald-400 font-bold">{percentBase.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-200"
                  style={{ width: `${percentBase}%` }}
                ></div>
                <div 
                  className="bg-red-500 h-full transition-all duration-200"
                  style={{ width: `${percentCation}%` }}
                ></div>
              </div>
              <div className="flex justify-between gap-3 text-xs font-mono">
                <span className="text-red-400 font-bold">Cation [RNH+] (Water-Soluble, Repelled by Sheath)</span>
                <span className="text-red-400 font-bold">{percentCation.toFixed(1)}%</span>
              </div>
            </div>

            {/* Visual Membrane Permeability Status Box */}
            <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start space-x-3 ${
              tissuePh < 6.2 
                ? 'bg-red-950/70 border-red-500/50 text-red-200' 
                : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
            }`}>
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${tissuePh < 6.2 ? 'text-red-400' : 'text-emerald-400'}`} />
              <div>
                <strong>{tissuePh < 6.2 ? 'CLINICAL FAILURE ALERT: Infection Barrier Active' : 'OPTIMAL CLINICAL ONSET: Rapid Diffusion'}</strong>
                <p className="mt-1">
                  {tissuePh < 6.2 
                    ? `At pH ${tissuePh.toFixed(1)}, extracellular free base drops to only ${percentBase.toFixed(1)}%! Insufficient free base is available to penetrate the lipophilic perineurium. Injecting into active infection also risks spreading abscess microbes.` 
                    : `At normal physiological pH ${tissuePh.toFixed(1)}, roughly ${percentBase.toFixed(1)}% of molecules exist as lipophilic free base (RN), enabling rapid membrane penetration within 3–5 minutes.`}
                </p>
              </div>
            </div>
          </div>

          {/* Medical Consultations Checklist & Guidelines */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] flex items-center space-x-1.5">
                <Heart className="w-4 h-4 text-red-600" />
                <span>Physician Consultations for Vasoconstrictors</span>
              </span>
              <p className="text-xs leading-relaxed">
                Patients with the following conditions require a physician consultation prior to administering local anesthetics with vasoconstrictors:
              </p>
              <ul className="text-xs space-y-1.5 text-slate-800 list-disc list-inside">
                <li><strong>Hyperthyroidism</strong> (risk of thyroid storm)</li>
                <li><strong>Cardiovascular disease</strong> & severe hypertension</li>
                <li><strong>Uncontrolled Diabetes Mellitus</strong></li>
                <li>Concomitant <strong>Tricyclic Antidepressants (TCAs)</strong></li>
                <li><strong>MAO Inhibitors</strong> (Monoamine oxidase inhibitors)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-[#1E293B]">Topical Anesthesia Fact:</span>
              <p>Topical agents (Benzocaine up to 20%, Lidocaine ointment 5% / spray 10%) penetrate <strong>2–3 mm in depth</strong>, effectively reducing the surface discomfort of initial needle insertion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
