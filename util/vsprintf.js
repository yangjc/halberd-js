define(function(require, exports, module){
/**!phpjs;module:strings
 */
exports.vsprintf = function vsprintf (format, args) {
  // http://kevin.vanzonneveld.net
  // +   original by: ejsanders
  // -    depends on: sprintf
  // *     example 1: vsprintf('%04d-%02d-%02d', [1988, 8, 1]);
  // *     returns 1: '1988-08-01'
  return module.sprintf.apply(module, [format].concat(args));
};// Fork from https://github.com/kvz/phpjs
});