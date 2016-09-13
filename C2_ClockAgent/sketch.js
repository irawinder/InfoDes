// An Agent Based Visualization for a clock
// Ira Winder, Sep 2016

var col = "#999999";

// Variables for holding integer time
var h, m, s;

// Arrays for holding agents for time visualization
var seconds = [];
var minutes = [];
var hours = [];

// Gravity Well Positions for Seconds, Minutes, and Hours
var secX, secY, minX, minY, hrX, hrY;

function setup() {
  createCanvas(800, 400);
  
  // Gravity Well Positions for Seconds, Minutes, and Hours
  secX = 3*width/4;
  secY = height/2;
  minX = width/2;
  minY = height/2;
  hrX = width/4;
  hrY = height/2;
  
  // Initializes Clock Agents
  initClock();
}

function draw() {

  background(col);
  noStroke();
  
  // Updates Number of Agents
  updateClockNum();
  
  // Updates Position of Agents
  updateClockPos();
  
  text("frameRate: " + nf(frameRate(), 2, 1), 10, 20);
  
}

function initClock() {
  var h = hour();
  var m = minute();
  var s = second();
  
  // Init Seconds
  for (var i=0; i<s; i++) {
    seconds[i] = newSecond();
  }
  
  // Init Minutes
  for (var i=0; i<m; i++) {
    minutes[i] = new Agent(20, minX + random(-width/8, width/8), random(height), minX, minY);
  }
  
  // Init Hours
  for (var i=0; i<h; i++) {
    hours[i] = new Agent(40, hrX + random(-width/8, width/8), random(height), hrX, hrY);
  }
}

// Agent(diam, shade, maxVel, seekAcc, repelAcc, posX, posY, targetX, targetY)

function newSecond() {
  return new Agent(10, secX + random(-width/8, width/8), random(height), secX, secY);
}

function newMinute() {
  return new Agent(20, secX, secY, minX, minY);
}

function newHour() {
  return new Agent(40, minX, minY, hrX, hrY);
}

function updateClockNum() {
  
  // Update Agent Quantities
  h = hour();
  m = minute();
  s = second();
  
  if (seconds.length < s) {
    while(seconds.length < s) {
      seconds.splice(seconds.length, 1, newSecond());
    }
  } else if (s == 0 && seconds.length > 0) {
    seconds.splice(0, seconds.length);
  }
  
  if (minutes.length < m) {
    while(minutes.length < m) {
      minutes.splice(minutes.length, 1, newMinute());
    }
  } else if (m == 0 && minutes.length > 0) {
    minutes.splice(0, minutes.length);
  }
  
  if (hours.length < h) {
    while(hours.length < h) {
      hours.splice(hours.length, 1, newHour());
    }
  } else if (h == 0 && hours.length > 0) {
    hours.splice(0, hours.length);
  }
}

function updateClockPos() {
  
  // Update Agent Positions
  for (var i=0; i<seconds.length; i++) {
    seconds[i].seekForce();
    
    for (var j=0; j<seconds.length; j++) 
      if (i != j) 
        seconds[i].repelForce(seconds[j].posX, seconds[j].posY);
    
    seconds[i].update();
    seconds[i].display();
  }
  
  for (var i=0; i<minutes.length; i++) {
    minutes[i].seekForce();
    
    for (var j=0; j<minutes.length; j++) 
      if (i != j) 
        minutes[i].repelForce(minutes[j].posX, minutes[j].posY);
    
    minutes[i].update();
    minutes[i].display();
  }
  
  for (var i=0; i<hours.length; i++) {
    hours[i].seekForce();
    
    for (var j=0; j<hours.length; j++) 
      if (i != j) 
        hours[i].repelForce(hours[j].posX, hours[j].posY);
    
    hours[i].update();
    hours[i].display();
  }
  
}

function Agent(diam, posX, posY, targetX, targetY) {
  
  // Agent Diameter
  this.diam = diam;
  
  // Color of Agent
  this.shade = random(255);
  
  // Maximum Velocity [px/frame]
  this.maxVel = 0.5;
  
  // Maximum Seek Acceleration Modifier [px/frame^2]
  this.seekAcc = 0.5;
  
  // MAximum Repel Acceleration Modifier [px/frame^2]
  this.repelAcc = 0.5;
  
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
  this.accY = 0;
  
  this.update = function() {
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
    
    // Reset Acceleration Vector
    this.accX = 0;
    this.accY = 0;
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
    seekAccX *= this.seekAcc;
    seekAccY *= this.seekAcc;
    
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
    if (distance < diam) {
    
      // Normalize Acceleration Repel Vector
      var magnitude = distance;
      repelAccX /= magnitude;
      repelAccY /= magnitude;
      
      // Set Magnitude Acceleration Seek Vector
      repelAccX *= this.repelAcc;
      repelAccY *= this.repelAcc;
      
      // Add to Global Acceleration Vector
      this.accX += repelAccX;
      this.accY += repelAccY;
    }
  }
  
  this.display = function() {
    fill(this.shade);
    ellipse(this.posX, this.posY, this.diam, this.diam);
  }
}