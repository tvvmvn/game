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

  /* enums */

  const HAN = {
    TL: [3, 0],
    TR: [5, 0],
    BR: [5, 2],
    BL: [3, 2],
    CENTER: [4, 1]
  }

  const CHO = {
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

  var x, y = 0;
  var piece = [4, 1];
  var points;

  /* run the game */

  setInterval(interval, 10);
  addEventListener("click", clickHandler);

  function interval() {
    clearCanvas();

    // # set different pieces here
    // setZol();
    // setMa()
    // setCha()
    setGung()

    setMove();

    drawBoard();
    drawPiece();
    drawPoints()
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* functions */

  function eqlcrds(a, b) {
    return a[0] == b[0] && a[1] == b[1];
  }

  function setMa() {
    // not additional task is needed.
  }

  function setGung() {
    var _points = [];

    if (eqlcrds(piece, CHO.CENTER)) {
      _points.push(
        CHO.TL, CHO.TM, CHO.TR, CHO.RM,
        CHO.BR, CHO.BM, CHO.BL, CHO.LM
      );
    }

    if (eqlcrds(piece, CHO.TL)) {
      _points.push(CHO.TM, CHO.CENTER, CHO.LM)
    }

    points = _points;
  }

  function setCha() {
    var _points = [];

    // up
    for (var i = piece[1] - 1; i >= 0; i--) {
      _points.push([piece[0], i]);
    }

    // right
    for (var i = piece[0] + 1; i <= COL_COUNT; i++) {
      _points.push([i, piece[1]]);
    }

    // bottom
    for (var i = piece[1] + 1; i <= ROW_COUNT; i++) {
      _points.push([piece[0], i]);
    }

    // left
    for (var i = piece[0] - 1; i >= 0; i--) {
      _points.push([i, piece[1]]);
    }

    // on the castle
    if (eqlcrds(piece, CHO.TL)) {
      _points.push(CHO.CENTER, CHO.BR)
    }

    if (eqlcrds(piece, CHO.TR)) {
      _points.push(CHO.CENTER, CHO.BL)
    }

    if (eqlcrds(piece, CHO.BR)) {
      _points.push(CHO.CENTER, CHO.TL)
    }

    if (eqlcrds(piece, CHO.BL)) {
      _points.push(CHO.CENTER, CHO.TR)
    }

    if (eqlcrds(piece, CHO.CENTER)) {
      _points.push(CHO.TL, CHO.TR, CHO.BR, CHO.BL)
    }

    // on the enemy castle 
    if (eqlcrds(piece, HAN.TL)) {
      _points.push(HAN.CENTER, HAN.BR)
    }

    if (eqlcrds(piece, HAN.TR)) {
      _points.push(HAN.CENTER, HAN.BL)
    }

    if (eqlcrds(piece, HAN.BR)) {
      _points.push(HAN.CENTER, HAN.TL)
    }

    if (eqlcrds(piece, HAN.BL)) {
      _points.push(HAN.CENTER, HAN.TR)
    }

    if (eqlcrds(piece, HAN.CENTER)) {
      _points.push(HAN.TL, HAN.TR, HAN.BR, HAN.BL)
    }

    points = _points;
  }

  function setZol() {
    var _points = [];

    _points.push(
      [piece[0], piece[1] - 1],
      [piece[0] - 1, piece[1]],
      [piece[0] + 1, piece[1]],
    )

    // on the castle area
    if (eqlcrds(piece, HAN.BL)) {
      _points.push(HAN.CENTER);
    }

    if (eqlcrds(piece, HAN.CENTER)) {
      _points.push(HAN.TL, HAN.TR)
    }

    if (eqlcrds(piece, HAN.BR)) {
      _points.push(HAN.CENTER)
    }

    points = _points;
  }

  function setMove() {
    for (var i = 0; i < points.length; i++) {
      if (eqlcrds([x, y], points[i])) {
        piece[0] = x;
        piece[1] = y;
      }
    }
  }

  /* draw */

  function drawPoints() {
    for (var i = 0; i < points.length; i++) {
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

  function drawPiece() {
    ctx.fillStyle = "#ddd";
    ctx.beginPath();
    ctx.arc(
      OFFSET_X + (piece[0] * CELL_WIDTH),
      OFFSET_Y + (piece[1] * CELL_HEIGHT),
      15, 0, 2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();
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

          console.log(x, y);
        }
      }
    }
  }
})()

