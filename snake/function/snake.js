import { snake, grid } from "../header.js";
import { Direction } from "../enums/Direction.js";

var ctx = canvas.getContext("2d");

export function setSnake() {
  if (snake.dir === Direction.RIGHT) {
    snake._x++;

    if (snake._x > snake.movingPoint) {
      snake.x += grid.cell;
      snake._x = 0;
    }
  }

  if (snake.dir === Direction.DOWN) {
    snake._y++;

    if (snake._y > snake.movingPoint) {
      snake.y += grid.cell;
      snake._y = 0;
    }
  }

  if (snake.dir === Direction.LEFT) {
    snake._x--;

    if (snake._x < -snake.movingPoint) {
      snake.x -= grid.cell;
      snake._x = 0;
    }
  }

  if (snake.dir === Direction.UP) {
    snake._y--;
    
    if (snake._y < -snake.movingPoint) {
      snake.y -= grid.cell;
      snake._y = 0;
    }  
  }
}

export function snakeMove() {
  // body
  for (var j = snake.node.length - 1; j > 0; j--) {
    snake.node[j].x = snake.node[j - 1].x;
    snake.node[j].y = snake.node[j - 1].y;
  }
  
  // head
  snake.node[0].x = snake.x;
  snake.node[0].y = snake.y;
}

export function selfCrash() {
  var value = false;

  for (var h = 3; h < snake.node.length; h++) {
    if (snake.x === snake.node[h].x && snake.y === snake.node[h].y) {
      value = true;
    }
  }

  return value;
}

export function wallCrash() {
  var leftCrash = snake.x < grid.offsetX
  var rightCrash = snake.x + grid.cell > grid.offsetX + grid.width;
  var topCrash = snake.y < grid.offsetY;
  var bottomCrash = snake.y + grid.cell > grid.offsetY + grid.height;

  if (leftCrash || rightCrash || topCrash || bottomCrash) {
    return true
  }

  return false;
}

export function drawSnake() {
  for (var i = 0; i < snake.node.length; i++) {
    ctx.fillStyle = snake.color;
    ctx.fillRect(snake.node[i].x, snake.node[i].y, snake.width, snake.height);
  }

  // snake x, y
  // ctx.fillStyle = "#f00"
  // ctx.fillRect(snake.x, snake.y, 5, 5); 
}