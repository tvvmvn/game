import { time } from "../header.js";

var ctx = canvas.getContext("2d");

export function setTime() {
  time._s++
  
  if (time._s > 100) {
    time.s++;
    time._s = 0;
  }
}

export function drawTime() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Time: " + time.s, 20, 30);
}
