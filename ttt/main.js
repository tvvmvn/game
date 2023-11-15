/*
  struct
*/


class Game {
  constructor(start, turn, decided, outcome, winner) {
    this.start = start;
    this.turn = turn;
    this.decided = decided;
    this.outcome = outcome;
    this.winner = winner;
  }
}


/* 
  constants (enums)
*/


const GRID_SIZE = 300;
const GRID_OFFSET_X = (innerWidth - GRID_SIZE) / 2;
const GRID_OFFSET_Y = 100;
const GRID_ITEM_COUNT = 3;
const GRID_ITEM_SIZE = GRID_SIZE / GRID_ITEM_COUNT;
const GRID_ITEM_CRDS = createItems(); 


/*
  variables
*/


var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var board;
var game;
var initialized;
var interval;

canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style["backgroundColor"] = "#222";
canvas.addEventListener("touchstart", touchHandler);


/*
  functions
*/


startGame();

function createItems() {
  var items = [];
  
  for (var i=0; i<3; i++) {
    items[i] = [];
    for (var j=0; j<3; j++) {
      items[i][j] = [
        GRID_OFFSET_X + (j * GRID_ITEM_SIZE), 
        GRID_OFFSET_Y + (i * GRID_ITEM_SIZE),
      ]
    }
  }

  return items.flat();
}

function startGame() {
  board = new Array(9);
  game = new Game(false, Math.ceil(Math.random()*2), false, null, null);
  initialized = false;

  interval = setInterval(render, 10);
}

function render() {
  clearCanvas();
  drawTitle();
  drawGrid();

  if (!game.start) {
    drawStart();
    return;
  }

  if (!game.decided) {
    drawLot();
    return;
  }

  setSymbol();
  getResult();

  // keep playing
  if (game.outcome == null) {
    if (game.turn == 2) {
      setTimeout(com, 1000);
      game.turn = 0;
    }
  } else { // or end
    if (game.outcome == "DONE") {
      if (game.winner == 1) {
        drawResult("YOU WIN", "#00f");
      } else {
        drawResult("YOU LOSE", "#f00");
      }
    } 
    
    if (game.outcome == "DRAW") {
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

function drawLot() {
  var text = game.turn == 1 ? "You First" : "Com First";

  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(text + ", Ready?", canvas.width / 2, 250);
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
  
  game.turn = 1;
}

function setSymbol() {
  for (var i=0; i<board.length; i++) {  
    if (board[i] == 1) {
      drawCircle(GRID_ITEM_CRDS[i][0], GRID_ITEM_CRDS[i][1]);
    } 
    
    if (board[i] == 2) {
      drawCross(GRID_ITEM_CRDS[i][0], GRID_ITEM_CRDS[i][1])
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
  
  if (game.outcome == "DONE") {
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
    game.outcome = "DRAW";
    game.winner = null;
  } 
}

function checkBingo(a, b, c) {
  if (a != null && a == b && b == c) {
    game.outcome = "DONE";
    game.winner = a;
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
    ctx.moveTo(GRID_OFFSET_X, GRID_OFFSET_Y + (i * GRID_ITEM_SIZE));
    ctx.lineTo(GRID_OFFSET_X + GRID_SIZE, GRID_OFFSET_Y + (i * GRID_ITEM_SIZE));
  }
  
  // cols
  for (var j=0; j<4; j++) {
    ctx.moveTo(GRID_OFFSET_X + (j * GRID_ITEM_SIZE), GRID_OFFSET_Y);
    ctx.lineTo(GRID_OFFSET_X + (j * GRID_ITEM_SIZE), GRID_OFFSET_Y + GRID_SIZE);
  }

  ctx.stroke();
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
  if (!game.start) {
    game.start = true;
    return;
  }

  if (!game.decided) {
    game.decided = true;
    return;
  }
  
  if (game.turn != 1) return;

  var x = e.touches[0].clientX - GRID_OFFSET_X;
  var y = e.touches[0].clientY - GRID_OFFSET_Y;
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

  if (selected !== null) {
    board[selected] = 1;
    game.turn = 2;
  }
}