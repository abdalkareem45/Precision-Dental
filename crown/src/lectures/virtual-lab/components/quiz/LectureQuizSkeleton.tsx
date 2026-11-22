import React from 'react';

interface LectureQuizSkeletonProps {
  questionCount?: number;
}

export const LectureQuizSkeleton: React.FC<LectureQuizSkeletonProps> = ({
  questionCount = 4,
}) => {
  return (
    <section
      role="status"
      aria-busy="true"
      aria-label="Loading Interactive Lecture Assessment"
      className="rounded-2xl border border-marble bg-white p-5 sm:p-6 shadow-sm space-y-5"
    >
      <span className="sr-only">Loading lecture quiz questions and scoring controls...</span>

      {/* Header Skeleton matching LectureQuizModule */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-marble pb-4">
        <div className="space-y-2">
          <div className="h-3 w-44 rounded skeleton-shimmer" />
          <div className="h-6 w-72 max-w-full rounded-md skeleton-shimmer" />
          <div className="h-3.5 w-80 max-w-full rounded skeleton-shimmer" />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="h-8 w-36 rounded-lg skeleton-shimmer" />
          <div className="h-9 w-28 rounded-lg skeleton-shimmer" />
        </div>
      </div>

      {/* Question Fieldset Skeletons */}
      <div className="space-y-4">
        {Array.from({ length: questionCount }).map((_, qIdx) => (
          <div
            key={qIdx}
            className="rounded-xl border border-marble bg-ivory/40 p-4 space-y-3"
          >
            <div className="h-3.5 w-36 rounded skeleton-shimmer" />
            <div className="space-y-1.5">
              <div className="h-4 w-11/12 rounded skeleton-shimmer" />
              <div className="h-4 w-3/4 rounded skeleton-shimmer" />
            </div>

            <div className="space-y-2 pt-1">
              {[1, 2, 3, 4].map((optIdx) => (
                <div
                  key={optIdx}
                  className="h-10 w-full rounded-xl border border-marble/70 skeleton-shimmer"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submission Footer Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-marble">
        <div className="h-4 w-40 rounded skeleton-shimmer" />
        <div className="h-10 w-36 rounded-lg skeleton-shimmer shrink-0" />
      </div>
    </section>
  );
};
