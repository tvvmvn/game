f();

function f() {
  var ctx = canvas.getContext("2d");

  const Direction = {
    TOP: 0,
    LEFT: 1,
    RIGHT: 2,
    DOWN: 3
  }
  
  const Key = {
    UP: 'ArrowUp', // read only
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    ENTER: 'Enter'
  }

  var grid = {
    offsetX: 50,
    offsetY: 50,
    width: 400,
    height: 300,
    rowCount: 15,
    colCount: 20,
    cell: 20,
  }
  
  var snake = {
    x: grid.offsetX + (grid.cell * 2),
    y: grid.offsetY,
    _x: 0,
    _y: 0,
    width: grid.cell,
    height: grid.cell,
    movingPoint: 20,
    node: [
      { x: grid.offsetX + (grid.cell * 2), y: grid.offsetY },
      { x: grid.offsetX + (grid.cell * 1), y: grid.offsetY },
      { x: grid.offsetX, y: grid.offsetY }
    ],
    dir: Direction.RIGHT,
    color: "#0a0"
  }
  
  var apple = {
    x: grid.offsetX + 100,
    y: grid.offsetY + 100,
    width: 20,
    height: 20,
    count: 20,
    eaten: false,
    color: "#f00"
  };
  
  var time = {
    _s: 0,
    s: 0,
  };
  
  var misc = {
    start: false,
    over: false,
    end: false
  }
  
  var prevX = snake.x;
  var prevY = snake.y;
  var interval = createInterval();
  var prevKey = Key.RIGHT;

  addEventListener("keydown", keyDownHandler);


  /* FUNCTIONS */
  
  
  function draw() {
    clearCanvas();
    
    drawGrid();
  
    if (!misc.start) {
      drawStart();
      return;
    }
  
    setTime();
    drawTime();
    drawScore();
  
    if (misc.over) {
      drawOver();
      initGame();
    }
    
    if (misc.end) {
      drawEnd();
      initGame()
    }
    
    // Snake
    setSnake();
  
    if (prevX !== snake.x || prevY !== snake.y) {
      if (wallCrash()) {
        misc.over = true;
      } else if (selfCrash()) {
        misc.over = true;
      } else {
        snakeMove()
      }
    }
  
    drawSnake();
  
    // Apple
    if (apple.count) {
      apple.eaten = (snake.x === apple.x) && (snake.y === apple.y)
      
      if (apple.eaten) {
        snake.node.push({ x: snake.x, y: snake.y });
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
      f();
    }, 2000)
  }
  
  function createInterval() {
    return setInterval(draw, 10) // 100hz
  }


  /* SNAKE */


  function setSnake() {
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
  
  function snakeMove() {
    // body
    for (var j = snake.node.length - 1; j > 0; j--) {
      snake.node[j].x = snake.node[j - 1].x;
      snake.node[j].y = snake.node[j - 1].y;
    }
    
    // head
    snake.node[0].x = snake.x;
    snake.node[0].y = snake.y;
  }
  
  function selfCrash() {
    var value = false;
  
    for (var h = 3; h < snake.node.length; h++) {
      if (snake.x === snake.node[h].x && snake.y === snake.node[h].y) {
        value = true;
      }
    }
  
    return value;
  }
  
  function wallCrash() {
    var leftCrash = snake.x < grid.offsetX
    var rightCrash = snake.x + grid.cell > grid.offsetX + grid.width;
    var topCrash = snake.y < grid.offsetY;
    var bottomCrash = snake.y + grid.cell > grid.offsetY + grid.height;
  
    if (leftCrash || rightCrash || topCrash || bottomCrash) {
      return true
    }
  
    return false;
  }
  
  function drawSnake() {
    for (var i = 0; i < snake.node.length; i++) {
      ctx.fillStyle = snake.color;
      ctx.fillRect(snake.node[i].x, snake.node[i].y, snake.width, snake.height);
    }
  
    // snake x, y
    // ctx.fillStyle = "#f00"
    // ctx.fillRect(snake.x, snake.y, 5, 5); 
  }


  /* APPLE */
  
  
  function putApple() {
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
  
  function drawApple() {
    ctx.fillStyle = apple.color;
    ctx.fillRect(apple.x, apple.y, apple.width, apple.height);
  }


  /* GRID */
  

  function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = "#555";
    
    // rows
    for (var r = 0; r < grid.rowCount + 1 ; r++) {
      ctx.moveTo(grid.offsetX, grid.offsetY + (r * grid.cell));
      ctx.lineTo(grid.offsetX + grid.width, grid.offsetY + (r * grid.cell));
    }
  
    // cols
    for (var c = 0; c < grid.colCount + 1; c++) {
      ctx.moveTo(grid.offsetX + (c * grid.cell), grid.offsetY);
      ctx.lineTo(grid.offsetX + (c * grid.cell), grid.offsetY + grid.height);
    }
  
    ctx.stroke();
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
    if (!misc.start) {
      misc.start = true;
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
}
