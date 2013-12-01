define(function(require, exports, module){
/**!phpjs;module:strings
 */
exports.join = function join (glue, pieces) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // -    depends on: implode
  // *     example 1: join(' ', ['Kevin', 'van', 'Zonneveld']);
  // *     returns 1: 'Kevin van Zonneveld'
  return module.implode(glue, pieces);
};// Fork from https://github.com/kvz/phpjs
});