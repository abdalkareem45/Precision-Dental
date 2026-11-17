import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

interface OpgLandmark {
  id: string;
  name: string;
  region: 'Maxilla & Midface' | 'Mandible';
  x: number;
  y: number;
  xMirror?: number;
  note: string;
}

const LANDMARKS: OpgLandmark[] = [
  { id: 'ethmoid', name: 'Ethmoid sinus', region: 'Maxilla & Midface', x: 242, y: 52, xMirror: 278, note: 'Paired air cells superior to the nasal cavity and medial to the orbits.' },
  { id: 'nasal-cavity', name: 'Nasal cavity', region: 'Maxilla & Midface', x: 260, y: 68, note: 'Radiolucent paired airway cavities bisected centrally by the nasal septum.' },
  { id: 'orbital-floor', name: 'Orbital floor', region: 'Maxilla & Midface', x: 186, y: 60, xMirror: 334, note: 'Corticated radiopaque rim separating the orbit above from the maxillary sinus below.' },
  { id: 'pterygomaxillary', name: 'Pterygomaxillary fissure', region: 'Maxilla & Midface', x: 138, y: 76, xMirror: 382, note: 'Inverted teardrop radiolucency posterior to the maxillary tuberosity.' },
  { id: 'hard-palate', name: 'Hard palate', region: 'Maxilla & Midface', x: 192, y: 108, xMirror: 328, note: 'Horizontal radiopaque band forming the floor of the nasal cavity above maxillary apices.' },
  { id: 'nasal-septum', name: 'Nasal septum', region: 'Maxilla & Midface', x: 260, y: 84, note: 'Midline vertical radiopaque partition dividing left and right nasal cavities.' },
  { id: 'ans', name: 'Anterior nasal spine (ANS)', region: 'Maxilla & Midface', x: 260, y: 112, note: 'Midline V-shaped radiopaque projection at the inferior border of the nasal septum.' },
  { id: 'max-sinus', name: 'Maxillary sinus', region: 'Maxilla & Midface', x: 162, y: 92, xMirror: 358, note: 'Compare right vs. left; reduced sinus size relates to mouth breathing and maxillary collapse.' },
  { id: 'condyle', name: 'Condyle', region: 'Mandible', x: 64, y: 108, xMirror: 456, note: 'OPG provides a sharp profile view of the condyle and articular eminence.' },
  { id: 'neck', name: 'Condylar neck', region: 'Mandible', x: 70, y: 136, xMirror: 450, note: 'Check continuity for subcondylar fractures and symmetry between right and left.' },
  { id: 'coronoid', name: 'Coronoid process', region: 'Mandible', x: 112, y: 124, xMirror: 408, note: 'Triangular anterior projection of the ramus where temporalis inserts.' },
  { id: 'ext-oblique', name: 'External oblique ridge', region: 'Mandible', x: 128, y: 182, xMirror: 392, note: 'Dense cortical line extending downward and forward from the anterior border of the ramus.' },
  { id: 'ramus', name: 'Ramus', region: 'Mandible', x: 88, y: 175, xMirror: 432, note: 'Assess height, width, and symmetry on right vs. left sides.' },
  { id: 'angle', name: 'Angle of mandible', region: 'Mandible', x: 88, y: 232, xMirror: 432, note: 'Continuous lower cortical border from right condyle to left condyle.' },
  { id: 'mand-canal', name: 'Mandibular canal', region: 'Mandible', x: 134, y: 222, xMirror: 386, note: 'Radiolucent canal bordered by two thin radiopaque lines leading to the mental foramen.' },
  { id: 'mental-foramen', name: 'Mental foramen', region: 'Mandible', x: 194, y: 236, xMirror: 326, note: 'Round/oval radiolucency near premolar apices—do not mistake for periapical pathology.' },
  { id: 'mental-triangle', name: 'Mental triangle (protuberance)', region: 'Mandible', x: 260, y: 248, note: 'Triangular midline radiopacity at the anterior inferior chin.' },
  { id: 'symphysis', name: 'Symphysis', region: 'Mandible', x: 260, y: 262, note: 'Midline lower mandibular border; note lower incisors here often suffer distortion/overlap.' },
];

export function Opg2DAnatomySandbox() {
  const [regionFilter, setRegionFilter] = useState<'All' | 'Maxilla & Midface' | 'Mandible'>('All');
  const [selectedId, setSelectedId] = useState<string>('condyle');

  const visibleLandmarks =
    regionFilter === 'All' ? LANDMARKS : LANDMARKS.filter((l) => l.region === regionFilter);
  const active = visibleLandmarks.find((landmark) => landmark.id === selectedId) ?? visibleLandmarks[0];

  const handleReset = () => {
    setRegionFilter('All');
    setSelectedId('condyle');
  };

  return (
    <SandboxShell
      id="lec6-2d-anatomy"
      kind="2D Sandbox"
      title="Interactive 18-Landmark OPG Bony Outline Explorer (Fig. 8)"
      instruction="Filter by Maxilla or Mandible and click any landmark to illuminate it bilaterally"
      onReset={handleReset}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Maxilla & Midface', 'Mandible'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRegionFilter(r);
                  const nextLandmarks = r === 'All' ? LANDMARKS : LANDMARKS.filter((landmark) => landmark.region === r);
                  if (!nextLandmarks.some((landmark) => landmark.id === selectedId)) {
                    setSelectedId(nextLandmarks[0].id);
                  }
                }}
                aria-pressed={regionFilter === r}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  regionFilter === r
                    ? 'bg-[#1B3A8C] border-[#1B3A8C] text-white'
                    : 'bg-[#FAF8F3] border-[#E6E8EC] text-[#0B1F4D] hover:border-[#1B3A8C]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <span className="text-xs font-medium text-[#64748B] tabular-nums">
            Showing {visibleLandmarks.length} of 18 structures
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Interactive Fig. 8 Bony Outline Diagram */}
          <div className="lg:col-span-7 bg-[#0B1F4D] rounded-xl p-4">
            <svg
              viewBox="0 0 520 290"
              className="w-full h-auto"
              role="group"
              aria-label="Schematic bony outline of orthopantomogram landmarks"
            >
              {/* Maxillary & Midfacial outline */}
              <path
                d="M135,54 Q175,46 218,56 L246,42 L260,54 L274,42 L302,56 Q345,46 385,54 L392,102 Q362,120 330,114 L260,116 L190,114 Q158,120 128,102 Z"
                fill="#1E293B"
                stroke="#94A3B8"
                strokeWidth="1.8"
              />
              {/* Nasal cavity + septum + sinuses */}
              <line x1="260" y1="48" x2="260" y2="115" stroke="#CBD5E1" strokeWidth="2" />
              <ellipse cx="164" cy="90" rx="26" ry="18" fill="#0F172A" stroke="#64748B" strokeWidth="1.4" />
              <ellipse cx="356" cy="90" rx="26" ry="18" fill="#0F172A" stroke="#64748B" strokeWidth="1.4" />

              {/* Mandibular Bony Outline (Condyles -> Ramus -> Angle -> Body -> Symphysis) */}
              <path
                d="M56,112 C56,96 74,96 78,112 L84,142 L108,120 L122,155 L140,185 L380,185 L398,155 L412,120 L436,142 L442,112 C446,96 464,96 464,112 L456,225 Q450,256 410,258 L260,268 L110,258 Q70,256 64,225 Z"
                fill="#1E293B"
                stroke="#E2E8F0"
                strokeWidth="2.2"
              />

              {/* Mandibular canals + Mental foramina */}
              <path d="M88,180 Q118,225 194,236" fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="4 3" />
              <path d="M432,180 Q402,225 326,236" fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="194" cy="236" r="4.5" fill="#0F172A" stroke="#94A3B8" strokeWidth="1.4" />
              <circle cx="326" cy="236" r="4.5" fill="#0F172A" stroke="#94A3B8" strokeWidth="1.4" />
              {/* Mental triangle */}
              <path d="M260,235 L246,258 L274,258 Z" fill="none" stroke="#94A3B8" strokeWidth="1.4" />

              {/* Simplified Dental Arches */}
              {Array.from({ length: 14 }).map((_, i) => {
                const x = 148 + i * 16.5;
                return (
                  <g key={i}>
                    <rect x={x - 5} y="116" width="10" height="22" rx="3" fill="#CBD5E1" fillOpacity="0.65" />
                    <rect x={x - 5} y="158" width="10" height="24" rx="3" fill="#CBD5E1" fillOpacity="0.65" />
                  </g>
                );
              })}

              <text x="16" y="274" fontSize="11" fontWeight="700" fill="#94A3B8">R</text>
              <text x="496" y="274" fontSize="11" fontWeight="700" fill="#94A3B8">L</text>

              {/* Landmark Hotspots */}
              {visibleLandmarks.map((lm) => {
                const isSelected = lm.id === selectedId;
                return (
                  <g
                    key={lm.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedId(lm.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={lm.name}
                    aria-pressed={isSelected}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedId(lm.id);
                      }
                    }}
                  >
                    <circle
                      cx={lm.x}
                      cy={lm.y}
                      r={isSelected ? 7.5 : 4.8}
                      fill={isSelected ? '#C9A24B' : '#1B3A8C'}
                      stroke="#FAF8F3"
                      strokeWidth="1.6"
                    />
                    {lm.xMirror && (
                      <circle
                        cx={lm.xMirror}
                        cy={lm.y}
                        r={isSelected ? 7.5 : 4.8}
                        fill={isSelected ? '#C9A24B' : '#1B3A8C'}
                        stroke="#FAF8F3"
                        strokeWidth="1.6"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Landmark List & Details */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC]">
              <p className="text-[11px] font-bold text-[#8A691B]">{active.region}</p>
              <h4 className="text-base font-bold text-[#0B1F4D] mt-0.5">{active.name}</h4>
              <p className="text-xs sm:text-sm text-[#334155] mt-1.5 leading-relaxed">{active.note}</p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
              {visibleLandmarks.map((lm) => (
                <button
                  key={lm.id}
                  type="button"
                  onClick={() => setSelectedId(lm.id)}
                  aria-pressed={lm.id === selectedId}
                  className={`text-left px-2.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer truncate ${
                    lm.id === selectedId
                      ? 'bg-[#1B3A8C] text-white border-[#1B3A8C]'
                      : 'bg-[#FAF8F3] text-[#0B1F4D] border-[#E6E8EC] hover:border-[#1B3A8C]'
                  }`}
                >
                  {lm.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
