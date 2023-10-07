var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
import { ball, misc } from "../header.js";

var padding = 2;
var offsetTop = 2;
var offsetLeft = 4;
var rowCount = 4;
var columnCount = 8;
var bricks = [];
var colors = ["red", "orange", "green", "navy"];

export function initBricks() {
  for (var r = 0; r < rowCount; r++) {
    bricks[r] = [];
    for (var c = 0; c < columnCount; c++) {
      var brick = {
        x: 0,
        y: 0,
        width: 60,
        height: 20,
        status: 1,
        color: colors[r]
      }

      bricks[r][c] = brick;
    }
  }
}

export function collisionDetection() {
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < columnCount; c++) {
      var brick = bricks[r][c];

      if (brick.status == 1) {
        if (
            ball.x + ball.radius > brick.x  // left
            && ball.x + ball.radius < brick.x + brick.width // right
            && ball.y + ball.radius > brick.y 
            && ball.y - ball.radius < brick.y + brick.height
          ) {
          ball.dy = -ball.dy;
          brick.status = 0;
          misc.score++;

          if (misc.score == rowCount * columnCount) {
            misc.end = true;
          }
        }
      }
    }
  }
}

export function drawBricks() {
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < columnCount; c++) {
      if (bricks[r][c].status == 1) {
        // update
        var brick = bricks[r][c];
        
        brick.x = (c * (brick.width + padding)) + offsetLeft;
        brick.y = (r * (brick.height + padding)) + offsetTop;

        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.width, brick.height);
        ctx.fillStyle = brick.color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}