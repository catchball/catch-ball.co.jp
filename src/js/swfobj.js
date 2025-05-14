/**************************************************
 *
 *	@name			swfobj.js
 *	@facility		FLASH出力及びプラグインのチェック
 *	@created date	2003/11/06
 *	@copyright (c) 2003-2008 COCONOE inc.
 *
 *	[更新履歴]
 *	@v1.1		:	2003/11/06	:	execScriptにて、VBScriptを実行できるように修正
 *	@v1.2		:	2004/12/07	:	wmodeを引数に追加（透過設定）
 *	@v1.3		:	2004/05/13	:	allowScriptAccess, scale, salign, baseを引数に追加
 *	@v1.4		:	2006/10/30	:	flashVarsを引数に追加
 *	@v1.5		:	2008/04/04	:	embedのwmodeを追加
 *	@v1.6		:	2008/05/01	:	・common.jsと一まとめに
 *									・divのidと被ると、ExternalInterfaceでJSエラーが出る件の修正
 *									・バージョンの取得方法を変更
 *	@v1.7		:	2008/05/08	:	htmlDivIdのバグ修正
 *	@v1.8		:	2008/07/25	:	instanceof、for(...in...)を削除…。※古いブラウザでは使えませんでした。
 *	@v1.9		:	2008/11/04	:	allowFullScreenを追加
 *	@v2.0		:	2008/11/14	:	パラメータにminWidth, minHeightを追加
 *	@v2.01		:	2008/12/13	:	必須バージョンに一桁しか入力されていない場合の修正
 *
 **************************************************/

var SN = "201003151834"

var nUserAgent = navigator.userAgent
var nMimeTypes = navigator.mimeTypes

var IE = /*@cc_on!@*/ false
var WIN = nUserAgent.indexOf("Win", 0) != -1

var flashDivId

var flashPlugin = 0
var flashVer = "0.0.0"
var flashArgs
var flashPluginspages = new Array(
  location.protocol +
    "//www.macromedia.com/jp/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash", // JPN PLUGIN'S PAGES
  location.protocol +
    "//www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" // ENG PLUGIN'S PAGES
)

/**
  * フラッシュの表示用タグを記述する
  *
  * @param	flashReqVer			FlashPlayerの必要バージョン (ex. 9, "9.0.28")
  * @param	flashDivId			記述するDIVのID (ex. <div id="hoge">...)
  * @param	htmlDivId			代わりに消去するDIVのID ※配列で複数指定可能です (ex. "hogehtml", ["hogehtml01", "hogehtml02"])
  * @param	args				挿入するパラメータ(以下 パラメータ)
  *
  *			id					FlashのID (ex. "flashdemo")
  *			width				横幅 (ex. 800)
  *			height				高さ (ex. 600)
  *			minWidth			最小横幅 (ex. 800) ※これ以下になると、スクロールバーが出ます
  *			minHeight			最小高さ (ex. 600) ※これ以下になると、スクロールバーが出ます
  *			file				swfファイルのパス (ex. "./swf/demo.swf")
  *			bgcolor				背景色 (ex. "#0f0f0f")
  *			menu				メニュー表示の可否 (true/false)
  *			quality				表示クォリティ (LOW/MEDIUM/HIGH/AUTOHIGH/AUTOLOW)
  *			wmode				表示モード (window/opaque/transparent)
  *			allowscriptaccess	スクリプト実行の可否 (always/never)
  *			scale				スケール (showall/noborder/exactfit/noscale)
  *			salign				配置位置 (L/R/T/B/TL/TR/BL/BR)
  *			vars				パラメータ (ex. arg01=hoge&arg02=hoge)
  *			allowFullScreen		フルスクリーン許可
  *
  @usage
             var flashArgs				= new Object();
             flashArgs.id				= "hogeexternal";
             flashArgs.width				= "250";
             flashArgs.height			= "700";
             flashArgs.file				= "./hoge.swf";
             flashArgs.bgcolor			= "#ffffff";
             flashArgs.quality			= "MEDIUM";
             flashArgs.menu				= false;
             flashArgs.scale				= "noscale";
             flashArgs.salign			= "";
             flashArgs.wmode				= "transparent";
             
             createFlashArea("9.0.28", "flashmenu", "htmlmenu", flashArgs);
  */

function createFlashArea(
  flashReqVer,
  flashDivId,
  htmlDivId,
  args,
  area,
  before
) {
  this.flashDivId = flashDivId
  this.flashArgs = args

  if (hasPlugin(flashReqVer)) {
    // 消すHTMLのID(配列でも可)
    if (htmlDivId) {
      //if(htmlDivId instanceof Array)
      if (typeof htmlDivId == "Array") {
        for (var i = 0; i < htmlDivId.length; i++) {
          hideHtmlArea(htmlDivId[i])
        }
      } else {
        hideHtmlArea(htmlDivId)
      }
    }

    /*document.open();
         with(document)
         {
             write('<div id="' + flashDivId + '">');
             write(getFlashTag(args));
             write('</div>');
         }
         document.close();*/

    var div = document.createElement("div")
    div.id = "flashDivId"
    div.innerHTML = getFlashTag(args)

    area.insertBefore(div, before)

    if (args.minWidth || args.minHeight) {
      setMinViewportArea()
    }

    return true
  } else {
    // 消すHTMLのID(配列でも可)
    if (htmlDivId) {
      document.getElementById(htmlDivId).className = ""
    }
  }

  return false
}

function hasPlugin(flashReqVer) {
  flashPlugin = getFlashPlugin()
  flashVer = getFlashVer(flashPlugin)

  var sepVer = flashReqVer.split(".")
  if (sepVer[1] == undefined) sepVer[1] = 0
  if (sepVer[2] == undefined) sepVer[2] = 0
  flashReqVer = sepVer.join(".")

  var tmpCurVer =
    getMajorVer(flashVer) * 1000 * 1000 +
    getMinorVer(flashVer) * 1000 +
    getRevision(flashVer)
  var tmpReqVer =
    getMajorVer(flashReqVer) * 1000 * 1000 +
    getMinorVer(flashReqVer) * 1000 +
    getRevision(flashReqVer)

  if (tmpCurVer < tmpReqVer) {
    return false
  }

  //alert("ver. " + flashVer);

  return true
}

function hideHtmlArea(id) {
  if (document.getElementById(id)) {
    document.getElementById(id).style.display = "none"
    document.getElementById(id).style.visibility = "hidden"
  }
}

function getFlashTag(args) {
  var rtnStr =
    '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' +
    ' codebase="' +
    location.protocol +
    '//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"' +
    ' id="' +
    this.flashArgs.id +
    '"' +
    ' width="' +
    this.flashArgs.width +
    '"' +
    ' height="' +
    this.flashArgs.height +
    '"' +
    ">" +
    '<param name="movie" value="' +
    this.flashArgs.file +
    '" />' +
    '<param name="quality" value="' +
    this.flashArgs.quality +
    '" />' +
    '<param name="bgcolor" value="' +
    this.flashArgs.bgcolor +
    '" />' +
    '<param name="menu" value="' +
    this.flashArgs.menu +
    '" />'

  if (this.flashArgs.wmode)
    rtnStr += '<param name="wmode" value="' + this.flashArgs.wmode + '" />'
  if (this.flashArgs.allowscriptaccess)
    rtnStr +=
      '<param name="allowscriptaccess" value="' +
      this.flashArgs.allowscriptaccess +
      '" />'
  if (this.flashArgs.scale)
    rtnStr += '<param name="scale" value="' + this.flashArgs.scale + '" />'
  if (this.flashArgs.salign)
    rtnStr += '<param name="salign" value="' + this.flashArgs.salign + '" />'
  if (this.flashArgs.vars)
    rtnStr += '<param name="FlashVars" value="' + this.flashArgs.vars + '" />'
  if (this.flashArgs.allowFullScreen)
    rtnStr +=
      '<param name="allowFullScreen" value="' +
      this.flashArgs.allowFullScreen +
      '" />'

  rtnStr +=
    '<embed src="' +
    this.flashArgs.file +
    '"' +
    ' name="' +
    this.flashArgs.id +
    '"' +
    ' align="middle"' +
    ' quality="' +
    this.flashArgs.quality +
    '"' +
    ' bgcolor="' +
    this.flashArgs.bgcolor +
    '"' +
    ' width="' +
    this.flashArgs.width +
    '"' +
    ' height="' +
    this.flashArgs.height +
    '"' +
    ' menu="' +
    this.flashArgs.menu +
    '"'

  if (this.flashArgs.wmode) rtnStr += ' wmode="' + this.flashArgs.wmode + '"'
  if (this.flashArgs.allowscriptaccess)
    rtnStr += ' allowscriptaccess="' + this.flashArgs.allowscriptaccess + '"'
  if (this.flashArgs.scale) rtnStr += ' scale="' + this.flashArgs.scale + '"'
  if (this.flashArgs.salign) rtnStr += ' salign="' + this.flashArgs.salign + '"'
  if (this.flashArgs.vars) rtnStr += ' FlashVars="' + this.flashArgs.vars + '"'
  if (this.flashArgs.allowFullScreen)
    rtnStr += ' allowFullScreen="' + this.flashArgs.allowFullScreen + '"'

  rtnStr +=
    ' type="application/x-shockwave-flash"' +
    ' pluginspage="' +
    flashPluginspages[isJpn()] +
    '"' +
    ">" +
    "</embed>" +
    "</object>"

  return rtnStr
}

function isJpn() {
  if (!navigator.userLanguage) return 1
  if (
    navigator.language &&
    (navigator.language.indexOf("ja") != -1 ||
      navigator.userLanguage.indexOf("ja") != -1)
  )
    return 0
  return 1
}

function getMajorVer(ver) {
  return getVerDetail(ver, 0)
}
function getMinorVer(ver) {
  return getVerDetail(ver, 1)
}
function getRevision(ver) {
  return getVerDetail(ver, 2)
}

function getVerDetail(ver, len) {
  ver = ver + ""
  var tmpVer = 0
  if (ver.indexOf(".") != -1) {
    var sepVer = ver.split(".")
    if (sepVer.length > len) {
      tmpVer = sepVer[len]
    }
  }
  return parseInt(tmpVer)
}

function getFlashPlugin() {
  return nMimeTypes && nMimeTypes["application/x-shockwave-flash"]
    ? nMimeTypes["application/x-shockwave-flash"].enabledPlugin
    : 0
}

function getFlashVer(plugin) {
  var tmpVer = "0.0.0"

  if (plugin && plugin.description) {
    tmpVer = plugin.description
      .replace(/^[A-Za-z\s]+/, "")
      .replace(/(\s+r|\s+b[0-9]+)/, ".")
  } else if (IE && WIN) {
    var num = 50 // <-- とりあえず、ver.50から下がっていく
    var x = ""
    var axo

    while (true) {
      try {
        var ssf = "ShockwaveFlash.ShockwaveFlash"
        if (num != 0) ssf += "." + num

        axo = new ActiveXObject(ssf)
        x = axo.GetVariable("$version")
      } catch (e) {}
      num--
      if (x || num < 0) break
    }
    if (x != 0)
      tmpVer = x
        .replace(/^WIN /, "")
        .replace(/,[0-9]+\$/, "")
        .replace(/,/g, ".")
  }

  return tmpVer
}

/**************************************************
 *
 *	set minimum viwport area
 *
 **************************************************/
function setMinViewportArea() {
  // 関数の有無(func.js)をチェック
  if ("function" === typeof window.addOnresizeEvent) {
    addOnresizeEvent(setMinViewportAreaHandler)
  } else {
    alert("'func.js'をインポートして下さい")
  }
}

function setMinViewportAreaHandler() {
  var ww =
    this.flashArgs.minWidth == undefined
      ? "100%"
      : getViewportArea().w < this.flashArgs.minWidth
      ? this.flashArgs.minWidth + "px"
      : "100%"
  var hh =
    this.flashArgs.minHeight == undefined
      ? "100%"
      : getViewportArea().h < this.flashArgs.minHeight
      ? this.flashArgs.minHeight + "px"
      : "100%"

  document.getElementById(this.flashDivId).style.width = ww
  document.getElementById(this.flashDivId).style.height = hh
}
