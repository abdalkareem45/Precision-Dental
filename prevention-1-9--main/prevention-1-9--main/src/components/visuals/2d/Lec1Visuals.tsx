import React, { useState } from 'react';
import { Shield, Activity, Heart, Brain, Users, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const Lec1Visuals: React.FC = () => {
  const [selectedDimension, setSelectedDimension] = useState<string>('physical');
  const [triageQuestionIndex, setTriageQuestionIndex] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState<'mid' | 'gvblack'>('mid');

  const dimensions = [
    {
      id: 'physical',
      name: 'Physical',
      arabic: 'الجسدي',
      icon: Activity,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
      activeColor: 'bg-emerald-600 text-white',
      score: 95,
      description: 'Biological integrity of oral tissues: caries-free enamel, intact periodontal attachment, masticatory efficacy, absence of chronic dental pain.',
      clinicalRelevance: 'Primary and secondary preventive measures like fluoride toothpastes, pit and fissure sealants, and periodontal scaling preserve tissue longevity.'
    },
    {
      id: 'mental',
      name: 'Mental',
      arabic: 'العقلي',
      icon: Brain,
      color: 'text-blue-700 bg-blue-50 border-blue-300',
      activeColor: 'bg-blue-600 text-white',
      score: 88,
      description: 'Oral health literacy, cognitive comprehension of etiology, understanding the role of dietary sugars, and maintaining proactive hygiene behaviors.',
      clinicalRelevance: 'Empowering patient understanding of the caries process bridges the gap between clinical advice and patient compliance.'
    },
    {
      id: 'social',
      name: 'Social',
      arabic: 'الاجتماعي',
      icon: Users,
      color: 'text-amber-700 bg-amber-50 border-amber-300',
      activeColor: 'bg-amber-600 text-white',
      score: 82,
      description: 'Interaction with family, peer groups, community water fluoridation access, dental healthcare infrastructure, and societal norms.',
      clinicalRelevance: 'Socioeconomic inequalities and community attitudes heavily shape dietary habits and dental attendance.'
    },
    {
      id: 'emotional',
      name: 'Emotional',
      arabic: 'العاطفي',
      icon: Heart,
      color: 'text-pink-700 bg-pink-50 border-pink-300',
      activeColor: 'bg-pink-600 text-white',
      score: 90,
      description: 'Overcoming dental phobia, needle apprehension, aesthetic self-confidence, smile satisfaction, and anxiety reduction.',
      clinicalRelevance: 'Fear of dental drilling frequently causes patients to avoid recall appointments until severe pain emerges.'
    },
    {
      id: 'spiritual',
      name: 'Spiritual',
      arabic: 'الروحي',
      icon: Sparkles,
      color: 'text-purple-700 bg-purple-50 border-purple-300',
      activeColor: 'bg-purple-600 text-white',
      score: 85,
      description: 'Personal life purpose, holistic stewardship of the body, ethical healthcare delivery, and inner tranquility.',
      clinicalRelevance: 'Acceptance of preventive health practices as a long-term duty to preserve quality of life.'
    }
  ];

  const currentDim = dimensions.find(d => d.id === selectedDimension) || dimensions[0];

  const triageCases = [
    {
      patient: 'Case 1: Public Health Policy',
      scenario: 'A municipal government implements mandatory water fluoridation at 0.7 ppm and imposes a tax on high-fructose corn syrup beverages to curb caries in a population where risk factors are not yet entrenched.',
      correct: 'Primordial',
      rationale: 'Primordial prevention targets social and environmental conditions to stop the emergence or development of risk factors in entire populations.'
    },
    {
      patient: 'Case 2: 7-Year-Old with Deep Molars',
      scenario: 'A healthy child presents with deeply grooved, newly erupted permanent first molars. No carious lesions exist. The dentist isolates the tooth and applies Bis-GMA pit and fissure sealants.',
      correct: 'Primary',
      rationale: 'Primary prevention operates in the pre-pathogenesis phase. Sealing intact fissures provides specific protection to remove the possibility of disease occurrence.'
    },
    {
      patient: 'Case 3: White Spot Enamel Lesions',
      scenario: 'A 14-year-old post-orthodontic patient presents with chalky white demineralized areas along the buccal margins of upper incisors. The dentist prescribes CPP-ACP (MI Paste) and 5000 ppm fluoride to arrest and remineralize the incipient lesions before cavitation.',
      correct: 'Secondary',
      rationale: 'Secondary prevention halts disease at its incipient stage, reversing damage before irreversible cavitation requires surgical drilling.'
    },
    {
      patient: 'Case 4: Severe Caries with Pulp Necrosis',
      scenario: 'A 45-year-old patient has advanced caries involving the pulp of molar #19. The clinician performs root canal therapy and places an implant-supported crown on adjacent missing #18 to restore functional mastication.',
      correct: 'Tertiary',
      rationale: 'Tertiary prevention acts in late pathogenesis (rehabilitation) to limit disability, prevent tooth loss, and restore functional occlusion.'
    }
  ];

  const currentCase = triageCases[triageQuestionIndex];

  return (
    <div className="space-y-6">
      {/* 2D Visual 1: 5-Dimensional Health Interactive Radar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EC] gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#C9A24B]" />
              Interactive 5-Dimensional Health Equilibrium
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              WHO Definition: Complete Physical, Mental, Social, Emotional & Spiritual Well-Being
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F3] text-[#1B3A8C] border border-[#C9A24B]/40">
            Multidimensional Model
          </span>
        </div>

        {/* Dimension Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-4">
          {dimensions.map(dim => {
            const Icon = dim.icon;
            const isSelected = selectedDimension === dim.id;
            return (
              <button
                key={dim.id}
                onClick={() => setSelectedDimension(dim.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? `${dim.activeColor} shadow-md border-transparent ring-2 ring-[#0B1F4D]`
                    : `${dim.color} hover:shadow-xs`
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-none">{dim.name}</p>
                  <p className="text-[10px] font-arabic opacity-85 leading-tight mt-0.5">{dim.arabic}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Dimension Clinical Breakdown */}
        <div className="bg-[#FAF8F3] rounded-xl p-4 border border-[#C9A24B]/30 flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#0B1F4D] flex items-center gap-2">
                <currentDim.icon className="w-4 h-4 text-[#1B3A8C]" />
                {currentDim.name} Dimension in Dentistry
              </h4>
              <span className="text-xs font-mono font-bold text-[#C9A24B] bg-[#0B1F4D] px-2 py-0.5 rounded-md">
                Well-Being Index: {currentDim.score}%
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {currentDim.description}
            </p>
            <div className="pt-2 border-t border-[#E6E8EC]/80">
              <span className="text-[11px] font-bold text-[#1B3A8C] uppercase tracking-wider block">
                Preventive Dentistry Application:
              </span>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {currentDim.clinicalRelevance}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2D Visual 2: Prevention Levels Interactive Clinical Triage */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E8EC]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#1B3A8C]" />
              Clinical Case Triage: 4 Levels of Prevention
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Classify clinical situations into Primordial, Primary, Secondary, or Tertiary Prevention
            </p>
          </div>
          <span className="text-xs font-mono text-[#0B1F4D] bg-[#E6E8EC] px-2.5 py-1 rounded-lg font-bold">
            Case {triageQuestionIndex + 1} of {triageCases.length}
          </span>
        </div>

        <div className="my-4 bg-[#FAF8F3] p-4 rounded-xl border border-[#E6E8EC]">
          <span className="text-[11px] font-bold text-[#C9A24B] uppercase tracking-wider block mb-1">
            {currentCase.patient}
          </span>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            "{currentCase.scenario}"
          </p>
        </div>

        {/* 4 Levels Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {['Primordial', 'Primary', 'Secondary', 'Tertiary'].map(level => {
            const isChosen = selectedLevel === level;
            const isCorrect = selectedLevel && level === currentCase.correct;
            const isWrong = isChosen && level !== currentCase.correct;

            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  isChosen
                    ? isCorrect
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-red-600 text-white border-red-600'
                    : isCorrect && selectedLevel
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                    : 'bg-white text-[#0B1F4D] hover:bg-[#E6E8EC]/70 border-[#E6E8EC]'
                }`}
              >
                {level} Prevention
              </button>
            );
          })}
        </div>

        {/* Rationale feedback */}
        {selectedLevel && (
          <div
            className={`p-3.5 rounded-xl text-xs leading-relaxed flex items-start gap-2.5 animate-in fade-in ${
              selectedLevel === currentCase.correct
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            {selectedLevel === currentCase.correct ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold">
                {selectedLevel === currentCase.correct ? 'Correct! ' : `Incorrect (Expected: ${currentCase.correct}). `}
              </span>
              <span>{currentCase.rationale}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4 pt-3 border-t border-[#E6E8EC]">
          <button
            onClick={() => {
              setSelectedLevel(null);
              setTriageQuestionIndex((prev) => (prev + 1) % triageCases.length);
            }}
            className="px-4 py-1.5 rounded-lg bg-[#0B1F4D] text-[#FAF8F3] hover:bg-[#1B3A8C] text-xs font-bold transition-colors shadow-xs"
          >
            Next Clinical Case →
          </button>
        </div>
      </div>

      {/* 2D Visual 3: G.V. Black (1908) vs Modern Minimal Intervention Dentistry (MID) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#C9A24B]" />
          A Century of Progress: G.V. Black vs Minimal Intervention Dentistry (MID)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Compare the historic surgical paradigm with the modern 21st-century biological paradigm.
        </p>

        {/* Toggle Pills */}
        <div className="flex rounded-xl bg-[#E6E8EC] p-1 max-w-sm mb-4">
          <button
            onClick={() => setComparisonMode('gvblack')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              comparisonMode === 'gvblack' ? 'bg-[#0B1F4D] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            G.V. Black (1908)
          </button>
          <button
            onClick={() => setComparisonMode('mid')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              comparisonMode === 'mid' ? 'bg-[#C9A24B] text-[#0B1F4D] shadow-xs' : 'text-slate-600'
            }`}
          >
            Modern MID (21st Century)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200">
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block mb-1">
              "Extension for Prevention" (1908)
            </span>
            <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
              <li>Dr. G.V. Black advocated cutting sound enamel and dentin to place restoration margins in self-cleansing zones.</li>
              <li>Surgical mechanical mentality: disease treated by surgical excision of tooth structure.</li>
              <li>Weakened remaining tooth cusps; microfractures and premature tooth loss.</li>
              <li>Assumed synthetic dental materials could replace natural tooth tissue.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Minimal Intervention Dentistry (MID)
            </span>
            <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
              <li>Biological preservation: diagnosis prior to cavitation, remineralization of demineralized matrix.</li>
              <li>Removes ONLY the irreversibly infected necrotic layer; preserves demineralized affected dentin.</li>
              <li>Uses biological remineralizing agents (fluorides, CPP-ACP) and adhesive sealants.</li>
              <li>Recognizes that no synthetic filling material can match healthy natural enamel and dentin.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
