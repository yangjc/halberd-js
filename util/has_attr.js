define(function(require, exports, module){
/**!module:object
 * Author : YJC
 * Date : 2013-04-30
 */
/**
 * 检查一个对象/函数是否含有某个属性，该属性的层级关系由 keys 描述
 * @param {Array} keys 描述属性的层级关系
 * @param {Object|Function} object
 * @param own_only 为真时不检查原型链
 * @returns {boolean}
 */
exports.has_attr = function(keys, object, own_only){
  var t = typeof object;
  if (t !== 'object' && t !== 'function') return false;
  var i = 0, l = keys.length, last = l - 1, o = object;
  for (; i < l; i ++) {
    if (own_only && ! o.hasOwnProperty(keys[i])) {
      return false;
    }
    if (keys[i] in o) {
      if (i === last) {
        return true;
      }
      t = typeof o[keys[i]];
      if (t === 'object' || t === 'function') {
        o = o[keys[i]];
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
};
});