export class Snake {
  x;
  y;
  _x;
  _y;
  movingPoint;
  node;
  dir;
  grid;

  constructor(grid) {
    this.x = grid.offsetX + (grid.cell * 2);
    this.y = grid.offsetY;
    this._x = 0;
    this._y = 0;
    this.width = 20;
    this.height = 20;
    this.movingPoint = 20;
    this.node = [
      { x: grid.offsetX + (grid.cell * 2), y: grid.offsetY },
      { x: grid.offsetX + (grid.cell * 1), y: grid.offsetY },
      { x: grid.offsetX, y: grid.offsetY }
    ]
    this.dir = "right";
    this.grid = grid;
  }
  
  move() {
    // body
    for (var j = this.node.length - 1; j > 0; j--) {
      this.node[j].x = this.node[j - 1].x;
      this.node[j].y = this.node[j - 1].y;
    }
    
    // head
    this.node[0].x = this.x;
    this.node[0].y = this.y;
  }
  
  set(grid) {
    if (this.dir === "right") {
      this._x++;
      if (this._x > this.movingPoint) {
        this.x += grid.cell;
        this._x = 0;
      }
    }
  
    if (this.dir === "down") {
      this._y++;
      if (this._y > this.movingPoint) {
        this.y += grid.cell;
        this._y = 0;
      }
    }
  
    if (this.dir === "left") {
      this._x--;
      if (this._x < -this.movingPoint) {
        this.x -= grid.cell;
        this._x = 0;
      }
    }
  
    if (this.dir === "up") {
      this._y--;
      if (this._y < -this.movingPoint) {
        this.y -= grid.cell;
        this._y = 0;
      }  
    }
  }
  
  draw(ctx) {
    for (var i = 0; i < this.node.length; i++) {
      ctx.fillStyle = "#0a0"
      ctx.fillRect(this.node[i].x, this.node[i].y, this.width, this.height);
    }
  
    // snake x, y
    ctx.fillStyle = "#00f"
    ctx.fillRect(this.x, this.y, 5, 5); 
  }

  static crashItself(snake) {
    var value = false;
  
    for (var h = 3; h < snake.node.length; h++) {
      if (snake.x === snake.node[h].x && snake.y === snake.node[h].y) {
        value = true
      }
    }
  
    return value;
  }
  
  static crashInWall(grid) {
    var leftCrash = this.x < grid.offsetX
    var rightCrash = this.x + grid.cell > grid.offsetX + grid.width;
    var topCrash = this.y < grid.offsetY;
    var bottomCrash = this.y + grid.cell > grid.offsetY + grid.height;
  
    if (leftCrash || rightCrash || topCrash || bottomCrash) {
      return true
    }
  
    return false;
  }
};
