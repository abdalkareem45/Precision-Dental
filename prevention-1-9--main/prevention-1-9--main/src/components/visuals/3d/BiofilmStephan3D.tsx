import React from 'react';
import * as THREE from 'three';
import { ThreeCanvasContainer } from '../../ThreeCanvasContainer';

export const BiofilmStephan3D: React.FC = () => {
  const initScene = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    const root = new THREE.Group();
    scene.add(root);

    // 1. Enamel Rod / Prism Matrix (Array of hexagonal prisms)
    const prismGroup = new THREE.Group();
    const prismGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.0, 6);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0xFAF8F3,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 0.8,
      transmission: 0.3,
    });

    const rows = 5;
    const cols = 5;
    const prismMeshes: THREE.Mesh[] = [];

    for (let r = -rows; r <= rows; r++) {
      for (let c = -cols; c <= cols; c++) {
        const x = c * 0.45 + (r % 2 ? 0.22 : 0);
        const z = r * 0.38;
        if (Math.sqrt(x * x + z * z) < 2.0) {
          const prism = new THREE.Mesh(prismGeo, prismMat.clone());
          prism.position.set(x, -0.6, z);
          prism.receiveShadow = true;
          prismGroup.add(prism);
          prismMeshes.push(prism);
        }
      }
    }
    root.add(prismGroup);

    // 2. Dental Plaque Biofilm Gel Layer
    const biofilmGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.4, 32);
    const biofilmMat = new THREE.MeshPhysicalMaterial({
      color: 0xD4B968, // Biofilm matrix
      roughness: 0.4,
      transmission: 0.6,
      transparent: true,
      opacity: 0.65,
    });
    const biofilmMesh = new THREE.Mesh(biofilmGeo, biofilmMat);
    biofilmMesh.position.y = 0.5;
    root.add(biofilmMesh);

    // Bacteria Micro-colonies inside biofilm
    const bacteriaGroup = new THREE.Group();
    const bacteriaGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const bacteriaMat = new THREE.MeshStandardMaterial({
      color: 0x854D0E, // Streptococci clusters
      roughness: 0.6,
    });
    for (let i = 0; i < 45; i++) {
      const b = new THREE.Mesh(bacteriaGeo, bacteriaMat);
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 1.8;
      b.position.set(Math.cos(angle) * r, 0.4 + (Math.random() - 0.5) * 0.25, Math.sin(angle) * r);
      bacteriaGroup.add(b);
    }
    root.add(bacteriaGroup);

    // 3. Dynamic Ion Clouds:
    // H+ Acid Ions (Red)
    const acidCount = 60;
    const acidGeo = new THREE.BufferGeometry();
    const acidPos = new Float32Array(acidCount * 3);
    for (let i = 0; i < acidCount * 3; i += 3) {
      acidPos[i] = (Math.random() - 0.5) * 3.5;
      acidPos[i + 1] = 0.4 + Math.random() * 1.5;
      acidPos[i + 2] = (Math.random() - 0.5) * 3.5;
    }
    acidGeo.setAttribute('position', new THREE.BufferAttribute(acidPos, 3));
    const acidMat = new THREE.PointsMaterial({
      color: 0xEF4444, // Red H+ acid ions
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    });
    const acidParticles = new THREE.Points(acidGeo, acidMat);
    root.add(acidParticles);

    // Calcium (Ca2+) & Phosphate (PO43-) mineral ions (Gold / Blue-green)
    const mineralCount = 50;
    const mineralGeo = new THREE.BufferGeometry();
    const mineralPos = new Float32Array(mineralCount * 3);
    for (let i = 0; i < mineralCount * 3; i += 3) {
      mineralPos[i] = (Math.random() - 0.5) * 2.5;
      mineralPos[i + 1] = -0.2 + Math.random() * 1.2;
      mineralPos[i + 2] = (Math.random() - 0.5) * 2.5;
    }
    mineralGeo.setAttribute('position', new THREE.BufferAttribute(mineralPos, 3));
    const mineralMat = new THREE.PointsMaterial({
      color: 0xC9A24B, // Gold mineral ions
      size: 0.07,
      transparent: true,
      opacity: 0.85,
    });
    const mineralParticles = new THREE.Points(mineralGeo, mineralMat);
    root.add(mineralParticles);

    // Slider controls pH from 7.0 down to 4.5
    const setStephanPH = (pH: number) => {
      // Critical pH is 5.5
      const isDemineralizing = pH < 5.5;

      if (isDemineralizing) {
        // High acid, prisms demineralizing (dissolving/rougher)
        biofilmMat.color.setHex(0xEF4444); // Red acidic hue
        acidMat.opacity = 0.95;
        // Prisms lose luster
        prismMeshes.forEach(m => {
          (m.material as THREE.MeshPhysicalMaterial).roughness = 0.65;
          (m.material as THREE.MeshPhysicalMaterial).color.setHex(0xE5E7EB);
        });
      } else {
        // Remineralizing / resting safe pH
        biofilmMat.color.setHex(0x10B981); // Emerald safe biofilm
        acidMat.opacity = 0.15;
        prismMeshes.forEach(m => {
          (m.material as THREE.MeshPhysicalMaterial).roughness = 0.1;
          (m.material as THREE.MeshPhysicalMaterial).color.setHex(0xFAF8F3);
        });
      }
    };

    setStephanPH(7.0);

    return {
      update: (delta: number) => {
        root.rotation.y += delta * 0.1;
        // Animate drifting ions
        const posAcid = acidGeo.attributes.position.array as Float32Array;
        for (let i = 1; i < posAcid.length; i += 3) {
          posAcid[i] -= delta * 0.4;
          if (posAcid[i] < 0.2) posAcid[i] = 2.0;
        }
        acidGeo.attributes.position.needsUpdate = true;

        const posMin = mineralGeo.attributes.position.array as Float32Array;
        for (let i = 1; i < posMin.length; i += 3) {
          posMin[i] += delta * 0.3;
          if (posMin[i] > 1.8) posMin[i] = -0.2;
        }
        mineralGeo.attributes.position.needsUpdate = true;
      },
      onSliderChange: (val: number) => {
        // val 45 to 75 corresponds to pH 4.5 to 7.5
        const pH = val / 10;
        setStephanPH(pH);
      },
      onToggleLayer: (layerId: string) => {
        if (layerId === 'biofilm') biofilmMesh.visible = !biofilmMesh.visible;
        if (layerId === 'bacteria') bacteriaGroup.visible = !bacteriaGroup.visible;
        if (layerId === 'acid') acidParticles.visible = !acidParticles.visible;
        if (layerId === 'minerals') mineralParticles.visible = !mineralParticles.visible;
      },
      resetView: () => {
        root.rotation.set(0, 0, 0);
      },
      dispose: () => {
        prismGeo.dispose();
        prismMat.dispose();
        biofilmGeo.dispose();
        biofilmMat.dispose();
        bacteriaGeo.dispose();
        bacteriaMat.dispose();
        acidGeo.dispose();
        acidMat.dispose();
        mineralGeo.dispose();
        mineralMat.dispose();
      },
    };
  };

  return (
    <ThreeCanvasContainer
      title="3D Enamel Hydroxyapatite Prisms, Biofilm & Stephan Acid Attack"
      badge="Lecture 4 • Molecular Demineralization Dynamics"
      onInitScene={initScene}
      sliderLabel="Simulated Plaque pH Level (4.5 to 7.0 - Critical pH: 5.5)"
      sliderMin={45}
      sliderMax={70}
      sliderStep={1}
      sliderInitial={70}
      layers={[
        { id: 'biofilm', label: 'Biofilm Gel', active: true },
        { id: 'bacteria', label: 'S. mutans Biofilm', active: true },
        { id: 'acid', label: 'H+ Acid Ions', active: true },
        { id: 'minerals', label: 'Ca2+ / PO43- Ions', active: true },
      ]}
      annotations={[
        { label: 'Critical pH 5.5', text: 'Below pH 5.5, the oral environment becomes undersaturated; enamel prisms dissolve.' },
        { label: 'Enamel Rod Prisms', text: 'Densely packed hexagonal hydroxyapatite crystals. Acid penetrates inter-prismatic spaces.' },
        { label: 'Bacterial Biofilm', text: 'Streptococci synthesize insoluble glucans from sucrose, trapping acid directly against enamel.' },
        { label: 'Remineralization Zone', text: 'Above pH 5.5, salivary buffers neutralize acids and redeposit calcium and phosphate crystals.' },
      ]}
    />
  );
};
