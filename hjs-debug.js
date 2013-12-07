/*
 * Halberd-JS Loader for Client-Side JavaScript v2.3.10
 * A Javascript Module Loader which is compatible with AMD and CMD Specification
 * Repository : https://github.com/yangjc/halberd-js
 * YJC <yangjiecong@live.com> | MIT license | 2013-09 .. 2013-12
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
  var script = D.createElement('script'), scripts, i,
  // script 优先使用 onload 事件执行回调
  // Firefox 早期版本中，动态创建 script 的初始对象不包含 onload 属性，但 onload 事件可用
  // 64位系统的 IE9 onload 的执行顺序无法保证，对于 IE 系浏览器，仅 IE10+ 使用 onload
    script_use_onload = !('onreadystatechange' in script) ||
      (('onload' in script) && ( ! D.documentMode || D.documentMode >= 10)),

  // @https://github.com/seajs/seajs
  // For IE6-9 browsers, the script onload event may not fire right
  // after the script is evaluated. Kris Zyp found that it
  // could query the script nodes and the one that is in "interactive"
  // mode indicates the current script
  // ref: http://goo.gl/JHfFW
    current_script, interactive_script;

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
   * 获取引入 halberd-js 核心文件的 script 节点
   * 约定：id="halberd-js" 仅用于此节点
   */
  script = D.getElementById("halberd-js"); // 优先通过 id 获取
  if ( ! script) {
    // 通常，如果通过阻塞方式载入 js，则当前执行的 js 由页面上最后一个 script 节点引入
    // 但部分浏览器插件会改变这个特征（如安装了 evernote 插件的 IE6），因此向前遍历 script 节点
    scripts = D.getElementsByTagName('script');
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

  /*
   * 模块内部 module 对象类
   */
  function Module_object(uri){
    this.uri = uri;
    this.exports = {};
  }

  // 工具函数
  var util = Module_object.prototype = {},

  // 用于依赖分析时避免重复载入 util 函数模块
    module_object = new Module_object(1),

  // 为扩展功能预留的事件实例
    events;

  // todo:触发事件的函数
    /**
     * 触发事件
     */
//  function events_emit(){
//    return events && events.emit.apply(this, arguments)
//  }

  util._ = util; // 原始对象作为私有属性暴露

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

  /*
   * 模块加载逻辑
   */
  var init_time = (new Date).getTime(), // 用于版本号的时间戳
    fid_attr = 'data-halberdjsid', // 在 script 节点记录文件 id 的属性名

    config_paths = {}, // 模块路径集合
    config_alias = {}, // 模块标识映射
    config_merge = {}, // 合并模块声明
    core_config = { // 默认配置
      charset: 'utf-8', // 默认字符集
      version_mark: 'v', // 版本号标记
      debug: -1 // 是否开启调试模式 0:线上环境 1:预发布环境 2:开发环境 -1:准线上环境
    },

    // 当前页面基准路径
    // 优先取 BASE 节点指定的路径
    page_base = W.location.href,
    page_root,
    top_base,

    reg_q_end = /\?$/, // 忽略模块标识末尾的问号

    // head 节点
    head = D.getElementsByTagName("head")[0] || D.documentElement,
    // base 节点
    base_ele = head.getElementsByTagName("base")[0],

    page_module,

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

      // `debug === -1` 默认值，全部按版本号加载，无版本号设置的不加版本号；分析模块源码里的依赖关系。
      // `debug === 2`  无视所有版本号设置，全部文件以当前时间戳为版本号；分析模块源码里的依赖关系。
      // `debug === 1`  有设置版本号的按版本号加载，无版本号设置则以当前时间戳为版本号；分析模块源码里的依赖关系。
      // `debug === 0`  版本号处理同 `debug === -1` ；**不**分析模块源码里的依赖关系。
      var version = core_config.debug > 1 ? init_time : _this._version || (core_config.debug > 0 ? init_time : '');
      script.src = _this._src +
        (version ? (_this._src.indexOf('?') === -1 ? '?' : '&') + core_config.version_mark + version : '');

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
          _this.anonymous_module().set_module(meta[0], _this._src, meta[1], meta[2])
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
    // ID与文件实际路径相同的匿名模块
    anonymous_module: function(){
      return this._anonymous_module || (this._anonymous_module = new Module(this._src))
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
          _this._exports = _this._modules[0]/*CONTEXT*/.module_exports()
        } else {
//          var e = [];
//          foreach(_this._modules, function(each_module){
//            e.push(each_module.module_exports())
//          });
//          _this._exports = e
          _this._exports = function(id){
            return _this._anonymous_module.get_module(id)
          }
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
   * @param {Array} deps
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

    var script, src,
      _deps = core_config.debug && typeof factory === 'function' && parse_deps(factory.toString());

    _deps && (deps = deps ? deps.concat(_deps) : _deps);

    script_use_onload ?

      (loading_meta || (loading_meta = [])).push([id, deps, factory]) :

      (script = get_interactive_script()) &&
        file_meta[src = script.getAttribute(fid_attr)].anonymous_module()
          /*CONTEXT*/.set_module(id, src, deps, factory);

    return define
  }

  /*
   * 模块类
   */
  function Module(id, factory){
    this._id = id;
    this._factory = factory
  }

  base_ele && base_ele.href && (page_base = absolute_url(base_ele.href, page_base));

  // 当前页面根路径
  page_root = reg_root.exec(page_base)[0];
  
  // 顶级标识基准路径
  // 取加载器所在目录 或 当前页面基准目录
  top_base = (
      script && script.src ?
        absolute_url(script.src, page_base) :
        page_base
    ).replace(/[^/]+$/, '');

  // 返回模块标识别名
  function alias_id(id){
    return config_alias[ id ] || id;
  }

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

      c = id.charAt(0);

      // 相对路径
      if (c === '.') {
        return alias_id(absolute_url(id, this._id));
      }

      // 根路径
      if (c === '/') {
        return alias_id(page_root + id);
      }

      var base;

      // 顶级标识
      (i = id.indexOf('/')) > -1 && // 尝试与项目路径拼接
        (base = config_paths[ id.substring(0, i) ]) &&
          (id = id.substring(i + 1)); // 存在项目路径配置时替换第一段路径

      return alias_id((base || config_paths[0] || top_base) + id);
    },
    // 获取依赖的 js 文件对象
    get_deps: function(deps){
      var l, f, id;
      if (is_array(deps) && (l = deps.length)) {
        for (var i = 0, _d = []; i < l; i++) {
          if (id = deps[i]) {
            f = this.get_file(id);
            // 避免自己依赖自己
            f._src !== this._id && _d.push(f);
          }
        }
        return _d
      }
    },
    // 获取 js 文件缓存
    get_file: function(id, version, deps, charset){
      var src = this.get_id(id), meta;

      // 模块标识以 ? 结尾则刷新浏览器文件缓存
      reg_q_end.test(id) && (version = init_time);

      // 如果被声明属于合并模块，则强制重定向到合并模块的路径
      if (meta = file_meta[src = config_merge[src] || src]) {
        if ( ! meta._ready && ! meta._loading) {
          // 如果 js 文件还没开始加载，可修改配置
          deps && (meta._deps = this.get_deps(deps));
          version && (meta._version = version);
          charset && (meta._charset = charset);
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
      var _this = this, _m, _f;
      if (_m = _this._module) {
        return _m.exports;
      }

      if (typeof (_f = _this._factory) === 'function') {
        _m = _this._module = new Module_object(_this._id);
        _f(_this.new_require(), _m.exports, _m);
      } else {
        _m = _this._module = { exports : _f };
      }
      delete _this._factory;
      return _m.exports
    },
    // 返回一个新的 require 实例
    new_require: function(){
      var _this = this, require = function(id){
        return _this.get_module(id)
      };
      require.async = function(id, callback, deps){
        _this.async_module(id, callback, deps)
      };
      require.clear = function(id){
        _this.clear_file(id)
      };
      require.config = function(config, callback){
        _this.set_config(config, callback)
      };
      // 兼容CMD规范
      require.resolve = function(id){
        return _this.get_id(id)
      };
      return require
    },
    // 清除文件缓存
    clear_file: function(id){
      delete file_meta[id = this.get_id(id)];
      delete config_merge[id]
    },
    // 保存模块实例缓存
    set_module: function(id, src, deps, factory){
      var file = file_meta[src], m_meta, f_meta;

      id = id ? this.get_id(id) : src;

      (file._modules || (file._modules = []))
        .push(m_meta = module_meta[id] = new Module(id, factory));

      if ( ! file_meta[id]) {
        f_meta = file_meta[id] = new File(id);
        f_meta._ready = 1;
        f_meta._modules = [ m_meta ];
      }

      (deps = module_meta[id].get_deps(deps)) &&
        (file._define_deps = file._define_deps ? file._define_deps.concat(deps) : deps)
    },
    // 异步加载模块
    async_module: function(id, callback, deps){
      var _this = this, length, modules, file;

      if (deps) {
        _this.async_module(deps, function(){
          _this.async_module(id, callback);
        })

      } else {
        typeof id === 'string' && (id = trim(id).split(/\s+/));

        length = id.length;

        modules = [];

        function onload(){
          if (--length === 0) {
            foreach(modules, function(_id, i){
              modules[i] = _id ? file_meta[ _this.get_id(_id) ].file_exports() : undefined
            });
            callback && callback.apply(this, modules)
          }
        }

        foreach(id, function(_id){
          modules.push(_id);
          _id ?
            _this.get_file(_id).load(onload) :
            onload()
        });
      }
    },
    // 设定配置
    set_config: function(config, callback){
      var i, j, item, reg_path_end = /\/*$/, _this = this;

      if (typeof config === 'string') {
        _this.async_module(config = _this.get_id(config), function(e){
          module_meta[config].set_config(e, callback)
        })
      } else {
        // 模块路径
        if (item = config.paths) {
          for (i in item) {
            // 自动补全结尾的 /
            config_paths[i] = _this.get_id(item[i].replace(reg_path_end, '/'))
          }
        }

        // 模块标识别名
        if (item = config.alias) {
          for (i in item) {
            j = _this.get_id(item[i]);
            i = _this.get_id(i);
            // 避免别名指向相同路径
            i !== j && (config_alias[i] = j)
          }
        }

        // 声明合并模块
        if (item = config.merge) {
          for (i in item) {
            j = _this.get_id(i);
            foreach(item[i], function(m){
              config_merge[_this.get_id(m)] = j
            })
          }
        }

        // 版本号、依赖和字符编码，针对js文件而不是针对模块
        if (item = config.modules) {
          for (i in item) {
            // {String} id : [ {String} version, {Array} deps, {String} charset ]
            _this.get_file(i, item[i][0], item[i][1], item[i][2])
          }
        }

        // 其他配置项
        for (i in config) {
          core_config[i] = config[i]
        }

        // 配置设定后立刻执行的函数
        config.autorun && config.autorun();

        // 执行回调
        callback && callback(core_config)
      }
    }
  };

  page_module = new Module(page_base); // 以当前页面路径为基准路径的模块

  /*
   * 加载主体模块
   */
  function main(_m, _d, _c) {
    if (_m) {
      if (_d && typeof _d === 'object' && ! is_array(_d)) {
        _c = _d;
        _d = 0
      }

      if (_c) {
        page_module.set_config(_c, function(){
          main(_m, _d)
        })
      } else {
        var _main = typeof _m === 'function' ?
          function(){ main_inline(_m) } :
          function(){ page_module.async_module(_m) };

        _d ? page_module.async_module(_d, _main) : _main()
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
      main_module.get_module(id)
  }

  /*
   * 默认全局变量 : hjs, define
   */
  W.hjs = define.hjs = {
    require: page_module.new_require(), // 加载模块
    main: main, // 执行主体模块
    core_script: core_script, // 引入加载器的 script 节点相关操作
    // 读取全局配置
    config: function(name){
      return name === undefined ? core_config : core_config[name]
    },
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