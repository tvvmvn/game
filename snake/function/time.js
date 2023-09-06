export function initTime(time) {
  time._s = 0;
  time.s = 0;
}

export function setTime(time) {
  time._s++
  
  if (time._s > 100) {
    time.s++;
    time._s = 0;
  }
}

export function drawTime(ctx, time) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Time: " + time.s, 20, 30);
}
