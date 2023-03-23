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

  var _assign = function __assign() {
    _assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return _assign.apply(this, arguments);
  };

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
  	"build:watch": "rollup -c --watch"
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
   * 数据处理
   *
   * @export
   * @class Builder
   */
  var Builder = /** @class */ (function () {
      function Builder(config) {
          var appId = config.appId;
          var traceId = generateRandom();
          this.cache = new Map();
          this.baseData = {
              appId: appId,
              traceId: traceId,
              sdk: {
                  version: pkg.version,
              },
          };
      }
      Builder.prototype.build = function (data) {
          return _assign(_assign({ t: +new Date() }, this.baseData), data);
      };
      return Builder;
  }());

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
          var dsn = this.client.config.dsn;
          this.pending = true;
          this.client.$hook.emit('send', function (send) {
              var datas = _this.tasks.slice(0, _this.max).map(function (_a) {
                  var data = _a.data;
                  return data;
              });
              console.log('send 任务发送: 数据', { data: datas });
              send(dsn + '/v1/report', { data: datas })
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
      Schedule.prototype.clear = function () {
          this.consumer();
      };
      // 立即上报
      Schedule.prototype.immediate = function (report) { };
      return Schedule;
  }());

  // 上报服务端地址
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
  var ErrorType;
  (function (ErrorType) {
      ErrorType[ErrorType["PROMISE"] = 0] = "PROMISE";
      ErrorType[ErrorType["JS"] = 1] = "JS";
      ErrorType[ErrorType["RESOURCE"] = 2] = "RESOURCE";
  })(ErrorType || (ErrorType = {}));
  var RequestType;
  (function (RequestType) {
      RequestType[RequestType["fetch"] = 0] = "fetch";
      RequestType[RequestType["XHR"] = 1] = "XHR";
  })(RequestType || (RequestType = {}));

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
      Browser.prototype.apply = function (client) {
          var _this_1 = this;
          this.client = client;
          if (!window)
              return;
          client.$hook.on('init', function () {
              console.log('init 事件触发');
              _this_1.timing();
              _this_1.listenError();
              _this_1.promiseError();
              _this_1.overrideFetch();
              _this_1.overrideXHR();
          });
          client.$hook.on('send', function (report) {
              report(_this_1.send);
          });
          window.addEventListener('unload', function () {
              client.$hook.emit('report', {});
          });
      };
      Browser.prototype.send = function (url, body) {
          var data = body.data;
          var formData = new FormData();
          formData.append('data', JSON.stringify(data));
          if (typeof navigator.sendBeacon === 'function') {
              return Promise.resolve(navigator.sendBeacon(url, formData));
          }
          else {
              return new Promise(function (r, j) {
                  var XHR = new XMLHttpRequest();
                  XHR.addEventListener('load', function () {
                      r(true);
                  });
                  XHR.addEventListener('error', function () {
                      j();
                  });
                  XHR.open('POST', url);
                  XHR.send(formData);
              });
          }
      };
      Browser.prototype.report = function (data) {
          var _a;
          var eid = data.eid, l = data.l;
          var ua = navigator.userAgent;
          (_a = this.client) === null || _a === void 0 ? void 0 : _a.$hook.emit('report', {
              eid: eid,
              l: _assign(_assign({}, l), { ua: ua }),
          });
      };
      Browser.prototype.overrideXHR = function () {
          var monitor = this.client;
          if (!XMLHttpRequest)
              return;
          var _open = XMLHttpRequest.prototype.open;
          var _send = XMLHttpRequest.prototype.send;
          XMLHttpRequest.prototype.open = function () {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              var method = args[0], url = args[1];
              var startTime = Date.now();
              this.monitorCollect = _assign(_assign({}, this.monitorCollect), { method: method, url: url, startTime: startTime, type: RequestType.XHR });
              _open.apply(this, args);
          };
          XMLHttpRequest.prototype.send = function () {
              var _this_1 = this;
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              this.addEventListener('loadend', function () {
                  var endTime = Date.now();
                  var _a = _this_1, status = _a.status, statusText = _a.statusText;
                  if (status > 200) {
                      _this_1.monitorCollect = _assign(_assign({}, _this_1.monitorCollect), { endTime: endTime, status: status, statusText: statusText });
                      monitor === null || monitor === void 0 ? void 0 : monitor.$hook.emit('report', {
                          eid: '1001',
                          l: _this_1.monitorCollect,
                      });
                  }
              });
              _send.apply(this, args);
          };
      };
      Browser.prototype.overrideFetch = function () {
          if (typeof window.fetch !== 'function') {
              return;
          }
          var _this = this;
          var originFetch = window.fetch;
          window.fetch = function () {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              var startTime = Date.now();
              var url = args[0];
              var config = args[1];
              var _a = (config || {}).method, method = _a === void 0 ? 'GET' : _a;
              var reportData = {
                  url: url,
                  startTime: startTime,
                  method: method,
                  type: RequestType.fetch,
              };
              return originFetch
                  .apply(window, args)
                  .then(function (result) {
                  var status = result.status, statusText = result.statusText;
                  if (status && status > 300) {
                      var endTime = Date.now();
                      Object.assign(reportData, { status: status, statusText: statusText, endTime: endTime });
                      _this.report({ eid: '1001', l: reportData });
                  }
                  return result;
              })
                  .catch(function (error) {
                  var endTime = Date.now();
                  var name = error.name, message = error.message, stack = error.stack;
                  Object.assign(reportData, { name: name, message: message, stack: stack });
                  reportData.endTime = endTime;
                  _this.report({
                      eid: '1001',
                      l: reportData,
                  });
                  return error;
              });
          };
      };
      /**
       * Js 异常捕捉
       *
       * @param {Monitor} client
       * @memberof Browser
       */
      Browser.prototype.listenError = function () {
          var _this_1 = this;
          window.addEventListener('error', function (e) {
              var type = e.type, error = e.error, colno = e.colno, filename = e.filename, lineno = e.lineno, message = e.message;
              if (type === 'error' && filename && colno && lineno) {
                  if (!message) {
                      message = (error === null || error === void 0 ? void 0 : error.message) || '';
                  }
                  _this_1.report({
                      eid: '1003',
                      l: {
                          colno: colno,
                          message: message,
                          filename: filename,
                          lineno: lineno,
                          stack: error === null || error === void 0 ? void 0 : error.stack,
                          type: ErrorType.JS,
                      },
                  });
              }
          }, true);
      };
      /**
       * Promise 错误捕捉
       *
       * @param {Monitor} client
       * @memberof Browser
       */
      Browser.prototype.promiseError = function () {
          var _this_1 = this;
          window.addEventListener('unhandledrejection', function (e) {
              var reason = e.reason;
              var reportData = {
                  message: '',
                  stack: '',
                  name: '',
              };
              if (typeof reason === 'string') {
                  reportData.message = reason;
              }
              else if (reason instanceof Error) {
                  var name_1 = reason.name, stack = reason.stack, message = reason.message;
                  reportData.message = message;
                  reportData.stack = stack || '';
                  reportData.name = name_1;
              }
              _this_1.report({
                  eid: '1003',
                  l: _assign({ type: ErrorType.PROMISE }, reportData),
              });
          });
      };
      /**
       * 性能数据采集
       *
       * @param {Monitor} client
       * @memberof Browser
       */
      Browser.prototype.timing = function () {
          var _this_1 = this;
          var timing = {};
          // v2
          if (!!PerformanceObserver) {
              var fcpP = new Promise(function (r, j) {
                  var observer = new PerformanceObserver(function (list) {
                      list.getEntries().forEach(function (entry) {
                          if (entry.name === 'first-contentful-paint') {
                              r(entry.startTime);
                          }
                      });
                  });
                  observer.observe({ type: 'paint', buffered: true });
              });
              var lcpP = new Promise(function (r, j) {
                  var observer = new PerformanceObserver(function (list) {
                      var entries = list.getEntries();
                      var lastEntry = entries[entries.length - 1];
                      r(lastEntry.startTime);
                  });
                  observer.observe({ type: 'largest-contentful-paint', buffered: true });
              });
              var navigationP = new Promise(function (r, j) {
                  var perfObserver = function (entries) {
                      entries.getEntries().forEach(function (entry) {
                          var entryType = entry.entryType;
                          if (entryType === 'navigation') {
                              var t = entry.toJSON();
                              r(t);
                          }
                      });
                  };
                  var observer = new PerformanceObserver(perfObserver);
                  observer.observe({ entryTypes: ['navigation'] });
              });
              Promise.all([navigationP, lcpP, fcpP]).then(function (_a) {
                  var navigation = _a[0], lcp = _a[1], fcp = _a[2];
                  var timing = _this_1.formatTiming(navigation);
                  _this_1.report({
                      eid: '1000',
                      l: _assign(_assign({}, timing), { lcp: Number(lcp.toFixed(2)), fcp: Number(fcp.toFixed(2)) }),
                  });
              });
          }
          else {
              window.addEventListener('load', function () {
                  var _a = performance.timing, unloadEventStart = _a.unloadEventStart, unloadEventEnd = _a.unloadEventEnd, navigationStart = _a.navigationStart, redirectStart = _a.redirectStart, redirectEnd = _a.redirectEnd, fetchStart = _a.fetchStart, domainLookupStart = _a.domainLookupStart, domainLookupEnd = _a.domainLookupEnd, connectStart = _a.connectStart, secureConnectionStart = _a.secureConnectionStart, connectEnd = _a.connectEnd, requestStart = _a.requestStart, responseStart = _a.responseStart, responseEnd = _a.responseEnd, domLoading = _a.domLoading, domInteractive = _a.domInteractive, domContentLoadedEventEnd = _a.domContentLoadedEventEnd, domContentLoadedEventStart = _a.domContentLoadedEventStart, domComplete = _a.domComplete, loadEventStart = _a.loadEventStart, loadEventEnd = _a.loadEventEnd;
                  var redirectCount = performance.navigation.redirectCount;
                  var startAt = navigationStart || 0;
                  unloadEventStart = unloadEventStart >= startAt ? unloadEventStart - startAt : 0;
                  unloadEventEnd = unloadEventEnd >= startAt ? unloadEventEnd - startAt : unloadEventStart;
                  redirectStart = redirectStart >= startAt ? redirectStart - startAt : unloadEventEnd;
                  redirectEnd = redirectEnd >= startAt ? redirectEnd - startAt : redirectStart;
                  fetchStart = fetchStart >= startAt ? fetchStart - startAt : redirectEnd;
                  domainLookupStart = domainLookupStart >= startAt ? domainLookupStart - startAt : fetchStart;
                  domainLookupEnd = domainLookupStart >= startAt ? domainLookupStart - startAt : domainLookupStart;
                  connectStart = connectStart >= startAt ? connectStart - startAt : domainLookupEnd;
                  secureConnectionStart = secureConnectionStart >= startAt ? secureConnectionStart - startAt : connectStart;
                  connectEnd = connectEnd >= startAt ? connectEnd - startAt : secureConnectionStart;
                  requestStart = requestStart ? requestStart - startAt : connectEnd;
                  responseStart = responseStart >= startAt ? responseStart - startAt : requestStart;
                  responseEnd = responseEnd >= startAt ? responseEnd - startAt : responseStart;
                  domLoading = domLoading >= startAt ? domLoading - startAt : responseEnd;
                  domInteractive = domInteractive >= startAt ? domInteractive - startAt : domLoading;
                  domContentLoadedEventStart =
                      domContentLoadedEventStart >= startAt ? domContentLoadedEventStart - startAt : domInteractive;
                  domContentLoadedEventEnd =
                      domContentLoadedEventEnd >= startAt ? domContentLoadedEventEnd - startAt : domContentLoadedEventStart;
                  domComplete = domComplete >= startAt ? domComplete - startAt : domContentLoadedEventEnd;
                  loadEventStart = loadEventStart >= startAt ? loadEventStart - startAt : domComplete;
                  loadEventEnd = loadEventEnd >= startAt ? loadEventEnd - startAt : loadEventStart;
                  timing = {
                      navigationStart: 0,
                      unloadEventStart: unloadEventStart,
                      unloadEventEnd: unloadEventEnd,
                      redirectStart: redirectStart,
                      redirectEnd: redirectEnd,
                      fetchStart: fetchStart,
                      domainLookupStart: domainLookupStart,
                      domainLookupEnd: domainLookupEnd,
                      connectStart: connectStart,
                      secureConnectionStart: secureConnectionStart,
                      connectEnd: connectEnd,
                      requestStart: requestStart,
                      responseStart: responseStart,
                      responseEnd: responseEnd,
                      domLoading: domLoading,
                      domInteractive: domInteractive,
                      domContentLoadedEventEnd: domContentLoadedEventEnd,
                      domContentLoadedEventStart: domContentLoadedEventStart,
                      domComplete: domComplete,
                      loadEventStart: loadEventStart,
                      loadEventEnd: loadEventEnd,
                      redirectCount: redirectCount,
                  };
                  _this_1.report({ eid: '1000', l: timing });
              });
          }
      };
      Browser.prototype.formatTiming = function (timing) {
          var unloadEventStart = timing.unloadEventStart, unloadEventEnd = timing.unloadEventEnd, navigationStart = timing.navigationStart, redirectStart = timing.redirectStart, redirectEnd = timing.redirectEnd, redirectCount = timing.redirectCount, fetchStart = timing.fetchStart, domainLookupStart = timing.domainLookupStart, domainLookupEnd = timing.domainLookupEnd, connectStart = timing.connectStart, secureConnectionStart = timing.secureConnectionStart, connectEnd = timing.connectEnd, requestStart = timing.requestStart, responseStart = timing.responseStart, responseEnd = timing.responseEnd, domLoading = timing.domLoading, domInteractive = timing.domInteractive, domContentLoadedEventEnd = timing.domContentLoadedEventEnd, domContentLoadedEventStart = timing.domContentLoadedEventStart, domComplete = timing.domComplete, loadEventStart = timing.loadEventStart, loadEventEnd = timing.loadEventEnd;
          var t = {
              unloadEventStart: unloadEventStart,
              unloadEventEnd: unloadEventEnd,
              navigationStart: navigationStart,
              redirectStart: redirectStart,
              redirectEnd: redirectEnd,
              redirectCount: redirectCount,
              fetchStart: fetchStart,
              domainLookupStart: domainLookupStart,
              domainLookupEnd: domainLookupEnd,
              connectStart: connectStart,
              secureConnectionStart: secureConnectionStart,
              connectEnd: connectEnd,
              requestStart: requestStart,
              responseStart: responseStart,
              responseEnd: responseEnd,
              domLoading: domLoading,
              domInteractive: domInteractive,
              domContentLoadedEventEnd: domContentLoadedEventEnd,
              domContentLoadedEventStart: domContentLoadedEventStart,
              domComplete: domComplete,
              loadEventStart: loadEventStart,
              loadEventEnd: loadEventEnd,
          };
          Object.entries(t).forEach(function (_a) {
              var key = _a[0], value = _a[1];
              if (typeof value === 'number') {
                  t[key] = Number(value.toFixed(2));
              }
              else {
                  t[key] = value || 0;
              }
          });
          return t;
      };
      return Browser;
  }());

  function assertConfig(config) {
      if (!config) {
          throw new Error('缺少 SDK 配置信息');
      }
      if (!config.dsn) {
          throw new Error('缺少 SDK dns 配置信息');
      }
      if (!config.appId) {
          throw new Error('缺少 appId 应用 ID');
      }
  }
  /**
   * Core 实例
   *
   * @export
   * @class Monitor
   */
  var Monitor = /** @class */ (function () {
      function Monitor() {
      }
      Monitor.prototype.init = function (config) {
          var _a;
          assertConfig(config);
          this.config = config;
          var _b = config.plugins, plugins = _b === void 0 ? [] : _b, appId = config.appId;
          this.builder = new Builder({ appId: appId });
          this.schedule = new Schedule({ max: 2, client: this });
          this.$hook = new EventEmitter();
          // 插件注册
          this.registerPlugins(plugins);
          // 事件注册
          this.addListeners();
          // 唤起 init 事件
          (_a = this.$hook) === null || _a === void 0 ? void 0 : _a.emit('init', {});
      };
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
          var _a;
          // 接收插件上报事件, 将任务插入调度器
          (_a = this.$hook) === null || _a === void 0 ? void 0 : _a.on('report', function (data) {
              var _a, _b;
              console.log('report 事件触发, 数据:', data);
              var pkgData = (_a = _this.builder) === null || _a === void 0 ? void 0 : _a.build(data);
              pkgData && ((_b = _this.schedule) === null || _b === void 0 ? void 0 : _b.push(pkgData));
          });
      };
      return Monitor;
  }());

  exports.Browser = Browser;
  exports.default = Monitor;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
