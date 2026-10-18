import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Maximize2, Minimize2, RotateCcw, Eye, Sliders, Info, Sparkles } from 'lucide-react';

interface ThreeCanvasContainerProps {
  title: string;
  badge?: string;
  onInitScene: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls
  ) => {
    update: (delta: number) => void;
    dispose?: () => void;
    onSliderChange?: (value: number) => void;
    onToggleLayer?: (layerId: string) => void;
    resetView?: () => void;
  };
  sliderLabel?: string;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderInitial?: number;
  layers?: { id: string; label: string; active: boolean }[];
  annotations?: { label: string; text: string }[];
  heightClass?: string;
}

export const ThreeCanvasContainer: React.FC<ThreeCanvasContainerProps> = ({
  title,
  badge = '3D Interactive Model',
  onInitScene,
  sliderLabel,
  sliderMin = 0,
  sliderMax = 100,
  sliderStep = 1,
  sliderInitial = 0,
  layers,
  annotations,
  heightClass = 'h-[380px] sm:h-[480px] md:h-[540px]'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [sliderValue, setSliderValue] = useState(sliderInitial);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>(
    layers ? Object.fromEntries(layers.map(l => [l.id, l.active])) : {}
  );
  const [activeAnnotationIndex, setActiveAnnotationIndex] = useState<number | null>(null);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mutable refs to hold Three.js hooks
  const callbacksRef = useRef<{
    update?: (delta: number) => void;
    dispose?: () => void;
    onSliderChange?: (value: number) => void;
    onToggleLayer?: (layerId: string) => void;
    resetView?: () => void;
    controls?: OrbitControls;
    camera?: THREE.PerspectiveCamera;
  }>({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5F6F8);
    scene.fog = new THREE.FogExp2(0xF5F6F8, 0.035);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6.5);

    // 2. Renderer Setup
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.replaceChildren(renderer.domElement);

    // 3. Studio Lighting & Procedural Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Key Light (Warm Sun / Clinical Spotlight)
    const keyLight = new THREE.DirectionalLight(0xFFF7E6, 2.2);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Fill Light (Cool sky soft reflection)
    const fillLight = new THREE.DirectionalLight(0xCCE0FF, 1.0);
    fillLight.position.set(-4, 3, -4);
    scene.add(fillLight);

    // Hemisphere Light for natural ambient transition
    const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x0B1F4D, 0.7);
    scene.add(hemiLight);

    // Contact Shadow Ground Plane
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      grad.addColorStop(0, 'rgba(11, 31, 77, 0.4)');
      grad.addColorStop(0.5, 'rgba(11, 31, 77, 0.15)');
      grad.addColorStop(1, 'rgba(11, 31, 77, 0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.5;
    scene.add(shadowPlane);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 14;
    controls.minDistance = 2;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, 0, 0);

    // Call user init
    const userScene = onInitScene(scene, camera, renderer, controls);
    callbacksRef.current = {
      ...userScene,
      controls,
      camera,
    };

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // 5. Animation Loop
    let animId: number;
    const clock = new THREE.Timer();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock.update();
      const delta = clock.getDelta();
      controls.autoRotate = isAutoRotating;
      controls.autoRotateSpeed = 1.2;
      controls.update();

      if (callbacksRef.current.update) {
        callbacksRef.current.update(delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Responsive Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      clock.dispose();
      resizeObserver.disconnect();
      if (callbacksRef.current.dispose) {
        callbacksRef.current.dispose();
      }
      controls.dispose();
      renderer.dispose();
      envTexture.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      container.replaceChildren();
    };
  }, []);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSliderValue(val);
    if (callbacksRef.current.onSliderChange) {
      callbacksRef.current.onSliderChange(val);
    }
  };

  const handleToggleLayer = (layerId: string) => {
    const next = !activeLayers[layerId];
    setActiveLayers(prev => ({ ...prev, [layerId]: next }));
    if (callbacksRef.current.onToggleLayer) {
      callbacksRef.current.onToggleLayer(layerId);
    }
  };

  const handleReset = () => {
    if (callbacksRef.current.resetView) {
      callbacksRef.current.resetView();
    } else if (callbacksRef.current.controls && callbacksRef.current.camera) {
      callbacksRef.current.camera.position.set(0, 2.5, 6.5);
      callbacksRef.current.controls.target.set(0, 0, 0);
      callbacksRef.current.controls.update();
    }
    setSliderValue(sliderInitial);
    if (callbacksRef.current.onSliderChange) {
      callbacksRef.current.onSliderChange(sliderInitial);
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-[#E6E8EC] bg-[#FAF8F3] shadow-md group ${heightClass}`}>
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none" />

      {/* Top Floating Badge & Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none z-10">
        <div className="pointer-events-auto bg-[#0B1F4D]/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-[#C9A24B]/30 flex items-center gap-2 max-w-[70%]">
          <Sparkles className="w-4 h-4 text-[#C9A24B] shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A24B] block leading-none">
              {badge}
            </span>
            <span className="text-xs font-bold text-white truncate block leading-tight mt-0.5">
              {title}
            </span>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-[#E6E8EC]">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              isAutoRotating ? 'bg-[#0B1F4D] text-[#C9A24B]' : 'text-[#0B1F4D] hover:bg-[#E6E8EC]'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCcw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-xs font-medium text-[#0B1F4D] hover:bg-[#E6E8EC] transition-colors"
            title="Reset Camera & View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Annotations Hotspots (if provided) */}
      {annotations && annotations.length > 0 && (
        <div className="absolute top-14 left-3 z-10 flex flex-wrap gap-1.5 max-w-[85%]">
          {annotations.map((ann, idx) => {
            const isSelected = activeAnnotationIndex === idx;
            return (
              <button
                key={ann.label}
                onClick={() => setActiveAnnotationIndex(isSelected ? null : idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#C9A24B] text-[#0B1F4D] ring-2 ring-[#0B1F4D]'
                    : 'bg-white/85 backdrop-blur-md text-[#0B1F4D] hover:bg-white border border-[#E6E8EC]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A8C]" />
                <span>{ann.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Annotation Card Overlay */}
      {activeAnnotationIndex !== null && annotations && annotations[activeAnnotationIndex] && (
        <div className="absolute top-24 left-3 right-3 sm:right-auto sm:max-w-xs z-20 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-[#C9A24B]/40 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-1 border-b border-[#E6E8EC]">
            <span className="text-xs font-bold text-[#0B1F4D] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#1B3A8C]" />
              {annotations[activeAnnotationIndex].label}
            </span>
            <button
              onClick={() => setActiveAnnotationIndex(null)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
            {annotations[activeAnnotationIndex].text}
          </p>
        </div>
      )}

      {/* Bottom Collapsible Control Dock (Per ThreeJS Constitution: 100% unobstructed center) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-md sm:max-w-lg">
        {/* Toggle Collapse Bar */}
        <div className="flex justify-center -mb-2 relative z-30">
          <button
            onClick={() => setDockCollapsed(!dockCollapsed)}
            className="bg-[#0B1F4D] text-[#FAF8F3] hover:text-[#C9A24B] text-[10px] font-bold px-3 py-0.5 rounded-t-lg shadow-sm border-t border-x border-[#C9A24B]/40 transition-colors flex items-center gap-1"
          >
            {dockCollapsed ? '▲ Show 3D Controls' : '▼ Collapse Controls'}
          </button>
        </div>

        {/* Dock Panel */}
        <div
          className={`bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-xl border border-[#C9A24B]/35 transition-all duration-300 ${
            dockCollapsed ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Slider (e.g. Exploded view / Procedure step / Cavity depth) */}
          {sliderLabel && (
            <div className="mb-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-[#0B1F4D] mb-1">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#1B3A8C]" />
                  {sliderLabel}
                </span>
                <span className="text-[#C9A24B] font-mono font-bold bg-[#0B1F4D] px-2 py-0.5 rounded-md text-[11px]">
                  {sliderValue}
                </span>
              </div>
              <input
                type="range"
                min={sliderMin}
                max={sliderMax}
                step={sliderStep}
                value={sliderValue}
                onChange={handleSlider}
                className="w-full h-1.5 bg-[#E6E8EC] rounded-lg appearance-none cursor-pointer accent-[#C9A24B]"
              />
            </div>
          )}

          {/* Toggleable Layer Chips */}
          {layers && layers.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 border-t border-[#E6E8EC]/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <Eye className="w-3 h-3" /> Layers:
              </span>
              {layers.map(layer => {
                const active = activeLayers[layer.id];
                return (
                  <button
                    key={layer.id}
                    onClick={() => handleToggleLayer(layer.id)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all shrink-0 ${
                      active
                        ? 'bg-[#1B3A8C] text-white shadow-xs'
                        : 'bg-[#E6E8EC] text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {layer.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Touch instructions footnote for mobile & tablet */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-[#E6E8EC]/60">
            <span>Drag: Rotate • Pinch: Zoom • 2-Fingers: Pan</span>
            <span className="text-[#1B3A8C] font-medium hidden sm:inline">Precision 3D Viewport</span>
          </div>
        </div>
      </div>
    </div>
  );
};
