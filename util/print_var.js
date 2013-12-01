define(function(require, exports, module){
/**!module:debug
 * Author : YJC
 * Date : 2013-05-16
 */

/**
 * 输出任意变量为调试用的字符串
 * @param result 变量
 * @param br 换行符
 * @param blank 空白符
 * @returns {String}
 */
exports.print_var = function(result, br, blank) {
  br = br || '\n';
  blank = blank || ' ';

  var var_export;
  if (module.var_export) {
    var_export = function(v){
      return module.var_export(v, {
        br: br,
        blank: blank
      });
    };
  } else {
    var_export = function(v){
      return require('util').inspect(v, 1, 3);
    };
  }

  if (typeof result === 'string' && result.indexOf('Error') === 0) return result;
  var type = typeof result;
  if (type === 'object') {
    result = var_export(result);
  } else if (type === 'function') {
    result = result.toString();
    if (br !== '\n') result = result.replace(/\r?\n/g, br);
    if (blank !== ' ') result = result.replace(/ /g, blank);
  }
  return '(' + type + ') ' + result;
};
});