(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.monitor = {}));
})(this, (function (exports) { 'use strict';

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
    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }
    function __generator(thisArg, body) {
      var _ = {
          label: 0,
          sent: function sent() {
            if (t[0] & 1) throw t[1];
            return t[1];
          },
          trys: [],
          ops: []
        },
        f,
        y,
        t,
        g;
      return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
      }), g;
      function verb(n) {
        return function (v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    }

    var Eid = {
        jsException: 'jsException',
        requestException: 'requestException',
        resourceException: 'resourceException',
        performance: 'performance',
        performanceResource: 'performanceResource',
    };

    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0;
            var v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    var id = 0;
    var Storage = /** @class */ (function () {
        function Storage(props) {
            this.tasks = [];
            this.maxTasks = props.maxTasks;
        }
        /**
         * 往缓冲区 push 任务
         *
         * @param {LData} data
         * @return {*}
         * @memberof Storage
         */
        Storage.prototype.push = function (data) {
            if (Array.isArray(data)) {
                var tasks = data.map(function (d) { return ({ id: ++id, data: d, count: 1 }); });
                this.tasks = this.tasks.concat(tasks);
            }
            else {
                var task = { id: ++id, data: data, count: 1 };
                this.tasks.push(task);
            }
            if (this.tasks.length >= this.maxTasks)
                return true;
            return false;
        };
        /**
         * 取出缓冲区的任务
         *
         * @param {number} n
         * @return {*}
         * @memberof Storage
         */
        Storage.prototype.pop = function (n) {
            var tasks = this.tasks.slice(0, n);
            this.tasks = this.tasks.slice(n);
            return tasks;
        };
        Storage.prototype.getSize = function () {
            return this.tasks.length;
        };
        return Storage;
    }());

    /**
     * 任务中心
     *
     * @export
     * @class Schedule
     */
    var Scheduler = /** @class */ (function () {
        function Scheduler(config) {
            var _this = this;
            var client = config.client, maxTasks = config.maxTasks, storage = config.storage;
            this.client = client;
            this.maxTasks = maxTasks;
            this.storage = storage;
            this.cycleTime = 5;
            setInterval(function () {
                _this.consume();
            }, this.cycleTime * 1000);
        }
        /**
         * 任务消费
         *
         * @param {boolean} [clear] 是否清空
         * @return {*}
         * @memberof Schedule
         */
        Scheduler.prototype.consume = function () {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var tasks, data, error_1;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            tasks = this.storage.pop(this.maxTasks);
                            data = tasks.map(function (_a) {
                                var data = _a.data;
                                return data;
                            });
                            if (!data.length)
                                return [2 /*return*/];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.send(_assign(_assign({}, this.client.baseData), { list: data }), {
                                    url: "".concat((_b = (_a = this.client) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.dsn, "/report"),
                                })];
                        case 2:
                            _c.sent();
                            setTimeout(function () {
                                _this.consume();
                            }, 100);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _c.sent();
                            console.log(error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return Scheduler;
    }());

    var getNavigationEntryFromPerformanceTiming = function () {
        var timing = performance.timing;
        var type = performance.navigation.type;
        var navigationEntry = {
            entryType: 'navigation',
            startTime: 0,
            type: type === 2 ? 'back_forward' : type === 1 ? 'reload' : 'navigate',
        };
        for (var key in timing) {
            if (key !== 'navigationStart' && key !== 'toJSON') {
                navigationEntry[key] = Math.max(timing[key] - timing.navigationStart, 0);
            }
        }
        return navigationEntry;
    };
    var defaultMaxTasks = 20;
    function assertConfig(config) {
        if (!config) {
            console.info('缺少 SDK 配置信息');
            return false;
        }
        if (!config.dsn) {
            console.info('缺少 SDK dns 配置信息');
            return false;
        }
        if (!config.appId) {
            console.info('缺少 appId 应用 ID');
            return false;
        }
        if (!config.env) {
            console.info('缺少 应用环境');
            return false;
        }
        return true;
    }
    var Reporter = /** @class */ (function () {
        function Reporter(config) {
            this.config = {};
            this.reportedEids = new Set();
            if (config)
                this.config = _assign(_assign({}, this.config), config);
            if (!Reporter.instance)
                Reporter.instance = this;
            console.log('实例化成功');
            return Reporter.instance;
        }
        /**
         * 初始化方法
         *
         * @return {*}
         * @memberof Reporter
         */
        Reporter.prototype.init = function () {
            console.log('init called');
            if (!this.config) {
                console.log('无配置信息，初始化失败');
                return false;
            }
            var _a = this.config, appId = _a.appId, env = _a.env, contentId = _a.contentId, contentName = _a.contentName, userId = _a.userId, userName = _a.userName, _b = _a.maxTasks, maxTasks = _b === void 0 ? defaultMaxTasks : _b;
            this.config.dsn = this.config.dsn || '/cus/content/octopus';
            var traceId = guid();
            if (!assertConfig(this.config)) {
                return false;
            }
            this.baseData = {
                appId: appId,
                appEnv: env,
                traceId: traceId,
                cid: contentId,
                cname: contentName,
                uid: userId,
                uname: userName,
                ua: navigator.userAgent,
                href: window.location.href,
            };
            this.storage = new Storage({ maxTasks: maxTasks });
            this.scheduler = new Scheduler({
                maxTasks: maxTasks,
                storage: this.storage,
                client: this,
            });
            this.timing();
            this.listenError();
            this.overrideFetch();
            this.overrideXHR();
            console.log('global:sdk:octopus-sdk: 初始化 成功');
            return true;
        };
        /**
         * 实例暴露给外部自定义上报的方法
         *
         * @param {ReportParams} { data, runTime }
         * @return {*}
         * @memberof Reporter
         */
        Reporter.prototype.report = function (_a) {
            var _this_1 = this;
            var data = _a.data, runTime = _a.runTime;
            var _runTime = runTime || 'delay';
            if (!data)
                return;
            var pkgData = [];
            if (Array.isArray(data)) {
                if (!data.length)
                    return;
                pkgData = data;
            }
            else {
                pkgData = [data];
            }
            pkgData.forEach(function (o) {
                return [Eid.jsException, Eid.performance, Eid.requestException, Eid.resourceException].includes(o.eid) &&
                    _this_1.reportedEids.add(o.eid);
            });
            pkgData = pkgData.map(function (o) { return (_assign(_assign({}, o), { t: Math.floor(+new Date() / 1000) })); });
            if (_runTime === 'delay') {
                var overflow = this.storage.push(pkgData);
                if (overflow)
                    this.scheduler.consume();
            }
            else if (_runTime === 'immediately') {
                this.immediate(pkgData);
            }
        };
        /**
         * 无需等待, 立即上报一个任务
         *
         * @param {IData} data
         * @return {*}
         * @memberof Schedule
         */
        Reporter.prototype.immediate = function (data) {
            this.send(_assign(_assign({}, this.baseData), { list: data }), {
                url: "".concat(this.config.dsn, "/report"),
            });
        };
        /**
         * 更新配置,同时更新已上报数据
         * @param config
         */
        Reporter.prototype.updateConfig = function (config) {
            var contentId = config.contentId, contentName = config.contentName, userId = config.userId, userName = config.userName;
            var params = {};
            if (contentId) {
                params.cid = contentId;
            }
            if (contentName)
                params.cname = contentName;
            if (userId)
                params.uid = userId;
            if (userName)
                params.uname = userName;
            this.baseData = _assign(_assign({}, this.baseData), params);
            if (!this.reportedEids.size)
                return;
            this.send(_assign({ appId: this.baseData.appId, traceId: this.baseData.traceId, eids: Array.from(this.reportedEids) }, params), { url: "".concat(this.config.dsn, "/report/update") });
        };
        /**
         * 接口上报数据
         *
         * @param {any} data
         * @param {boolean} [sync=false]
         * @return {*}
         * @memberof Browser
         */
        Reporter.prototype.send = function (data, config, sync) {
            if (sync === void 0) { sync = false; }
            var _a = (config || {}).url, url = _a === void 0 ? '/' : _a;
            var body = JSON.stringify(data);
            if (typeof navigator.sendBeacon === 'function') {
                return Promise.resolve(navigator.sendBeacon(url, body));
            }
            if (typeof fetch === 'function') {
                return fetch(url, {
                    method: 'POST',
                    keepalive: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: body,
                }).then(function () {
                    return true;
                });
            }
            return new Promise(function (r, j) {
                var XHR = new XMLHttpRequest();
                XHR.setRequestHeader('content-type', 'application/json');
                XHR.addEventListener('load', function () {
                    r(true);
                });
                XHR.addEventListener('error', function () {
                    j();
                });
                XHR.open('POST', url, !sync);
                XHR.send(body);
            });
        };
        /**
         * XHR劫持
         *
         * @return {*}
         * @memberof Browser
         */
        Reporter.prototype.overrideXHR = function () {
            if (!XMLHttpRequest)
                return;
            var _this = this;
            var _open = XMLHttpRequest.prototype.open;
            var _send = XMLHttpRequest.prototype.send;
            // @ts-ignore
            XMLHttpRequest.prototype.open = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _a = args, method = _a[0], url = _a[1];
                var startTime = Math.floor(Date.now() / 1000);
                this.reporterCollect = _assign(_assign({}, this.reporterCollect), { method: method, url: typeof url === 'string' ? url : url.toString(), startTime: startTime });
                _open.apply(this, args);
            };
            XMLHttpRequest.prototype.send = function () {
                var _this_1 = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this.addEventListener('loadend', function () {
                    var endTime = Math.floor(Date.now() / 1000);
                    var _a = _this_1, status = _a.status, statusText = _a.statusText;
                    if (status > 200 || !status) {
                        _this_1.reporterCollect = _assign(_assign({}, _this_1.reporterCollect), { endTime: endTime, status: String(status), statusText: statusText });
                        var url = _this_1.reporterCollect.url;
                        if (url.toString().indexOf(_this.config.dsn) !== -1) {
                            return;
                        }
                        _this.report({
                            data: _assign({ eid: Eid.requestException }, _this_1.reporterCollect),
                        });
                    }
                });
                _send.apply(this, args);
            };
        };
        /**
         * fetch 劫持
         *
         * @return {*}
         * @memberof Browser
         */
        Reporter.prototype.overrideFetch = function () {
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
                var startTime = Math.floor(Date.now() / 1000);
                var url = args[0];
                var config = args[1];
                var _a = (config || {}).method, method = _a === void 0 ? 'GET' : _a;
                var reportData = {
                    url: url,
                    startTime: startTime,
                    method: method,
                    type: 'fetch',
                };
                if (url.toString().indexOf(_this.config.dsn) !== -1)
                    return originFetch.apply(window, args);
                return originFetch
                    .apply(window, args)
                    .then(function (result) {
                    var status = result.status, statusText = result.statusText;
                    if (status && status > 300) {
                        var endTime = Math.floor(Date.now() / 1000);
                        Object.assign(reportData, {
                            status: String(status),
                            statusText: statusText,
                            endTime: endTime,
                        });
                        _this.report({
                            data: _assign({ eid: Eid.requestException }, reportData),
                        });
                    }
                    return result;
                })
                    .catch(function (error) {
                    var endTime = Date.now();
                    var name = error.name, message = error.message;
                    Object.assign(reportData, { name: name, message: message });
                    reportData.endTime = endTime;
                    _this.report({
                        data: _assign({ eid: Eid.requestException }, reportData),
                    });
                    return error;
                });
            };
        };
        /**
         * Js 异常捕捉
         *
         * @param {Reporter} client
         * @memberof Browser
         */
        Reporter.prototype.listenError = function () {
            var _this_1 = this;
            window.addEventListener('error', function (e) {
                var _a;
                var type = e.type, error = e.error, message = e.message, colno = e.colno, filename = e.filename, lineno = e.lineno;
                // js 报错捕捉
                if (type === 'error' && filename && colno && lineno) {
                    _this_1.report({
                        data: {
                            eid: Eid.jsException,
                            name: message,
                            colno: colno,
                            message: error === null || error === void 0 ? void 0 : error.message,
                            filename: filename,
                            lineno: lineno,
                            stack: error === null || error === void 0 ? void 0 : error.stack,
                        },
                    });
                }
                else {
                    var src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.src;
                    if (type === 'error' && src) {
                        _this_1.report({
                            data: {
                                eid: Eid.resourceException,
                                src: src,
                            },
                        });
                    }
                }
            }, true);
        };
        /**
         * 性能计算入口
         * @returns
         */
        Reporter.prototype.timing = function () {
            if (!PerformanceObserver) {
                console.error('系统版本过低，无法采集性能数据');
                return;
            }
            this.navigationTiming();
            this.resourceTiming();
        };
        /**
         * 首屏性能数据采集
         *
         * @param {Reporter} client
         * @memberof Browser
         */
        Reporter.prototype.navigationTiming = function () {
            var _this_1 = this;
            var supportTypes = PerformanceObserver.supportedEntryTypes;
            var getNavigation = function () {
                if (supportTypes.includes('navigation')) {
                    var entries = performance.getEntriesByType('navigation') || [];
                    var navigation = entries[0];
                    if (navigation)
                        return navigation;
                }
                return getNavigationEntryFromPerformanceTiming();
            };
            var fcpP = new Promise(function (r) {
                if (supportTypes.includes('paint')) {
                    var observer = new PerformanceObserver(function (list) {
                        list.getEntries().forEach(function (entry) {
                            if (entry.name === 'first-contentful-paint') {
                                r(entry.startTime);
                            }
                        });
                    });
                    observer.observe({ type: 'paint', buffered: true });
                }
                else {
                    r(null);
                }
            });
            var lcpP = new Promise(function (r) {
                if (supportTypes.includes('largest-contentful-paint')) {
                    var observer = new PerformanceObserver(function (list) {
                        var entries = list.getEntries();
                        var lastEntry = entries[entries.length - 1];
                        r(lastEntry.startTime);
                    });
                    observer.observe({
                        type: 'largest-contentful-paint',
                        buffered: true,
                    });
                }
                else {
                    r(null);
                }
            });
            var loadP = new Promise(function (r) {
                window.addEventListener('load', r);
            });
            Promise.all([fcpP, lcpP, loadP]).then(function (_a) {
                var _b;
                var fcp = _a[0], lcp = _a[1];
                var navigation = getNavigation();
                var cts = navigation.connectStart, cte = navigation.connectEnd, dls = navigation.domainLookupStart, dle = navigation.domainLookupEnd, fetchStart = navigation.fetchStart, lee = navigation.loadEventEnd, les = navigation.loadEventStart, entryType = navigation.entryType, initiatorType = navigation.initiatorType, domComplete = navigation.domComplete, domInteractive = navigation.domInteractive, rqs = navigation.requestStart, rsps = navigation.responseStart, rspe = navigation.responseEnd, name = navigation.name, decodedBodySize = navigation.decodedBodySize, encodedBodySize = navigation.encodedBodySize, nextHopProtocol = navigation.nextHopProtocol, domContentLoadedEventEnd = navigation.domContentLoadedEventEnd, domContentLoadedEventStart = navigation.domContentLoadedEventStart, duration = navigation.duration, responseStart = navigation.responseStart;
                var ttfb = responseStart - fetchStart;
                if (!fcp && domContentLoadedEventEnd) {
                    fcp = domContentLoadedEventEnd;
                }
                if (!lcp) {
                    lcp = domInteractive || domComplete || fcp;
                }
                var reportData = {
                    cte: cte,
                    cts: cts,
                    dls: dls,
                    dle: dle,
                    et: entryType,
                    it: initiatorType,
                    fst: fetchStart,
                    lee: lee,
                    les: les,
                    dcle: domContentLoadedEventEnd,
                    dcls: domContentLoadedEventStart,
                    domComplete: domComplete,
                    domInteractive: domInteractive,
                    rqs: rqs,
                    rsps: rsps,
                    rspe: rspe,
                    name: name,
                    dbs: decodedBodySize,
                    ebs: encodedBodySize,
                    nhp: nextHopProtocol,
                    lcp: lcp,
                    fcp: fcp,
                    ttfb: ttfb,
                    du: duration,
                    ntype: (_b = performance.navigation) === null || _b === void 0 ? void 0 : _b.type,
                };
                Object.keys(reportData).forEach(function (key) {
                    if (typeof reportData[key] === 'number') {
                        reportData[key] = Math.round(reportData[key]);
                    }
                });
                _this_1.report({
                    runTime: 'immediately',
                    data: _assign({ eid: Eid.performance }, reportData),
                });
                console.log('首屏性能数据已上报');
            });
        };
        /**
         * 资源性能数据
         *
         * @memberof Reporter
         */
        Reporter.prototype.resourceTiming = function () {
            var _this = this;
            var supportTypes = PerformanceObserver.supportedEntryTypes;
            if (supportTypes.includes('resource')) {
                window.addEventListener('load', function () {
                    var performanceResource = performance.getEntriesByType('resource');
                    var set = new Set();
                    // 过滤重复数据
                    var tikPerformanceResource = performanceResource.reduce(function (acc, cur) {
                        var name = cur.name, duration = cur.duration, initiatorType = cur.initiatorType, fetchStart = cur.fetchStart, nextHopProtocol = cur.nextHopProtocol, decodedBodySize = cur.decodedBodySize, encodedBodySize = cur.encodedBodySize, connectStart = cur.connectStart, connectEnd = cur.connectEnd, domainLookupEnd = cur.domainLookupEnd, domainLookupStart = cur.domainLookupStart, entryType = cur.entryType, requestStart = cur.requestStart, responseEnd = cur.responseEnd, responseStart = cur.responseStart;
                        if (set.has(name))
                            return acc;
                        var obj = {
                            name: name,
                            du: duration,
                            et: entryType,
                            it: initiatorType,
                            fst: fetchStart,
                            nhp: nextHopProtocol,
                            dbs: decodedBodySize,
                            ebs: encodedBodySize,
                            cts: connectStart,
                            cte: connectEnd,
                            dle: domainLookupEnd,
                            dls: domainLookupStart,
                            rqs: requestStart,
                            rspe: responseEnd,
                            rsps: responseStart,
                            eid: Eid.performanceResource,
                        };
                        Object.keys(obj).forEach(function (key) {
                            if (typeof obj[key] === 'number') {
                                obj[key] = Math.round(obj[key]);
                            }
                        });
                        acc.push(obj);
                        set.add(name);
                        return acc;
                    }, []);
                    var tasks = tikPerformanceResource;
                    while (tasks.length) {
                        _this.report({
                            runTime: 'immediately',
                            data: tasks.slice(0, 30),
                        });
                        tasks = tasks.slice(30);
                    }
                    console.log('资源性能数据已上报');
                });
            }
            else {
                console.error('系统版本过低,无法采集资源性能数据');
            }
        };
        return Reporter;
    }());

    /*
     * 出口文件, 导出 Reporter
     *
     * @Author: 夏洁琼
     * @Date: 2023-03-29 11:01:29
     *
     * Copyright © 2014-2023 Rabbitpre.com. All Rights Reserved.
     */

    exports.default = Reporter;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
