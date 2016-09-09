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
  
  var handScaler = 200;
  
  var thetaH = map(h%12, 0, 12, 0, TAU);
  var thetaM = map(m, 0, 60, 0, TAU);
  var thetaS = map(s, 0, 60, 0, TAU);
  
  var s_x = + sLength*handScaler*sin(thetaS);
  var s_y = - sLength*handScaler*cos(thetaS);
  
  var m_x = + mLength*handScaler*sin(thetaM);
  var m_y = - mLength*handScaler*cos(thetaM);
  
  var h_x = + hLength*handScaler*sin(thetaH);
  var h_y = - hLength*handScaler*cos(thetaH);
  
  background(col);
  noStroke();
  
  //fill(255);
  //arc(width/2, height/2, handScaler*sLength, handScaler*sLength, 0, thetaS);
  //fill(200);
  //arc(width/2, height/2, handScaler*mLength, handScaler*mLength, 0, thetaM);
  //fill(0);
  //arc(width/2, height/2, handScaler*hLength, handScaler*hLength, 0, thetaH);
  
  fill(255);
  arc(width/2, height/2, 2*handScaler, 2*handScaler, 0, TAU);
  
  // Hour Ticks
  fill(0);
  for (i=1; i<13; i++) {
    var thetaHR = map(i%12, 0, 12, 0, TAU);
    var hX = + 0.85*handScaler*sin(thetaHR);
    var hY = - 0.85*handScaler*cos(thetaHR);
    //ellipse(width/2 + hX, width/2 + hY, 5, 5);
    textSize(20);
    textAlign(CENTER,CENTER);
    text(i, width/2 + hX, width/2 + hY);
  }
  
  stroke('#FF0000');
  // Seconds
  strokeWeight(1);
  line(width/2, height/2, width/2 + s_x, height/2 + s_y);
  
  stroke(0);
  // Minutes
  strokeWeight(2);
  line(width/2, height/2, width/2 + m_x, height/2 + m_y);
  
  // Hours
  strokeWeight(5);
  line(width/2, height/2, width/2 + h_x, height/2 + h_y);
  
}

/* Lesson 1
var col = "#999999";

function draw() {
  var h = hour();
  var m = minute();
  var s = second();
  var myString = nf(h, 2) + ":" + nf(m, 2) + ":" + nf(s, 2);
  
  background(col);
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(255);
  text(myString, width/2, height/2);
}
*/