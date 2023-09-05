import Direction from "../enums/Direction.js";

export function initSnake(grid, snake) {
  snake.x = grid.offsetX + (grid.cell * 2);
  snake.y = grid.offsetY;
  snake._x = 0;
  snake._y = 0;
  snake.width = 20;
  snake.height = 20;
  snake.movingPoint = 20;
  snake.node = [
    { x: grid.offsetX + (grid.cell * 2), y: grid.offsetY },
    { x: grid.offsetX + (grid.cell * 1), y: grid.offsetY },
    { x: grid.offsetX, y: grid.offsetY }
  ]
  snake.dir = Direction.RIGHT;
}

export function setSnake(snake, grid) {
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

export function snakeMove(snake) {
  // body
  for (var j = snake.node.length - 1; j > 0; j--) {
    snake.node[j].x = snake.node[j - 1].x;
    snake.node[j].y = snake.node[j - 1].y;
  }
  
  // head
  snake.node[0].x = snake.x;
  snake.node[0].y = snake.y;
}

export function selfCrash(snake) {
  var value = false;

  for (var h = 3; h < snake.node.length; h++) {
    if (snake.x === snake.node[h].x && snake.y === snake.node[h].y) {
      value = true
    }
  }

  return value;
}

export function wallCrash(snake, grid) {
  var leftCrash = snake.x < grid.offsetX
  var rightCrash = snake.x + grid.cell > grid.offsetX + grid.width;
  var topCrash = snake.y < grid.offsetY;
  var bottomCrash = snake.y + grid.cell > grid.offsetY + grid.height;

  if (leftCrash || rightCrash || topCrash || bottomCrash) {
    return true
  }

  return false;
}

export function drawSnake(ctx, snake) {
  for (var i = 0; i < snake.node.length; i++) {
    ctx.fillStyle = "#0a0"
    ctx.fillRect(snake.node[i].x, snake.node[i].y, snake.width, snake.height);
  }

  // snake x, y
  ctx.fillStyle = "#00f"
  ctx.fillRect(snake.x, snake.y, 5, 5); 
}