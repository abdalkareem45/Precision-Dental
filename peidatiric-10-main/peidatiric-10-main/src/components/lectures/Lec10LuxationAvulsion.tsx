import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { DentalLuxation3D } from '../3d/DentalLuxation3D';
import { AvulsionEmergencyTimer } from '../tools/AvulsionEmergencyTimer';
import {
  ShieldAlert,
  GitBranch,
  Clock,
  Sparkles,
  Droplets,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const Lec10LuxationAvulsion: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d_luxation' | 'avulsion_timer' | 'flowchart' | 'splinting'>('3d_luxation');

  return (
    <div className="space-y-6">
      {/* Lecture Title Hero */}
      <div className="bg-gradient-to-r from-[#0B1F4D] to-[#1B3A8C] rounded-2xl p-6 text-white shadow-xl border border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="bg-[#C9A24B] text-[#0B1F4D] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Lecture 10 • Trauma 5 • Pedodontics 5th Year
            </span>
            <span className="text-xs font-semibold text-gray-300">
              Baghdad College of Dentistry • Prof. Dr. Aseel Haidar
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-2">
            Displacement of Teeth (Luxation) &amp; Avulsion Replantation
          </h2>
          <p className="text-sm text-gray-200 max-w-3xl leading-relaxed">
            Emergency biomechanics and management: Intrusion, extrusion, lateral luxation, transport media rankings, the complete avulsion decision tree, and physiological flexible splinting.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {(
          [
            ['3d_luxation', '1. 3D Luxation Biomechanics', ShieldAlert],
            ['avulsion_timer', '2. Transport Media & Dry Time Matrix', Clock],
            ['flowchart', '3. Avulsion Clinical Decision Tree', GitBranch],
            ['splinting', '4. Splinting Criteria & Endodontics', Layers],
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

      {/* Tab 1: 3D Luxation */}
      {activeTab === '3d_luxation' && (
        <div className="space-y-4">
          <DentalLuxation3D initialType="intrusion" dentitionType="permanent" />
        </div>
      )}

      {/* Tab 2: Transport Media & Avulsion Timer */}
      {activeTab === 'avulsion_timer' && (
        <div className="space-y-4">
          <AvulsionEmergencyTimer />
        </div>
      )}

      {/* Tab 3: Avulsion Decision Tree */}
      {activeTab === 'flowchart' && (
        <div className="bg-white p-6 rounded-2xl border border-[#C9A24B]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-base font-extrabold text-[#0B1F4D]">
                Avulsed Tooth Emergency Decision Tree (Lec 10 p.12-13)
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Step-by-step triage protocol from initial injury to definitive endodontics
              </p>
            </div>
          </div>

          {/* Interactive Flowchart Diagram */}
          <div className="space-y-3">
            {/* Step 1: Dentition */}
            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-extrabold text-sm text-[#0B1F4D] block mb-1">
                  Step 1: Is it a Primary or Permanent Tooth?
                </span>
                <p className="text-gray-600">
                  Assess age of child (under 6 years usually primary incisor).
                </p>
              </div>

              <div className="flex gap-2">
                <div className="p-2.5 bg-red-100 text-red-900 rounded-lg text-xs font-bold border border-red-300">
                  PRIMARY: DO NOT REPLANT! (Risk of germ injury)
                </div>
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold border border-emerald-300">
                  PERMANENT: Proceed to Replantation Triage
                </div>
              </div>
            </div>

            {/* Step 2: Immediate Replantation */}
            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-extrabold text-sm text-[#0B1F4D] block mb-1">
                  Step 2: Was it Replanted Immediately at Accident Site?
                </span>
                <p className="text-gray-600">
                  Immediate replacement has the best long-term prognosis!
                </p>
              </div>

              <div className="flex gap-2">
                <div className="p-2 bg-blue-100 text-blue-900 rounded-lg text-xs font-bold">
                  YES: Verify position clinically &amp; radiographically + Splint
                </div>
                <div className="p-2 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold">
                  NO: Check Extraoral Dry Time (&lt;60 min vs &gt;60 min)
                </div>
              </div>
            </div>

            {/* Step 3: Apical Foramen State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-2">
                <span className="font-black text-sm text-[#1B3A8C] block">
                  Closed Apex (Mature Tooth):
                </span>
                <p className="text-gray-700">
                  • Revascularization is impossible due to constricted apical foramen.
                </p>
                <p className="text-gray-700">
                  • <strong>Initiate pulpectomy and root canal treatment 7 to 10 days</strong> after replantation (prior to splint removal). Fill with Ca(OH)₂ paste to arrest inflammatory root resorption!
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2">
                <span className="font-black text-sm text-emerald-950 block">
                  Open Apex (Immature Tooth):
                </span>
                <p className="text-gray-700">
                  • Revascularization is possible through open blunderbuss canal!
                </p>
                <p className="text-gray-700">
                  • Delay endodontic therapy. Recall at 2-3 week intervals. If signs of pulpal necrosis or apical radiolucency emerge, initiate <strong>Regenerative Endodontic Procedure (REP)</strong> or Apexification.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Splinting & Endodontics */}
      {activeTab === 'splinting' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#0B1F4D]">
            Criteria for an Acceptable Splint for Replanted Teeth (Lec 10 p.8):
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {[
              '1. Easy to fabricate directly in the mouth without lab delays.',
              '2. Placed passively without exerting orthodontic forces on the tooth.',
              '3. Does not touch gingival tissues (prevents irritation/bleeding).',
              '4. Does not interfere with normal functional occlusion.',
              '5. Easily cleaned to maintain strict oral hygiene.',
              '6. Does not traumatize teeth or gingiva during application.',
              '7. Allows endodontic access while splint remains in place.',
              '8. Easily and atraumatically removed without enamel damage.',
            ].map((c, i) => (
              <div key={i} className="bg-[#FAF8F3] p-3 rounded-xl border border-gray-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 font-semibold">{c}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Why Rigid Splinting is Detrimental in Avulsion (Lec 10 p.8):</strong>
            <br />
            The splint <strong>must allow physiological mobility</strong> of the replanted tooth comparable with the normal mobility of adjacent teeth! Rigid immobilization stimulates osteoclastic invasion and replacement root resorption (ankylosis). Flexible resin-and-wire splinting allows periodontal ligament fibers to heal normally.
          </div>
        </div>
      )}
    </div>
  );
};
