import React, { useState } from 'react';
import { Shield, Sparkles, AlertOctagon, CheckCircle2, Award, Zap } from 'lucide-react';

export const Lec5Visuals: React.FC = () => {
  const [selectedSweetener, setSelectedSweetener] = useState<string>('xylitol');
  const [activeShieldTab, setActiveShieldTab] = useState<'cheese' | 'milk' | 'fats' | 'phytate'>('cheese');

  const sweeteners: Record<string, {
    name: string;
    category: 'Bulk (Caloric)' | 'Intense (Non-Caloric)' | 'Natural Sugar';
    sweetnessMultiplier: number;
    sweetnessLabel: string;
    calories: string;
    cariogenicity: 'Anti-Cariogenic' | 'Non-Cariogenic' | 'Weakly Cariogenic' | 'High Cariogenic';
    safetyNotes: string;
  }> = {
    xylitol: {
      name: 'Xylitol (5-Carbon Polyol)',
      category: 'Bulk (Caloric)',
      sweetnessMultiplier: 100,
      sweetnessLabel: '100% (Equal to Sucrose)',
      calories: '2.4 kcal/g',
      cariogenicity: 'Anti-Cariogenic',
      safetyNotes: 'Gold standard sugar alcohol! S. mutans cannot ferment it; triggers futile metabolic cycle and reduces plaque levels. Safe in adults; laxative at very high doses.'
    },
    sorbitol: {
      name: 'Sorbitol (6-Carbon Polyol)',
      category: 'Bulk (Caloric)',
      sweetnessMultiplier: 50,
      sweetnessLabel: '50% of Sucrose',
      calories: '2.6 kcal/g',
      cariogenicity: 'Non-Cariogenic',
      safetyNotes: 'Negative heat of dissolution gives cooling taste in mints. Oral bacteria ferment it extremely slowly without major pH drop. Caution: osmotic diarrhea in infants <3 yrs.'
    },
    aspartame: {
      name: 'Aspartame (Dipeptide Phe+Asp)',
      category: 'Intense (Non-Caloric)',
      sweetnessMultiplier: 20000,
      sweetnessLabel: '200x Sweeter than Sucrose',
      calories: '0 kcal/g effective',
      cariogenicity: 'Non-Cariogenic',
      safetyNotes: 'Non-fermentable by oral bacteria. Decomposes at high baking temperatures. MANDATORY WARNING: Strictly contraindicated in Phenylketonuria (PKU) patients!'
    },
    saccharin: {
      name: 'Saccharin',
      category: 'Intense (Non-Caloric)',
      sweetnessMultiplier: 30000,
      sweetnessLabel: '300x Sweeter than Sucrose',
      calories: '0 kcal/g',
      cariogenicity: 'Non-Cariogenic',
      safetyNotes: 'First synthetic intense sweetener (1879). Extremely low cost (4% cost of sucrose). Slight bitter metallic aftertaste at >0.1% concentration. Heat stable.'
    },
    acesulfame: {
      name: 'Acesulfame-K',
      category: 'Intense (Non-Caloric)',
      sweetnessMultiplier: 20000,
      sweetnessLabel: '200x Sweeter than Sucrose',
      calories: '0 kcal/g',
      cariogenicity: 'Non-Cariogenic',
      safetyNotes: 'Heat-stable organic salt, rapid clean sweetness onset without lingering aftertaste. Excellent synergy with aspartame in sugar-free beverages.'
    },
    sucrose: {
      name: 'Sucrose (Standard Table Sugar)',
      category: 'Natural Sugar',
      sweetnessMultiplier: 100,
      sweetnessLabel: '100% (Baseline Reference)',
      calories: '4.0 kcal/g',
      cariogenicity: 'High Cariogenic',
      safetyNotes: 'The Arch-Criminal in dental caries. Only substrate capable of synthesizing water-insoluble glucan biofilm slime by S. mutans.'
    }
  };

  const currentSw = sweeteners[selectedSweetener];

  const shieldData = {
    cheese: {
      name: 'Aged Hard Cheese',
      mechanism: 'Abolishes Post-Prandial Plaque pH Drop',
      details: [
        'Eating a piece of cheese immediately after sugary snacks completely stops the Stephan curve pH plunge.',
        'Sharp taste stimulates copious alkaline salivary flow rich in bicarbonate.',
        'High content of protein (casein), calcium, and phosphorus directly saturates the dental plaque fluid, preventing enamel dissolution.',
        'Reduces the viability and quantity of cariogenic S. mutans microorganisms.'
      ]
    },
    milk: {
      name: 'Bovine & Breast Milk',
      mechanism: 'Non-Cariogenic Despite Lactose',
      details: [
        'Cow milk contains lactose (~4-5%), yet epidemiological studies prove it does NOT produce caries.',
        'Casein phosphoproteins adsorb firmly to enamel surfaces, creating a protective protein barrier against bacterial acid penetration.',
        'High natural concentrations of bioavailable calcium and phosphate keep enamel supersaturated.',
        'Suitable as a saliva substitute in xerostomic radiation patients.'
      ]
    },
    fats: {
      name: 'Dietary Lipids & Fatty Acids',
      mechanism: 'Protective Enamel Coating & Glycolysis Blockade',
      details: [
        'Forms a hydrophobic lipid film over enamel, preventing carbohydrates from adhering.',
        'Surrounds dietary sugars, reducing their contact with bacteria and speeding up oral clearance.',
        'Certain unsaturated fatty acids exert a direct antimicrobial effect, inhibiting bacterial glycolysis enzymes.'
      ]
    },
    phytate: {
      name: 'Unrefined Cereal Phytates',
      mechanism: 'Strong Phosphate Adsorption to Enamel',
      details: [
        'Organic phosphates (phytates) in whole-grain bran adsorb tenaciously to enamel crystals, preventing acid dissolution.',
        'However, extracting phytate as an isolated food additive is restricted because it binds calcium, iron, and zinc in the gut, reducing mineral absorption.'
      ]
    }
  };

  const currentShield = shieldData[activeShieldTab];

  return (
    <div className="space-y-6">
      {/* 2D Visual 1: Sweeteners Spectrum & Clinical Characteristics */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EC] gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A24B]" />
              Sweeteners Spectrum: Sweetness, Calories & Safety Warnings
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Bulk polyols (caloric volume) vs Intense sweeteners (non-caloric high potency)
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F3] text-[#1B3A8C] border border-[#C9A24B]/40">
            Biochemical Classification
          </span>
        </div>

        {/* Sweetener Selector Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 my-4">
          {Object.entries(sweeteners).map(([key, sw]) => {
            const isSelected = selectedSweetener === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedSweetener(key)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                    : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
                }`}
              >
                <span className="font-extrabold text-xs block truncate">{sw.name.split(' ')[0]}</span>
                <span className="text-[10px] block opacity-75 mt-0.5">{sw.sweetnessLabel.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Sweetener Card */}
        <div className="bg-[#FAF8F3] rounded-xl p-4 sm:p-5 border border-[#C9A24B]/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-extrabold text-base text-[#0B1F4D]">{currentSw.name}</h4>
              <span className="text-xs font-semibold text-[#1B3A8C]">{currentSw.category}</span>
            </div>
            <div className="flex gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                currentSw.cariogenicity === 'Anti-Cariogenic'
                  ? 'bg-emerald-600 text-white'
                  : currentSw.cariogenicity === 'High Cariogenic'
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {currentSw.cariogenicity}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Relative Sweetness</span>
              <span className="text-sm font-bold text-[#0B1F4D] mt-0.5 block">{currentSw.sweetnessLabel}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Caloric Value</span>
              <span className="text-sm font-bold text-[#1B3A8C] mt-0.5 block">{currentSw.calories}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Primary Use</span>
              <span className="text-xs font-medium text-slate-700 mt-0.5 block">
                {currentSw.category.includes('Bulk') ? 'Chewing gums, confectionery, toothpastes' : 'Diet drinks, table sweetener, dentifrices'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white border border-[#C9A24B]/30 text-xs text-slate-800">
            <strong className="text-[#0B1F4D] block mb-0.5">Clinical Evaluation & Pharmacokinetics:</strong>
            {currentSw.safetyNotes}
          </div>
        </div>
      </div>

      {/* 2D Visual 2: The Cariostatic Food Shield */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E8EC]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#C9A24B]" />
              The Cariostatic Food Shield: Dietary Protective Factors
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Natural food compounds that counteract carbohydrates and inhibit enamel demineralization
            </p>
          </div>
        </div>

        {/* Shield Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
          {(['cheese', 'milk', 'fats', 'phytate'] as const).map(tab => {
            const item = shieldData[tab];
            const isSelected = activeShieldTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveShieldTab(tab)}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                    : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
                }`}
              >
                <span className="font-bold text-xs block">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Shield Content */}
        <div className="bg-[#FAF8F3] p-4 sm:p-5 rounded-xl border border-[#C9A24B]/30 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm sm:text-base text-[#0B1F4D]">{currentShield.name}</h4>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {currentShield.mechanism}
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            {currentShield.details.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#E6E8EC]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
