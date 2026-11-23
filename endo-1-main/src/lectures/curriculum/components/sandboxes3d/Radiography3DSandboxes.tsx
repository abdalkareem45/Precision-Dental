import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeSandboxShell } from '../ThreeSandboxShell';
import { createStudioScene, StudioContext } from '../../three/studioEngine';
import { buildCutawayToothGroup } from '../../three/dentalGeometry';
import { LECTURES } from '../../data/lectures';

const LEC4 = LECTURES[1];

// ============================================================================
// 1. Bisecting Angle vs. Paralleling Projection Rig (Lecture 4, Sandbox 1)
// ============================================================================
export const BisectingParallelingSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [technique, setTechnique] = useState<'paralleling' | 'bisecting'>('paralleling');
  const [angleOffsetDeg, setAngleOffsetDeg] = useState(0); // -18 (elongation) to +18 (foreshortening)
  const [metalClamp, setMetalClamp] = useState(false);

  const stateRef = useRef({ technique, angleOffsetDeg, metalClamp });
  stateRef.current = { technique, angleOffsetDeg, metalClamp };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.5, 0.8, 7.6],
      target: [0, 0, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const { group: toothGroup } = buildCutawayToothGroup({});
    toothGroup.position.set(0, 0.1, 0);
    studio.scene.add(toothGroup);

    // Rubber dam clamp around cervical region (radiolucent plastic vs metal)
    const clampMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.75, 0.08, 12, 28),
      new THREE.MeshStandardMaterial({ color: 0xe6e8ec, roughness: 0.45, metalness: 0.1 })
    );
    clampMesh.rotation.x = Math.PI / 2;
    clampMesh.position.set(0, 0.85, 0);
    toothGroup.add(clampMesh);

    // Recording film / digital sensor plane behind tooth
    const filmMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 3.6, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35 })
    );
    studio.scene.add(filmMesh);

    // Imaginary bisector plane (visible in bisecting mode)
    const bisectorPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 4.0),
      new THREE.MeshBasicMaterial({
        color: 0xc9a24b,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      })
    );
    bisectorPlane.rotation.y = Math.PI / 2;
    studio.scene.add(bisectorPlane);

    // Plastic film holder & aiming ring (visible in paralleling mode)
    const holderGroup = new THREE.Group();
    const holderArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 3.8),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
    );
    holderArm.position.set(0, 1.55, 0.6);
    const aimingRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.05, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 })
    );
    aimingRing.position.set(0, 1.55, 2.45);
    holderGroup.add(holderArm, aimingRing);
    studio.scene.add(holderGroup);

    // X-ray cone assembly pivoting around tooth center
    const conePivot = new THREE.Group();
    const coneBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.55, 1.8, 24),
      new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.6, roughness: 0.3 })
    );
    coneBody.rotation.x = Math.PI / 2;
    coneBody.position.set(0, 0, 3.4);
    const beamCone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.95, 4.4, 24, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    beamCone.rotation.x = Math.PI / 2;
    beamCone.position.set(0, 0, 0.8);
    conePivot.add(coneBody, beamCone);
    studio.scene.add(conePivot);

    // Projected shadow tooth silhouette on film plane
    const shadowTooth = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.32, 2.1, 6, 14),
      new THREE.MeshBasicMaterial({ color: 0xfaf8f3, transparent: true, opacity: 0.72 })
    );
    filmMesh.add(shadowTooth);
    shadowTooth.position.set(0, 0, 0.06);

    const clampShadow = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.22, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    filmMesh.add(clampShadow);
    clampShadow.position.set(0, 0.65, 0.07);

    let currConeRotX = 0;
    let currFilmRotX = 0;

    studio.startLoop((dt) => {
      const { technique: tech, angleOffsetDeg: deg, metalClamp: mc } = stateRef.current;

      holderGroup.visible = tech === 'paralleling';
      bisectorPlane.visible = tech === 'bisecting';

      // Film tilt: 0 in paralleling, tilted -24 deg in bisecting
      const targetFilmRotX = tech === 'paralleling' ? 0 : THREE.MathUtils.degToRad(-24);
      currFilmRotX = THREE.MathUtils.damp(currFilmRotX, targetFilmRotX, 7, dt);
      filmMesh.position.set(0, 0, tech === 'paralleling' ? -1.45 : -1.25);
      filmMesh.rotation.x = currFilmRotX;

      // Optimal beam perpendicular to bisector (-12 deg) or film (0 deg) + user angulation error
      const baseAngle = tech === 'paralleling' ? 0 : -12;
      const targetConeRotX = THREE.MathUtils.degToRad(baseAngle + deg);
      currConeRotX = THREE.MathUtils.damp(currConeRotX, targetConeRotX, 7, dt);
      conePivot.rotation.x = currConeRotX;

      // Shadow distortion math: positive vertical angle -> foreshortening, negative -> elongation
      const distortionScale = THREE.MathUtils.clamp(1.0 - deg * 0.018, 0.62, 1.48);
      shadowTooth.scale.y = distortionScale;
      shadowTooth.position.y = -deg * 0.025;

      // Rubber dam clamp appearance
      const clampMat = clampMesh.material as THREE.MeshStandardMaterial;
      if (mc) {
        clampMat.color.setHex(0xcbd5e1);
        clampMat.metalness = 0.92;
        clampMat.roughness = 0.18;
      } else {
        clampMat.color.setHex(0x64748b);
        clampMat.metalness = 0.05;
        clampMat.roughness = 0.65;
      }
      clampShadow.visible = mc;
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const distortionStatus =
    Math.abs(angleOffsetDeg) <= 3
      ? 'Accurate Projection'
      : angleOffsetDeg > 3
      ? 'Foreshortening (Excess Vertical Angle)'
      : 'Elongation (Insufficient Vertical Angle)';

  return (
    <ThreeSandboxShell
      title={LEC4.sandboxes3d[0].title}
      metricBadge={technique === 'paralleling' ? 'Paralleling 90°' : 'Bisecting Angle'}
      learningGoal={LEC4.sandboxes3d[0].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.5, 0.8, 7.6), new THREE.Vector3(0, 0, 0))
      }
      fallbackSummary="3D X-ray cone, film sensor, and tooth showing Bisecting Angle vs Paralleling technique with aiming ring, foreshortening/elongation, and metallic clamp masking."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div className="text-[11px] font-bold text-[#C9A24B]">{distortionStatus}</div>
          <div className="text-xs font-mono-tabular text-[#FAF8F3]">
            Error: {angleOffsetDeg >= 0 ? `+${angleOffsetDeg}°` : `${angleOffsetDeg}°`}
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div>
          <div className="text-xs font-medium text-[#E6E8EC] mb-1.5">Intraoral Technique</div>
          <div className="flex gap-2">
            {(
              [
                ['paralleling', 'Paralleling (Holder)'],
                ['bisecting', 'Bisecting Angle'],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setTechnique(k);
                  onInteract?.();
                }}
                className={`px-2.5 py-1.5 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
                  technique === k ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">Vertical Cone Error</span>
            <span className="font-mono-tabular text-[#C9A24B]">
              {angleOffsetDeg >= 0 ? `+${angleOffsetDeg}°` : `${angleOffsetDeg}°`}
            </span>
          </div>
          <input
            type="range"
            min={-18}
            max={18}
            step={1}
            value={angleOffsetDeg}
            onChange={(e) => {
              setAngleOffsetDeg(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Vertical X-ray cone angle error"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="inline-flex items-center gap-2 text-xs text-[#E6E8EC] cursor-pointer">
            <input
              type="checkbox"
              checked={metalClamp}
              onChange={(e) => {
                setMetalClamp(e.target.checked);
                onInteract?.();
              }}
              className="accent-[#C9A24B]"
            />
            <span>Metal Clamp (masks structures vs. plastic)</span>
          </label>
          <button
            type="button"
            onClick={() => studioRef.current?.flyToCamera(new THREE.Vector3(6.2, 0.5, 0.2), new THREE.Vector3(0, 0, 0))}
            className="self-start px-2.5 py-1 rounded bg-[#1B3A8C] text-[11px] font-medium text-[#FAF8F3] hover:bg-[#C9A24B] hover:text-[#0B1F4D] transition-colors whitespace-nowrap shrink-0"
          >
            Side Profile View
          </button>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 2. Buccal Object Rule (SLOB) 3D Cone-Shift Simulator (Lecture 4, Sandbox 2)
// ============================================================================
export const SlobRuleSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [coneShiftDeg, setConeShiftDeg] = useState(20); // -25 Distal, 0 Orthogonal, +25 Mesial
  const stateRef = useRef({ coneShiftDeg });
  stateRef.current = { coneShiftDeg };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0, 5.2, 5.2],
      target: [0, 0, -0.3],
    });
    if (!studio) return;
    studioRef.current = studio;

    // Dental arch segment (3 crowns)
    const archGroup = new THREE.Group();
    [-1.4, 0, 1.4].forEach((xPos, idx) => {
      const crown = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 1.35, 1.05),
        new THREE.MeshStandardMaterial({
          color: idx === 1 ? 0xfaf5e8 : 0xd8d3c5,
          roughness: 0.35,
          transparent: idx === 1,
          opacity: idx === 1 ? 0.35 : 0.9,
        })
      );
      crown.position.set(xPos, 0, 0);
      archGroup.add(crown);
    });
    studio.scene.add(archGroup);

    // Buccal Canal (front +Z, Amber/Gold) & Lingual/Palatal Canal (back -Z, Royal Blue)
    const buccalCanal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.08, 1.5, 18),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.3 })
    );
    buccalCanal.position.set(0, 0, 0.36);

    const lingualCanal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.08, 1.5, 18),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.35 })
    );
    lingualCanal.position.set(0, 0, -0.36);
    studio.scene.add(buccalCanal, lingualCanal);

    // Lingual Recording Sensor Plate (at z = -1.75)
    const sensorPlate = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 2.2, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45 })
    );
    sensorPlate.position.set(0, 0, -1.75);
    studio.scene.add(sensorPlate);

    // Projected shadow markers on sensor plate
    const projBuccal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 1.4, 16),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
    );
    projBuccal.position.set(0, 0, -1.66);

    const projLingual = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 1.4, 16),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa })
    );
    projLingual.position.set(0, 0, -1.63);
    studio.scene.add(projBuccal, projLingual);

    // Movable X-ray cone orbiting around tooth (0,0,0) on buccal (+Z) side
    const coneGroup = new THREE.Group();
    const coneMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.5, 1.7, 24),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.55, roughness: 0.25 })
    );
    coneMesh.rotation.x = Math.PI / 2;
    coneMesh.position.set(0, 0, 3.2);
    const rays = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.95, 4.6, 20, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    rays.rotation.x = Math.PI / 2;
    rays.position.set(0, 0, 0.7);
    coneGroup.add(coneMesh, rays);
    studio.scene.add(coneGroup);

    let currRad = 0;

    studio.startLoop((dt) => {
      // Positive shift = Mesial (+X in our arch view), Negative shift = Distal (-X)
      const targetRad = THREE.MathUtils.degToRad(stateRef.current.coneShiftDeg);
      currRad = THREE.MathUtils.damp(currRad, targetRad, 8, dt);
      coneGroup.rotation.y = currRad;

      // Geometric projection onto film z = -1.75 from source at (sin(a)*R, 0, cos(a)*R)
      const R = 3.8;
      const sx = Math.sin(currRad) * R;
      const sz = Math.cos(currRad) * R;
      const zFilm = -1.65;

      const projectX = (objX: number, objZ: number) => {
        const t = (zFilm - sz) / (objZ - sz);
        return sx + t * (objX - sx);
      };

      projBuccal.position.x = projectX(0, 0.36);
      projLingual.position.x = projectX(0, -0.36);
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const slobMessage =
    Math.abs(coneShiftDeg) < 4
      ? 'Orthogonal (0°): Buccal (Amber) and Lingual/Palatal (Blue) canals superimpose.'
      : coneShiftDeg > 0
      ? 'Mesial Cone Shift: Lingual canal moves MESIALLY (Same); Buccal canal moves DISTALLY (Opposite).'
      : 'Distal Cone Shift: Lingual canal moves DISTALLY (Same); Buccal canal moves MESIALLY (Opposite).';

  return (
    <ThreeSandboxShell
      title={LEC4.sandboxes3d[1].title}
      metricBadge={`Cone: ${coneShiftDeg > 0 ? `+${coneShiftDeg}° Mesial` : coneShiftDeg < 0 ? `${coneShiftDeg}° Distal` : '0° Ortho'}`}
      learningGoal={LEC4.sandboxes3d[1].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0, 5.2, 5.2), new THREE.Vector3(0, 0, -0.3))
      }
      fallbackSummary="3D SLOB simulator: Amber Buccal canal moves opposite to X-ray cone shift; Blue Lingual/Palatal canal moves in the same direction as the cone shift."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div className="text-[11px] font-bold text-[#C9A24B]">SLOB = Same Lingual, Opposite Buccal</div>
          <div className="text-[11px] text-[#E6E8EC]">Amber = Buccal · Blue = Lingual/Palatal</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">Horizontal Cone Shift (-Distal / +Mesial)</span>
            <span className="font-mono-tabular text-[#C9A24B]">{coneShiftDeg}°</span>
          </div>
          <input
            type="range"
            min={-25}
            max={25}
            step={1}
            value={coneShiftDeg}
            onChange={(e) => {
              setConeShiftDeg(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Horizontal X-ray cone shift angle"
          />
          <p className="text-[11px] text-[#E6E8EC]/90 mt-1">{slobMessage}</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          {[
            [-20, 'Distal Shift (-20°)'],
            [0, 'Orthogonal (0°)'],
            [20, 'Mesial Shift (+20°)'],
          ].map(([deg, label]) => (
            <button
              key={String(deg)}
              type="button"
              onClick={() => {
                setConeShiftDeg(Number(deg));
                onInteract?.();
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
                coneShiftDeg === deg ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C] text-[#FAF8F3]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 3. CBCT Cone-Beam Sweep & Limited FOV Slicer (Lecture 4, Sandbox 3)
// ============================================================================
export const CbctScannerSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [scanMode, setScanMode] = useState<'cbct' | 'ct'>('cbct');
  const [fovSize, setFovSize] = useState<'limited' | 'arch'>('limited');
  const [sliceY, setSliceY] = useState(0.0);
  const [metalArtifact, setMetalArtifact] = useState(false);

  const stateRef = useRef({ scanMode, fovSize, sliceY, metalArtifact });
  stateRef.current = { scanMode, fovSize, sliceY, metalArtifact };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [3.2, 2.5, 6.2],
      target: [0, 0, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const { group: toothGroup } = buildCutawayToothGroup({});
    toothGroup.scale.setScalar(0.85);
    studio.scene.add(toothGroup);

    // Metallic restoration crown causing CBCT beam hardening streak artifact
    const metalCrown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.72, 0.85, 24),
      new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.95, roughness: 0.15 })
    );
    metalCrown.position.y = 1.2;
    studio.scene.add(metalCrown);

    // FOV cylinder volume (4x4 cm limited vs full arch)
    const fovCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.15, 2.4, 28, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xc9a24b,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    studio.scene.add(fovCylinder);

    // Rotating C-arm source + detector
    const gantry = new THREE.Group();
    const source = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.65, 0.65),
      new THREE.MeshStandardMaterial({ color: 0x1b3a8c, roughness: 0.35 })
    );
    source.position.set(0, 0, 3.1);

    const detector = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 1.85, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35, metalness: 0.4 })
    );
    detector.position.set(0, 0, -2.9);

    const coneBeam = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 5.8, 28, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    coneBeam.rotation.x = Math.PI / 2;
    coneBeam.position.set(0, 0, 0.1);

    const fanBeam = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.12, 5.8),
      new THREE.MeshBasicMaterial({
        color: 0xf43f5e,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
      })
    );
    fanBeam.position.set(0, 0, 0.1);

    gantry.add(source, detector, coneBeam, fanBeam);
    studio.scene.add(gantry);

    // Multiplanar axial slice ring
    const axialSlice = new THREE.Mesh(
      new THREE.RingGeometry(0.1, 1.4, 32),
      new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      })
    );
    axialSlice.rotation.x = Math.PI / 2;
    studio.scene.add(axialSlice);

    // Streak artifact lines
    const artifactGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const streak = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.03, 0.04),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 })
      );
      streak.rotation.y = (i / 6) * Math.PI;
      artifactGroup.add(streak);
    }
    artifactGroup.position.y = 1.2;
    studio.scene.add(artifactGroup);

    let currSliceY = 0;
    let currFovScale = 1;

    studio.startLoop((dt, elapsed) => {
      const { scanMode: mode, fovSize: fov, sliceY: sy, metalArtifact: ma } = stateRef.current;

      gantry.rotation.y = elapsed * 0.75;
      coneBeam.visible = mode === 'cbct';
      fanBeam.visible = mode === 'ct';
      if (mode === 'ct') {
        fanBeam.position.y = Math.sin(elapsed * 2.2) * 1.1;
      }

      const targetScale = fov === 'limited' ? 1.0 : 1.75;
      currFovScale = THREE.MathUtils.damp(currFovScale, targetScale, 7, dt);
      fovCylinder.scale.set(currFovScale, 1, currFovScale);

      currSliceY = THREE.MathUtils.damp(currSliceY, sy, 8, dt);
      axialSlice.position.y = currSliceY;

      metalCrown.visible = ma;
      artifactGroup.visible = ma;
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  return (
    <ThreeSandboxShell
      title={LEC4.sandboxes3d[2].title}
      metricBadge={fovSize === 'limited' ? '4×4 cm · 60–75 µm Voxel' : 'Full Arch FOV'}
      learningGoal={LEC4.sandboxes3d[2].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(3.2, 2.5, 6.2), new THREE.Vector3(0, 0, 0))
      }
      fallbackSummary="3D CBCT scanner demonstrating 180-360° cone-beam sweep vs fan-beam CT, limited 4x4 cm endodontic FOV (60-75 µm isotropic voxels), axial slicing, and metallic artifact streaks."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div className="text-[11px] font-bold text-[#C9A24B]">
            {scanMode === 'cbct' ? 'CBCT Isotropic Voxel' : 'Conventional Fan-Beam CT'}
          </div>
          <div className="text-xs font-mono-tabular text-[#FAF8F3]">
            {fovSize === 'limited' ? '4×4 cm · 60–75 µm' : 'Full Arch · Lower Res'}
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div>
          <div className="text-xs font-medium text-[#E6E8EC] mb-1.5">Beam & FOV Mode</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setScanMode('cbct');
                onInteract?.();
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
                scanMode === 'cbct' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
              }`}
            >
              CBCT Cone Beam
            </button>
            <button
              type="button"
              onClick={() => {
                setScanMode('ct');
                onInteract?.();
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
                scanMode === 'ct' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
              }`}
            >
              Fan-Beam CT
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">Axial Slice Plane</span>
            <span className="font-mono-tabular text-[#C9A24B]">{sliceY.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={-1.6}
            max={1.4}
            step={0.1}
            value={sliceY}
            onChange={(e) => {
              setSliceY(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="CBCT axial slice position"
          />
          <div className="flex gap-1.5 mt-1.5">
            <button
              type="button"
              onClick={() => {
                setFovSize('limited');
                onInteract?.();
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                fovSize === 'limited' ? 'bg-[#FAF8F3] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
              }`}
            >
              Limited 4×4 cm
            </button>
            <button
              type="button"
              onClick={() => {
                setFovSize('arch');
                onInteract?.();
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                fovSize === 'arch' ? 'bg-[#FAF8F3] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
              }`}
            >
              Full Arch
            </button>
          </div>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 text-xs text-[#E6E8EC] cursor-pointer">
            <input
              type="checkbox"
              checked={metalArtifact}
              onChange={(e) => {
                setMetalArtifact(e.target.checked);
                onInteract?.();
              }}
              className="accent-[#C9A24B]"
            />
            <span>Simulate Metallic Crown Artifact</span>
          </label>
          <p className="text-[11px] text-[#E6E8EC]/80 mt-1 leading-tight">
            High-density enamel/metallic restorations increase CBCT artifacts; patient must stay still.
          </p>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};
