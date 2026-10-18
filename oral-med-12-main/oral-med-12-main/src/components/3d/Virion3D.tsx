import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  Info,
  CheckCircle2,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Shield,
  Dna,
  Zap,
  Activity,
  Flame,
  Wind,
  Sliders,
  Eye,
  Radio
} from 'lucide-react';
import {
  useVirionScene,
  VirionSceneProvider,
  VirionComponentId,
  VirionInteractionMode
} from '../../context/VirionSceneContext';

// Helper to create a circular feathered glowing sprite texture in memory
const createGlowParticleTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

interface ParticleKinematicData {
  u: number;
  v: number;
  normX: number;
  normY: number;
  normZ: number;
  baseRadius: number;
  speed: number;
  phase: number;
  seed: number;
}

interface Virion3DInnerProps {
  tropismTarget?: 'endothelium' | 'mononuclear' | 'wbc';
}

const Virion3DInner: React.FC<Virion3DInnerProps> = ({ tropismTarget = 'endothelium' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const virionGroupRef = useRef<THREE.Group | null>(null);
  const hostCellGroupRef = useRef<THREE.Group | null>(null);
  const targetRingRef = useRef<THREE.Mesh | null>(null);

  // Mesh handles
  const genomeMeshRef = useRef<THREE.Mesh | null>(null);
  const capsidMeshRef = useRef<THREE.Mesh | null>(null);
  const tegumentMeshRef = useRef<THREE.Mesh | null>(null);
  const envelopeMeshRef = useRef<THREE.Mesh | null>(null);
  const spikesGroupRef = useRef<THREE.Group | null>(null);

  // Particle Effect System references
  const particlePointsRef = useRef<THREE.Points | null>(null);
  const particlePositionsRef = useRef<Float32Array | null>(null);
  const particleColorsRef = useRef<Float32Array | null>(null);
  const particleDataRef = useRef<ParticleKinematicData[]>([]);

  // Raycaster for clicking directly on 3D meshes in canvas
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseCoordsRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Consume central state manager
  const {
    virusType,
    selectedComponent,
    interactionMode,
    selectComponent,
    setInteractionMode,
    resetScene,
    activeMetadata,
    registerMesh,
    unregisterMesh,
    getTransformTargets,
    cameraTargetDistance,
    particlesEnabled,
    setParticlesEnabled,
    particleSpeed,
    setParticleSpeed,
  } = useVirionScene();

  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);

  // Mouse & Touch interaction
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const touchDistanceRef = useRef<number | null>(null);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const modelRotationRef = useRef({ x: 0.2, y: 0.3 });
  const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 4.2));

  // Initialize Three.js scene and register meshes with central manager
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913); // High-contrast clinical navy

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, cameraTargetDistance);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 2.4);
    rimLight.position.set(-4, -3, -4);
    scene.add(rimLight);

    const internalSpot = new THREE.PointLight(0xec4899, 4.5, 12);
    internalSpot.position.set(0, 0, 0);
    scene.add(internalSpot);

    const virionGroup = new THREE.Group();
    virionGroupRef.current = virionGroup;
    scene.add(virionGroup);

    // Host Cell Simulation for Tropism docking
    const hostCellGroup = new THREE.Group();
    hostCellGroup.position.set(0, -2.4, 0);
    hostCellGroup.visible = false;
    hostCellGroupRef.current = hostCellGroup;
    scene.add(hostCellGroup);

    // Host cell plasma membrane
    const membraneGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.5, 48);
    const membraneMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
    hostCellGroup.add(membraneMesh);

    // Cellular receptors on membrane
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const r = 1.0 + Math.sin(i * 3) * 0.8;
      const recGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.45, 8);
      const recMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6,
      });
      const recMesh = new THREE.Mesh(recGeo, recMat);
      recMesh.position.set(Math.cos(angle) * r, 0.35, Math.sin(angle) * r);
      hostCellGroup.add(recMesh);
    }

    // Focal Target Pulsing Ring
    const targetRingGeo = new THREE.RingGeometry(1.6, 1.7, 48);
    const targetRingMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat);
    targetRing.visible = false;
    targetRingRef.current = targetRing;
    scene.add(targetRing);

    // BUILD SPECIFIC MESH COMPONENTS FOR THIS VIRUS TYPE AND REGISTER WITH CENTRAL MANAGER
    if (virusType === 'cmv') {
      // 1. GENOME: Double-Stranded DNA Core (~235 kb)
      const dnaGeo = new THREE.TorusKnotGeometry(0.55, 0.17, 100, 24, 2, 3);
      const dnaMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0x9f1239,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 1.0,
      });
      const dnaMesh = new THREE.Mesh(dnaGeo, dnaMat);
      dnaMesh.name = 'genome';
      genomeMeshRef.current = dnaMesh;
      virionGroup.add(dnaMesh);
      registerMesh('genome', dnaMesh);

      // 2. CAPSID: Icosahedral Capsid (T=16 shell)
      const capsidGeo = new THREE.IcosahedronGeometry(1.15, 2);
      const capsidMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        wireframe: false,
        roughness: 0.25,
        metalness: 0.2,
        transparent: true,
        opacity: 0.9,
      });
      const capsidMesh = new THREE.Mesh(capsidGeo, capsidMat);
      capsidMesh.name = 'capsid';
      capsidMeshRef.current = capsidMesh;
      virionGroup.add(capsidMesh);
      registerMesh('capsid', capsidMesh);

      // 3. TEGUMENT: Proteinaceous Tegument (pp65 / pp71 / UL97 Kinase)
      const tegumentGeo = new THREE.SphereGeometry(1.45, 32, 32);
      const tegumentMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.35,
        roughness: 0.8,
      });
      const tegumentMesh = new THREE.Mesh(tegumentGeo, tegumentMat);
      tegumentMesh.name = 'tegument';
      tegumentMeshRef.current = tegumentMesh;
      virionGroup.add(tegumentMesh);
      registerMesh('tegument', tegumentMesh);

      // 4. ENVELOPE: Host-Derived Lipid Bilayer Envelope
      const envelopeGeo = new THREE.SphereGeometry(1.75, 36, 36);
      const envelopeMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.35,
        roughness: 0.3,
      });
      const envelopeMesh = new THREE.Mesh(envelopeGeo, envelopeMat);
      envelopeMesh.name = 'envelope';
      envelopeMeshRef.current = envelopeMesh;
      virionGroup.add(envelopeMesh);
      registerMesh('envelope', envelopeMesh);

      // 5. SPIKES: Glycoprotein Spikes (gB, gH/gL/gO complexes)
      const spikesGroup = new THREE.Group();
      spikesGroup.name = 'spikes';
      spikesGroupRef.current = spikesGroup;
      const spikeGeo = new THREE.ConeGeometry(0.09, 0.42, 8);
      const spikeMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.5,
        metalness: 0.2,
        roughness: 0.3,
        transparent: true,
        opacity: 1.0,
      });

      const numSpikes = 84;
      for (let i = 0; i < numSpikes; i++) {
        const phi = Math.acos(-1 + (2 * i) / numSpikes);
        const theta = Math.sqrt(numSpikes * Math.PI) * phi;
        const radius = 1.76;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(x, y, z);
        spike.lookAt(new THREE.Vector3(x * 2, y * 2, z * 2));
        spike.rotation.x += Math.PI / 2;
        spikesGroup.add(spike);
      }
      virionGroup.add(spikesGroup);
      registerMesh('spikes', spikesGroup);
    } else {
      // COXSACKIEVIRUS (Picornaviridae enterovirus, non-enveloped)
      // 1. GENOME: +ssRNA Genome (~7.4 kb)
      const rnaGeo = new THREE.TorusKnotGeometry(0.68, 0.2, 80, 20, 3, 4);
      const rnaMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.9,
        roughness: 0.3,
        transparent: true,
        opacity: 1.0,
      });
      const rnaMesh = new THREE.Mesh(rnaGeo, rnaMat);
      rnaMesh.name = 'genome';
      genomeMeshRef.current = rnaMesh;
      virionGroup.add(rnaMesh);
      registerMesh('genome', rnaMesh);

      // 2. CAPSID: 60-Protomer Icosahedral Capsid (VP1, VP2, VP3, VP4)
      const capsidGeo = new THREE.IcosahedronGeometry(1.65, 2);
      const capsidMat = new THREE.MeshStandardMaterial({
        color: 0x0d9488,
        roughness: 0.25,
        metalness: 0.15,
        transparent: true,
        opacity: 0.95,
      });
      const capsidMesh = new THREE.Mesh(capsidGeo, capsidMat);
      capsidMesh.name = 'capsid';
      capsidMeshRef.current = capsidMesh;
      virionGroup.add(capsidMesh);
      registerMesh('capsid', capsidMesh);

      // 3. TEGUMENT / INNER VP4 MATRIX
      const internalVp4Geo = new THREE.IcosahedronGeometry(1.2, 1);
      const internalVp4Mat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.4,
        roughness: 0.5,
        wireframe: true,
      });
      const vp4Mesh = new THREE.Mesh(internalVp4Geo, internalVp4Mat);
      vp4Mesh.name = 'tegument';
      tegumentMeshRef.current = vp4Mesh;
      virionGroup.add(vp4Mesh);
      registerMesh('tegument', vp4Mesh);

      // 4. SPIKES: Protruding VP1 Capsomer Canyon Receptors
      const protomerGroup = new THREE.Group();
      protomerGroup.name = 'spikes';
      spikesGroupRef.current = protomerGroup;
      const pGeo = new THREE.SphereGeometry(0.15, 12, 12);
      const pMat = new THREE.MeshStandardMaterial({
        color: 0x2dd4bf,
        emissive: 0x0f766e,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 1.0,
      });

      for (let i = 0; i < 48; i++) {
        const phi = Math.acos(-1 + (2 * i) / 48);
        const theta = Math.sqrt(48 * Math.PI) * phi;
        const x = 1.68 * Math.cos(theta) * Math.sin(phi);
        const y = 1.68 * Math.sin(theta) * Math.sin(phi);
        const z = 1.68 * Math.cos(phi);
        const p = new THREE.Mesh(pGeo, pMat);
        p.position.set(x, y, z);
        protomerGroup.add(p);
      }
      virionGroup.add(protomerGroup);
      registerMesh('spikes', protomerGroup);
    }

    // ==========================================
    // 🌟 BUILD PARTICLE EFFECT SYSTEM
    // ==========================================
    const PARTICLE_COUNT = 650;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(PARTICLE_COUNT * 3);
    const colArray = new Float32Array(PARTICLE_COUNT * 3);
    const pKinematics: ParticleKinematicData[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
      const normX = Math.cos(theta) * Math.sin(phi);
      const normY = Math.sin(theta) * Math.sin(phi);
      const normZ = Math.cos(phi);

      pKinematics.push({
        u: (i / PARTICLE_COUNT) * Math.PI * 4,
        v: (i / PARTICLE_COUNT) * Math.PI * 2,
        normX,
        normY,
        normZ,
        baseRadius: 1.45,
        speed: 0.7 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        seed: Math.random(),
      });

      posArray[i * 3] = normX * 1.45;
      posArray[i * 3 + 1] = normY * 1.45;
      posArray[i * 3 + 2] = normZ * 1.45;

      colArray[i * 3] = 0.15;
      colArray[i * 3 + 1] = 0.85;
      colArray[i * 3 + 2] = 0.75;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colArray, 3));

    const particleTexture = createGlowParticleTexture();
    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTexture,
      transparent: true,
      opacity: 0.95,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlePoints = new THREE.Points(particleGeo, particleMat);
    particlePoints.name = 'particle-activity-system';
    virionGroup.add(particlePoints);

    particlePointsRef.current = particlePoints;
    particlePositionsRef.current = posArray;
    particleColorsRef.current = colArray;
    particleDataRef.current = pKinematics;

    // ANIMATION LOOP driven directly by central state manager targets & particle dynamics
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth camera position lerping
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCameraPosRef.current, 0.08);
      }

      // Auto-rotation
      if (isAutoRotating && !isDraggingRef.current) {
        modelRotationRef.current.y += 0.006;
      }
      virionGroup.rotation.y = modelRotationRef.current.y;
      virionGroup.rotation.x = modelRotationRef.current.x;

      const lerpSpeed = 0.12;

      // UPDATE GENOME MESH
      if (genomeMeshRef.current) {
        const targets = getTransformTargets('genome');
        const gMesh = genomeMeshRef.current;
        gMesh.visible = targets.visible;
        gMesh.scale.lerp(new THREE.Vector3(targets.scale, targets.scale, targets.scale), lerpSpeed);
        const gMat = gMesh.material as THREE.MeshStandardMaterial;
        gMat.opacity = THREE.MathUtils.lerp(gMat.opacity, targets.opacity, lerpSpeed);
        gMat.emissiveIntensity = THREE.MathUtils.lerp(gMat.emissiveIntensity, targets.emissiveIntensity, lerpSpeed);
      }

      // UPDATE CAPSID MESH
      if (capsidMeshRef.current) {
        const targets = getTransformTargets('capsid');
        const cMesh = capsidMeshRef.current;
        cMesh.visible = targets.visible;
        cMesh.scale.lerp(new THREE.Vector3(targets.scale, targets.scale, targets.scale), lerpSpeed);
        const cMat = cMesh.material as THREE.MeshStandardMaterial;
        cMat.opacity = THREE.MathUtils.lerp(cMat.opacity, targets.opacity, lerpSpeed);
        cMat.wireframe = targets.wireframe;
      }

      // UPDATE TEGUMENT MESH
      if (tegumentMeshRef.current) {
        const targets = getTransformTargets('tegument');
        const tMesh = tegumentMeshRef.current;
        tMesh.visible = targets.visible;
        tMesh.scale.lerp(new THREE.Vector3(targets.scale, targets.scale, targets.scale), lerpSpeed);
        const tMat = tMesh.material as THREE.MeshStandardMaterial;
        tMat.opacity = THREE.MathUtils.lerp(tMat.opacity, targets.opacity, lerpSpeed);
      }

      // UPDATE ENVELOPE MESH
      if (envelopeMeshRef.current) {
        const targets = getTransformTargets('envelope');
        const eMesh = envelopeMeshRef.current;
        eMesh.visible = targets.visible;
        eMesh.scale.lerp(new THREE.Vector3(targets.scale, targets.scale, targets.scale), lerpSpeed);
        const eMat = eMesh.material as THREE.MeshStandardMaterial;
        eMat.opacity = THREE.MathUtils.lerp(eMat.opacity, targets.opacity, lerpSpeed);
      }

      // UPDATE SPIKES GROUP
      if (spikesGroupRef.current) {
        const targets = getTransformTargets('spikes');
        const sGroup = spikesGroupRef.current;
        sGroup.visible = targets.visible;
        sGroup.scale.lerp(new THREE.Vector3(targets.scale, targets.scale, targets.scale), lerpSpeed);
        sGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const sMat = child.material as THREE.MeshStandardMaterial;
            sMat.opacity = THREE.MathUtils.lerp(sMat.opacity, targets.opacity, lerpSpeed);
            sMat.emissiveIntensity = THREE.MathUtils.lerp(sMat.emissiveIntensity, targets.emissiveIntensity, lerpSpeed);
          }
        });
      }

      // TROPISM & DOCKING POSITIONING
      if (hostCellGroupRef.current) {
        hostCellGroupRef.current.visible = selectedComponent === 'tropism';
      }
      if (virionGroupRef.current) {
        virionGroupRef.current.position.y = selectedComponent === 'tropism' ? 0.55 : 0;
      }

      // TARGET PULSE RING
      if (targetRingRef.current) {
        if (selectedComponent !== 'all' && selectedComponent !== 'tropism') {
          targetRingRef.current.visible = true;
          (targetRingRef.current.material as THREE.MeshBasicMaterial).color.setHex(activeMetadata.colorHex);
          targetRingRef.current.lookAt(camera.position);
          const ringPulse = 1 + Math.sin(t * 6) * 0.05;
          targetRingRef.current.scale.set(ringPulse, ringPulse, ringPulse);
        } else {
          targetRingRef.current.visible = false;
        }
      }

      // ==========================================
      // ⚡ DYNAMIC PARTICLE EFFECT SYSTEM KINEMATICS
      // ==========================================
      if (particlePointsRef.current && particlePositionsRef.current && particleColorsRef.current) {
        const pPoints = particlePointsRef.current;
        const positions = particlePositionsRef.current;
        const colors = particleColorsRef.current;
        const pData = particleDataRef.current;

        if (!particlesEnabled) {
          pPoints.visible = false;
        } else {
          pPoints.visible = true;
          const speedMultiplier = particleSpeed === 'fast' ? 2.0 : particleSpeed === 'slow' ? 0.45 : 1.0;

          if (selectedComponent === 'genome') {
            // 🧬 GENOME: GLOWING WAVE PULSES & NUCLEOTIDE REPLICATIVE SPARKS
            const knotP = virusType === 'cmv' ? 2 : 3;
            const knotQ = virusType === 'cmv' ? 3 : 4;
            const knotR = virusType === 'cmv' ? 0.55 : 0.68;
            const knotTube = virusType === 'cmv' ? 0.17 : 0.2;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
              const p = pData[i];
              const phi = p.u + t * (2.2 * speedMultiplier * p.speed);
              const rCurve = knotR + knotTube * Math.cos(knotQ * phi);
              const kx = rCurve * Math.cos(knotP * phi);
              const ky = rCurve * Math.sin(knotP * phi);
              const kz = -knotTube * Math.sin(knotQ * phi);

              // Harmonic 8 Hz glowing pulse wave
              const pulseWave = Math.sin(t * 8.0 * speedMultiplier + p.u * 3.5);
              const sparkExpansion = 1.0 + 0.32 * pulseWave;

              positions[i * 3] = kx * sparkExpansion + p.normX * 0.04 * Math.sin(t * 12 + i);
              positions[i * 3 + 1] = ky * sparkExpansion + p.normY * 0.04 * Math.sin(t * 12 + i);
              positions[i * 3 + 2] = kz * sparkExpansion + p.normZ * 0.04 * Math.sin(t * 12 + i);

              const glow = 0.55 + 0.45 * pulseWave;
              if (virusType === 'cmv') {
                // Radiant dsDNA Magenta / Hot Rose
                colors[i * 3] = 0.98 * glow;
                colors[i * 3 + 1] = 0.2 * glow;
                colors[i * 3 + 2] = 0.45 * glow;
              } else {
                // Vibrant +ssRNA Emerald / Mint
                colors[i * 3] = 0.06 * glow;
                colors[i * 3 + 1] = 0.98 * glow;
                colors[i * 3 + 2] = 0.55 * glow;
              }
            }
          } else if (selectedComponent === 'tegument') {
            // 🫀 TEGUMENT: RHYTHMIC EXPANSION & UL97/pp65 PHOSPHORYLATION BREATHING CLOUD
            const breathePhase = Math.sin(t * 3.4 * speedMultiplier);
            const breatheScale = 1.0 + 0.38 * breathePhase; // 38% organelle-like expansion!

            for (let i = 0; i < PARTICLE_COUNT; i++) {
              const p = pData[i];
              const swirl = t * 1.3 * speedMultiplier * p.speed + p.phase;
              const cosS = Math.cos(swirl * 0.25);
              const sinS = Math.sin(swirl * 0.25);
              const rBase = virusType === 'cmv' ? 1.25 + p.seed * 0.42 : 1.1 + p.seed * 0.3;
              const r = rBase * breatheScale;

              positions[i * 3] = (p.normX * cosS - p.normZ * sinS) * r;
              positions[i * 3 + 1] = p.normY * r + Math.sin(t * 5 + i * 0.1) * 0.06;
              positions[i * 3 + 2] = (p.normX * sinS + p.normZ * cosS) * r;

              // High-energy violet phosphorylation flare during peak breathing expansion
              const kinaseEnergy = 0.5 + 0.5 * breathePhase;
              if (virusType === 'cmv') {
                // Amethyst & Ultraviolet (pp65/UL97)
                colors[i * 3] = 0.65 + 0.3 * kinaseEnergy;
                colors[i * 3 + 1] = 0.25 + 0.25 * kinaseEnergy;
                colors[i * 3 + 2] = 0.98;
              } else {
                // Indigo & Purple (VP4 internal matrix)
                colors[i * 3] = 0.45 + 0.3 * kinaseEnergy;
                colors[i * 3 + 1] = 0.35 + 0.2 * kinaseEnergy;
                colors[i * 3 + 2] = 0.95;
              }
            }
          } else if (selectedComponent === 'capsid') {
            // 🛡️ CAPSID: ICOSAHEDRAL FACET SHIELD RESONANCE & QUANTUM LATTICE SPARKLES
            const shellR = virusType === 'cmv' ? 1.18 : 1.68;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
              const p = pData[i];
              const facetSpark = Math.sin(t * 7.5 * speedMultiplier + p.phase);
              const r = shellR + facetSpark * 0.08;

              positions[i * 3] = p.normX * r;
              positions[i * 3 + 1] = p.normY * r;
              positions[i * 3 + 2] = p.normZ * r;

              // Electric Cyan / Sapphire
              const intensity = 0.6 + 0.4 * facetSpark;
              colors[i * 3] = 0.1 * intensity;
              colors[i * 3 + 1] = 0.75 * intensity;
              colors[i * 3 + 2] = 0.98;
            }
          } else if (selectedComponent === 'spikes') {
            // 📡 SPIKES: RECEPTOR-BINDING RADIATING BEACON JETS (TROPISM EMITTERS)
            const spikeR = virusType === 'cmv' ? 1.76 : 1.68;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
              const p = pData[i];
              const cycle = (t * 2.3 * speedMultiplier * p.speed + p.phase) % 1.0;
              const jetDistance = spikeR + cycle * 1.35; // Shoots outward into surrounding medium
              const fade = 1.0 - cycle;

              positions[i * 3] = p.normX * jetDistance;
              positions[i * 3 + 1] = p.normY * jetDistance;
              positions[i * 3 + 2] = p.normZ * jetDistance;

              // Molten gold & amber radiance
              colors[i * 3] = 0.98 * fade;
              colors[i * 3 + 1] = (0.7 + 0.25 * Math.sin(cycle * Math.PI)) * fade;
              colors[i * 3 + 2] = 0.1 * fade;
            }
          } else if (selectedComponent === 'envelope') {
            // 🌊 ENVELOPE: FLUID MOSAIC LIPID BILAYER TANGENTIAL ORBITAL DRIFT
            const envR = 1.78;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
              const p = pData[i];
              const orb = p.v + t * 1.5 * speedMultiplier * p.speed;
              positions[i * 3] = envR * Math.cos(orb) * Math.sin(p.phase);
              positions[i * 3 + 1] = envR * Math.cos(p.phase);
              positions[i * 3 + 2] = envR * Math.sin(orb) * Math.sin(p.phase);

              // Fluid azure & cyan
              colors[i * 3] = 0.08;
              colors[i * 3 + 1] = 0.72;
              colors[i * 3 + 2] = 0.95;
            }
          } else if (selectedComponent === 'tropism') {
            // ⚡ TROPISM: DIRECTED TRANSLOCATION STREAM CASCADE INTO HOST MEMBRANE
            for (let i = 0; i < PARTICLE_COUNT; i++) {
              const p = pData[i];
              const flowProg = (t * 1.9 * speedMultiplier * p.speed + p.phase) % 1.0;
              positions[i * 3] = p.normX * (1.3 - flowProg * 0.35);
              positions[i * 3 + 1] = 0.65 - flowProg * 2.5; // Streaming down into host cell membrane
              positions[i * 3 + 2] = p.normZ * (1.3 - flowProg * 0.35);

              // Bio-electric emerald & cyan
              colors[i * 3] = 0.1;
              colors[i * 3 + 1] = 0.92;
              colors[i * 3 + 2] = 0.65;
            }
          } else {
            // ✨ ALL / INTACT: AMBIENT EXTRACELLULAR FLUID BROWNIAN HALO
            for (let i = 0; i < PARTICLE_COUNT; i++) {
              const p = pData[i];
              const ambientR = 2.05 + Math.sin(t * 0.8 + p.phase) * 0.25;
              positions[i * 3] = p.normX * ambientR;
              positions[i * 3 + 1] = p.normY * ambientR;
              positions[i * 3 + 2] = p.normZ * ambientR;

              // Soft bioluminescent teal
              colors[i * 3] = 0.1;
              colors[i * 3 + 1] = 0.78;
              colors[i * 3 + 2] = 0.68;
            }
          }

          pPoints.geometry.attributes.position.needsUpdate = true;
          pPoints.geometry.attributes.color.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
      unregisterMesh('genome');
      unregisterMesh('capsid');
      unregisterMesh('tegument');
      unregisterMesh('envelope');
      unregisterMesh('spikes');
    };
  }, [
    virusType,
    registerMesh,
    unregisterMesh,
    getTransformTargets,
    selectedComponent,
    activeMetadata,
    particlesEnabled,
    particleSpeed,
  ]);

  // Direct 3D Canvas Click Handler (Raycasting to synchronize with central state!)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the user was dragging/grabbing the virion to rotate it, NEVER trigger click/select!
    if (hasDraggedRef.current) return;
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseCoordsRef.current.set(mouseX, mouseY);

    raycasterRef.current.setFromCamera(mouseCoordsRef.current, cameraRef.current);

    const testObjects: THREE.Object3D[] = [];
    if (genomeMeshRef.current) testObjects.push(genomeMeshRef.current);
    if (capsidMeshRef.current) testObjects.push(capsidMeshRef.current);
    if (tegumentMeshRef.current) testObjects.push(tegumentMeshRef.current);
    if (envelopeMeshRef.current) testObjects.push(envelopeMeshRef.current);
    if (spikesGroupRef.current) testObjects.push(spikesGroupRef.current);

    const intersects = raycasterRef.current.intersectObjects(testObjects, true);
    if (intersects.length > 0) {
      let hit = intersects[0].object;
      while (hit.parent && hit.parent !== virionGroupRef.current && hit.parent.name) {
        hit = hit.parent;
      }
      if (hit.name) {
        selectComponent(hit.name as VirionComponentId);
      }
    }
  };

  // Orbit & drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    setIsAutoRotating(false);
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const distX = e.clientX - dragStartPosRef.current.x;
    const distY = e.clientY - dragStartPosRef.current.y;
    if (Math.hypot(distX, distY) > 4) {
      hasDraggedRef.current = true;
    }
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    modelRotationRef.current.y += deltaX * 0.008;
    modelRotationRef.current.x = Math.max(-0.8, Math.min(0.8, modelRotationRef.current.x + deltaY * 0.008));
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
      return;
    }
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setIsAutoRotating(false);
    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      const diff = touchDistanceRef.current - currentDist;
      handleZoom(diff * 0.01);
      touchDistanceRef.current = currentDist;
      return;
    }
    if (!isDraggingRef.current || e.touches.length === 0) return;
    const distX = e.touches[0].clientX - dragStartPosRef.current.x;
    const distY = e.touches[0].clientY - dragStartPosRef.current.y;
    if (Math.hypot(distX, distY) > 4) {
      hasDraggedRef.current = true;
    }
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

    modelRotationRef.current.y += deltaX * 0.008;
    modelRotationRef.current.x = Math.max(-0.8, Math.min(0.8, modelRotationRef.current.x + deltaY * 0.008));
    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchDistanceRef.current = null;
  };

  const handleZoom = (delta: number) => {
    if (!targetCameraPosRef.current) return;
    targetCameraPosRef.current.z = Math.max(2.0, Math.min(6.5, targetCameraPosRef.current.z + delta));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY * 0.003);
  };

  const handleResetCamera = () => {
    if (!targetCameraPosRef.current) return;
    targetCameraPosRef.current.set(0, 0, 4.2);
    modelRotationRef.current = { x: 0.2, y: 0.3 };
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* 3D Visualizer Header Toolbar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-100">
            {virusType === 'cmv' ? 'Cytomegalovirus (HHV-5) 3D Virion' : 'Coxsackievirus (Enterovirus) 3D Virion'}
          </h3>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            {virusType === 'cmv' ? '~200nm Enveloped dsDNA' : '~30nm Non-Enveloped ssRNA'}
          </span>
        </div>

        {/* UI Synchronized Mesh Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs flex-wrap">
          <button
            onClick={() => selectComponent('all')}
            className={`px-2.5 py-1 rounded transition-all font-semibold ${
              selectedComponent === 'all'
                ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Intact
          </button>

          <button
            onClick={() => selectComponent('genome')}
            className={`px-2.5 py-1 rounded transition-all font-semibold ${
              selectedComponent === 'genome'
                ? 'bg-rose-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Genome
          </button>

          <button
            onClick={() => selectComponent('capsid')}
            className={`px-2.5 py-1 rounded transition-all font-semibold ${
              selectedComponent === 'capsid'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Capsid
          </button>

          {virusType === 'cmv' && (
            <>
              <button
                onClick={() => selectComponent('tegument')}
                className={`px-2.5 py-1 rounded transition-all font-semibold ${
                  selectedComponent === 'tegument'
                    ? 'bg-purple-600 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Tegument
              </button>
              <button
                onClick={() => selectComponent('envelope')}
                className={`px-2.5 py-1 rounded transition-all font-semibold ${
                  selectedComponent === 'envelope'
                    ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Envelope
              </button>
            </>
          )}

          <button
            onClick={() => selectComponent('spikes')}
            className={`px-2.5 py-1 rounded transition-all font-semibold ${
              selectedComponent === 'spikes'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {virusType === 'cmv' ? 'Spikes (gB)' : 'Spikes (VP1)'}
          </button>

          <button
            onClick={() => selectComponent('tropism')}
            className={`px-2.5 py-1 rounded transition-all font-semibold ${
              selectedComponent === 'tropism'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Tropism
          </button>
        </div>
      </div>

      {/* Action Mode & Particle Controls Toolbar */}
      <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-850 flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Action Mode:</span>
          </span>

          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setInteractionMode('highlight')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                interactionMode === 'highlight'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Highlight mesh with high radiance"
            >
              ✨ Highlight
            </button>
            <button
              onClick={() => setInteractionMode('isolate')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                interactionMode === 'isolate'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Isolate selected mesh exclusively"
            >
              🔍 Isolate
            </button>
            <button
              onClick={() => setInteractionMode('expand')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                interactionMode === 'expand'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Expand selected mesh radially"
            >
              💥 Expand
            </button>
          </div>
        </div>

        {/* 🌟 Particle Effect System Controls in Toolbar */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Particle Dynamic:</span>
          </span>

          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setParticlesEnabled(!particlesEnabled)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
                particlesEnabled
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
              title="Toggle activity particle effect system"
            >
              <Sparkles className="w-3 h-3" />
              <span>{particlesEnabled ? 'FX: ON' : 'FX: OFF'}</span>
            </button>

            {particlesEnabled && (
              <div className="flex items-center pl-1 border-l border-slate-750 gap-0.5">
                {(['slow', 'normal', 'fast'] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setParticleSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase transition-all ${
                      particleSpeed === spd
                        ? 'bg-teal-500/30 text-teal-300 font-bold border border-teal-500/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {spd === 'slow' ? '0.5x' : spd === 'normal' ? '1x' : '2x'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3D Canvas Mount with Overlays */}
      <div className="relative w-full h-84 sm:h-96 bg-slate-950">
        <div
          ref={mountRef}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        />

        {/* Central State Indicator Pill */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-md bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-700/80 shadow-2xl text-xs space-y-1 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white capitalize">
              Mesh Target: {selectedComponent} ({interactionMode})
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${activeMetadata.badgeClass}`}>
              Synchronized 3D
            </span>
          </div>
          <p className="text-[11px] text-teal-300 font-medium leading-tight">
            {activeMetadata.visualAction}
          </p>
        </div>

        {/* 🌟 Particle Activity HUD Banner (Pulsing Biological Activity Status) */}
        {particlesEnabled && (
          <div className="absolute top-16 left-3 right-3 sm:right-auto sm:max-w-md bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-amber-500/40 shadow-xl text-xs pointer-events-none flex items-center gap-2.5">
            <div className="relative flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="absolute w-4 h-4 rounded-full border border-amber-400/60 animate-ping" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                <span>{activeMetadata.particleTitle}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-200 border border-amber-800">
                  {particleSpeed.toUpperCase()}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate">
                {selectedComponent === 'genome'
                  ? 'High-frequency 8Hz nucleotide glow pulses'
                  : selectedComponent === 'tegument'
                  ? 'Rhythmic 3.5Hz phosphorylation breathing expansion'
                  : selectedComponent === 'capsid'
                  ? 'Icosahedral facet protective quantum shield resonance'
                  : selectedComponent === 'spikes'
                  ? 'Receptor-binding radiating beacon jets'
                  : selectedComponent === 'envelope'
                  ? 'Fluid mosaic lipid bilayer tangential drift'
                  : selectedComponent === 'tropism'
                  ? 'Endothelial receptor translocation flux'
                  : 'Ambient physiological solvation halo'}
              </p>
            </div>
          </div>
        )}

        {/* Zoom & Orbit Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-800 text-xs z-10 shadow-lg">
          <button
            onClick={() => handleZoom(-0.35)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 text-slate-300 hover:text-white font-bold"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => handleZoom(0.35)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 text-slate-300 hover:text-white font-bold"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={handleResetCamera}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Reset View & Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-2.5 h-7 rounded text-[11px] font-semibold border border-slate-700 ${
              isAutoRotating ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAutoRotating ? 'Pause' : 'Spin 3D'}
          </button>
        </div>

        <div className="absolute bottom-3 left-3 text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 pointer-events-none hidden sm:block font-mono">
          🖱️ Click Mesh to Select · Drag to Orbit · Observe Particle Activity
        </div>
      </div>

      {/* Substructure Explanation & Biophysical Simulation Panel */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>{activeMetadata.name}</span>
            </h4>
            <span className="text-[11px] text-slate-400">{activeMetadata.subheading}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md border font-bold ${activeMetadata.badgeClass}`}>
              Active Mesh: {selectedComponent.toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-slate-300 leading-relaxed text-xs">
          {activeMetadata.description}
        </p>

        {/* 🌟 3-Column Educational & Particle Correlation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-amber-300/95 space-y-1">
            <span className="font-bold text-amber-200 text-[11px] uppercase tracking-wide block flex items-center gap-1.5">
              <span>📚 Lecture Landmark & Clinical Correlation:</span>
            </span>
            <p className="text-slate-200 text-xs leading-relaxed">{activeMetadata.clinicalSignificance}</p>
          </div>

          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-teal-300 space-y-1">
            <span className="font-bold text-teal-200 text-[11px] uppercase tracking-wide block flex items-center gap-1.5">
              <span>🔬 Three.js Scene Mesh Synchronization:</span>
            </span>
            <p className="text-slate-200 text-xs leading-relaxed">{activeMetadata.visualAction}</p>
          </div>

          <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-600/30 text-amber-300 space-y-1">
            <span className="font-bold text-amber-300 text-[11px] uppercase tracking-wide block flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Particle System Biophysics:</span>
            </span>
            <p className="text-slate-200 text-xs leading-relaxed">{activeMetadata.particleDynamics}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper supporting both central provider and standalone usage
export interface Virion3DProps {
  virusType: 'cmv' | 'coxsackie';
  activeLayer?: VirionComponentId;
  onLayerChange?: (layer: VirionComponentId) => void;
  interactionMode?: VirionInteractionMode;
  onInteractionModeChange?: (mode: VirionInteractionMode) => void;
  tropismTarget?: 'endothelium' | 'mononuclear' | 'wbc';
}

export const Virion3D: React.FC<Virion3DProps> = ({
  virusType = 'cmv',
  tropismTarget = 'endothelium',
}) => {
  return (
    <VirionSceneInner tropismTarget={tropismTarget} virusType={virusType} />
  );
};

// Internal router that checks if VirionSceneProvider is already active
const VirionSceneInner: React.FC<{ virusType: 'cmv' | 'coxsackie'; tropismTarget?: 'endothelium' | 'mononuclear' | 'wbc' }> = ({
  virusType,
  tropismTarget,
}) => {
  try {
    // If inside a provider, use it directly
    const context = useVirionScene();
    // Sync virusType if needed
    useEffect(() => {
      if (context.virusType !== virusType) {
        context.setVirusType(virusType);
      }
    }, [virusType, context]);

    return <Virion3DInner tropismTarget={tropismTarget} />;
  } catch (e) {
    // If standalone without provider, wrap self in VirionSceneProvider
    return (
      <VirionSceneProvider initialVirus={virusType}>
        <Virion3DInner tropismTarget={tropismTarget} />
      </VirionSceneProvider>
    );
  }
};
