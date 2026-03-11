import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const canvas = document.getElementById('scene');
const statusEl = document.getElementById('status');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#87c8ff');
scene.fog = new THREE.Fog('#9fd4ff', 80, 220);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 400);
camera.position.set(0, 1.72, 7);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lights
scene.add(new THREE.HemisphereLight('#d6f0ff', '#7f6245', 0.85));

const sun = new THREE.DirectionalLight('#fff4da', 1.2);
sun.position.set(28, 36, 18);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -70;
sun.shadow.camera.right = 70;
sun.shadow.camera.top = 70;
sun.shadow.camera.bottom = -70;
scene.add(sun);

const warmInside = new THREE.PointLight('#ffd7aa', 1.4, 75);
warmInside.position.set(0, 5.2, 0);
scene.add(warmInside);

// Ground / road
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(260, 260),
  new THREE.MeshStandardMaterial({ color: '#57b95f', roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(260, 22),
  new THREE.MeshStandardMaterial({ color: '#40444d', roughness: 1 })
);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0.01, -16);
scene.add(road);

const sidewalk = new THREE.Mesh(
  new THREE.BoxGeometry(260, 0.22, 7),
  new THREE.MeshStandardMaterial({ color: '#aeb4bf' })
);
sidewalk.position.set(0, 0.11, -11.4);
sidewalk.receiveShadow = true;
scene.add(sidewalk);

const house = new THREE.Group();
scene.add(house);

const wallOuterMat = new THREE.MeshStandardMaterial({ color: '#dfa8a1', roughness: 0.86 });
const wallInnerMatA = new THREE.MeshStandardMaterial({ color: '#e88ac3', roughness: 0.9 });
const wallInnerMatB = new THREE.MeshStandardMaterial({ color: '#e89f8d', roughness: 0.9 });
const trimMat = new THREE.MeshStandardMaterial({ color: '#f3d8b0', roughness: 0.8 });
const floorMat = new THREE.MeshStandardMaterial({ color: '#c28f64', roughness: 0.95 });
const roofMat = new THREE.MeshStandardMaterial({ color: '#be6631', roughness: 0.82 });

function box(w, h, d, x, y, z, mat, cast = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
}

// House shell
house.add(box(24, 8, 0.45, 0, 4, 12, wallOuterMat));
house.add(box(24, 8, 0.45, 0, 4, -12, wallOuterMat));
house.add(box(0.45, 8, 24, -12, 4, 0, wallOuterMat));
house.add(box(0.45, 8, 24, 12, 4, 0, wallOuterMat));
house.add(box(23.5, 0.3, 23.5, 0, 0.15, 0, floorMat, false));

// Roof and garage
const roof = new THREE.Mesh(new THREE.ConeGeometry(17.2, 5.2, 4), roofMat);
roof.rotation.y = Math.PI / 4;
roof.position.set(0, 10.25, 0);
roof.castShadow = true;
house.add(roof);

house.add(box(8.8, 5.8, 8.2, 16, 2.9, 2.6, new THREE.MeshStandardMaterial({ color: '#d49a82' })));
const garageRoof = new THREE.Mesh(new THREE.ConeGeometry(6.6, 3.1, 4), roofMat);
garageRoof.rotation.y = Math.PI / 4;
garageRoof.position.set(16, 7, 2.6);
garageRoof.castShadow = true;
house.add(garageRoof);

// Interior walls (cleaner layout)
house.add(box(0.35, 7.4, 22.6, -3, 3.7, 0, wallInnerMatA));
house.add(box(14.5, 7.4, 0.35, 4.7, 3.7, 2.2, wallInnerMatB));
house.add(box(9.8, 7.4, 0.35, -7.1, 3.7, -3.2, wallInnerMatA));
house.add(box(0.35, 7.4, 8.8, 5.7, 3.7, -7.6, wallInnerMatB));

// Door + windows
const doorPivot = new THREE.Group();
doorPivot.position.set(1.5, 0, 11.76);
house.add(doorPivot);
const door = box(2.1, 4.05, 0.2, -1.05, 2.025, 0, new THREE.MeshStandardMaterial({ color: '#c86a5e' }));
doorPivot.add(door);

function windowFront(x, y, z, w, h) {
  house.add(box(w, h, 0.18, x, y, z, trimMat));
  const glass = box(
    w - 0.22,
    h - 0.22,
    0.08,
    x,
    y,
    z + (z > 0 ? 0.1 : -0.1),
    new THREE.MeshStandardMaterial({ color: '#93d8ee', emissive: '#204f66', emissiveIntensity: 0.3 }),
    false
  );
  house.add(glass);
}
windowFront(-6.8, 3.5, 11.82, 4.8, 3.4);
windowFront(8.2, 3.5, 11.82, 4.8, 3.4);
windowFront(-8.8, 4.5, -11.82, 3.5, 2.1);
windowFront(7.8, 4.5, -11.82, 3.5, 2.1);

// Arch trims
house.add(box(2.8, 0.2, 0.25, -3, 2.15, -7.5, trimMat));
house.add(box(2.8, 0.2, 0.25, -3, 2.15, 7.5, trimMat));
house.add(box(0.25, 2.2, 0.25, -4.4, 1.1, -7.5, trimMat));
house.add(box(0.25, 2.2, 0.25, -1.6, 1.1, -7.5, trimMat));
house.add(box(0.25, 2.2, 0.25, -4.4, 1.1, 7.5, trimMat));
house.add(box(0.25, 2.2, 0.25, -1.6, 1.1, 7.5, trimMat));

// Furniture/details
const sofaColor = new THREE.MeshStandardMaterial({ color: '#8f3631' });
house.add(box(4.8, 1, 2, -8, 0.5, 8, sofaColor));
house.add(box(2.7, 0.5, 1.2, -5.8, 0.26, 8, new THREE.MeshStandardMaterial({ color: '#744526' })));
house.add(box(3, 0.8, 1.3, -8.3, 0.4, 4.2, new THREE.MeshStandardMaterial({ color: '#5a3d2c' })));
house.add(box(2.5, 1.6, 0.12, -8.3, 1.68, 3.46, new THREE.MeshStandardMaterial({ color: '#1b1e23' })));

house.add(box(3.5, 0.65, 2.2, -0.5, 0.34, -1, new THREE.MeshStandardMaterial({ color: '#8a5632' })));
['#d5b58f', '#d5b58f', '#d5b58f', '#d5b58f'].forEach((c, i) => {
  const pts = [
    [1.5, -2.3],
    [1.5, 0.3],
    [-2.3, -2.3],
    [-2.3, 0.3],
  ];
  house.add(box(0.7, 1.1, 0.7, pts[i][0], 0.55, pts[i][1], new THREE.MeshStandardMaterial({ color: c })));
});

house.add(box(4.8, 1, 0.9, 8.6, 0.5, -7.8, new THREE.MeshStandardMaterial({ color: '#78a9d9' })));
house.add(box(2.4, 2, 1, 10, 1, -3.8, new THREE.MeshStandardMaterial({ color: '#f0f4f8' })));
house.add(box(2.3, 0.95, 1.5, 7.6, 0.48, -3.8, new THREE.MeshStandardMaterial({ color: '#78c4cb' })));
for (let i = 0; i < 7; i += 1) {
  house.add(box(2.2, 0.22, 0.65, -1.6, 0.12 + i * 0.22, 4.8 - i * 0.64, new THREE.MeshStandardMaterial({ color: '#b78960' })));
}

// Exterior props
const path = box(3.2, 0.15, 12.8, 1.5, 0.08, 18.2, new THREE.MeshStandardMaterial({ color: '#cfbfb0' }), false);
scene.add(path);

function tree(x, z, s = 1) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.33 * s, 0.47 * s, 3.4 * s, 12),
    new THREE.MeshStandardMaterial({ color: '#6e432c' })
  );
  trunk.position.y = 1.7 * s;
  trunk.castShadow = true;
  g.add(trunk);

  const leaf = new THREE.Mesh(new THREE.SphereGeometry(1.8 * s, 16, 16), new THREE.MeshStandardMaterial({ color: '#3a9f44' }));
  leaf.position.y = 4.5 * s;
  leaf.castShadow = true;
  g.add(leaf);

  g.position.set(x, 0, z);
  scene.add(g);
}

tree(-23, 12, 1.2);
tree(-25, -6, 1.4);
tree(27, 10, 1.15);
tree(29, -7, 1.05);

const car = new THREE.Group();
scene.add(car);
car.add(box(5.2, 1.45, 2.8, 0, 1.5, 0, new THREE.MeshStandardMaterial({ color: '#b066a0' })));
car.add(box(2.6, 1, 2.25, -0.4, 2.22, 0, new THREE.MeshStandardMaterial({ color: '#c478b3' })));
for (const x of [-1.8, 1.8]) {
  for (const z of [-1.3, 1.3]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 20), new THREE.MeshStandardMaterial({ color: '#202020' }));
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.8, z);
    car.add(wheel);
  }
}
car.position.set(20, 0, -10.4);

// FPS controls
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

const enterBtn = document.getElementById('enter-fp');

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

enterBtn.addEventListener('click', () => controls.lock());
canvas.addEventListener('click', () => {
  if (!controls.isLocked) controls.lock();
});

controls.addEventListener('lock', () => {
  enterBtn.style.display = 'none';
  setStatus('Modo FPS activo · WASD moverse · Shift correr · ESC salir');
});
controls.addEventListener('unlock', () => {
  enterBtn.style.display = 'inline-block';
  setStatus('Pulsa el botón o haz clic en la escena para activar primera persona');
});

const move = {
  forward: false,
  back: false,
  left: false,
  right: false,
  sprint: false,
};

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyW') move.forward = true;
  if (e.code === 'KeyS') move.back = true;
  if (e.code === 'KeyA') move.left = true;
  if (e.code === 'KeyD') move.right = true;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') move.sprint = true;
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') move.forward = false;
  if (e.code === 'KeyS') move.back = false;
  if (e.code === 'KeyA') move.left = false;
  if (e.code === 'KeyD') move.right = false;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') move.sprint = false;
});

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const clock = new THREE.Clock();

const bounds = {
  minX: -45,
  maxX: 45,
  minZ: -40,
  maxZ: 55,
};

function clampWalkArea() {
  const p = controls.getObject().position;
  p.x = Math.max(bounds.minX, Math.min(bounds.maxX, p.x));
  p.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, p.z));
  p.y = 1.72;
}

function animate() {
  const elapsed = clock.getElapsedTime();
  const delta = Math.min(clock.getDelta(), 0.05);

  doorPivot.rotation.y = Math.sin(elapsed * 1.12) * 0.22;
  car.position.x -= delta * 4.2;
  if (car.position.x < -34) car.position.x = 23;
  sun.position.set(Math.cos(elapsed * 0.08) * 35, 24 + Math.sin(elapsed * 0.08) * 15, 20);

  if (controls.isLocked) {
    const accel = (move.sprint ? 55 : 34) * delta;

    velocity.x -= velocity.x * 10 * delta;
    velocity.z -= velocity.z * 10 * delta;

    direction.z = Number(move.forward) - Number(move.back);
    direction.x = Number(move.right) - Number(move.left);
    if (direction.lengthSq() > 0) direction.normalize();

    velocity.z += direction.z * accel;
    velocity.x += direction.x * accel;

    controls.moveRight(velocity.x * delta * 8);
    controls.moveForward(velocity.z * delta * 8);
    clampWalkArea();
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

setStatus('Pulsa el botón o haz clic en la escena para activar primera persona');
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
