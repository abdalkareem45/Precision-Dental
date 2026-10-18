import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { ToothTrauma3D } from '../3d/ToothTrauma3D';
import {
  Sparkles,
  GitBranch,
  Layers,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Zap,
} from 'lucide-react';

export const Lec8VitalPulpImmature: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d_rep' | 'vital_pulp' | 'apexification' | 'reps_protocol'>('3d_rep');

  return (
    <div className="space-y-6">
      {/* Lecture Title Hero */}
      <div className="bg-gradient-to-r from-[#0B1F4D] to-[#1B3A8C] rounded-2xl p-6 text-white shadow-xl border border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="bg-[#C9A24B] text-[#0B1F4D] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Lecture 8 • Trauma 3 • Pedodontics 5th Year
            </span>
            <span className="text-xs font-semibold text-gray-300">
              Baghdad College of Dentistry • Prof. Dr. Aseel Haidar
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-2">
            Vital Pulp Exposures, Apexification &amp; Regenerative Endodontics (REPs)
          </h2>
          <p className="text-sm text-gray-200 max-w-3xl leading-relaxed">
            Managing complicated crown fractures in young permanent teeth: Apexogenesis (Cvek pulpotomy) versus Apexification (MTA plug) and biological tissue engineering through Regenerative Endodontic Procedures (REPs).
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {(
          [
            ['3d_rep', '1. 3D Immature Tooth & REP Simulator', Sparkles],
            ['vital_pulp', '2. Vital Pulp Choices (Cvek vs Cervical)', Layers],
            ['apexification', '3. Apexification (Ca(OH)₂ vs MTA)', GitBranch],
            ['reps_protocol', '4. Complete AAE REP Clinical Protocol', Zap],
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

      {/* Tab 1: 3D Simulator */}
      {activeTab === '3d_rep' && (
        <div className="space-y-4">
          <ToothTrauma3D
            pathology="pulpal_necrosis"
            allowPathologyChange={false}
            allowRepStepChange={true}
            title="3D Immature Tooth &amp; Regenerative Endodontics (REP) Simulator"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <span className="font-bold text-[#1B3A8C] block text-sm mb-1">
                1. Stem Cells (SCAP)
              </span>
              <p className="text-gray-600">
                Stem cells from apical papilla (SCAP) survive periapical necrosis due to abundant collateral vascular supply at the open apex. Over-instrumentation brings these multipotent cells into the root canal space.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <span className="font-bold text-[#1B3A8C] block text-sm mb-1">
                2. Scaffold (Blood Clot)
              </span>
              <p className="text-gray-600">
                A 3D biological matrix for cell proliferation, migration, and revascularization provided by the induced intracanal blood clot.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <span className="font-bold text-[#1B3A8C] block text-sm mb-1">
                3. Growth Factors (EDTA)
              </span>
              <p className="text-gray-600">
                Conditioning dentinal canal walls with <strong>17% EDTA</strong> exposes native dentin matrix proteins and releases growth factors (TGF-β1, VEGF) that stimulate odontoblastic differentiation!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Vital Pulp Choices */}
      {activeTab === 'vital_pulp' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0B1F4D]">
                1. Cvek Shallow Pulpotomy (Lec 8 p.2)
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Apexogenesis Gold Standard
              </span>
            </div>
            <p className="text-gray-600">
              Indicated in traumatized immature permanent teeth with vital pulp exposure. Only <strong>1 to 2 mm of coronal pulp tissue is removed</strong> at the site of exposure, preserving the uninflamed healthy radicular pulp.
            </p>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
              <span className="font-bold block">Key Success Criteria:</span>
              <p>• Clean excision without crushing/tearing tissue.</p>
              <p>• Hemorrhage readily controlled with moist cotton pellet within 2-4 minutes.</p>
              <p>• Bright reddish-pink pulp color with a concave meniscus.</p>
              <p>• Direct coverage with MTA, Biodentine, or Ca(OH)₂ with hermetic coronal seal.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0B1F4D]">
                2. Direct Pulp Capping Criteria
              </h3>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Strict Limitations
              </span>
            </div>
            <p className="text-gray-600">
              Direct pulp capping has limited indications following trauma and is only selected when:
            </p>
            <div className="bg-[#FAF8F3] p-3 rounded-xl border border-amber-200 text-gray-700 space-y-1">
              <p>a. Patient is seen <strong>within 1 to 2 hours</strong> after the injury.</p>
              <p>b. The vital pulp exposure is <strong>pin-point small (&lt;1 mm)</strong>.</p>
              <p>c. Sufficient crown remains to retain a temporary restoration that completely excludes oral fluids.</p>
              <p>d. Rubber dam isolation can be cleanly maintained.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Apexification */}
      {activeTab === 'apexification' && (
        <div className="bg-white p-5 rounded-2xl border border-[#C9A24B]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#0B1F4D]">
                Apexification in Immature Teeth with Pulpal Necrosis (Lec 8 p.4-5)
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Blunderbuss Canals (Divergent Open Apex) Where Hermetic Condensation is Impossible
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Apexification Comparison
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* CaOH2 */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
              <span className="font-extrabold text-sm text-[#0B1F4D] block">
                Traditional Ca(OH)₂ Multi-Visit Method:
              </span>
              <p className="text-gray-600">
                Canal instrumented, dried, and filled with thick paste of calcium hydroxide (often with CMCP). Replaced every 3 to 6 months until a calcific barrier ("apical plug") forms across the open foramen (typically 6 to 18 months).
              </p>
              <div className="p-2.5 bg-red-50 text-red-900 rounded-lg border border-red-200 font-semibold">
                ⚠️ Major Disadvantage: Long duration of therapy and high risk of cervical root fracture because root dentinal walls remain thin and brittle!
              </div>
            </div>

            {/* MTA Plug */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-2">
              <span className="font-extrabold text-sm text-emerald-950 block">
                Modern MTA / Biodentine Apical Plug:
              </span>
              <p className="text-emerald-900">
                Following chemical debridement and 1 week of Ca(OH)₂ disinfection, a <strong>4 mm apical plug of Mineral Trioxide Aggregate (MTA) or Biodentine</strong> is condensed at the apical third using an endodontic plugger.
              </p>
              <div className="p-2.5 bg-white text-emerald-900 rounded-lg border border-emerald-300 font-semibold">
                ✓ Major Advantage: Completed in just 1 to 2 appointments! Allows immediate thermoplastic gutta-percha obturation and coronal resin restoration.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AAE Protocol for REPs */}
      {activeTab === 'reps_protocol' && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#0B1F4D] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#C9A24B]" />
            American Association of Endodontists (AAE) Treatment Protocol (Lec 8 p.8):
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* First Appointment */}
            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50 space-y-2">
              <span className="font-black text-sm text-[#1B3A8C] block">First Appointment Protocol:</span>
              <ul className="space-y-1.5 text-gray-700">
                <li>1. Local anesthesia and rubber dam isolation. Access opening into pulp chamber.</li>
                <li>2. Radiograph to verify working length (1 mm short of root end).</li>
                <li>3. <strong>Copious gentle irrigation:</strong> 20 mL of <strong>1.5% Sodium Hypochlorite (NaOCl)</strong> for 5 minutes, followed by 20 mL sterile saline. Use side-vented closed-end needle to prevent periapical extrusion.</li>
                <li>4. Dry canal with paper points.</li>
                <li>5. Place <strong>Triple Antibiotic Paste (TAP)</strong> (metronidazole, ciprofloxacin, minocycline 0.1 mg/mL) or Calcium Hydroxide paste using Lentulo spiral.</li>
                <li>6. Seal access with 3-4 mm Cavit / glass ionomer for 1 to 4 weeks.</li>
              </ul>
            </div>

            {/* Second Appointment */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-2">
              <span className="font-black text-sm text-[#0B1F4D] block">Second Appointment Protocol:</span>
              <ul className="space-y-1.5 text-gray-700">
                <li>1. Evaluate for resolution of symptoms and sinus tracts.</li>
                <li>2. Anesthetize with <strong>3% Mepivacaine WITHOUT vasoconstrictor (no epinephrine)</strong> to facilitate bleeding!</li>
                <li>3. Remove intracanal medicament by gentle irrigation with 20 mL of <strong>17% EDTA</strong>.</li>
                <li>4. Dry canal with paper points.</li>
                <li>5. <strong>Induce bleeding:</strong> Over-instrument 2 mm beyond apical foramen with an endodontic file to evoke blood flow into canal up to 3 mm below CEJ.</li>
                <li>6. Allow blood clot scaffold to form (15 min). Place CollaPlug matrix and <strong>3-4 mm White MTA barrier</strong> followed by permanent glass ionomer / composite resin.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
