import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BoneDefect3DType } from './types';
import {
  RotateCcw,
  Layers,
  Sparkles,
  Maximize2,
  Info,
  Compass,
  Check,
  ShieldAlert,
  Scissors,
  Eye,
  Sliders,
  Move
} from 'lucide-react';

interface BoneLoss3DCanvasProps {
  defectType: BoneDefect3DType;
  showControls?: boolean;
  onSelectLandmark?: (landmarkName: string) => void;
  height?: string;
  isSplitView?: boolean;
  highlightWalls?: boolean;
  customDepth?: number;
  interactiveProbe?: boolean;
  clipView?: boolean;
  highlightedLossZone?: string | null;
  wireframeOverlay?: boolean;
}

export const BoneLoss3DCanvas: React.FC<BoneLoss3DCanvasProps> = ({
  defectType,
  showControls = true,
  onSelectLandmark,
  height = '500px',
  isSplitView = false,
  highlightWalls = false,
  customDepth,
  interactiveProbe = false,
  clipView = false,
  highlightedLossZone = null,
  wireframeOverlay = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLayers, setActiveLayers] = useState({
    bone: true,
    tooth: true,
    pdl: true,
    gingiva: true,
    probe: true,
    channels: true,
    wireframeOverlay: wireframeOverlay
  });
  const [internalWireframeOverlay, setInternalWireframeOverlay] = useState<boolean>(wireframeOverlay);
  const [boneOpacityMode, setBoneOpacityMode] = useState<'solid' | 'translucent' | 'wireframe'>('solid');
  const [autoRotate, setAutoRotate] = useState(false);
  const [enableClip, setEnableClip] = useState(clipView);
  const [probeInsertion, setProbeInsertion] = useState(0); // 0 to 1

  // References for Three.js lifecycle
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const particleGroupRef = useRef<THREE.Group | null>(null);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraTargetDistanceRef = useRef(3.2);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x071433);

    // Camera - close macro framing for maximum bone loss defect visibility
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.45, cameraTargetDistanceRef.current);
    camera.lookAt(0, -0.15, 0);
    cameraRef.current = camera;

    // Renderer with clipping plane support
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.localClippingEnabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    keyLight.position.set(6, 9, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.6);
    rimLight.position.set(0, 6, -6);
    scene.add(rimLight);

    // Groups
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);
    modelGroupRef.current = masterGroup;

    const particleGroup = new THREE.Group();
    masterGroup.add(particleGroup);
    particleGroupRef.current = particleGroup;

    // Build the dynamic 3D geometry
    rebuild3DModel(
      masterGroup,
      particleGroup,
      defectType,
      activeLayers,
      boneOpacityMode,
      highlightWalls,
      enableClip,
      probeInsertion,
      customDepth,
      highlightedLossZone
    );

    // Animation Loop
    const clock = new THREE.Timer();
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      clock.update();
      const delta = clock.getDelta();

      if (autoRotate && masterGroup) {
        masterGroup.rotation.y += 0.007;
      }

      // Animate flowing inflammatory particles if present
      if (particleGroup && particleGroup.children.length > 0) {
        particleGroup.children.forEach((p, idx) => {
          p.position.y += Math.sin(clock.getElapsed() * 3 + idx) * 0.004;
          if (p instanceof THREE.Mesh && p.material instanceof THREE.MeshBasicMaterial) {
            p.material.opacity = 0.5 + Math.sin(clock.getElapsed() * 4 + idx) * 0.4;
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse / Touch handlers for Orbit Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !masterGroup) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      masterGroup.rotation.y += deltaX * 0.008;
      masterGroup.rotation.x = Math.max(-0.85, Math.min(0.85, masterGroup.rotation.x + deltaY * 0.008));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newDist = Math.max(1.6, Math.min(6.5, cameraRef.current.position.z + e.deltaY * 0.003));
      cameraRef.current.position.z = newDist;
      cameraTargetDistanceRef.current = newDist;
    };

    // Touch support for iPad / mobile
    let touchStartDist = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.hypot(dx, dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current && masterGroup) {
        const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
        const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;
        masterGroup.rotation.y += deltaX * 0.009;
        masterGroup.rotation.x = Math.max(-0.85, Math.min(0.85, masterGroup.rotation.x + deltaY * 0.009));
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && cameraRef.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const delta = touchStartDist - dist;
        const newDist = Math.max(3.2, Math.min(12, cameraRef.current.position.z + delta * 0.01));
        cameraRef.current.position.z = newDist;
        touchStartDist = dist;
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });
    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  // Update geometry whenever defectType, layers, opacity, clipping, or loss zone changes
  useEffect(() => {
    if (modelGroupRef.current && particleGroupRef.current) {
      rebuild3DModel(
        modelGroupRef.current,
        particleGroupRef.current,
        defectType,
        activeLayers,
        boneOpacityMode,
        highlightWalls,
        enableClip,
        probeInsertion,
        customDepth,
        highlightedLossZone
      );

      // Auto-orient view angle smoothly towards the active loss area
      if (highlightedLossZone && modelGroupRef.current) {
        if (highlightedLossZone === 'facial_wall') {
          modelGroupRef.current.rotation.set(0.12, 0, 0);
        } else if (highlightedLossZone === 'lingual_wall') {
          modelGroupRef.current.rotation.set(0.12, Math.PI, 0);
        } else if (
          highlightedLossZone === 'distal_wall' ||
          highlightedLossZone === 'interdental_septum' ||
          highlightedLossZone === 'proximal_septum'
        ) {
          modelGroupRef.current.rotation.set(0.18, Math.PI / 2, 0);
        } else if (highlightedLossZone === 'total_cavity' || highlightedLossZone === 'infrabony_base') {
          modelGroupRef.current.rotation.set(0.42, 0.65, 0);
        }
      }
    }
  }, [defectType, activeLayers, boneOpacityMode, highlightWalls, enableClip, probeInsertion, customDepth, highlightedLossZone]);

  const resetCamera = () => {
    if (cameraRef.current && modelGroupRef.current) {
      cameraRef.current.position.set(0, 0.45, 3.2);
      cameraRef.current.lookAt(0, -0.15, 0);
      modelGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  const setPresetAngle = (view: 'facial' | 'lingual' | 'mesial' | 'occlusal') => {
    if (!modelGroupRef.current) return;
    if (view === 'facial') {
      modelGroupRef.current.rotation.set(0, 0, 0);
    } else if (view === 'lingual') {
      modelGroupRef.current.rotation.set(0, Math.PI, 0);
    } else if (view === 'mesial') {
      modelGroupRef.current.rotation.set(0, Math.PI / 2, 0);
    } else if (view === 'occlusal') {
      modelGroupRef.current.rotation.set(Math.PI / 2.2, 0, 0);
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col" style={{ minHeight: height }}>
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full flex-1 relative cursor-grab active:cursor-grabbing" style={{ minHeight: height }} />

      {/* Overlay Badge: Active Defect Information */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="px-3 py-1 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white font-bold text-xs flex items-center gap-2 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{getDefectTitle(defectType)}</span>
        </div>
        <div className="px-2.5 py-0.5 rounded-lg bg-black/75 backdrop-blur-sm text-[11px] text-slate-300 font-mono">
          {getDefectSubtitle(defectType)}
        </div>
        {highlightedLossZone && (
          <div className="px-3 py-1 rounded-xl bg-rose-950/95 border border-rose-500 text-rose-200 text-xs font-mono font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>⚡ 3D Active Bone Loss: {getLossZoneLabel(highlightedLossZone)}</span>
          </div>
        )}
      </div>

      {/* Layer Toggles & View Controls (Floating HUD) */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl">
          {/* Layer toggles */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto custom-scrollbar pb-0.5">
            <button
              onClick={() => setActiveLayers((p) => ({ ...p, bone: !p.bone }))}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition ${
                activeLayers.bone
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bone</span>
            </button>
            <button
              onClick={() => setActiveLayers((p) => ({ ...p, tooth: !p.tooth }))}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition ${
                activeLayers.tooth
                  ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/50'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              <span>Tooth</span>
            </button>
            <button
              onClick={() => setActiveLayers((p) => ({ ...p, gingiva: !p.gingiva }))}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition ${
                activeLayers.gingiva
                  ? 'bg-pink-600/30 text-pink-300 border border-pink-500/50'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              <span>Gingiva</span>
            </button>
            <button
              onClick={() => setActiveLayers((p) => ({ ...p, pdl: !p.pdl }))}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition ${
                activeLayers.pdl
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              <span>PDL</span>
            </button>
            <button
              onClick={() => setEnableClip(!enableClip)}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition ${
                enableClip
                  ? 'bg-purple-600/40 text-purple-200 border border-purple-500/60'
                  : 'bg-slate-800 text-slate-400'
              }`}
              title="Slice model to inspect internal trabeculae & root cross-section"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Cross-Section</span>
            </button>
            <button
              onClick={() =>
                setBoneOpacityMode((prev) =>
                  prev === 'solid' ? 'translucent' : prev === 'translucent' ? 'wireframe' : 'solid'
                )
              }
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
              title="Toggle bone rendering mode"
            >
              Mode: {boneOpacityMode}
            </button>
          </div>

          {/* Camera Presets & Orbit tools */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setPresetAngle('facial')}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Facial
            </button>
            <button
              onClick={() => setPresetAngle('mesial')}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Proximal
            </button>
            <button
              onClick={() => setPresetAngle('occlusal')}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Top-Down
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-2 py-1 rounded-lg transition ${
                autoRotate ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
              }`}
              title="Toggle 360° auto-rotation"
            >
              Spin
            </button>
            <button
              onClick={resetCamera}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              title="Reset Camera"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// PROCEDURAL 3D ANATOMICAL RECONSTRUCTION LOGIC
// =========================================================================

function rebuild3DModel(
  group: THREE.Group,
  particles: THREE.Group,
  defectType: BoneDefect3DType,
  layers: { bone: boolean; tooth: boolean; pdl: boolean; gingiva: boolean; probe: boolean; channels: boolean },
  boneMode: 'solid' | 'translucent' | 'wireframe',
  highlightWalls: boolean,
  clipView: boolean,
  probeInsertion: number,
  customDepth?: number,
  highlightedLossZone?: string | null
) {
  // Clear previous meshes
  while (group.children.length > 0) {
    const obj = group.children[0];
    group.remove(obj);
    if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
  }
  while (particles.children.length > 0) {
    particles.remove(particles.children[0]);
  }
  group.add(particles);

  const isMultirooted = defectType.startsWith('furcation');
  const clipPlanes = clipView ? [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.1)] : [];

  // 1. TOOTH STRUCTURE
  if (layers.tooth) {
    const toothGroup = new THREE.Group();

    // Enamel Material
    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      roughness: 0.18,
      metalness: 0.04,
      transmission: 0.15,
      ior: 1.62,
      clearcoat: 0.85,
      clippingPlanes: clipPlanes,
      clipShadows: true
    });

    // Cementum Material
    const cementumMat = new THREE.MeshStandardMaterial({
      color: 0xdec08f,
      roughness: 0.52,
      metalness: 0.05,
      clippingPlanes: clipPlanes
    });

    // Crown
    const crownGeo = new THREE.CylinderGeometry(0.85, 0.72, 1.45, 32);
    crownGeo.scale(1, 1, 0.85);
    const crownMesh = new THREE.Mesh(crownGeo, enamelMat);
    crownMesh.position.y = 0.95;
    crownMesh.castShadow = true;
    toothGroup.add(crownMesh);

    // Occlusal cusp cap
    const cuspGeo = new THREE.ConeGeometry(0.82, 0.42, 32);
    cuspGeo.scale(1, 1, 0.85);
    const cuspMesh = new THREE.Mesh(cuspGeo, enamelMat);
    cuspMesh.position.y = 1.7;
    toothGroup.add(cuspMesh);

    // Pulp Chamber (visible if clipped)
    if (clipView) {
      const pulpMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const pulpGeo = new THREE.CylinderGeometry(0.18, 0.05, 2.8, 16);
      pulpGeo.translate(0, -0.4, 0);
      toothGroup.add(new THREE.Mesh(pulpGeo, pulpMat));
    }

    // Roots
    if (isMultirooted) {
      // Mandibular 1st Molar with mesial & distal roots and bifurcation fornix
      const rootLength = 2.45;
      const rootRadius = 0.32;

      const mesialRootGeo = new THREE.CylinderGeometry(rootRadius, 0.1, rootLength, 24);
      mesialRootGeo.translate(0, -rootLength / 2, 0);
      const mesialRoot = new THREE.Mesh(mesialRootGeo, cementumMat);
      mesialRoot.position.set(-0.48, 0.2, 0);
      mesialRoot.rotation.z = 0.09;
      toothGroup.add(mesialRoot);

      const distalRootGeo = new THREE.CylinderGeometry(rootRadius, 0.08, rootLength, 24);
      distalRootGeo.translate(0, -rootLength / 2, 0);
      const distalRoot = new THREE.Mesh(distalRootGeo, cementumMat);
      distalRoot.position.set(0.48, 0.2, 0);
      distalRoot.rotation.z = -0.09;
      toothGroup.add(distalRoot);

      // Undivided Root Trunk (3mm average on buccal)
      const trunkGeo = new THREE.CylinderGeometry(0.72, 0.68, 0.5, 32);
      trunkGeo.scale(1, 1, 0.85);
      const trunkMesh = new THREE.Mesh(trunkGeo, cementumMat);
      trunkMesh.position.y = 0.18;
      toothGroup.add(trunkMesh);
    } else {
      // Single conical root
      const rootLength = 2.65;
      const rootGeo = new THREE.CylinderGeometry(0.72, 0.12, rootLength, 32);
      rootGeo.scale(1, 1, 0.85);
      rootGeo.translate(0, -rootLength / 2, 0);
      const rootMesh = new THREE.Mesh(rootGeo, cementumMat);
      rootMesh.position.y = 0.2;
      toothGroup.add(rootMesh);
    }

    group.add(toothGroup);
  }

  // 2. PERIODONTAL LIGAMENT (PDL)
  if (layers.pdl) {
    const pdlMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.38,
      roughness: 0.8,
      clippingPlanes: clipPlanes
    });
    const pdlGeo = new THREE.CylinderGeometry(0.76, 0.15, 2.4, 24);
    pdlGeo.scale(1.05, 1, 0.9);
    pdlGeo.translate(0, -1.2, 0);
    const pdlMesh = new THREE.Mesh(pdlGeo, pdlMat);
    pdlMesh.position.y = 0.1;
    group.add(pdlMesh);
  }

  // 3. ALVEOLAR BONE HOUSING
  if (layers.bone) {
    const boneGroup = new THREE.Group();

    // Standard bone material
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xe2d6b5,
      roughness: 0.65,
      metalness: 0.08,
      transparent: boneMode === 'translucent',
      opacity: boneMode === 'translucent' ? 0.45 : 1.0,
      wireframe: boneMode === 'wireframe',
      clippingPlanes: clipPlanes
    });

    // Special wall highlighting materials
    const distalWallMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.5, clippingPlanes: clipPlanes }); // Blue
    const lingualWallMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.5, clippingPlanes: clipPlanes }); // Purple
    const facialWallMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5, clippingPlanes: clipPlanes }); // Emerald

    // Generate dynamic geometry according to defect type
    switch (defectType) {
      case 'normal': {
        const normalBone = createBoxSocket(1.85, 2.3, 1.85, 0.22, 0);
        boneGroup.add(new THREE.Mesh(normalBone, boneMat));
        break;
      }

      case 'horizontal': {
        // Flat symmetrical horizontal bone loss (suprabony)
        const horizBone = createBoxSocket(1.85, 1.4, 1.85, -0.65, 0);
        boneGroup.add(new THREE.Mesh(horizBone, boneMat));

        // Horizontal flat shelf indicator line
        const flatLineGeo = new THREE.RingGeometry(0.9, 1.05, 32);
        flatLineGeo.rotateX(Math.PI / 2);
        const flatLineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
        const flatLine = new THREE.Mesh(flatLineGeo, flatLineMat);
        flatLine.position.y = -0.65;
        boneGroup.add(flatLine);
        break;
      }

      case 'vertical': {
        // Oblique slanting angular defect on mesial (infrabony, cuneiform appearance)
        const vertBone = createVerticalAngularSocket();
        boneGroup.add(new THREE.Mesh(vertBone, boneMat));
        break;
      }

      case 'three_wall': {
        // 3 walls: Distal, Lingual, Facial. Tooth is 4th. Best regeneration!
        const threeWallMesh = createThreeWallDefect();
        if (highlightWalls) {
          // Highlight remaining walls in distinct colors
          boneGroup.add(new THREE.Mesh(threeWallMesh, distalWallMat));
        } else {
          boneGroup.add(new THREE.Mesh(threeWallMesh, boneMat));
        }
        break;
      }

      case 'two_wall': {
        // 2 walls: Buccal and Lingual intact; interdental lost
        const twoWallMesh = createTwoWallDefect();
        boneGroup.add(new THREE.Mesh(twoWallMesh, boneMat));
        break;
      }

      case 'one_wall': {
        // 1 wall / Hemiseptum
        const oneWallMesh = createOneWallDefect();
        boneGroup.add(new THREE.Mesh(oneWallMesh, boneMat));
        break;
      }

      case 'combined': {
        // 3 walls apical half, 2 walls occlusal half
        const combinedMesh = createCombinedDefect();
        boneGroup.add(new THREE.Mesh(combinedMesh, boneMat));
        break;
      }

      case 'circumferential': {
        // Trough-like moat defect around tooth
        const circumMesh = createCircumferentialDefect();
        boneGroup.add(new THREE.Mesh(circumMesh, boneMat));
        break;
      }

      case 'crater':
      case 'crater_shallow':
      case 'crater_medium':
      case 'crater_deep': {
        // Osseous crater: 2-wall concavity between facial & lingual walls
        const depth =
          defectType === 'crater_shallow'
            ? 0.4
            : defectType === 'crater_medium'
            ? 0.75
            : defectType === 'crater_deep'
            ? 1.15
            : customDepth || 0.8;
        const craterMesh = createOsseousCraterWithDepth(depth);
        boneGroup.add(new THREE.Mesh(craterMesh, boneMat));
        break;
      }

      case 'furcation_grade1':
      case 'furcation_grade2':
      case 'furcation_grade3':
      case 'furcation_grade4': {
        const gradeNum = parseInt(defectType.replace('furcation_grade', ''), 10);
        const furcBone = createFurcationBone(gradeNum);
        boneGroup.add(new THREE.Mesh(furcBone, boneMat));

        // Animated curved Nabers probe graphic navigating through furcation
        const probeGroup = createNabersProbeGraphic(gradeNum);
        boneGroup.add(probeGroup);
        break;
      }

      case 'pathways_interproximal': {
        // Interproximal spread: transseptal fibers -> vessel channels -> marrow -> PDL
        const normalBone = createBoxSocket(1.85, 2.3, 1.85, 0.22, 0);
        boneGroup.add(new THREE.Mesh(normalBone, boneMat));

        // Glowing vessel channels perforating the crest
        const channelMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        for (let i = -0.3; i <= 0.3; i += 0.3) {
          const channelGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
          channelGeo.translate(0.5, -0.4, i);
          boneGroup.add(new THREE.Mesh(channelGeo, channelMat));
        }

        // Add animated floating glowing leukocytes
        for (let j = 0; j < 12; j++) {
          const pGeo = new THREE.SphereGeometry(0.05, 8, 8);
          const pMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
          const p = new THREE.Mesh(pGeo, pMat);
          p.position.set(0.5 + (Math.random() - 0.5) * 0.2, 0.3 - j * 0.12, (Math.random() - 0.5) * 0.4);
          particles.add(p);
        }
        break;
      }

      case 'pathways_facial': {
        // Outer periosteal route: along outer periosteum -> cortex -> marrow -> PDL
        const normalBone = createBoxSocket(1.85, 2.3, 1.85, 0.22, 0);
        boneGroup.add(new THREE.Mesh(normalBone, boneMat));

        // Glowing trail along facial cortex (+Z surface)
        const cortexMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
        const trailGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8);
        trailGeo.translate(0, -0.4, 0.95);
        boneGroup.add(new THREE.Mesh(trailGeo, cortexMat));

        for (let j = 0; j < 12; j++) {
          const pGeo = new THREE.SphereGeometry(0.05, 8, 8);
          const pMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.8 });
          const p = new THREE.Mesh(pGeo, pMat);
          p.position.set((Math.random() - 0.5) * 0.4, 0.3 - j * 0.12, 0.95 + (Math.random() - 0.5) * 0.1);
          particles.add(p);
        }
        break;
      }

      case 'occlusal_trauma':
      case 'occlusal_trauma_plaque': {
        // TFO model: lateral vector arrow + angular defect
        const isWithPlaque = defectType === 'occlusal_trauma_plaque';
        const tfoBone = createVerticalAngularSocket();
        boneGroup.add(new THREE.Mesh(tfoBone, boneMat));

        // Highlighting force vector arrow
        const arrowDir = new THREE.Vector3(-1, -0.3, 0).normalize();
        const arrowOrigin = new THREE.Vector3(1.4, 1.2, 0);
        const arrowHelper = new THREE.ArrowHelper(arrowDir, arrowOrigin, 1.2, 0xf59e0b, 0.35, 0.2);
        boneGroup.add(arrowHelper);

        // Compression zone indicator (red)
        const compGeo = new THREE.BoxGeometry(0.2, 1.0, 0.4);
        compGeo.translate(-0.75, -0.6, 0);
        const compMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.6 });
        boneGroup.add(new THREE.Mesh(compGeo, compMat));
        break;
      }

      case 'exostoses': {
        // Palatal/buccal bony outgrowths (40% skulls)
        const baseBone = createBoxSocket(1.85, 2.3, 1.85, 0.22, 0);
        boneGroup.add(new THREE.Mesh(baseBone, boneMat));

        // Exostosis nodules on palatal (-Z) and buccal (+Z)
        const nodule1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), boneMat);
        nodule1.position.set(0.3, 0.05, -0.95);
        boneGroup.add(nodule1);

        const nodule2 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), boneMat);
        nodule2.position.set(-0.2, -0.15, -0.98);
        boneGroup.add(nodule2);

        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 12), boneMat);
        spike.position.set(0.4, -0.2, 0.95);
        spike.rotation.x = Math.PI / 2;
        boneGroup.add(spike);
        break;
      }

      case 'buttressing_peripheral': {
        // Lipping on external surface
        const baseBone = createBoxSocket(1.85, 2.3, 1.85, 0.22, 0);
        boneGroup.add(new THREE.Mesh(baseBone, boneMat));

        // Peripheral lip bulge
        const lipGeo = new THREE.TorusGeometry(0.95, 0.18, 16, 32);
        lipGeo.rotateX(Math.PI / 2);
        const lipMesh = new THREE.Mesh(lipGeo, boneMat);
        lipMesh.position.y = 0.15;
        boneGroup.add(lipMesh);
        break;
      }

      case 'bulbous': {
        const baseBone = createBoxSocket(2.3, 2.3, 2.3, 0.22, 0);
        boneGroup.add(new THREE.Mesh(baseBone, boneMat));
        break;
      }

      case 'reversed_arch': {
        // Reversed architecture: interdental bone sits apical to midfacial bone
        const revBone = createReversedArchitectureSocket();
        boneGroup.add(new THREE.Mesh(revBone, boneMat));
        break;
      }

      case 'ledges': {
        // Plateau-like bone margin
        const ledgeBone = createLedgeSocket();
        boneGroup.add(new THREE.Mesh(ledgeBone, boneMat));
        break;
      }

      case 'thin_plate': {
        // Thin bone plate melting horizontally
        const thinBone = createBoxSocket(1.7, 1.4, 1.5, -0.6, 0);
        boneGroup.add(new THREE.Mesh(thinBone, boneMat));
        break;
      }
    }

    if (highlightedLossZone) {
      boneGroup.add(createBoneLossHighlightGroup(defectType, highlightedLossZone, clipPlanes));
    }

    group.add(boneGroup);
  }

  // 4. GINGIVAL SOFT TISSUE
  if (layers.gingiva) {
    const gingivaMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.42,
      metalness: 0.04,
      transparent: true,
      opacity: 0.52,
      clippingPlanes: clipPlanes
    });

    const isRecessionGrade4 = defectType === 'furcation_grade4';
    const gingivaY = isRecessionGrade4 ? -0.85 : 0.42;

    const gingivaGeo = new THREE.CylinderGeometry(1.05, 1.15, 0.65, 32, 1, true);
    gingivaGeo.translate(0, gingivaY, 0);
    const gingivaMesh = new THREE.Mesh(gingivaGeo, gingivaMat);
    group.add(gingivaMesh);
  }
}

// Helper Geometries
function createBoxSocket(width: number, height: number, depth: number, topY: number, bevel: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -depth / 2);
  shape.lineTo(width / 2, -depth / 2);
  shape.lineTo(width / 2, depth / 2);
  shape.lineTo(-width / 2, depth / 2);
  shape.closePath();

  const hole = new THREE.Path();
  hole.absellipse(0, 0, 0.76, 0.76, 0, Math.PI * 2, true, 0);
  shape.holes.push(hole);

  const extrudeSettings = { depth: height, bevelEnabled: false };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.rotateX(Math.PI / 2);
  geo.translate(0, topY, 0);
  return geo;
}

function createVerticalAngularSocket() {
  const geo = new THREE.BoxGeometry(2.4, 2.0, 2.0);
  geo.translate(0, -0.9, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (x > 0.2 && y > -0.85 && Math.abs(z) < 0.6) {
      pos.setY(i, y - 0.95 * (1.2 - x));
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function createThreeWallDefect() {
  const geo = new THREE.BoxGeometry(2.2, 2.0, 2.0);
  geo.translate(0, -0.9, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (x > 0.3 && x < 0.85 && Math.abs(z) < 0.45 && y > -1.2) {
      pos.setY(i, y - 1.15);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function createTwoWallDefect() {
  const geo = new THREE.BoxGeometry(2.2, 2.0, 2.0);
  geo.translate(0, -0.9, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (x > 0.25 && Math.abs(z) < 0.55 && y > -1.0) {
      pos.setY(i, y - 0.88);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function createOneWallDefect() {
  const geo = new THREE.BoxGeometry(2.2, 2.0, 2.0);
  geo.translate(0, -0.9, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (x > 0.1 && z > -0.35 && y > -1.2) {
      pos.setY(i, y - 1.25);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function createCombinedDefect() {
  const geo = new THREE.BoxGeometry(2.2, 2.0, 2.0);
  geo.translate(0, -0.9, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (x > 0.3 && Math.abs(z) < 0.6) {
      if (z > 0.1 && y > -0.6) {
        pos.setY(i, y - 0.7);
      } else if (y > -1.2) {
        pos.setY(i, y - 1.1);
      }
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function createCircumferentialDefect() {
  const geo = new THREE.BoxGeometry(2.2, 2.0, 2.2);
  geo.translate(0, -0.9, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const dist = Math.hypot(x, z);
    if (dist > 0.65 && dist < 1.15 && y > -1.0) {
      pos.setY(i, y - 0.95);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function createOsseousCraterWithDepth(depth: number) {
  const geo = new THREE.BoxGeometry(2.2, 2.0, 2.0);
  geo.translate(0, -0.9, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (x > 0.25 && x < 0.95 && Math.abs(z) < 0.45 && y > -0.8) {
      const depthFactor = 1 - Math.abs(z) / 0.45;
      pos.setY(i, y - depth * depthFactor);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function createReversedArchitectureSocket() {
  const geo = new THREE.BoxGeometry(2.2, 2.0, 2.0);
  geo.translate(0, -0.9, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Interdental bone (-X and +X) dropped apical, midfacial (+Z) preserved
    if (Math.abs(x) > 0.35 && y > -0.9) {
      pos.setY(i, y - 0.85);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function createLedgeSocket() {
  const geo = new THREE.BoxGeometry(2.4, 1.6, 2.4);
  geo.translate(0, -0.8, 0);
  return geo;
}

function createFurcationBone(grade: number) {
  const geo = new THREE.BoxGeometry(2.4, 2.0, 2.2);
  geo.translate(0, -1.0, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (Math.abs(x) < 0.45 && y > -1.2) {
      if (grade === 1) {
        if (z > 0.5) pos.setY(i, y - 0.35);
      } else if (grade === 2) {
        if (z > 0.15) pos.setY(i, y - 0.75);
      } else if (grade >= 3) {
        pos.setY(i, y - 0.95);
      }
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function createNabersProbeGraphic(grade: number) {
  const group = new THREE.Group();
  const probeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
  const bandMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

  // Curved shaft
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0, 1.4),
    new THREE.Vector3(0, 0, 0.8),
    new THREE.Vector3(0, -0.2, 0.3),
    new THREE.Vector3(0, -0.4, grade >= 3 ? -0.4 : 0.05)
  );
  const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
  const probeMesh = new THREE.Mesh(tubeGeo, probeMat);
  group.add(probeMesh);

  // Calibrated 3mm bands
  const band1 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 8), bandMat);
  band1.position.set(0, -0.1, 0.6);
  band1.rotation.x = Math.PI / 4;
  group.add(band1);

  return group;
}

function getDefectTitle(defect: BoneDefect3DType): string {
  switch (defect) {
    case 'normal':
      return 'Physiological Alveolar Bone (Intact Crest)';
    case 'horizontal':
      return 'Horizontal Bone Loss (Symmetrical Flat Reduction)';
    case 'vertical':
      return 'Vertical / Angular Defect (Cuneiform Infrabony Trench)';
    case 'three_wall':
      return 'Three-Wall Bony Defect (Intrabony Defect)';
    case 'two_wall':
      return 'Two-Wall Bony Defect (Interdental Septum Loss)';
    case 'one_wall':
      return 'One-Wall Bony Defect / Hemiseptum';
    case 'combined':
      return 'Combined Bony Defect (Multi-Level 3/2 Walls)';
    case 'circumferential':
      return 'Circumferential Defect (Continuous Trough-Like)';
    case 'crater':
    case 'crater_shallow':
    case 'crater_medium':
    case 'crater_deep':
      return 'Osseous Crater (Confinement between Facial & Lingual Walls)';
    case 'furcation_grade1':
      return 'Glickman Grade I: Incipient Furcation Catch';
    case 'furcation_grade2':
      return 'Glickman Grade II: Partial Loss (Cul-de-sac)';
    case 'furcation_grade3':
      return 'Glickman Grade III: Total Through-and-Through (Covered)';
    case 'furcation_grade4':
      return 'Glickman Grade IV: Exposed Through-and-Through';
    case 'pathways_interproximal':
      return 'Interproximal Inflammatory Pathway (Crestal Perforations)';
    case 'pathways_facial':
      return 'Facial & Lingual Pathway (Outer Periosteal Spread)';
    case 'occlusal_trauma':
      return 'Primary TFO: Angular Defect WITHOUT Pocket (No Plaque)';
    case 'occlusal_trauma_plaque':
      return 'Secondary TFO: Bizarre Bone Patterns (With Plaque)';
    case 'exostoses':
      return 'Palatal Exostoses (Found in 40% of Skulls)';
    case 'buttressing_peripheral':
      return 'Peripheral Buttressing Bone Formation (Lipping)';
    case 'bulbous':
      return 'Bulbous Bone Contour (Maxilla > Mandible)';
    case 'reversed_arch':
      return 'Reversed Architecture (Inconsistent Bony Margin)';
    case 'ledges':
      return 'Plateau-Like Ledges from Resorption of Thick Plates';
    case 'thin_plate':
      return 'Thin Cortical Plate (Melted Horizontally)';
    default:
      return 'Periodontal 3D Anatomical Model';
  }
}

function getDefectSubtitle(defect: BoneDefect3DType): string {
  switch (defect) {
    case 'normal':
      return 'Normal crest 1.5–2.0 mm apical to CEJ with intact cribriform plate.';
    case 'horizontal':
      return 'Progression at an even rate; flat bony architecture; accompanies supra-bony pockets.';
    case 'vertical':
      return 'Oblique-slanting direction; funnel/trough shape; increases with age.';
    case 'three_wall':
      return 'Distal, lingual, facial walls intact; 1 tooth surface; best regeneration!';
    case 'two_wall':
      return 'Enclosed by 2 tooth surfaces and 2 osseous walls (buccal and lingual intact).';
    case 'one_wall':
      return 'Only one bony wall remains facing tooth; severe septum breakdown.';
    case 'combined':
      return 'Number of walls differs: 3 walls in apical half, 2 walls in occlusal half.';
    case 'circumferential':
      return 'Continuous defect involving more than one surface of tooth in trough shape.';
    case 'crater':
      return '35.2% of all defects, 62% of mandibular defects; identical crests in 85%.';
    case 'furcation_grade1':
      return 'Incipient bone loss catching root trunk fluting on Nabers probing.';
    case 'furcation_grade2':
      return 'Partial bone loss (>3mm entry into fornix dome, does not pass through).';
    case 'furcation_grade3':
      return 'Through-and-through opening of furcation completely covered by soft tissue.';
    case 'furcation_grade4':
      return 'Recession exposes the furcation tunnel directly to clinical view.';
    case 'pathways_interproximal':
      return 'Gingiva -> transseptal fibers -> vessel channels -> marrow -> PDL.';
    case 'pathways_facial':
      return 'Gingiva -> outer periosteal surface -> outer cortex vessel channels -> marrow -> PDL.';
    case 'occlusal_trauma':
      return 'In absence of plaque: compression/tension causes bone resorption without pocket.';
    default:
      return '';
  }
}

function getLossZoneLabel(zone: string): string {
  switch (zone) {
    case 'total_cavity':
      return 'Total Resorption Void / Intrabony Trench (-4.2 mm)';
    case 'distal_wall':
      return 'Distal / Proximal Wall Resorption Zone';
    case 'lingual_wall':
      return 'Lingual Cortical Plate Destruction Zone';
    case 'facial_wall':
      return 'Facial / Buccal Cortical Plate Resorption';
    case 'infrabony_base':
      return 'Infrabony Defect Floor / Base (-5.0 mm below crest)';
    case 'interdental_septum':
    case 'proximal_septum':
      return 'Lost Interdental Bone Septum';
    case 'coronal_loss':
      return 'Coronal 2-Wall Bone Shelf Loss';
    default:
      return zone.replace(/_/g, ' ');
  }
}

function createBoneLossHighlightGroup(
  defectType: BoneDefect3DType,
  lossZone: string,
  clipPlanes: THREE.Plane[]
): THREE.Group {
  const lossGroup = new THREE.Group();

  // Radiant neon glowing materials with emissive shine
  const lossCavityMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xef4444,
    emissiveIntensity: 0.75,
    roughness: 0.25,
    metalness: 0.1,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
    clippingPlanes: clipPlanes
  });

  const wallHighlightMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.75,
    roughness: 0.25,
    metalness: 0.1,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide,
    clippingPlanes: clipPlanes
  });

  const baseFloorMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.85,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
    clippingPlanes: clipPlanes
  });

  const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });

  // Add geometric volume based on defectType and lossZone
  let geo: THREE.BufferGeometry | null = null;
  let chosenMat: THREE.Material = lossCavityMat;
  let posX = 0.6;
  let posY = -0.55;
  let posZ = 0;

  if (defectType === 'three_wall') {
    if (lossZone === 'distal_wall') {
      geo = new THREE.BoxGeometry(0.2, 1.15, 0.85);
      posX = 0.88;
      posY = -0.55;
      chosenMat = wallHighlightMat;
    } else if (lossZone === 'lingual_wall') {
      geo = new THREE.BoxGeometry(0.55, 1.15, 0.2);
      posX = 0.6;
      posY = -0.55;
      posZ = -0.42;
      chosenMat = wallHighlightMat;
    } else if (lossZone === 'facial_wall') {
      geo = new THREE.BoxGeometry(0.55, 1.15, 0.2);
      posX = 0.6;
      posY = -0.55;
      posZ = 0.42;
      chosenMat = wallHighlightMat;
    } else if (lossZone === 'infrabony_base') {
      geo = new THREE.BoxGeometry(0.52, 0.22, 0.8);
      posX = 0.6;
      posY = -1.05;
      chosenMat = baseFloorMat;
    } else {
      // 'total_cavity' or default
      geo = new THREE.BoxGeometry(0.55, 1.15, 0.85);
      posX = 0.6;
      posY = -0.58;
    }
  } else if (defectType === 'two_wall') {
    if (lossZone === 'facial_wall') {
      geo = new THREE.BoxGeometry(0.55, 0.95, 0.2);
      posX = 0.6;
      posY = -0.52;
      posZ = 0.48;
      chosenMat = wallHighlightMat;
    } else if (lossZone === 'lingual_wall') {
      geo = new THREE.BoxGeometry(0.55, 0.95, 0.2);
      posX = 0.6;
      posY = -0.52;
      posZ = -0.48;
      chosenMat = wallHighlightMat;
    } else if (lossZone === 'infrabony_base') {
      geo = new THREE.BoxGeometry(0.58, 0.2, 0.95);
      posX = 0.6;
      posY = -0.92;
      chosenMat = baseFloorMat;
    } else {
      // 'total_cavity', 'interdental_septum', 'distal_wall' (resorbed)
      geo = new THREE.BoxGeometry(0.62, 0.95, 0.95);
      posX = 0.6;
      posY = -0.52;
    }
  } else if (defectType === 'one_wall') {
    if (lossZone === 'distal_wall') {
      geo = new THREE.BoxGeometry(0.2, 1.25, 1.2);
      posX = 0.92;
      posY = -0.55;
      chosenMat = wallHighlightMat;
    } else if (lossZone === 'facial_wall') {
      geo = new THREE.BoxGeometry(0.65, 1.2, 0.45);
      posX = 0.58;
      posY = -0.55;
      posZ = 0.55;
      chosenMat = lossCavityMat;
    } else if (lossZone === 'lingual_wall') {
      geo = new THREE.BoxGeometry(0.65, 1.2, 0.45);
      posX = 0.58;
      posY = -0.55;
      posZ = -0.55;
      chosenMat = lossCavityMat;
    } else {
      // 'total_cavity' - huge void
      geo = new THREE.BoxGeometry(0.68, 1.25, 1.35);
      posX = 0.6;
      posY = -0.55;
    }
  } else if (defectType === 'combined') {
    if (lossZone === 'facial_wall' || lossZone === 'coronal_loss') {
      // 2-wall coronal part lost
      geo = new THREE.BoxGeometry(0.58, 0.55, 0.45);
      posX = 0.6;
      posY = -0.25;
      posZ = 0.38;
      chosenMat = lossCavityMat;
    } else if (lossZone === 'infrabony_base') {
      geo = new THREE.BoxGeometry(0.55, 0.55, 0.8);
      posX = 0.6;
      posY = -0.85;
      chosenMat = baseFloorMat;
    } else {
      // 'total_cavity'
      geo = new THREE.BoxGeometry(0.6, 1.15, 0.85);
      posX = 0.6;
      posY = -0.55;
    }
  } else if (defectType === 'circumferential') {
    geo = new THREE.CylinderGeometry(1.2, 1.2, 0.95, 32, 1, true);
    posX = 0;
    posY = -0.48;
    posZ = 0;
  } else if (defectType === 'vertical') {
    geo = new THREE.ConeGeometry(0.7, 1.2, 16);
    geo.rotateZ(-Math.PI / 4);
    posX = 0.65;
    posY = -0.45;
  } else if (defectType === 'horizontal') {
    geo = new THREE.CylinderGeometry(1.3, 1.3, 0.75, 32, 1, true);
    posX = 0;
    posY = -0.25;
  } else {
    geo = new THREE.BoxGeometry(0.6, 0.9, 0.9);
    posX = 0.6;
    posY = -0.5;
  }

  if (geo) {
    const mesh = new THREE.Mesh(geo, chosenMat);
    mesh.position.set(posX, posY, posZ);
    lossGroup.add(mesh);

    // Glowing edge boundary lines
    const wireGeo = new THREE.EdgesGeometry(geo);
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    wireMesh.position.set(posX, posY, posZ);
    lossGroup.add(wireMesh);

    // Ghost Healthy Alveolar Crest Level (Translucent reference shelf at y = 0.22 showing original bone level)
    const ghostCrestGeo = new THREE.RingGeometry(0.85, 1.25, 24);
    ghostCrestGeo.rotateX(Math.PI / 2);
    const ghostCrestMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const ghostCrest = new THREE.Mesh(ghostCrestGeo, ghostCrestMat);
    ghostCrest.position.set(0, 0.22, 0);
    lossGroup.add(ghostCrest);

    // Vertical Depth Caliper Line from healthy crest (0.22) down into defect cavity
    const caliperHeight = Math.max(0.4, 0.22 - (posY - 0.2));
    const measureLineGeo = new THREE.CylinderGeometry(0.02, 0.02, caliperHeight, 8);
    measureLineGeo.translate(0, 0.22 - caliperHeight / 2, 0);
    const measureLineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const measureLine = new THREE.Mesh(measureLineGeo, measureLineMat);
    measureLine.position.set(posX, 0, posZ);
    lossGroup.add(measureLine);

    // Caliper pin pointing to center of loss
    const pinGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.set(posX, posY + 0.65, posZ);
    lossGroup.add(pin);

    // Floating target ring beacon at top of pin
    const ringGeo = new THREE.RingGeometry(0.08, 0.16, 16);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(posX, posY + 0.9, posZ);
    lossGroup.add(ring);
  }

  return lossGroup;
}
