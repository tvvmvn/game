export class Time {
  _s;
  s;
}

export function initTime(time) {
  time._s = 0;
  time.s = 0;
}

export function timeDraw(ctx, time) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Time: " + time.s, 20, 30);
}