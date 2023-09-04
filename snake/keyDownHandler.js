var prevKey = "ArrowRight";

export default function keyDownHandler(e, over, resetGame, snake) {

  if (over && e.key === "Enter") {
    resetGame();
    prevKey = "ArrowRight";
  }

  if (prevKey === e.key) {
    return;
  }

  // prevent u-turn
  var rtol = snake.dir === "right" && e.key === "ArrowLeft";
  var ltor = snake.dir === "left" && e.key === "ArrowRight";
  var utod = snake.dir === "up" && e.key === "ArrowDown";
  var dtou = snake.dir === "down" && e.key === "ArrowUp";

  if (rtol || ltor || utod || dtou) return;

  if (e.key === "ArrowRight") {
    snake._x += snake.movingPoint;
    snake.dir = "right";
  }

  if (e.key === "ArrowDown") {
    snake._y += snake.movingPoint;
    snake.dir = "down";
  }

  if (e.key === "ArrowLeft") {
    snake._x -= snake.movingPoint;
    snake.dir = "left";
  }

  if (e.key === "ArrowUp") {
    snake._y -= snake.movingPoint;
    snake.dir = "up";
  }

  prevKey = e.key;
}