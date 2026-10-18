import React, { useState, useEffect } from 'react';
import {
  Zap,
  Activity,
  Sliders,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  MapPin,
} from 'lucide-react';
import { NERVES_INFO } from '../data/lectureData';

export const NeuroActionPotentialLab: React.FC = () => {
  const [selectedNerve, setSelectedNerve] = useState<'a_delta' | 'c_fibers' | 'a_beta'>('a_delta');
  const [stimulusIntensity, setStimulusIntensity] = useState<number>(45); // 0 to 100%
  const [stimulusDuration, setStimulusDuration] = useState<'brief' | 'sustained'>('brief');

  // Animation pulse clock
  const [oscPhase, setOscPhase] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setOscPhase((p) => (p + 1) % 100);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const nerve = NERVES_INFO[selectedNerve];

  // Biophysical recruitment calculations
  const isADeltaRecruited = stimulusIntensity >= 15;
  const isCFiberRecruited = stimulusIntensity >= 60 || stimulusDuration === 'sustained';
  const isABetaRecruited = stimulusIntensity >= 10;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-blue-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-950 text-blue-400 border border-blue-800 shadow-md">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-100 font-mono text-base tracking-wide">
                Neuro-Electrophysiology &amp; Action Potential Oscilloscope
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-bold uppercase">
                Lecture 1 • Page 2 Nerves
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare conduction speeds, thresholds, and action potential waveforms of <strong className="text-cyan-400">Aδ</strong>, <strong className="text-rose-400">C-fibers</strong>, and <strong className="text-purple-400">Aβ</strong> proprioceptors.
            </p>
          </div>
        </div>
      </div>

      {/* Nerve Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: 'a_delta',
            name: 'A-delta (Aδ) Fibers',
            speed: '12 – 30 m/s',
            type: 'Myelinated (Fast)',
            role: 'Sharp, momentary, vitality indicator',
            color: 'border-cyan-500 bg-cyan-950/70 text-cyan-300',
            inactive: 'border-slate-800 bg-slate-900/60 text-slate-400',
          },
          {
            id: 'c_fibers',
            name: 'C-Fibers (Deep Pulp Core)',
            speed: '0.5 – 2 m/s',
            type: 'Unmyelinated (Slow)',
            role: 'Dull, throbbing, spontaneous, ischemic',
            color: 'border-rose-500 bg-rose-950/70 text-rose-300',
            inactive: 'border-slate-800 bg-slate-900/60 text-slate-400',
          },
          {
            id: 'a_beta',
            name: 'A-beta (Aβ) Proprioceptors',
            speed: '30 – 70 m/s',
            type: 'Heavily Myelinated (Ultra-fast)',
            role: 'PDL socket mechanoreceptors, localized',
            color: 'border-purple-500 bg-purple-950/70 text-purple-300',
            inactive: 'border-slate-800 bg-slate-900/60 text-slate-400',
          },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedNerve(item.id as any)}
            className={`p-4 rounded-3xl border text-left transition-all shadow-lg ${
              selectedNerve === item.id ? `${item.color} ring-1 ring-cyan-500/30` : item.inactive
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold">{item.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">
                {item.speed}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 mt-1 font-semibold">{item.type}</div>
            <div className="text-[11px] text-slate-400 mt-1">{item.role}</div>
          </button>
        ))}
      </div>

      {/* Oscilloscope Waveform & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Oscilloscope Canvas (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/95 border border-slate-800 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
                Live Electrophysiology Oscilloscope Trace
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">
              Sweep: 2.0 ms/div • Sens: 20 mV/div
            </span>
          </div>

          {/* Oscilloscope SVG Screen */}
          <div className="relative w-full h-64 rounded-2xl bg-slate-950 border border-cyan-500/30 p-3 overflow-hidden select-none">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />

            <svg viewBox="0 0 500 200" className="w-full h-full relative z-10">
              {/* Baseline Membrane Potential: -70 mV at y=150 */}
              <line x1="10" y1="150" x2="490" y2="150" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="15" y="145" fill="#64748b" fontSize="10" fontFamily="monospace">
                -70 mV (Resting Potential)
              </text>
              <text x="15" y="55" fill="#64748b" fontSize="10" fontFamily="monospace">
                +30 mV (Peak Depolarization)
              </text>
              <line x1="10" y1="60" x2="490" y2="60" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />

              {/* Dynamic Waveform Trace */}
              {selectedNerve === 'a_delta' && (
                <path
                  d={`M 20 150 L 100 150 Q 115 150 120 140 L 135 40 L 150 165 Q 165 175 190 150 L 480 150`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {selectedNerve === 'c_fibers' && (
                <path
                  d={`M 20 150 L 160 150 Q 200 150 230 75 Q 260 70 290 160 Q 320 180 370 150 L 480 150`}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}

              {selectedNerve === 'a_beta' && (
                <path
                  d={`M 20 150 L 60 150 L 75 30 L 90 165 L 110 150 L 125 35 L 140 165 L 160 150 L 480 150`}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* Latency measurement label */}
              {selectedNerve === 'a_delta' && (
                <text x="130" y="30" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Fast Spike: 1.0 ms • Saltatory Conduction (12-30 m/s)
                </text>
              )}
              {selectedNerve === 'c_fibers' && (
                <text x="210" y="45" fill="#f43f5e" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Slow Wave: 4.5 ms • Continuous Conduction (0.5-2 m/s)
                </text>
              )}
              {selectedNerve === 'a_beta' && (
                <text x="100" y="25" fill="#a855f7" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Ultra-Fast Burst: 0.5 ms • Heavily Myelinated (30-70 m/s)
                </text>
              )}
            </svg>

            {/* Bottom Readout */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-lg">
              <span className="text-slate-400">
                Fiber: <strong className="text-slate-200">{nerve.name}</strong>
              </span>
              <span className="text-slate-400">
                Speed: <strong className="text-cyan-300">{nerve.conductionSpeed}</strong>
              </span>
              <span className="text-slate-400">
                Threshold: <strong className="text-amber-300">{nerve.threshold}</strong>
              </span>
            </div>
          </div>

          {/* Biological Correlation Explanatory Note */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs text-slate-300 leading-relaxed">
            <span className="font-mono text-cyan-300 font-bold uppercase block text-[11px]">
              Why Pulp Has &quot;First Pain&quot; vs. &quot;Second Pain&quot; (Lecture 1 Core):
            </span>
            <p>
              When an ice pellet contacts exposed dentin, the rapidly conducted <strong>Aδ action potentials (12–30 m/s)</strong> arrive at the cortex within 10 milliseconds, triggering the initial sharp, pricking sensation. If the thermal stimulus persists or tissue pressure rises, the unmyelinated <strong>C-fibers (0.5–2 m/s)</strong> slowly depolarize, resulting in the delayed, diffuse, deep throbbing ache that persists long after the stimulus is removed.
            </p>
          </div>
        </div>

        {/* Controls & Anatomy Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Interactive Stimulus Slider */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Stimulus Intensity &amp; Recruitment Threshold:
            </span>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Stimulus Intensity:</span>
                <span className="text-cyan-400 font-bold">{stimulusIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={stimulusIntensity}
                onChange={(e) => setStimulusIntensity(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0% (Subthreshold)</span>
                <span>100% (Extreme Noxious)</span>
              </div>
            </div>

            {/* Fiber Recruitment Status */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Nerve Fiber Recruitment at {stimulusIntensity}%:
              </span>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-mono text-cyan-300">Aδ Fibers (Threshold ~15%):</span>
                <span className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
                  isADeltaRecruited ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-500'
                }`}>
                  {isADeltaRecruited ? 'FIRING (Sharp Pain)' : 'SILENT'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-mono text-rose-300">C-Fibers (Threshold ~60%):</span>
                <span className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
                  isCFiberRecruited ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' : 'bg-slate-800 text-slate-500'
                }`}>
                  {isCFiberRecruited ? 'FIRING (Throbbing Agony)' : 'QUIESCENT'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-mono text-purple-300">Aβ PDL Mechanoreceptors:</span>
                <span className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
                  isABetaRecruited ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-slate-800 text-slate-500'
                }`}>
                  {isABetaRecruited ? 'FIRING (Pinpoint Spatial)' : 'SILENT'}
                </span>
              </div>
            </div>
          </div>

          {/* Anatomical Details Card */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {nerve.name} Anatomical Specs:
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Anatomical Location:</span>
                <span className="text-slate-200 font-semibold">{nerve.location}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Pain Character:</span>
                <span className="text-slate-200 font-semibold">{nerve.painType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Activation Stimulus:</span>
                <span className="text-slate-200 font-semibold">{nerve.stimulation}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Clinical Significance:</span>
                <span className="text-cyan-300 text-right font-medium max-w-[200px] leading-tight">
                  {nerve.significance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
