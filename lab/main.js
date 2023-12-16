const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.backgroundColor = "#333";

/* constants */

const OFFSET_X = 20;
const OFFSET_Y = 20;
const ROW_COUNT = 9;
const COL_COUNT = 8;
const WIDTH = 460;
const HEIGHT = 345;
const CELL_WIDTH = WIDTH / COL_COUNT;
const CELL_HEIGHT = HEIGHT / ROW_COUNT;

/* variables */

var x = 0;
var y = 0;
var key;
var points = [];

var pieces = [
  { name: "zol", x: 0, y: 6, size: 10 },
  { name: "zol", x: 2, y: 6, size: 10 },
  { name: "zol", x: 4, y: 6, size: 10 },
  { name: "zol", x: 6, y: 6, size: 10 },
  { name: "zol", x: 8, y: 6, size: 10 },
  { name: "po", x: 1, y: 7, size: 15 },
  { name: "po", x: 7, y: 7, size: 15 },
  { name: "cha", x: 0, y: 9, size: 15 },
  { name: "cha", x: 8, y: 9, size: 15 },
  { name: "sang", x: 1, y: 9, size: 15 },
  { name: "sang", x: 7, y: 9, size: 15 },
  { name: "ma", x: 2, y: 9, size: 15 },
  { name: "ma", x: 6, y: 9, size: 15 },
  { name: "sa", x: 3, y: 9, size: 10 },
  { name: "sa", x: 5, y: 9, size: 10 },
  { name: "gung", x: 4, y: 8, size: 25 },
]

var spots = [];
var x = 0;
var y = 0;

for (var r = 0; r <= ROW_COUNT; r++) {
  spots[r] = [];

  for (var c = 0; c <= COL_COUNT; c++) {
    spots[r][c] = { 
      x: OFFSET_X + (c * CELL_WIDTH), 
      y: OFFSET_Y + (r * CELL_HEIGHT)
    }
  }
}

addEventListener("click", clickHandler);

/* run the game */

setInterval(interval, 10);

function interval() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  setPieces();
  setPoints();

  {
    drawCursor();
  }

  ctx.globalAlpha = 1;
}

/* functions */

function setPoints() {
  var target;
  
  for (var i=0; i<pieces.length; i++) {
    if (x == pieces[i].x && y == pieces[i].y) {
      target = pieces[i];
    } 
  }

  if (target) {
    if (target.name == "zol") {
      points = [
        [target.x, target.y - 1],
        [target.x - 1, target.y],
        [target.x + 1, target.y],
      ]
    }
  
    if (target.name == "ma") {    
      points = [
        [target.x - 1, target.y - 2],
        [target.x + 1, target.y - 2],
        [target.x + 2, target.y - 1],
        [target.x + 2, target.y + 1],
        [target.x - 1, target.y + 2],
        [target.x + 1, target.y + 2],
        [target.x - 2, target.y - 1],
        [target.x - 2, target.y + 1],
      ]
    }
  
    if (target.name == "cha") {
      points = [];

      // front
      for (var i = target.y - 1; i >= 0; i--) {
        points.push([target.x, i]);
      }
      // back
      for (var i = target.y + 1; i <= ROW_COUNT; i++) {
        points.push([target.x, i]);
      }
      // right
      for (var i = target.x + 1; i <= COL_COUNT; i++) {
        points.push([i, target.y]);
      }
      // left
      for (var i = target.x - 1; i >=0; i--) {
        points.push([i, target.y]);
      }
    }
  
    if (target.name == "sang") {
      points = [];
    }
  
    if (target.name == "po") {
      points = [];
    }
  
    if (target.name == "sa") {
      points = [];
    }
  
    if (target.name == "gung") {
      points = [];
    }
  
    for (var i=0; i<points.length; i++) {
      drawPoint(points[i][0], points[i][1]);
    }
  } 
}

function setJump() {}

function setPieces() {
  for (var i=0; i<pieces.length; i++) {
    var piece = pieces[i];

    drawPiece(piece);
  }

}

for (var i=0; i<points.length; i++) {
  if (x == points[i].x && y == points[i].y) {
    
  }
}

/* draw */

function drawPiece(piece) {
  // ctx.globalAlpha = 0.5
  ctx.beginPath();
  ctx.arc(
    OFFSET_X + (piece.x * CELL_WIDTH), OFFSET_Y + (piece.y * CELL_HEIGHT),
    piece.size, 0, 2 * Math.PI
  );
  ctx.fillStyle = "#ddd";
  ctx.fill();
}

function drawPoint(x, y) {
  ctx.beginPath();
  ctx.strokeStyle = "#f00";
  ctx.lineWidth = 2;
  ctx.arc(
    OFFSET_X + (x * CELL_WIDTH), 
    OFFSET_Y + (y * CELL_HEIGHT),
    10, 0, 2 * Math.PI
  );
  ctx.stroke();
}

function drawBoard() {
  ctx.beginPath();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;

  // grid
  for (var r = 0; r <= ROW_COUNT; r++) {
    ctx.moveTo(OFFSET_X, OFFSET_Y + (CELL_HEIGHT * r));
    ctx.lineTo(OFFSET_X + WIDTH, OFFSET_Y + (CELL_HEIGHT * r));
  }

  for (var c = 0; c <= COL_COUNT; c++) {
    ctx.moveTo(OFFSET_X + (CELL_WIDTH * c), OFFSET_Y);
    ctx.lineTo(OFFSET_X + (CELL_WIDTH * c), OFFSET_Y + HEIGHT);
  }

  // cross around king area
  ctx.moveTo(OFFSET_X + (CELL_WIDTH * 3), OFFSET_Y + (CELL_HEIGHT * 0));
  ctx.lineTo(OFFSET_X + (CELL_WIDTH * 5), OFFSET_Y + (CELL_HEIGHT * 2));

  ctx.moveTo(OFFSET_X + (CELL_WIDTH * 5), OFFSET_Y + (CELL_HEIGHT * 0));
  ctx.lineTo(OFFSET_X + (CELL_WIDTH * 3), OFFSET_Y + (CELL_HEIGHT * 2));

  ctx.moveTo(OFFSET_X + (CELL_WIDTH * 3), OFFSET_Y + (CELL_HEIGHT * 7));
  ctx.lineTo(OFFSET_X + (CELL_WIDTH * 5), OFFSET_Y + (CELL_HEIGHT * 9));

  ctx.moveTo(OFFSET_X + (CELL_WIDTH * 5), OFFSET_Y + (CELL_HEIGHT * 7));
  ctx.lineTo(OFFSET_X + (CELL_WIDTH * 3), OFFSET_Y + (CELL_HEIGHT * 9));
  
  ctx.stroke();
}

function drawCursor() {
  ctx.beginPath();
  ctx.strokeStyle = "#00f";
  ctx.lineWidth = 2;
  ctx.arc(
    OFFSET_X + (x * CELL_WIDTH), 
    OFFSET_Y + (y * CELL_HEIGHT),
    10, 0, 2 * Math.PI
  );
  ctx.stroke();
}

/* control */

function clickHandler(e) {
  for (var r = 0; r <= ROW_COUNT; r++) {
    for (var c = 0; c <= COL_COUNT; c++) {
      var spot = spots[r][c]; // intersection

      var a = Math.pow((e.clientX - spot.x), 2) + Math.pow((e.clientY - spot.y), 2);
      var b = Math.pow(CELL_HEIGHT / 2, 2);

      if (a <= b) {
        // target
        console.log("selected:", x, y);
        x = c;
        y = r;
      } 
    }
  }
}

