import React, { useState } from 'react';

export const Lecture1: React.FC = () => {
  const [subTab, setSubTab] = useState('home');
  const [atlsActive, setAtlsActive] = useState(0);
  const [skullRegion, setSkullRegion] = useState<string | null>(null);
  const [showLeFort, setShowLeFort] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [isXray, setIsXray] = useState(false);
  const [activeLeFort, setActiveLeFort] = useState('0');
  const [mandSite, setMandSite] = useState('condyle');
  const [popTab, setPopTab] = useState('peds');
  const [injuryKey, setInjuryKey] = useState('uncomplicated');
  const [examChecks, setExamChecks] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, { picked: number; correct: boolean }>>({});
  const [quizDone, setQuizDone] = useState(false);

  // ATLS Data
  const atlsData = [
    {letter:'A',title:'Airway Maintenance & Cervical Spine Protection',sub:'First and foremost',body:'Establishing and maintaining a safe airway precedes all other interventions. Facial trauma can create tenuous airways requiring multiple modalities.',points:['Assess for stridor, gurgling, hoarseness, agitation','Remove dental prostheses, debris, and avulsed teeth to prevent aspiration','Comminuted or severely displaced mandible fractures can obstruct the airway via posterior displacement of the mandible and tongue base','Manual repositioning of the mandible and tongue can relieve obstruction','Bridle wires stabilize widely displaced mandibular fractures — decrease medullary bleeding and provide pain relief','Position the patient sitting or on their side — never supine with an unprotected airway'],alert:'⚠ Never leave a facial trauma patient facing "towards heaven" — position sitting or lateral.'},
    {letter:'B',title:'Breathing & Ventilation',sub:'Oxygenation',body:'Assess chest injuries including rib fractures, bruising, and signs of pneumothorax or flail chest.',points:['Ventilation requires adequate function of the lungs, chest wall, and diaphragm','Flail chest occurs when three or more adjacent ribs are fractured in at least two locations','Open pneumothorax requires an occlusive dressing','Stridor indicates upper airway obstruction','Tension pneumothorax is a sealed chest wall injury with progressive air trapping']},
    {letter:'C',title:'Circulation with Hemorrhage Control',sub:'Perfusion',body:'Control hemorrhage via compressive dressings or ligation of visible vessels. Reassess vital signs continuously.',points:['Narrowing pulse pressure reflects the degree of hypovolemia','Tachycardia (not bradycardia) is an early sign of shock','Care with packing materials or balloon catheters in severe panfacial injuries — the cranial base can be entered','Risk of injury to brain or orbital contents with blind packing in nasoethmoidal-orbital regions'],alert:'⚠ When packing midface/nasoethmoidal-orbital bleeding, the cranial base can be entered — injury to brain or orbital contents may occur.'},
    {letter:'D',title:'Disability — Neurologic Status',sub:'Glasgow Coma Scale',body:'The level of consciousness is the most important factor controlling airway patency in a patient with facial injuries.',points:['GCS is used to assess neurologic status','A patient with GCS < 8 is considered unable to protect their airway','Loss of consciousness indicates the degree of head trauma and force sustained','Always exclude brain and cervical spine injuries'],alert:'⚠ GCS &lt; 8 = unable to protect airway → definitive airway management required.'},
    {letter:'E',title:'Exposure / Environmental Control',sub:'Full survey',body:'Undress the patient fully to identify all injuries while preventing hypothermia.',points:['Full exposure to identify all injuries','Log-roll and spine exam — check posterior process, tenderness, bruising','Only withdraw spinal precautions in the alert and conscious patient','Prevent hypothermia with warm blankets and warmed fluids']}
  ];

  // Region Data
  const regionData: Record<string, any> = {
    upper:{ badge:'Upper Third', title:'Frontal Bone & Frontal Sinus', anatomic:'Frontal bone · Frontal sinus · Orbital roofs · Cranial vault', desc:'Blunt trauma to the upper third may produce frontal sinus fractures. Management requires determining whether the injury affects the inner table, outer table, or both.', points:[
      'Anterior table fracture — cosmetic deformity, may be managed conservatively if minimally displaced',
      'Posterior table fracture — risk of CSF leak and intracranial injury',
      'Nasofrontal outflow tract obstruction — requires sinus obliteration or cranialization',
      'Always evaluate for concomitant intracranial injury'
    ]},
    middle:{ badge:'Middle Third', title:'Midface Complex', anatomic:'Orbit · Nose · Malar region · Maxilla', desc:'Midface fracture patterns may include the characteristic Le Fort patterns, but are more frequently asymmetric and more extensive on the side of force application.', points:[
      'Le Fort I — horizontal, separates maxilla from pterygoid plates',
      'Le Fort II — pyramidal, through nasal bridge and orbital rims',
      'Le Fort III — craniofacial dysjunction, complete separation of facial skeleton from cranial base',
      'Nasal fractures — the most common facial fracture overall'
    ]},
    lower:{ badge:'Lower Third', title:'Mandible & Dentition', anatomic:'Mandible · Condyle · Angle · Body · Symphysis', desc:'Mandibular fractures demonstrate reproducible patterns. The most prevalent site reported in literature is variable, though the mandibular angle and condyle are most frequently cited.', points:[
      'Based on the mandibular "ring" concept — conventionally at least two sites',
      'Common multifocal patterns: body + contralateral angle/ramus/condyle',
      'Angle + contralateral parasymphysis',
      'Evaluate occlusion for malocclusion, premature contacts, or arch form disruption'
    ]}
  };

  // Le Fort Data
  const leFortDetails: Record<string, any> = {
    '0': { title:'All Le Fort Lines', lv:'Combined View', desc:'Le Fort fractures occur in three classic patterns, but in practice they are frequently asymmetric.', points:['Le Fort I — horizontal separation of the maxilla','Le Fort II — pyramidal fracture through nasal bridge','Le Fort III — complete craniofacial dysjunction'] },
    '1': { title:'Le Fort I', lv:'Horizontal / Guérin Fracture', desc:'A horizontal fracture line that separates the maxilla from the pterygoid plates, passing above the roots of the teeth.', points:['Fracture line passes above tooth apices','Involves lower nasal septum and pterygoid plates','Entire maxilla and hard palate move as a single unit'] },
    '2': { title:'Le Fort II', lv:'Pyramidal Fracture', desc:'A pyramidal fracture extending from the nasal bridge superiorly through medial orbital walls and infraorbital rims.', points:['Apex at nasofrontal suture','Passes through medial orbital wall and infraorbital foramen','Central midface moves as a pyramidal segment'] },
    '3': { title:'Le Fort III', lv:'Craniofacial Dysjunction', desc:'Complete separation of facial skeleton from cranial base through nasofrontal suture, orbits, and zygomatic arches.', points:['Complete craniofacial separation','Passes through nasofrontal suture and zygomatic arch','Highest severity — often associated with significant head trauma'] }
  };

  // Mandible Hotspots
  const mandData: Record<string, any> = {
    condyle: { name:'Condyle', pct:'Most cited', desc:'Frequently cited as the most common mandibular fracture site. May be intracapsular or extracapsular.' },
    subcondylar: { name:'Subcondylar', pct:'Common', desc:'Fracture just below the condylar head. Often associated with contralateral body or angle fractures.' },
    coronoid: { name:'Coronoid Process', pct:'Rare', desc:'Usually associated with zygomatic arch injury or direct trauma.' },
    ramus: { name:'Ramus', pct:'Uncommon', desc:'Vertical fracture through the ramus requiring significant force.' },
    angle: { name:'Angle', pct:'Most cited', desc:'Among the most frequently cited fracture sites. Often involves the third molar region.' },
    body: { name:'Body', pct:'Common', desc:'Fracture between mental foramen and angle. Part of multifocal patterns.' },
    parasymphysis: { name:'Parasymphysis', pct:'Common', desc:'Fracture adjacent to the midline, often paired with contralateral angle fractures.' },
    symphysis: { name:'Symphysis', pct:'Common', desc:'Midline fracture. Often occurs with bilateral condylar fractures.' }
  };

  // Populations Data
  const popData: Record<string, any[]> = {
    peds: [
      {title:'Why Fewer Fractures?',age:'Anatomical protection',items:['Parental supervision reduces exposure','Larger fat pads provide cushioning','Decreased pneumatization of sinuses','Increased skeletal flexibility — more malleable bone']},
      {title:'Atypical Patterns',age:'Before Le Fort',items:['Atypical craniofacial fracture patterns precede adult Le Fort patterns','Incompletely pneumatized frontal sinus transmits energy directly to supraorbital foramen']},
      {title:'Dentoalveolar Trauma',age:'High risk',items:['Crown fractures — the most common injury','Luxations, avulsions, subluxations, root fractures, intrusions','~1/3 occur in children younger than 10 years']}
    ],
    adult: [
      {title:'Epidemiology',age:'2nd–3rd decade',items:['~500,000 facial fractures present to US ERs annually','More common in males than females','Most frequent in the second and third decades']},
      {title:'Mechanisms',age:'Cause profile',items:['Altercations and assaults','Falls','Motor vehicle collisions (MVCs)','Sports injuries']},
      {title:'Associated Injuries',age:'Concomitant',items:['Soft tissue trauma (~30%)','Intracranial injuries (12% to 45.5%)','Cervical spine injury (up to 9.7%)']}
    ],
    geri: [
      {title:'Mechanism Shift',age:'Falls predominate',items:['Falls are more frequent causes in geriatric patients','Soft tissue injuries very common in older adults']},
      {title:'Fracture Distribution',age:'Different pattern',items:['Higher incidences of orbital floor fractures','Higher incidences of maxillary and condylar fractures']}
    ]
  };

  // Dental Injuries & Tooth rendering helpers
  const injuries: Record<string, any> = {
    uncomplicated: { name:'Uncomplicated Crown Fracture', desc:'Enamel and dentin involved, pulp not exposed. Restore with composite.', tx:'Composite restoration.', crownPath:'M 150 60 L 168 62 L 172 110 L 155 108 Z M 250 60 L 232 62 L 228 110 L 245 108 Z M 155 108 Q 200 128 245 108 L 250 60 Q 200 40 150 60 Z', dentinOpacity: 0.85, transform: '' },
    complicated: { name:'Complicated Crown Fracture', desc:'Enamel, dentin, and pulp involved. Requires endodontic evaluation.', tx:'Pulp cap, pulpotomy, or RCT.', crownPath:'M 150 60 L 175 64 L 178 118 L 152 114 Z M 250 60 L 225 64 L 222 118 L 248 114 Z M 152 114 Q 200 130 248 114 L 250 60 Q 200 40 150 60 Z', dentinOpacity: 1, transform: '' },
    concussion: { name:'Concussion', desc:'Tooth tender to percussion but not displaced or mobile.', tx:'Soft diet, monitor vitality.', crownPath:'M 150 60 Q 200 40 250 60 L 256 170 Q 250 205 200 205 Q 150 205 144 170 Z', dentinOpacity: 0.85, transform: '' },
    subluxation: { name:'Subluxation', desc:'Tooth mobile but not displaced. Gingival sulcus bleeding.', tx:'Flexible splint for 1–2 weeks.', crownPath:'M 150 60 Q 200 40 250 60 L 256 170 Q 250 205 200 205 Q 150 205 144 170 Z', dentinOpacity: 0.85, transform: 'translate(0, -6px)' },
    luxation: { name:'Lateral Luxation', desc:'Tooth displaced laterally, usually with alveolar bone fracture.', tx:'Reposition, splint 2–4 weeks.', crownPath:'M 150 60 Q 200 40 250 60 L 256 170 Q 250 205 200 205 Q 150 205 144 170 Z', dentinOpacity: 0.85, transform: 'translate(18px, 0) rotate(9deg)' },
    extrusion: { name:'Extrusion', desc:'Tooth partially displaced out of socket, appearing elongated.', tx:'Reposition gently, splint 2 weeks.', crownPath:'M 150 60 Q 200 40 250 60 L 256 170 Q 250 205 200 205 Q 150 205 144 170 Z', dentinOpacity: 0.85, transform: 'translate(0, -28px)' },
    intrusion: { name:'Intrusion', desc:'Tooth driven into alveolar bone. Significant PDL damage.', tx:'Spontaneous re-eruption or orthodontic repositioning.', crownPath:'M 150 60 Q 200 40 250 60 L 256 170 Q 250 205 200 205 Q 150 205 144 170 Z', dentinOpacity: 0.85, transform: 'translate(0, 32px)' },
    avulsion: { name:'Avulsion', desc:'Complete displacement of tooth out of socket. True dental emergency.', tx:'Reimplant ASAP (within 60 min); store in milk or saline.', crownPath:'M 150 60 Q 200 40 250 60 L 256 170 Q 250 205 200 205 Q 150 205 144 170 Z', dentinOpacity: 0.85, transform: 'translate(0, -110px) rotate(15deg)' }
  };
  const activeInjury = injuries[injuryKey] || injuries.uncomplicated;

  // Exam checklist data
  const examCategories = [
    { title:'Inspection', icon:'👁', items:['Overall inspection for asymmetry','Identify contusions and swelling','Note hemorrhage'] },
    { title:'Palpation', icon:'✋', items:['Palpate entire face systematically (top-down)','Delineate step-offs or instability','Assess crepitus'] },
    { title:'Soft Tissue', icon:'🩹', items:['Note all soft tissue injuries','Test vital structures within range','Examine cranial nerves'] },
    { title:'Ocular Exam', icon:'👁️', items:['Visual acuity','Anterior chamber inspection','Extraocular movements'] },
    { title:'Nasal Exam', icon:'👃', items:['Palpate nasal bones','Evaluate patency','Check for septal hematoma'] },
    { title:'Intraoral Exam', icon:'🦷', items:['Assess dentition','Evaluate occlusion','Note mucosal lacerations'] },
    { title:'Neurologic', icon:'🧠', items:['Motor function','Glasgow Coma Scale assessment'] },
    { title:'History', icon:'📋', items:['Mechanism of injury','Time of injury','Comorbidities & medications'] }
  ];

  // Quiz questions
  const quizQuestions = [
    {q:'Which of the following parameters reflects the degree of hypovolemia?',opts:['Rapid capillary return','Increase in body temperature','Narrowing pulse pressure (diastolic minus systolic)','Bradycardia'],ans:2,exp:'Narrowing pulse pressure is a classic sign of hypovolemic shock.'},
    {q:'In the assessment of breathing, all the following are true EXCEPT:',opts:['Ventilation requires adequate function of the lungs','Tension pneumothorax is an unsealed opening in the chest wall','Flail chest occurs when three or more ribs are fractured','Occlusive dressing is management of open pneumothorax'],ans:1,exp:'Tension pneumothorax is a SEALED chest wall injury with progressive air trapping.'},
    {q:'When three or more adjacent ribs are fractured in two locations, this will result in:',opts:['Pneumothorax','Flail chest','Rupture of diaphragm','Hemothorax'],ans:1,exp:'Flail chest creates a free-floating segment with paradoxical motion.'},
    {q:'The most important factor controlling airway patency in facial injuries is:',opts:['Intact tongue','Undisplaced fractured mandible','Level of consciousness','Bleeding'],ans:2,exp:'The level of consciousness is the single most important factor controlling airway patency.'},
    {q:'In Glasgow Coma Scale, a patient is unable to protect their airway when score is:',opts:['Less than 12','More than 12','Less than 8','More than 8'],ans:2,exp:'A GCS < 8 indicates the patient cannot protect their airway.'},
    {q:'Which imaging modality is the gold standard for maxillofacial trauma?',opts:['Panoramic radiograph','Computed tomography (CT)','Lateral cephalogram','MRI'],ans:1,exp:'Computed tomography (CT) with 3D reconstruction is the gold standard.'},
    {q:'Which is the most common facial fracture overall?',opts:['Mandibular fracture','Zygomatic fracture','Nasal fracture','Le Fort I'],ans:2,exp:'Nasal fractures are the most common facial injuries overall.'},
    {q:'A Le Fort II fracture is best described as:',opts:['Horizontal separation','Pyramidal fracture extending through nasal bridge and orbital rims','Craniofacial dysjunction','Isolated zygomatic arch fracture'],ans:1,exp:'Le Fort II is the pyramidal fracture.'}
  ];

  return (
    <div className="space-y-6">
      {/* Sub navigation for Lecture 1 */}
      <div className="flex gap-2 overflow-x-auto thin-scroll pb-2 border-b border-[#E6E8EC]">
        {[
          { id: 'home', label: 'Overview' },
          { id: 'atls', label: 'ATLS Principles' },
          { id: 'skull', label: '2D Skull Explorer' },
          { id: 'lefort', label: 'Le Fort Fractures' },
          { id: 'mandible', label: 'Mandible Map' },
          { id: 'populations', label: 'Populations' },
          { id: 'dental', label: 'Dental Injuries' },
          { id: 'exam', label: 'Clinical Exam' },
          { id: 'quiz', label: 'Knowledge Quiz' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSubTab(item.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              subTab === item.id ? 'bg-[#1B3A8C] text-white shadow-md' : 'bg-white text-[#0B1F4D] border border-[#E6E8EC] hover:border-[#C9A24B]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {subTab === 'home' && (
        <div className="anim-in space-y-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center py-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-md">
                  <defs>
                    <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#C9A24B"/><stop offset="100%" stopColor="#E3C77E"/></linearGradient>
                    <linearGradient id="hg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1B3A8C"/><stop offset="100%" stopColor="#0B1F4D"/></linearGradient>
                  </defs>
                  <path d="M50 12 C 30 12 20 28 20 48 C 20 68 26 80 30 90 C 34 100 36 96 38 88 C 40 80 42 72 50 72 C 58 72 60 80 62 88 C 64 96 66 100 70 90 C 74 80 80 68 80 48 C 80 28 70 12 50 12 Z" fill="url(#hg2)"/>
                  <path d="M50 12 C 30 12 20 28 20 48 C 20 68 26 80 30 90 C 34 100 36 96 38 88 C 40 80 42 72 50 72 C 58 72 60 80 62 88 C 64 96 66 100 70 90 C 74 80 80 68 80 48 C 80 28 70 12 50 12 Z" stroke="url(#hg1)" strokeWidth="3" fill="none"/>
                </svg>
                <div>
                  <h1 className="text-xl font-black text-[#0B1F4D] tracking-wider">PRECISION DENTAL</h1>
                  <span className="font-ar text-[#C9A24B] font-bold text-lg">دقة الأسنان</span>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1F4D] leading-tight mb-4">
                Preliminary Management of <span className="text-[#C9A24B]">Facial Fractures</span>
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                An interactive journey through ATLS principles, midface & mandible fracture patterns, and systematic evaluation of maxillofacial trauma.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setSubTab('skull')} className="px-6 py-3 rounded-full bg-[#1B3A8C] text-white font-bold text-sm shadow-md hover:bg-[#0B1F4D] transition-colors">
                  Explore Skull Map →
                </button>
                <button onClick={() => setSubTab('atls')} className="px-6 py-3 rounded-full border border-[#1B3A8C] text-[#0B1F4D] font-bold text-sm hover:bg-[#1B3A8C] hover:text-white transition-colors">
                  Start with ATLS
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-[#E6E8EC] p-6 rounded-3xl shadow-xl border border-[#C9A24B]/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border-l-4 border-[#C9A24B] shadow-sm">
                  <div className="text-2xl font-black text-[#1B3A8C]">500,000</div>
                  <div className="text-xs text-slate-500 mt-1 font-semibold">Facial fractures present to US ERs per year</div>
                </div>
                <div className="bg-white p-4 rounded-xl border-l-4 border-[#C9A24B] shadow-sm">
                  <div className="text-2xl font-black text-[#1B3A8C]">30%</div>
                  <div className="text-xs text-slate-500 mt-1 font-semibold">With associated soft tissue trauma</div>
                </div>
                <div className="bg-white p-4 rounded-xl border-l-4 border-[#C9A24B] shadow-sm">
                  <div className="text-2xl font-black text-[#1B3A8C]">9.7%</div>
                  <div className="text-xs text-slate-500 mt-1 font-semibold">Associated cervical spine injury</div>
                </div>
                <div className="bg-white p-4 rounded-xl border-l-4 border-[#C9A24B] shadow-sm">
                  <div className="text-2xl font-black text-[#1B3A8C]">45.5%</div>
                  <div className="text-xs text-slate-500 mt-1 font-semibold">Intracranial injuries accompanying fractures</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'atls' && (
        <div className="anim-in space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold tracking-widest text-[#C9A24B] uppercase px-3 py-1 rounded-full border border-[#C9A24B]/40">Primary Survey</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F4D] mt-2">The <span className="text-[#1B3A8C]">ABCDE</span> Algorithm</h2>
          </div>
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 space-y-3">
              {atlsData.map((d, i) => (
                <div
                  key={d.letter}
                  onClick={() => setAtlsActive(i)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                    atlsActive === i ? 'bg-gradient-to-r from-white to-[#F4F6FC] border-[#1B3A8C] shadow-md' : 'bg-white border-[#E6E8EC] hover:border-[#C9A24B]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white ${atlsActive === i ? 'bg-[#C9A24B]' : 'bg-[#1B3A8C]'}`}>
                    {d.letter}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0B1F4D]">{d.title.split('&')[0]}</h4>
                    <span className="text-xs text-slate-500 font-medium">{d.sub}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#E6E8EC] relative overflow-hidden">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C9A24B]/15 text-[#8a6c25] text-xs font-bold uppercase mb-3">
                {atlsData[atlsActive].sub}
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold text-[#0B1F4D] mb-3">{atlsData[atlsActive].title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{atlsData[atlsActive].body}</p>
              <ul className="space-y-2 mb-6">
                {atlsData[atlsActive].points.map((pt, idx) => (
                  <li key={idx} className="text-xs md:text-sm text-slate-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#C9A24B] before:font-bold">
                    {pt}
                  </li>
                ))}
              </ul>
              {atlsData[atlsActive].alert && (
                <div className="p-4 rounded-2xl bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-xs md:text-sm"
                  dangerouslySetInnerHTML={{ __html: atlsData[atlsActive].alert }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {subTab === 'skull' && (
        <div className="anim-in space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold tracking-widest text-[#C9A24B] uppercase px-3 py-1 rounded-full border border-[#C9A24B]/40">Interactive Anatomy</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F4D] mt-2">2D <em>Skull Explorer</em></h2>
            <p className="text-sm text-slate-600 mt-1">Click any facial third to reveal its bony anatomy and clinical significance.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-gradient-to-b from-white to-[#F6F4EE] p-6 rounded-3xl border border-[#C9A24B]/30 shadow-lg relative overflow-hidden">
              <div className="flex gap-2 mb-4 flex-wrap">
                <button onClick={() => setShowLeFort(!showLeFort)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${showLeFort ? 'bg-[#1B3A8C] text-white' : 'bg-white text-[#0B1F4D]'}`}>
                  Le Fort Lines
                </button>
                <button onClick={() => setShowLabels(!showLabels)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${showLabels ? 'bg-[#1B3A8C] text-white' : 'bg-white text-[#0B1F4D]'}`}>
                  Labels
                </button>
                <button onClick={() => setIsXray(!isXray)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${isXray ? 'bg-[#C9A24B] text-white' : 'bg-white text-[#0B1F4D]'}`}>
                  X-Ray Mode
                </button>
              </div>

              <div className={`relative p-4 rounded-2xl transition-all ${isXray ? 'bg-[#061229] border border-blue-400/30' : 'bg-[#FAF8F3]'}`}>
                <svg viewBox="-70 -6 620 620" className="w-full h-auto max-h-[500px] mx-auto">
                  {/* Upper Third */}
                  <g className="cursor-pointer" onClick={() => setSkullRegion('upper')}>
                    <path d="M 240 30 C 148 30 68 100 66 196 C 65 218 66 236 68 252 C 82 224 104 200 128 192 C 146 186 158 188 172 192 C 196 198 220 212 232 230 C 236 236 238 238 240 238 C 242 238 244 236 248 230 C 260 212 284 198 308 192 C 322 188 334 186 352 192 C 376 200 398 224 412 252 C 414 236 415 218 414 196 C 412 100 332 30 240 30 Z"
                      fill={isXray ? (skullRegion === 'upper' ? '#1B4383' : '#0E2450') : (skullRegion === 'upper' ? '#A6BEF0' : '#DCE4F7')}
                      stroke={isXray ? '#7FB2FF' : '#0B1F4D'} strokeWidth={skullRegion === 'upper' ? 3.4 : 2.4} />
                  </g>
                  {/* Middle Third */}
                  <g className="cursor-pointer" onClick={() => setSkullRegion('middle')}>
                    <path d="M 68 252 C 82 224 104 200 128 192 C 146 186 158 188 172 192 C 196 198 220 212 232 230 C 236 236 238 238 240 238 C 242 238 244 236 248 230 C 260 212 284 198 308 192 C 322 188 334 186 352 192 C 376 200 398 224 412 252 C 418 300 410 350 392 386 C 382 404 366 420 348 428 L 340 442 L 140 442 L 132 428 C 114 420 98 404 88 386 C 70 350 62 300 68 252 Z"
                      fill={isXray ? (skullRegion === 'middle' ? '#1F4E96' : '#12305F') : (skullRegion === 'middle' ? '#EED9A2' : '#F4E9CE')}
                      stroke={isXray ? '#7FB2FF' : '#0B1F4D'} strokeWidth={skullRegion === 'middle' ? 3.4 : 2.4} />
                    <ellipse cx="170" cy="266" rx="48" ry="40" fill={isXray ? '#020A18' : '#0B1F4D'} opacity="0.6"/>
                    <ellipse cx="310" cy="266" rx="48" ry="40" fill={isXray ? '#020A18' : '#0B1F4D'} opacity="0.6"/>
                  </g>
                  {/* Lower Third */}
                  <g className="cursor-pointer" onClick={() => setSkullRegion('lower')}>
                    <path d="M 108 336 L 108 466 C 108 520 158 556 240 556 C 322 556 372 520 372 466 L 372 336 L 334 342 L 334 444 C 300 436 180 436 146 444 L 146 342 Z"
                      fill={isXray ? (skullRegion === 'lower' ? '#173A73' : '#0B1E42') : (skullRegion === 'lower' ? '#93DEC4' : '#D9EFE5')}
                      stroke={isXray ? '#7FB2FF' : '#0B1F4D'} strokeWidth={skullRegion === 'lower' ? 3.4 : 2.4} />
                  </g>

                  {showLeFort && (
                    <g>
                      <path d="M 98 300 C 104 254 130 220 168 208 L 240 244 L 312 208 C 350 220 376 254 382 300" fill="none" stroke="#1B3A8C" strokeWidth="4" strokeLinecap="round"/>
                      <path d="M 240 246 L 174 298 L 142 402 M 240 246 L 306 298 L 338 402" fill="none" stroke="#C9A24B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M 138 402 C 186 388 294 388 342 402" fill="none" stroke="#C0392B" strokeWidth="4" strokeLinecap="round"/>
                    </g>
                  )}

                  {showLabels && (
                    <g className="text-xs font-bold" fill={isXray ? '#BBD6FF' : '#0B1F4D'}>
                      <text x="430" y="120">Frontal Bone</text>
                      <text x="430" y="260">Orbit</text>
                      <text x="430" y="410">Maxilla</text>
                      <text x="430" y="500">Mandible</text>
                    </g>
                  )}
                </svg>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-lg border border-[#E6E8EC]">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C9A24B]/15 text-[#8a6c25] text-xs font-bold uppercase mb-3">
                {skullRegion ? regionData[skullRegion].badge : 'Select a Region'}
              </span>
              <h3 className="text-xl font-extrabold text-[#0B1F4D] mb-2">
                {skullRegion ? regionData[skullRegion].title : 'Interactive Facial Thirds'}
              </h3>
              <p className="text-xs text-[#1B3A8C] font-semibold mb-4">
                {skullRegion ? regionData[skullRegion].anatomic : 'Upper · Middle · Lower'}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {skullRegion ? regionData[skullRegion].desc : 'Click any region on the skull diagram to inspect its bony anatomy, fracture patterns, and clinical significance.'}
              </p>
              {skullRegion && (
                <ul className="space-y-2">
                  {regionData[skullRegion].points.map((pt: string, idx: number) => (
                    <li key={idx} className="text-xs md:text-sm text-slate-700 pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-[#C9A24B] before:font-bold">
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex gap-2">
                <button onClick={() => setSkullRegion('upper')} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${skullRegion === 'upper' ? 'bg-[#1B3A8C] text-white' : 'bg-white text-[#0B1F4D]'}`}>Upper</button>
                <button onClick={() => setSkullRegion('middle')} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${skullRegion === 'middle' ? 'bg-[#1B3A8C] text-white' : 'bg-white text-[#0B1F4D]'}`}>Middle</button>
                <button onClick={() => setSkullRegion('lower')} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${skullRegion === 'lower' ? 'bg-[#1B3A8C] text-white' : 'bg-white text-[#0B1F4D]'}`}>Lower</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'lefort' && (
        <div className="anim-in space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold tracking-widest text-[#C9A24B] uppercase px-3 py-1 rounded-full border border-[#C9A24B]/40">Midface Patterns</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F4D] mt-2">Le Fort <em>Fractures</em></h2>
            <p className="text-sm text-slate-600 mt-1">Select each fracture level to visualize classic midface fracture lines.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-[#E6E8EC]">
              <div className="flex gap-2 justify-center mb-6 flex-wrap">
                {['0','1','2','3'].map((lf) => (
                  <button
                    key={lf}
                    onClick={() => setActiveLeFort(lf)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                      activeLeFort === lf ? 'bg-[#1B3A8C] text-white border-transparent' : 'bg-white text-[#0B1F4D] border-[#E6E8EC] hover:border-[#C9A24B]'
                    }`}
                  >
                    {lf === '0' ? 'All' : `Le Fort ${lf === '1' ? 'I' : lf === '2' ? 'II' : 'III'}`}
                  </button>
                ))}
              </div>
              <svg viewBox="0 0 400 480" className="w-full max-w-sm mx-auto">
                <path d="M200 25 C 105 25 55 105 55 195 C 55 250 64 285 76 315 L 76 355 Q 76 368 90 368 L 310 368 Q 324 368 324 355 L 324 315 C 336 285 345 250 345 195 C 345 105 295 25 200 25 Z" fill="#FAF8F3" stroke="#1B3A8C" strokeWidth="2.5"/>
                <ellipse cx="133" cy="205" rx="44" ry="36" fill="#E6E8EC" stroke="#1B3A8C" strokeWidth="2"/>
                <ellipse cx="267" cy="205" rx="44" ry="36" fill="#E6E8EC" stroke="#1B3A8C" strokeWidth="2"/>
                {(activeLeFort === '0' || activeLeFort === '1') && (
                  <path d="M 82 318 Q 140 306 200 310 Q 260 306 318 318" fill="none" stroke="#C0392B" strokeWidth="5" strokeLinecap="round"/>
                )}
                {(activeLeFort === '0' || activeLeFort === '2') && (
                  <path d="M 200 240 L 152 214 L 96 252 L 88 318 M 200 240 L 248 214 L 304 252 L 312 318" fill="none" stroke="#C9A24B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                )}
                {(activeLeFort === '0' || activeLeFort === '3') && (
                  <path d="M 200 178 L 200 240 M 200 178 L 140 186 L 89 212 L 76 232 M 200 178 L 260 186 L 311 212 L 324 232" fill="none" stroke="#1B3A8C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#E6E8EC]">
              <span className="text-xs font-bold tracking-widest text-[#C9A24B] uppercase block mb-1">{leFortDetails[activeLeFort].lv}</span>
              <h3 className="text-2xl font-extrabold text-[#0B1F4D] mb-3">{leFortDetails[activeLeFort].title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{leFortDetails[activeLeFort].desc}</p>
              <ul className="space-y-2">
                {leFortDetails[activeLeFort].points.map((pt: string, idx: number) => (
                  <li key={idx} className="text-xs md:text-sm text-slate-700 pl-4 relative before:content-['◆'] before:absolute before:left-0 before:text-[#1B3A8C] before:text-[10px]">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {subTab === 'mandible' && (
        <div className="anim-in space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold tracking-widest text-[#C9A24B] uppercase px-3 py-1 rounded-full border border-[#C9A24B]/40">Lower Third</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F4D] mt-2">Mandible <em>Fracture Map</em></h2>
            <p className="text-sm text-slate-600 mt-1">Click any blue hotspot on the mandible to inspect fracture frequency and clinical notes.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-lg border border-[#E6E8EC]">
              <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
                <defs><linearGradient id="mandGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F2E4C4"/><stop offset="100%" stopColor="#D9C08A"/></linearGradient></defs>
                <path d="M 70 70 L 70 200 Q 70 310 200 310 Q 330 310 330 200 L 330 70 L 288 70 L 288 195 Q 288 268 200 268 Q 112 268 112 195 L 112 70 Z" fill="url(#mandGrad)" stroke="#1B3A8C" strokeWidth="2.5"/>
                {/* Hotspots */}
                {[
                  { id:'condyle', cx:70, cy:62 }, { id:'subcondylar', cx:91, cy:82 }, { id:'coronoid', cx:118, cy:62 },
                  { id:'ramus', cx:91, cy:140 }, { id:'angle', cx:88, cy:250 }, { id:'body', cx:140, cy:288 },
                  { id:'parasymphysis', cx:172, cy:292 }, { id:'symphysis', cx:200, cy:292 },
                  { id:'parasymphysis2', cx:228, cy:292 }, { id:'body2', cx:260, cy:288 }, { id:'angle2', cx:312, cy:250 },
                  { id:'ramus2', cx:309, cy:140 }, { id:'condyle2', cx:330, cy:62 }, { id:'subcondylar2', cx:309, cy:82 }, { id:'coronoid2', cx:282, cy:62 }
                ].map((hs) => {
                  const baseId = hs.id.replace('2', '');
                  const isSelected = mandSite === baseId;
                  return (
                    <circle
                      key={hs.id}
                      cx={hs.cx}
                      cy={hs.cy}
                      r={isSelected ? 11 : 8}
                      fill={isSelected ? '#C0392B' : '#1B3A8C'}
                      className="cursor-pointer transition-all hover:scale-125"
                      onClick={() => setMandSite(baseId)}
                    />
                  );
                })}
              </svg>
            </div>

            <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#E6E8EC]">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C9A24B]/15 text-[#8a6c25] text-xs font-bold uppercase mb-3">Fracture Site</span>
              <h3 className="text-xl font-extrabold text-[#0B1F4D] mb-1 capitalize">{mandSite}</h3>
              <p className="text-xs text-[#1B3A8C] font-semibold mb-3">Frequency: {mandData[mandSite]?.pct}</p>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{mandData[mandSite]?.desc}</p>
              <div className="space-y-2">
                {Object.keys(mandData).map((k) => (
                  <button
                    key={k}
                    onClick={() => setMandSite(k)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex justify-between items-center ${
                      mandSite === k ? 'bg-[#0B1F4D] text-white border-[#0B1F4D]' : 'bg-white text-[#0B1F4D] border-[#E6E8EC] hover:border-[#C9A24B]'
                    }`}
                  >
                    <span className="capitalize">{k}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#C9A24B]/20 text-[#8a6c25] text-[10px]">{mandData[k].pct}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'populations' && (
        <div className="anim-in space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold tracking-widest text-[#C9A24B] uppercase px-3 py-1 rounded-full border border-[#C9A24B]/40">Demographics</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F4D] mt-2">Pediatric · Adult · <em>Geriatric</em></h2>
          </div>
          <div className="flex gap-2 justify-center mb-6">
            {['peds','adult','geri'].map((p) => (
              <button
                key={p}
                onClick={() => setPopTab(p)}
                className={`px-5 py-2 rounded-full text-xs font-bold border transition-all ${
                  popTab === p ? 'bg-[#1B3A8C] text-white border-transparent' : 'bg-white text-[#0B1F4D] border-[#E6E8EC] hover:border-[#C9A24B]'
                }`}
              >
                {p === 'peds' ? 'Pediatric' : p === 'adult' ? 'Adult' : 'Geriatric'}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {popData[popTab].map((card, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl shadow-lg border border-[#E6E8EC] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A24B] to-[#1B3A8C]" />
                <h4 className="font-extrabold text-base text-[#0B1F4D] mb-1">{card.title}</h4>
                <div className="text-[11px] font-bold tracking-wider text-[#C9A24B] uppercase mb-4">{card.age}</div>
                <ul className="space-y-2">
                  {card.items.map((item: string, i: number) => (
                    <li key={i} className="text-xs text-slate-600 pl-4 relative before:content-['●'] before:absolute before:left-0 before:text-[#1B3A8C] before:text-[6px] before:top-1.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'dental' && (
        <div className="anim-in space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold tracking-widest text-[#C9A24B] uppercase px-3 py-1 rounded-full border border-[#C9A24B]/40">Dentoalveolar</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F4D] mt-2">Traumatic <em>Dental Injuries</em></h2>
            <p className="text-sm text-slate-600 mt-1">Click each box below to visualize the injury dynamically on the tooth diagram.</p>
          </div>
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-lg border border-[#E6E8EC] text-center">
              <svg viewBox="0 0 400 320" className="w-full max-w-sm mx-auto">
                <defs>
                  <linearGradient id="enamel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#EDEFF5"/></linearGradient>
                  <linearGradient id="dentin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F5E8C8"/><stop offset="100%" stopColor="#E0C88A"/></linearGradient>
                </defs>
                <g id="toothGroup" style={{ transform: activeInjury.transform, transformOrigin: '200px 180px', transition: 'all 0.5s cubic-bezier(0.3, 0.8, 0.3, 1)' }}>
                  <path d="M 60 200 Q 200 170 340 200 L 340 300 L 60 300 Z" fill="#F2B8B8" opacity=".55"/>
                  <path id="toothCrown" d={activeInjury.crownPath} fill="url(#enamel)" stroke="#1B3A8C" strokeWidth="2.5"/>
                  <path id="toothDentin" d="M 165 80 Q 200 68 235 80 L 240 165 Q 235 190 200 190 Q 165 190 160 165 Z" fill="url(#dentin)" opacity={activeInjury.dentinOpacity}/>
                  <path id="rootL" d="M 158 200 L 148 290 Q 156 300 166 290 L 176 200 Z" fill="#EDEFF5" stroke="#1B3A8C" strokeWidth="2"/>
                  <path id="rootR" d="M 224 200 L 234 290 Q 244 300 252 290 L 242 200 Z" fill="#EDEFF5" stroke="#1B3A8C" strokeWidth="2"/>
                  <path id="pulp" d="M 195 85 L 205 85 L 205 200 L 200 265 L 195 200 Z" fill="#E8A0A0" opacity=".6"/>
                </g>
                <text x="200" y="316" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0B1F4D">ANTERIOR TOOTH — SCHEMATIC</text>
              </svg>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                {Object.keys(injuries).map((k) => (
                  <button
                    key={k}
                    onClick={() => setInjuryKey(k)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      injuryKey === k ? 'bg-[#1B3A8C] text-white border-transparent' : 'bg-white text-[#0B1F4D] border-[#E6E8EC] hover:border-[#C9A24B]'
                    }`}
                  >
                    {injuries[k].name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#E6E8EC]">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C9A24B]/15 text-[#8a6c25] text-xs font-bold uppercase mb-3">Injury Type</span>
              <h3 className="text-xl font-extrabold text-[#0B1F4D] mb-2">{injuries[injuryKey].name}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{injuries[injuryKey].desc}</p>
              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E6E8EC]">
                <div className="text-xs font-bold text-[#1B3A8C] uppercase mb-1">Management</div>
                <p className="text-xs text-slate-700">{injuries[injuryKey].tx}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'exam' && (
        <div className="anim-in space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold tracking-widest text-[#C9A24B] uppercase px-3 py-1 rounded-full border border-[#C9A24B]/40">Secondary Survey</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F4D] mt-2">Clinical <em>Examination</em></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {examCategories.map((cat, ci) => (
              <div key={cat.title} className="bg-white p-5 rounded-2xl shadow-md border border-[#E6E8EC]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1B3A8C] text-white flex items-center justify-center text-sm">{cat.icon}</span>
                  <h4 className="font-extrabold text-sm text-[#0B1F4D]">{cat.title}</h4>
                </div>
                <div className="space-y-2">
                  {cat.items.map((item, ii) => {
                    const key = `${ci}-${ii}`;
                    const checked = !!examChecks[key];
                    return (
                      <label key={ii} className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setExamChecks({ ...examChecks, [key]: !checked })}
                          className="mt-0.5"
                        />
                        <span className={checked ? 'line-through opacity-50' : ''}>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'quiz' && (
        <div className="anim-in max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold tracking-widest text-[#C9A24B] uppercase px-3 py-1 rounded-full border border-[#C9A24B]/40">Test Yourself</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F4D] mt-2">Knowledge <em>Check</em></h2>
          </div>
          {!quizDone ? (
            <div className="space-y-4">
              {quizQuestions.map((q, qi) => (
                <div key={qi} className="bg-white p-6 rounded-3xl shadow-lg border border-[#E6E8EC]">
                  <div className="text-[10px] font-bold tracking-widest text-[#C9A24B] uppercase mb-2">Question {qi + 1} of {quizQuestions.length}</div>
                  <h4 className="font-bold text-sm text-[#0B1F4D] mb-4">{q.q}</h4>
                  <div className="space-y-2">
                    {q.opts.map((opt, oi) => {
                      const ansObj = quizAnswers[qi];
                      const isPicked = ansObj?.picked === oi;
                      const isCorrectAnswer = oi === q.ans;
                      let btnCls = 'border-[#E6E8EC] bg-white text-slate-700 hover:border-[#1B3A8C]';
                      if (ansObj) {
                        if (isCorrectAnswer) btnCls = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        else if (isPicked) btnCls = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                      }
                      return (
                        <button
                          key={oi}
                          onClick={() => {
                            if (!ansObj) {
                              setQuizAnswers({ ...quizAnswers, [qi]: { picked: oi, correct: oi === q.ans } });
                            }
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnCls}`}
                        >
                          <span>{opt}</span>
                          {ansObj && isCorrectAnswer && <span className="text-emerald-600 font-bold">✓ Correct</span>}
                          {ansObj && isPicked && !isCorrectAnswer && <span className="text-rose-600 font-bold">✕ Your choice</span>}
                        </button>
                      );
                    })}
                  </div>
                  {quizAnswers[qi] && (
                    <div className="mt-4 p-3 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] text-xs text-slate-600">
                      <strong>Explanation:</strong> {q.exp}
                    </div>
                  )}
                </div>
              ))}
              <div className="text-center pt-4">
                <button
                  onClick={() => setQuizDone(true)}
                  className="px-8 py-3 rounded-full bg-[#1B3A8C] text-white font-bold text-sm shadow-md hover:bg-[#0B1F4D] transition-colors"
                >
                  View Results →
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#C9A24B]/40 text-center">
              <div className="text-4xl font-black text-[#1B3A8C] mb-2">
                {Object.values(quizAnswers).filter((a: any) => a.correct).length} / {quizQuestions.length}
              </div>
              <div className="text-xs font-bold tracking-widest text-[#C9A24B] uppercase mb-6">Final Score</div>
              <button
                onClick={() => { setQuizAnswers({}); setQuizDone(false); }}
                className="px-6 py-3 rounded-full bg-[#1B3A8C] text-white font-bold text-xs shadow-md"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
