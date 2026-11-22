import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { CROWN_LECTURES, isFoundation, isVirtualLab, lectureHash, pageFromHash, type CrownPage } from './navigation';

const Foundations = lazy(() => import('./Foundations'));
const VirtualLab = lazy(() => import('./lectures/virtual-lab/App'));

export default function App() {
  const [page, setPage] = useState<CrownPage>(() => pageFromHash(window.location.hash));

  useEffect(() => {
    const syncPage = () => setPage(pageFromHash(window.location.hash));
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  useEffect(() => {
    const lecture = CROWN_LECTURES.find(item => item.id === page);
    document.title = lecture
      ? `${lecture.numberLabel}: ${lecture.title} | Precision Dental`
      : 'Crown & Bridge | Precision Dental';
  }, [page]);

  const selectPage = (next: CrownPage) => {
    setPage(next);
    if (window.location.hash !== lectureHash(next)) window.location.hash = lectureHash(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-ivory text-navy">
      <header className="sticky top-0 z-50 border-b border-gold/40 bg-navy text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <a href="#" onClick={event => { event.preventDefault(); selectPage('overview'); }}
              className="rounded font-bold text-[#DFC17B] focus-visible:outline-2 focus-visible:outline-white">Precision Dental · Crown &amp; Bridge</a>
            <p className="mt-1 text-xs text-slate-200">{CROWN_LECTURES.length} learning modules · Original lectures and virtual simulation lab</p>
          </div>
          <a href="../index.html" className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white">
            <ArrowLeft size={14} aria-hidden="true" /> All subjects
          </a>
          <div className="flex w-full flex-wrap items-center gap-2">
            <a href="#" aria-current={page === 'overview' ? 'page' : undefined}
              onClick={event => { event.preventDefault(); selectPage('overview'); }}
              className="rounded-lg border border-white/30 px-3 py-2 text-xs font-semibold aria-[current=page]:bg-gold aria-[current=page]:text-navy focus-visible:outline-2 focus-visible:outline-white">All lectures</a>
            <label htmlFor="crown-lecture-select" className="text-xs font-semibold">Select lecture</label>
            <select id="crown-lecture-select" value={page} onChange={event => selectPage(event.target.value as CrownPage)}
              className="min-w-0 flex-1 rounded-lg border border-white/30 bg-navy px-2 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-gold">
              <option value="overview">All lectures</option>
              {CROWN_LECTURES.map(lecture => <option key={lecture.id} value={lecture.id}>{lecture.numberLabel}: {lecture.title}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main>
        {page === 'overview' ? (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <h1 className="text-3xl font-extrabold">Crown &amp; Bridge</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">Choose one of {CROWN_LECTURES.length} learning modules. The original Lectures 1–3 are preserved alongside nine new simulation modules. Source labels include split lectures 7A/7B and 10A/10B; Lectures 8 and 9 were not supplied.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {CROWN_LECTURES.map(lecture => (
                <a key={lecture.id} href={lectureHash(lecture.id)} onClick={event => { event.preventDefault(); selectPage(lecture.id); }}
                  className="flex flex-col rounded-2xl border border-gold/40 bg-white p-5 shadow-sm transition hover:border-royal focus-visible:outline-2 focus-visible:outline-royal">
                  <BookOpen size={25} className="mb-4 text-royal" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase text-[#886619]">{lecture.numberLabel}</span>
                  <h2 className="mt-2 text-lg font-bold">{lecture.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{lecture.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-royal">Open lecture <ArrowRight size={15} aria-hidden="true" /></span>
                </a>
              ))}
            </div>
            <p className="mt-8 text-xs leading-relaxed text-slate-600">Educational simulations only. Simplified models and source-derived thresholds are not patient-specific treatment guidance; clinical use requires qualified professional review.</p>
          </div>
        ) : (
          <Suspense fallback={<p role="status" className="p-8 text-center">Loading lecture…</p>}>
            {isFoundation(page) && <Foundations lectureId={page} onSelectLecture={selectPage} />}
            {isVirtualLab(page) && <VirtualLab key={page} lectureId={page} onSelectLecture={selectPage} />}
          </Suspense>
        )}
      </main>
    </div>
  );
}
