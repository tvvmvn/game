import Stage from "./class/Stage.js";
import Actor from "./class/Actor.js";
import Cactus from "./class/Cactus.js";
import Time from "./class/Time.js";
import setCacti from "./function/setCacti.js";
import keyDownHandler from "./keyDownHandler.js";


var ctx = canvas.getContext("2d");
var stage = new Stage();
var actor;
var cacti;
var time;
var start;
var interval;
// others
var score;
var over = false;
var end = false;


addEventListener("load", initGame);
addEventListener("keydown", (e) => {
  keyDownHandler(e, actor, start, startGame);
});


function createInterval() {
  interval = setInterval(render, 10) // 100hz
}

function render() {
  clearCanvas()

  stage.draw()

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

function startGame() {
  start = true;
  createInterval();
}



