/* 
# Structure is a data type. 
You don't give values to a data type. 
You give values to instances/objects of data types.

# Does C programming have methods?
A function is independent of any object (and outside of any class). 
For Java and C#, there are only methods. 
For C, there are only functions.
*/

export class Grid { // data type
  offsetX;
  offsetY;
  width;
  height;
  rowCount;
  colCount;
  cell;
}

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
  ctx.strokeStyle = "#fff";
  
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