import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SandboxShell } from '../../common/SandboxShell';

interface OpgStep {
  step: number;
  title: string;
  checklist: string;
  highlightZone: 'mandible-outline' | 'cortex-canals' | 'maxilla-sinus' | 'symmetry' | 'teeth' | 'third-molars' | 'soft-tissue';
}

const OPG_STEPS: OpgStep[] = [
  {
    step: 1,
    title: 'Mandibular Bony Outline (R → L)',
    checklist:
      'Trace the continuous mandibular bony outline starting from the right condylar head, down the posterior ramus, along the inferior border to the left condylar head.',
    highlightZone: 'mandible-outline',
  },
  {
    step: 2,
    title: 'Cortex, Canals, Foramina & Coronoid',
    checklist:
      'Note the thickness and density of the mandibular cortex, plus the mandibular canals, mental foramina, and both coronoid processes.',
    highlightZone: 'cortex-canals',
  },
  {
    step: 3,
    title: 'Maxillary Cortical Outline & Sinuses',
    checklist:
      'Start on the right side: check the hard palate with ANS, examine the nasal cavities and nasal septum, then compare right and left maxillary sinuses.',
    highlightZone: 'maxilla-sinus',
  },
  {
    step: 4,
    title: 'Discontinuity, Radiopacity & Symmetry',
    checklist:
      'Compare structural outlines for any cortical discontinuity, abnormal radiopacity or radiolucency, and overall orthodontic symmetry.',
    highlightZone: 'symmetry',
  },
  {
    step: 5,
    title: 'Evaluate All Teeth',
    checklist:
      'Check presence, stage of development, eruption/impaction, root morphology and position, caries, fractures, and contacts. Correlate clinically or with IOPAs/bitewings.',
    highlightZone: 'teeth',
  },
  {
    step: 6,
    title: 'Third Molar Development & Position',
    checklist:
      'Specifically document the presence, crypt calcification, angulation, and eruption space of all developing or impacted third molars.',
    highlightZone: 'third-molars',
  },
  {
    step: 7,
    title: 'Apparent Soft Tissue Structures',
    checklist:
      'Inspect soft tissue shadows (tongue dorsum, soft palate, airway spaces, earlobes) and distinguish normal anatomy from superimposed artifacts.',
    highlightZone: 'soft-tissue',
  },
];

export function Opg2DStepsSandbox() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const current = OPG_STEPS[activeStepIdx];

  const handleReset = () => setActiveStepIdx(0);

  return (
    <SandboxShell
      id="lec6-2d-steps"
      kind="2D Sandbox"
      title="7-Step Systematic OPG Interpretation Walkthrough"
      instruction="Step sequentially from Step 1 to Step 7 to build a zero-miss radiographic habit"
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-[#0B1F4D] rounded-xl p-4">
          <svg
            viewBox="0 0 500 265"
            className="w-full h-auto"
            role="img"
            aria-label={`OPG systematic interpretation Step ${current.step}: ${current.title}`}
          >
            {/* Midline Symmetry Guide */}
            <line
              x1="250"
              y1="15"
              x2="250"
              y2="250"
              stroke={current.highlightZone === 'symmetry' ? '#C9A24B' : '#334155'}
              strokeWidth={current.highlightZone === 'symmetry' ? 2.5 : 1}
              strokeDasharray="5 4"
            />

            {/* Soft Tissue Tongue/Airway Shadows */}
            <path
              d="M95,120 Q250,92 405,120 Q395,175 250,180 Q105,175 95,120 Z"
              fill={current.highlightZone === 'soft-tissue' ? '#C9A24B' : '#38BDF8'}
              fillOpacity={current.highlightZone === 'soft-tissue' ? 0.25 : 0.06}
              stroke={current.highlightZone === 'soft-tissue' ? '#C9A24B' : 'none'}
              strokeWidth="1.8"
            />

            {/* Maxilla & Sinuses */}
            <g
              stroke={current.highlightZone === 'maxilla-sinus' ? '#C9A24B' : '#64748B'}
              strokeWidth={current.highlightZone === 'maxilla-sinus' ? 2.8 : 1.4}
              fill="none"
            >
              <path d="M135,98 L365,98" />
              <line x1="250" y1="36" x2="250" y2="98" />
              <ellipse cx="162" cy="76" rx="25" ry="17" fill={current.highlightZone === 'maxilla-sinus' ? '#C9A24B' : 'none'} fillOpacity="0.18" />
              <ellipse cx="338" cy="76" rx="25" ry="17" fill={current.highlightZone === 'maxilla-sinus' ? '#C9A24B' : 'none'} fillOpacity="0.18" />
            </g>

            {/* Mandible Outline */}
            <path
              d="M62,96 C62,82 78,82 82,96 L88,132 L112,110 L126,158 L374,158 L388,110 L412,132 L418,96 C422,82 438,82 438,96 L432,208 Q426,236 385,238 L250,246 L115,238 Q74,236 68,208 Z"
              fill="none"
              stroke={current.highlightZone === 'mandible-outline' ? '#C9A24B' : '#CBD5E1'}
              strokeWidth={current.highlightZone === 'mandible-outline' ? 3.5 : 1.8}
            />

            {/* Canals & Mental Foramina */}
            <g
              stroke={current.highlightZone === 'cortex-canals' ? '#C9A24B' : '#475569'}
              strokeWidth={current.highlightZone === 'cortex-canals' ? 3 : 1.5}
              fill="none"
            >
              <path d="M90,165 Q122,208 188,216" strokeDasharray="4 3" />
              <path d="M410,165 Q378,208 312,216" strokeDasharray="4 3" />
              <circle cx="188" cy="216" r="5" fill={current.highlightZone === 'cortex-canals' ? '#C9A24B' : '#0B1F4D'} />
              <circle cx="312" cy="216" r="5" fill={current.highlightZone === 'cortex-canals' ? '#C9A24B' : '#0B1F4D'} />
            </g>

            {/* Teeth + 3rd Molars */}
            {Array.from({ length: 14 }).map((_, i) => {
              const x = 142 + i * 16.5;
              const isThirdMolarArea = i === 0 || i === 13;
              const highlightTeeth =
                current.highlightZone === 'teeth' ||
                (current.highlightZone === 'third-molars' && isThirdMolarArea);
              return (
                <g key={i}>
                  <rect
                    x={x - 5}
                    y="102"
                    width="10"
                    height="22"
                    rx="3"
                    fill={highlightTeeth ? '#C9A24B' : '#94A3B8'}
                    fillOpacity={highlightTeeth ? 0.9 : 0.45}
                  />
                  <rect
                    x={x - 5}
                    y="138"
                    width="10"
                    height="22"
                    rx="3"
                    fill={highlightTeeth ? '#C9A24B' : '#94A3B8'}
                    fillOpacity={highlightTeeth ? 0.9 : 0.45}
                  />
                </g>
              );
            })}

            <text x="18" y="24" fontSize="11" fontWeight="700" fill="#C9A24B">
              Step {current.step} / 7 · {current.title}
            </text>
            <text x="18" y="254" fontSize="10" fontWeight="700" fill="#94A3B8">R (Start)</text>
            <text x="454" y="254" fontSize="10" fontWeight="700" fill="#94A3B8">L</text>
          </svg>
        </div>

        {/* Step Navigation & Protocol Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {OPG_STEPS.map((st, idx) => (
              <button
                key={st.step}
                type="button"
                onClick={() => setActiveStepIdx(idx)}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition-colors cursor-pointer ${
                  idx === activeStepIdx
                    ? 'bg-[#1B3A8C] text-white border-[#1B3A8C]'
                    : 'bg-[#FAF8F3] text-[#0B1F4D] border-[#E6E8EC] hover:border-[#1B3A8C]'
                }`}
              >
                0{st.step}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-3">
            <p className="text-xs font-bold text-[#8A691B]">Step {current.step} of 7</p>
            <h4 className="text-base font-bold text-[#0B1F4D]">{current.title}</h4>
            <p className="text-sm text-[#334155] leading-relaxed">{current.checklist}</p>

            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={activeStepIdx === 0}
                onClick={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E6E8EC] text-[#0B1F4D] disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >
                <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                disabled={activeStepIdx === OPG_STEPS.length - 1}
                onClick={() => setActiveStepIdx((i) => Math.min(OPG_STEPS.length - 1, i + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1B3A8C] text-white disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
