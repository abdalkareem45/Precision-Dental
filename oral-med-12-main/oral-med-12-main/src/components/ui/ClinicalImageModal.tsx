import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { X, Info, ZoomIn, ZoomOut, CheckCircle2 } from 'lucide-react';

export const ClinicalImageModal: React.FC = () => {
  const { selectedImageModal, closeImageModal } = useLearning();
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!selectedImageModal || !selectedImageModal.isOpen) return null;

  const { title, description, imageType, hotspots } = selectedImageModal;

  // Render high-fidelity SVG/Canvas medical representation matching the PDF clinical photos
  const renderClinicalGraphic = () => {
    switch (imageType) {
      case 'cmv':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full rounded-lg bg-slate-900 shadow-inner">
            <defs>
              <radialGradient id="cmvUlcerGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#450a0a" />
                <stop offset="55%" stopColor="#7f1d1d" />
                <stop offset="85%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </radialGradient>
              <pattern id="hairyTexture" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0,5 Q 10,0 20,5 M 0,15 Q 10,10 20,15" stroke="#f1f5f9" strokeWidth="2.5" fill="none" opacity="0.85" />
              </pattern>
            </defs>
            {/* Background Oral Cavity / Retractor */}
            <rect width="600" height="400" fill="#0f172a" />
            <path d="M 50,50 Q 300,10 550,50 Q 580,200 550,350 Q 300,390 50,350 Z" fill="#7f1d1d" opacity="0.3" />

            {/* Tongue Body (Lateral border everted) */}
            <path d="M 100,100 C 180,60 480,70 520,200 C 500,320 220,340 100,280 Z" fill="#b91c1c" />

            {/* Oral Hairy Leukoplakia (Corrugated white plaques on lateral tongue) */}
            <path d="M 160,110 C 260,85 430,95 470,180 C 430,220 280,210 160,180 Z" fill="#e2e8f0" opacity="0.9" />
            <path d="M 160,110 C 260,85 430,95 470,180 C 430,220 280,210 160,180 Z" fill="url(#hairyTexture)" />

            {/* Solitary CMV Ulcer (Deep, indurated crater) */}
            <ellipse cx="320" cy="190" rx="75" ry="48" fill="url(#cmvUlcerGrad)" stroke="#450a0a" strokeWidth="4" />
            <ellipse cx="320" cy="190" rx="55" ry="32" fill="#260404" />
            <ellipse cx="315" cy="185" rx="35" ry="18" fill="#140202" />

            {/* Fibrinous exudate flecks */}
            <circle cx="300" cy="180" r="5" fill="#fef08a" opacity="0.7" />
            <circle cx="335" cy="195" r="4" fill="#fef08a" opacity="0.6" />

            {/* Incisor Teeth Edge for scale */}
            <rect x="70" y="80" width="35" height="45" rx="4" fill="#fefce8" stroke="#d4d4d8" strokeWidth="2" />
            <rect x="110" y="75" width="40" height="48" rx="4" fill="#fefce8" stroke="#d4d4d8" strokeWidth="2" />
          </svg>
        );

      case 'coxsackie':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full rounded-lg bg-slate-900">
            <rect width="600" height="400" fill="#090d16" />
            {/* Split view: Left = Herpangina Soft Palate, Right = Hand/Foot Vesicles */}
            {/* Left: Oropharynx & Soft Palate */}
            <g transform="translate(10, 10)">
              <rect width="280" height="380" rx="8" fill="#1e1b4b" stroke="#312e81" strokeWidth="1" />
              <text x="140" y="30" textAnchor="middle" fill="#a5b4fc" fontSize="12" fontWeight="bold">Herpangina (Soft Palate & Pillars)</text>
              {/* Oropharynx arch */}
              <path d="M 40,80 Q 140,50 240,80 C 250,180 250,260 240,340 Q 140,360 40,340 Z" fill="#831843" />
              {/* Uvula */}
              <path d="M 130,80 Q 140,140 150,80 Z" fill="#9d174d" stroke="#701a75" />
              {/* Tonsillar Pillars */}
              <path d="M 60,110 Q 75,220 65,300" stroke="#be185d" strokeWidth="8" fill="none" />
              <path d="M 220,110 Q 205,220 215,300" stroke="#be185d" strokeWidth="8" fill="none" />
              {/* 2-4 mm Vesicles and Ulcers on pillars & palate */}
              {[
                { x: 95, y: 130 }, { x: 185, y: 140 }, { x: 75, y: 180 },
                { x: 205, y: 195 }, { x: 110, y: 95 }, { x: 165, y: 100 }
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="8" fill="#b91c1c" stroke="#f43f5e" strokeWidth="2" />
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#fef08a" />
                </g>
              ))}
            </g>

            {/* Right: Hand/Foot Cutaneous Lesions */}
            <g transform="translate(310, 10)">
              <rect width="280" height="380" rx="8" fill="#1e1b4b" stroke="#312e81" strokeWidth="1" />
              <text x="140" y="30" textAnchor="middle" fill="#a5b4fc" fontSize="12" fontWeight="bold">Cutaneous Macules & Vesicles</text>
              {/* Pediatric palm illustration */}
              <path d="M 80,180 C 70,120 100,70 120,70 C 130,70 135,110 140,110 C 145,90 160,80 170,85 C 175,120 178,120 185,110 C 195,100 210,110 205,140 C 220,140 230,160 220,200 C 200,280 190,320 130,330 C 90,320 70,260 80,180 Z" fill="#fed7aa" stroke="#fb923c" strokeWidth="2" />
              {/* Oval vesicles with erythematous halo */}
              {[
                { x: 110, y: 190 }, { x: 140, y: 220 }, { x: 175, y: 180 },
                { x: 155, y: 270 }, { x: 120, y: 140 }, { x: 180, y: 240 }
              ].map((v, i) => (
                <g key={i}>
                  <ellipse cx={v.x} cy={v.y} rx="9" ry="6" fill="#f43f5e" />
                  <ellipse cx={v.x} cy={v.y} rx="5" ry="3" fill="#fef08a" />
                </g>
              ))}
            </g>
          </svg>
        );

      case 'nug':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full rounded-lg bg-slate-900">
            <rect width="600" height="400" fill="#090d16" />
            {/* Teeth Arch and Severe Gingival Necrosis */}
            {/* Upper Teeth */}
            <g fill="#fefce8" stroke="#cbd5e1" strokeWidth="2">
              <rect x="180" y="40" width="55" height="75" rx="6" />
              <rect x="245" y="35" width="55" height="85" rx="6" />
              <rect x="310" y="35" width="55" height="85" rx="6" />
              <rect x="375" y="40" width="55" height="75" rx="6" />
            </g>
            {/* Lower Teeth */}
            <g fill="#fefce8" stroke="#cbd5e1" strokeWidth="2">
              <rect x="185" y="190" width="50" height="80" rx="6" />
              <rect x="245" y="180" width="52" height="95" rx="6" />
              <rect x="307" y="180" width="52" height="95" rx="6" />
              <rect x="369" y="190" width="50" height="80" rx="6" />
            </g>

            {/* Inflamed Gingiva with Punched-Out Necrotic Papillae */}
            <path d="M 120,250 C 180,240 240,230 300,230 C 360,230 420,240 480,250 L 480,360 L 120,360 Z" fill="#991b1b" />

            {/* Punched out craters with gray pseudomembrane between teeth */}
            {[238, 301, 363].map((cx, i) => (
              <g key={i}>
                {/* Ulcer crater */}
                <path d={`M ${cx - 14},230 Q ${cx},260 ${cx + 14},230 Z`} fill="#334155" stroke="#7f1d1d" strokeWidth="3" />
                {/* Sloughing pseudomembrane */}
                <ellipse cx={cx} cy={242} rx="10" ry="7" fill="#64748b" />
                {/* Spontaneous bleeding drip */}
                <path d={`M ${cx},250 Q ${cx + 3},275 ${cx - 1},290`} stroke="#dc2626" strokeWidth="3" strokeLinecap="round" fill="none" />
              </g>
            ))}

            {/* Copious dental plaque accumulation at gingival margin */}
            <path d="M 185,268 Q 210,272 235,268 M 245,265 Q 275,270 305,265 M 310,265 Q 335,270 365,265" stroke="#fef08a" strokeWidth="5" opacity="0.8" fill="none" />
          </svg>
        );

      case 'em':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full rounded-lg bg-slate-900">
            <rect width="600" height="400" fill="#090d16" />
            {/* Split: Left = Classic Target Lesion on Palm, Right = Hemorrhagic Crusted Lips */}
            <g transform="translate(15, 15)">
              <rect width="270" height="370" rx="8" fill="#18181b" stroke="#27272a" />
              <text x="135" y="30" textAnchor="middle" fill="#fda4af" fontSize="12" fontWeight="bold">Palmar Target (Iris) Lesion</text>
              {/* Palm Skin */}
              <ellipse cx="135" cy="200" rx="110" ry="140" fill="#fbcfe8" opacity="0.6" stroke="#f472b6" strokeWidth="1" />
              {/* Classic concentric target */}
              <circle cx="135" cy="200" r="75" fill="#e11d48" opacity="0.85" />
              <circle cx="135" cy="200" r="48" fill="#fecdd3" />
              <circle cx="135" cy="200" r="26" fill="#4c0519" />
              <circle cx="135" cy="200" r="8" fill="#881337" />
              {/* Labels for 3 rings */}
              <text x="135" y="110" textAnchor="middle" fill="#e11d48" fontSize="10">1. Erythematous Halo</text>
              <text x="135" y="145" textAnchor="middle" fill="#fda4af" fontSize="10">2. Pale Edematous Ring</text>
              <text x="135" y="235" textAnchor="middle" fill="#fecdd3" fontSize="10">3. Dusky Necrotic Center</text>
            </g>

            <g transform="translate(315, 15)">
              <rect width="270" height="370" rx="8" fill="#18181b" stroke="#27272a" />
              <text x="135" y="30" textAnchor="middle" fill="#fda4af" fontSize="12" fontWeight="bold">Hemorrhagic Crusted Lips</text>
              {/* Mouth & Lips */}
              <ellipse cx="135" cy="190" rx="115" ry="75" fill="#4c0519" />
              {/* Swollen Upper Lip */}
              <path d="M 30,175 Q 135,130 240,175 Q 135,160 30,175 Z" fill="#9f1239" stroke="#881337" strokeWidth="3" />
              {/* Swollen Lower Lip */}
              <path d="M 30,195 Q 135,260 240,195 Q 135,210 30,195 Z" fill="#9f1239" stroke="#881337" strokeWidth="3" />
              {/* Thick dark hemorrhagic crusts */}
              {[
                { x: 60, y: 175, rx: 18, ry: 8 }, { x: 100, y: 165, rx: 22, ry: 9 },
                { x: 145, y: 168, rx: 24, ry: 10 }, { x: 195, y: 178, rx: 20, ry: 8 },
                { x: 75, y: 210, rx: 25, ry: 12 }, { x: 135, y: 225, rx: 32, ry: 14 },
                { x: 190, y: 215, rx: 22, ry: 10 }
              ].map((c, i) => (
                <ellipse key={i} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill="#1c0309" stroke="#4c0519" strokeWidth="2" />
              ))}
              {/* Blood-tinged drool streak */}
              <path d="M 135,245 Q 140,295 130,330" stroke="#be123c" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
            </g>
          </svg>
        );

      case 'sjs':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full rounded-lg bg-slate-900">
            <rect width="600" height="400" fill="#090d16" />
            {/* Anterior Torso with Confluent Purpuric Macules & Epidermal Peeling */}
            <path d="M 150,50 L 450,50 L 510,380 L 90,380 Z" fill="#d97706" opacity="0.3" />
            {/* Extensive purpuric erythema on chest */}
            <path d="M 170,80 Q 300,60 430,80 Q 480,260 410,360 Q 300,380 190,360 Z" fill="#581c87" opacity="0.8" />
            {/* Sheet-like flaccid epidermal detachment (>30% TEN) */}
            <path d="M 200,120 Q 320,100 400,140 Q 380,250 220,240 Z" fill="#3b0764" stroke="#7e22ce" strokeWidth="3" />
            <path d="M 230,160 Q 330,150 360,220 Q 280,260 210,210 Z" fill="#1e1b4b" opacity="0.9" />

            {/* Atypical flat purpuric targets (chest-favoring) */}
            {[
              { cx: 220, cy: 110, r: 24 }, { cx: 370, cy: 115, r: 26 },
              { cx: 290, cy: 280, r: 35 }, { cx: 230, cy: 310, r: 22 },
              { cx: 370, cy: 300, r: 28 }
            ].map((at, i) => (
              <g key={i}>
                <circle cx={at.cx} cy={at.cy} r={at.r} fill="#701a75" opacity="0.75" />
                <circle cx={at.cx} cy={at.cy} r={at.r * 0.55} fill="#3b0764" />
              </g>
            ))}

            {/* Nikolsky sign epidermal slip banner */}
            <g transform="translate(20, 20)">
              <rect width="180" height="48" rx="6" fill="#0f172a" stroke="#475569" />
              <text x="90" y="20" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold">Nikolsky Sign: POSITIVE</text>
              <text x="90" y="38" textAnchor="middle" fill="#94a3b8" fontSize="10">Subepidermal cleavage</text>
            </g>
          </svg>
        );

      case 'pcs':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full rounded-lg bg-slate-900">
            <rect width="600" height="400" fill="#090d16" />
            {/* Upper and Lower Teeth with Vivid Scarlet Attached Gingival Band */}
            {/* Upper Teeth */}
            <g fill="#fefce8" stroke="#cbd5e1" strokeWidth="2">
              <rect x="170" y="90" width="50" height="75" rx="6" />
              <rect x="230" y="85" width="55" height="85" rx="6" />
              <rect x="295" y="85" width="55" height="85" rx="6" />
              <rect x="360" y="90" width="50" height="75" rx="6" />
            </g>
            {/* Lower Teeth */}
            <g fill="#fefce8" stroke="#cbd5e1" strokeWidth="2">
              <rect x="175" y="210" width="48" height="75" rx="6" />
              <rect x="235" y="205" width="52" height="85" rx="6" />
              <rect x="297" y="205" width="52" height="85" rx="6" />
              <rect x="359" y="210" width="48" height="75" rx="6" />
            </g>

            {/* Fiery scarlet attached & marginal gingiva (Desquamative Gingivitis) */}
            {/* Upper attached gingiva */}
            <path d="M 120,40 C 220,20 380,20 480,40 L 480,95 C 400,90 200,90 120,95 Z" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
            {/* Lower attached gingiva */}
            <path d="M 120,285 C 220,290 380,290 480,285 L 480,350 C 380,365 220,365 120,350 Z" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />

            {/* Dilated microvascular stippling (dilated capillaries near surface) */}
            {[...Array(40)].map((_, i) => (
              <circle
                key={i}
                cx={140 + (i % 10) * 32 + (Math.sin(i) * 6)}
                cy={i < 20 ? 55 + Math.floor(i / 10) * 16 : 300 + Math.floor((i - 20) / 10) * 16}
                r="2.5"
                fill="#fca5a5"
              />
            ))}

            {/* Angular Cheilitis fissuring indicator at corner */}
            <g transform="translate(60, 160)">
              <path d="M 10,20 Q 35,40 10,60" stroke="#b91c1c" strokeWidth="5" strokeLinecap="round" fill="none" />
              <text x="25" y="90" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">Angular Cheilitis</text>
            </g>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{title}</h2>
              <p className="text-xs text-slate-400">Interactive Clinical Presentation Gallery</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(Math.min(1.6, zoomLevel + 0.2))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={closeImageModal}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image & Interactive Hotspot Canvas Area */}
        <div className="relative flex-1 min-h-[350px] overflow-hidden flex items-center justify-center p-4 bg-slate-950/60">
          <div
            style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
            className="relative w-full max-w-2xl h-[340px]"
          >
            {renderClinicalGraphic()}

            {/* Clickable Hotspot Pins */}
            {hotspots.map((hs, idx) => {
              const isSelected = activeHotspot === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveHotspot(isSelected ? null : idx)}
                  style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none"
                >
                  <span className="relative flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                    <span
                      className={`relative inline-flex rounded-full h-6 w-6 border-2 border-white items-center justify-center text-[10px] font-bold shadow-lg ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'bg-teal-500 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </span>

                  {/* Tooltip on hover */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded shadow-xl border border-slate-700 pointer-events-none z-30">
                    {hs.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hotspot Description & Pathology Key Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-3">
          <div className="text-xs text-slate-300 leading-relaxed">{description}</div>

          {activeHotspot !== null ? (
            <div className="p-3 bg-teal-950/40 rounded-xl border border-teal-800/60 text-xs">
              <div className="flex items-center gap-2 text-teal-300 font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Feature {activeHotspot + 1}: {hotspots[activeHotspot].label}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{hotspots[activeHotspot].details}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic">
              <Info className="w-3.5 h-3.5" />
              <span>Click on any numbered glowing hotspot pin above to inspect detailed histopathological and clinical findings.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
