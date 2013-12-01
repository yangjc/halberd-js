define(function(require, exports, module){
/**!module:dom;client-side
 * Author : YJC
 * Date : 2013-04-21
 */

/**
 * 动态插入css文件
 * @param css_file css文件
 */
exports.link_css = function(css_file){
  var head = module.domhead(), link = document.createElement('link');
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = css_file;
  head.insertBefore(link, head.firstChild);
  link = null;
};
});