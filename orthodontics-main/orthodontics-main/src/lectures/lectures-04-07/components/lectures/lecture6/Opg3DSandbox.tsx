import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Pause, Play } from 'lucide-react';
import { SandboxShell } from '../../common/SandboxShell';
import { ThreeViewport, type CameraPreset, type ThreeSceneContext } from '../../common/ThreeViewport';

const PRESETS: CameraPreset[] = [
  { id: 'overview', label: 'Panoramic Rig', position: [0, 7.2, 9.5], target: [0, 0.2, 0] },
  { id: 'top-trough', label: 'Focal Trough (Top)', position: [0, 11.2, 1.2], target: [0, 0, 0] },
  { id: 'anterior', label: 'Lower Incisors View', position: [0, 2.4, 8.8], target: [0, -0.3, 1.4] },
  { id: 'posterior', label: 'Cervical Spine Ghost', position: [-6.8, 3.2, -7.2], target: [0, 0, -0.8] },
];

export function Opg3DSandbox() {
  const [scanDeg, setScanDeg] = useState(-35);
  const [playing, setPlaying] = useState(false);
  const [patientShift, setPatientShift] = useState(0);
  const [showGhostRay, setShowGhostRay] = useState(true);

  const stateRef = useRef({ scanDeg, playing, patientShift, showGhostRay });
  stateRef.current = { scanDeg, playing, patientShift, showGhostRay };

  const requestRenderRef = useRef<() => void>(() => {});

  useEffect(() => {
    requestRenderRef.current();
  }, [scanDeg, playing, patientShift, showGhostRay]);

  useEffect(() => {
    if (!playing) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPlaying(false);
      return;
    }
    const id = window.setInterval(() => {
      setScanDeg((prev) => (prev >= 80 ? -80 : prev + 2));
    }, 60);
    return () => window.clearInterval(id);
  }, [playing]);

  const incisorStatus =
    Math.abs(patientShift) <= 0.22
      ? 'Centered in Focal Trough (Sharp)'
      : patientShift > 0.22
        ? 'Too Forward → Narrowed / Blurred Incisors'
        : 'Too Backward → Magnified / Overlapping Incisors';

  const handleReset = () => {
    setPlaying(false);
    setScanDeg(-35);
    setPatientShift(0);
    setShowGhostRay(true);
  };

  const handleBuildScene = (ctx: ThreeSceneContext) => {
    requestRenderRef.current = ctx.requestRender;

    const root = new THREE.Group();
    ctx.scene.add(root);

    const metalMat = new THREE.MeshPhysicalMaterial({
      color: 0xcbd5e1,
      roughness: 0.25,
      metalness: 0.88,
    });
    const navyMat = new THREE.MeshStandardMaterial({
      color: 0x1b3a8c,
      roughness: 0.45,
      metalness: 0.2,
    });
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9a24b,
      roughness: 0.25,
      metalness: 0.9,
    });
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xede6d6,
      roughness: 0.62,
      metalness: 0.04,
    });
    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xfaf8f3,
      roughness: 0.16,
      metalness: 0.02,
      clearcoat: 0.85,
    });

    // 1. Focal Trough Horseshoe Zone (fixed machine focal plane)
    const troughCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.85, -0.25, -1.65),
      new THREE.Vector3(-1.45, -0.25, 0.35),
      new THREE.Vector3(0, -0.25, 1.75),
      new THREE.Vector3(1.45, -0.25, 0.35),
      new THREE.Vector3(1.85, -0.25, -1.65),
    ]);
    const troughGeo = new THREE.TubeGeometry(troughCurve, 48, 0.38, 12, false);
    const troughMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      roughness: 0.5,
    });
    const troughMesh = new THREE.Mesh(troughGeo, troughMat);
    root.add(troughMesh);

    // 2. Patient Mandible, Condyles, Teeth & Cervical Spine Group (movable AP via patientShift)
    const patientGroup = new THREE.Group();
    root.add(patientGroup);

    const mandCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, 0.5, -1.6),
      new THREE.Vector3(-1.6, -0.8, -1.1),
      new THREE.Vector3(-1.1, -0.9, 0.6),
      new THREE.Vector3(0, -0.9, 1.7),
      new THREE.Vector3(1.1, -0.9, 0.6),
      new THREE.Vector3(1.6, -0.8, -1.1),
      new THREE.Vector3(1.8, 0.5, -1.6),
    ]);
    const mandGeo = new THREE.TubeGeometry(mandCurve, 48, 0.22, 12, false);
    const mandMesh = new THREE.Mesh(mandGeo, boneMat);
    mandMesh.castShadow = true;
    patientGroup.add(mandMesh);

    // Condylar heads
    [-1.8, 1.8].forEach((xSide) => {
      const condyle = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 14), boneMat);
      condyle.scale.set(1.1, 0.9, 0.85);
      condyle.position.set(xSide, 0.65, -1.62);
      patientGroup.add(condyle);
    });

    // Instanced teeth crowns along lower arch (14 teeth)
    const toothGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.36, 12);
    const teethInstanced = new THREE.InstancedMesh(toothGeo, enamelMat, 14);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 14; i++) {
      const t = (i / 13) * Math.PI; // 0 to PI
      const x = Math.cos(t) * 1.42;
      const z = Math.sin(t) * 1.72 - 0.05;
      dummy.position.set(x, -0.58, z);
      dummy.rotation.set(0, -t + Math.PI / 2, 0);
      const isAnterior = i >= 5 && i <= 8;
      dummy.scale.set(isAnterior ? 0.82 : 1.15, 1, isAnterior ? 0.72 : 1.1);
      dummy.updateMatrix();
      teethInstanced.setMatrixAt(i, dummy.matrix);
    }
    teethInstanced.instanceMatrix.needsUpdate = true;
    teethInstanced.computeBoundingSphere();
    teethInstanced.castShadow = true;
    patientGroup.add(teethInstanced);

    // Cervical Spine (dense posterior radiopaque column causing Ghost Artifact)
    const spineGroup = new THREE.Group();
    spineGroup.position.set(0, -0.2, -2.35);
    for (let v = 0; v < 4; v++) {
      const vert = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 0.42, 16), goldMat);
      vert.position.y = -0.9 + v * 0.56;
      spineGroup.add(vert);
    }
    patientGroup.add(spineGroup);

    // 3. Rotating C-Arm Gantry (X-ray Tube + Opposing Receptor + Fan Beam)
    const gantryPivot = new THREE.Group();
    root.add(gantryPivot);

    const overheadBar = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 8.8), metalMat);
    overheadBar.position.set(0, 2.35, 0);
    gantryPivot.add(overheadBar);

    const sourceDrop = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 12), metalMat);
    sourceDrop.position.set(0, 1.15, -4.1);
    gantryPivot.add(sourceDrop);

    const sourceHead = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.85, 0.65), navyMat);
    sourceHead.position.set(0, -0.1, -4.1);
    sourceHead.castShadow = true;
    gantryPivot.add(sourceHead);

    const sensorDrop = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 12), metalMat);
    sensorDrop.position.set(0, 1.15, 4.1);
    gantryPivot.add(sensorDrop);

    const sensorPanel = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.55, 0.14), navyMat);
    sensorPanel.position.set(0, -0.1, 4.1);
    sensorPanel.castShadow = true;
    gantryPivot.add(sensorPanel);

    const sensorGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.92, 1.36),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    sensorGlow.position.set(0, -0.1, 4.02);
    gantryPivot.add(sensorGlow);

    // Slit X-Ray Fan Beam Triangle
    const beamGeo = new THREE.BufferGeometry();
    const beamVerts = new Float32Array([
      0, -0.1, -3.75,
      -0.38, -0.78, 4.0,
      -0.38, 0.58, 4.0,

      0, -0.1, -3.75,
      -0.38, 0.58, 4.0,
      0.38, 0.58, 4.0,

      0, -0.1, -3.75,
      0.38, 0.58, 4.0,
      0.38, -0.78, 4.0,

      0, -0.1, -3.75,
      0.38, -0.78, 4.0,
      -0.38, -0.78, 4.0,
    ]);
    beamGeo.setAttribute('position', new THREE.BufferAttribute(beamVerts, 3));
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xc9a24b,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    gantryPivot.add(beamMesh);

    // Ghost shadow ray line
    const ghostLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -0.1, -3.75),
      new THREE.Vector3(0, 0.25, 4.0),
    ]);
    const ghostLine = new THREE.Line(
      ghostLineGeo,
      new THREE.LineBasicMaterial({ color: 0xf59e0b })
    );
    gantryPivot.add(ghostLine);

    let currentAngle = THREE.MathUtils.degToRad(stateRef.current.scanDeg);
    let currentShift = stateRef.current.patientShift;

    return {
      update: (delta: number) => {
        const { scanDeg: deg, patientShift: shift, showGhostRay: ghost } = stateRef.current;
        const targetAngle = THREE.MathUtils.degToRad(deg);
        const lerpF = ctx.isSoftwareGl || ctx.prefersReducedMotion ? 1 : 1 - Math.exp(-10 * delta);

        currentAngle = THREE.MathUtils.lerp(currentAngle, targetAngle, lerpF);
        currentShift = THREE.MathUtils.lerp(currentShift, shift, lerpF);

        gantryPivot.rotation.y = currentAngle;
        patientGroup.position.z = currentShift;
        ghostLine.visible = ghost;

        return (
          Math.abs(currentAngle - targetAngle) > 0.005 ||
          Math.abs(currentShift - shift) > 0.005
        );
      },
    };
  };

  return (
    <SandboxShell
      id="lec6-3d"
      kind="3D Sandbox"
      title="Panoramic Rotational Tomography, Focal Trough & Ghost Beam Geometry"
      instruction="Scrub or animate the C-arm rotation · Shift patient AP alignment relative to the focal trough"
      onReset={handleReset}
    >
      <ThreeViewport
        title="3D Panoramic OPG Gantry & Focal Trough"
        subtitle="Blue horseshoe marks the sharp focal trough; gold spine column creates contralateral radiopaque ghost shadows."
        presets={PRESETS}
        initialPresetId="overview"
        fallbackText="3D panoramic OPG scanner showing rotating X-ray source, opposing receptor, horseshoe focal trough, mandibular dental arch, and dense cervical spine."
        onBuildScene={handleBuildScene}
        telemetryReadout={
          <div className="space-y-0.5 text-right">
            <div className="text-[11px] font-semibold text-[#C9A24B]">
              Gantry Angle: {scanDeg}°
            </div>
            <div className="font-mono text-xs text-white">{incisorStatus}</div>
          </div>
        }
        renderDock={() => (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-4 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="opg-scan-deg" className="font-semibold text-[#FAF8F3]">
                  C-Arm Scan Angle
                </label>
                <span className="font-mono text-[#C9A24B] tabular-nums">{scanDeg}°</span>
              </div>
              <input
                id="opg-scan-deg"
                type="range"
                min={-80}
                max={80}
                value={scanDeg}
                onChange={(e) => {
                  setPlaying(false);
                  setScanDeg(Number(e.target.value));
                }}
                className="w-full accent-[#C9A24B] cursor-pointer"
              />
            </div>

            <div className="md:col-span-4 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="opg-ap-shift" className="font-semibold text-[#FAF8F3]">
                  Patient AP Trough Offset
                </label>
                <span className="font-mono text-[#C9A24B] tabular-nums">
                  {patientShift >= 0 ? `+${patientShift.toFixed(2)}` : patientShift.toFixed(2)}
                </span>
              </div>
              <input
                id="opg-ap-shift"
                type="range"
                min={-0.75}
                max={0.75}
                step={0.05}
                value={patientShift}
                onChange={(e) => setPatientShift(Number(e.target.value))}
                className="w-full accent-[#1B3A8C] cursor-pointer"
              />
            </div>

            <div className="md:col-span-4 flex flex-wrap md:justify-end gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={playing}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold rounded-md bg-[#C9A24B] text-[#0B1F4D] cursor-pointer whitespace-nowrap"
              >
                {playing ? <Pause className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>{playing ? 'Pause' : 'Sweep Scan'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowGhostRay((g) => !g)}
                aria-pressed={showGhostRay}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border cursor-pointer whitespace-nowrap ${
                  showGhostRay
                    ? 'bg-[#1B3A8C] text-white border-[#C9A24B]'
                    : 'bg-white/10 text-[#E6E8EC] border-white/20'
                }`}
              >
                {showGhostRay ? 'Ghost Ray: On' : 'Ghost Ray: Off'}
              </button>
            </div>
          </div>
        )}
      />
    </SandboxShell>
  );
}
