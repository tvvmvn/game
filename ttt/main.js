game();

function game() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var boardSize = 300;
  var boardOffsetX = (innerWidth - boardSize) / 2;
  var boardOffsetY = 100;
  var blocks = [
    { x: 0, y: 0, by: 0 },
    { x: 100, y: 0, by: 0 },
    { x: 200, y: 0, by: 0 },
    { x: 0, y: 100, by: 0 },
    { x: 100, y: 100, by: 0 },
    { x: 200, y: 100, by: 0 },
    { x: 0, y: 200, by: 0 },
    { x: 100, y: 200, by: 0 },
    { x: 200, y: 200, by: 0 },
  ];
  var turn = 1;
  var selected;
  var interval;
  var result = {
    outcome: null,
    winner: null,
  }
  var initialized = true;

  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style["backgroundColor"] = "#222";
  canvas.addEventListener("touchstart", touchHandler);
  interval = setInterval(draw, 10);


  function draw() {
    clearCanvas();
  
    drawTitle();
    drawBoard();
    drawSymbol();

    getResult();
  
    if (result.outcome === "DONE") {
      if (result.winner === 1) {
        drawResult("YOU WIN");
      } else {
        drawResult("YOU LOSE");
      }
    } else if (result.outcome === "DRAW") {
      drawResult("DRAW!");
    } else {
      if (turn === 2) {
        setTimeout(drawCom, 1000);
        turn = 0;
      }
    }
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  }

  function drawBoard() {
    ctx.beginPath();
    ctx.moveTo(boardOffsetX, boardOffsetY + 100);
    ctx.lineTo(boardOffsetX + 300, boardOffsetY + 100);
  
    ctx.moveTo(boardOffsetX, boardOffsetY + 200);
    ctx.lineTo(boardOffsetX + 300, boardOffsetY + 200);
  
    ctx.moveTo(boardOffsetX + 100, boardOffsetY);
    ctx.lineTo(boardOffsetX + 100, boardOffsetY + 300);
  
    ctx.moveTo(boardOffsetX + 200, boardOffsetY);
    ctx.lineTo(boardOffsetX + 200, boardOffsetY + 300);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  
  function drawTitle() {
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("TIC TAC TOE", canvas.width / 2, 60);
  } 
  
  function drawCom() {
    var n = Math.floor(Math.random() * 9);
    
    if (blocks[n].by === 0) {
      blocks[n].by = 2;
    } else {
      drawCom();
    }
    
    turn = 1;
  }
  
  function drawSymbol() {
    for (var i=0; i<blocks.length; i++) {
      var block = blocks[i];
  
      if (block.by !== 0) {
        if (block.by === 1) {
          drawCircle(block.x, block.y);
        } else {
          // ctx.fillStyle = "#a00";
          // ctx.fillRect(block.x + boardOffsetX, block.y + boardOffsetY, 100, 100);
          drawX(block.x, block.y);
        }
      }
    }
  }

  function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(
      x + boardOffsetX + 50, 
      y + boardOffsetY + 50, 
      30, 0, 2 * Math.PI
    );
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 8
    ctx.stroke();
  }

  function drawX(x, y) {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 8

    // Begin a Path
    ctx.beginPath();
    ctx.moveTo(x + boardOffsetX + 20, y + boardOffsetY + 20);
    ctx.lineTo(x + boardOffsetX + 80, y + boardOffsetY + 80);
    ctx.stroke();

    // Begin a new Path
    ctx.beginPath();
    ctx.moveTo(x + boardOffsetX + 80, y + boardOffsetY + 20);
    ctx.lineTo(x + boardOffsetX + 20, y + boardOffsetY + 80);
    ctx.stroke();
  }
  
  function getResult() {
    // get bingo
    cmp(blocks[3].by, blocks[4].by, blocks[5].by);
    cmp(blocks[1].by, blocks[4].by, blocks[7].by);
    cmp(blocks[2].by, blocks[4].by, blocks[6].by);
    cmp(blocks[0].by, blocks[4].by, blocks[8].by);

    cmp(blocks[0].by, blocks[3].by, blocks[6].by);
    cmp(blocks[0].by, blocks[1].by, blocks[2].by);
    cmp(blocks[2].by, blocks[5].by, blocks[8].by);
    cmp(blocks[6].by, blocks[7].by, blocks[8].by);
    
    if (result.winner) {
      return;
    }

    // get draw
    var drawn = true;
    
    for (var i=0; i<blocks.length; i++) {
      if (blocks[i].by === 0) {
        drawn = false;
        break;
      }
    }
    
    if (drawn) {
      result.outcome = "DRAW";
      result.winner = null;
    } 
  }

  function cmp(a, b, c) {
    if (a !== 0 && a === b && b === c) {
      result.outcome = "DONE";
      result.winner = a;
    }
  }

  function drawResult(text) {
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, 250);

    if (initialized) {
      setTimeout(() => {
        clearInterval(interval);
        game();
      }, 2000);

      initialized = false;
    }
  }

  function touchHandler(e) {
    if (turn != 1) return;
  
    var x = e.touches[0].clientX - boardOffsetX;
    var y = e.touches[0].clientY - boardOffsetY;
  
    // console.log(x, y)
  
    if (y > 0 && y < 100) {
      if (x > 0 && x < 100) selected = 0;
      if (x > 100 && x < 200) selected = 1;
      if (x > 200 && x < 300) selected = 2;
    } else if (y > 100 && y < 200) {
      if (x < 100) selected = 3;
      if (x > 100 && x < 200) selected = 4;
      if (x > 200) selected = 5;
    } else if (y > 200 && y < 300) {
      if (x > 0 && x < 100) selected = 6;
      if (x > 100 && x < 200) selected = 7;
      if (x > 200 && x < 300) selected = 8;
    }
  
    blocks[selected].by = 1;
  
    turn = 2;
  }
}
