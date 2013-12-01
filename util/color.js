define(function(require, exports, module){
/**!module:;-client-side
 * Author : YJC
 * Date : 2013-11-14
 */

exports.color = function(input){
  var i = 0, re, c;

  if (typeof input === 'string') {
    var x = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.exec(input);
    if (x) {
      // rgb(r, g, b)
      input = [ x[1], x[2], x[3] ];
    } else {
      // #AAA #AAAAAA AAA AAAAAA
      input = input.replace('#', '');
      var len = input.length, a = len > 3 ? 0 : 1, w = 2 - a;
      re = [];
      for (; i < len; i += w) {
        c = input.substr(i, w);
        re.push(parseInt(a ? c + c : c, 16))
      }

      return re;
    }
  }

  // [ r, g, b ]
  re = "";
  for (; i < 3; i ++) {
    c = Number(input[i]).toString(16);
    re += c.length === 1 ? '0' + c : c;
  }
  return '#' + re.toUpperCase();
};
});