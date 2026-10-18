import React, { useState } from 'react';
import { CLINICAL_CASES } from '../../data/clinicalCases';
import { DISEASES_DATA } from '../../data/lectureData';
import { DiseaseId } from '../../types';
import { useLearning } from '../../context/LearningContext';
import {
  Stethoscope,
  Microscope,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  HeartPulse,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DiagnosticReasoningSandbox: React.FC = () => {
  const { completeClinicalCase, progress } = useLearning();
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const activeCase = CLINICAL_CASES[selectedCaseIndex];

  const [orderedTests, setOrderedTests] = useState<string[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiseaseId | null>(null);
  const [submittedDiagnosis, setSubmittedDiagnosis] = useState<boolean>(false);
  const [treatmentAnswerIndex, setTreatmentAnswerIndex] = useState<number | null>(null);
  const [submittedTreatment, setSubmittedTreatment] = useState<boolean>(false);

  const handleOrderTest = (testId: string) => {
    if (!orderedTests.includes(testId)) {
      setOrderedTests([...orderedTests, testId]);
    }
  };

  const handleSubmitDiagnosis = () => {
    if (!selectedDiagnosis) return;
    setSubmittedDiagnosis(true);
    if (selectedDiagnosis === activeCase.correctDiagnosis) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleSubmitTreatment = (optIdx: number) => {
    setTreatmentAnswerIndex(optIdx);
    setSubmittedTreatment(true);
    const isCorrect = activeCase.treatmentChallenge.options[optIdx].isCorrect;
    if (isCorrect && selectedDiagnosis === activeCase.correctDiagnosis) {
      completeClinicalCase(activeCase.id);
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleResetCase = () => {
    setOrderedTests([]);
    setSelectedDiagnosis(null);
    setSubmittedDiagnosis(false);
    setTreatmentAnswerIndex(null);
    setSubmittedTreatment(false);
  };

  const isCaseCompleted = progress.casesCompleted.includes(activeCase.id);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <span>Sandbox 2</span>
            <span>·</span>
            <span>Interactive Diagnostic Lab</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Clinical Diagnostic Reasoning Simulator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Conduct history, inspect lesions, order confirmatory testing, and formulate evidence-based treatment plans.
          </p>
        </div>

        {/* Case Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          {CLINICAL_CASES.map((c, idx) => {
            const isFinished = progress.casesCompleted.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCaseIndex(idx);
                  handleResetCase();
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  selectedCaseIndex === idx
                    ? 'bg-teal-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                {isFinished && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span>Case {idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Case Deck Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient Profile & Exam (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Patient Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{activeCase.title}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>{activeCase.patientProfile.age} yo {activeCase.patientProfile.gender}</span>
                    <span>·</span>
                    <span className="text-amber-400 font-semibold">{activeCase.patientProfile.immuneStatus}</span>
                  </div>
                </div>
              </div>
              {isCaseCompleted && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 font-medium">
                  <ShieldCheck className="w-3 h-3" /> Solved
                </span>
              )}
            </div>

            {/* Chief Complaint & History */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Chief Complaint:</span>
                <p className="text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-850 italic">
                  "{activeCase.patientProfile.chiefComplaint}"
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Past Medical History:</span>
                <p className="text-slate-300">{activeCase.patientProfile.medicalHistory}</p>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span>Vitals: {activeCase.patientProfile.vitalSigns}</span>
              </div>
            </div>
          </div>

          {/* Physical Exam Findings */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <span>Physical Examination</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-teal-400 font-semibold block mb-1">Intraoral & Perioral Inspection:</span>
                <p className="text-slate-300 leading-relaxed">{activeCase.oralExam}</p>
              </div>

              {activeCase.cutaneousExam && (
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-sky-400 font-semibold block mb-1">Cutaneous & Systemic Inspection:</span>
                  <p className="text-slate-300 leading-relaxed">{activeCase.cutaneousExam}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Lab Investigation & Diagnostic Builder (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Diagnostic Investigation Ordering Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Microscope className="w-4 h-4 text-sky-400" />
                <span>Order Laboratory & Histopathologic Tests</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {orderedTests.length} / {activeCase.testOptions.length} Ordered
              </span>
            </div>

            {/* Test Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {activeCase.testOptions.map((test) => {
                const isOrdered = orderedTests.includes(test.id);
                return (
                  <button
                    key={test.id}
                    onClick={() => handleOrderTest(test.id)}
                    className={`p-3 rounded-lg text-left text-xs transition-all border flex flex-col justify-between ${
                      isOrdered
                        ? 'bg-sky-950/70 border-sky-600 text-sky-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{test.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{test.costTime}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{test.category}</span>
                  </button>
                );
              })}
            </div>

            {/* Rendered Lab Reports */}
            {orderedTests.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block">Received Laboratory Reports:</span>
                {orderedTests.map((testId) => {
                  const test = activeCase.testOptions.find((t) => t.id === testId)!;
                  return (
                    <div key={testId} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs leading-relaxed">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sky-400">{test.name}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Verified Result</span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px]">{test.result}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Formulate Differential Diagnosis */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Select Final Definitive Diagnosis</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {activeCase.differentialOptions.map((dId) => {
                const disease = DISEASES_DATA[dId];
                const isSelected = selectedDiagnosis === dId;
                return (
                  <button
                    key={dId}
                    disabled={submittedDiagnosis}
                    onClick={() => setSelectedDiagnosis(dId)}
                    style={{
                      borderColor: isSelected ? disease.color : undefined,
                    }}
                    className={`p-3 rounded-lg text-left text-xs font-medium border transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-slate-800 text-white shadow-sm ring-1 ring-teal-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: disease.color }} />
                    <span>{disease.title}</span>
                  </button>
                );
              })}
            </div>

            {!submittedDiagnosis ? (
              <button
                disabled={!selectedDiagnosis}
                onClick={handleSubmitDiagnosis}
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-md"
              >
                Confirm & Submit Diagnosis
              </button>
            ) : (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                  selectedDiagnosis === activeCase.correctDiagnosis
                    ? 'bg-emerald-950/70 border-emerald-600 text-emerald-200'
                    : 'bg-rose-950/70 border-rose-600 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {selectedDiagnosis === activeCase.correctDiagnosis ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Correct Diagnosis!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>Diagnosis Incorrect</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300">{activeCase.explanation}</p>
              </div>
            )}
          </div>

          {/* Treatment Challenge (Unlocks after submitting diagnosis) */}
          {submittedDiagnosis && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Therapeutic Management Decision</span>
              </h3>

              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {activeCase.treatmentChallenge.question}
              </p>

              <div className="space-y-2">
                {activeCase.treatmentChallenge.options.map((opt, idx) => {
                  const isSelected = treatmentAnswerIndex === idx;
                  return (
                    <button
                      key={idx}
                      disabled={submittedTreatment}
                      onClick={() => handleSubmitTreatment(idx)}
                      className={`w-full p-3 rounded-lg text-left text-xs transition-all border ${
                        submittedTreatment
                          ? opt.isCorrect
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-200 font-semibold'
                            : isSelected
                            ? 'bg-rose-950 border-rose-500 text-rose-200'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="font-medium">{opt.text}</div>
                      {submittedTreatment && (
                        <div className="text-[11px] mt-1.5 pt-1.5 border-t border-slate-800/80 text-slate-400">
                          {opt.rationale}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {submittedTreatment && (
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleResetCase}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-try Case</span>
                  </button>

                  {selectedCaseIndex < CLINICAL_CASES.length - 1 && (
                    <button
                      onClick={() => {
                        setSelectedCaseIndex(selectedCaseIndex + 1);
                        handleResetCase();
                      }}
                      className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <span>Proceed to Case {selectedCaseIndex + 2}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
