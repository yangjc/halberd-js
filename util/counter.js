define(function(require, exports, module){
/**!module:math
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * 全局计数器，计数从 1 开始
 */
exports.counter = (function(){
  var i = 0;
  return function(){ return ++i; };
})();
});