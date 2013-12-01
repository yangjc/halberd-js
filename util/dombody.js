define(function(require, exports, module){
/**!module:dom;client-side
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * 获取 document body 节点
 */
exports.dombody = (function(){
  var body;

  return function(){
    if ( ! body) {
      body = document.body || document.getElementsByTagName('body')[0] || document.documentElement;
    }
    return body;
  }
})();
});