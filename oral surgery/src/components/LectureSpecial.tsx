import React, { useState } from 'react';
import { Card, SectionTitle, Pill } from './UI';

function EdentulousResorptionSlider() {
  const [age, setAge] = useState(50);
  const depth = Math.max(12, 60 - (age - 40) * 0.9);

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-5">
        <h3 className="font-extrabold text-lg text-[#0B1F4D]">Edentulous Mandible — Resorption Timeline</h3>
        <p className="text-sm text-slate-500 mt-1">Slide to age the edentulous mandible and watch the denture-bearing area shrink.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <svg viewBox="0 0 420 280" className="w-full h-auto">
            <rect width="420" height="280" rx="16" fill="#FAF8F3"/>
            <path d="M 60 200 C 140 250 280 250 360 200" fill="none" stroke="#E6E8EC" strokeWidth="56" strokeLinecap="round"/>
            <path d="M 60 200 C 140 250 280 250 360 200" fill="none" stroke="#0B1F4D" strokeWidth="56" strokeLinecap="round" opacity="0.06"/>
            <path d="M 80 172 C 150 220 270 220 340 172" fill="none" stroke="#C9A24B" strokeWidth={depth} strokeLinecap="round" opacity="0.55"/>
            <path d="M 90 190 Q 210 240 330 190" fill="none" stroke="#0891B2" strokeWidth="2.5" strokeDasharray="5 3"/>
            <text x="210" y="262" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0891B2">Mylohyoid attachment (relative position rises as ridge resorbs)</text>

            <line x1="45" y1={200 - depth/2} x2="45" y2="200" stroke="#0B1F4D" strokeWidth="1.5"/>
            <line x1="42" y1={200 - depth/2} x2="48" y2={200 - depth/2} stroke="#0B1F4D" strokeWidth="1.5"/>
            <line x1="42" y1="200" x2="48" y2="200" stroke="#0B1F4D" strokeWidth="1.5"/>
            <text x="35" y={200 - depth/2 + 4} textAnchor="end" fontSize="10" fontWeight="800" fill="#0B1F4D">{depth.toFixed(0)} mm</text>

            <text x="380" y="40" textAnchor="end" fontSize="14" fontWeight="800" fill="#0B1F4D">Age {age}</text>
            <text x="380" y="58" textAnchor="end" fontSize="10" fill="#64748B">
              {age < 55 ? 'Early resorption' : age < 70 ? 'Moderate resorption' : 'Severe resorption'}
            </text>
          </svg>

          <input type="range" min="40" max="85" value={age} onChange={(e) => setAge(Number(e.target.value))}
            className="w-full mt-4" style={{ accentColor: '#C9A24B' }}/>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
            <span>40</span><span>55</span><span>70</span><span>85</span>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className={`rounded-xl border p-4 ${
            depth > 40 ? 'border-emerald-200 bg-emerald-50/60' :
            depth > 25 ? 'border-[#C9A24B]/40 bg-[#C9A24B]/5' :
                          'border-rose-200 bg-rose-50/60'
          }`}>
            <Pill tone={depth > 40 ? 'green' : depth > 25 ? 'gold' : 'red'}>
              {depth > 40 ? 'FAVOURABLE' : depth > 25 ? 'CAUTION' : 'SEVERE ATROPHY'}
            </Pill>
            <p className="mt-2 text-[12.5px] text-slate-700 leading-relaxed">
              {depth > 40 && 'Vertical depth is adequate for conventional miniplate fixation.'}
              {depth > 25 && depth <= 40 && 'Reduced cross-sectional area — non-union risk increases. Consider load-bearing fixation.'}
              {depth <= 25 && 'When the mandibular body is < 10 mm in depth, fracture treatment is difficult and non-union is likely. Autogenous bone grafting may be required.'}
            </p>
          </div>

          <div className="rounded-xl border border-[#E6E8EC] bg-[#FAF8F3] p-4">
            <div className="text-[10.5px] font-bold tracking-[0.2em] text-[#C9A24B] uppercase mb-2">Clinical implications</div>
            <ul className="space-y-1.5 text-[12px] text-slate-700">
              <li className="flex gap-2"><span className="text-[#C9A24B] shrink-0">•</span>Periosteal blood supply becomes the primary source</li>
              <li className="flex gap-2"><span className="text-[#C9A24B] shrink-0">•</span>Minimal-exposure reduction avoids periosteal stripping</li>
              <li className="flex gap-2"><span className="text-[#C9A24B] shrink-0">•</span>Bucket-handle displacement from digastric &amp; mylohyoid pull</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}

export const LectureSpecial: React.FC = () => {
  const [tab, setTab] = useState('paed');

  return (
    <div className="anim-in space-y-6">
      <SectionTitle eyebrow="Module 05" title="Special Considerations"
        subtitle="Paediatric and atrophic (edentulous) mandibles behave as entirely different bones — treatment principles must be modified." />

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setTab('paed')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
            tab === 'paed' ? 'bg-[#0B1F4D] text-white border-[#0B1F4D]' : 'bg-white text-[#0B1F4D] border-[#E6E8EC] hover:border-[#C9A24B]'
          }`}>Paediatric Fractures</button>
        <button onClick={() => setTab('edent')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
            tab === 'edent' ? 'bg-[#0B1F4D] text-white border-[#0B1F4D]' : 'bg-white text-[#0B1F4D] border-[#E6E8EC] hover:border-[#C9A24B]'
          }`}>Atrophic (Edentulous)</button>
      </div>

      {tab === 'paed' && (
        <div className="anim-in space-y-5">
          <Card className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl bg-[#1B3A8C]/5 border border-[#1B3A8C]/25 p-5">
                <div className="text-3xl font-extrabold text-[#1B3A8C]">8–15%</div>
                <div className="mt-1 text-[13px] font-bold text-[#0B1F4D]">of jaw fractures</div>
                <div className="text-[12px] text-slate-500 mt-0.5">occur in children under 15 years</div>
              </div>
              <div className="rounded-2xl bg-[#C9A24B]/5 border border-[#C9A24B]/40 p-5">
                <div className="text-3xl font-extrabold text-[#C9A24B]">1%</div>
                <div className="mt-1 text-[13px] font-bold text-[#0B1F4D]">before age 6</div>
                <div className="text-[12px] text-slate-500 mt-0.5">of mandibular fractures</div>
              </div>
              <div className="rounded-2xl bg-[#0B1F4D] text-white p-5">
                <div className="text-3xl font-extrabold text-[#C9A24B]">40–70%</div>
                <div className="mt-1 text-[13px] font-bold">Condyle involvement</div>
                <div className="text-[12px] text-white/60 mt-0.5">the most common paediatric site</div>
              </div>
            </div>

            <h3 className="font-extrabold text-lg text-[#0B1F4D]">Why children are different</h3>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {[
                { t:'Elastic bone', d:"The high elasticity of cortical bone means most paediatric mandible fractures are unicortical and minimally displaced. The 'greenstick' fracture is found exclusively in children." },
                { t:'Mixed dentition', d:'Until the mixed dentition phase is complete, the parasymphysis and body are occupied by developing tooth buds. Their location dictates where plate-and-screw fixation can safely be placed.' },
                { t:'Growth potential', d:'The condyle is a primary growth centre. Fractures here may disturb mandibular growth, producing facial asymmetry with ipsilateral chin deviation.' },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border border-[#E6E8EC] bg-[#FAF8F3] p-5">
                  <h4 className="font-extrabold text-[#0B1F4D] text-[15px]">{c.t}</h4>
                  <p className="mt-2 text-[13px] text-slate-600 leading-relaxed">{c.d}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'edent' && (
        <div className="anim-in space-y-5">
          <Card className="p-6 md:p-8">
            <h3 className="font-extrabold text-lg text-[#0B1F4D]">A different bone entirely</h3>
            <p className="mt-2 text-[13.5px] text-slate-700 leading-relaxed">
              The physical characteristics of the mandible are altered considerably following the loss of the teeth. From the point of view of treatment, the edentulous mandible becomes a different bone.
            </p>
          </Card>

          <EdentulousResorptionSlider />

          <Card className="p-6 md:p-8 border-l-4 border-l-[#C9A24B]">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#C9A24B]/15 border border-[#C9A24B]/40 flex items-center justify-center text-2xl">🪣</div>
              <div>
                <h3 className="font-extrabold text-lg text-[#0B1F4D]">"Bucket handle" displacement</h3>
                <p className="mt-2 text-[13.5px] text-slate-700 leading-relaxed">
                  Bilateral fractures of the body of the edentulous mandible occur near the posterior attachment of the mylohyoid diaphragm. Due to alveolar resorption, the mylohyoid attaches relatively higher up on the lingual side than when teeth are present. Extreme downward and backward angulation of the anterior part of the mandible takes place under the influence of the <strong className="text-[#0B1F4D]">digastric</strong> and <strong className="text-[#0B1F4D]">mylohyoid</strong> muscles.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
