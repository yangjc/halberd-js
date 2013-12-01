define(function(require, exports, module){
/**!module:;client-side
 * Author : YJC
 * Date : 2013-11-10
 */

exports.page_base_url = module.defer(function(){

  var page_base = window.location.href,
    head = document.getElementsByTagName("head")[0],
    base_ele = head && head.getElementsByTagName("base")[0];

  if (base_ele && base_ele.href) {
    page_base = module.absolute_url(base_ele.href, page_base)
  }

  return function(){
    return page_base;
  }
});
});