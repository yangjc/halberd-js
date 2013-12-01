define(function(require, exports, module){
/**!module:function;factory;
 * Author : YJC
 * Date : 2013-07-26
 */
/**
 * 传入一个工厂函数，该工厂函数的返回值为提供给外部调用的函数
 * 该工厂函数的执行时机延迟至第一次外部调用，执行结果（函数）会被缓存
 * 第二次及其后的外部调用，都会直接调用缓存的函数
 * @param {Function} factory 工厂函数
 * @returns {Function} 提供给外部调用的函数
 */
exports.defer = function(factory){
  var first = true;
  return function(){
    if (first) {
      factory = factory();
      first = false;
    }
    return factory.apply(this, arguments);
  };
};
});