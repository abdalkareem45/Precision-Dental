import React, { useState } from 'react';
import { Baby, Calendar, ShieldAlert, Award, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export const Lec7Visuals: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<'secretory' | 'mineralization' | 'maturation'>('mineralization');
  const [selectedDeficiency, setSelectedDeficiency] = useState<'vitd' | 'preterm' | 'pem' | 'vitc'>('vitd');

  const phases = {
    secretory: {
      name: '1. Secretory Phase',
      timing: 'Early odontogenesis',
      biology: 'Ameloblasts and odontoblasts actively synthesize and secrete the organic proteinaceous matrix (amelogenins, enamelins, and type I collagen).',
      vulnerability: 'Insults during this phase disrupt matrix volume, causing ENAMEL HYPOPLASIA (thin enamel, pits, grooves, or complete lack of enamel).',
      keyNutrients: 'Protein (essential amino acids), Vitamin A, Vitamin C, Iron, Zinc.'
    },
    mineralization: {
      name: '2. Mineralization Phase',
      timing: 'Mid tooth formation',
      biology: 'Nucleation and linear elongation of hydroxyapatite crystal ribbons within the secreted organic protein scaffold.',
      vulnerability: 'Inadequate calcium or phosphorus supply causes defective crystal lattices and delayed tooth emergence.',
      keyNutrients: 'Calcium, Phosphorus, Magnesium, Vitamin D [1,25(OH)2D3].'
    },
    maturation: {
      name: '3. Maturation Phase',
      timing: 'Pre-eruptive hardening',
      biology: 'Ameloblasts withdraw water and degrade organic protein matrix; massive secondary mineral deposition achieves 96% inorganic density.',
      vulnerability: 'Deficiency here causes ENAMEL HYPOCALCIFICATION (normal enamel thickness, but soft, chalky, opaque, and brittle).',
      keyNutrients: 'Trace fluorides, Calcium homoeostasis, parathyroid hormone (PTH) equilibrium.'
    }
  };

  const deficiencies = {
    vitd: {
      nutrient: 'Vitamin D & Calcium / Phosphorus',
      title: 'Lady May Mellanby Rickets & Enamel Hypoplasia',
      prevalence: 'Historic epidemic solved by cod liver oil & fortified milk',
      clinicalManifestations: [
        '96% of dental enamel is apatite mineral composed of calcium and phosphate.',
        'Lady May Mellanby proved in the 1920s that maternal and infant Vitamin D deficiency causes hypoplastic, pitted, delay-erupting teeth.',
        'Supplementing cod liver oil to pregnant/lactating mothers drastically restored enamel smooth luster and caries resistance.',
        'Chronic childhood diarrhea induces secondary hypocalcemia, creating horizontal hypoplastic defect bands across crowns forming during that period.'
      ]
    },
    preterm: {
      nutrient: 'Preterm Birth & Low Gestational Age',
      title: '3-Fold (3x) Enamel Hypoplasia Surge',
      prevalence: '> 300% risk compared to term infants',
      clinicalManifestations: [
        'Preterm infants miss the crucial third trimester window when 80% of maternal calcium, phosphorus, and magnesium are accumulated.',
        'Immature neonatal kidneys cannot metabolize adequate active 1,25(OH)2D3.',
        'Both primary and permanent dentitions show threefold increased rates of localized enamel hypoplasia.',
        'Delayed dental development and altered eruption chronological milestones.'
      ]
    },
    pem: {
      nutrient: 'Protein-Energy Malnutrition (PEM)',
      title: 'Stunting, Wasting & Salivary Gland Atrophy',
      prevalence: 'Common in developing countries & severe illnesses',
      clinicalManifestations: [
        'Stunting (deficient height-for-age) & Wasting (deficient weight-for-height).',
        'Marginal protein deficiency during pre-eruptive windows permanently atrophies acinar architecture in parotid and submandibular glands.',
        'Drastic decrease in stimulated salivary flow rate and protective antimicrobial proteins (sIgA, lysozyme, lactoferrin).',
        'Severe delay in deciduous tooth shedding and permanent tooth eruption.'
      ]
    },
    vitc: {
      nutrient: 'Vitamin C (Ascorbic Acid)',
      title: 'Defective Collagen Hydroxylation & Scurvy',
      prevalence: 'Severe citrus / vegetable restriction',
      clinicalManifestations: [
        'Ascorbic acid is a required cofactor for prolyl and lysyl hydroxylase in collagen synthesis.',
        'Defects impair dentin matrix formation and periodontal ligament attachment.',
        'Spontaneous gingival hemorrhage, loose teeth, delayed extraction socket wound healing, and Scorbutic gingival enlargement.'
      ]
    }
  };

  const currentPhase = phases[selectedPhase];
  const currentDef = deficiencies[selectedDeficiency];

  return (
    <div className="space-y-6">
      {/* 2D Visual 1: Critical Developmental Phases */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EC] gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C9A24B]" />
              Tooth Organogenesis: The 3 Critical Developmental Windows
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Enamel Hypoplasia (Secretory matrix defect) vs Hypocalcification (Maturation defect)
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F3] text-[#1B3A8C] border border-[#C9A24B]/40">
            Critical Periods
          </span>
        </div>

        {/* Phase Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {(['secretory', 'mineralization', 'maturation'] as const).map(key => {
            const p = phases[key];
            const isSelected = selectedPhase === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedPhase(key)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                    : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
                }`}
              >
                <span className="font-extrabold text-xs block">{p.name}</span>
                <span className="text-[10px] block opacity-80 mt-0.5">{p.timing}</span>
              </button>
            );
          })}
        </div>

        {/* Phase Breakdown Card */}
        <div className="bg-[#FAF8F3] p-4 sm:p-5 rounded-xl border border-[#C9A24B]/30 space-y-3">
          <h4 className="font-bold text-sm sm:text-base text-[#0B1F4D]">{currentPhase.name}</h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-[#0B1F4D]">Histological Biology:</strong> {currentPhase.biology}
          </p>
          <div className="p-3 bg-white rounded-lg border border-red-200 text-xs text-red-950">
            <strong className="text-red-700 block mb-0.5">Nutritional Insult Pathology:</strong>
            {currentPhase.vulnerability}
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#E6E8EC] text-xs text-slate-800">
            <strong className="text-[#1B3A8C] block mb-0.5">Key Required Micronutrients:</strong>
            {currentPhase.keyNutrients}
          </div>
        </div>
      </div>

      {/* 2D Visual 2: Nutritional Deficiency Diagnostic Matrix */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E8EC]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#C9A24B]" />
              Nutritional Deficiency & Pediatric Enamel Pathology Matrix
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Review evidence-based structural defects and systemic oral manifestations
            </p>
          </div>
        </div>

        {/* Deficiency Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
          {(['vitd', 'preterm', 'pem', 'vitc'] as const).map(key => {
            const item = deficiencies[key];
            const isSelected = selectedDeficiency === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedDeficiency(key)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                    : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
                }`}
              >
                <span className="font-extrabold text-xs block truncate">{item.nutrient.split(' ')[0]}</span>
                <span className="text-[10px] block opacity-75 truncate mt-0.5">{item.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Deficiency Findings */}
        <div className="bg-[#FAF8F3] p-4 sm:p-5 rounded-xl border border-[#C9A24B]/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="font-extrabold text-sm sm:text-base text-[#0B1F4D]">{currentDef.title}</h4>
            <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full self-start sm:self-center">
              {currentDef.prevalence}
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            {currentDef.clinicalManifestations.map((m, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#E6E8EC]">
                <CheckCircle2 className="w-4 h-4 text-[#1B3A8C] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
