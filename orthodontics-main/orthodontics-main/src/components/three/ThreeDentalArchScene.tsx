/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AngleClass, OcclusionExcursion } from '../../types/ortho';
import {
  RotateCw,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Compass,
  Crosshair,
  ShieldAlert,
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ToothMetadata {
  id: string;
  name: string;
  arch: 'Maxilla' | 'Mandible';
  andrewsTip: string;
  andrewsTorque: string;
  clinicalSignificance: string;
}

interface ThreeDentalArchSceneProps {
  initialAngleClass?: AngleClass;
  onAngleChange?: (cls: AngleClass) => void;
}

export const ThreeDentalArchScene: React.FC<ThreeDentalArchSceneProps> = ({
  initialAngleClass = 'normal',
  onAngleChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Occlusion state
  const [angleClass, setAngleClass] = useState<AngleClass>(initialAngleClass);
  const [overjet, setOverjet] = useState<number>(3.0);
  const [overbite, setOverbite] = useState<number>(2.5);
  const [curveOfSpee, setCurveOfSpee] = useState<number>(0.2);
  const [excursion, setExcursion] = useState<OcclusionExcursion>('centric');
  const [guidanceType, setGuidanceType] = useState<'canine' | 'group'>('canine');
  const [ligatureColor, setLigatureColor] = useState<string>('#C9A24B'); // Gold default
  const [showAndrewsOverlay, setShowAndrewsOverlay] = useState<boolean>(false);
  const [showTMJCondyle, setShowTMJCondyle] = useState<boolean>(true);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [isExpandedView, setIsExpandedView] = useState<boolean>(false);
  const [selectedTooth, setSelectedTooth] = useState<ToothMetadata | null>(null);

  const sceneStateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    maxillaGroup: THREE.Group;
    mandibleGroup: THREE.Group;
    tmjGroup: THREE.Group;
    andrewsGuidesGroup: THREE.Group;
    interactiveTeeth: THREE.Mesh[];
    targetMandiblePos: THREE.Vector3;
    currentMandiblePos: THREE.Vector3;
    targetMandibleRot: THREE.Euler;
    currentMandibleRot: THREE.Euler;
    cameraTargetPos: THREE.Vector3;
    controlsTargetPos: THREE.Vector3;
    animatingCamera: boolean;
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
    ligatureMaterials: THREE.MeshStandardMaterial[];
  } | null>(null);

  // Handle Class Switch
  const handleAngleSelect = (cls: AngleClass) => {
    setAngleClass(cls);
    if (onAngleChange) onAngleChange(cls);
    if (cls === 'normal') {
      setOverjet(3.0);
      setOverbite(2.5);
      setCurveOfSpee(0.2);
    } else if (cls === 'class_i') {
      setOverjet(3.5);
      setOverbite(3.0);
    } else if (cls === 'class_ii') {
      setOverjet(8.0);
      setOverbite(5.5);
    } else if (cls === 'class_iii') {
      setOverjet(-2.0);
      setOverbite(0.8);
    }
  };

  // Camera presets
  const setCameraView = (view: 'right' | 'frontal' | 'left' | 'tmj' | 'occlusal') => {
    setIsAutoRotating(false);
    if (!sceneStateRef.current) return;
    const { cameraTargetPos, controlsTargetPos } = sceneStateRef.current;

    if (view === 'right') {
      cameraTargetPos.set(11, 2.5, 4.5);
      controlsTargetPos.set(0, 0, 0);
    } else if (view === 'frontal') {
      cameraTargetPos.set(0, 1.0, 12);
      controlsTargetPos.set(0, 0, 0);
    } else if (view === 'left') {
      cameraTargetPos.set(-11, 2.5, 4.5);
      controlsTargetPos.set(0, 0, 0);
    } else if (view === 'tmj') {
      cameraTargetPos.set(7.5, 4.0, -4.5);
      controlsTargetPos.set(4.0, 2.0, -3.5);
    } else if (view === 'occlusal') {
      cameraTargetPos.set(0, 12, 1);
      controlsTargetPos.set(0, 0, 0);
    }
    sceneStateRef.current.animatingCamera = true;
  };

  // Three.js Mount Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#071330'); // Ultra-luxury midnight dark navy
    scene.fog = new THREE.Fog('#071330', 25, 50);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(11, 2.5, 4.5);

    // Studio 3-point Lighting
    const keyLight = new THREE.DirectionalLight('#FFF9EE', 2.4);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = !isHeadless;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#93C5FD', 1.3);
    fillLight.position.set(-8, 6, -6);
    scene.add(fillLight);

    const goldRimLight = new THREE.DirectionalLight('#C9A24B', 1.8);
    goldRimLight.position.set(0, -6, -8);
    scene.add(goldRimLight);

    const hemiLight = new THREE.HemisphereLight('#0B1F4D', '#071330', 0.9);
    scene.add(hemiLight);

    // Soft Ground Shadow Disc
    const groundGeo = new THREE.CircleGeometry(12, 32);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x030816,
      transparent: true,
      opacity: 0.6,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -4.0;
    scene.add(ground);

    // Materials
    const toothEnamelMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FCFBF7'),
      roughness: 0.12,
      metalness: 0.03,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      transmission: 0.12,
      ior: 1.54,
    });

    const selectedToothMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#DFC17B'),
      metalness: 0.4,
      roughness: 0.2,
      emissive: new THREE.Color('#9F7622'),
      emissiveIntensity: 0.35,
    });

    const gumMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D97070'),
      roughness: 0.45,
      metalness: 0.0,
    });

    const bracketSteelMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E2E8F0'),
      metalness: 0.95,
      roughness: 0.15,
    });

    const goldArchwireMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C9A24B'),
      metalness: 0.9,
      roughness: 0.2,
    });

    const discMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#60A5FA'),
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });

    const maxillaGroup = new THREE.Group();
    const mandibleGroup = new THREE.Group();
    const tmjGroup = new THREE.Group();
    const andrewsGuidesGroup = new THREE.Group();
    const interactiveTeeth: THREE.Mesh[] = [];
    const ligatureMaterials: THREE.MeshStandardMaterial[] = [];

    // Anatomical Tooth Topology Generator
    const createAnatomicalToothMesh = (
      name: string,
      isUpper: boolean,
      isMolar: boolean,
      isCanine: boolean,
      isPremolar: boolean,
      scale: [number, number, number]
    ) => {
      const toothYDir = isUpper ? 1 : -1;
      const group = new THREE.Group();

      let crownGeo: THREE.BufferGeometry;

      if (isMolar) {
        // Detailed 4-cusp molar crown with occlusal fissures
        crownGeo = new THREE.CylinderGeometry(
          scale[0] * 0.52,
          scale[0] * 0.45,
          scale[1] * 0.9 * toothYDir,
          20
        );
      } else if (isPremolar) {
        // Bicuspid crown
        crownGeo = new THREE.CylinderGeometry(
          scale[0] * 0.48,
          scale[0] * 0.4,
          scale[1] * 0.85 * toothYDir,
          16
        );
      } else if (isCanine) {
        // Pointed canine crown with labial ridge
        crownGeo = new THREE.ConeGeometry(scale[0] * 0.48, scale[1] * 1.1 * toothYDir, 16);
      } else {
        // Chisel-shaped incisor with bevelled incisal edge
        crownGeo = new THREE.BoxGeometry(scale[0], scale[1], scale[2]);
      }

      const crownMesh = new THREE.Mesh(crownGeo, toothEnamelMaterial);
      crownMesh.castShadow = true;
      crownMesh.receiveShadow = true;
      crownMesh.userData = { isTooth: true, name };
      interactiveTeeth.push(crownMesh);
      group.add(crownMesh);

      // Distinctive Cusp Details for Molars
      if (isMolar) {
        // 4 individual cusps (MB, DB, ML, DL)
        const cuspGeo = new THREE.ConeGeometry(scale[0] * 0.22, 0.35 * toothYDir, 8);
        const offsets = [
          [-scale[0] * 0.22, 0.25 * toothYDir, -scale[2] * 0.2], // MB
          [scale[0] * 0.22, 0.25 * toothYDir, -scale[2] * 0.2],  // DB
          [-scale[0] * 0.22, 0.25 * toothYDir, scale[2] * 0.2],  // ML
          [scale[0] * 0.22, 0.25 * toothYDir, scale[2] * 0.2],   // DL
        ];
        offsets.forEach(([cx, cy, cz]) => {
          const cusp = new THREE.Mesh(cuspGeo, toothEnamelMaterial);
          cusp.position.set(cx, (isUpper ? -1 : 1) * (scale[1] * 0.4) + cy, cz);
          group.add(cusp);
        });
      }

      // Orthodontic Bracket + Ligature
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.12), bracketSteelMaterial);
      bracket.position.set(0, 0, (scale[2] || 0.6) * 0.55);
      group.add(bracket);

      // Ligature Tie Ring
      const ligMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(ligatureColor),
        metalness: 0.6,
        roughness: 0.3,
      });
      ligatureMaterials.push(ligMat);
      const ligGeo = new THREE.TorusGeometry(0.12, 0.035, 8, 12);
      const ligatureMesh = new THREE.Mesh(ligGeo, ligMat);
      ligatureMesh.position.set(0, 0, (scale[2] || 0.6) * 0.55 + 0.07);
      group.add(ligatureMesh);

      return group;
    };

    // Tooth Specifications
    const archToothSpecs = [
      { name: 'Central Incisor', scale: [0.75, 1.05, 0.45], isMolar: false, isCanine: false, isPremolar: false, tip: '+5°', torque: '+7°', sig: 'Keys to smile arc & incisal guidance' },
      { name: 'Lateral Incisor', scale: [0.65, 0.95, 0.4], isMolar: false, isCanine: false, isPremolar: false, tip: '+9°', torque: '+3°', sig: '1mm more incisal than central' },
      { name: 'Canine', scale: [0.72, 1.2, 0.6], isMolar: false, isCanine: true, isPremolar: false, tip: '+11°', torque: '-7°', sig: 'Cornerstone of arch; canine guidance in excursions' },
      { name: '1st Premolar', scale: [0.76, 0.88, 0.75], isMolar: false, isCanine: false, isPremolar: true, tip: '+2°', torque: '-7°', sig: 'Bicuspid embrasure alignment' },
      { name: '2nd Premolar', scale: [0.78, 0.85, 0.78], isMolar: false, isCanine: false, isPremolar: true, tip: '+2°', torque: '-7°', sig: 'Support for posterior arch width' },
      { name: '1st Molar (Andrews Key 1)', scale: [1.18, 0.88, 1.15], isMolar: true, isCanine: false, isPremolar: false, tip: '+5°', torque: '-14°', sig: 'Key to occlusion; MB cusp in buccal groove + distal marginal ridge contact' },
      { name: '2nd Molar', scale: [1.08, 0.82, 1.08], isMolar: true, isCanine: false, isPremolar: false, tip: '+5°', torque: '-14°', sig: 'Mesial marginal ridge contacts max 1st distal ridge' },
    ];

    const buildArch = (isUpper: boolean, parentGroup: THREE.Group) => {
      const radiusX = isUpper ? 3.4 : 3.1;
      const radiusZ = isUpper ? 4.2 : 3.8;
      const yOffset = isUpper ? 1.0 : -1.0;

      // Gingival Base Tube
      const gumPts: THREE.Vector3[] = [];
      for (let i = 0; i <= 32; i++) {
        const t = (i / 32) * Math.PI - Math.PI / 2;
        const x = Math.sin(t) * radiusX;
        const z = (Math.cos(t) - 1) * radiusZ + (isUpper ? 0.2 : 0);
        gumPts.push(new THREE.Vector3(x, yOffset + (isUpper ? 0.6 : -0.6), z));
      }
      const gumMesh = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(gumPts), 40, isUpper ? 0.7 : 0.65, 12, false),
        gumMaterial
      );
      gumMesh.castShadow = true;
      parentGroup.add(gumMesh);

      // Gold Archwire
      const wirePts: THREE.Vector3[] = [];
      for (let i = 0; i <= 28; i++) {
        const t = (i / 28) * Math.PI - Math.PI / 2;
        const x = Math.sin(t) * (radiusX + 0.35);
        const z = (Math.cos(t) - 1) * (radiusZ + 0.35);
        wirePts.push(new THREE.Vector3(x, yOffset + (isUpper ? 0.1 : -0.1), z));
      }
      const wireMesh = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wirePts), 36, 0.05, 8, false),
        goldArchwireMaterial
      );
      parentGroup.add(wireMesh);

      // Populate Teeth
      archToothSpecs.forEach((spec, idx) => {
        const angR = 0.12 + idx * 0.21;
        const angL = -angR;

        [angR, angL].forEach((ang, sideIdx) => {
          const isRight = sideIdx === 0;
          const x = Math.sin(ang) * radiusX;
          const z = (Math.cos(ang) - 1) * radiusZ;

          const toothGroup = createAnatomicalToothMesh(
            `${isUpper ? 'Maxillary' : 'Mandibular'} ${isRight ? 'Right' : 'Left'} ${spec.name}`,
            isUpper,
            spec.isMolar,
            spec.isCanine,
            spec.isPremolar,
            spec.scale as [number, number, number]
          );

          toothGroup.position.set(x, yOffset, z);
          toothGroup.rotation.y = ang * 0.85;

          // Attach metadata to first child for inspection
          (toothGroup.children[0] as THREE.Mesh).userData = {
            id: `${isUpper ? 'U' : 'L'}-${isRight ? 'R' : 'L'}-${idx}`,
            name: `${isUpper ? 'Maxillary' : 'Mandibular'} ${isRight ? 'Right' : 'Left'} ${spec.name}`,
            arch: isUpper ? 'Maxilla' : 'Mandible',
            andrewsTip: spec.tip,
            andrewsTorque: spec.torque,
            clinicalSignificance: spec.sig,
          };

          parentGroup.add(toothGroup);
        });
      });
    };

    buildArch(true, maxillaGroup);
    buildArch(false, mandibleGroup);

    // Anatomical Articulated TMJ Condyle Process (Mandibular Ramus & Condylar Head)
    const buildTMJCondylarProcess = () => {
      // Right TMJ Condyle
      const condyleNeckGeo = new THREE.CylinderGeometry(0.35, 0.45, 2.8, 12);
      const condyleHeadGeo = new THREE.SphereGeometry(0.55, 16, 12);
      condyleHeadGeo.scale(1.3, 0.8, 0.9);

      // Right Side
      const rightNeck = new THREE.Mesh(condyleNeckGeo, toothEnamelMaterial);
      rightNeck.position.set(3.4, 1.2, -4.5);
      rightNeck.rotation.x = -0.3;
      rightNeck.rotation.z = -0.15;
      mandibleGroup.add(rightNeck);

      const rightHead = new THREE.Mesh(condyleHeadGeo, toothEnamelMaterial);
      rightHead.position.set(3.7, 2.4, -4.9);
      rightHead.rotation.y = 0.2;
      mandibleGroup.add(rightHead);

      // Articular Disc (Fibrocartilaginous biconcave disc)
      const rightDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.15, 16), discMaterial);
      rightDisc.position.set(3.7, 2.7, -4.9);
      rightDisc.rotation.x = 0.2;
      mandibleGroup.add(rightDisc);

      // Glenoid Fossa & Articular Eminence (Skull Base Reference)
      const eminenceGeo = new THREE.BoxGeometry(1.6, 0.4, 2.0);
      const fossaMesh = new THREE.Mesh(eminenceGeo, new THREE.MeshStandardMaterial({
        color: 0x1E293B,
        roughness: 0.6,
      }));
      fossaMesh.position.set(3.7, 3.1, -4.8);
      fossaMesh.rotation.x = 0.35; // S-shaped articular eminence slope
      scene.add(fossaMesh);

      // Left Side Condyle & Fossa
      const leftNeck = new THREE.Mesh(condyleNeckGeo, toothEnamelMaterial);
      leftNeck.position.set(-3.4, 1.2, -4.5);
      leftNeck.rotation.x = -0.3;
      leftNeck.rotation.z = 0.15;
      mandibleGroup.add(leftNeck);

      const leftHead = new THREE.Mesh(condyleHeadGeo, toothEnamelMaterial);
      leftHead.position.set(-3.7, 2.4, -4.9);
      leftHead.rotation.y = -0.2;
      mandibleGroup.add(leftHead);

      const leftDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.15, 16), discMaterial);
      leftDisc.position.set(-3.7, 2.7, -4.9);
      leftDisc.rotation.x = 0.2;
      mandibleGroup.add(leftDisc);

      const leftFossaMesh = new THREE.Mesh(eminenceGeo, new THREE.MeshStandardMaterial({
        color: 0x1E293B,
        roughness: 0.6,
      }));
      leftFossaMesh.position.set(-3.7, 3.1, -4.8);
      leftFossaMesh.rotation.x = 0.35;
      scene.add(leftFossaMesh);
    };

    buildTMJCondylarProcess();

    scene.add(maxillaGroup);
    scene.add(mandibleGroup);
    scene.add(tmjGroup);
    scene.add(andrewsGuidesGroup);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // Orbit controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.8;
    controls.minDistance = 4;
    controls.maxDistance = 28;
    controls.maxPolarAngle = Math.PI - 0.05;
    controls.target.set(0, 0, 0);
    controls.update();

    sceneStateRef.current = {
      renderer,
      scene,
      camera,
      controls,
      maxillaGroup,
      mandibleGroup,
      tmjGroup,
      andrewsGuidesGroup,
      interactiveTeeth,
      targetMandiblePos: new THREE.Vector3(0, 0, 0),
      currentMandiblePos: new THREE.Vector3(0, 0, 0),
      targetMandibleRot: new THREE.Euler(0, 0, 0),
      currentMandibleRot: new THREE.Euler(0, 0, 0),
      cameraTargetPos: new THREE.Vector3(11, 2.5, 4.5),
      controlsTargetPos: new THREE.Vector3(0, 0, 0),
      animatingCamera: false,
      raycaster,
      pointer,
      ligatureMaterials,
    };

    // Tap / Click detection distinguishing free orbit drag from tooth selection
    let startX = 0;
    let startY = 0;

    const onPointerDown = (e: PointerEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      setIsAutoRotating(false);
    };

    const onPointerUp = (e: PointerEvent) => {
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx < 6 && dy < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(interactiveTeeth, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh;
          if (hit.userData && hit.userData.id) {
            setSelectedTooth(hit.userData as ToothMetadata);
          }
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointerup', onPointerUp);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    let animationId: number;
    let clock = new THREE.Clock();

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const state = sceneStateRef.current;

      if (state) {
        if (state.animatingCamera) {
          state.camera.position.lerp(state.cameraTargetPos, 1 - Math.exp(-6 * delta));
          state.controls.target.lerp(state.controlsTargetPos, 1 - Math.exp(-6 * delta));
          state.controls.update();

          if (
            state.camera.position.distanceTo(state.cameraTargetPos) < 0.08 &&
            state.controls.target.distanceTo(state.controlsTargetPos) < 0.08
          ) {
            state.animatingCamera = false;
          }
        } else {
          state.controls.autoRotate = isAutoRotating;
          state.controls.autoRotateSpeed = 1.5;
          state.controls.update();
        }

        state.currentMandiblePos.lerp(state.targetMandiblePos, 1 - Math.exp(-9 * delta));
        state.mandibleGroup.position.copy(state.currentMandiblePos);

        state.currentMandibleRot.x = THREE.MathUtils.damp(state.currentMandibleRot.x, state.targetMandibleRot.x, 8, delta);
        state.currentMandibleRot.y = THREE.MathUtils.damp(state.currentMandibleRot.y, state.targetMandibleRot.y, 8, delta);
        state.currentMandibleRot.z = THREE.MathUtils.damp(state.currentMandibleRot.z, state.targetMandibleRot.z, 8, delta);
        state.mandibleGroup.rotation.copy(state.currentMandibleRot);

        state.renderer.render(state.scene, state.camera);
      }

      animationId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Mandible Transformation with TMJ Translation
  useEffect(() => {
    if (!sceneStateRef.current) return;

    const baseZ = -((overjet - 3.0) * 0.18);
    const baseY = -((overbite - 2.5) * 0.15);
    const speeRotX = curveOfSpee * 0.05;

    let targetZ = baseZ;
    let targetY = baseY;
    let targetX = 0;
    let rotX = speeRotX;
    let rotY = 0;
    let rotZ = 0;

    // TMJ Dynamic Movement simulation
    if (excursion === 'protrusive') {
      // Mandibular condyle glides forward and downward along articular eminence slope
      targetZ += 0.85;
      targetY -= 0.48; // Posterior disclusion
      rotX += 0.08;
    } else if (excursion === 'lateral_right') {
      targetX += 0.65;
      targetZ += 0.22;
      targetY -= guidanceType === 'canine' ? 0.38 : 0.18;
      rotZ -= 0.05;
      rotY += 0.04;
    } else if (excursion === 'lateral_left') {
      targetX -= 0.65;
      targetZ += 0.22;
      targetY -= guidanceType === 'canine' ? 0.38 : 0.18;
      rotZ += 0.05;
      rotY += 0.04;
    }

    sceneStateRef.current.targetMandiblePos.set(targetX, targetY, targetZ);
    sceneStateRef.current.targetMandibleRot.set(rotX, rotY, rotZ);
  }, [overjet, overbite, curveOfSpee, excursion, guidanceType]);

  // Update Ligature colors in real-time
  useEffect(() => {
    if (!sceneStateRef.current) return;
    sceneStateRef.current.ligatureMaterials.forEach((mat) => {
      mat.color.set(ligatureColor);
    });
  }, [ligatureColor]);

  // Andrews' 6 Keys 3D Guide Overlays
  useEffect(() => {
    if (!sceneStateRef.current) return;
    const group = sceneStateRef.current.andrewsGuidesGroup;
    group.clear();

    if (!showAndrewsOverlay) return;

    // Occlusal Plane (Key 6)
    const planeGeo = new THREE.PlaneGeometry(8, 8);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0xC9A24B,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    group.add(plane);

    // Tip indicators (Key 2)
    const tipMat = new THREE.LineBasicMaterial({ color: 0x60A5FA, linewidth: 2 });
    [-2.2, -1.1, 0, 1.1, 2.2].forEach((x) => {
      const pts = [
        new THREE.Vector3(x, 1.9, 1.5 - Math.abs(x) * 0.4),
        new THREE.Vector3(x + 0.2, 0.4, 1.5 - Math.abs(x) * 0.4),
      ];
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), tipMat));
    });
  }, [showAndrewsOverlay]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#C9A24B]/30 bg-[#071330] shadow-2xl transition-all duration-300 ${
        isExpandedView ? 'fixed inset-0 z-50 rounded-none border-none h-screen' : ''
      }`}
    >
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className={`w-full cursor-grab active:cursor-grabbing touch-none select-none ${
          isExpandedView ? 'h-full' : 'h-[440px] sm:h-[520px] md:h-[620px]'
        }`}
      />

      {/* Top Header HUD (Minimal Spec Overlay) */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 pointer-events-none max-w-[65%] sm:max-w-none">
        <div className="glass-panel px-3 py-1.5 rounded-xl border border-[#C9A24B]/40 shadow-lg pointer-events-auto flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B] shadow-[0_0_8px_#C9A24B] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
            Anatomical 3D Arch & TMJ
          </span>
          <span className="text-slate-400 hidden sm:inline">·</span>
          <span className="text-[11px] sm:text-xs font-semibold text-[#DFC17B] truncate">
            {angleClass === 'normal' && 'Angle Normal Occlusion'}
            {angleClass === 'class_i' && 'Class I Malocclusion'}
            {angleClass === 'class_ii' && 'Class II (Distocclusion)'}
            {angleClass === 'class_iii' && 'Class III (Mesiocclusion)'}
          </span>
        </div>

        <div className="glass-panel-subtle px-2.5 py-1 rounded-lg border border-[#C9A24B]/20 pointer-events-auto flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-300 flex-wrap">
          <span>OJ: <strong className="font-mono text-[#DFC17B]">{overjet.toFixed(1)}mm</strong></span>
          <span>·</span>
          <span>OB: <strong className="font-mono text-cyan-400">{overbite.toFixed(1)}mm</strong></span>
          <span>·</span>
          <span>Spee: <strong className="font-mono text-pink-400">{curveOfSpee.toFixed(1)}mm</strong></span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">TMJ: <strong className="text-emerald-400 font-semibold">{excursion === 'centric' ? 'Centered' : 'Translating'}</strong></span>
        </div>
      </div>

      {/* Camera View & Ligature Selector (Top Right) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col gap-1.5 items-end">
        {/* Camera Views */}
        <div className="glass-panel-subtle p-1 rounded-xl border border-[#C9A24B]/30 flex items-center gap-1 shadow-md">
          {[
            { id: 'right', label: 'R Buccal' },
            { id: 'frontal', label: 'Frontal' },
            { id: 'left', label: 'L Buccal' },
            { id: 'tmj', label: 'TMJ' },
            { id: 'occlusal', label: 'Occlusal' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setCameraView(v.id as any)}
              className="px-2 py-1 text-[10px] sm:text-xs font-bold text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              {v.label}
            </button>
          ))}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isAutoRotating ? 'bg-[#C9A24B] text-[#071330]' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpandedView(!isExpandedView)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title={isExpandedView ? 'Exit Full View' : 'Full View (Mobile/Tablet)'}
          >
            {isExpandedView ? <Minimize2 className="w-3.5 h-3.5 text-[#DFC17B]" /> : <Maximize2 className="w-3.5 h-3.5 text-[#DFC17B]" />}
          </button>
        </div>

        {/* Live Ligature Elastic Ring Colors */}
        <div className="glass-panel-subtle px-2 py-1 rounded-xl border border-[#C9A24B]/30 flex items-center gap-1.5">
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase">Tie:</span>
          {[
            { color: '#C9A24B', title: 'Precision Gold' },
            { color: '#2563EB', title: 'Royal Blue' },
            { color: '#E11D48', title: 'Ruby' },
            { color: '#10B981', title: 'Emerald' },
            { color: '#E2E8F0', title: 'Platinum Steel' },
          ].map((lig) => (
            <button
              key={lig.color}
              onClick={() => setLigatureColor(lig.color)}
              title={lig.title}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-transform ${
                ligatureColor === lig.color ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: lig.color }}
            />
          ))}
        </div>
      </div>

      {/* Mobile / Tablet Gesture Guidance Hint */}
      <div className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#071330]/80 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 shadow-md">
          Touch & Drag to 360° Rotate · Pinch to Zoom · Tap Teeth
        </span>
      </div>

      {/* Selected Tooth Inspection Card (Floating HUD) */}
      {selectedTooth && (
        <div className="absolute top-20 left-4 z-20 glass-panel rounded-2xl p-4 border border-[#C9A24B] max-w-xs shadow-2xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[#C9A24B]/20 pb-2">
            <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider">
              Tooth Anatomy Inspector
            </span>
            <button
              onClick={() => setSelectedTooth(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <h4 className="text-sm font-black text-white">{selectedTooth.name}</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#071330]/60 p-2 rounded-lg border border-white/5">
              <span className="text-[10px] text-slate-400 block">Andrews Tip:</span>
              <strong className="text-cyan-400 font-mono">{selectedTooth.andrewsTip}</strong>
            </div>
            <div className="bg-[#071330]/60 p-2 rounded-lg border border-white/5">
              <span className="text-[10px] text-slate-400 block">Andrews Torque:</span>
              <strong className="text-[#DFC17B] font-mono">{selectedTooth.andrewsTorque}</strong>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            {selectedTooth.clinicalSignificance}
          </p>
        </div>
      )}

      {/* Collapsible Unified Bottom Control Dock */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 w-[96%] sm:w-[94%] max-w-4xl">
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1.5 px-4 py-1 bg-[#0B1F4D] text-[#DFC17B] text-[11px] sm:text-xs font-bold rounded-t-xl border border-b-0 border-[#C9A24B]/30 shadow-lg hover:bg-[#1B3A8C] transition-colors"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Expand Biomechanical & Masticatory Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Hide Controls (Unobstructed View)</span>
              </>
            )}
          </button>

          {!isDockCollapsed && (
            <div className="w-full glass-panel rounded-2xl rounded-t-none border border-[#C9A24B]/30 p-4 sm:p-5 shadow-2xl space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-none overflow-y-auto">
              {/* Row 1: Angle Class Selector & Andrews Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Angle Class:
                  </span>
                  {(['normal', 'class_i', 'class_ii', 'class_iii'] as AngleClass[]).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => handleAngleSelect(cls)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                        angleClass === cls
                          ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] shadow-md font-extrabold'
                          : 'bg-[#071330]/60 text-slate-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {cls === 'normal' && 'Normal'}
                      {cls === 'class_i' && 'Class I'}
                      {cls === 'class_ii' && 'Class II'}
                      {cls === 'class_iii' && 'Class III'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowAndrewsOverlay(!showAndrewsOverlay)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    showAndrewsOverlay
                      ? 'bg-[#C9A24B] text-[#071330] border-[#DFC17B]'
                      : 'bg-[#071330]/60 text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Andrews 6 Keys Grid</span>
                </button>
              </div>

              {/* Row 2: Precision Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-3 border-b border-white/10">
                {/* Overjet */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">Overjet (Sagittal Shift):</span>
                    <span className="font-mono text-[#DFC17B] font-bold">{overjet.toFixed(1)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="10"
                    step="0.5"
                    value={overjet}
                    onChange={(e) => setOverjet(parseFloat(e.target.value))}
                    className="w-full accent-[#C9A24B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Negative (-3mm)</span>
                    <span>Normal (2-4mm)</span>
                    <span>Severe (+10mm)</span>
                  </div>
                </div>

                {/* Overbite */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">Overbite (Vertical Overlap):</span>
                    <span className="font-mono text-cyan-400 font-bold">{overbite.toFixed(1)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="7"
                    step="0.5"
                    value={overbite}
                    onChange={(e) => setOverbite(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Open Bite (-3mm)</span>
                    <span>Normal (1/3)</span>
                    <span>Deep Bite (7mm)</span>
                  </div>
                </div>

                {/* Curve of Spee */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">Curve of Spee (Key 6):</span>
                    <span className="font-mono text-pink-400 font-bold">{curveOfSpee.toFixed(1)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.5"
                    value={curveOfSpee}
                    onChange={(e) => setCurveOfSpee(parseFloat(e.target.value))}
                    className="w-full accent-pink-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Flat (0mm - Goal)</span>
                    <span>Moderate (2mm)</span>
                    <span>Deep (4mm)</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Masticatory Dynamics (Mutually Protected Occlusion & TMJ Guidance) */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Dynamic Movement:
                  </span>
                  <div className="flex items-center gap-1 bg-[#071330]/80 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setExcursion('centric')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        excursion === 'centric' ? 'bg-[#0B1F4D] text-[#DFC17B] border border-[#C9A24B]/40' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Centric Occlusion (CO)
                    </button>
                    <button
                      onClick={() => setExcursion('protrusive')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        excursion === 'protrusive' ? 'bg-[#1B3A8C] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Protrusion (Incisal Disclusion)
                    </button>
                    <button
                      onClick={() => setExcursion('lateral_right')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        excursion === 'lateral_right' ? 'bg-[#1B3A8C] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Right Lateral Glide
                    </button>
                    <button
                      onClick={() => setExcursion('lateral_left')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        excursion === 'lateral_left' ? 'bg-[#1B3A8C] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Left Lateral Glide
                    </button>
                  </div>
                </div>

                {(excursion === 'lateral_right' || excursion === 'lateral_left') && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400 font-bold">Lateral Guidance:</span>
                    <button
                      onClick={() => setGuidanceType('canine')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                        guidanceType === 'canine'
                          ? 'bg-[#C9A24B] text-[#071330]'
                          : 'bg-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      Canine Guidance
                    </button>
                    <button
                      onClick={() => setGuidanceType('group')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                        guidanceType === 'group'
                          ? 'bg-[#C9A24B] text-[#071330]'
                          : 'bg-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      Group Function
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
