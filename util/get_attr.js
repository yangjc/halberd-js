define(function(require, exports, module){
/**!module:object
 * Author : YJC
 * Date : 2013-05-01
 */

exports.get_attr = (function(){

  function get_attr(object, keys, _0){
    if ((typeof object === 'object' && object) || typeof object === 'function') {

      if (typeof keys === 'number') {
        return object[keys];
      }

      var len = keys.length, _1 = _0 + 1;

      if (len === _1) {
        return object[keys[_0]];

      } else if (len > _1) {
        var o = object[keys[_0]];

        if ((typeof o === 'object' && o) || typeof o === 'function') {
          if (len === _1 + 1) {
            return o[keys[_1]]
          } else {
//            console.log('get_attr::get_attr');
            return get_attr(o[keys[_1]], keys, _1 + 1)
          }
        }
      }
    }
  }

  /**
   * 获取对象/函数的某个属性值，属性值的层级关系由 keys 描述
   * @param object
   * @param {Number|String|Array} keys 属性层级
   * @param separator keys分割符
   * @returns {*}
   */
  return function(object, keys, separator){
    if (typeof keys === 'string') {
      keys = keys.split(separator || '.');
    }

    return get_attr(object, keys, 0);
  }
})();
});