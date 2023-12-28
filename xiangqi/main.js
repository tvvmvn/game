var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.addEventListener("click", clickHandler)

/* constants */
const OFFSET_X = 50
const OFFSET_Y = 50
const SIZE = 150
const COUNT = 3
const CELL = SIZE / COUNT;
const SPOTS = [];
for (var r = 0; r <= COUNT; r++) {
  SPOTS[r] = [];

  for (var c = 0; c <= COUNT; c++) {
    SPOTS[r][c] = [OFFSET_X + (c * CELL), OFFSET_Y + (r * CELL)]
  }
}

/* variables */
var x, y;
var pieces = [
  { id: 1, name: "zol", team: 1 },
  { id: 2, name: "ma", team: 1 },
  { id: 3, name: "zol", team: 2 },
  { id: 4, name: "ma", team: 2 },
]

var board;
var selected;
var interval;

/* run the game */

startGame();

function startGame() {
  board = [
    [0, 1, 0, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 3, 0, 4],
  ]

  interval = setInterval(render);
}

function render() {
  clearCanvas();
  
  f();

  drawBoard();  
  drawPieces();
}

/* functions */

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getPieceById(id) {
  var piece = null;

  for (var i=0; i<pieces.length; i++) {
    if (pieces[i].id == id) {
      piece = pieces[i];
    }
  }

  return piece;
}

function f() {
  for (var r=0; r<board.length; r++) {
    for (var c=0; c<board[r].length; c++) {
      if (r == y && c == x) {
        var id = board[r][c];

        if (id) {
          selected = id;
        }
      }
    }
  }

  if (selected) {
    for (var r=0; r<board.length; r++) {
      for (var c=0; c<board[r].length; c++) {
        if (r == y && c == x) {
          var id = board[r][c];
  
          if (!id) {
            board[r][c] = selected;
          }
        }
      }
    }
  }
}

/* draw */

function drawBoard() {
  ctx.beginPath();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.globalAlpha = 1;

  // grid
  for (var r = 0; r <= COUNT; r++) {
    ctx.moveTo(OFFSET_X, OFFSET_Y + (CELL * r));
    ctx.lineTo(OFFSET_X + SIZE, OFFSET_Y + (CELL * r));
  }

  for (var c = 0; c <= COUNT; c++) {
    ctx.moveTo(OFFSET_X + (CELL * c), OFFSET_Y);
    ctx.lineTo(OFFSET_X + (CELL * c), OFFSET_Y + SIZE);
  }

  ctx.stroke();
}

function drawPieces() {
  for (var r=0; r<board.length; r++) {
    for (var c=0; c<board[r].length; c++) {
      var id = board[r][c];

      if (id) {
        var piece = getPieceById(id);

        if (selected == id) {
          ctx.globalAlpha = 0.5;
        } else {
          ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.arc(
          OFFSET_X + (c * CELL), 
          OFFSET_Y + (r * CELL), 
          (piece.name == "zol" ? 10 : 15 ), 
          0, 
          2 * Math.PI
        );
        ctx.fillStyle = piece.team == 1 ? "red" : "green";
        ctx.fill();
      }
    }
  }
}

/* control */

function clickHandler(e) {
  for (var r = 0; r <= COUNT; r++) {
    for (var c = 0; c <= COUNT; c++) {
      var spot = SPOTS[r][c]; // intersection

      var a = Math.pow((e.clientX - spot[0]), 2) + Math.pow((e.clientY - spot[1]), 2);
      var b = Math.pow(CELL / 2, 2);

      if (a <= b) {
        x = c;
        y = r;

        console.log(x, y)
      }
    }
  }
}