import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MoveHorizontal, RotateCcw, AlertTriangle, ShieldCheck, Gauge, HelpCircle } from 'lucide-react';
import { createHumanIncisor, createHumanMolar, createDentalMaterials } from '../utils/dentalAnatomy3D';

export const ThreeMobilitySimulator: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [targetTooth, setTargetTooth] = useState<'11' | '46'>('11');
  const [mobilityClass, setMobilityClass] = useState<0 | 1 | 2 | 3>(2);
  const [appliedForceN, setAppliedForceN] = useState<number>(3.5); // 0 - 10 N
  const [forceDirection, setForceDirection] = useState<'buccal' | 'lingual' | 'vertical'>('buccal');

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const toothMeshGroupRef = useRef<THREE.Group | null>(null);
  const mirrorHandleRef = useRef<THREE.Mesh | null>(null);
  const probeHandleRef = useRef<THREE.Mesh | null>(null);

  // Dynamic displacement calculation based on Miller Class & Applied Force
  const maxDisplacement =
    mobilityClass === 0 ? 0.15 :
    mobilityClass === 1 ? 0.9 :
    mobilityClass === 2 ? 1.9 : 3.5;

  const verticalDepression = mobilityClass === 3 && forceDirection === 'vertical' ? 1.4 : 0.05;
  const currentDisplacement = parseFloat(((appliedForceN / 10) * maxDisplacement).toFixed(2));

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 580;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090e1a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.8, 8.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Surgical Studio Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 0.65);
    cyanRim.position.set(-7, -2, -5);
    scene.add(cyanRim);

    // Floor Grid
    const grid = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
    grid.position.y = -3.4;
    scene.add(grid);

    // Alveolar Bone Socket (Semi-transparent Alveolus)
    const socketGroup = new THREE.Group();
    scene.add(socketGroup);
    buildAlveolarSocket(socketGroup, targetTooth);

    // Interactive Human Tooth Group
    const toothGroup = new THREE.Group();
    toothMeshGroupRef.current = toothGroup;
    scene.add(toothGroup);
    buildHumanTooth(toothGroup, targetTooth);

    // 3D Dental Instruments (Mirror handle on left, probe handle on right)
    const { mirrorHandle, probeHandle } = createInstrumentHandles();
    mirrorHandleRef.current = mirrorHandle;
    probeHandleRef.current = probeHandle;
    scene.add(mirrorHandle);
    scene.add(probeHandle);

    // Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let spherical = { radius: 8.5, theta: 0, phi: Math.PI / 2.3 };

    const updateCam = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, -0.2, 0);
    };
    updateCam();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      spherical.theta -= (e.clientX - prevMouse.x) * 0.007;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - (e.clientY - prevMouse.y) * 0.007));
      updateCam();
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => (isDragging = false);

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

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
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [targetTooth]);

  // Dynamic tooth deflection animation when force changes
  useEffect(() => {
    if (!toothMeshGroupRef.current) return;
    const tooth = toothMeshGroupRef.current;

    // Deflection displacement
    const factor = appliedForceN / 10;
    const disp = maxDisplacement * factor;
    const dirSign = forceDirection === 'buccal' ? 1 : forceDirection === 'lingual' ? -1 : 0;

    // Horizontal pivot rotation around apical 1/3 (fulcrum)
    tooth.position.x = dirSign * disp * 0.28;
    tooth.rotation.z = -dirSign * disp * 0.08;

    // Vertical depression if vertical force applied in Class 3
    if (forceDirection === 'vertical' && mobilityClass === 3) {
      tooth.position.y = -verticalDepression * factor;
    } else {
      tooth.position.y = 0;
    }

    // Move Instrument handles accordingly
    if (probeHandleRef.current && mirrorHandleRef.current) {
      if (forceDirection === 'buccal') {
        probeHandleRef.current.position.x = -1.5 + disp * 0.25;
        mirrorHandleRef.current.position.x = 2.1 + disp * 0.25;
      } else if (forceDirection === 'lingual') {
        probeHandleRef.current.position.x = -2.1 - disp * 0.25;
        mirrorHandleRef.current.position.x = 1.5 - disp * 0.25;
      }
    }
  }, [appliedForceN, forceDirection, maxDisplacement, mobilityClass, verticalDepression]);

  const buildHumanTooth = (group: THREE.Group, toothId: '11' | '46') => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    if (toothId === '11') {
      // Anatomical Human Maxillary Central Incisor (#11)
      const incisor = createHumanIncisor({ isMaxillary: true });
      group.add(incisor);
    } else {
      // Anatomical Human Mandibular 1st Molar (#46)
      const molar = createHumanMolar({ isMandibular: true, furcationGrade: 'None' });
      group.add(molar);
    }
  };

  const buildAlveolarSocket = (group: THREE.Group, toothId: '11' | '46') => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    // Translucent PBR alveolar bone block with osteon texture to show root movement inside alveolus
    const mats = createDentalMaterials('all', false);
    const boneMat = mats.bone.clone();
    boneMat.transparent = true;
    boneMat.opacity = 0.42;

    const socket = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.5, 2.6), boneMat);
    socket.position.y = -1.8;
    group.add(socket);

    // Alveolar crest rim
    const crestRim = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.35, 24),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
    );
    crestRim.rotation.x = Math.PI / 2;
    crestRim.position.y = -0.05;
    group.add(crestRim);
  };

  const createInstrumentHandles = () => {
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });

    // Left Handle: Periodontal Probe Handle flat end
    const probeHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.5, 16), handleMat);
    probeHandle.rotation.z = Math.PI / 2;
    probeHandle.position.set(-1.8, 1.0, 0);

    // Right Handle: Mouth Mirror Handle flat end
    const mirrorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4.5, 16), handleMat);
    mirrorHandle.rotation.z = Math.PI / 2;
    mirrorHandle.position.set(1.8, 1.0, 0);

    return { mirrorHandle, probeHandle };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
      {/* 3D Physical Simulation (2 Columns) */}
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between relative min-h-[460px]">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-blue-950 text-blue-300 px-3 py-1 rounded-full border border-blue-800">
              Miller Mechanical Physics Model
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Tooth #{targetTooth === '11' ? '11 (Upper Central Incisor)' : '46 (Lower 1st Molar)'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1 text-[11px]">Select Tooth:</span>
            <button
              onClick={() => setTargetTooth('11')}
              className={`px-2.5 py-1 rounded-lg border font-mono font-bold transition cursor-pointer ${
                targetTooth === '11' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              #11 Incisor
            </button>
            <button
              onClick={() => setTargetTooth('46')}
              className={`px-2.5 py-1 rounded-lg border font-mono font-bold transition cursor-pointer ${
                targetTooth === '46' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              #46 Molar
            </button>
          </div>
        </div>

        {/* Live HUD Gauge */}
        <div className="absolute top-16 left-6 z-10 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-xl space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Gauge className="w-3.5 h-3.5 text-blue-400" />
            <span>Crown Deflection:</span>
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {currentDisplacement} mm
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {forceDirection === 'vertical' && mobilityClass === 3
              ? `+ ${verticalDepression} mm intrusion`
              : 'Bucco-lingual excursion'}
          </div>
        </div>

        {/* Three.js Canvas */}
        <div ref={mountRef} className="w-full h-[320px] cursor-grab active:cursor-grabbing my-auto" />

        {/* Bottom Interactive Force & Direction Controls */}
        <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Instrument Applied Force:</span>
              <span className="font-mono text-cyan-400 font-bold">{appliedForceN.toFixed(1)} N</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">Direction:</span>
              {(['buccal', 'lingual', 'vertical'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setForceDirection(dir)}
                  className={`px-2.5 py-1 capitalize rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                    forceDirection === dir
                      ? 'bg-blue-600 border-blue-400 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={appliedForceN}
            onChange={(e) => setAppliedForceN(parseFloat(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Miller Classifications (1 Column) */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-slate-800 pb-3">
            Miller Index Criteria (Carranza 13th)
          </h3>

          <div className="space-y-2.5 pt-3">
            {[
              {
                cls: 0,
                name: 'Class 0: Physiological',
                range: '≤ 0.2 mm',
                desc: 'Physiological resilience conferred by the periodontal ligament fibers without tissue breakdown.',
                treatment: 'Normal healthy baseline.'
              },
              {
                cls: 1,
                name: 'Class 1: Distinguishable',
                range: '> Normal up to 1.0 mm',
                desc: 'First distinguishable movement beyond normal physiological boundaries in horizontal direction.',
                treatment: 'Observe, rule out primary occlusal trauma.'
              },
              {
                cls: 2,
                name: 'Class 2: Moderate',
                range: '1.0 mm to 2.0 mm',
                desc: 'Crown movement up to 1 mm in any direction, easily palpable with instrument handles.',
                treatment: 'Secondary occlusal trauma; temporary splint in Step 1.'
              },
              {
                cls: 3,
                name: 'Class 3: Severe + Vertical',
                range: '> 2.0 mm or Vertical Intrusion',
                desc: 'Crown movement > 1 mm in any direction OR vertical depression or rotation in its socket.',
                treatment: 'Questionable/Hopeless prognosis; masticatory collapse.'
              }
            ].map((m) => (
              <button
                key={m.cls}
                onClick={() => setMobilityClass(m.cls as any)}
                className={`w-full text-left p-3 rounded-2xl border text-xs transition flex flex-col gap-1 cursor-pointer ${
                  mobilityClass === m.cls
                    ? 'bg-blue-950/80 border-blue-500 text-white ring-1 ring-blue-500/50'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{m.name}</span>
                  <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-300">
                    {m.range}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{m.desc}</p>
                <div className="text-[10px] text-cyan-400 font-semibold pt-1 border-t border-slate-800">
                  Plan: {m.treatment}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed">
            <strong className="text-white">Clinical Technique:</strong> Never test mobility with fingers. Always use the rigid metallic backs of two instruments (mirror + probe) pressed against buccal and lingual surfaces.
          </span>
        </div>
      </div>
    </div>
  );
};
