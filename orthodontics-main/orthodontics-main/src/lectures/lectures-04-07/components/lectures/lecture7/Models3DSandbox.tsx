import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SandboxShell } from '../../common/SandboxShell';
import { ThreeViewport, type CameraPreset, type ThreeSceneContext } from '../../common/ThreeViewport';

const PRESETS: CameraPreset[] = [
  { id: 'anterior-occlusion', label: 'Anterior Occlusion', position: [0, 1.4, 8.6], target: [0, 0.1, 0] },
  { id: 'lingual', label: 'Lingual View', position: [0, 2.2, -7.8], target: [0, 0.1, 0] },
  { id: 'occlusal-upper', label: 'Maxillary Occlusal', position: [0, 8.5, 2.2], target: [0, 0.4, 0] },
  { id: 'posterior-base', label: 'Set on Backs', position: [7.6, 1.8, 3.2], target: [0, 0.1, 0] },
];

export function Models3DSandbox() {
  const [hingeDeg, setHingeDeg] = useState(14);
  const [showPortions, setShowPortions] = useState(false);
  const [keslingSetup, setKeslingSetup] = useState(false);
  const [showCalipers, setShowCalipers] = useState(true);

  const stateRef = useRef({ hingeDeg, showPortions, keslingSetup, showCalipers });
  stateRef.current = { hingeDeg, showPortions, keslingSetup, showCalipers };

  const requestRenderRef = useRef<() => void>(() => {});

  useEffect(() => {
    requestRenderRef.current();
  }, [hingeDeg, showPortions, keslingSetup, showCalipers]);

  const handleReset = () => {
    setHingeDeg(14);
    setShowPortions(false);
    setKeslingSetup(false);
    setShowCalipers(true);
  };

  const handleBuildScene = (ctx: ThreeSceneContext) => {
    requestRenderRef.current = ctx.requestRender;

    const root = new THREE.Group();
    ctx.scene.add(root);

    const plasterBaseMat = new THREE.MeshStandardMaterial({
      color: 0xe9e1cf,
      roughness: 0.45,
      metalness: 0.03,
    });
    const anatomicMat = new THREE.MeshStandardMaterial({
      color: 0xf4ede0,
      roughness: 0.35,
      metalness: 0.02,
    });
    const toothMat = new THREE.MeshPhysicalMaterial({
      color: 0xfaf8f3,
      roughness: 0.18,
      metalness: 0.02,
      clearcoat: 0.75,
    });
    const waxMat = new THREE.MeshStandardMaterial({
      color: 0xd94662,
      roughness: 0.42,
      metalness: 0.02,
    });
    const caliperMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9a24b,
      roughness: 0.22,
      metalness: 0.9,
    });

    // Helper to build symmetrical artistic orthodontic base profile
    const makeArtisticBase = (isUpper: boolean) => {
      const s = new THREE.Shape();
      // Symmetrical 7-sided orthodontic model base (pointed anterior for upper, rounded for lower)
      s.moveTo(-2.1, -2.0);
      s.lineTo(2.1, -2.0); // Flat posterior base ("setting models on their backs")
      s.lineTo(2.6, -1.1); // Heel bevel
      s.lineTo(2.2, 0.8); // Lateral cut
      if (isUpper) {
        s.lineTo(0, 2.35); // Pointed maxillary anterior
      } else {
        s.quadraticCurveTo(1.2, 2.25, 0, 2.25); // Rounded mandibular anterior
        s.quadraticCurveTo(-1.2, 2.25, -2.2, 0.8);
      }
      s.lineTo(-2.2, 0.8);
      s.lineTo(-2.6, -1.1);
      s.closePath();

      const geo = new THREE.ExtrudeGeometry(s, {
        depth: 0.78,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.04,
        bevelSegments: 2,
      });
      geo.rotateX(Math.PI / 2);
      return geo;
    };

    // Lower Cast Group (fixed base on floor)
    const lowerGroup = new THREE.Group();
    lowerGroup.position.set(0, -1.0, 0);
    root.add(lowerGroup);

    const lowerBase = new THREE.Mesh(makeArtisticBase(false), plasterBaseMat);
    lowerBase.position.y = 0;
    lowerBase.castShadow = true;
    lowerBase.receiveShadow = true;
    lowerGroup.add(lowerBase);

    // Anatomic Alveolar Ridge (Lower)
    const lowerRidgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.55, 0.24, -1.3),
      new THREE.Vector3(-1.25, 0.24, 0.2),
      new THREE.Vector3(0, 0.24, 1.55),
      new THREE.Vector3(1.25, 0.24, 0.2),
      new THREE.Vector3(1.55, 0.24, -1.3),
    ]);
    const lowerRidge = new THREE.Mesh(
      new THREE.TubeGeometry(lowerRidgeCurve, 36, 0.34, 12, false),
      anatomicMat
    );
    lowerRidge.castShadow = true;
    lowerGroup.add(lowerRidge);

    // Upper Cast Pivot Group (hinges around posterior base y=0.1, z=-2.0)
    const upperPivot = new THREE.Group();
    upperPivot.position.set(0, 0.1, -2.0);
    root.add(upperPivot);

    const upperGroup = new THREE.Group();
    upperGroup.position.set(0, 0, 2.0);
    upperPivot.add(upperGroup);

    const upperBase = new THREE.Mesh(makeArtisticBase(true), plasterBaseMat);
    upperBase.position.y = 1.45;
    upperBase.castShadow = true;
    upperGroup.add(upperBase);

    const upperRidgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.62, 0.65, -1.3),
      new THREE.Vector3(-1.32, 0.65, 0.22),
      new THREE.Vector3(0, 0.65, 1.65),
      new THREE.Vector3(1.32, 0.65, 0.22),
      new THREE.Vector3(1.62, 0.65, -1.3),
    ]);
    const upperRidge = new THREE.Mesh(
      new THREE.TubeGeometry(upperRidgeCurve, 36, 0.36, 12, false),
      anatomicMat
    );
    upperRidge.castShadow = true;
    upperGroup.add(upperRidge);

    // Individual 12 teeth per arch (allows Kesling sectioning/extraction animation!)
    interface ToothHandle {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      keslingPos: THREE.Vector3;
      isPremolar1: boolean;
      isAnterior: boolean;
      crowdedTilt: number;
    }
    const upperTeeth: ToothHandle[] = [];
    const lowerTeeth: ToothHandle[] = [];

    const buildArchTeeth = (isUpper: boolean, targetGroup: THREE.Group, store: ToothHandle[]) => {
      for (let i = 0; i < 12; i++) {
        // 0,11 = M1; 1,10 = P2; 2,9 = P1; 3,8 = Canine; 4,5,6,7 = Incisors
        const t = (i / 11) * Math.PI;
        const rx = isUpper ? 1.56 : 1.46;
        const rz = isUpper ? 1.66 : 1.54;
        const x = Math.cos(t) * rx;
        const z = Math.sin(t) * rz - 0.1;
        const y = isUpper ? 0.25 : 0.62;

        const isPremolar1 = i === 2 || i === 9;
        const isAnterior = i >= 4 && i <= 7;
        const isMolar = i === 0 || i === 11;

        const geo = new THREE.CylinderGeometry(
          isMolar ? 0.25 : isAnterior ? 0.16 : 0.2,
          isMolar ? 0.22 : isAnterior ? 0.13 : 0.17,
          0.42,
          14
        );
        const mesh = new THREE.Mesh(geo, toothMat);
        // Simulate slight anterior crowding before Kesling set-up
        const crowdedOffsetZ = isAnterior ? (i % 2 === 0 ? 0.14 : -0.1) : 0;
        const crowdedTilt = isAnterior ? (i % 2 === 0 ? 0.22 : -0.18) : 0;

        const basePos = new THREE.Vector3(x, y, z + crowdedOffsetZ);
        const keslingPos = new THREE.Vector3(
          x * (isPremolar1 ? 1 : 0.96),
          y,
          z * (isAnterior ? 0.92 : 1)
        );
        mesh.position.copy(basePos);
        mesh.rotation.z = crowdedTilt;
        mesh.castShadow = true;
        targetGroup.add(mesh);

        store.push({ mesh, basePos, keslingPos, isPremolar1, isAnterior, crowdedTilt });
      }
    };

    buildArchTeeth(true, upperGroup, upperTeeth);
    buildArchTeeth(false, lowerGroup, lowerTeeth);

    // 3D Caliper Width Lines (MPV & MMV on upper occlusal plane)
    const caliperGroup = new THREE.Group();
    const mpvBar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.7, 10), caliperMat);
    mpvBar.rotation.z = Math.PI / 2;
    mpvBar.position.set(0, 0.05, 0.65);
    caliperGroup.add(mpvBar);

    const mmvBar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.2, 10), caliperMat);
    mmvBar.rotation.z = Math.PI / 2;
    mmvBar.position.set(0, 0.05, -0.12);
    caliperGroup.add(mmvBar);
    upperGroup.add(caliperGroup);

    let currentHinge = THREE.MathUtils.degToRad(stateRef.current.hingeDeg);
    let currentKesling = stateRef.current.keslingSetup ? 1 : 0;

    return {
      dispose: () => {
        // The inactive material is detached from the scene and needs explicit disposal.
        if (upperRidge.material !== waxMat) waxMat.dispose();
        if (upperRidge.material !== anatomicMat) anatomicMat.dispose();
      },
      update: (delta: number) => {
        const { hingeDeg: hDeg, showPortions: portions, keslingSetup: kesling, showCalipers: cal } =
          stateRef.current;
        const targetHinge = THREE.MathUtils.degToRad(hDeg);
        const targetKesling = kesling ? 1 : 0;
        const lerpF = ctx.isSoftwareGl || ctx.prefersReducedMotion ? 1 : 1 - Math.exp(-10 * delta);

        currentHinge = THREE.MathUtils.lerp(currentHinge, targetHinge, lerpF);
        currentKesling = THREE.MathUtils.lerp(currentKesling, targetKesling, lerpF);

        upperPivot.rotation.x = -currentHinge;
        caliperGroup.visible = cal;

        // Portion color coding: Artistic Base vs Anatomic Ridge
        plasterBaseMat.color.setHex(portions ? 0x1b3a8c : 0xe9e1cf);
        anatomicMat.color.setHex(portions ? 0xc9a24b : kesling ? 0xd94662 : 0xf4ede0);
        upperRidge.material = kesling && !portions ? waxMat : anatomicMat;
        lowerRidge.material = kesling && !portions ? waxMat : anatomicMat;

        const animateTeeth = (arr: ToothHandle[]) => {
          arr.forEach((t) => {
            if (t.isPremolar1) {
              const s = Math.max(0.001, 1 - currentKesling);
              t.mesh.visible = s > 0.05;
              t.mesh.scale.setScalar(s);
            } else {
              t.mesh.visible = true;
              t.mesh.scale.setScalar(1);
              t.mesh.position.lerpVectors(t.basePos, t.keslingPos, currentKesling);
              t.mesh.rotation.z = THREE.MathUtils.lerp(t.crowdedTilt, 0, currentKesling);
            }
          });
        };
        animateTeeth(upperTeeth);
        animateTeeth(lowerTeeth);

        return (
          Math.abs(currentHinge - targetHinge) > 0.005 ||
          Math.abs(currentKesling - targetKesling) > 0.005
        );
      },
    };
  };

  return (
    <SandboxShell
      id="lec7-3d"
      kind="3D Sandbox"
      title="Orthodontic Study Models: Anatomic vs. Artistic Base & Kesling Diagnostic Set-Up"
      instruction="Hinge open to inspect lingual occlusion · Toggle Anatomic/Artistic overlay or Kesling extraction simulation"
      onReset={handleReset}
    >
      <ThreeViewport
        title="3D Trimmed Study Models & Kesling Set-Up"
        subtitle="Symmetrical artistic stone bases preserve the anatomic arch and occlude cleanly when set on their backs."
        presets={PRESETS}
        initialPresetId="anterior-occlusion"
        fallbackText="3D orthodontic maxillary and mandibular study models with trimmed artistic bases, anatomic alveolar ridges, 12 teeth per arch, and Kesling diagnostic set-up simulation."
        onBuildScene={handleBuildScene}
        telemetryReadout={
          <div className="space-y-0.5 text-right">
            <div className="text-[11px] font-semibold text-[#C9A24B]">
              {keslingSetup ? 'Kesling Set-Up: 1st Premolars Sectioned' : 'Initial Crowded Casts'}
            </div>
            <div className="font-mono text-xs text-white">
              Hinge Open: {hingeDeg}° {hingeDeg === 0 ? '(In Occlusion)' : '(Lingual Inspection)'}
            </div>
          </div>
        }
        renderDock={() => (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-4 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="model-hinge" className="font-semibold text-[#FAF8F3]">
                  Articulator Hinge Angle
                </label>
                <span className="font-mono text-[#C9A24B] tabular-nums">{hingeDeg}°</span>
              </div>
              <input
                id="model-hinge"
                type="range"
                min={0}
                max={75}
                value={hingeDeg}
                onChange={(e) => setHingeDeg(Number(e.target.value))}
                className="w-full accent-[#C9A24B] cursor-pointer"
              />
            </div>

            <div className="md:col-span-8 flex flex-wrap md:justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPortions((p) => !p)}
                aria-pressed={showPortions}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border cursor-pointer whitespace-nowrap ${
                  showPortions
                    ? 'bg-[#1B3A8C] text-white border-[#C9A24B]'
                    : 'bg-white/10 text-[#E6E8EC] border-white/20'
                }`}
              >
                {showPortions ? 'Anatomic (Gold) / Artistic (Blue)' : 'Highlight Anatomic vs. Artistic'}
              </button>

              <button
                type="button"
                onClick={() => setKeslingSetup((k) => !k)}
                aria-pressed={keslingSetup}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border cursor-pointer whitespace-nowrap ${
                  keslingSetup
                    ? 'bg-[#C9A24B] text-[#0B1F4D] border-[#C9A24B]'
                    : 'bg-white/10 text-[#E6E8EC] border-white/20'
                }`}
              >
                {keslingSetup ? 'Kesling Set-Up: Active' : 'Run Kesling Set-Up'}
              </button>

              <button
                type="button"
                onClick={() => setShowCalipers((c) => !c)}
                aria-pressed={showCalipers}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border cursor-pointer whitespace-nowrap ${
                  showCalipers
                    ? 'bg-white/20 text-white border-white/40'
                    : 'bg-white/5 text-[#CBD5E1] border-white/15'
                }`}
              >
                {showCalipers ? 'MPV/MMV Guides: On' : 'MPV/MMV Guides: Off'}
              </button>
            </div>
          </div>
        )}
      />
    </SandboxShell>
  );
}
