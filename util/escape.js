define(function(require, exports, module){
/**!module:string
 * 字符串转义
 * Author : YJC
 * Date : 13-4-17
 */
exports.escape = function(str, q_mark) {
  str = str.replace(/\\/g, '\\\\') // 反斜杠必须首先转义
    .replace(/\n/g, '\\n') // 换行
    .replace(/\r/g, '\\r') // 回车
    .replace(/\t/g, '\\t'); // 水平制表
  // .replace(/\v/g, '\\v') // 垂直制表
  // .replace(/\f/g, '\\f') // 换页符
  // .replace(/\b/g, '\\b') // 退格
  // .replace(/\u/g, '\\u') // unicode字符前缀
  // .replace(/\x/g, '\\x') // 十六进制前缀
  if (q_mark) {
    str = str.replace(new RegExp(q_mark, 'g'), '\\' + q_mark);
  } else {
    str = str.replace(/'/g, "\\'").replace(/"/g, '\\"');
    q_mark = '';
  }
  return q_mark + str + q_mark;
};
});