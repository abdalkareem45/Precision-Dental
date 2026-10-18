import React, { useState } from 'react';
import { Pill, Activity, AlertTriangle, CheckCircle, Calculator, Clock, Sparkles } from 'lucide-react';

export const TreatmentPlanningSandbox: React.FC = () => {
  const [patientWeightKg, setPatientWeightKg] = useState<number>(70);
  const [patientAge, setPatientAge] = useState<number>(38);
  const [selectedDisease, setSelectedDisease] = useState<'cmv' | 'nug' | 'em' | 'sjs' | 'pcs'>('cmv');
  const [selectedDrug, setSelectedDrug] = useState<string>('valganciclovir');
  const [hasRenalImpairment, setHasRenalImpairment] = useState<boolean>(false);
  const [concomitantMed, setConcomitantMed] = useState<string>('none');

  // Dosage computations
  const ganciclovirIVDose = patientWeightKg * 5; // 5 mg/kg IV BID
  const ganciclovirAdjusted = hasRenalImpairment ? ganciclovirIVDose * 0.5 : ganciclovirIVDose;
  const valganciclovirDose = hasRenalImpairment ? 450 : 900; // 900 mg BID vs renally adjusted 450 mg

  const checkDrugInteraction = () => {
    if (selectedDrug === 'valganciclovir' && concomitantMed === 'zidovudine') {
      return {
        severity: 'severe',
        message: 'Severe bone marrow suppression & neutropenia risk when combining Ganciclovir/Valganciclovir with Zidovudine (AZT). Monitor CBC weekly or substitute ART.',
      };
    }
    if (selectedDrug === 'azathioprine' && concomitantMed === 'allopurinol') {
      return {
        severity: 'contraindicated',
        message: 'Lethal Toxicity Risk: Allopurinol inhibits xanthine oxidase, leading to massive 4-fold accumulation of 6-mercaptopurine/azathioprine and fatal pancytopenia. Reduce azathioprine dose by 75% or avoid.',
      };
    }
    if (selectedDrug === 'prednisone' && selectedDisease === 'nug') {
      return {
        severity: 'contraindicated',
        message: 'Contraindicated: Systemic corticosteroids in active fuso-spirochetal necrotizing infection (NUG) can precipitate rapid bone necrosis and progression to Noma (cancrum oris).',
      };
    }
    return {
      severity: 'safe',
      message: 'No major pharmacokinetic contraindication detected for this clinical protocol.',
    };
  };

  const interaction = checkDrugInteraction();

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <span>Sandbox 3</span>
            <span>·</span>
            <span>Clinical Pharmacotherapy</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Treatment Planning & Pharmacology Sandbox</h1>
          <p className="text-xs text-slate-400 mt-1">
            Calculate weight-based dosages, compare prodrug bioavailability curves, and check drug-drug interactions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient Profile & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-400" />
              <span>Patient Parameters & Clinical Profile</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Select Target Disease Condition:</label>
                <select
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="cmv">Cytomegalovirus (CMV) Deep Oral Ulcer</option>
                  <option value="nug">Necrotizing Ulcerative Gingivitis (NUG / NUP)</option>
                  <option value="em">Erythema Multiforme (Recurrent HSV / Drug)</option>
                  <option value="sjs">Stevens-Johnson Syndrome / TEN Overlap</option>
                  <option value="pcs">Plasma Cell Stomatitis / Gingivitis</option>
                </select>
              </div>

              {/* Weight Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 font-medium">Patient Body Weight:</span>
                  <span className="font-mono text-teal-400 font-bold text-sm">{patientWeightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="130"
                  value={patientWeightKg}
                  onChange={(e) => setPatientWeightKg(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>

              {/* Patient Age */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 font-medium">Patient Age:</span>
                  <span className="font-mono text-slate-200 font-bold">{patientAge} years</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="85"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>

              {/* Renal Function & Comorbidity Toggles */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasRenalImpairment}
                    onChange={(e) => setHasRenalImpairment(e.target.checked)}
                    className="rounded accent-teal-400"
                  />
                  <span>Renal Impairment (CrCl &lt; 50 mL/min - requires dose adjustment)</span>
                </label>
              </div>

              {/* Concomitant Medications */}
              <div>
                <label className="text-slate-400 font-medium block mb-1">Concomitant Home Medication:</label>
                <select
                  value={concomitantMed}
                  onChange={(e) => setConcomitantMed(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="none">None (No other active medications)</option>
                  <option value="zidovudine">Zidovudine (AZT) - HIV therapy</option>
                  <option value="allopurinol">Allopurinol - Chronic gout therapy</option>
                  <option value="carbamazepine">Carbamazepine - Anticonvulsant</option>
                </select>
              </div>
            </div>
          </div>

          {/* Drug Selection Deck */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-400" />
              <span>Select Therapeutic Agent</span>
            </h3>

            <div className="grid grid-cols-1 gap-2 text-xs">
              {[
                { id: 'valganciclovir', name: 'Valganciclovir (Oral prodrug)', ind: 'CMV' },
                { id: 'ganciclovir', name: 'Ganciclovir (IV formulation)', ind: 'CMV' },
                { id: 'chlorhexidine', name: '0.12% Chlorhexidine Mouthrinse', ind: 'NUG/NUP' },
                { id: 'metronidazole', name: 'Metronidazole 500mg TID', ind: 'NUG' },
                { id: 'acyclovir', name: 'Continuous Acyclovir 400mg BID', ind: 'Recurrent EM' },
                { id: 'azathioprine', name: 'Azathioprine 100–150mg/d', ind: 'Non-HSV EM' },
                { id: 'triamcinolone', name: 'Intralesional Triamcinolone', ind: 'PCS' },
              ].map((drug) => (
                <button
                  key={drug.id}
                  onClick={() => setSelectedDrug(drug.id)}
                  className={`p-2.5 rounded-lg text-left transition-all border flex items-center justify-between ${
                    selectedDrug === drug.id
                      ? 'bg-teal-950/80 border-teal-500 text-teal-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{drug.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{drug.ind}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Dosages & Pharmacokinetics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dose Output Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                <span>Calculated Pharmacologic Regimen</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Lecture 2 Clinical Guidelines</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Standard Lecture Dose:</span>
                <div className="font-mono text-xl font-bold text-teal-400">
                  {selectedDrug === 'valganciclovir' && '900 mg PO BID'}
                  {selectedDrug === 'ganciclovir' && `${ganciclovirIVDose} mg IV BID`}
                  {selectedDrug === 'chlorhexidine' && '15 mL rinse BID x 30s'}
                  {selectedDrug === 'metronidazole' && '500 mg PO TID x 7d'}
                  {selectedDrug === 'acyclovir' && '400 mg PO BID continuous'}
                  {selectedDrug === 'azathioprine' && '100–150 mg PO daily'}
                  {selectedDrug === 'triamcinolone' && '10–40 mg/mL intralesional'}
                </div>
                <span className="text-xs text-slate-400 block pt-1">
                  {selectedDrug === 'valganciclovir' && 'Oral valine ester prodrug of ganciclovir'}
                  {selectedDrug === 'ganciclovir' && `Calculated at 5 mg/kg for ${patientWeightKg} kg body mass`}
                  {selectedDrug === 'chlorhexidine' && '>90% clinical resolution rate in acute NUG'}
                  {selectedDrug === 'metronidazole' && 'Targets anaerobic gram-negative fuso-spirochetes'}
                  {selectedDrug === 'acyclovir' && 'Suppresses recurrent HSV-associated Erythema Multiforme'}
                  {selectedDrug === 'azathioprine' && 'Effective for non-HSV associated recurrent EM'}
                  {selectedDrug === 'triamcinolone' && 'Localized refractory gingival plasma cell stomatitis'}
                </span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Renal-Adjusted Regimen:</span>
                <div className="font-mono text-xl font-bold text-sky-400">
                  {hasRenalImpairment ? (
                    selectedDrug === 'ganciclovir'
                      ? `${ganciclovirAdjusted} mg IV BID`
                      : selectedDrug === 'valganciclovir'
                      ? '450 mg PO BID'
                      : 'Standard Dose'
                  ) : (
                    'Normal (No dose adjustment needed)'
                  )}
                </div>
                <span className="text-xs text-slate-400 block pt-1">
                  {hasRenalImpairment
                    ? 'Dose reduced by 50% to prevent neurotoxicity & bone marrow suppression'
                    : 'Creatinine clearance estimated > 60 mL/min'}
                </span>
              </div>
            </div>

            {/* Drug Interaction Alert */}
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                interaction.severity === 'contraindicated'
                  ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                  : interaction.severity === 'severe'
                  ? 'bg-amber-950/80 border-amber-600 text-amber-200'
                  : 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200'
              }`}
            >
              {interaction.severity === 'safe' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold text-sm block mb-0.5">
                  {interaction.severity === 'safe'
                    ? 'Regimen Safety Cleared'
                    : interaction.severity === 'contraindicated'
                    ? 'Black Box Contraindication Detected!'
                    : 'Clinical Precaution Alert'}
                </span>
                <p className="text-slate-300">{interaction.message}</p>
              </div>
            </div>
          </div>

          {/* Prodrug Bioavailability Visualizer: Ganciclovir vs Valganciclovir */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Bioavailability Comparison: Ganciclovir vs Valganciclovir (Slide 5)</span>
              </h3>
              <span className="text-xs font-mono text-teal-400 font-bold">~10-Fold Higher AUC</span>
            </div>

            {/* SVG Bioavailability Area Chart */}
            <div className="w-full h-44 bg-slate-950 rounded-xl p-3 border border-slate-800 relative">
              <svg viewBox="0 0 400 130" className="w-full h-full">
                {/* Axes */}
                <line x1="40" y1="10" x2="40" y2="105" stroke="#334155" strokeWidth="1.5" />
                <line x1="40" y1="105" x2="380" y2="105" stroke="#334155" strokeWidth="1.5" />

                {/* Y-axis labels */}
                <text x="32" y="20" fill="#64748b" fontSize="8" textAnchor="end">100%</text>
                <text x="32" y="60" fill="#64748b" fontSize="8" textAnchor="end">50%</text>
                <text x="32" y="105" fill="#64748b" fontSize="8" textAnchor="end">0%</text>

                {/* X-axis labels */}
                <text x="40" y="118" fill="#64748b" fontSize="8">0h</text>
                <text x="120" y="118" fill="#64748b" fontSize="8">2h</text>
                <text x="210" y="118" fill="#64748b" fontSize="8">6h</text>
                <text x="300" y="118" fill="#64748b" fontSize="8">12h</text>

                {/* Oral Ganciclovir Curve (Poor ~6% bioavailability) */}
                <path
                  d="M 40,105 Q 100,92 180,98 Q 280,103 370,105"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />

                {/* Valganciclovir Prodrug Curve (~60% bioavailability - 10-fold) */}
                <path
                  d="M 40,105 Q 110,25 200,45 Q 290,75 370,100"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3"
                />
                <path
                  d="M 40,105 Q 110,25 200,45 Q 290,75 370,100 L 370,105 L 40,105 Z"
                  fill="#0284c7"
                  opacity="0.15"
                />
              </svg>

              {/* Legend */}
              <div className="absolute top-3 right-4 flex flex-col gap-1 text-[10px] font-mono">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <span className="w-3 h-0.5 bg-sky-400 rounded" /> Valganciclovir 900mg (AUC ~60%)
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-3 h-0.5 bg-rose-400 rounded" /> Oral Ganciclovir (AUC ~6%)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Valganciclovir is an L-valyl ester prodrug hydrolyzed by intestinal and hepatic esterases into active ganciclovir, delivering serum systemic drug exposure comparable to intravenous ganciclovir infusion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
