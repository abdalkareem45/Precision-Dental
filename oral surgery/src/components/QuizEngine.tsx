import React, { useState } from 'react';
import { Card, SectionTitle } from './UI';

const QUIZ = [
  { q:'Which is the most common site of mandibular fracture?', options:['Angle','Condyle','Body','Symphysis / Parasymphysis'], answer:1,
    explain:'The condyle accounts for 29.1% of mandibular fractures — the single most common site. The angle is second at 24.5%, symphysis/parasymphysis third at 22%, and body fourth at 16%.' },
  { q:'Which plain radiographic view best demonstrates medial / lateral displacement of the condylar head?', options:['Orthopantomogram (OPG)','Postero-anterior (PA) mandible','Reverse Towne view (30°)','Lateral oblique view'], answer:2,
    explain:'The Reverse Towne view (30°) is used specifically to assess medial / lateral displacement of the condylar head and subcondylar fractures.' },
  { q:"Coleman's sign — a sublingual hematoma — is classically described as:", options:['Pathognomonic for mandibular fracture','A sign of TMJ ankylosis','Indicative of a Le Fort I fracture','A late complication of ORIF'], answer:0,
    explain:"Ecchymosis / sublingual hematoma of the floor of the mouth (Coleman's sign) is classically pathognomonic for mandibular fracture." },
  { q:'A comminuted mandibular fracture with a continuity defect is best managed with:', options:["Load-sharing miniplates along Champy's line",'A load-bearing rigid reconstruction plate','Closed reduction with MMF alone','Arch bars and elastic traction'], answer:1,
    explain:'Load-bearing osteosynthesis (locking non-compression reconstruction plates) carries 100% of the functional load and is indicated for defect fractures, comminuted fractures and severely atrophic mandibles.' },
  { q:'In paediatric mandibular fractures, the most commonly involved site is:', options:['Angle (40–70%)','Condyle (40–70%)','Symphysis (40–70%)','Coronoid (40–70%)'], answer:1,
    explain:'The condyle is the most common paediatric mandibular fracture site (40–70%) and is a primary growth centre.' },
];

export const QuizEngine: React.FC<{ onFinish?: (score: number) => void }> = ({ onFinish }) => {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [done, setDone] = useState(false);

  const q = QUIZ[idx];
  const score = answers.filter((a) => a.correct).length;
  const choose = (i: number) => { if (!locked) setPicked(i); };
  const lock = () => {
    if (picked === null || locked) return;
    setLocked(true);
    const newAnswers = [...answers, { idx, picked, correct: picked === q.answer }];
    setAnswers(newAnswers);
    if (idx === QUIZ.length - 1 && onFinish) {
      onFinish(newAnswers.filter((a) => a.correct).length);
    }
  };
  const next = () => {
    if (idx < QUIZ.length - 1) { setIdx(idx + 1); setPicked(null); setLocked(false); }
    else { setDone(true); }
  };
  const restart = () => { setIdx(0); setPicked(null); setLocked(false); setAnswers([]); setDone(false); };

  if (done) {
    const pct = Math.round((score / QUIZ.length) * 100);
    const perfect = score === QUIZ.length;
    return (
      <div className="anim-in space-y-6">
        <SectionTitle eyebrow="Interactive" title="Quiz Complete" />
        <Card className="p-8 md:p-12 text-center">
          <div className={`mx-auto w-28 h-28 rounded-full flex items-center justify-center text-4xl font-extrabold ${
            perfect ? 'bg-[#C9A24B] text-white pulse-gold' : 'bg-[#1B3A8C] text-white'
          }`}>{pct}%</div>
          <h3 className="mt-6 font-extrabold text-2xl text-[#0B1F4D]">
            {perfect ? 'Outstanding — flawless.' : pct >= 60 ? 'Solid work.' : 'Keep revising.'}
          </h3>
          <p className="mt-2 text-slate-500 text-sm">
            You answered <strong className="text-[#0B1F4D]">{score}</strong> of <strong className="text-[#0B1F4D]">{QUIZ.length}</strong> questions correctly.
          </p>
          <div className="mt-8 grid sm:grid-cols-5 gap-2 max-w-lg mx-auto">
            {QUIZ.map((_, i) => {
              const a = answers[i];
              const ok = a && a.correct;
              return (
                <div key={i} className={`rounded-xl py-3 text-xs font-extrabold border ${
                  ok ? 'bg-[#C9A24B]/15 border-[#C9A24B] text-[#8a6c25]' : 'bg-rose-50 border-rose-200 text-rose-600'
                }`}>
                  Q{i + 1}<div className="text-[10px] mt-0.5">{ok ? '✓' : '✕'}</div>
                </div>
              );
            })}
          </div>
          <button onClick={restart} className="mt-8 px-7 py-3.5 rounded-xl bg-[#1B3A8C] text-white font-bold text-sm hover:bg-[#0B1F4D] transition-colors shadow-[0_6px_24px_-8px_rgba(11,31,77,0.18)]">
            Retake Quiz
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="anim-in space-y-6">
      <SectionTitle eyebrow="Interactive" title="End-of-Module Quiz"
        subtitle="Five questions covering the entire lecture. Correct answers are highlighted in Precision Gold." />
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-2 rounded-full bg-[#E6E8EC] overflow-hidden">
            <div className="h-full bg-[#C9A24B] rounded-full transition-all duration-500"
              style={{ width: `${((idx + (locked ? 1 : 0)) / QUIZ.length) * 100}%` }} />
          </div>
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">{idx + 1} / {QUIZ.length}</span>
        </div>
        <h3 className="font-extrabold text-lg md:text-xl text-[#0B1F4D] leading-snug">{q.q}</h3>
        <div className="mt-5 space-y-2.5">
          {q.options.map((opt, i) => {
            const isPicked = picked === i;
            const isAnswer = i === q.answer;
            let cls = 'border-[#E6E8EC] bg-white hover:border-[#1B3A8C] hover:bg-[#1B3A8C]/5';
            if (!locked && isPicked) cls = 'border-[#1B3A8C] bg-[#1B3A8C]/10 ring-1 ring-[#1B3A8C]/40';
            if (locked && isAnswer) cls = 'border-[#C9A24B] bg-[#C9A24B]/15 ring-2 ring-[#C9A24B]';
            if (locked && isPicked && !isAnswer) cls = 'border-rose-300 bg-rose-50 ring-1 ring-rose-200';
            return (
              <button key={i} onClick={() => choose(i)} disabled={locked}
                className={`w-full text-left rounded-xl border px-4 py-3.5 flex items-center gap-3 transition-all ${cls} ${locked ? 'cursor-default' : 'cursor-pointer'}`}>
                <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-extrabold ${
                  locked && isAnswer ? 'bg-[#C9A24B] text-white'
                  : locked && isPicked ? 'bg-rose-500 text-white'
                  : isPicked ? 'bg-[#1B3A8C] text-white'
                  : 'bg-[#E6E8EC] text-slate-500'
                }`}>{String.fromCharCode(65 + i)}</span>
                <span className="text-[14px] font-semibold text-[#0B1F4D]">{opt}</span>
                {locked && isAnswer && <span className="ml-auto text-[11px] font-extrabold text-[#8a6c25]">✓</span>}
                {locked && isPicked && !isAnswer && <span className="ml-auto text-[11px] font-extrabold text-rose-600">✕</span>}
              </button>
            );
          })}
        </div>
        {locked && (
          <div className={`mt-5 rounded-2xl border p-5 anim-in ${
            picked === q.answer ? 'border-[#C9A24B] bg-[#C9A24B]/10' : 'border-[#1B3A8C]/30 bg-[#1B3A8C]/5'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{picked === q.answer ? '🎉' : '📘'}</span>
              <span className={`font-extrabold text-sm ${picked === q.answer ? 'text-[#8a6c25]' : 'text-[#1B3A8C]'}`}>
                {picked === q.answer ? 'Correct' : 'Explanation'}
              </span>
            </div>
            <p className="text-[13px] text-slate-700 leading-relaxed">{q.explain}</p>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          {!locked ? (
            <button onClick={lock} disabled={picked === null}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_6px_24px_-8px_rgba(11,31,77,0.18)] ${
                picked !== null ? 'bg-[#1B3A8C] text-white hover:bg-[#0B1F4D]' : 'bg-[#E6E8EC] text-slate-400 cursor-not-allowed shadow-none'
              }`}>Submit answer</button>
          ) : (
            <button onClick={next} className="px-6 py-3 rounded-xl bg-[#C9A24B] text-white font-bold text-sm hover:brightness-95 transition-all shadow-[0_6px_24px_-8px_rgba(11,31,77,0.18)]">
              {idx < QUIZ.length - 1 ? 'Next question →' : 'See results →'}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};
