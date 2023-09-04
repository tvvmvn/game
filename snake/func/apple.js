export function initApple(grid, apple) {
  apple.x = grid.offsetX + 100;
  apple.y = grid.offsetY + 100;
  apple.width = 20;
  apple.height = 20;
  apple.count = 20;
  apple.eaten = false;
}

export function putApple(grid, apple, snake) {
  var _appleX = grid.offsetX + (grid.cell * (Math.floor(Math.random() * 20)));
  var _appleY = grid.offsetY + (grid.cell * (Math.floor(Math.random() * 15)));

  var putAgain = false;

  // detect apple on snake body
  for (var i = 0; i < snake.node.length; i++) {
    if (snake.node[i].x === _appleX && snake.node[i].y === _appleY) {
      putAgain = true;
    }
  }

  if (putAgain) {
    putApple(grid, apple, snake)
  } else {
    apple.x = _appleX
    apple.y = _appleY
  }
}

export function drawApple(ctx, apple) {
  ctx.fillStyle = "#f00"
  ctx.fillRect(apple.x, apple.y, apple.width, apple.height);
}
