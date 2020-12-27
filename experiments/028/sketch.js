
let premise = 'AFB';
  let rules = {
    A: 'R',
    F: 'FBA++BRRFF[B+R]',
    B: '[F+RFF]FFA+A',

  }
let bigRule;


let length = 30;
let angle = 90;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  bigRule = resolveRules(premise, rules, 5);
  print(bigRule);
  
}

function draw() {
  background('white');
  stroke('black');
  strokeWeight(2);
  translate(width / 2, height / 2);
  rotate(-90);
  scale(0.3);

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
      line(0, 0, length, 0);
      translate(length, 0);
    } else if (c === 'R') {
      rect(0, 0, length*2, length);
      translate(length*2, length);
    } else if (c === 'D') {
      line(0, 0, length * 4, 0);
      translate(length, 0);
    } else if (c === 'f') {
      translate(0, length, 0);
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