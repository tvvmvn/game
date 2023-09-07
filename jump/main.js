import Actor from "./class/Actor.js";
import Cactus from "./class/Cactus.js";
import Time from "./class/Time.js";
import setCacti from "./function/setCacti.js";

var ctx = canvas.getContext("2d");
var actor;
var cacti;
var time;
var start;
var interval;
// others
var score;
var over = false;
var end = false;

var stage = {
  offsetX: 50,
  offsetY: 50,
  width: 400,
  height: 200
}

initGame();

addEventListener("keydown", keyDownHandler);

function createInterval() {
  interval = setInterval(render, 10) // 100hz
}

function render() {
  clearCanvas()

  drawStage()

  time.set()
  time.draw()

  drawScore();

  setCacti(cacti, stage, actor, setScore, setOver)

  actor.set()
  actor.draw()

  if (end) {
    gameEnd()
  }

  if (over) {
    gameOver()
  }

  if (!start) {
    drawStart()
  }
}

function drawStart() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText("Press any key to start game", 150, 150);
}

function drawStage() {
  ctx.strokeRect(stage.offsetX, stage.offsetY, stage.width, stage.height);

  ctx.beginPath();
  ctx.moveTo(stage.offsetX, 200);
  ctx.lineTo(stage.offsetX + stage.width, 200);
  ctx.stroke();
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#888";
  ctx.fillText(`Score: ${score}`, 350, 30);
}

function setOver() {
  over = true;
}

function setScore() {
  score++;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameEnd() {
  console.log("YOU WIN");
  clearInterval(interval);
}

function gameOver() {
  ctx.font = "16px Arial";
  ctx.fillText("GAME OVER", 200, 150);
  
  clearInterval(interval);

  setTimeout(initGame, 2000)
}

function initGame() {
  actor = new Actor();
  time = new Time();
  cacti = [];
  for (var i = 0; i < 100; i++) {
    var cactus = new Cactus();
    cacti.push(cactus);
  }

  start = false;
  over = false;
  score = 0;

  render();
}

function keyDownHandler(e) {
  var key = e.key;

  if (!start) {
    start = true;
    return createInterval();
  }

  if (actor.jump) {
    return;
  }

  if (key === "ArrowUp") {
    actor.jump = true;
  }
}

