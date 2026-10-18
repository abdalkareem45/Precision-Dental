/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BsiIncisorClass } from '../../types/ortho';
import { Layers, CheckCircle2, ChevronRight, HelpCircle, ArrowLeftRight, ArrowUpDown } from 'lucide-react';

export const BsiIncisorSimulator: React.FC = () => {
  const [bsiClass, setBsiClass] = useState<BsiIncisorClass>('class_i');
  // Lower incisor position offsets relative to upper cingulum plateau
  const [lowerIncisorX, setLowerIncisorX] = useState<number>(0); // mm shift (+ = anterior, - = posterior)
  const [upperInclination, setUpperInclination] = useState<'proclined' | 'normal' | 'retroclined'>('normal');
  const [lowerIncisorY, setLowerIncisorY] = useState<number>(0); // vertical overlap mm

  // Preset selector
  const handleSelectPreset = (cls: BsiIncisorClass) => {
    setBsiClass(cls);
    if (cls === 'class_i') {
      setLowerIncisorX(0);
      setUpperInclination('normal');
      setLowerIncisorY(0);
    } else if (cls === 'class_ii_div1') {
      setLowerIncisorX(-5.5); // Posterior to cingulum
      setUpperInclination('proclined');
      setLowerIncisorY(-1.5);
    } else if (cls === 'class_ii_div2') {
      setLowerIncisorX(-3.0); // Posterior to cingulum
      setUpperInclination('retroclined');
      setLowerIncisorY(3.5); // Deep bite
    } else if (cls === 'class_iii') {
      setLowerIncisorX(4.5); // Anterior to cingulum
      setUpperInclination('proclined');
      setLowerIncisorY(-0.5);
    }
  };

  // Live overjet (mm) calculated
  const liveOverjet = Math.max(-4, Math.min(12, 3.0 - lowerIncisorX));
  // Live overbite (% lower crown coverage)
  const liveOverbitePercent = Math.max(0, Math.min(100, Math.round(33 + lowerIncisorY * 12)));

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C9A24B]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#DFC17B] uppercase tracking-wider">
            <Layers className="w-4 h-4 text-[#C9A24B]" />
            <span>2D Clinical Biomechanics</span>
            <span>·</span>
            <span>Lecture 3 (Fig. 3)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            BSI Incisor Classification Cross-Section Simulator
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            British Standards Institute (BSI) incisor classification is defined by the position of the mandibular incisor tip relative to the <strong>cingulum plateau</strong> of the maxillary central incisor.
          </p>
        </div>

        {/* BSI Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#071330]/80 p-1.5 rounded-xl border border-[#C9A24B]/30">
          {[
            { id: 'class_i', label: 'Class I' },
            { id: 'class_ii_div1', label: 'Class II Div 1' },
            { id: 'class_ii_div2', label: 'Class II Div 2' },
            { id: 'class_iii', label: 'Class III' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id as BsiIncisorClass)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                bsiClass === preset.id
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left 2 Cols: High-Fidelity SVG Sagittal Cross Section */}
        <div className="lg:col-span-2 relative bg-[#071330] rounded-2xl border border-[#C9A24B]/30 p-6 flex flex-col items-center justify-center min-h-[380px] shadow-2xl">
          {/* Diagnostic Metric HUD */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="glass-panel-subtle px-3 py-1.5 rounded-lg border border-[#C9A24B]/30">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Overjet (A-P)</span>
              <span className="text-base font-black font-mono text-[#DFC17B]">{liveOverjet.toFixed(1)} mm</span>
            </div>
            <div className="glass-panel-subtle px-3 py-1.5 rounded-lg border border-[#C9A24B]/30">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Overbite (Vertical)</span>
              <span className="text-base font-black font-mono text-cyan-400">{liveOverbitePercent}%</span>
            </div>
          </div>

          {/* Incisor Cross-Section SVG Canvas */}
          <svg viewBox="0 0 450 360" className="w-full max-w-md h-[320px] select-none">
            <defs>
              <linearGradient id="enamelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#FAF8F3" />
                <stop offset="100%" stopColor="#DFC17B" />
              </linearGradient>
              <linearGradient id="dentinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Upper Incisor Root & Alveolar Bone hint */}
            <path
              d="M 190 20 L 220 20 L 225 110 L 185 110 Z"
              fill="#E5E7EB"
              opacity="0.3"
            />

            {/* Upper Central Incisor Crown (Sagittal Cross Section) */}
            {/* Crown rotates depending on upperInclination (proclined vs retroclined) */}
            <g
              transform={`
                rotate(${upperInclination === 'proclined' ? 14 : upperInclination === 'retroclined' ? -12 : 0}, 205, 110)
              `}
              className="transition-transform duration-500 ease-out"
            >
              {/* Enamel Shell */}
              <path
                d="
                  M 185 110 
                  C 170 140, 160 170, 175 210 
                  L 185 210 
                  C 192 190, 202 180, 215 175 
                  C 225 170, 230 150, 225 110 Z
                "
                fill="url(#enamelGrad)"
                stroke="#C9A24B"
                strokeWidth="2.5"
              />

              {/* Inner Dentin Core */}
              <path
                d="
                  M 188 120 
                  C 178 145, 172 165, 180 195 
                  L 186 195 
                  C 193 180, 200 172, 210 168 
                  C 216 162, 220 148, 218 120 Z
                "
                fill="url(#dentinGrad)"
                opacity="0.85"
              />

              {/* Labeled Cingulum Plateau Horizon Line */}
              <line
                x1="140"
                y1="175"
                x2="280"
                y2="175"
                stroke="#C9A24B"
                strokeWidth="1.5"
                strokeDasharray="4,3"
              />
              <text
                x="285"
                y="178"
                fill="#DFC17B"
                fontSize="11"
                fontWeight="bold"
                fontFamily="Montserrat"
              >
                Cingulum Plateau
              </text>

              {/* Upper Incisal Edge label */}
              <circle cx="180" cy="210" r="3.5" fill="#EF4444" />
              <text
                x="100"
                y="215"
                fill="#F87171"
                fontSize="10"
                fontWeight="bold"
                fontFamily="Montserrat"
              >
                Incisal Edge
              </text>
            </g>

            {/* Lower Incisor Crown (Moving Sagittally & Vertically) */}
            <g
              transform={`translate(${lowerIncisorX * 8}, ${lowerIncisorY * 8})`}
              className="transition-transform duration-500 ease-out"
            >
              {/* Lower Incisor Crown Enamel */}
              <path
                d="
                  M 195 340 
                  L 215 340 
                  C 220 280, 210 230, 195 180 
                  L 185 180 
                  C 180 230, 185 290, 195 340 Z
                "
                fill="url(#enamelGrad)"
                stroke="#2563EB"
                strokeWidth="2.5"
              />

              {/* Lower Incisal Edge Tip marker */}
              <circle cx="190" cy="180" r="4" fill="#3B82F6" />
              <text
                x="198"
                y="185"
                fill="#60A5FA"
                fontSize="10"
                fontWeight="bold"
                fontFamily="Montserrat"
              >
                Lower Incisor Tip
              </text>

              {/* Vertical Overlap Indicator */}
              <line
                x1="190"
                y1="180"
                x2="190"
                y2="210"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="2,2"
              />
            </g>
          </svg>

          {/* Interactive Manual Adjustment Controls */}
          <div className="w-full grid grid-cols-2 gap-4 mt-2 pt-3 border-t border-white/10">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1 font-bold">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#DFC17B]" />
                  <span>Lower Tip A-P Shift</span>
                </span>
                <span className="font-mono text-[#DFC17B]">{lowerIncisorX > 0 ? `+${lowerIncisorX}mm` : `${lowerIncisorX}mm`}</span>
              </div>
              <input
                type="range"
                min="-8"
                max="6"
                step="0.5"
                value={lowerIncisorX}
                onChange={(e) => setLowerIncisorX(parseFloat(e.target.value))}
                className="w-full accent-[#C9A24B] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1 font-bold">
                  <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Vertical Overlap Shift</span>
                </span>
                <span className="font-mono text-cyan-400">{lowerIncisorY > 0 ? `+${lowerIncisorY}mm` : `${lowerIncisorY}mm`}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="5"
                step="0.5"
                value={lowerIncisorY}
                onChange={(e) => setLowerIncisorY(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: BSI Criteria Breakdown */}
        <div className="glass-panel-subtle rounded-2xl p-5 border border-[#C9A24B]/30 space-y-4">
          <div className="border-b border-[#C9A24B]/20 pb-3">
            <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider block">
              Clinical Classification
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              {bsiClass === 'class_i' && 'Class I Incisors'}
              {bsiClass === 'class_ii_div1' && 'Class II Division 1'}
              {bsiClass === 'class_ii_div2' && 'Class II Division 2'}
              {bsiClass === 'class_iii' && 'Class III Incisors'}
            </h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            {bsiClass === 'class_i' && (
              <>
                <p>
                  <strong>Definition:</strong> Lower incisor tips occlude on or lie directly below the cingulum plateau of the maxillary central incisors.
                </p>
                <div className="p-3 bg-emerald-900/30 rounded-xl border border-emerald-500/40 text-emerald-200">
                  ● Normal Overjet: 2 to 4 mm<br />
                  ● Normal Overbite: One-third vertical overlap
                </div>
              </>
            )}

            {bsiClass === 'class_ii_div1' && (
              <>
                <p>
                  <strong>Definition:</strong> Lower incisor tips occlude or lie posterior to the cingulum plateau of upper incisors.
                </p>
                <div className="p-3 bg-amber-900/30 rounded-xl border border-amber-500/40 text-amber-200">
                  ● Overjet: Significantly increased (&gt;4 mm)<br />
                  ● Upper Incisors: Upright or proclined<br />
                  ● Common Risk: Traumatic dental injury, lip incompetence
                </div>
              </>
            )}

            {bsiClass === 'class_ii_div2' && (
              <>
                <p>
                  <strong>Definition:</strong> Lower incisor tips lie posterior to cingulum plateau, but the upper central incisors are retroclined.
                </p>
                <div className="p-3 bg-blue-900/30 rounded-xl border border-blue-500/40 text-blue-200">
                  ● Overjet: Normal or slightly increased<br />
                  ● Upper Incisors: Retroclined crowns<br />
                  ● Overbite: Deep, often traumatic to palatal/labial tissues
                </div>
              </>
            )}

            {bsiClass === 'class_iii' && (
              <>
                <p>
                  <strong>Definition:</strong> Lower incisor tips occlude or lie anterior to the cingulum plateau of upper incisors.
                </p>
                <div className="p-3 bg-rose-900/30 rounded-xl border border-rose-500/40 text-rose-200">
                  ● Overjet: Edge-to-edge (0mm) or negative (&lt;0mm anterior crossbite)<br />
                  ● Mandibular incisors bite ahead of maxillary incisors
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
