define(function(require, exports, module){
/**!module:network;client-side
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * COOKIE操作
 * @param {string} name 索引
 * @param {string} value 设置的值
 * @param {number} ttl 有效期，单位秒
 * @param {string} path 路径
 * @param {string} domain 域
 * @return {boolean|string} 获取的值
 */
exports.cookie = function(name, value, ttl, path, domain){
  // 获取cookie
  if (arguments.length === 1) {
    try {
      var  a = (new RegExp('\\b'+name+'=([^;]*);?', 'i')).exec(document.cookie.toString());
    } catch(e) {
      return false;
    }
    if (a instanceof Array && a.length > 1) return a[1];
    return '';
  }
  // 2个参数时，如果第二个参数是数字，则ttl为此值
  if (arguments.length === 2 && typeof value === 'number') {
    ttl = value;
    // 如果ttl为负值，说明需要删除cookie，则value值置为空；否则获取此cookie原始值
    value = ttl < 0? '': arguments.callee(name);
  }
  var  date = '';
  if ( ! isNaN(ttl)) {
    date = new Date();
    date.setTime(date.getTime() + ttl * 1000);
    date = ";expires=" + date.toGMTString();
  }
  document.cookie = name + "=" + value + (domain? ";domain=" + domain: '') + (path? ";path=" + path: '') + date;
  return true;
};
});