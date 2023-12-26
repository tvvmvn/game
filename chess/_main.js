(function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.backgroundColor = "#eee";

  /* constants */

  const Board = {
    OFFSET_X: 0,
    OFFSET_Y: 0,
    SIZE: 320,
    COUNT: 8,
    CELL: 40 // size / count
  }

  const CHECKER = [];

  for (var r = 0; r < Board.COUNT; r++) {
    CHECKER[r] = [];

    for (var c = 0; c < Board.COUNT; c++) {
      if ((r + c) % 2) {
        CHECKER[r][c] = 1;
      } else {
        CHECKER[r][c] = 0;
      }
    }
  }

  /* class */

  class Piece {
    constructor (id, name, team, crds, status, active) {
      this.id = id;
      this.name = name;
      this.team = team;
      this.crds = crds;
      this.status = status;
      this.active = active;
    }
 
    getPoints() {
      return [
        [this.crds[0] - 1, this.crds[1] - 1],
        [this.crds[0] + 1, this.crds[1] - 1],
      ]
    }
  }

  /* variables */
  var pieces = [
    new Piece("", "pawn", 2, [1, 1], 1, false),
    new Piece("", "pawn", 2, [4, 1], 1, false),
    new Piece("", "pawn", 2, [7, 1], 1, false),
    new Piece("", "pawn", 1, [1, 6], 1, false),
    new Piece("", "pawn", 1, [4, 6], 1, false),
    new Piece("", "pawn", 1, [7, 6], 1, false),
  ]

  var interval;
  var x, y;
  var points;
  var turn = 1;

  /* run the game */

  startGame();
  document.addEventListener("click", clickHandler);

  function startGame() {
    x, y = -1;
    points = [];

    interval = setInterval(render, 10);
  }

  function render() {
    clearCanvas();

    f();

    drawStage();
    drawPieces();
    drawPoints();
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* functions */

  function f() {
    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];

      // 1
      if (piece.active) {
        if (piece.team == 1) {
          points = [
            [piece.crds[0] - 1, piece.crds[1] - 1],
            [piece.crds[0] + 1, piece.crds[1] - 1],
          ]
        } else {
          points = [
            [piece.crds[0] - 1, piece.crds[1] + 1],
            [piece.crds[0] + 1, piece.crds[1] + 1],
          ]
        }

        for (var j = 0; j < points.length; j++) {
          var point = points[j];
          
          if (point[0] == x && point[1] == y) {
            piece.crds = [x, y];

            // after move
            turn = turn == 1 ? 2 : 1;
            points = []
            piece.active = false;
          }
        }
      } 

      // 2
      if (piece.team == turn) {
        if (piece.crds[0] == x && piece.crds[1] == y) {
          piece.active = true;
        } else {
          piece.active = false;
        }
      }
    }
  }

  /* draw */

  function drawPoints() {
    for (var i=0; i<points.length; i++) {
      ctx.beginPath();
      ctx.strokeStyle = "#f00";
      ctx.lineWidth = 2;
      ctx.arc(
        Board.OFFSET_X + (points[i][0] * Board.CELL) + Board.CELL / 2,
        Board.OFFSET_Y + (points[i][1] * Board.CELL) + Board.CELL / 2,
        10, 0, 2 * Math.PI
      );
      ctx.stroke();
    }
  }

  function drawStage() {
    for (var r = 0; r < CHECKER.length; r++) {
      for (var c = 0; c < CHECKER[r].length; c++) {
        if (CHECKER[r][c] == 1) {
          ctx.fillStyle = "#555";
        } else {
          ctx.fillStyle = "#ddd";
        }
        ctx.fillRect(
          Board.OFFSET_X + (Board.CELL * c),
          Board.OFFSET_Y + (Board.CELL * r),
          Board.CELL, Board.CELL
        );
      }
    }
  }

  function drawPieces() {
    for (var i=0; i<pieces.length; i++) {
      var piece = pieces[i];

      ctx.beginPath();
      ctx.arc(
        Board.OFFSET_X + (piece.crds[0] * Board.CELL) + Board.CELL / 2,
        Board.OFFSET_Y + (piece.crds[1] * Board.CELL) + Board.CELL / 2,
        piece.active ? 15 : 10,
        0, 2 * Math.PI
      );
      ctx.fillStyle = piece.team == 1 ? "#000" : "#fff";
      ctx.fill();
    }
  }

  /* control */

  function clickHandler(e) {
    x = Math.floor(e.clientX / Board.CELL) - Board.OFFSET_X;
    y = Math.floor(e.clientY / Board.CELL) - Board.OFFSET_Y;

    console.log(x, y);
  }
})();