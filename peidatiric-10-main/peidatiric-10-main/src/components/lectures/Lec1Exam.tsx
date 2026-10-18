import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import {
  FileText,
  UserCheck,
  Activity,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Smile,
  Shield,
  Stethoscope,
  Move,
} from 'lucide-react';

export const Lec1Exam: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'extraoral' | 'tmj' | 'planning'>('overview');
  const [mouthOpeningMm, setMouthOpeningMm] = useState<number>(42);
  const [lipCompetence, setLipCompetence] = useState<'competent' | 'incompetent'>('competent');
  const [handSign, setHandSign] = useState<'normal' | 'sucking' | 'clubbing' | 'cold_clammy'>('normal');

  return (
    <div className="space-y-6">
      {/* Lecture Title Hero */}
      <div className="bg-gradient-to-r from-[#0B1F4D] to-[#1B3A8C] rounded-2xl p-6 text-white shadow-xl border border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="bg-[#C9A24B] text-[#0B1F4D] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Lecture 1 • Pedodontics 5th Year
            </span>
            <span className="text-xs font-semibold text-gray-300">
              Baghdad College of Dentistry • Assist. Prof. Dr. Aseel Haidar
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-2">
            Examination of the Mouth &amp; Other Relevant Structures
          </h2>
          <p className="text-sm text-gray-200 max-w-3xl leading-relaxed">
            A comprehensive pediatric evaluation requires recording a detailed history (medical, dental, familial), extraoral general survey, TMJ analysis, and formulating a sequential treatment plan with parental anticipatory guidance.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {(
          [
            ['overview', '1. History & Child Data Challenges', FileText],
            ['extraoral', '2. Extraoral & Physical Signs', Stethoscope],
            ['tmj', '3. TMJ & Jaw Mechanics Simulator', Move],
            ['planning', '4. Treatment Planning & Priorities', Shield],
          ] as const
        ).map(([tabId, label, Icon]) => (
          <button
            key={tabId}
            onClick={() => {
              soundFx.playClick();
              setActiveSubTab(tabId);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === tabId
                ? 'bg-[#1B3A8C] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4 text-[#C9A24B]" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: History & Child Challenges */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#0B1F4D] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Why Obtaining Accurate Data in Children is Difficult:
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              According to pedodontic clinical principles (Lec 1 page 1), pediatric anamnesis poses unique obstacles:
            </p>

            <ul className="space-y-2.5 text-xs text-gray-700">
              {[
                'Parents or guardians provide the history, not the child themselves.',
                'Impossible to observe everything a child does or says at home or school.',
                'Children do not behave in the dental clinic the same way they do at home.',
                'Data reported by parents and teachers may be inaccurate or exaggerated.',
                'Information depends on the emotional maturity of the accompanying adult.',
                'Unless notes are made immediately, parents may forget subtle symptoms.',
                'Deliberate distortion by parents to present the child or themselves in a favorable light.',
              ].map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#FAF8F3] p-2.5 rounded-xl border border-amber-100">
                  <span className="w-5 h-5 rounded-full bg-[#1B3A8C] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[#C9A24B]/30 shadow-sm">
              <h3 className="text-base font-extrabold text-[#0B1F4D] mb-2 flex items-center gap-2">
                <Smile className="w-5 h-5 text-[#C9A24B]" />
                Timing of First Dental Examination:
              </h3>
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
                <strong>Standard Recommendation:</strong> The first dental examination should be performed <strong>at the time of the eruption of the first primary tooth and no later than 12 months of age</strong>!
                <br />
                Early detection provides anticipatory guidance, dietary counseling, and prevention of Early Childhood Caries (ECC).
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <h3 className="text-base font-extrabold text-[#0B1F4D] mb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#1B3A8C]" />
                Components of Complete Pediatric Oral Examination:
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  '1. General Growth & Height',
                  '2. Chief Complaint (Pain/Swelling)',
                  '3. Extraoral Soft Tissue & TMJ',
                  '4. Intraoral Soft Tissues (3 C’s)',
                  '5. Oral Hygiene & Periodontium',
                  '6. Intraoral Hard Tissue (Caries)',
                  '7. Developing Occlusion',
                  '8. Caries Risk & Behavior Rating',
                ].map((comp, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 font-semibold text-gray-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Extraoral & Physical Signs */}
      {activeSubTab === 'extraoral' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hands Diagnostic Explorer */}
            <div className="bg-white rounded-2xl p-5 border border-[#C9A24B]/30 shadow-sm md:col-span-2">
              <h3 className="text-base font-extrabold text-[#0B1F4D] mb-2 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#1B3A8C]" />
                Interactive Hand &amp; Finger Signs (Lec 1 Page 5):
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Holding the patient's hand upon greeting provides vital clues before the child even sits in the dental chair:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {(
                  [
                    ['normal', 'Normal Warm Hand', 'Warm, dry, healthy skin'],
                    ['cold_clammy', 'Cold & Clammy / Bitten Nails', 'Apprehension & acute dental anxiety!'],
                    ['sucking', 'Callused / Clean Digit', 'Persistent thumb/digit sucking habit'],
                    ['clubbing', 'Digital Clubbing / Cyanosis', 'Congenital heart disease (IE Risk!)'],
                  ] as const
                ).map(([id, title, desc]) => (
                  <button
                    key={id}
                    onClick={() => {
                      soundFx.playClick();
                      setHandSign(id);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      handSign === id
                        ? 'bg-[#1B3A8C] text-white shadow-md border-[#1B3A8C]'
                        : 'bg-[#FAF8F3] text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-bold text-xs block mb-1">{title}</span>
                    <span className="text-[10px] opacity-80">{desc}</span>
                  </button>
                ))}
              </div>

              {/* Hand Sign Clinical Interpretation */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                {handSign === 'normal' && (
                  <p>
                    <strong>Normal Hand:</strong> Warm, dry, relaxed grip indicates comfortable baseline emotional state.
                  </p>
                )}
                {handSign === 'cold_clammy' && (
                  <p>
                    <strong>Cold, Clammy Hands or Bitten Fingernails (Lec 1 p.5):</strong> Key diagnostic indication of <strong>hidden apprehension and acute dental anxiety</strong>. Dentist should slow down, use comforting physical touch (hand on shoulder), and adopt Tell-Show-Do.
                  </p>
                )}
                {handSign === 'sucking' && (
                  <p>
                    <strong>Callused or Unusually Clean Digit (Lec 1 p.5):</strong> Suggests an active, persistent <strong>digit/thumb-sucking habit</strong> that can cause anterior open bite, maxillary incisor proclination, and posterior crossbite.
                  </p>
                )}
                {handSign === 'clubbing' && (
                  <p>
                    <strong>Clubbing of Fingers / Bluish Nail Beds (Cyanosis):</strong> Suggests <strong>congenital heart disease or chronic hypoxia</strong>! Patient requires strict antibiotic prophylaxis before invasive procedures to prevent <strong>Infective Endocarditis (IE)</strong>!
                  </p>
                )}
              </div>
            </div>

            {/* Lip Competency Tool */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#0B1F4D] mb-2">
                  Lip Competence Evaluation (Lec 1 p.6)
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  Lips normally touch lightly together or have a <strong>0–1 mm gap at rest</strong>.
                </p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setLipCompetence('competent');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      lipCompetence === 'competent'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Competent (0-1mm)
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setLipCompetence('incompetent');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      lipCompetence === 'incompetent'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Incompetent (&gt;2mm)
                  </button>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 border border-gray-100">
                {lipCompetence === 'competent' ? (
                  <span className="text-emerald-700 font-semibold">
                    ✓ Normal Lip Seal: Protects maxillary incisors from dry mouth and trauma.
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold">
                    ⚠️ Incompetent Lips: Patient requires conscious circumoral muscle effort to close lips. Highly associated with mouth breathing, severe overjet, and anterior trauma risk!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Head, Hair, Eyes & Lymph Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-xs text-[#0B1F4D] uppercase tracking-wider mb-2">
                1. Head, Hair &amp; Face
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Observe stature (first clue to malnutrition), lethargic gait, facial asymmetry, head lice, ringworm, or impetigo lesions requiring medical referral.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-xs text-[#0B1F4D] uppercase tracking-wider mb-2">
                2. Eyes &amp; Nasal Discharge
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Puffiness of eyelids indicates upper respiratory tract infection, sinusitis, or allergies. Chronic discharge leads to <strong>mouth breathing habit</strong>.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-xs text-[#0B1F4D] uppercase tracking-wider mb-2">
                3. Lymph Nodes Palpation
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Bimanual palpation of submandibular, anterior cervical, and submental chains. Tender, enlarged nodes indicate acute odontogenic or tonsillar infection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: TMJ Simulator */}
      {activeSubTab === 'tmj' && (
        <div className="bg-white rounded-2xl p-6 border border-[#C9A24B]/30 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#0B1F4D]">
                Pediatric Temporomandibular Joint (TMJ) Evaluation Tool
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Condylar Palpation, Clicking Sounds, and Maximum Mouth Opening (Lec 1 p.6)
              </p>
            </div>
            <span className="text-xs font-bold text-[#1B3A8C] bg-[#1B3A8C]/10 px-3 py-1 rounded-full">
              Normal Mouth Opening: 40 – 45 mm
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Jaw Opening Gauge */}
            <div className="bg-[#FAF8F3] p-5 rounded-xl border border-amber-200/50 flex flex-col items-center justify-center">
              <div className="relative w-40 h-48 border-x-2 border-dashed border-[#1B3A8C]/30 flex flex-col justify-between items-center py-2">
                {/* Maxillary Teeth */}
                <div className="w-28 h-6 bg-white border border-gray-300 rounded-b-lg shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-500">
                  Maxillary Incisors
                </div>

                {/* Opening Measurement Line */}
                <div className="flex items-center gap-2">
                  <div className="h-20 w-0.5 bg-[#C9A24B]" />
                  <div className="text-center">
                    <span className="text-3xl font-black text-[#1B3A8C] block">
                      {mouthOpeningMm}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      Millimeters (mm)
                    </span>
                  </div>
                  <div className="h-20 w-0.5 bg-[#C9A24B]" />
                </div>

                {/* Mandibular Teeth moving down */}
                <div
                  className="w-28 h-6 bg-white border border-gray-300 rounded-t-lg shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-500 transition-all duration-150"
                  style={{ transform: `translateY(${(mouthOpeningMm - 40) * 0.8}px)` }}
                >
                  Mandibular Incisors
                </div>
              </div>

              {/* Range Slider */}
              <div className="w-full mt-4">
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="1"
                  value={mouthOpeningMm}
                  onChange={(e) => {
                    setMouthOpeningMm(Number(e.target.value));
                    soundFx.playClick();
                  }}
                  className="w-full accent-[#1B3A8C] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-semibold">
                  <span className="text-red-600 font-bold">20 mm (Trismus)</span>
                  <span className="text-emerald-700 font-bold">40 - 45 mm (Normal)</span>
                  <span className="text-amber-600 font-bold">60 mm (Hypermobility)</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Interpretation */}
            <div className="space-y-3">
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  mouthOpeningMm >= 40 && mouthOpeningMm <= 45
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : mouthOpeningMm < 40
                    ? 'bg-red-50 text-red-900 border-red-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}
              >
                <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                  {mouthOpeningMm >= 40 && mouthOpeningMm <= 45 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  {mouthOpeningMm >= 40 && mouthOpeningMm <= 45
                    ? 'Normal Pediatric Mouth Opening (40-45 mm)'
                    : mouthOpeningMm < 40
                    ? 'Restricted Mouth Opening / Possible Trismus or TMJ Internal Derangement'
                    : 'Hypermobility / Subluxation Tendency'}
                </div>
                <p>
                  Palpate head of each mandibular condyle while mouth opens and closes. Note crepitus, clicking, lateral jaw deviation, or sore masticatory muscles.
                </p>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1.5">
                <span className="font-bold text-[#0B1F4D]">Pediatric TMJ Management (Lec 1 p.6):</span>
                <p>
                  Consensus indicates pediatric temporomandibular disorders should be treated with <strong>conservative and reversible therapies</strong>: patient/parent education, mild physical therapy, behavioral relaxation, and occlusal splints.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Treatment Planning */}
      {activeSubTab === 'planning' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-[#1B3A8C]" />
            <h3 className="text-base font-extrabold text-[#0B1F4D]">
              Advantages of Treatment Planning &amp; Anticipatory Guidance (Lec 1 p.2)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                title: '1. Avoid Re-Diagnosis',
                desc: 'Prevents confusing re-diagnosis at every dental visit and maintains systematic trajectory.',
              },
              {
                title: '2. Serial Appointments',
                desc: 'Give planned sequential appointments on day 1 based on overall needs.',
              },
              {
                title: '3. Instrument Preparation',
                desc: 'Staff can prepare trays and materials well in advance of child’s arrival.',
              },
              {
                title: '4. Fee & Time Estimation',
                desc: 'Clear estimation of the number of visits and total financial commitment for parents.',
              },
            ].map((adv, i) => (
              <div key={i} className="bg-[#FAF8F3] p-3.5 rounded-xl border border-amber-200/50">
                <span className="text-xs font-bold text-[#1B3A8C] block mb-1">{adv.title}</span>
                <p className="text-[11px] text-gray-600 leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <strong>Anticipatory Guidance Definition:</strong> The term used to describe the proactive discussion and implementation of a sequential comprehensive oral health care program with the patient and parents before problems emerge.
          </div>
        </div>
      )}
    </div>
  );
};
