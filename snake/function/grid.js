export function initGrid(grid) {
  grid.offsetX = 50;
  grid.offsetY = 50;
  grid.width = 400;
  grid.height = 300;
  grid.rowCount = 15;
  grid.colCount = 20;
  grid.cell = 20;
}

export function drawGrid(ctx, grid) {
  ctx.beginPath();
  ctx.strokeStyle = "#555";
  
  // rows
  for (var r = 0; r < grid.rowCount + 1 ; r++) {
    ctx.moveTo(grid.offsetX, grid.offsetY + (r * grid.cell));
    ctx.lineTo(grid.offsetX + grid.width, grid.offsetY + (r * grid.cell));
  }

  // cols
  for (var c = 0; c < grid.colCount + 1; c++) {
    ctx.moveTo(grid.offsetX + (c * grid.cell), grid.offsetY);
    ctx.lineTo(grid.offsetX + (c * grid.cell), grid.offsetY + grid.height);
  }

  ctx.stroke();
}