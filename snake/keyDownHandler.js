var prevKey = "ArrowRight";
import key from "./enums/key.js";

export default function keyDownHandler(e, over, resetGame, snake) {

  if (over && e.key === "Enter") {
    resetGame();
    prevKey = key.RIGHT;
  }

  if (prevKey === e.key) {
    return;
  }

  // prevent u-turn
  var rtol = snake.dir === "right" && e.key === key.LEFT;
  var ltor = snake.dir === "left" && e.key === key.RIGHT;
  var utod = snake.dir === "up" && e.key === key.DOWN;
  var dtou = snake.dir === "down" && e.key === key.UP;

  if (rtol || ltor || utod || dtou) return;
  
  if (e.key === key.UP) {
    snake._y -= snake.movingPoint;
    snake.dir = "up";
  }
  
  if (e.key === key.LEFT) {
    snake._x -= snake.movingPoint;
    snake.dir = "left";
  }

  if (e.key === key.RIGHT) {
    snake._x += snake.movingPoint;
    snake.dir = "right";
  }
  
  if (e.key === key.DOWN) {
    snake._y += snake.movingPoint;
    snake.dir = "down";
  }

  prevKey = e.key;
}