(function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var image = new Image();
  image.src = "./pieces.png";
  
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.backgroundColor = "#eee";

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

  const HAN = 1
  const CHO = 2
  const ZOL = "zol"
  const PO = "po"
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
    constructor (name, crds, src, team) {
      this.name = name;
      this.crds = crds;
      this.src = src; 
      this.team = team;
    }
  }

  /* variables */

  var x = -1;
  var y = -1;
  var target;
  var points = [];
  var turn = CHO;
  
  var pieces = [
    new Piece(ZOL, [2, 3], [120, 80], HAN),
    new Piece(ZOL, [6, 3], [120, 80], HAN),
    new Piece(ZOL, [0, 3], [120, 80], HAN),
    new Piece(ZOL, [4, 3], [120, 80], HAN),
    new Piece(ZOL, [8, 3], [120, 80], HAN),
    new Piece(CHA, [0, 0], [120, 40], HAN),
    new Piece(CHA, [8, 0], [120, 40], HAN),
    new Piece(MA, [6, 0], [80, 80], HAN),
    new Piece(MA, [2, 0], [80, 80], HAN),
    new Piece(SANG, [1, 0], [120, 0], HAN),
    new Piece(SANG, [7, 0], [120, 0], HAN),
    new Piece(PO, [1, 2], [80, 120], HAN),
    new Piece(PO, [7, 2], [80, 120], HAN),
    new Piece(SA, [3, 0], [80, 40], HAN),
    new Piece(SA, [5, 0], [80, 40], HAN),
    new Piece(GUNG, [4, 1], [80, 0],  HAN),
    new Piece(ZOL, [2, 6], [40, 80], CHO),
    new Piece(ZOL, [6, 6], [40, 80], CHO),
    new Piece(ZOL, [0, 6], [40, 80], CHO),
    new Piece(ZOL, [4, 6], [40, 80], CHO),
    new Piece(ZOL, [8, 6], [40, 80], CHO),
    new Piece(CHA, [0, 9], [40, 40], CHO),
    new Piece(CHA, [8, 9], [40, 40], CHO),
    new Piece(MA, [2, 9], [0, 80], CHO),
    new Piece(MA, [6, 9], [0, 80], CHO),
    new Piece(SANG, [1, 9], [40, 0], CHO),
    new Piece(SANG, [7, 9], [40, 0], CHO),
    new Piece(PO, [1, 7], [0, 120], CHO),
    new Piece(PO, [7, 7], [0, 120], CHO),
    new Piece(SA, [3, 9], [0, 40], CHO),
    new Piece(SA, [5, 9], [0, 40], CHO),
    new Piece(GUNG, [4, 8], [0, 0], CHO),
  ]

  addEventListener("click", clickHandler);

  /* run the game */

  setInterval(interval, 10);

  function interval() {
    clearCanvas();
    
    setTarget();
    setPoints();
    move();

    drawTurn();
    drawBoard();
    drawTarget();
    drawPieces();
    drawPoints();
    drawCursor();
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
      getMa([0, -1], [-1, -2], [1, -2]);
      getMa([1, 0], [2, -1], [2, 1]);
      getMa([0, 1], [1, 2], [-1, 2]);
      getMa([-1, 0], [-2, -1], [-2, 1]);
    }

    if (target.name == SANG) {
      getSang([0, -1], [-1, -2], [-2, -3], [1, -2], [2, -3]);
      getSang([1, 0], [2, -1], [3, -2], [2, 1], [3, 2]);
      getSang([0, 1], [1, 2], [2, 3], [-1, 2], [-2, 3]);
      getSang([-1, 0], [-2, -1], [-3, -2], [-2, 1], [-3, 2]);
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
            pieces.splice(j, 1);
          }
        }

        // move
        target.crds = [x, y];

        // after move
        target = null;
        points = [];
        turn = turn == CHO ? HAN : CHO;
      }
    }
  }

  
  function getPo() {
    function po(x, y, dir, add) {
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
            po(x, y, dir, true);
          }
        } else {
          if (piece) {
            if (piece.name != PO) {
              po(x, y, dir, true);
            }
          } else {
            po(x, y, dir, false);
          }
        }
      }
    }

    function z(current, center, dest) {
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

    po(target.crds[0], target.crds[1], 0, false);
    po(target.crds[0], target.crds[1], 1, false);
    po(target.crds[0], target.crds[1], 2, false);
    po(target.crds[0], target.crds[1], 3, false);

    // Cho castle
    z(ChoCastle.TL, ChoCastle.CENTER, ChoCastle.BR);
    z(ChoCastle.TR, ChoCastle.CENTER, ChoCastle.BL);
    z(ChoCastle.BR, ChoCastle.CENTER, ChoCastle.TL);
    z(ChoCastle.BL, ChoCastle.CENTER, ChoCastle.TR);

    // Han castle
    z(HanCastle.TL, HanCastle.CENTER, HanCastle.BR);
    z(HanCastle.TR, HanCastle.CENTER, HanCastle.BL);
    z(HanCastle.BR, HanCastle.CENTER, HanCastle.TL);
    z(HanCastle.BL, HanCastle.CENTER, HanCastle.TR);
  }

  function getZol() {
    function v(crds) {
      var [x, y] = crds;

      if (inBoard(x, y)) {
        var piece = getPieceByCrds(crds);
  
        if (piece == null || piece.team != target.team) {
          points.push(crds);
        }
      }
    }

    if (target.team == CHO) {
      v([target.crds[0], target.crds[1] - 1])
    } else {
      v([target.crds[0], target.crds[1] + 1])
    }
    v([target.crds[0] - 1, target.crds[1]])
    v([target.crds[0] + 1, target.crds[1]])
    
    // on Han castle
    if (eqlcrds(target.crds, HanCastle.BL)) {
      v(HanCastle.CENTER);
    }

    if (eqlcrds(target.crds, HanCastle.CENTER)) {
      v(HanCastle.TL)
      v(HanCastle.TR)
    }

    if (eqlcrds(target.crds, HanCastle.BR)) {
      v(HanCastle.CENTER)
    }

    // on Cho castle
    if (eqlcrds(target.crds, ChoCastle.TL)) {
      v(ChoCastle.CENTER)
    }

    if (eqlcrds(target.crds, ChoCastle.CENTER)) {
      v(ChoCastle.BL)
      v(ChoCastle.BR)
    }

    if (eqlcrds(target.crds, ChoCastle.TR)) {
      v(ChoCastle.CENTER)
    }
  }

  function getGung() {
    function f(dest) {
      var piece = getPieceByCrds(dest);

      if (!piece || piece.team != target.team) {
        points.push(dest);
      }
    }

    // Cho
    if (eqlcrds(target.crds, ChoCastle.CENTER)) {
      f(ChoCastle.TL)
      f(ChoCastle.TM)
      f(ChoCastle.TR)
      f(ChoCastle.RM)
      f(ChoCastle.BR)
      f(ChoCastle.BM)
      f(ChoCastle.BL)
      f(ChoCastle.LM)
    }

    if (eqlcrds(target.crds, ChoCastle.TL)) {
      f(ChoCastle.TM)
      f(ChoCastle.CENTER)
      f(ChoCastle.LM)
    } 

    if (eqlcrds(target.crds, ChoCastle.TM)) {
      f(ChoCastle.TL)
      f(ChoCastle.CENTER)
      f(ChoCastle.TR)
    } 

    if (eqlcrds(target.crds, ChoCastle.TR)) {
      f(ChoCastle.TM)
      f(ChoCastle.CENTER)
      f(ChoCastle.RM)
    }

    if (eqlcrds(target.crds, ChoCastle.RM)) {
      f(ChoCastle.TR)
      f(ChoCastle.CENTER)
      f(ChoCastle.BR)
    } 

    if (eqlcrds(target.crds, ChoCastle.BR)) {
      f(ChoCastle.RM)
      f(ChoCastle.CENTER)
      f(ChoCastle.BM)
    } 

    if (eqlcrds(target.crds, ChoCastle.BM)) {
      f(ChoCastle.BL)
      f(ChoCastle.CENTER)
      f(ChoCastle.BR)
    } 

    if (eqlcrds(target.crds, ChoCastle.BL)) {
      f(ChoCastle.LM)
      f(ChoCastle.CENTER)
      f(ChoCastle.BM)
    } 

    if (eqlcrds(target.crds, ChoCastle.LM)) {
      f(ChoCastle.TL)
      f(ChoCastle.CENTER)
      f(ChoCastle.BL)
    } 

    // Han
    if (eqlcrds(target.crds, HanCastle.CENTER)) {
      f(HanCastle.TL)
      f(HanCastle.TM)
      f(HanCastle.TR)
      f(HanCastle.RM)
      f(HanCastle.BR)
      f(HanCastle.BM)
      f(HanCastle.BL)
      f(HanCastle.LM)
    }

    if (eqlcrds(target.crds, HanCastle.TL)) {
      f(HanCastle.TM)
      f(HanCastle.CENTER)
      f(HanCastle.LM)
    } 

    if (eqlcrds(target.crds, HanCastle.TM)) {
      f(HanCastle.TL)
      f(HanCastle.CENTER)
      f(HanCastle.TR)
    } 

    if (eqlcrds(target.crds, HanCastle.TR)) {
      f(HanCastle.TM)
      f(HanCastle.CENTER)
      f(HanCastle.RM)
    }

    if (eqlcrds(target.crds, HanCastle.RM)) {
      f(HanCastle.TR)
      f(HanCastle.CENTER)
      f(HanCastle.BR)
    } 

    if (eqlcrds(target.crds, HanCastle.BR)) {
      f(HanCastle.RM)
      f(HanCastle.CENTER)
      f(HanCastle.BM)
    } 

    if (eqlcrds(target.crds, HanCastle.BM)) {
      f(HanCastle.BL)
      f(HanCastle.CENTER)
      f(HanCastle.BR)
    } 

    if (eqlcrds(target.crds, HanCastle.BL)) {
      f(HanCastle.LM)
      f(HanCastle.CENTER)
      f(HanCastle.BM)
    } 

    if (eqlcrds(target.crds, HanCastle.LM)) {
      f(HanCastle.TL)
      f(HanCastle.CENTER)
      f(HanCastle.BL)
    } 
  }
  
  function getCha() {

    function rc(x, y, dir) {
      if (dir == 0) y--;
      if (dir == 1) x++;
      if (dir == 2) y++;
      if (dir == 3) x--;

      if (inBoard(x, y)) {
        var piece = getPieceByCrds([x, y]);
      
        if (piece == null) {
          points.push([x, y]);
          rc(x, y, dir);
        } else {
          if (piece.team != target.team) {
            points.push([x, y]);
          }
        }
      }
    }

    // north
    rc(target.crds[0], target.crds[1], 0);
    // east
    rc(target.crds[0], target.crds[1], 1);
    // south
    rc(target.crds[0], target.crds[1], 2);
    // west
    rc(target.crds[0], target.crds[1], 3);
    

    function f(current, mid, dest) {
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

    function v(crds) {
      var piece = getPieceByCrds(crds);

      if (piece == null || piece.team != target.team) {
        points.push(crds);
      }
    }
    
    // on the Cho castle 
    f(ChoCastle.TL, ChoCastle.CENTER, ChoCastle.BR);
    f(ChoCastle.TR, ChoCastle.CENTER, ChoCastle.BL);
    f(ChoCastle.BR, ChoCastle.CENTER, ChoCastle.TL);
    f(ChoCastle.BL, ChoCastle.CENTER, ChoCastle.TR);

    if (eqlcrds(target.crds, ChoCastle.CENTER)) {
      v(ChoCastle.TL);
      v(ChoCastle.TR);
      v(ChoCastle.BR);
      v(ChoCastle.BL);
    }

    // on the Han castle
    f(HanCastle.TL, HanCastle.CENTER, HanCastle.BR);
    f(HanCastle.TR, HanCastle.CENTER, HanCastle.BL);
    f(HanCastle.BR, HanCastle.CENTER, HanCastle.TL);
    f(HanCastle.BL, HanCastle.CENTER, HanCastle.TR);

    if (eqlcrds(target.crds, HanCastle.CENTER)) {
      v(HanCastle.TL);
      v(HanCastle.TR);
      v(HanCastle.BR);
      v(HanCastle.BL);
    }
  }

  function getMa(root, a, b) {
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

  function getSang(root, a1, a2, b1, b2) {
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

  /* draw */
  
  function drawPieces() {
    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];

      // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      ctx.drawImage(
        image, 
        piece.src[0], piece.src[1], 
        40, 40, 
        OFFSET_X + (piece.crds[0] * CELL_WIDTH) - 20, 
        OFFSET_Y + (piece.crds[1] * CELL_HEIGHT) - 20, 
        40, 40
      )
    }
  }

  function drawTurn() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(
      "turn: " + turn, 
      40, 
      40,
    );
  }

  function drawPoints() {
    for (var i=0; i<points.length; i++) {
      ctx.beginPath();
      ctx.strokeStyle = "#f00";
      ctx.lineWidth = 2;
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

  function drawTarget() {
    if (!target) return;
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(
      OFFSET_X + (target.crds[0] * CELL_WIDTH),
      OFFSET_Y + (target.crds[1] * CELL_HEIGHT),
      10, 0, 2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();
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

