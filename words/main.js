
/* Constants and variables */

const WIDTH = 400;
const HEIGHT = 200;
const OFFSET_X = 50;
const OFFSET_Y = 100;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var x, y;
var pass;
var s = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ";
var start = false;

canvas.style["backgroundColor"] = "#222";
canvas.width = innerWidth;
canvas.height = innerHeight;
addEventListener("click", clickHandler);

/* Run the game */

setInterval(render, 10);

function render() {
  clearCanvas();
  drawTitle();
  drawStage();
  
  if (!start) {
    drawStart();
    return;
  }

  if (pass) {
    setQuiz();
    pass = false;
  }

  drawQuiz();
}

/* Functions */

function setQuiz() {
  x = Math.floor(Math.random() * s.length);
  y = Math.floor(Math.random() * s.length);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* Draw */

function drawTitle() {
  ctx.font = "30px Monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("W O R D S", canvas.width / 2, 65);
}

var n = 2;

function drawStage() {
  // ctx.fillStyle = "#000";
  // ctx.fillRect(OFFSET_X, OFFSET_Y, WIDTH, HEIGHT);
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 200, 100, 0, 2 * Math.PI);
  ctx.fillStyle = "orange";
  ctx.fill();
}

function drawStart() {
  ctx.font = "16px Monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(
    "Click or touch it to start game", 
    OFFSET_X + (WIDTH / 2), 
    OFFSET_Y + ((HEIGHT / 2) + 10)
  );
}

function drawQuiz() {
  ctx.font = "100px Monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(
    `${s[x]}${s[y]}`, 
    OFFSET_X + (WIDTH / 2), 
    OFFSET_Y + ((HEIGHT / 2) + 40)
  );
}

/* Control */

function clickHandler(e) {
  var x = e.clientX;
  var y = e.clientY;

  var inStage = x > 50 && x < 450 && y > 100 && y < 300;
  
  if (inStage) {
    if (!start) {
      start = true;
    }

    pass = true;
  } 
}