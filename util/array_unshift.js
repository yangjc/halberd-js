define(function(require, exports, module){
/**!phpjs;module:array
 */
exports.array_unshift = function array_unshift (array) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Martijn Wieringa
  // +   improved by: jmweb
  // %        note 1: Currently does not handle objects
  // *     example 1: array_unshift(['van', 'Zonneveld'], 'Kevin');
  // *     returns 1: 3
  var i = arguments.length;

  while (--i !== 0) {
    arguments[0].unshift(arguments[i]);
  }

  return arguments[0].length;
};// Fork from https://github.com/kvz/phpjs
});