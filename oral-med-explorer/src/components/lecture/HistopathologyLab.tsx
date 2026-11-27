import React, { useState } from 'react';
import { Columns2, Microscope, ZoomIn, ZoomOut } from 'lucide-react';
import type { HistopathSlide, HistoVisualPattern } from '@/src/types/lecture';

interface HistopathologyLabProps {
  slides: HistopathSlide[];
}

const PatternVisualSvg: React.FC<{ pattern: HistoVisualPattern }> = ({ pattern }) => {
  switch (pattern) {
    case 'lymph-node':
      return (
        <svg viewBox="0 0 400 260" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="260" fill="#131B2E" />
          <ellipse cx="200" cy="130" rx="145" ry="92" fill="#4C1D95" fillOpacity="0.45" stroke="#C4B5FD" strokeWidth="3" />
          <ellipse cx="200" cy="130" rx="108" ry="64" fill="#6D28D9" fillOpacity="0.35" stroke="#DDD6FE" strokeDasharray="5 4" />
          {[
            [135, 96],
            [200, 82],
            [265, 96],
            [155, 162],
            [245, 162],
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="20" fill="#A78BFA" fillOpacity="0.45" stroke="#EDE9FE" strokeWidth="1.5" />
          ))}
          <ellipse cx="200" cy="130" rx="45" ry="24" fill="#FEF3C7" fillOpacity="0.55" stroke="#FCD34D" />
          <text x="172" y="134" fill="#0B1F4D" fontSize="10" fontWeight="bold" fontFamily="monospace">HILUM</text>
        </svg>
      );

    case 'tmj-sagittal':
    case 'tmj-mri':
      return (
        <svg viewBox="0 0 400 260" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="260" fill="#0B1220" />
          {/* Temporal Bone / Glenoid Fossa / Articular Eminence */}
          <path
            d="M 40 80 Q 125 25 200 95 Q 250 130 330 70 L 360 35 L 40 35 Z"
            fill={pattern === 'tmj-mri' ? '#475569' : '#D6D3D1'}
            stroke="#94A3B8"
            strokeWidth="2"
          />
          {/* Biconcave Disc */}
          <path
            d={
              pattern === 'tmj-mri'
                ? 'M 190 112 Q 230 124 275 104 Q 245 92 190 112 Z'
                : 'M 135 95 Q 178 110 220 92 Q 186 78 135 95 Z'
            }
            fill="#14B8A6"
            fillOpacity="0.82"
            stroke="#5EEAD4"
            strokeWidth="2"
          />
          {/* Condylar Head */}
          <path
            d="M 130 142 C 130 108, 200 108, 200 142 L 220 245 L 112 245 Z"
            fill={pattern === 'tmj-mri' ? '#64748B' : '#E2E8F0'}
            stroke="#CBD5E1"
            strokeWidth="2"
          />
          {/* Retrodiscal bilaminar zone */}
          <path d="M 88 94 L 135 98 L 135 128 L 88 124 Z" fill="#EF4444" fillOpacity="0.45" stroke="#FCA5A5" />
        </svg>
      );

    case 'blood-smear':
      return (
        <svg viewBox="0 0 400 260" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="260" fill="#FDF2F8" />
          {[
            [70, 65, 22],
            [135, 88, 24],
            [210, 62, 19],
            [295, 76, 23],
            [95, 165, 22],
            [180, 145, 21],
            [260, 175, 24],
            [335, 148, 20],
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="#F43F5E" fillOpacity="0.72" stroke="#BE123C" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r={r * 0.45} fill="#FFE4E6" fillOpacity="0.7" />
            </g>
          ))}
          {/* Neutrophil */}
          <circle cx="210" cy="195" r="28" fill="#E0E7FF" stroke="#4338CA" strokeWidth="2" />
          <path d="M 196 188 C 204 176, 224 182, 220 198 C 216 210, 198 206, 196 188 Z" fill="#4338CA" />
          {/* Sickle cell */}
          <path d="M 310 198 Q 340 185 352 214 Q 326 205 310 198 Z" fill="#E11D48" stroke="#9F1239" strokeWidth="1.5" />
        </svg>
      );

    case 'coagulation-cascade':
      return (
        <svg viewBox="0 0 400 260" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="260" fill="#0B1220" />
          <rect x="35" y="34" width="135" height="62" rx="10" fill="#1E3A8A" stroke="#60A5FA" />
          <text x="102" y="60" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="bold">INTRINSIC (aPTT)</text>
          <text x="102" y="78" textAnchor="middle" fill="#93C5FD" fontSize="10">XII → XI → IX + VIII</text>

          <rect x="230" y="34" width="135" height="62" rx="10" fill="#0F766E" stroke="#5EEAD4" />
          <text x="297" y="60" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="bold">EXTRINSIC (PT/INR)</text>
          <text x="297" y="78" textAnchor="middle" fill="#99F6E4" fontSize="10">Tissue Factor + VII</text>

          <path d="M 102 96 L 175 142 M 297 96 L 225 142" stroke="#C9A24B" strokeWidth="2.5" />
          <rect x="110" y="142" width="180" height="82" rx="12" fill="#78350F" fillOpacity="0.65" stroke="#FCD34D" />
          <text x="200" y="172" textAnchor="middle" fill="#FEF3C7" fontSize="11" fontWeight="bold">COMMON PATHWAY</text>
          <text x="200" y="192" textAnchor="middle" fill="#FDE68A" fontSize="10">Factor X + V → Prothrombin (II)</text>
          <text x="200" y="210" textAnchor="middle" fill="#FDE68A" fontSize="10">→ Thrombin → Fibrin Clot (I)</text>
        </svg>
      );

    case 'candida-pas':
      return (
        <svg viewBox="0 0 400 260" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="260" fill="#F5D0FE" />
          <path d="M 0 120 Q 100 100 200 120 T 400 120 L 400 260 L 0 260 Z" fill="#E879F9" fillOpacity="0.45" />
          {/* PAS+ Magenta Pseudohyphae invading superficial parakeratin */}
          {[
            'M 65 40 C 90 65, 115 95, 130 132',
            'M 150 32 C 168 70, 175 100, 195 140',
            'M 250 38 C 236 78, 260 108, 278 145',
            'M 320 44 C 305 82, 315 110, 338 136',
          ].map((d, idx) => (
            <path key={idx} d={d} fill="none" stroke="#9D174D" strokeWidth="5" strokeLinecap="round" />
          ))}
          {[82, 162, 245, 315].map((cx, i) => (
            <circle key={i} cx={cx} cy={52 + (i % 2) * 18} r="7" fill="#BE185D" />
          ))}
        </svg>
      );

    case 'dysplasia-cis':
    case 'olp-band':
    case 'pv-suprabasilar':
    case 'mmp-bmz':
    case 'melanoma-nest':
      return (
        <svg viewBox="0 0 400 260" className="w-full h-full" aria-hidden="true">
          {/* Epithelium upper half, lamina propria lower half */}
          <rect width="400" height="145" fill="#FCE7F3" />
          <rect y="145" width="400" height="115" fill="#FBCFE8" fillOpacity="0.55" />
          {/* Basement Membrane */}
          <path d="M 0 145 Q 50 135 100 145 T 200 145 T 300 145 T 400 145" fill="none" stroke="#1B3A8C" strokeWidth="3.5" />

          {pattern === 'pv-suprabasilar' && (
            <>
              {/* Row of Tombstone Basal Cells attached to BMZ */}
              {Array.from({ length: 12 }).map((_, i) => (
                <rect key={i} x={14 + i * 32} y={116} width="22" height="28" rx="4" fill="#9D174D" />
              ))}
              {/* Suprabasilar blister cavity + Tzanck cells */}
              <ellipse cx="200" cy="86" rx="145" ry="26" fill="#FFFFFF" stroke="#BE185D" strokeWidth="2" />
              {[135, 185, 235, 270].map((cx, i) => (
                <circle key={i} cx={cx} cy={88} r="10" fill="#BE185D" stroke="#F9A8D4" strokeWidth="2" />
              ))}
            </>
          )}

          {pattern === 'mmp-bmz' && (
            <>
              {/* Full-thickness clean subepithelial split */}
              <path d="M 40 120 Q 200 58 360 120 L 360 144 L 40 144 Z" fill="#FFFFFF" stroke="#0F766E" strokeWidth="2.5" />
              <line x1="40" y1="145" x2="360" y2="145" stroke="#14B8A6" strokeWidth="5" />
            </>
          )}

          {pattern === 'olp-band' && (
            <>
              {/* Band-like T-cell infiltrate hugging BMZ + sawtooth rete */}
              <rect x="0" y="147" width="400" height="58" fill="#4338CA" fillOpacity="0.35" />
              {Array.from({ length: 24 }).map((_, i) => (
                <circle key={i} cx={16 + (i % 12) * 32 + (i > 11 ? 12 : 0)} cy={i > 11 ? 185 : 162} r="7" fill="#312E81" />
              ))}
            </>
          )}

          {pattern === 'dysplasia-cis' && (
            <>
              {/* Full-thickness atypical pleomorphic dark nuclei */}
              {Array.from({ length: 28 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx={24 + (i % 9) * 43}
                  cy={28 + Math.floor(i / 9) * 32}
                  rx={8 + (i % 3) * 3}
                  ry={11}
                  fill="#4C1D95"
                  stroke="#A78BFA"
                />
              ))}
            </>
          )}

          {pattern === 'melanoma-nest' && (
            <>
              {Array.from({ length: 14 }).map((_, i) => (
                <circle
                  key={i}
                  cx={45 + (i % 6) * 58}
                  cy={45 + Math.floor(i / 6) * 38}
                  r={10 + (i % 3) * 4}
                  fill="#292524"
                  stroke="#78350F"
                  strokeWidth="2"
                />
              ))}
            </>
          )}
        </svg>
      );

    case 'salivary-acinus':
    case 'sialolith-occlusal':
      return (
        <svg viewBox="0 0 400 260" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="260" fill={pattern === 'sialolith-occlusal' ? '#090D16' : '#EDE9FE'} />
          {pattern === 'sialolith-occlusal' ? (
            <>
              {/* Radiograph Mandible Arch */}
              <path d="M 65 230 Q 65 45 200 45 Q 335 45 335 230" fill="none" stroke="#CBD5E1" strokeWidth="26" />
              {/* Radiopaque Stone in Wharton's Duct */}
              <ellipse cx="184" cy="138" rx="18" ry="12" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
              <text x="184" y="168" textAnchor="middle" fill="#5EEAD4" fontSize="11" fontFamily="monospace">
                RADIOPAQUE SIALOLITH
              </text>
            </>
          ) : (
            <>
              {[
                [115, 90],
                [90, 145],
                [135, 180],
                [175, 110],
                [175, 165],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="32" fill="#8B5CF6" fillOpacity="0.4" stroke="#5B21B6" strokeWidth="2" />
              ))}
              <rect x="195" y="118" width="165" height="36" rx="8" fill="#EC4899" fillOpacity="0.4" stroke="#9D174D" strokeWidth="2" />
            </>
          )}
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 400 260" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="260" fill="#0B1220" />
          <circle cx="200" cy="130" r="78" fill="#1B3A8C" fillOpacity="0.4" stroke="#3B82F6" strokeWidth="2" />
          <circle cx="200" cy="130" r="44" fill="#14B8A6" fillOpacity="0.35" stroke="#5EEAD4" strokeWidth="2" />
          <path d="M 60 130 L 340 130 M 200 30 L 200 230" stroke="#C9A24B" strokeOpacity="0.35" strokeDasharray="4 4" />
          <text x="200" y="242" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
            CLINICAL DIAGNOSTIC SCHEMATIC ({pattern.toUpperCase()})
          </text>
        </svg>
      );
  }
};

export const HistopathologyLab: React.FC<HistopathologyLabProps> = ({ slides }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [compareMode, setCompareMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(
    slides[0]?.markers[0]?.id || null
  );

  React.useEffect(() => {
    setActiveSlideIdx(0);
    setCompareMode(false);
    setZoom(1);
    setActiveMarkerId(slides[0]?.markers[0]?.id || null);
  }, [slides]);

  const activeSlide = slides[activeSlideIdx] || slides[0];
  if (!activeSlide) return null;

  const activeMarker =
    activeSlide.markers.find((m) => m.id === activeMarkerId) || activeSlide.markers[0];

  const renderSlideFrame = (slide: HistopathSlide, allowMarkers: boolean) => (
    <div className="relative rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#0B1220] overflow-hidden">
      <div
        className="relative aspect-[16/10] transition-transform duration-200 origin-center"
        style={{ transform: `scale(${allowMarkers ? zoom : 1})` }}
      >
        <PatternVisualSvg pattern={slide.pattern} />
        {allowMarkers &&
          slide.markers.map((m, idx) => {
            const selected = activeMarker?.id === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMarkerId(m.id)}
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                aria-label={`Inspect landmark ${idx + 1}: ${m.label}`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center border-2 transition-transform cursor-pointer ${
                  selected
                    ? 'bg-[#C9A24B] text-[#0B1F4D] border-white scale-115 shadow-lg'
                    : 'bg-[#1B3A8C] text-white border-[#93C5FD] hover:scale-110'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
      </div>
      <div className="px-3 py-2 bg-[#111827] border-t border-white/10 flex items-center justify-between gap-2 text-xs text-slate-200">
        <span className="font-semibold truncate">{slide.title}</span>
        <span className="font-mono text-[11px] text-[#E4C16E] shrink-0">{slide.modality}</span>
      </div>
    </div>
  );

  return (
    <section
      id="section-histopathology"
      aria-labelledby="histo-heading"
      className="rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 sm:p-6 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#1B3A8C] dark:text-[#3B82F6]">
            <Microscope className="w-3.5 h-3.5" />
            Section 07 • Histopathology & Imaging Lab
          </div>
          <h2 id="histo-heading" className="font-display text-xl sm:text-2xl font-bold text-[#0B1F4D] dark:text-white">
            Annotated Microscopic & Diagnostic Imaging Viewer
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {slides.length > 1 && (
            <button
              type="button"
              onClick={() => setCompareMode((c) => !c)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                compareMode
                  ? 'bg-[#C9A24B] text-[#0B1F4D] border-[#C9A24B]'
                  : 'bg-[#FAF8F3] dark:bg-[#0B1220] border-[#E6E8EC] dark:border-[#1F2937] text-[#0B1F4D] dark:text-slate-200'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              {compareMode ? 'Exit Comparator' : 'Side-by-Side Compare'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
            aria-label="Zoom out specimen"
            className="p-2 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs tabular-nums">{zoom.toFixed(2)}×</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2, +(z + 0.25).toFixed(2)))}
            aria-label="Zoom in specimen"
            className="p-2 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide tabs */}
      <div className="flex flex-wrap gap-2">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setActiveSlideIdx(idx);
              setActiveMarkerId(s.markers[0]?.id || null);
              setZoom(1);
            }}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
              idx === activeSlideIdx
                ? 'bg-[#1B3A8C] text-white border-[#1B3A8C] dark:bg-[#3B82F6]'
                : 'bg-[#FAF8F3] dark:bg-[#0B1220] border-[#E6E8EC] dark:border-[#1F2937] text-[#0B1F4D] dark:text-slate-200'
            }`}
          >
            {s.title} ({s.role})
          </button>
        ))}
      </div>

      {compareMode && slides.length > 1 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {renderSlideFrame(slides[0], true)}
          {renderSlideFrame(slides[1], false)}
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7">{renderSlideFrame(activeSlide, true)}</div>
          <div className="lg:col-span-5 rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] p-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#1B3A8C] dark:text-[#38BDF8]">
              {activeSlide.role} • {activeSlide.modality}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeSlide.summary}
            </p>
            <div className="rounded-lg bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] p-3 text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-[#0B1F4D] dark:text-white">Clinical Correlation:</strong>{' '}
              {activeSlide.clinicalCorrelation}
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Interactive Landmarks ({activeSlide.markers.length})
              </div>
              <div className="space-y-1.5">
                {activeSlide.markers.map((m, idx) => {
                  const selected = activeMarker?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveMarkerId(m.id)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#1B3A8C] text-white border-[#1B3A8C] dark:bg-[#3B82F6]'
                          : 'bg-white dark:bg-[#111827] border-[#E6E8EC] dark:border-[#1F2937] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold">
                        {idx + 1}. {m.label}
                      </div>
                      <div className={`mt-0.5 ${selected ? 'text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {m.detail}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
