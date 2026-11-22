import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  RotateCcw,
  Play,
  Pause,
  Tag,
  Layers,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  EyeOff,
} from 'lucide-react';
import { LectureData } from '../../types/lecture';
import { BuiltLectureScene, buildLectureScene } from './buildLectureScene';
import { disposeObject3D } from './dentalGeometry';
import { useLabStore } from '../../store/useLabStore';

interface Dental3DSandboxProps {
  lecture: LectureData;
}

interface LabelMeta {
  id: string;
  text: string;
  subtext?: string;
  layerId: string;
}

function getDefaultToggleState(lectureId: string): boolean {
  return lectureId === 'lec-07b' || lectureId === 'lec-10a' || lectureId === 'lec-12';
}

function buildLayerVisibility(layers: { id: string }[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  layers.forEach((l) => {
    map[l.id] = true;
  });
  return map;
}

function detectSoftwareGl(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return false;
    const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '').toLowerCase();
    return (
      renderer.includes('swiftshader') ||
      renderer.includes('llvmpipe') ||
      renderer.includes('software') ||
      renderer.includes('warp')
    );
  } catch {
    return false;
  }
}

export const Dental3DSandbox: React.FC<Dental3DSandboxProps> = ({ lecture }) => {
  const { threeD, id: lectureId } = lecture;
  const mark3DExplored = useLabStore((s) => s.mark3DExplored);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [dockOpen, setDockOpen] = useState(true);
  const [showLayersPanel, setShowLayersPanel] = useState(false);

  // Interactive Simulation Controls
  const [primaryMode, setPrimaryMode] = useState(threeD.primaryModes[0]?.id ?? '');
  const [secondaryMode, setSecondaryMode] = useState(threeD.secondaryModes?.[0]?.id ?? '');
  const [sliderValue, setSliderValue] = useState(threeD.sliderDefault);
  const [toggleActive, setToggleActive] = useState(() => getDefaultToggleState(lectureId));
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [animSpeed, setAnimSpeed] = useState<0.5 | 1 | 2>(1);
  const [tourIndex, setTourIndex] = useState<number>(-1);
  const [liveStatus, setLiveStatus] = useState<string>(threeD.subtitle);
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>(() =>
    buildLayerVisibility(threeD.structureLayers)
  );
  const [labelMetas, setLabelMetas] = useState<LabelMeta[]>([]);

  // Direct DOM refs for 60 FPS projected labels without triggering React re-renders
  const labelDomRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const labelCacheRef = useRef<Record<string, { x: number; y: number; visible: boolean }>>({});
  const lastStatusRef = useRef<string>(threeD.subtitle);

  // Ref holding live UI params so WebGL loop reads latest synchronously
  const paramsRef = useRef({
    primaryMode,
    secondaryMode,
    sliderValue,
    toggleActive,
    explodeFactor,
    showLabels,
    animate,
    animSpeed,
    visibleLayers,
  });
  paramsRef.current = {
    primaryMode,
    secondaryMode,
    sliderValue,
    toggleActive,
    explodeFactor,
    showLabels,
    animate,
    animSpeed,
    visibleLayers,
  };

  // Persistent Three.js engine refs (initialized once per mount)
  const engineRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    requestRender: () => void;
    resetElapsed: () => void;
  } | null>(null);
  const builtRef = useRef<BuiltLectureScene | null>(null);
  const smoothExplodeRef = useRef(0);
  const reducedMotionRef = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Camera target goal for reset & guided tour
  const cameraGoalRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(...threeD.defaultCamera),
    target: new THREE.Vector3(...threeD.defaultTarget),
  });

  const handleResetCamera = () => {
    setTourIndex(-1);
    cameraGoalRef.current = {
      active: true,
      pos: new THREE.Vector3(...threeD.defaultCamera),
      target: new THREE.Vector3(...threeD.defaultTarget),
    };
    engineRef.current?.requestRender();
  };

  const handleSelectTourStep = (nextIdx: number) => {
    const steps = threeD.guidedTour;
    if (steps.length === 0) return;
    const wrapped = ((nextIdx % steps.length) + steps.length) % steps.length;
    setTourIndex(wrapped);
    const step = steps[wrapped];
    cameraGoalRef.current = {
      active: true,
      pos: new THREE.Vector3(...step.cameraPosition),
      target: new THREE.Vector3(...step.cameraTarget),
    };
    engineRef.current?.requestRender();
  };

  const sizeRef = useRef<{ w: number; h: number }>({ w: 640, h: 420 });

  // Restored contexts and newly mounted label elements need fresh projections.
  useEffect(() => {
    labelCacheRef.current = {};
    engineRef.current?.requestRender();
  }, [showLabels, visibleLayers, webglError]);

  // Request a WebGL frame whenever interactive React parameters change
  useEffect(() => {
    engineRef.current?.requestRender();
  }, [
    primaryMode,
    secondaryMode,
    sliderValue,
    toggleActive,
    explodeFactor,
    showLabels,
    animate,
    animSpeed,
    visibleLayers,
  ]);

  // Persistent Three.js Renderer, Scene, Lights & OrbitControls Lifecycle (created ONCE)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const motionQuery =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    reducedMotionRef.current = Boolean(motionQuery?.matches);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        stencil: false,
      });
    } catch {
      setWebglError('WebGL hardware/software context is unavailable in this browser.');
      return;
    }

    const gl = renderer.getContext();
    const isSoftwareGl = detectSoftwareGl(gl);
    const dpr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    const initW = container.clientWidth || 640;
    const initH = container.clientHeight || 420;
    sizeRef.current = { w: initW, h: initH };

    renderer.setPixelRatio(dpr);
    renderer.setSize(initW, initH);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#eef1f6');

    const camera = new THREE.PerspectiveCamera(42, initW / initH, 0.1, 50);
    camera.position.set(...threeD.defaultCamera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...threeD.defaultTarget);
    controls.enableDamping = true;
    controls.dampingFactor = 0.085;
    controls.minDistance = 1.6;
    controls.maxDistance = 14.0;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.update();

    // Balanced 4-Point Studio Lighting (crisp contours with zero expensive shadow-map pass)
    const hemi = new THREE.HemisphereLight(0xfffaf0, 0x9aa4b4, isSoftwareGl ? 1.2 : 0.85);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 1.35);
    keyLight.position.set(4.5, 7.5, 5.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.45);
    fillLight.position.set(0, 2.5, 6.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xdbeafe, 0.85);
    rimLight.position.set(-5.0, 4.0, -4.5);
    scene.add(rimLight);

    // Subtle clinical stage base disc
    const stageDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(4.4, 4.5, 0.06, 36),
      new THREE.MeshStandardMaterial({
        color: 0xe3e7ef,
        roughness: 0.88,
        metalness: 0.02,
      })
    );
    stageDisc.position.y = -1.25;
    scene.add(stageDisc);

    let disposed = false;
    let rafId = 0;
    let lastTime = performance.now();
    let lastRenderTime = 0;
    let elapsedSim = 0;
    let recordedExploration = false;
    let needsRender = true;
    let isViewportVisible = true;
    let isTabVisible = typeof document === 'undefined' ? true : !document.hidden;
    const tempV = new THREE.Vector3();

    // Defer PMREM RoomEnvironment generation until after first fast paint so 3D tab opens instantaneously
    let envRT: THREE.WebGLRenderTarget | null = null;
    let envTimer: number | null = null;
    if (!isSoftwareGl) {
      envTimer = window.setTimeout(() => {
        if (disposed) return;
        const pmrem = new THREE.PMREMGenerator(renderer);
        const roomEnv = new RoomEnvironment();
        envRT = pmrem.fromScene(roomEnv, 0.04);
        scene.environment = envRT.texture;
        scene.environmentIntensity = 0.55;
        roomEnv.dispose();
        pmrem.dispose();
        requestRender();
      }, 45);
    }

    const projectLabelsDirect = (built: BuiltLectureScene) => {
      const p = paramsRef.current;
      const { w, h } = sizeRef.current;

      built.labels.forEach((a) => {
        const el = labelDomRefs.current[a.id];
        if (!el) return;

        const layerVisible = p.visibleLayers[a.layerId] !== false;
        let anchor: THREE.Object3D | null = a.anchor;
        let anchorVisible = true;
        while (anchor) {
          if (!anchor.visible) { anchorVisible = false; break; }
          anchor = anchor.parent;
        }
        if (!p.showLabels || !layerVisible || !anchorVisible) {
          const prev = labelCacheRef.current[a.id];
          if (!prev || prev.visible) {
            el.style.display = 'none';
            labelCacheRef.current[a.id] = { x: 0, y: 0, visible: false };
          }
          return;
        }

        a.anchor.getWorldPosition(tempV).project(camera);
        if (tempV.z > 1 || tempV.z < -1) {
          const prev = labelCacheRef.current[a.id];
          if (!prev || prev.visible) {
            el.style.display = 'none';
            labelCacheRef.current[a.id] = { x: 0, y: 0, visible: false };
          }
          return;
        }

        const x = Math.round((tempV.x * 0.5 + 0.5) * w);
        const y = Math.round((-tempV.y * 0.5 + 0.5) * h);
        const outOfBounds = x < 44 || x > w - 44 || y < 30 || y > h - 84;
        if (outOfBounds) {
          const prev = labelCacheRef.current[a.id];
          if (!prev || prev.visible) {
            el.style.display = 'none';
            labelCacheRef.current[a.id] = { x, y, visible: false };
          }
          return;
        }

        const prev = labelCacheRef.current[a.id];
        if (!prev || !prev.visible) {
          el.style.display = 'block';
        }
        if (!prev || prev.x !== x || prev.y !== y || !prev.visible) {
          el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
          labelCacheRef.current[a.id] = { x, y, visible: true };
        }
      });
    };

    const tick = (now: number) => {
      rafId = 0;
      if (disposed || !isViewportVisible || !isTabVisible) return;

      const built = builtRef.current;
      const p = paramsRef.current;
      const reducedMotion = reducedMotionRef.current;

      // Cap passive idle auto-animation at ~60 FPS on 120Hz/144Hz monitors without delaying interactions
      const sinceRender = now - lastRenderTime;
      if (
        !needsRender &&
        !cameraGoalRef.current.active &&
        Math.abs(smoothExplodeRef.current - p.explodeFactor) <= 0.002 &&
        sinceRender < 15.5
      ) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      if (p.animate && !reducedMotion) {
        elapsedSim += dt * p.animSpeed;
        needsRender = true;
      }

      // Smooth explode damping
      const prevExplode = smoothExplodeRef.current;
      smoothExplodeRef.current = reducedMotion ? p.explodeFactor : THREE.MathUtils.damp(prevExplode, p.explodeFactor, 8, dt);
      if (Math.abs(smoothExplodeRef.current - p.explodeFactor) > 0.002) {
        needsRender = true;
      } else {
        smoothExplodeRef.current = p.explodeFactor;
      }

      // Smooth camera transition for Reset / Guided Tour
      if (cameraGoalRef.current.active && reducedMotion) {
        camera.position.copy(cameraGoalRef.current.pos);
        controls.target.copy(cameraGoalRef.current.target);
        cameraGoalRef.current.active = false;
        needsRender = true;
      }
      if (cameraGoalRef.current.active) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraGoalRef.current.pos.x, 6, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraGoalRef.current.pos.y, 6, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraGoalRef.current.pos.z, 6, dt);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, cameraGoalRef.current.target.x, 6, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, cameraGoalRef.current.target.y, 6, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, cameraGoalRef.current.target.z, 6, dt);
        if (
          camera.position.distanceTo(cameraGoalRef.current.pos) < 0.025 &&
          controls.target.distanceTo(cameraGoalRef.current.target) < 0.025
        ) {
          camera.position.copy(cameraGoalRef.current.pos);
          controls.target.copy(cameraGoalRef.current.target);
          cameraGoalRef.current.active = false;
        }
        needsRender = true;
      }

      const controlsMoved = controls.update();
      if (controlsMoved) {
        needsRender = true;
      }

      if (built && needsRender) {
        built.updateState({
          primaryMode: p.primaryMode,
          secondaryMode: p.secondaryMode,
          sliderValue: p.sliderValue,
          toggleActive: p.toggleActive,
          explodeFactor: smoothExplodeRef.current,
          visibleLayers: p.visibleLayers,
          animate: p.animate,
          elapsed: elapsedSim,
          reducedMotion,
          liveReadout: (msg) => {
            if (msg !== lastStatusRef.current) {
              lastStatusRef.current = msg;
              setLiveStatus(msg);
            }
          },
        });
        built.rootGroup.updateMatrixWorld(true);
        renderer.render(scene, camera);
        if (!recordedExploration) {
          recordedExploration = true;
          mark3DExplored(lectureId);
        }
        projectLabelsDirect(built);
        lastRenderTime = now;
        needsRender = false;
      }

      if (
        !rafId && (
          (p.animate && !reducedMotion) ||
          cameraGoalRef.current.active ||
          controlsMoved ||
          Math.abs(smoothExplodeRef.current - p.explodeFactor) > 0.002
        )
      ) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const requestRender = () => {
      needsRender = true;
      if (!rafId && !disposed && isViewportVisible && isTabVisible) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        requestRender();
      } else if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              const visible = entries.some((e) => e.isIntersecting);
              isViewportVisible = visible;
              if (visible) {
                requestRender();
              } else if (rafId) {
                window.cancelAnimationFrame(rafId);
                rafId = 0;
              }
            },
            { threshold: 0.01 }
          )
        : null;
    io?.observe(container);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      requestRender();
    };
    motionQuery?.addEventListener('change', handleMotionChange);

    const handleControlsChange = () => requestRender();
    const handleControlsStart = () => {
      cameraGoalRef.current.active = false;
    };
    controls.addEventListener('change', handleControlsChange);
    controls.addEventListener('start', handleControlsStart);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError('3D graphics context lost. Waiting for browser recovery; reload if it does not recover.');
    };
    const handleContextRestored = () => {
      setWebglError(null);
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 420;
      if (w === sizeRef.current.w && h === sizeRef.current.h) return;
      sizeRef.current = { w, h };
      labelCacheRef.current = {};
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    engineRef.current = {
      renderer,
      scene,
      camera,
      controls,
      requestRender,
      resetElapsed: () => {
        elapsedSim = 0;
      },
    };

    return () => {
      disposed = true;
      if (envTimer !== null) window.clearTimeout(envTimer);
      if (rafId) window.cancelAnimationFrame(rafId);
      io?.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery?.removeEventListener('change', handleMotionChange);
      controls.removeEventListener('change', handleControlsChange);
      controls.removeEventListener('start', handleControlsStart);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      if (builtRef.current) {
        scene.remove(builtRef.current.rootGroup);
        builtRef.current.dispose();
        builtRef.current = null;
      }
      disposeObject3D(scene);
      if (envRT) envRT.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      engineRef.current = null;
    };
    // Mount persistent WebGL context once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap ONLY lecture 3D sub-scene and reset UI/camera state smoothly when lecture changes
  useEffect(() => {
    const nextPrimary = threeD.primaryModes[0]?.id ?? '';
    const nextSecondary = threeD.secondaryModes?.[0]?.id ?? '';
    const nextSlider = threeD.sliderDefault;
    const nextToggle = getDefaultToggleState(lectureId);
    const nextLayers = buildLayerVisibility(threeD.structureLayers);

    // Synchronize ref immediately so tick never reads stale modes from previous lecture
    paramsRef.current = {
      ...paramsRef.current,
      primaryMode: nextPrimary,
      secondaryMode: nextSecondary,
      sliderValue: nextSlider,
      toggleActive: nextToggle,
      explodeFactor: 0,
      visibleLayers: nextLayers,
    };

    setPrimaryMode(nextPrimary);
    setSecondaryMode(nextSecondary);
    setSliderValue(nextSlider);
    setToggleActive(nextToggle);
    setExplodeFactor(0);
    setTourIndex(-1);
    setShowLayersPanel(false);
    setVisibleLayers(nextLayers);
    lastStatusRef.current = threeD.subtitle;
    setLiveStatus(threeD.subtitle);

    const engine = engineRef.current;
    if (!engine) return;

    if (builtRef.current) {
      engine.scene.remove(builtRef.current.rootGroup);
      builtRef.current.dispose();
      builtRef.current = null;
    }

    labelCacheRef.current = {};
    const built = buildLectureScene(lectureId);
    builtRef.current = built;
    engine.scene.add(built.rootGroup);
    engine.resetElapsed();
    smoothExplodeRef.current = 0;

    setLabelMetas(
      built.labels.map((l) => ({
        id: l.id,
        text: l.text,
        subtext: l.subtext,
        layerId: l.layerId,
      }))
    );

    cameraGoalRef.current.active = false;
    engine.camera.position.set(...threeD.defaultCamera);
    engine.controls.target.set(...threeD.defaultTarget);
    engine.controls.update();
    engine.requestRender();
  }, [lectureId, threeD, mark3DExplored]);

  const activeTourStep = useMemo(
    () => (tourIndex >= 0 ? threeD.guidedTour[tourIndex] : null),
    [tourIndex, threeD.guidedTour]
  );

  return (
    <div className="rounded-2xl border border-marble bg-white shadow-sm overflow-hidden">
      {/* Top Bar of 3D Sandbox */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-b border-marble bg-ivory/70">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-navy tracking-tight truncate">
            {threeD.title}
          </h2>
          <p className="text-xs font-medium text-royal mt-0.5 font-mono tabular-nums truncate">
            {liveStatus}
          </p>
        </div>

        {/* Guided Tour Banner Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleSelectTourStep(tourIndex < 0 ? 0 : tourIndex - 1)}
            aria-label="Previous guided tour step"
            className="w-9 h-9 rounded-lg border border-marble bg-white text-navy hover:border-royal flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleSelectTourStep(tourIndex < 0 ? 0 : tourIndex + 1)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-royal/30 bg-white text-royal hover:bg-royal hover:text-ivory text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {tourIndex < 0
                ? `Guided Tour (${threeD.guidedTour.length} Steps)`
                : `Tour ${tourIndex + 1}/${threeD.guidedTour.length}`}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectTourStep(tourIndex + 1)}
            aria-label="Next guided tour step"
            className="w-9 h-9 rounded-lg border border-marble bg-white text-navy hover:border-royal flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive 3D Viewport Stage */}
      <div className="relative h-[470px] sm:h-[540px] w-full bg-[#eef1f6] overflow-hidden">
        <div
          ref={mountRef}
          className="w-full h-full touch-none"
          style={{ display: webglError ? 'none' : undefined }}
          role="img"
          aria-label={threeD.accessibleSummary}
        />
        {webglError ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto">
            <p className="text-sm font-bold text-navy">Interactive 3D Viewport Fallback</p>
            <p className="mt-2 text-xs text-navy/75 leading-relaxed">{webglError}</p>
            <p className="mt-3 text-xs text-royal bg-white p-4 rounded-xl border border-marble">
              {threeD.accessibleSummary}
            </p>
          </div>
        ) : (
          <>


            {/* Projected 3D Labels (positioned imperatively via refs; solid surface, zero backdrop-blur) */}
            {showLabels &&
              labelMetas.map((lbl) => (
                <div
                  key={lbl.id}
                  ref={(el) => {
                    labelDomRefs.current[lbl.id] = el;
                  }}
                  style={{ display: 'none', left: 0, top: 0 }}
                  className="pointer-events-none absolute px-2.5 py-1 rounded-md bg-navy text-ivory shadow-md border border-gold/50 whitespace-nowrap z-10 will-change-transform"
                >
                  <div className="text-[11px] font-bold leading-tight">{lbl.text}</div>
                  {lbl.subtext && (
                    <div className="text-[10px] text-gold leading-tight">{lbl.subtext}</div>
                  )}
                </div>
              ))}

            {/* Guided Tour Step Callout (top-left, solid surface) */}
            {activeTourStep && (
              <div className="absolute top-3 left-3 max-w-xs sm:max-w-sm rounded-xl bg-white border border-royal/30 p-3.5 shadow-lg z-20">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-royal">
                    Step {tourIndex + 1} · {activeTourStep.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTourIndex(-1)}
                    className="text-xs font-semibold text-navy/60 hover:text-navy cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <p className="mt-1 text-xs text-navy/85 leading-relaxed">
                  {activeTourStep.description}
                </p>
              </div>
            )}

            {/* Structure Layers Popover (top-right, solid surface) */}
            {showLayersPanel && (
              <div className="absolute top-3 right-3 w-56 rounded-xl bg-white border border-marble p-3 shadow-lg z-20 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-navy/60 pb-1 border-b border-marble">
                  Structure Visibility
                </div>
                {threeD.structureLayers.map((layer) => {
                  const vis = visibleLayers[layer.id] !== false;
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() =>
                        setVisibleLayers((prev) => ({ ...prev, [layer.id]: !vis }))
                      }
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-navy hover:bg-ivory cursor-pointer"
                    >
                      <span>{layer.label}</span>
                      {vis ? (
                        <Eye className="w-3.5 h-3.5 text-royal" aria-hidden="true" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-navy/35" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Collapsible Bottom Control Dock (ZERO backdrop-blur over WebGL) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-4xl rounded-xl border border-marble bg-white shadow-xl z-20">
              {/* Dock Header Bar */}
              <div className="flex items-center justify-between gap-2 px-3.5 py-2 border-b border-marble/70">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAnimate((v) => !v)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-royal text-ivory text-xs font-semibold hover:bg-navy cursor-pointer"
                  >
                    {animate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{animate ? 'Pause' : 'Play'}</span>
                  </button>
                  <div className="inline-flex rounded-md border border-marble overflow-hidden">
                    {([0.5, 1, 2] as const).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setAnimSpeed(spd)}
                        className={`px-2 py-1 text-[11px] font-mono font-semibold cursor-pointer ${
                          animSpeed === spd ? 'bg-navy text-ivory' : 'bg-white text-navy hover:bg-ivory'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleResetCamera}
                    aria-label="Reset camera"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-marble text-navy hover:border-royal text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset 360°</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLabels((v) => !v)}
                    aria-label="Show structure labels"
                    aria-pressed={showLabels}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-semibold cursor-pointer ${
                      showLabels
                        ? 'border-royal bg-royal/10 text-royal'
                        : 'border-marble text-navy/70'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Labels</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLayersPanel((v) => !v)}
                    aria-label="Structure layers"
                    aria-expanded={showLayersPanel}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-semibold cursor-pointer ${
                      showLayersPanel
                        ? 'border-royal bg-royal/10 text-royal'
                        : 'border-marble text-navy/70'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Layers</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setDockOpen((v) => !v)}
                  aria-label={dockOpen ? 'Collapse 3D parameters' : 'Expand 3D parameters'}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-navy hover:bg-ivory cursor-pointer shrink-0"
                >
                  <span className="hidden sm:inline">{dockOpen ? 'Hide Controls' : 'Controls'}</span>
                  {dockOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded Parameter Controls */}
              {dockOpen && (
                <div className="p-3.5 space-y-2.5">
                  {/* Primary Modes */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {threeD.primaryModes.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPrimaryMode(m.id)}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                          primaryMode === m.id
                            ? 'bg-royal text-ivory'
                            : 'bg-ivory text-navy hover:bg-marble/60'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Secondary Modes + Sliders + Feature Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1 border-t border-marble/60">
                    {/* Numeric Lecture Slider */}
                    <label className="flex flex-col gap-1 text-xs">
                      <span className="flex justify-between font-semibold text-navy">
                        <span>{threeD.sliderLabel}</span>
                        <span className="font-mono tabular-nums text-royal">
                          {sliderValue} {threeD.sliderUnit}
                        </span>
                      </span>
                      <input
                        type="range"
                        min={threeD.sliderMin}
                        max={threeD.sliderMax}
                        step={threeD.sliderStep}
                        value={sliderValue}
                        onChange={(e) => setSliderValue(Number(e.target.value))}
                        className="accent-royal cursor-pointer"
                      />
                    </label>

                    {/* Explode Layers Slider */}
                    <label className="flex flex-col gap-1 text-xs">
                      <span className="flex justify-between font-semibold text-navy">
                        <span>Explode Layers</span>
                        <span className="font-mono tabular-nums text-royal">
                          {Math.round(explodeFactor * 100)}%
                        </span>
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={explodeFactor}
                        onChange={(e) => setExplodeFactor(Number(e.target.value))}
                        className="accent-gold cursor-pointer"
                      />
                    </label>

                    {/* Secondary Toggle & Secondary Mode Select */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {threeD.secondaryModes && threeD.secondaryModes.length > 0 && (
                        <select
                          aria-label="Secondary material or variant"
                          value={secondaryMode}
                          onChange={(e) => setSecondaryMode(e.target.value)}
                          className="flex-1 min-w-[130px] rounded-md border border-marble bg-ivory px-2.5 py-1.5 text-xs font-semibold text-navy focus:outline-royal"
                        >
                          {threeD.secondaryModes.map((sm) => (
                            <option key={sm.id} value={sm.id}>
                              {sm.label}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        type="button"
                        onClick={() => setToggleActive((v) => !v)}
                        aria-pressed={toggleActive}
                        className={`px-2.5 py-1.5 rounded-md border text-xs font-semibold cursor-pointer ${
                          toggleActive
                            ? 'border-gold bg-gold/20 text-navy'
                            : 'border-marble bg-white text-navy/80 hover:border-royal'
                        }`}
                      >
                        {threeD.toggleLabel}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer Note */}
      <div className="px-5 py-3 bg-ivory/70 border-t border-marble flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-navy/75">
        <span>
          Drag to orbit 360° · Right-drag or two-finger drag to pan · Scroll/pinch to zoom
        </span>
        <span className="text-navy/65">{threeD.educationalNote}</span>
      </div>
    </div>
  );
};
