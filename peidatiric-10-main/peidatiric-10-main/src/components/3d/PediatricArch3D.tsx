import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { soundFx } from '../../utils/audio';
import {
  RotateCcw,
  Sparkles,
  Navigation,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  AlertCircle,
} from 'lucide-react';

interface PediatricArch3DProps {
  highlightFeature?: 'quadrant_tour' | 'labial_frenum' | 'tongue_tie' | 'fistula' | 'caries';
  onFeatureSelect?: (feature: string) => void;
  className?: string;
}

export const PediatricArch3D: React.FC<PediatricArch3DProps> = ({
  highlightFeature = 'quadrant_tour',
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeFeature, setActiveFeature] = useState<string>(highlightFeature);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const teethMeshesRef = useRef<THREE.Mesh[]>([]);
  const frenumMeshRef = useRef<THREE.Mesh | null>(null);
  const tongueMeshRef = useRef<THREE.Mesh | null>(null);
  const fistulaMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameId = useRef<number | null>(null);

  const quadrantSteps = [
    {
      quadrant: 'Upper Right Quadrant',
      desc: 'Step 1: Start at maxillary right molar region and advance towards midline.',
      camPos: new THREE.Vector3(3.2, 3.8, 3.2),
      targetPos: new THREE.Vector3(1.2, 0, 0.8),
    },
    {
      quadrant: 'Upper Left Quadrant',
      desc: 'Step 2: Cross midline, inspect maxillary left incisors, canines, and primary molars.',
      camPos: new THREE.Vector3(-3.2, 3.8, 3.2),
      targetPos: new THREE.Vector3(-1.2, 0, 0.8),
    },
    {
      quadrant: 'Lower Left Quadrant',
      desc: 'Step 3: Move down to mandibular left arch and inspect lingual & buccal surfaces.',
      camPos: new THREE.Vector3(-3.2, -2.5, 3.2),
      targetPos: new THREE.Vector3(-1.2, -1.2, 0.8),
    },
    {
      quadrant: 'Lower Right Quadrant',
      desc: 'Step 4: End examination at mandibular right arch (Standard Lec 2 Protocol).',
      camPos: new THREE.Vector3(3.2, -2.5, 3.2),
      targetPos: new THREE.Vector3(1.2, -1.2, 0.8),
    },
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1120);
    scene.fog = new THREE.FogExp2(0x0a1120, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5.5, 7.5);
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
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 1.7;
    controls.target.set(0, 0, 0);

    // Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.6);
    keyLight.position.set(4, 8, 4);
    keyLight.castShadow = !isHeadless;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 1.3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc9a24b, 1.8);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Procedural Arch Anatomy
    const archGroup = new THREE.Group();
    scene.add(archGroup);

    // 1. Maxillary Gingival Horseshoe Arch
    const maxillaCurve = new THREE.EllipseCurve(0, 0, 2.4, 2.8, 0, Math.PI, false, 0);
    const maxillaPoints = maxillaCurve.getPoints(30);
    const maxillaGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(maxillaPoints.map((p) => new THREE.Vector3(p.x, 0.4, p.y))),
      32,
      0.65,
      12,
      false
    );
    const gingivaMat = new THREE.MeshStandardMaterial({
      color: 0xe57373,
      roughness: 0.4,
      metalness: 0.05,
    });
    const maxillaMesh = new THREE.Mesh(maxillaGeo, gingivaMat);
    archGroup.add(maxillaMesh);

    // Palatal Vault
    const palateGeo = new THREE.SphereGeometry(2.1, 24, 16, 0, Math.PI, 0, Math.PI / 2);
    palateGeo.scale(1, 0.4, 1.2);
    palateGeo.rotateX(Math.PI);
    palateGeo.translate(0, 0.6, 0);
    const palateMat = new THREE.MeshStandardMaterial({
      color: 0xef9a9a,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    const palateMesh = new THREE.Mesh(palateGeo, palateMat);
    archGroup.add(palateMesh);

    // Teeth Creation around Maxillary Arch
    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xfaf8f3,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.1,
      ior: 1.55,
    });

    const teethList: THREE.Mesh[] = [];
    const toothCount = 10; // 10 primary maxillary teeth (A through J)
    for (let i = 0; i < toothCount; i++) {
      const u = i / (toothCount - 1);
      const angle = (1 - u) * Math.PI;
      const x = Math.cos(angle) * 2.3;
      const z = Math.sin(angle) * 2.6;

      const isMolar = i <= 1 || i >= 8;
      const isCanine = i === 2 || i === 7;

      const toothGeo = isMolar
        ? new THREE.BoxGeometry(0.7, 0.65, 0.6)
        : isCanine
        ? new THREE.ConeGeometry(0.3, 0.7, 16)
        : new THREE.BoxGeometry(0.5, 0.6, 0.35);

      const tMesh = new THREE.Mesh(toothGeo, enamelMat.clone());
      tMesh.position.set(x, 0.1, z);
      tMesh.rotation.y = -angle + Math.PI / 2;
      archGroup.add(tMesh);
      teethList.push(tMesh);
    }
    teethMeshesRef.current = teethList;

    // High Labial Frenum attachment between central incisors
    const frenumGeo = new THREE.ConeGeometry(0.2, 0.9, 12);
    frenumGeo.rotateX(Math.PI / 3);
    const frenumMat = new THREE.MeshStandardMaterial({
      color: 0xd32f2f,
      roughness: 0.3,
    });
    const frenumMesh = new THREE.Mesh(frenumGeo, frenumMat);
    frenumMesh.position.set(0, 0.6, 2.7);
    archGroup.add(frenumMesh);
    frenumMeshRef.current = frenumMesh;

    // Fistula on attached gingiva (abscessed primary molar)
    const fistulaGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const fistulaMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // yellowish purulent center with red halo
      emissive: 0xef4444,
      emissiveIntensity: 0.4,
    });
    const fistulaMesh = new THREE.Mesh(fistulaGeo, fistulaMat);
    fistulaMesh.position.set(2.2, 0.75, 1.2);
    archGroup.add(fistulaMesh);
    fistulaMeshRef.current = fistulaMesh;

    // Tongue Model with Lingual Frenum (Ankyloglossia)
    const tongueGeo = new THREE.SphereGeometry(1.6, 32, 16);
    tongueGeo.scale(1.2, 0.3, 1.6);
    const tongueMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.55,
      metalness: 0.05,
    });
    const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
    tongueMesh.position.set(0, -0.6, 0.8);
    archGroup.add(tongueMesh);
    tongueMeshRef.current = tongueMesh;

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
      clock.getDelta();
      controls.update();
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

  // Handle Feature Switches
  useEffect(() => {
    if (!frenumMeshRef.current || !fistulaMeshRef.current || !tongueMeshRef.current) return;

    // Reset standard states
    frenumMeshRef.current.scale.set(1, 1, 1);
    fistulaMeshRef.current.visible = false;
    tongueMeshRef.current.position.set(0, -0.6, 0.8);

    if (activeFeature === 'labial_frenum') {
      // Hypertrophic thick frenum extending into palatal papilla (causing midline diastema)
      frenumMeshRef.current.scale.set(2.2, 1.6, 2.2);
    } else if (activeFeature === 'fistula') {
      fistulaMeshRef.current.visible = true;
    } else if (activeFeature === 'tongue_tie') {
      // Restrictive tongue tie pull
      tongueMeshRef.current.position.set(0, -0.9, 0.5);
    }
  }, [activeFeature]);

  // Navigate Quadrant Tour smoothly
  const handleQuadrantStep = (idx: number) => {
    soundFx.playClick();
    setActiveStep(idx);
    const step = quadrantSteps[idx];
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.copy(step.camPos);
      controlsRef.current.target.copy(step.targetPos);
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#C9A24B]/30 bg-[#0a1120] shadow-xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[440px] sm:h-[500px]'
      } ${className}`}
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Header Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="bg-[#0B1F4D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#C9A24B]/40 shadow-lg pointer-events-auto flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#C9A24B]" />
          <div>
            <h4 className="text-white font-montserrat font-bold text-xs sm:text-sm tracking-wide">
              3D Pediatric Arch & Soft Tissue Explorer (Lec 1 & 2)
            </h4>
            <p className="text-[10px] text-gray-300 font-medium">
              Quadrant Examination Path & Soft Tissue Pathology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              soundFx.playClick();
              if (controlsRef.current && cameraRef.current) {
                cameraRef.current.position.set(0, 5.5, 7.5);
                controlsRef.current.target.set(0, 0, 0);
              }
            }}
            className="bg-[#0B1F4D]/90 hover:bg-[#1B3A8C] text-white p-2 rounded-lg border border-[#C9A24B]/30 transition-all shadow-md"
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4 text-[#C9A24B]" />
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setIsFullscreen(!isFullscreen);
            }}
            className="bg-[#0B1F4D]/90 hover:bg-[#1B3A8C] text-white p-2 rounded-lg border border-[#C9A24B]/30 transition-all shadow-md"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#C9A24B]" /> : <Maximize2 className="w-4 h-4 text-[#C9A24B]" />}
          </button>
        </div>
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
            {isCollapsed ? <><ChevronUp className="w-3.5 h-3.5" /> Show Arch Controls</> : <><ChevronDown className="w-3.5 h-3.5" /> Collapse Controls</>}
          </button>
        </div>

        <div
          className={`bg-[#0B1F4D]/95 backdrop-blur-md rounded-2xl border border-[#C9A24B]/40 p-3 shadow-2xl transition-all duration-300 ${
            isCollapsed ? 'max-h-0 py-0 border-transparent opacity-0 pointer-events-none' : 'max-h-72 opacity-100'
          }`}
        >
          {/* Mode Selector */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveFeature('quadrant_tour');
              }}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFeature === 'quadrant_tour' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Quadrant Exam Path (Lec 2)
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveFeature('labial_frenum');
              }}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFeature === 'labial_frenum' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              High Labial Frenum & Diastema
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveFeature('fistula');
              }}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFeature === 'fistula' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Gingival Fistula / Abscess
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveFeature('tongue_tie');
              }}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFeature === 'tongue_tie' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Tongue Tie (Ankyloglossia)
            </button>
          </div>

          {/* Quadrant Stepper Buttons */}
          {activeFeature === 'quadrant_tour' && (
            <div className="bg-[#1B3A8C]/40 p-2.5 rounded-xl border border-[#C9A24B]/30 mb-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-1.5">
                {quadrantSteps.map((q, idx) => (
                  <button
                    key={q.quadrant}
                    onClick={() => handleQuadrantStep(idx)}
                    className={`text-[11px] py-1 px-1.5 rounded font-bold transition-all text-center ${
                      activeStep === idx
                        ? 'bg-[#C9A24B] text-[#0B1F4D] shadow-md'
                        : 'bg-white/10 text-gray-200 hover:bg-white/20'
                    }`}
                  >
                    {idx + 1}. {q.quadrant.replace(' Quadrant', '')}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-300 font-medium">
                {quadrantSteps[activeStep].desc}
              </p>
            </div>
          )}

          {activeFeature === 'labial_frenum' && (
            <div className="text-[11px] text-gray-300 bg-black/30 p-2 rounded-xl flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#C9A24B] flex-shrink-0 mt-0.5" />
              <span>
                <strong>High Maxillary Labial Frenal Attachment (Lec 2):</strong> Fibers insert into the incisive papilla across the midline, preventing natural mesial closure of central incisors and causing persistent midline diastema. Blanch test is positive on stretching the lip.
              </span>
            </div>
          )}

          {activeFeature === 'fistula' && (
            <div className="text-[11px] text-gray-300 bg-black/30 p-2 rounded-xl flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#C9A24B] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Draining Fistula on Attached Gingiva (Lec 2):</strong> Accompanied by a primary molar that is tender to percussion or mobile. Pathognomonic diagnostic sign of an abscessed tooth requiring immediate pulpectomy or extraction.
              </span>
            </div>
          )}

          {activeFeature === 'tongue_tie' && (
            <div className="text-[11px] text-gray-300 bg-black/30 p-2 rounded-xl flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#C9A24B] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Ankyloglossia / Tongue-Tie (Lec 2):</strong> Abnormally short, thick lingual frenulum that restricts the mobility of the tongue tip, potentially interfering with speech articulation, swallowing, and infant nursing.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
