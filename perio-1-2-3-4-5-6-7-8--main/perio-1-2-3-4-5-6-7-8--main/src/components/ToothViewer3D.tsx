import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Ruler,
  Layers,
  Compass,
  Sparkles,
  Info,
  Check,
  ChevronRight
} from 'lucide-react';
import {
  createInteractiveToothViewerModel,
  AnatomyLearningMode
} from '../utils/dentalAnatomy3D';
import { PermanentToothData, AnatomicalLandmark } from '../data/permanentTeethData';

export type CameraViewPreset = 'buccal' | 'lingual' | 'mesial' | 'distal' | 'occlusal' | 'apical' | 'default';

interface ToothViewer3DProps {
  tooth: PermanentToothData;
  learningMode: AnatomyLearningMode;
  onChangeLearningMode: (mode: AnatomyLearningMode) => void;
  showLandmarks: boolean;
  onToggleLandmarks: () => void;
  activeLandmarkId?: string;
  onSelectLandmark: (landmark: AnatomicalLandmark | null) => void;
  isMeasurementActive: boolean;
  onToggleMeasurement: () => void;
  isQuizTargetPickActive?: boolean;
  onModelPicked?: (partName: string, landmarkId?: string) => void;
}

export const ToothViewer3D: React.FC<ToothViewer3DProps> = ({
  tooth,
  learningMode,
  onChangeLearningMode,
  showLandmarks,
  onToggleLandmarks,
  activeLandmarkId,
  onSelectLandmark,
  isMeasurementActive,
  onToggleMeasurement,
  isQuizTargetPickActive = false,
  onModelPicked
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const toothModelGroupRef = useRef<THREE.Group | null>(null);
  const caliperGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Interaction State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredLandmark, setHoveredLandmark] = useState<AnatomicalLandmark | null>(null);
  const [activePreset, setActivePreset] = useState<CameraViewPreset>('buccal');

  // Mouse / Touch Controls State
  const isDraggingRef = useRef(false);
  const isRightDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const cameraSphericalRef = useRef({
    radius: 7.5,
    theta: 0, // azimuthal angle (around Y)
    phi: Math.PI / 2 // polar angle (from zenith)
  });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));

  // Update camera from spherical coordinates
  const updateCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraSphericalRef.current;
    const target = cameraTargetRef.current;

    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(target);
  }, []);

  // Standard Camera Presets
  const setCameraViewPreset = useCallback((preset: CameraViewPreset) => {
    setActivePreset(preset);
    cameraTargetRef.current.set(0, 0, 0);

    switch (preset) {
      case 'buccal':
        cameraSphericalRef.current = { radius: 7.5, theta: 0, phi: Math.PI / 2 };
        break;
      case 'lingual':
        cameraSphericalRef.current = { radius: 7.5, theta: Math.PI, phi: Math.PI / 2 };
        break;
      case 'mesial':
        cameraSphericalRef.current = { radius: 7.5, theta: -Math.PI / 2, phi: Math.PI / 2 };
        break;
      case 'distal':
        cameraSphericalRef.current = { radius: 7.5, theta: Math.PI / 2, phi: Math.PI / 2 };
        break;
      case 'occlusal':
        cameraSphericalRef.current = { radius: 7.2, theta: 0, phi: 0.08 };
        break;
      case 'apical':
        cameraSphericalRef.current = { radius: 7.2, theta: 0, phi: Math.PI - 0.08 };
        break;
      case 'default':
      default:
        cameraSphericalRef.current = { radius: 7.8, theta: 0.35, phi: Math.PI / 2.3 };
        break;
    }

    updateCameraPosition();
  }, [updateCameraPosition]);

  // Build Scene & Setup Three.js
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // Slate-950 medical workstation backdrop
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    // 4. Studio Lighting Rig for PBR Enamel Hydroxyapatite Translucency & Clearcoat
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0f172a, 1.1);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // Key Light (Facial/Occlusal illumination)
    const keyLight = new THREE.DirectionalLight(0xfffbf0, 1.8);
    keyLight.position.set(5, 8, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light (Soft cool bluish)
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.1);
    fillLight.position.set(-6, 4, 6);
    scene.add(fillLight);

    // Rim / Backlight for translucent enamel incisal edge halo
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.6);
    rimLight.position.set(0, -6, -8);
    scene.add(rimLight);

    // Soft Stage Floor Shadow
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.28 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -3.8;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Subtle 3D Grid Guide
    const grid = new THREE.GridHelper(10, 10, 0x1e293b, 0x0f172a);
    grid.position.y = -3.79;
    scene.add(grid);

    // 5. Render Loop
    let lastTime = performance.now();
    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Animate active pin halo pulsing
      if (toothModelGroupRef.current) {
        const pins = toothModelGroupRef.current.getObjectByName('landmarkPins');
        if (pins) {
          pins.children.forEach((p) => {
            const halo = p.children.find((c) => c instanceof THREE.Mesh && c.geometry instanceof THREE.RingGeometry);
            if (halo) {
              const scale = 1.0 + Math.sin(currentTime * 0.005) * 0.12;
              halo.scale.set(scale, scale, 1);
            }
          });
        }
      }

      renderer.render(scene, camera);
    };
    render();

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
    };
  }, [updateCameraPosition]);

  // Re-build 3D Tooth Model whenever tooth, learningMode, or landmarks change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old model
    if (toothModelGroupRef.current) {
      scene.remove(toothModelGroupRef.current);
      toothModelGroupRef.current = null;
    }

    // Build new model
    const newToothGroup = createInteractiveToothViewerModel({
      category: tooth.category,
      subCategory: tooth.subCategory,
      isMaxillary: tooth.arch === 'Maxillary',
      isMandibular: tooth.arch === 'Mandibular',
      learningMode,
      showLandmarks,
      activeLandmarkId,
      landmarks: tooth.landmarks
    });

    scene.add(newToothGroup);
    toothModelGroupRef.current = newToothGroup;
  }, [tooth, learningMode, showLandmarks, activeLandmarkId]);

  // Digital Caliper Measurement Overlay
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (caliperGroupRef.current) {
      scene.remove(caliperGroupRef.current);
      caliperGroupRef.current = null;
    }

    if (isMeasurementActive) {
      const caliperGroup = new THREE.Group();
      caliperGroup.name = 'digitalCalipers';

      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
      const dims = tooth.crownDimensions;

      // Crown Height Caliper: CEJ to Incisal/Occlusal tip
      const crownPoints = [
        new THREE.Vector3(1.2, 0, 0),
        new THREE.Vector3(1.6, 0, 0),
        new THREE.Vector3(1.6, 2.2, 0),
        new THREE.Vector3(1.2, 2.2, 0)
      ];
      const crownGeo = new THREE.BufferGeometry().setFromPoints(crownPoints);
      const crownLine = new THREE.Line(crownGeo, lineMat);
      caliperGroup.add(crownLine);

      // Root Length Caliper: CEJ to Apex
      const rootPoints = [
        new THREE.Vector3(-1.2, 0, 0),
        new THREE.Vector3(-1.6, 0, 0),
        new THREE.Vector3(-1.6, -3.2, 0),
        new THREE.Vector3(-1.2, -3.2, 0)
      ];
      const rootGeo = new THREE.BufferGeometry().setFromPoints(rootPoints);
      const rootLine = new THREE.Line(rootGeo, new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 }));
      caliperGroup.add(rootLine);

      scene.add(caliperGroup);
      caliperGroupRef.current = caliperGroup;
    }
  }, [isMeasurementActive, tooth]);

  // Mouse & Touch Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.button === 0) isDraggingRef.current = true;
    if (e.button === 2) isRightDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!canvas || !camera || !scene) return;

    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Orbit Rotation (Left click drag)
    if (isDraggingRef.current) {
      cameraSphericalRef.current.theta -= deltaX * 0.007;
      cameraSphericalRef.current.phi = Math.max(
        0.05,
        Math.min(Math.PI - 0.05, cameraSphericalRef.current.phi - deltaY * 0.007)
      );
      updateCameraPosition();
      return;
    }

    // Pan (Right click drag)
    if (isRightDraggingRef.current) {
      const panSpeed = 0.008;
      const right = new THREE.Vector3().crossVectors(camera.up, camera.getWorldDirection(new THREE.Vector3())).normalize();
      cameraTargetRef.current.addScaledVector(right, deltaX * panSpeed);
      cameraTargetRef.current.y += deltaY * panSpeed;
      updateCameraPosition();
      return;
    }

    // Hover Raycasting for 3D Landmark Pins
    if (showLandmarks && toothModelGroupRef.current) {
      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const pinsGroup = toothModelGroupRef.current.getObjectByName('landmarkPins');
      if (pinsGroup) {
        const intersects = raycaster.intersectObjects(pinsGroup.children, true);
        if (intersects.length > 0) {
          // Find parent markerGroup
          let obj: THREE.Object3D | null = intersects[0].object;
          while (obj && !obj.userData?.isLandmark && obj !== pinsGroup) {
            obj = obj.parent;
          }
          if (obj && obj.userData?.landmarkId) {
            const foundLandmark = tooth.landmarks.find((l) => l.id === obj?.userData.landmarkId);
            setHoveredLandmark(foundLandmark || null);
            return;
          }
        }
      }
      setHoveredLandmark(null);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isRightDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.003;
    cameraSphericalRef.current.radius = Math.max(
      3.2,
      Math.min(14.0, cameraSphericalRef.current.radius + zoomDelta)
    );
    updateCameraPosition();
  };

  // Click on Canvas: Pick Landmark or Quiz Model part
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    if (!canvas || !camera || !toothModelGroupRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // 1. Check Landmark Pins
    if (showLandmarks) {
      const pinsGroup = toothModelGroupRef.current.getObjectByName('landmarkPins');
      if (pinsGroup) {
        const intersects = raycaster.intersectObjects(pinsGroup.children, true);
        if (intersects.length > 0) {
          let obj: THREE.Object3D | null = intersects[0].object;
          while (obj && !obj.userData?.isLandmark && obj !== pinsGroup) {
            obj = obj.parent;
          }
          if (obj && obj.userData?.landmarkId) {
            const found = tooth.landmarks.find((l) => l.id === obj?.userData.landmarkId);
            if (found) {
              onSelectLandmark(found);
              if (isQuizTargetPickActive && onModelPicked) {
                onModelPicked(found.name, found.id);
              }
              return;
            }
          }
        }
      }
    }

    // 2. Check Tooth Meshes (Quiz Click-on-Model mode)
    if (isQuizTargetPickActive && onModelPicked) {
      const intersects = raycaster.intersectObjects(toothModelGroupRef.current.children, true);
      if (intersects.length > 0) {
        const hit = intersects[0];
        const partName = hit.object.userData?.part || 'tooth_body';
        onModelPicked(partName);
      }
    }
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* 3D Canvas Viewport */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Overlay Badge: Selected Tooth Info */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none z-10">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-cyan-400 font-extrabold text-sm sm:text-base">
              FDI #{tooth.fdi}
            </span>
            <span className="font-mono text-slate-400 text-xs">
              (Univ #{tooth.universal})
            </span>
          </div>

          <span className="w-1 h-3.5 bg-slate-700 rounded-full" />

          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              {tooth.name}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 font-semibold">
              {tooth.arch} • {tooth.side}
            </span>
          </div>
        </div>

        {/* Current Learning Mode Pill */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 text-[11px] font-medium shadow-md">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="capitalize">{learningMode.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Top Right Quick Controls: Reset, Fullscreen */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
        <button
          onClick={() => setCameraViewPreset('buccal')}
          title="Reset Camera View"
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition shadow-lg"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" />
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition shadow-lg"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating 3D Landmark Hover Card / Selected Landmark Info */}
      {(hoveredLandmark || activeLandmarkId) && (
        <div className="absolute top-16 left-3 max-w-xs sm:max-w-sm bg-slate-900/95 backdrop-blur-xl border border-cyan-500/50 p-3 rounded-xl shadow-2xl z-20 transition-all duration-200">
          {(() => {
            const landmark =
              hoveredLandmark || tooth.landmarks.find((l) => l.id === activeLandmarkId);
            if (!landmark) return null;

            return (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                    <span className="text-xs font-bold text-white">{landmark.name}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {landmark.category}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {landmark.description}
                </p>

                <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5 flex items-start gap-1">
                  <span className="font-semibold text-cyan-400 shrink-0">Clinical Pearl:</span>
                  <span>{landmark.clinicalSignificance}</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Measurement Mode Dimensions Overlay */}
      {isMeasurementActive && (
        <div className="absolute top-16 right-3 bg-slate-900/95 backdrop-blur-xl border border-sky-500/50 p-3 rounded-xl shadow-2xl z-20 text-xs text-slate-200 space-y-2 max-w-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="font-bold text-sky-400 flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5" /> Digital Dental Caliper
            </span>
            <span className="text-[10px] font-mono text-slate-400">Wheeler's 10th Ed.</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Crown Length:</span>
              <span className="font-mono font-bold text-white">{tooth.crownDimensions.lengthMm} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Root Length:</span>
              <span className="font-mono font-bold text-amber-400">{tooth.crownDimensions.rootLengthMm} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mesiodistal Width:</span>
              <span className="font-mono font-bold text-white">{tooth.crownDimensions.mesiodistalMm} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Buccolingual Depth:</span>
              <span className="font-mono font-bold text-white">{tooth.crownDimensions.buccolingualMm} mm</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1 text-slate-300">
              <span>Crown-to-Root Ratio:</span>
              <span className="font-mono font-bold text-cyan-300">
                1 : {(tooth.crownDimensions.rootLengthMm / tooth.crownDimensions.lengthMm).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Pick Target Notice Banner */}
      {isQuizTargetPickActive && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-amber-500/90 text-slate-950 px-4 py-1.5 rounded-full font-bold text-xs shadow-xl flex items-center gap-2 z-20 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Quiz: Click directly on the requested structure on the 3D model!</span>
        </div>
      )}

      {/* Interactive Floating Camera View Presets Bar (Right/Bottom) */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
        {/* Anatomical Camera View Presets */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1 rounded-xl shadow-xl pointer-events-auto overflow-x-auto custom-scrollbar">
          {(
            [
              { id: 'buccal', label: 'Buccal' },
              { id: 'lingual', label: 'Lingual' },
              { id: 'mesial', label: 'Mesial' },
              { id: 'distal', label: 'Distal' },
              { id: 'occlusal', label: 'Occlusal' },
              { id: 'apical', label: 'Apical / Root' }
            ] as const
          ).map((preset) => (
            <button
              key={preset.id}
              onClick={() => setCameraViewPreset(preset.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
                activePreset === preset.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Learning Mode Quick Toggles & Landmarks */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Show / Hide Landmarks */}
          <button
            onClick={onToggleLandmarks}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition shadow-lg ${
              showLandmarks
                ? 'bg-cyan-600/30 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/50'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {showLandmarks ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>Landmarks ({tooth.landmarks.length})</span>
          </button>

          {/* Caliper Measurement Toggle */}
          <button
            onClick={onToggleMeasurement}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition shadow-lg ${
              isMeasurementActive
                ? 'bg-sky-600/30 border-sky-400 text-sky-300 ring-1 ring-sky-400/50'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Caliper</span>
          </button>
        </div>
      </div>
    </div>
  );
};
