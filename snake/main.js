var ctx = canvas.getContext("2d");

import { 
  snakeDraw, 
  initSnake, 
  snakeMove, 
  selfCrash, 
  setSnake, 
  Snake, 
  wallCrash 
} from './snake.js';

import {
  Grid,
  initGrid,
  gridDraw
} from './grid.js';

import {
  Apple,
  initApple,
  applePut,
  appleDraw
} from './apple.js';

import {
  Time,
  initTime,
  timeDraw
} from './time.js';

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
var prevKey = "ArrowRight";

var interval = createInterval();
addEventListener("keydown", keyDownHandler);

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

  snakeDraw(ctx, snake);
  
  if (apple.count) {
    apple.eaten = (snake.x === apple.x) && (snake.y === apple.y)
    
    if (apple.eaten) {
      snake.node.push({ x: snake.x, y: snake.y });
      apple.count--;
      applePut(grid, apple, snake)
      setLevel();
    }
    
    appleDraw(ctx, apple);
    
  } else {
    gameEnd()
  } 

  setTime();
  timeDraw(ctx, time);
  scoreDraw();
  gridDraw(ctx, grid);
}



function setTime() {
  time._s++
  
  if (time._s > 100) {
    time.s++;
    time._s = 0;
  }
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

function keyDownHandler(e) {
  if (over && e.key === "Enter") {
    initSnake(grid, snake);
    initApple(grid, apple);
    initTime(time);

    prevKey = "ArrowRight";
    over = false;
    prevX = snake.x;
    prevY = snake.y;

    interval = createInterval();
  }

  if (prevKey === e.key) {
    return;
  }

  // prevent u-turn
  var rtol = snake.dir === "right" && e.key === "ArrowLeft";
  var ltor = snake.dir === "left" && e.key === "ArrowRight";
  var utod = snake.dir === "up" && e.key === "ArrowDown";
  var dtou = snake.dir === "down" && e.key === "ArrowUp";

  if (rtol || ltor || utod || dtou) return;

  if (e.key === "ArrowRight") {
    snake._x += snake.movingPoint;
    snake.dir = "right";
  }

  if (e.key === "ArrowDown") {
    snake._y += snake.movingPoint;
    snake.dir = "down";
  }

  if (e.key === "ArrowLeft") {
    snake._x -= snake.movingPoint;
    snake.dir = "left";
  }

  if (e.key === "ArrowUp") {
    snake._y -= snake.movingPoint;
    snake.dir = "up";
  }

  prevKey = e.key;
}




