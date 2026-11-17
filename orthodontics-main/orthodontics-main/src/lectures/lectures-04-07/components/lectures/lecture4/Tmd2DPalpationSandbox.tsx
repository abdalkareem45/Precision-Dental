import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

type PalpationZoneId =
  | 'temporalis-ant'
  | 'temporalis-post'
  | 'masseter-sup'
  | 'masseter-inf'
  | 'tmj-closed'
  | 'tmj-open'
  | 'tmj-full';

interface PalpationZone {
  id: PalpationZoneId;
  figRef: string;
  title: string;
  anatomicalTarget: string;
  technique: string;
  clinicalNote: string;
  cx: number;
  cy: number;
  jawOpenDeg: number;
}

const ZONES: PalpationZone[] = [
  {
    id: 'temporalis-ant',
    figRef: 'Fig. 1A',
    title: 'Temporalis — Anterior Portion',
    anatomicalTarget: 'Anterior fibers above the zygomatic arch & lateral to the eyebrow/orbit.',
    technique:
      'Palpate bilaterally using the palmar surface of the middle finger, with index and ring fingers testing adjacent areas.',
    clinicalNote: 'Ascertain and record symmetry of tenderness; often tender in daytime clenchers.',
    cx: 215,
    cy: 112,
    jawOpenDeg: 0,
  },
  {
    id: 'temporalis-post',
    figRef: 'Fig. 1B',
    title: 'Temporalis — Posterior Portion',
    anatomicalTarget: 'Posterior fibers superior and posterior to the ear (auricle).',
    technique:
      'Apply gentle bilateral digital palpation over the temporal fossa posterior to the ear while mandible is at rest.',
    clinicalNote: 'Compare right and left sides simultaneously for myogenous pain or fatigue.',
    cx: 132,
    cy: 108,
    jawOpenDeg: 0,
  },
  {
    id: 'masseter-sup',
    figRef: 'Fig. 2A',
    title: 'Masseter — Superior Attachment',
    anatomicalTarget: 'Superior origin along the inferior border of the zygomatic arch anterior to the TMJ.',
    technique:
      'Bilateral middle-finger palmar palpation just inferior to the zygomatic arch.',
    clinicalNote: 'Ask patient to clench lightly to confirm muscle belly border, then relax to grade tenderness.',
    cx: 205,
    cy: 185,
    jawOpenDeg: 0,
  },
  {
    id: 'masseter-inf',
    figRef: 'Fig. 2B',
    title: 'Masseter — Inferior Mandibular Attachment',
    anatomicalTarget: 'Inferior insertion along the angle and lower border of the mandible.',
    technique:
      'Palpate bilaterally along the lower border of the ramus/angle with index, middle, and ring fingers.',
    clinicalNote: 'Commonly tender in sleep-related bruxism and protective muscle co-contraction.',
    cx: 192,
    cy: 236,
    jawOpenDeg: 4,
  },
  {
    id: 'tmj-closed',
    figRef: 'Fig. 3A',
    title: 'TMJ — Closed-Mouth Static Position',
    anatomicalTarget: 'Lateral aspect of both condylar poles immediately anterior to the tragus.',
    technique:
      'Place fingertips over lateral aspects of both joint areas simultaneously while teeth are lightly together.',
    clinicalNote: 'Record baseline static joint pain or tenderness before initiating mandibular movement.',
    cx: 158,
    cy: 162,
    jawOpenDeg: 0,
  },
  {
    id: 'tmj-open',
    figRef: 'Fig. 3B',
    title: 'TMJ — Dynamic Opening & Closing',
    anatomicalTarget: 'Lateral capsule as the condyle rotates and translates anteriorly.',
    technique:
      'Maintain fingertips over lateral poles while patient slowly opens and closes the mouth.',
    clinicalNote: 'Detect joint sounds (single short click vs. multiple gravel-like crepitation) and deviation.',
    cx: 166,
    cy: 166,
    jawOpenDeg: 18,
  },
  {
    id: 'tmj-full',
    figRef: 'Fig. 3C',
    title: 'TMJ — Fully Open Posterior Aspect',
    anatomicalTarget: 'Posterior aspect of the joint space behind the translated condyle.',
    technique:
      'With mouth fully open, slide the fingertip behind the condyle to palpate the posterior joint aspect.',
    clinicalNote: 'Evaluates retrodiscal tissue sensitivity when condyle translates maximally forward.',
    cx: 148,
    cy: 165,
    jawOpenDeg: 32,
  },
];

export function Tmd2DPalpationSandbox() {
  const [selectedId, setSelectedId] = useState<PalpationZoneId>('temporalis-ant');
  const active = ZONES.find((z) => z.id === selectedId) ?? ZONES[0];

  const handleReset = () => setSelectedId('temporalis-ant');

  return (
    <SandboxShell
      id="lec4-2d-palpation"
      kind="2D Sandbox"
      title="Interactive Muscle & TMJ Palpation Atlas (Figs. 1–3)"
      instruction="Click any anatomical palpation target or step through Figs. 1A–3C"
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Anatomical Head & Jaw SVG */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4">
          <svg
            viewBox="0 0 360 310"
            className="w-full h-auto max-h-85"
            role="group"
            aria-label="Lateral craniofacial diagram showing temporalis, masseter, and TMJ palpation sites"
          >
            {/* Cranial silhouette */}
            <path
              d="M115,270 C92,238 80,192 84,132 C88,68 135,34 196,36 C250,38 282,78 284,126 L296,154 L283,164 L284,180 L274,186 L278,200 L265,204 L268,218 L244,230"
              fill="#FFFFFF"
              stroke="#0B1F4D"
              strokeWidth="2"
            />
            {/* Zygomatic arch */}
            <path
              d="M158,158 Q205,152 246,162"
              fill="none"
              stroke="#64748B"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Temporalis muscle fan */}
            <path
              d="M126,136 Q128,74 185,68 Q228,68 232,126 Q210,145 186,162 Z"
              fill={selectedId.startsWith('temporalis') ? '#C9A24B' : '#1B3A8C'}
              fillOpacity={selectedId.startsWith('temporalis') ? 0.35 : 0.14}
              stroke="#1B3A8C"
              strokeWidth="1.2"
            />
            {/* Movable mandible outline */}
            <g transform={`rotate(${active.jawOpenDeg} 160 162)`}>
              <path
                d="M156,162 L162,226 Q162,248 184,250 L260,240 L264,218 L206,214 L196,174 Z"
                fill="#E6E8EC"
                fillOpacity="0.65"
                stroke="#0B1F4D"
                strokeWidth="1.8"
              />
              {/* Masseter muscle belly */}
              <path
                d="M174,170 L216,170 L210,236 L168,232 Z"
                fill={selectedId.startsWith('masseter') ? '#C9A24B' : '#DC2626'}
                fillOpacity={selectedId.startsWith('masseter') ? 0.42 : 0.18}
                stroke="#B91C1C"
                strokeWidth="1.2"
              />
            </g>

            {/* Ear / Tragus landmark */}
            <path
              d="M136,144 C126,144 124,178 138,184 C146,184 146,154 142,146 Z"
              fill="#FAF8F3"
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Interactive Palpation Hotspot Markers */}
            {ZONES.map((zone) => {
              const isSelected = zone.id === selectedId;
              return (
                <g
                  key={zone.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(zone.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${zone.figRef}: ${zone.title}`}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(zone.id);
                    }
                  }}
                >
                  {isSelected && (
                    <circle
                      cx={zone.cx}
                      cy={zone.cy}
                      r="17"
                      fill="#C9A24B"
                      fillOpacity="0.28"
                      stroke="#C9A24B"
                      strokeWidth="2"
                    />
                  )}
                  <circle
                    cx={zone.cx}
                    cy={zone.cy}
                    r={isSelected ? 8 : 6}
                    fill={isSelected ? '#1B3A8C' : '#FFFFFF'}
                    stroke={isSelected ? '#C9A24B' : '#1B3A8C'}
                    strokeWidth="2.5"
                  />
                  {/* Three-finger palpation cue around active point */}
                  {isSelected && (
                    <>
                      <circle cx={zone.cx - 12} cy={zone.cy - 6} r="3" fill="#1B3A8C" opacity="0.65" />
                      <circle cx={zone.cx + 12} cy={zone.cy + 6} r="3" fill="#1B3A8C" opacity="0.65" />
                    </>
                  )}
                </g>
              );
            })}

            <text x="16" y="294" fontSize="11" fill="#475569" fontWeight="600">
              Jaw Opening State: {active.jawOpenDeg === 0 ? 'Closed (Static)' : `${active.jawOpenDeg}° Open (Dynamic)`}
            </text>
          </svg>
        </div>

        {/* Right Selector & Technique Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ZONES.map((z) => {
              const isSelected = z.id === selectedId;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setSelectedId(z.id)}
                  className={`text-left px-3 py-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B3A8C] border-[#1B3A8C] text-white'
                      : 'bg-[#FAF8F3] border-[#E6E8EC] text-[#0B1F4D] hover:border-[#1B3A8C]'
                  }`}
                >
                  <span className={`font-mono font-bold mr-1.5 ${isSelected ? 'text-[#C9A24B]' : 'text-[#8A691B]'}`}>
                    {z.figRef}
                  </span>
                  <span className="font-semibold">{z.title}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-[#0B1F4D]">{active.title}</h4>
              <span className="font-mono text-xs font-bold text-[#1B3A8C]">{active.figRef}</span>
            </div>
            <p className="text-xs text-[#334155]">
              <strong className="text-[#0B1F4D]">Anatomical Target:</strong> {active.anatomicalTarget}
            </p>
            <p className="text-xs text-[#334155]">
              <strong className="text-[#0B1F4D]">Finger Placement:</strong> {active.technique}
            </p>
            <p className="text-xs text-[#334155]">
              <strong className="text-[#0B1F4D]">Clinical Interpretation:</strong> {active.clinicalNote}
            </p>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
