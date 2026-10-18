import React, { useState } from 'react';
import { Shield, Zap, Sparkles, AlertTriangle, CheckCircle2, HeartPulse, RefreshCw } from 'lucide-react';

export const Lec8Visuals: React.FC = () => {
  const [electronState, setElectronState] = useState<'neutral' | 'radical_attack' | 'vit_e_quench' | 'vit_c_regenerate'>('neutral');
  const [cancerPreventionTab, setCancerPreventionTab] = useState<'primary' | 'secondary' | 'soybean'>('soybean');

  return (
    <div className="space-y-6">
      {/* 2D Visual 1: Free Radical Attack & Vitamin C/E Antioxidant Synergy */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EC] gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#C9A24B]" />
              Free Radical (ROS) Chain Reaction & Vitamin C/E Electron Regeneration
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              How lipid-soluble Vitamin E and water-soluble Vitamin C team up to protect periodontal tissue membranes
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F3] text-[#1B3A8C] border border-[#C9A24B]/40">
            Antioxidant Defense
          </span>
        </div>

        {/* Step-by-Step Electron Simulator Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
          <button
            onClick={() => setElectronState('neutral')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              electronState === 'neutral'
                ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
            }`}
          >
            <span className="text-[10px] font-bold block opacity-75">Step 1</span>
            <span className="text-xs font-bold block">1. Intact Membrane</span>
          </button>
          <button
            onClick={() => setElectronState('radical_attack')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              electronState === 'radical_attack'
                ? 'bg-red-700 text-white shadow-md border-transparent ring-2 ring-red-400'
                : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
            }`}
          >
            <span className="text-[10px] font-bold block opacity-75">Step 2</span>
            <span className="text-xs font-bold block">2. Free Radical Attack</span>
          </button>
          <button
            onClick={() => setElectronState('vit_e_quench')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              electronState === 'vit_e_quench'
                ? 'bg-amber-600 text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
            }`}
          >
            <span className="text-[10px] font-bold block opacity-75">Step 3</span>
            <span className="text-xs font-bold block">3. Vit E Scavenges</span>
          </button>
          <button
            onClick={() => setElectronState('vit_c_regenerate')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              electronState === 'vit_c_regenerate'
                ? 'bg-emerald-700 text-white shadow-md border-transparent ring-2 ring-emerald-400'
                : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
            }`}
          >
            <span className="text-[10px] font-bold block opacity-75">Step 4</span>
            <span className="text-xs font-bold block">4. Vit C Regenerates</span>
          </button>
        </div>

        {/* Visual Animation Box */}
        <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#C9A24B]/30 flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-64 h-36 bg-white rounded-xl border border-[#E6E8EC] flex items-center justify-center p-3 relative overflow-hidden">
            {electronState === 'neutral' && (
              <div className="text-center animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-500 mx-auto flex items-center justify-center text-blue-900 font-bold text-xs shadow-sm">
                  Lipid 2e-
                </div>
                <p className="text-[10px] text-slate-500 font-bold mt-2">Paired stable electrons</p>
              </div>
            )}
            {electronState === 'radical_attack' && (
              <div className="text-center animate-in shake">
                <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-500 mx-auto flex items-center justify-center text-red-900 font-bold text-xs shadow-sm animate-pulse">
                  ROS (e-)
                </div>
                <p className="text-[10px] text-red-600 font-bold mt-2">Lipid peroxidation chain reaction!</p>
              </div>
            )}
            {electronState === 'vit_e_quench' && (
              <div className="text-center animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-[#C9A24B] mx-auto flex items-center justify-center text-amber-900 font-bold text-xs shadow-sm">
                  Vit E-Radical
                </div>
                <p className="text-[10px] text-amber-700 font-bold mt-2">Vit E donates electron; membrane spared</p>
              </div>
            )}
            {electronState === 'vit_c_regenerate' && (
              <div className="text-center animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-900 font-bold text-xs shadow-sm">
                  Active Vit E!
                </div>
                <p className="text-[10px] text-emerald-700 font-bold mt-2">Vit C donates e- to restore Vit E</p>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <h4 className="font-bold text-sm text-[#0B1F4D]">
              {electronState === 'neutral' && 'Healthy Periodontal Cell Bilayer'}
              {electronState === 'radical_attack' && 'Oxidative Stress & DNA / Membrane Damage'}
              {electronState === 'vit_e_quench' && 'Lipophilic Vitamin E Membrane Protection'}
              {electronState === 'vit_c_regenerate' && 'Hydrophilic Vitamin C Teamwork Cycle'}
            </h4>
            <p className="text-slate-700 leading-relaxed font-sans">
              {electronState === 'neutral' && 'Gingival epithelial cells and fibroblasts maintain intact phospholipid membranes with balanced paired electron orbitals.'}
              {electronState === 'radical_attack' && 'Pollutants (tobacco smoke, bacterial lipopolysaccharides) produce unstable free radicals missing an electron. They attack membrane fatty acids, triggering tissue destruction and severe periodontitis.'}
              {electronState === 'vit_e_quench' && 'Vitamin E (alpha-tocopherol) resides inside the lipid bilayer. It sacrifices its own electron to neutralize the radical, sparing host cell membranes.'}
              {electronState === 'vit_c_regenerate' && 'Once Vitamin E loses its electron, water-soluble Vitamin C (ascorbic acid) in the cytoplasm donates an electron back to Vitamin E, resetting it into its active protective form!'}
            </p>
          </div>
        </div>

        {/* Food Texture Mythbuster */}
        <div className="mt-4 p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-blue-950">
          <HeartPulse className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">Clinical Truth on Fibrous Food Texture:</strong> Chewing firm/fibrous foods does <strong>NOT</strong> remove plaque at the gingival margin! However, it provides healthy mechanical exercise that stimulates the periodontal ligament, increases alveolar bone density, and boosts salivary flushing.
          </div>
        </div>
      </div>

      {/* 2D Visual 2: Oral Cancer Chemoprevention Suite */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E8EC]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A24B]" />
              Oral Cancer Prevention & Soybean Bowman-Birk Inhibitor (BBI)
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Primary prevention (halting initiation) vs Secondary chemoprevention (blocking promotion)
            </p>
          </div>
        </div>

        {/* Cancer Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-4">
          <button
            onClick={() => setCancerPreventionTab('primary')}
            className={`p-3 rounded-xl border text-left transition-all ${
              cancerPreventionTab === 'primary'
                ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
            }`}
          >
            <span className="font-bold text-xs block">1. Primary Prevention</span>
            <span className="text-[10px] block opacity-75 mt-0.5">Block DNA Carcinogen Mutation</span>
          </button>
          <button
            onClick={() => setCancerPreventionTab('secondary')}
            className={`p-3 rounded-xl border text-left transition-all ${
              cancerPreventionTab === 'secondary'
                ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
            }`}
          >
            <span className="font-bold text-xs block">2. Retinoids (Vitamin A)</span>
            <span className="text-[10px] block opacity-75 mt-0.5">Promote Cell Differentiation</span>
          </button>
          <button
            onClick={() => setCancerPreventionTab('soybean')}
            className={`p-3 rounded-xl border text-left transition-all ${
              cancerPreventionTab === 'soybean'
                ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
            }`}
          >
            <span className="font-bold text-xs block">3. Soybean Bowman-Birk (BBI)</span>
            <span className="text-[10px] block opacity-75 mt-0.5">Serine Protease Inhibitor</span>
          </button>
        </div>

        {/* Tab Card */}
        <div className="bg-[#FAF8F3] p-4 sm:p-5 rounded-xl border border-[#C9A24B]/30 space-y-2 text-xs">
          {cancerPreventionTab === 'primary' && (
            <div className="space-y-2 animate-in fade-in">
              <h4 className="font-bold text-sm text-[#0B1F4D]">Eliminating Carcinogen Activation & Initiation</h4>
              <p className="text-slate-700 leading-relaxed">
                Exogenous carcinogens like tobacco nitrosamines are formed from nitrates/nitrites during curing and cooking.
              </p>
              <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
                <strong className="text-emerald-700 block mb-1">Vitamin C Dietary Shield:</strong>
                Dietary Vitamin C directly inhibits the chemical transformation of ingested nitrates into carcinogenic nitrosamines in the stomach.
              </div>
            </div>
          )}

          {cancerPreventionTab === 'secondary' && (
            <div className="space-y-2 animate-in fade-in">
              <h4 className="font-bold text-sm text-[#0B1F4D]">Vitamin A & Retinoid Chemoprevention</h4>
              <p className="text-slate-700 leading-relaxed">
                In early Vitamin A deficiency, epithelial cells undergo metaplasia resembling early cancer.
              </p>
              <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
                <strong className="text-[#1B3A8C] block mb-1">Differentiation Enforcer:</strong>
                Retinoids direct cells to produce normal differentiated clones rather than abnormal neoplastic cells, boosting cell-mediated T-cell immunity against dysplastic lesions.
              </div>
            </div>
          )}

          {cancerPreventionTab === 'soybean' && (
            <div className="space-y-2 animate-in fade-in">
              <h4 className="font-bold text-sm text-[#0B1F4D]">The Bowman-Birk Inhibitor (BBI) Mechanism</h4>
              <p className="text-slate-700 leading-relaxed">
                Premalignant oral lesions (leukoplakia, erythroplakia) express elevated proteolytic activity that facilitates invasive cellular migration.
              </p>
              <div className="p-3 bg-white rounded-lg border border-emerald-200 text-emerald-950">
                <strong className="text-emerald-800 block mb-1">Epidemiological Japanese Correlation:</strong>
                The Bowman-Birk Inhibitor (BBI) is a soybean-derived serine protease inhibitor. Human clinical trials prove it suppresses oral leukoplakia transformation into invasive cancer, explaining the remarkably low oral cancer incidence in populations with high soy consumption (e.g., Japan).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
