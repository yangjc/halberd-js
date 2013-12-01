define(function(require, exports, module){
/**!phpjs;module:datetime
 */
exports.date_default_timezone_get = function date_default_timezone_get () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: timezone_abbreviations_list
  // %        note 1: Uses global: php_js to store the default timezone
  // *     example 1: date_default_timezone_get();
  // *     returns 1: 'unknown'
  var tal = {},
    abbr = '',
    i = 0,
    curr_offset = -(new Date()).getTimezoneOffset() * 60;

  if (module.php_js) {
    if (module.php_js.default_timezone) { // set by date_default_timezone_set
      return module.php_js.default_timezone;
    }
    if (module.php_js.ENV && module.php_js.ENV.TZ) { // getenv
      return module.php_js.ENV.TZ;
    }
    if (module.php_js.ini && module.php_js.ini['date.timezone']) { // e.g., if set by ini_set()
      return module.php_js.ini['date.timezone'].local_value ? module.php_js.ini['date.timezone'].local_value : module.php_js.ini['date.timezone'].global_value;
    }
  }
  // Get from system
  tal = module.timezone_abbreviations_list();
  for (abbr in tal) {
    for (i = 0; i < tal[abbr].length; i++) {
      if (tal[abbr][i].offset === curr_offset) {
        return tal[abbr][i].timezone_id;
      }
    }
  }
  return 'UTC';
};// Fork from https://github.com/kvz/phpjs
});