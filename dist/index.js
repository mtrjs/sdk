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
    function __spreadArray(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    }

    var name = "@mtrjs/sdk";
    var version = "1.0.1";
    var main = "dist/index.min.js";
    var scripts = {
    	build: "rollup -c --bundleConfigAsCjs",
    	"build:watch": "rollup -c --bundleConfigAsCjs --watch"
    };
    var repository = {
    	type: "git",
    	url: "git+https://github.com/mtrjs/sdk.git"
    };
    var keywords = [
    ];
    var author = "";
    var license = "ISC";
    var bugs = {
    	url: "https://github.com/mtrjs/sdk/issues"
    };
    var homepage = "https://github.com/mtrjs/sdk#readme";
    var devDependencies = {
    	"@babel/core": "^7.21.0",
    	"@babel/plugin-transform-runtime": "^7.21.0",
    	"@babel/preset-env": "^7.20.2",
    	"@babel/preset-typescript": "^7.21.0",
    	"@rollup/plugin-babel": "^6.0.3",
    	"@rollup/plugin-commonjs": "^24.0.1",
    	"@rollup/plugin-json": "^6.0.0",
    	"@rollup/plugin-node-resolve": "^15.0.1",
    	"@rollup/plugin-terser": "^0.4.0",
    	"@rollup/plugin-typescript": "^11.0.0",
    	"@types/node": "^18.14.2",
    	"cross-env": "^7.0.3",
    	emittery: "^1.0.1",
    	jest: "^29.4.3",
    	prettier: "^2.8.4",
    	rimraf: "^4.1.2",
    	rollup: "^3.17.3",
    	"rollup-plugin-clear": "^2.0.7",
    	"rollup-plugin-ts": "^3.2.0",
    	tslib: "^2.5.0",
    	typescript: "^4.9.5"
    };
    var dependencies = {
    	"@babel/runtime": "^7.21.0",
    	"core-js": "^3.29.1",
    	"web-vitals": "^3.3.1"
    };
    var types = "./dist/index.min.d.ts";
    var directories = {
    	example: "example"
    };
    var pkg = {
    	name: name,
    	version: version,
    	main: main,
    	scripts: scripts,
    	repository: repository,
    	keywords: keywords,
    	author: author,
    	license: license,
    	bugs: bugs,
    	homepage: homepage,
    	devDependencies: devDependencies,
    	dependencies: dependencies,
    	types: types,
    	directories: directories
    };

    /**
     * 计算字符串 hash 值, djb2 算法
     *
     * @export
     * @param {string} s
     * @return {*}
     */
    function getHash(s) {
        var hash = 5381;
        for (var i = 0; i < s.length; i++) {
            hash = (hash * 33 + s.charCodeAt(i)) % 0x100000000;
        }
        return hash.toString(16);
    }
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * 数据处理
     *
     * @export
     * @class Builder
     */
    var Builder = /** @class */ (function () {
        function Builder(config) {
            var appId = config.appId, env = config.env;
            var traceId = guid();
            this.cache = new Map();
            this.baseData = {
                app_id: appId,
                app_env: env,
                trace_id: traceId,
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

    var Logger = /** @class */ (function () {
        function Logger() {
        }
        Logger.prototype._log = function (level) {
        };
        Logger.prototype.log = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            console.log.apply(console, rest);
        };
        Logger.prototype.info = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            console.info.apply(console, rest);
        };
        return Logger;
    }());
    var logger = new Logger();

    var id = 0;
    /**
     * 任务中心
     *
     * @export
     * @class Schedule
     */
    var Schedule = /** @class */ (function () {
        function Schedule(config) {
            var _this = this;
            this.client = config.client;
            this.tasks = [];
            this.maxTasks = config.maxTasks;
            this.cycleTime = 8;
            this.cache = new Map();
            setInterval(function () {
                _this.consume(true);
            }, this.cycleTime * 1000);
        }
        /**
         * 任务消费
         *
         * @param {boolean} [clear] 是否清空
         * @return {*}
         * @memberof Schedule
         */
        Schedule.prototype.consume = function (clear) {
            return __awaiter(this, void 0, void 0, function () {
                var runTasks, data;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!clear && this.tasks.length < this.maxTasks)
                                return [2 /*return*/];
                            runTasks = this.tasks.slice(0, this.maxTasks);
                            this.tasks = this.tasks.slice(this.maxTasks);
                            runTasks.forEach(function (_a) {
                                var data = _a.data;
                                var hash = data.hash;
                                if (hash)
                                    _this.cache.delete(hash);
                            });
                            data = runTasks.map(function (_a) {
                                var data = _a.data;
                                return data;
                            });
                            if (!data.length)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.send(data)];
                        case 2:
                            _a.sent();
                            setTimeout(function () {
                                _this.consume();
                            }, 1000);
                            return [3 /*break*/, 4];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         *储存一个延时任务
         *
         * @param {IData} data
         * @memberof Schedule
         */
        Schedule.prototype.push = function (data) {
            var task = { id: ++id, data: data };
            var hash = data.hash;
            if (hash) {
                var cacheTask = this.cache.get(hash);
                if (cacheTask) {
                    cacheTask.data.count = (cacheTask.data.count || 1) + 1;
                    return;
                }
                this.cache.set(hash, task);
            }
            this.tasks.push(task);
            this.consume();
        };
        /**
         * 向插件发送 send 事件
         *
         * @param {IData[]} data
         * @memberof Schedule
         */
        Schedule.prototype.send = function (data) {
            this.client.$hook.emit('send', function (send) {
                logger.info('send 任务发送: 数据', data);
                return send(data).then(function (res) {
                    logger.info('send 成功!');
                    return res;
                });
            });
        };
        /**
         * 清空任务
         *
         * @memberof Schedule
         */
        Schedule.prototype.clear = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.consume(true);
                    return [2 /*return*/];
                });
            });
        };
        /**
         * 无需等待, 立即上报一个任务
         *
         * @param {IData} data
         * @return {*}
         * @memberof Schedule
         */
        Schedule.prototype.immediate = function (data) {
            return this.send([data]);
        };
        return Schedule;
    }());

    var Event = /** @class */ (function () {
        function Event() {
            this.event = new Map();
            this.maxListener = 100;
        }
        Event.prototype.on = function (type, fn) {
            var list = this.event.get(type) || [];
            if (typeof fn === 'function') {
                this.event.set(type, __spreadArray(__spreadArray([], list, true), [fn], false));
            }
        };
        Event.prototype.once = function (type, fn) {
            var _this = this;
            function newFn() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                fn.apply(void 0, args);
                _this.removeListener(type, newFn);
            }
            this.on(type, newFn);
        };
        Event.prototype.emit = function (type, params) {
            var listeners = this.event.get(type) || [];
            listeners.forEach(function (fn) { return fn(params); });
        };
        Event.prototype.setMaxListeners = function (count) {
            this.maxListener = count;
        };
        Event.prototype.listeners = function (type) {
            return this.event.get(type) || [];
        };
        Event.prototype.removeAllListener = function (type) {
            this.event.set(type, []);
        };
        Event.prototype.removeListener = function (type, listener) {
            var listeners = this.event.get(type) || [];
            listeners = listeners.filter(function (fn) { return listener !== fn; });
            this.event.set(type, listeners);
        };
        return Event;
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
    var internalPlugins = [];
    /**
     * Core 实例
     *
     * @export
     * @class Reporter
     */
    var Reporter = /** @class */ (function () {
        function Reporter(config) {
            assertConfig(config);
            this.config = config;
        }
        Reporter.prototype.init = function () {
            var _a;
            var _b = this.config, _c = _b.plugins, plugins = _c === void 0 ? [] : _c, appId = _b.appId, _d = _b.maxTasks, maxTasks = _d === void 0 ? 10 : _d, env = _b.env;
            this.builder = new Builder({ appId: appId, env: env });
            this.schedule = new Schedule({ maxTasks: maxTasks, client: this });
            this.$hook = new Event();
            // 插件注册
            this.registerPlugins(internalPlugins.concat(plugins));
            // 事件注册
            this.addListeners();
            // 唤起 init 事件
            (_a = this.$hook) === null || _a === void 0 ? void 0 : _a.emit('init', {});
            logger.info('sdk init');
        };
        /**
         * 插件注册
         *
         * @private
         * @param {IPlugin[]} plugins
         * @return {*}
         * @memberof Reporter
         */
        Reporter.prototype.registerPlugins = function (plugins) {
            var _this = this;
            if (!Array.isArray(plugins))
                return;
            plugins.map(function (plugin) {
                return plugin.apply(_this);
            });
        };
        /**
         * 挂在事件
         *
         * @private
         * @memberof Reporter
         */
        Reporter.prototype.addListeners = function () {
            var _this = this;
            var _a;
            // 接收插件上报事件, 将任务插入调度器
            (_a = this.$hook) === null || _a === void 0 ? void 0 : _a.on('report', function (_a) {
                var _b, _c, _d;
                var data = _a.data, runTime = _a.runTime;
                var _runTime = runTime || 'delay';
                logger.info('report 事件触发, 数据:', { data: data, runTime: _runTime });
                var pkgData = (_b = _this.builder) === null || _b === void 0 ? void 0 : _b.build(data);
                if (!pkgData)
                    return;
                if (_runTime === 'delay') {
                    (_c = _this.schedule) === null || _c === void 0 ? void 0 : _c.push(pkgData);
                }
                else if (_runTime === 'immediately') {
                    (_d = _this.schedule) === null || _d === void 0 ? void 0 : _d.immediate(pkgData);
                }
            });
        };
        Reporter.prototype.getReportParams = function () {
            return {
                url: "".concat(this.config.dsn, "/v1/report"),
                method: 'POST',
                headers: {},
            };
        };
        Reporter.prototype.getTasks = function () {
            return this.schedule.tasks;
        };
        Reporter.prototype.getConfig = function () {
            return this.config;
        };
        return Reporter;
    }());

    var ExceptionType;
    (function (ExceptionType) {
        ExceptionType[ExceptionType["PROMISE"] = 0] = "PROMISE";
        ExceptionType[ExceptionType["JS"] = 1] = "JS";
    })(ExceptionType || (ExceptionType = {}));
    var RequestType;
    (function (RequestType) {
        RequestType[RequestType["fetch"] = 0] = "fetch";
        RequestType[RequestType["XHR"] = 1] = "XHR";
    })(RequestType || (RequestType = {}));
    var Eid;
    (function (Eid) {
        Eid["js-exception"] = "1003";
        Eid["request-exception"] = "1004";
        Eid["console-exception"] = "1005";
        Eid["resource-exception"] = "1006";
        Eid["performance"] = "1000";
        Eid["runtime-performance"] = "1007";
    })(Eid || (Eid = {}));

    var e,
      n,
      t,
      r,
      a = -1,
      o = function o(e) {
        addEventListener("pageshow", function (n) {
          n.persisted && (a = n.timeStamp, e(n));
        }, !0);
      },
      c = function c() {
        return window.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
      },
      u = function u() {
        var e = c();
        return e && e.activationStart || 0;
      },
      f = function f(e, n) {
        var t = c(),
          r = "navigate";
        return a >= 0 ? r = "back-forward-cache" : t && (r = document.prerendering || u() > 0 ? "prerender" : document.wasDiscarded ? "restore" : t.type.replace(/_/g, "-")), {
          name: e,
          value: void 0 === n ? -1 : n,
          rating: "good",
          delta: 0,
          entries: [],
          id: "v3-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12),
          navigationType: r
        };
      },
      s = function s(e, n, t) {
        try {
          if (PerformanceObserver.supportedEntryTypes.includes(e)) {
            var r = new PerformanceObserver(function (e) {
              Promise.resolve().then(function () {
                n(e.getEntries());
              });
            });
            return r.observe(Object.assign({
              type: e,
              buffered: !0
            }, t || {})), r;
          }
        } catch (e) {}
      },
      d = function d(e, n, t, r) {
        var i, a;
        return function (o) {
          n.value >= 0 && (o || r) && ((a = n.value - (i || 0)) || void 0 === i) && (i = n.value, n.delta = a, n.rating = function (e, n) {
            return e > n[1] ? "poor" : e > n[0] ? "needs-improvement" : "good";
          }(n.value, t), e(n));
        };
      },
      l = function l(e) {
        requestAnimationFrame(function () {
          return requestAnimationFrame(function () {
            return e();
          });
        });
      },
      p = function p(e) {
        var n = function n(_n) {
          "pagehide" !== _n.type && "hidden" !== document.visibilityState || e(_n);
        };
        addEventListener("visibilitychange", n, !0), addEventListener("pagehide", n, !0);
      },
      v = function v(e) {
        var n = !1;
        return function (t) {
          n || (e(t), n = !0);
        };
      },
      m = -1,
      h = function h() {
        return "hidden" !== document.visibilityState || document.prerendering ? 1 / 0 : 0;
      },
      g = function g(e) {
        "hidden" === document.visibilityState && m > -1 && (m = "visibilitychange" === e.type ? e.timeStamp : 0, T());
      },
      y = function y() {
        addEventListener("visibilitychange", g, !0), addEventListener("prerenderingchange", g, !0);
      },
      T = function T() {
        removeEventListener("visibilitychange", g, !0), removeEventListener("prerenderingchange", g, !0);
      },
      E = function E() {
        return m < 0 && (m = h(), y(), o(function () {
          setTimeout(function () {
            m = h(), y();
          }, 0);
        })), {
          get firstHiddenTime() {
            return m;
          }
        };
      },
      C = function C(e) {
        document.prerendering ? addEventListener("prerenderingchange", function () {
          return e();
        }, !0) : e();
      },
      L = [1800, 3e3],
      b = function b(e, n) {
        n = n || {}, C(function () {
          var t,
            r = E(),
            i = f("FCP"),
            a = s("paint", function (e) {
              e.forEach(function (e) {
                "first-contentful-paint" === e.name && (a.disconnect(), e.startTime < r.firstHiddenTime && (i.value = Math.max(e.startTime - u(), 0), i.entries.push(e), t(!0)));
              });
            });
          a && (t = d(e, i, L, n.reportAllChanges), o(function (r) {
            i = f("FCP"), t = d(e, i, L, n.reportAllChanges), l(function () {
              i.value = performance.now() - r.timeStamp, t(!0);
            });
          }));
        });
      },
      w = [.1, .25],
      S = function S(e, n) {
        n = n || {}, b(v(function () {
          var t,
            r = f("CLS", 0),
            i = 0,
            a = [],
            c = function c(e) {
              e.forEach(function (e) {
                if (!e.hadRecentInput) {
                  var n = a[0],
                    t = a[a.length - 1];
                  i && e.startTime - t.startTime < 1e3 && e.startTime - n.startTime < 5e3 ? (i += e.value, a.push(e)) : (i = e.value, a = [e]);
                }
              }), i > r.value && (r.value = i, r.entries = a, t());
            },
            u = s("layout-shift", c);
          u && (t = d(e, r, w, n.reportAllChanges), p(function () {
            c(u.takeRecords()), t(!0);
          }), o(function () {
            i = 0, r = f("CLS", 0), t = d(e, r, w, n.reportAllChanges), l(function () {
              return t();
            });
          }), setTimeout(t, 0));
        }));
      },
      A = {
        passive: !0,
        capture: !0
      },
      I = new Date(),
      P = function P(r, i) {
        e || (e = i, n = r, t = new Date(), k(removeEventListener), F());
      },
      F = function F() {
        if (n >= 0 && n < t - I) {
          var i = {
            entryType: "first-input",
            name: e.type,
            target: e.target,
            cancelable: e.cancelable,
            startTime: e.timeStamp,
            processingStart: e.timeStamp + n
          };
          r.forEach(function (e) {
            e(i);
          }), r = [];
        }
      },
      M = function M(e) {
        if (e.cancelable) {
          var n = (e.timeStamp > 1e12 ? new Date() : performance.now()) - e.timeStamp;
          "pointerdown" == e.type ? function (e, n) {
            var t = function t() {
                P(e, n), i();
              },
              r = function r() {
                i();
              },
              i = function i() {
                removeEventListener("pointerup", t, A), removeEventListener("pointercancel", r, A);
              };
            addEventListener("pointerup", t, A), addEventListener("pointercancel", r, A);
          }(n, e) : P(n, e);
        }
      },
      k = function k(e) {
        ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function (n) {
          return e(n, M, A);
        });
      },
      D = [100, 300],
      x = function x(t, i) {
        i = i || {}, C(function () {
          var a,
            c = E(),
            u = f("FID"),
            l = function l(e) {
              e.startTime < c.firstHiddenTime && (u.value = e.processingStart - e.startTime, u.entries.push(e), a(!0));
            },
            m = function m(e) {
              e.forEach(l);
            },
            h = s("first-input", m);
          a = d(t, u, D, i.reportAllChanges), h && p(v(function () {
            m(h.takeRecords()), h.disconnect();
          })), h && o(function () {
            var o;
            u = f("FID"), a = d(t, u, D, i.reportAllChanges), r = [], n = -1, e = null, k(addEventListener), o = l, r.push(o), F();
          });
        });
      },
      U = [2500, 4e3],
      V = {},
      W = function W(e, n) {
        n = n || {}, C(function () {
          var t,
            r = E(),
            i = f("LCP"),
            a = function a(e) {
              var n = e[e.length - 1];
              n && n.startTime < r.firstHiddenTime && (i.value = Math.max(n.startTime - u(), 0), i.entries = [n], t());
            },
            c = s("largest-contentful-paint", a);
          if (c) {
            t = d(e, i, U, n.reportAllChanges);
            var m = v(function () {
              V[i.id] || (a(c.takeRecords()), c.disconnect(), V[i.id] = !0, t(!0));
            });
            ["keydown", "click"].forEach(function (e) {
              addEventListener(e, m, !0);
            }), p(m), o(function (r) {
              i = f("LCP"), t = d(e, i, U, n.reportAllChanges), l(function () {
                i.value = performance.now() - r.timeStamp, V[i.id] = !0, t(!0);
              });
            });
          }
        });
      },
      X = [800, 1800],
      Y = function e(n) {
        document.prerendering ? C(function () {
          return e(n);
        }) : "complete" !== document.readyState ? addEventListener("load", function () {
          return e(n);
        }, !0) : setTimeout(n, 0);
      },
      Z = function Z(e, n) {
        n = n || {};
        var t = f("TTFB"),
          r = d(e, t, X, n.reportAllChanges);
        Y(function () {
          var i = c();
          if (i) {
            var a = i.responseStart;
            if (a <= 0 || a > performance.now()) return;
            t.value = Math.max(a - u(), 0), t.entries = [i], r(!0), o(function () {
              t = f("TTFB", 0), (r = d(e, t, X, n.reportAllChanges))(!0);
            });
          }
        });
      };

    var indicators = [
        'navigationStart',
        'unloadEventStart',
        'unloadEventEnd',
        'navigationStart',
        'redirectStart',
        'redirectEnd',
        'fetchStart',
        'domainLookupStart',
        'domainLookupEnd',
        'connectStart',
        'secureConnectionStart',
        'connectEnd',
        'requestStart',
        'responseStart',
        'responseEnd',
        'domLoading',
        'domInteractive',
        'domContentLoadedEventEnd',
        'domContentLoadedEventStart',
        'domComplete',
        'loadEventStart',
        'loadEventEnd',
    ];
    function formatTiming(timing) {
        var t = {
            redirectCount: timing.redirectCount,
        };
        indicators.forEach(function (key) {
            t[key] = Number((timing[key] || 0).toFixed(2));
        });
        return t;
    }
    /**
     * 往上报数据中注入 hash 值
     *
     * @param {LData} data
     * @return {*}
     */
    function injectHash(data) {
        var eid = data.eid, l = data.l;
        var hash;
        if (eid === Eid['js-exception']) {
            var _a = l.name, name_1 = _a === void 0 ? '' : _a, _b = l.stack, stack = _b === void 0 ? '' : _b, _c = l.message, message = _c === void 0 ? '' : _c, _d = l.colno, colno = _d === void 0 ? '' : _d, _e = l.filename, filename = _e === void 0 ? '' : _e, _f = l.lineno, lineno = _f === void 0 ? '' : _f;
            hash = getHash(name_1 + stack + message + colno + lineno + filename);
        }
        else if (eid === Eid['resource-exception']) {
            var src = l.src;
            hash = getHash(src);
        }
        return hash;
    }
    /**
     * 浏览器端插件
     *
     * @export
     * @class Browser
     */
    var Browser = /** @class */ (function () {
        function Browser() {
            this.name = 'Browser';
        }
        Browser.prototype.apply = function (client) {
            var _this_1 = this;
            this.client = client;
            if (!window && !document)
                return;
            client.$hook.on('init', function () {
                _this_1.timing();
                _this_1.listenError();
                _this_1.promiseError();
                _this_1.overrideFetch();
                _this_1.overrideXHR();
                _this_1.hijackConsole();
                // this.runTimePerformance();
            });
            client.$hook.on('send', function (report) {
                requestIdleCallback(function () { return report(_this_1.send.bind(_this_1)); });
            });
            // 特殊处理, 刷新或者离开页面前保证缓存的数据能够上报
            document.addEventListener('visibilitychange', function () {
                var tasks = client.getTasks();
                if (!tasks.length)
                    return;
                var data = tasks.map(function (_a) {
                    var data = _a.data;
                    return data;
                });
                _this_1.send(data, true);
            });
        };
        /**
         * 接口上报数据
         *
         * @param {IData[]} data
         * @param {boolean} [sync=false]
         * @return {*}
         * @memberof Browser
         */
        Browser.prototype.send = function (data, sync) {
            if (sync === void 0) { sync = false; }
            var _a = this.client.getReportParams(), url = _a.url, method = _a.method;
            var formData = new FormData();
            formData.append('data', JSON.stringify(data));
            if (typeof navigator.sendBeacon === 'function') {
                return Promise.resolve(navigator.sendBeacon(url, formData));
            }
            if (typeof fetch === 'function') {
                return fetch(url, { method: method, keepalive: true }).then(function () {
                    return true;
                });
            }
            return new Promise(function (r, j) {
                var XHR = new XMLHttpRequest();
                XHR.addEventListener('load', function () {
                    r(true);
                });
                XHR.addEventListener('error', function () {
                    j();
                });
                XHR.open(method, url, !sync);
                XHR.send(formData);
            });
        };
        /**
         * 内部使用的report方法, 用来注入一些插件内公共参数
         *
         * @param {ReportParams} body
         * @memberof Browser
         */
        Browser.prototype.report = function (body) {
            var _a;
            var data = body.data;
            var hash = injectHash(data);
            var eid = data.eid, l = data.l;
            var ua = navigator.userAgent;
            (_a = this.client) === null || _a === void 0 ? void 0 : _a.$hook.emit('report', _assign(_assign({}, body), { data: {
                    eid: eid,
                    hash: hash,
                    l: _assign(_assign({}, l), { ua: ua, href: window.location.href }),
                } }));
        };
        /**
         * XHR劫持
         *
         * @return {*}
         * @memberof Browser
         */
        Browser.prototype.overrideXHR = function () {
            if (!XMLHttpRequest)
                return;
            var _this = this;
            var _open = XMLHttpRequest.prototype.open;
            var _send = XMLHttpRequest.prototype.send;
            var _setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
            XMLHttpRequest.prototype.setRequestHeader = function () {
                var _a, _b;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // 获取最后一个请求信息对象
                var headers = (_b = (_a = this.reporterCollect) === null || _a === void 0 ? void 0 : _a.headers) !== null && _b !== void 0 ? _b : {};
                var _c = args || [], header = _c[0], value = _c[1];
                headers[header] = value;
                this.reporterCollect = _assign(_assign({}, this.reporterCollect), { headers: headers });
                // 调用原始 setRequestHeader 方法
                _setRequestHeader.apply(this, args);
            };
            XMLHttpRequest.prototype.open = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _a = args, method = _a[0], url = _a[1];
                var startTime = Date.now();
                this.reporterCollect = _assign(_assign({}, this.reporterCollect), { method: method, url: typeof url === 'string' ? url : url.toString(), startTime: startTime, type: RequestType.XHR });
                _open.apply(this, args);
            };
            XMLHttpRequest.prototype.send = function () {
                var _this_1 = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var body = (args || [])[0];
                this.addEventListener('loadend', function () {
                    var endTime = Date.now();
                    var _a = _this_1, status = _a.status, statusText = _a.statusText;
                    if (status > 200 || !status) {
                        _this_1.reporterCollect = _assign(_assign({}, _this_1.reporterCollect), { endTime: endTime, status: String(status), statusText: statusText, body: body });
                        var headers = _this_1.reporterCollect.headers;
                        _this.report({
                            data: {
                                eid: Eid['request-exception'],
                                l: _assign(_assign({}, _this_1.reporterCollect), { headers: JSON.stringify(headers) }),
                            },
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
                        Object.assign(reportData, {
                            status: String(status),
                            statusText: statusText,
                            endTime: endTime,
                        });
                        _this.report({
                            data: { eid: Eid['request-exception'], l: reportData },
                        });
                    }
                    return result;
                })
                    .catch(function (error) {
                    var endTime = Date.now();
                    var name = error.name, message = error.message, stack = error.stack;
                    Object.assign(reportData, { name: name, message: message, stack: stack });
                    reportData.endTime = endTime;
                    _this.report({
                        data: {
                            eid: Eid['request-exception'],
                            l: reportData,
                        },
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
        Browser.prototype.listenError = function () {
            var _this_1 = this;
            window.addEventListener('error', function (e) {
                var _a;
                var type = e.type, error = e.error, message = e.message, colno = e.colno, filename = e.filename, lineno = e.lineno;
                // js 报错捕捉
                if (type === 'error' && filename && colno && lineno) {
                    _this_1.report({
                        data: {
                            eid: Eid['js-exception'],
                            l: {
                                name: message,
                                colno: colno,
                                message: error === null || error === void 0 ? void 0 : error.message,
                                filename: filename,
                                lineno: lineno,
                                stack: error === null || error === void 0 ? void 0 : error.stack,
                            },
                        },
                    });
                }
                else {
                    var src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.src;
                    if (type === 'error' && src) {
                        _this_1.report({
                            data: {
                                eid: Eid['resource-exception'],
                                l: {
                                    src: src,
                                },
                            },
                        });
                    }
                }
            }, true);
        };
        /**
         * Promise 错误捕捉
         *
         * @param {Reporter} client
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
                if (reason instanceof Error) {
                    var name_2 = reason.name, stack = reason.stack, message = reason.message;
                    reportData.message = message;
                    reportData.stack = stack || '';
                    reportData.name = name_2;
                }
                else {
                    reportData.message = reason;
                    reportData.name = reason;
                }
                _this_1.report({
                    data: {
                        eid: Eid['js-exception'],
                        l: _assign({ type: ExceptionType.PROMISE }, reportData),
                    },
                });
            });
        };
        /**
         * 性能数据采集
         *
         * @param {Reporter} client
         * @memberof Browser
         */
        Browser.prototype.timing = function () {
            var _this_1 = this;
            // v2
            if (PerformanceObserver) {
                var observeTiming_1 = {
                    fcp: 0,
                    lcp: 0,
                    cls: null,
                    ttfb: 0,
                };
                var navigationP = new Promise(function (r) {
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
                var loadPromiseUnLock_1 = function () { };
                var loadPromise = new Promise(function (r) {
                    loadPromiseUnLock_1 = r;
                });
                W(function (metric) {
                    observeTiming_1.lcp = metric.value;
                }, {
                    reportAllChanges: true,
                });
                var fcpP = new Promise(function (r) {
                    b(function (metric) {
                        observeTiming_1.fcp = metric.value;
                        r();
                    });
                });
                S(function (metric) {
                    observeTiming_1.cls = metric.value;
                }, { reportAllChanges: true });
                var fid_1;
                x(function (metric) {
                    fid_1 = metric.value;
                });
                var ttfbP = new Promise(function (r) {
                    Z(function (metric) {
                        observeTiming_1.ttfb = metric.value;
                        r();
                    });
                });
                setTimeout(function () {
                    loadPromiseUnLock_1();
                }, 12000);
                window.addEventListener('load', function () {
                    loadPromiseUnLock_1();
                });
                Promise.all([navigationP, loadPromise, fcpP, ttfbP]).then(function (_a) {
                    var navigation = _a[0];
                    navigation = formatTiming(navigation);
                    var lcp = observeTiming_1.lcp, fcp = observeTiming_1.fcp, ttfb = observeTiming_1.ttfb, cls = observeTiming_1.cls;
                    _this_1.report({
                        runTime: 'immediately',
                        data: {
                            eid: Eid.performance,
                            l: _assign(_assign({}, navigation), { lcp: lcp && Number(lcp.toFixed(2)), fcp: fcp && Number(fcp.toFixed(2)), fid: fid_1 && Number(fid_1.toFixed(2)), cls: cls && Number(cls.toFixed(2)), ttfb: ttfb && Number(ttfb.toFixed(2)) }),
                        },
                    });
                });
            }
            else {
                window.addEventListener('load', function () {
                    var _a = performance.timing, navigationStart = _a.navigationStart, unloadEventStart = _a.unloadEventStart;
                    var redirectCount = performance.navigation.redirectCount;
                    var startAt = Math.min(navigationStart, unloadEventStart) || 0;
                    var originTiming = _assign(_assign({}, performance.timing), performance.navigation);
                    var timing = {
                        redirectCount: redirectCount,
                    };
                    indicators.forEach(function (key, index) {
                        if (originTiming[key] > 0) {
                            originTiming[key] -= startAt;
                        }
                        else {
                            originTiming[key] = index === 0 ? 0 : originTiming[indicators[index - 1]];
                        }
                        timing[key] = originTiming[key];
                    });
                    _this_1.report({
                        runTime: 'immediately',
                        data: { eid: Eid.performance, l: timing },
                    });
                });
            }
        };
        Browser.prototype.hijackConsole = function () {
            var _this = this;
            var _err = console.error;
            console.error = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var messages = '';
                try {
                    messages = JSON.stringify(args.map(function (arg) {
                        if (typeof arg === 'string')
                            return arg;
                        if (arg instanceof Error)
                            return arg.message;
                        return String(arg);
                    }));
                }
                catch (error) {
                    /* empty */
                }
                _this.report({
                    data: {
                        eid: Eid['console-exception'],
                        l: {
                            messages: messages,
                            type: 'error',
                        },
                    },
                });
                _err.apply(this, args);
            };
        };
        /**
         * 运行时性能计算
         *
         * @memberof Browser
         */
        Browser.prototype.runTimePerformance = function () {
            var _this_1 = this;
            var fpsStore = [];
            var memoryStore = [];
            var calFps = function () {
                var lastTime = 0;
                var frameCount = 0;
                var _calFps = function (currentTime) {
                    if (lastTime === 0) {
                        lastTime = currentTime;
                    }
                    frameCount++;
                    if (currentTime - lastTime >= 1000) {
                        var fps = frameCount;
                        frameCount = 0;
                        lastTime = currentTime;
                        fpsStore.push(fps);
                    }
                    requestAnimationFrame(_calFps);
                };
                requestAnimationFrame(_calFps);
            };
            var calMemory = function () {
                setInterval(function () {
                    var memory = performance === null || performance === void 0 ? void 0 : performance.memory;
                    memory && memoryStore.push(memory);
                }, 1000);
            };
            window.addEventListener('load', function () {
                calFps();
                calMemory();
                setInterval(function () {
                    if (!fpsStore.length)
                        return;
                    console.log(memoryStore);
                    var fps = fpsStore.reduce(function (acc, cur) { return acc + cur; }, 0) / fpsStore.length;
                    fpsStore = [];
                    memoryStore = [];
                    _this_1.report({
                        data: {
                            eid: Eid['runtime-performance'],
                            l: {
                                fps: fps,
                            },
                        },
                    });
                }, 8000);
            });
        };
        return Browser;
    }());

    exports.Browser = Browser;
    exports.default = Reporter;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
