define(function(require, exports, module){
/**!module:vars
 * Author : YJC
 * Date : 2013-04-21
 */

/**
 * 深度复制函数/数组/对象
 * !复制包含循环引用的对象时，会出现死循环
 * @param object 待复制的变量
 * @return {*} 复制后的变量
 */
exports.clone = function clone(object) {
  var o;

  if (typeof object === 'object' && object) {
    switch (Object.prototype.toString.call(object)) {
      case '[object Array]':
        o = [];
        break;

      case '[object RegExp]':
        return new RegExp(object.source,
          (object.ignoreCase ? 'i' : '') + (object.global ? 'g' : '') + (object.multiline ? 'm' : ''));

      case '[object Date]':
        return new Date(object.getTime());

      default:
        o = {};
    }
  } else if (typeof object === 'function') {
    o = function() {
      return object.apply(this, arguments);
    }
  } else {
    return object;
  }

  for (var i in object) {
    o[i] = clone(object[i]);
  }

  return o;
};
});