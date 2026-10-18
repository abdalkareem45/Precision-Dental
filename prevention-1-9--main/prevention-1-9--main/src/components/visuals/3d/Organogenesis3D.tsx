import React from 'react';
import * as THREE from 'three';
import { ThreeCanvasContainer } from '../../ThreeCanvasContainer';

export const Organogenesis3D: React.FC = () => {
  const initScene = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    const root = new THREE.Group();
    scene.add(root);

    // 1. Tooth Crown Model with procedural hypoplastic pitting deformation
    const crownGeo = new THREE.CylinderGeometry(1.4, 1.1, 2.0, 32, 16);
    const crownMat = new THREE.MeshPhysicalMaterial({
      color: 0xFDFBF7,
      roughness: 0.15,
      clearcoat: 0.8,
    });
    const crown = new THREE.Mesh(crownGeo, crownMat);
    crown.castShadow = true;
    root.add(crown);

    // 2. Secretory Ameloblast Cell Layer (Prismatic palisade cells capping the crown)
    const ameloblastGroup = new THREE.Group();
    const cellGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 8);
    const cellMat = new THREE.MeshStandardMaterial({
      color: 0x38BDF8, // Ameloblast epithelial cells
      roughness: 0.3,
    });
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const cell = new THREE.Mesh(cellGeo, cellMat);
      cell.position.set(Math.cos(angle) * 1.45, 0.8, Math.sin(angle) * 1.45);
      cell.rotation.z = Math.PI / 8 * Math.cos(angle);
      cell.rotation.x = Math.PI / 8 * Math.sin(angle);
      ameloblastGroup.add(cell);
    }
    root.add(ameloblastGroup);

    // 3. Odontoblast Dental Papilla Core (Pink inner pulpal precursor)
    const papillaGeo = new THREE.ConeGeometry(0.8, 1.8, 16);
    const papillaMat = new THREE.MeshStandardMaterial({
      color: 0xF472B6,
      roughness: 0.5,
    });
    const papilla = new THREE.Mesh(papillaGeo, papillaMat);
    papilla.rotation.x = Math.PI;
    papilla.position.y = -0.4;
    root.add(papilla);

    // 4. Enamel Hypoplasia Defect Rings (Lady Mellanby horizontal groove bands)
    const hypoplasiaRingGeo1 = new THREE.TorusGeometry(1.36, 0.08, 16, 32);
    const hypoplasiaRingGeo2 = new THREE.TorusGeometry(1.24, 0.07, 16, 32);
    const defectMat = new THREE.MeshStandardMaterial({
      color: 0xD97706, // Brownish hypoplastic pitted defect
      roughness: 0.9,
    });
    const ring1 = new THREE.Mesh(hypoplasiaRingGeo1, defectMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.3;

    const ring2 = new THREE.Mesh(hypoplasiaRingGeo2, defectMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -0.2;

    const defectGroup = new THREE.Group();
    defectGroup.add(ring1, ring2);
    defectGroup.visible = false;
    root.add(defectGroup);

    // Update Stage:
    // 0 = Secretory Phase (organic matrix deposition)
    // 1 = Mineralization Phase (crystal nucleation)
    // 2 = Maturation Phase (dense 96% mineral enamel)
    // 3 = Enamel Hypoplasia (Nutritional insult: Vit D deficiency / Preterm 3x risk)
    const setDevelopmentStage = (stage: number) => {
      if (stage === 0) {
        // Secretory
        ameloblastGroup.visible = true;
        crownMat.color.setHex(0xE0E7FF); // Soft protein matrix
        crownMat.roughness = 0.5;
        defectGroup.visible = false;
      } else if (stage === 1) {
        // Mineralization
        ameloblastGroup.visible = true;
        crownMat.color.setHex(0xF5E6D3);
        crownMat.roughness = 0.3;
        defectGroup.visible = false;
      } else if (stage === 2) {
        // Maturation (Healthy tooth)
        ameloblastGroup.visible = false;
        crownMat.color.setHex(0xFDFBF7);
        crownMat.roughness = 0.12;
        defectGroup.visible = false;
      } else if (stage >= 3) {
        // Enamel Hypoplasia
        ameloblastGroup.visible = false;
        crownMat.color.setHex(0xFAF4E6);
        crownMat.roughness = 0.6;
        defectGroup.visible = true;
      }
    };

    setDevelopmentStage(0);

    return {
      update: (delta: number) => {
        root.rotation.y += delta * 0.15;
      },
      onSliderChange: (val: number) => {
        setDevelopmentStage(Math.round(val));
      },
      onToggleLayer: (layerId: string) => {
        if (layerId === 'ameloblasts') ameloblastGroup.visible = !ameloblastGroup.visible;
        if (layerId === 'papilla') papilla.visible = !papilla.visible;
        if (layerId === 'defects') defectGroup.visible = !defectGroup.visible;
      },
      resetView: () => {
        root.rotation.set(0, 0, 0);
      },
      dispose: () => {
        crownGeo.dispose();
        crownMat.dispose();
        cellGeo.dispose();
        cellMat.dispose();
        papillaGeo.dispose();
        papillaMat.dispose();
        hypoplasiaRingGeo1.dispose();
        hypoplasiaRingGeo2.dispose();
        defectMat.dispose();
      },
    };
  };

  return (
    <ThreeCanvasContainer
      title="3D Tooth Organogenesis & Enamel Hypoplasia Insult"
      badge="Lecture 7 • Developmental Tooth Pathology"
      onInitScene={initScene}
      sliderLabel="Stage: 0=Secretory, 1=Mineralization, 2=Mature Enamel, 3=Hypoplasia Defects"
      sliderMin={0}
      sliderMax={3}
      sliderStep={1}
      sliderInitial={0}
      layers={[
        { id: 'ameloblasts', label: 'Ameloblast Layer', active: true },
        { id: 'papilla', label: 'Dental Papilla', active: true },
        { id: 'defects', label: 'Hypoplastic Grooves', active: true },
      ]}
      annotations={[
        { label: 'Secretory Phase', text: 'Ameloblasts lay down organic matrix; insulted by protein deficiency or fever.' },
        { label: 'Maturation Phase', text: 'Water is withdrawn; 96% hydroxyapatite crystals grow densely under Vitamin D and Calcium control.' },
        { label: 'Lady Mellanby Hypoplasia', text: 'Vitamin D or Calcium deficiency causes horizontal pitted enamel defect bands.' },
        { label: 'Preterm 3x Risk', text: 'Missing the 3rd trimester placental mineral accumulation triples hypoplasia risk in premature babies.' },
      ]}
    />
  );
};
