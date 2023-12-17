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

  /* variables */

  var x = 0;
  var y = 0;
  var target;
  var points = [];
  var spots = [];

  for (var r = 0; r <= ROW_COUNT; r++) {
    spots[r] = [];

    for (var c = 0; c <= COL_COUNT; c++) {
      spots[r][c] = {
        x: OFFSET_X + (c * CELL_WIDTH),
        y: OFFSET_Y + (r * CELL_HEIGHT)
      }
    }
  }

  var pieces = [
    { name: "zol", x: 0, y: 6, size: 10 },
    { name: "zol", x: 2, y: 6, size: 10 },
    { name: "zol", x: 4, y: 6, size: 10 },
    { name: "zol", x: 6, y: 6, size: 10 },
    { name: "zol", x: 8, y: 6, size: 10 },
    { name: "po", x: 1, y: 7, size: 15 },
    { name: "po", x: 7, y: 7, size: 15 },
    { name: "cha", x: 0, y: 9, size: 15 },
    { name: "cha", x: 8, y: 9, size: 15 },
    { name: "sang", x: 1, y: 9, size: 15 },
    { name: "sang", x: 7, y: 9, size: 15 },
    { name: "ma", x: 2, y: 9, size: 15 },
    { name: "ma", x: 6, y: 9, size: 15 },
    { name: "sa", x: 3, y: 9, size: 10 },
    { name: "sa", x: 5, y: 9, size: 10 },
    { name: "gung", x: 4, y: 8, size: 25 },
  ]

  addEventListener("click", clickHandler);

  /* run the game */

  setInterval(interval, 10);

  function interval() {
    clearCanvas();
    
    move();
    setTarget();
    setPoints();

    drawBoard();
    drawPieces();
    drawPoints();
    drawCursor();

    ctx.globalAlpha = 1;
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* functions */
  
  function setTarget() {
    target = null;

    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];
      
      if (x == piece.x && y == piece.y) {
        target = piece;
      }
    }
  }

  function move() {
    for (var i=0; i<points.length; i++) {
      if (x == points[i][0] && y == points[i][1]) {
        target.x = x;
        target.y = y;

        x = 0;
        y = 0;
      }
    }
  }

  function isEmpty(x, y) {
    var empty = true;

    for (var i=0; i<pieces.length; i++) {
      if (pieces[i].x == x && pieces[i].y == y) {
        empty = false;
        break;
      }   
    }

    return empty;
  }

  function setMa() {
    var _points = [];

    // up
    if (isEmpty(target.x, target.y - 1)) {
      if (isEmpty(target.x -1, target.y - 2)) {
        _points.push([target.x -1, target.y - 2]);
      }
      if (isEmpty(target.x + 1, target.y - 2)) {
        _points.push([target.x + 1, target.y - 2]);
      }
    }

    // right
    if (isEmpty(target.x + 1, target.y)) {
      if (isEmpty(target.x + 2, target.y - 1)) {
        _points.push([target.x + 1, target.y - 1]);
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

  function setPoints() {
    if (target) {
      if (target.name == "zol") {
        points = [
          [target.x, target.y - 1],
          [target.x - 1, target.y],
          [target.x + 1, target.y],
        ]
      }

      if (target.name == "ma") {
        points = setMa()
      }

      if (target.name == "cha") {
        var tmp = []

        // vertical
        for (var i = 0; i <= ROW_COUNT; i++) {
          if (i == target.y) {
            continue;
          }
          tmp.push([target.x, i]);
        }
        // horizontal
        for (var i = 0; i <= COL_COUNT; i++) {
          if (i == target.x) {
            continue;
          }
          tmp.push([i, target.y]);
        }

        points = tmp;
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

      if (target.name == "gung") {
        points = [];
      }
    } else {
      points = [];
    }
  }

  /* draw */
  
  function drawPieces(piece) {
    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];
  
      ctx.beginPath();
      ctx.arc(
        OFFSET_X + (piece.x * CELL_WIDTH), 
        OFFSET_Y + (piece.y * CELL_HEIGHT),
        piece.size, 0, 2 * Math.PI
      );
      ctx.fillStyle = "#ddd";
      ctx.fill();
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

  /* control */

  function clickHandler(e) {
    for (var r = 0; r <= ROW_COUNT; r++) {
      for (var c = 0; c <= COL_COUNT; c++) {
        var spot = spots[r][c]; // intersection

        var a = Math.pow((e.clientX - spot.x), 2) + Math.pow((e.clientY - spot.y), 2);
        var b = Math.pow(CELL_HEIGHT / 2, 2);

        if (a <= b) {
          // target
          console.log("selected:", x, y);
          x = c;
          y = r;
        }
      }
    }
  }
})()

