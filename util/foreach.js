define(function(require, exports, module){
/**!module:array
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * 顺序遍历数组
 * @param arr 数组
 * @param fn 参数顺序：值，索引，数组自身
 *  fn返回值为false时，会中断循环
 *  fn返回值为数字时，索引和长度同时偏移相同长度
 */
exports.foreach = function(arr, fn){
  for (var i = 0, len = arr.length, re; i < len; i++) {
    re = fn(arr[i], i, arr);
    if (re === false) break;
    else if (typeof re === 'number') {
      i += re;
      len += re;
    }
  }
};
});