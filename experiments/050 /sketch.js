
// Point = P, Rectangle = R, line = F, Line*4 = D
// You can play around with length, angle, strokeweight, colors,...

let premise = 'FA';
  let rules = {
    F: 'FffA-ffFffAF',
    A: 'Fff-ffF+AffFFA',
  }
let bigRule;


let length = 50;
let angle = 60;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  bigRule = resolveRules(premise, rules, 3);
  print(bigRule);
  
}

function draw() {
  background('white');
  stroke('black');
  strokeWeight(3);
  //noFill();
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
      rect(0, 0, length, length);
      translate(length, 0);
    } else if (c === 'P') {
      point(0, 0);
      translate(length/2, 0);
    } else if (c === 'D') {
      line(0, 0, length * 4, 0);
      translate(length*4, 0);
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