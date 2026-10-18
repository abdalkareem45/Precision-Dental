import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Calculator, HeartPulse, Sparkles } from 'lucide-react';

export const SjsScortenCalculator: React.FC = () => {
  // Body Zones: Wallace Rule of Nines
  const [selectedZones, setSelectedZones] = useState<Record<string, boolean>>({
    head: false, // 9%
    chest: true, // 18% (arises on chest first in SJS/TEN - Slide 23)
    back: false, // 18%
    arms: false, // 18%
    legs: false, // 36%
    genitalia: true, // 1% (mucosal involvement - Slide 24)
  });

  // SCORTEN 7 Risk Predictors (First 24h)
  const [scortenRiskFactors, setScortenRiskFactors] = useState({
    ageOver40: true,
    malignancy: false,
    tachycardia: true, // HR > 120
    highUrea: false, // > 10 mmol/L
    highGlucose: false, // > 14 mmol/L
    lowBicarbonate: false, // < 20 mmol/L
  });

  const zonePercentages: Record<string, number> = {
    head: 9,
    chest: 18,
    back: 18,
    arms: 18,
    legs: 36,
    genitalia: 1,
  };

  const calculateTotalBsa = () => {
    let sum = 0;
    Object.keys(selectedZones).forEach((zone) => {
      if (selectedZones[zone]) sum += zonePercentages[zone];
    });
    return sum;
  };

  const totalBsa = calculateTotalBsa();

  // Formal Diagnostic Category (Slide 24)
  const getClassification = (bsa: number) => {
    if (bsa < 10) {
      return {
        label: 'Stevens-Johnson Syndrome (SJS)',
        range: '< 10% BSA',
        lectureMortality: '1–5%',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-950/60 border-amber-600',
      };
    } else if (bsa <= 30) {
      return {
        label: 'SJS - TEN Overlap Syndrome',
        range: '10% – 30% BSA',
        lectureMortality: '10–20%',
        color: 'text-rose-400',
        badgeBg: 'bg-rose-950/60 border-rose-600',
      };
    } else {
      return {
        label: 'Toxic Epidermal Necrolysis (TEN / Lyell Disease)',
        range: '> 30% BSA',
        lectureMortality: '25–35%',
        color: 'text-purple-400',
        badgeBg: 'bg-purple-950/60 border-purple-600',
      };
    }
  };

  const classification = getClassification(totalBsa);

  // SCORTEN points
  const calculateScorten = () => {
    let score = 0;
    if (scortenRiskFactors.ageOver40) score += 1;
    if (scortenRiskFactors.malignancy) score += 1;
    if (scortenRiskFactors.tachycardia) score += 1;
    if (totalBsa >= 10) score += 1; // Detachment > 10%
    if (scortenRiskFactors.highUrea) score += 1;
    if (scortenRiskFactors.highGlucose) score += 1;
    if (scortenRiskFactors.lowBicarbonate) score += 1;
    return score;
  };

  const scortenScore = calculateScorten();

  const getScortenMortality = (pts: number) => {
    switch (pts) {
      case 0:
      case 1:
        return '3.2%';
      case 2:
        return '12.1%';
      case 3:
        return '35.3%';
      case 4:
        return '58.3%';
      default:
        return '90.0%';
    }
  };

  const toggleZone = (zone: string) => {
    setSelectedZones({ ...selectedZones, [zone]: !selectedZones[zone] });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-1">
            <span>Critical Care Severity Tool</span>
            <span>·</span>
            <span>Slides 23–24</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            SJS / TEN BSA Detachment & SCORTEN Mortality Calculator
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Calculate epidermal detachment BSA percentage using the Wallace Rule of Nines and stratify life-threatening mortality risk.
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl border text-xs flex items-center gap-2 font-mono ${classification.badgeBg}`}>
          <span className="font-bold">{classification.label}</span>
          <span className="text-slate-400">·</span>
          <span className="text-white font-bold">{totalBsa}% BSA</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Body Mannequin Diagram (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
          <span className="text-xs font-semibold text-slate-300">Click Body Zones to Toggle Epidermal Detachment:</span>

          <svg viewBox="0 0 240 380" className="w-56 h-auto select-none">
            {/* Head (9%) */}
            <circle
              cx="120"
              cy="40"
              r="28"
              onClick={() => toggleZone('head')}
              className="cursor-pointer transition-colors"
              fill={selectedZones.head ? '#7c3aed' : '#334155'}
              stroke="#64748b"
              strokeWidth="2"
            />
            <text x="120" y="44" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              Head 9%
            </text>

            {/* Anterior Torso / Chest (18%) */}
            <rect
              x="80"
              y="75"
              width="80"
              height="95"
              rx="10"
              onClick={() => toggleZone('chest')}
              className="cursor-pointer transition-colors"
              fill={selectedZones.chest ? '#7c3aed' : '#334155'}
              stroke="#64748b"
              strokeWidth="2"
            />
            <text x="120" y="125" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              Chest 18%
            </text>

            {/* Arms (18% total: 9% left + 9% right) */}
            <rect
              x="42"
              y="85"
              width="32"
              height="115"
              rx="8"
              onClick={() => toggleZone('arms')}
              className="cursor-pointer transition-colors"
              fill={selectedZones.arms ? '#7c3aed' : '#334155'}
              stroke="#64748b"
              strokeWidth="2"
            />
            <rect
              x="166"
              y="85"
              width="32"
              height="115"
              rx="8"
              onClick={() => toggleZone('arms')}
              className="cursor-pointer transition-colors"
              fill={selectedZones.arms ? '#7c3aed' : '#334155'}
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Genitalia (1%) */}
            <circle
              cx="120"
              cy="180"
              r="12"
              onClick={() => toggleZone('genitalia')}
              className="cursor-pointer transition-colors"
              fill={selectedZones.genitalia ? '#ec4899' : '#334155'}
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Legs (36% total: 18% left + 18% right) */}
            <rect
              x="78"
              y="198"
              width="38"
              height="160"
              rx="8"
              onClick={() => toggleZone('legs')}
              className="cursor-pointer transition-colors"
              fill={selectedZones.legs ? '#7c3aed' : '#334155'}
              stroke="#64748b"
              strokeWidth="2"
            />
            <rect
              x="124"
              y="198"
              width="38"
              height="160"
              rx="8"
              onClick={() => toggleZone('legs')}
              className="cursor-pointer transition-colors"
              fill={selectedZones.legs ? '#7c3aed' : '#334155'}
              stroke="#64748b"
              strokeWidth="2"
            />
            <text x="120" y="275" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              Legs 36%
            </text>
          </svg>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() => toggleZone('back')}
              className={`px-3 py-1 rounded-lg border text-xs transition-colors ${
                selectedZones.back ? 'bg-purple-950 border-purple-600 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              Posterior Torso / Back (18%)
            </button>
          </div>
        </div>

        {/* SCORTEN Predictors & Mortality Readout (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-teal-400" />
                <span>SCORTEN Prognostic Factor Checklist</span>
              </span>
              <span className="font-mono text-xs text-teal-400 font-bold">Score: {scortenScore} / 7</span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={scortenRiskFactors.ageOver40}
                  onChange={(e) => setScortenRiskFactors({ ...scortenRiskFactors, ageOver40: e.target.checked })}
                  className="rounded accent-purple-500"
                />
                <span>Age &gt; 40 years (+1 point)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={scortenRiskFactors.tachycardia}
                  onChange={(e) => setScortenRiskFactors({ ...scortenRiskFactors, tachycardia: e.target.checked })}
                  className="rounded accent-purple-500"
                />
                <span>Heart Rate &gt; 120 bpm (+1 point)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={totalBsa >= 10}
                  readOnly
                  className="rounded accent-purple-500"
                />
                <span>Epidermal Detachment &ge; 10% BSA ({totalBsa >= 10 ? '+1 point' : '0 points'})</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={scortenRiskFactors.highUrea}
                  onChange={(e) => setScortenRiskFactors({ ...scortenRiskFactors, highUrea: e.target.checked })}
                  className="rounded accent-purple-500"
                />
                <span>Serum Urea &gt; 10 mmol/L (BUN &gt; 28 mg/dL) (+1 point)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={scortenRiskFactors.highGlucose}
                  onChange={(e) => setScortenRiskFactors({ ...scortenRiskFactors, highGlucose: e.target.checked })}
                  className="rounded accent-purple-500"
                />
                <span>Serum Glucose &gt; 14 mmol/L (&gt; 250 mg/dL) (+1 point)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={scortenRiskFactors.lowBicarbonate}
                  onChange={(e) => setScortenRiskFactors({ ...scortenRiskFactors, lowBicarbonate: e.target.checked })}
                  className="rounded accent-purple-500"
                />
                <span>Serum Bicarbonate &lt; 20 mmol/L (+1 point)</span>
              </label>
            </div>
          </div>

          {/* Outcome & Lecture Mortality Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-medium">Lecture 2 Baseline Mortality (Slide 24):</span>
              <div className={`font-mono text-2xl font-bold ${classification.color}`}>
                {classification.lectureMortality}
              </div>
              <span className="text-[11px] text-slate-400 block">
                SJS (1–5%) vs TEN (25–35%) based solely on BSA detachment cutoff
              </span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-medium">SCORTEN Predicted Mortality:</span>
              <div className="font-mono text-2xl font-bold text-rose-400">
                {getScortenMortality(scortenScore)}
              </div>
              <span className="text-[11px] text-slate-400 block">
                Multisystem prognostic score within first 24 hours of admission
              </span>
            </div>
          </div>

          <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-800/50 text-xs text-purple-200/90 leading-relaxed">
            <span className="font-bold text-purple-300">Clinical Landmark (Slide 23 & 24): </span>
            Lesions in SJS/TEN arise preferentially on the <strong>CHEST</strong> and trunk as atypical flat purpuric macules (unlike EM which begins distally on the hands). Prompt cessation of culprit drugs (allopurinol, anticonvulsants, sulfonamides) is the single most vital survival factor.
          </div>
        </div>
      </div>
    </div>
  );
};
