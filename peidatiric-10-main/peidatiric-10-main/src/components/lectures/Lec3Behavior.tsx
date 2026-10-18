import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { BehavioralClinic3D } from '../3d/BehavioralClinic3D';
import { BinetIqCalculator } from '../tools/BinetIqCalculator';
import {
  Users,
  Brain,
  Sparkles,
  Clock,
  Shirt,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Smile,
  Shield,
} from 'lucide-react';

export const Lec3Behavior: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d_triangle' | 'milestones' | 'fears' | 'clinic_rules'>('3d_triangle');
  const [selectedAge, setSelectedAge] = useState<number>(3);

  const milestonesData: Record<
    number,
    {
      title: string;
      traits: string[];
      fearFocus: string;
      dentalStrategy: string;
    }
  > = {
    2: {
      title: '2 Years Old (Pre-cooperative Stage)',
      traits: [
        'Geared to gross motor skills (running, jumping).',
        'Likes to see and touch everything.',
        'Extremely attached to parent (separation anxiety).',
        'Plays alone (solitary play; rarely shares).',
        'Early sentence formation with limited vocabulary.',
      ],
      fearFocus: 'Fear of falling, sudden loud noises, bright lights, and strangers.',
      dentalStrategy:
        'Lap-to-lap (knee-to-knee) examination with parent holding child. Keep parent within tactile reach. Never force verbal logic.',
    },
    3: {
      title: '3 Years Old (Imaginative Communicator)',
      traits: [
        'Less egocentric; actively likes to please adults.',
        'Has an exceptionally active imagination; loves stories and fairy tales.',
        'Remains closely attached to parent.',
        'Enjoys talking and answering simple questions.',
      ],
      fearFocus: 'Fear of strangers is predominant. Fear of the unknown.',
      dentalStrategy:
        'Ideal age to introduce the dental clinic! Use imaginative euphemisms (e.g. "tooth counter" for explorer, "water gun" for air-water syringe). Tell-Show-Do.',
    },
    4: {
      title: '4 Years Old (Expansive & Assertive)',
      traits: [
        'Tries to impose powers and test boundaries.',
        'Participates enthusiastically in small social groups.',
        'Reaches out into expansive world; high self-help skills.',
        'Knows social manners ("thank you" and "please").',
      ],
      fearFocus: 'Fear of bodily injury and hypodermic needles. Sight of blood produces disproportionate panic.',
      dentalStrategy:
        'Give clear verbal explanations. Allow child to exercise small controlled choices (e.g., "Would you like strawberry or bubblegum fluoride?"). Keep needles completely out of sight.',
    },
    5: {
      title: '5 Years Old (Deliberate & Cooperative)',
      traits: [
        'Undergoes period of consolidation; deliberate and proud.',
        'Takes pride in personal clothes, shoes, and possessions.',
        'Relinquishes transitional comfort objects (blankets, thumb).',
        'Plays cooperatively with peers and follows established rules.',
      ],
      fearFocus: 'Fear of bodily harm is lessened. Proud of being a "big kid".',
      dentalStrategy:
        'Commend and praise good behavior ("You were so brave today!"). Children at 5 love adult validation and cooperate smoothly with praise.',
    },
  };

  return (
    <div className="space-y-6">
      {/* Lecture Title Hero */}
      <div className="bg-gradient-to-r from-[#0B1F4D] to-[#1B3A8C] rounded-2xl p-6 text-white shadow-xl border border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="bg-[#C9A24B] text-[#0B1F4D] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Lecture 3 • Pedodontics 5th Year
            </span>
            <span className="text-xs font-semibold text-gray-300">
              Baghdad College of Dentistry • Prof. Dr. Aseel Haidar
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-2">
            Management of Children Behaviors (Behavioral Pedodontics)
          </h2>
          <p className="text-sm text-gray-200 max-w-3xl leading-relaxed">
            Child dental management is a clinical art form built on psychological science: guiding the child through the Pedodontic Treatment Triangle to build lifelong positive oral health attitudes.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {(
          [
            ['3d_triangle', '1. 3D Pedodontic Treatment Triangle', Users],
            ['milestones', '2. Developmental Milestones (Ages 2–5)', Brain],
            ['fears', '3. Anxiety, Fears & IQ Tool', Sparkles],
            ['clinic_rules', '4. Clinic Scheduling & Dental Attire', Clock],
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

      {/* Tab 1: 3D Pedodontic Triangle */}
      {activeTab === '3d_triangle' && (
        <div className="space-y-4">
          <BehavioralClinic3D />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <h4 className="font-extrabold text-[#0B1F4D] text-sm mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1B3A8C]" />
                The Fundamental Triad vs Adult Dentistry:
              </h4>
              <p className="text-gray-600 mb-2">
                Treating adults involves a <strong>1-to-1 relationship</strong> (Dentist and Patient). Treating children involves a <strong>1-to-2 relationship</strong> (Dentist, Child, and Parent) encircled by <strong>Society</strong>.
              </p>
              <p className="text-gray-600">
                The child sits at the apex of the triangle because all focus of both the family and the dental team is directed toward the child's well-being. Communication along the triangle lines is reciprocal and dynamic.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <h4 className="font-extrabold text-[#0B1F4D] text-sm mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C9A24B]" />
                Fundamentals of Behavior Management:
              </h4>
              <div className="grid grid-cols-2 gap-2 font-bold text-gray-700">
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">1. The team attitude</div>
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">2. Organization</div>
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">3. Positive approach</div>
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">4. Truthfulness</div>
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">5. Tolerance</div>
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">6. Flexibility</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Milestones 2-5 Years */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#C9A24B]/30 shadow-sm">
            <h3 className="text-base font-extrabold text-[#0B1F4D] mb-3">
              Age-Related Psychosocial Traits &amp; Behavior Strategies (Lec 3 p.4):
            </h3>

            {/* Age Selector */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[2, 3, 4, 5].map((age) => (
                <button
                  key={age}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedAge(age);
                  }}
                  className={`py-3 px-2 rounded-xl text-center border font-bold transition-all ${
                    selectedAge === age
                      ? 'bg-[#1B3A8C] text-white shadow-md border-[#1B3A8C]'
                      : 'bg-[#FAF8F3] text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg block font-black">{age}</span>
                  <span className="text-[10px] uppercase tracking-wider opacity-80">Years Old</span>
                </button>
              ))}
            </div>

            {/* Age Card */}
            {(() => {
              const data = milestonesData[selectedAge];
              return (
                <div className="bg-[#FAF8F3] p-5 rounded-xl border border-amber-200/50 space-y-3">
                  <h4 className="text-sm font-extrabold text-[#0B1F4D]">{data.title}</h4>

                  <div>
                    <span className="text-xs font-bold text-gray-700 block mb-1">Key Developmental Traits:</span>
                    <ul className="space-y-1 text-xs text-gray-600">
                      {data.traits.map((t, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-900">
                    <strong>Primary Fear at this Age:</strong> {data.fearFocus}
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900">
                    <strong>Recommended Dental Clinic Approach:</strong> {data.dentalStrategy}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Tab 3: Fears & IQ Tool */}
      {activeTab === 'fears' && (
        <div className="space-y-6">
          <BinetIqCalculator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <span className="font-extrabold text-blue-900 block text-sm mb-1">1. Fear (Primal Emotion)</span>
              <p className="text-gray-600">
                Stems from a recognized source developed to protect the individual from harm. Safety value with fight-or-flight response. The subject is able to pinpoint what they fear (e.g. fear of the needle prick).
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <span className="font-extrabold text-amber-900 block text-sm mb-1">2. Anxiety (Unknown Danger)</span>
              <p className="text-gray-600">
                Vague, unpleasant apprehension or uneasiness stemming from anticipation of a danger whose source is largely <strong>unknown or unrecognized</strong>. Sensitive to dental pain.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs leading-relaxed">
              <span className="font-extrabold text-red-900 block text-sm mb-1">3. Phobia (Pathological Fear)</span>
              <p className="text-gray-600">
                Persistent, excessive, unreasonable fear of a specific object or situation. Deep-seated and provoked by any stimulus resembling the original traumatic episode.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Clinic Scheduling & Attire */}
      {activeTab === 'clinic_rules' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-[#1B3A8C]">
              <Calendar className="w-5 h-5 text-[#1B3A8C]" />
              <h4 className="font-bold text-sm text-[#0B1F4D]">1. Appointment Scheduling</h4>
            </div>
            <p className="text-gray-600">
              Young children, especially pre-schoolers, are <strong>much fresher in the morning</strong>! Schedule early morning appointments. Ensure the waiting period in the reception room is minimal (&lt;10-15 min) to prevent restlessness and anxiety.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-[#1B3A8C]">
              <Clock className="w-5 h-5 text-[#1B3A8C]" />
              <h4 className="font-bold text-sm text-[#0B1F4D]">2. Appointment Length</h4>
            </div>
            <p className="text-gray-600">
              Treat one quadrant per appointment (e.g., 6+E+D at once) to create fewer total appointments. Keep working time strictly between <strong>30 to 45 minutes</strong> because young children quickly lose concentration and tolerance beyond this window.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-[#1B3A8C]">
              <Shirt className="w-5 h-5 text-[#1B3A8C]" />
              <h4 className="font-bold text-sm text-[#0B1F4D]">3. Dental Attire Psychology</h4>
            </div>
            <p className="text-gray-600">
              Children who underwent hospital surgeries or traumatic vaccinations associate the <strong>white doctor's coat and surgical mask</strong> with severe pain. Colorful, friendly pediatric dental attire eliminates this conditioned trigger.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
