define(function(require, exports, module){
/**!phpjs;module:strings
 */
exports.split = function split (delimiter, string) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // -    depends on: explode
  // *     example 1: split(' ', 'Kevin van Zonneveld');
  // *     returns 1: {0: 'Kevin', 1: 'van', 2: 'Zonneveld'}
  return module.explode(delimiter, string);
};// Fork from https://github.com/kvz/phpjs
});