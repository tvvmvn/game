var ctx = canvas.getContext("2d");

var stage = {
  offsetX: 50,
  offsetY: 50,
  width: 400,
  height: 200
}

var x = 0;

setInterval(render, 10);

function render() {
  clearCanvas();

  x--;

  drawActor()
  drawStage()

}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawActor() {
  ctx.beginPath();
  ctx.arc(100, 100, 40, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawStage() {
  // ctx.fillRect(x, 200, 2000, 10)

  // ctx.font = "16px Arial";
  // ctx.fillRect(400 + x, 180, 20, 20)
  // ctx.fillRect(800 + x, 190, 20, 10)
  // ctx.fillRect(1200 + x, 180, 20, 20)
  // ctx.fillRect(1600 + x, 160, 20, 40)
  // ctx.fillRect(2000 + x, 180, 20, 20)

  ctx.moveTo(0, 200);
  ctx.lineTo(300, 100);

  ctx.moveTo(300, 100);
  ctx.lineTo(500, 100);

  ctx.stroke();
}