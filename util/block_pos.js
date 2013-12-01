define(function(require, exports, module){
/**!module:function
 * Author : YJC
 * Date : 2013-05-08
 */
/**
 * 查找代码块的结束位置/检查指定位置是否在代码块内
 * @param code 源码
 * @param index 代码块开始位置/检查是否在代码块内的位置
 * @param tag_close 代码块结束字符串
 * @param tag_open 代码块开始字符串
 * @param check_in_block 从指定的位置开始检查 index 是否在代码块内
 * @returns {Number|Boolean} 代码块结束位置（查找失败时返回 false）/index 是否在代码块内
 */
exports.block_pos = function(code, index, tag_close, tag_open, check_in_block){
  tag_open = tag_open || code.charAt(index);
  var close_len = tag_close.length,
    open_len = tag_open.length,
    code_len = code.length - close_len,
    i_from, i_to, ch, ch2, start, end,
    count = 0, in_string = false, in_comment = false;
  
  if (typeof check_in_block === 'undefined') {
    i_from = index + open_len;
    i_to = code_len;
  } else {
    if (index < check_in_block) {
      return false;
    }
    if (index === check_in_block && code.substr(index, open_len) === tag_open) {
      return true;
    }
    i_from = check_in_block;
    i_to = index - 1;
    check_in_block = true;
  }

  for (var i = i_from; i <= i_to; i ++) {
    ch = code.charAt(i);

    // 忽略注释内
    if (in_comment) {
      switch(in_comment){
        case '/':
          if (ch === '\r' || ch === '\n') {
            in_comment = false;
          }
          break;
        case '*':
          if (ch === '*' && code.charAt(i + 1) === '/') {
            in_comment = false;
            i ++;
          }
      }
      continue;
    }
    if (ch === '/') {
      ch2 = code.charAt(i + 1);
      if (ch2 === '/' || ch2 === '*') {
        in_comment = ch2;
        i ++;
        continue;
      }
    }

    // 忽略字符串内
    if (in_string) {
      if (ch === in_string && code.charAt(i - 1) !== '\\') {
        in_string = false;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      in_string = ch;
      continue;
    }

    end = code.substr(i, close_len);
    if (end === tag_close) {
      if (count === 0 && ! check_in_block) {
        return i + close_len - 1;
      }
      count --;
      continue;
    }
    start = code.substr(i, open_len);
    if (start === tag_open) {
      count ++;
    }
  }

  if (check_in_block) {
    return count > 0 || (count === 0 && code.substr(index - close_len + 1, close_len) === tag_close);
  }

  return false;
};
});