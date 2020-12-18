function toRadians(deg) {
  return deg * (Math.PI / 180);
}

let premise = "F";
let rules = {
  A: "F[+FFB][-FB]",
  B: "F[+FFA][-FA]",
  F: "[+FFF,FFF][-FFF.ffF]FffF[-Ff,FFF-F]",
};
let bigRule;

let length = 1;
let angle = 90;

bigRule = resolveRules(premise, rules, 2);

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

const light1 = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 1, 100);
light2.position.set(0, 2, 0);
scene.add(light2);

const shapeGroup = new THREE.Group();
scene.add(shapeGroup);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });

buildShape(bigRule);
// const material = new THREE.LineBasicMaterial({
//   color: 0xffffff,
//   linewidth: 1,
//   linecap: "round", //ignored by WebGLRenderer
//   linejoin: "round", //ignored by WebGLRenderer
// });

// const cube = new THREE.Mesh(boxGeometry, boxMaterial);
// // cube.position = new THREE.Vector3(1, 10, 5);
// // cube.matrixAutoUpdate = false;
// const translateMatrix = new THREE.Matrix4();
// translateMatrix.makeTranslation(1, 0, 0);
// cube.matrixAutoUpdate = false;
// cube.matrix.multiply(translateMatrix);
// scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

function resolveRules(startRule, rules, depth) {
  let endRule = "";
  for (let currentLetter of startRule) {
    if (currentLetter in rules) {
      endRule += rules[currentLetter];
    } else {
      endRule += currentLetter;
    }
  }
  if (depth >= 1) {
    endRule = resolveRules(endRule, rules, depth - 1);
  }
  return endRule;
}

// Note that we "build" the geometry, not draw it immediately.
// We just add it to the scene.
function buildShape(rule) {
  const matrixStack = [];
  let matrix = new THREE.Matrix4();
  const tmpMatrix = new THREE.Matrix4();

  for (let c of rule) {
    if (c === "F") {
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.matrixAutoUpdate = false;
      box.matrix.copy(matrix);
      shapeGroup.add(box);
      // box(length);
      // translate(0, -length, 0);
      tmpMatrix.makeTranslation(0, -length, 0);
      matrix.multiply(tmpMatrix);
    } else if (c === "f") {
      tmpMatrix.makeTranslation(0, -length, 0);
      matrix.multiply(tmpMatrix);
      // translate(0, -length, 0);
    } else if (c === "+") {
      // rotate(angle);
      tmpMatrix.makeRotationZ(toRadians(angle));
      matrix.multiply(tmpMatrix);
    } else if (c === "-") {
      // matrix.rotate(-angle);
      tmpMatrix.makeRotationZ(toRadians(-angle));
      matrix.multiply(tmpMatrix);
    } else if (c === "[") {
      matrixStack.push(matrix.clone());
    } else if (c === "]") {
      matrix = matrixStack.pop();
    } else if (c === ">") {
      // scale(1.2);
      tmpMatrix.makeScale(1.2, 1.2, 1.2);
      matrix.multiply(tmpMatrix);
    } else if (c === "<") {
      // scale(0.8);
      tmpMatrix.makeScale(0.8, 0.8, 0.8);
      matrix.multiply(tmpMatrix);
    }
  }
}
