import React, { useState, useEffect } from 'react';
import { ClinicalCase, ClinicalTestType } from '../types/endodontics';
import { CLINICAL_CASES } from '../data/lectureData';
import {
  UserCheck,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  ChevronDown,
  Award,
  Sparkles,
  FileText,
  Save,
  Trash2,
  Copy,
  Clock,
  Check,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface SavedCaseRecord {
  id: string;
  caseId: string;
  caseTitle: string;
  toothTarget: string;
  patientProfile: {
    age: number;
    gender: string;
    chiefComplaint: string;
  };
  timestamp: string;
  examinationNotes: string;
  pulpalDiagnosis: string;
  periapicalDiagnosis: string;
  treatmentPlan: string;
  definitiveDiagnosis: string;
  isCorrect?: boolean;
}

interface CaseSimulatorProps {
  currentCase: ClinicalCase;
  onSelectCase: (caseId: string) => void;
  onRunTestForCase: (test: ClinicalTestType) => void;
  performedTests: Record<string, boolean>;
}

const PULPAL_OPTIONS = [
  'Normal Pulp',
  'Reversible Pulpitis',
  'Symptomatic Irreversible Pulpitis',
  'Asymptomatic Irreversible Pulpitis',
  'Pulp Necrosis',
  'Previously Treated',
  'Previously Initiated Therapy',
];

const PERIAPICAL_OPTIONS = [
  'Normal Apical Tissues',
  'Symptomatic Apical Periodontitis',
  'Asymptomatic Apical Periodontitis',
  'Acute Apical Abscess',
  'Chronic Apical Abscess',
  'Condensing Osteitis',
];

export const CaseSimulator: React.FC<CaseSimulatorProps> = ({
  currentCase,
  onSelectCase,
  onRunTestForCase,
  performedTests,
}) => {
  const [activeSidebarTab, setActiveSidebarTab] = useState<'workup' | 'history'>('workup');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [activeCaseTest, setActiveCaseTest] = useState<ClinicalTestType | null>(null);

  // Clinician Documentation States
  const [examinationNotes, setExaminationNotes] = useState<string>('');
  const [selectedPulpal, setSelectedPulpal] = useState<string>('Symptomatic Irreversible Pulpitis');
  const [selectedPeriapical, setSelectedPeriapical] = useState<string>('Symptomatic Apical Periodontitis');
  const [treatmentPlan, setTreatmentPlan] = useState<string>('Non-surgical Root Canal Therapy');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  // Saved History Records
  const [savedRecords, setSavedRecords] = useState<SavedCaseRecord[]>(() => {
    try {
      const stored = localStorage.getItem('precision_dental_case_records');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load saved cases from localStorage', e);
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('precision_dental_case_records', JSON.stringify(savedRecords));
    } catch (e) {
      console.error('Failed to save cases to localStorage', e);
    }
  }, [savedRecords]);

  // Load existing notes for current case if already saved
  useEffect(() => {
    const existing = savedRecords.find((r) => r.caseId === currentCase.id);
    if (existing) {
      setExaminationNotes(existing.examinationNotes || '');
      setSelectedPulpal(existing.pulpalDiagnosis || 'Symptomatic Irreversible Pulpitis');
      setSelectedPeriapical(existing.periapicalDiagnosis || 'Symptomatic Apical Periodontitis');
      setTreatmentPlan(existing.treatmentPlan || 'Non-surgical Root Canal Therapy');
    } else {
      setExaminationNotes('');
    }
    setSelectedDiagnosis('');
    setIsSubmitted(false);
    setActiveCaseTest(null);
  }, [currentCase.id]);

  const handleSelectCase = (id: string) => {
    onSelectCase(id);
    setSelectedDiagnosis('');
    setIsSubmitted(false);
    setActiveCaseTest(null);
  };

  const handleSubmitDiagnosis = () => {
    if (!selectedDiagnosis) return;
    const correct = selectedDiagnosis === currentCase.actualDiagnosis;
    setIsCorrect(correct);
    setIsSubmitted(true);
    if (correct) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleSaveCaseNotes = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRecord: SavedCaseRecord = {
      id: `${currentCase.id}_${Date.now()}`,
      caseId: currentCase.id,
      caseTitle: currentCase.title,
      toothTarget: currentCase.toothTarget,
      patientProfile: {
        age: currentCase.patientProfile.age,
        gender: currentCase.patientProfile.gender,
        chiefComplaint: currentCase.patientProfile.chiefComplaint,
      },
      timestamp: formattedDate,
      examinationNotes: examinationNotes.trim() || 'No additional subjective notes recorded.',
      pulpalDiagnosis: selectedPulpal,
      periapicalDiagnosis: selectedPeriapical,
      treatmentPlan: treatmentPlan.trim() || 'Non-surgical Endodontic Therapy',
      definitiveDiagnosis: selectedDiagnosis || `${selectedPulpal} with ${selectedPeriapical}`,
      isCorrect: selectedDiagnosis ? selectedDiagnosis === currentCase.actualDiagnosis : undefined,
    };

    setSavedRecords((prev) => {
      const filtered = prev.filter((r) => r.caseId !== currentCase.id);
      return [newRecord, ...filtered];
    });

    setSaveSuccessMsg('Examination notes & diagnostic conclusions saved to medical chart!');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCopyNote = (record: SavedCaseRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `[PRECISION DENTAL CLINICAL CHART RECORD]
Patient: ${record.patientProfile.age}y ${record.patientProfile.gender} | Target Tooth: ${record.toothTarget}
Chief Complaint: "${record.patientProfile.chiefComplaint}"
Date: ${record.timestamp}
Pulpal Diagnosis: ${record.pulpalDiagnosis}
Periapical Diagnosis: ${record.periapicalDiagnosis}
Treatment Plan: ${record.treatmentPlan}
Clinical Notes:
${record.examinationNotes}`;

    navigator.clipboard.writeText(text);
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1F4D] border border-[#E6E8EC]/20 rounded-2xl text-[#FAF8F3] overflow-y-auto w-full shadow-2xl">
      {/* Precision Dental Clinical Header */}
      <div className="p-4 border-b border-[#E6E8EC]/15 sticky top-0 bg-[#0B1F4D]/95 backdrop-blur-md z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1B3A8C] to-[#2854BF] border border-[#C9A24B] flex items-center justify-center text-[#C9A24B] shadow-md">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-headings">
                  Clinical Patient Cases
                </h2>
                <span className="font-arabic text-[10px] text-[#C9A24B] font-bold" dir="rtl">
                  دقّة الأسنان
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/30 font-bold uppercase">
                  Lecture 1
                </span>
              </div>
              <p className="text-[10px] text-[#E6E8EC]/80 font-medium">Lecture 1 Diagnostic Scenarios (Figures 1, 2, 7 &amp; 7b)</p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/40 font-bold shrink-0">
            Case {CLINICAL_CASES.findIndex((c) => c.id === currentCase.id) + 1} / {CLINICAL_CASES.length}
          </span>
        </div>

        {/* View Switcher: Active Workup vs Saved History */}
        <div className="flex items-center bg-[#06112C] p-1 rounded-xl border border-[#E6E8EC]/15 text-xs shadow-inner">
          <button
            onClick={() => setActiveSidebarTab('workup')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-headings text-xs font-semibold transition-all ${
              activeSidebarTab === 'workup'
                ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                : 'text-[#E6E8EC]/70 hover:text-white'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Active Workup</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab('history')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-headings text-xs font-semibold transition-all ${
              activeSidebarTab === 'history'
                ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                : 'text-[#E6E8EC]/70 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Saved History</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                activeSidebarTab === 'history'
                  ? 'bg-[#0B1F4D] text-[#C9A24B]'
                  : 'bg-[#1B3A8C] text-[#FAF8F3]'
              }`}
            >
              {savedRecords.length}
            </span>
          </button>
        </div>

        {/* Case selector buttons when in Workup mode */}
        {activeSidebarTab === 'workup' && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1">
            {CLINICAL_CASES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => handleSelectCase(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold shrink-0 transition-all ${
                  c.id === currentCase.id
                    ? 'bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B] shadow-md font-bold'
                    : 'bg-[#06112C] border border-[#E6E8EC]/20 text-[#E6E8EC]/70 hover:text-white'
                }`}
              >
                Case {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACTIVE PATIENT WORKUP */}
      {/* ========================================================================= */}
      {activeSidebarTab === 'workup' && (
        <div className="p-4 space-y-4">
          {/* Toast Notification on Save */}
          {saveSuccessMsg && (
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Case Title & Target Tooth */}
          <div className="p-3.5 rounded-2xl bg-[#06112C] border border-[#C9A24B]/40 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold">
                Target Tooth: {currentCase.toothTarget}
              </span>
              <span className="text-[10px] font-mono text-[#E6E8EC]/80">
                {currentCase.patientProfile.age}y / {currentCase.patientProfile.gender}
              </span>
            </div>
            <h3 className="text-xs font-bold text-white leading-snug font-headings">
              {currentCase.title}
            </h3>
          </div>

          {/* Stage 1: Chief Complaint */}
          <div className="p-3.5 rounded-2xl bg-[#06112C]/90 border border-[#E6E8EC]/15 text-xs space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold block">
              1. Chief Complaint (Patient&apos;s Own Words)
            </span>
            <div className="italic text-[#FAF8F3] bg-[#0B1F4D] p-2.5 rounded-xl border border-[#C9A24B]/20 text-[11px] leading-relaxed">
              &ldquo;{currentCase.patientProfile.chiefComplaint}&rdquo;
            </div>
          </div>

          {/* Stage 2: History of Present Dental Illness */}
          <div className="p-3.5 rounded-2xl bg-[#06112C]/90 border border-[#E6E8EC]/15 text-xs space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold block">
              2. History of Present Dental Illness
            </span>
            <p className="text-[#E6E8EC] text-[11px] leading-relaxed">
              {currentCase.patientProfile.historyOfPresentIllness}
            </p>

            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#E6E8EC]/15 text-[10px]">
              <div>
                <span className="text-[#E6E8EC]/60 block font-mono">Quality:</span>
                <span className="text-white font-medium">{currentCase.initialSymptomData.painQuality}</span>
              </div>
              <div>
                <span className="text-[#E6E8EC]/60 block font-mono">Duration:</span>
                <span className="text-white font-medium">{currentCase.initialSymptomData.painDuration}</span>
              </div>
              <div>
                <span className="text-[#E6E8EC]/60 block font-mono">Onset:</span>
                <span className="text-white font-medium">{currentCase.initialSymptomData.onset}</span>
              </div>
              <div>
                <span className="text-[#E6E8EC]/60 block font-mono">Initiation:</span>
                <span className="text-white font-medium">
                  {currentCase.initialSymptomData.initiatingFactors}
                </span>
              </div>
            </div>
          </div>

          {/* Scully & Cawson Medical History Review */}
          <div className="p-3 rounded-2xl bg-[#06112C]/80 border border-[#E6E8EC]/15 text-xs space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold block">
              Scully &amp; Cawson Medical Review
            </span>
            <div className="flex flex-wrap gap-1">
              {currentCase.patientProfile.medicalHistory.map((item, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#1B3A8C] text-[#FAF8F3] font-mono border border-[#C9A24B]/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Stage 3: Objective Clinical Tests in 3D */}
          <div className="p-3.5 rounded-2xl bg-[#06112C]/90 border border-[#E6E8EC]/15 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold">
                3. Objective Clinical Tests
              </span>
              <span className="text-[10px] font-mono text-[#E6E8EC]/70">Tap to Simulate</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  ['cold', 'Cold Vitality (Aδ)'],
                  ['heat', 'Heat Test (C-fibers)'],
                  ['ept', 'Electric Pulp Test (EPT)'],
                  ['percussion_vertical', 'Vert Percussion (PDL)'],
                  ['bite_test', 'Tooth Slooth (Bite)'],
                  ['sinus_tracing', 'GP Sinus Tracing'],
                  ['transillumination', 'Transillumination'],
                  ['palpation', 'Apical Palpation'],
                ] as const
              ).map(([testKey, testLabel]) => {
                const hasRun = performedTests[testKey];
                const testResp = currentCase.testResponses[testKey];

                return (
                  <button
                    key={testKey}
                    onClick={() => {
                      setActiveCaseTest(testKey);
                      onRunTestForCase(testKey);
                    }}
                    className={`p-2 rounded-xl text-left border text-[11px] transition-all flex flex-col justify-between ${
                      hasRun
                        ? testResp?.isPositive
                          ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                          : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                        : 'bg-[#0B1F4D] border-[#E6E8EC]/20 text-[#FAF8F3] hover:border-[#C9A24B]'
                    }`}
                  >
                    <span className="font-semibold">{testLabel}</span>
                    <span className="text-[9px] font-mono mt-1 opacity-80">
                      {hasRun ? (testResp?.isPositive ? '• POSITIVE' : '• NORMAL') : 'Click to run'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Test Feedback */}
            {activeCaseTest && currentCase.testResponses[activeCaseTest] && (
              <div
                className={`p-3 rounded-2xl border text-xs space-y-1.5 animate-fadeIn mt-2 ${
                  currentCase.testResponses[activeCaseTest].isPositive
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono font-bold text-[11px]">
                  <span>RESULT: {activeCaseTest.replace('_', ' ').toUpperCase()}</span>
                  <span>
                    {currentCase.testResponses[activeCaseTest].isPositive
                      ? '● POSITIVE'
                      : '○ NORMAL / NEGATIVE'}
                  </span>
                </div>
                <div className="italic text-white bg-[#0B1F4D]/80 p-2 rounded-xl border border-[#E6E8EC]/15">
                  &ldquo;{currentCase.testResponses[activeCaseTest].patientFeedback}&rdquo;
                </div>
                <div className="text-[11px] text-[#E6E8EC]">
                  <strong>Finding:</strong> {currentCase.testResponses[activeCaseTest].result}
                </div>
                <div className="text-[10px] text-[#C9A24B] font-mono pt-1 border-t border-[#E6E8EC]/15">
                  <strong>Diagnostic Note:</strong> {currentCase.testResponses[activeCaseTest].clinicalNote}
                </div>
              </div>
            )}
          </div>

          {/* Formulate Definitive Diagnosis (Quiz / Submission) */}
          <div className="p-3.5 rounded-2xl bg-[#06112C]/90 border border-[#E6E8EC]/15 text-xs space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold block">
              4. Definitive Differential Selection
            </span>

            <div className="space-y-1.5">
              {currentCase.correctDifferential.map((diff, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-[11px] cursor-pointer transition-all ${
                    selectedDiagnosis === diff
                      ? 'bg-[#1B3A8C] border-[#C9A24B] text-white font-semibold shadow-md'
                      : 'bg-[#0B1F4D] border-[#E6E8EC]/20 text-[#E6E8EC] hover:border-[#C9A24B]/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="diagnosis"
                    value={diff}
                    checked={selectedDiagnosis === diff}
                    onChange={(e) => setSelectedDiagnosis(e.target.value)}
                    disabled={isSubmitted}
                    className="accent-[#C9A24B]"
                  />
                  <span>{diff}</span>
                </label>
              ))}
            </div>

            {!isSubmitted ? (
              <button
                onClick={handleSubmitDiagnosis}
                disabled={!selectedDiagnosis}
                className="w-full py-2.5 rounded-xl bg-[#C9A24B] hover:bg-[#D8B25B] disabled:opacity-40 text-[#0B1F4D] font-bold text-xs font-headings uppercase tracking-wider transition-all shadow-md"
              >
                Verify Against Lecture Gold Standard
              </button>
            ) : (
              <div
                className={`p-3 rounded-xl border text-xs space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-950/50 border-emerald-400 text-emerald-200'
                    : 'bg-rose-950/50 border-rose-400 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  )}
                  {isCorrect ? 'ACCURATE DIAGNOSIS!' : 'INCORRECT DIAGNOSIS'}
                </div>
                <div className="text-[11px] text-[#E6E8EC] leading-relaxed">
                  {currentCase.explanation}
                </div>
                <div className="text-[10px] text-[#C9A24B] font-mono pt-1 border-t border-[#E6E8EC]/15">
                  <strong>Lecture Reference:</strong> {currentCase.lectureReference}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* STAGE 5: SAVE CLINICAL EXAMINATION NOTES & DIAGNOSTIC CONCLUSIONS */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#06112C] to-[#0B1F4D] border border-[#C9A24B]/50 text-xs space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EC]/15">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C9A24B]" />
                <span className="font-headings font-bold text-xs uppercase tracking-wider text-white">
                  Clinician Chart &amp; Notes
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/30 font-semibold">
                Permanent Record
              </span>
            </div>

            {/* Diagnostic Conclusion Selectors */}
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-mono text-[#C9A24B] uppercase font-bold block mb-1">
                  AAE Pulpal Diagnostic Conclusion:
                </label>
                <select
                  value={selectedPulpal}
                  onChange={(e) => setSelectedPulpal(e.target.value)}
                  className="w-full bg-[#06112C] border border-[#E6E8EC]/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C9A24B]"
                >
                  {PULPAL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0B1F4D] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#C9A24B] uppercase font-bold block mb-1">
                  AAE Periapical Diagnostic Conclusion:
                </label>
                <select
                  value={selectedPeriapical}
                  onChange={(e) => setSelectedPeriapical(e.target.value)}
                  className="w-full bg-[#06112C] border border-[#E6E8EC]/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C9A24B]"
                >
                  {PERIAPICAL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0B1F4D] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#C9A24B] uppercase font-bold block mb-1">
                  Recommended Treatment Plan:
                </label>
                <input
                  type="text"
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="e.g. Non-surgical Root Canal Therapy on #19..."
                  className="w-full bg-[#06112C] border border-[#E6E8EC]/20 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-[#E6E8EC]/40 focus:outline-none focus:border-[#C9A24B]"
                />
              </div>
            </div>

            {/* Examination Notes Textarea */}
            <div>
              <label className="text-[10px] font-mono text-[#C9A24B] uppercase font-bold block mb-1">
                Clinician Examination Notes:
              </label>
              <textarea
                value={examinationNotes}
                onChange={(e) => setExaminationNotes(e.target.value)}
                rows={3}
                placeholder="Enter subjective notes, clinical observations (swelling, sinus tract depth, mobility), radiographic findings, and medical precautions..."
                className="w-full bg-[#06112C] border border-[#E6E8EC]/20 rounded-xl p-2.5 text-xs text-[#FAF8F3] placeholder-[#E6E8EC]/40 focus:outline-none focus:border-[#C9A24B] leading-relaxed resize-none"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveCaseNotes}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#DFBA67] hover:from-[#DFBA67] hover:to-[#C9A24B] text-[#0B1F4D] font-headings font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Examination Notes &amp; Conclusions</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SUMMARIZED CASE HISTORY LIST (SIDEBAR ARCHIVE) */}
      {/* ========================================================================= */}
      {activeSidebarTab === 'history' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EC]/15">
            <div>
              <h3 className="font-headings font-bold text-xs text-white uppercase tracking-wider">
                Summarized Chart History
              </h3>
              <p className="text-[10px] text-[#E6E8EC]/70">
                {savedRecords.length} Saved Patient Chart {savedRecords.length === 1 ? 'Record' : 'Records'}
              </p>
            </div>

            {savedRecords.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear all saved patient case history?')) {
                    setSavedRecords([]);
                  }
                }}
                className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline"
              >
                Clear All
              </button>
            )}
          </div>

          {savedRecords.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-[#06112C] border border-[#E6E8EC]/15 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1F4D] border border-[#C9A24B]/30 flex items-center justify-center text-[#C9A24B] mx-auto shadow-inner">
                <FileText className="w-6 h-6 opacity-60" />
              </div>
              <h4 className="text-xs font-bold text-white font-headings">No Case Records Saved Yet</h4>
              <p className="text-[11px] text-[#E6E8EC]/70 leading-relaxed">
                Work through patient cases in the <span className="text-[#C9A24B] font-semibold">Active Workup</span> tab, enter your clinical notes &amp; diagnostic conclusions, and tap <span className="text-[#C9A24B] font-semibold">&ldquo;Save Examination Notes&rdquo;</span>.
              </p>
              <button
                onClick={() => setActiveSidebarTab('workup')}
                className="px-4 py-2 rounded-xl bg-[#1B3A8C] hover:bg-[#2348A8] text-white font-headings text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <span>Return to Active Workup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedRecords.map((record) => {
                const isExpanded = expandedRecordId === record.id;

                return (
                  <div
                    key={record.id}
                    className="p-3.5 rounded-2xl bg-[#06112C] border border-[#E6E8EC]/15 hover:border-[#C9A24B]/60 transition-all space-y-2.5 shadow-md"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B3A8C] text-[#C9A24B] font-bold border border-[#C9A24B]/30">
                            Tooth {record.toothTarget}
                          </span>
                          <span className="text-[10px] font-mono text-[#E6E8EC]/70">
                            {record.patientProfile.age}y {record.patientProfile.gender}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1 leading-snug font-headings">
                          {record.caseTitle}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleCopyNote(record, e)}
                          title="Copy Clinical Note"
                          className="p-1.5 rounded-lg bg-[#0B1F4D] text-[#E6E8EC] hover:text-[#C9A24B] hover:border-[#C9A24B]/40 border border-transparent transition-all"
                        >
                          {copiedId === record.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => handleDeleteRecord(record.id, e)}
                          title="Delete Record"
                          className="p-1.5 rounded-lg bg-[#0B1F4D] text-[#E6E8EC]/70 hover:text-rose-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-[10px] text-[#E6E8EC]/60 font-mono">
                      <Clock className="w-3 h-3 text-[#C9A24B]" />
                      <span>{record.timestamp}</span>
                    </div>

                    {/* Diagnostic Conclusions Badges */}
                    <div className="space-y-1 bg-[#0B1F4D] p-2 rounded-xl border border-[#E6E8EC]/10 text-[11px]">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#C9A24B] font-bold block">
                          Pulpal:
                        </span>
                        <span className="text-white font-medium">{record.pulpalDiagnosis}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#C9A24B] font-bold block">
                          Periapical:
                        </span>
                        <span className="text-white font-medium">{record.periapicalDiagnosis}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#C9A24B] font-bold block">
                          Plan:
                        </span>
                        <span className="text-[#E6E8EC] font-medium">{record.treatmentPlan}</span>
                      </div>
                    </div>

                    {/* Notes Snippet with Expand */}
                    <div className="text-[11px] text-[#E6E8EC]/90 leading-relaxed">
                      <strong className="text-[10px] font-mono uppercase text-[#E6E8EC]/70 block mb-0.5">
                        Examination Notes:
                      </strong>
                      <p className={`italic ${!isExpanded ? 'line-clamp-2' : ''}`}>
                        &ldquo;{record.examinationNotes}&rdquo;
                      </p>
                      {record.examinationNotes.length > 80 && (
                        <button
                          onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                          className="text-[10px] font-mono text-[#C9A24B] hover:underline mt-1 flex items-center gap-0.5"
                        >
                          <span>{isExpanded ? 'Show Less' : 'Read Full Note'}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3 rotate-180" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Quick Load into Workup */}
                    <button
                      onClick={() => {
                        onSelectCase(record.caseId);
                        setActiveSidebarTab('workup');
                      }}
                      className="w-full py-1.5 rounded-xl bg-[#1B3A8C]/80 hover:bg-[#1B3A8C] text-[#FAF8F3] text-[11px] font-headings font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#C9A24B]/30"
                    >
                      <span>Load into Active Workup</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#C9A24B]" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
