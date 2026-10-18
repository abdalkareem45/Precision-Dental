/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AngleClass, BsiIncisorClass } from '../../types/ortho';
import { ThreeDentalArchScene } from '../three/ThreeDentalArchScene';
import { BsiIncisorSimulator } from '../tools/BsiIncisorSimulator';
import {
  Sparkles,
  Layers,
  Shield,
  Key,
  Compass,
  CheckCircle,
  HelpCircle,
  Maximize2,
  ChevronRight,
  Info
} from 'lucide-react';

export const Lecture3View: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'angles' | 'bsi_sim' | 'andrews' | 'mutually_protected' | 'concepts'>('angles');
  const [selectedAngleClass, setSelectedAngleClass] = useState<AngleClass>('normal');
  const [activeAndrewsKey, setActiveAndrewsKey] = useState<number>(1);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-10 border border-[#C9A24B]/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DFC17B] uppercase tracking-wider">
              <span>Department of Orthodontics</span>
              <span>·</span>
              <span>5th Year Curriculum</span>
              <span>·</span>
              <span>Lecture 3</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
              Occlusion & Malocclusion Concepts
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore gold-standard orthodontic occlusion: Centric Relation vs Centric Occlusion, Angle's molar classification, Andrews' Six Keys, Mutually Protected Occlusion, and the BSI Incisor Simulator.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="glass-panel-subtle px-4 py-3 rounded-2xl border border-[#C9A24B]/30 text-center">
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Gnathology</span>
              <span className="text-base font-bold text-[#DFC17B]">Static & Dynamic</span>
            </div>
            <div className="glass-panel-subtle px-4 py-3 rounded-2xl border border-[#C9A24B]/30 text-center">
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Andrews' Model</span>
              <span className="text-base font-bold text-white">6 Keys System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {[
          { id: 'angles', label: "1. 3D Angle's Classification", icon: Compass },
          { id: 'bsi_sim', label: '2. BSI Incisor Cross-Section (2D)', icon: Layers },
          { id: 'andrews', label: "3. Andrews' Six Keys", icon: Key },
          { id: 'mutually_protected', label: '4. Mutually Protected Occlusion', icon: Shield },
          { id: 'concepts', label: '5. Concepts & Definitions (CO vs CR)', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] shadow-lg font-extrabold'
                  : 'glass-panel-subtle text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Angle's Classification with Upgraded 3D Scene */}
      {activeTab === 'angles' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider">Edward H. Angle (1890s)</span>
            <h2 className="text-xl font-bold text-white">Angle's Classification of Malocclusion</h2>
            <p className="text-xs text-slate-300">
              Angle's postulate states that the <strong>maxillary first permanent molars are the key to occlusion</strong>.
            </p>
          </div>

          {/* Embedded 3D Occlusion Arch Scene */}
          <ThreeDentalArchScene
            initialAngleClass={selectedAngleClass}
            onAngleChange={(cls) => setSelectedAngleClass(cls)}
          />

          {/* Interactive Classification Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                id: 'normal',
                title: "Angle's Normal Occlusion",
                molar: 'Mesiobuccal cusp of maxillary 1st molar occludes in the buccal groove of mandibular 1st molar.',
                line: 'Teeth arranged along a smoothly curving line of occlusion.',
                accent: 'border-emerald-500',
              },
              {
                id: 'class_i',
                title: "Angle's Class I Malocclusion",
                molar: 'Normal molar relationship (MB cusp in buccal groove).',
                line: 'Line of occlusion is incorrect due to malposed teeth, rotations, crowding or spacing.',
                accent: 'border-blue-500',
              },
              {
                id: 'class_ii',
                title: "Angle's Class II Malocclusion",
                molar: 'Mandibular molar is distally positioned relative to maxillary molar.',
                line: 'Distocclusion: Buccal groove of lower 1st molar is distal to MB cusp of upper 1st molar.',
                accent: 'border-amber-500',
              },
              {
                id: 'class_iii',
                title: "Angle's Class III Malocclusion",
                molar: 'Mandibular molar is mesially positioned relative to maxillary molar.',
                line: 'Mesiocclusion: Buccal groove of lower 1st molar is mesial to MB cusp of upper 1st molar.',
                accent: 'border-rose-500',
              },
            ].map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedAngleClass(card.id as AngleClass)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedAngleClass === card.id
                    ? `${card.accent} glass-panel shadow-lg scale-102`
                    : 'glass-panel-subtle border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white">{card.title}</h4>
                  {selectedAngleClass === card.id && (
                    <span className="w-2 h-2 rounded-full bg-[#C9A24B] shadow-[0_0_8px_#C9A24B]" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 mb-2">
                  <strong>Molar:</strong> {card.molar}
                </p>
                <p className="text-[11px] text-slate-400">
                  <strong>Line:</strong> {card.line}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: BSI Incisor Simulator */}
      {activeTab === 'bsi_sim' && (
        <BsiIncisorSimulator />
      )}

      {/* Tab 3: Andrews' Six Keys */}
      {activeTab === 'andrews' && (
        <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider">Lawrence Andrews (1972)</span>
            <h2 className="text-xl font-bold text-white">Andrews' Six Keys of Normal Occlusion</h2>
            <p className="text-xs text-slate-300">
              Analyzed 120 non-orthodontic normal casts to define 6 golden criteria necessary for ideal static occlusion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              {[
                { num: 1, title: 'Key 1: Molar Relationship', summary: 'MB cusp in groove + distal marginal ridge contact' },
                { num: 2, title: 'Key 2: Crown Angulation (Tip)', summary: 'Gingival portion distal to occlusal portion' },
                { num: 3, title: 'Key 3: Crown Inclination (Torque)', summary: 'Positive for upper incisors, lingual for all others' },
                { num: 4, title: 'Key 4: Absence of Rotations', summary: 'Zero unwanted tooth rotations along arch' },
                { num: 5, title: 'Key 5: Absence of Spacing', summary: 'Tight proximal contacts throughout arch' },
                { num: 6, title: 'Key 6: Occlusal Plane (Spee)', summary: 'Flat occlusal plane (depth 0 to 1.5mm)' },
              ].map((k) => (
                <button
                  key={k.num}
                  onClick={() => setActiveAndrewsKey(k.num)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all ${
                    activeAndrewsKey === k.num
                      ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] border-[#DFC17B] shadow-md font-extrabold'
                      : 'glass-panel-subtle text-slate-300 hover:text-white border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{k.title}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${activeAndrewsKey === k.num ? 'text-[#071330]' : 'text-slate-400'}`} />
                  </div>
                  <span className={`text-[11px] block mt-1 ${activeAndrewsKey === k.num ? 'text-[#071330]/80 font-medium' : 'text-slate-400'}`}>
                    {k.summary}
                  </span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 glass-panel-subtle rounded-2xl border border-[#C9A24B]/30 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#C9A24B] text-[#071330] flex items-center justify-center font-black text-sm">
                    {activeAndrewsKey}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {activeAndrewsKey === 1 && 'Key 1: Molar Relationship (Refined Angle)'}
                    {activeAndrewsKey === 2 && 'Key 2: Crown Angulation (Mesiodistal Tip)'}
                    {activeAndrewsKey === 3 && 'Key 3: Crown Inclination (Torque)'}
                    {activeAndrewsKey === 4 && 'Key 4: Absence of Rotations'}
                    {activeAndrewsKey === 5 && 'Key 5: Absence of Spacing (Tight Contacts)'}
                    {activeAndrewsKey === 6 && 'Key 6: Occlusal Plane (Flat Curve of Spee)'}
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider">Andrews Criterion</span>
              </div>

              {activeAndrewsKey === 1 && (
                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p>
                    <strong>Andrews refined Angle's first molar relationship:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 bg-[#071330]/70 p-4 rounded-xl border border-white/10">
                    <li>The mesiobuccal cusp of the upper first permanent molar falls within the groove between the mesial and middle cusps of the lower first permanent molar.</li>
                    <li><strong>Crucial second criterion:</strong> The <em>distal marginal ridge</em> of the upper first permanent molar occludes with the <em>mesial marginal ridge</em> of the lower second permanent molar.</li>
                  </ul>
                  <p className="text-slate-400">
                    If the upper molar is upright and lacks this distal marginal ridge occlusion, the entire arch relationship drifts Class II!
                  </p>
                </div>
              )}

              {activeAndrewsKey === 2 && (
                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p>
                    <strong>Crown Angulation (Mesiodistal Tip):</strong>
                  </p>
                  <div className="bg-[#071330]/70 p-4 rounded-xl border border-white/10">
                    The <strong>gingival portion</strong> of the long axis of each tooth crown is located <strong>distal</strong> to the occlusal portion of that axis. The degree of tip varies with each tooth type.
                  </div>
                </div>
              )}

              {activeAndrewsKey === 3 && (
                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p>
                    <strong>Crown Inclination (Labiolingual or Buccolingual Torque):</strong>
                  </p>
                  <div className="bg-[#071330]/70 p-4 rounded-xl border border-white/10 space-y-2">
                    <div>
                      <strong className="text-[#60A5FA]">Upper Incisors:</strong> The occlusal portion of the crown's labial surface is labial to the gingival portion (positive torque).
                    </div>
                    <div>
                      <strong className="text-[#60A5FA]">All Other Crowns:</strong> The occlusal portion of the labial or buccal surface is lingual to the gingival portion (negative torque).
                    </div>
                  </div>
                </div>
              )}

              {activeAndrewsKey === 4 && (
                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p><strong>Absence of Rotations:</strong></p>
                  <div className="bg-[#071330]/70 p-4 rounded-xl border border-white/10">
                    There should be a complete absence of any tooth rotations within the dental arches. Rotated anterior teeth narrow the arch; rotated molars occupy excess perimeter.
                  </div>
                </div>
              )}

              {activeAndrewsKey === 5 && (
                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p><strong>Absence of Spacing (Tight Contacts):</strong></p>
                  <div className="bg-[#071330]/70 p-4 rounded-xl border border-white/10">
                    There should be an absence of any spacing within the dental arches. Proximal contact points should be tight and closed.
                  </div>
                </div>
              )}

              {activeAndrewsKey === 6 && (
                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p><strong>Occlusal Plane (Curve of Spee):</strong></p>
                  <div className="bg-[#071330]/70 p-4 rounded-xl border border-white/10">
                    The occlusal plane should be <strong>flat</strong> (or with a slight curve of Spee not exceeding 1.5mm). A deep curve of Spee traps maxillary teeth.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Mutually Protected Occlusion */}
      {activeTab === 'mutually_protected' && (
        <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider">Dynamic Gnathology</span>
            <h2 className="text-xl font-bold text-white">Mutually Protected Occlusion</h2>
            <p className="text-xs text-slate-300">
              In an ideal functional occlusion, the anterior and posterior dentitions protect each other across mandibular movements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-blue-950/40 rounded-2xl border border-blue-500/40 space-y-4">
              <span className="text-xs font-bold text-[#60A5FA] uppercase tracking-wider block">Rule 1: Anterior Protects Posterior</span>
              <h3 className="text-base font-bold text-white">Disclusion During Movements</h3>
              
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-[#071330]/80 rounded-xl border border-white/10">
                  <strong className="text-[#DFC17B] block mb-1">Incisal Guidance in Protrusion:</strong>
                  When the mandible glides forward into protrusion, the lower incisal edges slide down the palatal surfaces of upper incisors, causing immediate and permanent posterior disclusion.
                </div>

                <div className="p-3 bg-[#071330]/80 rounded-xl border border-white/10">
                  <strong className="text-[#DFC17B] block mb-1">Canine Guidance vs Group Function in Lateral Excursion:</strong>
                  <ul className="list-disc list-inside space-y-1 mt-1 text-slate-300">
                    <li><strong>Canine Guidance:</strong> Contact maintained exclusively on working side canine.</li>
                    <li><strong>Group Function:</strong> Contacts maintained between several teeth on working side.</li>
                    <li><strong>Absence of Non-Working Interferences:</strong> Zero contacts on non-working side!</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 bg-amber-950/40 rounded-2xl border border-amber-500/40 space-y-4">
              <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider block">Rule 2: Posterior Protects Anterior</span>
              <h3 className="text-base font-bold text-white">Centric Occlusion Heavy Loading</h3>
              
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-[#071330]/80 rounded-xl border border-white/10">
                  <strong className="text-[#DFC17B] block mb-1">Simultaneous Bilateral Contacts:</strong>
                  In the intercuspal position (Centric Occlusion), heavy axial forces are absorbed exclusively by multiple simultaneous bilateral contacts of posterior teeth.
                </div>

                <div className="p-3 bg-[#071330]/80 rounded-xl border border-white/10">
                  <strong className="text-[#DFC17B] block mb-1">Anterior Teeth Out of Heavy Contact:</strong>
                  The incisor teeth are slightly out of contact (light shim-stock contact only), protecting anterior roots from shear forces.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Concepts & Definitions */}
      {activeTab === 'concepts' && (
        <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div>
            <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider">Gnathological Gold Standards</span>
            <h2 className="text-xl font-bold text-white">Gold Standard Occlusion Definitions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[#071330]/80 rounded-2xl border border-white/10 space-y-3">
              <span className="text-xs font-bold text-[#60A5FA] uppercase tracking-wider block">Tooth-Determined</span>
              <h3 className="text-base font-bold text-white">Centric Occlusion (CO / MIP)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mandibular position when opposing occlusal surfaces provide maximum planned contact and/or intercuspation.
              </p>
            </div>

            <div className="p-5 bg-[#071330]/80 rounded-2xl border border-white/10 space-y-3">
              <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider block">Joint-Determined</span>
              <h3 className="text-base font-bold text-white">Centric Relation (CR)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Condyles in their most superior position in glenoid fossa against the articular eminence, independent of tooth contact.
              </p>
            </div>

            <div className="p-5 bg-[#071330]/80 rounded-2xl border border-white/10 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Tooth-Joint Determined</span>
              <h3 className="text-base font-bold text-white">Centric Relation Occlusion (CRO)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Occlusion of teeth when the mandible is in centric relation (Retruded Contact Position - RCP).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
