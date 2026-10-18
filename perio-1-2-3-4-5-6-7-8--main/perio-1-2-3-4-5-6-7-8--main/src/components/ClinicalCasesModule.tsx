import React, { useState } from 'react';
import {
  UserCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Stethoscope,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CLINICAL_CASES } from '../data/curriculumData';
import { ClinicalCase, PeriodontalStage, PeriodontalGrade, DiseaseExtent } from '../types/periodontics';

export const ClinicalCasesModule: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CLINICAL_CASES[0].id);

  // Student Input State for diagnosis test
  const [studentStage, setStudentStage] = useState<PeriodontalStage>('III');
  const [studentGrade, setStudentGrade] = useState<PeriodontalGrade>('B');
  const [studentExtent, setStudentExtent] = useState<DiseaseExtent>('generalized');
  const [studentStageIVType, setStudentStageIVType] = useState<number>(1);
  const [submittedForCase, setSubmittedForCase] = useState<Record<string, boolean>>({});

  const activeCase: ClinicalCase = CLINICAL_CASES.find((c) => c.id === selectedCaseId) || CLINICAL_CASES[0];
  const isSubmitted = !!submittedForCase[activeCase.id];

  const handleSubmitEvaluation = () => {
    setSubmittedForCase({
      ...submittedForCase,
      [activeCase.id]: true
    });
  };

  const isStageCorrect = studentStage === activeCase.correctDiagnosis.stage;
  const isGradeCorrect = studentGrade === activeCase.correctDiagnosis.grade;
  const isExtentCorrect = studentExtent === activeCase.correctDiagnosis.extent;
  const isTypeCorrect = !activeCase.correctDiagnosis.stageIVType || studentStageIVType === activeCase.correctDiagnosis.stageIVType;

  const totalCorrect = (isStageCorrect ? 1 : 0) + (isGradeCorrect ? 1 : 0) + (isExtentCorrect ? 1 : 0) + (isTypeCorrect ? 1 : 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Patient Case Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CLINICAL_CASES.map((patientCase) => {
          const isSolved = submittedForCase[patientCase.id];
          return (
            <button
              key={patientCase.id}
              onClick={() => {
                setSelectedCaseId(patientCase.id);
              }}
              className={`p-4 rounded-2xl border text-left transition flex flex-col gap-1.5 cursor-pointer ${
                selectedCaseId === patientCase.id
                  ? 'bg-blue-950/80 border-blue-500 ring-2 ring-blue-500/40 shadow-xl scale-[1.02]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">
                  Case #{patientCase.id.split('-')[1]}
                </span>
                {isSolved && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    Evaluated
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-white">{patientCase.patientName}</div>
              <div className="text-[11px] text-slate-400">
                {patientCase.age} yrs • {patientCase.gender} • {patientCase.smoking}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Patient Dossier & Board Diagnostic Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Dossier (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
                Iraqi Dental Clinical Board Case Vignette
              </span>
              <h3 className="text-2xl font-black text-white mt-2">
                {activeCase.patientName} ({activeCase.age} y/o {activeCase.gender})
              </h3>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              College of Dentistry Examination
            </div>
          </div>

          {/* Medical & Dental History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-400" />
                Medical &amp; Social History:
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {activeCase.medicalHistory}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                Chief Complaint &amp; Dental History:
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {activeCase.dentalHistory}
              </p>
            </div>
          </div>

          {/* Clinical Examination Parameters Grid */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              Objective Clinical Examination Findings:
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">BOP Score</div>
                <div className="text-xl font-black text-rose-400 font-mono">
                  {activeCase.clinicalFindings.bopScore}%
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Plaque Index</div>
                <div className="text-xl font-black text-amber-400 font-mono">
                  {activeCase.clinicalFindings.plaqueIndex}%
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Max Interdental CAL</div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  {activeCase.clinicalFindings.maxCAL} mm
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Max Probing Depth</div>
                <div className="text-xl font-black text-cyan-400 font-mono">
                  {activeCase.clinicalFindings.maxPD} mm
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div>
                  <strong className="text-slate-400">Furcation Involvement:</strong>{' '}
                  <span className="text-purple-300 font-semibold">{activeCase.clinicalFindings.furcation}</span>
                </div>
                <div>
                  <strong className="text-slate-400">Tooth Mobility:</strong>{' '}
                  <span className="text-blue-300 font-semibold">{activeCase.clinicalFindings.mobility}</span>
                </div>
                <div>
                  <strong className="text-slate-400">Perio Tooth Loss:</strong>{' '}
                  <span className="text-amber-300 font-semibold">{activeCase.clinicalFindings.missingTeethDueToPerio} teeth lost</span>
                </div>
                <div>
                  <strong className="text-slate-400">Remaining Dentition:</strong>{' '}
                  <span className="text-emerald-300 font-semibold">{activeCase.clinicalFindings.remainingTeeth} teeth</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 text-[11px] space-y-1">
                <div>
                  <strong className="text-slate-400">Occlusal Findings:</strong>{' '}
                  <span className="text-slate-200">{activeCase.clinicalFindings.occlusalFeatures}</span>
                </div>
                <div>
                  <strong className="text-slate-400">Radiographic (OPG) Findings:</strong>{' '}
                  <span className="text-cyan-200">{activeCase.clinicalFindings.radiographicFindings}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Answer & Treatment Plan (Shown after submission) */}
          {isSubmitted && (
            <div className="bg-slate-950/90 rounded-2xl border border-emerald-500/50 p-5 space-y-4 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Official Board Model Formulation:
                </span>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-700">
                  {totalCorrect} / 4 Criteria Matched
                </span>
              </div>

              <div className="space-y-1 text-slate-200">
                <div className="text-sm font-bold text-white">
                  {activeCase.correctDiagnosis.disease} • Stage {activeCase.correctDiagnosis.stage} • Grade {activeCase.correctDiagnosis.grade} • {activeCase.correctDiagnosis.extent}
                  {activeCase.correctDiagnosis.stageIVType ? ` (Case Type ${activeCase.correctDiagnosis.stageIVType})` : ''}
                </div>
                <div className="text-[11px] text-cyan-300 italic">
                  Prognosis: {activeCase.correctDiagnosis.prognosis}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="font-bold text-white block">Stepwise Treatment Plan:</span>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {activeCase.treatmentPlanSummary.map((plan, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{plan}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-950/40 p-3.5 rounded-xl border border-blue-800/40 text-[11px] text-blue-200 space-y-1">
                <span className="font-bold text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Key Learning Takeaways:
                </span>
                <ul className="list-disc list-inside space-y-0.5">
                  {activeCase.learningTakeaways.map((takeaway, tIdx) => (
                    <li key={tIdx}>{takeaway}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Student Diagnostic Submission Form (1 Column) */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                Student Diagnosis Board
              </h4>
              <p className="text-xs text-slate-400">
                Formulate your diagnosis and submit for clinical faculty assessment.
              </p>
            </div>

            {/* Select Stage */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-200">1. Select Disease Stage:</label>
              <div className="grid grid-cols-4 gap-1.5 font-mono font-bold">
                {(['I', 'II', 'III', 'IV'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStudentStage(st)}
                    className={`py-2 rounded-xl border transition ${
                      studentStage === st
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Stage {st}
                  </button>
                ))}
              </div>
            </div>

            {/* If Stage IV, select Case Type */}
            {studentStage === 'IV' && (
              <div className="space-y-1.5 text-xs bg-purple-950/30 p-3 rounded-xl border border-purple-800/40">
                <label className="font-semibold text-purple-300">Stage IV Case Type (1–4):</label>
                <div className="grid grid-cols-4 gap-1.5 font-mono font-bold">
                  {[1, 2, 3, 4].map((ct) => (
                    <button
                      key={ct}
                      onClick={() => setStudentStageIVType(ct)}
                      className={`py-1.5 rounded-lg border transition ${
                        studentStageIVType === ct
                          ? 'bg-purple-600 text-white border-purple-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Type {ct}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Select Grade */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-200">2. Select Disease Grade:</label>
              <div className="grid grid-cols-3 gap-1.5 font-mono font-bold">
                {(['A', 'B', 'C'] as const).map((gr) => (
                  <button
                    key={gr}
                    onClick={() => setStudentGrade(gr)}
                    className={`py-2 rounded-xl border transition ${
                      studentGrade === gr
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Grade {gr}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Extent */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-200">3. Select Extent:</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(['localized', 'generalized'] as const).map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setStudentExtent(ex)}
                    className={`py-2 px-2 capitalize rounded-xl border transition font-medium ${
                      studentExtent === ex
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={handleSubmitEvaluation}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit &amp; Compare with Model Solution</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
