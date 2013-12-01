define(function(require, exports, module){
/**!module:object
 * Author : YJC
 * Date : 2013-09-02
 */
// print object in console
// function print(o,d){d=d||0;var x='';for(var i=0;i<d;i++)x+='  ';console.info(x+'{');for(i in o){if(typeof o[i]==='object'){console.log(x+i+' :');arguments.callee(o[i],d+1);}else console.log(x+i+' : '+o[i])};console.info(x+'}')}
exports.o_sort = (function(){
  var fns = {
    KEY_ASC: function(a, b){
      return a[0] == b[0] ? 0 : (a[0] > b[0] ? 1 : -1);
    },
    KEY_DESC: function(a, b){
      return a[0] == b[0] ? 0 : (a[0] > b[0] ? -1 : 1);
    },
    VALUE_ASC: function(a, b){
      return a[1] == b[1] ? 0 : (a[1] > b[1] ? 1 : -1);
    },
    VALUE_DESC: function(a, b){
      return a[1] == b[1] ? 0 : (a[1] > b[1] ? -1 : 1);
    }
  };

  return function sort(object, sort_fn, deep){
    var i, l, arr = [], re = {};
    for (i in object) {
      if (deep && typeof object[i] === 'object' && object[i]) {
        object[i] = sort(object[i], sort_fn, true)
      }
      arr.push([i, object[i]])
    }
    arr.sort(fns[sort_fn] || sort_fn || fns.KEY_ASC);
    for (i = 0, l = arr.length; i < l; i++) {
      re[arr[i][0]] = arr[i][1]
    }
    return re;
  }
})();
});