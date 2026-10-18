import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Split, RotateCcw, AlertTriangle, ShieldCheck, Compass, Info } from 'lucide-react';
import { createHumanMolar, createDentalMaterials } from '../utils/dentalAnatomy3D';

export const ThreeFurcationSimulator: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [furcationGrade, setFurcationGrade] = useState<'Grade I' | 'Grade II' | 'Grade III' | 'Grade IV'>('Grade II');
  const [probeEntrance, setProbeEntrance] = useState<'buccal' | 'lingual'>('buccal');
  const [probeInsertionPercent, setProbeInsertionPercent] = useState<number>(60);
  const [showCrossSection, setShowCrossSection] = useState<boolean>(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const toothGroupRef = useRef<THREE.Group | null>(null);
  const nabersProbeRef = useRef<THREE.Group | null>(null);

  const isThroughAndThrough = furcationGrade === 'Grade III' || furcationGrade === 'Grade IV';
  const tactileFeedback =
    furcationGrade === 'Grade I'
      ? 'Firm bone stop at flute entrance (Incipient catch ≤ 1mm)'
      : furcationGrade === 'Grade II'
      ? 'Definite horizontal cul-de-sac catch (>1mm but does not pass through)'
      : furcationGrade === 'Grade III'
      ? 'Unobstructed through-and-through passage (Soft tissue covered)'
      : 'Unobstructed through-and-through tunnel (CLINICALLY VISIBLE due to recession)';

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 580;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.6, 8.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Surgical Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 1.35);
    dir.position.set(5, 10, 6);
    scene.add(dir);

    const purpleFill = new THREE.DirectionalLight(0xa855f7, 0.65);
    purpleFill.position.set(-6, -2, -4);
    scene.add(purpleFill);

    // Human Multirooted Molar Group
    const toothGroup = new THREE.Group();
    toothGroupRef.current = toothGroup;
    scene.add(toothGroup);
    buildHumanFurcationMolar(toothGroup, furcationGrade, showCrossSection);

    // Curved Nabers Periodontal Probe
    const probe = createNabersProbe();
    nabersProbeRef.current = probe;
    scene.add(probe);
    updateNabersPosition(probe, probeEntrance, probeInsertionPercent, furcationGrade);

    // Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let spherical = { radius: 8.2, theta: 0.1, phi: Math.PI / 2.2 };

    const updateCam = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, -0.4, 0);
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
  }, []);

  // Update tooth model when furcation grade or cross-section changes
  useEffect(() => {
    if (toothGroupRef.current) {
      buildHumanFurcationMolar(toothGroupRef.current, furcationGrade, showCrossSection);
    }
  }, [furcationGrade, showCrossSection]);

  // Update probe position when entrance, percent, or grade changes
  useEffect(() => {
    if (nabersProbeRef.current) {
      updateNabersPosition(nabersProbeRef.current, probeEntrance, probeInsertionPercent, furcationGrade);
    }
  }, [probeEntrance, probeInsertionPercent, furcationGrade]);

  const buildHumanFurcationMolar = (
    group: THREE.Group,
    grade: 'Grade I' | 'Grade II' | 'Grade III' | 'Grade IV',
    isCut: boolean
  ) => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    // Anatomical Human Mandibular Molar with authentic diverging roots
    const molar = createHumanMolar({
      isMandibular: true,
      furcationGrade: grade,
      isCut
    });
    group.add(molar);

    const mats = createDentalMaterials('all', grade !== 'Grade I');

    // Anatomical Alveolar Bone around Molar
    let crestHeight = 2.4;
    let crestY = -1.2;
    if (grade === 'Grade I') {
      crestY = -0.9;
    } else if (grade === 'Grade II') {
      crestY = -1.3;
    } else {
      crestY = -1.8;
    }

    const bone = new THREE.Mesh(new THREE.BoxGeometry(3.6, crestHeight, 2.8), mats.bone);
    bone.position.set(0, crestY - crestHeight / 2, 0);
    group.add(bone);

    // Gingiva: In Grade IV, severe recession exposes the furcation tunnel clinically!
    const gmY = grade === 'Grade IV' ? -1.45 : -0.3;
    const gingiva = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 1.2, 28), mats.gingiva);
    gingiva.position.set(0, gmY - 0.6, 0);
    group.add(gingiva);
  };

  // Build Curved Nabers Periodontal Probe
  const createNabersProbe = () => {
    const probeGroup = new THREE.Group();

    // Metallic Knurled Handle
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 3.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 })
    );
    handle.position.y = 2.8;
    probeGroup.add(handle);

    // Curved Shank & Curved Working End (Nabers Curve)
    const curvePoints = [];
    curvePoints.push(new THREE.Vector3(0, 1.2, 0));
    curvePoints.push(new THREE.Vector3(0.1, 0.6, 0));
    curvePoints.push(new THREE.Vector3(0.3, 0.1, 0.2));
    curvePoints.push(new THREE.Vector3(0.7, -0.2, 0.4));
    curvePoints.push(new THREE.Vector3(1.2, -0.3, 0.3));

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.035, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.15 });
    const curvedWorkingEnd = new THREE.Mesh(tubeGeo, tubeMat);
    probeGroup.add(curvedWorkingEnd);

    // Rounded tip
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    tip.position.set(1.2, -0.3, 0.3);
    probeGroup.add(tip);

    return probeGroup;
  };

  // Update Nabers Probe Position based on Insertion slider & entrance
  const updateNabersPosition = (
    probe: THREE.Group,
    entrance: 'buccal' | 'lingual',
    insertPct: number,
    grade: string
  ) => {
    let maxFactor = 1.0;
    if (grade === 'Grade I') maxFactor = 0.25;
    else if (grade === 'Grade II') maxFactor = 0.65;
    else maxFactor = 1.2;

    const progress = (insertPct / 100) * maxFactor;

    if (entrance === 'buccal') {
      probe.position.set(-0.8 + progress * 0.8, -0.7, 1.8 - progress * 1.5);
      probe.rotation.set(0.4, 0.2, -0.1);
    } else {
      probe.position.set(-0.8 + progress * 0.8, -0.7, -1.8 + progress * 1.5);
      probe.rotation.set(-0.4, Math.PI - 0.2, 0.1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
      {/* 3D Furcation Simulation (2 Columns) */}
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between relative min-h-[460px]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-purple-950 text-purple-300 px-3 py-1 rounded-full border border-purple-800">
              Curved Nabers Probe Simulation
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Human Mandibular 1st Molar (#46)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowCrossSection(!showCrossSection)}
              className={`px-3 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                showCrossSection ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {showCrossSection ? 'Full 3D Render' : 'Cross-Section Cutout'}
            </button>
          </div>
        </div>

        {/* Live Tactile Feedback Badge */}
        <div className="absolute top-16 left-6 z-10 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-xl space-y-1 text-xs max-w-sm">
          <div className="flex items-center gap-1.5 font-bold text-white uppercase text-[10px] tracking-wider">
            <Split className="w-3.5 h-3.5 text-purple-400" />
            <span>Nabers Tactile Resistance Readout:</span>
          </div>
          <div className={`text-xs font-semibold ${isThroughAndThrough ? 'text-rose-400' : 'text-cyan-300'}`}>
            {tactileFeedback}
          </div>
        </div>

        {/* Three.js Canvas */}
        <div ref={mountRef} className="w-full h-[320px] cursor-grab active:cursor-grabbing my-auto" />

        {/* Bottom Nabers Insertion Slider */}
        <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Nabers Probe Insertion:</span>
              <span className="font-mono text-purple-400 font-bold">{probeInsertionPercent}%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">Entrance:</span>
              <button
                onClick={() => setProbeEntrance('buccal')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                  probeEntrance === 'buccal' ? 'bg-purple-600 border-purple-400 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Buccal Furcation
              </button>
              <button
                onClick={() => setProbeEntrance('lingual')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                  probeEntrance === 'lingual' ? 'bg-purple-600 border-purple-400 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Lingual Furcation
              </button>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={probeInsertionPercent}
            onChange={(e) => setProbeInsertionPercent(parseInt(e.target.value))}
            className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Glickman Grades Selector (1 Column) */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-slate-800 pb-3">
            Glickman Furcation Grades (1953)
          </h3>

          <div className="space-y-2.5 pt-3">
            {[
              {
                grade: 'Grade I',
                title: 'Grade I: Incipient Flute',
                desc: 'Pocket formation into the flute concavity, but interradicular bone remains intact. Nabers probe catches the depression without horizontal penetration.',
                prognosis: 'Fair prognosis with good patient compliance.'
              },
              {
                grade: 'Grade II',
                title: 'Grade II: Cul-de-Sac Defect',
                desc: 'Loss of interradicular bone and pocket formation of varying depths into the furcation, but NOT completely through to the opposite side.',
                prognosis: 'Poor prognosis; candidate for regenerative surgery.'
              },
              {
                grade: 'Grade III',
                title: 'Grade III: Through & Through',
                desc: 'Complete through-and-through bone destruction between roots; Nabers probe passes completely through the interradicular vault, occluded by soft tissue.',
                prognosis: 'Questionable; requires root resection or tunnel.'
              },
              {
                grade: 'Grade IV',
                title: 'Grade IV: Clinically Visible',
                desc: 'Through-and-through bone loss with gingival recession rendering the furcation tunnel clinically open, visible, and easily probeable.',
                prognosis: 'Hopeless or lifelong specialized tunnel hygiene.'
              }
            ].map((g) => (
              <button
                key={g.grade}
                onClick={() => setFurcationGrade(g.grade as any)}
                className={`w-full text-left p-3 rounded-2xl border text-xs transition flex flex-col gap-1 cursor-pointer ${
                  furcationGrade === g.grade
                    ? 'bg-purple-950/80 border-purple-500 text-white ring-1 ring-purple-500/50'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{g.title}</span>
                  {furcationGrade === g.grade && <span className="w-2 h-2 rounded-full bg-purple-400"></span>}
                </div>
                <p className="text-[11px] text-slate-400">{g.desc}</p>
                <div className="text-[10px] text-purple-300 font-semibold pt-1 border-t border-slate-800">
                  {g.prognosis}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed">
            <strong className="text-white">Maxillary Molar Rule:</strong> Maxillary molars possess 3 furcations (mesial, buccal, distal). Mesial furcation is probed from the PALATAL aspect because it is located 2/3 toward the palate.
          </span>
        </div>
      </div>
    </div>
  );
};
