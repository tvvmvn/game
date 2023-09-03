var ctx = canvas.getContext("2d");

class Grid {
  offsetX = 50;
  offsetY = 50;
  width = 400;
  height = 300;
  cell = 20;

  constructor() {}
  
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = "#fff";
    
    // rows
    for (var r = 0; r < (this.height / this.cell) + 1 ; r++) {
      ctx.moveTo(this.offsetX, this.offsetY + (r * this.cell));
      ctx.lineTo(this.offsetX + this.width, grid.offsetY + (r * this.cell));
    }
  
    // cols
    for (var c = 0; c < (this.width / this.cell) + 1; c++) {
      ctx.moveTo(this.offsetX + (c * this.cell), this.offsetY);
      ctx.lineTo(this.offsetX + (c * this.cell), this.offsetY + this.height);
    }
  
    ctx.stroke();
  }
}

class Snake {
  x;
  y;
  _x = 0;
  _y = 0;
  node;
  dir = "right";

  constructor(grid) {
    this.x = grid.offsetX + (grid.cell * 2);
    this.y = grid.offsetY;
    this.size = grid.cell;

    this.node = [
      { x: grid.offsetX + (grid.cell * 2), y: grid.offsetY },
      { x: grid.offsetX + (grid.cell * 1), y: grid.offsetY },
      { x: grid.offsetX, y: grid.offsetY }
    ]
  }

  move() {
    for (var j = this.node.length - 1; j > 0; j--) {
      this.node[j].x = this.node[j - 1].x;
      this.node[j].y = this.node[j - 1].y;
    }
    this.node[0].x = this.x;
    this.node[0].y = this.y;
  }

  draw() {
    for (var i = 0; i < this.node.length; i++) {
      ctx.fillStyle = "#0a0"
      ctx.fillRect(this.node[i].x, this.node[i].y, this.size, this.size);
    }
  }
};

class Apple {
  count = 20;
  eaten = false;

  constructor(grid) {
    this.x = grid.offsetX + 100;
    this.y = grid.offsetY + 100;
    this.size = grid.cell;
  }

  setX() {
    return grid.offsetX + (grid.cell * (Math.floor(Math.random() * 20)));
  }
  
  setY() {
    return grid.offsetY + (grid.cell * (Math.floor(Math.random() * 15)));
  }

  draw() {
    ctx.fillStyle = "#f00"
    ctx.fillRect(apple.x, apple.y, this.size, this.size);
  }
}

class Time {
  ms = 10;
  _s = 0;
  s = 0;
  snake = { x: 0, y: 0, trigger: 20 }
  
  draw() {
    this._s++
  
    if (this._s > 100) {
      this.s++;
      this._s = 0;
    }
  
    ctx.font = "16px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Time: " + this.s, 20, 30);
  }
}

// instance
var grid = new Grid();
var snake = new Snake(grid);
var apple = new Apple(grid);
var time = new Time();

// game control
var prevKey = "ArrowRight";
var paused = false;
var over = false;


function render() {
  clearCanvas();
  
  setSnakeCoord(); 
  
  if (apple.count) {
    apple.eaten = (snake.x === apple.x) && (snake.y === apple.y)
    
    if (apple.eaten) {
      snake.node.push({ x: snake.x, y: snake.y });
      // apple count
      apple.count--;
      
      setLevel();

      putApple()
    }
    
    apple.draw();
  } else {
    gameEnd()
  } 

  time.draw();
  drawScore();
  grid.draw();
}

function putApple() {
  var _appleX = apple.setX();
  var _appleY = apple.setY();

  var putAgain = false;

  // detect apple on snake body
  for (var i = 0; i < snake.node.length; i++) {
    if (snake.node[i].x === _appleX && snake.node[i].y === _appleY) {
      putAgain = true;
    }
  }

  if (putAgain) {
    putAgain()
  } else {
    apple.x = _appleX
    apple.y = _appleY
  }
}

function setSnakeCoord() {
  var shouldMove = false;

  if (snake.dir === "right") {
    time.snake.x++;
    if (time.snake.x > time.snake.trigger) {
      snake.x += grid.cell;
      shouldMove = true;
      time.snake.x = 0;
    }
  }

  if (snake.dir === "down") {
    time.snake.y++;
    if (time.snake.y > time.snake.trigger) {
      snake.y += grid.cell;
      shouldMove = true;
      time.snake.y = 0;
    }
  }

  if (snake.dir === "left") {
    time.snake.x--;
    if (time.snake.x < -time.snake.trigger) {
      snake.x -= grid.cell;
      shouldMove = true;
      time.snake.x = 0;
    }
  }

  if (snake.dir === "up") {
    time.snake.y--;
    if (time.snake.y < -time.snake.trigger) {
      snake.y -= grid.cell;
      shouldMove = true;
      time.snake.y = 0;
    }  
  }

  if (shouldMove) {
    var wallCrash = detectWallCrash();
    var selfCrash = detectSelfCrash();
  
    if (wallCrash) {
      console.log("wall crash")
      gameOver()
    } else if (selfCrash) {
      console.log("self crash")
      gameOver()
    } else {
      snake.move()
    }
  }

  snake.draw();
}

function setLevel() {
  // get faster
  time.snake.trigger--;
}

function detectWallCrash() {
  var leftCrash = snake.x < grid.offsetX
  var rightCrash = snake.x + grid.cell > grid.offsetX + grid.width;
  var topCrash = snake.y < grid.offsetY;
  var bottomCrash = snake.y + grid.cell > grid.offsetY + grid.height;

  if (leftCrash || rightCrash || topCrash || bottomCrash) {
    return true
  }

  return false;
}

function detectSelfCrash() {
  var selfCrash = false;

  for (var h = 4; h < snake.node.length; h++) {
    if (snake.x === snake.node[h].x && snake.y === snake.node[h].y) {
      selfCrash = true
    }
  }
  return selfCrash;
}

function gameOver() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("GAME OVER", 190, 208);
  clearInterval(interval);
  over = true;
}

function gameEnd() {
  clearInterval(interval)
  console.log("YOU WIN")
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(apple.count + " apples", 400, 30);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function keyDownHandler(e) {
  // console.log(e.key, "pressed");

  if (over && e.key === "Enter") {
    console.log("Resume")

    apple = new Apple(grid);
    snake = new Snake(grid);

    snake.dir = "right";
    time = new Time();
    over = false;
    prevX = snake.x;
    prevY = snake.y;

    interval = createInterval()
  }

  if (e.key === "p") {
    if (paused) {
      interval = createInterval()
      paused = false;
      console.log("Play")
    } else {
      clearInterval(interval);
      paused = true;
      console.log("Paused")
    }
    return;
  }

  if (paused) {
    return;
  }

  if (prevKey === e.key) {
    return;
  }

  // prevent u-turn
  var rtol = snake.dir === "right" && e.key === "ArrowLeft";
  var ltor = snake.dir === "left" && e.key === "ArrowRight";
  var utod = snake.dir === "up" && e.key === "ArrowDown";
  var dtou = snake.dir === "down" && e.key === "ArrowUp";

  if (rtol || ltor || utod || dtou) return;

  if (e.key === "ArrowRight") {
    time.snake.x += time.snake.trigger;
    snake.dir = "right";
  }

  if (e.key === "ArrowDown") {
    time.snake.y += time.snake.trigger;
    snake.dir = "down";
  }

  if (e.key === "ArrowLeft") {
    time.snake.x -= time.snake.trigger;
    snake.dir = "left";
  }

  if (e.key === "ArrowUp") {
    time.snake.y -= time.snake.trigger;
    snake.dir = "up";
  }

  prevKey = e.key;
}

function createInterval() {
  return setInterval(render, time.ms)
}

var interval = createInterval();

addEventListener("keydown", keyDownHandler);


// class Cat {
//   // name;

//   constructor(name) {
//     this.name = name;
//     this.greeting = "Hi I am " + name;
//   }
// }

// var cat = new Cat("Kitty")

// console.log(cat.greeting);

