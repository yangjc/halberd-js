define(function(require, exports, module){
/**!module:url
 * Author : YJC
 * Date : 2013-09-03
 */
exports.absolute_url = (function(){

  var reg_root = /^[a-zA-Z]+:\/\/\/?[^/]+/, // 匹配根域名，结尾不含 /
    reg_r_sep = /\/+/g, // 冗余的连续 /
    reg_r_begin = /^(?:\/\.\.?\/)+/, // 冗余的开头 /../ 或 /./
    reg_path_end = /\/\.\.?$/, // 匹配 /.. 或 /. 结尾，此时需补全结尾的 /
    reg_file_end = /[^/]*[?#].*$|[^/]+$/, // 匹配基准路径的文件名部分
    reg_path_current = /\/(?:\.\/)+/g, // 当前路径 /./
    reg_path_upper = /\/[^/]+\/\.\.\//; // 上级路径 /../path/

  /**
   * 获取url的绝对路径
   * @param url 目标路径
   * @param base 基准路径
   * @return {String} 目标绝对路径
   */
  return function(url, base){
    var root = reg_root.exec(url);
    if (root) {
      root = root[0];
      url = url.substr(root.length);
      if (url.charAt(0) !== '/') {
        url = '/' + url;
      }
    } else {
      root = reg_root.exec(base)[0];
      if (url.charAt(0) !== '/') {
        url = '/' + base.substr(root.length).replace(reg_file_end, '') + url;
      }
    }
    if (reg_path_end.test(url)) {
      url += '/';
    }

    url = url.replace(reg_r_sep, '/')
      .replace(reg_path_current, '/');

    while (reg_path_upper.test(url)) {
      url = url.replace(reg_path_upper, '/');
    }

    return root + url.replace(reg_r_begin, '/');
  }
})();
});