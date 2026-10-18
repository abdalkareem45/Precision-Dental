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
  Compass,
  Maximize2,
  Info,
  Shield,
  HelpCircle
} from 'lucide-react';

export type FurcationToothType = 'mandibular_molar' | 'maxillary_molar' | 'maxillary_premolar';
export type FurcationHampClass = 'normal' | 'class_1' | 'class_2' | 'class_3' | 'class_4';
export type CepGrade = 'none' | 'grade_1' | 'grade_2' | 'grade_3';
export type RootTrunkType = 'short' | 'moderate' | 'long' | 'fused';

interface Furcation3DViewerProps {
  height?: string;
}

export const Furcation3DViewer: React.FC<Furcation3DViewerProps> = ({
  height = '580px'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Groups and objects
  const toothGroupRef = useRef<THREE.Group | null>(null);
  const probeGroupRef = useRef<THREE.Group | null>(null);
  const cepMeshRef = useRef<THREE.Mesh | null>(null);
  const boneGroupRef = useRef<THREE.Group | null>(null);
  const softTissueGroupRef = useRef<THREE.Group | null>(null);

  // Interactive controls state
  const [toothType, setToothType] = useState<FurcationToothType>('mandibular_molar');
  const [hampClass, setHampClass] = useState<FurcationHampClass>('class_2');
  const [cepGrade, setCepGrade] = useState<CepGrade>('none');
  const [rootTrunk, setRootTrunk] = useState<RootTrunkType>('moderate');
  const [showProbe, setShowProbe] = useState<boolean>(true);
  const [showBone, setShowBone] = useState<boolean>(true);
  const [showGingiva, setShowGingiva] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<'buccal' | 'lingual' | 'palatal_mesial' | 'occlusal'>('buccal');

  // Mouse interaction
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const rotationTargetRef = useRef({ x: 0.15, y: -0.2 });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const heightPx = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060f24);

    // Subtle atmospheric fog
    scene.fog = new THREE.FogExp2(0x060f24, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.8, 8.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff6e8, 1.3);
    dirLight1.position.set(5, 10, 7);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7dd3fc, 0.7);
    dirLight2.position.set(-6, -4, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xdfbe6e, 0.8, 15);
    pointLight.position.set(0, 0, 4);
    scene.add(pointLight);

    // 5. Grid helper (clinical stage floor)
    const grid = new THREE.GridHelper(12, 24, 0x1e3a8a, 0x0f2042);
    grid.position.y = -4;
    scene.add(grid);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    toothGroupRef.current = rootGroup;

    // Build the anatomical tooth model
    buildToothModel(rootGroup, toothType, hampClass, cepGrade, rootTrunk, showBone, showGingiva);

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = (currentTime - lastTime) * 0.001;
      lastTime = currentTime;

      // Smooth damping rotation
      if (toothGroupRef.current) {
        toothGroupRef.current.rotation.y += (rotationTargetRef.current.y - toothGroupRef.current.rotation.y) * 0.08;
        toothGroupRef.current.rotation.x += (rotationTargetRef.current.x - toothGroupRef.current.rotation.x) * 0.08;
      }

      // Gentle floating animation
      if (probeGroupRef.current && showProbe) {
        probeGroupRef.current.position.y = Math.sin(currentTime * 0.002) * 0.04;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse Listeners
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMousePosRef.current.x;
      const dy = e.clientY - prevMousePosRef.current.y;
      rotationTargetRef.current.y += dx * 0.008;
      rotationTargetRef.current.x += dy * 0.008;
      // Clamp vertical tilt
      rotationTargetRef.current.x = Math.max(-0.6, Math.min(0.6, rotationTargetRef.current.x));
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize handler
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
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, []);

  // Update tooth model on property change
  useEffect(() => {
    if (!toothGroupRef.current) return;
    buildToothModel(toothGroupRef.current, toothType, hampClass, cepGrade, rootTrunk, showBone, showGingiva);
  }, [toothType, hampClass, cepGrade, rootTrunk, showBone, showGingiva, showProbe]);

  // Update camera preset
  useEffect(() => {
    if (!toothGroupRef.current) return;
    if (cameraPreset === 'buccal') {
      rotationTargetRef.current = { x: 0.1, y: 0 };
    } else if (cameraPreset === 'lingual') {
      rotationTargetRef.current = { x: 0.1, y: Math.PI };
    } else if (cameraPreset === 'palatal_mesial') {
      // 45 degree angle for palatal-mesial furca probing
      rotationTargetRef.current = { x: 0.15, y: Math.PI * 0.75 };
    } else if (cameraPreset === 'occlusal') {
      rotationTargetRef.current = { x: 0.85, y: 0 };
    }
  }, [cameraPreset]);

  // =========================================================================
  // 3D GEOMETRY BUILDER: ANATOMICAL MULTI-ROOTED TEETH & FURCATION DEFECTS
  // =========================================================================
  const buildToothModel = (
    parent: THREE.Group,
    type: FurcationToothType,
    hamp: FurcationHampClass,
    cep: CepGrade,
    trunk: RootTrunkType,
    hasBone: boolean,
    hasGingiva: boolean
  ) => {
    // Clear previous children
    while (parent.children.length > 0) {
      const obj = parent.children[0];
      parent.remove(obj);
    }

    // Materials
    const enamelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfbfbf6,
      roughness: 0.25,
      metalness: 0.05,
      clearcoat: 0.35,
      clearcoatRoughness: 0.1
    });

    const rootCementumMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfcb9a, // yellowish anatomical cementum
      roughness: 0.65,
      metalness: 0.05
    });

    const cepMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.02,
      clearcoat: 0.5
    });

    const boneMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88
    });

    const gingivaMaterial = new THREE.MeshStandardMaterial({
      color: 0xe06880,
      roughness: 0.45,
      transparent: true,
      opacity: 0.82
    });

    const probeSteelMaterial = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.9,
      roughness: 0.2
    });

    const probeBlackBandMaterial = new THREE.MeshBasicMaterial({
      color: 0x111827
    });

    // Root trunk height calculation
    let trunkLength = 1.0;
    if (trunk === 'short') trunkLength = 0.5;
    else if (trunk === 'moderate') trunkLength = 1.0;
    else if (trunk === 'long') trunkLength = 1.6;
    else if (trunk === 'fused') trunkLength = 2.2;

    const toothSubGroup = new THREE.Group();
    parent.add(toothSubGroup);

    // -----------------------------------------------------------------------
    // A. CROWN MESH
    // -----------------------------------------------------------------------
    if (type === 'mandibular_molar') {
      // Lower 1st Molar crown: 5 cusps (Mesiobuccal, Distobuccal, Distal, Mesiolingual, Distolingual)
      const crownGeo = new THREE.BoxGeometry(2.6, 1.8, 2.2, 8, 6, 8);
      // Displace vertices to create occlusal anatomy
      const pos = crownGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        if (y > 0.6) {
          const x = pos.getX(i);
          const z = pos.getZ(i);
          // Central groove dip
          const distToCenter = Math.sqrt(x * x + z * z);
          pos.setY(i, y - (1.2 - distToCenter * 0.5) * 0.2);
        }
      }
      crownGeo.computeVertexNormals();
      const crownMesh = new THREE.Mesh(crownGeo, enamelMaterial);
      crownMesh.position.y = 1.7;
      crownMesh.castShadow = true;
      crownMesh.receiveShadow = true;
      toothSubGroup.add(crownMesh);

    } else if (type === 'maxillary_molar') {
      // Upper 1st Molar: Rhomboidal crown with Cusp of Carabelli
      const crownGeo = new THREE.BoxGeometry(2.7, 1.8, 2.7, 8, 6, 8);
      const pos = crownGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        if (y > 0.6) {
          const x = pos.getX(i);
          const z = pos.getZ(i);
          pos.setY(i, y - (1.3 - Math.sqrt(x * x + z * z) * 0.45) * 0.2);
        }
      }
      crownGeo.computeVertexNormals();
      const crownMesh = new THREE.Mesh(crownGeo, enamelMaterial);
      crownMesh.position.y = 1.7;
      crownMesh.castShadow = true;
      toothSubGroup.add(crownMesh);

    } else {
      // Maxillary 1st Premolar: 2 cusps (Buccal & Palatal)
      const crownGeo = new THREE.CylinderGeometry(1.0, 1.1, 1.7, 16);
      crownGeo.scale(1.2, 1.0, 1.4);
      const crownMesh = new THREE.Mesh(crownGeo, enamelMaterial);
      crownMesh.position.y = 1.6;
      crownMesh.castShadow = true;
      toothSubGroup.add(crownMesh);
    }

    // -----------------------------------------------------------------------
    // B. ROOT TRUNK (Undivided Region apical to CEJ)
    // -----------------------------------------------------------------------
    const trunkGeo = new THREE.CylinderGeometry(1.2, 1.15, trunkLength, 20);
    if (type === 'mandibular_molar') trunkGeo.scale(1.1, 1.0, 0.95);
    else if (type === 'maxillary_molar') trunkGeo.scale(1.15, 1.0, 1.15);
    else trunkGeo.scale(0.85, 1.0, 1.1);

    const trunkMesh = new THREE.Mesh(trunkGeo, rootCementumMaterial);
    trunkMesh.position.y = 0.8 - trunkLength * 0.5;
    trunkMesh.castShadow = true;
    toothSubGroup.add(trunkMesh);

    const furcationY = trunkMesh.position.y - trunkLength * 0.5;

    // -----------------------------------------------------------------------
    // C. ROOT CONES (Divided Region) & FURCATION FORNIX (Roof)
    // -----------------------------------------------------------------------
    if (type === 'mandibular_molar') {
      // 2 Roots: Mesial & Distal. Mesial is curved distally in apical 3rd and fluted!
      const rootLength = 3.2;

      // Mesial Root (Left, X < 0)
      const mesialCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.75, furcationY, 0),
        new THREE.Vector3(-0.95, furcationY - 1.2, 0),
        new THREE.Vector3(-0.85, furcationY - 2.4, 0.1),
        new THREE.Vector3(-0.55, furcationY - rootLength, 0.15) // Curved distally toward center
      ]);
      const mesialGeo = new THREE.TubeGeometry(mesialCurve, 20, 0.45, 12, false);
      const mesialMesh = new THREE.Mesh(mesialGeo, rootCementumMaterial);
      mesialMesh.castShadow = true;
      toothSubGroup.add(mesialMesh);

      // Distal Root (Right, X > 0)
      const distalCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.75, furcationY, 0),
        new THREE.Vector3(0.9, furcationY - 1.2, 0),
        new THREE.Vector3(0.75, furcationY - 2.3, 0),
        new THREE.Vector3(0.6, furcationY - rootLength, 0)
      ]);
      const distalGeo = new THREE.TubeGeometry(distalCurve, 20, 0.42, 12, false);
      const distalMesh = new THREE.Mesh(distalGeo, rootCementumMaterial);
      distalMesh.castShadow = true;
      toothSubGroup.add(distalMesh);

      // Furcation Fornix (Roof) Highlight
      const fornixGeo = new THREE.SphereGeometry(0.25, 12, 12);
      const fornixMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const fornixMesh = new THREE.Mesh(fornixGeo, fornixMat);
      fornixMesh.position.set(0, furcationY + 0.05, 0);
      toothSubGroup.add(fornixMesh);

    } else if (type === 'maxillary_molar') {
      // 3 Roots: Mesiobuccal (MB), Distobuccal (DB), Palatal (Lingual)
      const rootLength = 3.4;

      // Palatal Root (Large, divergent, rounded)
      const palatalCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, furcationY, -0.7),
        new THREE.Vector3(0, furcationY - 1.2, -1.25),
        new THREE.Vector3(0, furcationY - 2.4, -1.45),
        new THREE.Vector3(0, furcationY - rootLength, -1.35)
      ]);
      const palatalGeo = new THREE.TubeGeometry(palatalCurve, 20, 0.55, 12, false);
      const palatalMesh = new THREE.Mesh(palatalGeo, rootCementumMaterial);
      palatalMesh.castShadow = true;
      toothSubGroup.add(palatalMesh);

      // Mesiobuccal Root (Curved distally, fluted)
      const mbCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.85, furcationY, 0.6),
        new THREE.Vector3(-1.0, furcationY - 1.2, 0.65),
        new THREE.Vector3(-0.8, furcationY - 2.3, 0.6),
        new THREE.Vector3(-0.6, furcationY - rootLength * 0.9, 0.55)
      ]);
      const mbGeo = new THREE.TubeGeometry(mbCurve, 20, 0.42, 12, false);
      const mbMesh = new THREE.Mesh(mbGeo, rootCementumMaterial);
      mbMesh.castShadow = true;
      toothSubGroup.add(mbMesh);

      // Distobuccal Root
      const dbCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.85, furcationY, 0.6),
        new THREE.Vector3(0.95, furcationY - 1.2, 0.65),
        new THREE.Vector3(0.8, furcationY - 2.3, 0.6),
        new THREE.Vector3(0.7, furcationY - rootLength * 0.88, 0.55)
      ]);
      const dbGeo = new THREE.TubeGeometry(dbCurve, 20, 0.38, 12, false);
      const dbMesh = new THREE.Mesh(dbGeo, rootCementumMaterial);
      dbMesh.castShadow = true;
      toothSubGroup.add(dbMesh);

      // Furcation Fornix Roof
      const fornixGeo = new THREE.SphereGeometry(0.28, 12, 12);
      const fornixMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const fornixMesh = new THREE.Mesh(fornixGeo, fornixMat);
      fornixMesh.position.set(0, furcationY + 0.05, 0.1);
      toothSubGroup.add(fornixMesh);

    } else {
      // Maxillary 1st Premolar: 2 Roots (Buccal & Palatal)
      const rootLength = 3.0;

      // Buccal Root (Z > 0)
      const bCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, furcationY, 0.5),
        new THREE.Vector3(0, furcationY - 1.2, 0.65),
        new THREE.Vector3(0, furcationY - 2.2, 0.55),
        new THREE.Vector3(0, furcationY - rootLength, 0.4)
      ]);
      const bGeo = new THREE.TubeGeometry(bCurve, 20, 0.4, 12, false);
      const bMesh = new THREE.Mesh(bGeo, rootCementumMaterial);
      bMesh.castShadow = true;
      toothSubGroup.add(bMesh);

      // Palatal Root (Z < 0)
      const pCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, furcationY, -0.5),
        new THREE.Vector3(0, furcationY - 1.2, -0.65),
        new THREE.Vector3(0, furcationY - 2.2, -0.55),
        new THREE.Vector3(0, furcationY - rootLength, -0.4)
      ]);
      const pGeo = new THREE.TubeGeometry(pCurve, 20, 0.38, 12, false);
      const pMesh = new THREE.Mesh(pGeo, rootCementumMaterial);
      pMesh.castShadow = true;
      toothSubGroup.add(pMesh);
    }

    // -----------------------------------------------------------------------
    // D. CERVICAL ENAMEL PROJECTION (CEP) - Masters & Hoskins (1964)
    // -----------------------------------------------------------------------
    if (cep !== 'none') {
      let cepHeight = 0.4;
      let cepY = 0.7;
      let extendsInto = false;

      if (cep === 'grade_1') {
        cepHeight = 0.4; // Extends from CEJ toward entrance
        cepY = 0.65;
      } else if (cep === 'grade_2') {
        cepHeight = 0.75; // Approaches entrance but no horizontal entry
        cepY = 0.45;
      } else if (cep === 'grade_3') {
        cepHeight = 1.1; // Extends horizontally into furcation
        cepY = 0.25;
        extendsInto = true;
      }

      const cepGeo = new THREE.ConeGeometry(0.35, cepHeight, 8);
      cepGeo.rotateZ(Math.PI); // Point downward toward furcation
      const cepMesh = new THREE.Mesh(cepGeo, cepMaterial);
      cepMesh.position.set(0, cepY, 1.18);
      toothSubGroup.add(cepMesh);

      // Enamel Pearl representation
      if (cep === 'grade_3') {
        const pearlGeo = new THREE.SphereGeometry(0.2, 12, 12);
        const pearlMesh = new THREE.Mesh(pearlGeo, cepMaterial);
        pearlMesh.position.set(0, furcationY + 0.1, 0.95);
        toothSubGroup.add(pearlMesh);
      }
    }

    // -----------------------------------------------------------------------
    // E. ALVEOLAR BONE & FURCATION DEFECT MESH (Hamp et al. 1975)
    // -----------------------------------------------------------------------
    if (hasBone) {
      const boneGroup = new THREE.Group();
      boneGroupRef.current = boneGroup;
      toothSubGroup.add(boneGroup);

      // Base surrounding bone
      let boneCrestY = furcationY + 0.3; // Normal bone covers furcation entrance
      let boneOpeningSize = 0.1;

      if (hamp === 'normal') {
        boneCrestY = furcationY + 0.5; // Furcation fully covered by bone
        boneOpeningSize = 0;
      } else if (hamp === 'class_1') {
        boneCrestY = furcationY - 0.1; // Initial invasion <1/3 tooth width
        boneOpeningSize = 0.35;
      } else if (hamp === 'class_2') {
        boneCrestY = furcationY - 0.4; // Partial invasion >1/3 width, cul-de-sac
        boneOpeningSize = 0.7;
      } else if (hamp === 'class_3' || hamp === 'class_4') {
        boneCrestY = furcationY - 0.9; // Through-and-through tunnel
        boneOpeningSize = 1.2;
      }

      // Outer alveolar bone socket
      const boneOuterGeo = new THREE.CylinderGeometry(2.4, 2.5, 3.2, 24, 1, true);
      const boneOuterMesh = new THREE.Mesh(boneOuterGeo, boneMaterial);
      boneOuterMesh.position.y = -2.0;
      boneGroup.add(boneOuterMesh);

      // Interradicular bone septum (inside the furca)
      if (hamp !== 'class_3' && hamp !== 'class_4') {
        const septumHeight = Math.max(0.4, 2.0 - (hamp === 'class_2' ? 1.0 : 0.3));
        const septumGeo = new THREE.ConeGeometry(0.8 - boneOpeningSize * 0.4, septumHeight, 16);
        const septumMesh = new THREE.Mesh(septumGeo, boneMaterial);
        septumMesh.position.set(0, furcationY - septumHeight * 0.5 - (hamp === 'class_2' ? 0.3 : 0.05), 0);
        boneGroup.add(septumMesh);
      }
    }

    // -----------------------------------------------------------------------
    // F. SOFT TISSUE / GINGIVAL MARGIN (Class IV shows recession)
    // -----------------------------------------------------------------------
    if (hasGingiva) {
      const gingivaGroup = new THREE.Group();
      softTissueGroupRef.current = gingivaGroup;
      toothSubGroup.add(gingivaGroup);

      let gingivaMarginY = 0.8; // Near CEJ normally
      if (hamp === 'class_4') {
        // Class IV: Gingiva recedes apically exposing furcation tunnel!
        gingivaMarginY = furcationY - 0.4;
      }

      const gingivaGeo = new THREE.CylinderGeometry(2.35, 2.45, 1.4, 24, 1, true);
      const gingivaMesh = new THREE.Mesh(gingivaGeo, gingivaMaterial);
      gingivaMesh.position.y = gingivaMarginY - 0.7;
      gingivaGroup.add(gingivaMesh);
    }

    // -----------------------------------------------------------------------
    // G. NABERS PROBE (Clinical Probing Simulator)
    // -----------------------------------------------------------------------
    if (showProbe && hamp !== 'normal') {
      const probeGroup = new THREE.Group();
      probeGroupRef.current = probeGroup;
      toothSubGroup.add(probeGroup);

      // Curved Nabers probe tip
      const probeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.8, furcationY + 1.2, 0.8),
        new THREE.Vector3(1.8, furcationY + 0.6, 0.6),
        new THREE.Vector3(0.8, furcationY + 0.1, 0.4),
        // Tip penetration depends on Hamp Class!
        hamp === 'class_1'
          ? new THREE.Vector3(0.3, furcationY - 0.05, 0.25) // penetrates <1/3
          : hamp === 'class_2'
          ? new THREE.Vector3(0.0, furcationY - 0.08, 0.0) // penetrates cul-de-sac
          : new THREE.Vector3(-0.8, furcationY - 0.05, -0.3) // penetrates through-and-through
      ]);

      const probeTipGeo = new THREE.TubeGeometry(probeCurve, 24, 0.07, 10, false);
      const probeTipMesh = new THREE.Mesh(probeTipGeo, probeSteelMaterial);
      probeGroup.add(probeTipMesh);

      // Probe shaft handle
      const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.5, 12);
      const shaftMesh = new THREE.Mesh(shaftGeo, probeSteelMaterial);
      shaftMesh.position.set(3.8, furcationY + 2.5, 1.2);
      shaftMesh.rotation.z = -Math.PI / 4;
      probeGroup.add(shaftMesh);

      // Millimeter Color Bands on Nabers Probe (3mm, 6mm, 9mm, 12mm)
      for (let b = 0; b < 4; b++) {
        const bandGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.15, 12);
        const bandMesh = new THREE.Mesh(bandGeo, probeBlackBandMaterial);
        bandMesh.position.set(3.2 + b * 0.35, furcationY + 1.9 + b * 0.35, 1.0 + b * 0.1);
        bandMesh.rotation.z = -Math.PI / 4;
        probeGroup.add(bandMesh);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 3D Viewport Box */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#060f24] shadow-2xl">
        {/* Three.js canvas container */}
        <div
          ref={mountRef}
          style={{ height }}
          className="w-full cursor-grab active:cursor-grabbing select-none"
        />

        {/* Viewport Top Overlay: Quick Info & Presets */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 shadow-xl pointer-events-auto flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-[#C9A24B] text-slate-950 font-black text-xs flex items-center justify-center font-mono">
              3D
            </span>
            <div>
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <span>Furcation 3D Anatomical Engine</span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {toothType === 'mandibular_molar' ? 'Mandibular Molar (Bifurcated)' : toothType === 'maxillary_molar' ? 'Maxillary Molar (Trifurcated)' : 'Maxillary Premolar'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Drag to rotate • Real-time Nabers probe penetration &amp; bone loss
              </div>
            </div>
          </div>

          {/* Camera Perspective Angle Presets */}
          <div className="bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl pointer-events-auto flex items-center gap-1 text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-mono px-1.5 font-bold">Angle:</span>
            <button
              onClick={() => setCameraPreset('buccal')}
              className={`px-2.5 py-1 rounded-xl font-bold transition ${
                cameraPreset === 'buccal'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Buccal
            </button>
            <button
              onClick={() => setCameraPreset('lingual')}
              className={`px-2.5 py-1 rounded-xl font-bold transition ${
                cameraPreset === 'lingual'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lingual
            </button>
            <button
              onClick={() => setCameraPreset('palatal_mesial')}
              className={`px-2.5 py-1 rounded-xl font-bold transition ${
                cameraPreset === 'palatal_mesial'
                  ? 'bg-[#C9A24B] text-slate-950 shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Crucial Dr. Maha Shukri Lecture Rule: Mesial furca of max molars is probed from PALATAL!"
            >
              Palatal-Mesial
            </button>
            <button
              onClick={() => setCameraPreset('occlusal')}
              className={`px-2.5 py-1 rounded-xl font-bold transition ${
                cameraPreset === 'occlusal'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Occlusal
            </button>
          </div>
        </div>

        {/* Viewport Bottom Overlay: Live Diagnostic Legend */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pointer-events-none">
          <div className="bg-slate-950/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-800 pointer-events-auto flex items-center gap-3 text-xs max-w-xl">
            <div className={`p-2 rounded-xl shrink-0 font-bold ${
              hampClass === 'normal' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
              hampClass === 'class_1' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              hampClass === 'class_2' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
              'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {hampClass === 'normal' ? 'Intact Periodontium' :
               hampClass === 'class_1' ? 'Hamp Class I (Initial)' :
               hampClass === 'class_2' ? 'Hamp Class II (Partial)' :
               hampClass === 'class_3' ? 'Hamp Class III (Through-&-Through)' :
               'Hamp Class IV (Recession Exposed)'}
            </div>
            <div className="text-[11px] text-slate-300">
              {hampClass === 'normal' && 'Bone covers furcation fornix. Nabers probe cannot engage the furca entrance.'}
              {hampClass === 'class_1' && 'Horizontal attachment loss < 1/3 tooth width (<3mm). Fluting detectable.'}
              {hampClass === 'class_2' && 'Horizontal loss > 1/3 tooth width, but not through-and-through (cul-de-sac pocket).'}
              {hampClass === 'class_3' && 'Through-and-through horizontal bone tunnel between roots. Probe passes completely.'}
              {hampClass === 'class_4' && 'Through-and-through tunnel with gingival recession exposing the furcation entrance clinically!'}
            </div>
          </div>

          {/* Quick Visibility Toggles */}
          <div className="bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 pointer-events-auto flex items-center gap-1.5 self-end sm:self-auto text-xs">
            <button
              onClick={() => setShowProbe(!showProbe)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 ${
                showProbe ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              <Compass className="w-3 h-3" /> Nabers Probe
            </button>
            <button
              onClick={() => setShowBone(!showBone)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 ${
                showBone ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              <Layers className="w-3 h-3" /> Bone
            </button>
            <button
              onClick={() => setShowGingiva(!showGingiva)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 ${
                showGingiva ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              <Activity className="w-3 h-3" /> Gingiva
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel: Tooth Selection, Hamp Degree, CEP & Trunk Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#07132e] border border-slate-800 p-4 rounded-3xl shadow-xl">
        {/* 1. Tooth Anatomy Type */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span>1. Tooth Type &amp; Anatomy:</span>
          </label>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setToothType('mandibular_molar')}
              className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between ${
                toothType === 'mandibular_molar'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>Mandibular Molar (2 Roots)</span>
              <span className="text-[10px] text-blue-200">Bifurcated</span>
            </button>
            <button
              onClick={() => setToothType('maxillary_molar')}
              className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between ${
                toothType === 'maxillary_molar'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>Maxillary Molar (3 Roots)</span>
              <span className="text-[10px] text-blue-200">Trifurcated</span>
            </button>
            <button
              onClick={() => setToothType('maxillary_premolar')}
              className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between ${
                toothType === 'maxillary_premolar'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>Maxillary 1st Premolar</span>
              <span className="text-[10px] text-blue-200">B/P Bifurcation</span>
            </button>
          </div>
        </div>

        {/* 2. Hamp Classification (1975) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>2. Hamp et al. (1975) Degree:</span>
          </label>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setHampClass('class_1')}
              className={`p-2 rounded-xl text-xs font-bold text-center transition ${
                hampClass === 'class_1'
                  ? 'bg-amber-600 text-white shadow ring-2 ring-amber-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Class I (&lt;1/3)
            </button>
            <button
              onClick={() => setHampClass('class_2')}
              className={`p-2 rounded-xl text-xs font-bold text-center transition ${
                hampClass === 'class_2'
                  ? 'bg-orange-600 text-white shadow ring-2 ring-orange-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Class II (&gt;1/3)
            </button>
            <button
              onClick={() => setHampClass('class_3')}
              className={`p-2 rounded-xl text-xs font-bold text-center transition ${
                hampClass === 'class_3'
                  ? 'bg-rose-600 text-white shadow ring-2 ring-rose-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Class III (Through)
            </button>
            <button
              onClick={() => setHampClass('class_4')}
              className={`p-2 rounded-xl text-xs font-bold text-center transition ${
                hampClass === 'class_4'
                  ? 'bg-purple-600 text-white shadow ring-2 ring-purple-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Class IV (Recession)
            </button>
          </div>
          <button
            onClick={() => setHampClass('normal')}
            className={`w-full py-1 rounded-xl text-[11px] font-semibold transition ${
              hampClass === 'normal'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            Normal (No Furcation Loss)
          </button>
        </div>

        {/* 3. Cervical Enamel Projections (Masters & Hoskins 1964) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>3. Cervical Enamel Projection:</span>
          </label>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setCepGrade('none')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition ${
                cepGrade === 'none'
                  ? 'bg-slate-800 text-white border border-slate-600'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              No CEP Present
            </button>
            <button
              onClick={() => setCepGrade('grade_1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition ${
                cepGrade === 'grade_1'
                  ? 'bg-purple-700 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Grade I: Toward entrance
            </button>
            <button
              onClick={() => setCepGrade('grade_2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition ${
                cepGrade === 'grade_2'
                  ? 'bg-purple-700 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Grade II: Approaches entrance
            </button>
            <button
              onClick={() => setCepGrade('grade_3')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition ${
                cepGrade === 'grade_3'
                  ? 'bg-purple-700 text-white shadow font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Grade III: Extends horizontally + Pearl
            </button>
          </div>
        </div>

        {/* 4. Root Trunk Height (CEJ to Furca) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>4. Root Trunk Height (Fig. 5):</span>
          </label>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setRootTrunk('short')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between ${
                rootTrunk === 'short'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>Short Trunk (Easy Access)</span>
              <span className="text-[10px] text-emerald-200">Early Loss</span>
            </button>
            <button
              onClick={() => setRootTrunk('moderate')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between ${
                rootTrunk === 'moderate'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>Moderate Trunk</span>
              <span className="text-[10px] text-emerald-200">Standard</span>
            </button>
            <button
              onClick={() => setRootTrunk('long')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between ${
                rootTrunk === 'long'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>Long Trunk (Late Loss)</span>
              <span className="text-[10px] text-emerald-200">Hard to reach</span>
            </button>
            <button
              onClick={() => setRootTrunk('fused')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between ${
                rootTrunk === 'fused'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>Fused Roots</span>
              <span className="text-[10px] text-emerald-200">Poor prognosis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
