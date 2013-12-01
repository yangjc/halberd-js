define(function(require, exports, module){
/**!module:time
 * 时间戳转换为字符串
 * Author : YJC
 * Date : 13-4-17
 */

exports.format_date = (function(){
  function add_zero(n) {
    return (n < 10 ? '0' : '') + n
  }

  var week = ['日','一','二','三','四','五','六'];

  var _f = {
    Y: function(t){ return t.getFullYear() },
    y: function(t){ return (t.getFullYear() + '').substr(2) },
    n: function(t){ return t.getMonth() + 1 },
    m: function(t){ return add_zero(t.getMonth() + 1) },
    j: function(t){ return t.getDate() },
    d: function(t){ return add_zero(t.getDate()) },
    G: function(t){ return t.getHours() },
    H: function(t){ return add_zero(t.getHours()) },
    i: function(t){ return add_zero(t.getMinutes()) },
    s: function(t){ return add_zero(t.getSeconds()) },
    N: function(t){ return t.getDay() || 7 },
    X: function(t){ return week[t.getDay()] }
  };

  return function(format, timestamp){
    var t = timestamp ? new Date(timestamp * 1000) : new Date, re = "", c;

    for (var i = 0, l = format.length; i < l; i++) {
      c = format[i];
      re += _f[c] ? _f[c](t) : c
    }

    return re;

  }
})();
});