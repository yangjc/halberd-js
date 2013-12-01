define(function(require, exports, module){
/**!module:network;client-side
 * Author : YJC
 * Date : 2013-04-21
 */

/**
 * 简单的ajax请求，不支持跨域，传参形式如下：
 * url[, callback]
 * url, data[, callback]
 * url, data, options[, callback]
 * @param url 目标地址
 * @param data 数据
 * @param options 选项
 * @param callback 回调
 */
exports.ajax = function(url, data, options, callback){
  if ( ! url) {
    return;
  }

  url = url.replace(/#.*/, ''); // 移除hash

  switch (arguments.length) {
    case 2:
      if (typeof data === 'function') {
        callback = data;
        options = {};
        data = '';
      }
      break;
    case 3:
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
  }

  data = data || '';
  options = options || {};

  var method = options.method || 'get';

  if (typeof data === 'object') {
    data = module.object_to_str(data, '&', '=', encodeURIComponent, encodeURIComponent);
  }

  data += (data ? '&' : '') + (new Date).getTime() + (Math.random() + '').substring(1, 12);

  if (method === 'get') {
    var i = url.indexOf('?');
    if (i === -1) url += '?' + data;
    else if (i === url.length - 1) url += data;
    else url += '&' + data;
  }

  try {
    var xmlhttp = window.XMLHttpRequest? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");

    if (typeof callback === 'function') {
      xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4) {
          callback(xmlhttp.status == 200 ? null : xmlhttp.status, xmlhttp.responseText);
        }
      };
    }

    xmlhttp.open(method, url, true);
    xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (method === 'post') {
      xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xmlhttp.send(data || null);
    } else {
      xmlhttp.send();
    }
  } catch(e) {}
};
});