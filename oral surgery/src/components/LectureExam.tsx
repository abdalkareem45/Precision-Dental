import React, { useState } from 'react';
import { Card, SectionTitle, Pill } from './UI';

function OcclusionChecker() {
  const [pattern, setPattern] = useState('normal');
  const patterns: Record<string, { name: string; tone: string; desc: string }> = {
    normal:      { name:'Normal occlusion', tone:'green', desc:'Pre-injury relationship. The patient reports a normal bite and wear facets match.' },
    anteriorOB:  { name:'Anterior open bite', tone:'red', desc:'Classic with bilateral condylar fractures. Premature contact of posterior teeth forces the anterior teeth apart. Rehabilitating these patients conservatively is difficult.' },
    lateralOB:   { name:'Lateral open bite',  tone:'red', desc:'Unilateral condylar fracture — the mandible deviates toward the fractured side, producing premature contact on the ipsilateral molars.' },
    stepDef:     { name:'Step deformity',     tone:'red', desc:'Displaced body or angle fracture. The occlusal plane is interrupted at the fracture site.' },
  };
  const p = patterns[pattern];

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-4">
        <h3 className="font-extrabold text-lg text-[#0B1F4D]">Occlusion Checker</h3>
        <p className="text-sm text-slate-500 mt-1">Compare normal and pathological bite patterns seen in mandibular fracture.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(patterns).map(([k, pp]) => (
              <button key={k} onClick={() => setPattern(k)}
                className={`rounded-xl border p-2.5 transition-all ${
                  pattern === k ? 'border-[#C9A24B] ring-2 ring-[#C9A24B]/40 bg-[#C9A24B]/5' : 'border-[#E6E8EC] bg-white hover:border-[#C9A24B]'
                }`}>
                <div className="aspect-square rounded-lg bg-[#0B1F4D]/90 flex items-center justify-center mb-2">
                  <svg viewBox="0 0 60 60" className="w-12 h-12">
                    <path d="M 8 20 Q 30 6 52 20" stroke="#E4CE94" strokeWidth="3" fill="none"/>
                    {k === 'normal' && <path d="M 8 40 Q 30 54 52 40" stroke="#E4CE94" strokeWidth="3" fill="none"/>}
                    {k === 'anteriorOB' && <path d="M 8 40 Q 30 44 52 40" stroke="#E4CE94" strokeWidth="3" fill="none"/>}
                    {k === 'lateralOB' && <path d="M 8 40 Q 20 40 30 46 Q 42 52 52 40" stroke="#E4CE94" strokeWidth="3" fill="none"/>}
                    {k === 'stepDef' && (
                      <>
                        <path d="M 8 40 Q 22 54 32 42" stroke="#E4CE94" strokeWidth="3" fill="none"/>
                        <path d="M 32 42 Q 42 34 52 40" stroke="#E4CE94" strokeWidth="3" fill="none"/>
                      </>
                    )}
                  </svg>
                </div>
                <div className="text-[11px] font-bold text-[#0B1F4D] leading-tight text-left">{pp.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className={`rounded-2xl border p-5 h-full ${
            p.tone === 'green' ? 'border-emerald-200 bg-emerald-50/60' : 'border-rose-200 bg-rose-50/60'
          }`}>
            <Pill tone={p.tone as any}>{p.tone === 'green' ? 'NORMAL' : 'PATHOLOGICAL'}</Pill>
            <h4 className="mt-3 font-extrabold text-[#0B1F4D] text-lg">{p.name}</h4>
            <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">{p.desc}</p>

            <div className="mt-4 rounded-xl bg-white border border-[#E6E8EC] p-3.5">
              <div className="text-[10.5px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-1.5">Clinical tip</div>
              <p className="text-[12.5px] text-slate-700 leading-relaxed">
                Ask the patient if their "bite feels normal" — a subjective report of malocclusion
                should be taken seriously, documented, and compared with the pre-injury occlusion.
                Wear facets can help identify pre-existing occlusal relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function IANNervePathway() {
  const [hotspot, setHotspot] = useState('mandibularForamen');
  const spots: Record<string, { name: string; x: number; y: number; desc: string }> = {
    mandibularForamen: { name:'Mandibular foramen', x:295, y:180, desc:'Entry point of the inferior alveolar nerve into the mandible, on the medial surface of the ramus.' },
    canal:             { name:'Mandibular canal',   x:230, y:230, desc:'The IAN runs through the body of the mandible here — angle fractures frequently cause injury at this level.' },
    mentalForamen:     { name:'Mental foramen',     x:130, y:255, desc:'Exit point of the mental nerve on the lateral surface of the body. Injury produces numbness of the lower lip and chin.' },
  };
  const s = spots[hotspot];

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-4">
        <h3 className="font-extrabold text-lg text-[#0B1F4D]">Inferior Alveolar Nerve Pathway</h3>
        <p className="text-sm text-slate-500 mt-1">Click each marker to see where the IAN can be injured in a mandibular fracture.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <svg viewBox="0 0 420 320" className="w-full h-auto">
            <rect width="420" height="320" rx="16" fill="#FAF8F3"/>
            <path d="M 60 250 C 130 300 260 285 300 220 C 330 175 340 130 335 85" fill="none" stroke="#E6E8EC" strokeWidth="46" strokeLinecap="round"/>
            <path d="M 60 250 C 130 300 260 285 300 220 C 330 175 340 130 335 85" fill="none" stroke="#0B1F4D" strokeWidth="46" strokeLinecap="round" opacity="0.06"/>
            <path d="M 85 240 C 145 285 245 265 290 205" fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" opacity="0.9"/>
            <path d="M 300 165 C 265 200 200 235 155 245 C 140 250 132 252 128 252"
              fill="none" stroke="#C9A24B" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 3" className="dash-anim"/>
            {[[265,205],[230,225],[195,238],[160,246]].map(([x,y],i) => (
              <line key={i} x1={x} y1={y} x2={x+2} y2={y-22} stroke="#C9A24B" strokeWidth="1.5" opacity="0.7"/>
            ))}
            <path d="M 128 252 L 118 265 M 128 252 L 122 268" stroke="#C9A24B" strokeWidth="2" strokeLinecap="round"/>

            {Object.entries(spots).map(([k, sp]) => (
              <g key={k} onClick={() => setHotspot(k)} style={{cursor:'pointer'}}>
                <circle cx={sp.x} cy={sp.y} r="14" fill={hotspot===k ? '#C9A24B' : '#FFFFFF'} stroke="#C9A24B" strokeWidth="2.5" opacity={hotspot===k ? 1 : 0.9}/>
                <circle cx={sp.x} cy={sp.y} r="5" fill={hotspot===k ? '#FFFFFF' : '#C9A24B'}/>
                {hotspot === k && (
                  <circle cx={sp.x} cy={sp.y} r="20" fill="none" stroke="#C9A24B" strokeWidth="1.5" opacity="0.5"/>
                )}
              </g>
            ))}
            <text x="210" y="310" textAnchor="middle" fontSize="10.5" fill="#64748B" fontStyle="italic">
              Click a marker to inspect that site
            </text>
          </svg>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-[#C9A24B]/40 bg-[#C9A24B]/5 p-5 h-full">
            <Pill tone="gold">Hotspot</Pill>
            <h4 className="mt-3 font-extrabold text-[#0B1F4D] text-lg">{s.name}</h4>
            <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">{s.desc}</p>

            <div className="mt-4 rounded-xl bg-white border border-[#E6E8EC] p-3.5">
              <div className="text-[10.5px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-1.5">Clinical exam</div>
              <p className="text-[12.5px] text-slate-700 leading-relaxed">
                Test lower-lip sensation and record it. Failure to note a preoperative deficit may be
                mistaken for a postoperative complication.
              </p>
            </div>

            <div className="mt-3 rounded-xl bg-[#0B1F4D] text-white p-3.5">
              <p className="text-[12.5px] leading-relaxed text-white/85">
                <span className="text-[#C9A24B] font-bold">Recall:</span> mandibular <em>angle</em> fractures
                have the highest rates of hypoesthesia — the nerve runs close to the fracture line here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ImagingComparator() {
  const [view, setView] = useState('opg');
  const views: Record<string, { name: string; tag: string; tone: string; shows: string[]; misses: string[]; when: string }> = {
    opg:    { name:'OPG (Panoramic)', tag:'Best single view', tone:'gold',
      shows:['Entire mandible including both condyles on one film','Angle, body, symphysis, ramus fractures'],
      misses:['Fine medial/lateral condylar displacement','Coronal plane detail'],
      when:'Upright, cooperative patient. Low radiation, low cost, excellent for follow-up.' },
    pa:     { name:'PA Mandible', tag:'Sagittal plane', tone:'blue',
      shows:['Degree of displacement in symphysis, body, angle, ramus','Entire mandible overview'],
      misses:['Medial/lateral condylar head displacement','Fine dental detail'],
      when:'Combining PA + OPG gives the best overall plain-film assessment.' },
    towne:  { name:'Reverse Towne (30°)', tag:'Condyle', tone:'blue',
      shows:['Medial / lateral displacement of the condylar head','Subcondylar fractures'],
      misses:['Body/symphysis fractures','Tooth-bearing regions'],
      when:'Specifically chosen when condylar fracture is suspected.' },
    lat:    { name:'Lateral Oblique', tag:'Body & angle', tone:'grey',
      shows:['Angle fractures','Body fractures'],
      misses:['Condylar detail','Symphysis detail'],
      when:'A focused, single-side view of the posterior mandible.' },
    ct:     { name:'CT Scan', tag:'Gold standard', tone:'gold',
      shows:['Multi-planar (axial, coronal, sagittal) fracture detail','3D reconstruction for surgical planning','Pre-bent plate modelling from DICOM'],
      misses:['Nothing clinically significant — trade-off is higher radiation dose'],
      when:'Preferred for multiple and complex mandibular fractures. CBCT is a lower-dose alternative.' },
  };
  const v = views[view];

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-5">
        <h3 className="font-extrabold text-lg text-[#0B1F4D]">Imaging View Comparator</h3>
        <p className="text-sm text-slate-500 mt-1">Click each modality to see what it reveals — and what it misses.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 grid grid-cols-2 gap-2">
          {Object.entries(views).map(([k, vv]) => (
            <button key={k} onClick={() => setView(k)}
              className={`rounded-xl border p-2.5 transition-all ${
                view === k ? 'border-[#C9A24B] ring-2 ring-[#C9A24B]/40 bg-[#C9A24B]/5' : 'border-[#E6E8EC] bg-white hover:border-[#C9A24B]'
              }`}>
              <div className="aspect-video rounded-lg bg-[#0B1F4D]/90 relative overflow-hidden mb-2">
                {k === 'opg' && (
                  <svg viewBox="0 0 120 70" className="w-full h-full">
                    <path d="M 8 45 C 30 58 75 55 105 30" stroke="#E4CE94" strokeWidth="3" fill="none" opacity="0.9"/>
                    <ellipse cx="105" cy="22" rx="8" ry="7" fill="#E4CE94" opacity="0.9"/>
                    <ellipse cx="18" cy="48" rx="8" ry="7" fill="#E4CE94" opacity="0.9"/>
                  </svg>
                )}
                {k === 'pa' && (
                  <svg viewBox="0 0 120 70" className="w-full h-full">
                    <rect x="20" y="15" width="80" height="40" rx="6" fill="none" stroke="#E4CE94" strokeWidth="1.5"/>
                    <path d="M 30 25 L 90 25 M 30 40 L 90 40" stroke="#E4CE94" strokeWidth="1" opacity="0.7"/>
                    <path d="M 55 30 L 55 50" stroke="#C9A24B" strokeWidth="1.5" strokeDasharray="2 2"/>
                  </svg>
                )}
                {k === 'towne' && (
                  <svg viewBox="0 0 120 70" className="w-full h-full">
                    <path d="M 25 20 Q 60 45 95 20" stroke="#E4CE94" strokeWidth="2" fill="none"/>
                    <circle cx="25" cy="20" r="6" fill="#C9A24B"/>
                    <circle cx="95" cy="20" r="6" fill="#C9A24B"/>
                    <circle cx="25" cy="20" r="2" fill="#0B1F4D"/>
                  </svg>
                )}
                {k === 'lat' && (
                  <svg viewBox="0 0 120 70" className="w-full h-full">
                    <path d="M 15 40 Q 60 15 105 40" stroke="#E4CE94" strokeWidth="2" fill="none"/>
                    <path d="M 60 30 L 60 55" stroke="#C9A24B" strokeWidth="1.5" strokeDasharray="2 2"/>
                  </svg>
                )}
                {k === 'ct' && (
                  <svg viewBox="0 0 120 70" className="w-full h-full">
                    {[0,1,2,3,4].map(i => (
                      <rect key={i} x={12 + i*20} y={18} width="14" height="34" rx="2" fill="#C9A24B" opacity={0.4 + i*0.12}/>
                    ))}
                  </svg>
                )}
              </div>
              <div className="text-[11.5px] font-bold text-[#0B1F4D] text-left leading-tight">{vv.name}</div>
              <div className="text-[10px] text-[#C9A24B] font-bold mt-0.5 text-left">{vv.tag}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-[#E6E8EC] bg-white p-5 h-full">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-extrabold text-[#0B1F4D]">{v.name}</h4>
              <Pill tone={v.tone as any}>{v.tag}</Pill>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5">
                <div className="text-[10.5px] font-bold tracking-[0.2em] text-emerald-700 uppercase mb-2">Reveals</div>
                <ul className="space-y-1">
                  {v.shows.map(s => (
                    <li key={s} className="flex gap-2 text-[12.5px] text-slate-700 leading-snug">
                      <span className="text-emerald-600 shrink-0">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5">
                <div className="text-[10.5px] font-bold tracking-[0.2em] text-rose-700 uppercase mb-2">Misses / limits</div>
                <ul className="space-y-1">
                  {v.misses.map(s => (
                    <li key={s} className="flex gap-2 text-[12.5px] text-slate-700 leading-snug">
                      <span className="text-rose-500 shrink-0">✕</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#0B1F4D] text-white p-3.5">
              <div className="text-[10.5px] font-bold tracking-[0.2em] text-[#C9A24B] uppercase mb-1">When to use</div>
              <p className="text-[12.5px] leading-relaxed text-white/85">{v.when}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ToothDecisionTree() {
  const [path, setPath] = useState<string[]>([]);
  const nodes: Record<string, any> = {
    start: {
      question: 'Is the tooth luxated from its socket or interfering with reduction?',
      options: [
        { label:'Yes', next:'extract', flag:'bad' },
        { label:'No',  next:'q2',      flag:'neutral' },
      ],
    },
    q2: {
      question: 'Is the tooth fractured, or does it have advanced caries / periodontal disease?',
      options: [
        { label:'Yes', next:'extract', flag:'bad' },
        { label:'No',  next:'q3',      flag:'neutral' },
      ],
    },
    q3: {
      question: 'Is there existing pathology (cyst, pericoronitis) or mobility that will not contribute to stable occlusion?',
      options: [
        { label:'Yes', next:'extract', flag:'bad' },
        { label:'No',  next:'keep',    flag:'good' },
      ],
    },
    extract: {
      outcome: 'extract',
      title: 'Extract the tooth',
      reason: 'Tooth extraction is recommended when it is luxated and/or interfering with reduction, fractured, has advanced caries with abscess risk, has advanced periodontal disease with mobility, or has existing pathology such as cyst formation or pericoronitis.',
    },
    keep: {
      outcome: 'keep',
      title: 'May leave the tooth in place',
      reason: 'A tooth in the fracture line can be left in place because it provides a larger repositioning surface, can be used for tension bands, and does not cause delayed healing when treated with closed reduction.',
    },
  };
  const current = nodes[path.length === 0 ? 'start' : path[path.length - 1]];
  const reset = () => setPath([]);

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-extrabold text-lg text-[#0B1F4D]">Tooth in the Fracture Line — Decision Tree</h3>
          <p className="text-sm text-slate-500 mt-1">Answer the questions to decide whether the tooth must be extracted.</p>
        </div>
        {path.length > 0 && (
          <button onClick={reset} className="px-3 py-1.5 rounded-lg border border-[#E6E8EC] text-[#0B1F4D] text-[11.5px] font-bold hover:border-[#C9A24B]">
            ↺ Reset
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-[#E6E8EC] bg-[#FAF8F3] p-5">
          {path.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {path.map((p, i) => (
                <span key={i} className="text-[10.5px] font-bold text-slate-400">
                  {i > 0 && '›'} {p === 'extract' || p === 'keep' ? 'Outcome' : `Q${i+1}`}
                </span>
              ))}
            </div>
          )}

          {current.outcome ? (
            <div className={`slide-in rounded-2xl border p-5 ${
              current.outcome === 'extract' ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'
            }`}>
              <Pill tone={current.outcome === 'extract' ? 'red' : 'green'}>
                {current.outcome === 'extract' ? 'EXTRACT' : 'KEEP'}
              </Pill>
              <h4 className="mt-3 font-extrabold text-[#0B1F4D] text-lg">{current.title}</h4>
              <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">{current.reason}</p>
            </div>
          ) : (
            <div className="slide-in" key={path.join('')}>
              <h4 className="font-extrabold text-[#0B1F4D] text-[15px] leading-snug">{current.question}</h4>
              <div className="mt-4 space-y-2.5">
                {current.options.map((o: any, i: number) => (
                  <button key={i} onClick={() => setPath([...path, o.next])}
                    className={`w-full text-left px-4 py-3 rounded-xl border font-bold text-[13px] transition-all ${
                      o.flag === 'bad' ? 'border-rose-200 bg-white text-rose-700 hover:bg-rose-50' :
                      o.flag === 'good' ? 'border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50' :
                                          'border-[#E6E8EC] bg-white text-[#0B1F4D] hover:border-[#1B3A8C] hover:bg-[#1B3A8C]/5'
                    }`}>
                    {o.label} →
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            <div className="text-[10.5px] font-bold tracking-[0.2em] text-rose-700 uppercase mb-2">Extract if</div>
            <ul className="space-y-1.5 text-[12.5px] text-slate-700">
              {['Luxated from its socket and/or interfering with fracture reduction','Fractured','Has advanced dental caries carrying significant abscess risk','Has advanced periodontal disease with mobility that will not contribute to establishing stable occlusion','Has existing pathology such as cyst formation and pericoronitis'].map((p,i)=>(
                <li key={i} className="flex gap-2"><span className="text-rose-500">•</span>{p}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="text-[10.5px] font-bold tracking-[0.2em] text-emerald-700 uppercase mb-2">May keep if</div>
            <p className="text-[12.5px] text-slate-700 leading-relaxed">
              The tooth provides a larger repositioning surface, can be used for tension bands, and
              does not cause delayed healing when treated with closed reduction.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export const LectureExam: React.FC = () => {
  const signs = [
    { t:"Coleman's Sign", s:'Sublingual hematoma / ecchymosis of the floor of the mouth',
      d:'Classically pathognomonic for mandibular fracture.', star:true },
    { t:'Malocclusion', s:'Patient reports the "bite feels wrong"',
      d:'A very effective and highly sensitive test in the acute setting. A subjective report must be taken seriously, documented, and compared with the pre-injury occlusion.' },
    { t:'Mental / IAN Paraesthesia', s:'Altered sensation in the lower lip',
      d:'Damage to the inferior alveolar nerve as it courses through the body of the mandible is not uncommon. Failure to note this pre-operatively may be mistaken for a post-operative complication.' },
    { t:'Step Deformity & Mobility', s:'Bimanual palpation reveals fragment mobility',
      d:'A lack of mobility indicates a stable fracture that may be amenable to conservative management — provided the occlusion has not been altered.' },
    { t:'Soft-tissue & Dental Findings', s:'Intraoral lacerations, hematomas, loose teeth, gingival bleeding',
      d:'These increase the risk of infection and influence whether a tooth in the fracture line must be extracted.' },
    { t:'Functional Signs', s:'Pain on talking/swallowing, trismus, difficulty swallowing, airway compromise',
      d:'Bleeding from torn periosteum and muscle can produce visible haemorrhage and life-threatening airway obstruction.' },
  ];

  return (
    <div className="anim-in space-y-6">
      <SectionTitle eyebrow="Module 03" title="Clinical Examination & Imaging"
        subtitle="A critical factor in the diagnostic workup of mandible fractures is the evaluation of the patient's occlusion." />

      <Card className="p-6 md:p-8 border-l-4 border-l-[#C9A24B]">
        <h3 className="font-extrabold text-[#0B1F4D] text-lg">The single most useful question</h3>
        <p className="mt-2 text-slate-700 text-sm md:text-[15px] leading-relaxed">
          Asking patients if their <em>"bite feels normal"</em> is a very effective and highly sensitive test in the acute setting. If the patient is intubated, sedated, or unable to communicate, prior dental records and an examination of the wear facets can be helpful.
        </p>
      </Card>

      <OcclusionChecker />

      <div className="grid md:grid-cols-2 gap-4">
        {signs.map((s) => (
          <Card key={s.t} className={`p-5 ${s.star ? 'border-[#C9A24B] ring-1 ring-[#C9A24B]/30' : ''}`}>
            <div className="flex items-start gap-3">
              <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold ${
                s.star ? 'bg-[#C9A24B] text-white pulse-gold' : 'bg-[#E6E8EC] text-[#1B3A8C]'
              }`}>{s.star ? '★' : '•'}</div>
              <div>
                <h4 className="font-extrabold text-[#0B1F4D] text-[15px] leading-snug">{s.t}</h4>
                <div className="text-[13px] font-semibold text-[#1B3A8C] mt-0.5">{s.s}</div>
                <p className="text-[13px] text-slate-600 mt-2 leading-relaxed">{s.d}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <IANNervePathway />
      <ImagingComparator />
      <ToothDecisionTree />
    </div>
  );
};
