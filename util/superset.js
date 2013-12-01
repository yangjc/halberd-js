define(function(require, exports, module){
/**!module:object
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * 多重继承
 * 传入参数全部为对象，返回继承所有传入的对象的新对象
 * @return {Object}
 */
exports.superset = function(){
  function F(){}
  for (var i = 0, l = arguments.length; i < l; i++) {
    for (var j in arguments[i]) {
      F.prototype[j] = arguments[i][j];
    }
  }
  return new F;
};
});