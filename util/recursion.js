define(function(require, exports, module){
/**!module:object
 * Author : YJC
 * Date : 2013-04-21
 */

exports.recursion = (function(){

  function r(object, fn, new_object, options) {
    var re;

    for (var i in object) {
      re = fn(object[i]);
      if (options && ('skip_return' in options) && re === options.skip_return) {
        continue;
      }

      if (object[i] && typeof object[i] === 'object') {
        r(object[i], fn, new_object[i] = {})
      } else {
        new_object[i] = re
      }
    }
  }

  /**
   * 用一个函数递归处理一个对象的每一个元素
   */
  return function(object, fn, options){
    var n = {};

    if (typeof object !== 'object' || ! object) {
      return n;
    }

    r(object, fn, n, options);

    return n;
  }
})();
});