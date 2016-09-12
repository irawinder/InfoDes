function setup() {
  createCanvas(800, 800);
  var second = new Agent(30, width/4, width/4, '#666666');
}

function draw() {
  background(0);
  second.display();
}

// Agent Constructor (diameter, x position, y position, color)
function Agent(d, x, y, c) {
  this.d = d;
  this.x = x;
  this.y = y;
  this.c = c;
  
  // display method
  this.display = function()
  {
    // body of the car
    fill(this.c);
    ellipse(x, y, d, d);
  }
}