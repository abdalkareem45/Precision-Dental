import React, { useState } from 'react';
import { GitBranch, CheckCircle2, AlertCircle, Dna, Microscope, Sparkles, ChevronRight, Activity, ShieldAlert, SplitSquareVertical, Clock, Play, RotateCcw } from 'lucide-react';

export const CoxsackieDiagnosticDecisionTree: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<'herpangina' | 'classic-hfm' | 'atypical-cva6' | 'lymphonodular'>('herpangina');
  const [activeLabTest, setActiveLabTest] = useState<'pcr' | 'gel-electrophoresis' | 'differential-matrix'>('gel-electrophoresis');
  const [analyzedPcr, setAnalyzedPcr] = useState<boolean>(false);
  const [gelRunning, setGelRunning] = useState<boolean>(false);
  const [gelProgress, setGelProgress] = useState<number>(0);
  const [onychomadesisStage, setOnychomadesisStage] = useState<number>(2); // 0: Eruption, 1: Desquamation, 2: Nail Detachment
  const [differentialComparison, setDifferentialComparison] = useState<'phgs' | 'gabhs' | 'aphthous'>('phgs');

  const branchData = {
    herpangina: {
      title: 'Herpangina (Slides 7 & 9)',
      serotypes: 'Coxsackievirus A (CVA 1–10, 16, and 22)',
      anatomicSite: 'Posterior soft palate, uvula, anterior tonsillar pillars',
      anteriorGingiva: 'COMPLETELY SPARED (anterior gingiva, lips, and buccal mucosa are clear)',
      lesionMorphology: 'Small 2–4 mm vesicles that rapidly rupture into shallow gray-white ulcers with red halos',
      skinRash: 'None (localized strictly to posterior oropharynx)',
      rtPcrResult: 'CVA-16 / CVA-2 / CVA-10 positive RNA band at 154 bp (5\' UTR conserved enterovirus region)',
      course: 'Self-limiting, resolves spontaneously within 5–10 days',
    },
    'classic-hfm': {
      title: 'Classic Hand, Foot and Mouth Disease (Slides 7 & 8)',
      serotypes: 'Coxsackievirus A16 (most frequent) and EV71 (associated with rhombencephalitis)',
      anatomicSite: 'Tongue, hard and soft palate, buccal mucosa + hands & feet',
      anteriorGingiva: 'Can present on any mucosal surface, beginning as macules that ulcerate',
      lesionMorphology: 'Erythematous macules $\to$ oval vesicles on erythematous base $\to$ shallow ulcers',
      skinRash: 'Hands & feet (dorsa, palms, soles: 75–100%) and buttocks (30%)',
      rtPcrResult: 'CVA-16 positive RNA band at 154 bp',
      course: 'Spontaneous resolution within 7–10 days with supportive hydration',
    },
    'atypical-cva6': {
      title: 'Atypical HFM Disease with Onychomadesis (Slide 7)',
      serotypes: 'Coxsackievirus A6 (CVA6) - Distinct Hyper-Virulent Clade',
      anatomicSite: 'Widespread perioral, trunk, extremities, and severe oral mucosal erosions',
      anteriorGingiva: 'Extensive involvement with severe bullous desquamation',
      lesionMorphology: 'Large, confluent bullous atypical vesicles resembling eczema herpeticum or erythema multiforme',
      skinRash: 'Widespread perioral and body bullae + Onychomadesis (complete nail matrix separation 4–8 weeks post-infection)',
      rtPcrResult: 'CVA-6 specific VP1 gene amplified (distinct clade at 420 bp band)',
      course: 'Severe cutaneous phase lasting 2 weeks; nail shedding occurs 1–2 months later',
    },
    lymphonodular: {
      title: 'Lymphonodular Pharyngitis (Slide 9)',
      serotypes: 'Coxsackievirus A serotype 10 (CVA10)',
      anatomicSite: 'Posterior oropharynx and soft palate',
      anteriorGingiva: 'Completely normal and spared',
      lesionMorphology: 'Diffuse small yellowish-white nodules (lymphoid hyperplasia) WITHOUT vesicles or ulcers',
      skinRash: 'None',
      rtPcrResult: 'CVA-10 positive RNA band at 154 bp',
      course: 'Spontaneous resolution within 5–10 days',
    },
  };

  const current = branchData[selectedBranch];

  // Run Gel Electrophoresis Animation
  const handleRunGel = () => {
    setGelRunning(true);
    setGelProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      if (prog >= 100) {
        clearInterval(interval);
        setGelRunning(false);
        setGelProgress(100);
      } else {
        setGelProgress(prog);
      }
    }, 60);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <GitBranch className="w-4 h-4" />
            <span>Interactive Diagnostic Workup & Decision Tree</span>
            <span>·</span>
            <span>Slides 7–10</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Coxsackievirus Disease Spectrum & Molecular Serotyping Workbench
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Interactive branching flowchart, live agarose gel electrophoresis, and pathognomonic clinical differential comparisons.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveLabTest('gel-electrophoresis')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLabTest === 'gel-electrophoresis' ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Agarose Gel RT-PCR
          </button>
          <button
            onClick={() => setActiveLabTest('differential-matrix')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLabTest === 'differential-matrix' ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Differential Diagnosis Matrix
          </button>
          <button
            onClick={() => setActiveLabTest('pcr')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLabTest === 'pcr' ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            PCR Thermal Plot
          </button>
        </div>
      </div>

      {/* Decision Tree Interactive Branch Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'herpangina', label: '1. Herpangina', tag: 'Posterior Soft Palate', color: 'border-teal-500 text-teal-300' },
          { id: 'classic-hfm', label: '2. Classic HFM', tag: 'Hands, Feet & Mouth', color: 'border-sky-500 text-sky-300' },
          { id: 'atypical-cva6', label: '3. Atypical HFM', tag: 'CVA6 Onychomadesis', color: 'border-rose-500 text-rose-300' },
          { id: 'lymphonodular', label: '4. Lymphonodular', tag: 'CVA10 Nodules (No Ulcers)', color: 'border-amber-500 text-amber-300' },
        ].map((branch) => {
          const isSelected = selectedBranch === branch.id;
          return (
            <button
              key={branch.id}
              onClick={() => {
                setSelectedBranch(branch.id as any);
                setAnalyzedPcr(false);
                setGelProgress(0);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? `bg-slate-850 ${branch.color} shadow-lg ring-1 ring-teal-400`
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-white">{branch.label}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
              </div>
              <span className="text-[11px] font-mono opacity-80">{branch.tag}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Main Visualizer Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Presentation Anatomy & Time-Lapse (6 cols) */}
        <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">
              Visual Presentation: {current.title}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Summer Epidemic Peak
            </span>
          </div>

          {/* SVG Clinical Illustration */}
          <div className="w-full h-60 flex items-center justify-center bg-slate-900 rounded-xl p-3 border border-slate-800 relative overflow-hidden">
            {selectedBranch === 'herpangina' && (
              <svg viewBox="0 0 400 220" className="w-full h-full">
                {/* Oropharynx Dark Cavity */}
                <path d="M 50,40 Q 200,10 350,40 C 370,130 370,190 350,205 Q 200,225 50,205 Z" fill="#831843" />
                {/* Soft Palate & Uvula */}
                <path d="M 180,40 Q 200,110 220,40 Z" fill="#9d174d" stroke="#701a75" strokeWidth="2" />
                <path d="M 50,40 Q 200,80 350,40" stroke="#f472b6" strokeWidth="4" fill="none" opacity="0.6" />
                {/* Tonsillar Pillars */}
                <path d="M 90,60 Q 110,130 90,200" stroke="#f43f5e" strokeWidth="6" fill="none" opacity="0.4" />
                <path d="M 310,60 Q 290,130 310,200" stroke="#f43f5e" strokeWidth="6" fill="none" opacity="0.4" />

                {/* Soft Palate & Tonsillar Pillar 2-4mm Ulcers with Erythematous Halos */}
                {[
                  { x: 130, y: 85 }, { x: 270, y: 90 }, { x: 160, y: 130 }, { x: 240, y: 140 }, { x: 175, y: 65 }, { x: 225, y: 65 }
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="12" fill="#be123c" opacity="0.5" />
                    <circle cx={pt.x} cy={pt.y} r="8" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#fef08a" />
                  </g>
                ))}

                {/* Annotation Banner */}
                <rect x="70" y="175" width="260" height="26" rx="6" fill="#090d16" opacity="0.9" stroke="#be123c" />
                <text x="200" y="192" fill="#fecdd3" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Posterior Oropharynx ONLY (Anterior Gingiva Spared)
                </text>
              </svg>
            )}

            {selectedBranch === 'classic-hfm' && (
              <svg viewBox="0 0 400 220" className="w-full h-full">
                {/* Pediatric Palm */}
                <g transform="translate(40, 20)">
                  <path d="M 30,100 C 10,70 10,30 35,20 C 50,15 65,30 70,50 C 75,25 90,15 105,25 C 115,35 110,60 110,70 C 120,45 135,40 145,55 C 150,65 145,95 140,110 C 135,140 110,165 80,165 C 50,165 35,140 30,100 Z" fill="#fed7aa" stroke="#fb923c" strokeWidth="2" />
                  {/* Oval erythematous vesicles with red halos */}
                  {[
                    { x: 60, y: 70 }, { x: 95, y: 80 }, { x: 75, y: 120 }, { x: 105, y: 130 }, { x: 120, y: 75 }
                  ].map((v, i) => (
                    <g key={i}>
                      <ellipse cx={v.x} cy={v.y} rx="9" ry="6" fill="#f43f5e" />
                      <ellipse cx={v.x} cy={v.y} rx="5" ry="3" fill="#fef08a" />
                    </g>
                  ))}
                  <text x="85" y="182" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Palms & Soles (75–100%)
                  </text>
                </g>

                {/* Oral Mucosal Ulcers */}
                <g transform="translate(240, 30)">
                  <ellipse cx="60" cy="70" rx="60" ry="45" fill="#881337" stroke="#be123c" strokeWidth="2" />
                  <ellipse cx="60" cy="70" rx="45" ry="30" fill="#4c0519" />
                  {/* Aphthae-like erosions on tongue */}
                  <circle cx="45" cy="65" r="9" fill="#fef08a" stroke="#dc2626" strokeWidth="2" />
                  <circle cx="75" cy="75" r="8" fill="#fef08a" stroke="#dc2626" strokeWidth="2" />
                  <text x="60" y="145" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Tongue & Buccal Aphthae
                  </text>
                </g>
              </svg>
            )}

            {selectedBranch === 'atypical-cva6' && (
              <div className="w-full h-full flex flex-col justify-between p-2">
                <svg viewBox="0 0 400 150" className="w-full h-36">
                  {/* Nail Plate Detachment Scheme */}
                  <g transform="translate(60, 10)">
                    {/* Digit */}
                    <rect x="0" y="20" width="100" height="110" rx="14" fill="#fed7aa" stroke="#fb923c" strokeWidth="2" />
                    {/* Proximal Nail Fold */}
                    <rect x="15" y="15" width="70" height="25" rx="6" fill="#f97316" />
                    {/* Cleavage Plane & Shedding Nail Plate */}
                    <rect
                      x="15"
                      y={onychomadesisStage === 2 ? 55 : onychomadesisStage === 1 ? 40 : 30}
                      width="70"
                      height="65"
                      rx="8"
                      fill="#fecdd3"
                      stroke="#e11d48"
                      strokeWidth="2"
                      transform={onychomadesisStage === 2 ? 'rotate(10, 50, 70)' : ''}
                    />
                    {/* Cleavage Gap */}
                    {onychomadesisStage >= 1 && (
                      <line x1="15" y1="36" x2="85" y2="36" stroke="#881337" strokeWidth="6" strokeLinecap="round" />
                    )}
                    <text x="50" y="142" fill="#fda4af" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {onychomadesisStage === 2 ? 'Onychomadesis: Complete Nail Shedding' : onychomadesisStage === 1 ? 'Beau\'s Lines Cleavage' : 'Initial Acute Flare'}
                    </text>
                  </g>

                  {/* Cutaneous Bullae */}
                  <g transform="translate(240, 15)">
                    <ellipse cx="60" cy="55" rx="55" ry="40" fill="#4c0519" stroke="#be123c" strokeWidth="2" />
                    <circle cx="40" cy="40" r="14" fill="#f43f5e" opacity="0.9" />
                    <circle cx="80" cy="45" r="12" fill="#f43f5e" opacity="0.9" />
                    <circle cx="60" cy="70" r="10" fill="#f43f5e" opacity="0.9" />
                    <text x="60" y="115" fill="#fecdd3" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Widespread Perioral & Body Bullae
                    </text>
                  </g>
                </svg>

                {/* Interactive Time-Lapse Slider */}
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">Progression:</span>
                  <div className="flex gap-1.5">
                    {[
                      { id: 0, label: 'Week 1: Rash' },
                      { id: 1, label: 'Week 3: Desquamation' },
                      { id: 2, label: 'Week 6: Nail Shedding' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setOnychomadesisStage(st.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          onychomadesisStage === st.id ? 'bg-rose-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedBranch === 'lymphonodular' && (
              <svg viewBox="0 0 400 220" className="w-full h-full">
                {/* Pharynx with Yellowish Hyperplastic Nodules */}
                <path d="M 50,30 Q 200,10 350,30 C 370,110 370,180 350,195 Q 200,215 50,195 Z" fill="#831843" />
                <path d="M 180,30 Q 200,100 220,30 Z" fill="#9d174d" stroke="#701a75" strokeWidth="2" />
                {/* Diffuse yellowish discrete nodules (lymphoid hyperplasia) WITHOUT ulcers */}
                {[
                  { x: 110, y: 70 }, { x: 145, y: 90 }, { x: 175, y: 115 },
                  { x: 225, y: 115 }, { x: 255, y: 90 }, { x: 290, y: 70 },
                  { x: 135, y: 135 }, { x: 265, y: 135 }, { x: 200, y: 145 }
                ].map((n, i) => (
                  <g key={i}>
                    <circle cx={n.x} cy={n.y} r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                    <circle cx={n.x} cy={n.y} r="4" fill="#ffffff" />
                  </g>
                ))}
                <rect x="50" y="175" width="300" height="26" rx="6" fill="#090d16" opacity="0.9" stroke="#ca8a04" />
                <text x="200" y="192" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
                  CVA10: Diffuse Nodules (Lymphoid Hyperplasia) - NO Ulcers / NO Vesicles
                </text>
              </svg>
            )}
          </div>

          {/* Morphological Breakdown Table */}
          <div className="text-xs space-y-1.5 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
            <div>
              <span className="text-slate-400 font-semibold">Causative Serotypes: </span>
              <span className="text-teal-300 font-bold font-mono">{current.serotypes}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Anatomical Localization: </span>
              <span className="text-slate-200">{current.anatomicSite}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Anterior Gingiva Status: </span>
              <span className="text-amber-300 font-semibold">{current.anteriorGingiva}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Lab Diagnostic Simulation Station (6 cols) */}
        <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          {/* TAB 1: LIVE AGAROSE GEL ELECTROPHORESIS */}
          {activeLabTest === 'gel-electrophoresis' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Dna className="w-4 h-4 text-teal-400" />
                  <span>Agarose Gel Electrophoresis (UV Transilluminator)</span>
                </span>
                <button
                  onClick={handleRunGel}
                  disabled={gelRunning}
                  className="px-3 py-1 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{gelRunning ? 'Migrating...' : 'Run 100V Gel'}</span>
                </button>
              </div>

              {/* Gel Electrophoresis Tank Canvas */}
              <div className="w-full h-56 bg-slate-900 rounded-xl p-3 border border-slate-800 relative flex flex-col justify-between">
                {/* Gel Chamber with UV Glow */}
                <div className="w-full h-full bg-[#0a1128] rounded-lg p-3 border border-indigo-900/60 relative overflow-hidden flex flex-col justify-between shadow-inner">
                  {/* Cathode (-) Top */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-b border-indigo-900/40 pb-1">
                    <span>Cathode (-) Wells</span>
                    <span>1.5% Agarose with Ethidium Bromide</span>
                    <span>Anode (+)</span>
                  </div>

                  {/* Lanes */}
                  <div className="grid grid-cols-4 gap-4 h-full pt-2">
                    {/* Lane 1: DNA Ladder */}
                    <div className="flex flex-col items-center justify-between relative border-r border-indigo-950">
                      <div className="w-8 h-3 bg-indigo-950 border border-indigo-700/60 rounded-t" />
                      {/* Ladder Bands */}
                      {[1000, 500, 420, 300, 154, 100].map((bp, i) => (
                        <div
                          key={i}
                          className="w-7 h-1 bg-amber-400/90 rounded-full shadow-[0_0_8px_#f59e0b]"
                          style={{
                            opacity: gelProgress > 0 ? (gelProgress / 100) : 0.8,
                            transform: `translateY(${gelProgress > 0 ? (gelProgress / 100) * (i * 4) : 0}px)`
                          }}
                        />
                      ))}
                      <span className="text-[9px] font-mono text-slate-400">Ladder</span>
                    </div>

                    {/* Lane 2: Patient Swab RT-PCR */}
                    <div className="flex flex-col items-center justify-between relative border-r border-indigo-950">
                      <div className="w-8 h-3 bg-indigo-950 border border-indigo-700/60 rounded-t" />
                      <div className="h-full flex flex-col justify-center items-center">
                        {/* 154 bp enterovirus consensus band */}
                        <div
                          className="w-8 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_12px_#34d399]"
                          style={{
                            opacity: gelProgress > 20 ? 1 : 0.2,
                            transform: `translateY(${gelProgress > 0 ? (gelProgress / 100) * 20 : 0}px)`
                          }}
                        />
                        {/* If CVA6, also show 420 bp VP1 band! */}
                        {selectedBranch === 'atypical-cva6' && (
                          <div
                            className="w-8 h-1.5 bg-rose-400 rounded-full shadow-[0_0_12px_#fb7185] mt-4"
                            style={{
                              opacity: gelProgress > 20 ? 1 : 0.2,
                            }}
                          />
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">Patient</span>
                    </div>

                    {/* Lane 3: Negative Control (H2O) */}
                    <div className="flex flex-col items-center justify-between relative border-r border-indigo-950">
                      <div className="w-8 h-3 bg-indigo-950 border border-indigo-700/60 rounded-t" />
                      <div className="h-full flex items-center justify-center">
                        <span className="text-[9px] font-mono text-slate-600">No Band</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">Neg Ctrl</span>
                    </div>

                    {/* Lane 4: Positive Enterovirus Control */}
                    <div className="flex flex-col items-center justify-between relative">
                      <div className="w-8 h-3 bg-indigo-950 border border-indigo-700/60 rounded-t" />
                      <div className="h-full flex flex-col justify-center items-center">
                        <div className="w-8 h-1.5 bg-teal-400 rounded-full shadow-[0_0_10px_#2dd4bf]" />
                      </div>
                      <span className="text-[9px] font-mono text-teal-400 font-bold">Pos Ctrl</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Band Reading Callout */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-teal-300 block">Molecular Identification:</span>
                <p className="text-slate-200 font-mono text-[11px]">{current.rtPcrResult}</p>
                <p className="text-slate-400 text-[11px]">
                  Slide 10: Enterovirus RT-PCR amplifies the highly conserved 5' untranslated region (5' UTR) at 154 bp for rapid group diagnosis.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DIFFERENTIAL DIAGNOSIS COMPARATOR MATRIX */}
          {activeLabTest === 'differential-matrix' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Board Exam Differential Diagnostic Matrix
                </span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    onClick={() => setDifferentialComparison('phgs')}
                    className={`px-2 py-0.5 rounded font-mono ${
                      differentialComparison === 'phgs' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    vs. HSV (PHGS)
                  </button>
                  <button
                    onClick={() => setDifferentialComparison('gabhs')}
                    className={`px-2 py-0.5 rounded font-mono ${
                      differentialComparison === 'gabhs' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    vs. Strep Throat
                  </button>
                  <button
                    onClick={() => setDifferentialComparison('aphthous')}
                    className={`px-2 py-0.5 rounded font-mono ${
                      differentialComparison === 'aphthous' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    vs. Aphthous
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 text-xs leading-relaxed">
                {differentialComparison === 'phgs' && (
                  <>
                    <div className="font-bold text-white text-sm">
                      Herpangina vs. Primary Herpetic Gingivostomatitis (PHGS):
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-teal-800/80">
                        <span className="font-bold text-teal-300 block mb-1">Herpangina (CV):</span>
                        <p className="text-slate-300">
                          Ulcers strictly localized to the <strong>posterior soft palate, tonsillar pillars, and uvula</strong>. Anterior gingiva, lips, and cheeks are <strong>completely spared</strong>.
                        </p>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-rose-800/80">
                        <span className="font-bold text-rose-300 block mb-1">PHGS (HSV-1):</span>
                        <p className="text-slate-300">
                          Features <strong>generalized diffuse marginal gingivitis</strong> with fiery red, swollen gingiva and ulcers everywhere on anterior lips and buccal mucosa.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {differentialComparison === 'gabhs' && (
                  <>
                    <div className="font-bold text-white text-sm">
                      Herpangina vs. Group A Streptococcal Pharyngitis:
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-teal-800/80">
                        <span className="font-bold text-teal-300 block mb-1">Coxsackievirus:</span>
                        <p className="text-slate-300">
                          Vesicular eruptions that rupture into shallow 2–4 mm ulcers with red halos. Rapid Strep Antigen is <strong>NEGATIVE</strong>. Self-limiting.
                        </p>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-amber-800/80">
                        <span className="font-bold text-amber-300 block mb-1">Strep Pharyngitis:</span>
                        <p className="text-slate-300">
                          Exudative tonsillar pseudomembranes, strawberry tongue, absence of cough. Rapid Strep Antigen is <strong>POSITIVE</strong>. Requires oral Penicillin.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {differentialComparison === 'aphthous' && (
                  <>
                    <div className="font-bold text-white text-sm">
                      Coxsackievirus vs. Recurrent Aphthous Stomatitis:
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                      Aphthous ulcers are NOT accompanied by high fever or systemic viral prodrome, do not occur as seasonal summer epidemics, and lack cutaneous palmar/plantar vesicles.
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PCR THERMAL PLOT */}
          {activeLabTest === 'pcr' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
                  Quantitative RT-PCR Amplification Kinetics
                </span>
                <span className="text-[10px] font-mono text-slate-400">FAM Fluorophore</span>
              </div>

              <div className="w-full h-44 bg-slate-900 rounded-xl p-3 border border-slate-800 relative">
                <svg viewBox="0 0 360 140" className="w-full h-full">
                  {[25, 60, 95, 130].map((y, i) => (
                    <line key={i} x1="25" y1={y} x2="340" y2={y} stroke="#1e293b" strokeWidth="1" />
                  ))}
                  <line x1="25" y1="80" x2="340" y2="80" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="335" y="76" fill="#f43f5e" fontSize="9" textAnchor="end">Cycle Threshold (Ct)</text>
                  <path
                    d="M 25,130 L 140,130 Q 185,128 210,80 T 270,25 L 340,22"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Ct: 21.2 (High Viral RNA Copynumber)
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-sky-300">Diagnostic Rule (Slide 10): </span>
                Enterovirus real-time RT-PCR has replaced viral culture as the rapid gold standard, with sensitivity &gt;95% and specificity approaching 100%.
              </div>
            </div>
          )}

          {/* Bottom Clinical Management Pearl */}
          <div className="p-3 bg-teal-950/30 rounded-xl border border-teal-800/50 text-xs text-teal-200/90 leading-relaxed">
            <span className="font-bold text-teal-300">Self-Limiting Course & Supportive Care (Slide 10): </span>
            Coxsackievirus infections resolve spontaneously in <strong>5–10 days</strong>. Antivirals are ineffective and not indicated. Prescribe oral hydration with cold liquids, soft bland diet, and Acetaminophen/Ibuprofen for fever. Strict hand hygiene to halt daycare spread.
          </div>
        </div>
      </div>
    </div>
  );
};
