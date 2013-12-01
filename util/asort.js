define(function(require, exports, module){
/**!phpjs;module:array
 */
exports.asort = function asort (inputArr, sort_flags) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   input by: paulo kuong
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Adam Wallner (http://web2.bitbaro.hu/)
  // +   improved by: Theriault
  // %        note 1: SORT_STRING (as well as natsort and natcasesort) might also be
  // %        note 1: integrated into all of these functions by adapting the code at
  // %        note 1: http://sourcefrog.net/projects/natsort/natcompare.js
  // %        note 2: The examples are correct, this is a new way
  // %        note 2: Credits to: http://javascript.internet.com/math-related/bubble-sort.html
  // %        note 3: This function deviates from PHP in returning a copy of the array instead
  // %        note 3: of acting by reference and returning true; this was necessary because
  // %        note 3: IE does not allow deleting and re-adding of properties without caching
  // %        note 3: of property position; you can set the ini of "phpjs.strictForIn" to true to
  // %        note 3: get the PHP behavior, but use this only if you are in an environment
  // %        note 3: such as Firefox extensions where for-in iteration order is fixed and true
  // %        note 3: property deletion is supported. Note that we intend to implement the PHP
  // %        note 3: behavior by default if IE ever does allow it; only gives shallow copy since
  // %        note 3: is by reference in PHP anyways
  // %        note 4: Since JS objects' keys are always strings, and (the
  // %        note 4: default) SORT_REGULAR flag distinguishes by key type,
  // %        note 4: if the content is a numeric string, we treat the
  // %        note 4: "original type" as numeric.
  // -    depends on: strnatcmp
  // -    depends on: i18n_loc_get_default
  // *     example 1: data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'};
  // *     example 1: data = asort(data);
  // *     results 1: data == {c: 'apple', b: 'banana', d: 'lemon', a: 'orange'}
  // *     returns 1: true
  // *     example 2: ini_set('phpjs.strictForIn', true);
  // *     example 2: data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'};
  // *     example 2: asort(data);
  // *     results 2: data == {c: 'apple', b: 'banana', d: 'lemon', a: 'orange'}
  // *     returns 2: true
  var valArr = [], valArrLen = 0,
    k, i, ret, sorter, that = module,
    strictForIn = false,
    populateArr = {};

  switch (sort_flags) {
  case 'SORT_STRING':
    // compare items as strings
    sorter = function (a, b) {
      return module.strnatcmp(a, b);
    };
    break;
  case 'SORT_LOCALE_STRING':
    // compare items as strings, based on the current locale (set with i18n_loc_set_default() as of PHP6)
    var loc = module.i18n_loc_get_default();
    sorter = module.php_js.i18nLocales[loc].sorting;
    break;
  case 'SORT_NUMERIC':
    // compare items numerically
    sorter = function (a, b) {
      return (a - b);
    };
    break;
  case 'SORT_REGULAR':
    // compare items normally (don't change types)
  default:
    sorter = function (a, b) {
      var aFloat = parseFloat(a),
        bFloat = parseFloat(b),
        aNumeric = aFloat + '' === a,
        bNumeric = bFloat + '' === b;
      if (aNumeric && bNumeric) {
        return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
      } else if (aNumeric && !bNumeric) {
        return 1;
      } else if (!aNumeric && bNumeric) {
        return -1;
      }
      return a > b ? 1 : a < b ? -1 : 0;
    };
    break;
  }

  // BEGIN REDUNDANT
  module.php_js = module.php_js || {};
  module.php_js.ini = module.php_js.ini || {};
  // END REDUNDANT
  strictForIn = module.php_js.ini['phpjs.strictForIn'] && module.php_js.ini['phpjs.strictForIn'].local_value && module.php_js.ini['phpjs.strictForIn'].local_value !== 'off';
  populateArr = strictForIn ? inputArr : populateArr;

  // Get key and value arrays
  for (k in inputArr) {
    if (inputArr.hasOwnProperty(k)) {
      valArr.push([k, inputArr[k]]);
      if (strictForIn) {
        delete inputArr[k];
      }
    }
  }

  valArr.sort(function (a, b) {
    return sorter(a[1], b[1]);
  });

  // Repopulate the old array
  for (i = 0, valArrLen = valArr.length; i < valArrLen; i++) {
    populateArr[valArr[i][0]] = valArr[i][1];
  }

  return strictForIn || populateArr;
};// Fork from https://github.com/kvz/phpjs
});