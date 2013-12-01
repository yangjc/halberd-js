define(function(require, exports, module){
/**!module:vars
 * 检查字符串是否变量名
 * Author : YJC
 * Date : 13-4-17
 */
exports.is_var_name = function(name) {
  return /^[a-z_$][a-z0-9_$]*/i.test(name + '');
};
});