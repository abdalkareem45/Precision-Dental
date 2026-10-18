import React, { useState } from 'react';
import {
  Compass,
  AlertTriangle,
  Award,
  CheckCircle2,
  Layers,
  ArrowRight,
  Play,
  RotateCcw,
  Eye,
  Sliders
} from 'lucide-react';

interface FurcationGrade {
  grade: number;
  title: string;
  badge: string;
  badgeColor: string;
  pdfDefinition: string;
  clinicalSign: string;
  nabersResponse: string;
  probeDepthMm: number;
  isThroughAndThrough: boolean;
  isRecessionExposed: boolean;
}

const FURCATION_GRADES: FurcationGrade[] = [
  {
    grade: 1,
    title: 'Grade I: Incipient Bone Loss',
    badge: 'Incipient Catch',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    pdfDefinition: 'Incipient bone loss.',
    clinicalSign: 'Slight pocket depth at furcation entrance; bone resorption limited to the coronal root trunk groove.',
    nabersResponse: 'Curved Nabers probe catches the fluting of the furcation entrance, but cannot enter horizontally.',
    probeDepthMm: 1.0,
    isThroughAndThrough: false,
    isRecessionExposed: false
  },
  {
    grade: 2,
    title: 'Grade II: Partial Bone Loss (Cul-de-sac)',
    badge: 'Cul-de-sac Entry',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    pdfDefinition: 'Partial bone loss (cul-de-sac).',
    clinicalSign: 'Loss of interradicular bone creating a dead-end pocket underneath the furcation roof.',
    nabersResponse: 'Nabers probe enters horizontally under the dome (>3mm) but CANNOT pass through to the other side.',
    probeDepthMm: 3.5,
    isThroughAndThrough: false,
    isRecessionExposed: false
  },
  {
    grade: 3,
    title: 'Grade III: Total Bone Loss (Through-and-Through)',
    badge: 'Tunnel (Covered)',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    pdfDefinition: 'Total bone loss with through-and-through opening of furcation.',
    clinicalSign: 'Complete interradicular bony tunnel between roots, but the opening remains covered by gingival soft tissue.',
    nabersResponse: 'Nabers probe passes completely through-and-through from buccal to lingual aspects.',
    probeDepthMm: 6.0,
    isThroughAndThrough: true,
    isRecessionExposed: false
  },
  {
    grade: 4,
    title: 'Grade IV: Exposed Through-and-Through',
    badge: 'Visible Tunnel',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    pdfDefinition: 'Grade III with gingival recession exposing the furcation clinically to view.',
    clinicalSign: 'The through-and-through tunnel is clearly visible upon direct clinical inspection due to soft tissue recession.',
    nabersResponse: 'Probe passes unobstructed through visible daylight tunnel.',
    probeDepthMm: 6.0,
    isThroughAndThrough: true,
    isRecessionExposed: true
  }
];

export const FurcationModule: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<number>(2);
  const [probeInserted, setProbeInserted] = useState<boolean>(true);

  const activeGradeObj = FURCATION_GRADES.find((g) => g.grade === selectedGrade) || FURCATION_GRADES[1];

  return (
    <div className="space-y-6 text-[#FAF8F3] font-sans">
      {/* Header with Precision Dental Brand Identity */}
      <div className="bg-[#071433] border border-[#E6E8EC]/20 rounded-3xl p-5 sm:p-7 space-y-2 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold">
              Precision Dental • 2D Interactive Nabers Probing Simulator • PDF Pages 14 &amp; 15
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span dir="rtl" className="text-xs font-arabic font-bold text-[#dfbe6e] px-2 py-0.5 rounded bg-[#0B1F4D] border border-[#C9A24B]/30">
              دقّة الأسنان
            </span>
            <span className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider hidden sm:inline">
              "Precision in Every Smile"
            </span>
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider">
            Advanced Dentistry for a Brighter Tomorrow • Glickman Furcation Assessment
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#FAF8F3]">
            Furcation Involvement &amp; Glickman Classification (2D Design)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#E6E8EC]/85 max-w-3xl">
          Invasion of the bifurcation of multi-rooted teeth by periodontal disease.
          Inspect interradicular bone loss and horizontal penetration of the curved <strong>Nabers probe</strong> across Grades I to IV.
        </p>
      </div>

      {/* Grade Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FURCATION_GRADES.map((g) => {
          const isSelected = selectedGrade === g.grade;
          return (
            <button
              key={g.grade}
              onClick={() => setSelectedGrade(g.grade)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#1B3A8C] border-[#C9A24B] ring-2 ring-[#C9A24B]/50 shadow-lg text-white'
                  : 'bg-[#071433] border-[#E6E8EC]/20 hover:border-[#C9A24B]/40 text-[#E6E8EC]/80'
              }`}
            >
              <div>
                <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border inline-block mb-1 ${g.badgeColor}`}>
                  {g.badge}
                </span>
                <div className="font-bold text-xs text-white leading-tight">{g.title.split(':')[0]}</div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                {g.title.split(':')[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main 2D Interactive Canvas + Specification Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 2D Interactive SVG Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300">
              Mandibular 1st Molar Bifurcation 2D Diagram:
            </span>
            <span className={`text-xs font-mono font-bold ${
              selectedGrade === 1 ? 'text-emerald-400' : selectedGrade === 2 ? 'text-amber-400' : selectedGrade === 3 ? 'text-rose-400' : 'text-purple-400'
            }`}>
              {activeGradeObj.title}
            </span>
          </div>

          {/* 2D SVG Diagram: Mandibular Molar Furcation */}
          <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex items-center justify-center min-h-[360px]">
            <svg viewBox="0 0 500 360" className="w-full h-auto max-h-[360px]">
              <defs>
                <linearGradient id="crownGradF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="rootGradF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
                <linearGradient id="boneGradF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e2d6b5" />
                  <stop offset="100%" stopColor="#9a8050" />
                </linearGradient>
                <linearGradient id="gingivaGradF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
              </defs>

              {/* CEJ Reference Line */}
              <line x1="30" y1="95" x2="470" y2="95" stroke="#475569" strokeDasharray="4,4" strokeWidth="1.5" />
              <text x="35" y="88" fill="#64748b" fontSize="10" fontFamily="monospace">CEJ (Root Trunk Length: ~3mm)</text>

              {/* 1. Tooth Crown (Mandibular 1st Molar with cusps) */}
              <path
                d="M 120 40 Q 185 20 250 35 Q 315 20 380 40 L 370 95 L 130 95 Z"
                fill="url(#crownGradF)"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              {/* 2. Undivided Root Trunk (CEJ to Bifurcation Fornix at Y: 140) */}
              <path
                d="M 130 95 L 135 140 L 365 140 L 370 95 Z"
                fill="url(#rootGradF)"
                stroke="#ca8a04"
                strokeWidth="1.5"
              />
              <text x="250" y="125" fill="#78350f" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                Root Trunk (3mm Buccal)
              </text>

              {/* 3. Mesial Root & Distal Root */}
              {/* Mesial Root */}
              <path
                d="M 135 140 L 155 310 Q 185 320 200 310 L 220 160 Q 250 145 280 160 L 300 310 Q 315 320 345 310 L 365 140 Z"
                fill="url(#rootGradF)"
                stroke="#ca8a04"
                strokeWidth="2"
              />

              {/* Furcation Fornix Dome (Apex of bifurcation at X: 250, Y: 150) */}
              <circle cx="250" cy="150" r="4" fill="#ca8a04" />
              <text x="250" y="172" fill="#78350f" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                Fornix Roof
              </text>

              {/* 4. Interradicular Alveolar Bone (Dynamic height based on Grade) */}
              {(() => {
                let boneTopY = 155; // Grade 1: Bone is near dome
                if (selectedGrade === 1) boneTopY = 158;
                else if (selectedGrade === 2) boneTopY = 205; // Partial loss (cul-de-sac void between 150 and 205)
                else if (selectedGrade === 3 || selectedGrade === 4) boneTopY = 285; // Complete through-and-through bone loss!

                return (
                  <>
                    {/* Residual Interradicular Bone */}
                    <path
                      d={`
                        M 195 310 
                        L 205 ${boneTopY} 
                        L 295 ${boneTopY} 
                        L 305 310 
                        Z
                      `}
                      fill="url(#boneGradF)"
                      stroke="#78350f"
                      strokeWidth="2"
                    />

                    {/* Surrounding Lateral Alveolar Bone Plates */}
                    <path d="M 40 120 L 130 120 L 155 310 L 40 310 Z" fill="url(#boneGradF)" opacity="0.6" />
                    <path d="M 370 120 L 460 120 L 460 310 L 345 310 Z" fill="url(#boneGradF)" opacity="0.6" />

                    {/* Furcation Bone Defect Cavity Void */}
                    {selectedGrade >= 2 && (
                      <g>
                        <rect
                          x="215"
                          y="152"
                          width="70"
                          height={boneTopY - 152}
                          fill={selectedGrade === 2 ? '#f59e0b' : '#f43f5e'}
                          opacity={selectedGrade === 4 ? 0.08 : 0.3}
                          rx="4"
                        />
                        <text
                          x="250"
                          y={(152 + boneTopY) / 2 + 4}
                          fill={selectedGrade === 2 ? '#f59e0b' : '#f43f5e'}
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {selectedGrade === 2
                            ? 'Cul-de-sac Void'
                            : selectedGrade === 3
                            ? 'Tunnel (Covered)'
                            : 'Open Visible Tunnel'}
                        </text>
                      </g>
                    )}
                  </>
                );
              })()}

              {/* 5. Gingival Soft Tissue (Covered in Grades 1-3, Receded in Grade 4!) */}
              {(() => {
                const isGrade4 = selectedGrade === 4;
                const gingivaY = isGrade4 ? 220 : 130; // In Grade 4: receded apical to furcation!

                return (
                  <>
                    {/* Gingival Margin Band */}
                    <path
                      d={`
                        M 40 ${gingivaY} 
                        Q 130 ${gingivaY + 5} 190 ${gingivaY + 8} 
                        Q 250 ${isGrade4 ? gingivaY + 15 : gingivaY - 10} 310 ${gingivaY + 8} 
                        Q 370 ${gingivaY + 5} 460 ${gingivaY} 
                        L 460 330 
                        L 40 330 
                        Z
                      `}
                      fill="url(#gingivaGradF)"
                      opacity="0.5"
                      stroke="#db2777"
                      strokeWidth="1.5"
                    />

                    {isGrade4 ? (
                      <text x="250" y="260" fill="#ec4899" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        ⚠️ Gingival Recession Exposes Furcation Directly to View
                      </text>
                    ) : (
                      <text x="250" y="120" fill="#ec4899" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        Soft Tissue Bridges Over Furcation Entrance
                      </text>
                    )}
                  </>
                );
              })()}

              {/* 6. Curved Nabers Periodontal Probe Simulation */}
              {probeInserted && (
                <g>
                  {(() => {
                    // Curved Nabers Probe coordinates based on grade
                    let probePath = '';
                    let probeTipX = 220;
                    let probeTipY = 155;
                    let passThrough = false;

                    if (selectedGrade === 1) {
                      // Catches fluting at X: 232, does not enter horizontally
                      probePath = 'M 140 180 Q 180 170 230 155';
                      probeTipX = 230;
                      probeTipY = 155;
                    } else if (selectedGrade === 2) {
                      // Enters >3mm under dome, stops halfway at X: 255
                      probePath = 'M 140 180 Q 180 165 255 155';
                      probeTipX = 255;
                      probeTipY = 155;
                    } else {
                      // Grade 3 or 4: Passes through-and-through from buccal to lingual (X: 140 to 350)
                      probePath = 'M 140 180 Q 250 148 350 165';
                      probeTipX = 350;
                      probeTipY = 165;
                      passThrough = true;
                    }

                    return (
                      <>
                        {/* Curved Nabers Probe Shaft */}
                        <path
                          d={probePath}
                          fill="none"
                          stroke="#cbd5e1"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                        {/* Calibrated 3mm black bands on Nabers probe */}
                        <path
                          d={probePath}
                          fill="none"
                          stroke="#0f172a"
                          strokeWidth="7"
                          strokeDasharray="10,14"
                          strokeLinecap="round"
                        />
                        {/* Probe Tip Dot */}
                        <circle cx={probeTipX} cy={probeTipY} r="4.5" fill="#ef4444" />

                        {/* Callout Tag */}
                        <g transform={`translate(${probeTipX}, ${probeTipY - 20})`}>
                          <rect x="-35" y="-12" width="70" height="18" fill="#0f172a" rx="4" stroke="#38bdf8" strokeWidth="1" />
                          <text x="0" y="0" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            {passThrough ? 'THROUGH!' : `${activeGradeObj.probeDepthMm}mm catch`}
                          </text>
                        </g>
                      </>
                    );
                  })()}
                </g>
              )}
            </svg>
          </div>

          {/* Nabers Probing Interactive Action Bar */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-300 font-bold">Curved Nabers Probe Simulation:</span>
            </div>

            <button
              onClick={() => setProbeInserted(!probeInserted)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold font-mono transition border ${
                probeInserted
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {probeInserted ? 'Withdraw Nabers Probe' : 'Insert Nabers Probe'}
            </button>
          </div>
        </div>

        {/* Clinical Specification Dossier (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border inline-block mb-1 ${activeGradeObj.badgeColor}`}>
              {activeGradeObj.badge}
            </span>
            <h3 className="text-lg font-bold text-white">{activeGradeObj.title}</h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-slate-200 block text-xs">PDF Textbook Definition:</strong>
              <p className="text-slate-300">{activeGradeObj.pdfDefinition}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/60 space-y-1">
              <strong className="text-cyan-300 block text-xs flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                Nabers Probe Clinical Response:
              </strong>
              <p className="text-cyan-100/90">{activeGradeObj.nabersResponse}</p>
            </div>

            {/* Senior Board Facts from PDF Page 14 & 15 */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/60 space-y-2 text-amber-200">
              <strong className="block text-xs font-bold text-amber-300">
                Senior Board Anatomical Facts (PDF Page 14):
              </strong>
              <ul className="space-y-1.5 font-mono text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Mandibular 1st Molar:</strong> The MOST common site of furcation involvement.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold shrink-0">✓</span>
                  <span><strong>Maxillary Premolars:</strong> The LEAST common site of furcation involvement.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold shrink-0">✓</span>
                  <span><strong>Curved Nabers Probe:</strong> Essential diagnostic tool; straight probes fail to negotiate the root trunk curvature.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
