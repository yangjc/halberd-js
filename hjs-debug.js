/*
 * Halberd-JS Loader for Client-Side JavaScript v2.3.5
 * A Javascript Module Loader which is compatible with AMD and CMD Specification
 * YJC <yangjiecong@4399.com> | MIT license | 2013-09
 */

/** 引用方式

 *1* 通过 data- 属性指定参数

 * data-main {String} 一个模块标识
 * data-deps {String} 可选，一个模块标识 或 空格分隔的多个模块标识
 * data-config {String} 可选，一个模块标识

<script id="halberd-js" type="text/javascript" src="hjs.js"
  data-main="" [data-deps=""] [data-config=""]></script>

 *2* 调用 main 函数

 * main {String|Function} 主体模块，传入 一个模块标识
 *  或 形如 function(require, exports, module){ } 的匿名模块
 * deps {String|Array} 依赖关系（可选），传入 一个模块标识、空格分隔的多个模块标识 或 模块标识数组
 * config {String|Object} 配置（可选），传入 一个模块标识 或 配置值的对象

 * hjs.main("main-id", "", {}) 等价于 hjs.main("main-id", {})
 * 注意如果 config 传入模块标识，则不能放在第二个参数的位置，因为此时与 deps 无法区分

<script id="halberd-js" type="text/javascript" src="hjs.js"></script>
<script type="text/javascript">
hjs.main(main [, deps] [, config]);
</script>

 **/

(function(W, D, undefined){
  // 避免重复载入
  if (typeof W.define === 'function' && W.define.hjs) {
    return;
  }

  /*
   * 判断浏览器可使用哪种 script 回调事件
   */
  var script = D.createElement('script'), i,
  // script 优先使用 onload 事件执行回调
  // Firefox 早期版本中，动态创建 script 的初始对象不包含 onload 属性，但 onload 事件可用
  // 64位系统的 IE9 onload 的执行顺序无法保证，对于 IE 系浏览器，仅 IE10+ 使用 onload
    script_use_onload = !('onreadystatechange' in script) ||
      (('onload' in script) && ( ! D.documentMode || D.documentMode >= 10));

  /*
   * 获取引入 halberd-js 核心文件的 script 节点
   * 约定：id="halberd-js" 仅用于此节点
   */
  script = D.getElementById("halberd-js"); // 优先通过 id 获取
  if ( ! script) {
    // 通常，如果通过阻塞方式载入 js，则当前执行的 js 由页面上最后一个 script 节点引入
    // 但部分浏览器插件会改变这个特征（如安装了 evernote 插件的 IE6），因此向前遍历 script 节点
    var scripts = D.getElementsByTagName('script');
    for (i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].getAttribute('data-main')) {
        script = scripts[i];
        break;
      }
    }
    scripts = null;
  }

  /**
   * 获取 core script / 读取（设置） core script 某个 data 属性的值
   * @param name data-属性名
   * @param value data-属性值
   */
  function core_script(name, value){
    return script &&
      (name === undefined ? script :
        (value === undefined ?
          script.getAttribute('data-' + name) :
          script.setAttribute('data-' + name, value)))
  }

  // 为扩展功能预留的事件实例
  var events;

  // todo:触发事件的函数
  /**
   * 触发事件
   */
//  function events_emit(){
//    return events && events.emit.apply(this, arguments)
//  }

  /*
   * 模块内部 module 对象类
   */
  function Module_object(id, uri){
    this.id = id;
    this.uri = uri;
    this.exports = {};
  }

  /*
   * 工具函数
   */
  var util = Module_object.prototype = {},
    module_object = new Module_object(1, 1);

  util._util = util;

  // util function - trim
  var reg_trim_l = /^[\s\0]+/, reg_trim_r = /[\s\0]+$/;

  /**
   * 去除字符串头尾空字符
   * 当变量类型未知，使用这个函数可避免出错
   * @param str
   * @return {String}
   */
  var trim = util.trim = function(str){
    return typeof str == 'string' ?
      str.replace(reg_trim_l, '').replace(reg_trim_r, '') :
      (typeof str == 'number' ? '' + str : '')
  };

  // util function - is_array
  var is_array = util.is_array =
  function(v){
    return typeof v === 'object' &&
      Object.prototype.toString.call(v) === '[object Array]';
  };

  // util function - absolute_url
  var reg_root = /^[a-zA-Z]+:\/\/\/?[^/]+/, // 匹配根域名，结尾不含 /
    reg_r_sep = /\/+/g, // 冗余的连续 /
    reg_r_begin = /^(?:\/\.\.?\/)+/, // 冗余的开头 /../ 或 /./
    reg_path_end = /\/\.\.?$/, // 匹配 /.. 或 /. 结尾，此时需补全结尾的 /
    reg_file_end = /[^/]*[?#].*$|[^/]+$/, // 匹配基准路径的文件名部分
    reg_path_current = /\/(?:\.\/)+/g, // 当前路径 /./
    reg_path_upper = /\/[^/]+\/\.\.\//; // 上级路径 /../path/

  /**
   * 获取url的绝对路径
   * @param url 目标路径
   * @param base 基准路径
   * @return {String} 目标绝对路径
   */
  var absolute_url = util.absolute_url = function(url, base){
    var root = reg_root.exec(url);
    if (root) {
      root = root[0];
      url = url.substr(root.length);
      if (url.charAt(0) !== '/') {
        url = '/' + url;
      }
    } else {
      root = reg_root.exec(base)[0];
      if (url.charAt(0) !== '/') {
        url = '/' + base.substr(root.length).replace(reg_file_end, '') + url;
      }
    }
    if (reg_path_end.test(url)) {
      url += '/';
    }

    url = url.replace(reg_r_sep, '/')
      .replace(reg_path_current, '/');

    while (reg_path_upper.test(url)) {
      url = url.replace(reg_path_upper, '/');
    }

    return root + url.replace(reg_r_begin, '/');
  };

  // util function - parse_deps
  var reg_r = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*(?:require|module)|(?:^|[^$])\b(?:require\s*\(\s*(["'])(.+?)\1\s*\)|module\s*\.\s*([a-zA-Z_]+\w*))/g;
  var reg_s = /\\\\/g;

  // 从模块源码分析依赖关系
  // require("id"); module.fn_name;
  var parse_deps = util.parse_deps = function(code) {
    var ret = [];

    code.replace(reg_s, "")
      .replace(reg_r, function(m, m1, m2, m3) {
        // 排除默认属性
        m3 && ! module_object[m3] && (m2 = 'util/' + m3);

        m2 && ret.push(m2)
      });

    return ret
  };


  // 追加新的 util 函数
  // module.fn_name
  function new_util(key, fn) {
    // 不允许第二次赋值
    util[key] || (util[key] = fn);

    return new_util;
  }

  /**
   * 顺序遍历数组
   * @param {Array} arr
   * @param {Function} fn
   */
  function foreach(arr, fn){
    for (var i = 0, len = arr.length; i < len; i++) {
      fn(arr[i], i, arr);
    }
  }

  // @https://github.com/seajs/seajs
  // For IE6-9 browsers, the script onload event may not fire right
  // after the script is evaluated. Kris Zyp found that it
  // could query the script nodes and the one that is in "interactive"
  // mode indicates the current script
  // ref: http://goo.gl/JHfFW
  var current_script, interactive_script;

  /**
   * IE下，异步加载的js文件执行时，获取引入当前js文件的script节点
   */
  function get_interactive_script() {
    if (current_script) {
      return current_script;
    }
    if (interactive_script && interactive_script.readyState === 'interactive') {
      return interactive_script;
    }

    var script, scripts = D.getElementsByTagName('script');

    for (var i = scripts.length - 1; i >= 0; i--) {
      script = scripts[i];
      if (script.readyState === 'interactive') {
        interactive_script = script;
        return interactive_script;
      }
    }
  }

  /*
   * 模块加载逻辑
   */
  var init_time = (new Date).getTime(), // 用于版本号的时间戳
    fid_attr = 'data-halberdjsid', // 在 script 节点记录文件 id 的属性名

    config_paths = {}, // 模块路径集合
    config_alias = {}, // 模块标识映射
    core_config = { // 默认配置
      charset: 'utf-8', // 默认字符集
      version_mark: 'hjs', // 版本号参数名
      debug: -1 // 是否开启调试模式 0:线上环境 1:预发布环境 2:开发环境 -1:准线上环境
    },

    // head 节点
    head = D.getElementsByTagName("head")[0] || D.documentElement,
    // base 节点
    base_ele = head.getElementsByTagName("base")[0],

    file_meta = {}, // js 文件元数据缓存
    module_meta = {}, // 模块文件元数据缓存
    loading_meta; // 正在加载的元数据缓存

  /*
   * js 文件类
   */
  function File(src, version, charset, util_key){
    var _this = this;

    _this._src = src;
    _this._version = version;
    _this._charset = charset || core_config.charset;

    (_this._util_key = util_key) && util[util_key] &&
      (_this._ready = 1);

    // 加载阶段：0 未加载 1 开始加载依赖文件 2 开始加载自身 3 加载模块依赖
    _this._loading = 0;

    //_this._ready: 标记是否js文件是否可用（所有依赖都已载入）
    //_this._callback: {Array} 加载后执行的回调函数集合
    //_this._exports: 第一个模块的 exports | 多个模块的 exports 集合
    //_this._modules: {Array} define 定义的模块id
  }

  File.prototype = {
    // 开始加载 js 文件
    get_script: function() {
      var script = D.createElement('script'), _this = this;
      script.setAttribute(fid_attr, _this._src);

      script.onload = script.onerror = script.onreadystatechange = function(){
        if (script.readyState && script.readyState !== 'loaded' && script.readyState !== 'complete') {
          return;
        }
        script.onload = script.onerror = script.onreadystatechange = null;
        head.removeChild(script);
        script = null;
        _this.script_onload();
      };
      script.charset = _this._charset;
      script.async = true;

      // debug=2 无视所有版本号设置，全部文件刷新浏览器缓存，通过模块源码分析依赖关系
      // debug=1 有设置版本号的按版本号加载，无版本号设置则刷新浏览器文件缓存，通过模块源码分析依赖关系
      // debug=0 全部按版本号加载，无版本号设置的不加版本号，不通过模块源码分析依赖关系
      // debug=-1 版本号处理同 debug=0，通过模块源码分析依赖关系
      var version = core_config.debug > 1 ? init_time : _this._version || (core_config.debug > 0 ? init_time : '');
      script.src = _this._src +
        (version ? (_this._src.indexOf('?') === -1 ? '?' : '&') + core_config.version_mark + '=' + version : '');

      current_script = script;

      // @http://github.com/jrburke/requirejs
      //If BASE tag is in play, using appendChild is a problem for IE6.
      //When that browser dies, this can be removed. Details in this jQuery bug:
      //http://dev.jquery.com/ticket/2709
      base_ele ? head.insertBefore(script, base_ele) : head.appendChild(script);

      current_script = null;
    },
    // js 文件载入后执行
    script_onload: function(){
      var _this = this;

      // todo:触发一些内部事件
      // 如需检查js是否正常载入，可绑定此事件；返回值为真时，视为未正常载入，loading 状态保持
//      if (events_emit('__onrequesterror__', _this._src)) {
//        return;
//      }

      if (loading_meta) {
        foreach(loading_meta, function(meta){
          hjs_module.set_module(meta[0], _this._src, meta[1], meta[2])
        });
        loading_meta = undefined;
      }
      if (_this._define_deps) {
        _this._deps = _this._define_deps;
        delete _this._define_deps;

        _this._loading = 3;
        _this.file_loading();

      } else {
        _this.file_ready();
      }
    },
    // 加载 js 文件 / 执行回调
    load: function(callback){
      var _this = this;

      if (_this._ready) {
        callback();
      } else {
        _this._callback ?
          _this._callback.push(callback) :
          _this._callback = [ callback ];

        if ( ! _this._loading) {
          _this._loading = 1;
          _this.file_loading()
        }
      }
    },
    // js 文件加载中
    file_loading: function(){
      var _this = this;
      if (_this._loading) {

        if (_this._deps) {
          var not_ready = 0;

          foreach(_this._deps, function(file){
            if ( ! file._ready) {
              not_ready = 1;

              file.load(function(){
                _this.file_loading()
              })

            }
          });

          if (not_ready) {
            return;
          }
        }

        if (_this._loading > 2) {
          _this.file_ready();
        } else {
          _this._loading = 2;
          _this.get_script();
        }
      }
    },
    // 返回 js 文件的对外接口
    file_exports: function(){
      var _this = this;

      if (_this.hasOwnProperty('_exports')) {
        return _this._exports;
      }

      if (_this._modules) {
        if (_this._modules.length === 1) {
          _this._exports = _this._modules[0].module_exports()
        } else {
          var e = {};
          foreach(_this._modules, function(each_module){
            e[each_module._define_id] = each_module.module_exports()
          });
          _this._exports = e;
        }
        return _this._exports;
      } else {
        _this._exports = undefined;
      }
    },
    // js 文件就绪（所有依赖的文件和模块都已载入）时执行
    file_ready: function(){
      var _this = this;
      _this._ready = 1;
      _this._loading = 0;
      delete _this._deps;

      // util 函数
      _this._util_key &&
        new_util(_this._util_key, _this.file_exports()[_this._util_key]);

      if (_this._callback) {
        foreach(_this._callback, function(fn, i){
          fn();
          _this._callback[i] = undefined;
        });
        delete _this._callback;
      }
    }
  };

  /**
   * 封装模块
   * define() (factory) (id, factory) (deps, factory) (id, deps, factory)
   * @param {String} id
   * @param {String|Array} deps
   * @param {Function|*} factory
   */
  function define(id, deps, factory){
    switch (arguments.length) {
      case 3:
        break;
      case 2:
        factory = deps;
        if (is_array(id)) {
          deps = id;
          id = undefined;
        } else {
          deps = undefined;
        }
        break;
      case 1:
        factory = id;
        id = deps = undefined;
        break;
      case 0:
        // 一个文件包含多个模块的情况下，应先调用 define() （不传入参数）重置 loading_meta 以保证其未被污染
        // 示例： define() (id0, deps0, fn0) (id1, deps1, fn1)
        // 约定： 一个文件里，如果包含多个模块，则每一个模块都必须显式定义 id ；如果包含匿名模块，则此文件里不能包含其他模块
        loading_meta = undefined;
        return define;
    }

    !deps && core_config.debug && typeof factory === 'function' &&
      (deps = parse_deps(factory.toString()));

    if (script_use_onload) {
      (loading_meta || (loading_meta = [])).push([id, deps, factory])
    } else {
      var script = get_interactive_script();
      script &&
        hjs_module.set_module(id, script.getAttribute(fid_attr), deps, factory)
    }

    return define;
  }

  /*
   * 模块类
   */
  function Module(id, factory, define_id){
    this._id = id;
    this._define_id = define_id;
    this._factory = factory;
  }

  // 当前页面基准路径
  // 优先取 BASE 节点指定的路径
  var page_base = W.location.href;
  base_ele && base_ele.href && (page_base = absolute_url(base_ele.href, page_base));
  
  // 顶级标识基准路径
  // 取加载器所在目录 或 当前页面基准目录
  var top_base = (
      script && script.src ?
        absolute_url(script.src, page_base) :
        page_base
    ).replace(/[^/]+$/, '');

  // 返回模块标识别名
  function alias_id(id){
    return config_alias[ id ] || id;
  }

  var reg_q_end = /\?$/; // 忽略模块标识末尾的问号

  Module.prototype = {
    // 由模块标识获取绝对路径
    get_id: function(id){
      var last = (id = trim(id).replace(reg_q_end, '')).length - 1,
        i = id.indexOf('#'), c = id.charAt(last);

      i > 0 ?
        // 含 # 则去掉 # 及其后的字符串，且不添加 .js 后缀
        id = id.substring(0, i) :
        // 不以 .js 结尾且不含 ? 之后的参数，则自动补全 .js 后缀
        c !== '/' && id.substring(last - 2) !== '.js' && id.indexOf('?') < 0 && (id += '.js');

      // 绝对路径
      if (id.indexOf('://') > 0) {
        return alias_id(id);
      }
      
      id = alias_id(id);

      c = id.charAt(0);
      // 相对路径
      if (c === '.' || c === '?' || c === '') {
        return alias_id(absolute_url(id, this._id));
      }

      // 顶级标识
      if (c === '/') {
        return alias_id(absolute_url(top_base + id));
      }

      var base;

      (i = id.indexOf('/')) > -1 && // 尝试与项目路径拼接
        (base = config_paths[ id.substring(0, i) ]) &&
          (id = id.substring(i + 1)); // 存在项目路径配置时替换第一段路径

      return alias_id((base || config_paths[0] || top_base) + id);
    },
    // 获取依赖的 js 文件对象
    get_deps: function(deps){
      var l, f;
      if (is_array(deps) && (l = deps.length)) {
        for (var i = 0, _d = []; i < l; i++) {
          f = this.get_file(deps[i]);
          // 避免自己依赖自己
          f._src !== this._id && _d.push(f);
        }
        return _d
      }
    },
    // 获取 js 文件缓存
    get_file: function(id, version, deps, charset){
      if (typeof id === 'object' && id) {
        version = id.version;
        charset = id.charset;
        deps = id.deps;
        id = id.id;
      }

      var src = this.get_id(id), meta;

      // 模块标识以 ? 结尾则刷新浏览器文件缓存
      reg_q_end.test(id) && (version = init_time);

      if (file_meta[src]) {
        meta = file_meta[src];
        if ( ! meta.ready && ! meta.loading) {
          // 如果 js 文件还没开始加载，可修改配置
          deps && (meta._deps = this.get_deps(deps));
          version && (meta.version = version);
          charset && (meta.charset = charset);
        }
        return meta
      }

      meta = file_meta[src] =
        new File(src, version, charset, id.indexOf('util/') === 0 && id.substring(5));
      // 避免循环调用，先写入缓存再获取依赖
      deps && (meta._deps = this.get_deps(deps));
      return meta
    },
    // 返回模块接口，本质上等价于 require
    get_module: function(id){
      return (id = trim(id)) && (module_meta[id] || module_meta[ id = this.get_id(id) ]) ?
        module_meta[id].module_exports() :
        undefined
    },
    // 获取模块接口，模块的初始化在且只在此时进行
    module_exports: function(){
      var _this = this;
      if (_this._module) {
        return _this._module.exports;
      }

      if (typeof _this._factory === 'function') {
        _this._module = new Module_object(_this._define_id, _this._id);
        _this._factory(_this.new_require(), _this._module.exports, _this._module);
      } else {
        _this._module = { exports : _this._factory };
      }
      delete _this._factory;
      return _this._module.exports
    },
    // 返回一个新的 require 实例
    new_require: function(){
      var _this = this, require = function(id){
        return _this.get_module(id)
      };
      require.async = function(id, callback, deps){
        _this.async_module(id, callback, deps)
      };
      // 兼容CMD规范
      require.resolve = function(id){
        return _this.get_id(id)
      };
      return require;
    },
    // 保存模块实例缓存
    set_module: function(define_id, id, deps, factory){
      if ( ! module_meta[ define_id ? id = this.get_id(define_id) : id ]) {

        var file = file_meta[id];

        (file._modules || (file._modules = []))
          .push(module_meta[id] = new Module(id, factory, define_id));

        (deps = module_meta[id].get_deps(deps)) &&
          (file._define_deps = file._define_deps ? file._define_deps.concat(deps) : deps)
      }
    },
    // 异步加载模块
    async_module: function(id, callback, deps){
      var _this = this;

      if (deps) {
        _this.async_module(deps, function(){
          _this.async_module(id, callback);
        })

      } else {
        typeof id === 'string' && (id = trim(id).split(/\s+/));

        var length = id.length;

        if (length === 1) {
          // 加载一个文件
          var file = _this.get_file(id[0]);
          file.load(function(){
            var e = file.file_exports();
            typeof callback === 'function' && callback(e)
          })
        } else {
          // 加载多个文件
          var modules = [];
          foreach(id, function(id){
            var file = _this.get_file(id);
            modules.push(file);

            file.load(function(){
              length --;
              if (length === 0) {
                foreach(modules, function(m, i){
                  modules[i] = modules[i].file_exports()
                });
                typeof callback === 'function' && callback.apply(this, modules)
              }
            })
          });
        }
      }
    }
  };

  var hjs_module = new Module(top_base); // 加载器模块

  /*
   * 读取配置
   */
  function config(name){
    return name === undefined ? core_config : core_config[name]
  }

  /**
   * 设定配置
   */
  config.set = function(config){
    var i, autorun, reg_path_end = /\/*$/;
    // 模块路径
    if (config.paths) {
      for (i in config.paths) {
        // 自动补全结尾的 /
        config_paths[i] = absolute_url(config.paths[i], page_base).replace(reg_path_end, '/');
      }
    }
    delete config.paths;
    // 版本号、依赖和字符编码，针对js文件而不是针对模块
    if (config.modules) {
      for (i in config.modules) {
        // {String} id : [ {String} version, {Array} deps, {String} charset ]
        hjs_module.get_file(i, config.modules[i][0], config.modules[i][1], config.modules[i][2]);
      }
    }
    delete config.modules;
    // 模块标识别名
    if (config.alias) {
      for (i in config.alias) {
        config_alias[i] = config.alias[i];
      }
    }
    delete config.alias;
    // 配置设定后立刻执行的函数
    typeof config.autorun === 'function' && (autorun = config.autorun);
    delete config.autorun;
    // 避免 set 函数被覆盖
    delete config.set;
    for (i in config) {
      core_config[i] = config[i];
    }
    autorun && autorun();
  };

  /*
   * 加载主体模块
   */
  function main(_m, _d, _c) {
    if (_m) {
      if (_d && typeof _d === 'object' && ! is_array(_d)) {
        _c = _d;
        _d = '';
      }

      if (_c) {
        if (typeof _c === 'object') {
          config.set(_c);
          main(_m, _d);
        } else {
          hjs_module.async_module(_c, function(c){
            main(_m, _d, c);
          });
        }
      } else {
        var _main = typeof _m === 'function' ?
          function(){ main_inline(_m) } :
          function(){ hjs_module.async_module(_m) };

        _d ? hjs_module.async_module(_d, _main) : _main();
      }
    }
  }

  i = 0; // 重置用作计数器

  // html 内联代码里的主体模块
  function main_inline(factory){
    var deps = parse_deps(factory.toString()),
      id = page_base + '#' + (++i),
      main_module = module_meta[id] = new Module(id, factory);

    deps.length ?
      main_module.async_module(deps, function(){ main_module.get_module(id) }) :
      main_module.get_module(id);
  }

  /*
   * 默认全局变量 : hjs, define
   */
  W.hjs = define.hjs = {
    require: hjs_module.new_require(), // 加载模块
    config: config, // 配置
    main: main, // 执行主体模块
    core_script: core_script, // 含 data-main 的 script 节点相关操作
    // 预留的扩展功能接口
    ext: {
      // todo:暴露一些外部插件可能需要的接口
      // 触发某个文件加载过程
//      file_process: function(){},
      // 启用事件实例
      apply_events: function(e){
        // events 以第一次赋值为准
        ! events && typeof e.emit === 'function' && (events = e)
      }
    },
    // 保存默认全局变量原本的值
    conflict: { hjs: W.hjs , define: W.define }
  };

  // 定义新的 util 函数
  define.util = new_util;

  W.define = define;

  main(trim(core_script('main')), trim(core_script('deps')), trim(core_script('config')));

})(window, document);
