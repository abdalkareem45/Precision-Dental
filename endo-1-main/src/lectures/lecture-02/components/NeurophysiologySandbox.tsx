/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  Flame, 
  Snowflake, 
  Zap, 
  HeartPulse, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  Info, 
  Activity,
  Play,
  RotateCcw
} from 'lucide-react';

export default function NeurophysiologySandbox() {
  const [selectedStimulus, setSelectedStimulus] = useState<'cold' | 'heat' | 'ept' | 'pressure' | 'hypoxia'>('cold');
  const [selectedLayer, setSelectedLayer] = useState<'enamel' | 'dentin' | 'pulp' | 'apex'>('pulp');
  const [prtLevel, setPrtLevel] = useState<number>(35);
  const [isAnxious, setIsAnxious] = useState<boolean>(true);
  const [isFatigued, setIsFatigued] = useState<boolean>(false);
  const [isInitialPain, setIsInitialPain] = useState<boolean>(true);
  const [actionPotentialRunning, setActionPotentialRunning] = useState<boolean>(false);
  const [apFiberType, setApFiberType] = useState<'delta' | 'c'>('delta');
  const [apProgress, setApProgress] = useState<number>(0);

  // Compute effective PRT threshold
  const effectivePrt = Math.max(
    10,
    prtLevel - (isAnxious ? 15 : 0) - (isFatigued ? 10 : 0) - (isInitialPain ? 15 : 0)
  );

  useEffect(() => {
    if (!actionPotentialRunning) return;

    const speed = apFiberType === 'delta' ? 40 : 120; // A-delta is much faster
    let p = 0;
    let completionTimeout: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      p += 5;
      setApProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        completionTimeout = setTimeout(() => setActionPotentialRunning(false), 500);
      }
    }, speed);

    return () => {
      clearInterval(interval);
      clearTimeout(completionTimeout);
    };
  }, [actionPotentialRunning, apFiberType]);

  const triggerActionPotential = (fiber: 'delta' | 'c') => {
    if (actionPotentialRunning) return;
    setApFiberType(fiber);
    setApProgress(0);
    setActionPotentialRunning(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-red-100 rounded-xl text-[#DC2626]">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Module 1</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">Pulpal Neurophysiology & Nociception</h2>
          </div>
        </div>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Noxious stimuli in teeth are transmitted by primary afferent nociceptors located in the trigeminal ganglion, terminating inside the pulp-dentin complex. All noxious modalities (thermal, mechanical, chemical, electrical) elicit the sensation of <strong className="text-[#DC2626]">pain</strong> due to dense nociceptive innervation.
        </p>
      </div>

      {/* SANDBOX 1: DYNAMIC TOOTH HISTOLOGY & STIMULUS PROPAGATION */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-[#1E293B]">Tooth Nociception & Hydrodynamic Pulp Sandbox</h3>
            <p className="text-xs text-slate-500 mt-0.5">Explore the pulp-dentin complex, hydrodynamic fluid shifts, and sensory fiber activation</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-600">Stimulus:</span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'cold', label: 'Cold (-5°C)', icon: Snowflake, color: 'text-sky-500' },
                { id: 'heat', label: 'Heat (+60°C)', icon: Flame, color: 'text-red-500' },
                { id: 'ept', label: 'EPT Electric', icon: Zap, color: 'text-amber-500' },
                { id: 'pressure', label: 'Intrapulpal Pressure', icon: Activity, color: 'text-purple-500' }
              ].map(st => {
                const Icon = st.icon;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStimulus(st.id as typeof selectedStimulus)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                      selectedStimulus === st.id 
                        ? 'bg-[#1E293B] text-white shadow-sm ring-1 ring-[#0284C7]' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${st.color}`} />
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive SVG Sandbox Canvas */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 relative flex flex-col items-center justify-center min-h-85 shadow-inner overflow-hidden">
            <div className="absolute top-3 left-4 text-[11px] font-mono text-slate-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE HISTOLOGICAL VIEW: Click anatomical layers</span>
            </div>

            <svg className="w-64 max-w-full h-80 drop-shadow-2xl" viewBox="0 0 200 250">
              {/* Outer Enamel */}
              <path 
                d="M60,25 Q100,5 140,25 Q175,55 160,110 Q145,170 125,225 L115,240 L85,240 L75,225 Q55,170 40,110 Q25,55 60,25 Z" 
                fill={selectedLayer === 'enamel' ? '#38BDF8' : '#CBD5E1'} 
                stroke="#64748B" 
                strokeWidth="2" 
                className="cursor-pointer transition-all hover:opacity-90"
                role="button"
                tabIndex={0}
                aria-label="Inspect enamel"
                aria-pressed={selectedLayer === 'enamel'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedLayer('enamel');
                  }
                }}
                onClick={() => setSelectedLayer('enamel')}
              />

              {/* Dentin Layer */}
              <path 
                d="M72,40 Q100,22 128,40 Q152,70 140,120 Q128,165 116,215 L108,230 L92,230 L84,215 Q72,165 60,120 Q48,70 72,40 Z" 
                fill={selectedLayer === 'dentin' ? '#FBBF24' : '#FDE68A'} 
                stroke="#D97706" 
                strokeWidth="1.5" 
                className="cursor-pointer transition-all hover:opacity-90"
                role="button"
                tabIndex={0}
                aria-label="Inspect dentin"
                aria-pressed={selectedLayer === 'dentin'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedLayer('dentin');
                  }
                }}
                onClick={() => setSelectedLayer('dentin')}
              />

              {/* Dentin Tubule Wavefronts (Animated if Cold or Heat) */}
              {selectedStimulus === 'cold' && (
                <g stroke="#0284C7" strokeWidth="1.5" strokeDasharray="2,3" className="animate-pulse">
                  <line x1="80" y1="50" x2="90" y2="70" />
                  <line x1="120" y1="50" x2="110" y2="70" />
                  <line x1="65" y1="100" x2="85" y2="105" />
                  <line x1="135" y1="100" x2="115" y2="105" />
                </g>
              )}

              {/* Dental Pulp Chamber & Canal */}
              <path 
                d="M86,70 Q100,58 114,70 Q124,100 114,145 Q108,180 104,225 L96,225 Q92,180 86,145 Q76,100 86,70 Z" 
                fill={selectedLayer === 'pulp' ? '#EF4444' : '#FCA5A5'} 
                stroke="#DC2626" 
                strokeWidth="2" 
                className="cursor-pointer transition-all hover:opacity-95"
                role="button"
                tabIndex={0}
                aria-label="Inspect pulp"
                aria-pressed={selectedLayer === 'pulp'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedLayer('pulp');
                  }
                }}
                onClick={() => setSelectedLayer('pulp')}
              />

              {/* Odontoblast layer rim */}
              <path 
                d="M84,68 Q100,56 116,68 Q126,98 116,143 Q110,178 106,223" 
                fill="none" 
                stroke="#0284C7" 
                strokeWidth="2.5" 
                strokeDasharray="3,2" 
              />
              <path 
                d="M84,68 Q100,56 84,68 Q74,98 84,143 Q90,178 94,223" 
                fill="none" 
                stroke="#0284C7" 
                strokeWidth="2.5" 
                strokeDasharray="3,2" 
              />

              {/* A-delta myelinated fiber tree (terminating at pulp-dentin junction) */}
              <g stroke="#38BDF8" strokeWidth="2.5" fill="none">
                <path d="M100,225 L100,140 Q100,90 92,75" />
                <path d="M100,140 Q100,90 108,75" />
                {selectedStimulus !== 'pressure' && (
                  <circle cx="92" cy="75" r="3.5" fill="#38BDF8" className="animate-ping" />
                )}
              </g>

              {/* C-fiber unmyelinated plexus throughout central core */}
              <g stroke="#F87171" strokeWidth="1.5" fill="none" strokeDasharray="1,2">
                <path d="M98,225 Q104,170 96,130 Q104,100 100,85" />
                <path d="M96,130 Q90,110 94,95" />
                <path d="M100,130 Q108,110 104,95" />
                {(selectedStimulus === 'heat' || selectedStimulus === 'pressure') && (
                  <circle cx="100" cy="85" r="3.5" fill="#DC2626" className="animate-ping" />
                )}
              </g>

              {/* Apical Foramen Marker */}
              <rect 
                x="92" 
                y="223" 
                width="16" 
                height="15" 
                fill={selectedLayer === 'apex' ? '#D97706' : '#64748B'} 
                rx="3" 
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Inspect apical foramen"
                aria-pressed={selectedLayer === 'apex'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedLayer('apex');
                  }
                }}
                onClick={() => setSelectedLayer('apex')}
              />
            </svg>

            {/* Stimulus Indicator Pill */}
            <div className="mt-3 flex flex-wrap items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl">
              <span className="text-xs text-slate-300 font-mono">Sensory Activation:</span>
              {selectedStimulus === 'cold' && (
                <span className="text-xs font-bold text-sky-400 flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Aδ Fibers Exclusively (Sharp, Instant, Intermittent)</span>
                </span>
              )}
              {selectedStimulus === 'heat' && (
                <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Aδ and C Fibers (Sharp onset followed by dull aching)</span>
                </span>
              )}
              {selectedStimulus === 'ept' && (
                <span className="text-xs font-bold text-sky-400 flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Aδ Fibers (Threshold ionic current)</span>
                </span>
              )}
              {selectedStimulus === 'pressure' && (
                <span className="text-xs font-bold text-red-400 flex items-center space-x-1">
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>C Fibers Exclusively (Intense burning, aching, throbbing)</span>
                </span>
              )}
            </div>
          </div>

          {/* Interactive Layer Inspector & Pathophysiology Feedback */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7]">Selected Structure</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedLayer === 'enamel' && 'Enamel (Acellular Hydrodynamic Barrier)'}
                {selectedLayer === 'dentin' && 'Dentin Tubules & Odontoblast Processes'}
                {selectedLayer === 'pulp' && 'Pulp Core (Aδ & C Fiber Innervation)'}
                {selectedLayer === 'apex' && 'Apical Foramen & Main Trigeminal Trunk'}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {selectedLayer === 'enamel' && 'Acellular, devoid of nerve fibers. Thermal stimuli cause volumetric thermal expansion/contraction of dentinal tubular fluid, transmitting mechanical stress to the pulp border.'}
                {selectedLayer === 'dentin' && 'Filled with dentinal fluid. Fluid movement inward or outward stimulates the sub-odontoblastic plexus of Raschkow, activating myelinated Aδ fibers for fast acute pain.'}
                {selectedLayer === 'pulp' && 'Contains unmyelinated C fibers (3x more numerous than Aδ). Releases Substance P and CGRP causing vasodilation, elevated intrapulpal pressure, and intense pain.'}
                {selectedLayer === 'apex' && 'Entry portal for sensory axons from the inferior alveolar or superior dental plexus. Also the entry point for vasoconstricted local anesthetic solutions.'}
              </p>
            </div>

            {/* Quick Fiber Comparison Stat Bar */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                <span className="font-bold text-[#0284C7]">Aδ (Delta) Fiber</span>
                <div className="text-[11px] text-slate-600 mt-1">Myelinated, 1–5 µm</div>
                <div className="text-[11px] font-semibold text-sky-800 mt-0.5">Speed: 6–30 m/s</div>
                <div className="text-[11px] text-slate-500 mt-1">Sharp, instant pain</div>
              </div>

              <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                <span className="font-bold text-[#DC2626]">C Fiber</span>
                <div className="text-[11px] text-slate-600 mt-1">Unmyelinated, 0.4–1.2 µm</div>
                <div className="text-[11px] font-semibold text-red-800 mt-0.5">Speed: 0.5–2 m/s</div>
                <div className="text-[11px] text-slate-500 mt-1">Dull, burning, aching</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SANDBOX 2: AXON CONDUCTION & PAIN REACTION THRESHOLD (PRT) SIMULATOR */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#1E293B]">Axonal Conduction & Pain Reaction Threshold (PRT) Sandbox</h3>
          <p className="text-xs text-slate-500 mt-0.5">Compare saltatory myelinated conduction vs slow unmyelinated conduction and test psychophysiological PRT modifiers. Animation timing and PRT percentages are educational simplifications, not calibrated measurements.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Axon Conduction Visualizer */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white space-y-6 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-400">Interactive Action Potential Simulator</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => triggerActionPotential('delta')}
                  disabled={actionPotentialRunning}
                  className="px-3 py-1.5 rounded-lg bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-600 transition disabled:opacity-50 flex items-center space-x-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Fire Aδ (Saltatory Fast)</span>
                </button>
                <button
                  onClick={() => triggerActionPotential('c')}
                  disabled={actionPotentialRunning}
                  className="px-3 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs font-bold hover:bg-red-600 transition disabled:opacity-50 flex items-center space-x-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Fire C (Continuous Slow)</span>
                </button>
              </div>
            </div>

            {/* Simulated Nerve Axon Track */}
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-400 mb-1">
                  <span>Aδ Axon (Myelinated with Nodes of Ranvier)</span>
                  <span className="font-mono text-sky-400">Saltatory Jump (~30 m/s)</span>
                </div>
                <div className="h-8 bg-slate-800 rounded-lg relative overflow-hidden flex items-center px-2 border border-slate-700">
                  {/* Nodes of Ranvier segments */}
                  <div className="absolute inset-0 flex justify-between px-6 pointer-events-none">
                    {[0, 1, 2, 3, 4].map(n => (
                      <div key={n} className="w-1.5 h-full bg-slate-900/90 border-x border-sky-400/30"></div>
                    ))}
                  </div>
                  {actionPotentialRunning && apFiberType === 'delta' && (
                    <div 
                      className="h-5 w-8 bg-sky-400 rounded-full shadow-lg shadow-sky-400/80 transition-all duration-75 flex items-center justify-center text-[10px] font-black text-slate-950"
                      style={{ left: `${Math.min(92, apProgress)}%`, position: 'absolute' }}
                    >
                      ⚡
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-400 mb-1">
                  <span>C-Fiber Axon (Naked Unmyelinated Core)</span>
                  <span className="font-mono text-red-400">Continuous Wave (~1 m/s)</span>
                </div>
                <div className="h-8 bg-slate-800 rounded-lg relative overflow-hidden flex items-center px-2 border border-slate-700">
                  {actionPotentialRunning && apFiberType === 'c' && (
                    <div 
                      className="h-5 w-6 bg-red-500 rounded-full shadow-lg shadow-red-500/80 transition-all duration-100 flex items-center justify-center text-[10px] font-black text-white"
                      style={{ left: `${Math.min(92, apProgress)}%`, position: 'absolute' }}
                    >
                      🔥
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Neurogenic Inflammation Pathway */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-[#D97706] flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-red-500" />
                <span>Neurogenic Inflammation Pathway (Substance P & CGRP)</span>
              </span>
              <p className="text-slate-300 leading-relaxed">
                Stimulated C fibers release vasoactive neuropeptides (<strong className="text-white">Substance P</strong> and <strong className="text-white">CGRP</strong>) into the confined pulpal space. This induces arteriolar vasodilation, capillary permeability, and edema in a rigid, non-compliant dentin chamber, dramatically multiplying intrapulpal pressure.
              </p>
            </div>
          </div>

          {/* PRT Psychophysiological Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#1E293B]">Pain Reaction Threshold (PRT)</span>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${effectivePrt < 25 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                  {effectivePrt}% Threshold
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Baseline PRT Level</span>
                  <span>{prtLevel}%</span>
                </div>
                <input 
                  type="range"
                  aria-label="Baseline pain reaction threshold"
                  min="20" 
                  max="80" 
                  value={prtLevel}
                  onChange={(e) => setPrtLevel(Number(e.target.value))}
                  className="w-full accent-[#0284C7]" 
                />
              </div>

              {/* Factors Lowering PRT Checkboxes */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-700 block">Lecture Factors That Lower PRT:</span>
                
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isInitialPain} 
                    onChange={(e) => setIsInitialPain(e.target.checked)}
                    className="rounded text-[#DC2626] focus:ring-[#DC2626]" 
                  />
                  <span>1. Presence of pain at beginning of treatment (-15%)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isFatigued} 
                    onChange={(e) => setIsFatigued(e.target.checked)}
                    className="rounded text-[#DC2626] focus:ring-[#DC2626]" 
                  />
                  <span>2. Fatigue / sleep deprivation (-10%)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isAnxious} 
                    onChange={(e) => setIsAnxious(e.target.checked)}
                    className="rounded text-[#DC2626] focus:ring-[#DC2626]" 
                  />
                  <span>3. Fear and dental anxiety (-15%)</span>
                </label>
              </div>

              {/* Clinical Precaution Alert */}
              <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                effectivePrt < 25 
                  ? 'bg-red-50 border-red-200 text-red-900' 
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="font-bold flex items-center space-x-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Catecholamine Elevation & Supine Injection</span>
                </div>
                Severe pain triggers acute blood catecholamine elevation (tachycardia, hypertension), risking syncope, angina pectoris, or asthma attacks. 
                <strong className="block mt-1">Clinical Directive: Always introduce local anesthetic SLOWLY and with the patient in a SUPINE position.</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
