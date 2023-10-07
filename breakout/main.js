var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
import { setBall, drawBall } from "./functions/ball.js";
import { setPaddle, drawPaddle } from "./functions/paddle.js";
import { initBricks, collisionDetection, drawBricks } from "./functions/brick.js";
import { keyDownHandler, keyUpHandler } from "./keyHandler.js";
import { ball, paddle, misc } from "./header.js";

var interval;

initBricks();

interval = createInterval();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function createInterval() {
  return setInterval(draw, 10);
}

function removeInterval() {
  clearInterval(interval);
}

function draw() {
  clearCanvas();
  drawBricks();
  setBall()
  drawBall();
  drawPaddle();
  drawScore();  
  collisionDetection();
  setPaddle()
  drawPaddle()

  if (!misc.start) {
    drawStart(); 
    return;
  }

  if (misc.over) {
    drawOver();
    initialize();
  }
  
  if (misc.end) {
    drawEnd();
    initialize();
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawStart() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText("Press any key to start", 160, 160);
}

function drawOver() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText("GAME OVER", 175, 170);
}

function drawEnd() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText("YOU WIN!", 180, 170);
}

function initialize() {
  // stop game
  removeInterval(interval);

  setTimeout(() => {
    misc.start = false;
    misc.over = false;
    misc.end = false;
    misc.score = 0;
    
    // ball
    ball.x = canvas.width/2;
    ball.y = canvas.height-30;
    ball.dx = 2;
    ball.dy = -2;

    // paddle
    paddle.x = (canvas.width - paddle.width)/2;

    // bricks
    initBricks();

    // restart game
    interval = createInterval();
  }, 2000)
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText("Score: " + misc.score, 8, 20);
}

