define(function(require, exports, module){
/**!module:math
 * Author : YJC
 * Date : 2013-04-21
 */
/**
 * 返回新的计数器函数
 * @param base 起始值，默认 0
 * @param inc 递增值，默认 1
 * @return {Function} 新的计数器函数
 */
exports.new_counter = function(base, inc) {
  if (isNaN(base)) base = 0;
  if (isNaN(inc)) inc = 1;
  base -= inc;
  return function(){
    return base += inc;
  };
};
});