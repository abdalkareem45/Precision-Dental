import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import type { LectureId } from '../../types/lecture';
import {
  APEX_LOCATOR_GENERATIONS,
  NITI_GENERATIONS,
  PAIN_LADDER_STEPS,
  SEALER_FAMILIES,
} from '../../data/quizzesAndCases';

interface Lecture2DSandboxesProps {
  lectureId: LectureId;
  completedIds: string[];
  onComplete: (sandboxId: string) => void;
}

export const Lecture2DSandboxes: React.FC<Lecture2DSandboxesProps> = ({
  lectureId,
  completedIds,
  onComplete,
}) => {
  switch (lectureId) {
    case 'lecture-3':
      return <Lecture3TwoD completedIds={completedIds} onComplete={onComplete} />;
    case 'lecture-4':
      return <Lecture4TwoD completedIds={completedIds} onComplete={onComplete} />;
    case 'lecture-4b':
      return <Lecture4BTwoD completedIds={completedIds} onComplete={onComplete} />;
    case 'lecture-5':
      return <Lecture5TwoD completedIds={completedIds} onComplete={onComplete} />;
    case 'lecture-7':
      return <Lecture7TwoD completedIds={completedIds} onComplete={onComplete} />;
    case 'lecture-8':
      return <Lecture8TwoD completedIds={completedIds} onComplete={onComplete} />;
    case 'lecture-9':
      return <Lecture9TwoD completedIds={completedIds} onComplete={onComplete} />;
  }
};

const SandboxCardHeader: React.FC<{
  index: string;
  title: string;
  subtitle: string;
  done: boolean;
}> = ({ index, title, subtitle, done }) => (
  <div className="flex flex-wrap items-start justify-between gap-2 pb-3 mb-4 border-b border-[var(--pd-border)]">
    <div>
      <div className="text-xs font-semibold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)] tracking-wide">
        {index} · 2D Interactive Studio
      </div>
      <h4 className="text-base font-bold text-[var(--pd-text)] mt-0.5">{title}</h4>
      <p className="text-xs text-[var(--pd-text-muted)] mt-0.5">{subtitle}</p>
    </div>
    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--pd-text)]">
      <CheckCircle2
        className={`w-4 h-4 ${done ? 'text-emerald-600 [.endo-curriculum[data-endo-theme=dark]_&]:text-emerald-400' : 'text-[#0B1F4D]/25 [.endo-curriculum[data-endo-theme=dark]_&]:text-[#FAF8F3]/30'}`}
      />
      <span>{done ? 'Explored' : 'Interactive'}</span>
    </div>
  </div>
);

// ============================================================================
// LECTURE 3 — 2D SANDBOXES
// ============================================================================
const Lecture3TwoD: React.FC<{
  completedIds: string[];
  onComplete: (id: string) => void;
}> = ({ completedIds, onComplete }) => {
  const [selectedGen, setSelectedGen] = useState(5);
  const [wlStepsPicked, setWlStepsPicked] = useState<number[]>([]);
  const [stepFeedback, setStepFeedback] = useState<string | null>(null);

  const orderedSteps = [
    'Measure tooth on preoperative radiograph (initial measurement)',
    'Place exploring file inside canal 1 mm less than pre-op length',
    'Adjust rubber stopper onto a stable occlusal/incisal reference point',
    'Expose radiograph via bisecting angle or paralleling technique',
    'Measure difference between file tip & root end; adjust tooth length',
    'Subtract 1.0 mm subjectively for apical constriction (or 2.0 mm if external resorption)',
    'Set endodontic millimeter ruler to corrected working length',
  ];
  const displayOrder = [2, 0, 4, 1, 6, 3, 5];

  const handlePickStep = (idx: number) => {
    if (wlStepsPicked.includes(idx)) return;
    if (idx === wlStepsPicked.length) {
      setWlStepsPicked([...wlStepsPicked, idx]);
      if (wlStepsPicked.length + 1 === orderedSteps.length) onComplete('wl-sequence-builder');
      setStepFeedback(null);
    } else {
      setStepFeedback(`Out of order — select Step ${wlStepsPicked.length + 1} next.`);
    }
  };

  const gen = APEX_LOCATOR_GENERATIONS[selectedGen];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 2D-1: Apex Locator Generations Matrix */}
      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.1"
          title="Apex Locator Generations (1st–6th) Interactive Matrix"
          subtitle="Select a generation to inspect physics, fluid behavior, and clinical accuracy."
          done={completedIds.includes('wl-generations-matrix')}
        />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-4">
          {APEX_LOCATOR_GENERATIONS.map((g, i) => (
            <button
              key={g.gen}
              type="button"
              onClick={() => {
                setSelectedGen(i);
                onComplete('wl-generations-matrix');
              }}
              className={`px-2 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedGen === i
                  ? 'bg-[#1B3A8C] text-white border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                  : 'bg-[var(--pd-surface-inset)] text-[var(--pd-text)] border border-[var(--pd-border)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
              }`}
            >
              Gen {i + 1}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 space-y-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-[var(--pd-text)]">{gen.gen}</span>
            <span className="font-mono-tabular font-semibold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">{gen.yearOrBasis}</span>
          </div>
          <p className="text-[var(--pd-text)]/90">
            <strong>Mechanism:</strong> {gen.mechanism}
          </p>
          <p className="text-[var(--pd-text)]/90">
            <strong>With Electrolytes / Blood:</strong> {gen.fluidBehavior}
          </p>
          <p className="text-[var(--pd-text)]/90">
            <strong>In Dry Canals:</strong> {gen.dryBehavior}
          </p>
          <p className="text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)] font-medium">
            <strong>Clinical Key:</strong> {gen.limitationOrAdvantage}
          </p>
        </div>
      </div>

      {/* 2D-2: 7-Step Radiographic Sequence Builder */}
      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.2"
          title="Radiographic Working Length Sequence Builder"
          subtitle="Click the clinical steps in exact chronological order from pre-op film to ruler calibration."
          done={completedIds.includes('wl-sequence-builder')}
        />
        <div className="space-y-1.5">
          {displayOrder.map((stepIdx) => {
            const picked = wlStepsPicked.includes(stepIdx);
            const isNext = stepIdx === wlStepsPicked.length;
            return (
              <button
                key={stepIdx}
                type="button"
                onClick={() => handlePickStep(stepIdx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-colors flex items-center justify-between gap-2 ${
                  picked
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold [.endo-curriculum[data-endo-theme=dark]_&]:bg-emerald-950/60 [.endo-curriculum[data-endo-theme=dark]_&]:border-emerald-400/60 [.endo-curriculum[data-endo-theme=dark]_&]:text-emerald-100'
                    : 'bg-[var(--pd-surface-inset)] border-[var(--pd-border)] text-[var(--pd-text)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
                }`}
              >
                <span>{orderedSteps[stepIdx]}</span>
                <span className="font-mono-tabular text-[11px] shrink-0 text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">
                  {picked ? `Step ${stepIdx + 1}` : isNext ? 'Next?' : 'Select'}
                </span>
              </button>
            );
          })}
        </div>
        {stepFeedback && (
          <div role="status" className="mt-2 text-[11px] font-semibold text-amber-700 [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">
            {stepFeedback}
          </div>
        )}
        <div className="flex items-center justify-between mt-3 text-xs">
          <span className="font-mono-tabular text-[var(--pd-text-muted)]">
            Ordered: {wlStepsPicked.length} / {orderedSteps.length}
          </span>
          <button
            type="button"
            onClick={() => {
              setWlStepsPicked([]);
              setStepFeedback(null);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)] hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Sequence
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LECTURE 4 — 2D SANDBOXES
// ============================================================================
const Lecture4TwoD: React.FC<{
  completedIds: string[];
  onComplete: (id: string) => void;
}> = ({ completedIds, onComplete }) => {
  const [selectedZone, setSelectedZone] = useState<'black' | 'white' | 'creamy' | 'line'>('black');
  const [digitalTab, setDigitalTab] = useState<'ccd' | 'psp' | 'indirect' | 'bath'>('ccd');

  const zones = {
    black: {
      appearance: 'Black / Gray Area (Radiolucent)',
      findings: ['Decay (caries)', 'Pulp chamber & canal', 'Gingiva / interdental space', 'Periapical abscess', 'Periapical cyst'],
      shade: 'bg-slate-900 text-white',
    },
    white: {
      appearance: 'Bright White Area (Radiopaque)',
      findings: ['Enamel', 'Metallic restorations (amalgam, crowns)', 'Gutta-percha obturation'],
      shade: 'bg-slate-100 text-[#0B1F4D] border border-slate-300',
    },
    creamy: {
      appearance: 'Creamy White Area',
      findings: ['Dentin appears as a creamy white intermediate radiopacity'],
      shade: 'bg-amber-50 text-[#0B1F4D] border border-amber-200',
    },
    line: {
      appearance: 'Thin White Line Around Tooth',
      findings: ['Lamina dura surrounding the periodontal ligament space and root'],
      shade: 'bg-sky-50 text-[#0B1F4D] border border-sky-200',
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 2D-1: Radiographic Density Interpreter */}
      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.1"
          title="Radiographic Density & Anatomical Hotspot Interpreter"
          subtitle="Click each radiographic grayscale zone from Lecture 4 to review tentative diagnostic findings."
          done={completedIds.includes('rad-density-map')}
        />

        {/* Interactive SVG stylized molar periapical radiograph */}
        <div className="rounded-xl bg-[#071536] border border-[var(--pd-gold)]/25 p-4 mb-4 flex flex-col sm:flex-row gap-4 items-center">
          <svg viewBox="0 0 220 180" className="w-48 h-40 shrink-0 rounded-lg bg-slate-900 border border-slate-700" role="img" aria-label="Interactive stylized periapical radiograph">
            {/* Bone trabeculae */}
            <rect x="0" y="72" width="220" height="108" fill="#334155" opacity="0.55" />
            {/* Periapical radiolucency (black/gray) */}
            <circle
              cx="110"
              cy="148"
              r="24"
              fill="#020617"
              stroke={selectedZone === 'black' ? '#C9A24B' : '#475569'}
              strokeWidth="2"
              className="cursor-pointer"
              onClick={() => {
                setSelectedZone('black');
                onComplete('rad-density-map');
              }}
            />
            {/* Lamina dura white line */}
            <path
              d="M72 74 L84 142 M148 74 L136 142"
              stroke={selectedZone === 'line' ? '#C9A24B' : '#f8fafc'}
              strokeWidth="3.5"
              fill="none"
              className="cursor-pointer"
              onClick={() => {
                setSelectedZone('line');
                onComplete('rad-density-map');
              }}
            />
            {/* Creamy dentin body */}
            <path
              d="M78 46 L142 46 L133 140 L87 140 Z"
              fill="#cbd5e1"
              stroke={selectedZone === 'creamy' ? '#C9A24B' : 'none'}
              strokeWidth="2.5"
              className="cursor-pointer"
              onClick={() => {
                setSelectedZone('creamy');
                onComplete('rad-density-map');
              }}
            />
            {/* Enamel & GP radiopaque white */}
            <path
              d="M74 48 Q110 18 146 48 Z"
              fill="#f8fafc"
              stroke={selectedZone === 'white' ? '#C9A24B' : 'none'}
              strokeWidth="2.5"
              className="cursor-pointer"
              onClick={() => {
                setSelectedZone('white');
                onComplete('rad-density-map');
              }}
            />
            {/* Pulp space radiolucency */}
            <path
              d="M104 48 L116 48 L113 136 L107 136 Z"
              fill="#0f172a"
              className="cursor-pointer"
              onClick={() => {
                setSelectedZone('black');
                onComplete('rad-density-map');
              }}
            />
          </svg>

          <div className="flex-1 w-full space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  ['black', 'Black / Gray'],
                  ['white', 'Bright White'],
                  ['creamy', 'Creamy White'],
                  ['line', 'White Line'],
                ] as const
              ).map(([k, lbl]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setSelectedZone(k);
                    onComplete('rad-density-map');
                  }}
                  className={`px-2.5 py-1.5 rounded text-xs font-semibold text-left whitespace-nowrap shrink-0 ${
                    selectedZone === k ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C] text-white'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
            <div className={`rounded-lg p-3 text-xs ${zones[selectedZone].shade}`}>
              <div className="font-bold mb-1">{zones[selectedZone].appearance}</div>
              <ul className="list-disc pl-4 space-y-0.5">
                {zones[selectedZone].findings.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2D-2: Digital Systems & Automated Processing Comparator */}
      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.2"
          title="Digital Radiography & Rapid Bath Processing Comparator"
          subtitle="Compare Direct CCD, Storage Phosphor (PSP), Indirect scanning, and 100°F film processing."
          done={completedIds.includes('rad-digital-systems')}
        />
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(
            [
              ['ccd', 'Direct Digital (CCD)'],
              ['psp', 'Storage Phosphor (PSP)'],
              ['indirect', 'Indirect Digital'],
              ['bath', '100°F Automated Bath'],
            ] as const
          ).map(([k, lbl]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setDigitalTab(k);
                onComplete('rad-digital-systems');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                digitalTab === k
                  ? 'bg-[#1B3A8C] text-white border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                  : 'bg-[var(--pd-surface-inset)] text-[var(--pd-text)] border border-[var(--pd-border)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        {digitalTab === 'ccd' && (
          <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs space-y-2 text-[var(--pd-text)]/90">
            <div className="font-bold text-sm text-[var(--pd-text)]">Direct Digital System (CCD Sensor)</div>
            <p><strong>3 Components:</strong> Radio (fiber-optic shielded cold-sterilizable sensor with disposable sheath), Visio (monitor + processing unit), Graphy (high-resolution printer).</p>
            <p><strong>Advantages:</strong> Low radiation dose, instant image (no darkroom), consistent quality, digital zoom/enhancement, electronic archiving.</p>
            <p><strong>Disadvantages:</strong> Expensive, unfixed CCD lifespan, bulky wired sensor hard to position, large disk storage.</p>
          </div>
        )}
        {digitalTab === 'psp' && (
          <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs space-y-2 text-[var(--pd-text)]/90">
            <div className="font-bold text-sm text-[var(--pd-text)]">Storage Phosphor System (PSP Plates)</div>
            <p><strong>Mechanism:</strong> Photo-stimulable phosphor plate stores latent X-ray image for readout by an extra-oral laser scanner.</p>
            <p><strong>Advantages:</strong> 90% radiation reduction, almost instant (20–30 s), flexible film-like sizes, X-ray source can be remote from PC.</p>
            <p><strong>Disadvantages:</strong> Cost, limited lifespan of phosphoric plates, image storage demands.</p>
          </div>
        )}
        {digitalTab === 'indirect' && (
          <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs space-y-2 text-[var(--pd-text)]/90">
            <div className="font-bold text-sm text-[var(--pd-text)]">Indirect Digital System</div>
            <p>Uses a scanning device connected to a computer to digitize traditional silver halide dental radiographs after conventional chemical processing.</p>
          </div>
        )}
        {digitalTab === 'bath' && (
          <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs space-y-2 text-[var(--pd-text)]/90">
            <div className="font-bold text-sm text-[var(--pd-text)]">Quick Automated Film Processing (100°F Bath)</div>
            <div className="grid grid-cols-3 gap-2 font-mono-tabular text-center pt-1">
              <div className="p-2 rounded bg-[var(--pd-surface)] border border-[var(--pd-border)]">
                <div className="font-bold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">5–10 s</div>
                <div className="text-[11px]">Developer @ 100°F</div>
              </div>
              <div className="p-2 rounded bg-[var(--pd-surface)] border border-[var(--pd-border)]">
                <div className="font-bold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">Rinse</div>
                <div className="text-[11px]">Water Bath</div>
              </div>
              <div className="p-2 rounded bg-[var(--pd-surface)] border border-[var(--pd-border)]">
                <div className="font-bold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">15–20 s</div>
                <div className="text-[11px]">Fixer Until Clear</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// LECTURE 4B — 2D SANDBOXES
// ============================================================================
const Lecture4BTwoD: React.FC<{
  completedIds: string[];
  onComplete: (id: string) => void;
}> = ({ completedIds, onComplete }) => {
  const [groupIdx, setGroupIdx] = useState(0);
  const [rakeAngle, setRakeAngle] = useState(110); // >90 positive, 90 neutral, <90 negative

  const groups = [
    { name: 'Group I: Manual', detail: 'Barbed broaches, K-type (K-file, K-reamer, K-Flex, Flex-O, Flex-R), H-type (Hedström), S-file, Golden Mediums (12, 17, 22, 27, 32, 37), Canal Master U.' },
    { name: 'Group II: Low-Speed Latch', detail: 'Gates-Glidden (GG) burs & Peeso reamers. Straight coronal portion ONLY; never in curvatures. GG has lower lateral perforation risk than Peeso (post space).' },
    { name: 'Group III: Rotary NiTi', detail: 'Engine-driven nickel-titanium rotating blades that adapt to curved root canals.' },
    { name: 'Group IV: 3D Adapting', detail: 'Self-Adjusting File (SAF) — adapts longitudinally AND cross-sectionally.' },
    { name: 'Group V: Reciprocating', detail: 'Engine-driven reciprocating handpieces (e.g., Giromatic / Endo-eze).' },
    { name: 'Group VI: Ultrasonic', detail: 'Electromagnetic/piezoelectric activated files & tips (~25–30 kHz).' },
  ];

  const rakeClass =
    rakeAngle > 93
      ? { label: 'Positive Rake (Cutting)', desc: 'Obtuse angle with dentin tangent — efficient cutting (e.g., Hedström).' }
      : rakeAngle >= 87
      ? { label: 'Neutral Rake (90°)', desc: 'Perpendicular leading edge to radicular wall tangent.' }
      : { label: 'Negative Rake (Scraping)', desc: 'Acute angle with dentin tangent — scraping action (e.g., ProFile).' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.1"
          title="Groups I–VI Classification & Alloy Explorer"
          subtitle="Inspect all six intracanal instrument groups and stainless-steel vs. NiTi properties."
          done={completedIds.includes('inst1-groups-matrix')}
        />
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {groups.map((g, i) => (
            <button
              key={g.name}
              type="button"
              onClick={() => {
                setGroupIdx(i);
                onComplete('inst1-groups-matrix');
              }}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                groupIdx === i
                  ? 'bg-[#1B3A8C] text-white border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                  : 'bg-[var(--pd-surface-inset)] text-[var(--pd-text)] border border-[var(--pd-border)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
              }`}
            >
              Group {['I', 'II', 'III', 'IV', 'V', 'VI'][i]}
            </button>
          ))}
        </div>
        <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs space-y-2">
          <div className="font-bold text-sm text-[var(--pd-text)]">{groups[groupIdx].name}</div>
          <p className="text-[var(--pd-text)]/90 leading-relaxed">{groups[groupIdx].detail}</p>
          <p className="text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)] font-medium">
            Alloys: Hand files & GG/Peeso burs are primarily Stainless Steel (inexpensive); rotary files use Nickel-Titanium for elastic flexibility & corrosion resistance.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.2"
          title="Interactive Rake Angle & Dentin Tangent Simulator"
          subtitle="Adjust the angle between the leading edge and dentin wall tangent."
          done={completedIds.includes('inst1-rake-diagram')}
        />
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium text-[var(--pd-text)]">Angle with Dentin Tangent</span>
          <span className="font-mono-tabular font-bold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">{rakeAngle}° · {rakeClass.label}</span>
        </div>
        <input
          type="range"
          min={55}
          max={125}
          value={rakeAngle}
          onChange={(e) => {
            setRakeAngle(Number(e.target.value));
            onComplete('inst1-rake-diagram');
          }}
          className="w-full accent-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:accent-[#C9A24B] mb-3"
          aria-label="Rake angle in degrees"
        />
        <div className="rounded-xl bg-[#071536] border border-[var(--pd-gold)]/25 p-4 flex items-center gap-4 text-white">
          <svg viewBox="0 0 120 90" className="w-28 h-24 shrink-0" role="img" aria-label="Rake angle geometry diagram">
            <line x1="10" y1="70" x2="110" y2="70" stroke="#E6E8EC" strokeWidth="3" />
            <line
              x1="60"
              y1="70"
              x2={60 + Math.cos((rakeAngle * Math.PI) / 180) * 48}
              y2={70 - Math.sin((rakeAngle * Math.PI) / 180) * 48}
              stroke="#C9A24B"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="60" cy="70" r="4" fill="#38bdf8" />
          </svg>
          <div className="text-xs space-y-1">
            <div className="font-bold text-[var(--pd-gold)]">{rakeClass.label}</div>
            <p className="text-[#E6E8EC] leading-snug">{rakeClass.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LECTURE 5 — 2D SANDBOXES
// ============================================================================
const Lecture5TwoD: React.FC<{
  completedIds: string[];
  onComplete: (id: string) => void;
}> = ({ completedIds, onComplete }) => {
  const [genIdx, setGenIdx] = useState(0);
  const [fileCode, setFileCode] = useState<'S1' | 'S2' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5'>('F1');

  const protaperSpecs = {
    S1: { tip: '0.185 mm', taper: 'Increasing coronally (1.2 mm @ D14)', role: 'Shaping coronal/middle third (14 mm blades)' },
    S2: { tip: '0.20 mm', taper: 'Increasing coronally (1.1 mm @ D14)', role: 'Shaping middle third (14 mm blades)' },
    F1: { tip: '0.20 mm', taper: '0.07 apical taper (D0–D3)', role: 'Finishing apical third (Yellow)' },
    F2: { tip: '0.25 mm', taper: '0.08 apical taper (D0–D3)', role: 'Finishing apical third (Red)' },
    F3: { tip: '0.30 mm', taper: '0.09 apical taper (relieved cross-section)', role: 'Finishing apical third (Blue)' },
    F4: { tip: '0.40 mm', taper: '0.05 apical taper (relieved cross-section)', role: 'Large canal finishing' },
    F5: { tip: '0.50 mm', taper: '0.04 apical taper (relieved cross-section)', role: 'Wide canal finishing' },
  }[fileCode];

  const gen = NITI_GENERATIONS[genIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.1"
          title="Six Generations of NiTi Metallurgy Timeline"
          subtitle="Trace the metallurgical and geometric evolution from 1990s radial lands to Vortex Blue."
          done={completedIds.includes('inst2-niti-generations')}
        />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-4">
          {NITI_GENERATIONS.map((g, i) => (
            <button
              key={g.gen}
              type="button"
              onClick={() => {
                setGenIdx(i);
                onComplete('inst2-niti-generations');
              }}
              className={`px-2 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                genIdx === i
                  ? 'bg-[#1B3A8C] text-white border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                  : 'bg-[var(--pd-surface-inset)] text-[var(--pd-text)] border border-[var(--pd-border)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
              }`}
            >
              Gen {g.gen}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs space-y-2 text-[var(--pd-text)]/90">
          <div className="flex justify-between gap-2">
            <span className="font-bold text-sm text-[var(--pd-text)]">{gen.title}</span>
            <span className="font-mono-tabular font-semibold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">{gen.era}</span>
          </div>
          <p>{gen.keyFeature}</p>
          <p><strong>Examples:</strong> {gen.examples}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div>
              <div className="font-semibold text-emerald-700 [.endo-curriculum[data-endo-theme=dark]_&]:text-emerald-400 mb-1">Advantages</div>
              <ul className="list-disc pl-4 space-y-0.5">
                {gen.advantages.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-rose-700 [.endo-curriculum[data-endo-theme=dark]_&]:text-rose-400 mb-1">Disadvantages</div>
              <ul className="list-disc pl-4 space-y-0.5">
                {gen.disadvantages.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.2"
          title="ProTaper Universal & WaveOne Taper Explorer"
          subtitle="Inspect variable tapers, tip diameters, and recommended clinical usage rules."
          done={completedIds.includes('inst2-protaper-waveone')}
        />
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(['S1', 'S2', 'F1', 'F2', 'F3', 'F4', 'F5'] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setFileCode(code);
                onComplete('inst2-protaper-waveone');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tabular font-bold whitespace-nowrap shrink-0 transition-colors ${
                fileCode === code
                  ? 'bg-[#1B3A8C] text-white border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                  : 'bg-[var(--pd-surface-inset)] text-[var(--pd-text)] border border-[var(--pd-border)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs space-y-2 mb-3 text-[var(--pd-text)]/90">
          <div className="flex justify-between">
            <span className="font-bold text-sm text-[var(--pd-text)]">ProTaper {fileCode}</span>
            <span className="font-mono-tabular font-semibold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">Tip D0: {protaperSpecs.tip}</span>
          </div>
          <p><strong>Taper Profile:</strong> {protaperSpecs.taper}</p>
          <p><strong>Clinical Role:</strong> {protaperSpecs.role} · Speed 250–300 rpm · Glide path + lateral brushing stroke.</p>
        </div>

        <div className="rounded-xl bg-[#071536] border border-[var(--pd-gold)]/25 text-[#FAF8F3] p-3.5 text-xs grid grid-cols-3 gap-2 font-mono-tabular text-center">
          <div>
            <div className="text-[var(--pd-gold)] font-bold">WaveOne Small</div>
            <div>20 / .06</div>
          </div>
          <div>
            <div className="text-[var(--pd-gold)] font-bold">WaveOne Primary</div>
            <div>25 / .08</div>
          </div>
          <div>
            <div className="text-[var(--pd-gold)] font-bold">WaveOne Large</div>
            <div>40 / .08</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LECTURE 7 — 2D SANDBOXES
// ============================================================================
const Lecture7TwoD: React.FC<{
  completedIds: string[];
  onComplete: (id: string) => void;
}> = ({ completedIds, onComplete }) => {
  const [selectedSealer, setSelectedSealer] = useState(SEALER_FAMILIES[7].id);
  const [gpTemp, setGpTemp] = useState(46);

  const row = SEALER_FAMILIES.find((s) => s.id === selectedSealer) ?? SEALER_FAMILIES[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.1"
          title="Sealer Family Comparator Matrix"
          subtitle="Select any of the 8 sealer families from Lecture 7 to inspect chemistry and clinical behavior."
          done={completedIds.includes('mat-sealer-matrix')}
        />
        <div className="flex flex-wrap gap-1.5 mb-3">
          {SEALER_FAMILIES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSelectedSealer(s.id);
                onComplete('mat-sealer-matrix');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                selectedSealer === s.id
                  ? 'bg-[#1B3A8C] text-white border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                  : 'bg-[var(--pd-surface-inset)] text-[var(--pd-text)] border border-[var(--pd-border)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
              }`}
            >
              {s.family}
            </button>
          ))}
        </div>
        <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs space-y-1.5 text-[var(--pd-text)]/90">
          <div className="font-bold text-sm text-[var(--pd-text)]">{row.family}</div>
          <p><strong>Examples:</strong> {row.examples}</p>
          <p><strong>Setting Dimension:</strong> {row.settingChange}</p>
          <p><strong>Staining Risk:</strong> {row.stainingRisk}</p>
          <p><strong>Antimicrobial:</strong> {row.antimicrobial}</p>
          <p><strong>Retreatment:</strong> {row.retreatment}</p>
          <p className="text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)] font-medium">{row.keyNote}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.2"
          title="GP Thermal Phase Curve & Sterilization Protocol"
          subtitle="Scrub temperature to inspect crystalline transitions and verify chairside GP disinfection."
          done={completedIds.includes('mat-phase-sterilization')}
        />
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium text-[var(--pd-text)]">Thermal Phase Scrub</span>
          <span className="font-mono-tabular font-bold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">{gpTemp}°C</span>
        </div>
        <input
          type="range"
          min={25}
          max={70}
          value={gpTemp}
          onChange={(e) => {
            setGpTemp(Number(e.target.value));
            onComplete('mat-phase-sterilization');
          }}
          className="w-full accent-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:accent-[#C9A24B] mb-3"
          aria-label="Gutta-percha thermal phase scrubber"
        />
        <div className="grid grid-cols-4 gap-1.5 text-[11px] font-mono-tabular text-center mb-3">
          {[
            ['< 46°C', 'Beta (β)', gpTemp < 46],
            ['~46°C', 'Alpha (α)', gpTemp >= 46 && gpTemp < 54],
            ['54–60°C', 'Amorphous', gpTemp >= 54 && gpTemp <= 64],
            ['> 64°C', 'Softens', gpTemp > 64],
          ].map(([t, label, active]) => (
            <div
              key={String(t)}
              className={`p-2 rounded-lg border transition-colors ${
                active
                  ? 'bg-[#1B3A8C] text-white border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                  : 'bg-[var(--pd-surface-inset)] text-[var(--pd-text)] border-[var(--pd-border)]'
              }`}
            >
              <div className="font-bold">{t}</div>
              <div>{label}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-3 text-xs space-y-1 text-[var(--pd-text)]/90">
          <p><strong>Chairside Sterilization:</strong> Immerse GP cones in <strong>5.25% NaOCl for 1 minute</strong> (cannot be heat-sterilized).</p>
          <p><strong>Obsolete Cores:</strong> Resilon was withdrawn in 2014 (enzymatic degradation); Silver cones corrode with cytotoxic byproducts.</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LECTURE 8 — 2D SANDBOXES
// ============================================================================
const Lecture8TwoD: React.FC<{
  completedIds: string[];
  onComplete: (id: string) => void;
}> = ({ completedIds, onComplete }) => {
  const [pulpStatus, setPulpStatus] = useState<'vital' | 'necrotic_asymp' | 'necrotic_symp'>('necrotic_symp');
  const [techKey, setTechKey] = useState<'lateral' | 'vertical' | 'sysb' | 'obtura' | 'thermafil' | 'solvents'>('sysb');

  const techData = {
    lateral: 'Warm Lateral Compaction: Fit master cone with tugback, soften laterally with heated/electric spreader, add accessory cones.',
    vertical: 'Warm Vertical Compaction: Continuously tapering funnel; prefit pluggers at 5 mm intervals; compact apically; backfill with 3–4 mm sections.',
    sysb: 'Continuous Wave (System B): 200°C touch mode, 0.04–0.12 dead-soft plugger 5–7 mm from WL, 10 s cooling hold, 1 s heat + 1 s pause removal.',
    obtura: 'Thermoplastic Injection (Obtura III): Beta-GP pellets, 20/23/25G silver needle 3–5 mm from apical prep; backs out while injecting; alcohol-dipped plugger.',
    thermafil: 'Carrier-Based (Thermafil): Central plastic core + alpha-GP; remove smear layer; 10 s insertion without twisting; cool 2–4 min before resecting.',
    solvents: 'Solvent Techniques (Chloroform, Eucalyptol, Xylol): Shrinkage voids upon evaporation + periradicular tissue irritation.',
  }[techKey];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.1"
          title="Timing of Obturation Clinical Decision Tree"
          subtitle="Evaluate pulp status and periapical symptoms to decide single-visit vs. deferred obturation."
          done={completedIds.includes('obt-timing-tree')}
        />
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(
            [
              ['vital', 'Vital Pulp Tissue'],
              ['necrotic_asymp', 'Necrotic (Asymptomatic)'],
              ['necrotic_symp', 'Necrotic + Percussion / Exudate'],
            ] as const
          ).map(([k, lbl]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setPulpStatus(k);
                onComplete('obt-timing-tree');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                pulpStatus === k
                  ? 'bg-[#1B3A8C] text-white border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                  : 'bg-[var(--pd-surface-inset)] text-[var(--pd-text)] border border-[var(--pd-border)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs space-y-2 text-[var(--pd-text)]/90">
          <div className="font-bold text-sm text-[var(--pd-text)]">
            {pulpStatus === 'necrotic_symp' ? 'Defer Obturation Until Inflammation Subsides' : 'Single-Visit Obturation Eligible'}
          </div>
          <p>
            {pulpStatus === 'vital'
              ? 'Vital pulp tissue: Obturation can be completed in a single visit after complete cleaning and shaping.'
              : pulpStatus === 'necrotic_asymp'
              ? 'Asymptomatic necrotic pulp: Single-visit endodontics can be performed once chemo-mechanical prep is complete.'
              : 'Tenderness to percussion, purulent exudate, or sinus tract indicates active periapical inflammation — do NOT obturate until inflammation subsides.'}
          </p>
          <div className="pt-2 border-t border-[var(--pd-border)] text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)] font-medium">
            4 Radiographic Success Factors: No periapical lesion · No voids · Within 2.0 mm of radiographic apex · Adequate coronal restoration.
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.2"
          title="Obturation Techniques & Material Limitations Matrix"
          subtitle="Compare heat-softened, carrier-based, and solvent techniques from Lecture 8."
          done={completedIds.includes('obt-technique-matrix')}
        />
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(
            [
              ['lateral', 'Warm Lateral'],
              ['vertical', 'Warm Vertical'],
              ['sysb', 'System B'],
              ['obtura', 'Obtura III'],
              ['thermafil', 'Thermafil'],
              ['solvents', 'Solvents'],
            ] as const
          ).map(([k, lbl]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setTechKey(k);
                onComplete('obt-technique-matrix');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                techKey === k
                  ? 'bg-[#1B3A8C] text-white border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                  : 'bg-[var(--pd-surface-inset)] text-[var(--pd-text)] border border-[var(--pd-border)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
        <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs leading-relaxed text-[var(--pd-text)]/90">
          {techData}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LECTURE 9 — 2D SANDBOXES
// ============================================================================
const Lecture9TwoD: React.FC<{
  completedIds: string[];
  onComplete: (id: string) => void;
}> = ({ completedIds, onComplete }) => {
  const [carrotteTab, setCarrotteTab] = useState<'A' | 'B' | 'C'>('A');
  const [painLevel, setPainLevel] = useState(0);

  const carrotteGroups = {
    A: {
      title: 'A. Pretreatment Emergencies',
      items: [
        '1. Dentin hypersensitivity',
        '2. Symptomatic reversible pulpitis',
        '3. Symptomatic irreversible pulpitis',
        '4. Symptomatic apical periodontitis',
        '5. Acute apical abscess',
        '6. Traumatic injury',
        '7. Cracked tooth syndrome',
      ],
    },
    B: {
      title: 'B. Patients Under Treatment',
      items: [
        '1. Mid-treatment flare-up (8 risk factors: over-instrumentation/obturation, inadequate debridement, debris extrusion, pre-op pain/swelling, 1-visit AAP, retreatment, apprehension, allergies)',
        '2. Exposure of pulp',
        '3. Fracture of tooth',
        '4. Recently placed restoration',
        '5. Periodontal treatment',
        '6. Hypochlorite accident',
        '7. Tissue emphysema',
      ],
    },
    C: {
      title: 'C. Post-Endodontic Treatment',
      items: [
        '1. Over-instrumentation',
        '2. Overextended obturation',
        '3. Underfilling',
        '4. Fracture of root',
        '5. High spot of coronal restoration (most post-obturation discomfort subsides in 2–5 days; do NOT retreat randomly)',
      ],
    },
  }[carrotteTab];

  const ladder = PAIN_LADDER_STEPS[painLevel];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.1"
          title="P. Carrotte Emergency Classification Explorer"
          subtitle="Classify pretreatment, intra-treatment, and post-endodontic emergency presentations."
          done={completedIds.includes('emg-carrotte-triage')}
        />
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(
            [
              ['A', 'A. Pretreatment'],
              ['B', 'B. Under Treatment'],
              ['C', 'C. Post-Endodontic'],
            ] as const
          ).map(([k, lbl]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setCarrotteTab(k);
                onComplete('emg-carrotte-triage');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                carrotteTab === k
                  ? 'bg-[#1B3A8C] text-white border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                  : 'bg-[var(--pd-surface-inset)] text-[var(--pd-text)] border border-[var(--pd-border)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs space-y-1.5">
          <div className="font-bold text-sm text-[var(--pd-text)] mb-1">{carrotteGroups.title}</div>
          {carrotteGroups.items.map((item) => (
            <div key={item} className="text-[var(--pd-text)]/90 leading-snug">{item}</div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 transition-colors duration-200">
        <SandboxCardHeader
          index="2D.2"
          title="Stepwise Endodontic Pain Pharmacotherapy Ladder"
          subtitle="Select pain severity from Lecture 9 (p. 6) to view analgesic escalation protocols."
          done={completedIds.includes('emg-pain-ladder')}
        />
        <div className="flex flex-wrap gap-2 mb-3">
          {PAIN_LADDER_STEPS.map((step, i) => (
            <button
              key={step.level}
              type="button"
              onClick={() => {
                setPainLevel(i);
                onComplete('emg-pain-ladder');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                painLevel === i
                  ? 'bg-[#1B3A8C] text-white border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                  : 'bg-[var(--pd-surface-inset)] text-[var(--pd-text)] border border-[var(--pd-border)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
              }`}
            >
              {step.level}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs space-y-2">
          <div className="font-bold text-sm text-[var(--pd-text)]">{ladder.level}</div>
          <p className="font-mono-tabular text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)] font-semibold">{ladder.primaryRegimen}</p>
          {'secondaryRegimen' in ladder && ladder.secondaryRegimen && (
            <p className="font-mono-tabular text-[var(--pd-text)]/90">{ladder.secondaryRegimen}</p>
          )}
          <div className="flex items-start gap-1.5 text-[var(--pd-text)]/85 pt-1">
            <ArrowRight className="w-3.5 h-3.5 text-[var(--pd-gold)] shrink-0 mt-0.5" />
            <span>{ladder.escalationTrigger}</span>
          </div>
          <div className="flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 [.endo-curriculum[data-endo-theme=dark]_&]:bg-[#162D66] [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]/55 [.endo-curriculum[data-endo-theme=dark]_&]:text-[#FAF8F3] rounded-lg p-2 mt-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700 [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]" />
            <span>
              Educational reference from Lecture 9 only. Verify patient allergies, renal/GI/hepatic contraindications, and local prescribing guidelines before clinical administration.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
