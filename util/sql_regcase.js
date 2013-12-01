define(function(require, exports, module){
/**!phpjs;module:pcre
 */
exports.sql_regcase = function sql_regcase (str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1: sql_regcase('Foo - bar.');
  // *     returns 1: '[Ff][Oo][Oo] - [Bb][Aa][Rr].'
  module.setlocale('LC_ALL', 0);
  var i = 0,
    upper = '',
    lower = '',
    pos = 0,
    retStr = '';

  upper = module.php_js.locales[module.php_js.localeCategories.LC_CTYPE].LC_CTYPE.upper;
  lower = module.php_js.locales[module.php_js.localeCategories.LC_CTYPE].LC_CTYPE.lower;

  for (i = 0; i < str.length; i++) {
    if (((pos = upper.indexOf(str.charAt(i))) !== -1) || ((pos = lower.indexOf(str.charAt(i))) !== -1)) {
      retStr += '[' + upper.charAt(pos) + lower.charAt(pos) + ']';
    } else {
      retStr += str.charAt(i);
    }
  }
  return retStr;
};// Fork from https://github.com/kvz/phpjs
});