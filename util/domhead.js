define(function(require, exports, module){
/**!module:dom;client-side
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * 获取 document head 节点
 */
exports.domhead = (function(){
  var head;

  return function(){
    if ( ! head) {
      head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    }
    return head;
  }
})();
});