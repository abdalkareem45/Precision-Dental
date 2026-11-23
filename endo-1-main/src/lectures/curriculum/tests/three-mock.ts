// Keep real geometry/material behavior; replace only browser/GPU boundaries.
import * as THREE from 'three';
export * from 'three';

export const gpu = { renderers: [] as WebGLRenderer[], roomsDisposed: 0, targetsDisposed: 0, generatorsDisposed: 0, failRenderer: false };
export class WebGLRenderer {
  domElement = document.createElement('canvas');
  shadowMap = { enabled: false, type: 0 };
  capabilities = { getMaxAnisotropy: () => 4 };
  outputColorSpace = '';
  toneMapping = 0;
  toneMappingExposure = 0;
  disposed = 0;
  lost = 0;
  rendered = 0;
  sizes: number[][] = [];
  constructor() { if (gpu.failRenderer) throw new Error('Context limit'); gpu.renderers.push(this); }
  setPixelRatio() {}
  setSize(w: number, h: number) { this.sizes.push([w, h]); }
  render() { this.rendered++; }
  dispose() { this.disposed++; }
  forceContextLoss() { this.lost++; }
}
export class PMREMGenerator {
  constructor(_renderer: unknown) {}
  fromScene() { return { texture: new THREE.Texture(), dispose: () => { gpu.targetsDisposed++; } }; }
  dispose() { gpu.generatorsDisposed++; }
}
export class RoomEnvironment extends THREE.Scene {
  dispose() { gpu.roomsDisposed++; }
}
export class OrbitControls extends THREE.EventDispatcher {
  target = new THREE.Vector3();
  disposed = 0;
  enableDamping = false;
  dampingFactor = 0;
  minDistance = 0;
  maxDistance = 0;
  maxPolarAngle = 0;
  constructor(_camera: unknown, _canvas: unknown) { super(); }
  update() { return false; }
  dispose() { this.disposed++; }
}
