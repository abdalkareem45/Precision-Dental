/// <reference types="node" />
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { LECTURES } from '../data/lectures';
import { buildLectureScene } from '../components/three/buildLectureScene';
import { disposeObject3D } from '../components/three/dentalGeometry';

test('all scenes support every control variant without repeated geometry allocation', () => {
  for (const lecture of LECTURES) {
    const built = buildLectureScene(lecture.id);
    let status = '';
    for (const mode of lecture.threeD.primaryModes) {
      for (const secondary of lecture.threeD.secondaryModes ?? [{ id: '' }]) {
        for (const toggleActive of [false, true]) {
          const params = { primaryMode: mode.id, secondaryMode: secondary.id,
            sliderValue: lecture.threeD.sliderDefault, toggleActive, explodeFactor: 0.5,
            visibleLayers: {}, animate: false, elapsed: 1, reducedMotion: true,
            liveReadout: (message: string) => { status = message; } };
          built.updateState(params);
          const geometries: unknown[] = [];
          built.rootGroup.traverse((object) => {
            if (object instanceof THREE.Mesh) geometries.push(object.geometry);
          });
          built.updateState(params);
          const after: unknown[] = [];
          built.rootGroup.traverse((object) => {
            if (object instanceof THREE.Mesh) after.push(object.geometry);
            assert.ok(object.position.toArray().every(Number.isFinite));
            assert.ok(object.scale.toArray().every(Number.isFinite));
          });
          assert.deepEqual(after, geometries, `${lecture.id} reallocates unchanged geometry`);
        }
      }
    }
    assert.ok(status, lecture.id);
    const hidden = Object.fromEntries(lecture.threeD.structureLayers.map((layer) => [layer.id, false]));
    built.updateState({ primaryMode: lecture.threeD.primaryModes[0].id,
      secondaryMode: lecture.threeD.secondaryModes?.[0]?.id ?? '',
      sliderValue: lecture.threeD.sliderMin, toggleActive: false, explodeFactor: 1,
      visibleLayers: hidden, animate: false, elapsed: 0, reducedMotion: true });
    for (const layer of lecture.threeD.structureLayers) {
      const group = built.rootGroup.getObjectByName(layer.id);
      assert.ok(group, `${lecture.id}: missing layer ${layer.id}`);
      assert.equal(group.visible, false, `${lecture.id}: layer ${layer.id} remains visible`);
    }
    let disposals = 0;
    built.rootGroup.traverse((object) => {
      if (object instanceof THREE.Mesh) object.geometry.addEventListener('dispose', () => { disposals++; });
    });
    built.dispose();
    assert.ok(disposals > 0);
    const count = disposals;
    built.dispose();
    assert.equal(disposals, count, 'scene disposal must be idempotent');
  }
});

test('shared and detached materials/textures are disposed exactly once', () => {
  const root = new THREE.Group();
  const texture = new THREE.Texture();
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ map: texture, roughnessMap: texture });
  const detached = new THREE.MeshStandardMaterial({ map: texture });
  root.add(new THREE.Mesh(geometry, material), new THREE.Mesh(geometry, material));
  const count = { texture: 0, geometry: 0, material: 0, detached: 0 };
  texture.addEventListener('dispose', () => { count.texture++; });
  geometry.addEventListener('dispose', () => { count.geometry++; });
  material.addEventListener('dispose', () => { count.material++; });
  detached.addEventListener('dispose', () => { count.detached++; });
  disposeObject3D(root, [material, detached]);
  assert.deepEqual(count, { texture: 1, geometry: 1, material: 1, detached: 1 });
});
