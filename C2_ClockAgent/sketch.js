// An Agent Based Visualization for a clock
// Ira Winder, Sep 2016

var col = "#999999";
var hLength = 0.7;
var mLength = 0.9;
var sLength = 0.95;
var sec = [];
var numSec = 10;

function setup() {
  createCanvas(800, 800);
  for (var i=0; i<numSec; i++) {
    // Agent(diam, maxRepel, maxVel, seekAcc, repelAcc, posX, posY, targetX, targetY)
    sec[i] = new Agent(30, 50, 10, 0.25, 1, random(width), random(height), 400, 400);
  }
}

function draw() {
  var h = hour();
  var m = minute();
  var s = second();
  
  background(col);
  noStroke();
  
  // var handScaler = 600;
  
  // var thetaH = map(h%12 + m/60.0, 0, 12, 0, TAU);
  // var thetaM = map(m + s/60.0, 0, 60, 0, TAU);
  // var thetaS = map(s, 0, 60, 0, TAU);
  

  
  // fill(255);
  // arc(width/2, height/2, handScaler*sLength, handScaler*sLength, -PI/2, thetaS-PI/2);
  // fill(200);
  // arc(width/2, height/2, handScaler*mLength, handScaler*mLength, -PI/2, thetaM-PI/2);
  // fill(0);
  // arc(width/2, height/2, handScaler*hLength, handScaler*hLength, -PI/2, thetaH-PI/2);
  
  for (var i=0; i<sec.length; i++) {
    sec[i].applyBehavior();
    ellipse(sec[i].posX, sec[i].posY, sec[i].diam, sec[i].diam);
  }
  
  text("frameRate: " + nf(frameRate(), 2, 1), 10, 20);
  
}

function Agent(diam, maxRepel, maxVel, seekAcc, repelAcc, posX, posY, targetX, targetY) {
  
  // Agent Diameter
  this.diam = diam;
  
  // Max Repelling Distance
  this.maxRepel = maxRepel;
  
  // Maximum Velocity [px/frame]
  this.maxVel = maxVel;
  
  // Maximum Seek Acceleration Modifier [px/frame^2]
  this.seekAcc = seekAcc;
  
  // MAximum Repel Acceleration Modifier [px/frame^2]
  this.repelAcc = repelAcc;
  
  // Agent Initial Postion
  this.posX = posX;
  this.posY = posY;
  
  // Agent Target Postion
  this.targetX = targetX;
  this.targetY = targetY;
  
  // Agent Initial Velocity
  this.velX = 0;
  this.velY = 0;
  
  // Agent Acceleration
  this.accX = 0;
  this.accY = 0.1;
  
  this.applyBehavior = function() {
    
    // Reset Accelartion Vector
    this.accX = 0;
    this.accY = 0;
    
    // Update Acceleration
    this.seekForce();
    this.repelForce(width/2, height/2);
    
    // Update Velocity
    this.velX += this.accX;
    this.velY += this.accY;
    
    // Caps Velocity at maxVel
    var magnitude = sqrt(sq(this.velX) + sq(this.velY));
    var scalar = magnitude / this.maxVel;
    if (scalar > 1) {
      this.velX /= scalar;
      this.velY /= scalar;
    }
    
    // Update Position
    this.posX += this.velX;
    this.posY += this.velY;
  }
  
  this.seekForce = function() {
    
    // Calculate Acceleration Seek Vector (Direction)
    var seekAccX = this.targetX - this.posX;
    var seekAccY = this.targetY - this.posY;
    
    // Normalize Acceleration Seek Vector
    var distance = sqrt(sq(seekAccX) + sq(seekAccY));
    var magnitude = distance;
    seekAccX /= magnitude;
    seekAccY /= magnitude;
    
    // Set Magnitude Acceleration Seek Vector
    seekAccX *= seekAcc;
    seekAccY *= seekAcc;
    
    // Add to Global Acceleration Vector
    this.accX += seekAccX;
    this.accY += seekAccY;
  }
  
  this.repelForce = function(neighborX, neighborY) {
    
    // Calculate Acceleration Repel Vector (Direction)
    var repelAccX = this.posX - neighborX;
    var repelAccY = this.posY - neighborY;
    
    // Apply rest of function if within repel radius [px]
    var distance = sqrt(sq(repelAccX) + sq(repelAccY));
    if (distance < maxRepel) {
    
      // Normalize Acceleration Repel Vector
      var magnitude = distance;
      repelAccX /= magnitude;
      repelAccY /= magnitude;
      
      // Set Magnitude Acceleration Seek Vector
      repelAccX *= repelAcc;
      repelAccY *= repelAcc;
      
      // Add to Global Acceleration Vector
      this.accX += repelAccX;
      this.accY += repelAccY;
    }
  }
}