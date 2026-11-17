import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SandboxShell } from '../../common/SandboxShell';
import { ThreeViewport, type CameraPreset, type ThreeSceneContext } from '../../common/ThreeViewport';

type JointCondition = 'stable' | 'instability' | 'high-crown' | 'osteoarthritis';

const PRESETS: CameraPreset[] = [
  { id: 'sagittal', label: 'Sagittal Cutaway', position: [0.4, 1.3, 10.2], target: [0.2, 0.2, 0] },
  { id: 'anterior-oblique', label: '3/4 Clinical View', position: [6.8, 3.2, 8.2], target: [0.2, 0.1, 0] },
  { id: 'posterior-palpation', label: 'Posterior Aspect (Fig 3C)', position: [-7.5, 2.1, -5.8], target: [-0.8, 0.8, 0] },
  { id: 'occlusal', label: 'Occlusal Interference', position: [7.8, 1.4, 3.8], target: [2.2, -1.3, 0] },
];

const CONDITION_INFO: Record<
  JointCondition,
  { label: string; category: string; summary: string }
> = {
  stable: {
    label: 'Orthopedically Stable',
    category: 'Balanced Loading',
    summary:
      'Condyles rest on the articular eminences with the biconcave disc interposed while teeth meet simultaneously in a stable biting position.',
  },
  instability: {
    label: 'Orthopedic Instability + Click',
    category: 'Arthrogenic Microtrauma',
    summary:
      'Stable occlusal biting position does not match stable condylar seating. Continued heavy loading leads to anterior disc displacement with a single opening click.',
  },
  'high-crown': {
    label: 'Acute High Crown',
    category: 'Myogenic Co-Contraction',
    summary:
      'An acute high restoration triggers protective co-contraction of opposing masticatory muscles (temporalis & masseter) to limit tooth/joint damage.',
  },
  osteoarthritis: {
    label: 'Articular Surface Breakdown',
    category: 'Crepitation / Degeneration',
    summary:
      'Chronic overloading causes fibrous connective tissue breakdown and bony surface irregularity, producing gravel-like grating (crepitation).',
  },
};

export function Tmd3DSandbox() {
  const [openingMm, setOpeningMm] = useState(8);
  const [condition, setCondition] = useState<JointCondition>('stable');
  const [showMuscles, setShowMuscles] = useState(true);

  const stateRef = useRef({ openingMm, condition, showMuscles });
  stateRef.current = { openingMm, condition, showMuscles };

  const requestRenderRef = useRef<() => void>(() => {});

  useEffect(() => {
    requestRenderRef.current();
  }, [openingMm, condition, showMuscles]);

  const handleReset = () => {
    setOpeningMm(8);
    setCondition('stable');
    setShowMuscles(true);
  };

  const handleBuildScene = (ctx: ThreeSceneContext) => {
    requestRenderRef.current = ctx.requestRender;

    const root = new THREE.Group();
    ctx.scene.add(root);

    // Materials with calibrated PBR roughness/metalness contrast
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xe9e2d2,
      roughness: 0.68,
      metalness: 0.04,
    });
    const cortexMat = new THREE.MeshStandardMaterial({
      color: 0xd8ceb8,
      roughness: 0.55,
      metalness: 0.06,
    });
    const discMat = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      roughness: 0.28,
      metalness: 0.05,
      clearcoat: 0.65,
      clearcoatRoughness: 0.25,
    });
    const retroMat = new THREE.MeshStandardMaterial({
      color: 0xd94662,
      roughness: 0.52,
      metalness: 0.02,
    });
    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xfaf8f3,
      roughness: 0.16,
      metalness: 0.02,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
    });
    const goldCrownMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9a24b,
      roughness: 0.22,
      metalness: 0.92,
    });
    const muscleMat = new THREE.MeshStandardMaterial({
      color: 0xb93848,
      roughness: 0.62,
      metalness: 0.05,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    });
    const earMeatusMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      metalness: 0,
    });

    // 1. Temporal Bone (Glenoid Fossa + Articular Eminence + Zygomatic Process + Maxilla Base)
    const temporalGroup = new THREE.Group();
    const fossaShape = new THREE.Shape();
    fossaShape.moveTo(-2.6, 2.2);
    fossaShape.lineTo(3.4, 2.2);
    fossaShape.lineTo(3.4, 1.35);
    fossaShape.bezierCurveTo(2.4, 1.3, 1.6, 1.2, 0.7, 0.68); // Articular eminence crest
    fossaShape.bezierCurveTo(0.1, 0.45, -0.4, 1.55, -1.1, 1.55); // Glenoid fossa concavity
    fossaShape.bezierCurveTo(-1.55, 1.55, -1.9, 1.0, -2.6, 0.95); // Postglenoid process & EAM
    fossaShape.closePath();

    const temporalGeo = new THREE.ExtrudeGeometry(fossaShape, {
      depth: 1.5,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.1,
      bevelSegments: 3,
    });
    temporalGeo.center();
    const temporalMesh = new THREE.Mesh(temporalGeo, boneMat);
    temporalMesh.position.set(0.1, 1.65, 0);
    temporalMesh.castShadow = true;
    temporalMesh.receiveShadow = true;
    temporalGroup.add(temporalMesh);

    // External Auditory Meatus landmark ring (posterior to fossa)
    const eamGeo = new THREE.CylinderGeometry(0.32, 0.32, 1.8, 24);
    eamGeo.rotateX(Math.PI / 2);
    const eamMesh = new THREE.Mesh(eamGeo, earMeatusMat);
    eamMesh.position.set(-2.0, 1.35, 0);
    temporalGroup.add(eamMesh);

    // Upper alveolar block + Maxillary molars
    const maxBlockGeo = new THREE.BoxGeometry(2.5, 0.68, 1.35);
    const maxBlockMesh = new THREE.Mesh(maxBlockGeo, cortexMat);
    maxBlockMesh.position.set(2.35, 0.05, 0);
    maxBlockMesh.castShadow = true;
    temporalGroup.add(maxBlockMesh);

    for (let i = 0; i < 3; i++) {
      const toothGroup = new THREE.Group();
      const crownGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.48, 16);
      const crown = new THREE.Mesh(crownGeo, enamelMat);
      crown.castShadow = true;
      toothGroup.add(crown);
      toothGroup.position.set(1.55 + i * 0.72, -0.45, 0);
      temporalGroup.add(toothGroup);
    }

    root.add(temporalGroup);

    // 2. Articular Disc (Biconcave profile) + Retrodiscal Pad
    const discGroup = new THREE.Group();
    const discShape = new THREE.Shape();
    discShape.moveTo(-0.75, 0.06);
    discShape.bezierCurveTo(-0.4, 0.22, -0.1, 0.06, 0.0, 0.05);
    discShape.bezierCurveTo(0.2, 0.06, 0.5, 0.22, 0.78, 0.08);
    discShape.bezierCurveTo(0.84, -0.02, 0.6, -0.15, 0.0, -0.06);
    discShape.bezierCurveTo(-0.45, -0.15, -0.82, -0.02, -0.75, 0.06);
    const discGeo = new THREE.ExtrudeGeometry(discShape, {
      depth: 1.25,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 2,
    });
    discGeo.center();
    const discMesh = new THREE.Mesh(discGeo, discMat);
    discMesh.castShadow = true;
    discGroup.add(discMesh);

    const retroGeo = new THREE.BoxGeometry(0.65, 0.16, 1.0);
    const retroMesh = new THREE.Mesh(retroGeo, retroMat);
    retroMesh.position.set(-0.92, 0.02, 0);
    discGroup.add(retroMesh);
    root.add(discGroup);

    // 3. Mandibular Ramus, Condylar Head, Coronoid Process, Body & Lower Teeth
    const mandiblePivot = new THREE.Group();
    mandiblePivot.position.set(-0.95, 0.72, 0);
    root.add(mandiblePivot);

    const mandShape = new THREE.Shape();
    // Local coords relative to condylar center (0,0)
    mandShape.moveTo(-0.35, 0.1);
    mandShape.bezierCurveTo(-0.32, 0.52, 0.32, 0.52, 0.35, 0.08); // Condylar head
    mandShape.lineTo(0.38, -0.55); // Condylar neck
    mandShape.bezierCurveTo(0.65, -0.75, 0.92, -0.55, 1.12, -0.1); // Mandibular notch -> coronoid
    mandShape.lineTo(1.38, -1.6); // Anterior border of ramus
    mandShape.lineTo(4.2, -1.75); // Alveolar body top
    mandShape.lineTo(4.2, -2.65); // Symphysis base
    mandShape.lineTo(-0.15, -2.55); // Inferior border
    mandShape.bezierCurveTo(-0.62, -2.5, -0.68, -2.0, -0.58, -1.2); // Angle of mandible
    mandShape.closePath();

    const mandGeo = new THREE.ExtrudeGeometry(mandShape, {
      depth: 1.2,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelSegments: 3,
    });
    mandGeo.translate(0, 0, -0.6);
    const mandMesh = new THREE.Mesh(mandGeo, cortexMat);
    mandMesh.castShadow = true;
    mandMesh.receiveShadow = true;
    mandiblePivot.add(mandMesh);

    // Osteoarthritic surface nodules on condylar head (visible in OA mode)
    const oaNodulesGroup = new THREE.Group();
    const noduleGeo = new THREE.DodecahedronGeometry(0.11, 0);
    const noduleMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.85,
      metalness: 0.05,
    });
    const noduleOffsets: [number, number, number][] = [
      [-0.14, 0.42, 0.18],
      [0.12, 0.44, -0.15],
      [0.02, 0.46, 0.25],
      [-0.08, 0.4, -0.26],
    ];
    noduleOffsets.forEach((pos) => {
      const n = new THREE.Mesh(noduleGeo, noduleMat);
      n.position.set(...pos);
      oaNodulesGroup.add(n);
    });
    oaNodulesGroup.visible = false;
    mandiblePivot.add(oaNodulesGroup);

    // Lower molars + Adjustable "High Crown" Restoration on 2nd tooth
    let highCrownMesh: THREE.Mesh | null = null;
    for (let i = 0; i < 3; i++) {
      const isCrownTooth = i === 1;
      const geo = new THREE.CylinderGeometry(0.28, 0.25, 0.48, 16);
      const mesh = new THREE.Mesh(geo, isCrownTooth ? goldCrownMat : enamelMat);
      mesh.position.set(2.5 + i * 0.72, -1.5, 0);
      mesh.castShadow = true;
      mandiblePivot.add(mesh);
      if (isCrownTooth) {
        highCrownMesh = mesh;
      }
    }

    // 4. Masticatory Muscle Bundles (Temporalis & Masseter)
    const muscleGroup = new THREE.Group();
    const masseterGeo = new THREE.CylinderGeometry(0.32, 0.42, 2.25, 16);
    const masseterMesh = new THREE.Mesh(masseterGeo, muscleMat);
    masseterMesh.position.set(0.45, -1.25, 0.74);
    masseterMesh.rotation.z = 0.26;
    muscleGroup.add(masseterMesh);

    const temporalisGeo = new THREE.ConeGeometry(0.85, 2.1, 16);
    const temporalisMesh = new THREE.Mesh(temporalisGeo, muscleMat);
    temporalisMesh.position.set(1.05, 1.35, 0.68);
    temporalisMesh.rotation.z = Math.PI - 0.12;
    muscleGroup.add(temporalisMesh);

    mandiblePivot.add(muscleGroup);

    // 5. Visual Click Ring Indicator (pops when disc reduces on opening in instability mode)
    const clickRingGeo = new THREE.TorusGeometry(0.65, 0.045, 12, 32);
    const clickRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0,
    });
    const clickRing = new THREE.Mesh(clickRingGeo, clickRingMat);
    clickRing.position.set(-0.2, 1.3, 0.85);
    root.add(clickRing);

    // Smooth animated state
    let currentOpen = stateRef.current.openingMm;
    let currentDiscOffset = 0;
    let currentCrownScale = 1;

    return {
      update: (delta: number, elapsed: number) => {
        const { openingMm: targetOpen, condition: cond, showMuscles: showM } = stateRef.current;

        const lerpFactor = ctx.isSoftwareGl || ctx.prefersReducedMotion ? 1 : 1 - Math.exp(-10 * delta);
        currentOpen = THREE.MathUtils.lerp(currentOpen, targetOpen, lerpFactor);

        // First ~15mm is pure hinge rotation; >15mm adds anterior translation along articular eminence
        const t = currentOpen / 45;
        const rotationRad = -t * 0.48;
        const translateX = Math.max(0, (currentOpen - 10) / 35) * 1.45;
        const translateY = -Math.max(0, (currentOpen - 10) / 35) * 0.55;

        // Orthopedic instability shifts closed condylar seating slightly posterior/superior
        const instabOffsetX = cond === 'instability' && currentOpen < 16 ? -0.22 : 0;
        const crownStop = cond === 'high-crown' && currentOpen < 6 ? -0.06 : 0;

        mandiblePivot.position.set(
          -0.95 + translateX + instabOffsetX,
          0.72 + translateY + crownStop,
          0
        );
        mandiblePivot.rotation.z = rotationRad;

        // Disc tracking vs Anterior Disc Displacement with Reduction (click around 18mm)
        let targetDiscFwd = 0;
        if (cond === 'instability' && currentOpen < 18) {
          targetDiscFwd = 0.62; // Displaced anteriorly when closed
        }
        currentDiscOffset = THREE.MathUtils.lerp(currentDiscOffset, targetDiscFwd, lerpFactor);

        discGroup.position.set(
          -0.95 + translateX + currentDiscOffset,
          1.22 + translateY * 0.9 - currentDiscOffset * 0.35,
          0
        );
        discGroup.rotation.z = -0.24 - currentDiscOffset * 0.3 + rotationRad * 0.25;

        // Click ring visibility right near reduction zone (16-22mm in instability mode)
        const nearClick = cond === 'instability' && currentOpen >= 15 && currentOpen <= 23;
        clickRingMat.opacity = nearClick ? 0.85 : 0;
        clickRing.position.set(mandiblePivot.position.x + 0.15, mandiblePivot.position.y + 0.5, 0.85);

        // High crown height
        const targetCrown = cond === 'high-crown' ? 1.48 : 1.0;
        currentCrownScale = THREE.MathUtils.lerp(currentCrownScale, targetCrown, lerpFactor);
        if (highCrownMesh) {
          highCrownMesh.scale.set(1, currentCrownScale, 1);
          highCrownMesh.position.y = -1.5 + (currentCrownScale - 1) * 0.24;
        }

        // Osteoarthritic surface nodules
        oaNodulesGroup.visible = cond === 'osteoarthritis';
        discMat.color.setHex(cond === 'osteoarthritis' ? 0xd97706 : 0x3b82f6);

        // Muscle protective co-contraction glow
        muscleGroup.visible = showM;
        if (cond === 'high-crown' || cond === 'instability') {
          const pulse = ctx.isSoftwareGl || ctx.prefersReducedMotion ? 0.55 : 0.45 + 0.2 * Math.sin(elapsed * 4.5);
          muscleMat.emissive.setHex(cond === 'high-crown' ? 0xef4444 : 0xd97706);
          muscleMat.emissiveIntensity = pulse;
        } else {
          muscleMat.emissive.setHex(0x000000);
          muscleMat.emissiveIntensity = 0;
        }

        const stillMoving =
          Math.abs(currentOpen - targetOpen) > 0.05 ||
          Math.abs(currentDiscOffset - targetDiscFwd) > 0.01 ||
          Math.abs(currentCrownScale - targetCrown) > 0.01 ||
          (!ctx.isSoftwareGl && !ctx.prefersReducedMotion && showM && (cond === 'high-crown' || cond === 'instability'));

        return stillMoving;
      },
    };
  };

  const activeInfo = CONDITION_INFO[condition];
  const movementPhase =
    openingMm < 5
      ? 'Centric / Closed'
      : openingMm <= 15
        ? 'Hinge Rotation Phase'
        : 'Condylar Translation Along Eminence';

  return (
    <SandboxShell
      id="lec4-3d"
      kind="3D Sandbox"
      title="TMJ Orthopedic Stability, Disc Mechanics & Occlusal Interference"
      instruction="Drag to orbit · Scroll to zoom · Test jaw opening & joint conditions"
      onReset={handleReset}
    >
      <ThreeViewport
        title="3D Temporomandibular Joint Cutaway"
        subtitle="Inspect condyle-disc-eminence seating, anterior disc click, and protective muscle co-contraction."
        presets={PRESETS}
        initialPresetId="sagittal"
        fallbackText="3D TMJ model showing the glenoid fossa, articular eminence, biconcave articular disc, mandibular condyle, occlusal molar teeth, and temporalis/masseter muscle groups."
        onBuildScene={handleBuildScene}
        telemetryReadout={
          <div className="space-y-0.5 text-right">
            <div className="text-[11px] font-semibold text-[#C9A24B]">{activeInfo.category}</div>
            <div className="font-mono text-xs text-white">
              Opening: {openingMm} mm · {movementPhase}
            </div>
          </div>
        }
        renderDock={() => (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="tmd-3d-open" className="font-semibold text-[#FAF8F3]">
                  Jaw Opening (Rotation → Translation)
                </label>
                <span className="font-mono text-[#C9A24B] tabular-nums">{openingMm} mm</span>
              </div>
              <input
                id="tmd-3d-open"
                type="range"
                min={0}
                max={45}
                step={1}
                value={openingMm}
                onChange={(e) => setOpeningMm(Number(e.target.value))}
                className="w-full accent-[#C9A24B] cursor-pointer"
              />
            </div>

            <div className="md:col-span-5 flex flex-wrap gap-1.5">
              {(Object.keys(CONDITION_INFO) as JointCondition[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCondition(key)}
                  className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    condition === key
                      ? 'bg-[#1B3A8C] text-white border border-[#C9A24B]'
                      : 'bg-white/10 text-[#E6E8EC] border border-transparent hover:bg-white/20'
                  }`}
                >
                  {CONDITION_INFO[key].label}
                </button>
              ))}
            </div>

            <div className="md:col-span-2 flex md:justify-end">
              <button
                type="button"
                onClick={() => setShowMuscles((m) => !m)}
                aria-pressed={showMuscles}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                  showMuscles
                    ? 'bg-[#C9A24B]/20 border-[#C9A24B] text-[#FAF8F3]'
                    : 'bg-white/10 border-white/20 text-[#CBD5E1]'
                }`}
              >
                {showMuscles ? 'Muscles: Shown' : 'Muscles: Hidden'}
              </button>
            </div>
          </div>
        )}
      />

      <div className="mt-4 p-4 rounded-lg bg-[#FAF8F3] border border-[#E6E8EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-[#1B3A8C]">{activeInfo.label}</p>
          <p className="text-sm text-[#334155] mt-0.5 leading-relaxed">{activeInfo.summary}</p>
        </div>
        {condition === 'instability' && openingMm >= 15 && openingMm <= 23 && (
          <span className="shrink-0 font-mono text-xs font-bold px-3 py-1.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            Reduction Click Zone (18 mm)
          </span>
        )}
      </div>
    </SandboxShell>
  );
}
