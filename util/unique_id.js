define(function(require, exports, module){
/**!module:vars
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * 获取唯一ID
 */
exports.unique_id = (function(){
  var	i = 0;

  return function unique_id(fn, context){
    if (typeof fn === 'object') {
      context = fn;
      fn = 0;
    }

    var	id = fn ? fn(i++) : "ID-" + (i++);

    if ((context && context[id]) ||
      (typeof document === 'object' && document.getElementById(id)))
    {
      return unique_id();
    }

    return id;
  };
})();
});