import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

export const NugDebridementSimulator: React.FC = () => {
  const [anesthesiaApplied, setAnesthesiaApplied] = useState<boolean>(false);
  const [debridedCraters, setDebridedCraters] = useState<number[]>([0, 0, 0, 0]); // 4 papillae: 0=necrotic, 1=debrided
  const [chlorhexidineFlushed, setChlorhexidineFlushed] = useState<boolean>(false);
  const [systemicAntibioticPrescribed, setSystemicAntibioticPrescribed] = useState<boolean>(false);
  const [painLevel, setPainLevel] = useState<number>(9); // 0 to 10 scale

  const handleApplyAnesthesia = () => {
    setAnesthesiaApplied(true);
    setPainLevel(2);
  };

  const handleDebrideCrater = (idx: number) => {
    if (!anesthesiaApplied) {
      alert('Patient experiences excruciating pain! Apply topical anesthesia before mechanical debridement (Lecture Slide 16).');
      return;
    }
    const updated = [...debridedCraters];
    updated[idx] = 1;
    setDebridedCraters(updated);
    if (updated.every((v) => v === 1)) {
      setPainLevel(1);
    }
  };

  const handleFlushChlorhexidine = () => {
    if (!debridedCraters.some((v) => v === 1)) {
      alert('Debride necrotic debris first to allow antimicrobial penetration.');
      return;
    }
    setChlorhexidineFlushed(true);
    setPainLevel(0);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleReset = () => {
    setAnesthesiaApplied(false);
    setDebridedCraters([0, 0, 0, 0]);
    setChlorhexidineFlushed(false);
    setSystemicAntibioticPrescribed(false);
    setPainLevel(9);
  };

  const isFullyTreated = debridedCraters.every((v) => v === 1) && chlorhexidineFlushed;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <span>Clinical Procedure Simulator</span>
            <span>·</span>
            <span>Slide 16 Protocol</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">NUG Gentle Debridement & Irrigation Procedure</h3>
          <p className="text-xs text-slate-400 mt-1">
            Treat acute necrotizing ulcerative gingivitis: administer topical anesthesia, gently remove necrotic pseudomembranes, and irrigate with chlorhexidine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Patient Pain Score: </span>
            <span className={`font-mono font-bold ${painLevel > 5 ? 'text-rose-400' : painLevel > 1 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {painLevel} / 10
            </span>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Interactive Surgical Stage Graphic */}
      <div className="w-full bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative">
        <svg viewBox="0 0 600 240" className="w-full max-w-xl h-auto">
          {/* Lower Anterior Mandibular Teeth */}
          {[120, 200, 280, 360, 440].map((tx, i) => (
            <rect
              key={i}
              x={tx - 25}
              y={40}
              width={50}
              height={90}
              rx={6}
              fill="#fefce8"
              stroke="#cbd5e1"
              strokeWidth="2.5"
            />
          ))}

          {/* Inflamed Gingival Arch */}
          <path
            d="M 60,110 C 180,95 380,95 500,110 L 500,210 L 60,210 Z"
            fill={chlorhexidineFlushed ? '#f472b6' : '#991b1b'}
            style={{ transition: 'fill 0.5s ease' }}
          />

          {/* Interdental Papillae (4 craters) */}
          {[175, 255, 335, 415].map((cx, idx) => {
            const isDebrided = debridedCraters[idx] === 1;
            return (
              <g
                key={idx}
                onClick={() => handleDebrideCrater(idx)}
                className="cursor-pointer group"
              >
                {/* Gingival crater */}
                <path
                  d={`M ${cx - 16},100 Q ${cx},140 ${cx + 16},100 Z`}
                  fill={isDebrided ? (chlorhexidineFlushed ? '#f472b6' : '#dc2626') : '#475569'}
                  stroke={isDebrided ? '#b91c1c' : '#334155'}
                  strokeWidth="3"
                />

                {/* Gray necrotic pseudomembrane if not debrided */}
                {!isDebrided && (
                  <ellipse cx={cx} cy={115} rx={12} ry={9} fill="#64748b" className="group-hover:opacity-75" />
                )}

                {/* Bleeding drops if not flushed */}
                {!chlorhexidineFlushed && !isDebrided && (
                  <circle cx={cx} cy={138} r={3.5} fill="#dc2626" />
                )}

                {/* Tooltip prompt */}
                {!isDebrided && (
                  <text
                    x={cx}
                    y={165}
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize="10"
                    fontWeight="bold"
                    className="select-none"
                  >
                    Click to Debride
                  </text>
                )}
                {isDebrided && (
                  <text
                    x={cx}
                    y={165}
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="10"
                    fontWeight="bold"
                    className="select-none"
                  >
                    Cleaned ✓
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {anesthesiaApplied && !isFullyTreated && (
          <div className="absolute top-3 left-4 bg-teal-950/80 px-3 py-1 rounded-lg border border-teal-700/60 text-teal-300 text-[11px] font-mono">
            ✓ Topical Viscous Lidocaine Active (Numbness Achieved)
          </div>
        )}

        {isFullyTreated && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
            <h4 className="text-base font-bold text-white">Acute Phase Successfully Controlled!</h4>
            <p className="text-xs text-slate-300 max-w-md mt-1">
              Necrotic pseudomembrane debrided and flushed with 0.12% Chlorhexidine gluconate. Lecture Slide 16 confirms &gt;90% resolution rate with this protocol!
            </p>
          </div>
        )}
      </div>

      {/* Clinical Tool Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Step 1: Anesthesia */}
        <button
          onClick={handleApplyAnesthesia}
          disabled={anesthesiaApplied}
          className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
            anesthesiaApplied
              ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-teal-500 hover:text-white'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] flex items-center justify-center">1</span>
            <span>Apply Topical Anesthesia</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Essential first step to eliminate agonizing pain during mechanical instrumentation (Slide 16).
          </p>
        </button>

        {/* Step 2: Mechanical Debridement */}
        <div
          className={`p-3.5 rounded-xl border text-left flex flex-col justify-between ${
            debridedCraters.every((v) => v === 1)
              ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
              : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] flex items-center justify-center">2</span>
            <span>Gentle Mechanical Debridement</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Click on each necrotic crater above to gently peel off the gray fibrinous slough.
          </p>
        </div>

        {/* Step 3: Chlorhexidine Lavage */}
        <button
          onClick={handleFlushChlorhexidine}
          disabled={chlorhexidineFlushed || !debridedCraters.some((v) => v === 1)}
          className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
            chlorhexidineFlushed
              ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-teal-500 hover:text-white disabled:opacity-40'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] flex items-center justify-center">3</span>
            <span>0.12% Chlorhexidine Rinse</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Bactericidal lavage achieving &gt;90% resolution across fuso-spirochetal flora (Slide 16).
          </p>
        </button>
      </div>
    </div>
  );
};
