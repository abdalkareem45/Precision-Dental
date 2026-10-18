import React, { useState, useMemo, useEffect } from 'react';
import { Card, SectionTitle, Pill } from './UI';

const SIM_CASE = {
  vignette: 'A 24-year-old male presents to the emergency department after an assault. He has a sublingual hematoma and states his bite "feels wrong". He reports numbness in the lower left lip.',
  steps: [
    { id:'structures', type:'multi', prompt:'Select ALL structures that are likely injured in this patient.',
      options:[
        { id:'ian',    label:'Inferior Alveolar Nerve (IAN)', correct:true },
        { id:'mental', label:'Mental nerve',                  correct:true },
        { id:'facial', label:'Facial nerve (marginal mandibular branch)', correct:false },
        { id:'lingual',label:'Lingual nerve',                 correct:false },
        { id:'v2',     label:'Maxillary division of trigeminal (V2)', correct:false },
      ],
      explain:'Numbness of the lower lip indicates injury to the inferior alveolar nerve as it courses through the body of the mandible, and to its terminal branch — the mental nerve.' },
    { id:'imaging', type:'single', prompt:'What is the next best imaging step?',
      options:[
        { id:'ct',    label:'CT scan (multi-planar / 3D)', correct:true },
        { id:'opg',   label:'OPG alone',                   correct:false },
        { id:'towne', label:'Reverse Towne view',          correct:false },
        { id:'mri',   label:'MRI',                         correct:false },
      ],
      explain:'CT is the gold standard for multiple and complex mandibular fractures — axial, coronal and sagittal planes plus 3D reconstruction.' },
    { id:'site', type:'single', prompt:'Given left lower-lip paraesthesia and a sublingual hematoma, which region is most likely fractured?',
      options:[
        { id:'leftAngle', label:'Left angle / posterior body region', correct:true },
        { id:'rightCond', label:'Right condyle',                      correct:false },
        { id:'midSymph',  label:'Midline symphysis only',             correct:false },
        { id:'coronoid',  label:'Left coronoid process',              correct:false },
      ],
      explain:'Mandibular angle fractures have significantly higher rates of hypoesthesia. The left-sided distribution of numbness localises the injury to the left posterior body / angle region.' },
  ],
};

export const DiagnosticSimulator: React.FC<{ onScore?: () => void }> = ({ onScore }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const step = SIM_CASE.steps[stepIdx];
  const current = selections[step.id];

  const toggle = (optId: string) => {
    if (submitted) return;
    setSelections((prev) => {
      const cur = prev[step.id];
      if (step.type === 'single') return { ...prev, [step.id]: optId };
      const arr = Array.isArray(cur) ? [...cur] : [];
      const i = arr.indexOf(optId);
      if (i >= 0) arr.splice(i, 1); else arr.push(optId);
      return { ...prev, [step.id]: arr };
    });
  };

  const isCorrect = useMemo(() => {
    const correctSet = step.options.filter((o) => o.correct).map((o) => o.id).sort();
    if (step.type === 'single') return current === correctSet[0];
    const sel = Array.isArray(current) ? [...current].sort() : [];
    return sel.length === correctSet.length && sel.every((v, i) => v === correctSet[i]);
  }, [current, step]);

  const hasAnswer = step.type === 'single' ? Boolean(current) : Array.isArray(current) && current.length > 0;
  const handleNext = () => {
    if (!submitted) { setSubmitted(true); return; }
    if (stepIdx < SIM_CASE.steps.length - 1) { setStepIdx(stepIdx + 1); setSubmitted(false); }
  };
  const allDone = submitted && stepIdx === SIM_CASE.steps.length - 1;
  useEffect(() => { if (allDone && onScore) onScore(); }, [allDone, onScore]);

  return (
    <div className="anim-in space-y-6">
      <SectionTitle eyebrow="Interactive" title="Clinical Diagnostic Simulator"
        subtitle="Work through the case, make your selections, and get instant feedback." />
      <Card className="overflow-hidden">
        <div className="bg-[#0B1F4D] text-white p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-9 h-9 rounded-xl bg-[#C9A24B] text-white font-extrabold flex items-center justify-center text-sm">Hx</span>
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#C9A24B] uppercase">Case vignette</span>
          </div>
          <p className="text-[15px] leading-relaxed text-white/90">{SIM_CASE.vignette}</p>
        </div>

        <div className="flex items-center gap-2 px-6 pt-5">
          {SIM_CASE.steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`h-1.5 rounded-full flex-1 transition-colors ${
                i < stepIdx ? 'bg-[#C9A24B]' : i === stepIdx ? 'bg-[#1B3A8C]' : 'bg-[#E6E8EC]'
              }`} />
            </div>
          ))}
          <span className="text-[11px] font-bold text-slate-400 ml-2 whitespace-nowrap">{stepIdx + 1}/{SIM_CASE.steps.length}</span>
        </div>

        <div className="p-6 md:p-8">
          <h3 className="font-extrabold text-[#0B1F4D] text-lg leading-snug">{step.prompt}</h3>
          {step.type === 'multi' && (
            <p className="text-[12.5px] text-slate-500 mt-1">Select all that apply — {Array.isArray(current) ? current.length : 0} selected</p>
          )}

          <div className="mt-5 space-y-2.5">
            {step.options.map((opt) => {
              const sel = step.type === 'single' ? current === opt.id : Array.isArray(current) && current.includes(opt.id);
              let stateCls = sel ? 'border-[#1B3A8C] bg-[#1B3A8C]/10 ring-1 ring-[#1B3A8C]/40' : 'border-[#E6E8EC] bg-white hover:border-[#C9A24B] hover:bg-[#C9A24B]/5';
              if (submitted) {
                if (opt.correct && sel) stateCls = 'border-[#C9A24B] bg-[#C9A24B]/15 ring-2 ring-[#C9A24B]';
                else if (opt.correct && !sel) stateCls = 'border-[#C9A24B]/60 bg-[#C9A24B]/5 ring-1 ring-[#C9A24B]/40';
                else if (!opt.correct && sel) stateCls = 'border-rose-300 bg-rose-50 ring-1 ring-rose-200';
                else stateCls = 'border-[#E6E8EC] bg-white opacity-70';
              }
              return (
                <button key={opt.id} onClick={() => toggle(opt.id)} disabled={submitted}
                  className={`w-full text-left rounded-xl border px-4 py-3.5 transition-all flex items-center gap-3 ${stateCls} ${submitted ? 'cursor-default' : 'cursor-pointer'}`}>
                  <span className={`shrink-0 w-5 h-5 flex items-center justify-center border-2 ${
                    step.type === 'single' ? 'rounded-full' : 'rounded-md'
                  } ${sel ? 'border-[#1B3A8C] bg-[#1B3A8C] text-white' : 'border-slate-300 bg-white'}`}>
                    {sel && (
                      <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6.2 4.6 9 10 3"/>
                      </svg>
                    )}
                  </span>
                  <span className="text-[14px] font-semibold text-[#0B1F4D]">{opt.label}</span>
                  {submitted && opt.correct && <span className="ml-auto text-[11px] font-extrabold text-[#8a6c25]">CORRECT</span>}
                  {submitted && !opt.correct && sel && <span className="ml-auto text-[11px] font-extrabold text-rose-600">INCORRECT</span>}
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className={`mt-5 rounded-2xl border p-5 anim-in ${isCorrect ? 'border-[#C9A24B] bg-[#C9A24B]/10' : 'border-[#1B3A8C]/30 bg-[#1B3A8C]/5'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{isCorrect ? '🎯' : '📘'}</span>
                <span className={`font-extrabold text-sm ${isCorrect ? 'text-[#8a6c25]' : 'text-[#1B3A8C]'}`}>
                  {isCorrect ? 'Correct — +25 XP' : 'Not quite — here is why'}
                </span>
              </div>
              <p className="text-[13px] text-slate-700 leading-relaxed">{step.explain}</p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <button onClick={() => { setStepIdx(0); setSelections({}); setSubmitted(false); }}
              className="px-4 py-2.5 rounded-xl border border-[#E6E8EC] text-[#0B1F4D] font-bold text-[13px] hover:border-[#C9A24B] transition-colors">
              Restart case
            </button>
            {!allDone ? (
              <button onClick={handleNext} disabled={!hasAnswer}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_6px_24px_-8px_rgba(11,31,77,0.18)] ${
                  hasAnswer ? 'bg-[#1B3A8C] text-white hover:bg-[#0B1F4D]' : 'bg-[#E6E8EC] text-slate-400 cursor-not-allowed shadow-none'
                }`}>
                {submitted ? 'Next step →' : 'Check answer'}
              </button>
            ) : (
              <div className="px-5 py-3 rounded-xl bg-[#C9A24B] text-white font-extrabold text-sm">✓ Case complete</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
