import React, { useState } from 'react';
import {
  User,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Scissors,
  Sparkles,
  ChevronRight,
  Info,
  Layers,
  Compass,
  Ruler,
  ShieldAlert
} from 'lucide-react';

interface CaseScenario {
  id: string;
  title: string;
  patientAgeGender: string;
  chiefComplaint: string;
  clinicalExam: string[];
  radiographicExam: string[];
  vitalityResult: string;
  targetTooth: string;
  diagnosis: string;
  hampGrade: string;
  cepStatus: string;
  prognosis: string;
  treatmentSteps: {
    phase: string;
    action: string;
    rationale: string;
  }[];
  criticalLearningPearl: string;
}

export const FurcationCases: React.FC = () => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [revealedSteps, setRevealedSteps] = useState<Record<number, boolean>>({});

  const cases: CaseScenario[] = [
    {
      id: 'case_1',
      title: 'Case 1: Mandibular Molar with Class II Furcation & Grade II CEP',
      patientAgeGender: '48-year-old male',
      chiefComplaint: '"Food catches on the lower left molar and the gum bleeds when I floss."',
      targetTooth: 'Tooth #36 (Mandibular Left 1st Molar)',
      clinicalExam: [
        'Probing depth 6 mm on mid-buccal surface with bleeding on probing (BOP +).',
        'Curved Nabers probe catches at furcation entrance and penetrates horizontally 4.5 mm into a cul-de-sac.',
        'Lingual furcation probe penetration is only 1.5 mm (Class I).',
        'Visible enamel projection extending towards the furcation entrance without horizontal component.'
      ],
      radiographicExam: [
        'Vertical bitewing reveals moderate horizontal bone loss with a discrete triangular radiolucency at the buccal furcation fornix.',
        'Divergent mesial and distal roots with adequate interradicular dimension.'
      ],
      vitalityResult: 'Positive (+) to cold and electric pulp test (Vital Pulp).',
      diagnosis: 'Localized Generalized Stage III Periodontitis with Hamp Class II Buccal Furcation Involvement and Masters & Hoskins Grade II Cervical Enamel Projection (CEP).',
      hampGrade: 'Class II (Partial horizontal invasion >1/3 width, cul-de-sac)',
      cepStatus: 'Grade II (Approaches entrance, no horizontal entry)',
      prognosis: 'Good to Fair (Mandibular molar with divergent roots permits direct buccal debridement and regenerative flap surgery).',
      treatmentSteps: [
        {
          phase: 'Step 1: Biofilm Control & Risk Factor Cessation',
          action: 'Oral hygiene instruction (interdental brush angled into buccal furca) + Supragingival PMPR.',
          rationale: 'Plaque biofilm is the primary initiating factor. Controlling infection stops further progression.'
        },
        {
          phase: 'Step 2: Subgingival Instrumentation & Odontoplasty',
          action: 'Meticulous subgingival instrumentation with mini-curettes & ultrasonic furcation tips. Odontoplasty of Grade II CEP with fine diamond bur.',
          rationale: 'Enamel projection prevents connective tissue attachment and harbors biofilm. Eliminating the enamel spur facilitates pocket resolution.'
        },
        {
          phase: 'Step 3: Surgical Access & Regeneration (if residual pocket ≥6mm)',
          action: 'Elevate full-thickness mucoperiosteal flap, debride furcation roof, and place bone graft + collagen membrane (GTR).',
          rationale: 'Class II mandibular furcations are prime candidates for guided tissue regeneration (GTR).'
        },
        {
          phase: 'Step 4: Supportive Periodontal Care (SPC)',
          action: '3-month recall intervals with dedicated furcation maintenance.',
          rationale: 'Prevents recurrent biofilm accumulation in complex root anatomy.'
        }
      ],
      criticalLearningPearl: 'Mandibular molars have divergent roots and open buccally/lingually, giving them the best prognosis among furcation-involved teeth. Grade II CEPs must be recontoured (odontoplasty).'
    },
    {
      id: 'case_2',
      title: 'Case 2: The Maxillary Molar Radiographic Trap (Mesial Palatal Approach)',
      patientAgeGender: '54-year-old female',
      chiefComplaint: '"Dull aching sensation around my upper right back tooth after eating."',
      targetTooth: 'Tooth #16 (Maxillary Right 1st Molar)',
      clinicalExam: [
        'Probing depth on mid-buccal is 3 mm (Normal sulcus). Buccal furcation is closed.',
        'Probing mesially from BUCCAL aspect gives 3.5 mm (probe blocked by mesiobuccal root).',
        'Probing mesially from PALATAL aspect using a curved Nabers probe slides into an 8 mm pocket and penetrates 5 mm into the mesial furcation fornix (Hamp Class II).',
        'Distal furcation is intact (2 mm).'
      ],
      radiographicExam: [
        'Periapical radiograph shows intact bone height on buccal and distal contours.',
        'The palatal root is super-imposed over the furcation area, concealing the mesial furcation bone defect!'
      ],
      vitalityResult: 'Positive (+) (Vital pulp).',
      diagnosis: 'Generalized Stage III Periodontitis with Hidden Mesial Furcation Involvement (Hamp Class II), detected exclusively via Palatal Probing.',
      hampGrade: 'Class II Mesial Furcation (Probed from Palatal)',
      cepStatus: 'None',
      prognosis: 'Guarded / Fair (Maxillary trifurcation with proximal access difficulty complicates plaque control).',
      treatmentSteps: [
        {
          phase: 'Step 1: Clinical Recognition of the Palatal Route',
          action: 'Educate patient to insert angled interdental brushes from the palatal embrasure, not buccal.',
          rationale: 'Mesial furcation entrance is located two-thirds toward the palate.'
        },
        {
          phase: 'Step 2: Subgingival Debridement via Palatal Access',
          action: 'Instrument mesial furcation fornix using curved Gracey 11/12 and 13/14 curettes strictly from the palatal approach.',
          rationale: 'Buccal approach cannot clear biofilm beneath the mesiobuccal root contour.'
        },
        {
          phase: 'Step 3: Surgical Flap Reflection',
          action: 'Palatal flap elevation for direct visualization and root debridement or resective osteoplasty.',
          rationale: 'Palatal tissue is non-elastic masticatory mucosa requiring beveled incisions.'
        }
      ],
      criticalLearningPearl: 'Radiographs of maxillary molars are often misleading because the dense palatal root superimposes over the furcation. Always probe the mesial furcation from the PALATAL aspect!'
    },
    {
      id: 'case_3',
      title: 'Case 3: Endo-Perio Differential Diagnosis (Accessory Furcation Canal)',
      patientAgeGender: '39-year-old male',
      chiefComplaint: '"Mild throbbing pressure in my lower right jaw; feels raised when biting."',
      targetTooth: 'Tooth #46 (Mandibular Right 1st Molar)',
      clinicalExam: [
        'Large deep composite restoration on occlusal-distal surface.',
        'Mild sensitivity to vertical percussion.',
        'Narrow 7 mm solitary probing depth on mid-buccal that enters the furcation fornix.',
        'Adjacent teeth have shallow sulci (1–2 mm) and zero attachment loss.'
      ],
      radiographicExam: [
        'Well-demarcated circular radiolucency restricted entirely to the inter-radicular space between mesial and distal roots (Fig. 12).',
        'Periapical area of mesial root exhibits early widening of PDL.'
      ],
      vitalityResult: 'NEGATIVE (-) to cold and electric pulp test (Necrotic Pulp).',
      diagnosis: 'Primary Endodontic Lesion with Drainage through Accessory Pulp Canals into the Furcation Fornix (Endo-Perio Communication).',
      hampGrade: 'Endodontic Pseudo-Furcation Defect',
      cepStatus: 'None',
      prognosis: 'Excellent if Endodontic Therapy is Performed Promptly.',
      treatmentSteps: [
        {
          phase: 'Step 1: Immediate Endodontic Therapy (Root Canal Treatment)',
          action: 'Complete RCT with meticulous disinfection and warm vertical condensation of gutta-percha to seal accessory canals.',
          rationale: 'Dr. Maha Shukri Rule: "If the tooth is non-vital, proper endodontic treatment must ALWAYS precede periodontal therapy. In fact, endodontic therapy may resolve the lesion, and the furcation defect will disappear!"'
        },
        {
          phase: 'Step 2: 3-Month Radiographic Re-evaluation',
          action: 'Re-take parallel periapical radiograph before initiating any invasive periodontal surgery.',
          rationale: 'In primary endodontic lesions, sealing the pulpal infection triggers spontaneous bone regeneration in the furcation fornix without periodontal surgery.'
        }
      ],
      criticalLearningPearl: 'Always test vitality before treating any furcation radiolucency. If non-vital, perform RCT first — the furcation defect often heals and disappears completely without periodontal surgery!'
    },
    {
      id: 'case_4',
      title: 'Case 4: Trauma from Occlusion (Mobility & Radiolucency with Intact Sulcus)',
      patientAgeGender: '32-year-old female',
      chiefComplaint: '"My lower left back tooth feels loose and aches when I wake up in the morning."',
      targetTooth: 'Tooth #19 (Mandibular Left 1st Molar)',
      clinicalExam: [
        'Miller Grade 2 tooth mobility with noticeable fremitus upon maximum intercuspation.',
        'Obvious shiny wear facets on buccal cusps indicating nocturnal bruxism.',
        'PROBING RESULTS: Thorough probing with Nabers probe shows healthy 1.5–2 mm sulcus around the entire circumference. The furcation entrance cannot be entered!',
        'No bleeding on probing (BOP -).'
      ],
      radiographicExam: [
        'Prominent radiolucency and generalized PDL widening throughout the interradicular furcation area.',
        'Interproximal crestal bone height is normal (within 1.5 mm of CEJ).'
      ],
      vitalityResult: 'Positive (+) (Vital pulp).',
      diagnosis: 'Trauma from Occlusion (TFO) Adaptation of the Periodontal Ligament without Periodontal Furcation Involvement.',
      hampGrade: 'No Furcation Invasion (Sulcus Intact)',
      cepStatus: 'None',
      prognosis: 'Excellent once occlusal overload is neutralized.',
      treatmentSteps: [
        {
          phase: 'Step 1: Occlusal Adjustment (Coronoplasty)',
          action: 'Eliminate premature contacts in centric relation and lateral excursions using articulating paper and fine burs.',
          rationale: 'Dr. Maha Shukri Rule: "Forces elicited by occlusal interferences cause adaptation within the interradicular area. Probing fails to detect furcation involvement. Occlusal adjustment must always precede periodontal therapy."'
        },
        {
          phase: 'Step 2: Hard Acrylic Occlusal Splint (Nightguard)',
          action: 'Fabricate custom maxillary stabilization splint for nocturnal wear.',
          rationale: 'Distributes bruxing forces across the dental arch and protects PDL.'
        },
        {
          phase: 'Step 3: 6-Week Re-evaluation',
          action: 'Re-test mobility and verify radiographic resolution of interradicular radiolucency.',
          rationale: 'Once trauma is removed, the widened PDL space normalizes and mobility returns to Miller Class 0.'
        }
      ],
      criticalLearningPearl: 'TFO causes mobility and interradicular radiolucency on x-rays, BUT Nabers probing fails to detect any pocket. Occlusal adjustment is curative; periodontal surgery is contraindicated!'
    }
  ];

  const currentCase = cases[selectedCaseIndex];

  const toggleStep = (idx: number) => {
    setRevealedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Case Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {cases.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCaseIndex(idx);
              setRevealedSteps({});
            }}
            className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
              selectedCaseIndex === idx
                ? 'bg-[#18357a] border-[#C9A24B] ring-2 ring-[#C9A24B]/60 shadow-lg'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className={`w-6 h-6 rounded-lg font-mono font-black text-xs flex items-center justify-center shrink-0 ${
              selectedCaseIndex === idx ? 'bg-[#C9A24B] text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
            }`}>
              {idx + 1}
            </span>
            <div className="min-w-0">
              <h4 className={`text-xs font-bold truncate ${selectedCaseIndex === idx ? 'text-white' : 'text-slate-300'}`}>
                {c.title.split(':')[0]}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                {c.targetTooth}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Case Main Card */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C9A24B] text-slate-950 uppercase tracking-wider">
                Case Scenario {selectedCaseIndex + 1}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentCase.patientAgeGender} • {currentCase.targetTooth}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white mt-1">
              {currentCase.title}
            </h3>
            <p className="text-xs sm:text-sm text-cyan-300 italic mt-0.5">
              Chief Complaint: {currentCase.chiefComplaint}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-2xl shrink-0 text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Vitality Status:</span>
            <span className={`text-xs font-black font-mono ${
              currentCase.vitalityResult.includes('Negative') ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {currentCase.vitalityResult}
            </span>
          </div>
        </div>

        {/* Clinical vs Radiographic Findings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Clinical Examination */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-400 flex items-center gap-1.5 uppercase font-mono tracking-wider text-[11px]">
              <Stethoscope className="w-4 h-4" /> Clinical Examination &amp; Probing
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {currentCase.clinicalExam.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Radiographic Examination */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-[#C9A24B] flex items-center gap-1.5 uppercase font-mono tracking-wider text-[11px]">
              <Layers className="w-4 h-4" /> Radiographic Analysis
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {currentCase.radiographicExam.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Diagnosis & Classification Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Furcation Grade:</span>
            <span className="font-bold text-white text-xs">{currentCase.hampGrade}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">CEP Classification:</span>
            <span className="font-bold text-purple-300 text-xs">{currentCase.cepStatus}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Tooth Prognosis:</span>
            <span className="font-bold text-emerald-400 text-xs">{currentCase.prognosis}</span>
          </div>
        </div>

        {/* Stepwise Treatment Plan Workflow */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
            <Scissors className="w-4 h-4 text-emerald-400" />
            <span>Stepwise Clinical Management Sequence:</span>
          </h4>

          <div className="space-y-2">
            {currentCase.treatmentSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-1.5 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#C9A24B]">
                    {step.phase}
                  </span>
                  <button
                    onClick={() => toggleStep(idx)}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold font-mono"
                  >
                    {revealedSteps[idx] ? 'Hide Rationale' : 'Why this sequence?'}
                  </button>
                </div>
                <p className="text-xs text-white font-medium">
                  {step.action}
                </p>
                {revealedSteps[idx] && (
                  <div className="pt-1.5 text-[11px] text-slate-400 border-t border-slate-800 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{step.rationale}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* High-Yield Learning Pearl */}
        <div className="bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/40 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-black text-[#C9A24B] uppercase tracking-wider block">
              University of Baghdad Board Examination Pearl:
            </span>
            <p className="text-slate-200 leading-relaxed">
              {currentCase.criticalLearningPearl}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
