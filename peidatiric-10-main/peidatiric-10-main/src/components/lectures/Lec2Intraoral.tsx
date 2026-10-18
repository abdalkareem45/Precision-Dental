import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { PediatricArch3D } from '../3d/PediatricArch3D';
import {
  Sparkles,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ListOrdered,
  Calendar,
  Smile,
  ShieldAlert,
} from 'lucide-react';

export const Lec2Intraoral: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d_arch' | 'soft_tissues' | 'priorities' | 'presentation'>('3d_arch');
  const [priorityPhase, setPriorityPhase] = useState<number>(1);

  const phases = [
    {
      num: 1,
      name: 'Emergency Phase',
      color: 'bg-red-500',
      badge: 'Immediate Action',
      details:
        'All problems requiring immediate relief: pain, acute infection, facial cellulitis, or acute dental trauma. Conservative approach is preferred initially because child is stressed with low tolerance. Delay extraction or extensive pulpal therapy if pain can be relieved by other palliative means.',
    },
    {
      num: 2,
      name: 'Medical / Referral Phase',
      color: 'bg-orange-500',
      badge: 'Physician Consultation',
      details:
        'Referral of patients with positive medical history to their pediatrician for medical evaluation, consent, and drug dosage modification prior to invasive procedures.',
    },
    {
      num: 3,
      name: 'Systemic Phase',
      color: 'bg-amber-500',
      badge: 'Premedication',
      details:
        'Medications given to modify dental treatment: premedication for behavior management, or antibiotic prophylaxis for children with congenital cardiac defects susceptible to Infective Endocarditis.',
    },
    {
      num: 4,
      name: 'Preventive Phase',
      color: 'bg-emerald-500',
      badge: 'First Phase of Real Treatment',
      details:
        'Plaque control program: oral prophylaxis, topical fluoride application, pit and fissure sealants, diet counseling, and parent home-care education.',
    },
    {
      num: 5,
      name: 'Corrective Phase',
      color: 'bg-blue-500',
      badge: 'Restorations & Surgery',
      details:
        'Restorative therapy: short and simple procedures should be selected first during initial restorative appointments to build patient trust and confidence! Followed by minor surgery, space maintainers, and minor orthodontics.',
    },
    {
      num: 6,
      name: 'Maintenance & Recall Phase',
      color: 'bg-purple-500',
      badge: 'Follow-Up',
      details:
        'Regular intervals: High caries risk children recalled at 2 to 3 months; Low risk recalled at 6 months for evaluation and biannual topical fluoride.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Lecture Title Hero */}
      <div className="bg-gradient-to-r from-[#0B1F4D] to-[#1B3A8C] rounded-2xl p-6 text-white shadow-xl border border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="bg-[#C9A24B] text-[#0B1F4D] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Lecture 2 • Pedodontics 5th Year
            </span>
            <span className="text-xs font-semibold text-gray-300">
              Baghdad College of Dentistry • Assist. Prof. Dr. Aseel Haidar
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-2">
            Intraoral Examination &amp; Treatment Priorities
          </h2>
          <p className="text-sm text-gray-200 max-w-3xl leading-relaxed">
            Master the systematic soft tissue inspection using the "3 C’s", the standard quadrant examination sequence, and the 6 sequential phases of treatment planning.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {(
          [
            ['3d_arch', '1. Interactive 3D Arch & Quadrants', Sparkles],
            ['soft_tissues', '2. Soft Tissues & The 3 C’s', Layers],
            ['priorities', '3. The 6 Treatment Priorities', ListOrdered],
            ['presentation', '4. Presentation to Parents', Smile],
          ] as const
        ).map(([tabId, label, Icon]) => (
          <button
            key={tabId}
            onClick={() => {
              soundFx.playClick();
              setActiveTab(tabId);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === tabId
                ? 'bg-[#1B3A8C] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4 text-[#C9A24B]" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: 3D Arch */}
      {activeTab === '3d_arch' && (
        <div className="space-y-4">
          <PediatricArch3D highlightFeature="quadrant_tour" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <h4 className="font-extrabold text-[#0B1F4D] text-sm mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1B3A8C]" />
                Standard Teeth Examination Sequence (Lec 2 p.3 Take Note!):
              </h4>
              <p className="text-gray-600 mb-2">
                Begin in the <strong>Upper Right Quadrant</strong>, work around the maxillary arch to the <strong>Upper Left Quadrant</strong>, move down to the <strong>Lower Left Quadrant</strong>, and conclude in the <strong>Lower Right Quadrant</strong>.
              </p>
              <div className="bg-[#FAF8F3] p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-[#1B3A8C] font-bold">
                Path: UR ➔ UL ➔ LL ➔ LR
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <h4 className="font-extrabold text-[#0B1F4D] text-sm mb-1.5 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Why Examine Soft Tissues BEFORE Carious Lesions?
              </h4>
              <p className="text-gray-600">
                There is a temptation to look first for obvious carious lesions. However, if the dentist becomes engrossed in charting cavities first, <strong>critical soft tissue anomalies, fistulas, mucosal ulcers, or systemic indicators will be completely overlooked!</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Soft Tissues & 3 C's */}
      {activeTab === 'soft_tissues' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#C9A24B]/30 shadow-sm">
            <h3 className="text-base font-extrabold text-[#0B1F4D] mb-3">
              The Fundamental "3 C’s" of Soft Tissue Examination (Lec 2 p.2):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <span className="font-extrabold text-red-900 block text-sm mb-1">1. Color</span>
                <p className="text-gray-700 leading-relaxed">
                  • <strong>Red:</strong> Acute inflammation, gingivitis, erythema.
                  <br />
                  • <strong>Blue:</strong> Hematoma, eruption cyst, contusion.
                  <br />
                  • <strong>White:</strong> Thermal burn, electrical burn, pseudomembranous candida albicans.
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <span className="font-extrabold text-amber-900 block text-sm mb-1">2. Contour</span>
                <p className="text-gray-700 leading-relaxed">
                  • <strong>Swelling:</strong> Odontogenic abscess, papilloma, cellulitis.
                  <br />
                  • <strong>Ulceration:</strong> Aphthous ulcer, traumatic laceration, herpes stomatitis.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <span className="font-extrabold text-blue-900 block text-sm mb-1">3. Consistency</span>
                <p className="text-gray-700 leading-relaxed">
                  • <strong>Soft / Fluctuant:</strong> Acute inflammatory edema or purulent abscess.
                  <br />
                  • <strong>Firm:</strong> Mucocele, fibroma.
                  <br />
                  • <strong>Hard:</strong> Bony exostosis or impacted tooth.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <span className="font-bold text-[#1B3A8C] block text-sm mb-1">
                Tonsils &amp; Streptococcal Pharyngitis (Lec 2 p.2):
              </span>
              <p className="text-gray-600">
                Enlarged tonsils with purulent exudates may be an initial sign of group A streptococcal infection. If left untreated, this can trigger <strong>Rheumatic Fever and Rheumatic Heart Disease</strong>! Immediate medical referral for throat culture is indicated.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <span className="font-bold text-[#1B3A8C] block text-sm mb-1">
                Halitosis Differential Diagnosis:
              </span>
              <p className="text-gray-600">
                Pediatric halitosis may stem from poor oral hygiene, food debris, blood in mouth, dehydration, chronic sinusitis, infected adenoids, or alimentary tract disturbances.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: The 6 Treatment Priorities */}
      {activeTab === 'priorities' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#C9A24B]/30 shadow-sm">
            <h3 className="text-base font-extrabold text-[#0B1F4D] mb-3">
              Sequential Treatment Priorities Flow (Lec 2 p.4-5):
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {phases.map((ph) => (
                <button
                  key={ph.num}
                  onClick={() => {
                    soundFx.playClick();
                    setPriorityPhase(ph.num);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    priorityPhase === ph.num
                      ? 'bg-[#1B3A8C] text-white shadow-md border-[#1B3A8C]'
                      : 'bg-[#FAF8F3] text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-black text-xs block mb-0.5">Phase {ph.num}</span>
                  <span className="text-[10px] font-semibold opacity-90 truncate block">{ph.name}</span>
                </button>
              ))}
            </div>

            {/* Current Phase Highlight Box */}
            {(() => {
              const active = phases.find((p) => p.num === priorityPhase)!;
              return (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-[#0B1F4D]">
                      Phase {active.num}: {active.name}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                      {active.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{active.details}</p>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Tab 4: Presentation to Parents */}
      {activeTab === 'presentation' && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#0B1F4D]">
            5-Step Presentation of Treatment Plan to Parents (Lec 2 p.6):
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              {
                step: '1. Point out the problem',
                desc: 'Show the issue directly using dental study casts, radiographs, or inside the patient’s mouth with an intraoral mirror.',
              },
              {
                step: '2. State the probable cause',
                desc: 'Explain etiologic factors (e.g., active plaque accumulation, high sugary snacks, insufficient arch length).',
              },
              {
                step: '3. State the outcome of the untreated problem',
                desc: 'Explain the negative impact on function, oral health, mastication, or facial aesthetics if left untreated.',
              },
              {
                step: '4. Show how the problem will be resolved',
                desc: 'Demonstrate the exact clinical solution (e.g. stainless steel crown, pulpotomy, composite reattachment).',
              },
              {
                step: '5. Stress the benefits',
                desc: 'Emphasize the lifelong physical, cosmetic, and psychological benefits the child will receive from completing treatment.',
              },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#FAF8F3] p-3 rounded-xl border border-amber-100">
                <span className="w-6 h-6 rounded-full bg-[#1B3A8C] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-bold text-[#0B1F4D] text-xs mb-0.5">{s.step}</h4>
                  <p className="text-gray-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
