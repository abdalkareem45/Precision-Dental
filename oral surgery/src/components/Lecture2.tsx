import React, { useState } from 'react';
import { LectureClassification } from './LectureClassification';
import { LectureExam } from './LectureExam';
import { LectureManagement } from './LectureManagement';
import { LectureSpecial } from './LectureSpecial';
import { DiagnosticSimulator } from './DiagnosticSimulator';
import { QuizEngine } from './QuizEngine';
import { Card, Pill } from './UI';

export const Lecture2: React.FC<{ giveXp: (key: string, amount: number) => void }> = ({ giveXp }) => {
  const [subTab, setSubTab] = useState('intro');

  return (
    <div className="space-y-6">
      {/* Sub navigation for Lecture 2 */}
      <div className="flex gap-2 overflow-x-auto thin-scroll pb-2 border-b border-[#E6E8EC]">
        {[
          { id: 'intro', label: '01. Introduction & Epidemiology' },
          { id: 'class', label: '02. Classification' },
          { id: 'exam', label: '03. Exam & Imaging' },
          { id: 'mgmt', label: '04. Management' },
          { id: 'special', label: '05. Special Cases' },
          { id: 'sim', label: '★ Diagnostic Simulator' },
          { id: 'quiz', label: '🏆 Knowledge Quiz' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSubTab(item.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              subTab === item.id ? 'bg-[#0B1F4D] text-white shadow-md' : 'bg-white text-[#0B1F4D] border border-[#E6E8EC] hover:border-[#C9A24B]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {subTab === 'intro' && (
        <div className="anim-in space-y-6">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-3 p-6 md:p-8">
                <Pill tone="gold">HIGH-YIELD</Pill>
                <h3 className="mt-4 font-extrabold text-xl md:text-2xl text-[#0B1F4D] leading-snug">
                  The mandible is the most frequently fractured facial bone after the nasal bones.
                </h3>
                <p className="mt-3 text-slate-600 text-sm md:text-[15px] leading-relaxed">
                  The majority of adult mandible fractures are related to interpersonal violence — most frequently in men aged 18 to 24 years old. Men show a fourfold higher incidence of mandibular fractures, with nearly 50% arising from assault.
                </p>
              </div>
              <div className="md:col-span-2 bg-[#0B1F4D] text-white p-6 md:p-8 flex flex-col justify-center">
                <div className="font-ar text-[#C9A24B] text-2xl mb-2">دقة الأسنان</div>
                <div className="h-px bg-[#C9A24B]/40 mb-5" />
                <div className="text-[11px] font-bold tracking-[0.2em] text-[#C9A24B] uppercase mb-3">Aim of treatment</div>
                <p className="text-sm leading-relaxed text-white/85">
                  Restore <span className="text-[#C9A24B] font-semibold"> function</span> — namely both occlusion and pain-free normal movements of both TMJs.
                </p>
              </div>
            </div>
          </Card>
          <div className="flex justify-end">
            <button onClick={() => setSubTab('class')} className="px-6 py-3 rounded-xl bg-[#1B3A8C] text-white font-bold text-sm hover:bg-[#0B1F4D] transition-colors shadow-md">
              Next: Classification →
            </button>
          </div>
        </div>
      )}

      {subTab === 'class' && <LectureClassification />}
      {subTab === 'exam' && <LectureExam />}
      {subTab === 'mgmt' && <LectureManagement />}
      {subTab === 'special' && <LectureSpecial />}
      {subTab === 'sim' && <DiagnosticSimulator onScore={() => giveXp('sim-complete', 50)} />}
      {subTab === 'quiz' && <QuizEngine onFinish={(score) => giveXp('quiz-complete', score * 20)} />}
    </div>
  );
};
