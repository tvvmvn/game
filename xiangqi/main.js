(function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.backgroundColor = "#333";

  /* constants */

  const OFFSET_X = 20;
  const OFFSET_Y = 40;
  const ROW_COUNT = 9;
  const COL_COUNT = 8;
  const WIDTH = 460;
  const HEIGHT = 345;
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
    TR: [5, 0],
    BR: [5, 2],
    BL: [3, 2],
    CENTER: [4, 1],
    TM: [4, 0],
    RM: [5, 1],
    BM: [4, 2],
    LM: [3, 1],
  }

  const Cho = {
    TL: [3, 7],
    TR: [5, 7],
    BR: [5, 9],
    BL: [3, 9],
    CENTER: [4, 8],
    TM: [4, 7],
    RM: [5, 8],
    BM: [4, 9],
    LM: [3, 8],
  }

  /* variables */

  var x = -1;
  var y = -1;
  var target;
  var points = [];
  var turn = "cho";

  var pieces = [
    { id: "hz1", name: "졸", crds: [2, 3], size: 15, team: "han", color: "#f00" },
    { id: "hz2", name: "졸", crds: [6, 3], size: 15, team: "han", color: "#f00" },
    { id: "hc1", name: "차", crds: [0, 0], size: 20, team: "han", color: "#f00" },
    { id: "hc2", name: "차", crds: [8, 0], size: 20, team: "han", color: "#f00" },
    { id: "hm1", name: "마", crds: [6, 0], size: 20, team: "han", color: "#f00" },
    { id: "hm2", name: "마", crds: [2, 0], size: 20, team: "han", color: "#f00" },
    { id: "h", name: "궁", crds: [4, 1], size: 30, team: "han", color: "#f00" },
    // VS
    { id: "cz1", name: "졸", crds: [2, 6], size: 15, team: "cho", color: "#0b0" },
    { id: "cz2", name: "졸", crds: [6, 6], size: 15, team: "cho", color: "#0b0" },
    { id: "cc1", name: "차", crds: [0, 9], size: 20, team: "cho", color: "#0b0" },
    { id: "cc2", name: "차", crds: [8, 9], size: 20, team: "cho", color: "#0b0" },
    { id: "cm1", name: "마", crds: [2, 9], size: 20, team: "cho", color: "#0b0" },
    { id: "cm2", name: "마", crds: [6, 9], size: 20, team: "cho", color: "#0b0" },
    { id: "c", name: "궁", crds: [4, 8], size: 30, team: "cho", color: "#0b0" },
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
  
  function eqlcrds(crds1, crds2) {
    return crds1[0] == crds2[0] && crds1[1] == crds2[1];
  }

  function getPieceByCrds(x, y) {
    var _piece = null;

    for (var i=0; i<pieces.length; i++) {
      if (eqlcrds(pieces[i].crds, [x, y])) {
        _piece = pieces[i];
        break;
      }
    }

    return _piece;
  }
  
  function setTarget() {
    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];

      if (piece.team == turn) {
        if (eqlcrds([x, y], piece.crds)) {
          target = piece;
          break;
        }
      }
    }
  }

  function setPoints() {
    if (!target) {
      points = [];
      return;
    }

    if (target.name == "졸") {
      var _points = [];

      // front
      if (target.team == "cho") {
        var piece = getPieceByCrds(target.crds[0], target.crds[1] - 1)
        
        if (piece == null || piece.team != target.team) {
          _points.push([target.crds[0], target.crds[1] - 1])
        }
      } 
      
      if (target.team == "han") { 
        var piece = getPieceByCrds(target.crds[0], target.crds[1] + 1)
        
        if (piece == null || piece.team != target.team) {
          _points.push([target.crds[0], target.crds[1] + 1])
        }
      }

      // side
      var piece = getPieceByCrds(target.crds[0] - 1, target.crds[1]);
      
      if (piece == null || piece.team != target.team) {
        _points.push([target.crds[0] - 1, target.crds[1]])
      }

      // side
      var piece = getPieceByCrds(target.crds[0] + 1, target.crds[1]);

      if (!piece || piece.team != target.team) {
        _points.push([target.crds[0] + 1, target.crds[1]])
      }

      points = _points;
    }

    if (target.name == "마") {
      points = getMa()
    }

    if (target.name == "차") {
      points = getCha();
    }

    if (target.name == "궁") {
      if (target.team == "cho") {
        points = getChoGung();
      } else {
        points = getHanGung();
      }
    }
  }

  function move() {
    for (var i=0; i<points.length; i++) {
      if (eqlcrds([x, y], points[i])) {
        var victim = getPieceByCrds(x, y);

        target.crds[0] = x;
        target.crds[1] = y;

        // remove victim from pieces
        if (victim) {
          for (var j=0; j<pieces.length; j++) {
            if (victim.id == pieces[j].id) {
              pieces.splice(j, 1);
            }
          }
        }

        // after move
        target = null;
        turn = turn == "cho" ? "han" : "cho";
      }
    }
  }

  function getChoGung() {
    var _points = [];

    if (eqlcrds(target.crds, Cho.CENTER)) {
      var tmp = [
        Cho.TL, Cho.TM, Cho.TR, Cho.RM,
        Cho.BR, Cho.BM, Cho.BL, Cho.LM
      ];
      var arr = [];

      for (var i=0; i<tmp.length; i++) {
        var piece = getPieceByCrds(tmp[i][0], tmp[i][1]);

        if (!piece || piece.team != target.team) {
          arr.push(tmp[i]);
        }
      }

      _points = arr;
    }

    if (eqlcrds(target.crds, Cho.TL)) {
      var tmp = [Cho.TM, Cho.CENTER, Cho.LM];
      var arr = [];
      
      for (var i=0; i<tmp.length; i++) {
        var piece = getPieceByCrds(tmp[i][0], tmp[i][1]);

        if (!piece || piece.team != target.team) {
          arr.push(tmp[i]);
        }
      }

      _points = arr;
    }

    return _points;
  }

  function getHanGung() {
    var _points = [];

    if (eqlcrds(target.crds, Han.CENTER)) {
      var tmp = [
        Han.TL, Han.TM, Han.TR, Han.RM,
        Han.BR, Han.BM, Han.BL, Han.LM
      ];
      var arr = [];

      for (var i=0; i<tmp.length; i++) {
        var piece = getPieceByCrds(tmp[i][0], tmp[i][1]);

        if (!piece || piece.team != target.team) {
          arr.push(tmp[i]);
        }
      }

      _points = arr;
    }

    if (eqlcrds(target.crds, Han.TL)) {
      var tmp = [Han.TM, Han.CENTER, Han.LM];
      var arr = [];
      
      for (var i=0; i<tmp.length; i++) {
        var piece = getPieceByCrds(tmp[i][0], tmp[i][1]);

        if (!piece || piece.team != target.team) {
          arr.push(tmp[i]);
        }
      }

      _points = arr;
    }

    return _points;
  }

  function getCha() {
    var _points = [];

    // north
    for (var i = target.crds[1] - 1; i >= 0; i--) {
      var piece = getPieceByCrds(target.crds[0], i);

      if (piece == null) {
        _points.push([target.crds[0], i]);

      } else {
        if (piece.team != target.team) {
          _points.push([target.crds[0], i]);
        }

        break;
      }
    }

    // right
    for (var i = target.crds[0] + 1; i <= COL_COUNT; i++) {
      var piece = getPieceByCrds(i, target.crds[1]);

      if (piece == null) {
        _points.push([i, target.crds[1]]);        

      } else {
        if (piece.team != target.team) {
          _points.push([i, target.crds[1]]);        
        }

        break;
      }
    }

    // south
    for (var i = target.crds[1] + 1; i <= ROW_COUNT; i++) {
      var piece = getPieceByCrds(target.crds[0], i);

      if (piece == null) {
        _points.push([target.crds[0], i]);

      } else {
        if (piece.team != target.team) {
          _points.push([target.crds[0], i]);
        }

        break;
      }
    }

    // left
    for (var i = target.crds[0] - 1; i >= 0; i--) {
      var piece = getPieceByCrds(i, target.crds[1]);

      if (piece == null) {
        _points.push([i, target.crds[1]]);

      } else {
        if (piece.team != target.team) {
          _points.push([i, target.crds[1]]);
        }

        break;
      }
    }

    // on the castle (ours)
    if (eqlcrds(target.crds, Cho.TL)) {
      var piece = getPieceByCrds(Cho.CENTER[0], Cho.CENTER[1]);

      if (piece == null || piece.team != target.team) {
        _points.push(Cho.CENTER);
      }

      if (piece == null) {
        _points.push(Cho.BR);
      }
    }

    if (eqlcrds(target.crds, Cho.TR)) {
      var piece = getPieceByCrds(Cho.CENTER[0], Cho.CENTER[1]);

      if (piece == null || piece.team != target.team) {
        _points.push(Cho.CENTER);
      }

      if (piece == null) {
        _points.push(Cho.BL);
      }
    }

    if (eqlcrds(target.crds, Cho.BR)) {
      var piece = getPieceByCrds(Cho.CENTER[0], Cho.CENTER[1]);

      if (piece == null || piece.team != target.team) {
        _points.push(Cho.CENTER);
      }

      if (piece == null) {
        _points.push(Cho.TL);
      }
    }

    if (eqlcrds(target.crds, Cho.BL)) {
      var piece = getPieceByCrds(Cho.CENTER[0], Cho.CENTER[1]);

      if (piece == null || piece.team != target.team) {
        _points.push(Cho.CENTER);
      }

      if (piece == null) {
        _points.push(Cho.TR);
      }
    }

    if (eqlcrds(target.crds, Cho.CENTER)) {
      var arr = [Cho.TL, Cho.TR, Cho.BR, Cho.BL];

      for (var i=0; i<arr.length; i++) {
        var piece = getPieceByCrds(arr[i][0], arr[[i][1]]);

        if (piece == null || piece.team != target.team) {
          _points.push(arr[i]);
        }
      }
    }

    // on the enemy castle
    if (eqlcrds(target.crds, Han.TL)) {
      var piece = getPieceByCrds(Han.CENTER[0], Han.CENTER[1]);

      if (piece == null || piece.team != target.team) {
        _points.push(Han.CENTER);
      }

      if (piece == null) {
        _points.push(Han.BR);
      }
    }

    if (eqlcrds(target.crds, Han.TR)) {
      var piece = getPieceByCrds(Han.CENTER[0], Han.CENTER[1]);

      if (piece == null || piece.team != target.team) {
        _points.push(Han.CENTER);
      }

      if (piece == null) {
        _points.push(Han.BL);
      }
    }

    if (eqlcrds(target.crds, Han.BR)) {
      var piece = getPieceByCrds(Han.CENTER[0], Han.CENTER[1]);

      if (piece == null || piece.team != target.team) {
        _points.push(Han.CENTER);
      }

      if (piece == null) {
        _points.push(Han.TL);
      }
    }

    if (eqlcrds(target.crds, Han.BL)) {
      var piece = getPieceByCrds(Han.CENTER[0], Han.CENTER[1]);

      if (piece == null || piece.team != target.team) {
        _points.push(Han.CENTER);
      }

      if (piece == null) {
        _points.push(Han.TR);
      }
    }

    if (eqlcrds(target.crds, Han.CENTER)) {
      var arr = [Han.TL, Han.TR, Han.BR, Han.BL];

      for (var i=0; i<arr.length; i++) {
        var piece = getPieceByCrds(arr[i][0], arr[[i][1]]);

        if (piece == null || piece.team != target.team) {
          _points.push(arr[i]);
        }
      }
    }

    return _points;
  }

  function getMa() {
    var _points = [];

    // up
    var piece = getPieceByCrds(target.crds[0], target.crds[1] - 1);
    
    if (piece == null) {
      var piece = getPieceByCrds(target.crds[0] - 1, target.crds[1] - 2);

      if (piece == null || piece.team != target.team) {
        _points.push([target.crds[0] - 1, target.crds[1] - 2]);
      }

      var piece = getPieceByCrds(target.crds[0] + 1, target.crds[1] - 2);

      if (piece == null || piece.team != target.team) {
        _points.push([target.crds[0] + 1, target.crds[1] - 2]);
      }
    }

    // right
    var piece = getPieceByCrds(target.crds[0] + 1, target.crds[1]);

    if (piece == null) {
      var piece = getPieceByCrds(target.crds[0] + 2, target.crds[1] - 1);

      if (piece == null || piece.team != target.team) {
        _points.push([target.crds[0] + 2, target.crds[1] - 1]);
      }

      var piece = getPieceByCrds(target.crds[0] + 2, target.crds[1] + 1);

      if (piece == null || piece.team != target.team) {
        _points.push([target.crds[0] + 2, target.crds[1] + 1]);
      }
    }

    // down
    var piece = getPieceByCrds(target.crds[0], target.crds[1] + 1);

    if (piece == null) {
      var piece = getPieceByCrds(target.crds[0], target.crds[1] + 1);

      if (piece == null || piece.team != target.team) {
        _points.push([target.crds[0] + 1, target.crds[1] + 2]);
      }

      var piece = getPieceByCrds(target.crds[0] - 1, target.crds[1] + 2);

      if (piece == null || piece.team != target.team) {
        _points.push([target.crds[0] - 1, target.crds[1] + 2]);
      }
    }

    // left
    var piece = getPieceByCrds(target.crds[0] - 1, target.crds[1]);

    if (piece == null) {
      var piece = getPieceByCrds(target.crds[0] - 2, target.crds[1] + 1);

      if (piece == null || piece.team != target.team) {
        _points.push([target.crds[0] - 2, target.crds[1] + 1]);
      }

      var piece = getPieceByCrds(target.crds[0] - 2, target.crds[1] - 1);

      if (piece == null || piece.team != target.team) {
        _points.push([target.crds[0] - 2, target.crds[1] - 1]);
      }
    }

    return _points;
  }

  /* draw */
  
  function drawPieces() {
    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];

      ctx.font = piece.size + "px Arial";
      ctx.fillStyle = piece.color;
      ctx.fillText(
        piece.name, 
        OFFSET_X + (piece.crds[0] * CELL_WIDTH) - piece.size / 2.5, 
        OFFSET_Y + (piece.crds[1] * CELL_HEIGHT) + piece.size / 3,
      );
    }
  }

  function drawTurn() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(
      "turn: " + turn, 
      20, 
      20,
    );
  }

  function drawPoints() {
    for (var i=0; i<points.length; i++) {
      ctx.beginPath();
      ctx.strokeStyle = "#ff0";
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
    ctx.strokeStyle = "#00f";
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
})()

