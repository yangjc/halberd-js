define(function(require, exports, module){
/**!module:;-client-side
 * Author : YJC
 * Date : 2013-11-07
 */

exports.is_ip_addr = function(ip){
  return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
};
});