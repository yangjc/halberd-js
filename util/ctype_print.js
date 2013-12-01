define(function(require, exports, module){
/**!phpjs;module:ctype
 */
exports.ctype_print = function ctype_print (text) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1: ctype_print('AbC!#12');
  // *     returns 1: true
  if (typeof text !== 'string') {
    return false;
  }
  // BEGIN REDUNDANT
  module.setlocale('LC_ALL', 0); // ensure setup of localization variables takes place
  // END REDUNDANT
  return text.search(module.php_js.locales[module.php_js.localeCategories.LC_CTYPE].LC_CTYPE.pr) !== -1;
};// Fork from https://github.com/kvz/phpjs
});