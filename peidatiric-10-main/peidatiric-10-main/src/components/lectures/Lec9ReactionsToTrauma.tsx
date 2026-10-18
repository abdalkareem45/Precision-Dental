import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { ToothTrauma3D } from '../3d/ToothTrauma3D';
import { EllisDaveyExplorer } from '../tools/EllisDaveyExplorer';
import {
  Sparkles,
  Layers,
  AlertTriangle,
  Flame,
  HelpCircle,
  Activity,
  CheckCircle2,
  GitBranch,
} from 'lucide-react';

export const Lec9ReactionsToTrauma: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d_explorer' | 'ellis_davey' | 'pulpal_reactions' | 'tooth_bud'>('3d_explorer');

  return (
    <div className="space-y-6">
      {/* Lecture Title Hero */}
      <div className="bg-gradient-to-r from-[#0B1F4D] to-[#1B3A8C] rounded-2xl p-6 text-white shadow-xl border border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="bg-[#C9A24B] text-[#0B1F4D] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Lecture 9 • Trauma 4 • Pedodontics 5th Year
            </span>
            <span className="text-xs font-semibold text-gray-300">
              Baghdad College of Dentistry • Prof. Dr. Aseel Haidar
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-2">
            Reactions of the Tooth to Trauma &amp; Ellis &amp; Davey Classification
          </h2>
          <p className="text-sm text-gray-200 max-w-3xl leading-relaxed">
            Pathological pulpal sequelae following dental injuries: hyperemia, internal hemorrhage, calcific metamorphosis, internal resorption ("pink spot"), ankylosis, Turner's hypoplasia, and dilaceration.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {(
          [
            ['3d_explorer', '1. 3D Pathology Visualizer', Sparkles],
            ['ellis_davey', '2. Ellis & Davey Classification (I-IX)', Layers],
            ['pulpal_reactions', '3. Pulpal Necrosis Risk Hierarchy', Flame],
            ['tooth_bud', '4. Permanent Tooth Bud Reactions', GitBranch],
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

      {/* Tab 1: 3D Pathology Explorer */}
      {activeTab === '3d_explorer' && (
        <div className="space-y-4">
          <ToothTrauma3D
            pathology="internal_resorption"
            allowPathologyChange={true}
            title="3D Post-Trauma Tooth Pathology Explorer"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="font-extrabold text-red-700 block mb-1">Pulpal Hyperemia</span>
              <p className="text-gray-600">
                Blood congestion inside pulp chamber. Directing strong light to labial surface shows a transilluminated reddish coronal glow.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="font-extrabold text-gray-800 block mb-1">Internal Hemorrhage</span>
              <p className="text-gray-600">
                Capillary rupture deposits hemoglobin pigments into dentinal tubules. <strong>Dark gray/black coronal color indicates necrotic pulp</strong>.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="font-extrabold text-amber-700 block mb-1">Calcific Metamorphosis</span>
              <p className="text-gray-600">
                Progressive canal calcification. Gives a <strong>yellowish, opaque crown</strong>. In primary teeth, it undergoes normal root resorption.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="font-extrabold text-pink-700 block mb-1">Internal Resorption</span>
              <p className="text-gray-600">
                Destructive odontoclastic process. Appears as a distinctive <strong>"Pink Spot"</strong> where vascular pulp shines through thin enamel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ellis & Davey Classification */}
      {activeTab === 'ellis_davey' && (
        <div className="space-y-4">
          <EllisDaveyExplorer />
        </div>
      )}

      {/* Tab 3: Pulpal Necrosis Hierarchy */}
      {activeTab === 'pulpal_reactions' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-base font-extrabold text-[#0B1F4D]">
                Risk of Pulp Necrosis Hierarchy (From Lowest to Highest - Lec 9 p.3)
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Biomechanical Correlation of Injury Severity &amp; Neurovascular Disruption
              </p>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
              Lec 9 Page 3 Key Note
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                rank: '1. Lowest Risk',
                name: 'Concussion',
                risk: 'Low (~3%)',
                color: 'bg-emerald-500',
                desc: 'Injury to supporting tissues without abnormal loosening or displacement. Mild tenderness to percussion.',
              },
              {
                rank: '2. Low-Moderate Risk',
                name: 'Subluxation',
                risk: 'Moderate (~15%)',
                color: 'bg-teal-500',
                desc: 'Abnormal loosening (mobility) without displacement. Bleeding from gingival crevice.',
              },
              {
                rank: '3. Moderate-High Risk',
                name: 'Extrusive Luxation',
                risk: 'High (~50-65%)',
                color: 'bg-amber-500',
                desc: 'Partial axial displacement out of socket. Apical neurovascular bundle is severely stretched or torn.',
              },
              {
                rank: '4. Very High Risk',
                name: 'Lateral Luxation',
                risk: 'Very High (~80%)',
                color: 'bg-orange-500',
                desc: 'Displacement other than axial with alveolar cortical plate comminution/crushing.',
              },
              {
                rank: '5. Highest Risk',
                name: 'Intrusive Luxation',
                risk: '100% Necrosis Risk',
                color: 'bg-red-600',
                desc: 'Tooth driven deep into alveolar bone. Total severance of apical blood supply and crushing of PDL. Almost 100% pulpal necrosis and external root resorption!',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-gray-200 bg-[#FAF8F3] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.rank}</span>
                    <h4 className="font-extrabold text-sm text-[#0B1F4D]">{item.name}</h4>
                  </div>
                  <p className="text-xs text-gray-600 max-w-xl">{item.desc}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className={`text-xs font-black text-white px-3 py-1 rounded-full ${item.color}`}>
                    {item.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <strong>Protective Energy Dissipation Principle (Lec 9 p.3):</strong> A tooth receiving an injury that causes a <strong>coronal crown fracture may actually have a BETTER pulpal prognosis</strong> than a tooth that sustains a severe blow without fracturing the crown! Part of the kinetic energy dissipates as the crown fractures, rather than being fully absorbed by the periodontium and apical vessels!
          </div>
        </div>
      )}

      {/* Tab 4: Tooth Bud Reactions */}
      {activeTab === 'tooth_bud' && (
        <div className="bg-white p-6 rounded-2xl border border-[#C9A24B]/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-[#1B3A8C]" />
            <h3 className="text-base font-extrabold text-[#0B1F4D]">
              Reactions of Permanent Tooth Buds to Injury of Primary Teeth (Lec 9 p.5-6)
            </h3>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Due to the close anatomical proximity between the apices of deciduous anterior teeth and the underlying permanent tooth germ, trauma to primary teeth can induce lasting permanent successor defects:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50 space-y-2">
              <span className="font-black text-sm text-[#1B3A8C] block">
                1. Hypocalcification &amp; Hypoplasia (Turner's Tooth)
              </span>
              <p className="text-gray-600 leading-relaxed">
                Disturbance in enamel matrix formation produces irregular enamel thickness and pits. Malformed crown with small yellowish-brown pigmented hypoplastic areas. Can be aesthetically restored with resin bonding.
              </p>
            </div>

            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50 space-y-2">
              <span className="font-black text-sm text-[#1B3A8C] block">
                2. Reparative Dentine Production
              </span>
              <p className="text-gray-600 leading-relaxed">
                Severe trauma removes developing enamel epithelium, stimulating subjacent odontoblasts to produce reparative dentin bridges over areas without enamel to protect the dental pulp.
              </p>
            </div>

            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50 space-y-2">
              <span className="font-black text-sm text-[#1B3A8C] block">
                3. Dilaceration (Acute Angulation)
              </span>
              <p className="text-gray-600 leading-relaxed">
                Tooth with a sharp, severe hook-like bend in the crown or root. Most commonly seen in maxillary permanent central incisors after intrusion of deciduous predecessor. Usually fails to erupt and requires surgical extraction or orthodontic traction.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
