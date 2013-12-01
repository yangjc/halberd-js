define(function(require, exports, module){
/**!module:vars
 * 检查一个变量是否为空
 * Author : YJC
 * Date : 13-4-17
 */

exports.empty = function(object) {
  if (typeof object === 'object') {
    if (module.is_array(object)) {
      return object.length === 0;
    }
    var empty = true;
    for (var i in object) {
      if (object.hasOwnProperty(i)) {
        empty = false;
        break;
      }
    }
    return empty;
  }
  return ! object;
};
});