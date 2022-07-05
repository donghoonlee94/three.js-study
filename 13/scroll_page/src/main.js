import * as THREE from 'three';
import { House } from './House';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';

// ----- 주제: 스크롤에 따라 움직이는 3D 페이지

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-5, 2, 25);
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight('white', 0.7);
spotLight.position.set(0, 150, 100);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 200;
scene.add(spotLight);

const gltfLoader = new GLTFLoader();

// Mesh
const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 'white' }));
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

const houses = [];
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: -5, z: 20, height: 2 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: 7, z: 10, height: 2 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: -10, z: 0, height: 2 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: 10, z: -10, height: 2 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: -5, z: -20, height: 2 }));

// 그리기
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

function throttle(callback, delayTime) {
  let timerId;

  return () => {
    if (timerId) return;

    timerId = setTimeout(() => {
      callback();
      timerId = null;
    }, delayTime);
  };
}

let scrollTop,
  docHeight,
  winHeight,
  scrollPercent,
  scrollPercentRounded,
  text,
  currentSection = 0;
function animateScrollPercent() {
  scrollTop = window.scrollY;
  docHeight = document.body.offsetHeight;
  winHeight = window.innerHeight;
  scrollPercent = scrollTop / (docHeight - winHeight);
  scrollPercentRounded = Math.round(scrollPercent * 100);
  text = `(${scrollPercentRounded}%)`;
  console.log(text);
}

function setSection() {
  currentSection = Math.round(scrollTop / winHeight) || 0;

  gsap.to(camera.position, {
    duration: 1,
    x: houses[currentSection].x,
    z: houses[currentSection].z + 5,
  });
}

window.scrollTo({ top: 0, behavior: 'auto' });

// 이벤트
window.addEventListener('scroll', throttle(setSection, 100));
window.addEventListener('resize', setSize);
window.addEventListener('scroll', throttle(animateScrollPercent, 100));

draw();
