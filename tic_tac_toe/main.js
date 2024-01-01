(function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;
  canvas.addEventListener("click", clickHandler);
  var image = new Image();
  image.src = "./bg.png";

  /* constants  */

  const GRID_SIZE = 300;
  const GRID_OFFSET_X = 100;
  const GRID_OFFSET_Y = 150;
  const GRID_ITEM_COUNT = 3;
  const GRID_ITEM_SIZE = GRID_SIZE / GRID_ITEM_COUNT;
  const USER = 1;
  const COM = 2;

  /* variables */

  var board;
  var target;
  var start;
  var result;
  var winner;
  var turn;
  var lot = false;
  var row, col;

  /* run the game */
    
  setInterval(run, 10);
    
  function run() {
    clearCanvas();
    drawBg();

    if (!start) {
      initialize();
      return;
    }

    getResult();
    drawSymbol();

    if (result) {
      drawResult();
    } else {
      if (turn == COM) {
        setTimeout(com, 1000);
        turn = null;
      }
    }
  }

  function drawBg() {
    // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(image, 0, 0, 500, 500, 0, 0, 500, 500);
  }

  function initialize() {
    result = null;
    winner = null;
    board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]

    if (!lot) {
      turn = Math.ceil(Math.random() * 2);
      lot = true;
    }

    var message = (turn == USER ? "YOU" : "COM") + " First, Ready?";
    
    drawMessage(message);
  }

  /* functions */

  function com() {
    setAlg();

    if (target != null) { 
      var [tr, tc] = target;
      board[tr][tc] = COM;
      target = null;
    } else {
      while (true) {
        var r = Math.floor(Math.random() * 3);
        var c = Math.floor(Math.random() * 3);

        if (result) {
          break;
        }

        if (board[r][c] == 0) {
          board[r][c] = COM;
          break;
        }
      }
    }

    turn = USER;
  }

  function setAlg() {
    fill_hole([0, 1], [1, 1], [2, 1]);
    fill_hole([1, 0], [1, 1], [1, 2]);
    fill_hole([2, 0], [1, 1], [0, 2]);
    fill_hole([0, 0], [1, 1], [2, 2]);

    fill_hole([0, 0], [0, 1], [0, 2]);
    fill_hole([0, 0], [1, 0], [2, 0]);
    fill_hole([2, 0], [2, 1], [2, 2]);
    fill_hole([0, 2], [1, 2], [2, 2]);
  }

  function fill_hole([r1, c1], [r2, c2], [r3, c3]) {
    if (
      board[r2][c2] != 0
      && board[r2][c2] == board[r3][c3]
      && board[r1][c1] == 0
    ) {
      target = [r1, c1];
    } else if (
      board[r1][c1] != 0
      && board[r1][c1] == board[r3][c3]
      && board[r2][c2] == 0
    ) {
      target = [r2, c2];
    } else if (
      board[r1][c1] != 0
      && board[r1][c1] == board[r2][c2]
      && board[r3][c3] == 0
    ) {
      target = [r3, c3];
    }
  }

  function getResult() {
    // 1. get bingo
    checkBingo([0, 1], [1, 1], [2, 1]);
    checkBingo([1, 0], [1, 1], [1, 2]);
    checkBingo([2, 0], [1, 1], [0, 2]);
    checkBingo([0, 0], [1, 1], [2, 2]);

    checkBingo([0, 0], [0, 1], [0, 2]);
    checkBingo([0, 0], [1, 0], [2, 0]);
    checkBingo([2, 0], [2, 1], [2, 2]);
    checkBingo([0, 2], [1, 2], [2, 2]);

    if (result == "DONE") {
      return;
    }

    // 2. get draw
    var drawn = true;

    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c < board[r].length; c++) {
        if (board[r][c] == 0) {
          drawn = false;
          break;
        }
      }
    }

    if (drawn) {
      result = "DRAW";
      winner = null;
    }
  }

  function checkBingo([r1, c1], [r2, c2], [r3, c3]) {
    if (
      board[r1][c1] != 0 
      && board[r1][c1] == board[r2][c2] 
      && board[r2][c2] == board[r3][c3]
    ) {
      result = "DONE";
      winner = board[r1][c1];
    }
  }

  /* draw */
  
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawResult() {
    if (result == "DONE") {
      if (winner == USER) {
        drawMessage("YOU WIN");
      } else {
        drawMessage("YOU LOSE");
      }
    }

    if (result == "DRAW") {
      drawMessage("DRAW!");
    }
  }
  
  function drawSymbol() {
    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c < board[r].length; c++) {
        var id = board[r][c];

        var x = GRID_OFFSET_X + (c * GRID_ITEM_SIZE);
        var y = GRID_OFFSET_Y + (r * GRID_ITEM_SIZE);

        if (id == 1) {
          ctx.beginPath();
          ctx.arc(
            x + 50, 
            y + 50, 
            30, 0, 2 * Math.PI);
          ctx.strokeStyle = "#888";
          ctx.lineWidth = 8;
          ctx.stroke();
        } 

        if (id == 2) {
          ctx.beginPath();
          ctx.strokeStyle = "#888";
          ctx.lineWidth = 8;
          ctx.moveTo(x + 20, y + 20);
          ctx.lineTo(x + 80, y + 80);
          ctx.moveTo(x + 80, y + 20);
          ctx.lineTo(x + 20, y + 80);
          ctx.stroke();
        }
      }
    }
  }

  function drawMessage(message) {
    ctx.font = "20px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(
      message,
      canvas.width / 2,
      GRID_OFFSET_Y + ((GRID_SIZE + 24) / 2)
    );
  }

  /* control */

  function clickHandler(e) {
    if (!start) {
      start = true;
      return;
    }

    if (result) {
      start = false;
      lot = false;
      return;
    }

    if (turn != USER) return;
    
    var r = Math.floor((e.offsetY - GRID_OFFSET_Y) / GRID_ITEM_SIZE);
    var c = Math.floor((e.offsetX - GRID_OFFSET_X) / GRID_ITEM_SIZE);

    if (r > -1 && r < GRID_ITEM_COUNT && c > -1 && c < GRID_ITEM_COUNT) {
      row = r;
      col = c;

      if (board[row][col] == 0) {
        board[row][col] = USER;
        turn = COM;
      }
    }
  }
})();

