/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smile, Sliders, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const SmileAestheticAnalyzer: React.FC = () => {
  const [smileArc, setSmileArc] = useState<number>(6); // 0 (flat) to 10 (consonant)
  const [buccalCorridors, setBuccalCorridors] = useState<number>(3); // 1 (wide/black spaces) to 5 (minimal/full)
  const [gingivalDisplay, setGingivalDisplay] = useState<number>(1.5); // mm show
  const [midlineShift, setMidlineShift] = useState<number>(0); // mm shift

  const isConsonant = smileArc >= 5;
  const isGingivalNormal = gingivalDisplay >= 0 && gingivalDisplay <= 2.5;
  const isBuccalNormal = buccalCorridors >= 2.5 && buccalCorridors <= 4.0;
  const isMidlineCoincident = Math.abs(midlineShift) < 1.0;

  // Calculate aesthetic harmony score (out of 100)
  const score = Math.round(
    (isConsonant ? 30 : 10) +
    (isGingivalNormal ? 25 : 10) +
    (isBuccalNormal ? 25 : 10) +
    (isMidlineCoincident ? 20 : 5)
  );

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C9A24B]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#DFC17B] uppercase tracking-wider">
            <Smile className="w-4 h-4 text-[#C9A24B]" />
            <span>2D Aesthetic Laboratory</span>
            <span>·</span>
            <span>Lecture 1 & 2 (Page 10)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Interactive Smile Aesthetics & Arc Ratio Analyzer
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Analyze the 6 essential components of an aesthetic smile: consonant smile arc, buccal corridor ratio, 1–2mm gingival display, and facial midline coincidence.
          </p>
        </div>

        {/* Live Harmony Score Badge */}
        <div className="glass-panel-subtle px-4 py-2 rounded-xl border border-[#C9A24B]/30 flex items-center gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Aesthetic Score</span>
            <span className="text-xl font-black font-mono text-[#DFC17B]">{score} / 100</span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            score >= 80 ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' : 'bg-amber-900/60 text-amber-300 border border-amber-500/40'
          }`}>
            {score >= 80 ? 'Harmonious Smile' : 'Aesthetic Disharmony'}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left 2 Cols: Interactive Smile SVG Stage */}
        <div className="lg:col-span-2 relative bg-[#071330] rounded-2xl border border-[#C9A24B]/30 p-6 flex flex-col items-center justify-center min-h-[360px] shadow-2xl overflow-hidden">
          {/* Facial Midline Guide (Dashed Gold Line) */}
          <div className="absolute inset-y-0 left-1/2 w-0.5 border-l border-dashed border-[#C9A24B]/40 pointer-events-none" />

          {/* SVG Smile Anatomy */}
          <svg viewBox="0 0 500 280" className="w-full max-w-lg h-[260px] select-none">
            <defs>
              <linearGradient id="lipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="60%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#BE123C" />
              </linearGradient>
              <linearGradient id="gingivaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDA4AF" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
            </defs>

            {/* Dark Oral Cavity & Buccal Corridors */}
            {/* The buccal corridor width alters the black space on left & right */}
            <path
              d="M 80 130 C 120 70, 380 70, 420 130 C 380 200, 120 200, 80 130 Z"
              fill="#050B1A"
            />

            {/* Gingiva Tissue Layer (Adjustable height based on gingivalDisplay) */}
            <path
              d={`
                M 120 130 
                C 150 ${85 - gingivalDisplay * 6}, 350 ${85 - gingivalDisplay * 6}, 380 130 
                C 340 105, 160 105, 120 130 Z
              `}
              fill="url(#gingivaGradient)"
            />

            {/* Upper Teeth Row (Adjustable Midline Shift & Smile Arc) */}
            <g transform={`translate(${midlineShift * 8}, 0)`}>
              {/* Central Incisors (Right & Left) */}
              <rect x="226" y="105" width="22" height="42" rx="3" fill="#FAF8F3" stroke="#C9A24B" strokeWidth="1.5" />
              <rect x="252" y="105" width="22" height="42" rx="3" fill="#FAF8F3" stroke="#C9A24B" strokeWidth="1.5" />

              {/* Lateral Incisors (1mm shorter/more incisal) */}
              <rect x="202" y="108" width="19" height="38" rx="3" fill="#FAF8F3" stroke="#C9A24B" strokeWidth="1.5" />
              <rect x="279" y="108" width="19" height="38" rx="3" fill="#FAF8F3" stroke="#C9A24B" strokeWidth="1.5" />

              {/* Canines */}
              <path d="M 178 106 L 197 106 L 194 148 L 187 151 L 180 148 Z" fill="#FAF8F3" stroke="#C9A24B" strokeWidth="1.5" />
              <path d="M 303 106 L 322 106 L 319 148 L 312 151 L 305 148 Z" fill="#FAF8F3" stroke="#C9A24B" strokeWidth="1.5" />

              {/* Premolars & Molars filling buccal corridor */}
              <rect x="156" y="112" width="18" height="32" rx="2" fill="#E5E7EB" stroke="#C9A24B" strokeWidth="1" />
              <rect x="326" y="112" width="18" height="32" rx="2" fill="#E5E7EB" stroke="#C9A24B" strokeWidth="1" />
              <rect x="136" y="116" width="16" height="26" rx="2" fill="#D1D5DB" stroke="#C9A24B" strokeWidth="1" />
              <rect x="348" y="116" width="16" height="26" rx="2" fill="#D1D5DB" stroke="#C9A24B" strokeWidth="1" />
            </g>

            {/* Upper Lip Contour */}
            <path
              d="M 60 130 C 140 100, 210 90, 250 102 C 290 90, 360 100, 440 130 C 370 120, 290 110, 250 115 C 210 110, 130 120, 60 130 Z"
              fill="url(#lipGradient)"
              stroke="#9F1239"
              strokeWidth="2"
            />

            {/* Lower Lip Contour (Governing Smile Arc Curve) */}
            {/* y offset determined by smileArc slider */}
            <path
              d={`
                M 60 130 
                C 140 135, 190 ${165 + smileArc * 3}, 250 ${168 + smileArc * 3} 
                C 310 ${165 + smileArc * 3}, 360 135, 440 130 
                C 370 195, 310 ${205 + smileArc * 3}, 250 ${208 + smileArc * 3} 
                C 190 ${205 + smileArc * 3}, 130 195, 60 130 Z
              `}
              fill="url(#lipGradient)"
              stroke="#9F1239"
              strokeWidth="2"
            />

            {/* Consonant Smile Arc Guideline curve */}
            <path
              d={`M 140 148 Q 250 ${152 + smileArc * 2.5} 360 148`}
              fill="none"
              stroke="#DFC17B"
              strokeWidth="2"
              strokeDasharray="4,3"
            />
          </svg>
        </div>

        {/* Right 1 Col: Dynamic Sliders & Criteria Review */}
        <div className="glass-panel-subtle rounded-2xl p-5 border border-[#C9A24B]/30 space-y-4">
          <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider block">
            Aesthetic Parameters
          </span>

          {/* Smile Arc Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-bold">Smile Arc Curvature:</span>
              <span className="font-mono text-[#DFC17B]">{isConsonant ? 'Consonant (Parallel)' : 'Flat / Reverse'}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={smileArc}
              onChange={(e) => setSmileArc(parseInt(e.target.value))}
              className="w-full accent-[#C9A24B] cursor-pointer"
            />
          </div>

          {/* Gingival Display */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-bold">Gingival Display:</span>
              <span className="font-mono text-cyan-400">{gingivalDisplay.toFixed(1)} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={gingivalDisplay}
              onChange={(e) => setGingivalDisplay(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">
              Normal: 1–2 mm (higher in females)
            </span>
          </div>

          {/* Midline Shift */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-bold">Midline Deviation:</span>
              <span className="font-mono text-pink-400">{midlineShift > 0 ? `+${midlineShift}mm` : `${midlineShift}mm`}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.5"
              value={midlineShift}
              onChange={(e) => setMidlineShift(parseFloat(e.target.value))}
              className="w-full accent-pink-400 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${isConsonant ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>Incisal edges parallel to lower lip</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${isGingivalNormal ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>Interproximal gingival display ≤ 2mm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${isMidlineCoincident ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>Coincident dental and facial midlines</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
