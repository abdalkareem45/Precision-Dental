import { useState, useCallback, type ReactNode } from 'react';

/* ══════════════════════════════════════════════════════════════════════════
   ░░  ICONS (SVG Icon Library)
   ══════════════════════════════════════════════════════════════════════════ */
const ICON = {
  home:   'M3 11l9-8 9 8v9a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-9z',
  book:   'M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5zm4 4h8M8 13h5',
  eye:    'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z',
  hand:   'M9 11V5a2 2 0 114 0v6m0 0V4a2 2 0 114 0v7m0 0V6a2 2 0 114 0v9a7 7 0 01-7 7h-1a7 7 0 01-7-7v-3a2 2 0 114 0',
  help:   'M12 3a9 9 0 100 18 9 9 0 000-18zm0 13h.01M9.5 9.5a2.5 2.5 0 115 .01c0 1.5-2.5 2-2.5 3.5',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  ruler:  'M3 15L15 3l6 6L9 21l-6-6zM7 11l2 2M10 8l2 2M13 5l2 2',
  tooth:  'M12 3c-2.2 0-2.8 1.4-4.6 1.4C5.6 4.4 4 6 4 9.4c0 3.5 2 5.6 3.1 8.5.6 1.7.9 3.1 2.1 3.1 1 0 1.2-1.2 1.3-2.7.1-1.3.4-2.3 1.5-2.3s1.4 1 1.5 2.3c.1 1.5.3 2.7 1.3 2.7 1.2 0 1.5-1.4 2.1-3.1C17.9 15 20 12.9 20 9.4 20 6 18.4 4.4 16.6 4.4 14.8 4.4 14.2 3 12 3z',
  chart:  'M4 20V10m6 10V4m6 16v-7m6 7V8',
  check:  'M5 13l4 4L19 7',
  x:      'M6 6l12 12M6 18L18 6',
  chevR:  'M9 6l6 6-6 6',
  chevL:  'M15 6l-6 6 6 6',
  menu:   'M4 6h16M4 12h16M4 18h16',
  play:   'M8 5v14l11-7z',
  refresh:'M3 12a9 9 0 0115.5-6.4M21 12a9 9 0 01-15.5 6.4M3 4v4h4M21 20v-4h-4',
  alert:  'M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z',
  spark:  'M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2l2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2l2.8-2.8',
  arrowR: 'M5 12h14m-6-6l6 6-6 6',
  arrowL: 'M19 12H5m6 6l-6-6 6-6',
  target: 'M12 2v4m0 12v4M2 12h4m12 0h4M12 8a4 4 0 100 8 4 4 0 000-8z',
  drop:   'M12 2s7 7.5 7 12a7 7 0 11-14 0c0-4.5 7-12 7-12z',
  info:   'M12 16v-4m0-4h.01M12 3a9 9 0 100 18 9 9 0 000-18z',
  star:   'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z',
  swap:   'M7 4h10l-3-3m3 3l-3 3M17 20H7l3 3m-3-3l3-3',
  ruler2: 'M2 12h4m12 0h4M6 12v6m12-6v6M6 18h12M6 12h12M9 12v3m3-3v3m3-3v3',
  waves:  'M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0M3 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0',
  balance:'M12 3v18M6 8l6-5 6 5M6 20l6-5 6 5',
  magnet: 'M6 4v7a6 6 0 0012 0V4M6 4h4M14 4h4',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
};

function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.8 }: {
  name: keyof typeof ICON;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      <path d={ICON[name] || ICON.home} />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ░░  UI PRIMITIVES (Defined first to prevent reference errors)
   ══════════════════════════════════════════════════════════════════════════ */
function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}>
      <div
        className="h-full rounded-full bg-linear-to-r from-maxblue to-prostgold transition-all duration-700 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function Card({ children, className = '', pad = 'p-5 sm:p-6' }: {
  children: ReactNode;
  className?: string;
  pad?: string;
}) {
  return (
    <section className={`rounded-2xl border border-slate-100 bg-white shadow-md ${pad} ${className}`}>
      {children}
    </section>
  );
}

function Note({ tone = 'gold', label, children }: {
  tone?: 'gold' | 'blue' | 'red' | 'navy' | 'green';
  label?: ReactNode;
  children: ReactNode;
}) {
  const tones = {
    gold: 'border-prostgold bg-amber-50 text-amber-900',
    blue: 'border-maxblue bg-blue-50 text-blue-900',
    red:  'border-rose-500 bg-rose-50 text-rose-900',
    navy: 'border-slatenavy bg-slate-100 text-slatenavy',
    green:'border-emerald-500 bg-emerald-50 text-emerald-900',
  };
  return (
    <div className={`rounded-xl border-l-4 p-4 shadow-sm ${tones[tone]}`}>
      {label && (
        <p className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] opacity-80">{label}</p>
      )}
      <div className="text-[13px] sm:text-[13.5px] leading-relaxed">{children}</div>
    </div>
  );
}

function Chip({ children, tone = 'slate', className = '' }: {
  children: ReactNode;
  tone?: 'slate' | 'blue' | 'gold' | 'navy' | 'goldS' | 'blueS' | 'green' | 'red';
  className?: string;
}) {
  const tones = {
    slate:  'bg-slate-100 text-slate-600',
    blue:   'bg-maxblue/10 text-maxblue',
    gold:   'bg-amber-100 text-prostgold',
    navy:   'bg-slatenavy text-white',
    goldS:  'bg-prostgold text-white',
    blueS:  'bg-maxblue text-white',
    green:  'bg-emerald-100 text-emerald-700',
    red:    'bg-rose-100 text-rose-700',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-widest ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

function PageHead({ kicker, title, lede }: { kicker: string; title: string; lede?: string }) {
  return (
    <div className="mb-5 sm:mb-6">
      <p className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-prostgold">{kicker}</p>
      <h1 className="mt-1.5 text-[22px] sm:text-3xl font-extrabold tracking-tight text-slatenavy leading-tight">{title}</h1>
      {lede && <p className="mt-2.5 max-w-3xl text-[13px] sm:text-sm leading-relaxed text-slate-600">{lede}</p>}
    </div>
  );
}

function SectionTitle({ children, accent = 'maxblue', className = '' }: {
  children: ReactNode;
  accent?: 'maxblue' | 'gold' | 'navy';
  className?: string;
}) {
  const accents = { maxblue: 'border-maxblue', gold: 'border-prostgold', navy: 'border-slatenavy' };
  return (
    <h2 className={`mb-4 border-l-4 ${accents[accent]} pl-3 text-[16px] sm:text-lg font-bold text-slatenavy ${className}`}>
      {children}
    </h2>
  );
}

function Steps({ items, marker = 'number' }: { items: ReactNode[]; marker?: 'number' | 'letter' }) {
  return (
    <ol className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold ${
            marker === 'number' ? 'bg-maxblue/10 text-maxblue' : 'bg-prostgold/15 text-prostgold'}`}>
            {marker === 'number' ? i + 1 : String.fromCharCode(97 + i)}
          </span>
          <div className="text-[13px] sm:text-[13.5px] leading-relaxed text-slate-700">{it}</div>
        </li>
      ))}
    </ol>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ░░  QUIZ COMPONENT (Fully defined)
   ══════════════════════════════════════════════════════════════════════════ */
const QUESTIONS = [
  { id:1, topic:'Resorption',
    q:'How does the maxilla naturally resorb following complete edentulism?',
    options:['Upward and inward (centripetal)','Downward and outward (centrifugal)','Upward and outward (centrifugal)','Downward and inward (centripetal)'],
    answer:0,
    rationale:'The maxilla resorbs upward and inward — centripetal. The mandible resorbs in the opposite direction: downward and outward (centrifugal).',
  },
  { id:2, topic:'Prevalence',
    q:'What percentage of patients present with a Class I skeletal ridge relationship?',
    options:['10%','34.5%','55.5%','25%'],
    answer:2,
    rationale:'Class I is the most common skeletal ridge relationship at about 55.5%. Class II is present in about 10% and Class III in about 34.5%.',
  },
  { id:3, topic:'Normal relationship',
    q:'Posteriorly, the interalveolar crest line between the two ridges forms what angle to the horizontal plane in a normal ridge relationship?',
    options:['45°','60°','80°','100°'],
    answer:2,
    rationale:'The interalveolar crest line forms an 80° angle to the horizontal plane, with the mandibular crest slightly buccal to the maxillary crest.',
  },
  { id:4, topic:'Class II management',
    q:'A Class II patient has an anterior EXTREME discrepancy that cannot be managed by modifying the lower anterior teeth. What is the correct treatment?',
    options:['Move the upper anterior teeth palatally to reduce the overjet','Move the lower anterior teeth labially to meet the uppers','Eliminate the lower first premolars from the dental arch','Grind the distal surface of the upper canine'],
    answer:2,
    rationale:'When the discrepancy is excessive and cannot be managed by manipulation of lower anteriors, the lower first premolars must be eliminated.',
  },
  { id:5, topic:'Class III management',
    q:'In a cross-arch interchange for a severe Class III posterior relationship, which tooth must be eliminated?',
    options:['Lower first molar','First premolar','Lower lateral incisor','Upper second molar'],
    answer:1,
    rationale:'Because the upper arch is already smaller, the first premolar must be eliminated from the arch to develop correct intercuspal relationships.',
  },
];

const LETTERS = ['A','B','C','D'];

function Quiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState<{ id: number; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[index];
  const isCorrect = locked && selected === q.answer;

  const choose = (i: number) => {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    setAnswers(prev => [...prev, { id: q.id, correct: i === q.answer }]);
  };

  const next = () => {
    if (index === QUESTIONS.length - 1) { setFinished(true); return; }
    setIndex(i => i + 1);
    setSelected(null);
    setLocked(false);
  };

  const restart = () => { setIndex(0); setSelected(null); setLocked(false); setAnswers([]); setFinished(false); };

  if (finished) {
    const score = answers.filter(a => a.correct).length;
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div className="mx-auto max-w-3xl">
        <div className="anim-scale-in overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md p-6 sm:p-8 text-center">
          <h2 className="text-2xl font-extrabold text-slatenavy">Assessment Completed</h2>
          <p className="mt-3 text-4xl font-extrabold text-prostgold">{pct}%</p>
          <p className="mt-2 text-sm text-slate-600">{score} of {QUESTIONS.length} answers correct.</p>
          <button onClick={restart}
            className="mt-6 btn-primary px-6 py-3 font-bold text-sm">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
      <PageHead kicker="Assessment" title="Gamified Quiz" lede="Test your prosthodontic knowledge with immediate rationale." />
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-1.5">
          {QUESTIONS.map((qq, i) => {
            const a = answers.find(x => x.id === qq.id);
            const state = a ? (a.correct ? 'correct' : 'wrong') : i === index ? 'current' : 'idle';
            return (
              <div key={qq.id} className={`h-1.5 flex-1 rounded-full transition-all ${
                state === 'correct' ? 'bg-prostgold'
                : state === 'wrong' ? 'bg-rose-400'
                : state === 'current' ? 'bg-maxblue'
                : 'bg-slate-200'
              }`} />
            );
          })}
        </div>
        <span className="shrink-0 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
          {index + 1} / {QUESTIONS.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md p-5 sm:p-7">
        <Chip tone="blue">{q.topic}</Chip>
        <h3 className="mt-3 text-lg font-bold text-slatenavy">{q.q}</h3>
        <div className="mt-5 space-y-3">
          {q.options.map((opt, i) => {
            const isAnswer = i === q.answer;
            const isPicked = i === selected;
            let cls = 'border-slate-200 bg-white text-slate-700 hover:border-maxblue hover:bg-blue-50/40';
            let badge = 'bg-slate-100 text-slate-500';
            if (locked) {
              if (isAnswer) { cls = 'border-prostgold bg-amber-50 text-amber-900'; badge = 'bg-prostgold text-white'; }
              else if (isPicked) { cls = 'border-rose-300 bg-rose-50 text-rose-800'; badge = 'bg-rose-500 text-white'; }
              else { cls = 'border-slate-200 bg-slate-50 text-slate-400'; badge = 'bg-slate-100 text-slate-400'; }
            }
            return (
              <button key={i} onClick={() => choose(i)} disabled={locked}
                className={`flex w-full items-start gap-3.5 rounded-xl border-2 px-4 py-3.5 text-left transition ${cls} ${locked ? 'cursor-default' : 'cursor-pointer active:scale-[.99]'}`}>
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] font-extrabold ${badge}`}>
                  {locked && isAnswer ? '✓' : locked && isPicked ? '✕' : LETTERS[i]}
                </span>
                <span className="text-[13.5px] font-semibold leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {locked && (
          <div className={`mt-6 p-4 rounded-xl border ${isCorrect ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-rose-200 bg-rose-50 text-rose-900'}`}>
            <p className="text-xs font-bold uppercase tracking-wider">{isCorrect ? 'Correct!' : 'Incorrect — Rationale:'}</p>
            <p className="text-sm mt-1 leading-relaxed">{q.rationale}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={next} disabled={!locked}
            className={`rounded-xl px-5 py-2.5 text-sm font-extrabold transition ${
              locked ? 'bg-maxblue text-white shadow-md hover:brightness-110 active:scale-[.98]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}>
            {index === QUESTIONS.length - 1 ? 'See Results' : 'Next Question'} →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ░░  TREATMENT SIMULATOR COMPONENT (Fully defined)
   ══════════════════════════════════════════════════════════════════════════ */
const SCENARIOS = [
  {
    id:'s1', badge:'Scenario 1', tag:'Class II · Anterior',
    title:'Maxillary protrusion with an EXTREME anterior discrepancy',
    brief:'The upper arch is markedly forward. Excessive overjet and an abnormal canine relationship. The discrepancy is too great to be corrected by narrowing, crowding or grinding the lower anterior teeth.',
    instruction:'Tap the correct management strategy into the treatment box.',
    correctId:'s1-c',
    successNote:'Where the discrepancy is excessive and cannot be managed by manipulation of the lower anterior teeth, the lower anterior teeth are left as they are and the lower first premolars are eliminated from the dental arch.',
    options:[
      { id:'s1-a', label:'Move the upper anterior teeth palatally to reduce the overjet' },
      { id:'s1-b', label:'Move the lower anterior teeth labially to meet the uppers' },
      { id:'s1-c', label:'Eliminate the lower first premolars from the arch' },
      { id:'s1-d', label:'Grind the distal surface of the upper canine' },
    ],
  },
  {
    id:'s2', badge:'Scenario 2', tag:'Class II · Posterior',
    title:'Maxillary protrusion — upper arch MUCH wider than the lower',
    brief:'The lower posterior crest lies lingual to the upper residual ridge. Placing upper teeth on the crest gives inadequate occlusal contact; moving lower teeth buccally destabilises the lower denture.',
    instruction:'Select the best management for a SEVERE discrepancy.',
    correctId:'s2-c',
    successNote:'For severe discrepancies, place the lower posteriors correctly on the crest, set the uppers to occlude well, then build the buccal contour in wax — later replaced by tooth-coloured acrylic — to satisfy aesthetics and support the cheek.',
    options:[
      { id:'s2-a', label:'Move the upper posteriors palatally by a large amount' },
      { id:'s2-b', label:'Move the lower posteriors buccally to meet the uppers' },
      { id:'s2-c', label:'Build buccal contour with wax / tooth-coloured acrylic on the uppers' },
      { id:'s2-d', label:'Extract the upper first premolars' },
    ],
  },
  {
    id:'s3', badge:'Scenario 3', tag:'Class III · Anterior',
    title:'Mandibular protrusion with marked prognathism',
    brief:'The lower anterior ridge is markedly forward in relation to the maxillary ridge. An edge-to-edge relationship is not possible; the lower ridge sits anterior to the upper.',
    instruction:'Tap the correct anterior arrangement.',
    correctId:'s3-c',
    successNote:'With an extreme protrusion of the mandible, a negative or reverse horizontal labial overlap must be used — the lower anterior teeth are placed labial to the upper anterior teeth.',
    options:[
      { id:'s3-a', label:'Introduce a normal 2 mm horizontal overlap' },
      { id:'s3-b', label:'Move the lower anteriors palatally to meet the uppers' },
      { id:'s3-c', label:'Use a negative / reverse horizontal labial overlap' },
      { id:'s3-d', label:'Eliminate the lower first premolars' },
    ],
  },
  {
    id:'s4', badge:'Scenario 4', tag:'Class III · Posterior',
    title:'Mandibular protrusion — very WIDE lower arch',
    brief:'The lower posterior arch is far too wide to be managed by setting the upper posteriors slightly buccal. Non-anatomical teeth alone will not resolve the discrepancy.',
    instruction:'Select the strategy that restores a functional occlusion.',
    correctId:'s4-c',
    successNote:'Cross-arch interchange: upper teeth are placed on the lower denture and lower teeth on the upper denture, across the arch. Because the upper arch is already smaller, the FIRST PREMOLAR must be eliminated.',
    options:[
      { id:'s4-a', label:'Set the upper posterior teeth slightly buccal to the upper ridge' },
      { id:'s4-b', label:'Use non-anatomical posterior teeth only' },
      { id:'s4-c', label:'Cross-arch interchange — upper teeth on the lower denture' },
      { id:'s4-d', label:'Grind the buccal cusps of the lower molars flat' },
    ],
  },
];

type Scenario = (typeof SCENARIOS)[number];

function ScenarioCard({ scenario, onSolved }: {
  scenario: Scenario;
  onSolved?: (id: Scenario['id']) => void;
}) {
  const [placed, setPlaced] = useState<Scenario['options'][number] | null>(null);
  const [status, setStatus] = useState('idle');
  const solved = status === 'correct';

  const evaluate = (id: string) => {
    if (solved) return;
    const opt = scenario.options.find(o => o.id === id);
    if (!opt) return;
    setPlaced(opt);
    if (id === scenario.correctId) {
      setStatus('correct');
      onSolved?.(scenario.id);
    } else {
      setStatus('wrong');
    }
  };

  return (
    <div className={`anim-fade-up flex flex-col overflow-hidden rounded-2xl border bg-white shadow-md transition ${solved ? 'border-prostgold ring-2 ring-prostgold/40' : 'border-slate-100'}`}>
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 sm:px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="navy">{scenario.badge}</Chip>
            <Chip tone="blue">{scenario.tag}</Chip>
          </div>
          <h3 className="mt-2.5 text-[14px] sm:text-[15px] font-bold leading-snug text-slatenavy">{scenario.title}</h3>
        </div>
        {solved && (
          <span className="anim-pop flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-prostgold text-white shadow-md shadow-prostgold/30">
            <Icon name="check" className="h-5 w-5" strokeWidth={3} />
          </span>
        )}
      </div>

      <div className="px-4 sm:px-5 pt-4">
        <p className="text-[13px] leading-relaxed text-slate-600">{scenario.brief}</p>
      </div>

      <div className="px-4 sm:px-5 pt-4">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">{scenario.instruction}</p>
        <div className={`flex min-h-21.5 items-center justify-center rounded-xl border-2 border-dashed px-4 py-3.5 text-center transition ${
          solved ? 'border-prostgold bg-amber-50' : status === 'wrong' ? 'border-rose-300 bg-rose-50/60' : 'border-slate-300 bg-slate-50'
        }`}>
          {placed ? (
            <div className="anim-fade-in">
              <p className={`text-[13px] font-bold leading-snug ${solved ? 'text-prostgold' : 'text-rose-600'}`}>{placed.label}</p>
              <p className={`mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${solved ? 'text-prostgold/80' : 'text-rose-400'}`}>
                {solved ? 'Accepted · correct strategy' : 'Rejected · try again'}
              </p>
            </div>
          ) : (
            <p className="text-[12px] font-medium text-slate-400">Tap the correct strategy below</p>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 pt-3">
        <div className="flex flex-wrap gap-2">
          {scenario.options.map(o => {
            const used = placed?.id === o.id;
            return (
              <button key={o.id} onClick={() => evaluate(o.id)} disabled={solved}
                className={`max-w-full rounded-xl border px-3 py-2.5 text-left text-[12px] sm:text-[12.5px] font-semibold leading-snug transition ${
                  solved ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
                  : used ? 'border-rose-200 bg-rose-50 text-rose-500'
                  : 'cursor-pointer border-slate-200 bg-white text-slate-700 shadow-sm hover:border-maxblue hover:text-maxblue active:scale-[.98]'
                }`}>
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      {solved && (
        <div className="anim-fade-in border-t border-amber-100 bg-amber-50 px-4 sm:px-5 py-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-prostgold">Clinical rationale</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-amber-900">{scenario.successNote}</p>
        </div>
      )}
    </div>
  );
}

function TreatmentSimulator() {
  const [solved, setSolved] = useState<Scenario['id'][]>([]);
  const [key, setKey] = useState(0);

  const handleSolved = (id: Scenario['id']) => setSolved(prev => prev.includes(id) ? prev : [...prev, id]);
  const total = SCENARIOS.length;
  const done = solved.length;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-prostgold">Interactive Practice</p>
          <h1 className="mt-1.5 text-[22px] sm:text-3xl font-extrabold tracking-tight text-slatenavy">Prosthodontic Treatment Simulator</h1>
          <p className="mt-2.5 max-w-3xl text-[13px] sm:text-sm leading-relaxed text-slate-600">
            Tap the correct treatment strategy for each clinical scenario.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Solved</p>
            <p className="text-lg font-extrabold text-slatenavy">{done}<span className="text-slate-300"> / {total}</span></p>
          </div>
          <button onClick={() => { setSolved([]); setKey(k => k + 1); }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[12.5px] font-bold text-slate-600 transition hover:bg-slate-50 active:scale-[.98]">
            Reset
          </button>
        </div>
      </div>

      <ProgressBar value={(done / total) * 100} />

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
        {SCENARIOS.map(s => <ScenarioCard key={`${s.id}-${key}`} scenario={s} onSolved={handleSolved} />)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ░░  SEPARATE LECTURES STRUCTURE (Lecture 1, Lecture 2, Lecture 3)
   ══════════════════════════════════════════════════════════════════════════ */
type Lecture = {
  id: string;
  title: string;
  short: string;
  desc: string;
  nav: { id: string; label: string; kicker: string; short: string; icon: keyof typeof ICON }[];
};

type OverviewProps = { onNavigate: (id: string) => void };

const LECTURES: Lecture[] = [
  {
    id: 'lec1',
    title: 'Lecture 1: ACP Classification',
    short: 'Lec 1',
    desc: 'Classification of the Completely Edentulous Patient',
    nav: [
      { id:'l1-overview',  kicker:'Foundations',  label:'Overview & Rationale',       short:'Overview', icon:'home'   },
      { id:'l1-criteria',  kicker:'Foundations',  label:'The 4 Diagnostic Criteria',  short:'Criteria', icon:'layers' },
      { id:'l1-sandbox',   kicker:'Labs',         label:'3D Mandibular Bone Sandbox', short:'3D Lab',   icon:'eye'    },
      { id:'l1-bone',      kicker:'Labs',         label:'Bone Height Lab',            short:'Bone',     icon:'ruler'  },
      { id:'l1-maxilla',   kicker:'Labs',         label:'Maxilla Morphology',         short:'Maxilla',  icon:'chart'  },
      { id:'l1-muscle',    kicker:'Labs',         label:'Muscle Attachments',         short:'Muscles',  icon:'waves'  },
      { id:'l1-mmr',       kicker:'Labs',         label:'Maxillomandibular Rel.',     short:'MMR',      icon:'swap'   },
      { id:'l1-sim',       kicker:'Application',  label:'Case Simulator',             short:'Simulator',icon:'hand'   },
      { id:'l1-classes',   kicker:'Reference',    label:'Class I–IV Atlas',           short:'Atlas',    icon:'book'   },
      { id:'l1-quiz',      kicker:'Assessment',   label:'Quiz & Recall',              short:'Quiz',     icon:'help'   },
      { id:'l1-checklist', kicker:'Chairside',    label:'Chairside Checklist',        short:'Checklist',icon:'check'  },
    ]
  },
  {
    id: 'lec2',
    title: 'Lecture 2: Single Complete Dentures',
    short: 'Lec 2',
    desc: 'Single Complete Dentures, Material Selection & Occlusal Modification',
    nav: [
      { id:'l2-overview',  kicker:'Start Here',   label:'Overview & Objectives',      short:'Overview', icon:'home'   },
      { id:'l2-materials', kicker:'Interactive',  label:'Material Decision Engine',   short:'Materials',icon:'shield' },
      { id:'l2-mod',       kicker:'Interactive',  label:'Occlusal Modification',      short:'Occl Mod', icon:'ruler'  },
      { id:'l2-heatmap',   kicker:'Interactive',  label:'Stress & Wear Heatmap',      short:'Heatmap',  icon:'chart'  },
      { id:'l2-workflow',  kicker:'Clinical',     label:'Clinical Steps Workflow',    short:'Workflow', icon:'book'   },
      { id:'l2-prognosis', kicker:'Interactive',  label:'Arch Area & Prognosis',      short:'Prognosis',icon:'target' },
      { id:'l2-quiz',      kicker:'Assessment',   label:'Lecture 2 Quiz',             short:'Quiz',     icon:'help'   },
    ]
  },
  {
    id: 'lec3',
    title: 'Lecture 3: Abnormal Jaw Relations & Kelly\'s Syndrome',
    short: 'Lec 3',
    desc: 'Managing Class II, Class III & Kelly\'s Combination Syndrome',
    nav: [
      { id:'l3-overview',  kicker:'Start Here',   label:'Overview & Objectives',      short:'Overview', icon:'home'   },
      { id:'l3-m3',        kicker:'Module 3',     label:'Managing Class II Discrepancies',short:'M3',   icon:'tooth'  },
      { id:'l3-m4',        kicker:'Module 4',     label:'Managing Class III Discrepancies',short:'M4',  icon:'tooth'  },
      { id:'l3-kelly',     kicker:'Interactive',  label:'Kelly\'s Combination Syndrome',  short:'Kelly\'s', icon:'alert'  },
      { id:'l3-wear',      kicker:'Interactive',  label:'Material Wear & VDO Timeline',   short:'VDO Wear', icon:'spark'  },
      { id:'l3-animator',  kicker:'Interactive',  label:'Occlusion Concept Animator',     short:'Animator', icon:'balance'},
      { id:'l3-fracture',  kicker:'Interactive',  label:'Fracture Pattern Risk',          short:'Fracture', icon:'shield' },
      { id:'l3-cycle',     kicker:'Interactive',  label:'Vicious Cycle Pathogenesis Map', short:'Vicious',  icon:'refresh'},
      { id:'l3-sim',       kicker:'Practice',     label:'Prosthodontic Simulator',        short:'Practice', icon:'hand'   },
      { id:'l3-quiz',      kicker:'Assessment',   label:'Lecture 3 Quiz',                 short:'Quiz',     icon:'help'   },
    ]
  }
];

/* ══════════════════════════════════════════════════════════════════════════
   ░░  LECTURE 1 COMPONENTS (ACP Classification)
   ══════════════════════════════════════════════════════════════════════════ */
function Lec1Overview({ onNavigate }: OverviewProps) {
  const benefits = [
    ['🩺','Better patient care','A graduated description of edentulism lets treatment match the actual condition of the supporting structures.'],
    ['💬','Improved professional communication','"Class III mandible" conveys more between clinicians than three paragraphs of description.'],
    ['💳','More appropriate insurance reimbursement','Objective criteria support the justification of procedures and fees.'],
    ['🎓','Better screening tool','Assists dental school admission clinics in assigning patients to undergraduate or graduate students.'],
    ['📊','Standardised outcomes assessment','Creates uniform criteria against which treatment results can be reviewed.'],
    ['🔁','Living document','Designed to be monitored and revised as new diagnostic and treatment information becomes available.']
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-prostgold">Precision Dental · Lecture 1</p>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-slatenavy">Classification of the Completely Edentulous Patient</h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">A focused learning environment for the diagnostic thinking behind complete edentulism and ACP classification.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => onNavigate('l1-sandbox')} className="btn-primary px-4 py-2.5 text-sm font-bold shadow">Open 3D Bone Sandbox</button>
              <button onClick={() => onNavigate('l1-quiz')} className="btn-gold px-4 py-2.5 text-sm font-bold">Take Lecture 1 Quiz</button>
            </div>
          </div>
          <div className="w-32 h-32 bg-maxblue rounded-2xl flex items-center justify-center text-prostgold shrink-0 shadow-lg">
            <Icon name="tooth" className="w-16 h-16" />
          </div>
        </div>
      </div>

      <Card>
        <SectionTitle>Why Edentulous Patients Differ</SectionTitle>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Completely edentulous patients are <b>not one group</b>. They span a huge range of physical variation and health concerns. Treating them as a single diagnostic entity is insensitive to that variation — and to the very different treatment procedures needed to restore function and comfort.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {benefits.map(([icon, title, desc]) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl mb-2">{icon}</div>
            <h3 className="font-bold text-base text-slatenavy mb-1">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lec1Criteria() {
  const criteria = [
    { title: '1. Bone Height — Mandible', scale: 'Type I → IV', desc: 'Measured on panoramic radiograph at the least vertical height. I ≥ 21mm, II 16-20mm, III 11-15mm, IV ≤ 10mm.' },
    { title: '2. Residual Ridge Morphology — Maxilla', scale: 'Type A → D', desc: 'Radiographic bone height is unreliable in maxilla. Graded by vestibular depth, vault resistance, tori, and tuberosity.' },
    { title: '3. Muscle Attachments — Mandible', scale: 'Type A → E', desc: 'Attached mucosal base vs mobile tissue. A = attached everywhere; E = no attached mucosa anywhere.' },
    { title: '4. Maxillomandibular Relationship', scale: 'Class I → III', desc: 'Position of artificial teeth relative to residual ridge. I = normal articulation; III = crossbite.' },
  ];

  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 1" title="The Four Diagnostic Criteria" lede="Everything in the ACP system rests on four objective measurements and clinical findings." />
      <div className="grid gap-6 sm:grid-cols-2">
        {criteria.map((c, i) => (
          <Card key={c.title}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-slatenavy">{c.title}</h3>
              <Chip tone="blue">{c.scale}</Chip>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Lec1Sandbox() {
  const [height, setHeight] = useState(22);
  const [muscle, setMuscle] = useState(20);

  const stab = Math.max(5, Math.min(100, 100 - (muscle/100)*58 - (1 - Math.min(1, height/24))*46));

  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 1" title="Mandibular Bone & Muscle Sandbox" lede="Adjust mandibular height and muscle attachment level to test denture stability." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Residual Bone Height: {height} mm</label>
            <input type="range" min="2" max="26" value={height} onChange={e => setHeight(parseInt(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Muscle Attachment Level: {muscle}%</label>
            <input type="range" min="0" max="100" value={muscle} onChange={e => setMuscle(parseInt(e.target.value))} />
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase">Denture Stability Score</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-extrabold text-maxblue">{Math.round(stab)}%</span>
              <Chip tone={stab > 66 ? 'green' : stab > 35 ? 'gold' : 'red'}>
                {stab > 66 ? 'Stable' : stab > 35 ? 'Moderate' : 'Unstable'}
              </Chip>
            </div>
            <div className="mt-2"><ProgressBar value={stab} /></div>
          </div>
        </Card>
        <Card className="lg:col-span-2 flex flex-col items-center justify-center p-8 bg-slate-900 text-white rounded-2xl">
          <div className="text-center space-y-4">
            <div className="inline-block p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <p className="text-xs uppercase tracking-widest text-slate-400">Mandibular Simulation</p>
              <p className="text-4xl font-extrabold text-amber-400 mt-2">{height} mm Height</p>
              <p className="text-sm text-slate-300 mt-1">Classification: {height >= 21 ? 'Type I (≥21mm)' : height >= 16 ? 'Type II (16-20mm)' : height >= 11 ? 'Type III (11-15mm)' : 'Type IV (≤10mm)'}</p>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Lower bone height and higher muscle attachments (closer to crest) severely compromise peripheral seal and denture stability.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Lec1Simulator() {
  const [bone, setBone] = useState(22);
  const [maxType, setMaxType] = useState('A');
  const [musType, setMusType] = useState('A');
  const [mmrClass, setMmrClass] = useState('I');

  const maxScore = maxType === 'A' ? 1 : maxType === 'B' ? 2 : maxType === 'C' ? 3 : 4;
  const boneScore = bone >= 21 ? 1 : bone >= 16 ? 2 : bone >= 11 ? 3 : 4;
  const musScore = musType === 'A' ? 1 : musType === 'B' ? 2 : musType === 'C' ? 3 : 4;
  const mmrScore = mmrClass === 'I' ? 1 : mmrClass === 'II' ? 2 : 3;

  const finalClass = Math.max(maxScore, boneScore, musScore, mmrScore);
  const roman = ['', 'I', 'II', 'III', 'IV'][finalClass];

  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 1" title="Case Simulator" lede="Configure a patient's diagnostic criteria to calculate their overall ACP Classification." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Mandibular Bone Height: {bone} mm</label>
            <input type="range" min="2" max="26" value={bone} onChange={e => setBone(parseInt(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Maxillary Ridge Morphology</label>
            <div className="flex gap-2">
              {['A', 'B', 'C', 'D'].map(t => (
                <button key={t} onClick={() => setMaxType(t)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm border ${maxType === t ? 'bg-maxblue text-white border-maxblue' : 'bg-white text-slate-700 border-slate-200'}`}>
                  Type {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Mandibular Muscle Attachments</label>
            <div className="flex gap-2">
              {['A', 'B', 'C', 'D', 'E'].map(t => (
                <button key={t} onClick={() => setMusType(t)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm border ${musType === t ? 'bg-maxblue text-white border-maxblue' : 'bg-white text-slate-700 border-slate-200'}`}>
                  Type {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Maxillomandibular Relationship</label>
            <div className="flex gap-2">
              {['I', 'II', 'III'].map(c => (
                <button key={c} onClick={() => setMmrClass(c)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm border ${mmrClass === c ? 'bg-maxblue text-white border-maxblue' : 'bg-white text-slate-700 border-slate-200'}`}>
                  Class {c}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900 text-white flex flex-col justify-between p-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-prostgold">Calculated Diagnosis</p>
            <div className="mt-4 text-center py-6 bg-slate-800 rounded-2xl border border-slate-700">
              <span className="text-5xl font-extrabold text-amber-400">Class {roman}</span>
              <p className="text-sm font-bold text-slate-300 mt-2">
                {finalClass === 1 ? 'Uncomplicated' : finalClass === 2 ? 'Moderate Complexity' : finalClass === 3 ? 'Surgical Revision Needed' : 'Most Debilitated · High Risk'}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            The overall classification is determined by the most severe finding among all criteria.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Lec1Atlas() {
  const classes = [
    { id:'Class I', title:'Uncomplicated', col:'bg-emerald-100 text-emerald-800 border-emerald-300', desc:'Ample bone (≥21mm), Type A maxilla, favourable muscle attachments, Class I MMR. Conventional prosthodontic techniques succeed easily.' },
    { id:'Class II', title:'Moderate Complexity', col:'bg-amber-100 text-amber-800 border-amber-300', desc:'Bone height 16-20mm, mild compromise, early systemic disease interactions or patient management considerations.' },
    { id:'Class III', title:'Surgical Revision', col:'bg-orange-100 text-orange-800 border-orange-300', desc:'Bone height 11-15mm, Type C maxilla, requiring preprosthetic surgery (alveolotomy, simple implants) for adequate function.' },
    { id:'Class IV', title:'Most Debilitated / High Risk', col:'bg-rose-100 text-rose-800 border-rose-300', desc:'Bone height ≤10mm, Type D maxilla, severe atrophy, requiring major surgical reconstruction or specialised techniques.' },
  ];

  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 1" title="Class I – IV Reference Atlas" lede="Side-by-side comparison of the four ACP classification levels." />
      <div className="grid gap-6 sm:grid-cols-2">
        {classes.map(c => (
          <div key={c.id} className={`rounded-2xl border p-6 bg-white shadow-sm border-l-8 ${c.col}`}>
            <span className="text-xs font-extrabold uppercase tracking-wider">{c.id}</span>
            <h3 className="text-xl font-extrabold text-slatenavy mt-1">{c.title}</h3>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lec1Quiz() {
  return <Quiz />;
}

function Lec1Checklist() {
  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 1" title="Chairside Checklist" lede="Verify patient findings step-by-step during clinical examination." />
      <Card>
        <SectionTitle>Diagnostic Examination Protocol</SectionTitle>
        <div className="space-y-3">
          {[
            'Panoramic radiograph taken and measured at least vertical height of mandible.',
            'Maxillary residual ridge morphology evaluated (Type A, B, C or D).',
            'Mandibular muscle attachments and vestibular depth assessed.',
            'Maxillomandibular relationship recorded in centric relation.',
            'Systemic medical history, medication review, and psychosocial evaluation completed.',
            'Overall ACP classification established and treatment plan justified.'
          ].map((item, idx) => (
            <label key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-100 transition">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded text-maxblue focus:ring-maxblue" />
              <span className="text-sm font-medium text-slate-700">{item}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════════════
   ░░  LECTURE 2 COMPONENTS (Single Complete Dentures & Occlusal Mod)
   ══════════════════════════════════════════════════════════════════════════ */
function Lec2Overview({ onNavigate }: OverviewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-md">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-prostgold">Precision Dental · Lecture 2</p>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-slatenavy">Single Complete Dentures &amp; Occlusal Modification</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
          Clinical considerations for fabricating single complete dentures opposing natural or restored dentition, material selection, and pre-prosthetic occlusal adjustments.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={() => onNavigate('l2-materials')} className="btn-primary px-4 py-2 text-sm font-bold">Material Decision Engine</button>
          <button onClick={() => onNavigate('l2-mod')} className="btn-gold px-4 py-2 text-sm font-bold">Occlusal Mod Techniques</button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <SectionTitle>Key Concepts in Lecture 2</SectionTitle>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Material selection based on opposing arch condition.</li>
            <li>• Pre-prosthetic occlusal adjustment (Yurkstas, Swenson, Bruce).</li>
            <li>• Stress distribution, denture fracture risks, and reinforcement.</li>
            <li>• Clinical workflow for single complete dentures.</li>
          </ul>
        </Card>
        <Card>
          <SectionTitle accent="gold">Prognosis Factors</SectionTitle>
          <p className="text-sm text-slate-600 leading-relaxed">
            Single maxillary dentures opposing natural mandibular teeth often experience severe occlusal forces, leading to accelerated wear of artificial teeth and bone resorption.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Lec2Materials() {
  const conditions = ['porcelain', 'gold', 'natural'] as const;
  const [opposing, setOpposing] = useState<(typeof conditions)[number]>('porcelain');
  const data = {
    porcelain: { t:'Porcelain Teeth', d:'Preferred for opposing porcelain. Beware of severe abrasion on natural teeth.' },
    gold: { t:'Acrylic Teeth', d:'Opposing gold/metal crowns. Prevents wear of crowns, but acrylic wears over time.' },
    natural: { t:'Acrylic with Gold Occlusals', d:'Opposing natural teeth. Gold occlusals minimize wear on both acrylic and natural teeth.' },
  }[opposing];

  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 2" title="Material Decision Engine" lede="Select opposing dentition to determine optimal artificial tooth material." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 space-y-3">
          <h3 className="font-bold text-base text-slatenavy">Opposing Dentition Condition</h3>
          {conditions.map(k => (
            <button key={k} onClick={() => setOpposing(k)}
              className={`w-full text-left p-3 rounded-xl border font-semibold text-sm transition ${opposing === k ? 'border-maxblue bg-blue-50 text-maxblue' : 'border-slate-200 bg-white text-slate-700'}`}>
              Opposing {k.charAt(0).toUpperCase() + k.slice(1)}
            </button>
          ))}
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-bold text-slatenavy mb-2">{data.t}</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{data.d}</p>
        </Card>
      </div>
    </div>
  );
}

function Lec2Mod() {
  const [tech, setTech] = useState('yurkstas');
  const info = {
    yurkstas: 'U-shaped metal occlusal template, slightly convex on lower surface to detect minor deviations.',
    swenson: 'Upper and lower casts mounted. Interfering natural teeth adjusted on cast and marked with pencil.',
    bruce: 'Clear acrylic resin template with pressure indicating paste (PIP) to reveal high spots.',
  }[tech];

  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 2" title="Pre-Prosthetic Occlusal Modification" lede="Compare diagnostic techniques for correcting occlusal discrepancies." />
      <Card>
        <div className="flex gap-2 mb-4">
          {['yurkstas', 'swenson', 'bruce'].map(t => (
            <button key={t} onClick={() => setTech(t)}
              className={`flex-1 py-2 rounded-lg font-bold text-sm border capitalize ${tech === t ? 'bg-maxblue text-white border-maxblue' : 'bg-white text-slate-700 border-slate-200'}`}>
              {t} Technique
            </button>
          ))}
        </div>
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
          <h3 className="font-bold text-base text-slatenavy capitalize mb-2">{tech} Technique</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{info}</p>
        </div>
      </Card>
    </div>
  );
}

function Lec2Heatmap() {
  const [force, setForce] = useState(50);
  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 2" title="Denture Stress & Wear Heatmap" lede="Analyze stress concentrations and fracture risks based on bite force." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Bite Force: {force}%</label>
          <input type="range" min="0" max="100" value={force} onChange={e => setForce(parseInt(e.target.value))} />
          <Note tone="red" label="Stress concentration">
            Deep frenal notches and high occlusal loads create severe stress concentrations, predisposing the acrylic denture base to midline fracture.
          </Note>
        </Card>
        <Card className="bg-slate-900 text-white flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-slate-400">Calculated Stress Level</p>
            <p className="text-4xl font-extrabold text-amber-400 mt-2">{force > 70 ? 'High Risk' : force > 35 ? 'Moderate' : 'Low'}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Lec2Workflow() {
  const steps = [
    'Diagnosis & Diagnostic Cast Mounting (Facebow + Interocclusal record).',
    'Occlusal Adjustment / Tooth Modification (Yurkstas, Swenson, Bruce).',
    'Final Impression (maximum extension without muscle impingement).',
    'Jaw Relation (record intermaxillary relations).',
    'Facebow Transfer & Articulator Mounting.',
    'Artificial Teeth Adjustment & Try-in (Balanced or Monoplane occlusion).',
    'Delivery & Occlusal Check (pressure spots and occlusion verification).'
  ];
  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 2" title="Clinical Steps Workflow" lede="Step-by-step clinical protocol for single complete dentures." />
      <Card>
        <Steps items={steps} />
      </Card>
    </div>
  );
}

function Lec2Prognosis() {
  const [implants, setImplants] = useState(false);
  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 2" title="Arch Area & Prognosis Simulator" lede="Mandibular single denture prognosis compared to maxillary arch." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <h3 className="font-bold text-lg text-slatenavy">Mandibular Support Enhancement</h3>
          <button onClick={() => setImplants(!implants)} className={`btn-primary px-4 py-2.5 text-sm font-bold w-full`}>
            {implants ? 'Remove Mandibular Implants' : 'Add Mandibular Implants (Improves Prognosis)'}
          </button>
          <Note tone={implants ? 'green' : 'red'} label="Prognosis status">
            {implants ? 'Implants drastically reduce force per unit area on the mandibular ridge, greatly improving prognosis.' : 'Without implants, the small mandibular bearing area under heavy occlusal forces leads to rapid bone resorption.'}
          </Note>
        </Card>
        <Card className="bg-slate-900 text-white flex items-center justify-center p-8 text-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Mandibular Prognosis</p>
            <p className="text-3xl font-extrabold text-amber-400 mt-2">{implants ? 'Favorable / Stable' : 'Poor / High Risk'}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Lec2Quiz() {
  return <Quiz />;
}


/* ══════════════════════════════════════════════════════════════════════════
   ░░  LECTURE 3 COMPONENTS (Kelly's Syndrome & Abnormal Jaw Relations)
   ══════════════════════════════════════════════════════════════════════════ */
function Lec3Overview({ onNavigate }: OverviewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-md">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-prostgold">Precision Dental · Lecture 3</p>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-slatenavy">Abnormal Jaw Relations &amp; Kelly's Combination Syndrome</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
          Managing Class II and Class III skeletal discrepancies, preventing Kelly's Combination Syndrome, VDO loss, and cross-arch tooth arrangements.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={() => onNavigate('l3-kelly')} className="btn-primary px-4 py-2 text-sm font-bold">Kelly's Syndrome</button>
          <button onClick={() => onNavigate('l3-quiz')} className="btn-gold px-4 py-2 text-sm font-bold">Take Lecture 3 Quiz</button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <SectionTitle>Key Topics in Lecture 3</SectionTitle>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Managing Class II anterior and posterior discrepancies.</li>
            <li>• Managing Class III discrepancies &amp; cross-arch interchange.</li>
            <li>• Kelly's Combination Syndrome pathogenesis &amp; vicious cycle.</li>
            <li>• Material wear, VDO loss, and fracture risk mitigation.</li>
          </ul>
        </Card>
        <Card>
          <SectionTitle accent="gold">Golden Rule</SectionTitle>
          <p className="text-sm text-slate-600 leading-relaxed">
            Never attempt to force an abnormal jaw relation into a normal Class I occlusion without proper pre-prosthetic planning or tooth elimination.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Module3() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHead kicker="Module 3" title="Managing Class II — Maxillary Protrusion & Wider Upper Arch"
        lede="The cardinal rule: never reduce the horizontal overlap by moving the upper anterior teeth palatally or the lower anterior teeth labially." />

      <Note tone="red" label="Absolute rule — anterior">
        <strong>DO NOT</strong> move the upper anterior teeth palatally. <strong>DO NOT</strong> move the lower anterior teeth labially. Doing so violates the neutral zone and destroys stability, retention and aesthetics.
      </Note>

      <Card>
        <SectionTitle accent="gold">Anterior Teeth — Excessive Overjet</SectionTitle>
        <Steps items={[
          <><strong>Narrower lower anterior teeth.</strong> Select lower anteriors of narrower mesiodistal width.</>,
          <><strong>Crowding / overlapping lower anteriors.</strong> If aesthetics permit, slight crowding may solve the problem.</>,
          <><strong>Spacing the upper anteriors.</strong> Leave slight spaces to attain normal canine relations.</>,
          <><strong>Grind the distal surface of the lower canine.</strong> Sufficient to restore normal canine relationship.</>,
          <><strong>Eliminate the lower first premolars.</strong> When the discrepancy is excessive, the <strong className="text-prostgold">lower first premolars must be eliminated</strong>.</>,
        ]} />
      </Card>
    </div>
  );
}

function Module4() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHead kicker="Module 4" title="Managing Class III — Mandibular Protrusion & Wider Lower Arch"
        lede="Here the lower anterior ridge is forward in relation to the maxillary ridge — from edge-to-edge relation to marked prognathism." />

      <Card>
        <SectionTitle accent="navy">Anterior Teeth — Mandibular Protrusion</SectionTitle>
        <Steps items={[
          <><strong>Edge-to-edge relation.</strong> Incisal edges meet edge-to-edge.</>,
          <><strong>Extreme protrusion.</strong> Use a <strong>negative / reverse horizontal labial overlap</strong> — lower anteriors placed labial to the uppers.</>,
          <><strong>Cross-arch interchange</strong> in severe posterior cross-bites.</>,
        ]} />
      </Card>
    </div>
  );
}

function Lec3M3() {
  return <Module3 />;
}

function Lec3M4() {
  return <Module4 />;
}

function Lec3Kelly() {
  const [stage, setStage] = useState(0);
  const stages = [
    'Stage 1: Initial wear and occlusal force concentration on anterior maxilla.',
    'Stage 2: Severe anterior maxillary bone resorption and replacement by flabby tissue.',
    'Stage 3: Maxillary tuberosity down-growth and lower anterior tooth supraeruption.',
    'Stage 4: Mandibular RPD posterior bone resorption.',
    'Stage 5: Vicious cycle and complete prosthetic breakdown (Kelly\'s Combination Syndrome).'
  ];

  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 3" title="Kelly's Combination Syndrome Timeline" lede="Explore the progressive destructive changes associated with a complete upper denture opposing a lower distal-extension RPD." />
      <Card className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Progression Stage: {stage + 1} / 5</label>
          <input type="range" min="0" max="4" step="1" value={stage} onChange={e => setStage(parseInt(e.target.value))} />
        </div>
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
          <h3 className="font-bold text-base text-amber-900 mb-2">Stage {stage + 1} Manifestation</h3>
          <p className="text-sm text-amber-900 leading-relaxed">{stages[stage]}</p>
        </div>
      </Card>
    </div>
  );
}

function Lec3Wear() {
  const [time, setTime] = useState(5);
  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 3" title="Material Wear & VDO Loss Timeline" lede="Simulate loss of Vertical Dimension of Occlusion (VDO) over years." />
      <Card className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Time elapsed: {time} Years</label>
        <input type="range" min="0" max="10" value={time} onChange={e => setTime(parseInt(e.target.value))} />
        <Note tone="gold" label="VDO impact">
          Acrylic teeth wear down over {time} years, resulting in loss of vertical dimension of occlusion and increased muscle fatigue.
        </Note>
      </Card>
    </div>
  );
}

function Lec3Animator() {
  const [type, setType] = useState('balanced');
  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 3" title="Occlusion Concept Animator" lede="Compare Balanced Occlusion with Monoplane Occlusion during lateral movements." />
      <Card className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setType('balanced')}
            className={`flex-1 py-2.5 font-bold rounded-lg border ${type === 'balanced' ? 'bg-maxblue text-white border-maxblue' : 'bg-white text-slate-700 border-slate-200'}`}>
            Balanced Occlusion
          </button>
          <button onClick={() => setType('monoplane')}
            className={`flex-1 py-2.5 font-bold rounded-lg border ${type === 'monoplane' ? 'bg-maxblue text-white border-maxblue' : 'bg-white text-slate-700 border-slate-200'}`}>
            Monoplane Occlusion
          </button>
        </div>
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-sm text-slate-700 leading-relaxed">
            {type === 'balanced' ? 'Bilateral, simultaneous contact of all teeth on working and balancing sides. Used with anatomic teeth.' : 'Flat occlusal plane. Minimizes horizontal forces. Ideal for attrited teeth and Kelly\'s syndrome.'}
          </p>
        </div>
      </Card>
    </div>
  );
}

function Lec3Fracture() {
  const [anterior, setAnterior] = useState(false);
  const [notch, setNotch] = useState(false);
  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 3" title="Fracture Pattern Risk Visualizer" lede="Identify weak points leading to denture fracture." />
      <Card className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={anterior} onChange={e => setAnterior(e.target.checked)} className="h-5 w-5 rounded text-maxblue" />
          <span className="text-sm font-bold text-slate-700">Excessive Anterior Load</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={notch} onChange={e => setNotch(e.target.checked)} className="h-5 w-5 rounded text-maxblue" />
          <span className="text-sm font-bold text-slate-700">Deep Labial Notch</span>
        </label>
        <Note tone={anterior || notch ? 'red' : 'green'} label="Risk assessment">
          {anterior || notch ? 'High fracture risk along midline! Reinforcement or cast metal base recommended.' : 'Denture base stable under current parameters.'}
        </Note>
      </Card>
    </div>
  );
}

function Lec3Cycle() {
  const [step, setStep] = useState(1);
  const steps = [
    '1. Patient concentrates occlusal load on remaining mandibular anterior teeth.',
    '2. Severe resorption of anterior maxilla with flabby tissue formation.',
    '3. Occlusal plane tilts anteriorly upwards and posteriorly downwards.',
    '4. Lower anterior teeth supraerupt due to disocclusion.',
    '5. Mandibular posterior RPD resorption completes the vicious cycle.'
  ];
  return (
    <div className="space-y-6">
      <PageHead kicker="Lecture 3" title="Vicious Cycle Pathogenesis Map" lede="Click through the steps of Kelly's syndrome pathogenesis." />
      <Card className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} onClick={() => setStep(s)}
              className={`flex-1 py-2 rounded-lg font-bold text-sm border ${step === s ? 'bg-prostgold text-white border-prostgold' : 'bg-white text-slate-700 border-slate-200'}`}>
              Step {s}
            </button>
          ))}
        </div>
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-sm font-bold text-slatenavy">{steps[step - 1]}</p>
        </div>
      </Card>
    </div>
  );
}

function Lec3Sim() {
  return <TreatmentSimulator />;
}

function Lec3Quiz() {
  return <Quiz />;
}


/* ══════════════════════════════════════════════════════════════════════════
   ░░  APP SHELL
   ══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [activeLecId, setActiveLecId] = useState('lec1');
  const [activeNavId, setActiveNavId] = useState('l1-overview');
  const [visited, setVisited] = useState(() => new Set(['l1-overview']));
  const [drawer, setDrawer] = useState(false);
  const [sheet, setSheet] = useState(false);

  const currentLec = LECTURES.find(l => l.id === activeLecId) || LECTURES[0];

  const go = useCallback((id: string) => {
    const lec = LECTURES.find(l => l.nav.some(n => n.id === id));
    if (lec) {
      if (lec.id !== activeLecId) {
        setActiveLecId(lec.id);
      }
      setActiveNavId(id);
      setVisited(prev => new Set(prev).add(id));
      setDrawer(false);
      setSheet(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeLecId]);

  const switchLecture = (lecId: string) => {
    const lecture = LECTURES.find(l => l.id === lecId);
    if (lecture) go(lecture.nav[0].id);
  };

  const currentNavIndex = currentLec.nav.findIndex(n => n.id === activeNavId);
  const prevNav = currentNavIndex > 0 ? currentLec.nav[currentNavIndex - 1] : null;
  const nextNav = currentNavIndex < currentLec.nav.length - 1 ? currentLec.nav[currentNavIndex + 1] : null;

  const totalNavCount = LECTURES.reduce((acc, l) => acc + l.nav.length, 0);
  const progress = Math.round((visited.size / totalNavCount) * 100);

  const renderContent = () => {
    switch (activeNavId) {
      // Lecture 1
      case 'l1-overview':  return <Lec1Overview onNavigate={go} />;
      case 'l1-criteria':  return <Lec1Criteria />;
      case 'l1-sandbox':   return <Lec1Sandbox />;
      case 'l1-bone':      return <Lec1Sandbox />;
      case 'l1-maxilla':   return <Lec1Criteria />;
      case 'l1-muscle':    return <Lec1Sandbox />;
      case 'l1-mmr':       return <Lec1Criteria />;
      case 'l1-sim':       return <Lec1Simulator />;
      case 'l1-classes':   return <Lec1Atlas />;
      case 'l1-quiz':      return <Lec1Quiz />;
      case 'l1-checklist': return <Lec1Checklist />;

      // Lecture 2
      case 'l2-overview':  return <Lec2Overview onNavigate={go} />;
      case 'l2-materials': return <Lec2Materials />;
      case 'l2-mod':       return <Lec2Mod />;
      case 'l2-heatmap':   return <Lec2Heatmap />;
      case 'l2-workflow':  return <Lec2Workflow />;
      case 'l2-prognosis': return <Lec2Prognosis />;
      case 'l2-quiz':      return <Lec2Quiz />;

      // Lecture 3
      case 'l3-overview':  return <Lec3Overview onNavigate={go} />;
      case 'l3-m3':        return <Lec3M3 />;
      case 'l3-m4':        return <Lec3M4 />;
      case 'l3-kelly':     return <Lec3Kelly />;
      case 'l3-wear':      return <Lec3Wear />;
      case 'l3-animator':  return <Lec3Animator />;
      case 'l3-fracture':  return <Lec3Fracture />;
      case 'l3-cycle':     return <Lec3Cycle />;
      case 'l3-sim':       return <Lec3Sim />;
      case 'l3-quiz':      return <Lec3Quiz />;

      default:             return <Lec1Overview onNavigate={go} />;
    }
  };

  const Sidebar = (
    <>
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-maxblue to-slatenavy shadow-md text-white">
            <Icon name="tooth" className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-extrabold leading-tight tracking-tight text-slatenavy">
              Precision<span className="text-prostgold">Dental</span>
            </p>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Prosthodontics
            </p>
          </div>
        </div>

        {/* Lecture Switcher Tabs (Lec 1, Lec 2, Lec 3) */}
        <div className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
          {LECTURES.map(l => (
            <button key={l.id} onClick={() => switchLecture(l.id)}
              className={`rounded-lg py-2 text-[11px] font-extrabold transition ${
                activeLecId === l.id ? 'bg-white text-maxblue shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}>
              {l.short}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            <span>Overall Progress</span>
            <span className="text-prostgold">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto scroll-thin px-3 py-4">
        <p className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-prostgold">{currentLec.title}</p>
        {currentLec.nav.map(item => {
          const isActive = activeNavId === item.id;
          const isDone = visited.has(item.id);
          return (
            <button key={item.id} onClick={() => go(item.id)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                isActive ? 'bg-maxblue text-white shadow-md shadow-maxblue/20' : 'text-slate-600 hover:bg-slate-100'
              }`}>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white'
              }`}>
                <Icon name={item.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-[9px] font-extrabold uppercase tracking-[0.14em] ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                  {item.kicker}
                </span>
                <span className="block truncate text-[12.5px] font-bold leading-tight">{item.label}</span>
              </span>
              {isDone && !isActive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-prostgold" />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 px-5 py-3.5">
        <p className="text-[9.5px] leading-relaxed text-slate-400">
          Precision Dental · Clinical study companion · Fully responsive for Mobile, Tablet &amp; Laptop.
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-clinical">
      <div className="mx-auto flex max-w-[1550px]">
        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-75 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
          {Sidebar}
        </aside>

        {/* Mobile / Tablet Drawer */}
        {drawer && (
          <>
            <div className="fixed inset-0 z-40 bg-slatenavy/40 backdrop-blur-sm lg:hidden" onClick={() => setDrawer(false)} />
            <aside className="anim-slide-left fixed inset-y-0 left-0 z-50 flex w-75 flex-col border-r border-slate-200 bg-white lg:hidden">
              {Sidebar}
            </aside>
          </>
        )}

        <div className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
            <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-3">
              <button onClick={() => setDrawer(true)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
                aria-label="Open navigation">
                <Icon name="menu" className="h-5 w-5" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-maxblue/10 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-maxblue">
                    {currentLec.short}
                  </span>
                  <p className="text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-prostgold">
                    {currentLec.nav.find(n => n.id === activeNavId)?.kicker}
                  </p>
                </div>
                <h2 className="truncate text-[13.5px] sm:text-[16px] font-extrabold text-slatenavy">
                  {currentLec.nav.find(n => n.id === activeNavId)?.label}
                </h2>
              </div>

              {/* Lecture switcher quick pills */}
              <div className="hidden sm:flex items-center gap-2">
                {LECTURES.map(l => (
                  <button key={l.id} onClick={() => switchLecture(l.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                      activeLecId === l.id ? 'bg-maxblue text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>
                    {l.short}
                  </button>
                ))}
              </div>

              <div className="md:hidden text-right shrink-0">
                <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Progress</p>
                <p className="text-[12px] font-extrabold text-prostgold">{progress}%</p>
              </div>
            </div>
            <div className="lg:hidden">
              <ProgressBar value={progress} />
            </div>
          </header>

          {/* Main View Area */}
          <main className="px-4 sm:px-6 lg:px-8 py-5 sm:py-7 pb-28 lg:pb-12">
            <div key={activeNavId} className="anim-fade-up">
              {renderContent()}
            </div>

            {/* Previous / Next Navigation Buttons */}
            <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
              {prevNav ? (
                <button onClick={() => go(prevNav.id)}
                  className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-bold text-slate-700 shadow-sm transition hover:border-maxblue hover:text-maxblue active:scale-[.98]">
                  <Icon name="arrowL" className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                  <div className="text-left">
                    <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Previous</span>
                    <span className="block truncate max-w-35 sm:max-w-xs">{prevNav.label}</span>
                  </div>
                </button>
              ) : <div />}

              {nextNav ? (
                <button onClick={() => go(nextNav.id)}
                  className="group flex items-center gap-2.5 rounded-xl bg-maxblue px-4 sm:px-6 py-3 text-[13px] font-extrabold text-white shadow-md shadow-maxblue/25 transition hover:brightness-110 active:scale-[.98]">
                  <div className="text-right">
                    <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-blue-200">Next</span>
                    <span className="block truncate max-w-35 sm:max-w-xs">{nextNav.label}</span>
                  </div>
                  <Icon name="arrowR" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
              ) : <div />}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="safe-b fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden">
        <div className="flex items-stretch justify-around px-2 py-1">
          <button onClick={() => switchLecture(activeLecId === 'lec1' ? 'lec2' : activeLecId === 'lec2' ? 'lec3' : 'lec1')}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-prostgold font-extrabold">
            <Icon name="refresh" className="h-5 w-5" />
            <span className="text-[10px]">Switch Lecture</span>
          </button>
          <button onClick={() => setSheet(true)}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-maxblue font-extrabold">
            <Icon name="menu" className="h-5 w-5" />
            <span className="text-[10px]">Jump Module</span>
          </button>
          {prevNav && (
            <button onClick={() => go(prevNav.id)}
              className="flex flex-1 flex-col items-center gap-0.5 py-2 text-slate-600">
              <Icon name="arrowL" className="h-5 w-5" />
              <span className="text-[10px]">Prev</span>
            </button>
          )}
          {nextNav && (
            <button onClick={() => go(nextNav.id)}
              className="flex flex-1 flex-col items-center gap-0.5 py-2 text-slate-600">
              <Icon name="arrowR" className="h-5 w-5" />
              <span className="text-[10px]">Next</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Module Jump Sheet */}
      {sheet && (
        <>
          <div className="fixed inset-0 z-50 bg-slatenavy/40 backdrop-blur-sm lg:hidden" onClick={() => setSheet(false)} />
          <div className="anim-slide-up safe-b fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-slate-200 bg-white p-5 lg:hidden">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Select a section · {currentLec.title}</h3>
              <div className="flex gap-2">
                {LECTURES.map(l => (
                  <button key={l.id} onClick={() => switchLecture(l.id)}
                    className={`text-xs font-bold px-2 py-1 rounded ${activeLecId === l.id ? 'bg-maxblue text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {l.short}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {currentLec.nav.map(m => (
                <button key={m.id} onClick={() => go(m.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    activeNavId === m.id ? 'border-maxblue bg-maxblue/10 text-maxblue font-bold' : 'border-slate-200 bg-white text-slate-700'
                  }`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-maxblue/10 text-maxblue">
                    <Icon name={m.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{m.kicker}</span>
                    <span className="block text-[13.5px] font-bold">{m.label}</span>
                  </span>
                  <Icon name="chevR" className="h-4 w-4 text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

