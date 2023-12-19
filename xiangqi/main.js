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

  const Castle = {
    TL: [3, 0],
    TR: [5, 0],
    BR: [5, 2],
    BL: [3, 2],
    CENTER: [4, 1]
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
  var piece = { x: 0, y: 9 };
  var points;

  /* run the game */
  
  setInterval(interval, 10);
  addEventListener("click", clickHandler);

  function interval() {
    clearCanvas();
    
    // # set different pieces here
    // setZol();
    // setMa()
    setCha()

    setMove();

    drawBoard();
    drawPiece();
    drawPoints()
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* functions */

  function setMa() {
    // not additional task is needed.
  }

  function setCha() {
    var _points = [];

    // up
    for (var i=piece.y - 1; i>=0; i--) {
      _points.push([piece.x, i]);
    }

    // right
    for (var i=piece.x + 1; i<=COL_COUNT; i++) {
      _points.push([i, piece.y]);
    }

    // bottom
    for (var i=piece.y + 1; i<=ROW_COUNT; i++) {
      _points.push([piece.x, i]);
    }

    // left
    for (var i=piece.x - 1; i>=0; i--) {
      _points.push([i, piece.y]);
    }

    // on the castle area
    if (piece.x == Castle.TL[0] && piece.y == Castle.TL[1]) {
      _points.push(
        [piece.x + 1, piece.y + 1],
        [piece.x + 2, piece.y + 2],
      )
    }

    if (piece.x == Castle.TR[0] && piece.y == Castle.TR[1]) {
      _points.push(
        [piece.x - 1, piece.y + 1],
        [piece.x - 2, piece.y + 2],
      )
    }

    if (piece.x == Castle.BR[0] && piece.y == Castle.BR[1]) {
      _points.push(
        [piece.x - 1, piece.y - 1],
        [piece.x - 2, piece.y - 2],
      )
    }
    
    if (piece.x == Castle.BL[0] && piece.y == Castle.BL[1]) {
      _points.push(
        [piece.x + 1, piece.y - 1],
        [piece.x + 2, piece.y - 2],
      )
    }

    if (piece.x == Castle.CENTER[0] && piece.y == Castle.CENTER[1]) {
      _points.push(
        [piece.x - 1, piece.y - 1],
        [piece.x + 1, piece.y - 1],
        [piece.x - 1, piece.y + 1],
        [piece.x + 1, piece.y + 1],
      )
    }

    points = _points;
  }

  function setZol() {
    var _points = [];

    _points.push(
      [piece.x, piece.y - 1],
      [piece.x - 1, piece.y],
      [piece.x + 1, piece.y],
    ) 

    // on the castle area
    if (piece.x == Castle.BL[0] && piece.y == Castle.BL[1]) {
      _points.push([piece.x + 1, piece.y - 1]);
    }

    if (piece.x == Castle.CENTER[0] && piece.y == Castle.CENTER[1]) {
      _points.push(
        [piece.x - 1, piece.y - 1],
        [piece.x + 1, piece.y - 1],
      )
    }

    if (piece.x == Castle.BR[0] && piece.y == Castle.BR[1]) {
      _points.push([piece.x - 1, piece.y - 1])
    }

    points = _points;
  }

  function setMove() {
    for (var i=0; i<points.length; i++) {
      if (x == points[i][0] && y == points[i][1]) {
        piece.x = x;
        piece.y = y;
      }
    }
  }

  /* draw */

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
  
  function drawPiece() {
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(
      OFFSET_X + (piece.x * CELL_WIDTH),
      OFFSET_Y + (piece.y * CELL_HEIGHT),
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

