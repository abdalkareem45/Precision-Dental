import React, { useState } from 'react';
import {
  GitCompare,
  ArrowRight,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Sparkles,
  ShieldAlert,
  Disc,
  Snowflake,
  Flame,
  Scale,
} from 'lucide-react';
import { EXTENDED_PAIN_DIAGNOSIS_DATA } from '../data/lectureData';
import { ExtendedPainDiagnosisRow, ClinicalTestType } from '../types/endodontics';

interface DifferentialDiagnosisComparatorProps {
  onSimulateIn3D?: (testType: ClinicalTestType) => void;
}

interface PresetPair {
  id: string;
  title: string;
  subtitle: string;
  conditionAId: string;
  conditionBId: string;
  keyDistinction: string;
}

const PRESET_PAIRS: PresetPair[] = [
  {
    id: 'rev_vs_irrev',
    title: 'Reversible vs. Irreversible Pulpitis',
    subtitle: 'The #1 Core Differential in Endodontics',
    conditionAId: 'dur_momentary',
    conditionBId: 'dur_long_spontaneous',
    keyDistinction:
      'Duration & lingering after cold stimulus: Reversible stops immediately (<10s) upon cold removal; Irreversible lingers >15–30s or throbs spontaneously.',
  },
  {
    id: 'pulp_vs_pdl',
    title: 'Diffuse Pulpal vs. Localized PDL Pain',
    subtitle: 'Proprioception & Anatomical Localization',
    conditionAId: 'loc_pulp_diffuse',
    conditionBId: 'loc_pdl_localized',
    keyDistinction:
      'PDL has fast Aβ proprioceptors (patient points to single tooth with 1 finger). Pulp has ZERO proprioceptors (diffuse referral to jaw quadrant).',
  },
  {
    id: 'crack_vs_hypersens',
    title: 'Cracked Tooth vs. Dentin Hypersensitivity',
    subtitle: 'Cuspal Flexion vs. Exposed Dentin Tubules',
    conditionAId: 'nat_mastication_rebound',
    conditionBId: 'stim_cold',
    keyDistinction:
      'Cracked tooth produces sharp pain upon RELEASING masticatory bite load (Tooth Slooth). Dentin hypersensitivity is triggered by cold/air blast without bite release pain.',
  },
  {
    id: 'rev_vs_necrosis',
    title: 'Reversible vs. Partial Necrosis with Gas',
    subtitle: 'Opposite Thermal Responses',
    conditionAId: 'stim_sweet_sour',
    conditionBId: 'stim_heat_relief_cold',
    keyDistinction:
      'Reversible pulpitis is triggered by sweet/cold. In partial necrosis, HEAT causes agony while ICE RELIEVES the pain (gas contracts).',
  },
];

export const DifferentialDiagnosisComparator: React.FC<DifferentialDiagnosisComparatorProps> = ({
  onSimulateIn3D,
}) => {
  const [activePreset, setActivePreset] = useState<string>('rev_vs_irrev');
  const [conditionAId, setConditionAId] = useState<string>('dur_momentary');
  const [conditionBId, setConditionBId] = useState<string>('dur_long_spontaneous');

  const handleSelectPreset = (preset: PresetPair) => {
    setActivePreset(preset.id);
    setConditionAId(preset.conditionAId);
    setConditionBId(preset.conditionBId);
  };

  const itemA = EXTENDED_PAIN_DIAGNOSIS_DATA.find((c) => c.id === conditionAId) || EXTENDED_PAIN_DIAGNOSIS_DATA[0];
  const itemB = EXTENDED_PAIN_DIAGNOSIS_DATA.find((c) => c.id === conditionBId) || EXTENDED_PAIN_DIAGNOSIS_DATA[1];

  const currentPresetObj = PRESET_PAIRS.find((p) => p.id === activePreset);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800 shadow-md">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-100 font-mono text-base tracking-wide">
                Differential Diagnosis Comparator (Symptom ➔ Biology ➔ Decision)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold uppercase">
                Board Exam Clinical Core
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side comparative battle between easily confused clinical entities from Lecture 1 Page 2.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Match Selector Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESET_PAIRS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activePreset === p.id
                ? 'bg-purple-950/80 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/20 ring-1 ring-purple-500'
                : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-mono font-bold">{p.title}</div>
            <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{p.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Key Golden Distinction Banner */}
      {currentPresetObj && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/50 flex items-start gap-3 shadow-md">
          <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-200 leading-relaxed">
            <strong className="text-purple-300 font-mono uppercase tracking-wider block text-[11px] mb-0.5">
              The Pathognomonic Deciding Rule:
            </strong>
            {currentPresetObj.keyDistinction}
          </div>
        </div>
      )}

      {/* Side-by-Side Dual Column Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CONDITION A CARD */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/40 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                Condition A • {itemA.parameter}
              </span>
              <span className="text-xs font-mono text-slate-400">{itemA.nerveInvolved}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                The Symptom (Type of Pain):
              </span>
              <h4 className="text-base font-extrabold text-slate-100 font-mono">
                {itemA.typeOfPain}
              </h4>
              <p className="text-xs text-slate-400 italic mt-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                “{itemA.patientQuote}”
              </p>
            </div>

            {/* The Biology */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                The Biology (Reason for Pain):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                {itemA.reasonForPain}
              </p>
            </div>

            {/* Biophysical Mechanism Deep Dive */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Biophysical Mechanism:
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {itemA.mechanismDetail}
              </p>
            </div>

            {/* Diagnostic Tests */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                Recommended Tests:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {itemA.recommendedTests.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Provisional Diagnosis & Pathway */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
              Provisional Diagnosis &amp; Treatment:
            </span>
            <div className="text-sm font-extrabold text-emerald-300 font-mono">
              {itemA.provisionalDiagnosis}
            </div>
            <p className="text-[11px] text-slate-400">
              {itemA.treatmentPathway}
            </p>
          </div>
        </div>

        {/* CONDITION B CARD */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-rose-500/40 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase">
                Condition B • {itemB.parameter}
              </span>
              <span className="text-xs font-mono text-slate-400">{itemB.nerveInvolved}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-1">
                The Symptom (Type of Pain):
              </span>
              <h4 className="text-base font-extrabold text-slate-100 font-mono">
                {itemB.typeOfPain}
              </h4>
              <p className="text-xs text-slate-400 italic mt-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                “{itemB.patientQuote}”
              </p>
            </div>

            {/* The Biology */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                The Biology (Reason for Pain):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                {itemB.reasonForPain}
              </p>
            </div>

            {/* Biophysical Mechanism Deep Dive */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Biophysical Mechanism:
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {itemB.mechanismDetail}
              </p>
            </div>

            {/* Diagnostic Tests */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
                Recommended Tests:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {itemB.recommendedTests.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Provisional Diagnosis & Pathway */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
              Provisional Diagnosis &amp; Treatment:
            </span>
            <div className="text-sm font-extrabold text-emerald-300 font-mono">
              {itemB.provisionalDiagnosis}
            </div>
            <p className="text-[11px] text-slate-400">
              {itemB.treatmentPathway}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
