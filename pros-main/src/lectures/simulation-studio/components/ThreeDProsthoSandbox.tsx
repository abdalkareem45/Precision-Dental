import { ChevronDown, ChevronUp, Eye, Layers, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Hotspot3D, LectureModule } from '../types/prosthodontics';
import { buildLecture3DModel, BuiltLectureScene } from '../utils/webglModels';

interface ThreeDProsthoSandboxProps {
  lecture: LectureModule;
  isDark: boolean;
  onInteract: () => void;
}

type CameraPreset = 'isometric' | 'occlusal' | 'posterior' | 'sagittal';

const CAMERA_PRESETS: Record<CameraPreset, { pos: [number, number, number]; label: string }> = {
  isometric: { pos: [2.8, 2.4, 3.1], label: '3/4 Isometric' },
  occlusal: { pos: [0.01, 4.1, 0.35], label: 'Occlusal Top' },
  posterior: { pos: [0.0, 1.35, -3.6], label: 'Posterior View' },
  sagittal: { pos: [3.8, 0.65, 0.1], label: 'Sagittal Profile' },
};

const DARK_BG_HEX = 0x081636;
const LIGHT_BG_HEX = 0xf2efe7;

export function ThreeDProsthoSandbox({ lecture, isDark, onInteract }: ThreeDProsthoSandboxProps) {
  const { sandbox3D } = lecture;
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [paramValue, setParamValue] = useState<number>(sandbox3D.parameterDefault);
  const [variantId, setVariantId] = useState<string>(sandbox3D.variantOptions[0]?.id ?? 'default');
  const [explode, setExplode] = useState<number>(0);
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    sandbox3D.layers.forEach((l) => {
      map[l.id] = true;
    });
    return map;
  });
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot3D | null>(
    sandbox3D.hotspots[0] ?? null
  );
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset>('isometric');

  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  const sceneRef = useRef<THREE.Scene | null>(null);

  // Mutable simulation state synced into Three.js loop without remounting WebGL
  const simStateRef = useRef({
    paramValue,
    variantId,
    explode,
    layerVisibility,
    cameraTargetPos: null as THREE.Vector3 | null,
  });

  useEffect(() => {
    simStateRef.current.paramValue = paramValue;
    simStateRef.current.variantId = variantId;
    simStateRef.current.explode = explode;
    simStateRef.current.layerVisibility = layerVisibility;
  }, [paramValue, variantId, explode, layerVisibility]);

  // Reset local sandbox controls when switching lectures
  useEffect(() => {
    setParamValue(sandbox3D.parameterDefault);
    setVariantId(sandbox3D.variantOptions[0]?.id ?? 'default');
    setExplode(0);
    const nextLayers: Record<string, boolean> = {};
    sandbox3D.layers.forEach((l) => {
      nextLayers[l.id] = true;
    });
    setLayerVisibility(nextLayers);
    setSelectedHotspot(sandbox3D.hotspots[0] ?? null);
    setActivePreset('isometric');
  }, [lecture.id, sandbox3D]);

  const requestRenderRef = useRef<() => void>(() => {});
  const modelRef = useRef<BuiltLectureScene | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL Guard (detect SwiftShader / llvmpipe / WARP via renderer string)
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError('WebGL is unavailable in this browser context. Use the anatomical hotspot list below.');
      return;
    }

    setWebglError(null);
    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 360);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const bgHex = isDarkRef.current ? DARK_BG_HEX : LIGHT_BG_HEX;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.045);
    sceneRef.current = scene;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    const environmentTarget = pmremGenerator.fromScene(roomEnvironment, 0.04);
    scene.environment = environmentTarget.texture;
    roomEnvironment.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 40);
    camera.position.set(2.8, 2.4, 3.1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 1.9;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.target.set(0, 0.15, 0);

    // 3-point warm/cool studio lighting
    const hemiLight = new THREE.HemisphereLight(0xeef4ff, 0xc9b89c, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.4);
    keyLight.position.set(3.5, 5.2, 3.8);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -2.8;
      keyLight.shadow.camera.right = 2.8;
      keyLight.shadow.camera.top = 2.8;
      keyLight.shadow.camera.bottom = -2.8;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc7daff, 0.72);
    rimLight.position.set(-3.5, 2.5, -3.5);
    scene.add(rimLight);

    // Build lecture-specific composite model
    const built = buildLecture3DModel(lecture.id, sandbox3D.hotspots);
    modelRef.current = built;
    scene.add(built.root);

    // Pre-warm shaders when hardware WebGL is active
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycasting for 3D hotspot selection (Layer 1)
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();

    // Paced on-demand rendering + software WebGL afterDraw sync
    let animationFrameId = 0;
    let timeoutId = 0;
    let pendingSync: WebGLSync | null = null;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    const timer = new THREE.Timer();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      pendingSync = sync;
      gl.flush();
      const poll = () => {
        if (disposed) return;
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
    }

    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      animationFrameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        timer.update();
        const delta = Math.min(timer.getDelta(), 0.05);

        const st = simStateRef.current;
        built.setLayerVisibility(st.layerVisibility);
        built.updateSimulation(st.paramValue, st.variantId, st.explode, delta);

        // Smooth camera preset transition
        let animating = false;
        if (st.cameraTargetPos) {
          camera.position.x = THREE.MathUtils.damp(
            camera.position.x,
            st.cameraTargetPos.x,
            7,
            delta || 0.016
          );
          camera.position.y = THREE.MathUtils.damp(
            camera.position.y,
            st.cameraTargetPos.y,
            7,
            delta || 0.016
          );
          camera.position.z = THREE.MathUtils.damp(
            camera.position.z,
            st.cameraTargetPos.z,
            7,
            delta || 0.016
          );
          if (camera.position.distanceTo(st.cameraTargetPos) < 0.03) {
            st.cameraTargetPos = null;
          } else {
            animating = true;
          }
        }

        // Continue damping while exploded layers settle
        const targetExplodeY = st.explode * 0.55;
        const boneObj = built.root.children.find((c) => c.userData.layerId === 'bone');
        if (boneObj && Math.abs(boneObj.position.y - targetExplodeY) > 0.005) {
          animating = true;
        }

        controls.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || animating) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    requestRenderRef.current = requestRender;

    const handleControlStart = () => {
      simStateRef.current.cameraTargetPos = null;
      onInteract();
    };
    controls.addEventListener('start', handleControlStart);
    controls.addEventListener('change', requestRender);

    const handlePointerDown = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(built.hotspotMeshes, false);
      if (hits.length > 0) {
        const hs = hits[0].object.userData.hotspot as Hotspot3D | undefined;
        if (hs) {
          setSelectedHotspot(hs);
          onInteract();
          built.hotspotMeshes.forEach((m) => {
            const mat = m.material as THREE.MeshStandardMaterial;
            mat.color.setHex(m === hits[0].object ? 0x1b3a8c : 0xc9a24b);
          });
          requestRender();
        }
      }
    };
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError('3D graphics context paused. Restoring view...');
    };
    const handleContextRestored = () => {
      setWebglError(null);
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 300);
        const h = Math.max(entry.contentRect.height, 360);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        requestRender();
      }
    });
    resizeObserver.observe(container);

    // Initial render
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
      if (pendingSync) (renderer.getContext() as WebGL2RenderingContext).deleteSync(pendingSync);
      pendingSync = null;
      requestRenderRef.current = () => {};
      resizeObserver.disconnect();
      controls.removeEventListener('start', handleControlStart);
      controls.removeEventListener('change', requestRender);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      controls.dispose();
      timer.dispose();
      built.dispose();
      scene.environment = null;
      environmentTarget.dispose();
      keyLight.shadow.dispose();
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      sceneRef.current = null;
      modelRef.current = null;
    };
  }, [lecture.id, sandbox3D.hotspots, onInteract]);

  // Dynamically switch Three.js backdrop & fog on dark/light toggle without rebuilding WebGL
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const hex = isDark ? DARK_BG_HEX : LIGHT_BG_HEX;
    if (scene.background instanceof THREE.Color) {
      scene.background.setHex(hex);
    }
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.setHex(hex);
    }
    requestRenderRef.current();
  }, [isDark]);

  // Trigger re-render when React controls update
  useEffect(() => {
    requestRenderRef.current();
  }, [paramValue, variantId, explode, layerVisibility]);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    const [x, y, z] = CAMERA_PRESETS[preset].pos;
    simStateRef.current.cameraTargetPos = new THREE.Vector3(x, y, z);
    onInteract();
    requestRenderRef.current();
  };

  const handleReset = () => {
    setParamValue(sandbox3D.parameterDefault);
    setVariantId(sandbox3D.variantOptions[0]?.id ?? 'default');
    setExplode(0);
    const nextLayers: Record<string, boolean> = {};
    sandbox3D.layers.forEach((l) => {
      nextLayers[l.id] = true;
    });
    setLayerVisibility(nextLayers);
    applyCameraPreset('isometric');
  };

  return (
    <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl overflow-hidden transition-colors">
      {/* Header strip outside canvas */}
      <div className="p-5 sm:p-6 border-b border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
            Lecture {lecture.number} 3D Interactive Visual · Drag to orbit 360° · Scroll to zoom · Click pins
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] mt-1">
            {sandbox3D.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#0B1F4D]/75 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80 mt-1">
            {sandbox3D.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((presetKey) => (
            <button
              key={presetKey}
              type="button"
              onClick={() => applyCameraPreset(presetKey)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A24B] ${
                activePreset === presetKey
                  ? 'bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D]'
                  : 'bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B]'
              }`}
            >
              {CAMERA_PRESETS[presetKey].label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset 3D view and parameters"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 hover:border-[#C9A24B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport with Isolated Mount Container & Collapsible Bottom Dock */}
      <div className="relative h-[480px] sm:h-[540px] w-full bg-[#F2EFE7] in-[.prostho-studio[data-theme=dark]]:bg-[#081636]">
        {/* Isolated WebGL mount container */}
        <div
          ref={mountRef}
          className="w-full h-full"
          aria-label={`Interactive 3D anatomical model for ${sandbox3D.title}`}
        />

        {webglError && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] text-center">
            <div className="max-w-md space-y-2">
              <div className="text-sm font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
                3D WebGL Fallback Active
              </div>
              <p className="text-xs text-[#0B1F4D]/75 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80">{webglError}</p>
            </div>
          </div>
        )}

        {/* Top-left compact active hotspot readout */}
        {selectedHotspot && (
          <div className="absolute top-3 left-3 max-w-xs bg-[#0B1F4D]/92 in-[.prostho-studio[data-theme=dark]]:bg-[#06112B]/95 text-[#FAF8F3] rounded-lg p-3 border border-white/15 pointer-events-auto">
            <div className="text-[11px] font-semibold text-[#C9A24B]">{selectedHotspot.role}</div>
            <div className="text-xs font-bold mt-0.5">{selectedHotspot.label}</div>
            <p className="text-[11px] text-[#E6E8EC]/90 mt-1 leading-relaxed">
              {selectedHotspot.detail}
            </p>
          </div>
        )}

        {/* Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[min(920px,94%)] z-10 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setDockCollapsed((v) => !v)}
            className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-t-md text-[11px] font-semibold bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] text-[#FAF8F3] border border-b-0 border-white/15 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A24B]"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#C9A24B]" aria-hidden="true" />
                <span>Show 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#C9A24B]" aria-hidden="true" />
                <span>Hide Controls</span>
              </>
            )}
          </button>

          {!dockCollapsed && (
            <div className="w-full bg-[#0B1F4D]/95 in-[.prostho-studio[data-theme=dark]]:bg-[#06112B]/95 text-[#FAF8F3] rounded-xl border border-white/15 p-3.5 sm:p-4 space-y-3">
              {/* Row 1: Variant Mode Buttons + Layer Toggles */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {sandbox3D.variantOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setVariantId(opt.id);
                        onInteract();
                      }}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        variantId === opt.id
                          ? 'bg-[#C9A24B] text-[#0B1F4D]'
                          : 'bg-white/10 text-[#FAF8F3] hover:bg-white/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-[#E6E8EC]/70 mr-1 inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    Layers:
                  </span>
                  {sandbox3D.layers.map((layer) => {
                    const active = layerVisibility[layer.id] ?? true;
                    return (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => {
                          setLayerVisibility((prev) => ({ ...prev, [layer.id]: !active }));
                          onInteract();
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-[#1B3A8C] text-white border border-[#C9A24B]/60'
                            : 'bg-white/5 text-[#E6E8EC]/50 border border-white/10'
                        }`}
                      >
                        {layer.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Parameter Slider + Exploded View Slider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <label className="block space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#E6E8EC]">{sandbox3D.parameterLabel}</span>
                    <span className="font-mono tabular-nums font-semibold text-[#C9A24B]">
                      {paramValue} {sandbox3D.parameterUnit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={sandbox3D.parameterMin}
                    max={sandbox3D.parameterMax}
                    step={sandbox3D.parameterStep}
                    value={paramValue}
                    onChange={(e) => {
                      setParamValue(Number(e.target.value));
                      onInteract();
                    }}
                    className="w-full accent-[#C9A24B] cursor-pointer"
                  />
                </label>

                <label className="block space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#E6E8EC] inline-flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#C9A24B]" aria-hidden="true" />
                      Exploded Layer Separation
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-[#C9A24B]">
                      {Math.round(explode * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={explode}
                    onChange={(e) => {
                      setExplode(Number(e.target.value));
                      onInteract();
                    }}
                    className="w-full accent-[#C9A24B] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Accessible Text & Keyboard-Operable Hotspot Legend Below 3D Stage */}
      <div className="p-4 sm:p-5 bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border-t border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div className="text-xs text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85">
          <span className="font-semibold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
            Active Configuration:{' '}
          </span>
          {sandbox3D.variantOptions.find((v) => v.id === variantId)?.description}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {sandbox3D.hotspots.map((hs) => (
            <button
              key={hs.id}
              type="button"
              onClick={() => {
                setSelectedHotspot(hs);
                onInteract();
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedHotspot?.id === hs.id
                  ? 'bg-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D]'
                  : 'bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B]'
              }`}
            >
              {hs.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
