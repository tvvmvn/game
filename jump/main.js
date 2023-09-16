var ctx = canvas.getContext("2d");
var img = new Image();
img.src =  "./offline-sprite-1x.png"; // 1206 x 68
var jump = false;
var actorY = 180
var v = -5;
var _s = 0;
var s = 0;
var paused = false;
var interval;
var rightFoot = true;
var landX1 = 0;
var landX2 = 500;
var cactusX1 = setCactusX();
var cactusX2 = setCactusX();

document.addEventListener("DOMContentLoaded", createInterval);
document.addEventListener("keydown", keyDownHandler);

function draw() {
  /* 
  drawImage(image, dx, dy)
  drawImage(image, dx, dy, dWidth, dHeight)
  drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  */
 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawLand1()
  drawLand2()
  drawCacti()
  trex()
}

function drawLand1() {
  landX1 -= 2;

  if (landX1 < -500) {
    landX1 = 500;
  }

  var sx = 0; // 765
  var sy = 54;
  var sWidth = 500;
  var sHeight = 12;
  var dx = landX1;
  var dy = 215;
  var dWidth = sWidth;
  var dHeight = sHeight;

  ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
}

function drawLand2() {
  landX2 -= 2;

  if (landX2 < -500) {
    landX2 = 500;
  }

  var sx = 500; // 765
  var sy = 54;
  var sWidth = 500;
  var sHeight = 12;
  var dx = landX2;
  var dy = 215;
  var dWidth = sWidth;
  var dHeight = sHeight;

  ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
}

function setCactusX() {
  return canvas.width + Math.random() * 500;
}

function drawCacti() {
  cactusX1 -= 2;
  cactusX2 -= 2;
  
  if (cactusX1 < -10) {
    cactusX1 = setCactusX()
  }

  if (cactusX2 < -10) {
    cactusX2 = setCactusX()
  }

  ctx.fillRect(cactusX1, 200, 10, 10)
  ctx.fillRect(cactusX2, 200, 10, 10)
}

function trex() {
  var sx = 810; // 765
  var sy = 2;
  var sWidth = 42;
  var sHeight = 45;
  var dx = 50;
  var dy = 200;
  var dWidth = sWidth;
  var dHeight = sHeight;
  
  /* 
    RUNNING: {
      frames: [88, 132],
      msPerFrame: 1000 / 12
    },
  */

  _s++
  if (_s > 10) {
    if (rightFoot) {
      rightFoot = false;
    } else {
      rightFoot = true;
    }
    _s = 0;
  }

  if (rightFoot) {
    sx = 809;
  } else {
    sx = 765;
  }  

  if (jump) {
    // y from -5 to 5
    actorY += v;
    v += 0.2
    ctx.drawImage(img, 677, sy, sWidth, sHeight, dx, actorY, dWidth, dHeight)
  } else {
    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, actorY, dWidth, dHeight)
  }

  if (actorY > 180) {
    jump = false;
    v = -5;
  }
}

function createInterval() {
  interval = setInterval(draw, 10);
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