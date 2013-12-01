define(function(require, exports, module){
/**!module:function
 * Author : YJC
 * Date : 2013-10-20
 */

exports.parse_module_util = (function(){

  var reg_r_n = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*util_exports|(?:^|[^$])\butil_exports(?:\s*\.\s*([a-zA-Z_]+\w*))/g;
  var reg_r = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*module|(?:^|[^$])\bmodule(?:\s*\.\s*([a-zA-Z_]+\w*))/g;
  var reg_s = /\\\\/g;

  /**
   * 分析源码中的 module.util_function / util_exports.util_function
   */
  return function parse_module_util(code, fn, module_object, is_nodejs){
    var ret = [],
      cache = {}; // 辅助去重

    code.replace(reg_s, "")
      .replace(is_nodejs ? reg_r_n : reg_r, function(m, m1) {
        if (m1 && ! cache[m1] &&
          ( ! module_object || (module_object && ! module_object[m1]))) {
          cache[m1] = 1;
          ret.push(m1);
          fn && fn(m1);
        }
      });

    return ret;
  }
})();
});