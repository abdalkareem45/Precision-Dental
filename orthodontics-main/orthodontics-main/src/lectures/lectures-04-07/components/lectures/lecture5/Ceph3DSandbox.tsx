import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SandboxShell } from '../../common/SandboxShell';
import { ThreeViewport, type CameraPreset, type ThreeSceneContext } from '../../common/ThreeViewport';

const PRESETS: CameraPreset[] = [
  { id: 'apparatus', label: 'Apparatus Overview', position: [6.8, 3.8, 11.2], target: [0, 0.2, 0] },
  { id: 'beam-axis', label: 'X-Ray Beam Axis', position: [10.5, 0.9, 1.5], target: [0, 0.3, 0] },
  { id: 'sensor-plane', label: 'Sensor Projection', position: [-7.5, 1.6, 5.2], target: [-1.5, 0.2, 0] },
  { id: 'ear-rods', label: 'Ear Rods & NHP', position: [0.5, 2.2, 7.6], target: [0, 0.4, 0] },
];

export function Ceph3DSandbox() {
  const [sensorDistFt, setSensorDistFt] = useState(0.5);
  const [headYawDeg, setHeadYawDeg] = useState(0);
  const [wedgeActive, setWedgeActive] = useState(true);

  const stateRef = useRef({ sensorDistFt, headYawDeg, wedgeActive });
  stateRef.current = { sensorDistFt, headYawDeg, wedgeActive };

  const requestRenderRef = useRef<() => void>(() => {});

  useEffect(() => {
    requestRenderRef.current();
  }, [sensorDistFt, headYawDeg, wedgeActive]);

  // Magnification physics: Source-to-midsagittal = 5.0 ft (60 in), midsagittal-to-sensor = sensorDistFt
  // Base geometric magnification factor = (5.0 + d) / 5.0; wait: standard clinical film is ~7-8% at ~0.4-0.5 ft!
  const magFactor = (5.0 + sensorDistFt) / 5.0;
  const magPct = ((magFactor - 1) * 100).toFixed(1);

  const handleReset = () => {
    setSensorDistFt(0.5);
    setHeadYawDeg(0);
    setWedgeActive(true);
  };

  const handleBuildScene = (ctx: ThreeSceneContext) => {
    requestRenderRef.current = ctx.requestRender;

    const root = new THREE.Group();
    ctx.scene.add(root);

    const brushedMetal = new THREE.MeshPhysicalMaterial({
      color: 0xcbd5e1,
      roughness: 0.24,
      metalness: 0.88,
    });
    const navyHousing = new THREE.MeshStandardMaterial({
      color: 0x1b3a8c,
      roughness: 0.42,
      metalness: 0.25,
    });
    const goldAccent = new THREE.MeshPhysicalMaterial({
      color: 0xc9a24b,
      roughness: 0.25,
      metalness: 0.9,
    });
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xf1ebd9,
      roughness: 0.58,
      metalness: 0.04,
    });
    const softTissueMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      roughness: 0.35,
      metalness: 0.05,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });

    // 1. X-Ray Tube Head (at +X = 5.5 representing 5 ft standardized source distance)
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(5.4, 0.3, 0);
    const tubeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.5, 24), navyHousing);
    tubeBody.rotation.z = Math.PI / 2;
    tubeBody.castShadow = true;
    tubeGroup.add(tubeBody);

    const collimator = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 0.75, 20), brushedMetal);
    collimator.rotation.z = Math.PI / 2;
    collimator.position.x = -0.95;
    tubeGroup.add(collimator);

    const emitterRing = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 12, 24), goldAccent);
    emitterRing.rotation.y = Math.PI / 2;
    emitterRing.position.x = -1.32;
    tubeGroup.add(emitterRing);
    root.add(tubeGroup);

    // 2. Cephalostat Overhead Arm + Bilateral Ear Rods + Nasal Rod
    const cephFrame = new THREE.Group();
    const topArm = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 3.6), brushedMetal);
    topArm.position.set(0, 2.35, 0);
    cephFrame.add(topArm);

    [-1.45, 1.45].forEach((zSide) => {
      const armDrop = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.15, 12), brushedMetal);
      armDrop.position.set(0, 1.28, zSide);
      cephFrame.add(armDrop);

      const earRod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.09, 0.75, 14),
        goldAccent
      );
      earRod.rotation.x = Math.PI / 2;
      earRod.position.set(0, 0.25, zSide > 0 ? 1.05 : -1.05);
      cephFrame.add(earRod);
    });

    // Nasal positioner rod (Frankfort plane horizontal)
    const nasalArm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.08), brushedMetal);
    nasalArm.position.set(0.75, 1.65, 0);
    cephFrame.add(nasalArm);
    const nasalPad = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.7, 0.18), goldAccent);
    nasalPad.position.set(1.42, 1.32, 0);
    cephFrame.add(nasalPad);
    root.add(cephFrame);

    // 3. Patient Skull + Soft Tissue Profile (rotatable via headYawDeg)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.25, 0);
    root.add(headGroup);

    // Cranium dome
    const cranium = new THREE.Mesh(new THREE.SphereGeometry(1.05, 28, 22), boneMat);
    cranium.scale.set(1.16, 1.02, 0.86);
    cranium.position.set(-0.15, 0.45, 0);
    cranium.castShadow = true;
    headGroup.add(cranium);

    // Facial skeleton & mandible profile
    const jawShape = new THREE.Shape();
    jawShape.moveTo(-0.35, 0.35);
    jawShape.lineTo(0.95, 0.32); // Nasal/Maxilla
    jawShape.lineTo(1.05, -0.35); // Alveolar
    jawShape.lineTo(0.88, -1.18); // Symphysis/Chin
    jawShape.lineTo(-0.22, -0.95); // Inferior border / Gonion
    jawShape.lineTo(-0.42, -0.15); // Ramus
    jawShape.closePath();
    const jawGeo = new THREE.ExtrudeGeometry(jawShape, {
      depth: 0.96,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.1,
      bevelSegments: 2,
    });
    jawGeo.translate(0, 0, -0.48);
    const jawMesh = new THREE.Mesh(jawGeo, boneMat);
    jawMesh.castShadow = true;
    headGroup.add(jawMesh);

    // Soft-tissue profile envelope (enhanced when Aluminum Wedge is active)
    const softProfile = new THREE.Mesh(new THREE.SphereGeometry(1.25, 24, 18), softTissueMat);
    softProfile.scale.set(1.12, 1.15, 0.78);
    softProfile.position.set(0.18, 0.08, 0);
    headGroup.add(softProfile);

    // 4. Aluminum Wedge (attenuates beam at anterior facial profile)
    const wedgeGeo = new THREE.ConeGeometry(0.45, 1.8, 3);
    const wedgeMesh = new THREE.Mesh(wedgeGeo, brushedMetal);
    wedgeMesh.position.set(2.35, 0.15, 0);
    wedgeMesh.rotation.z = Math.PI / 2;
    root.add(wedgeMesh);

    // 5. Digital Cassette / Sensor Plane + Projected Ceph Silhouette
    const sensorGroup = new THREE.Group();
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.6, 3.2), navyHousing);
    sensorGroup.add(frameMesh);

    const activeScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.85, 3.25),
      new THREE.MeshBasicMaterial({ color: 0x0f172a })
    );
    activeScreen.rotation.y = Math.PI / 2;
    activeScreen.position.x = 0.07;
    sensorGroup.add(activeScreen);

    // Projected radiograph profile rings on the sensor (shows magnification + double border on yaw)
    const projPrimary = new THREE.Mesh(
      new THREE.RingGeometry(0.75, 0.82, 32),
      new THREE.MeshBasicMaterial({ color: 0xfaf8f3, side: THREE.DoubleSide })
    );
    projPrimary.rotation.y = Math.PI / 2;
    projPrimary.position.x = 0.085;
    sensorGroup.add(projPrimary);

    const projDouble = new THREE.Mesh(
      new THREE.RingGeometry(0.75, 0.81, 32),
      new THREE.MeshBasicMaterial({ color: 0xc9a24b, side: THREE.DoubleSide })
    );
    projDouble.rotation.y = Math.PI / 2;
    projDouble.position.x = 0.086;
    sensorGroup.add(projDouble);

    root.add(sensorGroup);

    // 6. Diverging X-Ray Beam Lines (from source x=4.08 to sensor)
    const rayPoints = new Float32Array(8 * 3);
    const rayGeo = new THREE.BufferGeometry();
    rayGeo.setAttribute('position', new THREE.BufferAttribute(rayPoints, 3));
    const rayMat = new THREE.LineBasicMaterial({
      color: 0xc9a24b,
      transparent: true,
      opacity: 0.62,
    });
    const rayLines = new THREE.LineSegments(rayGeo, rayMat);
    root.add(rayLines);

    let currentSensorX = -2.2 - (stateRef.current.sensorDistFt - 0.5) * 3.0;
    let currentYaw = THREE.MathUtils.degToRad(stateRef.current.headYawDeg);

    return {
      update: (delta: number) => {
        const { sensorDistFt: dFt, headYawDeg: yawD, wedgeActive: wedge } = stateRef.current;
        const targetX = -2.0 - (dFt - 0.5) * 3.2;
        const targetYaw = THREE.MathUtils.degToRad(yawD);
        const lerpF = ctx.isSoftwareGl || ctx.prefersReducedMotion ? 1 : 1 - Math.exp(-10 * delta);

        currentSensorX = THREE.MathUtils.lerp(currentSensorX, targetX, lerpF);
        currentYaw = THREE.MathUtils.lerp(currentYaw, targetYaw, lerpF);

        sensorGroup.position.set(currentSensorX, 0.25, 0);
        headGroup.rotation.y = currentYaw;
        wedgeMesh.visible = wedge;
        softTissueMat.opacity = wedge ? 0.36 : 0.1;

        const scaleMag = (5.0 + dFt) / 5.0;
        projPrimary.scale.setScalar(scaleMag);
        projDouble.scale.setScalar(scaleMag);
        const doubleSplit = Math.abs(currentYaw) * 1.45;
        projPrimary.position.z = -doubleSplit;
        projDouble.position.z = doubleSplit;
        projDouble.visible = Math.abs(yawD) >= 1;

        // Update diverging beam rays from tube emitter (4.08, 0.3, 0) to sensor corners
        const pos = rayGeo.attributes.position as THREE.BufferAttribute;
        const sx = 4.08;
        const sy = 0.3;
        const tx = currentSensorX + 0.08;
        const spreadY = 1.35 * scaleMag;
        const spreadZ = 1.25 * scaleMag;
        const targets: [number, number, number][] = [
          [tx, sy + spreadY, spreadZ],
          [tx, sy + spreadY, -spreadZ],
          [tx, sy - spreadY, spreadZ],
          [tx, sy - spreadY, -spreadZ],
        ];
        targets.forEach((pt, idx) => {
          pos.setXYZ(idx * 2, sx, sy, 0);
          pos.setXYZ(idx * 2 + 1, pt[0], pt[1], pt[2]);
        });
        pos.needsUpdate = true;

        return (
          Math.abs(currentSensorX - targetX) > 0.005 ||
          Math.abs(currentYaw - targetYaw) > 0.005
        );
      },
    };
  };

  return (
    <SandboxShell
      id="lec5-3d"
      kind="3D Sandbox"
      title="Standardized Cephalostat Apparatus, 7–8% Magnification & Rotation Error"
      instruction="Orbit the X-ray setup · Vary sensor distance (0.5–1 ft) & head rotation"
      onReset={handleReset}
    >
      <ThreeViewport
        title="3D Cephalostat & Beam Geometry"
        subtitle="Fixed 5 ft source-to-midsagittal distance; ear rods prevent horizontal movement; nasal rod sets Frankfort horizontal."
        presets={PRESETS}
        initialPresetId="apparatus"
        fallbackText="3D cephalostat setup showing X-ray source at 5 feet, bilateral ear rods, nasal rod for Natural Head Position, aluminum wedge, and digital sensor at 0.5–1.0 feet."
        onBuildScene={handleBuildScene}
        telemetryReadout={
          <div className="space-y-0.5 text-right">
            <div className="text-[11px] font-semibold text-[#C9A24B]">
              Magnification: +{magPct}% (Linear distortion)
            </div>
            <div className="font-mono text-xs text-white">
              {Math.abs(headYawDeg) >= 2
                ? `Double-image error: ±${Math.abs(headYawDeg)}° yaw`
                : 'Ear rods aligned · True Lateral'}
            </div>
          </div>
        }
        renderDock={() => (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-4 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="ceph-sensor-dist" className="font-semibold text-[#FAF8F3]">
                  Midsagittal → Sensor
                </label>
                <span className="font-mono text-[#C9A24B] tabular-nums">
                  {sensorDistFt.toFixed(2)} ft (+{magPct}%)
                </span>
              </div>
              <input
                id="ceph-sensor-dist"
                type="range"
                min={0.35}
                max={1.0}
                step={0.05}
                value={sensorDistFt}
                onChange={(e) => setSensorDistFt(Number(e.target.value))}
                className="w-full accent-[#C9A24B] cursor-pointer"
              />
            </div>

            <div className="md:col-span-4 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="ceph-head-yaw" className="font-semibold text-[#FAF8F3]">
                  Head Yaw Rotation Error
                </label>
                <span className="font-mono text-[#C9A24B] tabular-nums">{headYawDeg}°</span>
              </div>
              <input
                id="ceph-head-yaw"
                type="range"
                min={-12}
                max={12}
                step={1}
                value={headYawDeg}
                onChange={(e) => setHeadYawDeg(Number(e.target.value))}
                className="w-full accent-[#1B3A8C] cursor-pointer"
              />
            </div>

            <div className="md:col-span-4 flex flex-wrap md:justify-end gap-2">
              <button
                type="button"
                onClick={() => setWedgeActive((w) => !w)}
                aria-pressed={wedgeActive}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                  wedgeActive
                    ? 'bg-[#C9A24B] text-[#0B1F4D] border-[#C9A24B]'
                    : 'bg-white/10 text-[#E6E8EC] border-white/20'
                }`}
              >
                {wedgeActive ? 'Aluminum Wedge: On' : 'Aluminum Wedge: Off'}
              </button>
            </div>
          </div>
        )}
      />

      <div className="mt-4 p-4 rounded-lg bg-[#FAF8F3] border border-[#E6E8EC] text-xs sm:text-sm text-[#334155] leading-relaxed">
        <strong className="text-[#0B1F4D]">Clinical Takeaway:</strong> Because the X-ray beam
        diverges across the {sensorDistFt.toFixed(2)} ft air gap to the sensor, an inevitable{' '}
        <strong className="text-[#1B3A8C]">{magPct}% magnification</strong> occurs—which is why
        angular measurements are preferred over linear ones. If the head rotates ({headYawDeg}°),
        bilateral landmarks split and must be averaged.
      </div>
    </SandboxShell>
  );
}
