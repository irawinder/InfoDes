// An Agent Based Visualization for a clock
// Ira Winder, Sep 2016

var col = 200;

// Variables for holding integer time
var h, m, s;

// Arrays for holding agents for time visualization
var seconds = [];
var minutes = [];
var hours = [];

// Gravity Well Positions for Seconds, Minutes, and Hours
var secX, secY, minX, minY, hrX, hrY;

var secDiam, minDiam, hrDiam;

function setup() {
  createCanvas(1500, 700);
  
  // Gravity Well Positions for Seconds, Minutes, and Hours
  
    // Right
    secX = 4*width/5;
    secY = height/2;
    
    // Center
    minX = 11*width/20;
    minY = height/2;
    
    // Left
    hrX = width/5;
    hrY = height/2;
  
  // Relative Sizes of Clock Agents
  
    secDiam = 1.5;
    minDiam = 2.5;
    hrDiam = 4.0;
  
  // Absolute size of Clock Agents
  
    secDiam *= width/80;
    minDiam *= width/80;
    hrDiam *= width/80;
  
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
  
//  text("frameRate: " + nf(frameRate(), 2, 1), 10, 20);
  
}

function initClock() {
  var h = hour();
  var m = minute();
  var s = second();
  
  // Init Seconds
  for (var i=0; i<s; i++) {
    seconds[i] = newSecond(i+1);
  }
  
  // Init Minutes
  for (var i=0; i<m; i++) {
    minutes[i] = new Agent(i+1, 60, minDiam, minX + random(-width/8, width/8), random(height), minX, minY);
  }
  
  // Init Hours
  for (var i=0; i<h; i++) {
    hours[i] = new Agent(i+1, 24, hrDiam, hrX + random(-width/8, width/8), random(height), hrX, hrY);
  }
}

// Agent(diam, shade, maxVel, seekAcc, repelAcc, posX, posY, targetX, targetY)

function newSecond(value) {
  return new Agent(value, 60, secDiam, secX + random(-width/8, width/8), random(height), secX, secY);
}

function newMinute(value) {
  return new Agent(value, 60, minDiam, secX, secY, minX, minY);
}

function newHour(value) {
  return new Agent(value, 24, hrDiam, minX, minY, hrX, hrY);
}

function updateClockNum() {
  
  // Update Agent Quantities
  h = hour();
  m = minute();
  s = second();
  
  if (seconds.length < s) {
    while(seconds.length < s) {
      seconds.splice(seconds.length, 1, newSecond(seconds.length+1));
    }
  } else if (s == 0 && seconds.length > 0) {
    seconds.splice(0, seconds.length);
  }
  
  if (minutes.length < m) {
    while(minutes.length < m) {
      minutes.splice(minutes.length, 1, newMinute(minutes.length+1));
    }
  } else if (m == 0 && minutes.length > 0) {
    minutes.splice(0, minutes.length);
  }
  
  if (hours.length < h) {
    while(hours.length < h) {
      hours.splice(hours.length, 1, newHour(hours.length+1));
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
    seconds[i].display(i == seconds.length-1);
  }
  
  for (var i=0; i<minutes.length; i++) {
    minutes[i].seekForce();
    
    for (var j=0; j<minutes.length; j++) 
      if (i != j) 
        minutes[i].repelForce(minutes[j].posX, minutes[j].posY);
    
    minutes[i].update();
    minutes[i].display(i == minutes.length-1);
  }
  
  for (var i=0; i<hours.length; i++) {
    hours[i].seekForce();
    
    for (var j=0; j<hours.length; j++) 
      if (i != j) 
        hours[i].repelForce(hours[j].posX, hours[j].posY);
    
    hours[i].update();
    hours[i].display(i == hours.length-1);
  }
  
}

function Agent(value, maxValue, diam, posX, posY, targetX, targetY) {
  
  //The hour, minute, or second value that the agent represents
  this.value = value;
  
  // Agent Diameter
  this.diam = diam;
  
  // Color of Agent
  this.shade = map(value, 0, maxValue, 100, 0);
  
  // Maximum Velocity [px/frame]
  this.maxVel = 0.5;
  
  // Maximum Acceseration [px/frame^2]
  this.maxAcc = 0.05;
  
  // Maximum Seek Acceleration Modifier [px/frame^2]
  this.seekAcc = 0.5;
  
  // Maximum Repel Acceleration Modifier [px/frame^2]
  this.repelAcc = 5;
  
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
    
    var magnitude, scalar;
    
    // Caps Acceration at maxAcc
    magnitude = sqrt(sq(this.accX) + sq(this.accY));
    scalar = magnitude / this.maxAcc;
    if (scalar > 1) {
      this.accX /= scalar;
      this.accY /= scalar;
    }
    
    // Update Velocity
    this.velX += this.accX;
    this.velY += this.accY;
    
    // Caps Velocity at maxVel
    magnitude = sqrt(sq(this.velX) + sq(this.velY));
    scalar = magnitude / this.maxVel;
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
    if (distance < 1.1*diam) {
    
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
  
  this.display = function(highlight) {
    if (highlight)
      fill('#FF00FF');
    else
      fill(this.shade);
      
    ellipse(this.posX, this.posY, this.diam, this.diam);
    
    if (highlight)
      fill(255);
    else
      fill(155+this.shade);
      
    textAlign(CENTER, CENTER);
    text(value, this.posX, this.posY);
  }
}