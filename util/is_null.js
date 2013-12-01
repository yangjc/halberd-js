define(function(require, exports, module){
/**!phpjs;module:var
 */
exports.is_null = function is_null (mixed_var) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // *     example 1: is_null('23');
  // *     returns 1: false
  // *     example 2: is_null(null);
  // *     returns 2: true
  return (mixed_var === null);
};// Fork from https://github.com/kvz/phpjs
});