import React from 'react';
import { AnatomicalLayer, VisualTheme, ViewMode } from '../types/endodontics';
import {
  Layers,
  Sliders,
  Scissors,
  Eye,
  EyeOff,
  Maximize,
  Sparkles,
  Radio,
  FileText,
  Activity,
  Zap,
} from 'lucide-react';

interface LayerControlsProps {
  layers: AnatomicalLayer[];
  onToggleLayer: (id: string) => void;
  onChangeOpacity: (id: string, opacity: number) => void;
  onSetPreset: (preset: 'all' | 'pulp_nerves' | 'bones_pdl' | 'caries_fracture') => void;
  visualTheme: VisualTheme;
  onChangeVisualTheme: (theme: VisualTheme) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  clipOffset: number;
  onChangeClipOffset: (offset: number) => void;
  clipAxis: 'x' | 'y' | 'z';
  onChangeClipAxis: (axis: 'x' | 'y' | 'z') => void;
  explodedFactor: number;
  onChangeExplodedFactor: (factor: number) => void;
  selectedHotspot: string | null;
  onSelectHotspot: (id: string) => void;
}

export const LayerControls: React.FC<LayerControlsProps> = ({
  layers,
  onToggleLayer,
  onChangeOpacity,
  onSetPreset,
  visualTheme,
  onChangeVisualTheme,
  viewMode,
  onChangeViewMode,
  clipOffset,
  onChangeClipOffset,
  clipAxis,
  onChangeClipAxis,
  explodedFactor,
  onChangeExplodedFactor,
  selectedHotspot,
  onSelectHotspot,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#0B1F4D] border-r border-[#E6E8EC]/20 text-[#FAF8F3] overflow-y-auto w-full shadow-2xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#E6E8EC]/15 sticky top-0 bg-[#0B1F4D]/95 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#1B3A8C] border border-[#C9A24B]/40 text-[#C9A24B]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-headings">
                Anatomical Layers
              </h2>
              <p className="text-[10px] text-[#E6E8EC]/75 font-medium">3D Internal Anatomy &amp; CAD Slices</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/30 font-bold">
            {layers.filter((l) => l.visible).length}/{layers.length} ON
          </span>
        </div>

        {/* View Mode Tabs */}
        <div className="grid grid-cols-4 gap-1 mt-3 bg-[#06112C] p-1 rounded-xl border border-[#E6E8EC]/15 text-xs">
          <button
            onClick={() => onChangeViewMode('orbit')}
            className={`py-1.5 rounded-lg font-headings text-[11px] font-semibold transition-all text-center ${
              viewMode === 'orbit'
                ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                : 'text-[#E6E8EC]/70 hover:text-white'
            }`}
          >
            Orbit
          </button>
          <button
            onClick={() => onChangeViewMode('cross-section')}
            className={`py-1.5 rounded-lg font-headings text-[11px] font-semibold transition-all text-center ${
              viewMode === 'cross-section'
                ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                : 'text-[#E6E8EC]/70 hover:text-white'
            }`}
          >
            Section
          </button>
          <button
            onClick={() => onChangeViewMode('exploded')}
            className={`py-1.5 rounded-lg font-headings text-[11px] font-semibold transition-all text-center ${
              viewMode === 'exploded'
                ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                : 'text-[#E6E8EC]/70 hover:text-white'
            }`}
          >
            Explode
          </button>
          <button
            onClick={() => onChangeViewMode('walkthrough')}
            className={`py-1.5 rounded-lg font-headings text-[11px] font-semibold transition-all text-center ${
              viewMode === 'walkthrough'
                ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                : 'text-[#E6E8EC]/70 hover:text-white'
            }`}
          >
            Walk
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Render Shading Theme */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 block font-semibold">
            Visual Shader Rendering
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onChangeVisualTheme('blueprint')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                visualTheme === 'blueprint'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-semibold shadow-sm'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Blueprint CAD
            </button>
            <button
              onClick={() => onChangeVisualTheme('anatomical')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                visualTheme === 'anatomical'
                  ? 'bg-rose-950/80 border-rose-400 text-rose-300 font-semibold shadow-sm'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              Photoreal
            </button>
            <button
              onClick={() => onChangeVisualTheme('radiograph')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                visualTheme === 'radiograph'
                  ? 'bg-slate-800 border-slate-200 text-slate-100 font-semibold shadow-sm'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              X-Ray Film
            </button>
            <button
              onClick={() => onChangeVisualTheme('hologram')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                visualTheme === 'hologram'
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-semibold shadow-sm'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Hologram
            </button>
          </div>
        </div>

        {/* View Mode Specific Controls */}
        {viewMode === 'cross-section' && (
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
              <span className="flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5" /> Sagittal / Coronal Slicing
              </span>
              <span className="font-mono">{clipOffset.toFixed(1)} mm</span>
            </div>

            {/* Axis toggles */}
            <div className="flex gap-2">
              {(['x', 'y', 'z'] as const).map((axis) => (
                <button
                  key={axis}
                  onClick={() => onChangeClipAxis(axis)}
                  className={`flex-1 py-1 rounded text-xs font-mono uppercase font-semibold ${
                    clipAxis === axis
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {axis === 'x' ? 'Sagittal (X)' : axis === 'y' ? 'Axial (Y)' : 'Coronal (Z)'}
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min="-2.5"
              max="2.5"
              step="0.05"
              value={clipOffset}
              onChange={(e) => onChangeClipOffset(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <p className="text-[10px] text-slate-400 leading-tight">
              Drag to view internal pulp horns, dentinal tubule walls, and apical foramen lumen.
            </p>
          </div>
        )}

        {viewMode === 'exploded' && (
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
              <span className="flex items-center gap-1.5">
                <Maximize className="w-3.5 h-3.5" /> Architectural Disassembly
              </span>
              <span className="font-mono">{Math.round(explodedFactor * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={explodedFactor}
              onChange={(e) => onChangeExplodedFactor(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <p className="text-[10px] text-slate-400 leading-tight">
              Lifts the enamel cap and separates the dentin shell from the core pulp nerve bundle.
            </p>
          </div>
        )}

        {/* Quick Layer Presets */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 block font-semibold">
            Lecture Focus Presets
          </label>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => onSetPreset('all')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Full Tooth
            </button>
            <button
              onClick={() => onSetPreset('pulp_nerves')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 transition-colors"
            >
              Pulp & Nerves (Aδ/C)
            </button>
            <button
              onClick={() => onSetPreset('bones_pdl')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 transition-colors"
            >
              PDL & Bone Socket
            </button>
            <button
              onClick={() => onSetPreset('caries_fracture')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
            >
              Sinus & Crack
            </button>
          </div>
        </div>

        {/* Individual Layer Sliders & Toggles */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Structural Elements
          </label>

          {layers.map((layer) => {
            const isSelected = selectedHotspot === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => onSelectHotspot(layer.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400/60 shadow-md'
                    : 'bg-slate-950/40 border-slate-800/70 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-xs font-medium text-slate-200">{layer.name}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLayer(layer.id);
                    }}
                    className={`p-1 rounded-md transition-colors ${
                      layer.visible
                        ? 'text-cyan-400 hover:bg-cyan-950'
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {layer.visible && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono w-10">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={layer.opacity}
                      onChange={(e) => {
                        e.stopPropagation();
                        onChangeOpacity(layer.id, parseFloat(e.target.value));
                      }}
                      className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                )}

                {isSelected && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-snug">
                    <p className="text-slate-300 font-medium">{layer.description}</p>
                    <p className="mt-1 text-cyan-400 font-mono text-[10px]">{layer.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
