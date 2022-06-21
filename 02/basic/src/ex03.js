import * as THREE from 'three';

// JS로 생성해서 Document 삽입
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

export default function example() {
  // 미리 만든 Canvas에 삽입
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 사용하는 화면의 비율
  // console.log(window.devicePixelRatio);
  // 화면의 비율에 맞게 스케일을 조정해줌.
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // 투명도 조절
  // renderer.setClearAlpha(0.5);

  // 배경색 설정, css의 백그라운드 색상이랑도 연관됨.
  // renderer.setClearColor(0x00ff00);
  renderer.setClearColor('#00ff00');
  renderer.setClearAlpha(0.5);

  // 무대
  const scene = new THREE.Scene();
  // 색상을 바꾸는거지만 scene의 색상을 직접 설정할 경우 renderer 색상은 영향이 업어짐. 투명도 설정은 setClearColor, setClearAlpha 사용해야함.
  scene.background = new THREE.Color(0x0000ff);

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

  function setSize() {
    // 카메라 재설정
    camera.aspect = window.innerWidth / window.innerHeight;
    // 카메라 투영에 관련된 값에 변화가 있을 경우 실행시켜줘야함.
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // Events
  window.addEventListener('resize', setSize);
}
