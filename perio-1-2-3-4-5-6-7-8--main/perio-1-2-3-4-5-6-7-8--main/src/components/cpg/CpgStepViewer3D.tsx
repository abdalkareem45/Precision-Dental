import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Layers,
  Sparkles,
  Eye,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Scissors,
  Shield,
  HelpCircle,
  Maximize2
} from 'lucide-react';

export type CpgStep3D =
  | 'step1_biofilm'
  | 'step2_subgingival'
  | 'step2_failed'
  | 'step3_access_flap'
  | 'step3_resective'
  | 'step3_regenerative'
  | 'step3_ctg'
  | 'step4_spc';

interface CpgStepViewer3DProps {
  currentStep?: CpgStep3D;
  onStepChange?: (step: CpgStep3D) => void;
  height?: string;
}

export const CpgStepViewer3D: React.FC<CpgStepViewer3DProps> = ({
  currentStep = 'step2_subgingival',
  onStepChange,
  height = '520px'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [internalStep, setInternalStep] = useState<CpgStep3D>(currentStep);
  const [probeDepthMm, setProbeDepthMm] = useState<number>(6);
  const [showProbe, setShowProbe] = useState<boolean>(true);
  const [showBone, setShowBone] = useState<boolean>(true);
  const [showGingiva, setShowGingiva] = useState<boolean>(true);
  const [showBiofilm, setShowBiofilm] = useState<boolean>(true);
  const [showGraft, setShowGraft] = useState<boolean>(true);
  const [crossSection, setCrossSection] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [cameraView, setCameraView] = useState<'perspective' | 'mesial' | 'buccal' | 'occlusal'>('perspective');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const toothGroupRef = useRef<THREE.Group | null>(null);
  const boneGroupRef = useRef<THREE.Group | null>(null);
  const gingivaGroupRef = useRef<THREE.Group | null>(null);
  const biofilmGroupRef = useRef<THREE.Group | null>(null);
  const probeGroupRef = useRef<THREE.Group | null>(null);
  const surgicalGroupRef = useRef<THREE.Group | null>(null);
  const graftGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // Sync external step if prop changes
  useEffect(() => {
    setInternalStep(currentStep);
  }, [currentStep]);

  const handleSelectStep = (step: CpgStep3D) => {
    setInternalStep(step);
    if (onStepChange) onStepChange(step);
    // Auto adjust probe depth based on step
    if (step === 'step1_biofilm') setProbeDepthMm(5);
    else if (step === 'step2_subgingival') setProbeDepthMm(6);
    else if (step === 'step2_failed') setProbeDepthMm(7);
    else if (step === 'step3_access_flap') setProbeDepthMm(6);
    else if (step === 'step3_resective') setProbeDepthMm(4);
    else if (step === 'step3_regenerative') setProbeDepthMm(8);
    else if (step === 'step3_ctg') setProbeDepthMm(2);
    else if (step === 'step4_spc') setProbeDepthMm(3);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a1630);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 4.2);
    camera.lookAt(0, -0.1, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(3, 4, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.1);
    fillLight.position.set(-3, 2, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc9a24b, 1.4);
    rimLight.position.set(0, -3, -2.5);
    scene.add(rimLight);

    // 5. Build Procedural 3D Periodontal Complex Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- Tooth Structure (Crown, CEJ, Roots) ---
    const toothGroup = new THREE.Group();
    toothGroupRef.current = toothGroup;
    rootGroup.add(toothGroup);

    // Materials
    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbfbf8,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      transmission: 0.12,
      ior: 1.5
    });

    const rootDentinMat = new THREE.MeshStandardMaterial({
      color: 0xecd8a8,
      roughness: 0.45,
      metalness: 0.02
    });

    // Crown (Lower first molar / premolar morphology)
    const crownGeo = new THREE.CylinderGeometry(0.55, 0.5, 0.75, 32);
    crownGeo.scale(1.1, 1, 0.9);
    const crownMesh = new THREE.Mesh(crownGeo, enamelMat);
    crownMesh.position.y = 0.5;
    crownMesh.castShadow = true;
    crownMesh.receiveShadow = true;
    toothGroup.add(crownMesh);

    // Occlusal Cusps Accent
    const cusp1Geo = new THREE.SphereGeometry(0.2, 16, 16);
    const cusp1 = new THREE.Mesh(cusp1Geo, enamelMat);
    cusp1.position.set(0.3, 0.85, 0.2);
    cusp1.scale.set(1.2, 0.5, 1);
    toothGroup.add(cusp1);

    const cusp2 = cusp1.clone();
    cusp2.position.set(-0.3, 0.85, 0.2);
    toothGroup.add(cusp2);

    const cusp3 = cusp1.clone();
    cusp3.position.set(0.3, 0.85, -0.2);
    toothGroup.add(cusp3);

    const cusp4 = cusp1.clone();
    cusp4.position.set(-0.3, 0.85, -0.2);
    toothGroup.add(cusp4);

    // CEJ (Cementoenamel Junction ring)
    const cejGeo = new THREE.TorusGeometry(0.51, 0.035, 16, 32);
    cejGeo.rotateX(Math.PI / 2);
    const cejMat = new THREE.MeshStandardMaterial({ color: 0xd6c18d, roughness: 0.6 });
    const cejMesh = new THREE.Mesh(cejGeo, cejMat);
    cejMesh.position.y = 0.12;
    toothGroup.add(cejMesh);

    // Roots: Mesial Root & Distal Root
    const mesialRootGeo = new THREE.ConeGeometry(0.32, 1.4, 24);
    mesialRootGeo.rotateZ(Math.PI);
    const mesialRoot = new THREE.Mesh(mesialRootGeo, rootDentinMat);
    mesialRoot.position.set(0.24, -0.65, 0);
    mesialRoot.scale.set(0.95, 1, 0.7);
    mesialRoot.castShadow = true;
    toothGroup.add(mesialRoot);

    const distalRootGeo = new THREE.ConeGeometry(0.3, 1.35, 24);
    distalRootGeo.rotateZ(Math.PI);
    const distalRoot = new THREE.Mesh(distalRootGeo, rootDentinMat);
    distalRoot.position.set(-0.24, -0.62, 0);
    distalRoot.scale.set(0.9, 1, 0.7);
    distalRoot.castShadow = true;
    toothGroup.add(distalRoot);

    // --- Alveolar Bone Architecture ---
    const boneGroup = new THREE.Group();
    boneGroupRef.current = boneGroup;
    rootGroup.add(boneGroup);

    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xdfd3be,
      roughness: 0.65,
      metalness: 0.05,
      bumpScale: 0.04
    });

    // Base Alveolar process block
    const boneBaseGeo = new THREE.BoxGeometry(2.4, 1.3, 1.4);
    const boneBase = new THREE.Mesh(boneBaseGeo, boneMat);
    boneBase.position.set(0, -1.05, 0);
    boneBase.receiveShadow = true;
    boneGroup.add(boneBase);

    // Mesial Crest & Angular Defect (Variable depending on step)
    const mesialCrestGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.6, 20);
    const mesialCrest = new THREE.Mesh(mesialCrestGeo, boneMat);
    mesialCrest.position.set(0.68, -0.38, 0);
    boneGroup.add(mesialCrest);

    const distalCrestGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.6, 20);
    const distalCrest = new THREE.Mesh(distalCrestGeo, boneMat);
    distalCrest.position.set(-0.68, -0.42, 0);
    boneGroup.add(distalCrest);

    // --- Gingival Soft Tissue Complex ---
    const gingivaGroup = new THREE.Group();
    gingivaGroupRef.current = gingivaGroup;
    rootGroup.add(gingivaGroup);

    // Inflamed vs Healthy Gingiva Material
    const gingivaMat = new THREE.MeshPhysicalMaterial({
      color: 0xdb4c68, // Healthy coral pink to inflamed red
      roughness: 0.4,
      metalness: 0.02,
      transmission: 0.05,
      transparent: true,
      opacity: 0.94
    });

    const gingivaCollarGeo = new THREE.CylinderGeometry(0.72, 0.88, 0.65, 32, 1, true);
    const gingivaCollar = new THREE.Mesh(gingivaCollarGeo, gingivaMat);
    gingivaCollar.position.set(0, -0.15, 0);
    gingivaGroup.add(gingivaCollar);

    const attachedGingivaGeo = new THREE.BoxGeometry(2.3, 0.8, 1.35);
    const attachedGingiva = new THREE.Mesh(attachedGingivaGeo, gingivaMat);
    attachedGingiva.position.set(0, -0.75, 0);
    gingivaGroup.add(attachedGingiva);

    // --- Biofilm & Subgingival Calculus Group ---
    const biofilmGroup = new THREE.Group();
    biofilmGroupRef.current = biofilmGroup;
    rootGroup.add(biofilmGroup);

    // Supragingival Biofilm (Yellow-white sticky plaque)
    const supraPlaqueMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.8,
      transparent: true,
      opacity: 0.9
    });
    const supraPlaqueGeo = new THREE.TorusGeometry(0.53, 0.045, 12, 32);
    supraPlaqueGeo.rotateX(Math.PI / 2);
    const supraPlaque = new THREE.Mesh(supraPlaqueGeo, supraPlaqueMat);
    supraPlaque.position.y = 0.16;
    biofilmGroup.add(supraPlaque);

    // Subgingival Calculus (Dark brown-black tenacious ring on root)
    const subCalcMat = new THREE.MeshStandardMaterial({
      color: 0x452311,
      roughness: 0.95
    });
    const subCalcGeo = new THREE.TorusGeometry(0.48, 0.05, 12, 32);
    subCalcGeo.rotateX(Math.PI / 2);
    const subCalc = new THREE.Mesh(subCalcGeo, subCalcMat);
    subCalc.position.y = -0.18;
    biofilmGroup.add(subCalc);

    // --- Surgical Elements (Flap, Resection, Regenerative Graft & Membrane, CTG) ---
    const surgicalGroup = new THREE.Group();
    surgicalGroupRef.current = surgicalGroup;
    rootGroup.add(surgicalGroup);

    // Flap Reflection Mesh (Access Flap / Open Flap Debridement)
    const flapMat = new THREE.MeshPhysicalMaterial({
      color: 0xd93856,
      roughness: 0.35,
      side: THREE.DoubleSide
    });
    const flapGeo = new THREE.PlaneGeometry(1.2, 0.9, 10, 10);
    // Curl flap outward
    const flapPos = flapGeo.attributes.position;
    for (let i = 0; i < flapPos.count; i++) {
      const y = flapPos.getY(i);
      if (y > 0) {
        flapPos.setZ(i, Math.sin((y / 0.45) * Math.PI * 0.5) * 0.45);
      }
    }
    flapGeo.computeVertexNormals();
    const flapMesh = new THREE.Mesh(flapGeo, flapMat);
    flapMesh.position.set(0, -0.3, 0.75);
    surgicalGroup.add(flapMesh);

    // Graft Material (Bio-Oss Particulates / Bone Graft in Intrabony Defect)
    const graftGroup = new THREE.Group();
    graftGroupRef.current = graftGroup;
    rootGroup.add(graftGroup);

    const graftGranuleMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.7
    });
    for (let i = 0; i < 24; i++) {
      const gGeo = new THREE.DodecahedronGeometry(0.045);
      const gMesh = new THREE.Mesh(gGeo, graftGranuleMat);
      gMesh.position.set(
        0.35 + (Math.random() - 0.5) * 0.22,
        -0.45 - Math.random() * 0.35,
        (Math.random() - 0.5) * 0.25
      );
      graftGroup.add(gMesh);
    }

    // Collagen Barrier Membrane (GTR)
    const membraneMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.2,
      transmission: 0.5,
      transparent: true,
      opacity: 0.85
    });
    const membraneGeo = new THREE.PlaneGeometry(0.6, 0.7);
    const membrane = new THREE.Mesh(membraneGeo, membraneMat);
    membrane.position.set(0.38, -0.5, 0.45);
    membrane.rotateY(-0.1);
    graftGroup.add(membrane);

    // Connective Tissue Graft (CTG) for Mucogingival Augmentation (#20 in Case 1)
    const ctgMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.5
    });
    const ctgGeo = new THREE.BoxGeometry(0.7, 0.35, 0.12);
    const ctgMesh = new THREE.Mesh(ctgGeo, ctgMat);
    ctgMesh.position.set(0, -0.28, 0.7);
    surgicalGroup.add(ctgMesh);

    // --- Calibrated Periodontal Probe (UNC-15 with mm markings) ---
    const probeGroup = new THREE.Group();
    probeGroupRef.current = probeGroup;
    rootGroup.add(probeGroup);

    // Metal Probe handle / shank
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.88,
      roughness: 0.2
    });
    const shankGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.8, 16);
    const shank = new THREE.Mesh(shankGeo, metalMat);
    shank.position.set(0, 0.9, 0);
    probeGroup.add(shank);

    // Working tip (angled slightly into the pocket)
    const tipGeo = new THREE.CylinderGeometry(0.02, 0.025, 1.2, 16);
    const tip = new THREE.Mesh(tipGeo, metalMat);
    tip.position.set(0, -0.4, 0);
    probeGroup.add(tip);

    // Black calibration bands (4-5mm band, 9-10mm band, 14-15mm)
    const bandMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const band1Geo = new THREE.CylinderGeometry(0.026, 0.026, 0.1, 16);
    const band1 = new THREE.Mesh(band1Geo, bandMat);
    band1.position.set(0, -0.15, 0); // 4-5mm marker
    probeGroup.add(band1);

    const band2 = band1.clone();
    band2.position.set(0, 0.25, 0); // 9-10mm marker
    probeGroup.add(band2);

    // Probe position: inserted mesially into the sulcus
    probeGroup.position.set(0.48, 0.45, 0.1);
    probeGroup.rotateZ(-0.12);

    // 6. Mouse drag rotation interaction
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !rootGroup) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1 || !rootGroup) return;
      const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
      const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;
      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;
      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };
    dom.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // 7. Render Loop with smooth continuous updates
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && rootGroup) {
        rootGroup.rotation.y += 0.006;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
    };
  }, [autoRotate]);

  // Update visual elements when internalStep or states change
  useEffect(() => {
    if (!biofilmGroupRef.current || !surgicalGroupRef.current || !graftGroupRef.current || !gingivaGroupRef.current || !probeGroupRef.current) {
      return;
    }

    // Probe position based on probeDepthMm
    // 0mm = CEJ level (y ~ 0.65), 10mm = deep apical (y ~ -0.15)
    const probeY = 0.65 - (probeDepthMm * 0.08);
    probeGroupRef.current.position.y = probeY;
    probeGroupRef.current.visible = showProbe;

    // Bone visibility
    if (boneGroupRef.current) {
      boneGroupRef.current.visible = showBone;
    }

    // Gingiva visibility
    gingivaGroupRef.current.visible = showGingiva;

    // Biofilm visibility:
    // In Step 1: Plaque & calculus prominent
    // In Step 2: Subgingival instrumentation removes them
    // In Step 3 & 4: Subgingival deposits cleared
    const hasPlaque = internalStep === 'step1_biofilm' || internalStep === 'step2_subgingival';
    biofilmGroupRef.current.visible = showBiofilm && hasPlaque;

    // Surgical features visibility:
    const isAccessFlap = internalStep === 'step3_access_flap';
    const isResective = internalStep === 'step3_resective';
    const isRegenerative = internalStep === 'step3_regenerative';
    const isCtg = internalStep === 'step3_ctg';

    surgicalGroupRef.current.visible = isAccessFlap || isResective || isCtg;
    graftGroupRef.current.visible = showGraft && isRegenerative;

    // Adjust gingiva color/swelling based on state
    const gingivaMesh = gingivaGroupRef.current.children[0] as THREE.Mesh;
    if (gingivaMesh && gingivaMesh.material instanceof THREE.MeshPhysicalMaterial) {
      if (internalStep === 'step1_biofilm' || internalStep === 'step2_failed') {
        gingivaMesh.material.color.setHex(0xd92644); // Inflamed bright red edematous
        gingivaMesh.scale.set(1.08, 1.05, 1.08);
      } else if (internalStep === 'step4_spc') {
        gingivaMesh.material.color.setHex(0xe87a90); // Healthy pale coral pink, stippled
        gingivaMesh.scale.set(1.0, 1.0, 1.0);
      } else {
        gingivaMesh.material.color.setHex(0xdb4c68); // Moderate healing
        gingivaMesh.scale.set(1.02, 1.0, 1.02);
      }
    }
  }, [internalStep, probeDepthMm, showProbe, showBone, showGingiva, showBiofilm, showGraft]);

  const handleResetCamera = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(0, 0.4, 4.2);
    cameraRef.current.lookAt(0, -0.1, 0);
    setCameraView('perspective');
  };

  const handleSetView = (view: 'perspective' | 'mesial' | 'buccal' | 'occlusal') => {
    if (!cameraRef.current) return;
    setCameraView(view);
    if (view === 'buccal') {
      cameraRef.current.position.set(0, 0, 4.2);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (view === 'mesial') {
      cameraRef.current.position.set(4.2, 0.2, 0);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (view === 'occlusal') {
      cameraRef.current.position.set(0, 4.2, 0.1);
      cameraRef.current.lookAt(0, 0, 0);
    } else {
      cameraRef.current.position.set(0, 0.4, 4.2);
      cameraRef.current.lookAt(0, -0.1, 0);
    }
  };

  const getStepDescription = (step: CpgStep3D) => {
    switch (step) {
      case 'step1_biofilm':
        return {
          title: 'Step 1: Supragingival Biofilm & Risk Factor Control',
          badge: 'Conducted in ALL Patients',
          color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
          desc: 'Aimed at guiding behavioral change, supragingival biofilm control (OHI, motivation, PMPR, adjunctive therapy), and risk factors control (smoking cessation, glycemic control). Notice prominent supragingival plaque & marginal gingival inflammation.',
          target: 'Goal: Plaque control & reducing marginal inflammation prior to subgingival instrumentation.'
        };
      case 'step2_subgingival':
        return {
          title: 'Step 2: Cause-Related Therapy (Subgingival Instrumentation)',
          badge: 'Sites with PD > 3mm',
          color: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
          desc: 'Aimed at subgingival instrumentation to control subgingival biofilm and calculus, with adjunctive physical/chemical agents, host modulators, and local or systemic antimicrobials. Calibrated probe inserted to 6mm.',
          target: 'Re-evaluation: 4–8 weeks post-instrumentation to determine if endpoints are met.'
        };
      case 'step2_failed':
        return {
          title: 'Step 2 Re-Evaluation: Endpoints NOT Achieved!',
          badge: 'PD > 4mm with BOP or PD > 6mm',
          color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
          desc: 'Re-evaluation shows residual deep pockets > 6mm or pockets > 4mm with persistent bleeding on probing (BOP). Patient has NOT met endpoints of therapy. Immediate indication to proceed to Step 3 (Surgical Therapy).',
          target: 'Criteria: If PD <= 4mm without BOP -> SPC. If PD > 4mm with BOP or > 6mm -> Surgery!'
        };
      case 'step3_access_flap':
        return {
          title: 'Step 3: Access Flap Periodontal Surgery (Open Flap)',
          badge: 'Surgical Access',
          color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
          desc: 'Full-thickness mucoperiosteal flap reflected to provide direct visual access to deep root surfaces, root trunk concavities, and irregular osseous defects where closed instrumentation was insufficient.',
          target: 'Indication: Residual pockets > 5mm in non-regenerable areas needing thorough debridement.'
        };
      case 'step3_resective':
        return {
          title: 'Step 3: Resective Periodontal Surgery',
          badge: 'Osseous Recontouring',
          color: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
          desc: 'Aimed at resecting tissue and reshaping bone architecture (ostectomy & osteoplasty) to eliminate shallow to moderate osseous defects and pocket depths, creating a self-cleansable physiological gingival profile.',
          target: 'Used in Case 2: Maxillary right & maxillary left quadrants.'
        };
      case 'step3_regenerative':
        return {
          title: 'Step 3: Regenerative Periodontal Surgery',
          badge: 'Intrabony Defect & GTR',
          color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
          desc: 'Aimed at regenerating lost bone, cementum, and PDL. 3D visualization displays particulate bone graft (Bio-Oss) packed into the deep 4mm vertical mesial intrabony defect covered with a collagen barrier membrane.',
          target: 'Used in Case 2: 4mm vertical intrabony defect on mesial of tooth #18.'
        };
      case 'step3_ctg':
        return {
          title: 'Step 3: Connective Tissue Graft (CTG) / Mucogingival',
          badge: 'Keratinized Tissue',
          color: 'border-pink-500/40 bg-pink-500/10 text-pink-300',
          desc: 'Subepithelial connective tissue graft placed to augment inadequate keratinized gingiva and treat gingival recession. Protects periodontal health and prevents future breakdown.',
          target: 'Used in Case 1: Increasing attached keratinized tissue for tooth #20.'
        };
      case 'step4_spc':
        return {
          title: 'Step 4: Supportive Periodontal Care (SPC)',
          badge: '3-Month Recall Interval',
          color: 'border-[#C9A24B]/40 bg-[#C9A24B]/10 text-[#C9A24B]',
          desc: 'Aimed at maintaining periodontal stability in all treated periodontitis patients combining preventive and therapeutic interventions. Performed every 3 months. Gingiva is stippled, pink, and healthy with probe reading 3mm.',
          target: 'Maintenance: Reinforce OHI, check risk factors (smoking/diabetes), professional cleaning & re-evaluation.'
        };
    }
  };

  const stepInfo = getStepDescription(internalStep);

  return (
    <div className="bg-[#07132b] rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col">
      {/* Top Header & Status Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/30 uppercase tracking-wider">
              3D Interactive Periodontal Engine
            </span>
            <span className="text-xs text-slate-400">Dr. Alaa Omran CPG Framework</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            {stepInfo.title}
          </h2>
        </div>

        {/* Camera Views & Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/60 text-xs">
            <button
              onClick={() => handleSetView('perspective')}
              className={`px-2 py-1 rounded transition ${cameraView === 'perspective' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Perspective
            </button>
            <button
              onClick={() => handleSetView('buccal')}
              className={`px-2 py-1 rounded transition ${cameraView === 'buccal' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Buccal
            </button>
            <button
              onClick={() => handleSetView('mesial')}
              className={`px-2 py-1 rounded transition ${cameraView === 'mesial' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Mesial
            </button>
            <button
              onClick={() => handleSetView('occlusal')}
              className={`px-2 py-1 rounded transition ${cameraView === 'occlusal' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Occlusal
            </button>
          </div>

          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Reset Camera View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${autoRotate ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{autoRotate ? 'Stop Rotate' : 'Auto Rotate'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Viewport with Bottom Dock */}
      <div className="relative w-full overflow-hidden bg-radial from-[#0e214d] via-[#091530] to-[#050b1a]" style={{ height }}>
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Informational Callout Badge top-left */}
        <div className="absolute top-3 left-3 max-w-sm pointer-events-none">
          <div className={`p-3 rounded-xl border backdrop-blur-md shadow-lg ${stepInfo.color}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">
              {stepInfo.badge}
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">{stepInfo.desc}</p>
            <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1.5 text-[11px] font-medium text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{stepInfo.target}</span>
            </div>
          </div>
        </div>

        {/* Live Probing Depth Indicator top-right */}
        <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl max-w-[210px]">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
            <span className="font-semibold text-white">Probe Depth (PPD)</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${probeDepthMm > 6 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : probeDepthMm > 4 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
              {probeDepthMm} mm
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={probeDepthMm}
            onChange={(e) => setProbeDepthMm(parseInt(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
            <span>1mm (Sulcus)</span>
            <span>4mm</span>
            <span>12mm (Deep)</span>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-300">
            {probeDepthMm <= 4 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                ✓ Physiological endpoint
              </span>
            ) : probeDepthMm <= 6 ? (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                ⚠ Step 2 re-eval threshold
              </span>
            ) : (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                🚨 Deep pocket (&gt;6mm) surgical
              </span>
            )}
          </div>
        </div>

        {/* Bottom Dock: Step Selector & Layer Toggles */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col gap-2.5">
          {/* Step Pill Navigation */}
          <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            <button
              onClick={() => handleSelectStep('step1_biofilm')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${internalStep === 'step1_biofilm' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <span>1. Biofilm & Risk</span>
            </button>
            <button
              onClick={() => handleSelectStep('step2_subgingival')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${internalStep === 'step2_subgingival' ? 'bg-blue-500 text-white shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <span>2. Subgingival Scaling</span>
            </button>
            <button
              onClick={() => handleSelectStep('step2_failed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${internalStep === 'step2_failed' ? 'bg-rose-500 text-white shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Step 2 Failed</span>
            </button>
            <button
              onClick={() => handleSelectStep('step3_access_flap')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${internalStep === 'step3_access_flap' ? 'bg-purple-600 text-white shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>3A. Access Flap</span>
            </button>
            <button
              onClick={() => handleSelectStep('step3_resective')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${internalStep === 'step3_resective' ? 'bg-orange-500 text-white shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <span>3B. Resective</span>
            </button>
            <button
              onClick={() => handleSelectStep('step3_regenerative')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${internalStep === 'step3_regenerative' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3C. Regenerative</span>
            </button>
            <button
              onClick={() => handleSelectStep('step3_ctg')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${internalStep === 'step3_ctg' ? 'bg-pink-500 text-white shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <span>3D. CTG (#20)</span>
            </button>
            <button
              onClick={() => handleSelectStep('step4_spc')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${internalStep === 'step4_spc' ? 'bg-[#C9A24B] text-slate-950 shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>4. SPC (3mo)</span>
            </button>
          </div>

          {/* Sub-bar: Anatomical Layer Toggles */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] text-slate-300 flex-wrap gap-2">
            <span className="text-slate-400 font-medium hidden sm:inline flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              3D Tissue Layers:
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowGingiva(!showGingiva)}
                className={`px-2 py-0.5 rounded border transition ${showGingiva ? 'bg-pink-500/20 text-pink-300 border-pink-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
              >
                Gingiva
              </button>
              <button
                onClick={() => setShowBone(!showBone)}
                className={`px-2 py-0.5 rounded border transition ${showBone ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
              >
                Alveolar Bone
              </button>
              <button
                onClick={() => setShowBiofilm(!showBiofilm)}
                className={`px-2 py-0.5 rounded border transition ${showBiofilm ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
              >
                Biofilm / Calculus
              </button>
              <button
                onClick={() => setShowProbe(!showProbe)}
                className={`px-2 py-0.5 rounded border transition ${showProbe ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
              >
                UNC-15 Probe
              </button>
              {internalStep === 'step3_regenerative' && (
                <button
                  onClick={() => setShowGraft(!showGraft)}
                  className={`px-2 py-0.5 rounded border transition ${showGraft ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
                >
                  Graft &amp; Membrane
                </button>
              )}
            </div>

            <span className="text-[10px] text-slate-400 ml-auto hidden md:inline">
              Drag to Orbit • Scroll to Zoom
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
