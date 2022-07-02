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
  // scene.add(lightHelper);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Points
  const sphereGeometry = new THREE.SphereGeometry(15, 32, 32);
  const spherePositionArray = sphereGeometry.attributes.position.array;
  const group = new THREE.Group();
  const coneGeometry = new THREE.ConeGeometry(5, 1, 3, 1);
  const randomPositionArray = [];

  for (let i = 0; i < spherePositionArray.length; i++) {
    randomPositionArray.push((Math.random() - 0.5) * 100);
  }

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('./images/star_01.png');

  const meshs = [];
  let mesh;
  for (let i = 0; i < spherePositionArray.length; i += 3) {
    mesh = new THREE.Mesh(
      coneGeometry,
      new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        // 색상
        vertexColors: true,
      })
    );
    mesh.position.x = spherePositionArray[i];
    mesh.position.y = spherePositionArray[i + 1];
    mesh.position.z = spherePositionArray[i + 2];

    mesh.lookAt(0, 0, 0);

    mesh.defaultRotationX = mesh.rotation.x;
    mesh.defaultRotationY = mesh.rotation.y;
    mesh.defaultRotationZ = mesh.rotation.z;

    meshs.push(mesh);
    group.add(mesh);
  }

  scene.add(group);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime() * 10;

    group.rotation.x += 0.0025;
    group.rotation.y += 0.0025;

    directionalLight.position.x = Math.cos(time * 0.1) * 25;
    directionalLight.position.z = Math.sin(time * 0.1) * 25;

    controls.update();

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  let infinityRotationRAFID;

  function infinityRotationMesh() {
    for (let i = 0; i < meshs.length; i++) {
      meshs[i].rotation.x += 0.005;
      meshs[i].rotation.y += 0.0025;
      meshs[i].rotation.z += 0.001;
    }

    infinityRotationRAFID = requestAnimationFrame(infinityRotationMesh);
  }

  function setShape(e) {
    let array;
    switch (e.target.dataset.type) {
      case 'random':
        array = randomPositionArray;
        break;
      case 'sphere':
        array = spherePositionArray;
        break;
    }

    // 위 배열에서 ImagePanel을 추가할 때 3의 배수씩 추가했기 때문에 *3을 해줘야함.
    for (let i = 0; i < meshs.length; i++) {
      gsap.to(meshs[i].position, {
        duration: 2,
        x: array[i * 3],
        y: array[i * 3 + 1],
        z: array[i * 3 + 2],
      });
    }

    if (e.target.dataset.type === 'random') infinityRotationMesh();
    if (e.target.dataset.type === 'sphere') {
      for (let i = 0; i < meshs.length; i++) {
        gsap.to(meshs[i].rotation, {
          duration: 2,
          x: meshs[i].defaultRotationX,
          y: meshs[i].defaultRotationY,
          z: meshs[i].defaultRotationZ,
        });
      }
      cancelAnimationFrame(infinityRotationRAFID);
    }
  }

  const btnWrapper = document.createElement('div');
  btnWrapper.classList.add('btns');

  const randomBtn = document.createElement('button');
  randomBtn.dataset.type = 'random';
  randomBtn.style.cssText = 'position: absolute; left: 20px; top: 20px;';
  randomBtn.innerHTML = 'Random';
  btnWrapper.append(randomBtn);

  const sphereBtn = document.createElement('button');
  sphereBtn.dataset.type = 'sphere';
  sphereBtn.style.cssText = 'position: absolute; left: 20px; top: 50px;';
  sphereBtn.innerHTML = 'Sphere';
  btnWrapper.append(sphereBtn);

  document.body.append(btnWrapper);

  gsap.to(camera.position, {
    duration: 2,
    z: 80,
  });

  // 이벤트
  window.addEventListener('resize', setSize);
  btnWrapper.addEventListener('click', setShape);

  draw();
}
