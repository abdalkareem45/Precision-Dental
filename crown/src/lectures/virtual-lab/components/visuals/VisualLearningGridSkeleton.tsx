import React from 'react';

interface VisualLearningGridSkeletonProps {
  cardCount?: number;
}

export const VisualLearningGridSkeleton: React.FC<VisualLearningGridSkeletonProps> = ({
  cardCount = 6,
}) => {
  const halfCardCount = Math.max(2, cardCount - 2);

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading Visual Learning System"
      className="space-y-4"
    >
      <span className="sr-only">Loading visual learning infographics and diagrams...</span>

      {/* Section Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div className="space-y-2">
          <div className="h-7 w-60 rounded-lg skeleton-shimmer" />
          <div className="h-3.5 w-80 max-w-full rounded-md skeleton-shimmer" />
        </div>
      </div>

      {/* Cards Grid Skeleton matching VisualLearningGrid proportions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Full-Width Hotspot Diagram Card Skeleton */}
        <div className="lg:col-span-2 rounded-2xl border border-marble bg-white p-5 shadow-sm space-y-4">
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded skeleton-shimmer" />
            <div className="h-5 w-72 max-w-full rounded-md skeleton-shimmer" />
            <div className="h-3.5 w-96 max-w-full rounded skeleton-shimmer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7 h-56 rounded-xl border border-marble skeleton-shimmer" />
            <div className="md:col-span-5 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4].map((chip) => (
                  <div key={chip} className="h-7 w-24 rounded-md skeleton-shimmer" />
                ))}
              </div>
              <div className="rounded-xl border border-marble bg-ivory/60 p-3.5 space-y-2">
                <div className="h-4 w-44 rounded skeleton-shimmer" />
                <div className="h-3 w-full rounded skeleton-shimmer" />
                <div className="h-3 w-5/6 rounded skeleton-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Standard Half-Width Visual Module Card Skeletons */}
        {Array.from({ length: halfCardCount }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-marble bg-white p-5 shadow-sm flex flex-col justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="h-3 w-24 rounded skeleton-shimmer" />
              <div className="h-5 w-56 max-w-full rounded-md skeleton-shimmer" />
              <div className="h-3.5 w-72 max-w-full rounded skeleton-shimmer" />
            </div>

            {idx % 2 === 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {[1, 2, 3, 4].map((cell) => (
                  <div
                    key={cell}
                    className="rounded-xl border border-marble bg-ivory/50 p-3 space-y-2"
                  >
                    <div className="h-3 w-16 rounded skeleton-shimmer" />
                    <div className="h-5 w-20 rounded skeleton-shimmer" />
                    <div className="h-2.5 w-24 rounded skeleton-shimmer" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {[1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className="h-10 w-full rounded-lg border border-marble/60 skeleton-shimmer"
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Full-Width Comparison Table Card Skeleton */}
        <div className="lg:col-span-2 rounded-2xl border border-marble bg-white p-5 shadow-sm space-y-4">
          <div className="space-y-1.5">
            <div className="h-3 w-32 rounded skeleton-shimmer" />
            <div className="h-5 w-64 max-w-full rounded-md skeleton-shimmer" />
          </div>
          <div className="space-y-2">
            <div className="h-9 w-full rounded-lg skeleton-shimmer" />
            <div className="h-10 w-full rounded-lg skeleton-shimmer" />
            <div className="h-10 w-full rounded-lg skeleton-shimmer" />
            <div className="h-10 w-full rounded-lg skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};
