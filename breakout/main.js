/*
  struct
*/


class Ball {
  constructor(x, y, radius, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
  }
}

class Brick {
  constructor(x, y, width, height, status, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.status = status;
    this.color = color;
  }
}

class Paddle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
}

class Game {
  constructor(start, over, end, score) {
    this.start = start;
    this.over = over;
    this.end = end;
    this.score = score;
  }
}


/*
  contants (or enums)
*/

// Grid
const OFFSET_TOP = 20;
const OFFSET_LEFT = 30;
const PADDING = 10;
const ROW_COUNT = 6;
const COLUMN_COUNT = 5;


/*
  variables
*/


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var bricks;
var brickCount;
var ball;
var paddle;
var game;
var leftKeyPressed;
var rightKeyPressed;
var interval;


/* 
  functions
*/


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
startGame();

function startGame() {
  // ball
  ball = new Ball(canvas.width / 2, canvas.height - 30, 10, 2, -2, "#fff");
    
  // paddle
  paddle = new Paddle((canvas.width - 70) / 2, canvas.height - 10, 70, 5, "#fff");
    
  // bricks
  bricks = [];
  brickCount = 0;

  for (var r = 0; r < ROW_COUNT; r++) {
    bricks[r] = [];
    for (var c = 0; c < COLUMN_COUNT; c++) {
      var bool = Math.round(Math.random());
      
      if (bool == 1) {
        brickCount++;
      }

      var brick = new Brick(0, 0, 80, 20, bool, "pink")

      bricks[r][c] = brick;
    }
  }

  // key
  leftKeyPressed = false;
  rightKeyPressed = false;
  
  // game
  game = new Game(false, false, false, 0);

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
  ctx.fillStyle = "#fff";
  ctx.fillText("Press any key to start game", 160, 160);
}

function drawOver() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("GAME OVER", 175, 170);
}

function drawEnd() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
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

function collisionDetection() {
  for (var r = 0; r < ROW_COUNT; r++) {
    for (var c = 0; c < COLUMN_COUNT; c++) {
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

          if (game.score == brickCount) {
            game.end = true;
          }
        }
      }
    }
  }
}

function drawBricks() {
  for (var r = 0; r < ROW_COUNT; r++) {
    for (var c = 0; c < COLUMN_COUNT; c++) {
      if (bricks[r][c].status == 1) {
        // update
        var brick = bricks[r][c];
        
        brick.x = (c * (brick.width + PADDING)) + OFFSET_LEFT;
        brick.y = (r * (brick.height + PADDING)) + OFFSET_TOP;

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
  if (rightKeyPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 4;
  } else if (leftKeyPressed && paddle.x > 0) {
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

  if (e.code == "ArrowRight") {
    rightKeyPressed = true;
  } else if (e.code == "ArrowLeft") {
    leftKeyPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.code == "ArrowRight") {
    rightKeyPressed = false;
  } else if (e.code == "ArrowLeft") {
    leftKeyPressed = false;
  }
}