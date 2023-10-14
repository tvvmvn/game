import { grid } from "../header.js";

var ctx = canvas.getContext("2d");

export function drawGrid() {
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