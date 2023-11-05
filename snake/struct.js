class Snake {
  x;
  y;
  _x;
  _y;
  size;
  movingPoint;
  node;
  dir;
  color;

  constructor(x, y, _x, _y, size, movingPoint, node, dir, color) {
    this.x = x;
    this.y = y;
    this._x =_x;
    this._y = _y;
    this.size = size;
    this.movingPoint = movingPoint;
    this.node = node;
    this.dir = dir;
    this.color = color;
  }
}

var snake = new Snake(
  Grid.OFFSET_X + (Grid.CELL * 2),
  Grid.OFFSET_Y,
  0,
  0,
  Grid.CELL,
  20,
  [
    [Grid.OFFSET_X + (Grid.CELL * 2), Grid.OFFSET_Y],
    [Grid.OFFSET_X + (Grid.CELL * 1), Grid.OFFSET_Y],
    [Grid.OFFSET_X, Grid.OFFSET_Y]
  ],
  Direction.RIGHT,
  "#0a0"
);

class Apple {
  constructor(x, y, size, count, eaten, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.count = count;
    this.eaten = eaten;
    this.color = color;
  }
}

var apple = new Apple(
  Grid.OFFSET_X + 100,  
  Grid.OFFSET_Y + 100,  
  20,
  20,
  false,
  "#f00"
)

