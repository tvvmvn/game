var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
import { pressedKey, misc } from "./header.js";

export function keyDownHandler(e) {
  if (!misc.start) {
    misc.start = true;
  }

  if (e.code == "ArrowRight") {
    pressedKey.right = true;
  } else if (e.code == "ArrowLeft") {
    pressedKey.left = true;
  }
}

export function keyUpHandler(e) {
  if (e.code == "ArrowRight") {
    pressedKey.right = false;
  } else if (e.code == "ArrowLeft") {
    pressedKey.left = false;
  }
}