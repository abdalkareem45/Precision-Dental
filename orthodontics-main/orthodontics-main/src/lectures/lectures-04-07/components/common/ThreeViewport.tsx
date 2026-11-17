import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export interface CameraPreset {
  id: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface ThreeSceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  isSoftwareGl: boolean;
  prefersReducedMotion: boolean;
  requestRender: () => void;
}

interface ThreeViewportProps {
  title: string;
  subtitle: string;
  presets: CameraPreset[];
  initialPresetId?: string;
  heightClass?: string;
  fallbackText: string;
  onBuildScene: (ctx: ThreeSceneContext) => {
    update?: (delta: number, elapsed: number) => boolean | void;
    dispose?: () => void;
  };
  renderDock: (controls: {
    activePresetId: string;
    selectPreset: (presetId: string) => void;
    resetView: () => void;
  }) => ReactNode;
  telemetryReadout?: ReactNode;
}

const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

function detectSoftwareGl(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function disposeObjectTree(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
      geometries.add(obj.geometry);
      const mat = obj.material;
      (Array.isArray(mat) ? mat : [mat]).forEach((material) => materials.add(material));
      if (obj instanceof THREE.InstancedMesh) obj.dispose();
    }
    if (obj instanceof THREE.Light && 'shadow' in obj) {
      (obj.shadow as THREE.LightShadow).dispose();
    }
  });
  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      if (value instanceof THREE.Texture) textures.add(value);
    });
    material.dispose();
  });
  textures.forEach((texture) => texture.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

export function ThreeViewport({
  title,
  subtitle,
  presets,
  initialPresetId,
  heightClass = 'h-[470px] sm:h-[540px]',
  fallbackText,
  onBuildScene,
  renderDock,
  telemetryReadout,
}: ThreeViewportProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [activePresetId, setActivePresetId] = useState(
    initialPresetId ?? presets[0]?.id ?? 'default'
  );

  const onBuildSceneRef = useRef(onBuildScene);
  onBuildSceneRef.current = onBuildScene;

  const presetsRef = useRef(presets);
  presetsRef.current = presets;

  const transitionRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(),
    target: new THREE.Vector3(),
  });

  const requestRenderFnRef = useRef<() => void>(() => {});

  const selectPreset = (presetId: string) => {
    const found = presetsRef.current.find((p) => p.id === presetId);
    if (!found) return;
    setActivePresetId(presetId);
    transitionRef.current.pos.set(...found.position);
    transitionRef.current.target.set(...found.target);
    transitionRef.current.active = true;
    requestRenderFnRef.current();
  };

  const resetView = () => {
    const first = presetsRef.current.find((preset) => preset.id === initialPresetId) ?? presetsRef.current[0];
    if (first) selectPreset(first.id);
  };

  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = Math.max(mountEl.clientWidth || 640, 280);
    const height = Math.max(mountEl.clientHeight || 460, 280);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute('aria-label', `${title}. Drag to orbit, scroll to zoom, or use the camera view buttons below.`);

    const scene = new THREE.Scene();
    const bgHex = 0x0b1f4d;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.018);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    const firstPreset = presetsRef.current.find((p) => p.id === (initialPresetId ?? presetsRef.current[0]?.id)) ?? presetsRef.current[0];
    if (firstPreset) {
      camera.position.set(...firstPreset.position);
    } else {
      camera.position.set(0, 4, 12);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl && !prefersReducedMotion;
    controls.dampingFactor = 0.07;
    controls.minDistance = 3;
    controls.maxDistance = 32;
    controls.maxPolarAngle = Math.PI * 0.88;
    if (firstPreset) {
      controls.target.set(...firstPreset.target);
    }
    controls.update();

    // Balanced 3-point studio lighting with warm key + cool hemi fill
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.72);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.55);
    keyLight.position.set(8, 12, 9);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 36;
      keyLight.shadow.camera.left = -8;
      keyLight.shadow.camera.right = 8;
      keyLight.shadow.camera.top = 8;
      keyLight.shadow.camera.bottom = -8;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.85);
    rimLight.position.set(-9, 6, -8);
    scene.add(rimLight);

    // Subtle grounded radial shadow floor
    const floorGeo = new THREE.CircleGeometry(14, 48);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x09193e,
      roughness: 0.9,
      metalness: 0.05,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -3.4;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const gridHelper = new THREE.GridHelper(16, 16, 0x264cb5, 0x162d66);
    gridHelper.position.y = -3.38;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    scene.add(gridHelper);

    let disposed = false;
    let frameId = 0;
    let timeoutId = 0;
    let pendingSync: WebGLSync | null = null;
    let renderBusy = false;
    let renderDirty = false;
    let contextUnavailable = false;
    const timer = new THREE.Timer();
    timer.connect(document);

    const afterDraw = (cb: () => void) => {
      if (disposed) return;
      try {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (typeof gl.fenceSync === 'function') {
          const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
          pendingSync = sync;
          gl.flush();
          const poll = () => {
            if (disposed) {
              if (sync) gl.deleteSync(sync);
              pendingSync = null;
              return;
            }
            const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
            if (state === gl.UNSIGNALED) {
              timeoutId = window.setTimeout(poll, 5);
            } else {
              if (sync) gl.deleteSync(sync);
              pendingSync = null;
              timeoutId = window.setTimeout(cb, 80);
            }
          };
          timeoutId = window.setTimeout(poll, 5);
          return;
        }
      } catch {
        // Fallback if WebGL1 context without fenceSync
      }
      timeoutId = window.setTimeout(cb, 80);
    };

    const requestRender = () => {
      if (disposed || contextUnavailable) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = window.requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;

        timer.update();
        const delta = Math.min(timer.getDelta(), 0.05);
        const elapsed = timer.getElapsed();

        let keepAnimating = false;

        if (transitionRef.current.active) {
          _targetPos.copy(transitionRef.current.pos);
          _targetLook.copy(transitionRef.current.target);
          if (prefersReducedMotion) {
            camera.position.copy(_targetPos);
            controls.target.copy(_targetLook);
            transitionRef.current.active = false;
          } else {
            const lambda = 7.5;
            camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetPos.x, lambda, delta);
            camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetPos.y, lambda, delta);
            camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetPos.z, lambda, delta);
            controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLook.x, lambda, delta);
            controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLook.y, lambda, delta);
            controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLook.z, lambda, delta);

            if (
              camera.position.distanceTo(_targetPos) < 0.02 &&
              controls.target.distanceTo(_targetLook) < 0.02
            ) {
              camera.position.copy(_targetPos);
              controls.target.copy(_targetLook);
              transitionRef.current.active = false;
            } else {
              keepAnimating = true;
            }
          }
        }

        const controlsChanged = controls.update();
        if (controlsChanged && controls.enableDamping) {
          keepAnimating = true;
        }

        const sceneWantsMore = sceneHooks.update?.(delta, elapsed);
        if (sceneWantsMore) {
          keepAnimating = true;
        }

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || keepAnimating)) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    };

    requestRenderFnRef.current = requestRender;

    const sceneHooks = onBuildSceneRef.current({
      scene,
      camera,
      renderer,
      controls,
      isSoftwareGl,
      prefersReducedMotion,
      requestRender,
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const onControlStart = () => {
      transitionRef.current.active = false;
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextUnavailable = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      if (pendingSync) (renderer.getContext() as WebGL2RenderingContext).deleteSync(pendingSync);
      pendingSync = null;
      renderBusy = false;
      setContextLost(true);
    };
    const onContextRestored = () => {
      contextUnavailable = false;
      timer.reset();
      setContextLost(false);
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const resizeObserver = new ResizeObserver((entries) => {
      if (disposed) return;
      for (const entry of entries) {
        const w = Math.max(Math.floor(entry.contentRect.width), 240);
        const h = Math.max(Math.floor(entry.contentRect.height), 240);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        requestRender();
      }
    });
    resizeObserver.observe(mountEl);

    requestRender();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      if (pendingSync) (renderer.getContext() as WebGL2RenderingContext).deleteSync(pendingSync);
      pendingSync = null;
      timer.dispose();
      requestRenderFnRef.current = () => {};
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      sceneHooks.dispose?.();
      disposeObjectTree(scene);
      envTarget.dispose();
      renderer.dispose();
      if (mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, [initialPresetId]);

  if (webglError) {
    return (
      <div className="rounded-xl bg-[#0B1F4D] text-white p-6 border border-[#1B3A8C]">
        <h4 className="text-base font-bold text-[#C9A24B] mb-2">{title} — 3D WebGL Unavailable</h4>
        <p className="text-sm text-[#E6E8EC] leading-relaxed">{fallbackText}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${heightClass} rounded-xl overflow-hidden bg-[#0B1F4D] border border-[#0B1F4D] select-none`}
    >
      {/* Dedicated empty Three.js mount container */}
      <div ref={canvasMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top-Left Minimal Spec Header */}
      <div className="pointer-events-none absolute top-3.5 left-3.5 right-3.5 flex flex-wrap items-start justify-between gap-2 z-10">
        <div className="pointer-events-auto bg-[#0B1F4D]/90 border border-[#C9A24B]/35 rounded-lg px-3.5 py-2 max-w-md">
          <p className="text-[11px] font-semibold tracking-wide text-[#C9A24B]">{title}</p>
          <p className="text-xs text-[#E6E8EC] leading-snug mt-0.5">{subtitle}</p>
        </div>

        {telemetryReadout && (
          <div className="pointer-events-auto bg-[#0B1F4D]/90 border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white tabular-nums">
            {telemetryReadout}
          </div>
        )}
      </div>

      {contextLost && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0B1F4D]/95 p-6 text-center">
          <div className="max-w-md">
            <p className="text-sm font-bold text-[#C9A24B] mb-1">WebGL Context Interrupted</p>
            <p className="text-xs text-[#E6E8EC]">{fallbackText}</p>
          </div>
        </div>
      )}

      {/* Collapsible Bottom Control Dock (zero center viewport occlusion, no backdrop-blur) */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex flex-col items-center">
        <button
          type="button"
          onClick={() => setDockCollapsed((c) => !c)}
          aria-expanded={!dockCollapsed}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-[#0B1F4D] border border-b-0 border-[#C9A24B]/45 text-[11px] font-semibold text-[#FAF8F3] hover:text-[#C9A24B] transition-colors cursor-pointer"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Show Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Hide Controls</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="pointer-events-auto w-full max-w-230 bg-[#0B1F4D]/95 border border-[#C9A24B]/35 rounded-xl px-4 py-3 text-white shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/12">
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Camera views">
                {presets.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => selectPreset(preset.id)}
                      aria-pressed={isActive}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#C9A24B] text-[#0B1F4D]'
                          : 'bg-white/10 text-[#E6E8EC] hover:bg-white/20'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={resetView}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#E6E8EC] hover:text-[#C9A24B] bg-white/5 hover:bg-white/10 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Reset View</span>
              </button>
            </div>

            {renderDock({ activePresetId, selectPreset, resetView })}
          </div>
        )}
      </div>
    </div>
  );
}
