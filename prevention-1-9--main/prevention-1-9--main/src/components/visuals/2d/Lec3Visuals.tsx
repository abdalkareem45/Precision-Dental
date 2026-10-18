import React, { useState } from 'react';
import { Layers, Zap, Wind, Droplets, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';

export const Lec3Visuals: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<'air' | 'laser' | 'cmcr' | 'prr'>('air');
  const [tissueLayer, setTissueLayer] = useState<'infected' | 'demineralized'>('infected');

  const techData = {
    air: {
      name: 'Air Abrasion',
      icon: Wind,
      principle: 'Pressurized micro-particles of aluminum oxide (27-50 microns) accurately abrade enamel and dentin kinetics without heat or vibration.',
      anesthesiaRequired: 'Rarely (No vibration or heat generation)',
      cavityContour: 'Smooth, rounded internal line angles (reduces stress concentration)',
      advantage: 'Painless, highly accepted by pediatric and needle-phobic patients, preserves healthy sound dentin.',
      disadvantage: 'Ablasts softer dentin faster than hard enamel, creating potential enamel overhangs requiring hand trimming.',
      contraindications: 'Severe asthma, COPD, severe dust allergy, open oral wounds/recent extractions, subgingival caries.'
    },
    laser: {
      name: 'Hydrokinetic Dental LASER (Er:YAG)',
      icon: Zap,
      principle: 'Pulsed laser light absorbed by water molecules within hard tissues causes micro-explosive vaporization (hydrokinetic ablation).',
      anesthesiaRequired: 'Usually unnecessary',
      cavityContour: 'Micro-retentive, clean, smear-layer free surface ready for bonding',
      advantage: 'Precise selective ablation, non-vibrating, odorless, simultaneously seals dentinal tubules preventing postoperative hypersensitivity.',
      disadvantage: 'Bulky expensive equipment, lack of tactile feedback through handpiece.',
      contraindications: 'Limited in removing existing metallic amalgam restorations.'
    },
    cmcr: {
      name: 'Chemo-Mechanical Caries Removal (CMCR)',
      icon: Droplets,
      principle: 'Chemical agents (chlorinated amino acids / Papain enzymes) selectively dissolve denatured collagen in necrotic dentin in ~30 seconds.',
      anesthesiaRequired: 'None',
      cavityContour: 'Confined strictly to infected zone, leaves sound collagen untouched',
      advantage: 'Completely noiseless, zero vibration, removes smear layer, reinforces adhesive bond, ideal for needle-phobic and pediatric patients.',
      disadvantage: 'Slower procedure than rotary turbine; requires hand instruments (spoon excavators) to scoop softened debris.',
      contraindications: 'Difficult access to narrow proximal fissures without prior mechanical entry.'
    },
    prr: {
      name: 'Preventive Resin Restoration (PRR)',
      icon: Sparkles,
      principle: 'Hybrid therapy: Removes only the localized infected pit lesion, restores with composite resin, then seals the entire remaining sound fissure system.',
      anesthesiaRequired: 'Minimal or none',
      cavityContour: 'Micro-cavity preparation confined to specific fissure defect',
      advantage: 'Eliminates G.V. Black extension for prevention; preserves 90%+ healthy tooth structure; stops micro-leakage.',
      disadvantage: 'Technique-sensitive bonding requiring meticulous moisture isolation.',
      contraindications: 'Large open frank cavitated carious lesions involving multiple surfaces.'
    }
  };

  const currentTech = techData[selectedTech];

  return (
    <div className="space-y-6">
      {/* 2D Visual 1: Cavity 2-Layer Cross-Section Anatomy */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EC] gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#C9A24B]" />
              The Two-Layer Cavity Biology: Infected vs Demineralized Dentin
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              The cornerstone of Minimal Intervention Dentistry: Selective surgical intervention
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F3] text-[#1B3A8C] border border-[#C9A24B]/40">
            Histological Distinction
          </span>
        </div>

        {/* Layer Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <button
            onClick={() => setTissueLayer('infected')}
            className={`p-4 rounded-xl border text-left transition-all ${
              tissueLayer === 'infected'
                ? 'bg-amber-950 text-white shadow-md border-transparent ring-2 ring-red-500'
                : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border-[#E6E8EC]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm">1. Outer Infected Layer</span>
              <span className="text-[10px] uppercase font-bold bg-red-600 text-white px-2 py-0.5 rounded-md">
                MUST REMOVE
              </span>
            </div>
            <p className="text-xs opacity-80 mt-1 leading-snug">
              Completely denatured, necrotic collagen scaffold colonized by dense bacteria.
            </p>
          </button>

          <button
            onClick={() => setTissueLayer('demineralized')}
            className={`p-4 rounded-xl border text-left transition-all ${
              tissueLayer === 'demineralized'
                ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm">2. Inner Demineralized Layer</span>
              <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                PRESERVE & SEAL
              </span>
            </div>
            <p className="text-xs opacity-80 mt-1 leading-snug">
              Demineralized but collagen scaffold is INTACT. Precarious state capable of remineralization!
            </p>
          </button>
        </div>

        {/* Detailed Comparison Table / Infographic */}
        <div className="bg-[#FAF8F3] rounded-xl p-4 sm:p-5 border border-[#C9A24B]/30">
          {tissueLayer === 'infected' ? (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                <XCircle className="w-5 h-5 shrink-0" />
                Infected Layer Properties & Clinical Handling
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
                  <strong className="text-[#0B1F4D] block mb-1">Collagen Matrix:</strong>
                  Irreversibly degraded, cross-links enzymatically severed. Cannot act as a template for crystal regrowth.
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
                  <strong className="text-[#0B1F4D] block mb-1">Microbiology:</strong>
                  Heavily colonized with viable acidogenic microorganisms (S. mutans, Lactobacilli).
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
                  <strong className="text-[#0B1F4D] block mb-1">Surgical Rule:</strong>
                  Must be completely excavated using selective methods (CMCR, air abrasion, or sharp spoon excavator).
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                Demineralized Layer (Affected Dentin) Properties & Clinical Handling
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
                  <strong className="text-[#0B1F4D] block mb-1">Collagen Matrix:</strong>
                  Intertubular collagen cross-banding remains chemically intact. Serves as a scaffold for apatite nucleation!
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
                  <strong className="text-[#0B1F4D] block mb-1">Microbiology:</strong>
                  Clinically sterile or contains minimal unviable bacteria that die once sealed off from dietary sugars.
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
                  <strong className="text-[#0B1F4D] block mb-1">Surgical Rule:</strong>
                  DO NOT DRILL! Preserve this layer to protect pulp vitality and apply remineralizing agents (CPP-ACP, GIC).
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2D Visual 2: Modern Selective Preparation Tool Comparison */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E8EC]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A24B]" />
              Non-Rotary Minimally Invasive Preparation Suite
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Overcoming the trauma, vibration, and healthy tissue sacrifice of high-speed drills
            </p>
          </div>
        </div>

        {/* Tech Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
          {(['air', 'laser', 'cmcr', 'prr'] as const).map(key => {
            const item = techData[key];
            const Icon = item.icon;
            const isSelected = selectedTech === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedTech(key)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                    : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#C9A24B]' : 'text-[#1B3A8C]'}`} />
                <span className="font-bold text-xs truncate">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Tech Card */}
        <div className="bg-[#FAF8F3] rounded-xl p-4 sm:p-5 border border-[#C9A24B]/30 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm sm:text-base text-[#0B1F4D] flex items-center gap-2">
              <currentTech.icon className="w-5 h-5 text-[#1B3A8C]" />
              {currentTech.name}
            </h4>
            <span className="text-xs font-semibold text-[#1B3A8C] bg-white px-2.5 py-1 rounded-md border border-[#E6E8EC]">
              {currentTech.anesthesiaRequired}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            <strong className="text-[#0B1F4D]">Mechanism:</strong> {currentTech.principle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 bg-white rounded-lg border border-emerald-200 text-emerald-950">
              <strong className="text-emerald-800 block mb-1">Primary Clinical Advantages:</strong>
              {currentTech.advantage}
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-200 text-amber-950">
              <strong className="text-amber-800 block mb-1">Limitations / Contraindications:</strong>
              {currentTech.contraindications}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
