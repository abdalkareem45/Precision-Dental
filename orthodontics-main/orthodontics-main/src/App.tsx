/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useEffect, useState } from 'react';
import { LectureTab } from './types/ortho';
import { BrandHeader } from './components/common/BrandHeader';
import { BrandLogo } from './components/common/BrandLogo';
import { AcademyOverview } from './components/common/AcademyOverview';
import { Lecture1And2View } from './components/lecture1_2/Lecture1And2View';
import { Lecture3View } from './components/lecture3/Lecture3View';
import { VirtualLabView } from './components/lab/VirtualLabView';
import { ClinicalCaseSimulator } from './components/clinical/ClinicalCaseSimulator';
import { ExamQuizModule } from './components/clinical/ExamQuizModule';
import { additionalLectures, isAdditionalLecture, tabFromHash, tabHashes } from './navigation';

const AdditionalLecture = lazy(() => import('./lectures/lectures-04-07/App'));

export default function App() {
  const [activeTab, setActiveTab] = useState<LectureTab>(() => tabFromHash(window.location.hash));

  useEffect(() => {
    const syncTab = () => setActiveTab(tabFromHash(window.location.hash));
    window.addEventListener('hashchange', syncTab);
    return () => window.removeEventListener('hashchange', syncTab);
  }, []);

  useEffect(() => {
    const lecture = additionalLectures.find(item => item.id === activeTab);
    document.title = lecture
      ? `Lecture ${lecture.number}: ${lecture.title} | Precision Dental`
      : 'Orthodontics | Precision Dental';
  }, [activeTab]);

  const selectTab = (tab: LectureTab) => {
    setActiveTab(tab);
    if (window.location.hash !== tabHashes[tab]) window.location.hash = tabHashes[tab];
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxury-navy text-slate-100 selection:bg-[#C9A24B]/40 selection:text-white overflow-x-hidden">
      {/* Sticky Brand Header */}
      <BrandHeader
        activeTab={activeTab}
        onSelectTab={selectTab}
        onOpenCaseStudy={() => selectTab('cases')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'overview' && (
          <AcademyOverview onSelectTab={selectTab} />
        )}

        {activeTab === 'lecture1_2' && (
          <Lecture1And2View />
        )}

        {activeTab === 'lecture3' && (
          <Lecture3View />
        )}

        {isAdditionalLecture(activeTab) && (
          <Suspense fallback={<p role="status" className="p-8 text-center">Loading lecture…</p>}>
            <AdditionalLecture lectureId={activeTab} />
          </Suspense>
        )}

        {activeTab === '3d_lab' && (
          <VirtualLabView />
        )}

        {activeTab === 'cases' && (
          <ClinicalCaseSimulator />
        )}

        {activeTab === 'quiz' && (
          <ExamQuizModule />
        )}
      </main>

      {/* Institutional Brand Footer */}
      <footer className="mt-16 bg-[#071330]/95 backdrop-blur-xl text-white border-t border-[#C9A24B]/30">
        <div className="h-1 bg-linear-to-r from-[#1B3A8C] via-[#C9A24B] to-[#1B3A8C]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <BrandLogo size="md" inverted={true} />

            <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1 text-xs text-slate-300">
              <span className="font-bold text-white">
                Department of Orthodontics · Precision Dental Academy
              </span>
              <span>
                5th Year Academic Curriculum 2026–2027 · Lectures 1–7
              </span>
              <span className="font-arabic text-[#DFC17B] text-sm mt-0.5">
                دقة الأسنان · تعليم تفاعلي ثلاثي الأبعاد
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>
              © 2026 Precision Dental Orthodontics Academy. All educational rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span>WCAG AA Accessible</span>
              <span>·</span>
              <span>WebGL 3D Accelerated</span>
              <span>·</span>
              <span>Fully Responsive (Tablet & Desktop)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
