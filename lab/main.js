(function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  
  /* constants */

  const OFFSET = 50;
  const COUNT = 3;
  const SIZE = 150;
  const CELL = SIZE / COUNT;

  canvas.style.backgroundColor = "#333";
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  /* variables */

  var cho = { id: 1, x: 0, y: 3, color: "green" };
  var han = { id: 2, x: 3, y: 0, color: "red" };
  var turn = 1;

  setInterval(render, 10);

  function render() {
    clearCanvas();
    drawGrid();
    drawActor(han);
    drawActor(cho);
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* functions */

  function drawActor(actor) {
    ctx.beginPath();
    ctx.fillStyle = actor.color;
    ctx.arc(
      OFFSET + (actor.x * CELL),
      OFFSET + (actor.y * CELL),
      15, 0, 2 * Math.PI
    );
    ctx.fill();
  }

  function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    for (var r = 0; r <= COUNT; r++) {
      ctx.moveTo(OFFSET, OFFSET + (CELL * r));
      ctx.lineTo(OFFSET + SIZE, OFFSET + (CELL * r));
    }

    for (var c = 0; c <= COUNT; c++) {
      ctx.moveTo(OFFSET + (CELL * c), OFFSET);
      ctx.lineTo(OFFSET + (CELL * c), OFFSET + SIZE);
    }

    ctx.stroke();
  }
})();