import React, { useState } from 'react';
import { Card, SectionTitle, Pill } from './UI';

function ORIFApproachMap() {
  const [approach, setApproach] = useState('intraoral');
  const approaches: Record<string, { name: string; x: number; y: number; site: string; desc: string }> = {
    intraoral: { name:'Intraoral (gingivobuccal sulcus)', x:200, y:290, site:'Body, angle, symphysis',
      desc:'Lower gingivobuccal sulcus incision with dissection to the inferior border. The workhorse approach for the majority of simple mandibular fractures.' },
    risdon:    { name:'Submandibular (Risdon)', x:140, y:340, site:'Body, angle',
      desc:'Extra-oral incision 1.5–2 cm below the inferior border, in a skin crease. Used when intraoral access is inadequate or when a large reconstruction plate requires extra-oral placement.' },
    retromand: { name:'Retromandibular', x:335, y:250, site:'Ramus, condylar neck',
      desc:'Access to the posterior ramus and condylar neck through a retromandibular incision. Provides direct visualisation of the fracture while protecting the facial nerve.' },
    preauric:  { name:'Preauricular / Endaural', x:400, y:130, site:'Condylar head / intracapsular',
      desc:'Access to the temporomandibular joint and condylar head. Used for dislocated intracapsular fractures that require open reduction.' },
    transbuccal:{ name:'Transbuccal trocar', x:250, y:290, site:'Angle (assist)',
      desc:'A small puncture through the cheek used to pass screws when an intraoral approach is combined with posterior plate placement.' },
  };
  const a = approaches[approach];

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-4">
        <h3 className="font-extrabold text-lg text-[#0B1F4D]">ORIF Surgical Approach Map</h3>
        <p className="text-sm text-slate-500 mt-1">Click each numbered marker to explore the surgical approach.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <svg viewBox="0 0 460 400" className="w-full h-auto">
            <rect width="460" height="400" rx="16" fill="#FAF8F3"/>
            <path d="M 130 60 Q 130 20 190 18 Q 250 16 275 40 Q 300 65 300 110 L 305 220 Q 305 260 280 280 L 265 300 Q 250 340 240 380 L 130 380 Z"
              fill="#E6E8EC" stroke="#0B1F4D" strokeWidth="1.5" opacity="0.55"/>
            <ellipse cx="305" cy="150" rx="16" ry="22" fill="#E6E8EC" stroke="#0B1F4D" strokeWidth="1.2"/>
            <ellipse cx="245" cy="90" rx="14" ry="8" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="1.2"/>
            <circle cx="245" cy="90" r="4" fill="#0B1F4D"/>
            <path d="M 250 105 Q 255 145 245 160 Q 235 160 240 155" fill="none" stroke="#0B1F4D" strokeWidth="1.4"/>
            <path d="M 155 280 Q 210 320 270 265" fill="none" stroke="#C9A24B" strokeWidth="3" strokeDasharray="5 3"/>
            <text x="210" y="352" fontSize="10" fontWeight="700" fill="#8a6c25" textAnchor="middle">Inferior border</text>

            {Object.entries(approaches).map(([k, ap], i) => (
              <g key={k} onClick={() => setApproach(k)} style={{cursor:'pointer'}}>
                <circle cx={ap.x} cy={ap.y} r="14" fill={approach === k ? '#C9A24B' : '#FFFFFF'} stroke="#C9A24B" strokeWidth="2.5"/>
                <text x={ap.x} y={ap.y+4} textAnchor="middle" fontSize="12" fontWeight="800" fill={approach === k ? '#FFFFFF' : '#C9A24B'}>{i+1}</text>
              </g>
            ))}

            <line x1="180" y1="300" x2={a.x} y2={a.y} stroke="#C9A24B" strokeWidth="2" strokeDasharray="4 3" opacity="0.6"/>
          </svg>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-[#C9A24B]/40 bg-[#C9A24B]/5 p-5 h-full">
            <Pill tone="gold">{a.site}</Pill>
            <h4 className="mt-3 font-extrabold text-[#0B1F4D] text-[15px] leading-snug">{a.name}</h4>
            <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">{a.desc}</p>

            <div className="mt-4 grid grid-cols-1 gap-2">
              {Object.entries(approaches).map(([k, ap], i) => (
                <button key={k} onClick={() => setApproach(k)}
                  className={`text-left px-3 py-2 rounded-lg text-[11.5px] font-bold border transition-all ${
                    approach === k ? 'bg-[#C9A24B] text-white border-[#C9A24B]' : 'bg-white text-[#0B1F4D] border-[#E6E8EC] hover:border-[#C9A24B]'
                  }`}>
                  <span className="inline-block w-5 h-5 mr-2 rounded-full bg-white/30 text-center text-[10px] leading-5">{i+1}</span>
                  {ap.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ChampysLineVisualizer() {
  const [showStress, setShowStress] = useState(true);

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-extrabold text-lg text-[#0B1F4D]">Champy's Line &amp; the Tension Band</h3>
          <p className="text-sm text-slate-500 mt-1">The ideal line of osteosynthesis runs along the tension zone of the mandible.</p>
        </div>
        <button onClick={() => setShowStress(!showStress)}
          className={`px-4 py-2 rounded-xl text-[12.5px] font-bold border transition-all ${
            showStress ? 'bg-[#1B3A8C] text-white border-[#1B3A8C]' : 'bg-white text-[#0B1F4D] border-[#E6E8EC] hover:border-[#C9A24B]'
          }`}>
          {showStress ? 'Hide' : 'Show'} stress zones
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <svg viewBox="0 0 460 340" className="w-full h-auto">
            <rect width="460" height="340" rx="16" fill="#FAF8F3"/>
            <path d="M 70 250 C 160 305 300 285 350 210 C 385 155 395 110 390 65" fill="none" stroke="#E6E8EC" strokeWidth="52" strokeLinecap="round"/>
            <path d="M 70 250 C 160 305 300 285 350 210 C 385 155 395 110 390 65" fill="none" stroke="#0B1F4D" strokeWidth="52" strokeLinecap="round" opacity="0.06"/>
            <path d="M 100 240 C 180 285 290 265 340 195" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" opacity="0.9"/>
            <path d="M 115 225 C 195 260 295 245 335 185"
              fill="none" stroke="#1B3A8C" strokeWidth="3" strokeDasharray="8 5"/>
            <text x="185" y="200" fontSize="11" fontWeight="800" fill="#1B3A8C">Champy's line</text>

            {showStress && (
              <g>
                <path d="M 115 215 C 195 250 295 235 335 175"
                  fill="none" stroke="#C9A24B" strokeWidth="16" strokeLinecap="round" opacity="0.4"/>
                <text x="240" y="215" fontSize="10.5" fontWeight="700" fill="#8a6c25">TENSION</text>
              </g>
            )}

            {showStress && (
              <g>
                <path d="M 105 265 C 175 300 265 288 320 240"
                  fill="none" stroke="#2563EB" strokeWidth="16" strokeLinecap="round" opacity="0.35"/>
                <text x="195" y="295" fontSize="10.5" fontWeight="700" fill="#1B3A8C">COMPRESSION</text>
              </g>
            )}

            <g>
              {[[150,228],[190,240],[230,243],[270,236],[305,215]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="5.5" fill="#1B3A8C" stroke="#FFFFFF" strokeWidth="1.4"/>
              ))}
              <text x="230" y="272" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#1B3A8C">Miniplate on the tension band</text>
            </g>
          </svg>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1B3A8C]/30 bg-[#1B3A8C]/5 p-5">
            <Pill tone="blue">PRINCIPLE</Pill>
            <p className="mt-3 text-[13px] text-slate-700 leading-relaxed">
              When the mandible is loaded, the <strong>upper border</strong> experiences tension and
              the <strong>lower border</strong> experiences compression. A plate placed along the
              tension zone resists separation and converts the load into compression at the lower
              border.
            </p>
          </div>
          <div className="rounded-2xl border border-[#E6E8EC] bg-[#FAF8F3] p-5">
            <div className="text-[10.5px] font-bold tracking-[0.2em] text-[#C9A24B] uppercase mb-2">Clinical application</div>
            <p className="text-[13px] text-slate-700 leading-relaxed">
              For angle fractures, a single miniplate along the oblique ridge (Champy's line)
              provides sufficient fixation because muscle forces are redirected to compress the
              lower border — eliminating the need for a second plate.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function HealingTimeline() {
  const [week, setWeek] = useState(3);
  const [mode, setMode] = useState('primary');
  const phases: Record<string, string[]> = {
    primary:   ['Direct bone healing — no callus','Cutting cones advance across the fracture','Osteonal remodelling restores lamellar bone'],
    secondary: ['Callus formation begins','Cartilage → woven bone → hard callus','Controlled micromotion enhances healing'],
  };
  const phase = week < 1 ? phases[mode][0] : week < 3 ? phases[mode][1] : phases[mode][2];

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-extrabold text-lg text-[#0B1F4D]">Bone Healing Timeline</h3>
          <p className="text-sm text-slate-500 mt-1">Drag the slider to see how the fracture site evolves week by week.</p>
        </div>
        <div className="inline-flex rounded-xl border border-[#E6E8EC] bg-[#FAF8F3] p-1">
          <button onClick={() => setMode('primary')}
            className={`px-3.5 py-2 rounded-lg text-[12px] font-bold transition-all ${mode==='primary' ? 'bg-[#1B3A8C] text-white' : 'text-[#0B1F4D] hover:text-[#1B3A8C]'}`}>
            Primary intention
          </button>
          <button onClick={() => setMode('secondary')}
            className={`px-3.5 py-2 rounded-lg text-[12px] font-bold transition-all ${mode==='secondary' ? 'bg-[#C9A24B] text-white' : 'text-[#0B1F4D] hover:text-[#C9A24B]'}`}>
            Secondary intention
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <svg viewBox="0 0 420 260" className="w-full h-auto">
            <rect width="420" height="260" rx="16" fill="#FAF8F3"/>
            <rect x="30" y="100" width="160" height="60" rx="10" fill="#E6E8EC" stroke="#0B1F4D" strokeWidth="1.3"/>
            <rect x="230" y="100" width="160" height="60" rx="10" fill="#E6E8EC" stroke="#0B1F4D" strokeWidth="1.3"/>
            <rect x="185" y="100" width="50" height="60" fill="#FAF8F3"/>

            {mode === 'secondary' && (
              <ellipse cx="210" cy="130" rx={12 + week * 5} ry={10 + week * 3}
                fill="#FCD34D" opacity={Math.min(0.75, 0.15 + week * 0.12)} />
            )}
            {mode === 'primary' && (
              <line x1="185" y1="105" x2="235" y2="155" stroke="#059669" strokeWidth={1 + week * 0.5} opacity={Math.min(0.9, 0.2 + week * 0.15)} className="bone-pulse"/>
            )}
            <line x1="210" y1="100" x2="210" y2="160" stroke="#0B1F4D" strokeWidth={Math.max(0.4, 2 - week * 0.35)} strokeDasharray="4 3"/>

            <text x="210" y="230" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0B1F4D">Week {week}</text>
          </svg>

          <input type="range" min="0" max="6" value={week} onChange={(e) => setWeek(Number(e.target.value))}
            className="w-full mt-4" style={{ accentColor: '#C9A24B' }}/>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
            <span>Day 0</span><span>Week 2</span><span>Week 4</span><span>Week 6</span>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className={`rounded-2xl border p-5 h-full ${
            mode === 'primary' ? 'border-[#1B3A8C]/30 bg-[#1B3A8C]/5' : 'border-[#C9A24B]/40 bg-[#C9A24B]/5'
          }`}>
            <Pill tone={mode === 'primary' ? 'blue' : 'gold'}>
              {mode === 'primary' ? 'PRIMARY INTENTION' : 'SECONDARY INTENTION'}
            </Pill>
            <h4 className="mt-3 font-extrabold text-[#0B1F4D] text-[15px]">
              {mode === 'primary' ? 'Rigid fixation' : 'Non-rigid fixation'}
            </h4>
            <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">
              {mode === 'primary'
                ? 'Heavy plates and large screws produce minimal movement at the fracture site. Bone heals directly — no callus, faster union, earlier mechanical strength.'
                : 'Non-operative or non-rigidly fixed fractures heal with callus formation and remodelling. Controlled micromotion actually enhances this pathway.'}
            </p>
            <div className="mt-4 rounded-xl bg-white border border-[#E6E8EC] p-3.5">
              <div className="text-[10.5px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-1.5">This phase</div>
              <p className="text-[12.5px] text-slate-700 leading-relaxed">{phase}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FixationVisualizer() {
  const [mode, setMode] = useState('sharing');
  const isSharing = mode === 'sharing';

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-extrabold text-lg text-[#0B1F4D]">Load-Sharing vs Load-Bearing</h3>
          <p className="text-sm text-slate-500 mt-1">Toggle to compare the two fundamental fixation philosophies.</p>
        </div>
        <div className="inline-flex rounded-xl border border-[#E6E8EC] bg-[#FAF8F3] p-1">
          <button onClick={() => setMode('sharing')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
              isSharing ? 'bg-[#1B3A8C] text-white shadow-[0_6px_24px_-8px_rgba(11,31,77,0.18)]' : 'text-[#0B1F4D] hover:text-[#1B3A8C]'
            }`}>Load-Sharing</button>
          <button onClick={() => setMode('bearing')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
              !isSharing ? 'bg-[#C9A24B] text-white shadow-[0_6px_24px_-8px_rgba(11,31,77,0.18)]' : 'text-[#0B1F4D] hover:text-[#C9A24B]'
            }`}>Load-Bearing</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <svg viewBox="0 0 420 340" className="w-full h-auto">
            <rect width="420" height="340" rx="18" fill="#FAF8F3" />
            <path d="M 70 250 C 150 285 240 275 275 225 C 305 185 315 140 310 75" fill="none" stroke="#E6E8EC" strokeWidth="40" strokeLinecap="round"/>
            <path d="M 70 250 C 150 285 240 275 275 225 C 305 185 315 140 310 75" fill="none" stroke="#0B1F4D" strokeWidth="40" strokeLinecap="round" opacity="0.06"/>
            <path d="M 100 238 C 160 264 226 256 258 220" fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" opacity="0.85"/>

            {!isSharing && (
              <g>
                <rect x="192" y="222" width="30" height="76" fill="#FAF8F3" transform="rotate(-10 207 260)"/>
                <line x1="194" y1="224" x2="222" y2="296" stroke="#B23A2E" strokeWidth="2.2" strokeDasharray="5 4" transform="rotate(-10 207 260)" className="dash-anim"/>
                <text x="207" y="318" textAnchor="middle" fontSize="11" fontWeight="700" fill="#B23A2E">Bone defect / comminution</text>
              </g>
            )}

            {isSharing && (
              <g>
                <path d="M 112 226 C 165 250 226 244 256 214" fill="none" stroke="#1B3A8C" strokeWidth="1.6" strokeDasharray="6 5" opacity="0.6"/>
                <text x="150" y="205" fontSize="10" fontWeight="700" fill="#1B3A8C" opacity="0.85">Champy's line</text>
                <g transform="rotate(-12 186 234)">
                  <rect x="136" y="224" width="100" height="16" rx="8" fill="#1B3A8C"/>
                  {[148,168,188,208,224].map((cx) => (
                    <circle key={cx} cx={cx} cy="232" r="4.6" fill="#E4CE94" stroke="#0B1F4D" strokeWidth="0.9"/>
                  ))}
                </g>
                <text x="210" y="300" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#1B3A8C">Single miniplate · tension band</text>
              </g>
            )}

            {!isSharing && (
              <g>
                <g transform="rotate(6 180 282)">
                  <rect x="92" y="268" width="176" height="26" rx="12" fill="#C9A24B"/>
                  {[108,132,156,180,204,228,252].map((cx) => (
                    <g key={cx}>
                      <circle cx={cx} cy="281" r="6.6" fill="#0B1F4D"/>
                      <circle cx={cx} cy="281" r="3.1" fill="#E4CE94"/>
                    </g>
                  ))}
                </g>
                <text x="210" y="330" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#8a6c25">Rigid reconstruction plate · inferior border</text>
              </g>
            )}
          </svg>
        </div>

        <div className="lg:col-span-2">
          {isSharing ? (
            <div className="anim-in rounded-2xl border border-[#1B3A8C]/30 bg-[#1B3A8C]/5 p-5 h-full">
              <Pill tone="blue">LOAD-SHARING</Pill>
              <h4 className="mt-3 font-extrabold text-[#0B1F4D] text-lg">Osteosynthesis</h4>
              <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">
                The functional load is <strong>distributed between the hardware and the bony ends</strong> at the fracture site. There is sufficient bone-to-bone contact across the fracture line — the bone shares the load with the plate.
              </p>
            </div>
          ) : (
            <div className="anim-in rounded-2xl border border-[#C9A24B]/50 bg-[#C9A24B]/5 p-5 h-full">
              <Pill tone="gold">LOAD-BEARING</Pill>
              <h4 className="mt-3 font-extrabold text-[#0B1F4D] text-lg">Osteosynthesis</h4>
              <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">
                A construct capable of bearing <strong>100% of the functional load</strong> generated by the mandible — the bone at the fracture site bears none.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export const LectureManagement: React.FC = () => {
  const steps = [
    { n:'01', t:'Reduction',      d:'Restoration of functional alignment of the bone fragments — achieved either by closed reduction (non-surgical) or open reduction with internal fixation (ORIF).' },
    { n:'02', t:'Fixation',       d:'Direct osteosynthesis (miniplates, reconstruction plates, compression plates, lag screws, resorbable systems), IMF, or external fixation.' },
    { n:'03', t:'Immobilisation', d:'Adequate immobilisation to allow bone healing — by primary intention (rigid fixation, minimal callus) or secondary intention (callus formation).' },
    { n:'04', t:'Rehabilitation', d:'Early active range of motion, occlusal review and return to function. MMF should be released and the fracture tested clinically before fixation is finally removed.' },
  ];

  return (
    <div className="anim-in space-y-6">
      <SectionTitle eyebrow="Module 04" title="Principles of Management"
        subtitle="The ultimate goal of treatment is to re-establish the patient's pre-injury dental occlusion." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <Card key={s.n} className="p-5 relative overflow-hidden">
            <div className="absolute -top-2 -right-1 text-5xl font-extrabold text-[#E6E8EC] select-none">{s.n}</div>
            <div className="relative">
              <div className="text-[11px] font-bold tracking-[0.2em] text-[#C9A24B] uppercase">Step {i+1}</div>
              <h4 className="mt-1 font-extrabold text-[#0B1F4D] text-lg">{s.t}</h4>
              <p className="mt-2 text-[13px] text-slate-600 leading-relaxed">{s.d}</p>
            </div>
          </Card>
        ))}
      </div>

      <ORIFApproachMap />
      <ChampysLineVisualizer />
      <HealingTimeline />
      <FixationVisualizer />
    </div>
  );
};
