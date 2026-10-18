import React from 'react';
import * as THREE from 'three';
import { ThreeCanvasContainer } from '../../ThreeCanvasContainer';

export const PeriodontalPocket3D: React.FC = () => {
  const initScene = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    const root = new THREE.Group();
    scene.add(root);

    // 1. Tooth Root & Crown Section
    const toothGeo = new THREE.CylinderGeometry(0.8, 0.4, 3.2, 24);
    const toothMat = new THREE.MeshStandardMaterial({
      color: 0xFDFBF7,
      roughness: 0.2,
    });
    const tooth = new THREE.Mesh(toothGeo, toothMat);
    tooth.position.set(-0.6, 0, 0);
    root.add(tooth);

    // 2. Alveolar Bone (Spongy & cortical bone base)
    const boneGeo = new THREE.BoxGeometry(1.6, 1.8, 1.6);
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      roughness: 0.8,
    });
    const bone = new THREE.Mesh(boneGeo, boneMat);
    bone.position.set(0.6, -1.0, 0);
    root.add(bone);

    // 3. Gingival Gum Tissue & Pocket Collar
    const gingivaGeo = new THREE.CylinderGeometry(0.9, 1.2, 1.2, 24, 1, true);
    const gingivaMat = new THREE.MeshStandardMaterial({
      color: 0xF472B6, // Healthy pink gingiva
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const gingiva = new THREE.Mesh(gingivaGeo, gingivaMat);
    gingiva.position.set(0.2, 0.2, 0);
    root.add(gingiva);

    // 4. Periodontal Ligament (PDL) Fiber Strands
    const pdlGroup = new THREE.Group();
    const fiberGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 6);
    const fiberMat = new THREE.MeshBasicMaterial({ color: 0xFBBF24 });
    for (let i = 0; i < 30; i++) {
      const fiber = new THREE.Mesh(fiberGeo, fiberMat);
      fiber.rotation.z = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
      fiber.position.set(-0.15 + (Math.random() - 0.5) * 0.1, -0.6 - Math.random() * 1.0, (Math.random() - 0.5) * 0.6);
      pdlGroup.add(fiber);
    }
    root.add(pdlGroup);

    // 5. Reactive Oxygen Species (ROS / Free Radicals) - Red energetic spikes
    const rosGroup = new THREE.Group();
    const rosGeo = new THREE.OctahedronGeometry(0.08, 0);
    const rosMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 });
    for (let i = 0; i < 35; i++) {
      const ros = new THREE.Mesh(rosGeo, rosMat);
      ros.position.set(
        (Math.random() - 0.5) * 1.8,
        0.2 + (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 1.8
      );
      rosGroup.add(ros);
    }
    root.add(rosGroup);

    // 6. Antioxidant Molecules (Vitamin C & Vitamin E - Cyan / Gold Spheres)
    const aoGroup = new THREE.Group();
    const aoGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const vitEMat = new THREE.MeshStandardMaterial({ color: 0xC9A24B }); // Vit E
    const vitCMat = new THREE.MeshStandardMaterial({ color: 0x06B6D4 }); // Vit C
    for (let i = 0; i < 20; i++) {
      const ao = new THREE.Mesh(aoGeo, i % 2 === 0 ? vitEMat : vitCMat);
      ao.position.set(
        (Math.random() - 0.5) * 1.5,
        0.3 + (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 1.5
      );
      aoGroup.add(ao);
    }
    aoGroup.visible = false;
    root.add(aoGroup);

    // Mode:
    // 0 = Healthy Sulcus
    // 1 = Inflamed Periodontitis (Erythematous swollen gingiva, bone loss)
    // 2 = High Oxidative Stress (Free radicals swarming cell membranes)
    // 3 = Antioxidant Therapy (Vit C regenerates Vit E, quenches radicals)
    const setPerioMode = (mode: number) => {
      if (mode === 0) {
        gingivaMat.color.setHex(0xF472B6); // Healthy pink
        bone.scale.set(1, 1, 1);
        rosGroup.visible = false;
        aoGroup.visible = false;
      } else if (mode === 1) {
        gingivaMat.color.setHex(0xDC2626); // Erythematous red
        bone.scale.set(1, 0.75, 1); // 25% Alveolar bone loss
        rosGroup.visible = false;
        aoGroup.visible = false;
      } else if (mode === 2) {
        gingivaMat.color.setHex(0xB91C1C);
        bone.scale.set(1, 0.75, 1);
        rosGroup.visible = true;
        aoGroup.visible = false;
      } else if (mode >= 3) {
        gingivaMat.color.setHex(0xF472B6);
        bone.scale.set(1, 0.85, 1);
        rosGroup.visible = false;
        aoGroup.visible = true;
      }
    };

    setPerioMode(0);

    return {
      update: (delta: number) => {
        root.rotation.y += delta * 0.12;
        rosGroup.rotation.x += delta * 0.3;
        aoGroup.rotation.y += delta * 0.25;
      },
      onSliderChange: (val: number) => {
        setPerioMode(Math.round(val));
      },
      onToggleLayer: (layerId: string) => {
        if (layerId === 'gingiva') gingiva.visible = !gingiva.visible;
        if (layerId === 'bone') bone.visible = !bone.visible;
        if (layerId === 'pdl') pdlGroup.visible = !pdlGroup.visible;
        if (layerId === 'radicals') rosGroup.visible = !rosGroup.visible;
      },
      resetView: () => {
        root.rotation.set(0, 0, 0);
      },
      dispose: () => {
        toothGeo.dispose();
        toothMat.dispose();
        boneGeo.dispose();
        boneMat.dispose();
        gingivaGeo.dispose();
        gingivaMat.dispose();
        fiberGeo.dispose();
        fiberMat.dispose();
        rosGeo.dispose();
        rosMat.dispose();
        aoGeo.dispose();
        vitEMat.dispose();
        vitCMat.dispose();
      },
    };
  };

  return (
    <ThreeCanvasContainer
      title="3D Periodontal Pocket, Bone Resorption & Antioxidant Defense"
      badge="Lecture 8 • Host Modulation & Free Radical Chemistry"
      onInitScene={initScene}
      sliderLabel="Pathology: 0=Healthy, 1=Periodontitis Bone Loss, 2=ROS Attack, 3=Antioxidant Synergy"
      sliderMin={0}
      sliderMax={3}
      sliderStep={1}
      sliderInitial={0}
      layers={[
        { id: 'gingiva', label: 'Gingival Sulcus', active: true },
        { id: 'bone', label: 'Alveolar Bone', active: true },
        { id: 'pdl', label: 'PDL Fibers', active: true },
        { id: 'radicals', label: 'ROS Free Radicals', active: true },
      ]}
      annotations={[
        { label: 'PDL Fibers & Bone', text: 'Chewing fibrous food does not clean plaque, but exercises the PDL and stimulates bone density.' },
        { label: 'Free Radicals (ROS)', text: 'Reactive oxygen species with unpaired electrons trigger lipid peroxidation in host cells.' },
        { label: 'Vitamin C & E Teamwork', text: 'Lipophilic Vitamin E catches free radicals in membranes; hydrophilic Vitamin C regenerates it!' },
        { label: 'Bowman-Birk Protease Inhibitor', text: 'Soybean BBI stops oral carcinogenesis progression in epithelial cells.' },
      ]}
    />
  );
};
