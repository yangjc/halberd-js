define(function(require, exports, module){
/**!module:format
 * 输出变量的字符串表示
 * Author : YJC
 * Date : 13-4-17
 */

exports.var_export = (function(){
  var escape = module.escape,
    repeat = module.str_repeat,
    is_var_name = module.is_var_name,
    classof = module.classof;

  /**
   * 输出一个变量的字符串表示
   * @param v 任意变量
   * @param options 选项
   *  br 换行符
   *  blank 空白符
   *  tabstop 水平制表符长度
   *  deep 是否遍历原型链
   *  depth 递归的层次（未实现）
   *  json 输出为合法的json格式字符串
   *  fn 额外的处理函数
   * @return {String}
   */
  function var_export(v, options) {
    if (v === null) return 'null';
    if (typeof options !== 'object') options = {};
    if (typeof options.fn === 'function') {
      v = options.fn(v);
    }
    switch (typeof v) {
      case 'string':
        return escape(v, '"');
      case 'function':
        return fn_export(v, options);
      case 'object':
        return o_export(v, options);
      case 'undefined':
        return 'this.undefined';
    }
    return '' + v;
  }
  function fn_export(fn, options, tab) {
    fn = fn.toString()
      .replace(/^\s+/, '').replace(/\s+$/, '')
      .replace(
        /^\s*function\s+([^\s\(]+)[^{]+{\s*\[\s*native\s+code\s*\]\s*}[^}]*$/i,
        'function(){ /*$1:[native code]*/ }'
      );
    if (typeof options.fn === 'function') {
      fn = options.fn(fn);
    }
    if (options.blank) {
      fn = fn.replace(/^[ \t]+/gm, function($0){
        var str = '', l = $0.length, i = 0, c,
          b = options.blank, tabstop = options.tabstop || 2;
        for (; i < l; i++) {
          c = $0.charAt(i);
          str += c === ' ' ? b : repeat(b, tabstop);
        }
        return str;
      });
    }
    if (tab) {
      fn = fn.replace(/^(.)/gm, tab + '$1').substr(tab.length);
    }
    if (options.br) {
      fn = fn.replace(/\r?\n/g, options.br);
    }
    return fn;
  }
  function sub_export(v, options, next, tab) {
    switch (typeof v) {
      case 'function':
        if (options.json) return null;
        return fn_export(v, options, tab);
      case 'object':
        if (v) return o_export(v, options, next);
    }
    return var_export(v, options);
  }
  function o_export(o, options, level){
    switch(classof(o)) {
      case 'Date':
        return escape(o + '', '"');
      case 'RegExp':
        return escape('/' + o.source + '/' +
          (o.ignoreCase ? 'i' : '') + (o.global ? 'g' : '') + (o.multiline ? 'm' : ''), '"');
    }

    level = level || 1;
    var i, name, item, tab_end = '', m0 = '{', m1 = '}', separator = ':',
      items = [], tab = '', br = '', next = level + 1,
      fn = typeof options.fn === 'function' ? options.fn : 0;

    if ( ! options.json) {
      if (options.blank) {
        separator = options.blank + ':' + options.blank;
        if (level) {
          tab = repeat(options.blank, options.tabstop || 2);
          var tab_length = tab.length;
          tab = repeat(tab, level);
          tab_end = tab.substr(tab_length);
        }
      }
      if (options.br) {
        br = options.br;
      }
    }

    if (o instanceof Array) {
      m0 = '[';
      m1 = ']';

      var l = o.length;
      for (i = 0; i < l; i++) {
        item = sub_export(o[i], options, next, tab);
        if (item === null) continue;

        items.push(tab + item);
      }
    } else {
      for (i in o) {
        if ( ! options.deep && ! o.hasOwnProperty(i)) continue;

        item = sub_export(o[i], options, next, tab);
        if (item === null) continue;

        if (fn) i = fn(i);
        if (options.json || ! is_var_name(i)) {
          name = escape(i, '"');
        } else {
          name = i;
        }
        items.push(tab + name + separator + item);
      }
    }

    return m0 + (items.length ? br + items.join(',' + br) + br + tab_end : '') + m1;
  }

  return var_export;
})();
});