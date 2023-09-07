var ctx = canvas.getContext("2d");

export default class Time {

  constructor() {
    this._s = 0;
    this.s = 0;
  }

  set() {
    this._s++
    
    if (this._s > 100) {
      this.s++;
      this._s = 0;
    }
  }

  draw() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#888";
    ctx.fillText(`${this.s}s`, 50, 30);
  }
}