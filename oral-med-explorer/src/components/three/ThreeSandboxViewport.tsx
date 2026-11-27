import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Eye, EyeOff, Layers, RotateCcw, Stethoscope } from 'lucide-react';
import type { Sandbox3DConfig } from '@/src/types/lecture';
import { buildClinical3DScene, type SceneBuildHandle } from './sceneBuilders';
import { useCanvasResize } from '@/src/hooks/useCanvasResize';
import { ThreeCanvasBoundary } from '@/src/components/ThreeCanvasBoundary';

interface ThreeSandboxViewportProps {
  config: Sandbox3DConfig;
  onInteract?: () => void;
}

export const ThreeSandboxViewport: React.FC<ThreeSandboxViewportProps> = ({
  config,
  onInteract,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<SceneBuildHandle | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isSoftwareGl, setIsSoftwareGl] = useState(false);

  const [stageIdx, setStageIdx] = useState(0);
  const [isolatedId, setIsolatedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>(config.structures[0]?.id || '');
  const [hiddenLayers, setHiddenLayers] = useState<Record<string, boolean>>({});
  const [surfaceOpacity, setSurfaceOpacity] = useState<number>(100);
  const [activeToolId, setActiveToolId] = useState<string | null>(
    config.examTools?.[0]?.id || null
  );
  const [renderError, setRenderError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  const stageRef = useRef(stageIdx);
  stageRef.current = stageIdx;

  const toolIdxRef = useRef(0);
  toolIdxRef.current = Math.max(
    0,
    config.examTools?.findIndex((t) => t.id === activeToolId) ?? 0
  );

  // Reset UI controls whenever sandbox changes
  useEffect(() => {
    setStageIdx(0);
    setIsolatedId(null);
    setSelectedId(config.structures[0]?.id || '');
    setHiddenLayers({});
    setSurfaceOpacity(100);
    setActiveToolId(config.examTools?.[0]?.id || null);
    setRenderError(null);
  }, [config]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let disposed = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let controls: OrbitControls | null = null;
    let pmrem: THREE.PMREMGenerator | null = null;
    let roomEnv: RoomEnvironment | null = null;
    let envRT: THREE.WebGLRenderTarget | null = null;
    let rafId = 0;

    const notifyBoundary = (message: string, errorType: 'WebGLContextLoss' | 'AssetOrShaderError' | 'RenderError') => {
      setRenderError(message);
      container.dispatchEvent(
        new CustomEvent('precision-3d-asset-error', {
          bubbles: true,
          detail: { message, errorType },
        })
      );
    };

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: 'high-performance',
      });
      rendererRef.current = renderer;
    } catch (err) {
      notifyBoundary(
        err instanceof Error ? err.message : 'WebGL context could not be initialized.',
        'WebGLContextLoss'
      );
      return;
    }

    const gl = renderer.getContext();
    const dbgInfo = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
    const glRenderer = dbgInfo && gl ? String(gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL)) : '';
    const softwareGlDetected = /SwiftShader|llvmpipe|Softpipe/i.test(glRenderer);
    setIsSoftwareGl(softwareGlDetected);

    const targetDpr = softwareGlDetected ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(targetDpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !softwareGlDetected;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);

    try {
      pmrem = new THREE.PMREMGenerator(renderer);
      roomEnv = new RoomEnvironment();
      envRT = pmrem.fromScene(roomEnv, 0.04);
      scene.environment = envRT.texture;
    } catch {
      // Fallback to direct clinical studio lights if PMREM fails
    }

    const initialRect = container.getBoundingClientRect();
    const initW = Math.max(Math.round(initialRect.width || container.clientWidth), 320);
    const initH = Math.max(Math.round(initialRect.height || container.clientHeight), 320);
    renderer.setSize(initW, initH, false);

    const camera = new THREE.PerspectiveCamera(44, initW / initH, 0.1, 100);
    camera.position.set(...config.cameraPosition);
    cameraRef.current = camera;

    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.0;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI * 0.88;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    // Three-point + hemisphere clinical studio lighting
    scene.add(new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 0.8));

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.45);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = !softwareGlDetected;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
    fillLight.position.set(-5, 3, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc9a24b, 0.55);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    let built: SceneBuildHandle;
    try {
      built = buildClinical3DScene(config);
      handleRef.current = built;
      scene.add(built.root);
    } catch (err) {
      notifyBoundary(
        err instanceof Error ? err.message : 'Failed to build 3D clinical scene geometry.',
        'AssetOrShaderError'
      );
      controls.dispose();
      roomEnv?.dispose();
      envRT?.dispose();
      pmrem?.dispose();
      renderer.dispose();
      return;
    }

    // Raycaster for direct 3D structure selection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownXY = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownXY = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownXY.x, e.clientY - pointerDownXY.y);
      if (dist > 6) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(built.root.children, true);
      const hitWithId = hits.find((h) => h.object.userData?.structureId);
      if (hitWithId) {
        setSelectedId(String(hitWithId.object.userData.structureId));
        onInteract?.();
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setRenderError('WebGL graphics context was interrupted by the browser.');
    };
    const onContextRestored = () => {
      setRenderError(null);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const clock = new THREE.Clock();
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      if (disposed || !renderer || !scene || !controls) return;
      try {
        const elapsed = reducedMotion ? 0 : clock.getElapsedTime();
        built.updateStage(stageRef.current, elapsed, toolIdxRef.current);
        controls.update();
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      } catch (err) {
        cancelAnimationFrame(rafId);
        notifyBoundary(
          err instanceof Error ? err.message : '3D frame rendering interrupted.',
          'RenderError'
        );
      }
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      controls?.dispose();
      roomEnv?.dispose();
      envRT?.dispose();
      pmrem?.dispose();
      scene?.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
      renderer?.renderLists?.dispose();
      renderer?.dispose();
      rendererRef.current = null;
      handleRef.current = null;
      controlsRef.current = null;
      cameraRef.current = null;
    };
  }, [config, retryToken]);

  // Real-time container ResizeObserver + debounced aspect ratio & DPR synchronization
  useCanvasResize({
    containerRef,
    isSoftwareGl,
    debounceMs: 45,
    onResize: ({ width, height, aspect, dpr }) => {
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      if (!renderer || !camera) return;
      try {
        renderer.setPixelRatio(dpr);
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      } catch {
        // Ignore transient resize if context is resetting
      }
    },
  });

  // Apply isolation, layer hiding, and transparency updates without rebuilding WebGL context
  useEffect(() => {
    const built = handleRef.current;
    if (!built) return;

    config.structures.forEach((st) => {
      const objs = built.structureMeshes.get(st.id) || [];
      const isHidden = Boolean(hiddenLayers[st.id]);
      const isDimmed = Boolean(isolatedId && isolatedId !== st.id);

      objs.forEach((obj) => {
        obj.visible = !isHidden;
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
            if (mat && 'opacity' in mat) {
              const baseAlpha = st.layer === 'Surface' ? surfaceOpacity / 100 : 1;
              mat.opacity = isDimmed ? Math.min(0.18, baseAlpha) : baseAlpha;
              mat.emissiveIntensity = selectedId === st.id ? 0.32 : 0.08;
            }
          }
        });
      });
    });
  }, [config.structures, hiddenLayers, isolatedId, surfaceOpacity, selectedId]);

  const selectedStructure =
    config.structures.find((s) => s.id === selectedId) || config.structures[0];
  const activeTool = config.examTools?.find((t) => t.id === activeToolId);

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(...config.cameraPosition);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    setIsolatedId(null);
    setHiddenLayers({});
    setSurfaceOpacity(100);
  };

  const clearRendererCache = () => {
    try {
      rendererRef.current?.renderLists?.dispose();
      rendererRef.current?.dispose();
    } catch {
      // ignore
    }
    THREE.Cache.clear();
  };

  return (
    <div className="grid lg:grid-cols-12 gap-4 items-stretch">
      {/* 3D Interactive Stage wrapped by ThreeCanvasBoundary */}
      <div
        ref={containerRef}
        className="lg:col-span-8 relative h-[400px] sm:h-[460px] rounded-2xl overflow-hidden border border-[#E6E8EC] dark:border-[#1F2937] bg-[#0B1220]"
      >
        <ThreeCanvasBoundary
          sandbox={config}
          className="w-full h-full relative"
          onClearRendererCache={clearRendererCache}
          onResetScene={() => {
            setRenderError(null);
            setRetryToken((n) => n + 1);
          }}
        >
          {renderError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-200 space-y-3">
              <Layers className="w-10 h-10 text-[#C9A24B]" />
              <h4 className="font-display font-bold text-lg">3D Viewport Recovery Fallback</h4>
              <p className="text-xs text-slate-400 max-w-md">
                {renderError} Use the interactive layer cards on the right or reset the 3D scene.
              </p>
              <button
                type="button"
                onClick={() => {
                  clearRendererCache();
                  setRenderError(null);
                  setRetryToken((n) => n + 1);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9A24B] hover:bg-[#B89038] text-[#0B1F4D] text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Scene
              </button>
            </div>
          ) : (
            <>
              <div className="absolute inset-0">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full block touch-none outline-none"
                  aria-label={`Interactive 3D simulation for ${config.title}`}
                />
              </div>

              {/* Top-left subtle active structure badge */}
              <div className="absolute top-3 left-3 z-10 pointer-events-none max-w-[72%]">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/75 backdrop-blur-md border border-white/15 text-xs text-white">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: selectedStructure?.color || '#3B82F6' }}
                  />
                  <span className="font-semibold truncate">{selectedStructure?.name}</span>
                </div>
              </div>

              {/* Top-right reset view */}
              <button
                type="button"
                onClick={resetCamera}
                className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/75 hover:bg-slate-900 backdrop-blur-md border border-white/15 text-xs font-medium text-white cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>

              {/* Bottom Docked Stage & Transparency Bar */}
              <div className="absolute bottom-0 inset-x-0 z-10 bg-slate-950/80 backdrop-blur-md border-t border-white/10 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#E4C16E] mr-1">
                    {config.stageLabel}:
                  </span>
                  {config.stageNames.map((name, idx) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setStageIdx(idx);
                        onInteract?.();
                      }}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        stageIdx === idx
                          ? 'bg-[#3B82F6] text-white'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 text-[11px] font-mono">
                  <span>Surface Opacity: {surfaceOpacity}%</span>
                  <input
                    type="range"
                    min={15}
                    max={100}
                    value={surfaceOpacity}
                    onChange={(e) => {
                      setSurfaceOpacity(Number(e.target.value));
                      onInteract?.();
                    }}
                    className="w-20 accent-[#14B8A6] cursor-pointer"
                  />
                </label>
              </div>
            </>
          )}
        </ThreeCanvasBoundary>
      </div>

      {/* Right Structure & Exam Tool Deck */}
      <div className="lg:col-span-4 rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4 flex flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-sm font-bold text-[#0B1F4D] dark:text-white">
              Anatomical Layers & Hotspots
            </h4>
            {isolatedId && (
              <button
                type="button"
                onClick={() => setIsolatedId(null)}
                className="text-xs font-semibold text-[#1B3A8C] dark:text-[#3B82F6] hover:underline cursor-pointer"
              >
                Show All
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[210px] overflow-y-auto clinical-scroll pr-1">
            {config.structures.map((st) => {
              const isSelected = selectedId === st.id;
              const isHidden = Boolean(hiddenLayers[st.id]);
              return (
                <div
                  key={st.id}
                  className={`rounded-xl border p-2.5 transition-colors ${
                    isSelected
                      ? 'border-[#1B3A8C] dark:border-[#3B82F6] bg-[#1B3A8C]/5 dark:bg-[#3B82F6]/10'
                      : 'border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(st.id);
                        onInteract?.();
                      }}
                      className="flex items-center gap-2 text-left min-w-0 flex-1 cursor-pointer"
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: st.color }}
                      />
                      <span className="text-xs font-semibold text-[#0B1F4D] dark:text-white truncate">
                        {st.name}
                      </span>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setIsolatedId((prev) => (prev === st.id ? null : st.id))
                        }
                        className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                          isolatedId === st.id
                            ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold'
                            : 'bg-white dark:bg-[#1F2937] text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Isolate
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setHiddenLayers((prev) => ({ ...prev, [st.id]: !prev[st.id] }))
                        }
                        aria-label={isHidden ? `Show ${st.name}` : `Hide ${st.name}`}
                        className="p-1 rounded text-slate-500 hover:text-[#0B1F4D] dark:hover:text-white cursor-pointer"
                      >
                        {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedStructure && (
            <div className="rounded-xl bg-[#FAF8F3] dark:bg-[#0B1220] border border-[#E6E8EC] dark:border-[#1F2937] p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B1F4D] dark:text-white">
                  {selectedStructure.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E6E8EC] dark:bg-[#1F2937] text-slate-700 dark:text-slate-300">
                  {selectedStructure.layer}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedStructure.description}
              </p>
              <p className="text-[11px] font-medium text-[#1B3A8C] dark:text-[#14B8A6]">
                Pearl: {selectedStructure.clinicalPearl}
              </p>
            </div>
          )}

          {/* Exam Tools when in Exam Simulator slot */}
          {config.examTools && config.examTools.length > 0 && (
            <div className="pt-2 border-t border-[#E6E8EC] dark:border-[#1F2937] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B1F4D] dark:text-white">
                <Stethoscope className="w-3.5 h-3.5 text-[#C9A24B]" />
                Clinical Examination Tools
              </div>
              <div className="flex flex-wrap gap-1.5">
                {config.examTools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      setActiveToolId(tool.id);
                      onInteract?.();
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      activeToolId === tool.id
                        ? 'bg-[#1B3A8C] text-white dark:bg-[#3B82F6]'
                        : 'bg-[#FAF8F3] dark:bg-[#1F2937] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
              {activeTool && (
                <div className="rounded-xl border border-[#14B8A6]/30 bg-[#14B8A6]/5 p-2.5 text-xs space-y-1">
                  <div className="text-slate-600 dark:text-slate-300">{activeTool.instruction}</div>
                  <div className="font-semibold text-[#0B1F4D] dark:text-[#99F6E4]">
                    Finding: {activeTool.finding}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {config.disclaimer} Drag to orbit • Scroll to zoom • Click structures to inspect.
        </p>
      </div>
    </div>
  );
};
