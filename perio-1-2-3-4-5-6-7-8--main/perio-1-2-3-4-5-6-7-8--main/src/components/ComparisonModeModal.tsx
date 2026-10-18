import React, { useState } from 'react';
import { PermanentToothData, getAllPermanentTeeth } from '../data/permanentTeethData';
import {
  Split,
  X,
  ArrowRightLeft,
  Check,
  ChevronRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface ComparisonModeModalProps {
  currentTooth: PermanentToothData;
  isOpen: boolean;
  onClose: () => void;
  onSelectToothToCompare: (fdi: number) => void;
}

export const ComparisonModeModal: React.FC<ComparisonModeModalProps> = ({
  currentTooth,
  isOpen,
  onClose,
  onSelectToothToCompare
}) => {
  if (!isOpen) return null;

  const allTeeth = getAllPermanentTeeth();

  // Curated comparison templates
  const presetPairs = [
    { label: 'Maxillary vs Mandibular 1st Molar', toothA: 16, toothB: 46 },
    { label: '1st vs 2nd Maxillary Molar', toothA: 16, toothB: 17 },
    { label: '1st vs 2nd Mandibular Molar', toothA: 46, toothB: 47 },
    { label: 'Maxillary 1st vs 2nd Premolar', toothA: 14, toothB: 15 },
    { label: 'Maxillary Central vs Lateral Incisor', toothA: 11, toothB: 12 },
    { label: 'Maxillary vs Mandibular Central Incisor', toothA: 11, toothB: 41 },
    { label: 'Maxillary Canine vs 1st Premolar', toothA: 13, toothB: 14 },
    { label: 'Contralateral Mirror (#11 vs #21)', toothA: 11, toothB: 21 }
  ];

  // Selected comparison partner
  const defaultPartner =
    currentTooth.comparisons && currentTooth.comparisons[0]
      ? allTeeth.find((t) => t.fdi === currentTooth.comparisons[0].targetFdi) || allTeeth[1]
      : allTeeth.find((t) => t.fdi !== currentTooth.fdi && t.category === currentTooth.category) || allTeeth[1];

  const [compareFdi, setCompareFdi] = useState<number>(defaultPartner.fdi);
  const compareTooth = allTeeth.find((t) => t.fdi === compareFdi) || defaultPartner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <Split className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>Comparative Dental Anatomy Engine</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Board Matrix
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Compare morphology, root architectures, cusps, grooves, and diagnostic criteria
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Comparison Presets Pills */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0 mr-1">
            Quick Pairs:
          </span>
          {presetPairs.map((pair, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectToothToCompare(pair.toothA);
                setCompareFdi(pair.toothB);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-semibold text-slate-300 whitespace-nowrap transition"
            >
              {pair.label}
            </button>
          ))}
        </div>

        {/* Comparative Side-by-Side Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar text-xs">
          {/* Header Matchup Card */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tooth A (Current) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/40 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-cyan-400 font-extrabold text-base">
                    FDI #{currentTooth.fdi}
                  </span>
                  <span className="font-mono text-slate-400 text-xs ml-1.5">
                    (Univ #{currentTooth.universal})
                  </span>
                  <h4 className="font-bold text-white text-sm">{currentTooth.name}</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                  {currentTooth.arch} • {currentTooth.side}
                </span>
              </div>
            </div>

            {/* Tooth B (Comparator) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-indigo-400 font-extrabold text-base">
                    FDI #{compareTooth.fdi}
                  </span>
                  <span className="font-mono text-slate-400 text-xs ml-1.5">
                    (Univ #{compareTooth.universal})
                  </span>
                  <h4 className="font-bold text-white text-sm">{compareTooth.name}</h4>
                </div>
                {/* Switch Tooth B Dropdown */}
                <select
                  value={compareFdi}
                  onChange={(e) => setCompareFdi(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-indigo-400"
                >
                  {allTeeth.map((t) => (
                    <option key={t.fdi} value={t.fdi}>
                      #{t.fdi} - {t.shortName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Differentiating Clinical Features Table */}
          <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-3 bg-slate-900 border-b border-slate-800 font-bold text-cyan-300 text-xs uppercase tracking-wider flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
              Morphological Difference Matrix
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              {/* Category & Arch */}
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="text-slate-400 font-semibold">Classification &amp; Arch</span>
                <span className="text-white font-medium pr-2">
                  {currentTooth.arch} {currentTooth.category} ({currentTooth.subCategory})
                </span>
                <span className="text-slate-300 font-medium pl-2">
                  {compareTooth.arch} {compareTooth.category} ({compareTooth.subCategory})
                </span>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-3 p-3 items-center bg-slate-900/30">
                <span className="text-slate-400 font-semibold">Crown Dimensions</span>
                <div className="text-slate-300 font-mono text-[11px] pr-2">
                  L: {currentTooth.crownDimensions.lengthMm}mm • MD: {currentTooth.crownDimensions.mesiodistalMm}mm • BL: {currentTooth.crownDimensions.buccolingualMm}mm
                </div>
                <div className="text-slate-300 font-mono text-[11px] pl-2">
                  L: {compareTooth.crownDimensions.lengthMm}mm • MD: {compareTooth.crownDimensions.mesiodistalMm}mm • BL: {compareTooth.crownDimensions.buccolingualMm}mm
                </div>
              </div>

              {/* Crown Morphology */}
              <div className="grid grid-cols-3 p-3 items-start">
                <span className="text-slate-400 font-semibold">Crown Morphology</span>
                <p className="text-slate-300 leading-relaxed pr-2 text-[11px]">
                  {currentTooth.crownMorphology}
                </p>
                <p className="text-slate-300 leading-relaxed pl-2 text-[11px]">
                  {compareTooth.crownMorphology}
                </p>
              </div>

              {/* Root Setup & Canals */}
              <div className="grid grid-cols-3 p-3 items-start bg-slate-900/30">
                <span className="text-slate-400 font-semibold">Roots &amp; Canals</span>
                <div className="space-y-1 pr-2">
                  <span className="font-bold text-white block">
                    {currentTooth.expectedRoots} Root(s) • {currentTooth.expectedCanals}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Vertucci: {currentTooth.vertucciClass}
                  </span>
                </div>
                <div className="space-y-1 pl-2">
                  <span className="font-bold text-white block">
                    {compareTooth.expectedRoots} Root(s) • {compareTooth.expectedCanals}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Vertucci: {compareTooth.vertucciClass}
                  </span>
                </div>
              </div>

              {/* Identifying Key Markers */}
              <div className="grid grid-cols-3 p-3 items-start">
                <span className="text-slate-400 font-semibold">Primary Identifying Features</span>
                <ul className="space-y-1 pr-2">
                  {currentTooth.identifyingFeatures.map((f, i) => (
                    <li key={i} className="text-slate-300 text-[11px] flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1 pl-2">
                  {compareTooth.identifyingFeatures.map((f, i) => (
                    <li key={i} className="text-slate-300 text-[11px] flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Endodontic & Surgical Pearl */}
              <div className="grid grid-cols-3 p-3 items-start bg-slate-900/30">
                <span className="text-slate-400 font-semibold">Clinical &amp; Surgical Pearls</span>
                <p className="text-slate-300 text-[11px] leading-relaxed pr-2">
                  {currentTooth.clinicalRelevance.endodontics} {currentTooth.clinicalRelevance.surgery}
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed pl-2">
                  {compareTooth.clinicalRelevance.endodontics} {compareTooth.clinicalRelevance.surgery}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
          <span className="text-xs text-slate-400">
            Comparing <strong className="text-white">#{currentTooth.fdi}</strong> with <strong className="text-white">#{compareTooth.fdi}</strong>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
