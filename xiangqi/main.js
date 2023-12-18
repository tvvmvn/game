(function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.backgroundColor = "#333";

  /* constants */

  const OFFSET_X = 20;
  const OFFSET_Y = 20;
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

  /* variables */

  var x = -1;
  var y = -1;
  var target;
  var points = [];

  var pieces = [
    { name: "졸", x: 2, y: 3, size: 15, team: "han", color: "#f00" },
    { name: "졸", x: 6, y: 3, size: 15, team: "han", color: "#f00" },
    { name: "차", x: 0, y: 0, size: 20, team: "han", color: "#f00" },
    { name: "차", x: 8, y: 0, size: 20, team: "han", color: "#f00" },
    { name: "마", x: 6, y: 0, size: 20, team: "han", color: "#f00" },
    { name: "마", x: 2, y: 0, size: 20, team: "han", color: "#f00" },
    { name: "궁", x: 4, y: 1, size: 30, team: "han", color: "#f00" },
    { name: "졸", x: 2, y: 6, size: 15, team: "cho", color: "#0b0" },
    { name: "졸", x: 6, y: 6, size: 15, team: "cho", color: "#0b0" },
    { name: "차", x: 0, y: 9, size: 20, team: "cho", color: "#0b0" },
    { name: "차", x: 8, y: 9, size: 20, team: "cho", color: "#0b0" },
    { name: "마", x: 2, y: 9, size: 20, team: "cho", color: "#0b0" },
    { name: "마", x: 6, y: 9, size: 20, team: "cho", color: "#0b0" },
    { name: "궁", x: 4, y: 8, size: 30, team: "cho", color: "#0b0" },
  ]

  addEventListener("click", clickHandler);

  /* run the game */

  setInterval(interval, 10);

  function interval() {
    clearCanvas();
    
    setTarget();
    setPoints();
    move();

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
  
  function setTarget() {
    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];

      if (x == piece.x && y == piece.y) {
        target = piece;
        break;
      }
    }
  }

  function setPoints() {
    if (!target) {
      return;
    }

    if (target.name == "졸") {
      var _points = [];

      if (isEmpty(target.x, target.y - 1)) {
        _points.push([target.x, target.y - 1])
      }

      if (isEmpty(target.x - 1, target.y)) {
        _points.push([target.x - 1, target.y])
      }

      if (isEmpty(target.x + 1, target.y)) {
        _points.push([target.x + 1, target.y])
      }

      points = _points;
    }

    if (target.name == "마") {
      points = getMa()
    }

    if (target.name == "차") {
      points = getCha();
    }

    if (target.name == "sang") {
      points = [];
    }

    if (target.name == "po") {
      points = [];
    }

    if (target.name == "sa") {
      points = [];
    }

    if (target.name == "궁") {
      points = [];
    }
  }


  function move() {
    for (var i=0; i<points.length; i++) {
      if (x == points[i][0] && y == points[i][1]) {
        target.x = x;
        target.y = y;
      }
    }
  }

  function getCha() {
    var _points = [];

    // up
    for (var i = target.y - 1; i >= 0; i--) {
      if (isEmpty(target.x, i)) {
        _points.push([target.x, i]);
      } else {
        break;
      }
    }

    // right
    for (var i = target.x + 1; i <= COL_COUNT; i++) {
      if (isEmpty(i, target.y)) {
        _points.push([i, target.y]);
      } else {
        break;
      }
    }

    // down
    for (var i = target.y + 1; i <= ROW_COUNT; i++) {
      if (isEmpty(target.x, i)) {
        _points.push([target.x, i]);
      } else {
        break;
      }
    }

    // left
    for (var i = target.x - 1; i >= 0; i--) {
      if (isEmpty(i, target.y)) {
        _points.push([i, target.y]);
      } else {
        break;
      }
    }

    return _points;
  }

  function getMa() {
    var _points = [];

    // up
    if (isEmpty(target.x, target.y - 1)) {
      if (isEmpty(target.x - 1, target.y - 2)) {
        _points.push([target.x - 1, target.y - 2]);
      }
      if (isEmpty(target.x + 1, target.y - 2)) {
        _points.push([target.x + 1, target.y - 2]);
      }
    }

    // right
    if (isEmpty(target.x + 1, target.y)) {
      if (isEmpty(target.x + 2, target.y - 1)) {
        _points.push([target.x + 2, target.y - 1]);
      }
      if (isEmpty(target.x + 2, target.y + 1)) {
        _points.push([target.x + 2, target.y + 1]);
      }
    }

    // down
    if (isEmpty(target.x, target.y + 1)) {
      if (isEmpty(target.x + 1, target.y + 2)) {
        _points.push([target.x + 1, target.y + 2]);
      }
      if (isEmpty(target.x - 1, target.y + 2)) {
        _points.push([target.x - 1, target.y + 2]);
      }
    }

    // left
    if (isEmpty(target.x - 1, target.y)) {
      if (isEmpty(target.x - 2, target.y + 1)) {
        _points.push([target.x - 2, target.y + 1]);
      }
      if (isEmpty(target.x - 2, target.y - 1)) {
        _points.push([target.x - 2, target.y - 1]);
      }
    }

    return _points;
  }

  function isEmpty(x, y) {
    var empty = true;

    if (x < 0 || x > COL_COUNT) {
      return false;
    }

    if (y < 0 || y > ROW_COUNT) {
      return false;
    } 

    for (var i=0; i<pieces.length; i++) {
      if (pieces[i].x == x && pieces[i].y == y) {
        empty = false;
        break;
      }   
    }

    return empty;
  }

  /* draw */
  
  function drawPieces() {
    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];

      ctx.font = piece.size + "px Arial";
      ctx.fillStyle = piece.color;
      ctx.fillText(
        piece.name, 
        OFFSET_X + (piece.x * CELL_WIDTH) - piece.size / 2.5, 
        OFFSET_Y + (piece.y * CELL_HEIGHT) + piece.size / 3,
      );
    }
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
      OFFSET_X + (target.x * CELL_WIDTH),
      OFFSET_Y + (target.y * CELL_HEIGHT),
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

