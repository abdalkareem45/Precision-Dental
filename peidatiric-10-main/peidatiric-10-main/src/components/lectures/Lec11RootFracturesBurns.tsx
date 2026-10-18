import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { ToothTrauma3D } from '../3d/ToothTrauma3D';
import {
  Sparkles,
  Layers,
  AlertTriangle,
  Flame,
  Zap,
  Activity,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export const Lec11RootFracturesBurns: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d_fracture' | 'healing_types' | 'burns' | 'splint_protocol'>('3d_fracture');
  const [fractureLevel, setFractureLevel] = useState<'cervical' | 'middle' | 'apical'>('middle');

  return (
    <div className="space-y-6">
      {/* Lecture Title Hero */}
      <div className="bg-gradient-to-r from-[#0B1F4D] to-[#1B3A8C] rounded-2xl p-6 text-white shadow-xl border border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="bg-[#C9A24B] text-[#0B1F4D] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Lecture 11 • Trauma 6 • Pedodontics 5th Year
            </span>
            <span className="text-xs font-semibold text-gray-300">
              Baghdad College of Dentistry • Prof. Dr. Aseel Haidar
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-2">
            Management of Root Fractures &amp; Pediatric Oral Burns
          </h2>
          <p className="text-sm text-gray-200 max-w-3xl leading-relaxed">
            Shearing biomechanics, fracture plane levels (Apical vs Middle vs Cervical 3rd), the 4 histological healing responses, rigid wire stabilization (0.032–0.036"), and electrical burn microstomia prevention.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {(
          [
            ['3d_fracture', '1. 3D Root Fracture Simulator', Sparkles],
            ['healing_types', '2. The 4 Tissue Healing Types', Layers],
            ['splint_protocol', '3. Rigid Splinting & Vertical Fractures', Activity],
            ['burns', '4. Pediatric Electrical Oral Burns', Zap],
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
      {activeTab === '3d_fracture' && (
        <div className="space-y-4">
          <ToothTrauma3D
            pathology={
              fractureLevel === 'apical'
                ? 'apical_root_fracture'
                : fractureLevel === 'cervical'
                ? 'cervical_root_fracture'
                : 'middle_root_fracture'
            }
            allowPathologyChange={false}
            fractureLevel={fractureLevel}
            onFractureLevelChange={setFractureLevel}
            title={`3D Root Fracture: ${fractureLevel.toUpperCase()} Third`}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-xl border transition-all ${
                fractureLevel === 'apical'
                  ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm text-emerald-900">1. Apical Third</span>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Best Prognosis!
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Usually requires <strong>NO active treatment</strong>. The apical fragment and coronal fragment stay in close bony proximity; tooth remains vital and calcific callus spontaneously repairs the fracture plane!
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border transition-all ${
                fractureLevel === 'middle'
                  ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm text-amber-900">2. Middle Third</span>
                <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Rigid Splinting
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Reduce displaced coronal fragment with digital pressure. Apply <strong>rigid splint (0.032 to 0.036" wire) for 4 to 8 weeks</strong>. If necrosis occurs, perform RCT on coronal fragment only with fiber post splint.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border transition-all ${
                fractureLevel === 'cervical'
                  ? 'bg-red-50 border-red-300 ring-2 ring-red-500'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm text-red-900">3. Cervical / Coronal Third</span>
                <span className="text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                  Guarded / Poor
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Fracture line communicates with oral sulcus. High risk of bacterial ingress. If remaining root is long enough: gingivectomy/osteotomy + RCT + post and core crown; otherwise <strong>extraction</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: The 4 Healing Types */}
      {activeTab === 'healing_types' && (
        <div className="bg-white p-6 rounded-2xl border border-[#C9A24B]/30 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#0B1F4D]">
            The 4 Histological Tissue Reactions After Root Fracture (Lec 11 p.2-3):
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <span className="font-extrabold text-sm text-emerald-950 block">
                1. Healing with Calcified Tissue (Callus)
              </span>
              <p className="text-emerald-900 leading-relaxed">
                The most ideal response. Characterized by a uniting hard-tissue callus consisting of dentin, osteodentin, or cementum directly bridging the fractured root fragments.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5">
              <span className="font-extrabold text-sm text-blue-950 block">
                2. Healing with Interposition of Connective Tissue
              </span>
              <p className="text-blue-900 leading-relaxed">
                The fractured root surfaces are covered by cementum, with collagenous connective tissue fibers (similar to normal PDL) joining the two fragments together.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-1.5">
              <span className="font-extrabold text-sm text-purple-950 block">
                3. Healing with Interposition of Bone &amp; Connective Tissue
              </span>
              <p className="text-purple-900 leading-relaxed">
                A solid bony bridge and connective tissue layer form between the separated fragments, visible radiographically as separate root entities.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-1.5">
              <span className="font-extrabold text-sm text-red-950 block">
                4. Interposition of Granulation Tissue (Failure / Non-Healing)
              </span>
              <p className="text-red-900 leading-relaxed">
                The least favorable response. The fracture will not heal spontaneously. Associated with necrosis of the coronal pulp portion, inflammatory fistulas, and mobility. Requires endodontic therapy or extraction.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Splinting & Vertical Fractures */}
      {activeTab === 'splint_protocol' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-xs leading-relaxed space-y-3">
            <h3 className="text-sm font-extrabold text-[#0B1F4D] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1B3A8C]" />
              Rigid Wire Splinting for Root Fractures (Lec 11 p.3):
            </h3>
            <p className="text-gray-600">
              Unlike avulsion (which mandates flexible splints), root fractures require <strong>rigid fixation</strong> to prevent micromovement during hard tissue callus formation!
            </p>
            <div className="bg-[#FAF8F3] p-3 rounded-xl border border-amber-200 text-gray-700 space-y-1.5">
              <p>• Heavy rectangular wire: <strong>0.016 × 0.022 inch</strong></p>
              <p>• Heavy round wire: <strong>0.032 to 0.036 inch</strong></p>
              <p>• Immobilization duration: <strong>4 to 8 weeks</strong> (up to 12 weeks for complex multi-fragment cases).</p>
              <p>• Occlusal adjustment: Relieve contact so tooth is protected during mastication.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-xs leading-relaxed space-y-3">
            <h3 className="text-sm font-extrabold text-[#0B1F4D] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Vertical Root Fractures (Lec 11 p.4-5):
            </h3>
            <p className="text-gray-600">
              Also called "Cracked Tooth Syndrome". Runs lengthwise from crown toward apex, commonly posterior teeth from traumatic occlusion or iatrogenic wedge pressures.
            </p>
            <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-red-900 space-y-1">
              <p>• <strong>Clinical Signs:</strong> Persistent dull pain, sharp pain elicited when biting on cotton applicator or rubber polishing wheel.</p>
              <p>• <strong>Single Rooted Teeth:</strong> Hopeless prognosis ➔ Extraction.</p>
              <p>• <strong>Multi-Rooted Teeth:</strong> Hemisection / root amputation, retaining undamaged root.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Pediatric Oral Burns */}
      {activeTab === 'burns' && (
        <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-extrabold text-[#0B1F4D]">
              Pediatric Electrical Oral Burns &amp; Microstomia Prevention (Lec 11 p.10)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200 space-y-2">
              <span className="font-bold text-[#1B3A8C] block text-sm">Etiology &amp; Demographics:</span>
              <p className="text-gray-600 leading-relaxed">
                Electrical burns occur most frequently in young children between <strong>6 months and 3 years of age</strong> (equal among boys and girls) who chew on live electrical extension cords or suck female appliance plugs.
              </p>
              <p className="text-gray-700">
                Saliva acts as an electrical conductor, generating extreme arc temperatures up to 3,000°C that cause full-thickness coagulative necrosis of the lips, commissures, tongue, and underlying alveolar bone.
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-900 space-y-2">
              <span className="font-bold block text-sm">Complications &amp; Treatment:</span>
              <p>
                • <strong>Microstomia:</strong> Secondary wound healing and intense myofibroblast scar contracture can severely constrict the oral opening, causing disfigurement and inability to open the mouth.
              </p>
              <p>
                • <strong>Oral Commissure Splints:</strong> Fixed or removable acrylic splint with lateral posts inserted within 1-2 weeks to maintain commissure width for 6 to 12 months!
              </p>
              <p>
                • <strong>Hemorrhage Warning:</strong> Labial artery rupture may occur around day 7-14 as the necrotic slough separates. Parents must be instructed on immediate compression. Tetanus booster is mandatory.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
