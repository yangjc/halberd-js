define(function(require, exports, module){
/**!module:network;client-side
 * Author : YJC
 * Date : 2013-04-21
 */

exports.cookies = function(){
  return module.str_to_object(document.cookie, /\s*;\s*/, /\s*=\s*/, 'first');
};
});