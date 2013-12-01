define(function(require, exports, module){
/**!module:string
 * 转义 & < > 为 html 实体
 * Author : YJC
 * Date : 13-4-15
 */
exports.escape_html = function(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
});