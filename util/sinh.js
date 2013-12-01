define(function(require, exports, module){
/**!phpjs;module:math
 */
exports.sinh = function sinh (arg) {
  // http://kevin.vanzonneveld.net
  // +   original by: Onno Marsman
  // *     example 1: sinh(-0.9834330348825909);
  // *     returns 1: -1.1497971402636502
  return (Math.exp(arg) - Math.exp(-arg)) / 2;
};// Fork from https://github.com/kvz/phpjs
});