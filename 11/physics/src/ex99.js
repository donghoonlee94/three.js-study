import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { PreventDragClick } from './PreventDragClick';

// ----- 주제: Force

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

export default function example() {
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
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Cannon(물리 엔진)
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0);

  // Contact Material
  const defaultMaterial = new CANNON.Material('default');
  const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.5,
    restitution: 0.3,
  });
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
    material: defaultMaterial,
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
  cannonWorld.addBody(floorBody);

  const sphereShape = new CANNON.Sphere(0.1);

  // Mesh
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: 'slategray',
    })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  const spheres = [];
  const sphereBodies = [];
  const sphereGeometry = new THREE.SphereGeometry(0.1);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 'white',
  });

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;
    cannonWorld.step(cannonStepTime, delta, 3);

    // sphereBody.applyForce(new CANNON.Vec3(-0.1, 0, 0), sphereBody.position);
    // sphereBody.applyLocalForce(new CANNON.Vec3(-0.1, 0, 0), sphereBody.position);
    // sphereBody.applyImpulse(new CANNON.Vec3(-0.1, 0, 0), sphereBody.position);
    // sphereBody.applyLocalImpulse(new CANNON.Vec3(-0.1, 0, 0), sphereBody.position);

    // new CANNON.Vec3(
    // 	-Math.cos(angle) * 4.5,
    // 	1.55,
    // 	-Math.sin(angle) * 4.5
    // ),
    // new CANNON.Vec3()

    spheres.forEach((item, i) => {
      item.position.copy(sphereBodies[i].position); // 위치
      item.quaternion.copy(sphereBodies[i].quaternion); // 회전
      if (item.position.y < 1) {
        scene.remove(item);
      }
    });

    // 속도 감소
    sphereBodies.forEach((item) => {
      item.velocity.x *= 0.98;
      item.velocity.y *= 0.98;
      item.velocity.z *= 0.98;
      item.angularVelocity.x *= 0.98;
      item.angularVelocity.y *= 0.98;
      item.angularVelocity.z *= 0.98;
    });

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  const sphereCount = 5;

  function spreadSphere() {
    const time = clock.getElapsedTime();
    let reqID;

    const randomX = (Math.random() - 0.5) * 50;
    const randomZ = (Math.random() - 0.5) * 50;
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.castShadow = true;
    sphereMesh.position.set(randomX, 20, randomZ);

    const sphereBody = new CANNON.Body({
      mass: 5,
      position: new CANNON.Vec3(randomX, 20, randomZ),
      shape: sphereShape,
      material: defaultMaterial,
    });

    sphereBodies.push(sphereBody);
    spheres.push(sphereMesh);
    cannonWorld.addBody(sphereBody);
    scene.add(sphereMesh);
    sphereBody.velocity.x = 0;
    sphereBody.velocity.y = 0;
    sphereBody.velocity.z = 0;
    sphereBody.angularVelocity.x = 0;
    sphereBody.angularVelocity.y = 0;
    sphereBody.angularVelocity.z = 0;
    // sphereBody.applyForce(new CANNON.Vec3(0, 10000, 0), sphereBody.position);
  }

  setInterval(spreadSphere, 50);

  // 이벤트
  window.addEventListener('resize', setSize);
  canvas.addEventListener('click', () => {
    if (preventDragClick.mouseMoved) return;
    // velocity & angularVelocity : 속도가 누적되지 않도록 초기화해줌.

    spreadSphere();
  });

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
