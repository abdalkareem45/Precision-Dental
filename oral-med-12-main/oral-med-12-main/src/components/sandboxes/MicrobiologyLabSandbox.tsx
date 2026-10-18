import React, { useState } from 'react';
import { Microscope, Dna, Disc, CheckCircle, AlertCircle, Sparkles, RefreshCw, Flame, Play, ShieldAlert, Wind, Layers } from 'lucide-react';

export const MicrobiologyLabSandbox: React.FC = () => {
  const [selectedSpecimen, setSelectedSpecimen] = useState<'sulcus' | 'throat' | 'blood' | 'biopsy'>('sulcus');
  const [activeLabTest, setActiveLabTest] = useState<'kirby-bauer' | 'dark-field' | 'pcr-cycler' | 'anaerobic-jar'>('kirby-bauer');
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<'metronidazole' | 'penicillin' | 'chlorhexidine' | 'erythromycin'>('metronidazole');
  const [caliperMeasured, setCaliperMeasured] = useState<boolean>(true);
  const [anaerobicGasPakActive, setAnaerobicGasPakActive] = useState<boolean>(true);
  const [pcrCycle, setPcrCycle] = useState<number>(35);
  const [isCyclingPcr, setIsCyclingPcr] = useState<boolean>(false);

  // Antibiotic sensitivity test results for NUG polymicrobial flora (Slide 16)
  const sensitivityData = {
    metronidazole: {
      code: 'MTZ',
      discX: 130,
      discY: 120,
      zoneMm: 28,
      status: 'Susceptible (Sensitive)',
      color: 'text-emerald-400',
      badge: 'border-emerald-500 bg-emerald-950/60 text-emerald-300',
      mechanism: 'Selective bactericidal action against obligate anaerobes (Prevotella intermedia & Fusobacterium nucleatum). It breaks bacterial DNA strands. Although it has weak direct solo spirochete activity, eliminating anaerobic co-pathogens collapses the entire fuso-spirochetal complex!',
      lectureNote: 'Slide 16: "Interestingly, metronidazole, which has little activity against spirochetes, also is effective."'
    },
    penicillin: {
      code: 'PEN',
      discX: 230,
      discY: 120,
      zoneMm: 25,
      status: 'Susceptible (Sensitive)',
      color: 'text-emerald-400',
      badge: 'border-emerald-500 bg-emerald-950/60 text-emerald-300',
      mechanism: 'Inhibits bacterial cell wall transpeptidase peptidoglycan synthesis. Active against both oral spirochetes (Treponema) and prevailing gram-positive cocci in systemic spread.',
      lectureNote: 'Slide 16: β-lactams (penicillin derivatives, amoxicillin/clavulanate) are indicated for extensive disease with systemic symptoms like lymphadenopathy and fever.'
    },
    chlorhexidine: {
      code: 'CHX',
      discX: 130,
      discY: 220,
      zoneMm: 32,
      status: 'Broad-Spectrum Topical Bactericidal',
      color: 'text-teal-400',
      badge: 'border-teal-500 bg-teal-950/60 text-teal-300',
      mechanism: 'Cationic bisbiguanide binds negatively charged bacterial cell walls, causing cytoplasmic osmotic leakage and rapid cell death across both gram-positive and gram-negative oral bacteria.',
      lectureNote: 'Slide 16: Chlorhexidine gluconate 0.12% mouthrinse combined with debridement produces resolution in over 90% of acute NUG cases.'
    },
    erythromycin: {
      code: 'ERY',
      discX: 230,
      discY: 220,
      zoneMm: 12,
      status: 'Intermediate / Resistant',
      color: 'text-amber-400',
      badge: 'border-amber-500 bg-amber-950/60 text-amber-300',
      mechanism: 'Bacteriostatic 50S ribosomal subunit inhibition. Macrolide resistance is prevalent among subgingival Prevotella species via erm(F) methylation genes.',
      lectureNote: 'Second-line alternative strictly when severe penicillin allergy is documented.'
    }
  };

  const currentAntibiotic = sensitivityData[selectedAntibiotic];

  const handleRunPcr = () => {
    setIsCyclingPcr(true);
    setPcrCycle(1);
    let c = 1;
    const interval = setInterval(() => {
      c += 1;
      if (c >= 40) {
        clearInterval(interval);
        setIsCyclingPcr(false);
        setPcrCycle(40);
      } else {
        setPcrCycle(c);
      }
    }, 70);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <span>Sandbox 5</span>
            <span>·</span>
            <span>Oral Microbiology Workbench</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Microbiology Lab & Antibiotic Sensitivity Simulator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Isolate fuso-spirochetes, inspect dark-field motile Treponema, execute quantitative RT-PCR, and measure Kirby-Bauer multi-disc antibiotic inhibition zones.
          </p>
        </div>

        {/* Bench Modality Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs flex-wrap">
          <button
            onClick={() => setActiveLabTest('kirby-bauer')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLabTest === 'kirby-bauer' ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kirby-Bauer Multi-Disc Assay
          </button>
          <button
            onClick={() => setActiveLabTest('dark-field')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLabTest === 'dark-field' ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dark-Field Spirochete Motility
          </button>
          <button
            onClick={() => setActiveLabTest('pcr-cycler')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLabTest === 'pcr-cycler' ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            RT-PCR Thermal Cycler
          </button>
          <button
            onClick={() => setActiveLabTest('anaerobic-jar')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLabTest === 'anaerobic-jar' ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            GasPak Anaerobic Chamber
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Specimen Source & Test Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Microscope className="w-4 h-4 text-teal-400" />
              <span>Specimen Collection Source</span>
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { id: 'sulcus', label: 'Necrotic Gingival Papilla Exudate (NUG)', target: 'Vincent\'s Fuso-Spirochetes & Prevotella' },
                { id: 'throat', label: 'Posterior Tonsillar Swab (Herpangina)', target: 'Enterovirus RNA (Coxsackievirus)' },
                { id: 'blood', label: 'Peripheral Buffy Coat / Plasma (CMV)', target: 'HHV-5 DNA qPCR Viral Load' },
                { id: 'biopsy', label: 'Attached Gingival Punch Biopsy (PCS)', target: 'Polyclonal Plasma Cells & Microvessels' },
              ].map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecimen(spec.id as any)}
                  className={`w-full p-3 rounded-lg text-left transition-all border flex items-center justify-between ${
                    selectedSpecimen === spec.id
                      ? 'bg-teal-950/80 border-teal-500 text-teal-200 font-semibold shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="font-bold">{spec.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{spec.target}</div>
                  </div>
                  {selectedSpecimen === spec.id && <CheckCircle className="w-4 h-4 text-teal-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Antibiotic Selector Tabs (When on Kirby-Bauer) */}
          {activeLabTest === 'kirby-bauer' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3 text-xs">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Disc className="w-4 h-4 text-emerald-400" />
                <span>Select Antibiotic Disc on Agar Plate</span>
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(sensitivityData) as (keyof typeof sensitivityData)[]).map((ab) => {
                  const isSelected = selectedAntibiotic === ab;
                  const data = sensitivityData[ab];
                  return (
                    <button
                      key={ab}
                      onClick={() => setSelectedAntibiotic(ab)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-teal-950/80 border-teal-500 text-white font-semibold shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-teal-300">{data.code}</span>
                        <span className="text-[10px] font-mono text-slate-400">{data.zoneMm} mm</span>
                      </div>
                      <span className="font-bold capitalize">{ab}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Lab Simulation Station (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* MODALITY 1: KIRBY-BAUER MULTI-DISC AGAR PLATE */}
          {activeLabTest === 'kirby-bauer' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Disc className="w-4 h-4 text-teal-400" />
                  <span>Kirby-Bauer Disc Diffusion Panel (Blood Agar Plate)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">CLSI Clinical Standards</span>
              </div>

              {/* Multi-Disc Petri Dish SVG */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800 relative">
                <svg viewBox="0 0 360 360" className="w-72 h-72 sm:w-80 sm:h-80">
                  {/* Outer Glass Petri Dish Rim */}
                  <circle cx="180" cy="180" r="170" fill="#060913" stroke="#475569" strokeWidth="6" />
                  
                  {/* Enriched Sheep Blood Agar Nutrient Medium */}
                  <circle cx="180" cy="180" r="160" fill="#7f1d1d" opacity="0.8" />

                  {/* Turbid Subgingival Anaerobe Lawn (Fusobacterium & Prevotella) */}
                  <circle cx="180" cy="180" r="158" fill="#a16207" opacity="0.35" />

                  {/* Render All 4 Antibiotic Zones of Inhibition Simultaneously! */}
                  {(Object.keys(sensitivityData) as (keyof typeof sensitivityData)[]).map((abKey) => {
                    const ab = sensitivityData[abKey];
                    const isFocus = selectedAntibiotic === abKey;
                    const radius = (ab.zoneMm / 2) * 5.2; // Scaled to disk center

                    return (
                      <g key={abKey} className="cursor-pointer" onClick={() => setSelectedAntibiotic(abKey)}>
                        {/* Clear Zone of Inhibition Halo */}
                        <circle
                          cx={ab.discX}
                          cy={ab.discY}
                          r={radius}
                          fill="#7f1d1d"
                          opacity={isFocus ? 0.95 : 0.8}
                          stroke={isFocus ? '#f59e0b' : '#94a3b8'}
                          strokeWidth={isFocus ? 2.5 : 1}
                          strokeDasharray={isFocus ? '4 2' : 'none'}
                        />

                        {/* Paper Antibiotic Disc */}
                        <circle
                          cx={ab.discX}
                          cy={ab.discY}
                          r="18"
                          fill="#f8fafc"
                          stroke={isFocus ? '#38bdf8' : '#64748b'}
                          strokeWidth={isFocus ? 3 : 1.5}
                        />
                        <text
                          x={ab.discX}
                          y={ab.discY + 4}
                          fill="#0f172a"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {ab.code}
                        </text>

                        {/* Interactive Caliper Measure Overlay on Focused Disc */}
                        {isFocus && caliperMeasured && (
                          <g>
                            <line
                              x1={ab.discX - radius}
                              y1={ab.discY}
                              x2={ab.discX + radius}
                              y2={ab.discY}
                              stroke="#38bdf8"
                              strokeWidth="2"
                            />
                            <line
                              x1={ab.discX - radius}
                              y1={ab.discY - 10}
                              x2={ab.discX - radius}
                              y2={ab.discY + 10}
                              stroke="#38bdf8"
                              strokeWidth="2"
                            />
                            <line
                              x1={ab.discX + radius}
                              y1={ab.discY - 10}
                              x2={ab.discX + radius}
                              y2={ab.discY + 10}
                              stroke="#38bdf8"
                              strokeWidth="2"
                            />
                            {/* Measurement Banner */}
                            <rect
                              x={ab.discX - 25}
                              y={ab.discY - 35}
                              width="50"
                              height="18"
                              rx="4"
                              fill="#0284c7"
                            />
                            <text
                              x={ab.discX}
                              y={ab.discY - 22}
                              fill="#ffffff"
                              fontSize="10"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {ab.zoneMm} mm
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Caliper Readout Badge */}
                <div className="mt-3 flex items-center justify-between w-full max-w-sm text-xs bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Inspecting:</span>
                    <strong className="text-white capitalize">{selectedAntibiotic}</strong>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-teal-400 font-bold">{currentAntibiotic.zoneMm} mm</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${currentAntibiotic.badge}`}>
                      {currentAntibiotic.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mechanism & Lecture Note */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="text-slate-300 leading-relaxed">
                  <span className="font-bold text-teal-400">Mechanism of Action: </span>
                  {currentAntibiotic.mechanism}
                </div>
                <div className="p-2.5 bg-amber-950/30 rounded border border-amber-800/50 text-amber-300 font-mono text-[11px]">
                  {currentAntibiotic.lectureNote}
                </div>
              </div>
            </div>
          )}

          {/* MODALITY 2: DARK-FIELD SPIROCHETE MOTILITY */}
          {activeLabTest === 'dark-field' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-teal-400" />
                  <span>Dark-Field Spirochete Motility Inspection (Vincent's Complex)</span>
                </h3>
                <span className="text-xs text-emerald-400 font-mono">100x Oil Immersion</span>
              </div>

              {/* Dark Field SVG Field */}
              <div className="w-full h-64 bg-black rounded-xl p-3 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 360 220" className="w-full h-full">
                  {/* Pitch black background with subtle dark-field ray */}
                  <rect width="360" height="220" fill="#020617" />
                  <circle cx="180" cy="110" r="105" fill="#090d16" />

                  {/* Luminous Silver-White Treponema Spirochetes (Animated Helices) */}
                  {[
                    { x: 80, y: 70, angle: 25 },
                    { x: 160, y: 110, angle: -15 },
                    { x: 240, y: 60, angle: 45 },
                    { x: 120, y: 160, angle: -30 },
                    { x: 260, y: 150, angle: 10 },
                    { x: 190, y: 40, angle: -40 },
                  ].map((s, idx) => (
                    <g key={idx} transform={`translate(${s.x}, ${s.y}) rotate(${s.angle})`}>
                      <path
                        d="M -30,0 Q -20,-8 -10,0 T 10,0 T 30,0"
                        stroke="#f8fafc"
                        strokeWidth="2.5"
                        fill="none"
                        className="animate-pulse"
                      />
                      <circle cx="30" cy="0" r="1.5" fill="#38bdf8" />
                    </g>
                  ))}

                  {/* Fusobacterium Spindle-Shaped Bacilli */}
                  {[
                    { x: 100, y: 120, angle: 60 },
                    { x: 220, y: 110, angle: -50 },
                    { x: 170, y: 180, angle: 15 },
                  ].map((f, idx) => (
                    <g key={idx} transform={`translate(${f.x}, ${f.y}) rotate(${f.angle})`}>
                      <line
                        x1="-18"
                        y1="0"
                        x2="18"
                        y2="0"
                        stroke="#f43f5e"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                    </g>
                  ))}

                  {/* Degenerate PMN Leukocyte Shadow */}
                  <circle cx="70" cy="160" r="22" fill="#1e293b" opacity="0.6" stroke="#475569" />
                  <circle cx="65" cy="155" r="6" fill="#334155" />
                  <circle cx="75" cy="165" r="5" fill="#334155" />

                  {/* Reticle */}
                  <circle cx="180" cy="110" r="105" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.5" />
                </svg>

                <div className="absolute bottom-3 left-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
                  Motion: <span className="text-teal-400 font-bold">Rapid Flexuous Corkscrew Rotation</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-teal-300">Vincent's Microorganism Complex (Slide 15): </span>
                Slender, tightly coiled spirochetes (intermediate-sized <em>Treponema</em>) alongside spindle-shaped anaerobic bacilli (<em>Fusobacterium nucleatum</em>) and <em>Prevotella intermedia</em>. Dark-field microscopy directly confirms rapid motility.
              </div>
            </div>
          )}

          {/* MODALITY 3: RT-PCR THERMAL CYCLER */}
          {activeLabTest === 'pcr-cycler' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Dna className="w-4 h-4 text-sky-400" />
                  <span>Real-Time Quantitative PCR Thermal Cycler</span>
                </h3>
                <button
                  onClick={handleRunPcr}
                  disabled={isCyclingPcr}
                  className="px-3 py-1 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isCyclingPcr ? `Cycle ${pcrCycle}/40...` : 'Run 40 Cycles'}</span>
                </button>
              </div>

              {/* Dynamic PCR Curve SVG */}
              <div className="w-full h-56 bg-slate-950 rounded-xl p-4 border border-slate-800 relative">
                <svg viewBox="0 0 400 160" className="w-full h-full">
                  {/* Grid Lines */}
                  {[30, 70, 110, 150].map((y, i) => (
                    <line key={i} x1="30" y1={y} x2="380" y2={y} stroke="#1e293b" strokeWidth="1" />
                  ))}

                  {/* Threshold Line */}
                  <line x1="30" y1="90" x2="380" y2="90" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x="375" y="86" fill="#f43f5e" fontSize="9" textAnchor="end">Ct Threshold</text>

                  {/* Dynamic Sigmoid Amplification Curve */}
                  <path
                    d={`M 30,150 L 150,150 Q 210,148 240,90 T ${Math.min(310, 150 + pcrCycle * 4)},${Math.max(20, 150 - (pcrCycle > 18 ? (pcrCycle - 18) * 6 : 0))} L ${Math.min(380, 150 + pcrCycle * 5.5)},20`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                  />
                </svg>

                <div className="absolute bottom-3 right-4 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
                  <span>Cycle Threshold (Ct): </span>
                  <span className="text-teal-400 font-bold">19.4</span> (High Copy Load)
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-sky-400">Diagnostic Typing: </span>
                In enterovirus infections (Slide 10), real-time RT-PCR is the clinical gold standard for typing serotypes (differentiating standard CVA16 from CVA6 causing onychomadesis and CVA10 causing lymphonodular pharyngitis).
              </div>
            </div>
          )}

          {/* MODALITY 4: GASPAK ANAEROBIC JAR */}
          {activeLabTest === 'anaerobic-jar' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-400" />
                  <span>GasPak Anaerobic Incubation Chamber</span>
                </h3>
                <button
                  onClick={() => setAnaerobicGasPakActive(!anaerobicGasPakActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                    anaerobicGasPakActive
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-rose-950 border-rose-500 text-rose-300'
                  }`}
                >
                  {anaerobicGasPakActive ? 'GasPak Active (Anaerobic ✓)' : 'Ambient Air (Aerobic ✗)'}
                </button>
              </div>

              {/* Anaerobic Jar Diagram */}
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-200 block">Methylene Blue Chemical Indicator:</span>
                    <span
                      className={`font-mono font-bold text-xs ${
                        anaerobicGasPakActive ? 'text-emerald-400' : 'text-sky-400'
                      }`}
                    >
                      {anaerobicGasPakActive ? 'WHITE (Colorless = Reduced / Strict Anaerobiosis)' : 'BLUE (Oxidized = Atmospheric O2 Present)'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-200 block">Anaerobic Growth Status:</span>
                    <p className="text-slate-300 text-xs">
                      {anaerobicGasPakActive
                        ? 'Obligate anaerobes (Prevotella intermedia, Fusobacterium nucleatum) produce dense black/brown colonies and volatile sulfur compounds (VSC).'
                        : 'Obligate anaerobes are killed by reactive oxygen species (ROS) due to lack of catalase and superoxide dismutase!'}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-950/30 rounded-lg border border-amber-800/50 text-amber-300 text-xs leading-relaxed">
                  <span className="font-bold text-amber-200 block mb-1">Etiological Landmark (Slide 15):</span>
                  NUG is an endogenous, opportunistic polymicrobial infection. Vincent's fuso-spirochetal complex thrives exclusively in anoxic microenvironments such as deep periodontal pockets with smoking and severe psychological stress.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
