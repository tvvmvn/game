import Cactus from "../class/Cactus.js";

var ctx = canvas.getContext("2d");
var cacti = [];
var count = 100;
var limit = 100;

for (var i = 0; i < count; i++) {
  var cactus = new Cactus();

  cacti.push(cactus);
}

export default function setCacti(stage, actor, score, setOver) {
  // Activate cactus
  if (cactus.on < count - 1) {
    cactus._on++;

    if (cactus._on > limit) {
      cactus.on++;
      cactus._on = 0;

      // interval between cactus
      limit = 50 + (Math.random() * 100);

      console.log(limit);
    }

    cacti[cactus.on].active = true;
  }

  // Control each cactus
  for (var i = 0; i < cacti.length; i++) {
    // Deactive cactus
    if (cacti[i].x < stage.offsetX - 10) {
      cacti[i].active = false
    }

    // Game end
    var lastCactus = cacti[count - 1];

    if (lastCactus.x < stage.offsetX - 10 && !lastCactus.active) {
      end = true;
    }

    // make cactus move
    if (cacti[i].active) {
      cacti[i].x--;
    }

    // handle collision 
    var metLeft = cacti[i].x + cacti[i].width > actor.x
    var metRight = actor.x + actor.width > cacti[i].x
    var metY = actor.y + actor.height > cacti[i].y;

    if (metLeft && metRight && metY) {
      console.log('collided')
      setOver()
    }

    // Score
    if (actor.x === cacti[i].x) {
      score++;
    }

    // draw cactus
    ctx.fillStyle = "#f00"
    ctx.fillRect(cacti[i].x, cacti[i].y, cacti[i].width, cacti[i].height)
  }
}