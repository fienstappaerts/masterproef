//let bigRule = 'F[+FF]-F';

let premise = 'F';
let rules = {
  A: 'F[+FFB][-FB]',
  B: 'F[+FFA][-FA]',
  F: '[+FFF,FFF][-FFF.ffF]FffF[-Ff,FFF-F]',

}
let bigRule;


let length = 70;
let angle = 90;

function setup() {
  createCanvas(600, 600, WEBGL);
  angleMode(DEGREES);
  bigRule = resolveRules(premise, rules, 2);
  print(bigRule);
}

function draw() {
  background('white');
  stroke(0, 0, 255);
  strokeWeight(2);
  translate(width / 2, height / 2);
  rotate(-90);
  scale(0.3);
  orbitControl();

  drawShape(bigRule);
   // angle += 1;
  // length += 0.1;
}

function resolveRules(startRule, rules, depth) {
  let endRule = '';
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


function drawShape(rule)  {
  for (let c of rule) {
    if (c === 'F') {
      box(length);
      translate(0, -length, 0);
      //translate(length, 0);
    } else if (c === 'f') {
      translate(0, -length, 0); 
    } else if (c === '+') {
      rotate(angle);
    } else if (c === '-') {
      rotate(-angle);
    } else if (c === '[') {
      push();
    } else if (c === ']') {
      pop();
    } else if (c === '>') {
      scale(1.2);
    } else if (c === '<') {
      scale(0.8);
    }
  }
}