//added controls and a floor
let KEY_DOWN_PRESSED = false;
let KEY_UP_PRESSED = false;
let KEY_LEFT_PRESSED = false;
let KEY_RIGHT_PRESSED = false;

let MOUSE_X = 0;
let MOUSE_Y = 0;

let playerSpeed = 10.0;

function toRadians(deg) {
  return deg * (Math.PI / 180);
}

let premise = ":GF+FfAB<BB$fffBB[>B]";
let rules = {
  //F: 'FFff:f+F$F',
  A: ":FBBF",
  B: "AAFF",
  G: "FFFFFFFFFFF",
};
let bigRule;

let length = 3;
let angle = 90;

bigRule = resolveRules(premise, rules, 4);

const scene = new THREE.Scene();
scene.background = new THREE.Color("black");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
//renderer.setClearColor(new THREE.Color("black"));
document.body.appendChild(renderer.domElement);
// const controls = new THREE.OrbitControls(camera, renderer.domElement);

const light1 = new THREE.AmbientLight(0xffffff, 0.4); // soft white light
scene.add(light1);

/*
  const light2 = new THREE.PointLight(0xffffff, 1, 100);
  light2.position.set(0, 2, 0);
  scene.add(light2);
  */

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight.target);
directionalLight.position.set(0, 15, 15); //= new THREE.Vector3(0, 15, 15);
//directionalLight.target.direction = new THREE.Vector3(0, 15, 15);
scene.add(directionalLight);

//const helper = new THREE.DirectionalLightHelper( directionalLight, 1 );
//scene.add( helper );

const shapeGroup = new THREE.Group();
scene.add(shapeGroup);

const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
const boxMaterial = new THREE.MeshPhongMaterial({ color: "white" });
boxMaterial.wireframe = true;

buildShape(bigRule);

// const geometry = new THREE.PlaneGeometry(1000, 1000);
// geometry.rotateX(-Math.PI / 2);
// const material = new THREE.MeshBasicMaterial({ color: "lightgrey" });
// const plane = new THREE.Mesh(geometry, material);
// (plane.position.y = -1), 5;
// scene.add(plane);

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

composer = new THREE.EffectComposer(renderer);

const ssaoPass = new THREE.SSAOPass(
  scene,
  camera,
  window.innerWidth,
  window.innerHeight
);
ssaoPass.kernelRadius = 16;
composer.addPass(ssaoPass);

camera.position.y = 4;
camera.position.z = 0;

let lastTime = Date.now();
function animate() {
  const dt = (Date.now() - lastTime) / 1000;
  // console.log(dt);
  requestAnimationFrame(animate);
  composer.render();
  if (KEY_DOWN_PRESSED) {
    camera.position.z += playerSpeed * dt;
  } else if (KEY_UP_PRESSED) {
    camera.position.z -= playerSpeed * dt;
  }
  lastTime = Date.now();
  // camera.rotation = new Euler
  camera.rotation.y = (-MOUSE_X * Math.PI) / 2;
  camera.rotation.x = (MOUSE_Y * Math.PI) / 2;
  camera.rotation.order = "YXZ";
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
    } else if (c === ":") {
      // rotate(angle);
      tmpMatrix.makeRotationX(toRadians(angle));
      matrix.multiply(tmpMatrix);
    } else if (c === ";") {
      // matrix.rotate(-angle);
      tmpMatrix.makeRotationX(toRadians(-angle));
      matrix.multiply(tmpMatrix);
    } else if (c === "$") {
      // rotate(angle);
      tmpMatrix.makeRotationY(toRadians(angle));
      matrix.multiply(tmpMatrix);
    } else if (c === "^") {
      // matrix.rotate(-angle);
      tmpMatrix.makeRotationY(toRadians(-angle));
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

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") {
    KEY_UP_PRESSED = true;
  } else if (e.key === "ArrowDown" || e.key === "s") {
    KEY_DOWN_PRESSED = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") {
    KEY_UP_PRESSED = false;
  } else if (e.key === "ArrowDown" || e.key === "s") {
    KEY_DOWN_PRESSED = false;
  }
});

window.addEventListener("mousemove", (e) => {
  MOUSE_X = e.clientX / window.innerWidth - 0.5;
  MOUSE_Y = e.clientY / window.innerHeight - 0.5;
  // console.log(MOUSE_X, MOUSE_Y);
});
