
/* constants and variables */

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.style["backgroundColor"] = "#000";
canvas.width = innerWidth;
canvas.height = innerHeight;

const str = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ";
const center_x = canvas.width / 2;
const center_y = 240;
const r = 120;

var pass;
var i1;
var i2;
var start;
var n;
var s;
var _s;
var over;
var interval;

addEventListener("click", clickHandler);

/* run the game */

startGame();

function startGame() {
  pass = null;
  i1 = rd();
  i2 = rd();
  start = false;
  n = 1.5;
  s = 0;
  _s = 0;
  over = false;
  interval;

  interval = setInterval(render, 10);
}

function render() {
  clearCanvas();
  drawTitle();

  if (!start) {
    drawStart();
    return;
  }

  if (pass) {
    i1 = rd();
    i2 = rd();

    n = 1.5;
    s = 0;
    _s = 0;

    pass = false;
  }

  setTime();
  setTimer();
  drawTimer();

  if (s == 10) {
    over = true;
  }
  
  if (over) {
    setOver();
    return;
  }

  drawQuiz();
}

/* functions */

function setOver() {
  clearInterval(interval);
  drawOver();

  setTimeout(() => {
    startGame();
  }, 2000)
}

function rd() {
  return Math.floor(Math.random() * str.length);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setTime() {
  _s++ 

  if (_s == 100) {
    s++;
    _s = 0;
  }
}

function setTimer() {
  n += 0.002;
  
  if (n == 2) {
    n = 0;
  }
}

/* draw */

function drawTitle() {
  ctx.font = "30px Monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("# CHOSUNG GAME", center_x, 60);
}

function drawTimer() {
  // arc(x, y, radius, startAngle, endAngle)

  ctx.beginPath();
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#eee";
  ctx.arc(center_x, center_y, r, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#08f";
  ctx.arc(center_x, center_y, r, n * Math.PI, 1.5 * Math.PI);
  ctx.stroke();
}

function drawStart() {
  ctx.font = "20px Monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(
    "Touch or click to start game", 
    center_x, 
    center_y + (20 * 0.5)
  );
}

function drawQuiz() {
  ctx.font = "100px Monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(
    `${str[i1]}${str[i2]}`, 
    center_x, 
    center_y + (100 * 0.35)
  );
}

function drawOver() {
  ctx.font = "30px Monospace";
  ctx.textAlign = "center";
  ctx.fillText("TIME OVER", center_x, center_y + (20 * 0.5));
}

/* control */

function clickHandler(e) {
  if (!start) {
    start = true;
    return;
  }

  if (over) {
    return;
  }

  var x = e.clientX;
  var y = e.clientY;

  var circleClicked = Math.pow((x - center_x), 2) + Math.pow((y - center_y), 2) <= Math.pow(r, 2);
  
  if (!circleClicked) return;

  pass = true;
}



