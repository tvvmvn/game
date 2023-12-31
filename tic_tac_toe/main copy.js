(function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;
  canvas.addEventListener("click", handleClick);

  /* struct */

  /* constants  */

  const GRID_SIZE = 300;
  const GRID_OFFSET_X = 100;
  const GRID_OFFSET_Y = 150;
  const GRID_ITEM_COUNT = 3;
  const GRID_ITEM_SIZE = GRID_SIZE / GRID_ITEM_COUNT;
  const GRID_ITEM_CRDS = createItems();
  const USER = 1;
  const COM = 2;

  function createItems() {
    var items = [];

    for (var r = 0; r < 3; r++) {
      items[r] = [];

      for (var c = 0; c < 3; c++) {
        items[r][c] = [
          GRID_OFFSET_X + (c * GRID_ITEM_SIZE),
          GRID_OFFSET_Y + (r * GRID_ITEM_SIZE),
        ]
      }
    }

    console.log(items)

    return items.flat();
  }

  /* variables */

  var board;
  var target;
  var interval;
  var start = false;
  var outcome = null;
  var winner = null;
  var turn = USER;

  /* run the game */

  drawMessage("Touch or click to start game");

  function render() {
    clearCanvas();
    getResult();
    setEnd();
    drawSymbol();
  }

  /* functions */

  function setEnd() {
    if (outcome == "DONE") {
      if (winner == USER) {
        drawMessage("YOU WIN");
      } else {
        drawMessage("YOU LOSE");
      }
    }

    if (outcome == "DRAW") {
      drawMessage("DRAW!");
    }
  }

  function setAlg() {
    fill_hole(3, 4, 5);
    fill_hole(1, 4, 7);
    fill_hole(2, 4, 6);
    fill_hole(0, 4, 8);

    fill_hole(0, 3, 6);
    fill_hole(0, 1, 2);
    fill_hole(2, 5, 8);
    fill_hole(6, 7, 8);
  }

  function fill_hole(a, b, c) {
    if (
      board[b] != null
      && board[b] == board[c]
      && board[a] == null
    ) {
      target = a;
    } else if (
      board[a] != null
      && board[a] == board[c]
      && board[b] == null
    ) {
      target = b;
    } else if (
      board[a] != null
      && board[a] == board[b]
      && board[c] == null
    ) {
      target = c;
    }
  }

  function getResult() {
    // 1. get bingo
    checkBingo(3, 4, 5);
    checkBingo(1, 4, 7);
    checkBingo(2, 4, 6);
    checkBingo(0, 4, 8);

    checkBingo(0, 3, 6);
    checkBingo(0, 1, 2);
    checkBingo(2, 5, 8);
    checkBingo(6, 7, 8);

    if (outcome == "DONE") {
      return;
    }

    // 2. get draw
    var drawn = true;

    for (var i = 0; i < board.length; i++) {
      if (board[i] == null) {
        drawn = false;
        break;
      }
    }

    if (drawn) {
      outcome = "DRAW";
      winner = null;
    }
  }

  function checkBingo(a, b, c) {
    if (
      board[a] != null
      && board[a] == board[b]
      && board[b] == board[c]
    ) {
      outcome = "DONE";
      winner = board[a];
    }
  }

  /* draw */
  
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  function drawSymbol() {
    for (var i = 0; i < board.length; i++) {
      if (board[i] == 1) {
        var x = GRID_ITEM_CRDS[i][0];
        var y = GRID_ITEM_CRDS[i][1]
        
        ctx.beginPath();
        ctx.arc(x + 50, y + 50, 30, 0, 2 * Math.PI);
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 8;
        ctx.stroke();
      }
  
      if (board[i] == 2) {
        var x = GRID_ITEM_CRDS[i][0];
        var y = GRID_ITEM_CRDS[i][1];
        
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

  function drawMessage(message) {
    ctx.font = "24px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(
      message,
      canvas.width / 2,
      GRID_OFFSET_Y + ((GRID_SIZE + 24) / 2)
    );
  }

  /* control */

  function handleClick(e) {
    if (outcome) {
      outcome = null;
      turn = 1;
      winner = null;

      board = new Array(9);
      interval = setInterval(render, 10);

      return;
    }

    if (!start) {
      board = new Array(9);
      interval = setInterval(render, 10);
      
      start = true;
      return;
    }
  

    if (turn != USER) return;

    var x = e.clientX - GRID_OFFSET_X;
    var y = e.clientY - GRID_OFFSET_Y;
    // console.log(x, y);

    var selected = null;

    var row1 = y > 0 && y < GRID_ITEM_SIZE;
    var row2 = y > GRID_ITEM_SIZE && y < (GRID_ITEM_SIZE * 2);
    var row3 = y > (GRID_ITEM_SIZE * 2) && y < (GRID_ITEM_SIZE * 3);

    var col1 = x > 0 && x < GRID_ITEM_SIZE;
    var col2 = x > GRID_ITEM_SIZE && x < (GRID_ITEM_SIZE * 2);
    var col3 = x > (GRID_ITEM_SIZE * 2) && x < (GRID_ITEM_SIZE * 3);

    if (row1) {
      if (col1) selected = 0;
      if (col2) selected = 1;
      if (col3) selected = 2;
    } else if (row2) {
      if (col1) selected = 3;
      if (col2) selected = 4;
      if (col3) selected = 5;
    } else if (row3) {
      if (col1) selected = 6;
      if (col2) selected = 7;
      if (col3) selected = 8;
    }

    if (selected != null && board[selected] == null) {
      board[selected] = USER;

      turn = COM;

      // COM
      setTimeout(() => {
        setAlg();
  
        if (target != null) { // * target must include 0
          board[target] = COM;
        } else {
          while (true) {
            var n = Math.floor(Math.random() * 9);
    
            if (board[n] == null) {
              board[n] = COM;
              break;
            }
          }
        }
    
        turn = USER;
      }, 1000);
    }
  }
})()
