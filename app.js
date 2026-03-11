import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.161.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#88c8ff');

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(26, 12, 24);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 5, 0);
controls.maxPolarAngle = Math.PI / 2 - 0.03;
controls.minDistance = 8;
controls.maxDistance = 60;

const hemiLight = new THREE.HemisphereLight('#d9f6ff', '#8d6c49', 0.9);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight('#fff9dd', 1.1);
sunLight.position.set(30, 35, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 120;
sunLight.shadow.camera.left = -45;
sunLight.shadow.camera.right = 45;
sunLight.shadow.camera.top = 45;
sunLight.shadow.camera.bottom = -45;
scene.add(sunLight);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(220, 220),
  new THREE.MeshStandardMaterial({ color: '#59b85d', roughness: 0.9 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const street = new THREE.Mesh(
  new THREE.PlaneGeometry(220, 20),
  new THREE.MeshStandardMaterial({ color: '#3f434b', roughness: 0.95 })
);
street.position.y = 0.01;
street.rotation.x = -Math.PI / 2;
scene.add(street);

const sidewalk = new THREE.Mesh(
  new THREE.BoxGeometry(220, 0.25, 9),
  new THREE.MeshStandardMaterial({ color: '#a7adb8' })
);
sidewalk.position.set(0, 0.12, -7.5);
sidewalk.receiveShadow = true;
scene.add(sidewalk);

const houseGroup = new THREE.Group();
scene.add(houseGroup);

const base = new THREE.Mesh(
  new THREE.BoxGeometry(17, 8, 12),
  new THREE.MeshStandardMaterial({ color: '#e4a7a5' })
);
base.position.set(0, 4, 0);
base.castShadow = true;
base.receiveShadow = true;
houseGroup.add(base);

const frontVolume = new THREE.Mesh(
  new THREE.BoxGeometry(8, 6, 5),
  new THREE.MeshStandardMaterial({ color: '#d99596' })
);
frontVolume.position.set(0, 3, 8.5);
frontVolume.castShadow = true;
frontVolume.receiveShadow = true;
houseGroup.add(frontVolume);

const garage = new THREE.Mesh(
  new THREE.BoxGeometry(8, 5, 8),
  new THREE.MeshStandardMaterial({ color: '#d49a84' })
);
garage.position.set(-12, 2.5, 1.5);
garage.castShadow = true;
garage.receiveShadow = true;
houseGroup.add(garage);

function addRoof(width, height, depth, pos, rotY = 0) {
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(width, height, 4),
    new THREE.MeshStandardMaterial({ color: '#cf6f31', roughness: 0.75 })
  );
  roof.position.copy(pos);
  roof.rotation.y = Math.PI / 4 + rotY;
  roof.castShadow = true;
  houseGroup.add(roof);
}

addRoof(10, 4, 10, new THREE.Vector3(0, 10, 0));
addRoof(5.2, 2.8, 5.2, new THREE.Vector3(0, 7.8, 8.5));
addRoof(5.5, 2.6, 5.5, new THREE.Vector3(-12, 6.5, 1.5));

const chimney = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 4, 1.8),
  new THREE.MeshStandardMaterial({ color: '#b0573f' })
);
chimney.position.set(4.5, 10.5, -1.5);
chimney.castShadow = true;
houseGroup.add(chimney);

const doorPivot = new THREE.Group();
doorPivot.position.set(2.8, 0, 10.95);
houseGroup.add(doorPivot);

const door = new THREE.Mesh(
  new THREE.BoxGeometry(2, 4, 0.2),
  new THREE.MeshStandardMaterial({ color: '#6f3f23' })
);
door.position.set(-1, 2, 0);
door.castShadow = true;
doorPivot.add(door);

const garageDoor = new THREE.Mesh(
  new THREE.BoxGeometry(5.5, 3.2, 0.15),
  new THREE.MeshStandardMaterial({ color: '#f4f4f4' })
);
garageDoor.position.set(-12, 1.9, 5.55);
houseGroup.add(garageDoor);

function addWindow(x, y, z, w = 2.2, h = 1.7) {
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, 0.2),
    new THREE.MeshStandardMaterial({ color: '#f8f4e5' })
  );
  frame.position.set(x, y, z);
  frame.castShadow = true;
  houseGroup.add(frame);

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.22, h - 0.2, 0.08),
    new THREE.MeshStandardMaterial({ color: '#8ad7ff', emissive: '#236488', emissiveIntensity: 0.35 })
  );
  glass.position.set(x, y, z + Math.sign(z) * 0.07);
  houseGroup.add(glass);
}

addWindow(-4.5, 5, 6.05);
addWindow(4.4, 5, 6.05);
addWindow(-5.8, 5, -6.05);
addWindow(5.8, 5, -6.05);
addWindow(-1.8, 2.3, 10.95, 2, 1.5);
addWindow(-15, 2.8, 5.55, 2, 1.5);

const walkway = new THREE.Mesh(
  new THREE.BoxGeometry(2.5, 0.15, 13),
  new THREE.MeshStandardMaterial({ color: '#c8bfb7' })
);
walkway.position.set(2.8, 0.08, 17);
walkway.receiveShadow = true;
scene.add(walkway);

const fenceMaterial = new THREE.MeshStandardMaterial({ color: '#e6dfcd' });
for (let i = -12; i <= 12; i += 1.3) {
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.3), fenceMaterial);
  post.position.set(i, 0.9, 14);
  post.castShadow = true;
  scene.add(post);
}
const fenceRail = new THREE.Mesh(new THREE.BoxGeometry(26, 0.2, 0.2), fenceMaterial);
fenceRail.position.set(0, 1.4, 14);
scene.add(fenceRail);

function addTree(x, z, scale = 1) {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35 * scale, 0.5 * scale, 3.2 * scale, 12),
    new THREE.MeshStandardMaterial({ color: '#6d432a' })
  );
  trunk.position.y = 1.6 * scale;
  trunk.castShadow = true;
  tree.add(trunk);

  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(1.8 * scale, 16, 16),
    new THREE.MeshStandardMaterial({ color: '#3e9e45' })
  );
  crown.position.y = 4.2 * scale;
  crown.castShadow = true;
  tree.add(crown);

  tree.position.set(x, 0, z);
  scene.add(tree);
}

addTree(14, 10, 1.2);
addTree(18, -4, 1);
addTree(-24, -8, 1.4);
addTree(-19, 10, 1.1);

const car = new THREE.Group();
const carBody = new THREE.Mesh(
  new THREE.BoxGeometry(5.2, 1.5, 2.8),
  new THREE.MeshStandardMaterial({ color: '#9dd750' })
);
carBody.position.y = 1.5;
carBody.castShadow = true;
car.add(carBody);

const carTop = new THREE.Mesh(
  new THREE.BoxGeometry(2.6, 1, 2.3),
  new THREE.MeshStandardMaterial({ color: '#a9e25d' })
);
carTop.position.set(-0.4, 2.25, 0);
carTop.castShadow = true;
car.add(carTop);

for (const offsetX of [-1.8, 1.8]) {
  for (const offsetZ of [-1.35, 1.35]) {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.5, 20),
      new THREE.MeshStandardMaterial({ color: '#2c2c2c' })
    );
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(offsetX, 0.8, offsetZ);
    car.add(wheel);
  }
}

car.position.set(-30, 0, -1.6);
scene.add(car);

const clouds = [];
for (let i = 0; i < 6; i += 1) {
  const cloud = new THREE.Group();
  for (let j = 0; j < 3; j += 1) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(2 + Math.random() * 0.8, 12, 12),
      new THREE.MeshStandardMaterial({ color: '#ffffff' })
    );
    puff.position.set(j * 2.2, Math.random() * 0.8, Math.random() * 1.5);
    cloud.add(puff);
  }
  cloud.position.set(-50 + i * 20, 22 + Math.random() * 5, -30 + Math.random() * 60);
  clouds.push(cloud);
  scene.add(cloud);
}

const keys = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
  KeyQ: false,
  KeyE: false,
};

window.addEventListener('keydown', (e) => {
  if (e.code in keys) keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
  if (e.code in keys) keys[e.code] = false;
});

function moveCamera(delta) {
  const speed = 9 * delta;
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();

  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  if (keys.KeyW) camera.position.addScaledVector(forward, speed);
  if (keys.KeyS) camera.position.addScaledVector(forward, -speed);
  if (keys.KeyA) camera.position.addScaledVector(right, speed);
  if (keys.KeyD) camera.position.addScaledVector(right, -speed);
  if (keys.KeyQ) camera.position.y += speed;
  if (keys.KeyE) camera.position.y -= speed;

  controls.target.x += ((camera.position.x - controls.target.x) * 0.02);
  controls.target.z += ((camera.position.z - controls.target.z) * 0.02);
}

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  const delta = clock.getDelta();

  moveCamera(delta);
  controls.update();

  doorPivot.rotation.y = Math.sin(elapsed * 1.3) * 0.35;

  car.position.x += delta * 8;
  if (car.position.x > 35) car.position.x = -35;

  clouds.forEach((cloud, index) => {
    cloud.position.x += delta * (1.4 + index * 0.08);
    if (cloud.position.x > 60) cloud.position.x = -60;
  });

  const sunAngle = elapsed * 0.08;
  sunLight.position.set(Math.cos(sunAngle) * 35, 25 + Math.sin(sunAngle) * 15, 20);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
