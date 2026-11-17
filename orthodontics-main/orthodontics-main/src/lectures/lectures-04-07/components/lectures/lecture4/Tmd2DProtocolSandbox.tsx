import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

type StageId = 'presentation' | 'during' | 'after';

const STAGE_PROTOCOLS: Record<
  StageId,
  {
    title: string;
    subtitle: string;
    steps: string[];
  }
> = {
  presentation: {
    title: 'Stage 1 · At Time of Presentation',
    subtitle: 'Pre-treatment TMD Screening & Patient Counseling',
    steps: [
      'Inform the patient that orthodontic treatment will NOT resolve pre-existing TMD problems.',
      'Record current TMD signs and symptoms alongside a full TMD history and clinical palpation examination.',
      'If existing TMD is acute and severe, postpone commencement of orthodontic treatment until resolved or stabilized.',
    ],
  },
  during: {
    title: 'Stage 2 · Arising During Treatment',
    subtitle: 'Active Appliance Pause & Conservative Management',
    steps: [
      'Acknowledge and recognize the emerging signs and symptoms of TMD immediately.',
      'Reassure and educate the patient that TMD is not necessarily progressive and most cases improve over time with conservative treatment.',
      'Discontinue active orthodontic tooth movement and manage symptoms (by orthodontist or TMD specialist).',
      'Once alleviated or controlled, resume active orthodontics with modifications: reduce forces on headgear, remove or lighten elastics, or use an oral TMD appliance.',
    ],
  },
  after: {
    title: 'Stage 3 · After Treatment (Retention)',
    subtitle: 'Longitudinal Surveillance During Retention',
    steps: [
      'Monitor the completed orthodontic patient for TMD signs and symptoms throughout the retention period.',
      'If symptoms arise post-treatment, provide appropriate conservative TMD management and avoid attributing them solely to prior occlusion without full assessment.',
    ],
  },
};

const SCREENING_ITEMS = [
  { id: 'q-pain', label: 'Pain in jaw or temple area (comes & goes or always present in last 30 days)' },
  { id: 'q-wake', label: 'Pain or stiffness in jaw on awakening in last 30 days' },
  { id: 'q-chew', label: 'Chewing hard or tough food alters jaw/temple pain' },
  { id: 'q-move', label: 'Opening mouth or moving jaw forward/to the side alters pain' },
  { id: 'q-habit', label: 'Jaw habits (clenching, grinding, holding teeth together, gum) alter pain' },
  { id: 'q-talk', label: 'Other jaw activities (talking or yawning) alter pain' },
];

export function Tmd2DProtocolSandbox() {
  const [checkedIds, setCheckedIds] = useState<string[]>(['q-pain', 'q-wake']);
  const [stage, setStage] = useState<StageId>('presentation');

  const positiveCount = checkedIds.length;
  const requiresClarification = positiveCount >= 3;

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setCheckedIds(['q-pain', 'q-wake']);
    setStage('presentation');
  };

  return (
    <SandboxShell
      id="lec4-2d-protocol"
      kind="2D Sandbox"
      title="30-Day TMD Screening Calculator & 3-Stage Orthodontic Protocol (Table 1)"
      instruction="Toggle positive screening responses & explore Table 1 stage actions"
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive 30-Day Screening History */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[#0B1F4D]">30-Day Screening History</h4>
            <span
              className={`font-mono text-xs font-bold px-2.5 py-1 rounded ${
                requiresClarification
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
              }`}
            >
              {positiveCount} / {SCREENING_ITEMS.length} Positive
            </span>
          </div>

          <div className="space-y-2">
            {SCREENING_ITEMS.map((item) => {
              const checked = checkedIds.includes(item.id);
              return (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    checked
                      ? 'bg-[#1B3A8C]/8 border-[#1B3A8C] text-[#0B1F4D]'
                      : 'bg-white border-[#E6E8EC] text-[#334155] hover:border-[#1B3A8C]/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleItem(item.id)}
                    className="mt-0.5 accent-[#1B3A8C] w-4 h-4 shrink-0 cursor-pointer"
                  />
                  <span className="leading-snug font-medium">{item.label}</span>
                </label>
              );
            })}
          </div>

          <div
            className={`p-3 rounded-lg border text-xs font-medium leading-relaxed ${
              requiresClarification
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-white border-[#E6E8EC] text-[#475569]'
            }`}
            role="status"
          >
            {requiresClarification ? (
              <>
                <strong className="font-bold">Threshold Reached (≥ 3 Positive):</strong> Request
                additional diagnostic information to clarify the TMD condition before planning or
                continuing orthodontic mechanics.
              </>
            ) : (
              <>
                <strong className="font-bold">Below Clarification Threshold (&lt; 3 Positive):</strong>{' '}
                Document baseline screening findings and complete bilateral muscle &amp; TMJ palpation
                exam.
              </>
            )}
          </div>
        </div>

        {/* Right: Interactive Table 1 Stage Selector */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-4">
          <h4 className="text-sm font-bold text-[#0B1F4D]">
            Table 1: Orthodontic Management Protocol
          </h4>

          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'presentation', label: '1. Before' },
                { id: 'during', label: '2. During' },
                { id: 'after', label: '3. After' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStage(tab.id)}
                className={`px-3 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  stage === tab.id
                    ? 'bg-[#1B3A8C] border-[#1B3A8C] text-white'
                    : 'bg-white border-[#E6E8EC] text-[#0B1F4D] hover:border-[#1B3A8C]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#E6E8EC] rounded-xl p-4 space-y-3">
            <div>
              <p className="text-xs font-bold text-[#8A691B]">{STAGE_PROTOCOLS[stage].title}</p>
              <p className="text-sm font-bold text-[#0B1F4D] mt-0.5">
                {STAGE_PROTOCOLS[stage].subtitle}
              </p>
            </div>
            <ol className="space-y-2.5">
              {STAGE_PROTOCOLS[stage].steps.map((step, i) => (
                <li key={step} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#334155]">
                  <span className="font-mono text-xs font-bold text-[#1B3A8C] bg-[#FAF8F3] border border-[#E6E8EC] rounded px-1.5 py-0.5 shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
