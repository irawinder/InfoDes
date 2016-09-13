// Agent Based Visualization for a clock
// Ira Winder, Sep 2016

// Background Color
var col = 200;

// Variables for holding integer time
var h, m, s;

// Arrays for holding agents for time visualization
var seconds = [];
var minutes = [];
var hours = [];

// Gravity Well Positions for Seconds, Minutes, and Hours
var originX, originY, secX, secY, minX, minY, hrX, hrY;

// Diameters for Time Agents
var secDiam, minDiam, hrDiam;

function setup() {
  createCanvas(600, 600);
  
  // Gravity Well Positions for Seconds, Minutes, and Hours
    
    // Hour
    hrX = 0.25*width;
    hrY = 0.25*height;
    
    // Minute
    minX = 0.8*width;
    minY = 0.4*height;
    
    // Second
    secX = 0.35*width;
    secY = 0.8*height;
    
    // Origin (for seconds)
    originX = 0.8*width;
    originY = 0.8*height;
  
  // Relative Sizes of Clock Agents
  
    secDiam = 1.5;
    minDiam = 2.5;
    hrDiam = 4.0;
  
  // Absolute size of Clock Agents
    
    var scalar = width/50;
    secDiam *= scalar;
    minDiam *= scalar;
    hrDiam  *= scalar;
  
  // Initializes Clock Agents
  initClock();
}

function draw() {

  background(col);
  noStroke();
  
  fetchTime();
  
  // Updates Number of Agents
  updateClockNum();
  
  // Updates Position of Agents
  updateClockPos(seconds);
  updateClockPos(minutes);
  updateClockPos(hours);
  
}

function initClock() {
  
  // Fetches time from computer
  fetchTime();
  
  // Agent Constructor:
  // Agent(value, unit, maxValue, diam, posX, posY, targetX, targetY)
  
  // Init Seconds Agents (one for every second)
  for (var i=0; i<s; i++) {
    seconds[i] = new Agent(i+1, 's', 60, secDiam, secX + random(-width/8, width/8), secY + random(-height/4, height/4), secX, secY);
  }
  
  // Init Minutes Agents (one for every minute)
  for (var i=0; i<m; i++) {
    minutes[i] = new Agent(i+1, 'm', 60, minDiam, minX + random(-width/4, width/4), minY + random(-height/4, height/4), minX, minY);
  }
  
  // Init Hours Agents (one for every hour)
  for (var i=0; i<h; i++) {
    hours[i] = new Agent(i+1, 'h', 24, hrDiam, hrX + random(-width/4, width/4), hrX + random(-height/4, height/4), hrX, hrY);
  }
}

function fetchTime() {
  // Fetches time from computer
  h = hour();
  m = minute();
  s = second();
}

function newSecond(value) {
  return new Agent(value, 's', 60, secDiam, originX, originY + random(-20,20), secX, secY);
}

function newMinute(value) {
  return new Agent(value, 'm', 60, minDiam, secX, secY, minX, minY);
}

function newHour(value) {
  return new Agent(value, 'h', 24, hrDiam, minX, minY, hrX, hrY);
}

function updateClockNum() {
  
  // Updates the number of time agents represented on the screen
  
  if (seconds.length < s) { // If more agents needed ..
    while(seconds.length < s) { 
      // Inserts another Agent
      seconds.splice(seconds.length, 1, newSecond(seconds.length+1));
    }
  } else if (s == 0 && seconds.length > 0) { // If too many agents ...
    // Wipes all agents
    seconds.splice(0, seconds.length);
  }
  
  if (minutes.length < m) { // If more agents needed ..
    while(minutes.length < m) {
      // Inserts another Agent
      minutes.splice(minutes.length, 1, newMinute(minutes.length+1));
    }
  } else if (m == 0 && minutes.length > 0) { // If too many agents ...
    // Wipes all agents
    minutes.splice(0, minutes.length);
  }
  
  if (hours.length < h) { // If more agents needed ..
    while(hours.length < h) {
      // Inserts another Agent
      hours.splice(hours.length, 1, newHour(hours.length+1));
    }
  } else if (h == 0 && hours.length > 0) { // If too many agents ...
    // Wipes all agents
    hours.splice(0, hours.length);
  }
}

function updateClockPos(agents) {
  
  // Update Agent Positions
  for (var i=0; i<agents.length; i++) {
    // Checks to see if agent is current time, returns true if so
    agents[i].checkHighlight(i == agents.length-1);
    
    // Applies Acceleration Vector toward target
    agents[i].seekForce();
    
    // Applies Acceleration Vector away from Neighbors
    for (var j=0; j<agents.length; j++) 
      if (i != j) 
        agents[i].repelForce(agents[j].posX, agents[j].posY, agents[j].diam);
    
    // Updates Agent Position and displays
    agents[i].update();
    agents[i].display();
  }
}

function Agent(value, unit, maxValue, diam, posX, posY, targetX, targetY) {
  
  //The hour, minute, or second value that the agent represents
  this.value = value;
  
  // The unit of the value as 'h', 'm', or 's'
  this.unit = unit;
  
  // Flag the agent as representing the current time
  this.highlight = false;
  
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
  
  this.repelForce = function(neighborX, neighborY, neighborDiam) {
    
    // Calculate Acceleration Repel Vector (Direction)
    var repelAccX = this.posX - neighborX;
    var repelAccY = this.posY - neighborY;
    
    // Apply rest of function if within repel radius [px]
    var distance = sqrt(sq(repelAccX) + sq(repelAccY));
    if (distance < 0.55*(diam+neighborDiam) ) {
    
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
  
  // If agent is "highlighted", makes the appropriate change to diameter and highlight status
  this.checkHighlight = function(check) {
    if (check && this.highlight == false) {
      this.highlight = true;
      this.diam *= 3;
    } else if (!check && this.highlight == true) {
      this.highlight = false;
      this.diam /= 3;
    }
  }
  
  this.display = function() {
    
    if (this.highlight) {
      // Enlarged, colored agent if highlighted
      fill('#FF00FF');
      stroke(255, 150);
      strokeWeight(width/100);
    } else {
      fill(this.shade, 150);
    }
    
    // draws the Agent as a circle
    ellipse(this.posX, this.posY, this.diam, this.diam);
    noStroke();
    
    if (this.highlight)
      // White text if highlighted
      fill(255);
    else
      fill(155+this.shade);
    
    // Text size centered and proportional to circle diameter
    textAlign(CENTER, CENTER);
    textSize(this.diam/3);
    
    if (this.highlight)
      // includes time unit if highlighted
      text(this.value + this.unit, this.posX, this.posY);
    else 
      text(this.value, this.posX, this.posY);
  }
}