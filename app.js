import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const canvas = document.getElementById('scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#89c9ff');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 400);
camera.position.set(-2, 1.72, 7);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const hemiLight = new THREE.HemisphereLight('#d8f3ff', '#7f6347', 0.82);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight('#fff4d7', 1.15);
sunLight.position.set(30, 42, 20);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.left = -60;
sunLight.shadow.camera.right = 60;
sunLight.shadow.camera.top = 60;
sunLight.shadow.camera.bottom = -60;
scene.add(sunLight);

const ambientInside = new THREE.PointLight('#ffd9a8', 1.4, 90, 1.8);
ambientInside.position.set(0, 5.8, 0);
scene.add(ambientInside);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(240, 240),
  new THREE.MeshStandardMaterial({ color: '#57b95d', roughness: 0.96 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(240, 22),
  new THREE.MeshStandardMaterial({ color: '#434851', roughness: 1 })
);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0.01, -16);
scene.add(road);

const sidewalk = new THREE.Mesh(
  new THREE.BoxGeometry(240, 0.24, 7),
  new THREE.MeshStandardMaterial({ color: '#aeb6c1' })
);
sidewalk.position.set(0, 0.12, -11.5);
sidewalk.receiveShadow = true;
scene.add(sidewalk);

const house = new THREE.Group();
scene.add(house);

const wallMat = new THREE.MeshStandardMaterial({ color: '#e8a8aa', roughness: 0.88 });
const wallSideMat = new THREE.MeshStandardMaterial({ color: '#db9ba2', roughness: 0.88 });
const roofMat = new THREE.MeshStandardMaterial({ color: '#c66a33', roughness: 0.8 });
const floorMat = new THREE.MeshStandardMaterial({ color: '#c89b6f', roughness: 0.9 });

function wall(width, height, depth, x, y, z, material = wallMat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  house.add(mesh);
  return mesh;
}

// Exterior shell
wall(24, 8, 0.5, 0, 4, 12, wallMat); // front
wall(24, 8, 0.5, 0, 4, -12, wallMat); // back
wall(0.5, 8, 24, -12, 4, 0, wallSideMat); // left
wall(0.5, 8, 24, 12, 4, 0, wallSideMat); // right

const houseFloor = new THREE.Mesh(new THREE.BoxGeometry(23.5, 0.3, 23.5), floorMat);
houseFloor.position.set(0, 0.15, 0);
houseFloor.receiveShadow = true;
house.add(houseFloor);

// Rooms interior walls
const pinkWall = new THREE.MeshStandardMaterial({ color: '#e38fc6', roughness: 0.87 });
const salmonWall = new THREE.MeshStandardMaterial({ color: '#e79c8f', roughness: 0.86 });
wall(0.4, 7.5, 23, -3, 3.75, 0, pinkWall); // central corridor divider
wall(15, 7.5, 0.4, 4.5, 3.75, 2, salmonWall); // living / kitchen divider
wall(10, 7.5, 0.4, -7, 3.75, -3, pinkWall); // left wing divider
wall(0.4, 7.5, 9, 5.5, 3.75, -7.5, salmonWall); // kitchen nook

// Archway / openings (by adding trims only, keep walkable gaps)
const trimMat = new THREE.MeshStandardMaterial({ color: '#f5d0a2' });
function trim(w, h, d, x, y, z) {
  const t = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), trimMat);
  t.position.set(x, y, z);
  t.castShadow = true;
  house.add(t);
}
trim(2.8, 0.2, 0.3, -3, 2.2, -7.5);
trim(2.8, 0.2, 0.3, -3, 2.2, 7.5);
trim(0.3, 2.2, 0.3, -4.4, 1.1, -7.5);
trim(0.3, 2.2, 0.3, -1.6, 1.1, -7.5);
trim(0.3, 2.2, 0.3, -4.4, 1.1, 7.5);
trim(0.3, 2.2, 0.3, -1.6, 1.1, 7.5);

// Roof (without ceiling to allow interior viewing)
const roofMain = new THREE.Mesh(new THREE.ConeGeometry(17.3, 5.4, 4), roofMat);
roofMain.rotation.y = Math.PI / 4;
roofMain.position.set(0, 10.3, 0);
roofMain.castShadow = true;
house.add(roofMain);

const garage = new THREE.Group();
house.add(garage);
const garageBody = new THREE.Mesh(new THREE.BoxGeometry(9, 5.8, 8.5), new THREE.MeshStandardMaterial({ color: '#d79d86' }));
garageBody.position.set(16, 2.9, 3);
garageBody.castShadow = true;
garageBody.receiveShadow = true;
garage.add(garageBody);
const garageRoof = new THREE.Mesh(new THREE.ConeGeometry(6.7, 3.2, 4), roofMat);
garageRoof.rotation.y = Math.PI / 4;
garageRoof.position.set(16, 7.1, 3);
garageRoof.castShadow = true;
garage.add(garageRoof);

// facade details closer to reference
const doorPivot = new THREE.Group();
doorPivot.position.set(1.4, 0, 11.78);
house.add(doorPivot);
const frontDoor = new THREE.Mesh(new THREE.BoxGeometry(2.1, 4.1, 0.2), new THREE.MeshStandardMaterial({ color: '#ce6e5f' }));
frontDoor.position.set(-1.05, 2.05, 0);
frontDoor.castShadow = true;
doorPivot.add(frontDoor);

function windowUnit(x, y, z, w = 3.2, h = 2.4) {
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.2), new THREE.MeshStandardMaterial({ color: '#f7e9d3' }));
  frame.position.set(x, y, z);
  frame.castShadow = true;
  house.add(frame);

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.25, h - 0.25, 0.08),
    new THREE.MeshStandardMaterial({ color: '#8bcfe9', emissive: '#24586b', emissiveIntensity: 0.35 })
  );
  glass.position.set(x, y, z + (z > 0 ? 0.1 : -0.1));
  house.add(glass);
}

windowUnit(-6.5, 3.5, 11.85, 4.8, 3.5);
windowUnit(8.2, 3.5, 11.85, 4.8, 3.5);
windowUnit(-8.5, 4.6, -11.85, 3.4, 2.2);
windowUnit(7.5, 4.6, -11.85, 3.4, 2.2);

// Interior furniture/details
function addBox(w, h, d, x, y, z, color) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color }));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  house.add(mesh);
  return mesh;
}

// Living room
addBox(4.8, 1, 2.1, -8, 0.5, 8, '#9a3a35'); // sofa
addBox(2.8, 0.55, 1.2, -5.8, 0.28, 8, '#7a4a27'); // coffee table
addBox(3, 0.8, 1.4, -8.5, 0.4, 4.2, '#5f3f2b'); // tv stand
addBox(2.5, 1.6, 0.2, -8.5, 1.7, 3.35, '#222831'); // tv screen

// Dining
addBox(3.5, 0.65, 2.2, -0.5, 0.35, -1, '#8f5a33');
addBox(0.7, 1.1, 0.7, 1.5, 0.55, -2.3, '#d7b58a');
addBox(0.7, 1.1, 0.7, 1.5, 0.55, 0.3, '#d7b58a');
addBox(0.7, 1.1, 0.7, -2.3, 0.55, -2.3, '#d7b58a');
addBox(0.7, 1.1, 0.7, -2.3, 0.55, 0.3, '#d7b58a');

// Kitchen
addBox(4.8, 1.05, 0.9, 8.6, 0.52, -7.8, '#83b6de'); // cabinets
addBox(2.4, 2, 1, 10, 1, -3.8, '#f0f5f8'); // fridge
addBox(2.3, 0.95, 1.5, 7.6, 0.48, -3.7, '#7ec9cd'); // island

// Stairs hint
for (let i = 0; i < 7; i += 1) {
  addBox(2.2, 0.22, 0.65, -1.5, 0.11 + i * 0.22, 4.5 - i * 0.64, '#bc8e62');
}

// Exterior props
const path = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 13), new THREE.MeshStandardMaterial({ color: '#cdbfb4' }));
path.position.set(1.4, 0.08, 18.5);
path.receiveShadow = true;
scene.add(path);

function addTree(x, z, scale = 1) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.36 * scale, 0.5 * scale, 3.4 * scale, 12), new THREE.MeshStandardMaterial({ color: '#6d432c' }));
  trunk.position.y = 1.7 * scale;
  trunk.castShadow = true;
  g.add(trunk);

  const crown = new THREE.Mesh(new THREE.SphereGeometry(1.85 * scale, 14, 14), new THREE.MeshStandardMaterial({ color: '#3ea048' }));
  crown.position.y = 4.5 * scale;
  crown.castShadow = true;
  g.add(crown);

  g.position.set(x, 0, z);
  scene.add(g);
}

addTree(-22, 13, 1.2);
addTree(-24, -5, 1.4);
addTree(26, 10, 1.15);
addTree(28, -6, 1.05);

const car = new THREE.Group();
scene.add(car);
const carBody = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.45, 2.85), new THREE.MeshStandardMaterial({ color: '#b46aa0' }));
carBody.position.y = 1.5;
carBody.castShadow = true;
car.add(carBody);
const carTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1, 2.3), new THREE.MeshStandardMaterial({ color: '#c57ab2' }));
carTop.position.set(-0.4, 2.22, 0);
carTop.castShadow = true;
car.add(carTop);
for (const wx of [-1.8, 1.8]) {
  for (const wz of [-1.35, 1.35]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 20), new THREE.MeshStandardMaterial({ color: '#232323' }));
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, 0.8, wz);
    car.add(wheel);
  }
}
car.position.set(20, 0, -10.5);

// Pointer lock first-person controls
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

const ui = document.getElementById('ui');
const lockHint = document.createElement('button');
lockHint.textContent = 'Entrar en modo primera persona';
lockHint.id = 'enter-fp';
ui.appendChild(lockHint);

lockHint.addEventListener('click', () => controls.lock());
controls.addEventListener('lock', () => {
  lockHint.style.display = 'none';
});
controls.addEventListener('unlock', () => {
  lockHint.style.display = 'inline-block';
});

const keys = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
  ShiftLeft: false,
};
window.addEventListener('keydown', (e) => {
  if (e.code in keys) keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
  if (e.code in keys) keys[e.code] = false;
});

const bounds = {
  minX: -11,
  maxX: 11,
  minZ: -11,
  maxZ: 11,
};

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const clock = new THREE.Clock();

function clampInsideHouse() {
  const pos = controls.getObject().position;
  pos.x = Math.max(bounds.minX, Math.min(bounds.maxX, pos.x));
  pos.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, pos.z));
  pos.y = 1.72;
}

function animate() {
  const elapsed = clock.getElapsedTime();
  const delta = clock.getDelta();

  doorPivot.rotation.y = Math.sin(elapsed * 1.15) * 0.2;
  car.position.x -= delta * 4.2;
  if (car.position.x < -33) car.position.x = 22;
  sunLight.position.set(Math.cos(elapsed * 0.08) * 35, 24 + Math.sin(elapsed * 0.08) * 14, 20);

  if (controls.isLocked) {
    const speed = keys.ShiftLeft ? 8.2 : 4.6;

    direction.z = Number(keys.KeyW) - Number(keys.KeyS);
    direction.x = Number(keys.KeyD) - Number(keys.KeyA);
    direction.normalize();

    velocity.x = direction.x * speed * delta;
    velocity.z = direction.z * speed * delta;

    controls.moveRight(velocity.x);
    controls.moveForward(velocity.z);
    clampInsideHouse();
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
