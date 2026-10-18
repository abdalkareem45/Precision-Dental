import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Activity,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Brain,
  HeartPulse
} from 'lucide-react';

interface RamsayReye3DProps {
  viewMode: 'ramsay-hunt' | 'reye-syndrome';
  activeSubItem?: number; // 1: Bell Palsy, 2: Ear Vesicles, 3: Taste Loss for Ramsay; 1: Liver, 2: Brain for Reye
  onSelectSubItem?: (item: number) => void;
  height?: number;
}

export const RamsayReye3D: React.FC<RamsayReye3DProps> = ({
  viewMode,
  activeSubItem = 1,
  onSelectSubItem,
  height = 360,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 480;
    const canvasHeight = height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 100);
    camera.position.set(0, 0, 4.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(viewMode === 'ramsay-hunt' ? 0xf59e0b : 0xf43f5e, 3.0);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-4, -3, -4);
    scene.add(rimLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    if (viewMode === 'ramsay-hunt') {
      // --- RAMSAY HUNT SYNDROME: CRANIAL NERVE VII & GENICULATE GANGLION ---
      // 1. Skull Base / Temporal Bone Matrix
      const boneGeo = new THREE.SphereGeometry(1.2, 24, 24);
      const boneMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        transparent: true,
        opacity: 0.45,
        roughness: 0.5,
      });
      const boneMesh = new THREE.Mesh(boneGeo, boneMat);
      boneMesh.position.set(-0.3, 0, -0.2);
      mainGroup.add(boneMesh);

      // 2. Geniculate Ganglion (CN VII Knee)
      const ganglionGeo = new THREE.SphereGeometry(0.24, 16, 16);
      const ganglionMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.9,
      });
      const ganglionMesh = new THREE.Mesh(ganglionGeo, ganglionMat);
      ganglionMesh.position.set(-0.2, 0.3, 0.1);
      mainGroup.add(ganglionMesh);

      // 3. Branch 1: Motor Facial Nerve Trunk to Facial Muscles (Bell Palsy)
      const motorPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.2, 0.3, 0.1),
        new THREE.Vector3(0.2, 0.1, 0.3),
        new THREE.Vector3(0.65, -0.2, 0.5),
        new THREE.Vector3(0.9, -0.5, 0.4),
      ]);
      const motorTube = new THREE.Mesh(
        new THREE.TubeGeometry(motorPath, 24, 0.04, 8, false),
        new THREE.MeshStandardMaterial({
          color: activeSubItem === 1 ? 0xf59e0b : 0x64748b,
          emissive: activeSubItem === 1 ? 0xd97706 : 0x000000,
          emissiveIntensity: 0.8,
        })
      );
      mainGroup.add(motorTube);

      // Drooping mouth / facial muscle node
      const faceNode = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.6 })
      );
      faceNode.position.set(0.9, -0.5, 0.4);
      mainGroup.add(faceNode);

      // 4. Branch 2: Sensory Auricular Branch to External Ear Canal (Ear Vesicles)
      const earPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.2, 0.3, 0.1),
        new THREE.Vector3(-0.6, 0.45, 0.2),
        new THREE.Vector3(-0.95, 0.6, 0.3),
      ]);
      const earTube = new THREE.Mesh(
        new THREE.TubeGeometry(earPath, 20, 0.035, 8, false),
        new THREE.MeshStandardMaterial({
          color: activeSubItem === 2 ? 0xf43f5e : 0x64748b,
          emissive: activeSubItem === 2 ? 0xe11d48 : 0x000000,
          emissiveIntensity: 0.8,
        })
      );
      mainGroup.add(earTube);

      // Auricle Ear Shell & Vesicles
      const earNode = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.06, 8, 16, Math.PI * 1.5),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xbe123c, emissiveIntensity: 0.7 })
      );
      earNode.position.set(-0.95, 0.6, 0.3);
      mainGroup.add(earNode);

      // 5. Branch 3: Chorda Tympani to Lingual Nerve (Taste Loss Anterior 2/3)
      const chordaPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.2, 0.3, 0.1),
        new THREE.Vector3(0.1, -0.1, 0.2),
        new THREE.Vector3(0.4, -0.4, 0.3),
        new THREE.Vector3(0.7, -0.6, 0.1),
      ]);
      const chordaTube = new THREE.Mesh(
        new THREE.TubeGeometry(chordaPath, 20, 0.032, 8, false),
        new THREE.MeshStandardMaterial({
          color: activeSubItem === 3 ? 0x10b981 : 0x64748b,
          emissive: activeSubItem === 3 ? 0x059669 : 0x000000,
          emissiveIntensity: 0.8,
        })
      );
      mainGroup.add(chordaTube);

      // Tongue anterior node
      const tongueNode = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.1, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x047857, emissiveIntensity: 0.6 })
      );
      tongueNode.position.set(0.7, -0.6, 0.1);
      mainGroup.add(tongueNode);

    } else {
      // --- REYE SYNDROME: DUAL-ORGAN HEPATIC STEATOSIS & CEREBRAL EDEMA ---
      // 1. Liver Organ (Left Side of View)
      const liverGeo = new THREE.SphereGeometry(0.85, 24, 24);
      liverGeo.scale(1.2, 0.8, 0.7);
      const liverMat = new THREE.MeshStandardMaterial({
        color: 0x881337,
        emissive: 0xbe123c,
        emissiveIntensity: activeSubItem === 1 ? 0.7 : 0.2,
        roughness: 0.4,
      });
      const liverMesh = new THREE.Mesh(liverGeo, liverMat);
      liverMesh.position.set(-1.1, 0, 0);
      mainGroup.add(liverMesh);

      // Microvesicular fatty droplets on liver surface
      for (let i = 0; i < 28; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 0.75;
        const droplet = new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xeab308, emissiveIntensity: 0.8 })
        );
        droplet.position.set(
          -1.1 + r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.7,
          r * Math.cos(phi) * 0.6
        );
        mainGroup.add(droplet);
      }

      // 2. Brain Organ with Cerebral Edema (Right Side of View)
      const brainGeo = new THREE.SphereGeometry(0.9, 24, 24);
      brainGeo.scale(0.9, 1.1, 1.0);
      const brainMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        emissive: activeSubItem === 2 ? 0xf43f5e : 0x334155,
        emissiveIntensity: activeSubItem === 2 ? 0.8 : 0.2,
        roughness: 0.6,
      });
      const brainMesh = new THREE.Mesh(brainGeo, brainMat);
      brainMesh.position.set(1.1, 0, 0);
      mainGroup.add(brainMesh);

      // Edema swelling halo around brain
      const edemaHalo = new THREE.Mesh(
        new THREE.SphereGeometry(1.05, 20, 20),
        new THREE.MeshBasicMaterial({
          color: 0xf43f5e,
          wireframe: true,
          transparent: true,
          opacity: activeSubItem === 2 ? 0.4 : 0.1,
        })
      );
      edemaHalo.position.set(1.1, 0, 0);
      mainGroup.add(edemaHalo);
    }

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (isRotating && !isDraggingRef.current) {
        mainGroup.rotation.y += 0.006;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !mainGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      mainGroupRef.current.rotation.y += deltaX * 0.008;
      mainGroupRef.current.rotation.x += deltaY * 0.008;
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
        cameraRef.current.position.z = Math.max(2.6, Math.min(6.5, cameraRef.current.position.z + diff * 0.01));
        touchDist = curDist;
        return;
      }
      if (!isDraggingRef.current || !mainGroupRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      mainGroupRef.current.rotation.y += deltaX * 0.008;
      mainGroupRef.current.rotation.x += deltaY * 0.008;

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
      cameraRef.current.position.z = Math.max(2.6, Math.min(6.5, newZ));
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
  }, [viewMode, activeSubItem, height]);

  const handleZoom = (dir: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = dir === 'in' ? -0.6 : 0.6;
    cameraRef.current.position.z = Math.max(2.6, Math.min(6.5, cameraRef.current.position.z + delta));
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !mainGroupRef.current) return;
    cameraRef.current.position.set(0, 0, 4.2);
    mainGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col select-none">
      {/* 3D Header Bar */}
      <div className="p-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${viewMode === 'ramsay-hunt' ? 'bg-amber-400' : 'bg-rose-500'}`} />
          <span className="text-xs font-bold text-white tracking-wide">
            {viewMode === 'ramsay-hunt' ? '3D Cranial Nerve VII & Ramsay Hunt Triad' : '3D Dual-Organ Reye Syndrome Pathology'}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {viewMode === 'ramsay-hunt' ? 'Slide 28' : 'Slide 30'}
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

        {/* Dynamic Overlay HUD */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono text-slate-200 pointer-events-none z-10">
          {viewMode === 'ramsay-hunt' ? (
            <div>
              <div className="text-amber-300 font-bold">
                {activeSubItem === 1 && '1. Bell Palsy: Facial Motor Branch Paralyzed'}
                {activeSubItem === 2 && '2. Ear Canal: Sensory Auricular Vesicles'}
                {activeSubItem === 3 && '3. Tongue: Chorda Tympani Gustatory Ageusia'}
              </div>
              <span className="text-[10px] text-slate-400">Geniculate Ganglion VZV Reactivation</span>
            </div>
          ) : (
            <div>
              <div className="text-rose-300 font-bold">
                {activeSubItem === 1 ? '1. Liver: Microvesicular Steatosis & Failure' : '2. Brain: Cerebral Edema & Herniation'}
              </div>
              <span className="text-[10px] text-slate-400">Pediatric Aspirin Hepatocerebral Breakdown</span>
            </div>
          )}
        </div>
      </div>

      {/* Triad / Organ Sub-selector Tabs */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1.5 z-20">
        <span className="text-[11px] font-mono text-slate-400">Isolate 3D Node:</span>
        <div className="flex gap-1 text-xs">
          {viewMode === 'ramsay-hunt' ? (
            [
              { id: 1, label: 'Bell Palsy' },
              { id: 2, label: 'Ear Vesicles' },
              { id: 3, label: 'Ageusia (Taste)' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectSubItem && onSelectSubItem(item.id)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all text-xs ${
                  activeSubItem === item.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))
          ) : (
            [
              { id: 1, label: 'Microvesicular Liver' },
              { id: 2, label: 'Cerebral Edema Brain' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectSubItem && onSelectSubItem(item.id)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all text-xs ${
                  activeSubItem === item.id
                    ? 'bg-rose-500 text-slate-950 border-rose-400 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
