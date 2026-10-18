import React, { useState } from 'react';
import { Card, SectionTitle, Pill } from './UI';

const REGIONS: Record<string, { name: string; ar: string; incidence: string; badge: string; tone: string; causes: string[]; muscles: string; pearls: string }> = {
  condyle:   { name:'Condyle', ar:'اللُقمة', incidence:'29.1%', badge:'Most common site', tone:'gold',
    causes:['Indirect force from a blow to the chin / symphysis','Motor vehicle accidents','Falls in older patients'],
    muscles:'The lateral pterygoid pulls the condylar head antero-medially. Bilateral fractures produce premature posterior tooth contact → the classic anterior open bite.',
    pearls:'The only facial bone fracture that involves a synovial joint. Intracapsular (head) fractures are usually treated closed — fragments are too small to fix and ORIF risks TMJ ankylosis.' },
  coronoid:  { name:'Coronoid Process', ar:'الناتئ الإكليلي', incidence:'1.3%', badge:'Rarest site', tone:'grey',
    causes:['High-energy trauma / missile injury','Rarely ever isolated'],
    muscles:'The temporalis inserts here and pulls any fragment superiorly and posteriorly.',
    pearls:'Sheltered by the zygomatic arch and the temporalis muscle — therefore very rarely fractured in isolation.' },
  ramus:     { name:'Ramus', ar:'الفرع الصاعد', incidence:'1.7%', badge:'Uncommon', tone:'grey',
    causes:['High-energy trauma','Gunshot / missile injuries','Direct lateral blow'],
    muscles:'Masseter and medial pterygoid elevate and medially rotate the proximal segment; temporalis adds a superior pull.',
    pearls:'Because of the thick soft-tissue envelope and powerful muscles, displacement can be surprisingly limited even in high-energy injuries.' },
  angle:     { name:'Angle', ar:'زاوية الفك', incidence:'24.5%', badge:'2nd most common', tone:'blue',
    causes:['Personal assault (the classic mechanism)','Thin cross-sectional area of the region','Presence of an impacted third molar'],
    muscles:'Masseter, medial pterygoid and temporalis elevate the proximal segment while digastric and mylohyoid depress the distal segment — an unfavourable, displacing pattern.',
    pearls:'The most technically demanding mandibular fracture with the highest complication rate. Highest rates of hypoesthesia (IAN injury). Treated with a single miniplate along the oblique ridge (Champy) or two lateral border plates.' },
  body:      { name:'Body', ar:'جسم الفك', incidence:'16%', badge:'Common', tone:'blue',
    causes:['Assault','Motor vehicle accidents','Falls'],
    muscles:'Mylohyoid and digastric depress the distal fragment; the suprahyoid sling pulls the anterior segment downward and backward.',
    pearls:'Non-displaced, favourable fractures can be managed closed with MMF. Displaced fractures need ORIF. Non-union is most common at this site.' },
  symphysis: { name:'Symphysis / Parasymphysis', ar:'الارتفاق / حول الارتفاق', incidence:'22%', badge:'3rd most common', tone:'blue',
    causes:['Posteriorly directed force — frequently MVAs','Direct blow to the chin'],
    muscles:'Genioglossus and geniohyoid pull the anterior segment posteriorly and inferiorly. In bilateral parasymphyseal fractures the tongue base falls back → airway obstruction.',
    pearls:'Always look for concomitant subcondylar fractures and cervical spine injury from neck hyperextension. ORIF with two miniplates (or lag screws) is the treatment of choice.' },
};

const RegionShapes = {
  condyle: (<><ellipse cx="100" cy="68" rx="27" ry="25"/><ellipse cx="400" cy="68" rx="27" ry="25"/></>),
  coronoid:(<><path d="M122 92 L158 108 L143 152 L128 122 Z"/><path d="M378 92 L342 108 L357 152 L372 122 Z"/></>),
  ramus:   (<><path d="M76 92 L124 92 L133 175 L82 180 Z"/><path d="M424 92 L376 92 L367 175 L418 180 Z"/></>),
  angle:   (<><path d="M82 180 L133 175 L155 235 L110 250 Z"/><path d="M418 180 L367 175 L345 235 L390 250 Z"/></>),
  body:    (<><path d="M110 250 L120 300 L140 340 L175 365 L190 370 L190 304 L165 270 L155 235 Z"/><path d="M390 250 L380 300 L360 340 L325 365 L310 370 L310 306 L335 270 L345 235 Z"/></>),
  symphysis:(<path d="M190 370 L215 378 L250 380 L285 378 L310 370 L310 306 L285 322 L250 330 L215 322 L190 304 Z"/>),
};
const REGION_ORDER = ['condyle','coronoid','ramus','angle','body','symphysis'];

function MuscleForceDiagram() {
  const [active, setActive] = useState('masseter');
  const muscles: Record<string, { name: string; color: string; origin: [number, number]; insert: [number, number]; side: string; desc: string }> = {
    masseter:   { name:'Masseter', color:'#DC2626', origin:[430,140], insert:[440,265], side:'Proximal',
      desc:'Elevates the mandible. Pulls the angle upward and forward — the dominant elevator.' },
    temporalis: { name:'Temporalis', color:'#EA580C', origin:[300,55], insert:[185,115], side:'Proximal',
      desc:'Elevates and retracts. Pulls the coronoid process up and posteriorly.' },
    pterygoid:  { name:'Medial Pterygoid', color:'#7C3AED', origin:[430,180], insert:[455,270], side:'Proximal',
      desc:'Elevates, protrudes, and medially rotates the angle.' },
    lateral:    { name:'Lateral Pterygoid', color:'#2563EB', origin:[370,90], insert:[95,80], side:'Proximal',
      desc:'Protrudes the mandible. Pulls the condylar head antero-medially.' },
    digastric:  { name:'Digastric', color:'#059669', origin:[440,320], insert:[195,370], side:'Distal',
      desc:'Depresses the mandible. Pulls the anterior segment downward and backward.' },
    mylohyoid:  { name:'Mylohyoid', color:'#0891B2', origin:[350,310], insert:[200,360], side:'Distal',
      desc:'Depresses and retracts the distal segment.' },
  };
  const m = muscles[active];

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-extrabold text-lg text-[#0B1F4D]">Muscle Force Vectors</h3>
          <p className="text-sm text-slate-500 mt-1">Click each muscle to see its pull direction on the mandible.</p>
        </div>
        <Pill tone={m.side === 'Proximal' ? 'blue' : 'gold'}>{m.side} segment</Pill>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <svg viewBox="0 0 520 400" className="w-full h-auto">
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <polygon points="0 0, 8 4, 0 8" fill={m.color} />
              </marker>
            </defs>
            <rect width="520" height="400" rx="18" fill="#FAF8F3"/>
            <path d="M 120 320 C 220 370 340 350 400 280 C 440 230 450 180 440 120" fill="none" stroke="#E6E8EC" strokeWidth="46" strokeLinecap="round"/>
            <path d="M 120 320 C 220 370 340 350 400 280 C 440 230 450 180 440 120" fill="none" stroke="#0B1F4D" strokeWidth="46" strokeLinecap="round" opacity="0.07"/>
            <path d="M 165 305 C 235 340 330 325 380 270" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" opacity="0.85"/>
            <circle cx="445" cy="105" r="18" fill="#D8DCE3" stroke="#0B1F4D" strokeWidth="1.5"/>
            <path d="M 415 130 L 400 175 L 425 165 Z" fill="#D8DCE3" stroke="#0B1F4D" strokeWidth="1.5"/>
            <path d="M 330 300 L 318 330" stroke="#B23A2E" strokeWidth="2.5" strokeDasharray="5 3" className="dash-anim"/>
            <line x1={m.origin[0]} y1={m.origin[1]} x2={m.insert[0]} y2={m.insert[1]}
              stroke={m.color} strokeWidth="5" strokeLinecap="round" markerEnd="url(#arrowhead)" opacity="0.85"/>
            <circle cx={m.origin[0]} cy={m.origin[1]} r="9" fill={m.color} opacity="0.9"/>
            <circle cx={m.origin[0]} cy={m.origin[1]} r="4" fill="#FFFFFF"/>
            <text x={m.origin[0]} y={m.origin[1]-16} textAnchor="middle" fontSize="11" fontWeight="800" fill={m.color}>{m.name}</text>
            <text x="260" y="388" textAnchor="middle" fontSize="10.5" fill="#64748B" fontStyle="italic">
              Vector shows the direction of muscle pull on the mandible
            </text>
          </svg>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {Object.entries(muscles).map(([k, mm]) => (
              <button key={k} onClick={() => setActive(k)}
                className={`px-2.5 py-2 rounded-lg text-[11.5px] font-bold border transition-all text-left ${
                  active === k ? 'text-white border-transparent shadow-[0_6px_24px_-8px_rgba(11,31,77,0.18)]' : 'bg-white text-[#0B1F4D] border-[#E6E8EC] hover:border-[#C9A24B]'
                }`}
                style={active === k ? { backgroundColor: mm.color } : {}}>
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: active===k ? '#fff' : mm.color }} />
                {mm.name}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-[#E6E8EC] bg-[#FAF8F3] p-4">
            <div className="text-[11px] font-bold tracking-[0.2em] text-[#C9A24B] uppercase mb-1.5">Action</div>
            <p className="text-[13px] text-slate-700 leading-relaxed">{m.desc}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DisplacementVisualizer() {
  const [fav, setFav] = useState(true);

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-extrabold text-lg text-[#0B1F4D]">Favourable vs Unfavourable Displacement</h3>
          <p className="text-sm text-slate-500 mt-1">See how muscle forces either draw fragments together or displace them apart.</p>
        </div>
        <div className="inline-flex rounded-xl border border-[#E6E8EC] bg-[#FAF8F3] p-1">
          <button onClick={() => setFav(true)}
            className={`px-4 py-2 rounded-lg text-[12.5px] font-bold transition-all ${fav ? 'bg-emerald-500 text-white' : 'text-[#0B1F4D] hover:text-emerald-600'}`}>
            Favourable
          </button>
          <button onClick={() => setFav(false)}
            className={`px-4 py-2 rounded-lg text-[12.5px] font-bold transition-all ${!fav ? 'bg-rose-500 text-white' : 'text-[#0B1F4D] hover:text-rose-600'}`}>
            Unfavourable
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <svg viewBox="0 0 420 300" className="w-full h-auto">
            <defs>
              <marker id="pullA" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <polygon points="0 0, 8 4, 0 8" fill={fav ? '#059669' : '#DC2626'} />
              </marker>
            </defs>
            <rect width="420" height="300" rx="16" fill="#FAF8F3"/>
            <path d={fav ? "M 60 200 L 190 200" : "M 60 200 L 180 210"} stroke="#E6E8EC" strokeWidth="42" strokeLinecap="round" fill="none"/>
            <path d={fav ? "M 60 200 L 190 200" : "M 60 200 L 180 210"} stroke="#0B1F4D" strokeWidth="42" strokeLinecap="round" fill="none" opacity="0.08"/>
            <path d={fav ? "M 240 200 L 360 200" : "M 260 210 L 360 200"} stroke="#E6E8EC" strokeWidth="42" strokeLinecap="round" fill="none"/>
            <path d={fav ? "M 240 200 L 360 200" : "M 260 210 L 360 200"} stroke="#0B1F4D" strokeWidth="42" strokeLinecap="round" fill="none" opacity="0.08"/>
            <text x="215" y="252" textAnchor="middle" fontSize="11" fontWeight="700" fill={fav ? '#059669' : '#DC2626'}>
              {fav ? 'Fragments in contact' : 'Displaced gap'}
            </text>
            <line x1="190" y1="170" x2="230" y2="170" stroke={fav ? '#059669' : '#DC2626'} strokeWidth="3" strokeLinecap="round" markerEnd="url(#pullA)" />
            <line x1="240" y1="170" x2="200" y2="170" stroke={fav ? '#059669' : '#DC2626'} strokeWidth="3" strokeLinecap="round" markerEnd="url(#pullA)" />
            <text x="215" y="150" textAnchor="middle" fontSize="10" fontWeight="800" fill={fav ? '#059669' : '#DC2626'}>
              {fav ? '← Forces pull together →' : '← Forces pull apart →'}
            </text>
            <text x="120" y="270" textAnchor="middle" fontSize="10" fill="#64748B">Distal segment</text>
            <text x="300" y="270" textAnchor="middle" fontSize="10" fill="#64748B">Proximal segment</text>
            <path d="M 60 180 L 360 180" stroke="#C9A24B" strokeWidth="1" strokeDasharray="4 4" opacity="0.6"/>
            <text x="380" y="184" fontSize="9" fill="#8a6c25" fontWeight="700">occlusal plane</text>
          </svg>
        </div>

        <div className="lg:col-span-2">
          <div className={`rounded-2xl border p-5 h-full ${
            fav ? 'border-emerald-200 bg-emerald-50/60' : 'border-rose-200 bg-rose-50/60'
          }`}>
            <Pill tone={fav ? 'green' : 'red'}>{fav ? 'FAVOURABLE' : 'UNFAVOURABLE'}</Pill>
            <h4 className="mt-3 font-extrabold text-[#0B1F4D]">
              {fav ? 'Non-displaced pattern' : 'Displaced pattern'}
            </h4>
            <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">
              {fav
                ? 'The direction of the fracture line allows muscle forces to draw the segments together, minimising displacement. Frequently amenable to closed treatment.'
                : 'The direction of the fracture line means muscle forces pull the segments apart, producing significant misalignment. Typically requires open reduction and internal fixation.'}
            </p>
            <div className="mt-4 rounded-xl bg-white border border-[#E6E8EC] p-3.5">
              <div className="text-[10.5px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-1">Clinical note</div>
              <p className="text-[12.5px] text-slate-700">
                {fav
                  ? 'A non-displaced, stable fracture with preserved occlusion may be managed conservatively.'
                  : 'Open reduction is preferred — closed techniques alone cannot overcome the displacing muscular forces.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FractureTypeAnimator() {
  const [type, setType] = useState('simple');
  const types: Record<string, { label: string; tone: string; desc: string }> = {
    simple:     { label:'Simple (Closed)',   tone:'blue',  desc:'The bone does not penetrate the skin, oral cavity, or sinonasal cavities. Skin barrier intact.' },
    compound:   { label:'Compound (Open)',   tone:'gold',  desc:'The fractured bone penetrates the surrounding tissues and skin and is exposed to the external environment — increased infection risk.' },
    comminuted: { label:'Comminuted',        tone:'red',   desc:'The bone fractures into several fragments. Penetrating sharp objects and missiles are classic causes. Requires load-bearing fixation.' },
  };
  const t = types[type];

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-extrabold text-lg text-[#0B1F4D]">Fracture Type Animator</h3>
          <p className="text-sm text-slate-500 mt-1">Toggle the fracture pattern to see how the bone breaks.</p>
        </div>
        <div className="inline-flex rounded-xl border border-[#E6E8EC] bg-[#FAF8F3] p-1">
          {Object.entries(types).map(([k, tt]) => (
            <button key={k} onClick={() => setType(k)}
              className={`px-3.5 py-2 rounded-lg text-[12.5px] font-bold transition-all ${
                type === k ? (tt.tone === 'gold' ? 'bg-[#C9A24B] text-white' : tt.tone === 'red' ? 'bg-rose-500 text-white' : 'bg-[#1B3A8C] text-white') : 'text-[#0B1F4D] hover:text-[#1B3A8C]'
              }`}>
              {tt.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <svg viewBox="0 0 420 280" className="w-full h-auto">
            <rect width="420" height="280" rx="16" fill="#FAF8F3"/>
            <path d="M 60 190 C 130 225 230 215 280 155 C 305 125 320 90 320 55" fill="none" stroke="#E6E8EC" strokeWidth="44" strokeLinecap="round"/>
            <path d="M 60 190 C 130 225 230 215 280 155 C 305 125 320 90 320 55" fill="none" stroke="#0B1F4D" strokeWidth="44" strokeLinecap="round" opacity="0.06"/>
            <path d="M 90 178 C 155 210 245 200 285 145" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" opacity="0.9"/>

            {type === 'simple' && (
              <g>
                <line x1="200" y1="195" x2="215" y2="235" stroke="#1B3A8C" strokeWidth="3.5" strokeLinecap="round"/>
                <text x="215" y="258" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1B3A8C">Closed fracture</text>
                <text x="215" y="272" textAnchor="middle" fontSize="10" fill="#64748B">Soft tissue envelope intact</text>
              </g>
            )}

            {type === 'compound' && (
              <g>
                <line x1="200" y1="195" x2="215" y2="235" stroke="#C9A24B" strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M 213 235 L 225 258 L 213 250 Z" fill="#C9A24B" stroke="#8a6c25" strokeWidth="1"/>
                <path d="M 205 245 Q 215 252 228 248" fill="none" stroke="#B23A2E" strokeWidth="2" strokeDasharray="3 2" className="dash-anim"/>
                <text x="215" y="272" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#8a6c25">Sharp object / missile</text>
                <text x="345" y="80" fontSize="10" fontWeight="700" fill="#B23A2E">Open to mouth</text>
                <line x1="290" y1="90" x2="255" y2="165" stroke="#B23A2E" strokeWidth="1.2" strokeDasharray="3 3"/>
              </g>
            )}

            {type === 'comminuted' && (
              <g>
                {[[180,195,175,225],[200,200,215,235],[220,200,235,232],[240,195,260,220],[260,185,278,200]].map(([x1,y1,x2,y2],i)=>(
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B23A2E" strokeWidth="2.5" strokeLinecap="round" className="wiggle" style={{animationDelay:`${i*0.15}s`}}/>
                ))}
                <circle cx="196" cy="228" r="4" fill="#FAF8F3" stroke="#B23A2E" strokeWidth="1.5"/>
                <circle cx="222" cy="222" r="3.5" fill="#FAF8F3" stroke="#B23A2E" strokeWidth="1.5"/>
                <circle cx="248" cy="212" r="4" fill="#FAF8F3" stroke="#B23A2E" strokeWidth="1.5"/>
                <text x="215" y="258" textAnchor="middle" fontSize="11" fontWeight="700" fill="#B23A2E">Multiple fragments</text>
                <text x="215" y="272" textAnchor="middle" fontSize="10" fill="#64748B">High-energy / blast / missile</text>
              </g>
            )}
          </svg>
        </div>

        <div className="lg:col-span-2">
          <div className={`rounded-2xl border p-5 h-full ${
            t.tone === 'gold' ? 'border-[#C9A24B]/40 bg-[#C9A24B]/5' :
            t.tone === 'red'  ? 'border-rose-200 bg-rose-50/60' :
                                'border-[#1B3A8C]/30 bg-[#1B3A8C]/5'
          }`}>
            <Pill tone={t.tone as any}>{t.label}</Pill>
            <p className="mt-3 text-[13px] text-slate-700 leading-relaxed">{t.desc}</p>

            <div className="mt-4 rounded-xl bg-white border border-[#E6E8EC] p-3.5">
              <div className="text-[10.5px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-1">Fixation implication</div>
              <p className="text-[12.5px] text-slate-700">
                {type === 'simple'     && 'May be amenable to closed treatment (MMF) if non-displaced and favourable.'}
                {type === 'compound'   && 'Antibiotics, debridement, and ORIF. Higher risk of infection and hardware failure.'}
                {type === 'comminuted' && 'Requires load-bearing rigid fixation (reconstruction plate) — the plate carries 100% of functional load.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export const LectureClassification: React.FC = () => {
  const [selected, setSelected] = useState('condyle');
  const [typeTab, setTypeTab] = useState('site');
  const active = REGIONS[selected];

  const bySite = [
    { site:'Condyle', pct:29.1, note:'Most common — often an indirect fracture' },
    { site:'Angle', pct:24.5, note:'2nd most common — assault, 3rd molars' },
    { site:'Symphysis / Parasymphysis', pct:22, note:'Posteriorly directed force, MVA' },
    { site:'Body', pct:16, note:'Non-union most common here' },
    { site:'Dentoalveolar', pct:3.1, note:'Associated with the dentition' },
    { site:'Not specified', pct:2.2, note:'—' },
    { site:'Ramus', pct:1.7, note:'High-energy trauma' },
    { site:'Coronoid', pct:1.3, note:'Rarest — protected by zygomatic arch' },
  ];

  return (
    <div className="anim-in space-y-6">
      <SectionTitle eyebrow="Module 02" title="Classification System"
        subtitle="Mandibular fractures are classified by site, by fracture type, by the direction of impact, and by the degree of displacement." />

      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-3 p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-extrabold text-[#0B1F4D] text-sm md:text-base">Interactive Mandible Map</h4>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Tap a region</span>
          </div>
          <svg viewBox="0 0 500 420" className="w-full h-auto select-none">
            <ellipse cx="250" cy="250" rx="215" ry="165" fill="#FAF8F3" />
            {REGION_ORDER.map((key) => (
              <g key={key} className={`region ${selected === key ? 'active' : ''}`}
                onClick={() => setSelected(key)} role="button" tabIndex={0} aria-label={REGIONS[key].name}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(key); }}>
                {RegionShapes[key as keyof typeof RegionShapes]}
              </g>
            ))}
            <text x="100" y="30" textAnchor="middle" className="region-label">Condyle</text>
            <text x="400" y="30" textAnchor="middle" className="region-label">Condyle</text>
            <text x="160" y="120" textAnchor="middle" className="region-label" fontSize="10">Coronoid</text>
            <text x="340" y="120" textAnchor="middle" className="region-label" fontSize="10">Coronoid</text>
            <text x="36"  y="145" textAnchor="middle" className="region-label" fontSize="10">Ramus</text>
            <text x="464" y="145" textAnchor="middle" className="region-label" fontSize="10">Ramus</text>
            <text x="52"  y="215" textAnchor="middle" className="region-label" fontSize="10">Angle</text>
            <text x="448" y="215" textAnchor="middle" className="region-label" fontSize="10">Angle</text>
            <text x="140" y="400" textAnchor="middle" className="region-label" fontSize="10">Body</text>
            <text x="360" y="400" textAnchor="middle" className="region-label" fontSize="10">Body</text>
            <text x="250" y="410" textAnchor="middle" className="region-label" fontSize="10">Symphysis</text>
          </svg>
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {REGION_ORDER.map((key) => (
              <button key={key} onClick={() => setSelected(key)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                  selected === key ? 'bg-[#C9A24B] text-white border-[#C9A24B]' : 'bg-white text-[#0B1F4D] border-[#E6E8EC] hover:border-[#C9A24B]'
                }`}>
                {REGIONS[key].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-5 md:p-6 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-xl text-[#0B1F4D] leading-tight">{active.name}</h4>
              <div className="font-ar text-[#C9A24B] text-lg mt-0.5">{active.ar}</div>
            </div>
            <Pill tone={active.tone === 'gold' ? 'gold' : active.tone === 'blue' ? 'blue' : 'grey'}>{active.badge}</Pill>
          </div>
          <div className="mt-5 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] p-4">
            <div className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">Fracture incidence</div>
            <div className="text-4xl font-extrabold text-[#1B3A8C] mt-1">{active.incidence}</div>
          </div>
          <div className="mt-5">
            <div className="text-[11px] font-bold tracking-[0.2em] text-[#C9A24B] uppercase mb-2">Common causes</div>
            <ul className="space-y-1.5">
              {active.causes.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-slate-700 leading-snug">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#C9A24B] shrink-0" />{c}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5">
            <div className="text-[11px] font-bold tracking-[0.2em] text-[#C9A24B] uppercase mb-2">Typical muscle pulls</div>
            <p className="text-sm text-slate-700 leading-relaxed">{active.muscles}</p>
          </div>
          <div className="mt-5 rounded-xl bg-[#0B1F4D] text-white p-4">
            <div className="text-[11px] font-bold tracking-[0.2em] text-[#C9A24B] uppercase mb-1.5">Clinical pearl</div>
            <p className="text-[13px] leading-relaxed text-white/85">{active.pearls}</p>
          </div>
        </Card>
      </div>

      <MuscleForceDiagram />
      <DisplacementVisualizer />
      <FractureTypeAnimator />

      <Card className="p-6 md:p-8">
        <h3 className="font-extrabold text-lg text-[#0B1F4D] mb-1">Distribution by Site</h3>
        <p className="text-sm text-slate-500 mb-5">Incidence figures as reported in the lecture data.</p>
        <div className="space-y-3">
          {bySite.map((row) => (
            <div key={row.site} className="grid grid-cols-12 items-center gap-3">
              <div className="col-span-12 sm:col-span-4 text-sm font-semibold text-[#0B1F4D]">{row.site}</div>
              <div className="col-span-8 sm:col-span-5">
                <div className="h-2.5 rounded-full bg-[#E6E8EC] overflow-hidden">
                  <div className={`h-full rounded-full ${row.pct > 20 ? 'bg-[#C9A24B]' : row.pct > 5 ? 'bg-[#1B3A8C]' : 'bg-[#1B3A8C]/50'}`}
                    style={{ width: `${(row.pct/29.1)*100}%` }} />
                </div>
              </div>
              <div className="col-span-3 sm:col-span-1 text-sm font-extrabold text-[#1B3A8C] text-right">{row.pct}%</div>
              <div className="col-span-12 sm:col-span-2 text-[12px] text-slate-500">{row.note}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 md:p-8">
        <div className="flex flex-wrap gap-2 mb-5">
          {['site','type','displacement'].map((t) => (
            <button key={t} onClick={() => setTypeTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                typeTab === t ? 'bg-[#0B1F4D] text-white border-[#0B1F4D]' : 'bg-white text-[#0B1F4D] border-[#E6E8EC] hover:border-[#C9A24B]'
              }`}>
              {t === 'site' ? 'By Type' : t === 'type' ? 'By Impact' : 'By Displacement'}
            </button>
          ))}
        </div>

        {typeTab === 'site' && (
          <div className="grid md:grid-cols-3 gap-4 anim-in">
            {[
              { key:'simple', title:'Simple (Closed)', colour:'border-[#1B3A8C]/30 bg-[#1B3A8C]/5', accent:'text-[#1B3A8C]',
                text:'The fractured bone does not penetrate the skin — it is not opened into the skin, the oral cavity, or the sinonasal cavities.' },
              { key:'compound', title:'Compound (Open)', colour:'border-[#C9A24B]/40 bg-[#C9A24B]/5', accent:'text-[#8a6c25]',
                text:'The fractured bone penetrates the surrounding tissues and skin and is exposed to the external environment — increased infection risk.' },
              { key:'comminuted', title:'Comminuted', colour:'border-rose-200 bg-rose-50/60', accent:'text-rose-700',
                text:'The bone fractures into several fragments. Penetrating sharp objects and missiles are classic examples. Requires load-bearing fixation.' },
            ].map((t) => (
              <div key={t.key} className={`rounded-2xl border p-5 ${t.colour}`}>
                <h4 className={`font-extrabold ${t.accent}`}>{t.title}</h4>
                <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        )}
        {typeTab === 'type' && (
          <div className="grid md:grid-cols-2 gap-4 anim-in">
            <div className="rounded-2xl border border-[#1B3A8C]/25 bg-[#1B3A8C]/5 p-5">
              <Pill tone="blue">DIRECT</Pill>
              <h4 className="mt-3 font-extrabold text-[#0B1F4D]">Direct Mandibular Fractures</h4>
              <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">Result from a force directly applied to the mandible. The fracture occurs at the point where the force impacts the bone.</p>
            </div>
            <div className="rounded-2xl border border-[#C9A24B]/40 bg-[#C9A24B]/5 p-5">
              <Pill tone="gold">INDIRECT</Pill>
              <h4 className="mt-3 font-extrabold text-[#0B1F4D]">Indirect Mandibular Fractures</h4>
              <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">Occur when force is transmitted through the bone, causing a fracture at a site distant from the point of impact — commonly the subcondylar region or angle when force is applied to the symphysis or body.</p>
            </div>
          </div>
        )}
        {typeTab === 'displacement' && (
          <div className="grid md:grid-cols-2 gap-4 anim-in">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
              <Pill tone="green">FAVOURABLE</Pill>
              <h4 className="mt-3 font-extrabold text-[#0B1F4D]">Favourable (Non-displaced)</h4>
              <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">The muscle forces tend to draw the fracture segments <strong>together</strong>, minimising displacement.</p>
              <p className="mt-3 text-[12px] font-bold text-emerald-700">→ May be amenable to closed treatment</p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
              <Pill tone="red">UNFAVOURABLE</Pill>
              <h4 className="mt-3 font-extrabold text-[#0B1F4D]">Unfavourable (Displaced)</h4>
              <p className="mt-2 text-[13px] text-slate-700 leading-relaxed">The muscle forces tend to <strong>displace</strong> the fracture segments, potentially leading to significant misalignment.</p>
              <p className="mt-3 text-[12px] font-bold text-rose-700">→ Usually requires open treatment (ORIF)</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
