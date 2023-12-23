(function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const image = new Image();
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
      SPOTS[r][c] = [
        OFFSET_X + (c * CELL_WIDTH),
        OFFSET_Y + (r * CELL_HEIGHT)
      ]
    }
  }

  /* enums */

  const Han = {
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

  const Cho = {
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

  /* variables */

  var x = -1;
  var y = -1;
  var target;
  var points = [];
  var turn = "cho";

  class Piece {
    constructor (id, name, crds, size, team) {
      this.id = id;
      this.name = name;
      this.crds = crds;
      this.size = size;
      this.team = team;
    }
  }

  var pieces = [
    { id: "hz1", name: "졸", crds: [2, 3], src:[120, 80], team: "han" },
    { id: "hz2", name: "졸", crds: [6, 3], src:[120, 80], team: "han" },
    { id: "hz3", name: "졸", crds: [0, 3], src:[120, 80], team: "han" },
    { id: "hz4", name: "졸", crds: [4, 3], src:[120, 80], team: "han" },
    { id: "hz5", name: "졸", crds: [8, 3], src:[120, 80], team: "han" },
    { id: "hc1", name: "차", crds: [0, 0], src:[120, 40], team: "han" },
    { id: "hc2", name: "차", crds: [8, 0], src:[120, 40], team: "han" },
    { id: "hm1", name: "마", crds: [6, 0], src:[80, 80], team: "han" },
    { id: "hm2", name: "마", crds: [2, 0], src:[80, 80], team: "han" },
    { id: "hs2", name: "상", crds: [1, 0], src:[120, 0], team: "han" },
    { id: "hs1", name: "상", crds: [7, 0], src:[120, 0], team: "han" },
    { id: "hp1", name: "포", crds: [1, 2], src:[80, 120], team: "han" },
    { id: "hp2", name: "포", crds: [7, 2], src:[80, 120], team: "han" },
    { id: "hsa2", name: "사", crds: [3, 0], src: [80, 40], team: "han" },
    { id: "hsa1", name: "사", crds: [5, 0], src: [80, 40], team: "han" },
    { id: "h", name: "궁", crds: [4, 1], src: [80, 0], team: "han", },
    { id: "cz1", name: "졸", crds: [2, 6], src: [40, 80], team: "cho" },
    { id: "cz2", name: "졸", crds: [6, 6], src: [40, 80], team: "cho" },
    { id: "cz3", name: "졸", crds: [0, 6], src: [40, 80], team: "cho" },
    { id: "cz4", name: "졸", crds: [4, 6], src: [40, 80], team: "cho" },
    { id: "cz5", name: "졸", crds: [8, 6], src: [40, 80], team: "cho" },
    { id: "cc1", name: "차", crds: [0, 9], src: [40, 40], team: "cho" },
    { id: "cc2", name: "차", crds: [8, 9], src: [40, 40], team: "cho" },
    { id: "cm1", name: "마", crds: [2, 9], src: [0, 80], team: "cho" },
    { id: "cm2", name: "마", crds: [6, 9], src: [0, 80], team: "cho" },
    { id: "cs1", name: "상", crds: [1, 9], src: [40, 0], team: "cho" },
    { id: "cs2", name: "상", crds: [7, 9], src: [40, 0], team: "cho" },
    { id: "cp1", name: "포", crds: [1, 7], src: [0, 120], team: "cho" },
    { id: "cp2", name: "포", crds: [7, 7], src: [0, 120], team: "cho" },
    { id: "csa1", name: "사", crds: [3, 9], src: [0, 40], team: "cho" },
    { id: "csa2", name: "사", crds: [5, 9], src: [0, 40], team: "cho" },
    { id: "c", name: "궁", crds: [4, 8], src: [0, 0], team: "cho" },
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

    if (target.name == "졸") {
      getZol();
    }

    if (target.name == "마") {
      getMa([0, -1], [-1, -2], [1, -2]);
      getMa([1, 0], [2, -1], [2, 1]);
      getMa([0, 1], [1, 2], [-1, 2]);
      getMa([-1, 0], [-2, -1], [-2, 1]);
    }

    if (target.name == "상") {
      getSang([0, -1], [-1, -2], [-2, -3], [1, -2], [2, -3]);
      getSang([1, 0], [2, -1], [3, -2], [2, 1], [3, 2]);
      getSang([0, 1], [1, 2], [2, 3], [-1, 2], [-2, 3]);
      getSang([-1, 0], [-2, -1], [-3, -2], [-2, 1], [-3, 2]);
    }

    if (target.name == "차") {
      getCha();
    }

    if (target.name == "포") {
      getPo()
    }

    if (target.name == "궁") {
      getGung();
    }

    if (target.name == "사") {
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
        turn = turn == "cho" ? "han" : "cho";
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
              if (piece.name != "포") {
                points.push([x, y]); 
              }
            }
          } else {
            points.push([x, y]); 
            po(x, y, dir, true);
          }
        } else {
          if (piece) {
            if (piece.name != "포") {
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
          if (piece.name != "포") {
            var piece = getPieceByCrds(dest);
    
            if (piece) {
              if (piece.team != turn) {
                if (piece.name != "포") {
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
    z(Cho.TL, Cho.CENTER, Cho.BR);
    z(Cho.TR, Cho.CENTER, Cho.BL);
    z(Cho.BR, Cho.CENTER, Cho.TL);
    z(Cho.BL, Cho.CENTER, Cho.TR);

    // Han castle
    z(Han.TL, Han.CENTER, Han.BR);
    z(Han.TR, Han.CENTER, Han.BL);
    z(Han.BR, Han.CENTER, Han.TL);
    z(Han.BL, Han.CENTER, Han.TR);
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

    if (target.team == "cho") {
      v([target.crds[0], target.crds[1] - 1])
    } else {
      v([target.crds[0], target.crds[1] + 1])
    }
    v([target.crds[0] - 1, target.crds[1]])
    v([target.crds[0] + 1, target.crds[1]])
    
    // on Han castle
    if (eqlcrds(target.crds, Han.BL)) {
      v(Han.CENTER);
    }

    if (eqlcrds(target.crds, Han.CENTER)) {
      v(Han.TL)
      v(Han.TR)
    }

    if (eqlcrds(target.crds, Han.BR)) {
      v(Han.CENTER)
    }

    // on Cho castle
    if (eqlcrds(target.crds, Cho.TL)) {
      v(Cho.CENTER)
    }

    if (eqlcrds(target.crds, Cho.CENTER)) {
      v(Cho.BL)
      v(Cho.BR)
    }

    if (eqlcrds(target.crds, Cho.TR)) {
      v(Cho.CENTER)
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
    if (eqlcrds(target.crds, Cho.CENTER)) {
      f(Cho.TL)
      f(Cho.TM)
      f(Cho.TR)
      f(Cho.RM)
      f(Cho.BR)
      f(Cho.BM)
      f(Cho.BL)
      f(Cho.LM)
    }

    if (eqlcrds(target.crds, Cho.TL)) {
      f(Cho.TM)
      f(Cho.CENTER)
      f(Cho.LM)
    } 

    if (eqlcrds(target.crds, Cho.TM)) {
      f(Cho.TL)
      f(Cho.CENTER)
      f(Cho.TR)
    } 

    if (eqlcrds(target.crds, Cho.TR)) {
      f(Cho.TM)
      f(Cho.CENTER)
      f(Cho.RM)
    }

    if (eqlcrds(target.crds, Cho.RM)) {
      f(Cho.TR)
      f(Cho.CENTER)
      f(Cho.BR)
    } 

    if (eqlcrds(target.crds, Cho.BR)) {
      f(Cho.RM)
      f(Cho.CENTER)
      f(Cho.BM)
    } 

    if (eqlcrds(target.crds, Cho.BM)) {
      f(Cho.BL)
      f(Cho.CENTER)
      f(Cho.BR)
    } 

    if (eqlcrds(target.crds, Cho.BL)) {
      f(Cho.LM)
      f(Cho.CENTER)
      f(Cho.BM)
    } 

    if (eqlcrds(target.crds, Cho.LM)) {
      f(Cho.TL)
      f(Cho.CENTER)
      f(Cho.BL)
    } 

    // Han
    if (eqlcrds(target.crds, Han.CENTER)) {
      f(Han.TL)
      f(Han.TM)
      f(Han.TR)
      f(Han.RM)
      f(Han.BR)
      f(Han.BM)
      f(Han.BL)
      f(Han.LM)
    }

    if (eqlcrds(target.crds, Han.TL)) {
      f(Han.TM)
      f(Han.CENTER)
      f(Han.LM)
    } 

    if (eqlcrds(target.crds, Han.TM)) {
      f(Han.TL)
      f(Han.CENTER)
      f(Han.TR)
    } 

    if (eqlcrds(target.crds, Han.TR)) {
      f(Han.TM)
      f(Han.CENTER)
      f(Han.RM)
    }

    if (eqlcrds(target.crds, Han.RM)) {
      f(Han.TR)
      f(Han.CENTER)
      f(Han.BR)
    } 

    if (eqlcrds(target.crds, Han.BR)) {
      f(Han.RM)
      f(Han.CENTER)
      f(Han.BM)
    } 

    if (eqlcrds(target.crds, Han.BM)) {
      f(Han.BL)
      f(Han.CENTER)
      f(Han.BR)
    } 

    if (eqlcrds(target.crds, Han.BL)) {
      f(Han.LM)
      f(Han.CENTER)
      f(Han.BM)
    } 

    if (eqlcrds(target.crds, Han.LM)) {
      f(Han.TL)
      f(Han.CENTER)
      f(Han.BL)
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
    f(Cho.TL, Cho.CENTER, Cho.BR);
    f(Cho.TR, Cho.CENTER, Cho.BL);
    f(Cho.BR, Cho.CENTER, Cho.TL);
    f(Cho.BL, Cho.CENTER, Cho.TR);

    if (eqlcrds(target.crds, Cho.CENTER)) {
      v(Cho.TL);
      v(Cho.TR);
      v(Cho.BR);
      v(Cho.BL);
    }

    // on the Han castle
    f(Han.TL, Han.CENTER, Han.BR);
    f(Han.TR, Han.CENTER, Han.BL);
    f(Han.BR, Han.CENTER, Han.TL);
    f(Han.BL, Han.CENTER, Han.TR);

    if (eqlcrds(target.crds, Han.CENTER)) {
      v(Han.TL);
      v(Han.TR);
      v(Han.BR);
      v(Han.BL);
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

