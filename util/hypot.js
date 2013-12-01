define(function(require, exports, module){
/**!phpjs;module:math
 */
exports.hypot = function hypot (x, y) {
  // http://kevin.vanzonneveld.net
  // +   original by: Onno Marsman
  // *     example 1: hypot(3, 4);
  // *     returns 1: 5
  // *     example 2: hypot([], 'a');
  // *     returns 2: 0
  return Math.sqrt(x * x + y * y) || 0;
};// Fork from https://github.com/kvz/phpjs
});