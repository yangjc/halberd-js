define(function(require, exports, module){
/**!module:function
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * 替换函数上下文执行
 * @param fn 原函数
 * @param context 新上下文对象
 * @param args arguments对象
 * @param offset 偏移（舍弃arguments的前offset个值）
 * @return {Object}
 */
exports.fn_apply = function(fn, context, args, offset){
  var len = args.length - offset;
  len < 0 && (len = 0);

  switch (len) {
    // fast cases
    case 0:
      return fn.call(context);
    case 1:
      return fn.call(context, args[offset]);
    case 2:
      return fn.call(context, args[offset], args[offset + 1]);

    // slower
    default:
      var a = new Array(len);
      for (var i = 0; i < len; i++) {
        a[i] = args[i + offset];
      }
      return fn.apply(context, a);
  }
};
});