define(function(require, exports, module){
/**!phpjs;module:array
 */
exports.array_key_exists = function array_key_exists (key, search) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Felix Geisendoerfer (http://www.debuggable.com/felix)
  // *     example 1: array_key_exists('kevin', {'kevin': 'van Zonneveld'});
  // *     returns 1: true
  // input sanitation
  if (!search || (search.constructor !== Array && search.constructor !== Object)) {
    return false;
  }

  return key in search;
};// Fork from https://github.com/kvz/phpjs
});