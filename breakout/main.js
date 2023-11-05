var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var offsetTop = 2;
var offsetLeft = 4;
var rowCount = 4;
var columnCount = 8;
var padding = 2;
var colors = ["red", "orange", "green", "navy"];
var bricks = [];

var ball = {};
var paddle = {}
var game = {}
var pressedKey = {};

const Key = {
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight"
}
var interval;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
startGame();

function startGame() {
  // game
  game.start = false;
  game.over = false;
  game.end = false;
  game.score = 0;
  
  // ball
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.radius = 10;
  ball.dx = 2;
  ball.dy = -2;
  ball.color = "#eee";

  // paddle
  paddle.x = (canvas.width - 70) / 2
  paddle.y = canvas.height - 10
  paddle.width = 70
  paddle.height = 5
  paddle.color = "#eee"

  // key
  pressedKey.left = false;
  pressedKey.right = false;
  
  initBricks();

  interval = createInterval();
}

function draw() {
  clearCanvas();
  drawBricks();
  setBall()
  drawBall();
  drawPaddle();
  collisionDetection();
  setPaddle()
  drawPaddle()

  if (!game.start) {
    drawStart(); 
    return;
  }

  if (game.over) {
    drawOver();
    initialize();
  }
  
  if (game.end) {
    drawEnd();
    initialize();
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawStart() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#eee";
  ctx.fillText("Press any key to start game", 160, 160);
}

function drawOver() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#eee";
  ctx.fillText("GAME OVER", 175, 170);
}

function drawEnd() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#eee";
  ctx.fillText("YOU WIN!", 180, 170);
}

function initialize() {
  // stop game
  removeInterval(interval);

  setTimeout(() => {
    startGame();
  }, 2000)
}

function createInterval() {
  return setInterval(draw, 10);
}

function removeInterval() {
  clearInterval(interval);
}

function initBricks() {
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

function collisionDetection() {
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
          game.score++;

          if (game.score == rowCount * columnCount) {
            game.end = true;
          }
        }
      }
    }
  }
}

function drawBricks() {
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

function setBall() {
  // reflect on left or right wall
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }

  // top
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  // bottom
  } else if (ball.y  > canvas.height - ball.radius - 10) {
    // into paddle
    if (
      ball.x + ball.radius > paddle.x 
      && ball.x - ball.radius < paddle.x + paddle.width
      ) {
      ball.dy = -ball.dy;
    // out of paddle
    } else {
      game.over = true;
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function setPaddle() {
  if (pressedKey.right && paddle.x < canvas.width - paddle.width) {
    paddle.x += 4;
  } else if (pressedKey.left && paddle.x > 0) {
    paddle.x -= 4;
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = paddle.color;
  ctx.fill();
  ctx.closePath();
}

function keyDownHandler(e) {
  if (!game.start) {
    game.start = true;
  }

  if (e.code == Key.RIGHT) {
    pressedKey.right = true;
  } else if (e.code == Key.LEFT) {
    pressedKey.left = true;
  }
}

function keyUpHandler(e) {
  if (e.code == Key.RIGHT) {
    pressedKey.right = false;
  } else if (e.code == Key.LEFT) {
    pressedKey.left = false;
  }
}