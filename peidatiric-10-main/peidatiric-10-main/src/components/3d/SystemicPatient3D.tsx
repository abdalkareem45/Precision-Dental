import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { soundFx } from '../../utils/audio';
import {
  RotateCcw,
  Sparkles,
  Heart,
  Activity,
  AlertTriangle,
  Brain,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export type SystemicConditionKey =
  | 'heart'
  | 'hemophilia'
  | 'epilepsy'
  | 'asthma'
  | 'leukemia'
  | 'diabetes'
  | 'renal'
  | 'sensory';

export const SystemicPatient3D: React.FC<{
  initialCondition?: SystemicConditionKey;
  onConditionSelect?: (cond: SystemicConditionKey) => void;
  className?: string;
}> = ({ initialCondition = 'heart', onConditionSelect, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeCondition, setActiveCondition] = useState<SystemicConditionKey>(initialCondition);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const brainMeshRef = useRef<THREE.Mesh | null>(null);
  const lungsMeshRef = useRef<THREE.Mesh | null>(null);
  const jawDangerRef = useRef<THREE.Mesh | null>(null);
  const kidneyMeshRef = useRef<THREE.Mesh | null>(null);
  const pancreasMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    setActiveCondition(initialCondition);
  }, [initialCondition]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1222);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 5.8);
    cameraRef.current = camera;

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isHeadless;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 0.4, 0);

    // Studio Lights
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keyLight.position.set(3, 6, 4);
    scene.add(keyLight);
    const fillLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 1.2);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xc9a24b, 1.8);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Procedural Anatomical Torso & Head Silhouette
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // Translucent anatomical glass bust
    const bustMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e3a8a,
      roughness: 0.2,
      transmission: 0.85,
      transparent: true,
      opacity: 0.35,
      ior: 1.45,
    });

    // Head
    const headGeo = new THREE.SphereGeometry(0.7, 24, 24);
    headGeo.scale(1, 1.2, 1);
    const headMesh = new THREE.Mesh(headGeo, bustMat);
    headMesh.position.set(0, 1.9, 0);
    bodyGroup.add(headMesh);

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.9, 0.7, 2.2, 24);
    const torsoMesh = new THREE.Mesh(torsoGeo, bustMat);
    torsoMesh.position.set(0, 0.2, 0);
    bodyGroup.add(torsoMesh);

    // 1. BRAIN (Epilepsy / Sensory)
    const brainGeo = new THREE.SphereGeometry(0.42, 16, 16);
    brainGeo.scale(1.1, 0.9, 1.2);
    const brainMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.5,
      roughness: 0.4,
    });
    const brainMesh = new THREE.Mesh(brainGeo, brainMat);
    brainMesh.position.set(0, 2.05, 0);
    bodyGroup.add(brainMesh);
    brainMeshRef.current = brainMesh;

    // 2. HEART (Infective Endocarditis)
    const heartGeo = new THREE.DodecahedronGeometry(0.35, 1);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(0.2, 0.65, 0.3);
    bodyGroup.add(heartMesh);
    heartMeshRef.current = heartMesh;

    // 3. LUNGS (Asthma)
    const lungGeo = new THREE.CapsuleGeometry(0.32, 0.7, 8, 16);
    const lungMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0e7490,
      emissiveIntensity: 0.4,
      roughness: 0.4,
    });
    [-0.45, 0.45].forEach((lx) => {
      const lung = new THREE.Mesh(lungGeo, lungMat);
      lung.position.set(lx, 0.6, 0.05);
      bodyGroup.add(lung);
    });
    lungsMeshRef.current = new THREE.Mesh(lungGeo, lungMat); // reference handle

    // 4. PTERYGOMANDIBULAR SPACE / MANDIBLE (Hemophilia DANGER ZONE: NO BLOCK INJECTION!)
    const jawGeo = new THREE.TorusGeometry(0.65, 0.12, 12, 24, Math.PI);
    const jawMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
      roughness: 0.3,
    });
    const jawMesh = new THREE.Mesh(jawGeo, jawMat);
    jawMesh.rotation.x = Math.PI / 2;
    jawMesh.position.set(0, 1.35, 0.3);
    bodyGroup.add(jawMesh);
    jawDangerRef.current = jawMesh;

    // 5. KIDNEYS & ARTERIOVENOUS SHUNT (Renal Disease)
    const kidneyGeo = new THREE.SphereGeometry(0.25, 12, 12);
    kidneyGeo.scale(0.8, 1.2, 0.7);
    const kidneyMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.4,
    });
    [-0.5, 0.5].forEach((kx) => {
      const km = new THREE.Mesh(kidneyGeo, kidneyMat);
      km.position.set(kx, -0.3, -0.2);
      bodyGroup.add(km);
    });
    kidneyMeshRef.current = new THREE.Mesh(kidneyGeo, kidneyMat);

    // 6. PANCREAS (Diabetes Mellitus)
    const pancGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.6, 12);
    pancGeo.rotateZ(Math.PI / 3);
    const pancMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x047857,
      emissiveIntensity: 0.5,
    });
    const pancMesh = new THREE.Mesh(pancGeo, pancMat);
    pancMesh.position.set(0, -0.1, 0.25);
    bodyGroup.add(pancMesh);
    pancreasMeshRef.current = pancMesh;

    // Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      controls.update();

      // Gentle anatomical pulse
      if (heartMesh) {
        const pulse = 1 + Math.sin(t * 4) * 0.08;
        heartMesh.scale.set(pulse, pulse, pulse);
      }

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Condition Focus Handlers
  const handleSelect = (cond: SystemicConditionKey) => {
    soundFx.playClick();
    setActiveCondition(cond);
    if (onConditionSelect) onConditionSelect(cond);

    if (!cameraRef.current || !controlsRef.current) return;
    if (cond === 'heart') {
      cameraRef.current.position.set(0, 0.7, 3.2);
      controlsRef.current.target.set(0.1, 0.65, 0.3);
    } else if (cond === 'epilepsy' || cond === 'sensory') {
      cameraRef.current.position.set(0, 2.0, 3.2);
      controlsRef.current.target.set(0, 1.9, 0);
    } else if (cond === 'hemophilia') {
      cameraRef.current.position.set(0, 1.4, 2.8);
      controlsRef.current.target.set(0, 1.35, 0.3);
    } else if (cond === 'asthma') {
      cameraRef.current.position.set(0, 0.8, 3.2);
      controlsRef.current.target.set(0, 0.6, 0.1);
    } else if (cond === 'renal') {
      cameraRef.current.position.set(0, -0.2, 3.2);
      controlsRef.current.target.set(0, -0.3, 0);
    } else if (cond === 'diabetes') {
      cameraRef.current.position.set(0, 0, 3.2);
      controlsRef.current.target.set(0, -0.1, 0.2);
    } else {
      cameraRef.current.position.set(0, 1.2, 5.8);
      controlsRef.current.target.set(0, 0.4, 0);
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-[#C9A24B]/30 bg-[#0c1222] shadow-xl h-[460px] sm:h-[520px] ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Header Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="bg-[#0B1F4D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#C9A24B]/40 shadow-lg pointer-events-auto flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#C9A24B]" />
          <div>
            <h4 className="text-white font-montserrat font-bold text-xs sm:text-sm tracking-wide">
              3D Pediatric Systemic Risk Navigator (Lec 3, 4, 5 A.M.)
            </h4>
            <p className="text-[10px] text-gray-300 font-medium">
              Cardiac • Hemophilia • Asthma • Epilepsy • Renal • Endocrine
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            if (controlsRef.current && cameraRef.current) {
              cameraRef.current.position.set(0, 1.2, 5.8);
              controlsRef.current.target.set(0, 0.4, 0);
            }
          }}
          className="bg-[#0B1F4D]/90 hover:bg-[#1B3A8C] text-white p-2 rounded-lg border border-[#C9A24B]/30 transition-all shadow-md pointer-events-auto"
        >
          <RotateCcw className="w-4 h-4 text-[#C9A24B]" />
        </button>
      </div>

      {/* Bottom Consolidated Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl transition-all duration-300 z-20">
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsCollapsed(!isCollapsed);
            }}
            className="bg-[#0B1F4D] hover:bg-[#1B3A8C] text-[#C9A24B] px-3 py-1 rounded-t-xl border-t border-x border-[#C9A24B]/40 text-xs font-semibold flex items-center gap-1 shadow-lg"
          >
            {isCollapsed ? <><ChevronUp className="w-3.5 h-3.5" /> Show Organ System Directives</> : <><ChevronDown className="w-3.5 h-3.5" /> Collapse Directives</>}
          </button>
        </div>

        <div
          className={`bg-[#0B1F4D]/95 backdrop-blur-md rounded-2xl border border-[#C9A24B]/40 p-3 shadow-2xl transition-all duration-300 ${
            isCollapsed ? 'max-h-0 py-0 border-transparent opacity-0 pointer-events-none' : 'max-h-80 opacity-100'
          }`}
        >
          {/* Organ Buttons */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {(
              [
                ['heart', 'Heart & IE Prophylaxis'],
                ['hemophilia', 'Hemophilia (No Blocks!)'],
                ['epilepsy', 'Epilepsy & Seizures'],
                ['asthma', 'Asthma (Reactive Airway)'],
                ['leukemia', 'Leukemia & Platelets'],
                ['diabetes', 'Diabetes Mellitus'],
                ['renal', 'Renal Disease & Shunt'],
                ['sensory', 'Hearing / Visual Impairment'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => handleSelect(k)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeCondition === k
                    ? 'bg-[#C9A24B] text-[#0B1F4D] shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Clinical Directives */}
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 text-xs text-gray-200">
            {activeCondition === 'heart' && (
              <div>
                <span className="font-bold text-red-400">Infective Endocarditis (IE) Dental Protocol:</span>
                <p className="mt-0.5">
                  • <strong>AHA Antibiotic Prophylaxis:</strong> Amoxicillin <strong>50 mg/kg</strong> orally 30-60 min prior (Max 2g). Penicillin-allergic: Cephalexin (50 mg/kg), Clindamycin (20 mg/kg), or Azithromycin (15 mg/kg).
                  <br />
                  • <strong>Primary teeth with poor prognosis:</strong> DO NOT perform pulp therapy due to chronic infection risk; <strong>extract with fixed space maintainer</strong>!
                </p>
              </div>
            )}

            {activeCondition === 'hemophilia' && (
              <div>
                <span className="font-bold text-amber-400">⚠️ Hemophilia A (Factor VIII) & B (Factor IX):</span>
                <p className="mt-0.5">
                  • <strong className="text-red-400">FATAL RISK:</strong> NEVER administer Inferior Alveolar Nerve Block without factor replacement (&gt;30-40%) because dissecting hematoma into pterygomandibular space can cause <strong>airway obstruction and asphyxia</strong>!
                  <br />
                  • <strong>Safe alternatives:</strong> Infiltration or Periodontal Ligament (PDL) injections.
                  <br />
                  • <strong>Pain relief:</strong> Acetaminophen or narcotics. <strong>CONTRAINDICATED: Aspirin and NSAIDs</strong> (inhibit platelet aggregation).
                </p>
              </div>
            )}

            {activeCondition === 'epilepsy' && (
              <div>
                <span className="font-bold text-purple-400">Epilepsy Management & Emergency Seizure Protocol:</span>
                <p className="mt-0.5">
                  • Minimize triggers (bright lights: wear sunglasses; upright chair; low water/high suction).
                  <br />
                  • <strong>Seizure during treatment:</strong> Remove ALL instruments from mouth immediately, clear area around dental chair, maintain airway.
                  <br />
                  • <strong>Time seizure:</strong> If seizure continues <strong>&gt; 3 minutes</strong>, call Emergency Medical Services (EMS) immediately!
                </p>
              </div>
            )}

            {activeCondition === 'asthma' && (
              <div>
                <span className="font-bold text-cyan-400">Asthma (Reactive Airway Disease):</span>
                <p className="mt-0.5">
                  • Patient must bring rescue bronchodilator inhaler to chairside and take a prophylactic puff.
                  <br />
                  • Position in upright chair. <strong>CONTRAINDICATED: Aspirin &amp; NSAIDs</strong> (4% experience severe wheezing / bronchospasm), barbiturates/narcotics (histamine release).
                </p>
              </div>
            )}

            {activeCondition === 'leukemia' && (
              <div>
                <span className="font-bold text-red-400">Leukemia Dental Management & Platelet Rules:</span>
                <p className="mt-0.5">
                  • <strong>&gt;100,000/mm³:</strong> Safe for all dental procedures.
                  <br />
                  • <strong>&ge;50,000/mm³:</strong> Routine restorative care &amp; non-block injections allowed.
                  <br />
                  • <strong>&lt;20,000/mm³:</strong> High risk of spontaneous oral bleeding. Defer treatment or perform only with prophylactic platelet transfusion.
                  <br />
                  • <strong>Pulp therapy on primary teeth is STRICTLY CONTRAINDICATED</strong> in leukemia!
                </p>
              </div>
            )}

            {activeCondition === 'diabetes' && (
              <div>
                <span className="font-bold text-emerald-400">Diabetes Mellitus Pediatric Protocol:</span>
                <p className="mt-0.5">
                  • Schedule <strong>morning appointments</strong> (do not coincide with peak insulin activity). Ensure child has eaten normally.
                  <br />
                  • Check blood glucose before treatment: if <strong>&lt; 70 mg/dL</strong>, give oral carbohydrate to prevent hypoglycemic crisis.
                  <br />
                  • <strong>Avoid Aspirin</strong>: Salicylates increase insulin secretion and sensitivity, causing hypoglycemia.
                </p>
              </div>
            )}

            {activeCondition === 'renal' && (
              <div>
                <span className="font-bold text-violet-400">Renal Disease &amp; Dialysis Protocol:</span>
                <p className="mt-0.5">
                  • <strong>AV Shunt arm:</strong> NEVER place blood pressure cuff or IV lines on the arm with an arteriovenous shunt/fistula!
                  <br />
                  • <strong>Timing:</strong> Perform dental treatment on the <strong>day AFTER hemodialysis</strong> (patient heparinized on dialysis day).
                  <br />
                  • <strong>Nephrotoxic drugs to strictly avoid:</strong> Tetracyclines, Gentamicin, Vancomycin, Aspirin, NSAIDs, Acetaminophen high doses.
                </p>
              </div>
            )}

            {activeCondition === 'sensory' && (
              <div>
                <span className="font-bold text-amber-300">Sensory Impairments:</span>
                <p className="mt-0.5">
                  • <strong>Hearing Loss:</strong> Adjust/turn off hearing aids before operating noisy high-speed handpieces! Maintain visual contact and use visual aids.
                  <br />
                  • <strong>Visual Impairment:</strong> Guide child's hand over yours for toothbrushing; describe all instruments; allow dark sunglasses for photophobia.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
