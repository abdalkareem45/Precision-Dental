import { useState } from 'react';
import { SandboxShell } from '../../common/SandboxShell';

type CaseId =
  | 'mixed-early'
  | 'mixed-late'
  | 'missing-premolars'
  | 'lesion'
  | 'fracture'
  | 'periapical-limit';

interface OpgCaseInfo {
  id: CaseId;
  figRef: string;
  title: string;
  modalityNote: string;
  finding: string;
  clinicalUse: string;
}

const CASES: OpgCaseInfo[] = [
  {
    id: 'mixed-early',
    figRef: 'Fig. 4A',
    title: 'Early Mixed Dentition (8–10 yrs)',
    modalityNote: 'OPG Primary Screening',
    finding: 'Erupted permanent incisors & 1st molars; developing premolar crowns beneath primary molar roots.',
    clinicalUse: 'Estimates dental age and guides serial extraction timing by checking root formation stages.',
  },
  {
    id: 'mixed-late',
    figRef: 'Fig. 4B',
    title: 'Late Mixed Dentition (10–12 yrs)',
    modalityNote: 'OPG Primary Screening',
    finding: 'Advancing premolar root formation, resorbing deciduous roots, and erupting canines.',
    clinicalUse: 'Assesses eruption path abnormalities, delayed eruption, ankylosis, or prolonged retention.',
  },
  {
    id: 'missing-premolars',
    figRef: 'Fig. 5',
    title: 'Congenital Missing Lower 2nd Premolars',
    modalityNote: 'OPG Primary Screening',
    finding: 'Bilateral absence of mandibular second premolar crypts with retained deciduous second molars.',
    clinicalUse: 'Critical pre-treatment orthodontic discovery altering space management and extraction plans.',
  },
  {
    id: 'lesion',
    figRef: 'Fig. 6',
    title: 'Pathological Mandibular / Maxillary Lesion',
    modalityNote: 'OPG + Clinical / CBCT Correlation',
    finding: 'Large multilocular/unilocular radiolucency disrupting normal mandibular trabecular bone.',
    clinicalUse: 'Screens wide anatomic area (cysts, tumors, bone density) prior to appliance placement.',
  },
  {
    id: 'fracture',
    figRef: 'Fig. 7',
    title: 'Suspected Fracture of Mandible',
    modalityNote: 'OPG Trauma Evaluation',
    finding: 'Radiolucent discontinuity extending through the right mandibular body/angle cortex.',
    clinicalUse: 'Visualizes mandibular morphology, condyles, and suspected fractures of mandible and maxilla.',
  },
  {
    id: 'periapical-limit',
    figRef: 'Figs. 2 & 3',
    title: 'Lower Incisors & Periodontal Membrane',
    modalityNote: 'IOPA Required (Bitewing if Caries)',
    finding: 'OPG blurs and overlaps the lower incisors and lacks sharp periodontal ligament (PDL) detail.',
    clinicalUse: 'Obtain intraoral periapical radiograph (IOPA) for root resorption/PDL details, and bitewings if caries is noted.',
  },
];

export function Opg2DCasesModalitiesSandbox() {
  const [selectedCaseId, setSelectedCaseId] = useState<CaseId>('missing-premolars');
  const active = CASES.find((c) => c.id === selectedCaseId) ?? CASES[0];

  const handleReset = () => setSelectedCaseId('missing-premolars');

  return (
    <SandboxShell
      id="lec6-2d-cases"
      kind="2D Sandbox"
      title="OPG Clinical Indications, Case Findings & Modality Selector (OPG vs. IOPA)"
      instruction="Switch between clinical scenarios from Lecture 6 to compare OPG capabilities vs. intraoral limits"
      onReset={handleReset}
    >
      <div className="space-y-5">
        {/* Case Tabs */}
        <div className="flex flex-wrap gap-2">
          {CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                c.id === selectedCaseId
                  ? 'bg-[#1B3A8C] text-white border-[#1B3A8C]'
                  : 'bg-[#FAF8F3] text-[#0B1F4D] border-[#E6E8EC] hover:border-[#1B3A8C]'
              }`}
            >
              <span className="font-mono mr-1.5 opacity-80">{c.figRef}</span>
              {c.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Interactive Radiographic Case Schematic */}
          <div className="lg:col-span-7 bg-[#0B1F4D] rounded-xl p-4 flex flex-col justify-between">
            <svg
              viewBox="0 0 460 220"
              className="w-full h-auto"
              role="img"
              aria-label={`Diagnostic radiographic schematic for ${active.title}`}
            >
              {/* Base jaw envelope */}
              <path
                d="M45,65 Q230,45 415,65 L408,165 Q395,198 345,200 L230,206 L115,200 Q65,198 52,165 Z"
                fill="#111C3A"
                stroke="#64748B"
                strokeWidth="1.5"
              />

              {/* Lower arch schematic teeth */}
              {Array.from({ length: 14 }).map((_, i) => {
                const x = 92 + i * 21;
                const isPremolarSlot = i === 3 || i === 10;
                const isIncisorSlot = i >= 5 && i <= 8;
                const hidePremolar = selectedCaseId === 'missing-premolars' && isPremolarSlot;
                const blurIncisor = selectedCaseId === 'periapical-limit' && isIncisorSlot;

                return (
                  <g key={i} opacity={blurIncisor ? 0.45 : 0.9}>
                    <rect
                      x={x - 6}
                      y={hidePremolar ? 128 : 118}
                      width="12"
                      height={hidePremolar ? 14 : 34}
                      rx="3"
                      fill={hidePremolar ? '#C9A24B' : blurIncisor ? '#F59E0B' : '#CBD5E1'}
                    />
                    {/* Mixed dentition unerupted buds */}
                    {(selectedCaseId === 'mixed-early' || selectedCaseId === 'mixed-late') &&
                      (i === 2 || i === 3 || i === 4 || i === 9 || i === 10 || i === 11) && (
                        <circle
                          cx={x}
                          cy={selectedCaseId === 'mixed-early' ? 166 : 156}
                          r="5.5"
                          fill="#C9A24B"
                        />
                      )}
                    {hidePremolar && (
                      <circle cx={x} cy="166" r="8" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeDasharray="3 2" />
                    )}
                  </g>
                );
              })}

              {/* Pathological lesion overlay (Fig 6) */}
              {selectedCaseId === 'lesion' && (
                <g>
                  <ellipse cx="148" cy="162" rx="34" ry="22" fill="#0F172A" stroke="#EF4444" strokeWidth="2.2" />
                  <text x="115" y="196" fontSize="10" fontWeight="700" fill="#FCA5A5">
                    Radiolucent Pathological Lesion
                  </text>
                </g>
              )}

              {/* Mandibular Fracture line (Fig 7) */}
              {selectedCaseId === 'fracture' && (
                <g>
                  <path
                    d="M128,118 L120,148 L132,175 L118,200"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                  />
                  <text x="86" y="213" fontSize="10" fontWeight="700" fill="#FCA5A5">
                    Cortical Fracture Discontinuity
                  </text>
                </g>
              )}

              {/* IOPA callout inset for Figs 2 & 3 */}
              {selectedCaseId === 'periapical-limit' && (
                <g>
                  <rect x="315" y="24" width="130" height="105" rx="6" fill="#0F172A" stroke="#C9A24B" strokeWidth="2" />
                  <text x="324" y="42" fontSize="9.5" fontWeight="700" fill="#C9A24B">IOPA Detail View</text>
                  {[0, 1, 2, 3].map((t) => (
                    <g key={t}>
                      <rect x={335 + t * 24} y="54" width="13" height="52" rx="4" fill="#FAF8F3" stroke="#38BDF8" strokeWidth="1.2" />
                    </g>
                  ))}
                  <text x="324" y="121" fontSize="8.5" fill="#E6E8EC">Sharp PDL &amp; Root Apices</text>
                </g>
              )}

              <text x="16" y="24" fontSize="11" fontWeight="700" fill="#C9A24B">
                {active.figRef} · {active.title}
              </text>
            </svg>

            <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap gap-4 text-[11px] text-[#E6E8EC] tabular-nums">
              <span>Exposure varies by equipment and protocol; no fixed dose reduction is validated here.</span>
              <span>5.06 rad is an unverified source figure: its value and units require faculty verification, not use as a validated dose estimate.</span>
              <span>Scan Time: ≤ 1.5 min · Monitor ready ≤ 2 min</span>
            </div>
          </div>

          {/* Right Clinical Interpretation & Modality Rules */}
          <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#8A691B]">{active.modalityNote}</span>
              <span className="font-mono text-xs font-bold text-[#1B3A8C]">{active.figRef}</span>
            </div>
            <h4 className="text-base font-bold text-[#0B1F4D]">{active.title}</h4>
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
              <strong className="text-[#0B1F4D]">Radiographic Finding:</strong> {active.finding}
            </p>
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
              <strong className="text-[#0B1F4D]">Orthodontic Significance:</strong> {active.clinicalUse}
            </p>

            <div className="pt-2 border-t border-[#E6E8EC] space-y-1.5 text-xs text-[#475569]">
              <p><strong className="text-[#0B1F4D]">When OPG Alone Is Insufficient:</strong></p>
              <p>• <strong>Periodontal membrane / Root resorption:</strong> Request an IOPA radiograph.</p>
              <p>• <strong>Interproximal / Occlusal caries noted clinically:</strong> Obtain bitewing radiographs.</p>
            </div>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
