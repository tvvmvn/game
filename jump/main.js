import Actor from "./class/Actor.js";
import Time from "./class/Time.js";
import setCacti from "./function/setCacti.js";

// others
var score = 0;
var over = false;
var end = false;

var stage = {
  offsetX: 50,
  offsetY: 50,
  width: 400,
  height: 200
}

var ctx = canvas.getContext("2d");
var actor = new Actor();
var time = new Time();

var interval = createInterval();
addEventListener("keydown", keyDownHandler);

function createInterval() {
  return setInterval(render, 10) // 100hz
}

function render() {
  clearCanvas()

  drawStage()

  time.set()
  time.draw()

  drawScore();

  setCacti(stage, actor, score, setOver)

  actor.set()
  actor.draw()

  if (end) {
    gameEnd()
  }

  if (over) {
    gameOver()
  }
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

function gameOver() {
  ctx.font = "16px Arial";
  ctx.fillText("GAME OVER", 200, 150);
  clearInterval(interval);
}

function gameEnd() {
  console.log("YOU WIN");
  clearInterval(interval);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function keyDownHandler(e) {
  var key = e.key;

  if (actor.jump) {
    return;
  }

  if (key === "ArrowUp") {
    actor.jump = true;
  }
}

