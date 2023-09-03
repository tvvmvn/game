var ctx = canvas.getContext("2d");

function initActor(actor) {
  actor.x = 100;
  actor.y = 180;
  actor.v = -5;
  actor.width = 20;
  actor.height = 20;
  actor.jump = false;
}

function initCactus(cactus) {
  cactus.cacti = [];
  cactus.count = 100;
  cactus._on = 0;
  cactus.on = 0;
  cactus.limit = 100; // 1s
  cactus.x = 450;
  cactus.y = 190;
  cactus.width = 10;
  cactus.height = 10;

  for (var i=0; i<cactus.count; i++) {
    var item = { 
      x: cactus.x, 
      y: cactus.y, 
      width: cactus.width, 
      height: cactus.height,
      active: false
    }
  
    cactus.cacti.push(item);
  }
}

function initBird() {
  bird.birds = [];
  bird.count = 10;
  bird._on = 0;
  bird.on = 0;
  bird.limit = 100; // 1s
  bird.x = 450;
  bird.y = 150;
  bird.width = 20;
  bird.height = 10;

  for (var i=0; i<bird.count; i++) {
    var item = { 
      x: bird.x, 
      y: bird.y, 
      width: bird.width, 
      height: bird.height,
      active: false
    }
  
    bird.birds.push(item);
  }
}

function initTime(time) {
  time._s = 0;
  time.s = 0;
}

var actor = {};
var cactus = {};
var bird = {};
var time = {};

initActor(actor)
initCactus(cactus)
initBird(bird)
initTime(time)

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

var interval = createInterval();
addEventListener("keydown", keyDownHandler);

function createInterval() {
  return setInterval(() => {
    clearCanvas()

    drawStage()

    setTime()
    drawTime()

    drawScore();

    setCactus()

    setActor()
    drawActor()

    if (end) {
      gameEnd()
    }

    if (over) {
      gameOver()
    }
  }, 10) // 100hz
}

function setBird() {}

function setCactus() {
  // cacti remains, so keep activing cacti.
  if (cactus.on < cactus.count - 1) {
    cactus._on++;
  
    if (cactus._on > cactus.limit) {
      cactus.on++;
      cactus._on = 0;

      // since last cactus, 0.5s - 1.5s
      cactus.limit = 50 + (Math.random() * 100);
      
      console.log(cactus.limit);
    }

    cactus.cacti[cactus.on].active = true;
  }

  for (var i = 0; i < cactus.cacti.length; i++) {
    // Deactive cactus
    if (cactus.cacti[i].x < stage.offsetX - 10) {
      cactus.cacti[i].active = false
    }

    // Game end
    var lastCactus = cactus.cacti[cactus.count - 1];

    if (lastCactus.x < stage.offsetX - 10 && !lastCactus.active) {
      end = true;
    }

    // make cactus move
    if (cactus.cacti[i].active) {
      cactus.cacti[i].x--;
    }

    // handle collision 
    var metLeft = cactus.cacti[i].x + cactus.cacti[i].width > actor.x
    var metRight = actor.x + actor.width > cactus.cacti[i].x
    var metY = actor.y + actor.height > cactus.cacti[i].y;

    if (metLeft && metRight && metY) {
      console.log('collided')
      over = true;
    }

    // Score
    if (actor.x === cactus.cacti[i].x) {
      score++;
    }

    // draw cactus
    drawCactus(cactus.cacti[i]);
  }
}

function drawCactus(cactus) {
  ctx.fillStyle = "#f00"
  ctx.fillRect(cactus.x, cactus.y, cactus.width, cactus.height)
}

function setActor() {
  if (actor.jump) {
    // from -5 to 5
    actor.y += actor.v;
    // console.log(actor.y, actor.v);
    actor.v += 0.2
  }
  
  if (actor.y > 180) {
    actor.jump = false;
    actor.v = -5;
  }
}

function drawActor() {
  ctx.fillStyle = "#000"
  ctx.fillRect(actor.x, actor.y, actor.width, actor.height);
}


function drawStage() {
  ctx.strokeRect(stage.offsetX, stage.offsetY, stage.width, stage.height);
  
  ctx.beginPath();
  ctx.moveTo(stage.offsetX, 200);
  ctx.lineTo(stage.offsetX + stage.width, 200);
  ctx.stroke();
}

function setTime() {
  time._s++
  
  if (time._s > 100) {
    time.s++;
    time._s = 0;
  }
}

function drawTime() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#888";
  ctx.fillText(`${time.s}s`, 50, 30);
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#888";
  ctx.fillText(`Score: ${score}`, 350, 30);
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

function keyDownHandler(e) {
  var key = e.key;

  if (over && e.key === "Enter") {
    initActor(actor)
    initCactus(cactus)
    initTime(time)

    over = false;
    score = 0;

    interval = createInterval();
  }

  if (actor.jump) {
    return;
  }

  if (key === "ArrowUp") {
    actor.jump = true;
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// var num = 180
// var i = 5;

// while (true) {

//   num -= i;
  
//   if (i <= 0) {
//     break;
//   }
  
//   i -= 0.2
// }

// console.log(num);