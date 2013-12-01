define(function(require, exports, module){
/**!module:network;client-side
 * JSONP 方式加载数据并执行回调
 * Author : YJC
 * Date : 2013-09-03
 */
exports.get_json = (function(){
  var head, undefined, reg_param;

  /**
   * 参数中第一个 {param_name}=? 的问号部分会被替换为回调函数名
   * @param url
   * @param callback
   */
  return function(url, callback){
    if ( ! url || typeof callback !== 'function') return;

    if ( ! head) {
      head = document.getElementsByTagName('head')[0] || document.documentElement;
      reg_param = /(\?.+?=)\?(&|$)/;
    }

    var name = '_hjs_jsonp_' + parseInt(Math.random() * 1000000) + '_' + (new Date).getTime(),
      script = document.createElement('script');

    window[name] = function(){
      callback.apply(this, arguments);
      window[name] = undefined;
      head.removeChild(script);
      script = null;
      try { delete window[name]; } catch(e) {} // IE 下不能 delete window 的属性
    };

    script.src = url.replace(reg_param, '$1' + name + '$2');
    head.insertBefore(script, head.firstChild);
  }
})();
});