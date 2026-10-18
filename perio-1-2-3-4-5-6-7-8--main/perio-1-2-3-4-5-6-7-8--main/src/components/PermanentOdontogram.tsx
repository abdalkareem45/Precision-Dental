import React, { useState } from 'react';
import { PermanentToothData, getAllPermanentTeeth } from '../data/permanentTeethData';
import { Search, Shuffle, Filter, CheckCircle2, ChevronRight } from 'lucide-react';

interface PermanentOdontogramProps {
  selectedFdi: number;
  onSelectTooth: (tooth: PermanentToothData) => void;
  studiedFdis: Set<number>;
  quizScores: Record<number, number>;
}

export const PermanentOdontogram: React.FC<PermanentOdontogramProps> = ({
  selectedFdi,
  onSelectTooth,
  studiedFdis,
  quizScores
}) => {
  const allTeeth = getAllPermanentTeeth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Incisor' | 'Canine' | 'Premolar' | 'Molar'>('All');
  const [archFilter, setArchFilter] = useState<'All' | 'Maxillary' | 'Mandibular'>('All');
  const [numberingSystem, setNumberingSystem] = useState<'both' | 'fdi' | 'universal'>('both');

  // Filter teeth based on query & filters
  const filteredTeeth = allTeeth.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.fdi.toString().includes(searchQuery) ||
      t.universal.toString().includes(searchQuery);

    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesArch = archFilter === 'All' || t.arch === archFilter;

    return matchesSearch && matchesCategory && matchesArch;
  });

  // Handle random tooth selection
  const handleRandomTooth = () => {
    const randomIndex = Math.floor(Math.random() * allTeeth.length);
    onSelectTooth(allTeeth[randomIndex]);
  };

  // Quadrant groupings
  const q1Teeth = allTeeth.filter((t) => t.quadrant === 1); // 18 -> 11
  const q2Teeth = allTeeth.filter((t) => t.quadrant === 2); // 21 -> 28
  const q4Teeth = allTeeth.filter((t) => t.quadrant === 4); // 48 -> 41
  const q3Teeth = allTeeth.filter((t) => t.quadrant === 3); // 31 -> 38

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Incisor':
        return 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300';
      case 'Canine':
        return 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-300';
      case 'Premolar':
        return 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-300';
      case 'Molar':
        return 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300';
      default:
        return 'from-slate-700/20 to-slate-800/10 border-slate-700/30 text-slate-300';
    }
  };

  const renderToothButton = (tooth: PermanentToothData) => {
    const isSelected = tooth.fdi === selectedFdi;
    const isStudied = studiedFdis.has(tooth.fdi);
    const score = quizScores[tooth.fdi];
    const catColor = getCategoryColor(tooth.category);

    return (
      <button
        key={tooth.fdi}
        onClick={() => onSelectTooth(tooth)}
        title={`${tooth.name} (FDI: #${tooth.fdi} • Universal: #${tooth.universal})`}
        className={`relative flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all duration-150 text-center select-none ${
          isSelected
            ? 'bg-blue-600/30 border-blue-400 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
            : `bg-gradient-to-b ${catColor} hover:border-slate-500 hover:brightness-110`
        }`}
      >
        {/* FDI & Universal Badges */}
        <span className="font-mono text-xs font-bold leading-tight">
          {tooth.fdi}
        </span>
        <span className="font-mono text-[9px] text-slate-400 leading-tight">
          #{tooth.universal}
        </span>

        {/* Small Studied / Score Indicator */}
        {isStudied && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900 shadow-sm" />
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 text-slate-200 shadow-xl overflow-hidden">
      {/* Header & Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <span className="text-cyan-400">🦷</span> Permanent Odontogram
          </h2>
          <p className="text-[11px] text-slate-400">
            FDI World (11–48) &amp; Universal (1–32)
          </p>
        </div>

        <button
          onClick={handleRandomTooth}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 flex items-center gap-1 transition shadow-sm"
          title="Pick a random permanent tooth to study"
        >
          <Shuffle className="w-3 h-3 text-cyan-400" />
          <span className="hidden sm:inline">Random</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mt-3">
        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by FDI, Universal #, or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 mt-2.5">
        {(['All', 'Incisor', 'Canine', 'Premolar', 'Molar'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition ${
              categoryFilter === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-slate-300 border border-slate-800/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Arch Selector Pill */}
      <div className="flex items-center gap-1 mt-2 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
        {(['All', 'Maxillary', 'Mandibular'] as const).map((arch) => (
          <button
            key={arch}
            onClick={() => setArchFilter(arch)}
            className={`flex-1 py-1 rounded-md text-[10px] font-semibold transition ${
              archFilter === arch
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {arch === 'All' ? 'Both Arches' : arch}
          </button>
        ))}
      </div>

      {/* Clinical Anatomical Chart (Palmer / FDI Quadrant Cross) */}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-3 custom-scrollbar">
        {/* Quadrant Legend & Orientation */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 border-b border-slate-800/50 pb-1">
          <span className="text-cyan-400 font-bold">PATIENT RIGHT (Q1 &bull; Q4)</span>
          <span className="text-indigo-400 font-bold">PATIENT LEFT (Q2 &bull; Q3)</span>
        </div>

        {/* Maxillary Arch (Upper) */}
        {(archFilter === 'All' || archFilter === 'Maxillary') && (
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                <span>Maxillary Arch</span>
                <span className="text-[9px] font-mono font-normal text-slate-500">(Superior)</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400">Midline &darr;</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Q1: Maxillary Right (18 -> 11) */}
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-medium block text-right pr-1">Q1 (Right)</span>
                <div className="grid grid-cols-4 gap-1">
                  {q1Teeth.map(renderToothButton)}
                </div>
              </div>

              {/* Q2: Maxillary Left (21 -> 28) */}
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-medium block pl-1">Q2 (Left)</span>
                <div className="grid grid-cols-4 gap-1">
                  {q2Teeth.map(renderToothButton)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mandibular Arch (Lower) */}
        {(archFilter === 'All' || archFilter === 'Mandibular') && (
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <span>Mandibular Arch</span>
                <span className="text-[9px] font-mono font-normal text-slate-500">(Inferior)</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400">Midline &uarr;</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Q4: Mandibular Right (48 -> 41) */}
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-medium block text-right pr-1">Q4 (Right)</span>
                <div className="grid grid-cols-4 gap-1">
                  {q4Teeth.map(renderToothButton)}
                </div>
              </div>

              {/* Q3: Mandibular Left (31 -> 38) */}
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-medium block pl-1">Q3 (Left)</span>
                <div className="grid grid-cols-4 gap-1">
                  {q3Teeth.map(renderToothButton)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtered Search Results List if user is searching */}
        {searchQuery && (
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">
              Search Results ({filteredTeeth.length}):
            </span>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {filteredTeeth.map((tooth) => (
                <button
                  key={tooth.fdi}
                  onClick={() => onSelectTooth(tooth)}
                  className={`w-full text-left p-1.5 rounded-lg flex items-center justify-between text-xs transition ${
                    tooth.fdi === selectedFdi
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-300 text-[11px]">#{tooth.fdi}</span>
                    <span className="truncate">{tooth.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">Univ #{tooth.universal}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Legend */}
        <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[10px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300 mb-1">Tooth Classification Legend</div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/30 border border-cyan-400" />
              <span>Incisors (11, 12...)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500/30 border border-indigo-400" />
              <span>Canines (13, 23...)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/30 border border-amber-400" />
              <span>Premolars (14, 15...)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-400" />
              <span>Molars (16, 17...)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
