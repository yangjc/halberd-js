define(function(require, exports, module){
/**!phpjs;module:strings
 */
exports.strtolower = function strtolower (str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Onno Marsman
  // *     example 1: strtolower('Kevin van Zonneveld');
  // *     returns 1: 'kevin van zonneveld'
  return (str + '').toLowerCase();
};// Fork from https://github.com/kvz/phpjs
});