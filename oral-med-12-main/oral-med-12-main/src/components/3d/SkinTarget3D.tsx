import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ZoomIn, ZoomOut, Sparkles, Layers, Info, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SkinTarget3DProps {
  lesionType?: 'classic-target' | 'atypical-purpuric' | 'cross-section';
  bsaPercentage?: number;
  onBsaChange?: (bsa: number) => void;
}

export const SkinTarget3D: React.FC<SkinTarget3DProps> = ({
  lesionType = 'classic-target',
  bsaPercentage = 15,
  onBsaChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const targetGroupRef = useRef<THREE.Group | null>(null);

  const [activeView, setActiveView] = useState<'classic-target' | 'atypical-purpuric' | 'cross-section'>(lesionType);
  const [bsa, setBsa] = useState<number>(bsaPercentage);
  const [activeZone, setActiveZone] = useState<'all' | 'center' | 'mid' | 'outer'>('all');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [nikolskyTested, setNikolskyTested] = useState<boolean>(false);
  const [cleavageSeparation, setCleavageSeparation] = useState<number>(0.35); // For cross-section

  // Zoom level preset
  const [zoomPreset, setZoomPreset] = useState<'normal' | 'macro' | 'ultra'>('macro');

  // Mouse & Touch interaction
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const modelRotationRef = useRef({ x: 0.85, y: 0 }); // Well tilted forward toward camera
  const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.2, 1.8));

  // Sync lesionType prop
  useEffect(() => {
    setActiveView(lesionType);
  }, [lesionType]);

  // Adjust camera distance based on zoom preset
  useEffect(() => {
    if (zoomPreset === 'ultra') {
      targetCameraPosRef.current.set(0, 0.1, 1.35); // Extreme close-up
    } else if (zoomPreset === 'macro') {
      targetCameraPosRef.current.set(0, 0.2, 1.75); // Prominent large view
    } else {
      targetCameraPosRef.current.set(0, 0.25, 2.1);
    }
  }, [zoomPreset]);

  // Setup Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913); // High-contrast clinical navy

    // CAMERA POSITIONED MUCH CLOSER TO FILL VIEWPORT (NO MORE ZOOMED OUT!)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 1.75);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 2.2);
    rimLight.position.set(-3, -2, -3);
    scene.add(rimLight);

    const targetGroup = new THREE.Group();
    targetGroupRef.current = targetGroup;
    scene.add(targetGroup);

    // RENDER LOOP with smooth camera position interpolation
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth camera interpolation
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCameraPosRef.current, 0.08);
      }

      if (isAutoRotating && !isDraggingRef.current) {
        modelRotationRef.current.y = Math.sin(t * 0.5) * 0.3;
      }

      targetGroup.rotation.y = modelRotationRef.current.y;
      targetGroup.rotation.x = modelRotationRef.current.x;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // BUILD 3D LESION OR CROSS SECTION BASED ON ACTIVE VIEW & PARAMETERS
  useEffect(() => {
    if (!targetGroupRef.current) return;
    const group = targetGroupRef.current;
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (activeView === 'classic-target') {
      // 1. CLASSIC ERYTHEMA MULTIFORME TARGET / IRIS LESION
      // Enlarged skin disc base
      const baseSkinGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.1, 64);
      const baseSkinMat = new THREE.MeshStandardMaterial({
        color: 0xdeb887,
        roughness: 0.65,
      });
      const base = new THREE.Mesh(baseSkinGeo, baseSkinMat);
      base.position.y = -0.05;
      group.add(base);

      // Ring 3: Peripheral Red Erythematous Halo (Vasodilatation)
      const outerRingGeo = new THREE.RingGeometry(0.9, 1.55, 64);
      const isOuterSelected = activeZone === 'outer';
      const outerRingMat = new THREE.MeshStandardMaterial({
        color: isOuterSelected ? 0xff1e56 : 0xbe123c,
        emissive: isOuterSelected ? 0xe11d48 : 0x4c0519,
        emissiveIntensity: isOuterSelected ? 1.0 : 0.2,
        side: THREE.DoubleSide,
        roughness: 0.35,
      });
      const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
      outerRing.name = 'outer';
      outerRing.rotation.x = -Math.PI / 2;
      outerRing.position.y = isOuterSelected ? 0.05 : 0.01;
      group.add(outerRing);

      // Ring 2: Intermediate Pale Edematous Ring (Elevated by Papillary Dermal Edema)
      const midRingGeo = new THREE.RingGeometry(0.45, 0.9, 64);
      const isMidSelected = activeZone === 'mid';
      const midRingMat = new THREE.MeshStandardMaterial({
        color: isMidSelected ? 0xffffff : 0xfecdd3,
        emissive: isMidSelected ? 0xfbcfe8 : 0x881337,
        emissiveIntensity: isMidSelected ? 0.9 : 0.15,
        side: THREE.DoubleSide,
        roughness: 0.25,
      });
      const midRing = new THREE.Mesh(midRingGeo, midRingMat);
      midRing.name = 'mid';
      midRing.rotation.x = -Math.PI / 2;
      // Visibly elevate edematous ring!
      midRing.position.y = isMidSelected ? 0.09 : 0.04;
      group.add(midRing);

      // Ring 1: Central Dusky Violaceous / Necrotic Core
      const innerDiscGeo = new THREE.CircleGeometry(0.45, 64);
      const isCenterSelected = activeZone === 'center';
      const innerDiscMat = new THREE.MeshStandardMaterial({
        color: isCenterSelected ? 0x9f1239 : 0x4c0519,
        emissive: isCenterSelected ? 0xbe185d : 0x000000,
        emissiveIntensity: isCenterSelected ? 1.2 : 0.1,
        side: THREE.DoubleSide,
        roughness: 0.45,
      });
      const innerDisc = new THREE.Mesh(innerDiscGeo, innerDiscMat);
      innerDisc.name = 'center';
      innerDisc.rotation.x = -Math.PI / 2;
      innerDisc.position.y = isCenterSelected ? 0.12 : 0.06;
      group.add(innerDisc);

      // Central micro-vesicle blister (prominent fluid-filled dome)
      const vesGeo = new THREE.SphereGeometry(0.16, 24, 24);
      const vesMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: isCenterSelected ? 0xeab308 : 0xca8a04,
        emissiveIntensity: isCenterSelected ? 0.9 : 0.4,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
      });
      const ves = new THREE.Mesh(vesGeo, vesMat);
      ves.position.set(0, isCenterSelected ? 0.18 : 0.12, 0);
      ves.scale.set(1.2, 0.6, 1.2); // flat dome
      group.add(ves);

      // Highlight Marker Pin over active zone
      if (activeZone !== 'all') {
        const pinGeo = new THREE.ConeGeometry(0.06, 0.25, 16);
        const pinMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.8,
        });
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.rotation.x = Math.PI; // point downward
        if (activeZone === 'center') pin.position.set(0, 0.45, 0);
        else if (activeZone === 'mid') pin.position.set(0.68, 0.4, 0);
        else if (activeZone === 'outer') pin.position.set(1.2, 0.35, 0);
        group.add(pin);
      }

    } else if (activeView === 'atypical-purpuric') {
      // 2. SJS / TEN ATYPICAL PURPURIC TARGETS WITH REAL-TIME EPIDERMAL SLOUGHING
      // Underlying Denuded Dermis (Raw, weeping glistening red bed)
      const dermisBaseGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.1, 64);
      const dermisBaseMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b, // raw red exudative dermis
        emissive: 0x7f1d1d,
        emissiveIntensity: 0.4,
        roughness: 0.3, // glistening wet surface
      });
      const dermisBase = new THREE.Mesh(dermisBaseGeo, dermisBaseMat);
      dermisBase.position.y = -0.05;
      group.add(dermisBase);

      // Flat coalescent purpuric macules (irregular atypical targets)
      const purpGeo = new THREE.RingGeometry(0.2, 1.55, 48);
      const purpMat = new THREE.MeshStandardMaterial({
        color: 0x3b0764,
        emissive: 0x581c87,
        emissiveIntensity: 0.4,
        side: THREE.DoubleSide,
        roughness: 0.6,
      });
      const purpMesh = new THREE.Mesh(purpGeo, purpMat);
      purpMesh.rotation.x = -Math.PI / 2;
      purpMesh.position.y = 0.01;
      group.add(purpMesh);

      // DYNAMIC DETACHMENT SHEET (PEELS BACK & ROLLS ACCORDING TO BSA SLIDER & NIKOLSKY TEST!)
      // Peel displacement based on BSA (1% to 65%)
      const peelRatio = Math.min(1.0, bsa / 50) * (nikolskyTested ? 1.4 : 1.0);
      const sloughGeo = new THREE.PlaneGeometry(1.6, 1.4, 16, 16);
      
      // Deform plane vertices to simulate curling and wrinkled flaccid detachment!
      const pos = sloughGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // Curl up one edge as peelRatio increases
        if (x > -0.2) {
          const curl = Math.pow((x + 0.2) / 1.0, 2) * (0.35 + peelRatio * 0.45);
          pos.setZ(i, curl);
        }
      }
      sloughGeo.computeVertexNormals();

      const sloughMat = new THREE.MeshStandardMaterial({
        color: 0x6b21a8,
        emissive: 0x4a044e,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: Math.max(0.4, 0.95 - peelRatio * 0.4),
        roughness: 0.4,
        side: THREE.DoubleSide,
      });
      const sloughMesh = new THREE.Mesh(sloughGeo, sloughMat);
      sloughMesh.rotation.x = -Math.PI / 2;
      sloughMesh.position.set(0.1 - peelRatio * 0.3, 0.08 + peelRatio * 0.15, 0);
      group.add(sloughMesh);

      // Flaccid blister fluid pockets underneath sheet
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const bGeo = new THREE.SphereGeometry(0.12, 12, 12);
        const bMat = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          transparent: true,
          opacity: 0.7,
        });
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.set(Math.cos(angle) * 0.75, 0.05, Math.sin(angle) * 0.75);
        bMesh.scale.set(1.5, 0.3, 1.2);
        group.add(bMesh);
      }

    } else {
      // 3. 3D HISTOPATHOLOGY CROSS-SECTION (DERMO-EPIDERMAL JUNCTION CLEAVAGE PLANE)
      // Dermis Layer (Dense collagen with capillary loops)
      const dermisGeo = new THREE.BoxGeometry(2.4, 0.65, 1.4);
      const dermisMat = new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        roughness: 0.6,
      });
      const dermis = new THREE.Mesh(dermisGeo, dermisMat);
      dermis.position.set(0, -0.35, 0);
      group.add(dermis);

      // Superficial capillary loop vessels in papillary dermis
      for (let i = -3; i <= 3; i++) {
        const capGeo = new THREE.TorusGeometry(0.1, 0.025, 8, 16, Math.PI);
        const capMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(i * 0.32, -0.05, 0);
        group.add(cap);
      }

      // Epidermal Layer (Stratified squamous keratinocytes)
      const epiGeo = new THREE.BoxGeometry(2.4, 0.45, 1.4);
      const epiMat = new THREE.MeshStandardMaterial({
        color: 0x9d174d,
        transparent: true,
        opacity: 0.9,
        roughness: 0.35,
      });
      const epi = new THREE.Mesh(epiGeo, epiMat);
      // Interactive separation distance!
      epi.position.set(0, 0.25 + cleavageSeparation, 0);
      group.add(epi);

      // Cleavage Separation Gap - Subepidermal Bulla cavity
      // Apoptotic Keratinocyte Civatte Bodies (Necrotic cells floating along basal line)
      const apopMat = new THREE.MeshStandardMaterial({
        color: 0x7f1d1d,
        emissive: 0x991b1b,
        emissiveIntensity: 0.8,
      });
      for (let i = -5; i <= 5; i++) {
        const apopGeo = new THREE.SphereGeometry(0.075, 12, 12);
        const apop = new THREE.Mesh(apopGeo, apopMat);
        apop.position.set(i * 0.22, 0.08 + cleavageSeparation * 0.5, (i % 2) * 0.3);
        group.add(apop);
      }
    }
  }, [activeView, activeZone, bsa, nikolskyTested, cleavageSeparation]);

  const handleBsaSlider = (newBsa: number) => {
    setBsa(newBsa);
    onBsaChange?.(newBsa);
  };

  const getBsaCategory = () => {
    if (bsa < 10) {
      return {
        label: 'Stevens-Johnson Syndrome (SJS)',
        mortality: '1–5%',
        color: 'text-amber-400',
        desc: 'Epidermal detachment under 10% BSA. Multi-mucosal erosions (eyes, mouth, genitals) & flat atypical purpuric macules.',
      };
    } else if (bsa <= 30) {
      return {
        label: 'SJS - TEN Overlap Syndrome',
        mortality: '10–20%',
        color: 'text-rose-400',
        desc: 'Epidermal detachment between 10% and 30% BSA. Rapidly spreading confluence of flaccid detachment sheets.',
      };
    } else {
      return {
        label: 'Toxic Epidermal Necrolysis (TEN / Lyell Disease)',
        mortality: '25–35%',
        color: 'text-purple-400',
        desc: 'Epidermal detachment exceeding 30% BSA. High mortality due to massive transepidermal fluid loss, hypothermia & sepsis.',
      };
    }
  };

  const bsaInfo = getBsaCategory();

  // MOUSE & TOUCH ORBIT CONTROLS
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setIsAutoRotating(false);
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    modelRotationRef.current.y += deltaX * 0.008;
    modelRotationRef.current.x = Math.max(0.2, Math.min(1.4, modelRotationRef.current.x + deltaY * 0.008));
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const touchDistRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    if (e.touches.length === 2) {
      touchDistRef.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      return;
    }
    isDraggingRef.current = true;
    setIsAutoRotating(false);
    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistRef.current !== null) {
      const curDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = touchDistRef.current - curDist;
      handleZoom(diff * 0.005);
      touchDistRef.current = curDist;
      return;
    }
    if (!isDraggingRef.current || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

    modelRotationRef.current.y += deltaX * 0.008;
    modelRotationRef.current.x = Math.max(0.2, Math.min(1.4, modelRotationRef.current.x + deltaY * 0.008));
    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchDistRef.current = null;
  };

  const handleZoom = (delta: number) => {
    if (!targetCameraPosRef.current) return;
    targetCameraPosRef.current.z = Math.max(1.1, Math.min(3.2, targetCameraPosRef.current.z + delta));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY * 0.003);
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header View Switcher */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-100">
            Target Lesion & Epidermal Necrolysis 3D Explorer
          </h3>
        </div>
        
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs flex-wrap">
          <button
            onClick={() => {
              setActiveView('classic-target');
              setActiveZone('all');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
              activeView === 'classic-target' ? 'bg-rose-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Classic EM Target (Iris)
          </button>
          <button
            onClick={() => setActiveView('atypical-purpuric')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
              activeView === 'atypical-purpuric' ? 'bg-purple-700 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            SJS/TEN Purpuric Detachment
          </button>
          <button
            onClick={() => setActiveView('cross-section')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
              activeView === 'cross-section' ? 'bg-teal-700 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Histology Cross-Section
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount - Prominently Framed Macro Stage */}
      <div className="relative w-full h-84 sm:h-96 bg-slate-950">
        <div
          ref={mountRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        />

        {/* Floating Active Zone Description Pill */}
        <div className="absolute top-3 left-3 bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 shadow-xl text-xs space-y-0.5 pointer-events-none max-w-xs sm:max-w-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <strong className="text-white capitalize">
              {activeView === 'classic-target'
                ? activeZone === 'all' ? 'Concentric 3-Zone Target' : `Focused: Zone ${activeZone}`
                : activeView === 'atypical-purpuric' ? `Detachment Stage: ${bsa}% BSA` : 'Dermo-Epidermal Cleavage'}
            </strong>
          </div>
          <span className="text-[11px] text-teal-300 block font-medium">
            {activeView === 'classic-target' && activeZone === 'center' && '👉 Zone 1: Dusky necrotic center + vesicular dome'}
            {activeView === 'classic-target' && activeZone === 'mid' && '👉 Zone 2: Elevated pale edematous ring (papillary edema)'}
            {activeView === 'classic-target' && activeZone === 'outer' && '👉 Zone 3: Outer erythematous halo (hyperemia)'}
            {activeView === 'classic-target' && activeZone === 'all' && 'Concentric pathognomonic iris architecture'}
            {activeView === 'atypical-purpuric' && `Nikolsky Sign: ${nikolskyTested ? 'POSITIVE (epidermal shear)' : 'Untested'}`}
            {activeView === 'cross-section' && 'Subepithelial bulla cleavage splitting stratum basale'}
          </span>
        </div>

        {/* Zoom Level Quick Presets & Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs z-10 shadow-xl">
          <div className="flex items-center gap-1 border-r border-slate-800 pr-1.5 mr-0.5">
            <button
              onClick={() => setZoomPreset('normal')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                zoomPreset === 'normal' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setZoomPreset('macro')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                zoomPreset === 'macro' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              Macro 2x
            </button>
            <button
              onClick={() => setZoomPreset('ultra')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                zoomPreset === 'ultra' ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cellular 4x
            </button>
          </div>

          <button
            onClick={() => handleZoom(-0.25)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 text-slate-300 hover:text-white font-bold"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => handleZoom(0.25)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 text-slate-300 hover:text-white font-bold"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-2.5 h-7 rounded text-[11px] font-semibold border border-slate-700 ${
              isAutoRotating ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAutoRotating ? 'Pause' : 'Spin 3D'}
          </button>
        </div>

        {/* Concentric Zone Selector Pills (when viewing Classic Target) */}
        {activeView === 'classic-target' && (
          <div className="absolute top-16 left-3 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs z-10 shadow-lg flex-wrap">
            <span className="text-[11px] text-slate-400 px-1 font-mono">Highlight Zone:</span>
            <button
              onClick={() => setActiveZone('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                activeZone === 'all' ? 'bg-slate-800 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All 3 Zones
            </button>
            <button
              onClick={() => setActiveZone('center')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                activeZone === 'center' ? 'bg-rose-900 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Dusky Center
            </button>
            <button
              onClick={() => setActiveZone('mid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                activeZone === 'mid' ? 'bg-pink-800 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Pale Edematous
            </button>
            <button
              onClick={() => setActiveZone('outer')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                activeZone === 'outer' ? 'bg-red-800 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Red Halo
            </button>
          </div>
        )}
      </div>

      {/* Interactive Controls & Clinical Parameters */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-4 text-xs">
        {/* SJS / TEN Purpuric Detachment Interactive Station */}
        {activeView === 'atypical-purpuric' && (
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-bold text-white text-sm">
                  Body Surface Area (BSA) Detachment Severity Slider:
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Slide 25: Prognosis and categorization are defined strictly by percentage of detached epidermis.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base text-teal-400 font-bold bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  {bsa}% BSA Detached
                </span>
                <button
                  onClick={() => setNikolskyTested(!nikolskyTested)}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                    nikolskyTested
                      ? 'bg-rose-950 border-rose-500 text-rose-300'
                      : 'bg-teal-500 hover:bg-teal-400 text-slate-950 border-teal-400'
                  }`}
                >
                  {nikolskyTested ? 'Nikolsky Sign: Positive ✓' : 'Test Nikolsky Sign'}
                </button>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="65"
              value={bsa}
              onChange={(e) => handleBsaSlider(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>&lt; 10% BSA (SJS)</span>
              <span>10% – 30% BSA (SJS-TEN Overlap)</span>
              <span>&gt; 30% BSA (TEN / Lyell Disease)</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-slate-400">Clinical Category: </span>
                <strong className={`font-bold ${bsaInfo.color}`}>{bsaInfo.label}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Estimated Mortality: </span>
                <strong className="font-mono font-bold text-rose-400">{bsaInfo.mortality}</strong>
              </div>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{bsaInfo.desc}</p>
          </div>
        )}

        {/* Cross-Section Separation Controller */}
        {activeView === 'cross-section' && (
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">
                Subepidermal Cleavage Plane Separation:
              </span>
              <span className="font-mono text-xs text-teal-400 font-bold">
                {(cleavageSeparation * 100).toFixed(0)} μm Blister Cavity
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={cleavageSeparation}
              onChange={(e) => setCleavageSeparation(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Slide 25: Apoptosis is concentrated strictly in the <strong>epidermis</strong> with full-thickness necrosis, while the underlying dermis features a <strong>remarkably sparse infiltrate</strong>.
            </p>
          </div>
        )}

        {/* Detailed Clinical Landmark Information */}
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 text-slate-200 leading-relaxed text-xs space-y-1">
          {activeView === 'classic-target' && (
            <div>
              <span className="font-bold text-rose-300">Pathognomonic 3-Zone EM Target (Slide 21): </span>
              {activeZone === 'center' &&
                'Zone 1: Central dark dusky, violaceous, or necrotic core often topped with a small epidermal bulla/vesicle.'}
              {activeZone === 'mid' &&
                'Zone 2: Intermediate pale edematous ring elevated above the skin surface due to localized papillary dermal edema.'}
              {activeZone === 'outer' &&
                'Zone 3: Peripheral vibrant red erythematous margin reflecting intense vasodilatation.'}
              {activeZone === 'all' &&
                'Concentric 3-zone architecture: 1) Central dusky/necrotic bulla, 2) Middle pale edematous ring, 3) Outer erythematous halo. Begins symmetrically on hands, wrists, and forearms and spreads centripetally. Hemorrhagic crusting on lips.'}
            </div>
          )}
          {activeView === 'atypical-purpuric' && (
            <div>
              <span className="font-bold text-purple-300">SJS/TEN Atypical Targets (Slide 25): </span>
              Flat, irregular, coalescing purpuric macules that arise primarily on the <strong>CHEST and trunk</strong> (unlike EM which favors acral extremities). Keratinocyte necrosis causes sheet-like detachment with positive Nikolsky sign.
            </div>
          )}
          {activeView === 'cross-section' && (
            <div>
              <span className="font-bold text-teal-300">Histopathological Cleavage Plane (Slide 25): </span>
              Drug metabolites bind HLA molecules on keratinocytes; cytotoxic T-cells release Granulysin and FasL, triggering confluent apoptotic epidermal necrosis that shears cleanly off the intact dermis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
