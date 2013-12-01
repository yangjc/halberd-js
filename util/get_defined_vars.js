define(function(require, exports, module){
/**!phpjs;module:var
 */
exports.get_defined_vars = function get_defined_vars () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Test case 1: If get_defined_vars can find itself in the defined vars, it worked :)
  // *     example 1: function test_in_array(array, p_val) {for(var i = 0, l = array.length; i < l; i++) {if(array[i] == p_val) return true;} return false;}
  // *     example 1: funcs = get_defined_vars();
  // *     example 1: found = test_in_array(funcs, 'get_defined_vars');
  // *     results 1: found == true
  var i = '',
    arr = [],
    already = {};

  for (i in module.window) {
    try {
      if (typeof module.window[i] === 'object') {
        for (var j in module.window[i]) {
          if (module.window[j] && !already[j]) {
            already[j] = 1;
            arr.push(j);
          }
        }
      } else if (!already[i]) {
        already[i] = 1;
        arr.push(i);
      }
    } catch (e) { // Problems accessing some properties in FF (e.g., sessionStorage)
      if (!already[i]) {
        already[i] = 1;
        arr.push(i);
      }
    }
  }

  return arr;
};// Fork from https://github.com/kvz/phpjs
});