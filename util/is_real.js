define(function(require, exports, module){
/**!phpjs;module:var
 */
exports.is_real = function is_real (mixed_var) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  //  -   depends on: is_float
  // %        note 1: 1.0 is simplified to 1 before it can be accessed by the function, this makes
  // %        note 1: it different from the PHP implementation. We can't fix this unfortunately.
  // *     example 1: is_double(186.31);
  // *     returns 1: true
  return module.is_float(mixed_var);
};// Fork from https://github.com/kvz/phpjs
});