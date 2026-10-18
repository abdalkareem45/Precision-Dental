import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Layers,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Eye,
  Activity,
  Dna,
  Shield,
  Compass,
  Sliders,
  ChevronRight,
  Target
} from 'lucide-react';

export type HsvComponentLayer = 'all' | 'spikes' | 'envelope' | 'tegument' | 'capsid' | 'genome';
export type VirusKey = 'hsv1' | 'hsv2' | 'vzv' | 'cmv' | 'hhv6' | 'ebv';
export type HighlightFocusMode = 'none' | 'genomic' | 'latency';

export interface VirusSpec {
  id: VirusKey;
  name: string;
  subfamily: 'alpha' | 'beta' | 'gamma';
  subfamilyName: string;
  color: number;
  secondaryColor: number;
  accentColor: string;
  genomeSize: string;
  genomeType: string;
  keyGenes: string[];
  radius: number;
  capsomers: number;
  spikeCount: number;
  latencyTarget: string;
  latencyDetails: string;
  clinicalPresentation: string;
  replicationTime: string;
}

export const VIRUS_SPECS: Record<VirusKey, VirusSpec> = {
  hsv1: {
    id: 'hsv1',
    name: 'HSV-1 (Alpha Prototype)',
    subfamily: 'alpha',
    subfamilyName: 'Alphaherpesvirinae',
    color: 0xf43f5e,
    secondaryColor: 0x10b981,
    accentColor: '#f43f5e',
    genomeSize: '~152 kb dsDNA',
    genomeType: 'Linear double-stranded duplex (Class I Baltimore)',
    keyGenes: ['UL23 (Thymidine Kinase)', 'UL30 (DNA Polymerase)', 'VP16 (α-TIF transactivator)', 'UL41 (VHS shutoff)'],
    radius: 1.68,
    capsomers: 96,
    spikeCount: 110,
    latencyTarget: 'Trigeminal Sensory Ganglion (CN V) & Oral Epithelium',
    latencyDetails: 'Maintained as circular episome in neuronal nuclei without replication; LATs repress lytic transcription.',
    clinicalPresentation: 'Primary Herpetic Gingivostomatitis, Recurrent Herpes Labialis, Recurrent Intraoral (keratinized mucosa)',
    replicationTime: '<18 hours (Rapid lytic cycle)',
  },
  hsv2: {
    id: 'hsv2',
    name: 'HSV-2 (Genital Strain)',
    subfamily: 'alpha',
    subfamilyName: 'Alphaherpesvirinae',
    color: 0xfb7185,
    secondaryColor: 0x34d399,
    accentColor: '#fb7185',
    genomeSize: '~154 kb dsDNA',
    genomeType: 'Linear double-stranded duplex (~50% homology with HSV-1)',
    keyGenes: ['UL23 (Thymidine Kinase)', 'UL30 (DNA Polymerase)', 'gG-2 (Type-specific glycoprotein)'],
    radius: 1.7,
    capsomers: 96,
    spikeCount: 115,
    latencyTarget: 'Sacral Sensory Ganglia (S2–S4)',
    latencyDetails: 'Persists in lumbosacral sensory root ganglia; periodic asymptomatic mucosal viral shedding.',
    clinicalPresentation: 'Genital ulcerations, rare oropharyngeal primary infections via orogenital contact',
    replicationTime: '<18 hours (Rapid lytic cycle)',
  },
  vzv: {
    id: 'vzv',
    name: 'VZV (Varicella-Zoster)',
    subfamily: 'alpha',
    subfamilyName: 'Alphaherpesvirinae',
    color: 0xf59e0b,
    secondaryColor: 0x38bdf8,
    accentColor: '#f59e0b',
    genomeSize: '~125 kb dsDNA (Smallest Alpha)',
    genomeType: 'Linear dsDNA duplex; smallest genome among human alphaherpesviruses',
    keyGenes: ['ORF36 (Thymidine Kinase)', 'ORF28 (DNA Polymerase)', 'IE62 (Major tegument transactivator)', 'gE / gI glycoprotein'],
    radius: 1.55,
    capsomers: 88,
    spikeCount: 95,
    latencyTarget: 'Dorsal Root Ganglia & Trigeminal Ganglia (CN V1/V2/V3)',
    latencyDetails: 'Lifelong latency in cranial sensory and dorsal root spinal ganglia; dermatomal unilateral reactivation.',
    clinicalPresentation: 'Chickenpox (Primary generalized rash) & Herpes Zoster (Shingles strictly respecting midline)',
    replicationTime: '<24 hours (Cell-associated rapid cycle)',
  },
  cmv: {
    id: 'cmv',
    name: 'CMV (HHV-5 Giant Virion)',
    subfamily: 'beta',
    subfamilyName: 'Betaherpesvirinae',
    color: 0x0ea5e9,
    secondaryColor: 0x818cf8,
    accentColor: '#0ea5e9',
    genomeSize: '~235 kb dsDNA (Largest Human Herpesvirus)',
    genomeType: 'Massive linear dsDNA duplex encoding over 200 distinct viral proteins',
    keyGenes: ['UL97 (Protein Kinase, Ganciclovir target)', 'UL54 (DNA Polymerase)', 'pp65 / UL83 (Abundant tegument antigen)'],
    radius: 1.95,
    capsomers: 112,
    spikeCount: 140,
    latencyTarget: 'Endothelial Cells, CD14+ Monocytes & CD34+ Myeloid Progenitors',
    latencyDetails: 'Latent in bone marrow progenitor cells; reactivates under T-cell immunosuppression (HIV / HSCT).',
    clinicalPresentation: 'Deep non-healing single oral ulcers in AIDS / transplant recipients, Owl-Eye intranuclear cytomegaly',
    replicationTime: '>48 hours (Slow replication cycle)',
  },
  hhv6: {
    id: 'hhv6',
    name: 'HHV-6 (Roseolovirus)',
    subfamily: 'beta',
    subfamilyName: 'Betaherpesvirinae',
    color: 0x8b5cf6,
    secondaryColor: 0xf43f5e,
    accentColor: '#8b5cf6',
    genomeSize: '~160 kb dsDNA',
    genomeType: 'Linear dsDNA with telomeric repeat sequences allowing chromosomal integration',
    keyGenes: ['U69 (Protein Kinase)', 'U38 (DNA Polymerase)', 'DR (Direct Repeat telomeric integration loci)'],
    radius: 1.62,
    capsomers: 88,
    spikeCount: 100,
    latencyTarget: 'CD4+ T-Lymphocytes & Salivary Glands',
    latencyDetails: 'Can integrate into host telomeres (ciHHV-6 in ~1% of population) and salivary glandular epithelium.',
    clinicalPresentation: 'Roseola Infantum (Exanthem Subitum), implicated in up to 60% of Bell Palsy cases (Slide 9)',
    replicationTime: '>36 hours (Slow replication cycle)',
  },
  ebv: {
    id: 'ebv',
    name: 'EBV (HHV-4 Lymphotropic)',
    subfamily: 'gamma',
    subfamilyName: 'Gammaherpesvirinae',
    color: 0x10b981,
    secondaryColor: 0xfbbf24,
    accentColor: '#10b981',
    genomeSize: '~172 kb dsDNA',
    genomeType: 'Linear dsDNA in virion; circularizes into non-integrated episome in nucleus',
    keyGenes: ['EBNA-1 (Episome tethering)', 'LMP-1 (CD40 oncogenic mimic)', 'LMP-2', 'gp350/220 (CD21 docking)'],
    radius: 1.75,
    capsomers: 96,
    spikeCount: 105,
    latencyTarget: 'Resting Memory B-Lymphocytes (Lifelong Episomal Reservoir)',
    latencyDetails: 'Persists in quiescent memory B-cells; express latency programs I/II/III preventing immune elimination.',
    clinicalPresentation: 'Infectious Mononucleosis, Oral Hairy Leukoplakia (lateral tongue), Burkitt Lymphoma',
    replicationTime: 'Variable / Latent transforming; immortalizes B-cells',
  },
};

interface HsvVirion3DProps {
  selectedLayer?: HsvComponentLayer;
  selectedVirus?: VirusKey;
  onSelectLayer?: (layer: HsvComponentLayer) => void;
  onSelectVirus?: (virus: VirusKey) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  highlightFocus?: HighlightFocusMode;
  onSelectHighlightFocus?: (focus: HighlightFocusMode) => void;
  height?: number;
}

export const HsvVirion3D: React.FC<HsvVirion3DProps> = ({
  selectedLayer = 'all',
  selectedVirus = 'hsv1',
  onSelectLayer,
  onSelectVirus,
  isExpanded = true,
  onToggleExpand,
  highlightFocus = 'none',
  onSelectHighlightFocus,
  height = 420,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [internalLayer, setInternalLayer] = useState<HsvComponentLayer>(selectedLayer);
  const activeLayer = onSelectLayer ? selectedLayer : internalLayer;

  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [internalExpanded, setInternalExpanded] = useState<boolean>(isExpanded);
  const activeExpanded = onToggleExpand !== undefined ? isExpanded : internalExpanded;

  const [internalHighlightFocus, setInternalHighlightFocus] = useState<HighlightFocusMode>(highlightFocus);
  const activeHighlight = onSelectHighlightFocus !== undefined ? highlightFocus : internalHighlightFocus;

  const setHighlightMode = (mode: HighlightFocusMode) => {
    if (onSelectHighlightFocus) {
      onSelectHighlightFocus(mode);
    } else {
      setInternalHighlightFocus(mode);
    }
  };

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const virionGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Mesh component refs
  const spikesGroupRef = useRef<THREE.Group | null>(null);
  const envelopeMeshRef = useRef<THREE.Mesh | null>(null);
  const tegumentGroupRef = useRef<THREE.Group | null>(null);
  const capsidGroupRef = useRef<THREE.Group | null>(null);
  const genomeGroupRef = useRef<THREE.Group | null>(null);
  const genomeDnaMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const particlePointsRef = useRef<THREE.Points | null>(null);
  const latencyBeaconRef = useRef<THREE.Group | null>(null);
  const genomicBeaconRef = useRef<THREE.Group | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Current expansion value smoothly animating towards targetExp
  const currentExpRef = useRef<number>(0.1);
  const targetExpRef = useRef<number>(1.0);
  const expansionAnimationTimerRef = useRef<number | null>(null);

  const currentSpec = VIRUS_SPECS[selectedVirus] || VIRUS_SPECS.hsv1;

  // Whenever selectedVirus changes, trigger a dynamic cinematic expansion bloom!
  useEffect(() => {
    // Snap back slightly to 0.1, then smoothly bloom out to full expansion (1.0)
    currentExpRef.current = 0.05;
    targetExpRef.current = 1.0;

    // If expansion was closed, automatically open it to showcase the internal biology
    if (!activeExpanded && onToggleExpand) {
      onToggleExpand();
    } else if (!activeExpanded) {
      setInternalExpanded(true);
    }
  }, [selectedVirus]);

  // Keep target expansion synchronized with activeExpanded
  useEffect(() => {
    targetExpRef.current = activeExpanded ? 1.0 : 0.0;
  }, [activeExpanded]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const canvasHeight = height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(currentSpec.color, 3.8);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(currentSpec.secondaryColor, 3.0);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    const bottomGlowLight = new THREE.PointLight(currentSpec.color, 2.0, 10);
    bottomGlowLight.position.set(0, -3.5, 0);
    scene.add(bottomGlowLight);

    // Master Virion Group
    const virionGroup = new THREE.Group();
    scene.add(virionGroup);
    virionGroupRef.current = virionGroup;

    // ==========================================
    // 1. GENOME CORE: Coiled dsDNA Double Helix
    // ==========================================
    const genomeGroup = new THREE.Group();
    genomeGroupRef.current = genomeGroup;
    virionGroup.add(genomeGroup);

    const dnaCurvePoints: THREE.Vector3[] = [];
    const helixTurns = 9;
    const helixRadius = 0.54 * (currentSpec.radius / 1.68);
    const helixHeight = 0.95 * (currentSpec.radius / 1.68);

    for (let i = 0; i < 240; i++) {
      const t = (i / 240) * (Math.PI * 2 * helixTurns);
      const y = ((i / 240) - 0.5) * helixHeight;
      const r = helixRadius * (0.82 + 0.18 * Math.sin(i * 0.15));
      dnaCurvePoints.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r));
    }

    const dnaCurve = new THREE.CatmullRomCurve3(dnaCurvePoints);
    const dnaTubeGeo = new THREE.TubeGeometry(dnaCurve, 160, 0.05, 8, false);
    const dnaMat = new THREE.MeshStandardMaterial({
      color: currentSpec.secondaryColor,
      emissive: currentSpec.secondaryColor,
      emissiveIntensity: 0.85,
      roughness: 0.15,
      metalness: 0.4,
    });
    genomeDnaMatRef.current = dnaMat;
    const dnaMesh = new THREE.Mesh(dnaTubeGeo, dnaMat);
    genomeGroup.add(dnaMesh);

    // Glowing Central Spherical Core Matrix
    const coreSphGeo = new THREE.SphereGeometry(0.38 * (currentSpec.radius / 1.68), 24, 24);
    const coreSphMat = new THREE.MeshStandardMaterial({
      color: currentSpec.secondaryColor,
      emissive: currentSpec.secondaryColor,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.75,
      roughness: 0.3,
    });
    const coreSph = new THREE.Mesh(coreSphGeo, coreSphMat);
    genomeGroup.add(coreSph);

    // DNA Base-Pair Ladder Bars
    const barGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.32, 6);
    const barMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7 });
    for (let i = 0; i < 35; i++) {
      const bar = new THREE.Mesh(barGeo, barMat);
      const angle = (i / 35) * Math.PI * 4;
      bar.position.set(
        Math.cos(angle) * 0.28,
        ((i / 35) - 0.5) * 0.8,
        Math.sin(angle) * 0.28
      );
      bar.rotation.z = Math.PI / 2;
      bar.rotation.y = angle;
      genomeGroup.add(bar);
    }

    // Holographic Genomic Trait 3D Ring
    const genomicBeaconGroup = new THREE.Group();
    genomicBeaconRef.current = genomicBeaconGroup;
    virionGroup.add(genomicBeaconGroup);

    const genomeHaloRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.75, 0.025, 8, 36),
      new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true, transparent: true, opacity: 0.9 })
    );
    genomeHaloRing.rotation.x = Math.PI / 2;
    genomicBeaconGroup.add(genomeHaloRing);

    // ==========================================
    // 2. ICOSAHEDRAL CAPSID: T=16 (162 Capsomers)
    // ==========================================
    const capsidGroup = new THREE.Group();
    capsidGroupRef.current = capsidGroup;
    virionGroup.add(capsidGroup);

    const capsidR = 0.96 * (currentSpec.radius / 1.68);
    const capsidShellGeo = new THREE.IcosahedronGeometry(capsidR, 1);
    const capsidShellMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.4,
      roughness: 0.25,
      metalness: 0.45,
      transparent: true,
      opacity: 0.8,
    });
    const capsidShell = new THREE.Mesh(capsidShellGeo, capsidShellMat);
    capsidGroup.add(capsidShell);

    const capsidWireGeo = new THREE.IcosahedronGeometry(capsidR + 0.015, 1);
    const capsidWireMat = new THREE.MeshBasicMaterial({
      color: 0xa5f3fc,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const capsidWire = new THREE.Mesh(capsidWireGeo, capsidWireMat);
    capsidGroup.add(capsidWire);

    // Hexons and Pentons (Capsomers)
    const capsomerGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.13, 6);
    const capsomerMat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x0e7490,
      emissiveIntensity: 0.55,
      roughness: 0.2,
      metalness: 0.5,
    });

    for (let i = 0; i < currentSpec.capsomers; i++) {
      const phi = Math.acos(-1 + (2 * i) / currentSpec.capsomers);
      const theta = Math.sqrt(currentSpec.capsomers * Math.PI) * phi;
      const x = capsidR * Math.cos(theta) * Math.sin(phi);
      const y = capsidR * Math.sin(theta) * Math.sin(phi);
      const z = capsidR * Math.cos(phi);

      const capsomer = new THREE.Mesh(capsomerGeo, capsomerMat);
      capsomer.position.set(x, y, z);
      capsomer.lookAt(new THREE.Vector3(x * 2, y * 2, z * 2));
      capsomer.rotation.x += Math.PI / 2;
      capsidGroup.add(capsomer);
    }

    // ==========================================
    // 3. TEGUMENT MATRIX (VP16, IE62, pp65)
    // ==========================================
    const tegumentGroup = new THREE.Group();
    tegumentGroupRef.current = tegumentGroup;
    virionGroup.add(tegumentGroup);

    const tegumentR = 1.34 * (currentSpec.radius / 1.68);
    const tegumentGeo = new THREE.SphereGeometry(tegumentR, 28, 28);
    const tegumentMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.38,
      roughness: 0.6,
      metalness: 0.1,
    });
    const tegumentMesh = new THREE.Mesh(tegumentGeo, tegumentMat);
    tegumentGroup.add(tegumentMesh);

    // Protein granules suspended in tegument space
    const granuleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const granuleMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 0.8,
    });
    for (let i = 0; i < 48; i++) {
      const pR = (capsidR + 0.15) + Math.random() * (tegumentR - capsidR - 0.2);
      const pPhi = Math.random() * Math.PI * 2;
      const pTheta = Math.random() * Math.PI;
      const granule = new THREE.Mesh(granuleGeo, granuleMat);
      granule.position.set(
        pR * Math.sin(pTheta) * Math.cos(pPhi),
        pR * Math.sin(pTheta) * Math.sin(pPhi),
        pR * Math.cos(pTheta)
      );
      tegumentGroup.add(granule);
    }

    // ==========================================
    // 4. LIPID BILAYER ENVELOPE
    // ==========================================
    const envR = currentSpec.radius;
    const envelopeGeo = new THREE.SphereGeometry(envR, 36, 36);
    const envelopeMat = new THREE.MeshStandardMaterial({
      color: currentSpec.color,
      emissive: currentSpec.color,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.45,
      roughness: 0.35,
      metalness: 0.25,
    });
    const envelopeMesh = new THREE.Mesh(envelopeGeo, envelopeMat);
    envelopeMeshRef.current = envelopeMesh;
    virionGroup.add(envelopeMesh);

    // ==========================================
    // 5. GLYCOPROTEIN SPIKES (gB, gC, gD, gH, gL)
    // ==========================================
    const spikesGroup = new THREE.Group();
    spikesGroupRef.current = spikesGroup;
    virionGroup.add(spikesGroup);

    const spikeStemGeo = new THREE.CylinderGeometry(0.024, 0.038, 0.38, 6);
    const spikeHeadGeo = new THREE.SphereGeometry(0.07, 8, 8);
    const spikeMat = new THREE.MeshStandardMaterial({
      color: currentSpec.color,
      emissive: currentSpec.color,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.4,
    });

    for (let i = 0; i < currentSpec.spikeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / currentSpec.spikeCount);
      const theta = Math.sqrt(currentSpec.spikeCount * Math.PI) * phi;
      const x = envR * Math.cos(theta) * Math.sin(phi);
      const y = envR * Math.sin(theta) * Math.sin(phi);
      const z = envR * Math.cos(phi);

      const singleSpike = new THREE.Group();
      const stem = new THREE.Mesh(spikeStemGeo, spikeMat);
      stem.position.y = 0.19;
      singleSpike.add(stem);

      const head = new THREE.Mesh(spikeHeadGeo, spikeMat);
      head.position.y = 0.38;
      singleSpike.add(head);

      singleSpike.position.set(x, y, z);
      singleSpike.lookAt(new THREE.Vector3(x * 2, y * 2, z * 2));
      singleSpike.rotation.x += Math.PI / 2;
      spikesGroup.add(singleSpike);
    }

    // ==========================================
    // 6. LATENCY SITE 3D HOLOGRAPHIC BEACON
    // ==========================================
    const latencyGroup = new THREE.Group();
    latencyBeaconRef.current = latencyGroup;
    virionGroup.add(latencyGroup);

    const beaconPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 })
    );
    beaconPole.position.set(0, envR + 0.7, 0);
    latencyGroup.add(beaconPole);

    const beaconOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 1.2 })
    );
    beaconOrb.position.set(0, envR + 1.4, 0);
    latencyGroup.add(beaconOrb);

    const beaconRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.035, 8, 28),
      new THREE.MeshBasicMaterial({ color: 0x7dd3fc, wireframe: true })
    );
    beaconRing.rotation.x = Math.PI / 2;
    beaconRing.position.set(0, envR + 1.4, 0);
    latencyGroup.add(beaconRing);

    const beaconOuterRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.02, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.6 })
    );
    beaconOuterRing.rotation.x = Math.PI / 2;
    beaconOuterRing.position.set(0, envR + 1.4, 0);
    latencyGroup.add(beaconOuterRing);

    // ==========================================
    // 7. DYNAMIC PARTICLES AURA
    // ==========================================
    const pCount = 380;
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const pRad = 0.6 + Math.random() * 2.4;
      const pPhi = Math.random() * Math.PI * 2;
      const pTheta = Math.random() * Math.PI;

      pPos[i * 3] = pRad * Math.sin(pTheta) * Math.cos(pPhi);
      pPos[i * 3 + 1] = pRad * Math.sin(pTheta) * Math.sin(pPhi);
      pPos[i * 3 + 2] = pRad * Math.cos(pTheta);

      pCol[i * 3] = ((currentSpec.color >> 16) & 255) / 255;
      pCol[i * 3 + 1] = ((currentSpec.color >> 8) & 255) / 255;
      pCol[i * 3 + 2] = (currentSpec.color & 255) / 255;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const pPoints = new THREE.Points(pGeo, pMat);
    particlePointsRef.current = pPoints;
    virionGroup.add(pPoints);

    // ==========================================
    // ANIMATION LOOP & LAYER SMOOTH INTERPOLATION
    // ==========================================
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth expansion interpolation (easing into targetExpRef.current)
      const targetExp = targetExpRef.current;
      currentExpRef.current += (targetExp - currentExpRef.current) * 0.085;
      const exp = currentExpRef.current;

      // Apply animated expansion to concentric shells
      if (spikesGroup && envelopeMesh && tegumentGroup && capsidGroup && genomeGroup) {
        // Spikes expand outward furthest
        const spikeScale = 1.0 + exp * 0.52;
        spikesGroup.scale.set(spikeScale, spikeScale, spikeScale);

        // Envelope expands outward and becomes increasingly translucent
        const envScale = 1.0 + exp * 0.40;
        envelopeMesh.scale.set(envScale, envScale, envScale);
        (envelopeMesh.material as THREE.MeshStandardMaterial).opacity = Math.max(0.12, 0.45 - exp * 0.28);

        // Tegument peels outward
        const tegScale = 1.0 + exp * 0.24;
        tegumentGroup.scale.set(tegScale, tegScale, tegScale);
        tegumentMesh.material.opacity = Math.max(0.16, 0.38 - exp * 0.18);

        // Capsid expands slightly to reveal inner core
        const capsidScale = 1.0 + exp * 0.12;
        capsidGroup.scale.set(capsidScale, capsidScale, capsidScale);

        // Genome Core pulsates dynamically
        const isGenomicFocused = activeHighlight === 'genomic';
        const pulseRate = isGenomicFocused ? 6 : 3;
        const pulseAmp = isGenomicFocused ? 0.12 : 0.04;
        const genomeScale = (1.0 + Math.sin(elapsed * pulseRate) * pulseAmp) * (isGenomicFocused ? 1.25 : 1.0);
        genomeGroup.scale.set(genomeScale, genomeScale, genomeScale);

        // If genomic focus is active, boost emissive intensity
        if (genomeDnaMatRef.current) {
          genomeDnaMatRef.current.emissiveIntensity = isGenomicFocused
            ? 1.5 + Math.sin(elapsed * 8) * 0.4
            : 0.85;
        }

        // Layer isolation visibility filters
        if (activeLayer === 'all') {
          spikesGroup.visible = true;
          envelopeMesh.visible = true;
          tegumentGroup.visible = true;
          capsidGroup.visible = true;
          genomeGroup.visible = true;
        } else {
          spikesGroup.visible = activeLayer === 'spikes';
          envelopeMesh.visible = activeLayer === 'envelope';
          tegumentGroup.visible = activeLayer === 'tegument';
          capsidGroup.visible = activeLayer === 'capsid';
          genomeGroup.visible = activeLayer === 'genome';
        }
      }

      // Latency Beacon rotation & pulse
      if (latencyGroup) {
        beaconRing.rotation.z += 0.04;
        beaconOuterRing.rotation.z -= 0.025;
        beaconOrb.scale.setScalar(1 + Math.sin(elapsed * 5) * 0.18);
        const isLatencyFocused = activeHighlight === 'latency';
        latencyGroup.visible = isLatencyFocused || exp > 0.45;
        if (isLatencyFocused) {
          beaconPole.scale.y = 1.0 + Math.sin(elapsed * 6) * 0.2;
        }
      }

      // Genomic Beacon rotation
      if (genomicBeaconGroup) {
        genomeHaloRing.rotation.z += 0.03;
        const isGenomicFocused = activeHighlight === 'genomic';
        genomicBeaconGroup.visible = isGenomicFocused || exp > 0.6;
      }

      // Particle rotation
      if (particlePointsRef.current) {
        particlePointsRef.current.rotation.y += 0.002;
      }

      // Gentle auto-rotation when not user-dragging
      if (isRotating && !isDraggingRef.current) {
        virionGroup.rotation.y += 0.005;
        virionGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.04;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse Drag & Wheel Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !virionGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      virionGroupRef.current.rotation.y += deltaX * 0.008;
      virionGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    let touchDist: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        return;
      }
      if (e.touches.length === 0) return;
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchDist !== null && cameraRef.current) {
        const curDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = touchDist - curDist;
        cameraRef.current.position.z = Math.max(2.8, Math.min(8.0, cameraRef.current.position.z + diff * 0.01));
        touchDist = curDist;
        return;
      }
      if (!isDraggingRef.current || !virionGroupRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      virionGroupRef.current.rotation.y += deltaX * 0.008;
      virionGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      touchDist = null;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = cameraRef.current.position.z + e.deltaY * 0.005;
      cameraRef.current.position.z = Math.max(2.8, Math.min(8.0, newZ));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      cameraRef.current.aspect = newWidth / canvasHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, canvasHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [selectedVirus, height, activeLayer, activeHighlight]);

  const handleToggleExpansion = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const handleZoom = (dir: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = dir === 'in' ? -0.8 : 0.8;
    cameraRef.current.position.z = Math.max(2.8, Math.min(8.0, cameraRef.current.position.z + delta));
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !virionGroupRef.current) return;
    cameraRef.current.position.set(0, 0, 5.2);
    virionGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col select-none">
      {/* Top HUD Controls Bar */}
      <div className="p-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: currentSpec.accentColor }} />
          <span className="text-xs font-bold text-white tracking-wide">
            3D Specimen: {currentSpec.name}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {currentSpec.subfamilyName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {/* Animated 3D Expansion Trigger Button */}
          <button
            onClick={handleToggleExpansion}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-all text-xs flex items-center gap-1.5 ${
              activeExpanded
                ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-md ring-1 ring-white/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{activeExpanded ? '✨ Structure Exploded' : '🚀 Expand 3D Structure'}</span>
          </button>

          {/* Genomic Trait Focus Button */}
          <button
            onClick={() => setHighlightMode(activeHighlight === 'genomic' ? 'none' : 'genomic')}
            className={`px-2.5 py-1.5 rounded-lg font-bold border transition-all text-[11px] flex items-center gap-1.5 ${
              activeHighlight === 'genomic'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>Genomic Trait</span>
          </button>

          {/* Latency Site Focus Button */}
          <button
            onClick={() => setHighlightMode(activeHighlight === 'latency' ? 'none' : 'latency')}
            className={`px-2.5 py-1.5 rounded-lg font-bold border transition-all text-[11px] flex items-center gap-1.5 ${
              activeHighlight === 'latency'
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Latency Site</span>
          </button>

          {/* Rotate Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Reset View */}
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Reset Angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount Area */}
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Dynamic Highlight Overlays */}
        <div className="absolute top-4 left-4 max-w-sm bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-mono text-slate-200 pointer-events-none z-10 space-y-1.5 shadow-xl">
          <div className="text-emerald-400 font-bold flex items-center gap-1.5">
            <Dna className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Genomic Trait: {currentSpec.genomeSize}</span>
          </div>
          <div className="text-sky-300 text-[10px] flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span className="truncate">Latency: {currentSpec.latencyTarget}</span>
          </div>
          {activeHighlight === 'genomic' && (
            <div className="text-[10px] text-emerald-300/90 border-t border-slate-800 pt-1 font-sans">
              Core dsDNA highlighted · Linear duplex with viral polymerase loci
            </div>
          )}
          {activeHighlight === 'latency' && (
            <div className="text-[10px] text-sky-300/90 border-t border-slate-800 pt-1 font-sans">
              3D Latency beacon active · Target neuro-ganglionic / hematopoietic reservoir
            </div>
          )}
        </div>

        {/* Floating Active Layer Indicator Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-mono text-slate-200 pointer-events-none z-10 flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
          <div>
            <div className="text-white font-bold text-xs">
              {activeExpanded
                ? `⚡ Animated Expansion Active · Peeling Concentric Virion Layers`
                : `✨ Compact Intact Virion (~${Math.round(currentSpec.radius * 120)} nm)`}
            </div>
            <div className="text-[10px] text-slate-400">
              Drag to orbit 3D model · Scroll to zoom
            </div>
          </div>
        </div>
      </div>

      {/* Layer Peel Filter Bar */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>Isolate Virion Layer:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all' as const, label: 'Full Virion' },
            { id: 'spikes' as const, label: 'Spikes (gB/gC/gD)' },
            { id: 'envelope' as const, label: 'Lipid Envelope' },
            { id: 'tegument' as const, label: 'Tegument Matrix' },
            { id: 'capsid' as const, label: 'T=16 Capsid' },
            { id: 'genome' as const, label: 'dsDNA Core' },
          ].map((lyr) => (
            <button
              key={lyr.id}
              onClick={() => {
                if (onSelectLayer) onSelectLayer(lyr.id);
                else setInternalLayer(lyr.id);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                activeLayer === lyr.id
                  ? 'bg-rose-600 text-white shadow-sm font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {lyr.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
