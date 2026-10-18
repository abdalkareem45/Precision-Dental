/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Flame, 
  Snowflake, 
  Activity, 
  HeartPulse, 
  AlertTriangle, 
  Sliders, 
  RefreshCw, 
  CheckCircle2,
  Gauge,
  Play,
  Pause
} from 'lucide-react';

const STIMULI = [
  { id: 'Cold', label: 'Cold (-5°C)', delta: true, c: false, desc: 'Transmitted instantly by myelinated Aδ fibers near pulp-dentin complex.' },
  { id: 'Heat', label: 'Heat (+60°C)', delta: true, c: true, desc: 'Activates fast Aδ fibers first, followed by burning C fiber depolarization.' },
  { id: 'Ion Effect', label: 'Ion Effect', delta: true, c: false, desc: 'Direct mechanical & ionic stimulation of Aδ nerve endings.' },
  { id: 'EPT', label: 'Electric Pulp Test (EPT)', delta: true, c: false, desc: 'Selectively excites low-threshold Aδ fibers.' },
  { id: 'Hypoxia', label: 'Hypoxia / Ischemia', delta: false, c: true, desc: 'Oxygen starvation excites resistant unmyelinated C fibers.' },
  { id: 'Pulpal Pressure', label: '↑ Pulpal Pressure', delta: false, c: true, desc: 'Edema & hydrostatic pressure in rigid chamber fires C fibers.' },
  { id: 'Hyperosmotic', label: 'Hyperosmotic Solution', delta: true, c: false, desc: 'Rapid outward fluid shift excites Aδ mechanoreceptors.' },
  { id: 'Mediators', label: 'Inflammatory Mediators', delta: false, c: true, desc: 'Bradykinin, PGE2, and cytokines directly excite C fibers.' }
];

export default function GrandVisualizerSandbox() {
  const [selectedStimulus, setSelectedStimulus] = useState<string>('Cold');
  const [isInflamed, setIsInflamed] = useState<boolean>(true);
  const [pressureMmHg, setPressureMmHg] = useState<number>(28); // 10 normal to 50 severe
  const [oscilloscopeActive, setOscilloscopeActive] = useState<boolean>(true);
  const [sweepSpeed, setSweepSpeed] = useState<'fast' | 'slow'>('fast');
  const [animTime, setAnimTime] = useState<number>(0);

  useEffect(() => {
    if (!oscilloscopeActive) return;
    const interval = setInterval(() => {
      setAnimTime(t => (t + 1) % 60);
    }, sweepSpeed === 'fast' ? 40 : 100);
    return () => clearInterval(interval);
  }, [oscilloscopeActive, sweepSpeed]);

  const currentSt = STIMULI.find(s => s.id === selectedStimulus) || STIMULI[0];
    // Reuse the manometer's existing illustrative threshold across all feedback.
    const elevatedPressure = pressureMmHg > 25;
    const cFiberActive = currentSt.c || isInflamed || elevatedPressure;
    const cFiberSources = [
      currentSt.c ? 'selected stimulus' : null,
      isInflamed ? 'neurogenic inflammation' : null,
      elevatedPressure ? 'elevated pressure' : null,
    ].filter(source => source !== null).join(', ');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-amber-100 rounded-xl text-[#D97706]">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Specialized Simulator</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">Aδ vs. C Fiber & Stimulus Response Simulator</h2>
          </div>
        </div>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Interactive laboratory comparing fast myelinated Aδ fibers (sharp, instant, intermittent pain) vs unmyelinated C fibers (3x more numerous, dull, burning, aching pain) under varying intrapulpal and neurogenic inflammatory conditions.
        </p>
      </div>

      {/* SANDBOX 1: 2D PULP CHAMBER & STIMULUS MATRIX EXPLORER */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-[#1E293B]">2D Pulp Chamber & Fiber Excitation Sandbox</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select stimuli from Table 1 (Samir et al., 2023) and toggle neurogenic inflammation</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsInflamed(!isInflamed)}
              aria-pressed={isInflamed}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                isInflamed ? 'bg-red-600 text-white shadow' : 'bg-slate-200 text-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isInflamed ? 'Neurogenic Inflammation: ACTIVE' : 'Healthy Pulp State'}</span>
            </button>
          </div>
        </div>

        {/* Stimulus selection buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STIMULI.map(st => (
            <button
              key={st.id}
              onClick={() => setSelectedStimulus(st.id)}
              aria-pressed={selectedStimulus === st.id}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedStimulus === st.id 
                  ? 'bg-[#1E293B] text-white border-[#0284C7] shadow' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold text-xs">{st.label}</div>
              <div className="text-[10px] opacity-75 mt-0.5">
                {st.delta && st.c ? 'Both Aδ & C' : st.delta ? 'Aδ Fast Only' : 'C Slow Only'}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual 2D Pulp Chamber Canvas */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 text-white min-h-85 flex flex-col justify-between shadow-inner relative overflow-hidden">
            <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-mono text-slate-400">
              <span>PULP CAVITY INNERVATION DYNAMICS</span>
              <span className="text-emerald-400 font-bold">Live Nociceptive Stream</span>
            </div>

            {/* SVG Visualizer */}
            <div className="relative my-3 flex justify-center">
              <svg className="w-full h-52" viewBox="0 0 340 180">
                {/* Dentin Rim */}
                <path d="M100,20 Q170,10 240,20 Q270,60 250,110 L220,165 L120,165 L90,110 Q70,60 100,20 Z" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                
                {/* Pulp Chamber Coronal Core */}
                <path 
                  d="M120,40 Q170,30 220,40 Q240,75 220,110 L200,165 L140,165 L120,110 Q100,75 120,40 Z" 
                  fill={isInflamed ? "#7f1d1d" : "#991b1b"} 
                  className={isInflamed ? "animate-pulse" : ""}
                />

                {/* Substance P / CGRP Vasodilation Vessels */}
                <path d="M150,165 Q160,110 155,50" stroke={isInflamed ? "#EF4444" : "#DC2626"} strokeWidth={isInflamed ? "6" : "3"} fill="none" opacity="0.8" />
                <path d="M190,165 Q180,110 185,50" stroke="#38BDF8" strokeWidth="3" fill="none" opacity="0.8" />

                {/* A-delta myelinated fibers (Blue, branching at periphery) */}
                <g stroke="#38BDF8" strokeWidth="2" fill="none">
                  <path d="M170,165 L170,90 Q150,60 125,45" />
                  <path d="M170,90 Q190,60 215,45" />
                  {currentSt.delta && (
                    <circle cx="125" cy="45" r="4" fill="#38BDF8" className="animate-ping" />
                  )}
                  {currentSt.delta && (
                    <circle cx="215" cy="45" r="4" fill="#38BDF8" className="animate-ping" />
                  )}
                </g>

                {/* C unmyelinated fibers (Red, distributed throughout pulp core, 3x more numerous) */}
                <g stroke="#F87171" strokeWidth="1.5" fill="none" strokeDasharray="2,2">
                  <path d="M165,165 Q175,120 165,80 Q150,70 160,55" />
                  <path d="M165,120 Q180,95 185,75" />
                  <path d="M165,140 Q150,120 145,100" />
                  {cFiberActive && (
                    <circle cx="160" cy="55" r="4" fill="#DC2626" className="animate-ping" />
                  )}
                </g>

                {/* Stimulus Icon Overlay */}
                <rect x="15" y="15" width="85" height="28" rx="6" fill="#0284C7" opacity="0.85" />
                <text x="57" y="32" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">{selectedStimulus}</text>
              </svg>
            </div>

            {/* Stimulus Rationale Insight */}
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs flex items-center justify-between">
              <span className="text-slate-300">{currentSt.desc}</span>
            </div>
          </div>

          {/* Real-time Status Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7]">Table 1 Lecture Reference</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">Combined Excitation Status for {selectedStimulus}</h4>
                            <p className="text-xs text-slate-600 mt-2">
                              C-fiber activation sources: {cFiberSources || 'none'}. The stimulus buttons describe the selected stimulus alone; this status also includes inflammation and the manometer setting.
                            </p>
              
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-sky-50 border border-sky-100">
                  <span className="font-bold text-[#0284C7]">Aδ-Fibers Response:</span>
                  <span className={`font-black px-2 py-0.5 rounded ${currentSt.delta ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                    {currentSt.delta ? 'POSITIVE (✓)' : 'NEGATIVE (×)'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-red-50 border border-red-100">
                  <span className="font-bold text-[#DC2626]">C-Fibers Response:</span>
                  <span className={`font-black px-2 py-0.5 rounded ${cFiberActive ? 'bg-red-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                    {cFiberActive ? 'POSITIVE (✓)' : 'NEGATIVE (×)'}
                  </span>
                </div>
              </div>
            </div>

            {isInflamed && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <span className="font-bold flex items-center space-x-1.5 text-[#D97706]">
                  <Flame className="w-4 h-4 text-red-600" />
                  <span>Neurogenic Inflammation Active</span>
                </span>
                <p>
                  Release of <strong>Substance P</strong> and <strong>CGRP</strong> causes vasodilation, increasing pulpal blood volume in a low-compliance rigid dentin chamber. Intrapulpal pressure rises, intensifying continuous pain.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SANDBOX 2: DUAL-CHANNEL OSCILLOSCOPE & INTRAPULPAL PRESSURE MANOMETER */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#1E293B]">Dual-Channel Oscilloscope & Pulpal Pressure Manometer Sandbox</h3>
          <p className="text-xs text-slate-500 mt-0.5">Explore illustrative action potential traces and hydrostatic tissue pressure. The existing cutoff above 25 mmHg is an educational switch for C-fiber activation, not a validated clinical threshold. Traces and animation timing are schematic, not calibrated recordings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Dual Channel Oscilloscope Canvas */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 text-white space-y-5 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-400">DUAL-CHANNEL NEURO-OSCILLOSCOPE</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSweepSpeed(sweepSpeed === 'fast' ? 'slow' : 'fast')}
                  className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-mono hover:bg-slate-700"
                >
                  Sweep: {sweepSpeed.toUpperCase()}
                </button>
                <button
                  onClick={() => setOscilloscopeActive(!oscilloscopeActive)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-mono hover:bg-slate-700 flex items-center space-x-1"
                >
                  {oscilloscopeActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{oscilloscopeActive ? 'Pause' : 'Run'}</span>
                </button>
              </div>
            </div>

            {/* Simulated Oscilloscope Screen */}
            <div className="h-44 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden p-3 font-mono">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-20">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="border border-slate-600"></div>
                ))}
              </div>

              {/* Trace 1: A-delta (Fast Spike, Sharp Peak) */}
              <div className="relative h-16 flex items-center">
                <span className="text-[10px] text-sky-400 absolute left-2 top-0 font-bold">CH1: Aδ Myelinated (Fast Sharp Spike 30 m/s)</span>
                <svg className="w-full h-12" viewBox="0 0 300 40">
                  <path 
                    d={currentSt.delta ? 'M0,25 L80,25 L95,5 L105,35 L115,25 L300,25' : 'M0,25 L300,25'} 
                    fill="none" 
                    stroke="#38BDF8" 
                    strokeWidth="2" 
                    strokeDasharray={currentSt.delta ? "none" : "2,2"}
                  />
                  {currentSt.delta && (
                    <circle cx={(animTime * 5) % 300} cy="25" r="3" fill="#38BDF8" />
                  )}
                </svg>
              </div>

              {/* Trace 2: C-fiber (Slow Depolarization Wave) */}
              <div className="relative h-16 flex items-center border-t border-slate-800">
                <span className="text-[10px] text-red-400 absolute left-2 top-0 font-bold">CH2: C Unmyelinated (Slow Burning Depolarization 1 m/s)</span>
                <svg className="w-full h-12" viewBox="0 0 300 40">
                  <path 
                    d={cFiberActive ? 'M0,25 L60,25 Q110,5 160,25 L300,25' : 'M0,25 L300,25'} 
                    fill="none" 
                    stroke="#F87171" 
                    strokeWidth="2" 
                    strokeDasharray={cFiberActive ? "none" : "2,2"}
                  />
                  {cFiberActive && (
                    <circle cx={(animTime * 5) % 300} cy="25" r="3" fill="#EF4444" />
                  )}
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-2 text-[11px] text-slate-400 font-mono">
              <span>Time Base: 5 ms/div</span>
              <span>Voltage: 20 mV/div</span>
              <span>Reference: Samir et al. (2023)</span>
            </div>
          </div>

          {/* Intrapulpal Pressure Manometer Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="font-bold text-sm text-[#1E293B]">Intrapulpal Pressure Manometer</span>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                  elevatedPressure ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {pressureMmHg} mmHg
                </span>
              </div>

              <input 
                type="range"
                aria-label="Intrapulpal pressure in mmHg"
                min="10" 
                max="50" 
                value={pressureMmHg}
                onChange={(e) => setPressureMmHg(Number(e.target.value))}
                className="w-full accent-[#DC2626]" 
              />

              <div className="flex flex-wrap justify-between gap-2 text-[11px] text-slate-500 font-mono">
                <span>10 mmHg (Healthy)</span>
                <span>25 mmHg (Hyperemia)</span>
                <span>50 mmHg (Severe)</span>
              </div>

              <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                elevatedPressure
                  ? 'bg-red-50 border-red-200 text-red-900' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <strong>{elevatedPressure ? 'Continuous Throbbing Pain Active' : 'Normal Resting Physiological Pressure'}</strong>
                <p className="mt-1">
                  {elevatedPressure
                    ? `Elevated pressure (${pressureMmHg} mmHg) continuously excites unmyelinated C fibers via mechanical compression, causing severe spontaneous aching pain characteristic of irreversible pulpitis.` 
                    : `Resting pressure (${pressureMmHg} mmHg) maintains normal microcirculation through the apical foramen.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
