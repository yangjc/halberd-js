define(function(require, exports, module){
/**!module:string
 * 字符串填充
 * Author : YJC
 * Date : 13-4-15
 */
exports.str = function(tmpl){
  if ( ! tmpl || typeof tmpl !== 'string') return '';
  if (tmpl.indexOf('%s') === -1) return tmpl;
  var i = tmpl.indexOf('%%'), args = arguments, j = 1, l = args.length;
  if (i === -1) {
    return tmpl.replace(/%s/g, function(){
      return (j < l) ? args[j++] : '';
    });
  }
  tmpl = tmpl.split('%%');
  var k = tmpl.length;
  for (i = 0; i < k; i ++) {
    tmpl[i] = tmpl[i].replace(/%s/g, function(){
      return (j < l) ? args[j++] : '';
    });
  }
  return tmpl.join('%');
};
});