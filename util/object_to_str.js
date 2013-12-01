define(function(require, exports, module){
/**!module:format
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * 转换对象为字符串
 * 只支持2层嵌套
 * @param object
 * @param separator 键值对之间的分隔符号
 * @param mark 键和值之间的分隔符号
 * @param fn_value
 * @param fn_key
 * @return {String}
 */
exports.object_to_str = function(object, separator, mark, fn_value, fn_key){
  if ( ! separator) separator = '&';
  if ( ! mark) mark = '=';
  var i, j, k, v, str = '',
    key_use_fn = typeof fn_key === 'function', value_use_fn = typeof fn_value === 'function';

  for (i in object) {
    k = key_use_fn? fn_key(i): i;
    switch (typeof object[i]) {
      case 'object':
        for (j in object[i]) {
          if (typeof object[i][j] === 'function') v = object[i][j]();
          else v = object[i][j];
          if (value_use_fn) v = fn_value(v);
          str += (str? separator: '') + k + mark + (v || '');
        }
        continue;
      case 'function':
        v = object[i]();
        break;
      default:
        v = object[i];
    }
    if (value_use_fn) v = fn_value(v);
    str += (str? separator: '') + k + mark + (v || '');
  }
  return str;
};
});