import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let positions = [],
  velocities = [],
  particles,
  orbitControls,
  camera,
  renderer,
  scene;
const numSnowFlakes = 15000;
const maxRange = 1000,
  minRange = maxRange / 2;
const minHeight = 150; // snowflakes placed from 150 to 500 on y axis;

const geometry = new THREE.BufferGeometry();
const textureLoader = new THREE.TextureLoader();

function addSnowFlakes() {
  for (let i = 0; i < numSnowFlakes; i++) {
    positions.push(
      Math.floor(Math.random() * maxRange - minRange), // x -500 to 500
      Math.floor(Math.random() * minRange + minHeight), // y 250 to 750;
      Math.floor(Math.random() * maxRange - minRange) // z -500 to 500
    );

    velocities.push(
      Math.floor(Math.random() * 6 - 3) * 0.1, // x 0.3 to 0.3
      Math.floor(Math.random() * 5 + 0.12) * 0.1, // y 0.02 to 0.92
      Math.floor(Math.random() * 6 - 3) * 0.1 // z 0.3 to 0.3
    );
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

  const flakeMaterial = new THREE.PointsMaterial({
    size: Math.floor(Math.random() * 10 + 4),
    map: textureLoader.load('./images/snowflake2.png'),
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    opacity: 0.7,
  });

  particles = new THREE.Points(geometry, flakeMaterial);
  console.log(particles);

  scene.add(particles);
}

function updateParticles() {
  for (let i = 0; i < numSnowFlakes * 3; i += 3) {
    // change x position by x velocity
    particles.geometry.attributes.position.array[i] -= particles.geometry.attributes.velocity.array[i];
    // change y position by y velocity
    particles.geometry.attributes.position.array[i + 1] -= particles.geometry.attributes.velocity.array[i + 1];
    // change z position by z velocity
    particles.geometry.attributes.position.array[i + 2] -= particles.geometry.attributes.velocity.array[i + 2];

    // check to see if below ground; if so, move to new starting x, y, z position
    if (particles.geometry.attributes.position.array[i + 1] < -200) {
      particles.geometry.attributes.position.array[i] = Math.floor(Math.random() * maxRange - minRange); // x
      particles.geometry.attributes.position.array[i + 1] = Math.floor(Math.random() * minRange + minHeight); // y
      particles.geometry.attributes.position.array[i + 2] = Math.floor(Math.random() * maxRange - minRange); // z
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
}

function render() {
  const canvas = document.querySelector('#three-canvas');
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight('white', 0.5);
  scene.add(ambientLight);

  orbitControls = new OrbitControls(camera, renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  updateParticles();
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

// 이벤트
window.addEventListener('resize', setSize);

render();
addSnowFlakes();
animate();
