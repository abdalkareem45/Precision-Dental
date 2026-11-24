import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { LECTURES as STUDIO_LECTURES } from './lectures/simulation-studio/data/lectures';

const Foundations = lazy(() => import('./App'));
const SimulationStudio = lazy(() => import('./lectures/simulation-studio/App'));

const foundations = [
  { id: 'lecture-1', number: 1, title: 'ACP Classification', summary: 'Classification of the completely edentulous patient, diagnostic criteria, bone assessment, clinical cases, and knowledge checks.', legacyId: 'lec1' },
  { id: 'lecture-2', number: 2, title: 'Single Complete Dentures', summary: 'Material selection, occlusal modification, clinical workflows, stress and wear, and prognosis.', legacyId: 'lec2' },
  { id: 'lecture-3', number: 3, title: 'Abnormal Jaw Relations & Kelly’s Syndrome', summary: 'Class II and III discrepancies, combination syndrome, occlusion, fracture risk, and clinical simulations.', legacyId: 'lec3' },
];
const lectures = [
  ...foundations,
  ...STUDIO_LECTURES.map(lecture => ({
    id: lecture.id, number: lecture.number, title: lecture.title, summary: lecture.hero.subheadline,
  })),
];

function selectedLecture() {
  return lectures.find(lecture => `#${lecture.id}` === window.location.hash);
}

export default function SubjectApp() {
  const [lecture, setLecture] = useState(selectedLecture);
  const foundation = foundations.find(item => item.id === lecture?.id);
  const studio = STUDIO_LECTURES.find(item => item.id === lecture?.id);

  useEffect(() => {
    const sync = () => setLecture(selectedLecture());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    document.title = lecture
      ? `Lecture ${lecture.number}: ${lecture.title} | Precision Dental`
      : 'Prosthodontics | Precision Dental';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [lecture]);

  const selectFoundation = useCallback((id: string) => {
    const next = foundations.find(item => item.legacyId === id);
    if (next) window.location.hash = next.id;
  }, []);

  return (
    <div className="min-h-screen bg-clinical text-slatenavy">
      <nav aria-label="Prosthodontics lectures" className="border-b border-prostgold/40 bg-navybrand px-3 py-3 text-white">
        <div className="mx-auto flex max-w-[1550px] flex-wrap items-center justify-between gap-3">
          <a href="../index.html" className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-maxblue focus-visible:outline-2 focus-visible:outline-prostgold">
            <ArrowLeft size={15} aria-hidden="true" /> All subjects
          </a>
          <div className="flex flex-wrap items-center gap-1 text-xs font-semibold">
            <a href="#" aria-current={!lecture ? 'page' : undefined} className="rounded-lg px-2 py-1.5 hover:bg-maxblue aria-[current=page]:bg-maxblue">Prosthodontics</a>
            {lectures.map(item => (
              <a key={item.id} href={`#${item.id}`} aria-current={lecture?.id === item.id ? 'page' : undefined}
                className="rounded-lg px-2 py-1.5 hover:bg-maxblue aria-[current=page]:bg-prostgold aria-[current=page]:text-navybrand">
                Lecture {item.number}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Suspense fallback={<p role="status" className="p-8 text-center">Loading lecture…</p>}>
        {foundation ? (
          <Foundations lectureId={foundation.legacyId} onLectureChange={selectFoundation} />
        ) : studio ? (
          <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-bold text-maxblue">Lecture {studio.number}</p>
              <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{studio.title}</h1>
              <p className="mt-2 text-sm text-slate-600">{studio.hero.subheadline}</p>
            </div>
            <SimulationStudio lectureId={studio.id} />
          </main>
        ) : (
          <main className="mx-auto max-w-6xl px-5 py-12 sm:py-20">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-maxblue"><BookOpen size={18} aria-hidden="true" /> Precision Dental · {lectures.length} Lectures</div>
            <h1 className="text-3xl font-extrabold sm:text-5xl">Prosthodontics</h1>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">Choose a lecture to study the original foundations or explore the simulation studio with 3D models, clinical cases, quizzes, and source PDFs.</p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {lectures.map(item => (
                <a key={item.id} href={`#${item.id}`} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-prostgold focus-visible:outline-2 focus-visible:outline-maxblue">
                  <span className="text-xs font-bold uppercase tracking-widest text-maxblue">Lecture {item.number}</span>
                  <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
                  <p className="mb-6 mt-3 flex-1 text-sm leading-relaxed text-slate-600">{item.summary}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-maxblue">Open lecture <ArrowRight size={16} aria-hidden="true" /></span>
                </a>
              ))}
            </div>
            <p className="mt-8 text-xs leading-relaxed text-slate-500">Educational simulations only. Clinical decisions require professional assessment and current clinical guidance.</p>
          </main>
        )}
      </Suspense>
    </div>
  );
}
