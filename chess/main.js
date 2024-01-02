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
  
  const PIECES = [
    { id: 1, name: "knight", team: 1 },
    { id: 2, name: "pawn", team: 1 },
    { id: 3, name: "knight", team: 2 },
    { id: 4, name: "pawn", team: 2 },
  ]

  /* variables */
  
  var board;
  var row, col;
  var prevRow, prevCol;
  var selected = null;
  var turn = 2;
  var start = false;
  var end;

  /* run the game */

  setInterval(run, 10); // 100hz

  function run() {
    clearCanvas();

    if (!start) {
      initialize();
      start = true;
    }

    f();
    
    drawBoard();    
    drawPieces();
    
    if (end) {
      drawEnd();
    } else {
      drawTurn();
    }
  }

  function initialize() {
    board = [
      [0, 1, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 3, 0, 4],
    ]
    row = 0;
    col = 0;
    prevRow = row;
    prevCol = col;
    turn = 2;
    end = false;
  }

  /* functions */
  
  function getPieceById(id) {
    var piece;
    
    for (var i = 0; i < PIECES.length; i++) {
      if (PIECES[i].id == id) {
        piece = PIECES[i];
      }
    }

    return piece;
  }

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

  function f() {
    if (!selected) {
      // select piece to move
      var id = board[row][col];
  
      if (!id) return;
  
      var piece = getPieceById(id);
  
      if (piece.team == turn) {
        selected = id;
      } else {
        return;
      }
    } else {
      // move
      if (prevRow != row || prevCol != col) {
        if (board[row][col] != 0) {
          var target = getPieceById(board[row][col]);
  
          if (target.team == turn) {
            selected = target.id;
            prevRow = row;
            prevCol = col;
            return;
          }
        }

        board[prevRow][prevCol] = 0;
        board[row][col] = selected;
  
        turn = turn == 1 ? 2 : 1;
        selected = null;
      }
    }

    // save prev
    prevRow = row;
    prevCol = col;
  }

  /* control */
  
  function clickHandler(e) {
    if (!start) {
      start = true;
      return;
    }

    if (end) {
      start = false;
      return;
    }

    var r = Math.floor((e.offsetY - OFFSET_Y) / CELL);
    var c = Math.floor((e.offsetX - OFFSET_X) / CELL);
    
    if (r > -1 && r < COUNT && c > -1 && c < COUNT) {
      row = r;
      col = c;

      console.log(row, col);
    }
  }

  /* draw */

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
            ((id == board[row][col] && piece.team == turn) ? 20 : 15),
            0,
            2 * Math.PI
          );
          ctx.fillStyle = piece.team == 1 ? "#fff" : "#000";
          ctx.fill();
        }
      }
    }
  }

  function drawStart() {
    var message = "Touch or click to start";

    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(message, 300, 100);
  }

  function drawTurn() {
    var message = turn == 1 ? "W" : "B";

    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(message, 300, 100);
  }

  function drawEnd() {
    var message = (turn == 1 ? "W" : "B") + " WIN!";

    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(message, 300, 100);
  }
})()