define(function(require, exports, module){
/**!module:dom;client-side
 * Author : YJC
 * Date : 2013-04-21
 */
/*
 * Dom Ready 回调
 * 出处：http://www.planabc.net/2011/05/26/domready_function/
 * 与 jQuery.ready 的实现思路基本一致
 */
exports.domready = (function(W, D){
  var isReady = 0,
    isBind = 0,
    fns = [],
    testEl = D.createElement('p'),
    bindReady,
    init;

  bindReady = function (){
    if(isBind) return;
    isBind = 1;

    // Catch cases where domReady is called after the browser event has already occurred.
    // readyState: "uninitalized"、"loading"、"interactive"、"complete" 、"loaded"
    if(D.readyState === "complete") {
      setTimeout(init);
    } else if (D.addEventListener) {
      D.addEventListener("DOMContentLoaded", function () {
        D.removeEventListener("DOMContentLoaded", arguments.callee, false);
        init();
      }, false);
      W.addEventListener("load", init, false);
    } else if(D.attachEvent) {
      // In IE, ensure firing before onload, maybe late but safe also for iframes.
      D.attachEvent("onreadystatechange", function() {
        if (D.readyState === "complete") {
          D.detachEvent("onreadystatechange", arguments.callee);
          init();
        }
      });
      W.attachEvent("onload", init);

      // If IE and not a frame, continually check to see if the document is ready.
      if(testEl.doScroll && W == W.top){
        doScrollCheck();
      }
    }
  };

  // Process items when the DOM is ready.
  init = function () {
    isReady = 1;

    // Make sure body exists, at least, in case IE gets a little overzealous.
    // This is taked directly from jQuery's implementation.
    if (!D.body) {
      setTimeout(init);
      return;
    }

    for (var i = 0, l = fns.length; i < l; i++) {
      fns[i]();
    }
    fns = [];
  };

  function doScrollCheck() {
    if(isReady) return;

    try {
      // If IE is used, use the trick by Diego Perini
      // http://javascript.nwbox.com/IEContentLoaded/
      testEl.doScroll('left');
    } catch (e) {
      setTimeout(doScrollCheck, 50);
      return;
    }

    init();
  }

  return function(fn){
    bindReady(fn);

    if (isReady) {
      fn();
    } else {
      fns.push(fn);
    }
  };
})(window, document);
});