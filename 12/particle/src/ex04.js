import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

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

  const directionalLight = new THREE.DirectionalLight('white', 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Points
  const geometry = new THREE.BufferGeometry();
  const count = 50000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }
  // 3은 포인트 1개당 값을 3개를 쓰겠다. xyz
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const textureLoader = new THREE.TextureLoader(loadingManager);
  const particleTexture = textureLoader.load(
    '/images/star_05.png',
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
    // 색상
    vertexColors: true,
  });

  const particles = new THREE.Points(geometry, material);
  console.log('particles', particles);
  scene.add(particles);

  console.log(positions);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime() * 10;

    controls.update();

    // particles.rotation.x = time * 0.025;
    // particles.rotation.y = time * 0.05;

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

  gsap.to(camera.position, {
    duration: 10,
    z: 10,
    x: 50,
    onUpdate: function () {
      camera.updateProjectionMatrix();
    },
  });
}
