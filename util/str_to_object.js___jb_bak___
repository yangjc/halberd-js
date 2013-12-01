define(function(require, exports, module){
/**!module:format
 * Author : YJC
 * Date : 2013-04-21
 */

/**
 * 解析字符串为对象
 * @param str 字符串
 * @param separator 键值对之间的分隔符号
 * @param mark 键和值之间的分隔符号
 * @param cover_mode 相同key处理方式：first(取第一个出现的值)/last(取最后出现的值)/all(保留全部值)
 * @param fn_value
 * @param fn_key
 * @return {Object}
 */
exports.str_to_object = function(str, separator, mark, cover_mode, fn_value, fn_key){
  if (typeof str !== 'string') return {};
  var re = {}, key, value;
  str = str.split(separator || ';');
  if ( ! mark) mark = ':';
  for (var i in str) {
    if ( ! module.trim(str[i])) continue;
    str[i] = str[i].split(mark);
    key = (typeof fn_key === 'function') ? fn_key(str[i][0]) : str[i][0];
    value = (typeof fn_value === 'function') ? fn_value(str[i][1]) : str[i][1];
    if (key in re) {
      switch(cover_mode){
        case 'first':
          continue;
        case 'last':
          re[key] = value;
          break;
        default:
          if (typeof re[key] === 'object') re[key].push(value);
          else re[key] = [re[key], value];
      }
    } else re[key] = value;
  }
  return re;
};
});