import { grid, snake, apple } from "../header.js";

var ctx = canvas.getContext("2d");

export function putApple() {
  var x = grid.offsetX + (grid.cell * (Math.floor(Math.random() * 20)));
  var y = grid.offsetY + (grid.cell * (Math.floor(Math.random() * 15)));

  var putAgain = false;

  // detect apple on snake body
  for (var i = 0; i < snake.node.length; i++) {
    if (snake.node[i].x === x && snake.node[i].y === y) {
      putAgain = true;
    }
  }

  if (putAgain) {
    putApple(grid, apple, snake)
  } else {
    apple.x = x
    apple.y = y
  }
}

export function drawApple() {
  ctx.fillStyle = apple.color;
  ctx.fillRect(apple.x, apple.y, apple.width, apple.height);
}
