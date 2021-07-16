import './style.css';

import * as THREE from 'https://cdn.skypack.dev/three';

// importing images for production 
import moonTextureImg from './Moon_texture.jpeg';
import moonNormalImg from './Moon_normal.jpeg';
import spaceImg from './space.jpeg';
import headshotImg from './headshot.png';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// Torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xff6347});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Light 
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper, gridHelper);

// Orbit 
//const controls = new OrbitControls(camera, renderer.domElement);

// Add stars 
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar);

// Add Space Background
const spaceTexture = new THREE.TextureLoader().load(spaceImg);
scene.background = spaceTexture;

// Avatar 
const markTexture = new THREE.TextureLoader().load(headshotImg);
const mark = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: markTexture})
);
scene.add(mark);

// Add Moon
const moonTexture = new THREE.TextureLoader().load(moonTextureImg);
const normalTexture = new THREE.TextureLoader().load(moonNormalImg);
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture, 
    normalMap: normalTexture
  })
);
scene.add(moon);

moon.position.z = 20;
moon.position.setX(-5);

mark.position.z = -5;
mark.position.x = 2;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  mark.rotation.y += 0.01;
  mark.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  //controls.update();
  renderer.render(scene, camera);
}

animate();
