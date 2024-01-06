(function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.addEventListener("click", clickHandler)

  /* struct */

  class Piece {
    constructor (id, name, src, team) {
      this.id = id;
      this.name = name;
      this.src = src;
      this.team = team;
    }
  }

  /* constants */

  // team
  const WHITE = 1;
  const BLACK = 2;

  // pieces
  const KING = 0;
  const QUEEN = 1;
  const BISHOP = 2;
  const KNIGHT = 3;
  const ROOK = 4;
  const PAWN = 5;

  // board
  const OFFSET_X = 50;
  const OFFSET_Y = 50;
  const SIZE = 400;
  const COUNT = 8;
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
    new Piece(1, KING, "♔", WHITE), // user 1
    new Piece(2, QUEEN, "♕", WHITE),
    new Piece(3, BISHOP, "♗", WHITE),
    new Piece(4, BISHOP, "♗", WHITE),
    new Piece(5, KNIGHT, "♘", WHITE),
    new Piece(6, KNIGHT, "♘", WHITE),
    new Piece(7, ROOK, "♖", WHITE),
    new Piece(8, ROOK, "♖", WHITE),
    new Piece(9, PAWN, "♙", WHITE),
    new Piece(10, PAWN, "♙", WHITE),
    new Piece(11, PAWN, "♙", WHITE),
    new Piece(12, PAWN, "♙", WHITE),
    new Piece(13, PAWN, "♙", WHITE),
    new Piece(14, PAWN, "♙", WHITE),
    new Piece(15, PAWN, "♙", WHITE),
    new Piece(16, PAWN, "♙", WHITE),
    new Piece(17, KING, "♚", BLACK), // user 2
    new Piece(18, QUEEN, "♛", BLACK),
    new Piece(19, BISHOP, "♝", BLACK),
    new Piece(20, BISHOP, "♝", BLACK),
    new Piece(21, KNIGHT, "♞", BLACK),
    new Piece(22, KNIGHT, "♞", BLACK),
    new Piece(23, ROOK, "♜", BLACK),
    new Piece(24, ROOK, "♜", BLACK),
    new Piece(25, PAWN, "♟", BLACK),
    new Piece(26, PAWN, "♟", BLACK),
    new Piece(27, PAWN, "♟", BLACK),
    new Piece(28, PAWN, "♟", BLACK),
    new Piece(29, PAWN, "♟", BLACK),
    new Piece(30, PAWN, "♟", BLACK),
    new Piece(31, PAWN, "♟", BLACK),
    new Piece(32, PAWN, "♟", BLACK),
  ]

  /* variables */
  
  var board;
  var row, col;
  var prevRow, prevCol;
  var pieceId;
  var targetId;
  var turn;
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
      [23, 21, 19, 18, 17, 20, 22, 24],
      [25, 26, 27, 28, 29, 30, 31, 32],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [9, 10, 11, 12, 13, 14, 15, 16],
      [7, 5, 9, 2, 1, 4, 6, 8],
    ]
    row = 0;
    col = 0;
    prevRow = row;
    prevCol = col;
    turn = 1;
    message = "";
    pieceId = null;
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
    if (!pieceId) {
      var id = board[row][col];
      
      if (id) {
        // select piece to move
        var piece = getPieceById(id);
    
        if (piece.team == turn)  {
          pieceId = id;
        }
      }
    } else {
      if (prevRow != row || prevCol != col) {
        // case 1: change piece to move
        var piece = getPieceById(pieceId);
        targetId = board[row][col]; // target id
        var changed = false;

        if (targetId) {
          var target = getPieceById(targetId);
          
          if (target.team == piece.team) {
            pieceId = targetId;
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
          board[row][col] = pieceId;
    
          turn = turn == 1 ? 2 : 1;
          pieceId = null;
        }
      }

      // save current crds of piece
      prevRow = row;
      prevCol = col;
    }
  }

  function v() {
    var piece = getPieceById(pieceId);
    var target = targetId ? getPieceById(targetId) : null;
    var takeable = false;

    if (piece.name == PAWN) {
      if (piece.team == 1) {
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

      if (piece.team == 2) {
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
    } 
    
    if (piece.name == KNIGHT) {
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

          if (id == pieceId) {
            ctx.globalAlpha = 0.6;
          }

          ctx.beginPath();
          ctx.arc(
            OFFSET_X + (c * CELL) + (CELL / 2),
            OFFSET_Y + (r * CELL) + (CELL / 2),
            15,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = piece.team == WHITE ? "#fff" : "#000";
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
    ctx.fillText("Turn: " + message, 300, 20);
  }

  function drawMessage() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(message, 300, 40);
  }

  function drawEnd() {
    var message = (turn == 1 ? "W" : "B") + " WIN!";

    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(message, 300, 60);
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

