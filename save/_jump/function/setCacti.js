var ctx = canvas.getContext("2d");
var count = 100;
var limit = 100;
var _on = 0;
var on = 0;


var img = new Image();
img.src = "./t-rex-background.png";
function drawBackground() {
  ctx.drawImage(img, on, 0)
}

export default function setCacti(cacti, stage, actor, setScore, setOver) {
  // Activate cactus
  if (on < count - 1) {
    _on++;

    if (_on > limit) {
      on++;
      _on = 0;

      // interval between cactus
      limit = 50 + (Math.random() * 100);

      console.log(limit);
    }

    cacti[on].active = true;
  }

  // Control each cactus
  for (var i = 0; i < cacti.length; i++) {
    // Deactivate cactus
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

    drawBackground(cacti[i].x)

    // handle collision 
    var metLeft = cacti[i].x + cacti[i].width > actor.x
    var metRight = actor.x + actor.width > cacti[i].x
    var metY = actor.y + actor.height > cacti[i].y;

    if (metLeft && metRight && metY) {
      console.log('collided')
      setOver()
      
      limit = 100;
      _on = 0;
      on = 0;
    }
  
    // Score
    if (actor.x === cacti[i].x) {
      setScore();
    }

    // draw cactus
    ctx.fillStyle = "#f00"
    ctx.fillRect(cacti[i].x, cacti[i].y, cacti[i].width, cacti[i].height)
  }
}