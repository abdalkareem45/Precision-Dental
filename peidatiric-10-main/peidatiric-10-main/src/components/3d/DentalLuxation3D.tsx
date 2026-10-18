import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { soundFx } from '../../utils/audio';
import {
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Clock,
  Droplets,
} from 'lucide-react';

type LuxationType = 'normal' | 'intrusion' | 'extrusion' | 'lateral_luxation' | 'avulsion';

interface DentalLuxation3DProps {
  initialType?: LuxationType;
  dentitionType?: 'permanent' | 'primary';
  className?: string;
}

export const DentalLuxation3D: React.FC<DentalLuxation3DProps> = ({
  initialType = 'intrusion',
  dentitionType = 'permanent',
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [luxation, setLuxation] = useState<LuxationType>(initialType);
  const [dentition, setDentition] = useState<'permanent' | 'primary'>(dentitionType);
  const [hasSplint, setHasSplint] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const controlsRef = useRef<OrbitControls | null>(null);
  const toothRef = useRef<THREE.Group | null>(null);
  const splintRef = useRef<THREE.Group | null>(null);
  const socketClotRef = useRef<THREE.Mesh | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Reusable vector targets
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const targetRot = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.FogExp2(0x0f172a, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.8, 7.5);

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
    controls.minDistance = 3.5;
    controls.maxDistance = 14;
    controls.target.set(0, 0.2, 0);

    // Studio Lights
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.8);
    keyLight.position.set(3, 7, 5);
    keyLight.castShadow = !isHeadless;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc9a24b, 1.5);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Alveolar Ridge & Sockets
    const ridgeGroup = new THREE.Group();
    scene.add(ridgeGroup);

    // Maxillary bone arch segment
    const boneGeo = new THREE.BoxGeometry(7, 2.5, 2.6);
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xdecbb5,
      roughness: 0.8,
    });
    const boneMesh = new THREE.Mesh(boneGeo, boneMat);
    boneMesh.position.y = -1.25;
    ridgeGroup.add(boneMesh);

    // Pink Gingival Tissue
    const gumGeo = new THREE.BoxGeometry(7.1, 0.9, 2.7);
    const gumMat = new THREE.MeshStandardMaterial({
      color: 0xeb7a7a,
      roughness: 0.45,
    });
    const gumMesh = new THREE.Mesh(gumGeo, gumMat);
    gumMesh.position.y = -0.1;
    ridgeGroup.add(gumMesh);

    // Empty bleeding socket blood clot (for avulsion)
    const clotGeo = new THREE.CylinderGeometry(0.55, 0.25, 1.8, 16);
    const clotMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.3,
      emissive: 0x450a0a,
      emissiveIntensity: 0.5,
    });
    const clotMesh = new THREE.Mesh(clotGeo, clotMat);
    clotMesh.position.set(0, -1.0, 0);
    ridgeGroup.add(clotMesh);
    socketClotRef.current = clotMesh;
    clotMesh.visible = false;

    // Adjacent Reference Teeth (Right Central & Left Lateral incisors)
    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xfaf8f3,
      roughness: 0.12,
      clearcoat: 1.0,
      transmission: 0.1,
      ior: 1.55,
    });

    [-1.7, 1.7].forEach((xPos) => {
      const adjGroup = new THREE.Group();
      const adjCrownGeo = new THREE.BoxGeometry(0.95, 1.7, 0.7);
      adjCrownGeo.translate(0, 0.85, 0);
      const adjCrown = new THREE.Mesh(adjCrownGeo, enamelMat);
      adjGroup.add(adjCrown);

      const adjRootGeo = new THREE.ConeGeometry(0.45, 2.2, 16);
      adjRootGeo.rotateX(Math.PI);
      adjRootGeo.translate(0, -1.1, 0);
      const adjRootMat = new THREE.MeshStandardMaterial({ color: 0xedd59c, roughness: 0.5 });
      const adjRoot = new THREE.Mesh(adjRootGeo, adjRootMat);
      adjGroup.add(adjRoot);

      adjGroup.position.set(xPos, 0, 0);
      ridgeGroup.add(adjGroup);
    });

    // Central Injured Tooth
    const toothGroup = new THREE.Group();
    scene.add(toothGroup);
    toothRef.current = toothGroup;

    const mainCrownGeo = new THREE.BoxGeometry(1.05, 1.8, 0.75);
    mainCrownGeo.translate(0, 0.9, 0);
    const mainCrown = new THREE.Mesh(mainCrownGeo, enamelMat.clone());
    mainCrown.castShadow = true;
    toothGroup.add(mainCrown);

    const mainRootGeo = new THREE.ConeGeometry(0.5, 2.4, 20);
    mainRootGeo.rotateX(Math.PI);
    mainRootGeo.translate(0, -1.2, 0);
    const mainRootMat = new THREE.MeshStandardMaterial({ color: 0xecd096, roughness: 0.5 });
    const mainRoot = new THREE.Mesh(mainRootGeo, mainRootMat);
    toothGroup.add(mainRoot);

    // Flexible Splint Group (0.016 wire + resin)
    const splintGroup = new THREE.Group();
    const splintWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 4.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.2 })
    );
    splintWire.rotation.z = Math.PI / 2;
    splintWire.position.set(0, 0.9, 0.45);
    splintGroup.add(splintWire);

    [-1.7, 0, 1.7].forEach((x) => {
      const resinDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshPhysicalMaterial({ color: 0xfef08a, roughness: 0.2, transmission: 0.2 })
      );
      resinDot.position.set(x, 0.9, 0.45);
      splintGroup.add(resinDot);
    });
    scene.add(splintGroup);
    splintRef.current = splintGroup;
    splintGroup.visible = false;

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

      if (toothRef.current) {
        toothRef.current.position.lerp(targetPos.current, 0.08);
        toothRef.current.rotation.x = THREE.MathUtils.lerp(toothRef.current.rotation.x, targetRot.current.x, 0.08);
        toothRef.current.rotation.y = THREE.MathUtils.lerp(toothRef.current.rotation.y, targetRot.current.y, 0.08);
        toothRef.current.rotation.z = THREE.MathUtils.lerp(toothRef.current.rotation.z, targetRot.current.z, 0.08);
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

  // Update target transforms based on luxation type
  useEffect(() => {
    if (!socketClotRef.current || !splintRef.current) return;

    socketClotRef.current.visible = false;
    splintRef.current.visible = hasSplint;

    switch (luxation) {
      case 'normal':
        targetPos.current.set(0, 0, 0);
        targetRot.current.set(0, 0, 0);
        break;

      case 'intrusion':
        // Driven into alveolar socket: Crown appears clinically shorter
        targetPos.current.set(0, -1.2, 0);
        targetRot.current.set(0, 0, 0);
        break;

      case 'extrusion':
        // Partial displacement out of socket: Crown appears clinically longer
        targetPos.current.set(0, 0.9, 0);
        targetRot.current.set(0, 0, 0);
        break;

      case 'lateral_luxation':
        // Displaced in non-axial direction (locked in cortical plate)
        targetPos.current.set(0.35, 0.2, 0.35);
        targetRot.current.set(0.25, 0, 0.28);
        break;

      case 'avulsion':
        // Tooth completely out of socket
        targetPos.current.set(2.8, 1.8, 0.8);
        targetRot.current.set(0.5, 0.2, 0.8);
        socketClotRef.current.visible = true; // show bleeding socket
        break;
    }
  }, [luxation, hasSplint]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#C9A24B]/30 bg-[#0f172a] shadow-xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[440px] sm:h-[500px]'
      } ${className}`}
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Header Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="bg-[#0B1F4D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#C9A24B]/40 shadow-lg pointer-events-auto flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#C9A24B]" />
          <div>
            <h4 className="text-white font-montserrat font-bold text-xs sm:text-sm tracking-wide">
              3D Dental Luxation & Avulsion Simulator (Lec 10)
            </h4>
            <p className="text-[10px] text-gray-300 font-medium">
              Intrusion • Extrusion • Lateral Luxation • Avulsion Protocols
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Dentition Type Toggle */}
          <div className="bg-[#0B1F4D]/90 p-1 rounded-lg border border-[#C9A24B]/30 flex text-xs">
            <button
              onClick={() => {
                soundFx.playClick();
                setDentition('permanent');
              }}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                dentition === 'permanent' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'text-gray-300'
              }`}
            >
              Permanent
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setDentition('primary');
              }}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                dentition === 'primary' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'text-gray-300'
              }`}
            >
              Primary
            </button>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              if (controlsRef.current) controlsRef.current.reset();
            }}
            className="bg-[#0B1F4D]/90 hover:bg-[#1B3A8C] text-white p-2 rounded-lg border border-[#C9A24B]/30 transition-all shadow-md"
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

      {/* Splint Toggle Button */}
      <div className="absolute top-16 right-3 pointer-events-auto">
        <button
          onClick={() => {
            soundFx.playClick();
            setHasSplint(!hasSplint);
          }}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
            hasSplint
              ? 'bg-[#C9A24B] text-[#0B1F4D] border-amber-300'
              : 'bg-[#0B1F4D]/90 text-white border-[#C9A24B]/40 hover:bg-[#1B3A8C]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {hasSplint ? 'Remove Splint' : 'Apply Flexible Splint'}
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
            {isCollapsed ? <><ChevronUp className="w-3.5 h-3.5" /> Show Luxation Rules</> : <><ChevronDown className="w-3.5 h-3.5" /> Collapse Controls</>}
          </button>
        </div>

        <div
          className={`bg-[#0B1F4D]/95 backdrop-blur-md rounded-2xl border border-[#C9A24B]/40 p-3 shadow-2xl transition-all duration-300 ${
            isCollapsed ? 'max-h-0 py-0 border-transparent opacity-0 pointer-events-none' : 'max-h-80 opacity-100'
          }`}
        >
          {/* Luxation Buttons */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {(
              [
                ['normal', 'Normal Anatomy'],
                ['intrusion', 'Intrusion (Most Severe)'],
                ['extrusion', 'Extrusive Luxation'],
                ['lateral_luxation', 'Lateral Luxation'],
                ['avulsion', 'Complete Avulsion'],
              ] as const
            ).map(([type, label]) => (
              <button
                key={type}
                onClick={() => {
                  soundFx.playClick();
                  setLuxation(type);
                }}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  luxation === type
                    ? 'bg-[#C9A24B] text-[#0B1F4D] shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Clinical Management Directive based on dentition & injury */}
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 text-xs text-gray-200">
            {luxation === 'intrusion' && dentition === 'primary' && (
              <div className="space-y-1">
                <span className="font-bold text-amber-400">Primary Tooth Intrusion:</span>
                <p>
                  Common in first 3 years. <strong>Best approach is "Wait and watch"</strong> for the tooth to re-erupt spontaneously within 3 to 4 weeks.
                  <br />
                  <span className="text-red-400 font-semibold">Critical exception:</span> If lateral radiograph shows the intruded primary root is displaced lingually into the developing permanent incisor bud, <strong>extract the primary tooth immediately</strong> to prevent permanent germ damage!
                </p>
              </div>
            )}

            {luxation === 'intrusion' && dentition === 'permanent' && (
              <div className="space-y-1">
                <span className="font-bold text-amber-400">Permanent Tooth Intrusion (100% Pulp Necrosis Risk):</span>
                <p>
                  • <strong>Immature (Open Apex):</strong> Allow spontaneous re-eruption. If no movement in 2-4 weeks, orthodontic extrusion.
                  <br />
                  • <strong>Mature (Closed Apex) &lt;3 mm:</strong> Allow spontaneous eruption.
                  <br />
                  • <strong>Mature &gt;7 mm:</strong> Surgical repositioning + flexible splint 4-8 weeks + initiate RCT with Ca(OH)2 within 2-3 weeks.
                </p>
              </div>
            )}

            {luxation === 'extrusion' && (
              <div className="space-y-1">
                <span className="font-bold text-amber-400">Extrusive Luxation (Partial Displacement):</span>
                <p>
                  Crown appears elongated. Careful immediate repositioning into socket with gentle digital pressure.
                  <br />
                  Stabilize with a <strong>flexible splint for 2 weeks</strong>. If mature tooth fails vitality at 2-3 weeks, endodontic therapy is indicated before root resorption develops.
                </p>
              </div>
            )}

            {luxation === 'lateral_luxation' && (
              <div className="space-y-1">
                <span className="font-bold text-amber-400">Lateral Luxation (Displacement non-axial):</span>
                <p>
                  Crown displaced palatally/labially, apex wedged tightly in cortical plate. Highly immobile.
                  <br />
                  Under local anesthesia, disengage apex from cortical bone using digital pressure. <strong>Splint for 2 weeks</strong> (or <strong>4-6 weeks if alveolar bone fracture</strong> is present).
                </p>
              </div>
            )}

            {luxation === 'avulsion' && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-400 uppercase tracking-wide">
                    {dentition === 'primary' ? '⚠️ PRIMARY TEETH ARE NEVER REPLANTED!' : 'PERMANENT TOOTH AVULSION PROTOCOL'}
                  </span>
                </div>
                {dentition === 'primary' ? (
                  <p className="text-red-300">
                    Replantation of primary teeth is contraindicated due to high risk of introducing infection or ankylosis that damages the underlying permanent tooth germ.
                  </p>
                ) : (
                  <p>
                    • <strong>Immediate Replantation</strong> at site of accident has the highest success rate!
                    <br />
                    • <strong>Transport Media:</strong> HBSS &gt; Cold pasteurized milk &gt; Saliva &gt; Saline &gt;&gt; Tap water (harmful cell lysis!).
                    <br />
                    • <strong>Dry time &lt;60 min:</strong> Clean gently with saline, replant, flexible splint 7-14 days. Endodontics in 7-10 days for closed apex.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
