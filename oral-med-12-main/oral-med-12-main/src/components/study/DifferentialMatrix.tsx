import React, { useState } from 'react';
import { DISEASES_DATA } from '../../data/lectureData';
import { DiseaseId } from '../../types';
import { SplitSquareVertical, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Filter } from 'lucide-react';

export const DifferentialMatrix: React.FC = () => {
  const [selectedDiseases, setSelectedDiseases] = useState<DiseaseId[]>([
    'cmv',
    'coxsackie',
    'nug',
    'em',
    'sjs-ten',
    'pcs',
  ]);

  const toggleDisease = (dId: DiseaseId) => {
    if (selectedDiseases.includes(dId)) {
      if (selectedDiseases.length > 2) {
        setSelectedDiseases(selectedDiseases.filter((id) => id !== dId));
      }
    } else {
      setSelectedDiseases([...selectedDiseases, dId]);
    }
  };

  const matrixCriteria = [
    {
      category: 'Etiology & Inciting Trigger',
      render: (dId: DiseaseId) => {
        switch (dId) {
          case 'cmv':
            return 'HHV-5 (dsDNA enveloped); reactivation in endothelial cells/WBCs. 50–100% adult exposure.';
          case 'coxsackie':
            return 'Single-stranded RNA enteroviruses (CVA and CVB). Fecal-oral & respiratory transmission.';
          case 'nug':
            return 'Polymicrobial fuso-spirochetal complex: Treponema sp., Prevotella intermedia, Fusobacterium nucleatum.';
          case 'em':
            return 'Hypersensitivity reaction triggered by HSV in 65–70% of recurrent cases (1–3 weeks prior) or drugs (NSAIDs).';
          case 'sjs-ten':
            return 'Severe drug hypersensitivity (sulfonamides, anticonvulsants, allopurinol, nevirapine) or Mycoplasma in children.';
          case 'pcs':
            return 'Contact hypersensitivity (cinnamon chewing gum, khat Catha edulis, toothpaste flavorings, mint candies).';
        }
      },
    },
    {
      category: 'Primary Oral Anatomical Sites',
      render: (dId: DiseaseId) => {
        switch (dId) {
          case 'cmv':
            return 'Solitary large ulcer on lateral tongue (often on hairy leukoplakia), buccal mucosa, or palate.';
          case 'coxsackie':
            return 'Herpangina: strictly soft palate, uvula, tonsillar pillars (anterior mouth spared). HFM: tongue, palate, buccal.';
          case 'nug':
            return 'Marginal and interdental gingival papillae (punched-out cratering). Spares non-gingival mucosa unless Noma.';
          case 'em':
            return 'Lips (36%, thick hemorrhagic crusts), buccal mucosa (31%), tongue (22%), labial mucosa (19%). Drooling bloody saliva.';
          case 'sjs-ten':
            return 'Severe multi-mucosal denudation: extensive vermilion hemorrhagic crusts, oral sloughing, ocular, genital.';
          case 'pcs':
            return 'Marginal & attached gingiva (fiery red desquamative band), angular cheilitis, atrophic lips. Can be single tooth (<1cm).';
        }
      },
    },
    {
      category: 'Pathognomonic Sign / Hallmark',
      render: (dId: DiseaseId) => {
        switch (dId) {
          case 'cmv':
            return 'Single deep persistent non-healing ulcer in immunocompromised host; 1/3 coinfected with HSV/VZV.';
          case 'coxsackie':
            return '2–4 mm ulcers in posterior oropharynx with summer peak; or atypical HFM with CVA6 onychomadesis (nail shedding).';
          case 'nug':
            return 'Necrotic "punched-out" cratered interdental papillae with grayish pseudomembrane, fetid malodor & metallic taste.';
          case 'em':
            return 'Concentric 3-zone target / iris lesions on palms/forearms + hemorrhagic crusted bleeding lips.';
          case 'sjs-ten':
            return 'Atypical purpuric flat targets on CHEST/trunk; full-thickness epidermal detachment with positive Nikolsky sign.';
          case 'pcs':
            return 'Fiery scarlet velvety attached gingivitis with bilateral angular cheilitis, clearing after contactant removal.';
        }
      },
    },
    {
      category: 'Cutaneous Findings',
      render: (dId: DiseaseId) => {
        switch (dId) {
          case 'cmv':
            return 'None typical (predominantly internal organ: pneumonitis, retinitis, enteritis).';
          case 'coxsackie':
            return 'Macules & vesicles on hands/feet (palms/soles 75–100%) and buttocks (30%).';
          case 'nug':
            return 'Skin spared unless progressing to Noma (cancrum oris): cone-shaped facial perforation with bone necrosis.';
          case 'em':
            return 'Symmetric target / iris lesions on distal upper extremities moving centripetally to trunk/neck.';
          case 'sjs-ten':
            return 'Chest/trunk purpuric macules; flaccid blisters with sheet-like detachment (<10% SJS, 10-30% Overlap, >30% TEN).';
          case 'pcs':
            return 'No generalized rash. Local perioral angular cheilitis and dry scaling atrophic lips.';
        }
      },
    },
    {
      category: 'Definitive Laboratory Diagnostic Gold Standard',
      render: (dId: DiseaseId) => {
        switch (dId) {
          case 'cmv':
            return 'Biopsy: Cytomegalic endothelial cells with "owl\'s eye" basophilic intranuclear inclusions + quantitative CMV PCR.';
          case 'coxsackie':
            return 'Clinical presentation + Enterovirus real-time RT-PCR for serotyping (CVA6, CVA10, CVA16).';
          case 'nug':
            return 'Gingival smear: Vincent\'s fuso-spirochetal complex (Treponema + Fusobacterium) + mandatory HIV serology screening.';
          case 'em':
            return 'Clinical target lesions + HSV PCR (positive in 71–81% recurrent EM). Biopsy: basal vacuolization & Civatte bodies.';
          case 'sjs-ten':
            return 'Frozen skin biopsy: full-thickness epidermal necrolysis at dermo-epidermal junction with minimal dermal infiltrate.';
          case 'pcs':
            return 'Biopsy: parakeratosis, spongiotic pustules without Candida, dense sheets of polyclonal plasma cells. Eosinophils absent.';
        }
      },
    },
    {
      category: 'First-Line Management Protocol',
      render: (dId: DiseaseId) => {
        switch (dId) {
          case 'cmv':
            return 'IV Ganciclovir 5 mg/kg BID or oral Valganciclovir 900 mg BID (10-fold oral bioavailability). Topical anesthetics.';
          case 'coxsackie':
            return 'Self-limiting (5–10 days). Supportive hydration, antipyretics, oral barrier pain relief, infection isolation.';
          case 'nug':
            return 'Gentle debridement under topical anesthesia + 0.12% Chlorhexidine rinse (>90% resolution). Metronidazole or β-lactams.';
          case 'em':
            return 'Mild: analgesics. Severe: systemic corticosteroids. Recurrent HSV: continuous Acyclovir 400 mg BID / Valacyclovir 500 mg BID.';
          case 'sjs-ten':
            return 'Emergency drug cessation, Burn ICU transfer, fluid resuscitation, IVIG, cyclosporine, systemic steroids, ophthalmology care.';
          case 'pcs':
            return 'Strict identification & elimination of contactant (cinnamon gum, toothpaste); topical/intralesional steroids; 2% fusidic acid.';
        }
      },
    },
    {
      category: 'Prognosis & Critical Board Exam Risks',
      render: (dId: DiseaseId) => {
        switch (dId) {
          case 'cmv':
            return 'Risk of irreversible blindness (CMV retinitis), HSCT pneumonitis (120 days), Guillain-Barré post-renal transplant.';
          case 'coxsackie':
            return 'Excellent (self-limiting). Rare enteroviral meningitis, encephalitis, myopericarditis, or CVB1-linked Type 1 diabetes.';
          case 'nug':
            return 'Prompt recovery with debridement/chlorhexidine. In malnourished/AIDS: Noma progression with 70–90% untreated mortality.';
          case 'em':
            return 'Self-limiting episodes (2–4 weeks). Recurrent EM averages 6 episodes/year for 9.5 years; 20% achieve spontaneous remission.';
          case 'sjs-ten':
            return 'High mortality: SJS 1–5%, TEN 25–35%. Blindness from symblepharon/corneal ulceration, severe sepsis, organ failure.';
          case 'pcs':
            return 'Benign, complete regression upon allergen removal. May need gingivectomy if long-standing fibrotic tissue persists.';
        }
      },
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Matrix Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <span>Clinical Mastery</span>
            <span>·</span>
            <span>Side-by-Side Comparison</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Differential Diagnosis Comparative Matrix</h1>
          <p className="text-xs text-slate-400 mt-1">
            Side-by-side analysis of all 6 lecture entities across etiology, anatomy, pathognomonic signs, and pharmacotherapy.
          </p>
        </div>

        {/* Filter Toggle Badges */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-500 px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Toggle:
          </span>
          {(Object.keys(DISEASES_DATA) as DiseaseId[]).map((dId) => {
            const isChecked = selectedDiseases.includes(dId);
            const d = DISEASES_DATA[dId];
            return (
              <button
                key={dId}
                onClick={() => toggleDisease(dId)}
                style={{
                  borderColor: isChecked ? d.color : 'transparent',
                  backgroundColor: isChecked ? `${d.color}20` : 'transparent',
                }}
                className={`px-2.5 py-1 rounded-lg font-medium border transition-all text-xs flex items-center gap-1.5 ${
                  isChecked ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800">
                <th className="p-4 font-bold text-slate-300 min-w-[200px] sticky left-0 bg-slate-950 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.5)]">
                  Diagnostic Criteria
                </th>
                {selectedDiseases.map((dId) => {
                  const d = DISEASES_DATA[dId];
                  return (
                    <th
                      key={dId}
                      className="p-4 font-bold text-white min-w-[260px] max-w-[320px] border-l border-slate-800/80"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-sm">{d.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal block font-mono">{d.category}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/80">
              {matrixCriteria.map((crit, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`hover:bg-slate-850/50 transition-colors ${
                    rowIdx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/80'
                  }`}
                >
                  <td className="p-4 font-bold text-teal-400 text-xs align-top sticky left-0 bg-slate-950 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.5)]">
                    {crit.category}
                  </td>
                  {selectedDiseases.map((dId) => (
                    <td
                      key={dId}
                      className="p-4 text-slate-300 text-xs leading-relaxed align-top border-l border-slate-800/60"
                    >
                      {crit.render(dId)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
