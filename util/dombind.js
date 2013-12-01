define(function(require, exports, module){
/**!module:dom;client-side
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * 绑定事件
 * @param node DOM节点
 * @param type 事件名
 * @param fn 回调函数
 */
exports.dombind = function(node, type, fn) {
  if (node.addEventListener) {
    node.addEventListener(type, fn, false);
  } else if ( node.attachEvent ) {
    node.attachEvent('on' + type, fn);
  } else {
    type = 'on' + type;
    if ( ! (type in node)) return;
    var before = node[type];
    if (typeof before === 'function') {
      node[type] = function(){
        before();
        fn();
      };
    } else {
      before = null;
      node[type] = fn;
    }
  }
  node = null;
};
});