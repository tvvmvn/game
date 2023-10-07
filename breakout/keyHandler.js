var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
import { pressedKey, misc } from "./header.js";

const Key = {
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight"
}

export function keyDownHandler(e) {
  if (!misc.start) {
    misc.start = true;
  }

  if (e.code == Key.RIGHT) {
    pressedKey.right = true;
  } else if (e.code == Key.LEFT) {
    pressedKey.left = true;
  }
}

export function keyUpHandler(e) {
  if (e.code == Key.RIGHT) {
    pressedKey.right = false;
  } else if (e.code == Key.LEFT) {
    pressedKey.left = false;
  }
}