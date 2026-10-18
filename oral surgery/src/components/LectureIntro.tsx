import React, { useState } from 'react';
import { Card, SectionTitle, Pill } from './UI';

export const EpidemiologyDashboard: React.FC = () => {
  const [cohort, setCohort] = useState('men');
  const data: Record<string, { label: string; pct: number; color: string }[]> = {
    men: [
      { label: 'Assault', pct: 50, color: '#DC2626' },
      { label: 'MVA', pct: 20, color: '#1B3A8C' },
      { label: 'Falls', pct: 12, color: '#C9A24B' },
      { label: 'Sport / other', pct: 18, color: '#64748B' },
    ],
    women: [
      { label: 'MVA', pct: 35, color: '#1B3A8C' },
      { label: 'Falls', pct: 25, color: '#C9A24B' },
      { label: 'Assault / DV', pct: 22, color: '#DC2626' },
      { label: 'Sport / other', pct: 18, color: '#64748B' },
    ],
  };
  const cohorts = data[cohort];

  let cumulative = 0;
  const arcs = cohorts.map((c) => {
    const start = cumulative;
    cumulative += c.pct;
    return { ...c, start, end: cumulative };
  });
  const polar = (pct: number, r: number) => {
    const a = (pct / 100) * Math.PI * 2 - Math.PI / 2;
    return [110 + Math.cos(a) * r, 110 + Math.sin(a) * r];
  };
  const arcPath = (s: number, e: number, r = 80) => {
    const [x1, y1] = polar(s, r);
    const [x2, y2] = polar(e, r);
    const large = e - s > 50 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-extrabold text-lg text-[#0B1F4D]">Epidemiology — Mechanism by Sex</h3>
          <p className="text-sm text-slate-500 mt-1">Click a cohort to compare the distribution of injury mechanisms.</p>
        </div>
        <div className="inline-flex rounded-xl border border-[#E6E8EC] bg-[#FAF8F3] p-1">
          {Object.keys(data).map((k) => (
            <button key={k} onClick={() => setCohort(k)}
              className={`px-4 py-2 rounded-lg text-[12.5px] font-bold transition-all ${
                cohort === k ? 'bg-[#0B1F4D] text-white' : 'text-[#0B1F4D] hover:text-[#1B3A8C]'
              }`}>
              {k === 'men' ? 'Men' : 'Women'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <svg viewBox="0 0 220 220" className="w-full max-w-xs mx-auto">
            <circle cx="110" cy="110" r="80" fill="none" stroke="#E6E8EC" strokeWidth="26"/>
            {arcs.map((a, i) => (
              <path key={i} d={arcPath(a.start, a.end)} stroke={a.color} strokeWidth="26" fill="none" opacity="0.9"/>
            ))}
            <text x="110" y="105" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0B1F4D">
              {cohort === 'men' ? 'MEN' : 'WOMEN'}
            </text>
            <text x="110" y="122" textAnchor="middle" fontSize="9" fill="#64748B">
              {cohort === 'men' ? '18–24 peak' : 'MVA & falls'}
            </text>
          </svg>
        </div>
        <div className="space-y-3">
          {cohorts.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: c.color }}/>
              <div className="flex-1">
                <div className="flex justify-between text-[13px] font-bold text-[#0B1F4D] mb-1">
                  <span>{c.label}</span>
                  <span>{c.pct}%</span>
                </div>
                <div className="h-1.5 bg-[#E6E8EC] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${c.pct}%`, backgroundColor: c.color }}/>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-4 rounded-xl bg-[#0B1F4D] text-white p-3.5">
            <p className="text-[12.5px] leading-relaxed text-white/85">
              <span className="text-[#C9A24B] font-bold">Remember:</span> seatbelt + airbag use decreases
              the likelihood of a facial fracture in an MVA by over 50%.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const LectureIntro: React.FC<{ onGo: (tab: string) => void }> = ({ onGo }) => {
  const stats = [
    { big: '18–24', label: 'Peak age group', sub: 'Men — assault (≈50% of cases)', tone: 'gold' },
    { big: '4×', label: 'Male : female incidence', sub: 'Men have a fourfold higher incidence', tone: 'blue' },
    { big: '25%', label: 'Falls in women', sub: 'Domestic violence must be ruled out', tone: 'blue' },
    { big: '>50%', label: 'Risk reduction', sub: 'Seatbelt + airbag combined', tone: 'gold' },
  ];

  return (
    <div className="anim-in space-y-6">
      <SectionTitle eyebrow="Module 01" title="Introduction & Epidemiology"
        subtitle="Mandible fractures are regularly encountered by oral and maxillofacial surgeons and account for a significant portion of all maxillofacial injuries." />

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
            <p className="mt-3 text-slate-600 text-sm md:text-[15px] leading-relaxed">
              In contrast, women sustain mandible fractures more commonly from motor vehicle accidents (MVAs) and falls. About 25% of mandible fractures in women are secondary to falls — although domestic violence should always be ruled out if the mechanism and fracture location are inconsistent with accidental trauma.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Pill tone="blue">Assault · Men</Pill>
              <Pill tone="blue">MVA &amp; Falls · Women</Pill>
              <Pill tone="grey">Domestic violence screen</Pill>
            </div>
          </div>
          <div className="md:col-span-2 bg-[#0B1F4D] text-white p-6 md:p-8 flex flex-col justify-center">
            <div className="font-ar text-[#C9A24B] text-2xl mb-2">دقة الأسنان</div>
            <div className="h-px bg-[#C9A24B]/40 mb-5" />
            <div className="text-[11px] font-bold tracking-[0.2em] text-[#C9A24B] uppercase mb-3">Aim of treatment</div>
            <p className="text-sm leading-relaxed text-white/85">
              For most fractures of the mandible the primary aim is to restore
              <span className="text-[#C9A24B] font-semibold"> function</span> — namely both the occlusion and pain-free normal movements of both temporomandibular joints.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 h-1 w-full ${s.tone === 'gold' ? 'bg-[#C9A24B]' : 'bg-[#1B3A8C]'}`} />
            <div className={`text-3xl md:text-4xl font-extrabold ${s.tone === 'gold' ? 'text-[#C9A24B]' : 'text-[#1B3A8C]'}`}>{s.big}</div>
            <div className="mt-1 font-bold text-[#0B1F4D] text-sm">{s.label}</div>
            <div className="mt-1 text-[12px] text-slate-500 leading-snug">{s.sub}</div>
          </Card>
        ))}
      </div>

      <EpidemiologyDashboard />

      <Card className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#C9A24B]/15 border border-[#C9A24B]/40 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#C9A24B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 4 6v6c0 5 3.4 9.3 8 10 4.6-.7 8-5 8-10V6l-8-4z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h4 className="font-extrabold text-lg text-[#0B1F4D]">Improved vehicle safety has changed the epidemiology</h4>
            <p className="mt-2 text-slate-600 text-sm md:text-[15px] leading-relaxed">
              Recent reports suggest that the <strong className="text-[#0B1F4D]">combination of a seatbelt and airbags</strong> decreases the likelihood of sustaining a facial fracture during an MVA by <strong className="text-[#C9A24B]">over 50%</strong>.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <button onClick={() => onGo('class')} className="px-6 py-3 rounded-xl bg-[#1B3A8C] text-white font-bold text-sm hover:bg-[#0B1F4D] transition-colors shadow-[0_6px_24px_-8px_rgba(11,31,77,0.18)]">
          Next: Classification →
        </button>
      </div>
    </div>
  );
};
