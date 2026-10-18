import React, { useState, useMemo } from 'react';
import {
  Table2,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Cigarette,
  HeartPulse,
  Scale,
  Award,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Sliders
} from 'lucide-react';
import { PeriodontalStage, PeriodontalGrade, DiseaseExtent } from '../types/periodontics';

export const StagingGradingCalculator: React.FC = () => {
  // Draggable Sliders for Clinical Parameters
  const [interdentalCal, setInterdentalCal] = useState<number>(5.0); // 0 to 12 mm
  const [rblPercentage, setRblPercentage] = useState<number>(45); // 0% to 90%
  const [teethLostPerio, setTeethLostPerio] = useState<number>(2); // 0 to 10 teeth
  const [maxProbingDepth, setMaxProbingDepth] = useState<number>(6); // 1 to 12 mm
  const [patientAge, setPatientAge] = useState<number>(44); // 18 to 85 yrs

  // Complexity Factors
  const [verticalBoneLoss, setVerticalBoneLoss] = useState<boolean>(true); // >=3mm
  const [furcationInvolvement, setFurcationInvolvement] = useState<'none' | 'grade_1' | 'grade_2_3'>('grade_2_3');
  const [masticatoryDysfunction, setMasticatoryDysfunction] = useState<boolean>(false);
  const [secondaryOcclusalTrauma, setSecondaryOcclusalTrauma] = useState<boolean>(false);
  const [biteCollapseFlaring, setBiteCollapseFlaring] = useState<boolean>(false);
  const [remainingTeethUnder20, setRemainingTeethUnder20] = useState<boolean>(false);

  // Extent
  const [extent, setExtent] = useState<DiseaseExtent>('generalized');

  // Risk Modifiers (Smoking & Diabetes)
  const [cigsPerDay, setCigsPerDay] = useState<number>(15); // 0 to 40
  const [hba1cPercent, setHba1cPercent] = useState<number>(5.4); // 4.5% to 12.0%
  const [hsCrp, setHsCrp] = useState<'under_1' | '1_to_3' | 'over_3'>('1_to_3');

  // Compute Stage Dynamically
  const calculatedStage = useMemo<PeriodontalStage>(() => {
    // Stage IV Drivers:
    if (
      teethLostPerio >= 5 ||
      masticatoryDysfunction ||
      secondaryOcclusalTrauma ||
      biteCollapseFlaring ||
      remainingTeethUnder20 ||
      (rblPercentage >= 66 && teethLostPerio >= 3)
    ) {
      return 'IV';
    }

    // Stage III Drivers:
    if (
      interdentalCal >= 5.0 ||
      rblPercentage >= 33 ||
      teethLostPerio > 0 ||
      maxProbingDepth >= 6 ||
      verticalBoneLoss ||
      furcationInvolvement === 'grade_2_3'
    ) {
      return 'III';
    }

    // Stage II Drivers:
    if (interdentalCal >= 3.0 || rblPercentage >= 15 || maxProbingDepth >= 4) {
      return 'II';
    }

    return 'I';
  }, [
    interdentalCal,
    rblPercentage,
    teethLostPerio,
    maxProbingDepth,
    verticalBoneLoss,
    furcationInvolvement,
    masticatoryDysfunction,
    secondaryOcclusalTrauma,
    biteCollapseFlaring,
    remainingTeethUnder20
  ]);

  // Compute Bone Loss / Age ratio
  const boneLossAgeRatio = useMemo(() => {
    if (patientAge <= 0) return 0;
    return parseFloat((rblPercentage / patientAge).toFixed(2));
  }, [patientAge, rblPercentage]);

  // Compute Grade Dynamically
  const { calculatedGrade, gradeShiftReason } = useMemo<{
    calculatedGrade: PeriodontalGrade;
    gradeShiftReason: string;
  }>(() => {
    let base: PeriodontalGrade = 'B';
    let reason = 'Commensurate destruction rate';

    if (boneLossAgeRatio < 0.25) {
      base = 'A';
      reason = 'Bone loss / age ratio < 0.25 (Slow rate of progression)';
    } else if (boneLossAgeRatio > 1.0) {
      base = 'C';
      reason = 'Bone loss / age ratio > 1.0 (Rapid rate of progression)';
    } else {
      base = 'B';
      reason = 'Bone loss / age ratio 0.25 to 1.0 (Moderate progression)';
    }

    // Check Smoking Modifier
    if (cigsPerDay >= 10) {
      return {
        calculatedGrade: 'C',
        gradeShiftReason: `Smoking ≥10 cigs/day (${cigsPerDay} cigs/day) forces an automatic shift to Grade C!`
      };
    } else if (cigsPerDay > 0 && base === 'A') {
      base = 'B';
      reason = 'Smoking <10 cigs/day modifies Grade A up to Grade B.';
    }

    // Check Diabetes HbA1c Modifier
    if (hba1cPercent >= 7.0) {
      return {
        calculatedGrade: 'C',
        gradeShiftReason: `Diabetes HbA1c ≥7.0% (${hba1cPercent.toFixed(1)}%) forces an automatic shift to Grade C!`
      };
    } else if (hba1cPercent >= 6.5 && base === 'A') {
      base = 'B';
      reason = 'Diabetes with HbA1c <7.0% modifies Grade A up to Grade B.';
    }

    return { calculatedGrade: base, gradeShiftReason: reason };
  }, [boneLossAgeRatio, cigsPerDay, hba1cPercent]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Dynamic Animated Diagnosis Display Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-blue-800/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <span className="text-[11px] font-black uppercase tracking-wider bg-[#C9A24B] text-slate-950 px-3 py-1 rounded-full shadow-sm">
              Lecture 6 of 8
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 font-bold">
              2018 EFP / AAP Diagnostic Formulation
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Diagnosis:{' '}
            <span className="text-cyan-300 capitalize">{extent} Periodontitis</span>,{' '}
            <span className="text-amber-400">Stage {calculatedStage}</span>,{' '}
            <span className="text-rose-400">Grade {calculatedGrade}</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            {gradeShiftReason}
          </p>
        </div>

        {/* Visual Stage & Grade Badges */}
        <div className="flex items-center gap-3">
          <div className={`p-4 rounded-3xl border text-center shadow-xl min-w-[120px] ${
            calculatedStage === 'IV' ? 'bg-rose-950/80 border-rose-500' :
            calculatedStage === 'III' ? 'bg-amber-950/80 border-amber-500' :
            calculatedStage === 'II' ? 'bg-orange-950/80 border-orange-500' : 'bg-emerald-950/80 border-emerald-500'
          }`}>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Severity / Complexity</div>
            <div className={`text-3xl font-black font-mono mt-0.5 ${
              calculatedStage === 'IV' ? 'text-rose-400' :
              calculatedStage === 'III' ? 'text-amber-400' :
              calculatedStage === 'II' ? 'text-orange-400' : 'text-emerald-400'
            }`}>
              Stage {calculatedStage}
            </div>
          </div>

          <div className={`p-4 rounded-3xl border text-center shadow-xl min-w-[120px] ${
            calculatedGrade === 'C' ? 'bg-rose-950/80 border-rose-500' :
            calculatedGrade === 'B' ? 'bg-amber-950/80 border-amber-500' : 'bg-emerald-950/80 border-emerald-500'
          }`}>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Progression Rate</div>
            <div className={`text-3xl font-black font-mono mt-0.5 ${
              calculatedGrade === 'C' ? 'text-rose-400' :
              calculatedGrade === 'B' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              Grade {calculatedGrade}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Draggable Sliders for Staging vs Grading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: INTERACTIVE STAGING SLIDERS */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Table2 className="w-5 h-5 text-amber-400" />
              Dynamic Staging Sliders (Table 7)
            </h3>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-800">
              Stage {calculatedStage}
            </span>
          </div>

          {/* Slider 1: Interdental CAL */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">Interdental CAL (Site of Greatest Loss)</span>
              <span className="font-mono text-cyan-400 font-bold text-sm">{interdentalCal.toFixed(1)} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={interdentalCal}
              onChange={(e) => setInterdentalCal(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1-2mm (St I)</span>
              <span>3-4mm (St II)</span>
              <span>≥5mm (St III/IV)</span>
            </div>
          </div>

          {/* Slider 2: Radiographic Bone Loss % */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">Radiographic Bone Loss (RBL %)</span>
              <span className="font-mono text-amber-400 font-bold text-sm">{rblPercentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="1"
              value={rblPercentage}
              onChange={(e) => setRblPercentage(parseInt(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>&lt;15% (Coronal)</span>
              <span>15%-33% (Coronal)</span>
              <span>Middle Third</span>
              <span>Apical Third</span>
            </div>
          </div>

          {/* Slider 3: Teeth Lost due to Periodontitis */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">Teeth Lost Due to Periodontitis</span>
              <span className={`font-mono font-bold text-sm ${teethLostPerio >= 5 ? 'text-rose-400' : 'text-slate-200'}`}>
                {teethLostPerio} teeth {teethLostPerio >= 5 ? '(Stage IV Trigger!)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={teethLostPerio}
              onChange={(e) => setTeethLostPerio(parseInt(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Stage I/II)</span>
              <span>1 to 4 (Stage III)</span>
              <span>≥5 teeth (Stage IV)</span>
            </div>
          </div>

          {/* Local Complexity Switches */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-200 block">Stage III &amp; IV Complexity Modifiers:</span>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verticalBoneLoss}
                  onChange={(e) => setVerticalBoneLoss(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-[11px] text-slate-300">Vertical Defect ≥3mm</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={furcationInvolvement === 'grade_2_3'}
                  onChange={(e) => setFurcationInvolvement(e.target.checked ? 'grade_2_3' : 'none')}
                  className="rounded text-amber-500"
                />
                <span className="text-[11px] text-slate-300">Furcation Grade II/III</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={secondaryOcclusalTrauma}
                  onChange={(e) => setSecondaryOcclusalTrauma(e.target.checked)}
                  className="rounded text-rose-500"
                />
                <span className="text-[11px] text-slate-300">Secondary Trauma (Mobility ≥2)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={biteCollapseFlaring}
                  onChange={(e) => setBiteCollapseFlaring(e.target.checked)}
                  className="rounded text-rose-500"
                />
                <span className="text-[11px] text-slate-300">Bite Collapse / Flaring</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE GRADING SLIDERS & RISK MODIFIERS */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-rose-400" />
              Dynamic Grading Sliders (Table 8)
            </h3>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950 px-2.5 py-1 rounded-lg border border-rose-800">
              Grade {calculatedGrade}
            </span>
          </div>

          {/* Age Slider & RBL / Age Ratio */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">Patient Age &amp; Ratio Calculator</span>
              <span className="font-mono text-cyan-400 font-bold text-sm">{patientAge} years</span>
            </div>
            <input
              type="range"
              min="18"
              max="85"
              step="1"
              value={patientAge}
              onChange={(e) => setPatientAge(parseInt(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Bone Loss / Age Ratio:</span>
              <span className="font-mono font-black text-cyan-300 text-sm">{boneLossAgeRatio}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>&lt;0.25 (Grade A)</span>
              <span>0.25 to 1.0 (Grade B)</span>
              <span>&gt;1.0 (Grade C)</span>
            </div>
          </div>

          {/* Smoking Habits Slider */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Cigarette className="w-4 h-4 text-orange-400" />
                Smoking Habit Slider
              </span>
              <span className={`font-mono font-bold text-sm ${cigsPerDay >= 10 ? 'text-rose-400' : 'text-slate-300'}`}>
                {cigsPerDay} cigs/day {cigsPerDay >= 10 ? '(Grade C Shift!)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={cigsPerDay}
              onChange={(e) => setCigsPerDay(parseInt(e.target.value))}
              className="w-full accent-orange-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Non-smoker)</span>
              <span>&lt;10 cigs (Grade B)</span>
              <span className="text-rose-400">≥10 cigs (Grade C)</span>
            </div>
          </div>

          {/* Diabetes HbA1c Slider */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                Diabetes Glycemic Control (HbA1c %)
              </span>
              <span className={`font-mono font-bold text-sm ${hba1cPercent >= 7.0 ? 'text-rose-400' : 'text-slate-300'}`}>
                {hba1cPercent.toFixed(1)}% {hba1cPercent >= 7.0 ? '(Grade C Shift!)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="4.5"
              max="11.5"
              step="0.1"
              value={hba1cPercent}
              onChange={(e) => setHba1cPercent(parseFloat(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>&lt;6.5% (Normoglycemic)</span>
              <span>&lt;7.0% (Grade B)</span>
              <span className="text-rose-400">≥7.0% (Grade C)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
