define(function(require, exports, module){
/**!module:function
 * Author : YJC
 * Date : 2013-09-03
 */
exports.parse_deps = (function(){
  var reg_r = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*(?:require|module)|(?:^|[^$])\b(?:require\s*\(\s*(["'])(.+?)\1\s*\)|module\s*\.\s*([a-zA-Z_]+\w*))/g;
  var reg_s = /\\\\/g;

  // 从模块源码分析依赖关系
  // require("id"); module.fn_name;
  return function(code/*@hjs-build*/ , module_object /*@hjs-build*/) {
    var ret = [];

    code.replace(reg_s, "")
      .replace(reg_r, function(m, m1, m2, m3) {
        // 排除默认属性
        m3 && ! module_object[m3] && (m2 = 'util/' + m3);

        m2 && ret.push(m2)
      });

    return ret
  }
})();
});