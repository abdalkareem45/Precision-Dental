import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ToothPathology, RepairStep, RepStep } from '../../types';
import { soundFx } from '../../utils/audio';
import {
  RotateCcw,
  Sparkles,
  Layers,
  Wand2,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Info,
} from 'lucide-react';

interface ToothTrauma3DProps {
  pathology?: ToothPathology;
  allowPathologyChange?: boolean;
  allowInteractiveRepair?: boolean;
  allowRepStepChange?: boolean;
  fractureLevel?: 'cervical' | 'middle' | 'apical';
  onFractureLevelChange?: (level: 'cervical' | 'middle' | 'apical') => void;
  title?: string;
  className?: string;
}

export const ToothTrauma3D: React.FC<ToothTrauma3DProps> = ({
  pathology: initialPathology = 'normal',
  allowPathologyChange = true,
  allowInteractiveRepair = false,
  allowRepStepChange = false,
  fractureLevel = 'middle',
  onFractureLevelChange,
  title,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activePathology, setActivePathology] = useState<ToothPathology>(initialPathology);
  const [repairStep, setRepairStep] = useState<RepairStep>('inspect');
  const [repStep, setRepStep] = useState<RepStep>('initial');
  const [showCrossSection, setShowCrossSection] = useState<boolean>(true);
  const [isSplintApplied, setIsSplintApplied] = useState<boolean>(false);
  const [isCuringActive, setIsCuringActive] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync pathology prop
  useEffect(() => {
    setActivePathology(initialPathology);
  }, [initialPathology]);

  // Keep references to 3D parts
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const toothGroupRef = useRef<THREE.Group | null>(null);
  const fragmentMeshRef = useRef<THREE.Mesh | null>(null);
  const curingLightRef = useRef<THREE.SpotLight | null>(null);
  const curingLightBeamRef = useRef<THREE.Mesh | null>(null);
  const pulpMeshRef = useRef<THREE.Mesh | null>(null);
  const enamelMeshRef = useRef<THREE.Mesh | null>(null);
  const dentinMeshRef = useRef<THREE.Mesh | null>(null);
  const boneMeshRef = useRef<THREE.Mesh | null>(null);
  const pdlMeshRef = useRef<THREE.Mesh | null>(null);
  const splintWireRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Reusable 3D math helpers (Zero GC)
  const targetFragmentPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const targetFragmentRot = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0e1726); // Deep rich navy background for high contrast
    scene.fog = new THREE.FogExp2(0x0e1726, 0.05);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2, 7.5);

    // Renderer
    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Environment reflection using RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.5;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI / 1.75;
    controls.target.set(0, 0.5, 0);

    // Lighting rig: 3-point studio lighting
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isHeadless;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc9a24b, 1.6);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    // Soft contact shadow plane beneath
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d')!;
    const grad = sctx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.5;
    scene.add(shadowMesh);

    // Curing Blue UV Light (initially hidden)
    const curingLight = new THREE.SpotLight(0x2563eb, 0, 8, Math.PI / 6, 0.3, 1);
    curingLight.position.set(1.5, 2.5, 2);
    curingLight.target.position.set(0, 0.8, 0);
    scene.add(curingLight);
    scene.add(curingLight.target);
    curingLightRef.current = curingLight;

    // Curing beam cone visual
    const beamGeo = new THREE.ConeGeometry(0.8, 2.8, 16, 1, true);
    beamGeo.translate(0, -1.4, 0);
    beamGeo.rotateX(Math.PI);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.copy(curingLight.position);
    beamMesh.lookAt(curingLight.target.position);
    scene.add(beamMesh);
    curingLightBeamRef.current = beamMesh;

    // Procedural 3D Tooth Model Group
    const toothGroup = new THREE.Group();
    toothGroupRef.current = toothGroup;
    scene.add(toothGroup);

    // 1. Alveolar Bone (Socket Base)
    const boneGeo = new THREE.CylinderGeometry(1.6, 1.8, 2.4, 24, 1, false, 0, Math.PI * 1.5);
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xd4c2a5,
      roughness: 0.85,
      metalness: 0.05,
      bumpScale: 0.04,
      side: THREE.DoubleSide,
    });
    const boneMesh = new THREE.Mesh(boneGeo, boneMat);
    boneMesh.position.y = -1.4;
    boneMesh.castShadow = true;
    boneMesh.receiveShadow = true;
    toothGroup.add(boneMesh);
    boneMeshRef.current = boneMesh;

    // Gingival cuff (Pink soft tissue)
    const gingivaGeo = new THREE.TorusGeometry(1.4, 0.35, 16, 32, Math.PI * 1.5);
    const gingivaMat = new THREE.MeshStandardMaterial({
      color: 0xe07a7a,
      roughness: 0.45,
      metalness: 0.05,
    });
    const gingivaMesh = new THREE.Mesh(gingivaGeo, gingivaMat);
    gingivaMesh.rotation.x = Math.PI / 2;
    gingivaMesh.position.y = -0.2;
    toothGroup.add(gingivaMesh);

    // Periodontal Ligament (PDL) Fiber Layer
    const pdlGeo = new THREE.CylinderGeometry(0.95, 0.6, 2.3, 24, 1, true);
    const pdlMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.6,
      transparent: true,
      opacity: 0.4,
    });
    const pdlMesh = new THREE.Mesh(pdlGeo, pdlMat);
    pdlMesh.position.y = -1.35;
    toothGroup.add(pdlMesh);
    pdlMeshRef.current = pdlMesh;

    // 2. Tooth Root (Cementum / Dentin)
    const rootPoints = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const radius = 0.85 * (1 - t * 0.75) + 0.1;
      const y = -t * 2.3;
      rootPoints.push(new THREE.Vector2(radius, y));
    }
    const rootGeo = new THREE.LatheGeometry(rootPoints, 32);
    const rootMat = new THREE.MeshStandardMaterial({
      color: 0xf5eed7,
      roughness: 0.5,
      metalness: 0.05,
    });
    const rootMesh = new THREE.Mesh(rootGeo, rootMat);
    toothGroup.add(rootMesh);

    // 3. Tooth Crown (Enamel)
    // Procedural upper central incisor shape
    const crownShape = new THREE.Shape();
    crownShape.moveTo(-0.9, 0);
    crownShape.quadraticCurveTo(-0.95, 1.2, -0.85, 1.8);
    crownShape.quadraticCurveTo(0, 1.95, 0.85, 1.8);
    crownShape.quadraticCurveTo(0.95, 1.2, 0.9, 0);
    crownShape.closePath();

    const extrudeSettings = {
      depth: 0.85,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.22,
      bevelThickness: 0.22,
    };
    const crownGeo = new THREE.ExtrudeGeometry(crownShape, extrudeSettings);
    crownGeo.center();
    crownGeo.translate(0, 1.0, 0);

    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xfaf9f5,
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transmission: 0.15,
      ior: 1.58,
    });
    const crownMesh = new THREE.Mesh(crownGeo, enamelMat);
    crownMesh.castShadow = true;
    crownMesh.receiveShadow = true;
    toothGroup.add(crownMesh);
    enamelMeshRef.current = crownMesh;

    // 4. Dentin Core (Golden-yellow internal body visible in cross-section)
    const dentinShape = new THREE.Shape();
    dentinShape.moveTo(-0.75, 0);
    dentinShape.quadraticCurveTo(-0.8, 1.0, -0.65, 1.55);
    dentinShape.quadraticCurveTo(0, 1.65, 0.65, 1.55);
    dentinShape.quadraticCurveTo(0.8, 1.0, 0.75, 0);
    dentinShape.closePath();
    const dentinGeo = new THREE.ExtrudeGeometry(dentinShape, {
      depth: 0.65,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.12,
      bevelThickness: 0.12,
    });
    dentinGeo.center();
    dentinGeo.translate(0, 0.9, 0);
    const dentinMat = new THREE.MeshStandardMaterial({
      color: 0xedd59c,
      roughness: 0.65,
      metalness: 0.05,
    });
    const dentinMesh = new THREE.Mesh(dentinGeo, dentinMat);
    toothGroup.add(dentinMesh);
    dentinMeshRef.current = dentinMesh;

    // 5. Dental Pulp Chamber & Canal (Vascular rich red/pink core)
    const pulpCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -2.1, 0),
      new THREE.Vector3(0, -1.0, 0),
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(-0.25, 0.9, 0),
      new THREE.Vector3(0.25, 0.9, 0),
    ]);
    const pulpGeo = new THREE.TubeGeometry(pulpCurve, 32, 0.16, 12, false);
    const pulpMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.35,
      metalness: 0.1,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.3,
    });
    const pulpMesh = new THREE.Mesh(pulpGeo, pulpMat);
    toothGroup.add(pulpMesh);
    pulpMeshRef.current = pulpMesh;

    // 6. Detachable Fractured Tooth Fragment (for Ellis II / III & Reattachment)
    const fragShape = new THREE.Shape();
    fragShape.moveTo(0.1, 1.1);
    fragShape.lineTo(0.85, 1.8);
    fragShape.lineTo(0.4, 1.9);
    fragShape.lineTo(0.1, 1.1);
    fragShape.closePath();
    const fragGeo = new THREE.ExtrudeGeometry(fragShape, {
      depth: 0.8,
      bevelEnabled: true,
      bevelSize: 0.08,
      bevelThickness: 0.08,
      bevelSegments: 3,
    });
    fragGeo.center();
    fragGeo.translate(0.5, 1.5, 0);
    const fragMat = enamelMat.clone();
    const fragMesh = new THREE.Mesh(fragGeo, fragMat);
    fragMesh.castShadow = true;
    toothGroup.add(fragMesh);
    fragmentMeshRef.current = fragMesh;
    fragMesh.visible = false;

    // 7. Splint Wire (0.016x0.022 flexible or 0.036 rigid wire)
    const splintGroup = new THREE.Group();
    const wireCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, 0.8, 0.65),
      new THREE.Vector3(-1.0, 0.85, 0.72),
      new THREE.Vector3(0, 0.85, 0.74),
      new THREE.Vector3(1.0, 0.85, 0.72),
      new THREE.Vector3(2.2, 0.8, 0.65),
    ]);
    const wireGeo = new THREE.TubeGeometry(wireCurve, 32, 0.038, 8, false);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.2,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    splintGroup.add(wireMesh);

    // Composite resin buttons on teeth
    [-1.0, 0, 1.0].forEach((x) => {
      const buttonGeo = new THREE.SphereGeometry(0.14, 16, 16);
      buttonGeo.scale(1.2, 0.8, 0.5);
      const buttonMat = new THREE.MeshPhysicalMaterial({
        color: 0xfef08a,
        roughness: 0.15,
        transmission: 0.3,
        ior: 1.5,
      });
      const buttonMesh = new THREE.Mesh(buttonGeo, buttonMat);
      buttonMesh.position.set(x, 0.85, 0.72);
      splintGroup.add(buttonMesh);
    });
    toothGroup.add(splintGroup);
    splintWireRef.current = splintGroup;
    splintGroup.visible = false;

    // Resize observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with smooth exponential damping
    const clock = new THREE.Clock();
    const tick = () => {
      const delta = clock.getDelta();
      controls.update();

      // Smooth fragment positioning for reattachment animation
      if (fragmentMeshRef.current && fragmentMeshRef.current.visible) {
        fragmentMeshRef.current.position.lerp(targetFragmentPos.current, 0.08);
      }

      // Render
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

  // Update Visual Pathology & Shaders based on state
  useEffect(() => {
    if (!pulpMeshRef.current || !enamelMeshRef.current || !dentinMeshRef.current || !toothGroupRef.current)
      return;

    const pulpMat = pulpMeshRef.current.material as THREE.MeshStandardMaterial;
    const enamelMat = enamelMeshRef.current.material as THREE.MeshPhysicalMaterial;
    const boneMesh = boneMeshRef.current;
    const pdlMesh = pdlMeshRef.current;

    // Reset default transforms
    toothGroupRef.current.position.set(0, 0, 0);
    toothGroupRef.current.rotation.set(0, 0, 0);

    // Reset standard colors
    pulpMat.color.setHex(0xdc2626);
    pulpMat.emissive.setHex(0x7f1d1d);
    pulpMat.emissiveIntensity = 0.3;
    enamelMat.color.setHex(0xfaf9f5);
    enamelMat.roughness = 0.12;
    enamelMat.transmission = 0.15;
    enamelMat.opacity = 1.0;
    enamelMat.transparent = false;

    if (fragmentMeshRef.current) {
      fragmentMeshRef.current.visible = false;
    }
    if (splintWireRef.current) {
      splintWireRef.current.visible = isSplintApplied;
    }

    pulpMeshRef.current.scale.set(1, 1, 1);

    switch (activePathology) {
      case 'normal':
        pulpMat.color.setHex(0xdc2626); // healthy bright red pulp
        break;

      case 'craze':
        // Craze lines: slightly rougher enamel with micro crack lines
        enamelMat.roughness = 0.35;
        break;

      case 'fracture_enamel_dentin':
        // Ellis Class II: Show detached fragment nearby
        if (fragmentMeshRef.current) {
          fragmentMeshRef.current.visible = true;
          if (repairStep === 'inspect') {
            targetFragmentPos.current.set(1.4, 1.8, 0.5);
          } else if (repairStep === 'seat_fragment' || repairStep === 'light_cure' || repairStep === 'finished') {
            targetFragmentPos.current.set(0.5, 1.5, 0);
          }
        }
        break;

      case 'fracture_pulp_exposure':
        // Ellis Class III: Exposed bleeding pulp horn
        pulpMat.color.setHex(0xff0000);
        pulpMat.emissive.setHex(0xff0000);
        pulpMat.emissiveIntensity = 0.8;
        if (fragmentMeshRef.current) {
          fragmentMeshRef.current.visible = true;
          targetFragmentPos.current.set(1.6, 2.0, 0.4);
        }
        break;

      case 'hyperemia':
        // Pulpal hyperemia: transilluminated reddish glow inside coronal pulp
        pulpMat.color.setHex(0xff1e1e);
        pulpMat.emissive.setHex(0xff3333);
        pulpMat.emissiveIntensity = 0.9;
        enamelMat.transmission = 0.5; // see-through reddish hyperemia
        break;

      case 'internal_hemorrhage':
        // Rupture of capillaries -> hemolysis into dentinal tubules -> dark gray/black discoloration
        enamelMat.color.setHex(0x374151); // Dark necrotic gray
        pulpMat.color.setHex(0x18181b); // Black autolyzed pulp
        pulpMat.emissiveIntensity = 0;
        break;

      case 'calcific_metamorphosis':
        // Progressive canal calcification: Yellowish opaque crown & obliterated pulp canal
        enamelMat.color.setHex(0xfef08a); // Yellowish opaque
        pulpMeshRef.current.scale.set(0.2, 1, 0.2); // severely narrowed/obliterated canal
        pulpMat.color.setHex(0xd97706);
        break;

      case 'internal_resorption':
        // "Pink spot" of Mummery: vascular hyperplastic pulp shining through thin enamel
        enamelMat.color.setHex(0xfce7f3);
        pulpMat.color.setHex(0xec4899); // bright pink vascular mass
        pulpMat.emissive.setHex(0xdb2777);
        pulpMat.emissiveIntensity = 0.7;
        break;

      case 'external_resorption':
        // Moth-eaten peripheral root margins
        if (pdlMesh) {
          const m = pdlMesh.material as THREE.MeshStandardMaterial;
          m.color.setHex(0x7f1d1d);
        }
        break;

      case 'pulpal_necrosis':
        // Non-vital pulp: grayish brown, loss of vitality
        enamelMat.color.setHex(0x4b5563);
        pulpMat.color.setHex(0x27272a);
        pulpMat.emissiveIntensity = 0;
        break;

      case 'intrusion':
        // Driven into alveolar bone -> clinically shorter crown
        toothGroupRef.current.position.y = -1.2;
        break;

      case 'extrusion':
        // Partial displacement out of socket -> clinically elongated crown
        toothGroupRef.current.position.y = 1.0;
        break;

      case 'lateral_luxation':
        // Displaced palatally or labially, crown tilted, apex crushed into bone
        toothGroupRef.current.rotation.z = 0.28;
        toothGroupRef.current.position.x = 0.4;
        break;

      case 'avulsion':
        // Completely out of socket
        toothGroupRef.current.position.set(2.5, 1.8, 1.0);
        toothGroupRef.current.rotation.z = Math.PI / 4;
        break;

      case 'dilaceration':
        // Sharp hook-like bend of root resulting from primary tooth intruded predecessor
        toothGroupRef.current.rotation.z = -0.15;
        break;

      case 'cervical_root_fracture':
      case 'middle_root_fracture':
      case 'apical_root_fracture':
        if (splintWireRef.current) splintWireRef.current.visible = true;
        break;
    }
  }, [activePathology, repairStep, isSplintApplied]);

  // Handle interactive fragment reattachment steps
  const handleRepairStepChange = (nextStep: RepairStep) => {
    soundFx.playClick();
    setRepairStep(nextStep);

    if (nextStep === 'light_cure') {
      setIsCuringActive(true);
      soundFx.playLightCure();
      if (curingLightRef.current && curingLightBeamRef.current) {
        curingLightRef.current.intensity = 8.0;
        const bm = curingLightBeamRef.current.material as THREE.MeshBasicMaterial;
        bm.opacity = 0.6;
      }
      setTimeout(() => {
        setIsCuringActive(false);
        if (curingLightRef.current && curingLightBeamRef.current) {
          curingLightRef.current.intensity = 0;
          const bm = curingLightBeamRef.current.material as THREE.MeshBasicMaterial;
          bm.opacity = 0;
        }
        setRepairStep('finished');
        soundFx.playSuccess();
      }, 2500);
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    soundFx.playClick();
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0.5, 0);
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#C9A24B]/30 bg-[#0e1726] shadow-xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[440px] sm:h-[500px] md:h-[560px]'
      } ${className}`}
    >
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Overlay: Minimal Title & Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="bg-[#0B1F4D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#C9A24B]/40 shadow-lg pointer-events-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A24B]" />
          <div>
            <h4 className="text-white font-montserrat font-bold text-xs sm:text-sm tracking-wide">
              {title || '3D Interactive Dental Anatomical Simulator'}
            </h4>
            <p className="text-[10px] text-gray-300 font-medium">
              Precision Dental • 3D Biomechanical & Histological Model
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Cross Section Toggle */}
          <button
            onClick={() => {
              soundFx.playClick();
              setShowCrossSection(!showCrossSection);
              if (boneMeshRef.current) boneMeshRef.current.visible = !showCrossSection;
            }}
            className="bg-[#0B1F4D]/90 hover:bg-[#1B3A8C] text-white p-2 rounded-lg border border-[#C9A24B]/30 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-md"
            title="Toggle cross-section view"
          >
            <Layers className="w-4 h-4 text-[#C9A24B]" />
            <span className="hidden sm:inline">Cross-Section</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="bg-[#0B1F4D]/90 hover:bg-[#1B3A8C] text-white p-2 rounded-lg border border-[#C9A24B]/30 transition-all shadow-md"
            title="Reset 3D camera"
          >
            <RotateCcw className="w-4 h-4 text-[#C9A24B]" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsFullscreen(!isFullscreen);
            }}
            className="bg-[#0B1F4D]/90 hover:bg-[#1B3A8C] text-white p-2 rounded-lg border border-[#C9A24B]/30 transition-all shadow-md"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-[#C9A24B]" />
            ) : (
              <Maximize2 className="w-4 h-4 text-[#C9A24B]" />
            )}
          </button>
        </div>
      </div>

      {/* Curing light indicator banner */}
      {isCuringActive && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-blue-600/95 text-white px-5 py-2 rounded-full font-bold text-xs tracking-wider uppercase shadow-2xl flex items-center gap-2 border border-blue-300 animate-pulse">
          <Wand2 className="w-4 h-4 text-cyan-200" />
          UV Light Curing in Progress (460nm wavelength)...
        </div>
      )}

      {/* Touch & Interaction Hint (Mobile & Tablet) */}
      <div className="absolute top-16 left-4 text-[10px] text-gray-400 bg-black/40 px-2.5 py-1 rounded-md pointer-events-none hidden sm:block">
        Drag to rotate • Pinch / Scroll to zoom • Right-click to pan
      </div>

      {/* Bottom Consolidated Dock (Follows Ergonomic Three.js Constitution) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl transition-all duration-300 ease-in-out z-20">
        {/* Collapse Toggle Handle */}
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsCollapsed(!isCollapsed);
            }}
            className="bg-[#0B1F4D] hover:bg-[#1B3A8C] text-[#C9A24B] px-3 py-1 rounded-t-xl border-t border-x border-[#C9A24B]/40 text-xs font-semibold flex items-center gap-1 shadow-lg cursor-pointer"
          >
            {isCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Show Controls & Pathology
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Collapse Controls
              </>
            )}
          </button>
        </div>

        {/* Main Dock Container */}
        <div
          className={`bg-[#0B1F4D]/95 backdrop-blur-md rounded-2xl border border-[#C9A24B]/40 p-3 shadow-2xl transition-all duration-300 overflow-hidden ${
            isCollapsed ? 'max-h-0 py-0 border-transparent opacity-0 pointer-events-none' : 'max-h-80 opacity-100'
          }`}
        >
          {/* Interactive Reattachment Step-by-Step Lab (If enabled) */}
          {allowInteractiveRepair && activePathology === 'fracture_enamel_dentin' && (
            <div className="mb-3 p-2.5 bg-[#1B3A8C]/40 rounded-xl border border-[#C9A24B]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#C9A24B] flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  Clinical Reattachment Sequence (Lec 7):
                </span>
                <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">
                  Step: {repairStep.replace('_', ' ')}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  onClick={() => handleRepairStepChange('prep_base')}
                  className={`text-[11px] py-1.5 px-2 rounded-lg font-semibold transition-all ${
                    repairStep === 'prep_base'
                      ? 'bg-[#C9A24B] text-[#0B1F4D]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  1. Ca(OH)₂ Liner
                </button>
                <button
                  onClick={() => handleRepairStepChange('etch')}
                  className={`text-[11px] py-1.5 px-2 rounded-lg font-semibold transition-all ${
                    repairStep === 'etch'
                      ? 'bg-[#C9A24B] text-[#0B1F4D]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  2. Phosphoric Acid Etch
                </button>
                <button
                  onClick={() => handleRepairStepChange('seat_fragment')}
                  className={`text-[11px] py-1.5 px-2 rounded-lg font-semibold transition-all ${
                    repairStep === 'seat_fragment'
                      ? 'bg-[#C9A24B] text-[#0B1F4D]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  3. Seat Fragment
                </button>
                <button
                  onClick={() => handleRepairStepChange('light_cure')}
                  disabled={isCuringActive}
                  className={`text-[11px] py-1.5 px-2 rounded-lg font-semibold transition-all ${
                    repairStep === 'light_cure'
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#1B3A8C] text-white hover:bg-blue-600'
                  }`}
                >
                  4. Light Cure (UV)
                </button>
              </div>
            </div>
          )}

          {/* Regenerative Endodontic Procedure (REP) Sequence (Lec 8) */}
          {allowRepStepChange && activePathology === 'pulpal_necrosis' && (
            <div className="mb-3 p-2.5 bg-[#1B3A8C]/40 rounded-xl border border-[#C9A24B]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#C9A24B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  REP Triad Protocol (Stem Cells + Scaffold + Factors):
                </span>
                <span className="text-[10px] text-cyan-300 font-semibold">
                  {repStep === 'initial' && 'Immature Necrotic Open Apex'}
                  {repStep === 'disinfection' && '1.5% NaOCl & 17% EDTA Irrigation'}
                  {repStep === 'bleeding_induction' && 'Over-instrumentation -> Blood Clot'}
                  {repStep === 'mta_barrier' && 'CollaPlug + 3-4mm MTA Barrier'}
                  {repStep === 'root_thickening' && 'Reparative Canal Wall Thickening'}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {(
                  [
                    ['initial', '1. Baseline'],
                    ['disinfection', '2. Disinfect'],
                    ['bleeding_induction', '3. Bleed Clot'],
                    ['mta_barrier', '4. MTA Plug'],
                    ['root_thickening', '5. Revascularize'],
                  ] as const
                ).map(([st, label]) => (
                  <button
                    key={st}
                    onClick={() => {
                      soundFx.playClick();
                      setRepStep(st);
                      if (st === 'root_thickening') soundFx.playSuccess();
                    }}
                    className={`text-[10px] py-1.5 px-1.5 rounded-lg font-semibold transition-all text-center ${
                      repStep === st
                        ? 'bg-[#C9A24B] text-[#0B1F4D] shadow-md'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Root Fracture Height Selector (Lec 11) */}
          {onFractureLevelChange && (
            <div className="mb-3 flex items-center justify-between bg-black/30 p-2 rounded-xl border border-white/10">
              <span className="text-xs font-bold text-gray-200">Fracture Third:</span>
              <div className="flex gap-1.5">
                {(['apical', 'middle', 'cervical'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      soundFx.playClick();
                      onFractureLevelChange(lvl);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold capitalize transition-all ${
                      fractureLevel === lvl
                        ? 'bg-[#C9A24B] text-[#0B1F4D]'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {lvl} {lvl === 'apical' && '(Best!)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pathology State Selector Pills */}
          {allowPathologyChange && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#C9A24B] uppercase tracking-wider">
                  Select Visual Condition:
                </span>
                <span className="text-[10px] text-gray-400">Tap to load 3D pathology</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {(
                  [
                    ['normal', 'Healthy Tooth'],
                    ['craze', 'Crown Craze'],
                    ['fracture_enamel_dentin', 'Ellis II Fracture'],
                    ['fracture_pulp_exposure', 'Ellis III (Pulp Exposure)'],
                    ['hyperemia', 'Pulpal Hyperemia'],
                    ['internal_hemorrhage', 'Internal Hemorrhage (Necrotic)'],
                    ['calcific_metamorphosis', 'Calcific Metamorphosis'],
                    ['internal_resorption', 'Internal Resorption (Pink Spot)'],
                    ['intrusion', 'Intrusion'],
                    ['extrusion', 'Extrusion'],
                    ['lateral_luxation', 'Lateral Luxation'],
                    ['avulsion', 'Avulsion'],
                    ['dilaceration', 'Dilaceration'],
                  ] as const
                ).map(([pKey, label]) => (
                  <button
                    key={pKey}
                    onClick={() => {
                      soundFx.playClick();
                      setActivePathology(pKey);
                    }}
                    className={`text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                      activePathology === pKey
                        ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                        : 'bg-white/10 text-gray-200 hover:bg-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Diagnostic Key Note */}
          <div className="mt-2 pt-2 border-t border-white/10 flex items-start gap-1.5 text-[10px] text-gray-300">
            <Info className="w-3.5 h-3.5 text-[#C9A24B] flex-shrink-0 mt-0.5" />
            <p>
              {activePathology === 'normal' &&
                'Normal dentition: Intact translucent enamel, dentin tubule network, vascular uninflamed pulp, and continuous PDL space.'}
              {activePathology === 'craze' &&
                'Crown Craze (Lec 7): Minute micro-cracks in enamel from direct impact without tissue loss. No invasive intervention required, monitor vitality.'}
              {activePathology === 'fracture_enamel_dentin' &&
                'Ellis Class II: Loss of enamel & dentin without pulp exposure. Requires Ca(OH)2 or glass ionomer liner, followed by fragment reattachment or composite resin.'}
              {activePathology === 'fracture_pulp_exposure' &&
                'Ellis Class III: Vital pulp exposure. In immature teeth, Cvek shallow pulpotomy preserves radicular pulp vitality for apexogenesis!'}
              {activePathology === 'hyperemia' &&
                'Pulpal Hyperemia (Lec 9): Immediate congestion of pulpal blood vessels. Transilluminates with reddish coronal glow.'}
              {activePathology === 'internal_hemorrhage' &&
                'Internal Hemorrhage (Lec 9): Capillary rupture deposits RBC pigments into dentinal tubules. Dark gray/black coronal color indicates necrotic pulp before pulpectomy.'}
              {activePathology === 'calcific_metamorphosis' &&
                'Calcific Metamorphosis (Lec 9): Progressive obliteration of pulp space with yellowish opaque crown. Primary teeth usually undergo normal root resorption.'}
              {activePathology === 'internal_resorption' &&
                'Internal Resorption (Lec 9): Odontoclastic destruction causing "Pink Spot" of Mummery. Immediate endodontic therapy required before perforation.'}
              {activePathology === 'intrusion' &&
                'Intrusion (Lec 10): Tooth driven into alveolar bone with crushing PDL damage. In primary teeth, wait for spontaneous re-eruption (3-4 weeks) unless encroaching on permanent tooth germ.'}
              {activePathology === 'extrusion' &&
                'Extrusion (Lec 10): Partial axial displacement out of socket. Reposition immediately with digital pressure and stabilize with flexible splint for 2 weeks.'}
              {activePathology === 'lateral_luxation' &&
                'Lateral Luxation (Lec 10): Displaced sideways and locked in alveolar bone. Requires digital disimpaction, local anesthesia, and flexible splint 2-4 weeks.'}
              {activePathology === 'avulsion' &&
                'Avulsion (Lec 10): Complete displacement out of socket. PRIMARY TEETH ARE NEVER REPLANTED! Permanent teeth must be replanted immediately or transported in HBSS/milk.'}
              {activePathology === 'dilaceration' &&
                'Dilaceration (Lec 9): Severe angular bend in root or crown caused by trauma to the deciduous predecessor intruding into the permanent germ.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
