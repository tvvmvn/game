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
  constants 
*/


const GRID_SIZE = 300;
const GRID_OFFSET_X = (innerWidth - GRID_SIZE) / 2;
const GRID_OFFSET_Y = 100;
const GRID_ITEM_COUNT = 3;
const GRID_ITEM_SIZE = GRID_SIZE / GRID_ITEM_COUNT;
const GRID_ITEM_CRDS = createItems(); 
const USER = 1;
const COM = 2;


/*
  variables
*/


var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var board;
var target;
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
  
  for (var r = 0; r < 3; r++) {
    items[r] = [];
    for (var c = 0; c < 3; c++) {
      items[r][c] = [
        GRID_OFFSET_X + (c * GRID_ITEM_SIZE),
        GRID_OFFSET_Y + (r * GRID_ITEM_SIZE),
      ]
    }
  }

  return items.flat();
}

function startGame() {
  board = new Array(9);
  game = new Game(
    false, 
    Math.ceil(Math.random() * 2), 
    false, 
    null, 
    null
  );
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
    if (game.turn == COM) {
      setTimeout(com, 1000);
      game.turn = undefined;
    }
  } else { // or end
    if (game.outcome == "DONE") {
      if (game.winner == USER) {
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

function drawTitle() {
  ctx.font = "30px Monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("TIC TAC TOE", canvas.width / 2, 60);
} 

function drawStart() {
  ctx.font = "24px Monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("Touch to start game", canvas.width / 2, 250);
}

function drawLot() {
  var text = game.turn == USER ? "YOU First" : "COM First";

  ctx.font = "24px Monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(text + ", Ready?", canvas.width / 2, 250);
}

function com() {
  setAlg();

  console.log(target);

  if (target != null) {
    board[target] = COM;
    target = null;
  } else {
    tmp(); 
  }
  
  game.turn = USER;
}

function tmp() {
  var n = Math.floor(Math.random() * 9);
    
  if (board[n] == null) {
    board[n] = COM;
  } else {
    tmp();
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
    board[a] != null
    && board[a] == board[b] 
    && board[c] == null
  ) {
    target = c;
  } else if (
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
  }
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
  checkBingo(3, 4, 5);
  checkBingo(1, 4, 7);
  checkBingo(2, 4, 6);
  checkBingo(0, 4, 8);

  checkBingo(0, 3, 6);
  checkBingo(0, 1, 2);
  checkBingo(2, 5, 8);
  checkBingo(6, 7, 8);
  
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
  if (
      board[a] != null 
      && board[a] == board[b] 
      && board[b] == board[c]
    ) {
    game.outcome = "DONE";
    game.winner = board[a];
  }
}

function drawResult(text, color) {
  ctx.font = "30px Monospace";
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
  for (var i=1; i<3; i++) {
    ctx.moveTo(GRID_OFFSET_X, GRID_OFFSET_Y + (i * GRID_ITEM_SIZE));
    ctx.lineTo(GRID_OFFSET_X + GRID_SIZE, GRID_OFFSET_Y + (i * GRID_ITEM_SIZE));
  }
  
  // cols
  for (var j=1; j<3; j++) {
    ctx.moveTo(GRID_OFFSET_X + (j * GRID_ITEM_SIZE), GRID_OFFSET_Y);
    ctx.lineTo(GRID_OFFSET_X + (j * GRID_ITEM_SIZE), GRID_OFFSET_Y + GRID_SIZE);
  }

  ctx.stroke();
}

function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x + 50, y + 50, 30, 0, 2 * Math.PI);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 8;
  ctx.stroke();
}

function drawCross(x, y) {
  ctx.beginPath();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 8;
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

  if (game.outcome) {
    return;
  }
  
  if (game.turn != USER) return;

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
    board[selected] = USER;
    game.turn = COM;
  }
}
