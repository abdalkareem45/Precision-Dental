import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    const ok = Boolean(gl);
    if (gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    return ok;
  } catch {
    return false;
  }
}

export interface StudioContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  isSoftwareGl: boolean;
  maxAnisotropy: number;
  startLoop: (onTick: (dt: number, elapsed: number) => void) => void;
  requestRender: () => void;
  flyToCamera: (pos: THREE.Vector3, target: THREE.Vector3) => void;
  dispose: () => void;
}

export function createStudioScene(
  container: HTMLElement,
  options?: {
    backgroundColor?: number;
    cameraPos?: [number, number, number];
    target?: [number, number, number];
    fov?: number;
    onContextLost?: () => void;
  }
): StudioContext | null {
  const isSoftwareGl = detectSoftwareWebGL();
  const bgHex = options?.backgroundColor ?? 0x0b1f4d;

  const width = Math.max(container.clientWidth, 320);
  const height = Math.max(container.clientHeight, 320);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bgHex);
  scene.fog = new THREE.FogExp2(bgHex, 0.022);

  const camera = new THREE.PerspectiveCamera(
    options?.fov ?? 40,
    width / height,
    0.1,
    120
  );
  const [cx, cy, cz] = options?.cameraPos ?? [0, 1.8, 7.6];
  camera.position.set(cx, cy, cz);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
  } catch {
    // Availability probes can succeed even when the browser refuses another context.
    queueMicrotask(() => container.dispatchEvent(new CustomEvent('studio-webgl-lost')));
    return null;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  container.innerHTML = '';
  container.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  // Procedural studio environment map (RoomEnvironment)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  scene.environment = envRT.texture;
  room.dispose();
  pmrem.dispose();

  // Balanced 3-point studio lighting rig
  const hemi = new THREE.HemisphereLight(0xdce8ff, 0x16223e, 0.85);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xfff4df, 1.85);
  keyLight.position.set(5.5, 8.5, 6.0);
  if (!isSoftwareGl) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 26;
    const d = 6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
  }
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x88b4ff, 1.15);
  rimLight.position.set(-6.0, 4.5, -5.5);
  scene.add(rimLight);

  // Grounding contact shadow disc
  const groundGeo = new THREE.CircleGeometry(5.8, 48);
  const groundTex = createRadialShadowTexture();
  const groundMat = new THREE.MeshBasicMaterial({
    map: groundTex,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2.6;
  scene.add(ground);

  const controls = new OrbitControls(camera, renderer.domElement);
  const [tx, ty, tz] = options?.target ?? [0, 0, 0];
  controls.target.set(tx, ty, tz);
  controls.enableDamping = !isSoftwareGl;
  controls.dampingFactor = 0.07;
  controls.minDistance = 2.4;
  controls.maxDistance = 16;
  controls.maxPolarAngle = Math.PI * 0.88;
  controls.update();

  // Camera transition state
  let flying = false;
  const flyPosTarget = new THREE.Vector3();
  const flyLookTarget = new THREE.Vector3();
  controls.addEventListener('start', () => {
    flying = false;
  });

  let disposed = false;
  let frameId: number | null = null;
  let timeoutId: number | null = null;
  let loopCallback: ((dt: number, elapsed: number) => void) | null = null;
  let previousTime = performance.now();
  let elapsed = 0;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  function cancelScheduledDraw() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    if (timeoutId !== null) window.clearTimeout(timeoutId);
    frameId = null;
    timeoutId = null;
  }

  function scheduleDraw() {
    if (disposed || frameId !== null || timeoutId !== null) return;
    if (isSoftwareGl || reducedMotion) {
      timeoutId = window.setTimeout(() => { timeoutId = null; tick(); }, reducedMotion ? 150 : 80);
    } else {
      frameId = requestAnimationFrame(() => { frameId = null; tick(); });
    }
  }

  function advanceCameraFlight(dt: number) {
    if (!flying) return;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, flyPosTarget.x, 6, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, flyPosTarget.y, 6, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, flyPosTarget.z, 6, dt);
    controls.target.x = THREE.MathUtils.damp(controls.target.x, flyLookTarget.x, 6, dt);
    controls.target.y = THREE.MathUtils.damp(controls.target.y, flyLookTarget.y, 6, dt);
    controls.target.z = THREE.MathUtils.damp(controls.target.z, flyLookTarget.z, 6, dt);
    if (
      camera.position.distanceToSquared(flyPosTarget) < 0.002 &&
      controls.target.distanceToSquared(flyLookTarget) < 0.002
    ) {
      flying = false;
    }
  }

  function tick() {
    if (disposed) return;
    const now = performance.now();
    const dt = Math.min((now - previousTime) / 1000, 0.15);
    previousTime = now;
    if (!reducedMotion) elapsed += dt;
    advanceCameraFlight(dt);
    const controlsChanged = controls.update();
    loopCallback?.(dt, elapsed);
    renderer.render(scene, camera);
    if ((loopCallback && !reducedMotion) || flying || controlsChanged) scheduleDraw();
  }

  function startLoop(onTick: (dt: number, elapsed: number) => void) {
    if (disposed) return;
    loopCallback = onTick;
    previousTime = performance.now();
    requestRender();
  }

  function requestRender() {
    scheduleDraw();
  }

  controls.addEventListener('change', requestRender);

  // State-driven controls still redraw when continuous animation is disabled.
  const onInput = () => requestRender();
  const sandbox = container.closest('section') ?? container;
  sandbox.addEventListener('input', onInput);
  sandbox.addEventListener('click', onInput);

  function flyToCamera(pos: THREE.Vector3, target: THREE.Vector3) {
    if (disposed) return;
    if (reducedMotion) {
      camera.position.copy(pos);
      controls.target.copy(target);
      controls.update();
      requestRender();
      return;
    }
    flyPosTarget.copy(pos);
    flyLookTarget.copy(target);
    flying = true;
    requestRender();
  }

  const ro = new ResizeObserver((entries) => {
    if (disposed) return;
    const entry = entries[0];
    if (!entry) return;
    const w = Math.max(Math.floor(entry.contentRect.width), 1);
    const h = Math.max(Math.floor(entry.contentRect.height), 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    requestRender();
  });
  ro.observe(container);

  const handleContextLost = (e: Event) => {
    e.preventDefault();
    dispose();
    container.dispatchEvent(new CustomEvent('studio-webgl-lost', { bubbles: false }));
    options?.onContextLost?.();
  };
  renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelScheduledDraw();
    loopCallback = null;
    ro.disconnect();
    sandbox.removeEventListener('input', onInput);
    sandbox.removeEventListener('click', onInput);
    renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
    controls.dispose();
    disposeObject3D(scene);
    envRT.dispose();
    scene.environment = null;
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  }

  return {
    scene,
    camera,
    renderer,
    controls,
    isSoftwareGl,
    maxAnisotropy,
    startLoop,
    requestRender,
    flyToCamera,
    dispose,
  };
}

export function disposeObject3D(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    const mat = mesh.material;
    if (mat) for (const m of Array.isArray(mat) ? mat : [mat]) materials.add(m);
    if (obj instanceof THREE.InstancedMesh) obj.dispose();
    if (obj instanceof THREE.Light && 'shadow' in obj) {
      (obj as THREE.DirectionalLight).shadow?.dispose();
    }
  });
  for (const material of materials) {
    for (const value of Object.values(material)) {
      if (value instanceof THREE.Texture) textures.add(value);
    }
    material.dispose();
  }
  for (const geometry of geometries) geometry.dispose();
  for (const texture of textures) texture.dispose();
}

function createRadialShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
    grad.addColorStop(0, 'rgba(3, 8, 22, 0.85)');
    grad.addColorStop(0.55, 'rgba(3, 8, 22, 0.35)');
    grad.addColorStop(1, 'rgba(3, 8, 22, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createTrabecularBoneTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#c9b493';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 420; i++) {
      const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const y = (Math.sin(i * 78.233) * 19341.123) % 1;
      const px = Math.abs(x) * 256;
      const py = Math.abs(y) * 256;
      const r = 2 + (i % 6);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(130, 102, 74, 0.35)' : 'rgba(236, 220, 194, 0.32)';
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createDentinTubuleTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ecd9b5';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = 'rgba(196, 165, 114, 0.45)';
    ctx.lineWidth = 1.5;
    for (let y = 6; y < 256; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(85, y - 4, 170, y + 4, 256, y);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createRulerTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#e5e9f0';
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#0b1f4d';
    ctx.fillStyle = '#0b1f4d';
    ctx.font = 'bold 16px monospace';
    for (let mm = 0; mm <= 30; mm++) {
      const x = 24 + mm * 15.5;
      const tickH = mm % 5 === 0 ? 38 : 20;
      ctx.lineWidth = mm % 5 === 0 ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, tickH);
      ctx.stroke();
      if (mm % 5 === 0) {
        ctx.fillText(String(mm), x - 7, 62);
      }
    }
    ctx.fillStyle = '#1b3a8c';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('ENDODONTIC MILLIMETER RULER (mm)', 24, 102);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}
