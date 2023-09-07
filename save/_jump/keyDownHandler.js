import Key from "./enums/Key.js";

export default function keyDownHandler(e, actor, start, startGame) {
  if (!start) {
    return startGame();
  }

  if (actor.jump) {
    return;
  }

  if (e.key === Key.UP) {
    actor.jump = true;
  }
}