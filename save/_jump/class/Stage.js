var ctx = canvas.getContext("2d");

export default class Stage {
  constructor() {
    this.offsetX = 50;
    this.offsetY = 50;
    this.width = 400;
    this.height = 200;
  }

  draw() {
    ctx.strokeRect(this.offsetX, this.offsetY, this.width, this.height);
  
    ctx.beginPath();
    ctx.moveTo(this.offsetX, 200);
    ctx.lineTo(this.offsetX + this.width, 200);
    ctx.stroke();
  }
}