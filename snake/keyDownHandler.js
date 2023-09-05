import Key from "./enums/Key.js";
import Direction from "./enums/Direction.js";

var prevKey = Key.RIGHT;

export default function keyDownHandler(e, start, startGame, snake) {

  if (!start && e.key === Key.ENTER) {
    prevKey = Key.RIGHT;

    startGame();
  }

  // prevent accel and u-turn 
  if (snake.dir === Direction.RIGHT) {
    if (e.key === Key.RIGHT) return;
    if (e.key === Key.LEFT) return;
  } 

  if (snake.dir === Direction.DOWN) {
    if (e.key === Key.DOWN) return;
    if (e.key === Key.UP) return;
  } 

  if (snake.dir === Direction.LEFT) {
    if (e.key === Key.LEFT) return;
    if (e.key === Key.RIGHT) return;
  } 

  if (snake.dir === Direction.UP) {
    if (e.key === Key.UP) return;
    if (e.key === Key.DOWN) return;
  } 

  // turn 
  if (e.key === Key.UP) {
    snake._y -= snake.movingPoint;
    snake.dir = Direction.UP;
  }
  
  if (e.key === Key.LEFT) {
    snake._x -= snake.movingPoint;
    snake.dir = Direction.LEFT;
  }

  if (e.key === Key.RIGHT) {
    snake._x += snake.movingPoint;
    snake.dir = Direction.RIGHT;
  }
  
  if (e.key === Key.DOWN) {
    snake._y += snake.movingPoint;
    snake.dir = Direction.DOWN;
  }

  prevKey = e.key;
}