import { Direction } from "./enums/Direction.js";

export var grid = {
  offsetX: 50,
  offsetY: 50,
  width: 400,
  height: 300,
  rowCount: 15,
  colCount: 20,
  cell: 20,
}

export var snake = {
  x: grid.offsetX + (grid.cell * 2),
  y: grid.offsetY,
  _x: 0,
  _y: 0,
  width: grid.cell,
  height: grid.cell,
  movingPoint: 20,
  node: [
    { x: grid.offsetX + (grid.cell * 2), y: grid.offsetY },
    { x: grid.offsetX + (grid.cell * 1), y: grid.offsetY },
    { x: grid.offsetX, y: grid.offsetY }
  ],
  dir: Direction.RIGHT,
  color: "#0a0"
}

export var apple = {
  x: grid.offsetX + 100,
  y: grid.offsetY + 100,
  width: 20,
  height: 20,
  count: 20,
  eaten: false,
  color: "#f00"
};

export var time = {
  _s: 0,
  s: 0,
};

export var misc = {
  start: false,
  over: false,
  end: false
}

export var json = JSON.stringify({ grid, snake, apple, time, misc });

