import { grid, snake, apple, time, misc, json } from './header.js';
import { snakeMove, selfCrash, setSnake, wallCrash, drawSnake } from './function/snake.js';
import { drawGrid } from './function/grid.js';
import { putApple, drawApple } from './function/apple.js';
import { setTime, drawTime } from './function/time.js';
import keyDownHandler from './keyDownHandler.js';

var ctx = canvas.getContext("2d");
var prevX = snake.x;
var prevY = snake.y;
var interval;

interval = createInterval();
addEventListener("keydown", keyDownHandler);

function draw() {
  clearCanvas();
  
  drawGrid();

  if (!misc.start) {
    drawStart();
    return;
  }

  setTime();
  drawTime();
  drawScore();

  if (misc.over) {
    drawOver();
    initGame();
  }
  
  if (misc.end) {
    drawEnd();
    initGame()
  }
  
  // Snake
  setSnake();

  if (prevX !== snake.x || prevY !== snake.y) {
    if (wallCrash()) {
      misc.over = true;
    } else if (selfCrash()) {
      misc.over = true;
    } else {
      snakeMove()
    }
  }

  drawSnake();

  // Apple
  if (apple.count) {
    apple.eaten = (snake.x === apple.x) && (snake.y === apple.y)
    
    if (apple.eaten) {
      snake.node.push({ x: snake.x, y: snake.y });
      apple.count--;
      putApple();
      snake.movingPoint--;
    }
    
    drawApple();
  } else {
    drawEnd();
  } 

  prevX = snake.x;
  prevY = snake.y;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function drawOver() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("GAME OVER", 190, 208);
  // ctx.globalCompositeOperation = "destination-over";
}

function drawEnd() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("YOU WIN!", 190, 208);
}

function initGame() {
  clearInterval(interval);

  setTimeout(() => {
    var o = JSON.parse(json);

    snake.x = o.snake.x;
    snake.y = o.snake.y;
    snake._x = o.snake._x;
    snake._y = o.snake._y;
    snake.node = o.snake.node;
    snake.dir = o.snake.dir;
    snake.movingPoint = o.snake.movingPoint;
    prevX = o.snake.x;
    prevY = o.snake.y;

    apple.x = o.apple.x;
    apple.y = o.apple.y;
    apple.eaten = o.apple.eaten;
    apple.count = o.apple.count;

    time.s = o.time.s
    time._s = o.time._s;

    misc.start = o.misc.start;
    misc.end = o.misc.end;
    misc.over = o.misc.over;

    interval = createInterval();
  }, 2000)
}

function createInterval() {
  return setInterval(draw, 10) // 100hz
}