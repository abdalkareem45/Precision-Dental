import React from 'react';
import { AlertTriangle, Bug, Layers, RotateCcw } from 'lucide-react';
import type { Sandbox3DConfig } from '@/src/types/lecture';

export interface BoundaryErrorMetadata {
  boundary: 'ErrorBoundary' | '3D Asset Boundary';
  errorType: 'WebGLContextLoss' | 'AssetOrShaderError' | 'RenderError';
  message: string;
  timestamp: string;
  sandboxId?: string;
  sceneKey?: string;
  sandboxTitle?: string;
  componentStack?: string;
  retryAttempt: number;
}

function classifyError(error: Error | string): BoundaryErrorMetadata['errorType'] {
  const msg = typeof error === 'string' ? error : `${error?.name || ''} ${error?.message || ''}`;
  if (/webgl|context.*lost|lost.*context/i.test(msg)) {
    return 'WebGLContextLoss';
  }
  if (/shader|texture|geometry|material|three|asset|gl/i.test(msg)) {
    return 'AssetOrShaderError';
  }
  return 'RenderError';
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  title?: string;
  fallbackDescription?: string;
  sandboxFallback?: Sandbox3DConfig;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  metadata: BoundaryErrorMetadata | null;
  retryCount: number;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      metadata: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected rendering error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    const metadata: BoundaryErrorMetadata = {
      boundary: 'ErrorBoundary',
      errorType: classifyError(error),
      message: error?.message || 'Unexpected rendering error occurred.',
      timestamp: new Date().toISOString(),
      sandboxId: this.props.sandboxFallback?.id,
      sceneKey: this.props.sandboxFallback?.sceneKey,
      sandboxTitle: this.props.sandboxFallback?.title,
      componentStack: info?.componentStack?.trim().slice(0, 600),
      retryAttempt: this.state.retryCount,
    };
    this.setState({ metadata });
    console.error('[ErrorBoundary]', metadata, error);
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      errorMessage: '',
      metadata: null,
      retryCount: prev.retryCount + 1,
    }));
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) {
      return (
        <React.Fragment key={this.state.retryCount}>
          {this.props.children}
        </React.Fragment>
      );
    }

    const { title, fallbackDescription, sandboxFallback } = this.props;

    return (
      <div
        role="alert"
        className="rounded-2xl border border-amber-400/50 bg-[#0B1220] text-white p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/35 shrink-0">
              {sandboxFallback ? (
                <Layers className="w-5 h-5 text-[#E4C16E]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-300" />
              )}
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {title || 'Interactive Module Recovery Mode'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {fallbackDescription ||
                  'A rendering or asset loading interruption was caught cleanly so the rest of your lecture stays intact.'}
              </p>
              {this.state.errorMessage && (
                <p className="text-[11px] font-mono text-amber-300/90 mt-1">
                  Detail: {this.state.errorMessage}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9A24B] hover:bg-[#B89038] text-[#0B1F4D] text-xs font-bold shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reload Module
          </button>
        </div>

        {sandboxFallback && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
            {sandboxFallback.structures.map((st) => (
              <div
                key={st.id}
                className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1 text-xs"
              >
                <div className="flex items-center gap-2 font-bold text-white">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: st.color }}
                  />
                  <span>{st.name}</span>
                </div>
                <p className="text-slate-300 leading-snug">{st.description}</p>
                <p className="text-[#5EEAD4] font-medium">Pearl: {st.clinicalPearl}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

interface ThreeAssetBoundaryProps {
  children: React.ReactNode;
  sandbox: Sandbox3DConfig;
  onResetScene?: () => void;
}

interface ThreeAssetBoundaryState {
  hasError: boolean;
  metadata: BoundaryErrorMetadata | null;
  resetEpoch: number;
}

/**
 * Specialized "3D Asset Boundary" for Three.js sandboxes:
 * - Catches React 3D asset/shader/render exceptions via getDerivedStateFromError & componentDidCatch
 * - Captures native WebGL context loss (`webglcontextlost`) & custom 3D asset fault events
 * - Logs structured debug metadata and provides a dedicated "Reset Scene" recovery path
 */
export class ThreeAssetBoundary extends React.Component<
  ThreeAssetBoundaryProps,
  ThreeAssetBoundaryState
> {
  private wrapperRef = React.createRef<HTMLDivElement>();

  constructor(props: ThreeAssetBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      metadata: null,
      resetEpoch: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ThreeAssetBoundaryState> {
    return {
      hasError: true,
      metadata: {
        boundary: '3D Asset Boundary',
        errorType: classifyError(error),
        message: error?.message || '3D asset rendering interrupted.',
        timestamp: new Date().toISOString(),
        retryAttempt: 0,
      },
    };
  }

  componentDidMount(): void {
    const el = this.wrapperRef.current;
    if (!el) return;
    el.addEventListener('webglcontextlost', this.handleWebGLContextLost, true);
    el.addEventListener('precision-3d-asset-error', this.handleAssetEvent as EventListener);
  }

  componentDidUpdate(prevProps: ThreeAssetBoundaryProps): void {
    if (prevProps.sandbox.id !== this.props.sandbox.id && this.state.hasError) {
      this.setState({
        hasError: false,
        metadata: null,
      });
    }
  }

  componentWillUnmount(): void {
    const el = this.wrapperRef.current;
    if (!el) return;
    el.removeEventListener('webglcontextlost', this.handleWebGLContextLost, true);
    el.removeEventListener('precision-3d-asset-error', this.handleAssetEvent as EventListener);
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    const metadata: BoundaryErrorMetadata = {
      boundary: '3D Asset Boundary',
      errorType: classifyError(error),
      message: error?.message || '3D asset rendering interrupted.',
      timestamp: new Date().toISOString(),
      sandboxId: this.props.sandbox.id,
      sceneKey: this.props.sandbox.sceneKey,
      sandboxTitle: this.props.sandbox.title,
      componentStack: info?.componentStack?.trim().slice(0, 600),
      retryAttempt: this.state.resetEpoch,
    };
    this.setState({ hasError: true, metadata });
    console.error('[3D Asset Boundary]', metadata, error);
  }

  private handleWebGLContextLost = (event: Event) => {
    event.preventDefault();
    const metadata: BoundaryErrorMetadata = {
      boundary: '3D Asset Boundary',
      errorType: 'WebGLContextLoss',
      message: 'WebGL graphics context lost on 3D canvas (webglcontextlost).',
      timestamp: new Date().toISOString(),
      sandboxId: this.props.sandbox.id,
      sceneKey: this.props.sandbox.sceneKey,
      sandboxTitle: this.props.sandbox.title,
      retryAttempt: this.state.resetEpoch,
    };
    console.error('[3D Asset Boundary] WebGL Context Lost', metadata);
    this.setState({ hasError: true, metadata });
  };

  private handleAssetEvent = (event: CustomEvent<{ message?: string; errorType?: BoundaryErrorMetadata['errorType'] }>) => {
    const detail = event.detail || {};
    const msg = detail.message || '3D asset or shader loading failure.';
    const metadata: BoundaryErrorMetadata = {
      boundary: '3D Asset Boundary',
      errorType: detail.errorType || classifyError(msg),
      message: msg,
      timestamp: new Date().toISOString(),
      sandboxId: this.props.sandbox.id,
      sceneKey: this.props.sandbox.sceneKey,
      sandboxTitle: this.props.sandbox.title,
      retryAttempt: this.state.resetEpoch,
    };
    console.error('[3D Asset Boundary] Asset Fault', metadata);
    this.setState({ hasError: true, metadata });
  };

  handleResetScene = () => {
    console.info('[3D Asset Boundary] Resetting 3D scene', {
      sandboxId: this.props.sandbox.id,
      sceneKey: this.props.sandbox.sceneKey,
      nextEpoch: this.state.resetEpoch + 1,
    });
    this.setState((prev) => ({
      hasError: false,
      metadata: null,
      resetEpoch: prev.resetEpoch + 1,
    }));
    this.props.onResetScene?.();
  };

  render() {
    const { sandbox } = this.props;
    const { hasError, metadata, resetEpoch } = this.state;

    return (
      <div ref={this.wrapperRef}>
        {!hasError ? (
          <React.Fragment key={`${sandbox.id}-epoch-${resetEpoch}`}>
            {this.props.children}
          </React.Fragment>
        ) : (
          <div
            role="alert"
            className="rounded-2xl border border-amber-400/60 bg-[#0B1220] text-white p-5 sm:p-6 space-y-4 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 shrink-0">
                  <Layers className="w-5 h-5 text-[#E4C16E]" />
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#E4C16E]">
                    3D Asset Boundary • {metadata?.errorType === 'WebGLContextLoss' ? 'WebGL Context Loss Caught' : '3D Recovery Active'}
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white">
                    {sandbox.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {metadata?.errorType === 'WebGLContextLoss'
                      ? 'Your browser paused or reset the WebGL GPU context. Use Reset Scene to rebuild the 3D simulation cleanly, or review the anatomical layers below.'
                      : 'A 3D rendering or asset loading issue was isolated safely. Use Reset Scene to reinitialize the WebGL viewport.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={this.handleResetScene}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C9A24B] hover:bg-[#B89038] text-[#0B1F4D] text-xs font-bold shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Scene
              </button>
            </div>

            {metadata && (
              <details className="rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-xs">
                <summary className="cursor-pointer font-mono text-slate-300 inline-flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5 text-[#38BDF8]" />
                  Error Metadata (sceneKey: {metadata.sceneKey || sandbox.sceneKey}, type: {metadata.errorType})
                </summary>
                <pre className="mt-2 font-mono text-[11px] text-amber-200 whitespace-pre-wrap break-all">
                  {JSON.stringify(metadata, null, 2)}
                </pre>
              </details>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
              {sandbox.structures.map((st) => (
                <div
                  key={st.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1 text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: st.color }}
                    />
                    <span>{st.name}</span>
                  </div>
                  <p className="text-slate-300 leading-snug">{st.description}</p>
                  <p className="text-[#5EEAD4] font-medium">Pearl: {st.clinicalPearl}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
