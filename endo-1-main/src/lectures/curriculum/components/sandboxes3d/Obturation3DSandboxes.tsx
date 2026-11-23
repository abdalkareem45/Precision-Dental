import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeSandboxShell } from '../ThreeSandboxShell';
import { createStudioScene, StudioContext } from '../../three/studioEngine';
import { buildCutawayToothGroup } from '../../three/dentalGeometry';
import { LECTURES } from '../../data/lectures';

const LEC8 = LECTURES[5];

// ============================================================================
// 1. Continuous Wave (System B) & Plugger Fit Lab (Lecture 8, Sandbox 1)
// ============================================================================
export const ContinuousWaveSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [pluggerFit, setPluggerFit] = useState<'suitable' | 'too_large' | 'too_small'>('suitable');
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(2);
  const stateRef = useRef({ pluggerFit, stage });
  stateRef.current = { pluggerFit, stage };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.4, 0.2, 5.9],
      target: [0, -0.2, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const { group: toothGroup } = buildCutawayToothGroup({});
    studio.scene.add(toothGroup);

    // Master GP cone inside canal (cut 0.5 mm short of WL)
    const gpMaster = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.045, 2.7, 20),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.42 })
    );
    gpMaster.position.set(0, -0.35, 0);
    studio.scene.add(gpMaster);

    // Tapered stainless-steel dead-soft plugger
    const pluggerMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.18,
      emissive: 0x000000,
    });
    const plugger = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.07, 2.5, 18), pluggerMat);
    studio.scene.add(plugger);

    // Root split warning indicator when plugger is too large
    const splitCrack = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 1.3, 0.55),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.85 })
    );
    splitCrack.position.set(0.32, -0.6, 0.08);
    studio.scene.add(splitCrack);

    let currPluggerY = 1.6;

    studio.startLoop((dt, elapsed) => {
      const { pluggerFit: pf, stage: st } = stateRef.current;

      const targetRadiusScale = pf === 'too_large' ? 1.65 : pf === 'too_small' ? 0.52 : 1.0;
      plugger.scale.x = THREE.MathUtils.damp(plugger.scale.x, targetRadiusScale, 7, dt);
      plugger.scale.z = plugger.scale.x;

      const targetY = st === 1 ? 1.55 : st === 2 ? 0.45 : st === 3 ? 0.28 : 1.85;
      currPluggerY = THREE.MathUtils.damp(currPluggerY, targetY, 6, dt);
      plugger.position.set(0, currPluggerY, 0);

      // 200°C heat glow on Stage 2 & Stage 4 (1s release pulse)
      if (st === 2) {
        pluggerMat.emissive.setHex(0xef4444);
        pluggerMat.emissiveIntensity = 0.65 + Math.sin(elapsed * 5) * 0.15;
      } else if (st === 4) {
        pluggerMat.emissive.setHex(0xf97316);
        pluggerMat.emissiveIntensity = 0.45;
      } else {
        pluggerMat.emissive.setHex(0x000000);
        pluggerMat.emissiveIntensity = 0;
      }

      // Apical GP mass compaction
      gpMaster.scale.y = st >= 3 ? 0.65 : 1.0;
      gpMaster.scale.x = st >= 3 ? 1.18 : 1.0;
      gpMaster.scale.z = gpMaster.scale.x;
      gpMaster.position.y = st >= 3 ? -0.95 : -0.35;

      splitCrack.visible = pf === 'too_large' && st >= 2;
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const stageText = {
    1: 'Step 1: Prefit plugger within 5–7 mm of WL; cut master cone 0.5 mm short of WL; apply sealer.',
    2: 'Step 2 (200°C Touch): Cut excess at orifice and drive heated plugger 3–4 mm apically.',
    3: 'Step 3 (10 s Cooling Hold): Release heat switch and hold sustained pressure for 10 s to take up cooling shrinkage.',
    4: 'Step 4 (1 s Heat + 1 s Pause): Activate heat 1 s, pause 1 s, remove plugger, verify apical mass, and backfill.',
  }[stage];

  return (
    <ThreeSandboxShell
      title={LEC8.sandboxes3d[0].title}
      metricBadge={stage === 2 ? '200°C Active' : stage === 3 ? '10 s Hold' : `Stage ${stage}/4`}
      learningGoal={LEC8.sandboxes3d[0].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.4, 0.2, 5.9), new THREE.Vector3(0, -0.2, 0))
      }
      fallbackSummary="3D System B Continuous Wave compaction showing 200°C heated downpack, 10 s sustained cooling hold, and plugger sizing (suitable vs root-splitting oversize vs ineffective undersize)."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div
            className={`text-[11px] font-bold ${
              pluggerFit === 'suitable'
                ? 'text-emerald-300'
                : pluggerFit === 'too_large'
                ? 'text-rose-300'
                : 'text-amber-300'
            }`}
          >
            {pluggerFit === 'suitable'
              ? 'Suitable Plugger (5–7 mm from WL)'
              : pluggerFit === 'too_large'
              ? 'Large Plugger Binds & May Split Root!'
              : 'Small Plugger Is Ineffective'}
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div>
          <div className="text-xs font-medium text-[#E6E8EC] mb-1">System B Sequence</div>
          <div className="flex flex-wrap gap-1.5">
            {([1, 2, 3, 4] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStage(s);
                  onInteract?.();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  stage === s ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {s === 1 ? '1. Prefit' : s === 2 ? '2. 200°C Downpack' : s === 3 ? '3. 10s Hold' : '4. Remove & Backfill'}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#E6E8EC]/90 mt-1.5 leading-tight">{stageText}</p>
        </div>

        <div>
          <div className="text-xs font-medium text-[#E6E8EC] mb-1">Plugger Fit Selection</div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['suitable', 'Suitable Taper'],
                ['too_large', 'Too Large (Risk Split)'],
                ['too_small', 'Too Small'],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setPluggerFit(k);
                  onInteract?.();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  pluggerFit === k ? 'bg-[#FAF8F3] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 2. Obtura III Injection & Carrier-Based (Thermafil) Lab (Lecture 8, Sandbox 2)
// ============================================================================
export const ThermoplasticCarrierSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [mode, setMode] = useState<'obtura' | 'thermafil'>('obtura');
  const [progress, setProgress] = useState(0.6);
  const stateRef = useRef({ mode, progress });
  stateRef.current = { mode, progress };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.4, 0.2, 6.0],
      target: [0, -0.2, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const { group: toothGroup } = buildCutawayToothGroup({});
    studio.scene.add(toothGroup);

    // Internal resorption void pocket (where Obtura III excels)
    const resorptionPocket = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.35 })
    );
    resorptionPocket.position.set(0, -0.35, 0);
    studio.scene.add(resorptionPocket);

    // Silver needle (Obtura III 20/23/25 gauge)
    const needle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 2.3, 14),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.16 })
    );
    studio.scene.add(needle);

    // Apical GP fill column
    const gpFill = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.08, 2.7, 20),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 })
    );
    studio.scene.add(gpFill);

    // Thermafil solid central plastic core + outer alpha-GP coating
    const carrierGroup = new THREE.Group();
    const plasticCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.03, 3.0, 14),
      new THREE.MeshStandardMaterial({ color: 0x1b3a8c, roughness: 0.35 })
    );
    const alphaCoat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.06, 2.5, 16),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.32, transparent: true, opacity: 0.85 })
    );
    alphaCoat.position.y = -0.2;
    carrierGroup.add(plasticCore, alphaCoat);
    studio.scene.add(carrierGroup);

    studio.startLoop(() => {
      const { mode: m, progress: p } = stateRef.current;
      needle.visible = m === 'obtura';
      resorptionPocket.visible = m === 'obtura';
      gpFill.visible = m === 'obtura';
      carrierGroup.visible = m === 'thermafil';

      if (m === 'obtura') {
        // Needle starts within 3-5 mm of apical prep and backs out as GP fills
        needle.position.set(0, -0.35 + p * 1.9, 0);
        gpFill.scale.y = THREE.MathUtils.clamp(p, 0.1, 1.0);
        gpFill.position.y = -1.7 + gpFill.scale.y * 1.35;
        resorptionPocket.scale.setScalar(THREE.MathUtils.clamp(p * 1.15, 0.15, 1.0));
      } else {
        // Carrier inserted without rotation or twisting
        carrierGroup.position.set(0, 1.75 - p * 1.95, 0);
      }
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  return (
    <ThreeSandboxShell
      title={LEC8.sandboxes3d[1].title}
      metricBadge={mode === 'obtura' ? 'Obtura III (20/23/25G)' : 'Thermafil (10 s Insert)'}
      learningGoal={LEC8.sandboxes3d[1].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.4, 0.2, 6.0), new THREE.Vector3(0, -0.2, 0))
      }
      fallbackSummary="3D Obtura III thermoplastic injection of beta-phase GP pellets into internal resorption defects vs Thermafil plastic carrier with alpha-phase GP insertion."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('obtura');
                onInteract?.();
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
                mode === 'obtura' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C] text-[#FAF8F3]'
              }`}
            >
              Obtura III Injection Gun
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('thermafil');
                onInteract?.();
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
                mode === 'thermafil' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C] text-[#FAF8F3]'
              }`}
            >
              Thermafil Carrier-Based
            </button>
          </div>
          <p className="text-[11px] text-[#E6E8EC]/90 mt-1.5 leading-tight">
            {mode === 'obtura'
              ? 'Needle sits 3–5 mm from apical prep; backs out passively during injection; alcohol-dipped plugger compacts during cooling.'
              : 'Remove smear layer, disinfect carrier (5.25% NaOCl 1 min + 70% alcohol), insert within 10 s without twisting; cool 2–4 min before resecting.'}
          </p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">Obturation Progression</span>
            <span className="font-mono-tabular text-[#C9A24B]">{Math.round(progress * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={progress}
            onChange={(e) => {
              setProgress(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Obturation progression"
          />
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 3. Apical Barrier (MTA / Dentin Chips) & Revascularization Lab (Lecture 8, Sandbox 3)
// ============================================================================
export const ApicalBarrierSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [protocol, setProtocol] = useState<'mta' | 'dentin_chips' | 'revascularization'>('mta');
  const [healingPhase, setHealingPhase] = useState(0.8);
  const stateRef = useRef({ protocol, healingPhase });
  stateRef.current = { protocol, healingPhase };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.4, -0.3, 6.0],
      target: [0, -0.4, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const { group: toothGroup } = buildCutawayToothGroup({ openApex: true });
    studio.scene.add(toothGroup);

    // Apical Barrier Plug (MTA or Dentin Chips)
    const apicalPlug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.25, 0.65, 20),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 })
    );
    apicalPlug.position.set(0, -1.75, 0);
    studio.scene.add(apicalPlug);

    // Backfill GP (used after MTA / Dentin chips)
    const gpBackfill = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.2, 2.2, 20),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.42 })
    );
    gpBackfill.position.set(0, -0.3, 0);
    studio.scene.add(gpBackfill);

    // Revascularization Blood Clot Scaffold + SCAP cells + Coronal MTA + Composite
    const clotScaffold = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.24, 2.1, 20),
      new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.55, transparent: true, opacity: 0.85 })
    );
    clotScaffold.position.set(0, -0.75, 0);
    studio.scene.add(clotScaffold);

    const coronalMtaSeal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.22, 0.42, 20),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.6 })
    );
    coronalMtaSeal.position.set(0, 0.55, 0);
    studio.scene.add(coronalMtaSeal);

    const compositeSeal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.26, 0.65, 20),
      new THREE.MeshStandardMaterial({ color: 0xfaf8f3, roughness: 0.22 })
    );
    compositeSeal.position.set(0, 1.1, 0);
    studio.scene.add(compositeSeal);

    // Hard tissue / root wall thickening shell growing with healingPhase
    const matureApex = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.08, 12, 28),
      new THREE.MeshStandardMaterial({ color: 0xe6cf9e, roughness: 0.55 })
    );
    matureApex.rotation.x = Math.PI / 2;
    matureApex.position.set(0, -2.25, 0);
    studio.scene.add(matureApex);

    studio.startLoop(() => {
      const { protocol: pr, healingPhase: hp } = stateRef.current;
      const isRevasc = pr === 'revascularization';

      apicalPlug.visible = !isRevasc;
      gpBackfill.visible = !isRevasc;
      clotScaffold.visible = isRevasc;
      coronalMtaSeal.visible = isRevasc;
      compositeSeal.visible = isRevasc;

      const plugMat = apicalPlug.material as THREE.MeshStandardMaterial;
      plugMat.color.setHex(pr === 'mta' ? 0xcbd5e1 : 0xe6cf9e);

      matureApex.visible = isRevasc || pr === 'mta';
      matureApex.scale.setScalar(0.35 + hp * 0.75);
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const desc = {
    mta: 'MTA Apical Barrier: Sterile, biocompatible material compacted into open apex; once set, gutta-percha is compacted without extrusion.',
    dentin_chips: 'Dentin Chips (1 mm): Shaved from internal canal walls to form a biologic apical stop; bacterial contamination lowers success.',
    revascularization: 'Pulp Revascularization: Copious irrigation + antibiotic paste → induce blood clot scaffold invaded by SCAP → MTA + composite coronal seal → root wall thickening.',
  }[protocol];

  return (
    <ThreeSandboxShell
      title={LEC8.sandboxes3d[2].title}
      metricBadge={protocol === 'mta' ? 'MTA Barrier' : protocol === 'dentin_chips' ? '1 mm Dentin Plug' : 'SCAP Revasc'}
      learningGoal={LEC8.sandboxes3d[2].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.4, -0.3, 6.0), new THREE.Vector3(0, -0.4, 0))
      }
      fallbackSummary="3D open-apex tooth comparing MTA apical barrier + GP backfill, 1 mm dentin chips plug, and pulp revascularization with SCAP blood clot scaffold and coronal MTA seal."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['mta', 'MTA Apical Barrier'],
                ['dentin_chips', 'Dentin Chips Plug'],
                ['revascularization', 'Pulp Revascularization'],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setProtocol(k);
                  onInteract?.();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  protocol === k ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#E6E8EC]/90 mt-1.5 leading-tight">{desc}</p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">Hard Tissue / Apical Maturation</span>
            <span className="font-mono-tabular text-[#C9A24B]">{Math.round(healingPhase * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={healingPhase}
            onChange={(e) => {
              setHealingPhase(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Apical maturation progress"
          />
        </div>
      </div>
    </ThreeSandboxShell>
  );
};
