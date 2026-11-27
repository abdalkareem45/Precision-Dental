import { useEffect, useState } from 'react';
import { getLectureById } from '@/src/data/lectures';
import { useLearningStore } from '@/src/store/useLearningStore';
import { TopNavbar } from '@/src/components/TopNavbar';
import { HomeDashboard } from '@/src/components/HomeDashboard';
import { LectureWorkspace } from '@/src/components/lecture/LectureWorkspace';
import { AiTutorDrawer } from '@/src/components/AiTutorDrawer';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';

export default function App() {
  const {
    theme,
    activeLectureId,
    openLecture,
    goHome,
    incrementStudySeconds,
  } = useLearningStore();

  const activeLecture = getLectureById(activeLectureId);
  const [hashHydrated, setHashHydrated] = useState(false);

  // Sync Tailwind dark class with store theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Initial URL hash hydration + hashchange/popstate support for direct links, refresh, Back/Forward
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash || hash === 'home') {
        if (useLearningStore.getState().activeLectureId !== null) {
          goHome();
        }
        return;
      }
      const found = getLectureById(hash);
      if (found && useLearningStore.getState().activeLectureId !== found.id) {
        openLecture(found.id);
      }
    };

    applyHash();
    setHashHydrated(true);
    window.addEventListener('hashchange', applyHash);
    window.addEventListener('popstate', applyHash);
    return () => {
      window.removeEventListener('hashchange', applyHash);
      window.removeEventListener('popstate', applyHash);
    };
  }, [openLecture, goHome]);

  // Update URL hash & document.title only after initial hash hydration completes
  useEffect(() => {
    document.title = activeLecture
      ? `Lec ${String(activeLecture.number).padStart(2, '0')}: ${activeLecture.shortTitle} | Precision Dental`
      : 'Precision Dental — Oral Medicine Explorer';

    if (!hashHydrated) return;
    const targetHash = activeLecture ? `#${activeLecture.id}` : '#home';
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
  }, [activeLecture, hashHydrated]);

  // Active study timer (counts only while browser tab is visible)
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        incrementStudySeconds(1);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [incrementStudySeconds]);

  const handleNavigateHomeSection = (anchorId: string) => {
    document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#0B1F4D] dark:bg-[#0B1220] dark:text-[#F9FAFB] transition-colors">
      <div className="bg-[#0B1F4D] px-4 py-2 text-center text-xs text-white sm:text-sm">
        Looking for the original Oral Medicine lectures?{' '}
        <a
          href="../oral-med-12-main/index.html"
          className="font-semibold text-[#E4C16E] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Open the previous lecture collection
        </a>
      </div>
      <TopNavbar onNavigateHomeSection={handleNavigateHomeSection} />
      <main className="max-w-full">
        <ErrorBoundary
          title="Oral Medicine Workspace Recovery"
          fallbackDescription="An unexpected rendering issue occurred. Click Reload Module or return to the dashboard."
          onReset={goHome}
        >
          {activeLecture ? (
            <LectureWorkspace lecture={activeLecture} />
          ) : (
            <HomeDashboard />
          )}
        </ErrorBoundary>
      </main>
      <AiTutorDrawer />
    </div>
  );
}
