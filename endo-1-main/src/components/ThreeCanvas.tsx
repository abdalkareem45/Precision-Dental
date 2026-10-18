import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AnatomicalLayer, ClinicalTestType, VisualTheme, ViewMode } from '../types/endodontics';
import {
  RotateCcw,
  Eye,
  Maximize2,
  Minimize2,
  Navigation,
  Compass,
  Layers,
  Sparkles,
  Camera,
  Play,
  Pause,
} from 'lucide-react';

interface ThreeCanvasProps {
  layers: AnatomicalLayer[];
  visualTheme: VisualTheme;
  viewMode: ViewMode;
  clipOffset: number;
  clipAxis: 'x' | 'y' | 'z';
  explodedFactor: number;
  activeTest: ClinicalTestType | null;
  testExecuting: boolean;
  onSelectHotspot: (hotspotId: string) => void;
  selectedHotspot: string | null;
  hasSinusTract: boolean;
  hasApicalLesion: boolean;
  hasCrackLine: boolean;
  isCementoma: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  layers,
  visualTheme,
  viewMode,
  clipOffset,
  clipAxis,
  explodedFactor,
  activeTest,
  testExecuting,
  onSelectHotspot,
  selectedHotspot,
  hasSinusTract,
  hasApicalLesion,
  hasCrackLine,
  isCementoma,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Group references for dynamic updates
  const toothRootGroupRef = useRef<THREE.Group | null>(null);
  const layersMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const instrumentGroupRef = useRef<THREE.Group | null>(null);
  const clipPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(-1, 0, 0), 10));

  // Active test, execution state & visual theme refs to read synchronously in the 60fps animation loop
  const activeTestRef = useRef<ClinicalTestType | null>(activeTest);
  const testExecutingRef = useRef<boolean>(testExecuting);
  const visualThemeRef = useRef<VisualTheme>(visualTheme);

  useEffect(() => {
    activeTestRef.current = activeTest;
    testExecutingRef.current = testExecuting;
    visualThemeRef.current = visualTheme;
  }, [activeTest, testExecuting, visualTheme]);

  // Walkthrough navigation state
  const isInsideWalkthrough = useRef<boolean>(false);
  const walkthroughProgress = useRef<number>(0);
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);
  const [hudStatus, setHudStatus] = useState<string>('Standard Architectural Orbit');

  // Camera presets
  const setCameraPreset = useCallback((preset: 'overview' | 'crown' | 'pulp' | 'apex' | 'lingual') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    switch (preset) {
      case 'overview':
        camera.position.set(0, 2, 9);
        controls.target.set(0, 0, 0);
        break;
      case 'crown':
        camera.position.set(0, 4.5, 4.5);
        controls.target.set(0, 2.5, 0);
        break;
      case 'pulp':
        camera.position.set(0, 1.2, 3.8);
        controls.target.set(0, 0.8, 0);
        break;
      case 'apex':
        camera.position.set(0, -3.8, 4.2);
        controls.target.set(0, -2.8, 0);
        break;
      case 'lingual':
        camera.position.set(0, 2, -9);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  }, []);

  // Initialize Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2, 9);
    cameraRef.current = camera;

    // WebGL Renderer with local clipping enabled
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 0.5;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainKeyLight.position.set(6, 10, 8);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-6, -2, -6);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xec4899, 0.5);
    fillLight.position.set(0, -6, 6);
    scene.add(fillLight);

    // Grid Floor / Blueprint Plane
    const gridHelper = new THREE.GridHelper(16, 32, 0x0284c7, 0x1e293b);
    gridHelper.position.y = -4.5;
    gridHelper.name = 'gridFloor';
    scene.add(gridHelper);

    // Architectural Axis Ticks
    const axesGroup = new THREE.Group();
    axesGroup.name = 'architecturalAxes';
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 });
    const xPoints = [new THREE.Vector3(-6, -4.48, 0), new THREE.Vector3(6, -4.48, 0)];
    const zPoints = [new THREE.Vector3(0, -4.48, -6), new THREE.Vector3(0, -4.48, 6)];
    const xGeo = new THREE.BufferGeometry().setFromPoints(xPoints);
    const zGeo = new THREE.BufferGeometry().setFromPoints(zPoints);
    axesGroup.add(new THREE.Line(xGeo, axisMaterial));
    axesGroup.add(new THREE.Line(zGeo, axisMaterial));
    scene.add(axesGroup);

    // Main Tooth Model Group
    const toothRootGroup = new THREE.Group();
    toothRootGroup.name = 'toothRootGroup';
    scene.add(toothRootGroup);
    toothRootGroupRef.current = toothRootGroup;

    // Instrument Group
    const instrumentGroup = new THREE.Group();
    instrumentGroup.name = 'instrumentGroup';
    scene.add(instrumentGroup);
    instrumentGroupRef.current = instrumentGroup;

    // BUILD PROCEDURAL ANATOMICAL TOOTH MODEL
    buildToothModel(toothRootGroup, clipPlaneRef.current);

    // Raycaster for hotspot inspection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(toothRootGroup.children, true);

      if (intersects.length > 0) {
        // Find named parent or hotspot
        let current: THREE.Object3D | null = intersects[0].object;
        while (current && current !== toothRootGroup) {
          if (current.userData && current.userData.layerId) {
            onSelectHotspot(current.userData.layerId);
            break;
          }
          current = current.parent;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Animation Loop
    const clock = new THREE.Timer();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      clock.update();
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsed();

      // Smooth controls update
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Micro-walkthrough inside the root canal / pulp chamber
      if (viewMode === 'walkthrough' && isInsideWalkthrough.current) {
        // Animate camera descending through coronal pulp horn down the canal
        walkthroughProgress.current = (walkthroughProgress.current + delta * 0.15) % 1;
        const p = walkthroughProgress.current;

        // Path curve: From pulp horn (top) down to apical foramen
        const tY = 2.4 - p * 5.0; // from y=2.4 to y=-2.6
        const tX = Math.sin(p * Math.PI * 2) * 0.15;
        const tZ = Math.cos(p * Math.PI) * 0.1;

        if (cameraRef.current && controlsRef.current) {
          cameraRef.current.position.set(tX, tY + 0.1, tZ + 0.2);
          controlsRef.current.target.set(tX, tY - 0.4, tZ);
        }
      }

      // DYNAMIC VISUAL FEEDBACK ANIMATIONS FOR CLINICAL TESTS
      const currentActiveTest = activeTestRef.current;
      const isTestActive = testExecutingRef.current;
      const toothRoot = toothRootGroupRef.current;

      // 1. STRUCTURAL MECHANICAL VIBRATION (Percussion & Mobility)
      if (toothRoot) {
        if (isTestActive && currentActiveTest === 'percussion_vertical') {
          // Vertical resonance shockwave timed with the tapping strike
          const period = (elapsedTime * 3.1) % 1.0;
          const vibEnvelope = period < 0.35 ? Math.sin(period * (Math.PI / 0.35)) * Math.sin(elapsedTime * 75) * 0.045 : 0;
          toothRoot.position.y = vibEnvelope;
        } else if (isTestActive && (currentActiveTest === 'percussion_horizontal' || currentActiveTest === 'mobility')) {
          // Lateral resonance displacement
          const period = (elapsedTime * 3.1) % 1.0;
          const vibEnvelope = period < 0.38 ? Math.sin(period * (Math.PI / 0.38)) * Math.sin(elapsedTime * 65) * 0.055 : 0;
          toothRoot.position.x = vibEnvelope;
        } else {
          // Smooth return to rest when disengaged
          toothRoot.position.y = THREE.MathUtils.lerp(toothRoot.position.y, 0, 0.2);
          toothRoot.position.x = THREE.MathUtils.lerp(toothRoot.position.x, 0, 0.2);
        }
      }

      // 2. THERMAL, OPTICAL & NEURAL GLOW ANIMATIONS
      const pulpMesh = layersMeshesRef.current.get('pulp');
      const nerveMesh = layersMeshesRef.current.get('adelta_fibers');
      const cFiberMesh = layersMeshesRef.current.get('c_fibers');
      const enamelMesh = layersMeshesRef.current.get('enamel');
      const pdlMesh = layersMeshesRef.current.get('pdl');
      const crackMesh = layersMeshesRef.current.get('crack_line');
      const gpMesh = layersMeshesRef.current.get('gutta_percha_tracer');

      if (isTestActive && currentActiveTest === 'heat') {
        // Thermal Heat: Warm pulsating crimson-orange radiation in pulp, C-fibers & crown
        const heatPulse = 0.75 + Math.sin(elapsedTime * 8) * 0.45;
        if (pulpMesh) {
          pulpMesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.setHex(0xe11d48);
              child.material.emissiveIntensity = heatPulse;
            }
          });
        }
        if (cFiberMesh) {
          cFiberMesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.setHex(0xff2200);
              child.material.emissiveIntensity = 1.3 + Math.sin(elapsedTime * 12) * 0.6;
            }
          });
        }
        if (enamelMesh) {
          enamelMesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.setHex(0xf97316);
              child.material.emissiveIntensity = 0.35 + Math.sin(elapsedTime * 6) * 0.15;
            }
          });
        }
      } else if (isTestActive && currentActiveTest === 'cold') {
        // Cold Vitality: Frosty cyan cryogenic glow on crown & rapid firing Aδ fibers
        const coldGlow = 0.5 + Math.sin(elapsedTime * 8) * 0.25;
        if (enamelMesh) {
          enamelMesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.setHex(0x38bdf8);
              child.material.emissiveIntensity = coldGlow;
            }
          });
        }
        if (nerveMesh) {
          nerveMesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.setHex(0x00f0ff);
              child.material.emissiveIntensity = 1.6 + Math.sin(elapsedTime * 22) * 0.7; // rapid hydrodynamic firing
            }
          });
        }
      } else if (isTestActive && currentActiveTest === 'ept') {
        // Electric Pulp Testing: High-frequency electrical spark flashes on Aδ plexus
        const isSpike = (Math.sin(elapsedTime * 26) > 0.35);
        if (nerveMesh) {
          nerveMesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.setHex(0xfacc15);
              child.material.emissiveIntensity = isSpike ? 2.3 : 0.4;
            }
          });
        }
      } else if (isTestActive && (currentActiveTest === 'percussion_vertical' || currentActiveTest === 'percussion_horizontal')) {
        // Percussion: Mechanoreceptive firing pulse in Periodontal Ligament (PDL)
        const pdlPulse = 0.3 + Math.sin(elapsedTime * 14) * 0.45;
        if (pdlMesh) {
          pdlMesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.setHex(0xa855f7);
              child.material.emissiveIntensity = Math.max(0.25, pdlPulse);
            }
          });
        }
      } else if (isTestActive && currentActiveTest === 'transillumination') {
        // Transillumination: High-intensity subsurface illumination through crown & glowing fracture plane
        if (enamelMesh) {
          enamelMesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.setHex(0xfef08a);
              child.material.emissiveIntensity = 0.9 + Math.sin(elapsedTime * 4) * 0.2;
            }
          });
        }
        if (crackMesh) {
          crackMesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.setHex(0x06b6d4);
              child.material.emissiveIntensity = 2.2;
            }
          });
        }
      } else if (isTestActive && currentActiveTest === 'sinus_tracing') {
        // GP Sinus Tracing: Glowing pulse traveling down gutta-percha cone to root apex
        if (gpMesh) {
          gpMesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.setHex(0xf97316);
              child.material.emissiveIntensity = 1.1 + Math.sin(elapsedTime * 9) * 0.6;
            }
          });
        }
      } else {
        // Idle Standby State
        if (visualThemeRef.current === 'radiograph') {
          if (pulpMesh) {
            pulpMesh.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.emissive.setHex(0x020617);
                child.material.emissiveIntensity = 0.05;
              }
            });
          }
        } else {
          // Baseline subtle biological heartbeat on pulp and calm nerve glow
          if (pulpMesh) {
            const pulse = 1 + Math.sin(elapsedTime * 3) * 0.015;
            pulpMesh.scale.set(pulse, 1, pulse);
            pulpMesh.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.emissive.setHex(0x9f1239);
                child.material.emissiveIntensity = 0.4;
              }
            });
          }
          if (enamelMesh) {
            enamelMesh.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.emissive.setHex(0x000000);
                child.material.emissiveIntensity = 0;
              }
            });
          }
          if (nerveMesh) {
            const glow = 0.8 + Math.sin(elapsedTime * 6) * 0.2;
            nerveMesh.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.emissive.setHex(0x0284c7);
                child.material.emissiveIntensity = glow;
              }
            });
          }
          if (cFiberMesh) {
            cFiberMesh.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.emissive.setHex(0xb91c1c);
                child.material.emissiveIntensity = 0.7;
              }
            });
          }
        }
      }

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // BUILD THE 3D TOOTH ARCHITECTURE
  const buildToothModel = (group: THREE.Group, clipPlane: THREE.Plane) => {
    layersMeshesRef.current.clear();

    // 1. ENAMEL ARCHITECTURAL CROWN SHELL
    // High-resolution contoured molar/premolar crown
    const enamelGroup = new THREE.Group();
    enamelGroup.name = 'layer_enamel';
    enamelGroup.userData = { layerId: 'enamel', title: 'Enamel Shell' };

    const crownGeometry = new THREE.CylinderGeometry(1.65, 1.35, 2.4, 32, 16, false);
    // Sculpt crown cusps
    const pos = crownGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const z = pos.getZ(i);

      if (y > 0.6) {
        // Create 2 distinct cusps (buccal & lingual cusp tips)
        const cuspFactor = Math.sin(x * 1.8) * Math.cos(z * 1.8) * 0.45;
        pos.setY(i, y + cuspFactor);
      } else if (y < -0.8) {
        // Cervical constriction at Cemento-Enamel Junction (CEJ)
        const angle = Math.atan2(z, x);
        const cejCurvature = Math.sin(angle * 2) * 0.15;
        pos.setY(i, y + cejCurvature);
        pos.setX(i, x * 0.88);
        pos.setZ(i, z * 0.88);
      }
    }
    crownGeometry.computeVertexNormals();

    const enamelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      transmission: 0.35,
      opacity: 0.85,
      transparent: true,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      clippingPlanes: [clipPlane],
      clipShadows: true,
      side: THREE.DoubleSide,
    });

    const enamelMesh = new THREE.Mesh(crownGeometry, enamelMaterial);
    enamelMesh.position.y = 1.9;
    enamelMesh.castShadow = true;
    enamelMesh.receiveShadow = true;
    enamelMesh.userData = { layerId: 'enamel' };
    enamelGroup.add(enamelMesh);

    // Enamel Wireframe Edge Blueprint
    const enamelEdges = new THREE.EdgesGeometry(crownGeometry, 22);
    const enamelLineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      clippingPlanes: [clipPlane],
    });
    const enamelLines = new THREE.LineSegments(enamelEdges, enamelLineMaterial);
    enamelLines.position.y = 1.9;
    enamelGroup.add(enamelLines);

    group.add(enamelGroup);
    layersMeshesRef.current.set('enamel', enamelGroup);

    // 2. DENTIN INTERNAL CORONAL & RADICULAR SHELL
    const dentinGroup = new THREE.Group();
    dentinGroup.name = 'layer_dentin';
    dentinGroup.userData = { layerId: 'dentin', title: 'Dentin Matrix' };

    // Coronal Dentin
    const coronalDentinGeo = new THREE.CylinderGeometry(1.4, 1.15, 2.1, 28, 12);
    const coronalDentinMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.45,
      metalness: 0.05,
      clippingPlanes: [clipPlane],
      side: THREE.DoubleSide,
    });
    const coronalDentinMesh = new THREE.Mesh(coronalDentinGeo, coronalDentinMat);
    coronalDentinMesh.position.y = 1.8;
    coronalDentinMesh.userData = { layerId: 'dentin' };
    dentinGroup.add(coronalDentinMesh);

    // Radicular Dentin (Two Root Branches - Buccal & Palatal/Lingual)
    const createRootMesh = (xOffset: number, curveDir: number) => {
      const rootPoints: THREE.Vector3[] = [];
      const segments = 24;
      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const ry = 0.8 - t * 3.8; // extends from y=0.8 to y=-3.0
        const rx = xOffset + Math.sin(t * Math.PI * 0.6) * curveDir * 0.45;
        const rz = Math.cos(t * Math.PI * 0.5) * 0.1;
        rootPoints.push(new THREE.Vector3(rx, ry, rz));
      }
      const curve = new THREE.CatmullRomCurve3(rootPoints);
      const rootGeo = new THREE.TubeGeometry(curve, 32, 0.55, 16, false);
      const rootMesh = new THREE.Mesh(rootGeo, coronalDentinMat);
      rootMesh.userData = { layerId: 'dentin' };
      return rootMesh;
    };

    const buccalRootMesh = createRootMesh(0.55, 0.4);
    const lingualRootMesh = createRootMesh(-0.55, -0.4);
    dentinGroup.add(buccalRootMesh);
    dentinGroup.add(lingualRootMesh);

    // Dentin CAD Blueprint Edges
    const dentinEdges = new THREE.EdgesGeometry(coronalDentinGeo, 28);
    const dentinLines = new THREE.LineSegments(
      dentinEdges,
      new THREE.LineBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.4, clippingPlanes: [clipPlane] })
    );
    dentinLines.position.y = 1.8;
    dentinGroup.add(dentinLines);

    group.add(dentinGroup);
    layersMeshesRef.current.set('dentin', dentinGroup);

    // 3. DENTAL PULP CHAMBER & ROOT CANAL ARCHITECTURE
    const pulpGroup = new THREE.Group();
    pulpGroup.name = 'layer_pulp';
    pulpGroup.userData = { layerId: 'pulp', title: 'Dental Pulp Chamber' };

    // Coronal Pulp Chamber with Pulp Horns
    const pulpChamberGeo = new THREE.CylinderGeometry(0.7, 0.55, 1.3, 20, 8);
    // Sculpt pulp horns (mesial and distal horns reaching high toward cusps)
    const pPos = pulpChamberGeo.attributes.position;
    for (let k = 0; k < pPos.count; k++) {
      const py = pPos.getY(k);
      const px = pPos.getX(k);
      if (py > 0.4) {
        pPos.setY(k, py + Math.abs(px) * 0.65);
      }
    }
    pulpChamberGeo.computeVertexNormals();

    const pulpMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0x9f1239,
      emissiveIntensity: 0.4,
      roughness: 0.35,
      clippingPlanes: [clipPlane],
      side: THREE.DoubleSide,
    });

    const pulpChamberMesh = new THREE.Mesh(pulpChamberGeo, pulpMat);
    pulpChamberMesh.position.y = 1.7;
    pulpChamberMesh.userData = { layerId: 'pulp' };
    pulpGroup.add(pulpChamberMesh);

    // Radicular Pulp Canals tapering down to Apical Foramina
    const createPulpCanal = (xOffset: number, curveDir: number) => {
      const canalPoints: THREE.Vector3[] = [];
      const segments = 24;
      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const cy = 1.1 - t * 4.1; // down to y=-3.0
        const cx = xOffset * 0.9 + Math.sin(t * Math.PI * 0.6) * curveDir * 0.42;
        const cz = Math.cos(t * Math.PI * 0.5) * 0.08;
        canalPoints.push(new THREE.Vector3(cx, cy, cz));
      }
      const canalCurve = new THREE.CatmullRomCurve3(canalPoints);
      // Tapers from 0.22 down to 0.08 (apical constriction)
      const canalGeo = new THREE.TubeGeometry(canalCurve, 28, 0.16, 12, false);
      const canalMesh = new THREE.Mesh(canalGeo, pulpMat);
      canalMesh.userData = { layerId: 'pulp' };
      return canalMesh;
    };

    const buccalCanal = createPulpCanal(0.55, 0.4);
    const lingualCanal = createPulpCanal(-0.55, -0.4);
    pulpGroup.add(buccalCanal);
    pulpGroup.add(lingualCanal);

    group.add(pulpGroup);
    layersMeshesRef.current.set('pulp', pulpGroup);

    // 4. NEURAL PLEXUS: A-DELTA (Aδ) FAST SHARP FIBERS & C-FIBERS
    const adeltaGroup = new THREE.Group();
    adeltaGroup.name = 'layer_adelta_fibers';
    adeltaGroup.userData = { layerId: 'adelta_fibers', title: 'A-Delta (Aδ) Sensory Fibers' };

    const cFibersGroup = new THREE.Group();
    cFibersGroup.name = 'layer_c_fibers';
    cFibersGroup.userData = { layerId: 'c_fibers', title: 'C-Fibers (Deep Pulp)' };

    // Generate branching nerve trees
    const adeltaMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      clippingPlanes: [clipPlane],
    });

    const cFiberMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      clippingPlanes: [clipPlane],
    });

    // Peripheral A-delta branches reaching into pulp horns & odontoblast layer
    for (let b = 0; b < 18; b++) {
      const angle = (b / 18) * Math.PI * 2;
      const r = 0.5 + Math.random() * 0.18;
      const by = 1.3 + Math.random() * 0.9;
      const bPoints = [
        new THREE.Vector3(Math.cos(angle) * 0.2, by - 0.3, Math.sin(angle) * 0.2),
        new THREE.Vector3(Math.cos(angle) * r, by, Math.sin(angle) * r),
      ];
      const bCurve = new THREE.CatmullRomCurve3(bPoints);
      const bGeo = new THREE.TubeGeometry(bCurve, 8, 0.025, 6, false);
      const bMesh = new THREE.Mesh(bGeo, adeltaMat);
      adeltaGroup.add(bMesh);
    }

    // Longitudinal deep C-fibers extending from canals to chamber core
    for (let c = 0; c < 8; c++) {
      const offsetC = (c - 4) * 0.12;
      const cPoints = [
        new THREE.Vector3(offsetC, -2.8, 0),
        new THREE.Vector3(offsetC * 0.6, -1.0, 0.05),
        new THREE.Vector3(offsetC * 0.4, 0.5, -0.05),
        new THREE.Vector3(offsetC * 0.8, 1.8, 0),
      ];
      const cCurve = new THREE.CatmullRomCurve3(cPoints);
      const cGeo = new THREE.TubeGeometry(cCurve, 16, 0.03, 6, false);
      const cMesh = new THREE.Mesh(cGeo, cFiberMat);
      cFibersGroup.add(cMesh);
    }

    group.add(adeltaGroup);
    group.add(cFibersGroup);
    layersMeshesRef.current.set('adelta_fibers', adeltaGroup);
    layersMeshesRef.current.set('c_fibers', cFibersGroup);

    // 5. PERIODONTAL LIGAMENT (PDL) SUSPENSORY APPARATUS
    const pdlGroup = new THREE.Group();
    pdlGroup.name = 'layer_pdl';
    pdlGroup.userData = { layerId: 'pdl', title: 'Periodontal Ligament (PDL)' };

    const pdlMat = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.2,
      opacity: 0.8,
      transparent: true,
      clippingPlanes: [clipPlane],
      side: THREE.DoubleSide,
    });

    const createPDLMesh = (xOffset: number, curveDir: number) => {
      const pdlPoints: THREE.Vector3[] = [];
      const segments = 24;
      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const ry = 0.75 - t * 3.85;
        const rx = xOffset + Math.sin(t * Math.PI * 0.6) * curveDir * 0.45;
        const rz = Math.cos(t * Math.PI * 0.5) * 0.1;
        pdlPoints.push(new THREE.Vector3(rx, ry, rz));
      }
      const curve = new THREE.CatmullRomCurve3(pdlPoints);
      const pdlGeo = new THREE.TubeGeometry(curve, 32, 0.64, 16, false);
      const pdlMesh = new THREE.Mesh(pdlGeo, pdlMat);
      pdlMesh.userData = { layerId: 'pdl' };
      return pdlMesh;
    };

    pdlGroup.add(createPDLMesh(0.55, 0.4));
    pdlGroup.add(createPDLMesh(-0.55, -0.4));
    group.add(pdlGroup);
    layersMeshesRef.current.set('pdl', pdlGroup);

    // 6. ALVEOLAR BONE & CRIBRIFORM PLATE (LAMINA DURA)
    const boneGroup = new THREE.Group();
    boneGroup.name = 'layer_alveolar_bone';
    boneGroup.userData = { layerId: 'alveolar_bone', title: 'Alveolar Bone Socket' };

    const boneGeo = new THREE.BoxGeometry(4.2, 4.4, 3.2, 12, 12, 12);
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.85,
      metalness: 0.1,
      opacity: 0.65,
      transparent: true,
      clippingPlanes: [clipPlane],
    });
    const boneMesh = new THREE.Mesh(boneGeo, boneMat);
    boneMesh.position.set(0, -1.8, 0);
    boneMesh.userData = { layerId: 'alveolar_bone' };
    boneGroup.add(boneMesh);

    // Alveolar Bone Blueprint Wireframe
    const boneEdges = new THREE.EdgesGeometry(boneGeo, 30);
    const boneLines = new THREE.LineSegments(
      boneEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, clippingPlanes: [clipPlane] })
    );
    boneLines.position.set(0, -1.8, 0);
    boneGroup.add(boneLines);

    group.add(boneGroup);
    layersMeshesRef.current.set('alveolar_bone', boneGroup);

    // 7. PATHOLOGY: PERIAPICAL LESION / CEMENTOMA
    const lesionGroup = new THREE.Group();
    lesionGroup.name = 'layer_periapical_lesion';
    lesionGroup.userData = { layerId: 'periapical_lesion', title: 'Apical Radiolucency' };

    const lesionGeo = new THREE.SphereGeometry(0.75, 16, 16);
    const lesionMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      emissive: 0x475569,
      emissiveIntensity: 0.4,
      roughness: 0.9,
      opacity: 0.85,
      transparent: true,
      clippingPlanes: [clipPlane],
    });
    const lesionMesh = new THREE.Mesh(lesionGeo, lesionMat);
    lesionMesh.position.set(0.95, -3.1, 0);
    lesionMesh.scale.set(1.2, 0.9, 1.0);
    lesionGroup.add(lesionMesh);

    group.add(lesionGroup);
    layersMeshesRef.current.set('periapical_lesion', lesionGroup);

    // 8. PATHOLOGY: SINUS TRACT (FISTULOUS CANAL)
    const sinusGroup = new THREE.Group();
    sinusGroup.name = 'layer_sinus_tract';
    sinusGroup.userData = { layerId: 'sinus_tract', title: 'Sinus Tract' };

    // Curve from apex through alveolar bone to mucosa/chin
    const sinusPoints = [
      new THREE.Vector3(0.95, -3.1, 0),
      new THREE.Vector3(1.4, -2.4, 0.4),
      new THREE.Vector3(1.8, -1.4, 0.8),
      new THREE.Vector3(2.1, -0.6, 1.4), // mucosal or chin stoma
    ];
    const sinusCurve = new THREE.CatmullRomCurve3(sinusPoints);
    const sinusGeo = new THREE.TubeGeometry(sinusCurve, 24, 0.12, 10, false);
    const sinusMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xbe185d,
      emissiveIntensity: 0.6,
      roughness: 0.4,
      clippingPlanes: [clipPlane],
    });
    const sinusMesh = new THREE.Mesh(sinusGeo, sinusMat);
    sinusGroup.add(sinusMesh);

    // Stoma ring
    const stomaGeo = new THREE.TorusGeometry(0.18, 0.05, 8, 16);
    const stomaMesh = new THREE.Mesh(stomaGeo, sinusMat);
    stomaMesh.position.set(2.1, -0.6, 1.4);
    stomaMesh.rotation.y = Math.PI * 0.4;
    sinusGroup.add(stomaMesh);

    group.add(sinusGroup);
    layersMeshesRef.current.set('sinus_tract', sinusGroup);

    // 9. TREATMENT: GUTTA-PERCHA TRACING CONE (#25/#30)
    const gpGroup = new THREE.Group();
    gpGroup.name = 'layer_gutta_percha_tracer';
    gpGroup.userData = { layerId: 'gutta_percha_tracer', title: 'Gutta-Percha Tracer' };

    // Conical tapered endodontic cone threaded inside sinus tract
    const gpPoints = [
      new THREE.Vector3(2.4, -0.4, 1.6), // external handle end
      new THREE.Vector3(2.08, -0.62, 1.38),
      new THREE.Vector3(1.78, -1.42, 0.78),
      new THREE.Vector3(1.38, -2.42, 0.38),
      new THREE.Vector3(0.95, -3.08, 0.02), // terminating right at apex
    ];
    const gpCurve = new THREE.CatmullRomCurve3(gpPoints);
    const gpGeo = new THREE.TubeGeometry(gpCurve, 28, 0.065, 8, false);
    const gpMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xc2410c,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.1,
      clippingPlanes: [clipPlane],
    });
    const gpMesh = new THREE.Mesh(gpGeo, gpMat);
    gpGroup.add(gpMesh);

    group.add(gpGroup);
    layersMeshesRef.current.set('gutta_percha_tracer', gpGroup);

    // 10. PATHOLOGY: CRACK FRACTURE LINE & TRANSILLUMINATION
    const crackGroup = new THREE.Group();
    crackGroup.name = 'layer_crack_line';
    crackGroup.userData = { layerId: 'crack_line', title: 'Fracture Crack Line' };

    const crackPoints = [
      new THREE.Vector3(0.5, 3.1, 0.2),
      new THREE.Vector3(0.65, 2.4, 0.4),
      new THREE.Vector3(0.8, 1.6, 0.6),
      new THREE.Vector3(0.9, 0.8, 0.75), // reaches CEJ
    ];
    const crackCurve = new THREE.CatmullRomCurve3(crackPoints);
    const crackGeo = new THREE.TubeGeometry(crackCurve, 16, 0.04, 6, false);
    const crackMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      clippingPlanes: [clipPlane],
    });
    const crackMesh = new THREE.Mesh(crackGeo, crackMat);
    crackGroup.add(crackMesh);

    group.add(crackGroup);
    layersMeshesRef.current.set('crack_line', crackGroup);
  };

  // Synchronize Layer Visibilities and Opacities
  useEffect(() => {
    layers.forEach((layer) => {
      const mesh = layersMeshesRef.current.get(layer.id);
      if (mesh) {
        mesh.visible = layer.visible;

        mesh.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
            child.material.opacity = layer.opacity;
            child.material.transparent = layer.opacity < 1.0;
            child.material.needsUpdate = true;
          }
        });
      }
    });

    // Handle pathology conditions
    const lesionMesh = layersMeshesRef.current.get('periapical_lesion');
    if (lesionMesh) {
      lesionMesh.visible = hasApicalLesion;
      if (isCementoma) {
        // In cementoma, the lesion is radiolucent but tooth is vital
        lesionMesh.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.color.setHex(0x334155);
            child.material.emissive.setHex(0x1e293b);
          }
        });
      }
    }

    const sinusMesh = layersMeshesRef.current.get('sinus_tract');
    if (sinusMesh) {
      sinusMesh.visible = hasSinusTract;
    }

    const gpMesh = layersMeshesRef.current.get('gutta_percha_tracer');
    if (gpMesh) {
      gpMesh.visible = hasSinusTract && layers.find((l) => l.id === 'gutta_percha_tracer')?.visible !== false;
    }

    const crackMesh = layersMeshesRef.current.get('crack_line');
    if (crackMesh) {
      crackMesh.visible = hasCrackLine;
    }
  }, [layers, hasApicalLesion, hasSinusTract, hasCrackLine, isCementoma]);

  // Synchronize Visual Themes (Blueprint vs Anatomical vs Radiograph vs Hologram)
  useEffect(() => {
    if (!sceneRef.current) return;
    const gridFloor = sceneRef.current.getObjectByName('gridFloor') as THREE.GridHelper | undefined;
    const axes = sceneRef.current.getObjectByName('architecturalAxes') as THREE.Group | undefined;

    if (visualTheme === 'blueprint') {
      if (gridFloor) gridFloor.visible = true;
      if (axes) axes.visible = true;

      layersMeshesRef.current.forEach((obj, key) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            if (key === 'enamel') {
              child.material.color.setHex(0x0ea5e9);
              child.material.wireframe = false;
            } else if (key === 'dentin') {
              child.material.color.setHex(0x0284c7);
            } else if (key === 'pulp') {
              child.material.color.setHex(0xf43f5e);
            }
            child.material.needsUpdate = true;
          }
        });
      });
    } else if (visualTheme === 'radiograph') {
      // Inverted authentic X-ray view
      if (gridFloor) gridFloor.visible = false;
      if (axes) axes.visible = false;

      layersMeshesRef.current.forEach((obj, key) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            if (key === 'enamel') {
              // Enamel is dense radiopaque (white)
              child.material.color.setHex(0xffffff);
              child.material.opacity = 0.95;
            } else if (key === 'dentin') {
              // Dentin is moderately radiopaque (light grey)
              child.material.color.setHex(0xcbd5e1);
              child.material.opacity = 0.9;
            } else if (key === 'pulp') {
              // Pulp chamber is radiolucent (black)
              child.material.color.setHex(0x0f172a);
              child.material.emissive.setHex(0x020617);
              child.material.opacity = 1.0;
            } else if (key === 'gutta_percha_tracer') {
              // Gutta-percha is highly radiopaque (pure bright white)
              child.material.color.setHex(0xffffff);
              child.material.emissive.setHex(0xffffff);
            } else if (key === 'periapical_lesion') {
              // Radiolucent bone loss (dark shadow)
              child.material.color.setHex(0x020617);
              child.material.opacity = 0.95;
            }
            child.material.needsUpdate = true;
          }
        });
      });
    } else if (visualTheme === 'hologram') {
      if (gridFloor) gridFloor.visible = true;
      if (axes) axes.visible = true;

      layersMeshesRef.current.forEach((obj) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.color.setHex(0x06b6d4);
            child.material.emissive.setHex(0x0891b2);
            child.material.emissiveIntensity = 0.8;
            child.material.wireframe = true;
            child.material.needsUpdate = true;
          }
        });
      });
    } else {
      // Anatomical photoreal
      if (gridFloor) gridFloor.visible = true;
      if (axes) axes.visible = false;

      layersMeshesRef.current.forEach((obj, key) => {
        const layerCfg = layers.find((l) => l.id === key);
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.wireframe = false;
            if (layerCfg) {
              child.material.color.set(layerCfg.color);
            }
            child.material.needsUpdate = true;
          }
        });
      });
    }
  }, [visualTheme, layers]);

  // Handle Exploded View Factors
  useEffect(() => {
    const enamel = layersMeshesRef.current.get('enamel');
    const dentin = layersMeshesRef.current.get('dentin');
    const pdl = layersMeshesRef.current.get('pdl');
    const bone = layersMeshesRef.current.get('alveolar_bone');
    const adelta = layersMeshesRef.current.get('adelta_fibers');

    if (enamel) enamel.position.y = 1.9 + explodedFactor * 2.2;
    if (bone) bone.position.x = explodedFactor * 3.0;
    if (pdl) pdl.position.x = explodedFactor * 1.5;
    if (dentin) dentin.position.z = -explodedFactor * 1.8;
    if (adelta) adelta.position.x = -explodedFactor * 1.2;
  }, [explodedFactor]);

  // Handle Cross-Section Clipping Plane
  useEffect(() => {
    if (viewMode === 'cross-section') {
      let normal = new THREE.Vector3(-1, 0, 0);
      if (clipAxis === 'y') normal = new THREE.Vector3(0, -1, 0);
      if (clipAxis === 'z') normal = new THREE.Vector3(0, 0, -1);

      clipPlaneRef.current.set(normal, clipOffset);
      setHudStatus(`Cross-Section Active: ${clipAxis.toUpperCase()}-Axis @ ${clipOffset.toFixed(2)}mm`);
    } else {
      // Deactivate clipping by pushing plane far away
      clipPlaneRef.current.set(new THREE.Vector3(-1, 0, 0), 100);
      setHudStatus(
        viewMode === 'walkthrough'
          ? 'Micro-Pulp Canal Walkthrough (WASD / Orbit)'
          : viewMode === 'exploded'
            ? 'Exploded Architectural Assembly'
            : 'Standard Architectural Orbit'
      );
    }
  }, [viewMode, clipOffset, clipAxis]);

  // Handle Walkthrough Mode switch
  useEffect(() => {
    isInsideWalkthrough.current = viewMode === 'walkthrough';
    if (viewMode === 'walkthrough') {
      walkthroughProgress.current = 0;
      setCameraPreset('crown');
    }
  }, [viewMode, setCameraPreset]);

  // ANIMATE CLINICAL INSTRUMENT IN 3D DURING ACTIVE TEST
  useEffect(() => {
    const instrumentGroup = instrumentGroupRef.current;
    if (!instrumentGroup) return;

    let animationTimer: any = null;

    // Clear previous instrument
    while (instrumentGroup.children.length > 0) {
      instrumentGroup.remove(instrumentGroup.children[0]);
    }

    if (!activeTest || !testExecuting) return;

    // Build specific 3D clinical instrument based on Lecture 1
    if (activeTest === 'percussion_vertical' || activeTest === 'percussion_horizontal') {
      // Mirror Handle for Percussion Test (Fig 3 / Page 5)
      const handleGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.5, 16);
      const mirrorMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.9,
        roughness: 0.1,
      });
      const handleMesh = new THREE.Mesh(handleGeo, mirrorMat);

      if (activeTest === 'percussion_vertical') {
        handleMesh.position.set(0, 5.2, 0);
        handleMesh.rotation.x = 0;

        let tapCount = 0;
        animationTimer = setInterval(() => {
          tapCount++;
          const down = tapCount % 2 === 1;
          handleMesh.position.y = down ? 3.3 : 4.4;
        }, 320);
      } else {
        handleMesh.position.set(3.2, 1.8, 0);
        handleMesh.rotation.z = Math.PI * 0.45;

        let tapCount = 0;
        animationTimer = setInterval(() => {
          tapCount++;
          const inHit = tapCount % 2 === 1;
          handleMesh.position.x = inHit ? 1.8 : 2.8;
        }, 320);
      }
      instrumentGroup.add(handleMesh);
    } else if (activeTest === 'cold') {
      const cottonGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const cottonMat = new THREE.MeshStandardMaterial({
        color: 0xbae6fd,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.6,
        roughness: 0.8,
      });
      const cottonMesh = new THREE.Mesh(cottonGeo, cottonMat);
      cottonMesh.position.set(0, 1.8, 1.55);

      const tweezerGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.0, 8);
      const tweezerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
      const tweezerMesh = new THREE.Mesh(tweezerGeo, tweezerMat);
      tweezerMesh.position.set(0, 2.8, 2.6);
      tweezerMesh.rotation.x = Math.PI * 0.35;

      instrumentGroup.add(cottonMesh);
      instrumentGroup.add(tweezerMesh);
    } else if (activeTest === 'heat') {
      const stickGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.2, 12);
      const stickMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.4,
      });
      const stickMesh = new THREE.Mesh(stickGeo, stickMat);
      stickMesh.position.set(0, 2.5, 2.4);
      stickMesh.rotation.x = Math.PI * 0.3;

      const tipGeo = new THREE.SphereGeometry(0.16, 8, 8);
      const tipMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
      });
      const tipMesh = new THREE.Mesh(tipGeo, tipMat);
      tipMesh.position.set(0, 1.8, 1.5);
      stickMesh.add(tipMesh);

      instrumentGroup.add(stickMesh);
    } else if (activeTest === 'ept') {
      const probeGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.5, 12);
      const probeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85 });
      const probeMesh = new THREE.Mesh(probeGeo, probeMat);
      probeMesh.position.set(0, 2.6, 2.5);
      probeMesh.rotation.x = Math.PI * 0.3;

      const probeTipGeo = new THREE.ConeGeometry(0.08, 0.3, 8);
      const probeTipMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.8 });
      const probeTipMesh = new THREE.Mesh(probeTipGeo, probeTipMat);
      probeTipMesh.position.set(0, 1.8, 1.45);
      probeTipMesh.rotation.x = -Math.PI * 0.5;

      instrumentGroup.add(probeMesh);
      instrumentGroup.add(probeTipMesh);
    } else if (activeTest === 'bite_test') {
      const sloothGeo = new THREE.BoxGeometry(0.4, 0.15, 2.8);
      const sloothMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.2,
        transmission: 0.4,
        transparent: true,
      });
      const sloothMesh = new THREE.Mesh(sloothGeo, sloothMat);
      sloothMesh.position.set(0.65, 3.15, 0.4);
      sloothMesh.rotation.y = Math.PI * 0.15;
      instrumentGroup.add(sloothMesh);
    } else if (activeTest === 'transillumination') {
      const wandGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.5, 16);
      const wandMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
      const wandMesh = new THREE.Mesh(wandGeo, wandMat);
      wandMesh.position.set(1.9, 1.2, 1.2);
      wandMesh.rotation.z = -Math.PI * 0.35;

      const lightBeamGeo = new THREE.ConeGeometry(0.4, 1.2, 12, 1, true);
      const lightBeamMat = new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
      });
      const lightBeam = new THREE.Mesh(lightBeamGeo, lightBeamMat);
      lightBeam.position.set(1.1, 1.0, 0.8);
      lightBeam.rotation.z = Math.PI * 0.5;

      instrumentGroup.add(wandMesh);
      instrumentGroup.add(lightBeam);
    } else if (activeTest === 'mobility') {
      const mirrorMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
      const m1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.0, 16), mirrorMat);
      m1.position.set(2.2, 2.0, 0);
      m1.rotation.z = Math.PI * 0.4;

      const m2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.0, 16), mirrorMat);
      m2.position.set(-2.2, 2.0, 0);
      m2.rotation.z = -Math.PI * 0.4;

      instrumentGroup.add(m1);
      instrumentGroup.add(m2);
    } else if (activeTest === 'palpation') {
      // Palpating index finger over root apex
      const fingerGeo = new THREE.CylinderGeometry(0.28, 0.24, 3.2, 16);
      const fingerMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.5 });
      const fingerMesh = new THREE.Mesh(fingerGeo, fingerMat);
      fingerMesh.position.set(0.95, -2.8, 2.2);
      fingerMesh.rotation.x = Math.PI * 0.45;
      instrumentGroup.add(fingerMesh);
    } else if (activeTest === 'sinus_tracing') {
      // Endodontic pliers with gutta-percha cone insertion
      const plierGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8);
      const plierMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85 });
      const plierMesh = new THREE.Mesh(plierGeo, plierMat);
      plierMesh.position.set(3.2, 0.5, 2.2);
      plierMesh.rotation.z = Math.PI * 0.35;
      instrumentGroup.add(plierMesh);
    } else if (activeTest === 'selective_anesthesia') {
      // Dental aspirating syringe with needle near root apex
      const syringeBarrelGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.8, 12);
      const syringeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
      const syringeMesh = new THREE.Mesh(syringeBarrelGeo, syringeMat);
      syringeMesh.position.set(2.2, -2.2, 1.8);
      syringeMesh.rotation.z = Math.PI * 0.35;

      const needleGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.4, 6);
      const needleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 });
      const needleMesh = new THREE.Mesh(needleGeo, needleMat);
      needleMesh.position.set(1.4, -2.6, 1.2);
      needleMesh.rotation.z = Math.PI * 0.35;

      instrumentGroup.add(syringeMesh);
      instrumentGroup.add(needleMesh);
    } else if (activeTest === 'cavity') {
      // High-speed handpiece bur contacting occlusal dentin
      const handpieceGeo = new THREE.CylinderGeometry(0.2, 0.2, 3.0, 12);
      const handpieceMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.85 });
      const handpieceMesh = new THREE.Mesh(handpieceGeo, handpieceMat);
      handpieceMesh.position.set(0, 4.2, 1.2);
      handpieceMesh.rotation.x = Math.PI * 0.2;

      const burGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const burMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 });
      const burMesh = new THREE.Mesh(burGeo, burMat);
      burMesh.position.set(0, 3.1, 0);

      instrumentGroup.add(handpieceMesh);
      instrumentGroup.add(burMesh);
    }

    // Unified cleanup function guaranteeing all instruments and timers are disposed
    return () => {
      if (animationTimer) clearInterval(animationTimer);
      if (instrumentGroup) {
        while (instrumentGroup.children.length > 0) {
          instrumentGroup.remove(instrumentGroup.children[0]);
        }
      }
    };
  }, [activeTest, testExecuting]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Blueprint HUD Overlay Top-Left */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1.5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-cyan-400 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{hudStatus}</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800">
          Scale: 1:1 Anatomical Micro-CAD | Real-Time Clip: {clipOffset.toFixed(1)}mm
        </div>
      </div>

      {/* Camera Navigation Presets Top-Right */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-xl">
        <button
          onClick={() => setCameraPreset('overview')}
          aria-label="Reset Orbit View"
          className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
        <button
          onClick={() => setCameraPreset('crown')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
        >
          Crown
        </button>
        <button
          onClick={() => setCameraPreset('pulp')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
        >
          Pulp Horns
        </button>
        <button
          onClick={() => setCameraPreset('apex')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
        >
          Root Apex
        </button>
        <button
          onClick={() => setCameraPreset('lingual')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
        >
          Lingual
        </button>
      </div>

      {/* Selected Hotspot Pill / Floating Info */}
      {selectedHotspot && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-auto bg-slate-900/95 backdrop-blur-lg border border-cyan-500/40 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs max-w-md">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              <span>{layers.find((l) => l.id === selectedHotspot)?.name || selectedHotspot}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Layer Focused
              </span>
            </div>
            <p className="text-slate-400 text-[11px] line-clamp-2 mt-0.5">
              {layers.find((l) => l.id === selectedHotspot)?.description}
            </p>
          </div>
          <button
            onClick={() => onSelectHotspot('')}
            className="text-slate-400 hover:text-slate-200 ml-1 p-1 hover:bg-slate-800 rounded-lg"
          >
            ✕
          </button>
        </div>
      )}

      {/* Active Clinical Test Real-Time Telemetry Badge */}
      {testExecuting && (
        <div className="absolute top-16 left-4 z-10 bg-emerald-950/85 backdrop-blur-md border border-emerald-500/50 p-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-xs">
            <div className="font-bold text-emerald-300 font-mono tracking-wide uppercase">
              3D TOOL ENGAGED: {activeTest?.replace('_', ' ')}
            </div>
            <div className="text-slate-300 text-[11px]">
              Live 3D tool applied • Sensor & neurological telemetry active
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
