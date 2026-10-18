import React from 'react';
import { Virion3D } from '../3d/Virion3D';
import {
  VirionSceneProvider,
  useVirionScene,
  VirionComponentId,
  VirionInteractionMode,
  VirusType,
} from '../../context/VirionSceneContext';
import { Layers, Sparkles, ArrowRight, Dna, Shield, Maximize2, CheckCircle2, Zap, Activity } from 'lucide-react';

interface Virion3DModuleExplorerProps {
  virusType: VirusType;
  cmvTropism: 'endothelium' | 'mononuclear' | 'wbc';
  onSetCmvTropism: (t: 'endothelium' | 'mononuclear' | 'wbc') => void;
  onNext: () => void;
}

const VirionExplorerContent: React.FC<{
  cmvTropism: 'endothelium' | 'mononuclear' | 'wbc';
  onSetCmvTropism: (t: 'endothelium' | 'mononuclear' | 'wbc') => void;
  onNext: () => void;
}> = ({ cmvTropism, onSetCmvTropism, onNext }) => {
  const {
    virusType,
    selectedComponent,
    interactionMode,
    selectComponent,
    setInteractionMode,
    activeMetadata,
    particlesEnabled,
    setParticlesEnabled,
    particleSpeed,
    setParticleSpeed,
  } = useVirionScene();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* Left Column: 3D Virion Scene (8 cols) */}
      <div className="lg:col-span-8">
        <Virion3D virusType={virusType} tropismTarget={cmvTropism} />
      </div>

      {/* Right Column: Central State Synchronized Control & Inspector (4 cols) */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg space-y-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Central Mesh State Manager</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synchronize UI controls with specific Three.js scene meshes to isolate, highlight, or expand components.
            </p>
          </div>

          {/* Mesh Component Selection Grid */}
          <div>
            <span className="text-slate-400 font-semibold text-xs block mb-1.5">
              Target Scene Mesh Component:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'all', label: 'Intact Virion' },
                { id: 'genome', label: 'Genome Core' },
                { id: 'capsid', label: 'Capsid Shell' },
                ...(virusType === 'cmv'
                  ? [
                      { id: 'tegument', label: 'Tegument' },
                      { id: 'envelope', label: 'Envelope' },
                    ]
                  : []),
                { id: 'spikes', label: virusType === 'cmv' ? 'Spikes (gB)' : 'Receptors (VP1)' },
                { id: 'tropism', label: 'Cell Tropism' },
              ].map((item) => {
                const isSelected = selectedComponent === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => selectComponent(item.id as VirionComponentId)}
                    className={`px-3 py-2 rounded-lg text-left transition-all font-semibold border flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-900/90 border-teal-500 text-teal-200 shadow ring-1 ring-teal-400'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Mode Switcher (Highlight / Isolate / Expand) */}
          <div>
            <span className="text-slate-400 font-semibold text-xs block mb-1.5">
              Mesh Effect Action Mode:
            </span>
            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {[
                { id: 'highlight', label: '✨ Highlight' },
                { id: 'isolate', label: '🔍 Isolate' },
                { id: 'expand', label: '💥 Expand' },
              ].map((mode) => {
                const isCurrent = interactionMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setInteractionMode(mode.id as VirionInteractionMode)}
                    className={`flex-1 py-1.5 rounded-md font-semibold text-xs transition-all ${
                      isCurrent
                        ? 'bg-teal-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Component Inspector Card */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">{activeMetadata.name}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${activeMetadata.badgeClass}`}>
                {interactionMode.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {activeMetadata.description}
            </p>
            <div className="text-[11px] text-teal-300 font-mono pt-1 border-t border-slate-850">
              {activeMetadata.visualAction}
            </div>
          </div>

          {/* 🌟 Live Particle Activity Radar Card */}
          <div className="p-3 bg-slate-950/90 rounded-xl border border-amber-500/40 space-y-2 text-xs shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Particle Activity Radar</span>
              </div>
              <button
                onClick={() => setParticlesEnabled(!particlesEnabled)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  particlesEnabled
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {particlesEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-200">{activeMetadata.particleTitle}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/50">
                  {particleSpeed.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {activeMetadata.particleDynamics}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-slate-400">Simulation Speed:</span>
              <div className="flex items-center gap-1">
                {(['slow', 'normal', 'fast'] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setParticleSpeed(spd)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-all ${
                      particleSpeed === spd
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {spd === 'slow' ? '0.5x' : spd === 'normal' ? '1x' : '2x'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Host Cell Tropism Selector for CMV */}
          {virusType === 'cmv' && selectedComponent === 'tropism' && (
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-semibold">Select Host Cell Tropism:</span>
              <div className="flex flex-col gap-1.5">
                {(['endothelium', 'mononuclear', 'wbc'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => onSetCmvTropism(t)}
                    className={`px-3 py-2 rounded-lg text-left transition-colors border ${
                      cmvTropism === t
                        ? 'bg-teal-900/60 border-teal-500 text-teal-200 font-semibold'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t === 'endothelium' && 'Endothelial Cells (Vasculopathy & Occlusion)'}
                    {t === 'mononuclear' && 'Mononuclear Leukocytes (Latency Reservoir)'}
                    {t === 'wbc' && 'White Blood Cells (Intimate Contact Transmission)'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onNext}
          className="w-full mt-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          <span>Next: Pathogenesis Simulator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const Virion3DModuleExplorer: React.FC<Virion3DModuleExplorerProps> = ({
  virusType,
  cmvTropism,
  onSetCmvTropism,
  onNext,
}) => {
  return (
    <VirionSceneProvider initialVirus={virusType}>
      <VirionExplorerContent
        cmvTropism={cmvTropism}
        onSetCmvTropism={onSetCmvTropism}
        onNext={onNext}
      />
    </VirionSceneProvider>
  );
};
