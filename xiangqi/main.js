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
    { id: "hs2", name: "상", crds: [1, 0], size: 20, team: "han", color: "#f00" },
    { id: "hs1", name: "상", crds: [7, 0], size: 20, team: "han", color: "#f00" },
    { id: "hp1", name: "포", crds: [1, 2], size: 20, team: "han", color: "#f00" },
    { id: "hp2", name: "포", crds: [7, 2], size: 20, team: "han", color: "#f00" },
    { id: "h", name: "궁", crds: [4, 1], size: 30, team: "han", color: "#f00" },
    { id: "hsa2", name: "사", crds: [3, 0], size: 15, team: "han", color: "#f00" },
    { id: "hsa1", name: "사", crds: [5, 0], size: 15, team: "han", color: "#f00" },
    // VS
    { id: "cz1", name: "졸", crds: [2, 6], size: 15, team: "cho", color: "#0b0" },
    { id: "cz2", name: "졸", crds: [6, 6], size: 15, team: "cho", color: "#0b0" },
    { id: "cc1", name: "차", crds: [0, 9], size: 20, team: "cho", color: "#0b0" },
    { id: "cc2", name: "차", crds: [8, 9], size: 20, team: "cho", color: "#0b0" },
    { id: "cm1", name: "마", crds: [2, 9], size: 20, team: "cho", color: "#0b0" },
    { id: "cm2", name: "마", crds: [6, 9], size: 20, team: "cho", color: "#0b0" },
    { id: "cs1", name: "상", crds: [1, 9], size: 20, team: "cho", color: "#0b0" },
    { id: "cs2", name: "상", crds: [7, 9], size: 20, team: "cho", color: "#0b0" },
    { id: "cp1", name: "포", crds: [1, 7], size: 20, team: "cho", color: "#0b0" },
    { id: "cp2", name: "포", crds: [7, 7], size: 20, team: "cho", color: "#0b0" },
    { id: "c", name: "궁", crds: [4, 8], size: 30, team: "cho", color: "#0b0" },
    { id: "csa1", name: "사", crds: [3, 9], size: 15, team: "cho", color: "#0b0" },
    { id: "csa2", name: "사", crds: [5, 9], size: 15, team: "cho", color: "#0b0" },
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
      getPo();
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
        
        var victim = getPieceByCrds([x, y]);

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
        points = [];
        turn = turn == "cho" ? "han" : "cho";
      }
    }
  }

  function getPo() {
    // north
    var arrived = false;
    var bridge;

    for (var y = target.crds[1] - 1; y >= 0; y--) {
      if (!arrived) {
        bridge = getPieceByCrds([target.crds[0], y]);

        if (bridge) {
          if (bridge.name == "포") {
            break;
          }

          arrived = true;
          continue;
        } 
      }

      // start to add
      if (arrived) {
        var piece = getPieceByCrds([target.crds[0], y]);

        if (piece) {
          if (piece.name == "포") {
            break;
          }

          if (piece.team != target.team) {
            points.push([target.crds[0], y]);
          }
          
          break;
        } else {
          points.push([target.crds[0], y]);
        }
      }
    }
  }

  function getZol() {
    function zol(a, b) {
      var _x = target.crds[0];
      var _y = target.crds[1];
  
      var piece = getPieceByCrds([_x + a, _y + b])
        
      if (piece == null || piece.team != target.team) {
        points.push([_x + a, _y + b])
      }
    }

    if (target.team == "cho") {
      zol(0, -1)
    } else {
      zol(0, 1)
    }
    zol(-1, 0)
    zol(1, 0)

    function v(dest) {
      var piece = getPieceByCrds(dest);

      if (piece == null || piece.team != target.team) {
        points.push(dest);
      }
    }
    
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
    function f(current, dests) {
      if (eqlcrds(target.crds, current)) {
        var arr = [];
  
        for (var i = 0; i < dests.length; i++) {
          var piece = getPieceByCrds(dests[i]);
  
          if (!piece || piece.team != target.team) {
            arr.push(dests[i]);
          }
        }
  
        points = arr;
      }
    }

    // Cho
    if (target.team == "cho") {
      f(
        Cho.CENTER, 
        [Cho.TL, Cho.TM, Cho.TR, Cho.RM, Cho.BR, Cho.BM, Cho.BL, Cho.LM]
      )
  
      f(Cho.TL, [Cho.TM, Cho.CENTER, Cho.LM])
      f(Cho.TM, [Cho.TL, Cho.CENTER, Cho.TR])
      f(Cho.TR, [Cho.TM, Cho.CENTER, Cho.RM])
      f(Cho.RM, [Cho.TR, Cho.CENTER, Cho.BR])

      f(Cho.BR, [Cho.RM, Cho.CENTER, Cho.BM])
      f(Cho.BM, [Cho.BL, Cho.CENTER, Cho.BR])
      f(Cho.BL, [Cho.LM, Cho.CENTER, Cho.BM])
      f(Cho.LM, [Cho.TL, Cho.CENTER, Cho.BL])
    } 

    // Han
    if (target.team == "han") {
      f(
        Han.CENTER,
        [Han.TL, Han.TM, Han.TR, Han.RM, Han.BR, Han.BM, Han.BL, Han.LM]
      )

      f(Han.TL, [Han.TM, Han.CENTER, Han.LM])
      f(Han.TM, [Han.TL, Han.CENTER, Han.TR])
      f(Han.TR, [Han.TM, Han.CENTER, Han.RM])
      f(Han.RM, [Han.TR, Han.CENTER, Han.BR])

      f(Han.BR, [Han.RM, Han.CENTER, Han.BM])
      f(Han.BM, [Han.BL, Han.CENTER, Han.BR])
      f(Han.BL, [Han.LM, Han.CENTER, Han.BM])
      f(Han.LM, [Han.TL, Han.CENTER, Han.BL])
    }
  }

  function getCha() {
    // north
    for (var y = target.crds[1] - 1; y >= 0; y--) {
      var piece = getPieceByCrds([target.crds[0], y]);

      if (piece == null) {
        points.push([target.crds[0], y]);

      } else {
        if (piece.team != target.team) {
          points.push([target.crds[0], y]);
        }

        break;
      }
    }

    // right
    for (var x = target.crds[0] + 1; x <= COL_COUNT; x++) {
      var piece = getPieceByCrds([x, target.crds[1]]);

      if (piece == null) {
        points.push([x, target.crds[1]]);        

      } else {
        if (piece.team != target.team) {
          points.push([x, target.crds[1]]);        
        }

        break;
      }
    }

    // south
    for (var y = target.crds[1] + 1; y <= ROW_COUNT; y++) {
      var piece = getPieceByCrds([target.crds[0], y]);

      if (piece == null) {
        points.push([target.crds[0], y]);

      } else {
        if (piece.team != target.team) {
          points.push([target.crds[0], y]);
        }

        break;
      }
    }

    // left
    for (var x = target.crds[0] - 1; x >= 0; x--) {
      var piece = getPieceByCrds([x, target.crds[1]]);

      if (piece == null) {
        points.push([x, target.crds[1]]);

      } else {
        if (piece.team != target.team) {
          points.push([x, target.crds[1]]);
        }

        break;
      }
    }

    function f(current, dest) {
      if (eqlcrds(target.crds, current)) {
        var piece = getPieceByCrds(Cho.CENTER);
    
        if (piece == null || piece.team != target.team) {
          points.push(Cho.CENTER);
        }
    
        if (piece == null) {
          points.push(dest);
        }
      }
    }

    // on the Cho castle 
    f(Cho.TL, Cho.BR);
    f(Cho.TR, Cho.BL);
    f(Cho.BR, Cho.TL);
    f(Cho.BL, Cho.TR);

    if (eqlcrds(target.crds, Cho.CENTER)) {
      var arr = [Cho.TL, Cho.TR, Cho.BR, Cho.BL];

      for (var i=0; i<arr.length; i++) {
        var piece = getPieceByCrds(arr[i]);

        if (piece == null || piece.team != target.team) {
          points.push(arr[i]);
        }
      }
    }

    // on the Han castle
    f(Han.TL, Han.BR);
    f(Han.TR, Han.BL);
    f(Han.BR, Han.TL);
    f(Han.BL, Han.TR);

    if (eqlcrds(target.crds, Han.CENTER)) {
      var arr = [Han.TL, Han.TR, Han.BR, Han.BL];

      for (var i=0; i<arr.length; i++) {
        var piece = getPieceByCrds(arr[i]);

        if (piece == null || piece.team != target.team) {
          points.push(arr[i]);
        }
      }
    }
  }

  function getMa(root, a, b) {
    var _x = target.crds[0];
    var _y = target.crds[1];

    var piece = getPieceByCrds([_x + root[0], _y + root[1]]);
    
    if (piece == null) {
      var piece = getPieceByCrds([_x + a[0], _y + a[1]]);

      if (piece == null || piece.team != target.team) {
        points.push([_x + a[0], _y + a[1]]);
      }

      var piece = getPieceByCrds([_x + b[0], _y + b[1]]);

      if (piece == null || piece.team != target.team) {
        points.push([_x + b[0], _y + b[1]]);
      }
    }
  }

  function getSang(root, a1, a2, b1, b2) {
    var _x = target.crds[0];
    var _y = target.crds[1];

    var piece = getPieceByCrds([_x + root[0], _y + root[1]]);
    
    if (piece == null) {
      // a
      var piece = getPieceByCrds([_x + a1[0], _y + a1[1]]);

      if (piece == null) {
        var piece = getPieceByCrds([_x + a2[0], _y + a2[1]]);

        if (piece == null || piece.team != target.team) {
          points.push([_x + a2[0], _y + a2[1]]);
        }
      }

      // b
      var piece = getPieceByCrds([_x + b1[0], _y + b1[1]]);

      if (piece == null) {
        var piece = getPieceByCrds([_x + b2[0], _y + b2[1]]);

        if (piece == null || piece.team != target.team) {
          points.push([_x + b2[0], _y + b2[1]]);
        }
      }
    }
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
})();

