define(function(require, exports, module){
/**!module:url;client-side
 * Author : YJC
 * Date : 2013-04-21
 */

/**
 * 获取 url 的 get 参数
 */
exports.search = module.defer(function(){

  var search = module.str_to_object(window.location.search.substr(1),
    '&', '=', 'all', decodeURIComponent, decodeURIComponent);

  return function(key){
    if (typeof key === 'undefined') return search;
    return search[key];
  }
});
});