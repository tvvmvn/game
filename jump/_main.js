var ctx = canvas.getContext("2d");
var x = 0;
var _x = 0;

var image = new Image();
image.src = "./t-rex-background.png";

var imageX1 = 0;
var imageX2 = canvas.width;

import SpriteDefinition from "./enums.js";

console.log(SpriteDefinition.LDPI.HORIZON)

var actorY = 180;
var jump = false;
var v = -5;

var _s = 0;
var s = 0;

var cactusX1 = setCactusX();
var cactusX2 = setCactusX();

var interval;
var paused = false;

createInterval();
document.addEventListener("keydown", keyDownHandler);

function createInterval() {
  interval = setInterval(render, 10);
}

function render() {
  clearCanvas();

  x--; 

  drawStage()

  drawCacti()

  drawActor()

  drawTime();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawStage() {

  imageX1--;
  
  if (imageX1 < -canvas.width) {
    imageX1 = canvas.width;
  }
  
  imageX2--;

  if (imageX2 < -canvas.width) {
    imageX2 = canvas.width;
  }

  ctx.drawImage(image, imageX1, 0);
  ctx.drawImage(image, imageX2, 0);
}

function setCactusX() {
  return canvas.width + Math.random() * 500;
}

function drawCacti() {
  cactusX1--;
  cactusX2--;
  
  if (cactusX1 < -10) {
    cactusX1 = setCactusX()
  }

  if (cactusX2 < -10) {
    cactusX2 = setCactusX()
  }

  ctx.fillRect(cactusX1, 200, 10, 10)
  ctx.fillRect(cactusX2, 200, 10, 10)
}

function drawActor() {
  if (jump) {
    // y from -5 to 5
    actorY += v;
    v += 0.2
  }

  if (actorY > 180) {
    jump = false;
    v = -5;
  }

  // ctx.rotate(20 * Math.PI / 180);
  ctx.fillRect(100, actorY, 20, 20);
}

function drawTime() {
  _s++

  if (_s > 100) {
    s++;
    _s = 0;
  }

  ctx.font = "16px Arial";
  ctx.fillText(`${s}`, 400, 40);
}

function keyDownHandler(e) {
  if (e.key === 'p') {
   if (paused) { // resume
      createInterval();
      paused = false;
    } else {
      clearInterval(interval)
      paused = true;
    }
  }

  if (jump) {
    return;
  }

  if (e.key === "ArrowUp") {
    jump = true;
  }
}
