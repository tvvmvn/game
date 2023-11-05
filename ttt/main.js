var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var gridSize = 300;
var gridOffsetX = (innerWidth - gridSize) / 2;
var gridOffsetY = 100;
var gridItemCount = 3;
var gridItemSize = gridSize / gridItemCount;
var gridItems = createItems();
var board = [];
var turn;
var initialized;
var result = {};
var interval;

canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style["backgroundColor"] = "#222";
canvas.addEventListener("touchstart", touchHandler);

startGame();

function startGame() {
  board = new Array(9);
  turn = 1;
  result.outcome = null;
  result.winner = null;
  initialized = false;
  
  interval = setInterval(render, 10);
}

function render() {
  clearCanvas();
  drawTitle();
  drawGrid();
  setSymbol();
  getResult();

  // keep playing
  if (result.outcome == null) {
    if (turn == 2) {
      setTimeout(com, 1000);
      turn = 0;
    }
  } else { // or end
    if (result.outcome == "DONE") {
      if (result.winner == 1) {
        drawResult("YOU WIN", "#00f");
      } else {
        drawResult("YOU LOSE", "#f00");
      }
    } 
    
    if (result.outcome == "DRAW") {
      drawResult("DRAW!", "#0f0");
    }

    if (!initialized) {
      setTimeout(() => {
        clearInterval(interval);
        startGame();
      }, 2000);
  
      initialized = true;
    }
  }
}

function drawStart() {
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("Touch to start game", canvas.width / 2, 250);
}

function drawTitle() {
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("TIC TAC TOE", canvas.width / 2, 60);
} 

function com() {
  var n = Math.floor(Math.random() * 9);
  
  if (board[n] == null) {
    board[n] = 2;
  } else {
    com();
  }
  
  turn = 1;
}

function setSymbol() {
  for (var i=0; i<board.length; i++) {  
    if (board[i] == 1) {
      drawCircle(gridItems[i].x, gridItems[i].y);
    } 
    
    if (board[i] == 2) {
      drawCross(gridItems[i].x, gridItems[i].y)
    }
  }
}

function getResult() {
  // 1. get bingo
  checkBingo(board[3], board[4], board[5]);
  checkBingo(board[1], board[4], board[7]);
  checkBingo(board[2], board[4], board[6]);
  checkBingo(board[0], board[4], board[8]);
  checkBingo(board[0], board[3], board[6]);
  checkBingo(board[0], board[1], board[2]);
  checkBingo(board[2], board[5], board[8]);
  checkBingo(board[6], board[7], board[8]);
  
  if (result.outcome == "DONE") {
    return;
  }

  // 2. get draw
  var drawn = true;
  
  for (var i=0; i<board.length; i++) {
    if (board[i] == null) {
      drawn = false;
      break;
    }
  }
  
  if (drawn) {
    result.outcome = "DRAW";
    result.winner = null;
  } 
}

function checkBingo(a, b, c) {
  if (a != null && a == b && b == c) {
    result.outcome = "DONE";
    result.winner = a;
  }
}

function drawResult(text, color) {
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, 250);
}

function clearCanvas() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
}

function drawGrid() {
  ctx.beginPath();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 4;
  
  // rows
  for (var i=0; i<4; i++) {
    ctx.moveTo(gridOffsetX, gridOffsetY + (i * gridItemSize));
    ctx.lineTo(gridOffsetX + gridSize, gridOffsetY + (i * gridItemSize));
  }
  
  // cols
  for (var j=0; j<4; j++) {
    ctx.moveTo(gridOffsetX + (j * gridItemSize), gridOffsetY);
    ctx.lineTo(gridOffsetX + (j * gridItemSize), gridOffsetY + gridSize);
  }

  ctx.stroke();
}

function createItems() {
  var items = [];
  
  for (var i=0; i<3; i++) {
    items[i] = [];
    for (var j=0; j<3; j++) {
      items[i][j] = { 
        x: gridOffsetX + (j * gridItemSize), 
        y: gridOffsetY + (i * gridItemSize),
      }
    }
  }

  return items.flat();
}

function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x + 50, y + 50, 30, 0, 2 * Math.PI);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 8
  ctx.stroke();
}

function drawCross(x, y) {
  ctx.beginPath();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 8
  ctx.moveTo(x + 20, y + 20);
  ctx.lineTo(x + 80, y + 80);
  ctx.moveTo(x + 80, y + 20);
  ctx.lineTo(x + 20, y + 80);
  ctx.stroke();
}

function touchHandler(e) {
  if (turn != 1) return;

  var x = e.touches[0].clientX - gridOffsetX;
  var y = e.touches[0].clientY - gridOffsetY;
  // console.log(x, y);

  var selected = null;

  var row1 = y > 0 && y < gridItemSize;
  var row2 = y > gridItemSize && y < (gridItemSize * 2);
  var row3 = y > (gridItemSize * 2) && y < (gridItemSize * 3);
  
  var col1 = x > 0 && x < gridItemSize;
  var col2 = x > gridItemSize && x < (gridItemSize * 2);
  var col3 = x > (gridItemSize * 2) && x < (gridItemSize * 3);

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

  if (selected !== null) {
    board[selected] = 1;
    turn = 2;
  }
}