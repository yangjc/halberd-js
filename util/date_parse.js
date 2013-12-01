define(function(require, exports, module){
/**!phpjs;module:datetime
 */
exports.date_parse = function date_parse (date) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: strtotime
  // *     example 1: date_parse('2006-12-12 10:00:00.5');
  // *     returns 1: {year : 2006, month: 12, day: 12, hour: 10, minute: 0, second: 0, fraction: 0.5, warning_count: 0, warnings: [], error_count: 0, errors: [], is_localtime: false}

  // BEGIN REDUNDANT
  module.php_js = module.php_js || {};
  // END REDUNDANT

  var warningsOffset = module.php_js.warnings ? module.php_js.warnings.length : null;
  var errorsOffset = module.php_js.errors ? module.php_js.errors.length : null;

  try {
    var ts = module.strtotime(date);
  } finally {
    if (!ts) {
      return false;
    }
  }

  var dt = new Date(ts * 1000);

  var retObj = { // Grab any new warnings or errors added (not implemented yet in strtotime()); throwing warnings, notices, or errors could also be easily monitored by using 'watch' on this.php_js.latestWarning, etc. and/or calling any defined error handlers
    warning_count: warningsOffset !== null ? module.php_js.warnings.slice(warningsOffset).length : 0,
    warnings: warningsOffset !== null ? module.php_js.warnings.slice(warningsOffset) : [],
    error_count: errorsOffset !== null ? module.php_js.errors.slice(errorsOffset).length : 0,
    errors: errorsOffset !== null ? module.php_js.errors.slice(errorsOffset) : []
  };
  retObj.year = dt.getFullYear();
  retObj.month = dt.getMonth() + 1;
  retObj.day = dt.getDate();
  retObj.hour = dt.getHours();
  retObj.minute = dt.getMinutes();
  retObj.second = dt.getSeconds();
  retObj.fraction = parseFloat('0.' + dt.getMilliseconds());
  retObj.is_localtime = dt.getTimezoneOffset !== 0;

  return retObj;
};// Fork from https://github.com/kvz/phpjs
});