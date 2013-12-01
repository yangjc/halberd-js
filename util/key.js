define(function(require, exports, module){
/**!phpjs;module:array
 */
exports.key = function key (arr) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   input by: Riddler (http://www.frontierwebdev.com/)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Uses global: php_js to store the array pointer
  // *     example 1: array = {fruit1: 'apple', 'fruit2': 'orange'}
  // *     example 1: key(array);
  // *     returns 1: 'fruit1'
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
  var cursor = pointers[pointers.indexOf(arr) + 1];
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0;
    for (var k in arr) {
      if (ct === cursor) {
        return k;
      }
      ct++;
    }
    return false; // Empty
  }
  if (arr.length === 0) {
    return false;
  }
  return cursor;
};// Fork from https://github.com/kvz/phpjs
});