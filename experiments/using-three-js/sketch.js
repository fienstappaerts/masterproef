const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new THREE.OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const material = new THREE.LineBasicMaterial({
//   color: 0xffffff,
//   linewidth: 1,
//   linecap: "round", //ignored by WebGLRenderer
//   linejoin: "round", //ignored by WebGLRenderer
// });

const cube = new THREE.Mesh(geometry, material);
// cube.position = new THREE.Vector3(1, 10, 5);
// cube.matrixAutoUpdate = false;
cube.matrix.setPosition(1, 0, 5);
// cube.translateX(1);
// cube.matrixWorldsNeedUpdate = true;

// cube.matrix.multiplyScalar(4);

// const line = new THREE.Line(geometry, material);

// const wireframe = new THREE.WireframeGeometry(geometry);

// const line = new THREE.LineSegments(wireframe);
// line.material.depthTest = false;
// line.material.opacity = 1.0;
// line.material.transparent = true;

// scene.add(line);
scene.add(cube);

// scene.add(line);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
