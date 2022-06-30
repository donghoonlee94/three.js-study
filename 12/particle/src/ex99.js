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

  const directionalLight = new THREE.DirectionalLight('red', 100);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  const lightHelper = new DirectionalLightHelper(directionalLight);
  scene.add(lightHelper);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Points
  const sphereGeometry = new THREE.SphereGeometry(15, 16, 16);
  const positionArray = sphereGeometry.attributes.position.array;
  const group = new THREE.Group();
  const coneGeometry = new THREE.ConeGeometry(5, 1, 3, 1);

  let mesh;
  for (let i = 0; i < positionArray.length; i += 3) {
    mesh = new THREE.Mesh(coneGeometry, new THREE.MeshNormalMaterial());
    mesh.position.x = positionArray[i];
    mesh.position.y = positionArray[i + 1];
    mesh.position.z = positionArray[i + 2];

    mesh.lookAt(0, 0, 0);

    group.add(mesh);
  }

  scene.add(group);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime() * 10;

    group.rotation.x += 0.0025;
    group.rotation.y += 0.0025;

    controls.update();

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  console.log(group.children.length * 3);
  console.log(positionArray.length);

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
