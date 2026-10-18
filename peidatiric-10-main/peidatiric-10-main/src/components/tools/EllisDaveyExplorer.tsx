import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { Layers, ShieldCheck, Stethoscope, ChevronRight } from 'lucide-react';

export const EllisDaveyExplorer: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number>(2);

  const classes = [
    {
      classNum: 1,
      title: 'Class I',
      name: 'Simple Enamel Fracture',
      tissues: 'Enamel only',
      symptoms: 'Rough edge, minor sensitivity, normal vitality',
      treatment: 'Smooth rough edges, fluoride varnish, or minor composite restoration.',
      badge: 'Uncomplicated',
    },
    {
      classNum: 2,
      title: 'Class II',
      name: 'Enamel & Dentin Fracture',
      tissues: 'Enamel + Dentin (Pulp not exposed)',
      symptoms: 'Sensitive to thermal & air stimuli, yellow dentin visible',
      treatment: 'Calcium hydroxide / glass ionomer base to seal dentinal tubules, followed by tooth fragment reattachment or composite resin.',
      badge: 'Tubule Protection',
    },
    {
      classNum: 3,
      title: 'Class III',
      name: 'Extensive Fracture with Vital Pulp Exposure',
      tissues: 'Enamel + Dentin + Dental Pulp',
      symptoms: 'Bleeding pulp horn, acute pain to touch/cold',
      treatment: 'Immature tooth (open apex): Cvek shallow pulpotomy with MTA/Ca(OH)2 to maintain vitality for apexogenesis. Mature tooth: Pulpotomy or complete pulpectomy.',
      badge: 'Urgent Vital Pulp',
    },
    {
      classNum: 4,
      title: 'Class IV',
      name: 'Traumatized Non-Vital Tooth',
      tissues: 'Necrotic pulp (with or without crown loss)',
      symptoms: 'Discoloration (dark gray), loss of sensation to EPT/cold, periapical radiolucency',
      treatment: 'Mature tooth: Conventional RCT. Immature tooth with open apex: Apexification (MTA apical plug) or Regenerative Endodontic Procedure (REP).',
      badge: 'Endodontic Care',
    },
    {
      classNum: 5,
      title: 'Class V',
      name: 'Complete Avulsion',
      tissues: 'Complete loss of tooth from socket',
      symptoms: 'Empty bleeding socket, tooth outside mouth',
      treatment: 'Permanent: Replant immediately or transport in HBSS/milk; flexible splint 7-14 days. Primary: NEVER REPLANT!',
      badge: 'Emergency Action',
    },
    {
      classNum: 6,
      title: 'Class VI',
      name: 'Root Fracture',
      tissues: 'Cementum + Dentin + Radicular Pulp',
      symptoms: 'Mobility of coronal fragment, tenderness to percussion',
      treatment: 'Apical 3rd: Observation (best prognosis!). Middle 3rd: Rigid splint 4-8 weeks. Coronal 3rd: Gingivectomy + post/core or extraction.',
      badge: 'Rigid Splinting',
    },
    {
      classNum: 7,
      title: 'Class VII',
      name: 'Displacement without Fracture (Luxation)',
      tissues: 'Periodontal ligament & neurovascular bundle',
      symptoms: 'Intrusion (shorter), Extrusion (longer), Lateral (locked in bone)',
      treatment: 'Intrusion: watch for re-eruption (especially primary) vs surgical/ortho. Extrusion/Lateral: Digital reposition + flexible splint 2-4 weeks.',
      badge: 'PDL & Bone',
    },
    {
      classNum: 8,
      title: 'Class VIII',
      name: 'Fracture of Crown En Masse',
      tissues: 'Complete coronal detachment at cervical level',
      symptoms: 'Entire crown fractured off at gingival margin',
      treatment: 'Endodontic treatment of root followed by orthodontic extrusion or surgical crown lengthening and post-retained crown.',
      badge: 'Prosthetic Care',
    },
    {
      classNum: 9,
      title: 'Class IX',
      name: 'Traumatic Injuries of Primary Dentition',
      tissues: 'Deciduous teeth and alveolar structure',
      symptoms: 'Toddlers (1-3 yrs), high risk of permanent successor injury',
      treatment: 'Prioritize protection of the underlying permanent tooth germ! Extract if encroaching; never replant primary avulsions.',
      badge: 'Pediatric Deciduous',
    },
  ];

  const current = classes.find((c) => c.classNum === selectedClass) || classes[1];

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#C9A24B]/30 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#1B3A8C]/10 text-[#1B3A8C]">
            <Layers className="w-5 h-5 text-[#1B3A8C]" />
          </div>
          <div>
            <h3 className="font-montserrat font-bold text-base text-[#0B1F4D]">
              Ellis & Davey Traumatic Dental Injury Classification (Classes I – IX)
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Standard Pedodontic Diagnostic System (Lec 9 p.6 & Lec 15)
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#1B3A8C] bg-[#1B3A8C]/10 px-3 py-1 rounded-full">
          Select Class
        </span>
      </div>

      {/* Class Pills */}
      <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 mb-4">
        {classes.map((c) => (
          <button
            key={c.classNum}
            onClick={() => {
              soundFx.playClick();
              setSelectedClass(c.classNum);
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center ${
              selectedClass === c.classNum
                ? 'bg-[#1B3A8C] text-white shadow-md ring-2 ring-[#C9A24B]'
                : 'bg-[#FAF8F3] text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>{c.title}</span>
            <span className="text-[9px] font-normal opacity-80 truncate max-w-[60px]">
              {c.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Detail Display */}
      <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24B]">
              {current.title} : {current.badge}
            </span>
            <h4 className="text-base font-extrabold text-[#0B1F4D]">{current.name}</h4>
          </div>
          <span className="text-xs font-bold text-[#1B3A8C] bg-white px-2.5 py-1 rounded-lg border border-gray-200">
            Tissues: {current.tissues}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <span className="font-bold text-gray-700 block mb-1">Clinical Signs & Symptoms:</span>
            <p className="text-gray-600">{current.symptoms}</p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-amber-200">
            <span className="font-bold text-[#1B3A8C] block mb-1">Treatment Protocol:</span>
            <p className="text-gray-700 font-medium">{current.treatment}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
