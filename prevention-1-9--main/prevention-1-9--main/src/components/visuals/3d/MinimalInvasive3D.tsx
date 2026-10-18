import React from 'react';
import * as THREE from 'three';
import { ThreeCanvasContainer } from '../../ThreeCanvasContainer';

export const MinimalInvasive3D: React.FC = () => {
  const initScene = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    const root = new THREE.Group();
    scene.add(root);

    // Tooth Half Cutaway (Cross-section view)
    // 1. Sound Enamel Outer Shell (cutaway 180 degrees)
    const enamelGeo = new THREE.CylinderGeometry(1.6, 1.4, 2.0, 32, 1, false, 0, Math.PI);
    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xFDFBF7,
      roughness: 0.15,
      transmission: 0.2,
      side: THREE.DoubleSide,
    });
    const enamelMesh = new THREE.Mesh(enamelGeo, enamelMat);
    enamelMesh.position.y = 0.5;
    root.add(enamelMesh);

    // 2. Sound Dentin Core
    const dentinGeo = new THREE.CylinderGeometry(1.2, 1.0, 1.8, 32, 1, false, 0, Math.PI);
    const dentinMat = new THREE.MeshStandardMaterial({
      color: 0xEAD8B5, // Warm yellowish dentin
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const dentinMesh = new THREE.Mesh(dentinGeo, dentinMat);
    dentinMesh.position.y = 0.45;
    root.add(dentinMesh);

    // 3. Pulp Chamber (Inner Vital Core)
    const pulpGeo = new THREE.CylinderGeometry(0.35, 0.2, 1.4, 16, 1, false, 0, Math.PI);
    const pulpMat = new THREE.MeshStandardMaterial({
      color: 0xDC2626, // Red vascular pulp tissue
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const pulpMesh = new THREE.Mesh(pulpGeo, pulpMat);
    pulpMesh.position.y = 0.25;
    root.add(pulpMesh);

    // 4. Demineralized Affected Layer (Precarious inner zone, intact collagen)
    const deminGeo = new THREE.SphereGeometry(0.65, 24, 24, 0, Math.PI, 0, Math.PI / 2);
    const deminMat = new THREE.MeshStandardMaterial({
      color: 0xD97706, // Amber / Golden Brown
      roughness: 0.6,
      side: THREE.DoubleSide,
    });
    const deminMesh = new THREE.Mesh(deminGeo, deminMat);
    deminMesh.rotation.x = Math.PI;
    deminMesh.position.set(0, 1.35, 0.4);
    root.add(deminMesh);

    // 5. Outer Infected Layer (Necrotic, denatured collagen with bacteria)
    const infectedGeo = new THREE.SphereGeometry(0.42, 24, 24, 0, Math.PI, 0, Math.PI / 2);
    const infectedMat = new THREE.MeshStandardMaterial({
      color: 0x451A03, // Dark necrotic carious brown
      roughness: 0.85,
      side: THREE.DoubleSide,
    });
    const infectedMesh = new THREE.Mesh(infectedGeo, infectedMat);
    infectedMesh.rotation.x = Math.PI;
    infectedMesh.position.set(0, 1.36, 0.4);
    root.add(infectedMesh);

    // 6. Restorative Filling / Sealant (Composite Resin / PRR)
    const prrGeo = new THREE.SphereGeometry(0.44, 24, 24, 0, Math.PI, 0, Math.PI / 2);
    const prrMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      roughness: 0.1,
      clearcoat: 1.0,
      side: THREE.DoubleSide,
    });
    const prrMesh = new THREE.Mesh(prrGeo, prrMat);
    prrMesh.rotation.x = Math.PI;
    prrMesh.position.set(0, 1.36, 0.4);
    prrMesh.visible = false;
    root.add(prrMesh);

    // Air Abrasion Particle Jet simulation
    const particleCount = 40;
    const jetGeo = new THREE.BufferGeometry();
    const jetPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      jetPositions[i] = (Math.random() - 0.5) * 0.15;
      jetPositions[i + 1] = 1.4 + Math.random() * 1.5;
      jetPositions[i + 2] = 0.4 + (Math.random() - 0.5) * 0.15;
    }
    jetGeo.setAttribute('position', new THREE.BufferAttribute(jetPositions, 3));
    const jetMat = new THREE.PointsMaterial({
      color: 0x93C5FD, // Aluminum oxide particles
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const jetParticles = new THREE.Points(jetGeo, jetMat);
    jetParticles.visible = false;
    root.add(jetParticles);

    // G.V. Black Cavity Outline (Over-extended destructive box)
    const gvOutlineGeo = new THREE.BoxGeometry(1.6, 0.9, 0.8);
    const gvOutlineMat = new THREE.MeshBasicMaterial({
      color: 0xEF4444,
      wireframe: true,
      transparent: true,
      opacity: 0.0,
    });
    const gvBox = new THREE.Mesh(gvOutlineGeo, gvOutlineMat);
    gvBox.position.set(0, 1.05, 0.4);
    root.add(gvBox);

    const updateMIDMode = (val: number) => {
      // val 0: Raw cavity
      // val 1: G.V. Black Extension for Prevention (Destructive)
      // val 2: Air Abrasion / Laser selective excavation
      // val 3: Chemo-Mechanical Caries Removal (CMCR 30s)
      // val 4: PRR Completed with Remineralized Demineralized Base

      if (val === 0) {
        infectedMesh.visible = true;
        deminMesh.visible = true;
        deminMat.color.setHex(0xD97706); // Demineralized amber
        prrMesh.visible = false;
        jetParticles.visible = false;
        gvOutlineMat.opacity = 0.0;
      } else if (val === 1) {
        // G.V. Black destructive outline
        infectedMesh.visible = true;
        deminMesh.visible = true;
        prrMesh.visible = false;
        jetParticles.visible = false;
        gvOutlineMat.opacity = 0.9;
      } else if (val === 2) {
        // Air abrasion jet active
        infectedMesh.visible = false;
        deminMesh.visible = true;
        prrMesh.visible = false;
        jetParticles.visible = true;
        gvOutlineMat.opacity = 0.0;
      } else if (val === 3) {
        // CMCR: Infected layer dissolved
        infectedMesh.visible = false;
        deminMesh.visible = true;
        prrMesh.visible = false;
        jetParticles.visible = false;
        gvOutlineMat.opacity = 0.0;
      } else if (val >= 4) {
        // PRR restored + Demineralized layer remineralized to healthy dentin tone!
        infectedMesh.visible = false;
        deminMesh.visible = true;
        deminMat.color.setHex(0xEAD8B5); // Remineralized!
        prrMesh.visible = true;
        jetParticles.visible = false;
        gvOutlineMat.opacity = 0.0;
      }
    };

    updateMIDMode(0);

    return {
      update: (delta: number) => {
        root.rotation.y += delta * 0.12;
      },
      onSliderChange: (val: number) => {
        updateMIDMode(Math.round(val));
      },
      onToggleLayer: (layerId: string) => {
        if (layerId === 'pulp') pulpMesh.visible = !pulpMesh.visible;
        if (layerId === 'demin') deminMesh.visible = !deminMesh.visible;
        if (layerId === 'infected') infectedMesh.visible = !infectedMesh.visible;
      },
      resetView: () => {
        root.rotation.set(0, 0, 0);
      },
      dispose: () => {
        enamelGeo.dispose();
        enamelMat.dispose();
        dentinGeo.dispose();
        dentinMat.dispose();
        pulpGeo.dispose();
        pulpMat.dispose();
        deminGeo.dispose();
        deminMat.dispose();
        infectedGeo.dispose();
        infectedMat.dispose();
        prrGeo.dispose();
        prrMat.dispose();
      },
    };
  };

  return (
    <ThreeCanvasContainer
      title="3D Cavity Anatomy: Infected vs Demineralized Layer & MID Preparation"
      badge="Lecture 3 • Minimal Intervention Restorative Cross-Section"
      onInitScene={initScene}
      sliderLabel="Preparation Mode: (0=Cavity, 1=G.V. Black, 2=Air Abrasion, 3=CMCR, 4=PRR Done)"
      sliderMin={0}
      sliderMax={4}
      sliderStep={1}
      sliderInitial={0}
      layers={[
        { id: 'infected', label: 'Infected Layer', active: true },
        { id: 'demin', label: 'Demineralized Layer', active: true },
        { id: 'pulp', label: 'Pulp Complex', active: true },
      ]}
      annotations={[
        { label: 'Infected Layer', text: 'Outer layer: irreversibly denatured collagen, filled with active bacteria. MUST be selectively removed.' },
        { label: 'Demineralized Layer', text: 'Inner affected layer: intact collagen scaffold. Precarious but capable of remineralization—DO NOT DRILL!' },
        { label: 'Pulp-Dentin Complex', text: 'Biological vitality preserved by avoiding surgical over-extension and thermal injury.' },
        { label: 'Air Abrasion / CMCR', text: 'Selective tools remove only soft infected tissue, leaving sound and demineralized tissue intact.' },
      ]}
    />
  );
};
