import React, { useState } from 'react';
import {
  Split,
  Table,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  Sliders,
  Eye,
  Activity,
  Award,
  Sparkles
} from 'lucide-react';

export const ComparisonMode: React.FC = () => {
  const [viewMode, setViewMode] = useState<'anatomy' | 'xray' | 'probing'>('anatomy');
  const [horizontalLossPct, setHorizontalLossPct] = useState<number>(40); // 10% to 70%
  const [verticalDefectMm, setVerticalDefectMm] = useState<number>(5.5); // 2mm to 8mm

  return (
    <div className="space-y-6 text-[#FAF8F3] font-sans">
      {/* Header with Precision Dental Brand Identity */}
      <div className="bg-[#071433] border border-[#E6E8EC]/20 rounded-3xl p-5 sm:p-7 space-y-2 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold">
              Precision Dental • 2D Architectural Comparison Lab • PDF Pages 10 &amp; 13
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span dir="rtl" className="text-xs font-arabic font-bold text-[#dfbe6e] px-2 py-0.5 rounded bg-[#0B1F4D] border border-[#C9A24B]/30">
              دقّة الأسنان
            </span>
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#0B1F4D] rounded-xl border border-[#E6E8EC]/20 text-xs font-mono">
              {[
                { id: 'anatomy', label: 'Anatomical 2D' },
                { id: 'probing', label: 'Pocket Sounding' },
                { id: 'xray', label: 'X-Ray Radiograph' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as any)}
                  className={`px-3 py-1 rounded-lg transition ${
                    viewMode === tab.id
                      ? 'bg-[#1B3A8C] text-[#FAF8F3] font-bold border border-[#C9A24B]/60 shadow'
                      : 'text-[#E6E8EC]/70 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider">
            "Precision in Every Smile" • Symmetrical Flat Crest vs Angular Trench
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#FAF8F3]">
            Horizontal Bone Loss vs. Vertical / Angular Defects (2D Design)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#E6E8EC]/85 max-w-3xl">
          Side-by-side 2D interactive architectural visualization comparing symmetrical flat crest reduction against oblique cuneiform infrabony trenches.
        </p>
      </div>

      {/* Split-Screen 2D Interactive Diagrams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* =====================================================================
            LEFT 2D DESIGN: HORIZONTAL BONE LOSS
            ===================================================================== */}
        <div className="bg-slate-950 p-5 rounded-3xl border border-blue-900/50 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800">
                Pattern 1: Horizontal Bone Loss
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Most Common (Suprabony)</span>
            </div>
            <h3 className="text-base font-bold text-white">Symmetrical Flat Bone Shelf</h3>
            <p className="text-xs text-slate-300">
              Progression takes place at an even rate, causing symmetrical reduction across adjacent teeth. Parallel to CEJ line.
            </p>
          </div>

          {/* 2D SVG Diagram: Horizontal Bone Loss */}
          <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-3 relative overflow-hidden flex items-center justify-center min-h-[300px]">
            {viewMode === 'xray' ? (
              // Periapical X-Ray Radiograph View
              <svg viewBox="0 0 400 280" className="w-full h-auto max-h-[280px]">
                {/* Dark X-ray background */}
                <rect x="0" y="0" width="400" height="280" fill="#090d16" />
                {/* Radiopaque Tooth Roots */}
                <path d="M 80 40 L 90 220 Q 110 230 125 220 L 135 40 Z" fill="#64748b" opacity="0.8" />
                <path d="M 190 40 L 200 220 Q 220 230 235 220 L 245 40 Z" fill="#64748b" opacity="0.8" />
                <path d="M 300 40 L 310 220 Q 330 230 345 220 L 355 40 Z" fill="#64748b" opacity="0.8" />

                {/* Radiopaque Alveolar Bone (Flat Level) */}
                {(() => {
                  const boneY = 80 + (horizontalLossPct / 100) * 110;
                  return (
                    <>
                      <rect x="40" y={boneY} width="320" height={280 - boneY} fill="#334155" opacity="0.75" />
                      {/* Radiolucent Bone Loss Gap line */}
                      <line x1="40" y1="80" x2="360" y2="80" stroke="#38bdf8" strokeDasharray="3,3" strokeWidth="1.5" />
                      <text x="45" y="75" fill="#38bdf8" fontSize="10" fontFamily="monospace">Original Healthy Crest (1.5mm apical to CEJ)</text>

                      {/* Resorbed flat crest line */}
                      <line x1="40" y1={boneY} x2="360" y2={boneY} stroke="#f43f5e" strokeWidth="2.5" />
                      <text x="45" y={boneY + 16} fill="#f43f5e" fontSize="10" fontFamily="monospace">
                        Flat Radiolucent Loss Level ({horizontalLossPct}% Lost)
                      </text>
                    </>
                  );
                })()}
              </svg>
            ) : (
              // Anatomical 2D View
              <svg viewBox="0 0 420 290" className="w-full h-auto max-h-[290px]">
                <defs>
                  <linearGradient id="horizBoneGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e2d6b5" />
                    <stop offset="100%" stopColor="#9a8050" />
                  </linearGradient>
                </defs>

                {/* CEJ Reference Line */}
                <line x1="20" y1="70" x2="400" y2="70" stroke="#475569" strokeDasharray="4,4" strokeWidth="1.5" />
                <text x="25" y="65" fill="#64748b" fontSize="10" fontFamily="monospace">CEJ Line (Connecting Adjacent CEJs)</text>

                {/* Tooth 1 Crown & Root */}
                <g transform="translate(60, 20)">
                  <path d="M 15 15 Q 50 5 85 15 L 80 50 L 20 50 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 20 50 L 30 230 Q 50 240 65 230 L 80 50 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                </g>

                {/* Tooth 2 Crown & Root */}
                <g transform="translate(170, 20)">
                  <path d="M 15 15 Q 50 5 85 15 L 80 50 L 20 50 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 20 50 L 30 230 Q 50 240 65 230 L 80 50 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                </g>

                {/* Tooth 3 Crown & Root */}
                <g transform="translate(280, 20)">
                  <path d="M 15 15 Q 50 5 85 15 L 80 50 L 20 50 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 20 50 L 30 230 Q 50 240 65 230 L 80 50 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                </g>

                {/* Symmetrical Flat Alveolar Bone */}
                {(() => {
                  const boneY = 95 + (horizontalLossPct / 100) * 115;
                  const pocketBaseY = boneY - 18; // Pocket base is CORONAL to bone crest in suprabony!

                  return (
                    <>
                      {/* Bone Polygon */}
                      <path
                        d={`M 20 ${boneY} L 400 ${boneY} L 400 270 L 20 270 Z`}
                        fill="url(#horizBoneGrad)"
                        stroke="#78350f"
                        strokeWidth="2"
                      />

                      {/* Flat Bone Crest Indicator */}
                      <line x1="20" y1={boneY} x2="400" y2={boneY} stroke="#38bdf8" strokeWidth="3" />

                      {/* Suprabony Pocket Visualizer */}
                      <rect x="135" y={pocketBaseY} width="40" height={boneY - pocketBaseY} fill="#f43f5e" opacity="0.35" />
                      <line x1="135" y1={pocketBaseY} x2="175" y2={pocketBaseY} stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" />
                      <text x="110" y={pocketBaseY - 6} fill="#f43f5e" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        Suprabony Pocket Base
                      </text>

                      {/* Calibrated Probe in Interdental Space */}
                      {viewMode === 'probing' && (
                        <g transform={`translate(155, 10)`}>
                          <rect x="-3" y="10" width="6" height={pocketBaseY - 10} fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
                          <rect x="-3" y={pocketBaseY - 24} width="6" height="6" fill="#0f172a" />
                          <circle cx="0" cy={pocketBaseY} r="3" fill="#ef4444" />
                          <rect x="-22" y="0" width="44" height="16" fill="#0f172a" rx="4" stroke="#38bdf8" strokeWidth="1" />
                          <text x="0" y="12" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            4 mm
                          </text>
                        </g>
                      )}
                    </>
                  );
                })()}

                {/* Annotation */}
                <text x="210" y="255" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Symmetrical Bone Height Across Adjoining Teeth
                </text>
              </svg>
            )}
          </div>

          {/* Controls: Horizontal Bone Loss Percentage Slider */}
          <div className="space-y-2 p-3 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">Simulate Bone Loss %:</span>
              <span className="text-cyan-400 font-bold">{horizontalLossPct}% Lost</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={horizontalLossPct}
              onChange={(e) => setHorizontalLossPct(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>10% (Mild)</span>
              <span>40% (Moderate)</span>
              <span>70% (Severe)</span>
            </div>
          </div>

          {/* Key Facts Pill Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Pocket Type:</span>
              <strong className="text-cyan-300">Suprabony Pockets</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Measurement:</span>
              <strong className="text-amber-300">% Bone Height Lost</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2">
              <span className="text-slate-400 block text-[10px]">Regeneration Candidacy:</span>
              <strong className="text-rose-400">NOT Undertaken (Resective/Maintenance)</strong>
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT 2D DESIGN: VERTICAL / ANGULAR BONY DEFECT
            ===================================================================== */}
        <div className="bg-slate-950 p-5 rounded-3xl border border-purple-900/50 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Pattern 2: Vertical / Angular Defect
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Increases with Age (Infrabony)</span>
            </div>
            <h3 className="text-base font-bold text-white">Funnel-Shaped Trench (Cuneiform)</h3>
            <p className="text-xs text-slate-300">
              Oblique-slanting direction; bone loss develops at different rates around adjacent teeth. Base of pocket is apical to crest.
            </p>
          </div>

          {/* 2D SVG Diagram: Vertical Angular Defect */}
          <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-3 relative overflow-hidden flex items-center justify-center min-h-[300px]">
            {viewMode === 'xray' ? (
              // Periapical X-Ray Radiograph View
              <svg viewBox="0 0 400 280" className="w-full h-auto max-h-[280px]">
                <rect x="0" y="0" width="400" height="280" fill="#090d16" />
                <path d="M 80 40 L 90 220 Q 110 230 125 220 L 135 40 Z" fill="#64748b" opacity="0.8" />
                <path d="M 190 40 L 200 220 Q 220 230 235 220 L 245 40 Z" fill="#64748b" opacity="0.8" />
                <path d="M 300 40 L 310 220 Q 330 230 345 220 L 355 40 Z" fill="#64748b" opacity="0.8" />

                {/* Bone with Triangular/Cuneiform Radiolucent Defect Wedge */}
                {(() => {
                  const defectDepthY = 110 + (verticalDefectMm / 8) * 110;
                  return (
                    <>
                      <path
                        d={`M 40 110 L 135 110 L 195 ${defectDepthY} L 245 110 L 360 110 L 360 280 L 40 280 Z`}
                        fill="#334155"
                        opacity="0.75"
                      />

                      {/* Angular Radiolucency Wedge Outline */}
                      <polygon
                        points={`135,110 195,${defectDepthY} 195,110`}
                        fill="#f43f5e"
                        opacity="0.3"
                      />
                      <line x1="135" y1="110" x2="195" y2={defectDepthY} stroke="#f43f5e" strokeWidth="2.5" />

                      <text x="50" y="100" fill="#38bdf8" fontSize="10" fontFamily="monospace">Intact Crest (#14)</text>
                      <text x="140" y={defectDepthY + 20} fill="#f43f5e" fontSize="10" fontFamily="monospace">
                        Cuneiform Angular Wedge (-{verticalDefectMm}mm)
                      </text>
                    </>
                  );
                })()}
              </svg>
            ) : (
              // Anatomical 2D View
              <svg viewBox="0 0 420 290" className="w-full h-auto max-h-[290px]">
                <defs>
                  <linearGradient id="vertBoneGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e2d6b5" />
                    <stop offset="100%" stopColor="#9a8050" />
                  </linearGradient>
                </defs>

                {/* CEJ Reference Line */}
                <line x1="20" y1="70" x2="400" y2="70" stroke="#475569" strokeDasharray="4,4" strokeWidth="1.5" />
                <text x="25" y="65" fill="#64748b" fontSize="10" fontFamily="monospace">CEJ Line (Asymmetrical loss breaks parallelism)</text>

                {/* Tooth 1 Crown & Root */}
                <g transform="translate(60, 20)">
                  <path d="M 15 15 Q 50 5 85 15 L 80 50 L 20 50 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 20 50 L 30 230 Q 50 240 65 230 L 80 50 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                </g>

                {/* Tooth 2 Crown & Root (With Angular Defect on Mesial) */}
                <g transform="translate(170, 20)">
                  <path d="M 15 15 Q 50 5 85 15 L 80 50 L 20 50 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 20 50 L 30 230 Q 50 240 65 230 L 80 50 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                </g>

                {/* Tooth 3 Crown & Root */}
                <g transform="translate(280, 20)">
                  <path d="M 15 15 Q 50 5 85 15 L 80 50 L 20 50 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 20 50 L 30 230 Q 50 240 65 230 L 80 50 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                </g>

                {/* Alveolar Bone with Steep Cuneiform Angular Trench */}
                {(() => {
                  const baseCrestY = 95;
                  const trenchFloorY = baseCrestY + (verticalDefectMm / 8) * 125;

                  return (
                    <>
                      {/* Bone Polygon with Angular Notch */}
                      <path
                        d={`
                          M 20 ${baseCrestY} 
                          L 145 ${baseCrestY} 
                          L 195 ${trenchFloorY} 
                          L 205 ${baseCrestY + 15}
                          L 400 ${baseCrestY + 15} 
                          L 400 270 
                          L 20 270 
                          Z
                        `}
                        fill="url(#vertBoneGrad)"
                        stroke="#78350f"
                        strokeWidth="2"
                      />

                      {/* Oblique slanting angular line */}
                      <line x1="145" y1={baseCrestY} x2="195" y2={trenchFloorY} stroke="#f43f5e" strokeWidth="3.5" />

                      {/* Infrabony Pocket Base Marker (APICAL to Alveolar Crest) */}
                      <rect x="180" y={baseCrestY} width="22" height={trenchFloorY - baseCrestY} fill="#f43f5e" opacity="0.4" />
                      <line x1="180" y1={trenchFloorY} x2="202" y2={trenchFloorY} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="2,2" />
                      <text x="120" y={trenchFloorY + 18} fill="#f43f5e" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        Infrabony Pocket Base (Apical to Crest!)
                      </text>

                      {/* Calibrated Probe diving deep into Angular Trench */}
                      {viewMode === 'probing' && (
                        <g transform={`translate(195, 10)`}>
                          <rect x="-3" y="10" width="6" height={trenchFloorY - 10} fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
                          <rect x="-3" y={trenchFloorY - 24} width="6" height="6" fill="#0f172a" />
                          <rect x="-3" y={trenchFloorY - 48} width="6" height="6" fill="#0f172a" />
                          <circle cx="0" cy={trenchFloorY} r="3" fill="#ef4444" />
                          <rect x="-22" y="0" width="44" height="16" fill="#0f172a" rx="4" stroke="#a855f7" strokeWidth="1" />
                          <text x="0" y="12" fill="#a855f7" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            7.5 mm
                          </text>
                        </g>
                      )}
                    </>
                  );
                })()}

                {/* Annotation */}
                <text x="210" y="255" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Asymmetrical Bone Destruction Forming Infrabony Trench
                </text>
              </svg>
            )}
          </div>

          {/* Controls: Vertical Defect Depth Slider */}
          <div className="space-y-2 p-3 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">Simulate Angular Depth:</span>
              <span className="text-purple-400 font-bold">{verticalDefectMm} mm Depth</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="8.0"
              step="0.5"
              value={verticalDefectMm}
              onChange={(e) => setVerticalDefectMm(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>2.0 mm (Shallow)</span>
              <span>5.0 mm (Moderate)</span>
              <span>8.0 mm (Severe Deep Trench)</span>
            </div>
          </div>

          {/* Key Facts Pill Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Pocket Type:</span>
              <strong className="text-purple-300">Infra-bony Pockets</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Measurement:</span>
              <strong className="text-amber-300">Site-Specific CAL (mm)</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2">
              <span className="text-slate-400 block text-[10px]">Regeneration Candidacy:</span>
              <strong className="text-emerald-400">Prime Candidate (Highest in 3-Wall)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Official PDF Comparison Table (PDF Page 13) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Table className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-base">
            Exact Curriculum Comparison Table (PDF Page 13)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-3 px-4">Diagnostic Feature</th>
                <th className="py-3 px-4 text-cyan-300 bg-blue-950/20">Horizontal Bony Defect</th>
                <th className="py-3 px-4 text-purple-300 bg-purple-950/20">Vertical Bony Defect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-300">Interdental Bone Level</td>
                <td className="py-3 px-4 text-slate-200">Bone level is essentially equal interdentally.</td>
                <td className="py-3 px-4 text-slate-200">Bone level develops at different rates around adjacent teeth.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-300">Distribution Across Teeth</td>
                <td className="py-3 px-4 text-slate-200">The bone loss is equal across teeth.</td>
                <td className="py-3 px-4 text-slate-200">One tooth has more bone loss than the adjacent tooth.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-300">Method of Measurement</td>
                <td className="py-3 px-4 text-slate-200">Measured as the <strong>percentage of bone lost</strong>.</td>
                <td className="py-3 px-4 text-slate-200">Measured as the <strong>attachment loss at a site</strong>.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-300">Pocket Classification</td>
                <td className="py-3 px-4 text-slate-200">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-cyan-300 font-mono">Supra-bony pockets</span>
                </td>
                <td className="py-3 px-4 text-slate-200">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono">Infra-bony / Intrabony pockets</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-300">Bony Architecture</td>
                <td className="py-3 px-4 text-slate-200">Relatively flat; regular in thin interdental bone.</td>
                <td className="py-3 px-4 text-slate-200">Funnel-shaped, trench-like, hollowed trough.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-300">Regenerative Procedures</td>
                <td className="py-3 px-4 text-rose-300 font-semibold">
                  Regenerative procedures are <strong>NOT undertaken</strong>.
                </td>
                <td className="py-3 px-4 text-emerald-300 font-semibold">
                  Candidates for regenerative therapy (highest in 3-wall).
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-300">Radiographic Detection</td>
                <td className="py-3 px-4 text-slate-200">Easily seen on radiographs as even horizontal drop.</td>
                <td className="py-3 px-4 text-slate-200">Presence suggested on radiograph; requires probing &amp; surgical exposure.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
