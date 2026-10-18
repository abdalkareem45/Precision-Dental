import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Flame,
  Activity,
  Layers,
  RotateCcw,
  Eye,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
  Sparkles,
  ShieldAlert,
  Compass,
  ArrowRight,
  TrendingDown,
  ZoomIn,
  ZoomOut,
  Target
} from 'lucide-react';

interface Periodontal3DCrossSectionProps {
  height?: string;
  initialInflammation?: number; // 0 to 100
}

export const Periodontal3DCrossSection: React.FC<Periodontal3DCrossSectionProps> = ({
  height = '600px',
  initialInflammation = 45
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [inflammationLevel, setInflammationLevel] = useState<number>(initialInflammation); // 0 (health) -> 100 (severe periodontitis)
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<'all' | 'bone' | 'pdl' | 'vessels' | 'infiltrate' | 'biofilm'>('all');
  const [selectedTissue, setSelectedTissue] = useState<string>('crestal_bone');
  const [showRadiusOfAction, setShowRadiusOfAction] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Group | null>(null);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  // Compute histological and destruction markers in real-time
  const getDestructionMetrics = (level: number) => {
    const boneLossMm = (level * 0.065).toFixed(1); // 0 to 6.5 mm
    const pdlDetachmentMm = (level * 0.072).toFixed(1); // 0 to 7.2 mm
    const pocketDepthMm = (1.5 + level * 0.065).toFixed(1); // 1.5 mm normal up to 8.0 mm
    const osteoclastDensity = Math.round(1 + level * 0.52); // cells per high-power field (HPF)
    const collagenDegradationPct = Math.round(level * 0.88); // 0 to 88% degradation
    const ranklOpgRatio = (0.8 + level * 0.13).toFixed(1); // 0.8:1 up to ~13.8:1
    const gcfFlowRate = (0.2 + level * 0.045).toFixed(2); // 0.2 µL/min up to 4.7 µL/min

    let stageTitle = 'Pristine Physiological Health';
    let stageColor = 'text-emerald-400';
    let stageBg = 'bg-emerald-950/80 border-emerald-800';
    let histStage = 'Stage 0: Homeostatic Integrity';
    let cytokineIndex = 'Basal Homeostasis (TGF-β, IL-10, intact OPG protective veil)';

    if (level > 0 && level <= 20) {
      stageTitle = 'Initial Gingival Lesion (2–4 Days)';
      stageColor = 'text-teal-400';
      stageBg = 'bg-teal-950/80 border-teal-800';
      histStage = 'Page & Schroeder Initial Lesion';
      cytokineIndex = 'Vasodilation, PMN transmigration into junctional epithelium, GCF elevation';
    } else if (level > 20 && level <= 45) {
      stageTitle = 'Early / Established Gingivitis (4–21 Days)';
      stageColor = 'text-[#C9A24B]';
      stageBg = 'bg-[#0B1F4D] border-[#C9A24B]/50';
      histStage = 'Page & Schroeder Established Lesion (Reversible)';
      cytokineIndex = 'Dense plasma cell infiltrate, transseptal fiber matrix loss, MMP-8 activation without bone loss';
    } else if (level > 45 && level <= 75) {
      stageTitle = 'Moderate Periodontitis (Active Bone Resorption)';
      stageColor = 'text-amber-400';
      stageBg = 'bg-amber-950/80 border-amber-800';
      histStage = 'Page & Schroeder Advanced Lesion (Irreversible)';
      cytokineIndex = 'Critical RANKL/OPG imbalance, IL-1β, TNF-α, PGE2, Howship lacunae osteoclast excavation';
    } else if (level > 75) {
      stageTitle = 'Advanced / Severe Periodontitis (Terminal Collapse)';
      stageColor = 'text-rose-400';
      stageBg = 'bg-rose-950/80 border-rose-800';
      histStage = 'Severe Infrabony / Furcation Breakdown';
      cytokineIndex = 'Massive osteoclastic storm, profound Sharpey fiber lysis, deep infrabony pocketing';
    }

    return {
      boneLossMm,
      pdlDetachmentMm,
      pocketDepthMm,
      osteoclastDensity,
      collagenDegradationPct,
      ranklOpgRatio,
      gcfFlowRate,
      stageTitle,
      stageColor,
      stageBg,
      histStage,
      cytokineIndex
    };
  };

  const metrics = getDestructionMetrics(inflammationLevel);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x071433); // Precision Dental Deep Navy dark background

    // Camera - OPTIMIZED CLOSE-UP MACRO VIEW (Directly framed on the dentogingival junction & alveolar crest)
    const camera = new THREE.PerspectiveCamera(
      32,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    // Position camera tight on target area (close zoom ~1.42 units, perfectly centered)
    camera.position.set(0.48, 0.12, 1.45);
    camera.lookAt(0.38, -0.06, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 1.3);
    fillLight.position.set(-4, -1, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xC9A24B, 1.8);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Root Group
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, 0, 0);
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    // Particles Group for inflammatory exudate
    const particlesGroup = new THREE.Group();
    rootGroup.add(particlesGroup);
    particlesGroupRef.current = particlesGroup;

    // Build initial 3D cross-section
    buildRealisticCrossSection(
      rootGroup,
      particlesGroup,
      inflammationLevel,
      activeLayer,
      showRadiusOfAction,
      selectedTissue
    );

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotate && rootGroup) {
        rootGroup.rotation.y += 0.005;
      }

      // Animate flowing inflammatory cells
      if (particlesGroup && particlesGroup.children.length > 0) {
        particlesGroup.children.forEach((p, idx) => {
          p.position.y += Math.sin(elapsedTime * 2.5 + idx) * 0.0018;
          if (p instanceof THREE.Mesh && p.material instanceof THREE.MeshBasicMaterial) {
            p.material.opacity = 0.45 + Math.sin(elapsedTime * 3.5 + idx * 0.5) * 0.35;
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse Controls for smooth Orbit Inspection
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !rootGroup) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      rootGroup.rotation.y += dx * 0.008;
      rootGroup.rotation.x = Math.max(-0.5, Math.min(0.5, rootGroup.rotation.x + dy * 0.008));
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      // Close macro zoom range: 0.95 to 2.4 (never too far out!)
      const newZ = Math.max(0.95, Math.min(2.4, cameraRef.current.position.z + e.deltaY * 0.002));
      cameraRef.current.position.z = newZ;
    };

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  // Update geometry when inflammation level, active layer, or hotspot selection changes
  useEffect(() => {
    if (rootGroupRef.current && particlesGroupRef.current) {
      buildRealisticCrossSection(
        rootGroupRef.current,
        particlesGroupRef.current,
        inflammationLevel,
        activeLayer,
        showRadiusOfAction,
        selectedTissue
      );
    }
  }, [inflammationLevel, activeLayer, showRadiusOfAction, selectedTissue]);

  const resetCamera = () => {
    if (cameraRef.current && rootGroupRef.current) {
      cameraRef.current.position.set(0.48, 0.12, 1.45);
      cameraRef.current.lookAt(0.38, -0.06, 0);
      rootGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  const setCameraPreset = (preset: 'crest' | 'pocket' | 'overview') => {
    if (!cameraRef.current || !rootGroupRef.current) return;
    rootGroupRef.current.rotation.set(0, 0, 0);
    if (preset === 'crest') {
      // Super close-up on crest & Howship lacunae
      cameraRef.current.position.set(0.42, -0.05, 1.15);
      cameraRef.current.lookAt(0.40, -0.15, 0);
    } else if (preset === 'pocket') {
      // Focused on sulcus, JE, and CEJ
      cameraRef.current.position.set(0.40, 0.20, 1.20);
      cameraRef.current.lookAt(0.38, 0.10, 0);
    } else {
      // Balanced Macro overview
      cameraRef.current.position.set(0.48, 0.12, 1.45);
      cameraRef.current.lookAt(0.38, -0.06, 0);
    }
  };

  const zoomCamera = (dir: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = dir === 'in' ? -0.2 : 0.2;
    cameraRef.current.position.z = Math.max(0.95, Math.min(2.4, cameraRef.current.position.z + delta));
  };

  return (
    <div className="space-y-4 text-[#FAF8F3] font-sans">
      {/* 3D Viewport Header with Precision Dental Branding */}
      <div className="bg-[#071433] border border-[#E6E8EC]/20 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold">
              Precision Dental • High-Magnification 3D Histological Cross-Section
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#FAF8F3] mt-0.5 font-sans">
            Interactive 3D Periodontal Tissue Anatomy &amp; Destruction Lab
          </h3>
          <p className="text-xs text-[#E6E8EC]/80 max-w-2xl mt-0.5">
            Microscopic anatomical slice displaying translucent enamel, dentinal tubules, vascular pulp canal,
            cementum, cribriform lamina dura, Howship lacunae osteoclastic resorption, and the 1.5–2.5 mm bacterial radius of action.
          </p>
        </div>

        {/* Dynamic Status Badge */}
        <div className={`px-4 py-2.5 rounded-2xl border ${metrics.stageBg} shrink-0 shadow-md`}>
          <span className="text-[10px] font-mono text-[#E6E8EC]/70 block">{metrics.histStage}</span>
          <span className={`text-xs font-black ${metrics.stageColor} block mt-0.5`}>
            {metrics.stageTitle}
          </span>
        </div>
      </div>

      {/* Main 3D Canvas + Real-Time Destruction Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Three.js Canvas Container (7 cols) */}
        <div
          className="lg:col-span-7 relative bg-[#071433] rounded-3xl border border-[#E6E8EC]/20 overflow-hidden shadow-2xl flex flex-col"
          style={{ minHeight: height }}
        >
          <div
            ref={mountRef}
            className="w-full flex-1 cursor-grab active:cursor-grabbing"
            style={{ minHeight: height }}
          />

          {/* Canvas Floating Overlay Controls */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
            <div className="px-3 py-1 rounded-xl bg-[#0B1F4D]/95 backdrop-blur-md border border-[#C9A24B]/50 text-[#FAF8F3] font-bold text-xs flex items-center gap-2 shadow-xl">
              <Activity className="w-3.5 h-3.5 text-[#C9A24B] animate-pulse" />
              <span>Inflammation Burden: {inflammationLevel}%</span>
            </div>
            <div className="px-2.5 py-0.5 rounded-lg bg-[#071433]/90 backdrop-blur-sm border border-[#E6E8EC]/15 text-[11px] text-[#FAF8F3] font-mono">
              Alveolar Bone Loss: <strong className="text-rose-400">-{metrics.boneLossMm} mm</strong> · Pocket Depth: <strong className="text-[#C9A24B]">{metrics.pocketDepthMm} mm</strong>
            </div>
            {showRadiusOfAction && (
              <div className="px-2.5 py-0.5 rounded-lg bg-[#1B3A8C]/90 border border-[#C9A24B]/60 text-[10px] text-[#dfbe6e] font-mono flex items-center gap-1.5">
                <Target className="w-3 h-3 text-[#C9A24B]" />
                <span>Bacterial Radius of Action: 1.5–2.5 mm Active Sphere</span>
              </div>
            )}
          </div>

          {/* Quick HUD Zoom & Camera Controls */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 flex-wrap justify-end">
            {/* View Presets */}
            <div className="hidden sm:flex items-center gap-1 bg-[#0B1F4D]/90 p-1 rounded-xl border border-[#E6E8EC]/20 text-[10px] font-mono">
              <button
                onClick={() => setCameraPreset('crest')}
                className="px-2 py-0.5 rounded-lg hover:bg-[#1B3A8C] text-[#E6E8EC] hover:text-white"
                title="Focus Crest & Osteoclasts"
              >
                Crest Focus
              </button>
              <button
                onClick={() => setCameraPreset('pocket')}
                className="px-2 py-0.5 rounded-lg hover:bg-[#1B3A8C] text-[#E6E8EC] hover:text-white"
                title="Focus Sulcus & JE"
              >
                Pocket Focus
              </button>
              <button
                onClick={() => setCameraPreset('overview')}
                className="px-2 py-0.5 rounded-lg hover:bg-[#1B3A8C] text-[#E6E8EC] hover:text-white"
                title="Macro Overview"
              >
                Macro
              </button>
            </div>

            <button
              onClick={() => zoomCamera('in')}
              className="p-1.5 rounded-xl bg-[#0B1F4D]/90 border border-[#E6E8EC]/20 text-[#FAF8F3] hover:text-[#C9A24B]"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => zoomCamera('out')}
              className="p-1.5 rounded-xl bg-[#0B1F4D]/90 border border-[#E6E8EC]/20 text-[#FAF8F3] hover:text-[#C9A24B]"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowRadiusOfAction(!showRadiusOfAction)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition border ${
                showRadiusOfAction
                  ? 'bg-[#1B3A8C] text-[#FAF8F3] border-[#C9A24B]/70'
                  : 'bg-[#0B1F4D]/90 text-[#E6E8EC]/70 border-[#E6E8EC]/20'
              }`}
              title="Toggle bacterial radius of action sphere"
            >
              Radius: {showRadiusOfAction ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition border ${
                autoRotate
                  ? 'bg-[#C9A24B] text-[#0B1F4D] border-[#C9A24B]'
                  : 'bg-[#0B1F4D]/90 text-[#E6E8EC]/80 border-[#E6E8EC]/20 hover:text-white'
              }`}
            >
              {autoRotate ? 'Pause' : 'Spin 360°'}
            </button>
            <button
              onClick={resetCamera}
              className="p-1.5 rounded-xl bg-[#0B1F4D]/90 border border-[#E6E8EC]/20 text-[#E6E8EC] hover:text-[#C9A24B]"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom HUD: Layer Filter */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-1 p-2 bg-[#0B1F4D]/95 backdrop-blur-xl border border-[#E6E8EC]/20 rounded-2xl shadow-xl overflow-x-auto text-[11px]">
            <span className="text-[#C9A24B] font-bold px-1 hidden sm:inline">Highlight Layer:</span>
            <div className="flex gap-1 overflow-x-auto">
              {[
                { id: 'all', label: 'All Tissues' },
                { id: 'bone', label: 'Alveolar Bone' },
                { id: 'pdl', label: 'PDL Fibers' },
                { id: 'vessels', label: 'Vessels' },
                { id: 'infiltrate', label: 'Infiltrate' },
                { id: 'biofilm', label: 'Biofilm' }
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLayer(l.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-mono transition whitespace-nowrap ${
                    activeLayer === l.id
                      ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow'
                      : 'bg-[#071433] text-[#E6E8EC]/80 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-Time Interactive Controls & Tissue Destruction Markers (5 cols) */}
        <div className="lg:col-span-5 bg-[#071433] border border-[#E6E8EC]/20 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
          {/* Inflammation Slider Controller */}
          <div className="space-y-3 bg-[#0B1F4D] p-4 rounded-2xl border border-[#E6E8EC]/20 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FAF8F3] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <Sliders className="w-3.5 h-3.5 text-[#C9A24B]" />
                Inflammation Level Controller:
              </span>
              <span className={`text-xs font-mono font-bold ${metrics.stageColor}`}>
                {inflammationLevel}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={inflammationLevel}
              onChange={(e) => setInflammationLevel(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-[#071433] rounded-lg appearance-none cursor-pointer accent-[#C9A24B]"
            />

            <div className="flex justify-between text-[10px] font-mono text-[#E6E8EC]/70">
              <span className="text-emerald-400">0% (Health)</span>
              <span className="text-[#C9A24B]">30% (Gingivitis)</span>
              <span className="text-amber-400">65% (Moderate)</span>
              <span className="text-rose-400">100% (Severe)</span>
            </div>

            {/* Quick Step Buttons */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { label: 'Health', val: 0 },
                { label: 'Gingivitis', val: 30 },
                { label: 'Periodontitis', val: 65 },
                { label: 'Severe', val: 95 }
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => setInflammationLevel(btn.val)}
                  className={`py-1 rounded-lg text-[10px] font-mono transition border ${
                    inflammationLevel === btn.val
                      ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold border-[#C9A24B]'
                      : 'bg-[#071433] text-[#E6E8EC]/80 border-[#E6E8EC]/15 hover:border-[#C9A24B]/50'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Histological Markers Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#FAF8F3] uppercase tracking-wider block font-sans">
              Real-Time Cellular &amp; Tissue Destruction Markers:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
              <div className="p-2.5 rounded-xl bg-[#0B1F4D] border border-[#E6E8EC]/15 shadow-sm">
                <span className="text-[#E6E8EC]/70 block text-[10px]">Alveolar Bone Loss:</span>
                <span className="text-rose-400 font-black text-sm">
                  -{metrics.boneLossMm} mm
                </span>
                <span className="text-[9px] text-[#E6E8EC]/50 block mt-0.5">Apical Crest Resorption</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0B1F4D] border border-[#E6E8EC]/15 shadow-sm">
                <span className="text-[#E6E8EC]/70 block text-[10px]">Sharpey Fiber Loss:</span>
                <span className="text-amber-400 font-black text-sm">
                  {metrics.pdlDetachmentMm} mm
                </span>
                <span className="text-[9px] text-[#E6E8EC]/50 block mt-0.5">Collagen Detachment</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0B1F4D] border border-[#E6E8EC]/15 shadow-sm">
                <span className="text-[#E6E8EC]/70 block text-[10px]">Pocket Depth:</span>
                <span className="text-[#C9A24B] font-black text-sm">
                  {metrics.pocketDepthMm} mm
                </span>
                <span className="text-[9px] text-[#E6E8EC]/50 block mt-0.5">JE Apical Migration</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0B1F4D] border border-[#E6E8EC]/15 shadow-sm">
                <span className="text-[#E6E8EC]/70 block text-[10px]">Active Osteoclasts:</span>
                <span className="text-purple-300 font-black text-sm">
                  {metrics.osteoclastDensity} / HPF
                </span>
                <span className="text-[9px] text-[#E6E8EC]/50 block mt-0.5">In Howship Lacunae</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0B1F4D] border border-[#E6E8EC]/15 shadow-sm">
                <span className="text-[#E6E8EC]/70 block text-[10px]">Collagen Lysis:</span>
                <span className="text-rose-400 font-black text-sm">
                  {metrics.collagenDegradationPct}%
                </span>
                <span className="text-[9px] text-[#E6E8EC]/50 block mt-0.5">MMP-8 Collagenase</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0B1F4D] border border-[#E6E8EC]/15 shadow-sm">
                <span className="text-[#E6E8EC]/70 block text-[10px]">RANKL / OPG:</span>
                <span className="text-[#dfbe6e] font-black text-sm">
                  {metrics.ranklOpgRatio} : 1
                </span>
                <span className="text-[9px] text-[#E6E8EC]/50 block mt-0.5">Osteoclastogenic Ratio</span>
              </div>
            </div>

            {/* Cytokine Micro-environment Readout */}
            <div className="p-3 rounded-xl bg-[#0B1F4D] border border-[#C9A24B]/30 space-y-1 text-xs shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-[#C9A24B]">
                <Flame className="w-3.5 h-3.5" />
                <span>Cytokine &amp; Chemokine Microenvironment:</span>
              </div>
              <p className="text-[#FAF8F3]/90 text-[11px] leading-relaxed">
                {metrics.cytokineIndex}.
              </p>
            </div>
          </div>

          {/* Clickable Histological Structures */}
          <div className="space-y-2 pt-1 border-t border-[#E6E8EC]/15">
            <span className="text-xs font-bold text-[#FAF8F3] uppercase tracking-wider block font-sans">
              Clickable Anatomical Cross-Section Hotspots:
            </span>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              {[
                {
                  id: 'crestal_bone',
                  label: 'Alveolar Crest',
                  desc: 'Normally 1.5–2.0 mm apical to CEJ. Resorbs rapidly under osteoclastic attack.'
                },
                {
                  id: 'howship_lacunae',
                  label: 'Howship Lacunae',
                  desc: 'Microscopic erosion bays hollowed out by multi-nucleated osteoclasts with ruffled borders.'
                },
                {
                  id: 'pdl_fibers',
                  label: 'Sharpey Fibers',
                  desc: 'Extrinsic collagen fibers inserted into cementum and alveolar bone. Degraded by MMPs.'
                },
                {
                  id: 'biofilm_radius',
                  label: 'Radius of Action',
                  desc: 'Syllabus Page 6: Bacterial plaque acts within 1.5 mm to 2.5 mm radius. Beyond this, bone is unaffected.'
                }
              ].map((hotspot) => (
                <button
                  key={hotspot.id}
                  onClick={() => setSelectedTissue(hotspot.id)}
                  className={`p-2 rounded-xl text-left border transition ${
                    selectedTissue === hotspot.id
                      ? 'bg-[#1B3A8C] border-[#C9A24B] text-[#FAF8F3] shadow-md ring-1 ring-[#C9A24B]/60'
                      : 'bg-[#0B1F4D] border-[#E6E8EC]/15 text-[#E6E8EC]/70 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-[#C9A24B]">{hotspot.label}</div>
                  {selectedTissue === hotspot.id && (
                    <p className="text-[10px] text-[#FAF8F3] mt-1 leading-snug">{hotspot.desc}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// REALISTIC ANATOMICAL THREE.JS SAGITTAL CROSS-SECTION BUILDER
// =========================================================================

function buildRealisticCrossSection(
  rootGroup: THREE.Group,
  particlesGroup: THREE.Group,
  level: number,
  layerFilter: 'all' | 'bone' | 'pdl' | 'vessels' | 'infiltrate' | 'biofilm',
  showRadiusOfAction: boolean,
  selectedTissue: string
) {
  // Clear previous meshes safely
  while (rootGroup.children.length > 0) {
    const obj = rootGroup.children[0];
    rootGroup.remove(obj);
    if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
  }
  while (particlesGroup.children.length > 0) {
    particlesGroup.remove(particlesGroup.children[0]);
  }
  rootGroup.add(particlesGroup);

  const factor = level / 100; // 0 (healthy) to 1 (severe)
  const boneDrop = factor * 1.35; // Bone height loss in 3D units
  const pdlDrop = factor * 1.45; // Sharpey attachment loss

  // 1. ANATOMICAL TOOTH CROSS-SECTION (REALISTIC DENTAL HISTOLOGY)
  if (layerFilter === 'all' || layerFilter === 'bone' || layerFilter === 'pdl' || layerFilter === 'biofilm') {
    const toothGroup = new THREE.Group();

    // Natural Enamel Cap Material (translucent glossy crystal with subtle blue-white sheen)
    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
      transmission: 0.28,
      ior: 1.62
    });

    // Natural Dentin Material (warm ivory-yellow with organic density)
    const dentinMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.48,
      metalness: 0.04
    });

    // Cementum Sheath Material (golden mineralized layer on root face)
    const cementumMat = new THREE.MeshStandardMaterial({
      color: 0xdec08f,
      roughness: 0.65,
      metalness: 0.02
    });

    // Dental Pulp Tissue Material (hyper-vascular rich red with arterial branches)
    const pulpMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.35,
      metalness: 0.08
    });

    // A. Anatomical Crown Half (Sculpted organic cusp, central developmental groove, and cervical bulge)
    const crownShape = new THREE.Shape();
    crownShape.moveTo(0, 0.4); // CEJ on midline
    crownShape.quadraticCurveTo(0.48, 0.48, 0.52, 1.1); // Natural facial cervical ridge
    crownShape.quadraticCurveTo(0.48, 1.45, 0.38, 1.62); // Cusp slope
    crownShape.lineTo(0.32, 1.68); // Anatomical cusp tip
    crownShape.quadraticCurveTo(0.15, 1.60, 0, 1.52); // Central developmental fossa
    crownShape.lineTo(0, 0.4); // Midline cut
    crownShape.closePath();

    const crownGeo = new THREE.ExtrudeGeometry(crownShape, {
      depth: 0.72,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.05,
      bevelThickness: 0.05
    });
    crownGeo.translate(0, 0, -0.36);
    const crownMesh = new THREE.Mesh(crownGeo, enamelMat);
    toothGroup.add(crownMesh);

    // B. Anatomical Root Half (Organic root trunk tapering to apical foramen)
    const rootShape = new THREE.Shape();
    rootShape.moveTo(0, 0.4); // CEJ
    rootShape.quadraticCurveTo(0.44, 0.32, 0.42, -0.7); // Cervical third
    rootShape.quadraticCurveTo(0.38, -1.6, 0.14, -2.4); // Mid to apical third taper
    rootShape.lineTo(0, -2.4); // Apical foramen midline
    rootShape.lineTo(0, 0.4); // Midline slice
    rootShape.closePath();

    const rootGeo = new THREE.ExtrudeGeometry(rootShape, {
      depth: 0.72,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.04,
      bevelThickness: 0.04
    });
    rootGeo.translate(0, 0, -0.36);
    const rootMesh = new THREE.Mesh(rootGeo, dentinMat);
    toothGroup.add(rootMesh);

    // C. Root Outer Cementum Layer (Thin golden sheath lining root surface)
    const cementumGeo = new THREE.CylinderGeometry(0.49, 0.16, 2.7, 24, 1, true, 0, Math.PI);
    cementumGeo.translate(0, -1.02, 0);
    cementumGeo.rotateY(Math.PI / 2);
    const cementumMesh = new THREE.Mesh(cementumGeo, cementumMat);
    toothGroup.add(cementumMesh);

    // D. Dental Pulp Chamber & Root Canal
    const pulpCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.04, 1.25, 0), // Coronal pulp horn
      new THREE.Vector3(0.05, 0.4, 0),  // Pulp chamber
      new THREE.Vector3(0.04, -0.8, 0), // Radicular canal
      new THREE.Vector3(0.02, -2.3, 0)  // Apical foramen
    ]);
    const pulpGeo = new THREE.TubeGeometry(pulpCurve, 28, 0.065, 10, false);
    const pulpMesh = new THREE.Mesh(pulpGeo, pulpMat);
    toothGroup.add(pulpMesh);

    rootGroup.add(toothGroup);
  }

  // 2. PERIODONTAL LIGAMENT (PDL) & SHARPEY FIBERS
  const pdlAttachmentY = 0.35 - pdlDrop; // Coronal extent of Sharpey attachment
  if (layerFilter === 'all' || layerFilter === 'pdl') {
    const pdlGroup = new THREE.Group();

    // 0.22 mm PDL vascular space
    const pdlHeight = Math.max(0.4, 2.6 - pdlDrop);
    const pdlGeo = new THREE.CylinderGeometry(0.55, 0.22, pdlHeight, 20, 1, false, 0, Math.PI);
    pdlGeo.translate(0, -2.35 + pdlHeight / 2, 0);
    pdlGeo.rotateY(Math.PI / 2);

    const isPdlSelected = selectedTissue === 'pdl_fibers';
    const pdlMat = new THREE.MeshStandardMaterial({
      color: isPdlSelected ? 0x06b6d4 : factor > 0.4 ? 0xf43f5e : 0xf472b6,
      roughness: 0.6,
      transparent: true,
      opacity: isPdlSelected ? 0.92 : Math.max(0.38, 0.85 - factor * 0.45)
    });
    pdlGroup.add(new THREE.Mesh(pdlGeo, pdlMat));

    // Sharpey's Fiber Bundles (Principal Oblique fibers spanning cementum to bone)
    const numFibers = Math.max(2, Math.round(8 - factor * 6));
    const fiberMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: Math.max(0.25, 0.9 - factor * 0.5)
    });

    for (let f = 0; f < numFibers; f++) {
      const fiberGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.18, 6);
      fiberGeo.rotateZ(Math.PI / 3); // Oblique insertion
      const fiber = new THREE.Mesh(fiberGeo, fiberMat);
      fiber.position.set(0.48, -2.2 + f * 0.26, 0);
      pdlGroup.add(fiber);
    }

    rootGroup.add(pdlGroup);
  }

  // 3. REALISTIC ALVEOLAR BONE HOUSING (CORTICAL PLATE + SPONGIOSA + HOWSHIP LACUNAE)
  const boneTopY = 0.25 - boneDrop; // Crest level (normal: 1.5mm apical to CEJ at 0.4)
  if (layerFilter === 'all' || layerFilter === 'bone') {
    const boneGroup = new THREE.Group();

    // Natural bone color: Mineralized Ivory in health -> darker mottled resorptive beige
    const boneColor = new THREE.Color(0xf1e8d4).lerp(new THREE.Color(0xbfa068), factor * 0.45);
    const isBoneSelected = selectedTissue === 'crestal_bone';
    const boneMat = new THREE.MeshStandardMaterial({
      color: isBoneSelected ? new THREE.Color(0xC9A24B) : boneColor,
      roughness: 0.72,
      metalness: 0.06
    });

    // Anatomical alveolar socket profile
    const boneShape = new THREE.Shape();
    boneShape.moveTo(0.54, boneTopY); // Alveolar crest facing root (Lamina Dura coronal tip)
    boneShape.lineTo(1.85, boneTopY); // Alveolar crest plateau
    boneShape.quadraticCurveTo(1.95, -1.0, 1.8, -2.4); // Outer cortical plate
    boneShape.lineTo(0.28, -2.4); // Socket base
    boneShape.quadraticCurveTo(0.45, -1.4, 0.54, boneTopY); // Cribriform plate (lamina dura)
    boneShape.closePath();

    const boneGeo = new THREE.ExtrudeGeometry(boneShape, {
      depth: 0.72,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.04,
      bevelThickness: 0.04
    });
    boneGeo.translate(0, 0, -0.36);

    // Sculpt Howship lacunae erosion bays on crestal surface when inflammation is present
    if (factor > 0.08) {
      const pos = boneGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        if (y > boneTopY - 0.4 && x > 0.5 && x < 1.3) {
          const noise = Math.sin(x * 16) * Math.cos(z * 14) * (factor * 0.24);
          pos.setY(i, y - Math.abs(noise));
        }
      }
      boneGeo.computeVertexNormals();
    }

    const boneMesh = new THREE.Mesh(boneGeo, boneMat);
    boneGroup.add(boneMesh);

    // Spongy bone trabecular marrow spaces
    const marrowMat = new THREE.MeshBasicMaterial({ color: 0x854d0e, opacity: 0.55, transparent: true });
    for (let m = 0; m < 6; m++) {
      const mGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const mMesh = new THREE.Mesh(mGeo, marrowMat);
      mMesh.position.set(0.95 + (m % 2) * 0.35, boneTopY - 0.45 - m * 0.28, (m % 3 - 1) * 0.16);
      boneGroup.add(mMesh);
    }

    // Active Multinucleated Osteoclasts inside Howship Lacunae (Visible Red/Gold Resorption Cells)
    if (factor > 0.1) {
      const isHowshipSelected = selectedTissue === 'howship_lacunae';
      const osteoclastMat = new THREE.MeshStandardMaterial({
        color: isHowshipSelected ? 0x06b6d4 : 0xef4444,
        emissive: isHowshipSelected ? 0x0891b2 : 0xb91c1c,
        emissiveIntensity: 0.65
      });
      const numOsteoclasts = Math.min(18, Math.round(3 + factor * 14));

      for (let i = 0; i < numOsteoclasts; i++) {
        const ocGeo = new THREE.SphereGeometry(0.045, 10, 10);
        const oc = new THREE.Mesh(ocGeo, osteoclastMat);
        oc.position.set(
          0.58 + (i % 3) * 0.14,
          boneTopY - (i * 0.052),
          (i % 3 - 1) * 0.12
        );
        boneGroup.add(oc);
      }
    }

    rootGroup.add(boneGroup);
  }

  // 4. GINGIVAL COMPLEX & JUNCTIONAL EPITHELIUM (JE) POCKET MIGRATION
  if (layerFilter === 'all') {
    const gingivaGroup = new THREE.Group();

    // Tissue turns from coral pink in health to hyperemic erythematous red in inflammation
    const gingivaColor = factor > 0.35 ? 0xef4444 : 0xf472b6;
    const gingivaMat = new THREE.MeshStandardMaterial({
      color: gingivaColor,
      roughness: 0.45,
      metalness: 0.02,
      transparent: true,
      opacity: 0.65
    });

    // Anatomical marginal and attached gingiva contour
    const gingivaShape = new THREE.Shape();
    gingivaShape.moveTo(0.44, 0.42); // Free gingival margin at CEJ
    gingivaShape.quadraticCurveTo(1.12, 0.46, 1.25, 0.15); // Rolled gingival contour
    gingivaShape.quadraticCurveTo(1.35, -0.4, 1.3, -0.9); // Attached gingiva
    gingivaShape.lineTo(0.54, boneTopY); // Attaches over bone crest
    gingivaShape.lineTo(0.48, pdlAttachmentY); // Pocket base / Junctional epithelium
    gingivaShape.lineTo(0.44, 0.42); // Sulcus wall
    gingivaShape.closePath();

    const gingivaGeo = new THREE.ExtrudeGeometry(gingivaShape, {
      depth: 0.72,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.03,
      bevelThickness: 0.03
    });
    gingivaGeo.translate(0, 0, -0.36);
    const gingivaMesh = new THREE.Mesh(gingivaGeo, gingivaMat);
    gingivaGroup.add(gingivaMesh);

    // Junctional Epithelium (JE) band migrating apically
    const jeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4
    });
    const jeGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.25, 8);
    const jeMesh = new THREE.Mesh(jeGeo, jeMat);
    jeMesh.position.set(0.49, pdlAttachmentY + 0.1, 0);
    gingivaGroup.add(jeMesh);

    rootGroup.add(gingivaGroup);
  }

  // 5. SUBGINGIVAL BIOFILM & 1.5–2.5mm RADIUS OF ACTION SPHERE (Page 6 syllabus key fact)
  if (layerFilter === 'all' || layerFilter === 'biofilm') {
    if (factor > 0.06) {
      const biofilmGroup = new THREE.Group();

      // Subgingival plaque & calculus adhering to root surface in the pocket
      const plaqueHeight = 0.35 + factor * 0.7;
      const plaqueGeo = new THREE.CylinderGeometry(0.52, 0.50, plaqueHeight, 18, 1, false, 0, Math.PI / 2);
      plaqueGeo.translate(0, pdlAttachmentY + plaqueHeight / 2, 0);
      plaqueGeo.rotateY(Math.PI / 2);

      const plaqueMat = new THREE.MeshStandardMaterial({
        color: 0x78350f, // Dark brown/black subgingival calculus
        roughness: 0.9,
        metalness: 0.05
      });
      biofilmGroup.add(new THREE.Mesh(plaqueGeo, plaqueMat));

      // 1.5 mm to 2.5 mm Bacterial Radius of Action Sphere (Syllabus core principle)
      if (showRadiusOfAction) {
        const radiusGeo = new THREE.SphereGeometry(0.85, 24, 24);
        const radiusMat = new THREE.MeshBasicMaterial({
          color: 0xC9A24B, // Precision Gold calibrated sphere
          transparent: true,
          opacity: 0.22,
          wireframe: true
        });
        const radiusMesh = new THREE.Mesh(radiusGeo, radiusMat);
        radiusMesh.position.set(0.52, pdlAttachmentY, 0);
        biofilmGroup.add(radiusMesh);

        // Core marker at bacterial invasion front
        const coreGeo = new THREE.SphereGeometry(0.065, 12, 12);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.position.set(0.52, pdlAttachmentY, 0);
        biofilmGroup.add(coreMesh);
      }

      rootGroup.add(biofilmGroup);
    }
  }

  // 6. MICROVASCULAR CHANNELS & BLOOD VESSELS (Vasodilation & Capillary Plexus)
  if (layerFilter === 'all' || layerFilter === 'vessels') {
    const vesselGroup = new THREE.Group();
    const vesselMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.3,
      metalness: 0.1
    });

    const vesselRadius = factor > 0.4 ? 0.038 : 0.022; // Vasodilation under inflammation

    // Main vessel entering crest from marrow
    const vesselCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.95, 0.45, 0),
      new THREE.Vector3(0.85, 0.1, 0),
      new THREE.Vector3(0.9, -0.6, 0),
      new THREE.Vector3(0.95, -1.8, 0)
    );
    const vesselGeo = new THREE.TubeGeometry(vesselCurve, 20, vesselRadius, 8, false);
    vesselGroup.add(new THREE.Mesh(vesselGeo, vesselMat));

    // Branching vessels perforating into PDL
    for (let b = 0; b < 3; b++) {
      const branchGeo = new THREE.CylinderGeometry(vesselRadius * 0.7, vesselRadius * 0.7, 0.32, 6);
      branchGeo.rotateZ(Math.PI / 2.2);
      const branch = new THREE.Mesh(branchGeo, vesselMat);
      branch.position.set(0.70, -0.4 - b * 0.42, (b % 2 === 0 ? 0.12 : -0.12));
      vesselGroup.add(branch);
    }

    rootGroup.add(vesselGroup);
  }

  // 7. INFLAMMATORY INFILTRATE (PMNs, MACROPHAGES, CYTOKINE EXUDATE)
  if (layerFilter === 'all' || layerFilter === 'infiltrate') {
    const particleCount = Math.round(factor * 45);
    const pMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.75
    });

    for (let p = 0; p < particleCount; p++) {
      const pGeo = new THREE.SphereGeometry(0.028, 6, 6);
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(
        0.52 + Math.random() * 0.42,
        0.42 - p * 0.032 - factor * 0.38,
        (Math.random() - 0.5) * 0.65
      );
      particlesGroup.add(pMesh);
    }
  }
}
