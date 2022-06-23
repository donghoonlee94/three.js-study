import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: Skybox

export default function example() {
  // 텍스쳐 이미지 로드
  const cubeTextureLoader = new THREE.CubeTextureLoader();

  const cubeTex = cubeTextureLoader.setPath('./textures/cubemap/').load([
    // + = 순서 n은 네거티브, 마이너스, p는 포지티브, 플러스 xyz
    'px.png',
    'nx.png',
    'py.png',
    'ny.png',
    'pz.png',
    'nz.png',
  ]);

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
  const directionalLight = new THREE.DirectionalLight('white', 1);
  directionalLight.position.x = 1;
  directionalLight.position.y = 1;
  directionalLight.position.z = 2;

  scene.add(directionalLight);
  scene.add(ambientLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material1 = new THREE.MeshBasicMaterial({
    // standart는 metalness, roughnes 같이 사용. env는 환경 같은 효과를 냄. 내 주변의 환경
    color: 'gold',
    envMap: cubeTex,
  });

  const mesh = new THREE.Mesh(geometry, material1);

  scene.add(mesh);

  const geometry2 = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < 10000; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
    vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
    vertices.push(THREE.MathUtils.randFloatSpread(3000)); // z
  }

  geometry2.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const particles = new THREE.Points(geometry2, new THREE.PointsMaterial({ color: 0x888888 }));
  scene.add(particles);

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

  // 이벤트
  window.addEventListener('resize', setSize);

  draw();
}
