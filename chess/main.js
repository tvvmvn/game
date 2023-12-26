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


  /* variables */
  var board = [
    [
      null,
      { id: 3, team: 2, status: 1, active: false }, 
      null, 
      { id: 4, team: 2, status: 1, active: false },
    ],
    [null, null, null, null],
    [null, null, null, null],
    [
      { id: 1, team: 1, status: 1, active: false }, 
      null, 
      { id: 2, team: 1, status: 1, active: false },
      null,
    ]
  ]

  var interval;
  var x, y;
  var points;
  var turn = 1;
  var selected;

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

  var input;

  function f() {
    for (var r=0; r<board.length; r++) {
      for (var c=0; c<board[r].length; c++) {
        var piece = board[r][c];

        if (piece.active) {
          if (c == x && r == y) {
            
          }
        }

        if (piece) {
          if (c == x && r == y) {
            piece.active = true;
          } else {
            piece.active = false;
          }
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
    for (var r=0; r<board.length; r++) {
      for (var c=0; c<board[r].length; c++) {
        var piece = board[r][c];
        
        if (piece) {
          ctx.font = "24px Arial";
          ctx.fillStyle = piece.active ? "#f00" : "#000";
          ctx.fillText(piece.id, c * Board.CELL, (r * Board.CELL) + Board.CELL);
        }
      }
    }
  }

  /* control */

  function clickHandler(e) {
    x = Math.floor(e.clientX / Board.CELL) - Board.OFFSET_X;
    y = Math.floor(e.clientY / Board.CELL) - Board.OFFSET_Y;

    console.log(x, y);
  }
})();