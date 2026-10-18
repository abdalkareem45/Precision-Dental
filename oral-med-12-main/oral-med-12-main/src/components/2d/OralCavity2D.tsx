import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CircleHelp, Map, MousePointer2 } from 'lucide-react';
import { DiseaseId } from '../../types';
import { DISEASES_DATA } from '../../data/lectureData';

interface OralCavity2DProps {
  selectedDisease?: DiseaseId | null;
  onSelectDisease?: (diseaseId: DiseaseId) => void;
  isInteractive?: boolean;
}

type RegionId = 'palate' | 'fauces' | 'tongue' | 'gingiva' | 'lips';

interface Region {
  id: RegionId;
  label: string;
  detail: string;
  disease?: DiseaseId;
  path: string;
  labelPosition: [number, number];
}

const REGIONS: Region[] = [
  {
    id: 'palate',
    label: 'Hard palate',
    detail: 'Keratinized masticatory mucosa',
    disease: 'coxsackie',
    path: 'M170 75 Q260 30 350 75 Q330 112 260 118 Q190 112 170 75Z',
    labelPosition: [260, 77],
  },
  {
    id: 'fauces',
    label: 'Soft palate & fauces',
    detail: 'Posterior oral cavity and tonsillar pillars',
    disease: 'coxsackie',
    path: 'M350 75 Q420 60 464 106 Q430 139 365 126 Q345 105 350 75Z',
    labelPosition: [406, 100],
  },
  {
    id: 'tongue',
    label: 'Tongue & floor',
    detail: 'Specialized mucosa with lingual neurovascular supply',
    disease: 'cmv',
    path: 'M190 154 Q260 115 350 145 Q405 170 390 237 Q370 277 280 267 Q196 262 170 218 Q158 182 190 154Z',
    labelPosition: [280, 195],
  },
  {
    id: 'gingiva',
    label: 'Gingival margin',
    detail: 'Attached gingiva and interdental papillae',
    disease: 'nug',
    path: 'M119 127 Q260 90 421 128 L410 151 Q260 120 130 153Z M130 238 Q260 272 410 236 L421 260 Q260 306 119 260Z',
    labelPosition: [88, 195],
  },
  {
    id: 'lips',
    label: 'Lips & labial mucosa',
    detail: 'Vermilion transition zone',
    disease: 'em',
    path: 'M75 116 Q260 20 445 116 Q420 137 390 144 Q260 95 130 144 Q100 137 75 116Z M75 271 Q260 365 445 271 Q420 249 390 242 Q260 292 130 242 Q100 249 75 271Z',
    labelPosition: [260, 336],
  },
];

const diseaseShortNames: Record<DiseaseId, string> = {
  cmv: 'CMV',
  coxsackie: 'Coxsackie',
  nug: 'NUG / NUP',
  em: 'EM',
  'sjs-ten': 'SJS / TEN',
  pcs: 'PCS',
  hsv: 'HSV',
  vzv: 'VZV',
};

export const OralCavity2D: React.FC<OralCavity2DProps> = ({
  selectedDisease = null,
  onSelectDisease,
  isInteractive = true,
}) => {
  const [activeRegion, setActiveRegion] = useState<RegionId>('tongue');
  const currentRegion = useMemo(
    () => REGIONS.find((region) => region.id === activeRegion) ?? REGIONS[2],
    [activeRegion],
  );
  const activeDisease = currentRegion.disease ? DISEASES_DATA[currentRegion.disease] : null;

  const selectRegion = (region: Region) => {
    if (!isInteractive) return;
    setActiveRegion(region.id);
    if (region.disease && onSelectDisease) onSelectDisease(region.disease);
  };

  return (
    <section className="relative min-h-[640px] overflow-hidden rounded-2xl border border-brand-blue/40 bg-brand-navy shadow-2xl sm:h-full sm:min-h-0">
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-gold">
            <Map className="h-3.5 w-3.5" />
            2D anatomical hub
          </div>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-white sm:text-xl">Oral cavity disease map</h2>
          <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-white/65">Select a tissue region to open its linked clinical module.</p>
        </div>
        <div className="hidden items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] text-white/65 sm:flex">
          <MousePointer2 className="h-3.5 w-3.5 text-brand-gold" />
          Click a region
        </div>
      </div>

      <div className="grid min-h-[640px] grid-cols-1 gap-3 pt-24 sm:h-full sm:min-h-0 sm:grid-cols-[1fr_190px] sm:pt-20">
        <div className="flex min-h-0 items-center justify-center px-3 pb-3 sm:px-5">
          <svg viewBox="0 0 520 380" className="max-h-[340px] w-full max-w-[520px]" role="img" aria-label="Interactive diagram of the oral cavity">
            <defs>
              <radialGradient id="oral-cavity" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#3f0718" />
                <stop offset="100%" stopColor="#19030c" />
              </radialGradient>
              <filter id="map-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <ellipse cx="260" cy="194" rx="205" ry="145" fill="url(#oral-cavity)" stroke="#7f1d4b" strokeWidth="3" />
            <ellipse cx="260" cy="194" rx="184" ry="124" fill="none" stroke="#be123c" strokeDasharray="3 8" opacity="0.55" />
            {REGIONS.map((region) => {
              const isActive = activeRegion === region.id;
              const isSelectedDisease = selectedDisease && region.disease === selectedDisease;
              return (
                <g key={region.id} onClick={() => selectRegion(region)} onMouseEnter={() => isInteractive && setActiveRegion(region.id)} className={isInteractive ? 'cursor-pointer' : ''}>
                  <path
                    d={region.path}
                    fill={isActive ? '#f43f5e' : '#fb7185'}
                    fillOpacity={isActive ? 0.42 : 0.18}
                    stroke={isSelectedDisease || isActive ? '#fda4af' : '#be123c'}
                    strokeWidth={isActive ? 3 : 1.5}
                    filter={isActive ? 'url(#map-glow)' : undefined}
                    className="transition-all duration-200"
                  />
                  <text x={region.labelPosition[0]} y={region.labelPosition[1]} textAnchor="middle" fill={isActive ? '#fff1f2' : '#fda4af'} fontSize="11" fontWeight={isActive ? '700' : '500'}>
                    {region.label}
                  </text>
                </g>
              );
            })}
            <path d="M198 135 Q260 158 322 135" fill="none" stroke="#f8fafc" strokeWidth="13" strokeLinecap="round" opacity="0.92" />
            <path d="M198 249 Q260 226 322 249" fill="none" stroke="#f8fafc" strokeWidth="13" strokeLinecap="round" opacity="0.92" />
            <text x="260" y="185" textAnchor="middle" fill="#fecdd3" fontSize="9" fontFamily="monospace" letterSpacing="1">ANTERIOR VIEW</text>
            <text x="260" y="198" textAnchor="middle" fill="#881337" fontSize="8" fontFamily="monospace">oral mucosal field</text>
          </svg>
        </div>

        <aside className="m-3 mt-0 flex flex-col justify-between rounded-xl border border-white/15 bg-white/10 p-3 sm:m-3 sm:ml-0 sm:mt-0">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">Region focus</span>
              <CircleHelp className="h-3.5 w-3.5 text-white/40" />
            </div>
            <h3 className="text-sm font-bold text-white">{currentRegion.label}</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-white/65">{currentRegion.detail}</p>
            {activeDisease && currentRegion.disease && (
              <div className="mt-4 border-t border-slate-800 pt-3">
                <span className="text-[10px] font-mono uppercase text-brand-gold">Linked module</span>
                <p className="mt-1 text-xs font-semibold" style={{ color: activeDisease.color }}>{diseaseShortNames[currentRegion.disease]}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-white/50">{activeDisease.title}</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500">
            <ArrowUpRight className="h-3.5 w-3.5 text-brand-gold" />
            Click to launch module
          </div>
        </aside>
      </div>
    </section>
  );
};