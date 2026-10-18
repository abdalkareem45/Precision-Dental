import React from 'react';
import * as THREE from 'three';
import { ThreeCanvasContainer } from '../../ThreeCanvasContainer';

export const SealantProcedure3D: React.FC = () => {
  const initScene = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    const root = new THREE.Group();
    scene.add(root);

    // 1. Molar Crown & Roots (High-craft procedural anatomy)
    const crownGeo = new THREE.CylinderGeometry(1.6, 1.4, 1.8, 32, 8);
    // Sculpt occlusal cusps and central groove
    const pos = crownGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      if (y > 0.6) {
        // Occlusal table sculpting: create 4 cusps (mesiobuccal, distobuccal, mesiolingual, distolingual)
        const distFromCenter = Math.sqrt(x * x + z * z);
        const cuspWave = Math.sin(x * 2.2) * Math.sin(z * 2.2) * 0.45;
        // Central fissure dip
        const fissureDip = Math.exp(-distFromCenter * 2.5) * -0.55;
        pos.setY(i, y + cuspWave + fissureDip);
      }
    }
    crownGeo.computeVertexNormals();

    // Enamel material
    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xFDFBF7, // Natural ivory tooth enamel
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      transmission: 0.15,
      thickness: 0.8,
    });
    const molarCrown = new THREE.Mesh(crownGeo, enamelMat);
    molarCrown.position.y = 0.4;
    molarCrown.castShadow = true;
    molarCrown.receiveShadow = true;
    root.add(molarCrown);

    // Molar Roots (2 bifurcation roots)
    const rootGeo1 = new THREE.ConeGeometry(0.55, 2.2, 16);
    rootGeo1.translate(0.65, -1.5, 0.2);
    const rootGeo2 = new THREE.ConeGeometry(0.5, 2.0, 16);
    rootGeo2.translate(-0.65, -1.4, -0.2);

    const rootMat = new THREE.MeshStandardMaterial({
      color: 0xE8D8B8, // Root cementum
      roughness: 0.5,
      metalness: 0.0,
    });
    const rootMesh1 = new THREE.Mesh(rootGeo1, rootMat);
    const rootMesh2 = new THREE.Mesh(rootGeo2, rootMat);
    root.add(rootMesh1);
    root.add(rootMesh2);

    // Gingival Gum Collar
    const gumGeo = new THREE.TorusGeometry(1.65, 0.4, 16, 32);
    const gumMat = new THREE.MeshStandardMaterial({
      color: 0xE06B7A, // Coral pink gingiva
      roughness: 0.4,
      metalness: 0.05,
    });
    const gumMesh = new THREE.Mesh(gumGeo, gumMat);
    gumMesh.rotation.x = Math.PI / 2;
    gumMesh.position.y = -0.4;
    root.add(gumMesh);

    // 2. Step 4: 37% Phosphoric Acid Etchant Gel (Vibrant Blue Gel in Fissures)
    const etchantGeo = new THREE.CylinderGeometry(0.85, 0.4, 0.25, 24);
    const etchantMat = new THREE.MeshPhysicalMaterial({
      color: 0x0077FF, // Cobalt blue clinical etchant
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.85,
    });
    const etchantMesh = new THREE.Mesh(etchantGeo, etchantMat);
    etchantMesh.position.set(0, 1.4, 0);
    etchantMesh.visible = false;
    root.add(etchantMesh);

    // 3. Step 6: Sealant Resin Layer (Bis-GMA ivory / translucent white flow)
    const sealantGeo = new THREE.CylinderGeometry(0.82, 0.35, 0.2, 24);
    const sealantMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      transmission: 0.4,
      transparent: true,
      opacity: 0.9,
    });
    const sealantMesh = new THREE.Mesh(sealantGeo, sealantMat);
    sealantMesh.position.set(0, 1.38, 0);
    sealantMesh.visible = false;
    root.add(sealantMesh);

    // Step 6 Curing Light Cone (Blue LED Beam)
    const lightConeGeo = new THREE.ConeGeometry(1.2, 3.5, 32, 1, true);
    const lightConeMat = new THREE.MeshBasicMaterial({
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const lightCone = new THREE.Mesh(lightConeGeo, lightConeMat);
    lightCone.rotation.x = Math.PI;
    lightCone.position.set(0, 3.2, 0);
    lightCone.visible = false;
    root.add(lightCone);

    // Step 7: Articulating Paper Blue Contact Dots
    const dotGroup = new THREE.Group();
    const dotGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x1B3A8C });
    const dot1 = new THREE.Mesh(dotGeo, dotMat);
    dot1.position.set(0.65, 1.5, 0.6);
    const dot2 = new THREE.Mesh(dotGeo, dotMat);
    dot2.position.set(-0.65, 1.48, -0.6);
    dotGroup.add(dot1, dot2);
    dotGroup.visible = false;
    root.add(dotGroup);

    // Step 8: Microscopic Resin Tags simulation in cross-section
    const tagsGroup = new THREE.Group();
    const tagGeo = new THREE.CylinderGeometry(0.015, 0.005, 0.4, 8);
    const tagMat = new THREE.MeshBasicMaterial({ color: 0xC9A24B });
    for (let i = 0; i < 28; i++) {
      const tag = new THREE.Mesh(tagGeo, tagMat);
      const angle = (i / 28) * Math.PI * 2;
      const r = 0.2 + Math.random() * 0.4;
      tag.position.set(Math.cos(angle) * r, 1.25 - Math.random() * 0.1, Math.sin(angle) * r);
      tag.rotation.x = (Math.random() - 0.5) * 0.2;
      tag.rotation.z = (Math.random() - 0.5) * 0.2;
      tagsGroup.add(tag);
    }
    tagsGroup.visible = false;
    root.add(tagsGroup);

    // Step handler (1 to 8)
    const setProcedureStep = (step: number) => {
      // Step 1: Normal clean tooth
      if (step <= 2) {
        enamelMat.color.setHex(0xFDFBF7);
        enamelMat.roughness = 0.15;
        etchantMesh.visible = false;
        sealantMesh.visible = false;
        lightCone.visible = false;
        dotGroup.visible = false;
        tagsGroup.visible = false;
      }
      // Step 3: Dry tooth
      else if (step === 3) {
        enamelMat.color.setHex(0xF5EFE4);
        etchantMesh.visible = false;
        sealantMesh.visible = false;
        lightCone.visible = false;
        dotGroup.visible = false;
        tagsGroup.visible = false;
      }
      // Step 4: 37% Phosphoric Acid Etch
      else if (step === 4) {
        etchantMesh.visible = true;
        sealantMesh.visible = false;
        lightCone.visible = false;
        dotGroup.visible = false;
        tagsGroup.visible = false;
      }
      // Step 5: Chalky Frosty White Enamel
      else if (step === 5) {
        etchantMesh.visible = false;
        enamelMat.color.setHex(0xFFFFFF);
        enamelMat.roughness = 0.75; // Chalky dull frosty surface
        sealantMesh.visible = false;
        lightCone.visible = false;
        dotGroup.visible = false;
        tagsGroup.visible = false;
      }
      // Step 6: Sealant Application & Light Cure
      else if (step === 6) {
        etchantMesh.visible = false;
        sealantMesh.visible = true;
        lightCone.visible = true;
        dotGroup.visible = false;
        tagsGroup.visible = false;
      }
      // Step 7: Occlusal & Articulating Paper Check
      else if (step === 7) {
        etchantMesh.visible = false;
        sealantMesh.visible = true;
        lightCone.visible = false;
        dotGroup.visible = true;
        tagsGroup.visible = false;
      }
      // Step 8: Long-term Resin Tags Inspection
      else if (step >= 8) {
        etchantMesh.visible = false;
        sealantMesh.visible = true;
        lightCone.visible = false;
        dotGroup.visible = false;
        tagsGroup.visible = true;
      }
    };

    setProcedureStep(1);

    return {
      update: (delta: number) => {
        root.rotation.y += delta * 0.15;
      },
      onSliderChange: (val: number) => {
        setProcedureStep(Math.round(val));
      },
      onToggleLayer: (layerId: string) => {
        if (layerId === 'gum') gumMesh.visible = !gumMesh.visible;
        if (layerId === 'sealant') sealantMesh.visible = !sealantMesh.visible;
        if (layerId === 'tags') tagsGroup.visible = !tagsGroup.visible;
      },
      resetView: () => {
        root.rotation.set(0, 0, 0);
      },
      dispose: () => {
        crownGeo.dispose();
        enamelMat.dispose();
        rootGeo1.dispose();
        rootGeo2.dispose();
        rootMat.dispose();
        gumGeo.dispose();
        gumMat.dispose();
        etchantGeo.dispose();
        etchantMat.dispose();
        sealantGeo.dispose();
        sealantMat.dispose();
        lightConeGeo.dispose();
        lightConeMat.dispose();
      },
    };
  };

  return (
    <ThreeCanvasContainer
      title="3D Occlusal Molar & 8-Step Sealant Procedure Simulator"
      badge="Lecture 2 • Clinical Protocol Simulation"
      onInitScene={initScene}
      sliderLabel="Clinical Procedure Step (1 to 8)"
      sliderMin={1}
      sliderMax={8}
      sliderStep={1}
      sliderInitial={1}
      layers={[
        { id: 'sealant', label: 'Sealant Barrier', active: true },
        { id: 'tags', label: 'Resin Microtags', active: true },
        { id: 'gum', label: 'Gingiva', active: true },
      ]}
      annotations={[
        { label: 'Step 1: Clean', text: 'Clean occlusal pits with pumice slurry or air abrasion to remove organic debris.' },
        { label: 'Step 2: Isolate', text: 'Rubber dam or cotton rolls + bibulous pads. Saliva contamination destroys microtag bonding!' },
        { label: 'Step 4: Etch', text: '37% Phosphoric acid applied for 20s (35s on fluorosed teeth). Extends 2mm up cusps.' },
        { label: 'Step 5: Frosty', text: 'Rinse 10s, dry 10s. Enamel must appear chalky, dull, and frosty white.' },
        { label: 'Step 6: Cure', text: 'Flow Bis-GMA sealant into deepest pits; cure with 400-500 nm blue LED. Wipe oxygen layer.' },
        { label: 'Step 8: Tags', text: 'Even if the outer bulk wears down, 50-micron resin tags retained in enamel prisms prevent caries!' },
      ]}
    />
  );
};
