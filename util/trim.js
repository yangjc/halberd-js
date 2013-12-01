define(function(require, exports, module){
/**!module:string
 * Author : YJC
 * Date : 2013-04-21
 */
exports.trim = (function(){

  var reg_trim_l = /^[\s\0]+/, reg_trim_r = /[\s\0]+$/;

  /**
   * 去除字符串头尾空字符
   * 当变量类型未知，使用这个函数可避免出错
   * @param str
   * @return {String}
   */
  return function(str){
    return typeof str == 'string' ?
      str.replace(reg_trim_l, '').replace(reg_trim_r, '') :
      (typeof str == 'number' ? '' + str : '')
  };
})();
});