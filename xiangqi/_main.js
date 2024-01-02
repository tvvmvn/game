(function () {
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

  const PIECES = [
    { id: 1, name: "zol", team: 1 },
    { id: 2, name: "ma", team: 1 },
    { id: 3, name: "zol", team: 2 },
    { id: 4, name: "ma", team: 2 },
  ]

  /* variables */

  var board;
  var row, col;
  var turn = 2;
  var start = false;
  var end;

  /* run the game */

  setInterval(run, 10); // 100hz

  function run() {
    clearCanvas();

    if (!start) {
      init();
      start = true;
      return;
    }

    drawBoard();
    drawPieces();

    if (end) {
      drawEnd();
    } else {
      drawTurn();
    }
  }

  function init() {
    board = [
      [0, 1, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 3, 0, 4],
    ]

    row = 0;
    col = 0;
    turn = 2;
    end = false;
  }

  /* functions */

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function getPieceById(id) {
    var piece;

    for (var i = 0; i < PIECES.length; i++) {
      if (PIECES[i].id == id) {
        piece = PIECES[i];
      }
    }

    return piece;
  }

  function setMa() {}


  function isTakeable(id) {
    if (!id) {
      return true;
    }

    var piece = getPieceById(id);

    if (piece.team != turn) {
      return true;
    }

    return false;
  }

  function setEnd() {
    end = true;

    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c < board[r].length; c++) {
        var id = board[r][c];

        if (id) {
          var piece = getPieceById(id);

          if (piece.team != turn) {
            end = false;
          }
        }
      }
    }
  }

  /* draw */

  function drawTurn() {
    var message = turn == 1 ? "HAN" : "CHO";

    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(message, 300, 100);
  }

  function drawEnd() {
    var message = (turn == 1 ? "HAN" : "CHO") + " WIN!";

    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(message, 300, 100);
  }

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
    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c < board[r].length; c++) {
        var id = board[r][c];

        if (id) {
          var piece = getPieceById(id);

          ctx.beginPath();
          ctx.arc(
            OFFSET_X + (c * CELL),
            OFFSET_Y + (r * CELL),
            (piece.name == "zol" ? 10 : 15),
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

        var a = Math.pow((e.offsetX - spot[0]), 2) + Math.pow((e.offsetY - spot[1]), 2);
        var b = Math.pow(CELL / 2, 2);

        if (a <= b) {
          var id = board[row][col];

          if (id) {
            var piece = getPieceById(id);

            if (piece.team == turn) {
              // move
              var takeable = isTakeable(board[r][c]);

              if (takeable) {
                board[row][col] = 0;
                board[r][c] = id;
  
                // check end
                setEnd();

                if (!end) {
                  turn = turn == 1 ? 2 : 1;  
                }
              }
            }
          }

          col = c;
          row = r;

          console.log(col, row);
        }
      }
    }
  }
})();