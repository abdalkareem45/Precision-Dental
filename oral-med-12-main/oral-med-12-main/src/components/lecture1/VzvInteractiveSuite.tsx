import React, { useState } from 'react';
import { TrigeminalHead3D, TrigeminalDivision } from '../3d/TrigeminalHead3D';
import { RamsayReye3D } from '../3d/RamsayReye3D';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Sliders,
  Pill,
  Shield,
  Clock,
  ArrowRight,
  Eye,
  Radio,
  FileText,
  RotateCcw,
  Zap,
  Flame,
  Brain,
  Stethoscope,
  HeartPulse,
  UserCheck
} from 'lucide-react';

export const VzvInteractiveSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trigeminal' | 'complications' | 'ramsay-reye' | 'phn' | 'vaccines'>('trigeminal');

  // Trigeminal Division 3D State
  const [selectedDivision, setSelectedDivision] = useState<TrigeminalDivision>('v2');

  // Severe Complications Interactive State
  const [activeComplication, setActiveComplication] = useState<'osteonecrosis' | 'motor-paralysis' | 'zoster-sine-herpete' | 'arn'>('osteonecrosis');
  const [ischemiaSeverity, setIschemiaSeverity] = useState<number>(75); // 0-100%

  // Ramsay Hunt & Reye Alert Interactive 3D State
  const [ramsayReyeView, setRamsayReyeView] = useState<'ramsay-hunt' | 'reye-syndrome'>('ramsay-hunt');
  const [ramsayTriadStep, setRamsayTriadStep] = useState<number>(1);
  const [selectedAnalgesic, setSelectedAnalgesic] = useState<'aspirin' | 'ibuprofen' | 'acetaminophen'>('aspirin');

  // PHN Stepped Care Ladder State
  const [phnDurationDays, setPhnDurationDays] = useState<number>(140);
  const [patientAge, setPatientAge] = useState<number>(68);
  const [selectedPhnStep, setSelectedPhnStep] = useState<number>(1);
  const [earlyAntiviralStarted, setEarlyAntiviralStarted] = useState<boolean>(false);

  // Vaccines Shingrix vs Zostavax State
  const [selectedVaccineProfile, setSelectedVaccineProfile] = useState<'healthy-65' | 'renal-transplant' | 'hiv-low-cd4' | 'chemo-patient'>('renal-transplant');

  const isPhnCriteriaMet = phnDurationDays >= 120;
  const phnRiskPercent = patientAge >= 75 ? 70 : patientAge >= 50 ? 50 : 15;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Sub-tab Navigation */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold uppercase">
              Lecture 1 · Slides 21–32 Workbench
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">
            Varicella-Zoster Virus (VZV / Shingles) Clinical Suite
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Interactive 3D Craniofacial Trigeminal (CN V) dermatome map, severe complications lab, Ramsay Hunt & Reye 3D models, PHN ladder, and recombinant vaccine immunology.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          {[
            { id: 'trigeminal' as const, label: '1. 3D Trigeminal (CN V) Map' },
            { id: 'complications' as const, label: '2. Severe Complications' },
            { id: 'ramsay-reye' as const, label: '3. 3D Ramsay Hunt & Reye' },
            { id: 'phn' as const, label: '4. PHN Stepped Protocol' },
            { id: 'vaccines' as const, label: '5. Shingrix vs Zostavax' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-400 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: 3D CRANIOFACIAL TRIGEMINAL (CN V) DERMATOMAL MAP & MIDLINE CUTOFF */}
      {activeTab === 'trigeminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3D Trigeminal Head Model (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <TrigeminalHead3D
              selectedDivision={selectedDivision}
              onSelectDivision={(div) => setSelectedDivision(div)}
              height={400}
            />

            {/* Division Pathology Summary Box */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 uppercase">
                  {selectedDivision === 'v1' && 'V1 OPHTHALMIC: Herpes Zoster Ophthalmicus (HZO)'}
                  {selectedDivision === 'v2' && 'V2 MAXILLARY: Unilateral Palatal Ulcerations'}
                  {selectedDivision === 'v3' && 'V3 MANDIBULAR: Mandibular Gingiva & Tongue Ulcers'}
                  {selectedDivision === 'all' && 'ALL CRANIAL NERVE V DIVISIONS'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Slides 26–27</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {selectedDivision === 'v1' &&
                  'The ophthalmic division is the cranial nerve most frequently affected in HZI. Lesions involve forehead, scalp, and upper eyelid. Involvement of the nasociliary branch (Hutchinson sign) threatens the cornea, where acute dendritic keratitis and uveitis can lead to irreversible blindness.'}
                {selectedDivision === 'v2' &&
                  'Involvement of V2 manifests with a distinctive prodrome of severe burning pain on one side of the hard palate. Days later, clustered 1–5 mm ulcers emerge on the hard palate with a pathognomonic, razor-sharp unilateral cutoff strictly respecting the anatomical midline!'}
                {selectedDivision === 'v3' &&
                  'Involvement of V3 produces unilateral clustered vesicles and ulcers along the lower lip, skin of the chin, ipsilateral mandibular attached gingiva, and the anterior two-thirds of the tongue.'}
                {selectedDivision === 'all' &&
                  'Click any division button to rotate and illuminate that sensory division and its conducting cranial nerve pathway from the Trigeminal (Gasserian) Ganglion.'}
              </p>
            </div>
          </div>

          {/* Right Column: Oral Palatal Unilateral Midline Cutoff Simulator (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>V2 Palatal Midline Cutoff (Slides 26–27)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Board Hallmark
                </span>
              </div>

              {/* Hard Palate SVG Diagram */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 mt-3 flex flex-col items-center justify-center">
                <svg viewBox="0 0 260 220" className="w-full max-w-[220px] h-44 drop-shadow-xl">
                  {/* Dental Arch & Palatal Vault */}
                  <path
                    d="M 30 180 C 20 40, 240 40, 230 180 C 180 195, 80 195, 30 180 Z"
                    fill="#1e1b4b"
                    stroke="#4338ca"
                    strokeWidth="3"
                  />
                  {/* Strict Midline Dividing Line */}
                  <line x1="130" y1="50" x2="130" y2="190" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 3" />
                  <text x="130" y="38" fill="#fbbf24" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    ANATOMICAL MIDLINE
                  </text>

                  {/* Left Side: Unaffected Normal Mucosa */}
                  <text x="75" y="125" fill="#64748b" fontSize="9" textAnchor="middle">
                    Unaffected Side
                  </text>

                  {/* Right Side: V2 Unilateral Eruption */}
                  <g>
                    <path
                      d="M 130 50 C 190 50, 225 110, 220 180 L 130 190 Z"
                      fill="#b45309"
                      fillOpacity="0.55"
                    />
                    {/* Clustered ulcers strictly stopped by midline */}
                    {[
                      [150, 75], [175, 95], [160, 115], [190, 120],
                      [165, 140], [195, 150], [145, 160], [175, 165]
                    ].map(([ux, uy], idx) => (
                      <circle
                        key={idx}
                        cx={ux}
                        cy={uy}
                        r="4"
                        fill="#fef08a"
                        stroke="#dc2626"
                        strokeWidth="1.5"
                        className="animate-pulse"
                      />
                    ))}
                    <text x="180" y="195" fill="#fde047" fontSize="8" fontWeight="bold" textAnchor="middle">
                      V2 Sharp Midline Cutoff!
                    </text>
                  </g>
                </svg>
              </div>

              <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <strong className="text-amber-300 block">Why does it respect the midline?</strong>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Trigeminal nerve branches do not cross the sagittal embryological fusion line. Hence, reactivated VZV traveling down the right greater palatine nerve produces ulcerations strictly halted at the midline of the hard palate.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('complications')}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-4"
            >
              <span>Next: Severe VZV Complications</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE SEVERE VZV COMPLICATIONS LAB (SLIDES 23, 25, 28) */}
      {activeTab === 'complications' && (
        <div className="space-y-6">
          {/* Complications Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'osteonecrosis' as const,
                title: '🦷 Tooth Exfoliation & Osteonecrosis',
                slide: 'Slide 28',
                hallmark: 'Severe microvascular thrombosis & spontaneous tooth loss in HIV/AIDS patients.',
                color: 'border-rose-500 text-rose-300 bg-rose-950/40',
              },
              {
                id: 'motor-paralysis' as const,
                title: '⚡ Anterior Horn Motor Paralysis',
                slide: 'Slide 25',
                hallmark: 'VZV spreads from dorsal root to anterior horn motor cells of the spinal cord.',
                color: 'border-amber-500 text-amber-300 bg-amber-950/40',
              },
              {
                id: 'zoster-sine-herpete' as const,
                title: '👁️ Zoster Sine Herpete',
                slide: 'Slide 23',
                hallmark: 'Severe dermatomal neuralgia or facial palsy WITHOUT any cutaneous rash.',
                color: 'border-cyan-500 text-cyan-300 bg-cyan-950/40',
              },
              {
                id: 'arn' as const,
                title: '🔬 Acute Retinal Necrosis (ARN)',
                slide: 'Slide 24',
                hallmark: 'Rapidly progressive necrotizing vaso-occlusive retinitis threatening blindness.',
                color: 'border-purple-500 text-purple-300 bg-purple-950/40',
              },
            ].map((item) => {
              const isSelected = activeComplication === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveComplication(item.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? `${item.color} shadow-lg ring-2 ring-white/20 font-bold scale-102`
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {item.slide}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{item.hallmark}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Visualizer Canvas for Active Complication */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
            {activeComplication === 'osteonecrosis' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-rose-900/40 space-y-3">
                  <svg viewBox="0 0 320 200" className="w-full max-w-sm h-48 drop-shadow-xl">
                    {/* Alveolar Bone Cross Section */}
                    <path d="M 40 160 L 40 70 Q 80 80 120 70 Q 160 80 200 70 Q 240 80 280 70 L 280 160 Z" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
                    {/* Normal Teeth */}
                    <rect x="55" y="30" width="30" height="50" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                    <rect x="95" y="30" width="30" height="50" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                    {/* Necrotic Alveolar Bone Zone */}
                    <path d="M 140 70 Q 180 80 220 70 L 220 130 L 140 130 Z" fill="#78350f" stroke="#b45309" strokeWidth="2" strokeDasharray="4 2" />
                    {/* Exfoliated/Loosened Tooth Falling Out */}
                    <g transform={`translate(160, ${Math.min(35, ischemiaSeverity * 0.4)}) rotate(${Math.min(30, ischemiaSeverity * 0.35)})`}>
                      <rect x="0" y="0" width="30" height="50" rx="4" fill="#fef3c7" stroke="#dc2626" strokeWidth="2" className="animate-pulse" />
                      <text x="15" y="-6" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle">
                        {ischemiaSeverity > 60 ? 'Exfoliated!' : 'Mobile / Loosened'}
                      </text>
                    </g>
                    {/* Thrombosed necrotic vessels */}
                    <path d="M 150 145 Q 180 155 210 145" stroke="#ef4444" strokeWidth="4" strokeDasharray="3 3" />
                    <text x="180" y="175" fill="#fca5a5" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      Thrombosed Neurovascular Bundle
                    </text>
                  </svg>

                  {/* Interactive Ischemia Severity Slider */}
                  <div className="w-full space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Vascular Ischemia Severity:</span>
                      <span className="font-mono text-rose-400 font-bold">{ischemiaSeverity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={ischemiaSeverity}
                      onChange={(e) => setIschemiaSeverity(parseInt(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-3 text-xs">
                  <span className="font-bold text-rose-300 text-sm uppercase block">
                    Tooth Resorption, Exfoliation & Osteonecrosis (Slide 28):
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    In immunocompromised individuals (especially patients with <strong>HIV disease</strong>), HZI of the trigeminal nerve can cause severe vasculitis and thrombosis of terminal dental and alveolar vessels.
                  </p>
                  <div className="p-3 bg-slate-950 rounded-xl border border-rose-900/50 space-y-1.5 text-slate-200">
                    <strong className="text-rose-400">Clinical Presentation:</strong>
                    <p className="text-[11px] text-slate-300">
                      Spontaneous loss (exfoliation) of multiple intact teeth without prior periodontitis, accompanied by devitalization, root resorption, and exposed, non-healing necrotic alveolar bone.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeComplication === 'motor-paralysis' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-amber-900/40">
                  <svg viewBox="0 0 320 200" className="w-full max-w-sm h-48 drop-shadow-xl">
                    <ellipse cx="160" cy="100" rx="100" ry="75" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <path d="M 120 60 Q 160 85 200 60" stroke="#f59e0b" strokeWidth="5" fill="none" />
                    <text x="160" y="50" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Dorsal Horn (Sensory Latency)
                    </text>
                    <circle cx="130" cy="130" r="14" fill="#dc2626" className="animate-ping" />
                    <circle cx="190" cy="130" r="14" fill="#dc2626" className="animate-ping" />
                    <text x="160" y="145" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Anterior Horn Cells Invaded!
                    </text>
                    <path d="M 130 130 L 70 175" stroke="#ef4444" strokeWidth="4" strokeDasharray="4 2" />
                    <text x="60" y="190" fill="#f87171" fontSize="9" textAnchor="middle">
                      Motor Paralysis Output
                    </text>
                  </svg>
                </div>
                <div className="lg:col-span-6 space-y-3 text-xs">
                  <span className="font-bold text-amber-300 text-sm uppercase block">
                    Motor Paralysis via Anterior Horn Spread (Slide 25):
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    Although VZV is primarily a sensory ganglion disease, in rare instances the virus crosses spinal cord synapses from the dorsal sensory horn to the <strong>anterior horn motor cells</strong>.
                  </p>
                  <div className="p-3 bg-slate-950 rounded-xl border border-amber-900/50 space-y-1.5 text-slate-200">
                    <strong className="text-amber-400">Clinical Sequel:</strong>
                    <p className="text-[11px] text-slate-300">
                      Results in localized motor weakness, limb paresis, diaphragm paralysis, or bladder atony directly corresponding to the dermatomal level of sensory eruption.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeComplication === 'zoster-sine-herpete' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-cyan-900/40">
                  <div className="p-5 bg-slate-900 rounded-xl border border-cyan-500/40 text-center space-y-2">
                    <div className="text-3xl">🚫 Rash Absent</div>
                    <div className="text-cyan-300 font-bold text-sm">Severe Intractable Dermatomal Pain</div>
                    <p className="text-slate-400 text-xs">Diagnostic Confirmation: Saliva or CSF VZV PCR</p>
                  </div>
                </div>
                <div className="lg:col-span-6 space-y-3 text-xs">
                  <span className="font-bold text-cyan-300 text-sm uppercase block">
                    Zoster Sine Herpete (Slide 23):
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    Reactivation of VZV producing classic dermatomal neuropathic pain or cranial nerve motor paralysis in the <strong>complete absence of skin or mucosal vesicles</strong>.
                  </p>
                  <div className="p-3 bg-slate-950 rounded-xl border border-cyan-900/50 space-y-1.5 text-slate-200">
                    <strong className="text-cyan-400">Diagnostic Challenge:</strong>
                    <p className="text-[11px] text-slate-300">
                      Often misdiagnosed as acute pulpitis, trigeminal neuralgia, or myocardial infarction until confirmed by quantitative VZV DNA PCR in saliva or cerebrospinal fluid.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeComplication === 'arn' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-purple-900/40">
                  <div className="p-5 bg-slate-900 rounded-xl border border-purple-500/40 text-center space-y-2">
                    <div className="text-3xl">👁️ Ophthalmic Emergency</div>
                    <div className="text-purple-300 font-bold text-sm">Acute Retinal Necrosis (ARN)</div>
                    <p className="text-slate-400 text-xs">Bilateral blindness risk · Immediate IV Acyclovir required</p>
                  </div>
                </div>
                <div className="lg:col-span-6 space-y-3 text-xs">
                  <span className="font-bold text-purple-300 text-sm uppercase block">
                    Acute Retinal Necrosis (Slide 24):
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    Vaso-occlusive retinal arteritis and confluent retinal necrosis caused by VZV. Progresses rapidly with retinal detachment and high risk of bilateral blindness without urgent IV antiviral therapy.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: 3D RAMSAY HUNT SYNDROME & 3D REYE SYNDROME ALERT (SLIDES 28 & 30) */}
      {activeTab === 'ramsay-reye' && (
        <div className="space-y-6">
          {/* Top Switcher: 3D Ramsay Hunt vs 3D Reye Syndrome */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Select 3D Neurological / Pediatric Model:</span>
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setRamsayReyeView('ramsay-hunt')}
                className={`px-3.5 py-1.5 rounded-xl font-bold border transition-all ${
                  ramsayReyeView === 'ramsay-hunt'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                1. 3D Ramsay Hunt Syndrome (CN VII)
              </button>
              <button
                onClick={() => setRamsayReyeView('reye-syndrome')}
                className={`px-3.5 py-1.5 rounded-xl font-bold border transition-all ${
                  ramsayReyeView === 'reye-syndrome'
                    ? 'bg-rose-500 text-slate-950 border-rose-400 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                2. 3D Reye Syndrome (Liver & Brain)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3D Model Display (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <RamsayReye3D
                viewMode={ramsayReyeView}
                activeSubItem={ramsayTriadStep}
                onSelectSubItem={(st) => setRamsayTriadStep(st)}
                height={380}
              />
            </div>

            {/* Educational Companion Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {ramsayReyeView === 'ramsay-hunt' ? (
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <strong className="text-white text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Ramsay Hunt Clinical Triad (Slide 28):</span>
                    </strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300">
                      Geniculate Ganglion
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-xs">
                    Herpes zoster reactivation in the geniculate ganglion of Cranial Nerve VII (Facial Nerve). Click buttons above or 3D view to inspect:
                  </p>

                  <div className="space-y-2 pt-1">
                    <div
                      onClick={() => setRamsayTriadStep(1)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        ramsayTriadStep === 1 ? 'bg-amber-950/80 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-850 text-slate-400'
                      }`}
                    >
                      <strong className="block text-xs">1. Bell Palsy (Facial Motor Paralysis):</strong>
                      <span className="text-[11px]">Unilateral motor loss: forehead wrinkling loss, lagophthalmos, drooping mouth.</span>
                    </div>

                    <div
                      onClick={() => setRamsayTriadStep(2)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        ramsayTriadStep === 2 ? 'bg-rose-950/80 border-rose-500 text-rose-200' : 'bg-slate-950 border-slate-850 text-slate-400'
                      }`}
                    >
                      <strong className="block text-xs">2. External Auditory Canal Vesicles:</strong>
                      <span className="text-[11px]">Painful vesicles in the ear canal and concha of auricle.</span>
                    </div>

                    <div
                      onClick={() => setRamsayTriadStep(3)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        ramsayTriadStep === 3 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-850 text-slate-400'
                      }`}
                    >
                      <strong className="block text-xs">3. Chorda Tympani Gustatory Ageusia:</strong>
                      <span className="text-[11px]">Loss of taste sensation on anterior two-thirds of the tongue.</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-slate-900 border border-rose-500/60 rounded-2xl space-y-3 shadow-xl ring-1 ring-rose-500/30 text-xs">
                  <div className="flex items-center justify-between border-b border-rose-900/40 pb-2">
                    <strong className="text-rose-300 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Pediatric Aspirin Contraindication (Slide 30):</span>
                    </strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-200 font-bold">
                      Reye Alert
                    </span>
                  </div>

                  <p className="text-slate-200 leading-relaxed text-xs">
                    Aspirin is strictly contraindicated in children with VZV (or influenza) due to fatal hepatocerebral failure.
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="font-bold text-slate-300 block">Select Pediatric Medication to Test:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'aspirin' as const, label: 'Aspirin', color: 'bg-rose-950 border-rose-500 text-rose-200 font-bold' },
                        { id: 'ibuprofen' as const, label: 'Ibuprofen', color: 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold' },
                        { id: 'acetaminophen' as const, label: 'Acetaminophen', color: 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold' },
                      ].map((med) => (
                        <button
                          key={med.id}
                          onClick={() => setSelectedAnalgesic(med.id)}
                          className={`p-2 rounded-xl text-center border text-xs transition-all ${
                            selectedAnalgesic === med.id ? med.color : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {med.label}
                        </button>
                      ))}
                    </div>

                    <div className={`p-3 rounded-xl border text-[11px] ${
                      selectedAnalgesic === 'aspirin' ? 'bg-rose-950/80 border-rose-500 text-rose-100' : 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
                    }`}>
                      {selectedAnalgesic === 'aspirin'
                        ? 'FATAL RISK: Microvesicular fatty liver degeneration + severe cerebral edema with coma.'
                        : 'SAFE FIRST-LINE: Preferred antipyretic with zero risk of Reye syndrome.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: POSTHERPETIC NEURALGIA (PHN) STEPPED PROTOCOL (SLIDES 23, 29, 31) */}
      {activeTab === 'phn' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-mono text-teal-400 font-bold uppercase">
                Slides 23, 29 & 31 · Evidence-Based Neuropathic Stepped Care Ladder
              </span>
              <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                Postherpetic Neuralgia (PHN) Protocol & Wallerian Degeneration
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">PHN Diagnostic Threshold:</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${isPhnCriteriaMet ? 'bg-rose-950 text-rose-300 border-rose-700' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>
                {isPhnCriteriaMet ? 'CRITERIA MET: ≥ 120 Days Pain' : 'Acute Zoster Phase (<120 Days)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Risk & Duration Sliders (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">Patient Age:</span>
                  <span className="font-mono text-amber-400 font-bold">{patientAge} Years</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="90"
                  value={patientAge}
                  onChange={(e) => setPatientAge(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>PHN Probability:</span>
                  <span className="text-amber-300 font-bold">~{phnRiskPercent}% (Slide 21: 10/1000 in &gt;75yo)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-850">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">Pain Duration from Rash Onset:</span>
                  <span className="font-mono text-rose-400 font-bold">{phnDurationDays} Days</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="360"
                  value={phnDurationDays}
                  onChange={(e) => setPhnDurationDays(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 font-mono block">
                  Official Definition: Pain remaining for <strong>120 days after onset</strong> of acute rash (Slide 23).
                </span>
              </div>

              {/* Nerve Histopathology Callout (Slide 29) */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-slate-300 text-[11px] uppercase block">
                  Nerve Histopathology (Slide 29):
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  In HZI, inflammation of peripheral nerves causes <strong>demyelination and Wallerian degeneration</strong>, along with continuous ectopic firing of dorsal horn nociceptors.
                </p>
              </div>

              {/* 72-Hour Prevention Window Toggle */}
              <div className="p-3 bg-slate-900 rounded-xl border border-teal-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-teal-300 font-bold text-[11px]">72-Hour Antiviral Window (Slide 30):</span>
                  <button
                    onClick={() => setEarlyAntiviralStarted(!earlyAntiviralStarted)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      earlyAntiviralStarted
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {earlyAntiviralStarted ? 'GIVEN < 72H' : 'MISSED > 72H'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Valacyclovir (1000 mg TID) or Famciclovir (500 mg TID) started within 72 hours significantly reduces acute pain and limits PHN development!
                </p>
              </div>
            </div>

            {/* Stepped Care Treatment Ladder (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Evidence-Based Stepped Care Ladder (Slide 31):
              </span>

              {/* Step 1: 1st-Line */}
              <div className="p-4 bg-slate-950 rounded-xl border border-teal-500/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-300 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-xs">1</span>
                    <span>First-Line Treatment for PHN:</span>
                  </span>
                  <span className="text-[10px] font-mono text-teal-400">Slide 31</span>
                </div>
                <ul className="space-y-1.5 text-slate-200">
                  <li className="flex items-start gap-1.5">
                    <span className="text-teal-400 font-bold">•</span>
                    <span><strong>Gabapentin / Pregabalin:</strong> Voltage-gated calcium channel alpha-2-delta ligand.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-teal-400 font-bold">•</span>
                    <span><strong>5% Lidocaine Patch:</strong> Topical sodium channel blocker for localized allodynia.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-teal-400 font-bold">•</span>
                    <span><strong>Topical Capsaicin (0.025% – 0.8%):</strong> Substance P depleting vanilloid receptor agonist.</span>
                  </li>
                </ul>
              </div>

              {/* Step 2: 2nd-Line */}
              <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">2</span>
                    <span>Second-Line Treatment for PHN:</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">Slide 31</span>
                </div>
                <ul className="space-y-1.5 text-slate-200">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Tricyclic Antidepressants (TCAs):</strong> Amitriptyline / Nortriptyline.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Systemic Corticosteroids:</strong> (Note: Corticosteroids + antivirals together have NOT proved effective in reducing PHN incidence).</span>
                  </li>
                </ul>
              </div>

              {/* Step 3: Refractory Modalities */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-300 block">Refractory Modalities (Case Reports):</span>
                  <p className="text-slate-400 text-[11px]">Botulinum toxin injection has demonstrated relief in treatment-resistant cases.</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Slide 31
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: VACCINES: SHINGRIX VS ZOSTAVAX (SLIDE 31 & 32) */}
      {activeTab === 'vaccines' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Zostavax Card */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>Zostavax™ (Historical Vaccine)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Live Attenuated Oka
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Formulated with live, attenuated Varicella-Zoster Virus (Oka strain).
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <span className="text-rose-400 font-bold text-[11px] uppercase block">
                  Safety Limitation (Slide 31 & 32):
                </span>
                <p className="text-slate-300 text-xs">
                  Because it contains replication-competent live virus, it establishes latency and is <strong>strictly contraindicated in immunocompromised hosts</strong> due to risk of vaccine-induced disseminated zoster.
                </p>
              </div>
            </div>

            {/* Shingrix Card */}
            <div className="p-5 bg-slate-900 border border-emerald-500/60 rounded-2xl space-y-3 shadow-xl ring-1 ring-emerald-500/30">
              <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Shingrix™ (Modern Preferred Vaccine)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                  Recombinant gE Antigen
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Formulated with recombinant viral glycoprotein E (gE) antigen combined with an AS01B adjuvant system.
              </p>
              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-600/40 text-xs space-y-1.5">
                <span className="text-emerald-300 font-bold text-[11px] uppercase block">
                  Clinical Advantage (Slide 32):
                </span>
                <p className="text-slate-200 text-xs">
                  Recombinant non-live antigen makes it <strong>completely safe and appropriate for use in immunocompromised hosts</strong>! Dramatically reduces the incidence of both herpes zoster and postherpetic neuralgia (&gt;90% efficacy).
                </p>
                <div className="mt-2 pt-2 border-t border-emerald-800 text-[10px] font-mono text-emerald-200">
                  🧬 Recombinant Definition: Produced when viral genes are cloned to produce viral antigens without live pathogen risk.
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Vaccine Eligibility Simulator */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <span className="font-bold text-white block">Interactive Clinical Patient Eligibility Simulator:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'healthy-65' as const, label: '65yo Healthy Adult' },
                { id: 'renal-transplant' as const, label: 'Renal Transplant (Tacrolimus)' },
                { id: 'hiv-low-cd4' as const, label: 'HIV Patient (CD4 < 200)' },
                { id: 'chemo-patient' as const, label: 'Cancer Chemotherapy' },
              ].map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => setSelectedVaccineProfile(prof.id)}
                  className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                    selectedVaccineProfile === prof.id
                      ? 'bg-teal-950 border-teal-500 text-teal-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {prof.label}
                </button>
              ))}
            </div>

            {/* Verdict Box */}
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <strong className="text-white block mb-0.5">Clinical Recommendation:</strong>
                <p className="text-slate-300">
                  {selectedVaccineProfile === 'healthy-65'
                    ? 'Both vaccines stimulate immunity, but Shingrix is strongly preferred due to superior durability (>90% vs waning).'
                    : 'Zostavax is CONTRAINDICATED (live virus risk). Shingrix is 100% safe, approved, and indicated!'}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded font-mono font-bold shrink-0 ${
                selectedVaccineProfile === 'healthy-65' ? 'bg-teal-950 text-teal-300' : 'bg-emerald-950 text-emerald-300'
              }`}>
                Shingrix Approved
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
