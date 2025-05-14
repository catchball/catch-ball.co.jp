var WINDOW = window
var DOCUMENT
var BODY

var timer

var win = { h: 0, yc: 0 }
var aList = { cls: "ext" }
var wrap = { id: "wrap" }
var topSky = { id: "top_sky", cls: "end" }
var container = { id: "container", cls: "top" }
var topDiv = { id: "top", cls: "catch" }
//var notify		= { id: 'notify', cls: 'nodisp' };
//var notifyBall	= { id: 'notify_ball' };
var content = { id: "content" }
var catchArea = { id: "catch", top_id: "top_catch", h: 7000 }
var over = { id: "over", cls: "on" }
var ground = { id: "ground", maxs: 30, cls: "nodisp" }
var catcher = { id: "chld_catch", cls: "top" }
var ball = { id: "ball", mins: 0.3, maxs: 12, maxo: 0.3 }
var black = { id: "black", view: "false" }
var footer = { id: "footer", h: 64, cls: "fix" }
var like = { id: "like", cls: "view", view: false }
var allblack = { id: "allblack", cls: "on" }
var bbs = { id: "bbs" }
var train = { id: "train", cls: "go" }
var chtr = [
  { id: "dog_g", h: 146 },
  { id: "dog_b", h: 146 },
  { id: "bird", h: 78 },
  { id: "making", h: 149 },
  { id: "mole", h: 75 },
  { id: "chld_writing", h: 117 },
  { id: "chld_sleeping", h: 138 },
]
var ieToGame = { id: "ieToGame" }
var sound = { catch_id: "snd_catch", pitch_id: "snd_pitch" }
var flashArea = { id: "flashDivId" }
var noFlaBttn = { id: "nofla_close" }

var chtr_num = chtr.length
var pitchNum = 0
var catchPosi = "bottom"
var pitchsnd = false
var macSafari = false

var flashArgs = new Object()
flashArgs.id = "swfContainer"
flashArgs.width = "1054"
flashArgs.height = "100%"
flashArgs.file = "preloader.swf"
flashArgs.quality = "HIGH"
flashArgs.menu = true
flashArgs.scale = "noscale"
flashArgs.salign = ""
flashArgs.bgcolor = "#C1FFF4"
flashArgs.wmode = "opaque"

/*****************************

	Window Load Event

*****************************/

function init() {
  if (device.indexOf("Mac") >= 0 && device.indexOf("Safari") >= 0) {
    macSafari = true
  }

  window.scroll(0, 1)

  /*--------------------------------- GOOGLE MAP ---------------------------------*/

  var gm_latlng = new google.maps.LatLng(35.660096, 139.741767)
  var gm_mapOptions = {
    center: new google.maps.LatLng(35.660096, 139.741767),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false,
    keyboardShortcuts: false,
    mapTypeControl: false,
    streetViewControl: false,
    panControl: false,
  }
  var gm_map = new google.maps.Map(
    document.getElementById("map_canvas").getElementsByTagName("div")[0],
    gm_mapOptions
  )
  var gm_marker = new google.maps.Marker({
    title: "譬ｪ蠑丈ｼ夂､ｾ繧ｭ繝｣繝�メ繝懊�繝ｫ",
    position: gm_latlng,
    map: gm_map,
  })

  /*--------------------------------- DOM ---------------------------------*/

  // document
  DOCUMENT = document

  // body
  BODY = DOCUMENT.body

  // aList
  aList.elm = DOCUMENT.getElementsByTagName("a")
  aList.num = aList.elm.length

  // wrap
  wrap.elm = DOCUMENT.getElementById(wrap.id)

  // topSky
  topSky.elm = DOCUMENT.getElementById(topSky.id)
  topSky.stl = topSky.elm.style

  // container
  container.elm = DOCUMENT.getElementById(container.id)
  container.sty = container.elm.style

  // topDiv
  topDiv.elm = DOCUMENT.getElementById(topDiv.id)
  topDiv.sty = topDiv.elm.style

  // notify
  //	notify.elm			= DOCUMENT.getElementById( notify.id );
  //	notify.a			= notify.elm.getElementsByTagName( 'a' )[0];

  // notifyBall
  //	notifyBall.elm		= DOCUMENT.getElementById( notifyBall.id );
  //	notifyBall.a		= notifyBall.elm.getElementsByTagName( 'a' )[0];

  // content
  content.elm = DOCUMENT.getElementById(content.id)
  content.sty = content.elm.style

  // catchArea
  catchArea.elm = DOCUMENT.getElementById(catchArea.id)
  catchArea.sty = catchArea.elm.style
  catchArea.top_elm = DOCUMENT.getElementById(catchArea.top_id)
  catchArea.top_sty = catchArea.top_elm.style

  // ground
  ground.elm = DOCUMENT.getElementById(ground.id)
  ground.sty = ground.elm.style

  // catcher
  catcher.elm = DOCUMENT.getElementById(catcher.id)
  catcher.sty = catcher.elm.style

  // over
  over.elm = DOCUMENT.getElementById(over.id)

  // black
  black.elm = DOCUMENT.getElementById(black.id)
  //	black.btn			= black.elm.getElementsByTagName( 'a' )[0];

  // ball
  ball.elm = DOCUMENT.getElementById(ball.id)

  // footer
  footer.elm = DOCUMENT.getElementById(footer.id)
  footer.sty = footer.elm.style

  // like
  like.elm = DOCUMENT.getElementById(like.id)

  // allblack
  allblack.elm = DOCUMENT.getElementById(allblack.id)

  // bbs
  bbs.elm = DOCUMENT.getElementById(bbs.id)
  bbs.ul = bbs.elm.getElementsByTagName("ul")[0]
  bbs.li = bbs.ul.getElementsByTagName("li")
  bbs.a = bbs.ul.getElementsByTagName("a")
  bbs.dl = bbs.elm.getElementsByTagName("dl")
  bbs.view = bbs.dl[0]
  bbs.closed = DOCUMENT.getElementById("bbs_close")
  bbs.num = bbs.li.length

  // train
  train.elm = DOCUMENT.getElementById(train.id)

  // chtr
  for (var i = 0; i < chtr_num; ++i) {
    chtr[i].cls = "pos_01"
    chtr[i].elm = DOCUMENT.getElementById(chtr[i].id)
    chtr[i].scrl = $(chtr[i].elm).offset().top
  }

  // noFlaBttn
  noFlaBttn.elm = DOCUMENT.getElementById(noFlaBttn.id)

  // ieToGame
  /*ieToGame.elm		= DOCUMENT.getElementById( ieToGame.id );
	ieToGame.sty		= ieToGame.elm.style;
	
	if( ie )
	{
		black.btn	= ieToGame.elm.getElementsByTagName( 'a' )[0];
	}*/

  // sound
  sound.catch_elm = DOCUMENT.getElementById(sound.catch_id)
  sound.pitch_elm = DOCUMENT.getElementById(sound.pitch_id)
  try {
    var audio = new Audio("")
    if (audio.canPlayType) {
      var canPlayWav = "" != audio.canPlayType("audio/wav")
      if (canPlayWav) {
        sound.play = true
      } else {
        sound.play = false
      }
    } else {
      sound.play = false
    }
  } catch (e) {
    sound.play = false
  }

  /*--------------------------------- EVENT ---------------------------------*/

  /*--- window resize ---*/

  WINDOW.onresize = setWindowSize
  setWindowSize()
  if (!ie) {
    /*--- Loaded ---*/

    setTimeout(function () {
      WINDOW.scroll(WINDOW.scrollX, 0)

      // window scroll
      WINDOW.onscroll = onScroll
      //onScroll();
      // cover
      BODY.removeChild(DOCUMENT.getElementById("cover"))
    }, 1000)

    // timer start
    setTimer()

    /*--- Starting Game ---*/

    //		black.btn.onclick	= function()
    //		{
    //			like.view				= true;
    //			//wrap.elm.className		= 'off';
    //			//container.h				= $( topDiv.elm ).height() + win.h + 'px';
    //			//catchArea.sty.height	= 600 + 'px';
    //			BODY.className			= 'off';
    //			container.sty.top		= -( win.h + win.y - 7000 + win.h ) + 'px';
    //			setWindowSize();
    //			createSwf( 1.5 );
    //			$( over.elm ).fadeTo
    //			(
    //				0.5 * 1000,
    //				0,
    //				function()
    //				{
    //					//container.sty.top		= '-' + container.h;
    //					over.elm.className		= '';
    //				}
    //			);
    //			return false;
    //		}
  } else {
    /*--- Loaded ---*/

    // cover
    BODY.removeChild(DOCUMENT.getElementById("cover"))
    like.view = false
    bottomCatch = false
  }

  /*--- Opening New Tabs ---*/

  for (var i = 0; i < aList.num; ++i) {
    if ($(aList.elm[i]).hasClass(aList.cls)) {
      setWindowOpen(aList.elm[i], aList.elm[i].href)
    }
  }

  /*--- Starting Game ---*/

  //	notify.a.onclick	= function()
  //	{
  //		//$( over.elm ).fadeTo( 0, 0 );
  //		over.elm.style.display	= 'none';
  //		like.view				= true;
  //		//wrap.elm.className		= 'off';
  //		over.elm.className		= '';
  //		BODY.className			= 'off';
  //		container.sty.top		= -win.h + 'px';
  //		setWindowSize();
  //		createSwf( 1.2 );
  //		return false;
  //	}

  //	notifyBall.a.onclick	= function()
  //	{
  //		//$( over.elm ).fadeTo( 0, 0 );
  //		over.elm.style.display	= 'none';
  //		like.view	= true;
  //		//wrap.elm.className		= 'off';
  //		over.elm.className		= '';
  //		BODY.className			= 'off';
  //		container.sty.top		= -( win.h + win.y ) + 'px';
  //		setWindowSize();
  //		createSwf( 1.7 );
  //		return false;
  //	}

  /*--- noFlaBttn ---*/

  noFlaBttn.elm.onclick = function () {
    closeNoFla()
    return false
  }

  /*--- Facebook's LIKE ---*/

  like.elm.onclick = function () {
    if (!like.view) {
      like.view = true
      like.elm.className = like.cls
      allblack.elm.className = allblack.cls
    }
  }

  allblack.elm.onclick = function () {
    if (like.view) {
      onScroll()
      like.view = false
      like.elm.className = ""
      allblack.elm.className = ""
    }
  }

  /*--- BBS Display ---*/

  for (var i = 0; i < bbs.num; ++i) {
    setMouseEvent(bbs.a[i], bbs.li[i], bbs.li[i].className, bbs.dl[i])
  }

  bbs.closed.onclick = function () {
    $(bbs.view).fadeOut(500, function () {
      bbs.elm.className = ""
      bbs.view = false
    })
    return false
  }

  //	if( location.hash == '#lets' )
  //	{
  //		setTimeout
  //		(
  //			function()
  //			{
  //				over.elm.style.display	= 'none';
  //				like.view				= true;
  //				over.elm.className		= '';
  //				BODY.className			= 'off';
  //				container.sty.top		= -win.h + 'px';
  //				setWindowSize();
  //				createSwf( 1.2 );
  //			},
  //			1500
  //		);
  //	}
}

/*****************************

	Ready Game

*****************************/

function createSwf(time) {
  var func = function () {
    setTimeout(function () {
      var fla = createFlashArea(
        "10.0.22",
        "mainflash",
        "noflashBox",
        flashArgs,
        wrap.elm,
        container.elm
      )

      if (fla) {
        flashArea.elm = DOCUMENT.getElementById(flashArea.id)
        flashArea.obj = flashArea.elm.getElementsByTagName("object")[0]
        flashArea.embed = flashArea.elm.getElementsByTagName("embed")[0]
        wrap.elm.className = "off"

        setTimeout(function () {
          container.elm.className = "off"
        }, 5000)
      }

      setWindowSize()
    }, 500)
  }

  $(container.elm).animate({ top: 0 }, time * 1000, "easeInCubic", func)
}

/*****************************

	Closing Game

*****************************/

function closeGame() {
  topSky.elm.className = topSky.cls
  container.elm.className = ""
  wrap.elm.style.height = "auto"
  setTimeout(function () {
    wrap.elm.className = ""
    wrap.elm.removeChild(flashArea.elm)
    delete flashArea.obj

    $(container.elm)
      .delay(1000)
      .animate({ top: -win.h }, 1.2 * 1000, "easeInCubic", function () {
        container.sty.top = 0
        BODY.className = ""
        like.view = false
        topSky.elm.className = ""
        over.elm.className = ""
        over.elm.removeAttribute("style")
        catchArea.elm.removeAttribute("style")
        setWindowSize()
      })
  }, 1000)
}

/*****************************

	Closing NoFlash

*****************************/

function closeNoFla() {
  document.getElementById("noflashBox").className = "nodisp"
  container.elm.className = ""

  var func = function () {
    container.sty.top = 0
    BODY.className = ""
    like.view = false
    topSky.elm.className = ""
    over.elm.className = ""
    over.elm.removeAttribute("style")
    catchArea.elm.removeAttribute("style")
    setWindowSize()
  }

  $(container.elm)
    .delay(1000)
    .animate({ top: -win.h }, 1.2 * 1000, "easeInCubic", func)
}

/*****************************

	Window Open Event

*****************************/

function setWindowOpen(target, url) {
  target.onclick = function () {
    window.open(url, null)
    return false
  }
}

/*****************************

	Display BBS

*****************************/

function setMouseEvent(target, to, cls, view) {
  if (ie != 6) {
    target.onmouseover = function () {
      $(to).addClass("on")
    }

    target.onmouseout = function () {
      $(to).removeClass("on")
    }
  }

  target.onclick = function () {
    if (bbs.view) {
      $(bbs.view).fadeOut(300, function () {
        bbs.elm.className = cls
        $(view).fadeOut(0)
        $(view).fadeIn(300)
      })
    } else {
      bbs.elm.className = cls
      $(view).fadeOut(0)
      $(view).fadeIn(300)
    }

    bbs.view = view

    return false
  }
}

/*****************************

	Setting Timeout Event

*****************************/

function setTimer() {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(trainFunc, 10 * 1000)
}

/*****************************

	Train Animation

*****************************/

function trainFunc() {
  if (train.cls == "go") {
    train.cls = "back"
  } else {
    train.cls = "go"
  }

  train.elm.className = train.cls

  setTimer()
}

/*****************************

	Window Resize Event

*****************************/

function setWindowSize() {
  win.h = BODY.clientHeight
  win.ih = Math.max.apply(null, [
    BODY.clientHeight,
    BODY.scrollHeight,
    DOCUMENT.documentElement.scrollHeight,
    DOCUMENT.documentElement.clientHeight,
  ])

  if (win.h <= 0) {
    win.h = DOCUMENT.documentElement.clientHeight
  }

  /*--- topSky Resize ---*/

  topSky.stl.height = win.h + "px"

  /*--- Flash Resize ---*/

  flashArgs.height = win.h + "px"

  if (flashArea.obj) {
    if (win.h < 865) {
      wrap.elm.style.height = "865px"
      flashArea.obj.height = 865
      flashArea.embed.height = 865
    } else {
      wrap.elm.style.height = "100%"
      flashArea.obj.height = win.h
      flashArea.embed.height = win.h
    }
  }

  if (ie) {
    //ieToGame.sty.height		= win.h;
  } else {
    win.yc = (win.h * 0.5) | 0
    win.yc40 = (win.h * 0.4) | 0
    win.yc60 = (win.h * 0.6) | 0
    ground.sty.height = win.h + win.yc + "px"

    if (catchPosi == "top") {
      $(ground.elm).css("transform-origin", 491 + "px " + 5 + "px")
    } else if (catchPosi == "bottom") {
      $(ground.elm).css(
        "transform-origin",
        491 + "px " + (win.h + win.yc - 180) + "px"
      )
    }
  }
}

/*****************************

	Window Scroll Event

*****************************/

function onScroll() {
  win.y = WINDOW.scrollY

  for (var i = 0; i < chtr_num; ++i) {
    if (catchPosi == "top" || catchPosi == "") {
      if (win.y < chtr[i].scrl - win.yc60 + chtr[i].h) {
        chtr[i].cls = "pos_02"
        chtr[i].elm.className = chtr[i].cls
      } else {
        chtr[i].cls = "pos_01"
        chtr[i].elm.className = chtr[i].cls
      }
    } else {
      if (win.y > chtr[i].scrl - win.yc40) {
        chtr[i].cls = "pos_02"
        chtr[i].elm.className = chtr[i].cls
      } else {
        chtr[i].cls = "pos_01"
        chtr[i].elm.className = chtr[i].cls
      }
    }
  }

  if (!like.view) {
    /**************** 荳翫〒繧ｭ繝｣繝�メ ****************/

    if (catchPosi == "top") {
      var s = catchArea.h + win.yc - win.h
      var t = s - win.y

      if (t >= 0) {
        var fn = 1000
        var sn = 1500

        $(ball.elm).css("opacity", quadEaseOut(t, 0.1, ball.maxo - 0.1, s))

        if (t <= fn + win.yc) {
          var b = linear(t, ball.mins, 2 - ball.mins, fn + win.yc)
        } else {
          var b = quadEaseOut(
            t - (fn + win.yc),
            2,
            ball.maxs - 2,
            s - (fn + win.yc)
          )
          $(black.elm).css(
            "opacity",
            linear(t - (fn + win.yc), 0, 1, s - (fn + win.yc))
          )
        }

        $(ball.elm).css("transform", "scale(" + b + "," + b + ")")

        if (t >= win.yc) {
          if (t <= fn + win.yc) {
            var g = linear(t - win.yc, 1, 6 - 1, fn)
          } else {
            var g = quadEaseOut(
              t - (fn + win.yc),
              6,
              ground.maxs - 6,
              s - (fn + win.yc)
            )
          }

          $(ground.elm).css("transform", "scale(" + g + "," + g + ")")

          if (t <= sn + win.yc) {
            $(ground.elm).css(
              "top",
              linear(t - win.yc, -win.yc, win.yc, sn) + "px"
            )
          }
        } else {
          $(ground.elm).css(
            "top",
            linear(t, -win.h, -win.yc + win.h, win.yc) + "px"
          )
        }

        over.elm.className = over.cls

        /*--- Catch!! ---*/

        if (win.y == 0) {
          if (sound.play) {
            sound.catch_elm.play()
          }
          $(ball.elm).css("opacity", 0)
          $(ground.elm).css("bottom", 0)
          ground.elm.className = ground.cls
          container.elm.className = container.cls
          catcher.elm.className = ""
          black.elm.className = "end"
          catchPosi = ""

          setTimeout(function () {
            black.elm.className = ""
            if (sound.play) {
              sound.pitch_elm.play()
            }
            $(catchArea.top_elm).animate({ height: 91 }, 1000, "easeOutExpo")
            $(black.elm).fadeOut(1000, function () {
              catchPosi = "bottom"
              over.elm.className = ""
              ground.elm.className = ""
              $(black.elm).fadeIn(0)
              setWindowSize()

              for (var i = 0; i < chtr_num; ++i) {
                chtr[i].scrl = $(chtr[i].elm).offset().top
              }
            })
            ++pitchNum
          }, 1100)

          catcher.elm.className = ""
          catchArea.sty.height = catchArea.h + "px"
          win.ih = Math.max.apply(null, [
            BODY.clientHeight,
            BODY.scrollHeight,
            DOCUMENT.documentElement.scrollHeight,
            DOCUMENT.documentElement.clientHeight,
          ])
        }
      } else {
        over.elm.className = ""
        $(ball.elm).css({
          transform: "scale(" + ball.mins + "," + ball.mins + ")",
          opacity: 0,
        })
        $(ground.elm).css({
          top: 0,
          transform: "scale(1,1)",
        })
        $(black.elm).css("opacity", 0)
      }
    } else if (catchPosi != "") {

    /**************** 荳九〒繧ｭ繝｣繝�メ ****************/
      var s = catchArea.h + win.yc - win.h
      var t = win.y - (win.ih - s - win.h)

      if (t >= 0) {
        var fn = 1000
        var sn = 1500

        ball.elm.className = ""
        $(ball.elm).css("opacity", quadEaseOut(t, 0.1, ball.maxo - 0.1, s))

        if (t <= fn + win.yc) {
          var b = linear(t, ball.mins, 2 - ball.mins, fn + win.yc)
        } else {
          var b = quadEaseOut(
            t - (fn + win.yc),
            2,
            ball.maxs - 2,
            s - (fn + win.yc)
          )
          $(black.elm).css(
            "opacity",
            linear(t - (fn + win.yc), 0, 1, s - (fn + win.yc))
          )
        }

        $(ball.elm).css("transform", "scale(" + b + "," + b + ")")

        if (t >= win.yc) {
          if (t <= fn + win.yc) {
            var g = linear(t - win.yc, 1, 6 - 1, fn)
          } else {
            var g = quadEaseOut(
              t - (fn + win.yc),
              6,
              ground.maxs - 6,
              s - (fn + win.yc)
            )
          }

          $(ground.elm).css("transform", "scale(" + g + "," + g + ")")

          if (t <= sn + win.yc) {
            $(ground.elm).css("top", linear(t - win.yc, 0, -win.yc, sn) + "px")
          }
        } else {
          $(ground.elm).css("top", linear(t, win.yc, -win.yc, win.yc) + "px")
        }

        over.elm.className = over.cls
        if (catchPosi == "last") {
          black.elm.className = "next"
        }

        /*--- Catch!! ---*/

        if (win.y >= win.ih - win.h) {
          //					notify.elm.className		= notify.cls;
          //					notifyBall.elm.className	= notify.cls;
          //					console.log( notifyBall.elm );
          if (sound.play) {
            sound.catch_elm.play()
          }
          $(ball.elm).css("opacity", 0)

          //					if( pitchNum >= 2 )
          //					{
          //						ball.elm.className			= 'off';
          //						catchPosi					= 'last';
          //						black.elm.className			= 'last';
          //						topDiv.elm.className		= '';
          //						container.elm.className		= '';
          //						catchArea.top_elm.className	= 'nodisp';
          ////						notify.elm.className		= '';
          ////						notifyBall.elm.className	= '';
          //						win.ih						= Math.max.apply
          //						(
          //							null,
          //							[
          //								BODY.clientHeight,
          //								BODY.scrollHeight,
          //								DOCUMENT.documentElement.scrollHeight,
          //								DOCUMENT.documentElement.clientHeight
          //							]
          //						);
          //					}
          //					else
          //					{
          $(ground.elm).css("top", 0)
          ground.elm.className = ground.cls
          catcher.elm.className = catcher.cls
          catchPosi = ""
          black.elm.className = "end"

          setTimeout(function () {
            black.elm.className = ""
            if (sound.play) {
              sound.pitch_elm.play()
            }

            if (macSafari) {
              $(BODY).animate(
                { scrollTop: win.ih - win.h - catchArea.h + 200 },
                1000,
                "easeOutExpo",
                function () {
                  catchArea.sty.height = 200 + "px"
                }
              )
            } else {
              $(catchArea.elm).animate({ height: 200 }, 1000, "easeOutExpo")
            }

            $(black.elm).fadeOut(1000, function () {
              catchPosi = "top"
              over.elm.className = ""
              ground.elm.className = ""
              $(black.elm).fadeIn(0)
              setWindowSize()

              for (var i = 0; i < chtr_num; ++i) {
                chtr[i].scrl = $(chtr[i].elm).offset().top
              }
            })
            ++pitchNum
          }, 1100)

          topDiv.elm.className = topDiv.cls
          catcher.elm.className = catcher.cls
          catchArea.top_elm.className = ""
          catchArea.top_sty.height = catchArea.h + "px"
          win.ih = Math.max.apply(null, [
            BODY.clientHeight,
            BODY.scrollHeight,
            DOCUMENT.documentElement.scrollHeight,
            DOCUMENT.documentElement.clientHeight,
          ])
          WINDOW.scroll(WINDOW.scrollX, win.ih - win.h + 10)
          //					}
        }
      } else {
        over.elm.className = ""
        $(ball.elm).css({
          transform: "scale(" + ball.mins + "," + ball.mins + ")",
          opacity: 0,
        })
        $(ground.elm).css({
          top: 0,
          transform: "scale(1,1)",
        })
        $(black.elm).css("opacity", 0)
      }
    }
  }
}

/*****************************

	Easing

*****************************/

function expoEaseIn(t, b, c, d) {
  t /= d
  t = t - 1
  return c * (t * t * t * t * t * t * t * t * t * t * t + 1) + b
}

function testEaseIn(t, b, c, d) {
  t /= d
  return c * t * t * t * t + b
}

function quadEaseOut(t, b, c, d) {
  t /= d
  t = t - 1
  return c * (t * t * t + 1) + b
}

function linear(t, b, c, d) {
  return (c * t) / d + b
}

/*--- onload Event ---*/

WINDOW.onload = init
