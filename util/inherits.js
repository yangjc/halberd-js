define(function(require, exports, module){
/**!module:function
 * Author : YJC
 * Date : 2013-06-10
 */
/**
 * 继承
 * @param ctor {Function} 子类构造函数
 * @param superCtor {Function} 被继承的基类构造函数
 */
exports.inherits = function(ctor, superCtor){
  ctor.super_ = superCtor;
  ctor.prototype = new superCtor;
  ctor.prototype.constructor = ctor;
};
});