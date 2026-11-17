import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

interface CephPoint {
  id: string;
  symbol: string;
  name: string;
  x: number;
  y: number;
  definition: string;
  pitfall: string;
}

const CEPH_POINTS: CephPoint[] = [
  {
    id: 'S',
    symbol: 'S',
    name: 'Sella',
    x: 112,
    y: 86,
    definition: 'Midpoint of the sella turcica.',
    pitfall: 'Always inspect sella turcica size first—enlargement may indicate pathology such as a pituitary tumor.',
  },
  {
    id: 'N',
    symbol: 'N',
    name: 'Nasion',
    x: 248,
    y: 74,
    definition: 'Most anterior point on the frontonasal suture.',
    pitfall: 'If difficult to locate, use the deepest concavity at the intersection of frontal and nasal bones. Variations shift SNA & SNB.',
  },
  {
    id: 'Po',
    symbol: 'Po',
    name: 'Porion',
    x: 74,
    y: 128,
    definition: 'Uppermost outermost point on the bony external auditory meatus.',
    pitfall: 'Often obscured by cephalostat ear rods; some advocate tracing mechanical porion instead.',
  },
  {
    id: 'Or',
    symbol: 'Or',
    name: 'Orbitale',
    x: 215,
    y: 128,
    definition: 'Most inferior anterior point on the margin of the orbit.',
    pitfall: 'Bilateral landmark (average left/right if not superimposed); tricky to locate radiographically.',
  },
  {
    id: 'PNS',
    symbol: 'PNS',
    name: 'Posterior Nasal Spine',
    x: 162,
    y: 166,
    definition: 'Tip of the posterior nasal spine of the maxilla, directly below the pterygomaxillary fissure.',
    pitfall: 'Frequently obscured by developing third molars.',
  },
  {
    id: 'ANS',
    symbol: 'ANS',
    name: 'Anterior Nasal Spine',
    x: 266,
    y: 168,
    definition: 'Tip of the anterior process of the maxilla at the lower margin of the nasal aperture.',
    pitfall: 'If ANS/PNS are hard to trace, a line parallel to the nasal floor can approximate the maxillary plane.',
  },
  {
    id: 'A',
    symbol: 'A',
    name: 'Point A (Subspinale)',
    x: 256,
    y: 188,
    definition: 'Point of deepest concavity on the anterior profile of the maxilla.',
    pitfall: 'Located on alveolar bone and liable to move with incisor root torque and growth.',
  },
  {
    id: 'B',
    symbol: 'B',
    name: 'Point B (Supramentale)',
    x: 242,
    y: 254,
    definition: 'Point of deepest concavity on the anterior surface of the mandible.',
    pitfall: 'Also located on alveolar bone and alters with lower incisor movement.',
  },
  {
    id: 'Pog',
    symbol: 'Pog',
    name: 'Pogonion',
    x: 248,
    y: 276,
    definition: 'Most anterior point on the mandibular symphysis.',
    pitfall: 'Key landmark for vertical incisor assessment lines (A-Pog and Facial Plane N-Pog).',
  },
  {
    id: 'Me',
    symbol: 'Me',
    name: 'Menton',
    x: 236,
    y: 292,
    definition: 'Lowest point on the mandibular symphysis.',
    pitfall: 'Anchors the anterior end of the Mandibular Plane (Go–Me) and Total Anterior Facial Height (N–Me).',
  },
  {
    id: 'Go',
    symbol: 'Go',
    name: 'Gonion',
    x: 92,
    y: 246,
    definition: 'Most posterior inferior point on the angle of the mandible.',
    pitfall: 'Constructed accurately by bisecting the angle formed by tangents to the posterior ramus and inferior mandibular border (Fig. 5).',
  },
];

type PlaneId = 'SN' | 'Frankfort' | 'Maxillary' | 'Mandibular' | 'FOP' | 'APog' | 'Facial';

const PLANES: {
  id: PlaneId;
  label: string;
  group: 'Horizontal' | 'Vertical';
  coords: [number, number, number, number];
  color: string;
  note: string;
}[] = [
  { id: 'SN', label: 'SN Line', group: 'Horizontal', coords: [112, 86, 248, 74], color: '#1B3A8C', note: 'Approximates the anterior cranial base.' },
  { id: 'Frankfort', label: 'Frankfort (Po–Or)', group: 'Horizontal', coords: [74, 128, 215, 128], color: '#0EA5E9', note: 'Harder to record accurately due to Po and Or identification variability.' },
  { id: 'Maxillary', label: 'Maxillary (ANS–PNS)', group: 'Horizontal', coords: [162, 166, 266, 168], color: '#C9A24B', note: 'Easier to locate than Frankfort; used in MMPA.' },
  { id: 'Mandibular', label: 'Mandibular (Go–Me)', group: 'Horizontal', coords: [92, 246, 236, 292], color: '#DC2626', note: 'Joins Gonion and Menton for vertical growth assessment.' },
  { id: 'FOP', label: 'Functional Occlusal (FOP)', group: 'Horizontal', coords: [164, 214, 250, 218], color: '#059669', note: 'Drawn through cusp tips of permanent molars and premolars (used in Wits’ analysis).' },
  { id: 'APog', label: 'A–Pog Line', group: 'Vertical', coords: [256, 188, 248, 276], color: '#7C3AED', note: 'Vertical reference line mainly for incisor position assessment.' },
  { id: 'Facial', label: 'Facial Plane (N–Pog)', group: 'Vertical', coords: [248, 74, 248, 276], color: '#D97706', note: 'Line from Nasion to Pogonion for anterior-posterior facial balance.' },
];

export function Ceph2DLandmarksSandbox() {
  const [selectedPointId, setSelectedPointId] = useState<string>('Go');
  const [activePlanes, setActivePlanes] = useState<PlaneId[]>(['SN', 'Maxillary', 'Mandibular']);
  const [showGoConstruction, setShowGoConstruction] = useState(true);

  const selectedPoint = CEPH_POINTS.find((p) => p.id === selectedPointId) ?? CEPH_POINTS[0];

  const togglePlane = (id: PlaneId) => {
    setActivePlanes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setSelectedPointId('Go');
    setActivePlanes(['SN', 'Maxillary', 'Mandibular']);
    setShowGoConstruction(true);
  };

  return (
    <SandboxShell
      id="lec5-2d-landmarks"
      kind="2D Sandbox"
      title="Cephalometric Landmarks (11 Points), Gonion Construction & Reference Planes"
      instruction="Click any anatomical point on the tracing and toggle reference planes"
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lateral Tracing SVG */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4">
          <svg
            viewBox="0 0 340 320"
            className="w-full h-auto max-h-95"
            role="group"
            aria-label="Lateral cephalometric tracing with 11 anatomical points and reference planes"
          >
            {/* Soft tissue profile outline */}
            <path
              d="M250,30 Q258,56 258,74 L286,144 Q290,154 276,160 L272,174 Q282,188 274,198 L268,214 Q276,226 266,238 L260,255 Q272,276 254,295 L220,305"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            {/* Cranial base + Sella turcica */}
            <path
              d="M52,102 Q72,78 98,82 Q105,98 118,98 Q128,98 128,80 L175,78 L248,74 L240,104 L215,128"
              fill="none"
              stroke="#0B1F4D"
              strokeWidth="2"
            />
            {/* Maxilla & Upper Incisor */}
            <path
              d="M162,166 L266,168 Q254,184 256,198 L246,204"
              fill="none"
              stroke="#0B1F4D"
              strokeWidth="2"
            />
            <path
              d="M248,194 Q260,214 256,226 Q244,218 242,196 Z"
              fill="#FFFFFF"
              stroke="#0B1F4D"
              strokeWidth="1.5"
            />
            {/* Mandible & Lower Incisor + Molar */}
            <path
              d="M78,136 L88,236 Q90,250 106,254 L236,292 Q256,288 250,268 Q240,252 246,234 L236,234 L230,262 Q216,272 214,252 L114,226 L104,148"
              fill="none"
              stroke="#0B1F4D"
              strokeWidth="2"
            />
            <path
              d="M236,238 Q244,216 248,212 Q252,226 242,246 Z"
              fill="#FFFFFF"
              stroke="#0B1F4D"
              strokeWidth="1.5"
            />
            {/* Molar outline */}
            <rect x="168" y="196" width="22" height="18" rx="4" fill="#FFFFFF" stroke="#475569" strokeWidth="1.2" />
            <rect x="170" y="216" width="22" height="18" rx="4" fill="#FFFFFF" stroke="#475569" strokeWidth="1.2" />

            {/* Fig. 5 Gonion Tangent Construction */}
            {showGoConstruction && (
              <g opacity="0.8">
                <line x1="76" y1="138" x2="96" y2="268" stroke="#C9A24B" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="68" y1="240" x2="246" y2="295" stroke="#C9A24B" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="92" y1="246" x2="72" y2="268" stroke="#DC2626" strokeWidth="1.5" />
              </g>
            )}

            {/* Active Reference Planes */}
            {PLANES.filter((p) => activePlanes.includes(p.id)).map((plane) => (
              <line
                key={plane.id}
                x1={plane.coords[0]}
                y1={plane.coords[1]}
                x2={plane.coords[2]}
                y2={plane.coords[3]}
                stroke={plane.color}
                strokeWidth="2.2"
              />
            ))}

            {/* 11 Interactive Landmark Points */}
            {CEPH_POINTS.map((pt) => {
              const isSelected = pt.id === selectedPointId;
              return (
                <g
                  key={pt.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedPointId(pt.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${pt.symbol}: ${pt.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPointId(pt.id);
                    }
                  }}
                >
                  {isSelected && (
                    <circle cx={pt.x} cy={pt.y} r="12" fill="#C9A24B" fillOpacity="0.28" stroke="#C9A24B" strokeWidth="1.8" />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 5.5 : 4.2}
                    fill={isSelected ? '#1B3A8C' : '#FFFFFF'}
                    stroke={isSelected ? '#C9A24B' : '#0B1F4D'}
                    strokeWidth="1.8"
                  />
                  <text
                    x={pt.x + 7}
                    y={pt.y - 5}
                    fontSize="10"
                    fontWeight="700"
                    fill={isSelected ? '#1B3A8C' : '#0B1F4D'}
                  >
                    {pt.symbol}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Controls & Landmark Detail */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <p className="text-xs font-bold text-[#0B1F4D] mb-2">11 Standard Landmarks</p>
            <div className="flex flex-wrap gap-1.5">
              {CEPH_POINTS.map((pt) => (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setSelectedPointId(pt.id)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                    pt.id === selectedPointId
                      ? 'bg-[#1B3A8C] text-white border-[#1B3A8C]'
                      : 'bg-[#FAF8F3] text-[#0B1F4D] border-[#E6E8EC] hover:border-[#1B3A8C]'
                  }`}
                >
                  <span className="font-mono">{pt.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0B1F4D]">
                {selectedPoint.symbol} — {selectedPoint.name}
              </h4>
              {selectedPoint.id === 'Go' && (
                <button
                  type="button"
                  onClick={() => setShowGoConstruction((s) => !s)}
                  className="text-[11px] font-semibold text-[#1B3A8C] underline cursor-pointer"
                >
                  {showGoConstruction ? 'Hide Fig. 5 Tangents' : 'Show Fig. 5 Tangents'}
                </button>
              )}
            </div>
            <p className="text-xs text-[#334155] leading-relaxed">{selectedPoint.definition}</p>
            <p className="text-xs text-[#8A691B] font-medium leading-relaxed">
              Tracing Note: {selectedPoint.pitfall}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-[#0B1F4D] mb-2">
              Toggle Horizontal &amp; Vertical Reference Lines
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PLANES.map((pl) => {
                const active = activePlanes.includes(pl.id);
                return (
                  <button
                    key={pl.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => togglePlane(pl.id)}
                    className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-2 ${
                      active
                        ? 'bg-white border-[#1B3A8C] text-[#0B1F4D]'
                        : 'bg-[#FAF8F3] border-[#E6E8EC] text-[#64748B]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-xs shrink-0"
                      style={{ backgroundColor: active ? pl.color : '#CBD5E1' }}
                      aria-hidden="true"
                    />
                    <span className="font-semibold truncate">{pl.label}</span>
                    <span className="ml-auto text-[10px] text-[#64748B]">{pl.group}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
