/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LearningProvider, useLearning } from './context/LearningContext';
import { SidebarNavigation } from './components/navigation/SidebarNavigation';
import { ClinicalHeader } from './components/navigation/ClinicalHeader';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { DiseaseModuleView } from './components/modules/DiseaseModuleView';
import { OralDiseaseSimulatorSandbox } from './components/sandboxes/OralDiseaseSimulatorSandbox';
import { DiagnosticReasoningSandbox } from './components/sandboxes/DiagnosticReasoningSandbox';
import { TreatmentPlanningSandbox } from './components/sandboxes/TreatmentPlanningSandbox';
import { HistopathologySandbox } from './components/sandboxes/HistopathologySandbox';
import { MicrobiologyLabSandbox } from './components/sandboxes/MicrobiologyLabSandbox';
import { FlashcardsViewer } from './components/study/FlashcardsViewer';
import { ActiveRecallQuiz } from './components/study/ActiveRecallQuiz';
import { FeynmanTeachBack } from './components/study/FeynmanTeachBack';
import { DifferentialMatrix } from './components/study/DifferentialMatrix';
import { ClinicalImageModal } from './components/ui/ClinicalImageModal';
import { AIAssistantModal } from './components/study/AIAssistantModal';
import { Lecture1MasterView } from './components/lecture1/Lecture1MasterView';

function AppContent() {
  const { activeTab, setActiveTab, activeDisease } = useLearning();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-cloud text-brand-navy flex font-sans selection:bg-brand-gold/30 selection:text-brand-navy antialiased">
      {/* Unified Single Sidebar Navigation */}
      <SidebarNavigation
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by lg:ml-72 for sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        {/* Sleek Clinical Header Status Bar */}
        <ClinicalHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Viewport Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'lecture-1' && <Lecture1MasterView />}
          {activeTab === 'overview' && <MainDashboard />}
          {activeTab === 'disease-module' && (
            <DiseaseModuleView diseaseId={activeDisease} onNavigateTab={setActiveTab} />
          )}
          {activeTab === 'sandbox-oral-3d' && <OralDiseaseSimulatorSandbox />}
          {activeTab === 'sandbox-diagnostic' && <DiagnosticReasoningSandbox />}
          {activeTab === 'sandbox-treatment' && <TreatmentPlanningSandbox />}
          {activeTab === 'sandbox-histo' && <HistopathologySandbox />}
          {activeTab === 'sandbox-microbio' && <MicrobiologyLabSandbox />}
          {activeTab === 'study-cards' && <FlashcardsViewer />}
          {activeTab === 'study-quiz' && <ActiveRecallQuiz />}
          {activeTab === 'study-feynman' && <FeynmanTeachBack />}
          {activeTab === 'study-matrix' && <DifferentialMatrix />}
        </main>

        {/* Clinical Workspace Footer */}
        <footer className="border-t border-brand-marble bg-brand-cloud py-4 px-6 text-center text-xs text-brand-navy/60">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-brand-navy">Precision Dental Education</span>
              <span aria-hidden="true" className="text-brand-gold">·</span>
              <span>Ulcerative, Vesicular, and Bullous Lesions Clinical Workstation</span>
            </div>
            <div className="text-slate-600 font-mono text-[11px] text-center sm:text-right">
              Grounded strictly in official lecture slides & board exam rubrics
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ClinicalImageModal />
      <AIAssistantModal />
    </div>
  );
}

export default function App() {
  return (
    <LearningProvider>
      <AppContent />
    </LearningProvider>
  );
}
