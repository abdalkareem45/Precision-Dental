import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Layers,
  RotateCcw,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Eye,
  Sliders,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  createHumanPremolar,
  createHumanMolar,
  createAnatomicalGingiva,
  createAnatomicalAlveolarBone,
  createDentalMaterials
} from '../utils/dentalAnatomy3D';

export type BoneDefectType =
  | 'healthy'
  | 'mild_horizontal'
  | 'moderate_horizontal'
  | 'severe_horizontal'
  | 'vertical_angular_mesial'
  | 'interdental_crater'
  | 'furcation_class2'
  | 'furcation_class3';

interface MultiToothSandboxProps {
  onProbeChange?: (tooth: string, site: string, pd: number, cal: number) => void;
  externalDefect?: BoneDefectType;
}

export const MultiToothSandbox: React.FC<MultiToothSandboxProps> = ({
  onProbeChange,
  externalDefect
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [defectType, setDefectType] = useState<BoneDefectType>(externalDefect || 'moderate_horizontal');
  const [layerVisibility, setLayerVisibility] = useState<'all' | 'cross_section' | 'translucent_gingiva' | 'bone_pdl_only' | 'xray'>('all');
  const [selectedTooth, setSelectedTooth] = useState<'t15' | 't16' | 't17'>('t16');
  const [selectedSite, setSelectedSite] = useState<'mesial' | 'mid_buccal' | 'distal'>('mesial');
  const [probeDepthMm, setProbeDepthMm] = useState<number>(5.5);
  const [recessionMm, setRecessionMm] = useState<number>(1.0);
  const [probingForce, setProbingForce] = useState<number>(0.22); // 0.20 - 0.25 N

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const probeMeshRef = useRef<THREE.Group | null>(null);

  // Sync external defect prop if provided
  useEffect(() => {
    if (externalDefect) {
      setDefectType(externalDefect);
    }
  }, [externalDefect]);

  // Adjust probe depth according to defect type
  useEffect(() => {
    switch (defectType) {
      case 'healthy':
        setProbeDepthMm(2.0);
        setRecessionMm(0);
        break;
      case 'mild_horizontal':
        setProbeDepthMm(4.0);
        setRecessionMm(0.5);
        break;
      case 'moderate_horizontal':
        setProbeDepthMm(5.5);
        setRecessionMm(1.0);
        break;
      case 'severe_horizontal':
        setProbeDepthMm(7.5);
        setRecessionMm(2.0);
        break;
      case 'vertical_angular_mesial':
        setProbeDepthMm(8.5);
        setRecessionMm(1.5);
        break;
      case 'interdental_crater':
        setProbeDepthMm(6.5);
        setRecessionMm(1.0);
        break;
      case 'furcation_class2':
        setProbeDepthMm(6.0);
        setRecessionMm(1.5);
        break;
      case 'furcation_class3':
        setProbeDepthMm(9.0);
        setRecessionMm(2.5);
        break;
    }
  }, [defectType]);

  const calculatedCAL = Math.max(0, probeDepthMm + recessionMm);

  useEffect(() => {
    if (onProbeChange) {
      onProbeChange(selectedTooth, selectedSite, probeDepthMm, calculatedCAL);
    }
  }, [selectedTooth, selectedSite, probeDepthMm, calculatedCAL, onProbeChange]);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 10.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Realistic Surgical Studio Lights & Optical Reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfffbf0, 0x1e293b, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.75);
    rimLight.position.set(-8, 3, -6);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xfda4af, 0.45);
    fillLight.position.set(0, -6, 5);
    scene.add(fillLight);

    // Grid Floor
    const grid = new THREE.GridHelper(16, 32, 0x1e293b, 0x0f172a);
    grid.position.y = -4.2;
    scene.add(grid);

    // Root Group
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    rebuildAnatomicalArch(rootGroup, defectType, layerVisibility);

    // Build UNC-15 Calibrated Probe
    const probe = createUNC15Probe();
    probeMeshRef.current = probe;
    scene.add(probe);
    updateProbePosition(probe, selectedTooth, selectedSite, probeDepthMm, recessionMm);

    // Smooth Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let spherical = { radius: 10.2, theta: 0.08, phi: Math.PI / 2.3 };

    const updateCamera = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, -0.2, 0);
    };
    updateCamera();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      spherical.theta -= (e.clientX - prevMouse.x) * 0.007;
      spherical.phi = Math.max(0.15, Math.min(Math.PI - 0.15, spherical.phi - (e.clientY - prevMouse.y) * 0.007));
      updateCamera();
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => (isDragging = false);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(5, Math.min(18, spherical.radius + e.deltaY * 0.006));
      updateCamera();
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('mousedown', onMouseDown);
      dom.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // Rebuild 3D model on defect or layer changes
  useEffect(() => {
    if (rootGroupRef.current) {
      rebuildAnatomicalArch(rootGroupRef.current, defectType, layerVisibility);
    }
  }, [defectType, layerVisibility]);

  // Update probe position when tooth, site, depth, or recession changes
  useEffect(() => {
    if (probeMeshRef.current) {
      updateProbePosition(probeMeshRef.current, selectedTooth, selectedSite, probeDepthMm, recessionMm);
    }
  }, [selectedTooth, selectedSite, probeDepthMm, recessionMm]);

  // Rebuild the anatomically realistic multi-tooth arch segment
  const rebuildAnatomicalArch = (
    group: THREE.Group,
    defect: BoneDefectType,
    layer: 'all' | 'cross_section' | 'translucent_gingiva' | 'bone_pdl_only' | 'xray'
  ) => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    const isCut = layer === 'cross_section';
    const isInflamed = defect !== 'healthy';

    // 1. Human Tooth #15 (Maxillary 2nd Premolar) at x = -2.6
    const t15 = createHumanPremolar({ layerMode: layer, isCut });
    t15.position.set(-2.6, 0, 0);
    group.add(t15);

    // 2. Human Tooth #16 (Maxillary 1st Molar with genuine cusps, oblique ridge, & diverging roots) at x = 0.0
    const furcGrade =
      defect === 'furcation_class2' ? 'Grade II' :
      defect === 'furcation_class3' ? 'Grade III' : 'None';

    const t16 = createHumanMolar({
      isMandibular: false, // Maxillary 1st Molar
      furcationGrade: furcGrade,
      layerMode: layer,
      isCut
    });
    t16.position.set(0, 0, 0);
    group.add(t16);

    // 3. Human Tooth #17 (Maxillary 2nd Molar) at x = +2.6
    const t17 = createHumanMolar({
      isMandibular: false,
      furcationGrade: 'None',
      layerMode: layer,
      isCut
    });
    t17.position.set(2.6, 0, 0);
    group.add(t17);

    // 4. Anatomical Alveolar Bone (with interdental septa & defects)
    const bone = createAnatomicalAlveolarBone({
      toothPositions: [-2.6, 0, 2.6],
      defectType: defect,
      layerMode: layer
    });
    group.add(bone);

    // 5. Anatomical Scalloped Gingiva (with interdental papillae embracing tooth cervical lines)
    if (layer !== 'bone_pdl_only') {
      const recessionLevel =
        defect === 'healthy' ? 0 :
        defect === 'mild_horizontal' ? 0.5 :
        defect === 'moderate_horizontal' ? 1.0 :
        defect === 'severe_horizontal' ? 2.0 : 1.2;

      const gingiva = createAnatomicalGingiva({
        toothPositions: [-2.6, 0, 2.6],
        recessionLevel,
        isInflamed,
        layerMode: layer
      });
      group.add(gingiva);
    }
  };

  // Build the Calibrated Periodontal Probe (UNC-15)
  const createUNC15Probe = () => {
    const probeGroup = new THREE.Group();

    // Metallic Knurled Handle
    const handleGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.8, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = 3.4;
    probeGroup.add(handle);

    // Angled Shank
    const shankGeo = new THREE.CylinderGeometry(0.045, 0.05, 1.3, 16);
    const shankMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.15 });
    const shank = new THREE.Mesh(shankGeo, shankMat);
    shank.position.set(0.05, 1.15, 0);
    shank.rotation.z = -0.1;
    probeGroup.add(shank);

    // Calibrated Tip Segments (15 mm length, alternating black bands at 4-5mm, 9-10mm, 14-15mm)
    const totalMm = 15;
    const mmScale = 0.13;

    for (let mm = 0; mm < totalMm; mm++) {
      const isBlack =
        (mm >= 3 && mm < 5) ||
        (mm >= 8 && mm < 10) ||
        (mm >= 13 && mm < 15);

      const segGeo = new THREE.CylinderGeometry(0.026, 0.026, mmScale, 12);
      const segMat = new THREE.MeshStandardMaterial({
        color: isBlack ? 0x0f172a : 0xf1f5f9,
        metalness: isBlack ? 0.3 : 0.85,
        roughness: isBlack ? 0.6 : 0.2
      });
      const seg = new THREE.Mesh(segGeo, segMat);
      seg.position.y = -(mm * mmScale) - mmScale / 2;
      probeGroup.add(seg);
    }

    // Atraumatic 0.5mm hemispherical probe tip
    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
    );
    tip.position.y = -(totalMm * mmScale);
    probeGroup.add(tip);

    return probeGroup;
  };

  // Update Probe position to target tooth & site
  const updateProbePosition = (
    probe: THREE.Group,
    tooth: 't15' | 't16' | 't17',
    site: 'mesial' | 'mid_buccal' | 'distal',
    pd: number,
    rec: number
  ) => {
    let toothX = 0;
    if (tooth === 't15') toothX = -2.6;
    else if (tooth === 't16') toothX = 0.0;
    else if (tooth === 't17') toothX = 2.6;

    let siteXOffset = 0;
    let siteZ = 1.15;
    if (site === 'mesial') {
      siteXOffset = -0.7;
      siteZ = 0.95;
    } else if (site === 'mid_buccal') {
      siteXOffset = 0.0;
      siteZ = 1.25;
    } else if (site === 'distal') {
      siteXOffset = 0.7;
      siteZ = 0.95;
    }

    const mmScale = 0.13;
    const baseY = -0.2 - (rec * mmScale * 0.4) - (pd * mmScale * 0.6);
    probe.position.set(toothX + siteXOffset, baseY + 1.95, siteZ);
    probe.rotation.z = site === 'mesial' ? -0.08 : site === 'distal' ? 0.08 : 0.03;
  };

  const setViewAngle = (angle: 'buccal' | 'mesial' | 'occlusal' | 'interproximal') => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    if (angle === 'buccal') cam.position.set(0, 0.5, 9.5);
    else if (angle === 'mesial') cam.position.set(9.5, 0.5, 0.5);
    else if (angle === 'occlusal') cam.position.set(0, 9.5, 0.5);
    else if (angle === 'interproximal') cam.position.set(4.5, 2.5, 7.5);
    cam.lookAt(0, -0.2, 0);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full w-full">
      {/* 3D Multi-Tooth Viewport */}
      <div className="relative flex-1 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
        {/* Top Floating Controls */}
        <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Human Arch Segment (#15 Premolar, #16 Molar, #17 Molar)
            </span>

            <span className="bg-emerald-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-emerald-700/60 text-xs font-semibold text-emerald-300 hidden sm:flex items-center gap-1 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              CEJ: Hard Tissue
            </span>

            <span className="bg-pink-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-pink-700/60 text-xs font-semibold text-pink-300 hidden sm:flex items-center gap-1 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span>
              GM: Soft Tissue
            </span>
          </div>

          {/* Camera View Angle Buttons */}
          <div className="flex items-center gap-1 pointer-events-auto bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/70 shadow-lg text-xs">
            <button
              onClick={() => setViewAngle('buccal')}
              className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              Buccal
            </button>
            <button
              onClick={() => setViewAngle('interproximal')}
              className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              Interproximal
            </button>
            <button
              onClick={() => setViewAngle('occlusal')}
              className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              Occlusal
            </button>
            <button
              onClick={() => setViewAngle('mesial')}
              className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              Side Mesial
            </button>
          </div>
        </div>

        {/* Live HUD Floating Readout */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-auto bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-2xl text-xs max-w-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Periodontal Probe Reading
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">Tooth #{selectedTooth === 't15' ? '15' : selectedTooth === 't16' ? '16' : '17'} • {selectedSite}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-pink-500/20">
              <div className="text-[10px] text-slate-400 font-medium">Pocket Depth (PD)</div>
              <div className="text-2xl font-black text-pink-400 font-mono">{probeDepthMm} mm</div>
              <div className="text-[9px] text-slate-500">Margin to Base</div>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-emerald-500/20">
              <div className="text-[10px] text-slate-400 font-medium">Attachment Loss (CAL)</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">{calculatedCAL} mm</div>
              <div className="text-[9px] text-slate-500">CEJ to Base</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Probing Force:</span>
            <span className={`font-mono font-bold ${probingForce >= 0.20 && probingForce <= 0.25 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {probingForce.toFixed(2)} N ({probingForce >= 0.20 && probingForce <= 0.25 ? 'Standardized' : 'Warning'})
            </span>
          </div>
        </div>

        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing flex-1" />

        <div className="absolute bottom-3 right-3 pointer-events-none text-[11px] text-slate-400 bg-slate-900/70 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800">
          Rotate with mouse / touch • Scroll to zoom
        </div>
      </div>

      {/* Right Control Column */}
      <div className="w-full lg:w-96 bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
        {/* Target Tooth & Site Selector */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
            Select Active Probing Site
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-mono font-bold">
            <button
              onClick={() => setSelectedTooth('t15')}
              className={`py-2 rounded-xl border transition ${
                selectedTooth === 't15' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              #15 Premolar
            </button>
            <button
              onClick={() => setSelectedTooth('t16')}
              className={`py-2 rounded-xl border transition ${
                selectedTooth === 't16' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              #16 1st Molar
            </button>
            <button
              onClick={() => setSelectedTooth('t17')}
              className={`py-2 rounded-xl border transition ${
                selectedTooth === 't17' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              #17 2nd Molar
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-xs pt-1">
            {(['mesial', 'mid_buccal', 'distal'] as const).map((site) => (
              <button
                key={site}
                onClick={() => setSelectedSite(site)}
                className={`py-1.5 capitalize rounded-lg border transition ${
                  selectedSite === site ? 'bg-cyan-600 text-white border-cyan-500 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {site.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Probing Depth & Recession Sliders */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-200">
            <span>Probe Sulcus Depth (PD)</span>
            <span className="font-mono text-pink-400 font-bold">{probeDepthMm} mm</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={probeDepthMm}
            onChange={(e) => setProbeDepthMm(parseFloat(e.target.value))}
            className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between items-center text-xs font-semibold text-slate-200 pt-1">
            <span>Gingival Recession / Edema</span>
            <span className="font-mono text-emerald-400 font-bold">
              {recessionMm > 0 ? `+${recessionMm} mm Rec` : recessionMm < 0 ? `${recessionMm} mm Edema` : '0 mm (At CEJ)'}
            </span>
          </div>
          <input
            type="range"
            min="-2"
            max="6"
            step="0.5"
            value={recessionMm}
            onChange={(e) => setRecessionMm(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Bone Destruction & Pathology Presets */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
            Bone Destruction &amp; Defect Modes
          </span>

          <div className="space-y-1.5 text-xs">
            {[
              { id: 'healthy', label: 'Clinically Healthy Periodontium', desc: 'Bone crest 1.5mm apical to CEJ' },
              { id: 'mild_horizontal', label: 'Stage I: Mild Horizontal Loss', desc: 'CAL 1–2mm, RBL <15%' },
              { id: 'moderate_horizontal', label: 'Stage II: Moderate Horizontal Loss', desc: 'CAL 3–4mm, RBL 15%–33%' },
              { id: 'severe_horizontal', label: 'Stage III/IV: Severe Bone Loss', desc: 'CAL ≥5mm, middle/apical third' },
              { id: 'vertical_angular_mesial', label: 'Vertical (Angular) Infrabony Defect', desc: '≥3mm vertical crater at #16 mesial' },
              { id: 'interdental_crater', label: 'Interdental Bone Crater', desc: 'Bony trough between #15 and #16' },
              { id: 'furcation_class2', label: 'Furcation Invasion (Glickman Gr II)', desc: 'Cul-de-sac catch on #16 roots' },
              { id: 'furcation_class3', label: 'Furcation Invasion (Glickman Gr III)', desc: 'Through-and-through interradicular tunnel' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setDefectType(item.id as BoneDefectType)}
                className={`w-full text-left p-2.5 rounded-xl border transition flex flex-col gap-0.5 cursor-pointer ${
                  defectType === item.id
                    ? 'bg-blue-900/50 border-blue-500 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="font-semibold flex items-center justify-between">
                  <span>{item.label}</span>
                  {defectType === item.id && <span className="w-2 h-2 rounded-full bg-blue-400"></span>}
                </div>
                <div className="text-[11px] text-slate-400">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Layer Visibility Modes */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
          <span className="font-bold text-slate-300 block">Anatomical Layer Mode</span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'all', label: 'Full Render' },
              { id: 'cross_section', label: 'Sagittal Cut' },
              { id: 'translucent_gingiva', label: 'Transparent Gums' },
              { id: 'bone_pdl_only', label: 'Bone & PDL Only' },
              { id: 'xray', label: 'X-Ray Wireframe' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setLayerVisibility(m.id as any)}
                className={`py-1.5 px-2 rounded-lg border text-center transition text-[11px] ${
                  layerVisibility === m.id
                    ? 'bg-cyan-900/60 border-cyan-400 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
