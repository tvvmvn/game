var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
import { ball, paddle, misc } from "../header.js";

export function setBall() {
  // reflect on left or right wall
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }

  // top
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  // bottom
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    // into paddle
    if (
      ball.x + ball.radius > paddle.x 
      && ball.x - ball.radius < paddle.x + paddle.width
      ) {
      ball.dy = -ball.dy;
    // out of paddle
    } else {
      misc.over = true;
    }
  }
}

export function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}