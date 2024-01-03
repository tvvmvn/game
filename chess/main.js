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
    { id: 1, name: "pawn", team: 1 },
    { id: 2, name: "knight", team: 1 },
    { id: 3, name: "pawn", team: 2 },
    { id: 4, name: "knight", team: 2 },
  ]

  /* variables */
  
  var board;
  var row, col;
  var prevRow, prevCol;
  var selected;
  var turn = 2;
  var start = false;
  var end;
  var message;

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
    drawMessage();
    
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
    message = "";
    selected = null;
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
      var id = board[row][col];
      
      if (id) {
        // select piece to move
        var piece = getPieceById(id);
    
        if (piece.team == turn)  {
          selected = id;
        }
      }
    } else {
      if (prevRow != row || prevCol != col) {
        // case 1: change piece to move
        var piece = getPieceById(selected);
        var targetId = board[row][col]; // target id
        var changed = false;

        if (targetId) {
          var target = getPieceById(targetId);
          
          if (target.team == piece.team) {
            selected = targetId;
            changed = true;
          }
        } 

        // case 2: movement
        if (!changed) {
          var takeable = v();
          
          // move
          if (!takeable) {
            message = "untakeable";
            return;
          } else {
            message = "";
          }

          board[prevRow][prevCol] = 0;
          board[row][col] = selected;
    
          turn = turn == 1 ? 2 : 1;
          selected = null;
        }
      }

      // save current crds of piece
      prevRow = row;
      prevCol = col;
    }
  }

  function v() {
    var piece = getPieceById(selected);
    var takeable = false;

    if (piece.name == "pawn") {
      if (piece.team == 1) {
        if (row == prevRow + 1 && col == prevCol - 1) {
          takeable = true;
        }
  
        if (row == prevRow + 1 && col == prevCol + 1) {
          takeable = true;
        }

        if (row == prevRow + 1 && col == prevCol) {
          if (board[row][col] == 0) {
            takeable = true;
          }
        }
      }

      if (piece.team == 2) {
        if (row == prevRow - 1 && col == prevCol - 1) {
          takeable = true;
        }
  
        if (row == prevRow - 1 && col == prevCol + 1) {
          takeable = true;
        }

        if (row == prevRow - 1 && col == prevCol) {
          if (board[row][col] == 0) {
            takeable = true;
          }
        }
      }
    } 
    
    if (piece.name == "knight") {
      takeable = true;
    }

    return takeable;
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

          if (id == selected) {
            ctx.globalAlpha = 0.6;
          }

          ctx.beginPath();
          ctx.arc(
            OFFSET_X + (c * CELL) + (CELL / 2),
            OFFSET_Y + (r * CELL) + (CELL / 2),
            (piece.name == "pawn" ? 15 : 20),
            0,
            2 * Math.PI
          );
          ctx.fillStyle = piece.team == 1 ? "#fff" : "#000";
          ctx.fill();

          ctx.globalAlpha = 1.0
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
    ctx.fillText("Turn: " + message, 300, 100);
  }

  function drawMessage() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(message, 300, 120);
  }

  function drawEnd() {
    var message = (turn == 1 ? "W" : "B") + " WIN!";

    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(message, 300, 100);
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
})();

