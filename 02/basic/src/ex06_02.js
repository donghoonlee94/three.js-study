import * as THREE from 'three';

// JS로 생성해서 Document 삽입
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

export default function example() {
  // 미리 만든 Canvas에 삽입
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 사용하는 화면의 비율
  // console.log(window.devicePixelRatio);
  // 화면의 비율에 맞게 스케일을 조정해줌.
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // 투명도 조절
  // renderer.setClearAlpha(0.5);

  // 배경색 설정, css의 백그라운드 색상이랑도 연관됨.
  // renderer.setClearColor(0x00ff00);
  // renderer.setClearColor('#00ff00');
  // renderer.setClearAlpha(0.5);

  // 무대
  const scene = new THREE.Scene();
  // 색상을 바꾸는거지만 scene의 색상을 직접 설정할 경우 renderer 색상은 영향이 업어짐. 투명도 설정은 setClearColor, setClearAlpha 사용해야함.
  // scene.background = new THREE.Color(0x0000ff);

  // fov : 시야각, aspect : 종횡비, near : 카메라 앞까지의 거리, far: 카메라에 보이지 않는 거리. naer와 far 사이, 시야각에 보이는 객체만 보임.
  // 원근 카메라
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // 카메라는 화면의 중간의 위치가 디폴트라 조금 빼줘야 가운데의 물체를 볼 수 있음.

  // const camera = new THREE.OrthographicCamera(
  //   -(window.innerWidth / window.innerHeight),
  //   window.innerWidth / window.innerHeight,
  //   1,
  //   -1,
  //   0.1,
  //   1000
  // );

  camera.position.z = 5;

  // x,y,z 값을 쳐다봄
  camera.lookAt(0, 0, 0);

  camera.zoom = 0.5;
  // 카메라 속성 변경 후 호출해줘야함.
  camera.updateProjectionMatrix();
  scene.add(camera);

  // 1은 빛의 강도
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.z = 2;
  scene.add(light);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  let oldTime = Date.now();

  function draw() {
    const newTime = Date.now();
    const deltaTime = newTime - oldTime;
    oldTime = newTime;
    // 각도는 Radian을 사용
    // 360도는 2파이 3.14 * 2
    // mesh.rotation.y += 0.01;
    // mesh.rotation.x += 0.01;

    // 시간은 어느 기기에서든 동일하게 흐르기 때문에 이 시간을 이용해서 애니메이션을 실행하면 성능이 보정됨.
    // const time = clock.getElapsedTime();

    // 이 함수가 설정된 이후 경과된 초를 가져옴.
    // const delta = clock.getDelta();

    // degree 값을 radian으로 변환
    // mesh.rotation.y += THREE.MathUtils.degToRad(1);
    mesh.rotation.y += deltaTime / 1000;
    mesh.position.y += deltaTime;
    if (mesh.position.y > 3) {
      mesh.position.y = 0;
    }

    renderer.render(scene, camera);

    // requestAnimationFrame(draw);
    renderer.setAnimationLoop(draw);
  }

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

  draw();
}
