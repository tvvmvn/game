(function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.style["backgroundColor"] = "#000";
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.addEventListener("click", clickHandler);
  
  /* constants*/

  const STORE = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ";
  const CX = canvas.width / 2;
  const CY = 240;
  const RADIUS = 120;
  const TIME = 10;

  /* variables */

  var q = "";
  var pass;
  var start;
  var p;
  var s;
  var _s;
  var over;

  /* run the game */

  setInterval(run, 10);

  function run() {
    clearCanvas();
    drawTitle();
    
    if (!start) {
      initialize();
      drawStart();
      return;
    }
    
    drawTimer();
    
    if (!over) {
      setTime();
      drawFill();
      drawQuiz();

      if (s == TIME) {
        over = true;
      }

      if (pass) {
        q = setQuiz();
        p = 1.5;
        s = 0;
        _s = 0;
  
        pass = false;
      }
    } else {
      drawOver();
    }
  }

  function initialize() {
    q = setQuiz();
    p = 1.5;
    s = 0;
    _s = 0;

    pass = null;
    over = false;
  }

  /* functions */

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function setQuiz() {
    var i1 = Math.floor(Math.random() * STORE.length);
    var i2 = Math.floor(Math.random() * STORE.length);

    return STORE[i1] + STORE[i2];
  }

  function setTime() {
    _s++

    if (_s == 100) { // 1s
      s++;
      _s = 0;
    }
  }

  /* draw */

  function drawTitle() {
    ctx.font = "30px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("# CHOSUNG GAME", CX, 60);
  }

  function drawTimer() {
    ctx.beginPath();
    ctx.lineWidth = 16;
    ctx.strokeStyle = "#eee";
    ctx.arc(CX, CY, RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
  }

  function drawFill() {
    p += (20 / TIME) / 1000;
    
    if (p == 2) p = 0;
    
    ctx.beginPath();
    ctx.lineWidth = 16;
    ctx.strokeStyle = "#08f";
    ctx.arc(CX, CY, RADIUS, p * Math.PI, 1.5 * Math.PI);
    ctx.stroke();
  }

  function drawStart() {
    ctx.font = "20px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(
      "Touch or click to start",
      CX,
      CY + (20 * 0.5)
    );
  }

  function drawQuiz() {
    ctx.font = "100px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(q, CX, CY + (100 * 0.35));
  }

  function drawOver() {
    ctx.font = "30px Monospace";
    ctx.textAlign = "center";
    ctx.fillText("TIME OVER", CX, CY + (20 * 0.5));
  }

  /* control */

  function clickHandler(e) {
    if (!start) {
      start = true;
      return;
    }

    if (over) {
      start = false;
      return;
    }

    var a = Math.pow((e.clientX - CX), 2) + Math.pow((e.clientY - CY), 2);
    var b = Math.pow(RADIUS, 2);

    if (a <= b) {
      pass = true;
    }
  }
})()
