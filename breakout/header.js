var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

export const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 10,
  dx: 2,
  dy: -2
}

export const paddle = {
  x: (canvas.width - 70) / 2,
  width: 70,
  height: 10
}

export const pressedKey = {
  left: false,
  right: false
}

export const misc = {
  end: false,
  start: false,
  over: false,
  score: 0,
}