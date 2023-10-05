var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var alive = true;
var interval;
var bricks = [];

function initBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
  
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

initBricks();

interval = createInterval();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function createInterval() {
  return setInterval(draw, 10);
}

function removeInterval() {
  clearInterval(interval);
}

var start = false;
var over = false;

function drawStart() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText("Press any key to start", 160, 160);
}

function drawOver() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText("GAME OVER", 175, 170);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  // reflect on left or right wall
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  // top
  if (y + dy < ballRadius) {
    dy = -dy;
  // bottom
  } else if (y + dy > canvas.height - ballRadius) {
    // into paddle
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    // out of paddle
    } else {
      over = true;
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  if (!start) {
    drawStart();
    return;
  }

  if (over) {
    drawOver();
    removeInterval(interval);

    // initialize
    setTimeout(() => {
      start = false;
      over = false;
      interval = createInterval();

      // ball
      x = canvas.width/2;
      y = canvas.height-30;
      // vector
      dx = 2;
      dy = -2;
      // paddle
      paddleX = (canvas.width-paddleWidth)/2;
      // bricks
      initBricks();
    }, 2000)
  }

  x += dx;
  y += dy;
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];

      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;

          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#333";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#333";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      // an alive brick
      if (bricks[c][r].status == 1) {
        var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;

        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#333";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText("Score: " + score, 8, 20);
}

function keyDownHandler(e) {
  if (!start) {
    start = true;
  }

  if (e.code == "ArrowRight") {
    rightPressed = true;
  } else if (e.code == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.code == "ArrowRight") {
    rightPressed = false;
  } else if (e.code == "ArrowLeft") {
    leftPressed = false;
  }
}