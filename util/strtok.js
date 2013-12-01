define(function(require, exports, module){
/**!phpjs;module:strings
 */
exports.strtok = function strtok (str, tokens) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Use tab and newline as tokenizing characters as well
  // *     example 1: $string = "\t\t\t\nThis is\tan example\nstring\n";
  // *     example 1: $tok = strtok($string, " \n\t");
  // *     example 1: $b = '';
  // *     example 1: while ($tok !== false) {$b += "Word="+$tok+"\n"; $tok = strtok(" \n\t");}
  // *     example 1: $b
  // *     returns 1: "Word=This\nWord=is\nWord=an\nWord=example\nWord=string\n"
  // BEGIN REDUNDANT
  module.php_js = module.php_js || {};
  // END REDUNDANT
  if (tokens === undefined) {
    tokens = str;
    str = module.php_js.strtokleftOver;
  }
  if (str.length === 0) {
    return false;
  }
  if (tokens.indexOf(str.charAt(0)) !== -1) {
    return module.strtok(str.substr(1), tokens);
  }
  for (var i = 0; i < str.length; i++) {
    if (tokens.indexOf(str.charAt(i)) !== -1) {
      break;
    }
  }
  module.php_js.strtokleftOver = str.substr(i + 1);
  return str.substring(0, i);
};// Fork from https://github.com/kvz/phpjs
});