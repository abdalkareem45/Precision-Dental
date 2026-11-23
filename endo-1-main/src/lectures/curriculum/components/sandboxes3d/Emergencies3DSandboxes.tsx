import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeSandboxShell } from '../ThreeSandboxShell';
import { createStudioScene, createTrabecularBoneTexture, StudioContext } from '../../three/studioEngine';
import { buildCutawayToothGroup } from '../../three/dentalGeometry';
import { LECTURES } from '../../data/lectures';

const LEC9 = LECTURES[6];

type InflammationStage = 'hypersensitivity' | 'reversible' | 'irreversible' | 'sap' | 'abscess';

// ============================================================================
// 1. Pulpal & Periapical Inflammation Cascade Explorer (Lecture 9, Sandbox 1)
// ============================================================================
export const InflammationCascadeSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [stage, setStage] = useState<InflammationStage>('sap');
  const stateRef = useRef({ stage });
  stateRef.current = { stage };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.5, -0.2, 6.2],
      target: [0, -0.3, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const boneTex = createTrabecularBoneTexture(studio.maxAnisotropy);
    const socket = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 2.3, 1.8),
      new THREE.MeshStandardMaterial({ map: boneTex, roughness: 0.85, transparent: true, opacity: 0.45 })
    );
    socket.position.set(0, -1.5, 0);
    studio.scene.add(socket);

    const { group: toothGroup, canalMesh } = buildCutawayToothGroup({});
    studio.scene.add(toothGroup);

    // Cervical dentin exposure patch (for dentin hypersensitivity)
    const cervicalDefect = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.36, 0.55),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
    );
    cervicalDefect.position.set(-0.68, 0.65, 0.2);
    toothGroup.add(cervicalDefect);

    // PDL fluid pressure cushion & Abscess pus sac at apex
    const pdlFluid = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 22, 22),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.72,
      })
    );
    pdlFluid.position.set(0, -2.35, 0);
    studio.scene.add(pdlFluid);

    let currToothY = 0.2;
    let currLesionScale = 0.4;

    studio.startLoop((dt, elapsed) => {
      const { stage: st } = stateRef.current;
      const canalMat = canalMesh.material as THREE.MeshStandardMaterial;

      cervicalDefect.visible = st === 'hypersensitivity';

      if (st === 'hypersensitivity') {
        canalMat.color.setHex(0xbe123c);
        canalMat.emissive.setHex(0x000000);
      } else if (st === 'reversible') {
        canalMat.color.setHex(0xf97316);
        canalMat.emissive.setHex(0x7c2d12);
      } else if (st === 'irreversible') {
        canalMat.color.setHex(0xef4444);
        canalMat.emissive.setHex(0x991b1b);
      } else {
        canalMat.color.setHex(0x57534e);
        canalMat.emissive.setHex(0x1c1917);
      }

      // Tooth elevates in socket in SAP and Acute Abscess!
      const targetToothY = st === 'sap' ? 0.52 : st === 'abscess' ? 0.58 : 0.2;
      currToothY = THREE.MathUtils.damp(currToothY, targetToothY, 6, dt);
      toothGroup.position.y = currToothY;

      const targetScale = st === 'sap' ? 0.85 : st === 'abscess' ? 1.55 : 0.01;
      currLesionScale = THREE.MathUtils.damp(currLesionScale, targetScale, 6, dt);
      pdlFluid.visible = currLesionScale > 0.05;
      pdlFluid.scale.setScalar(currLesionScale + Math.sin(elapsed * 4) * 0.03);
      (pdlFluid.material as THREE.MeshStandardMaterial).color.setHex(
        st === 'abscess' ? 0xfacc15 : 0xf97316
      );
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const stageDetails: Record<InflammationStage, { title: string; summary: string; management: string }> = {
    hypersensitivity: {
      title: 'Dentin Hypersensitivity',
      summary: 'Sharp, short pain from exposed cervical dentin (enamel loss or gingival recession).',
      management: 'Plug dentinal tubules, desensitize nerve, or restore lost structure with composite.',
    },
    reversible: {
      title: 'Symptomatic Reversible Pulpitis',
      summary: 'Localized pulp inflammation; lowered Aδ threshold; exaggerated NON-lingering response.',
      management: 'Excavate caries & restore; recontour high restoration or place sedative dressing.',
    },
    irreversible: {
      title: 'Symptomatic Irreversible Pulpitis',
      summary: 'Intermittent/spontaneous pain; intense PROLONGED pain after thermal stimulus removal.',
      management: 'Clean root canal(s) to WL, place Ca(OH)₂ medicament, temporary seal, check occlusion, analgesic.',
    },
    sap: {
      title: 'Symptomatic Apical Periodontitis',
      summary: 'PDL fluid pressure elevates tooth in socket; biting discomfort & percussion sensitivity (hallmark).',
      management: 'Relieve occlusion, access, total pulp extirpation, clean/irrigate/dry, Ca(OH)₂, temp fill, analgesics.',
    },
    abscess: {
      title: 'Acute Periapical Abscess',
      summary: 'Bacterial extrusion forms pus collection, swelling, elevated tooth, and systemic fever.',
      management: 'Debride pulp, I&D if swelling, do NOT leave open, antibiotics ONLY if systemic fever, NSAIDs, use BLOCK anesthesia.',
    },
  };

  const info = stageDetails[stage];

  return (
    <ThreeSandboxShell
      title={LEC9.sandboxes3d[0].title}
      metricBadge={info.title}
      learningGoal={LEC9.sandboxes3d[0].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.5, -0.2, 6.2), new THREE.Vector3(0, -0.3, 0))
      }
      fallbackSummary="3D tooth and alveolar socket demonstrating cervical dentin exposure, pulpal inflammation progression, PDL fluid tooth elevation in SAP, and pus collection in acute periapical abscess."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right max-w-xs">
          <div className="text-[11px] font-bold text-[#C9A24B]">{info.title}</div>
          <div className="text-[11px] text-[#E6E8EC]">{info.summary}</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-2">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ['hypersensitivity', '1. Dentin Hypersensitivity'],
              ['reversible', '2. Reversible Pulpitis'],
              ['irreversible', '3. Irreversible Pulpitis'],
              ['sap', '4. Symptomatic Apical Periodontitis'],
              ['abscess', '5. Acute Abscess'],
            ] as const
          ).map(([k, lbl]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setStage(k);
                onInteract?.();
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                stage === k ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[#E6E8EC]/90">
          <strong className="text-[#C9A24B]">Management:</strong> {info.management}
        </p>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 2. Cracked Tooth Syndrome & Fracture Depth Lab (Lecture 9, Sandbox 2)
// ============================================================================
export const CrackedToothSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [crackDepth, setCrackDepth] = useState<'crown' | 'pulp_supracrestal' | 'subcrestal'>('pulp_supracrestal');
  const [biteTest, setBiteTest] = useState(false);
  const stateRef = useRef({ crackDepth, biteTest });
  stateRef.current = { crackDepth, biteTest };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.4, 0.4, 6.0],
      target: [0, 0, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const { group: toothGroup } = buildCutawayToothGroup({});
    studio.scene.add(toothGroup);

    // Large pre-existing restoration in crown
    const restoration = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.65, 0.95),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.78, roughness: 0.25 })
    );
    restoration.position.set(0, 1.85, 0);
    toothGroup.add(restoration);

    // Alveolar bone crest collar
    const boneCrest = new THREE.Mesh(
      new THREE.CylinderGeometry(1.35, 1.35, 1.8, 28, 1, true, Math.PI * 0.25, Math.PI * 1.48),
      new THREE.MeshStandardMaterial({ color: 0xc9b493, roughness: 0.85, side: THREE.DoubleSide })
    );
    boneCrest.position.set(0, -1.05, 0);
    studio.scene.add(boneCrest);

    // Crack plane propagating downward
    const crackPlane = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 1.0, 1.05),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e })
    );
    studio.scene.add(crackPlane);

    // Cotton roll lateral chewing diagnostic cylinder
    const cottonRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 1.1, 18),
      new THREE.MeshStandardMaterial({ color: 0xfaf8f3, roughness: 0.9 })
    );
    cottonRoll.rotation.z = Math.PI / 2;
    cottonRoll.position.set(0.35, 2.55, 0.2);
    studio.scene.add(cottonRoll);

    studio.startLoop((dt, elapsed) => {
      const { crackDepth: cd, biteTest: bt } = stateRef.current;
      const targetHeight = cd === 'crown' ? 0.9 : cd === 'pulp_supracrestal' ? 1.9 : 3.2;
      const targetY = cd === 'crown' ? 1.55 : cd === 'pulp_supracrestal' ? 1.0 : 0.25;
      crackPlane.scale.y = THREE.MathUtils.damp(crackPlane.scale.y, targetHeight, 7, dt);
      crackPlane.position.y = THREE.MathUtils.damp(crackPlane.position.y, targetY, 7, dt);

      cottonRoll.visible = bt;
      if (bt) {
        cottonRoll.position.y = 2.48 + Math.sin(elapsed * 5) * 0.08;
        toothGroup.rotation.z = Math.sin(elapsed * 5) * 0.025;
      } else {
        toothGroup.rotation.z = THREE.MathUtils.damp(toothGroup.rotation.z, 0, 8, dt);
      }
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const plan = {
    crown: 'Crown Portion Only: Reduce occlusal contact immediately + Full Crown Coverage.',
    pulp_supracrestal: 'Pulp Involved & Superficial to Alveolar Bone: Reduce occlusion + Endodontic Treatment (+ crown).',
    subcrestal: 'Crack Below Alveolar Bone: Non-restorable vertical extension — Extraction is necessary.',
  }[crackDepth];

  return (
    <ThreeSandboxShell
      title={LEC9.sandboxes3d[1].title}
      metricBadge={crackDepth === 'crown' ? 'Full Crown' : crackDepth === 'pulp_supracrestal' ? 'Endo + Crown' : 'Extraction'}
      learningGoal={LEC9.sandboxes3d[1].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.4, 0.4, 6.0), new THREE.Vector3(0, 0, 0))
      }
      fallbackSummary="3D molar with large restoration showing crack depth relative to pulp chamber and alveolar bone crest, plus lateral cotton-roll chewing test."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['crown', '1. Crown Only'],
                ['pulp_supracrestal', '2. Pulp (Above Bone)'],
                ['subcrestal', '3. Below Alveolar Bone'],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setCrackDepth(k);
                  onInteract?.();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  crackDepth === k ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#E6E8EC]/90 mt-1.5 leading-tight">{plan}</p>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 text-xs text-[#E6E8EC] cursor-pointer">
            <input
              type="checkbox"
              checked={biteTest}
              onChange={(e) => {
                setBiteTest(e.target.checked);
                onInteract?.();
              }}
              className="accent-[#C9A24B]"
            />
            <span>Simulate Lateral Cotton-Roll Bite Test</span>
          </label>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 3. Hypochlorite Extrusion Accident & Over-Extension Lab (Lecture 9, Sandbox 3)
// ============================================================================
export const NaoclOverextensionSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [scenario, setScenario] = useState<'naocl' | 'overextended_gp'>('naocl');
  const [resolved, setResolved] = useState(false);
  const stateRef = useRef({ scenario, resolved });
  stateRef.current = { scenario, resolved };

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

    // Irrigation needle
    const needle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.8, 12),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.18 })
    );
    needle.position.set(0, 0.25, 0);
    studio.scene.add(needle);

    // Extruded NaOCl tissue reaction cloud (edema / ecchymosis / necrosis)
    const naoclCloud = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0xe11d48,
        emissive: 0x9f1239,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.62,
      })
    );
    naoclCloud.position.set(0, -2.55, 0);
    studio.scene.add(naoclCloud);

    // Over-extended GP cone protruding beyond apex
    const overGp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.05, 3.6, 16),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 })
    );
    overGp.position.set(0, -0.85, 0);
    studio.scene.add(overGp);

    studio.startLoop((dt, elapsed) => {
      const { scenario: sc, resolved: res } = stateRef.current;
      needle.visible = sc === 'naocl';
      naoclCloud.visible = sc === 'naocl';
      overGp.visible = sc === 'overextended_gp';

      if (sc === 'naocl') {
        const targetCloudScale = res ? 0.38 : 1.05;
        naoclCloud.scale.x = THREE.MathUtils.damp(naoclCloud.scale.x, targetCloudScale, 5, dt);
        naoclCloud.scale.y = naoclCloud.scale.x;
        naoclCloud.scale.z = naoclCloud.scale.x;
        (naoclCloud.material as THREE.MeshStandardMaterial).color.setHex(
          res ? 0x38bdf8 : 0xe11d48
        );
        needle.position.y = res ? 1.1 : 0.05 + Math.sin(elapsed * 2) * 0.08;
      } else {
        const targetGpY = res ? -0.15 : -0.95; // Retreat to exact WL vs protruding apically
        overGp.position.y = THREE.MathUtils.damp(overGp.position.y, targetGpY, 6, dt);
      }
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  return (
    <ThreeSandboxShell
      title={LEC9.sandboxes3d[2].title}
      metricBadge={scenario === 'naocl' ? 'Ice <24h · Warm >24h' : 'Exact WL Stop'}
      learningGoal={LEC9.sandboxes3d[2].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.4, -0.3, 6.0), new THREE.Vector3(0, -0.4, 0))
      }
      fallbackSummary="3D emergency visualizer for forceful NaOCl extrusion through wide/immature apex (edema, ecchymosis, necrosis, paresthesia) and over-extended gutta-percha retreatment."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setScenario('naocl');
                onInteract?.();
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                scenario === 'naocl' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
              }`}
            >
              Hypochlorite Accident
            </button>
            <button
              type="button"
              onClick={() => {
                setScenario('overextended_gp');
                onInteract?.();
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                scenario === 'overextended_gp' ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
              }`}
            >
              Over-Extended Obturation
            </button>
          </div>
          <p className="text-[11px] text-[#E6E8EC]/90 mt-1.5 leading-tight">
            {scenario === 'naocl'
              ? 'Immediate aspiration + icepacks (<24h), warm packs (>24h), antibiotics, analgesics, antihistamines; steroids/hospitalization if severe.'
              : 'Re-instrument to exact WL to create an apical stop; carefully retreat over-extended gutta-percha and prescribe analgesics.'}
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              setResolved((r) => !r);
              onInteract?.();
            }}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              resolved ? 'bg-emerald-400 text-[#0B1F4D]' : 'bg-[#1B3A8C] text-[#FAF8F3] hover:bg-[#C9A24B] hover:text-[#0B1F4D]'
            }`}
          >
            {resolved
              ? scenario === 'naocl'
                ? 'Active Management Applied (Reset)'
                : 'Corrected to Exact WL (Reset)'
              : scenario === 'naocl'
              ? 'Apply Aspiration & Cold Pack Protocol'
              : 'Retreat & Establish Exact WL Stop'}
          </button>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};
