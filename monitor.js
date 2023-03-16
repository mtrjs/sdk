(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.monitor = {}));
})(this, (function (exports) { 'use strict';

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
    var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    /**
     * 自定义事件器
     * @class EventEmitter
     */
    class EventEmitter {
        /**
         * 最近发布的一条消息
         */
        lastEmittedEvents = new Map();
        /**
         * 事件处理器
         */
        eventListeners = new Map();
        /**
         * 注册自定义事件
         * @param {EventType} type 事件类型
         * @param {EventListener<E>} listener 事件处理器
         * @param {boolean} [delayOn=false] 是否延迟订阅
         * @memberof EventEmitter
         */
        addListener(type, listener, delayOn = false) {
            if (!type || !listener)
                return;
            let listeners = this.eventListeners.get(type);
            if (!listeners) {
                listeners = [];
                this.eventListeners.set(type, listeners);
            }
            // 相同的事件不会触发多次
            if (listeners.indexOf(listener) >= 0)
                return;
            // 注册回调事件
            listeners.push(listener);
            // 对于延迟订阅者，需要立即发布一次最近发布的消息
            if (delayOn && this.lastEmittedEvents.has(type)) {
                const lastEmittedEvent = this.lastEmittedEvents.get(type);
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
        addOnceListener(type, listener, delayOn = false) {
            const onceListener = (evt) => {
                listener(evt);
                this.off(type, onceListener);
            };
            this.on(type, onceListener, delayOn);
        }
        /**
         * 注销自定义事件
         * @param {EventType} [type] 事件类型
         * @param {EventListener<E>} [listener] 事件处理器，当不指定时，表示注销所有该类型的自定义事件
         * @memberof EventEmitter
         */
        removeListener(type, listener) {
            if (!type) {
                this.removeAllListeners();
                return;
            }
            if (!listener) {
                this.eventListeners.set(type, []);
                return;
            }
            const listeners = this.listeners(type);
            for (let i = 0; i < listeners.length; i++) {
                const handler = listeners[i];
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
        removeAllListeners() {
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
        emit(type, evt) {
            if (!type)
                return;
            // 发布消息给当前所有订阅者
            const listeners = this.listeners(type);
            let count = listeners.length;
            // 当通过`once`注册的事件侦听器，在执行之后立即回收，`listeners`数组长度会缩减
            // 为了准确的执行每一个事件侦听器，需要实时根据`listeners`数组长度来迭代事件侦听器
            while (count) {
                const index = listeners.length - count;
                const listener = listeners[index];
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
        listeners(type) {
            return this.eventListeners.get(type) || [];
        }
        /**
         * 返回已注册的事件处理器数量
         * @param {EventType} type 事件类型
         * @returns {number}
         * @memberof EventEmitter
         */
        listenerCount(type) {
            return this.listeners(type).length;
        }
    }
    __decorate([
        alias('on')
    ], EventEmitter.prototype, "addListener", null);
    __decorate([
        alias('once')
    ], EventEmitter.prototype, "addOnceListener", null);
    __decorate([
        alias('off')
    ], EventEmitter.prototype, "removeListener", null);
    __decorate([
        alias('offAll')
    ], EventEmitter.prototype, "removeAllListeners", null);
    __decorate([
        alias('fire')
    ], EventEmitter.prototype, "emit", null);
    let { __globalEvent__ } = window;
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
        return (Math.random().toString(36).slice(2) + new Date().getTime().toString(36));
    }

    var name = "monitor";
    var version = "1.0.0";
    var description = "";
    var main = "index.js";
    var scripts = {
    	"build:dev": "cross-env NODE_ENV=development rollup -c",
    	build: "cross-env NODE_ENV=production rollup -c",
    	"build:watch": "cross-env NODE_ENV=development && rollup -c --watch",
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
    	"@tubit/common": "^1.5.1"
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
    class Builder {
        baseData;
        constructor(config) {
            const { appId } = config;
            const traceId = generateRandom();
            this.baseData = {
                appId,
                traceId,
                sdk: {
                    version: pkg.version,
                },
            };
        }
        build(data) {
            const { l, type } = data;
            return Object.assign({ l, type }, this.baseData);
        }
    }

    // 上报服务端地址
    const serverUrl = '';
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

    /**
     * 任务中心
     *
     * @export
     * @class Schedule
     */
    class Schedule {
        tasks;
        max;
        client;
        pending = false;
        constructor(config) {
            this.client = config.client;
            this.tasks = [];
            this.max = config.max || 10;
        }
        consumer() {
            if (this.tasks.length < this.max || this.pending)
                return;
            this.pending = true;
            this.client.$hook.emit('send', (send) => {
                const data = this.tasks.slice(0, this.max);
                console.log('send 任务发送: 数据', data);
                send(serverUrl, data)
                    .then(() => {
                    console.log('send 成功, 清除成功任务');
                    this.tasks = this.tasks.slice(this.max);
                    this.consumer();
                })
                    .finally(() => {
                    this.pending = false;
                });
            });
        }
        push(data) {
            this.tasks.push(data);
            this.consumer();
        }
        immediate(report) { }
    }

    /**
     * 浏览器端插件
     *
     * @export
     * @class Browser
     */
    class Browser {
        options;
        name = 'Browser';
        constructor(options) {
            this.options = options || {};
        }
        apply(instance) {
            instance.$hook.on('init', () => {
                console.log('init 事件触发');
                this.timing(instance);
                this.jsError(instance);
                this.promiseError(instance);
            });
            instance.$hook.on('send', (report) => {
                report(this.send);
            });
        }
        send(url, data) {
            if (typeof navigator.sendBeacon === 'function') {
                return Promise.resolve(navigator.sendBeacon(url, JSON.stringify(data)));
            }
        }
        /**
         * Js 异常捕捉
         *
         * @param {Monitor} instance
         * @memberof Browser
         */
        jsError(instance) {
            window.onerror = (event, source, lineno, colno, error) => {
                instance.$hook.emit('report', {
                    type: ReportType.ERROR,
                    l: {
                        source,
                        lineno,
                    },
                });
            };
        }
        /**
         * Promise 错误捕捉
         *
         * @param {Monitor} instance
         * @memberof Browser
         */
        promiseError(instance) {
            window.addEventListener('unhandledrejection', (e) => {
                console.log(e);
            });
        }
        /**
         * 性能数据采集
         *
         * @param {Monitor} instance
         * @memberof Browser
         */
        timing(instance) {
            let timing = {};
            // v2
            if (!!PerformanceObserver) {
                const perfObserver = (entries) => {
                    entries.getEntries().forEach((entry) => {
                        const { entryType } = entry;
                        if (entryType === 'navigation') {
                            const t = entry.toJSON();
                            Object.assign(timing, t);
                        }
                    });
                };
                const observer = new PerformanceObserver(perfObserver);
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
        }
    }

    /**
     * Core 实例
     *
     * @export
     * @class Monitor
     */
    class Monitor {
        // 事件中心
        $hook;
        // 实例配置
        options;
        // 数据包装器
        builder;
        // 事件上报中心
        schedule;
        constructor(options) {
            this.options = options;
            const { plugins = [], appId } = options;
            this.$hook = new EventEmitter();
            this.builder = new Builder({ appId });
            this.schedule = new Schedule({ max: 10, client: this });
            // 插件注册
            this.registerPlugins(plugins);
            // 派发事件
            this.addListeners();
            // 唤起 init 事件
            this.$hook.emit('init', {});
        }
        registerPlugins(plugins) {
            if (!Array.isArray(plugins))
                return;
            plugins.map((plugin) => {
                return plugin.apply(this);
            });
        }
        addListeners() {
            // 接收插件上报事件, 将任务插入调度器
            this.$hook.on('report', (data) => {
                console.log('report 事件触发, 数据:', data);
                const pkgData = this.builder.build(data);
                this.schedule.push(pkgData);
            });
        }
    }

    exports.Browser = Browser;
    exports.default = Monitor;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
