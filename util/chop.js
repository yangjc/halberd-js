define(function(require, exports, module){
/**!phpjs;module:strings
 */
exports.chop = function chop (str, charlist) {
  // http://kevin.vanzonneveld.net
  // +   original by: Paulo Freitas
  // -    depends on: rtrim
  // *     example 1: rtrim('    Kevin van Zonneveld    ');
  // *     returns 1: '    Kevin van Zonneveld'
  return module.rtrim(str, charlist);
};// Fork from https://github.com/kvz/phpjs
});