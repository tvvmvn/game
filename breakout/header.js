var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

export var ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 10,
  dx: 2,
  dy: -2,
  color: "#eee"
}

export var paddle = {
  x: (canvas.width - 70) / 2,
  y: canvas.height - 10,
  width: 70,
  height: 5,
  color: "#eee"
}

export var pressedKey = {
  left: false,
  right: false
}

export var misc = {
  end: false,
  start: false,
  over: false,
  score: 0,
}