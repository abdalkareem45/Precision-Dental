import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Stethoscope, Syringe } from 'lucide-react';

const Lecture01 = lazy(() => import('./Lecture01'));
const Lecture02 = lazy(() => import('./lectures/lecture-02/App'));

const lectures = [
  {
    id: 'lecture-1',
    number: 1,
    title: 'Endodontic Diagnosis',
    description: 'Explore tooth anatomy, pulpal pain, clinical tests, cracked teeth, and diagnostic cases.',
    icon: Stethoscope,
    component: Lecture01,
  },
  {
    id: 'lecture-2',
    number: 2,
    title: 'Pain Control in Endodontics',
    description: 'Study neurophysiology, local anesthesia, supplemental techniques, and referred pain with simulators and a knowledge check.',
    icon: Syringe,
    component: Lecture02,
  },
];

function selectedLecture() {
  return lectures.find(lecture => `#${lecture.id}` === window.location.hash);
}

export default function App() {
  const [lecture, setLecture] = useState(selectedLecture);

  useEffect(() => {
    const syncLecture = () => setLecture(selectedLecture());
    window.addEventListener('hashchange', syncLecture);
    return () => window.removeEventListener('hashchange', syncLecture);
  }, []);

  useEffect(() => {
    document.title = lecture
      ? `Lecture ${lecture.number}: ${lecture.title} | Precision Dental`
      : 'Endodontics | Precision Dental';
  }, [lecture]);

  const ActiveLecture = lecture?.component;

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-deep-navy text-ivory-white">
      <nav aria-label="Endodontics lectures" className="shrink-0 border-b border-precision-gold/30 bg-deep-navy px-3 py-2 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <a href="../index.html" className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-royal-blue focus-visible:outline-2 focus-visible:outline-precision-gold">
            <ArrowLeft size={15} aria-hidden="true" /> All subjects
          </a>
          <div className="flex flex-wrap items-center gap-1 text-xs font-semibold">
            <a href="#" aria-current={!lecture ? 'page' : undefined} className="rounded-lg px-2 py-1.5 hover:bg-royal-blue aria-[current=page]:bg-royal-blue">Endodontics</a>
            {lectures.map(item => (
              <a key={item.id} href={`#${item.id}`} aria-current={lecture?.id === item.id ? 'page' : undefined}
                className="rounded-lg px-2 py-1.5 hover:bg-royal-blue aria-[current=page]:bg-precision-gold aria-[current=page]:text-deep-navy">
                Lecture {item.number}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div key={lecture?.id ?? 'lectures'} className="min-h-0 flex-1 overflow-auto">
        {ActiveLecture ? (
          <Suspense fallback={<p role="status" className="p-8 text-center">Loading lecture…</p>}>
            <ActiveLecture />
          </Suspense>
        ) : (
          <main className="mx-auto max-w-5xl px-5 py-12 sm:py-20">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-precision-gold">
              <BookOpen size={18} aria-hidden="true" /> Precision Dental · 2 Lectures
            </div>
            <h1 className="text-3xl font-extrabold sm:text-5xl">Endodontics</h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-marble-grey">Choose a lecture to open its interactive study tools, clinical cases, and learning materials.</p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {lectures.map(item => (
                <a key={item.id} href={`#${item.id}`} className="group flex flex-col rounded-2xl border border-precision-gold/30 bg-deep-navy-light p-6 transition hover:border-precision-gold focus-visible:outline-2 focus-visible:outline-precision-gold">
                  <item.icon size={30} className="mb-5 text-precision-gold" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-widest text-precision-gold">Lecture {item.number}</span>
                  <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
                  <p className="mb-6 mt-3 flex-1 text-sm leading-relaxed text-marble-grey">{item.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-precision-gold">Open lecture <ArrowRight size={16} aria-hidden="true" /></span>
                </a>
              ))}
            </div>
            <p className="mt-8 text-xs leading-relaxed text-marble-grey">Educational simulations only. Clinical decisions require professional assessment and current clinical guidance.</p>
          </main>
        )}
      </div>
    </div>
  );
}
