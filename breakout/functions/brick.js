var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
import { ball, misc } from "../header.js";

class Brick { 
  x;
  y;
  width;
  height;
  status;
}

var padding = 5;
var offsetTop = 30;
var offsetLeft = 30;
var rowCount = 6;
var columnCount = 4;
var bricks = [];

export function initBricks() {
  for (var c = 0; c < columnCount; c++) {
    bricks[c] = [];
  
    for (var r = 0; r < rowCount; r++) {
      // initialize
      var brick = new Brick();
      brick.x = 0;
      brick.y = 0;
      brick.width = 70;
      brick.height = 20;
      brick.status = 1;

      bricks[c][r] = brick;
    }
  }
}

export function collisionDetection() {
  for (var c = 0; c < columnCount; c++) {
    for (var r = 0; r < rowCount; r++) {
      var brick = bricks[c][r];

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
  for (var c = 0; c < columnCount; c++) {
    for (var r = 0; r < rowCount; r++) {
      if (bricks[c][r].status == 1) {
        // update
        var brick = bricks[c][r];
        
        brick.x = (r * (brick.width + padding)) + offsetLeft;
        brick.y = (c * (brick.height + padding)) + offsetTop;

        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.width, brick.height);
        ctx.fillStyle = "#333";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}