import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { ToothTrauma3D } from '../3d/ToothTrauma3D';
import {
  Sparkles,
  ShieldAlert,
  Wand2,
  Stethoscope,
  Syringe,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

export const Lec7TraumaExamFractures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d_lab' | 'clinical_exam' | 'tetanus' | 'craze_vs_fracture'>('3d_lab');

  return (
    <div className="space-y-6">
      {/* Lecture Title Hero */}
      <div className="bg-gradient-to-r from-[#0B1F4D] to-[#1B3A8C] rounded-2xl p-6 text-white shadow-xl border border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="bg-[#C9A24B] text-[#0B1F4D] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Lecture 7 • Trauma 2 • Pedodontics 5th Year
            </span>
            <span className="text-xs font-semibold text-gray-300">
              Baghdad College of Dentistry • Prof. Dr. Aseel Haidar
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-2">
            Trauma Examination, Crown Fractures &amp; Fragment Reattachment
          </h2>
          <p className="text-sm text-gray-200 max-w-3xl leading-relaxed">
            Essential protocols for emergency pediatric trauma: clinical examination, tetanus prophylaxis, vital pulp testing pitfalls in immature teeth, and step-by-step tooth fragment reattachment.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {(
          [
            ['3d_lab', '1. 3D Fragment Reattachment Lab', Wand2],
            ['clinical_exam', '2. Clinical Exam (Visual & Digital)', Stethoscope],
            ['tetanus', '3. Soft Tissue & Tetanus Protocol', Syringe],
            ['craze_vs_fracture', '4. Crown Craze vs Dentin Fractures', Sparkles],
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

      {/* Tab 1: 3D Reattachment Lab */}
      {activeTab === '3d_lab' && (
        <div className="space-y-4">
          <ToothTrauma3D
            pathology="fracture_enamel_dentin"
            allowPathologyChange={false}
            allowInteractiveRepair={true}
            title="3D Fragment Reattachment Interactive Lab (Ellis Class II)"
          />

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-base font-extrabold text-[#0B1F4D] flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-[#C9A24B]" />
              Biological &amp; Clinical Advantages of Fragment Reattachment (Lec 7 p.5-6):
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              When a fractured crown fragment is recovered intact after trauma, reattachment using modern acid-etching and composite resin bonding is the <strong>treatment of choice</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#FAF8F3] p-3 rounded-xl border border-amber-200/50">
                <span className="font-bold text-[#1B3A8C] block mb-1">1. Atraumatic &amp; Natural</span>
                <p className="text-gray-600">
                  Preserves original natural enamel incisal translucency, anatomy, and physiological wear characteristics without tooth preparation.
                </p>
              </div>

              <div className="bg-[#FAF8F3] p-3 rounded-xl border border-amber-200/50">
                <span className="font-bold text-[#1B3A8C] block mb-1">2. Dentin Pulp Sealing</span>
                <p className="text-gray-600">
                  Seals exposed dentinal tubules hermetically against oral fluid ingress, reducing post-operative hyperalgesia and pulp inflammation.
                </p>
              </div>

              <div className="bg-[#FAF8F3] p-3 rounded-xl border border-amber-200/50">
                <span className="font-bold text-[#1B3A8C] block mb-1">3. Psychological Value</span>
                <p className="text-gray-600">
                  Instantly restores the child's smile and self-confidence on the day of injury, dramatically reducing emotional trauma.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Clinical Examination Methods */}
      {activeTab === 'clinical_exam' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 text-xs">
            <h3 className="text-base font-extrabold text-[#0B1F4D] flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#1B3A8C]" />
              1. Visual Examination Checklist:
            </h3>

            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2 bg-[#FAF8F3] p-2.5 rounded-lg border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Straw-Colored Fluid Leakage:</strong> Fluid discharge from the nose or ear indicates cerebrospinal fluid (CSF) rhinorrhea/otorrhea from a <strong>cranial base fracture</strong>! Immediate emergency neurosurgical referral required.
                </span>
              </li>
              <li className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Soft Tissue Lacerations &amp; Swelling:</strong> Inspect lips, labial mucosa, and gingival sulcus for embedded tooth fragments or debris.
                </span>
              </li>
              <li className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Mandibular Deviation:</strong> Deviation of mandible during mouth opening indicates condylar neck fracture or TMJ capsule injury.
                </span>
              </li>
              <li className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Tooth Discoloration:</strong> Subtle reddish pink (hyperemia) versus dark gray/black (autolysis and necrotic hemoglobin breakdown).
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 text-xs">
            <h3 className="text-base font-extrabold text-[#0B1F4D] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A24B]" />
              2. Digital Examination &amp; Vitality Testing Pitfalls:
            </h3>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
              <strong>Why Electric Pulp Testing (EPT) is Controversial in Children (Lec 7 p.1-2):</strong>
              <p className="mt-1">
                Immediately after trauma, traumatized teeth are in a state of <strong>neurological shock / paresthesia</strong> and may give <strong>false-negative non-vital responses</strong>. Furthermore:
              </p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Immature permanent teeth with open apices have incomplete nerve plexus development (Raschkow plexus).</li>
                <li>Anxious young children often give false apprehension responses.</li>
                <li><strong>Golden Rule:</strong> Re-examine vitality after <strong>6 to 8 weeks</strong> before diagnosing irreversible pulp necrosis!</li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
              <strong>Gentle Percussion Tenderness:</strong> High sensitivity to gentle tap indicates inflammation of the apical periodontal ligament (PDL) or luxation/root fracture.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tetanus Protocol */}
      {activeTab === 'tetanus' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-extrabold text-[#0B1F4D]">
              Emergency Tetanus Immunization Guidelines (Lec 7 p.3-4)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50 space-y-2">
              <span className="font-bold text-[#1B3A8C] block text-sm">
                Child Immunization History Assessment:
              </span>
              <p className="text-gray-600 leading-relaxed">
                Injury to children's teeth is frequently accompanied by open wounds, puncture wounds, and facial abrasions from contact with soil or dirty asphalt.
              </p>
              <p className="text-gray-700">
                Primary tetanus immunization is normally completed during the first 2 years of life (DTP series).
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200 space-y-2 text-red-900">
              <span className="font-bold block text-sm">Mandatory Tetanus Actions:</span>
              <p>
                • <strong>Immunized child with dirty/contaminated wound:</strong> Administer a booster injection of tetanus toxoid if last dose was &gt;5 years ago.
              </p>
              <p>
                • <strong>Unimmunized child or unknown status:</strong> High risk of fatal clostridial infection! Immediate passive immunization with <strong>Tetanus Immune Globulin (TIG)</strong> and referral to a physician.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Craze vs Dentin Fractures */}
      {activeTab === 'craze_vs_fracture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <span className="font-extrabold text-[#1B3A8C] text-sm block">
              Crown Craze / Crack (Lec 7 p.4):
            </span>
            <p className="text-gray-600">
              Minute hairline cracks extending throughout the labiolingual enamel surface resulting from direct direct impact. Enamel continuity is preserved without tissue loss.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-semibold">
              ✓ Treatment: Conservative observation, transillumination baseline check, no restorative intervention needed. Re-evaluate vitality at 2 weeks, 1 month, and 6 months.
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <span className="font-extrabold text-[#C9A24B] text-sm block">
              Fracture Involving Enamel &amp; Dentin (Lec 7 p.5):
            </span>
            <p className="text-gray-600">
              Exposed dentinal tubules act as direct conduits for bacteria and thermal changes into the pulp. Initial pulpal hyperemia must be protected against pressure or chemical irritants.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-semibold">
              ⚠️ Treatment: Hard-setting calcium hydroxide or glass ionomer liner over dentin, followed by fragment reattachment, orthodontic band, or composite resin crown.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
