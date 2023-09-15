var ctx = canvas.getContext("2d");
var img = new Image();
img.src =  "./offline-sprite-1x.png";
var jump = false;
var actorY = 180
var v = -5;
var _s = 0;
var s = 0;

var interval = setInterval(draw, 10)
document.addEventListener("keydown", keyDownHandler);

function draw() {
  /* 
  drawImage(image, dx, dy)
  drawImage(image, dx, dy, dWidth, dHeight)
  drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  */
 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  trex()
}

var rightFoot = true;

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