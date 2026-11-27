import React from 'react';
import * as THREE from 'three';
import { Bug, Layers, RefreshCw, RotateCcw, ShieldAlert } from 'lucide-react';
import type { Sandbox3DConfig } from '@/src/types/lecture';
import type { BoundaryErrorMetadata } from '@/src/components/ErrorBoundary';

export interface ThreeCanvasBoundaryProps {
  children: React.ReactNode;
  sandbox?: Sandbox3DConfig;
  title?: string;
  sceneKey?: string;
  className?: string;
  autoResetDelayMs?: number;
  maxAutoResets?: number;
  onClearRendererCache?: () => void;
  onResetScene?: () => void;
}

interface ThreeCanvasBoundaryState {
  hasError: boolean;
  isAutoResetting: boolean;
  autoResetCount: number;
  sceneResetEpoch: number;
  metadata: BoundaryErrorMetadata | null;
}

function detectWebGLContextLoss(error: Error | string): boolean {
  const text =
    typeof error === 'string' ? error : `${error?.name || ''} ${error?.message || ''}`;
  return /webgl|context.*lost|lost.*context/i.test(text);
}

/**
 * ThreeCanvasBoundary:
 * Wraps React Three Fiber <Canvas> or Three.js <canvas> elements to detect
 * `webglcontextlost` events and rendering/asset exceptions.
 * Implements a component-level state reset mechanism (`sceneResetEpoch` + Three.js cache purge)
 * to cleanly remount and re-initialize the 3D scene without breaking the rest of the page.
 */
export class ThreeCanvasBoundary extends React.Component<
  ThreeCanvasBoundaryProps,
  ThreeCanvasBoundaryState
> {
  private wrapperRef = React.createRef<HTMLDivElement>();
  private autoResetTimer: number | null = null;
  private domObserver: MutationObserver | null = null;
  private boundCanvases = new Set<HTMLCanvasElement>();
  private isMounted = false;

  constructor(props: ThreeCanvasBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      isAutoResetting: false,
      autoResetCount: 0,
      sceneResetEpoch: 0,
      metadata: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ThreeCanvasBoundaryState> {
    const isContextLoss = detectWebGLContextLoss(error);
    return {
      hasError: true,
      metadata: {
        boundary: '3D Asset Boundary',
        errorType: isContextLoss ? 'WebGLContextLoss' : 'AssetOrShaderError',
        message: error?.message || '3D canvas rendering exception.',
        timestamp: new Date().toISOString(),
        retryAttempt: 0,
      },
    };
  }

  componentDidMount(): void {
    this.isMounted = true;
    const el = this.wrapperRef.current;
    if (!el) return;

    el.addEventListener('webglcontextlost', this.handleContextLost, true);
    el.addEventListener('webglcontextrestored', this.handleContextRestored, true);
    el.addEventListener(
      'precision-3d-asset-error',
      this.handleCustomAssetError as EventListener
    );

    this.bindChildCanvases();

    if (typeof MutationObserver !== 'undefined') {
      this.domObserver = new MutationObserver(() => {
        this.bindChildCanvases();
      });
      this.domObserver.observe(el, { childList: true, subtree: true });
    }
  }

  componentDidUpdate(prevProps: ThreeCanvasBoundaryProps): void {
    const prevKey = prevProps.sandbox?.id ?? prevProps.sceneKey;
    const nextKey = this.props.sandbox?.id ?? this.props.sceneKey;

    if (prevKey !== nextKey) {
      this.clearAutoResetTimer();
      if (this.state.hasError || this.state.autoResetCount > 0) {
        this.setState({
          hasError: false,
          isAutoResetting: false,
          autoResetCount: 0,
          metadata: null,
        });
      }
    }

    this.bindChildCanvases();
  }

  componentWillUnmount(): void {
    this.isMounted = false;
    this.clearAutoResetTimer();
    this.domObserver?.disconnect();
    this.domObserver = null;
    this.unbindAllCanvases();

    const el = this.wrapperRef.current;
    if (!el) return;
    el.removeEventListener('webglcontextlost', this.handleContextLost, true);
    el.removeEventListener('webglcontextrestored', this.handleContextRestored, true);
    el.removeEventListener(
      'precision-3d-asset-error',
      this.handleCustomAssetError as EventListener
    );
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    const isContextLoss = detectWebGLContextLoss(error);
    const metadata: BoundaryErrorMetadata = {
      boundary: '3D Asset Boundary',
      errorType: isContextLoss ? 'WebGLContextLoss' : 'AssetOrShaderError',
      message: error?.message || '3D canvas rendering exception.',
      timestamp: new Date().toISOString(),
      sandboxId: this.props.sandbox?.id,
      sceneKey: this.props.sandbox?.sceneKey ?? this.props.sceneKey,
      sandboxTitle: this.props.sandbox?.title ?? this.props.title,
      componentStack: info?.componentStack?.trim().slice(0, 600),
      retryAttempt: this.state.sceneResetEpoch,
    };
    console.error('[ThreeCanvasBoundary]', metadata, error);
    this.setState({ hasError: true, metadata });
    this.scheduleAutoResetScene(isContextLoss);
  }

  private bindChildCanvases = () => {
    const el = this.wrapperRef.current;
    if (!el) return;
    const canvases = el.querySelectorAll('canvas');
    canvases.forEach((canvas) => {
      if (!this.boundCanvases.has(canvas)) {
        canvas.addEventListener('webglcontextlost', this.handleContextLost);
        canvas.addEventListener('webglcontextrestored', this.handleContextRestored);
        this.boundCanvases.add(canvas);
      }
    });

    // Prune detached canvases
    this.boundCanvases.forEach((canvas) => {
      if (!el.contains(canvas)) {
        canvas.removeEventListener('webglcontextlost', this.handleContextLost);
        canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);
        this.boundCanvases.delete(canvas);
      }
    });
  };

  private unbindAllCanvases = () => {
    this.boundCanvases.forEach((canvas) => {
      canvas.removeEventListener('webglcontextlost', this.handleContextLost);
      canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);
    });
    this.boundCanvases.clear();
  };

  private clearAutoResetTimer = () => {
    if (this.autoResetTimer !== null) {
      window.clearTimeout(this.autoResetTimer);
      this.autoResetTimer = null;
    }
  };

  private clearThreeRendererCache = () => {
    try {
      THREE.Cache.clear();
    } catch {
      // Ignore if cache is already empty
    }
    this.props.onClearRendererCache?.();
  };

  private executeResetScene = (isAuto: boolean) => {
    if (!this.isMounted) return;
    this.clearThreeRendererCache();
    console.info('[ThreeCanvasBoundary] Re-initializing 3D scene state', {
      sandboxId: this.props.sandbox?.id,
      sceneKey: this.props.sandbox?.sceneKey ?? this.props.sceneKey,
      mode: isAuto ? 'automatic' : 'manual',
      nextEpoch: this.state.sceneResetEpoch + 1,
    });
    this.setState((prev) => ({
      hasError: false,
      isAutoResetting: false,
      autoResetCount: isAuto ? prev.autoResetCount + 1 : 0,
      sceneResetEpoch: prev.sceneResetEpoch + 1,
      metadata: null,
    }));
    this.props.onResetScene?.();
  };

  private scheduleAutoResetScene = (isContextLoss: boolean) => {
    const maxResets = this.props.maxAutoResets ?? 2;
    const delayMs = this.props.autoResetDelayMs ?? 1200;

    if (!isContextLoss || this.state.autoResetCount >= maxResets) {
      this.setState({ isAutoResetting: false });
      return;
    }

    this.clearAutoResetTimer();
    this.setState({ isAutoResetting: true });
    this.autoResetTimer = window.setTimeout(() => {
      this.autoResetTimer = null;
      this.executeResetScene(true);
    }, delayMs);
  };

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    if (this.state.hasError) return;

    const metadata: BoundaryErrorMetadata = {
      boundary: '3D Asset Boundary',
      errorType: 'WebGLContextLoss',
      message: 'WebGL context lost (`webglcontextlost`) detected on 3D canvas.',
      timestamp: new Date().toISOString(),
      sandboxId: this.props.sandbox?.id,
      sceneKey: this.props.sandbox?.sceneKey ?? this.props.sceneKey,
      sandboxTitle: this.props.sandbox?.title ?? this.props.title,
      retryAttempt: this.state.sceneResetEpoch,
    };
    console.error('[ThreeCanvasBoundary] webglcontextlost captured', metadata);
    this.setState({ hasError: true, metadata });
    this.scheduleAutoResetScene(true);
  };

  private handleContextRestored = () => {
    this.clearAutoResetTimer();
    this.executeResetScene(true);
  };

  private handleCustomAssetError = (
    event: CustomEvent<{ message?: string; errorType?: BoundaryErrorMetadata['errorType'] }>
  ) => {
    const detail = event.detail || {};
    const msg = detail.message || '3D asset loading or WebGL rendering error.';
    const isContextLoss =
      detail.errorType === 'WebGLContextLoss' || detectWebGLContextLoss(msg);

    const metadata: BoundaryErrorMetadata = {
      boundary: '3D Asset Boundary',
      errorType:
        detail.errorType || (isContextLoss ? 'WebGLContextLoss' : 'AssetOrShaderError'),
      message: msg,
      timestamp: new Date().toISOString(),
      sandboxId: this.props.sandbox?.id,
      sceneKey: this.props.sandbox?.sceneKey ?? this.props.sceneKey,
      sandboxTitle: this.props.sandbox?.title ?? this.props.title,
      retryAttempt: this.state.sceneResetEpoch,
    };
    console.error('[ThreeCanvasBoundary] Asset fault captured', metadata);
    this.setState({ hasError: true, metadata });
    this.scheduleAutoResetScene(isContextLoss);
  };

  public reloadScene = (): void => {
    this.clearAutoResetTimer();
    this.executeResetScene(false);
  };

  handleManualReset = () => {
    this.reloadScene();
  };

  render() {
    const { sandbox, title, sceneKey, className = 'w-full h-full' } = this.props;
    const { hasError, isAutoResetting, autoResetCount, sceneResetEpoch, metadata } =
      this.state;

    const displayTitle = sandbox?.title || title || '3D Interactive Viewport';
    const displayKey = sandbox?.id || sceneKey || 'canvas-scene';

    return (
      <div ref={this.wrapperRef} className={className}>
        {!hasError ? (
          <React.Fragment key={`${displayKey}-reset-${sceneResetEpoch}`}>
            {this.props.children}
          </React.Fragment>
        ) : (
          <div
            role="alert"
            className="w-full h-full overflow-y-auto clinical-scroll rounded-2xl border border-amber-400/60 bg-[#0B1220] text-white p-5 sm:p-6 flex flex-col justify-between gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 shrink-0">
                  {isAutoResetting ? (
                    <RefreshCw className="w-5 h-5 text-[#38BDF8] animate-spin" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-[#E4C16E]" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#E4C16E]">
                    ThreeCanvasBoundary •{' '}
                    {isAutoResetting
                      ? `Auto-Resetting Scene (Attempt ${autoResetCount + 1})`
                      : metadata?.errorType === 'WebGLContextLoss'
                        ? 'WebGL Context Loss Caught'
                        : '3D Canvas Recovery'}
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white">
                    {displayTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {isAutoResetting
                      ? 'Clearing Three.js renderer cache and safely re-mounting the 3D scene…'
                      : 'The 3D canvas was isolated cleanly so the rest of the page stays responsive. Click Reload Scene to re-mount and recover the WebGL context.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={this.handleManualReset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C9A24B] hover:bg-[#B89038] text-[#0B1F4D] text-xs font-bold shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reload Scene
              </button>
            </div>

            {metadata && (
              <details className="rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-xs">
                <summary className="cursor-pointer font-mono text-slate-300 inline-flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5 text-[#38BDF8]" />
                  Error Metadata ({metadata.errorType} • {metadata.sceneKey || displayKey})
                </summary>
                <pre className="mt-2 font-mono text-[11px] text-amber-200 whitespace-pre-wrap break-all">
                  {JSON.stringify(metadata, null, 2)}
                </pre>
              </details>
            )}

            {sandbox && sandbox.structures.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                {sandbox.structures.map((st) => (
                  <div
                    key={st.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-2.5 space-y-1 text-xs"
                  >
                    <div className="flex items-center gap-2 font-bold text-white">
                      <Layers className="w-3.5 h-3.5 shrink-0" style={{ color: st.color }} />
                      <span>{st.name}</span>
                    </div>
                    <p className="text-slate-300 leading-snug">{st.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ThreeCanvasBoundary;
