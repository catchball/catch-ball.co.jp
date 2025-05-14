var socket = ""
var swf
var pcID = ""
var spID = ""
//var dns		= '54.235.111.169';
var partner = false
var started = true
var first = true
var pause = true

function getLoginData() {
  if (first) {
    first = false
    socket = new io.connect(__socketURL, { reconnect: false })
    setSocketEvent()
  } else {
    socket.socket.reconnect()
  }

  //swf		= document.getElementById( 'swfContainer' );
  swf = document["swfContainer"]

  /*--- Focus ---*/

  window.onblur = function () {
    if (!pause) {
      pause = true
      swf.receivePause()
      if (partner) {
        socket.emit("pause", { id: spID })
      }
    }
  }
}

function setSocketEvent() {
  socket.on("onConnect", function (obj) {
    pcID = obj.id
    socket.emit("setPass")
  })

  socket.on("getPass", function (obj) {
    pause = false
    swf.receiveLoginData({
      pw: obj.pass,
      qr:
        "https://chart.apis.google.com/chart?chs=111x111&cht=qr&chl=" +
        __socketURL +
        "%23" +
        pcID,
    })
  })

  socket.on("getPartner", function (targetId) {
    if (!partner) {
      partner = true
      spID = targetId

      socket.emit("savePartner", { id: spID })

      if (started) {
        socket.emit("gameStart", { id: spID })
      }
    } else {
      socket.emit("loginError", { id: targetId })
    }
  })

  socket.on("onStart", function () {
    if (partner) {
      swf.gameStart()
    }
  })

  socket.on("onReady", function () {
    swf.receiveCatchState()
  })

  socket.on("oncatch", function (obj) {
    swf.receiveBall(obj)
    //swf.flaFunc( obj );
  })

  socket.on("onBreak", function () {
    partner = false
    swf.receiveError()
  })

  socket.on("retry", function () {
    swf.receiveRetry()
  })

  socket.on("onTitle", function () {
    swf.receiveTitle()
  })

  socket.on("console", function (txt) {
    console.log(txt)
  })
}

function setCatchState() {
  socket.emit("setPosition", { id: spID })
}

function sendBall() {
  socket.emit("pitchBall", { id: spID, value: "hoge" })
}

function setThrowState() {
  socket.emit("setPitch", { id: spID })
}

function checkSocketID() {
  if (partner) {
    socket.emit("gameStart", { id: spID })
  } else {
    socket.emit("setPass")
  }
}

function send_close() {
  closeGame()
  socket.disconnect()
  //pcID	= '';
  spID = ""
  partner = false
  started = true
}

function sendRestart() {
  pause = false

  if (partner) {
    socket.emit("restart", { id: spID })
  }
}

function send_continue(arr) {
  if (typeof arr === "undefined") arr = ["a", 0]

  socket.emit("continue", { id: spID, type: arr[0], speed: arr[1] })
}

function send_retry() {
  socket.emit("retry", { id: spID })
}

function send_title() {
  socket.emit("onTitle", { id: spID })
}
