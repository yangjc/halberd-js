define(function(require, exports, module){
/**!module:object
 * Author : YJC
 * Date : 2013-04-21
 */

/**
 * 为对象的指定属性赋值，该值在对象里的层级关系由 keys 描述
 * @param {Array} keys 描述层级
 * @param value 新值/得到新值的函数
 * @param object 目标对象
 * @param fn_value 是否赋值为 value(original_value) 的返回值
 * @returns {Object} 扩展后的对象
 */
exports.attr_value = function(keys, value, object, fn_value){
  if (typeof object !== 'object') object = {};
  var last = keys.length - 1, o = object, type;
  module.foreach(keys, function(key, i){
    if (i === last) {
      o[key] = (fn_value && typeof value === 'function') ? value(o[key]) : value;
    } else {
      type = typeof o[key];
      if ((type !== 'object' && type !== 'function') || o[key] === null) {
        o[key] = {};
      }
      o = o[key];
    }
  });
  return object;
};
});