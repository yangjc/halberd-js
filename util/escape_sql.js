define(function(require, exports, module){
/**!module:string
 * 转义 \ ' " \0 以安全用于 sql 语句
 * Author : YJC
 * Date : 13-4-15
 */
exports.escape_sql = function(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\0/g, '\\0');
};
});