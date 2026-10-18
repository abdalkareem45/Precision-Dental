import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Layers,
  Sparkles,
  Info,
  ShieldAlert,
  ChevronRight,
  Eye,
  Activity,
  Flame,
  Radio,
  Sliders,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';

export type ZosterDermatomeRegion = 't4_thoracic' | 'v1_ophthalmic' | 'v2_maxillary' | 'v3_mandibular' | 'c3_cervical' | 'l1_lumbar';
export type RashStage = 'pre_eruptive' | 'erythematous_macules' | 'grouped_vesicles' | 'pustules_ulcer' | 'crusting_scarring';

interface ZosterDermatomeProps {
  initialRegion?: ZosterDermatomeRegion;
  height?: number;
  onSelectRegion?: (region: ZosterDermatomeRegion) => void;
}

interface DermatomeConfig {
  id: ZosterDermatomeRegion;
  name: string;
  nerveOrigin: string;
  ganglion: string;
  anatomicalLandmark: string;
  clinicalPresentation: string;
  boardPearl: string;
  color: string;
  dangerSign?: string;
}

export const ZOSTER_DERMATOMES: Record<ZosterDermatomeRegion, DermatomeConfig> = {
  t4_thoracic: {
    id: 't4_thoracic',
    name: 'T4 Mid-Thoracic Dermatome',
    nerveOrigin: '4th Thoracic Spinal Nerve (Ventral & Dorsal Rami)',
    ganglion: 'T4 Dorsal Root Ganglion (DRG)',
    anatomicalLandmark: 'Nipple level band wrapping unilaterally from mid-spine to sternum',
    clinicalPresentation: 'Classic band-like dermatomal distribution with sharp unilateral cutoff at anterior & posterior midlines. Severe prodromal burning mimics angina pectoris or pleurisy.',
    boardPearl: 'Thoracic dermatomes account for >50% of all herpes zoster cases. Strictly respects anatomical midline.',
    color: '#f43f5e',
  },
  v1_ophthalmic: {
    id: 'v1_ophthalmic',
    name: 'CN V1 Ophthalmic Division (Herpes Zoster Ophthalmicus)',
    nerveOrigin: 'Nasociliary, Frontal & Lacrimal branches',
    ganglion: 'Trigeminal Ganglion (Gasserian Ganglion)',
    anatomicalLandmark: 'Forehead, scalp, upper eyelid, and nose tip (Hutchinson sign)',
    clinicalPresentation: 'Unilateral erythematous base with clustered vesicles on forehead, upper eyelid, and nasal tip. High risk of ocular perforation, dendritic keratitis, and anterior uveitis.',
    boardPearl: 'HUTCHINSON SIGN: Vesicle on the tip of the nose indicates nasociliary nerve involvement and mandates IMMEDIATE ophthalmology consultation!',
    color: '#10b981',
    dangerSign: 'Ocular Threat: Dendritic Keratitis & Blindness Risk',
  },
  v2_maxillary: {
    id: 'v2_maxillary',
    name: 'CN V2 Maxillary Division',
    nerveOrigin: 'Greater palatine, nasopalatine, infraorbital nerves',
    ganglion: 'Trigeminal Ganglion (Gasserian Ganglion)',
    anatomicalLandmark: 'Cheek, upper lip, hard palate, and maxillary gingiva (strictly unilateral)',
    clinicalPresentation: 'Intraoral vesicles clustering exclusively on one side of the hard palate and attached maxillary gingiva, sharply ending at the palatal raphe.',
    boardPearl: 'Intraoral lesions respect the midline with razor precision. Toothache prodrome (odontalgia) often precedes rash.',
    color: '#06b6d4',
  },
  v3_mandibular: {
    id: 'v3_mandibular',
    name: 'CN V3 Mandibular Division',
    nerveOrigin: 'Inferior alveolar, lingual, mental nerves',
    ganglion: 'Trigeminal Ganglion (Gasserian Ganglion)',
    anatomicalLandmark: 'Lower lip, chin, anterior 2/3 tongue, mandibular buccal mucosa',
    clinicalPresentation: 'Unilateral vesiculoulcerative lesions along unilateral anterior 2/3 tongue and lower gingiva, plus cutaneous rash over the chin and preauricular jawline.',
    boardPearl: 'May cause severe pre-eruptive mandibular quadrant pain mimicking irreversible pulpitis, prompting inappropriate root canal therapy.',
    color: '#a855f7',
  },
  c3_cervical: {
    id: 'c3_cervical',
    name: 'C3 Upper Cervical Dermatome',
    nerveOrigin: '3rd Cervical Ventral Ramus (Transverse Cervical Nerve)',
    ganglion: 'C3 Dorsal Root Ganglion',
    anatomicalLandmark: 'Lateral neck, submandibular angle, and supraclavicular margin',
    clinicalPresentation: 'Confluent clustered vesicles encircling the unilateral anterior/lateral neck, stopping precisely at the laryngeal midline.',
    boardPearl: 'Often misdiagnosed as contact dermatitis or cellulitis until clustered vesicular nature manifests.',
    color: '#eab308',
  },
  l1_lumbar: {
    id: 'l1_lumbar',
    name: 'L1 Inguinal / Lumbar Dermatome',
    nerveOrigin: 'Iliohypogastric & Ilioinguinal Nerves',
    ganglion: 'L1 Dorsal Root Ganglion',
    anatomicalLandmark: 'Lower abdomen, groin band, and superior pubic margin',
    clinicalPresentation: 'Unilateral belt curving from the upper lumbar spine down into the inguinal fold. Prodrome frequently mimics acute renal colic or appendicitis.',
    boardPearl: 'Classic mimic of acute abdominal emergencies during pre-eruptive prodromal neuralgia phase.',
    color: '#f97316',
  },
};

export const ZosterDermatome3D: React.FC<ZosterDermatomeProps> = ({
  initialRegion = 't4_thoracic',
  height = 500,
  onSelectRegion,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<ZosterDermatomeRegion>(initialRegion);
  const [rashStage, setRashStage] = useState<RashStage>('grouped_vesicles');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [showNerveDistribution, setShowNerveDistribution] = useState<boolean>(true);
  const [showMidlineCutoff, setShowMidlineCutoff] = useState<boolean>(true);
  const [showNeuralImpulses, setShowNeuralImpulses] = useState<boolean>(true);
  const [selectedVesicleInfo, setSelectedVesicleInfo] = useState<string | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRootRef = useRef<THREE.Group | null>(null);
  const nervePathsRef = useRef<THREE.Group | null>(null);
  const vesiclesGroupRef = useRef<THREE.Group | null>(null);
  const midlinePlaneRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Mouse interaction
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeDermatome = ZOSTER_DERMATOMES[selectedRegion];

  // Build 3D Torso/Head anatomical mesh with specific dermatome segment & vesicles
  const buildDermatomeScene = useCallback(
    (region: ZosterDermatomeRegion, stage: RashStage) => {
      if (!modelRootRef.current || !sceneRef.current) return;
      const root = modelRootRef.current;

      // Clear existing children
      while (root.children.length > 0) {
        const obj = root.children[0];
        root.remove(obj);
      }

      const isCranial = region === 'v1_ophthalmic' || region === 'v2_maxillary' || region === 'v3_mandibular';

      if (isCranial) {
        // --- 1. HEAD / CRANIOFACIAL DERMATOME MODEL ---
        const headGroup = new THREE.Group();

        // Cranial vault
        const craniumGeo = new THREE.SphereGeometry(1.3, 36, 30);
        const skinMat = new THREE.MeshStandardMaterial({
          color: 0x334155,
          roughness: 0.65,
          metalness: 0.1,
          transparent: true,
          opacity: 0.85,
        });
        const cranium = new THREE.Mesh(craniumGeo, skinMat);
        cranium.position.set(0, 0.4, -0.2);
        headGroup.add(cranium);

        // Face / jaw sculpt
        const faceGeo = new THREE.CylinderGeometry(1.0, 0.7, 1.4, 28);
        const face = new THREE.Mesh(faceGeo, skinMat);
        face.position.set(0, -0.4, 0.1);
        headGroup.add(face);

        // Nose contour
        const noseGeo = new THREE.ConeGeometry(0.2, 0.6, 16);
        const noseMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
        const nose = new THREE.Mesh(noseGeo, noseMat);
        nose.position.set(0, -0.1, 1.25);
        nose.rotation.x = Math.PI * 0.45;
        headGroup.add(nose);

        // Affected dermatome overlay mesh (strictly unilateral right side x > 0)
        let dermatomeGeo: THREE.BufferGeometry;
        let dPos: [number, number, number] = [0, 0, 0];

        if (region === 'v1_ophthalmic') {
          // Forehead, nose bridge & tip, upper orbit
          dermatomeGeo = new THREE.SphereGeometry(1.34, 32, 16, 0, Math.PI * 0.48, 0, Math.PI * 0.42);
          dPos = [0.02, 0.42, -0.18];
        } else if (region === 'v2_maxillary') {
          // Midface, maxilla, upper lip, infraorbital
          dermatomeGeo = new THREE.CylinderGeometry(1.04, 0.94, 0.65, 24, 4, false, 0, Math.PI * 0.48);
          dPos = [0.02, -0.15, 0.12];
        } else {
          // V3 Mandibular: lower jaw, chin, anterior mandible
          dermatomeGeo = new THREE.CylinderGeometry(0.92, 0.68, 0.65, 24, 4, false, 0, Math.PI * 0.48);
          dPos = [0.02, -0.65, 0.1];
        }

        const dermatomeMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(activeDermatome.color),
          roughness: 0.4,
          metalness: 0.15,
          transparent: true,
          opacity: 0.7,
          emissive: new THREE.Color(activeDermatome.color),
          emissiveIntensity: 0.25,
        });

        const dermatomeMesh = new THREE.Mesh(dermatomeGeo, dermatomeMat);
        dermatomeMesh.position.set(...dPos);
        headGroup.add(dermatomeMesh);

        // Trigeminal Gasserian Ganglion (Deep anatomical origin)
        const ganglionGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const ganglionMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          emissive: 0xeab308,
          emissiveIntensity: 0.8,
          roughness: 0.3,
        });
        const ganglion = new THREE.Mesh(ganglionGeo, ganglionMat);
        ganglion.position.set(0.45, 0.1, -0.25);
        headGroup.add(ganglion);

        // Branching Nerve Pathways
        const nerveGroup = new THREE.Group();
        const curvePoints: THREE.Vector3[] = [];
        if (region === 'v1_ophthalmic') {
          curvePoints.push(
            new THREE.Vector3(0.45, 0.1, -0.25),
            new THREE.Vector3(0.55, 0.5, 0.2),
            new THREE.Vector3(0.4, 0.9, 0.7),
            new THREE.Vector3(0.1, 0.5, 1.1),
            new THREE.Vector3(0.02, -0.2, 1.35) // Hutchinson's tip of nose
          );
        } else if (region === 'v2_maxillary') {
          curvePoints.push(
            new THREE.Vector3(0.45, 0.1, -0.25),
            new THREE.Vector3(0.65, 0.0, 0.2),
            new THREE.Vector3(0.55, -0.2, 0.8),
            new THREE.Vector3(0.15, -0.35, 1.0)
          );
        } else {
          curvePoints.push(
            new THREE.Vector3(0.45, 0.1, -0.25),
            new THREE.Vector3(0.6, -0.3, -0.1),
            new THREE.Vector3(0.55, -0.6, 0.4),
            new THREE.Vector3(0.2, -0.85, 0.7)
          );
        }

        const nerveCurve = new THREE.CatmullRomCurve3(curvePoints);
        const nerveGeo = new THREE.TubeGeometry(nerveCurve, 40, 0.035, 10, false);
        const nerveMat = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          emissive: 0xfacc15,
          emissiveIntensity: 0.9,
          roughness: 0.2,
        });
        const nerveTube = new THREE.Mesh(nerveGeo, nerveMat);
        nerveGroup.add(nerveTube);
        headGroup.add(nerveGroup);
        nervePathsRef.current = nerveGroup;

        // Populate Vesicular Rash Clusters on the Right Hemiface
        const vesiclesGroup = new THREE.Group();
        const vesicleCount = stage === 'pre_eruptive' ? 0 : stage === 'erythematous_macules' ? 14 : 32;

        for (let i = 0; i < vesicleCount; i++) {
          const t = i / (vesicleCount || 1);
          const p = nerveCurve.getPoint(t * 0.9 + 0.05);

          // Disperse clusters slightly around nerve branch
          const offsetRadius = 0.08 + (Math.sin(i * 1.5) * 0.06);
          const vPos = new THREE.Vector3(
            Math.max(0.04, p.x + (Math.sin(i * 3.14) * offsetRadius)),
            p.y + (Math.cos(i * 2.7) * offsetRadius),
            p.z + 0.05
          );

          // Geometry based on rash stage
          const vSize = stage === 'crusting_scarring' ? 0.04 : stage === 'pustules_ulcer' ? 0.07 : 0.055;
          const vGeo = new THREE.SphereGeometry(vSize, 12, 10);
          let vCol = 0xf43f5e;
          let vEmissive = 0xe11d48;
          let vOpacity = 0.9;

          if (stage === 'erythematous_macules') {
            vCol = 0xf87171;
            vEmissive = 0xef4444;
            vOpacity = 0.55;
          } else if (stage === 'pustules_ulcer') {
            vCol = 0xfef08a; // Turbid yellow pustule
            vEmissive = 0xeab308;
            vOpacity = 0.95;
          } else if (stage === 'crusting_scarring') {
            vCol = 0x78350f; // Brown necrotic crust
            vEmissive = 0x451a03;
            vOpacity = 0.9;
          }

          const vMat = new THREE.MeshStandardMaterial({
            color: vCol,
            emissive: vEmissive,
            emissiveIntensity: stage === 'grouped_vesicles' ? 0.6 : 0.3,
            roughness: stage === 'crusting_scarring' ? 0.9 : 0.2,
            transparent: true,
            opacity: vOpacity,
          });

          const vMesh = new THREE.Mesh(vGeo, vMat);
          vMesh.position.copy(vPos);
          vMesh.userData = {
            clusterIndex: i,
            stage,
            location: region === 'v1_ophthalmic' && i > 25 ? 'Hutchinson Nose Tip' : 'Facial Dermatome Branch',
          };
          vesiclesGroup.add(vMesh);
        }

        headGroup.add(vesiclesGroup);
        vesiclesGroupRef.current = vesiclesGroup;
        root.add(headGroup);
      } else {
        // --- 2. TORSO / TRUNK DERMATOME MODEL (T4, C3, L1) ---
        const torsoGroup = new THREE.Group();

        // Base torso cylinder
        const torsoGeo = new THREE.CylinderGeometry(1.2, 1.1, 3.2, 36, 12);
        const torsoSkinMat = new THREE.MeshStandardMaterial({
          color: 0x334155,
          roughness: 0.7,
          metalness: 0.1,
          transparent: true,
          opacity: 0.85,
        });
        const torso = new THREE.Mesh(torsoGeo, torsoSkinMat);
        torsoGroup.add(torso);

        // Spinal column line in the posterior (z < 0)
        const spineGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.1, 16);
        const spineMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });
        const spine = new THREE.Mesh(spineGeo, spineMat);
        spine.position.set(0, 0, -1.18);
        torsoGroup.add(spine);

        // Sternum midline line in the anterior (z > 0)
        const sternumGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 16);
        const sternumMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 });
        const sternum = new THREE.Mesh(sternumGeo, sternumMat);
        sternum.position.set(0, 0.2, 1.18);
        torsoGroup.add(sternum);

        // Band-like Dermatome Overlay (strictly unilateral: right hemisphere x >= 0)
        const yOffset = region === 'c3_cervical' ? 1.1 : region === 't4_thoracic' ? 0.35 : -0.7;
        const bandHeight = 0.55;

        const bandGeo = new THREE.CylinderGeometry(1.24, 1.23, bandHeight, 36, 4, false, -Math.PI * 0.5, Math.PI);
        const bandMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(activeDermatome.color),
          emissive: new THREE.Color(activeDermatome.color),
          emissiveIntensity: 0.35,
          roughness: 0.35,
          transparent: true,
          opacity: 0.75,
          side: THREE.DoubleSide,
        });
        const bandMesh = new THREE.Mesh(bandGeo, bandMat);
        bandMesh.position.set(0, yOffset, 0);
        torsoGroup.add(bandMesh);

        // Dorsal Root Ganglion (DRG) at the posterior spine
        const drgGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const drgMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          emissive: 0xeab308,
          emissiveIntensity: 0.9,
          roughness: 0.2,
        });
        const drgMesh = new THREE.Mesh(drgGeo, drgMat);
        drgMesh.position.set(0.18, yOffset, -1.15);
        torsoGroup.add(drgMesh);

        // Intercostal / Cutaneous Nerve Arc wrapping around unilateral right flank
        const nerveGroup = new THREE.Group();
        const arcPoints: THREE.Vector3[] = [];
        const steps = 24;
        for (let s = 0; s <= steps; s++) {
          const angle = -Math.PI * 0.5 + (s / steps) * Math.PI; // from posterior (-z) to anterior (+z)
          const rad = 1.25;
          arcPoints.push(
            new THREE.Vector3(
              Math.cos(angle) * rad,
              yOffset - (s / steps) * 0.12, // slight downward anatomical tilt
              -Math.sin(angle) * rad
            )
          );
        }
        const nerveCurve = new THREE.CatmullRomCurve3(arcPoints);
        const nerveGeo = new THREE.TubeGeometry(nerveCurve, 40, 0.035, 12, false);
        const nerveMat = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          emissive: 0xfacc15,
          emissiveIntensity: 0.85,
          roughness: 0.2,
        });
        const nerveTube = new THREE.Mesh(nerveGeo, nerveMat);
        nerveGroup.add(nerveTube);
        torsoGroup.add(nerveGroup);
        nervePathsRef.current = nerveGroup;

        // Grouped Vesicular Rash along the intercostal distribution
        const vesiclesGroup = new THREE.Group();
        const vesicleCount = stage === 'pre_eruptive' ? 0 : stage === 'erythematous_macules' ? 16 : 42;

        for (let i = 0; i < vesicleCount; i++) {
          const t = i / (vesicleCount || 1);
          const p = nerveCurve.getPoint(t * 0.94 + 0.03);

          const jitterX = (Math.sin(i * 2.3) * 0.08);
          const jitterY = (Math.cos(i * 3.7) * 0.1);
          const vPos = new THREE.Vector3(
            Math.max(0.04, p.x + jitterX),
            p.y + jitterY,
            p.z + (Math.sin(i * 1.9) * 0.06)
          );

          const vSize = stage === 'crusting_scarring' ? 0.04 : stage === 'pustules_ulcer' ? 0.075 : 0.055;
          const vGeo = new THREE.SphereGeometry(vSize, 12, 10);
          let vCol = 0xf43f5e;
          let vEmissive = 0xe11d48;
          let vOpacity = 0.9;

          if (stage === 'erythematous_macules') {
            vCol = 0xf87171;
            vEmissive = 0xef4444;
            vOpacity = 0.6;
          } else if (stage === 'pustules_ulcer') {
            vCol = 0xfef08a; // Turbid yellow pustule
            vEmissive = 0xeab308;
            vOpacity = 0.95;
          } else if (stage === 'crusting_scarring') {
            vCol = 0x78350f; // Necrotic crust
            vEmissive = 0x451a03;
            vOpacity = 0.9;
          }

          const vMat = new THREE.MeshStandardMaterial({
            color: vCol,
            emissive: vEmissive,
            emissiveIntensity: stage === 'grouped_vesicles' ? 0.6 : 0.3,
            roughness: stage === 'crusting_scarring' ? 0.9 : 0.2,
            transparent: true,
            opacity: vOpacity,
          });

          const vMesh = new THREE.Mesh(vGeo, vMat);
          vMesh.position.copy(vPos);
          vMesh.userData = {
            clusterIndex: i,
            stage,
            location: `Intercostal Segment ${Math.floor(t * 10)}`,
          };
          vesiclesGroup.add(vMesh);
        }

        torsoGroup.add(vesiclesGroup);
        vesiclesGroupRef.current = vesiclesGroup;
        root.add(torsoGroup);
      }

      // --- 3. SAGITTAL MIDLINE CUTOFF PLANE (Visualizes zero crossover rule) ---
      const midlineGeo = new THREE.PlaneGeometry(3.6, 4.0);
      const midlineMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: showMidlineCutoff ? 0.2 : 0.0,
        side: THREE.DoubleSide,
      });
      const midlineMesh = new THREE.Mesh(midlineGeo, midlineMat);
      midlineMesh.rotation.y = Math.PI * 0.5; // aligned along x = 0 plane
      midlineMesh.position.set(0, 0, 0);
      root.add(midlineMesh);
      midlinePlaneRef.current = midlineMesh;
    },
    [activeDermatome, showMidlineCutoff]
  );

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 550;
    const canvasHeight = height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 100);
    camera.position.set(2.8, 0.6, 3.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf59e0b, 2.4);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.6);
    dirLight2.position.set(-5, -2, -4);
    scene.add(dirLight2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    modelRootRef.current = rootGroup;

    buildDermatomeScene(selectedRegion, rashStage);

    // Mouse handlers for drag rotation
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !modelRootRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;

      modelRootRef.current.rotation.y += deltaX * 0.008;
      modelRootRef.current.rotation.x += deltaY * 0.008;

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    let touchDist: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        return;
      }
      if (e.touches.length === 0) return;
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchDist !== null && cameraRef.current) {
        const curDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = touchDist - curDist;
        cameraRef.current.position.z = Math.max(2.0, Math.min(7.0, cameraRef.current.position.z + diff * 0.01));
        touchDist = curDist;
        return;
      }
      if (!isDraggingRef.current || !modelRootRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
      const deltaY = e.touches[0].clientY - prevMouseRef.current.y;

      modelRootRef.current.rotation.y += deltaX * 0.008;
      modelRootRef.current.rotation.x += deltaY * 0.008;

      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      touchDist = null;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = cameraRef.current.position.z + e.deltaY * 0.005;
      cameraRef.current.position.z = Math.max(2.0, Math.min(7.0, newZ));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    const clock = new THREE.Timer();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      clock.update();
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsed();

      if (isRotating && modelRootRef.current && !isDraggingRef.current) {
        modelRootRef.current.rotation.y += delta * 0.25;
      }

      // Animate neural impulse glow along nerves
      if (showNeuralImpulses && nervePathsRef.current) {
        nervePathsRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshStandardMaterial;
            mat.emissiveIntensity = 0.6 + Math.sin(elapsedTime * 4.0) * 0.4;
          }
        });
      }

      // Vesicle pulsating glow
      if (vesiclesGroupRef.current) {
        vesiclesGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshStandardMaterial;
            if (rashStage === 'grouped_vesicles') {
              mat.emissiveIntensity = 0.5 + Math.sin(elapsedTime * 3.5 + child.userData.clusterIndex) * 0.3;
            }
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / canvasHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, canvasHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [buildDermatomeScene, height, rashStage, selectedRegion]);

  // Re-build on selection or stage change
  useEffect(() => {
    buildDermatomeScene(selectedRegion, rashStage);
  }, [selectedRegion, rashStage, buildDermatomeScene]);

  // Toggle midline plane visibility
  useEffect(() => {
    if (midlinePlaneRef.current) {
      (midlinePlaneRef.current.material as THREE.MeshStandardMaterial).opacity = showMidlineCutoff ? 0.22 : 0.0;
    }
  }, [showMidlineCutoff]);

  const handleSelectRegion = (r: ZosterDermatomeRegion) => {
    setSelectedRegion(r);
    if (onSelectRegion) onSelectRegion(r);
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(2.0, Math.min(7.0, cameraRef.current.position.z + delta));
  };

  const resetView = () => {
    if (cameraRef.current && modelRootRef.current) {
      cameraRef.current.position.set(2.8, 0.6, 3.8);
      modelRootRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Banner / Dermatome Selector */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>3D Zoster Dermatome & Vesicular Rash Model</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                Unilateral Precision
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              High-fidelity anatomical distribution showing dermatomal boundaries, ganglion latency, and vesicular clustering.
            </p>
          </div>
        </div>

        {/* Dermatome Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(ZOSTER_DERMATOMES) as ZosterDermatomeRegion[]).map((rKey) => {
            const item = ZOSTER_DERMATOMES[rKey];
            const isSelected = selectedRegion === rKey;
            return (
              <button
                key={rKey}
                onClick={() => handleSelectRegion(rKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-800 border-white text-white shadow-lg ring-2 ring-white/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Canvas with HUD Overlay */}
      <div className="relative w-full bg-slate-950" style={{ height }}>
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Top Controls Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-lg backdrop-blur-md border text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all ${
              isRotating
                ? 'bg-slate-900/80 border-slate-700 text-teal-400'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRotating ? 'Pause Orbit' : 'Auto Orbit'}</span>
          </button>

          <button
            onClick={() => setShowMidlineCutoff(!showMidlineCutoff)}
            className={`p-2 rounded-lg backdrop-blur-md border text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all ${
              showMidlineCutoff
                ? 'bg-sky-950/80 border-sky-500/50 text-sky-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Sagittal Midline Plane ({showMidlineCutoff ? 'ON' : 'OFF'})</span>
          </button>

          <button
            onClick={() => setShowNeuralImpulses(!showNeuralImpulses)}
            className={`p-2 rounded-lg backdrop-blur-md border text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all ${
              showNeuralImpulses
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Nerve Impulse Glow</span>
          </button>

          <button
            onClick={resetView}
            className="p-2 rounded-lg bg-slate-900/60 backdrop-blur-md border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Cam</span>
          </button>
        </div>

        {/* Zoom Controls Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={() => handleZoom(-0.6)}
            className="p-2 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 shadow-md"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(0.6)}
            className="p-2 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 shadow-md"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Stage Timeline Switcher */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-white">Rash Evolutionary Stage:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'pre_eruptive', label: '1. Prodromal Pain (Pre-rash)', desc: 'Burning neuralgia before vesicles' },
              { id: 'erythematous_macules', label: '2. Erythematous Macules', desc: 'Red inflammatory patch' },
              { id: 'grouped_vesicles', label: '3. Clustered Vesicles', desc: 'Fluid-filled clear lesions' },
              { id: 'pustules_ulcer', label: '4. Pustules & Ulceration', desc: 'Turbid cloudy rupture' },
              { id: 'crusting_scarring', label: '5. Crusting & Scarring', desc: 'Healing eschars (Day 14-21)' },
            ].map((stageItem) => (
              <button
                key={stageItem.id}
                onClick={() => setRashStage(stageItem.id as RashStage)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  rashStage === stageItem.id
                    ? 'bg-rose-500 text-slate-950 font-bold border-rose-400 shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={stageItem.desc}
              >
                {stageItem.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clinical Inspection Dashboard / Anatomical Deep-Dive */}
      <div className="p-5 bg-slate-950 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Anatomical Coordinates */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anatomy & Pathway</span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeDermatome.color }} />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">{activeDermatome.name}</h4>
            <div className="space-y-1.5 text-xs text-slate-300 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Latent Ganglion:</span>
                <span className="font-semibold text-amber-300">{activeDermatome.ganglion}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Nerve Roots:</span>
                <span className="font-mono text-slate-200">{activeDermatome.nerveOrigin}</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                {activeDermatome.anatomicalLandmark}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Vesicular Morphology & Current Stage */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stage & Rash Pattern</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-bold">
                {rashStage.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              {rashStage === 'pre_eruptive' && 'Neuropathic Prodrome Stage'}
              {rashStage === 'erythematous_macules' && 'Early Inflammatory Macule Phase'}
              {rashStage === 'grouped_vesicles' && 'Classic Clustered Clear Vesicles'}
              {rashStage === 'pustules_ulcer' && 'Turbid Pustular & Ulcer Stage'}
              {rashStage === 'crusting_scarring' && 'Crustaceous Resolution & Scabs'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              {activeDermatome.clinicalPresentation}
            </p>
          </div>
          {activeDermatome.dangerSign && (
            <div className="mt-3 p-2 bg-rose-950/80 border border-rose-500/50 rounded-lg flex items-center gap-2 text-xs text-rose-200">
              <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="font-semibold">{activeDermatome.dangerSign}</span>
            </div>
          )}
        </div>

        {/* Card 3: Board Exam Rule & Midline Principle */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Diagnostic Pearl</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-amber-300 mb-1">Strict Midline Demarcation</h4>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              {activeDermatome.boardPearl}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Sagittal midline crossing?</span>
            <span className="font-bold text-rose-400">&lt; 1% (Immuno-compromised only)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
