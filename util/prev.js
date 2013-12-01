define(function(require, exports, module){
/**!phpjs;module:array
 */
exports.prev = function prev (arr) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Uses global: php_js to store the array pointer
  // *     example 1: transport = ['foot', 'bike', 'car', 'plane'];
  // *     example 1: prev(transport);
  // *     returns 1: false
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
  var arrpos = pointers.indexOf(arr);
  var cursor = pointers[arrpos + 1];
  if (pointers.indexOf(arr) === -1 || cursor === 0) {
    return false;
  }
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0;
    for (var k in arr) {
      if (ct === cursor - 1) {
        pointers[arrpos + 1] -= 1;
        return arr[k];
      }
      ct++;
    }
    // Shouldn't reach here
  }
  if (arr.length === 0) {
    return false;
  }
  pointers[arrpos + 1] -= 1;
  return arr[pointers[arrpos + 1]];
};// Fork from https://github.com/kvz/phpjs
});