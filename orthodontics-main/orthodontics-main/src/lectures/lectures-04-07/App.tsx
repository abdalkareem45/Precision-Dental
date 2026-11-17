import { Suspense, lazy, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { LECTURES_META } from './data/lecturesMeta';
import { LECTURE_ASSETS } from './data/assets';
import type { LectureId } from './types/lecture';
import './content.css';

const LECTURE_VIEWS = {
  'lecture-4': lazy(() => import('./components/lectures/lecture4/Lecture4View')),
  'lecture-5': lazy(() => import('./components/lectures/lecture5/Lecture5View')),
  'lecture-6': lazy(() => import('./components/lectures/lecture6/Lecture6View')),
  'lecture-7': lazy(() => import('./components/lectures/lecture7/Lecture7View')),
};

export interface OrthodonticsLectureContentProps {
  lectureId: LectureId;
}

function ReadyContent({ children, onReady }: { children: ReactNode; onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return children;
}

function LectureContent({ lectureId }: OrthodonticsLectureContentProps) {
  const activeLecture = LECTURES_META.find((lecture) => lecture.id === lectureId)!;
  const LectureView = LECTURE_VIEWS[lectureId];
  const rootRef = useRef<HTMLElement>(null);
  const pendingJumpRef = useRef<string | null>(null);
  const titleId = `lec${activeLecture.number}-title`;
  const summaryId = `lec${activeLecture.number}-summary`;

  const scrollToSection = useCallback((sectionId: string) => {
    const section = rootRef.current?.querySelector<HTMLElement>(`#${sectionId}`);
    if (!section) {
      pendingJumpRef.current = sectionId;
      return;
    }
    pendingJumpRef.current = null;
    section.tabIndex = -1;
    section.focus({ preventScroll: true });
    section.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  }, []);

  const onReady = useCallback(() => {
    if (pendingJumpRef.current) scrollToSection(pendingJumpRef.current);
  }, [scrollToSection]);

  return (
    <article
      ref={rootRef}
      aria-labelledby={titleId}
      className="ortho-04-07 w-full max-w-305 mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 bg-[#FAF8F3] text-[#0B1F4D]"
    >
      <section aria-labelledby={titleId} className="bg-white border border-[#E6E8EC] rounded-xl p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-semibold text-[#8A691B]">
              <span>{activeLecture.sourceLabel}</span>
              <span aria-hidden="true" className="mx-2 text-[#CBD5E1]">·</span>
              <span className="text-[#1B3A8C]">1 3D Sandbox + 4 2D Sandboxes</span>
            </p>
            <h2 id={titleId} className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4D] tracking-tight text-balance">
              Lecture {activeLecture.number}: {activeLecture.title}
            </h2>
            <p className="text-sm sm:text-base text-[#334155] leading-relaxed">{activeLecture.subtitle}</p>
            <a
              href={LECTURE_ASSETS.pdfs[lectureId]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-semibold text-[#1B3A8C] underline underline-offset-4"
            >
              Lecture {activeLecture.number} source notes (PDF, opens in a new tab)
            </a>
          </div>
          <div className="lg:w-107.5 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4">
            <h3 className="text-xs font-bold text-[#0B1F4D] tracking-wide mb-2.5">Learning Objectives</h3>
            <ul className="space-y-2">
              {activeLecture.objectives.map((objective, index) => (
                <li key={objective} className="flex items-start gap-2.5 text-xs text-[#334155] leading-relaxed">
                  <span className="font-mono font-bold text-[#1B3A8C] shrink-0">0{index + 1}.</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav aria-label={`Lecture ${activeLecture.number} sandbox jumps`} className="mt-6 pt-4 border-t border-[#E6E8EC] flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#64748B] mr-1">Jump to sandbox:</span>
          {activeLecture.sandboxes.map((sandbox) => (
            <button
              key={sandbox.id}
              type="button"
              onClick={() => scrollToSection(sandbox.id)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FAF8F3] border border-[#E6E8EC] text-[#0B1F4D] hover:border-[#1B3A8C] hover:text-[#1B3A8C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="text-[#8A691B] mr-1.5">{sandbox.kind === '3D Sandbox' ? '3D' : sandbox.kind === '2D Sandbox' ? '2D' : 'Quiz'}</span>
              {sandbox.label}
            </button>
          ))}
        </nav>
      </section>

      <Suspense fallback={
        <div role="status" className="bg-white border border-[#E6E8EC] rounded-xl p-8 text-center text-sm font-medium text-[#475569]">
          Loading interactive 3D and 2D sandboxes for Lecture {activeLecture.number}…
        </div>
      }>
        <ReadyContent onReady={onReady}>
          <LectureView meta={activeLecture} />
        </ReadyContent>
      </Suspense>

      <section aria-labelledby={summaryId} className="bg-white border border-[#E6E8EC] rounded-xl p-5 sm:p-6 space-y-4">
        <h3 id={summaryId} className="text-base sm:text-lg font-bold text-[#0B1F4D]">
          Lecture {activeLecture.number} Summary &amp; Clinical Scope
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeLecture.summaryPoints.map((point, index) => (
            <li key={point} className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#E6E8EC] text-xs sm:text-sm text-[#334155] leading-relaxed flex items-start gap-2.5">
              <span className="font-mono font-bold text-[#C9A24B] shrink-0">0{index + 1}</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-[#475569] leading-relaxed pt-2 border-t border-[#E6E8EC]">
          <strong className="text-[#0B1F4D]">Educational Use &amp; Limitations:</strong>{' '}
          {activeLecture.limitationsNote}
        </p>
      </section>
    </article>
  );
}

export default function OrthodonticsLectureContent(props: OrthodonticsLectureContentProps) {
  return <LectureContent key={props.lectureId} {...props} />;
}
