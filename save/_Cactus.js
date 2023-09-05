var ctx = canvas.getContext("2d");

export default class Cactus {
  constructor(actor, stage, score, setOver) {
    this.cacti = [];
    this.count = 100;
    this._on = 0;
    this.on = 0;
    this.limit = 100; // 1s
    this.x = 450;
    this.y = 190;
    this.width = 10;
    this.height = 10;

    this.actor = actor;
    this.stage = stage;
    this.score = score;
    this.setOver = setOver;

    for (var i=0; i<this.count; i++) {
      var item = { 
        x: this.x, 
        y: this.y, 
        width: this.width, 
        height: this.height,
        active: false
      }
    
      this.cacti.push(item);
    }
  }

  set() {
    // cacti remains, so keep activing cacti.
    if (this.on < this.count - 1) {
      this._on++;
    
      if (this._on > this.limit) {
        this.on++;
        this._on = 0;
  
        // since last cactus, 0.5s - 1.5s
        this.limit = 50 + (Math.random() * 100);
        
        console.log(this.limit);
      }
  
      this.cacti[this.on].active = true;
    }
  
    for (var i = 0; i < this.cacti.length; i++) {
      // Deactive cactus
      if (this.cacti[i].x < this.stage.offsetX - 10) {
        this.cacti[i].active = false
      }
  
      // Game end
      var lastCactus = this.cacti[this.count - 1];
  
      if (lastCactus.x < this.stage.offsetX - 10 && !lastCactus.active) {
        end = true;
      }
  
      // make cactus move
      if (this.cacti[i].active) {
        this.cacti[i].x--;
      }
  
      // handle collision 
      var metLeft = this.cacti[i].x + this.cacti[i].width > this.actor.x
      var metRight = this.actor.x + this.actor.width > this.cacti[i].x
      var metY = this.actor.y + this.actor.height > this.cacti[i].y;
  
      if (metLeft && metRight && metY) {
        console.log('collided')
        this.setOver()
      }
  
      // Score
      if (this.actor.x === this.cacti[i].x) {
        this.score++;
      }
  
      // draw cactus
      this.draw(this.cacti[i]);
    }
  }

  draw(cactus) {
    ctx.fillStyle = "#f00"
    ctx.fillRect(cactus.x, cactus.y, cactus.width, cactus.height)
  }
}