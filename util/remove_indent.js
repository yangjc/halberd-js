define(function(require, exports, module){
/**!module:function
 * Author : YJC
 * Date : 2013-04-26
 */
/**
 * 代码减少一级缩进
 * @param code
 * @returns {String}
 */
exports.remove_indent = function(code){
  var _tab = /(?:\n|\r\n?)([ \t]+).+$/.exec(this.trim(code));
  if (_tab) {
    return code.replace(new RegExp('^' + _tab[1], 'gm'), '');
  }
  return code;
};
});