import React, { useState, useEffect } from 'react';
import { ShieldCheck, Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export const Lec2Visuals: React.FC = () => {
  const [selectedFissure, setSelectedFissure] = useState<'V' | 'U' | 'Y' | 'I'>('I');
  const [activeStep, setActiveStep] = useState<number>(4); // Default to acid etch
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(20);
  const [isFluorosed, setIsFluorosed] = useState<boolean>(false);

  // Fissure Morphology Data
  const fissureData = {
    V: {
      type: 'V-Type Fissure',
      prevalence: '34% of pits & fissures',
      shape: 'Wide at top, gradually narrows to base',
      cariesRisk: 'Low to Moderate',
      cleanability: 'High - toothbrush bristles can cleanse shallow slopes',
      sealantPenetration: 'Excellent - low viscosity resin easily reaches bottom without trapping air',
      svgPath: 'M 10,20 L 50,110 L 90,20',
      bristleReach: 85,
    },
    U: {
      type: 'U-Type Fissure',
      prevalence: '14% of pits & fissures',
      shape: 'Shallow, uniform width throughout',
      cariesRisk: 'Low',
      cleanability: 'Very High - self-cleansing with masticatory bolus',
      sealantPenetration: 'Very Good - broad flat base',
      svgPath: 'M 15,20 L 25,85 C 30,105 70,105 75,85 L 85,20',
      bristleReach: 95,
    },
    Y: {
      type: 'Y-Type Fissure',
      prevalence: 'Common in mandibular molars',
      shape: 'Single canal branching into multiple bifurcations at bottom',
      cariesRisk: 'High',
      cleanability: 'Poor - branches shelter bacterial biofilm',
      sealantPenetration: 'Moderate - requires careful explorer probing to avoid trapped air',
      svgPath: 'M 15,20 L 45,70 L 45,100 M 45,70 L 85,20 M 45,100 L 30,120 M 45,100 L 60,120',
      bristleReach: 45,
    },
    I: {
      type: 'I-Type Fissure (Bottleneck)',
      prevalence: 'Deepest & narrowest variant',
      shape: 'Extremely constricted neck with an expanded bulbous base',
      cariesRisk: 'HIGHEST (Severe)',
      cleanability: 'Zero - toothbrush bristles (0.2 mm) cannot fit inside narrow neck (0.1 mm)',
      sealantPenetration: 'Critical - must use low-viscosity resin; acid etch allows resin tags to seal neck',
      svgPath: 'M 10,20 L 46,75 L 46,95 C 40,100 35,115 50,120 C 65,115 60,100 54,95 L 54,75 L 90,20',
      bristleReach: 20,
    },
  };

  const currentFissure = fissureData[selectedFissure];

  // Clinical Protocol Steps
  const protocolSteps = [
    { num: 1, name: 'Surface Cleanliness', time: '15s', note: 'Clean with pumice slurry or air abrasion. No oil-based pastes!' },
    { num: 2, name: 'Isolation', time: 'Ongoing', note: 'Rubber dam (ideal) or cotton rolls + parotid bibulous pads. 100% dry field.' },
    { num: 3, name: 'Dry Surfaces', time: '20-30s', note: 'Check air syringe for moisture on a cool dental mirror. No fogging allowed!' },
    { num: 4, name: '37% Phosphoric Acid Etch', time: isFluorosed ? '35s' : '20s', note: 'Extend 2mm up cuspal inclines. Add +15s for fluorosed enamel.' },
    { num: 5, name: 'Rinse & Dry', time: '10s + 10s', note: 'Rinse into aspirator tip. Surface MUST appear chalky, dull, frosty white.' },
    { num: 6, name: 'Sealant Application & Cure', time: '20s', note: 'Flow Bis-GMA into deepest pits. Avoid air bubbles. Knife-edge on cusps. Blue LED cure.' },
    { num: 7, name: 'Evaluation', time: '30s', note: 'Gently test retention with periodontal scaler/explorer. Check bite with articulating paper.' },
    { num: 8, name: 'Re-evaluation', time: '3-6 Mo', note: '3-month initial recall (faulty technique failures occur early). 6-month routine checks.' },
  ];

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining]);

  const handleStartTimer = (seconds: number) => {
    setTimeRemaining(seconds);
    setTimerRunning(true);
  };

  return (
    <div className="space-y-6">
      {/* 2D Visual 1: Fissure Morphology Cross-Section Explorer */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EC] gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C9A24B]" />
              Fissure Morphology & Toothbrush Penetration Limit
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Why toothbrushes cannot clean deep fissures: Bristle diameter (0.2 mm) vs Fissure neck (&lt;0.1 mm)
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F3] text-[#1B3A8C] border border-[#C9A24B]/40">
            Anatomical Risk Factors
          </span>
        </div>

        {/* Fissure Type Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          {(['V', 'U', 'Y', 'I'] as const).map(type => {
            const isSelected = selectedFissure === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedFissure(type)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                    : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
                }`}
              >
                <span className="font-extrabold text-base block font-mono">{type}-Type</span>
                <span className="text-[10px] block opacity-80 mt-0.5">{fissureData[type].cariesRisk} Risk</span>
              </button>
            );
          })}
        </div>

        {/* Fissure Cross-Section SVG Diagram & Clinical Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#FAF8F3] p-4 sm:p-5 rounded-xl border border-[#C9A24B]/30">
          {/* SVG Cross-Section */}
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-[#E6E8EC]">
            <svg width="200" height="150" viewBox="0 0 100 130" className="overflow-visible">
              {/* Enamel Cross Section Fill */}
              <path
                d="M 5,10 L 5,125 L 95,125 L 95,10 Z"
                fill="#FDFBF7"
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
              {/* Fissure Invagination */}
              <path
                d={currentFissure.svgPath}
                fill="none"
                stroke="#0B1F4D"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Toothbrush Bristle (Diameter 0.2mm, red cylinder trying to enter) */}
              <rect x="44" y="0" width="12" height="38" rx="3" fill="#EF4444" opacity="0.85" />
              <text x="50" y="-4" textAnchor="middle" fontSize="7" fill="#EF4444" fontWeight="bold">
                Bristle 0.2mm
              </text>
              {/* Plaque accumulation zone indicator */}
              <circle cx="50" cy="112" r="5" fill="#854D0E" opacity="0.7" />
            </svg>
            <div className="w-full mt-3 flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500">Bristle Reach:</span>
              <span className={`font-mono ${currentFissure.bristleReach < 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                {currentFissure.bristleReach}% Depth Accessible
              </span>
            </div>
            <div className="w-full bg-[#E6E8EC] h-2 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  currentFissure.bristleReach < 50 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${currentFissure.bristleReach}%` }}
              />
            </div>
          </div>

          {/* Morphological Clinical Data */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#0B1F4D]">{currentFissure.type}</span>
              <span className="text-[11px] font-semibold text-[#1B3A8C] bg-white px-2 py-0.5 rounded-md border border-[#E6E8EC]">
                {currentFissure.prevalence}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed font-sans">
              <strong className="text-[#0B1F4D]">Morphology:</strong> {currentFissure.shape}
            </p>
            <p className="text-slate-700 leading-relaxed font-sans">
              <strong className="text-[#0B1F4D]">Caries Susceptibility:</strong> {currentFissure.cariesRisk}
            </p>
            <p className="text-slate-700 leading-relaxed font-sans">
              <strong className="text-[#0B1F4D]">Cleanability:</strong> {currentFissure.cleanability}
            </p>
            <div className="p-2.5 rounded-lg bg-white border border-[#C9A24B]/30 text-slate-800">
              <strong className="text-[#1B3A8C] block mb-0.5">Sealant Strategy:</strong>
              {currentFissure.sealantPenetration}
            </div>
          </div>
        </div>
      </div>

      {/* 2D Visual 2: 8-Step Interactive Clinical Protocol & Live Timers */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EC] gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A24B]" />
              The 8-Step Clinical Protocol & Precision Timer
            </h3>
            <p className="text-xs text-slate-500">
              Follow every sequential step with mandatory clinical checks & acid etching timers
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-[#0B1F4D] cursor-pointer bg-[#FAF8F3] px-3 py-1.5 rounded-xl border border-[#E6E8EC]">
            <input
              type="checkbox"
              checked={isFluorosed}
              onChange={(e) => setIsFluorosed(e.target.checked)}
              className="accent-[#C9A24B] w-4 h-4 rounded cursor-pointer"
            />
            <span>Fluorosed Teeth (+15s Etch)</span>
          </label>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 my-4">
          {protocolSteps.map((step) => {
            const isCurrent = activeStep === step.num;
            return (
              <button
                key={step.num}
                onClick={() => {
                  setActiveStep(step.num);
                  setTimerRunning(false);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                    : 'bg-[#FAF8F3] text-slate-700 hover:bg-[#E6E8EC] border-[#E6E8EC]'
                }`}
              >
                <span className={`text-[10px] font-bold block ${isCurrent ? 'text-[#C9A24B]' : 'text-[#1B3A8C]'}`}>
                  Step {step.num}
                </span>
                <p className="text-xs font-bold truncate mt-0.5 leading-snug">{step.name}</p>
                <span className="text-[10px] opacity-75 block font-mono mt-1">{step.time}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Clinical Focus Card */}
        {protocolSteps[activeStep - 1] && (
          <div className="bg-[#FAF8F3] rounded-xl p-4 sm:p-5 border border-[#C9A24B]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#C9A24B] uppercase tracking-wider block">
                Step {activeStep} Protocol Directives
              </span>
              <h4 className="font-bold text-sm sm:text-base text-[#0B1F4D]">
                {protocolSteps[activeStep - 1].name}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-sans max-w-xl">
                {protocolSteps[activeStep - 1].note}
              </p>
            </div>

            {/* Timer for Etch / Rinse / Dry */}
            {(activeStep === 4 || activeStep === 5 || activeStep === 6) && (
              <div className="bg-white p-3 rounded-xl border border-[#E6E8EC] flex items-center gap-3 shrink-0 shadow-xs">
                <div className="text-center min-w-[70px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Countdown</span>
                  <span className={`font-mono text-xl font-extrabold ${timeRemaining <= 3 ? 'text-red-600 animate-pulse' : 'text-[#0B1F4D]'}`}>
                    00:{timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      if (timerRunning) {
                        setTimerRunning(false);
                      } else {
                        handleStartTimer(activeStep === 4 ? (isFluorosed ? 35 : 20) : activeStep === 5 ? 10 : 20);
                      }
                    }}
                    className="p-2 rounded-lg bg-[#0B1F4D] text-[#FAF8F3] hover:bg-[#1B3A8C] transition-colors"
                    title={timerRunning ? 'Pause Timer' : 'Start Timer'}
                  >
                    {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-[#C9A24B]" />}
                  </button>
                  <button
                    onClick={() => {
                      setTimerRunning(false);
                      setTimeRemaining(activeStep === 4 ? (isFluorosed ? 35 : 20) : activeStep === 5 ? 10 : 20);
                    }}
                    className="p-2 rounded-lg bg-[#E6E8EC] text-slate-600 hover:bg-slate-300 transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clinical Contamination Rule Warning */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-bold">Contamination Golden Rule:</strong> If saliva contacts etched enamel for even a fraction of a second, the organic pellicle completely blocks microtag formation. <strong>Action:</strong> Re-isolate, wash, dry, and re-etch for 15 seconds!
          </div>
        </div>
      </div>
    </div>
  );
};
