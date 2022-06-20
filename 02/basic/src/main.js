import * as THREE from 'three';

// JS로 생성해서 Document 삽입
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// 미리 만든 Canvas에 삽입
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 무대
const scene = new THREE.Scene();

// fov : 시야각, aspect : 종횡비, near : 카메라 앞까지의 거리, far: 카메라에 보이지 않는 거리. naer와 far 사이, 시야각에 보이는 객체만 보임.
// 원근 카메라
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 카메라는 화면의 중간의 위치가 디폴트라 조금 빼줘야 가운데의 물체를 볼 수 있음.

const camera = new THREE.OrthographicCamera(
  -(window.innerWidth / window.innerHeight),
  window.innerWidth / window.innerHeight,
  1,
  -1,
  0.1,
  1000
);

camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;

// x,y,z 값을 쳐다봄
camera.lookAt(0, 0, 0);

camera.zoom = 0.5;
// 카메라 속성 변경 후 호출해줘야함.
camera.updateProjectionMatrix();
scene.add(camera);

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 그리기
renderer.render(scene, camera);
