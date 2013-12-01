define(function(require, exports, module){
/**!phpjs;module:strings
 */
exports.strtoupper = function strtoupper (str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Onno Marsman
  // *     example 1: strtoupper('Kevin van Zonneveld');
  // *     returns 1: 'KEVIN VAN ZONNEVELD'
  return (str + '').toUpperCase();
};// Fork from https://github.com/kvz/phpjs
});