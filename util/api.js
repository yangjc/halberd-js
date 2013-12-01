define(function(require, exports, module){
/**!module:network;client-side
 * Author : YJC
 * Date : 2013-06-06
 */

exports.api = (function(){
  var cache = {}, events = require('events'), _evt = events();

  return function(url, callback){
    if (typeof callback === 'function') {
      _evt.once(url, callback);
    }

    if (url in cache) {
      if (cache[url]) {
        _evt.emit(url, cache[url]);
      }
    } else {
      cache[url] = null;
      module.get_json(url + (url.indexOf('?') === -1 ? '?' : '&') + 'jsoncallback=?', function(re){
        cache[url] = re;
        _evt.emit(url, re);
      });
    }
  };
})();
});