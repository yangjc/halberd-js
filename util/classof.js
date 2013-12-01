define(function(require, exports, module){
/**!module:vars
 * Author : YJC
 * Date : 2013-08-22
 */
exports.classof = function(v){
  if (v === null) {
    return 'Null';
  }

  if (typeof v === 'undefined') {
    return 'Undefined';
  }

  return Object.prototype.toString.call(v).slice(8, -1)
};
});