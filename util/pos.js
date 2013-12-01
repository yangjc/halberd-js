define(function(require, exports, module){
/**!phpjs;module:array
 */
exports.pos = function pos (arr) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Uses global: php_js to store the array pointer
  // -    depends on: current
  // *     example 1: transport = ['foot', 'bike', 'car', 'plane'];
  // *     example 1: pos(transport);
  // *     returns 1: 'foot'
  return module.current(arr);
};// Fork from https://github.com/kvz/phpjs
});