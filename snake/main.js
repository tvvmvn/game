// struct
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

// enums
const Direction = {
  UP: 0,
  LEFT: 1,
  RIGHT: 2,
  DOWN: 3
}

// enums
const Key = {
  UP: "ArrowUp", // read only
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  ENTER: "Enter"
}

// enums
const Grid = {
  OFFSET_X: 40,
  OFFSET_Y: 50,
  WIDTH: 420,
  HEIGHT: 300,
  CELL: 20,
}

// variables
var ctx = canvas.getContext("2d");
var snake;
var apple;
var time;
var game;
var prevX;
var prevY;
var interval;
var prevKey;
var arr = [];

for (var r=0; r<15; r++) {
  arr[r] = [];
  for (var c=0; c<21; c++) {
    if ((r + c) % 2) {
      arr[r][c] = 1;
    } else {
      arr[r][c] = 0;
    }
  }
}

canvas.width = 500;
canvas.height = 400;
canvas.style.backgroundColor = "#222";

addEventListener("keydown", keyDownHandler);
startGame();


function startGame() {
  snake = new Snake(
    Grid.OFFSET_X + (Grid.CELL * 2), Grid.OFFSET_Y,
    0,0,
    Grid.CELL,
    20,
    [
      [Grid.OFFSET_X + (Grid.CELL * 2), Grid.OFFSET_Y],
      [Grid.OFFSET_X + (Grid.CELL * 1), Grid.OFFSET_Y],
      [Grid.OFFSET_X, Grid.OFFSET_Y]
    ],
    Direction.RIGHT,
    "#0a0"
  );

  apple = new Apple(
    Grid.OFFSET_X + 100, Grid.OFFSET_Y + 100,  
    10,
    20,
    false,
    "#f00"
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
  prevKey = Key.RIGHT;

  interval = createInterval();
}


/* FUNCTIONS */


function draw() {
  clearCanvas();
  drawGrid();
  

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


/* GRID */


function drawGrid() {
  ctx.fillStyle = "#333";
  for (var i=0; i<arr.length; i++) {
    for (var j=0; j<arr[i].length; j++) {
      if (arr[i][j]) {
        ctx.fillRect(
          Grid.OFFSET_X + (20 * j), 
          Grid.OFFSET_Y + (20 * i), 
          20, 20);
      }
    }
  }

  ctx.beginPath();
  ctx.strokeStyle = "#ddd";
  
  ctx.moveTo(Grid.OFFSET_X, Grid.OFFSET_Y);
  ctx.lineTo(Grid.OFFSET_X + Grid.WIDTH, Grid.OFFSET_Y);
  
  ctx.moveTo(Grid.OFFSET_X, Grid.OFFSET_Y + Grid.HEIGHT);
  ctx.lineTo(Grid.OFFSET_X + Grid.WIDTH, Grid.OFFSET_Y + Grid.HEIGHT);
  
  ctx.moveTo(Grid.OFFSET_X, Grid.OFFSET_Y);
  ctx.lineTo(Grid.OFFSET_X, Grid.OFFSET_Y + Grid.HEIGHT);
  
  ctx.moveTo(Grid.OFFSET_X + Grid.WIDTH, Grid.OFFSET_Y);
  ctx.lineTo(Grid.OFFSET_X + Grid.WIDTH, Grid.OFFSET_Y + Grid.HEIGHT);
  ctx.stroke();
}


/* SNAKE */


function setSnake() {
  if (snake.dir === Direction.RIGHT) {
    snake._x++;

    if (snake._x > snake.movingPoint) {
      snake.x += Grid.CELL;
      snake._x = 0;
    }
  }

  if (snake.dir === Direction.DOWN) {
    snake._y++;

    if (snake._y > snake.movingPoint) {
      snake.y += Grid.CELL;
      snake._y = 0;
    }
  }

  if (snake.dir === Direction.LEFT) {
    snake._x--;

    if (snake._x < -snake.movingPoint) {
      snake.x -= Grid.CELL;
      snake._x = 0;
    }
  }

  if (snake.dir === Direction.UP) {
    snake._y--;
    
    if (snake._y < -snake.movingPoint) {
      snake.y -= Grid.CELL;
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
  var leftCrash = snake.x < Grid.OFFSET_X
  var rightCrash = snake.x + Grid.CELL > Grid.OFFSET_X + Grid.WIDTH;
  var topCrash = snake.y < Grid.OFFSET_Y;
  var bottomCrash = snake.y + Grid.CELL > Grid.OFFSET_Y + Grid.HEIGHT;

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

  // snake x, y
  // ctx.fillStyle = "#f00"
  // ctx.fillRect(snake.x, snake.y, 5, 5); 
}


/* APPLE */


function putApple() {
  var x = Grid.OFFSET_X + (Grid.CELL * (Math.floor(Math.random() * 20)));
  var y = Grid.OFFSET_Y + (Grid.CELL * (Math.floor(Math.random() * 15)));

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
  // ctx.fillStyle = apple.color;
  // ctx.fillRect(apple.x, apple.y, apple.size, apple.size);

  ctx.beginPath();
  ctx.arc(apple.x + 10, apple.y + 10, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "#f00";
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

  prevKey = e.key;
}
