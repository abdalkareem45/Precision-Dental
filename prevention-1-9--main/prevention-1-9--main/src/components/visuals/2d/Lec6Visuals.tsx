import React, { useState } from 'react';
import { Droplets, AlertTriangle, ShieldCheck, CheckCircle2, Sparkles, User, Info } from 'lucide-react';

export const Lec6Visuals: React.FC = () => {
  const [childAge, setChildAge] = useState<number>(4);
  const [selectedFormulation, setSelectedFormulation] = useState<'naf' | 'mfp' | 'snf2'>('mfp');
  const [mouthrinseMode, setMouthrinseMode] = useState<'daily' | 'weekly'>('daily');

  // Pediatric guidance based on age
  const getPediatricGuideline = (age: number) => {
    if (age < 3) {
      return {
        doseName: 'Smear / Grain of Rice Size',
        visualWidth: '20%',
        swallowRisk: 'High (Child swallows ~0.38 mg/brushing)',
        ppmRecommended: '500 ppm or tiny smear of 1000 ppm',
        supervision: 'Strict parent brushing required',
        mouthrinseAllowed: false,
        warning: 'High risk of dental fluorosis if candy-flavored toothpaste is swallowed!'
      };
    } else if (age <= 6) {
      return {
        doseName: 'Pea-Sized Amount (< 5 mm)',
        visualWidth: '40%',
        swallowRisk: 'Moderate (Child swallows ~0.12 - 0.25 mg/brushing)',
        ppmRecommended: '1000 ppm F (or 500-550 ppm lower-strength)',
        supervision: 'Parental supervision mandatory',
        mouthrinseAllowed: false,
        warning: 'ADA strictly prohibits fluoride mouthrinses under 6 due to lack of swallowing control!'
      };
    } else {
      return {
        doseName: 'Standard Pea-Size to Small Ribbon',
        visualWidth: '70%',
        swallowRisk: 'Minimal (Swallowing reflex fully established)',
        ppmRecommended: '1000 - 1450 ppm F',
        supervision: 'Self-brushing with intermittent checks',
        mouthrinseAllowed: true,
        warning: 'Do not rinse mouth with water after brushing; spit out and leave fluoride on teeth for 30 mins.'
      };
    }
  };

  const pediatricInfo = getPediatricGuideline(childAge);

  const formulations = {
    naf: {
      name: 'Sodium Fluoride (NaF 0.2%)',
      fluorideYield: '1000 - 1100 ppm F (0.1% F-)',
      chemistry: 'Ionic salt that dissociates immediately into free Na+ and F- ions in saliva.',
      abrasiveCompatibility: 'Incompatible with calcium carbonate abrasives (forms insoluble CaF2 in the tube); requires silica abrasives.',
      extrinsicStaining: 'None (Leaves restorations pristine white)',
      clinicalStatus: 'Highly popular worldwide; excellent acute remineralization.'
    },
    mfp: {
      name: 'Sodium Monofluorophosphate (MFP 0.76%)',
      fluorideYield: '1000 - 1100 ppm F (0.1% F-)',
      chemistry: 'Covalently bonded PO3F2- ion complex; slowly releases fluoride in plaque via bacterial phosphatases.',
      abrasiveCompatibility: 'Universal compatibility! Does not precipitate with calcium carbonate abrasives.',
      extrinsicStaining: 'None (Aesthetically flawless)',
      clinicalStatus: 'By far the greatest number of commercial dentifrices on earth contain MFP.'
    },
    snf2: {
      name: 'Stannous Fluoride (SnF2 0.4%)',
      fluorideYield: '1000 ppm F',
      chemistry: 'Provides both stannous (tin) cations and fluoride anions; strong antibacterial action against plaque.',
      abrasiveCompatibility: 'Moderate; requires specialized stabilization.',
      extrinsicStaining: 'MAJOR DISADVANTAGE: Precipitates brown/black tin sulfide/oxide stains around restoration margins!',
      clinicalStatus: 'Potent against gingivitis and hypersensitivity, but patients dislike cosmetic staining.'
    }
  };

  const currentForm = formulations[selectedFormulation];

  return (
    <div className="space-y-6">
      {/* 2D Visual 1: Interactive Child Age & Fluoride Dosage Calculator */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EC] gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Droplets className="w-5 h-5 text-[#C9A24B]" />
              Pediatric Fluoride Dosage & Fluorosis Risk Calculator
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Preventing fluorosis while maximizing anti-caries protection in developing dentition
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F3] text-[#1B3A8C] border border-[#C9A24B]/40">
            ADA Clinical Guidelines
          </span>
        </div>

        {/* Age Slider */}
        <div className="my-5 bg-[#FAF8F3] p-4 rounded-xl border border-[#E6E8EC]">
          <div className="flex justify-between items-center text-xs font-bold text-[#0B1F4D] mb-2">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#1B3A8C]" />
              Patient Age: {childAge} Years Old
            </span>
            <span className="text-xs font-mono font-bold text-[#C9A24B] bg-[#0B1F4D] px-2.5 py-0.5 rounded-md">
              {childAge < 3 ? 'Infant / Toddler' : childAge <= 6 ? 'Young Child (< 6 yrs)' : 'School Child / Adolescent'}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={childAge}
            onChange={(e) => setChildAge(parseInt(e.target.value))}
            className="w-full h-2 bg-[#E6E8EC] rounded-lg appearance-none cursor-pointer accent-[#C9A24B]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>1 yr</span>
            <span>3 yrs (Smear vs Pea)</span>
            <span>6 yrs (Mouthrinse Gate)</span>
            <span>12 yrs</span>
          </div>
        </div>

        {/* Pediatric Output Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-[#FAF8F3] p-4 sm:p-5 rounded-xl border border-[#C9A24B]/30">
          {/* Visual Toothbrush applicator */}
          <div className="bg-white p-4 rounded-xl border border-[#E6E8EC] flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-2">Toothbrush Bristle Head (25 mm)</span>
            <div className="w-48 h-8 bg-slate-200 rounded-lg relative overflow-hidden flex items-center px-1 border border-slate-300">
              {/* Toothpaste Blob */}
              <div
                className="h-5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-md shadow-xs transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white px-2"
                style={{ width: pediatricInfo.visualWidth }}
              >
                {childAge < 3 ? '< 2mm' : childAge <= 6 ? '< 5mm' : '15mm'}
              </div>
            </div>
            <span className="text-xs font-bold text-[#0B1F4D] mt-2">{pediatricInfo.doseName}</span>
          </div>

          {/* Clinical Directives */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0B1F4D]">Swallowing Hazard:</span>
              <span className={`font-semibold ${childAge <= 6 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {pediatricInfo.swallowRisk}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0B1F4D]">Fluoride Concentration:</span>
              <span className="font-mono text-[#1B3A8C] font-semibold">{pediatricInfo.ppmRecommended}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0B1F4D]">Supervision Protocol:</span>
              <span className="text-slate-700">{pediatricInfo.supervision}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0B1F4D]">Fluoride Mouthrinse:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                pediatricInfo.mouthrinseAllowed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {pediatricInfo.mouthrinseAllowed ? 'Permitted (Spit Out)' : 'CONTRAINDICATED'}
              </span>
            </div>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{pediatricInfo.warning}</span>
        </div>
      </div>

      {/* 2D Visual 2: Formulations Showdown (NaF vs MFP vs SnF2) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E8EC]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A24B]" />
              Toothpaste Active Ingredients: NaF vs MFP vs Stannous Fluoride
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Chemical behavior, abrasive compatibility, and cosmetic discoloration comparison
            </p>
          </div>
        </div>

        {/* Formulation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-4">
          {(['naf', 'mfp', 'snf2'] as const).map(key => {
            const item = formulations[key];
            const isSelected = selectedFormulation === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedFormulation(key)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                    : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
                }`}
              >
                <span className="font-extrabold text-xs block">{item.name}</span>
                <span className="text-[10px] block opacity-80 mt-0.5 font-mono">{item.fluorideYield}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Formulation Details */}
        <div className="bg-[#FAF8F3] p-4 sm:p-5 rounded-xl border border-[#C9A24B]/30 space-y-3">
          <h4 className="font-bold text-sm sm:text-base text-[#0B1F4D]">{currentForm.name}</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
              <strong className="text-[#0B1F4D] block mb-1">Mechanism & Solution Chemistry:</strong>
              {currentForm.chemistry}
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
              <strong className="text-[#0B1F4D] block mb-1">Abrasive System Compatibility:</strong>
              {currentForm.abrasiveCompatibility}
            </div>
          </div>

          <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
            selectedFormulation === 'snf2'
              ? 'bg-amber-50 text-amber-950 border-amber-300'
              : 'bg-emerald-50 text-emerald-950 border-emerald-300'
          }`}>
            <strong className="block mb-0.5">Esthetics & Staining Verdict:</strong>
            {currentForm.extrinsicStaining}
          </div>
        </div>
      </div>
    </div>
  );
};
