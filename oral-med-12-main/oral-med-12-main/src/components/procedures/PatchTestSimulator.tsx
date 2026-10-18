import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, RotateCcw, Clock, Sparkles, Search, AlertTriangle, Eye, Flame, Pill } from 'lucide-react';

export const PatchTestSimulator: React.FC = () => {
  const [readingHours, setReadingHours] = useState<'48h' | '72h'>('72h');
  const [selectedChamber, setSelectedChamber] = useState<number>(0); // 0 is Cinnamaldehyde
  const [eliminationWeek, setEliminationWeek] = useState<number>(0); // 0 to 4 weeks
  const [testedProduct, setTestedProduct] = useState<'cinnamon-gum' | 'whitening-paste' | 'plain-soda' | 'mint-candy'>('cinnamon-gum');

  const allergens = [
    {
      name: 'Cinnamaldehyde (1.0% in petrolatum)',
      category: 'Flavoring & Fragrance',
      source: 'Cinnamon chewing gum & whitening toothpaste',
      result48h: '++ (Erythema + Infiltration + Dense Papules)',
      result72h: '+++ (Extreme Confluent Bullae + Ulcerative Necrosis)',
      grading48: '++',
      grading72: '+++',
      isCulprit: true,
      slideRef: 'Slide 26: "chewing gum component, components of toothpaste"',
      mechanism: 'Type IV delayed cell-mediated hypersensitivity. Hapten binds mucosal proteins, triggering clonal B-cell activation and dense plasma cell infiltration.',
      macroscopicVisual: 'confluent-bullae',
    },
    {
      name: 'Khat Extract (Catha edulis)',
      category: 'Chewed Leaves',
      source: 'Fresh leaves chewed in East Africa / Arabian Peninsula',
      result48h: '? (Faint non-infiltrated macular erythema)',
      result72h: '- (Negative - completely cleared)',
      grading48: '?',
      grading72: '-',
      isCulprit: false,
      slideRef: 'Slide 26: "These include khat (Catha edulis)"',
      mechanism: 'Transient non-immunological irritant blush; clears cleanly by 72 hours.',
      macroscopicVisual: 'negative',
    },
    {
      name: 'Peppermint / Menthol Flavoring',
      category: 'Essential Oil Flavoring',
      source: 'Mint candies, oral lozenges, standard dental rinses',
      result48h: '- (Negative)',
      result72h: '- (Negative)',
      grading48: '-',
      grading72: '-',
      isCulprit: false,
      slideRef: 'Slide 26: "mint candies"',
      mechanism: 'No immunological reactivity detected. Patient tolerant to menthol compounds.',
      macroscopicVisual: 'negative',
    },
    {
      name: 'Balsam of Peru (Myroxylon pereirae)',
      category: 'Cross-Reacting Fragrance Marker',
      source: 'Flavor fixatives, syrups, topical ointments',
      result48h: '+ (Mild erythema, minimal edema)',
      result72h: '+ (Weak palpable pink macular erythema)',
      grading48: '+',
      grading72: '+',
      isCulprit: false,
      slideRef: 'Slide 26: "sensitizing contactant"',
      mechanism: 'Minor cross-reaction with benzyl benzoate and cinnamic acid esters.',
      macroscopicVisual: 'weak-erythema',
    },
    {
      name: 'Sodium Lauryl Sulfate (SLS 0.25%)',
      category: 'Anionic Surfactant',
      source: 'Foaming detergent in commercial toothpastes',
      result48h: 'Irritant reaction (superficial epidermal peeling)',
      result72h: '- (Decrescendo reaction: non-allergic irritant)',
      grading48: 'IR',
      grading72: '-',
      isCulprit: false,
      slideRef: 'Slide 26: "household cleaners / detergents"',
      mechanism: 'Irritant contact dermatitis (ICD) rather than allergic hypersensitivity.',
      macroscopicVisual: 'irritant',
    },
    {
      name: 'Nickel Sulfate (5.0%)',
      category: 'Metal Hapten',
      source: 'Orthodontic wires, dental crowns & base metal alloys',
      result48h: '- (Negative)',
      result72h: '- (Negative)',
      grading48: '-',
      grading72: '-',
      isCulprit: false,
      slideRef: 'Standard negative dental control contactant',
      mechanism: 'No hypersensitivity to base dental casting metals.',
      macroscopicVisual: 'negative',
    },
  ];

  const currentChamber = allergens[selectedChamber];

  const productsData = {
    'cinnamon-gum': {
      title: 'Commercial Cinnamon Chewing Gum',
      ingredients: 'Cinnamaldehyde (2.5%), Eugenol, Gum base, Sugar alcohol',
      trigger: 'HIGH FLARE-UP',
      reactionColor: 'text-rose-400',
      gingivalStatus: 'Intense burning sensation, bright scarlet fiery desquamative gingivitis collar (Slide 29).',
    },
    'whitening-paste': {
      title: 'Whitening Tartar-Control Cinnamon Paste',
      ingredients: 'Cinnamaldehyde, Pyrophosphates, Hydrated silica, SLS',
      trigger: 'HIGH FLARE-UP',
      reactionColor: 'text-rose-400',
      gingivalStatus: 'Extensive superficial capillary engorgement, bilateral angular cheilitis, desquamative gingiva.',
    },
    'plain-soda': {
      title: 'Non-Flavored Plain Baking Soda Paste',
      ingredients: 'Sodium bicarbonate, Glycerin, Purified water (NO flavor / NO SLS)',
      trigger: 'SAFE & RESOLVING',
      reactionColor: 'text-emerald-400',
      gingivalStatus: 'Rapid cessation of burning pain; regression of fiery erythema within 2 weeks.',
    },
    'mint-candy': {
      title: 'Standard Peppermint Breath Lozenges',
      ingredients: 'Menthol, Peppermint oil, Sorbitol',
      trigger: 'NON-REACTING (Tolerated)',
      reactionColor: 'text-sky-400',
      gingivalStatus: 'No active immunological exacerbation. Safe alternative flavor for patient.',
    },
  };

  const currentProduct = productsData[testedProduct];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Interactive Contact Allergen Testing & Elimination Suite</span>
            <span>·</span>
            <span>Slides 26, 29 & 31</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Comprehensive Dental Contact Allergen Patch Testing Workbench
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Apply Finn Chambers to upper back; evaluate ICDRG delayed hypersensitivity reactions and simulate clinical allergen elimination.
          </p>
        </div>

        {/* Time Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setReadingHours('48h')}
            className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-colors ${
              readingHours === '48h' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            48h Chamber Removal
          </button>
          <button
            onClick={() => setReadingHours('72h')}
            className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-colors ${
              readingHours === '72h' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            72h Delayed Peak Reading
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Finn Chamber Tray (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                Finn Chamber Test Strip Tray
              </span>
              <span className="text-[10px] text-slate-500 font-mono">ICDRG Standard</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {allergens.map((alg, idx) => {
                const isSelected = selectedChamber === idx;
                const grading = readingHours === '48h' ? alg.grading48 : alg.grading72;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedChamber(idx)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? alg.isCulprit
                          ? 'bg-rose-950/70 border-rose-500 text-white shadow-lg ring-1 ring-rose-400'
                          : 'bg-teal-950/70 border-teal-500 text-white shadow-lg ring-1 ring-teal-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                        <span
                          className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                            alg.isCulprit
                              ? 'bg-rose-900/80 text-rose-300'
                              : grading === '-'
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-amber-900/80 text-amber-300'
                          }`}
                        >
                          {grading}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs line-clamp-1">{alg.name.split('(')[0]}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block">{alg.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-teal-300 block">ICDRG Reaction Key:</span>
            <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
              <span>- : Negative</span>
              <span>? : Doubtful macular blush</span>
              <span>+ : Weak erythema/edema</span>
              <span>++ : Strong vesicular papules</span>
              <span>+++ : Extreme bullous ulcer</span>
              <span>IR : Irritant reaction</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Magnification Dermatoscopic Skin Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-3">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Search className="w-4 h-4 text-teal-400" />
                <span>Magnified Patch Reaction: {currentChamber.name}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">{readingHours} Post-Application</span>
            </div>

            {/* High-Resolution SVG Dermatoscopic Skin Visualizer */}
            <div className="w-full h-52 bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 360 200" className="w-full h-full">
                {/* Upper Back Normal Skin Surface */}
                <rect width="360" height="200" fill="#fed7aa" opacity="0.85" />

                {/* Finn Chamber Circular Impression Border */}
                <circle cx="180" cy="100" r="75" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />

                {/* Skin Reaction Morphology according to Chamber */}
                {currentChamber.macroscopicVisual === 'confluent-bullae' && (
                  <g>
                    {/* Deep scarlet indurated inflammatory base */}
                    <circle cx="180" cy="100" r="70" fill="#be123c" opacity="0.85" />
                    <circle cx="180" cy="100" r="50" fill="#9f1239" />
                    {/* Confluent blistering microvesicles */}
                    {[...Array(24)].map((_, i) => {
                      const angle = (i / 24) * Math.PI * 2;
                      const rad = 15 + (i % 3) * 14;
                      const vx = 180 + Math.cos(angle) * rad;
                      const vy = 100 + Math.sin(angle) * rad;
                      return (
                        <g key={i}>
                          <circle cx={vx} cy={vy} r={readingHours === '72h' ? 9 : 6} fill="#fef08a" stroke="#dc2626" strokeWidth="1.5" />
                          <circle cx={vx} cy={vy} r={readingHours === '72h' ? 5 : 3} fill="#ffffff" opacity="0.8" />
                        </g>
                      );
                    })}
                    {/* Central ulcerative erosion at 72h */}
                    {readingHours === '72h' && (
                      <ellipse cx="180" cy="100" rx="28" ry="18" fill="#4c0519" stroke="#7f1d1d" strokeWidth="2" />
                    )}
                  </g>
                )}

                {currentChamber.macroscopicVisual === 'weak-erythema' && (
                  <g>
                    {/* Mild pink macular ring */}
                    <circle cx="180" cy="100" r="60" fill="#f43f5e" opacity="0.35" />
                    <circle cx="180" cy="100" r="35" fill="#f43f5e" opacity="0.45" />
                  </g>
                )}

                {currentChamber.macroscopicVisual === 'irritant' && (
                  <g>
                    {/* Glazed non-infiltrated wrinkled skin */}
                    <circle cx="180" cy="100" r="65" fill="#fb923c" opacity="0.3" />
                    <line x1="140" y1="90" x2="220" y2="90" stroke="#c2410c" strokeWidth="1" strokeDasharray="4 2" />
                    <line x1="150" y1="110" x2="210" y2="110" stroke="#c2410c" strokeWidth="1" strokeDasharray="4 2" />
                  </g>
                )}

                {currentChamber.macroscopicVisual === 'negative' && (
                  <g>
                    {/* Clean normal skin, no redness */}
                    <circle cx="180" cy="100" r="70" fill="#fed7aa" opacity="0.3" />
                    <text x="180" y="105" fill="#78350f" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.6">
                      Normal Skin (No Reaction)
                    </text>
                  </g>
                )}

                {/* Circular Lens Reticle */}
                <circle cx="180" cy="100" r="95" fill="none" stroke="#0284c7" strokeWidth="3" opacity="0.8" />
                <line x1="180" y1="0" x2="180" y2="20" stroke="#0284c7" strokeWidth="2" />
                <line x1="180" y1="180" x2="180" y2="200" stroke="#0284c7" strokeWidth="2" />
              </svg>
            </div>

            {/* Reaction Clinical Interpretation */}
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2 mt-3 text-xs leading-relaxed">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Diagnosis at {readingHours}:</span>
                <span
                  className={`font-mono font-bold text-sm ${
                    currentChamber.isCulprit ? 'text-rose-400' : 'text-slate-200'
                  }`}
                >
                  {readingHours === '48h' ? currentChamber.result48h : currentChamber.result72h}
                </span>
              </div>
              <p className="text-slate-300">{currentChamber.mechanism}</p>
              <div className="text-[11px] font-mono text-teal-400 pt-1 border-t border-slate-800">
                {currentChamber.slideRef}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE ORAL PRODUCT CHALLENGE & ELIMINATION TIMELINE */}
      <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
              <Pill className="w-4 h-4" />
              <span>Interactive Clinical Allergen Elimination Trial (Slide 31)</span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              "PCS is self-limiting and will generally, but not always, regress if the contactant is identified and removed."
            </p>
          </div>

          {/* Product Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs flex-wrap">
            <span className="text-slate-500 font-mono text-[10px] px-1">Challenge Agent:</span>
            {[
              { id: 'cinnamon-gum', label: 'Cinnamon Gum' },
              { id: 'whitening-paste', label: 'Cinnamon Toothpaste' },
              { id: 'plain-soda', label: 'Plain Soda Paste (Safe)' },
              { id: 'mint-candy', label: 'Mint Candy' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setTestedProduct(p.id as any)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  testedProduct === p.id ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Impact Card */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Commercial Product:</span>
            <strong className="text-white text-sm block">{currentProduct.title}</strong>
            <span className="text-[11px] text-slate-400 block mt-1">Ingredients: {currentProduct.ingredients}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Immunological Trigger Status:</span>
            <span className={`font-mono font-bold text-sm ${currentProduct.reactionColor}`}>
              {currentProduct.trigger}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Mucosal Gingival Response:</span>
            <p className="text-slate-200 text-xs leading-relaxed">{currentProduct.gingivalStatus}</p>
          </div>
        </div>

        {/* Elimination Timeline Slider */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">
              Post-Elimination Resolution Timeline (Slide 31):
            </span>
            <span className="font-mono text-teal-400 font-bold text-sm">
              Week {eliminationWeek} {eliminationWeek === 0 ? '(Active Contact)' : '(Post-Removal)'}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={eliminationWeek}
            onChange={(e) => setEliminationWeek(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Week 0: Fiery Red Collar</span>
            <span>Week 1: Pain Ceases</span>
            <span>Week 2: Capillaries Shrink</span>
            <span>Week 3: Infiltrate Clears</span>
            <span>Week 4: Normal Gingiva ✓</span>
          </div>

          {/* Timeline Status Callout */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex items-center gap-3">
            <Clock className="w-4 h-4 text-teal-400 shrink-0" />
            <p className="text-slate-300">
              {eliminationWeek === 0 && 'Active cinnamaldehyde ingestion: severe burning pain, intense granular fiery red attached gingiva with engorged superficial capillaries.'}
              {eliminationWeek === 1 && 'Cinnamon gum/toothpaste removed: acute burning sensation subsides significantly within 5 to 7 days.'}
              {eliminationWeek === 2 && 'Marked vascular decompression: superficial capillary loops recede; attached gingiva shifts from fiery scarlet to dull pink.'}
              {eliminationWeek === 3 && 'Polyclonal plasma cell sheets in lamina propria dissipate as chronic B-cell stimulation ceases.'}
              {eliminationWeek === 4 && 'Complete histological and clinical restitution of normal stippled gingival architecture without scarring!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
