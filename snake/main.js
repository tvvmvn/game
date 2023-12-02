/* struct */


class Snake {
  constructor(x, y, _x, _y, size, movingPoint, node, dir, color) {
    this.x = x;
    this.y = y;
    this._x =_x;
    this._y = _y;
    this.size = size;
    this.movingPoint = movingPoint;
    this.node = node;
    this.dir = dir;
    this.color = color;
  }
}

class Apple {
  constructor(x, y, radius, count, eaten, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.count = count;
    this.eaten = eaten;
    this.color = color;
  }
}


/* enums */


const Direction = {
  UP: 0,
  LEFT: 1,
  RIGHT: 2,
  DOWN: 3
}

const Key = {
  UP: "ArrowUp", 
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  ENTER: "Enter"
}

const Stage = {
  OFFSET_X: 40,
  OFFSET_Y: 50,
  WIDTH: 420,
  HEIGHT: 300,
  CELL: 20,
}


/* variables */


var ctx = canvas.getContext("2d");
var snake;
var apple;
var time;
var game;
var prevX;
var prevY;
var interval;
var checker = [];

for (var r = 0; r < Stage.HEIGHT / Stage.CELL; r++) {
  checker[r] = [];
  for (var c = 0; c < Stage.WIDTH / Stage.CELL; c++) {
    if ((r + c) % 2) {
      checker[r][c] = 1;
    } else {
      checker[r][c] = 0;
    }
  }
}

canvas.width = 500;
canvas.height = 400;
canvas.style.backgroundColor = "#222";
document.body.style["backgroundColor"] = "#000";


/* run */


startGame();
addEventListener("keydown", keyDownHandler);


/* FUNCTIONS */


function startGame() {
  snake = new Snake(
    Stage.OFFSET_X + (Stage.CELL * 2), Stage.OFFSET_Y,
    0,0,
    Stage.CELL,
    20,
    [
      [Stage.OFFSET_X + (Stage.CELL * 2), Stage.OFFSET_Y],
      [Stage.OFFSET_X + (Stage.CELL * 1), Stage.OFFSET_Y],
      [Stage.OFFSET_X, Stage.OFFSET_Y]
    ],
    Direction.RIGHT,
    "#0b0"
  );

  apple = new Apple(
    Stage.OFFSET_X + 100, Stage.OFFSET_Y + 100,  
    10,
    20,
    false,
    "#b00"
  )

  time = {
    _s: 0,
    s: 0,
  };

  game = {
    start: false,
    over: false,
    end: false
  }

  prevX = snake.x;
  prevY = snake.y;
  interval;

  interval = createInterval();
}


function draw() {
  clearCanvas();
  drawStage();
  
  if (!game.start) {
    drawStart();
    return;
  }

  setTime();
  drawTime();
  drawScore();

  if (game.over) {
    drawOver();
    initGame();
  }
  
  if (game.end) {
    drawEnd();
    initGame()
  }
  
  // Snake
  setSnake();

  if (prevX !== snake.x || prevY !== snake.y) {
    if (wallCrash()) {
      game.over = true;
    } else if (selfCrash()) {
      game.over = true;
    } else {
      snakeMove()
    }
  }

  drawSnake();

  // Apple
  if (apple.count) {
    apple.eaten = (snake.x === apple.x) && (snake.y === apple.y)
    
    if (apple.eaten) {
      snake.node.push([snake.x, snake.y]);
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
    startGame();
  }, 2000)
}

function createInterval() {
  return setInterval(draw, 10) // 100hz
}


/* stage */


function drawStage() {
  // checker
  ctx.fillStyle = "#333";
  
  for (var r = 0; r < checker.length; r++) {
    for (var c = 0; c < checker[r].length; c++) {
      if (checker[r][c]) {
        ctx.fillRect(
          Stage.OFFSET_X + (Stage.CELL * c),
          Stage.OFFSET_Y + (Stage.CELL * r),
          Stage.CELL, Stage.CELL);
      }
    }
  }

  // border
  ctx.beginPath();
  ctx.strokeStyle = "#ddd";
  ctx.rect(Stage.OFFSET_X, Stage.OFFSET_Y, Stage.WIDTH, Stage.HEIGHT);
  ctx.stroke();
}


/* SNAKE */


function setSnake() {
  if (snake.dir === Direction.RIGHT) {
    snake._x++;

    if (snake._x > snake.movingPoint) {
      snake.x += Stage.CELL;
      snake._x = 0;
    }
  }

  if (snake.dir === Direction.DOWN) {
    snake._y++;

    if (snake._y > snake.movingPoint) {
      snake.y += Stage.CELL;
      snake._y = 0;
    }
  }

  if (snake.dir === Direction.LEFT) {
    snake._x--;

    if (snake._x < -snake.movingPoint) {
      snake.x -= Stage.CELL;
      snake._x = 0;
    }
  }

  if (snake.dir === Direction.UP) {
    snake._y--;
    
    if (snake._y < -snake.movingPoint) {
      snake.y -= Stage.CELL;
      snake._y = 0;
    }  
  }
}

function snakeMove() {
  // body
  for (var j = snake.node.length - 1; j > 0; j--) {
    snake.node[j][0] = snake.node[j - 1][0];
    snake.node[j][1] = snake.node[j - 1][1];
  }
  // head
  snake.node[0][0] = snake.x;
  snake.node[0][1] = snake.y;
}

function selfCrash() {
  var value = false;

  for (var h = 3; h < snake.node.length; h++) {
    if (snake.x === snake.node[h][0] && snake.y === snake.node[h][1]) {
      value = true;
    }
  }

  return value;
}

function wallCrash() {
  var leftCrash = snake.x < Stage.OFFSET_X
  var rightCrash = snake.x + Stage.CELL > Stage.OFFSET_X + Stage.WIDTH;
  var topCrash = snake.y < Stage.OFFSET_Y;
  var bottomCrash = snake.y + Stage.CELL > Stage.OFFSET_Y + Stage.HEIGHT;

  if (leftCrash || rightCrash || topCrash || bottomCrash) {
    return true
  }

  return false;
}

function drawSnake() {
  for (var i = 0; i < snake.node.length; i++) {
    ctx.fillStyle = snake.color;
    ctx.fillRect(snake.node[i][0], snake.node[i][1], snake.size, snake.size);
  }
}


/* APPLE */


function putApple() {
  var x = Stage.OFFSET_X + (Stage.CELL * (Math.floor(Math.random() * 20)));
  var y = Stage.OFFSET_Y + (Stage.CELL * (Math.floor(Math.random() * 15)));

  var putAgain = false;

  // detect apple on snake body
  for (var i = 0; i < snake.node.length; i++) {
    if (snake.node[i][0] === x && snake.node[i][1] === y) {
      putAgain = true;
    }
  }

  if (putAgain) {
    putApple()
  } else {
    apple.x = x
    apple.y = y
  }
}

function drawApple() {
  ctx.beginPath();
  ctx.arc(
    apple.x + apple.radius, 
    apple.y + apple.radius, 
    10, 
    0, 
    2 * Math.PI
  );
  ctx.fillStyle = apple.color;
  ctx.fill();
}


/* TIME */


function setTime() {
  time._s++
  
  if (time._s > 100) {
    time.s++;
    time._s = 0;
  }
}

function drawTime() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Time: " + time.s, 20, 30);
}


/* KEY HANDLER */


function keyDownHandler(e) {
  if (!game.start) {
    game.start = true;
  }

  // prevent accel and u-turn 
  if (snake.dir === Direction.RIGHT) {
    if (e.key === Key.RIGHT) return;
    if (e.key === Key.LEFT) return;
  } 

  if (snake.dir === Direction.DOWN) {
    if (e.key === Key.DOWN) return;
    if (e.key === Key.UP) return;
  } 

  if (snake.dir === Direction.LEFT) {
    if (e.key === Key.LEFT) return;
    if (e.key === Key.RIGHT) return;
  } 

  if (snake.dir === Direction.UP) {
    if (e.key === Key.UP) return;
    if (e.key === Key.DOWN) return;
  } 

  // turn 
  if (e.key === Key.UP) {
    snake._y -= snake.movingPoint;
    snake.dir = Direction.UP;
  } 
  
  if (e.key === Key.LEFT) {
    snake._x -= snake.movingPoint;
    snake.dir = Direction.LEFT;
  }

  if (e.key === Key.RIGHT) {
    snake._x += snake.movingPoint;
    snake.dir = Direction.RIGHT;
  }
  
  if (e.key === Key.DOWN) {
    snake._y += snake.movingPoint;
    snake.dir = Direction.DOWN;
  }
}
