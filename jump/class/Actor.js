var ctx = canvas.getContext("2d");

export default class Actor {
  constructor() {
    this.x = 100;
    this.y = 180;
    this.v = -5;
    this.width = 20;
    this.height = 20;
    this.jump = false;
  }

  set() {
    if (this.jump) {
      // y from -5 to 5
      this.y += this.v;

      this.v += 0.2
    }
    
    if (this.y > 180) {
      this.jump = false;
      this.v = -5;
    }
  } 

  draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}