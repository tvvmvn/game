(function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var image = new Image();
  image.src = "./pieces.png";
  
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.backgroundColor = "#ddd";

  /* constants */

  const OFFSET_X = 40;
  const OFFSET_Y = 80;
  const ROW_COUNT = 9;
  const COL_COUNT = 8;
  const WIDTH = 420;
  const HEIGHT = 400;
  const CELL_WIDTH = WIDTH / COL_COUNT;
  const CELL_HEIGHT = HEIGHT / ROW_COUNT;
  
  const SPOTS = [];
  for (var r = 0; r <= ROW_COUNT; r++) {
    SPOTS[r] = [];

    for (var c = 0; c <= COL_COUNT; c++) {
      SPOTS[r][c] = [OFFSET_X + (c * CELL_WIDTH), OFFSET_Y + (r * CELL_HEIGHT)]
    }
  }

  const CHO = 1
  const HAN = 2
  const ZOL = "zol"
  const PO = "linear"
  const CHA = "cha"
  const SANG = "sang"
  const MA = "ma"
  const SA = "sa"
  const GUNG = "gung"

  /* enums */

  const HanCastle = {
    TL: [3, 0],
    TM: [4, 0],
    TR: [5, 0],
    RM: [5, 1],
    BR: [5, 2],
    BM: [4, 2],
    BL: [3, 2],
    LM: [3, 1],
    CENTER: [4, 1],
  }

  const ChoCastle = {
    TL: [3, 7],
    TM: [4, 7],
    TR: [5, 7],
    RM: [5, 8],
    BR: [5, 9],
    BM: [4, 9],
    BL: [3, 9],
    LM: [3, 8],
    CENTER: [4, 8],
  }

  /* struct */

  class Piece {
    constructor (id, name, crds, src, team) {
      this.id = id
      this.name = name;
      this.crds = crds;
      this.src = src; 
      this.team = team;
    }
  }

  /* variables */

  var x;
  var y;
  var target;
  var points;
  var turn;
  var over;
  var win;
  var message = "";
  var interval;
  
  var pieces;

  addEventListener("click", clickHandler);

  /* run the game */

  startGame();

  function startGame() {
    x = -1;
    y = -1;
    target = null;
    points = [];
    turn = CHO;
    over = false;
    win = null;
    pieces = [
      new Piece("cz1", ZOL, [2, 6], [40, 80], CHO),
      new Piece("cz2", ZOL, [6, 6], [40, 80], CHO),
      new Piece("cz3", ZOL, [0, 6], [40, 80], CHO),
      new Piece("cz4", ZOL, [4, 6], [40, 80], CHO),
      new Piece("cz5", ZOL, [8, 6], [40, 80], CHO),
      new Piece("cc1", CHA, [0, 9], [40, 40], CHO),
      new Piece("cc2", CHA, [8, 9], [40, 40], CHO),
      new Piece("cm1", MA, [2, 9], [0, 80], CHO),
      new Piece("cm2", MA, [6, 9], [0, 80], CHO),
      new Piece("cs1", SANG, [1, 9], [40, 0], CHO),
      new Piece("cs2", SANG, [7, 9], [40, 0], CHO),
      new Piece("cp1", PO, [1, 7], [0, 120], CHO),
      new Piece("cp2", PO, [7, 7], [0, 120], CHO),
      new Piece("ca1", SA, [3, 9], [0, 40], CHO),
      new Piece("ca2", SA, [5, 9], [0, 40], CHO),
      new Piece("c00", GUNG, [4, 8], [0, 0], CHO),
      new Piece("hz1", ZOL, [2, 3], [120, 80], HAN),
      new Piece("hz2", ZOL, [6, 3], [120, 80], HAN),
      new Piece("hz3", ZOL, [0, 3], [120, 80], HAN),
      new Piece("hz4", ZOL, [4, 3], [120, 80], HAN),
      new Piece("hz5", ZOL, [8, 3], [120, 80], HAN),
      new Piece("hc1", CHA, [0, 0], [120, 40], HAN),
      new Piece("hc2", CHA, [8, 0], [120, 40], HAN),
      new Piece("hm1", MA, [6, 0], [80, 80], HAN),
      new Piece("hm2", MA, [2, 0], [80, 80], HAN),
      new Piece("hs1", SANG, [1, 0], [120, 0], HAN),
      new Piece("hs2", SANG, [7, 0], [120, 0], HAN),
      new Piece("hp1", PO, [1, 2], [80, 120], HAN),
      new Piece("hp2", PO, [7, 2], [80, 120], HAN),
      new Piece("ha1", SA, [3, 0], [80, 40], HAN),
      new Piece("ha2", SA, [5, 0], [80, 40], HAN),
      new Piece("h00", GUNG, [4, 1], [80, 0], HAN),
    ]

    interval = setInterval(render, 10);
  }

  function render() {
    clearCanvas();
    
    setTarget();
    setPoints();
    move();
    
    if (!over) {
      message = turn == CHO ? "CHO" : "HAN";
    } else {
      message = win == CHO ? "CHO WIN!" : "HAN WIN!";

      clearInterval(interval);
      setTimeout(() => {
        startGame();
      }, 3000)
    }

    drawMessage();
    drawBoard();
    drawPieces();
    drawPoints();
    // drawCursor();
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* functions */

  function inBoard(x, y) {
    return x >= 0 && x <= 8 && y >= 0 && y <= 9;
  }
   
  function eqlcrds(crds1, crds2) {
    var [x1, y1] = crds1;
    var [x2, y2] = crds2;

    return x1 == x2 && y1 == y2;
  }

  function getPieceByCrds(crds) {
    var _piece = null;

    for (var i=0; i<pieces.length; i++) {
      if (eqlcrds(pieces[i].crds, crds)) {
        _piece = pieces[i];
        break;
      }
    }

    return _piece;
  }

  function push(crds) {
    var [x, y] = crds;
    
    if (x >= 0 && x <= 8 && y >= 0 && y <= 9) {
      var piece = getPieceByCrds(crds);
  
      if (!piece || piece.team != target.team) {
        points.push(crds);
      }
    }
  }
  
  function setTarget() {
    var piece = getPieceByCrds([x, y]);

    if (piece && piece.team == turn) {
      target = piece;
    }
  }

  function setPoints() {
    if (!target) {
      return;
    }

    points = [];

    if (target.name == ZOL) {
      getZol();
    }

    if (target.name == MA) {
      getMa();
    }

    if (target.name == SANG) {
      getSang();
    }

    if (target.name == CHA) {
      getCha();
    }

    if (target.name == PO) {
      getPo()
    }

    if (target.name == GUNG) {
      getGung();
    }

    if (target.name == SA) {
      getGung();
    }
  }

  function move() {
    for (var i=0; i<points.length; i++) {
      if (eqlcrds([x, y], points[i])) {

        // remove victim from pieces
        for (var j=0; j<pieces.length; j++) {
          if (pieces[j].crds[0] == x && pieces[j].crds[1] == y) {
            // GAME END
            if (pieces[j].name == GUNG) {
              over = true;
              win = turn;
            }

            pieces.splice(j, 1);
          }
        }

        // move
        target.crds = [x, y];

        // after move
        target = null;
        points = [];
        
        if (over == false) {
          turn = turn == CHO ? HAN : CHO;
        }
      }
    }
  }

  
  function getPo() {
    function linear(x, y, dir, add) {
      if (dir == 0) y--;
      if (dir == 1) x++;
      if (dir == 2) y++;
      if (dir == 3) x--;
  
      if (inBoard(x, y)) {
        var piece = getPieceByCrds([x, y]);
    
        if (add) {
          if (piece) {
            if (piece.team != turn) {
              if (piece.name != PO) {
                points.push([x, y]); 
              }
            }
          } else {
            points.push([x, y]); 
            linear(x, y, dir, true);
          }
        } else {
          if (piece) {
            if (piece.name != PO) {
              linear(x, y, dir, true);
            }
          } else {
            linear(x, y, dir, false);
          }
        }
      }
    }

    function castle(current, center, dest) {
      if (eqlcrds(target.crds, current)) {
        var piece = getPieceByCrds(center);
  
        if (piece) {
          if (piece.name != PO) {
            var piece = getPieceByCrds(dest);
    
            if (piece) {
              if (piece.team != turn) {
                if (piece.name != PO) {
                  points.push(dest);
                }
              }
            } else {
              points.push(dest);
            }
          }
        }
      }
    }

    // linear
    linear(target.crds[0], target.crds[1], 0, false);
    linear(target.crds[0], target.crds[1], 1, false);
    linear(target.crds[0], target.crds[1], 2, false);
    linear(target.crds[0], target.crds[1], 3, false);

    // castle
    castle(ChoCastle.TL, ChoCastle.CENTER, ChoCastle.BR);
    castle(ChoCastle.TR, ChoCastle.CENTER, ChoCastle.BL);
    castle(ChoCastle.BR, ChoCastle.CENTER, ChoCastle.TL);
    castle(ChoCastle.BL, ChoCastle.CENTER, ChoCastle.TR);
    castle(HanCastle.TL, HanCastle.CENTER, HanCastle.BR);
    castle(HanCastle.TR, HanCastle.CENTER, HanCastle.BL);
    castle(HanCastle.BR, HanCastle.CENTER, HanCastle.TL);
    castle(HanCastle.BL, HanCastle.CENTER, HanCastle.TR);
  }

  function getZol() {
    function linear(crds) {
      if (inBoard(crds[0], crds[1])) {
        var piece = getPieceByCrds(crds);
  
        if (piece == null || piece.team != target.team) {
          points.push(crds);
        }
      }
    }

    function castle(current, dest) {
      if (eqlcrds(target.crds, current)) {
        var piece = getPieceByCrds(dest);
  
        if (piece == null || piece.team != target.team) {
          points.push(dest);
        }
      }
    }

    // linear
    if (target.team == CHO) {
      linear([target.crds[0], target.crds[1] - 1])
    } else {
      linear([target.crds[0], target.crds[1] + 1])
    }
    linear([target.crds[0] - 1, target.crds[1]])
    linear([target.crds[0] + 1, target.crds[1]])

    // castle
    castle(HanCastle.BL, HanCastle.CENTER);
    castle(HanCastle.CENTER, HanCastle.TL);
    castle(HanCastle.CENTER, HanCastle.TR);
    castle(HanCastle.BR, HanCastle.CENTER);

    castle(ChoCastle.TL, ChoCastle.CENTER);
    castle(ChoCastle.CENTER, ChoCastle.BL);
    castle(ChoCastle.CENTER, ChoCastle.BR);
    castle(ChoCastle.TR, ChoCastle.CENTER);
  }

  function getGung() {
    function castle(current, dest) {
      if (eqlcrds(target.crds, current)) {
        var piece = getPieceByCrds(dest);
  
        if (!piece || piece.team != target.team) {
          points.push(dest);
        }
      }
    }

    // Cho
    castle(ChoCastle.CENTER, ChoCastle.TL)
    castle(ChoCastle.CENTER, ChoCastle.TM)
    castle(ChoCastle.CENTER, ChoCastle.TR)
    castle(ChoCastle.CENTER, ChoCastle.RM)
    castle(ChoCastle.CENTER, ChoCastle.BR)
    castle(ChoCastle.CENTER, ChoCastle.BM)
    castle(ChoCastle.CENTER, ChoCastle.BL)
    castle(ChoCastle.CENTER, ChoCastle.LM)
    castle(ChoCastle.TL, ChoCastle.TM)
    castle(ChoCastle.TL, ChoCastle.CENTER)
    castle(ChoCastle.TL, ChoCastle.LM)
    castle(ChoCastle.TM, ChoCastle.TL)
    castle(ChoCastle.TM, ChoCastle.CENTER)
    castle(ChoCastle.TM, ChoCastle.TR)
    castle(ChoCastle.TR, ChoCastle.TM)
    castle(ChoCastle.TR, ChoCastle.CENTER)
    castle(ChoCastle.TR, ChoCastle.RM)
    castle(ChoCastle.RM, ChoCastle.TR)
    castle(ChoCastle.RM, ChoCastle.CENTER)
    castle(ChoCastle.RM, ChoCastle.BR)
    castle(ChoCastle.BR, ChoCastle.RM)
    castle(ChoCastle.BR, ChoCastle.CENTER)
    castle(ChoCastle.BR, ChoCastle.BM)
    castle(ChoCastle.BM, ChoCastle.BL)
    castle(ChoCastle.BM, ChoCastle.CENTER)
    castle(ChoCastle.BM, ChoCastle.BR)
    castle(ChoCastle.BL, ChoCastle.LM)
    castle(ChoCastle.BL, ChoCastle.CENTER)
    castle(ChoCastle.BL, ChoCastle.BM)
    castle(ChoCastle.LM, ChoCastle.TL)
    castle(ChoCastle.LM, ChoCastle.CENTER)
    castle(ChoCastle.LM, ChoCastle.BL)

    // Han
    castle(HanCastle.CENTER, HanCastle.TL)
    castle(HanCastle.CENTER, HanCastle.TM)
    castle(HanCastle.CENTER, HanCastle.TR)
    castle(HanCastle.CENTER, HanCastle.RM)
    castle(HanCastle.CENTER, HanCastle.BR)
    castle(HanCastle.CENTER, HanCastle.BM)
    castle(HanCastle.CENTER, HanCastle.BL)
    castle(HanCastle.CENTER, HanCastle.LM)
    castle(HanCastle.TL, HanCastle.TM)
    castle(HanCastle.TL, HanCastle.CENTER)
    castle(HanCastle.TL, HanCastle.LM)
    castle(HanCastle.TM, HanCastle.TL)
    castle(HanCastle.TM, HanCastle.CENTER)
    castle(HanCastle.TM, HanCastle.TR)
    castle(HanCastle.TR, HanCastle.TM)
    castle(HanCastle.TR, HanCastle.CENTER)
    castle(HanCastle.TR, HanCastle.RM)
    castle(HanCastle.RM, HanCastle.TR)
    castle(HanCastle.RM, HanCastle.CENTER)
    castle(HanCastle.RM, HanCastle.BR)
    castle(HanCastle.BR, HanCastle.RM)
    castle(HanCastle.BR, HanCastle.CENTER)
    castle(HanCastle.BR, HanCastle.BM)
    castle(HanCastle.BM, HanCastle.BL)
    castle(HanCastle.BM, HanCastle.CENTER)
    castle(HanCastle.BM, HanCastle.BR)
    castle(HanCastle.BL, HanCastle.LM)
    castle(HanCastle.BL, HanCastle.CENTER)
    castle(HanCastle.BL, HanCastle.BM)
    castle(HanCastle.LM, HanCastle.TL)
    castle(HanCastle.LM, HanCastle.CENTER)
    castle(HanCastle.LM, HanCastle.BL)
  }
  
  function getCha() {
    // linear
    function linear(x, y, dir) {
      if (dir == 0) y--;
      if (dir == 1) x++;
      if (dir == 2) y++;
      if (dir == 3) x--;

      if (inBoard(x, y)) {
        var piece = getPieceByCrds([x, y]);
      
        if (piece == null) {
          points.push([x, y]);
          linear(x, y, dir);
        } else {
          if (piece.team != target.team) {
            points.push([x, y]);
          }
        }
      }
    }

    linear(target.crds[0], target.crds[1], 0);
    linear(target.crds[0], target.crds[1], 1);
    linear(target.crds[0], target.crds[1], 2);
    linear(target.crds[0], target.crds[1], 3);

    // castle 
    function castle(current, mid, dest) {
      if (eqlcrds(target.crds, current)) {
        var piece = getPieceByCrds(mid);
    
        if (piece == null || piece.team != target.team) {
          points.push(mid);
        }
    
        if (piece == null) {
          var piece = getPieceByCrds(dest);
          
          if (piece == null || piece.team != target.team) {
            points.push(dest);
          }
        }
      }
    }

    function f(crds) {
      var piece = getPieceByCrds(crds);

      if (piece == null || piece.team != target.team) {
        points.push(crds);
      }
    }
    
    castle(ChoCastle.TL, ChoCastle.CENTER, ChoCastle.BR);
    castle(ChoCastle.TR, ChoCastle.CENTER, ChoCastle.BL);
    castle(ChoCastle.BR, ChoCastle.CENTER, ChoCastle.TL);
    castle(ChoCastle.BL, ChoCastle.CENTER, ChoCastle.TR);

    if (eqlcrds(target.crds, ChoCastle.CENTER)) {
      f(ChoCastle.TL);
      f(ChoCastle.TR);
      f(ChoCastle.BR);
      f(ChoCastle.BL);
    }

    castle(HanCastle.TL, HanCastle.CENTER, HanCastle.BR);
    castle(HanCastle.TR, HanCastle.CENTER, HanCastle.BL);
    castle(HanCastle.BR, HanCastle.CENTER, HanCastle.TL);
    castle(HanCastle.BL, HanCastle.CENTER, HanCastle.TR);

    if (eqlcrds(target.crds, HanCastle.CENTER)) {
      f(HanCastle.TL);
      f(HanCastle.TR);
      f(HanCastle.BR);
      f(HanCastle.BL);
    }
  }

  function getMa() {
    function f(root, a, b) {
      var [x, y] = target.crds;
  
      var piece = getPieceByCrds([x + root[0], y + root[1]]);
      
      if (piece == null) {
        var piece = getPieceByCrds([x + a[0], y + a[1]]);
  
        if (piece == null || piece.team != target.team) {
          if (inBoard(x + a[0], y + a[1])) {
            points.push([x + a[0], y + a[1]]);
          }
        }
  
        var piece = getPieceByCrds([x + b[0], y + b[1]]);
  
        if (piece == null || piece.team != target.team) {
          if (inBoard(x + b[0], y + b[1])) {
            points.push([x + b[0], y + b[1]]);
          }
        }
      }
    }

    f([0, -1], [-1, -2], [1, -2]);
    f([1, 0], [2, -1], [2, 1]);
    f([0, 1], [1, 2], [-1, 2]);
    f([-1, 0], [-2, -1], [-2, 1]);
  }

  function getSang() {
    function f(root, a1, a2, b1, b2) {
      var [x, y] = target.crds;
  
      var piece = getPieceByCrds([x + root[0], y + root[1]]);
      
      if (piece == null) {
        // a
        var piece = getPieceByCrds([x + a1[0], y + a1[1]]);
  
        if (piece == null) {
          var piece = getPieceByCrds([x + a2[0], y + a2[1]]);
  
          if (piece == null || piece.team != target.team) {
            if (inBoard(x + a2[0], y + a2[1])) {
              points.push([x + a2[0], y + a2[1]]);
            }
          }
        }
  
        // b
        var piece = getPieceByCrds([x + b1[0], y + b1[1]]);
  
        if (piece == null) {
          var piece = getPieceByCrds([x + b2[0], y + b2[1]]);
  
          if (piece == null || piece.team != target.team) {
            if (inBoard(x + b2[0], y + b2[1])) {
              points.push([x + b2[0], y + b2[1]]);
            }
          }
        }
      }
    }

    f([0, -1], [-1, -2], [-2, -3], [1, -2], [2, -3]);
    f([1, 0], [2, -1], [3, -2], [2, 1], [3, 2]);
    f([0, 1], [1, 2], [2, 3], [-1, 2], [-2, 3]);
    f([-1, 0], [-2, -1], [-3, -2], [-2, 1], [-3, 2]);
  }

  /* draw */
  
  function drawPieces() {
    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];
      
      // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      if (target && piece.id == target.id) {
        ctx.globalAlpha = 0.5;
      }
      ctx.drawImage(
        image, 
        piece.src[0], piece.src[1], 
        40, 40, 
        OFFSET_X + (piece.crds[0] * CELL_WIDTH) - 20, 
        OFFSET_Y + (piece.crds[1] * CELL_HEIGHT) - 20, 
        40, 40
      )
      ctx.globalAlpha = 1.0;
    }
  }

  function drawMessage() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(message, 40, 40);
  }

  function drawPoints() {
    for (var i=0; i<points.length; i++) {
      ctx.beginPath();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4;
      ctx.arc(
        OFFSET_X + (points[i][0] * CELL_WIDTH),
        OFFSET_Y + (points[i][1] * CELL_HEIGHT),
        10, 0, 2 * Math.PI
      );
      ctx.stroke();
    }
  }

  function drawBoard() {
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    // grid
    for (var r = 0; r <= ROW_COUNT; r++) {
      ctx.moveTo(OFFSET_X, OFFSET_Y + (CELL_HEIGHT * r));
      ctx.lineTo(OFFSET_X + WIDTH, OFFSET_Y + (CELL_HEIGHT * r));
    }

    for (var c = 0; c <= COL_COUNT; c++) {
      ctx.moveTo(OFFSET_X + (CELL_WIDTH * c), OFFSET_Y);
      ctx.lineTo(OFFSET_X + (CELL_WIDTH * c), OFFSET_Y + HEIGHT);
    }

    // cross around king area
    ctx.moveTo(OFFSET_X + (CELL_WIDTH * 3), OFFSET_Y + (CELL_HEIGHT * 0));
    ctx.lineTo(OFFSET_X + (CELL_WIDTH * 5), OFFSET_Y + (CELL_HEIGHT * 2));

    ctx.moveTo(OFFSET_X + (CELL_WIDTH * 5), OFFSET_Y + (CELL_HEIGHT * 0));
    ctx.lineTo(OFFSET_X + (CELL_WIDTH * 3), OFFSET_Y + (CELL_HEIGHT * 2));

    ctx.moveTo(OFFSET_X + (CELL_WIDTH * 3), OFFSET_Y + (CELL_HEIGHT * 7));
    ctx.lineTo(OFFSET_X + (CELL_WIDTH * 5), OFFSET_Y + (CELL_HEIGHT * 9));

    ctx.moveTo(OFFSET_X + (CELL_WIDTH * 5), OFFSET_Y + (CELL_HEIGHT * 7));
    ctx.lineTo(OFFSET_X + (CELL_WIDTH * 3), OFFSET_Y + (CELL_HEIGHT * 9));

    ctx.stroke();
  }

  function drawCursor() {
    ctx.beginPath();
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    ctx.arc(
      OFFSET_X + (x * CELL_WIDTH),
      OFFSET_Y + (y * CELL_HEIGHT),
      10, 0, 2 * Math.PI
    );
    ctx.stroke();
  }

  /* control */

  function clickHandler(e) {
    for (var r = 0; r <= ROW_COUNT; r++) {
      for (var c = 0; c <= COL_COUNT; c++) {
        var spot = SPOTS[r][c]; // intersection

        var a = Math.pow((e.clientX - spot[0]), 2) + Math.pow((e.clientY - spot[1]), 2);
        var b = Math.pow(CELL_HEIGHT / 2, 2);

        if (a <= b) {
          x = c;
          y = r;
        }
      }
    }
  }
})();

