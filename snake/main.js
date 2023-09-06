import Grid from './struct/Grid.js';
import Snake from './struct/Snake.js';
import Apple from './struct/Apple.js';
import Time from './struct/Time.js';

import { 
  initSnake, 
  snakeMove, 
  selfCrash, 
  setSnake, 
  wallCrash, 
  drawSnake, 
} from './function/snake.js';

import {
  initGrid,
  drawGrid
} from './function/grid.js';

import {
  initApple,
  putApple,
  drawApple
} from './function/apple.js';

import {
  initTime,
  setTime,
  drawTime
} from './function/time.js';

import keyDownHandler from './keyDownHandler.js';

var ctx = canvas.getContext("2d");
var grid = new Grid();
var snake = new Snake();
var apple = new Apple();
var time = new Time();
var interval;
var prevX;
var prevY;
var start;

initGame();

addEventListener("keydown", function (e) {
  keyDownHandler(e, start, startGame, snake);
});

function render() {
  clearCanvas();

  setSnake(snake, grid);

  if (prevX !== snake.x || prevY !== snake.y) {
    console.log(prevX, prevY)
    if (wallCrash(snake, grid)) {
      gameOver()
    } else if (selfCrash(snake)) {
      gameOver()
    } else {
      snakeMove(snake)
    }

    prevX = snake.x;
    prevY = snake.y;
  }

  drawSnake(ctx, snake);

  if (apple.count) {
    apple.eaten = (snake.x === apple.x) && (snake.y === apple.y)
    
    if (apple.eaten) {
      snake.node.push({ x: snake.x, y: snake.y });
      apple.count--;
      putApple(grid, apple, snake);
      setLevel();
    }
    
    drawApple(ctx, apple);
    
  } else {
    gameEnd();
  } 

  setTime(time);
  drawTime(ctx, time);
  drawScore();
  drawGrid(ctx, grid);

  if (!start) {
    drawStart();
  }
}

function drawStart() {  
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Press any key to start game", 160, 200);
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(apple.count + " apples", 400, 30);
}

function setLevel() {
  // get faster
  snake.movingPoint--;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function createInterval() {
  interval = setInterval(render, 10) // 100hz
}

function removeInterval() {
  clearInterval(interval);
}

function initGame() {
  initGrid(grid);
  initSnake(grid, snake);
  initApple(grid, apple);
  initTime(time);
  
  prevX = snake.x;
  prevY = snake.y;
  start = false;
  
  render();
}

function startGame() {
  start = true;

  createInterval();
}

function gameOver() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("GAME OVER", 190, 208);
  // ctx.globalCompositeOperation = "destination-over";
  
  removeInterval()
  
  setTimeout(initGame, 2000)
}

function gameEnd() {
  removeInterval()
  console.log("YOU WIN")
}