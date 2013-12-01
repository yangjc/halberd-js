define(function(require, exports, module){
/**!module:dom;client-side
 * Author : YJC
 * Date : 2013-11-14
 */

exports.domcss = function(node, name){
  var css = document.defaultView ?
    document.defaultView.getComputedStyle(node, null) :
    node.currentStyle;

  if ( ! css) {
    return null;
  }

  if (name) {
    name = name.replace(/-(.)/g, function($0, $1){ return $1.toUpperCase() });
    return css[name]
  }

  return css;
};
});