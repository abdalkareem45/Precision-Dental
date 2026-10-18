import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Layers,
  Sparkles,
  Heart,
  ShieldAlert,
  Activity,
  AlertTriangle,
  Pill,
  Scissors,
  Syringe,
  Radio,
  CheckCircle2,
  Droplet,
  Baby,
  Brain,
  Biohazard,
  Sliders
} from 'lucide-react';

export type MedCompMode3D =
  | 'cardio_la'
  | 'infective_endocarditis'
  | 'cyclosporine_overgrowth'
  | 'pacemaker_emf'
  | 'dialysis_shunt'
  | 'diabetes_hba1c'
  | 'pregnancy_supine'
  | 'phenytoin_epilepsy'
  | 'bleeding_petechiae'
  | 'infectious_aerosol';

interface MedicallyCompromised3DProps {
  currentMode?: MedCompMode3D;
  onModeChange?: (mode: MedCompMode3D) => void;
  height?: string;
}

export const MedicallyCompromised3D: React.FC<MedicallyCompromised3DProps> = ({
  currentMode = 'diabetes_hba1c',
  onModeChange,
  height = '560px'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<MedCompMode3D>(currentMode);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [epinephrineCartridges, setEpinephrineCartridges] = useState<number>(1);
  const [pacemakerDistanceCm, setPacemakerDistanceCm] = useState<number>(35);
  const [hba1cLevel, setHba1cLevel] = useState<number>(8.5);
  const [chairTiltDegrees, setChairTiltDegrees] = useState<number>(15);
  const [cameraView, setCameraView] = useState<'perspective' | 'front' | 'side' | 'macro'>('perspective');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);

  // Group references
  const cardioGroupRef = useRef<THREE.Group | null>(null);
  const ieGroupRef = useRef<THREE.Group | null>(null);
  const overgrowthGroupRef = useRef<THREE.Group | null>(null);
  const pacemakerGroupRef = useRef<THREE.Group | null>(null);
  const dialysisGroupRef = useRef<THREE.Group | null>(null);
  const diabetesGroupRef = useRef<THREE.Group | null>(null);
  const pregnancyGroupRef = useRef<THREE.Group | null>(null);
  const phenytoinGroupRef = useRef<THREE.Group | null>(null);
  const petechiaeGroupRef = useRef<THREE.Group | null>(null);
  const aerosolGroupRef = useRef<THREE.Group | null>(null);

  const bacteremiaParticlesRef = useRef<THREE.Points | null>(null);
  const aerosolParticlesRef = useRef<THREE.Points | null>(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setActiveMode(currentMode);
  }, [currentMode]);

  const handleSelectMode = (mode: MedCompMode3D) => {
    setActiveMode(mode);
    if (onModeChange) onModeChange(mode);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x071126);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 4.3);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
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

    const keyLight = new THREE.DirectionalLight(0xfff1e6, 2.0);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 1.1);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc9a24b, 1.3);
    rimLight.position.set(0, -3, -2);
    scene.add(rimLight);

    // 5. Root Group
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // ==========================================
    // 1. CARDIOVASCULAR & EPINEPHRINE
    // ==========================================
    const cardioGroup = new THREE.Group();
    cardioGroupRef.current = cardioGroup;
    rootGroup.add(cardioGroup);

    const syringeMetalMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.15 });
    const carpuleGlassMat = new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, roughness: 0.1, transmission: 0.9, transparent: true, opacity: 0.65, ior: 1.5 });
    const liquidMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, transparent: true, opacity: 0.75 });

    const barrelGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.4, 24, 1, true);
    const barrel = new THREE.Mesh(barrelGeo, syringeMetalMat);
    barrel.position.set(0.6, 0.1, 0);
    cardioGroup.add(barrel);

    const carpuleGeo = new THREE.CylinderGeometry(0.14, 0.14, 1.25, 24);
    const carpule = new THREE.Mesh(carpuleGeo, carpuleGlassMat);
    carpule.position.set(0.6, 0.1, 0);
    cardioGroup.add(carpule);

    const liquidGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 20);
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.set(0.6, 0.05, 0);
    cardioGroup.add(liquid);

    const epiBandGeo = new THREE.CylinderGeometry(0.145, 0.145, 0.12, 24);
    const epiBandMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const epiBand = new THREE.Mesh(epiBandGeo, epiBandMat);
    epiBand.position.set(0.6, 0.45, 0);
    cardioGroup.add(epiBand);

    const needleGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.7, 12);
    const needle = new THREE.Mesh(needleGeo, syringeMetalMat);
    needle.position.set(0.6, 1.05, 0);
    cardioGroup.add(needle);

    const heartMat = new THREE.MeshPhysicalMaterial({ color: 0xbe123c, roughness: 0.4, metalness: 0.1, clearcoat: 0.5 });
    const leftVentGeo = new THREE.SphereGeometry(0.42, 24, 24);
    leftVentGeo.scale(0.85, 1.25, 0.85);
    const leftVent = new THREE.Mesh(leftVentGeo, heartMat);
    leftVent.position.set(-0.6, -0.05, 0);
    cardioGroup.add(leftVent);

    // ==========================================
    // 2. INFECTIVE ENDOCARDITIS (IE)
    // ==========================================
    const ieGroup = new THREE.Group();
    ieGroupRef.current = ieGroup;
    rootGroup.add(ieGroup);

    const valveRingMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 });
    const valveRingGeo = new THREE.TorusGeometry(0.55, 0.07, 16, 32);
    const valveRing = new THREE.Mesh(valveRingGeo, valveRingMat);
    valveRing.position.set(0, 0.1, 0);
    valveRing.rotateX(Math.PI / 2.3);
    ieGroup.add(valveRing);

    const leafletMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 });
    const leaflet1Geo = new THREE.BoxGeometry(0.48, 0.03, 0.3);
    const leaflet1 = new THREE.Mesh(leaflet1Geo, leafletMat);
    leaflet1.position.set(0, 0.1, 0.12);
    leaflet1.rotateX(0.4);
    ieGroup.add(leaflet1);

    const leaflet2 = leaflet1.clone();
    leaflet2.position.set(0, 0.1, -0.12);
    leaflet2.rotateX(-0.4);
    ieGroup.add(leaflet2);

    const vegetationMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 });
    for (let i = 0; i < 18; i++) {
      const vegGeo = new THREE.DodecahedronGeometry(0.045 + Math.random() * 0.03);
      const vegMesh = new THREE.Mesh(vegGeo, vegetationMat);
      const angle = (i / 18) * Math.PI * 2;
      vegMesh.position.set(
        Math.cos(angle) * 0.45 + (Math.random() - 0.5) * 0.08,
        0.1 + (Math.random() - 0.5) * 0.1,
        Math.sin(angle) * 0.45 + (Math.random() - 0.5) * 0.08
      );
      ieGroup.add(vegMesh);
    }

    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArr[i] = (Math.random() - 0.5) * 1.6;
      posArr[i + 1] = -1.2 + Math.random() * 2.4;
      posArr[i + 2] = (Math.random() - 0.5) * 1.6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xfbbf24, size: 0.055, transparent: true, opacity: 0.85 });
    const bacteremiaParticles = new THREE.Points(particleGeo, particleMat);
    bacteremiaParticlesRef.current = bacteremiaParticles;
    ieGroup.add(bacteremiaParticles);

    // ==========================================
    // 3. CYCLOSPORINE OVERGROWTH
    // ==========================================
    const overgrowthGroup = new THREE.Group();
    overgrowthGroupRef.current = overgrowthGroup;
    rootGroup.add(overgrowthGroup);

    const toothMat = new THREE.MeshPhysicalMaterial({ color: 0xfcfbfa, roughness: 0.2, metalness: 0.05, clearcoat: 0.8 });
    const incisor1Geo = new THREE.BoxGeometry(0.38, 0.75, 0.25);
    const incisor1 = new THREE.Mesh(incisor1Geo, toothMat);
    incisor1.position.set(-0.22, 0.2, 0);
    overgrowthGroup.add(incisor1);

    const incisor2 = incisor1.clone();
    incisor2.position.set(0.22, 0.2, 0);
    overgrowthGroup.add(incisor2);

    const overgrowthMat = new THREE.MeshPhysicalMaterial({ color: 0xe11d48, roughness: 0.45, metalness: 0.02, transmission: 0.05, transparent: true, opacity: 0.95 });
    for (let i = 0; i < 9; i++) {
      const lobuleGeo = new THREE.SphereGeometry(0.16 + (i % 3) * 0.03, 16, 16);
      lobuleGeo.scale(1.1, 0.8, 1);
      const lobule = new THREE.Mesh(lobuleGeo, overgrowthMat);
      lobule.position.set(-0.45 + (i * 0.11), 0.05 + ((i % 2) * 0.12), 0.14 + (Math.sin(i) * 0.05));
      overgrowthGroup.add(lobule);
    }

    // ==========================================
    // 4. CARDIAC PACEMAKER & EMF
    // ==========================================
    const pacemakerGroup = new THREE.Group();
    pacemakerGroupRef.current = pacemakerGroup;
    rootGroup.add(pacemakerGroup);

    const tiMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.92, roughness: 0.15 });
    const pMakerGeo = new THREE.BoxGeometry(0.5, 0.4, 0.09);
    const pMaker = new THREE.Mesh(pMakerGeo, tiMat);
    pMaker.position.set(-0.6, 0.25, 0);
    pacemakerGroup.add(pMaker);

    const leadGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 12);
    const leadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const lead = new THREE.Mesh(leadGeo, leadMat);
    lead.position.set(-0.4, -0.15, 0);
    lead.rotateZ(0.5);
    pacemakerGroup.add(lead);

    const scalerMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const scalerGeo = new THREE.CylinderGeometry(0.05, 0.06, 1.1, 16);
    scalerGeo.rotateZ(Math.PI / 4);
    const scaler = new THREE.Mesh(scalerGeo, scalerMat);
    scaler.position.set(0.65, -0.1, 0);
    pacemakerGroup.add(scaler);

    const emfSphereGeo = new THREE.SphereGeometry(0.85, 24, 24);
    const emfSphereMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transmission: 0.8, transparent: true, opacity: 0.25, roughness: 0.1, wireframe: true });
    const emfBubble = new THREE.Mesh(emfSphereGeo, emfSphereMat);
    emfBubble.position.set(-0.6, 0.25, 0);
    pacemakerGroup.add(emfBubble);

    // ==========================================
    // 5. HEMODIALYSIS AV FISTULA & SHUNT
    // ==========================================
    const dialysisGroup = new THREE.Group();
    dialysisGroupRef.current = dialysisGroup;
    rootGroup.add(dialysisGroup);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xcca585, roughness: 0.55 });
    const armGeo = new THREE.CylinderGeometry(0.35, 0.28, 2.0, 24);
    armGeo.rotateZ(Math.PI / 3);
    const arm = new THREE.Mesh(armGeo, skinMat);
    arm.position.set(0, 0, 0);
    dialysisGroup.add(arm);

    const fistulaMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.4 });
    const fistulaGeo = new THREE.CylinderGeometry(0.065, 0.065, 1.2, 16);
    fistulaGeo.rotateZ(Math.PI / 3 + 0.08);
    const fistula = new THREE.Mesh(fistulaGeo, fistulaMat);
    fistula.position.set(0.05, 0.05, 0.32);
    dialysisGroup.add(fistula);

    const cuffWarningGeo = new THREE.TorusGeometry(0.42, 0.06, 16, 32);
    cuffWarningGeo.rotateX(Math.PI / 2);
    const cuffWarningMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const cuffWarning = new THREE.Mesh(cuffWarningGeo, cuffWarningMat);
    cuffWarning.position.set(-0.1, 0.1, 0.1);
    dialysisGroup.add(cuffWarning);

    // ==========================================
    // 6. PART II: DIABETES MELLITUS & GLYCEMIA (HbA1c)
    // ==========================================
    const diabetesGroup = new THREE.Group();
    diabetesGroupRef.current = diabetesGroup;
    rootGroup.add(diabetesGroup);

    // Digital Glucometer Body
    const meterMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.5 });
    const meterGeo = new THREE.BoxGeometry(0.65, 0.9, 0.16);
    const meter = new THREE.Mesh(meterGeo, meterMat);
    meter.position.set(-0.55, 0.15, 0);
    diabetesGroup.add(meter);

    // LCD Screen with Glucose Reading Display
    const lcdMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const lcdGeo = new THREE.PlaneGeometry(0.48, 0.32);
    const lcd = new THREE.Mesh(lcdGeo, lcdMat);
    lcd.position.set(-0.55, 0.28, 0.085);
    diabetesGroup.add(lcd);

    // Test Strip inserted at base with blood droplet
    const stripMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const stripGeo = new THREE.BoxGeometry(0.12, 0.35, 0.02);
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.position.set(-0.55, -0.38, 0.02);
    diabetesGroup.add(strip);

    const bloodDropGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const bloodDropMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.2 });
    const bloodDrop = new THREE.Mesh(bloodDropGeo, bloodDropMat);
    bloodDrop.position.set(-0.55, -0.5, 0.03);
    diabetesGroup.add(bloodDrop);

    // Insulin Pen / Syringe with Orange Cap (U-100)
    const penBodyMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    const penGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.3, 20);
    const pen = new THREE.Mesh(penGeo, penBodyMat);
    pen.position.set(0.55, 0.1, 0);
    diabetesGroup.add(pen);

    const orangeCapMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    const capGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.35, 20);
    const cap = new THREE.Mesh(capGeo, orangeCapMat);
    cap.position.set(0.55, 0.8, 0);
    diabetesGroup.add(cap);

    // Microvascular Endothelial Basement Membrane Thickening Visual (Diabetic Microangiopathy)
    const vesselGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 32);
    const vesselMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    const vessel = new THREE.Mesh(vesselGeo, vesselMat);
    vessel.position.set(0, -0.65, 0);
    vessel.rotateX(Math.PI / 2);
    diabetesGroup.add(vessel);

    // ==========================================
    // 7. PART II: PREGNANCY & SUPINE HYPOTENSION SYNDROME
    // ==========================================
    const pregnancyGroup = new THREE.Group();
    pregnancyGroupRef.current = pregnancyGroup;
    rootGroup.add(pregnancyGroup);

    // Ergonomic Dental Chair Base with 15-degree Left Lateral Tilt
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
    const chairGeo = new THREE.BoxGeometry(1.8, 0.15, 0.8);
    const chair = new THREE.Mesh(chairGeo, chairMat);
    chair.position.set(0, -0.2, 0);
    chair.rotateZ(-0.25); // Left lateral tilt
    pregnancyGroup.add(chair);

    // Pillow / Blanket Roll under Right Hip (5-6 inches elevation)
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.8 });
    const pillowGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.65, 20);
    pillowGeo.rotateX(Math.PI / 2);
    const pillow = new THREE.Mesh(pillowGeo, pillowMat);
    pillow.position.set(0.45, -0.1, 0);
    pregnancyGroup.add(pillow);

    // Stylized Gravid Uterus & Inferior Vena Cava Relief
    const uterusMat = new THREE.MeshPhysicalMaterial({ color: 0xf472b6, roughness: 0.5, transmission: 0.2, transparent: true, opacity: 0.85 });
    const uterusGeo = new THREE.SphereGeometry(0.42, 24, 24);
    uterusGeo.scale(1.15, 0.9, 1.25);
    const uterus = new THREE.Mesh(uterusGeo, uterusMat);
    uterus.position.set(-0.15, 0.15, 0);
    pregnancyGroup.add(uterus);

    // Inferior Vena Cava & Aorta Blue/Red Tube (Protected from compression)
    const ivcMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });
    const ivcGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.2, 16);
    const ivc = new THREE.Mesh(ivcGeo, ivcMat);
    ivc.position.set(0.15, 0.1, -0.3);
    pregnancyGroup.add(ivc);

    // ==========================================
    // 8. PART II: PHENYTOIN GINGIVAL OVERGROWTH (EPILEPSY)
    // ==========================================
    const phenytoinGroup = new THREE.Group();
    phenytoinGroupRef.current = phenytoinGroup;
    rootGroup.add(phenytoinGroup);

    // Anterior Upper Arch: Incisors & Canines
    for (let t = -2; t <= 2; t++) {
      const pToothGeo = new THREE.BoxGeometry(0.3, 0.75, 0.22);
      const pTooth = new THREE.Mesh(pToothGeo, toothMat);
      pTooth.position.set(t * 0.32, 0.22, (2 - Math.abs(t)) * 0.05);
      phenytoinGroup.add(pTooth);
    }

    // Heavy Fibrotic Mulberry-like Gingival Overgrowth (Dilantin / Phenytoin hyperplasia)
    const phenytoinMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.55 });
    for (let p = -4; p <= 4; p++) {
      const papillaGeo = new THREE.SphereGeometry(0.14 + (Math.abs(p) % 2) * 0.03, 16, 16);
      papillaGeo.scale(1, 1.35, 1.1);
      const papilla = new THREE.Mesh(papillaGeo, phenytoinMat);
      papilla.position.set(p * 0.18, 0.05 + Math.random() * 0.08, 0.18);
      phenytoinGroup.add(papilla);
    }

    // Surgical Excision Guideline Plane
    const phenyCutGeo = new THREE.PlaneGeometry(1.6, 0.02);
    const phenyCut = new THREE.Mesh(phenyCutGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    phenyCut.position.set(0, -0.05, 0.22);
    phenytoinGroup.add(phenyCut);

    // ==========================================
    // 9. PART II: BLEEDING DISORDERS & PETECHIAE / PURPURA
    // ==========================================
    const petechiaeGroup = new THREE.Group();
    petechiaeGroupRef.current = petechiaeGroup;
    rootGroup.add(petechiaeGroup);

    // Oral Mucosal Wall Surface
    const mucosaMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 });
    const mucosaGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.2, 32, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
    const mucosa = new THREE.Mesh(mucosaGeo, mucosaMat);
    mucosa.position.set(0, 0, 0);
    petechiaeGroup.add(mucosa);

    // Petechiae (Pinpoint red extravasations of blood)
    const petechiaMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
    for (let pt = 0; pt < 40; pt++) {
      const ptGeo = new THREE.CircleGeometry(0.015 + Math.random() * 0.025, 12);
      const ptMesh = new THREE.Mesh(ptGeo, petechiaMat);
      const angle = (Math.random() - 0.5) * 1.5;
      ptMesh.position.set(Math.sin(angle) * 0.89, (Math.random() - 0.5) * 0.9, Math.cos(angle) * 0.89);
      ptMesh.lookAt(0, ptMesh.position.y, 0);
      petechiaeGroup.add(ptMesh);
    }

    // Ecchymosis (Larger confluent purpuric bruise)
    const ecchymosisMat = new THREE.MeshBasicMaterial({ color: 0x581c87, transparent: true, opacity: 0.8 });
    const ecchGeo = new THREE.CircleGeometry(0.18, 16);
    const ecchMesh = new THREE.Mesh(ecchGeo, ecchymosisMat);
    ecchMesh.position.set(0.3, 0.1, 0.89);
    ecchMesh.lookAt(0, 0.1, 0);
    petechiaeGroup.add(ecchMesh);

    // ==========================================
    // 10. PART II: INFECTIOUS AEROSOL DISPERSION (COVID-19 / HEPATITIS)
    // ==========================================
    const aerosolGroup = new THREE.Group();
    aerosolGroupRef.current = aerosolGroup;
    rootGroup.add(aerosolGroup);

    // Ultrasonic Tip emitting aerosol cloud
    const scalerHandleMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25 });
    const scalerHandleGeo = new THREE.CylinderGeometry(0.04, 0.05, 1.0, 16);
    const scalerHandle = new THREE.Mesh(scalerHandleGeo, scalerHandleMat);
    scalerHandle.position.set(-0.5, -0.2, 0);
    scalerHandle.rotateZ(0.6);
    aerosolGroup.add(scalerHandle);

    // 100 Aerosol Particle Droplets
    const aeroCount = 120;
    const aeroGeo = new THREE.BufferGeometry();
    const aeroPos = new Float32Array(aeroCount * 3);
    for (let a = 0; a < aeroCount * 3; a += 3) {
      aeroPos[a] = (Math.random() - 0.2) * 1.4;
      aeroPos[a + 1] = -0.2 + Math.random() * 1.6;
      aeroPos[a + 2] = (Math.random() - 0.5) * 1.4;
    }
    aeroGeo.setAttribute('position', new THREE.BufferAttribute(aeroPos, 3));
    const aeroMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.045, transparent: true, opacity: 0.75 });
    const aerosolPoints = new THREE.Points(aeroGeo, aeroMat);
    aerosolParticlesRef.current = aerosolPoints;
    aerosolGroup.add(aerosolPoints);

    // Safe Manual Scaler (Gracey Curette alternative)
    const curetteMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const curetteGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.0, 16);
    const curette = new THREE.Mesh(curetteGeo, curetteMat);
    curette.position.set(0.6, -0.1, 0);
    curette.rotateZ(-0.4);
    aerosolGroup.add(curette);

    // Drag interaction
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
    const handleMouseUp = () => { isDraggingRef.current = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Mobile touch
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
    const handleTouchEnd = () => { isDraggingRef.current = false; };
    dom.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Render loop
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && rootGroup) {
        rootGroup.rotation.y += 0.005;
      }

      // Animate bacteremia
      if (bacteremiaParticlesRef.current && bacteremiaParticlesRef.current.visible) {
        const pArr = bacteremiaParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < pArr.length; i += 3) {
          pArr[i] -= 0.005;
          if (pArr[i] < -1.2) pArr[i] = 1.2;
        }
        bacteremiaParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Animate aerosol
      if (aerosolParticlesRef.current && aerosolParticlesRef.current.visible) {
        const aArr = aerosolParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < aArr.length; i += 3) {
          aArr[i] += 0.006;
          if (aArr[i] > 1.4) aArr[i] = -0.2;
        }
        aerosolParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
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

  // Mode visibility switcher
  useEffect(() => {
    if (
      !cardioGroupRef.current ||
      !ieGroupRef.current ||
      !overgrowthGroupRef.current ||
      !pacemakerGroupRef.current ||
      !dialysisGroupRef.current ||
      !diabetesGroupRef.current ||
      !pregnancyGroupRef.current ||
      !phenytoinGroupRef.current ||
      !petechiaeGroupRef.current ||
      !aerosolGroupRef.current
    ) return;

    cardioGroupRef.current.visible = activeMode === 'cardio_la';
    ieGroupRef.current.visible = activeMode === 'infective_endocarditis';
    overgrowthGroupRef.current.visible = activeMode === 'cyclosporine_overgrowth';
    pacemakerGroupRef.current.visible = activeMode === 'pacemaker_emf';
    dialysisGroupRef.current.visible = activeMode === 'dialysis_shunt';
    diabetesGroupRef.current.visible = activeMode === 'diabetes_hba1c';
    pregnancyGroupRef.current.visible = activeMode === 'pregnancy_supine';
    phenytoinGroupRef.current.visible = activeMode === 'phenytoin_epilepsy';
    petechiaeGroupRef.current.visible = activeMode === 'bleeding_petechiae';
    aerosolGroupRef.current.visible = activeMode === 'infectious_aerosol';
  }, [activeMode]);

  const handleResetCamera = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(0, 0.4, 4.3);
    cameraRef.current.lookAt(0, 0, 0);
    setCameraView('perspective');
  };

  const handleSetView = (view: 'perspective' | 'front' | 'side' | 'macro') => {
    if (!cameraRef.current) return;
    setCameraView(view);
    if (view === 'front') {
      cameraRef.current.position.set(0, 0, 4.2);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (view === 'side') {
      cameraRef.current.position.set(4.2, 0, 0);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (view === 'macro') {
      cameraRef.current.position.set(0, 0.1, 2.4);
      cameraRef.current.lookAt(0, 0, 0);
    } else {
      cameraRef.current.position.set(0, 0.4, 4.3);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const getModeInfo = (mode: MedCompMode3D) => {
    switch (mode) {
      case 'diabetes_hba1c':
        return {
          title: 'Diabetes Mellitus & Glycemic Control (HbA1c)',
          badge: 'Part II: Endocrine Disorders',
          color: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
          desc: 'Diabetes impairs wound healing, alters polymorphonuclear leukocyte chemotaxis, and increases post-op infections. HbA1c reflects glucose over 2–3 months. Well-controlled (≤ 6.5%) respond like healthy patients; poorly controlled (> 8%) have impaired response.',
          rule: 'Hypoglycemia Shock Rule: Schedule in MORNING; confirm patient took insulin & ate breakfast. If tremors/sweating occur, terminate treatment and give oral sugar/juice immediately!'
        };
      case 'pregnancy_supine':
        return {
          title: 'Pregnancy: Supine Hypotension Syndrome Prevention',
          badge: 'Part II: Pregnancy & Breastfeeding',
          color: 'border-pink-500/40 bg-pink-500/10 text-pink-300',
          desc: 'In late 2nd and 3rd trimesters, supine position allows gravid uterus to compress inferior vena cava and aorta, reducing cardiac preload and causing sudden syncope and fetal hypoxia. 2nd trimester is the safest treatment window.',
          rule: 'Chair Position Rule: Position patient on her LEFT SIDE or elevate right hip 5–6 inches with a pillow/blanket roll underneath. Postpone surgical procedures until after delivery.'
        };
      case 'phenytoin_epilepsy':
        return {
          title: 'Epilepsy & Phenytoin (Dilantin) Gingival Overgrowth',
          badge: 'Part II: Neurologic Disorders',
          color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
          desc: 'Fibrotic, mulberry-like gingival enlargement starts at interdental papillae and may cover crowns. Valproic acid (Depakene) causes platelet dysfunction and bleeding. In-chair seizure management requires lateral positioning to prevent aspiration.',
          rule: 'Seizure Protocol: Protect patient, DO NOT move to floor, clear trays, position chair supine with head turned to SIDE to maintain patent airway. Never insert mouth prop during seizure!'
        };
      case 'bleeding_petechiae':
        return {
          title: 'Bleeding Disorders, Thrombocytopenia & Purpura',
          badge: 'Part II: Hemorrhagic Diseases',
          color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
          desc: 'Platelet counts < 100,000 /mm³ result in spontaneous petechiae and ecchymoses. Aspirin > 325 mg/day must be discontinued 7–10 days before surgery in consultation with physician. Coagulation disorders (Hemophilia A/B, von Willebrand, Liver disease) require local hemostatic agents.',
          rule: 'Hemostasis Rule: Local hemostatics (oxidized cellulose, bovine collagen, pressure, sutures). In severe bleeding disorders or leukemia, periodontal surgery is performed in hospital.'
        };
      case 'infectious_aerosol':
        return {
          title: 'Infectious Diseases: Viral Hepatitis & Aerosol Control',
          badge: 'Part II: Infectious Diseases',
          color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
          desc: 'Hepatitis B, C, D, HIV, TB, and COVID-19 transmit via blood/saliva. Active hepatitis patients should not receive elective periodontal care. In emergency care, aerosol-generating ultrasonic scalers and air syringes are strictly avoided.',
          rule: 'Aerosol Rule: Avoid ultrasonic instruments; use manual Gracey scalers and preoperative chlorhexidine mouthrinse. Recovered Hep B patients must be screened for HBsAg.'
        };
      case 'cardio_la':
        return {
          title: 'Cardiovascular Disease & Epinephrine Safety',
          badge: 'Part I: Cardiovascular',
          color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
          desc: 'Controlled hypertensive patients safely receive 1–2 carpules with 1:100k epinephrine. Epinephrine > 1:100,000 is contraindicated in stroke patients. Short, stress-free morning appointments.',
          rule: 'Epi Rule: Maximum 0.04 mg cardiac epinephrine dose (1–2 carpules 1:100k).'
        };
      case 'infective_endocarditis':
        return {
          title: 'Infective Endocarditis (IE): Valve Seeding',
          badge: 'Part I: Cardiovascular',
          color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
          desc: 'Bacteremia during periodontal scaling seeds damaged valves. Prophylactic Amoxicillin 2.0g (or Clindamycin 600mg if allergic) 1 hour prior.',
          rule: 'Extraction Rule: Teeth with severe periodontitis & poor prognosis must be EXTRACTED to eliminate bacteremia sources.'
        };
      case 'cyclosporine_overgrowth':
        return {
          title: 'Renal Transplant: Cyclosporine Overgrowth',
          badge: 'Part I: Renal Disease',
          color: 'border-pink-500/40 bg-pink-500/10 text-pink-300',
          desc: 'Massive lobulated gingival overgrowth in immunosuppressed renal transplant recipients.',
          rule: 'Clearance Rule: Extract hopeless teeth before kidney transplant to prevent opportunistic sepsis.'
        };
      case 'pacemaker_emf':
        return {
          title: 'Cardiac Pacemakers: 30 cm EMF Radius',
          badge: 'Part I: Cardiovascular',
          color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
          desc: 'Keep ultrasonic scalers ≥ 30 cm away; hand instruments strongly advisable.',
          rule: 'Instrumentation Rule: Hand curettes preferred for SRP in pacemaker patients.'
        };
      case 'dialysis_shunt':
        return {
          title: 'Hemodialysis: AV Fistula Protection',
          badge: 'Part I: Renal Disease',
          color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
          desc: 'Treat on day AFTER dialysis (heparin wears off). Never take BP on arm with AV fistula.',
          rule: 'Scheduling Rule: Treat on day after dialysis; avoid nephrotoxic drugs (tetracyclines, aspirin).'
        };
    }
  };

  const modeInfo = getModeInfo(activeMode);

  return (
    <div className="bg-[#07132b] rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/30 uppercase tracking-wider">
              3D Medical Simulator (Parts I &amp; II)
            </span>
            <span className="text-xs text-slate-400">Dr. Maha Shukri (Univ. of Baghdad)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            {modeInfo.title}
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
              onClick={() => handleSetView('front')}
              className={`px-2 py-1 rounded transition ${cameraView === 'front' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Front
            </button>
            <button
              onClick={() => handleSetView('side')}
              className={`px-2 py-1 rounded transition ${cameraView === 'side' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Side
            </button>
            <button
              onClick={() => handleSetView('macro')}
              className={`px-2 py-1 rounded transition ${cameraView === 'macro' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Close-Up
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
            <span>{autoRotate ? 'Stop' : 'Orbit'}</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="relative w-full overflow-hidden bg-radial from-[#0d1d3f] via-[#091530] to-[#050b1a]" style={{ height }}>
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Clinical Callout top-left */}
        <div className="absolute top-3 left-3 max-w-sm pointer-events-none">
          <div className={`p-3.5 rounded-xl border backdrop-blur-md shadow-xl ${modeInfo.color}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">
              {modeInfo.badge}
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">{modeInfo.desc}</p>
            <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center gap-1.5 text-[11px] font-semibold text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{modeInfo.rule}</span>
            </div>
          </div>
        </div>

        {/* Mode-Specific Interactive Parameter top-right */}
        {activeMode === 'diabetes_hba1c' && (
          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl max-w-[220px]">
            <div className="text-xs font-semibold text-white mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              Glycated Hemoglobin (HbA1c)
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 my-1">
              <span>HbA1c:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${hba1cLevel <= 6.5 ? 'bg-emerald-500/20 text-emerald-300' : hba1cLevel <= 7.0 ? 'bg-blue-500/20 text-blue-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {hba1cLevel}%
              </span>
            </div>
            <input
              type="range"
              min="5.0"
              max="13.0"
              step="0.1"
              value={hba1cLevel}
              onChange={(e) => setHba1cLevel(parseFloat(e.target.value))}
              className="w-full accent-blue-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="text-[10px] mt-1 text-slate-400">
              {hba1cLevel <= 6.5 ? (
                <span className="text-emerald-400 font-semibold">✓ Well-Controlled (Normal healing)</span>
              ) : hba1cLevel <= 7.0 ? (
                <span className="text-blue-400 font-semibold">✓ ADA Target for Diabetics</span>
              ) : (
                <span className="text-rose-400 font-semibold">⚠ Poor Control (&gt;8% high complications)</span>
              )}
            </div>
          </div>
        )}

        {activeMode === 'pregnancy_supine' && (
          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl max-w-[220px]">
            <div className="text-xs font-semibold text-white mb-1 flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5 text-pink-400" />
              Left Lateral Chair Tilt
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 my-1">
              <span>Chair Angle:</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300">
                {chairTiltDegrees}° Left
              </span>
            </div>
            <div className="text-[10px] text-emerald-300 mt-1 leading-snug">
              ✓ Elevates right hip 5–6&quot; to relieve Vena Cava compression and prevent Supine Hypotension Syndrome.
            </div>
          </div>
        )}

        {/* Bottom Dock: Condition Selector */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col gap-2.5">
          <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            {/* Part II Focus Pills */}
            <button
              onClick={() => handleSelectMode('diabetes_hba1c')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${activeMode === 'diabetes_hba1c' ? 'bg-blue-600 text-white shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Diabetes &amp; HbA1c</span>
            </button>
            <button
              onClick={() => handleSelectMode('pregnancy_supine')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${activeMode === 'pregnancy_supine' ? 'bg-pink-600 text-white shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Baby className="w-3.5 h-3.5" />
              <span>Pregnancy &amp; Tilt</span>
            </button>
            <button
              onClick={() => handleSelectMode('phenytoin_epilepsy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${activeMode === 'phenytoin_epilepsy' ? 'bg-purple-600 text-white shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Phenytoin &amp; Epilepsy</span>
            </button>
            <button
              onClick={() => handleSelectMode('bleeding_petechiae')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${activeMode === 'bleeding_petechiae' ? 'bg-rose-600 text-white shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Droplet className="w-3.5 h-3.5" />
              <span>Purpura &amp; Bleeding</span>
            </button>
            <button
              onClick={() => handleSelectMode('infectious_aerosol')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${activeMode === 'infectious_aerosol' ? 'bg-amber-600 text-white shadow-md font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Biohazard className="w-3.5 h-3.5" />
              <span>Hepatitis &amp; Aerosol</span>
            </button>

            {/* Part I Pills */}
            <button
              onClick={() => handleSelectMode('cardio_la')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${activeMode === 'cardio_la' ? 'bg-rose-500 text-white shadow-md font-bold' : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'}`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Cardio &amp; LA</span>
            </button>
            <button
              onClick={() => handleSelectMode('infective_endocarditis')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${activeMode === 'infective_endocarditis' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'}`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Endocarditis</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Newman &amp; Carranza 13th Ed. • University of Baghdad</span>
            <span className="hidden sm:inline">Drag to Orbit • Scroll to Zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};
