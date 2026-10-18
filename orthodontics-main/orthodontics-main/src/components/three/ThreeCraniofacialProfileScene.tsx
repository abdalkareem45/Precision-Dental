/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SkeletalClass } from '../../types/ortho';
import {
  Sliders,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Crosshair,
  Sparkles,
  Layers,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';

interface Landmark3DInfo {
  id: string;
  name: string;
  abbrev: string;
  pos: [number, number, number];
  definition: string;
  clinicalRelevance: string;
  color: string;
  isMandible?: boolean;
}

const LANDMARKS_DATA: Landmark3DInfo[] = [
  {
    id: 'glabella',
    name: 'Glabella',
    abbrev: 'G',
    pos: [2.7, 1.7, 0.8],
    color: '#C9A24B',
    definition: 'Most anterior prominent point in midsagittal plane of the forehead.',
    clinicalRelevance: 'Origin landmark for measuring the Angle of Facial Convexity (G-Sn-Pog).'
  },
  {
    id: 'nasion',
    name: 'Soft Tissue Nasion',
    abbrev: "N'",
    pos: [2.65, 1.4, 0.8],
    color: '#3B82F6',
    definition: 'Deepest depression between the forehead and bridge of the nose in profile.',
    clinicalRelevance: 'Reference point for dropping the Zero Meridian (True Vertical line).'
  },
  {
    id: 'subnasale',
    name: 'Subnasale',
    abbrev: 'Sn',
    pos: [3.1, -0.25, 0.8],
    color: '#10B981',
    definition: 'Junction point where lower border of nasal columella meets upper cutaneous lip.',
    clinicalRelevance: 'Dividing line for upper vs lower facial thirds and nasolabial angle (90°–110°).'
  },
  {
    id: 'pogonion',
    name: 'Soft Tissue Pogonion',
    abbrev: "Pog'",
    pos: [2.8, -2.3, 0.8],
    color: '#F59E0B',
    definition: 'Most anterior point of the soft tissue chin in natural head position.',
    clinicalRelevance: 'Directly reflects skeletal Class I (on line), Class II (behind), or Class III (ahead).',
    isMandible: true
  },
  {
    id: 'menton',
    name: 'Menton',
    abbrev: 'Me',
    pos: [2.6, -3.1, 0.8],
    color: '#EC4899',
    definition: 'Most inferior point on mandibular symphysis contour.',
    clinicalRelevance: 'Defines lower facial third height and mandibular plane slope.',
    isMandible: true
  },
  {
    id: 'porion',
    name: 'Porion',
    abbrev: 'Po',
    pos: [-1.8, 0.5, 1.8],
    color: '#A855F7',
    definition: 'Superior margin of external auditory meatus.',
    clinicalRelevance: 'Posterior landmark forming the Frankfort Horizontal plane with Orbitale.'
  },
  {
    id: 'orbitale',
    name: 'Orbitale',
    abbrev: 'Or',
    pos: [2.3, 0.7, 1.2],
    color: '#06B6D4',
    definition: 'Lowest anatomical point on average infraorbital rim.',
    clinicalRelevance: 'Anterior landmark forming the Frankfort Horizontal plane with Porion.'
  }
];

export const ThreeCraniofacialProfileScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerWrapperRef = useRef<HTMLDivElement>(null);

  // Profile examination parameters
  const [skeletalClass, setSkeletalClass] = useState<SkeletalClass>('class_i');
  const [mandibleShift, setMandibleShift] = useState<number>(0); // mm sagittal shift (-5 to +5)
  const [lowerFaceHeightRatio, setLowerFaceHeightRatio] = useState<number>(1.0); // 0.8 to 1.3
  const [mandibularPlaneAngle, setMandibularPlaneAngle] = useState<number>(27); // deg
  
  // Overlay Guides
  const [showZeroMeridian, setShowZeroMeridian] = useState<boolean>(true);
  const [showRuleOfThirds, setShowRuleOfThirds] = useState<boolean>(true);
  const [showFrankfortMandibularAngle, setShowFrankfortMandibularAngle] = useState<boolean>(true);
  const [showConvexityAngle, setShowConvexityAngle] = useState<boolean>(true);
  const [showLandmarkPins, setShowLandmarkPins] = useState<boolean>(true);
  
  // UI & Camera Controls
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [isExpandedView, setIsExpandedView] = useState<boolean>(false);
  const [activeCameraPreset, setActiveCameraPreset] = useState<'profile' | 'three_quarter' | 'frontal' | 'tmj'>('profile');
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark3DInfo | null>(null);

  const sceneStateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    headGroup: THREE.Group;
    mandiblePart: THREE.Group;
    tmjCondyle: THREE.Mesh;
    guidesGroup: THREE.Group;
    pinsGroup: THREE.Group;
    targetMandiblePos: THREE.Vector3;
    currentMandiblePos: THREE.Vector3;
    targetMandibleRotZ: number;
    currentMandibleRotZ: number;
    pinMeshes: THREE.Mesh[];
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
    animatingCamera: boolean;
    cameraTargetPos: THREE.Vector3;
    controlsTargetPos: THREE.Vector3;
  } | null>(null);

  const handleSkeletalSelect = (cls: SkeletalClass) => {
    setSkeletalClass(cls);
    if (cls === 'class_i') {
      setMandibleShift(0);
      setMandibularPlaneAngle(27);
      setLowerFaceHeightRatio(1.0);
    } else if (cls === 'class_ii') {
      setMandibleShift(-3.5); // Retrognathic
      setMandibularPlaneAngle(35);
      setLowerFaceHeightRatio(1.15);
    } else if (cls === 'class_iii') {
      setMandibleShift(4.0); // Prognathic
      setMandibularPlaneAngle(22);
      setLowerFaceHeightRatio(0.95);
    }
  };

  const applyCameraPreset = (preset: 'profile' | 'three_quarter' | 'frontal' | 'tmj') => {
    setActiveCameraPreset(preset);
    setIsAutoRotating(false);
    if (!sceneStateRef.current) return;
    const { cameraTargetPos, controlsTargetPos } = sceneStateRef.current;

    if (preset === 'profile') {
      cameraTargetPos.set(13.5, 0.4, 0.2);
      controlsTargetPos.set(0, -0.4, 0);
    } else if (preset === 'three_quarter') {
      cameraTargetPos.set(10.5, 2.0, 8.5);
      controlsTargetPos.set(0, -0.4, 0);
    } else if (preset === 'frontal') {
      cameraTargetPos.set(0, 0.4, 13.5);
      controlsTargetPos.set(0, -0.4, 0);
    } else if (preset === 'tmj') {
      cameraTargetPos.set(6.8, 1.6, -4.5);
      controlsTargetPos.set(0.2, 0, -1.8);
    }
    sceneStateRef.current.animatingCamera = true;
  };

  // Landmark select helper
  const handleSelectLandmark = (lm: Landmark3DInfo) => {
    setSelectedLandmark(lm);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 520;

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#071330'); // Ultra-luxury midnight navy

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(13.5, 0.4, 0.2);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.8;
    controls.minDistance = 5;
    controls.maxDistance = 28;
    controls.maxPolarAngle = Math.PI - 0.05;
    controls.target.set(0, -0.4, 0);
    controls.update();

    // Studio Lighting
    const keyLight = new THREE.DirectionalLight('#FFF7EB', 2.4);
    keyLight.position.set(10, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#93C5FD', 1.4);
    fillLight.position.set(-8, 5, -5);
    scene.add(fillLight);

    const goldAccentLight = new THREE.DirectionalLight('#C9A24B', 1.8);
    goldAccentLight.position.set(0, -6, 6);
    scene.add(goldAccentLight);

    const hemiLight = new THREE.HemisphereLight('#0B1F4D', '#071330', 0.9);
    scene.add(hemiLight);

    // Subtle Ground Disc
    const groundGeo = new THREE.CircleGeometry(10, 32);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x030816,
      transparent: true,
      opacity: 0.6,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -4.5;
    scene.add(ground);

    const headGroup = new THREE.Group();
    const mandiblePart = new THREE.Group();
    const guidesGroup = new THREE.Group();
    const pinsGroup = new THREE.Group();
    const pinMeshes: THREE.Mesh[] = [];

    // Craniofacial PBR Materials
    const skinMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E8D2BD'),
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.25,
      clearcoatRoughness: 0.35,
    });

    const craniumBoneMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1E293B'),
      roughness: 0.7,
      metalness: 0.1,
    });

    const condyleMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C9A24B'),
      metalness: 0.6,
      roughness: 0.3,
    });

    // 1. Cranium & Upper Face
    const craniumGeo = new THREE.SphereGeometry(3.6, 32, 24);
    craniumGeo.scale(1.0, 1.15, 0.95);
    const craniumMesh = new THREE.Mesh(craniumGeo, craniumBoneMaterial);
    craniumMesh.position.set(-0.8, 1.2, 0);
    headGroup.add(craniumMesh);

    // Forehead & Glabella
    const foreheadGeo = new THREE.CylinderGeometry(1.4, 1.6, 2.2, 20);
    foreheadGeo.scale(1.2, 1.0, 0.8);
    const foreheadMesh = new THREE.Mesh(foreheadGeo, skinMaterial);
    foreheadMesh.position.set(1.5, 1.8, 0);
    foreheadMesh.rotation.z = -0.2;
    headGroup.add(foreheadMesh);

    // Nose & Subnasale
    const noseGeo = new THREE.ConeGeometry(0.75, 1.9, 16);
    noseGeo.scale(1.0, 1.0, 0.7);
    const noseMesh = new THREE.Mesh(noseGeo, skinMaterial);
    noseMesh.position.set(3.4, 0.35, 0);
    noseMesh.rotation.z = -Math.PI / 3.4;
    headGroup.add(noseMesh);

    // Upper Lip & Maxillary Base
    const upperLipGeo = new THREE.BoxGeometry(0.9, 0.8, 1.4);
    const upperLipMesh = new THREE.Mesh(upperLipGeo, skinMaterial);
    upperLipMesh.position.set(2.65, -0.65, 0);
    upperLipMesh.rotation.z = -0.15;
    headGroup.add(upperLipMesh);

    // Ear & Porion landmark
    const earGeo = new THREE.TorusGeometry(0.5, 0.14, 12, 16, Math.PI * 1.3);
    const earMesh = new THREE.Mesh(earGeo, skinMaterial);
    earMesh.position.set(-1.8, 0.4, 1.7);
    earMesh.rotation.y = -Math.PI / 2;
    headGroup.add(earMesh);

    // 2. Mandible Part (Lower Lip, Pogonion, Menton, and TMJ Condyle)
    const lowerLipGeo = new THREE.BoxGeometry(0.85, 0.75, 1.35);
    const lowerLipMesh = new THREE.Mesh(lowerLipGeo, skinMaterial);
    lowerLipMesh.position.set(2.55, -1.35, 0);
    mandiblePart.add(lowerLipMesh);

    // Chin (Pogonion & Menton)
    const chinGeo = new THREE.SphereGeometry(0.95, 20, 16);
    chinGeo.scale(1.1, 1.0, 0.9);
    const chinMesh = new THREE.Mesh(chinGeo, skinMaterial);
    chinMesh.position.set(2.6, -2.4, 0);
    mandiblePart.add(chinMesh);

    // Mandibular Body
    const jawBodyGeo = new THREE.CylinderGeometry(0.4, 0.5, 3.4, 16);
    jawBodyGeo.scale(1.0, 1.0, 1.2);
    const jawBodyMesh = new THREE.Mesh(jawBodyGeo, skinMaterial);
    jawBodyMesh.position.set(0.6, -2.2, 0);
    jawBodyMesh.rotation.z = Math.PI / 2.3;
    mandiblePart.add(jawBodyMesh);

    // Articulated TMJ Condyle
    const condyleGeo = new THREE.SphereGeometry(0.42, 16, 12);
    const tmjCondyle = new THREE.Mesh(condyleGeo, condyleMaterial);
    tmjCondyle.position.set(-1.6, 0.4, 0);
    mandiblePart.add(tmjCondyle);

    headGroup.add(mandiblePart);
    scene.add(headGroup);
    scene.add(guidesGroup);
    scene.add(pinsGroup);

    // 3. Interactive 3D Landmark Pins
    LANDMARKS_DATA.forEach((lm) => {
      const pinGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const pinColor = new THREE.Color(lm.color);
      const pinMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        emissive: pinColor,
        emissiveIntensity: 0.45,
        roughness: 0.2,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(...lm.pos);
      pinMesh.userData = {
        isPin: true,
        info: lm,
      };
      pinMeshes.push(pinMesh);

      if (lm.isMandible) {
        mandiblePart.add(pinMesh);
      } else {
        headGroup.add(pinMesh);
      }
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    sceneStateRef.current = {
      renderer,
      scene,
      camera,
      controls,
      headGroup,
      mandiblePart,
      tmjCondyle,
      guidesGroup,
      pinsGroup,
      pinMeshes,
      targetMandiblePos: new THREE.Vector3(0, 0, 0),
      currentMandiblePos: new THREE.Vector3(0, 0, 0),
      targetMandibleRotZ: 0,
      currentMandibleRotZ: 0,
      raycaster,
      pointer,
      animatingCamera: false,
      cameraTargetPos: new THREE.Vector3(13.5, 0.4, 0.2),
      controlsTargetPos: new THREE.Vector3(0, -0.4, 0),
    };

    // Click / Tap detection distinguishing drag vs click
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
      // If moved less than 6px, treat as intentional click/tap
      if (dx < 6 && dy < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(pinMeshes, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh;
          if (hit.userData && hit.userData.info) {
            setSelectedLandmark(hit.userData.info as Landmark3DInfo);
          }
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointerup', onPointerUp);

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
        // Preset animation interpolation
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
          state.controls.autoRotateSpeed = 1.6;
          state.controls.update();
        }

        // Mandible motion smoothing
        state.currentMandiblePos.lerp(state.targetMandiblePos, 1 - Math.exp(-8 * delta));
        state.mandiblePart.position.copy(state.currentMandiblePos);

        state.currentMandibleRotZ = THREE.MathUtils.damp(
          state.currentMandibleRotZ,
          state.targetMandibleRotZ,
          8,
          delta
        );
        state.mandiblePart.rotation.z = state.currentMandibleRotZ;

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

  // Update Mandible Transformation Target
  useEffect(() => {
    if (!sceneStateRef.current) return;
    const shiftX = mandibleShift * 0.18;
    const heightY = (1.0 - lowerFaceHeightRatio) * 1.2;
    const rotZ = -((mandibularPlaneAngle - 27) * Math.PI) / 180 * 0.5;

    sceneStateRef.current.targetMandiblePos.set(shiftX, heightY, 0);
    sceneStateRef.current.targetMandibleRotZ = rotZ;
  }, [mandibleShift, lowerFaceHeightRatio, mandibularPlaneAngle]);

  // Guides Recomputation
  useEffect(() => {
    if (!sceneStateRef.current) return;
    const group = sceneStateRef.current.guidesGroup;
    group.clear();

    const createTexturedLine = (pts: THREE.Vector3[], color: number, dashed = false) => {
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = dashed
        ? new THREE.LineDashedMaterial({ color, dashSize: 0.3, gapSize: 0.15, linewidth: 2 })
        : new THREE.LineBasicMaterial({ color, linewidth: 2.5 });
      const line = new THREE.Line(geo, mat);
      if (dashed) line.computeLineDistances();
      return line;
    };

    // 1. Zero Meridian (Nasion vertical)
    if (showZeroMeridian) {
      const nasionX = 2.65;
      const zmLine = createTexturedLine(
        [new THREE.Vector3(nasionX, 4.0, 1.5), new THREE.Vector3(nasionX, -4.5, 1.5)],
        0x3B82F6
      );
      group.add(zmLine);
    }

    // 2. Rule of Thirds
    if (showRuleOfThirds) {
      const levels = [3.2, 1.45, -0.2, -2.8 * lowerFaceHeightRatio];
      levels.forEach((y) => {
        group.add(createTexturedLine([new THREE.Vector3(-3.5, y, 1.6), new THREE.Vector3(4.5, y, 1.6)], 0xC9A24B, true));
      });
    }

    // 3. Frankfort & Mandibular Planes
    if (showFrankfortMandibularAngle) {
      // Frankfort line (Red/Rose)
      group.add(createTexturedLine([new THREE.Vector3(-4.5, 0.1, 1.7), new THREE.Vector3(4.0, 0.8, 1.7)], 0xEF4444));
      // Mandibular line (Cyan)
      const angleRad = (mandibularPlaneAngle * Math.PI) / 180;
      const chinPt = new THREE.Vector3(2.6 + mandibleShift * 0.18, -2.5 * lowerFaceHeightRatio, 1.7);
      group.add(createTexturedLine([
        new THREE.Vector3(-4.5, -2.5 * lowerFaceHeightRatio + 7.1 * Math.tan(angleRad), 1.7),
        chinPt
      ], 0x38BDF8));
    }

    // 4. Convexity Angle
    if (showConvexityAngle) {
      const glabella = new THREE.Vector3(2.6, 1.6, 1.8);
      const subnasale = new THREE.Vector3(2.8, -0.2, 1.8);
      const pogonion = new THREE.Vector3(2.65 + mandibleShift * 0.18, -2.3, 1.8);
      group.add(createTexturedLine([glabella, subnasale], 0x10B981));
      group.add(createTexturedLine([subnasale, pogonion], 0x10B981));
    }
  }, [
    showZeroMeridian,
    showRuleOfThirds,
    showFrankfortMandibularAngle,
    showConvexityAngle,
    mandibleShift,
    lowerFaceHeightRatio,
    mandibularPlaneAngle,
  ]);

  // Synchronize pin visibility
  useEffect(() => {
    if (!sceneStateRef.current) return;
    sceneStateRef.current.pinMeshes.forEach((mesh) => {
      mesh.visible = showLandmarkPins;
    });
  }, [showLandmarkPins]);

  const currentConvexityAngle = Math.round(12 - mandibleShift * 4.5);

  return (
    <div
      ref={containerWrapperRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-[#C9A24B]/30 bg-[#071330] shadow-2xl transition-all duration-300 ${
        isExpandedView ? 'fixed inset-0 z-50 rounded-none border-none h-screen' : ''
      }`}
    >
      {/* 3D Canvas with touch-none for dedicated 3D gestures */}
      <div
        ref={mountRef}
        className={`w-full cursor-grab active:cursor-grabbing touch-none select-none ${
          isExpandedView ? 'h-full' : 'h-[440px] sm:h-[520px] md:h-[620px]'
        }`}
      />

      {/* Top Left: Clinical Specs HUD */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 pointer-events-none max-w-[65%] sm:max-w-none">
        <div className="glass-panel px-3 py-1.5 rounded-xl border border-[#C9A24B]/40 shadow-lg pointer-events-auto flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B] shadow-[0_0_8px_#C9A24B] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
            3D Craniofacial Profile
          </span>
          <span className="text-slate-400 hidden sm:inline">·</span>
          <span className="text-[11px] sm:text-xs font-bold text-[#DFC17B] truncate">
            {skeletalClass === 'class_i' && 'Class I (Orthognathic)'}
            {skeletalClass === 'class_ii' && 'Class II (Convex)'}
            {skeletalClass === 'class_iii' && 'Class III (Concave)'}
          </span>
        </div>

        <div className="glass-panel-subtle px-2.5 py-1 rounded-lg border border-[#C9A24B]/20 pointer-events-auto flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-slate-300">
          <span>Convexity: <strong className="font-mono text-[#DFC17B]">{currentConvexityAngle}°</strong></span>
          <span>·</span>
          <span>Mandibular: <strong className="font-mono text-cyan-400">{mandibularPlaneAngle}°</strong></span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline text-white">
            {mandibularPlaneAngle > 31 ? 'High Angle' : mandibularPlaneAngle < 23 ? 'Low Angle' : 'Normal'}
          </span>
        </div>
      </div>

      {/* Top Right: Camera Presets & Expand / Rotate Controls */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col gap-1.5 items-end">
        <div className="glass-panel-subtle p-1 rounded-xl border border-[#C9A24B]/30 flex items-center gap-1 shadow-md">
          {[
            { id: 'profile', label: 'Lateral' },
            { id: 'three_quarter', label: '45° Semi' },
            { id: 'frontal', label: 'Frontal' },
            { id: 'tmj', label: 'TMJ' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => applyCameraPreset(v.id as any)}
              className={`px-2 py-1 text-[10px] sm:text-[11px] font-bold rounded-lg transition-colors ${
                activeCameraPreset === v.id
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {v.label}
            </button>
          ))}

          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isAutoRotating ? 'bg-[#C9A24B] text-[#071330]' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle 360° Auto-Rotation"
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

        {/* Guides Strip */}
        <div className="hidden sm:flex flex-col gap-1">
          <button
            onClick={() => setShowZeroMeridian(!showZeroMeridian)}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all border ${
              showZeroMeridian ? 'bg-[#1B3A8C] text-white border-blue-400' : 'bg-[#071330]/80 text-slate-400 border-white/10'
            }`}
          >
            Zero Meridian
          </button>
          <button
            onClick={() => setShowRuleOfThirds(!showRuleOfThirds)}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all border ${
              showRuleOfThirds ? 'bg-[#C9A24B] text-[#071330] border-[#DFC17B]' : 'bg-[#071330]/80 text-slate-400 border-white/10'
            }`}
          >
            Rule of Thirds
          </button>
          <button
            onClick={() => setShowFrankfortMandibularAngle(!showFrankfortMandibularAngle)}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all border ${
              showFrankfortMandibularAngle ? 'bg-rose-900/80 text-rose-200 border-rose-500' : 'bg-[#071330]/80 text-slate-400 border-white/10'
            }`}
          >
            Frankfort & Mandibular
          </button>
          <button
            onClick={() => setShowConvexityAngle(!showConvexityAngle)}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all border ${
              showConvexityAngle ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500' : 'bg-[#071330]/80 text-slate-400 border-white/10'
            }`}
          >
            Convexity Angle
          </button>
          <button
            onClick={() => setShowLandmarkPins(!showLandmarkPins)}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all border ${
              showLandmarkPins ? 'bg-amber-900/80 text-amber-200 border-amber-500' : 'bg-[#071330]/80 text-slate-400 border-white/10'
            }`}
          >
            Landmark Pins
          </button>
        </div>
      </div>

      {/* Quick Landmark Inspection Selector Tray (HUD top or middle) */}
      <div className="absolute top-16 left-3 sm:top-20 sm:left-4 z-10 flex flex-wrap gap-1 max-w-[280px] sm:max-w-md pointer-events-none">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-[#071330]/90 px-2 py-0.5 rounded pointer-events-auto">
          Pins:
        </span>
        {LANDMARKS_DATA.map((lm) => {
          const isSelected = selectedLandmark?.id === lm.id;
          return (
            <button
              key={lm.id}
              onClick={() => handleSelectLandmark(lm)}
              className={`pointer-events-auto px-2 py-0.5 text-[10px] font-bold rounded-md transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] border-[#DFC17B] scale-105 shadow-md'
                  : 'bg-[#071330]/80 text-slate-300 hover:text-white border-white/10 hover:border-white/30'
              }`}
            >
              {lm.abbrev}
            </button>
          );
        })}
      </div>

      {/* Selected Landmark Pin Modal Card */}
      {selectedLandmark && (
        <div className="absolute top-28 left-3 sm:top-28 sm:left-4 z-30 glass-panel rounded-2xl p-4 border border-[#C9A24B] max-w-[290px] sm:max-w-xs shadow-2xl space-y-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[#C9A24B]/20 pb-1.5">
            <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider">
              Landmark Pin Inspection
            </span>
            <button
              onClick={() => setSelectedLandmark(null)}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 text-slate-300 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-[#071330] shadow"
              style={{ backgroundColor: selectedLandmark.color }}
            >
              {selectedLandmark.abbrev}
            </span>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{selectedLandmark.name}</h4>
              <span className="text-[9px] text-slate-400">
                {selectedLandmark.isMandible ? 'Mandibular Segment' : 'Craniofacial Segment'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-200 leading-snug">
            <strong className="text-[#DFC17B]">Definition:</strong> {selectedLandmark.definition}
          </p>
          <p className="text-[11px] text-cyan-300 leading-snug">
            <strong className="text-cyan-400">Clinical Role:</strong> {selectedLandmark.clinicalRelevance}
          </p>
        </div>
      )}

      {/* Mobile/Tablet Gesture Hint Floating Banner */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#071330]/80 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 shadow-md">
          Touch & Drag to 360° Rotate · Pinch to Zoom · Tap Pins
        </span>
      </div>

      {/* Bottom Ergonomic Skeletal & Morph Controls Dock */}
      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 w-[96%] max-w-2xl">
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0B1F4D] text-[#DFC17B] text-[11px] sm:text-xs font-bold rounded-t-xl border border-b-0 border-[#C9A24B]/40 shadow-xl hover:bg-[#1B3A8C] transition-colors"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Show Profile & Skeletal Sliders</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Hide Controls (Unobstructed View)</span>
              </>
            )}
          </button>

          {!isDockCollapsed && (
            <div className="w-full glass-panel rounded-2xl rounded-t-none border border-[#C9A24B]/30 p-3 sm:p-4 shadow-2xl space-y-2.5 max-h-[48vh] overflow-y-auto">
              {/* Skeletal Class Selector */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-wrap gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Skeletal Class:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['class_i', 'class_ii', 'class_iii'] as SkeletalClass[]).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => handleSkeletalSelect(cls)}
                      className={`px-2.5 sm:px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        skeletalClass === cls
                          ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] shadow-md font-extrabold'
                          : 'bg-[#071330]/70 text-slate-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {cls === 'class_i' && 'Class I (Orthognathic)'}
                      {cls === 'class_ii' && 'Class II (Convex)'}
                      {cls === 'class_iii' && 'Class III (Concave)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {/* Mandibular Sagittal Shift */}
                <div className="bg-[#071330]/60 p-2 rounded-xl border border-white/5 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-white">Mandible A-P</span>
                    <span className="font-mono text-[#DFC17B] font-bold">
                      {mandibleShift > 0 ? `+${mandibleShift.toFixed(1)}mm` : `${mandibleShift.toFixed(1)}mm`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={mandibleShift}
                    onChange={(e) => setMandibleShift(parseFloat(e.target.value))}
                    className="w-full accent-[#C9A24B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Retrognathic (-5)</span>
                    <span>Prognathic (+5)</span>
                  </div>
                </div>

                {/* Lower Face Height Ratio */}
                <div className="bg-[#071330]/60 p-2 rounded-xl border border-white/5 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-white">Lower 1/3 Height</span>
                    <span className="font-mono text-cyan-400 font-bold">{Math.round(lowerFaceHeightRatio * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={lowerFaceHeightRatio}
                    onChange={(e) => setLowerFaceHeightRatio(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Short Face (80%)</span>
                    <span>Long Face (130%)</span>
                  </div>
                </div>

                {/* Mandibular Plane Angle */}
                <div className="bg-[#071330]/60 p-2 rounded-xl border border-white/5 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-white">Mandibular Plane</span>
                    <span className="font-mono text-pink-400 font-bold">{mandibularPlaneAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="42"
                    step="1"
                    value={mandibularPlaneAngle}
                    onChange={(e) => setMandibularPlaneAngle(parseInt(e.target.value))}
                    className="w-full accent-pink-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Low (&lt;23°)</span>
                    <span>High (&gt;31°)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
