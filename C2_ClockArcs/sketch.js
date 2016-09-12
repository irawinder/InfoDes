
function setup() {
  createCanvas(800, 800);
}

var col = "#999999";
var hLength = 0.7;
var mLength = 0.9;
var sLength = 0.95;

function draw() {
  var h = hour();
  var m = minute();
  var s = second();
  
  var handScaler = 250;
  
  var thetaH = map(h%12 + m/60.0, 0, 12, 0, TAU);
  var thetaM = map(m + s/60.0, 0, 60, 0, TAU);
  var thetaS = map(s, 0, 60, 0, TAU);
  
  background(col);
  noStroke();
  
  fill(255);
  arc(width/2, height/2, handScaler*sLength, handScaler*sLength, -PI/2, thetaS-PI/2);
  fill(200);
  arc(width/2, height/2, handScaler*mLength, handScaler*mLength, -PI/2, thetaM-PI/2);
  fill(0);
  arc(width/2, height/2, handScaler*hLength, handScaler*hLength, -PI/2, thetaH-PI/2);
  
}