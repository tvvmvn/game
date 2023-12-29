(function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.addEventListener("click", clickHandler)

  /* constants */
  const OFFSET_X = 50;
  const OFFSET_Y = 50;
  const SIZE = 200
  const COUNT = 4
  const CELL = SIZE / COUNT;
  const CHECKER = [];

  for (var r = 0; r < COUNT; r++) {
    CHECKER[r] = [];

    for (var c = 0; c < COUNT; c++) {
      if ((r + c) % 2) {
        CHECKER[r][c] = 1;
      } else {
        CHECKER[r][c] = 0;
      }
    }
  }

  /* variables */
  var pieces = [
    { id: 1, name: "zol", team: 1 },
    { id: 2, name: "ma", team: 1 },
    { id: 3, name: "zol", team: 2 },
    { id: 4, name: "ma", team: 2 },
  ]

  var board;
  var row = 0;
  var col = 0;
  var turn = 2;
  var interval;

  /* run the game */

  startGame();

  function startGame() {
    board = [
      [1, 0, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 3, 0, 4],
    ]

    interval = setInterval(render);
  }

  function render() {
    clearCanvas();

    f();

    drawTurn();
    drawBoard();
    drawPieces();
  }

  /* functions */

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function getPieceById(id) {
    var piece = null;

    for (var i = 0; i < pieces.length; i++) {
      if (pieces[i].id == id) {
        piece = pieces[i];
      }
    }

    return piece;
  }

  function f() {}

  /* draw */

  function drawTurn() {
    var message = turn == 1 ? "W" : "B";

    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(message, 300, 50);
  }

  function drawBoard() {
    for (var r = 0; r < CHECKER.length; r++) {
      for (var c = 0; c < CHECKER[r].length; c++) {
        if (CHECKER[r][c] == 1) {
          ctx.fillStyle = "#555";
        } else {
          ctx.fillStyle = "#ddd";
        }
        ctx.fillRect(
          OFFSET_X + (CELL * c),
          OFFSET_Y + (CELL * r),
          CELL, CELL
        );
      }
    }
  }

  function drawPieces() {
    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c < board[r].length; c++) {
        var id = board[r][c];

        if (id) {
          var piece = getPieceById(id);

          ctx.beginPath();
          ctx.arc(
            OFFSET_X + (c * CELL) + (CELL / 2),
            OFFSET_Y + (r * CELL) + (CELL / 2),
            15,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = piece.team == 1 ? "#fff" : "#000";
          ctx.fill();
        }
      }
    }
  }

  function setEnd() {
    var end = true;

    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c < board[r].length; c++) {
        var id = board[r][c];

        if (id) {
          var piece = getPieceById(id);

          if (piece.team == turn) {
            end = false;
          }
        }
      }
    }
    
    if (end) {
      console.log(turn + " WIN!");
    }
  }

  /* control */

  function v(piece, row_d, col_d) {
    var p = getPieceById(board[row_d][col_d])

    if (p && p.team == turn) return 0;

    // define movement 

    return 1;
  }

  function clickHandler(e) {
    var r = Math.floor((e.clientY - OFFSET_Y) / CELL);
    var c = Math.floor((e.clientX - OFFSET_X) / CELL);

    if (r < COUNT && c < COUNT) {
      var id = board[row][col];

      if (id) {
        var piece = getPieceById(id);

        if (piece.team == turn) {
          // validate
          var takeable = v(piece, r, c);

          if (takeable) {
            // move
            var tmp = board[row][col];
            board[row][col] = 0;
            board[r][c] = tmp;

            // change turn
            turn = turn == 1 ? 2 : 1;

            // check end
            setEnd();
          }
        }
      }

      col = c;
      row = r;

      console.log(col, row);
    }
  }
})()