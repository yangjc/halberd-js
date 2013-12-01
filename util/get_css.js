define(function(require, exports, module){
/**!module:;client-side
 * Author : YJC
 * Date : 2013-11-20
 */

exports.get_css = (function(){
  // 主体逻辑从 seaJS v2.1.1 中抽离出来

  var doc = document,
    head = doc.getElementsByTagName("head")[0] || doc.documentElement,

  // `onload` event is not supported in WebKit < 535.23 and Firefox < 9.0
  // ref:
  //  - https://bugs.webkit.org/show_activity.cgi?id=38995
  //  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
  //  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
    isOldWebKit =
      (navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1")) * 1 < 536;

  // todo: Opera下，css文件404或者Content-Type不是text/css时，没有触发onload

  function addOnload(node, callback) {
    isOldWebKit || !("onload" in node) // missing onload
      ? // for Old WebKit and Old Firefox
      setTimeout(function() {
        pollCss(node, callback)
      }, 1) // Begin after node insertion
      :
      node.onload = node.onerror = function() {
        // Ensure only run once and handle memory leak in IE
        node.onload = node.onerror = null;

        // Dereference the node
        node = null;

        callback()
      }
  }

  function pollCss(node, callback) {
    var sheet = node.sheet;
    var isLoaded;

    // for WebKit < 536
    if (isOldWebKit) {
      if (sheet) {
        isLoaded = true
      }
    }
    // for Firefox < 9.0
    else if (sheet) {
      try {
        if (sheet.cssRules) {
          isLoaded = true
        }
      } catch (ex) {
        // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
        // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
        // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
        if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
          isLoaded = true
        }
      }
    }

    setTimeout(function() {
      if (isLoaded) {
        // Place callback here to give time for style rendering
        callback()
      }
      else {
        pollCss(node, callback)
      }
    }, 20)
  }

  return function(url, callback) {
    var node = doc.createElement("link");

    callback && addOnload(node, callback);

    node.rel = "stylesheet";
    node.href = url;

    head.appendChild(node)
  }
})();
});