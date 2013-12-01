define(function(require, exports, module){
/**!phpjs;module:array
 */
exports.current = function current (arr) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Uses global: php_js to store the array pointer
  // *     example 1: transport = ['foot', 'bike', 'car', 'plane'];
  // *     example 1: current(transport);
  // *     returns 1: 'foot'
  // BEGIN REDUNDANT
  module.php_js = module.php_js || {};
  module.php_js.pointers = module.php_js.pointers || [];
  var indexOf = function (value) {
    for (var i = 0, length = module.length; i < length; i++) {
      if (module[i] === value) {
        return i;
      }
    }
    return -1;
  };
  // END REDUNDANT
  var pointers = module.php_js.pointers;
  if (!pointers.indexOf) {
    pointers.indexOf = indexOf;
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0);
  }
  var arrpos = pointers.indexOf(arr);
  var cursor = pointers[arrpos + 1];
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    return arr[cursor] || false;
  }
  var ct = 0;
  for (var k in arr) {
    if (ct === cursor) {
      return arr[k];
    }
    ct++;
  }
  return false; // Empty
};// Fork from https://github.com/kvz/phpjs
});