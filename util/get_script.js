define(function(require, exports, module){
/**!module:;client-side
 * Author : YJC
 * Date : 2013-11-12
 */

exports.get_script = function(src, callback, charset){
  var s = document.createElement('script'),
    h = document.getElementsByTagName('head')[0] || document.documentElement;

  s.onload = s.onerror = s.onreadystatechange = function(){
    if (s.readyState && s.readyState !== 'loaded' && s.readyState !== 'complete') return;
    s.onload = s.onerror = s.onreadystatechange = null;
    h.removeChild(s);
    s = h = null;
    typeof callback === 'function' && callback();
  };

  charset && (s.charset = charset);
  s.src = src;
  h.insertBefore(s, h.firstChild);
};
});