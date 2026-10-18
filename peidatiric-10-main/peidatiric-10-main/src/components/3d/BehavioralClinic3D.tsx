import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { soundFx } from '../../utils/audio';
import {
  RotateCcw,
  Sparkles,
  Users,
  Shirt,
  HelpCircle,
  Eye,
  Smile,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const BehavioralClinic3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [attire, setAttire] = useState<'white_coat' | 'colorful'>('colorful');
  const [activeVertex, setActiveVertex] = useState<'triangle' | 'child' | 'dentist' | 'parent'>('triangle');
  const [tellShowDoStep, setTellShowDoStep] = useState<'tell' | 'show' | 'do'>('tell');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const dentistCoatRef = useRef<THREE.Mesh | null>(null);
  const childFaceRef = useRef<THREE.Mesh | null>(null);
  const triangleLinesRef = useRef<THREE.LineSegments | null>(null);
  const societyRingRef = useRef<THREE.Mesh | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e172a);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 4.5, 9);
    cameraRef.current = camera;

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 1.2, 0);

    // Warm friendly lighting
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);
    const fillLight = new THREE.HemisphereLight(0xbfdbfe, 0x1e293b, 1.3);
    scene.add(fillLight);

    // Floor platform
    const floorGeo = new THREE.CylinderGeometry(5.5, 5.5, 0.2, 32);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.1;
    scene.add(floor);

    // Pediatric Clinic Furniture & Figurines
    // 1. Pediatric Dental Chair (Friendly Pastel Turquoise)
    const chairGroup = new THREE.Group();
    const seatBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.9, 0.4, 20),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 })
    );
    chairGroup.add(seatBase);

    const seatCushion = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.35, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.35 })
    );
    seatCushion.position.set(0, 0.7, 0);
    seatCushion.rotation.x = 0.2;
    chairGroup.add(seatCushion);

    // Backrest
    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.4, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x0891b2, roughness: 0.35 })
    );
    backrest.position.set(0, 1.4, -0.9);
    backrest.rotation.x = -0.3;
    chairGroup.add(backrest);
    scene.add(chairGroup);

    // 2. Child Patient (Sitting on chair - Apex of Treatment Triangle!)
    const childGroup = new THREE.Group();
    childGroup.position.set(0, 1.2, -0.4);

    const childBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.4, 0.9, 16),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
    );
    childBody.position.y = 0.35;
    childGroup.add(childBody);

    const childHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.4 })
    );
    childHead.position.y = 0.95;
    childGroup.add(childHead);
    childFaceRef.current = childHead;
    scene.add(childGroup);

    // 3. Dentist / Dental Team Figurine (Left)
    const dentistGroup = new THREE.Group();
    dentistGroup.position.set(-1.8, 0, 0.2);

    const stool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.45, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5 })
    );
    stool.position.y = 0.3;
    dentistGroup.add(stool);

    const dentistBodyGeo = new THREE.CylinderGeometry(0.45, 0.5, 1.2, 16);
    const dentistCoatMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6, // friendly blue scrubs initially
      roughness: 0.6,
    });
    const dentistBody = new THREE.Mesh(dentistBodyGeo, dentistCoatMat);
    dentistBody.position.y = 1.2;
    dentistGroup.add(dentistBody);
    dentistCoatRef.current = dentistBody;

    const dentistHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.4 })
    );
    dentistHead.position.y = 1.95;
    dentistGroup.add(dentistHead);
    scene.add(dentistGroup);

    // 4. Parent / Caregiver Figurine (Right)
    const parentGroup = new THREE.Group();
    parentGroup.position.set(1.8, 0, 0.2);

    const parentStool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.45, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5 })
    );
    parentStool.position.y = 0.3;
    parentGroup.add(parentStool);

    const parentBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.5, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.5 })
    );
    parentBody.position.y = 1.2;
    parentGroup.add(parentBody);

    const parentHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.4 })
    );
    parentHead.position.y = 1.95;
    parentGroup.add(parentHead);
    scene.add(parentGroup);

    // 5. The Pediatric Treatment Triangle (Lec 3 Page 3)
    // Child apex (0, 2.5, -0.4), Dentist (-1.8, 1.5, 0.2), Parent (1.8, 1.5, 0.2)
    const triPoints = [
      new THREE.Vector3(0, 2.4, -0.4),
      new THREE.Vector3(-1.8, 1.5, 0.2),
      new THREE.Vector3(-1.8, 1.5, 0.2),
      new THREE.Vector3(1.8, 1.5, 0.2),
      new THREE.Vector3(1.8, 1.5, 0.2),
      new THREE.Vector3(0, 2.4, -0.4),
    ];
    const triGeo = new THREE.BufferGeometry().setFromPoints(triPoints);
    const triMat = new THREE.LineBasicMaterial({ color: 0xc9a24b, linewidth: 3 });
    const triangleLines = new THREE.LineSegments(triGeo, triMat);
    scene.add(triangleLines);
    triangleLinesRef.current = triangleLines;

    // Society Encompassing Ring
    const socGeo = new THREE.TorusGeometry(3.6, 0.08, 16, 64);
    const socMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.65,
    });
    const socMesh = new THREE.Mesh(socGeo, socMat);
    socMesh.rotation.x = Math.PI / 2;
    socMesh.position.y = 1.3;
    scene.add(socMesh);
    societyRingRef.current = socMesh;

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

      // Gentle rotation of the society ring
      if (socMesh) {
        socMesh.rotation.z += 0.003;
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

  // Update Attire color & Child response
  useEffect(() => {
    if (!dentistCoatRef.current || !childFaceRef.current) return;
    const coatMat = dentistCoatRef.current.material as THREE.MeshStandardMaterial;
    const faceMat = childFaceRef.current.material as THREE.MeshStandardMaterial;

    if (attire === 'white_coat') {
      coatMat.color.setHex(0xf8fafc); // stark white coat
      // Child conditioned fear response
      faceMat.color.setHex(0xfca5a5); // flushed apprehensive pink
    } else {
      coatMat.color.setHex(0x10b981); // friendly emerald/teal pediatric scrub
      faceMat.color.setHex(0xffedd5); // happy warm calm complexion
    }
  }, [attire]);

  // Handle vertex camera focus
  const handleVertexFocus = (v: 'triangle' | 'child' | 'dentist' | 'parent') => {
    soundFx.playClick();
    setActiveVertex(v);
    if (!cameraRef.current || !controlsRef.current) return;

    if (v === 'triangle') {
      cameraRef.current.position.set(0, 4.5, 9);
      controlsRef.current.target.set(0, 1.2, 0);
    } else if (v === 'child') {
      cameraRef.current.position.set(0, 2.2, 2.8);
      controlsRef.current.target.set(0, 1.5, -0.4);
    } else if (v === 'dentist') {
      cameraRef.current.position.set(-2.8, 2.4, 3.2);
      controlsRef.current.target.set(-1.8, 1.5, 0.2);
    } else if (v === 'parent') {
      cameraRef.current.position.set(2.8, 2.4, 3.2);
      controlsRef.current.target.set(1.8, 1.5, 0.2);
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-[#C9A24B]/30 bg-[#0e172a] shadow-xl h-[440px] sm:h-[500px] ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="bg-[#0B1F4D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#C9A24B]/40 shadow-lg pointer-events-auto flex items-center gap-2">
          <Users className="w-4 h-4 text-[#C9A24B]" />
          <div>
            <h4 className="text-white font-montserrat font-bold text-xs sm:text-sm tracking-wide">
              3D Behavioral Pedodontics & Treatment Triangle (Lec 3)
            </h4>
            <p className="text-[10px] text-gray-300 font-medium">
              Child (Apex) • Dentist • Parent • Encircled by Society
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            if (controlsRef.current && cameraRef.current) {
              cameraRef.current.position.set(0, 4.5, 9);
              controlsRef.current.target.set(0, 1.2, 0);
              setActiveVertex('triangle');
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
            {isCollapsed ? <><ChevronUp className="w-3.5 h-3.5" /> Show Triangle Controls</> : <><ChevronDown className="w-3.5 h-3.5" /> Collapse Controls</>}
          </button>
        </div>

        <div
          className={`bg-[#0B1F4D]/95 backdrop-blur-md rounded-2xl border border-[#C9A24B]/40 p-3 shadow-2xl transition-all duration-300 ${
            isCollapsed ? 'max-h-0 py-0 border-transparent opacity-0 pointer-events-none' : 'max-h-72 opacity-100'
          }`}
        >
          {/* Controls: Focus & Attire */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap gap-1">
              <span className="text-[10px] text-gray-400 self-center mr-1">Focus Point:</span>
              <button
                onClick={() => handleVertexFocus('triangle')}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeVertex === 'triangle' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Full Triangle
              </button>
              <button
                onClick={() => handleVertexFocus('child')}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeVertex === 'child' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                1. Child (Apex)
              </button>
              <button
                onClick={() => handleVertexFocus('dentist')}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeVertex === 'dentist' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                2. Dentist
              </button>
              <button
                onClick={() => handleVertexFocus('parent')}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeVertex === 'parent' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                3. Parent
              </button>
            </div>

            {/* Attire Switcher (Lec 3 Page 11) */}
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-xl border border-white/10">
              <Shirt className="w-3.5 h-3.5 text-[#C9A24B]" />
              <button
                onClick={() => {
                  soundFx.playClick();
                  setAttire('colorful');
                }}
                className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                  attire === 'colorful' ? 'bg-emerald-500 text-white' : 'text-gray-400'
                }`}
              >
                Pediatric Attire
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setAttire('white_coat');
                }}
                className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                  attire === 'white_coat' ? 'bg-slate-200 text-slate-900' : 'text-gray-400'
                }`}
              >
                White Coat
              </button>
            </div>
          </div>

          {/* Educational Note */}
          <div className="text-[11px] text-gray-300 bg-black/30 p-2 rounded-xl flex items-start gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C9A24B] flex-shrink-0 mt-0.5" />
            <div>
              <strong>The Pedodontic Triangle Principle (Lec 3):</strong> In adult dentistry, it is a 1-to-1 relationship. In pediatric dentistry, it is a <strong>1-to-2 relationship</strong> (Dentist, Child, and Parent) encircled by <strong>Society</strong>. The child is at the apex because he/she is the focus of both the family and dental team.
              {attire === 'white_coat' ? (
                <span className="block mt-1 text-amber-300">
                  ⚠️ <strong>White Coat & Mask Effect (Lec 3 p.11):</strong> Children with past negative medical experiences (surgeries, injections) often exhibit conditioned fear upon seeing white coats. Colorful child-friendly attire promotes calm rapport!
                </span>
              ) : (
                <span className="block mt-1 text-emerald-300">
                  ✨ <strong>Child-Friendly Attire:</strong> Helps dissolve apprehension and makes the clinic feel warm and non-threatening.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
