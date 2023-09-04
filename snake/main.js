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
} from './func/snake.js';

import {
  initGrid,
  drawGrid
} from './func/grid.js';

import {
  initApple,
  putApple,
  drawApple
} from './func/apple.js';

import {
  initTime,
  setTime,
  drawTime
} from './func/time.js';

import keyDownHandler from './keyDownHandler.js';

var ctx = canvas.getContext("2d");
var grid = new Grid();
var snake = new Snake();
var apple = new Apple();
var time = new Time();

initGrid(grid);
initSnake(grid, snake);
initApple(grid, apple);
initTime(time);

// others
var over = false;
var prevX = snake.x;
var prevY = snake.y;


var interval = createInterval();

addEventListener("keydown", function (e) {
  keyDownHandler(e, over, resetGame, snake)
});

function createInterval() {
  return setInterval(render, 10) // 100hz
}

function render() {
  clearCanvas();
  
  setSnake(snake, grid);

  if (prevX !== snake.x || prevY !== snake.y) {
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
      putApple(grid, apple, snake)
      setLevel();
    }
    
    drawApple(ctx, apple);
    
  } else {
    gameEnd();
  } 

  setTime(time);
  drawTime(ctx, time);
  scoreDraw();
  drawGrid(ctx, grid);
}

function scoreDraw() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(apple.count + " apples", 400, 30);
}

function setLevel() {
  // get faster
  snake.movingPoint--;
}

function gameOver() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("GAME OVER", 190, 208);
  clearInterval(interval);
  over = true;
}

function gameEnd() {
  clearInterval(interval)
  console.log("YOU WIN")
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resetGame() {
  initSnake(grid, snake);
  initApple(grid, apple);
  initTime(time);

  over = false;
  prevX = snake.x;
  prevY = snake.y;

  interval = createInterval();
}