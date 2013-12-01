define(function(require, exports, module){
/**!module:object
 * Author : YJC
 * Date : 2013-04-21
 */

/**
 * 用一个对象/函数深度扩展另一个对象/函数
 * 此函数会改变传入的第一个参数object，如果希望object不被改变，则传入深度复制后的object
 * @param object 待扩展的对象/函数
 * @param source 根据这个对象/函数进行扩展
 * @param keep_own 保留原有的属性（包括原型链上的属性）不被覆盖
 * @param depth 扩展时使用深复制
 * @return {*} 扩展后的对象/函数
 */
exports.extend = function(object, source, keep_own, depth) {
  for (var i in source) {
    if (keep_own && object[i]) {
      continue;
    }
    object[i] = depth? module.clone(source[i]): source[i];
  }
  return object;
};
});