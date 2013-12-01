define(function(require, exports, module){
/**!module:function
 * Author : YJC
 * Date : 2013-04-26
 */
/**
 * 移除代码头尾的注释和空白
 */
exports.trim_comments = function(code){
  return code
    .replace(/^\s*((?:\/\*[\s\S]*?\*\/|\/\/.*)\s*)*/, '')
    .replace(/(\s*(?:\/\*([^*]|\*(?!\/))*\*\/|\/\/.*))*\s*$/, '');
};
});