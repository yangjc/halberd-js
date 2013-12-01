define(function(require, exports, module){
/**!module:vars
 * Author : YJC
 * Date : 2013-08-22
 */
exports.is_array = function(v){
  return typeof v === 'object' &&
    Object.prototype.toString.call(v) === '[object Array]';
};
});