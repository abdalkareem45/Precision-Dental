import React, { useState } from 'react';
import { MultiToothSandbox, BoneDefectType } from './MultiToothSandbox';
import { ThreeMobilitySimulator } from './ThreeMobilitySimulator';
import { Boxes, Layers, Eye, Sliders, ShieldCheck } from 'lucide-react';

interface ThreePeriodontalSandboxProps {
  onProbingUpdate?: (pd: number, cal: number) => void;
  initialDefect?: BoneDefectType;
}

export const ThreePeriodontalSandbox: React.FC<ThreePeriodontalSandboxProps> = ({
  onProbingUpdate,
  initialDefect
}) => {
  const [sandboxMode, setSandboxMode] = useState<'multi_tooth' | 'single_tooth'>('multi_tooth');
  const [activeDefect, setActiveDefect] = useState<BoneDefectType>(initialDefect || 'moderate_horizontal');

  const handleMultiProbeChange = (tooth: string, site: string, pd: number, cal: number) => {
    if (onProbingUpdate) {
      onProbingUpdate(pd, cal);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* View Mode Toggle Header */}
      <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSandboxMode('multi_tooth')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              sandboxMode === 'multi_tooth'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Boxes className="w-4 h-4 text-cyan-300" />
            <span>Multi-Tooth Arch Segment (#15, #16, #17)</span>
          </button>

          <button
            onClick={() => setSandboxMode('single_tooth')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              sandboxMode === 'single_tooth'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4 text-blue-300" />
            <span>Single Tooth Mechanical Focus</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>UNC-15 Calibrated Periodontal Simulator</span>
        </div>
      </div>

      {/* Render Multi-Tooth Arch Sandbox or Single Tooth Mechanical Focus */}
      {sandboxMode === 'multi_tooth' ? (
        <MultiToothSandbox
          externalDefect={activeDefect}
          onProbeChange={handleMultiProbeChange}
        />
      ) : (
        <ThreeMobilitySimulator />
      )}
    </div>
  );
};
