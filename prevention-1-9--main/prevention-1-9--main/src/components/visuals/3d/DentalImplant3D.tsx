import React from 'react';
import * as THREE from 'three';
import { ThreeCanvasContainer } from '../../ThreeCanvasContainer';

export const DentalImplant3D: React.FC = () => {
  const initScene = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    const root = new THREE.Group();
    scene.add(root);

    // 1. Natural Tooth (Left Side)
    const naturalGroup = new THREE.Group();
    naturalGroup.position.set(-1.8, 0, 0);

    // Natural Crown & Root
    const nCrownGeo = new THREE.CylinderGeometry(0.8, 0.7, 1.3, 24);
    const nCrownMat = new THREE.MeshPhysicalMaterial({
      color: 0xFDFBF7,
      roughness: 0.15,
      clearcoat: 0.8,
    });
    const nCrown = new THREE.Mesh(nCrownGeo, nCrownMat);
    nCrown.position.y = 1.0;
    naturalGroup.add(nCrown);

    const nRootGeo = new THREE.ConeGeometry(0.6, 2.0, 24);
    const nRootMat = new THREE.MeshStandardMaterial({
      color: 0xE2D3B8,
      roughness: 0.5,
    });
    const nRoot = new THREE.Mesh(nRootGeo, nRootMat);
    nRoot.position.y = -0.6;
    naturalGroup.add(nRoot);

    // Perpendicular Sharpey's Fibers (Inserting directly into cementum!)
    const sharpeyGroup = new THREE.Group();
    const sfGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6);
    const sfMat = new THREE.MeshBasicMaterial({ color: 0x10B981 }); // Green = strong perpendicular insertion
    for (let i = 0; i < 28; i++) {
      const f = new THREE.Mesh(sfGeo, sfMat);
      const angle = (i / 28) * Math.PI * 2;
      f.rotation.z = Math.PI / 2;
      f.rotation.y = angle;
      f.position.set(Math.cos(angle) * 0.45, -0.2 - Math.random() * 0.8, Math.sin(angle) * 0.45);
      sharpeyGroup.add(f);
    }
    naturalGroup.add(sharpeyGroup);
    root.add(naturalGroup);

    // 2. Dental Implant (Right Side)
    const implantGroup = new THREE.Group();
    implantGroup.position.set(1.8, 0, 0);

    // Implant Crown (Porcelain)
    const iCrownGeo = new THREE.CylinderGeometry(0.8, 0.7, 1.3, 24);
    const iCrownMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      roughness: 0.1,
      clearcoat: 1.0,
    });
    const iCrown = new THREE.Mesh(iCrownGeo, iCrownMat);
    iCrown.position.y = 1.0;
    implantGroup.add(iCrown);

    // Titanium Abutment Collar
    const abutmentGeo = new THREE.CylinderGeometry(0.65, 0.55, 0.6, 24);
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x94A3B8, // Metallic grey titanium
      roughness: 0.25,
      metalness: 0.85,
    });
    const abutment = new THREE.Mesh(abutmentGeo, titaniumMat);
    abutment.position.y = 0.1;
    implantGroup.add(abutment);

    // Titanium Threaded Fixture (Screw Body)
    const fixtureGeo = new THREE.CylinderGeometry(0.55, 0.4, 1.8, 24);
    const fixture = new THREE.Mesh(fixtureGeo, titaniumMat);
    fixture.position.y = -1.0;
    implantGroup.add(fixture);

    // Screw Thread Rings
    const threadMat = new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.9, roughness: 0.2 });
    for (let i = 0; i < 6; i++) {
      const ringGeo = new THREE.TorusGeometry(0.52 - i * 0.02, 0.04, 12, 24);
      const ring = new THREE.Mesh(ringGeo, threadMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.4 - i * 0.25;
      implantGroup.add(ring);
    }

    // Parallel Mucosal Fibers (Run parallel to titanium with NO perpendicular insertion!)
    const parallelGroup = new THREE.Group();
    const pfGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 6);
    const pfMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 }); // Red = weak non-inserting parallel fibers
    for (let i = 0; i < 20; i++) {
      const f = new THREE.Mesh(pfGeo, pfMat);
      const angle = (i / 20) * Math.PI * 2;
      f.position.set(Math.cos(angle) * 0.7, 0.1 + (Math.random() - 0.5) * 0.2, Math.sin(angle) * 0.7);
      parallelGroup.add(f);
    }
    implantGroup.add(parallelGroup);

    // Metal Scratch Marks (caused by stainless steel scaler!)
    const scratchGroup = new THREE.Group();
    const scratchMat = new THREE.MeshBasicMaterial({ color: 0x1E293B });
    for (let i = 0; i < 8; i++) {
      const sGeo = new THREE.BoxGeometry(0.02, 0.4, 0.02);
      const s = new THREE.Mesh(sGeo, scratchMat);
      const angle = (i / 8) * Math.PI * 2;
      s.position.set(Math.cos(angle) * 0.66, 0.1, Math.sin(angle) * 0.66);
      s.rotation.y = angle;
      s.rotation.z = (Math.random() - 0.5) * 0.4;
      scratchGroup.add(s);
    }
    scratchGroup.visible = false;
    implantGroup.add(scratchGroup);

    // Peri-implantitis Circumferential Crater Bone Loss Ring
    const craterGeo = new THREE.CylinderGeometry(1.2, 0.6, 0.8, 24, 1, true);
    const craterMat = new THREE.MeshBasicMaterial({
      color: 0x991B1B,
      wireframe: true,
      transparent: true,
      opacity: 0.0,
    });
    const crater = new THREE.Mesh(craterGeo, craterMat);
    crater.position.set(0, -0.4, 0);
    implantGroup.add(crater);

    root.add(implantGroup);

    // Shared Alveolar Bone Base
    const boneGeo = new THREE.BoxGeometry(5.2, 1.8, 2.0);
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xF1F5F9,
      roughness: 0.75,
    });
    const bone = new THREE.Mesh(boneGeo, boneMat);
    bone.position.y = -1.2;
    root.add(bone);

    // Update Slider / Clinical State
    // 0 = Normal Healthy Comparison (Natural Sharpey vs Implant Parallel)
    // 1 = Safe Hygiene (Plastic/Gold/Teflon scaler - pristine titanium)
    // 2 = Metal Scaler Violation (Scratched titanium gouges!)
    // 3 = Peri-implantitis Progression (Circumferential saucer bone loss crater)
    const setImplantState = (state: number) => {
      if (state <= 1) {
        titaniumMat.roughness = 0.25;
        scratchGroup.visible = false;
        craterMat.opacity = 0.0;
        iCrown.position.y = 1.0;
      } else if (state === 2) {
        // Scratched!
        titaniumMat.roughness = 0.85;
        scratchGroup.visible = true;
        craterMat.opacity = 0.0;
      } else if (state >= 3) {
        // Advanced peri-implantitis bone loss
        titaniumMat.roughness = 0.95;
        scratchGroup.visible = true;
        craterMat.opacity = 0.8;
      }
    };

    setImplantState(0);

    return {
      update: (delta: number) => {
        root.rotation.y += delta * 0.12;
      },
      onSliderChange: (val: number) => {
        setImplantState(Math.round(val));
      },
      onToggleLayer: (layerId: string) => {
        if (layerId === 'natural') naturalGroup.visible = !naturalGroup.visible;
        if (layerId === 'implant') implantGroup.visible = !implantGroup.visible;
        if (layerId === 'scratches') scratchGroup.visible = !scratchGroup.visible;
      },
      resetView: () => {
        root.rotation.set(0, 0, 0);
      },
      dispose: () => {
        nCrownGeo.dispose();
        nCrownMat.dispose();
        nRootGeo.dispose();
        nRootMat.dispose();
        iCrownGeo.dispose();
        iCrownMat.dispose();
        abutmentGeo.dispose();
        titaniumMat.dispose();
        fixtureGeo.dispose();
        boneGeo.dispose();
        boneMat.dispose();
        craterGeo.dispose();
        craterMat.dispose();
      },
    };
  };

  return (
    <ThreeCanvasContainer
      title="3D Comparative Anatomy: Natural Tooth vs Titanium Dental Implant"
      badge="Lecture 9 • Biologic Seal & Instrument Scratch Simulator"
      onInitScene={initScene}
      sliderLabel="Hygiene & Pathology: 0=Baseline, 1=Plastic Scaler (Safe), 2=Metal Scaler Damage, 3=Peri-Implantitis"
      sliderMin={0}
      sliderMax={3}
      sliderStep={1}
      sliderInitial={0}
      layers={[
        { id: 'natural', label: 'Natural Tooth (Left)', active: true },
        { id: 'implant', label: 'Dental Implant (Right)', active: true },
        { id: 'scratches', label: 'Titanium Scratches', active: false },
      ]}
      annotations={[
        { label: 'Sharpey vs Parallel', text: 'Natural teeth have perpendicular Sharpey fibers inserting into cementum. Implants have only parallel fibers with no attachment.' },
        { label: 'NEVER Metal Scalers', text: 'Metal instruments gouge micro-scratches into titanium, accelerating bacterial colonization and bone cratering.' },
        { label: 'Approved Armamentarium', text: 'Use plastic-, gold-, or Teflon-coated scalers and nylon-coated interdental brushes only!' },
        { label: 'Percussion Test', text: 'Crisp ringing acoustic sound = rigid osseointegration; dull hollow thud = failure / fibrous encapsulation.' },
      ]}
    />
  );
};
