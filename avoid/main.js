var ctx = canvas.getContext("2d");
var width = 20;
var height = 20;
var x = (canvas.width - width) / 2
var y = canvas.height - height;
var isLeftPressed = false;
var isRightPressed = false;
var score = 0;
var time = 0;
var level = 1;
var k = 0;
var lives = 1;
var obstacles = [];
var obstacleCount = 30;

for (var j = 0; j < obstacleCount; j++) {
  var obstacle = { 
    x: 0, 
    y: 0, 
    active: false,
    width: 200,
    height: 20,
    hole: Math.ceil(Math.random() * 160)
  };
  
  obstacles.push(obstacle);
}

draw()
addEventListener("keydown", keyDownHandler);
addEventListener("keyup", keyUpHandler);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isLeftPressed) {
    if (x > 0) x -= 2;
  }

  if (isRightPressed) {
    if (x + width < canvas.width) x += 2;
  }

  drawLevel()
  
  drawObstacles();
  
  drawScore()
  drawActor();

  requestAnimationFrame(draw);
}

function drawLevel() {
  if (level === 1) {
    time += 0.004;
  }

  if (level === 2) {
    time += 0.006;
  }

  if (level === 3) {
    time += 0.008;
  }

  if (time > 1) {
    obstacles[k].active = true;
    k++;

    time = 0;
  }

  if (k > 10) {
    level = 2;
  }

  if (k > 20) {
    level = 3
  }
  
  ctx.font = "16px Arial";
  ctx.fillStyle = "#888";
  ctx.fillText(`Level: ${level}`, 8, 20);
}

function drawObstacles() {
  for (var i=0; i<obstacles.length; i++) {
    var obstacle = obstacles[i];

    if (obstacle.active) {
      obstacle.y++
      
      ctx.fillStyle = "#000";
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      // hole
      ctx.fillStyle = "#fff";
      ctx.fillRect(obstacle.hole, obstacle.y, 40, obstacle.height);

      // collision detection
      var collided_v = (y < obstacle.y + obstacle.height) && (y + height > obstacle.y);
      var collided_h = (x < obstacle.hole) || (x + width > obstacle.hole + 40);
  
      if (collided_v && collided_h) {
        lives--;
      }
      
      if (!lives) {
        alert(`Score: ${score}`);
        document.location.reload();
        return;
      }

      if (obstacle.y > canvas.height) {
        score++;
        obstacle.active = false;
      }
    }
  }
}

function drawActor() {
  ctx.fillStyle = "#f00"
  ctx.fillRect(x, y, width, height)
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#888";
  ctx.fillText(`Score: ${score}`, 8, 40);
}

function keyDownHandler(e) {
  if (e.key === "ArrowLeft") {
    isLeftPressed = true;
  }

  if (e.key === "ArrowRight") {
    isRightPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "ArrowLeft") {
    isLeftPressed = false;
  }

  if (e.key === "ArrowRight") {
    isRightPressed = false;
  }
}
