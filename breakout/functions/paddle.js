var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
import { paddle, pressedKey } from "../header.js";

export function setPaddle() {
  if (pressedKey.right && paddle.x < canvas.width - paddle.width) {
    paddle.x += 4;
  } else if (pressedKey.left && paddle.x > 0) {
    paddle.x -= 4;
  }
}

export function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = paddle.color;
  ctx.fill();
  ctx.closePath();
}