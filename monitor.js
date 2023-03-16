(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.monitor = {}));
})(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  function alias(name) {
    return function (target, _property, descriptor) {
      target[name] = descriptor.value;
      return descriptor;
    };
  }

  /**
   * DOM和自定义事件
   * @author luoying
   * @since 17/06/13
   */
  var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  /**
   * 自定义事件器
   * @class EventEmitter
   */
  var EventEmitter = /*#__PURE__*/function () {
    function EventEmitter() {
      _classCallCheck(this, EventEmitter);
      /**
       * 最近发布的一条消息
       */
      _defineProperty(this, "lastEmittedEvents", new Map());
      /**
       * 事件处理器
       */
      _defineProperty(this, "eventListeners", new Map());
    }
    _createClass(EventEmitter, [{
      key: "addListener",
      value:
      /**
       * 注册自定义事件
       * @param {EventType} type 事件类型
       * @param {EventListener<E>} listener 事件处理器
       * @param {boolean} [delayOn=false] 是否延迟订阅
       * @memberof EventEmitter
       */
      function addListener(type, listener) {
        var delayOn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (!type || !listener) return;
        var listeners = this.eventListeners.get(type);
        if (!listeners) {
          listeners = [];
          this.eventListeners.set(type, listeners);
        }
        // 相同的事件不会触发多次
        if (listeners.indexOf(listener) >= 0) return;
        // 注册回调事件
        listeners.push(listener);
        // 对于延迟订阅者，需要立即发布一次最近发布的消息
        if (delayOn && this.lastEmittedEvents.has(type)) {
          var lastEmittedEvent = this.lastEmittedEvents.get(type);
          listener(lastEmittedEvent);
        }
      }
      /**
       * 注册一次性自定义事件，用完焚毁
       * @param {EventType} type 事件类型
       * @param {EventListener<E>} listener 事件处理器
       * @param {boolean} [delayOn=false] 是否延迟订阅
       * @memberof EventEmitter
       */
    }, {
      key: "addOnceListener",
      value: function addOnceListener(type, listener) {
        var _this = this;
        var delayOn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var onceListener = function onceListener(evt) {
          listener(evt);
          _this.off(type, onceListener);
        };
        this.on(type, onceListener, delayOn);
      }
      /**
       * 注销自定义事件
       * @param {EventType} [type] 事件类型
       * @param {EventListener<E>} [listener] 事件处理器，当不指定时，表示注销所有该类型的自定义事件
       * @memberof EventEmitter
       */
    }, {
      key: "removeListener",
      value: function removeListener(type, listener) {
        if (!type) {
          this.removeAllListeners();
          return;
        }
        if (!listener) {
          this.eventListeners.set(type, []);
          return;
        }
        var listeners = this.listeners(type);
        for (var i = 0; i < listeners.length; i++) {
          var handler = listeners[i];
          if (handler === listener) {
            listeners.splice(i, 1);
            break;
          }
        }
      }
      /**
       * 注销所有自定义事件
       * @memberof EventEmitter
       */
    }, {
      key: "removeAllListeners",
      value: function removeAllListeners() {
        this.lastEmittedEvents.clear();
        this.eventListeners.clear();
      }
      /**
       * 派发自定义事件
       * @alias fire
       * @param {EventType} type 事件类型
       * @param {E} evt 任意事件数据
       * @memberof EventEmitter
       */
    }, {
      key: "emit",
      value: function emit(type, evt) {
        if (!type) return;
        // 发布消息给当前所有订阅者
        var listeners = this.listeners(type);
        var count = listeners.length;
        // 当通过`once`注册的事件侦听器，在执行之后立即回收，`listeners`数组长度会缩减
        // 为了准确的执行每一个事件侦听器，需要实时根据`listeners`数组长度来迭代事件侦听器
        while (count) {
          var index = listeners.length - count;
          var listener = listeners[index];
          listener(evt);
          count--;
        }
        // 缓存最新的消息
        this.lastEmittedEvents.set(type, evt);
      }
      /**
       * 返回事件处理器列表
       * @param {EventType} type 事件类型
       * @returns {EventListener<E>[]}
       * @memberof EventEmitter
       */
    }, {
      key: "listeners",
      value: function listeners(type) {
        return this.eventListeners.get(type) || [];
      }
      /**
       * 返回已注册的事件处理器数量
       * @param {EventType} type 事件类型
       * @returns {number}
       * @memberof EventEmitter
       */
    }, {
      key: "listenerCount",
      value: function listenerCount(type) {
        return this.listeners(type).length;
      }
    }]);
    return EventEmitter;
  }();
  __decorate([alias('on')], EventEmitter.prototype, "addListener", null);
  __decorate([alias('once')], EventEmitter.prototype, "addOnceListener", null);
  __decorate([alias('off')], EventEmitter.prototype, "removeListener", null);
  __decorate([alias('offAll')], EventEmitter.prototype, "removeAllListeners", null);
  __decorate([alias('fire')], EventEmitter.prototype, "emit", null);
  var _window = window,
    __globalEvent__ = _window.__globalEvent__;
  if (!__globalEvent__) {
    window.__globalEvent__ = new EventEmitter();
    __globalEvent__ = window.__globalEvent__;
  }

  /*
   * ID生成器
   *
   * @Author: xiaoxianjie
   * @Date: 2022-11-15 09:51:08
   *
   * Copyright © 2014-2022 Rabbitpre.com. All Rights Reserved.
   */
  /**
   * 生成由数字和小写英文字母组成的随机字符串
   * @returns 返回17~20位长度的字符串
   */
  function generateRandom() {
    return Math.random().toString(36).slice(2) + new Date().getTime().toString(36);
  }

  var name = "monitor";
  var version = "1.0.0";
  var description = "";
  var main = "monitor.min.js";
  var scripts = {
  	build: "rollup -c",
  	"build:watch": "rollup -c --watch",
  	serve: "nodemon web/server.ts"
  };
  var repository = {
  	type: "git",
  	url: "git+https://github.com/xjq7/monitor.git"
  };
  var keywords = [
  ];
  var author = "";
  var license = "ISC";
  var bugs = {
  	url: "https://github.com/xjq7/monitor/issues"
  };
  var homepage = "https://github.com/xjq7/monitor#readme";
  var devDependencies = {
  	"@babel/core": "^7.21.0",
  	"@babel/preset-env": "^7.20.2",
  	"@babel/preset-typescript": "^7.21.0",
  	"@rollup/plugin-babel": "^6.0.3",
  	"@rollup/plugin-json": "^6.0.0",
  	"@rollup/plugin-node-resolve": "^15.0.1",
  	"@rollup/plugin-terser": "^0.4.0",
  	"@rollup/plugin-typescript": "^11.0.0",
  	"@types/node": "^18.14.2",
  	"cross-env": "^7.0.3",
  	prettier: "^2.8.4",
  	rimraf: "^4.1.2",
  	rollup: "^3.17.3",
  	"rollup-plugin-clear": "^2.0.7",
  	tslib: "^2.5.0",
  	typescript: "^4.9.5"
  };
  var dependencies = {
  	"@tubit/common": "^1.5.1",
  	jest: "^29.4.3"
  };
  var pkg = {
  	name: name,
  	version: version,
  	description: description,
  	main: main,
  	scripts: scripts,
  	repository: repository,
  	keywords: keywords,
  	author: author,
  	license: license,
  	bugs: bugs,
  	homepage: homepage,
  	devDependencies: devDependencies,
  	dependencies: dependencies
  };

  /**
   * 数据包装器, 公共参数注入, 转换
   *
   * @export
   * @class Builder
   */
  var Builder = /** @class */ (function () {
      function Builder(config) {
          var appId = config.appId;
          var traceId = generateRandom();
          this.baseData = {
              appId: appId,
              traceId: traceId,
              sdk: {
                  version: pkg.version,
              },
          };
      }
      Builder.prototype.build = function (data) {
          var l = data.l, type = data.type;
          return Object.assign({ l: l, type: type, t: +new Date() }, this.baseData);
      };
      return Builder;
  }());

  // 上报服务端地址
  var serverUrl = '';
  /**
   * 上报类型
   *
   * @export
   * @enum {number}
   */
  var ReportType;
  (function (ReportType) {
      ReportType["PERFORMANCE"] = "1";
      ReportType["RESOURCE"] = "2";
      ReportType["ERROR"] = "3";
  })(ReportType || (ReportType = {}));

  var id = 0;
  /**
   * 任务中心
   *
   * @export
   * @class Schedule
   */
  var Schedule = /** @class */ (function () {
      function Schedule(config) {
          this.pending = false;
          this.client = config.client;
          this.tasks = [];
          this.max = config.max || 10;
      }
      // 消费任务
      Schedule.prototype.consumer = function () {
          var _this = this;
          if (this.tasks.length < this.max || this.pending)
              return;
          this.pending = true;
          this.client.$hook.emit('send', function (send) {
              var datas = _this.tasks.slice(0, _this.max).map(function (_a) {
                  var data = _a.data;
                  return data;
              });
              console.log('send 任务发送: 数据', datas);
              send(serverUrl, datas)
                  .then(function () {
                  console.log('send 成功, 清除成功任务');
                  _this.tasks = _this.tasks.slice(_this.max);
                  _this.consumer();
              })
                  .finally(function () {
                  _this.pending = false;
              });
          });
      };
      // 储存任务
      Schedule.prototype.push = function (data) {
          var task = { id: ++id, data: data };
          this.tasks.push(task);
          this.consumer();
      };
      // 清空任务并消费
      Schedule.prototype.clear = function () { };
      // 立即上报
      Schedule.prototype.immediate = function (report) { };
      return Schedule;
  }());

  /**
   * 浏览器端插件
   *
   * @export
   * @class Browser
   */
  var Browser = /** @class */ (function () {
      function Browser(options) {
          this.name = 'Browser';
          this.options = options || {};
      }
      Browser.prototype.apply = function (instance) {
          var _this = this;
          instance.$hook.on('init', function () {
              console.log('init 事件触发');
              _this.timing(instance);
              _this.jsError(instance);
              _this.promiseError(instance);
          });
          instance.$hook.on('send', function (report) {
              report(_this.send);
          });
          window.addEventListener('unload', function () {
              instance.$hook.emit('report', {});
          });
      };
      Browser.prototype.send = function (url, data) {
          if (typeof navigator.sendBeacon === 'function') {
              return Promise.resolve(navigator.sendBeacon(url, JSON.stringify(data)));
          }
      };
      /**
       * Js 异常捕捉
       *
       * @param {Monitor} instance
       * @memberof Browser
       */
      Browser.prototype.jsError = function (instance) {
          window.onerror = function (event, source, lineno, colno, error) {
              instance.$hook.emit('report', {
                  type: ReportType.ERROR,
                  l: {
                      source: source,
                      lineno: lineno,
                  },
              });
          };
      };
      /**
       * Promise 错误捕捉
       *
       * @param {Monitor} instance
       * @memberof Browser
       */
      Browser.prototype.promiseError = function (instance) {
          window.addEventListener('unhandledrejection', function (e) {
              e.reason;
              console.log(e);
          });
      };
      /**
       * 性能数据采集
       *
       * @param {Monitor} instance
       * @memberof Browser
       */
      Browser.prototype.timing = function (instance) {
          var timing = {};
          // v2
          if (!!PerformanceObserver) {
              var perfObserver = function (entries) {
                  entries.getEntries().forEach(function (entry) {
                      var entryType = entry.entryType;
                      if (entryType === 'navigation') {
                          var t = entry.toJSON();
                          Object.assign(timing, t);
                      }
                  });
              };
              var observer = new PerformanceObserver(perfObserver);
              observer.observe({
                  entryTypes: ['navigation'],
              });
          }
          else {
              Object.assign(timing, performance.navigation, performance.timing);
          }
          instance.$hook.emit('report', {
              type: ReportType.PERFORMANCE,
              l: timing,
          });
      };
      return Browser;
  }());

  /**
   * Core 实例
   *
   * @export
   * @class Monitor
   */
  var Monitor = /** @class */ (function () {
      function Monitor(options) {
          this.options = options;
          var _a = options.plugins, plugins = _a === void 0 ? [] : _a, appId = options.appId;
          this.$hook = new EventEmitter();
          this.builder = new Builder({ appId: appId });
          this.schedule = new Schedule({ max: 10, client: this });
          // 插件注册
          this.registerPlugins(plugins);
          // 派发事件
          this.addListeners();
          // 唤起 init 事件
          this.$hook.emit('init', {});
      }
      Monitor.prototype.registerPlugins = function (plugins) {
          var _this = this;
          if (!Array.isArray(plugins))
              return;
          plugins.map(function (plugin) {
              return plugin.apply(_this);
          });
      };
      Monitor.prototype.addListeners = function () {
          var _this = this;
          // 接收插件上报事件, 将任务插入调度器
          this.$hook.on('report', function (data) {
              console.log('report 事件触发, 数据:', data);
              var pkgData = _this.builder.build(data);
              pkgData && _this.schedule.push(pkgData);
          });
      };
      return Monitor;
  }());

  exports.Browser = Browser;
  exports.default = Monitor;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
