import * as THREE from 'three';

type Disposable = { dispose: () => void };

/** Include shared, cloned and nested resources, as well as allocated-but-unused materials. */
export function createResourceDisposer(root: THREE.Object3D, extras: readonly Disposable[] = []): () => void {
  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    const resources = new Set<Disposable>(extras);
    root.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) resources.add(mesh.geometry);
      if (!mesh.material) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        resources.add(material);
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) resources.add(value);
        }
      }
    });
    for (const resource of resources) resource.dispose();
    root.clear();
  };
}
