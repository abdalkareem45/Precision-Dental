import React, { useState } from 'react';
import { OralCavity3D } from '../3d/OralCavity3D';
import { ZosterDermatome3D, ZosterDermatomeRegion } from '../3d/ZosterDermatome3D';
import { DiseaseId } from '../../types';
import { DISEASES_DATA } from '../../data/lectureData';
import { Play, Pause, RotateCcw, Sparkles, SplitSquareVertical, Flame, Layers } from 'lucide-react';

export const OralDiseaseSimulatorSandbox: React.FC = () => {
  const [selectedDisease, setSelectedDisease] = useState<DiseaseId>('vzv');
  const [comparisonDisease, setComparisonDisease] = useState<DiseaseId>('em');
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'oral_cavity' | 'zoster_dermatome'>('oral_cavity');
  const [selectedDermatomeRegion, setSelectedDermatomeRegion] = useState<ZosterDermatomeRegion>('t4_thoracic');
  const [progressionDay, setProgressionDay] = useState<number>(7); // Day 0 to 28
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [appliedIntervention, setAppliedIntervention] = useState<string | null>(null);

  const disease = DISEASES_DATA[selectedDisease];
  const compareDiseaseInfo = DISEASES_DATA[comparisonDisease];

  // When user selects VZV, offer easy transition or automatic suggestion to view dermatome
  const handleDiseaseSelect = (dId: DiseaseId) => {
    setSelectedDisease(dId);
    setAppliedIntervention(null);
    setProgressionDay(7);
  };

  // Auto-play progression
  React.useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressionDay((prev) => {
          if (prev >= 28) {
            setIsPlaying(false);
            return 28;
          }
          return prev + 1;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const severityLevel = Math.min(
    100,
    appliedIntervention
      ? Math.max(10, 100 - (progressionDay - 7) * 8)
      : progressionDay <= 10
      ? progressionDay * 10
      : 100
  );

  const getInterventionOptions = () => {
    switch (selectedDisease) {
      case 'cmv':
        return ['Valganciclovir 900mg BID', 'IV Ganciclovir 5mg/kg', 'Topical Viscous Lidocaine'];
      case 'coxsackie':
        return ['Supportive Antipyretics & Cold Liquids', 'Topical Mucosal Protectant Gel', 'Daycare Isolation'];
      case 'nug':
        return ['Gentle Debridement + 0.12% Chlorhexidine', 'Oral Metronidazole 500mg TID', 'Post-acute Scaling & Root Planing'];
      case 'em':
        return ['Continuous Acyclovir 400mg BID', 'Short-course Systemic Prednisone', 'Topical Clobetasol Gel'];
      case 'sjs-ten':
        return ['Immediate Culprit Drug Withdrawal', 'Burn ICU Barrier Care & IVIG', 'Systemic Cyclosporine'];
      case 'pcs':
        return ['Strict Cinnamon Chewing Gum Cessation', 'Intralesional Triamcinolone Injection', 'Topical 2% Fusidic Acid'];
      case 'hsv':
        return ['Valacyclovir 1000mg TID', 'Acyclovir 15mg/kg 5x/day', 'Foscarnet IV (TK mutant)'];
      case 'vzv':
        return ['Valacyclovir 1000mg TID within 72h', 'Gabapentin + 5% Lidocaine Patch', 'Ibuprofen (Aspirin Contraindicated)'];
      default:
        return ['Supportive Care & Hydration', 'Topical Analgesic Rinse', 'Definitive Antiviral Therapy'];
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <span>Sandbox 1</span>
            <span>·</span>
            <span>Virtual Patient Simulator</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">3D Oral Cavity Disease Simulator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate anatomical disease kinetics, lesion evolution, and real-time pharmacologic response.
          </p>
        </div>

        {/* View Mode & Comparison Toggle */}
        <div className="flex items-center gap-2">
          {/* Anatomical Mode Switcher */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('oral_cavity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'oral_cavity'
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Oral Cavity 3D</span>
            </button>
            <button
              onClick={() => {
                setViewMode('zoster_dermatome');
                setSelectedDisease('vzv');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'zoster_dermatome'
                  ? 'bg-rose-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>3D Zoster Dermatome & Rash</span>
            </button>
          </div>

          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
              isCompareMode
                ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <SplitSquareVertical className="w-4 h-4" />
            <span>{isCompareMode ? 'Exit Dual' : 'Side-by-Side'}</span>
          </button>
        </div>
      </div>

      {/* Disease Selector Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 px-2 font-medium">Primary Condition:</span>
          {(Object.keys(DISEASES_DATA) as DiseaseId[]).map((dId) => {
            const d = DISEASES_DATA[dId];
            const isSelected = selectedDisease === dId;
            return (
              <button
                key={dId}
                onClick={() => handleDiseaseSelect(dId)}
                style={{
                  borderColor: isSelected ? d.color : 'transparent',
                  backgroundColor: isSelected ? `${d.color}25` : 'transparent',
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                  isSelected ? 'text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {selectedDisease === 'vzv' && viewMode === 'oral_cavity' && (
          <button
            onClick={() => setViewMode('zoster_dermatome')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-semibold hover:bg-rose-500 hover:text-slate-950 transition-all flex items-center gap-1.5 animate-pulse"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Inspect 3D Zoster Dermatome Rash</span>
          </button>
        )}
      </div>

      {/* Conditionally Render 3D Zoster Dermatome Model vs Oral Cavity Simulator */}
      {viewMode === 'zoster_dermatome' ? (
        <ZosterDermatome3D
          initialRegion={selectedDermatomeRegion}
          onSelectRegion={setSelectedDermatomeRegion}
          height={520}
        />
      ) : (
        /* Standard 3D Stage Zone */
        <div className={`grid gap-6 ${isCompareMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-12'}`}>
          {/* Left 3D Canvas */}
          <div className={isCompareMode ? 'w-full h-[450px]' : 'lg:col-span-8 h-[450px]'}>
            <OralCavity3D
              selectedDisease={selectedDisease}
              severityLevel={severityLevel}
              isInteractive={true}
            />
          </div>

        {/* Right Stage: Comparison 3D or Interactive Control Deck */}
        {isCompareMode ? (
          <div className="w-full flex flex-col gap-3">
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Compare With:</span>
              {(Object.keys(DISEASES_DATA) as DiseaseId[]).map((dId) => (
                <button
                  key={dId}
                  onClick={() => setComparisonDisease(dId)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    comparisonDisease === dId ? 'bg-teal-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {DISEASES_DATA[dId].shortTitle}
                </button>
              ))}
            </div>
            <div className="w-full h-[400px]">
              <OralCavity3D
                selectedDisease={comparisonDisease}
                severityLevel={75}
                isInteractive={true}
              />
            </div>
          </div>
        ) : (
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xl space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: disease.color }} />
                  <span>{disease.title}</span>
                </h3>
              </div>

              {/* Day Timeline Slider & Controls */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Disease Progression Timeline:</span>
                  <span className="font-mono text-teal-400 font-bold">Day {progressionDay} of 28</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="28"
                  value={progressionDay}
                  onChange={(e) => setProgressionDay(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        setProgressionDay(0);
                        setIsPlaying(false);
                      }}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Calculated Severity: <span className="font-mono font-bold text-rose-400">{severityLevel}%</span>
                  </span>
                </div>
              </div>

              {/* Treatment Intervention Selector */}
              <div className="space-y-2 text-xs">
                <span className="text-slate-300 font-semibold block">Select Therapeutic Intervention:</span>
                <div className="flex flex-col gap-1.5">
                  {getInterventionOptions().map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setAppliedIntervention(opt)}
                      className={`px-3 py-2 rounded-lg text-left transition-colors border ${
                        appliedIntervention === opt
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
                      }`}
                    >
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulation Feedback Note */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {appliedIntervention ? (
                <div className="text-emerald-300">
                  <span className="font-bold">Intervention Active: </span>
                  {appliedIntervention}. Notice rapid epithelial re-epithelialization and reduction in mucosal erythema.
                </div>
              ) : (
                <div className="text-slate-400">
                  Click an intervention above to test clinical healing kinetics.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

