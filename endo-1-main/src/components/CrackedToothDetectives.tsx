import React, { useState } from 'react';
import {
  Activity,
  Sun,
  Droplet,
  Disc,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Info,
  RotateCcw,
  Box,
  Layers,
  Search,
  Eye,
  Play,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import { ClinicalTestType } from '../types/endodontics';
import confetti from 'canvas-confetti';

interface CrackedToothDetectivesProps {
  onSimulateIn3D?: (testType: ClinicalTestType) => void;
}

export const CrackedToothDetectives: React.FC<CrackedToothDetectivesProps> = ({
  onSimulateIn3D,
}) => {
  const [activeMethodTab, setActiveMethodTab] = useState<'bite_test' | 'staining' | 'transillumination' | 'detective_case' | 'classification'>('bite_test');

  // Method 1: Bite Test Interactive State
  const [selectedCusp, setSelectedCusp] = useState<'MB' | 'DB' | 'ML' | 'DL'>('ML');
  const [biteState, setBiteState] = useState<'rest' | 'biting' | 'released'>('rest');

  // Method 2: Staining Interactive State
  const [stainStep, setStainStep] = useState<'clean' | 'dye_applied' | 'rinsed'>('clean');

  // Method 3: Transillumination Interactive State
  const [lightPosition, setLightPosition] = useState<number>(35); // 0 to 100% position across crown

  // Detective Mystery Case State
  const [mysteryStep, setMysteryStep] = useState<number>(1);
  const [mysteryBiteTested, setMysteryBiteTested] = useState<boolean>(false);
  const [mysteryStained, setMysteryStained] = useState<boolean>(false);
  const [mysteryTransillum, setMysteryTransillum] = useState<boolean>(false);
  const [mysterySolved, setMysterySolved] = useState<boolean>(false);

  const handleBiteDown = () => {
    setBiteState('biting');
  };

  const handleReleaseBite = () => {
    setBiteState('released');
    if (selectedCusp === 'ML') {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
    }
  };

  const resetBiteTest = () => {
    setBiteState('rest');
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 sticky top-0 z-20 backdrop-blur-md shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-[1.5px] shadow-lg shadow-amber-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Search className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-extrabold tracking-wide font-mono text-slate-100">
                  The Cracked Tooth Detectives
                </h2>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-800 font-bold uppercase shadow-sm">
                  Lecture 1 • Page 8 &amp; 9, Fig 7
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Master the definitive 3-step investigative triad: <strong className="text-amber-400">Method 1: The Bite Test</strong>, <strong className="text-cyan-400">Method 2: Staining</strong>, and <strong className="text-rose-400">Method 3: Transillumination</strong>.
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 text-xs shadow-inner overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveMethodTab('bite_test')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                activeMethodTab === 'bite_test'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Disc className="w-4 h-4" />
              <span>Method 1: The Bite Test</span>
            </button>

            <button
              onClick={() => setActiveMethodTab('staining')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                activeMethodTab === 'staining'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Droplet className="w-4 h-4" />
              <span>Method 2: Staining</span>
            </button>

            <button
              onClick={() => setActiveMethodTab('transillumination')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                activeMethodTab === 'transillumination'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Method 3: Transillumination</span>
            </button>

            <button
              onClick={() => setActiveMethodTab('detective_case')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                activeMethodTab === 'detective_case'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Detective Investigation</span>
            </button>

            <button
              onClick={() => setActiveMethodTab('classification')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                activeMethodTab === 'classification'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Fracture Classification</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3 sm:p-5 md:p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* ========================================================================= */}
        {/* METHOD 1: THE BITE TEST (TOOTH SLOOTH & REBOUND REACTION) */}
        {/* ========================================================================= */}
        {activeMethodTab === 'bite_test' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800">
                  <Disc className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 font-mono text-sm">
                    Method 1: The Bite Test (Tooth Slooth Cusp Isolation)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Lecture 1 (Page 8, Fig 7): Rebound pain on sudden release of chewing force is the pathognomonic sign!
                  </p>
                </div>
              </div>
              {onSimulateIn3D && (
                <button
                  onClick={() => onSimulateIn3D('bite_test')}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  <Box className="w-4 h-4" />
                  <span>Simulate in 3D</span>
                </button>
              )}
            </div>

            {/* Interactive Bite Simulator */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Tooth Cusp & Tooth Slooth Device Graphic */}
                <div className="h-64 rounded-2xl bg-slate-950 border border-amber-500/30 p-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">Mandibular 1st Molar #19</span>
                    <span className="text-slate-400">Testing Cusp: {selectedCusp}</span>
                  </div>

                  {/* Dynamic Interactive Mastication Animation */}
                  <div className="relative w-full flex-1 flex flex-col items-center justify-center">
                    {/* Tooth Slooth Device */}
                    <div
                      className={`h-6 w-36 rounded-lg bg-cyan-400/80 border border-cyan-200 shadow-md flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 transition-all duration-300 ${
                        biteState === 'biting'
                          ? 'translate-y-2 scale-95 shadow-cyan-400/80 ring-2 ring-cyan-300'
                          : biteState === 'released'
                            ? '-translate-y-3'
                            : 'translate-y-0'
                      }`}
                    >
                      Tooth Slooth Cup
                    </div>

                    {/* Tooth Crown with Crack Line */}
                    <div className="relative mt-2 w-32 h-24 bg-gradient-to-b from-slate-200 to-slate-400 rounded-t-2xl border-2 border-slate-500 flex items-center justify-center overflow-hidden">
                      {/* Enamel fissures */}
                      <div className="absolute inset-0 flex justify-around">
                        <div className="w-0.5 h-full bg-slate-400" />
                        <div className="w-0.5 h-full bg-slate-400" />
                      </div>

                      {/* Micro-Crack on ML Cusp */}
                      {selectedCusp === 'ML' && (
                        <div
                          className={`absolute top-0 left-8 w-0.5 h-16 bg-rose-600 transition-all ${
                            biteState === 'biting'
                              ? 'w-1 bg-rose-500 scale-y-105 animate-pulse'
                              : biteState === 'released'
                                ? 'w-0.5 bg-rose-600'
                                : 'w-0.5 bg-slate-500'
                          }`}
                        />
                      )}

                      <div className="text-[10px] font-mono text-slate-900 font-bold z-10">
                        {biteState === 'biting' ? 'FLEXING...' : biteState === 'released' ? 'REBOUND!' : 'Rest'}
                      </div>
                    </div>
                  </div>

                  {/* Real-time Status readout */}
                  <div className="text-center font-mono text-xs">
                    {biteState === 'rest' && (
                      <span className="text-slate-400">Position Tooth Slooth over {selectedCusp} cusp tip...</span>
                    )}
                    {biteState === 'biting' && (
                      <span className="text-amber-300 font-semibold">
                        Biting Down: Cusps flexing apart. Patient reports: &quot;A slight pressure, not bad.&quot;
                      </span>
                    )}
                    {biteState === 'released' && selectedCusp === 'ML' && (
                      <span className="text-rose-400 font-extrabold animate-pulse">
                        ⚡ SUDDEN RELEASE: Sharp piercing electric shock! Fractured cusp snapped back!
                      </span>
                    )}
                    {biteState === 'released' && selectedCusp !== 'ML' && (
                      <span className="text-emerald-400 font-bold">
                        ✓ Release comfortable. No fracture on this cusp.
                      </span>
                    )}
                  </div>
                </div>

                {/* Controls & Scientific Mechanics */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-mono text-xs font-bold uppercase text-slate-300 block mb-1.5">
                      1. Select Suspect Cusp to Isolate:
                    </label>
                    <div className="grid grid-cols-4 gap-2 font-mono">
                      {(['MB', 'DB', 'ML', 'DL'] as const).map((cusp) => (
                        <button
                          key={cusp}
                          onClick={() => {
                            setSelectedCusp(cusp);
                            setBiteState('rest');
                          }}
                          className={`py-2 rounded-xl font-bold border transition-all ${
                            selectedCusp === cusp
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {cusp} {cusp === 'ML' ? '⚠️' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-xs font-bold uppercase text-slate-300 block">
                      2. Execute 2-Phase Bite Test:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleBiteDown}
                        disabled={biteState === 'biting'}
                        className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-mono font-bold uppercase"
                      >
                        1. Bite Down Firmly
                      </button>

                      <button
                        onClick={handleReleaseBite}
                        disabled={biteState !== 'biting'}
                        className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-mono font-bold uppercase shadow-lg shadow-rose-600/30"
                      >
                        2. RELEASE SUDDENLY!
                      </button>
                    </div>

                    <button
                      onClick={resetBiteTest}
                      className="w-full py-1.5 text-[10px] font-mono text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Bite Simulator
                    </button>
                  </div>

                  {/* Differential Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <strong className="text-amber-400 font-mono text-[10px] uppercase block">
                      Cracked Tooth vs. Apical Periodontitis Differential:
                    </strong>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                      <li>
                        <strong>Cracked Tooth:</strong> Pain occurs specifically upon <em>releasing</em> biting force (elastic rebound turbulence in dentinal tubules).
                      </li>
                      <li>
                        <strong>Apical Periodontitis:</strong> Pain occurs continuously <em>while biting down</em> (compression of inflamed PDL).
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* METHOD 2: STAINING (METHYLENE BLUE & CAPILLARY INGRESS) */}
        {/* ========================================================================= */}
        {activeMethodTab === 'staining' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <Droplet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 font-mono text-sm">
                    Method 2: Methylene Blue Dye Staining
                  </h3>
                  <p className="text-xs text-slate-400">
                    Lecture 1 (Page 9): Organic vegetable dye penetrates microscopic enamel and dentin clefts by capillary action.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Staining Simulator */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Stained Pulpal Floor Graphic */}
                <div className="h-64 rounded-2xl bg-slate-950 border border-cyan-500/30 p-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Occlusal Pulpal Floor View</span>
                    <span className="text-cyan-300 font-bold uppercase text-[10px]">
                      {stainStep === 'clean' ? '1. Clean Dentin' : stainStep === 'dye_applied' ? '2. Dye Flooded' : '3. Alcohol Rinsed'}
                    </span>
                  </div>

                  {/* Pulpal Chamber Floor Visualization */}
                  <div className="relative w-full flex-1 flex items-center justify-center">
                    <div className="relative w-44 h-44 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-slate-700 p-3 shadow-inner flex items-center justify-center overflow-hidden">
                      {/* Pulp Canal Orifices */}
                      <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-slate-800" aria-label="Mesiobuccal Orifice" />
                      <div className="absolute top-4 right-6 w-3 h-3 rounded-full bg-slate-800" aria-label="Mesiolingual Orifice" />
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-800" aria-label="Distal Orifice" />

                      {/* Flooded Blue Layer */}
                      {stainStep === 'dye_applied' && (
                        <div className="absolute inset-0 bg-blue-700/80 animate-fadeIn flex items-center justify-center text-white font-mono text-xs font-bold">
                          Methylene Blue Flooding
                        </div>
                      )}

                      {/* Revealed Fracture Line after Alcohol Rinse */}
                      {stainStep === 'rinsed' && (
                        <div className="absolute inset-0 flex items-center justify-center animate-fadeIn">
                          {/* Vivid Blue Micro-Crack Line running mesiodistally */}
                          <div className="w-full h-1 bg-blue-700 rotate-12 shadow-md shadow-blue-500/50" />
                          <div className="absolute text-[9px] font-mono bg-blue-950 text-blue-200 px-2 py-0.5 rounded border border-blue-400 top-12 left-2">
                            Structural Crack Line Ingress
                          </div>
                        </div>
                      )}

                      {stainStep === 'clean' && (
                        <span className="text-[10px] font-mono text-slate-600 font-semibold">
                          Micro-crack invisible to naked eye
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-center font-mono text-xs text-cyan-300">
                    {stainStep === 'clean' && 'Dentin dried. Crack is hidden in dental micro-grooves.'}
                    {stainStep === 'dye_applied' && 'Capillary action draws dye deep into the fracture plane (30s)...'}
                    {stainStep === 'rinsed' && '✓ Alcohol rinse complete! Vivid blue line reveals true structural breach!'}
                  </div>
                </div>

                {/* Staining Steps & Clinical Pearls */}
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <span className="font-mono text-xs font-bold uppercase text-slate-300 block">
                      Investigation Protocol:
                    </span>
                    <button
                      onClick={() => setStainStep('dye_applied')}
                      className={`w-full p-3 rounded-xl border text-left font-mono font-bold transition-all ${
                        stainStep === 'dye_applied'
                          ? 'bg-blue-950 border-blue-400 text-blue-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      Step 1: Apply Methylene Blue Dye (Cotton Pellet)
                    </button>

                    <button
                      onClick={() => setStainStep('rinsed')}
                      disabled={stainStep === 'clean'}
                      className={`w-full p-3 rounded-xl border text-left font-mono font-bold transition-all ${
                        stainStep === 'rinsed'
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 disabled:opacity-40'
                      }`}
                    >
                      Step 2: Rinse Excess with 70% Isopropyl Alcohol
                    </button>

                    <button
                      onClick={() => setStainStep('clean')}
                      className="w-full py-1 text-[10px] font-mono text-slate-500 hover:text-slate-300"
                    >
                      Reset Dye Experiment
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <strong className="text-cyan-400 font-mono text-[10px] uppercase block">
                      Why 70% Isopropyl Alcohol?
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Water alone cannot remove surface dye stains from polished dentin. 70% isopropyl alcohol dissolves superficial surface methylene blue instantly while leaving the trapped dye sealed inside the fracture cleft.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* METHOD 3: TRANSILLUMINATION (FIBEROPTIC LIGHT SHADOW) */}
        {/* ========================================================================= */}
        {activeMethodTab === 'transillumination' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 font-mono text-sm">
                    Method 3: Fiberoptic Transillumination (FOTI)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Lecture 1 (Page 9): High-intensity fiberoptic light illuminates sound tooth structure, but is abruptly stopped by a fracture plane!
                  </p>
                </div>
              </div>
              {onSimulateIn3D && (
                <button
                  onClick={() => onSimulateIn3D('transillumination')}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  <Box className="w-4 h-4" />
                  <span>Simulate in 3D</span>
                </button>
              )}
            </div>

            {/* Interactive Light Wand Simulator */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Optical Ray Tracer */}
                <div className="h-64 rounded-2xl bg-slate-950 border border-rose-500/30 p-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 font-bold">Optical Light Transmission</span>
                    <span className="text-slate-400">Light Wand: {lightPosition}%</span>
                  </div>

                  {/* Simulated Tooth with Optical Shadow */}
                  <div className="relative w-full flex-1 flex items-center justify-center">
                    <div className="relative w-56 h-36 rounded-2xl border-2 border-slate-700 overflow-hidden flex">
                      {/* Left Half of Crown (Light Source Side) */}
                      <div
                        className={`h-full transition-all duration-300 flex items-center justify-center border-r-2 border-dashed border-red-500 ${
                          lightPosition < 50
                            ? 'w-1/2 bg-amber-100 text-slate-950 shadow-inner'
                            : 'w-1/2 bg-slate-900 text-slate-500'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold text-center">
                          {lightPosition < 50 ? '☀️ Light Propagates' : 'Dark Shadow'}
                        </div>
                      </div>

                      {/* Right Half of Crown (Shadow Blocked by Crack Plane at midline 50%) */}
                      <div
                        className={`h-full transition-all duration-300 flex items-center justify-center ${
                          lightPosition < 50
                            ? 'w-1/2 bg-slate-950 text-rose-400'
                            : 'w-1/2 bg-amber-100 text-slate-950'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold text-center">
                          {lightPosition < 50 ? '⬛ ABANDONED SHADOW (Crack blocks light!)' : '☀️ Light Source'}
                        </div>
                      </div>

                      {/* Crack Plane Indicator */}
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-red-600 shadow-lg shadow-red-500" />
                    </div>
                  </div>

                  <div className="text-center font-mono text-xs text-rose-300">
                    {lightPosition < 50 ? (
                      <span className="text-rose-400 font-bold">
                        ⚡ CRACK CONFIRMED! Light illuminates mesial half but fails to cross the crack plane!
                      </span>
                    ) : (
                      <span>Moving wand across distal margin...</span>
                    )}
                  </div>
                </div>

                {/* Light Wand Position Slider & Optical Rules */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-mono text-xs font-bold uppercase text-slate-300 block mb-2">
                      Slide Fiberoptic Wand Across Buccal/Lingual Margin:
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={lightPosition}
                      onChange={(e) => setLightPosition(Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>Mesial (0%)</span>
                      <span className="text-red-400 font-bold">Crack Plane (50%)</span>
                      <span>Distal (100%)</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <strong className="text-rose-400 font-mono text-[10px] uppercase block">
                      Optical Physics Principle:
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Sound tooth structure acts as a light conductor. A structural crack presents an internal air-space boundary with a different index of refraction; light cannot bridge the cleft, creating a dramatic, sharp contrast shadow on the opposite side.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-[11px]">
                    <strong>💡 Craze Line vs. Cracked Tooth:</strong> Craze lines (enamel-only) do NOT block light transmission (the whole crown glows). True dentinal cracks block light and produce a sharp shadow!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DETECTIVE INVESTIGATION CASE */}
        {/* ========================================================================= */}
        {activeMethodTab === 'detective_case' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 font-mono text-sm">
                    Interactive Cracked Tooth Case Investigation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Apply all 3 diagnostic methods sequentially to confirm the diagnosis and save the tooth.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                  Detective Patient Brief:
                </span>
                <h4 className="text-base font-extrabold text-slate-100">
                  Patient presents with: “Sharp electric pain when chewing crusty bread or nuts, but no lingering pain afterwards.”
                </h4>
                <div className="italic text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 mt-2">
                  Clinical Radiographs show NO apical radiolucency. Cold test is vital and momentary. Which investigative tool confirms the diagnosis?
                </div>
              </div>

              {/* 3 Investigation Checkpoints */}
              <div className="space-y-3">
                <div
                  onClick={() => setMysteryBiteTested(true)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    mysteryBiteTested ? 'bg-amber-950/80 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Disc className="w-4 h-4 text-amber-400" />
                    <div>
                      <strong className="text-xs font-mono">1. Perform Tooth Slooth Bite Test on ML Cusp:</strong>
                      <p className="text-[11px] text-slate-400">
                        {mysteryBiteTested ? '✓ POSITIVE: Acute sharp pain on sudden release of biting load!' : 'Click to execute bite test'}
                      </p>
                    </div>
                  </div>
                  {mysteryBiteTested && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                </div>

                <div
                  onClick={() => setMysteryStained(true)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    mysteryStained ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Droplet className="w-4 h-4 text-cyan-400" />
                    <div>
                      <strong className="text-xs font-mono">2. Apply Methylene Blue Dye after Restorative Removal:</strong>
                      <p className="text-[11px] text-slate-400">
                        {mysteryStained ? '✓ POSITIVE: Distinct blue cleft traversing distal marginal ridge!' : 'Click to stain with dye'}
                      </p>
                    </div>
                  </div>
                  {mysteryStained && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                </div>

                <div
                  onClick={() => setMysteryTransillum(true)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    mysteryTransillum ? 'bg-rose-950/80 border-rose-500 text-rose-200' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sun className="w-4 h-4 text-rose-400" />
                    <div>
                      <strong className="text-xs font-mono">3. Fiberoptic Transillumination at CEJ:</strong>
                      <p className="text-[11px] text-slate-400">
                        {mysteryTransillum ? '✓ POSITIVE: Light beam abruptly blocked; dark shadow cast over lingual cusp!' : 'Click to transilluminate'}
                      </p>
                    </div>
                  </div>
                  {mysteryTransillum && <CheckCircle2 className="w-5 h-5 text-rose-400" />}
                </div>
              </div>

              {/* Diagnosis Verdict */}
              {mysteryBiteTested && mysteryStained && mysteryTransillum && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold font-mono text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    CASE SOLVED: CRACKED TOOTH SYNDROME CONFIRMED!
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All 3 investigative methods correlate. Recommended immediate treatment: place an orthodontic band or full-coverage provisional crown to splint the flexing cusps together, preserving pulp vitality!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FRACTURE CLASSIFICATION GUIDE */}
        {/* ========================================================================= */}
        {activeMethodTab === 'classification' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 font-mono text-sm">
                    Endodontic Longitudinal Tooth Fracture Classification
                  </h3>
                  <p className="text-xs text-slate-400">
                    American Association of Endodontists (AAE) 5-tier classification criteria.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-bold">
                  Tier 1
                </span>
                <h4 className="font-bold text-sm text-slate-100">Craze Lines</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Confined strictly to enamel. Asymptomatic. Transillumination does NOT block light (light passes freely). No treatment required.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase font-bold">
                  Tier 2
                </span>
                <h4 className="font-bold text-sm text-slate-100">Fractured Cusp</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Begins on occlusal surface and extends subgingivally, usually oblique. Tender to bite release on isolated cusp. Favorable prognosis with onlay/crown.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/50 space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 uppercase font-bold">
                  Tier 3 (Classic)
                </span>
                <h4 className="font-bold text-sm text-amber-300">Cracked Tooth</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Incomplete greenstick fracture extending mesiodistally through marginal ridges toward root. Rebound bite pain + transillumination shadow. Urgent splinting required.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/50 space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 uppercase font-bold">
                  Tier 4
                </span>
                <h4 className="font-bold text-sm text-rose-300">Split Tooth</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Complete fracture separating crown into two distinct movable segments. Segments can be wedged apart with an explorer. Usually non-restorable.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-red-500/80 space-y-2 sm:col-span-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 uppercase font-bold">
                  Tier 5 (Hopeless)
                </span>
                <h4 className="font-bold text-sm text-red-300">Vertical Root Fracture (VRF)</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Originates in the root at the apex and propagates coronally, usually on endodontically treated teeth with posts. Pathognomonic &quot;J-shaped&quot; or &quot;halo&quot; radiolucency with narrow isolated 10mm probing pocket. Hopeless prognosis: extraction or root resection.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
