import { useEffect, useRef } from 'react';

export interface CanvasResizeMetrics {
  width: number;
  height: number;
  aspect: number;
  dpr: number;
}

interface UseCanvasResizeOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  isSoftwareGl?: boolean;
  debounceMs?: number;
  onResize: (metrics: CanvasResizeMetrics) => void;
}

/**
 * Custom ResizeObserver hook (`useCanvasResize`) for Three.js 3D containers:
 * - Monitors parent container dimensions via ResizeObserver + window resize & orientation events
 * - Dynamically recalculates camera aspect ratio and clamped pixel density (DPR)
 * - Uses debounced + requestAnimationFrame layout synchronization to prevent rendering glitches
 */
export function useCanvasResize({
  containerRef,
  isSoftwareGl = false,
  debounceMs = 45,
  onResize,
}: UseCanvasResizeOptions): void {
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let debounceTimer: number | null = null;
    let rafId = 0;
    let lastW = 0;
    let lastH = 0;
    let lastDpr = 0;

    const getClampedDpr = () =>
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);

    const syncMetrics = (rawW?: number, rawH?: number) => {
      if (disposed) return;
      const rect = container.getBoundingClientRect();
      const width = Math.round(typeof rawW === 'number' ? rawW : rect.width || container.clientWidth);
      const height = Math.round(typeof rawH === 'number' ? rawH : rect.height || container.clientHeight);
      const dpr = getClampedDpr();

      if (width < 10 || height < 10) return;
      if (width === lastW && height === lastH && dpr === lastDpr) return;

      lastW = width;
      lastH = height;
      lastDpr = dpr;

      onResizeRef.current({
        width,
        height,
        aspect: width / height,
        dpr,
      });
    };

    const scheduleDebouncedSync = (rawW?: number, rawH?: number) => {
      if (disposed) return;
      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer);
      }
      debounceTimer = window.setTimeout(() => {
        debounceTimer = null;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          syncMetrics(rawW, rawH);
        });
      }, debounceMs);
    };

    // Initial synchronous calculation
    syncMetrics();

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      scheduleDebouncedSync(entry.contentRect.width, entry.contentRect.height);
    });
    resizeObserver.observe(container);

    const onWindowResize = () => scheduleDebouncedSync();
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('orientationchange', onWindowResize);

    let dprMedia: MediaQueryList | null = null;
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      dprMedia = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      dprMedia.addEventListener?.('change', onWindowResize);
    }

    return () => {
      disposed = true;
      if (debounceTimer !== null) window.clearTimeout(debounceTimer);
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('orientationchange', onWindowResize);
      dprMedia?.removeEventListener?.('change', onWindowResize);
    };
  }, [containerRef, isSoftwareGl, debounceMs]);
}
