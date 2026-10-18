import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { DentalLaboratory } from './components/DentalLaboratory';
import { PeriodonticsByKareemTab } from './components/PeriodonticsByKareemTab';
import { BoneLossMaster } from './components/boneLoss/BoneLossMaster';
import { FurcationMaster } from './components/furcation/FurcationMaster';
import { CpgGuidelineMaster } from './components/cpg/CpgGuidelineMaster';
import { MedicallyCompromisedMaster } from './components/medComp/MedicallyCompromisedMaster';
import { VisualMechanicsLab } from './components/VisualMechanicsLab';
import { ThreePeriodontalSandbox } from './components/ThreePeriodontalSandbox';
import { ClinicalExamSimulator } from './components/ClinicalExamSimulator';
import { StagingGradingCalculator } from './components/StagingGradingCalculator';
import { TreatmentPlanningModule } from './components/TreatmentPlanningModule';
import { BoardQuizModule } from './components/BoardQuizModule';
import { ClinicalCasesModule } from './components/ClinicalCasesModule';
import { StudentDashboard } from './components/StudentDashboard';
import {
  Boxes,
  Stethoscope,
  Table2,
  GitCommit,
  HelpCircle,
  Award,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

import { BoneDefectType } from './components/MultiToothSandbox';
import { NumberedLectureBar } from './components/NumberedLectureBar';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('furcation');
  const [activeMedCompPart, setActiveMedCompPart] = useState<'part1' | 'part2'>('part2');
  const [liveProbingPD, setLiveProbingPD] = useState<number>(2);
  const [liveProbingCAL, setLiveProbingCAL] = useState<number>(2);
  const [activeSandboxDefect, setActiveSandboxDefect] = useState<BoneDefectType>('moderate_horizontal');

  const handleProbingUpdate = (pd: number, cal: number) => {
    setLiveProbingPD(pd);
    setLiveProbingCAL(cal);
  };

  const handleLoadDefectToSandbox = (defect: BoneDefectType) => {
    setActiveSandboxDefect(defect);
    setActiveTab('sandbox');
  };

  const handleNavSelect = (tab: NavTab) => {
    if (tab === 'med_compromised_1') {
      setActiveMedCompPart('part1');
      setActiveTab('med_compromised_1');
    } else if (tab === 'med_compromised_2') {
      setActiveMedCompPart('part2');
      setActiveTab('med_compromised_2');
    } else {
      setActiveTab(tab);
    }
  };

  const handleSelectLectureFromBar = (tab: NavTab, part?: 'part1' | 'part2') => {
    if (tab === 'med_compromised' && part === 'part1') {
      setActiveMedCompPart('part1');
      setActiveTab('med_compromised_1');
    } else if (tab === 'med_compromised' && part === 'part2') {
      setActiveMedCompPart('part2');
      setActiveTab('med_compromised_2');
    } else {
      setActiveTab(tab);
      if (part) {
        setActiveMedCompPart(part);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F4D] text-[#FAF8F3] flex flex-col font-sans selection:bg-[#C9A24B] selection:text-[#0B1F4D]">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleNavSelect}
        streakDays={6}
        remindersCount={2}
      />

      {/* Main Content Viewport */}
      <main className={`flex-1 w-full mx-auto ${activeTab === 'laboratory' ? 'max-w-[1780px] p-2 sm:p-4' : 'max-w-7xl p-4 sm:p-6 lg:p-8 flex flex-col gap-6'}`}>
        {/* Universal Sorted & Numbered Lecture Curriculum Strip */}
        <NumberedLectureBar
          activeTab={activeTab}
          activePart={activeMedCompPart}
          onSelectTab={handleSelectLectureFromBar}
        />

        {/* Dedicated Flagship Tab: Periodontics by Kareem - Lectures 1, 2, 3, 4 */}
        {activeTab === 'kareem_lectures' && (
          <PeriodonticsByKareemTab onNavigateTab={(tab) => handleNavSelect(tab as NavTab)} />
        )}

        {/* Lecture 1: Bone Loss and Patterns of Bone Destruction */}
        {activeTab === 'boneloss' && (
          <BoneLossMaster />
        )}

        {/* Lecture 2: Furcation Involvement Part I (Dr. Maha Shukri) */}
        {activeTab === 'furcation' && (
          <FurcationMaster />
        )}

        {/* Lecture 3: Clinical Practice Guideline for Treatment of Periodontitis (Dr. Alaa Omran) */}
        {activeTab === 'cpg_guidelines' && (
          <CpgGuidelineMaster />
        )}

        {/* Lecture 4: Medically Compromised Patients - Part I (Dr. Maha Shukri) */}
        {activeTab === 'med_compromised_1' && (
          <MedicallyCompromisedMaster initialPart="part1" />
        )}

        {/* Lecture 5: Medically Compromised Patients - Part II (Dr. Maha Shukri) */}
        {activeTab === 'med_compromised_2' && (
          <MedicallyCompromisedMaster initialPart="part2" />
        )}

        {/* Lectures 4 & 5 Fallback (Dr. Maha Shukri) */}
        {activeTab === 'med_compromised' && (
          <MedicallyCompromisedMaster initialPart={activeMedCompPart} />
        )}
        {/* Flagship Feature: 3D Dental Anatomy Laboratory */}
        {activeTab === 'laboratory' && (
          <DentalLaboratory />
        )}

        {/* Feature: Visual Mechanics & Periodontics Lecture Notes */}
        {activeTab === 'mechanics' && (
          <VisualMechanicsLab />
        )}

        {/* Module 1: 3D Anatomy & Pathology Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Boxes className="w-6 h-6 text-cyan-400" />
                  3D Periodontal Anatomy &amp; Pathology Sandbox
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Manipulate 3D tooth layers, simulate pocket depths &amp; clinical attachment loss, and visualize horizontal &amp; angular bone loss.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('diagnostics')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
                >
                  <span>Go to BOP Exam</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>

            <ThreePeriodontalSandbox
              initialDefect={activeSandboxDefect}
              onProbingUpdate={handleProbingUpdate}
            />
          </div>
        )}

        {/* Module 2: Clinical Examination & Diagnostics Simulator */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-rose-400" />
                  Clinical Examination &amp; Diagnostics Simulator
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Interactive 6-site Bleeding on Probing (BOP) mapping, Miller tooth mobility physics tester, Glickman furcation, and panoramic radiograph correlator.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('staging')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
              >
                <span>Stage This Case</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            <ClinicalExamSimulator onLoadDefectToSandbox={handleLoadDefectToSandbox} />
          </div>
        )}

        {/* Module 3: 2018 World Workshop Staging & Grading Matrix */}
        {activeTab === 'staging' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Table2 className="w-6 h-6 text-amber-400" />
                  2018 EFP / AAP Staging &amp; Grading Matrix Builder
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Compute Stage I–IV and Grade A–C dynamically using Tonetti, Greenwell, &amp; Kornman Tables 7 &amp; 8 with real-time risk factor modifier shifts.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('treatment')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
              >
                <span>View Treatment Steps</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>

            <StagingGradingCalculator />
          </div>
        )}

        {/* Module 4: Stepwise Treatment Planning & Stage IV Phenotypes */}
        {activeTab === 'treatment' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <GitCommit className="w-6 h-6 text-blue-400" />
                  Stepwise Treatment Planning &amp; Stage IV Interdisciplinary Phenotypes
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  EFP S3 Level clinical practice guidelines (Steps 1 to 4) and specialized Stage IV management across Case Types 1 through 4.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('quiz')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
              >
                <span>Take Board Quiz</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>

            <TreatmentPlanningModule />
          </div>
        )}

        {/* Learning Feature 1: Interactive Board Quiz */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-purple-400" />
                  Iraqi 5th-Stage &amp; Board MCQ Practice Simulator
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  20 board-level multiple choice questions with authentic clinical rationales cited directly from Carranza 13th Ed. and EFP guidelines.
                </p>
              </div>
            </div>

            <BoardQuizModule />
          </div>
        )}

        {/* Learning Feature 2: Clinical Board Cases */}
        {activeTab === 'cases' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-emerald-400" />
                  Virtual Patient Clinical Vignettes
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Real-world patient cases modeled after Iraqi clinical board exam criteria with diagnostic evaluation and model faculty solutions.
                </p>
              </div>
            </div>

            <ClinicalCasesModule />
          </div>
        )}

        {/* Learning Feature 3: Student Progress & Reminders Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-indigo-400" />
                  Student Clinical Competency &amp; Reminders Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Track university quota completion, manage spaced repetition reminders, review high-yield clinical pearls, and print patient charts.
                </p>
              </div>
            </div>

            <StudentDashboard />
          </div>
        )}
      </main>

      {/* Academic Brand Footer */}
      <footer className="bg-[#071433] border-t border-[#E6E8EC]/15 py-8 px-4 text-xs text-[#E6E8EC]/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#FAF8F3] tracking-tight text-sm font-sans">
              Precision <span className="text-[#C9A24B]">Dental</span>
            </span>
            <span dir="rtl" className="font-arabic font-bold text-xs text-[#dfbe6e] px-2 py-0.5 rounded bg-[#0B1F4D] border border-[#C9A24B]/30">
              دقّة الأسنان
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[#C9A24B] font-medium hidden sm:inline">
              "Precision in Every Smile"
            </span>
          </div>

          <div className="text-[11px] text-[#E6E8EC]/60 font-sans text-center md:text-right space-y-0.5">
            <div>Advanced Dentistry for a Brighter Tomorrow • Curriculum Companion</div>
            <div className="font-mono text-[10px] text-slate-400">References: Carranza 13th Ed. • EFP S3 CPG 2020 • 2017 World Workshop</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
