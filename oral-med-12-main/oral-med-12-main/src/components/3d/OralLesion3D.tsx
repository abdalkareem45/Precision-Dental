import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Activity,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export type ClinicalPresentationType = 'primary' | 'rih' | 'immunocompromised';

interface OralLesion3DProps {
  mode: ClinicalPresentationType;
  onSelectMode?: (m: ClinicalPresentationType) => void;
  height?: number;
}

export const OralLesion3D: React.FC<OralLesion3DProps> = ({
  mode,
  onSelectMode,
  height = 380,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const archGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lesionsGroupRef = useRef<THREE.Group | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const canvasHeight = height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 100);
    camera.position.set(0, 2.2, 3.8);
    camera.lookAt(0, -0.2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainLight.position.set(3, 5, 4);
    scene.add(mainLight);

    const warmLight = new THREE.DirectionalLight(0xf43f5e, 1.8);
    warmLight.position.set(-3, -2, 2);
    scene.add(warmLight);

    // Main Arch Group
    const archGroup = new THREE.Group();
    scene.add(archGroup);
    archGroupRef.current = archGroup;

    // --- 1. HARD PALATE (KERATINIZED VAULT) ---
    const palateGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.25, 32, 1, false, 0, Math.PI);
    const palateMat = new THREE.MeshStandardMaterial({
      color: 0x4c0519, // Deep mucosa red
      roughness: 0.4,
      metalness: 0.1,
    });
    const palateMesh = new THREE.Mesh(palateGeo, palateMat);
    palateMesh.rotation.x = Math.PI * 0.15;
    palateMesh.position.set(0, 0, -0.3);
    archGroup.add(palateMesh);

    // Palatal raphe median ridge
    const rapheGeo = new THREE.BoxGeometry(0.06, 0.08, 1.3);
    const rapheMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.3 });
    const rapheMesh = new THREE.Mesh(rapheGeo, rapheMat);
    rapheMesh.position.set(0, 0.12, -0.25);
    rapheMesh.rotation.x = Math.PI * 0.15;
    archGroup.add(rapheMesh);

    // --- 2. DENTAL ARCH & TEETH ---
    const teethCount = 14;
    const archRadius = 1.35;
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / (teethCount - 1)) * Math.PI;
      const tx = Math.cos(angle) * archRadius;
      const tz = Math.sin(angle) * (archRadius * 0.7) - 0.7;

      // Crown
      const toothGeo = new THREE.BoxGeometry(0.18, 0.28, 0.18);
      const toothMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.15,
        metalness: 0.05,
      });
      const toothMesh = new THREE.Mesh(toothGeo, toothMat);
      toothMesh.position.set(tx, 0.08, tz);
      toothMesh.rotation.y = -angle + Math.PI / 2;
      archGroup.add(toothMesh);

      // Attached Gingiva collar
      const gingivaGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.12, 12);
      const gingivaMat = new THREE.MeshStandardMaterial({
        color: 0x9f1239,
        roughness: 0.5,
      });
      const gingivaMesh = new THREE.Mesh(gingivaGeo, gingivaMat);
      gingivaMesh.position.set(tx, -0.05, tz);
      archGroup.add(gingivaMesh);
    }

    // --- 3. LABIAL & BUCCAL MUCOSA (NON-KERATINIZED PERIPHERY) ---
    const buccalGeo = new THREE.TorusGeometry(1.65, 0.35, 16, 32, Math.PI);
    const buccalMat = new THREE.MeshStandardMaterial({
      color: 0x881337,
      roughness: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const buccalMesh = new THREE.Mesh(buccalGeo, buccalMat);
    buccalMesh.rotation.x = Math.PI * 0.6;
    buccalMesh.position.set(0, -0.25, -0.2);
    archGroup.add(buccalMesh);

    // Group for dynamic clinical lesions
    const lesionsGroup = new THREE.Group();
    lesionsGroupRef.current = lesionsGroup;
    archGroup.add(lesionsGroup);

    // Animation Loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (isRotating && !isDraggingRef.current) {
        archGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Mouse Listeners
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !archGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      archGroupRef.current.rotation.y += deltaX * 0.008;
      archGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    let touchDist: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        return;
      }
      if (e.touches.length === 0) return;
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchDist !== null && cameraRef.current) {
        const curDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = touchDist - curDist;
        cameraRef.current.position.z = Math.max(2.4, Math.min(6.5, cameraRef.current.position.z + diff * 0.01));
        touchDist = curDist;
        return;
      }
      if (!isDraggingRef.current || !archGroupRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      archGroupRef.current.rotation.y += deltaX * 0.008;
      archGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      touchDist = null;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = cameraRef.current.position.z + e.deltaY * 0.005;
      cameraRef.current.position.z = Math.max(2.4, Math.min(6.5, newZ));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      cameraRef.current.aspect = newWidth / canvasHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, canvasHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [height]);

  // Update 3D Lesions according to Mode
  useEffect(() => {
    if (!lesionsGroupRef.current) return;
    const group = lesionsGroupRef.current;
    group.clear();

    const ulcerMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a, // Yellow fibrin slough
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });

    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Inflammatory red rim
      emissive: 0xb91c1c,
      emissiveIntensity: 0.8,
    });

    if (mode === 'primary') {
      // PRIMARY GINGIVOSTOMATITIS (Slides 10–12):
      // Widespread lesions across BOTH keratinized palate/gingiva AND non-keratinized buccal mucosa!
      // 1. Fiery erythematous marginal gingivitis along entire dental arch
      for (let i = 0; i < 14; i++) {
        const angle = (i / 13) * Math.PI;
        const tx = Math.cos(angle) * 1.35;
        const tz = Math.sin(angle) * (1.35 * 0.7) - 0.7;

        const collar = new THREE.Mesh(
          new THREE.TorusGeometry(0.12, 0.04, 8, 16),
          new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.9 })
        );
        collar.rotation.x = Math.PI / 2;
        collar.position.set(tx, 0.04, tz);
        group.add(collar);
      }

      // 2. Multiple scattered ulcers on Palate (Keratinized)
      const palateCoords = [
        [-0.4, 0.12, -0.4], [0.35, 0.13, -0.5], [-0.2, 0.14, -0.7],
        [0.2, 0.12, -0.2], [-0.5, 0.11, -0.2], [0.45, 0.13, -0.3]
      ];
      palateCoords.forEach(([x, y, z]) => {
        const uMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.04, 12), ulcerMat);
        uMesh.position.set(x, y, z);
        const hMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.02, 12), haloMat);
        hMesh.position.set(x, y - 0.01, z);
        group.add(hMesh);
        group.add(uMesh);
      });

      // 3. Scattered ulcers on Buccal/Labial Mucosa (Non-Keratinized)
      const buccalCoords = [
        [-1.2, -0.15, 0.1], [1.1, -0.16, 0.15], [-0.8, -0.2, 0.45],
        [0.7, -0.19, 0.4], [0.0, -0.22, 0.55]
      ];
      buccalCoords.forEach(([x, y, z]) => {
        const uMesh = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), ulcerMat);
        uMesh.position.set(x, y, z);
        const hMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), haloMat);
        hMesh.position.set(x, y, z);
        group.add(hMesh);
        group.add(uMesh);
      });
    } else if (mode === 'rih') {
      // RECURRENT INTRAORAL HERPES (RIH) (Slide 14):
      // STRICTLY KERATINIZED MUCOSA (Hard Palate & Attached Gingiva). ZERO lesions on buccal/labial!
      // Tight cluster of 1-5 mm punctate ulcers on lateral hard palate:
      const clusterCenter = { x: 0.45, y: 0.14, z: -0.4 };
      for (let i = 0; i < 9; i++) {
        const ox = (Math.random() - 0.5) * 0.28;
        const oz = (Math.random() - 0.5) * 0.28;
        const px = clusterCenter.x + ox;
        const pz = clusterCenter.z + oz;

        const uMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.03, 10), ulcerMat);
        uMesh.position.set(px, clusterCenter.y, pz);
        const hMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.015, 10), haloMat);
        hMesh.position.set(px, clusterCenter.y - 0.01, pz);
        group.add(hMesh);
        group.add(uMesh);
      }

      // Second smaller cluster on attached maxillary gingiva:
      const gingivaCluster = [
        [-0.95, 0.05, -0.2], [-0.98, 0.04, -0.12], [-1.02, 0.05, -0.25]
      ];
      gingivaCluster.forEach(([gx, gy, gz]) => {
        const uMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), ulcerMat);
        uMesh.position.set(gx, gy, gz);
        group.add(uMesh);
      });
    } else if (mode === 'immunocompromised') {
      // HSV IN IMMUNOCOMPROMISED HOST (Slide 15):
      // Massive, several-centimeter wide deep ragged ulcer at ANY site with satellite vesicles!
      // Large crater on hard and soft palate junction:
      const largeCraterGeo = new THREE.CylinderGeometry(0.38, 0.45, 0.08, 20);
      const largeCraterMat = new THREE.MeshStandardMaterial({
        color: 0xfef3c7,
        emissive: 0xb45309,
        emissiveIntensity: 0.5,
        roughness: 0.7,
      });
      const largeCrater = new THREE.Mesh(largeCraterGeo, largeCraterMat);
      largeCrater.position.set(-0.25, 0.12, -0.45);
      group.add(largeCrater);

      const largeRimGeo = new THREE.TorusGeometry(0.44, 0.08, 12, 24);
      const largeRim = new THREE.Mesh(largeRimGeo, haloMat);
      largeRim.rotation.x = Math.PI / 2;
      largeRim.position.set(-0.25, 0.14, -0.45);
      group.add(largeRim);

      // Diagnostic Satellite Vesicles (1-2 mm) along border (Slide 15 diagnostic hallmark!)
      for (let i = 0; i < 7; i++) {
        const theta = (i / 7) * Math.PI * 2;
        const sx = -0.25 + Math.cos(theta) * 0.58;
        const sz = -0.45 + Math.sin(theta) * 0.58;
        const satMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 })
        );
        satMesh.position.set(sx, 0.15, sz);
        group.add(satMesh);
      }
    }
  }, [mode]);

  const handleZoom = (dir: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = dir === 'in' ? -0.6 : 0.6;
    cameraRef.current.position.z = Math.max(2.4, Math.min(6.5, cameraRef.current.position.z + delta));
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !archGroupRef.current) return;
    cameraRef.current.position.set(0, 2.2, 3.8);
    cameraRef.current.lookAt(0, -0.2, 0);
    archGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col select-none">
      {/* 3D Header Controls */}
      <div className="p-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">
            3D Oral Lesion Architecture & Tissue Predilection
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
            {mode === 'primary' && 'Primary Gingivostomatitis (Slides 10–12)'}
            {mode === 'rih' && 'Recrudescent Intraoral Herpes (Slide 14)'}
            {mode === 'immunocompromised' && 'Immunocompromised Ulcers (Slide 15)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Reset Angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Callout Banner */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-mono text-slate-200 pointer-events-none z-10 space-y-0.5">
          <div className="text-white font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-400" />
            {mode === 'primary' && 'PRIMARY: Widespread on BOTH Keratinized & Non-Keratinized Mucosa'}
            {mode === 'rih' && 'RIH: Confined Strictly to KERATINIZED Mucosa (Hard Palate & Gingiva)'}
            {mode === 'immunocompromised' && 'IMMUNOCOMPROMISED: Huge Ulcers with Satellite Vesicles (Any Site)'}
          </div>
          <div className="text-[10px] text-slate-400">
            🖱️ Drag to orbit 3D model · Scroll to inspect palatal vault
          </div>
        </div>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20">
        <span className="text-xs font-mono text-slate-400 font-semibold">Select Presentation Mode:</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'primary' as const, label: '1. Primary Gingivostomatitis', color: 'bg-blue-950 border-blue-500 text-blue-200' },
            { id: 'rih' as const, label: '2. Recrudescent Intraoral (RIH)', color: 'bg-amber-950 border-amber-500 text-amber-200' },
            { id: 'immunocompromised' as const, label: '3. Immunocompromised Host', color: 'bg-rose-950 border-rose-500 text-rose-200' },
          ].map((item) => {
            const isSelected = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMode && onSelectMode(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isSelected
                    ? `${item.color} shadow-lg ring-1 ring-white/20 font-extrabold scale-105`
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
