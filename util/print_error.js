define(function(require, exports, module){
/**!module:debug
 * Author : YJC
 * Date : 2013-05-16
 */
/**
 * 返回Error对象的自定义字符串形式
 * @param err 错误对象
 * @param title 标题
 * @param br 换行符
 * @returns {string}
 */
exports.print_error = function(err, title, br) {
  br = br || '\n';
  title = title ? title + br : '';
  if ( ! (err instanceof Error)) return title + err;
  return title + '[Error]' + (err.errno ? ' #' + err.errno : '') + ' ' +
    (err.message || err.toString()) + (err.stack ? br + '[Stack] ' + err.stack : '');
};
});