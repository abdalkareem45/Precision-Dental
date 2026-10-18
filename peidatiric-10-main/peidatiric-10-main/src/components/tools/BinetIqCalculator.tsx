import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { Brain, Sparkles, Smile, HelpCircle, Check, X } from 'lucide-react';

export const BinetIqCalculator: React.FC = () => {
  const [mentalAge, setMentalAge] = useState<number>(6);
  const [chronologicalAge, setChronologicalAge] = useState<number>(6);
  const [activeTab, setActiveTab] = useState<'calculator' | 'quiz'>('calculator');

  // Interactive Fear Classification Quiz items (Lec 3 Page 7)
  const [quizScore, setQuizScore] = useState<number>(0);
  const [answeredItems, setAnsweredItems] = useState<Record<number, boolean>>({});

  const fearItems = [
    {
      id: 1,
      fear: 'Child feels sharp prick of needle or smells hospital disinfectant from a previous painful extraction',
      type: 'objective',
      explanation: 'Objective fear is produced by direct physical stimulation of sense organs (seen, felt, smelt, contacted).',
    },
    {
      id: 2,
      fear: 'Mother tightly clenches child’s hand nervously in waiting room and whispers "It won’t hurt"',
      type: 'subjective',
      explanation: 'Subjective fear is acquired by imitation and suggestion from others (parents, siblings, peers) without personal experience.',
    },
    {
      id: 3,
      fear: 'Child saw a cartoon where a dental drill was depicted as a menacing monster',
      type: 'subjective',
      explanation: 'Subjective (imaginative/suggestive) fear acquired through media, theater, or peer storytelling.',
    },
    {
      id: 4,
      fear: 'Vibration of the low-speed handpiece physically experienced during cleaning',
      type: 'objective',
      explanation: 'Objective fear directly experienced through tactile vibration on oral structures.',
    },
  ];

  const iq = Math.round((mentalAge / chronologicalAge) * 100);

  const getIqCategory = (val: number) => {
    if (val >= 130) return { cat: 'Very Superior / Gifted', color: 'text-purple-700 bg-purple-50' };
    if (val >= 115) return { cat: 'High Average', color: 'text-blue-700 bg-blue-50' };
    if (val >= 90) return { cat: 'Average / Normal Intelligence', color: 'text-emerald-700 bg-emerald-50' };
    if (val >= 70) return { cat: 'Borderline Intellectual Functioning', color: 'text-amber-700 bg-amber-50' };
    return { cat: 'Intellectual Disability (Requires Special Guidance)', color: 'text-red-700 bg-red-50' };
  };

  const handleFearAnswer = (id: number, selected: 'objective' | 'subjective') => {
    const item = fearItems.find((f) => f.id === id);
    if (!item || answeredItems[id] !== undefined) return;

    const isCorrect = item.type === selected;
    if (isCorrect) {
      soundFx.playSuccess();
      setQuizScore((prev) => prev + 1);
    } else {
      soundFx.playError();
    }
    setAnsweredItems((prev) => ({ ...prev, [id]: isCorrect }));
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#C9A24B]/30 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-montserrat font-bold text-base text-[#0B1F4D]">
              Child Intellectual Development & Fear Classifier
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Binet IQ Formula & Objective vs Subjective Fear (Lec 3 p.5-7)
            </p>
          </div>
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('calculator');
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'calculator' ? 'bg-[#1B3A8C] text-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Binet IQ Tool
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('quiz');
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'quiz' ? 'bg-[#1B3A8C] text-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Fear Classifier
          </button>
        </div>
      </div>

      {activeTab === 'calculator' ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-bold text-gray-700">
                  <span>Mental Age (MA):</span>
                  <span className="text-[#1B3A8C] font-black text-sm">{mentalAge} Years</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="0.5"
                  value={mentalAge}
                  onChange={(e) => {
                    setMentalAge(Number(e.target.value));
                    soundFx.playClick();
                  }}
                  className="w-full accent-[#1B3A8C] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-bold text-gray-700">
                  <span>Chronological Age (CA):</span>
                  <span className="text-[#1B3A8C] font-black text-sm">{chronologicalAge} Years</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="0.5"
                  value={chronologicalAge}
                  onChange={(e) => {
                    setChronologicalAge(Number(e.target.value));
                    soundFx.playClick();
                  }}
                  className="w-full accent-[#1B3A8C] cursor-pointer"
                />
              </div>
            </div>

            {/* IQ Result Card */}
            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50 flex flex-col justify-center items-center text-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Calculated Binet IQ:
              </span>
              <div className="text-4xl font-black text-[#1B3A8C] mb-1">{iq}</div>
              <span className="text-[11px] text-gray-500 font-mono mb-2">
                IQ = (Mental Age / Chronological Age) × 100
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getIqCategory(iq).color}`}>
                {getIqCategory(iq).cat}
              </span>
            </div>
          </div>

          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Clinical Pedodontic Takeaway (Lec 3 p.5):</strong> Chronologic age does not always equal mental age. A 7-year-old child with an intellectual disability (MA = 4) will respond best to pre-cooperative strategies (concrete 3-year-old communication, Tell-Show-Do, short appointments, tactile reassurance) rather than standard 7-year-old verbal logic.
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
            <span>Classify whether each pediatric situation represents an Objective or Subjective Fear:</span>
            <span className="font-bold text-[#1B3A8C]">
              Score: {quizScore} / {fearItems.length}
            </span>
          </div>

          <div className="space-y-3">
            {fearItems.map((item) => (
              <div key={item.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50">
                <p className="text-xs font-semibold text-gray-800 mb-2">"{item.fear}"</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFearAnswer(item.id, 'objective')}
                    disabled={answeredItems[item.id] !== undefined}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      answeredItems[item.id] !== undefined && item.type === 'objective'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Objective Fear
                  </button>
                  <button
                    onClick={() => handleFearAnswer(item.id, 'subjective')}
                    disabled={answeredItems[item.id] !== undefined}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      answeredItems[item.id] !== undefined && item.type === 'subjective'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Subjective Fear
                  </button>
                </div>

                {answeredItems[item.id] !== undefined && (
                  <p className="mt-2 text-[11px] text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                    {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
