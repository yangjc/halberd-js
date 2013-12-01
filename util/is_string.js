define(function(require, exports, module){
/**!phpjs;module:var
 */
exports.is_string = function is_string (mixed_var) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // *     example 1: is_string('23');
  // *     returns 1: true
  // *     example 2: is_string(23.5);
  // *     returns 2: false
  return (typeof(mixed_var) == 'string');
};// Fork from https://github.com/kvz/phpjs
});