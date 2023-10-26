game();

function game() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var turn = 1;
  var selected;
  var interval;
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
  ]
  var end = {
    result: null,
    winner: null,
  }
  var initialized = true;
  
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style["backgroundColor"] = "#222";
  canvas.addEventListener("touchstart", touchHandler);
  
  var boardSize = 300;
  var boardOffsetX = (innerWidth - boardSize) / 2;
  var boardOffsetY = 100;
  
  function drawTitle() {
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("TIC TAC TOE", canvas.width / 2, 60);
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
  
  interval = setInterval(draw, 10);
  
  function draw() {
    clearCanvas();
  
    drawTitle();
    drawBoard();
    drawSymbol();

    getResult();
  
    if (end.result === "DONE") {
      if (end.winner === 1) {
        drawResult("YOU WIN");
      } else {
        drawResult("YOU LOSE");
      }
    } else if (end.result === "DRAW") {
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
          ctx.fillStyle = "#00a";
        }
    
        if (block.by === 2) {
          ctx.fillStyle = "#a00";
        }
  
        ctx.fillRect(
          block.x + boardOffsetX, 
          block.y + boardOffsetY, 
          100, 100
        );
      }
    }
  }
  

  function getResult() {
    var h = blocks[3].by !== 0 && blocks[3].by == blocks[4].by && blocks[4].by == blocks[5].by
    var v =  blocks[1].by !==0 && blocks[1].by == blocks[4].by && blocks[4].by == blocks[7].by
    
    if (h) {
      end.result = "DONE";
      end.winner = blocks[3].by;
    } else if (v) {
      end.result = "DONE";
      end.winner = blocks[1].by;
    } else {
      var drawn = true;

      for (var i=0; i<blocks.length; i++) {
        if (blocks[i].by === 0) {
          drawn = false;
          break;
        }
      }
    
      if (drawn) {
        end.result = "DRAW";
        end.winner = null;
      } 
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
