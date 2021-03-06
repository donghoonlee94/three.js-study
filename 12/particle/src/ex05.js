import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { DirectionalLightHelper, SpotLightHelper } from 'three';

// ----- 주제: 기본 Geometry 파티클

export default function example() {
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log('로드 시작');
  };

  loadingManager.onProgress = (img) => {
    console.log(img + '로드 중');
  };

  loadingManager.onLoad = () => {
    console.log('로드 완료');
  };

  loadingManager.onError = () => {
    console.log('로드 오류');
  };

  // Renderer
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight('white', 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('white', 100);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  const lightHelper = new DirectionalLightHelper(directionalLight);
  scene.add(lightHelper);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Points
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const positionArray = sphereGeometry.attributes.position.array;

  const geometry = new THREE.BufferGeometry();

  const textureLoader = new THREE.TextureLoader();
  const particleTexture = textureLoader.load(
    '/images/star_01.png',
    (texture) => {
      console.log(texture);
    },
    (progress) => {
      console.log(progress);
    }
  );

  const material = new THREE.PointsMaterial({
    size: 0.3,
    map: particleTexture,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    vertexColors: true,
  });

  console.log(particles);

  const color = new Float32Array(positionArray.length);
  for (let i = 0; i < positionArray.length; i += 3) {
    color[i] = Math.random();
    color[i + 1] = Math.random();
    color[i + 2] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(color, 3));
  const particles = new THREE.Points(geometry, material);

  scene.add(particles);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime() * 10;

    controls.update();

    // particles.rotation.x = time * 0.025;
    // particles.rotation.y = time * 0.05;

    // light.position.x = Math.cos(time * 0.2) * 5;
    // light.position.z = Math.sin(time * 0.1) * 5;
    // light.rotation.x = Math.cos(time * 0.2) * 5;
    // light.rotation.y = Math.cos(time * 0.2) * 5;

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener('resize', setSize);

  draw();
}
