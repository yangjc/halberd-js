define(function(require, exports, module){
/**!phpjs;module:var
 */
exports.is_binary = function is_binary (vr) {
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: is_binary('This could be binary as far as JavaScript knows...');
  // *     returns 1: true
  return typeof vr === 'string'; // If it is a string of any kind, it could be binary
};// Fork from https://github.com/kvz/phpjs
});