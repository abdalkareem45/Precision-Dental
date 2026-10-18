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
  Info,
  ShieldAlert,
  Layers,
  ChevronRight
} from 'lucide-react';

export type TrigeminalDivision = 'v1' | 'v2' | 'v3' | 'all';

interface TrigeminalHead3DProps {
  selectedDivision: TrigeminalDivision;
  onSelectDivision: (division: TrigeminalDivision) => void;
  height?: number;
}

export const TrigeminalHead3D: React.FC<TrigeminalHead3DProps> = ({
  selectedDivision,
  onSelectDivision,
  height = 420,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [nerveImpulseActive, setNerveImpulseActive] = useState<boolean>(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Mesh refs for dermatomal segments
  const v1MeshRef = useRef<THREE.Mesh | null>(null);
  const v2MeshRef = useRef<THREE.Mesh | null>(null);
  const v3MeshRef = useRef<THREE.Mesh | null>(null);
  const ganglionMeshRef = useRef<THREE.Mesh | null>(null);
  const nervePathsGroupRef = useRef<THREE.Group | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const canvasHeight = height;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // Dark navy
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 100);
    camera.position.set(2.4, 0.4, 4.4);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf59e0b, 2.5); // Amber light
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.8); // Sky blue
    dirLight2.position.set(-5, -3, -4);
    scene.add(dirLight2);

    // 5. Main Craniofacial Head Group
    const headGroup = new THREE.Group();
    scene.add(headGroup);
    headGroupRef.current = headGroup;

    // --- CRANIOFACIAL BASE HEAD SCULPTURE ---
    // A. Cranial Vault (Braincase/Occiput/Parietal)
    const craniumGeo = new THREE.SphereGeometry(1.2, 32, 24);
    const craniumMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.1,
      transparent: true,
      opacity: 0.5,
    });
    const craniumMesh = new THREE.Mesh(craniumGeo, craniumMat);
    craniumMesh.position.set(-0.25, 0.35, -0.2);
    headGroup.add(craniumMesh);

    // --- DERMATOMAL DIVISIONS ---

    // 1. V1 OPHTHALMIC DIVISION (Forehead, Upper Eyelid, Nose Bridge)
    const v1Geo = new THREE.SphereGeometry(1.18, 32, 16, 0, Math.PI * 0.95, 0, Math.PI * 0.38);
    const v1Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Emerald Green
      emissive: 0x059669,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.75,
    });
    const v1Mesh = new THREE.Mesh(v1Geo, v1Mat);
    v1Mesh.position.set(0, 0.3, 0);
    v1Mesh.rotation.y = -Math.PI * 0.2;
    v1MeshRef.current = v1Mesh;
    headGroup.add(v1Mesh);

    // V1 Nose bridge & upper orbital rim feature
    const v1NoseGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.55, 12);
    const v1Nose = new THREE.Mesh(v1NoseGeo, v1Mat);
    v1Nose.position.set(0.9, 0.35, 0.35);
    v1Nose.rotation.z = -0.3;
    headGroup.add(v1Nose);

    // 2. V2 MAXILLARY DIVISION (Cheek, Midface, Upper Lip, Maxilla)
    const v2Geo = new THREE.SphereGeometry(1.15, 32, 16, 0, Math.PI * 0.95, Math.PI * 0.38, Math.PI * 0.28);
    const v2Mat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber Gold
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.82,
    });
    const v2Mesh = new THREE.Mesh(v2Geo, v2Mat);
    v2Mesh.position.set(0, 0.3, 0);
    v2Mesh.rotation.y = -Math.PI * 0.2;
    v2MeshRef.current = v2Mesh;
    headGroup.add(v2Mesh);

    // V2 Zygoma cheek prominence
    const v2CheekGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const v2Cheek = new THREE.Mesh(v2CheekGeo, v2Mat);
    v2Cheek.position.set(0.75, 0.05, 0.65);
    headGroup.add(v2Cheek);

    // 3. V3 MANDIBULAR DIVISION (Lower Jaw, Mandible, Chin, Lower Lip)
    const v3Geo = new THREE.SphereGeometry(1.12, 32, 16, 0, Math.PI * 0.95, Math.PI * 0.66, Math.PI * 0.34);
    const v3Mat = new THREE.MeshStandardMaterial({
      color: 0x6366f1, // Indigo Blue
      emissive: 0x4f46e5,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.75,
    });
    const v3Mesh = new THREE.Mesh(v3Geo, v3Mat);
    v3Mesh.position.set(0, 0.3, 0);
    v3Mesh.rotation.y = -Math.PI * 0.2;
    v3MeshRef.current = v3Mesh;
    headGroup.add(v3Mesh);

    // Mandibular chin prominence
    const v3ChinGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
    const v3Chin = new THREE.Mesh(v3ChinGeo, v3Mat);
    v3Chin.position.set(0.65, -0.65, 0.5);
    v3Chin.rotation.y = 0.4;
    headGroup.add(v3Chin);

    // --- TRIGEMINAL (GASSERIAN) GANGLION (Anatomical Origin) ---
    const ganglionGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const ganglionMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e, // Glowing Rose Red
      emissive: 0xe11d48,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const ganglionMesh = new THREE.Mesh(ganglionGeo, ganglionMat);
    ganglionMesh.position.set(-0.15, 0.1, 0.1);
    ganglionMeshRef.current = ganglionMesh;
    headGroup.add(ganglionMesh);

    // --- CRANIAL NERVE BRANCH TRAJECTORIES ---
    const nervePathsGroup = new THREE.Group();
    nervePathsGroupRef.current = nervePathsGroup;
    headGroup.add(nervePathsGroup);

    // Branch 1: Trigeminal Ganglion to V1 (Orbit/Forehead)
    const v1Path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, 0.1, 0.1),
      new THREE.Vector3(0.25, 0.35, 0.45),
      new THREE.Vector3(0.7, 0.75, 0.55),
      new THREE.Vector3(0.85, 1.1, 0.35),
    ]);
    const v1TubeGeo = new THREE.TubeGeometry(v1Path, 32, 0.035, 8, false);
    const v1TubeMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 0.7,
    });
    const v1Tube = new THREE.Mesh(v1TubeGeo, v1TubeMat);
    nervePathsGroup.add(v1Tube);

    // Branch 2: Trigeminal Ganglion to V2 (Foramen Rotundum -> Maxilla & Palate)
    const v2Path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, 0.1, 0.1),
      new THREE.Vector3(0.28, 0.12, 0.48),
      new THREE.Vector3(0.65, 0.08, 0.65),
      new THREE.Vector3(0.88, -0.05, 0.55),
    ]);
    const v2TubeGeo = new THREE.TubeGeometry(v2Path, 32, 0.038, 8, false);
    const v2TubeMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
    });
    const v2Tube = new THREE.Mesh(v2TubeGeo, v2TubeMat);
    nervePathsGroup.add(v2Tube);

    // Branch 3: Trigeminal Ganglion to V3 (Foramen Ovale -> Mandible & Chin)
    const v3Path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, 0.1, 0.1),
      new THREE.Vector3(0.2, -0.15, 0.4),
      new THREE.Vector3(0.55, -0.45, 0.55),
      new THREE.Vector3(0.75, -0.65, 0.45),
    ]);
    const v3TubeGeo = new THREE.TubeGeometry(v3Path, 32, 0.035, 8, false);
    const v3TubeMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x6366f1,
      emissiveIntensity: 0.7,
    });
    const v3Tube = new THREE.Mesh(v3TubeGeo, v3TubeMat);
    nervePathsGroup.add(v3Tube);

    // 6. Neural Action Potential Spark Particles
    const sparkCount = 80;
    const sparkPositions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = (Math.random() - 0.5) * 1.5;
      sparkPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    headGroup.add(sparkPoints);

    // Default angle facing 3/4 anterolateral profile
    headGroup.rotation.y = 0.45;

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotating && !isDraggingRef.current) {
        headGroup.rotation.y += 0.005;
      }

      // Ganglion breathing pulse
      if (ganglionMeshRef.current) {
        const pulse = 1 + Math.sin(elapsed * 4) * 0.12;
        ganglionMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !headGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      headGroupRef.current.rotation.y += deltaX * 0.008;
      headGroupRef.current.rotation.x += deltaY * 0.008;

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
        cameraRef.current.position.z = Math.max(2.6, Math.min(7.0, cameraRef.current.position.z + diff * 0.01));
        touchDist = curDist;
        return;
      }
      if (!isDraggingRef.current || !headGroupRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      headGroupRef.current.rotation.y += deltaX * 0.008;
      headGroupRef.current.rotation.x += deltaY * 0.008;

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
      cameraRef.current.position.z = Math.max(2.6, Math.min(7.0, newZ));
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

  // Handle Division Highlighting Shader Updates
  useEffect(() => {
    const v1 = v1MeshRef.current;
    const v2 = v2MeshRef.current;
    const v3 = v3MeshRef.current;
    if (!v1 || !v2 || !v3) return;

    const v1Mat = v1.material as THREE.MeshStandardMaterial;
    const v2Mat = v2.material as THREE.MeshStandardMaterial;
    const v3Mat = v3.material as THREE.MeshStandardMaterial;

    if (selectedDivision === 'all') {
      v1Mat.opacity = 0.75;
      v1Mat.emissiveIntensity = 0.35;
      v2Mat.opacity = 0.75;
      v2Mat.emissiveIntensity = 0.35;
      v3Mat.opacity = 0.75;
      v3Mat.emissiveIntensity = 0.35;
    } else if (selectedDivision === 'v1') {
      v1Mat.opacity = 0.95;
      v1Mat.emissiveIntensity = 0.85;
      v2Mat.opacity = 0.25;
      v2Mat.emissiveIntensity = 0.1;
      v3Mat.opacity = 0.25;
      v3Mat.emissiveIntensity = 0.1;
    } else if (selectedDivision === 'v2') {
      v1Mat.opacity = 0.25;
      v1Mat.emissiveIntensity = 0.1;
      v2Mat.opacity = 0.95;
      v2Mat.emissiveIntensity = 0.9;
      v3Mat.opacity = 0.25;
      v3Mat.emissiveIntensity = 0.1;
    } else if (selectedDivision === 'v3') {
      v1Mat.opacity = 0.25;
      v1Mat.emissiveIntensity = 0.1;
      v2Mat.opacity = 0.25;
      v2Mat.emissiveIntensity = 0.1;
      v3Mat.opacity = 0.95;
      v3Mat.emissiveIntensity = 0.85;
    }
  }, [selectedDivision]);

  const handleZoom = (dir: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = dir === 'in' ? -0.7 : 0.7;
    cameraRef.current.position.z = Math.max(2.6, Math.min(7.0, cameraRef.current.position.z + delta));
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !headGroupRef.current) return;
    cameraRef.current.position.set(2.4, 0.4, 4.4);
    headGroupRef.current.rotation.set(0, 0.45, 0);
  };

  return (
    <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col select-none">
      {/* 3D Viewer Header Controls */}
      <div className="p-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">
            3D Craniofacial Trigeminal (CN V) Dermatomal Head
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
            Slides 26–27 Specimen
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

      {/* 3D Canvas Mounting Area */}
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Anatomical Origin Callout */}
        <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-mono text-slate-200 pointer-events-none z-10 space-y-0.5">
          <div className="text-rose-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Trigeminal (Gasserian) Ganglion</span>
          </div>
          <span className="text-[10px] text-slate-400">Meckel's Cave / Skull Base Origin</span>
        </div>

        {/* Live Active Division Banner */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-mono text-slate-200 pointer-events-none z-10">
          <div className="text-white font-bold text-xs flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            {selectedDivision === 'v1' && 'V1 OPHTHALMIC: Forehead, Scalp, Orbit & Cornea (Keratitis Risk!)'}
            {selectedDivision === 'v2' && 'V2 MAXILLARY: Cheek, Midface & Unilateral Hard Palatal Midline Cutoff!'}
            {selectedDivision === 'v3' && 'V3 MANDIBULAR: Lower Jaw, Chin, Lower Lip & Mandibular Gingiva'}
            {selectedDivision === 'all' && 'ALL DIVISIONS: Craniofacial Sensory Triad Active'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            🖱️ Drag to rotate 3D head · Select divisions below to isolate nerve path
          </div>
        </div>
      </div>

      {/* Interactive Division Selector Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20">
        <span className="text-xs font-mono text-slate-400 font-semibold">Isolate Dermatome:</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'v1' as const, label: 'V1: Ophthalmic Division', color: 'bg-emerald-950 border-emerald-500 text-emerald-200' },
            { id: 'v2' as const, label: 'V2: Maxillary Division (Palatal Cutoff)', color: 'bg-amber-950 border-amber-500 text-amber-200' },
            { id: 'v3' as const, label: 'V3: Mandibular Division', color: 'bg-indigo-950 border-indigo-500 text-indigo-200' },
            { id: 'all' as const, label: 'Show All (V1+V2+V3)', color: 'bg-slate-800 border-slate-600 text-white' },
          ].map((div) => {
            const isSelected = selectedDivision === div.id;
            return (
              <button
                key={div.id}
                onClick={() => onSelectDivision(div.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isSelected
                    ? `${div.color} shadow-lg ring-1 ring-white/20 font-extrabold scale-105`
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
                }`}
              >
                {div.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
