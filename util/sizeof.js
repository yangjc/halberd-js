define(function(require, exports, module){
/**!phpjs;module:array
 */
exports.sizeof = function sizeof (mixed_var, mode) {
  // http://kevin.vanzonneveld.net
  // +   original by: Philip Peterson
  // -    depends on: count
  // *     example 1: sizeof([[0,0],[0,-4]], 'COUNT_RECURSIVE');
  // *     returns 1: 6
  // *     example 2: sizeof({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE');
  // *     returns 2: 6
  return module.count(mixed_var, mode);
};// Fork from https://github.com/kvz/phpjs
});